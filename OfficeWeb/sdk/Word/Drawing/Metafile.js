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
function CGrRFonts() {
    this.Ascii = {
        Name: "Empty",
        Index: -1
    };
    this.EastAsia = {
        Name: "Empty",
        Index: -1
    };
    this.HAnsi = {
        Name: "Empty",
        Index: -1
    };
    this.CS = {
        Name: "Empty",
        Index: -1
    };
}
CGrRFonts.prototype = {
    checkFromTheme: function (fontScheme, rFonts) {
        this.Ascii.Name = fontScheme.checkFont(rFonts.Ascii.Name);
        this.EastAsia.Name = fontScheme.checkFont(rFonts.EastAsia.Name);
        this.HAnsi.Name = fontScheme.checkFont(rFonts.HAnsi.Name);
        this.CS.Name = fontScheme.checkFont(rFonts.CS.Name);
        this.Ascii.Index = -1;
        this.EastAsia.Index = -1;
        this.HAnsi.Index = -1;
        this.CS.Index = -1;
    }
};
var gr_state_pen = 0;
var gr_state_brush = 1;
var gr_state_pen_brush = 2;
var gr_state_state = 3;
var gr_state_all = 4;
function CFontSetup() {
    this.Name = "";
    this.Index = -1;
    this.Size = 12;
    this.Bold = false;
    this.Italic = false;
    this.SetUpName = "";
    this.SetUpIndex = -1;
    this.SetUpSize = 12;
    this.SetUpStyle = -1;
    this.SetUpMatrix = new CMatrix();
}
CFontSetup.prototype = {
    Clear: function () {
        this.Name = "";
        this.Index = -1;
        this.Size = 12;
        this.Bold = false;
        this.Italic = false;
        this.SetUpName = "";
        this.SetUpIndex = -1;
        this.SetUpSize = 12;
        this.SetUpStyle = -1;
        this.SetUpMatrix = new CMatrix();
    }
};
function CGrState_Pen() {
    this.Type = gr_state_pen;
    this.Pen = null;
}
CGrState_Pen.prototype = {
    Init: function (_pen) {
        if (_pen !== undefined) {
            this.Pen = _pen.CreateDublicate();
        }
    }
};
function CGrState_Brush() {
    this.Type = gr_state_brush;
    this.Brush = null;
}
CGrState_Brush.prototype = {
    Init: function (_brush) {
        if (undefined !== _brush) {
            this.Brush = _brush.CreateDublicate();
        }
    }
};
function CGrState_PenBrush() {
    this.Type = gr_state_pen_brush;
    this.Pen = null;
    this.Brush = null;
}
CGrState_PenBrush.prototype = {
    Init: function (_pen, _brush) {
        if (undefined !== _pen && undefined !== _brush) {
            this.Pen = _pen.CreateDublicate();
            this.Brush = _brush.CreateDublicate();
        }
    }
};
function CHist_Clip() {
    this.Path = null;
    this.Rect = null;
    this.IsIntegerGrid = false;
    this.Transform = new CMatrix();
}
CHist_Clip.prototype = {
    Init: function (path, rect, isIntegerGrid, transform) {
        this.Path = path;
        if (rect !== undefined) {
            this.Rect = new _rect();
            this.Rect.x = rect.x;
            this.Rect.y = rect.y;
            this.Rect.w = rect.w;
            this.Rect.h = rect.h;
        }
        if (undefined !== isIntegerGrid) {
            this.IsIntegerGrid = isIntegerGrid;
        }
        if (undefined !== transform) {
            this.Transform = transform.CreateDublicate();
        }
    },
    ToRenderer: function (renderer) {
        if (this.Rect != null) {
            var r = this.Rect;
            renderer.StartClipPath();
            renderer.rect(r.x, r.y, r.w, r.h);
            renderer.EndClipPath();
        } else {}
    }
};
function CGrState_State() {
    this.Type = gr_state_state;
    this.Transform = null;
    this.IsIntegerGrid = false;
    this.Clips = null;
}
CGrState_State.prototype = {
    Init: function (_transform, _isIntegerGrid, _clips) {
        if (undefined !== _transform) {
            this.Transform = _transform.CreateDublicate();
        }
        if (undefined !== _isIntegerGrid) {
            this.IsIntegerGrid = _isIntegerGrid;
        }
        if (undefined !== _clips) {
            this.Clips = _clips;
        }
    },
    ApplyClips: function (renderer) {
        var _len = this.Clips.length;
        for (var i = 0; i < _len; i++) {
            this.Clips[i].ToRenderer(renderer);
        }
    }
};
function CGrState() {
    this.Parent = null;
    this.States = [];
    this.Clips = [];
}
CGrState.prototype = {
    SavePen: function () {
        if (null == this.Parent) {
            return;
        }
        var _state = new CGrState_Pen();
        _state.Init(this.Parent.m_oPen);
        this.States.push(_state);
    },
    SaveBrush: function () {
        if (null == this.Parent) {
            return;
        }
        var _state = new CGrState_Brush();
        _state.Init(this.Parent.m_oBrush);
        this.States.push(_state);
    },
    SavePenBrush: function () {
        if (null == this.Parent) {
            return;
        }
        var _state = new CGrState_PenBrush();
        _state.Init(this.Parent.m_oPen, this.Parent.m_oBrush);
        this.States.push(_state);
    },
    RestorePen: function () {
        var _ind = this.States.length - 1;
        if (null == this.Parent || -1 == _ind) {
            return;
        }
        var _state = this.States[_ind];
        if (_state.Type == gr_state_pen) {
            this.States.splice(_ind, 1);
            var _c = _state.Pen.Color;
            this.Parent.p_color(_c.R, _c.G, _c.B, _c.A);
        }
    },
    RestoreBrush: function () {
        var _ind = this.States.length - 1;
        if (null == this.Parent || -1 == _ind) {
            return;
        }
        var _state = this.States[_ind];
        if (_state.Type == gr_state_brush) {
            this.States.splice(_ind, 1);
            var _c = _state.Brush.Color1;
            this.Parent.b_color1(_c.R, _c.G, _c.B, _c.A);
        }
    },
    RestorePenBrush: function () {
        var _ind = this.States.length - 1;
        if (null == this.Parent || -1 == _ind) {
            return;
        }
        var _state = this.States[_ind];
        if (_state.Type == gr_state_pen_brush) {
            this.States.splice(_ind, 1);
            var _cb = _state.Brush.Color1;
            var _cp = _state.Pen.Color;
            this.Parent.b_color1(_cb.R, _cb.G, _cb.B, _cb.A);
            this.Parent.p_color(_cp.R, _cp.G, _cp.B, _cp.A);
        }
    },
    SaveGrState: function () {
        if (null == this.Parent) {
            return;
        }
        var _state = new CGrState_State();
        _state.Init(this.Parent.m_oTransform, !!this.Parent.m_bIntegerGrid, this.Clips);
        this.States.push(_state);
        this.Clips = [];
    },
    RestoreGrState: function () {
        var _ind = this.States.length - 1;
        if (null == this.Parent || -1 == _ind) {
            return;
        }
        var _state = this.States[_ind];
        if (_state.Type == gr_state_state) {
            if (this.Clips.length > 0) {
                this.Parent.RemoveClip();
                for (var i = 0; i <= _ind; i++) {
                    var _s = this.States[i];
                    if (_s.Type == gr_state_state) {
                        var _c = _s.Clips;
                        var _l = _c.length;
                        for (var j = 0; j < _l; j++) {
                            this.Parent.transform3(_c[j].Transform);
                            this.Parent.SetIntegerGrid(_c[j].IsIntegerGrid);
                            var _r = _c[j].Rect;
                            this.Parent.StartClipPath();
                            this.Parent._s();
                            this.Parent._m(_r.x, _r.y);
                            this.Parent._l(_r.x + _r.w, _r.y);
                            this.Parent._l(_r.x + _r.w, _r.y + _r.h);
                            this.Parent._l(_r.x, _r.y + _r.h);
                            this.Parent._l(_r.x, _r.y);
                            this.Parent.EndClipPath();
                        }
                    }
                }
            }
            this.Clips = _state.Clips;
            this.States.splice(_ind, 1);
            this.Parent.transform3(_state.Transform);
            this.Parent.SetIntegerGrid(_state.IsIntegerGrid);
        }
    },
    Save: function () {
        this.SavePen();
        this.SaveBrush();
        this.SaveGrState();
    },
    Restore: function () {
        this.RestoreGrState();
        this.RestoreBrush();
        this.RestorePen();
    },
    StartClipPath: function () {},
    EndClipPath: function () {},
    AddClipRect: function (_r) {
        var _histClip = new CHist_Clip();
        _histClip.Transform = this.Parent.m_oTransform.CreateDublicate();
        _histClip.IsIntegerGrid = !!this.Parent.m_bIntegerGrid;
        _histClip.Rect = new _rect();
        _histClip.Rect.x = _r.x;
        _histClip.Rect.y = _r.y;
        _histClip.Rect.w = _r.w;
        _histClip.Rect.h = _r.h;
        this.Clips.push(_histClip);
        this.Parent.StartClipPath();
        this.Parent._s();
        this.Parent._m(_r.x, _r.y);
        this.Parent._l(_r.x + _r.w, _r.y);
        this.Parent._l(_r.x + _r.w, _r.y + _r.h);
        this.Parent._l(_r.x, _r.y + _r.h);
        this.Parent._l(_r.x, _r.y);
        this.Parent.EndClipPath();
    }
};
var g_stringBase64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var g_arrayBase64 = [];
for (var index64 = 0; index64 < g_stringBase64.length; index64++) {
    g_arrayBase64.push(g_stringBase64.charAt(index64));
}
function Base64Encode(srcData, nSrcLen, nOffset) {
    if ("undefined" === typeof(nOffset)) {
        nOffset = 0;
    }
    var nWritten = 0;
    var nLen1 = (((nSrcLen / 3) >> 0) * 4);
    var nLen2 = (nLen1 / 76) >> 0;
    var nLen3 = 19;
    var srcInd = 0;
    var dstStr = [];
    var _s = "";
    for (var i = 0; i <= nLen2; i++) {
        if (i == nLen2) {
            nLen3 = ((nLen1 % 76) / 4) >> 0;
        }
        for (var j = 0; j < nLen3; j++) {
            var dwCurr = 0;
            for (var n = 0; n < 3; n++) {
                dwCurr |= srcData[srcInd+++nOffset];
                dwCurr <<= 8;
            }
            _s = "";
            for (var k = 0; k < 4; k++) {
                var b = (dwCurr >>> 26) & 255;
                _s += g_arrayBase64[b];
                dwCurr <<= 6;
                dwCurr &= 4294967295;
            }
            dstStr.push(_s);
        }
    }
    nLen2 = (nSrcLen % 3 != 0) ? (nSrcLen % 3 + 1) : 0;
    if (nLen2) {
        var dwCurr = 0;
        for (var n = 0; n < 3; n++) {
            if (n < (nSrcLen % 3)) {
                dwCurr |= srcData[srcInd+++nOffset];
            }
            dwCurr <<= 8;
        }
        _s = "";
        for (var k = 0; k < nLen2; k++) {
            var b = (dwCurr >>> 26) & 255;
            _s += g_arrayBase64[b];
            dwCurr <<= 6;
        }
        nLen3 = (nLen2 != 0) ? 4 - nLen2 : 0;
        for (var j = 0; j < nLen3; j++) {
            _s += "=";
        }
        dstStr.push(_s);
    }
    return dstStr.join("");
}
function CMemory(bIsNoInit) {
    this.Init = function () {
        var _canvas = document.createElement("canvas");
        var _ctx = _canvas.getContext("2d");
        this.len = 1024 * 1024 * 5;
        this.ImData = _ctx.createImageData(this.len / 4, 1);
        this.data = this.ImData.data;
        this.pos = 0;
    };
    this.ImData = null;
    this.data = null;
    this.len = 0;
    this.pos = 0;
    if (true !== bIsNoInit) {
        this.Init();
    }
    this.Copy = function (oMemory, nPos, nLen) {
        for (var Index = 0; Index < nLen; Index++) {
            this.CheckSize(1);
            this.data[this.pos++] = oMemory.data[Index + nPos];
        }
    };
    this.CheckSize = function (count) {
        if (this.pos + count >= this.len) {
            var _canvas = document.createElement("canvas");
            var _ctx = _canvas.getContext("2d");
            var oldImData = this.ImData;
            var oldData = this.data;
            var oldPos = this.pos;
            this.len = Math.max(this.len * 2, this.pos + ((3 * count / 2) >> 0));
            this.ImData = _ctx.createImageData(this.len / 4, 1);
            this.data = this.ImData.data;
            var newData = this.data;
            for (var i = 0; i < this.pos; i++) {
                newData[i] = oldData[i];
            }
        }
    };
    this.GetBase64Memory = function () {
        return Base64Encode(this.data, this.pos, 0);
    };
    this.GetBase64Memory2 = function (nPos, nLen) {
        return Base64Encode(this.data, nLen, nPos);
    };
    this.GetCurPosition = function () {
        return this.pos;
    };
    this.Seek = function (nPos) {
        this.pos = nPos;
    };
    this.Skip = function (nDif) {
        this.pos += nDif;
    };
    this.WriteBool = function (val) {
        this.CheckSize(1);
        if (false == val) {
            this.data[this.pos++] = 0;
        } else {
            this.data[this.pos++] = 1;
        }
    };
    this.WriteByte = function (val) {
        this.CheckSize(1);
        this.data[this.pos++] = val;
    };
    this.WriteLong = function (val) {
        this.CheckSize(4);
        this.data[this.pos++] = (val) & 255;
        this.data[this.pos++] = (val >>> 8) & 255;
        this.data[this.pos++] = (val >>> 16) & 255;
        this.data[this.pos++] = (val >>> 24) & 255;
    };
    this.WriteDouble = function (val) {
        this.CheckSize(4);
        var lval = ((val * 100000) >> 0) & 4294967295;
        this.data[this.pos++] = (lval) & 255;
        this.data[this.pos++] = (lval >>> 8) & 255;
        this.data[this.pos++] = (lval >>> 16) & 255;
        this.data[this.pos++] = (lval >>> 24) & 255;
    };
    this.WriteDouble2 = function (val) {
        this.CheckSize(8);
        var aVal = this._doubleEncodeLE754(val);
        this.data[this.pos++] = aVal[0];
        this.data[this.pos++] = aVal[1];
        this.data[this.pos++] = aVal[2];
        this.data[this.pos++] = aVal[3];
        this.data[this.pos++] = aVal[4];
        this.data[this.pos++] = aVal[5];
        this.data[this.pos++] = aVal[6];
        this.data[this.pos++] = aVal[7];
    };
    this._doubleEncodeLE754 = function (v) {
        var s, e, m, i, d, c, mLen, eLen, eBias, eMax;
        var el = {
            len: 8,
            mLen: 52,
            rt: 0
        };
        mLen = el.mLen,
        eLen = el.len * 8 - el.mLen - 1,
        eMax = (1 << eLen) - 1,
        eBias = eMax >> 1;
        s = v < 0 ? 1 : 0;
        v = Math.abs(v);
        if (isNaN(v) || (v == Infinity)) {
            m = isNaN(v) ? 1 : 0;
            e = eMax;
        } else {
            e = Math.floor(Math.log(v) / Math.LN2);
            if (v * (c = Math.pow(2, -e)) < 1) {
                e--;
                c *= 2;
            }
            if (e + eBias >= 1) {
                v += el.rt / c;
            } else {
                v += el.rt * Math.pow(2, 1 - eBias);
            }
            if (v * c >= 2) {
                e++;
                c /= 2;
            }
            if (e + eBias >= eMax) {
                m = 0;
                e = eMax;
            } else {
                if (e + eBias >= 1) {
                    m = (v * c - 1) * Math.pow(2, mLen);
                    e = e + eBias;
                } else {
                    m = v * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
                    e = 0;
                }
            }
        }
        var a = new Array(8);
        for (i = 0, d = 1; mLen >= 8; a[i] = m & 255, i += d, m /= 256, mLen -= 8) {}
        for (e = (e << mLen) | m, eLen += mLen; eLen > 0; a[i] = e & 255, i += d, e /= 256, eLen -= 8) {}
        a[i - d] |= s * 128;
        return a;
    };
    this.WriteString = function (text) {
        if ("string" != typeof text) {
            text = text + "";
        }
        var count = text.length & 65535;
        this.CheckSize(count + 2);
        this.data[this.pos++] = count & 255;
        this.data[this.pos++] = (count >>> 8) & 255;
        for (var i = 0; i < count; i++) {
            var c = text.charCodeAt(i) & 65535;
            this.data[this.pos++] = c & 255;
            this.data[this.pos++] = (c >>> 8) & 255;
        }
    };
    this.WriteString2 = function (text) {
        if ("string" != typeof text) {
            text = text + "";
        }
        var count = text.length & 2147483647;
        var countWrite = 2 * count;
        this.WriteLong(countWrite);
        this.CheckSize(countWrite);
        for (var i = 0; i < count; i++) {
            var c = text.charCodeAt(i) & 65535;
            this.data[this.pos++] = c & 255;
            this.data[this.pos++] = (c >>> 8) & 255;
        }
    };
    this.WriteString3 = function (text) {
        if ("string" != typeof text) {
            text = text + "";
        }
        var count = text.length & 2147483647;
        var countWrite = 2 * count;
        this.CheckSize(countWrite);
        for (var i = 0; i < count; i++) {
            var c = text.charCodeAt(i) & 65535;
            this.data[this.pos++] = c & 255;
            this.data[this.pos++] = (c >>> 8) & 255;
        }
    };
    this.ClearNoAttack = function () {
        this.pos = 0;
    };
    this.WriteLongAt = function (_pos, val) {
        this.data[_pos++] = (val) & 255;
        this.data[_pos++] = (val >>> 8) & 255;
        this.data[_pos++] = (val >>> 16) & 255;
        this.data[_pos++] = (val >>> 24) & 255;
    };
    this.WriteBuffer = function (data, _pos, count) {
        this.CheckSize(count);
        for (var i = 0; i < count; i++) {
            this.data[this.pos++] = data[_pos + i];
        }
    };
}
function CCommandsType() {
    this.ctPenXML = 0;
    this.ctPenColor = 1;
    this.ctPenAlpha = 2;
    this.ctPenSize = 3;
    this.ctPenDashStyle = 4;
    this.ctPenLineStartCap = 5;
    this.ctPenLineEndCap = 6;
    this.ctPenLineJoin = 7;
    this.ctPenDashPatern = 8;
    this.ctPenDashPatternCount = 9;
    this.ctPenDashOffset = 10;
    this.ctPenAlign = 11;
    this.ctPenMiterLimit = 12;
    this.ctBrushXML = 20;
    this.ctBrushType = 21;
    this.ctBrushColor1 = 22;
    this.ctBrushColor2 = 23;
    this.ctBrushAlpha1 = 24;
    this.ctBrushAlpha2 = 25;
    this.ctBrushTexturePath = 26;
    this.ctBrushTextureAlpha = 27;
    this.ctBrushTextureMode = 28;
    this.ctBrushRectable = 29;
    this.ctBrushRectableEnabled = 30;
    this.ctBrushGradient = 31;
    this.ctFontXML = 40;
    this.ctFontName = 41;
    this.ctFontSize = 42;
    this.ctFontStyle = 43;
    this.ctFontPath = 44;
    this.ctFontGID = 45;
    this.ctFontCharSpace = 46;
    this.ctShadowXML = 50;
    this.ctShadowVisible = 51;
    this.ctShadowDistanceX = 52;
    this.ctShadowDistanceY = 53;
    this.ctShadowBlurSize = 54;
    this.ctShadowColor = 55;
    this.ctShadowAlpha = 56;
    this.ctEdgeXML = 70;
    this.ctEdgeVisible = 71;
    this.ctEdgeDistance = 72;
    this.ctEdgeColor = 73;
    this.ctEdgeAlpha = 74;
    this.ctDrawText = 80;
    this.ctDrawTextEx = 81;
    this.ctDrawTextCode = 82;
    this.ctDrawTextCodeGid = 83;
    this.ctPathCommandMoveTo = 91;
    this.ctPathCommandLineTo = 92;
    this.ctPathCommandLinesTo = 93;
    this.ctPathCommandCurveTo = 94;
    this.ctPathCommandCurvesTo = 95;
    this.ctPathCommandArcTo = 96;
    this.ctPathCommandClose = 97;
    this.ctPathCommandEnd = 98;
    this.ctDrawPath = 99;
    this.ctPathCommandStart = 100;
    this.ctPathCommandGetCurrentPoint = 101;
    this.ctPathCommandText = 102;
    this.ctPathCommandTextEx = 103;
    this.ctDrawImage = 110;
    this.ctDrawImageFromFile = 111;
    this.ctSetParams = 120;
    this.ctBeginCommand = 121;
    this.ctEndCommand = 122;
    this.ctSetTransform = 130;
    this.ctResetTransform = 131;
    this.ctClipMode = 140;
    this.ctCommandLong1 = 150;
    this.ctCommandDouble1 = 151;
    this.ctCommandString1 = 152;
    this.ctCommandLong2 = 153;
    this.ctCommandDouble2 = 154;
    this.ctCommandString2 = 155;
    this.ctPageWidth = 200;
    this.ctPageHeight = 201;
    this.ctPageStart = 202;
    this.ctPageEnd = 203;
    this.ctError = 255;
}
var CommandType = new CCommandsType();
var MetaBrushType = {
    Solid: 0,
    Gradient: 1,
    Texture: 2
};
function CMetafile(width, height) {
    this.Width = width;
    this.Height = height;
    this.m_oPen = new CPen();
    this.m_oBrush = new CBrush();
    this.m_oFont = {
        Name: "",
        FontSize: -1,
        Style: -1
    };
    this.m_oPen.Color.R = -1;
    this.m_oBrush.Color1.R = -1;
    this.m_oBrush.Color2.R = -1;
    this.m_oTransform = new CMatrix();
    this.m_arrayCommands = [];
    this.Memory = null;
    this.VectorMemoryForPrint = null;
    this.BrushType = MetaBrushType.Solid;
    this.m_oTextPr = null;
    this.m_oGrFonts = new CGrRFonts();
    this.m_oFontSlotFont = new CFontSetup();
    this.LastFontOriginInfo = {
        Name: "",
        Replace: null
    };
}
CMetafile.prototype = {
    p_color: function (r, g, b, a) {
        if (this.m_oPen.Color.R != r || this.m_oPen.Color.G != g || this.m_oPen.Color.B != b) {
            this.m_oPen.Color.R = r;
            this.m_oPen.Color.G = g;
            this.m_oPen.Color.B = b;
            var value = b << 16 | g << 8 | r;
            this.Memory.WriteByte(CommandType.ctPenColor);
            this.Memory.WriteLong(value);
        }
        if (this.m_oPen.Color.A != a) {
            this.m_oPen.Color.A = a;
            this.Memory.WriteByte(CommandType.ctPenAlpha);
            this.Memory.WriteByte(a);
        }
    },
    p_width: function (w) {
        var val = w / 1000;
        if (this.m_oPen.Size != val) {
            this.m_oPen.Size = val;
            this.Memory.WriteByte(CommandType.ctPenSize);
            this.Memory.WriteDouble(val);
        }
    },
    b_color1: function (r, g, b, a) {
        if (this.BrushType != MetaBrushType.Solid) {
            this.Memory.WriteByte(CommandType.ctBrushType);
            this.Memory.WriteLong(1000);
            this.BrushType = MetaBrushType.Solid;
        }
        if (this.m_oBrush.Color1.R != r || this.m_oBrush.Color1.G != g || this.m_oBrush.Color1.B != b) {
            this.m_oBrush.Color1.R = r;
            this.m_oBrush.Color1.G = g;
            this.m_oBrush.Color1.B = b;
            var value = b << 16 | g << 8 | r;
            this.Memory.WriteByte(CommandType.ctBrushColor1);
            this.Memory.WriteLong(value);
        }
        if (this.m_oBrush.Color1.A != a) {
            this.m_oBrush.Color1.A = a;
            this.Memory.WriteByte(CommandType.ctBrushAlpha1);
            this.Memory.WriteByte(a);
        }
    },
    b_color2: function (r, g, b, a) {
        if (this.m_oBrush.Color2.R != r || this.m_oBrush.Color2.G != g || this.m_oBrush.Color2.B != b) {
            this.m_oBrush.Color2.R = r;
            this.m_oBrush.Color2.G = g;
            this.m_oBrush.Color2.B = b;
            var value = b << 16 | g << 8 | r;
            this.Memory.WriteByte(CommandType.ctBrushColor2);
            this.Memory.WriteLong(value);
        }
        if (this.m_oBrush.Color2.A != a) {
            this.m_oBrush.Color2.A = a;
            this.Memory.WriteByte(CommandType.ctBrushAlpha2);
            this.Memory.WriteByte(a);
        }
    },
    put_brushTexture: function (src, mode) {
        if (this.BrushType != MetaBrushType.Texture) {
            this.Memory.WriteByte(CommandType.ctBrushType);
            this.Memory.WriteLong(3008);
            this.BrushType = MetaBrushType.Texture;
        }
        this.m_oBrush.Color1.R = -1;
        this.m_oBrush.Color1.G = -1;
        this.m_oBrush.Color1.B = -1;
        this.m_oBrush.Color1.A = -1;
        this.Memory.WriteByte(CommandType.ctBrushTexturePath);
        var _src = src;
        if (window.editor) {
            var _search = window.editor.DocumentUrl;
            if (0 == _src.indexOf(_search)) {
                _src = _src.substring(_search.length);
            }
        } else {
            if (!window.editor) {
                var _api = window["Asc"]["editor"];
                var _mask = g_sResourceServiceLocalUrl + _api.documentId + "/";
                if (0 == src.indexOf(_mask)) {
                    _src = src.substring(_mask.length);
                }
            }
        }
        this.Memory.WriteString(_src);
        this.Memory.WriteByte(CommandType.ctBrushTextureMode);
        this.Memory.WriteByte(mode);
    },
    put_BrushTextureAlpha: function (alpha) {
        var write = alpha;
        if (null == alpha || undefined == alpha) {
            write = 255;
        }
        this.Memory.WriteByte(CommandType.ctBrushTextureAlpha);
        this.Memory.WriteByte(write);
    },
    put_BrushGradient: function (gradFill, points, transparent) {
        this.BrushType = MetaBrushType.Gradient;
        this.Memory.WriteByte(CommandType.ctBrushGradient);
        this.Memory.WriteByte(g_nodeAttributeStart);
        if (gradFill.path != null && (gradFill.lin == null || gradFill.lin == undefined)) {
            this.Memory.WriteByte(1);
            this.Memory.WriteByte(gradFill.path);
            this.Memory.WriteDouble(points.x0);
            this.Memory.WriteDouble(points.y0);
            this.Memory.WriteDouble(points.x1);
            this.Memory.WriteDouble(points.y1);
            this.Memory.WriteDouble(points.r0);
            this.Memory.WriteDouble(points.r1);
        } else {
            this.Memory.WriteByte(0);
            if (null == gradFill.lin) {
                this.Memory.WriteLong(90 * 60000);
                this.Memory.WriteBool(false);
            } else {
                this.Memory.WriteLong(gradFill.lin.angle);
                this.Memory.WriteBool(gradFill.lin.scale);
            }
            this.Memory.WriteDouble(points.x0);
            this.Memory.WriteDouble(points.y0);
            this.Memory.WriteDouble(points.x1);
            this.Memory.WriteDouble(points.y1);
        }
        var _colors = gradFill.colors;
        this.Memory.WriteByte(2);
        this.Memory.WriteLong(_colors.length);
        for (var i = 0; i < _colors.length; i++) {
            this.Memory.WriteLong(_colors[i].pos);
            this.Memory.WriteByte(_colors[i].color.RGBA.R);
            this.Memory.WriteByte(_colors[i].color.RGBA.G);
            this.Memory.WriteByte(_colors[i].color.RGBA.B);
            if (null == transparent) {
                this.Memory.WriteByte(_colors[i].color.RGBA.A);
            } else {
                this.Memory.WriteByte(transparent);
            }
        }
        this.Memory.WriteByte(g_nodeAttributeEnd);
    },
    transform: function (sx, shy, shx, sy, tx, ty) {
        if (this.m_oTransform.sx != sx || this.m_oTransform.shx != shx || this.m_oTransform.shy != shy || this.m_oTransform.sy != sy || this.m_oTransform.tx != tx || this.m_oTransform.ty != ty) {
            this.m_oTransform.sx = sx;
            this.m_oTransform.shx = shx;
            this.m_oTransform.shy = shy;
            this.m_oTransform.sy = sy;
            this.m_oTransform.tx = tx;
            this.m_oTransform.ty = ty;
            this.Memory.WriteByte(CommandType.ctSetTransform);
            this.Memory.WriteDouble(sx);
            this.Memory.WriteDouble(shy);
            this.Memory.WriteDouble(shx);
            this.Memory.WriteDouble(sy);
            this.Memory.WriteDouble(tx);
            this.Memory.WriteDouble(ty);
        }
    },
    _s: function () {
        if (this.VectorMemoryForPrint != null) {
            this.VectorMemoryForPrint.ClearNoAttack();
        }
        var _memory = (null == this.VectorMemoryForPrint) ? this.Memory : this.VectorMemoryForPrint;
        _memory.WriteByte(CommandType.ctPathCommandStart);
    },
    _e: function () {
        this.Memory.WriteByte(CommandType.ctPathCommandEnd);
    },
    _z: function () {
        var _memory = (null == this.VectorMemoryForPrint) ? this.Memory : this.VectorMemoryForPrint;
        _memory.WriteByte(CommandType.ctPathCommandClose);
    },
    _m: function (x, y) {
        var _memory = (null == this.VectorMemoryForPrint) ? this.Memory : this.VectorMemoryForPrint;
        _memory.WriteByte(CommandType.ctPathCommandMoveTo);
        _memory.WriteDouble(x);
        _memory.WriteDouble(y);
    },
    _l: function (x, y) {
        var _memory = (null == this.VectorMemoryForPrint) ? this.Memory : this.VectorMemoryForPrint;
        _memory.WriteByte(CommandType.ctPathCommandLineTo);
        _memory.WriteDouble(x);
        _memory.WriteDouble(y);
    },
    _c: function (x1, y1, x2, y2, x3, y3) {
        var _memory = (null == this.VectorMemoryForPrint) ? this.Memory : this.VectorMemoryForPrint;
        _memory.WriteByte(CommandType.ctPathCommandCurveTo);
        _memory.WriteDouble(x1);
        _memory.WriteDouble(y1);
        _memory.WriteDouble(x2);
        _memory.WriteDouble(y2);
        _memory.WriteDouble(x3);
        _memory.WriteDouble(y3);
    },
    _c2: function (x1, y1, x2, y2) {
        var _memory = (null == this.VectorMemoryForPrint) ? this.Memory : this.VectorMemoryForPrint;
        _memory.WriteByte(CommandType.ctPathCommandCurveTo);
        _memory.WriteDouble(x1);
        _memory.WriteDouble(y1);
        _memory.WriteDouble(x1);
        _memory.WriteDouble(y1);
        _memory.WriteDouble(x2);
        _memory.WriteDouble(y2);
    },
    ds: function () {
        if (null == this.VectorMemoryForPrint) {
            this.Memory.WriteByte(CommandType.ctDrawPath);
            this.Memory.WriteLong(1);
        } else {
            this.Memory.Copy(this.VectorMemoryForPrint, 0, this.VectorMemoryForPrint.pos);
            this.Memory.WriteByte(CommandType.ctDrawPath);
            this.Memory.WriteLong(1);
        }
    },
    df: function () {
        if (null == this.VectorMemoryForPrint) {
            this.Memory.WriteByte(CommandType.ctDrawPath);
            this.Memory.WriteLong(256);
        } else {
            this.Memory.Copy(this.VectorMemoryForPrint, 0, this.VectorMemoryForPrint.pos);
            this.Memory.WriteByte(CommandType.ctDrawPath);
            this.Memory.WriteLong(256);
        }
    },
    WriteVectorMemoryForPrint: function () {
        if (null != this.VectorMemoryForPrint) {
            this.Memory.Copy(this.VectorMemoryForPrint, 0, this.VectorMemoryForPrint.pos);
        }
    },
    drawpath: function (type) {
        if (null == this.VectorMemoryForPrint) {
            this.Memory.WriteByte(CommandType.ctDrawPath);
            this.Memory.WriteLong(type);
        } else {
            this.Memory.Copy(this.VectorMemoryForPrint, 0, this.VectorMemoryForPrint.pos);
            this.Memory.WriteByte(CommandType.ctDrawPath);
            this.Memory.WriteLong(type);
        }
    },
    save: function () {},
    restore: function () {},
    clip: function () {},
    drawImage: function (img, x, y, w, h) {
        if (!window.editor) {
            this.Memory.WriteByte(CommandType.ctDrawImageFromFile);
            var _api = window["Asc"]["editor"];
            var _mask = g_sResourceServiceLocalUrl + _api.documentId + "/";
            if (0 == img.indexOf(_mask)) {
                var _src = img.substring(_mask.length);
                this.Memory.WriteString2(_src);
            } else {
                this.Memory.WriteString2(img);
            }
            this.Memory.WriteDouble(x);
            this.Memory.WriteDouble(y);
            this.Memory.WriteDouble(w);
            this.Memory.WriteDouble(h);
            return;
        }
        var _src = "";
        if (!window["NATIVE_EDITOR_ENJINE"]) {
            var _img = window.editor.ImageLoader.map_image_index[img];
            if (_img == undefined || _img.Image == null) {
                return;
            }
            _src = _img.src;
        } else {
            _src = img;
        }
        var _search = window.editor.DocumentUrl;
        if (0 == _src.indexOf(_search)) {
            _src = _src.substring(_search.length);
        } else {
            if (window.editor.ThemeLoader !== undefined && window.editor.ThemeLoader != null) {
                if (0 == _src.indexOf(window.editor.ThemeLoader.ThemesUrl)) {
                    _src = _src.substring(window.editor.ThemeLoader.ThemesUrl.length);
                }
            }
        }
        this.Memory.WriteByte(CommandType.ctDrawImageFromFile);
        this.Memory.WriteString2(_src);
        this.Memory.WriteDouble(x);
        this.Memory.WriteDouble(y);
        this.Memory.WriteDouble(w);
        this.Memory.WriteDouble(h);
    },
    SetFont: function (font) {
        if (null == font) {
            return;
        }
        var style = 0;
        if (font.Italic == true) {
            style += 2;
        }
        if (font.Bold == true) {
            style += 1;
        }
        var fontinfo = g_fontApplication.GetFontInfo(font.FontFamily.Name, style, this.LastFontOriginInfo);
        style = fontinfo.GetBaseStyle(style);
        if (this.m_oFont.Name != fontinfo.Name) {
            this.m_oFont.Name = fontinfo.Name;
            this.Memory.WriteByte(CommandType.ctFontName);
            this.Memory.WriteString(this.m_oFont.Name);
        }
        if (this.m_oFont.FontSize != font.FontSize) {
            this.m_oFont.FontSize = font.FontSize;
            this.Memory.WriteByte(CommandType.ctFontSize);
            this.Memory.WriteDouble(this.m_oFont.FontSize);
        }
        if (this.m_oFont.Style != style) {
            this.m_oFont.Style = style;
            this.Memory.WriteByte(CommandType.ctFontStyle);
            this.Memory.WriteLong(style);
        }
    },
    FillText: function (x, y, text) {
        this.Memory.WriteByte(CommandType.ctDrawText);
        if (null != this.LastFontOriginInfo.Replace && 1 == text.length) {
            var _code = text.charCodeAt(0);
            _code = g_fontApplication.GetReplaceGlyph(_code, this.LastFontOriginInfo.Replace);
            text = String.fromCharCode(_code);
        }
        this.Memory.WriteString(text);
        this.Memory.WriteDouble(x);
        this.Memory.WriteDouble(y);
    },
    FillTextCode: function (x, y, code) {
        var _font_info = window.g_font_infos[window.g_map_font_index[this.m_oFont.Name]];
        var _is_face_index_no_0 = (_font_info.faceIndexR <= 0 && _font_info.faceIndexI <= 0 && _font_info.faceIndexB <= 0 && _font_info.faceIndexBI <= 0);
        if (code < 65535 && (_is_face_index_no_0 || window["native"] !== undefined)) {
            return this.FillText(x, y, String.fromCharCode(code));
        }
        if (window["native"] !== undefined) {
            return;
        }
        var _old_pos = this.Memory.pos;
        g_fontApplication.LoadFont(_font_info.Name, window.g_font_loader, g_oTextMeasurer.m_oManager, this.m_oFont.FontSize, Math.max(this.m_oFont.Style, 0), 72, 72);
        if (null != this.LastFontOriginInfo.Replace) {
            code = g_fontApplication.GetReplaceGlyph(code, this.LastFontOriginInfo.Replace);
        }
        g_oTextMeasurer.m_oManager.LoadStringPathCode(code, false, x, y, this);
        if ((this.Memory.pos - _old_pos) < 8) {
            this.Memory.pos = _old_pos;
        }
    },
    tg: function (gid, x, y) {
        if (window["native"] !== undefined) {
            return;
        }
        var _old_pos = this.Memory.pos;
        g_fontApplication.LoadFont(this.m_oFont.Name, window.g_font_loader, g_oTextMeasurer.m_oManager, this.m_oFont.FontSize, Math.max(this.m_oFont.Style, 0), 72, 72);
        g_oTextMeasurer.m_oManager.LoadStringPathCode(gid, true, x, y, this);
        if ((this.Memory.pos - _old_pos) < 8) {
            this.Memory.pos = _old_pos;
        }
    },
    charspace: function (space) {},
    beginCommand: function (command) {
        this.Memory.WriteByte(CommandType.ctBeginCommand);
        this.Memory.WriteLong(command);
    },
    endCommand: function (command) {
        if (32 == command) {
            if (null == this.VectorMemoryForPrint) {
                this.Memory.WriteByte(CommandType.ctEndCommand);
                this.Memory.WriteLong(command);
            } else {
                this.Memory.Copy(this.VectorMemoryForPrint, 0, this.VectorMemoryForPrint.pos);
                this.Memory.WriteByte(CommandType.ctEndCommand);
                this.Memory.WriteLong(command);
            }
            return;
        }
        this.Memory.WriteByte(CommandType.ctEndCommand);
        this.Memory.WriteLong(command);
    },
    put_PenLineJoin: function (_join) {
        this.Memory.WriteByte(CommandType.ctPenLineJoin);
        this.Memory.WriteByte(_join & 255);
    },
    put_TextureBounds: function (x, y, w, h) {
        this.Memory.WriteByte(CommandType.ctBrushRectable);
        this.Memory.WriteDouble(x);
        this.Memory.WriteDouble(y);
        this.Memory.WriteDouble(w);
        this.Memory.WriteDouble(h);
    },
    put_TextureBoundsEnabled: function (bIsEnabled) {
        this.Memory.WriteByte(CommandType.ctBrushRectableEnabled);
        this.Memory.WriteBool(bIsEnabled);
    },
    SetFontSlot: function (slot, fontSizeKoef) {
        var _rfonts = this.m_oGrFonts;
        var _lastFont = this.m_oFontSlotFont;
        switch (slot) {
        case fontslot_ASCII:
            _lastFont.Name = _rfonts.Ascii.Name;
            _lastFont.Size = this.m_oTextPr.FontSize;
            _lastFont.Bold = this.m_oTextPr.Bold;
            _lastFont.Italic = this.m_oTextPr.Italic;
            break;
        case fontslot_CS:
            _lastFont.Name = _rfonts.CS.Name;
            _lastFont.Size = this.m_oTextPr.FontSizeCS;
            _lastFont.Bold = this.m_oTextPr.BoldCS;
            _lastFont.Italic = this.m_oTextPr.ItalicCS;
            break;
        case fontslot_EastAsia:
            _lastFont.Name = _rfonts.EastAsia.Name;
            _lastFont.Size = this.m_oTextPr.FontSize;
            _lastFont.Bold = this.m_oTextPr.Bold;
            _lastFont.Italic = this.m_oTextPr.Italic;
            break;
        case fontslot_HAnsi:
            default:
            _lastFont.Name = _rfonts.HAnsi.Name;
            _lastFont.Size = this.m_oTextPr.FontSize;
            _lastFont.Bold = this.m_oTextPr.Bold;
            _lastFont.Italic = this.m_oTextPr.Italic;
            break;
        }
        if (undefined !== fontSizeKoef) {
            _lastFont.Size *= fontSizeKoef;
        }
        var style = 0;
        if (_lastFont.Italic == true) {
            style += 2;
        }
        if (_lastFont.Bold == true) {
            style += 1;
        }
        var fontinfo = g_fontApplication.GetFontInfo(_lastFont.Name, style, this.LastFontOriginInfo);
        style = fontinfo.GetBaseStyle(style);
        if (this.m_oFont.Name != fontinfo.Name) {
            this.m_oFont.Name = fontinfo.Name;
            this.Memory.WriteByte(CommandType.ctFontName);
            this.Memory.WriteString(this.m_oFont.Name);
        }
        if (this.m_oFont.FontSize != _lastFont.Size) {
            this.m_oFont.FontSize = _lastFont.Size;
            this.Memory.WriteByte(CommandType.ctFontSize);
            this.Memory.WriteDouble(this.m_oFont.FontSize);
        }
        if (this.m_oFont.Style != style) {
            this.m_oFont.Style = style;
            this.Memory.WriteByte(CommandType.ctFontStyle);
            this.Memory.WriteLong(style);
        }
    }
};
function CDocumentRenderer() {
    this.m_arrayPages = [];
    this.m_lPagesCount = 0;
    this.Memory = new CMemory();
    this.VectorMemoryForPrint = null;
    this.ClipManager = new CClipManager();
    this.ClipManager.BaseObject = this;
    this.RENDERER_PDF_FLAG = true;
    this.ArrayPoints = null;
    this.GrState = new CGrState();
    this.GrState.Parent = this;
    this.m_oPen = null;
    this.m_oBrush = null;
    this.m_oTransform = null;
    this._restoreDumpedVectors = null;
}
CDocumentRenderer.prototype = {
    BeginPage: function (width, height) {
        this.m_arrayPages[this.m_arrayPages.length] = new CMetafile(width, height);
        this.m_lPagesCount = this.m_arrayPages.length;
        this.m_arrayPages[this.m_lPagesCount - 1].Memory = this.Memory;
        this.m_arrayPages[this.m_lPagesCount - 1].VectorMemoryForPrint = this.VectorMemoryForPrint;
        this.Memory.WriteByte(CommandType.ctPageStart);
        this.Memory.WriteByte(CommandType.ctPageWidth);
        this.Memory.WriteDouble(width);
        this.Memory.WriteByte(CommandType.ctPageHeight);
        this.Memory.WriteDouble(height);
        var _page = this.m_arrayPages[this.m_lPagesCount - 1];
        this.m_oPen = _page.m_oPen;
        this.m_oBrush = _page.m_oBrush;
        this.m_oTransform = _page.m_oTransform;
    },
    EndPage: function () {
        this.Memory.WriteByte(CommandType.ctPageEnd);
    },
    p_color: function (r, g, b, a) {
        if (0 != this.m_lPagesCount) {
            this.m_arrayPages[this.m_lPagesCount - 1].p_color(r, g, b, a);
        }
    },
    p_width: function (w) {
        if (0 != this.m_lPagesCount) {
            this.m_arrayPages[this.m_lPagesCount - 1].p_width(w);
        }
    },
    b_color1: function (r, g, b, a) {
        if (0 != this.m_lPagesCount) {
            this.m_arrayPages[this.m_lPagesCount - 1].b_color1(r, g, b, a);
        }
    },
    b_color2: function (r, g, b, a) {
        if (0 != this.m_lPagesCount) {
            this.m_arrayPages[this.m_lPagesCount - 1].b_color2(r, g, b, a);
        }
    },
    transform: function (sx, shy, shx, sy, tx, ty) {
        if (0 != this.m_lPagesCount) {
            this.m_arrayPages[this.m_lPagesCount - 1].transform(sx, shy, shx, sy, tx, ty);
        }
    },
    transform3: function (m) {
        this.transform(m.sx, m.shy, m.shx, m.sy, m.tx, m.ty);
    },
    reset: function () {
        this.transform(1, 0, 0, 1, 0, 0);
    },
    _s: function () {
        if (0 != this.m_lPagesCount) {
            this.m_arrayPages[this.m_lPagesCount - 1]._s();
        }
    },
    _e: function () {
        if (0 != this.m_lPagesCount) {
            this.m_arrayPages[this.m_lPagesCount - 1]._e();
        }
    },
    _z: function () {
        if (0 != this.m_lPagesCount) {
            this.m_arrayPages[this.m_lPagesCount - 1]._z();
        }
    },
    _m: function (x, y) {
        if (0 != this.m_lPagesCount) {
            this.m_arrayPages[this.m_lPagesCount - 1]._m(x, y);
        }
        if (this.ArrayPoints != null) {
            this.ArrayPoints[this.ArrayPoints.length] = {
                x: x,
                y: y
            };
        }
    },
    _l: function (x, y) {
        if (0 != this.m_lPagesCount) {
            this.m_arrayPages[this.m_lPagesCount - 1]._l(x, y);
        }
        if (this.ArrayPoints != null) {
            this.ArrayPoints[this.ArrayPoints.length] = {
                x: x,
                y: y
            };
        }
    },
    _c: function (x1, y1, x2, y2, x3, y3) {
        if (0 != this.m_lPagesCount) {
            this.m_arrayPages[this.m_lPagesCount - 1]._c(x1, y1, x2, y2, x3, y3);
        }
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
    },
    _c2: function (x1, y1, x2, y2) {
        if (0 != this.m_lPagesCount) {
            this.m_arrayPages[this.m_lPagesCount - 1]._c2(x1, y1, x2, y2);
        }
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
    },
    ds: function () {
        if (0 != this.m_lPagesCount) {
            this.m_arrayPages[this.m_lPagesCount - 1].ds();
        }
    },
    df: function () {
        if (0 != this.m_lPagesCount) {
            this.m_arrayPages[this.m_lPagesCount - 1].df();
        }
    },
    drawpath: function (type) {
        if (0 != this.m_lPagesCount) {
            this.m_arrayPages[this.m_lPagesCount - 1].drawpath(type);
        }
    },
    save: function () {},
    restore: function () {},
    clip: function () {},
    drawImage: function (img, x, y, w, h, alpha, srcRect) {
        if (img == null || img == undefined || img == "") {
            return;
        }
        if (0 != this.m_lPagesCount) {
            if (!srcRect) {
                this.m_arrayPages[this.m_lPagesCount - 1].drawImage(img, x, y, w, h);
            } else {
                var _img = undefined;
                if (window.editor) {
                    _img = window.editor.ImageLoader.map_image_index[img];
                } else {
                    if (window["Asc"]["editor"]) {
                        _img = window["Asc"]["editor"].ImageLoader.map_image_index[img];
                    }
                }
                var w0 = 0;
                var h0 = 0;
                if (_img != undefined && _img.Image != null) {
                    w0 = _img.Image.width;
                    h0 = _img.Image.height;
                }
                if (w0 == 0 || h0 == 0) {
                    this.m_arrayPages[this.m_lPagesCount - 1].drawImage(img, x, y, w, h);
                    return;
                }
                var bIsClip = false;
                if (srcRect.l > 0 || srcRect.t > 0 || srcRect.r < 100 || srcRect.b < 100) {
                    bIsClip = true;
                }
                if (bIsClip) {
                    this.SaveGrState();
                    this.AddClipRect(x, y, w, h);
                }
                var __w = w;
                var __h = h;
                var _delW = Math.max(0, -srcRect.l) + Math.max(0, srcRect.r - 100) + 100;
                var _delH = Math.max(0, -srcRect.t) + Math.max(0, srcRect.b - 100) + 100;
                if (srcRect.l < 0) {
                    var _off = ((-srcRect.l / _delW) * __w);
                    x += _off;
                    w -= _off;
                }
                if (srcRect.t < 0) {
                    var _off = ((-srcRect.t / _delH) * __h);
                    y += _off;
                    h -= _off;
                }
                if (srcRect.r > 100) {
                    var _off = ((srcRect.r - 100) / _delW) * __w;
                    w -= _off;
                }
                if (srcRect.b > 100) {
                    var _off = ((srcRect.b - 100) / _delH) * __h;
                    h -= _off;
                }
                var _wk = 100;
                if (srcRect.l > 0) {
                    _wk -= srcRect.l;
                }
                if (srcRect.r < 100) {
                    _wk -= (100 - srcRect.r);
                }
                _wk = 100 / _wk;
                var _hk = 100;
                if (srcRect.t > 0) {
                    _hk -= srcRect.t;
                }
                if (srcRect.b < 100) {
                    _hk -= (100 - srcRect.b);
                }
                _hk = 100 / _hk;
                var _r = x + w;
                var _b = y + h;
                if (srcRect.l > 0) {
                    x -= ((srcRect.l * _wk * w) / 100);
                }
                if (srcRect.t > 0) {
                    y -= ((srcRect.t * _hk * h) / 100);
                }
                if (srcRect.r < 100) {
                    _r += (((100 - srcRect.r) * _wk * w) / 100);
                }
                if (srcRect.b < 100) {
                    _b += (((100 - srcRect.b) * _hk * h) / 100);
                }
                this.m_arrayPages[this.m_lPagesCount - 1].drawImage(img, x, y, _r - x, _b - y);
                if (bIsClip) {
                    this.RestoreGrState();
                }
            }
        }
    },
    SetFont: function (font) {
        if (0 != this.m_lPagesCount) {
            this.m_arrayPages[this.m_lPagesCount - 1].SetFont(font);
        }
    },
    FillText: function (x, y, text, cropX, cropW) {
        if (0 != this.m_lPagesCount) {
            this.m_arrayPages[this.m_lPagesCount - 1].FillText(x, y, text);
        }
    },
    FillTextCode: function (x, y, text, cropX, cropW) {
        if (0 != this.m_lPagesCount) {
            this.m_arrayPages[this.m_lPagesCount - 1].FillTextCode(x, y, text);
        }
    },
    tg: function (gid, x, y) {
        if (0 != this.m_lPagesCount) {
            this.m_arrayPages[this.m_lPagesCount - 1].tg(gid, x, y);
        }
    },
    FillText2: function (x, y, text) {
        if (0 != this.m_lPagesCount) {
            this.m_arrayPages[this.m_lPagesCount - 1].FillText(x, y, text);
        }
    },
    charspace: function (space) {},
    SetIntegerGrid: function (param) {},
    GetIntegerGrid: function () {},
    GetFont: function () {
        if (0 != this.m_lPagesCount) {
            return this.m_arrayPages[this.m_lPagesCount - 1].m_oFont;
        }
        return null;
    },
    put_GlobalAlpha: function (enable, alpha) {},
    Start_GlobalAlpha: function () {},
    End_GlobalAlpha: function () {},
    DrawHeaderEdit: function (yPos) {},
    DrawFooterEdit: function (yPos) {},
    drawCollaborativeChanges: function (x, y, w, h) {},
    drawSearchResult: function (x, y, w, h) {},
    DrawEmptyTableLine: function (x1, y1, x2, y2) {},
    DrawLockParagraph: function (lock_type, x, y1, y2) {},
    DrawLockObjectRect: function (lock_type, x, y, w, h) {},
    DrawSpellingLine: function (y0, x0, x1, w) {},
    drawHorLine: function (align, y, x, r, penW) {
        this.p_width(1000 * penW);
        this._s();
        var _y = y;
        switch (align) {
        case 0:
            _y = y + penW / 2;
            break;
        case 1:
            break;
        case 2:
            _y = y - penW / 2;
        }
        this._m(x, y);
        this._l(r, y);
        this.ds();
        this._e();
    },
    drawHorLine2: function (align, y, x, r, penW) {
        this.p_width(1000 * penW);
        var _y = y;
        switch (align) {
        case 0:
            _y = y + penW / 2;
            break;
        case 1:
            break;
        case 2:
            _y = y - penW / 2;
            break;
        }
        this._s();
        this._m(x, (_y - penW));
        this._l(r, (_y - penW));
        this.ds();
        this._s();
        this._m(x, (_y + penW));
        this._l(r, (_y + penW));
        this.ds();
        this._e();
    },
    drawVerLine: function (align, x, y, b, penW) {
        this.p_width(1000 * penW);
        this._s();
        var _x = x;
        switch (align) {
        case 0:
            _x = x + penW / 2;
            break;
        case 1:
            break;
        case 2:
            _x = x - penW / 2;
        }
        this._m(_x, y);
        this._l(_x, b);
        this.ds();
    },
    drawHorLineExt: function (align, y, x, r, penW, leftMW, rightMW) {
        this.drawHorLine(align, y, x + leftMW, r + rightMW, penW);
    },
    rect: function (x, y, w, h) {
        var _x = x;
        var _y = y;
        var _r = (x + w);
        var _b = (y + h);
        this._s();
        this._m(_x, _y);
        this._l(_r, _y);
        this._l(_r, _b);
        this._l(_x, _b);
        this._l(_x, _y);
    },
    TableRect: function (x, y, w, h) {
        this.rect(x, y, w, h);
        this.df();
    },
    put_PenLineJoin: function (_join) {
        if (0 != this.m_lPagesCount) {
            this.m_arrayPages[this.m_lPagesCount - 1].put_PenLineJoin(_join);
        }
    },
    put_TextureBounds: function (x, y, w, h) {
        if (0 != this.m_lPagesCount) {
            this.m_arrayPages[this.m_lPagesCount - 1].put_TextureBounds(x, y, w, h);
        }
    },
    put_TextureBoundsEnabled: function (val) {
        if (0 != this.m_lPagesCount) {
            this.m_arrayPages[this.m_lPagesCount - 1].put_TextureBoundsEnabled(val);
        }
    },
    put_brushTexture: function (src, mode) {
        if (src == null || src == undefined) {
            src = "";
        }
        if (0 != this.m_lPagesCount) {
            this.m_arrayPages[this.m_lPagesCount - 1].put_brushTexture(src, mode);
        }
    },
    put_BrushTextureAlpha: function (alpha) {
        if (0 != this.m_lPagesCount) {
            this.m_arrayPages[this.m_lPagesCount - 1].put_BrushTextureAlpha(alpha);
        }
    },
    put_BrushGradient: function (gradFill, points, transparent) {
        if (0 != this.m_lPagesCount) {
            this.m_arrayPages[this.m_lPagesCount - 1].put_BrushGradient(gradFill, points, transparent);
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
        if (0 != this.m_lPagesCount) {
            this.m_arrayPages[this.m_lPagesCount - 1].beginCommand(32);
        }
        this.rect(r.x, r.y, r.w, r.h);
        if (0 != this.m_lPagesCount) {
            this.m_arrayPages[this.m_lPagesCount - 1].endCommand(32);
        }
    },
    RemoveClip: function () {
        if (0 != this.m_lPagesCount) {
            this.m_arrayPages[this.m_lPagesCount - 1].beginCommand(64);
            this.m_arrayPages[this.m_lPagesCount - 1].endCommand(64);
        }
    },
    GetTransform: function () {
        if (0 != this.m_lPagesCount) {
            return this.m_arrayPages[this.m_lPagesCount - 1].m_oTransform;
        }
        return null;
    },
    GetLineWidth: function () {
        if (0 != this.m_lPagesCount) {
            return this.m_arrayPages[this.m_lPagesCount - 1].m_oPen.Size;
        }
        return 0;
    },
    GetPen: function () {
        if (0 != this.m_lPagesCount) {
            return this.m_arrayPages[this.m_lPagesCount - 1].m_oPen;
        }
        return 0;
    },
    GetBrush: function () {
        if (0 != this.m_lPagesCount) {
            return this.m_arrayPages[this.m_lPagesCount - 1].m_oBrush;
        }
        return 0;
    },
    drawFlowAnchor: function (x, y) {},
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
    StartClipPath: function () {
        this.private_removeVectors();
        if (0 != this.m_lPagesCount) {
            this.m_arrayPages[this.m_lPagesCount - 1].beginCommand(32);
        }
    },
    EndClipPath: function () {
        if (0 != this.m_lPagesCount) {
            this.m_arrayPages[this.m_lPagesCount - 1].endCommand(32);
        }
        this.private_restoreVectors();
    },
    SetTextPr: function (textPr, theme) {
        if (0 != this.m_lPagesCount) {
            var _page = this.m_arrayPages[this.m_lPagesCount - 1];
            _page.m_oTextPr = textPr;
            if (theme) {
                _page.m_oGrFonts.checkFromTheme(theme.themeElements.fontScheme, _page.m_oTextPr.RFonts);
            } else {
                _page.m_oGrFonts = _page.m_oTextPr.RFonts;
            }
        }
    },
    SetFontSlot: function (slot, fontSizeKoef) {
        if (0 != this.m_lPagesCount) {
            this.m_arrayPages[this.m_lPagesCount - 1].SetFontSlot(slot, fontSizeKoef);
        }
    },
    GetTextPr: function () {
        if (0 != this.m_lPagesCount) {
            return this.m_arrayPages[this.m_lPagesCount - 1].m_oTextPr;
        }
        return null;
    },
    DrawPresentationComment: function (type, x, y, w, h) {},
    private_removeVectors: function () {
        this._restoreDumpedVectors = this.VectorMemoryForPrint;
        if (this._restoreDumpedVectors != null) {
            this.VectorMemoryForPrint = null;
            if (0 != this.m_lPagesCount) {
                this.m_arrayPages[this.m_lPagesCount - 1].VectorMemoryForPrint = null;
            }
        }
    },
    private_restoreVectors: function () {
        if (null != this._restoreDumpedVectors) {
            this.VectorMemoryForPrint = this._restoreDumpedVectors;
            if (0 != this.m_lPagesCount) {
                this.m_arrayPages[this.m_lPagesCount - 1].VectorMemoryForPrint = this._restoreDumpedVectors;
            }
        }
        this._restoreDumpedVectors = null;
    }
};