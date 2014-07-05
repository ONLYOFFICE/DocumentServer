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
#include "Attributes.h"
#include "Shapes\BaseShape\Metric.h"

#define DEFAULT_BEFORE(EXIST_PARAM, PARAM)      \
	if (!EXIST_PARAM && oSrc.##EXIST_PARAM)     \
	{										    \
		EXIST_PARAM = true;						\
		PARAM = oSrc.##PARAM;					\
	}

#define APPLY_AFTER(EXIST_PARAM, PARAM)			\
	if (oSrc.##EXIST_PARAM)						\
	{										    \
		EXIST_PARAM = true;						\
		PARAM = oSrc.##PARAM;					\
	}
	

using namespace NSAttributes;
class CTextAttributesEx;

struct SPointAtom 
{
	LONG X; 
	LONG Y; 

	CString ToString()
	{
		CString str = _T("");
		str.Format(_T("<Point info='(%d,%d)' />"), X, Y);
		return str;
	}

	void FromStream(IStream* pStream)
	{
		X = StreamUtils::ReadLONG(pStream);
		Y = StreamUtils::ReadLONG(pStream);
	}
}; 

struct SRectAtom 
{
	LONG Left; 
	LONG Top; 
	LONG Right; 
	LONG Bottom;

	CString ToString()
	{
		CString str = _T("");
		str.Format(_T("<Rect info='(%d,%d,%d,%d)' />"), Left, Top, Right, Bottom);
		return str;
	}
};

struct SSmallRectAtom 
{
	SHORT Left; 
	SHORT Top; 
	SHORT Right; 
	SHORT Bottom;

	CString ToString()
	{
		CString str = _T("");
		str.Format(_T("Rect(%d,%d,%d,%d)"), Left, Top, Right, Bottom);
		return str;
	}
};
 
struct SColorAtom 
{ 
	BYTE R; 
	BYTE G; 
	BYTE B; 
	BYTE Index; 

	bool bPaletteIndex;
	bool bPaletteRGB;
	bool bSystemRGB;
	bool bSchemeIndex;
	bool bSysIndex;

	SColorAtom()
	{
		R = 0;
		G = 0;
		B = 0; 
		Index = 0;

		bPaletteIndex = false;
		bPaletteRGB = false;
		bSystemRGB = false;
		bSchemeIndex = false;
		bSysIndex = false;
	}

	SColorAtom(const SColorAtom& oSrc)
	{
		*this = oSrc;
	}

	SColorAtom& operator=(const SColorAtom& oSrc)
	{
		R = oSrc.R;
		G = oSrc.G;
		B = oSrc.B;

		Index = oSrc.Index;

		bPaletteIndex = oSrc.bPaletteIndex;
		bPaletteRGB = oSrc.bPaletteRGB;
		bSystemRGB = oSrc.bSystemRGB;
		bSchemeIndex = oSrc.bSchemeIndex;
		bSysIndex = oSrc.bSysIndex;

		return *this;
	}

	CString ToString()
	{
		CString str = _T("");
		str.Format(_T("<Color R='%d' G='%d' B='%d' index='%d' />"), R, G, B, Index);
		return str;
	}

	CString ToString(CString name)
	{
		CString str = _T("");
		str.Format(_T(" R='%d' G='%d' B='%d' index='%d' />"), R, G, B, Index);
		str = _T("<Color_") + name + str;
		return str;
	}

	DWORD ToValue()
	{
		DWORD dwVal = (R | (G << 8) | (B << 16));
		return dwVal;
	}

	void FromStream(IStream* pStream)
	{
		R = StreamUtils::ReadBYTE(pStream);
		G = StreamUtils::ReadBYTE(pStream);
		B = StreamUtils::ReadBYTE(pStream);
		Index = StreamUtils::ReadBYTE(pStream);

		bPaletteIndex = (0x01 == (Index & 0x01));
		bPaletteRGB = (0x02 == (Index & 0x02));
		bSystemRGB = (0x04 == (Index & 0x04));
		bSchemeIndex = (0x08 == (Index & 0x08));
		bSysIndex = (0x10 == (Index & 0x10));
	}

	void FromValue(BYTE _R, BYTE _G, BYTE _B)
	{
		R = _R;
		G = _G;
		B = _B;
		Index = 0x00;
	}

	void FromValue(DWORD dwValue)
	{
		R = (BYTE)(dwValue);
		G = (BYTE)(dwValue >> 8);
		B = (BYTE)(dwValue >> 16);
		Index = (BYTE)(dwValue >> 24);

		bPaletteIndex = (0x01 == (Index & 0x01));
		bPaletteRGB = (0x02 == (Index & 0x02));
		bSystemRGB = (0x04 == (Index & 0x04));
		bSchemeIndex = (0x08 == (Index & 0x08));
		bSysIndex = (0x10 == (Index & 0x10));
	}

	void ToColor(CColor_* pColor)
	{
		pColor->R = R;
		pColor->G = G;
		pColor->B = B;
	}
};

struct STextRange
{
	UINT Begin;
	UINT End;

	CString ToString()
	{
		CString str = _T("");
		str.Format(_T("TextRange(%d,%d)"), Begin, End);
		return str;
	}
};







class CElementsContainer;
struct STextPFRun
{
	BOOL bIsExt;
	
	DWORD lCount;
	WORD lIndentLevel;

	bool hasBullet_;
	bool bulletHasFont_;
	bool bulletHasColor_;
	bool bulletHasSize_;
	bool bulletFont_;
	bool bulletColor_;
	bool bulletSize_;
	bool bulletChar_;

	bool leftMargin_;
	
	bool indent_;
	bool align_;
	bool lineSpacing_;
	bool spaceBefore_;
	bool spaceAfter_;
	bool defaultTabSize_;

	bool fontAlign_;
	bool charWrap_;
	bool wordWrap_;
	bool overflow_;
	bool tabStops_;
	bool textDirection_;
	
	bool bulletBlip_;

	bool bulletScheme_;
	bool bulletHasScheme_;
	
	WORD bulletFlag;
	WCHAR bulletChar;
	WORD bulletFontRef;
	WORD bulletSize;

	SColorAtom bulletColor;

	WORD textAlignment;
	LONG lineSpacing;
	LONG spaceBefore;
	LONG spaceAfter;
	LONG leftMargin;
	LONG indent;
	LONG defaultTabSize;

	CAtlArray<DWORD> tabsStops;

	WORD fontAlign;
	WORD wrapFlags;
	WORD textDirectional;

	STextPFRun()
	{
		bIsExt = TRUE;
		lCount = 0;

		lIndentLevel = 0;

		hasBullet_ = false;
		bulletHasFont_ = false;
		bulletHasColor_ = false;
		bulletHasSize_ = false;
		bulletFont_ = false;
		bulletColor_ = false;
		bulletSize_ = false;
		bulletChar_ = false;

		leftMargin_ = false;
		
		indent_ = false;
		align_ = false;
		lineSpacing_ = false;
		spaceBefore_ = false;
		spaceAfter_ = false;
		defaultTabSize_ = false;

		fontAlign_ = false;
		charWrap_ = false;
		wordWrap_ = false;
		overflow_ = false;
		tabStops_ = false;
		textDirection_ = false;
		
		bulletBlip_ = false;

		bulletScheme_ = false;
		bulletHasScheme_ = false;

		bulletFlag = 0;
		bulletChar = L'0';
		bulletFontRef = 0;
		bulletSize = 0;

		textAlignment = 0;
		lineSpacing = 0;
		spaceBefore = 0;
		spaceAfter = 0;
		leftMargin = 0;
		indent = 0;
		defaultTabSize = 0;

		fontAlign = 0;
		wrapFlags = 0;
		textDirectional = 0;
	}

	STextPFRun(const STextPFRun& oSrc)
	{
		*this = oSrc;
	}

	STextPFRun& operator =(const STextPFRun& oSrc)
	{
		bIsExt = oSrc.bIsExt;
		lCount = oSrc.lCount;

		lIndentLevel = oSrc.lIndentLevel;

		hasBullet_ = oSrc.hasBullet_;
		bulletHasFont_ = oSrc.bulletHasFont_;
		bulletHasColor_ = oSrc.bulletHasColor_;
		bulletHasSize_ = oSrc.bulletHasSize_;
		bulletFont_ = oSrc.bulletFont_;
		bulletColor_ = oSrc.bulletColor_;
		bulletSize_ = oSrc.bulletSize_;
		bulletChar_ = oSrc.bulletChar_;

		leftMargin_ = oSrc.leftMargin_;
		
		indent_ = oSrc.indent_;
		align_ = oSrc.align_;
		lineSpacing_ = oSrc.lineSpacing_;
		spaceBefore_ = oSrc.spaceBefore_;
		spaceAfter_ = oSrc.spaceAfter_;
		defaultTabSize_ = oSrc.defaultTabSize_;

		fontAlign_ = oSrc.fontAlign_;
		charWrap_ = oSrc.charWrap_;
		wordWrap_ = oSrc.wordWrap_;
		overflow_ = oSrc.overflow_;
		tabStops_ = oSrc.tabStops_;
		textDirection_ = oSrc.textDirection_;
		
		bulletBlip_ = oSrc.bulletBlip_;

		bulletScheme_ = oSrc.bulletScheme_;
		bulletHasScheme_ = oSrc.bulletHasScheme_;

		bulletFlag = oSrc.bulletFlag;
		bulletChar = oSrc.bulletChar;
		bulletFontRef = oSrc.bulletFontRef;
		bulletSize = oSrc.bulletSize;

		textAlignment = oSrc.textAlignment;
		lineSpacing = oSrc.lineSpacing;
		spaceBefore = oSrc.spaceBefore;
		spaceAfter = oSrc.spaceAfter;
		leftMargin = oSrc.leftMargin;
		indent = oSrc.indent;
		defaultTabSize = oSrc.defaultTabSize;

		fontAlign = oSrc.fontAlign;
		wrapFlags = oSrc.wrapFlags;
		textDirectional = oSrc.textDirectional;

		tabsStops.Copy(oSrc.tabsStops);

		return *this;
	}

	void ApplyBefore(const STextPFRun& oSrc)
	{
		bool bIsBulletFlag = (hasBullet_ || bulletHasFont_ || bulletHasColor_ || bulletHasSize_);
		bool bIsBulletFlagSrc = (oSrc.hasBullet_ || oSrc.bulletHasFont_ || oSrc.bulletHasColor_ || oSrc.bulletHasSize_);

		if (!bIsBulletFlag && bIsBulletFlagSrc)
		{
			hasBullet_ = oSrc.hasBullet_;
			bulletHasFont_ = oSrc.bulletHasFont_;
			bulletHasColor_ = oSrc.bulletHasColor_;
			bulletHasSize_ = oSrc.bulletHasSize_;
			
			bulletFlag = oSrc.bulletFlag;
		}
		
		DEFAULT_BEFORE(bulletChar_, bulletChar_)
		DEFAULT_BEFORE(bulletFont_, bulletFontRef)
		DEFAULT_BEFORE(bulletSize_, bulletSize)
		DEFAULT_BEFORE(bulletColor_, bulletColor);
		DEFAULT_BEFORE(align_, textAlignment);
		
		DEFAULT_BEFORE(lineSpacing_, lineSpacing);
		DEFAULT_BEFORE(spaceBefore_, spaceBefore);
		DEFAULT_BEFORE(spaceAfter_, spaceAfter);

		DEFAULT_BEFORE(leftMargin_, leftMargin);
		DEFAULT_BEFORE(indent_, indent);
		DEFAULT_BEFORE(defaultTabSize_, defaultTabSize);

		DEFAULT_BEFORE(fontAlign_, fontAlign);
		
		bool bWrap = charWrap_ || wordWrap_ || overflow_;
		bool bWrapSrc = oSrc.charWrap_ || oSrc.wordWrap_ || oSrc.overflow_;

		if (!bWrap || bWrapSrc)
		{
			wrapFlags = oSrc.wrapFlags;
		}

		DEFAULT_BEFORE(textDirection_, textDirectional);

		if (!tabStops_ && oSrc.tabStops_)
		{
			tabsStops.Copy(oSrc.tabsStops);
		}
	}

	void ApplyAfter(const STextPFRun& oSrc)
	{
		bool bIsBulletFlagSrc = (oSrc.hasBullet_ || oSrc.bulletHasFont_ || oSrc.bulletHasColor_ || oSrc.bulletHasSize_);

		if (bIsBulletFlagSrc)
		{
			hasBullet_ = oSrc.hasBullet_;
			bulletHasFont_ = oSrc.bulletHasFont_;
			bulletHasColor_ = oSrc.bulletHasColor_;
			bulletHasSize_ = oSrc.bulletHasSize_;
			
			bulletFlag = oSrc.bulletFlag;
		}
		
		APPLY_AFTER(bulletChar_, bulletChar_)
		APPLY_AFTER(bulletFont_, bulletFontRef)
		APPLY_AFTER(bulletSize_, bulletSize)
		APPLY_AFTER(bulletColor_, bulletColor);
		APPLY_AFTER(align_, textAlignment);
		
		APPLY_AFTER(lineSpacing_, lineSpacing);
		APPLY_AFTER(spaceBefore_, spaceBefore);
		APPLY_AFTER(spaceAfter_, spaceAfter);

		APPLY_AFTER(leftMargin_, leftMargin);
		APPLY_AFTER(indent_, indent);
		APPLY_AFTER(defaultTabSize_, defaultTabSize);

		APPLY_AFTER(fontAlign_, fontAlign);
		
		bool bWrapSrc = oSrc.charWrap_ || oSrc.wordWrap_ || oSrc.overflow_;

		if (bWrapSrc)
		{
			wrapFlags = oSrc.wrapFlags;
		}

		APPLY_AFTER(textDirection_, textDirectional);

		if (oSrc.tabStops_)
		{
			tabsStops.Copy(oSrc.tabsStops);
		}
	}


	void ReadFromStream(IStream* pStream);
	CString ToString()
	{
		XmlUtils::CXmlWriter oWriter;
		oWriter.WriteNodeBegin(_T("Paragraph"), TRUE);
		oWriter.WriteAttribute(_T("count"), CDirectory::ToString(lCount));
		if (bIsExt)
		{
			oWriter.WriteAttribute(_T("indentlevel"), CDirectory::ToString(lIndentLevel));
		}
		oWriter.WriteNodeEnd(_T("Paragraph"), TRUE, FALSE);
		
		if ((hasBullet_ || bulletHasFont_ || bulletHasColor_ || bulletHasSize_))
			CDirectory::WriteValueToNode(_T("bulletflag"), (DWORD)bulletFlag, &oWriter);

        if (bulletChar_)
		{
			
			char pData[2] = { '�', 0 };
			CStringW str(pData);
			CDirectory::WriteValueToNode(_T("bulletchar"), StreamUtils::ConvertCStringWToCString(str), &oWriter);
		}

        if (bulletFont_)
            CDirectory::WriteValueToNode(_T("bulletfontref"), (DWORD)bulletFontRef, &oWriter);

        if (bulletSize_)
            CDirectory::WriteValueToNode(_T("bulletsize"), (DWORD)bulletSize, &oWriter);

        if (bulletColor_)
		{
			CDirectory::WriteValueToNode(_T("bulletcolor"), bulletColor.ToValue(), &oWriter);
		}

        if (align_)
		{
			CDirectory::WriteValueToNode(_T("textalignment"), (DWORD)textAlignment, &oWriter);
		}

        if (lineSpacing_)
			CDirectory::WriteValueToNode(_T("linespacing"), (LONG)lineSpacing, &oWriter);

        if (spaceBefore_)
			CDirectory::WriteValueToNode(_T("spacebefore"), (LONG)spaceBefore, &oWriter);

        if (spaceAfter_)
			CDirectory::WriteValueToNode(_T("spaceafter"), (LONG)spaceAfter, &oWriter);

        if (leftMargin_)
			CDirectory::WriteValueToNode(_T("leftmargin"), (LONG)leftMargin, &oWriter);

		if (indent_)
			CDirectory::WriteValueToNode(_T("indent"), (LONG)(indent), &oWriter);

        if (defaultTabSize_)
			CDirectory::WriteValueToNode(_T("defaulttabsize"), (DWORD)defaultTabSize, &oWriter);

        if (fontAlign_)
			CDirectory::WriteValueToNode(_T("fontalign"), (DWORD)fontAlign, &oWriter);

        if (charWrap_ || wordWrap_ || overflow_)
		{
			DWORD lIsWord = 1; 
			if (0x02 == (0x02 & wrapFlags))
			{
				lIsWord = 0; 
			}
			CDirectory::WriteValueToNode(_T("wrapflags"), lIsWord, &oWriter);
		}

        if (textDirection_)
			CDirectory::WriteValueToNode(_T("textdirectional"), (DWORD)textDirectional, &oWriter);

        if (tabStops_)
        {
			oWriter.WriteNodeBegin(_T("tabstops"));
            for (size_t i = 0; i < tabsStops.GetCount(); ++i)
            {
				CDirectory::WriteValueToNode(_T("tabstop"), tabsStops[i], &oWriter);
            }
			oWriter.WriteNodeEnd(_T("tabstops"));
        }

		oWriter.WriteNodeEnd(_T("Paragraph"));
		return oWriter.GetXmlString();
	}

	void ApplyProperties(CElementsContainer* pSlide, CTextAttributesEx* pTextAttributes);
};
struct STextCFRun
{
	BOOL bIsExt;
	
	DWORD lCount;

	bool hasBold;
	bool hasItalic;
	bool hasUnderline;
	BYTE StrikeOut;
	
	bool hasShadow;
	bool hasFehint;
	
	bool hasKimi;

	
	bool hasEmboss;
	
	BYTE hasStyle;
	

	bool hasTypeface;
	bool hasSize;
	bool hasColor;
	bool hasPosition;
	bool hasPp10ext;
	bool hasOldEATypeface;
	bool hasAnsiTypeface;
	bool hasSymbolTypeface;

	bool hasNewEATypeface;
	bool hasCsTypeface;
	bool hasPp11ext;

	WORD fontStyle;
	WORD fontRef;
	WORD fontEAFontRef;
	WORD ansiFontRef;
	WORD symbolFontRef;
	WORD fontSize;
	SColorAtom oColor;
	WORD position;

	bool hasBaselineOffset;
	double BaselineOffset;
	
	CStringW strFontName;
	CString	fontPanose;
	CString	fontPitchFamily;
	LONG	fontFixed;
	CSimpleArray<BYTE>	fontCharset;

	STextCFRun()
	{
		bIsExt = TRUE;
		lCount = 0;

		hasBold = false;
		hasItalic = false;
		hasUnderline = false;
		StrikeOut = 0;
		
		hasShadow = false;
		hasFehint = false;
		
		hasKimi = false;

		
		hasEmboss = false;
		
		hasStyle = 0;
		

		hasTypeface = false;
		hasSize = false;
		hasColor = false;
		hasPosition = false;
		hasPp10ext = false;
		hasOldEATypeface = false;
		hasAnsiTypeface = false;
		hasSymbolTypeface = false;

		hasNewEATypeface = false;
		hasCsTypeface = false;
		hasPp11ext = false;

		fontStyle = 0;
		fontRef = 0;
		fontEAFontRef = 0;
		ansiFontRef = 0;
		symbolFontRef = 0;
		fontSize = 0;
		position = 0;

		hasBaselineOffset = false;
		BaselineOffset = 0.0;

		fontPanose = _T("");
		fontPitchFamily = _T("unknown");
		fontCharset.RemoveAll();
		fontCharset.Add(1);
		fontFixed = -1;
	}

	STextCFRun(const STextCFRun& oSrc)
	{
		*this = oSrc;
	}

	STextCFRun& operator =(const STextCFRun& oSrc)
	{
		bIsExt = oSrc.bIsExt;
		lCount = oSrc.lCount;

		hasBold = oSrc.hasBold;
		hasItalic = oSrc.hasItalic;
		hasUnderline = oSrc.hasUnderline;
		StrikeOut = oSrc.StrikeOut;
		
		hasShadow = oSrc.hasShadow;
		hasFehint = oSrc.hasFehint;
		
		hasKimi = oSrc.hasKimi;

		
		hasEmboss = oSrc.hasEmboss;
		
		hasStyle = oSrc.hasStyle;
		

		hasTypeface = oSrc.hasTypeface;
		hasSize = oSrc.hasSize;
		hasColor = oSrc.hasColor;
		hasPosition = oSrc.hasPosition;
		hasPp10ext = oSrc.hasPp10ext;
		hasOldEATypeface = oSrc.hasOldEATypeface;
		hasAnsiTypeface = oSrc.hasAnsiTypeface;
		hasSymbolTypeface = oSrc.hasSymbolTypeface;

		hasNewEATypeface = oSrc.hasNewEATypeface;
		hasCsTypeface = oSrc.hasCsTypeface;
		hasPp11ext = oSrc.hasPp11ext;

		fontStyle = oSrc.fontStyle;
		fontRef = oSrc.fontRef;
		fontEAFontRef = oSrc.fontEAFontRef;
		ansiFontRef = oSrc.ansiFontRef;
		symbolFontRef = oSrc.symbolFontRef;
		fontSize = oSrc.fontSize;
		oColor = oSrc.oColor;
		position = oSrc.position;

		strFontName		= oSrc.strFontName;
		fontPanose		= oSrc.fontPanose;
		fontPitchFamily = oSrc.fontPitchFamily;
		fontCharset		= oSrc.fontCharset;
		fontFixed		= oSrc.fontFixed;

		hasBaselineOffset = oSrc.hasBaselineOffset;
		BaselineOffset = oSrc.BaselineOffset;
		return *this;
	}

	void ApplyBefore(const STextCFRun& oSrc)
	{
		bool bIsFontStylePresent = (hasBold || hasItalic || hasUnderline || hasShadow || 
				hasFehint || hasKimi || hasEmboss || hasStyle != 0);

		bool bIsFontStylePresentSrc = (oSrc.hasBold || oSrc.hasItalic || oSrc.hasUnderline || oSrc.hasShadow || 
				oSrc.hasFehint || oSrc.hasKimi || oSrc.hasEmboss || oSrc.hasStyle != 0);
	
		if (!bIsFontStylePresent && bIsFontStylePresentSrc)
		{
			hasBold = oSrc.hasBold;
			hasItalic = oSrc.hasItalic;
			hasUnderline = oSrc.hasUnderline;
			hasShadow = oSrc.hasShadow;
			
			fontStyle = oSrc.fontStyle;
		}

		DEFAULT_BEFORE(hasTypeface, fontRef);
		DEFAULT_BEFORE(hasOldEATypeface, fontEAFontRef);
		DEFAULT_BEFORE(hasAnsiTypeface, ansiFontRef);
		DEFAULT_BEFORE(hasSymbolTypeface, symbolFontRef);
		DEFAULT_BEFORE(hasSize, fontSize);
		DEFAULT_BEFORE(hasColor, oColor);
		DEFAULT_BEFORE(hasPosition, position);
	}

	void ApplyAfter(const STextCFRun& oSrc)
	{
		bool bIsFontStylePresentSrc = (oSrc.hasBold || oSrc.hasItalic || oSrc.hasUnderline || oSrc.hasShadow || 
				oSrc.hasFehint || oSrc.hasKimi || oSrc.hasEmboss || oSrc.hasStyle != 0);
	
		if (bIsFontStylePresentSrc)
		{
			hasBold = oSrc.hasBold;
			hasItalic = oSrc.hasItalic;
			hasUnderline = oSrc.hasUnderline;
			hasShadow = oSrc.hasShadow;
			
			fontStyle = oSrc.fontStyle;
		}

		APPLY_AFTER(hasTypeface, fontRef);
		APPLY_AFTER(hasOldEATypeface, fontEAFontRef);
		APPLY_AFTER(hasAnsiTypeface, ansiFontRef);
		APPLY_AFTER(hasSymbolTypeface, symbolFontRef);
		APPLY_AFTER(hasSize, fontSize);
		APPLY_AFTER(hasColor, oColor);
		APPLY_AFTER(hasPosition, position);
	}

	void ReadFromStream(IStream* pStream);
	CString ToString()
	{
		XmlUtils::CXmlWriter oWriter;
		oWriter.WriteNodeBegin(_T("CFRun"), TRUE);
		oWriter.WriteAttribute(_T("count"), CDirectory::ToString(lCount));
		oWriter.WriteNodeEnd(_T("CFRun"), TRUE, FALSE);
		
		bool bIsFontStylePresent = ((StrikeOut != 0)||  hasBold || hasItalic || hasUnderline || hasShadow || 
			hasFehint || hasKimi || hasEmboss || hasStyle != 0);
		
        if (bIsFontStylePresent)
		{
			if (hasBold)
			{
				bool bBold__ = (0x01 == (0x01 & fontStyle));
				CDirectory::WriteValueToNode(_T("bold"), bBold__, &oWriter);
			}
			if (hasItalic)
			{
				bool bItalic__ = (0x02 == (0x02 & fontStyle));
				CDirectory::WriteValueToNode(_T("italic"), bItalic__, &oWriter);
			}
			if (hasUnderline)
			{
				bool bUnderline__ = (0x04 == (0x04 & fontStyle));
				CDirectory::WriteValueToNode(_T("underline"), bUnderline__, &oWriter);
			}
			if (hasShadow)
			{
				bool bShadow__ = (0x10 == (0x10 & fontStyle));
				CDirectory::WriteValueToNode(_T("shadow"), bShadow__, &oWriter);
			}
			if (StrikeOut != 0)
				CDirectory::WriteValueToNode(_T("strikeout"), (DWORD)StrikeOut, &oWriter);
		}

		if (hasTypeface)
		{
			CDirectory::WriteValueToNode(_T("fontRef"), (DWORD)fontRef, &oWriter);
		}

		if (hasOldEATypeface)
			CDirectory::WriteValueToNode(_T("fontEAFontRef"), (DWORD)fontEAFontRef, &oWriter);

		if (hasAnsiTypeface)
			CDirectory::WriteValueToNode(_T("ansiFontRef"), (DWORD)ansiFontRef, &oWriter);

		if (hasSymbolTypeface)
			CDirectory::WriteValueToNode(_T("symbolFontRef"), (DWORD)symbolFontRef, &oWriter);
		
		if (hasSize)
		{
			CDirectory::WriteValueToNode(_T("fontSize"), (DWORD)fontSize, &oWriter);
		}

		if (hasColor)
		{
			oWriter.WriteString(oColor.ToString());
		}

		if (hasPosition)
			CDirectory::WriteValueToNode(_T("baseline-shift"), (LONG)((SHORT)position), &oWriter);

		if(hasBaselineOffset)
		{
			CString str = _T("");
			str.Format(_T("%.6f"), BaselineOffset);
			CDirectory::WriteValueToNode(_T("baseline-shift"), str, &oWriter);
		}

		oWriter.WriteNodeBegin(_T("FontProperties"), TRUE);
		oWriter.WriteNodeEnd(_T("FontProperties"), TRUE, FALSE);

		oWriter.WriteNodeBegin(_T("Name"), TRUE);
		oWriter.WriteAttribute(_T("value"), strFontName);
		oWriter.WriteNodeEnd(_T("Name"), TRUE);

		if (0 < fontCharset.GetSize())
		{
			oWriter.WriteNodeBegin(_T("Charset"), TRUE);
			oWriter.WriteAttribute(_T("value"), CDirectory::ToString(fontCharset[0]));
			oWriter.WriteNodeEnd(_T("Charset"), TRUE);
		}

		if (_T("unknown") != fontPitchFamily)
		{
			oWriter.WriteNodeBegin(_T("FamilyClass"), TRUE);
			oWriter.WriteAttribute(_T("name"), fontPitchFamily);
			oWriter.WriteNodeEnd(_T("FamilyClass"), TRUE);
		}

		oWriter.WriteNodeBegin(_T("Style"), TRUE);
		oWriter.WriteAttribute(_T("bold"), CDirectory::ToString(hasBold));
		oWriter.WriteAttribute(_T("italic"), CDirectory::ToString(hasItalic));
		oWriter.WriteNodeEnd(_T("Style"), TRUE);

		if (-1 != fontFixed)
		{
			oWriter.WriteNodeBegin(_T("FixedWidth"), TRUE);
			oWriter.WriteAttribute(_T("value"), CDirectory::ToString(fontFixed));
			oWriter.WriteNodeEnd(_T("FixedWidth"), TRUE);
		}

		if (_T("") != fontPanose)
		{
			oWriter.WriteNodeBegin(_T("Panose"), TRUE);
			oWriter.WriteAttribute(_T("value"), fontPanose);
			oWriter.WriteNodeEnd(_T("Panose"), TRUE);
		}

		oWriter.WriteNodeEnd(_T("FontProperties"));

		oWriter.WriteNodeEnd(_T("CFRun"));
		return oWriter.GetXmlString();
	}

	CString ToString2()
	{
		XmlUtils::CXmlWriter oWriter;
		oWriter.WriteNodeBegin(_T("Character"), TRUE);
		oWriter.WriteAttribute(_T("count"), CDirectory::ToString(lCount));
		oWriter.WriteNodeEnd(_T("Character"), TRUE, FALSE);

		oWriter.WriteNodeBegin(_T("Attributes"));
		
		bool bIsFontStylePresent = ((StrikeOut != 0) || hasBold || hasItalic || hasUnderline || hasShadow || 
			hasFehint || hasKimi || hasEmboss || hasStyle != 0);
		
        if (strFontName.GetLength() > 0)
		{
			CDirectory::WriteValueToNode(_T("font-name"), StreamUtils::ConvertCStringWToCString(strFontName), &oWriter);
		}
		
		if (bIsFontStylePresent)
		{
			if (hasBold)
			{
				bool bBold__ = (0x01 == (0x01 & fontStyle));
				CDirectory::WriteValueToNode(_T("font-bold"), bBold__, &oWriter);
			}
			if (hasItalic)
			{
				bool bItalic__ = (0x02 == (0x02 & fontStyle));
				CDirectory::WriteValueToNode(_T("font-italic"), bItalic__, &oWriter);
			}
			if (hasUnderline)
			{
				bool bUnderline__ = (0x04 == (0x04 & fontStyle));
				CDirectory::WriteValueToNode(_T("font-underline"), bUnderline__, &oWriter);
			}
			if (hasShadow)
			{
				bool bShadow__ = (0x10 == (0x10 & fontStyle));
				CDirectory::WriteValueToNode(_T("shadow-visible"), bShadow__, &oWriter);
			}
			if(StrikeOut != 0)
				CDirectory::WriteValueToNode(_T("strikeout"), (DWORD)StrikeOut, &oWriter);
		}
		
		if (hasSize)
		{
			CDirectory::WriteValueToNode(_T("font-size"), (DWORD)fontSize, &oWriter);
		}

		if (hasColor)
		{
			CDirectory::WriteValueToNode(_T("brush-color1"), oColor.ToValue(), &oWriter);
		}

		if (hasPosition)
		{
			CDirectory::WriteValueToNode(_T("baseline-shift"), (LONG)((SHORT)position), &oWriter);
		}

		if(hasBaselineOffset)
		{
			CString str = _T("");
			str.Format(_T("%.6f"), BaselineOffset);
			CDirectory::WriteValueToNode(_T("baseline-shift"), str, &oWriter);
		}

		oWriter.WriteNodeEnd(_T("Attributes"));

		oWriter.WriteNodeBegin(_T("FontProperties"), TRUE);
		oWriter.WriteNodeEnd(_T("FontProperties"), TRUE, FALSE);

		oWriter.WriteNodeBegin(_T("Name"), TRUE);
		oWriter.WriteAttribute(_T("value"), strFontName);
		oWriter.WriteNodeEnd(_T("Name"), TRUE);

		if (0 < fontCharset.GetSize())
		{
			oWriter.WriteNodeBegin(_T("Charset"), TRUE);
			oWriter.WriteAttribute(_T("value"), CDirectory::ToString(fontCharset[0]));
			oWriter.WriteNodeEnd(_T("Charset"), TRUE);
		}

		if (_T("unknown") != fontPitchFamily)
		{
			oWriter.WriteNodeBegin(_T("FamilyClass"), TRUE);
			oWriter.WriteAttribute(_T("name"), fontPitchFamily);
			oWriter.WriteNodeEnd(_T("FamilyClass"), TRUE);
		}

		oWriter.WriteNodeBegin(_T("Style"), TRUE);
		oWriter.WriteAttribute(_T("bold"), CDirectory::ToString(hasBold));
		oWriter.WriteAttribute(_T("italic"), CDirectory::ToString(hasItalic));
		oWriter.WriteNodeEnd(_T("Style"), TRUE);

		if (-1 != fontFixed)
		{
			oWriter.WriteNodeBegin(_T("FixedWidth"), TRUE);
			oWriter.WriteAttribute(_T("value"), CDirectory::ToString(fontFixed));
			oWriter.WriteNodeEnd(_T("FixedWidth"), TRUE);
		}

		if (_T("") != fontPanose)
		{
			oWriter.WriteNodeBegin(_T("Panose"), TRUE);
			oWriter.WriteAttribute(_T("value"), fontPanose);
			oWriter.WriteNodeEnd(_T("Panose"), TRUE);
		}

		oWriter.WriteNodeEnd(_T("FontProperties"));

		oWriter.WriteNodeEnd(_T("Character"));
		return oWriter.GetXmlString();
	}

	void ApplyProperties(CElementsContainer* pSlide, CTextAttributesEx* pTextAttributes);
};

struct STextRuler
{
	bool bDefaultTabSize;
	bool bCLevels;
	bool bTabStops;

	bool bLeftMargin1;
	bool bLeftMargin2;
	bool bLeftMargin3;
	bool bLeftMargin4;
	bool bLeftMargin5;

	bool bIndent1;
	bool bIndent2;
	bool bIndent3;
	bool bIndent4;
	bool bIndent5;

	SHORT DefaultTabSize;
	SHORT CLevels;
	SHORT TabStops;

	SHORT LeftMargin1;
	SHORT LeftMargin2;
	SHORT LeftMargin3;
	SHORT LeftMargin4;
	SHORT LeftMargin5;

	SHORT Indent1;
	SHORT Indent2;
	SHORT Indent3;
	SHORT Indent4;
	SHORT Indent5;

	CAtlArray<DWORD> tabsStops;

	STextRuler()
	{
		bDefaultTabSize = false;
		bCLevels = false;
		bTabStops = false;

		bLeftMargin1 = false;
		bLeftMargin2 = false;
		bLeftMargin3 = false;
		bLeftMargin4 = false;
		bLeftMargin5 = false;

		bIndent1 = false;
		bIndent2 = false;
		bIndent3 = false;
		bIndent4 = false;
		bIndent5 = false;

		DefaultTabSize = 0;
		CLevels = 0;
		TabStops = 0;

		LeftMargin1 = 0;
		LeftMargin2 = 0;
		LeftMargin3 = 0;
		LeftMargin4 = 0;
		LeftMargin5 = 0;

		Indent1 = 0;
		Indent2 = 0;
		Indent3 = 0;
		Indent4 = 0;
		Indent5 = 0;
	}

	STextRuler(const STextRuler& oSrc)
	{
		*this = oSrc;
	}

	STextRuler& operator =(const STextRuler& oSrc)
	{
		bDefaultTabSize = oSrc.bDefaultTabSize;
		bCLevels = oSrc.bCLevels;
		bTabStops = oSrc.bTabStops;

		bLeftMargin1 = oSrc.bLeftMargin1;
		bLeftMargin2 = oSrc.bLeftMargin2;
		bLeftMargin3 = oSrc.bLeftMargin3;
		bLeftMargin4 = oSrc.bLeftMargin4;
		bLeftMargin5 = oSrc.bLeftMargin5;

		bIndent1 = oSrc.bIndent1;
		bIndent2 = oSrc.bIndent2;
		bIndent3 = oSrc.bIndent3;
		bIndent4 = oSrc.bIndent4;
		bIndent5 = oSrc.bIndent5;

		DefaultTabSize = oSrc.DefaultTabSize;
		CLevels = oSrc.CLevels;
		TabStops = oSrc.TabStops;

		LeftMargin1 = oSrc.LeftMargin1;
		LeftMargin2 = oSrc.LeftMargin2;
		LeftMargin3 = oSrc.LeftMargin3;
		LeftMargin4 = oSrc.LeftMargin4;
		LeftMargin5 = oSrc.LeftMargin5;

		Indent1 = oSrc.Indent1;
		Indent2 = oSrc.Indent2;
		Indent3 = oSrc.Indent3;
		Indent4 = oSrc.Indent4;
		Indent5 = oSrc.Indent5;

		tabsStops.Copy(oSrc.tabsStops);

		return *this;
	}

	void ApplyBefore(const STextRuler& oSrc)
	{
		DEFAULT_BEFORE(bDefaultTabSize, DefaultTabSize)
		DEFAULT_BEFORE(bCLevels, CLevels)

		DEFAULT_BEFORE(bLeftMargin1, LeftMargin1)
		DEFAULT_BEFORE(bLeftMargin2, LeftMargin2)
		DEFAULT_BEFORE(bLeftMargin3, LeftMargin3)
		DEFAULT_BEFORE(bLeftMargin4, LeftMargin4)
		DEFAULT_BEFORE(bLeftMargin5, LeftMargin5)

		DEFAULT_BEFORE(bIndent1, Indent1)
		DEFAULT_BEFORE(bIndent2, Indent2)
		DEFAULT_BEFORE(bIndent3, Indent3)
		DEFAULT_BEFORE(bIndent4, Indent4)
		DEFAULT_BEFORE(bIndent5, Indent5)

		if (!bTabStops && oSrc.bTabStops)
		{
			tabsStops.Copy(oSrc.tabsStops);
		}
	}

	void ReadFromStream(IStream* pStream)
	{
		DWORD dwFlags = StreamUtils::ReadDWORD(pStream);
		BYTE flag1 = (BYTE)(dwFlags);
		BYTE flag2 = (BYTE)(dwFlags >> 8);
		BYTE flag3 = (BYTE)(dwFlags >> 16);
		BYTE flag4 = (BYTE)(dwFlags >> 24);

		bDefaultTabSize					= (0x01 == (0x01 & flag1));
		bCLevels						= (0x02 == (0x02 & flag1));
		bTabStops						= (0x04 == (0x04 & flag1));
		
		bLeftMargin1					= (0x08 == (0x08 & flag1));
		bLeftMargin2					= (0x10 == (0x10 & flag1));
		bLeftMargin3					= (0x20 == (0x20 & flag1));
		bLeftMargin4					= (0x40 == (0x40 & flag1));
		bLeftMargin5					= (0x80 == (0x80 & flag1));

		bIndent1						= (0x01 == (0x01 & flag2));
		bIndent2						= (0x02 == (0x02 & flag2));
		bIndent3						= (0x04 == (0x04 & flag2));
		
		bIndent4						= (0x08 == (0x08 & flag2));
		bIndent5						= (0x10 == (0x10 & flag2));

		if (bCLevels)
		{
			CLevels = StreamUtils::ReadSHORT(pStream);
		}
		if (bDefaultTabSize)
		{
			DefaultTabSize = StreamUtils::ReadSHORT(pStream);
		}
		if (bTabStops)
        {
            WORD tabStopsCount = StreamUtils::ReadWORD(pStream);
			tabsStops.RemoveAll();

            for (int i = 0; i < (int)tabStopsCount; ++i)
            {
				tabsStops.Add(StreamUtils::ReadDWORD(pStream));
            }
        }

		if (bLeftMargin1)
		{
			LeftMargin1 = StreamUtils::ReadSHORT(pStream);
		}
		if (bIndent1)
		{
			Indent1 = StreamUtils::ReadSHORT(pStream);
		}
		if (bLeftMargin2)
		{
			LeftMargin2 = StreamUtils::ReadSHORT(pStream);
		}
		if (bIndent2)
		{
			Indent2 = StreamUtils::ReadSHORT(pStream);
		}
		if (bLeftMargin3)
		{
			LeftMargin3 = StreamUtils::ReadSHORT(pStream);
		}
		if (bIndent3)
		{
			Indent3 = StreamUtils::ReadSHORT(pStream);
		}
		if (bLeftMargin4)
		{
			LeftMargin4 = StreamUtils::ReadSHORT(pStream);
		}
		if (bIndent4)
		{
			Indent4 = StreamUtils::ReadSHORT(pStream);
		}
		if (bLeftMargin5)
		{
			LeftMargin5 = StreamUtils::ReadSHORT(pStream);
		}
		if (bIndent5)
		{
			Indent5 = StreamUtils::ReadSHORT(pStream);
		}
	}

	CString ToString()
	{
		XmlUtils::CXmlWriter oWriter;
		oWriter.WriteNodeBegin(_T("TextRuler"));
		
		if (bCLevels)
		{
			CDirectory::WriteValueToNode(_T("CLevels"), (DWORD)CLevels, &oWriter);
		}
		if (bDefaultTabSize)
		{
			CDirectory::WriteValueToNode(_T("DefaultTabSize"), (LONG)DefaultTabSize, &oWriter);
		}
		if (bLeftMargin1)
		{
			CDirectory::WriteValueToNode(_T("LeftMargin1"), (LONG)LeftMargin1, &oWriter);
		}
		if (bIndent1)
		{
			CDirectory::WriteValueToNode(_T("Indent1"), (LONG)Indent1, &oWriter);
		}
		if (bLeftMargin2)
		{
			CDirectory::WriteValueToNode(_T("LeftMargin2"), (LONG)LeftMargin2, &oWriter);
		}
		if (bIndent2)
		{
			CDirectory::WriteValueToNode(_T("Indent2"), (LONG)Indent2, &oWriter);
		}
		if (bLeftMargin3)
		{
			CDirectory::WriteValueToNode(_T("LeftMargin3"), (LONG)LeftMargin3, &oWriter);
		}
		if (bIndent3)
		{
			CDirectory::WriteValueToNode(_T("Indent3"), (LONG)Indent3, &oWriter);
		}
		if (bLeftMargin4)
		{
			CDirectory::WriteValueToNode(_T("LeftMargin4"), (LONG)LeftMargin4, &oWriter);
		}
		if (bIndent4)
		{
			CDirectory::WriteValueToNode(_T("Indent4"), (LONG)Indent4, &oWriter);
		}
		if (bLeftMargin5)
		{
			CDirectory::WriteValueToNode(_T("LeftMargin5"), (LONG)LeftMargin5, &oWriter);
		}
		if (bIndent5)
		{
			CDirectory::WriteValueToNode(_T("Indent5"), (LONG)Indent5, &oWriter);
		}

        if (bTabStops)
        {
			oWriter.WriteNodeBegin(_T("TabStops"));
            for (size_t i = 0; i < tabsStops.GetCount(); ++i)
            {
				CDirectory::WriteValueToNode(_T("tabStop"), tabsStops[i], &oWriter);
            }
			oWriter.WriteNodeEnd(_T("TabStops"));
        }

		oWriter.WriteNodeEnd(_T("TextRuler"));
		return oWriter.GetXmlString();
	}

	void ApplyProperties(CElementsContainer* pSlide, CTextAttributesEx* pTextAttributes);

	void CorrectRuler(CTextAttributesEx* pTextAttributes);
};

struct STextSIRun
{
	BOOL bIsExt;
	
	DWORD lCount;

	bool bSpell;
	bool bLang;
	bool bAltLang;

	bool bPp10ext;
	bool bBidi;
	bool bSmartTag;

	WORD Spell;
	WORD Lang;
	WORD AltLang;

	WORD Bidi;
	BYTE pp10runid;

	bool bGramma;

	CAtlArray<DWORD> arSmartTags;

	STextSIRun()
	{
		bIsExt = TRUE;
		lCount  = 0;

		bSpell = false;
		bLang = false;
		bAltLang = false;

		bPp10ext = false;
		bBidi = false;
		bSmartTag = false;

		Spell = 0;
		Lang = 0;
		AltLang = 0;

		Bidi = 0;
		pp10runid = 0;

		bGramma = false;
	}

	STextSIRun(const STextSIRun& oSrc)
	{
		*this = oSrc;
	}

	STextSIRun& operator =(const STextSIRun& oSrc)
	{
		bIsExt = oSrc.bIsExt;
		lCount = oSrc.lCount;

		bSpell = oSrc.bSpell;
		bLang = oSrc.bLang;
		bAltLang = oSrc.bAltLang;

		bPp10ext = oSrc.bPp10ext;
		bBidi = oSrc.bBidi;
		bSmartTag = oSrc.bSmartTag;

		Spell = oSrc.Spell;
		Lang = oSrc.Lang;
		AltLang = oSrc.AltLang;

		Bidi = oSrc.Bidi;
		pp10runid = oSrc.pp10runid;

		bGramma = oSrc.bGramma;

		arSmartTags.Copy(oSrc.arSmartTags);

		return *this;
	}
	
	void ApplyBefore(const STextSIRun& oSrc)
	{
		DEFAULT_BEFORE(bSpell, Spell);
		DEFAULT_BEFORE(bLang, Lang);
		DEFAULT_BEFORE(bAltLang, AltLang);
		DEFAULT_BEFORE(bBidi, Bidi);
		DEFAULT_BEFORE(bPp10ext, pp10runid);

		if (!bGramma)
		{
			bGramma = oSrc.bGramma;			
		}
	}

	void ReadFromStream(IStream* pStream);
	
	CString ToString()
	{
		XmlUtils::CXmlWriter oWriter;
		oWriter.WriteNodeBegin(_T("SIRun"));

		if (bSpell)
		{
			CDirectory::WriteValueToNode(_T("Spell"), (DWORD)Spell, &oWriter);
		}
		if (bLang)
		{
			CDirectory::WriteValueToNode(_T("Lang"), (DWORD)Lang, &oWriter);
		}
		if (bAltLang)
		{
			CDirectory::WriteValueToNode(_T("AltLang"), (DWORD)AltLang, &oWriter);
		}
		if (bBidi)
		{
			CDirectory::WriteValueToNode(_T("Bidi"), (DWORD)Bidi, &oWriter);
		}
		if (bPp10ext)
		{
			CDirectory::WriteValueToNode(_T("pp10runid"), (DWORD)pp10runid, &oWriter);
			CDirectory::WriteValueToNode(_T("bGramma"), bGramma, &oWriter);
		}

		if (bSmartTag)
        {
			oWriter.WriteNodeBegin(_T("SmartTags"));
            for (size_t i = 0; i < arSmartTags.GetCount(); ++i)
            {
				CDirectory::WriteValueToNode(_T("tag"), arSmartTags[i], &oWriter);
            }
			oWriter.WriteNodeEnd(_T("SmartTags"));
        }

		oWriter.WriteNodeEnd(_T("SIRun"));
		return oWriter.GetXmlString();
	}

	void ApplyProperties(CElementsContainer* pSlide, CTextAttributesEx* pTextAttributes);
};

struct STextMasterStyleLevel
{
	BOOL bLevelPresent;
	WORD cLevel;
	STextPFRun oPFRun;
	STextCFRun oCFRun;

	STextMasterStyleLevel()
	{
		bLevelPresent = FALSE;
		cLevel = 0;

		oPFRun.bIsExt = FALSE;
		oCFRun.bIsExt = FALSE;
	}

	void ReadFromStream(IStream* pStream);
	void ApplyProperties(CElementsContainer* CElementsContainer, CTextAttributesEx* pTextAttributes);
	
	CString ToString()
	{
		XmlUtils::CXmlWriter oWriter;
		oWriter.WriteNodeBegin(_T("TextMasterStyleLevel"));

		if (bLevelPresent)
		{
			CDirectory::WriteValueToNode(_T("Level"), (DWORD)cLevel, &oWriter);
		}
		oWriter.WriteString(oPFRun.ToString());
		oWriter.WriteString(oCFRun.ToString());

		oWriter.WriteNodeEnd(_T("TextMasterStyleLevel"));
		return oWriter.GetXmlString();
	}

	void ApplyBefore(STextMasterStyleLevel& oLevelBefore)
	{
		oPFRun.ApplyBefore(oLevelBefore.oPFRun);
		oCFRun.ApplyBefore(oLevelBefore.oCFRun);
	}
};

class CTextFullInfo
{
public:
	STextPFRun m_oPF;
	STextCFRun m_oCF;
	STextRuler m_oRuler;
	STextSIRun m_oSI;

public:
	CTextFullInfo() : m_oPF(), m_oCF(), m_oRuler(), m_oSI()
	{
	}

	CTextFullInfo(const CTextFullInfo& oSrc)
	{
		*this = oSrc;
	}

	CTextFullInfo& operator=(const CTextFullInfo& oSrc)
	{
		m_oPF = oSrc.m_oPF;
		m_oCF = oSrc.m_oCF;
		m_oRuler = oSrc.m_oRuler;
		m_oSI = oSrc.m_oSI;
		return *this;
	}
};

class CTextMasterStyle
{
public:
	DWORD m_nTextType;
public:
	WORD m_lLevels;
	CAtlArray<STextMasterStyleLevel> m_arrLevels;

public:
	void ReadFromStream(IStream* pStream, BOOL bIsLevelsPresent)
	{
		m_arrLevels.RemoveAll();

		m_lLevels = StreamUtils::ReadWORD(pStream);
		if (0 < m_lLevels)
		{
			m_arrLevels.Add();
			m_arrLevels[0].bLevelPresent = bIsLevelsPresent;
			m_arrLevels[0].ReadFromStream(pStream);
		}
		if (1 < m_lLevels)
		{
			m_arrLevels.Add();
			m_arrLevels[1].bLevelPresent = bIsLevelsPresent;
			m_arrLevels[1].ReadFromStream(pStream);
		}
		if (2 < m_lLevels)
		{
			m_arrLevels.Add();
			m_arrLevels[2].bLevelPresent = bIsLevelsPresent;
			m_arrLevels[2].ReadFromStream(pStream);
		}
		if (3 < m_lLevels)
		{
			m_arrLevels.Add();
			m_arrLevels[3].bLevelPresent = bIsLevelsPresent;
			m_arrLevels[3].ReadFromStream(pStream);
		}
		if (4 < m_lLevels)
		{
			m_arrLevels.Add();
			m_arrLevels[4].bLevelPresent = bIsLevelsPresent;
			m_arrLevels[4].ReadFromStream(pStream);
		}

		
		Calculate();
	}
	virtual CString ToString()
	{
		CString str = _T("");
		
		for (size_t nIndex = 0; nIndex < m_arrLevels.GetCount(); ++nIndex)
		{
			str += m_arrLevels[nIndex].ToString();
		}

		return str;
	}

	void Calculate()
	{
		LONG lCount = (LONG)m_arrLevels.GetCount();
		for (LONG i = lCount - 1; i > 0; --i)
		{
			for (LONG j = i - 1; j >= 0; --j)
			{
				m_arrLevels[i].ApplyBefore(m_arrLevels[j]);
			}
		}
	}
};

class CTextAttributesEx
{
public:
	DWORD m_lMasterTextType; 
	DWORD m_lTextType;

	
	CStringW m_sText;
	RECT m_oBounds;

	
	CTextAttributes m_oAttributes;

	
	BOOL m_bVertical;
	BOOL m_bRightToLeft;

	CAtlArray<STextPFRun> m_arPFs;
	CAtlArray<STextCFRun> m_arCFs;
	CAtlArray<STextSIRun> m_arSIs;
	STextRuler m_oRuler;

	LONG	m_lWrapMode; 
	
public:
	CTextAttributesEx();
	CTextAttributesEx(const CTextAttributesEx& oSrc);
	CTextAttributesEx& operator =(const CTextAttributesEx& oSrc);
	CString ToString(CGeomShapeInfo& oInfo, CMetricInfo& pMetricInfo, double dStartTime, double dEndTime);

public:
	
	void ApplyProperties(CElementsContainer* pContainer);
	LONG GetIndentLevelCF(size_t nIndex);
	void RecalcParagraphs();
};

