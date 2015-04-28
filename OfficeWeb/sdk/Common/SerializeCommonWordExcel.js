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
var c_oSerConstants = {
    ErrorFormat: -2,
    ErrorUnknown: -1,
    ReadOk: 0,
    ReadUnknown: 1,
    ErrorStream: 85
};
var c_oSerPropLenType = {
    Null: 0,
    Byte: 1,
    Short: 2,
    Three: 3,
    Long: 4,
    Double: 5,
    Variable: 6
};
var c_oSer_ColorObjectType = {
    Rgb: 0,
    Type: 1,
    Theme: 2,
    Tint: 3
};
var c_oSer_ColorType = {
    Auto: 0
};
var c_oSerBorderType = {
    Color: 0,
    Space: 1,
    Size: 2,
    Value: 3,
    ColorTheme: 4
};
var c_oSerBordersType = {
    left: 0,
    top: 1,
    right: 2,
    bottom: 3,
    insideV: 4,
    insideH: 5,
    start: 6,
    end: 7,
    tl2br: 8,
    tr2bl: 9,
    bar: 10,
    between: 11
};
var c_oSerPaddingType = {
    left: 0,
    top: 1,
    right: 2,
    bottom: 3
};
var c_oSerShdType = {
    Value: 0,
    Color: 1,
    ColorTheme: 2
};
var g_tabtype_left = 0;
var g_tabtype_right = 1;
var g_tabtype_center = 2;
var g_tabtype_clear = 3;
function OpenColor() {
    this.rgb = null;
    this.auto = null;
    this.theme = null;
    this.tint = null;
}
function BinaryCommonWriter(memory) {
    this.memory = memory;
}
BinaryCommonWriter.prototype.WriteItem = function (type, fWrite) {
    this.memory.WriteByte(type);
    this.WriteItemWithLength(fWrite);
};
BinaryCommonWriter.prototype.WriteItemStart = function (type) {
    this.memory.WriteByte(type);
    return this.WriteItemWithLengthStart(fWrite);
};
BinaryCommonWriter.prototype.WriteItemEnd = function (nStart) {
    this.WriteItemWithLengthEnd(nStart);
};
BinaryCommonWriter.prototype.WriteItemWithLength = function (fWrite) {
    var nStart = this.WriteItemWithLengthStart();
    fWrite();
    this.WriteItemWithLengthEnd(nStart);
};
BinaryCommonWriter.prototype.WriteItemWithLengthStart = function () {
    var nStart = this.memory.GetCurPosition();
    this.memory.Skip(4);
    return nStart;
};
BinaryCommonWriter.prototype.WriteItemWithLengthEnd = function (nStart) {
    var nEnd = this.memory.GetCurPosition();
    this.memory.Seek(nStart);
    this.memory.WriteLong(nEnd - nStart - 4);
    this.memory.Seek(nEnd);
};
BinaryCommonWriter.prototype.WriteBorder = function (border) {
    var _this = this;
    if (null != border.Value) {
        var color = null;
        if (null != border.Color) {
            color = border.Color;
        } else {
            if (null != border.Unifill) {
                var doc = editor.WordControl.m_oLogicDocument;
                border.Unifill.check(doc.Get_Theme(), doc.Get_ColorMap());
                var RGBA = border.Unifill.getRGBAColor();
                color = new CDocumentColor(RGBA.R, RGBA.G, RGBA.B);
            }
        }
        if (null != color && !color.Auto) {
            this.WriteColor(c_oSerBorderType.Color, color);
        }
        if (null != border.Space) {
            this.memory.WriteByte(c_oSerBorderType.Space);
            this.memory.WriteByte(c_oSerPropLenType.Double);
            this.memory.WriteDouble(border.Space);
        }
        if (null != border.Size) {
            this.memory.WriteByte(c_oSerBorderType.Size);
            this.memory.WriteByte(c_oSerPropLenType.Double);
            this.memory.WriteDouble(border.Size);
        }
        if (null != border.Unifill || (null != border.Color && border.Color.Auto)) {
            this.memory.WriteByte(c_oSerBorderType.ColorTheme);
            this.memory.WriteByte(c_oSerPropLenType.Variable);
            this.WriteItemWithLength(function () {
                _this.WriteColorTheme(border.Unifill, border.Color);
            });
        }
        this.memory.WriteByte(c_oSerBorderType.Value);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        this.memory.WriteByte(border.Value);
    }
};
BinaryCommonWriter.prototype.WriteBorders = function (Borders) {
    var oThis = this;
    if (null != Borders.Left) {
        this.WriteItem(c_oSerBordersType.left, function () {
            oThis.WriteBorder(Borders.Left);
        });
    }
    if (null != Borders.Top) {
        this.WriteItem(c_oSerBordersType.top, function () {
            oThis.WriteBorder(Borders.Top);
        });
    }
    if (null != Borders.Right) {
        this.WriteItem(c_oSerBordersType.right, function () {
            oThis.WriteBorder(Borders.Right);
        });
    }
    if (null != Borders.Bottom) {
        this.WriteItem(c_oSerBordersType.bottom, function () {
            oThis.WriteBorder(Borders.Bottom);
        });
    }
    if (null != Borders.InsideV) {
        this.WriteItem(c_oSerBordersType.insideV, function () {
            oThis.WriteBorder(Borders.InsideV);
        });
    }
    if (null != Borders.InsideH) {
        this.WriteItem(c_oSerBordersType.insideH, function () {
            oThis.WriteBorder(Borders.InsideH);
        });
    }
    if (null != Borders.Between) {
        this.WriteItem(c_oSerBordersType.between, function () {
            oThis.WriteBorder(Borders.Between);
        });
    }
};
BinaryCommonWriter.prototype.WriteColor = function (type, color) {
    this.memory.WriteByte(type);
    this.memory.WriteByte(c_oSerPropLenType.Three);
    this.memory.WriteByte(color.r);
    this.memory.WriteByte(color.g);
    this.memory.WriteByte(color.b);
};
BinaryCommonWriter.prototype.WriteShd = function (Shd) {
    var _this = this;
    if (null != Shd.Value) {
        this.memory.WriteByte(c_oSerShdType.Value);
        this.memory.WriteByte(c_oSerPropLenType.Byte);
        this.memory.WriteByte(Shd.Value);
    }
    var color = null;
    if (null != Shd.Color) {
        color = Shd.Color;
    } else {
        if (null != Shd.Unifill) {
            var doc = editor.WordControl.m_oLogicDocument;
            Shd.Unifill.check(doc.Get_Theme(), doc.Get_ColorMap());
            var RGBA = Shd.Unifill.getRGBAColor();
            color = new CDocumentColor(RGBA.R, RGBA.G, RGBA.B);
        }
    }
    if (null != color && !color.Auto) {
        this.WriteColor(c_oSerShdType.Color, color);
    }
    if (null != Shd.Unifill || (null != Shd.Color && Shd.Color.Auto)) {
        this.memory.WriteByte(c_oSerShdType.ColorTheme);
        this.memory.WriteByte(c_oSerPropLenType.Variable);
        this.WriteItemWithLength(function () {
            _this.WriteColorTheme(Shd.Unifill, Shd.Color);
        });
    }
};
BinaryCommonWriter.prototype.WritePaddings = function (Paddings) {
    if (null != Paddings.L) {
        this.memory.WriteByte(c_oSerPaddingType.left);
        this.memory.WriteByte(c_oSerPropLenType.Double);
        this.memory.WriteDouble(Paddings.L);
    }
    if (null != Paddings.T) {
        this.memory.WriteByte(c_oSerPaddingType.top);
        this.memory.WriteByte(c_oSerPropLenType.Double);
        this.memory.WriteDouble(Paddings.T);
    }
    if (null != Paddings.R) {
        this.memory.WriteByte(c_oSerPaddingType.right);
        this.memory.WriteByte(c_oSerPropLenType.Double);
        this.memory.WriteDouble(Paddings.R);
    }
    if (null != Paddings.B) {
        this.memory.WriteByte(c_oSerPaddingType.bottom);
        this.memory.WriteByte(c_oSerPropLenType.Double);
        this.memory.WriteDouble(Paddings.B);
    }
};
BinaryCommonWriter.prototype.WriteColorSpreadsheet = function (color) {
    if (color instanceof ThemeColor) {
        if (null != color.theme) {
            this.memory.WriteByte(c_oSer_ColorObjectType.Theme);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteByte(color.theme);
        }
        if (null != color.tint) {
            this.memory.WriteByte(c_oSer_ColorObjectType.Tint);
            this.memory.WriteByte(c_oSerPropLenType.Double);
            this.memory.WriteDouble2(color.tint);
        }
    } else {
        this.memory.WriteByte(c_oSer_ColorObjectType.Rgb);
        this.memory.WriteByte(c_oSerPropLenType.Long);
        this.memory.WriteLong(color.getRgb());
    }
};
BinaryCommonWriter.prototype.WriteColorTheme = function (unifill, color) {
    if (null != color && color.Auto) {
        this.memory.WriteByte(c_oSer_ColorThemeType.Auto);
        this.memory.WriteByte(c_oSerPropLenType.Null);
    }
    if (null != unifill && null != unifill.fill && null != unifill.fill.color && unifill.fill.color.color instanceof CSchemeColor) {
        var uniColor = unifill.fill.color;
        if (null != uniColor.color) {
            var nFormatId = EThemeColor.themecolorNone;
            switch (uniColor.color.id) {
            case 0:
                nFormatId = EThemeColor.themecolorAccent1;
                break;
            case 1:
                nFormatId = EThemeColor.themecolorAccent2;
                break;
            case 2:
                nFormatId = EThemeColor.themecolorAccent3;
                break;
            case 3:
                nFormatId = EThemeColor.themecolorAccent4;
                break;
            case 4:
                nFormatId = EThemeColor.themecolorAccent5;
                break;
            case 5:
                nFormatId = EThemeColor.themecolorAccent6;
                break;
            case 6:
                nFormatId = EThemeColor.themecolorBackground1;
                break;
            case 7:
                nFormatId = EThemeColor.themecolorBackground2;
                break;
            case 8:
                nFormatId = EThemeColor.themecolorDark1;
                break;
            case 9:
                nFormatId = EThemeColor.themecolorDark2;
                break;
            case 10:
                nFormatId = EThemeColor.themecolorFollowedHyperlink;
                break;
            case 11:
                nFormatId = EThemeColor.themecolorHyperlink;
                break;
            case 12:
                nFormatId = EThemeColor.themecolorLight1;
                break;
            case 13:
                nFormatId = EThemeColor.themecolorLight2;
                break;
            case 14:
                nFormatId = EThemeColor.themecolorNone;
                break;
            case 15:
                nFormatId = EThemeColor.themecolorText1;
                break;
            case 16:
                nFormatId = EThemeColor.themecolorText2;
                break;
            }
            this.memory.WriteByte(c_oSer_ColorThemeType.Color);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteByte(nFormatId);
        }
        if (null != uniColor.Mods) {
            for (var i = 0, length = uniColor.Mods.Mods.length; i < length; ++i) {
                var mod = uniColor.Mods.Mods[i];
                if ("wordTint" == mod.name) {
                    this.memory.WriteByte(c_oSer_ColorThemeType.Tint);
                    this.memory.WriteByte(c_oSerPropLenType.Byte);
                    this.memory.WriteByte(Math.round(mod.val));
                } else {
                    if ("wordShade" == mod.name) {
                        this.memory.WriteByte(c_oSer_ColorThemeType.Shade);
                        this.memory.WriteByte(c_oSerPropLenType.Byte);
                        this.memory.WriteByte(Math.round(mod.val));
                    }
                }
            }
        }
    }
};
function Binary_CommonReader(stream) {
    this.stream = stream;
}
Binary_CommonReader.prototype.ReadTable = function (fReadContent) {
    var res = c_oSerConstants.ReadOk;
    res = this.stream.EnterFrame(4);
    if (c_oSerConstants.ReadOk != res) {
        return res;
    }
    var stLen = this.stream.GetULongLE();
    res = this.stream.EnterFrame(stLen);
    if (c_oSerConstants.ReadOk != res) {
        return res;
    }
    return this.Read1(stLen, fReadContent);
};
Binary_CommonReader.prototype.Read1 = function (stLen, fRead) {
    var res = c_oSerConstants.ReadOk;
    var stCurPos = 0;
    while (stCurPos < stLen) {
        this.stream.bLast = false;
        var type = this.stream.GetUChar();
        var length = this.stream.GetULongLE();
        if (stCurPos + length + 5 >= stLen) {
            this.stream.bLast = true;
        }
        res = fRead(type, length);
        if (res === c_oSerConstants.ReadUnknown) {
            res = this.stream.Skip2(length);
            if (c_oSerConstants.ReadOk != res) {
                return res;
            }
        } else {
            if (res !== c_oSerConstants.ReadOk) {
                return res;
            }
        }
        stCurPos += length + 5;
    }
    return res;
};
Binary_CommonReader.prototype.Read2 = function (stLen, fRead) {
    var res = c_oSerConstants.ReadOk;
    var stCurPos = 0;
    while (stCurPos < stLen) {
        var type = this.stream.GetUChar();
        var lenType = this.stream.GetUChar();
        var nCurPosShift = 2;
        var nRealLen;
        switch (lenType) {
        case c_oSerPropLenType.Null:
            nRealLen = 0;
            break;
        case c_oSerPropLenType.Byte:
            nRealLen = 1;
            break;
        case c_oSerPropLenType.Short:
            nRealLen = 2;
            break;
        case c_oSerPropLenType.Three:
            nRealLen = 3;
            break;
        case c_oSerPropLenType.Long:
            case c_oSerPropLenType.Double:
            nRealLen = 4;
            break;
        case c_oSerPropLenType.Variable:
            nRealLen = this.stream.GetULongLE();
            nCurPosShift += 4;
            break;
        default:
            return c_oSerConstants.ErrorUnknown;
        }
        res = fRead(type, nRealLen);
        if (res === c_oSerConstants.ReadUnknown) {
            res = this.stream.Skip2(nRealLen);
            if (c_oSerConstants.ReadOk != res) {
                return res;
            }
        } else {
            if (res !== c_oSerConstants.ReadOk) {
                return res;
            }
        }
        stCurPos += nRealLen + nCurPosShift;
    }
    return res;
};
Binary_CommonReader.prototype.Read2Spreadsheet = function (stLen, fRead) {
    var res = c_oSerConstants.ReadOk;
    var stCurPos = 0;
    while (stCurPos < stLen) {
        var type = this.stream.GetUChar();
        var lenType = this.stream.GetUChar();
        var nCurPosShift = 2;
        var nRealLen;
        switch (lenType) {
        case c_oSerPropLenType.Null:
            nRealLen = 0;
            break;
        case c_oSerPropLenType.Byte:
            nRealLen = 1;
            break;
        case c_oSerPropLenType.Short:
            nRealLen = 2;
            break;
        case c_oSerPropLenType.Three:
            nRealLen = 3;
            break;
        case c_oSerPropLenType.Long:
            nRealLen = 4;
            break;
        case c_oSerPropLenType.Double:
            nRealLen = 8;
            break;
        case c_oSerPropLenType.Variable:
            nRealLen = this.stream.GetULongLE();
            nCurPosShift += 4;
            break;
        default:
            return c_oSerConstants.ErrorUnknown;
        }
        res = fRead(type, nRealLen);
        if (res === c_oSerConstants.ReadUnknown) {
            res = this.stream.Skip2(nRealLen);
            if (c_oSerConstants.ReadOk != res) {
                return res;
            }
        } else {
            if (res !== c_oSerConstants.ReadOk) {
                return res;
            }
        }
        stCurPos += nRealLen + nCurPosShift;
    }
    return res;
};
Binary_CommonReader.prototype.ReadDouble = function () {
    var dRes = 0;
    dRes |= this.stream.GetUChar();
    dRes |= this.stream.GetUChar() << 8;
    dRes |= this.stream.GetUChar() << 16;
    dRes |= this.stream.GetUChar() << 24;
    dRes /= 100000;
    return dRes;
};
Binary_CommonReader.prototype.ReadColor = function () {
    var r = this.stream.GetUChar();
    var g = this.stream.GetUChar();
    var b = this.stream.GetUChar();
    return new CDocumentColor(r, g, b);
};
Binary_CommonReader.prototype.ReadShd = function (type, length, Shd, themeColor) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    switch (type) {
    case c_oSerShdType.Value:
        Shd.Value = this.stream.GetUChar();
        break;
    case c_oSerShdType.Color:
        Shd.Color = this.ReadColor();
        break;
    case c_oSerShdType.ColorTheme:
        res = this.Read2(length, function (t, l) {
            return oThis.ReadColorTheme(t, l, themeColor);
        });
        break;
    default:
        res = c_oSerConstants.ReadUnknown;
        break;
    }
    return res;
};
Binary_CommonReader.prototype.ReadColorSpreadsheet = function (type, length, color) {
    var res = c_oSerConstants.ReadOk;
    if (c_oSer_ColorObjectType.Type == type) {
        color.auto = (c_oSer_ColorType.Auto == this.stream.GetUChar());
    } else {
        if (c_oSer_ColorObjectType.Rgb == type) {
            color.rgb = 16777215 & this.stream.GetULongLE();
        } else {
            if (c_oSer_ColorObjectType.Theme == type) {
                color.theme = this.stream.GetUChar();
            } else {
                if (c_oSer_ColorObjectType.Tint == type) {
                    color.tint = this.stream.GetDoubleLE();
                } else {
                    res = c_oSerConstants.ReadUnknown;
                }
            }
        }
    }
    return res;
};
Binary_CommonReader.prototype.ReadColorTheme = function (type, length, color) {
    var res = c_oSerConstants.ReadOk;
    if (c_oSer_ColorThemeType.Auto == type) {
        color.Auto = true;
    } else {
        if (c_oSer_ColorThemeType.Color == type) {
            color.Color = this.stream.GetByte();
        } else {
            if (c_oSer_ColorThemeType.Tint == type) {
                color.Tint = this.stream.GetByte();
            } else {
                if (c_oSer_ColorThemeType.Shade == type) {
                    color.Shade = this.stream.GetByte();
                } else {
                    res = c_oSerConstants.ReadUnknown;
                }
            }
        }
    }
    return res;
};
function FT_Stream2(data, size) {
    this.obj = null;
    this.data = data;
    this.size = size;
    this.pos = 0;
    this.cur = 0;
    this.bLast = false;
}
FT_Stream2.prototype.Seek = function (_pos) {
    if (_pos > this.size) {
        return c_oSerConstants.ErrorStream;
    }
    this.pos = _pos;
    return c_oSerConstants.ReadOk;
};
FT_Stream2.prototype.Seek2 = function (_cur) {
    if (_cur > this.size) {
        return c_oSerConstants.ErrorStream;
    }
    this.cur = _cur;
    return c_oSerConstants.ReadOk;
};
FT_Stream2.prototype.Skip = function (_skip) {
    if (_skip < 0) {
        return c_oSerConstants.ErrorStream;
    }
    return this.Seek(this.pos + _skip);
};
FT_Stream2.prototype.Skip2 = function (_skip) {
    if (_skip < 0) {
        return c_oSerConstants.ErrorStream;
    }
    return this.Seek2(this.cur + _skip);
};
FT_Stream2.prototype.GetUChar = function () {
    if (this.cur >= this.size) {
        return 0;
    }
    return this.data[this.cur++];
};
FT_Stream2.prototype.GetByte = function () {
    return this.GetUChar();
};
FT_Stream2.prototype.GetBool = function () {
    var Value = this.GetUChar();
    return (Value == 0 ? false : true);
};
FT_Stream2.prototype.GetUShortLE = function () {
    if (this.cur + 1 >= this.size) {
        return 0;
    }
    return (this.data[this.cur++] | this.data[this.cur++] << 8);
};
FT_Stream2.prototype.GetULongLE = function () {
    if (this.cur + 3 >= this.size) {
        return 0;
    }
    return (this.data[this.cur++] | this.data[this.cur++] << 8 | this.data[this.cur++] << 16 | this.data[this.cur++] << 24);
};
FT_Stream2.prototype.GetLongLE = function () {
    return this.GetULongLE();
};
FT_Stream2.prototype.GetLong = function () {
    return this.GetULongLE();
};
FT_Stream2.prototype.GetDoubleLE = function () {
    if (this.cur + 7 >= this.size) {
        return 0;
    }
    var arr = [];
    for (var i = 0; i < 8; ++i) {
        arr.push(this.GetUChar());
    }
    return this.doubleDecodeLE754(arr);
};
FT_Stream2.prototype.doubleDecodeLE754 = function (a) {
    var s, e, m, i, d, nBits, mLen, eLen, eBias, eMax;
    var el = {
        len: 8,
        mLen: 52,
        rt: 0
    };
    mLen = el.mLen,
    eLen = el.len * 8 - el.mLen - 1,
    eMax = (1 << eLen) - 1,
    eBias = eMax >> 1;
    i = (el.len - 1);
    d = -1;
    s = a[i];
    i += d;
    nBits = -7;
    for (e = s & ((1 << (-nBits)) - 1), s >>= (-nBits), nBits += eLen; nBits > 0; e = e * 256 + a[i], i += d, nBits -= 8) {}
    for (m = e & ((1 << (-nBits)) - 1), e >>= (-nBits), nBits += mLen; nBits > 0; m = m * 256 + a[i], i += d, nBits -= 8) {}
    switch (e) {
    case 0:
        e = 1 - eBias;
        break;
    case eMax:
        return m ? NaN : ((s ? -1 : 1) * Infinity);
    default:
        m = m + Math.pow(2, mLen);
        e = e - eBias;
        break;
    }
    return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
};
FT_Stream2.prototype.GetUOffsetLE = function () {
    if (this.cur + 2 >= this.size) {
        return c_oSerConstants.ReadOk;
    }
    return (this.data[this.cur++] | this.data[this.cur++] << 8 | this.data[this.cur++] << 16);
};
FT_Stream2.prototype.GetString2 = function () {
    var Len = this.GetLong();
    return this.GetString2LE(Len);
};
FT_Stream2.prototype.GetString2LE = function (len) {
    if (this.cur + len > this.size) {
        return "";
    }
    var a = [];
    for (var i = 0; i + 1 < len; i += 2) {
        a.push(String.fromCharCode(this.data[this.cur + i] | this.data[this.cur + i + 1] << 8));
    }
    this.cur += len;
    return a.join("");
};
FT_Stream2.prototype.GetString = function () {
    var Len = this.GetLong();
    if (this.cur + 2 * Len > this.size) {
        return "";
    }
    var t = "";
    for (var i = 0; i + 1 < 2 * Len; i += 2) {
        var uni = this.data[this.cur + i];
        uni |= this.data[this.cur + i + 1] << 8;
        t += String.fromCharCode(uni);
    }
    this.cur += 2 * Len;
    return t;
};
FT_Stream2.prototype.GetCurPos = function () {
    return this.cur;
};
FT_Stream2.prototype.GetSize = function () {
    return this.size;
};
FT_Stream2.prototype.EnterFrame = function (count) {
    if (this.size - this.pos < count) {
        return c_oSerConstants.ErrorStream;
    }
    this.cur = this.pos;
    this.pos += count;
    return c_oSerConstants.ReadOk;
};
FT_Stream2.prototype.GetDouble = function () {
    var dRes = 0;
    dRes |= this.GetUChar();
    dRes |= this.GetUChar() << 8;
    dRes |= this.GetUChar() << 16;
    dRes |= this.GetUChar() << 24;
    dRes /= 100000;
    return dRes;
};
var gc_nMaxRow = 1048576;
var gc_nMaxCol = 16384;
var gc_nMaxRow0 = gc_nMaxRow - 1;
var gc_nMaxCol0 = gc_nMaxCol - 1;
function CellAddressUtils() {
    this._oCodeA = "A".charCodeAt(0);
    this._aColnumToColstr = [];
    this.oCellAddressCache = {};
    this.colnumToColstrFromWsView = function (col) {
        var sResult = this._aColnumToColstr[col];
        if (null != sResult) {
            return sResult;
        }
        if (col == 0) {
            return "";
        }
        var col0 = col - 1;
        var text = String.fromCharCode(65 + (col0 % 26));
        return (this._aColnumToColstr[col] = (col0 < 26 ? text : this.colnumToColstrFromWsView(Math.floor(col0 / 26)) + text));
    };
    this.colnumToColstr = function (num) {
        var sResult = this._aColnumToColstr[num];
        if (!sResult) {
            sResult = "";
            if (num > 0) {
                var columnNumber = num;
                var currentLetterNumber;
                while (columnNumber > 0) {
                    currentLetterNumber = (columnNumber - 1) % 26;
                    sResult = String.fromCharCode(currentLetterNumber + 65) + sResult;
                    columnNumber = (columnNumber - (currentLetterNumber + 1)) / 26;
                }
            }
            this._aColnumToColstr[num] = sResult;
        }
        return sResult;
    };
    this.colstrToColnum = function (col_str) {
        var col_num = 0;
        for (var i = 0; i < col_str.length; ++i) {
            col_num = 26 * col_num + (col_str.charCodeAt(i) - this._oCodeA + 1);
        }
        return col_num;
    };
    this.getCellId = function (row, col) {
        return g_oCellAddressUtils.colnumToColstr(col + 1) + (row + 1);
    };
    this.getCellAddress = function (sId) {
        var oRes = this.oCellAddressCache[sId];
        if (null == oRes) {
            oRes = new CellAddress(sId);
            this.oCellAddressCache[sId] = oRes;
        }
        return oRes;
    };
}
var g_oCellAddressUtils = new CellAddressUtils();
function CellAddress() {
    var argc = arguments.length;
    this._valid = true;
    this._invalidId = false;
    this._invalidCoord = false;
    this.id = null;
    this.row = null;
    this.col = null;
    this.bRowAbs = false;
    this.bColAbs = false;
    this.bIsCol = false;
    this.bIsRow = false;
    this.colLetter = null;
    if (1 == argc) {
        this.id = arguments[0].toUpperCase();
        this._invalidCoord = true;
        this._checkId();
    } else {
        if (2 == argc) {
            this.row = arguments[0];
            this.col = arguments[1];
            this._checkCoord();
            this._invalidId = true;
        } else {
            if (3 == argc) {
                this.row = arguments[0] + 1;
                this.col = arguments[1] + 1;
                this._checkCoord();
                this._invalidId = true;
            }
        }
    }
}
CellAddress.prototype._isDigit = function (symbol) {
    return "0" <= symbol && symbol <= "9";
};
CellAddress.prototype._isAlpha = function (symbol) {
    return "A" <= symbol && symbol <= "Z";
};
CellAddress.prototype._checkId = function () {
    this._invalidCoord = true;
    this._recalculate(true, false);
    this._checkCoord();
};
CellAddress.prototype._checkCoord = function () {
    if (! (this.row >= 1 && this.row <= gc_nMaxRow)) {
        this._valid = false;
    } else {
        if (! (this.col >= 1 && this.col <= gc_nMaxCol)) {
            this._valid = false;
        } else {
            this._valid = true;
        }
    }
};
CellAddress.prototype._recalculate = function (bCoord, bId) {
    if (bCoord && this._invalidCoord) {
        this._invalidCoord = false;
        var sId = this.id;
        this.row = this.col = 0;
        var indexes = {},
        i = -1,
        indexesCount = 0;
        while ((i = sId.indexOf("$", i + 1)) != -1) {
            indexes[i - indexesCount++] = 1;
        }
        if (indexesCount <= 2) {
            if (indexesCount > 0) {
                sId = sId.replace(/\$/g, "");
            }
            var nIdLength = sId.length;
            if (nIdLength > 0) {
                var nIndex = 0;
                while (this._isAlpha(sId.charAt(nIndex)) && nIndex < nIdLength) {
                    nIndex++;
                }
                if (0 == nIndex) {
                    this.bIsRow = true;
                    this.col = 1;
                    this.colLetter = g_oCellAddressUtils.colnumToColstr(this.col);
                    this.row = sId.substring(nIndex) - 0;
                    if (null != indexes[0]) {
                        this.bRowAbs = true;
                        indexesCount--;
                    }
                } else {
                    if (nIndex == nIdLength) {
                        this.bIsCol = true;
                        this.colLetter = sId;
                        this.col = g_oCellAddressUtils.colstrToColnum(this.colLetter);
                        this.row = 1;
                        if (null != indexes[0]) {
                            this.bColAbs = true;
                            indexesCount--;
                        }
                    } else {
                        this.colLetter = sId.substring(0, nIndex);
                        this.col = g_oCellAddressUtils.colstrToColnum(this.colLetter);
                        this.row = sId.substring(nIndex) - 0;
                        if (null != indexes[0]) {
                            this.bColAbs = true;
                            indexesCount--;
                        }
                        if (null != indexes[nIndex]) {
                            this.bRowAbs = true;
                            indexesCount--;
                        }
                    }
                }
                if (indexesCount > 0) {
                    this.row = this.col = 0;
                }
            }
        }
    } else {
        if (bId && this._invalidId) {
            this._invalidId = false;
            this.colLetter = g_oCellAddressUtils.colnumToColstr(this.col);
            if (this.bIsCol) {
                this.id = this.colLetter;
            } else {
                if (this.bIsRow) {
                    this.id = this.row;
                } else {
                    this.id = this.colLetter + this.row;
                }
            }
        }
    }
};
CellAddress.prototype.isValid = function () {
    return this._valid;
};
CellAddress.prototype.getID = function () {
    this._recalculate(false, true);
    return this.id;
};
CellAddress.prototype.getIDAbsolute = function () {
    this._recalculate(true, false);
    return "$" + this.getColLetter() + "$" + this.getRow();
};
CellAddress.prototype.getRow = function () {
    this._recalculate(true, false);
    return this.row;
};
CellAddress.prototype.getRow0 = function () {
    this._recalculate(true, false);
    return this.row - 1;
};
CellAddress.prototype.getRowAbs = function () {
    this._recalculate(true, false);
    return this.bRowAbs;
};
CellAddress.prototype.getIsRow = function () {
    this._recalculate(true, false);
    return this.bIsRow;
};
CellAddress.prototype.getCol = function () {
    this._recalculate(true, false);
    return this.col;
};
CellAddress.prototype.getCol0 = function () {
    this._recalculate(true, false);
    return this.col - 1;
};
CellAddress.prototype.getColAbs = function () {
    this._recalculate(true, false);
    return this.bColAbs;
};
CellAddress.prototype.getIsCol = function () {
    this._recalculate(true, false);
    return this.bIsCol;
};
CellAddress.prototype.getColLetter = function () {
    this._recalculate(false, true);
    return this.colLetter;
};
CellAddress.prototype.setRow = function (val) {
    if (! (this.row >= 0 && this.row <= gc_nMaxRow)) {
        this._valid = false;
    }
    this._invalidId = true;
    this.row = val;
};
CellAddress.prototype.setCol = function (val) {
    if (! (val >= 0 && val <= gc_nMaxCol)) {
        return;
    }
    this._invalidId = true;
    this.col = val;
};
CellAddress.prototype.setId = function (val) {
    this._invalidCoord = true;
    this.id = val;
    this._checkId();
};
CellAddress.prototype.moveRow = function (diff) {
    var val = this.row + diff;
    if (! (val >= 0 && val <= gc_nMaxRow)) {
        return;
    }
    this._invalidId = true;
    this.row = val;
};
CellAddress.prototype.moveCol = function (diff) {
    var val = this.col + diff;
    if (! (val >= 0 && val <= gc_nMaxCol)) {
        return;
    }
    this._invalidId = true;
    this.col = val;
};
function isRealObject(obj) {
    return obj !== null && typeof obj === "object";
}