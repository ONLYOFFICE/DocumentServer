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
    this.headEnd = false;
    this.tailEnd = false;
    this.x = null;
    this.y = null;
    this.extX = null;
    this.extY = null;
    this.flipH = null;
    this.flipV = null;
    this.transform = new CMatrix();
    var theme = drawingObjects.getWorkbook().theme;
    var color_map = GenerateDefaultColorMap().color_map;
    var style;
    if (presetGeom !== "textRect") {
        style = CreateDefaultShapeStyle();
    } else {
        style = CreateDefaultTextRectStyle();
    }
    var brush = theme.getFillStyle(style.fillRef.idx);
    style.fillRef.Color.Calculate(theme, color_map, {
        R: 0,
        G: 0,
        B: 0,
        A: 255
    });
    var RGBA = style.fillRef.Color.RGBA;
    if (style.fillRef.Color.color != null) {
        if (brush.fill != null && (brush.fill.type == FILL_TYPE_SOLID || brush.fill.type == FILL_TYPE_GRAD)) {
            brush.fill.color = style.fillRef.Color.createDuplicate();
        }
    }
    var pen = theme.getLnStyle(style.lnRef.idx);
    style.lnRef.Color.Calculate(theme, color_map, {
        R: 0,
        G: 0,
        B: 0,
        A: 255
    });
    RGBA = style.lnRef.Color.RGBA;
    var final_preset = presetGeom;
    var sPreset = presetGeom;
    switch (sPreset) {
    case "lineWithArrow":
        final_preset = "line";
        this.tailEnd = true;
        break;
    case "lineWithTwoArrows":
        final_preset = "line";
        this.tailEnd = true;
        this.headEnd = true;
        break;
    case "bentConnector5WithArrow":
        final_preset = "bentConnector5";
        this.tailEnd = true;
        break;
    case "bentConnector5WithTwoArrows":
        final_preset = "bentConnector5";
        this.tailEnd = true;
        this.headEnd = true;
        break;
    case "curvedConnector3WithArrow":
        final_preset = "curvedConnector3";
        this.tailEnd = true;
        break;
    case "curvedConnector3WithTwoArrows":
        final_preset = "curvedConnector3";
        this.tailEnd = true;
        this.headEnd = true;
        break;
    case "textRect":
        final_preset = "rect";
        break;
    default:
        final_preset = sPreset;
        break;
    }
    if (presetGeom === "textRect") {
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
    } else {
        if (this.tailEnd || this.headEnd) {
            var ln;
            ln = new CLn();
            if (this.tailEnd) {
                ln.tailEnd = new EndArrow();
                ln.tailEnd.type = LineEndType.Arrow;
                ln.tailEnd.len = LineEndSize.Mid;
            }
            if (this.headEnd) {
                ln.headEnd = new EndArrow();
                ln.headEnd.type = LineEndType.Arrow;
                ln.headEnd.len = LineEndSize.Mid;
            }
            pen.merge(ln);
        }
    }
    pen.Fill.calculate(theme, color_map, RGBA);
    brush.calculate(theme, color_map, RGBA);
    this.finalPreset = final_preset;
    var geometry = CreateGeometry(final_preset);
    geometry.Init(5, 5);
    this.overlayObject = new OverlayObject(geometry, 5, 5, brush, pen, this.transform);
    this.lineFlag = CheckLinePreset(final_preset);
    this.isLine = this.lineFlag;
    this.track = function (e, x, y) {
        this.flipH = false;
        this.flipV = false;
        var real_dist_x = x - this.startX;
        var abs_dist_x = Math.abs(real_dist_x);
        var real_dist_y = y - this.startY;
        var abs_dist_y = Math.abs(real_dist_y);
        if (this.isLine) {
            if (x < this.startX) {
                this.flipH = true;
            }
            if (y < this.startY) {
                this.flipV = true;
            }
        }
        if (! (e.ctrlKey || e.shiftKey) || (e.CtrlKey && !e.ShiftKey && this.isLine)) {
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
            if (e.ctrlKey && !e.shiftKey) {
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
                if (!e.ctrlKey && e.shiftKey) {
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
        if (this.presetGeom !== "textRect") {
            shape.initDefault(this.x, this.y, this.extX, this.extY, this.flipH === true, this.flipV === true, this.finalPreset, this.tailEnd, this.headEnd);
        } else {
            shape.initDefaultTextRect(this.x, this.y, this.extX, this.extY, false, false);
        }
        shape.select(this.drawingObjects.controller);
        this.drawingObjects.controller.curState.resultObject = shape;
        var bounds_rect = shape.getRectBounds();
        var check_position = shape.drawingObjects.checkGraphicObjectPosition(bounds_rect.minX, bounds_rect.minY, bounds_rect.maxX - bounds_rect.minX, bounds_rect.maxY - bounds_rect.minY);
        if (!check_position.result) {
            shape.setPosition(this.x + check_position.x, this.y + check_position.y);
            shape.recalculateTransform();
            shape.calculateContent();
            shape.calculateTransformTextMatrix();
            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateAfterInit, null, null, new UndoRedoDataGraphicObjects(shape.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
        }
        shape.addToDrawingObjects();
    };
}
function CheckLinePreset(preset) {
    return preset === "line";
}