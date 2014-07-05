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
 #pragma once
#include "stdafx.h"
#include "ElementsContainer.h"

using namespace NSAttributes;


void STextPFRun::ReadFromStream(IStream* pStream)
{
	if (bIsExt)
	{
		lCount = StreamUtils::ReadDWORD(pStream);
		lIndentLevel = StreamUtils::ReadWORD(pStream);
	}

	DWORD dwFlags = StreamUtils::ReadDWORD(pStream);
	BYTE flag1 = (BYTE)(dwFlags);
	BYTE flag2 = (BYTE)(dwFlags >> 8);
	BYTE flag3 = (BYTE)(dwFlags >> 16);
	BYTE flag4 = (BYTE)(dwFlags >> 24);

	hasBullet_				= (0x01 == (0x01 & flag1));
	bulletHasFont_			= (0x02 == (0x02 & flag1));
	bulletHasColor_			= (0x04 == (0x04 & flag1));
	bulletHasSize_			= (0x08 == (0x08 & flag1));
	bulletFont_				= (0x10 == (0x10 & flag1));
	bulletColor_			= (0x20 == (0x20 & flag1));
	bulletSize_				= (0x40 == (0x40 & flag1));
	bulletChar_				= (0x80 == (0x80 & flag1));

	leftMargin_				= (0x01 == (0x01 & flag2));
	
	indent_					= (0x04 == (0x04 & flag2));
	align_					= (0x08 == (0x08 & flag2));
	lineSpacing_			= (0x10 == (0x10 & flag2));
	spaceBefore_			= (0x20 == (0x20 & flag2));
	spaceAfter_				= (0x40 == (0x40 & flag2));
	defaultTabSize_			= (0x80 == (0x80 & flag2));

	fontAlign_				= (0x01 == (0x01 & flag3));
	charWrap_				= (0x02 == (0x02 & flag3));
	wordWrap_				= (0x04 == (0x04 & flag3));
	overflow_				= (0x08 == (0x08 & flag3));
	tabStops_				= (0x10 == (0x10 & flag3));
	textDirection_			= (0x20 == (0x20 & flag3));
	
	bulletBlip_				= (0x80 == (0x80 & flag3));

	bulletScheme_			= (0x01 == (0x01 & flag4));
	bulletHasScheme_		= (0x02 == (0x02 & flag4));

	if (hasBullet_ || bulletHasFont_ || bulletHasColor_ || bulletHasSize_)
		bulletFlag = StreamUtils::ReadWORD(pStream);

    if (bulletChar_)
        bulletChar = (WCHAR)StreamUtils::ReadWORD(pStream);

    if (bulletFont_)
        bulletFontRef = StreamUtils::ReadWORD(pStream);

	if (bulletSize_)
        bulletSize = StreamUtils::ReadWORD(pStream);

	if (bulletColor_)
	{
		bulletColor.FromStream(pStream);
	}

    if (align_)
	{
		textAlignment = StreamUtils::ReadWORD(pStream);
	}

    if (lineSpacing_)
	{
		lineSpacing = StreamUtils::ReadSHORT(pStream);
	}

    if (spaceBefore_)
	{
		spaceBefore = StreamUtils::ReadSHORT(pStream);
	}

    if (spaceAfter_)
	{
		spaceAfter = StreamUtils::ReadSHORT(pStream);
	}

    if (leftMargin_)
        leftMargin = StreamUtils::ReadSHORT(pStream);

    if (indent_)
        indent = StreamUtils::ReadSHORT(pStream);

    if (defaultTabSize_)
        defaultTabSize = StreamUtils::ReadWORD(pStream);

	if (tabStops_)
    {
        WORD tabStopsCount = StreamUtils::ReadWORD(pStream);
		tabsStops.RemoveAll();

		
		if (tabStopsCount > 10)
			tabStopsCount = 10;

        for (int i = 0; i < (int)tabStopsCount; ++i)
        {
			tabsStops.Add(StreamUtils::ReadDWORD(pStream));
        }

		
    }

    if (fontAlign_)
        fontAlign = StreamUtils::ReadWORD(pStream);
	
	if (charWrap_ || wordWrap_ || overflow_)
        wrapFlags = StreamUtils::ReadWORD(pStream);

    if (textDirection_)
        textDirectional = StreamUtils::ReadWORD(pStream);
}
void STextPFRun::ApplyProperties(CElementsContainer* pSlide, CTextAttributesEx* pTextAttributes)
{
	if (NULL == pTextAttributes)
		return;

	if (align_)
	{
		switch (textAlignment)
		{
		case 0:
		case 1:
		case 2:
			{
				pTextAttributes->m_oAttributes.m_nTextAlignHorizontal = textAlignment;
				break;
			}
		default: break;
		};
	}
}


