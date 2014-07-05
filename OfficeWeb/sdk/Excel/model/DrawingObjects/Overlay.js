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
 var TRACK_CIRCLE_RADIUS = 5;
var TRACK_RECT_SIZE2 = 4;
var TRACK_RECT_SIZE = 8;
var TRACK_DISTANCE_ROTATE = 25;
var TRACK_DISTANCE_ROTATE2 = 25;
var TRACK_ADJUSTMENT_SIZE = 10;
var TRACK_WRAPPOINTS_SIZE = 6;
var IMAGE_ROTATE_TRACK_W = 17;
var bIsUseImageRotateTrack = true;
if (bIsUseImageRotateTrack) {
    window.g_track_rotate_marker = new Image();
    window.g_track_rotate_marker.asc_complete = false;
    window.g_track_rotate_marker.onload = function () {
        window.g_track_rotate_marker.asc_complete = true;
    };
    window.g_track_rotate_marker.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAYAAAA7bUf6AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAbBJREFUeNqsVM1qwkAQnnry71BopUVRFKoeUrx48yF8gKbtE3iRPoBP0Kdo0pM+gtBexJsgyUHswYtWggERf0HczkyzkqbGttAPvmx2duZjdnZ2QQgBHkaRVeQL0hafsJ151Vn/EnNCH4Ku66Cq6g3+PiIvwR9j5AP6P+8tLsWa+BtqmqYBUWZCGehSeLFYgGmaMBqNYLVaQSgUgng8DoqiQCQScWd1hxlpJBLFyRvygqwU2Gq1IJ/PQzqdhnA4DMvlEgaDAfR6PSiVSizowEZe0TYqMr/5fC4ajYawLOtg/mSv1+vs50IlgEplKWsYBmSzWYjFYgcrSvZcLsdbdaFMIoqc0VYymQwcA62TnwvXJHIuZ+v1mmvgh36/D5vNhmtk2zbXCHEWcIrDCAaD7OCHRCIBzWaT/2lMJpNcXBIxpBNVnU7BD5RloVDgvqLRydr8djpUfb/TIex2O9Fut3mUpyPvylhahsMhC3W7XTGbzcR2uxXT6VR0Op1DmhPkqexYFal5OxYF9x2bSqWgWCx6d3iPHfv0L3fH+wyoyPcfgmn91h0HR96T19++Jx8CDABSF1tWsa6kaQAAAABJRU5ErkJggg==";
    TRACK_DISTANCE_ROTATE2 = 20;
}
function CHtmlPage() {
    var drawingPage = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    };
    var width_mm, height_mm;
    this.init = function (x, y, w_pix, h_pix, w_mm, h_mm) {
        drawingPage.top = y;
        drawingPage.left = x;
        drawingPage.right = w_pix;
        drawingPage.bottom = h_pix;
        width_mm = w_mm;
        height_mm = h_mm;
    };
    this.GetDrawingPageInfo = function () {
        return {
            drawingPage: drawingPage,
            width_mm: width_mm,
            height_mm: height_mm
        };
    };
}
function COverlay() {
    this.m_oControl = null;
    this.m_oContext = null;
    this.min_x = 65535;
    this.min_y = 65535;
    this.max_x = -65535;
    this.max_y = -65535;
    this.m_bIsShow = false;
    this.m_bIsAlwaysUpdateOverlay = false;
    this.m_oHtmlPage = null;
}
COverlay.prototype = {
    init: function (context, controlName, x, y, w_pix, h_pix, w_mm, h_mm) {
        this.m_oContext = context;
        this.m_oControl = CreateControl(controlName);
        this.m_oHtmlPage = new CHtmlPage();
        this.m_oHtmlPage.init(x, y, w_pix, h_pix, w_mm, h_mm);
    },
    Clear: function () {
        if (null == this.m_oContext) {
            this.m_oContext = this.m_oControl.HtmlElement.getContext("2d");
            this.m_oContext.imageSmoothingEnabled = false;
            this.m_oContext.mozImageSmoothingEnabled = false;
            this.m_oContext.oImageSmoothingEnabled = false;
            this.m_oContext.webkitImageSmoothingEnabled = false;
        }
        this.m_oContext.beginPath();
        if (this.max_x != -65535 && this.max_y != -65535) {
            this.m_oContext.clearRect(this.min_x - 5, this.min_y - 5, this.max_x - this.min_x + 10, this.max_y - this.min_y + 10);
        }
        this.min_x = 65535;
        this.min_y = 65535;
        this.max_x = -65535;
        this.max_y = -65535;
    },
    Show: function () {
        if (this.m_bIsShow) {
            return;
        }
        this.m_bIsShow = true;
        this.m_oControl.HtmlElement.style.display = "block";
    },
    UnShow: function () {
        if (!this.m_bIsShow) {
            return;
        }
        this.m_bIsShow = false;
        this.m_oControl.HtmlElement.style.display = "none";
    },
    VertLine: function (position) {
        this.Clear();
        if (this.m_bIsAlwaysUpdateOverlay || editor.WordControl.m_oDrawingDocument.m_bIsSelection) {
            if (!editor.WordControl.OnUpdateOverlay()) {
                editor.WordControl.EndUpdateOverlay();
            }
        }
        if (this.min_x > position) {
            this.min_x = position;
        }
        if (this.max_x < position) {
            this.max_x = position;
        }
        this.min_y = 0;
        this.max_y = this.m_oControl.HtmlElement.height;
        this.m_oContext.lineWidth = 1;
        var x = ((position + 0.5) >> 0) + 0.5;
        var y = 0;
        this.m_oContext.strokeStyle = "#000000";
        this.m_oContext.beginPath();
        while (y < this.max_y) {
            this.m_oContext.moveTo(x, y);
            y++;
            this.m_oContext.lineTo(x, y);
            y += 1;
            this.m_oContext.moveTo(x, y);
            y++;
            this.m_oContext.lineTo(x, y);
            y += 1;
            this.m_oContext.moveTo(x, y);
            y++;
            this.m_oContext.lineTo(x, y);
            y++;
            y += 5;
        }
        this.m_oContext.stroke();
        y = 1;
        this.m_oContext.strokeStyle = "#FFFFFF";
        this.m_oContext.beginPath();
        while (y < this.max_y) {
            this.m_oContext.moveTo(x, y);
            y++;
            this.m_oContext.lineTo(x, y);
            y += 1;
            this.m_oContext.moveTo(x, y);
            y++;
            this.m_oContext.lineTo(x, y);
            y += 1;
            this.m_oContext.moveTo(x, y);
            y++;
            this.m_oContext.lineTo(x, y);
            y++;
            y += 5;
        }
        this.m_oContext.stroke();
        this.Show();
    },
    HorLine: function (position) {
        this.Clear();
        if (this.m_bIsAlwaysUpdateOverlay || editor.WordControl.m_oDrawingDocument.m_bIsSelection) {
            if (!editor.WordControl.OnUpdateOverlay()) {
                editor.WordControl.EndUpdateOverlay();
            }
        }
        this.min_x = 0;
        this.max_x = this.m_oControl.HtmlElement.width;
        if (this.min_y > position) {
            this.min_y = position;
        }
        if (this.max_y < position) {
            this.max_y = position;
        }
        this.m_oContext.lineWidth = 1;
        var y = ((position + 0.5) >> 0) + 0.5;
        var x = 0;
        this.m_oContext.strokeStyle = "#000000";
        this.m_oContext.beginPath();
        while (x < this.max_x) {
            this.m_oContext.moveTo(x, y);
            x++;
            this.m_oContext.lineTo(x, y);
            x += 1;
            this.m_oContext.moveTo(x, y);
            x++;
            this.m_oContext.lineTo(x, y);
            x += 1;
            this.m_oContext.moveTo(x, y);
            x++;
            this.m_oContext.lineTo(x, y);
            x++;
            x += 5;
        }
        this.m_oContext.stroke();
        x = 1;
        this.m_oContext.strokeStyle = "#FFFFFF";
        this.m_oContext.beginPath();
        while (x < this.max_x) {
            this.m_oContext.moveTo(x, y);
            x++;
            this.m_oContext.lineTo(x, y);
            x += 1;
            this.m_oContext.moveTo(x, y);
            x++;
            this.m_oContext.lineTo(x, y);
            x += 1;
            this.m_oContext.moveTo(x, y);
            x++;
            this.m_oContext.lineTo(x, y);
            x++;
            x += 5;
        }
        this.m_oContext.stroke();
        this.Show();
    },
    CheckPoint1: function (x, y) {
        if (x < this.min_x) {
            this.min_x = x;
        }
        if (y < this.min_y) {
            this.min_y = y;
        }
    },
    CheckPoint2: function (x, y) {
        if (x > this.max_x) {
            this.max_x = x;
        }
        if (y > this.max_y) {
            this.max_y = y;
        }
    },
    CheckPoint: function (x, y) {
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
    AddRect2: function (x, y, r) {
        var _x = x - ((r / 2) >> 0);
        var _y = y - ((r / 2) >> 0);
        this.CheckPoint1(_x, _y);
        this.CheckPoint2(_x + r, _y + r);
        this.m_oContext.moveTo(_x, _y);
        this.m_oContext.rect(_x, _y, r, r);
    },
    AddRect3: function (x, y, r, ex1, ey1, ex2, ey2) {
        var _r = r / 2;
        var x1 = x + _r * (ex2 - ex1);
        var y1 = y + _r * (ey2 - ey1);
        var x2 = x + _r * (ex2 + ex1);
        var y2 = y + _r * (ey2 + ey1);
        var x3 = x + _r * (-ex2 + ex1);
        var y3 = y + _r * (-ey2 + ey1);
        var x4 = x + _r * (-ex2 - ex1);
        var y4 = y + _r * (-ey2 - ey1);
        this.CheckPoint(x1, y1);
        this.CheckPoint(x2, y2);
        this.CheckPoint(x3, y3);
        this.CheckPoint(x4, y4);
        var ctx = this.m_oContext;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.lineTo(x4, y4);
        ctx.closePath();
    },
    AddRect: function (x, y, w, h) {
        this.CheckPoint1(x, y);
        this.CheckPoint2(x + w, y + h);
        this.m_oContext.moveTo(x, y);
        this.m_oContext.rect(x, y, w, h);
    },
    CheckRectT: function (x, y, w, h, trans, eps) {
        var x1 = trans.TransformPointX(x, y);
        var y1 = trans.TransformPointY(x, y);
        var x2 = trans.TransformPointX(x + w, y);
        var y2 = trans.TransformPointY(x + w, y);
        var x3 = trans.TransformPointX(x + w, y + h);
        var y3 = trans.TransformPointY(x + w, y + h);
        var x4 = trans.TransformPointX(x, y + h);
        var y4 = trans.TransformPointY(x, y + h);
        this.CheckPoint(x1, y1);
        this.CheckPoint(x2, y2);
        this.CheckPoint(x3, y3);
        this.CheckPoint(x4, y4);
        if (eps !== undefined) {
            this.min_x -= eps;
            this.min_y -= eps;
            this.max_x += eps;
            this.max_y += eps;
        }
    },
    CheckRect: function (x, y, w, h) {
        this.CheckPoint1(x, y);
        this.CheckPoint2(x + w, y + h);
    },
    AddEllipse: function (x, y, r) {
        this.CheckPoint1(x - r, y - r);
        this.CheckPoint2(x + r, y + r);
        this.m_oContext.moveTo(x + r, y);
        this.m_oContext.arc(x, y, r, 0, Math.PI * 2, false);
    },
    AddRoundRect: function (x, y, w, h, r) {
        if (w < (2 * r) || h < (2 * r)) {
            return this.AddRect(x, y, w, h);
        }
        this.CheckPoint1(x, y);
        this.CheckPoint2(x + w, y + h);
        var _ctx = this.m_oContext;
        _ctx.moveTo(x + r, y);
        _ctx.lineTo(x + w - r, y);
        _ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        _ctx.lineTo(x + w, y + h - r);
        _ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        _ctx.lineTo(x + r, y + h);
        _ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        _ctx.lineTo(x, y + r);
        _ctx.quadraticCurveTo(x, y, x + r, y);
    },
    AddRoundRectCtx: function (ctx, x, y, w, h, r) {
        if (w < (2 * r) || h < (2 * r)) {
            return ctx.rect(x, y, w, h);
        }
        var _ctx = this.m_oContext;
        _ctx.moveTo(x + r, y);
        _ctx.lineTo(x + w - r, y);
        _ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        _ctx.lineTo(x + w, y + h - r);
        _ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        _ctx.lineTo(x + r, y + h);
        _ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        _ctx.lineTo(x, y + r);
        _ctx.quadraticCurveTo(x, y, x + r, y);
    }
};
function CBoundsController() {
    this.min_x = 65535;
    this.min_y = 65535;
    this.max_x = -65535;
    this.max_y = -65535;
}
CBoundsController.prototype = {
    ClearNoAttack: function () {
        this.min_x = 65535;
        this.min_y = 65535;
        this.max_x = -65535;
        this.max_y = -65535;
    },
    Clear: function (ctx) {
        if (this.max_x != -65535 && this.max_y != -65535) {
            ctx.fillRect(this.min_x - 5, this.min_y - 5, this.max_x - this.min_x + 10, this.max_y - this.min_y + 10);
        }
        this.min_x = 65535;
        this.min_y = 65535;
        this.max_x = -65535;
        this.max_y = -65535;
    },
    CheckPoint1: function (x, y) {
        if (x < this.min_x) {
            this.min_x = x;
        }
        if (y < this.min_y) {
            this.min_y = y;
        }
    },
    CheckPoint2: function (x, y) {
        if (x > this.max_x) {
            this.max_x = x;
        }
        if (y > this.max_y) {
            this.max_y = y;
        }
    },
    CheckPoint: function (x, y) {
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
    CheckRect: function (x, y, w, h) {
        this.CheckPoint1(x, y);
        this.CheckPoint2(x + w, y + h);
    }
};
function CAutoshapeTrack() {
    this.m_oContext = null;
    this.m_oOverlay = null;
    this.Graphics = null;
    this.MaxEpsLine = 0;
    this.IsTrack = true;
    this.PageIndex = -1;
    this.CurrentPageInfo = null;
}
CAutoshapeTrack.prototype = {
    SetFont: function (font) {},
    init: function (overlay, x, y, r, b, w_mm, h_mm) {
        this.m_oOverlay = overlay;
        this.m_oContext = this.m_oOverlay.m_oContext;
        this.Graphics = new CGraphics();
        this.Graphics.init(this.m_oContext, r - x, b - y, w_mm, h_mm);
        this.Graphics.m_oCoordTransform.tx = x;
        this.Graphics.m_oCoordTransform.ty = y;
        this.Graphics.SetIntegerGrid(false);
    },
    SetIntegerGrid: function (b) {},
    p_color: function (r, g, b, a) {
        this.Graphics.p_color(r, g, b, a);
    },
    p_width: function (w) {
        this.Graphics.p_width(w);
        var xx1 = 0;
        var yy1 = 0;
        var xx2 = 1;
        var yy2 = 1;
        var xxx1 = this.Graphics.m_oFullTransform.TransformPointX(xx1, yy1);
        var yyy1 = this.Graphics.m_oFullTransform.TransformPointY(xx1, yy1);
        var xxx2 = this.Graphics.m_oFullTransform.TransformPointX(xx2, yy2);
        var yyy2 = this.Graphics.m_oFullTransform.TransformPointY(xx2, yy2);
        var _len2 = ((xxx2 - xxx1) * (xxx2 - xxx1) + (yyy2 - yyy1) * (yyy2 - yyy1));
        var koef = Math.sqrt(_len2 / 2);
        var _EpsLine = (w * koef / 1000) >> 0;
        _EpsLine += 5;
        if (_EpsLine > this.MaxEpsLine) {
            this.MaxEpsLine = _EpsLine;
        }
    },
    b_color1: function (r, g, b, a) {
        this.Graphics.b_color1(r, g, b, a);
    },
    _s: function () {
        this.Graphics._s();
    },
    _e: function () {
        this.Graphics._e();
    },
    _z: function () {
        this.Graphics._z();
    },
    _m: function (x, y) {
        this.Graphics._m(x, y);
        var _x = this.Graphics.m_oFullTransform.TransformPointX(x, y);
        var _y = this.Graphics.m_oFullTransform.TransformPointY(x, y);
        this.m_oOverlay.CheckPoint(_x, _y);
    },
    _l: function (x, y) {
        this.Graphics._l(x, y);
        var _x = this.Graphics.m_oFullTransform.TransformPointX(x, y);
        var _y = this.Graphics.m_oFullTransform.TransformPointY(x, y);
        this.m_oOverlay.CheckPoint(_x, _y);
    },
    _c: function (x1, y1, x2, y2, x3, y3) {
        this.Graphics._c(x1, y1, x2, y2, x3, y3);
        var _x1 = this.Graphics.m_oFullTransform.TransformPointX(x1, y1);
        var _y1 = this.Graphics.m_oFullTransform.TransformPointY(x1, y1);
        var _x2 = this.Graphics.m_oFullTransform.TransformPointX(x2, y2);
        var _y2 = this.Graphics.m_oFullTransform.TransformPointY(x2, y2);
        var _x3 = this.Graphics.m_oFullTransform.TransformPointX(x3, y3);
        var _y3 = this.Graphics.m_oFullTransform.TransformPointY(x3, y3);
        this.m_oOverlay.CheckPoint(_x1, _y1);
        this.m_oOverlay.CheckPoint(_x2, _y2);
        this.m_oOverlay.CheckPoint(_x3, _y3);
    },
    _c2: function (x1, y1, x2, y2) {
        this.Graphics._c2(x1, y1, x2, y2);
        var _x1 = this.Graphics.m_oFullTransform.TransformPointX(x1, y1);
        var _y1 = this.Graphics.m_oFullTransform.TransformPointY(x1, y1);
        var _x2 = this.Graphics.m_oFullTransform.TransformPointX(x2, y2);
        var _y2 = this.Graphics.m_oFullTransform.TransformPointY(x2, y2);
        this.m_oOverlay.CheckPoint(_x1, _y1);
        this.m_oOverlay.CheckPoint(_x2, _y2);
    },
    ds: function () {
        this.Graphics.ds();
    },
    df: function () {
        this.Graphics.df();
    },
    save: function () {
        this.Graphics.save();
    },
    restore: function () {
        this.Graphics.restore();
    },
    clip: function () {
        this.Graphics.clip();
    },
    reset: function () {
        this.Graphics.reset();
    },
    transform3: function (m) {
        this.Graphics.transform3(m);
    },
    transform: function (sx, shy, shx, sy, tx, ty) {
        this.Graphics.transform(sx, shy, shx, sy, tx, ty);
    },
    drawImage: function (image, x, y, w, h, alpha, srcRect, nativeImage) {
        this.Graphics.drawImage(image, x, y, w, h, undefined, srcRect, nativeImage);
        var _x1 = this.Graphics.m_oFullTransform.TransformPointX(x, y);
        var _y1 = this.Graphics.m_oFullTransform.TransformPointY(x, y);
        var _x2 = this.Graphics.m_oFullTransform.TransformPointX(x + w, y);
        var _y2 = this.Graphics.m_oFullTransform.TransformPointY(x + w, y);
        var _x3 = this.Graphics.m_oFullTransform.TransformPointX(x + w, (y + h));
        var _y3 = this.Graphics.m_oFullTransform.TransformPointY(x + w, (y + h));
        var _x4 = this.Graphics.m_oFullTransform.TransformPointX(x, (y + h));
        var _y4 = this.Graphics.m_oFullTransform.TransformPointY(x, (y + h));
        this.m_oOverlay.CheckPoint(_x1, _y1);
        this.m_oOverlay.CheckPoint(_x2, _y2);
        this.m_oOverlay.CheckPoint(_x3, _y3);
        this.m_oOverlay.CheckPoint(_x4, _y4);
    },
    CorrectOverlayBounds: function () {
        this.m_oContext.setTransform(1, 0, 0, 1, 0, 0);
        this.m_oOverlay.min_x -= this.MaxEpsLine;
        this.m_oOverlay.min_y -= this.MaxEpsLine;
        this.m_oOverlay.max_x += this.MaxEpsLine;
        this.m_oOverlay.max_y += this.MaxEpsLine;
    },
    SetCurrentPage: function (nPageIndex) {
        if (nPageIndex == this.PageIndex) {
            return;
        }
        var oPage = this.m_oOverlay.m_oHtmlPage.GetDrawingPageInfo(nPageIndex);
        this.PageIndex = nPageIndex;
        var drawPage = oPage.drawingPage;
        this.Graphics = new CGraphics();
        this.Graphics.init(this.m_oContext, drawPage.right - drawPage.left, drawPage.bottom - drawPage.top, oPage.width_mm, oPage.height_mm);
        this.Graphics.m_oCoordTransform.tx = drawPage.left;
        this.Graphics.m_oCoordTransform.ty = drawPage.top;
        this.Graphics.SetIntegerGrid(false);
        this.m_oContext.globalAlpha = 0.5;
    },
    init2: function (overlay) {
        this.m_oOverlay = overlay;
        this.m_oContext = this.m_oOverlay.m_oContext;
        this.PageIndex = -1;
    },
    SetClip: function (r) {},
    RemoveClip: function () {},
    SavePen: function () {
        this.Graphics.SavePen();
    },
    RestorePen: function () {
        this.Graphics.RestorePen();
    },
    SaveBrush: function () {
        this.Graphics.SaveBrush();
    },
    RestoreBrush: function () {
        this.Graphics.RestoreBrush();
    },
    SavePenBrush: function () {
        this.Graphics.SavePenBrush();
    },
    RestorePenBrush: function () {
        this.Graphics.RestorePenBrush();
    },
    SaveGrState: function () {
        this.Graphics.SaveGrState();
    },
    RestoreGrState: function () {
        this.Graphics.RestoreGrState();
    },
    StartClipPath: function () {
        this.Graphics.StartClipPath();
    },
    EndClipPath: function () {
        this.Graphics.EndClipPath();
    },
    DrawTrack: function (type, matrix, left, top, width, height, isLine, isCanRotate) {
        var overlay = this.m_oOverlay;
        overlay.Show();
        var bIsClever = false;
        this.CurrentPageInfo = overlay.m_oHtmlPage.GetDrawingPageInfo(this.PageIndex);
        var drPage = this.CurrentPageInfo.drawingPage;
        var xDst = drPage.left + (this.Graphics ? this.Graphics.m_oCoordTransform.tx : 0);
        var yDst = drPage.top + (this.Graphics ? this.Graphics.m_oCoordTransform.ty : 0);
        var wDst = drPage.right - drPage.left;
        var hDst = drPage.bottom - drPage.top;
        var dKoefX = wDst / this.CurrentPageInfo.width_mm;
        var dKoefY = hDst / this.CurrentPageInfo.height_mm;
        var r = left + width;
        var b = top + height;
        var x1 = (xDst + dKoefX * (matrix.TransformPointX(left, top))) >> 0;
        var y1 = (yDst + dKoefY * (matrix.TransformPointY(left, top))) >> 0;
        var x2 = (xDst + dKoefX * (matrix.TransformPointX(r, top))) >> 0;
        var y2 = (yDst + dKoefY * (matrix.TransformPointY(r, top))) >> 0;
        var x3 = (xDst + dKoefX * (matrix.TransformPointX(left, b))) >> 0;
        var y3 = (yDst + dKoefY * (matrix.TransformPointY(left, b))) >> 0;
        var x4 = (xDst + dKoefX * (matrix.TransformPointX(r, b))) >> 0;
        var y4 = (yDst + dKoefY * (matrix.TransformPointY(r, b))) >> 0;
        var ctx = overlay.m_oContext;
        if (x1 == x3 && x2 == x4 && y1 == y2 && y3 == y4 && x1 < x2 && y1 < y3) {
            bIsClever = true;
        }
        var bIsEllipceCorner = false;
        var _style_blue = "#939393";
        var _style_green = "#84E036";
        var _style_white = "#FFFFFF";
        var _len_x = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
        var _len_y = Math.sqrt((x1 - x3) * (x1 - x3) + (y1 - y3) * (y1 - y3));
        if (_len_x < 1) {
            _len_x = 1;
        }
        if (_len_y < 1) {
            _len_y = 1;
        }
        var bIsRectsTrack = ((_len_x >= 30) && (_len_y >= 30)) ? true : false;
        ctx.lineWidth = 1;
        ctx.beginPath();
        var _oldGlobalAlpha = ctx.globalAlpha;
        ctx.globalAlpha = 1;
        switch (type) {
        case TYPE_TRACK_SHAPE:
            case TYPE_TRACK_GROUP:
            if (bIsClever) {
                overlay.CheckRect(x1, y1, x4 - x1, y4 - y1);
                ctx.strokeStyle = _style_blue;
                if (!isLine) {
                    ctx.rect(x1 + 0.5, y2 + 0.5, x4 - x1, y4 - y1);
                    ctx.stroke();
                    ctx.beginPath();
                }
                var xC = ((x1 + x2) / 2) >> 0;
                if (!isLine && isCanRotate) {
                    if (!bIsUseImageRotateTrack) {
                        ctx.beginPath();
                        overlay.AddEllipse(xC, y1 - TRACK_DISTANCE_ROTATE, TRACK_CIRCLE_RADIUS);
                        ctx.fillStyle = _style_green;
                        ctx.fill();
                        ctx.stroke();
                    } else {
                        if (window.g_track_rotate_marker.asc_complete) {
                            var _w = IMAGE_ROTATE_TRACK_W;
                            var _xI = ((x1 + x2 - _w) / 2) >> 0;
                            var _yI = y1 - TRACK_DISTANCE_ROTATE - (_w >> 1);
                            overlay.CheckRect(_xI, _yI, _w, _w);
                            ctx.drawImage(window.g_track_rotate_marker, _xI, _yI, _w, _w);
                        }
                    }
                    ctx.beginPath();
                    ctx.moveTo(xC + 0.5, y1);
                    ctx.lineTo(xC + 0.5, y1 - TRACK_DISTANCE_ROTATE2);
                    ctx.stroke();
                    ctx.beginPath();
                }
                ctx.fillStyle = _style_white;
                if (bIsEllipceCorner) {
                    overlay.AddEllipse(x1, y1, TRACK_CIRCLE_RADIUS);
                    if (!isLine) {
                        overlay.AddEllipse(x2, y2, TRACK_CIRCLE_RADIUS);
                        overlay.AddEllipse(x3, y3, TRACK_CIRCLE_RADIUS);
                    }
                    overlay.AddEllipse(x4, y4, TRACK_CIRCLE_RADIUS);
                } else {
                    overlay.AddRect2(x1 + 0.5, y1 + 0.5, TRACK_RECT_SIZE);
                    if (!isLine) {
                        overlay.AddRect2(x2 + 0.5, y2 + 0.5, TRACK_RECT_SIZE);
                        overlay.AddRect2(x3 + 0.5, y3 + 0.5, TRACK_RECT_SIZE);
                    }
                    overlay.AddRect2(x4 + 0.5, y4 + 0.5, TRACK_RECT_SIZE);
                }
                if (bIsRectsTrack && !isLine) {
                    var _xC = (((x1 + x2) / 2) >> 0) + 0.5;
                    var _yC = (((y1 + y3) / 2) >> 0) + 0.5;
                    overlay.AddRect2(_xC, y1 + 0.5, TRACK_RECT_SIZE);
                    overlay.AddRect2(x2 + 0.5, _yC, TRACK_RECT_SIZE);
                    overlay.AddRect2(_xC, y3 + 0.5, TRACK_RECT_SIZE);
                    overlay.AddRect2(x1 + 0.5, _yC, TRACK_RECT_SIZE);
                }
                ctx.fill();
                ctx.stroke();
                ctx.beginPath();
            } else {
                ctx.strokeStyle = _style_blue;
                if (!isLine) {
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);
                    ctx.lineTo(x4, y4);
                    ctx.lineTo(x3, y3);
                    ctx.closePath();
                    ctx.stroke();
                }
                overlay.CheckPoint(x1, y1);
                overlay.CheckPoint(x2, y2);
                overlay.CheckPoint(x3, y3);
                overlay.CheckPoint(x4, y4);
                var ex1 = (x2 - x1) / _len_x;
                var ey1 = (y2 - y1) / _len_x;
                var ex2 = (x1 - x3) / _len_y;
                var ey2 = (y1 - y3) / _len_y;
                var _bAbsX1 = Math.abs(ex1) < 0.01;
                var _bAbsY1 = Math.abs(ey1) < 0.01;
                var _bAbsX2 = Math.abs(ex2) < 0.01;
                var _bAbsY2 = Math.abs(ey2) < 0.01;
                if (_bAbsX2 && _bAbsY2) {
                    if (_bAbsX1 && _bAbsY1) {
                        ex1 = 1;
                        ey1 = 0;
                        ex2 = 0;
                        ey2 = 1;
                    } else {
                        ex2 = -ey1;
                        ey2 = ex1;
                    }
                } else {
                    if (_bAbsX1 && _bAbsY1) {
                        ex1 = ey2;
                        ey1 = -ex2;
                    }
                }
                var xc1 = (x1 + x2) / 2;
                var yc1 = (y1 + y2) / 2;
                ctx.beginPath();
                if (!isLine && isCanRotate) {
                    if (!bIsUseImageRotateTrack) {
                        ctx.beginPath();
                        overlay.AddEllipse(xc1 + ex2 * TRACK_DISTANCE_ROTATE, yc1 + ey2 * TRACK_DISTANCE_ROTATE, TRACK_CIRCLE_RADIUS);
                        ctx.fillStyle = _style_green;
                        ctx.fill();
                        ctx.stroke();
                    } else {
                        if (window.g_track_rotate_marker.asc_complete) {
                            var _xI = xc1 + ex2 * TRACK_DISTANCE_ROTATE;
                            var _yI = yc1 + ey2 * TRACK_DISTANCE_ROTATE;
                            var _w = IMAGE_ROTATE_TRACK_W;
                            var _w2 = IMAGE_ROTATE_TRACK_W / 2;
                            ctx.setTransform(ex1, ey1, -ey1, ex1, _xI, _yI);
                            ctx.drawImage(window.g_track_rotate_marker, -_w2, -_w2, _w, _w);
                            ctx.setTransform(1, 0, 0, 1, 0, 0);
                            overlay.CheckRect(_xI - _w2, _yI - _w2, _w, _w);
                        }
                    }
                    ctx.beginPath();
                    ctx.moveTo(xc1, yc1);
                    ctx.lineTo(xc1 + ex2 * TRACK_DISTANCE_ROTATE2, yc1 + ey2 * TRACK_DISTANCE_ROTATE2);
                    ctx.stroke();
                    ctx.beginPath();
                }
                ctx.fillStyle = _style_white;
                if (bIsEllipceCorner) {
                    overlay.AddEllipse(x1, y1, TRACK_CIRCLE_RADIUS);
                    if (!isLine) {
                        overlay.AddEllipse(x2, y2, TRACK_CIRCLE_RADIUS);
                        overlay.AddEllipse(x3, y3, TRACK_CIRCLE_RADIUS);
                    }
                    overlay.AddEllipse(x4, y4, TRACK_CIRCLE_RADIUS);
                } else {
                    overlay.AddRect3(x1, y1, TRACK_RECT_SIZE, ex1, ey1, ex2, ey2);
                    if (!isLine) {
                        overlay.AddRect3(x2, y2, TRACK_RECT_SIZE, ex1, ey1, ex2, ey2);
                        overlay.AddRect3(x3, y3, TRACK_RECT_SIZE, ex1, ey1, ex2, ey2);
                    }
                    overlay.AddRect3(x4, y4, TRACK_RECT_SIZE, ex1, ey1, ex2, ey2);
                }
                if (bIsRectsTrack && !isLine) {
                    overlay.AddRect3((x1 + x2) / 2, (y1 + y2) / 2, TRACK_RECT_SIZE, ex1, ey1, ex2, ey2);
                    overlay.AddRect3((x2 + x4) / 2, (y2 + y4) / 2, TRACK_RECT_SIZE, ex1, ey1, ex2, ey2);
                    overlay.AddRect3((x3 + x4) / 2, (y3 + y4) / 2, TRACK_RECT_SIZE, ex1, ey1, ex2, ey2);
                    overlay.AddRect3((x3 + x1) / 2, (y3 + y1) / 2, TRACK_RECT_SIZE, ex1, ey1, ex2, ey2);
                }
                ctx.fill();
                ctx.stroke();
                ctx.beginPath();
            }
            break;
        case TYPE_TRACK_TEXT:
            case TYPE_TRACK_GROUP_PASSIVE:
            if (bIsClever) {
                overlay.CheckRect(x1, y1, x4 - x1, y4 - y1);
                this.AddRectDashClever(ctx, x1, y1, x4, y4, 8, 3);
                ctx.strokeStyle = _style_blue;
                ctx.stroke();
                ctx.beginPath();
                if (isCanRotate) {
                    if (!bIsUseImageRotateTrack) {
                        ctx.beginPath();
                        overlay.AddEllipse(xC, y1 - TRACK_DISTANCE_ROTATE, TRACK_CIRCLE_RADIUS);
                        ctx.fillStyle = _style_green;
                        ctx.fill();
                        ctx.stroke();
                    } else {
                        if (window.g_track_rotate_marker.asc_complete) {
                            var _w = IMAGE_ROTATE_TRACK_W;
                            var _xI = ((x1 + x2 - _w) / 2) >> 0;
                            var _yI = y1 - TRACK_DISTANCE_ROTATE - (_w >> 1);
                            overlay.CheckRect(_xI, _yI, _w, _w);
                            ctx.drawImage(window.g_track_rotate_marker, _xI, _yI, _w, _w);
                        }
                    }
                    ctx.beginPath();
                    var xC = ((x1 + x2) / 2) >> 0;
                    ctx.moveTo(xC + 0.5, y1);
                    ctx.lineTo(xC + 0.5, y1 - TRACK_DISTANCE_ROTATE2);
                    ctx.stroke();
                    ctx.beginPath();
                }
                ctx.fillStyle = _style_white;
                if (bIsEllipceCorner) {
                    overlay.AddEllipse(x1, y1, TRACK_CIRCLE_RADIUS);
                    overlay.AddEllipse(x2, y2, TRACK_CIRCLE_RADIUS);
                    overlay.AddEllipse(x3, y3, TRACK_CIRCLE_RADIUS);
                    overlay.AddEllipse(x4, y4, TRACK_CIRCLE_RADIUS);
                } else {
                    overlay.AddRect2(x1 + 0.5, y1 + 0.5, TRACK_RECT_SIZE);
                    overlay.AddRect2(x2 + 0.5, y2 + 0.5, TRACK_RECT_SIZE);
                    overlay.AddRect2(x3 + 0.5, y3 + 0.5, TRACK_RECT_SIZE);
                    overlay.AddRect2(x4 + 0.5, y4 + 0.5, TRACK_RECT_SIZE);
                }
                if (bIsRectsTrack) {
                    var _xC = (((x1 + x2) / 2) >> 0) + 0.5;
                    var _yC = (((y1 + y3) / 2) >> 0) + 0.5;
                    overlay.AddRect2(_xC, y1 + 0.5, TRACK_RECT_SIZE);
                    overlay.AddRect2(x2 + 0.5, _yC, TRACK_RECT_SIZE);
                    overlay.AddRect2(_xC, y3 + 0.5, TRACK_RECT_SIZE);
                    overlay.AddRect2(x1 + 0.5, _yC, TRACK_RECT_SIZE);
                }
                ctx.fill();
                ctx.stroke();
                ctx.beginPath();
            } else {
                overlay.CheckPoint(x1, y1);
                overlay.CheckPoint(x2, y2);
                overlay.CheckPoint(x3, y3);
                overlay.CheckPoint(x4, y4);
                this.AddRectDash(ctx, x1, y1, x2, y2, x3, y3, x4, y4, 8, 3);
                ctx.strokeStyle = _style_blue;
                ctx.stroke();
                var ex1 = (x2 - x1) / _len_x;
                var ey1 = (y2 - y1) / _len_x;
                var ex2 = (x1 - x3) / _len_y;
                var ey2 = (y1 - y3) / _len_y;
                var _bAbsX1 = Math.abs(ex1) < 0.01;
                var _bAbsY1 = Math.abs(ey1) < 0.01;
                var _bAbsX2 = Math.abs(ex2) < 0.01;
                var _bAbsY2 = Math.abs(ey2) < 0.01;
                if (_bAbsX2 && _bAbsY2) {
                    if (_bAbsX1 && _bAbsY1) {
                        ex1 = 1;
                        ey1 = 0;
                        ex2 = 0;
                        ey2 = 1;
                    } else {
                        ex2 = -ey1;
                        ey2 = ex1;
                    }
                } else {
                    if (_bAbsX1 && _bAbsY1) {
                        ex1 = ey2;
                        ey1 = -ex2;
                    }
                }
                var xc1 = (x1 + x2) / 2;
                var yc1 = (y1 + y2) / 2;
                ctx.beginPath();
                if (isCanRotate) {
                    if (!bIsUseImageRotateTrack) {
                        ctx.beginPath();
                        overlay.AddEllipse(xc1 + ex2 * TRACK_DISTANCE_ROTATE, yc1 + ey2 * TRACK_DISTANCE_ROTATE, TRACK_CIRCLE_RADIUS);
                        ctx.fillStyle = _style_green;
                        ctx.fill();
                        ctx.stroke();
                    } else {
                        if (window.g_track_rotate_marker.asc_complete) {
                            var _xI = xc1 + ex2 * TRACK_DISTANCE_ROTATE;
                            var _yI = yc1 + ey2 * TRACK_DISTANCE_ROTATE;
                            var _w = IMAGE_ROTATE_TRACK_W;
                            var _w2 = IMAGE_ROTATE_TRACK_W / 2;
                            ctx.setTransform(ex1, ey1, -ey1, ex1, _xI, _yI);
                            ctx.drawImage(window.g_track_rotate_marker, -_w2, -_w2, _w, _w);
                            ctx.setTransform(1, 0, 0, 1, 0, 0);
                            overlay.CheckRect(_xI - _w2, _yI - _w2, _w, _w);
                        }
                    }
                    ctx.beginPath();
                    ctx.moveTo(xc1, yc1);
                    ctx.lineTo(xc1 + ex2 * TRACK_DISTANCE_ROTATE2, yc1 + ey2 * TRACK_DISTANCE_ROTATE2);
                    ctx.stroke();
                    ctx.beginPath();
                }
                ctx.fillStyle = _style_white;
                if (bIsEllipceCorner) {
                    overlay.AddEllipse(x1, y1, TRACK_CIRCLE_RADIUS);
                    overlay.AddEllipse(x2, y2, TRACK_CIRCLE_RADIUS);
                    overlay.AddEllipse(x3, y3, TRACK_CIRCLE_RADIUS);
                    overlay.AddEllipse(x4, y4, TRACK_CIRCLE_RADIUS);
                } else {
                    overlay.AddRect3(x1, y1, TRACK_RECT_SIZE, ex1, ey1, ex2, ey2);
                    overlay.AddRect3(x2, y2, TRACK_RECT_SIZE, ex1, ey1, ex2, ey2);
                    overlay.AddRect3(x3, y3, TRACK_RECT_SIZE, ex1, ey1, ex2, ey2);
                    overlay.AddRect3(x4, y4, TRACK_RECT_SIZE, ex1, ey1, ex2, ey2);
                }
                if (bIsRectsTrack) {
                    overlay.AddRect3((x1 + x2) / 2, (y1 + y2) / 2, TRACK_RECT_SIZE, ex1, ey1, ex2, ey2);
                    overlay.AddRect3((x2 + x4) / 2, (y2 + y4) / 2, TRACK_RECT_SIZE, ex1, ey1, ex2, ey2);
                    overlay.AddRect3((x3 + x4) / 2, (y3 + y4) / 2, TRACK_RECT_SIZE, ex1, ey1, ex2, ey2);
                    overlay.AddRect3((x3 + x1) / 2, (y3 + y1) / 2, TRACK_RECT_SIZE, ex1, ey1, ex2, ey2);
                }
                ctx.fill();
                ctx.stroke();
                ctx.beginPath();
            }
            break;
        case TYPE_TRACK_EMPTY_PH:
            if (bIsClever) {
                overlay.CheckRect(x1, y1, x4 - x1, y4 - y1);
                ctx.rect(x1 + 0.5, y2 + 0.5, x4 - x1 + 1, y4 - y1);
                ctx.fillStyle = _style_white;
                ctx.stroke();
                ctx.beginPath();
                this.AddRectDashClever(ctx, x1, y1, x4, y4, 8, 3);
                ctx.strokeStyle = _style_blue;
                ctx.stroke();
                ctx.beginPath();
                var xC = ((x1 + x2) / 2) >> 0;
                if (!bIsUseImageRotateTrack) {
                    ctx.beginPath();
                    overlay.AddEllipse(xC, y1 - TRACK_DISTANCE_ROTATE);
                    ctx.fillStyle = _style_green;
                    ctx.fill();
                    ctx.stroke();
                } else {
                    if (window.g_track_rotate_marker.asc_complete) {
                        var _w = IMAGE_ROTATE_TRACK_W;
                        var _xI = ((x1 + x2 - _w) / 2) >> 0;
                        var _yI = y1 - TRACK_DISTANCE_ROTATE - (_w >> 1);
                        overlay.CheckRect(_xI, _yI, _w, _w);
                        ctx.drawImage(window.g_track_rotate_marker, _xI, _yI, _w, _w);
                    }
                }
                ctx.beginPath();
                ctx.moveTo(xC + 0.5, y1);
                ctx.lineTo(xC + 0.5, y1 - TRACK_DISTANCE_ROTATE2);
                ctx.stroke();
                ctx.beginPath();
                ctx.fillStyle = _style_white;
                if (bIsEllipceCorner) {
                    overlay.AddEllipse(x1, y1, TRACK_CIRCLE_RADIUS);
                    overlay.AddEllipse(x2, y2, TRACK_CIRCLE_RADIUS);
                    overlay.AddEllipse(x3, y3, TRACK_CIRCLE_RADIUS);
                    overlay.AddEllipse(x4, y4, TRACK_CIRCLE_RADIUS);
                } else {
                    overlay.AddRect2(x1 + 0.5, y1 + 0.5, TRACK_RECT_SIZE);
                    overlay.AddRect2(x2 + 0.5, y2 + 0.5, TRACK_RECT_SIZE);
                    overlay.AddRect2(x3 + 0.5, y3 + 0.5, TRACK_RECT_SIZE);
                    overlay.AddRect2(x4 + 0.5, y4 + 0.5, TRACK_RECT_SIZE);
                }
                if (bIsRectsTrack && false) {
                    var _xC = (((x1 + x2) / 2) >> 0) + 0.5;
                    var _yC = (((y1 + y3) / 2) >> 0) + 0.5;
                    overlay.AddRect2(_xC, y1 + 0.5, TRACK_RECT_SIZE);
                    overlay.AddRect2(x2 + 0.5, _yC, TRACK_RECT_SIZE);
                    overlay.AddRect2(_xC, y3 + 0.5, TRACK_RECT_SIZE);
                    overlay.AddRect2(x1 + 0.5, _yC, TRACK_RECT_SIZE);
                }
                ctx.fill();
                ctx.stroke();
                ctx.beginPath();
            } else {
                overlay.CheckPoint(x1, y1);
                overlay.CheckPoint(x2, y2);
                overlay.CheckPoint(x3, y3);
                overlay.CheckPoint(x4, y4);
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.lineTo(x3, y3);
                ctx.lineTo(x4, y4);
                ctx.closePath();
                overlay.CheckPoint(x1, y1);
                overlay.CheckPoint(x2, y2);
                overlay.CheckPoint(x3, y3);
                overlay.CheckPoint(x4, y4);
                ctx.strokeStyle = _style_white;
                ctx.stroke();
                ctx.beginPath();
                this.AddRectDash(ctx, x1, y1, x2, y2, x3, y3, x4, y4, 8, 3);
                ctx.strokeStyle = _style_blue;
                ctx.stroke();
                var ex1 = (x2 - x1) / _len_x;
                var ey1 = (y2 - y1) / _len_x;
                var ex2 = (x1 - x3) / _len_y;
                var ey2 = (y1 - y3) / _len_y;
                var _bAbsX1 = Math.abs(ex1) < 0.01;
                var _bAbsY1 = Math.abs(ey1) < 0.01;
                var _bAbsX2 = Math.abs(ex2) < 0.01;
                var _bAbsY2 = Math.abs(ey2) < 0.01;
                if (_bAbsX2 && _bAbsY2) {
                    if (_bAbsX1 && _bAbsY1) {
                        ex1 = 1;
                        ey1 = 0;
                        ex2 = 0;
                        ey2 = 1;
                    } else {
                        ex2 = -ey1;
                        ey2 = ex1;
                    }
                } else {
                    if (_bAbsX1 && _bAbsY1) {
                        ex1 = ey2;
                        ey1 = -ex2;
                    }
                }
                var xc1 = (x1 + x2) / 2;
                var yc1 = (y1 + y2) / 2;
                ctx.beginPath();
                if (!bIsUseImageRotateTrack) {
                    ctx.beginPath();
                    overlay.AddEllipse(xc1 + ex2 * TRACK_DISTANCE_ROTATE, yc1 + ey2 * TRACK_DISTANCE_ROTATE, TRACK_DISTANCE_ROTATE);
                    ctx.fillStyle = _style_green;
                    ctx.fill();
                    ctx.stroke();
                } else {
                    if (window.g_track_rotate_marker.asc_complete) {
                        var _xI = xc1 + ex2 * TRACK_DISTANCE_ROTATE;
                        var _yI = yc1 + ey2 * TRACK_DISTANCE_ROTATE;
                        var _w = IMAGE_ROTATE_TRACK_W;
                        var _w2 = IMAGE_ROTATE_TRACK_W / 2;
                        ctx.setTransform(ex1, ey1, -ey1, ex1, _xI, _yI);
                        ctx.drawImage(window.g_track_rotate_marker, -_w2, -_w2, _w, _w);
                        ctx.setTransform(1, 0, 0, 1, 0, 0);
                        overlay.CheckRect(_xI - _w2, _yI - _w2, _w, _w);
                    }
                }
                ctx.beginPath();
                ctx.moveTo(xc1, yc1);
                ctx.lineTo(xc1 + ex2 * TRACK_DISTANCE_ROTATE2, yc1 + ey2 * TRACK_DISTANCE_ROTATE2);
                ctx.stroke();
                ctx.beginPath();
                ctx.fillStyle = _style_white;
                if (bIsEllipceCorner) {
                    overlay.AddEllipse(x1, y1, TRACK_CIRCLE_RADIUS);
                    overlay.AddEllipse(x2, y2, TRACK_CIRCLE_RADIUS);
                    overlay.AddEllipse(x3, y3, TRACK_CIRCLE_RADIUS);
                    overlay.AddEllipse(x4, y4, TRACK_CIRCLE_RADIUS);
                } else {
                    overlay.AddRect3(x1, y1, TRACK_RECT_SIZE, ex1, ey1, ex2, ey2);
                    overlay.AddRect3(x2, y2, TRACK_RECT_SIZE, ex1, ey1, ex2, ey2);
                    overlay.AddRect3(x3, y3, TRACK_RECT_SIZE, ex1, ey1, ex2, ey2);
                    overlay.AddRect3(x4, y4, TRACK_RECT_SIZE, ex1, ey1, ex2, ey2);
                }
                if (bIsRectsTrack) {
                    overlay.AddRect3((x1 + x2) / 2, (y1 + y2) / 2, TRACK_RECT_SIZE, ex1, ey1, ex2, ey2);
                    overlay.AddRect3((x2 + x4) / 2, (y2 + y4) / 2, TRACK_RECT_SIZE, ex1, ey1, ex2, ey2);
                    overlay.AddRect3((x3 + x4) / 2, (y3 + y4) / 2, TRACK_RECT_SIZE, ex1, ey1, ex2, ey2);
                    overlay.AddRect3((x3 + x1) / 2, (y3 + y1) / 2, TRACK_RECT_SIZE, ex1, ey1, ex2, ey2);
                }
                ctx.fill();
                ctx.stroke();
                ctx.beginPath();
            }
            break;
        default:
            break;
        }
        ctx.globalAlpha = _oldGlobalAlpha;
    },
    DrawTrackSelectShapes: function (x, y, w, h) {
        var overlay = this.m_oOverlay;
        overlay.Show();
        this.CurrentPageInfo = overlay.m_oHtmlPage.GetDrawingPageInfo(this.PageIndex);
        var drPage = this.CurrentPageInfo.drawingPage;
        var xDst = drPage.left + (this.Graphics ? this.Graphics.m_oCoordTransform.tx : 0);
        var yDst = drPage.top + (this.Graphics ? this.Graphics.m_oCoordTransform.ty : 0);
        var wDst = drPage.right - drPage.left;
        var hDst = drPage.bottom - drPage.top;
        var dKoefX = wDst / this.CurrentPageInfo.width_mm;
        var dKoefY = hDst / this.CurrentPageInfo.height_mm;
        var x1 = (xDst + dKoefX * x) >> 0;
        var y1 = (yDst + dKoefY * y) >> 0;
        var x2 = (xDst + dKoefX * (x + w)) >> 0;
        var y2 = (yDst + dKoefY * (y + h)) >> 0;
        if (x1 > x2) {
            var tmp = x1;
            x1 = x2;
            x2 = tmp;
        }
        if (y1 > y2) {
            var tmp = y1;
            y1 = y2;
            y2 = tmp;
        }
        overlay.CheckRect(x1, y1, x2 - x1, y2 - y1);
        var ctx = overlay.m_oContext;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        var globalAlphaOld = ctx.globalAlpha;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.fillStyle = "rgba(51,102,204,255)";
        ctx.strokeStyle = "#9ADBFE";
        ctx.lineWidth = 1;
        ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
        ctx.beginPath();
        ctx.strokeRect(x1 - 0.5, y1 - 0.5, x2 - x1 + 1, y2 - y1 + 1);
        ctx.globalAlpha = globalAlphaOld;
    },
    DrawTrackDashRect: function (left, top, width, height, matrix) {
        var overlay = this.m_oOverlay;
        overlay.Show();
        this.CurrentPageInfo = overlay.m_oHtmlPage.GetDrawingPageInfo(this.PageIndex);
        var drPage = this.CurrentPageInfo.drawingPage;
        var xDst = drPage.left + (this.Graphics ? this.Graphics.m_oCoordTransform.tx : 0);
        var yDst = drPage.top + (this.Graphics ? this.Graphics.m_oCoordTransform.ty : 0);
        var wDst = drPage.right - drPage.left;
        var hDst = drPage.bottom - drPage.top;
        var dKoefX = wDst / this.CurrentPageInfo.width_mm;
        var dKoefY = hDst / this.CurrentPageInfo.height_mm;
        var r = x + width;
        var b = y + height;
        var x1 = (xDst + dKoefX * (matrix.TransformPointX(left, top))) >> 0;
        var y1 = (yDst + dKoefY * (matrix.TransformPointY(left, top))) >> 0;
        var x2 = (xDst + dKoefX * (matrix.TransformPointX(r, top))) >> 0;
        var y2 = (yDst + dKoefY * (matrix.TransformPointY(r, top))) >> 0;
        var x3 = (xDst + dKoefX * (matrix.TransformPointX(left, b))) >> 0;
        var y3 = (yDst + dKoefY * (matrix.TransformPointY(left, b))) >> 0;
        var x4 = (xDst + dKoefX * (matrix.TransformPointX(r, b))) >> 0;
        var y4 = (yDst + dKoefY * (matrix.TransformPointY(r, b))) >> 0;
        var bIsClever = false;
        if (x1 == x3 && x2 == x4 && y1 == y2 && y3 == y4 && x1 < x2 && y1 < y3) {
            bIsClever = true;
        }
        var ctx = overlay.m_oContext;
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#0000FF";
        overlay.CheckPoint(x1, y1);
        overlay.CheckPoint(x2, y2);
        overlay.CheckPoint(x3, y3);
        overlay.CheckPoint(x4, y4);
        if (bIsClever) {
            this.AddRectDashClever(ctx, x1, y1, x4, y4, 3, 2);
        } else {
            this.AddRectDash(ctx, x1, y1, x2, y2, x3, y3, x4, y4, 3, 2);
        }
        ctx.stroke();
        ctx.beginPath();
    },
    AddRect: function (ctx, x, y, r, b, bIsClever) {
        if (bIsClever) {
            ctx.rect(x + 0.5, y + 0.5, r - x + 1, b - y + 1);
        } else {
            ctx.moveTo(x, y);
            ctx.rect(x, y, r - x + 1, b - y + 1);
        }
    },
    AddRectDashClever: function (ctx, x, y, r, b, w_dot, w_dist) {
        var _x = x + 0.5;
        var _y = y + 0.5;
        var _r = r + 0.5;
        var _b = b + 0.5;
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
    },
    AddLineDash: function (ctx, x1, y1, x2, y2, w_dot, w_dist) {
        var len = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
        if (len < 1) {
            len = 1;
        }
        var len_x1 = Math.abs(w_dot * (x2 - x1) / len);
        var len_y1 = Math.abs(w_dot * (y2 - y1) / len);
        var len_x2 = Math.abs(w_dist * (x2 - x1) / len);
        var len_y2 = Math.abs(w_dist * (y2 - y1) / len);
        if (x1 <= x2 && y1 <= y2) {
            for (var i = x1, j = y1; i < x2 || j < y2; i += len_x2, j += len_y2) {
                ctx.moveTo(i, j);
                i += len_x1;
                j += len_y1;
                if (i > x2) {
                    i = x2;
                }
                if (j > y2) {
                    j = y2;
                }
                ctx.lineTo(i, j);
            }
        } else {
            if (x1 <= x2 && y1 > y2) {
                for (var i = x1, j = y1; i < x2 || j > y2; i += len_x2, j -= len_y2) {
                    ctx.moveTo(i, j);
                    i += len_x1;
                    j -= len_y1;
                    if (i > x2) {
                        i = x2;
                    }
                    if (j < y2) {
                        j = y2;
                    }
                    ctx.lineTo(i, j);
                }
            } else {
                if (x1 > x2 && y1 <= y2) {
                    for (var i = x1, j = y1; i > x2 || j < y2; i -= len_x2, j += len_y2) {
                        ctx.moveTo(i, j);
                        i -= len_x1;
                        j += len_y1;
                        if (i < x2) {
                            i = x2;
                        }
                        if (j > y2) {
                            j = y2;
                        }
                        ctx.lineTo(i, j);
                    }
                } else {
                    for (var i = x1, j = y1; i > x2 || j > y2; i -= len_x2, j -= len_y2) {
                        ctx.moveTo(i, j);
                        i -= len_x1;
                        j -= len_y1;
                        if (i < x2) {
                            i = x2;
                        }
                        if (j < y2) {
                            j = y2;
                        }
                        ctx.lineTo(i, j);
                    }
                }
            }
        }
    },
    AddRectDash: function (ctx, x1, y1, x2, y2, x3, y3, x4, y4, w_dot, w_dist) {
        this.AddLineDash(ctx, x1, y1, x2, y2, w_dot, w_dist);
        this.AddLineDash(ctx, x2, y2, x4, y4, w_dot, w_dist);
        this.AddLineDash(ctx, x4, y4, x3, y3, w_dot, w_dist);
        this.AddLineDash(ctx, x3, y3, x1, y1, w_dot, w_dist);
    },
    DrawAdjustment: function (matrix, x, y) {
        var overlay = this.m_oOverlay;
        this.CurrentPageInfo = overlay.m_oHtmlPage.GetDrawingPageInfo(this.PageIndex);
        var drPage = this.CurrentPageInfo.drawingPage;
        var xDst = drPage.left + (this.Graphics ? this.Graphics.m_oCoordTransform.tx : 0);
        var yDst = drPage.top + (this.Graphics ? this.Graphics.m_oCoordTransform.ty : 0);
        var wDst = drPage.right - drPage.left;
        var hDst = drPage.bottom - drPage.top;
        var dKoefX = wDst / this.CurrentPageInfo.width_mm;
        var dKoefY = hDst / this.CurrentPageInfo.height_mm;
        var cx = (xDst + dKoefX * (matrix.TransformPointX(x, y))) >> 0;
        var cy = (yDst + dKoefY * (matrix.TransformPointY(x, y))) >> 0;
        var _style_blue = "#4D7399";
        var _style_yellow = "#FDF54A";
        var ctx = overlay.m_oContext;
        var dist = TRACK_ADJUSTMENT_SIZE / 2;
        ctx.moveTo(cx - dist, cy);
        ctx.lineTo(cx, cy - dist);
        ctx.lineTo(cx + dist, cy);
        ctx.lineTo(cx, cy + dist);
        ctx.closePath();
        overlay.CheckRect(cx - dist, cy - dist, TRACK_ADJUSTMENT_SIZE, TRACK_ADJUSTMENT_SIZE);
        ctx.fillStyle = _style_yellow;
        ctx.strokeStyle = _style_blue;
        ctx.fill();
        ctx.stroke();
    },
    DrawEditWrapPointsPolygon: function (points, matrix) {
        var _len = points.length;
        if (0 == _len) {
            return;
        }
        var overlay = this.m_oOverlay;
        var ctx = overlay.m_oContext;
        this.CurrentPageInfo = overlay.m_oHtmlPage.GetDrawingPageInfo(this.PageIndex);
        var drPage = this.CurrentPageInfo.drawingPage;
        var xDst = drPage.left;
        var yDst = drPage.top;
        var wDst = drPage.right - drPage.left;
        var hDst = drPage.bottom - drPage.top;
        var dKoefX = wDst / this.CurrentPageInfo.width_mm;
        var dKoefY = hDst / this.CurrentPageInfo.height_mm;
        var _tr_points_x = new Array(_len);
        var _tr_points_y = new Array(_len);
        for (var i = 0; i < _len; i++) {
            _tr_points_x[i] = (xDst + dKoefX * (matrix.TransformPointX(points[i].x, points[i].y))) >> 0;
            _tr_points_y[i] = (yDst + dKoefY * (matrix.TransformPointY(points[i].x, points[i].y))) >> 0;
        }
        ctx.beginPath();
        for (var i = 0; i < _len; i++) {
            if (0 == i) {
                ctx.moveTo(_tr_points_x[i], _tr_points_y[i]);
            } else {
                ctx.lineTo(_tr_points_x[i], _tr_points_y[i]);
            }
            overlay.CheckPoint(_tr_points_x[i], _tr_points_y[i]);
        }
        ctx.closePath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#FF0000";
        ctx.stroke();
        ctx.beginPath();
        for (var i = 0; i < _len; i++) {
            overlay.AddRect2(_tr_points_x[i] + 0.5, _tr_points_y[i] + 0.5, TRACK_WRAPPOINTS_SIZE);
        }
        ctx.strokeStyle = "#FFFFFF";
        ctx.fillStyle = "#000000";
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
    },
    DrawEditWrapPointsTrackLines: function (points, matrix) {
        var _len = points.length;
        if (0 == _len) {
            return;
        }
        var overlay = this.m_oOverlay;
        var ctx = overlay.m_oContext;
        this.CurrentPageInfo = overlay.m_oHtmlPage.GetDrawingPageInfo(this.PageIndex);
        var drPage = this.CurrentPageInfo.drawingPage;
        var xDst = drPage.left;
        var yDst = drPage.top;
        var wDst = drPage.right - drPage.left;
        var hDst = drPage.bottom - drPage.top;
        var dKoefX = wDst / this.CurrentPageInfo.width_mm;
        var dKoefY = hDst / this.CurrentPageInfo.height_mm;
        var _tr_points_x = new Array(_len);
        var _tr_points_y = new Array(_len);
        for (var i = 0; i < _len; i++) {
            _tr_points_x[i] = (xDst + dKoefX * (matrix.TransformPointX(points[i].x, points[i].y))) >> 0;
            _tr_points_y[i] = (yDst + dKoefY * (matrix.TransformPointY(points[i].x, points[i].y))) >> 0;
        }
        var globalAlpha = ctx.globalAlpha;
        ctx.globalAlpha = 1;
        ctx.beginPath();
        for (var i = 0; i < _len; i++) {
            if (0 == i) {
                ctx.moveTo(_tr_points_x[i], _tr_points_y[i]);
            } else {
                ctx.lineTo(_tr_points_x[i], _tr_points_y[i]);
            }
            overlay.CheckPoint(_tr_points_x[i], _tr_points_y[i]);
        }
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#FFFFFF";
        ctx.stroke();
        ctx.beginPath();
        for (var i = 1; i < _len; i++) {
            this.AddLineDash(ctx, _tr_points_x[i - 1], _tr_points_y[i - 1], _tr_points_x[i], _tr_points_y[i], 4, 4);
        }
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#000000";
        ctx.stroke();
        ctx.beginPath();
        ctx.globalAlpha = globalAlpha;
    },
    DrawInlineMoveCursor: function (x, y, h, matrix) {
        var overlay = this.m_oOverlay;
        this.CurrentPageInfo = overlay.m_oHtmlPage.GetDrawingPageInfo(this.PageIndex);
        var drPage = this.CurrentPageInfo.drawingPage;
        var xDst = drPage.left;
        var yDst = drPage.top;
        var wDst = drPage.right - drPage.left;
        var hDst = drPage.bottom - drPage.top;
        var dKoefX = wDst / this.CurrentPageInfo.width_mm;
        var dKoefY = hDst / this.CurrentPageInfo.height_mm;
        var bIsIdentMatr = true;
        if (matrix !== undefined && matrix != null) {
            if (matrix.IsIdentity2()) {
                x += matrix.tx;
                y += matrix.ty;
            } else {
                bIsIdentMatr = false;
            }
        }
        if (bIsIdentMatr) {
            var __x = (xDst + dKoefX * x) >> 0;
            var __y = (yDst + dKoefY * y) >> 0;
            var __h = (h * dKoefY) >> 0;
            overlay.CheckRect(__x, __y, 2, __h);
            var ctx = overlay.m_oContext;
            var _oldAlpha = ctx.globalAlpha;
            ctx.globalAlpha = 1;
            ctx.lineWidth = 1;
            ctx.strokeStyle = "#000000";
            for (var i = 0; i < __h; i += 2) {
                ctx.moveTo(__x, __y + i + 0.5);
                ctx.lineTo(__x + 2, __y + i + 0.5);
            }
            ctx.stroke();
            ctx.beginPath();
            ctx.strokeStyle = "#FFFFFF";
            for (var i = 1; i < __h; i += 2) {
                ctx.moveTo(__x, __y + i + 0.5);
                ctx.lineTo(__x + 2, __y + i + 0.5);
            }
            ctx.stroke();
            ctx.globalAlpha = _oldAlpha;
        } else {
            var _x1 = matrix.TransformPointX(x, y);
            var _y1 = matrix.TransformPointY(x, y);
            var _x2 = matrix.TransformPointX(x, y + h);
            var _y2 = matrix.TransformPointY(x, y + h);
            _x1 = xDst + dKoefX * _x1;
            _y1 = yDst + dKoefY * _y1;
            _x2 = xDst + dKoefX * _x2;
            _y2 = yDst + dKoefY * _y2;
            overlay.CheckPoint(_x1, _y1);
            overlay.CheckPoint(_x2, _y2);
            var ctx = overlay.m_oContext;
            var _oldAlpha = ctx.globalAlpha;
            ctx.globalAlpha = 1;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.strokeStyle = "#FFFFFF";
            ctx.moveTo(_x1, _y1);
            ctx.lineTo(_x2, _y2);
            ctx.stroke();
            ctx.beginPath();
            ctx.strokeStyle = "#000000";
            var _vec_len = Math.sqrt((_x2 - _x1) * (_x2 - _x1) + (_y2 - _y1) * (_y2 - _y1));
            var _dx = (_x2 - _x1) / _vec_len;
            var _dy = (_y2 - _y1) / _vec_len;
            var __x = _x1;
            var __y = _y1;
            for (var i = 0; i < _vec_len; i += 2) {
                ctx.moveTo(__x, __y);
                __x += _dx;
                __y += _dy;
                ctx.lineTo(__x, __y);
                __x += _dx;
                __y += _dy;
            }
            ctx.stroke();
            ctx.globalAlpha = _oldAlpha;
        }
    },
    drawFlowAnchor: function (x, y) {
        if (!window.g_flow_anchor || !window.g_flow_anchor.asc_complete || (!editor || !editor.ShowParaMarks)) {
            return;
        }
        var overlay = this.m_oOverlay;
        this.CurrentPageInfo = overlay.m_oHtmlPage.GetDrawingPageInfo(this.PageIndex);
        var drPage = this.CurrentPageInfo.drawingPage;
        var xDst = drPage.left;
        var yDst = drPage.top;
        var wDst = drPage.right - drPage.left;
        var hDst = drPage.bottom - drPage.top;
        var dKoefX = wDst / this.CurrentPageInfo.width_mm;
        var dKoefY = hDst / this.CurrentPageInfo.height_mm;
        var __x = (xDst + dKoefX * x) >> 0;
        var __y = (yDst + dKoefY * y) >> 0;
        __x -= 8;
        overlay.CheckRect(__x, __y, 16, 17);
        var ctx = overlay.m_oContext;
        var _oldAlpha = ctx.globalAlpha;
        ctx.globalAlpha = 1;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.drawImage(window.g_flow_anchor, __x, __y);
        ctx.globalAlpha = _oldAlpha;
    }
};
function CSlideBoundsChecker() {
    this.map_bounds_shape = {};
    this.map_bounds_shape["heart"] = true;
    this.IsSlideBoundsCheckerType = true;
    this.Bounds = new CBoundsController();
    this.m_oCurFont = null;
    this.m_oCoordTransform = new CMatrixL();
    this.m_oTransform = new CMatrixL();
    this.m_oFullTransform = new CMatrixL();
    this.IsNoSupportTextDraw = true;
    this.LineWidth = null;
    this.AutoCheckLineWidth = false;
}
CSlideBoundsChecker.prototype = {
    IsShapeNeedBounds: function (preset) {
        if (preset === undefined || preset == null) {
            return true;
        }
        return (true === this.map_bounds_shape[preset]) ? false : true;
    },
    init: function (width_px, height_px, width_mm, height_mm) {
        this.m_lHeightPix = height_px;
        this.m_lWidthPix = width_px;
        this.m_dWidthMM = width_mm;
        this.m_dHeightMM = height_mm;
        this.m_dDpiX = 25.4 * this.m_lWidthPix / this.m_dWidthMM;
        this.m_dDpiY = 25.4 * this.m_lHeightPix / this.m_dHeightMM;
        this.m_oCoordTransform.sx = this.m_dDpiX / 25.4;
        this.m_oCoordTransform.sy = this.m_dDpiY / 25.4;
        this.Bounds.ClearNoAttack();
    },
    SetCurrentPage: function () {},
    EndDraw: function () {},
    put_GlobalAlpha: function (enable, alpha) {},
    p_color: function (r, g, b, a) {},
    p_width: function (w) {},
    b_color1: function (r, g, b, a) {},
    b_color2: function (r, g, b, a) {},
    SetIntegerGrid: function () {},
    transform: function (sx, shy, shx, sy, tx, ty) {
        this.m_oTransform.sx = sx;
        this.m_oTransform.shx = shx;
        this.m_oTransform.shy = shy;
        this.m_oTransform.sy = sy;
        this.m_oTransform.tx = tx;
        this.m_oTransform.ty = ty;
        this.CalculateFullTransform();
    },
    CalculateFullTransform: function () {
        this.m_oFullTransform.sx = this.m_oTransform.sx;
        this.m_oFullTransform.shx = this.m_oTransform.shx;
        this.m_oFullTransform.shy = this.m_oTransform.shy;
        this.m_oFullTransform.sy = this.m_oTransform.sy;
        this.m_oFullTransform.tx = this.m_oTransform.tx;
        this.m_oFullTransform.ty = this.m_oTransform.ty;
        global_MatrixTransformer.MultiplyAppend(this.m_oFullTransform, this.m_oCoordTransform);
    },
    _s: function () {},
    _e: function () {},
    _z: function () {},
    _m: function (x, y) {
        var _x = this.m_oFullTransform.TransformPointX(x, y);
        var _y = this.m_oFullTransform.TransformPointY(x, y);
        this.Bounds.CheckPoint(_x, _y);
    },
    _l: function (x, y) {
        var _x = this.m_oFullTransform.TransformPointX(x, y);
        var _y = this.m_oFullTransform.TransformPointY(x, y);
        this.Bounds.CheckPoint(_x, _y);
    },
    _c: function (x1, y1, x2, y2, x3, y3) {
        var _x1 = this.m_oFullTransform.TransformPointX(x1, y1);
        var _y1 = this.m_oFullTransform.TransformPointY(x1, y1);
        var _x2 = this.m_oFullTransform.TransformPointX(x2, y2);
        var _y2 = this.m_oFullTransform.TransformPointY(x2, y2);
        var _x3 = this.m_oFullTransform.TransformPointX(x3, y3);
        var _y3 = this.m_oFullTransform.TransformPointY(x3, y3);
        this.Bounds.CheckPoint(_x1, _y1);
        this.Bounds.CheckPoint(_x2, _y2);
        this.Bounds.CheckPoint(_x3, _y3);
    },
    _c2: function (x1, y1, x2, y2) {
        var _x1 = this.m_oFullTransform.TransformPointX(x1, y1);
        var _y1 = this.m_oFullTransform.TransformPointY(x1, y1);
        var _x2 = this.m_oFullTransform.TransformPointX(x2, y2);
        var _y2 = this.m_oFullTransform.TransformPointY(x2, y2);
        this.Bounds.CheckPoint(_x1, _y1);
        this.Bounds.CheckPoint(_x2, _y2);
    },
    ds: function () {},
    df: function () {},
    save: function () {},
    restore: function () {},
    clip: function () {},
    reset: function () {
        this.m_oTransform.Reset();
        this.CalculateFullTransform();
    },
    transform3: function (m) {
        this.m_oTransform = m.CreateDublicate();
        this.CalculateFullTransform();
    },
    transform00: function (m) {
        this.m_oTransform = m.CreateDublicate();
        this.m_oTransform.tx = 0;
        this.m_oTransform.ty = 0;
        this.CalculateFullTransform();
    },
    drawImage2: function (img, x, y, w, h) {
        var _x1 = this.m_oFullTransform.TransformPointX(x, y);
        var _y1 = this.m_oFullTransform.TransformPointY(x, y);
        var _x2 = this.m_oFullTransform.TransformPointX(x + w, y);
        var _y2 = this.m_oFullTransform.TransformPointY(x + w, y);
        var _x3 = this.m_oFullTransform.TransformPointX(x + w, y + h);
        var _y3 = this.m_oFullTransform.TransformPointY(x + w, y + h);
        var _x4 = this.m_oFullTransform.TransformPointX(x, y + h);
        var _y4 = this.m_oFullTransform.TransformPointY(x, y + h);
        this.Bounds.CheckPoint(_x1, _y1);
        this.Bounds.CheckPoint(_x2, _y2);
        this.Bounds.CheckPoint(_x3, _y3);
        this.Bounds.CheckPoint(_x4, _y4);
    },
    drawImage: function (img, x, y, w, h) {
        return this.drawImage2(img, x, y, w, h);
    },
    font: function (font_id, font_size) {
        this.m_oFontManager.LoadFontFromFile(font_id, font_size, this.m_dDpiX, this.m_dDpiY);
    },
    GetFont: function () {
        return this.m_oCurFont;
    },
    SetFont: function (font) {
        this.m_oCurFont = font;
    },
    FillText: function (x, y, text) {
        if (this.m_bIsBreak) {
            return;
        }
        var _x = this.m_oFullTransform.TransformPointX(x, y);
        var _y = this.m_oFullTransform.TransformPointY(x, y);
        this.Bounds.CheckRect(_x, _y, 1, 1);
    },
    t: function (text, x, y) {
        if (this.m_bIsBreak) {
            return;
        }
        var _x = this.m_oFullTransform.TransformPointX(x, y);
        var _y = this.m_oFullTransform.TransformPointY(x, y);
        this.Bounds.CheckRect(_x, _y, 1, 1);
    },
    FillText2: function (x, y, text, cropX, cropW) {
        if (this.m_bIsBreak) {
            return;
        }
        var _x = this.m_oFullTransform.TransformPointX(x, y);
        var _y = this.m_oFullTransform.TransformPointY(x, y);
        this.Bounds.CheckRect(_x, _y, 1, 1);
    },
    t2: function (text, x, y, cropX, cropW) {
        if (this.m_bIsBreak) {
            return;
        }
        var _x = this.m_oFullTransform.TransformPointX(x, y);
        var _y = this.m_oFullTransform.TransformPointY(x, y);
        this.Bounds.CheckRect(_x, _y, 1, 1);
    },
    charspace: function (space) {},
    DrawHeaderEdit: function (yPos) {},
    DrawFooterEdit: function (yPos) {},
    DrawEmptyTableLine: function (x1, y1, x2, y2) {},
    drawHorLine: function (align, y, x, r, penW) {
        var _x1 = this.m_oFullTransform.TransformPointX(x, y - penW);
        var _y1 = this.m_oFullTransform.TransformPointY(x, y - penW);
        var _x2 = this.m_oFullTransform.TransformPointX(x, y + penW);
        var _y2 = this.m_oFullTransform.TransformPointY(x, y + penW);
        var _x3 = this.m_oFullTransform.TransformPointX(r, y - penW);
        var _y3 = this.m_oFullTransform.TransformPointY(r, y - penW);
        var _x4 = this.m_oFullTransform.TransformPointX(r, y + penW);
        var _y4 = this.m_oFullTransform.TransformPointY(r, y + penW);
        this.Bounds.CheckPoint(_x1, _y1);
        this.Bounds.CheckPoint(_x2, _y2);
        this.Bounds.CheckPoint(_x3, _y3);
        this.Bounds.CheckPoint(_x4, _y4);
    },
    drawVerLine: function (align, x, y, b, penW) {
        var _x1 = this.m_oFullTransform.TransformPointX(x - penW, y);
        var _y1 = this.m_oFullTransform.TransformPointY(x - penW, y);
        var _x2 = this.m_oFullTransform.TransformPointX(x + penW, y);
        var _y2 = this.m_oFullTransform.TransformPointY(x + penW, y);
        var _x3 = this.m_oFullTransform.TransformPointX(x - penW, b);
        var _y3 = this.m_oFullTransform.TransformPointY(x - penW, b);
        var _x4 = this.m_oFullTransform.TransformPointX(x + penW, b);
        var _y4 = this.m_oFullTransform.TransformPointY(x + penW, b);
        this.Bounds.CheckPoint(_x1, _y1);
        this.Bounds.CheckPoint(_x2, _y2);
        this.Bounds.CheckPoint(_x3, _y3);
        this.Bounds.CheckPoint(_x4, _y4);
    },
    drawHorLineExt: function (align, y, x, r, penW, leftMW, rightMW) {
        this.drawHorLine(align, y, x + leftMW, r + rightMW);
    },
    rect: function (x, y, w, h) {
        var _x1 = this.m_oFullTransform.TransformPointX(x, y);
        var _y1 = this.m_oFullTransform.TransformPointY(x, y);
        var _x2 = this.m_oFullTransform.TransformPointX(x + w, y);
        var _y2 = this.m_oFullTransform.TransformPointY(x + w, y);
        var _x3 = this.m_oFullTransform.TransformPointX(x + w, y + h);
        var _y3 = this.m_oFullTransform.TransformPointY(x + w, y + h);
        var _x4 = this.m_oFullTransform.TransformPointX(x, y + h);
        var _y4 = this.m_oFullTransform.TransformPointY(x, y + h);
        this.Bounds.CheckPoint(_x1, _y1);
        this.Bounds.CheckPoint(_x2, _y2);
        this.Bounds.CheckPoint(_x3, _y3);
        this.Bounds.CheckPoint(_x4, _y4);
    },
    rect2: function (x, y, w, h) {
        var _x1 = this.m_oFullTransform.TransformPointX(x, y);
        var _y1 = this.m_oFullTransform.TransformPointY(x, y);
        var _x2 = this.m_oFullTransform.TransformPointX(x + w, y);
        var _y2 = this.m_oFullTransform.TransformPointY(x + w, y);
        var _x3 = this.m_oFullTransform.TransformPointX(x + w, y - h);
        var _y3 = this.m_oFullTransform.TransformPointY(x + w, y - h);
        var _x4 = this.m_oFullTransform.TransformPointX(x, y - h);
        var _y4 = this.m_oFullTransform.TransformPointY(x, y - h);
        this.Bounds.CheckPoint(_x1, _y1);
        this.Bounds.CheckPoint(_x2, _y2);
        this.Bounds.CheckPoint(_x3, _y3);
        this.Bounds.CheckPoint(_x4, _y4);
    },
    TableRect: function (x, y, w, h) {
        this.rect(x, y, w, h);
    },
    AddClipRect: function (x, y, w, h) {},
    RemoveClipRect: function () {},
    SetClip: function (r) {},
    RemoveClip: function () {},
    SavePen: function () {},
    RestorePen: function () {},
    SaveBrush: function () {},
    RestoreBrush: function () {},
    SavePenBrush: function () {},
    RestorePenBrush: function () {},
    SaveGrState: function () {},
    RestoreGrState: function () {},
    StartClipPath: function () {},
    EndClipPath: function () {},
    CorrectBounds: function () {
        if (this.LineWidth != null) {
            var _correct = this.LineWidth / 2;
            this.Bounds.min_x -= _correct;
            this.Bounds.min_y -= _correct;
            this.Bounds.max_x += _correct;
            this.Bounds.max_y += _correct;
        }
    },
    CorrectBounds2: function () {
        if (this.LineWidth != null) {
            var _correct = this.LineWidth * this.m_oCoordTransform.sx / 2;
            this.Bounds.min_x -= _correct;
            this.Bounds.min_y -= _correct;
            this.Bounds.max_x += _correct;
            this.Bounds.max_y += _correct;
        }
    }
};