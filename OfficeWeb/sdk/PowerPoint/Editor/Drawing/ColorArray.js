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
 function CShapeColor(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.darken = function () {
        var hslColor = RGBToHSL(this);
        hslColor.l *= 0.9;
        return HSLToRGB(hslColor);
    };
    this.darkenLess = function () {
        var hslColor = RGBToHSL(this);
        hslColor.l *= 0.85;
        return HSLToRGB(hslColor);
    };
    this.lighten = function () {
        var hslColor = RGBToHSL(this);
        hslColor.l *= 1.1;
        if (hslColor.l > 1) {
            hslColor.l = 1;
        }
        return HSLToRGB(hslColor);
    };
    this.lightenLess = function () {
        var hslColor = RGBToHSL(this);
        hslColor.l *= 1.1;
        if (hslColor.l > 1) {
            hslColor.l = 1;
        }
        return HSLToRGB(hslColor);
    };
    this.norm = function (a) {
        return this;
    };
}
function RGBToHSL(RGBColor) {
    var r, g, b;
    r = RGBColor.r / 255;
    g = RGBColor.g / 255;
    b = RGBColor.b / 255;
    var max, min;
    max = Math.max(r, g, b);
    min = Math.min(r, g, b);
    var h, s, l;
    h = max === min ? 0 : (max == r && g >= b) ? 60 * (g - b) / (max - min) : (max == r && g < b) ? 60 * (g - b) / (max - min) + 360 : (max == g) ? 60 * (b - r) / (max - min) + 120 : 60 * (r - g) / (max - min) + 240;
    l = (max + min) * 0.5;
    s = l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);
    while (h < 0) {
        h += 360;
    }
    while (h >= 360) {
        h -= 360;
    }
    return {
        h: h,
        s: s,
        l: l
    };
}
function HSLToRGB(HSLColor) {
    var h, s, l, r, g, b;
    h = HSLColor.h / 360;
    s = HSLColor.s;
    l = HSLColor.l;
    var q, p, tr, tg, tb;
    q = l < 0.5 ? (l * (1 + s)) : l + s - l * s;
    p = 2 * l - q;
    tr = h + 1 / 3;
    tg = h;
    tb = h - 1 / 3;
    if (tr < 0) {
        tr += 1;
    }
    if (tr > 1) {
        tr -= 1;
    }
    if (tg < 0) {
        tg += 1;
    }
    if (tg > 1) {
        tg -= 1;
    }
    if (tb < 0) {
        tb += 1;
    }
    if (tb > 1) {
        tb -= 1;
    }
    r = Math.round(255 * (tr < 1 / 6 ? p + ((q - p) * 6 * tr) : (1 / 6 < tr && tr < 1 / 2) ? q : (1 / 2 < tr && tr < 2 / 3) ? (p + ((q - p) * (2 / 3 - tr) * 6)) : p));
    g = Math.round(255 * (tg < 1 / 6 ? p + ((q - p) * 6 * tg) : (1 / 6 < tg && tg < 1 / 2) ? q : (1 / 2 < tg && tg < 2 / 3) ? (p + ((q - p) * (2 / 3 - tg) * 6)) : p));
    b = Math.round(255 * (tb < 1 / 6 ? p + ((q - p) * 6 * tb) : (1 / 6 < tb && tb < 1 / 2) ? q : (1 / 2 < tb && tb < 2 / 3) ? (p + ((q - p) * (2 / 3 - tb) * 6)) : p));
    if (r > 255) {
        r = 255;
    }
    if (g > 255) {
        g = 255;
    }
    if (b > 255) {
        b = 255;
    }
    return {
        r: r,
        g: g,
        b: b
    };
}