void STextCFRun::ReadFromStream(IStream* pStream)
{
	if (bIsExt)
	{
		lCount = StreamUtils::ReadDWORD(pStream);
	}

	DWORD dwFlags = StreamUtils::ReadDWORD(pStream);
	BYTE flag1 = (BYTE)(dwFlags);
	BYTE flag2 = (BYTE)(dwFlags >> 8);
	BYTE flag3 = (BYTE)(dwFlags >> 16);
	BYTE flag4 = (BYTE)(dwFlags >> 24);

	hasBold					= (0x01 == (0x01 & flag1));
	hasItalic				= (0x02 == (0x02 & flag1));
	hasUnderline			= (0x04 == (0x04 & flag1));
	
	hasShadow				= (0x10 == (0x10 & flag1));
	hasFehint				= (0x20 == (0x20 & flag1));
	
	hasKimi					= (0x80 == (0x80 & flag1));

	
	hasEmboss				= (0x02 == (0x02 & flag2));
	
	hasStyle				= ((0x3C & flag2) >> 2);
	

	hasTypeface				= (0x01 == (0x01 & flag3));
	hasSize					= (0x02 == (0x02 & flag3));
	hasColor				= (0x04 == (0x04 & flag3));
	hasPosition				= (0x08 == (0x08 & flag3));
	hasPp10ext				= (0x10 == (0x10 & flag3));
	hasOldEATypeface		= (0x20 == (0x20 & flag3));
	hasAnsiTypeface			= (0x40 == (0x40 & flag3));
	hasSymbolTypeface		= (0x80 == (0x80 & flag3));

	hasNewEATypeface		= (0x01 == (0x01 & flag4));
	hasCsTypeface			= (0x02 == (0x02 & flag4));
	hasPp11ext				= (0x04 == (0x04 & flag4));

	bool bIsFontStylePresent = (hasBold || hasItalic || hasUnderline || hasShadow || 
		hasFehint || hasKimi || hasEmboss || hasStyle != 0);
	
    if (bIsFontStylePresent)
	{
		fontStyle = StreamUtils::ReadWORD(pStream);
	}

    if (hasTypeface)
	{
		fontRef = StreamUtils::ReadWORD(pStream);
	}

	if (hasOldEATypeface)
		fontEAFontRef = StreamUtils::ReadWORD(pStream);

	if (hasAnsiTypeface)
		ansiFontRef = StreamUtils::ReadWORD(pStream);

	if (hasSymbolTypeface)
		symbolFontRef = StreamUtils::ReadWORD(pStream);
	
	if (hasSize)
	{
		fontSize = StreamUtils::ReadWORD(pStream);
	}

	if (hasColor)
	{
		oColor.FromStream(pStream);
	}

	if (hasPosition)
		position = StreamUtils::ReadWORD(pStream);

	
}
void STextCFRun::ApplyProperties(CElementsContainer* pSlide, CTextAttributesEx* pTextAttributes)
{
	if (NULL == pTextAttributes)
		return;

	bool bIsFontStylePresent = (hasBold || hasItalic || hasUnderline || hasShadow || 
		hasFehint || hasKimi || hasEmboss || hasStyle != 0);
	
    if (bIsFontStylePresent)
	{
		if (hasBold)
		{
			pTextAttributes->m_oAttributes.m_oFont.m_bBold = (0x01 == (0x01 & fontStyle));
		}
		if (hasItalic)
		{
			pTextAttributes->m_oAttributes.m_oFont.m_bItalic = (0x02 == (0x02 & fontStyle));
		}
		if (hasUnderline)
		{
			pTextAttributes->m_oAttributes.m_oFont.m_bUnderline = (0x04 == (0x04 & fontStyle));
		}
		if (hasShadow)
		{
			pTextAttributes->m_oAttributes.m_oTextShadow.m_bVisible = (0x10 == (0x10 & fontStyle));
		}
	}

    if (hasTypeface)
	{
		if (NULL != pSlide && NULL != pSlide->m_pFonts)
		{
			if (fontRef < pSlide->m_pFonts->GetSize())
			{
				pTextAttributes->m_oAttributes.m_oFont.m_strFontName = (*(pSlide->m_pFonts))[fontRef].m_strFontName;
				
				
				strFontName = (*(pSlide->m_pFonts))[fontRef].m_strFontName;

				
				fontCharset.RemoveAll();
				fontCharset.Add((*(pSlide->m_pFonts))[fontRef].m_lCharset);

				
				fontPitchFamily = (*(pSlide->m_pFonts))[fontRef].m_strPitchFamily;

				
				fontPanose		= _T("");
				
				fontFixed		= -1;
			}
		}
	}

	if (hasSize)
	{
		pTextAttributes->m_oAttributes.m_oFont.m_nSize = (int)fontSize;
	}

	if (hasColor)
	{
		if (0 <= oColor.Index && oColor.Index <= 7 && NULL != pSlide)
		{
			
			if (oColor.Index < pSlide->m_arColorScheme.GetSize())
			{
				oColor = pSlide->m_arColorScheme[oColor.Index];
			}
		}
		
		oColor.ToColor(&(pTextAttributes->m_oAttributes.m_oTextBrush.m_oColor1));
	}
}


