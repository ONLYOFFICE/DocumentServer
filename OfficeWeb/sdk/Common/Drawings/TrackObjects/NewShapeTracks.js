/*
 * (c) Copyright Ascensio System SIA 2010-2015
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
 "use strict";
function NewShapeTrack(presetGeom, startX, startY, theme, master, layout, slide, pageIndex) {
    this.presetGeom = presetGeom;
    this.startX = startX;
    this.startY = startY;
    this.x = null;
    this.y = null;
    this.extX = null;
    this.extY = null;
    this.arrowsCount = 0;
    this.transform = new CMatrix();
    this.pageIndex = pageIndex;
    this.theme = theme;
    ExecuteNoHistory(function () {
        var style;
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
        var spDef = theme.spDef;
        if (presetGeom !== "textRect") {
            if (spDef && spDef.style) {
                style = spDef.style.createDuplicate();
            } else {
                style = CreateDefaultShapeStyle(this.presetGeom);
            }
        } else {
            style = CreateDefaultTextRectStyle();
        }
        var brush = theme.getFillStyle(style.fillRef.idx);
        style.fillRef.Color.Calculate(theme, slide, layout, master, {
            R: 0,
            G: 0,
            B: 0,
            A: 255
        });
        var RGBA = style.fillRef.Color.RGBA;
        if (style.fillRef.Color.color) {
            if (brush.fill && (brush.fill.type === FILL_TYPE_SOLID)) {
                brush.fill.color = style.fillRef.Color.createDuplicate();
            }
        }
        var pen = theme.getLnStyle(style.lnRef.idx, style.lnRef.Color);
        style.lnRef.Color.Calculate(theme, slide, layout, master);
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
        if (this.arrowsCount > 0) {
            pen.setTailEnd(new EndArrow());
            pen.tailEnd.setType(LineEndType.Arrow);
            pen.tailEnd.setLen(LineEndSize.Mid);
            if (this.arrowsCount === 2) {
                pen.setHeadEnd(new EndArrow());
                pen.headEnd.setType(LineEndType.Arrow);
                pen.headEnd.setLen(LineEndSize.Mid);
            }
        }
        if (presetGeom !== "textRect") {
            if (spDef && spDef.spPr) {
                if (spDef.spPr.Fill) {
                    brush.merge(spDef.spPr.Fill);
                }
                if (spDef.spPr.ln) {
                    pen.merge(spDef.spPr.ln);
                }
            }
        }
        var geometry = CreateGeometry(presetGeom !== "textRect" ? presetGeom : "rect");
        if (pen.Fill) {
            pen.Fill.calculate(theme, slide, layout, master, RGBA);
        }
        brush.calculate(theme, slide, layout, master, RGBA);
        this.isLine = this.presetGeom === "line";
        this.overlayObject = new OverlayObject(geometry, 5, 5, brush, pen, this.transform);
        this.shape = null;
    },
    this, []);
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
    this.draw = function (overlay) {
        if (isRealNumber(this.pageIndex) && overlay.SetCurrentPage) {
            overlay.SetCurrentPage(this.pageIndex);
        }
        this.overlayObject.draw(overlay);
    };
    this.getShape = function (bFromWord, DrawingDocument, drawingObjects) {
        var shape = new CShape();
        if (drawingObjects) {
            shape.setDrawingObjects(drawingObjects);
        }
        shape.setSpPr(new CSpPr());
        shape.spPr.setParent(shape);
        shape.spPr.setXfrm(new CXfrm());
        if (bFromWord) {
            shape.setWordShape(true);
        }
        var xfrm = shape.spPr.xfrm;
        xfrm.setParent(shape.spPr);
        var x, y;
        if (bFromWord) {
            x = 0;
            y = 0;
        } else {
            x = this.x;
            y = this.y;
        }
        xfrm.setOffX(x);
        xfrm.setOffY(y);
        xfrm.setExtX(this.extX);
        xfrm.setExtY(this.extY);
        xfrm.setFlipH(this.flipH);
        xfrm.setFlipV(this.flipV);
        shape.setBDeleted(false);
        if (this.presetGeom === "textRect") {
            shape.spPr.setGeometry(CreateGeometry("rect"));
            shape.spPr.geometry.setParent(shape.spPr);
            var fill, ln;
            if (!drawingObjects || !drawingObjects.cSld) {
                shape.setStyle(CreateDefaultTextRectStyle());
                fill = new CUniFill();
                fill.setFill(new CSolidFill());
                fill.fill.setColor(new CUniColor());
                fill.fill.color.setColor(new CSchemeColor());
                fill.fill.color.color.setId(12);
                shape.spPr.setFill(fill);
                ln = new CLn();
                ln.setW(6350);
                ln.setFill(new CUniFill());
                ln.Fill.setFill(new CSolidFill());
                ln.Fill.fill.setColor(new CUniColor());
                ln.Fill.fill.color.setColor(new CPrstColor());
                ln.Fill.fill.color.color.setId("black");
                shape.spPr.setLn(ln);
            } else {
                fill = new CUniFill();
                fill.setFill(new CNoFill());
                shape.spPr.setFill(fill);
            }
            if (bFromWord) {
                shape.setTextBoxContent(new CDocumentContent(shape, DrawingDocument, 0, 0, 0, 0, false, false, false));
                var body_pr = new CBodyPr();
                body_pr.setDefault();
                shape.setBodyPr(body_pr);
            } else {
                shape.setTxBody(new CTextBody());
                var content = new CDocumentContent(shape.txBody, DrawingDocument, 0, 0, 0, 0, false, false, true);
                shape.txBody.setParent(shape);
                shape.txBody.setContent(content);
                var body_pr = new CBodyPr();
                body_pr.setDefault();
                shape.txBody.setBodyPr(body_pr);
            }
        } else {
            shape.spPr.setGeometry(CreateGeometry(this.presetGeom));
            shape.spPr.geometry.setParent(shape.spPr);
            shape.setStyle(CreateDefaultShapeStyle(this.presetGeom));
            if (this.arrowsCount > 0) {
                var ln = new CLn();
                ln.setTailEnd(new EndArrow());
                ln.tailEnd.setType(LineEndType.Arrow);
                ln.tailEnd.setLen(LineEndSize.Mid);
                if (this.arrowsCount === 2) {
                    ln.setHeadEnd(new EndArrow());
                    ln.headEnd.setType(LineEndType.Arrow);
                    ln.headEnd.setLen(LineEndSize.Mid);
                }
                shape.spPr.setLn(ln);
            }
            var spDef = this.theme && this.theme.spDef;
            if (spDef) {
                if (spDef.style) {
                    shape.setStyle(spDef.style.createDuplicate());
                }
                if (spDef.spPr) {
                    if (spDef.spPr.Fill) {
                        shape.spPr.setFill(spDef.spPr.Fill.createDuplicate());
                    }
                    if (spDef.spPr.ln) {
                        if (shape.spPr.ln) {
                            shape.spPr.ln.merge(spDef.spPr.ln);
                        } else {
                            shape.spPr.setLn(spDef.spPr.ln.createDuplicate());
                        }
                    }
                }
            }
        }
        shape.x = this.x;
        shape.y = this.y;
        return shape;
    };
    this.getBounds = function () {
        var boundsChecker = new CSlideBoundsChecker();
        this.draw(boundsChecker);
        var tr = this.transform;
        var arr_p_x = [];
        var arr_p_y = [];
        arr_p_x.push(tr.TransformPointX(0, 0));
        arr_p_y.push(tr.TransformPointY(0, 0));
        arr_p_x.push(tr.TransformPointX(this.extX, 0));
        arr_p_y.push(tr.TransformPointY(this.extX, 0));
        arr_p_x.push(tr.TransformPointX(this.extX, this.extY));
        arr_p_y.push(tr.TransformPointY(this.extX, this.extY));
        arr_p_x.push(tr.TransformPointX(0, this.extY));
        arr_p_y.push(tr.TransformPointY(0, this.extY));
        arr_p_x.push(boundsChecker.Bounds.min_x);
        arr_p_x.push(boundsChecker.Bounds.max_x);
        arr_p_y.push(boundsChecker.Bounds.min_y);
        arr_p_y.push(boundsChecker.Bounds.max_y);
        boundsChecker.Bounds.min_x = Math.min.apply(Math, arr_p_x);
        boundsChecker.Bounds.max_x = Math.max.apply(Math, arr_p_x);
        boundsChecker.Bounds.min_y = Math.min.apply(Math, arr_p_y);
        boundsChecker.Bounds.max_y = Math.max.apply(Math, arr_p_y);
        boundsChecker.Bounds.posX = this.x;
        boundsChecker.Bounds.posY = this.y;
        boundsChecker.Bounds.extX = this.extX;
        boundsChecker.Bounds.extY = this.extY;
        return boundsChecker.Bounds;
    };
}