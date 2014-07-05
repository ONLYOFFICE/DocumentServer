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
var g_oThemeColorTint = [[0, -0.0499893185216834, -0.1499984740745262, -0.249977111117893, -0.3499862666707358, -0.499984740745262], [0, 0.499984740745262, 0.3499862666707358, 0.249977111117893, 0.1499984740745262, 0.0499893185216834], [0, -0.09997863704336681, -0.249977111117893, -0.499984740745262, -0.749992370372631, -0.8999908444471572], [0, 0.7999816888943144, 0.5999938962981049, 0.3999755851924192, -0.249977111117893, -0.499984740745262], [0, 0.7999816888943144, 0.5999938962981049, 0.3999755851924192, -0.249977111117893, -0.499984740745262], [0, 0.7999816888943144, 0.5999938962981049, 0.3999755851924192, -0.249977111117893, -0.499984740745262], [0, 0.7999816888943144, 0.5999938962981049, 0.3999755851924192, -0.249977111117893, -0.499984740745262], [0, 0.7999816888943144, 0.5999938962981049, 0.3999755851924192, -0.249977111117893, -0.499984740745262], [0, 0.7999816888943144, 0.5999938962981049, 0.3999755851924192, -0.249977111117893, -0.499984740745262], [0, 0.7999816888943144, 0.5999938962981049, 0.3999755851924192, -0.249977111117893, -0.499984740745262]];
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
var map_themePresentation_to_themeExcel = new Object();
for (var i in map_themeExcel_to_themePresentation) {
    map_themePresentation_to_themeExcel[map_themeExcel_to_themePresentation[i]] = i - 0;
}
function RgbColor(rgb) {
    this.Properties = {
        rgb: 0
    };
    this.rgb = rgb;
}
RgbColor.prototype = {
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
    }
};
function ThemeColor() {
    this.Properties = {
        rgb: 0,
        theme: 1,
        tint: 2
    };
    this.rgb = null;
    this.theme = null;
    this.tint = null;
}
ThemeColor.prototype = {
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
                var L = HSL.L / g_nHSLMaxValue;
                if (this.tint < 0) {
                    L = L * (1 + this.tint);
                } else {
                    L = L * (1 - this.tint) + (1 - 1 * (1 - this.tint));
                }
                HSL.L = Asc.floor(L * g_nHSLMaxValue);
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
        var _index = parseInt(asc_color.get_value());
        var _id = (_index / 6) >> 0;
        var _pos = _index - _id * 6;
        var tint = g_oThemeColorTint[_id][_pos];
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
            oColorObj = new Object();
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
function Font(val) {
    if (null == val) {
        val = g_oDefaultFontAbs;
    }
    this.Properties = {
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
            if (EFontScheme.fontschemeNone == this.scheme && EFontScheme.fontschemeNone == font.scheme) {
                bRes = this.fn == font.fn;
            } else {
                if (EFontScheme.fontschemeNone != this.scheme && EFontScheme.fontschemeNone != font.scheme) {
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
function Fill(val) {
    if (null == val) {
        val = g_oDefaultFillAbs;
    }
    this.Properties = {
        bg: 0
    };
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
function BorderProp() {
    this.Properties = {
        s: 0,
        c: 1
    };
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
function Border(val) {
    if (null == val) {
        val = g_oDefaultBorderAbs;
    }
    this.Properties = {
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
                this.dd = border.dd;
            }
            if (null != border.du) {
                this.du = border.du;
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
function Num(val) {
    if (null == val) {
        val = g_oDefaultNumAbs;
    }
    this.Properties = {
        f: 0
    };
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
function CellXfs() {
    this.Properties = {
        border: 0,
        fill: 1,
        font: 2,
        num: 3,
        align: 4,
        QuotePrefix: 5,
        XfId: 6
    };
    this.border = null;
    this.fill = null;
    this.font = null;
    this.num = null;
    this.align = null;
    this.QuotePrefix = null;
    this.XfId = null;
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
function Align(val) {
    if (null == val) {
        val = g_oDefaultAlignAbs;
    }
    this.Properties = {
        hor: 0,
        indent: 1,
        RelativeIndent: 2,
        shrink: 3,
        angle: 4,
        ver: 5,
        wrap: 6
    };
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
CCellStyles.prototype = {
    generateFontMap: function (oFontMap) {
        this._generateFontMap(oFontMap, this.DefaultStyles);
        this._generateFontMap(oFontMap, this.CustomStyles);
    },
    _generateFontMap: function (oFontMap, aStyles) {
        var i, length, oStyle;
        for (i = 0, length = aStyles.length; i < length; ++i) {
            oStyle = aStyles[i];
            if (null != oStyle.xfs && null != oStyle.xfs.font && null != oStyle.xfs.font.fn) {
                oFontMap[oStyle.xfs.font.fn] = 1;
            }
        }
    },
    getDefaultStylesCount: function () {
        var nCount = this.DefaultStyles.length;
        for (var i = 0, length = nCount; i < length; ++i) {
            if (this.DefaultStyles[i].Hidden) {
                --nCount;
            }
        }
        return nCount;
    },
    getCustomStylesCount: function () {
        var nCount = this.CustomStyles.length;
        for (var i = 0, length = nCount; i < length; ++i) {
            if (this.CustomStyles[i].Hidden || null != this.CustomStyles[i].BuiltinId) {
                --nCount;
            }
        }
        return nCount;
    },
    getStyleByXfId: function (oXfId) {
        for (var i = 0, length = this.CustomStyles.length; i < length; ++i) {
            if (oXfId === this.CustomStyles[i].XfId) {
                return this.CustomStyles[i];
            }
        }
        return null;
    },
    getStyleNameByXfId: function (oXfId) {
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
    },
    getDefaultStyleNameByBuiltinId: function (oBuiltinId) {
        var style = null;
        for (var i = 0, length = this.DefaultStyles.length; i < length; ++i) {
            style = this.DefaultStyles[i];
            if (style.BuiltinId === oBuiltinId) {
                return style.Name;
            }
        }
        return null;
    },
    _prepareCellStyle: function (name) {
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
        return null;
    }
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
CCellStyle.prototype = {
    clone: function () {
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
    },
    getFill: function () {
        if (null != this.xfs && null != this.xfs.fill) {
            return this.xfs.fill.bg;
        }
        return g_oDefaultFill.bg;
    },
    getFontColor: function () {
        if (null != this.xfs && null != this.xfs.font) {
            return this.xfs.font.c;
        }
        return g_oDefaultFont.c;
    },
    getFont: function () {
        if (null != this.xfs && null != this.xfs.font) {
            return this.xfs.font;
        }
        return null;
    },
    getBorder: function () {
        if (null != this.xfs && null != this.xfs.border) {
            return this.xfs.border;
        }
        return g_oDefaultBorder;
    },
    getNumFormatStr: function () {
        if (null != this.xfs && null != this.xfs.num) {
            return this.xfs.num.f;
        }
        return g_oDefaultNum.f;
    }
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
    },
    _prepareSet: function (oItemWithXfs) {
        if (null == oItemWithXfs.xfs) {
            oItemWithXfs.xfs = this.oDefaultXfs.clone();
        }
        return oItemWithXfs.xfs;
    },
    _prepareSetFont: function (oItemWithXfs) {
        var xfs = this._prepareSet(oItemWithXfs);
        if (null == xfs.font) {
            xfs.font = new Font();
        }
        return xfs;
    },
    _prepareSetAlign: function (oItemWithXfs) {
        var xfs = this._prepareSet(oItemWithXfs);
        if (null == xfs.align) {
            xfs.align = new Align();
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
                xfs.num = null;
            }
        } else {
            xfs = this._prepareSet(oItemWithXfs);
            if (null == xfs.num) {
                xfs.num = new Num();
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
                xfs.font.fn = g_oDefaultFont.fn;
                xfs.font.scheme = EFontScheme.fontschemeNone;
            }
        } else {
            xfs = this._prepareSetFont(oItemWithXfs);
            xfs.font.fn = val;
            xfs.font.scheme = EFontScheme.fontschemeNone;
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
                xfs.fill.bg = g_oDefaultFill.bg;
            }
        } else {
            xfs = this._prepareSet(oItemWithXfs);
            if (null == xfs.fill) {
                xfs.fill = new Fill();
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
function Hyperlink() {
    this.Properties = {
        Ref: 0,
        Location: 1,
        Hyperlink: 2,
        Tooltip: 3
    };
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
    clone: function () {
        var oNewHyp = new Hyperlink();
        if (null !== this.Ref) {
            oNewHyp.Ref = this.Ref.clone();
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
            this.Location = (false == rx_test_ws_name.test(this.LocationSheet)) ? "'" + this.LocationSheet + "'" : this.LocationSheet;
            this.Location += "!" + this.LocationRange;
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
            var sRes = this.Ref.worksheet.getName();
            if (false == rx_test_ws_name.test(sRes)) {
                sRes = "'" + sRes + "'";
            }
            sRes += "!" + this.Ref.getName();
            return sRes;
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
function Col(worksheet, index) {
    this.ws = worksheet;
    this.sm = this.ws.workbook.oStyleManager;
    this.cs = this.ws.workbook.CellStyles;
    this.index = index;
    this.id = this.ws.getNextColId();
    this.BestFit = null;
    this.hd = null;
    this.CustomWidth = null;
    this.width = null;
    this.xfs = null;
}
Col.prototype = {
    getId: function () {
        return this.id;
    },
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
    isEmptyToSave: function () {
        return null == this.BestFit && null == this.hd && null == this.width && null == this.xfs && null == this.CustomWidth;
    },
    isEmpty: function () {
        return this.isEmptyToSave();
    },
    Remove: function () {
        this.ws._removeCol(this.index);
    },
    clone: function () {
        var oNewCol = new Col(this.ws, this.index);
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
            History.Add(g_oUndoRedoCol, historyitem_RowCol_SetStyle, this.ws.getId(), new Asc.Range(0, 0, gc_nMaxCol0, gc_nMaxRow0), new UndoRedoData_IndexSimpleProp(this.index, false, oldVal, newVal));
        }
    },
    setCellStyle: function (val) {
        var newVal = this.cs._prepareCellStyle(val);
        var oRes = this.sm.setCellStyle(this, newVal);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            var oldStyleName = this.cs.getStyleNameByXfId(oRes.oldVal);
            History.Add(g_oUndoRedoCol, historyitem_RowCol_SetCellStyle, this.ws.getId(), new Asc.Range(0, 0, gc_nMaxCol0, gc_nMaxRow0), new UndoRedoData_IndexSimpleProp(this.index, false, oldStyleName, val));
            var oStyle = this.cs.getStyleByXfId(oRes.newVal);
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
        var oRes = this.sm.setNumFormat(this, val);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            History.Add(g_oUndoRedoCol, historyitem_RowCol_NumFormat, this.ws.getId(), new Asc.Range(0, 0, gc_nMaxCol0, gc_nMaxRow0), new UndoRedoData_IndexSimpleProp(this.index, false, oRes.oldVal, oRes.newVal));
        }
    },
    setFont: function (val) {
        var oRes = this.sm.setFont(this, val);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            var oldVal = null;
            if (null != oRes.oldVal) {
                oldVal = oRes.oldVal.clone();
            }
            var newVal = null;
            if (null != oRes.newVal) {
                newVal = oRes.newVal.clone();
            }
            History.Add(g_oUndoRedoCol, historyitem_RowCol_SetFont, this.ws.getId(), new Asc.Range(0, 0, gc_nMaxCol0, gc_nMaxRow0), new UndoRedoData_IndexSimpleProp(this.index, false, oldVal, newVal));
        }
    },
    setFontname: function (val) {
        var oRes = this.sm.setFontname(this, val);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            History.Add(g_oUndoRedoCol, historyitem_RowCol_Fontname, this.ws.getId(), new Asc.Range(0, 0, gc_nMaxCol0, gc_nMaxRow0), new UndoRedoData_IndexSimpleProp(this.index, false, oRes.oldVal, oRes.newVal));
        }
    },
    setFontsize: function (val) {
        var oRes = this.sm.setFontsize(this, val);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            History.Add(g_oUndoRedoCol, historyitem_RowCol_Fontsize, this.ws.getId(), new Asc.Range(0, 0, gc_nMaxCol0, gc_nMaxRow0), new UndoRedoData_IndexSimpleProp(this.index, false, oRes.oldVal, oRes.newVal));
        }
    },
    setFontcolor: function (val) {
        var oRes = this.sm.setFontcolor(this, val);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            History.Add(g_oUndoRedoCol, historyitem_RowCol_Fontcolor, this.ws.getId(), new Asc.Range(0, 0, gc_nMaxCol0, gc_nMaxRow0), new UndoRedoData_IndexSimpleProp(this.index, false, oRes.oldVal, oRes.newVal));
        }
    },
    setBold: function (val) {
        var oRes = this.sm.setBold(this, val);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            History.Add(g_oUndoRedoCol, historyitem_RowCol_Bold, this.ws.getId(), new Asc.Range(0, 0, gc_nMaxCol0, gc_nMaxRow0), new UndoRedoData_IndexSimpleProp(this.index, false, oRes.oldVal, oRes.newVal));
        }
    },
    setItalic: function (val) {
        var oRes = this.sm.setItalic(this, val);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            History.Add(g_oUndoRedoCol, historyitem_RowCol_Italic, this.ws.getId(), new Asc.Range(0, 0, gc_nMaxCol0, gc_nMaxRow0), new UndoRedoData_IndexSimpleProp(this.index, false, oRes.oldVal, oRes.newVal));
        }
    },
    setUnderline: function (val) {
        var oRes = this.sm.setUnderline(this, val);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            History.Add(g_oUndoRedoCol, historyitem_RowCol_Underline, this.ws.getId(), new Asc.Range(0, 0, gc_nMaxCol0, gc_nMaxRow0), new UndoRedoData_IndexSimpleProp(this.index, false, oRes.oldVal, oRes.newVal));
        }
    },
    setStrikeout: function (val) {
        var oRes = this.sm.setStrikeout(this, val);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            History.Add(g_oUndoRedoCol, historyitem_RowCol_Strikeout, this.ws.getId(), new Asc.Range(0, 0, gc_nMaxCol0, gc_nMaxRow0), new UndoRedoData_IndexSimpleProp(this.index, false, oRes.oldVal, oRes.newVal));
        }
    },
    setFontAlign: function (val) {
        var oRes = this.sm.setFontAlign(this, val);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            History.Add(g_oUndoRedoCol, historyitem_RowCol_FontAlign, this.ws.getId(), new Asc.Range(0, 0, gc_nMaxCol0, gc_nMaxRow0), new UndoRedoData_IndexSimpleProp(this.index, false, oRes.oldVal, oRes.newVal));
        }
    },
    setAlignVertical: function (val) {
        var oRes = this.sm.setAlignVertical(this, val);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            History.Add(g_oUndoRedoCol, historyitem_RowCol_AlignVertical, this.ws.getId(), new Asc.Range(0, 0, gc_nMaxCol0, gc_nMaxRow0), new UndoRedoData_IndexSimpleProp(this.index, false, oRes.oldVal, oRes.newVal));
        }
    },
    setAlignHorizontal: function (val) {
        var oRes = this.sm.setAlignHorizontal(this, val);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            History.Add(g_oUndoRedoCol, historyitem_RowCol_AlignHorizontal, this.ws.getId(), new Asc.Range(0, 0, gc_nMaxCol0, gc_nMaxRow0), new UndoRedoData_IndexSimpleProp(this.index, false, oRes.oldVal, oRes.newVal));
        }
    },
    setFill: function (val) {
        var oRes = this.sm.setFill(this, val);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            History.Add(g_oUndoRedoCol, historyitem_RowCol_Fill, this.ws.getId(), new Asc.Range(0, 0, gc_nMaxCol0, gc_nMaxRow0), new UndoRedoData_IndexSimpleProp(this.index, false, oRes.oldVal, oRes.newVal));
        }
    },
    setBorder: function (val) {
        var oRes = this.sm.setBorder(this, val);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            var oldVal = null;
            if (null != oRes.oldVal) {
                oldVal = oRes.oldVal.clone();
            }
            var newVal = null;
            if (null != oRes.newVal) {
                newVal = oRes.newVal.clone();
            }
            History.Add(g_oUndoRedoCol, historyitem_RowCol_Border, this.ws.getId(), new Asc.Range(0, 0, gc_nMaxCol0, gc_nMaxRow0), new UndoRedoData_IndexSimpleProp(this.index, false, oldVal, newVal));
        }
    },
    setShrinkToFit: function (val) {
        var oRes = this.sm.setShrinkToFit(this, val);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            History.Add(g_oUndoRedoCol, historyitem_RowCol_ShrinkToFit, this.ws.getId(), new Asc.Range(0, 0, gc_nMaxCol0, gc_nMaxRow0), new UndoRedoData_IndexSimpleProp(this.index, false, oRes.oldVal, oRes.newVal));
        }
    },
    setWrap: function (val) {
        var oRes = this.sm.setShrinkToFit(this, val);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            History.Add(g_oUndoRedoCol, historyitem_RowCol_Wrap, this.ws.getId(), new Asc.Range(0, 0, gc_nMaxCol0, gc_nMaxRow0), new UndoRedoData_IndexSimpleProp(this.index, false, oRes.oldVal, oRes.newVal));
        }
    },
    setAngle: function (val) {
        var oRes = this.sm.setAngle(this, val);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            History.Add(g_oUndoRedoCol, historyitem_RowCol_Angle, this.ws.getId(), new Asc.Range(0, 0, gc_nMaxCol0, gc_nMaxRow0), new UndoRedoData_IndexSimpleProp(this.index, false, oRes.oldVal, oRes.newVal));
        }
    },
    setVerticalText: function (val) {
        var oRes = this.sm.setVerticalText(this, val);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            History.Add(g_oUndoRedoCol, historyitem_RowCol_Angle, this.ws.getId(), new Asc.Range(0, 0, gc_nMaxCol0, gc_nMaxRow0), new UndoRedoData_IndexSimpleProp(this.index, false, oRes.oldVal, oRes.newVal));
        }
    }
};
function Row(worksheet) {
    this.ws = worksheet;
    this.sm = this.ws.workbook.oStyleManager;
    this.cs = this.ws.workbook.CellStyles;
    this.c = new Object();
    this.id = this.ws.getNextRowId();
    this.r = null;
    this.index = null;
    this.xfs = null;
    this.h = null;
    this.hd = null;
    this.CustomHeight = null;
}
Row.prototype = {
    getCells: function () {
        return this.c;
    },
    getId: function () {
        return this.id;
    },
    create: function (row) {
        this.index = row - 1;
        this.r = row;
        this.xfs = null;
    },
    moveVer: function (nDif) {
        this.r += nDif;
    },
    isEmptyToSave: function () {
        if (null != this.xfs || null != this.h || null != this.hd || null != this.CustomHeight) {
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
    isEmpty: function () {
        return this.isEmptyToSave();
    },
    Remove: function () {
        this.ws._removeRow(this.index);
    },
    clone: function () {
        var oNewRow = new Row(this.ws);
        oNewRow.r = this.r;
        if (null != this.xfs) {
            oNewRow.xfs = this.xfs.clone();
        }
        if (null != this.h) {
            oNewRow.h = this.h;
        }
        if (null != this.CustomHeight) {
            oNewRow.CustomHeight = this.CustomHeight;
        }
        if (null != this.hd) {
            oNewRow.hd = this.hd;
        }
        for (var i in this.c) {
            oNewRow.c[i] = this.c[i].clone();
        }
        return oNewRow;
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
            if (null != prop.hd) {
                this.hd = prop.hd;
            } else {
                this.hd = null;
            }
            if (null != prop.CustomHeight) {
                this.CustomHeight = prop.CustomHeight;
            } else {
                this.CustomHeight = null;
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
        this.CustomHeight = otherRow.CustomHeight;
        this.hd = otherRow.hd;
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
            History.Add(g_oUndoRedoRow, historyitem_RowCol_SetStyle, this.ws.getId(), new Asc.Range(0, this.index, gc_nMaxCol0, this.index), new UndoRedoData_IndexSimpleProp(this.index, true, oldVal, newVal));
        }
    },
    setCellStyle: function (val) {
        var newVal = this.cs._prepareCellStyle(val);
        var oRes = this.sm.setCellStyle(this, newVal);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            var oldStyleName = this.cs.getStyleNameByXfId(oRes.oldVal);
            History.Add(g_oUndoRedoRow, historyitem_RowCol_SetCellStyle, this.ws.getId(), new Asc.Range(0, this.index, gc_nMaxCol0, this.index), new UndoRedoData_IndexSimpleProp(this.index, true, oldStyleName, val));
            var oStyle = this.cs.getStyleByXfId(oRes.newVal);
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
        var oRes = this.sm.setNumFormat(this, val);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            History.Add(g_oUndoRedoRow, historyitem_RowCol_NumFormat, this.ws.getId(), new Asc.Range(0, this.index, gc_nMaxCol0, this.index), new UndoRedoData_IndexSimpleProp(this.index, true, oRes.oldVal, oRes.newVal));
        }
    },
    setFont: function (val) {
        var oRes = this.sm.setFont(this, val);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            var oldVal = null;
            if (null != oRes.oldVal) {
                oldVal = oRes.oldVal.clone();
            }
            var newVal = null;
            if (null != oRes.newVal) {
                newVal = oRes.newVal.clone();
            }
            History.Add(g_oUndoRedoRow, historyitem_RowCol_SetFont, this.ws.getId(), new Asc.Range(0, this.index, gc_nMaxCol0, this.index), new UndoRedoData_IndexSimpleProp(this.index, true, oldVal, newVal));
        }
    },
    setFontname: function (val) {
        var oRes = this.sm.setFontname(this, val);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            History.Add(g_oUndoRedoRow, historyitem_RowCol_Fontname, this.ws.getId(), new Asc.Range(0, this.index, gc_nMaxCol0, this.index), new UndoRedoData_IndexSimpleProp(this.index, true, oRes.oldVal, oRes.newVal));
        }
    },
    setFontsize: function (val) {
        var oRes = this.sm.setFontsize(this, val);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            History.Add(g_oUndoRedoRow, historyitem_RowCol_Fontsize, this.ws.getId(), new Asc.Range(0, this.index, gc_nMaxCol0, this.index), new UndoRedoData_IndexSimpleProp(this.index, true, oRes.oldVal, oRes.newVal));
        }
    },
    setFontcolor: function (val) {
        var oRes = this.sm.setFontcolor(this, val);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            History.Add(g_oUndoRedoRow, historyitem_RowCol_Fontcolor, this.ws.getId(), new Asc.Range(0, this.index, gc_nMaxCol0, this.index), new UndoRedoData_IndexSimpleProp(this.index, true, oRes.oldVal, oRes.newVal));
        }
    },
    setBold: function (val) {
        var oRes = this.sm.setBold(this, val);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            History.Add(g_oUndoRedoRow, historyitem_RowCol_Bold, this.ws.getId(), new Asc.Range(0, this.index, gc_nMaxCol0, this.index), new UndoRedoData_IndexSimpleProp(this.index, true, oRes.oldVal, oRes.newVal));
        }
    },
    setItalic: function (val) {
        var oRes = this.sm.setItalic(this, val);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            History.Add(g_oUndoRedoRow, historyitem_RowCol_Italic, this.ws.getId(), new Asc.Range(0, this.index, gc_nMaxCol0, this.index), new UndoRedoData_IndexSimpleProp(this.index, true, oRes.oldVal, oRes.newVal));
        }
    },
    setUnderline: function (val) {
        var oRes = this.sm.setUnderline(this, val);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            History.Add(g_oUndoRedoRow, historyitem_RowCol_Underline, this.ws.getId(), new Asc.Range(0, this.index, gc_nMaxCol0, this.index), new UndoRedoData_IndexSimpleProp(this.index, true, oRes.oldVal, oRes.newVal));
        }
    },
    setStrikeout: function (val) {
        var oRes = this.sm.setStrikeout(this, val);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            History.Add(g_oUndoRedoRow, historyitem_RowCol_Strikeout, this.ws.getId(), new Asc.Range(0, this.index, gc_nMaxCol0, this.index), new UndoRedoData_IndexSimpleProp(this.index, true, oRes.oldVal, oRes.newVal));
        }
    },
    setFontAlign: function (val) {
        var oRes = this.sm.setFontAlign(this, val);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            History.Add(g_oUndoRedoRow, historyitem_RowCol_FontAlign, this.ws.getId(), new Asc.Range(0, this.index, gc_nMaxCol0, this.index), new UndoRedoData_IndexSimpleProp(this.index, true, oRes.oldVal, oRes.newVal));
        }
    },
    setAlignVertical: function (val) {
        var oRes = this.sm.setAlignVertical(this, val);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            History.Add(g_oUndoRedoRow, historyitem_RowCol_AlignVertical, this.ws.getId(), new Asc.Range(0, this.index, gc_nMaxCol0, this.index), new UndoRedoData_IndexSimpleProp(this.index, true, oRes.oldVal, oRes.newVal));
        }
    },
    setAlignHorizontal: function (val) {
        var oRes = this.sm.setAlignHorizontal(this, val);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            History.Add(g_oUndoRedoRow, historyitem_RowCol_AlignHorizontal, this.ws.getId(), new Asc.Range(0, this.index, gc_nMaxCol0, this.index), new UndoRedoData_IndexSimpleProp(this.index, true, oRes.oldVal, oRes.newVal));
        }
    },
    setFill: function (val) {
        var oRes = this.sm.setFill(this, val);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            History.Add(g_oUndoRedoRow, historyitem_RowCol_Fill, this.ws.getId(), new Asc.Range(0, this.index, gc_nMaxCol0, this.index), new UndoRedoData_IndexSimpleProp(this.index, true, oRes.oldVal, oRes.newVal));
        }
    },
    setBorder: function (val) {
        var oRes = this.sm.setBorder(this, val);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            var oldVal = null;
            if (null != oRes.oldVal) {
                oldVal = oRes.oldVal.clone();
            }
            var newVal = null;
            if (null != oRes.newVal) {
                newVal = oRes.newVal.clone();
            }
            History.Add(g_oUndoRedoRow, historyitem_RowCol_Border, this.ws.getId(), new Asc.Range(0, this.index, gc_nMaxCol0, this.index), new UndoRedoData_IndexSimpleProp(this.index, true, oldVal, newVal));
        }
    },
    setShrinkToFit: function (val) {
        var oRes = this.sm.setShrinkToFit(this, val);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            History.Add(g_oUndoRedoRow, historyitem_RowCol_ShrinkToFit, this.ws.getId(), new Asc.Range(0, this.index, gc_nMaxCol0, this.index), new UndoRedoData_IndexSimpleProp(this.index, true, oRes.oldVal, oRes.newVal));
        }
    },
    setWrap: function (val) {
        var oRes = this.sm.setShrinkToFit(this, val);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            History.Add(g_oUndoRedoRow, historyitem_RowCol_Wrap, this.ws.getId(), new Asc.Range(0, this.index, gc_nMaxCol0, this.index), new UndoRedoData_IndexSimpleProp(this.index, true, oRes.oldVal, oRes.newVal));
        }
    },
    setAngle: function (val) {
        var oRes = this.sm.setFontname(this, val);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            History.Add(g_oUndoRedoRow, historyitem_RowCol_Angle, this.ws.getId(), new Asc.Range(0, this.index, gc_nMaxCol0, this.index), new UndoRedoData_IndexSimpleProp(this.index, true, oRes.oldVal, oRes.newVal));
        }
    },
    setVerticalText: function (val) {
        var oRes = this.sm.setVerticalText(this, val);
        if (History.Is_On() && oRes.oldVal != oRes.newVal) {
            History.Add(g_oUndoRedoRow, historyitem_RowCol_Angle, this.ws.getId(), new Asc.Range(0, this.index, gc_nMaxCol0, this.index), new UndoRedoData_IndexSimpleProp(this.index, true, oRes.oldVal, oRes.newVal));
        }
    }
};
function CCellValueMultiText() {
    this.Properties = {
        text: 0,
        format: 1
    };
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
function CCellValue(cell) {
    this.Properties = {
        text: 0,
        multiText: 1,
        number: 2,
        type: 3
    };
    this.cell = cell;
    this.text = null;
    this.multiText = null;
    this.number = null;
    this.type = CellValueType.Number;
    this.textValue = null;
    this.aTextValue2 = new Array();
    this.textValueForEdit = null;
    this.textValueForEdit2 = null;
}
CCellValue.prototype = {
    isEmpty: function () {
        if (null != this.number || (null != this.text && "" != this.text)) {
            return false;
        }
        if (null != this.multiText) {
            var sText = "";
            for (var i = 0, length = this.multiText.length; i < length; ++i) {
                sText += this.multiText[i].text;
            }
            if ("" != sText) {
                return false;
            }
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
    clone: function (cell) {
        var oRes = new CCellValue(cell);
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
        this.aTextValue2 = new Array();
        this.textValueForEdit = null;
        this.textValueForEdit2 = null;
    },
    makeSimpleText: function () {
        var bRes = false;
        if (null != this.multiText) {
            var sRes = "";
            for (var i = 0, length = this.multiText.length; i < length; ++i) {
                sRes += this.multiText[i].text;
            }
            this.multiText = null;
            this.text = sRes;
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
                    for (var i = 0, length = this.multiText.length; i < length; i++) {
                        sResult += this.multiText[i].text;
                    }
                }
            }
        }
        return sResult;
    },
    getValue: function () {
        if (null == this.textValue) {
            this.getValue2(gc_nMaxDigCountView, function () {
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
    getValueForEdit: function () {
        if (null == this.textValueForEdit) {
            this.getValueForEdit2();
            this.textValueForEdit = "";
            for (var i = 0, length = this.textValueForEdit2.length; i < length; ++i) {
                this.textValueForEdit += this.textValueForEdit2[i].text;
            }
        }
        return this.textValueForEdit;
    },
    getValue2: function (dDigitsCount, fIsFitMeasurer) {
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
                var xfs = this.cell.getStyle();
                if (null != xfs && null != xfs.num) {
                    oNumFormat = oNumFormatCache.get(xfs.num.f);
                } else {
                    oNumFormat = oNumFormatCache.get(g_oDefaultNum.f);
                }
                if (false == oNumFormat.isGeneralFormat()) {
                    var oAdditionalResult = new Object();
                    if (null != this.number) {
                        aText = oNumFormat.format(this.number, this.type, dDigitsCount, oAdditionalResult);
                        sText = null;
                    } else {
                        if (CellValueType.String == this.type) {
                            if (null != this.text) {
                                aText = oNumFormat.format(this.text, this.type, dDigitsCount, oAdditionalResult);
                                sText = null;
                            } else {
                                if (null != this.multiText) {
                                    if ("@" != oNumFormat.sFormat) {
                                        var sSimpleString = "";
                                        for (var i = 0, length = this.multiText.length; i < length; ++i) {
                                            sSimpleString += this.multiText[i].text;
                                        }
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
                                    aRes = this._getValue2Result(sText, aText);
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
                                aText = [{
                                    text: "#",
                                    format: {
                                        repeat: true
                                    }
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
                aRes = this._getValue2Result(sText, aText);
                if (false == fIsFitMeasurer(aRes)) {
                    aRes = null;
                    sText = null;
                    aText = [{
                        text: "#",
                        format: {
                            repeat: true
                        }
                    }];
                }
            }
            if (null == aRes) {
                aRes = this._getValue2Result(sText, aText);
            }
            if (this.cell.sFormula) {
                aRes[0].sFormula = this.cell.sFormula;
                aRes[0].sId = this.cell.getName();
            }
            this.aTextValue2[dDigitsCount] = aRes;
        }
        return aRes;
    },
    getValueForEdit2: function () {
        if (null == this.textValueForEdit2) {
            var oValueText = null;
            var oValueArray = null;
            var xfs = this.cell.getStyle();
            if (this.cell.sFormula) {
                oValueText = "=" + this.cell.sFormula;
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
                                                if (bDate && bTime) {
                                                    oNumFormat = oNumFormatCache.get("m/d/yyyy h:mm:ss AM/PM");
                                                } else {
                                                    if (bTime) {
                                                        oNumFormat = oNumFormatCache.get("h:mm:ss AM/PM");
                                                    } else {
                                                        oNumFormat = oNumFormatCache.get("m/d/yyyy");
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
            if (null != xfs && true == xfs.QuotePrefix && CellValueType.String == this.type && false == this.cell.isFormula()) {
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
            this.textValueForEdit2 = this._getValue2Result(oValueText, oValueArray);
        }
        return this.textValueForEdit2;
    },
    _getValue2Result: function (sText, aText) {
        var aResult = new Array();
        if (null == sText && null == aText) {
            sText = "";
        }
        var cellfont;
        var xfs = this.cell.getStyle();
        if (null != xfs && null != xfs.font) {
            cellfont = xfs.font;
        } else {
            cellfont = g_oDefaultFont;
        }
        if (null != sText) {
            var oNewItem = {
                text: null,
                format: null,
                sFormula: null,
                sId: null,
                theme: null,
                tint: null
            };
            oNewItem.text = sText;
            oNewItem.format = cellfont.clone();
            if (oNewItem.format.c instanceof ThemeColor) {
                oNewItem.theme = oNewItem.format.c.theme;
                oNewItem.tint = oNewItem.format.c.tint;
                if (g_nColorHyperlink == oNewItem.theme && null == oNewItem.tint) {
                    var nRow = this.cell.oId.getRow0();
                    var nCol = this.cell.oId.getCol0();
                    var hyperlink = this.cell.ws.hyperlinkManager.getByCell(nRow, nCol);
                    if (null != hyperlink && hyperlink.data.getVisited()) {
                        oNewItem.format.c = g_oColorManager.getThemeColor(g_nColorHyperlinkVisited, null);
                        oNewItem.theme = g_nColorHyperlinkVisited;
                    }
                }
            }
            oNewItem.format.c = oNewItem.format.getRgbOrNull();
            oNewItem.format.skip = false;
            oNewItem.format.repeat = false;
            aResult.push(oNewItem);
        } else {
            if (null != aText) {
                for (var i = 0; i < aText.length; i++) {
                    var oNewItem = {
                        text: null,
                        format: null,
                        sFormula: null,
                        sId: null,
                        theme: null,
                        tint: null
                    };
                    var oCurtext = aText[i];
                    if (null != oCurtext.text) {
                        oNewItem.text = oCurtext.text;
                        var oCurFormat = new Font();
                        oCurFormat = new Font();
                        oCurFormat.set(cellfont);
                        if (null != oCurtext.format) {
                            oCurFormat.set(oCurtext.format);
                        }
                        oNewItem.format = oCurFormat;
                        if (oNewItem.format.c instanceof ThemeColor) {
                            oNewItem.theme = oNewItem.format.c.theme;
                            oNewItem.tint = oNewItem.format.c.tint;
                            if (g_nColorHyperlink == oNewItem.theme && null == oNewItem.tint) {
                                var nRow = this.cell.oId.getRow0();
                                var nCol = this.cell.oId.getCol0();
                                var hyperlink = this.cell.ws.hyperlinkManager.getByCell(nRow, nCol);
                                if (null != hyperlink && hyperlink.data.getVisited()) {
                                    oNewItem.format.c = g_oColorManager.getThemeColor(g_nColorHyperlinkVisited, null);
                                    oNewItem.theme = g_nColorHyperlinkVisited;
                                }
                            }
                        }
                        oNewItem.format.c = oNewItem.format.getRgbOrNull();
                        aResult.push(oNewItem);
                    }
                }
            }
        }
        return aResult;
    },
    setValue: function (val) {
        this.clean();
        if ("" == val) {
            return;
        }
        var oNumFormat;
        var xfs = this.cell.getStyle();
        if (null != xfs && null != xfs.num) {
            oNumFormat = oNumFormatCache.get(xfs.num.f);
        } else {
            oNumFormat = oNumFormatCache.get(g_oDefaultNum.f);
        }
        if (oNumFormat.isTextFormat()) {
            this.type = CellValueType.String;
            this.text = val;
        } else {
            if (Asc.isNumber(val)) {
                this.type = CellValueType.Number;
                this.number = parseFloat(val);
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
                        var bParsed = false;
                        var res = g_oFormatParser.parse(val);
                        if (null != res) {
                            var oTargetFormat = null;
                            if (null != oNumFormat) {
                                oTargetFormat = oNumFormat.getFormatByValue(res.value);
                            }
                            if (res.bDateTime) {
                                if (null == oTargetFormat || res.bDateTime != oTargetFormat.bDateTime) {
                                    this.cell.setNumFormat(res.format);
                                }
                            } else {
                                if (res.format != oNumFormat.sFormat) {
                                    this.cell.setNumFormat(res.format);
                                }
                            }
                            this.number = res.value;
                            this.type = CellValueType.Number;
                            bParsed = true;
                        }
                        if (false == bParsed) {
                            this.type = CellValueType.String;
                            if (val.length > 0 && "'" == val[0]) {
                                this.cell.setQuotePrefix(true);
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
            oNewHyperlink.Ref = this.cell.ws.getCell3(this.cell.oId.getRow0(), this.cell.oId.getCol0());
            oNewHyperlink.Hyperlink = sRealUrl;
            oNewHyperlink.Ref.setHyperlink(oNewHyperlink);
        }
    },
    setValue2: function (aVal) {
        var sSimpleText = "";
        for (var i = 0, length = aVal.length; i < length; ++i) {
            sSimpleText += aVal[i].text;
        }
        this.setValue(sSimpleText);
        var nRow = this.cell.oId.getRow0();
        var nCol = this.cell.oId.getCol0();
        if (CellValueType.String == this.type && null == this.cell.ws.hyperlinkManager.getByCell(nRow, nCol)) {
            this.clean();
            this.type = CellValueType.String;
            if (aVal.length > 0) {
                this.multiText = new Array();
                for (var i = 0, length = aVal.length; i < length; i++) {
                    var item = aVal[i];
                    var format = item.format;
                    if (null != item.theme) {
                        format.c = g_oColorManager.getThemeColor(item.theme, item.tint);
                    } else {
                        if (null != format && null != format.c) {
                            var color = format.c;
                            format.c = null;
                            if ("string" == typeof(color)) {
                                if (0 == color.indexOf("#")) {
                                    var hex = color.substring(1);
                                    if (hex.length == 3) {
                                        hex = hex.charAt(0) + hex.charAt(0) + hex.charAt(1) + hex.charAt(1) + hex.charAt(2) + hex.charAt(2);
                                    }
                                    if (hex.length == 6) {
                                        var r = parseInt("0x" + hex.substring(0, 2));
                                        var g = parseInt("0x" + hex.substring(2, 4));
                                        var b = parseInt("0x" + hex.substring(4, 6));
                                        format.c = new RgbColor(r << 16 | g << 8 | b);
                                    }
                                }
                            } else {
                                if ("number" == typeof(color)) {
                                    format.c = new RgbColor(color);
                                } else {
                                    if (color instanceof RgbColor || color instanceof ThemeColor) {
                                        format.c = color;
                                    }
                                }
                            }
                        }
                    }
                    var oNewElem = new CCellValueMultiText();
                    oNewElem.text = item.text;
                    oNewElem.format = new Font();
                    if (null != item.format) {
                        oNewElem.format.set(item.format);
                    }
                    this.multiText.push(oNewElem);
                }
                this.miminizeMultiText(true);
            }
            if (null != this.text) {
                if (this.text.length > 0 && "'" == this.text[0]) {
                    this.cell.setQuotePrefix(true);
                    this.text = this.text.substring(1);
                }
            } else {
                if (null != this.multiText) {
                    if (this.multiText.length > 0) {
                        var oFirstItem = this.multiText[0];
                        if (null != oFirstItem.text && oFirstItem.text.length > 0 && "'" == oFirstItem.text[0]) {
                            this.cell.setQuotePrefix(true);
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
        var oRes = new Array();
        for (var i = 0, length = this.multiText.length; i < length; ++i) {
            oRes.push(this.multiText[i].clone());
        }
        return oRes;
    },
    miminizeMultiText: function (bSetCellFont) {
        var bRes = false;
        if (null == bSetCellFont) {
            bSetCellFont = true;
        }
        if (null != this.multiText && this.multiText.length > 0) {
            var aVal = this.multiText;
            var oIntersectFont = aVal[0].format.clone();
            for (var i = 1, length = aVal.length; i < length; i++) {
                oIntersectFont.intersect(aVal[i].format, g_oDefaultFont);
            }
            if (bSetCellFont) {
                if (oIntersectFont.isEqual(g_oDefaultFont)) {
                    this.cell.setFont(null, false);
                } else {
                    this.cell.setFont(oIntersectFont, false);
                }
            }
            var bIsEqual = true;
            for (var i = 0, length = aVal.length; i < length; i++) {
                if (false == oIntersectFont.isEqual(aVal[i].format)) {
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
    _setFontProp: function (fCheck, fAction) {
        var bRes = false;
        if (null != this.multiText) {
            var bChange = false;
            for (var i = 0, length = this.multiText.length; i < length; ++i) {
                if (true == fCheck(this.multiText[i].format)) {
                    bChange = true;
                    break;
                }
            }
            if (bChange) {
                var backupObj = this.cell.getValueData();
                for (var i = 0, length = this.multiText.length; i < length; ++i) {
                    fAction(this.multiText[i].format);
                }
                var cell = this.cell;
                if (this.miminizeMultiText(false)) {
                    var DataNew = cell.getValueData();
                    History.Add(g_oUndoRedoCell, historyitem_Cell_ChangeValue, cell.ws.getId(), new Asc.Range(0, cell.oId.getRow0(), gc_nMaxCol0, cell.oId.getRow0()), new UndoRedoData_CellSimpleData(cell.oId.getRow0(), cell.oId.getCol0(), backupObj, DataNew));
                } else {
                    var DataNew = this._cloneMultiText();
                    History.Add(g_oUndoRedoCell, historyitem_Cell_ChangeArrayValueFormat, cell.ws.getId(), new Asc.Range(0, cell.oId.getRow0(), gc_nMaxCol0, cell.oId.getRow0()), new UndoRedoData_CellSimpleData(cell.oId.getRow0(), cell.oId.getCol0(), backupObj.value.multiText, DataNew));
                }
            }
            bRes = true;
        }
        return bRes;
    },
    setFontname: function (val) {
        return this._setFontProp(function (format) {
            return val != format.fn;
        },
        function (format) {
            format.fn = val;
        });
    },
    setFontsize: function (val) {
        return this._setFontProp(function (format) {
            return val != format.fs;
        },
        function (format) {
            format.fs = val;
        });
    },
    setFontcolor: function (val) {
        return this._setFontProp(function (format) {
            return val != format.c;
        },
        function (format) {
            format.c = val;
        });
    },
    setBold: function (val) {
        return this._setFontProp(function (format) {
            return val != format.b;
        },
        function (format) {
            format.b = val;
        });
    },
    setItalic: function (val) {
        return this._setFontProp(function (format) {
            return val != format.i;
        },
        function (format) {
            format.i = val;
        });
    },
    setUnderline: function (val) {
        return this._setFontProp(function (format) {
            return val != format.u;
        },
        function (format) {
            format.u = val;
        });
    },
    setStrikeout: function (val) {
        return this._setFontProp(function (format) {
            return val != format.s;
        },
        function (format) {
            format.s = val;
        });
    },
    setFontAlign: function (val) {
        return this._setFontProp(function (format) {
            return val != format.va;
        },
        function (format) {
            format.va = val;
        });
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
function RangeDataManagerElem(bbox, data) {
    this.bbox = bbox;
    this.data = data;
    this.id = 0;
}
function RangeDataManager(bAllowIntersect, fChange) {
    this.oGCells = {};
    this.oRows = {};
    this.oCols = {};
    this.oAll = null;
    this.oElements = {};
    this.nElementsCount = 0;
    this.bbox = null;
    this.nStopRecalculate = 0;
    this.idGen = 0;
    this.oDependenceManager = null;
    this.bAllowIntersect = bAllowIntersect;
    this.fChange = fChange;
}
RangeDataManager.prototype = {
    add: function (bbox, data) {
        var oNewElem = new RangeDataManagerElem(new Asc.Range(bbox.c1, bbox.r1, bbox.c2, bbox.r2), data);
        oNewElem.id = this.idGen++;
        var nRangeType = getRangeType(bbox);
        if (c_oRangeType.Range == nRangeType) {
            for (var i = bbox.r1; i <= bbox.r2; i++) {
                var row = this.oGCells[i];
                if (null == row) {
                    row = {};
                    this.oGCells[i] = row;
                }
                for (var j = bbox.c1; j <= bbox.c2; j++) {
                    if (this.bAllowIntersect) {
                        var elem = row[j];
                        if (null == elem) {
                            elem = [];
                            row[j] = elem;
                        }
                        elem.push(oNewElem);
                    } else {
                        row[j] = oNewElem;
                    }
                }
            }
        } else {
            if (c_oRangeType.Col == nRangeType) {
                for (var i = bbox.c1; i <= bbox.c2; i++) {
                    if (this.bAllowIntersect) {
                        var elem = this.oCols[i];
                        if (null == elem) {
                            elem = [];
                            this.oCols[i] = elem;
                        }
                        elem.push(oNewElem);
                    } else {
                        this.oCols[i] = oNewElem;
                    }
                }
            } else {
                if (c_oRangeType.Row == nRangeType) {
                    for (var i = bbox.r1; i <= bbox.r2; i++) {
                        if (this.bAllowIntersect) {
                            var elem = this.oRows[i];
                            if (null == elem) {
                                elem = [];
                                this.oRows[i] = elem;
                            }
                            elem.push(oNewElem);
                        } else {
                            this.oRows[i] = oNewElem;
                        }
                    }
                } else {
                    if (c_oRangeType.All == nRangeType) {
                        if (this.bAllowIntersect) {
                            this.oAll = [oNewElem];
                        } else {
                            this.oAll = oNewElem;
                        }
                    }
                }
            }
        }
        this.oElements[this._getBBoxIndex(bbox)] = oNewElem;
        this._recalculate();
        if (null != this.fChange) {
            this.fChange.call(this, oNewElem.data, null, oNewElem.bbox);
        }
    },
    _getExecElem: function (elem, oFindElems) {
        if (null != elem) {
            if (this.bAllowIntersect) {
                for (var i = 0, length = elem.length; i < length; ++i) {
                    var item = elem[i];
                    oFindElems[item.id] = item;
                }
            } else {
                oFindElems[elem.id] = elem;
            }
        }
    },
    get: function (bbox) {
        var oRes = {
            all: [],
            inner: [],
            outer: []
        };
        if (null != this.bbox) {
            bbox = this.bbox.intersectionSimple(bbox);
        } else {
            bbox = null;
        }
        if (null != bbox) {
            var oFindElems = {};
            var nRangeType = getRangeType(bbox);
            if (bbox.r2 < gc_nMaxRow0 / 4) {
                for (var i = bbox.r1; i <= bbox.r2; i++) {
                    var row = this.oGCells[i];
                    if (null != row) {
                        if (bbox.c2 < gc_nMaxCol0 / 4) {
                            for (var j = bbox.c1; j <= bbox.c2; j++) {
                                var cell = row[j];
                                if (null != cell) {
                                    this._getExecElem(cell, oFindElems);
                                }
                            }
                        } else {
                            for (var j in row) {
                                var nIndexJ = j - 0;
                                if (bbox.c1 <= nIndexJ && nIndexJ <= bbox.c2) {
                                    this._getExecElem(row[j], oFindElems);
                                }
                            }
                        }
                    }
                }
            } else {
                for (var i in this.oGCells) {
                    var nIndexI = i - 0;
                    if (bbox.r1 <= nIndexI && nIndexI <= bbox.r2) {
                        var row = this.oGCells[i];
                        if (null != row) {
                            if (bbox.c2 < gc_nMaxCol0 / 4) {
                                for (var j = bbox.c1; j <= bbox.c2; j++) {
                                    var cell = row[j];
                                    if (null != cell) {
                                        this._getExecElem(cell, oFindElems);
                                    }
                                }
                            } else {
                                for (var j in row) {
                                    var nIndexJ = j - 0;
                                    if (bbox.c1 <= nIndexJ && nIndexJ <= bbox.c2) {
                                        this._getExecElem(row[j], oFindElems);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (bbox.c2 < gc_nMaxCol0 / 4) {
                for (var i = bbox.c1; i <= bbox.c2; i++) {
                    this._getExecElem(this.oCols[i], oFindElems);
                }
            } else {
                for (var i in this.oCols) {
                    var nIndex = i - 0;
                    if (bbox.c1 <= nIndex && nIndex <= bbox.c2) {
                        this._getExecElem(this.oCols[i], oFindElems);
                    }
                }
            }
            if (bbox.r2 < gc_nMaxRow0 / 4) {
                for (var i = bbox.r1; i <= bbox.r2; i++) {
                    this._getExecElem(this.oRows[i], oFindElems);
                }
            } else {
                for (var i in this.oRows) {
                    var nIndex = i - 0;
                    if (bbox.r1 <= nIndex && nIndex <= bbox.r2) {
                        this._getExecElem(this.oRows[i], oFindElems);
                    }
                }
            }
            this._getExecElem(this.oAll, oFindElems);
            for (var i in oFindElems) {
                var elem = oFindElems[i];
                oRes.all.push(elem);
                if (bbox.containsRange(elem.bbox)) {
                    oRes.inner.push(elem);
                } else {
                    oRes.outer.push(elem);
                }
            }
        }
        return oRes;
    },
    _getByCellExecElem: function (elem) {
        var oRes = null;
        if (null != elem) {
            if (this.bAllowIntersect) {
                if (elem.length > 0) {
                    oRes = elem[0];
                }
            } else {
                oRes = elem;
            }
        }
        return oRes;
    },
    _getByCell: function (nRow, nCol) {
        var oRes = null;
        var row = this.oGCells[nRow];
        if (null != row) {
            oRes = this._getByCellExecElem(row[nCol]);
        }
        if (null == oRes) {
            oRes = this._getByCellExecElem(this.oRows[nRow]);
            if (null == oRes) {
                oRes = this._getByCellExecElem(this.oCols[nCol]);
                if (null == oRes) {
                    oRes = this._getByCellExecElem(this.oAll);
                }
            }
        }
        return oRes;
    },
    getByCell: function (nRow, nCol) {
        var oRes = null;
        if (null != this.bbox) {
            if (this.bbox.contains(nCol, nRow)) {
                oRes = this._getByCell(nRow, nCol);
            }
            if (null == oRes && null != this.oDependenceManager) {
                var oDependence = this.oDependenceManager._getByCell(nRow, nCol);
                if (null != oDependence) {
                    var oTempRes = this.get(oDependence.bbox);
                    if (oTempRes.all.length > 0) {
                        oRes = oTempRes.all[0];
                    }
                }
            }
        }
        return oRes;
    },
    _removeExecElem: function (container, index, elemToDelete) {
        var elem = null;
        if (null != index) {
            elem = container[index];
        } else {
            elem = container;
        }
        if (null != elem) {
            if (this.bAllowIntersect) {
                for (var i = 0, length = elem.length; i < length; ++i) {
                    var item = elem[i];
                    if (elemToDelete.data == item.data) {
                        elem.splice(i, 1);
                        break;
                    }
                }
                if (0 == elem.length) {
                    if (null != index) {
                        delete container[index];
                    } else {
                        container = null;
                    }
                }
            } else {
                if (elemToDelete.data == elem.data) {
                    if (null != index) {
                        delete container[index];
                    } else {
                        container = null;
                    }
                }
            }
        }
        return container;
    },
    remove: function (bbox, elemToDelete) {
        if (null != elemToDelete) {
            var nRangeType = getRangeType(bbox);
            if (c_oRangeType.Range == nRangeType) {
                for (var i = bbox.r1; i <= bbox.r2; i++) {
                    var row = this.oGCells[i];
                    if (null != row) {
                        for (var j = bbox.c1; j <= bbox.c2; j++) {
                            this._removeExecElem(row, j, elemToDelete);
                        }
                    }
                }
            } else {
                if (c_oRangeType.Col == nRangeType) {
                    for (var i = bbox.c1; i <= bbox.c2; i++) {
                        this._removeExecElem(this.oCols, i, elemToDelete);
                    }
                } else {
                    if (c_oRangeType.Row == nRangeType) {
                        for (var i = bbox.r1; i <= bbox.r2; i++) {
                            this._removeExecElem(this.oRows, i, elemToDelete);
                        }
                    } else {
                        if (c_oRangeType.All == nRangeType) {
                            this.oAll = this._removeExecElem(this.oAll, null, elemToDelete);
                        }
                    }
                }
            }
            delete this.oElements[this._getBBoxIndex(elemToDelete.bbox)];
            this._recalculate();
            if (null != this.fChange) {
                this.fChange.call(this, elemToDelete.data, elemToDelete.bbox, null);
            }
        } else {
            this.stopRecalculate();
            var aElems = this.get(bbox);
            for (var i = 0, length = aElems.all.length; i < length; ++i) {
                var elem = aElems.all[i];
                this.remove(elem.bbox, elem);
            }
            this.startRecalculate();
        }
    },
    shiftGet: function (bbox, bHor) {
        var bboxGet = null;
        if (bHor) {
            bboxGet = Asc.Range(bbox.c1, bbox.r1, gc_nMaxCol0, bbox.r2);
        } else {
            bboxGet = Asc.Range(bbox.c1, bbox.r1, bbox.c2, gc_nMaxRow0);
        }
        return {
            bbox: bboxGet,
            elems: this.get(bboxGet)
        };
    },
    shift: function (bbox, bAdd, bHor, oGetRes) {
        this.stopRecalculate();
        if (null == oGetRes) {
            oGetRes = this.shiftGet(bbox, bHor);
        }
        var aToChange = [];
        var elems = oGetRes.elems;
        if (elems.inner.length > 0) {
            var offset = null;
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
            for (var i = 0, length = elems.inner.length; i < length; i++) {
                var elem = elems.inner[i];
                var from = elem.bbox;
                var to = null;
                if (bAdd) {
                    to = elem.bbox.clone();
                    to.setOffset(offset);
                } else {
                    var bboxAsc = Asc.Range(bbox.c1, bbox.r1, bbox.c2, bbox.r2);
                    if (!bboxAsc.containsRange(from)) {
                        to = elem.bbox.clone();
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
                aToChange.push({
                    elem: elem,
                    to: to
                });
            }
        }
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
        for (var i = 0, length = aToChange.length; i < length; ++i) {
            var item = aToChange[i];
            var elem = item.elem;
            this.remove(elem.bbox, elem);
        }
        for (var i = 0, length = aToChange.length; i < length; ++i) {
            var item = aToChange[i];
            if (null != item.to) {
                this.add(item.to, item.elem.data);
            }
        }
        this.startRecalculate();
    },
    getAll: function () {
        return this.oElements;
    },
    setDependenceManager: function (oDependenceManager) {
        this.oDependenceManager = oDependenceManager;
    },
    stopRecalculate: function () {
        this.nStopRecalculate++;
    },
    startRecalculate: function () {
        this.nStopRecalculate--;
        if (this.nStopRecalculate <= 0) {
            this.nStopRecalculate = 0;
            this._recalculate();
        }
    },
    _getBBoxIndex: function (bbox) {
        return bbox.r1 + "-" + bbox.c1 + "-" + bbox.r2 + "-" + bbox.c2;
    },
    _recalculate: function () {
        if (0 == this.nStopRecalculate) {
            this.nElementsCount = 0;
            this.bbox = null;
            for (var i in this.oElements) {
                var elem = this.oElements[i];
                if (null != elem) {
                    this.nElementsCount++;
                    if (null == this.bbox) {
                        this.bbox = elem.bbox.clone();
                    } else {
                        this.bbox.union2(elem.bbox);
                    }
                }
            }
        }
    }
};