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
CGraphics.prototype.DrawLockParagraph = function (lock_type, x, y1, y2) {
    if (lock_type == locktype_None || editor.WordControl.m_oDrawingDocument.IsLockObjectsEnable === false || editor.isViewMode) {
        return;
    }
    if (lock_type == locktype_Mine) {
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
};
CGraphics.prototype.DrawLockObjectRect = function (lock_type, x, y, w, h) {
    if (editor.isViewMode || this.IsThumbnail || lock_type == locktype_None) {
        return;
    }
    if (editor.WordControl.m_oDrawingDocument.IsLockObjectsEnable === false && lock_type == locktype_Mine) {
        return;
    }
    if (lock_type == locktype_Mine) {
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
        var _interf = editor.WordControl.m_oDrawingDocument.AutoShapesTrack;
        var eps = 5 * dKoefMMToPx;
        var _x = x - eps;
        var _y = y - eps;
        var _r = x + w + eps;
        var _b = y + h + eps;
        this._s();
        _interf.AddRectDash(ctx, _x, _y, _r, _y, _x, _b, _r, _b, w_dot, w_dist, true);
        this._s();
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
};