void STextRuler::ApplyProperties(CElementsContainer* pSlide, CTextAttributesEx* pTextAttributes)
{
	pTextAttributes->m_oRuler = *this;
}
void STextRuler::CorrectRuler(CTextAttributesEx* pTextAttributes)
{
	if (NULL == pTextAttributes)
		return;

	size_t lCount = pTextAttributes->m_arPFs.GetCount();
	for (size_t i = 0; i < lCount; ++i)
	{
		WORD lIndentLevel = pTextAttributes->m_arPFs[i].lIndentLevel;
		switch (lIndentLevel)
		{
		case 0:
		{
			if (bLeftMargin1) 
				pTextAttributes->m_arPFs[i].leftMargin	= LeftMargin1;
			if (bIndent1) 
			{
				pTextAttributes->m_arPFs[i].indent		= Indent1;
			}

			pTextAttributes->m_arPFs[i].indent			-= pTextAttributes->m_arPFs[i].leftMargin;
			break;
		}
		case 1:
		{
			if (bLeftMargin2) 
				pTextAttributes->m_arPFs[i].leftMargin	= LeftMargin2;
			if (bIndent2) 
			{
				pTextAttributes->m_arPFs[i].indent		= Indent2;
			}
			
			pTextAttributes->m_arPFs[i].indent		-= pTextAttributes->m_arPFs[i].leftMargin;

			break;
		}
		case 2:
		{
			if (bLeftMargin3) 
				pTextAttributes->m_arPFs[i].leftMargin	= LeftMargin3;
			if (bIndent3) 
			{
				pTextAttributes->m_arPFs[i].indent		= Indent3;
			}

			pTextAttributes->m_arPFs[i].indent		-= pTextAttributes->m_arPFs[i].leftMargin;
			break;
		}
		case 3:
		{
			if (bLeftMargin4) 
				pTextAttributes->m_arPFs[i].leftMargin	= LeftMargin4;
			if (bIndent4) 
			{
				pTextAttributes->m_arPFs[i].indent		= Indent4;
				
			}
			pTextAttributes->m_arPFs[i].indent		-= pTextAttributes->m_arPFs[i].leftMargin;

			break;
		}
		case 4:
		{
			if (bLeftMargin5) 
				pTextAttributes->m_arPFs[i].leftMargin	= LeftMargin5;
			if (bIndent5) 
			{
				pTextAttributes->m_arPFs[i].indent		= Indent5;
				
			}
			
			pTextAttributes->m_arPFs[i].indent		-= pTextAttributes->m_arPFs[i].leftMargin;

			break;
		}
		default:
			break;
		};
	}
}


