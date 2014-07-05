/*
 * (c) Copyright Ascensio System SIA 2010-2014
 *
 * This program is a free software product. You can redistribute it and/or 
 * modify it under the terms of the GNU Affero General Public License (AGPL) 
 * version 3 as published by the Free Software Foundation. In accordance with 
 * Section 7(a) of the GNU AGPL its Section 15 shall be amended to the effect 
 * that Ascensio System SIA expressly excludes the warranty of non-infringement
 * of any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied 
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For 
 * details, see the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia,
 * EU, LV-1021.
 *
 * The  interactive user interfaces in modified source and object code versions
 * of the Program must display Appropriate Legal Notices, as required under 
 * Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product
 * logo when distributing the program. Pursuant to Section 7(e) we decline to
 * grant you any rights under trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as
 * well as technical writing content are licensed under the terms of the
 * Creative Commons Attribution-ShareAlike 4.0 International. See the License
 * terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 */
 function NewShapeTrack(drawingObjects, presetGeom, startX, startY) {
    this.drawingObjects = drawingObjects;
    this.presetGeom = presetGeom;
    this.startX = startX;
    this.startY = startY;
    this.x = null;
    this.y = null;
    this.extX = null;
    this.extY = null;
    this.arrowsCount = 0;
    this.transform = new CMatrix();
    var theme = drawingObjects.Layout.Master.Theme;
    var style;
    if (presetGeom !== "textRect") {
        style = CreateDefaultShapeStyle();
    } else {
        style = CreateDefaultTextRectStyle();
    }
    var brush = theme.getFillStyle(style.fillRef.idx);
    style.fillRef.Color.Calculate(theme, drawingObjects, drawingObjects.Layout, drawingObjects.Layout.Master, {
        R: 0,
        G: 0,
        B: 0,
        A: 255
    });
    var RGBA = style.fillRef.Color.RGBA;
    if (style.fillRef.Color.color != null) {
        if (brush.fill != null && (brush.fill.type == FILL_TYPE_SOLID)) {
            brush.fill.color = style.fillRef.Color.createDuplicate();
        }
    }
    var pen = theme.getLnStyle(style.lnRef.idx);
    style.lnRef.Color.Calculate(theme, drawingObjects, drawingObjects.Layout, drawingObjects.Layout.Master);
    RGBA = style.lnRef.Color.RGBA;
    if (presetGeom === "textRect") {
        var ln, fill;
        ln = new CLn();
        ln.w = 6350;
        ln.Fill = new CUniFill();
        ln.Fill.fill = new CSolidFill();
        ln.Fill.fill.color = new CUniColor();
        ln.Fill.fill.color.color = new CPrstColor();
        ln.Fill.fill.color.color.id = "black";
        fill = new CUniFill();
        fill.fill = new CSolidFill();
        fill.fill.color = new CUniColor();
        fill.fill.color.color = new CSchemeColor();
        fill.fill.color.color.id = 12;
        pen.merge(ln);
        brush.merge(fill);
    }
    if (presetGeom.indexOf("WithArrow") > -1) {
        presetGeom = presetGeom.substr(0, presetGeom.length - 9);
        this.presetGeom = presetGeom;
        this.arrowsCount = 1;
    }
    if (presetGeom.indexOf("WithTwoArrows") > -1) {
        presetGeom = presetGeom.substr(0, presetGeom.length - 13);
        this.presetGeom = presetGeom;
        this.arrowsCount = 2;
    }
    var geometry = CreateGeometry(presetGeom !== "textRect" ? presetGeom : "rect");
    geometry.Init(5, 5);
    pen.Fill.calculate(theme, drawingObjects, drawingObjects.Layout, drawingObjects.Layout.Master, RGBA);
    brush.calculate(theme, drawingObjects, drawingObjects.Layout, drawingObjects.Layout.Master, RGBA);
    this.isLine = this.presetGeom === "line";
    this.overlayObject = new OverlayObject(geometry, 5, 5, brush, pen, this.transform);
    this.shape = null;
    this.track = function (e, x, y) {
        var real_dist_x = x - this.startX;
        var abs_dist_x = Math.abs(real_dist_x);
        var real_dist_y = y - this.startY;
        var abs_dist_y = Math.abs(real_dist_y);
        this.flipH = false;
        this.flipV = false;
        if (this.isLine) {
            if (x < this.startX) {
                this.flipH = true;
            }
            if (y < this.startY) {
                this.flipV = true;
            }
        }
        if (! (e.CtrlKey || e.ShiftKey) || (e.CtrlKey && !e.ShiftKey && this.isLine)) {
            this.extX = abs_dist_x >= MIN_SHAPE_SIZE ? abs_dist_x : (this.isLine ? 0 : MIN_SHAPE_SIZE);
            this.extY = abs_dist_y >= MIN_SHAPE_SIZE ? abs_dist_y : (this.isLine ? 0 : MIN_SHAPE_SIZE);
            if (real_dist_x >= 0) {
                this.x = this.startX;
            } else {
                this.x = abs_dist_x >= MIN_SHAPE_SIZE ? x : this.startX - this.extX;
            }
            if (real_dist_y >= 0) {
                this.y = this.startY;
            } else {
                this.y = abs_dist_y >= MIN_SHAPE_SIZE ? y : this.startY - this.extY;
            }
        } else {
            if (e.CtrlKey && !e.ShiftKey) {
                if (abs_dist_x >= MIN_SHAPE_SIZE_DIV2) {
                    this.x = this.startX - abs_dist_x;
                    this.extX = 2 * abs_dist_x;
                } else {
                    this.x = this.startX - MIN_SHAPE_SIZE_DIV2;
                    this.extX = MIN_SHAPE_SIZE;
                }
                if (abs_dist_y >= MIN_SHAPE_SIZE_DIV2) {
                    this.y = this.startY - abs_dist_y;
                    this.extY = 2 * abs_dist_y;
                } else {
                    this.y = this.startY - MIN_SHAPE_SIZE_DIV2;
                    this.extY = MIN_SHAPE_SIZE;
                }
            } else {
                if (!e.CtrlKey && e.ShiftKey) {
                    var new_width, new_height;
                    var prop_coefficient = (typeof SHAPE_ASPECTS[this.presetGeom] === "number" ? SHAPE_ASPECTS[this.presetGeom] : 1);
                    if (abs_dist_y === 0) {
                        new_width = abs_dist_x > MIN_SHAPE_SIZE ? abs_dist_x : MIN_SHAPE_SIZE;
                        new_height = abs_dist_x / prop_coefficient;
                    } else {
                        var new_aspect = abs_dist_x / abs_dist_y;
                        if (new_aspect >= prop_coefficient) {
                            new_width = abs_dist_x;
                            new_height = abs_dist_x / prop_coefficient;
                        } else {
                            new_height = abs_dist_y;
                            new_width = abs_dist_y * prop_coefficient;
                        }
                    }
                    if (new_width < MIN_SHAPE_SIZE || new_height < MIN_SHAPE_SIZE) {
                        var k_wh = new_width / new_height;
                        if (new_height < MIN_SHAPE_SIZE && new_width < MIN_SHAPE_SIZE) {
                            if (new_height < new_width) {
                                new_height = MIN_SHAPE_SIZE;
                                new_width = new_height * k_wh;
                            } else {
                                new_width = MIN_SHAPE_SIZE;
                                new_height = new_width / k_wh;
                            }
                        } else {
                            if (new_height < MIN_SHAPE_SIZE) {
                                new_height = MIN_SHAPE_SIZE;
                                new_width = new_height * k_wh;
                            } else {
                                new_width = MIN_SHAPE_SIZE;
                                new_height = new_width / k_wh;
                            }
                        }
                    }
                    this.extX = new_width;
                    this.extY = new_height;
                    if (real_dist_x >= 0) {
                        this.x = this.startX;
                    } else {
                        this.x = this.startX - this.extX;
                    }
                    if (real_dist_y >= 0) {
                        this.y = this.startY;
                    } else {
                        this.y = this.startY - this.extY;
                    }
                    if (this.isLine) {
                        var angle = Math.atan2(real_dist_y, real_dist_x);
                        if (angle >= 0 && angle <= Math.PI / 8 || angle <= 0 && angle >= -Math.PI / 8 || angle >= 7 * Math.PI / 8 && angle <= Math.PI) {
                            this.extY = 0;
                            this.y = this.startY;
                        } else {
                            if (angle >= 3 * Math.PI / 8 && angle <= 5 * Math.PI / 8 || angle <= -3 * Math.PI / 8 && angle >= -5 * Math.PI / 8) {
                                this.extX = 0;
                                this.x = this.startX;
                            }
                        }
                    }
                } else {
                    var new_width, new_height;
                    var prop_coefficient = (typeof SHAPE_ASPECTS[this.presetGeom] === "number" ? SHAPE_ASPECTS[this.presetGeom] : 1);
                    if (abs_dist_y === 0) {
                        new_width = abs_dist_x > MIN_SHAPE_SIZE_DIV2 ? abs_dist_x * 2 : MIN_SHAPE_SIZE;
                        new_height = new_width / prop_coefficient;
                    } else {
                        var new_aspect = abs_dist_x / abs_dist_y;
                        if (new_aspect >= prop_coefficient) {
                            new_width = abs_dist_x * 2;
                            new_height = new_width / prop_coefficient;
                        } else {
                            new_height = abs_dist_y * 2;
                            new_width = new_height * prop_coefficient;
                        }
                    }
                    if (new_width < MIN_SHAPE_SIZE || new_height < MIN_SHAPE_SIZE) {
                        var k_wh = new_width / new_height;
                        if (new_height < MIN_SHAPE_SIZE && new_width < MIN_SHAPE_SIZE) {
                            if (new_height < new_width) {
                                new_height = MIN_SHAPE_SIZE;
                                new_width = new_height * k_wh;
                            } else {
                                new_width = MIN_SHAPE_SIZE;
                                new_height = new_width / k_wh;
                            }
                        } else {
                            if (new_height < MIN_SHAPE_SIZE) {
                                new_height = MIN_SHAPE_SIZE;
                                new_width = new_height * k_wh;
                            } else {
                                new_width = MIN_SHAPE_SIZE;
                                new_height = new_width / k_wh;
                            }
                        }
                    }
                    this.extX = new_width;
                    this.extY = new_height;
                    this.x = this.startX - this.extX * 0.5;
                    this.y = this.startY - this.extY * 0.5;
                }
            }
        }
        this.overlayObject.updateExtents(this.extX, this.extY);
        this.transform.Reset();
        var hc = this.extX * 0.5;
        var vc = this.extY * 0.5;
        global_MatrixTransformer.TranslateAppend(this.transform, -hc, -vc);
        if (this.flipH) {
            global_MatrixTransformer.ScaleAppend(this.transform, -1, 1);
        }
        if (this.flipV) {
            global_MatrixTransformer.ScaleAppend(this.transform, 1, -1);
        }
        global_MatrixTransformer.TranslateAppend(this.transform, this.x + hc, this.y + vc);
    };
    this.ctrlDown = function () {};
    this.shiftDown = function () {};
    this.draw = function (overlay) {
        this.overlayObject.draw(overlay);
    };
    this.trackEnd = function () {
        var shape = new CShape(null, this.drawingObjects);
        shape.setParent(drawingObjects);
        if (this.presetGeom !== "textRect") {
            shape.initDefault(this.x, this.y, this.extX, this.extY, this.flipH === true, this.flipV === true, this.presetGeom, this.arrowsCount);
        } else {
            shape.initDefaultTextRect(this.x, this.y, this.extX, this.extY, false, false);
        }
        return shape;
        shape.select(this.drawingObjects.graphicObjects);
        drawingObjects.shapeAdd(drawingObjects.cSld.spTree.length, shape);
        this.drawingObjects.graphicObjects.State.resultObject = shape;
    };
}