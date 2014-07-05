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
 function CClipManager() {
    this.clipRects = [];
    this.curRect = new _rect();
    this.BaseObject = null;
    this.AddRect = function (x, y, w, h) {
        var _count = this.clipRects.length;
        if (0 == _count) {
            this.curRect.x = x;
            this.curRect.y = y;
            this.curRect.w = w;
            this.curRect.h = h;
            var _r = new _rect();
            _r.x = x;
            _r.y = y;
            _r.w = w;
            _r.h = h;
            this.clipRects[_count] = _r;
            this.BaseObject.SetClip(this.curRect);
        } else {
            this.BaseObject.RemoveClip();
            var _r = new _rect();
            _r.x = x;
            _r.y = y;
            _r.w = w;
            _r.h = h;
            this.clipRects[_count] = _r;
            this.curRect = this.IntersectRect(this.curRect, _r);
            this.BaseObject.SetClip(this.curRect);
        }
    };
    this.RemoveRect = function () {
        var _count = this.clipRects.length;
        if (0 != _count) {
            this.clipRects.splice(_count - 1, 1);
            --_count;
            this.BaseObject.RemoveClip();
            if (0 != _count) {
                this.curRect.x = this.clipRects[0].x;
                this.curRect.y = this.clipRects[0].y;
                this.curRect.w = this.clipRects[0].w;
                this.curRect.h = this.clipRects[0].h;
                for (var i = 1; i < _count; i++) {
                    this.curRect = this.IntersectRect(this.curRect, this.clipRects[i]);
                }
                this.BaseObject.SetClip(this.curRect);
            }
        }
    };
    this.IntersectRect = function (r1, r2) {
        var res = new _rect();
        res.x = Math.max(r1.x, r2.x);
        res.y = Math.max(r1.y, r2.y);
        res.w = Math.min(r1.x + r1.w, r2.x + r2.w) - res.x;
        res.h = Math.min(r1.y + r1.h, r2.y + r2.h) - res.y;
        if (0 > res.w) {
            res.w = 0;
        }
        if (0 > res.h) {
            res.h = 0;
        }
        return res;
    };
}
function CPen() {
    this.Color = {
        R: 255,
        G: 255,
        B: 255,
        A: 255
    };
    this.Style = 0;
    this.LineCap = 0;
    this.LineJoin = 0;
    this.LineWidth = 1;
}
function CBrush() {
    this.Color1 = {
        R: 255,
        G: 255,
        B: 255,
        A: 255
    };
    this.Color2 = {
        R: 255,
        G: 255,
        B: 255,
        A: 255
    };
    this.Type = 0;
}
var MATRIX_ORDER_PREPEND = 0;
var MATRIX_ORDER_APPEND = 1;
var bIsChrome = AscBrowser.isChrome;
var bIsSafari = AscBrowser.isSafari;
var bIsIE = AscBrowser.isIE;
var bIsAndroid = AscBrowser.isAndroid;
function deg2rad(deg) {
    return deg * Math.PI / 180;
}
function rad2deg(rad) {
    return rad * 180 / Math.PI;
}
function CMatrix() {
    this.sx = 1;
    this.shx = 0;
    this.shy = 0;
    this.sy = 1;
    this.tx = 0;
    this.ty = 0;
}
CMatrix.prototype = {
    Reset: function () {
        this.sx = 1;
        this.shx = 0;
        this.shy = 0;
        this.sy = 1;
        this.tx = 0;
        this.ty = 0;
    },
    Multiply: function (matrix, order) {
        if (MATRIX_ORDER_PREPEND == order) {
            var m = new CMatrix();
            m.sx = matrix.sx;
            m.shx = matrix.shx;
            m.shy = matrix.shy;
            m.sy = matrix.sy;
            m.tx = matrix.tx;
            m.ty = matrix.ty;
            m.Multiply(this, MATRIX_ORDER_APPEND);
            this.sx = m.sx;
            this.shx = m.shx;
            this.shy = m.shy;
            this.sy = m.sy;
            this.tx = m.tx;
            this.ty = m.ty;
        } else {
            var t0 = this.sx * matrix.sx + this.shy * matrix.shx;
            var t2 = this.shx * matrix.sx + this.sy * matrix.shx;
            var t4 = this.tx * matrix.sx + this.ty * matrix.shx + matrix.tx;
            this.shy = this.sx * matrix.shy + this.shy * matrix.sy;
            this.sy = this.shx * matrix.shy + this.sy * matrix.sy;
            this.ty = this.tx * matrix.shy + this.ty * matrix.sy + matrix.ty;
            this.sx = t0;
            this.shx = t2;
            this.tx = t4;
        }
        return this;
    },
    Translate: function (x, y, order) {
        var m = new CMatrix();
        m.tx = x;
        m.ty = y;
        this.Multiply(m, order);
    },
    Scale: function (x, y, order) {
        var m = new CMatrix();
        m.sx = x;
        m.sy = y;
        this.Multiply(m, order);
    },
    Rotate: function (a, order) {
        var m = new CMatrix();
        var rad = deg2rad(a);
        m.sx = Math.cos(rad);
        m.shx = Math.sin(rad);
        m.shy = -Math.sin(rad);
        m.sy = Math.cos(rad);
        this.Multiply(m, order);
    },
    RotateAt: function (a, x, y, order) {
        this.Translate(-x, -y, order);
        this.Rotate(a, order);
        this.Translate(x, y, order);
    },
    Determinant: function () {
        return this.sx * this.sy - this.shy * this.shx;
    },
    Invert: function () {
        var det = this.Determinant();
        if (0.0001 > Math.abs(det)) {
            return;
        }
        var d = 1 / det;
        var t0 = this.sy * d;
        this.sy = this.sx * d;
        this.shy = -this.shy * d;
        this.shx = -this.shx * d;
        var t4 = -this.tx * t0 - this.ty * this.shx;
        this.ty = -this.tx * this.shy - this.ty * this.sy;
        this.sx = t0;
        this.tx = t4;
        return this;
    },
    TransformPointX: function (x, y) {
        return x * this.sx + y * this.shx + this.tx;
    },
    TransformPointY: function (x, y) {
        return x * this.shy + y * this.sy + this.ty;
    },
    GetRotation: function () {
        var x1 = 0;
        var y1 = 0;
        var x2 = 1;
        var y2 = 0;
        this.TransformPoint(x1, y1);
        this.TransformPoint(x2, y2);
        var a = Math.atan2(y2 - y1, x2 - x1);
        return rad2deg(a);
    },
    CreateDublicate: function () {
        var m = new CMatrix();
        m.sx = this.sx;
        m.shx = this.shx;
        m.shy = this.shy;
        m.sy = this.sy;
        m.tx = this.tx;
        m.ty = this.ty;
        return m;
    },
    IsIdentity: function () {
        if (this.sx == 1 && this.shx == 0 && this.shy == 0 && this.sy == 1 && this.tx == 0 && this.ty == 0) {
            return true;
        }
        return false;
    },
    IsIdentity2: function () {
        if (this.sx == 1 && this.shx == 0 && this.shy == 0 && this.sy == 1) {
            return true;
        }
        return false;
    }
};
function CMatrixL() {
    this.sx = 1;
    this.shx = 0;
    this.shy = 0;
    this.sy = 1;
    this.tx = 0;
    this.ty = 0;
}
CMatrixL.prototype = {
    CreateDublicate: function () {
        var m = new CMatrixL();
        m.sx = this.sx;
        m.shx = this.shx;
        m.shy = this.shy;
        m.sy = this.sy;
        m.tx = this.tx;
        m.ty = this.ty;
        return m;
    },
    Reset: function () {
        this.sx = 1;
        this.shx = 0;
        this.shy = 0;
        this.sy = 1;
        this.tx = 0;
        this.ty = 0;
    },
    TransformPointX: function (x, y) {
        return x * this.sx + y * this.shx + this.tx;
    },
    TransformPointY: function (x, y) {
        return x * this.shy + y * this.sy + this.ty;
    }
};
function CGlobalMatrixTransformer() {
    this.TranslateAppend = function (m, _tx, _ty) {
        m.tx += _tx;
        m.ty += _ty;
    };
    this.ScaleAppend = function (m, _sx, _sy) {
        m.sx *= _sx;
        m.shx *= _sx;
        m.shy *= _sy;
        m.sy *= _sy;
        m.tx *= _sx;
        m.ty *= _sy;
    };
    this.RotateRadAppend = function (m, _rad) {
        var _sx = Math.cos(_rad);
        var _shx = Math.sin(_rad);
        var _shy = -Math.sin(_rad);
        var _sy = Math.cos(_rad);
        var t0 = m.sx * _sx + m.shy * _shx;
        var t2 = m.shx * _sx + m.sy * _shx;
        var t4 = m.tx * _sx + m.ty * _shx;
        m.shy = m.sx * _shy + m.shy * _sy;
        m.sy = m.shx * _shy + m.sy * _sy;
        m.ty = m.tx * _shy + m.ty * _sy;
        m.sx = t0;
        m.shx = t2;
        m.tx = t4;
    };
    this.MultiplyAppend = function (m1, m2) {
        var t0 = m1.sx * m2.sx + m1.shy * m2.shx;
        var t2 = m1.shx * m2.sx + m1.sy * m2.shx;
        var t4 = m1.tx * m2.sx + m1.ty * m2.shx + m2.tx;
        m1.shy = m1.sx * m2.shy + m1.shy * m2.sy;
        m1.sy = m1.shx * m2.shy + m1.sy * m2.sy;
        m1.ty = m1.tx * m2.shy + m1.ty * m2.sy + m2.ty;
        m1.sx = t0;
        m1.shx = t2;
        m1.tx = t4;
    };
    this.Invert = function (m) {
        var newM = m.CreateDublicate();
        var det = newM.sx * newM.sy - newM.shy * newM.shx;
        if (0.0001 > Math.abs(det)) {
            return newM;
        }
        var d = 1 / det;
        var t0 = newM.sy * d;
        newM.sy = newM.sx * d;
        newM.shy = -newM.shy * d;
        newM.shx = -newM.shx * d;
        var t4 = -newM.tx * t0 - newM.ty * newM.shx;
        newM.ty = -newM.tx * newM.shy - newM.ty * newM.sy;
        newM.sx = t0;
        newM.tx = t4;
        return newM;
    };
    this.MultiplyAppendInvert = function (m1, m2) {
        var m = this.Invert(m2);
        this.MultiplyAppend(m1, m);
    };
    this.MultiplyPrepend = function (m1, m2) {
        var m = new CMatrixL();
        m.sx = m2.sx;
        m.shx = m2.shx;
        m.shy = m2.shy;
        m.sy = m2.sy;
        m.tx = m2.tx;
        m.ty = m2.ty;
        this.MultiplyAppend(m, m1);
        m1.sx = m.sx;
        m1.shx = m.shx;
        m1.shy = m.shy;
        m1.sy = m.sy;
        m1.tx = m.tx;
        m1.ty = m.ty;
    };
    this.CreateDublicateM = function (matrix) {
        var m = new CMatrixL();
        m.sx = matrix.sx;
        m.shx = matrix.shx;
        m.shy = matrix.shy;
        m.sy = matrix.sy;
        m.tx = matrix.tx;
        m.ty = matrix.ty;
    };
    this.IsIdentity = function (m) {
        if (m.sx == 1 && m.shx == 0 && m.shy == 0 && m.sy == 1 && m.tx == 0 && m.ty == 0) {
            return true;
        }
        return false;
    };
    this.IsIdentity2 = function (m) {
        if (m.sx == 1 && m.shx == 0 && m.shy == 0 && m.sy == 1) {
            return true;
        }
        return false;
    };
}
var global_MatrixTransformer = new CGlobalMatrixTransformer();
function CGraphics() {
    this.m_oContext = null;
    this.m_dWidthMM = 0;
    this.m_dHeightMM = 0;
    this.m_lWidthPix = 0;
    this.m_lHeightPix = 0;
    this.m_dDpiX = 96;
    this.m_dDpiY = 96;
    this.m_bIsBreak = false;
    this.textBB_l = 10000;
    this.textBB_t = 10000;
    this.textBB_r = -10000;
    this.textBB_b = -10000;
    this.m_oPen = new CPen();
    this.m_oBrush = new CBrush();
    this.m_oAutoShapesTrack = null;
    this.m_oFontManager = null;
    this.m_bIsFillTextCanvasColor = 0;
    this.m_oCoordTransform = new CMatrixL();
    this.m_oBaseTransform = new CMatrixL();
    this.m_oTransform = new CMatrixL();
    this.m_oFullTransform = new CMatrixL();
    this.m_oInvertFullTransform = new CMatrixL();
    this.ArrayPoints = null;
    this.m_oCurFont = null;
    this.m_oTextPr = null;
    this.m_oLastFont = new CFontSetup();
    this.m_bIntegerGrid = true;
    this.ClipManager = new CClipManager();
    this.ClipManager.BaseObject = this;
    this.TextureFillTransformScaleX = 1;
    this.TextureFillTransformScaleY = 1;
    this.IsThumbnail = false;
    this.GrState = new CGrState();
    this.GrState.Parent = this;
    this.globalAlpha = 1;
    this.TextClipRect = null;
    this.IsClipContext = false;
    this.ClearMode = false;
}
CGraphics.prototype = {
    init: function (context, width_px, height_px, width_mm, height_mm) {
        this.m_oContext = context;
        this.m_lHeightPix = height_px;
        this.m_lWidthPix = width_px;
        this.m_dWidthMM = width_mm;
        this.m_dHeightMM = height_mm;
        this.m_dDpiX = 25.4 * this.m_lWidthPix / this.m_dWidthMM;
        this.m_dDpiY = 25.4 * this.m_lHeightPix / this.m_dHeightMM;
        this.m_oCoordTransform.sx = this.m_dDpiX / 25.4;
        this.m_oCoordTransform.sy = this.m_dDpiY / 25.4;
        this.TextureFillTransformScaleX = 1 / this.m_oCoordTransform.sx;
        this.TextureFillTransformScaleY = 1 / this.m_oCoordTransform.sy;
        if (this.IsThumbnail) {
            this.TextureFillTransformScaleX *= (width_px / (width_mm * g_dKoef_mm_to_pix));
            this.TextureFillTransformScaleY *= (height_px / (height_mm * g_dKoef_mm_to_pix));
        }
        if (true == this.m_oContext.mozImageSmoothingEnabled) {
            this.m_oContext.mozImageSmoothingEnabled = false;
        }
        this.m_oLastFont.Clear();
        this.m_oContext.save();
    },
    EndDraw: function () {},
    put_GlobalAlpha: function (enable, alpha) {
        if (false === enable) {
            this.globalAlpha = 1;
            this.m_oContext.globalAlpha = 1;
        } else {
            this.globalAlpha = alpha;
            this.m_oContext.globalAlpha = alpha;
        }
    },
    p_color: function (r, g, b, a) {
        var _c = this.m_oPen.Color;
        _c.R = r;
        _c.G = g;
        _c.B = b;
        _c.A = a;
        this.m_oContext.strokeStyle = "rgba(" + _c.R + "," + _c.G + "," + _c.B + "," + (_c.A / 255) + ")";
    },
    p_width: function (w) {
        this.m_oPen.LineWidth = w / 1000;
        if (!this.m_bIntegerGrid) {
            this.m_oContext.lineWidth = this.m_oPen.LineWidth;
        } else {
            var _m = this.m_oFullTransform;
            var x = _m.sx + _m.shx;
            var y = _m.sy + _m.shy;
            var koef = Math.sqrt((x * x + y * y) / 2);
            this.m_oContext.lineWidth = this.m_oPen.LineWidth * koef;
        }
    },
    b_color1: function (r, g, b, a) {
        var _c = this.m_oBrush.Color1;
        _c.R = r;
        _c.G = g;
        _c.B = b;
        _c.A = a;
        this.m_oContext.fillStyle = "rgba(" + _c.R + "," + _c.G + "," + _c.B + "," + (_c.A / 255) + ")";
        this.m_bIsFillTextCanvasColor = 0;
    },
    b_color2: function (r, g, b, a) {
        var _c = this.m_oBrush.Color2;
        _c.R = r;
        _c.G = g;
        _c.B = b;
        _c.A = a;
    },
    transform: function (sx, shy, shx, sy, tx, ty) {
        var _t = this.m_oTransform;
        _t.sx = sx;
        _t.shx = shx;
        _t.shy = shy;
        _t.sy = sy;
        _t.tx = tx;
        _t.ty = ty;
        this.CalculateFullTransform();
        if (false === this.m_bIntegerGrid) {
            var _ft = this.m_oFullTransform;
            this.m_oContext.setTransform(_ft.sx, _ft.shy, _ft.shx, _ft.sy, _ft.tx, _ft.ty);
        }
        if (null != this.m_oFontManager) {
            this.m_oFontManager.SetTextMatrix(_t.sx, _t.shy, _t.shx, _t.sy, _t.tx, _t.ty);
        }
    },
    CalculateFullTransform: function (isInvertNeed) {
        var _ft = this.m_oFullTransform;
        var _t = this.m_oTransform;
        _ft.sx = _t.sx;
        _ft.shx = _t.shx;
        _ft.shy = _t.shy;
        _ft.sy = _t.sy;
        _ft.tx = _t.tx;
        _ft.ty = _t.ty;
        global_MatrixTransformer.MultiplyAppend(_ft, this.m_oCoordTransform);
        var _it = this.m_oInvertFullTransform;
        _it.sx = _ft.sx;
        _it.shx = _ft.shx;
        _it.shy = _ft.shy;
        _it.sy = _ft.sy;
        _it.tx = _ft.tx;
        _it.ty = _ft.ty;
        if (false !== isInvertNeed) {
            global_MatrixTransformer.MultiplyAppendInvert(_it, _t);
        }
    },
    _s: function () {
        this.m_oContext.beginPath();
    },
    _e: function () {
        this.m_oContext.beginPath();
    },
    _z: function () {
        this.m_oContext.closePath();
    },
    _m: function (x, y) {
        if (false === this.m_bIntegerGrid) {
            this.m_oContext.moveTo(x, y);
            if (this.ArrayPoints != null) {
                this.ArrayPoints[this.ArrayPoints.length] = {
                    x: x,
                    y: y
                };
            }
        } else {
            var _x = (this.m_oFullTransform.TransformPointX(x, y)) >> 0;
            var _y = (this.m_oFullTransform.TransformPointY(x, y)) >> 0;
            this.m_oContext.moveTo(_x + 0.5, _y + 0.5);
        }
    },
    _l: function (x, y) {
        if (false === this.m_bIntegerGrid) {
            this.m_oContext.lineTo(x, y);
            if (this.ArrayPoints != null) {
                this.ArrayPoints[this.ArrayPoints.length] = {
                    x: x,
                    y: y
                };
            }
        } else {
            var _x = (this.m_oFullTransform.TransformPointX(x, y)) >> 0;
            var _y = (this.m_oFullTransform.TransformPointY(x, y)) >> 0;
            this.m_oContext.lineTo(_x + 0.5, _y + 0.5);
        }
    },
    _c: function (x1, y1, x2, y2, x3, y3) {
        if (false === this.m_bIntegerGrid) {
            this.m_oContext.bezierCurveTo(x1, y1, x2, y2, x3, y3);
            if (this.ArrayPoints != null) {
                this.ArrayPoints[this.ArrayPoints.length] = {
                    x: x1,
                    y: y1
                };
                this.ArrayPoints[this.ArrayPoints.length] = {
                    x: x2,
                    y: y2
                };
                this.ArrayPoints[this.ArrayPoints.length] = {
                    x: x3,
                    y: y3
                };
            }
        } else {
            var _x1 = (this.m_oFullTransform.TransformPointX(x1, y1)) >> 0;
            var _y1 = (this.m_oFullTransform.TransformPointY(x1, y1)) >> 0;
            var _x2 = (this.m_oFullTransform.TransformPointX(x2, y2)) >> 0;
            var _y2 = (this.m_oFullTransform.TransformPointY(x2, y2)) >> 0;
            var _x3 = (this.m_oFullTransform.TransformPointX(x3, y3)) >> 0;
            var _y3 = (this.m_oFullTransform.TransformPointY(x3, y3)) >> 0;
            this.m_oContext.bezierCurveTo(_x1 + 0.5, _y1 + 0.5, _x2 + 0.5, _y2 + 0.5, _x3 + 0.5, _y3 + 0.5);
        }
    },
    _c2: function (x1, y1, x2, y2) {
        if (false === this.m_bIntegerGrid) {
            this.m_oContext.quadraticCurveTo(x1, y1, x2, y2);
            if (this.ArrayPoints != null) {
                this.ArrayPoints[this.ArrayPoints.length] = {
                    x: x1,
                    y: y1
                };
                this.ArrayPoints[this.ArrayPoints.length] = {
                    x: x2,
                    y: y2
                };
            }
        } else {
            var _x1 = (this.m_oFullTransform.TransformPointX(x1, y1)) >> 0;
            var _y1 = (this.m_oFullTransform.TransformPointY(x1, y1)) >> 0;
            var _x2 = (this.m_oFullTransform.TransformPointX(x2, y2)) >> 0;
            var _y2 = (this.m_oFullTransform.TransformPointY(x2, y2)) >> 0;
            this.m_oContext.quadraticCurveTo(_x1 + 0.5, _y1 + 0.5, _x2 + 0.5, _y2 + 0.5);
        }
    },
    ds: function () {
        this.m_oContext.stroke();
    },
    df: function () {
        this.m_oContext.fill();
    },
    save: function () {
        this.m_oContext.save();
    },
    restore: function () {
        this.m_oContext.restore();
    },
    clip: function () {
        this.m_oContext.clip();
    },
    reset: function () {
        this.m_oTransform.Reset();
        this.CalculateFullTransform(false);
        this.m_oContext.setTransform(this.m_oCoordTransform.sx, 0, 0, this.m_oCoordTransform.sy, 0, 0);
    },
    transform3: function (m, isNeedInvert) {
        var _t = this.m_oTransform;
        _t.sx = m.sx;
        _t.shx = m.shx;
        _t.shy = m.shy;
        _t.sy = m.sy;
        _t.tx = m.tx;
        _t.ty = m.ty;
        this.CalculateFullTransform(isNeedInvert);
        var _ft = this.m_oFullTransform;
        this.m_oContext.setTransform(_ft.sx, _ft.shy, _ft.shx, _ft.sy, _ft.tx, _ft.ty);
    },
    FreeFont: function () {
        this.m_oFontManager.m_pFont = null;
    },
    drawImage2: function (img, x, y, w, h, alpha, srcRect) {
        var isA = (undefined !== alpha && null != alpha && 255 != alpha);
        var _oldGA = 0;
        if (isA) {
            _oldGA = this.m_oContext.globalAlpha;
            this.m_oContext.globalAlpha = alpha / 255;
        }
        if (false === this.m_bIntegerGrid) {
            if (!srcRect) {
                if (!global_MatrixTransformer.IsIdentity2(this.m_oTransform)) {
                    this.m_oContext.drawImage(img, x, y, w, h);
                } else {
                    var xx = this.m_oFullTransform.TransformPointX(x, y);
                    var yy = this.m_oFullTransform.TransformPointY(x, y);
                    var rr = this.m_oFullTransform.TransformPointX(x + w, y + h);
                    var bb = this.m_oFullTransform.TransformPointY(x + w, y + h);
                    var ww = rr - xx;
                    var hh = bb - yy;
                    if (Math.abs(img.width - ww) < 2 && Math.abs(img.height - hh) < 2) {
                        this.m_oContext.setTransform(1, 0, 0, 1, 0, 0);
                        this.m_oContext.drawImage(img, xx >> 0, yy >> 0);
                        var _ft = this.m_oFullTransform;
                        this.m_oContext.setTransform(_ft.sx, _ft.shy, _ft.shx, _ft.sy, _ft.tx, _ft.ty);
                    } else {
                        this.m_oContext.drawImage(img, x, y, w, h);
                    }
                }
            } else {
                var _w = img.width;
                var _h = img.height;
                if (_w > 0 && _h > 0) {
                    var __w = w;
                    var __h = h;
                    var _delW = Math.max(0, -srcRect.l) + Math.max(0, srcRect.r - 100) + 100;
                    var _delH = Math.max(0, -srcRect.t) + Math.max(0, srcRect.b - 100) + 100;
                    var _sx = 0;
                    if (srcRect.l > 0 && srcRect.l < 100) {
                        _sx = Math.min((_w * srcRect.l / 100) >> 0, _w - 1);
                    } else {
                        if (srcRect.l < 0) {
                            var _off = ((-srcRect.l / _delW) * __w);
                            x += _off;
                            w -= _off;
                        }
                    }
                    var _sy = 0;
                    if (srcRect.t > 0 && srcRect.t < 100) {
                        _sy = Math.min((_h * srcRect.t / 100) >> 0, _h - 1);
                    } else {
                        if (srcRect.t < 0) {
                            var _off = ((-srcRect.t / _delH) * __h);
                            y += _off;
                            h -= _off;
                        }
                    }
                    var _sr = _w;
                    if (srcRect.r > 0 && srcRect.r < 100) {
                        _sr = Math.max(Math.min((_w * srcRect.r / 100) >> 0, _w - 1), _sx);
                    } else {
                        if (srcRect.r > 100) {
                            var _off = ((srcRect.r - 100) / _delW) * __w;
                            w -= _off;
                        }
                    }
                    var _sb = _h;
                    if (srcRect.b > 0 && srcRect.b < 100) {
                        _sb = Math.max(Math.min((_h * srcRect.b / 100) >> 0, _h - 1), _sy);
                    } else {
                        if (srcRect.b > 100) {
                            var _off = ((srcRect.b - 100) / _delH) * __h;
                            h -= _off;
                        }
                    }
                    this.m_oContext.drawImage(img, _sx, _sy, _sr - _sx, _sb - _sy, x, y, w, h);
                } else {
                    this.m_oContext.drawImage(img, x, y, w, h);
                }
            }
        } else {
            var _x1 = (this.m_oFullTransform.TransformPointX(x, y)) >> 0;
            var _y1 = (this.m_oFullTransform.TransformPointY(x, y)) >> 0;
            var _x2 = (this.m_oFullTransform.TransformPointX(x + w, y + h)) >> 0;
            var _y2 = (this.m_oFullTransform.TransformPointY(x + w, y + h)) >> 0;
            x = _x1;
            y = _y1;
            w = _x2 - _x1;
            h = _y2 - _y1;
            if (!srcRect) {
                if (!global_MatrixTransformer.IsIdentity2(this.m_oTransform)) {
                    this.m_oContext.drawImage(img, _x1, _y1, w, h);
                } else {
                    if (Math.abs(img.width - w) < 2 && Math.abs(img.height - h) < 2) {
                        this.m_oContext.drawImage(img, x, y);
                    } else {
                        this.m_oContext.drawImage(img, _x1, _y1, w, h);
                    }
                }
            } else {
                var _w = img.width;
                var _h = img.height;
                if (_w > 0 && _h > 0) {
                    var __w = w;
                    var __h = h;
                    var _delW = Math.max(0, -srcRect.l) + Math.max(0, srcRect.r - 100) + 100;
                    var _delH = Math.max(0, -srcRect.t) + Math.max(0, srcRect.b - 100) + 100;
                    var _sx = 0;
                    if (srcRect.l > 0 && srcRect.l < 100) {
                        _sx = Math.min((_w * srcRect.l / 100) >> 0, _w - 1);
                    } else {
                        if (srcRect.l < 0) {
                            var _off = ((-srcRect.l / _delW) * __w);
                            x += _off;
                            w -= _off;
                        }
                    }
                    var _sy = 0;
                    if (srcRect.t > 0 && srcRect.t < 100) {
                        _sy = Math.min((_h * srcRect.t / 100) >> 0, _h - 1);
                    } else {
                        if (srcRect.t < 0) {
                            var _off = ((-srcRect.t / _delH) * __h);
                            y += _off;
                            h -= _off;
                        }
                    }
                    var _sr = _w;
                    if (srcRect.r > 0 && srcRect.r < 100) {
                        _sr = Math.max(Math.min((_w * srcRect.r / 100) >> 0, _w - 1), _sx);
                    } else {
                        if (srcRect.r > 100) {
                            var _off = ((srcRect.r - 100) / _delW) * __w;
                            w -= _off;
                        }
                    }
                    var _sb = _h;
                    if (srcRect.b > 0 && srcRect.b < 100) {
                        _sb = Math.max(Math.min((_h * srcRect.b / 100) >> 0, _h - 1), _sy);
                    } else {
                        if (srcRect.b > 100) {
                            var _off = ((srcRect.b - 100) / _delH) * __h;
                            h -= _off;
                        }
                    }
                    this.m_oContext.drawImage(img, _sx, _sy, _sr - _sx, _sb - _sy, x, y, w, h);
                } else {
                    this.m_oContext.drawImage(img, x, y, w, h);
                }
            }
        }
        if (isA) {
            this.m_oContext.globalAlpha = _oldGA;
        }
    },
    drawImage: function (img, x, y, w, h, alpha, srcRect, nativeImage) {
        if (nativeImage) {
            this.drawImage2(nativeImage, x, y, w, h, alpha, srcRect);
            return;
        }
        var editor = window["Asc"]["editor"];
        var _img = editor.ImageLoader.map_image_index[img];
        if (_img != undefined && _img.Status == ImageLoadStatus.Loading) {} else {
            if (_img != undefined && _img.Image != null) {
                this.drawImage2(_img.Image, x, y, w, h, alpha, srcRect);
            } else {
                var _x = x;
                var _y = y;
                var _r = x + w;
                var _b = y + h;
                if (this.m_bIntegerGrid) {
                    _x = this.m_oFullTransform.TransformPointX(x, y);
                    _y = this.m_oFullTransform.TransformPointY(x, y);
                    _r = this.m_oFullTransform.TransformPointX(x + w, y + h);
                    _b = this.m_oFullTransform.TransformPointY(x + w, y + h);
                }
                var ctx = this.m_oContext;
                var old_p = ctx.lineWidth;
                ctx.beginPath();
                ctx.moveTo(_x, _y);
                ctx.lineTo(_r, _b);
                ctx.moveTo(_r, _y);
                ctx.lineTo(_x, _b);
                ctx.strokeStyle = "#FF0000";
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(_x, _y);
                ctx.lineTo(_r, _y);
                ctx.lineTo(_r, _b);
                ctx.lineTo(_x, _b);
                ctx.closePath();
                ctx.lineWidth = 1;
                ctx.strokeStyle = "#000000";
                ctx.stroke();
                ctx.beginPath();
                ctx.lineWidth = old_p;
                ctx.strokeStyle = "rgba(" + this.m_oPen.Color.R + "," + this.m_oPen.Color.G + "," + this.m_oPen.Color.B + "," + (this.m_oPen.Color.A / 255) + ")";
            }
        }
    },
    GetFont: function () {
        return this.m_oCurFont;
    },
    font: function (font_id, font_size, matrix) {
        window.g_font_infos[window.g_map_font_index[font_id]].LoadFont(editor.FontLoader, this.m_oFontManager, font_size, 0, this.m_dDpiX, this.m_dDpiY, undefined);
    },
    SetFont: function (font) {
        if (null == font) {
            return;
        }
        this.m_oCurFont = {
            FontFamily: {
                Index: font.FontFamily.Index,
                Name: font.FontFamily.Name
            },
            FontSize: font.FontSize,
            Bold: font.Bold,
            Italic: font.Italic
        };
        if (-1 == font.FontFamily.Index || undefined === font.FontFamily.Index || null == font.FontFamily.Index) {
            font.FontFamily.Index = window.g_map_font_index[font.FontFamily.Name];
        }
        if (font.FontFamily.Index == undefined || font.FontFamily.Index == -1) {
            return;
        }
        var bItalic = true === font.Italic;
        var bBold = true === font.Bold;
        var oFontStyle = FontStyle.FontStyleRegular;
        if (!bItalic && bBold) {
            oFontStyle = FontStyle.FontStyleBold;
        } else {
            if (bItalic && !bBold) {
                oFontStyle = FontStyle.FontStyleItalic;
            } else {
                if (bItalic && bBold) {
                    oFontStyle = FontStyle.FontStyleBoldItalic;
                }
            }
        }
        this.m_oLastFont.SetUpIndex = font.FontFamily.Index;
        this.m_oLastFont.SetUpSize = font.FontSize;
        this.m_oLastFont.SetUpStyle = oFontStyle;
        window.g_font_infos[font.FontFamily.Index].LoadFont(window.g_font_loader, this.m_oFontManager, font.FontSize, oFontStyle, this.m_dDpiX, this.m_dDpiY, this.m_oTransform);
        var _mD = this.m_oLastFont.SetUpMatrix;
        var _mS = this.m_oTransform;
        _mD.sx = _mS.sx;
        _mD.sy = _mS.sy;
        _mD.shx = _mS.shx;
        _mD.shy = _mS.shy;
        _mD.tx = _mS.tx;
        _mD.ty = _mS.ty;
    },
    SetTextPr: function (textPr) {
        this.m_oTextPr = textPr.Copy();
    },
    SetFontSlot: function (slot, fontSizeKoef) {
        var _rfonts = this.m_oTextPr.RFonts;
        var _lastFont = this.m_oLastFont;
        switch (slot) {
        case fontslot_ASCII:
            _lastFont.Name = _rfonts.Ascii.Name;
            _lastFont.Index = _rfonts.Ascii.Index;
            if (_lastFont.Index == -1 || _lastFont.Index === undefined) {
                _lastFont.Index = window.g_map_font_index[_lastFont.Name];
            }
            _lastFont.Size = this.m_oTextPr.FontSize;
            _lastFont.Bold = this.m_oTextPr.Bold;
            _lastFont.Italic = this.m_oTextPr.Italic;
            break;
        case fontslot_CS:
            _lastFont.Name = _rfonts.CS.Name;
            _lastFont.Index = _rfonts.CS.Index;
            if (_lastFont.Index == -1 || _lastFont.Index === undefined) {
                _lastFont.Index = window.g_map_font_index[_lastFont.Name];
            }
            _lastFont.Size = this.m_oTextPr.FontSizeCS;
            _lastFont.Bold = this.m_oTextPr.BoldCS;
            _lastFont.Italic = this.m_oTextPr.ItalicCS;
            break;
        case fontslot_EastAsia:
            _lastFont.Name = _rfonts.EastAsia.Name;
            _lastFont.Index = _rfonts.EastAsia.Index;
            if (_lastFont.Index == -1 || _lastFont.Index === undefined) {
                _lastFont.Index = window.g_map_font_index[_lastFont.Name];
            }
            _lastFont.Size = this.m_oTextPr.FontSize;
            _lastFont.Bold = this.m_oTextPr.Bold;
            _lastFont.Italic = this.m_oTextPr.Italic;
            break;
        case fontslot_HAnsi:
            default:
            _lastFont.Name = _rfonts.HAnsi.Name;
            _lastFont.Index = _rfonts.HAnsi.Index;
            if (_lastFont.Index == -1 || _lastFont.Index === undefined) {
                _lastFont.Index = window.g_map_font_index[_lastFont.Name];
            }
            _lastFont.Size = this.m_oTextPr.FontSize;
            _lastFont.Bold = this.m_oTextPr.Bold;
            _lastFont.Italic = this.m_oTextPr.Italic;
            break;
        }
        if (undefined !== fontSizeKoef) {
            _lastFont.Size *= fontSizeKoef;
        }
        var _style = 0;
        if (_lastFont.Italic) {
            _style += 2;
        }
        if (_lastFont.Bold) {
            _style += 1;
        }
        if (_lastFont.Index != _lastFont.SetUpIndex || _lastFont.Size != _lastFont.SetUpSize || _style != _lastFont.SetUpStyle) {
            _lastFont.SetUpIndex = _lastFont.Index;
            _lastFont.SetUpSize = _lastFont.Size;
            _lastFont.SetUpStyle = _style;
            window.g_font_infos[_lastFont.SetUpIndex].LoadFont(window.g_font_loader, this.m_oFontManager, _lastFont.SetUpSize, _lastFont.SetUpStyle, this.m_dDpiX, this.m_dDpiY, this.m_oTransform);
        } else {
            var _mD = this.m_oLastFont.SetUpMatrix;
            var _mS = this.m_oTransform;
            if (_mD.sx != _mS.sx || _mD.sy != _mS.sy || _mD.shx != _mS.shx || _mD.shy != _mS.shy || _mD.tx != _mS.tx || _mD.ty != _mS.ty) {
                _mD.sx = _mS.sx;
                _mD.sy = _mS.sy;
                _mD.shx = _mS.shx;
                _mD.shy = _mS.shy;
                _mD.tx = _mS.tx;
                _mD.ty = _mS.ty;
                this.m_oFontManager.SetTextMatrix(_mD.sx, _mD.shy, _mD.shx, _mD.sy, _mD.tx, _mD.ty);
            }
        }
    },
    GetTextPr: function () {
        return this.m_oTextPr;
    },
    FillText: function (x, y, text) {
        if (this.m_bIsBreak) {
            return;
        }
        var _x = this.m_oInvertFullTransform.TransformPointX(x, y);
        var _y = this.m_oInvertFullTransform.TransformPointY(x, y);
        try {
            this.m_oFontManager.LoadString2C(text, _x, _y);
        } catch(err) {}
        if (false === this.m_bIntegerGrid) {
            this.m_oContext.setTransform(1, 0, 0, 1, 0, 0);
        }
        var pGlyph = this.m_oFontManager.m_oGlyphString.m_pGlyphsBuffer[0];
        if (null == pGlyph) {
            return;
        }
        if (null != pGlyph.oBitmap) {
            this.private_FillGlyph(pGlyph);
        }
        if (false === this.m_bIntegerGrid) {
            this.m_oContext.setTransform(this.m_oFullTransform.sx, this.m_oFullTransform.shy, this.m_oFullTransform.shx, this.m_oFullTransform.sy, this.m_oFullTransform.tx, this.m_oFullTransform.ty);
        }
    },
    t: function (text, x, y) {
        if (this.m_bIsBreak) {
            return;
        }
        var _x = this.m_oInvertFullTransform.TransformPointX(x, y);
        var _y = this.m_oInvertFullTransform.TransformPointY(x, y);
        try {
            this.m_oFontManager.LoadString2(text, _x, _y);
        } catch(err) {}
        this.m_oContext.setTransform(1, 0, 0, 1, 0, 0);
        while (true) {
            var pGlyph = this.m_oFontManager.GetNextChar2();
            if (null == pGlyph) {
                break;
            }
            if (null != pGlyph.oBitmap) {
                this.private_FillGlyph(pGlyph);
            }
        }
        if (false === this.m_bIntegerGrid) {
            this.m_oContext.setTransform(this.m_oFullTransform.sx, this.m_oFullTransform.shy, this.m_oFullTransform.shx, this.m_oFullTransform.sy, this.m_oFullTransform.tx, this.m_oFullTransform.ty);
        }
    },
    FillText2: function (x, y, text, cropX, cropW) {
        if (this.m_bIsBreak) {
            return;
        }
        var _x = this.m_oInvertFullTransform.TransformPointX(x, y);
        var _y = this.m_oInvertFullTransform.TransformPointY(x, y);
        try {
            this.m_oFontManager.LoadString2C(text, _x, _y);
        } catch(err) {}
        this.m_oContext.setTransform(1, 0, 0, 1, 0, 0);
        var pGlyph = this.m_oFontManager.m_oGlyphString.m_pGlyphsBuffer[0];
        if (null == pGlyph) {
            return;
        }
        if (null != pGlyph.oBitmap) {
            this.private_FillGlyphC(pGlyph, cropX, cropW);
        }
        if (false === this.m_bIntegerGrid) {
            this.m_oContext.setTransform(this.m_oFullTransform.sx, this.m_oFullTransform.shy, this.m_oFullTransform.shx, this.m_oFullTransform.sy, this.m_oFullTransform.tx, this.m_oFullTransform.ty);
        }
    },
    t2: function (text, x, y, cropX, cropW) {
        if (this.m_bIsBreak) {
            return;
        }
        var _x = this.m_oInvertFullTransform.TransformPointX(x, y);
        var _y = this.m_oInvertFullTransform.TransformPointY(x, y);
        try {
            this.m_oFontManager.LoadString2(text, _x, _y);
        } catch(err) {}
        this.m_oContext.setTransform(1, 0, 0, 1, 0, 0);
        while (true) {
            var pGlyph = this.m_oFontManager.GetNextChar2();
            if (null == pGlyph) {
                break;
            }
            if (null != pGlyph.oBitmap) {
                this.private_FillGlyphC(pGlyph, cropX, cropW);
            }
        }
        if (false === this.m_bIntegerGrid) {
            this.m_oContext.setTransform(this.m_oFullTransform.sx, this.m_oFullTransform.shy, this.m_oFullTransform.shx, this.m_oFullTransform.sy, this.m_oFullTransform.tx, this.m_oFullTransform.ty);
        }
    },
    FillTextCode: function (x, y, lUnicode) {
        if (this.m_bIsBreak) {
            return;
        }
        var _x = this.m_oInvertFullTransform.TransformPointX(x, y);
        var _y = this.m_oInvertFullTransform.TransformPointY(x, y);
        try {
            this.m_oFontManager.LoadString4C(lUnicode, _x, _y);
        } catch(err) {}
        if (false === this.m_bIntegerGrid) {
            this.m_oContext.setTransform(1, 0, 0, 1, 0, 0);
        }
        var pGlyph = this.m_oFontManager.m_oGlyphString.m_pGlyphsBuffer[0];
        if (null == pGlyph) {
            return;
        }
        if (null != pGlyph.oBitmap) {
            this.private_FillGlyph(pGlyph);
        }
        if (false === this.m_bIntegerGrid) {
            this.m_oContext.setTransform(this.m_oFullTransform.sx, this.m_oFullTransform.shy, this.m_oFullTransform.shx, this.m_oFullTransform.sy, this.m_oFullTransform.tx, this.m_oFullTransform.ty);
        }
    },
    tg: function (text, x, y) {
        if (this.m_bIsBreak) {
            return;
        }
        var _x = this.m_oInvertFullTransform.TransformPointX(x, y);
        var _y = this.m_oInvertFullTransform.TransformPointY(x, y);
        try {
            this.m_oFontManager.LoadString3C(text, _x, _y);
        } catch(err) {}
        if (false === this.m_bIntegerGrid) {
            this.m_oContext.setTransform(1, 0, 0, 1, 0, 0);
        }
        var pGlyph = this.m_oFontManager.m_oGlyphString.m_pGlyphsBuffer[0];
        if (null == pGlyph) {
            return;
        }
        if (null != pGlyph.oBitmap) {
            var _a = this.m_oBrush.Color1.A;
            if (255 != _a) {
                this.m_oContext.globalAlpha = _a / 255;
            }
            this.private_FillGlyph(pGlyph);
            if (255 != _a) {
                this.m_oContext.globalAlpha = 1;
            }
        }
        if (false === this.m_bIntegerGrid) {
            this.m_oContext.setTransform(this.m_oFullTransform.sx, this.m_oFullTransform.shy, this.m_oFullTransform.shx, this.m_oFullTransform.sy, this.m_oFullTransform.tx, this.m_oFullTransform.ty);
        }
    },
    charspace: function (space) {},
    private_FillGlyph: function (pGlyph) {
        var nW = pGlyph.oBitmap.nWidth;
        var nH = pGlyph.oBitmap.nHeight;
        if (0 == nW || 0 == nH) {
            return;
        }
        var nX = (this.m_oFontManager.m_oGlyphString.m_fX + pGlyph.fX + pGlyph.oBitmap.nX) >> 0;
        var nY = (this.m_oFontManager.m_oGlyphString.m_fY + pGlyph.fY - pGlyph.oBitmap.nY) >> 0;
        pGlyph.oBitmap.oGlyphData.checkColor(this.m_oBrush.Color1.R, this.m_oBrush.Color1.G, this.m_oBrush.Color1.B, nW, nH);
        if (null == this.TextClipRect) {
            pGlyph.oBitmap.draw(this.m_oContext, nX, nY, this.TextClipRect);
        } else {
            pGlyph.oBitmap.drawCropInRect(this.m_oContext, nX, nY, this.TextClipRect);
        }
    },
    private_FillGlyphC: function (pGlyph, cropX, cropW) {
        var nW = pGlyph.oBitmap.nWidth;
        var nH = pGlyph.oBitmap.nHeight;
        if (0 == nW || 0 == nH) {
            return;
        }
        var nX = (this.m_oFontManager.m_oGlyphString.m_fX + pGlyph.fX + pGlyph.oBitmap.nX) >> 0;
        var nY = (this.m_oFontManager.m_oGlyphString.m_fY + pGlyph.fY - pGlyph.oBitmap.nY) >> 0;
        var d_koef = this.m_dDpiX / 25.4;
        var cX = Math.max((cropX * d_koef) >> 0, 0);
        var cW = Math.min((cropW * d_koef) >> 0, nW);
        if (cW <= 0) {
            cW = 1;
        }
        pGlyph.oBitmap.oGlyphData.checkColor(this.m_oBrush.Color1.R, this.m_oBrush.Color1.G, this.m_oBrush.Color1.B, nW, nH);
        pGlyph.oBitmap.drawCrop(this.m_oContext, nX, nY, cW, nH, cX);
    },
    private_FillGlyph2: function (pGlyph) {
        var i = 0;
        var j = 0;
        var nW = pGlyph.oBitmap.nWidth;
        var nH = pGlyph.oBitmap.nHeight;
        if (0 == nW || 0 == nH) {
            return;
        }
        var nX = parseInt(this.m_oFontManager.m_oGlyphString.m_fX + pGlyph.fX + pGlyph.oBitmap.nX);
        var nY = parseInt(this.m_oFontManager.m_oGlyphString.m_fY + pGlyph.fY - pGlyph.oBitmap.nY);
        var imageData = this.m_oContext.getImageData(nX, nY, nW, nH);
        var pPixels = imageData.data;
        var _r = this.m_oBrush.Color1.R;
        var _g = this.m_oBrush.Color1.G;
        var _b = this.m_oBrush.Color1.B;
        for (; j < nH; ++j) {
            var indx = 4 * j * nW;
            for (i = 0; i < nW; ++i) {
                var weight = pGlyph.oBitmap.pData[j * pGlyph.oBitmap.nWidth + i];
                if (255 == weight) {
                    pPixels[indx] = _r;
                    pPixels[indx + 1] = _g;
                    pPixels[indx + 2] = _b;
                    pPixels[indx + 3] = 255;
                } else {
                    var r = pPixels[indx];
                    var g = pPixels[indx + 1];
                    var b = pPixels[indx + 2];
                    var a = pPixels[indx + 3];
                    pPixels[indx] = ((_r - r) * weight + (r << 8)) >>> 8;
                    pPixels[indx + 1] = ((_g - g) * weight + (g << 8)) >>> 8;
                    pPixels[indx + 2] = ((_b - b) * weight + (b << 8)) >>> 8;
                    pPixels[indx + 3] = (weight + a) - ((weight * a + 256) >>> 8);
                }
                indx += 4;
            }
        }
        this.m_oContext.putImageData(imageData, nX, nY);
    },
    SetIntegerGrid: function (param) {
        if (true == param) {
            this.m_bIntegerGrid = true;
            this.m_oContext.setTransform(1, 0, 0, 1, 0, 0);
        } else {
            this.m_bIntegerGrid = false;
            this.m_oContext.setTransform(this.m_oFullTransform.sx, this.m_oFullTransform.shy, this.m_oFullTransform.shx, this.m_oFullTransform.sy, this.m_oFullTransform.tx, this.m_oFullTransform.ty);
        }
    },
    GetIntegerGrid: function () {
        return this.m_bIntegerGrid;
    },
    DrawHeaderEdit: function (yPos, lock_type) {
        var _y = this.m_oFullTransform.TransformPointY(0, yPos);
        _y = (_y >> 0) + 0.5;
        var _x = 0;
        var _wmax = this.m_lWidthPix;
        var _w1 = 6;
        var _w2 = 3;
        var ctx = this.m_oContext;
        switch (lock_type) {
        case locktype_None:
            case locktype_Mine:
            this.p_color(155, 187, 277, 255);
            ctx.lineWidth = 2;
            break;
        case locktype_Other:
            case locktype_Other2:
            this.p_color(238, 53, 37, 255);
            ctx.lineWidth = 1;
            _w1 = 2;
            _w2 = 1;
            break;
        default:
            this.p_color(155, 187, 277, 255);
            ctx.lineWidth = 2;
            _w1 = 2;
            _w2 = 1;
        }
        if (true === this.m_bIntegerGrid) {
            this._s();
            while (true) {
                if (_x > _wmax) {
                    break;
                }
                ctx.moveTo(_x, _y);
                _x += _w1;
                ctx.lineTo(_x, _y);
                _x += _w2;
            }
            this.ds();
        } else {
            this.SetIntegerGrid(true);
            this._s();
            while (true) {
                if (_x > _wmax) {
                    break;
                }
                ctx.moveTo(_x, _y);
                _x += _w1;
                ctx.lineTo(_x, _y);
                _x += _w2;
            }
            this.ds();
            this.SetIntegerGrid(false);
        }
    },
    DrawFooterEdit: function (yPos, lock_type) {
        var _y = this.m_oFullTransform.TransformPointY(0, yPos);
        _y = (_y >> 0) + 0.5;
        var _x = 0;
        var _w1 = 6;
        var _w2 = 3;
        var ctx = this.m_oContext;
        switch (lock_type) {
        case locktype_None:
            case locktype_Mine:
            this.p_color(155, 187, 277, 255);
            ctx.lineWidth = 2;
            break;
        case locktype_Other:
            case locktype_Other2:
            this.p_color(238, 53, 37, 255);
            ctx.lineWidth = 1;
            _w1 = 2;
            _w2 = 1;
            break;
        default:
            this.p_color(155, 187, 277, 255);
            ctx.lineWidth = 2;
            _w1 = 2;
            _w2 = 1;
        }
        var _wmax = this.m_lWidthPix;
        if (true === this.m_bIntegerGrid) {
            this._s();
            while (true) {
                if (_x > _wmax) {
                    break;
                }
                ctx.moveTo(_x, _y);
                _x += _w1;
                ctx.lineTo(_x, _y);
                _x += _w2;
            }
            this.ds();
        } else {
            this.SetIntegerGrid(true);
            this._s();
            while (true) {
                if (_x > _wmax) {
                    break;
                }
                ctx.moveTo(_x, _y);
                _x += _w1;
                ctx.lineTo(_x, _y);
                _x += _w2;
            }
            this.ds();
            this.SetIntegerGrid(false);
        }
    },
    DrawLockParagraph: function (lock_type, x, y1, y2) {
        if (lock_type == c_oAscLockTypes.kLockTypeNone || editor.WordControl.m_oDrawingDocument.IsLockObjectsEnable === false || editor.isViewMode) {
            return;
        }
        if (lock_type == c_oAscLockTypes.kLockTypeMine) {
            this.p_color(22, 156, 0, 255);
        } else {
            this.p_color(238, 53, 37, 255);
        }
        var _x = this.m_oFullTransform.TransformPointX(x, y1) >> 0;
        var _xT = this.m_oFullTransform.TransformPointX(x, y2) >> 0;
        var _y1 = (this.m_oFullTransform.TransformPointY(x, y1) >> 0) + 0.5;
        var _y2 = (this.m_oFullTransform.TransformPointY(x, y2) >> 0) - 1.5;
        var ctx = this.m_oContext;
        if (_x != _xT) {
            var dKoefMMToPx = 1 / Math.max(this.m_oCoordTransform.sx, 0.001);
            this.p_width(1000 * dKoefMMToPx);
            var w_dot = 2 * dKoefMMToPx;
            var w_dist = 1 * dKoefMMToPx;
            var w_len_indent = 3;
            var _interf = editor.WordControl.m_oDrawingDocument.AutoShapesTrack;
            this._s();
            _interf.AddLineDash(ctx, x, y1, x, y2, w_dot, w_dist);
            _interf.AddLineDash(ctx, x, y1, x + w_len_indent, y1, w_dot, w_dist);
            _interf.AddLineDash(ctx, x, y2, x + w_len_indent, y2, w_dot, w_dist);
            this.ds();
            return;
        }
        var bIsInt = this.m_bIntegerGrid;
        if (!bIsInt) {
            this.SetIntegerGrid(true);
        }
        ctx.lineWidth = 1;
        var w_dot = 2;
        var w_dist = 1;
        var w_len_indent = (3 * this.m_oCoordTransform.sx) >> 0;
        this._s();
        var y_mem = _y1 - 0.5;
        while (true) {
            if ((y_mem + w_dot) > _y2) {
                break;
            }
            ctx.moveTo(_x + 0.5, y_mem);
            y_mem += w_dot;
            ctx.lineTo(_x + 0.5, y_mem);
            y_mem += w_dist;
        }
        var x_max = _x + w_len_indent;
        var x_mem = _x;
        while (true) {
            if (x_mem > x_max) {
                break;
            }
            ctx.moveTo(x_mem, _y1);
            x_mem += w_dot;
            ctx.lineTo(x_mem, _y1);
            x_mem += w_dist;
        }
        x_mem = _x;
        while (true) {
            if (x_mem > x_max) {
                break;
            }
            ctx.moveTo(x_mem, _y2);
            x_mem += w_dot;
            ctx.lineTo(x_mem, _y2);
            x_mem += w_dist;
        }
        this.ds();
        if (!bIsInt) {
            this.SetIntegerGrid(false);
        }
    },
    DrawLockObjectRect: function (lock_type, x, y, w, h) {
        if (lock_type == c_oAscLockTypes.kLockTypeNone) {
            return;
        }
        if (lock_type == c_oAscLockTypes.kLockTypeMine) {
            this.p_color(22, 156, 0, 255);
        } else {
            this.p_color(238, 53, 37, 255);
        }
        var ctx = this.m_oContext;
        var _m = this.m_oTransform;
        if (_m.sx != 1 || _m.shx != 0 || _m.shy != 0 || _m.sy != 1) {
            var dKoefMMToPx = 1 / Math.max(this.m_oCoordTransform.sx, 0.001);
            this.p_width(1000 * dKoefMMToPx);
            var w_dot = 2 * dKoefMMToPx;
            var w_dist = 1 * dKoefMMToPx;
            var _interf = this.m_oAutoShapesTrack;
            var eps = 5 * dKoefMMToPx;
            var _x = x - eps;
            var _y = y - eps;
            var _r = x + w + eps;
            var _b = y + h + eps;
            this._s();
            _interf.AddRectDash(ctx, _x, _y, _r, _y, _x, _b, _r, _b, w_dot, w_dist);
            this.ds();
            return;
        }
        var bIsInt = this.m_bIntegerGrid;
        if (!bIsInt) {
            this.SetIntegerGrid(true);
        }
        ctx.lineWidth = 1;
        var w_dot = 2;
        var w_dist = 2;
        var eps = 5;
        var _x = (this.m_oFullTransform.TransformPointX(x, y) >> 0) - eps + 0.5;
        var _y = (this.m_oFullTransform.TransformPointY(x, y) >> 0) - eps + 0.5;
        var _r = (this.m_oFullTransform.TransformPointX(x + w, y + h) >> 0) + eps + 0.5;
        var _b = (this.m_oFullTransform.TransformPointY(x + w, y + h) >> 0) + eps + 0.5;
        this._s();
        for (var i = _x; i < _r; i += w_dist) {
            ctx.moveTo(i, _y);
            i += w_dot;
            if (i > _r) {
                i = _r;
            }
            ctx.lineTo(i, _y);
        }
        for (var i = _y; i < _b; i += w_dist) {
            ctx.moveTo(_r, i);
            i += w_dot;
            if (i > _b) {
                i = _b;
            }
            ctx.lineTo(_r, i);
        }
        for (var i = _r; i > _x; i -= w_dist) {
            ctx.moveTo(i, _b);
            i -= w_dot;
            if (i < _x) {
                i = _x;
            }
            ctx.lineTo(i, _b);
        }
        for (var i = _b; i > _y; i -= w_dist) {
            ctx.moveTo(_x, i);
            i -= w_dot;
            if (i < _y) {
                i = _y;
            }
            ctx.lineTo(_x, i);
        }
        this.ds();
        if (!bIsInt) {
            this.SetIntegerGrid(false);
        }
    },
    DrawEmptyTableLine: function (x1, y1, x2, y2) {
        if (!editor.isShowTableEmptyLine) {
            return;
        }
        var _x1 = this.m_oFullTransform.TransformPointX(x1, y1);
        var _y1 = this.m_oFullTransform.TransformPointY(x1, y1);
        var _x2 = this.m_oFullTransform.TransformPointX(x2, y2);
        var _y2 = this.m_oFullTransform.TransformPointY(x2, y2);
        _x1 = (_x1 >> 0) + 0.5;
        _y1 = (_y1 >> 0) + 0.5;
        _x2 = (_x2 >> 0) + 0.5;
        _y2 = (_y2 >> 0) + 0.5;
        this.p_color(138, 162, 191, 255);
        var ctx = this.m_oContext;
        if (_x1 != _x2 && _y1 != _y2) {
            var dKoefMMToPx = 1 / Math.max(this.m_oCoordTransform.sx, 0.001);
            this.p_width(1000 * dKoefMMToPx);
            this._s();
            editor.WordControl.m_oDrawingDocument.AutoShapesTrack.AddLineDash(ctx, x1, y1, x2, y2, 2 * dKoefMMToPx, 2 * dKoefMMToPx);
            this.ds();
            return;
        }
        ctx.lineWidth = 1;
        var bIsInt = this.m_bIntegerGrid;
        if (!bIsInt) {
            this.SetIntegerGrid(true);
        }
        if (_x1 == _x2) {
            var _y = Math.min(_y1, _y2) + 0.5;
            var _w1 = 2;
            var _w2 = 2;
            var _wmax = Math.max(_y1, _y2) - 0.5;
            this._s();
            while (true) {
                if (_y > _wmax) {
                    break;
                }
                ctx.moveTo(_x1, _y);
                _y += _w1;
                if (_y > _wmax) {
                    ctx.lineTo(_x1, _y - _w1 + 1);
                } else {
                    ctx.lineTo(_x1, _y);
                }
                _y += _w2;
            }
            this.ds();
        } else {
            if (_y1 == _y2) {
                var _x = Math.min(_x1, _x2) + 0.5;
                var _w1 = 2;
                var _w2 = 2;
                var _wmax = Math.max(_x1, _x2) - 0.5;
                this._s();
                while (true) {
                    if (_x > _wmax) {
                        break;
                    }
                    ctx.moveTo(_x, _y1);
                    _x += _w1;
                    if (_x > _wmax) {
                        ctx.lineTo(_x - _w2 + 1, _y1);
                    } else {
                        ctx.lineTo(_x, _y1);
                    }
                    _x += _w2;
                }
                this.ds();
            } else {
                this._s();
                editor.WordControl.m_oDrawingDocument.AutoShapesTrack.AddLineDash(ctx, _x1, _y1, _x2, _y2, 2, 2);
                this.ds();
            }
        }
        if (!bIsInt) {
            this.SetIntegerGrid(false);
        }
    },
    drawHorLine: function (align, y, x, r, penW) {
        if (!this.m_bIntegerGrid) {
            this.p_width(penW * 1000);
            this._s();
            this._m(x, y);
            this._l(r, y);
            this.ds();
            return;
        }
        var pen_w = parseInt((this.m_dDpiX * penW / g_dKoef_in_to_mm) + 0.5);
        if (0 == pen_w) {
            pen_w = 1;
        }
        var _x = (this.m_oFullTransform.TransformPointX(x, y) >> 0) + 0.5 - 0.5;
        var _r = (this.m_oFullTransform.TransformPointX(r, y) >> 0) + 0.5 + 0.5;
        var ctx = this.m_oContext;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.lineWidth = pen_w;
        switch (align) {
        case 0:
            var _top = (this.m_oFullTransform.TransformPointY(x, y) >> 0) + 0.5;
            ctx.beginPath();
            ctx.moveTo(_x, _top + pen_w / 2 - 0.5);
            ctx.lineTo(_r, _top + pen_w / 2 - 0.5);
            ctx.stroke();
            break;
        case 1:
            var _center = (this.m_oFullTransform.TransformPointY(x, y) >> 0) + 0.5;
            ctx.beginPath();
            if (0 == (pen_w % 2)) {
                ctx.moveTo(_x, _center - 0.5);
                ctx.lineTo(_r, _center - 0.5);
            } else {
                ctx.moveTo(_x, _center);
                ctx.lineTo(_r, _center);
            }
            ctx.stroke();
            break;
        case 2:
            var _bottom = (this.m_oFullTransform.TransformPointY(x, y) >> 0) + 0.5;
            ctx.beginPath();
            ctx.moveTo(_x, _bottom - pen_w / 2 + 0.5);
            ctx.lineTo(_r, _bottom - pen_w / 2 + 0.5);
            ctx.stroke();
            break;
        }
    },
    drawHorLine2: function (align, y, x, r, penW) {
        if (!this.m_bIntegerGrid) {
            var _y1 = y - penW / 2;
            var _y2 = _y1 + 2 * penW;
            this.p_width(penW * 1000);
            this._s();
            this._m(x, _y1);
            this._l(r, _y1);
            this.ds();
            this._s();
            this._m(x, _y2);
            this._l(r, _y2);
            this.ds();
            return;
        }
        var pen_w = ((this.m_dDpiX * penW / g_dKoef_in_to_mm) + 0.5) >> 0;
        if (0 == pen_w) {
            pen_w = 1;
        }
        var _x = (this.m_oFullTransform.TransformPointX(x, y) >> 0) + 0.5 - 0.5;
        var _r = (this.m_oFullTransform.TransformPointX(r, y) >> 0) + 0.5 + 0.5;
        var ctx = this.m_oContext;
        ctx.lineWidth = pen_w;
        switch (align) {
        case 0:
            var _top = (this.m_oFullTransform.TransformPointY(x, y) >> 0) + 0.5;
            var _pos1 = _top + pen_w / 2 - 0.5 - pen_w;
            var _pos2 = _pos1 + pen_w * 2;
            ctx.beginPath();
            ctx.moveTo(_x, _pos1);
            ctx.lineTo(_r, _pos1);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(_x, _pos2);
            ctx.lineTo(_r, _pos2);
            ctx.stroke();
            break;
        case 1:
            break;
        case 2:
            break;
        }
    },
    drawVerLine: function (align, x, y, b, penW) {
        if (!this.m_bIntegerGrid) {
            this.p_width(penW * 1000);
            this._s();
            this._m(x, y);
            this._l(x, b);
            this.ds();
            return;
        }
        var pen_w = ((this.m_dDpiX * penW / g_dKoef_in_to_mm) + 0.5) >> 0;
        if (0 == pen_w) {
            pen_w = 1;
        }
        var _y = (this.m_oFullTransform.TransformPointY(x, y) >> 0) + 0.5 - 0.5;
        var _b = (this.m_oFullTransform.TransformPointY(x, b) >> 0) + 0.5 + 0.5;
        var ctx = this.m_oContext;
        ctx.lineWidth = pen_w;
        switch (align) {
        case 0:
            var _left = (this.m_oFullTransform.TransformPointX(x, y) >> 0) + 0.5;
            ctx.beginPath();
            ctx.moveTo(_left + pen_w / 2 - 0.5, _y);
            ctx.lineTo(_left + pen_w / 2 - 0.5, _b);
            ctx.stroke();
            break;
        case 1:
            var _center = (this.m_oFullTransform.TransformPointX(x, y) >> 0) + 0.5;
            ctx.beginPath();
            if (0 == (pen_w % 2)) {
                ctx.moveTo(_center - 0.5, _y);
                ctx.lineTo(_center - 0.5, _b);
            } else {
                ctx.moveTo(_center, _y);
                ctx.lineTo(_center, _b);
            }
            ctx.stroke();
            break;
        case 2:
            var _right = (this.m_oFullTransform.TransformPointX(x, y) >> 0) + 0.5;
            ctx.beginPath();
            ctx.moveTo(_right - pen_w / 2 + 0.5, _y);
            ctx.lineTo(_right - pen_w / 2 + 0.5, _b);
            ctx.stroke();
            break;
        }
    },
    drawHorLineExt: function (align, y, x, r, penW, leftMW, rightMW) {
        if (!this.m_bIntegerGrid) {
            this.p_width(penW * 1000);
            this._s();
            this._m(x, y);
            this._l(r, y);
            this.ds();
            return;
        }
        var pen_w = Math.max(((this.m_dDpiX * penW / g_dKoef_in_to_mm) + 0.5) >> 0, 1);
        var _x = (this.m_oFullTransform.TransformPointX(x, y) >> 0) + 0.5;
        var _r = (this.m_oFullTransform.TransformPointX(r, y) >> 0) + 0.5;
        if (leftMW != 0) {
            var _center = _x;
            var pen_mw = Math.max(((this.m_dDpiX * Math.abs(leftMW) * 2 / g_dKoef_in_to_mm) + 0.5) >> 0, 1);
            if (leftMW < 0) {
                if ((pen_mw % 2) == 0) {
                    _x = _center - (pen_mw / 2);
                } else {
                    _x = _center - ((pen_mw / 2) >> 0);
                }
            } else {
                if ((pen_mw % 2) == 0) {
                    _x = _center + ((pen_mw / 2) - 1);
                } else {
                    _x = _center + ((pen_mw / 2) >> 0);
                }
            }
        }
        if (rightMW != 0) {
            var _center = _r;
            var pen_mw = Math.max(((this.m_dDpiX * Math.abs(rightMW) * 2 / g_dKoef_in_to_mm) + 0.5) >> 0, 1);
            if (rightMW < 0) {
                if ((pen_mw % 2) == 0) {
                    _r = _center - (pen_mw / 2);
                } else {
                    _r = _center - ((pen_mw / 2) >> 0);
                }
            } else {
                if ((pen_mw % 2) == 0) {
                    _r = _center + (pen_mw / 2) - 1;
                } else {
                    _r = _center + ((pen_mw / 2) >> 0);
                }
            }
        }
        var ctx = this.m_oContext;
        ctx.lineWidth = pen_w;
        _x -= 0.5;
        _r += 0.5;
        switch (align) {
        case 0:
            var _top = (this.m_oFullTransform.TransformPointY(x, y) >> 0) + 0.5;
            ctx.beginPath();
            ctx.moveTo(_x, _top + pen_w / 2 - 0.5);
            ctx.lineTo(_r, _top + pen_w / 2 - 0.5);
            ctx.stroke();
            break;
        case 1:
            var _center = (this.m_oFullTransform.TransformPointY(x, y) >> 0) + 0.5;
            ctx.beginPath();
            if (0 == (pen_w % 2)) {
                ctx.moveTo(_x, _center - 0.5);
                ctx.lineTo(_r, _center - 0.5);
            } else {
                ctx.moveTo(_x, _center);
                ctx.lineTo(_r, _center);
            }
            ctx.stroke();
            break;
        case 2:
            var _bottom = (this.m_oFullTransform.TransformPointY(x, y) >> 0) + 0.5;
            ctx.beginPath();
            ctx.moveTo(_x, _bottom - pen_w / 2 + 0.5);
            ctx.lineTo(_r, _bottom - pen_w / 2 + 0.5);
            ctx.stroke();
            break;
        }
    },
    rect: function (x, y, w, h) {
        var ctx = this.m_oContext;
        ctx.beginPath();
        if (this.m_bIntegerGrid) {
            var _x = (this.m_oFullTransform.TransformPointX(x, y) + 0.5) >> 0;
            var _y = (this.m_oFullTransform.TransformPointY(x, y) + 0.5) >> 0;
            var _r = (this.m_oFullTransform.TransformPointX(x + w, y) + 0.5) >> 0;
            var _b = (this.m_oFullTransform.TransformPointY(x, y + h) + 0.5) >> 0;
            ctx.rect(_x, _y, _r - _x, _b - _y);
        } else {
            ctx.rect(x, y, w, h);
        }
    },
    TableRect: function (x, y, w, h) {
        var ctx = this.m_oContext;
        if (this.m_bIntegerGrid) {
            var _x = (this.m_oFullTransform.TransformPointX(x, y) >> 0) + 0.5;
            var _y = (this.m_oFullTransform.TransformPointY(x, y) >> 0) + 0.5;
            var _r = (this.m_oFullTransform.TransformPointX(x + w, y) >> 0) + 0.5;
            var _b = (this.m_oFullTransform.TransformPointY(x, y + h) >> 0) + 0.5;
            ctx.fillRect(_x - 0.5, _y - 0.5, _r - _x + 1, _b - _y + 1);
        } else {
            ctx.fillRect(x, y, w, h);
        }
    },
    AddClipRect: function (x, y, w, h) {
        var __rect = new _rect();
        __rect.x = x;
        __rect.y = y;
        __rect.w = w;
        __rect.h = h;
        this.GrState.AddClipRect(__rect);
    },
    RemoveClipRect: function () {},
    SetClip: function (r) {
        var ctx = this.m_oContext;
        ctx.save();
        ctx.beginPath();
        if (!global_MatrixTransformer.IsIdentity(this.m_oTransform)) {
            ctx.rect(r.x, r.y, r.w, r.h);
        } else {
            var _x = (this.m_oFullTransform.TransformPointX(r.x, r.y) + 1) >> 0;
            var _y = (this.m_oFullTransform.TransformPointY(r.x, r.y) + 1) >> 0;
            var _r = (this.m_oFullTransform.TransformPointX(r.x + r.w, r.y) - 1) >> 0;
            var _b = (this.m_oFullTransform.TransformPointY(r.x, r.y + r.h) - 1) >> 0;
            ctx.rect(_x, _y, _r - _x + 1, _b - _y + 1);
        }
        this.clip();
        ctx.beginPath();
    },
    RemoveClip: function () {
        this.m_oContext.restore();
        this.m_oContext.save();
        if (this.m_oContext.globalAlpha != this.globalAlpha) {
            this.m_oContext.globalAlpha = this.globalAlpha;
        }
    },
    drawCollaborativeChanges: function (x, y, w, h) {
        this.b_color1(0, 255, 0, 64);
        this.rect(x, y, w, h);
        this.df();
    },
    drawSearchResult: function (x, y, w, h) {
        this.b_color1(255, 220, 0, 200);
        this.rect(x, y, w, h);
        this.df();
    },
    drawFlowAnchor: function (x, y) {
        if (!window.g_flow_anchor || !window.g_flow_anchor.asc_complete || (!editor || !editor.ShowParaMarks)) {
            return;
        }
        if (false === this.m_bIntegerGrid) {
            this.m_oContext.setTransform(1, 0, 0, 1, 0, 0);
        }
        var _x = this.m_oFullTransform.TransformPointX(x, y) >> 0;
        var _y = this.m_oFullTransform.TransformPointY(x, y) >> 0;
        this.m_oContext.drawImage(window.g_flow_anchor, _x, _y);
        if (false === this.m_bIntegerGrid) {
            this.m_oContext.setTransform(this.m_oFullTransform.sx, this.m_oFullTransform.shy, this.m_oFullTransform.shx, this.m_oFullTransform.sy, this.m_oFullTransform.tx, this.m_oFullTransform.ty);
        }
    },
    SavePen: function () {
        this.GrState.SavePen();
    },
    RestorePen: function () {
        this.GrState.RestorePen();
    },
    SaveBrush: function () {
        this.GrState.SaveBrush();
    },
    RestoreBrush: function () {
        this.GrState.RestoreBrush();
    },
    SavePenBrush: function () {
        this.GrState.SavePenBrush();
    },
    RestorePenBrush: function () {
        this.GrState.RestorePenBrush();
    },
    SaveGrState: function () {
        this.GrState.SaveGrState();
    },
    RestoreGrState: function () {
        this.GrState.RestoreGrState();
    },
    StartClipPath: function () {},
    EndClipPath: function () {
        this.m_oContext.clip();
    },
    StartCheckTableDraw: function () {
        if (!this.m_bIntegerGrid && global_MatrixTransformer.IsIdentity2(this.m_oTransform)) {
            this.SaveGrState();
            this.SetIntegerGrid(true);
            return true;
        }
        return false;
    },
    EndCheckTableDraw: function (bIsRestore) {
        if (bIsRestore) {
            this.RestoreGrState();
        }
    },
    SetTextClipRect: function (_l, _t, _r, _b) {
        this.TextClipRect = {
            l: (_l * this.m_oCoordTransform.sx) >> 0,
            t: (_t * this.m_oCoordTransform.sy) >> 0,
            r: (_r * this.m_oCoordTransform.sx) >> 0,
            b: (_b * this.m_oCoordTransform.sy) >> 0
        };
    }
};