void STextSIRun::ReadFromStream(IStream* pStream)
{
	if (bIsExt)
	{
		lCount = StreamUtils::ReadDWORD(pStream);
	}
	
	DWORD dwFlags = StreamUtils::ReadDWORD(pStream);
	BYTE flag1 = (BYTE)(dwFlags);
	BYTE flag2 = (BYTE)(dwFlags >> 8);

	bSpell					= (0x01 == (0x01 & flag1));
	bLang					= (0x02 == (0x02 & flag1));
	bAltLang				= (0x04 == (0x04 & flag1));
	
	
	bPp10ext				= (0x20 == (0x20 & flag1));
	bBidi					= (0x40 == (0x40 & flag1));
	
	
	bSmartTag				= (0x02 == (0x02 & flag2));

	if (bSpell)
	{
		Spell = StreamUtils::ReadWORD(pStream);
	}
	if (bLang)
	{
		Lang = StreamUtils::ReadWORD(pStream);
	}
	if (bAltLang)
	{
		AltLang = StreamUtils::ReadWORD(pStream);
	}
	if (bBidi)
	{
		Bidi = StreamUtils::ReadWORD(pStream);
	}
	if (bPp10ext)
	{
		DWORD dwFlags = StreamUtils::ReadDWORD(pStream);
		BYTE flag1 = (BYTE)(dwFlags);
		BYTE flag2 = (BYTE)(dwFlags >> 8);
		BYTE flag3 = (BYTE)(dwFlags >> 16);
		BYTE flag4 = (BYTE)(dwFlags >> 24);

		pp10runid = (0x0F & flag1);
		bGramma = (0x80 == (0x80 & flag4));
	}

	
}
void STextSIRun::ApplyProperties(CElementsContainer* pSlide, CTextAttributesEx* pTextAttributes)
{
	if (NULL == pTextAttributes)
		return;
}


void STextMasterStyleLevel::ReadFromStream(IStream* pStream)
{
	if (bLevelPresent)
	{
		cLevel = StreamUtils::ReadWORD(pStream);
	}
	oPFRun.ReadFromStream(pStream);
	oCFRun.ReadFromStream(pStream);
}
void STextMasterStyleLevel::ApplyProperties(CElementsContainer* pSlide, CTextAttributesEx* pTextAttributes)
{
	oPFRun.ApplyProperties(pSlide, pTextAttributes);
	oCFRun.ApplyProperties(pSlide, pTextAttributes);
}


CTextAttributesEx::CTextAttributesEx() :
			m_oAttributes(),
			m_arPFs(),
			m_arCFs(),
			m_arSIs(),
			m_oRuler()
{
	m_sText = _T("");

	m_lMasterTextType = NSOfficePPT::NoPresent;
	m_lTextType = NSOfficePPT::Other;
			
	m_oBounds.left = 0;
	m_oBounds.top = 0;
	m_oBounds.right = 50;
	m_oBounds.bottom = 50;

	m_bVertical = FALSE;
	m_bRightToLeft = FALSE;

	m_lWrapMode	= 0;
}

CTextAttributesEx& CTextAttributesEx::operator =(const CTextAttributesEx& oSrc)
{
	m_sText = oSrc.m_sText;
	m_oBounds = oSrc.m_oBounds;

	m_lMasterTextType = oSrc.m_lMasterTextType;
	m_lTextType = oSrc.m_lTextType;

	m_oAttributes	= oSrc.m_oAttributes;
	m_bVertical		= oSrc.m_bVertical;
	m_bRightToLeft	= oSrc.m_bRightToLeft;

	m_arPFs.Copy(oSrc.m_arPFs);
	m_arCFs.Copy(oSrc.m_arCFs);
	m_arSIs.Copy(oSrc.m_arSIs);
	m_oRuler = oSrc.m_oRuler;

	m_lWrapMode = oSrc.m_lWrapMode;

	return *this;
}

CTextAttributesEx::CTextAttributesEx(const CTextAttributesEx& oSrc)
{
	*this = oSrc;
}

