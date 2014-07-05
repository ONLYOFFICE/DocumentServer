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
    this.WriteItem = function (type, fWrite) {
        this.memory.WriteByte(type);
        this.WriteItemWithLength(fWrite);
    };
    this.WriteItemStart = function (type) {
        this.memory.WriteByte(type);
        return this.WriteItemWithLengthStart(fWrite);
    };
    this.WriteItemEnd = function (nStart) {
        this.WriteItemWithLengthEnd(nStart);
    };
    this.WriteItemWithLength = function (fWrite) {
        var nStart = this.WriteItemWithLengthStart();
        fWrite();
        this.WriteItemWithLengthEnd(nStart);
    };
    this.WriteItemWithLengthStart = function () {
        var nStart = this.memory.GetCurPosition();
        this.memory.Skip(4);
        return nStart;
    };
    this.WriteItemWithLengthEnd = function (nStart) {
        var nEnd = this.memory.GetCurPosition();
        this.memory.Seek(nStart);
        this.memory.WriteLong(nEnd - nStart - 4);
        this.memory.Seek(nEnd);
    };
    this.WriteBorder = function (border) {
        if (border_None != border.Value) {
            if (null != border.Color) {
                this.WriteColor(c_oSerBorderType.Color, border.Color);
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
        }
        if (null != border.Value) {
            this.memory.WriteByte(c_oSerBorderType.Value);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteByte(border.Value);
        }
    };
    this.WriteBorders = function (Borders) {
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
    this.WriteColor = function (type, color) {
        this.memory.WriteByte(type);
        this.memory.WriteByte(c_oSerPropLenType.Three);
        this.memory.WriteByte(color.r);
        this.memory.WriteByte(color.g);
        this.memory.WriteByte(color.b);
    };
    this.WriteShd = function (Shd) {
        if (null != Shd.Value) {
            this.memory.WriteByte(c_oSerShdType.Value);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteByte(Shd.Value);
        }
        if (null != Shd.Color) {
            this.WriteColor(c_oSerShdType.Color, Shd.Color);
        }
    };
    this.WritePaddings = function (Paddings) {
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
    this.WriteColorSpreadsheet = function (color) {
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
}
function Binary_CommonReader(stream) {
    this.stream = stream;
    this.ReadTable = function (fReadContent) {
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
    this.Read1 = function (stLen, fRead) {
        var res = c_oSerConstants.ReadOk;
        var stCurPos = 0;
        while (stCurPos < stLen) {
            var type = this.stream.GetUChar();
            var length = this.stream.GetULongLE();
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
    this.Read2 = function (stLen, fRead) {
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
    this.Read2Spreadsheet = function (stLen, fRead) {
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
    this.ReadDouble = function () {
        var dRes = 0;
        dRes |= this.stream.GetUChar();
        dRes |= this.stream.GetUChar() << 8;
        dRes |= this.stream.GetUChar() << 16;
        dRes |= this.stream.GetUChar() << 24;
        dRes /= 100000;
        return dRes;
    };
    this.ReadColor = function () {
        var r = this.stream.GetUChar();
        var g = this.stream.GetUChar();
        var b = this.stream.GetUChar();
        return new CDocumentColor(r, g, b);
    };
    this.ReadShd = function (type, length, Shd) {
        var res = c_oSerConstants.ReadOk;
        switch (type) {
        case c_oSerShdType.Value:
            Shd.Value = this.stream.GetUChar();
            break;
        case c_oSerShdType.Color:
            Shd.Color = this.ReadColor();
            break;
        default:
            res = c_oSerConstants.ReadUnknown;
            break;
        }
        return res;
    };
    this.ReadColorSpreadsheet = function (type, length, color) {
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
}
function FT_Stream2(data, size) {
    this.obj = null;
    this.data = data;
    this.size = size;
    this.pos = 0;
    this.cur = 0;
    this.Seek = function (_pos) {
        if (_pos > this.size) {
            return c_oSerConstants.ErrorStream;
        }
        this.pos = _pos;
        return c_oSerConstants.ReadOk;
    };
    this.Seek2 = function (_cur) {
        if (_cur > this.size) {
            return c_oSerConstants.ErrorStream;
        }
        this.cur = _cur;
        return c_oSerConstants.ReadOk;
    };
    this.Skip = function (_skip) {
        if (_skip < 0) {
            return c_oSerConstants.ErrorStream;
        }
        return this.Seek(this.pos + _skip);
    };
    this.Skip2 = function (_skip) {
        if (_skip < 0) {
            return c_oSerConstants.ErrorStream;
        }
        return this.Seek2(this.cur + _skip);
    };
    this.GetUChar = function () {
        if (this.cur >= this.size) {
            return 0;
        }
        return this.data[this.cur++];
    };
    this.GetByte = function () {
        return this.GetUChar();
    };
    this.GetBool = function () {
        var Value = this.GetUChar();
        return (Value == 0 ? false : true);
    };
    this.GetUShortLE = function () {
        if (this.cur + 1 >= this.size) {
            return 0;
        }
        return (this.data[this.cur++] | this.data[this.cur++] << 8);
    };
    this.GetULongLE = function () {
        if (this.cur + 3 >= this.size) {
            return 0;
        }
        return (this.data[this.cur++] | this.data[this.cur++] << 8 | this.data[this.cur++] << 16 | this.data[this.cur++] << 24);
    };
    this.GetLongLE = function () {
        return this.GetULongLE();
    };
    this.GetLong = function () {
        return this.GetULongLE();
    };
    this.GetDoubleLE = function () {
        if (this.cur + 7 >= this.size) {
            return 0;
        }
        var arr = new Array();
        for (var i = 0; i < 8; ++i) {
            arr.push(this.GetUChar());
        }
        var dRes = this.doubleDecodeLE754(arr);
        return dRes;
    };
    this.doubleDecodeLE754 = function (a) {
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
    this.GetUOffsetLE = function () {
        if (this.cur + 2 >= this.size) {
            return c_oSerConstants.ReadOk;
        }
        return (this.data[this.cur++] | this.data[this.cur++] << 8 | this.data[this.cur++] << 16);
    };
    this.GetString2 = function () {
        var Len = this.GetLong();
        return this.GetString2LE(Len);
    };
    this.GetString2LE = function (len) {
        if (this.cur + len > this.size) {
            return "";
        }
        var t = "";
        for (var i = 0; i + 1 < len; i += 2) {
            var uni = this.data[this.cur + i];
            uni |= this.data[this.cur + i + 1] << 8;
            t += String.fromCharCode(uni);
        }
        this.cur += len;
        return t;
    };
    this.GetString = function () {
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
    this.GetCurPos = function () {
        return this.cur;
    };
    this.GetSize = function () {
        return this.size;
    };
    this.EnterFrame = function (count) {
        if (this.size - this.pos < count) {
            return c_oSerConstants.ErrorStream;
        }
        this.cur = this.pos;
        this.pos += count;
        return c_oSerConstants.ReadOk;
    };
    this.GetDouble = function () {
        var dRes = 0;
        dRes |= this.GetUChar();
        dRes |= this.GetUChar() << 8;
        dRes |= this.GetUChar() << 16;
        dRes |= this.GetUChar() << 24;
        dRes /= 100000;
        return dRes;
    };
}
var gc_nMaxRow = 1048576;
var gc_nMaxCol = 16384;
var gc_nMaxRow0 = gc_nMaxRow - 1;
var gc_nMaxCol0 = gc_nMaxCol - 1;
function CellAddressUtils() {
    this._oCodeA = "A".charCodeAt();
    this._aColnumToColstr = new Array();
    this.colnumToColstr = function (num) {
        var sResult = this._aColnumToColstr[num];
        if (!sResult) {
            if (num == 0) {
                return "";
            }
            var val = "";
            var sResult = "";
            var n = num - 1;
            if (n >= 702) {
                val = (Math.floor(n / 676) - 1) % 26;
                sResult += String.fromCharCode(val + 65);
            }
            if (n >= 26) {
                val = (Math.floor(n / 26) - 1) % 26;
                sResult += String.fromCharCode(val + 65);
            }
            sResult += String.fromCharCode((n % 26) + 65);
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
        var nIndex = 0;
        var nIdLength = this.id.length;
        while (this._isAlpha(this.id.charAt(nIndex)) && nIndex < nIdLength) {
            nIndex++;
        }
        if (0 == nIndex) {
            this.col = gc_nMaxCol;
            this.colLetter = g_oCellAddressUtils.colnumToColstr(this.col);
            this.row = this.id.substring(nIndex) - 0;
            this.id = this.colLetter + this.row;
        } else {
            if (nIndex == nIdLength) {
                this.colLetter = this.id;
                this.col = g_oCellAddressUtils.colstrToColnum(this.colLetter);
                this.row = gc_nMaxRow;
                this.id = this.colLetter + this.row;
            } else {
                this.colLetter = this.id.substring(0, nIndex);
                this.col = g_oCellAddressUtils.colstrToColnum(this.colLetter);
                this.row = this.id.substring(nIndex) - 0;
            }
        }
    } else {
        if (bId && this._invalidId) {
            this._invalidId = false;
            this.colLetter = g_oCellAddressUtils.colnumToColstr(this.col);
            this.id = this.colLetter + this.row;
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
CellAddress.prototype.getCol = function () {
    this._recalculate(true, false);
    return this.col;
};
CellAddress.prototype.getCol0 = function () {
    this._recalculate(true, false);
    return this.col - 1;
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
var c_oSer_DrawingType = {
    Type: 0,
    From: 1,
    To: 2,
    Pos: 3,
    Pic: 4,
    PicSrc: 5,
    GraphicFrame: 6,
    Chart: 7,
    Ext: 8,
    pptxDrawing: 9
};
var c_oSer_ChartType = {
    Legend: 0,
    Title: 1,
    PlotArea: 2,
    Style: 3,
    TitlePptx: 4,
    ShowBorder: 5,
    SpPr: 6
};
var c_oSer_ChartTitlePptxType = {
    TxPptx: 0,
    TxPrPptx: 1
};
var c_oSer_ChartLegendType = {
    LegendPos: 0,
    Overlay: 1,
    Layout: 2,
    LegendEntry: 3,
    TxPrPptx: 4
};
var c_oSer_ChartLegendEntryType = {
    Delete: 0,
    Index: 1,
    TxPrPptx: 2
};
var c_oSer_ChartLegendLayoutType = {
    H: 0,
    HMode: 1,
    LayoutTarget: 2,
    W: 3,
    WMode: 4,
    X: 5,
    XMode: 6,
    Y: 7,
    YMode: 8
};
var c_oSer_ChartPlotAreaType = {
    CatAx: 0,
    ValAx: 1,
    SerAx: 2,
    ValAxPos: 3,
    BasicChart: 4
};
var c_oSer_ChartCatAxType = {
    Title: 0,
    MajorGridlines: 1,
    Delete: 2,
    AxPos: 3,
    TitlePptx: 4,
    TxPrPptx: 6
};
var c_oSer_BasicChartType = {
    Type: 0,
    BarDerection: 1,
    Grouping: 2,
    Overlap: 3,
    Series: 4,
    Seria: 5,
    DataLabels: 6
};
var c_oSer_ChartSeriesType = {
    Val: 0,
    Tx: 1,
    Marker: 2,
    OutlineColor: 3,
    xVal: 4,
    TxRef: 5,
    Index: 6,
    Order: 7,
    DataLabels: 8,
    SpPr: 9,
    Cat: 10
};
var c_oSer_ChartSeriesMarkerType = {
    Size: 0,
    Symbol: 1
};
var c_oSer_ChartSeriesDataLabelsType = {
    ShowVal: 0,
    TxPrPptx: 1,
    ShowCatName: 2
};
var c_oSer_ChartSeriesNumCacheType = {
    Formula: 0,
    NumCache: 1,
    NumCacheVal: 2,
    NumCacheIndex: 3,
    NumCache2: 4,
    NumCacheItem: 5
};
var EChartAxPos = {
    chartaxposLeft: 0,
    chartaxposTop: 1,
    chartaxposRight: 2,
    chartaxposBottom: 3
};
var EChartLegendPos = {
    chartlegendposLeft: 0,
    chartlegendposTop: 1,
    chartlegendposRight: 2,
    chartlegendposBottom: 3,
    chartlegendposRightTop: 4
};
var EChartBasicTypes = {
    chartbasicBarChart: 0,
    chartbasicBar3DChart: 1,
    chartbasicLineChart: 2,
    chartbasicLine3DChart: 3,
    chartbasicAreaChart: 4,
    chartbasicPieChart: 5,
    chartbasicBubbleChart: 6,
    chartbasicScatterChart: 7,
    chartbasicRadarChart: 8,
    chartbasicDoughnutChart: 9,
    chartbasicStockChart: 10,
    chartbasicArea3DChart: 11,
    chartbasicPie3DChart: 12,
    chartbasicSurfaceChart: 13,
    chartbasicSurface3DChart: 14
};
var EChartBarDerection = {
    chartbardirectionBar: 0,
    chartbardirectionCol: 1
};
var EChartBarGrouping = {
    chartbargroupingClustered: 0,
    chartbargroupingPercentStacked: 1,
    chartbargroupingStacked: 2,
    chartbargroupingStandard: 3
};
var EChartSymbol = {
    chartsymbolCircle: 0,
    chartsymbolDash: 1,
    chartsymbolDiamond: 2,
    chartsymbolDot: 3,
    chartsymbolNone: 4,
    chartsymbolPicture: 5,
    chartsymbolPlus: 6,
    chartsymbolSquare: 7,
    chartsymbolStare: 8,
    chartsymbolStar: 9,
    chartsymbolTriangle: 10,
    chartsymbolX: 11
};
function BinaryChartWriter(memory) {
    this.memory = memory;
    this.bs = new BinaryCommonWriter(this.memory);
    this.Write = function (chartAsGroup) {
        var oThis = this;
        this.bs.WriteItem(c_oSer_DrawingType.Chart, function () {
            oThis.WriteChartContent(chartAsGroup);
        });
    };
    this.WriteChartContent = function (chartAsGroup) {
        var oThis = this;
        var chart = chartAsGroup.chart;
        if (null != chart.legend && true == chart.legend.bShow) {
            this.bs.WriteItem(c_oSer_ChartType.Legend, function () {
                oThis.WriteLegend(chart.legend);
            });
        }
        if (null != chartAsGroup.chartTitle && null != chartAsGroup.chartTitle.txBody) {
            this.bs.WriteItem(c_oSer_ChartType.TitlePptx, function () {
                oThis.WriteTitlePptx(chartAsGroup.chartTitle.txBody, chart.header.bDefaultTitle);
            });
        }
        this.bs.WriteItem(c_oSer_ChartType.PlotArea, function () {
            oThis.WritePlotArea(chartAsGroup);
        });
        if (null != chart.styleId) {
            this.bs.WriteItem(c_oSer_ChartType.Style, function () {
                oThis.memory.WriteLong(chart.styleId);
            });
        }
        if (null != chart.bShowBorder && false == chart.bShowBorder) {
            var oFill = new CUniFill();
            oFill.fill = new CNoFill();
            var oLn = new CLn();
            oLn.Fill = oFill;
            var oTempSpPr = new CSpPr();
            oTempSpPr.ln = oLn;
            this.bs.WriteItem(c_oSer_ChartType.SpPr, function () {
                window.global_pptx_content_writer.WriteSpPr(oThis.memory, oTempSpPr);
            });
        }
    };
    this.WriteLegend = function (legend) {
        var oThis = this;
        if (null != legend.position) {
            var byteLegendPos = null;
            switch (legend.position) {
            case c_oAscChartLegend.left:
                byteLegendPos = EChartLegendPos.chartlegendposLeft;
                break;
            case c_oAscChartLegend.right:
                byteLegendPos = EChartLegendPos.chartlegendposRight;
                break;
            case c_oAscChartLegend.top:
                byteLegendPos = EChartLegendPos.chartlegendposTop;
                break;
            case c_oAscChartLegend.bottom:
                byteLegendPos = EChartLegendPos.chartlegendposBottom;
                break;
            }
            if (null != byteLegendPos) {
                this.bs.WriteItem(c_oSer_ChartLegendType.LegendPos, function () {
                    oThis.memory.WriteByte(byteLegendPos);
                });
            }
        }
        if (null != legend.bOverlay) {
            this.bs.WriteItem(c_oSer_ChartLegendType.Overlay, function () {
                oThis.memory.WriteBool(legend.bOverlay);
            });
        }
    };
    this.WritePlotArea = function (chartAsGroup) {
        var oThis = this;
        var chart = chartAsGroup.chart;
        var xAxisTitle = chartAsGroup.hAxisTitle;
        var yAxisTitle = chartAsGroup.vAxisTitle;
        var xAxis = chart.xAxis;
        var yAxis = chart.yAxis;
        if (c_oAscChartType.hbar == chart.type) {
            var oTemp = xAxis;
            xAxis = yAxis;
            yAxis = oTemp;
            oTemp = xAxisTitle;
            xAxisTitle = yAxisTitle;
            yAxisTitle = oTemp;
        }
        if (null != xAxis && null != yAxis) {
            if (c_oAscChartType.scatter == chart.type) {
                this.bs.WriteItem(c_oSer_ChartPlotAreaType.ValAx, function () {
                    oThis.WriteCatAx(xAxisTitle, xAxis, yAxis, true);
                });
            } else {
                this.bs.WriteItem(c_oSer_ChartPlotAreaType.CatAx, function () {
                    oThis.WriteCatAx(xAxisTitle, xAxis, yAxis, true);
                });
            }
            this.bs.WriteItem(c_oSer_ChartPlotAreaType.ValAx, function () {
                oThis.WriteCatAx(yAxisTitle, yAxis, xAxis, false);
            });
        }
        this.bs.WriteItem(c_oSer_ChartPlotAreaType.BasicChart, function () {
            oThis.WriteBasicChart(chart);
        });
    };
    this.WriteCatAx = function (oAxisTitle, axis, axis2, bBottom) {
        var oThis = this;
        if (null != oAxisTitle && null != oAxisTitle.txBody) {
            this.bs.WriteItem(c_oSer_ChartCatAxType.TitlePptx, function () {
                oThis.WriteTitlePptx(oAxisTitle.txBody, axis.bDefaultTitle);
            });
        }
        if (null != axis2.bGrid) {
            this.bs.WriteItem(c_oSer_ChartCatAxType.MajorGridlines, function () {
                oThis.memory.WriteBool(axis2.bGrid);
            });
        }
        if (null != axis.bShow) {
            this.bs.WriteItem(c_oSer_ChartCatAxType.Delete, function () {
                oThis.memory.WriteBool(!axis.bShow);
            });
        }
        if (bBottom) {
            this.bs.WriteItem(c_oSer_ChartCatAxType.AxPos, function () {
                oThis.memory.WriteByte(EChartAxPos.chartaxposBottom);
            });
        } else {
            this.bs.WriteItem(c_oSer_ChartCatAxType.AxPos, function () {
                oThis.memory.WriteByte(EChartAxPos.chartaxposLeft);
            });
        }
    };
    this.WriteBasicChart = function (chart) {
        var oThis = this;
        var byteType = null;
        if (null != chart.type) {
            var byteSubtype = null;
            switch (chart.type) {
            case c_oAscChartType.line:
                byteType = EChartBasicTypes.chartbasicLineChart;
                break;
            case c_oAscChartType.bar:
                byteType = EChartBasicTypes.chartbasicBarChart;
                byteSubtype = EChartBarDerection.chartbardirectionCol;
                break;
            case c_oAscChartType.hbar:
                byteType = EChartBasicTypes.chartbasicBarChart;
                byteSubtype = EChartBarDerection.chartbardirectionBar;
                break;
            case c_oAscChartType.area:
                byteType = EChartBasicTypes.chartbasicAreaChart;
                break;
            case c_oAscChartType.pie:
                byteType = EChartBasicTypes.chartbasicPieChart;
                break;
            case c_oAscChartType.scatter:
                byteType = EChartBasicTypes.chartbasicScatterChart;
                break;
            case c_oAscChartType.stock:
                byteType = EChartBasicTypes.chartbasicStockChart;
                break;
            }
            if (null != byteType) {
                this.memory.WriteByte(c_oSer_BasicChartType.Type);
                this.memory.WriteByte(c_oSerPropLenType.Byte);
                this.memory.WriteByte(byteType);
                if (null != byteSubtype) {
                    this.memory.WriteByte(c_oSer_BasicChartType.BarDerection);
                    this.memory.WriteByte(c_oSerPropLenType.Byte);
                    this.memory.WriteByte(byteSubtype);
                }
            }
        }
        if (null != chart.subType) {
            if (EChartBasicTypes.chartbasicLineChart == byteType || EChartBasicTypes.chartbasicBarChart == byteType || EChartBasicTypes.chartbasicAreaChart == byteType) {
                var byteGrouping = null;
                switch (chart.subType) {
                case c_oAscChartSubType.normal:
                    byteGrouping = EChartBarGrouping.chartbargroupingStandard;
                    break;
                case c_oAscChartSubType.stacked:
                    byteGrouping = EChartBarGrouping.chartbargroupingStacked;
                    break;
                case c_oAscChartSubType.stackedPer:
                    byteGrouping = EChartBarGrouping.chartbargroupingPercentStacked;
                    break;
                }
                if (null != byteGrouping) {
                    this.memory.WriteByte(c_oSer_BasicChartType.Grouping);
                    this.memory.WriteByte(c_oSerPropLenType.Byte);
                    this.memory.WriteByte(byteGrouping);
                }
                if (EChartBasicTypes.chartbasicBarChart == byteType && null != byteGrouping && EChartBarGrouping.chartbargroupingStandard != byteGrouping) {
                    this.memory.WriteByte(c_oSer_BasicChartType.Overlap);
                    this.memory.WriteByte(c_oSerPropLenType.Long);
                    this.memory.WriteLong(100);
                }
            }
        }
        if (null != chart.range) {
            var chartRange = chart.range;
            if (null != chartRange.interval && "" != chartRange.interval) {
                this.memory.WriteByte(c_oSer_BasicChartType.Series);
                this.memory.WriteByte(c_oSerPropLenType.Variable);
                this.bs.WriteItemWithLength(function () {
                    oThis.WriteSeries(chart);
                });
            }
        }
        if (null != chart.bShowValue) {
            this.memory.WriteByte(c_oSer_BasicChartType.DataLabels);
            this.memory.WriteByte(c_oSerPropLenType.Variable);
            this.bs.WriteItemWithLength(function () {
                oThis.WriteDataLabels(chart);
            });
        }
    };
    this.WriteSeries = function (chart) {
        var oThis = this;
        for (var i = 0, length = chart.series.length; i < length; ++i) {
            var seria = chart.series[i];
            if (null != seria) {
                this.bs.WriteItem(c_oSer_BasicChartType.Seria, function () {
                    oThis.WriteSeria(chart, seria, i);
                });
            }
        }
    };
    this.WriteSeria = function (chart, seria, nIndex) {
        var oThis = this;
        if (c_oAscChartType.scatter == chart.type && null != seria.xVal) {
            this.bs.WriteItem(c_oSer_ChartSeriesType.xVal, function () {
                oThis.WriteSeriesNumCache(seria.xVal);
            });
        }
        if (null != seria.Val) {
            this.bs.WriteItem(c_oSer_ChartSeriesType.Val, function () {
                oThis.WriteSeriesNumCache(seria.Val);
            });
        }
        if (null != seria.TxCache) {
            var TxCache = seria.TxCache;
            if (TxCache.Formula) {
                var oTempNumCache = {
                    Formula: TxCache.Formula,
                    NumCache: [{
                        val: TxCache.Tx,
                        index: 0
                    }]
                };
                this.bs.WriteItem(c_oSer_ChartSeriesType.TxRef, function () {
                    oThis.WriteSeriesNumCache(oTempNumCache);
                });
            } else {
                if (TxCache.Tx) {
                    this.memory.WriteByte(c_oSer_ChartSeriesType.Tx);
                    this.memory.WriteString2(TxCache.Tx);
                }
            }
        }
        if (c_oAscChartType.line == chart.type) {
            this.bs.WriteItem(c_oSer_ChartSeriesType.Marker, function () {
                oThis.WriteSeriesMarkers({
                    Symbol: EChartSymbol.chartsymbolNone
                });
            });
        }
        if (null != nIndex) {
            this.bs.WriteItem(c_oSer_ChartSeriesType.Index, function () {
                oThis.memory.WriteLong(nIndex);
            });
        }
        if (null != seria.bShowValue) {
            this.bs.WriteItem(c_oSer_ChartSeriesType.DataLabels, function () {
                oThis.WriteDataLabels(seria);
            });
        }
        if (null != seria.OutlineColor) {
            var oSolidFill = new CSolidFill();
            oSolidFill.color = seria.OutlineColor;
            var oFill = new CUniFill();
            oFill.fill = oSolidFill;
            var oTempSpPr = new CSpPr();
            oTempSpPr.Fill = oFill;
            this.bs.WriteItem(c_oSer_ChartSeriesType.SpPr, function () {
                window.global_pptx_content_writer.WriteSpPr(oThis.memory, oTempSpPr);
            });
        }
        if (c_oAscChartType.scatter != chart.type && null != seria.Cat && (seria.Cat.Formula || seria.Cat.NumCache.length > 0)) {
            this.bs.WriteItem(c_oSer_ChartSeriesType.Cat, function () {
                oThis.WriteSeriesNumCache(seria.Cat);
            });
        }
    };
    this.WriteSeriesNumCache = function (oCache) {
        var oThis = this;
        if (oCache.Formula) {
            this.memory.WriteByte(c_oSer_ChartSeriesNumCacheType.Formula);
            this.memory.WriteString2(oCache.Formula);
        }
        if (null != oCache.NumCache) {
            this.bs.WriteItem(c_oSer_ChartSeriesNumCacheType.NumCache2, function () {
                oThis.WriteSeriesNumCacheValues(oCache.NumCache);
            });
        }
    };
    this.WriteSeriesNumCacheValues = function (NumCache) {
        var oThis = this;
        for (var i in NumCache) {
            var elem = NumCache[i];
            var nIndex = i - 0;
            if (null != elem) {
                this.bs.WriteItem(c_oSer_ChartSeriesNumCacheType.NumCacheItem, function () {
                    oThis.WriteSeriesNumCacheValue(elem.val, nIndex);
                });
            }
        }
    };
    this.WriteSeriesNumCacheValue = function (val, index) {
        var oThis = this;
        this.memory.WriteByte(c_oSer_ChartSeriesNumCacheType.NumCacheVal);
        this.memory.WriteString2(val.toString());
        this.bs.WriteItem(c_oSer_ChartSeriesNumCacheType.NumCacheIndex, function () {
            oThis.memory.WriteLong(index);
        });
    };
    this.WriteSeriesMarkers = function (marker) {
        var oThis = this;
        if (null != marker.Size) {
            this.memory.WriteByte(c_oSer_ChartSeriesMarkerType.Size);
            this.memory.WriteByte(c_oSerPropLenType.Long);
            this.memory.WriteLong(marker.Size);
        }
        if (null != marker.Symbol) {
            this.memory.WriteByte(c_oSer_ChartSeriesMarkerType.Symbol);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteByte(marker.Symbol);
        }
    };
    this.WriteDataLabels = function (chart) {
        var oThis = this;
        if (null != chart.bShowValue) {
            this.memory.WriteByte(c_oSer_ChartSeriesDataLabelsType.ShowVal);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteBool(chart.bShowValue);
        }
        if (null != chart.bShowCatName) {
            this.memory.WriteByte(c_oSer_ChartSeriesDataLabelsType.ShowCatName);
            this.memory.WriteByte(c_oSerPropLenType.Byte);
            this.memory.WriteBool(chart.bShowCatName);
        }
    };
    this.WriteTitlePptx = function (txBody, bDefault) {
        var oThis = this;
        if (true != bDefault) {
            this.bs.WriteItem(c_oSer_ChartTitlePptxType.TxPptx, function () {
                window.global_pptx_content_writer.WriteTextBody(oThis.memory, txBody);
            });
        } else {
            this.bs.WriteItem(c_oSer_ChartTitlePptxType.TxPrPptx, function () {
                window.global_pptx_content_writer.WriteTextBody(oThis.memory, txBody);
            });
        }
    };
}
function Binary_ChartReader(stream, chart, chartAsGroup) {
    this.stream = stream;
    this.bcr = new Binary_CommonReader(this.stream);
    this.chart = chart;
    this.chartType = null;
    this.oLegendEntries = new Object();
    this.oSeriesByIndex = new Object();
    this.chartAsGroup = chartAsGroup;
    this.PreRead = function () {
        this.oLegendEntries = new Object();
        this.oSeriesByIndex = new Object();
        this.chart.legend.bShow = false;
    };
    this.Read = function (length) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        this.PreRead();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.GraphicFrame(t, l);
        });
        this.PostRead();
        return res;
    };
    this.ReadExternal = function (length) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        this.PreRead();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadChart(t, l);
        });
        this.PostRead();
        return res;
    };
    this.ParseFormula = function (formula) {
        var oRes = {
            bbox: null,
            sheet: null
        };
        if (formula) {
            var ref3D = parserHelp.is3DRef(formula, 0);
            var sRef = null;
            if (!ref3D[0]) {
                sRef = formula;
            } else {
                var resultRef = parserHelp.parse3DRef(formula);
                if (null !== resultRef) {
                    oRes.sheet = resultRef.sheet;
                    sRef = resultRef.range;
                }
            }
            if (null != sRef) {
                sRef = sRef.replace(/\$/g, "");
                var parts = sRef.split(":");
                if (2 == parts.length) {
                    var first = new CellAddress(parts[0]);
                    var last = new CellAddress(parts[1]);
                    if (first.isValid() && last.isValid()) {
                        oRes.bbox = {
                            r1: first.getRow0(),
                            c1: first.getCol0(),
                            r2: last.getRow0(),
                            c2: last.getCol0()
                        };
                    }
                } else {
                    var cell = new CellAddress(sRef);
                    if (cell.isValid()) {
                        oRes.bbox = {
                            r1: cell.getRow0(),
                            c1: cell.getCol0(),
                            r2: cell.getRow0(),
                            c2: cell.getCol0()
                        };
                    }
                }
            }
        }
        return oRes;
    };
    this.parseDataFormula = function (data, bbox) {
        if (data && data.Formula) {
            var oParsed = this.ParseFormula(data.Formula);
            if (oParsed.bbox) {
                if (null == bbox) {
                    bbox = oParsed.bbox;
                } else {
                    if (oParsed.bbox.r1 < bbox.r1) {
                        bbox.r1 = oParsed.bbox.r1;
                    }
                    if (oParsed.bbox.r2 > bbox.r2) {
                        bbox.r2 = oParsed.bbox.r2;
                    }
                    if (oParsed.bbox.c1 < bbox.c1) {
                        bbox.c1 = oParsed.bbox.c1;
                    }
                    if (oParsed.bbox.c2 > bbox.c2) {
                        bbox.c2 = oParsed.bbox.c2;
                    }
                }
            }
        }
        return bbox;
    };
    this.PostRead = function () {
        var chart = this.chart;
        if ("" != this.chartType && null != chart.series && chart.series.length > 0) {
            chart.type = this.chartType;
            for (var i in this.oLegendEntries) {
                var index = i - 0;
                var legendEntries = this.oLegendEntries[i];
                if (null != legendEntries.oTxPr) {
                    var seria = this.oSeriesByIndex[i];
                    if (null != seria && null != legendEntries.oTxPr.font) {
                        seria.titleFont = legendEntries.oTxPr.font;
                    }
                }
            }
        }
        if (chart.series.length > 0) {
            var oFirstSeria = chart.series[0];
            var sheetName = "Sheet1";
            if (null != oFirstSeria && null != oFirstSeria.Val && null != oFirstSeria.Val.Formula) {
                var oParsed = this.ParseFormula(oFirstSeria.Val.Formula);
                if (null != oParsed.bbox) {
                    var bbox = oParsed.bbox;
                    chart.range.rows = false;
                    chart.range.columns = false;
                    if (bbox.c2 - bbox.c1 > bbox.r2 - bbox.r1) {
                        chart.range.rows = true;
                    } else {
                        chart.range.columns = true;
                    }
                }
                if (null != oParsed.sheet) {
                    sheetName = oParsed.sheet;
                }
            }
            var bbox = null;
            bbox = this.parseDataFormula(oFirstSeria.Val, bbox);
            bbox = this.parseDataFormula(chart.series[chart.series.length - 1].Val, bbox);
            bbox = this.parseDataFormula(oFirstSeria.TxCache, bbox);
            bbox = this.parseDataFormula(oFirstSeria.xVal, bbox);
            bbox = this.parseDataFormula(oFirstSeria.Cat, bbox);
            if (null != bbox) {
                var oCellStart = new CellAddress(bbox.r1, bbox.c1, 0);
                var oCellEnd = new CellAddress(bbox.r2, bbox.c2, 0);
                if (false == rx_test_ws_name.test(sheetName)) {
                    sheetName = "'" + sheetName + "'";
                }
                chart.range.interval = sheetName + "!" + oCellStart.getID() + ":" + oCellEnd.getID();
            }
        }
    };
    this.GraphicFrame = function (type, length) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_DrawingType.Chart === type) {
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadChart(t, l);
            });
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.InitOldChartTitle = function (chartTitle, sTitle) {
        var txBody = new CTextBody(chartTitle);
        var oCurParagraph = new Paragraph(null, txBody.content, 0, 0, 0, 0, 0);
        var nCurPos = 0;
        txBody.content.Internal_Content_Add(txBody.content.Content.length, oCurParagraph);
        for (var i = 0, length = sTitle.length; i < length; ++i) {
            var nChart = sTitle[i];
            if (" " == nChart) {
                oCurParagraph.Internal_Content_Add(nCurPos++, new ParaSpace());
            } else {
                if ("\n" == nChart) {
                    oCurParagraph = new Paragraph(null, txBody.content, 0, 0, 0, 0, 0);
                    nCurPos = 0;
                    txBody.content.Internal_Content_Add(txBody.content.Content.length, oCurParagraph);
                } else {
                    if ("\r" == nChart) {} else {
                        oCurParagraph.Internal_Content_Add(nCurPos++, new ParaText(nChart));
                    }
                }
            }
        }
        chartTitle.setTextBody(txBody);
    };
    this.ReadChart = function (type, length) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_ChartType.Legend === type) {
            this.chart.legend.bShow = true;
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadLegend(t, l, oThis.oLegendEntries);
            });
        } else {
            if (c_oSer_ChartType.Title === type) {
                var sTitle = this.stream.GetString2LE(length);
                if ("" == sTitle) {
                    this.chart.header.bDefaultTitle = true;
                } else {
                    if (!isRealObject(this.chartAsGroup.chartTitle)) {
                        if (this.chartAsGroup.addTitle) {
                            this.chartAsGroup.addTitle(new CChartTitle(this.chartAsGroup, CHART_TITLE_TYPE_TITLE));
                        } else {
                            this.chartAsGroup.chartTitle = new CChartTitle(this.chartAsGroup, CHART_TITLE_TYPE_TITLE);
                        }
                    }
                    this.InitOldChartTitle(this.chartAsGroup.chartTitle, sTitle);
                }
            } else {
                if (c_oSer_ChartType.PlotArea === type) {
                    var oAxis = {
                        CatAx: null,
                        aValAx: new Array()
                    };
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadPlotArea(t, l, oAxis);
                    });
                    var xAxis = null;
                    var yAxis = null;
                    if (null != oAxis.CatAx) {
                        xAxis = oAxis.CatAx;
                        if (oAxis.aValAx.length > 0) {
                            yAxis = oAxis.aValAx[0];
                        }
                    } else {
                        if (oAxis.aValAx.length > 0) {
                            xAxis = oAxis.aValAx[0];
                        }
                        if (oAxis.aValAx.length > 1) {
                            yAxis = oAxis.aValAx[1];
                        }
                        if (null != xAxis && null != yAxis && null != xAxis.axPos && null != yAxis.axPos) {
                            if (EChartAxPos.chartaxposLeft == xAxis.axPos || EChartAxPos.chartaxposRight == xAxis.axPos) {
                                var oTemp = xAxis;
                                xAxis = yAxis;
                                yAxis = oTemp;
                            }
                        }
                    }
                    if (c_oAscChartType.hbar == this.chartType) {
                        var oTemp = xAxis;
                        xAxis = yAxis;
                        yAxis = oTemp;
                    }
                    this.chart.xAxis.bShow = this.chart.yAxis.bShow = false;
                    this.chart.xAxis.bGrid = this.chart.yAxis.bGrid = false;
                    var fExecAxis = function (oFrom, oTo) {
                        if (null != oFrom.title) {
                            oTo.title = oFrom.title;
                        }
                        if (null != oFrom.bDefaultTitle) {
                            oTo.bDefaultTitle = oFrom.bDefaultTitle;
                        }
                        if (null != oFrom.bShow) {
                            oTo.bShow = oFrom.bShow;
                        }
                        if (null != oFrom.bGrid) {
                            oTo.bGrid = oFrom.bGrid;
                        }
                        if (null != oFrom.titlefont) {
                            oTo.titleFont = oFrom.titlefont;
                        }
                        if (null != oFrom.lablefont) {
                            oTo.labelFont = oFrom.lablefont;
                        }
                    };
                    if (null != xAxis) {
                        fExecAxis(xAxis, this.chart.xAxis);
                    }
                    if (null != yAxis) {
                        fExecAxis(yAxis, this.chart.yAxis);
                    }
                    var bTemp = this.chart.xAxis.bGrid;
                    this.chart.xAxis.bGrid = this.chart.yAxis.bGrid;
                    this.chart.yAxis.bGrid = bTemp;
                    if (xAxis) {
                        if (this.chartAsGroup.addXAxis) {
                            this.chartAsGroup.addXAxis(xAxis.chartTitle);
                        } else {
                            this.chartAsGroup.hAxisTitle = xAxis.chartTitle;
                        }
                    }
                    if (yAxis) {
                        if (this.chartAsGroup.addYAxis) {
                            this.chartAsGroup.addYAxis(yAxis.chartTitle);
                        } else {
                            this.chartAsGroup.vAxisTitle = yAxis.chartTitle;
                        }
                    }
                } else {
                    if (c_oSer_ChartType.Style === type) {
                        this.chart.styleId = this.stream.GetULongLE();
                    } else {
                        if (c_oSer_ChartType.TitlePptx === type) {
                            if (!isRealObject(this.chartAsGroup.chartTitle)) {
                                if (this.chartAsGroup.addTitle) {
                                    this.chartAsGroup.addTitle(new CChartTitle(this.chartAsGroup, CHART_TITLE_TYPE_TITLE));
                                } else {
                                    this.chartAsGroup.chartTitle = new CChartTitle(this.chartAsGroup, CHART_TITLE_TYPE_TITLE);
                                }
                            }
                            this.chart.header.bDefaultTitle = true;
                            res = this.bcr.Read1(length, function (t, l) {
                                return oThis.ReadChartTitle(t, l, oThis.chartAsGroup.chartTitle, oThis.chart.header);
                            });
                        } else {
                            if (c_oSer_ChartType.SpPr === type) {
                                var oPPTXContentLoader = new CPPTXContentLoader();
                                var oNewSpPr = oPPTXContentLoader.ReadShapeProperty(this.stream);
                                if (null != oNewSpPr && null != oNewSpPr.ln && null != oNewSpPr.ln.Fill && null != oNewSpPr.ln.Fill.fill && FILL_TYPE_NOFILL == oNewSpPr.ln.Fill.fill.type) {
                                    this.chart.bShowBorder = false;
                                } else {
                                    this.chart.bShowBorder = true;
                                }
                            } else {
                                res = c_oSerConstants.ReadUnknown;
                            }
                        }
                    }
                }
            }
        }
        return res;
    };
    this.ReadChartTitle = function (type, length, chartTitlePptx, chartTitleHeader) {
        var res = c_oSerConstants.ReadOk;
        if (c_oSer_ChartTitlePptxType.TxPptx === type) {
            var oPPTXContentLoader = new CPPTXContentLoader();
            oPPTXContentLoader.ReadTextBody(null, this.stream, chartTitlePptx);
            chartTitleHeader.bDefaultTitle = false;
        } else {
            if (c_oSer_ChartTitlePptxType.TxPrPptx === type) {
                var oPPTXContentLoader = new CPPTXContentLoader();
                oPPTXContentLoader.ReadTextBodyTxPr(null, this.stream, chartTitlePptx);
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
        }
        return res;
    };
    this.ReadLegend = function (type, length, oLegendEntries) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_ChartLegendType.Layout === type) {
            var oLegendLayout = new Object();
            res = this.bcr.Read2Spreadsheet(length, function (t, l) {
                return oThis.ReadLegendLayout(t, l, oLegendLayout);
            });
        } else {
            if (c_oSer_ChartLegendType.LegendPos === type) {
                var byteLegendPos = this.stream.GetUChar();
                switch (byteLegendPos) {
                case EChartLegendPos.chartlegendposLeft:
                    this.chart.legend.position = c_oAscChartLegend.left;
                    break;
                case EChartLegendPos.chartlegendposTop:
                    this.chart.legend.position = c_oAscChartLegend.top;
                    break;
                case EChartLegendPos.chartlegendposRight:
                    case EChartLegendPos.chartlegendposRightTop:
                    this.chart.legend.position = c_oAscChartLegend.right;
                    break;
                case EChartLegendPos.chartlegendposBottom:
                    this.chart.legend.position = c_oAscChartLegend.bottom;
                    break;
                }
            } else {
                if (c_oSer_ChartLegendType.Overlay === type) {
                    this.chart.legend.bOverlay = this.stream.GetBool();
                } else {
                    if (c_oSer_ChartLegendType.TxPrPptx === type) {
                        var oTempTitle = new CChartTitle(this.chartAsGroup, CHART_TITLE_TYPE_TITLE);
                        var oPPTXContentLoader = new CPPTXContentLoader();
                        var textBody = oPPTXContentLoader.ReadTextBodyTxPr(null, this.stream, oTempTitle);
                    } else {
                        if (c_oSer_ChartLegendType.LegendEntry === type) {
                            var oNewLegendEntry = {
                                nIndex: null,
                                bDelete: null,
                                oTxPr: null
                            };
                            res = this.bcr.Read1(length, function (t, l) {
                                return oThis.ReadLegendEntry(t, l, oNewLegendEntry);
                            });
                            if (null != oNewLegendEntry.nIndex) {
                                this.oLegendEntries[oNewLegendEntry.nIndex] = oNewLegendEntry;
                            }
                        } else {
                            res = c_oSerConstants.ReadUnknown;
                        }
                    }
                }
            }
        }
        return res;
    };
    this.ReadLegendEntry = function (type, length, oLegendEntry) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_ChartLegendEntryType.Index === type) {
            oLegendEntry.nIndex = this.stream.GetULongLE();
        } else {
            if (c_oSer_ChartLegendEntryType.Delete === type) {
                oLegendEntry.bDelete = this.stream.GetBool();
            } else {
                if (c_oSer_ChartLegendEntryType.TxPrPptx === type) {
                    var oTempTitle = new CChartTitle(this.chartAsGroup, CHART_TITLE_TYPE_TITLE);
                    var oPPTXContentLoader = new CPPTXContentLoader();
                    var textBody = oPPTXContentLoader.ReadTextBodyTxPr(null, this.stream, oTempTitle);
                } else {
                    res = c_oSerConstants.ReadUnknown;
                }
            }
        }
        return res;
    };
    this.ReadLegendLayout = function (type, length, oLegendLayout) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_ChartLegendLayoutType.H === type) {
            oLegendLayout.H = this.stream.GetDoubleLE();
        } else {
            if (c_oSer_ChartLegendLayoutType.HMode === type) {
                oLegendLayout.HMode = this.stream.GetUChar();
            } else {
                if (c_oSer_ChartLegendLayoutType.LayoutTarget === type) {
                    oLegendLayout.LayoutTarget = this.stream.GetUChar();
                } else {
                    if (c_oSer_ChartLegendLayoutType.W === type) {
                        oLegendLayout.W = this.stream.GetDoubleLE();
                    } else {
                        if (c_oSer_ChartLegendLayoutType.WMode === type) {
                            oLegendLayout.WMode = this.stream.GetUChar();
                        } else {
                            if (c_oSer_ChartLegendLayoutType.X === type) {
                                oLegendLayout.X = this.stream.GetDoubleLE();
                            } else {
                                if (c_oSer_ChartLegendLayoutType.XMode === type) {
                                    oLegendLayout.XMode = this.stream.GetUChar();
                                } else {
                                    if (c_oSer_ChartLegendLayoutType.Y === type) {
                                        oLegendLayout.Y = this.stream.GetDoubleLE();
                                    } else {
                                        if (c_oSer_ChartLegendLayoutType.YMode === type) {
                                            oLegendLayout.YMode = this.stream.GetUChar();
                                        } else {
                                            res = c_oSerConstants.ReadUnknown;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return res;
    };
    this.ReadPlotArea = function (type, length, oAxis) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_ChartPlotAreaType.CatAx === type) {
            oAxis.CatAx = {
                title: null,
                bDefaultTitle: null,
                bGrid: null,
                bShow: null,
                axPos: null,
                titlefont: null,
                lablefont: null
            };
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadAx(t, l, oAxis.CatAx, false);
            });
        } else {
            if (c_oSer_ChartPlotAreaType.ValAx === type) {
                var oNewValAx = {
                    title: null,
                    bDefaultTitle: null,
                    bGrid: null,
                    bShow: null,
                    axPos: null,
                    titlefont: null,
                    lablefont: null
                };
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadAx(t, l, oNewValAx, true);
                });
                oAxis.aValAx.push(oNewValAx);
            } else {
                if (c_oSer_ChartPlotAreaType.BasicChart === type) {
                    var oData = {
                        BarDerection: null
                    };
                    res = this.bcr.Read2Spreadsheet(length, function (t, l) {
                        return oThis.ReadBasicChart(t, l, oData);
                    });
                    if (null != oData.BarDerection && c_oAscChartType.hbar == this.chartType) {
                        switch (oData.BarDerection) {
                        case EChartBarDerection.chartbardirectionBar:
                            break;
                        case EChartBarDerection.chartbardirectionCol:
                            this.chartType = c_oAscChartType.bar;
                            break;
                        }
                    }
                } else {
                    res = c_oSerConstants.ReadUnknown;
                }
            }
        }
        return res;
    };
    this.ReadAx = function (type, length, oAx, bValAx) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_ChartCatAxType.Title === type) {
            var sTitle = this.stream.GetString2LE(length);
            if ("" == sTitle) {
                oAx.bDefaultTitle = true;
            } else {
                if (!isRealObject(oAx.chartTitle)) {
                    if (oAx.addTitle) {
                        oAx.addTitle(new CChartTitle(this.chartAsGroup, CHART_TITLE_TYPE_TITLE));
                    } else {
                        oAx.chartTitle = new CChartTitle(this.chartAsGroup, CHART_TITLE_TYPE_TITLE);
                    }
                }
                this.InitOldChartTitle(oAx.chartTitle, sTitle);
                if (bValAx && null != oAx.chartTitle && null != oAx.chartTitle.txBody && null != oAx.chartTitle.txBody.bodyPr) {
                    var bodyPr = oAx.chartTitle.txBody.bodyPr;
                    bodyPr.rot = -5400000;
                    bodyPr.vert = nVertTThorz;
                }
            }
        } else {
            if (c_oSer_ChartCatAxType.MajorGridlines === type) {
                oAx.bGrid = this.stream.GetBool();
            } else {
                if (c_oSer_ChartCatAxType.Delete === type) {
                    oAx.bShow = !this.stream.GetBool();
                } else {
                    if (c_oSer_ChartCatAxType.AxPos === type) {
                        oAx.axPos = this.stream.GetUChar();
                    } else {
                        if (c_oSer_ChartCatAxType.TitlePptx === type) {
                            if (!isRealObject(oAx.chartTitle)) {
                                if (oAx.addTitle) {
                                    oAx.addTitle(new CChartTitle(this.chartAsGroup, CHART_TITLE_TYPE_TITLE));
                                } else {
                                    oAx.chartTitle = new CChartTitle(this.chartAsGroup, CHART_TITLE_TYPE_TITLE);
                                }
                            }
                            oAx.bDefaultTitle = true;
                            res = this.bcr.Read1(length, function (t, l) {
                                return oThis.ReadChartTitle(t, l, oAx.chartTitle, oAx);
                            });
                        } else {
                            if (c_oSer_ChartCatAxType.TxPrPptx === type) {
                                var oTxPr = new CChartTitle(this.chartAsGroup, CHART_TITLE_TYPE_TITLE);
                                var oPPTXContentLoader = new CPPTXContentLoader();
                                var textBody = oPPTXContentLoader.ReadTextBodyTxPr(null, this.stream, oTxPr);
                            } else {
                                res = c_oSerConstants.ReadUnknown;
                            }
                        }
                    }
                }
            }
        }
        return res;
    };
    this.ReadBasicChart = function (type, length, oData) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_BasicChartType.Type === type) {
            var byteType = this.stream.GetUChar();
            switch (byteType) {
            case EChartBasicTypes.chartbasicBarChart:
                case EChartBasicTypes.chartbasicBar3DChart:
                case EChartBasicTypes.chartbasicSurfaceChart:
                case EChartBasicTypes.chartbasicSurface3DChart:
                this.chartType = c_oAscChartType.hbar;
                break;
            case EChartBasicTypes.chartbasicAreaChart:
                case EChartBasicTypes.chartbasicArea3DChart:
                case EChartBasicTypes.chartbasicRadarChart:
                this.chartType = c_oAscChartType.area;
                break;
            case EChartBasicTypes.chartbasicLineChart:
                case EChartBasicTypes.chartbasicLine3DChart:
                this.chartType = c_oAscChartType.line;
                break;
            case EChartBasicTypes.chartbasicPieChart:
                case EChartBasicTypes.chartbasicPie3DChart:
                this.chartType = c_oAscChartType.pie;
                break;
            case EChartBasicTypes.chartbasicDoughnutChart:
                this.chartType = c_oAscChartType.pie;
                break;
            case EChartBasicTypes.chartbasicBubbleChart:
                case EChartBasicTypes.chartbasicScatterChart:
                this.chartType = c_oAscChartType.scatter;
                break;
            case EChartBasicTypes.chartbasicStockChart:
                this.chartType = c_oAscChartType.stock;
                break;
            }
        } else {
            if (c_oSer_BasicChartType.BarDerection === type) {
                oData.BarDerection = this.stream.GetUChar();
            } else {
                if (c_oSer_BasicChartType.Grouping === type) {
                    var byteGrouping = this.stream.GetUChar();
                    var subtype = null;
                    switch (byteGrouping) {
                    case EChartBarGrouping.chartbargroupingClustered:
                        case EChartBarGrouping.chartbargroupingStandard:
                        subtype = c_oAscChartSubType.normal;
                        break;
                    case EChartBarGrouping.chartbargroupingPercentStacked:
                        subtype = c_oAscChartSubType.stackedPer;
                        break;
                    case EChartBarGrouping.chartbargroupingStacked:
                        subtype = c_oAscChartSubType.stacked;
                        break;
                    }
                    if (null != subtype) {
                        this.chart.subType = subtype;
                    }
                } else {
                    if (c_oSer_BasicChartType.Overlap === type) {
                        var nOverlap = this.stream.GetULongLE();
                    } else {
                        if (c_oSer_BasicChartType.Series === type) {
                            res = this.bcr.Read1(length, function (t, l) {
                                return oThis.ReadSeries(t, l);
                            });
                        } else {
                            if (c_oSer_BasicChartType.DataLabels === type) {
                                var oOutput = {
                                    ShowVal: null,
                                    ShowCatName: null,
                                    TxPrPptx: null
                                };
                                res = this.bcr.Read2Spreadsheet(length, function (t, l) {
                                    return oThis.ReadDataLabels(t, l, oOutput);
                                });
                                if (null != oOutput.ShowVal) {
                                    this.chart.bShowValue = oOutput.ShowVal;
                                }
                                if (null != oOutput.ShowCatName) {
                                    this.chart.bShowCatName = oOutput.ShowCatName;
                                }
                            } else {
                                res = c_oSerConstants.ReadUnknown;
                            }
                        }
                    }
                }
            }
        }
        return res;
    };
    this.ReadSeries = function (type, length) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_BasicChartType.Seria === type) {
            var seria = new asc_CChartSeria();
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadSeria(t, l, seria);
            });
            this.chart.series.push(seria);
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadSeria = function (type, length, seria) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_ChartSeriesType.xVal === type) {
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadSeriesNumCache(t, l, seria.xVal);
            });
            this.PrepareNumCachePost(seria.xVal, "0");
        } else {
            if (c_oSer_ChartSeriesType.Val === type) {
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadSeriesNumCache(t, l, seria.Val);
                });
                this.PrepareNumCachePost(seria.Val, "0");
            } else {
                if (c_oSer_ChartSeriesType.Tx === type) {
                    seria.TxCache.Tx = this.stream.GetString2LE(length);
                } else {
                    if (c_oSer_ChartSeriesType.TxRef === type) {
                        var oTxRef = {
                            Formula: null,
                            NumCache: []
                        };
                        res = this.bcr.Read1(length, function (t, l) {
                            return oThis.ReadSeriesNumCache(t, l, oTxRef);
                        });
                        if (oTxRef.NumCache.length > 0) {
                            seria.TxCache.Formula = oTxRef.Formula;
                            var elem = oTxRef.NumCache[0];
                            if (null != elem && null != elem.val) {
                                seria.TxCache.Tx = elem.val;
                            }
                        }
                    } else {
                        if (c_oSer_ChartSeriesType.Marker === type) {
                            res = this.bcr.Read2Spreadsheet(length, function (t, l) {
                                return oThis.ReadSeriesMarkers(t, l, seria.Marker);
                            });
                        } else {
                            if (c_oSer_ChartSeriesType.Index === type) {
                                this.oSeriesByIndex[this.stream.GetULongLE()] = seria;
                            } else {
                                if (c_oSer_ChartSeriesType.Order === type) {
                                    this.stream.GetULongLE();
                                } else {
                                    if (c_oSer_ChartSeriesType.DataLabels === type) {
                                        var oOutput = {
                                            ShowVal: null,
                                            ShowCatName: null,
                                            TxPrPptx: null
                                        };
                                        res = this.bcr.Read2Spreadsheet(length, function (t, l) {
                                            return oThis.ReadDataLabels(t, l, oOutput);
                                        });
                                        if (null != oOutput.TxPrPptx && null != oOutput.TxPrPptx.font) {
                                            seria.LabelFont = oOutput.TxPrPptx.font;
                                        }
                                    } else {
                                        if (c_oSer_ChartSeriesType.SpPr === type) {
                                            var oPPTXContentLoader = new CPPTXContentLoader();
                                            var oNewSpPr = oPPTXContentLoader.ReadShapeProperty(this.stream);
                                            if (null != oNewSpPr.Fill && null != oNewSpPr.Fill.fill && null != oNewSpPr.Fill.fill.color) {
                                                seria.OutlineColor = oNewSpPr.Fill.fill.color;
                                            }
                                        } else {
                                            if (c_oSer_ChartSeriesType.Cat === type) {
                                                res = this.bcr.Read1(length, function (t, l) {
                                                    return oThis.ReadSeriesNumCache(t, l, seria.Cat);
                                                });
                                                this.PrepareNumCachePost(seria.Cat, "");
                                            } else {
                                                res = c_oSerConstants.ReadUnknown;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return res;
    };
    this.PrepareNumCachePost = function (val, sDefVal) {
        var bbox = this.parseDataFormula(val);
        var oNumCache = val.NumCache;
        if (null != bbox && null != oNumCache) {
            var width = bbox.r2 - bbox.r1 + 1;
            var height = bbox.c2 - bbox.c1 + 1;
            var nLength = Math.max(width, height);
            for (var i = 0; i < nLength; i++) {
                if (null == oNumCache[i]) {
                    oNumCache[i] = {
                        numFormatStr: "General",
                        isDateTimeFormat: false,
                        val: sDefVal,
                        isHidden: false
                    };
                }
            }
        }
    };
    this.ReadSeriesNumCache = function (type, length, Val) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_ChartSeriesNumCacheType.Formula === type) {
            Val.Formula = this.stream.GetString2LE(length);
        } else {
            if (c_oSer_ChartSeriesNumCacheType.NumCache === type) {
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadSeriesNumCacheValues(t, l, Val.NumCache);
                });
            } else {
                if (c_oSer_ChartSeriesNumCacheType.NumCache2 === type) {
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadSeriesNumCacheValues2(t, l, Val.NumCache);
                    });
                } else {
                    res = c_oSerConstants.ReadUnknown;
                }
            }
        }
        return res;
    };
    this.ReadSeriesNumCacheValues = function (type, length, aValues) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_ChartSeriesNumCacheType.NumCacheVal === type) {
            var oNewVal = {
                numFormatStr: "General",
                isDateTimeFormat: false,
                val: this.stream.GetString2LE(length),
                isHidden: false
            };
            aValues.push(oNewVal);
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadSeriesNumCacheValues2 = function (type, length, aValues) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_ChartSeriesNumCacheType.NumCacheItem === type) {
            var oNewVal = {
                val: null,
                index: null
            };
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadSeriesNumCacheValuesItem(t, l, oNewVal);
            });
            if (null != oNewVal.index) {
                aValues[oNewVal.index] = {
                    numFormatStr: "General",
                    isDateTimeFormat: false,
                    val: oNewVal.val,
                    isHidden: false
                };
            }
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
        return res;
    };
    this.ReadSeriesNumCacheValuesItem = function (type, length, value) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_ChartSeriesNumCacheType.NumCacheVal === type) {
            value.val = this.stream.GetString2LE(length);
        } else {
            if (c_oSer_ChartSeriesNumCacheType.NumCacheIndex === type) {
                value.index = this.stream.GetULongLE();
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
        }
        return res;
    };
    this.ReadSeriesMarkers = function (type, length, oMarker) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_ChartSeriesMarkerType.Size === type) {
            oMarker.Size = this.stream.GetULongLE();
        } else {
            if (c_oSer_ChartSeriesMarkerType.Symbol === type) {
                oMarker.Symbol = this.stream.GetUChar();
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
        }
        return res;
    };
    this.ReadDataLabels = function (type, length, oOutput) {
        var res = c_oSerConstants.ReadOk;
        var oThis = this;
        if (c_oSer_ChartSeriesDataLabelsType.ShowVal === type) {
            oOutput.ShowVal = this.stream.GetBool();
        } else {
            if (c_oSer_ChartSeriesDataLabelsType.TxPrPptx === type) {
                var oTempTitle = new CChartTitle(this.chartAsGroup, CHART_TITLE_TYPE_TITLE);
                var oPPTXContentLoader = new CPPTXContentLoader();
                var textBody = oPPTXContentLoader.ReadTextBodyTxPr(null, this.stream, oTempTitle);
            } else {
                if (c_oSer_ChartSeriesDataLabelsType.ShowCatName === type) {
                    oOutput.ShowCatName = this.stream.GetBool();
                } else {
                    res = c_oSerConstants.ReadUnknown;
                }
            }
        }
        return res;
    };
}
function isRealObject(obj) {
    return obj !== null && typeof obj === "object";
}
function WriteObjectLong(Writer, Object) {
    var field_count = 0;
    for (var key in Object) {
        ++field_count;
    }
    Writer.WriteLong(field_count);
    for (key in Object) {
        Writer.WriteString2(key);
        Writer.WriteLong(Object[key]);
    }
}
function ReadObjectLong(Reader) {
    var ret = {};
    var field_count = Reader.GetLong();
    for (var index = 0; index < field_count; ++index) {
        var key = Reader.GetString2();
        ret[key] = Reader.GetLong();
    }
    return ret;
}