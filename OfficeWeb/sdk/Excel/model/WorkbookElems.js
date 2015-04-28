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
var g_oColorManager = null;
var g_nNumsMaxId = 160;
var g_oDefaultXfId = null;
var g_oDefaultFont = null;
var g_oDefaultFill = null;
var g_oDefaultNum = null;
var g_oDefaultBorder = null;
var g_oDefaultAlign = null;
var g_oDefaultFontAbs = null;
var g_oDefaultFillAbs = null;
var g_oDefaultNumAbs = null;
var g_oDefaultBorderAbs = null;
var g_oDefaultAlignAbs = null;
var g_nColorTextDefault = 1;
var g_nColorHyperlink = 10;
var g_nColorHyperlinkVisited = 11;
var g_oThemeColorsDefaultModsSpreadsheet = [[0, -0.0499893185216834, -0.1499984740745262, -0.249977111117893, -0.3499862666707358, -0.499984740745262], [0, -0.09997863704336681, -0.249977111117893, -0.499984740745262, -0.749992370372631, -0.8999908444471572], [0, 0.7999816888943144, 0.5999938962981049, 0.3999755851924192, -0.249977111117893, -0.499984740745262], [0, 0.8999908444471572, 0.749992370372631, 0.499984740745262, 0.249977111117893, 0.09997863704336681], [0, 0.499984740745262, 0.3499862666707358, 0.249977111117893, 0.1499984740745262, 0.0499893185216834]];
var map_themeExcel_to_themePresentation = {
    0: 12,
    1: 8,
    2: 13,
    3: 9,
    4: 0,
    5: 1,
    6: 2,
    7: 3,
    8: 4,
    9: 5,
    10: 11,
    11: 10
};
var map_themePresentation_to_themeExcel = {};
(function () {
    for (var i in map_themeExcel_to_themePresentation) {
        map_themePresentation_to_themeExcel[map_themeExcel_to_themePresentation[i]] = i - 0;
    }
})();
function shiftGetBBox(bbox, bHor) {
    var bboxGet = null;
    if (bHor) {
        bboxGet = Asc.Range(bbox.c1, bbox.r1, gc_nMaxCol0, bbox.r2);
    } else {
        bboxGet = Asc.Range(bbox.c1, bbox.r1, bbox.c2, gc_nMaxRow0);
    }
    return bboxGet;
}
function shiftSort(a, b, offset) {
    var nRes = 0;
    if (null == a.to || null == b.to) {
        if (null == a.to && null == b.to) {
            nRes = 0;
        } else {
            if (null == a.to) {
                nRes = -1;
            } else {
                if (null == b.to) {
                    nRes = 1;
                }
            }
        }
    } else {
        if (0 != offset.offsetRow) {
            if (offset.offsetRow > 0) {
                nRes = b.to.r1 - a.to.r1;
            } else {
                nRes = a.to.r1 - b.to.r1;
            }
        }
        if (0 == nRes && 0 != offset.offsetCol) {
            if (offset.offsetCol > 0) {
                nRes = b.to.c1 - a.to.c1;
            } else {
                nRes = a.to.c1 - b.to.c1;
            }
        }
    }
    return nRes;
}
var g_oRgbColorProperties = {
    rgb: 0
};
function RgbColor(rgb) {
    this.Properties = g_oRgbColorProperties;
    this.rgb = rgb;
}
RgbColor.prototype = {
    clone: function () {
        return new RgbColor(this.rgb);
    },
    getType: function () {
        return UndoRedoDataTypes.RgbColor;
    },
    getProperties: function () {
        return this.Properties;
    },
    getProperty: function (nType) {
        switch (nType) {
        case this.Properties.rgb:
            return this.rgb;
            break;
        }
    },
    setProperty: function (nType, value) {
        switch (nType) {
        case this.Properties.rgb:
            this.rgb = value;
            break;
        }
    },
    Write_ToBinary2: function (oBinaryWriter) {
        oBinaryWriter.WriteLong(this.rgb);
    },
    Read_FromBinary2: function (oBinaryReader) {
        this.rgb = oBinaryReader.GetULongLE();
    },
    getRgb: function () {
        return this.rgb;
    },
    getR: function () {
        return (this.rgb >> 16) & 255;
    },
    getG: function () {
        return (this.rgb >> 8) & 255;
    },
    getB: function () {
        return this.rgb & 255;
    },
    getA: function () {
        return 1;
    }
};
var g_oThemeColorProperties = {
    rgb: 0,
    theme: 1,
    tint: 2
};
function ThemeColor() {
    this.Properties = g_oThemeColorProperties;
    this.rgb = null;
    this.theme = null;
    this.tint = null;
}
ThemeColor.prototype = {
    clone: function () {
        var res = new ThemeColor();
        res.rgb = this.rgb;
        res.theme = this.theme;
        res.tint = this.tint;
        return res;
    },
    getType: function () {
        return UndoRedoDataTypes.ThemeColor;
    },
    getProperties: function () {
        return this.Properties;
    },
    getProperty: function (nType) {
        switch (nType) {
        case this.Properties.rgb:
            return this.rgb;
            break;
        case this.Properties.theme:
            return this.theme;
            break;
        case this.Properties.tint:
            return this.tint;
            break;
        }
    },
    setProperty: function (nType, value) {
        switch (nType) {
        case this.Properties.rgb:
            this.rgb = value;
            break;
        case this.Properties.theme:
            this.theme = value;
            break;
        case this.Properties.tint:
            this.tint = value;
            break;
        }
    },
    Write_ToBinary2: function (oBinaryWriter) {
        oBinaryWriter.WriteByte(this.theme);
        if (null != this.tint) {
            oBinaryWriter.WriteByte(true);
            oBinaryWriter.WriteDouble2(this.tint);
        } else {
            oBinaryWriter.WriteBool(false);
        }
    },
    Read_FromBinary2AndReplace: function (oBinaryReader) {
        this.theme = oBinaryReader.GetUChar();
        var bTint = oBinaryReader.GetBool();
        if (bTint) {
            this.tint = oBinaryReader.GetDoubleLE();
        }
        return g_oColorManager.getThemeColor(this.theme, this.tint);
    },
    getRgb: function () {
        return this.rgb;
    },
    getR: function () {
        return (this.rgb >> 16) & 255;
    },
    getG: function () {
        return (this.rgb >> 8) & 255;
    },
    getB: function () {
        return this.rgb & 255;
    },
    getA: function () {
        return 1;
    },
    rebuild: function (theme) {
        var nRes = 0;
        var r = 0;
        var g = 0;
        var b = 0;
        if (null != this.theme && null != theme) {
            var oUniColor = theme.themeElements.clrScheme.colors[map_themeExcel_to_themePresentation[this.theme]];
            if (null != oUniColor) {
                var rgba = oUniColor.color.RGBA;
                if (null != rgba) {
                    r = rgba.R;
                    g = rgba.G;
                    b = rgba.B;
                }
            }
            if (null != this.tint && 0 != this.tint) {
                var oCColorModifiers = new CColorModifiers();
                var HSL = {
                    H: 0,
                    S: 0,
                    L: 0
                };
                oCColorModifiers.RGB2HSL(r, g, b, HSL);
                if (this.tint < 0) {
                    HSL.L = HSL.L * (1 + this.tint);
                } else {
                    HSL.L = HSL.L * (1 - this.tint) + (g_nHSLMaxValue - g_nHSLMaxValue * (1 - this.tint));
                }
                HSL.L >>= 0;
                var RGB = {
                    R: 0,
                    G: 0,
                    B: 0
                };
                oCColorModifiers.HSL2RGB(HSL, RGB);
                r = RGB.R;
                g = RGB.G;
                b = RGB.B;
            }
            nRes |= b;
            nRes |= g << 8;
            nRes |= r << 16;
        }
        this.rgb = nRes;
    }
};
function CorrectAscColor(asc_color) {
    if (null == asc_color) {
        return null;
    }
    var ret = null;
    var _type = asc_color.get_type();
    switch (_type) {
    case c_oAscColor.COLOR_TYPE_SCHEME:
        var _index = asc_color.get_value() >> 0;
        var _id = (_index / 6) >> 0;
        var _pos = _index - _id * 6;
        var basecolor = g_oColorManager.getThemeColor(_id);
        var aTints = g_oThemeColorsDefaultModsSpreadsheet[GetDefaultColorModsIndex(basecolor.getR(), basecolor.getG(), basecolor.getB())];
        var tint = aTints[_pos];
        ret = g_oColorManager.getThemeColor(_id, tint);
        break;
    default:
        ret = new RgbColor((asc_color.get_r() << 16) + (asc_color.get_g() << 8) + asc_color.get_b());
    }
    return ret;
}
function ColorManager() {
    this.theme = null;
    this.aColors = new Array(12);
}
ColorManager.prototype = {
    isEqual: function (color1, color2) {
        var bRes = false;
        if (null == color1 && null == color2) {
            bRes = true;
        } else {
            if (null != color1 && null != color2) {
                if ((color1 instanceof ThemeColor && color2 instanceof ThemeColor) || (color1 instanceof RgbColor && color2 instanceof RgbColor)) {
                    bRes = color1.getRgb() == color2.getRgb();
                }
            }
        }
        return bRes;
    },
    setTheme: function (theme) {
        this.theme = theme;
        this.rebuildColors();
    },
    getThemeColor: function (theme, tint) {
        if (null == tint) {
            tint = null;
        }
        var oColorObj = this.aColors[theme];
        if (null == oColorObj) {
            oColorObj = {};
            this.aColors[theme] = oColorObj;
        }
        var oThemeColor = oColorObj[tint];
        if (null == oThemeColor) {
            oThemeColor = new ThemeColor();
            oThemeColor.theme = theme;
            oThemeColor.tint = tint;
            if (null != this.theme) {
                oThemeColor.rebuild(this.theme);
            }
            oColorObj[tint] = oThemeColor;
        }
        return oThemeColor;
    },
    rebuildColors: function () {
        if (null != this.theme) {
            for (var i = 0, length = this.aColors.length; i < length; ++i) {
                var oColorObj = this.aColors[i];
                for (var j in oColorObj) {
                    var oThemeColor = oColorObj[j];
                    oThemeColor.rebuild(this.theme);
                }
            }
        }
    }
};
g_oColorManager = new ColorManager();
function Fragment(val) {
    this.text = null;
    this.format = null;
    this.sFormula = null;
    this.sId = null;
    if (null != val) {
        this.set(val);
    }
}
Fragment.prototype = {
    clone: function () {
        return new Fragment(this);
    },
    set: function (oVal) {
        if (null != oVal.text) {
            this.text = oVal.text;
        }
        if (null != oVal.format) {
            this.format = oVal.format;
        }
        if (null != oVal.sFormula) {
            this.sFormula = oVal.sFormula;
        }
        if (null != oVal.sId) {
            this.sId = oVal.sId;
        }
    }
};
var g_oFontProperties = {
    fn: 0,
    scheme: 1,
    fs: 2,
    b: 3,
    i: 4,
    u: 5,
    s: 6,
    c: 7,
    va: 8
};
function Font(val) {
    if (null == val) {
        val = g_oDefaultFontAbs;
    }
    this.Properties = g_oFontProperties;
    this.fn = val.fn;
    this.scheme = val.scheme;
    this.fs = val.fs;
    this.b = val.b;
    this.i = val.i;
    this.u = val.u;
    this.s = val.s;
    this.c = val.c;
    this.va = val.va;
    this.skip = val.skip;
    this.repeat = val.repeat;
}
Font.prototype = {
    clean: function () {
        this.fn = null;
        this.scheme = null;
        this.fs = null;
        this.b = null;
        this.i = null;
        this.u = null;
        this.s = null;
        this.c = null;
        this.va = null;
        this.skip = null;
        this.repeat = null;
    },
    _mergeProperty: function (first, second, def) {
        if (def != first) {
            return first;
        } else {
            return second;
        }
    },
    merge: function (font) {
        var oRes = new Font();
        oRes.fn = this._mergeProperty(this.fn, font.fn, g_oDefaultFontAbs.fn);
        oRes.scheme = this._mergeProperty(this.scheme, font.scheme, g_oDefaultFontAbs.scheme);
        oRes.fs = this._mergeProperty(this.fs, font.fs, g_oDefaultFontAbs.fs);
        oRes.b = this._mergeProperty(this.b, font.b, g_oDefaultFontAbs.b);
        oRes.i = this._mergeProperty(this.i, font.i, g_oDefaultFontAbs.i);
        oRes.u = this._mergeProperty(this.u, font.u, g_oDefaultFontAbs.u);
        oRes.s = this._mergeProperty(this.s, font.s, g_oDefaultFontAbs.s);
        if (this.c instanceof ThemeColor && g_nColorTextDefault == this.c.theme && null == this.c.tint) {
            oRes.c = this._mergeProperty(font.c, this.c, g_oDefaultFontAbs.c);
        } else {
            oRes.c = this._mergeProperty(this.c, font.c, g_oDefaultFontAbs.c);
        }
        oRes.va = this._mergeProperty(this.va, font.va, g_oDefaultFontAbs.va);
        oRes.skip = this._mergeProperty(this.skip, font.skip, g_oDefaultFontAbs.skip);
        oRes.repeat = this._mergeProperty(this.repeat, font.repeat, g_oDefaultFontAbs.repeat);
        return oRes;
    },
    getRgbOrNull: function () {
        var nRes = null;
        if (null != this.c) {
            nRes = this.c.getRgb();
        }
        return nRes;
    },
    getDif: function (val) {
        var oRes = new Font(this);
        var bEmpty = true;
        if (this.fn == val.fn) {
            oRes.fn = null;
        } else {
            bEmpty = false;
        }
        if (this.scheme == val.scheme) {
            oRes.scheme = null;
        } else {
            bEmpty = false;
        }
        if (this.fs == val.fs) {
            oRes.fs = null;
        } else {
            bEmpty = false;
        }
        if (this.b == val.b) {
            oRes.b = null;
        } else {
            bEmpty = false;
        }
        if (this.i == val.i) {
            oRes.i = null;
        } else {
            bEmpty = false;
        }
        if (this.u == val.u) {
            oRes.u = null;
        } else {
            bEmpty = false;
        }
        if (this.s == val.s) {
            oRes.s = null;
        } else {
            bEmpty = false;
        }
        if (g_oColorManager.isEqual(this.c, val.c)) {
            oRes.c = null;
        } else {
            bEmpty = false;
        }
        if (this.va == val.va) {
            oRes.va = null;
        } else {
            bEmpty = false;
        }
        if (this.skip == val.skip) {
            oRes.skip = null;
        } else {
            bEmpty = false;
        }
        if (this.repeat == val.repeat) {
            oRes.repeat = null;
        } else {
            bEmpty = false;
        }
        if (bEmpty) {
            oRes = null;
        }
        return oRes;
    },
    isEqual: function (font) {
        var bRes = this.fs == font.fs && this.b == font.b && this.i == font.i && this.u == font.u && this.s == font.s && g_oColorManager.isEqual(this.c, font.c) && this.va == font.va && this.skip == font.skip && this.repeat == font.repeat;
        if (bRes) {
            if (Asc.EFontScheme.fontschemeNone == this.scheme && Asc.EFontScheme.fontschemeNone == font.scheme) {
                bRes = this.fn == font.fn;
            } else {
                if (Asc.EFontScheme.fontschemeNone != this.scheme && Asc.EFontScheme.fontschemeNone != font.scheme) {
                    bRes = this.scheme == font.scheme;
                } else {
                    bRes = false;
                }
            }
        }
        return bRes;
    },
    clone: function () {
        return new Font(this);
    },
    set: function (oVal) {
        if (null != oVal.fn) {
            this.fn = oVal.fn;
            this.scheme = Asc.EFontScheme.fontschemeNone;
        }
        if (null != oVal.scheme) {
            this.scheme = oVal.scheme;
        }
        if (null != oVal.fs) {
            this.fs = oVal.fs;
        }
        if (null != oVal.b) {
            this.b = oVal.b;
        }
        if (null != oVal.i) {
            this.i = oVal.i;
        }
        if (null != oVal.u) {
            this.u = oVal.u;
        }
        if (null != oVal.s) {
            this.s = oVal.s;
        }
        if (null != oVal.c) {
            this.c = oVal.c;
        }
        if (null != oVal.va) {
            this.va = oVal.va;
        }
        if (null != oVal.skip) {
            this.skip = oVal.skip;
        }
        if (null != oVal.repeat) {
            this.repeat = oVal.repeat;
        }
    },
    intersect: function (oFont, oDefVal) {
        if (this.fn != oFont.fn) {
            this.fn = oDefVal.fn;
        }
        if (this.scheme != oFont.scheme) {
            this.scheme = oDefVal.scheme;
        }
        if (this.fs != oFont.fs) {
            this.fs = oDefVal.fs;
        }
        if (this.b != oFont.b) {
            this.b = oDefVal.b;
        }
        if (this.i != oFont.i) {
            this.i = oDefVal.i;
        }
        if (this.u != oFont.u) {
            this.u = oDefVal.u;
        }
        if (this.s != oFont.s) {
            this.s = oDefVal.s;
        }
        if (false == g_oColorManager.isEqual(this.c, oFont.c)) {
            this.c = oDefVal.c;
        }
        if (this.va != oFont.va) {
            this.va = oDefVal.va;
        }
        if (this.skip != oFont.skip) {
            this.skip = oDefVal.skip;
        }
        if (this.repeat != oFont.repeat) {
            this.repeat = oDefVal.repeat;
        }
    },
    getType: function () {
        return UndoRedoDataTypes.StyleFont;
    },
    getProperties: function () {
        return this.Properties;
    },
    getProperty: function (nType) {
        switch (nType) {
        case this.Properties.fn:
            return this.fn;
            break;
        case this.Properties.scheme:
            return this.scheme;
            break;
        case this.Properties.fs:
            return this.fs;
            break;
        case this.Properties.b:
            return this.b;
            break;
        case this.Properties.i:
            return this.i;
            break;
        case this.Properties.u:
            return this.u;
            break;
        case this.Properties.s:
            return this.s;
            break;
        case this.Properties.c:
            return this.c;
            break;
        case this.Properties.va:
            return this.va;
            break;
        }
    },
    setProperty: function (nType, value) {
        switch (nType) {
        case this.Properties.fn:
            this.fn = value;
            break;
        case this.Properties.scheme:
            this.scheme = value;
            break;
        case this.Properties.fs:
            this.fs = value;
            break;
        case this.Properties.b:
            this.b = value;
            break;
        case this.Properties.i:
            this.i = value;
            break;
        case this.Properties.u:
            this.u = value;
            break;
        case this.Properties.s:
            this.s = value;
            break;
        case this.Properties.c:
            this.c = value;
            break;
        case this.Properties.va:
            this.va = value;
            break;
        }
    }
};
var g_oFillProperties = {
    bg: 0
};
function Fill(val) {
    if (null == val) {
        val = g_oDefaultFillAbs;
    }
    this.Properties = g_oFillProperties;
    this.bg = val.bg;
}
Fill.prototype = {
    _mergeProperty: function (first, second, def) {
        if (def != first) {
            return first;
        } else {
            return second;
        }
    },
    merge: function (fill) {
        var oRes = new Fill();
        oRes.bg = this._mergeProperty(this.bg, fill.bg, g_oDefaultFill.bg);
        return oRes;
    },
    getRgbOrNull: function () {
        var nRes = null;
        if (null != this.bg) {
            nRes = this.bg.getRgb();
        }
        return nRes;
    },
    getDif: function (val) {
        var oRes = new Fill(this);
        var bEmpty = true;
        if (g_oColorManager.isEqual(this.bg, val.bg)) {
            oRes.bg = null;
        } else {
            bEmpty = false;
        }
        if (bEmpty) {
            oRes = null;
        }
        return oRes;
    },
    isEqual: function (fill) {
        return g_oColorManager.isEqual(this.bg, fill.bg);
    },
    clone: function () {
        return new Fill(this);
    },
    getType: function () {
        return UndoRedoDataTypes.StyleFill;
    },
    getProperties: function () {
        return this.Properties;
    },
    getProperty: function (nType) {
        switch (nType) {
        case this.Properties.bg:
            return this.bg;
            break;
        }
    },
    setProperty: function (nType, value) {
        switch (nType) {
        case this.Properties.bg:
            this.bg = value;
            break;
        }
    }
};
var g_oBorderPropProperties = {
    s: 0,
    c: 1
};
function BorderProp() {
    this.Properties = g_oBorderPropProperties;
    this.s = c_oAscBorderStyles.None;
    this.w = c_oAscBorderWidth.None;
    this.c = g_oColorManager.getThemeColor(1);
}
BorderProp.prototype = {
    setStyle: function (style) {
        this.s = style;
        switch (this.s) {
        case c_oAscBorderStyles.Thin:
            case c_oAscBorderStyles.DashDot:
            case c_oAscBorderStyles.DashDotDot:
            case c_oAscBorderStyles.Dashed:
            case c_oAscBorderStyles.Dotted:
            case c_oAscBorderStyles.Hair:
            this.w = c_oAscBorderWidth.Thin;
            break;
        case c_oAscBorderStyles.Medium:
            case c_oAscBorderStyles.MediumDashDot:
            case c_oAscBorderStyles.MediumDashDotDot:
            case c_oAscBorderStyles.MediumDashed:
            case c_oAscBorderStyles.SlantDashDot:
            this.w = c_oAscBorderWidth.Medium;
            break;
        case c_oAscBorderStyles.Thick:
            case c_oAscBorderStyles.Double:
            this.w = c_oAscBorderWidth.Thick;
            break;
        default:
            this.w = c_oAscBorderWidth.None;
            break;
        }
    },
    getRgbOrNull: function () {
        var nRes = null;
        if (null != this.c) {
            nRes = this.c.getRgb();
        }
        return nRes;
    },
    isEmpty: function () {
        return c_oAscBorderStyles.None === this.s;
    },
    isEqual: function (val) {
        return this.s === val.s && g_oColorManager.isEqual(this.c, val.c);
    },
    clone: function () {
        var res = new BorderProp();
        res.merge(this);
        return res;
    },
    merge: function (oBorderProp) {
        if (null != oBorderProp.s && c_oAscBorderStyles.None !== oBorderProp.s) {
            this.s = oBorderProp.s;
            this.w = oBorderProp.w;
            if (null != oBorderProp.c) {
                this.c = oBorderProp.c;
            }
        }
    },
    getType: function () {
        return UndoRedoDataTypes.StyleBorderProp;
    },
    getProperties: function () {
        return this.Properties;
    },
    getProperty: function (nType) {
        switch (nType) {
        case this.Properties.s:
            return this.s;
            break;
        case this.Properties.c:
            return this.c;
            break;
        }
    },
    setProperty: function (nType, value) {
        switch (nType) {
        case this.Properties.s:
            this.setStyle(value);
            break;
        case this.Properties.c:
            this.c = value;
            break;
        }
    }
};
var g_oBorderProperties = {
    l: 0,
    t: 1,
    r: 2,
    b: 3,
    d: 4,
    ih: 5,
    iv: 6,
    dd: 7,
    du: 8
};
function Border(val) {
    if (null == val) {
        val = g_oDefaultBorderAbs;
    }
    this.Properties = g_oBorderProperties;
    this.l = val.l.clone();
    this.t = val.t.clone();
    this.r = val.r.clone();
    this.b = val.b.clone();
    this.d = val.d.clone();
    this.ih = val.ih.clone();
    this.iv = val.iv.clone();
    this.dd = val.dd;
    this.du = val.du;
}
Border.prototype = {
    _mergeProperty: function (first, second, def) {
        if ((null != def.isEqual && false == def.isEqual(first)) || (null == def.isEqual && def != first)) {
            return first;
        } else {
            return second;
        }
    },
    merge: function (border) {
        var oRes = new Border();
        oRes.l = this._mergeProperty(this.l, border.l, g_oDefaultBorder.l).clone();
        oRes.t = this._mergeProperty(this.t, border.t, g_oDefaultBorder.t).clone();
        oRes.r = this._mergeProperty(this.r, border.r, g_oDefaultBorder.r).clone();
        oRes.b = this._mergeProperty(this.b, border.b, g_oDefaultBorder.b).clone();
        oRes.d = this._mergeProperty(this.d, border.d, g_oDefaultBorder.d).clone();
        oRes.ih = this._mergeProperty(this.ih, border.ih, g_oDefaultBorder.ih).clone();
        oRes.iv = this._mergeProperty(this.iv, border.iv, g_oDefaultBorder.iv).clone();
        oRes.dd = this._mergeProperty(this.dd, border.dd, g_oDefaultBorder.dd);
        oRes.du = this._mergeProperty(this.du, border.du, g_oDefaultBorder.du);
        return oRes;
    },
    getDif: function (val) {
        var oRes = new Border(this);
        var bEmpty = true;
        if (true == this.l.isEqual(val.l)) {
            oRes.l = null;
        } else {
            bEmpty = false;
        }
        if (true == this.t.isEqual(val.t)) {
            oRes.t = null;
        } else {
            bEmpty = false;
        }
        if (true == this.r.isEqual(val.r)) {
            oRes.r = null;
        } else {
            bEmpty = false;
        }
        if (true == this.b.isEqual(val.b)) {
            oRes.b = null;
        } else {
            bEmpty = false;
        }
        if (true == this.d.isEqual(val.d)) {
            oRes.d = null;
        }
        if (true == this.ih.isEqual(val.ih)) {
            oRes.ih = null;
        } else {
            bEmpty = false;
        }
        if (true == this.iv.isEqual(val.iv)) {
            oRes.iv = null;
        } else {
            bEmpty = false;
        }
        if (this.dd == val.dd) {
            oRes.dd = null;
        } else {
            bEmpty = false;
        }
        if (this.du == val.du) {
            oRes.du = null;
        } else {
            bEmpty = false;
        }
        if (bEmpty) {
            oRes = null;
        }
        return oRes;
    },
    isEqual: function (val) {
        return this.l.isEqual(val.l) && this.t.isEqual(val.t) && this.r.isEqual(val.r) && this.b.isEqual(val.b) && this.d.isEqual(val.d) && this.ih.isEqual(val.ih) && this.iv.isEqual(val.iv) && this.dd == val.dd && this.du == val.du;
    },
    clone: function () {
        return new Border(this);
    },
    clean: function () {
        this.l = g_oDefaultBorder.l.clone();
        this.t = g_oDefaultBorder.t.clone();
        this.r = g_oDefaultBorder.r.clone();
        this.b = g_oDefaultBorder.b.clone();
        this.d = g_oDefaultBorder.d.clone();
        this.ih = g_oDefaultBorder.ih.clone();
        this.iv = g_oDefaultBorder.iv.clone();
        this.dd = g_oDefaultBorder.dd;
        this.du = g_oDefaultBorder.du;
    },
    mergeInner: function (border) {
        if (border) {
            if (border.l) {
                this.l.merge(border.l);
            }
            if (border.t) {
                this.t.merge(border.t);
            }
            if (border.r) {
                this.r.merge(border.r);
            }
            if (border.b) {
                this.b.merge(border.b);
            }
            if (border.d) {
                this.d.merge(border.d);
            }
            if (border.ih) {
                this.ih.merge(border.ih);
            }
            if (border.iv) {
                this.iv.merge(border.iv);
            }
            if (null != border.dd) {
                this.dd = this.dd || border.dd;
            }
            if (null != border.du) {
                this.du = this.du || border.du;
            }
        }
    },
    getType: function () {
        return UndoRedoDataTypes.StyleBorder;
    },
    getProperties: function () {
        return this.Properties;
    },
    getProperty: function (nType) {
        switch (nType) {
        case this.Properties.l:
            return this.l;
            break;
        case this.Properties.t:
            return this.t;
            break;
        case this.Properties.r:
            return this.r;
            break;
        case this.Properties.b:
            return this.b;
            break;
        case this.Properties.d:
            return this.d;
            break;
        case this.Properties.ih:
            return this.ih;
            break;
        case this.Properties.iv:
            return this.iv;
            break;
        case this.Properties.dd:
            return this.dd;
            break;
        case this.Properties.du:
            return this.du;
            break;
        }
    },
    setProperty: function (nType, value) {
        switch (nType) {
        case this.Properties.l:
            this.l = value;
            break;
        case this.Properties.t:
            this.t = value;
            break;
        case this.Properties.r:
            this.r = value;
            break;
        case this.Properties.b:
            this.b = value;
            break;
        case this.Properties.d:
            this.d = value;
            break;
        case this.Properties.ih:
            this.ih = value;
            break;
        case this.Properties.iv:
            this.iv = value;
            break;
        case this.Properties.dd:
            this.dd = value;
            break;
        case this.Properties.du:
            this.du = value;
            break;
        }
    }
};
var g_oNumProperties = {
    f: 0
};
function Num(val) {
    if (null == val) {
        val = g_oDefaultNumAbs;
    }
    this.Properties = g_oNumProperties;
    this.f = val.f;
}
Num.prototype = {
    merge: function (num) {
        var oRes = new Num();
        if (g_oDefaultNum.f != this.f) {
            oRes.f = this.f;
        } else {
            oRes.f = num.f;
        }
        return oRes;
    },
    getDif: function (val) {
        var oRes = new Num(this);
        var bEmpty = true;
        if (this.f == val.f) {
            oRes.f = null;
        } else {
            bEmpty = false;
        }
        if (bEmpty) {
            oRes = null;
        }
        return oRes;
    },
    isEqual: function (val) {
        return this.f == val.f;
    },
    clone: function () {
        return new Num(this);
    },
    getType: function () {
        return UndoRedoDataTypes.StyleNum;
    },
    getProperties: function () {
        return this.Properties;
    },
    getProperty: function (nType) {
        switch (nType) {
        case this.Properties.f:
            return this.f;
            break;
        }
    },
    setProperty: function (nType, value) {
        switch (nType) {
        case this.Properties.f:
            this.f = value;
            break;
        }
    }
};
var g_oCellXfsProperties = {
    border: 0,
    fill: 1,
    font: 2,
    num: 3,
    align: 4,
    QuotePrefix: 5,
    XfId: 6
};
function CellXfs() {
    this.Properties = g_oCellXfsProperties;
    this.border = null;
    this.fill = null;
    this.font = null;
    this.num = null;
    this.align = null;
    this.QuotePrefix = null;
    this.XfId = null;
    this.isReference = false;
}
CellXfs.prototype = {
    _mergeProperty: function (first, second) {
        var res = null;
        if (null != first || null != second) {
            if (null == first) {
                res = second;
            } else {
                if (null == second) {
                    res = first;
                } else {
                    if (null != first.merge) {
                        res = first.merge(second);
                    } else {
                        res = first;
                    }
                }
            }
        }
        return res;
    },
    merge: function (xfs) {
        var oRes = new CellXfs();
        oRes.border = this._mergeProperty(this.border, xfs.border);
        oRes.fill = this._mergeProperty(this.fill, xfs.fill);
        oRes.font = this._mergeProperty(this.font, xfs.font);
        oRes.num = this._mergeProperty(this.num, xfs.num);
        oRes.align = this._mergeProperty(this.align, xfs.align);
        oRes.QuotePrefix = this._mergeProperty(this.QuotePrefix, xfs.QuotePrefix);
        oRes.XfId = this._mergeProperty(this.XfId, xfs.XfId);
        return oRes;
    },
    clone: function () {
        var res = new CellXfs();
        if (null != this.border) {
            res.border = this.border.clone();
        }
        if (null != this.fill) {
            res.fill = this.fill.clone();
        }
        if (null != this.font) {
            res.font = this.font.clone();
        }
        if (null != this.num) {
            res.num = this.num.clone();
        }
        if (null != this.align) {
            res.align = this.align.clone();
        }
        if (null != this.QuotePrefix) {
            res.QuotePrefix = this.QuotePrefix;
        }
        if (null !== this.XfId) {
            res.XfId = this.XfId;
        }
        return res;
    },
    isEqual: function (xfs) {
        if (false == ((null == this.border && null == xfs.border) || (null != this.border && null != xfs.border && this.border.isEqual(xfs.border)))) {
            return false;
        }
        if (false == ((null == this.fill && null == xfs.fill) || (null != this.fill && null != xfs.fill && this.fill.isEqual(xfs.fill)))) {
            return false;
        }
        if (false == ((null == this.font && null == xfs.font) || (null != this.font && null != xfs.font && this.font.isEqual(xfs.font)))) {
            return false;
        }
        if (false == ((null == this.num && null == xfs.num) || (null != this.num && null != xfs.num && this.num.isEqual(xfs.num)))) {
            return false;
        }
        if (false == ((null == this.align && null == xfs.align) || (null != this.align && null != xfs.align && this.align.isEqual(xfs.align)))) {
            return false;
        }
        if (this.QuotePrefix != xfs.QuotePrefix) {
            return false;
        }
        if (this.XfId != xfs.XfId) {
            return false;
        }
        return true;
    },
    getType: function () {
        return UndoRedoDataTypes.StyleXfs;
    },
    getProperties: function () {
        return this.Properties;
    },
    getProperty: function (nType) {
        switch (nType) {
        case this.Properties.border:
            return this.border;
            break;
        case this.Properties.fill:
            return this.fill;
            break;
        case this.Properties.font:
            return this.font;
            break;
        case this.Properties.num:
            return this.num;
            break;
        case this.Properties.align:
            return this.align;
            break;
        case this.Properties.QuotePrefix:
            return this.QuotePrefix;
            break;
        case this.Properties.XfId:
            return this.XfId;
            break;
        }
    },
    setProperty: function (nType, value) {
        switch (nType) {
        case this.Properties.border:
            this.border = value;
            break;
        case this.Properties.fill:
            this.fill = value;
            break;
        case this.Properties.font:
            this.font = value;
            break;
        case this.Properties.num:
            this.num = value;
            break;
        case this.Properties.align:
            this.align = value;
            break;
        case this.Properties.QuotePrefix:
            this.QuotePrefix = value;
            break;
        case this.Properties.XfId:
            this.XfId = value;
            break;
        }
    }
};
var g_oAlignProperties = {
    hor: 0,
    indent: 1,
    RelativeIndent: 2,
    shrink: 3,
    angle: 4,
    ver: 5,
    wrap: 6
};
function Align(val) {
    if (null == val) {
        val = g_oDefaultAlignAbs;
    }
    this.Properties = g_oAlignProperties;
    this.hor = val.hor;
    this.indent = val.indent;
    this.RelativeIndent = val.RelativeIndent;
    this.shrink = val.shrink;
    this.angle = val.angle;
    this.ver = val.ver;
    this.wrap = val.wrap;
}
Align.prototype = {
    _mergeProperty: function (first, second, def) {
        if (false == def.isEqual(first)) {
            return first;
        } else {
            return second;
        }
    },
    merge: function (border) {
        var oRes = new Align();
        oRes.hor = this._mergeProperty(this.hor, border.hor, g_oDefaultAlign.hor);
        oRes.indent = this._mergeProperty(this.indent, border.indent, g_oDefaultAlign.indent);
        oRes.RelativeIndent = this._mergeProperty(this.RelativeIndent, border.RelativeIndent, g_oDefaultAlign.RelativeIndent);
        oRes.shrink = this._mergeProperty(this.shrink, border.shrink, g_oDefaultAlign.shrink);
        oRes.angle = this._mergeProperty(this.angle, border.angle, g_oDefaultAlign.angle);
        oRes.ver = this._mergeProperty(this.ver, border.ver, g_oDefaultAlign.ver);
        oRes.wrap = this._mergeProperty(this.wrap, border.wrap, g_oDefaultAlign.wrap);
        return oRes;
    },
    getDif: function (val) {
        var oRes = new Align(this);
        var bEmpty = true;
        if (this.hor == val.hor) {
            oRes.hor = null;
        } else {
            bEmpty = false;
        }
        if (this.indent == val.indent) {
            oRes.indent = null;
        } else {
            bEmpty = false;
        }
        if (this.RelativeIndent == val.RelativeIndent) {
            oRes.RelativeIndent = null;
        } else {
            bEmpty = false;
        }
        if (this.shrink == val.shrink) {
            oRes.shrink = null;
        } else {
            bEmpty = false;
        }
        if (this.angle == val.angle) {
            oRes.angle = null;
        } else {
            bEmpty = false;
        }
        if (this.ver == val.ver) {
            oRes.ver = null;
        } else {
            bEmpty = false;
        }
        if (this.wrap == val.wrap) {
            oRes.wrap = null;
        } else {
            bEmpty = false;
        }
        if (bEmpty) {
            oRes = null;
        }
        return oRes;
    },
    isEqual: function (val) {
        return this.hor == val.hor && this.indent == val.indent && this.RelativeIndent == val.RelativeIndent && this.shrink == val.shrink && this.angle == val.angle && this.ver == val.ver && this.wrap == val.wrap;
    },
    clone: function () {
        return new Align(this);
    },
    getType: function () {
        return UndoRedoDataTypes.StyleAlign;
    },
    getProperties: function () {
        return this.Properties;
    },
    getProperty: function (nType) {
        switch (nType) {
        case this.Properties.hor:
            return this.hor;
            break;
        case this.Properties.indent:
            return this.indent;
            break;
        case this.Properties.RelativeIndent:
            return this.RelativeIndent;
            break;
        case this.Properties.shrink:
            return this.shrink;
            break;
        case this.Properties.angle:
            return this.angle;
            break;
        case this.Properties.ver:
            return this.ver;
            break;
        case this.Properties.wrap:
            return this.wrap;
            break;
        }
    },
    setProperty: function (nType, value) {
        switch (nType) {
        case this.Properties.hor:
            this.hor = value;
            break;
        case this.Properties.indent:
            this.indent = value;
            break;
        case this.Properties.RelativeIndent:
            this.RelativeIndent = value;
            break;
        case this.Properties.shrink:
            this.shrink = value;
            break;
        case this.Properties.angle:
            this.angle = value;
            break;
        case this.Properties.ver:
            this.ver = value;
            break;
        case this.Properties.wrap:
            this.wrap = value;
            break;
        }
    }
};
function CCellStyles() {
    this.CustomStyles = [];
    this.DefaultStyles = [];
    this.AllStyles = {};
}
CCellStyles.prototype.generateFontMap = function (oFontMap) {
    this._generateFontMap(oFontMap, this.DefaultStyles);
    this._generateFontMap(oFontMap, this.CustomStyles);
};
CCellStyles.prototype._generateFontMap = function (oFontMap, aStyles) {
    var i, length, oStyle;
    for (i = 0, length = aStyles.length; i < length; ++i) {
        oStyle = aStyles[i];
        if (null != oStyle.xfs && null != oStyle.xfs.font && null != oStyle.xfs.font.fn) {
            oFontMap[oStyle.xfs.font.fn] = 1;
        }
    }
};
CCellStyles.prototype.getDefaultStylesCount = function () {
    var nCount = this.DefaultStyles.length;
    for (var i = 0, length = nCount; i < length; ++i) {
        if (this.DefaultStyles[i].Hidden) {
            --nCount;
        }
    }
    return nCount;
};
CCellStyles.prototype.getCustomStylesCount = function () {
    var nCount = this.CustomStyles.length;
    for (var i = 0, length = nCount; i < length; ++i) {
        if (this.CustomStyles[i].Hidden || null != this.CustomStyles[i].BuiltinId) {
            --nCount;
        }
    }
    return nCount;
};
CCellStyles.prototype.getStyleByXfId = function (oXfId) {
    for (var i = 0, length = this.CustomStyles.length; i < length; ++i) {
        if (oXfId === this.CustomStyles[i].XfId) {
            return this.CustomStyles[i];
        }
    }
    return null;
};
CCellStyles.prototype.getStyleNameByXfId = function (oXfId) {
    var styleName = null;
    if (null === oXfId) {
        return styleName;
    }
    var style = null;
    for (var i = 0, length = this.CustomStyles.length; i < length; ++i) {
        style = this.CustomStyles[i];
        if (oXfId === style.XfId) {
            if (null !== style.BuiltinId) {
                styleName = this.getDefaultStyleNameByBuiltinId(style.BuiltinId);
                if (null === styleName) {
                    styleName = style.Name;
                }
                break;
            } else {
                styleName = style.Name;
                break;
            }
        }
    }
    return styleName;
};
CCellStyles.prototype.getDefaultStyleNameByBuiltinId = function (oBuiltinId) {
    var style = null;
    for (var i = 0, length = this.DefaultStyles.length; i < length; ++i) {
        style = this.DefaultStyles[i];
        if (style.BuiltinId === oBuiltinId) {
            return style.Name;
        }
    }
    return null;
};
CCellStyles.prototype.getCustomStyleByBuiltinId = function (oBuiltinId) {
    var style = null;
    for (var i = 0, length = this.CustomStyles.length; i < length; ++i) {
        style = this.CustomStyles[i];
        if (style.BuiltinId === oBuiltinId) {
            return style;
        }
    }
    return null;
};
CCellStyles.prototype._prepareCellStyle = function (name) {
    var defaultStyle = null;
    var style = null;
    var i, length;
    var maxXfId = -1;
    for (i = 0, length = this.DefaultStyles.length; i < length; ++i) {
        if (name === this.DefaultStyles[i].Name) {
            defaultStyle = this.DefaultStyles[i];
            break;
        }
    }
    if (defaultStyle) {
        for (i = 0, length = this.CustomStyles.length; i < length; ++i) {
            if (defaultStyle.BuiltinId === this.CustomStyles[i].BuiltinId) {
                style = this.CustomStyles[i];
                break;
            }
            maxXfId = Math.max(maxXfId, this.CustomStyles[i].XfId);
        }
    } else {
        for (i = 0, length = this.CustomStyles.length; i < length; ++i) {
            if (name === this.CustomStyles[i].Name) {
                style = this.CustomStyles[i];
                break;
            }
            maxXfId = Math.max(maxXfId, this.CustomStyles[i].XfId);
        }
    }
    if (style) {
        return style.XfId;
    }
    if (defaultStyle) {
        this.CustomStyles[i] = defaultStyle.clone();
        this.CustomStyles[i].XfId = ++maxXfId;
        return this.CustomStyles[i].XfId;
    }
    return g_oDefaultXfId;
};
function CCellStyle() {
    this.BuiltinId = null;
    this.CustomBuiltin = null;
    this.Hidden = null;
    this.ILevel = null;
    this.Name = null;
    this.XfId = null;
    this.xfs = null;
    this.ApplyBorder = true;
    this.ApplyFill = true;
    this.ApplyFont = true;
    this.ApplyNumberFormat = true;
}
CCellStyle.prototype.clone = function () {
    var oNewStyle = new CCellStyle();
    oNewStyle.BuiltinId = this.BuiltinId;
    oNewStyle.CustomBuiltin = this.CustomBuiltin;
    oNewStyle.Hidden = this.Hidden;
    oNewStyle.ILevel = this.ILevel;
    oNewStyle.Name = this.Name;
    oNewStyle.ApplyBorder = this.ApplyBorder;
    oNewStyle.ApplyFill = this.ApplyFill;
    oNewStyle.ApplyFont = this.ApplyFont;
    oNewStyle.ApplyNumberFormat = this.ApplyNumberFormat;
    oNewStyle.xfs = this.xfs.clone();
    return oNewStyle;
};
CCellStyle.prototype.getFill = function () {
    if (null != this.xfs && null != this.xfs.fill) {
        return this.xfs.fill.bg;
    }
    return g_oDefaultFill.bg;
};
CCellStyle.prototype.getFontColor = function () {
    if (null != this.xfs && null != this.xfs.font) {
        return this.xfs.font.c;
    }
    return g_oDefaultFont.c;
};
CCellStyle.prototype.getFont = function () {
    if (null != this.xfs && null != this.xfs.font) {
        return this.xfs.font;
    }
    return g_oDefaultFont;
};
CCellStyle.prototype.getBorder = function () {
    if (null != this.xfs && null != this.xfs.border) {
        return this.xfs.border;
    }
    return g_oDefaultBorder;
};
CCellStyle.prototype.getNumFormatStr = function () {
    if (null != this.xfs && null != this.xfs.num) {
        return this.xfs.num.f;
    }
    return g_oDefaultNum.f;
};
function StyleManager() {
    this.oDefaultFont = null;
    this.oDefaultAlign = null;
    this.oDefaultQuotePrefix = null;
    this.oDefaultXfs = new CellXfs();
}
StyleManager.prototype = {
    init: function (oDefaultXfs) {
        if (null != oDefaultXfs.font) {
            g_oDefaultFont = oDefaultXfs.font.clone();
        }
        if (null != oDefaultXfs.fill) {
            g_oDefaultFill = oDefaultXfs.fill.clone();
        }
        if (null != oDefaultXfs.border) {
            g_oDefaultBorder = oDefaultXfs.border.clone();
        }
        if (null != oDefaultXfs.num) {
            g_oDefaultNum = oDefaultXfs.num.clone();
        }
        if (null != oDefaultXfs.align) {
            g_oDefaultAlign = oDefaultXfs.align.clone();
        }
        if (null !== oDefaultXfs.XfId) {
            this.oDefaultXfs.XfId = oDefaultXfs.XfId;
            g_oDefaultXfId = oDefaultXfs.XfId;
        }
        this.oDefaultXfs = oDefaultXfs;
    },
    _prepareSetReference: function (oItemWithXfs) {
        if (oItemWithXfs.xfs.isReference) {
            oItemWithXfs.xfs = oItemWithXfs.xfs.clone();
        }
        return oItemWithXfs.xfs;
    },
    _prepareSet: function (oItemWithXfs) {
        if (null == oItemWithXfs.xfs) {
            if (oItemWithXfs.getDefaultXfs) {
                oItemWithXfs.xfs = oItemWithXfs.getDefaultXfs();
            }
            if (null == oItemWithXfs.xfs) {
                oItemWithXfs.xfs = this.oDefaultXfs.clone();
            }
        } else {
            this._prepareSetReference(oItemWithXfs);
        }
        return oItemWithXfs.xfs;
    },
    _prepareSetFont: function (oItemWithXfs) {
        var xfs = this._prepareSet(oItemWithXfs);
        if (null == xfs.font) {
            xfs.font = g_oDefaultFont.clone();
        }
        return xfs;
    },
    _prepareSetAlign: function (oItemWithXfs) {
        var xfs = this._prepareSet(oItemWithXfs);
        if (null == xfs.align) {
            xfs.align = g_oDefaultAlign.clone();
        }
        return xfs;
    },
    _prepareSetCellStyle: function (oItemWithXfs) {
        return this._prepareSet(oItemWithXfs);
    },
    setCellStyle: function (oItemWithXfs, val) {
        var xfs = oItemWithXfs.xfs;
        var oRes = {
            newVal: val,
            oldVal: null
        };
        if (null != xfs && null != xfs.XfId) {
            oRes.oldVal = xfs.XfId;
        } else {
            oRes.oldVal = g_oDefaultXfId;
        }
        if (null == val) {
            if (null != xfs) {
                xfs = this._prepareSetReference(oItemWithXfs);
                xfs.XfId = g_oDefaultXfId;
            }
        } else {
            xfs = this._prepareSetCellStyle(oItemWithXfs);
            xfs.XfId = val;
        }
        return oRes;
    },
    setNumFormat: function (oItemWithXfs, val) {
        var xfs = oItemWithXfs.xfs;
        var oRes = {
            newVal: val,
            oldVal: null
        };
        if (null != xfs && null != xfs.num) {
            oRes.oldVal = xfs.num.f;
        } else {
            oRes.oldVal = g_oDefaultNum.f;
        }
        if (null == val) {
            if (null != xfs) {
                xfs = this._prepareSetReference(oItemWithXfs);
                xfs.num = null;
            }
        } else {
            xfs = this._prepareSet(oItemWithXfs);
            if (null == xfs.num) {
                xfs.num = g_oDefaultNum.clone();
            }
            xfs.num.f = val;
        }
        return oRes;
    },
    setFont: function (oItemWithXfs, val, oHistoryObj, nHistoryId, sSheetId, oRange) {
        var xfs = oItemWithXfs.xfs;
        var oRes = {
            newVal: val,
            oldVal: null
        };
        if (null != xfs && null != xfs.font) {
            oRes.oldVal = xfs.font;
        } else {
            oRes.oldVal = null;
        }
        if (null == val) {
            if (null != xfs) {
                xfs = this._prepareSetReference(oItemWithXfs);
                xfs.font = null;
            }
        } else {
            xfs = this._prepareSetFont(oItemWithXfs);
            xfs.font = val.clone();
        }
        return oRes;
    },
    setFontname: function (oItemWithXfs, val) {
        var xfs = oItemWithXfs.xfs;
        var oRes = {
            newVal: val,
            oldVal: null
        };
        if (null != xfs && null != xfs.font) {
            oRes.oldVal = xfs.font.fn;
        } else {
            oRes.oldVal = g_oDefaultFont.fn;
        }
        if (null == val) {
            if (null != xfs && null != xfs.font) {
                xfs = this._prepareSetReference(oItemWithXfs);
                xfs.font.fn = g_oDefaultFont.fn;
                xfs.font.scheme = Asc.EFontScheme.fontschemeNone;
            }
        } else {
            xfs = this._prepareSetFont(oItemWithXfs);
            xfs.font.fn = val;
            xfs.font.scheme = Asc.EFontScheme.fontschemeNone;
        }
        return oRes;
    },
    setFontsize: function (oItemWithXfs, val) {
        var xfs = oItemWithXfs.xfs;
        var oRes = {
            newVal: val,
            oldVal: null
        };
        if (null != xfs && null != xfs.font) {
            oRes.oldVal = xfs.font.fs;
        } else {
            oRes.oldVal = g_oDefaultFont.fs;
        }
        if (null == val) {
            if (null != xfs && null != xfs.font) {
                xfs = this._prepareSetReference(oItemWithXfs);
                xfs.font.fs = g_oDefaultFont.fs;
            }
        } else {
            xfs = this._prepareSetFont(oItemWithXfs);
            xfs.font.fs = val;
        }
        return oRes;
    },
    setFontcolor: function (oItemWithXfs, val) {
        var xfs = oItemWithXfs.xfs;
        var oRes = {
            newVal: val,
            oldVal: null
        };
        if (null != xfs && null != xfs.font) {
            oRes.oldVal = xfs.font.c;
        } else {
            oRes.oldVal = g_oDefaultFont.c;
        }
        if (null == val) {
            if (null != xfs && null != xfs.font) {
                xfs = this._prepareSetReference(oItemWithXfs);
                xfs.font.c = g_oDefaultFont.c;
            }
        } else {
            xfs = this._prepareSetFont(oItemWithXfs);
            xfs.font.c = val;
        }
        return oRes;
    },
    setBold: function (oItemWithXfs, val) {
        var xfs = oItemWithXfs.xfs;
        var oRes = {
            newVal: val,
            oldVal: null
        };
        if (null != xfs && null != xfs.font) {
            oRes.oldVal = xfs.font.b;
        } else {
            oRes.oldVal = g_oDefaultFont.b;
        }
        if (null == val) {
            if (null != xfs && null != xfs.font) {
                xfs = this._prepareSetReference(oItemWithXfs);
                xfs.font.b = g_oDefaultFont.b;
            }
        } else {
            xfs = this._prepareSetFont(oItemWithXfs);
            xfs.font.b = val;
        }
        return oRes;
    },
    setItalic: function (oItemWithXfs, val) {
        var xfs = oItemWithXfs.xfs;
        var oRes = {
            newVal: val,
            oldVal: null
        };
        if (null != xfs && null != xfs.font) {
            oRes.oldVal = xfs.font.i;
        } else {
            oRes.oldVal = g_oDefaultFont.i;
        }
        if (null == val) {
            if (null != xfs && null != xfs.font) {
                xfs = this._prepareSetReference(oItemWithXfs);
                xfs.font.i = g_oDefaultFont.i;
            }
        } else {
            xfs = this._prepareSetFont(oItemWithXfs);
            xfs.font.i = val;
        }
        return oRes;
    },
    setUnderline: function (oItemWithXfs, val) {
        var xfs = oItemWithXfs.xfs;
        var oRes = {
            newVal: val,
            oldVal: null
        };
        if (null != xfs && null != xfs.font) {
            oRes.oldVal = xfs.font.u;
        } else {
            oRes.oldVal = g_oDefaultFont.u;
        }
        if (null == val) {
            if (null != xfs && null != xfs.font) {
                xfs = this._prepareSetReference(oItemWithXfs);
                xfs.font.u = g_oDefaultFont.u;
            }
        } else {
            xfs = this._prepareSetFont(oItemWithXfs);
            xfs.font.u = val;
        }
        return oRes;
    },
    setStrikeout: function (oItemWithXfs, val) {
        var xfs = oItemWithXfs.xfs;
        var oRes = {
            newVal: val,
            oldVal: null
        };
        if (null != xfs && null != xfs.font) {
            oRes.oldVal = xfs.font.s;
        } else {
            oRes.oldVal = g_oDefaultFont.s;
        }
        if (null == val) {
            if (null != xfs && null != xfs.font) {
                xfs = this._prepareSetReference(oItemWithXfs);
                xfs.font.s = g_oDefaultFont.s;
            }
        } else {
            xfs = this._prepareSetFont(oItemWithXfs);
            xfs.font.s = val;
        }
        return oRes;
    },
    setFontAlign: function (oItemWithXfs, val) {
        var xfs = oItemWithXfs.xfs;
        var oRes = {
            newVal: val,
            oldVal: null
        };
        if (null != xfs && null != xfs.font) {
            oRes.oldVal = xfs.font.va;
        } else {
            oRes.oldVal = g_oDefaultFont.va;
        }
        if (null == val) {
            if (null != xfs && null != xfs.font) {
                xfs = this._prepareSetReference(oItemWithXfs);
                xfs.font.va = g_oDefaultFont.va;
            }
        } else {
            xfs = this._prepareSetFont(oItemWithXfs);
            xfs.font.va = val;
        }
        return oRes;
    },
    setAlignVertical: function (oItemWithXfs, val) {
        var xfs = oItemWithXfs.xfs;
        var oRes = {
            newVal: val,
            oldVal: null
        };
        if (null != xfs && null != xfs.align) {
            oRes.oldVal = xfs.align.ver;
        } else {
            oRes.oldVal = g_oDefaultAlign.ver;
        }
        if (null == val) {
            if (null != xfs && null != xfs.align) {
                xfs = this._prepareSetReference(oItemWithXfs);
                xfs.align.ver = g_oDefaultAlign.ver;
            }
        } else {
            xfs = this._prepareSetAlign(oItemWithXfs);
            xfs.align.ver = val;
        }
        return oRes;
    },
    setAlignHorizontal: function (oItemWithXfs, val) {
        var xfs = oItemWithXfs.xfs;
        var oRes = {
            newVal: val,
            oldVal: null
        };
        if (null != xfs && null != xfs.align) {
            oRes.oldVal = xfs.align.hor;
        } else {
            oRes.oldVal = g_oDefaultAlign.hor;
        }
        if (null == val) {
            if (null != xfs && null != xfs.align) {
                xfs = this._prepareSetReference(oItemWithXfs);
                xfs.align.hor = g_oDefaultAlign.hor;
            }
        } else {
            xfs = this._prepareSetAlign(oItemWithXfs);
            xfs.align.hor = val;
        }
        return oRes;
    },
    setFill: function (oItemWithXfs, val) {
        var xfs = oItemWithXfs.xfs;
        var oRes = {
            newVal: val,
            oldVal: null
        };
        if (null != xfs && null != xfs.fill) {
            oRes.oldVal = xfs.fill.bg;
        } else {
            oRes.oldVal = g_oDefaultFill.bg;
        }
        if (null == val) {
            if (null != xfs && null != xfs.fill) {
                xfs = this._prepareSetReference(oItemWithXfs);
                xfs.fill.bg = g_oDefaultFill.bg;
            }
        } else {
            xfs = this._prepareSet(oItemWithXfs);
            if (null == xfs.fill) {
                xfs.fill = g_oDefaultFill.clone();
            }
            xfs.fill.bg = val;
        }
        return oRes;
    },
    setBorder: function (oItemWithXfs, val) {
        var xfs = oItemWithXfs.xfs;
        var oRes = {
            newVal: val,
            oldVal: null
        };
        if (null != xfs && null != xfs.border) {
            oRes.oldVal = xfs.border;
        } else {
            oRes.oldVal = g_oDefaultBorder;
        }
        if (null == val) {
            if (null != xfs && null != xfs.border) {
                xfs = this._prepareSetReference(oItemWithXfs);
                xfs.border = val;
            }
        } else {
            xfs = this._prepareSet(oItemWithXfs);
            xfs.border = val;
        }
        return oRes;
    },
    setShrinkToFit: function (oItemWithXfs, val) {
        var xfs = oItemWithXfs.xfs;
        var oRes = {
            newVal: val,
            oldVal: null
        };
        if (null != xfs && null != xfs.align) {
            oRes.oldVal = xfs.align.shrink;
        } else {
            oRes.oldVal = g_oDefaultAlign.shrink;
        }
        if (null == val) {
            if (null != xfs && null != xfs.align) {
                xfs = this._prepareSetReference(oItemWithXfs);
                xfs.align.shrink = g_oDefaultAlign.shrink;
            }
        } else {
            xfs = this._prepareSetAlign(oItemWithXfs);
            xfs.align.shrink = val;
        }
        return oRes;
    },
    setWrap: function (oItemWithXfs, val) {
        var xfs = oItemWithXfs.xfs;
        var oRes = {
            newVal: val,
            oldVal: null
        };
        if (null != xfs && null != xfs.align) {
            oRes.oldVal = xfs.align.wrap;
        } else {
            oRes.oldVal = g_oDefaultAlign.wrap;
        }
        if (null == val) {
            if (null != xfs && null != xfs.align) {
                xfs = this._prepareSetReference(oItemWithXfs);
                xfs.align.wrap = g_oDefaultAlign.wrap;
            }
        } else {
            xfs = this._prepareSetAlign(oItemWithXfs);
            xfs.align.wrap = val;
        }
        return oRes;
    },
    setQuotePrefix: function (oItemWithXfs, val) {
        var xfs = oItemWithXfs.xfs;
        var oRes = {
            newVal: val,
            oldVal: null
        };
        if (null != xfs && null != xfs.QuotePrefix) {
            oRes.oldVal = xfs.QuotePrefix;
        }
        if (null == val) {
            if (null != xfs) {
                xfs = this._prepareSetReference(oItemWithXfs);
                xfs.QuotePrefix = val;
            }
        } else {
            xfs = this._prepareSet(oItemWithXfs);
            xfs.QuotePrefix = val;
        }
        return oRes;
    },
    setAngle: function (oItemWithXfs, val) {
        var xfs = oItemWithXfs.xfs;
        var oRes = {
            newVal: val,
            oldVal: null
        };
        val = angleInterfaceToFormat(val);
        if (null != xfs && null != xfs.align) {
            oRes.oldVal = angleFormatToInterface2(xfs.align.angle);
        } else {
            oRes.oldVal = angleFormatToInterface2(g_oDefaultAlign.angle);
        }
        if (null == val) {
            if (null != xfs && null != xfs.align) {
                xfs = this._prepareSetReference(oItemWithXfs);
                xfs.align.angle = g_oDefaultAlign.angle;
            }
        } else {
            xfs = this._prepareSetAlign(oItemWithXfs);
            xfs.align.angle = val;
        }
        return oRes;
    },
    setVerticalText: function (oItemWithXfs, val) {
        if (true == val) {
            return this.setAngle(oItemWithXfs, g_nVerticalTextAngle);
        } else {
            return this.setAngle(oItemWithXfs, 0);
        }
    }
};
var g_oHyperlinkProperties = {
    Ref: 0,
    Location: 1,
    Hyperlink: 2,
    Tooltip: 3
};
function Hyperlink() {
    this.Properties = g_oHyperlinkProperties;
    this.Ref = null;
    this.Hyperlink = null;
    this.Tooltip = null;
    this.Location = null;
    this.LocationSheet = null;
    this.LocationRange = null;
    this.bUpdateLocation = false;
    this.bVisited = false;
}
Hyperlink.prototype = {
    clone: function (oNewWs) {
        var oNewHyp = new Hyperlink();
        if (null !== this.Ref) {
            oNewHyp.Ref = this.Ref.clone(oNewWs);
        }
        if (null !== this.getLocation()) {
            oNewHyp.setLocation(this.getLocation());
        }
        if (null !== this.LocationSheet) {
            oNewHyp.LocationSheet = this.LocationSheet;
        }
        if (null !== this.LocationRange) {
            oNewHyp.LocationRange = this.LocationRange;
        }
        if (null !== this.Hyperlink) {
            oNewHyp.Hyperlink = this.Hyperlink;
        }
        if (null !== this.Tooltip) {
            oNewHyp.Tooltip = this.Tooltip;
        }
        if (null !== this.bVisited) {
            oNewHyp.bVisited = this.bVisited;
        }
        return oNewHyp;
    },
    isEqual: function (obj) {
        var bRes = (this.getLocation() == obj.getLocation() && this.Hyperlink == obj.Hyperlink && this.Tooltip == obj.Tooltip);
        if (bRes) {
            var oBBoxRef = this.Ref.getBBox0();
            var oBBoxObj = obj.Ref.getBBox0();
            bRes = (oBBoxRef.r1 == oBBoxObj.r1 && oBBoxRef.c1 == oBBoxObj.c1 && oBBoxRef.r2 == oBBoxObj.r2 && oBBoxRef.c2 == oBBoxObj.c2);
        }
        return bRes;
    },
    isValid: function () {
        return null != this.Ref && (null != this.getLocation() || null != this.Hyperlink);
    },
    setLocationSheet: function (LocationSheet) {
        this.LocationSheet = LocationSheet;
        this.bUpdateLocation = true;
    },
    setLocationRange: function (LocationRange) {
        this.LocationRange = LocationRange;
        this.bUpdateLocation = true;
    },
    setLocation: function (Location) {
        this.bUpdateLocation = false;
        this.Location = Location;
        this.LocationSheet = this.LocationRange = null;
        if (null != this.Location) {
            var result = parserHelp.parse3DRef(this.Location);
            if (null !== result) {
                this.LocationSheet = result.sheet;
                this.LocationRange = result.range;
            }
        }
    },
    getLocation: function () {
        if (this.bUpdateLocation) {
            this._updateLocation();
        }
        return this.Location;
    },
    _updateLocation: function () {
        this.bUpdateLocation = false;
        if (null === this.LocationSheet || null === this.LocationRange) {
            this.Location = null;
        } else {
            this.Location = parserHelp.get3DRef(this.LocationSheet, this.LocationRange);
        }
    },
    setVisited: function (bVisited) {
        this.bVisited = bVisited;
        if (this.Ref) {
            this.Ref.cleanCache();
        }
    },
    getVisited: function () {
        return this.bVisited;
    },
    getHyperlinkType: function () {
        return null !== this.Hyperlink ? c_oAscHyperlinkType.WebLink : c_oAscHyperlinkType.RangeLink;
    },
    getType: function () {
        return UndoRedoDataTypes.Hyperlink;
    },
    getProperties: function () {
        return this.Properties;
    },
    getProperty: function (nType) {
        switch (nType) {
        case this.Properties.Ref:
            return parserHelp.get3DRef(this.Ref.worksheet.getName(), this.Ref.getName());
            break;
        case this.Properties.Location:
            return this.getLocation();
            break;
        case this.Properties.Hyperlink:
            return this.Hyperlink;
            break;
        case this.Properties.Tooltip:
            return this.Tooltip;
            break;
        }
    },
    setProperty: function (nType, value) {
        switch (nType) {
        case this.Properties.Ref:
            var oRefParsed = parserHelp.parse3DRef(value);
            if (null !== oRefParsed) {
                var ws = window["Asc"]["editor"].wbModel.getWorksheetByName(oRefParsed.sheet);
                if (ws) {
                    this.Ref = ws.getRange2(oRefParsed.range);
                }
            }
            break;
        case this.Properties.Location:
            this.setLocation(value);
            break;
        case this.Properties.Hyperlink:
            this.Hyperlink = value;
            break;
        case this.Properties.Tooltip:
            this.Tooltip = value;
            break;
        }
    },
    applyCollaborative: function (nSheetId, collaborativeEditing) {
        var bbox = this.Ref.getBBox0();
        var OffsetFirst = {
            offsetCol: 0,
            offsetRow: 0
        };
        var OffsetLast = {
            offsetCol: 0,
            offsetRow: 0
        };
        OffsetFirst.offsetRow = collaborativeEditing.getLockMeRow2(nSheetId, bbox.r1) - bbox.r1;
        OffsetFirst.offsetCol = collaborativeEditing.getLockMeColumn2(nSheetId, bbox.c1) - bbox.c1;
        OffsetLast.offsetRow = collaborativeEditing.getLockMeRow2(nSheetId, bbox.r2) - bbox.r2;
        OffsetLast.offsetCol = collaborativeEditing.getLockMeColumn2(nSheetId, bbox.c2) - bbox.c2;
        this.Ref.setOffsetFirst(OffsetFirst);
        this.Ref.setOffsetLast(OffsetLast);
    }
};
function SheetFormatPr() {
    this.nBaseColWidth = null;
    this.dDefaultColWidth = null;
    this.oAllRow = null;
}
SheetFormatPr.prototype = {
    clone: function () {
        var oRes = new SheetFormatPr();
        oRes.nBaseColWidth = this.nBaseColWidth;
        oRes.dDefaultColWidth = this.dDefaultColWidth;
        if (null != this.oAllRow) {
            oRes.oAllRow = this.oAllRow.clone();
        }
        return oRes;
    }
};
function Col(worksheet, index) {
    this.ws = worksheet;
    this.index = index;
    this.BestFit = null;
    this.hd = null;
    this.CustomWidth = null;
    this.width = null;
    this.xfs = null;
}
Col.prototype = {
    moveHor: function (nDif) {
        this.index += nDif;
    },
    isEqual: function (obj) {
        var bRes = this.BestFit == obj.BestFit && this.hd == obj.hd && this.width == obj.width && this.CustomWidth == obj.CustomWidth;
        if (bRes) {
            if (null != this.xfs && null != obj.xfs) {
                bRes = this.xfs.isEqual(obj.xfs);
            } else {
                if (null != this.xfs || null != obj.xfs) {
                    bRes = false;
                }
            }
        }
        return bRes;
    },
    isEmpty: function () {
        return null == this.BestFit && null == this.hd && null == this.width && null == this.xfs && null == this.CustomWidth;
    },
    Remove: function () {
        this.ws._removeCol(this.index);
    },
    clone: function (oNewWs) {
        if (!oNewWs) {
            oNewWs = this.ws;
        }
        var oNewCol = new Col(oNewWs, this.index);
        if (null != this.BestFit) {
            oNewCol.BestFit = this.BestFit;
        }
        if (null != this.hd) {
            oNewCol.hd = this.hd;
        }
        if (null != this.width) {
            oNewCol.width = this.width;
        }
        if (null != this.CustomWidth) {
            oNewCol.CustomWidth = this.CustomWidth;
        }
        if (null != this.xfs) {
            oNewCol.xfs = this.xfs.clone();
        }
        return oNewCol;
    },
    getWidthProp: function () {
        return new UndoRedoData_ColProp(this);
    },
    setWidthProp: function (prop) {
        if (null != prop) {
            if (null != prop.width) {
                this.width = prop.width;
            } else {
                this.width = null;
            }
            if (null != prop.hd) {
                this.hd = prop.hd;
            } else {
                this.hd = null;
            }
            if (null != prop.CustomWidth) {
                this.CustomWidth = prop.CustomWidth;
            } else {
                this.CustomWidth = null;
            }
            if (null != prop.BestFit) {
                this.BestFit = prop.BestFit;
            } else {
                this.BestFit = null;
            }
        }
    },
    getStyle: function () {
        return this.xfs;
    },
    _getUpdateRange: function () {
        if (g_nAllColIndex == this.index) {
            return new Asc.Range(0, 0, gc_nMaxCol0, gc_nMaxRow0);
        } else {
            return new Asc.Range(this.index, 0, this.index, gc_nMaxRow0);
        }
    },
    setStyle: function (xfs) {
        var oldVal = this.xfs;
        var newVal = null;
        this.xfs = null;
        if (null != xfs) {
            this.xfs = xfs.clone();
            newVal = xfs;
        }
        if (History.Is_On() && false == ((null == oldVal && null == newVal) || (null != oldVal && null != newVal && true == oldVal.isEqual(newVal)))) {
            if (null != oldVal) {
                oldVal = oldVal.clone();
            }
            if (null != newVal) {
                newVal = newVal.clone();
            }
            History.Add(g_oUndoRedoCol, historyitem_RowCol_SetStyle, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, false, oldVal, newVal));
        }
    },
    setCellStyle: function (val) {
        var newVal = this.ws.workbook.CellStyles._prepareCellStyle(val);
        var oRes = this.ws.workbook.oStyleManager.setCellStyle(this, newVal);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            var oldStyleName = this.ws.workbook.CellStyles.getStyleNameByXfId(oRes.oldVal);
            History.Add(g_oUndoRedoCol, historyitem_RowCol_SetCellStyle, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, false, oldStyleName, val));
            var oStyle = this.ws.workbook.CellStyles.getStyleByXfId(oRes.newVal);
            if (oStyle.ApplyFont) {
                this.setFont(oStyle.getFont());
            }
            if (oStyle.ApplyFill) {
                this.setFill(oStyle.getFill());
            }
            if (oStyle.ApplyBorder) {
                this.setBorder(oStyle.getBorder());
            }
            if (oStyle.ApplyNumberFormat) {
                this.setNumFormat(oStyle.getNumFormatStr());
            }
        }
    },
    setNumFormat: function (val) {
        var oRes = this.ws.workbook.oStyleManager.setNumFormat(this, val);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            History.Add(g_oUndoRedoCol, historyitem_RowCol_NumFormat, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, false, oRes.oldVal, oRes.newVal));
        }
    },
    setFont: function (val) {
        var oRes = this.ws.workbook.oStyleManager.setFont(this, val);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            var oldVal = null;
            if (null != oRes.oldVal) {
                oldVal = oRes.oldVal.clone();
            }
            var newVal = null;
            if (null != oRes.newVal) {
                newVal = oRes.newVal.clone();
            }
            History.Add(g_oUndoRedoCol, historyitem_RowCol_SetFont, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, false, oldVal, newVal));
        }
    },
    setFontname: function (val) {
        var oRes = this.ws.workbook.oStyleManager.setFontname(this, val);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            History.Add(g_oUndoRedoCol, historyitem_RowCol_Fontname, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, false, oRes.oldVal, oRes.newVal));
        }
    },
    setFontsize: function (val) {
        var oRes = this.ws.workbook.oStyleManager.setFontsize(this, val);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            History.Add(g_oUndoRedoCol, historyitem_RowCol_Fontsize, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, false, oRes.oldVal, oRes.newVal));
        }
    },
    setFontcolor: function (val) {
        var oRes = this.ws.workbook.oStyleManager.setFontcolor(this, val);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            History.Add(g_oUndoRedoCol, historyitem_RowCol_Fontcolor, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, false, oRes.oldVal, oRes.newVal));
        }
    },
    setBold: function (val) {
        var oRes = this.ws.workbook.oStyleManager.setBold(this, val);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            History.Add(g_oUndoRedoCol, historyitem_RowCol_Bold, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, false, oRes.oldVal, oRes.newVal));
        }
    },
    setItalic: function (val) {
        var oRes = this.ws.workbook.oStyleManager.setItalic(this, val);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            History.Add(g_oUndoRedoCol, historyitem_RowCol_Italic, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, false, oRes.oldVal, oRes.newVal));
        }
    },
    setUnderline: function (val) {
        var oRes = this.ws.workbook.oStyleManager.setUnderline(this, val);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            History.Add(g_oUndoRedoCol, historyitem_RowCol_Underline, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, false, oRes.oldVal, oRes.newVal));
        }
    },
    setStrikeout: function (val) {
        var oRes = this.ws.workbook.oStyleManager.setStrikeout(this, val);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            History.Add(g_oUndoRedoCol, historyitem_RowCol_Strikeout, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, false, oRes.oldVal, oRes.newVal));
        }
    },
    setFontAlign: function (val) {
        var oRes = this.ws.workbook.oStyleManager.setFontAlign(this, val);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            History.Add(g_oUndoRedoCol, historyitem_RowCol_FontAlign, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, false, oRes.oldVal, oRes.newVal));
        }
    },
    setAlignVertical: function (val) {
        var oRes = this.ws.workbook.oStyleManager.setAlignVertical(this, val);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            History.Add(g_oUndoRedoCol, historyitem_RowCol_AlignVertical, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, false, oRes.oldVal, oRes.newVal));
        }
    },
    setAlignHorizontal: function (val) {
        var oRes = this.ws.workbook.oStyleManager.setAlignHorizontal(this, val);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            History.Add(g_oUndoRedoCol, historyitem_RowCol_AlignHorizontal, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, false, oRes.oldVal, oRes.newVal));
        }
    },
    setFill: function (val) {
        var oRes = this.ws.workbook.oStyleManager.setFill(this, val);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            History.Add(g_oUndoRedoCol, historyitem_RowCol_Fill, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, false, oRes.oldVal, oRes.newVal));
        }
    },
    setBorder: function (val) {
        var oRes = this.ws.workbook.oStyleManager.setBorder(this, val);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            var oldVal = null;
            if (null != oRes.oldVal) {
                oldVal = oRes.oldVal.clone();
            }
            var newVal = null;
            if (null != oRes.newVal) {
                newVal = oRes.newVal.clone();
            }
            History.Add(g_oUndoRedoCol, historyitem_RowCol_Border, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, false, oldVal, newVal));
        }
    },
    setShrinkToFit: function (val) {
        var oRes = this.ws.workbook.oStyleManager.setShrinkToFit(this, val);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            History.Add(g_oUndoRedoCol, historyitem_RowCol_ShrinkToFit, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, false, oRes.oldVal, oRes.newVal));
        }
    },
    setWrap: function (val) {
        var oRes = this.ws.workbook.oStyleManager.setShrinkToFit(this, val);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            History.Add(g_oUndoRedoCol, historyitem_RowCol_Wrap, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, false, oRes.oldVal, oRes.newVal));
        }
    },
    setAngle: function (val) {
        var oRes = this.ws.workbook.oStyleManager.setAngle(this, val);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            History.Add(g_oUndoRedoCol, historyitem_RowCol_Angle, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, false, oRes.oldVal, oRes.newVal));
        }
    },
    setVerticalText: function (val) {
        var oRes = this.ws.workbook.oStyleManager.setVerticalText(this, val);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            History.Add(g_oUndoRedoCol, historyitem_RowCol_Angle, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, false, oRes.oldVal, oRes.newVal));
        }
    }
};
var g_nRowFlag_empty = 0;
var g_nRowFlag_hd = 1;
var g_nRowFlag_CustomHeight = 2;
function Row(worksheet) {
    this.ws = worksheet;
    this.c = {};
    this.index = null;
    this.xfs = null;
    this.h = null;
    this.flags = g_nRowFlag_empty;
}
Row.prototype = {
    getCells: function () {
        return this.c;
    },
    create: function (row) {
        this.index = row - 1;
        this.xfs = null;
    },
    moveVer: function (nDif) {
        this.index += nDif;
    },
    isEmpty: function () {
        if (!this.isEmptyProp()) {
            return false;
        }
        var bEmptyCells = true;
        for (var i in this.c) {
            bEmptyCells = false;
            break;
        }
        if (false == bEmptyCells) {
            return false;
        }
        return true;
    },
    isEmptyProp: function () {
        return null == this.xfs && null == this.h && g_nRowFlag_empty == this.flags;
    },
    Remove: function () {
        this.ws._removeRow(this.index);
    },
    clone: function (oNewWs) {
        if (!oNewWs) {
            oNewWs = this.ws;
        }
        var oNewRow = new Row(oNewWs);
        oNewRow.index = this.index;
        oNewRow.flags = this.flags;
        if (null != this.xfs) {
            oNewRow.xfs = this.xfs.clone();
        }
        if (null != this.h) {
            oNewRow.h = this.h;
        }
        for (var i in this.c) {
            oNewRow.c[i] = this.c[i].clone(oNewWs);
        }
        return oNewRow;
    },
    getDefaultXfs: function () {
        var oRes = null;
        if (null != this.ws.oAllCol && null != this.ws.oAllCol.xfs) {
            oRes = this.ws.oAllCol.xfs.clone();
        }
        return oRes;
    },
    getHeightProp: function () {
        return new UndoRedoData_RowProp(this);
    },
    setHeightProp: function (prop) {
        if (null != prop) {
            if (null != prop.h) {
                this.h = prop.h;
            } else {
                this.h = null;
            }
            if (true == prop.hd) {
                this.flags |= g_nRowFlag_hd;
            } else {
                this.flags &= ~g_nRowFlag_hd;
            }
            if (true == prop.CustomHeight) {
                this.flags |= g_nRowFlag_CustomHeight;
            } else {
                this.flags &= ~g_nRowFlag_CustomHeight;
            }
        }
    },
    copyProperty: function (otherRow) {
        if (null != otherRow.xfs) {
            this.xfs = otherRow.xfs.clone();
        } else {
            this.xfs = null;
        }
        this.h = otherRow.h;
        this.flags = otherRow.flags;
    },
    getStyle: function () {
        return this.xfs;
    },
    _getUpdateRange: function () {
        if (g_nAllRowIndex == this.index) {
            return new Asc.Range(0, 0, gc_nMaxCol0, gc_nMaxRow0);
        } else {
            return new Asc.Range(0, this.index, gc_nMaxCol0, this.index);
        }
    },
    setStyle: function (xfs) {
        var oldVal = this.xfs;
        var newVal = null;
        this.xfs = null;
        if (null != xfs) {
            this.xfs = xfs.clone();
            newVal = xfs;
        }
        if (History.Is_On() && false == ((null == oldVal && null == newVal) || (null != oldVal && null != newVal && true == oldVal.isEqual(newVal)))) {
            if (null != oldVal) {
                oldVal = oldVal.clone();
            }
            if (null != newVal) {
                newVal = newVal.clone();
            }
            History.Add(g_oUndoRedoRow, historyitem_RowCol_SetStyle, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, true, oldVal, newVal));
        }
    },
    setCellStyle: function (val) {
        var newVal = this.ws.workbook.CellStyles._prepareCellStyle(val);
        var oRes = this.ws.workbook.oStyleManager.setCellStyle(this, newVal);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            var oldStyleName = this.ws.workbook.CellStyles.getStyleNameByXfId(oRes.oldVal);
            History.Add(g_oUndoRedoRow, historyitem_RowCol_SetCellStyle, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, true, oldStyleName, val));
            var oStyle = this.ws.workbook.CellStyles.getStyleByXfId(oRes.newVal);
            if (oStyle.ApplyFont) {
                this.setFont(oStyle.getFont());
            }
            if (oStyle.ApplyFill) {
                this.setFill(oStyle.getFill());
            }
            if (oStyle.ApplyBorder) {
                this.setBorder(oStyle.getBorder());
            }
            if (oStyle.ApplyNumberFormat) {
                this.setNumFormat(oStyle.getNumFormatStr());
            }
        }
    },
    setNumFormat: function (val) {
        var oRes = this.ws.workbook.oStyleManager.setNumFormat(this, val);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            History.Add(g_oUndoRedoRow, historyitem_RowCol_NumFormat, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, true, oRes.oldVal, oRes.newVal));
        }
    },
    setFont: function (val) {
        var oRes = this.ws.workbook.oStyleManager.setFont(this, val);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            var oldVal = null;
            if (null != oRes.oldVal) {
                oldVal = oRes.oldVal.clone();
            }
            var newVal = null;
            if (null != oRes.newVal) {
                newVal = oRes.newVal.clone();
            }
            History.Add(g_oUndoRedoRow, historyitem_RowCol_SetFont, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, true, oldVal, newVal));
        }
    },
    setFontname: function (val) {
        var oRes = this.ws.workbook.oStyleManager.setFontname(this, val);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            History.Add(g_oUndoRedoRow, historyitem_RowCol_Fontname, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, true, oRes.oldVal, oRes.newVal));
        }
    },
    setFontsize: function (val) {
        var oRes = this.ws.workbook.oStyleManager.setFontsize(this, val);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            History.Add(g_oUndoRedoRow, historyitem_RowCol_Fontsize, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, true, oRes.oldVal, oRes.newVal));
        }
    },
    setFontcolor: function (val) {
        var oRes = this.ws.workbook.oStyleManager.setFontcolor(this, val);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            History.Add(g_oUndoRedoRow, historyitem_RowCol_Fontcolor, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, true, oRes.oldVal, oRes.newVal));
        }
    },
    setBold: function (val) {
        var oRes = this.ws.workbook.oStyleManager.setBold(this, val);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            History.Add(g_oUndoRedoRow, historyitem_RowCol_Bold, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, true, oRes.oldVal, oRes.newVal));
        }
    },
    setItalic: function (val) {
        var oRes = this.ws.workbook.oStyleManager.setItalic(this, val);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            History.Add(g_oUndoRedoRow, historyitem_RowCol_Italic, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, true, oRes.oldVal, oRes.newVal));
        }
    },
    setUnderline: function (val) {
        var oRes = this.ws.workbook.oStyleManager.setUnderline(this, val);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            History.Add(g_oUndoRedoRow, historyitem_RowCol_Underline, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, true, oRes.oldVal, oRes.newVal));
        }
    },
    setStrikeout: function (val) {
        var oRes = this.ws.workbook.oStyleManager.setStrikeout(this, val);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            History.Add(g_oUndoRedoRow, historyitem_RowCol_Strikeout, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, true, oRes.oldVal, oRes.newVal));
        }
    },
    setFontAlign: function (val) {
        var oRes = this.ws.workbook.oStyleManager.setFontAlign(this, val);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            History.Add(g_oUndoRedoRow, historyitem_RowCol_FontAlign, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, true, oRes.oldVal, oRes.newVal));
        }
    },
    setAlignVertical: function (val) {
        var oRes = this.ws.workbook.oStyleManager.setAlignVertical(this, val);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            History.Add(g_oUndoRedoRow, historyitem_RowCol_AlignVertical, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, true, oRes.oldVal, oRes.newVal));
        }
    },
    setAlignHorizontal: function (val) {
        var oRes = this.ws.workbook.oStyleManager.setAlignHorizontal(this, val);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            History.Add(g_oUndoRedoRow, historyitem_RowCol_AlignHorizontal, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, true, oRes.oldVal, oRes.newVal));
        }
    },
    setFill: function (val) {
        var oRes = this.ws.workbook.oStyleManager.setFill(this, val);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            History.Add(g_oUndoRedoRow, historyitem_RowCol_Fill, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, true, oRes.oldVal, oRes.newVal));
        }
    },
    setBorder: function (val) {
        var oRes = this.ws.workbook.oStyleManager.setBorder(this, val);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            var oldVal = null;
            if (null != oRes.oldVal) {
                oldVal = oRes.oldVal.clone();
            }
            var newVal = null;
            if (null != oRes.newVal) {
                newVal = oRes.newVal.clone();
            }
            History.Add(g_oUndoRedoRow, historyitem_RowCol_Border, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, true, oldVal, newVal));
        }
    },
    setShrinkToFit: function (val) {
        var oRes = this.ws.workbook.oStyleManager.setShrinkToFit(this, val);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            History.Add(g_oUndoRedoRow, historyitem_RowCol_ShrinkToFit, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, true, oRes.oldVal, oRes.newVal));
        }
    },
    setWrap: function (val) {
        var oRes = this.ws.workbook.oStyleManager.setShrinkToFit(this, val);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            History.Add(g_oUndoRedoRow, historyitem_RowCol_Wrap, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, true, oRes.oldVal, oRes.newVal));
        }
    },
    setAngle: function (val) {
        var oRes = this.ws.workbook.oStyleManager.setAngle(this, val);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            History.Add(g_oUndoRedoRow, historyitem_RowCol_Angle, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, true, oRes.oldVal, oRes.newVal));
        }
    },
    setVerticalText: function (val) {
        var oRes = this.ws.workbook.oStyleManager.setVerticalText(this, val);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            History.Add(g_oUndoRedoRow, historyitem_RowCol_Angle, this.ws.getId(), this._getUpdateRange(), new UndoRedoData_IndexSimpleProp(this.index, true, oRes.oldVal, oRes.newVal));
        }
    }
};
var g_oCCellValueMultiTextProperties = {
    text: 0,
    format: 1
};
function CCellValueMultiText() {
    this.Properties = g_oCCellValueMultiTextProperties;
    this.text = null;
    this.format = null;
}
CCellValueMultiText.prototype = {
    isEqual: function (val) {
        if (null == val) {
            return false;
        }
        return this.text == val.text && ((null == this.format && null == val.format) || (null != this.format && null != val.format && this.format.isEqual(val.format)));
    },
    clone: function () {
        var oRes = new CCellValueMultiText();
        if (null != this.text) {
            oRes.text = this.text;
        }
        if (null != this.format) {
            oRes.format = this.format.clone();
        }
        return oRes;
    },
    getType: function () {
        return UndoRedoDataTypes.ValueMultiTextElem;
    },
    getProperties: function () {
        return this.Properties;
    },
    getProperty: function (nType) {
        switch (nType) {
        case this.Properties.text:
            return this.text;
            break;
        case this.Properties.format:
            return this.format;
            break;
        }
    },
    setProperty: function (nType, value) {
        switch (nType) {
        case this.Properties.text:
            this.text = value;
            break;
        case this.Properties.format:
            this.format = value;
            break;
        }
    }
};
var g_oCCellValueProperties = {
    text: 0,
    multiText: 1,
    number: 2,
    type: 3
};
function CCellValue() {
    this.Properties = g_oCCellValueProperties;
    this.text = null;
    this.multiText = null;
    this.number = null;
    this.type = CellValueType.Number;
    this.textValue = null;
    this.aTextValue2 = [];
    this.textValueForEdit = null;
    this.textValueForEdit2 = null;
}
CCellValue.prototype = {
    isEmpty: function () {
        if (null != this.number || (null != this.text && "" != this.text)) {
            return false;
        }
        if (null != this.multiText && "" != this.getStringFromMultiText()) {
            return false;
        }
        return true;
    },
    isEqual: function (val) {
        if (null == val) {
            return false;
        }
        if (this.text != val.text) {
            return false;
        }
        if (this.number != val.number) {
            return false;
        }
        if (this.type != val.type) {
            return false;
        }
        if (null != this.multiText && null != val.multiText) {
            if (this.multiText.length == val.multiText.length) {
                for (var i = 0, length = this.multiText.length; i < length; ++i) {
                    if (false == this.multiText[i].isEqual(val.multiText[i])) {
                        return false;
                    }
                }
                return true;
            }
            return false;
        } else {
            if (null == this.multiText && null == val.multiText) {
                return true;
            }
        }
        return false;
    },
    clean: function () {
        this.text = null;
        this.multiText = null;
        this.number = null;
        this.type = CellValueType.Number;
        this.cleanCache();
    },
    clone: function () {
        var oRes = new CCellValue();
        if (null != this.text) {
            oRes.text = this.text;
        }
        if (null != this.multiText) {
            oRes.multiText = this._cloneMultiText();
        }
        if (null != this.number) {
            oRes.number = this.number;
        }
        if (null != this.type) {
            oRes.type = this.type;
        }
        return oRes;
    },
    cleanCache: function () {
        this.textValue = null;
        this.aTextValue2 = [];
        this.textValueForEdit = null;
        this.textValueForEdit2 = null;
    },
    getStringFromMultiText: function () {
        var sRes = "";
        if (null != this.multiText) {
            for (var i = 0, length = this.multiText.length; i < length; ++i) {
                var elem = this.multiText[i];
                if (null != elem.text) {
                    sRes += elem.text;
                }
            }
        }
        return sRes;
    },
    makeSimpleText: function () {
        var bRes = false;
        if (null != this.multiText) {
            this.text = this.getStringFromMultiText();
            this.multiText = null;
            bRes = true;
        }
        return bRes;
    },
    getValueWithoutFormat: function () {
        var sResult = "";
        if (null != this.number) {
            if (CellValueType.Bool == this.type) {
                sResult = this.number == 1 ? "TRUE" : "FALSE";
            } else {
                sResult = this.number.toString();
            }
        } else {
            if (null != this.text) {
                sResult = this.text;
            } else {
                if (null != this.multiText) {
                    sResult = this.getStringFromMultiText();
                }
            }
        }
        return sResult;
    },
    getValue: function (cell) {
        if (null == this.textValue) {
            this.getValue2(cell, gc_nMaxDigCountView, function () {
                return true;
            });
            this.textValue = "";
            var aText = this.aTextValue2[gc_nMaxDigCountView];
            for (var i = 0, length = aText.length; i < length; ++i) {
                if (aText[i].format && aText[i].format.skip == false) {
                    this.textValue += aText[i].text;
                }
            }
        }
        return this.textValue;
    },
    getValueForEdit: function (cell) {
        if (null == this.textValueForEdit) {
            this.getValueForEdit2(cell);
            this.textValueForEdit = "";
            for (var i = 0, length = this.textValueForEdit2.length; i < length; ++i) {
                this.textValueForEdit += this.textValueForEdit2[i].text;
            }
        }
        return this.textValueForEdit;
    },
    getValue2: function (cell, dDigitsCount, fIsFitMeasurer) {
        var aRes = null;
        if (null != this.aTextValue2[dDigitsCount]) {
            aRes = this.aTextValue2[dDigitsCount];
        }
        if (null == aRes) {
            var bNeedMeasure = true;
            var sText = null;
            var aText = null;
            if (CellValueType.Number == this.type || CellValueType.String == this.type) {
                if (null != this.text) {
                    sText = this.text;
                } else {
                    if (null != this.multiText) {
                        aText = this.multiText;
                    }
                }
                if (CellValueType.String == this.type) {
                    bNeedMeasure = false;
                }
                var oNumFormat;
                var xfs = cell.getCompiledStyle();
                if (null != xfs && null != xfs.num) {
                    oNumFormat = oNumFormatCache.get(xfs.num.f);
                } else {
                    oNumFormat = oNumFormatCache.get(g_oDefaultNum.f);
                }
                if (false == oNumFormat.isGeneralFormat()) {
                    var oAdditionalResult = {};
                    if (null != this.number) {
                        aText = oNumFormat.format(this.number, this.type, dDigitsCount, oAdditionalResult);
                        sText = null;
                    } else {
                        if (CellValueType.String == this.type) {
                            var oTextFormat = oNumFormat.getTextFormat();
                            if (null != oTextFormat && "@" != oTextFormat.formatString) {
                                if (null != this.text) {
                                    aText = oNumFormat.format(this.text, this.type, dDigitsCount, oAdditionalResult);
                                    sText = null;
                                } else {
                                    if (null != this.multiText) {
                                        var sSimpleString = this.getStringFromMultiText();
                                        aText = oNumFormat.format(sSimpleString, this.type, dDigitsCount, oAdditionalResult);
                                        sText = null;
                                    }
                                }
                            }
                        }
                    }
                } else {
                    if (CellValueType.Number == this.type && null != this.number) {
                        bNeedMeasure = false;
                        var bFindResult = false;
                        var nTempDigCount = Math.ceil(dDigitsCount);
                        var sOriginText = this.number;
                        while (nTempDigCount >= 1) {
                            var sGeneral = DecodeGeneralFormat(sOriginText, this.type, nTempDigCount);
                            if (null != sGeneral) {
                                oNumFormat = oNumFormatCache.get(sGeneral);
                            }
                            if (null != oNumFormat) {
                                sText = null;
                                aText = oNumFormat.format(sOriginText, this.type, dDigitsCount);
                                if (true == oNumFormat.isTextFormat()) {
                                    break;
                                } else {
                                    aRes = this._getValue2Result(cell, sText, aText);
                                    if (true == fIsFitMeasurer(aRes)) {
                                        bFindResult = true;
                                        break;
                                    }
                                    aRes = null;
                                }
                            }
                            nTempDigCount--;
                        }
                        if (false == bFindResult) {
                            aRes = null;
                            sText = null;
                            if (dDigitsCount > 1) {
                                var oNumFormatFont = new NumFormatFont();
                                oNumFormatFont.repeat = true;
                                aText = [{
                                    text: "#",
                                    format: oNumFormatFont
                                }];
                            } else {
                                aText = [{
                                    text: "",
                                    format: {}
                                }];
                            }
                        }
                    }
                }
            } else {
                if (CellValueType.Bool == this.type) {
                    if (null != this.number) {
                        sText = (0 != this.number) ? "TRUE" : "FALSE";
                    }
                } else {
                    if (CellValueType.Error == this.type) {
                        if (null != this.text) {
                            sText = this.text;
                        }
                    }
                }
            }
            if (bNeedMeasure) {
                aRes = this._getValue2Result(cell, sText, aText);
                if (false == fIsFitMeasurer(aRes)) {
                    aRes = null;
                    sText = null;
                    var oNumFormatFont = new NumFormatFont();
                    oNumFormatFont.repeat = true;
                    aText = [{
                        text: "#",
                        format: oNumFormatFont
                    }];
                }
            }
            if (null == aRes) {
                aRes = this._getValue2Result(cell, sText, aText);
            }
            if (cell.sFormula) {
                aRes[0].sFormula = cell.sFormula;
                aRes[0].sId = cell.getName();
            }
            this.aTextValue2[dDigitsCount] = aRes;
        }
        return aRes;
    },
    getValueForEdit2: function (cell, cultureInfo) {
        if (null == cultureInfo) {
            cultureInfo = g_oDefaultCultureInfo;
        }
        if (null == this.textValueForEdit2) {
            var oValueText = null;
            var oValueArray = null;
            var xfs = cell.getCompiledStyle();
            if (cell.sFormula) {
                oValueText = "=" + cell.sFormula;
            } else {
                if (null != this.text || null != this.number) {
                    if (CellValueType.Bool == this.type && null != this.number) {
                        oValueText = (this.number == 1) ? "TRUE" : "FALSE";
                    } else {
                        if (null != this.text) {
                            oValueText = this.text;
                        }
                        if (CellValueType.Number == this.type || CellValueType.String == this.type) {
                            var oNumFormat;
                            if (null != xfs && null != xfs.num) {
                                oNumFormat = oNumFormatCache.get(xfs.num.f);
                            } else {
                                oNumFormat = oNumFormatCache.get(g_oDefaultNum.f);
                            }
                            if (CellValueType.String != this.type && null != oNumFormat && null != this.number) {
                                var nValue = this.number;
                                var oTargetFormat = oNumFormat.getFormatByValue(nValue);
                                if (oTargetFormat) {
                                    if (1 == oTargetFormat.nPercent) {
                                        oValueText = oGeneralEditFormatCache.format(nValue * 100) + "%";
                                    } else {
                                        if (oTargetFormat.bDateTime) {
                                            if (false == oTargetFormat.isInvalidDateValue(nValue)) {
                                                var bDate = oTargetFormat.bDate;
                                                var bTime = oTargetFormat.bTime;
                                                if (false == bDate && nValue >= 1) {
                                                    bDate = true;
                                                }
                                                if (false == bTime && Math.floor(nValue) != nValue) {
                                                    bTime = true;
                                                }
                                                var sDateFormat = "";
                                                if (bDate) {
                                                    for (var i = 0, length = cultureInfo.ShortDatePattern.length; i < length; i++) {
                                                        var nIndex = cultureInfo.ShortDatePattern[i] - 0;
                                                        if (0 != i) {
                                                            sDateFormat += "/";
                                                        }
                                                        if (0 == nIndex) {
                                                            sDateFormat += "d";
                                                        } else {
                                                            if (1 == nIndex) {
                                                                sDateFormat += "m";
                                                            } else {
                                                                if (2 == nIndex) {
                                                                    sDateFormat += "yyyy";
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                                if (bDate && bTime) {
                                                    oNumFormat = oNumFormatCache.get(sDateFormat + " h:mm:ss AM/PM");
                                                } else {
                                                    if (bTime) {
                                                        oNumFormat = oNumFormatCache.get("h:mm:ss AM/PM");
                                                    } else {
                                                        oNumFormat = oNumFormatCache.get(sDateFormat);
                                                    }
                                                }
                                                var aFormatedValue = oNumFormat.format(nValue, CellValueType.Number, gc_nMaxDigCount);
                                                oValueText = "";
                                                for (var i = 0, length = aFormatedValue.length; i < length; ++i) {
                                                    oValueText += aFormatedValue[i].text;
                                                }
                                            } else {
                                                oValueText = oGeneralEditFormatCache.format(nValue);
                                            }
                                        } else {
                                            oValueText = oGeneralEditFormatCache.format(nValue);
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else {
                    if (this.multiText) {
                        oValueArray = this.multiText;
                    }
                }
            }
            if (null != xfs && true == xfs.QuotePrefix && CellValueType.String == this.type && false == cell.isFormula()) {
                if (null != oValueText) {
                    oValueText = "'" + oValueText;
                } else {
                    if (null != oValueArray) {
                        oValueArray = [{
                            text: "'"
                        }].concat(oValueArray);
                    }
                }
            }
            this.textValueForEdit2 = this._getValue2Result(cell, oValueText, oValueArray);
        }
        return this.textValueForEdit2;
    },
    _getValue2Result: function (cell, sText, aText) {
        var aResult = [];
        if (null == sText && null == aText) {
            sText = "";
        }
        var color;
        var cellfont;
        var xfs = cell.getCompiledStyle();
        if (null != xfs && null != xfs.font) {
            cellfont = xfs.font;
        } else {
            cellfont = g_oDefaultFont;
        }
        if (null != sText) {
            var oNewItem = new Fragment();
            oNewItem.text = sText;
            oNewItem.format = cellfont.clone();
            color = oNewItem.format.c;
            if (color instanceof ThemeColor) {
                if (g_nColorHyperlink == color.theme && null == color.tint) {
                    var hyperlink = cell.ws.hyperlinkManager.getByCell(cell.nRow, cell.nCol);
                    if (null != hyperlink && hyperlink.data.getVisited()) {
                        oNewItem.format.c = g_oColorManager.getThemeColor(g_nColorHyperlinkVisited, null);
                    }
                }
            }
            oNewItem.format.skip = false;
            oNewItem.format.repeat = false;
            aResult.push(oNewItem);
        } else {
            if (null != aText) {
                for (var i = 0; i < aText.length; i++) {
                    var oNewItem = new Fragment();
                    var oCurtext = aText[i];
                    if (null != oCurtext.text) {
                        oNewItem.text = oCurtext.text;
                        var oCurFormat = new Font();
                        oCurFormat.set(cellfont);
                        if (null != oCurtext.format) {
                            oCurFormat.set(oCurtext.format);
                        }
                        oNewItem.format = oCurFormat;
                        color = oNewItem.format.c;
                        if (color instanceof ThemeColor) {
                            if (g_nColorHyperlink == color.theme && null == color.tint) {
                                var hyperlink = cell.ws.hyperlinkManager.getByCell(cell.nRow, cell.nCol);
                                if (null != hyperlink && hyperlink.data.getVisited()) {
                                    oNewItem.format.c = g_oColorManager.getThemeColor(g_nColorHyperlinkVisited, null);
                                }
                            }
                        }
                        aResult.push(oNewItem);
                    }
                }
            }
        }
        return aResult;
    },
    setValue: function (cell, val) {
        this.clean();
        if ("" == val) {
            return;
        }
        var oNumFormat;
        var xfs = cell.getCompiledStyle();
        if (null != xfs && null != xfs.num) {
            oNumFormat = oNumFormatCache.get(xfs.num.f);
        } else {
            oNumFormat = oNumFormatCache.get(g_oDefaultNum.f);
        }
        if (oNumFormat.isTextFormat()) {
            this.type = CellValueType.String;
            this.text = val;
        } else {
            if (g_oFormatParser.isLocaleNumber(val)) {
                this.type = CellValueType.Number;
                this.number = g_oFormatParser.parseLocaleNumber(val);
            } else {
                var sUpText = val.toUpperCase();
                if ("TRUE" == sUpText || "FALSE" == sUpText) {
                    this.type = CellValueType.Bool;
                    this.number = ("TRUE" == sUpText) ? 1 : 0;
                } else {
                    if ("#NULL!" == sUpText || "#DIV/0!" == sUpText || "#NAME?" == sUpText || "#NUM!" == sUpText || "#N/A" == sUpText || "#REF!" == sUpText || "#VALUE!" == sUpText) {
                        this.type = CellValueType.Error;
                        this.text = sUpText;
                    } else {
                        var res = g_oFormatParser.parse(val);
                        if (null != res) {
                            var nFormatType = oNumFormat.getType();
                            if (! ((c_oAscNumFormatType.Percent == nFormatType && res.bPercent) || (c_oAscNumFormatType.Currency == nFormatType && res.bCurrency) || (c_oAscNumFormatType.Date == nFormatType && res.bDate) || (c_oAscNumFormatType.Time == nFormatType && res.bTime)) && res.format != oNumFormat.sFormat) {
                                cell.setNumFormat(res.format);
                            }
                            this.number = res.value;
                            this.type = CellValueType.Number;
                        } else {
                            this.type = CellValueType.String;
                            if (val.length > 0 && "'" == val[0]) {
                                cell.setQuotePrefix(true);
                                val = val.substring(1);
                            }
                            this.text = val;
                        }
                    }
                }
            }
        }
        if (0 == val.indexOf("http://") || 0 == val.indexOf("https://") || (0 == val.indexOf("www.") && val.length > 4)) {
            var sRealUrl = val;
            if (0 != val.indexOf("http://") && 0 != val.indexOf("https://")) {
                sRealUrl = "http://" + sRealUrl;
            }
            var oNewHyperlink = new Hyperlink();
            oNewHyperlink.Ref = cell.ws.getCell3(cell.nRow, cell.nCol);
            oNewHyperlink.Hyperlink = sRealUrl;
            oNewHyperlink.Ref.setHyperlink(oNewHyperlink);
        }
    },
    setValue2: function (cell, aVal) {
        var sSimpleText = "";
        for (var i = 0, length = aVal.length; i < length; ++i) {
            sSimpleText += aVal[i].text;
        }
        this.setValue(cell, sSimpleText);
        var nRow = cell.nRow;
        var nCol = cell.nCol;
        if (CellValueType.String == this.type && null == cell.ws.hyperlinkManager.getByCell(nRow, nCol)) {
            this.clean();
            this.type = CellValueType.String;
            if (aVal.length > 0) {
                this.multiText = [];
                for (var i = 0, length = aVal.length; i < length; i++) {
                    var item = aVal[i];
                    var oNewElem = new CCellValueMultiText();
                    oNewElem.text = item.text;
                    oNewElem.format = g_oDefaultFont.clone();
                    if (null != item.format) {
                        oNewElem.format.set(item.format);
                    }
                    this.multiText.push(oNewElem);
                }
                this.miminizeMultiText(cell, true);
            }
            if (null != this.text) {
                if (this.text.length > 0 && "'" == this.text[0]) {
                    cell.setQuotePrefix(true);
                    this.text = this.text.substring(1);
                }
            } else {
                if (null != this.multiText) {
                    if (this.multiText.length > 0) {
                        var oFirstItem = this.multiText[0];
                        if (null != oFirstItem.text && oFirstItem.text.length > 0 && "'" == oFirstItem.text[0]) {
                            cell.setQuotePrefix(true);
                            if (1 != oFirstItem.text.length) {
                                oFirstItem.text = oFirstItem.text.substring(1);
                            } else {
                                this.multiText.shift();
                                if (0 == this.multiText.length) {
                                    this.multiText = null;
                                    this.text = "";
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    _cloneMultiText: function () {
        var oRes = [];
        for (var i = 0, length = this.multiText.length; i < length; ++i) {
            oRes.push(this.multiText[i].clone());
        }
        return oRes;
    },
    miminizeMultiText: function (cell, bSetCellFont) {
        var bRes = false;
        if (null == bSetCellFont) {
            bSetCellFont = true;
        }
        if (null != this.multiText && this.multiText.length > 0) {
            var range = cell.ws.getCell3(cell.nRow, cell.nCol);
            var cellFont = range.getFont();
            var oIntersectFont;
            for (var i = 0, length = this.multiText.length; i < length; i++) {
                var elem = this.multiText[i];
                if (null != elem.format) {
                    if (null == oIntersectFont) {
                        oIntersectFont = elem.format.clone();
                    }
                    oIntersectFont.intersect(elem.format, cellFont);
                } else {
                    oIntersectFont = cellFont.clone();
                    break;
                }
            }
            if (bSetCellFont) {
                if (oIntersectFont.isEqual(g_oDefaultFont)) {
                    cell.setFont(null, false);
                } else {
                    cell.setFont(oIntersectFont, false);
                }
            }
            var bIsEqual = true;
            for (var i = 0, length = this.multiText.length; i < length; i++) {
                var elem = this.multiText[i];
                if (null != elem.format && false == oIntersectFont.isEqual(elem.format)) {
                    bIsEqual = false;
                    break;
                }
            }
            if (bIsEqual) {
                this.makeSimpleText();
                bRes = true;
            }
        }
        return bRes;
    },
    _setFontProp: function (cell, fCheck, fAction) {
        var bRes = false;
        if (null != this.multiText) {
            var bChange = false;
            for (var i = 0, length = this.multiText.length; i < length; ++i) {
                var elem = this.multiText[i];
                if (null != elem.format && true == fCheck(elem.format)) {
                    bChange = true;
                    break;
                }
            }
            if (bChange) {
                var backupObj = cell.getValueData();
                for (var i = 0, length = this.multiText.length; i < length; ++i) {
                    var elem = this.multiText[i];
                    if (null != elem.format) {
                        fAction(elem.format);
                    }
                }
                if (this.miminizeMultiText(cell, false)) {
                    var DataNew = cell.getValueData();
                    History.Add(g_oUndoRedoCell, historyitem_Cell_ChangeValue, cell.ws.getId(), new Asc.Range(cell.nCol, cell.nRow, cell.nCol, cell.nRow), new UndoRedoData_CellSimpleData(cell.nRow, cell.nCol, backupObj, DataNew));
                } else {
                    var DataNew = this._cloneMultiText();
                    History.Add(g_oUndoRedoCell, historyitem_Cell_ChangeArrayValueFormat, cell.ws.getId(), new Asc.Range(cell.nCol, cell.nRow, cell.nCol, cell.nRow), new UndoRedoData_CellSimpleData(cell.nRow, cell.nCol, backupObj.value.multiText, DataNew));
                }
            }
            bRes = true;
        }
        return bRes;
    },
    setFontname: function (cell, val) {
        return this._setFontProp(cell, function (format) {
            return val != format.fn;
        },
        function (format) {
            format.fn = val;
        });
    },
    setFontsize: function (cell, val) {
        return this._setFontProp(cell, function (format) {
            return val != format.fs;
        },
        function (format) {
            format.fs = val;
        });
    },
    setFontcolor: function (cell, val) {
        return this._setFontProp(cell, function (format) {
            return val != format.c;
        },
        function (format) {
            format.c = val;
        });
    },
    setBold: function (cell, val) {
        return this._setFontProp(cell, function (format) {
            return val != format.b;
        },
        function (format) {
            format.b = val;
        });
    },
    setItalic: function (cell, val) {
        return this._setFontProp(cell, function (format) {
            return val != format.i;
        },
        function (format) {
            format.i = val;
        });
    },
    setUnderline: function (cell, val) {
        return this._setFontProp(cell, function (format) {
            return val != format.u;
        },
        function (format) {
            format.u = val;
        });
    },
    setStrikeout: function (cell, val) {
        return this._setFontProp(cell, function (format) {
            return val != format.s;
        },
        function (format) {
            format.s = val;
        });
    },
    setFontAlign: function (cell, val) {
        return this._setFontProp(cell, function (format) {
            return val != format.va;
        },
        function (format) {
            format.va = val;
        });
    },
    setValueType: function (type) {
        if (CellValueType.String == type && null != this.number) {
            this.text = this.number.toString();
            this.number = null;
        }
        this.type = type;
    },
    getType: function () {
        return UndoRedoDataTypes.CellValue;
    },
    getProperties: function () {
        return this.Properties;
    },
    getProperty: function (nType) {
        switch (nType) {
        case this.Properties.text:
            return this.text;
            break;
        case this.Properties.multiText:
            return this.multiText;
            break;
        case this.Properties.number:
            return this.number;
            break;
        case this.Properties.type:
            return this.type;
            break;
        }
    },
    setProperty: function (nType, value) {
        switch (nType) {
        case this.Properties.text:
            this.text = value;
            break;
        case this.Properties.multiText:
            this.multiText = value;
            break;
        case this.Properties.number:
            this.number = value;
            break;
        case this.Properties.type:
            this.type = value;
            break;
        }
    }
};
function TreeRBNode(key, storedValue) {
    this.storedValue = storedValue;
    this.key = key;
    this.red = null;
    this.left = null;
    this.right = null;
    this.parent = null;
}
TreeRBNode.prototype = {
    constructor: TreeRBNode,
    isEqual: function (x) {
        return this.key == x.key;
    }
};
function IntervalTreeRBNode(low, high, storedValue) {
    IntervalTreeRBNode.superclass.constructor.call(this, low, storedValue);
    this.high = high;
    this.maxHigh = this.high;
    this.minLow = this.key;
}
Asc.extendClass(IntervalTreeRBNode, TreeRBNode);
IntervalTreeRBNode.prototype.isEqual = function (x) {
    return this.key == x.key && this.high == x.high;
};
function TreeRB() {
    this.nil = null;
    this.root = null;
    this._init();
}
TreeRB.prototype = {
    constructor: TreeRB,
    _init: function () {
        this.nil = new TreeRBNode();
        this.nil.left = this.nil.right = this.nil.parent = this.nil;
        this.nil.key = -Number.MAX_VALUE;
        this.nil.red = 0;
        this.nil.storedValue = null;
        this.root = new TreeRBNode();
        this.root.left = this.nil.right = this.nil.parent = this.nil;
        this.root.key = Number.MAX_VALUE;
        this.root.red = 0;
        this.root.storedValue = null;
    },
    _treeInsertHelp: function (z) {
        var oRes = z;
        z.left = z.right = this.nil;
        var y = this.root;
        var x = this.root.left;
        while (x != this.nil && !x.isEqual(z)) {
            y = x;
            if (x.key > z.key) {
                x = x.left;
            } else {
                x = x.right;
            }
        }
        if (x == this.nil) {
            z.parent = y;
            if (y == this.root || y.key > z.key) {
                y.left = z;
            } else {
                y.right = z;
            }
        } else {
            oRes = x;
        }
        return oRes;
    },
    _fixUpMaxHigh: function (x) {},
    _cleanMaxHigh: function (x) {},
    _leftRotate: function (x) {
        var y = x.right;
        x.right = y.left;
        if (y.left != this.nil) {
            y.left.parent = x;
        }
        y.parent = x.parent;
        if (x == x.parent.left) {
            x.parent.left = y;
        } else {
            x.parent.right = y;
        }
        y.left = x;
        x.parent = y;
    },
    _rightRotate: function (y) {
        var x = y.left;
        y.left = x.right;
        if (this.nil != x.right) {
            x.right.parent = y;
        }
        x.parent = y.parent;
        if (y == y.parent.left) {
            y.parent.left = x;
        } else {
            y.parent.right = x;
        }
        x.right = y;
        y.parent = x;
    },
    insertOrGet: function (x) {
        var y = null;
        var oRes = x;
        oRes = this._treeInsertHelp(x);
        if (x == oRes) {
            this._fixUpMaxHigh(x.parent);
            x.red = 1;
            while (x.parent.red) {
                if (x.parent == x.parent.parent.left) {
                    y = x.parent.parent.right;
                    if (y.red) {
                        x.parent.red = 0;
                        y.red = 0;
                        x.parent.parent.red = 1;
                        x = x.parent.parent;
                    } else {
                        if (x == x.parent.right) {
                            x = x.parent;
                            this._leftRotate(x);
                        }
                        x.parent.red = 0;
                        x.parent.parent.red = 1;
                        this._rightRotate(x.parent.parent);
                    }
                } else {
                    y = x.parent.parent.left;
                    if (y.red) {
                        x.parent.red = 0;
                        y.red = 0;
                        x.parent.parent.red = 1;
                        x = x.parent.parent;
                    } else {
                        if (x == x.parent.left) {
                            x = x.parent;
                            this._rightRotate(x);
                        }
                        x.parent.red = 0;
                        x.parent.parent.red = 1;
                        this._leftRotate(x.parent.parent);
                    }
                }
            }
            this.root.left.red = 0;
        }
        return oRes;
    },
    _getSuccessorOf: function (x) {
        var y;
        if (this.nil != (y = x.right)) {
            while (y.left != this.nil) {
                y = y.left;
            }
            return (y);
        } else {
            y = x.parent;
            while (x == y.right) {
                x = y;
                y = y.parent;
            }
            if (y == this.root) {
                return (this.nil);
            }
            return (y);
        }
    },
    _deleteFixUp: function (x) {
        var w;
        var rootLeft = this.root.left;
        while ((!x.red) && (rootLeft != x)) {
            if (x == x.parent.left) {
                w = x.parent.right;
                if (w.red) {
                    w.red = 0;
                    x.parent.red = 1;
                    this._leftRotate(x.parent);
                    w = x.parent.right;
                }
                if ((!w.right.red) && (!w.left.red)) {
                    w.red = 1;
                    x = x.parent;
                } else {
                    if (!w.right.red) {
                        w.left.red = 0;
                        w.red = 1;
                        this._rightRotate(w);
                        w = x.parent.right;
                    }
                    w.red = x.parent.red;
                    x.parent.red = 0;
                    w.right.red = 0;
                    this._leftRotate(x.parent);
                    x = rootLeft;
                }
            } else {
                w = x.parent.left;
                if (w.red) {
                    w.red = 0;
                    x.parent.red = 1;
                    this._rightRotate(x.parent);
                    w = x.parent.left;
                }
                if ((!w.right.red) && (!w.left.red)) {
                    w.red = 1;
                    x = x.parent;
                } else {
                    if (!w.left.red) {
                        w.right.red = 0;
                        w.red = 1;
                        this._leftRotate(w);
                        w = x.parent.left;
                    }
                    w.red = x.parent.red;
                    x.parent.red = 0;
                    w.left.red = 0;
                    this._rightRotate(x.parent);
                    x = rootLeft;
                }
            }
        }
        x.red = 0;
    },
    deleteNode: function (z) {
        var oRes = z.storedValue;
        var y = ((z.left == this.nil) || (z.right == this.nil)) ? z : this._getSuccessorOf(z);
        var x = (y.left == this.nil) ? y.right : y.left;
        if (this.root == (x.parent = y.parent)) {
            this.root.left = x;
        } else {
            if (y == y.parent.left) {
                y.parent.left = x;
            } else {
                y.parent.right = x;
            }
        }
        if (y != z) {
            this._cleanMaxHigh(y);
            y.left = z.left;
            y.right = z.right;
            y.parent = z.parent;
            z.left.parent = z.right.parent = y;
            if (z == z.parent.left) {
                z.parent.left = y;
            } else {
                z.parent.right = y;
            }
            this._fixUpMaxHigh(x.parent);
            if (! (y.red)) {
                y.red = z.red;
                this._deleteFixUp(x);
            } else {
                y.red = z.red;
            }
        } else {
            this._fixUpMaxHigh(x.parent);
            if (! (y.red)) {
                this._deleteFixUp(x);
            }
        }
        return oRes;
    },
    _enumerateRecursion: function (low, high, x, enumResultStack) {
        if (x != this.nil) {
            if (low > x.key) {
                this._enumerateRecursion(low, high, x.right, enumResultStack);
            } else {
                if (high < x.key) {
                    this._enumerateRecursion(low, high, x.left, enumResultStack);
                } else {
                    this._enumerateRecursion(low, high, x.left, enumResultStack);
                    enumResultStack.push(x);
                    this._enumerateRecursion(low, high, x.right, enumResultStack);
                }
            }
        }
    },
    enumerate: function (low, high) {
        var enumResultStack = [];
        if (low <= high) {
            this._enumerateRecursion(low, high, this.root.left, enumResultStack);
        }
        return enumResultStack;
    },
    getElem: function (val) {
        var oRes = null;
        var aElems = this.enumerate(val, val);
        if (aElems.length > 0) {
            oRes = aElems[0];
        }
        return oRes;
    },
    getNodeAll: function () {
        return this.enumerate(-Number.MAX_VALUE, Number.MAX_VALUE);
    },
    isEmpty: function () {
        return this.nil == this.root.left;
    }
};
function IntervalTreeRB() {
    IntervalTreeRB.superclass.constructor.call(this);
}
Asc.extendClass(IntervalTreeRB, TreeRB);
IntervalTreeRB.prototype._init = function (x) {
    this.nil = new IntervalTreeRBNode();
    this.nil.left = this.nil.right = this.nil.parent = this.nil;
    this.nil.key = this.nil.high = this.nil.maxHigh = -Number.MAX_VALUE;
    this.nil.minLow = Number.MAX_VALUE;
    this.nil.red = 0;
    this.nil.storedValue = null;
    this.root = new IntervalTreeRBNode();
    this.root.left = this.nil.right = this.nil.parent = this.nil;
    this.root.key = this.root.high = this.root.maxHigh = Number.MAX_VALUE;
    this.root.minLow = -Number.MAX_VALUE;
    this.root.red = 0;
    this.root.storedValue = null;
};
IntervalTreeRB.prototype._fixUpMaxHigh = function (x) {
    while (x != this.root) {
        x.maxHigh = Math.max(x.high, Math.max(x.left.maxHigh, x.right.maxHigh));
        x.minLow = Math.min(x.key, Math.min(x.left.minLow, x.right.minLow));
        x = x.parent;
    }
};
IntervalTreeRB.prototype._cleanMaxHigh = function (x) {
    x.maxHigh = -Number.MAX_VALUE;
    x.minLow = Number.MAX_VALUE;
};
IntervalTreeRB.prototype._overlap = function (a1, a2, b1, b2) {
    if (a1 <= b1) {
        return ((b1 <= a2));
    } else {
        return ((a1 <= b2));
    }
};
IntervalTreeRB.prototype._enumerateRecursion = function (low, high, x, enumResultStack) {
    if (x != this.nil) {
        if (this._overlap(low, high, x.minLow, x.maxHigh)) {
            this._enumerateRecursion(low, high, x.left, enumResultStack);
            if (this._overlap(low, high, x.key, x.high)) {
                enumResultStack.push(x);
            }
            this._enumerateRecursion(low, high, x.right, enumResultStack);
        }
    }
};
IntervalTreeRB.prototype._leftRotate = function (x) {
    var y = x.right;
    IntervalTreeRB.superclass._leftRotate.call(this, x);
    x.maxHigh = Math.max(x.left.maxHigh, Math.max(x.right.maxHigh, x.high));
    x.minLow = Math.min(x.left.minLow, Math.min(x.right.minLow, x.key));
    y.maxHigh = Math.max(x.maxHigh, Math.max(y.right.maxHigh, y.high));
    y.minLow = Math.min(x.minLow, Math.min(y.right.minLow, y.key));
};
IntervalTreeRB.prototype._rightRotate = function (y) {
    var x = y.left;
    IntervalTreeRB.superclass._rightRotate.call(this, y);
    y.maxHigh = Math.max(y.left.maxHigh, Math.max(y.right.maxHigh, y.high));
    y.minLow = Math.min(y.left.minLow, Math.min(y.right.minLow, y.key));
    x.maxHigh = Math.max(x.left.maxHigh, Math.max(y.maxHigh, x.high));
    x.minLow = Math.min(x.left.minLow, Math.min(y.minLow, y.key));
};
function RangeDataManagerElem(bbox, data) {
    this.bbox = bbox;
    this.data = data;
}
function RangeDataManager(fChange) {
    this.oIntervalTreeRB = new IntervalTreeRB();
    this.oDependenceManager = null;
    this.fChange = fChange;
}
RangeDataManager.prototype = {
    add: function (bbox, data, oChangeParam) {
        var oNewNode = new IntervalTreeRBNode(bbox.r1, bbox.r2, null);
        var oStoredNode = this.oIntervalTreeRB.insertOrGet(oNewNode);
        if (oStoredNode == oNewNode) {
            oStoredNode.storedValue = [];
        }
        var oNewElem = new RangeDataManagerElem(new Asc.Range(bbox.c1, bbox.r1, bbox.c2, bbox.r2), data);
        oStoredNode.storedValue.push(oNewElem);
        if (null != this.fChange) {
            this.fChange.call(this, oNewElem.data, null, oNewElem.bbox, oChangeParam);
        }
    },
    get: function (bbox) {
        var bboxRange = new Asc.Range(bbox.c1, bbox.r1, bbox.c2, bbox.r2);
        var oRes = {
            all: [],
            inner: [],
            outer: []
        };
        var oNodes = this.oIntervalTreeRB.enumerate(bbox.r1, bbox.r2);
        for (var i = 0, length = oNodes.length; i < length; i++) {
            var oNode = oNodes[i];
            if (oNode.storedValue) {
                for (var j = 0, length2 = oNode.storedValue.length; j < length2; j++) {
                    var elem = oNode.storedValue[j];
                    if (elem.bbox.isIntersect(bbox)) {
                        oRes.all.push(elem);
                        if (bboxRange.containsRange(elem.bbox)) {
                            oRes.inner.push(elem);
                        } else {
                            oRes.outer.push(elem);
                        }
                    }
                }
            }
        }
        return oRes;
    },
    getExact: function (bbox) {
        var oRes = null;
        var oGet = this.get(bbox);
        for (var i = 0, length = oGet.inner.length; i < length; i++) {
            var elem = oGet.inner[i];
            if (elem.bbox.isEqual(bbox)) {
                oRes = elem;
                break;
            }
        }
        return oRes;
    },
    _getByCell: function (nRow, nCol) {
        var oRes = null;
        var aAll = this.get(new Asc.Range(nCol, nRow, nCol, nRow));
        if (aAll.all.length > 0) {
            oRes = aAll.all[0];
        }
        return oRes;
    },
    getByCell: function (nRow, nCol) {
        var oRes = this._getByCell(nRow, nCol);
        if (null == oRes && null != this.oDependenceManager) {
            var oDependence = this.oDependenceManager._getByCell(nRow, nCol);
            if (null != oDependence) {
                var oTempRes = this.get(oDependence.bbox);
                if (oTempRes.all.length > 0) {
                    oRes = oTempRes.all[0];
                }
            }
        }
        return oRes;
    },
    remove: function (bbox, bInnerOnly, oChangeParam) {
        var aElems = this.get(bbox);
        var aTargetArray;
        if (bInnerOnly) {
            aTargetArray = aElems.inner;
        } else {
            aTargetArray = aElems.all;
        }
        for (var i = 0, length = aTargetArray.length; i < length; ++i) {
            var elem = aTargetArray[i];
            this.removeElement(elem, oChangeParam);
        }
    },
    removeElement: function (elemToDelete, oChangeParam) {
        if (null != elemToDelete) {
            var bbox = elemToDelete.bbox;
            var oNodes = this.oIntervalTreeRB.enumerate(bbox.r1, bbox.r2);
            for (var i = 0, length = oNodes.length; i < length; i++) {
                var oNode = oNodes[i];
                if (oNode.storedValue) {
                    for (var j = 0, length2 = oNode.storedValue.length; j < length2; j++) {
                        var elem = oNode.storedValue[j];
                        if (elem.bbox.isEqual(bbox)) {
                            oNode.storedValue.splice(j, 1);
                            break;
                        }
                    }
                    if (0 == oNode.storedValue.length) {
                        this.oIntervalTreeRB.deleteNode(oNode);
                    }
                }
            }
            if (null != this.fChange) {
                this.fChange.call(this, elemToDelete.data, elemToDelete.bbox, null, oChangeParam);
            }
        }
    },
    removeAll: function (oChangeParam) {
        this.remove(new Asc.Range(0, 0, gc_nMaxCol0, gc_nMaxRow0), null, oChangeParam);
        this.oIntervalTreeRB = new IntervalTreeRB();
    },
    shiftGet: function (bbox, bHor) {
        var bboxGet = shiftGetBBox(bbox, bHor);
        return {
            bbox: bboxGet,
            elems: this.get(bboxGet)
        };
    },
    shift: function (bbox, bAdd, bHor, oGetRes, oChangeParam) {
        var _this = this;
        if (null == oGetRes) {
            oGetRes = this.shiftGet(bbox, bHor);
        }
        var offset;
        if (bHor) {
            offset = {
                offsetRow: 0,
                offsetCol: bbox.c2 - bbox.c1 + 1
            };
        } else {
            offset = {
                offsetRow: bbox.r2 - bbox.r1 + 1,
                offsetCol: 0
            };
        }
        if (!bAdd) {
            offset.offsetRow = -offset.offsetRow;
            offset.offsetCol = -offset.offsetCol;
        }
        this._shiftmove(true, bbox, offset, oGetRes.elems, oChangeParam);
    },
    move: function (from, to, oChangeParam) {
        var offset = {
            offsetRow: to.r1 - from.r1,
            offsetCol: to.c1 - from.c1
        };
        var oGetRes = this.get(from);
        this._shiftmove(false, from, offset, oGetRes, oChangeParam);
    },
    _shiftmove: function (bShift, bbox, offset, elems, oChangeParam) {
        var aToChange = [];
        var bAdd = offset.offsetRow > 0 || offset.offsetCol > 0;
        var bHor = 0 != offset.offsetCol ? true : false;
        if (elems.inner.length > 0) {
            var bboxAsc = Asc.Range(bbox.c1, bbox.r1, bbox.c2, bbox.r2);
            for (var i = 0, length = elems.inner.length; i < length; i++) {
                var elem = elems.inner[i];
                var from = elem.bbox;
                var to = null;
                if (bShift) {
                    if (bAdd) {
                        to = from.clone();
                        to.setOffset(offset);
                    } else {
                        if (!bboxAsc.containsRange(from)) {
                            to = from.clone();
                            if (bHor) {
                                if (to.c1 <= bbox.c2) {
                                    to.setOffsetFirst({
                                        offsetRow: 0,
                                        offsetCol: bbox.c2 - to.c1 + 1
                                    });
                                }
                            } else {
                                if (to.r1 <= bbox.r2) {
                                    to.setOffsetFirst({
                                        offsetRow: bbox.r2 - to.r1 + 1,
                                        offsetCol: 0
                                    });
                                }
                            }
                            to.setOffset(offset);
                        }
                    }
                } else {
                    to = from.clone();
                    to.setOffset(offset);
                }
                aToChange.push({
                    elem: elem,
                    to: to
                });
            }
        }
        if (bShift) {
            if (elems.outer.length > 0) {
                for (var i = 0, length = elems.outer.length; i < length; i++) {
                    var elem = elems.outer[i];
                    var from = elem.bbox;
                    var to = null;
                    if (bHor) {
                        if (from.c1 < bbox.c1 && bbox.r1 <= from.r1 && from.r2 <= bbox.r2) {
                            if (bAdd) {
                                to = from.clone();
                                to.setOffsetLast({
                                    offsetRow: 0,
                                    offsetCol: bbox.c2 - bbox.c1 + 1
                                });
                            } else {
                                to = from.clone();
                                var nTemp1 = from.c2 - bbox.c1 + 1;
                                var nTemp2 = bbox.c2 - bbox.c1 + 1;
                                to.setOffsetLast({
                                    offsetRow: 0,
                                    offsetCol: -Math.min(nTemp1, nTemp2)
                                });
                            }
                        }
                    } else {
                        if (from.r1 < bbox.r1 && bbox.c1 <= from.c1 && from.c2 <= bbox.c2) {
                            if (bAdd) {
                                to = from.clone();
                                to.setOffsetLast({
                                    offsetRow: bbox.r2 - bbox.r1 + 1,
                                    offsetCol: 0
                                });
                            } else {
                                to = from.clone();
                                var nTemp1 = from.r2 - bbox.r1 + 1;
                                var nTemp2 = bbox.r2 - bbox.r1 + 1;
                                to.setOffsetLast({
                                    offsetRow: -Math.min(nTemp1, nTemp2),
                                    offsetCol: 0
                                });
                            }
                        }
                    }
                    if (null != to) {
                        aToChange.push({
                            elem: elem,
                            to: to
                        });
                    }
                }
            }
        }
        aToChange.sort(function (a, b) {
            return shiftSort(a, b, offset);
        });
        if (null != this.fChange) {
            for (var i = 0, length = aToChange.length; i < length; ++i) {
                var item = aToChange[i];
                this.fChange.call(this, item.elem.data, item.elem.bbox, item.to, oChangeParam);
            }
        }
        var fOldChange = this.fChange;
        this.fChange = null;
        for (var i = 0, length = aToChange.length; i < length; ++i) {
            var item = aToChange[i];
            var elem = item.elem;
            this.removeElement(elem, oChangeParam);
        }
        for (var i = 0, length = aToChange.length; i < length; ++i) {
            var item = aToChange[i];
            if (null != item.to) {
                this.add(item.to, item.elem.data, oChangeParam);
            }
        }
        this.fChange = fOldChange;
    },
    getAll: function () {
        var aRes = [];
        var oNodes = this.oIntervalTreeRB.getNodeAll();
        for (var i = 0, length = oNodes.length; i < length; i++) {
            var oNode = oNodes[i];
            if (oNode.storedValue) {
                for (var j = 0, length2 = oNode.storedValue.length; j < length2; j++) {
                    var elem = oNode.storedValue[j];
                    aRes.push(elem);
                }
            }
        }
        return aRes;
    },
    setDependenceManager: function (oDependenceManager) {
        this.oDependenceManager = oDependenceManager;
    }
};
function CellAreaElem(row, col, data) {
    this.row = row;
    this.col = col;
    this.data = data;
}
function CellArea(fChange) {
    this.rows = new TreeRB();
    this.fChange = fChange;
}
CellArea.prototype = {
    add: function (row, col, value) {
        var oNewNode = new TreeRBNode(row, null);
        var oStoredNode = this.rows.insertOrGet(oNewNode);
        if (oStoredNode == oNewNode) {
            oStoredNode.storedValue = new TreeRB();
        }
        var oNewRow = oStoredNode.storedValue;
        var oNewColNode = new TreeRBNode(col, null);
        var oStoredColNode = oNewRow.insertOrGet(oNewColNode);
        var storedValue = new RangeDataManagerElem(new Asc.Range(col, row, col, row), value);
        oNewColNode.storedValue = storedValue;
        if (null != this.fChange) {
            this.fChange.call(this, storedValue.data, null, storedValue.bbox);
        }
    },
    get: function (bbox) {
        var aRes = [];
        var aRows = this.rows.enumerate(bbox.r1, bbox.r2);
        for (var i = 0, length = aRows.length; i < length; i++) {
            var row = aRows[i];
            var aCells = row.storedValue.enumerate(bbox.c1, bbox.c2);
            for (var j = 0, length2 = aCells.length; j < length2; j++) {
                aRes.push(aCells[j].storedValue);
            }
        }
        return aRes;
    },
    remove: function (bbox) {
        var aElems = this.get(bbox);
        for (var i = 0, length = aElems.length; i < length; ++i) {
            var elem = aElems[i];
            this.removeElement(elem);
        }
    },
    removeElement: function (elem) {
        var rowElem = this.rows.getElem(elem.bbox.r1);
        if (rowElem) {
            var row = rowElem.storedValue;
            var cellElem = row.getElem(elem.bbox.c1);
            if (cellElem) {
                row.deleteNode(cellElem);
                if (row.isEmpty()) {
                    this.rows.deleteNode(rowElem);
                }
                if (null != this.fChange) {
                    this.fChange.call(this, cellElem.storedValue.data, cellElem.storedValue.bbox, null);
                }
            }
        }
    },
    removeAll: function () {
        this.remove(new Asc.Range(0, 0, gc_nMaxCol0, gc_nMaxRow0));
        this.oIntervalTreeRB = new IntervalTreeRB();
    },
    shiftGet: function (bbox, bHor) {
        var bboxGet = shiftGetBBox(bbox, bHor);
        return {
            bbox: bboxGet,
            elems: this.get(bboxGet)
        };
    },
    shift: function (bbox, bAdd, bHor, oGetRes) {
        var _this = this;
        if (null == oGetRes) {
            oGetRes = this.shiftGet(bbox, bHor);
        }
        var offset;
        if (bHor) {
            offset = {
                offsetRow: 0,
                offsetCol: bbox.c2 - bbox.c1 + 1
            };
        } else {
            offset = {
                offsetRow: bbox.r2 - bbox.r1 + 1,
                offsetCol: 0
            };
        }
        if (!bAdd) {
            offset.offsetRow = -offset.offsetRow;
            offset.offsetCol = -offset.offsetCol;
        }
        this._shiftmove(true, bbox, offset, oGetRes.elems);
    },
    move: function (from, to) {
        var offset = {
            offsetRow: to.r1 - from.r1,
            offsetCol: to.c1 - from.c1
        };
        var oGetRes = this.get(from);
        this._shiftmove(false, from, offset, oGetRes);
    },
    _shiftmove: function (bShift, bbox, offset, elems) {
        var aToChange = [];
        if (elems.length > 0) {
            var bboxAsc = Asc.Range(bbox.c1, bbox.r1, bbox.c2, bbox.r2);
            var bAdd = offset.offsetRow > 0 || offset.offsetCol > 0;
            for (var i = 0, length = elems.length; i < length; i++) {
                var elem = elems[i];
                var to = null;
                if (!bShift || bAdd || !bboxAsc.containsRange(elem.bbox)) {
                    to = elem.bbox.clone();
                    to.setOffset(offset);
                }
                aToChange.push({
                    elem: elem,
                    to: to
                });
            }
        }
        aToChange.sort(function (a, b) {
            return shiftSort(a, b, offset);
        });
        if (null != this.fChange) {
            for (var i = 0, length = aToChange.length; i < length; ++i) {
                var item = aToChange[i];
                this.fChange.call(this, item.elem.data, item.elem.bbox, item.to);
            }
        }
        var fOldChange = this.fChange;
        this.fChange = null;
        for (var i = 0, length = aToChange.length; i < length; ++i) {
            var item = aToChange[i];
            var elem = item.elem;
            this.removeElement(elem);
        }
        for (var i = 0, length = aToChange.length; i < length; ++i) {
            var item = aToChange[i];
            if (null != item.to) {
                this.add(item.to.r1, item.to.c1, item.elem.data);
            }
        }
        this.fChange = fOldChange;
    },
    getAll: function () {
        var aRes = [];
        var oRows = this.rows.getNodeAll();
        for (var i = 0, length = oRows.length; i < length; i++) {
            var row = oRows[i];
            if (row.storedValue) {
                var cells = row.storedValue.getNodeAll();
                for (var j = 0, length2 = cells.length; j < length2; j++) {
                    var elem = cells[j];
                    aRes.push(elem.storedValue);
                }
            }
        }
        return aRes;
    }
};
function TablePart() {
    this.Ref = null;
    this.HeaderRowCount = null;
    this.TotalsRowCount = null;
    this.DisplayName = null;
    this.AutoFilter = null;
    this.SortState = null;
    this.TableColumns = null;
    this.TableStyleInfo = null;
    this.result = null;
}
TablePart.prototype.clone = function (ws) {
    var i, res = new TablePart();
    res.Ref = this.Ref ? this.Ref.clone() : null;
    res.HeaderRowCount = this.HeaderRowCount;
    res.TotalsRowCount = this.TotalsRowCount;
    if (this.AutoFilter) {
        res.AutoFilter = this.AutoFilter.clone();
    }
    if (this.SortState) {
        res.SortState = this.SortState.clone();
    }
    if (this.TableColumns) {
        res.TableColumns = [];
        for (i = 0; i < this.TableColumns.length; ++i) {
            res.TableColumns.push(this.TableColumns[i].clone());
        }
    }
    if (this.TableStyleInfo) {
        res.TableStyleInfo = this.TableStyleInfo.clone();
    }
    if (this.result) {
        res.result = [];
        for (i = 0; i < this.result.length; ++i) {
            res.result.push(this.result[i].clone());
        }
    }
    res.recalc(ws);
    return res;
};
TablePart.prototype.recalc = function (ws) {
    this.DisplayName = ws.workbook.oNameGenerator.getNextTableName(ws, this.Ref);
};
function AutoFilter() {
    this.Ref = null;
    this.FilterColumns = null;
    this.SortState = null;
    this.result = null;
}
AutoFilter.prototype.clone = function () {
    var i, res = new AutoFilter();
    res.Ref = this.Ref ? this.Ref.clone() : null;
    res.refTable = this.refTable ? this.refTable.clone() : null;
    if (this.FilterColumns) {
        res.FilterColumns = [];
        for (i = 0; i < this.FilterColumns.length; ++i) {
            res.FilterColumns.push(this.FilterColumns[i].clone());
        }
    }
    if (this.SortState) {
        res.SortState = this.SortState.clone();
    }
    if (this.result) {
        res.result = [];
        for (i = 0; i < this.result.length; ++i) {
            res.result.push(this.result[i].clone());
        }
    }
    return res;
};
function FilterColumns() {
    this.ColId = null;
    this.CustomFiltersObj = null;
}
FilterColumns.prototype.clone = function () {
    var res = new FilterColumns();
    res.ColId = this.ColId;
    if (this.CustomFiltersObj) {
        res.CustomFiltersObj = this.CustomFiltersObj.clone();
    }
    return res;
};
function SortState() {
    this.Ref = null;
    this.CaseSensitive = null;
    this.SortConditions = null;
}
SortState.prototype.clone = function () {
    var i, res = new SortState();
    res.Ref = this.Ref;
    res.CaseSensitive = this.CaseSensitive;
    if (this.SortConditions) {
        res.SortConditions = [];
        for (i = 0; i < this.SortConditions.length; ++i) {
            res.SortConditions.push(this.SortConditions[i].clone());
        }
    }
    return res;
};
function TableColumn() {
    this.Name = null;
    this.TotalsRowLabel = null;
    this.TotalsRowFunction = null;
    this.TotalsRowFormula = null;
    this.dxf = null;
    this.CalculatedColumnFormula = null;
}
TableColumn.prototype.clone = function () {
    var res = new TableColumn();
    res.Name = this.Name;
    res.TotalsRowLabel = this.TotalsRowLabel;
    res.TotalsRowFunction = this.TotalsRowFunction;
    res.TotalsRowFormula = this.TotalsRowFormula;
    if (this.dxf) {
        res.dxf = this.dxf.clone;
    }
    res.CalculatedColumnFormula = this.CalculatedColumnFormula;
    return res;
};
function TableStyleInfo() {
    this.Name = null;
    this.ShowColumnStripes = null;
    this.ShowRowStripes = null;
    this.ShowFirstColumn = null;
    this.ShowLastColumn = null;
}
TableStyleInfo.prototype.clone = function () {
    var res = new TableStyleInfo();
    res.Name = this.Name;
    res.ShowColumnStripes = this.ShowColumnStripes;
    res.ShowRowStripes = this.ShowRowStripes;
    res.ShowFirstColumn = this.ShowFirstColumn;
    res.ShowLastColumn = this.ShowLastColumn;
    return res;
};
function FilterColumn() {
    this.ColId = null;
    this.Filters = null;
    this.CustomFiltersObj = null;
    this.DynamicFilter = null;
    this.ColorFilter = null;
    this.Top10 = null;
    this.ShowButton = true;
}
FilterColumn.prototype.clone = function () {
    var res = new FilterColumn();
    res.ColId = this.ColId;
    if (this.Filters) {
        res.Filters = this.Filters.clone();
    }
    if (this.CustomFiltersObj) {
        res.CustomFiltersObj = this.CustomFiltersObj.clone();
    }
    if (this.DynamicFilter) {
        res.DynamicFilter = this.DynamicFilter.clone();
    }
    if (this.ColorFilter) {
        res.ColorFilter = this.ColorFilter.clone();
    }
    if (this.Top10) {
        res.Top10 = this.Top10.clone();
    }
    res.ShowButton = this.ShowButton;
    return res;
};
function Filters() {
    this.Values = [];
    this.Dates = [];
    this.Blank = null;
}
Filters.prototype.clone = function () {
    var i, res = new Filters();
    res.Values = this.Values.slice();
    if (this.Dates) {
        for (i = 0; i < this.Dates.length; ++i) {
            res.Dates.push(this.Dates[i].clone());
        }
    }
    res.Blank = this.Blank;
    return res;
};
function Filter() {
    this.Val = null;
}
function DateGroupItem() {
    this.DateTimeGrouping = null;
    this.Day = null;
    this.Hour = null;
    this.Minute = null;
    this.Month = null;
    this.Second = null;
    this.Year = null;
}
DateGroupItem.prototype.clone = function () {
    var res = new DateGroupItem();
    res.DateTimeGrouping = this.DateTimeGrouping;
    res.Day = this.Day;
    res.Hour = this.Hour;
    res.Minute = this.Minute;
    res.Month = this.Month;
    res.Second = this.Second;
    res.Year = this.Year;
    return res;
};
function CustomFilters() {
    this.And = null;
    this.CustomFilters = null;
}
CustomFilters.prototype.clone = function () {
    var i, res = new CustomFilters();
    res.And = this.And;
    if (this.CustomFilters) {
        res.CustomFilters = [];
        for (i = 0; i < this.CustomFilters.length; ++i) {
            res.CustomFilters.push(this.CustomFilters[i].clone());
        }
    }
    return res;
};
function CustomFilter() {
    this.Operator = null;
    this.Val = null;
}
CustomFilter.prototype.clone = function () {
    var res = new CustomFilter();
    res.Operator = this.Operator;
    res.Val = this.Val;
    return res;
};
function DynamicFilter() {
    this.Type = null;
    this.Val = null;
    this.MaxVal = null;
}
DynamicFilter.prototype.clone = function () {
    var res = new DynamicFilter();
    res.Type = this.Type;
    res.Val = this.Val;
    res.MaxVal = this.MaxVal;
    return res;
};
function ColorFilter() {
    this.CellColor = null;
    this.dxf = null;
}
ColorFilter.prototype.clone = function () {
    var res = new ColorFilter();
    res.CellColor = this.CellColor;
    if (this.dxf) {
        res.dxf = this.dxf.clone();
    }
    return res;
};
function Top10() {
    this.FilterVal = null;
    this.Percent = null;
    this.Top = null;
    this.Val = null;
}
Top10.prototype.clone = function () {
    var res = new Top10();
    res.FilterVal = this.FilterVal;
    res.Percent = this.Percent;
    res.Top = this.Top;
    res.Val = this.Val;
    return res;
};
function SortCondition() {
    this.Ref = null;
    this.ConditionSortBy = null;
    this.ConditionDescending = null;
    this.dxf = null;
}
SortCondition.prototype.clone = function () {
    var res = new SortCondition();
    res.Ref = this.Ref;
    res.ConditionSortBy = this.ConditionSortBy;
    res.ConditionDescending = this.ConditionDescending;
    if (this.dxf) {
        res.dxf = this.dxf.clone();
    }
    return res;
};
function Result() {
    this.x = null;
    this.y = null;
    this.width = null;
    this.height = null;
    this.id = null;
    this.idNext = null;
    this.hiddenRows = null;
}
Result.prototype.clone = function () {
    var res = new Result();
    res.x = this.x;
    res.y = this.y;
    res.width = this.width;
    res.height = this.height;
    res.id = this.id;
    res.idNext = this.idNext;
    res.hiddenRows = this.hiddenRows;
    res.showButton = this.showButton;
    return res;
};