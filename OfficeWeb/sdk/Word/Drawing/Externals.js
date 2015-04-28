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
function ZBase32Encoder() {
    this.EncodingTable = "ybndrfg8ejkmcpqxot1uwisza345h769";
    this.DecodingTable = ("undefined" == typeof Uint8Array) ? new Array(128) : new Uint8Array(128);
    var ii = 0;
    for (ii = 0; ii < 128; ii++) {
        this.DecodingTable[ii] = 255;
    }
    var _len_32 = this.EncodingTable.length;
    for (ii = 0; ii < _len_32; ii++) {
        this.DecodingTable[this.EncodingTable.charCodeAt(ii)] = ii;
    }
    this.GetUTF16_fromUnicodeChar = function (code) {
        if (code < 65536) {
            return String.fromCharCode(code);
        } else {
            code -= 65536;
            return String.fromCharCode(55296 | ((code >> 10) & 1023)) + String.fromCharCode(56320 | (code & 1023));
        }
    };
    this.GetUTF16_fromUTF8 = function (pBuffer) {
        var _res = "";
        var lIndex = 0;
        var lCount = pBuffer.length;
        var val = 0;
        while (lIndex < lCount) {
            var byteMain = pBuffer[lIndex];
            if (0 == (byteMain & 128)) {
                _res += this.GetUTF16_fromUnicodeChar(byteMain);
                ++lIndex;
            } else {
                if (0 == (byteMain & 32)) {
                    val = (((byteMain & 31) << 6) | (pBuffer[lIndex + 1] & 63));
                    _res += this.GetUTF16_fromUnicodeChar(val);
                    lIndex += 2;
                } else {
                    if (0 == (byteMain & 16)) {
                        val = (((byteMain & 15) << 12) | ((pBuffer[lIndex + 1] & 63) << 6) | (pBuffer[lIndex + 2] & 63));
                        _res += this.GetUTF16_fromUnicodeChar(val);
                        lIndex += 3;
                    } else {
                        if (0 == (byteMain & 8)) {
                            val = (((byteMain & 7) << 18) | ((pBuffer[lIndex + 1] & 63) << 12) | ((pBuffer[lIndex + 2] & 63) << 6) | (pBuffer[lIndex + 3] & 63));
                            _res += this.GetUTF16_fromUnicodeChar(val);
                            lIndex += 4;
                        } else {
                            if (0 == (byteMain & 4)) {
                                val = (((byteMain & 3) << 24) | ((pBuffer[lIndex + 1] & 63) << 18) | ((pBuffer[lIndex + 2] & 63) << 12) | ((pBuffer[lIndex + 3] & 63) << 6) | (pBuffer[lIndex + 4] & 63));
                                _res += this.GetUTF16_fromUnicodeChar(val);
                                lIndex += 5;
                            } else {
                                val = (((byteMain & 1) << 30) | ((pBuffer[lIndex + 1] & 63) << 24) | ((pBuffer[lIndex + 2] & 63) << 18) | ((pBuffer[lIndex + 3] & 63) << 12) | ((pBuffer[lIndex + 4] & 63) << 6) | (pBuffer[lIndex + 5] & 63));
                                _res += this.GetUTF16_fromUnicodeChar(val);
                                lIndex += 5;
                            }
                        }
                    }
                }
            }
        }
        return _res;
    };
    this.GetUTF8_fromUTF16 = function (sData) {
        var pCur = 0;
        var pEnd = sData.length;
        var result = [];
        while (pCur < pEnd) {
            var code = sData.charCodeAt(pCur++);
            if (code >= 55296 && code <= 57343 && pCur < pEnd) {
                code = 65536 + (((code & 1023) << 10) | (1023 & sData.charCodeAt(pCur++)));
            }
            if (code < 128) {
                result.push(code);
            } else {
                if (code < 2048) {
                    result.push(192 | (code >> 6));
                    result.push(128 | (code & 63));
                } else {
                    if (code < 65536) {
                        result.push(224 | (code >> 12));
                        result.push(128 | ((code >> 6) & 63));
                        result.push(128 | (code & 63));
                    } else {
                        if (code < 2097151) {
                            result.push(240 | (code >> 18));
                            result.push(128 | ((code >> 12) & 63));
                            result.push(128 | ((code >> 6) & 63));
                            result.push(128 | (code & 63));
                        } else {
                            if (code < 67108863) {
                                result.push(248 | (code >> 24));
                                result.push(128 | ((code >> 18) & 63));
                                result.push(128 | ((code >> 12) & 63));
                                result.push(128 | ((code >> 6) & 63));
                                result.push(128 | (code & 63));
                            } else {
                                if (code < 2147483647) {
                                    result.push(252 | (code >> 30));
                                    result.push(128 | ((code >> 24) & 63));
                                    result.push(128 | ((code >> 18) & 63));
                                    result.push(128 | ((code >> 12) & 63));
                                    result.push(128 | ((code >> 6) & 63));
                                    result.push(128 | (code & 63));
                                }
                            }
                        }
                    }
                }
            }
        }
        return result;
    };
    this.Encode = function (sData) {
        var data = this.GetUTF8_fromUTF16(sData);
        var encodedResult = "";
        var len = data.length;
        for (var i = 0; i < len; i += 5) {
            var byteCount = Math.min(5, len - i);
            var buffer = 0;
            for (var j = 0; j < byteCount; ++j) {
                buffer *= 256;
                buffer += data[i + j];
            }
            var bitCount = byteCount * 8;
            while (bitCount > 0) {
                var index = 0;
                if (bitCount >= 5) {
                    var _del = Math.pow(2, bitCount - 5);
                    index = (buffer / _del) & 31;
                } else {
                    index = (buffer & (31 >> (5 - bitCount)));
                    index <<= (5 - bitCount);
                }
                encodedResult += this.EncodingTable.charAt(index);
                bitCount -= 5;
            }
        }
        return encodedResult;
    };
    this.Decode = function (data) {
        var result = [];
        var _len = data.length;
        var obj = {
            data: data,
            index: new Array(8)
        };
        var cur = 0;
        while (cur < _len) {
            cur = this.CreateIndexByOctetAndMovePosition(obj, cur);
            var shortByteCount = 0;
            var buffer = 0;
            for (var j = 0; j < 8 && obj.index[j] != -1; ++j) {
                buffer *= 32;
                buffer += (this.DecodingTable[obj.index[j]] & 31);
                shortByteCount++;
            }
            var bitCount = shortByteCount * 5;
            while (bitCount >= 8) {
                var _del = Math.pow(2, bitCount - 8);
                var _res = (buffer / _del) & 255;
                result.push(_res);
                bitCount -= 8;
            }
        }
        this.GetUTF16_fromUTF8(result);
    };
    this.CreateIndexByOctetAndMovePosition = function (obj, currentPosition) {
        var j = 0;
        while (j < 8) {
            if (currentPosition >= obj.data.length) {
                obj.index[j++] = -1;
                continue;
            }
            if (this.IgnoredSymbol(obj.data.charCodeAt(currentPosition))) {
                currentPosition++;
                continue;
            }
            obj.index[j] = obj.data[currentPosition];
            j++;
            currentPosition++;
        }
        return currentPosition;
    };
    this.IgnoredSymbol = function (checkedSymbol) {
        return (checkedSymbol >= 128 || this.DecodingTable[checkedSymbol] == 255);
    };
}
var ASC_DOCS_API_USE_FONTS_ORIGINAL_FORMAT = true;
var bIsLocalFontsUse = false;
function _is_support_cors() {
    if (window["NATIVE_EDITOR_ENJINE"] === true) {
        return false;
    }
    var xhrSupported = new XMLHttpRequest();
    return !! xhrSupported && ("withCredentials" in xhrSupported);
}
var bIsSupportOriginalFormatFonts = _is_support_cors();
function postLoadScript(scriptName) {
    window.postMessage({
        type: "FROM_PAGE_LOAD_SCRIPT",
        text: scriptName
    },
    "*");
}
function CFontFileLoader(id) {
    this.Id = id;
    this.Status = -1;
    this.stream_index = -1;
    this.callback = null;
    this.IsNeedAddJSToFontPath = true;
    this.CanUseOriginalFormat = true;
    var oThis = this;
    this.CheckLoaded = function () {
        return (0 == this.Status || 1 == this.Status);
    };
    this.LoadFontAsync = function (basePath, _callback) {
        if (ASC_DOCS_API_USE_FONTS_ORIGINAL_FORMAT && this.CanUseOriginalFormat && bIsSupportOriginalFormatFonts && !window["qtDocBridge"] && !window["scriptBridge"]) {
            this.LoadFontAsync2(basePath, _callback);
            return;
        }
        this.callback = _callback;
        if (-1 != this.Status) {
            return true;
        }
        this.Status = 2;
        if (bIsLocalFontsUse) {
            postLoadScript(this.Id);
            return;
        }
        var scriptElem = document.createElement("script");
        if (scriptElem.readyState && false) {
            scriptElem.onreadystatechange = function () {
                if (this.readyState == "complete" || this.readyState == "loaded") {
                    scriptElem.onreadystatechange = null;
                    setTimeout(oThis._callback_font_load, 0);
                }
            };
        }
        scriptElem.onload = scriptElem.onerror = oThis._callback_font_load;
        if (this.IsNeedAddJSToFontPath) {
            if (!window.g_fontNamesEncoder) {
                window.g_fontNamesEncoder = new ZBase32Encoder();
            }
            var _name = window.g_fontNamesEncoder.Encode(this.Id + ".js") + ".js";
            scriptElem.setAttribute("src", basePath + "js/" + _name);
        } else {
            scriptElem.setAttribute("src", basePath + this.Id + ".js");
        }
        scriptElem.setAttribute("type", "text/javascript");
        document.getElementsByTagName("head")[0].appendChild(scriptElem);
        return false;
    };
    this._callback_font_load = function () {
        if (!window[oThis.Id]) {
            oThis.Status = 1;
        }
        var __font_data_idx = g_fonts_streams.length;
        g_fonts_streams[__font_data_idx] = CreateFontData4(window[oThis.Id]);
        oThis.SetStreamIndex(__font_data_idx);
        oThis.Status = 0;
        delete window[oThis.Id];
        if (null != oThis.callback) {
            oThis.callback();
        }
    };
    this.LoadFontAsync2 = function (basePath, _callback) {
        this.callback = _callback;
        if (-1 != this.Status) {
            return true;
        }
        if (bIsLocalFontsUse) {
            postLoadScript(this.Id);
            return;
        }
        this.Status = 2;
        var xhr = new XMLHttpRequest();
        if (!window.g_fontNamesEncoder) {
            window.g_fontNamesEncoder = new ZBase32Encoder();
        }
        var _name = window.g_fontNamesEncoder.Encode(this.Id) + ".js";
        xhr.open("GET", basePath + "odttf/" + _name, true);
        if (typeof ArrayBuffer !== "undefined" && !window.opera) {
            xhr.responseType = "arraybuffer";
        }
        if (xhr.overrideMimeType) {
            xhr.overrideMimeType("text/plain; charset=x-user-defined");
        } else {
            xhr.setRequestHeader("Accept-Charset", "x-user-defined");
        }
        xhr.onload = function () {
            if (this.status != 200) {
                oThis.Status = 1;
                return;
            }
            oThis.Status = 0;
            if (typeof ArrayBuffer !== "undefined" && !window.opera && this.response) {
                var __font_data_idx = g_fonts_streams.length;
                var _uintData = new Uint8Array(this.response);
                g_fonts_streams[__font_data_idx] = new FT_Stream(_uintData, _uintData.length);
                oThis.SetStreamIndex(__font_data_idx);
            } else {
                if (AscBrowser.isIE) {
                    var _response = new VBArray(this["responseBody"]).toArray();
                    var srcLen = _response.length;
                    var pointer = g_memory.Alloc(srcLen);
                    var stream = new FT_Stream(pointer.data, srcLen);
                    stream.obj = pointer.obj;
                    var dstPx = stream.data;
                    var index = 0;
                    while (index < srcLen) {
                        dstPx[index] = _response[index];
                        index++;
                    }
                    var __font_data_idx = g_fonts_streams.length;
                    g_fonts_streams[__font_data_idx] = stream;
                    oThis.SetStreamIndex(__font_data_idx);
                } else {
                    var __font_data_idx = g_fonts_streams.length;
                    g_fonts_streams[__font_data_idx] = CreateFontData3(this.responseText);
                    oThis.SetStreamIndex(__font_data_idx);
                }
            }
            var guidOdttf = [160, 102, 214, 32, 20, 150, 71, 250, 149, 105, 184, 80, 176, 65, 73, 72];
            var _stream = g_fonts_streams[g_fonts_streams.length - 1];
            var _data = _stream.data;
            var _count_decode = Math.min(32, _stream.size);
            for (var i = 0; i < _count_decode; ++i) {
                _data[i] ^= guidOdttf[i % 16];
            }
        };
        xhr.send(null);
    };
    this.LoadFontNative = function () {
        if (window["use_native_fonts_only"] === true) {
            this.Status = 0;
            return;
        }
        var __font_data_idx = g_fonts_streams.length;
        var _data = window["native"]["GetFontBinary"](this.Id);
        g_fonts_streams[__font_data_idx] = new FT_Stream(_data, _data.length);
        this.SetStreamIndex(__font_data_idx);
        this.Status = 0;
    };
}
CFontFileLoader.prototype.SetStreamIndex = function (index) {
    this.stream_index = index;
};
var FONT_TYPE_ADDITIONAL = 0;
var FONT_TYPE_STANDART = 1;
var FONT_TYPE_EMBEDDED = 2;
var FONT_TYPE_ADDITIONAL_CUT = 3;
var fontstyle_mask_regular = 1;
var fontstyle_mask_italic = 2;
var fontstyle_mask_bold = 4;
var fontstyle_mask_bolditalic = 8;
function GenerateMapId(api, name, style, size) {
    var fontInfo = api.FontLoader.fontInfos[api.FontLoader.map_font_index[name]];
    var index = -1;
    var bNeedBold = false;
    var bNeedItalic = false;
    var index = -1;
    var faceIndex = 0;
    var bSrcItalic = false;
    var bSrcBold = false;
    switch (style) {
    case FontStyle.FontStyleBoldItalic:
        bSrcItalic = true;
        bSrcBold = true;
        bNeedBold = true;
        bNeedItalic = true;
        if (-1 != fontInfo.indexBI) {
            index = fontInfo.indexBI;
            faceIndex = fontInfo.faceIndexBI;
            bNeedBold = false;
            bNeedItalic = false;
        } else {
            if (-1 != fontInfo.indexB) {
                index = fontInfo.indexB;
                faceIndex = fontInfo.faceIndexB;
                bNeedBold = false;
            } else {
                if (-1 != fontInfo.indexI) {
                    index = fontInfo.indexI;
                    faceIndex = fontInfo.faceIndexI;
                    bNeedItalic = false;
                } else {
                    index = fontInfo.indexR;
                    faceIndex = fontInfo.faceIndexR;
                }
            }
        }
        break;
    case FontStyle.FontStyleBold:
        bSrcBold = true;
        bNeedBold = true;
        bNeedItalic = false;
        if (-1 != fontInfo.indexB) {
            index = fontInfo.indexB;
            faceIndex = fontInfo.faceIndexB;
            bNeedBold = false;
        } else {
            if (-1 != fontInfo.indexR) {
                index = fontInfo.indexR;
                faceIndex = fontInfo.faceIndexR;
            } else {
                if (-1 != fontInfo.indexBI) {
                    index = fontInfo.indexBI;
                    faceIndex = fontInfo.faceIndexBI;
                    bNeedBold = false;
                } else {
                    index = fontInfo.indexI;
                    faceIndex = fontInfo.faceIndexI;
                }
            }
        }
        break;
    case FontStyle.FontStyleItalic:
        bSrcItalic = true;
        bNeedBold = false;
        bNeedItalic = true;
        if (-1 != fontInfo.indexI) {
            index = fontInfo.indexI;
            faceIndex = fontInfo.faceIndexI;
            bNeedItalic = false;
        } else {
            if (-1 != fontInfo.indexR) {
                index = fontInfo.indexR;
                faceIndex = fontInfo.faceIndexR;
            } else {
                if (-1 != fontInfo.indexBI) {
                    index = fontInfo.indexBI;
                    faceIndex = fontInfo.faceIndexBI;
                    bNeedItalic = false;
                } else {
                    index = fontInfo.indexB;
                    faceIndex = fontInfo.faceIndexB;
                }
            }
        }
        break;
    case FontStyle.FontStyleRegular:
        bNeedBold = false;
        bNeedItalic = false;
        if (-1 != fontInfo.indexR) {
            index = fontInfo.indexR;
            faceIndex = fontInfo.faceIndexR;
        } else {
            if (-1 != fontInfo.indexI) {
                index = fontInfo.indexI;
                faceIndex = fontInfo.faceIndexI;
            } else {
                if (-1 != fontInfo.indexB) {
                    index = fontInfo.indexB;
                    faceIndex = fontInfo.faceIndexB;
                } else {
                    index = fontInfo.indexBI;
                    faceIndex = fontInfo.faceIndexBI;
                }
            }
        }
    }
    var _ext = "";
    if (bNeedBold) {
        _ext += "nbold";
    }
    if (bNeedItalic) {
        _ext += "nitalic";
    }
    var fontfile = api.FontLoader.fontFiles[index];
    return fontfile.Id + faceIndex + size + _ext;
}
function CFontInfo(sName, thumbnail, type, indexR, faceIndexR, indexI, faceIndexI, indexB, faceIndexB, indexBI, faceIndexBI) {
    this.Name = sName;
    this.Thumbnail = thumbnail;
    this.Type = type;
    this.NeedStyles = 0;
    this.indexR = indexR;
    this.faceIndexR = faceIndexR;
    this.needR = false;
    this.indexI = indexI;
    this.faceIndexI = faceIndexI;
    this.needI = false;
    this.indexB = indexB;
    this.faceIndexB = faceIndexB;
    this.needB = false;
    this.indexBI = indexBI;
    this.faceIndexBI = faceIndexBI;
    this.needBI = false;
}
CFontInfo.prototype = {
    CheckFontLoadStyles: function (global_loader) {
        if ((this.NeedStyles & 15) == 15) {
            this.needR = true;
            this.needI = true;
            this.needB = true;
            this.needBI = true;
        } else {
            if ((this.NeedStyles & 1) != 0) {
                if (false === this.needR) {
                    this.needR = true;
                    if (-1 == this.indexR) {
                        if (-1 != this.indexI) {
                            this.needI = true;
                        } else {
                            if (-1 != this.indexB) {
                                this.needB = true;
                            } else {
                                this.needBI = true;
                            }
                        }
                    }
                }
            }
            if ((this.NeedStyles & 2) != 0) {
                if (false === this.needI) {
                    this.needI = true;
                    if (-1 == this.indexI) {
                        if (-1 != this.indexR) {
                            this.needR = true;
                        } else {
                            if (-1 != this.indexBI) {
                                this.needBI = true;
                            } else {
                                this.needB = true;
                            }
                        }
                    }
                }
            }
            if ((this.NeedStyles & 4) != 0) {
                if (false === this.needB) {
                    this.needB = true;
                    if (-1 == this.indexB) {
                        if (-1 != this.indexR) {
                            this.needR = true;
                        } else {
                            if (-1 != this.indexBI) {
                                this.needBI = true;
                            } else {
                                this.needI = true;
                            }
                        }
                    }
                }
            }
            if ((this.NeedStyles & 8) != 0) {
                if (false === this.needBI) {
                    this.needBI = true;
                    if (-1 == this.indexBI) {
                        if (-1 != this.indexB) {
                            this.needB = true;
                        } else {
                            if (-1 != this.indexI) {
                                this.needI = true;
                            } else {
                                this.needR = true;
                            }
                        }
                    }
                }
            }
        }
        var fonts = (FONT_TYPE_EMBEDDED == this.Type) ? global_loader.embeddedFontFiles : global_loader.fontFiles;
        var basePath = (FONT_TYPE_EMBEDDED == this.Type) ? global_loader.embeddedFilesPath : global_loader.fontFilesPath;
        var isNeed = false;
        if ((this.needR === true) && (-1 != this.indexR) && (fonts[this.indexR].CheckLoaded() === false)) {
            fonts[this.indexR].LoadFontAsync(basePath, null);
            isNeed = true;
        }
        if ((this.needI === true) && (-1 != this.indexI) && (fonts[this.indexI].CheckLoaded() === false)) {
            fonts[this.indexI].LoadFontAsync(basePath, null);
            isNeed = true;
        }
        if ((this.needB === true) && (-1 != this.indexB) && (fonts[this.indexB].CheckLoaded() === false)) {
            fonts[this.indexB].LoadFontAsync(basePath, null);
            isNeed = true;
        }
        if ((this.needBI === true) && (-1 != this.indexBI) && (fonts[this.indexBI].CheckLoaded() === false)) {
            fonts[this.indexBI].LoadFontAsync(basePath, null);
            isNeed = true;
        }
        return isNeed;
    },
    CheckFontLoadStylesNoLoad: function (global_loader) {
        var fonts = (FONT_TYPE_EMBEDDED == this.Type) ? global_loader.embeddedFontFiles : global_loader.fontFiles;
        var _isNeed = false;
        if ((-1 != this.indexR) && (fonts[this.indexR].CheckLoaded() === false)) {
            _isNeed = true;
        }
        if ((-1 != this.indexI) && (fonts[this.indexI].CheckLoaded() === false)) {
            _isNeed = true;
        }
        if ((-1 != this.indexB) && (fonts[this.indexB].CheckLoaded() === false)) {
            _isNeed = true;
        }
        if ((-1 != this.indexBI) && (fonts[this.indexBI].CheckLoaded() === false)) {
            _isNeed = true;
        }
        return _isNeed;
    },
    LoadFontsFromServer: function (global_loader) {
        var fonts = global_loader.fontFiles;
        var basePath = global_loader.fontFilesPath;
        if ((-1 != this.indexR) && (fonts[this.indexR].CheckLoaded() === false)) {
            fonts[this.indexR].LoadFontAsync(basePath, null);
        }
        if ((-1 != this.indexI) && (fonts[this.indexI].CheckLoaded() === false)) {
            fonts[this.indexI].LoadFontAsync(basePath, null);
        }
        if ((-1 != this.indexB) && (fonts[this.indexB].CheckLoaded() === false)) {
            fonts[this.indexB].LoadFontAsync(basePath, null);
        }
        if ((-1 != this.indexBI) && (fonts[this.indexBI].CheckLoaded() === false)) {
            fonts[this.indexBI].LoadFontAsync(basePath, null);
        }
    },
    LoadFont: function (font_loader, fontManager, fEmSize, lStyle, dHorDpi, dVerDpi, transform) {
        var _embedded_cur = window.g_font_loader.embedded_cut_manager;
        if (_embedded_cur.bIsCutFontsUse) {
            if (this.Type != FONT_TYPE_ADDITIONAL_CUT) {
                var _font_info = _embedded_cur.map_name_cutindex[this.Name];
                if (_font_info !== undefined) {
                    return _font_info.LoadFont(window.g_font_loader, fontManager, fEmSize, lStyle, dHorDpi, dVerDpi, transform);
                }
            }
        }
        var sReturnName = this.Name;
        var bNeedBold = false;
        var bNeedItalic = false;
        var index = -1;
        var faceIndex = 0;
        var bSrcItalic = false;
        var bSrcBold = false;
        switch (lStyle) {
        case FontStyle.FontStyleBoldItalic:
            bSrcItalic = true;
            bSrcBold = true;
            bNeedBold = true;
            bNeedItalic = true;
            if (-1 != this.indexBI) {
                index = this.indexBI;
                faceIndex = this.faceIndexBI;
                bNeedBold = false;
                bNeedItalic = false;
            } else {
                if (-1 != this.indexB) {
                    index = this.indexB;
                    faceIndex = this.faceIndexB;
                    bNeedBold = false;
                } else {
                    if (-1 != this.indexI) {
                        index = this.indexI;
                        faceIndex = this.faceIndexI;
                        bNeedItalic = false;
                    } else {
                        index = this.indexR;
                        faceIndex = this.faceIndexR;
                    }
                }
            }
            break;
        case FontStyle.FontStyleBold:
            bSrcBold = true;
            bNeedBold = true;
            bNeedItalic = false;
            if (-1 != this.indexB) {
                index = this.indexB;
                faceIndex = this.faceIndexB;
                bNeedBold = false;
            } else {
                if (-1 != this.indexR) {
                    index = this.indexR;
                    faceIndex = this.faceIndexR;
                } else {
                    if (-1 != this.indexBI) {
                        index = this.indexBI;
                        faceIndex = this.faceIndexBI;
                        bNeedBold = false;
                    } else {
                        index = this.indexI;
                        faceIndex = this.faceIndexI;
                    }
                }
            }
            break;
        case FontStyle.FontStyleItalic:
            bSrcItalic = true;
            bNeedBold = false;
            bNeedItalic = true;
            if (-1 != this.indexI) {
                index = this.indexI;
                faceIndex = this.faceIndexI;
                bNeedItalic = false;
            } else {
                if (-1 != this.indexR) {
                    index = this.indexR;
                    faceIndex = this.faceIndexR;
                } else {
                    if (-1 != this.indexBI) {
                        index = this.indexBI;
                        faceIndex = this.faceIndexBI;
                        bNeedItalic = false;
                    } else {
                        index = this.indexB;
                        faceIndex = this.faceIndexB;
                    }
                }
            }
            break;
        case FontStyle.FontStyleRegular:
            bNeedBold = false;
            bNeedItalic = false;
            if (-1 != this.indexR) {
                index = this.indexR;
                faceIndex = this.faceIndexR;
            } else {
                if (-1 != this.indexI) {
                    index = this.indexI;
                    faceIndex = this.faceIndexI;
                } else {
                    if (-1 != this.indexB) {
                        index = this.indexB;
                        faceIndex = this.faceIndexB;
                    } else {
                        index = this.indexBI;
                        faceIndex = this.faceIndexBI;
                    }
                }
            }
        }
        var fontfile = null;
        if (this.Type == FONT_TYPE_EMBEDDED) {
            fontfile = font_loader.embeddedFontFiles[index];
        } else {
            if (this.Type == FONT_TYPE_ADDITIONAL_CUT) {
                fontfile = font_loader.embedded_cut_manager.font_files[index];
            } else {
                fontfile = font_loader.fontFiles[index];
            }
        }
        if (window["NATIVE_EDITOR_ENJINE"] === undefined) {
            if (fontfile.Status != 0 && (this.Type == FONT_TYPE_STANDART || this.Type == FONT_TYPE_ADDITIONAL) && null != _embedded_cur.map_name_cutindex && undefined !== _embedded_cur.map_name_cutindex[this.Name]) {
                var _font_info = _embedded_cur.map_name_cutindex[this.Name];
                if (_font_info !== undefined) {
                    return _font_info.LoadFont(window.g_font_loader, fontManager, fEmSize, lStyle, dHorDpi, dVerDpi, transform);
                }
            }
        } else {
            if (fontfile.Status != 0) {
                fontfile.LoadFontNative();
            }
        }
        var _ext = "";
        if (bNeedBold) {
            _ext += "nbold";
        }
        if (bNeedItalic) {
            _ext += "nitalic";
        }
        var pFontFile = fontManager.m_oFontsCache.LockFont(fontfile.stream_index, fontfile.Id, faceIndex, fEmSize, _ext);
        if (!pFontFile) {
            pFontFile = fontManager.m_oDefaultFont.GetDefaultFont(bSrcBold, bSrcItalic);
        } else {
            pFontFile.SetDefaultFont(fontManager.m_oDefaultFont.GetDefaultFont(bSrcBold, bSrcItalic));
        }
        if (!pFontFile) {
            return false;
        }
        pFontFile.m_oFontManager = fontManager;
        fontManager.m_pFont = pFontFile;
        pFontFile.SetNeedBold(bNeedBold);
        pFontFile.SetItalic(bNeedItalic);
        var _fEmSize = fontManager.UpdateSize(fEmSize, dVerDpi, dVerDpi);
        pFontFile.SetSizeAndDpi(_fEmSize, dHorDpi, dVerDpi);
        pFontFile.SetStringGID(fontManager.m_bStringGID);
        pFontFile.SetUseDefaultFont(fontManager.m_bUseDefaultFont);
        pFontFile.SetCharSpacing(fontManager.m_fCharSpacing);
        fontManager.m_oGlyphString.ResetCTM();
        if (undefined !== transform) {
            fontManager.SetTextMatrix2(transform.sx, transform.shy, transform.shx, transform.sy, transform.tx, transform.ty);
        } else {
            fontManager.SetTextMatrix(1, 0, 0, 1, 0, 0);
        }
        fontManager.AfterLoad();
    },
    GetFontID: function (font_loader, lStyle) {
        var sReturnName = this.Name;
        var bNeedBold = false;
        var bNeedItalic = false;
        var index = -1;
        var faceIndex = 0;
        var bSrcItalic = false;
        var bSrcBold = false;
        switch (lStyle) {
        case FontStyle.FontStyleBoldItalic:
            bSrcItalic = true;
            bSrcBold = true;
            bNeedBold = true;
            bNeedItalic = true;
            if (-1 != this.indexBI) {
                index = this.indexBI;
                faceIndex = this.faceIndexBI;
                bNeedBold = false;
                bNeedItalic = false;
            } else {
                if (-1 != this.indexB) {
                    index = this.indexB;
                    faceIndex = this.faceIndexB;
                    bNeedBold = false;
                } else {
                    if (-1 != this.indexI) {
                        index = this.indexI;
                        faceIndex = this.faceIndexI;
                        bNeedItalic = false;
                    } else {
                        index = this.indexR;
                        faceIndex = this.faceIndexR;
                    }
                }
            }
            break;
        case FontStyle.FontStyleBold:
            bSrcBold = true;
            bNeedBold = true;
            bNeedItalic = false;
            if (-1 != this.indexB) {
                index = this.indexB;
                faceIndex = this.faceIndexB;
                bNeedBold = false;
            } else {
                if (-1 != this.indexR) {
                    index = this.indexR;
                    faceIndex = this.faceIndexR;
                } else {
                    if (-1 != this.indexBI) {
                        index = this.indexBI;
                        faceIndex = this.faceIndexBI;
                        bNeedBold = false;
                    } else {
                        index = this.indexI;
                        faceIndex = this.faceIndexI;
                    }
                }
            }
            break;
        case FontStyle.FontStyleItalic:
            bSrcItalic = true;
            bNeedBold = false;
            bNeedItalic = true;
            if (-1 != this.indexI) {
                index = this.indexI;
                faceIndex = this.faceIndexI;
                bNeedItalic = false;
            } else {
                if (-1 != this.indexR) {
                    index = this.indexR;
                    faceIndex = this.faceIndexR;
                } else {
                    if (-1 != this.indexBI) {
                        index = this.indexBI;
                        faceIndex = this.faceIndexBI;
                        bNeedItalic = false;
                    } else {
                        index = this.indexB;
                        faceIndex = this.faceIndexB;
                    }
                }
            }
            break;
        case FontStyle.FontStyleRegular:
            bNeedBold = false;
            bNeedItalic = false;
            if (-1 != this.indexR) {
                index = this.indexR;
                faceIndex = this.faceIndexR;
            } else {
                if (-1 != this.indexI) {
                    index = this.indexI;
                    faceIndex = this.faceIndexI;
                } else {
                    if (-1 != this.indexB) {
                        index = this.indexB;
                        faceIndex = this.faceIndexB;
                    } else {
                        index = this.indexBI;
                        faceIndex = this.faceIndexBI;
                    }
                }
            }
        }
        var fontfile = (this.Type == FONT_TYPE_EMBEDDED) ? font_loader.embeddedFontFiles[index] : font_loader.fontFiles[index];
        return {
            id: fontfile.Id,
            faceIndex: faceIndex,
            file: fontfile
        };
    },
    GetBaseStyle: function (lStyle) {
        switch (lStyle) {
        case FontStyle.FontStyleBoldItalic:
            if (-1 != this.indexBI) {
                return FontStyle.FontStyleBoldItalic;
            } else {
                if (-1 != this.indexB) {
                    return FontStyle.FontStyleBold;
                } else {
                    if (-1 != this.indexI) {
                        return FontStyle.FontStyleItalic;
                    } else {
                        return FontStyle.FontStyleRegular;
                    }
                }
            }
            break;
        case FontStyle.FontStyleBold:
            if (-1 != this.indexB) {
                return FontStyle.FontStyleBold;
            } else {
                if (-1 != this.indexR) {
                    return FontStyle.FontStyleRegular;
                } else {
                    if (-1 != this.indexBI) {
                        return FontStyle.FontStyleBoldItalic;
                    } else {
                        return FontStyle.FontStyleItalic;
                    }
                }
            }
            break;
        case FontStyle.FontStyleItalic:
            if (-1 != this.indexI) {
                return FontStyle.FontStyleItalic;
            } else {
                if (-1 != this.indexR) {
                    return FontStyle.FontStyleRegular;
                } else {
                    if (-1 != this.indexBI) {
                        return FontStyle.FontStyleBoldItalic;
                    } else {
                        return FontStyle.FontStyleBold;
                    }
                }
            }
            break;
        case FontStyle.FontStyleRegular:
            if (-1 != this.indexR) {
                return FontStyle.FontStyleRegular;
            } else {
                if (-1 != this.indexI) {
                    return FontStyle.FontStyleItalic;
                } else {
                    if (-1 != this.indexB) {
                        return FontStyle.FontStyleBold;
                    } else {
                        return FontStyle.FontStyleBoldItalic;
                    }
                }
            }
        }
        return FontStyle.FontStyleRegular;
    }
};
function CFont(name, id, type, thumbnail, style) {
    this.name = name;
    this.id = id;
    this.type = type;
    this.thumbnail = thumbnail;
    if (null != style) {
        this.NeedStyles = style;
    } else {
        this.NeedStyles = fontstyle_mask_regular | fontstyle_mask_italic | fontstyle_mask_bold | fontstyle_mask_bolditalic;
    }
}
var ImageLoadStatus = {
    Loading: 0,
    Complete: 1
};
function CImage(src) {
    this.src = src;
    this.Image = null;
    this.Status = ImageLoadStatus.Complete;
}
var g_fonts_streams = [];
function DecodeBase64(imData, szSrc) {
    var srcLen = szSrc.length;
    var nWritten = 0;
    var dstPx = imData.data;
    var index = 0;
    if (window.chrome) {
        while (index < srcLen) {
            var dwCurr = 0;
            var i;
            var nBits = 0;
            for (i = 0; i < 4; i++) {
                if (index >= srcLen) {
                    break;
                }
                var nCh = DecodeBase64Char(szSrc.charCodeAt(index++));
                if (nCh == -1) {
                    i--;
                    continue;
                }
                dwCurr <<= 6;
                dwCurr |= nCh;
                nBits += 6;
            }
            dwCurr <<= 24 - nBits;
            for (i = 0; i < nBits / 8; i++) {
                dstPx[nWritten++] = ((dwCurr & 16711680) >>> 16);
                dwCurr <<= 8;
            }
        }
    } else {
        var p = b64_decode;
        while (index < srcLen) {
            var dwCurr = 0;
            var i;
            var nBits = 0;
            for (i = 0; i < 4; i++) {
                if (index >= srcLen) {
                    break;
                }
                var nCh = p[szSrc.charCodeAt(index++)];
                if (nCh == undefined) {
                    i--;
                    continue;
                }
                dwCurr <<= 6;
                dwCurr |= nCh;
                nBits += 6;
            }
            dwCurr <<= 24 - nBits;
            for (i = 0; i < nBits / 8; i++) {
                dstPx[nWritten++] = ((dwCurr & 16711680) >>> 16);
                dwCurr <<= 8;
            }
        }
    }
} (function (document) {
    if (undefined === window["__fonts_files"] && window["native"]["GenerateAllFonts"]) {
        window["native"]["GenerateAllFonts"]();
    }
    var __len_files = window["__fonts_files"].length;
    window.g_font_files = new Array(__len_files);
    for (var i = 0; i < __len_files; i++) {
        window.g_font_files[i] = new CFontFileLoader(window["__fonts_files"][i]);
    }
    var __len_infos = window["__fonts_infos"].length;
    window.g_font_infos = new Array(__len_infos);
    window.g_map_font_index = {};
    for (var i = 0; i < __len_infos; i++) {
        var _info = window["__fonts_infos"][i];
        window.g_font_infos[i] = new CFontInfo(_info[0], i, 0, _info[1], _info[2], _info[3], _info[4], _info[5], _info[6], _info[7], _info[8]);
        window.g_map_font_index[_info[0]] = i;
    }
    var _wngds3 = new CFontFileLoader("ASC.ttf");
    _wngds3.Status = 0;
    var _ind_wngds3 = g_fonts_streams.length;
    g_fonts_streams[_ind_wngds3] = CreateFontData2("AAEAAAARAQAABAAQTFRTSMgBAWkAAAIMAAAACU9TLzI5/eoAAAABmAAAAGBWRE1Yb8J3OwAAAhgAAAXgY21hcPBr8H4AAAjAAAAASGN2dCBAjTlRAAASGAAAAn5mcGdtgM3J1AAACQgAAAdFZ2FzcAAXAAkAABmgAAAAEGdseWalB9HFAAAUmAAAAORoZG14G81RIAAAB/gAAADIaGVhZAUoUMgAAAEcAAAANmhoZWEOZANxAAABVAAAACRobXR4FGIB2gAAAfgAAAAUbG9jYQBoALoAABV8AAAADG1heHAITQdkAAABeAAAACBuYW1lDC7+vAAAFYgAAAPJcG9zdONgvM0AABlUAAAASXByZXB9uZ8bAAAQUAAAAcYAAQAAAAEAAPQVs0xfDzz1ABsIAAAAAADPTriwAAAAAM+3TU8AgAAABnUFyAAAAAwAAQAAAAAAAAABAAAHbP5QAAAHIQCA/foGdQABAAAAAAAAAAAAAAAAAAAABQABAAAABQAJAAIAAAAAAAIAEAAUAE0AAAfoB0UAAAAAAAMFGAGQAAUAAATOBM4AAAMWBM4EzgAAAxYAZAMgDAAFBAECAQgHBwcHAAAAAAAAAAAAAAAAAAAAAE1TICAAQPAi8DgGKwGkADEHbAGwgAAAAAAAAAD/////AAAAIAAABAAAgAAAAAAE0gAAByEArQRvAK0AAAAFZAEBZGQAAAAAAAABAAEBAQEBAAwA+Aj/AAgACP/+AAkACP/9AAoACf/+AAsACv/+AAwAC//+AA0ADP/9AA4ADf/9AA8ADv/9ABAADv/9ABEAD//9ABIAEf/8ABMAEv/7ABQAE//7ABUAFP/7ABYAFf/7ABcAFv/7ABgAF//7ABkAGP/6ABoAGP/6ABsAGP/6ABwAGf/7AB0AGv/7AB4AHP/5AB8AHf/5ACAAHv/5ACEAH//4ACIAIP/5ACMAIf/5ACQAIf/4ACUAIv/4ACYAI//4ACcAJP/4ACgAJf/4ACkAJv/3ACoAKP/2ACsAKf/2ACwAKf/2AC0AKv/2AC4AKv/3AC8AK//2ADAALP/2ADEALf/2ADIALv/2ADMAL//1ADQAMP/1ADUAMf/1ADYAM//0ADcANP/0ADgANP/0ADkANf/zADoANv/zADsAN//zADwAOP/zAD0AOf/zAD4AOf/zAD8AOv/zAEAAO//yAEEAPP/zAEIAPf/yAEMAPv/yAEQAP//xAEUAQP/xAEYAQf/xAEcAQv/xAEgAQ//xAEkARP/xAEoARf/wAEsARv/wAEwARv/wAE0ASP/vAE4ASf/vAE8ASf/vAFAASv/vAFEAS//uAFIATP/uAFMATf/vAFQATv/vAFUAT//uAFYAT//uAFcAUP/uAFgAUf/uAFkAU//tAFoAVP/sAFsAVf/sAFwAVv/sAF0AV//sAF4AWP/sAF8AWf/sAGAAWf/rAGEAWf/rAGIAWv/rAGMAW//rAGQAXP/rAGUAXv/qAGYAX//qAGcAYP/qAGgAYf/qAGkAYv/qAGoAYv/pAGsAY//pAGwAZP/pAG0AZf/pAG4AZv/pAG8AZ//pAHAAaP/oAHEAav/nAHIAav/nAHMAa//nAHQAa//nAHUAbP/nAHYAbf/nAHcAbv/mAHgAb//nAHkAcP/nAHoAcf/nAHsAcv/mAHwAc//mAH0Adf/lAH4Adf/lAH8Adv/lAIAAd//lAIEAeP/kAIIAef/kAIMAev/kAIQAev/kAIUAe//kAIYAfP/kAIcAff/kAIgAff/jAIkAf//iAIoAgP/iAIsAgf/iAIwAgv/iAI0Ag//iAI4AhP/iAI8Ahf/iAJAAhv/hAJEAh//hAJIAh//hAJMAiP/hAJQAiv/gAJUAiv/gAJYAi//gAJcAjP/gAJgAjf/gAJkAjv/fAJoAj//fAJsAkP/fAJwAkP/fAJ0Akf/fAJ4Akv/fAJ8Ak//fAKAAlf/eAKEAlv/dAKIAl//dAKMAmP/dAKQAmf/dAKUAmv/dAKYAmv/dAKcAmv/dAKgAm//cAKkAnP/cAKoAnf/cAKsAnv/cAKwAoP/bAK0Aof/bAK4Aov/bAK8Ao//aALAAo//bALEApP/bALIApf/aALMApv/aALQAp//aALUAqP/aALYAqf/aALcAqv/ZALgAq//ZALkArP/YALoArP/YALsArf/YALwArv/YAL0Ar//YAL4AsP/YAL8Asf/XAMAAsv/XAMEAs//XAMIAtP/XAMMAtf/XAMQAtv/WAMUAt//WAMYAuP/WAMcAuf/VAMgAuv/VAMkAu//VAMoAu//VAMsAvP/VAMwAvf/VAM0Avv/VAM4Avv/VAM8Av//VANAAwf/TANEAwv/TANIAw//TANMAxP/TANQAxf/TANUAxv/TANYAx//TANcAyP/T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");
    _wngds3.SetStreamIndex(_ind_wngds3);
    window.g_font_files[window.g_font_files.length] = _wngds3;
    var _ind_info_wngds3 = window.g_font_infos.length;
    window.g_font_infos[_ind_info_wngds3] = new CFontInfo("ASCW3", 0, FONT_TYPE_ADDITIONAL, window.g_font_files.length - 1, 0, -1, -1, -1, -1, -1, -1);
    window.g_map_font_index["ASCW3"] = _ind_info_wngds3;
    delete window["__fonts_files"];
    delete window["__fonts_infos"];
})(window.document);