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
 function CCMapIndex() {
    this.index = 0;
}
function CFontFile(fileName, faceIndex) {
    this.m_arrdFontMatrix = new Array(6);
    this.m_arrdTextMatrix = new Array(6);
    this.m_bAntiAliasing = true;
    this.m_bUseKerning = false;
    this.m_fSize = 1;
    this.m_unHorDpi = 0;
    this.m_unVerDpi = 0;
    this.m_bNeedDoItalic = false;
    this.m_bNeedDoBold = false;
    this.m_fCharSpacing = 0;
    this.m_nMinX = 0;
    this.m_nMinY = 0;
    this.m_nMaxX = 0;
    this.m_nMaxY = 0;
    this.m_sFileName = fileName;
    this.m_lFaceIndex = faceIndex;
    this.m_nError = 0;
    this.m_pFace = null;
    this.m_dUnitsKoef = 1;
    this.m_nDefaultChar = -1;
    this.m_nSymbolic = -1;
    this.m_dTextScale = 0;
    this.m_bStringGID = false;
    this.m_oFontMatrix = new FT_Matrix();
    this.m_oTextMatrix = new FT_Matrix();
    this.m_nNum_charmaps = 0;
    this.m_lAscender = 0;
    this.m_lDescender = 0;
    this.m_lLineHeight = 0;
    this.m_lUnits_Per_Em = 0;
    this.m_arrCacheSizes = new Array();
    this.m_bUseDefaultFont = false;
    this.m_pDefaultFont = null;
    this.m_bIsNeedUpdateMatrix12 = true;
    this.m_oFontManager = null;
    this.HintsSupport = true;
    this.SetDefaultFont = function (pDefFont) {
        this.m_pDefaultFont = pDefFont;
    };
    this.LoadDefaultCharAndSymbolicCmapIndex = function () {
        this.m_nDefaultChar = -1;
        this.m_nSymbolic = -1;
        var pTable = FT_Get_Sfnt_Table(this.m_pFace, 2);
        if (null == pTable) {
            return;
        }
        this.m_nDefaultChar = pTable.usDefaultChar;
        if (65535 == pTable.version) {
            return;
        }
        var ulCodePageRange1 = pTable.ulCodePageRange1;
        var ulCodePageRange2 = pTable.ulCodePageRange2;
        if (! (ulCodePageRange1 & 2147483648) && !(ulCodePageRange1 == 0 && ulCodePageRange2 == 0)) {
            return;
        }
        var charMapArray = this.m_pFace.charmaps;
        for (var nIndex = 0; nIndex < this.m_nNum_charmaps; ++nIndex) {
            var pCharMap = __FT_CharmapRec(charMapArray[nIndex]);
            var nPlatformId = pCharMap.platform_id;
            var nEncodingId = pCharMap.encoding_id;
            if (0 == nEncodingId && 3 == nPlatformId) {
                this.m_nSymbolic = nIndex;
                return;
            }
        }
    };
    this.ResetFontMatrix = function () {
        if (this.m_pDefaultFont) {
            this.m_pDefaultFont.ResetFontMatrix();
        }
        var m = this.m_arrdFontMatrix;
        if (this.m_bNeedDoItalic) {
            m[0] = 1;
            m[1] = 0;
            m[2] = FONT_ITALIC_ANGLE;
            m[3] = 1;
            m[4] = 0;
            m[5] = 0;
        } else {
            m[0] = 1;
            m[1] = 0;
            m[2] = 0;
            m[3] = 1;
            m[4] = 0;
            m[5] = 0;
        }
        this.UpdateMatrix0();
    };
    this.ResetTextMatrix = function () {
        var m = this.m_arrdTextMatrix;
        m[0] = 1;
        m[1] = 0;
        m[2] = 0;
        m[3] = 1;
        m[4] = 0;
        m[5] = 0;
        this.CheckTextMatrix();
    };
    this.CheckTextMatrix = function () {
        this.m_bIsNeedUpdateMatrix12 = true;
        var m = this.m_arrdTextMatrix;
        if ((m[0] == 1) && (m[1] == 0) && (m[2] == 0) && (m[3] == 1)) {
            this.m_bIsNeedUpdateMatrix12 = false;
            if (this.m_pDefaultFont) {
                this.m_pDefaultFont.UpdateMatrix1();
            }
            this.UpdateMatrix1();
        }
    };
    this.UpdateMatrix0 = function () {
        var dSize = this.m_fSize;
        var m1 = this.m_arrdTextMatrix[2];
        var m2 = this.m_arrdTextMatrix[3];
        this.m_dTextScale = Math.sqrt(m1 * m1 + m2 * m2);
        var bbox = this.m_pFace.bbox;
        var xMin = bbox.xMin;
        var yMin = bbox.yMin;
        var xMax = bbox.xMax;
        var yMax = bbox.yMax;
        if (this.m_lUnits_Per_Em == 0) {
            this.m_lUnits_Per_Em = this.m_pFace.units_per_EM = 2048;
        }
        var units_per_EM = this.m_lUnits_Per_Em;
        var dDiv = xMax > 20000 ? 65536 : 1;
        var del = dDiv * units_per_EM;
        var m = this.m_arrdFontMatrix;
        var nX = parseInt(((m[0] * xMin + m[2] * yMin) * dSize / del));
        this.m_nMinX = this.m_nMaxX = nX;
        var nY = parseInt(((m[1] * xMin + m[3] * yMin) * dSize / del));
        this.m_nMinY = this.m_nMaxY = nY;
        nX = parseInt(((m[0] * xMin + m[2] * yMax) * dSize / del));
        if (nX < this.m_nMinX) {
            this.m_nMinX = nX;
        } else {
            if (nX > this.m_nMaxX) {
                this.m_nMaxX = nX;
            }
        }
        nY = parseInt(((m[1] * xMin + m[3] * yMax) * dSize / del));
        if (nY < this.m_nMinY) {
            this.m_nMinY = nY;
        } else {
            if (nY > this.m_nMaxY) {
                this.m_nMaxY = nY;
            }
        }
        nX = parseInt(((m[0] * xMax + m[2] * yMin) * dSize / del));
        if (nX < this.m_nMinX) {
            this.m_nMinX = nX;
        } else {
            if (nX > this.m_nMaxX) {
                this.m_nMaxX = nX;
            }
        }
        nY = parseInt(((m[1] * xMax + m[3] * yMin) * dSize / del));
        if (nY < this.m_nMinY) {
            this.m_nMinY = nY;
        } else {
            if (nY > this.m_nMaxY) {
                this.m_nMaxY = nY;
            }
        }
        nX = parseInt(((m[0] * xMax + m[2] * yMax) * dSize / del));
        if (nX < this.m_nMinX) {
            this.m_nMinX = nX;
        } else {
            if (nX > this.m_nMaxX) {
                this.m_nMaxX = nX;
            }
        }
        nY = parseInt(((m[1] * xMax + m[3] * yMax) * dSize / del));
        if (nY < this.m_nMinY) {
            this.m_nMinY = nY;
        } else {
            if (nY > this.m_nMaxY) {
                this.m_nMaxY = nY;
            }
        }
        if (this.m_nMaxX == this.m_nMinX) {
            this.m_nMinX = 0;
            this.m_nMaxX = parseInt(dSize);
        }
        if (this.m_nMaxY == this.m_nMinY) {
            this.m_nMinY = 0;
            this.m_nMaxY = parseInt((1.2 * dSize));
        }
        var fm = this.m_oFontMatrix;
        fm.xx = Math.floor((m[0] * 65536));
        fm.yx = Math.floor((m[1] * 65536));
        fm.xy = Math.floor((m[2] * 65536));
        fm.yy = Math.floor((m[3] * 65536));
        var tm = this.m_oTextMatrix;
        tm.xx = Math.floor(((this.m_arrdTextMatrix[0] / this.m_dTextScale) * 65536));
        tm.yx = Math.floor(((this.m_arrdTextMatrix[1] / this.m_dTextScale) * 65536));
        tm.xy = Math.floor(((this.m_arrdTextMatrix[2] / this.m_dTextScale) * 65536));
        tm.yy = Math.floor(((this.m_arrdTextMatrix[3] / this.m_dTextScale) * 65536));
        FT_Set_Transform(this.m_pFace, fm, 0);
    };
    this.UpdateMatrix1 = function () {
        var m = this.m_arrdFontMatrix;
        var fm = this.m_oFontMatrix;
        fm.xx = Math.floor((m[0] * 65536));
        fm.yx = Math.floor((m[1] * 65536));
        fm.xy = Math.floor((m[2] * 65536));
        fm.yy = Math.floor((m[3] * 65536));
        FT_Set_Transform(this.m_pFace, this.m_oFontMatrix, 0);
    };
    this.UpdateMatrix2 = function () {
        var m = this.m_arrdFontMatrix;
        var t = this.m_arrdTextMatrix;
        var fm = this.m_oFontMatrix;
        fm.xx = parseInt((m[0] * t[0] + m[1] * t[2]) * 65536);
        fm.yx = parseInt((m[0] * t[1] + m[1] * t[3]) * 65536);
        fm.xy = parseInt((m[2] * t[0] + m[3] * t[2]) * 65536);
        fm.yy = parseInt((m[2] * t[1] + m[3] * t[3]) * 65536);
        FT_Set_Transform(this.m_pFace, fm, 0);
    };
    this.SetSizeAndDpi = function (fSize, _unHorDpi, _unVerDpi) {
        var unHorDpi = parseInt(_unHorDpi + 0.5);
        var unVerDpi = parseInt(_unVerDpi + 0.5);
        if (this.m_pDefaultFont) {
            this.m_pDefaultFont.SetSizeAndDpi(fSize, unHorDpi, unVerDpi);
        }
        var fOldSize = this.m_fSize;
        var fNewSize = fSize;
        var fKoef = fNewSize / fOldSize;
        if (fKoef > 1.001 || fKoef < 0.999 || unHorDpi != this.m_unHorDpi || unVerDpi != this.m_unVerDpi) {
            this.m_unHorDpi = unHorDpi;
            this.m_unVerDpi = unVerDpi;
            if (fKoef > 1.001 || fKoef < 0.999) {
                this.m_fSize = fNewSize;
                this.UpdateMatrix0();
            }
            this.m_dUnitsKoef = this.m_unHorDpi / 72 * this.m_fSize;
            this.m_nError = FT_Set_Char_Size(this.m_pFace, 0, parseInt(fNewSize * 64), unHorDpi, unVerDpi);
            this.ClearCache();
        }
    };
    this.ClearCache = function () {
        if (this.m_oFontManager != null && this.m_oFontManager.RasterMemory != null) {
            var _arr = this.m_arrCacheSizes;
            for (var i in _arr) {
                if (_arr[i].oBitmap != null) {
                    _arr[i].oBitmap.Free();
                }
            }
        }
        this.m_arrCacheSizes = [];
    };
    this.ClearCacheNoAttack = function () {
        this.m_arrCacheSizes = [];
    };
    this.Destroy = function () {
        if (this.m_oFontManager != null && this.m_oFontManager.RasterMemory != null) {
            var _arr = this.m_arrCacheSizes;
            for (var i in _arr) {
                if (_arr[i].oBitmap != null) {
                    _arr[i].oBitmap.Free();
                }
            }
        }
    };
    this.SetTextMatrix = function (fA, fB, fC, fD, fE, fF) {
        var m = this.m_arrdTextMatrix;
        var b1 = (m[0] == fA && m[1] == -fB && m[2] == -fC && m[3] == fD);
        if (b1 && m[4] == fE && m[5] == fF) {
            return false;
        }
        if (this.m_pDefaultFont) {
            this.m_pDefaultFont.SetTextMatrix(fA, fB, fC, fD, fE, fF);
        }
        m[0] = fA;
        m[1] = -fB;
        m[2] = -fC;
        m[3] = fD;
        m[4] = fE;
        m[5] = fF;
        if (!b1) {
            this.ClearCache();
        }
        this.CheckTextMatrix();
        return true;
    };
    this.SetFontMatrix = function (fA, fB, fC, fD, fE, fF) {
        if (this.m_pDefaultFont) {
            this.m_pDefaultFont.SetFontMatrix(fA, fB, fC, fD, fE, fF);
        }
        var m = this.m_arrdFontMatrix;
        if (this.m_bNeedDoItalic) {
            m[0] = fA;
            m[1] = fB;
            m[2] = fC + fA * FONT_ITALIC_ANGLE;
            m[3] = fD + fB * FONT_ITALIC_ANGLE;
            m[4] = fE;
            m[5] = fF;
        } else {
            m[0] = fA;
            m[1] = fB;
            m[2] = fC;
            m[3] = fD;
            m[4] = fE;
            m[5] = fF;
        }
        this.ClearCache();
    };
    this.GetString = function (pString) {
        if (pString.GetLength() <= 0) {
            return true;
        }
        var unPrevGID = 0;
        var fPenX = 0,
        fPenY = 0;
        if (this.m_bIsNeedUpdateMatrix12) {
            if (this.m_pDefaultFont) {
                this.m_pDefaultFont.UpdateMatrix1();
            }
            this.UpdateMatrix1();
        }
        for (var nIndex = 0; nIndex < pString.GetLength(); ++nIndex) {
            nCMapIndex.index = 0;
            var pFace = this.m_pFace;
            var pCurentGliph = pFace.m_pGlyph;
            var pCurGlyph = pString.GetAt(nIndex);
            var ushUnicode = pCurGlyph.lUnicode;
            var unGID = 0;
            var charSymbolObj = this.m_arrCacheSizes[ushUnicode];
            if (undefined == charSymbolObj) {
                var nCMapIndex = new CCMapIndex();
                unGID = this.SetCMapForCharCode(ushUnicode, nCMapIndex);
                var oSizes = new TFontCacheSizes();
                oSizes.ushUnicode = ushUnicode;
                if (! ((unGID > 0) || (-1 != this.m_nSymbolic && (ushUnicode < 61440) && 0 < (unGID = this.SetCMapForCharCode(ushUnicode + 61440, nCMapIndex))))) {
                    if (false === this.m_bUseDefaultFont || null == this.m_pDefaultFont || 0 >= (unGID = this.m_pDefaultFont.SetCMapForCharCode(ushUnicode, nCMapIndex))) {
                        if (this.m_nDefaultChar < 0) {
                            oSizes.ushGID = -1;
                            oSizes.eState = EGlyphState.glyphstateMiss;
                            var max_advance = this.m_pFace.size.metrics.max_advance;
                            oSizes.fAdvanceX = (max_advance >> 6) / 2;
                            return;
                        } else {
                            unGID = this.m_nDefaultChar;
                            oSizes.eState = EGlyphState.glyphstateNormal;
                            pFace = this.m_pFace;
                            pCurentGliph = pFace.glyph;
                        }
                    } else {
                        oSizes.eState = EGlyphState.glyphstateDeafault;
                        pFace = this.m_pDefaultFont.m_pFace;
                        pCurentGliph = this.m_pDefaultFont.m_pGlyph;
                    }
                } else {
                    oSizes.eState = EGlyphState.glyphstateNormal;
                }
                oSizes.ushGID = unGID;
                oSizes.nCMapIndex = nCMapIndex.index;
                var _LOAD_MODE = this.HintsSupport ? this.m_oFontManager.LOAD_MODE : 40970;
                if (0 != FT_Load_Glyph(pFace, unGID, _LOAD_MODE)) {
                    return;
                }
                var pGlyph = FT_Get_Glyph(pCurentGliph);
                if (null == pGlyph) {
                    return;
                }
                var oBBox = new FT_BBox();
                FT_Glyph_Get_CBox(pGlyph, 1, oBBox);
                var xMin = oBBox.xMin;
                var yMin = oBBox.yMin;
                var xMax = oBBox.xMax;
                var yMax = oBBox.yMax;
                FT_Done_Glyph(pGlyph);
                pGlyph = null;
                var linearHoriAdvance = pCurentGliph.linearHoriAdvance;
                var units_per_EM = this.m_lUnits_Per_Em;
                oSizes.fAdvanceX = (linearHoriAdvance * this.m_dUnitsKoef / units_per_EM);
                oSizes.oBBox.fMinX = (xMin >> 6);
                oSizes.oBBox.fMaxX = (xMax >> 6);
                oSizes.oBBox.fMinY = (yMin >> 6);
                oSizes.oBBox.fMaxY = (yMax >> 6);
                if (this.m_bNeedDoBold) {
                    oSizes.fAdvanceX += 1;
                }
                var dstM = oSizes.oMetrics;
                var srcM = pCurentGliph.metrics;
                dstM.fWidth = (srcM.width >> 6);
                dstM.fHeight = (srcM.height >> 6);
                dstM.fHoriBearingX = (srcM.horiBearingX >> 6);
                dstM.fHoriBearingY = (srcM.horiBearingY >> 6);
                dstM.fHoriAdvance = (srcM.horiAdvance >> 6);
                dstM.fVertBearingX = (srcM.vertBearingX >> 6);
                dstM.fVertBearingY = (srcM.vertBearingY >> 6);
                dstM.fVertAdvance = (srcM.vertAdvance >> 6);
                oSizes.bBitmap = false;
                oSizes.oBitmap = null;
                this.m_arrCacheSizes[oSizes.ushUnicode] = oSizes;
            } else {
                var _cmap_index = charSymbolObj.nCMapIndex;
                unGID = charSymbolObj.ushGID;
                var eState = charSymbolObj.eState;
                if (EGlyphState.glyphstateMiss == eState) {
                    pString.SetStartPoint(nIndex, fPenX, fPenY);
                    pString.SetBBox(nIndex, 0, 0, 0, 0);
                    pString.SetState(nIndex, EGlyphState.glyphstateMiss);
                    fPenX += charSymbolObj.fAdvanceX + this.m_fCharSpacing;
                    unPrevGID = 0;
                    continue;
                } else {
                    if (EGlyphState.glyphstateDeafault == eState) {
                        pString.SetState(nIndex, EGlyphState.glyphstateDeafault);
                    } else {
                        pString.SetState(nIndex, EGlyphState.glyphstateNormal);
                    }
                }
                if (0 != this.m_nNum_charmaps) {
                    var nCharmap = pFace.charmap;
                    var nCurCMapIndex = FT_Get_Charmap_Index(nCharmap);
                    if (nCurCMapIndex != _cmap_index) {
                        _cmap_index = Math.max(0, _cmap_index);
                        nCharmap = pFace.charmaps[_cmap_index];
                        FT_Set_Charmap(pFace, nCharmap);
                    }
                }
                if (this.m_bUseKerning && unPrevGID && (nIndex >= 0 && pString.GetAt(nIndex).eState == pString.GetAt(nIndex - 1).eState)) {
                    fPenX += this.GetKerning(unPrevGID, unGID);
                }
                var fX = pString.m_fX + fPenX;
                var fY = pString.m_fY + fPenY;
                var fXX = (pString.m_arrCTM[4] + fX * pString.m_arrCTM[0] + fY * pString.m_arrCTM[2] - pString.m_fX);
                var fYY = (pString.m_arrCTM[5] + fX * pString.m_arrCTM[1] + fY * pString.m_arrCTM[3] - pString.m_fY);
                pString.SetStartPoint(nIndex, fXX, fYY);
                var _metrics = charSymbolObj.oMetrics;
                pString.SetMetrics(nIndex, _metrics.fWidth, _metrics.fHeight, _metrics.fHoriAdvance, _metrics.fHoriBearingX, _metrics.fHoriBearingY, _metrics.fVertAdvance, _metrics.fVertBearingX, _metrics.fVertBearingY);
                pString.SetBBox(nIndex, charSymbolObj.oBBox.fMinX, charSymbolObj.oBBox.fMaxY, charSymbolObj.oBBox.fMaxX, charSymbolObj.oBBox.fMinY);
                fPenX += charSymbolObj.fAdvanceX + this.m_fCharSpacing;
                if (this.m_bNeedDoBold) {
                    fPenX += 1;
                }
            }
            unPrevGID = unGID;
        }
        pString.m_fEndX = fPenX + pString.m_fX;
        pString.m_fEndY = fPenY + pString.m_fY;
        if (this.m_bIsNeedUpdateMatrix12) {
            if (this.m_pDefaultFont) {
                this.m_pDefaultFont.UpdateMatrix2();
            }
            this.UpdateMatrix2();
        }
    };
    this.GetString2 = function (pString) {
        if (pString.GetLength() <= 0) {
            return true;
        }
        var unPrevGID = 0;
        var fPenX = 0,
        fPenY = 0;
        for (var nIndex = 0; nIndex < pString.GetLength(); ++nIndex) {
            if (this.m_bIsNeedUpdateMatrix12) {
                if (this.m_pDefaultFont) {
                    this.m_pDefaultFont.UpdateMatrix1();
                }
                this.UpdateMatrix1();
            }
            var pFace = this.m_pFace;
            var pCurentGliph = pFace.glyph;
            var pCurGlyph = pString.GetAt(nIndex);
            var ushUnicode = pCurGlyph.lUnicode;
            var unGID = 0;
            var charSymbolObj = this.m_arrCacheSizes[ushUnicode];
            if (undefined == charSymbolObj || null == charSymbolObj.oBitmap) {
                var nCMapIndex = new CCMapIndex();
                unGID = this.SetCMapForCharCode(ushUnicode, nCMapIndex);
                var oSizes = new TFontCacheSizes();
                oSizes.ushUnicode = ushUnicode;
                if (! ((unGID > 0) || (-1 != this.m_nSymbolic && (ushUnicode < 61440) && 0 < (unGID = this.SetCMapForCharCode(ushUnicode + 61440, nCMapIndex))))) {
                    if (false === this.m_bUseDefaultFont || null == this.m_pDefaultFont || 0 >= (unGID = this.m_pDefaultFont.SetCMapForCharCode(ushUnicode, nCMapIndex))) {
                        if (this.m_nDefaultChar < 0) {
                            oSizes.ushGID = -1;
                            oSizes.eState = EGlyphState.glyphstateMiss;
                            var max_advance = this.m_pFace.size.metrics.max_advance;
                            oSizes.fAdvanceX = (max_advance >> 6) / 2;
                            return;
                        } else {
                            unGID = this.m_nDefaultChar;
                            oSizes.eState = EGlyphState.glyphstateNormal;
                            pFace = this.m_pFace;
                            pCurentGliph = pFace.glyph;
                        }
                    } else {
                        oSizes.eState = EGlyphState.glyphstateDeafault;
                        pFace = this.m_pDefaultFont.m_pFace;
                        pCurentGliph = this.m_pDefaultFont.m_pFace.glyph;
                    }
                } else {
                    oSizes.eState = EGlyphState.glyphstateNormal;
                }
                oSizes.ushGID = unGID;
                oSizes.nCMapIndex = nCMapIndex.index;
                if (this.m_bIsNeedUpdateMatrix12) {
                    if (this.m_pDefaultFont) {
                        this.m_pDefaultFont.UpdateMatrix2();
                    }
                    this.UpdateMatrix2();
                }
                var _LOAD_MODE = this.HintsSupport ? this.m_oFontManager.LOAD_MODE : 40970;
                if (0 != FT_Load_Glyph(pFace, unGID, _LOAD_MODE)) {
                    return;
                }
                var pGlyph = FT_Get_Glyph(this.m_pFace.glyph);
                if (null == pGlyph) {
                    return;
                }
                var oBBox = new FT_BBox();
                FT_Glyph_Get_CBox(pGlyph, 1, oBBox);
                var xMin = oBBox.xMin;
                var yMin = oBBox.yMin;
                var xMax = oBBox.xMax;
                var yMax = oBBox.yMax;
                FT_Done_Glyph(pGlyph);
                pGlyph = null;
                pCurentGliph = this.m_pFace.glyph;
                var linearHoriAdvance = pCurentGliph.linearHoriAdvance;
                var units_per_EM = this.m_lUnits_Per_Em;
                oSizes.fAdvanceX = (linearHoriAdvance * this.m_dUnitsKoef / units_per_EM);
                oSizes.oBBox.fMinX = (xMin >> 6);
                oSizes.oBBox.fMaxX = (xMax >> 6);
                oSizes.oBBox.fMinY = (yMin >> 6);
                oSizes.oBBox.fMaxY = (yMax >> 6);
                var dstM = oSizes.oMetrics;
                var srcM = pCurentGliph.metrics;
                dstM.fWidth = (srcM.width >> 6);
                dstM.fHeight = (srcM.height >> 6);
                dstM.fHoriBearingX = (srcM.horiBearingX >> 6);
                dstM.fHoriBearingY = (srcM.horiBearingY >> 6);
                dstM.fHoriAdvance = (srcM.horiAdvance >> 6);
                dstM.fVertBearingX = (srcM.vertBearingX >> 6);
                dstM.fVertBearingY = (srcM.vertBearingY >> 6);
                dstM.fVertAdvance = (srcM.vertAdvance >> 6);
                oSizes.bBitmap = true;
                if (FT_Render_Glyph(pCurentGliph, REND_MODE)) {
                    return;
                }
                oSizes.oBitmap = new TGlyphBitmap();
                oSizes.oBitmap.nX = pCurentGliph.bitmap_left;
                oSizes.oBitmap.nY = pCurentGliph.bitmap_top;
                oSizes.oBitmap.nWidth = pCurentGliph.bitmap.width;
                oSizes.oBitmap.nHeight = pCurentGliph.bitmap.rows;
                var _width = pCurentGliph.bitmap.pitch;
                if (_width != 0) {
                    var nRowSize = 0;
                    if (this.m_bAntiAliasing) {
                        if (this.m_bNeedDoBold) {
                            oSizes.oBitmap.nWidth++;
                        }
                        nRowSize = oSizes.oBitmap.nWidth;
                    } else {
                        nRowSize = (oSizes.oBitmap.nWidth + 7) >> 3;
                    }
                    if (this.m_bNeedDoBold && this.m_bAntiAliasing) {
                        var _width_im = oSizes.oBitmap.nWidth;
                        var _height = oSizes.oBitmap.nHeight;
                        var _temp = g_memory.Alloc(_width);
                        var _data = _temp.data;
                        var nY, nX;
                        var pDstBuffer;
                        var pSrcBuffer;
                        var nPitch = pCurentGliph.bitmap.pitch;
                        for (nY = 0, pDstBuffer = 0, pSrcBuffer = 0; nY < oSizes.oBitmap.nHeight; ++nY, pDstBuffer += (raster_memory.pitch), pSrcBuffer += nPitch) {
                            var _input = raster_memory.m_oBuffer.data;
                            for (var i = 0; i < _width; i++) {
                                _data[i] = _input[pDstBuffer + i * 4 + 3];
                            }
                            for (nX = _width_im - 1; nX >= 0; --nX) {
                                if (0 != nX) {
                                    var nFirstByte, nSecondByte;
                                    if (_width - 1 == nX) {
                                        nFirstByte = 0;
                                    } else {
                                        nFirstByte = _data[nX];
                                    }
                                    nSecondByte = _data[nX - 1];
                                    _input[pDstBuffer + nX * 4 + 3] = Math.min(255, nFirstByte + nSecondByte);
                                } else {
                                    _input[pDstBuffer + 3] = _data[0];
                                }
                            }
                        }
                        _temp = null;
                    }
                    pCurGlyph.bBitmap = oSizes.bBitmap;
                    pCurGlyph.oBitmap = oSizes.oBitmap;
                    oSizes.oBitmap.fromAlphaMask(this.m_oFontManager);
                }
                this.m_arrCacheSizes[oSizes.ushUnicode] = oSizes;
                charSymbolObj = oSizes;
            }
            if (null != charSymbolObj) {
                var nCMapIndex = charSymbolObj.nCMapIndex;
                unGID = charSymbolObj.ushGID;
                var eState = charSymbolObj.eState;
                if (EGlyphState.glyphstateMiss == eState) {
                    pString.SetStartPoint(nIndex, fPenX, fPenY);
                    pString.SetBBox(nIndex, 0, 0, 0, 0);
                    pString.SetState(nIndex, EGlyphState.glyphstateMiss);
                    fPenX += charSymbolObj.fAdvanceX + this.m_fCharSpacing;
                    unPrevGID = 0;
                    continue;
                } else {
                    if (EGlyphState.glyphstateDeafault == eState) {
                        pString.SetState(nIndex, EGlyphState.glyphstateDeafault);
                    } else {
                        pString.SetState(nIndex, EGlyphState.glyphstateNormal);
                    }
                }
                if (0 != this.m_nNum_charmaps) {
                    var nCharmap = pFace.charmap;
                    var nCurCMapIndex = FT_Get_Charmap_Index(nCharmap);
                    if (nCurCMapIndex != nCMapIndex) {
                        nCMapIndex = Math.max(0, nCMapIndex);
                        nCharmap = this.m_pFace.charmaps[nCMapIndex];
                        FT_Set_Charmap(this.m_pFace, nCharmap);
                    }
                }
                if (this.m_bUseKerning && unPrevGID && (nIndex >= 0 && pString.GetAt(nIndex).eState == pString.GetAt(nIndex - 1).eState)) {
                    fPenX += this.GetKerning(unPrevGID, unGID);
                }
                var fX = pString.m_fX + fPenX;
                var fY = pString.m_fY + fPenY;
                var fXX = (pString.m_arrCTM[4] + fX * pString.m_arrCTM[0] + fY * pString.m_arrCTM[2] - pString.m_fX);
                var fYY = (pString.m_arrCTM[5] + fX * pString.m_arrCTM[1] + fY * pString.m_arrCTM[3] - pString.m_fY);
                pString.SetStartPoint(nIndex, fXX, fYY);
                pString.m_pGlyphsBuffer[nIndex].oMetrics = charSymbolObj.oMetrics;
                pString.SetBBox(nIndex, charSymbolObj.oBBox.fMinX, charSymbolObj.oBBox.fMaxY, charSymbolObj.oBBox.fMaxX, charSymbolObj.oBBox.fMinY);
                fPenX += charSymbolObj.fAdvanceX + this.m_fCharSpacing;
                if (this.m_bNeedDoBold) {
                    fPenX += 1;
                }
                pCurGlyph.bBitmap = charSymbolObj.bBitmap;
                pCurGlyph.oBitmap = charSymbolObj.oBitmap;
            }
            unPrevGID = unGID;
        }
        pString.m_fEndX = fPenX + pString.m_fX;
        pString.m_fEndY = fPenY + pString.m_fY;
        if (this.m_bIsNeedUpdateMatrix12) {
            if (this.m_pDefaultFont) {
                this.m_pDefaultFont.UpdateMatrix2();
            }
            this.UpdateMatrix2();
        }
    };
    this.GetString2C = function (pString) {
        var unPrevGID = 0;
        var fPenX = 0,
        fPenY = 0;
        if (this.m_bIsNeedUpdateMatrix12) {
            if (this.m_pDefaultFont) {
                this.m_pDefaultFont.UpdateMatrix1();
            }
            this.UpdateMatrix1();
        }
        var pCurGlyph = pString.m_pGlyphsBuffer[0];
        var ushUnicode = pCurGlyph.lUnicode;
        var unGID = 0;
        var charSymbolObj = this.m_arrCacheSizes[ushUnicode];
        if (undefined == charSymbolObj || (null == charSymbolObj.oBitmap && charSymbolObj.bBitmap === false)) {
            var nCMapIndex = new CCMapIndex();
            unGID = this.SetCMapForCharCode(ushUnicode, nCMapIndex);
            var oSizes = new TFontCacheSizes();
            oSizes.ushUnicode = ushUnicode;
            if (! ((unGID > 0) || (-1 != this.m_nSymbolic && (ushUnicode < 61440) && 0 < (unGID = this.SetCMapForCharCode(ushUnicode + 61440, nCMapIndex))))) {
                if (false === this.m_bUseDefaultFont || null == this.m_pDefaultFont || 0 >= (unGID = this.m_pDefaultFont.SetCMapForCharCode(ushUnicode, nCMapIndex))) {
                    if (this.m_nDefaultChar < 0) {
                        oSizes.ushGID = -1;
                        oSizes.eState = EGlyphState.glyphstateMiss;
                        var max_advance = this.m_pFace.size.metrics.max_advance;
                        oSizes.fAdvanceX = (max_advance >> 6) / 2;
                        return;
                    } else {
                        unGID = this.m_nDefaultChar;
                        oSizes.eState = EGlyphState.glyphstateNormal;
                        pFace = this.m_pFace;
                        pCurentGliph = pFace.glyph;
                    }
                } else {
                    oSizes.eState = EGlyphState.glyphstateDeafault;
                    pFace = this.m_pDefaultFont.m_pFace;
                    pCurentGliph = this.m_pDefaultFont.m_pFace.glyph;
                }
            } else {
                oSizes.eState = EGlyphState.glyphstateNormal;
            }
            oSizes.ushGID = unGID;
            oSizes.nCMapIndex = nCMapIndex.index;
            if (this.m_bIsNeedUpdateMatrix12) {
                if (this.m_pDefaultFont) {
                    this.m_pDefaultFont.UpdateMatrix2();
                }
                this.UpdateMatrix2();
            }
            if (true) {
                var fX = pString.m_fX + fPenX;
                var fY = pString.m_fY + fPenY;
                var _m = pString.m_arrCTM;
                pCurGlyph.fX = (_m[4] + fX * _m[0] + fY * _m[2] - pString.m_fX);
                pCurGlyph.fY = (_m[5] + fX * _m[1] + fY * _m[3] - pString.m_fY);
            }
            var _LOAD_MODE = this.HintsSupport ? this.m_oFontManager.LOAD_MODE : 40970;
            if (0 != FT_Load_Glyph(this.m_pFace, unGID, _LOAD_MODE)) {
                return;
            }
            var pGlyph = FT_Get_Glyph(this.m_pFace.glyph);
            if (null == pGlyph) {
                return;
            }
            var oBBox = new FT_BBox();
            FT_Glyph_Get_CBox(pGlyph, 1, oBBox);
            var xMin = oBBox.xMin;
            var yMin = oBBox.yMin;
            var xMax = oBBox.xMax;
            var yMax = oBBox.yMax;
            FT_Done_Glyph(pGlyph);
            pGlyph = null;
            var pCurentGliph = this.m_pFace.glyph;
            var linearHoriAdvance = pCurentGliph.linearHoriAdvance;
            var units_per_EM = this.m_lUnits_Per_Em;
            oSizes.fAdvanceX = (linearHoriAdvance * this.m_dUnitsKoef / units_per_EM);
            oSizes.oBBox.fMinX = (xMin >> 6);
            oSizes.oBBox.fMaxX = (xMax >> 6);
            oSizes.oBBox.fMinY = (yMin >> 6);
            oSizes.oBBox.fMaxY = (yMax >> 6);
            var dstM = oSizes.oMetrics;
            var srcM = pCurentGliph.metrics;
            dstM.fWidth = (srcM.width >> 6);
            dstM.fHeight = (srcM.height >> 6);
            dstM.fHoriBearingX = (srcM.horiBearingX >> 6);
            dstM.fHoriBearingY = (srcM.horiBearingY >> 6);
            dstM.fHoriAdvance = (srcM.horiAdvance >> 6);
            dstM.fVertBearingX = (srcM.vertBearingX >> 6);
            dstM.fVertBearingY = (srcM.vertBearingY >> 6);
            dstM.fVertAdvance = (srcM.vertAdvance >> 6);
            oSizes.bBitmap = true;
            if (FT_Render_Glyph(pCurentGliph, REND_MODE)) {
                return;
            }
            var _width = pCurentGliph.bitmap.pitch;
            if (0 != _width) {
                oSizes.oBitmap = new TGlyphBitmap();
                oSizes.oBitmap.nX = pCurentGliph.bitmap_left;
                oSizes.oBitmap.nY = pCurentGliph.bitmap_top;
                oSizes.oBitmap.nWidth = pCurentGliph.bitmap.width;
                oSizes.oBitmap.nHeight = pCurentGliph.bitmap.rows;
                var nRowSize = 0;
                if (this.m_bAntiAliasing) {
                    if (this.m_bNeedDoBold) {
                        oSizes.oBitmap.nWidth++;
                    }
                    nRowSize = oSizes.oBitmap.nWidth;
                } else {
                    nRowSize = (oSizes.oBitmap.nWidth + 7) >> 3;
                }
                if (this.m_bNeedDoBold && this.m_bAntiAliasing) {
                    var _width_im = oSizes.oBitmap.nWidth;
                    var _height = oSizes.oBitmap.nHeight;
                    var _temp = g_memory.Alloc(_width);
                    var _data = _temp.data;
                    var nY, nX;
                    var pDstBuffer;
                    var pSrcBuffer;
                    var nPitch = pCurentGliph.bitmap.pitch;
                    for (nY = 0, pDstBuffer = 0, pSrcBuffer = 0; nY < oSizes.oBitmap.nHeight; ++nY, pDstBuffer += (raster_memory.pitch), pSrcBuffer += nPitch) {
                        var _input = raster_memory.m_oBuffer.data;
                        for (var i = 0; i < _width; i++) {
                            _data[i] = _input[pDstBuffer + i * 4 + 3];
                        }
                        for (nX = _width_im - 1; nX >= 0; --nX) {
                            if (0 != nX) {
                                var nFirstByte, nSecondByte;
                                if (_width - 1 == nX) {
                                    nFirstByte = 0;
                                } else {
                                    nFirstByte = _data[nX];
                                }
                                nSecondByte = _data[nX - 1];
                                _input[pDstBuffer + nX * 4 + 3] = Math.min(255, nFirstByte + nSecondByte);
                            } else {
                                _input[pDstBuffer + 3] = _data[0];
                            }
                        }
                    }
                    _temp = null;
                }
                pCurGlyph.bBitmap = oSizes.bBitmap;
                pCurGlyph.oBitmap = oSizes.oBitmap;
                oSizes.oBitmap.fromAlphaMask(this.m_oFontManager);
            }
            this.m_arrCacheSizes[oSizes.ushUnicode] = oSizes;
            charSymbolObj = oSizes;
        } else {
            var nCMapIndex = charSymbolObj.nCMapIndex;
            unGID = charSymbolObj.ushGID;
            var eState = charSymbolObj.eState;
            if (EGlyphState.glyphstateMiss == eState) {
                pCurGlyph.fX = fPenX;
                pCurGlyph.fY = fPenY;
                pCurGlyph.fLeft = fLeft;
                pCurGlyph.fTop = fTop;
                pCurGlyph.fRight = fRight;
                pCurGlyph.fBottom = fBottom;
                pCurGlyph.eState = EGlyphState.glyphstateMiss;
                fPenX += charSymbolObj.fAdvanceX + this.m_fCharSpacing;
                unPrevGID = 0;
                return;
            } else {
                if (EGlyphState.glyphstateDeafault == eState) {
                    pCurGlyph.eState = EGlyphState.glyphstateDeafault;
                } else {
                    pCurGlyph.eState = EGlyphState.glyphstateNormal;
                }
            }
            if (true) {
                var fX = pString.m_fX + fPenX;
                var fY = pString.m_fY + fPenY;
                var _m = pString.m_arrCTM;
                pCurGlyph.fX = (_m[4] + fX * _m[0] + fY * _m[2] - pString.m_fX);
                pCurGlyph.fY = (_m[5] + fX * _m[1] + fY * _m[3] - pString.m_fY);
            }
            pCurGlyph.oMetrics = charSymbolObj.oMetrics;
            pCurGlyph.bBitmap = charSymbolObj.bBitmap;
            pCurGlyph.oBitmap = charSymbolObj.oBitmap;
        }
        fPenX += charSymbolObj.fAdvanceX + this.m_fCharSpacing;
        if (this.m_bNeedDoBold) {
            fPenX += this.m_unHorDpi / 72;
        }
        pString.m_fEndX = fPenX + pString.m_fX;
        pString.m_fEndY = fPenY + pString.m_fY;
        if (this.m_bIsNeedUpdateMatrix12) {
            if (this.m_pDefaultFont) {
                this.m_pDefaultFont.UpdateMatrix2();
            }
            this.UpdateMatrix2();
        }
    };
    this.SetCMapForCharCode = function (lUnicode, pnCMapIndex) {
        if (this.m_bStringGID || !this.m_pFace || 0 == this.m_nNum_charmaps) {
            return lUnicode;
        }
        var nCharIndex = 0;
        var charMapArray = this.m_pFace.charmaps;
        for (var nIndex = 0; nIndex < this.m_nNum_charmaps; ++nIndex) {
            var pCMap = charMapArray[nIndex];
            var pCharMap = __FT_CharmapRec(pCMap);
            if (0 != FT_Set_Charmap(this.m_pFace, pCMap)) {
                continue;
            }
            var pEncoding = pCharMap.encoding;
            if (FT_ENCODING_UNICODE == pEncoding) {
                if ((nCharIndex = FT_Get_Char_Index(this.m_pFace, lUnicode)) != 0) {
                    pnCMapIndex.index = nIndex;
                    return nCharIndex;
                }
            } else {
                if (FT_ENCODING_NONE == pEncoding || FT_ENCODING_MS_SYMBOL == pEncoding || FT_ENCODING_APPLE_ROMAN == pEncoding) {
                    var res_code = FT_Get_First_Char(this.m_pFace);
                    while (res_code.gindex != 0) {
                        res_code = FT_Get_Next_Char(this.m_pFace, res_code.char_code);
                        if (res_code.char_code == lUnicode) {
                            nCharIndex = res_code.gindex;
                            pnCMapIndex.index = nIndex;
                            break;
                        }
                    }
                    nCharIndex = FT_Get_Char_Index(this.m_pFace, lUnicode);
                    if (0 != nCharIndex) {
                        pnCMapIndex.index = nIndex;
                    }
                }
            }
        }
        return nCharIndex;
    };
    this.GetChar = function (lUnicode) {
        var pFace = this.m_pFace;
        var pCurentGliph = pFace.glyph;
        var Result;
        var ushUnicode = lUnicode;
        if (this.m_bIsNeedUpdateMatrix12) {
            if (this.m_pDefaultFont) {
                this.m_pDefaultFont.UpdateMatrix1();
            }
            this.UpdateMatrix1();
        }
        var unGID = 0;
        var charSymbolObj = this.m_arrCacheSizes[ushUnicode];
        if (undefined == charSymbolObj) {
            var nCMapIndex = new CCMapIndex();
            unGID = this.SetCMapForCharCode(ushUnicode, nCMapIndex);
            var oSizes = new TFontCacheSizes();
            oSizes.ushUnicode = ushUnicode;
            if (! ((unGID > 0) || (-1 != this.m_nSymbolic && (ushUnicode < 61440) && 0 < (unGID = this.SetCMapForCharCode(ushUnicode + 61440, nCMapIndex))))) {
                if (false === this.m_bUseDefaultFont || null == this.m_pDefaultFont || 0 >= (unGID = this.m_pDefaultFont.SetCMapForCharCode(ushUnicode, nCMapIndex))) {
                    if (this.m_nDefaultChar < 0) {
                        oSizes.ushGID = -1;
                        oSizes.eState = EGlyphState.glyphstateMiss;
                        var max_advance = pFace.size.metrics.max_advance;
                        oSizes.fAdvanceX = (max_advance >> 6) / 2;
                        return;
                    } else {
                        unGID = this.m_nDefaultChar;
                        oSizes.eState = EGlyphState.glyphstateNormal;
                        pFace = this.m_pFace;
                        pCurentGliph = pFace.glyph;
                    }
                } else {
                    oSizes.eState = EGlyphState.glyphstateDeafault;
                    pFace = this.m_pDefaultFont.m_pFace;
                    pCurentGliph = this.m_pDefaultFont.m_pGlyph;
                }
            } else {
                oSizes.eState = EGlyphState.glyphstateNormal;
            }
            oSizes.ushGID = unGID;
            oSizes.nCMapIndex = nCMapIndex.index;
            var _LOAD_MODE = this.HintsSupport ? this.m_oFontManager.LOAD_MODE : 40970;
            if (0 != FT_Load_Glyph(pFace, unGID, _LOAD_MODE)) {
                return;
            }
            var pGlyph = FT_Get_Glyph(pCurentGliph);
            if (null == pGlyph) {
                return;
            }
            var oBBox = new FT_BBox();
            FT_Glyph_Get_CBox(pGlyph, 1, oBBox);
            var xMin = oBBox.xMin;
            var yMin = oBBox.yMin;
            var xMax = oBBox.xMax;
            var yMax = oBBox.yMax;
            FT_Done_Glyph(pGlyph);
            pGlyph = null;
            var linearHoriAdvance = pCurentGliph.linearHoriAdvance;
            var units_per_EM = this.m_lUnits_Per_Em;
            oSizes.fAdvanceX = (linearHoriAdvance * this.m_dUnitsKoef / units_per_EM);
            oSizes.oBBox.fMinX = (xMin >> 6);
            oSizes.oBBox.fMaxX = (xMax >> 6);
            oSizes.oBBox.fMinY = (yMin >> 6);
            oSizes.oBBox.fMaxY = (yMax >> 6);
            if (this.m_bNeedDoBold) {
                oSizes.fAdvanceX += 1;
            }
            var dstM = oSizes.oMetrics;
            var srcM = pCurentGliph.metrics;
            dstM.fWidth = (srcM.width >> 6);
            dstM.fHeight = (srcM.height >> 6);
            dstM.fHoriBearingX = (srcM.horiBearingX >> 6);
            dstM.fHoriBearingY = (srcM.horiBearingY >> 6);
            dstM.fHoriAdvance = (srcM.horiAdvance >> 6);
            dstM.fVertBearingX = (srcM.vertBearingX >> 6);
            dstM.fVertBearingY = (srcM.vertBearingY >> 6);
            dstM.fVertAdvance = (srcM.vertAdvance >> 6);
            oSizes.bBitmap = false;
            oSizes.oBitmap = null;
            this.m_arrCacheSizes[oSizes.ushUnicode] = oSizes;
            Result = oSizes;
        } else {
            var nCMapIndex = charSymbolObj.nCMapIndex;
            unGID = charSymbolObj.ushGID;
            var eState = charSymbolObj.eState;
            if (EGlyphState.glyphstateMiss == eState) {
                return;
            } else {
                if (EGlyphState.glyphstateDeafault == eState) {} else {}
            }
            Result = charSymbolObj;
        }
        if (this.m_bIsNeedUpdateMatrix12) {
            if (this.m_pDefaultFont) {
                this.m_pDefaultFont.UpdateMatrix2();
            }
            this.UpdateMatrix2();
        }
        return Result;
    };
    this.GetKerning = function (unPrevGID, unGID) {
        var pDelta = new FT_Vector();
        FT_Get_Kerning(this.m_pFace, unPrevGID, unGID, 0, pDelta);
        return (pDelta.x >> 6);
    };
    this.SetStringGID = function (bGID) {
        if (this.m_bStringGID == bGID) {
            return;
        }
        this.m_bStringGID = bGID;
    };
    this.GetStringGID = function () {
        return this.m_bStringGID;
    };
    this.SetUseDefaultFont = function (bUse) {
        this.m_bUseDefaultFont = bUse;
    };
    this.GetUseDefaultFont = function () {
        return this.m_bUseDefaultFont;
    };
    this.SetCharSpacing = function (fCharSpacing) {
        this.m_fCharSpacing = fCharSpacing;
    };
    this.GetCharSpacing = function () {
        return this.m_fCharSpacing;
    };
    this.GetStyleName = function () {
        return this.m_pFace.style_name;
    };
    this.UpdateStyles = function (bBold, bItalic) {
        var sStyle = this.GetStyleName();
        var bSrcBold = (-1 != sStyle.indexOf("Bold"));
        var bSrcItalic = (-1 != sStyle.indexOf("Italic"));
        if (!bBold) {
            this.m_bNeedDoBold = false;
        } else {
            if (bBold) {
                if (bSrcBold) {
                    this.m_bNeedDoBold = false;
                } else {
                    this.m_bNeedDoBold = true;
                }
            }
        }
        if (!bItalic) {
            this.SetItalic(false);
        } else {
            if (bItalic) {
                if (bSrcItalic) {
                    this.SetItalic(false);
                } else {
                    this.SetItalic(true);
                }
            }
        }
    };
    this.SetItalic = function (value) {
        if (this.m_bNeedDoItalic != value) {
            this.ClearCache();
            this.m_bNeedDoItalic = value;
            this.ResetFontMatrix();
        }
    };
    this.SetNeedBold = function (value) {
        if (this.m_bNeedDoBold != value) {
            this.ClearCache();
        }
        this.m_bNeedDoBold = value;
    };
    this.ReleaseFontFace = function () {
        this.m_pFace = null;
    };
    this.IsSuccess = function () {
        return (0 == this.m_nError);
    };
    this.GetAscender = function () {
        return this.m_lAscender;
    };
    this.GetDescender = function () {
        return this.m_lDescender;
    };
    this.GetHeight = function () {
        return this.m_lLineHeight;
    };
    this.Units_Per_Em = function () {
        return this.m_lUnits_Per_Em;
    };
    this.CheckHintsSupport = function () {
        this.HintsSupport = true;
        if (!this.m_pFace || !this.m_pFace.driver || !this.m_pFace.driver.clazz) {
            return;
        }
        if (this.m_pFace.driver.clazz.name != "truetype") {
            this.HintsSupport = false;
            return;
        }
        if (this.m_pFace.family_name == "MS Mincho" || this.m_pFace.family_name == "Castellar") {
            this.HintsSupport = false;
        }
    };
}