CString CTextAttributesEx::ToString(CGeomShapeInfo& oInfo, CMetricInfo& pMetricInfo, double dStartTime, double dEndTime)
{
	m_oBounds.left		= (LONG)oInfo.m_dLeft;
	m_oBounds.top		= (LONG)oInfo.m_dTop;
	m_oBounds.right		= (LONG)(oInfo.m_dLeft + oInfo.m_dWidth);
	m_oBounds.bottom	= (LONG)(oInfo.m_dTop + oInfo.m_dHeight);

	double dRight		= oInfo.m_dLeft + oInfo.m_dWidth;
	double dLeft		= oInfo.m_dLeft;
	if (2 == m_lWrapMode)
	{
		LONG lAlign = 0;
		if (m_arPFs.GetCount() > 0)
			lAlign = m_arPFs[0].textAlignment;
		else
			lAlign = m_oAttributes.m_nTextAlignHorizontal;
		
		switch (lAlign)
		{
		case 1:
			{
				
				dLeft	-= pMetricInfo.m_lMillimetresHor;
				dRight	+= pMetricInfo.m_lMillimetresHor;
				break;
			}
		default:
			{
				dRight	= pMetricInfo.m_lMillimetresHor;
				break;
			}
		};
	}

	CString strText = _T("");
    
	strText.Format(_T("<ImagePaint-DrawTextEx left='%lf' top='%lf' right='%lf' bottom='%lf' angle='%lf' flags='%d' "), 
		dLeft, oInfo.m_dTop, dRight, oInfo.m_dTop + oInfo.m_dHeight, oInfo.m_dRotate, oInfo.GetFlags());

	
	m_sText.Replace((WCHAR)(11), '\n');

	RecalcParagraphs();
	
	
	m_sText.Replace(L"&",	L"&amp;");
	m_sText.Replace(L"'",	L"&apos;");
	m_sText.Replace(L"<",	L"&lt;");
	m_sText.Replace(L">",	L"&gt;");
	m_sText.Replace(L"\"",	L"&quot;");
	
	
	strText += (_T("text='") + StreamUtils::ConvertCStringWToCString(m_sText) + _T("' "));

	strText += (_T("vertical='") + NSAttributes::BoolToString(m_bVertical == TRUE) + _T("' "));
	strText += (_T("righttoleft='") + NSAttributes::BoolToString(m_bRightToLeft == TRUE) + _T("' "));

	strText += (_T("widthmm='") + CDirectory::ToString(pMetricInfo.m_lMillimetresHor) + _T("' "));
	strText += (_T("heightmm='") + CDirectory::ToString(pMetricInfo.m_lMillimetresVer) + _T("' "));
	strText += (_T("widthl='") + CDirectory::ToString(pMetricInfo.m_lUnitsHor) + _T("' "));
	strText += (_T("heightl='") + CDirectory::ToString(pMetricInfo.m_lUnitsVer) + _T("' "));

	strText += _T(">");

    strText += m_oAttributes.ToString();

#ifdef PPT_DEF
	
	m_oRuler.CorrectRuler(this);
#endif
	for (size_t nIndex = 0; nIndex < m_arPFs.GetCount(); ++nIndex)
	{
		strText += m_arPFs[nIndex].ToString();
	}
	for (size_t nIndex = 0; nIndex < m_arCFs.GetCount(); ++nIndex)
	{
		strText += m_arCFs[nIndex].ToString2();
	}
	
	
	
	
	
	
	CString strTimeLine = _T("");
	strTimeLine.Format(_T("<timeline type='1' begin='%lf' end='%lf' fadein='0' fadeout='0' completeness='1.0'/>"),
			dStartTime, dEndTime);

	return strText + strTimeLine + _T("</ImagePaint-DrawTextEx>");
}
void CTextAttributesEx::ApplyProperties(CElementsContainer* pContainer)
{
	if (NULL == pContainer)
		return;

	size_t nCount = 0;

	nCount = m_arPFs.GetCount();
	for (size_t nIndex = 0; nIndex < nCount; ++nIndex)
	{
		if (m_arPFs[nIndex].bulletColor_)
		{
			int nColorIndex = m_arPFs[nIndex].bulletColor.Index;
			if (0 <= nColorIndex && nColorIndex <= 7)
			{
				
				if (nColorIndex < pContainer->m_arColorScheme.GetSize())
				{
					m_arPFs[nIndex].bulletColor = pContainer->m_arColorScheme[nColorIndex];
				}
			}
		}
	}

	nCount = m_arCFs.GetCount();
	for (size_t nIndex = 0; nIndex < nCount; ++nIndex)
	{
		if (m_arCFs[nIndex].hasColor)
		{
			int nColorIndex = m_arCFs[nIndex].oColor.Index;
			if (0 <= nColorIndex && nColorIndex <= 7)
			{
				
				if (nColorIndex < pContainer->m_arColorScheme.GetSize())
				{
					m_arCFs[nIndex].oColor = pContainer->m_arColorScheme[nColorIndex];
				}
			}
		}

		if (m_arCFs[nIndex].hasTypeface)
		{
			if (NULL != pContainer->m_pFonts)
			{
				if (m_arCFs[nIndex].fontRef < pContainer->m_pFonts->GetSize())
				{
					CFont_* pFont = &(*(pContainer->m_pFonts))[m_arCFs[nIndex].fontRef];
					
					
					m_arCFs[nIndex].strFontName = pFont->m_strFontName;

					
					m_arCFs[nIndex].fontCharset.RemoveAll();
					m_arCFs[nIndex].fontCharset.Add(pFont->m_lCharset);

					
					m_arCFs[nIndex].fontPitchFamily = pFont->m_strPitchFamily;

					
					m_arCFs[nIndex].fontPanose		= _T("");
					
					m_arCFs[nIndex].fontFixed		= -1;
				}
				
			}
		}
	}
}

