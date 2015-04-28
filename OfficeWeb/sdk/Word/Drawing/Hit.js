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
var double_eps = 1e-05;
var hit_error_eps = 0.5;
function HitInLine(context, px, py, x0, y0, x1, y1) {
    var tx, ty, dx, dy, d;
    tx = x1 - x0;
    ty = y1 - y0;
    if (Math.abs(tx * tx + ty * ty) < double_eps) {
        return HitInLine(context, px, py, x0, y0, x1 + hit_error_eps, y1 + hit_error_eps);
    }
    d = 1.5 / Math.sqrt(tx * tx + ty * ty);
    if (global_mouseEvent !== null && typeof global_mouseEvent === "object" && typeof global_mouseEvent.KoefPixToMM === "number" && !isNaN(global_mouseEvent.KoefPixToMM)) {
        d *= global_mouseEvent.KoefPixToMM;
    }
    dx = -ty * d;
    dy = tx * d;
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x0 + dx, y0 + dy);
    context.lineTo(x1 + dx, y1 + dy);
    context.lineTo(x1 - dx, y1 - dy);
    context.lineTo(x0 - dx, y0 - dy);
    context.closePath();
    return context.isPointInPath(px, py);
}
function HitInBezier4(context, px, py, x0, y0, x1, y1, x2, y2, x3, y3) {
    var tx, ty, dx, dy, d;
    tx = x3 - x0;
    ty = y3 - y0;
    if (Math.abs(tx * tx + ty * ty) < double_eps) {
        return HitInLine(context, px, py, x0, y0, x1, y1, x2, y2, x3 + hit_error_eps, y3 + hit_error_eps);
    }
    d = 1.5 / Math.sqrt(tx * tx + ty * ty);
    if (global_mouseEvent !== null && typeof global_mouseEvent === "object" && typeof global_mouseEvent.KoefPixToMM === "number" && !isNaN(global_mouseEvent.KoefPixToMM)) {
        d *= global_mouseEvent.KoefPixToMM;
    }
    dx = -ty * d;
    dy = tx * d;
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x0 + dx, y0 + dy);
    context.bezierCurveTo(x1 + dx, y1 + dy, x2 + dx, y2 + dy, x3 + dx, y3 + dy);
    context.lineTo(x3 - dx, y3 - dy);
    context.bezierCurveTo(x2 - dx, y2 - dy, x1 - dx, y1 - dy, x0 - dx, y0 - dy);
    context.closePath();
    return context.isPointInPath(px, py);
}
function HitInBezier3(context, px, py, x0, y0, x1, y1, x2, y2) {
    var tx, ty, dx, dy, d;
    tx = x2 - x0;
    ty = y2 - y0;
    if (Math.abs(tx * tx + ty * ty) < double_eps) {
        return HitInLine(context, px, py, x0, y0, x1, y1, x2 + hit_error_eps, y2 + hit_error_eps);
    }
    d = 1.5 / Math.sqrt(tx * tx + ty * ty);
    if (global_mouseEvent !== null && typeof global_mouseEvent === "object" && typeof global_mouseEvent.KoefPixToMM === "number" && !isNaN(global_mouseEvent.KoefPixToMM)) {
        d *= global_mouseEvent.KoefPixToMM;
    }
    dx = -ty * d;
    dy = tx * d;
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x0 + dx, y0 + dy);
    context.quadraticCurveTo(x1 + dx, y1 + dy, x2 + dx, y2 + dy);
    context.lineTo(x2 - dx, y2 - dy);
    context.quadraticCurveTo(x1 - dx, y1 - dy, x0 - dx, y0 - dy);
    context.closePath();
    return context.isPointInPath(px, py);
}