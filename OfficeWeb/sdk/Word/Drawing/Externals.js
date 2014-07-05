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
            scriptElem.setAttribute("src", basePath + "js/" + this.Id + ".js");
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
        xhr.open("GET", basePath + "native/" + this.Id, true);
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
        };
        xhr.send(null);
    };
    this.LoadFontNative = function () {
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
            faceIndex: faceIndex
        };
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
var charA = "A".charCodeAt(0);
var charZ = "Z".charCodeAt(0);
var chara = "a".charCodeAt(0);
var charz = "z".charCodeAt(0);
var char0 = "0".charCodeAt(0);
var char9 = "9".charCodeAt(0);
var charp = "+".charCodeAt(0);
var chars = "/".charCodeAt(0);
function DecodeBase64Char(ch) {
    if (ch >= charA && ch <= charZ) {
        return ch - charA + 0;
    }
    if (ch >= chara && ch <= charz) {
        return ch - chara + 26;
    }
    if (ch >= char0 && ch <= char9) {
        return ch - char0 + 52;
    }
    if (ch == charp) {
        return 62;
    }
    if (ch == chars) {
        return 63;
    }
    return -1;
}
var b64_decode = new Array();
for (var i = charA; i <= charZ; i++) {
    b64_decode[i] = i - charA + 0;
}
for (var i = chara; i <= charz; i++) {
    b64_decode[i] = i - chara + 26;
}
for (var i = char0; i <= char9; i++) {
    b64_decode[i] = i - char0 + 52;
}
b64_decode[charp] = 62;
b64_decode[chars] = 63;
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
}
function CreateFontData2(szSrc, dstLen) {
    var srcLen = szSrc.length;
    var nWritten = 0;
    if (dstLen === undefined) {
        dstLen = srcLen;
    }
    var pointer = g_memory.Alloc(dstLen);
    var stream = new FT_Stream(pointer.data, dstLen);
    stream.obj = pointer.obj;
    var dstPx = stream.data;
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
    return stream;
}
function CreateFontData3(szSrc) {
    var srcLen = szSrc.length;
    var nWritten = 0;
    var pointer = g_memory.Alloc(srcLen);
    var stream = new FT_Stream(pointer.data, srcLen);
    stream.obj = pointer.obj;
    var dstPx = stream.data;
    var index = 0;
    while (index < srcLen) {
        dstPx[index] = (szSrc.charCodeAt(index) & 255);
        index++;
    }
    return stream;
}
function CreateFontData4(szSrc) {
    var srcLen = szSrc.length;
    var nWritten = 0;
    var index = 0;
    var dst_len = "";
    while (true) {
        var _c = szSrc.charCodeAt(index);
        if (_c == ";".charCodeAt(0)) {
            break;
        }
        dst_len += String.fromCharCode(_c);
        index++;
    }
    index++;
    var dstLen = parseInt(dst_len);
    var pointer = g_memory.Alloc(dstLen);
    var stream = new FT_Stream(pointer.data, dstLen);
    stream.obj = pointer.obj;
    var dstPx = stream.data;
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
    return stream;
}
var g_fonts_streams = new Array();
(function (document) {
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