LONG CTextAttributesEx::GetIndentLevelCF(size_t nIndex)
{
	if ((0 > nIndex) || (nIndex >= m_arCFs.GetCount()))
		return 0;

	DWORD lStartCharacter = 0;
	for (size_t i = 0; i < nIndex; ++i)
	{
		lStartCharacter += m_arCFs[i].lCount;
	}

	size_t lCountPFs = m_arPFs.GetCount();
	DWORD lStartParagraph = 0;
	for (size_t i = 0; i < lCountPFs; ++i)
	{
		if ((lStartParagraph + m_arPFs[i].lCount) > lStartCharacter)
			return (LONG)m_arPFs[i].lIndentLevel;

		lStartParagraph += m_arPFs[i].lCount;
	}

	return 0;
}

#ifdef PPT_DEF
void CTextAttributesEx::RecalcParagraphs()
{
	
	LONG nCurIndex = 0;
	CAtlArray<STextPFRun> oArray;

	

	CAtlArray<TCHAR> oArrayDelimeters;
	oArrayDelimeters.Add(TCHAR(13));
	size_t lCountDelimeters = oArrayDelimeters.GetCount();

	
	for (size_t i = 0; i < m_arPFs.GetCount(); ++i)
	{
		CString strText = m_sText.Mid(nCurIndex, m_arPFs[i].lCount);
		
		LONG lTextLen	= strText.GetLength();
		LONG lTextBegin	= 0;

		for (LONG lIndex = 0; lIndex < lTextLen; ++lIndex)
		{
			if (lIndex == (lTextLen - 1))
			{
				
				
				
				
				size_t lIndexDel = 0;
				for (; lIndexDel < lCountDelimeters; ++lIndexDel)
				{
					if (strText.GetAt(lIndex) == oArrayDelimeters[lIndexDel])
					{
						oArray.Add(m_arPFs[i]);

						DWORD dwLen = (DWORD)(lIndex - lTextBegin + 1);
						
						oArray[oArray.GetCount() - 1].lCount = dwLen;
						if (1 == dwLen)
							oArray[oArray.GetCount() - 1].bulletFlag = 0;

						lTextBegin = lIndex + 1;
						break;
					}
				}
				if (lIndexDel == lCountDelimeters)
				{
					if ('\n' != strText.GetAt(lIndex))
					{					
						oArray.Add(m_arPFs[i]);
						oArray[oArray.GetCount() - 1].lCount = (DWORD)(lIndex - lTextBegin + 1);
					}
					else
					{
						oArray.Add(m_arPFs[i]);
						oArray[oArray.GetCount() - 1].lCount = (DWORD)(lIndex - lTextBegin);

						oArray.Add(m_arPFs[i]);
						oArray[oArray.GetCount() - 1].lCount = 1;
						oArray[oArray.GetCount() - 1].bulletFlag = 0;

						m_sText.SetAt(lIndex, ' ');
					}
					break;
				}
			}
			
			
			for (size_t lIndexDel = 0; lIndexDel < lCountDelimeters; ++lIndexDel)
			{
				if (strText.GetAt(lIndex) == oArrayDelimeters[lIndexDel])
				{
					oArray.Add(m_arPFs[i]);

					DWORD dwLen = (DWORD)(lIndex - lTextBegin + 1);
					
					oArray[oArray.GetCount() - 1].lCount = dwLen;
					if (1 == dwLen)
					{
						oArray[oArray.GetCount() - 1].bulletFlag = 0;
					}
					else if((0 == dwLen) && (lIndex == (lTextLen - 1)) && (i == (m_arPFs.GetCount() - 1)))
					{
						oArray[oArray.GetCount() - 1].lCount = 1;
						oArray[oArray.GetCount() - 1].bulletFlag = 0;
						m_sText += _T(" ");
					}

					lTextBegin = lIndex + 1;
					break;
				}
			}
		}

		nCurIndex += m_arPFs[i].lCount;
	}

	m_sText.Replace(TCHAR(10), TCHAR(13));

	m_arPFs.RemoveAll();
	m_arPFs.Copy(oArray);
}
#else
void CTextAttributesEx::RecalcParagraphs()
{
	
	LONG nCurIndex = 0;
	CAtlArray<STextPFRun> oArray;

	CAtlArray<TCHAR> oArrayDelimeters;
	oArrayDelimeters.Add(TCHAR(13));
	size_t lCountDelimeters = oArrayDelimeters.GetCount();
	
	for (size_t i = 0; i < m_arPFs.GetCount(); ++i)
	{
		CString strText = m_sText.Mid(nCurIndex, m_arPFs[i].lCount);
		
		LONG lTextLen	= strText.GetLength();
		LONG lTextBegin	= 0;

		for (LONG lIndex = 0; lIndex < lTextLen; ++lIndex)
		{
			if (lIndex == (lTextLen - 1))
			{
				
				
				
				
				size_t lIndexDel = 0;
				for (; lIndexDel < lCountDelimeters; ++lIndexDel)
				{
					if (strText.GetAt(lIndex) == oArrayDelimeters[lIndexDel])
					{
						oArray.Add(m_arPFs[i]);

						DWORD dwLen = (DWORD)(lIndex - lTextBegin + 1);
						
						oArray[oArray.GetCount() - 1].lCount = dwLen;
						if (1 == dwLen)
							oArray[oArray.GetCount() - 1].bulletFlag = 0;

						lTextBegin = lIndex + 1;
						break;
					}
				}
				if (lIndexDel == lCountDelimeters)
				{
					oArray.Add(m_arPFs[i]);
					oArray[oArray.GetCount() - 1].lCount = (DWORD)(lIndex - lTextBegin + 1);
					break;
				}
			}
			
			
			for (size_t lIndexDel = 0; lIndexDel < lCountDelimeters; ++lIndexDel)
			{
				if (strText.GetAt(lIndex) == oArrayDelimeters[lIndexDel])
				{
					oArray.Add(m_arPFs[i]);

					DWORD dwLen = (DWORD)(lIndex - lTextBegin + 1);
					
					oArray[oArray.GetCount() - 1].lCount = dwLen;
					if (1 == dwLen)
						oArray[oArray.GetCount() - 1].bulletFlag = 0;

					lTextBegin = lIndex + 1;
					break;
				}
			}
		}

		nCurIndex += m_arPFs[i].lCount;
	}

	m_arPFs.RemoveAll();
	m_arPFs.Copy(oArray);
}
#endif

