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
function DrawLineEnd(xEnd, yEnd, xPrev, yPrev, type, w, len, drawer, trans) {
    switch (type) {
    case LineEndType.None:
        break;
    case LineEndType.Arrow:
        var _ex = xPrev - xEnd;
        var _ey = yPrev - yEnd;
        var _elen = Math.sqrt(_ex * _ex + _ey * _ey);
        _ex /= _elen;
        _ey /= _elen;
        var _vx = _ey;
        var _vy = -_ex;
        var tmpx = xEnd + len * _ex;
        var tmpy = yEnd + len * _ey;
        var x1 = tmpx + _vx * w / 2;
        var y1 = tmpy + _vy * w / 2;
        var x3 = tmpx - _vx * w / 2;
        var y3 = tmpy - _vy * w / 2;
        drawer._s();
        drawer._m(trans.TransformPointX(x1, y1), trans.TransformPointY(x1, y1));
        drawer._l(trans.TransformPointX(xEnd, yEnd), trans.TransformPointY(xEnd, yEnd));
        drawer._l(trans.TransformPointX(x3, y3), trans.TransformPointY(x3, y3));
        drawer.ds();
        drawer._e();
        break;
    case LineEndType.Diamond:
        var _ex = xPrev - xEnd;
        var _ey = yPrev - yEnd;
        var _elen = Math.sqrt(_ex * _ex + _ey * _ey);
        _ex /= _elen;
        _ey /= _elen;
        var _vx = _ey;
        var _vy = -_ex;
        var tmpx = xEnd + len / 2 * _ex;
        var tmpy = yEnd + len / 2 * _ey;
        var x1 = xEnd + _vx * w / 2;
        var y1 = yEnd + _vy * w / 2;
        var x3 = xEnd - _vx * w / 2;
        var y3 = yEnd - _vy * w / 2;
        var tmpx2 = xEnd - len / 2 * _ex;
        var tmpy2 = yEnd - len / 2 * _ey;
        drawer._s();
        drawer._m(trans.TransformPointX(tmpx, tmpy), trans.TransformPointY(tmpx, tmpy));
        drawer._l(trans.TransformPointX(x1, y1), trans.TransformPointY(x1, y1));
        drawer._l(trans.TransformPointX(tmpx2, tmpy2), trans.TransformPointY(tmpx2, tmpy2));
        drawer._l(trans.TransformPointX(x3, y3), trans.TransformPointY(x3, y3));
        drawer._z();
        drawer.drawStrokeFillStyle();
        drawer._e();
        drawer._s();
        drawer._m(trans.TransformPointX(tmpx, tmpy), trans.TransformPointY(tmpx, tmpy));
        drawer._l(trans.TransformPointX(x1, y1), trans.TransformPointY(x1, y1));
        drawer._l(trans.TransformPointX(tmpx2, tmpy2), trans.TransformPointY(tmpx2, tmpy2));
        drawer._l(trans.TransformPointX(x3, y3), trans.TransformPointY(x3, y3));
        drawer._z();
        drawer.ds();
        drawer._e();
        break;
    case LineEndType.Oval:
        var _ex = xPrev - xEnd;
        var _ey = yPrev - yEnd;
        var _elen = Math.sqrt(_ex * _ex + _ey * _ey);
        _ex /= _elen;
        _ey /= _elen;
        var _vx = _ey;
        var _vy = -_ex;
        var tmpx = xEnd + len / 2 * _ex;
        var tmpy = yEnd + len / 2 * _ey;
        var tmpx2 = xEnd - len / 2 * _ex;
        var tmpy2 = yEnd - len / 2 * _ey;
        var cx1 = tmpx + _vx * 3 * w / 4;
        var cy1 = tmpy + _vy * 3 * w / 4;
        var cx2 = tmpx2 + _vx * 3 * w / 4;
        var cy2 = tmpy2 + _vy * 3 * w / 4;
        var cx3 = tmpx - _vx * 3 * w / 4;
        var cy3 = tmpy - _vy * 3 * w / 4;
        var cx4 = tmpx2 - _vx * 3 * w / 4;
        var cy4 = tmpy2 - _vy * 3 * w / 4;
        drawer._s();
        drawer._m(trans.TransformPointX(tmpx, tmpy), trans.TransformPointY(tmpx, tmpy));
        drawer._c(trans.TransformPointX(cx1, cy1), trans.TransformPointY(cx1, cy1), trans.TransformPointX(cx2, cy2), trans.TransformPointY(cx2, cy2), trans.TransformPointX(tmpx2, tmpy2), trans.TransformPointY(tmpx2, tmpy2));
        drawer._c(trans.TransformPointX(cx4, cy4), trans.TransformPointY(cx4, cy4), trans.TransformPointX(cx3, cy3), trans.TransformPointY(cx3, cy3), trans.TransformPointX(tmpx, tmpy), trans.TransformPointY(tmpx, tmpy));
        drawer.drawStrokeFillStyle();
        drawer._e();
        drawer._s();
        drawer._m(trans.TransformPointX(tmpx, tmpy), trans.TransformPointY(tmpx, tmpy));
        drawer._c(trans.TransformPointX(cx1, cy1), trans.TransformPointY(cx1, cy1), trans.TransformPointX(cx2, cy2), trans.TransformPointY(cx2, cy2), trans.TransformPointX(tmpx2, tmpy2), trans.TransformPointY(tmpx2, tmpy2));
        drawer._c(trans.TransformPointX(cx4, cy4), trans.TransformPointY(cx4, cy4), trans.TransformPointX(cx3, cy3), trans.TransformPointY(cx3, cy3), trans.TransformPointX(tmpx, tmpy), trans.TransformPointY(tmpx, tmpy));
        drawer.ds();
        drawer._e();
        break;
    case LineEndType.Stealth:
        var _ex = xPrev - xEnd;
        var _ey = yPrev - yEnd;
        var _elen = Math.sqrt(_ex * _ex + _ey * _ey);
        _ex /= _elen;
        _ey /= _elen;
        var _vx = _ey;
        var _vy = -_ex;
        var tmpx = xEnd + len * _ex;
        var tmpy = yEnd + len * _ey;
        var x1 = tmpx + _vx * w / 2;
        var y1 = tmpy + _vy * w / 2;
        var x3 = tmpx - _vx * w / 2;
        var y3 = tmpy - _vy * w / 2;
        var x4 = xEnd + (len - w / 2) * _ex;
        var y4 = yEnd + (len - w / 2) * _ey;
        drawer._s();
        drawer._m(trans.TransformPointX(x1, y1), trans.TransformPointY(x1, y1));
        drawer._l(trans.TransformPointX(xEnd, yEnd), trans.TransformPointY(xEnd, yEnd));
        drawer._l(trans.TransformPointX(x3, y3), trans.TransformPointY(x3, y3));
        drawer._l(trans.TransformPointX(x4, y4), trans.TransformPointY(x4, y4));
        drawer._z();
        drawer.drawStrokeFillStyle();
        drawer._e();
        drawer._s();
        drawer._m(trans.TransformPointX(x1, y1), trans.TransformPointY(x1, y1));
        drawer._l(trans.TransformPointX(xEnd, yEnd), trans.TransformPointY(xEnd, yEnd));
        drawer._l(trans.TransformPointX(x3, y3), trans.TransformPointY(x3, y3));
        drawer._l(trans.TransformPointX(x4, y4), trans.TransformPointY(x4, y4));
        drawer._z();
        drawer.ds();
        drawer._e();
        break;
    case LineEndType.Triangle:
        var _ex = xPrev - xEnd;
        var _ey = yPrev - yEnd;
        var _elen = Math.sqrt(_ex * _ex + _ey * _ey);
        _ex /= _elen;
        _ey /= _elen;
        var _vx = _ey;
        var _vy = -_ex;
        var tmpx = xEnd + len * _ex;
        var tmpy = yEnd + len * _ey;
        var x1 = tmpx + _vx * w / 2;
        var y1 = tmpy + _vy * w / 2;
        var x3 = tmpx - _vx * w / 2;
        var y3 = tmpy - _vy * w / 2;
        drawer._s();
        drawer._m(trans.TransformPointX(x1, y1), trans.TransformPointY(x1, y1));
        drawer._l(trans.TransformPointX(xEnd, yEnd), trans.TransformPointY(xEnd, yEnd));
        drawer._l(trans.TransformPointX(x3, y3), trans.TransformPointY(x3, y3));
        drawer._z();
        drawer.drawStrokeFillStyle();
        drawer._e();
        drawer._s();
        drawer._m(trans.TransformPointX(x1, y1), trans.TransformPointY(x1, y1));
        drawer._l(trans.TransformPointX(xEnd, yEnd), trans.TransformPointY(xEnd, yEnd));
        drawer._l(trans.TransformPointX(x3, y3), trans.TransformPointY(x3, y3));
        drawer._z();
        drawer.ds();
        drawer._e();
        break;
    }
}
function DrawTailEnd(type, length, width, x, y, angle, graphics, array_points) {
    var sin, cos;
    sin = Math.sin(angle);
    cos = Math.cos(angle);
    switch (type) {
    case ar_arrow:
        var xb, yb, xc, yc;
        xb = -length;
        yb = -width * 0.5;
        xc = xb;
        yc = yb + width;
        graphics._s();
        graphics._m(xb * cos - yb * sin + x, xb * sin + yb * cos + y);
        graphics._l(x, y);
        graphics._l(xc * cos - yc * sin + x, xc * sin + yc * cos + y);
        graphics.ds();
        break;
    case ar_diamond:
        var xd, yd;
        xb = -length * 0.5;
        yb = -width * 0.5;
        xc = -length;
        yc = 0;
        xd = xb;
        yd = yb + width;
        graphics._s();
        graphics._m(xb * cos - yb * sin + x, xb * sin + yb * cos + y);
        graphics._l(x, y);
        graphics._l(xd * cos - yd * sin + x, xd * sin + yd * cos + y);
        graphics._l(xc * cos - yc * sin + x, xc * sin + yc * cos + y);
        graphics._z();
        graphics.ds();
        graphics.df();
        break;
    case ar_none:
        break;
    case ar_oval:
        EllipseN(graphics, x, y, length * 0.5, width * 0.5, angle);
        break;
    case ar_stealth:
        xb = -length;
        yb = -width * 0.5;
        xc = -length * 0.5;
        yc = 0;
        xd = xb;
        yd = -yb;
        graphics._s();
        graphics._m(x, y);
        graphics._l(xb * cos - yb * sin + x, xb * sin + yb * cos + y);
        graphics._l(xc * cos - yc * sin + x, xc * sin + yc * cos + y);
        graphics._l(xd * cos - yd * sin + x, xd * sin + yd * cos + y);
        graphics._z();
        graphics.ds();
        graphics.df();
        break;
    case ar_triangle:
        xb = -length;
        yb = -width * 0.5;
        xc = xb;
        yc = -yb;
        graphics._s();
        graphics._m(x, y);
        graphics._l(xb * cos - yb * sin + x, xb * sin + yb * cos + y);
        graphics._l(xc * cos - yc * sin + x, xc * sin + yc * cos + y);
        graphics._z();
        graphics.ds();
        graphics.df();
        break;
    }
}
function DrawHeadEnd(type, length, width, x, y, angle, graphics) {
    var sin, cos;
    sin = Math.sin(angle);
    cos = Math.cos(angle);
    switch (type) {
    case ar_arrow:
        var xb, yb, xc, yc;
        xb = length;
        yb = -width * 0.5;
        xc = xb;
        yc = yb + width;
        graphics._s();
        graphics._m(xb * cos - yb * sin + x, xb * sin + yb * cos + y);
        graphics._l(x, y);
        graphics._l(xc * cos - yc * sin + x, xc * sin + yc * cos + y);
        graphics.ds();
        break;
    case ar_diamond:
        var xd, yd;
        xb = length * 0.5;
        yb = -width * 0.5;
        xc = length;
        yc = 0;
        xd = xb;
        yd = yb + width;
        graphics._s();
        graphics._m(xb * cos - yb * sin + x, xb * sin + yb * cos + y);
        graphics._l(x, y);
        graphics._l(xd * cos - yd * sin + x, xd * sin + yd * cos + y);
        graphics._l(xc * cos - yc * sin + x, xc * sin + yc * cos + y);
        graphics._z();
        graphics.ds();
        graphics.df();
        break;
    case ar_none:
        break;
    case ar_oval:
        Ellipse2(graphics, x, y, length * 0.5, width * 0.5, angle);
        break;
    case ar_stealth:
        xb = length;
        yb = -width * 0.5;
        xc = length * 0.5;
        yc = 0;
        xd = xb;
        yd = -yb;
        graphics._s();
        graphics._m(x, y);
        graphics._l(xb * cos - yb * sin + x, xb * sin + yb * cos + y);
        graphics._l(xc * cos - yc * sin + x, xc * sin + yc * cos + y);
        graphics._l(xd * cos - yd * sin + x, xd * sin + yd * cos + y);
        graphics._z();
        graphics.ds();
        graphics.df();
        break;
    case ar_triangle:
        xb = length;
        yb = -width * 0.5;
        xc = xb;
        yc = -yb;
        graphics._s();
        graphics._m(x, y);
        graphics._l(xb * cos - yb * sin + x, xb * sin + yb * cos + y);
        graphics._l(xc * cos - yc * sin + x, xc * sin + yc * cos + y);
        graphics._z();
        graphics.ds();
        graphics.df();
        break;
    }
}
function CShapeDrawer() {
    this.Shape = null;
    this.Graphics = null;
    this.UniFill = null;
    this.Ln = null;
    this.Transform = null;
    this.bIsTexture = false;
    this.bIsNoFillAttack = false;
    this.bIsNoStrokeAttack = false;
    this.FillUniColor = null;
    this.StrokeUniColor = null;
    this.StrokeWidth = 0;
    this.min_x = 65535;
    this.min_y = 65535;
    this.max_x = -65535;
    this.max_y = -65535;
    this.OldLineJoin = null;
    this.IsArrowsDrawing = false;
    this.IsCurrentPathCanArrows = true;
    this.bIsCheckBounds = false;
    this.IsRectShape = false;
}
CShapeDrawer.prototype = {
    Clear: function () {
        this.UniFill = null;
        this.Ln = null;
        this.Transform = null;
        this.bIsTexture = false;
        this.bIsNoFillAttack = false;
        this.bIsNoStrokeAttack = false;
        this.FillUniColor = null;
        this.StrokeUniColor = null;
        this.StrokeWidth = 0;
        this.min_x = 65535;
        this.min_y = 65535;
        this.max_x = -65535;
        this.max_y = -65535;
        this.OldLineJoin = null;
        this.IsArrowsDrawing = false;
        this.IsCurrentPathCanArrows = true;
        this.bIsCheckBounds = false;
        this.IsRectShape = false;
    },
    CheckPoint: function (_x, _y) {
        var x = _x;
        var y = _y;
        if (false && this.Graphics.MaxEpsLine !== undefined) {
            x = this.Graphics.Graphics.m_oFullTransform.TransformPointX(_x, _y);
            y = this.Graphics.Graphics.m_oFullTransform.TransformPointY(_x, _y);
        }
        if (x < this.min_x) {
            this.min_x = x;
        }
        if (y < this.min_y) {
            this.min_y = y;
        }
        if (x > this.max_x) {
            this.max_x = x;
        }
        if (y > this.max_y) {
            this.max_y = y;
        }
    },
    fromShape2: function (shape, graphics, geom) {
        this.fromShape(shape, graphics);
        if (!geom) {
            this.IsRectShape = true;
        } else {
            if (geom.preset == "rect") {
                this.IsRectShape = true;
            }
        }
    },
    fromShape: function (shape, graphics) {
        this.IsRectShape = false;
        this.Shape = shape;
        this.Graphics = graphics;
        this.UniFill = shape.brush;
        this.Ln = shape.pen;
        this.Transform = shape.TransformMatrix;
        this.min_x = 65535;
        this.min_y = 65535;
        this.max_x = -65535;
        this.max_y = -65535;
        var bIsCheckBounds = false;
        if (this.UniFill == null || this.UniFill.fill == null) {
            this.bIsNoFillAttack = true;
        } else {
            var _fill = this.UniFill.fill;
            switch (_fill.type) {
            case FILL_TYPE_BLIP:
                this.bIsTexture = true;
                break;
            case FILL_TYPE_SOLID:
                this.FillUniColor = _fill.color.RGBA;
                break;
            case FILL_TYPE_GRAD:
                var _c = _fill.colors;
                if (_c.length == 0) {
                    this.FillUniColor = new CUniColor().RGBA;
                } else {
                    this.FillUniColor = _fill.colors[0].color.RGBA;
                }
                bIsCheckBounds = true;
                break;
            case FILL_TYPE_PATT:
                bIsCheckBounds = true;
                break;
            case FILL_TYPE_NOFILL:
                this.bIsNoFillAttack = true;
                break;
            default:
                this.bIsNoFillAttack = true;
                break;
            }
        }
        if (this.Ln == null || this.Ln.Fill == null || this.Ln.Fill.fill == null) {
            this.bIsNoStrokeAttack = true;
        } else {
            var _fill = this.Ln.Fill.fill;
            switch (_fill.type) {
            case FILL_TYPE_BLIP:
                this.StrokeUniColor = new CUniColor().RGBA;
                break;
            case FILL_TYPE_SOLID:
                this.StrokeUniColor = _fill.color.RGBA;
                break;
            case FILL_TYPE_GRAD:
                var _c = _fill.colors;
                if (_c == 0) {
                    this.StrokeUniColor = new CUniColor().RGBA;
                } else {
                    this.StrokeUniColor = _fill.colors[0].color.RGBA;
                }
                break;
            case FILL_TYPE_PATT:
                this.StrokeUniColor = _fill.fgClr.RGBA;
                break;
            case FILL_TYPE_NOFILL:
                this.bIsNoStrokeAttack = true;
                break;
            default:
                this.bIsNoStrokeAttack = true;
                break;
            }
            this.StrokeWidth = (this.Ln.w == null) ? 12700 : parseInt(this.Ln.w);
            this.StrokeWidth /= 36000;
            this.p_width(1000 * this.StrokeWidth);
            if (graphics.IsSlideBoundsCheckerType && !this.bIsNoStrokeAttack) {
                graphics.LineWidth = this.StrokeWidth;
            }
            if ((this.Ln.headEnd != null && this.Ln.headEnd.type != null) || (this.Ln.tailEnd != null && this.Ln.tailEnd.type != null)) {
                if (true === graphics.IsTrack) {
                    graphics.Graphics.ArrayPoints = [];
                } else {
                    graphics.ArrayPoints = [];
                }
            }
            if (this.Graphics.m_oContext != null && this.Ln.Join != null && this.Ln.Join.type != null) {
                this.OldLineJoin = this.Graphics.m_oContext.lineJoin;
            }
        }
        if (this.bIsTexture || bIsCheckBounds) {
            this.bIsCheckBounds = true;
            this.check_bounds();
            this.bIsCheckBounds = false;
        }
    },
    draw: function (geom) {
        if (this.bIsNoStrokeAttack && this.bIsNoFillAttack) {
            return;
        }
        var bIsPatt = false;
        if (this.UniFill != null && this.UniFill.fill != null && ((this.UniFill.fill.type == FILL_TYPE_PATT) || (this.UniFill.fill.type == FILL_TYPE_GRAD))) {
            bIsPatt = true;
        }
        if (this.Graphics.RENDERER_PDF_FLAG && (this.bIsTexture || bIsPatt)) {
            this.Graphics.put_TextureBoundsEnabled(true);
            this.Graphics.put_TextureBounds(this.min_x, this.min_y, this.max_x - this.min_x, this.max_y - this.min_y);
        }
        var _old_composite = null;
        if (this.Graphics.ClearMode === true) {
            _old_composite = this.Graphics.m_oContext.globalCompositeOperation;
            this.Graphics.m_oContext.globalCompositeOperation = "destination-out";
        }
        if (geom) {
            geom.draw(this);
        } else {
            this._s();
            this._m(0, 0);
            this._l(this.Shape.extX, 0);
            this._l(this.Shape.extX, this.Shape.extY);
            this._l(0, this.Shape.extY);
            this._z();
            this.drawFillStroke(true, "norm", true && !this.bIsNoStrokeAttack);
            this._e();
        }
        this.Graphics.ArrayPoints = null;
        if (this.Graphics.RENDERER_PDF_FLAG && (this.bIsTexture || bIsPatt)) {
            this.Graphics.put_TextureBoundsEnabled(false);
        }
        if (this.Graphics.IsSlideBoundsCheckerType && this.Graphics.AutoCheckLineWidth) {
            this.Graphics.CorrectBounds2();
        }
        if (this.Graphics.ClearMode === true) {
            this.Graphics.m_oContext.globalCompositeOperation = _old_composite;
        }
    },
    p_width: function (w) {
        this.Graphics.p_width(w);
    },
    _m: function (x, y) {
        if (this.bIsCheckBounds) {
            this.CheckPoint(x, y);
            return;
        }
        this.Graphics._m(x, y);
    },
    _l: function (x, y) {
        if (this.bIsCheckBounds) {
            this.CheckPoint(x, y);
            return;
        }
        this.Graphics._l(x, y);
    },
    _c: function (x1, y1, x2, y2, x3, y3) {
        if (this.bIsCheckBounds) {
            this.CheckPoint(x1, y1);
            this.CheckPoint(x2, y2);
            this.CheckPoint(x3, y3);
            return;
        }
        this.Graphics._c(x1, y1, x2, y2, x3, y3);
    },
    _c2: function (x1, y1, x2, y2) {
        if (this.bIsCheckBounds) {
            this.CheckPoint(x1, y1);
            this.CheckPoint(x2, y2);
            return;
        }
        this.Graphics._c2(x1, y1, x2, y2);
    },
    _z: function () {
        this.IsCurrentPathCanArrows = false;
        if (this.bIsCheckBounds) {
            return;
        }
        this.Graphics._z();
    },
    _s: function () {
        this.IsCurrentPathCanArrows = true;
        this.Graphics._s();
        if (this.Graphics.ArrayPoints != null) {
            this.Graphics.ArrayPoints = [];
        }
    },
    _e: function () {
        this.IsCurrentPathCanArrows = true;
        this.Graphics._e();
        if (this.Graphics.ArrayPoints != null) {
            this.Graphics.ArrayPoints = [];
        }
    },
    df: function (mode) {
        if (mode == "none" || this.bIsNoFillAttack) {
            return;
        }
        if (this.Graphics.IsSlideBoundsCheckerType === true) {
            return;
        }
        var bIsIntegerGridTRUE = false;
        if (this.bIsTexture) {
            if (this.Graphics.m_bIntegerGrid === true) {
                this.Graphics.SetIntegerGrid(false);
                bIsIntegerGridTRUE = true;
            }
            if (this.Graphics.RENDERER_PDF_FLAG) {
                if (null == this.UniFill.fill.tile || this.Graphics.m_oContext === undefined) {
                    this.Graphics.put_brushTexture(getFullImageSrc(this.UniFill.fill.RasterImageId), 0);
                } else {
                    this.Graphics.put_brushTexture(getFullImageSrc(this.UniFill.fill.RasterImageId), 1);
                }
                if (bIsIntegerGridTRUE) {
                    this.Graphics.SetIntegerGrid(true);
                }
                return;
            }
            var bIsUnusePattern = false;
            if (AscBrowser.isIE) {
                if (this.UniFill.fill.RasterImageId) {
                    if (this.UniFill.fill.RasterImageId.lastIndexOf(".svg") == this.UniFill.fill.RasterImageId.length - 4) {
                        bIsUnusePattern = true;
                    }
                }
            }
            if (bIsUnusePattern || null == this.UniFill.fill.tile || this.Graphics.m_oContext === undefined) {
                if (this.IsRectShape) {
                    this.Graphics._s();
                    if ((null == this.UniFill.transparent) || (this.UniFill.transparent == 255)) {
                        this.Graphics.drawImage(getFullImageSrc(this.UniFill.fill.RasterImageId), this.min_x, this.min_y, (this.max_x - this.min_x), (this.max_y - this.min_y), undefined, this.UniFill.fill.srcRect, this.UniFill.fill.canvas);
                    } else {
                        var _old_global_alpha = this.Graphics.m_oContext.globalAlpha;
                        this.Graphics.m_oContext.globalAlpha = this.UniFill.transparent / 255;
                        this.Graphics.drawImage(getFullImageSrc(this.UniFill.fill.RasterImageId), this.min_x, this.min_y, (this.max_x - this.min_x), (this.max_y - this.min_y), undefined, this.UniFill.fill.srcRect, this.UniFill.fill.canvas);
                        this.Graphics.m_oContext.globalAlpha = _old_global_alpha;
                    }
                } else {
                    this.Graphics.save();
                    this.Graphics.clip();
                    if (this.Graphics.IsNoSupportTextDraw == true || true == this.Graphics.IsTrack || (null == this.UniFill.transparent) || (this.UniFill.transparent == 255)) {
                        this.Graphics.drawImage(getFullImageSrc(this.UniFill.fill.RasterImageId), this.min_x, this.min_y, (this.max_x - this.min_x), (this.max_y - this.min_y), undefined, this.UniFill.fill.srcRect, this.UniFill.fill.canvas);
                    } else {
                        var _old_global_alpha = this.Graphics.m_oContext.globalAlpha;
                        this.Graphics.m_oContext.globalAlpha = this.UniFill.transparent / 255;
                        this.Graphics.drawImage(getFullImageSrc(this.UniFill.fill.RasterImageId), this.min_x, this.min_y, (this.max_x - this.min_x), (this.max_y - this.min_y), undefined, this.UniFill.fill.srcRect, this.UniFill.fill.canvas);
                        this.Graphics.m_oContext.globalAlpha = _old_global_alpha;
                    }
                    this.Graphics.restore();
                }
            } else {
                var editor = window["Asc"]["editor"];
                var _img = editor.ImageLoader.map_image_index[getFullImageSrc(this.UniFill.fill.RasterImageId)];
                var _img_native = this.UniFill.fill.canvas;
                if ((!_img_native) && (_img == undefined || _img.Image == null || _img.Status == ImageLoadStatus.Loading)) {
                    this.Graphics.save();
                    this.Graphics.clip();
                    if (this.Graphics.IsNoSupportTextDraw === true || true == this.Graphics.IsTrack || (null == this.UniFill.transparent) || (this.UniFill.transparent == 255)) {
                        this.Graphics.drawImage(getFullImageSrc(this.UniFill.fill.RasterImageId), this.min_x, this.min_y, (this.max_x - this.min_x), (this.max_y - this.min_y));
                    } else {
                        var _old_global_alpha = this.Graphics.m_oContext.globalAlpha;
                        this.Graphics.m_oContext.globalAlpha = this.UniFill.transparent / 255;
                        this.Graphics.drawImage(getFullImageSrc(this.UniFill.fill.RasterImageId), this.min_x, this.min_y, (this.max_x - this.min_x), (this.max_y - this.min_y));
                        this.Graphics.m_oContext.globalAlpha = _old_global_alpha;
                    }
                    this.Graphics.restore();
                } else {
                    var _is_ctx = false;
                    if (this.Graphics.IsNoSupportTextDraw === true || undefined === this.Graphics.m_oContext || (null == this.UniFill.transparent) || (this.UniFill.transparent == 255)) {
                        _is_ctx = false;
                    } else {
                        _is_ctx = true;
                    }
                    var _ctx = (this.Graphics.IsTrack === true) ? this.Graphics.Graphics.m_oContext : this.Graphics.m_oContext;
                    var patt = !_img_native ? _ctx.createPattern(_img.Image, "repeat") : _ctx.createPattern(_img_native, "repeat");
                    _ctx.save();
                    var koefX = editor.asc_getZoom();
                    var koefY = editor.asc_getZoom();
                    _ctx.translate(this.min_x, this.min_y);
                    if (this.Graphics.MaxEpsLine === undefined) {
                        _ctx.scale(koefX * this.Graphics.TextureFillTransformScaleX, koefY * this.Graphics.TextureFillTransformScaleY);
                    } else {
                        _ctx.scale(koefX * this.Graphics.Graphics.TextureFillTransformScaleX, koefY * this.Graphics.Graphics.TextureFillTransformScaleY);
                    }
                    if (_is_ctx === true) {
                        var _old_global_alpha = _ctx.globalAlpha;
                        _ctx.globalAlpha = this.UniFill.transparent / 255;
                        _ctx.fillStyle = patt;
                        _ctx.fill();
                        _ctx.globalAlpha = _old_global_alpha;
                    } else {
                        _ctx.fillStyle = patt;
                        _ctx.fill();
                    }
                    _ctx.restore();
                }
            }
            if (bIsIntegerGridTRUE) {
                this.Graphics.SetIntegerGrid(true);
            }
            return;
        }
        if (this.UniFill != null && this.UniFill.fill != null) {
            var _fill = this.UniFill.fill;
            if (_fill.type == FILL_TYPE_PATT) {
                if (this.Graphics.m_bIntegerGrid === true) {
                    this.Graphics.SetIntegerGrid(false);
                    bIsIntegerGridTRUE = true;
                }
                var _is_ctx = false;
                if (this.Graphics.IsNoSupportTextDraw === true || undefined === this.Graphics.m_oContext || (null == this.UniFill.transparent) || (this.UniFill.transparent == 255)) {
                    _is_ctx = false;
                } else {
                    _is_ctx = true;
                }
                var _ctx = (this.Graphics.IsTrack === true) ? this.Graphics.Graphics.m_oContext : this.Graphics.m_oContext;
                var _patt_name = global_hatch_names[_fill.ftype];
                if (undefined == _patt_name) {
                    _patt_name = "cross";
                }
                var _fc = _fill.fgClr.RGBA;
                var _bc = _fill.bgClr.RGBA;
                var __fa = (null === this.UniFill.transparent) ? _fc.A : 255;
                var __ba = (null === this.UniFill.transparent) ? _bc.A : 255;
                var _test_pattern = GetHatchBrush(_patt_name, _fc.R, _fc.G, _fc.B, __fa, _bc.R, _bc.G, _bc.B, __ba);
                var patt = _ctx.createPattern(_test_pattern.Canvas, "repeat");
                _ctx.save();
                var editor = window["Asc"]["editor"];
                var koefX = editor.asc_getZoom();
                var koefY = editor.asc_getZoom();
                _ctx.translate(this.min_x, this.min_y);
                if (this.Graphics.MaxEpsLine === undefined) {
                    _ctx.scale(koefX * this.Graphics.TextureFillTransformScaleX, koefY * this.Graphics.TextureFillTransformScaleY);
                } else {
                    _ctx.scale(koefX * this.Graphics.Graphics.TextureFillTransformScaleX, koefY * this.Graphics.Graphics.TextureFillTransformScaleY);
                }
                if (_is_ctx === true) {
                    var _old_global_alpha = _ctx.globalAlpha;
                    if (null != this.UniFill.transparent) {
                        _ctx.globalAlpha = this.UniFill.transparent / 255;
                    }
                    _ctx.fillStyle = patt;
                    _ctx.fill();
                    _ctx.globalAlpha = _old_global_alpha;
                } else {
                    _ctx.fillStyle = patt;
                    _ctx.fill();
                }
                _ctx.restore();
                if (bIsIntegerGridTRUE) {
                    this.Graphics.SetIntegerGrid(true);
                }
                return;
            } else {
                if (_fill.type == FILL_TYPE_GRAD) {
                    if (this.Graphics.m_bIntegerGrid === true) {
                        this.Graphics.SetIntegerGrid(false);
                        bIsIntegerGridTRUE = true;
                    }
                    var _is_ctx = false;
                    if (this.Graphics.IsNoSupportTextDraw === true || undefined === this.Graphics.m_oContext || (null == this.UniFill.transparent) || (this.UniFill.transparent == 255)) {
                        _is_ctx = false;
                    } else {
                        _is_ctx = true;
                    }
                    var _ctx = (this.Graphics.IsTrack === true) ? this.Graphics.Graphics.m_oContext : this.Graphics.m_oContext;
                    var gradObj = null;
                    if (_fill.lin) {
                        var points = this.getGradientPoints(this.min_x, this.min_y, this.max_x, this.max_y, _fill.lin.angle, _fill.lin.scale);
                        gradObj = _ctx.createLinearGradient(points.x0, points.y0, points.x1, points.y1);
                    } else {
                        if (_fill.path) {
                            var _cx = (this.min_x + this.max_x) / 2;
                            var _cy = (this.min_y + this.max_y) / 2;
                            var _r = Math.max(this.max_x - this.min_x, this.max_y - this.min_y) / 2;
                            gradObj = _ctx.createRadialGradient(_cx, _cy, 1, _cx, _cy, _r);
                        } else {
                            var points = this.getGradientPoints(this.min_x, this.min_y, this.max_x, this.max_y, 90 * 60000, false);
                            gradObj = _ctx.createLinearGradient(points.x0, points.y0, points.x1, points.y1);
                        }
                    }
                    for (var i = 0; i < _fill.colors.length; i++) {
                        gradObj.addColorStop(_fill.colors[i].pos / 100000, _fill.colors[i].color.getCSSColor(this.UniFill.transparent));
                    }
                    _ctx.fillStyle = gradObj;
                    if (null !== this.UniFill.transparent && undefined !== this.UniFill.transparent) {
                        var _old_global_alpha = this.Graphics.m_oContext.globalAlpha;
                        _ctx.globalAlpha = this.UniFill.transparent / 255;
                        _ctx.fill();
                        _ctx.globalAlpha = _old_global_alpha;
                    } else {
                        _ctx.fill();
                    }
                    if (bIsIntegerGridTRUE) {
                        this.Graphics.SetIntegerGrid(true);
                    }
                    return;
                }
            }
        }
        var rgba = this.FillUniColor;
        if (mode == "darken") {
            var _color1 = new CShapeColor(rgba.R, rgba.G, rgba.B);
            var rgb = _color1.darken();
            rgba = {
                R: rgb.r,
                G: rgb.g,
                B: rgb.b,
                A: rgba.A
            };
        } else {
            if (mode == "darkenLess") {
                var _color1 = new CShapeColor(rgba.R, rgba.G, rgba.B);
                var rgb = _color1.darkenLess();
                rgba = {
                    R: rgb.r,
                    G: rgb.g,
                    B: rgb.b,
                    A: rgba.A
                };
            } else {
                if (mode == "lighten") {
                    var _color1 = new CShapeColor(rgba.R, rgba.G, rgba.B);
                    var rgb = _color1.lighten();
                    rgba = {
                        R: rgb.r,
                        G: rgb.g,
                        B: rgb.b,
                        A: rgba.A
                    };
                } else {
                    if (mode == "lightenLess") {
                        var _color1 = new CShapeColor(rgba.R, rgba.G, rgba.B);
                        var rgb = _color1.lightenLess();
                        rgba = {
                            R: rgb.r,
                            G: rgb.g,
                            B: rgb.b,
                            A: rgba.A
                        };
                    }
                }
            }
        }
        if (rgba) {
            if (this.UniFill != null && this.UniFill.transparent != null && this.Graphics.ClearMode !== true) {
                rgba.A = this.UniFill.transparent;
            }
            this.Graphics.b_color1(rgba.R, rgba.G, rgba.B, rgba.A);
        }
        this.Graphics.df();
    },
    ds: function () {
        if (this.bIsNoStrokeAttack) {
            return;
        }
        if (null != this.OldLineJoin && !this.IsArrowsDrawing) {
            switch (this.Ln.Join.type) {
            case LineJoinType.Round:
                this.Graphics.m_oContext.lineJoin = "round";
                break;
            case LineJoinType.Bevel:
                this.Graphics.m_oContext.lineJoin = "bevel";
                break;
            case LineJoinType.Empty:
                this.Graphics.m_oContext.lineJoin = "miter";
                break;
            case LineJoinType.Miter:
                this.Graphics.m_oContext.lineJoin = "miter";
                break;
            }
        }
        var rgba = this.StrokeUniColor;
        this.Graphics.p_color(rgba.R, rgba.G, rgba.B, rgba.A);
        if (this.IsRectShape && this.Graphics.AddSmartRect !== undefined) {
            if (undefined !== this.Shape.extX) {
                this.Graphics.AddSmartRect(0, 0, this.Shape.extX, this.Shape.extY, this.StrokeWidth);
            } else {
                this.Graphics.ds();
            }
        } else {
            this.Graphics.ds();
        }
        if (null != this.OldLineJoin && !this.IsArrowsDrawing) {
            this.Graphics.m_oContext.lineJoin = this.OldLineJoin;
        }
        var arr = (this.Graphics.IsTrack === true) ? this.Graphics.Graphics.ArrayPoints : this.Graphics.ArrayPoints;
        if (arr != null && arr.length > 1 && this.IsCurrentPathCanArrows === true) {
            this.IsArrowsDrawing = true;
            var trans = (this.Graphics.IsTrack === true) ? this.Graphics.Graphics.m_oFullTransform : this.Graphics.m_oFullTransform;
            var trans1 = global_MatrixTransformer.Invert(trans);
            var x1 = trans.TransformPointX(0, 0);
            var y1 = trans.TransformPointY(0, 0);
            var x2 = trans.TransformPointX(1, 1);
            var y2 = trans.TransformPointY(1, 1);
            var dKoef = Math.sqrt(((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)) / 2);
            var _pen_w = (this.Graphics.IsTrack === true) ? (this.Graphics.Graphics.m_oContext.lineWidth * dKoef) : (this.Graphics.m_oContext.lineWidth * dKoef);
            var _max_delta_eps2 = 0.001;
            if (this.Ln.headEnd != null) {
                var _x1 = trans.TransformPointX(arr[0].x, arr[0].y);
                var _y1 = trans.TransformPointY(arr[0].x, arr[0].y);
                var _x2 = trans.TransformPointX(arr[1].x, arr[1].y);
                var _y2 = trans.TransformPointY(arr[1].x, arr[1].y);
                var _max_delta_eps = Math.max(this.Ln.headEnd.GetLen(_pen_w), 5);
                var _max_delta = Math.max(Math.abs(_x1 - _x2), Math.abs(_y1 - _y2));
                var cur_point = 2;
                while (_max_delta < _max_delta_eps && cur_point < arr.length) {
                    _x2 = trans.TransformPointX(arr[cur_point].x, arr[cur_point].y);
                    _y2 = trans.TransformPointY(arr[cur_point].x, arr[cur_point].y);
                    _max_delta = Math.max(Math.abs(_x1 - _x2), Math.abs(_y1 - _y2));
                    cur_point++;
                }
                if (_max_delta > _max_delta_eps2) {
                    if (this.Graphics.IsTrack) {
                        this.Graphics.Graphics.ArrayPoints = null;
                        DrawLineEnd(_x1, _y1, _x2, _y2, this.Ln.headEnd.type, this.Ln.headEnd.GetWidth(_pen_w), this.Ln.headEnd.GetLen(_pen_w), this, trans1);
                        this.Graphics.Graphics.ArrayPoints = arr;
                    } else {
                        this.Graphics.ArrayPoints = null;
                        DrawLineEnd(_x1, _y1, _x2, _y2, this.Ln.headEnd.type, this.Ln.headEnd.GetWidth(_pen_w), this.Ln.headEnd.GetLen(_pen_w), this, trans1);
                        this.Graphics.ArrayPoints = arr;
                    }
                }
            }
            if (this.Ln.tailEnd != null) {
                var _1 = arr.length - 1;
                var _2 = arr.length - 2;
                var _x1 = trans.TransformPointX(arr[_1].x, arr[_1].y);
                var _y1 = trans.TransformPointY(arr[_1].x, arr[_1].y);
                var _x2 = trans.TransformPointX(arr[_2].x, arr[_2].y);
                var _y2 = trans.TransformPointY(arr[_2].x, arr[_2].y);
                var _max_delta_eps = Math.max(this.Ln.tailEnd.GetLen(_pen_w), 5);
                var _max_delta = Math.max(Math.abs(_x1 - _x2), Math.abs(_y1 - _y2));
                var cur_point = _2 - 1;
                while (_max_delta < _max_delta_eps && cur_point >= 0) {
                    _x2 = trans.TransformPointX(arr[cur_point].x, arr[cur_point].y);
                    _y2 = trans.TransformPointY(arr[cur_point].x, arr[cur_point].y);
                    _max_delta = Math.max(Math.abs(_x1 - _x2), Math.abs(_y1 - _y2));
                    cur_point--;
                }
                if (_max_delta > _max_delta_eps2) {
                    if (this.Graphics.IsTrack) {
                        this.Graphics.Graphics.ArrayPoints = null;
                        DrawLineEnd(_x1, _y1, _x2, _y2, this.Ln.tailEnd.type, this.Ln.tailEnd.GetWidth(_pen_w), this.Ln.tailEnd.GetLen(_pen_w), this, trans1);
                        this.Graphics.Graphics.ArrayPoints = arr;
                    } else {
                        this.Graphics.ArrayPoints = null;
                        DrawLineEnd(_x1, _y1, _x2, _y2, this.Ln.tailEnd.type, this.Ln.tailEnd.GetWidth(_pen_w), this.Ln.tailEnd.GetLen(_pen_w), this, trans1);
                        this.Graphics.ArrayPoints = arr;
                    }
                }
            }
            this.IsArrowsDrawing = false;
        }
    },
    drawFillStroke: function (bIsFill, fill_mode, bIsStroke) {
        if (this.Graphics.RENDERER_PDF_FLAG === undefined) {
            if (bIsFill) {
                this.df(fill_mode);
            }
            if (bIsStroke) {
                this.ds();
            }
        } else {
            if (this.bIsNoStrokeAttack) {
                bIsStroke = false;
            }
            if (bIsStroke) {
                if (null != this.OldLineJoin && !this.IsArrowsDrawing) {
                    this.Graphics.put_PenLineJoin(ConvertJoinAggType(this.Ln.Join.type));
                }
                var rgba = this.StrokeUniColor;
                this.Graphics.p_color(rgba.R, rgba.G, rgba.B, rgba.A);
            }
            if (fill_mode == "none" || this.bIsNoFillAttack) {
                bIsFill = false;
            }
            var bIsPattern = false;
            if (bIsFill) {
                if (this.bIsTexture) {
                    if (null == this.UniFill.fill.tile) {
                        if (null == this.UniFill.fill.srcRect) {
                            if (this.UniFill.fill.RasterImageId && this.UniFill.fill.RasterImageId.indexOf(".svg") != 0) {
                                this.Graphics.SaveGrState();
                                this.Graphics.StartClipPath();
                                this.Graphics.EndClipPath();
                                this.Graphics.drawImage(getFullImageSrc(this.UniFill.fill.RasterImageId), this.min_x, this.min_y, (this.max_x - this.min_x), (this.max_y - this.min_y), undefined, undefined);
                                bIsFill = false;
                                var _histClip = new CHist_Clip();
                                this.Graphics.GrState.Clips.push(_histClip);
                                this.Graphics.RestoreGrState();
                            } else {
                                if (this.UniFill.fill.canvas) {
                                    this.Graphics.put_brushTexture(this.UniFill.fill.canvas.toDataURL("image/png"), 0);
                                } else {
                                    this.Graphics.put_brushTexture(getFullImageSrc(this.UniFill.fill.RasterImageId), 0);
                                }
                            }
                        } else {
                            this.Graphics.SaveGrState();
                            this.Graphics.StartClipPath();
                            this.Graphics.EndClipPath();
                            this.Graphics.drawImage(getFullImageSrc(this.UniFill.fill.RasterImageId), this.min_x, this.min_y, (this.max_x - this.min_x), (this.max_y - this.min_y), undefined, this.UniFill.fill.srcRect);
                            bIsFill = false;
                            var _histClip = new CHist_Clip();
                            this.Graphics.GrState.Clips.push(_histClip);
                            this.Graphics.RestoreGrState();
                        }
                    } else {
                        if (this.UniFill.fill.canvas) {
                            this.Graphics.put_brushTexture(this.UniFill.fill.canvas.toDataURL("image/png"), 1);
                        } else {
                            this.Graphics.put_brushTexture(getFullImageSrc(this.UniFill.fill.RasterImageId), 1);
                        }
                    }
                    this.Graphics.put_BrushTextureAlpha(this.UniFill.transparent);
                } else {
                    var _fill = this.UniFill.fill;
                    if (_fill.type == FILL_TYPE_PATT) {
                        var _patt_name = global_hatch_names[_fill.ftype];
                        if (undefined == _patt_name) {
                            _patt_name = "cross";
                        }
                        var _fc = _fill.fgClr.RGBA;
                        var _bc = _fill.bgClr.RGBA;
                        var __fa = (null === this.UniFill.transparent) ? _fc.A : 255;
                        var __ba = (null === this.UniFill.transparent) ? _bc.A : 255;
                        var _pattern = GetHatchBrush(_patt_name, _fc.R, _fc.G, _fc.B, __fa, _bc.R, _bc.G, _bc.B, __ba);
                        var _url64 = "";
                        try {
                            _url64 = _pattern.Canvas.toDataURL("image/png");
                        } catch(err) {
                            _url64 = "";
                        }
                        this.Graphics.put_brushTexture(_url64, 1);
                        if (null != this.UniFill.transparent) {
                            this.Graphics.put_BrushTextureAlpha(this.UniFill.transparent);
                        } else {
                            this.Graphics.put_BrushTextureAlpha(255);
                        }
                        bIsPattern = true;
                    } else {
                        if (_fill.type == FILL_TYPE_GRAD) {
                            var points = null;
                            if (_fill.lin) {
                                points = this.getGradientPoints(this.min_x, this.min_y, this.max_x, this.max_y, _fill.lin.angle, _fill.lin.scale);
                            } else {
                                if (_fill.path) {
                                    var _cx = (this.min_x + this.max_x) / 2;
                                    var _cy = (this.min_y + this.max_y) / 2;
                                    var _r = Math.max(this.max_x - this.min_x, this.max_y - this.min_y) / 2;
                                    points = {
                                        x0: _cx,
                                        y0: _cy,
                                        x1: _cx,
                                        y1: _cy,
                                        r0: 1,
                                        r1: _r
                                    };
                                } else {
                                    points = this.getGradientPoints(this.min_x, this.min_y, this.max_x, this.max_y, 90 * 60000, false);
                                }
                            }
                            this.Graphics.put_BrushGradient(_fill, points, this.UniFill.transparent);
                        } else {
                            var rgba = this.FillUniColor;
                            if (fill_mode == "darken") {
                                var _color1 = new CShapeColor(rgba.R, rgba.G, rgba.B);
                                var rgb = _color1.darken();
                                rgba = {
                                    R: rgb.r,
                                    G: rgb.g,
                                    B: rgb.b,
                                    A: rgba.A
                                };
                            } else {
                                if (fill_mode == "darkenLess") {
                                    var _color1 = new CShapeColor(rgba.R, rgba.G, rgba.B);
                                    var rgb = _color1.darkenLess();
                                    rgba = {
                                        R: rgb.r,
                                        G: rgb.g,
                                        B: rgb.b,
                                        A: rgba.A
                                    };
                                } else {
                                    if (fill_mode == "lighten") {
                                        var _color1 = new CShapeColor(rgba.R, rgba.G, rgba.B);
                                        var rgb = _color1.lighten();
                                        rgba = {
                                            R: rgb.r,
                                            G: rgb.g,
                                            B: rgb.b,
                                            A: rgba.A
                                        };
                                    } else {
                                        if (fill_mode == "lightenLess") {
                                            var _color1 = new CShapeColor(rgba.R, rgba.G, rgba.B);
                                            var rgb = _color1.lightenLess();
                                            rgba = {
                                                R: rgb.r,
                                                G: rgb.g,
                                                B: rgb.b,
                                                A: rgba.A
                                            };
                                        }
                                    }
                                }
                            }
                            if (rgba) {
                                if (this.UniFill != null && this.UniFill.transparent != null && this.Graphics.ClearMode !== true) {
                                    rgba.A = this.UniFill.transparent;
                                }
                                this.Graphics.b_color1(rgba.R, rgba.G, rgba.B, rgba.A);
                            }
                        }
                    }
                }
            }
            if (bIsFill && bIsStroke) {
                if (this.bIsTexture || bIsPattern) {
                    this.Graphics.drawpath(256);
                    this.Graphics.drawpath(1);
                } else {
                    this.Graphics.drawpath(256 + 1);
                }
            } else {
                if (bIsFill) {
                    this.Graphics.drawpath(256);
                } else {
                    if (bIsStroke) {
                        this.Graphics.drawpath(1);
                    } else {
                        this.Graphics.b_color1(0, 0, 0, 0);
                        this.Graphics.drawpath(256);
                    }
                }
            }
            var arr = this.Graphics.ArrayPoints;
            if (arr != null && arr.length > 1 && this.IsCurrentPathCanArrows === true) {
                this.IsArrowsDrawing = true;
                var trans = (this.Graphics.RENDERER_PDF_FLAG === undefined) ? this.Graphics.m_oFullTransform : this.Graphics.GetTransform();
                var trans1 = global_MatrixTransformer.Invert(trans);
                var lineSize = (this.Graphics.RENDERER_PDF_FLAG === undefined) ? this.Graphics.m_oContext.lineWidth : this.Graphics.GetLineWidth();
                var x1 = trans.TransformPointX(0, 0);
                var y1 = trans.TransformPointY(0, 0);
                var x2 = trans.TransformPointX(1, 1);
                var y2 = trans.TransformPointY(1, 1);
                var dKoef = Math.sqrt(((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)) / 2);
                var _pen_w = lineSize * dKoef;
                if (this.Ln.headEnd != null) {
                    var _x1 = trans.TransformPointX(arr[0].x, arr[0].y);
                    var _y1 = trans.TransformPointY(arr[0].x, arr[0].y);
                    var _x2 = trans.TransformPointX(arr[1].x, arr[1].y);
                    var _y2 = trans.TransformPointY(arr[1].x, arr[1].y);
                    var _max_delta = Math.max(Math.abs(_x1 - _x2), Math.abs(_y1 - _y2));
                    var cur_point = 2;
                    while (_max_delta < 0.001 && cur_point < arr.length) {
                        _x2 = trans.TransformPointX(arr[cur_point].x, arr[cur_point].y);
                        _y2 = trans.TransformPointY(arr[cur_point].x, arr[cur_point].y);
                        _max_delta = Math.max(Math.abs(_x1 - _x2), Math.abs(_y1 - _y2));
                        cur_point++;
                    }
                    if (_max_delta > 0.001) {
                        this.Graphics.ArrayPoints = null;
                        DrawLineEnd(_x1, _y1, _x2, _y2, this.Ln.headEnd.type, this.Ln.headEnd.GetWidth(_pen_w), this.Ln.headEnd.GetLen(_pen_w), this, trans1);
                        this.Graphics.ArrayPoints = arr;
                    }
                }
                if (this.Ln.tailEnd != null) {
                    var _1 = arr.length - 1;
                    var _2 = arr.length - 2;
                    var _x1 = trans.TransformPointX(arr[_1].x, arr[_1].y);
                    var _y1 = trans.TransformPointY(arr[_1].x, arr[_1].y);
                    var _x2 = trans.TransformPointX(arr[_2].x, arr[_2].y);
                    var _y2 = trans.TransformPointY(arr[_2].x, arr[_2].y);
                    var _max_delta = Math.max(Math.abs(_x1 - _x2), Math.abs(_y1 - _y2));
                    var cur_point = _2 - 1;
                    while (_max_delta < 0.001 && cur_point >= 0) {
                        _x2 = trans.TransformPointX(arr[cur_point].x, arr[cur_point].y);
                        _y2 = trans.TransformPointY(arr[cur_point].x, arr[cur_point].y);
                        _max_delta = Math.max(Math.abs(_x1 - _x2), Math.abs(_y1 - _y2));
                        cur_point--;
                    }
                    if (_max_delta > 0.001) {
                        this.Graphics.ArrayPoints = null;
                        DrawLineEnd(_x1, _y1, _x2, _y2, this.Ln.tailEnd.type, this.Ln.tailEnd.GetWidth(_pen_w), this.Ln.tailEnd.GetLen(_pen_w), this, trans1);
                        this.Graphics.ArrayPoints = arr;
                    }
                }
                this.IsArrowsDrawing = false;
            }
        }
    },
    drawStrokeFillStyle: function () {
        if (this.Graphics.RENDERER_PDF_FLAG === undefined) {
            var gr = (this.Graphics.IsTrack == true) ? this.Graphics.Graphics : this.Graphics;
            var tmp = gr.m_oBrush.Color1;
            var p_c = gr.m_oPen.Color;
            gr.b_color1(p_c.R, p_c.G, p_c.B, p_c.A);
            gr.df();
            gr.b_color1(tmp.R, tmp.G, tmp.B, tmp.A);
        } else {
            var tmp = this.Graphics.GetBrush().Color1;
            var p_c = this.Graphics.GetPen().Color;
            this.Graphics.b_color1(p_c.R, p_c.G, p_c.B, p_c.A);
            this.Graphics.df();
            this.Graphics.b_color1(tmp.R, tmp.G, tmp.B, tmp.A);
        }
    },
    check_bounds: function () {
        this.Shape.check_bounds(this);
    },
    getNormalPoint: function (x0, y0, angle, x1, y1) {
        var ex1 = Math.cos(angle);
        var ey1 = Math.sin(angle);
        if (ex1 === 0) {
            return {
                X: x0,
                Y: y1
            };
        }
        var ex2 = -ey1;
        var ey2 = ex1;
        var a = ex1 / ey1;
        var b = ex2 / ey2;
        var x = ((a * b * y1 - a * b * y0) - (a * x1 - b * x0)) / (b - a);
        var y = (x - x0) / a + y0;
        return {
            X: x,
            Y: y
        };
    },
    getGradientPoints: function (min_x, min_y, max_x, max_y, _angle, scale) {
        var points = {
            x0: 0,
            y0: 0,
            x1: 0,
            y1: 0
        };
        var angle = _angle / 60000;
        while (angle < 0) {
            angle += 360;
        }
        while (angle >= 360) {
            angle -= 360;
        }
        if (Math.abs(angle) < 1) {
            points.x0 = min_x;
            points.y0 = min_y;
            points.x1 = max_x;
            points.y1 = min_y;
            return points;
        } else {
            if (Math.abs(angle - 90) < 1) {
                points.x0 = min_x;
                points.y0 = min_y;
                points.x1 = min_x;
                points.y1 = max_y;
                return points;
            } else {
                if (Math.abs(angle - 180) < 1) {
                    points.x0 = max_x;
                    points.y0 = min_y;
                    points.x1 = min_x;
                    points.y1 = min_y;
                    return points;
                } else {
                    if (Math.abs(angle - 270) < 1) {
                        points.x0 = min_x;
                        points.y0 = max_y;
                        points.x1 = min_x;
                        points.y1 = min_y;
                        return points;
                    }
                }
            }
        }
        var grad_a = deg2rad(angle);
        if (!scale) {
            if (angle > 0 && angle < 90) {
                var p = this.getNormalPoint(min_x, min_y, grad_a, max_x, max_y);
                points.x0 = min_x;
                points.y0 = min_y;
                points.x1 = p.X;
                points.y1 = p.Y;
                return points;
            }
            if (angle > 90 && angle < 180) {
                var p = this.getNormalPoint(max_x, min_y, grad_a, min_x, max_y);
                points.x0 = max_x;
                points.y0 = min_y;
                points.x1 = p.X;
                points.y1 = p.Y;
                return points;
            }
            if (angle > 180 && angle < 270) {
                var p = this.getNormalPoint(max_x, max_y, grad_a, min_x, min_y);
                points.x0 = max_x;
                points.y0 = max_y;
                points.x1 = p.X;
                points.y1 = p.Y;
                return points;
            }
            if (angle > 270 && angle < 360) {
                var p = this.getNormalPoint(min_x, max_y, grad_a, max_x, min_y);
                points.x0 = min_x;
                points.y0 = max_y;
                points.x1 = p.X;
                points.y1 = p.Y;
                return points;
            }
            return points;
        }
        var _grad_45 = (Math.PI / 2) - Math.atan2(max_y - min_y, max_x - min_x);
        var _grad_90_45 = (Math.PI / 2) - _grad_45;
        if (angle > 0 && angle < 90) {
            if (angle <= 45) {
                grad_a = (_grad_45 * angle / 45);
            } else {
                grad_a = _grad_45 + _grad_90_45 * (angle - 45) / 45;
            }
            var p = this.getNormalPoint(min_x, min_y, grad_a, max_x, max_y);
            points.x0 = min_x;
            points.y0 = min_y;
            points.x1 = p.X;
            points.y1 = p.Y;
            return points;
        }
        if (angle > 90 && angle < 180) {
            if (angle <= 135) {
                grad_a = Math.PI / 2 + _grad_90_45 * (angle - 90) / 45;
            } else {
                grad_a = Math.PI - _grad_45 * (angle - 135) / 45;
            }
            var p = this.getNormalPoint(max_x, min_y, grad_a, min_x, max_y);
            points.x0 = max_x;
            points.y0 = min_y;
            points.x1 = p.X;
            points.y1 = p.Y;
            return points;
        }
        if (angle > 180 && angle < 270) {
            if (angle <= 225) {
                grad_a = Math.PI + _grad_45 * (angle - 180) / 45;
            } else {
                grad_a = 3 * Math.PI / 2 - _grad_90_45 * (angle - 225) / 45;
            }
            var p = this.getNormalPoint(max_x, max_y, grad_a, min_x, min_y);
            points.x0 = max_x;
            points.y0 = max_y;
            points.x1 = p.X;
            points.y1 = p.Y;
            return points;
        }
        if (angle > 270 && angle < 360) {
            if (angle <= 315) {
                grad_a = 3 * Math.PI / 2 + _grad_90_45 * (angle - 270) / 45;
            } else {
                grad_a = 2 * Math.PI - _grad_45 * (angle - 315) / 45;
            }
            var p = this.getNormalPoint(min_x, max_y, grad_a, max_x, min_y);
            points.x0 = min_x;
            points.y0 = max_y;
            points.x1 = p.X;
            points.y1 = p.Y;
            return points;
        }
        return points;
    },
    DrawPresentationComment: function (type, x, y, w, h) {}
};
function ShapeToImageConverter(shape, pageIndex) {
    var _bounds_cheker = new CSlideBoundsChecker();
    var dKoef = g_dKoef_mm_to_pix;
    var w_mm = 210;
    var h_mm = 297;
    var w_px = (w_mm * dKoef) >> 0;
    var h_px = (h_mm * dKoef) >> 0;
    _bounds_cheker.init(w_px, h_px, w_mm, h_mm);
    _bounds_cheker.transform(1, 0, 0, 1, 0, 0);
    _bounds_cheker.AutoCheckLineWidth = true;
    shape.draw(_bounds_cheker, pageIndex);
    var _need_pix_width = _bounds_cheker.Bounds.max_x - _bounds_cheker.Bounds.min_x + 1;
    var _need_pix_height = _bounds_cheker.Bounds.max_y - _bounds_cheker.Bounds.min_y + 1;
    if (_need_pix_width <= 0 || _need_pix_height <= 0) {
        return null;
    }
    var _canvas = document.createElement("canvas");
    _canvas.width = _need_pix_width;
    _canvas.height = _need_pix_height;
    var _ctx = _canvas.getContext("2d");
    var g = new CGraphics();
    g.init(_ctx, w_px, h_px, w_mm, h_mm);
    g.m_oFontManager = g_fontManager;
    g.m_oCoordTransform.tx = -_bounds_cheker.Bounds.min_x;
    g.m_oCoordTransform.ty = -_bounds_cheker.Bounds.min_y;
    g.transform(1, 0, 0, 1, 0, 0);
    shape.draw(g, pageIndex);
    var _ret = {
        ImageNative: _canvas,
        ImageUrl: ""
    };
    try {
        _ret.ImageUrl = _canvas.toDataURL("image/png");
    } catch(err) {
        if (shape.brush != null && shape.brush.fill && shape.brush.fill.RasterImageId) {
            _ret.ImageUrl = getFullImageSrc(shape.brush.fill.RasterImageId);
        } else {
            _ret.ImageUrl = "";
        }
    }
    return _ret;
}