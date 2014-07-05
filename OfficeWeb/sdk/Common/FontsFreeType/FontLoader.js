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
 function CFontFileLoader(sPath, id) {
    this.Path = sPath + ".js";
    this.Id = id;
    this.IsLoaded = false;
    this.stream_index = -1;
    this.IsStartLoaded = false;
    this.CheckLoaded = function () {
        return this.IsLoaded;
    };
    this.LoadFontAsync = function () {
        if (true === this.IsLoaded) {
            return;
        }
        if (true === this.IsStartLoaded) {
            return;
        }
        this.IsStartLoaded = true;
        if (false === this.IsLoaded) {
            var scriptElem = document.createElement("script");
            scriptElem.setAttribute("src", this.Path);
            scriptElem.setAttribute("type", "text/javascript");
            document.getElementsByTagName("head")[0].appendChild(scriptElem);
        }
    };
}
function CDocumentFontLoader() {
    this.m_oCurrentFontInfo = null;
    this.m_lCurrentDefaultFont = -1;
    this.m_bIsCompleteDefaultFonts = false;
    this.m_arrDefaultFontsIds = ["Arial", "Times New Roman", "Cambria", "Symbol", "Wingdings"];
    this.LoadDefaultFonts = function () {
        this.m_lCurrentDefaultFont = 1;
        this.LoadFont(g_font_infos[map_font_index[this.m_arrDefaultFontsIds[0]]]);
    };
    this.LoadFont = function (fontinfo) {
        if (null != this.m_oCurrentFontInfo) {
            return;
        }
        var IsNeed = false;
        this.m_oCurrentFontInfo = fontinfo;
        if (-1 != this.m_oCurrentFontInfo.indexR && (false === g_font_files[this.m_oCurrentFontInfo.indexR].IsLoaded)) {
            g_font_files[this.m_oCurrentFontInfo.indexR].LoadFontAsync();
            IsNeed = true;
        }
        if (-1 != this.m_oCurrentFontInfo.indexI && (false === g_font_files[this.m_oCurrentFontInfo.indexI].IsLoaded)) {
            g_font_files[this.m_oCurrentFontInfo.indexI].LoadFontAsync();
            IsNeed = true;
        }
        if (-1 != this.m_oCurrentFontInfo.indexB && (false === g_font_files[this.m_oCurrentFontInfo.indexB].IsLoaded)) {
            g_font_files[this.m_oCurrentFontInfo.indexB].LoadFontAsync();
            IsNeed = true;
        }
        if (-1 != this.m_oCurrentFontInfo.indexBI && (false === g_font_files[this.m_oCurrentFontInfo.indexBI].IsLoaded)) {
            g_font_files[this.m_oCurrentFontInfo.indexBI].LoadFontAsync();
            IsNeed = true;
        }
        if (IsNeed) {
            this.Freeze();
            setTimeout(DocWaitTimeout, 50);
            return true;
        } else {
            this.m_oCurrentFontInfo = null;
            return false;
        }
    };
    this.WaitTimeout = function () {
        var IsNeed = false;
        if (-1 != this.m_oCurrentFontInfo.indexR && (false === g_font_files[this.m_oCurrentFontInfo.indexR].IsLoaded)) {
            IsNeed = true;
        } else {
            if (-1 != this.m_oCurrentFontInfo.indexI && (false === g_font_files[this.m_oCurrentFontInfo.indexI].IsLoaded)) {
                IsNeed = true;
            } else {
                if (-1 != this.m_oCurrentFontInfo.indexB && (false === g_font_files[this.m_oCurrentFontInfo.indexB].IsLoaded)) {
                    IsNeed = true;
                } else {
                    if (-1 != this.m_oCurrentFontInfo.indexBI && (false === g_font_files[this.m_oCurrentFontInfo.indexBI].IsLoaded)) {
                        IsNeed = true;
                    }
                }
            }
        }
        if (IsNeed) {
            setTimeout(DocWaitTimeout, 50);
        } else {
            this.UnFreeze();
        }
    };
    this.Freeze = function () {};
    this.UnFreeze = function () {
        this.m_oCurrentFontInfo = null;
        if (this.m_lCurrentDefaultFont < this.m_arrDefaultFontsIds.length) {
            this.LoadFont(g_font_infos[map_font_index[this.m_arrDefaultFontsIds[this.m_lCurrentDefaultFont]]]);
            this.m_lCurrentDefaultFont++;
            return;
        }
        if (false === this.m_bIsCompleteDefaultFonts) {
            this.m_bIsCompleteDefaultFonts = true;
            OnInit();
            return;
        }
        changeFontAttack();
    };
}
var DocumentFontLoader = new CDocumentFontLoader();
function DocWaitTimeout() {
    DocumentFontLoader.WaitTimeout();
}
function CFontInfo(sName, indexR, faceIndexR, indexI, faceIndexI, indexB, faceIndexB, indexBI, faceIndexBI) {
    this.Name = sName;
    this.indexR = indexR;
    this.faceIndexR = faceIndexR;
    this.indexI = indexI;
    this.faceIndexI = faceIndexI;
    this.indexB = indexB;
    this.faceIndexB = faceIndexB;
    this.indexBI = indexBI;
    this.faceIndexBI = faceIndexBI;
    this.LoadFont = function (fontManager, fEmSize, lStyle, dHorDpi, dVerDpi) {
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
        var fontfile = g_font_files[index];
        var pFontFile = fontManager.m_oFontsCache.LockFont(fontfile.stream_index, fontfile.Id, faceIndex, fEmSize);
        if (!pFontFile) {
            pFontFile = fontManager.m_oDefaultFont.GetDefaultFont(bSrcBold, bSrcItalic);
        } else {
            pFontFile.SetDefaultFont(fontManager.m_oDefaultFont.GetDefaultFont(bSrcBold, bSrcItalic));
        }
        if (!pFontFile) {
            return false;
        }
        fontManager.m_pFont = pFontFile;
        pFontFile.m_bNeedDoBold = bNeedBold;
        pFontFile.SetItalic(bNeedItalic);
        var _fEmSize = fontManager.UpdateSize(fEmSize, dVerDpi, dVerDpi);
        pFontFile.SetSizeAndDpi(_fEmSize, dHorDpi, dVerDpi);
        pFontFile.SetStringGID(fontManager.m_bStringGID);
        pFontFile.SetUseDefaultFont(fontManager.m_bUseDefaultFont);
        pFontFile.SetCharSpacing(fontManager.m_fCharSpacing);
        fontManager.m_oGlyphString.ResetCTM();
        fontManager.m_pFont.SetTextMatrix(1, 0, 0, 1, 0, 0);
        fontManager.AfterLoad();
    };
}