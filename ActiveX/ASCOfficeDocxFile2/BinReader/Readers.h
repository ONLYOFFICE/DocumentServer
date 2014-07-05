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
#include "../BinWriter/StreamUtils.h"
#include "FileWriter.h"
#include "../BinWriter/BinReaderWriterDefines.h"
#include "ReaderClasses.h"
#include "../../XlsxSerializerCom/Writer/BinaryReader.h"


using namespace BinDocxRW;

enum ETblStyleOverrideType
{
	tblstyleoverridetypeBand1Horz  =  0,
	tblstyleoverridetypeBand1Vert  =  1,
	tblstyleoverridetypeBand2Horz  =  2,
	tblstyleoverridetypeBand2Vert  =  3,
	tblstyleoverridetypeFirstCol   =  4,
	tblstyleoverridetypeFirstRow   =  5,
	tblstyleoverridetypeLastCol    =  6,
	tblstyleoverridetypeLastRow    =  7,
	tblstyleoverridetypeNeCell     =  8,
	tblstyleoverridetypeNwCell     =  9,
	tblstyleoverridetypeSeCell     = 10,
	tblstyleoverridetypeSwCell     = 11,
	tblstyleoverridetypeWholeTable = 12
};

template <typename CallbackType > class Binary_CommonReader
	{
	protected:
		Streams::CBufferedStream& m_oBufferedStream;
		typedef int (CallbackType::*funcArg)(BYTE type, long length, void* arg);
	public:
		Binary_CommonReader(Streams::CBufferedStream& poBufferedStream):m_oBufferedStream(poBufferedStream)
		{
		}
		int ReadTable(funcArg fReadFunction, void* poFuncObj, void* arg = NULL)
		{
			int res = c_oSerConstants::ReadOk;
			
			res = m_oBufferedStream.Peek(4) == FALSE ? c_oSerConstants::ErrorStream : c_oSerConstants::ReadOk;
			if(c_oSerConstants::ReadOk != res)
				return res;
			long stLen = m_oBufferedStream.ReadLong();
			
			res = m_oBufferedStream.Peek(stLen) == FALSE ? c_oSerConstants::ErrorStream : c_oSerConstants::ReadOk;
			if(c_oSerConstants::ReadOk != res)
				return res;
			return Read1(stLen, fReadFunction, poFuncObj, arg);
		}
		int Read1(long stLen, funcArg fReadFunction, void* poFuncObj, void* arg = NULL)
		{
			int res = c_oSerConstants::ReadOk;
			long stCurPos = 0;
			while(stCurPos < stLen)
			{
				
				BYTE type = m_oBufferedStream.ReadByte();
				long length =  m_oBufferedStream.ReadLong();
				res = (((CallbackType*)poFuncObj)->*fReadFunction)(type, length, arg);
				if(res == c_oSerConstants::ReadUnknown)
				{
					m_oBufferedStream.ReadPointer(length);
					res = c_oSerConstants::ReadOk;
				}
				else if(res != c_oSerConstants::ReadOk)
					return res;
				stCurPos += length + 5;
			}
			return res;
		}
		int Read2(long stLen, funcArg fReadFunction, void* poFuncObj, void* arg = NULL)
		{
			int res = c_oSerConstants::ReadOk;
			long stCurPos = 0;
			while(stCurPos < stLen)
			{
				
				BYTE type = m_oBufferedStream.ReadByte();
				long lenType =  m_oBufferedStream.ReadByte();
				int nCurPosShift = 2;
				int nRealLen;
				switch(lenType)
				{
				case c_oSerPropLenType::Null: nRealLen = 0;break;
				case c_oSerPropLenType::Byte: nRealLen = 1;break;
				case c_oSerPropLenType::Short: nRealLen = 2;break;
				case c_oSerPropLenType::Three: nRealLen = 3;break;
				case c_oSerPropLenType::Long:
				case c_oSerPropLenType::Double: nRealLen = 4;break;
				case c_oSerPropLenType::Variable:
					nRealLen = m_oBufferedStream.ReadLong();
					nCurPosShift += 4;
					break;
				default:return c_oSerConstants::ErrorUnknown;
				}
				res = (((CallbackType*)poFuncObj)->*fReadFunction)(type, nRealLen, arg);
				if(res == c_oSerConstants::ReadUnknown)
				{
					m_oBufferedStream.ReadPointer(nRealLen);
					res = c_oSerConstants::ReadOk;
				}
				else if(res != c_oSerConstants::ReadOk)
					return res;
				stCurPos += nRealLen + nCurPosShift;
			}
			return res;
		}
	};
class Binary_CommonReader2 : public Binary_CommonReader<Binary_CommonReader2>
{
public:
	Binary_CommonReader2(Streams::CBufferedStream& poBufferedStream):Binary_CommonReader(poBufferedStream)
	{
	}
	docRGB ReadColor()
	{
		docRGB oRGB;
		oRGB.R = m_oBufferedStream.ReadByte();
		oRGB.G = m_oBufferedStream.ReadByte();
		oRGB.B = m_oBufferedStream.ReadByte();
		return oRGB;
	}
	int ReadShdOut(long length, Shd* shd)
	{
		return  Read2(length, &Binary_CommonReader2::ReadShd, this, shd);
	}
private:
	int ReadShd(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		Shd* pShd = static_cast<Shd*>(poResult);
		switch(type)
		{
		case c_oSerShdType::Value: pShd->Value = m_oBufferedStream.ReadByte();break;
		case c_oSerShdType::Color: pShd->Color = ReadColor();break;
		default:
			res = c_oSerConstants::ReadUnknown;
			break;
		}
		return res;
	};
};
class Binary_rPrReader : public Binary_CommonReader<Binary_rPrReader>
{
protected:
	Binary_CommonReader2 oBinary_CommonReader2;
public:
	Binary_rPrReader(Streams::CBufferedStream& poBufferedStream): Binary_CommonReader(poBufferedStream), oBinary_CommonReader2(poBufferedStream)
	{
	}
	int Read(long stLen, void* poResult)
	{
		return Read2(stLen, &Binary_rPrReader::ReadContent, this, poResult);
	};
	int ReadContent(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		rPr* orPr = static_cast<rPr*>(poResult);
		switch(type)
		{
		case c_oSerProp_rPrType::Bold:
			{
				BYTE Bold = m_oBufferedStream.ReadByte();
				orPr->bBold = true;
				orPr->Bold = (0 != Bold);
				break;
			}
		case c_oSerProp_rPrType::Italic:
			{
				BYTE Italic = m_oBufferedStream.ReadByte();
				orPr->bItalic = true;
				orPr->Italic = (0 != Italic);
				break;
			}
		case c_oSerProp_rPrType::Underline:
			{
				BYTE Underline = m_oBufferedStream.ReadByte();
				orPr->bUnderline = true;
				orPr->Underline = (0 != Underline);
				break;
			}
		case c_oSerProp_rPrType::Strikeout:
			{
				BYTE Strikeout = m_oBufferedStream.ReadByte();
				orPr->bStrikeout = true;
				orPr->Strikeout = (0 != Strikeout);
				break;
			}
		case c_oSerProp_rPrType::FontAscii:
			{
				CString sFontName((wchar_t*)m_oBufferedStream.ReadPointer(length), length / 2);
				CorrectString(sFontName);
				if(!sFontName.IsEmpty())
				{
					orPr->bFontAscii = true;
					orPr->FontAscii = sFontName;
				}
				break;
			}
		case c_oSerProp_rPrType::FontHAnsi:
			{
				CString sFontName((wchar_t*)m_oBufferedStream.ReadPointer(length), length / 2);
				CorrectString(sFontName);
				if(!sFontName.IsEmpty())
				{
					orPr->bFontHAnsi = true;
					orPr->FontHAnsi = sFontName;
				}
				break;
			}
		case c_oSerProp_rPrType::FontCS:
			{
				CString sFontName((wchar_t*)m_oBufferedStream.ReadPointer(length), length / 2);
				CorrectString(sFontName);
				if(!sFontName.IsEmpty())
				{
					orPr->bFontCS = true;
					orPr->FontCS = sFontName;
				}
				break;
			}
		case c_oSerProp_rPrType::FontAE:
			{
				CString sFontName((wchar_t*)m_oBufferedStream.ReadPointer(length), length / 2);
				CorrectString(sFontName);
				if(!sFontName.IsEmpty())
				{
					orPr->bFontAE = true;
					orPr->FontAE = sFontName;
				}
				break;
			}
		case c_oSerProp_rPrType::FontSize:
			{
				long nFontSize = m_oBufferedStream.ReadLong();
				orPr->bFontSize = true;
				orPr->FontSize = nFontSize;
				break;
			}
		case c_oSerProp_rPrType::Color:
			{
				orPr->bColor = true;
				orPr->Color = oBinary_CommonReader2.ReadColor();
				break;
			}
		case c_oSerProp_rPrType::VertAlign:
			{
				BYTE VertAlign = m_oBufferedStream.ReadByte();
				orPr->bVertAlign = true;
				orPr->VertAlign = VertAlign;
				break;
			}
		case c_oSerProp_rPrType::HighLight:
			{
				orPr->bHighLight = true;
				orPr->HighLight = oBinary_CommonReader2.ReadColor();
				break;
			}
		case c_oSerProp_rPrType::HighLightTyped:
			{
				BYTE byteHighLightTyped = m_oBufferedStream.ReadByte();
				switch(byteHighLightTyped)
				{
				case c_oSer_ColorType::None:orPr->bHighLight = false;break;
				}
				break;
			}
		case c_oSerProp_rPrType::RStyle:
			{
				CString sRStyle((wchar_t*)m_oBufferedStream.ReadPointer(length), length / 2);
				orPr->bRStyle = true;
				orPr->RStyle = sRStyle;
			}
			break;
		case c_oSerProp_rPrType::Spacing:
			{
				orPr->bSpacing = true;
				orPr->Spacing = m_oBufferedStream.ReadDouble2();
			}
			break;
		case c_oSerProp_rPrType::DStrikeout:
			{
				orPr->bDStrikeout = true;
				orPr->DStrikeout = (0 != m_oBufferedStream.ReadByte());
			}
			break;
		case c_oSerProp_rPrType::Caps:
			{
				orPr->bCaps = true;
				orPr->Caps = (0 != m_oBufferedStream.ReadByte());
			}
			break;
		case c_oSerProp_rPrType::SmallCaps:
			{
				orPr->bSmallCaps = true;
				orPr->SmallCaps = (0 != m_oBufferedStream.ReadByte());
			}
			break;
		case c_oSerProp_rPrType::Position:
			{
				orPr->bPosition = true;
				orPr->Position = m_oBufferedStream.ReadDouble2();
			}
			break;
		case c_oSerProp_rPrType::FontHint:
			{
				orPr->bFontHint = true;
				orPr->FontHint = m_oBufferedStream.ReadByte();
			}
			break;
		case c_oSerProp_rPrType::BoldCs:
			{
				orPr->bBoldCs = true;
				orPr->BoldCs = m_oBufferedStream.ReadBool();
			}
			break;
		case c_oSerProp_rPrType::ItalicCs:
			{
				orPr->bItalicCs = true;
				orPr->ItalicCs = m_oBufferedStream.ReadBool();
			}
			break;
		case c_oSerProp_rPrType::FontSizeCs:
			{
				orPr->bFontSizeCs = true;
				orPr->FontSizeCs = m_oBufferedStream.ReadLong();
			}
			break;
		case c_oSerProp_rPrType::Cs:
			{
				orPr->bCs = true;
				orPr->Cs = m_oBufferedStream.ReadBool();
			}
			break;
		case c_oSerProp_rPrType::Rtl:
			{
				orPr->bRtl = true;
				orPr->Rtl = m_oBufferedStream.ReadBool();
			}
			break;
		case c_oSerProp_rPrType::Lang:
			{
				orPr->bLang = true;
				orPr->Lang = m_oBufferedStream.ReadString2(length);
			}
			break;
		case c_oSerProp_rPrType::LangBidi:
			{
				orPr->bLangBidi = true;
				orPr->LangBidi = m_oBufferedStream.ReadString2(length);
			}
			break;
		case c_oSerProp_rPrType::LangEA:
			{
				orPr->bLangEA = true;
				orPr->LangEA = m_oBufferedStream.ReadString2(length);
			}
			break;
		default:
			res = c_oSerConstants::ReadUnknown;
			break;
		}
		return res;
	}
};
class Binary_pPrReader : public Binary_CommonReader<Binary_pPrReader>
{
private:
	Writers::FontTableWriter& m_oFontTableWriter;
public:
	Binary_CommonReader2 oBinary_CommonReader2;
	Binary_rPrReader oBinary_rPrReader;
	bool bDoNotWriteNullProp;
	long m_nCurNumId;
	long m_nCurLvl;

	Binary_pPrReader(Streams::CBufferedStream& poBufferedStream, Writers::FileWriter& oFileWriter):m_oFontTableWriter(oFileWriter.m_oFontTableWriter),Binary_CommonReader(poBufferedStream),oBinary_CommonReader2(poBufferedStream),oBinary_rPrReader(poBufferedStream)
	{
		bDoNotWriteNullProp = false;
		m_nCurNumId = -1;
		m_nCurLvl = -1;
	}
	int Read(long stLen, void* poResult)
	{
		return Read2(stLen, &Binary_pPrReader::ReadContent, this, poResult);
	};
	int ReadContent( BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		CStringWriter* pCStringWriter = static_cast<CStringWriter*>(poResult);
		switch(type)
		{
		case c_oSerProp_pPrType::ContextualSpacing:
			{
				BYTE contextualSpacing = m_oBufferedStream.ReadByte();
				if(0 != contextualSpacing)
					pCStringWriter->WriteString(CString(_T("<w:contextualSpacing w:val=\"true\"/>")));
				else if(false == bDoNotWriteNullProp)
					pCStringWriter->WriteString(CString(_T("<w:contextualSpacing w:val=\"false\"/>")));
				break;
			}
		case c_oSerProp_pPrType::Ind:
			{
				CStringWriter oTempWriter;
				res = Read2(length, &Binary_pPrReader::ReadInd, this, &oTempWriter);
				if(oTempWriter.GetCurSize() > 0)
				{
					pCStringWriter->WriteString(CString(_T("<w:ind")));
					pCStringWriter->Write(oTempWriter);
					pCStringWriter->WriteString(CString(_T("/>")));
				}
				break;
			}
		case c_oSerProp_pPrType::Jc:
			{
				BYTE jc = m_oBufferedStream.ReadByte();
				switch(jc)
				{
				case align_Right: pCStringWriter->WriteString(CString(_T("<w:jc w:val=\"right\" />")));break;
				case align_Left: pCStringWriter->WriteString(CString(_T("<w:jc w:val=\"left\" />")));break;
				case align_Center: pCStringWriter->WriteString(CString(_T("<w:jc w:val=\"center\" />")));break;
				case align_Justify: pCStringWriter->WriteString(CString(_T("<w:jc w:val=\"both\" />")));break;
				}
				break;
			}
		case c_oSerProp_pPrType::KeepLines:
			{
				BYTE KeepLines = m_oBufferedStream.ReadByte();
				if(0 != KeepLines)
					pCStringWriter->WriteString(CString(_T("<w:keepLines/>")));
				else if(false == bDoNotWriteNullProp)
					pCStringWriter->WriteString(CString(_T("<w:keepLines w:val=\"false\"/>")));
				break;
			}
		case c_oSerProp_pPrType::KeepNext:
			{
				BYTE KeepNext = m_oBufferedStream.ReadByte();
				if(0 != KeepNext)
					pCStringWriter->WriteString(CString(_T("<w:keepNext/>")));
				else if(false == bDoNotWriteNullProp)
					pCStringWriter->WriteString(CString(_T("<w:keepNext w:val=\"false\"/>")));
				break;
			}
		case c_oSerProp_pPrType::PageBreakBefore:
			{
				BYTE pageBreakBefore = m_oBufferedStream.ReadByte();
				if(0 != pageBreakBefore)
					pCStringWriter->WriteString(CString(_T("<w:pageBreakBefore/>")));
				else if(false == bDoNotWriteNullProp)
					pCStringWriter->WriteString(CString(_T("<w:pageBreakBefore w:val=\"false\"/>")));
				break;
			}
		case c_oSerProp_pPrType::Spacing:
			{
				Spacing oSpacing;
				res = Read2(length, &Binary_pPrReader::ReadSpacing, this, &oSpacing);
				if(oSpacing.bLine || oSpacing.bAfter || oSpacing.bBefore)
				{
					pCStringWriter->WriteString(CString(_T("<w:spacing")));
					BYTE bLineRule = linerule_Auto;
					
					if(oSpacing.bLine)
					{
						if(oSpacing.bLineRule)
							bLineRule = oSpacing.LineRule;
						CString sLineRule;
						switch(oSpacing.LineRule)
						{
							case linerule_AtLeast:sLineRule = _T(" w:lineRule=\"atLeast\"");break;
							case linerule_Exact:sLineRule = _T(" w:lineRule=\"exact\"");break;
							default:sLineRule = _T(" w:lineRule=\"auto\"");break;
						}
						pCStringWriter->WriteString(sLineRule);
					}
					if(oSpacing.bLine)
					{
						CString sLine;
						if(linerule_Auto == bLineRule)
						{
							long nLine = Round(oSpacing.Line * 240);
							sLine.Format(_T(" w:line=\"%d\""), nLine);
						}
						else
						{
							long nLine = Round( g_dKoef_mm_to_twips * oSpacing.Line);
							sLine.Format(_T(" w:line=\"%d\""), nLine);
						}
						pCStringWriter->WriteString(sLine);
					}
					if(oSpacing.bAfter)
					{
						long After = Round( g_dKoef_mm_to_twips * oSpacing.After);
						CString sAfter;
						sAfter.Format(_T(" w:after=\"%d\""), After);
						pCStringWriter->WriteString(sAfter);
					}
					if(oSpacing.bAfterAuto)
					{
						if(true == oSpacing.AfterAuto)
							pCStringWriter->WriteString(CString(_T(" w:afterAutospacing=\"1\"")));
						else
							pCStringWriter->WriteString(CString(_T(" w:afterAutospacing=\"0\"")));
					}
					if(oSpacing.bBefore)
					{
						long Before = Round( g_dKoef_mm_to_twips * oSpacing.Before);
						CString sBefore;
						sBefore.Format(_T(" w:before=\"%d\""), Before);
						pCStringWriter->WriteString(sBefore);
					}
					if(oSpacing.bBeforeAuto)
					{
						if(true == oSpacing.BeforeAuto)
							pCStringWriter->WriteString(CString(_T(" w:beforeAutospacing=\"1\"")));
						else
							pCStringWriter->WriteString(CString(_T(" w:beforeAutospacing=\"0\"")));
					}
					pCStringWriter->WriteString(CString(_T("/>")));
				}
				break;
			}
		case c_oSerProp_pPrType::Shd:
			{
				Shd oShd;
				oBinary_CommonReader2.ReadShdOut(length, &oShd);
				if(shd_Nil != oShd.Value)
				{
					CString sShd;
					sShd.Format(_T("<w:shd w:val=\"clear\" w:color=\"auto\" w:fill=\"%s\"/>"), oShd.ToString());
					pCStringWriter->WriteString(sShd);
				}
				else
				{
					CString sShd(_T("<w:shd w:val=\"clear\" w:color=\"auto\" w:fill=\"auto\"/>"));
					pCStringWriter->WriteString(sShd);
				}
				break;
			}
		case c_oSerProp_pPrType::WidowControl:
			{
				BYTE WidowControl = m_oBufferedStream.ReadByte();
				if(0 != WidowControl)
				{
					if(false == bDoNotWriteNullProp)
						pCStringWriter->WriteString(CString(_T("<w:widowControl/>")));
				}
				else
					pCStringWriter->WriteString(CString(_T("<w:widowControl w:val=\"off\" />")));
				break;
			}
		case c_oSerProp_pPrType::Tab:
			{
				Tabs oTabs;
				res = Read2(length, &Binary_pPrReader::ReadTabs, this, &oTabs);
				int nLen = oTabs.m_aTabs.GetCount();
				if(nLen > 0)
				{
					pCStringWriter->WriteString(CString(_T("<w:tabs>")));
					for(int i = 0; i < nLen; ++i)
					{
						Tab& oTab = oTabs.m_aTabs[i];
						long nTab = Round( g_dKoef_mm_to_twips * oTab.Pos);
						CString sVal;
						switch(oTab.Val)
						{
						case g_tabtype_right: sVal=_T("right");break;
						case g_tabtype_center: sVal=_T("center");break;
						case g_tabtype_clear: sVal=_T("clear");break;
						default: sVal=_T("left");break;
						}
						CString sTab;
						sTab.Format(_T("<w:tab w:val=\"%s\" w:pos=\"%d\" />"), sVal, nTab);
						pCStringWriter->WriteString(sTab);
					}
					pCStringWriter->WriteString(CString(_T("</w:tabs>")));
				}
				break;
			}
		case c_oSerProp_pPrType::ParaStyle:
			{
				CString sStyleName((wchar_t*)m_oBufferedStream.ReadPointer(length), length / 2);
				CorrectString(sStyleName);
				CString sStyle;sStyle.Format(_T("<w:pStyle w:val=\"%s\" />"), sStyleName);
				pCStringWriter->WriteString(sStyle);
				break;
			}
		case c_oSerProp_pPrType::numPr:
			pCStringWriter->WriteString(CString(_T("<w:numPr>")));
			res = Read2(length, &Binary_pPrReader::ReadNumPr, this, poResult);
			pCStringWriter->WriteString(CString(_T("</w:numPr>")));
			break;
		case c_oSerProp_pPrType::pPr_rPr:
			{
				rPr orPr(m_oFontTableWriter.m_mapFonts);
				res = oBinary_rPrReader.Read(length, &orPr);
				
				if(orPr.IsNoEmpty())
					orPr.Write(pCStringWriter);
				break;
			}
		case c_oSerProp_pPrType::pBdr:
			{
				docBorders odocBorders;
				res = Read1(length, &Binary_pPrReader::ReadBorders, this, &odocBorders);
				if(false == odocBorders.IsEmpty())
				{
					pCStringWriter->WriteString(CString(_T("<w:pBdr>")));
					odocBorders.Write(pCStringWriter, false);
					pCStringWriter->WriteString(CString(_T("</w:pBdr>")));
				}
				break;
			}
		case c_oSerProp_pPrType::FramePr:
			{
				CFramePr oFramePr;
				res = Read2(length, &Binary_pPrReader::ReadFramePr, this, &oFramePr);
				if(false == oFramePr.IsEmpty())
					oFramePr.Write(*pCStringWriter);
				break;
			}
		default:
			res = c_oSerConstants::ReadUnknown;
			break;
		}
		return res;
	};
	int ReadInd(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		CStringWriter* pCStringWriter = static_cast<CStringWriter*>(poResult);
		switch(type)
		{
		case c_oSerProp_pPrType::Ind_Left:
			{
				double dIndLeft = m_oBufferedStream.ReadDouble2();
				long nIndLeft = Round(dIndLeft * g_dKoef_mm_to_twips);
				CString sIndLeft;
				sIndLeft.Format(_T(" w:left=\"%d\""), nIndLeft);
				pCStringWriter->WriteString(sIndLeft);
				break;
			}
		case c_oSerProp_pPrType::Ind_Right:
			{
				double dIndRight = m_oBufferedStream.ReadDouble2();
				long nIndRight = Round(dIndRight * g_dKoef_mm_to_twips);
				CString sIndRight;
				sIndRight.Format(_T(" w:right=\"%d\""), nIndRight);
				pCStringWriter->WriteString(sIndRight);
				break;
			}
		case c_oSerProp_pPrType::Ind_FirstLine:
			{
				double dIndFirstLine = m_oBufferedStream.ReadDouble2();
				long nIndFirstLine = Round(dIndFirstLine * g_dKoef_mm_to_twips);
				CString sIndFirstLine;
				if(nIndFirstLine > 0)
					sIndFirstLine.Format(_T(" w:firstLine =\"%d\""), nIndFirstLine);
				else
					sIndFirstLine.Format(_T(" w:hanging=\"%d\""), -nIndFirstLine);
				pCStringWriter->WriteString(sIndFirstLine);
				break;
			}
		default:
			res = c_oSerConstants::ReadUnknown;
			break;
		}
		return res;
	};
	int ReadSpacing(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		Spacing* pSpacing = static_cast<Spacing*>(poResult);
		switch(type)
		{
		case c_oSerProp_pPrType::Spacing_Line:
			pSpacing->bLine = true;
			pSpacing->Line = m_oBufferedStream.ReadDouble2();
			break;
		case c_oSerProp_pPrType::Spacing_LineRule:
			pSpacing->bLineRule = true;
			pSpacing->LineRule = m_oBufferedStream.ReadByte();
			break;
		case c_oSerProp_pPrType::Spacing_Before:
			pSpacing->bBefore = true;
			pSpacing->Before = m_oBufferedStream.ReadDouble2();
			break;
		case c_oSerProp_pPrType::Spacing_After:
			pSpacing->bAfter = true;
			pSpacing->After = m_oBufferedStream.ReadDouble2();
			break;
		case c_oSerProp_pPrType::Spacing_BeforeAuto:
			pSpacing->bBeforeAuto = true;
			pSpacing->BeforeAuto = (0 != m_oBufferedStream.ReadByte()) ? true : false;
			break;
		case c_oSerProp_pPrType::Spacing_AfterAuto:
			pSpacing->bAfterAuto = true;
			pSpacing->AfterAuto = (0 != m_oBufferedStream.ReadByte()) ? true : false;
			break;
		default:
			res = c_oSerConstants::ReadUnknown;
			break;
		}
		return res;
	};
	int ReadTabs(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		Tabs* poTabs = static_cast<Tabs*>(poResult);
		if(c_oSerProp_pPrType::Tab_Item == type)
		{
			Tab oTabItem;
			res = Read2(length, &Binary_pPrReader::ReadTabItem, this, &oTabItem);
			poTabs->m_aTabs.Add(oTabItem);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	};
	int ReadTabItem(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		Tab* poTabItem = static_cast<Tab*>(poResult);
		if(c_oSerProp_pPrType::Tab_Item_Val == type)
			poTabItem->Val = m_oBufferedStream.ReadByte();
		else if(c_oSerProp_pPrType::Tab_Item_Pos == type)
			poTabItem->Pos = m_oBufferedStream.ReadDouble2();
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	};
	int ReadNumPr(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		CStringWriter* pCStringWriter = static_cast<CStringWriter*>(poResult);
		if(c_oSerProp_pPrType::numPr_lvl == type)
		{
			long nLvl = m_oBufferedStream.ReadLong();
			m_nCurLvl = nLvl;
			CString sLvl;sLvl.Format(_T("<w:ilvl w:val=\"%d\" />"), nLvl);
			pCStringWriter->WriteString(sLvl);
		}
		else if(c_oSerProp_pPrType::numPr_id == type)
		{
			long nnumId = m_oBufferedStream.ReadLong();
			m_nCurNumId = nnumId;
			CString snumId;snumId.Format(_T("<w:numId w:val=\"%d\" />"), nnumId);
			pCStringWriter->WriteString(snumId);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	};
	int ReadBordersOut(long length, docBorders* pdocBorders)
	{
		return Read1(length, &Binary_pPrReader::ReadBorders, this, pdocBorders);
	}
	int ReadBorders(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		docBorders* pdocBorders = static_cast<docBorders*>(poResult);
		if( c_oSerBordersType::left == type )
		{
			pdocBorders->bLeft = true;
			res = Read2(length, &Binary_pPrReader::ReadBorder, this, &pdocBorders->oLeft);
		}
		else if( c_oSerBordersType::top == type )
		{
			pdocBorders->bTop = true;
			res = Read2(length, &Binary_pPrReader::ReadBorder, this, &pdocBorders->oTop);
		}
		else if( c_oSerBordersType::right == type )
		{
			pdocBorders->bRight = true;
			res = Read2(length, &Binary_pPrReader::ReadBorder, this, &pdocBorders->oRight);
		}
		else if( c_oSerBordersType::bottom == type )
		{
			pdocBorders->bBottom = true;
			res = Read2(length, &Binary_pPrReader::ReadBorder, this, &pdocBorders->oBottom);
		}
		else if( c_oSerBordersType::insideV == type )
		{
			pdocBorders->bInsideV = true;
			res = Read2(length, &Binary_pPrReader::ReadBorder, this, &pdocBorders->oInsideV);
		}
		else if( c_oSerBordersType::insideH == type )
		{
			pdocBorders->bInsideH = true;
			res = Read2(length, &Binary_pPrReader::ReadBorder, this, &pdocBorders->oInsideH);
		}
		else if( c_oSerBordersType::between == type )
		{
			pdocBorders->bBetween = true;
			res = Read2(length, &Binary_pPrReader::ReadBorder, this, &pdocBorders->oBetween);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	};
	int ReadBorder(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		docBorder* odocBorder = static_cast<docBorder*>(poResult);
		if( c_oSerBorderType::Color == type )
		{
			odocBorder->bColor = true;
			odocBorder->Color = oBinary_CommonReader2.ReadColor();
		}
		else if( c_oSerBorderType::Space == type )
		{
			odocBorder->bSpace = true;
			odocBorder->Space = m_oBufferedStream.ReadDouble2();
		}
		else if( c_oSerBorderType::Size == type )
		{
			odocBorder->bSize = true;
			odocBorder->Size = m_oBufferedStream.ReadDouble2();
		}
		else if( c_oSerBorderType::Value == type )
		{
			odocBorder->bValue = true;
			odocBorder->Value = m_oBufferedStream.ReadByte();
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	};
	int ReadFramePr(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		CFramePr* oFramePr = static_cast<CFramePr*>(poResult);
		if( c_oSer_FramePrType::DropCap == type )
		{
			oFramePr->bDropCap = true;
			oFramePr->DropCap = m_oBufferedStream.ReadByte();
		}
		else if( c_oSer_FramePrType::H == type )
		{
			oFramePr->bH = true;
			oFramePr->H = m_oBufferedStream.ReadLong();
		}
		else if( c_oSer_FramePrType::HAnchor == type )
		{
			oFramePr->bHAnchor = true;
			oFramePr->HAnchor = m_oBufferedStream.ReadByte();
		}
		else if( c_oSer_FramePrType::HRule == type )
		{
			oFramePr->bHRule = true;
			oFramePr->HRule = m_oBufferedStream.ReadByte();
		}
		else if( c_oSer_FramePrType::HSpace == type )
		{
			oFramePr->bHSpace = true;
			oFramePr->HSpace = m_oBufferedStream.ReadLong();
		}
		else if( c_oSer_FramePrType::Lines == type )
		{
			oFramePr->bLines = true;
			oFramePr->Lines = m_oBufferedStream.ReadLong();
		}
		else if( c_oSer_FramePrType::VAnchor == type )
		{
			oFramePr->bVAnchor = true;
			oFramePr->VAnchor = m_oBufferedStream.ReadByte();
		}
		else if( c_oSer_FramePrType::VSpace == type )
		{
			oFramePr->bVSpace = true;
			oFramePr->VSpace = m_oBufferedStream.ReadLong();
		}
		else if( c_oSer_FramePrType::W == type )
		{
			oFramePr->bW = true;
			oFramePr->W = m_oBufferedStream.ReadLong();
		}
		else if( c_oSer_FramePrType::Wrap == type )
		{
			oFramePr->bWrap = true;
			oFramePr->Wrap = m_oBufferedStream.ReadByte();
		}
		else if( c_oSer_FramePrType::X == type )
		{
			oFramePr->bX = true;
			oFramePr->X = m_oBufferedStream.ReadLong();
		}
		else if( c_oSer_FramePrType::XAlign == type )
		{
			oFramePr->bXAlign = true;
			oFramePr->XAlign = m_oBufferedStream.ReadByte();
		}
		else if( c_oSer_FramePrType::Y == type )
		{
			oFramePr->bY = true;
			oFramePr->Y = m_oBufferedStream.ReadLong();
		}
		else if( c_oSer_FramePrType::YAlign == type )
		{
			oFramePr->bYAlign = true;
			oFramePr->YAlign = m_oBufferedStream.ReadByte();
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	};
};
class Binary_tblPrReader : public Binary_CommonReader<Binary_tblPrReader>
{
protected:
	Binary_pPrReader oBinary_pPrReader;
	Binary_CommonReader2 oBinary_CommonReader2;
public:
	CString m_sCurTableShd;
	CAtlArray<double> m_aCurTblGrid;
	bool bCellShd;
public:
	Binary_tblPrReader(Streams::CBufferedStream& poBufferedStream, Writers::FileWriter& oFileWriter):Binary_CommonReader(poBufferedStream),oBinary_CommonReader2(poBufferedStream),oBinary_pPrReader(poBufferedStream, oFileWriter)
	{
	}
	int Read_tblPrOut(long length, CWiterTblPr* pWiterTblPr)
	{
		return Read1(length, &Binary_tblPrReader::Read_tblPr, this, pWiterTblPr);
	}
	int Read_tblPr(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		CWiterTblPr* pWiterTblPr = static_cast<CWiterTblPr*>(poResult);
		if( c_oSerProp_tblPrType::Jc == type )
		{
			BYTE jc = m_oBufferedStream.ReadByte();
			switch(jc)
			{
			case align_Right:pWiterTblPr->Jc = CString(_T("<w:jc w:val=\"right\" />"));break;
			case align_Left:break;
			case align_Center:pWiterTblPr->Jc = CString(_T("<w:jc w:val=\"center\" />"));break;
			case align_Justify:pWiterTblPr->Jc = CString(_T("<w:jc w:val=\"both\" />"));break;
			}
		}
		else if( c_oSerProp_tblPrType::TableInd == type )
		{
			double dInd = m_oBufferedStream.ReadDouble2();
			long nInd = Round( g_dKoef_mm_to_twips * dInd);
			pWiterTblPr->TableInd.Format(_T("<w:tblInd w:w=\"%d\" w:type=\"dxa\"/>"), nInd);
		}
		else if( c_oSerProp_tblPrType::TableW == type )
		{
			docW odocW;
			res = Read2(length, &Binary_tblPrReader::ReadW, this, &odocW);
			pWiterTblPr->TableW = odocW.Write(CString(_T("w:tblW")));
		}
		else if( c_oSerProp_tblPrType::TableCellMar == type )
		{
			CStringWriter oTempWriter; 
			res = Read1(length, &Binary_tblPrReader::ReadCellMargins, this, &oTempWriter);
			if(oTempWriter.GetCurSize() > 0)
			{
				pWiterTblPr->TableCellMar.Append(CString(_T("<w:tblCellMar>")));
				pWiterTblPr->TableCellMar.Append(oTempWriter.GetData());
				pWiterTblPr->TableCellMar.Append(CString(_T("</w:tblCellMar>")));
			}
		}
		else if( c_oSerProp_tblPrType::TableBorders == type )
		{
			docBorders odocBorders;
			oBinary_pPrReader.ReadBordersOut(length, &odocBorders);
			if(false == odocBorders.IsEmpty())
			{
				CStringWriter oTempWriter; 
				odocBorders.Write(&oTempWriter, false);
				pWiterTblPr->TableBorders.Append(CString(_T("<w:tblBorders>")));
				pWiterTblPr->TableBorders.Append(oTempWriter.GetData());
				pWiterTblPr->TableBorders.Append(CString(_T("</w:tblBorders>")));
			}
		}
		else if( c_oSerProp_tblPrType::Shd == type )
		{
			Shd oShd;
			oBinary_CommonReader2.ReadShdOut(length, &oShd);
			if(shd_Nil != oShd.Value)
			{
				pWiterTblPr->Shd.Format(_T("<w:shd w:fill=\"%s\" w:val=\"clear\" w:color=\"auto\" />"), oShd.ToString());
				m_sCurTableShd = pWiterTblPr->Shd;
			}
		}
		else if( c_oSerProp_tblPrType::tblpPr == type )
		{
			CStringWriter oTempWriter;
			res = Read2(length, &Binary_tblPrReader::Read_tblpPr, this, &oTempWriter);
			pWiterTblPr->tblpPr.Append(CString(_T("<w:tblpPr w:vertAnchor=\"page\" w:horzAnchor=\"page\"")));
			pWiterTblPr->tblpPr.Append(oTempWriter.GetData());
			pWiterTblPr->tblpPr.Append(CString(_T("/>")));
		}
		else if( c_oSerProp_tblPrType::tblpPr2 == type )
		{
			CStringWriter oTempWriter;
			res = Read2(length, &Binary_tblPrReader::Read_tblpPr2, this, &oTempWriter);
			pWiterTblPr->tblpPr.Append(CString(_T("<w:tblpPr")));
			pWiterTblPr->tblpPr.Append(oTempWriter.GetData());
			pWiterTblPr->tblpPr.Append(CString(_T("/>")));
		}
		else if( c_oSerProp_tblPrType::Style == type )
		{
			CString Name((wchar_t*)m_oBufferedStream.ReadPointer(length), length / 2);
			CorrectString(Name);
			pWiterTblPr->Style.Format(_T("<w:tblStyle w:val=\"%s\"/>"), Name);
		}
		else if( c_oSerProp_tblPrType::Look == type )
		{
			
			long nLook = m_oBufferedStream.ReadLong();
			int nFC = (0 == (nLook & 0x0080)) ? 0 : 1;
			int nFR = (0 == (nLook & 0x0020)) ? 0 : 1;
			int nLC = (0 == (nLook & 0x0100)) ? 0 : 1;
			int nLR = (0 == (nLook & 0x0040)) ? 0 : 1;
			int nBH = (0 == (nLook & 0x0200)) ? 0 : 1;
			int nBV = (0 == (nLook & 0x0400)) ? 0 : 1;
			pWiterTblPr->Look.Format(_T("<w:tblLook w:val=\"%04X\" w:firstRow=\"%d\" w:lastRow=\"%d\" w:firstColumn=\"%d\" w:lastColumn=\"%d\" w:noHBand=\"%d\" w:noVBand=\"%d\"/>"), nLook, nFR, nLR, nFC, nLC, nBH, nBV);
		}
		else if( c_oSerProp_tblPrType::Layout == type )
		{
			long nLayout = m_oBufferedStream.ReadByte();
			CString sLayout;
			switch(nLayout)
			{
				case 1: sLayout = _T("autofit");break;
				case 2: sLayout = _T("fixed");break;
			}
			if(false == sLayout.IsEmpty())
				pWiterTblPr->Layout.Format(_T("<w:tblLayout w:type=\"%s\"/>"), sLayout);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	};
	int ReadW(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		docW* odocW = static_cast<docW*>(poResult);
		if( c_oSerWidthType::Type == type )
		{
			odocW->bType = true;
			odocW->Type = m_oBufferedStream.ReadByte();
		}
		else if( c_oSerWidthType::W == type )
		{
			odocW->bW = true;
			odocW->W = m_oBufferedStream.ReadDouble2();
		}
		else if( c_oSerWidthType::WDocx == type )
		{
			odocW->bWDocx = true;
			odocW->WDocx = m_oBufferedStream.ReadLong();
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	};
	int ReadCellMargins(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		CStringWriter* pCStringWriter = static_cast<CStringWriter*>(poResult);
		if( c_oSerMarginsType::left == type )
		{
			docW oLeft;
			res = Read2(length, &Binary_tblPrReader::ReadW, this, &oLeft);
			oLeft.Write(*pCStringWriter, CString(_T("w:left")));
		}
		else if( c_oSerMarginsType::top == type )
		{
			docW oTop;
			res = Read2(length, &Binary_tblPrReader::ReadW, this, &oTop);
			oTop.Write(*pCStringWriter, CString(_T("w:top")));
		}
		else if( c_oSerMarginsType::right == type )
		{
			docW oRight;
			res = Read2(length, &Binary_tblPrReader::ReadW, this, &oRight);
			oRight.Write(*pCStringWriter, CString(_T("w:right")));
		}
		else if( c_oSerMarginsType::bottom == type )
		{
			docW oBottom;
			res = Read2(length, &Binary_tblPrReader::ReadW, this, &oBottom);
			oBottom.Write(*pCStringWriter, CString(_T("w:bottom")));
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	};
	int Read_tblpPr(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		CStringWriter* pCStringWriter = static_cast<CStringWriter*>(poResult);
		if( c_oSer_tblpPrType::X == type )
		{
			double dX = m_oBufferedStream.ReadDouble2();
			long nX = Round( g_dKoef_mm_to_twips * dX);
			CString sX;sX.Format(_T(" w:tblpX=\"%d\""), nX);
			pCStringWriter->WriteString(sX);
		}
		else if( c_oSer_tblpPrType::Y == type )
		{
			double dY = m_oBufferedStream.ReadDouble2();
			long nY = Round( g_dKoef_mm_to_twips * dY);
			CString sY;sY.Format(_T(" w:tblpY=\"%d\""), nY);
			pCStringWriter->WriteString(sY);
		}
		else if( c_oSer_tblpPrType::Paddings == type )
		{
			Paddings oPaddings;
			res = Read2(length, &Binary_tblPrReader::ReadPaddings, this, &oPaddings);
			if(oPaddings.bLeft)
			{
				double dLeft = oPaddings.Left;
				long nLeft = Round( g_dKoef_mm_to_twips * dLeft);
				CString sLeft;sLeft.Format(_T(" w:leftFromText=\"%d\""), nLeft);
				pCStringWriter->WriteString(sLeft);
			}
			if(oPaddings.bTop)
			{
				double dTop = oPaddings.Top;
				long nTop = Round( g_dKoef_mm_to_twips * dTop);
				CString sTop;sTop.Format(_T(" w:topFromText=\"%d\""), nTop);
				pCStringWriter->WriteString(sTop);
			}
			if(oPaddings.bRight)
			{
				double dRight = oPaddings.Right;
				long nRight = Round( g_dKoef_mm_to_twips * dRight);
				CString sRight;sRight.Format(_T(" w:rightFromText=\"%d\""), nRight);
				pCStringWriter->WriteString(sRight);
			}
			if(oPaddings.bBottom)
			{
				double dBottom = oPaddings.Bottom;
				long nBottom = Round( g_dKoef_mm_to_twips * dBottom);
				CString sBottom;sBottom.Format(_T(" w:bottomFromText=\"%d\""), nBottom);
				pCStringWriter->WriteString(sBottom);
			}
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	};
	int Read_tblpPr2(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		CStringWriter* pCStringWriter = static_cast<CStringWriter*>(poResult);
		if( c_oSer_tblpPrType2::HorzAnchor == type )
		{
			CString sXml;
			switch(m_oBufferedStream.ReadByte())
			{
			case 0:sXml.Append(_T(" w:horzAnchor=\"margin\""));break;
			case 1:sXml.Append(_T(" w:horzAnchor=\"page\""));break;
			case 2:sXml.Append(_T(" w:horzAnchor=\"text\""));break;
			default:sXml.Append(_T(" w:horzAnchor=\"text\""));break;
			}
			pCStringWriter->WriteString(sXml);
		}
		else if( c_oSer_tblpPrType2::TblpX == type )
		{
			double dX = m_oBufferedStream.ReadDouble2();
			long nX = Round( g_dKoef_mm_to_twips * dX);
			CString sXml;sXml.Format(_T(" w:tblpX=\"%d\""), nX);
			pCStringWriter->WriteString(sXml);
		}
		else if( c_oSer_tblpPrType2::TblpXSpec == type )
		{
			CString sXml;
			switch(m_oBufferedStream.ReadByte())
			{
			case 0:sXml.Append(_T(" w:tblpXSpec=\"center\""));break;
			case 1:sXml.Append(_T(" w:tblpXSpec=\"inside\""));break;
			case 2:sXml.Append(_T(" w:tblpXSpec=\"left\""));break;
			case 3:sXml.Append(_T(" w:tblpXSpec=\"outside\""));break;
			case 4:sXml.Append(_T(" w:tblpXSpec=\"right\""));break;
			default:sXml.Append(_T(" w:tblpXSpec=\"left\""));break;
			}
			pCStringWriter->WriteString(sXml);
		}
		else if( c_oSer_tblpPrType2::VertAnchor == type )
		{
			CString sXml;
			switch(m_oBufferedStream.ReadByte())
			{
			case 0:sXml.Append(_T(" w:vertAnchor=\"margin\""));break;
			case 1:sXml.Append(_T(" w:vertAnchor=\"page\""));break;
			case 2:sXml.Append(_T(" w:vertAnchor=\"text\""));break;
			default:sXml.Append(_T(" w:vertAnchor=\"text\""));break;
			}
			pCStringWriter->WriteString(sXml);
		}
		else if( c_oSer_tblpPrType2::TblpY == type )
		{
			double dY = m_oBufferedStream.ReadDouble2();
			long nY = Round( g_dKoef_mm_to_twips * dY);
			CString sXml;sXml.Format(_T(" w:tblpY=\"%d\""), nY);
			pCStringWriter->WriteString(sXml);
		}
		else if( c_oSer_tblpPrType2::TblpYSpec == type )
		{
			CString sXml;
			switch(m_oBufferedStream.ReadByte())
			{
			case 0:sXml.Append(_T(" w:tblpYSpec=\"bottom\""));break;
			case 1:sXml.Append(_T(" w:tblpYSpec=\"center\""));break;
			case 2:sXml.Append(_T(" w:tblpYSpec=\"inline\""));break;
			case 3:sXml.Append(_T(" w:tblpYSpec=\"inside\""));break;
			case 4:sXml.Append(_T(" w:tblpYSpec=\"outside\""));break;
			case 5:sXml.Append(_T(" w:tblpYSpec=\"top\""));break;
			default:sXml.Append(_T(" w:tblpYSpec=\"top\""));break;
			}
			pCStringWriter->WriteString(sXml);
		}
		else if( c_oSer_tblpPrType2::Paddings == type )
		{
			res = Read2(length, &Binary_tblPrReader::ReadPaddings2, this, poResult);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	};
	int Read_RowPrOut(long length, CStringWriter* pCStringWriter)
	{
		return Read2(length, &Binary_tblPrReader::Read_RowPr, this, pCStringWriter);
	}
	int Read_RowPr(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		CStringWriter* pCStringWriter = static_cast<CStringWriter*>(poResult);
		if( c_oSerProp_rowPrType::CantSplit == type )
		{
			BYTE CantSplit = m_oBufferedStream.ReadByte();
			if(0 != CantSplit)
				pCStringWriter->WriteString(CString(_T("<w:cantSplit />")));
			else
				pCStringWriter->WriteString(CString(_T("<w:cantSplit w:val=\"false\"/>")));
		}
		else if( c_oSerProp_rowPrType::After == type )
		{
			rowPrAfterBefore orowPrAfterBefore(_T("After"));
			res = Read2(length, &Binary_tblPrReader::ReadAfter, this, &orowPrAfterBefore);
			if(true == orowPrAfterBefore.bGridAfter && orowPrAfterBefore.nGridAfter > 0 && false == orowPrAfterBefore.oAfterWidth.bW)
			{
				
				long nGridLength = m_aCurTblGrid.GetCount();
				if(orowPrAfterBefore.nGridAfter < nGridLength)
				{
					double nSumW = 0;
					for(int i = 0; i < orowPrAfterBefore.nGridAfter; i++)
					{
						nSumW += m_aCurTblGrid[nGridLength - i - 1];
					}
					orowPrAfterBefore.oAfterWidth.bW = true;
					orowPrAfterBefore.oAfterWidth.W = nSumW;
				}
			}
			orowPrAfterBefore.Write(*pCStringWriter);
		}
		else if( c_oSerProp_rowPrType::Before == type )
		{
			rowPrAfterBefore orowPrAfterBefore(_T("Before"));
			res = Read2(length, &Binary_tblPrReader::ReadBefore, this, &orowPrAfterBefore);
			if(true == orowPrAfterBefore.bGridAfter && orowPrAfterBefore.nGridAfter > 0 && false == orowPrAfterBefore.oAfterWidth.bW)
			{
				
				if(orowPrAfterBefore.nGridAfter < m_aCurTblGrid.GetCount())
				{
					double nSumW = 0;
					for(int i = 0; i < orowPrAfterBefore.nGridAfter; i++)
					{
						nSumW += m_aCurTblGrid[i];
					}
					orowPrAfterBefore.oAfterWidth.bW = true;
					orowPrAfterBefore.oAfterWidth.W = nSumW;
				}
			}
			orowPrAfterBefore.Write(*pCStringWriter);
		}
		else if( c_oSerProp_rowPrType::Jc == type )
		{
			BYTE jc = m_oBufferedStream.ReadByte();
			switch(jc)
			{
			case align_Right: pCStringWriter->WriteString(CString(_T("<w:jc w:val=\"right\" />")));break;
			case align_Left: pCStringWriter->WriteString(CString(_T("<w:jc w:val=\"left\" />")));break;
			case align_Center: pCStringWriter->WriteString(CString(_T("<w:jc w:val=\"center\" />")));break;
			case align_Justify: pCStringWriter->WriteString(CString(_T("<w:jc w:val=\"both\" />")));break;
			}
		}
		else if( c_oSerProp_rowPrType::TableCellSpacing == type )
		{
			double dSpacing = m_oBufferedStream.ReadDouble2();
			dSpacing /=2;
			long nSpacing = Round( g_dKoef_mm_to_twips * dSpacing);
			CString sSpacing;sSpacing.Format(_T("<w:tblCellSpacing w:w=\"%d\" w:type=\"dxa\"/>"), nSpacing);
			pCStringWriter->WriteString(sSpacing);
		}
		else if( c_oSerProp_rowPrType::Height == type )
		{
			res = Read2(length, &Binary_tblPrReader::ReadHeight, this, poResult);
		}
		else if( c_oSerProp_rowPrType::TableHeader == type )
		{
			BYTE tblHeader = m_oBufferedStream.ReadByte();
			if(0 != tblHeader)
				pCStringWriter->WriteString(CString(_T("<w:tblHeader />")));
			else
				pCStringWriter->WriteString(CString(_T("<w:tblHeader w:val=\"false\"/>")));
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	};
	int ReadAfter(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		rowPrAfterBefore* orowPrAfterBefore = static_cast<rowPrAfterBefore*>(poResult);
		if( c_oSerProp_rowPrType::GridAfter == type )
		{
			orowPrAfterBefore->bGridAfter = true;
			orowPrAfterBefore->nGridAfter = m_oBufferedStream.ReadLong();
		}
		else if( c_oSerProp_rowPrType::WAfter == type )
		{
			res = Read2(length, &Binary_tblPrReader::ReadW, this, &orowPrAfterBefore->oAfterWidth);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	};
	int ReadBefore(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		rowPrAfterBefore* orowPrAfterBefore = static_cast<rowPrAfterBefore*>(poResult);
		if( c_oSerProp_rowPrType::GridBefore == type )
		{
			orowPrAfterBefore->bGridAfter = true;
			orowPrAfterBefore->nGridAfter = m_oBufferedStream.ReadLong();
		}
		else if( c_oSerProp_rowPrType::WBefore == type )
		{
			res = Read2(length, &Binary_tblPrReader::ReadW, this, &orowPrAfterBefore->oAfterWidth);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	};
	int ReadHeight(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		CStringWriter* pCStringWriter = static_cast<CStringWriter*>(poResult);
		if( c_oSerProp_rowPrType::Height_Value == type )
		{
			double dHeight = m_oBufferedStream.ReadDouble2();
			long nHeight = Round( g_dKoef_mm_to_twips * dHeight);
			CString sHeight;sHeight.Format(_T("<w:trHeight w:val=\"%d\" />"), nHeight);
			pCStringWriter->WriteString(sHeight);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	};
	int Read_CellPrOut(long length, CStringWriter* pCStringWriter)
	{
		return Read2(length, &Binary_tblPrReader::Read_CellPr, this, pCStringWriter);
	}
	int Read_CellPr(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		CStringWriter* pCStringWriter = static_cast<CStringWriter*>(poResult);
		if( c_oSerProp_cellPrType::GridSpan == type )
		{
			long nGridSpan = m_oBufferedStream.ReadLong();
			if(nGridSpan > 1)
			{
				CString sGridSpan;sGridSpan.Format(_T("<w:gridSpan w:val=\"%d\" />"), nGridSpan);
				pCStringWriter->WriteString(sGridSpan);
			}
		}
		else if( c_oSerProp_cellPrType::Shd == type )
		{
			bCellShd = true;
			Shd oShd;
			oBinary_CommonReader2.ReadShdOut(length, &oShd);
			if(shd_Nil != oShd.Value)
			{
				CString sShd;
				sShd.Format(_T("<w:shd w:fill=\"%s\" w:val=\"clear\" w:color=\"auto\" />"), oShd.ToString());
				pCStringWriter->WriteString(sShd);
			}
		}
		else if( c_oSerProp_cellPrType::TableCellBorders == type )
		{
			docBorders odocBorders;
			oBinary_pPrReader.ReadBordersOut(length, &odocBorders);
			if(false == odocBorders.IsEmpty())
			{
				pCStringWriter->WriteString(CString(_T("<w:tcBorders>")));
				odocBorders.Write(pCStringWriter, true);
				pCStringWriter->WriteString(CString(_T("</w:tcBorders>")));
			}
		}
		else if( c_oSerProp_cellPrType::CellMar == type )
		{
			CStringWriter oTempWriter; 
			res = Read1(length, &Binary_tblPrReader::ReadCellMargins, this, &oTempWriter);
			if(oTempWriter.GetCurSize() > 0)
			{
				pCStringWriter->WriteString(CString(_T("<w:tcMar>")));
				pCStringWriter->Write(oTempWriter);
				pCStringWriter->WriteString(CString(_T("</w:tcMar>")));
			}
		}
		else if( c_oSerProp_cellPrType::TableCellW == type )
		{
			docW oW;
			res = Read2(length, &Binary_tblPrReader::ReadW, this, &oW);
			oW.Write(*pCStringWriter, CString(_T("w:tcW")));
		}
		else if( c_oSerProp_cellPrType::VAlign == type )
		{
			BYTE VAlign = m_oBufferedStream.ReadByte();
			switch(VAlign)
			{
			case vertalignjc_Top:pCStringWriter->WriteString(CString(_T("<w:vAlign w:val=\"top\" />")));break;
			case vertalignjc_Center:pCStringWriter->WriteString(CString(_T("<w:vAlign w:val=\"center\" />")));break;
			case vertalignjc_Bottom:pCStringWriter->WriteString(CString(_T("<w:vAlign w:val=\"bottom\" />")));break;
			}
		}
		else if( c_oSerProp_cellPrType::VMerge == type )
		{
			BYTE VMerge = m_oBufferedStream.ReadByte();
			switch(VMerge)
			{
			case vmerge_Restart:pCStringWriter->WriteString(CString(_T("<w:vMerge w:val=\"restart\" />")));break;
			case vmerge_Continue:pCStringWriter->WriteString(CString(_T("<w:vMerge w:val=\"continue\" />")));break;
			}
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	};
	int ReadPaddingsOut(long length, Paddings* oPaddings)
	{
		return Read2(length, &Binary_tblPrReader::ReadPaddings, this, oPaddings);
	}
	int ReadPaddings(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		Paddings* oPaddings = static_cast<Paddings*>(poResult);
		if (c_oSerPaddingType::left == type)
		{
			oPaddings->bLeft = true;
			oPaddings->Left = m_oBufferedStream.ReadDouble2();
		}
		else if (c_oSerPaddingType::top == type)
		{
			oPaddings->bTop = true;
			oPaddings->Top = m_oBufferedStream.ReadDouble2();
		}
		else if (c_oSerPaddingType::right == type)
		{
			oPaddings->bRight = true;
			oPaddings->Right = m_oBufferedStream.ReadDouble2();
		}
		else if (c_oSerPaddingType::bottom == type)
		{
			oPaddings->bBottom = true;
			oPaddings->Bottom = m_oBufferedStream.ReadDouble2();
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadPaddings2(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		CStringWriter* pCStringWriter = static_cast<CStringWriter*>(poResult);
		if (c_oSerPaddingType::left == type)
		{
			double dLeft = m_oBufferedStream.ReadDouble2();
			long nLeft = Round( g_dKoef_mm_to_twips * dLeft);
			CString sXml;sXml.Format(_T(" w:leftFromText=\"%d\""), nLeft);
			pCStringWriter->WriteString(sXml);
		}
		else if (c_oSerPaddingType::top == type)
		{
			double dTop = m_oBufferedStream.ReadDouble2();
			long nTop = Round( g_dKoef_mm_to_twips * dTop);
			CString sXml;sXml.Format(_T(" w:topFromText=\"%d\""), nTop);
			pCStringWriter->WriteString(sXml);
		}
		else if (c_oSerPaddingType::right == type)
		{
			double dRight = m_oBufferedStream.ReadDouble2();
			long nRight = Round( g_dKoef_mm_to_twips * dRight);
			CString sXml;sXml.Format(_T(" w:rightFromText=\"%d\""), nRight);
			pCStringWriter->WriteString(sXml);
		}
		else if (c_oSerPaddingType::bottom == type)
		{
			double dBottom = m_oBufferedStream.ReadDouble2();
			long nBottom = Round( g_dKoef_mm_to_twips * dBottom);
			CString sXml;sXml.Format(_T(" w:bottomFromText=\"%d\""), nBottom);
			pCStringWriter->WriteString(sXml);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
};
class Binary_NumberingTableReader : public Binary_CommonReader<Binary_NumberingTableReader>
{
	Binary_pPrReader oBinary_pPrReader;
	Binary_rPrReader oBinary_rPrReader;
	Writers::NumberingWriter& oNumberingWriters;
	Writers::FontTableWriter& m_oFontTableWriter;
	CSimpleArray<docNum*> m_aDocNums;
	CSimpleArray<docANum*> m_aDocANums;
	CAtlMap<int, int> m_mapANumToNum;
public:
	Binary_NumberingTableReader(Streams::CBufferedStream& poBufferedStream, Writers::FileWriter& oFileWriter):Binary_CommonReader(poBufferedStream),oNumberingWriters(oFileWriter.m_oNumberingWriter),m_oFontTableWriter(oFileWriter.m_oFontTableWriter),oBinary_pPrReader(poBufferedStream, oFileWriter),oBinary_rPrReader(poBufferedStream)
	{
	}
	int Read()
	{
		int res = ReadTable(&Binary_NumberingTableReader::ReadNumberingContent, this);
		for(int i = 0, length = m_aDocANums.GetSize(); i < length; ++i)
		{
			docANum* pdocANum = m_aDocANums[i];
			pdocANum->Write(oNumberingWriters.m_oANum);
			delete m_aDocANums[i];
		}
		m_aDocANums.RemoveAll();
		for(int i = 0, length = m_aDocNums.GetSize(); i < length; ++i)
		{
			m_aDocNums[i]->Write(oNumberingWriters.m_oNumList);
			delete m_aDocNums[i];
		}
		m_aDocNums.RemoveAll();
		return res;
	};
	int ReadNumberingContent(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSerNumTypes::AbstractNums == type )
		{
			res = Read1(length, &Binary_NumberingTableReader::ReadAbstractNums, this, poResult);
		}
		else if ( c_oSerNumTypes::Nums == type )
		{
			res = Read1(length, &Binary_NumberingTableReader::ReadNums, this, poResult);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	};
	int ReadNums(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSerNumTypes::Num == type )
		{
			docNum* pdocNum = new docNum();
			res = Read2(length, &Binary_NumberingTableReader::ReadNum, this, pdocNum);
			if(pdocNum->bAId && pdocNum->bId)
				m_mapANumToNum.SetAt(pdocNum->AId, pdocNum->Id);
			m_aDocNums.Add(pdocNum);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadNum(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		docNum* odocNum = static_cast<docNum*>(poResult);
		if ( c_oSerNumTypes::Num_ANumId == type )
		{
			odocNum->bAId = true;
			odocNum->AId = m_oBufferedStream.ReadLong();
		}
		else if ( c_oSerNumTypes::Num_NumId == type )
		{
			odocNum->bId = true;
			odocNum->Id = m_oBufferedStream.ReadLong();
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadAbstractNums(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSerNumTypes::AbstractNum == type )
		{
			docANum* pdocANum = new docANum();
			res = Read1(length, &Binary_NumberingTableReader::ReadAbstractNum, this, pdocANum);
			m_aDocANums.Add(pdocANum);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadAbstractNum(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		docANum* odocANum = static_cast<docANum*>(poResult);
		if ( c_oSerNumTypes::AbstractNum_Lvls == type )
		{
			res = Read1(length, &Binary_NumberingTableReader::ReadLevels, this, poResult);
		}
		else if ( c_oSerNumTypes::AbstractNum_Id == type )
		{
			odocANum->bId = true;
			odocANum->Id = m_oBufferedStream.ReadLong();
		}
		else if ( c_oSerNumTypes::NumStyleLink == type )
			odocANum->NumStyleLink = m_oBufferedStream.ReadString2(length);
		else if ( c_oSerNumTypes::StyleLink == type )
			odocANum->StyleLink = m_oBufferedStream.ReadString2(length);
		
		
		
		
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadLevels(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		docANum* odocANum = static_cast<docANum*>(poResult);
		if ( c_oSerNumTypes::Lvl == type )
		{
			docLvl* odocLvl = new docLvl();
			res = Read2(length, &Binary_NumberingTableReader::ReadLevel, this, odocLvl);
			odocANum->Lvls.Add(odocLvl);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadLevel(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		docLvl* odocLvl = static_cast<docLvl*>(poResult);
		if ( c_oSerNumTypes::lvl_Format == type )
		{
			odocLvl->bFormat = true;
			odocLvl->Format = m_oBufferedStream.ReadLong();
		}
		else if ( c_oSerNumTypes::lvl_Jc == type )
		{
			odocLvl->bJc = true;
			odocLvl->Jc = m_oBufferedStream.ReadByte();
		}
		else if ( c_oSerNumTypes::lvl_LvlText == type )
		{
			odocLvl->bText = true;
			res = Read1(length, &Binary_NumberingTableReader::ReadLevelText, this, poResult);
		}
		else if ( c_oSerNumTypes::lvl_Restart == type )
		{
			odocLvl->bRestart = true;
			odocLvl->Restart = m_oBufferedStream.ReadLong();
		}
		else if ( c_oSerNumTypes::lvl_Start == type )
		{
			odocLvl->bStart = true;
			odocLvl->Start = m_oBufferedStream.ReadLong();
		}
		else if ( c_oSerNumTypes::lvl_Suff == type )
		{
			odocLvl->bSuff = true;
			odocLvl->Suff = m_oBufferedStream.ReadByte();
		}
		else if ( c_oSerNumTypes::lvl_PStyle == type )
		{
			odocLvl->bPStyle = true;
			odocLvl->PStyle = m_oBufferedStream.ReadString2(length);
		}
		else if ( c_oSerNumTypes::lvl_ParaPr == type )
		{
			odocLvl->bParaPr = true;
			odocLvl->ParaPr.WriteString(CString(_T("<w:pPr>")));
			res = oBinary_pPrReader.Read(length, &odocLvl->ParaPr);
			odocLvl->ParaPr.WriteString(CString(_T("</w:pPr>")));
		}
		else if ( c_oSerNumTypes::lvl_TextPr == type )
		{
			odocLvl->bTextPr = true;
			rPr orPr(m_oFontTableWriter.m_mapFonts);
			res = oBinary_rPrReader.Read(length, &orPr);
			if(orPr.IsNoEmpty())
				orPr.Write(&odocLvl->TextPr);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadLevelText(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		docLvl* odocLvl = static_cast<docLvl*>(poResult);
		if ( c_oSerNumTypes::lvl_LvlTextItem == type )
		{
			docLvlText* odocLvlText = new docLvlText();
			res = Read1(length, &Binary_NumberingTableReader::ReadLevelTextItem, this, odocLvlText);
			odocLvl->Text.Add(odocLvlText);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadLevelTextItem(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		docLvlText* odocLvlText = static_cast<docLvlText*>(poResult);
		if ( c_oSerNumTypes::lvl_LvlTextItemText == type )
		{
			CString sText((wchar_t*)m_oBufferedStream.ReadPointer(length), length / 2);
			odocLvlText->bText = true;
			odocLvlText->Text = sText;
		}
		else if ( c_oSerNumTypes::lvl_LvlTextItemNum == type )
		{
			odocLvlText->bNumber = true;
			odocLvlText->Number = m_oBufferedStream.ReadByte();
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
};
class BinaryStyleTableReader : public Binary_CommonReader<BinaryStyleTableReader>
{
	Binary_pPrReader oBinary_pPrReader;
	Binary_rPrReader oBinary_rPrReader;
	Binary_tblPrReader oBinary_tblPrReader;
	Writers::StylesWriter& m_oStylesWriter;
	Writers::FontTableWriter& m_oFontTableWriter;
public:
	BinaryStyleTableReader(Streams::CBufferedStream& poBufferedStream, Writers::FileWriter& oFileWriter):Binary_CommonReader(poBufferedStream),m_oStylesWriter(oFileWriter.m_oStylesWriter),m_oFontTableWriter(oFileWriter.m_oFontTableWriter),oBinary_pPrReader(poBufferedStream, oFileWriter),oBinary_rPrReader(poBufferedStream),oBinary_tblPrReader(poBufferedStream, oFileWriter)
	{
	}
	int Read()
	{
		return ReadTable(&BinaryStyleTableReader::ReadStyleTableContent, this);
	};
	int ReadStyleTableContent(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if(c_oSer_st::Styles == type)
		{
			res = Read1(length, &BinaryStyleTableReader::ReadStyle, this, poResult);
		}
		else if(c_oSer_st::DefpPr == type)
		{
			m_oStylesWriter.m_pPrDefault.WriteString(CString(_T("<w:pPr>")));
			bool bOldVal = oBinary_pPrReader.bDoNotWriteNullProp;
			oBinary_pPrReader.bDoNotWriteNullProp = true;
			res = oBinary_pPrReader.Read(length, &m_oStylesWriter.m_pPrDefault);
			oBinary_pPrReader.bDoNotWriteNullProp = bOldVal;
			m_oStylesWriter.m_pPrDefault.WriteString(CString(_T("</w:pPr>")));
		}
		else if(c_oSer_st::DefrPr == type)
		{
			rPr oNew_rPr(m_oFontTableWriter.m_mapFonts);
			oNew_rPr.bDoNotWriteNullProp = true;
			res = oBinary_rPrReader.Read(length, &oNew_rPr);
			if(oNew_rPr.IsNoEmpty())
				oNew_rPr.Write(&m_oStylesWriter.m_rPrDefault);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	};
	int ReadStyle(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if(c_oSer_sts::Style == type)
		{
			docStyle odocStyle;
			res = Read1(length, &BinaryStyleTableReader::ReadStyleContent, this, &odocStyle);
			if(m_oStylesWriter.m_nVersion < 2)
			{
				odocStyle.bqFormat = true;
				odocStyle.qFormat = true;
			}
			odocStyle.Write(&m_oStylesWriter.m_Styles);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	};
	int ReadStyleContent(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		docStyle* odocStyle = static_cast<docStyle*>(poResult);
		if(c_oSer_sts::Style_Name == type)
		{
			CString Name((wchar_t*)m_oBufferedStream.ReadPointer(length), length / 2);
			CorrectString(Name);
			odocStyle->Name = Name;
		}
		else if(c_oSer_sts::Style_Id == type)
		{
			CString Id((wchar_t*)m_oBufferedStream.ReadPointer(length), length / 2);
			CorrectString(Id);
			odocStyle->Id = Id;
		}
		else if(c_oSer_sts::Style_Type == type)
		{
			odocStyle->byteType = m_oBufferedStream.ReadByte();
		}
		else if(c_oSer_sts::Style_Default == type)
		{
			odocStyle->bDefault = (0 != m_oBufferedStream.ReadByte());
		}
		else if(c_oSer_sts::Style_BasedOn == type)
		{
			CString BasedOn((wchar_t*)m_oBufferedStream.ReadPointer(length), length / 2);
			CorrectString(BasedOn);
			odocStyle->BasedOn = BasedOn;
		}
		else if(c_oSer_sts::Style_Next == type)
		{
			CString NextId((wchar_t*)m_oBufferedStream.ReadPointer(length), length / 2);
			CorrectString(NextId);
			odocStyle->NextId = NextId;
		}
		else if(c_oSer_sts::Style_qFormat == type)
		{
			odocStyle->bqFormat = true;
			odocStyle->qFormat = (0 != m_oBufferedStream.ReadByte()) ? true : false;
		}
		else if(c_oSer_sts::Style_uiPriority == type)
		{
			odocStyle->buiPriority = true;
			odocStyle->uiPriority = m_oBufferedStream.ReadLong();
		}
		else if(c_oSer_sts::Style_hidden == type)
		{
			odocStyle->bhidden = true;
			odocStyle->hidden = (0 != m_oBufferedStream.ReadByte()) ? true : false;
		}
		else if(c_oSer_sts::Style_semiHidden == type)
		{
			odocStyle->bsemiHidden = true;
			odocStyle->semiHidden = (0 != m_oBufferedStream.ReadByte()) ? true : false;
		}
		else if(c_oSer_sts::Style_unhideWhenUsed == type)
		{
			odocStyle->bunhideWhenUsed = true;
			odocStyle->unhideWhenUsed = (0 != m_oBufferedStream.ReadByte()) ? true : false;
		}
		else if(c_oSer_sts::Style_TextPr == type)
		{
			rPr oNew_rPr(m_oFontTableWriter.m_mapFonts);
			res = oBinary_rPrReader.Read(length, &oNew_rPr);
			if(oNew_rPr.IsNoEmpty())
			{
				CStringWriter oTempWriter;
				oNew_rPr.Write(&oTempWriter);
				odocStyle->TextPr = oTempWriter.GetData();
			}
		}
		else if(c_oSer_sts::Style_ParaPr == type)
		{
			CStringWriter oTempWriter;
			oBinary_pPrReader.m_nCurNumId = -1;
			oBinary_pPrReader.m_nCurLvl = -1;
			res = oBinary_pPrReader.Read(length, &oTempWriter);
			odocStyle->ParaPr = oTempWriter.GetData();
		}
		else if(c_oSer_sts::Style_TablePr == type)
		{
			CWiterTblPr oWiterTblPr;
			oBinary_tblPrReader.Read_tblPrOut(length, &oWiterTblPr);
			odocStyle->TablePr = oWiterTblPr.Write(true, false);
		}
		else if(c_oSer_sts::Style_RowPr == type)
		{
			CStringWriter oTempWriter;
			oBinary_tblPrReader.Read_RowPrOut(length, &oTempWriter);
			CString sRowPr = oTempWriter.GetData();
			odocStyle->RowPr = sRowPr;
		}
		else if(c_oSer_sts::Style_CellPr == type)
		{
			CStringWriter oTempWriter;
			oBinary_tblPrReader.Read_CellPrOut(length, &oTempWriter);
			CString sCellPr = oTempWriter.GetData();
			odocStyle->CellPr = sCellPr;
		}
		else if(c_oSer_sts::Style_TblStylePr == type)
		{
			res = Read1(length, &BinaryStyleTableReader::ReadTblStylePr, this, odocStyle);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	};
	int ReadTblStylePr(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		docStyle* odocStyle = static_cast<docStyle*>(poResult);
		if(c_oSerProp_tblStylePrType::TblStylePr == type)
		{
			tblStylePr otblStylePr;
			Read1(length, &BinaryStyleTableReader::ReadTblStyleProperty, this, &otblStylePr);
			if(otblStylePr.bType && otblStylePr.Writer.GetCurSize() > 0)
			{
				CStringWriter oCStringWriter;
				switch(otblStylePr.Type)
				{
				case ETblStyleOverrideType::tblstyleoverridetypeBand1Horz: oCStringWriter.WriteString(CString(_T("<w:tblStylePr w:type=\"band1Horz\">")));break;
				case ETblStyleOverrideType::tblstyleoverridetypeBand1Vert: oCStringWriter.WriteString(CString(_T("<w:tblStylePr w:type=\"band1Vert\">")));break;
				case ETblStyleOverrideType::tblstyleoverridetypeBand2Horz: oCStringWriter.WriteString(CString(_T("<w:tblStylePr w:type=\"band2Horz\">")));break;
				case ETblStyleOverrideType::tblstyleoverridetypeBand2Vert: oCStringWriter.WriteString(CString(_T("<w:tblStylePr w:type=\"band2Vert\">")));break;
				case ETblStyleOverrideType::tblstyleoverridetypeFirstCol: oCStringWriter.WriteString(CString(_T("<w:tblStylePr w:type=\"firstCol\">")));break;
				case ETblStyleOverrideType::tblstyleoverridetypeFirstRow: oCStringWriter.WriteString(CString(_T("<w:tblStylePr w:type=\"firstRow\">")));break;
				case ETblStyleOverrideType::tblstyleoverridetypeLastCol: oCStringWriter.WriteString(CString(_T("<w:tblStylePr w:type=\"lastCol\">")));break;
				case ETblStyleOverrideType::tblstyleoverridetypeLastRow: oCStringWriter.WriteString(CString(_T("<w:tblStylePr w:type=\"lastRow\">")));break;
				case ETblStyleOverrideType::tblstyleoverridetypeNeCell: oCStringWriter.WriteString(CString(_T("<w:tblStylePr w:type=\"neCell\">")));break;
				case ETblStyleOverrideType::tblstyleoverridetypeNwCell: oCStringWriter.WriteString(CString(_T("<w:tblStylePr w:type=\"nwCell\">")));break;
				case ETblStyleOverrideType::tblstyleoverridetypeSeCell: oCStringWriter.WriteString(CString(_T("<w:tblStylePr w:type=\"seCell\">")));break;
				case ETblStyleOverrideType::tblstyleoverridetypeSwCell: oCStringWriter.WriteString(CString(_T("<w:tblStylePr w:type=\"swCell\">")));break;
				case ETblStyleOverrideType::tblstyleoverridetypeWholeTable: oCStringWriter.WriteString(CString(_T("<w:tblStylePr w:type=\"wholeTable\">")));break;
				}
				oCStringWriter.Write(otblStylePr.Writer);
				oCStringWriter.WriteString(CString(_T("</w:tblStylePr>")));
				odocStyle->TblStylePr.Add(oCStringWriter.GetData());
			}
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadTblStyleProperty(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		tblStylePr* ptblStylePr = static_cast<tblStylePr*>(poResult);
		if(c_oSerProp_tblStylePrType::Type == type)
		{
			ptblStylePr->bType = true;
			ptblStylePr->Type = m_oBufferedStream.ReadByte();

		}
		else if(c_oSerProp_tblStylePrType::RunPr == type)
		{
			rPr oNew_rPr(m_oFontTableWriter.m_mapFonts);
			res = oBinary_rPrReader.Read(length, &oNew_rPr);
			if(oNew_rPr.IsNoEmpty())
			{
				oNew_rPr.Write(&ptblStylePr->Writer);
			}
		}
		else if(c_oSerProp_tblStylePrType::ParPr == type)
		{
			CStringWriter oTempWriter;
			res = oBinary_pPrReader.Read(length, &oTempWriter);
			if(oTempWriter.GetCurSize() > 0)
			{
				ptblStylePr->Writer.WriteString(CString(_T("<w:pPr>")));
				ptblStylePr->Writer.Write(oTempWriter);
				ptblStylePr->Writer.WriteString(CString(_T("</w:pPr>")));
			}
		}
		else if(c_oSerProp_tblStylePrType::TblPr == type)
		{
			CWiterTblPr oWiterTblPr;
			oBinary_tblPrReader.Read_tblPrOut(length, &oWiterTblPr);
			if(false == oWiterTblPr.IsEmpty())
				ptblStylePr->Writer.WriteString(oWiterTblPr.Write(false, false));
		}
		else if(c_oSerProp_tblStylePrType::TrPr == type)
		{
			CStringWriter oTempWriter;
			oBinary_tblPrReader.Read_RowPrOut(length, &oTempWriter);
			if(oTempWriter.GetCurSize() > 0)
			{
				ptblStylePr->Writer.WriteString(CString(_T("<w:trPr>")));
				ptblStylePr->Writer.Write(oTempWriter);
				ptblStylePr->Writer.WriteString(CString(_T("</w:trPr>")));
			}
		}
		else if(c_oSerProp_tblStylePrType::TcPr == type)
		{
			CStringWriter oTempWriter;
			oBinary_tblPrReader.Read_CellPrOut(length, &oTempWriter);
			if(oTempWriter.GetCurSize() > 0)
			{
				ptblStylePr->Writer.WriteString(CString(_T("<w:tcPr>")));
				ptblStylePr->Writer.Write(oTempWriter);
				ptblStylePr->Writer.WriteString(CString(_T("</w:tcPr>")));
			}
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}	
};
class Binary_OtherTableReader : public Binary_CommonReader<Binary_OtherTableReader>
{
	Writers::FileWriter& m_oFileWriter;
	CString m_sFileInDir;
public:
	Binary_OtherTableReader(CString sFileInDir, Streams::CBufferedStream& poBufferedStream, Writers::FileWriter& oFileWriter):m_sFileInDir(sFileInDir),Binary_CommonReader(poBufferedStream),m_oFileWriter(oFileWriter)
	{
	}
	int Read()
	{
		return ReadTable(&Binary_OtherTableReader::ReadOtherContent, this);
	};
	int ReadOtherContent(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSerOtherTableTypes::ImageMap == type )
		{
			res = Read1(length, &Binary_OtherTableReader::ReadImageMapContent, this, NULL);
		}
		else if(c_oSerOtherTableTypes::DocxTheme == type)
		{
			
			BSTR bstrThemePath = m_oFileWriter.m_sThemePath.AllocSysString();
			m_oFileWriter.m_pDrawingConverter->SaveThemeXml(m_oFileWriter.m_pArray, m_oBufferedStream.GetPosition(), length, bstrThemePath);
			SysFreeString(bstrThemePath);
			res = c_oSerConstants::ReadUnknown;
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	};
	int ReadImageMapContent(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSerOtherTableTypes::ImageMap_Src == type )
		{
			CString sImage((wchar_t*)m_oBufferedStream.ReadPointer(length), length / 2);
			CString sFilePath;
			bool bDeleteFile = false;
			if(0 == sImage.Find(_T("data:")))
			{
				char sTempPath[MAX_PATH], sTempFile[MAX_PATH];
				if ( 0 == GetTempPathA( MAX_PATH, sTempPath ) )
					return S_FALSE;

				if ( 0 == GetTempFileNameA( sTempPath, "CSS", 0, sTempFile ) )
					return S_FALSE;
				sFilePath = CString(sTempFile);
				convertBase64ToImage(sFilePath, sImage);
				bDeleteFile = true;
			}
			else if(0 == sImage.Find(_T("http:")) || 0 == sImage.Find(_T("https:")) || 0 == sImage.Find(_T("ftp:")) || 0 == sImage.Find(_T("www")))
			{
				
				sFilePath = DownloadImage(sImage);
				bDeleteFile = true;
			}
			else
			{
				
				sFilePath = m_sFileInDir + _T("media\\") + sImage;
			}

			
			DWORD dwFileAttr = ::GetFileAttributes( sFilePath );
			if( dwFileAttr != INVALID_FILE_ATTRIBUTES && 0 == (dwFileAttr & FILE_ATTRIBUTE_DIRECTORY ) )
			{
				m_oFileWriter.m_oMediaWriter.AddImage(sFilePath);
				if(bDeleteFile)
					DeleteFile(sFilePath);
			}
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	};
};
class Binary_CommentsTableReader : public Binary_CommonReader<Binary_CommentsTableReader>
{
public:
	CComments m_oComments;
public:
	Binary_CommentsTableReader(Streams::CBufferedStream& poBufferedStream, Writers::FileWriter& oFileWriter):Binary_CommonReader(poBufferedStream)
	{
	}
	int Read()
	{
		return ReadTable(&Binary_CommentsTableReader::ReadComments, this);
	};
	int ReadComments(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_CommentsType::Comment == type )
		{
			CComment* pComment = new CComment(m_oComments.m_oParaIdCounter, m_oComments.m_oFormatIdCounter);
			res = Read1(length, &Binary_CommentsTableReader::ReadCommentContent, this, pComment);
			if(pComment->bIdOpen && NULL == m_oComments.get(pComment->IdOpen))
				m_oComments.add(pComment);
			else
				RELEASEOBJECT(pComment);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	};
	int ReadCommentContent(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		CComment* pComment = static_cast<CComment*>(poResult);
		if ( c_oSer_CommentsType::Id == type )
		{
			pComment->bIdOpen = true;
			pComment->IdOpen = m_oBufferedStream.ReadLong();
		}
		else if ( c_oSer_CommentsType::UserName == type )
		{
			CString UserName((wchar_t*)m_oBufferedStream.ReadPointer(length), length / 2);
			pComment->UserName = UserName;
		}
		else if ( c_oSer_CommentsType::UserId == type )
		{
			CString UserId((wchar_t*)m_oBufferedStream.ReadPointer(length), length / 2);
			pComment->UserId = UserId;
		}
		else if ( c_oSer_CommentsType::Date == type )
		{
			CString Date((wchar_t*)m_oBufferedStream.ReadPointer(length), length / 2);
			pComment->Date = Date;
		}
		else if ( c_oSer_CommentsType::Text == type )
		{
			CString Text((wchar_t*)m_oBufferedStream.ReadPointer(length), length / 2);
			pComment->Text = Text;
		}
		else if ( c_oSer_CommentsType::Solved == type )
		{
			pComment->bSolved = true;
			pComment->Solved = m_oBufferedStream.ReadBool();
		}
		else if ( c_oSer_CommentsType::Replies == type )
			res = Read1(length, &Binary_CommentsTableReader::ReadReplies, this, &pComment->replies);
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	};
	int ReadReplies(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		CAtlArray<CComment*>* paComments = static_cast<CAtlArray<CComment*>*>(poResult);
		if ( c_oSer_CommentsType::Comment == type )
		{
			CComment* pNewComment = new CComment(m_oComments.m_oParaIdCounter, m_oComments.m_oFormatIdCounter);
			res = Read1(length, &Binary_CommentsTableReader::ReadCommentContent, this, pNewComment);
			paComments->Add(pNewComment);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	};
};
class Binary_SettingsTableReader : public Binary_CommonReader<Binary_SettingsTableReader>
{
	Writers::SettingWriter& m_oSettingWriter;
	Writers::FileWriter& m_oFileWriter;
public:
	Binary_SettingsTableReader(Streams::CBufferedStream& poBufferedStream, Writers::FileWriter& oFileWriter):Binary_CommonReader(poBufferedStream),m_oSettingWriter(oFileWriter.m_oSettingWriter),m_oFileWriter(oFileWriter)
	{
	}
	int Read()
	{
		return ReadTable(&Binary_SettingsTableReader::ReadSettings, this);
	};
	int ReadSettings(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_SettingsType::ClrSchemeMapping == type )
		{
			int aSchemeMapping[] = { 0, 1, 2, 3, 4, 5, 10, 11, 8, 9, 6, 7 };
			res = Read2(length, &Binary_SettingsTableReader::ReadClrSchemeMapping, this, aSchemeMapping);
			CString sSchemeMapping = _T("<w:clrSchemeMapping");
			for(int i = 0; i < 12; ++i)
			{
				switch(i)
				{
				case 0: sSchemeMapping.Append(_T(" w:accent1"));break;
				case 1: sSchemeMapping.Append(_T(" w:accent2"));break;
				case 2: sSchemeMapping.Append(_T(" w:accent3"));break;
				case 3: sSchemeMapping.Append(_T(" w:accent4"));break;
				case 4: sSchemeMapping.Append(_T(" w:accent5"));break;
				case 5: sSchemeMapping.Append(_T(" w:accent6"));break;
				case 6: sSchemeMapping.Append(_T(" w:bg1"));break;
				case 7: sSchemeMapping.Append(_T(" w:bg2"));break;
				case 8: sSchemeMapping.Append(_T(" w:followedHyperlink"));break;
				case 9: sSchemeMapping.Append(_T(" w:hyperlink"));break;
				case 10: sSchemeMapping.Append(_T(" w:t1"));break;
				case 11: sSchemeMapping.Append(_T(" w:t2"));break;
				}
				switch(aSchemeMapping[i])
				{
				case 0: sSchemeMapping.Append(_T("=\"accent1\""));break;
				case 1: sSchemeMapping.Append(_T("=\"accent2\""));break;
				case 2: sSchemeMapping.Append(_T("=\"accent3\""));break;
				case 3: sSchemeMapping.Append(_T("=\"accent4\""));break;
				case 4: sSchemeMapping.Append(_T("=\"accent5\""));break;
				case 5: sSchemeMapping.Append(_T("=\"accent6\""));break;
				case 6: sSchemeMapping.Append(_T("=\"dark1\""));break;
				case 7: sSchemeMapping.Append(_T("=\"dark2\""));break;
				case 8: sSchemeMapping.Append(_T("=\"followedHyperlink\""));break;
				case 9: sSchemeMapping.Append(_T("=\"hyperlink\""));break;
				case 10: sSchemeMapping.Append(_T("=\"light1\""));break;
				case 11: sSchemeMapping.Append(_T("=\"light2\""));break;
				}
			}
			sSchemeMapping.Append(_T("/>"));
			m_oSettingWriter.AddSetting(sSchemeMapping);
			BSTR bstrClrMap = sSchemeMapping.AllocSysString();
			m_oFileWriter.m_pDrawingConverter->LoadClrMap(bstrClrMap);
			SysFreeString(bstrClrMap);
		}
		else if ( c_oSer_SettingsType::DefaultTabStop == type )
		{
			double dDefTabStop = m_oBufferedStream.ReadDouble2();
			long nDefTabStop = Round(dDefTabStop * g_dKoef_mm_to_twips);
			CString sXml;
			sXml.Format(_T("<w:defaultTabStop w:val=\"%d\"/>"), nDefTabStop);
			m_oFileWriter.m_oSettingWriter.AddSetting(sXml);
		}
		else if ( c_oSer_SettingsType::MathPr == type )
		{	
			m_oFileWriter.m_oSettingWriter.AddSetting(_T("<m:mathPr>"));
			res = Read1(length, &Binary_SettingsTableReader::ReadMathPr, this, poResult);
			m_oFileWriter.m_oSettingWriter.AddSetting(_T("</m:mathPr>"));
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	};	
	int ReadMathPr(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_MathPrType::BrkBin == type )
		{
			res = Read2(length, &Binary_SettingsTableReader::ReadMathBrkBin, this, poResult);
		}
		else if ( c_oSer_MathPrType::BrkBinSub == type )
		{
			res = Read2(length, &Binary_SettingsTableReader::ReadMathBrkBinSub, this, poResult);
		}
		else if ( c_oSer_MathPrType::DefJc == type )
		{
			res = Read2(length, &Binary_SettingsTableReader::ReadMathDefJc, this, poResult);
		}
		else if ( c_oSer_MathPrType::DispDef == type )
		{
			res = Read2(length, &Binary_SettingsTableReader::ReadMathDispDef, this, poResult);
		}
		else if ( c_oSer_MathPrType::InterSp == type )
		{
			res = Read2(length, &Binary_SettingsTableReader::ReadMathInterSp, this, poResult);
		}
		else if ( c_oSer_MathPrType::IntLim == type )
		{
			res = Read2(length, &Binary_SettingsTableReader::ReadMathIntLim, this, poResult);
		}
		else if ( c_oSer_MathPrType::IntraSp == type )
		{
			res = Read2(length, &Binary_SettingsTableReader::ReadMathIntraSp, this, poResult);
		}
		else if ( c_oSer_MathPrType::LMargin == type )
		{
			res = Read2(length, &Binary_SettingsTableReader::ReadMathLMargin, this, poResult);
		}
		else if ( c_oSer_MathPrType::MathFont == type )
		{
			res = Read2(length, &Binary_SettingsTableReader::ReadMathMathFont, this, poResult);
		}
		else if ( c_oSer_MathPrType::NaryLim == type )
		{
			res = Read2(length, &Binary_SettingsTableReader::ReadMathNaryLim, this, poResult);
		}
		else if ( c_oSer_MathPrType::PostSp == type )
		{
			res = Read2(length, &Binary_SettingsTableReader::ReadMathPostSp, this, poResult);
		}
		else if ( c_oSer_MathPrType::PreSp == type )
		{
			res = Read2(length, &Binary_SettingsTableReader::ReadMathPreSp, this, poResult);
		}
		else if ( c_oSer_MathPrType::RMargin == type )
		{
			res = Read2(length, &Binary_SettingsTableReader::ReadMathRMargin, this, poResult);
		}
		else if ( c_oSer_MathPrType::SmallFrac == type )
		{
			res = Read2(length, &Binary_SettingsTableReader::ReadMathSmallFrac, this, poResult);
		}
		else if ( c_oSer_MathPrType::WrapIndent == type )
		{
			res = Read2(length, &Binary_SettingsTableReader::ReadMathWrapIndent, this, poResult);
		}
		else if ( c_oSer_MathPrType::WrapRight == type )
		{
			res = Read2(length, &Binary_SettingsTableReader::ReadMathWrapRight, this, poResult);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}	
	int ReadMathBrkBin(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesValType::Val == type )
		{
			BYTE BrkBin;
			CString sBrkBin (_T("repeat"));
			BrkBin = m_oBufferedStream.ReadByte();			
			switch(BrkBin)
			{
				case 0: sBrkBin = _T("after");break;
				case 1: sBrkBin = _T("before");break;
				case 2: sBrkBin = _T("repeat");break;
			}			

			CString sVal; sVal.Format(_T("<m:brkBin m:val=\"%s\" />"), sBrkBin);
			m_oFileWriter.m_oSettingWriter.AddSetting(sVal);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}	
	int ReadMathBrkBinSub(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesValType::Val == type )
		{
			BYTE BrkBinSub;
			CString sBrkBinSub (_T("--"));
			BrkBinSub = m_oBufferedStream.ReadByte();			
			switch(BrkBinSub)
			{
				case 0: sBrkBinSub = _T("+-");break;
				case 1: sBrkBinSub = _T("-+");break;
				case 2: sBrkBinSub = _T("--");break;
			}			
			CString sVal; sVal.Format(_T("<m:brkBinSub m:val=\"%s\" />"), sBrkBinSub);
			m_oFileWriter.m_oSettingWriter.AddSetting(sVal);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathDefJc(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesValType::Val == type )
		{
			BYTE DefJc;
			CString sDefJc (_T("centerGroup"));
			DefJc = m_oBufferedStream.ReadByte();			
			switch(DefJc)
			{
				case 0: sDefJc = _T("center");break;
				case 1: sDefJc = _T("centerGroup");break;
				case 2: sDefJc = _T("left");break;
				case 3: sDefJc = _T("right");break;
			}			
			CString sVal; sVal.Format(_T("<m:defJc m:val=\"%s\" />"), sDefJc);
			m_oFileWriter.m_oSettingWriter.AddSetting(sVal);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathDispDef(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesValType::Val == type )
		{
			bool bVal = m_oBufferedStream.ReadBool();
			CString sVal = _T("<m:dispDef");
			if (bVal)
				sVal += _T(" m:val=\"true\" />");
			else
				sVal += _T(" />");
			m_oFileWriter.m_oSettingWriter.AddSetting(sVal);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}	
	int ReadMathInterSp(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesValType::Val == type )
		{
			LONG lVal =  Mm_To_Dx(m_oBufferedStream.ReadDouble2());
			CString sXml;
			sXml.Format(_T("<m:interSp m:val=\"%d\"/>"), lVal);
			m_oFileWriter.m_oSettingWriter.AddSetting(sXml);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathIntLim(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesValType::Val == type )
		{
			BYTE IntLim;
			CString sIntLim (_T("subSup"));
			IntLim = m_oBufferedStream.ReadByte();			
			switch(IntLim)
			{
				case 0: sIntLim = _T("subSup");break;
				case 1: sIntLim = _T("undOvr");break;
			}			
			CString sVal; sVal.Format(_T("<m:intLim m:val=\"%s\" />"), sIntLim);
			m_oFileWriter.m_oSettingWriter.AddSetting(sVal);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathIntraSp(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesValType::Val == type )
		{
			LONG lVal =  Mm_To_Dx(m_oBufferedStream.ReadDouble2());
			CString sXml;
			sXml.Format(_T("<m:intraSp m:val=\"%d\"/>"), lVal);
			m_oFileWriter.m_oSettingWriter.AddSetting(sXml);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathLMargin(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesValType::Val == type )
		{
			LONG lVal =  Mm_To_Dx(m_oBufferedStream.ReadDouble2());
			CString sXml;
			sXml.Format(_T("<m:lMargin m:val=\"%d\"/>"), lVal);
			m_oFileWriter.m_oSettingWriter.AddSetting(sXml);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}	
	int ReadMathMathFont(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesValType::Val == type )
		{
				CString sFontName((wchar_t*)m_oBufferedStream.ReadPointer(length), length / 2);
				CorrectString(sFontName);

				CString sVal; sVal.Format(_T("<m:font m:val=\"%s\" />"), sFontName);
				m_oFileWriter.m_oSettingWriter.AddSetting(sVal);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	
	int ReadMathNaryLim(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesValType::Val == type )
		{
			BYTE NaryLim;
			CString sNaryLim (_T("subSup"));
			NaryLim = m_oBufferedStream.ReadByte();			
			switch(NaryLim)
			{
				case 0: sNaryLim = _T("subSup");break;
				case 1: sNaryLim = _T("undOvr");break;
			}			
			CString sVal; sVal.Format(_T("<m:naryLim m:val=\"%s\" />"), sNaryLim);
			m_oFileWriter.m_oSettingWriter.AddSetting(sVal);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}		
	int ReadMathPostSp(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesValType::Val == type )
		{
			LONG lVal =  Mm_To_Dx(m_oBufferedStream.ReadDouble2());
			CString sXml;
			sXml.Format(_T("<m:postSp m:val=\"%d\"/>"), lVal);
			m_oFileWriter.m_oSettingWriter.AddSetting(sXml);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}	
	int ReadMathPreSp(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesValType::Val == type )
		{
			LONG lVal =  Mm_To_Dx(m_oBufferedStream.ReadDouble2());
			CString sXml;
			sXml.Format(_T("<m:preSp m:val=\"%d\"/>"), lVal);
			m_oFileWriter.m_oSettingWriter.AddSetting(sXml);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}	
	int ReadMathRMargin(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesValType::Val == type )
		{
			LONG lVal =  Mm_To_Dx(m_oBufferedStream.ReadDouble2());
			CString sXml;
			sXml.Format(_T("<m:rMargin m:val=\"%d\"/>"), lVal);
			m_oFileWriter.m_oSettingWriter.AddSetting(sXml);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}	
	int ReadMathSmallFrac(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesValType::Val == type )
		{
			bool bVal = m_oBufferedStream.ReadBool();
			CString sVal = _T("<m:smallFrac m:val=");
			if (bVal)
				sVal += _T("\"true\" />");
			else
				sVal += _T("\"false\" />");
			m_oFileWriter.m_oSettingWriter.AddSetting(sVal);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}	
	int ReadMathWrapIndent(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesValType::Val == type )
		{
			LONG lVal =  Mm_To_Dx(m_oBufferedStream.ReadDouble2());
			CString sXml;
			sXml.Format(_T("<m:wrapIndent m:val=\"%d\"/>"), lVal);
			m_oFileWriter.m_oSettingWriter.AddSetting(sXml);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}	
	int ReadMathWrapRight(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesValType::Val == type )
		{
			bool bVal = m_oBufferedStream.ReadBool();
			CString sVal = _T("<m:wrapRight m:val=");
			if (bVal)
				sVal += _T("\"true\" />");
			else
				sVal += _T("\"false\" />");
			m_oFileWriter.m_oSettingWriter.AddSetting(sVal);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadClrSchemeMapping(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		int *paSchemeMapping = static_cast<int*>(poResult);
		if ( c_oSer_ClrSchemeMappingType::Accent1 <= type && type <= c_oSer_ClrSchemeMappingType::T2)
		{
			paSchemeMapping[type] = m_oBufferedStream.ReadByte();
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	};
};
class Binary_DocumentTableReader : public Binary_CommonReader<Binary_DocumentTableReader>
{
	Writers::FileWriter& m_oFileWriter;
	Writers::FontTableWriter& m_oFontTableWriter;
	Binary_pPrReader oBinary_pPrReader;
	Binary_rPrReader oBinary_rPrReader;
	Binary_tblPrReader oBinary_tblPrReader;
	WriteHyperlink* m_pCurHyperlink;
	rPr m_oCur_rPr;
	rPr m_oMath_rPr;
	CStringWriter m_oCur_pPr;
	bool bFirstRun;
	BYTE m_byteLastElemType;
	CComments* m_pComments;
public:
	Writers::ContentWriter& m_oDocumentWriter;
	Writers::MediaWriter& m_oMediaWriter;
public:
	Binary_DocumentTableReader(Streams::CBufferedStream& poBufferedStream, Writers::FileWriter& oFileWriter, Writers::ContentWriter& oDocumentWriter, CComments* pComments):Binary_CommonReader(poBufferedStream),m_oDocumentWriter(oDocumentWriter),m_oFileWriter(oFileWriter),m_oMediaWriter(oFileWriter.m_oMediaWriter),m_oFontTableWriter(oFileWriter.m_oFontTableWriter),oBinary_pPrReader(poBufferedStream, oFileWriter),oBinary_rPrReader(poBufferedStream), oBinary_tblPrReader(poBufferedStream, oFileWriter),m_oCur_rPr(m_oFontTableWriter.m_mapFonts),m_oMath_rPr(m_oFontTableWriter.m_mapFonts),m_pComments(pComments)
	{
		m_byteLastElemType = c_oSerParType::Content;
		m_pCurHyperlink = NULL;
	}
	~Binary_DocumentTableReader()
	{
		RELEASEOBJECT(m_pCurHyperlink);
	}
	int Read()
	{
		return ReadTable(&Binary_DocumentTableReader::ReadDocumentContent, this);
	};
	CStringWriter& GetRunStringWriter()
	{
		if(NULL != m_pCurHyperlink)
			return m_pCurHyperlink->writer;
		else
			return m_oDocumentWriter.m_oContent;
	}
	int ReadDocumentContent(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSerParType::Par == type )
		{
			m_byteLastElemType = c_oSerParType::Par;
			m_oCur_pPr.ClearNoAttack();
			bFirstRun = true;

			
			res = Read1(length, &Binary_DocumentTableReader::ReadParagraph, this, NULL);
			
			CommitFirstRun();
			m_oDocumentWriter.m_oContent.WriteString(CString(_T("</w:p>")));
		}
		else if(c_oSerParType::Table == type)
		{
			m_byteLastElemType = c_oSerParType::Table;
			
			oBinary_tblPrReader.m_sCurTableShd.Empty();
			m_oDocumentWriter.m_oContent.WriteString(CString(_T("<w:tbl>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadDocTable, this, &m_oDocumentWriter.m_oContent);
			m_oDocumentWriter.m_oContent.WriteString(CString(_T("</w:tbl>")));
			
			oBinary_tblPrReader.m_sCurTableShd.Empty();
		}
		else if ( c_oSerParType::sectPr == type )
		{
			SectPr oSectPr;
			res = Read1(length, &Binary_DocumentTableReader::Read_SecPr, this, &oSectPr);
			long nWidth = Round(oSectPr.W * g_dKoef_mm_to_twips);
			long nHeight = Round(oSectPr.H * g_dKoef_mm_to_twips);
			long nMLeft = Round(oSectPr.Left * g_dKoef_mm_to_twips);
			long nMTop = Round(oSectPr.Top * g_dKoef_mm_to_twips);
			long nMRight = Round(oSectPr.Right * g_dKoef_mm_to_twips);
			long nMBottom = Round(oSectPr.Bottom * g_dKoef_mm_to_twips);
			long nMHeader = Round(oSectPr.Header * g_dKoef_mm_to_twips);
			long nMFooter = Round(oSectPr.Footer * g_dKoef_mm_to_twips);

			CString pgSz;
			if(orientation_Portrait == oSectPr.cOrientation)
				pgSz.Format(_T("<w:pgSz w:w=\"%d\" w:h=\"%d\"/>"), nWidth, nHeight);
			else
				pgSz.Format(_T("<w:pgSz w:w=\"%d\" w:h=\"%d\" w:orient=\"landscape\"/>"), nWidth, nHeight);
			CString pgMar;pgMar.Format(_T("<w:pgMar w:top=\"%d\" w:right=\"%d\" w:bottom=\"%d\" w:left=\"%d\" w:gutter=\"0\""), nMTop, nMRight, nMBottom, nMLeft);
			if(oSectPr.bHeader)
			{
				CString sHeader;sHeader.Format(_T(" w:header=\"%d\""), nMHeader);
				pgMar+= sHeader;
			}
			if(oSectPr.bFooter)
			{
				CString sFooter;sFooter.Format(_T(" w:footer=\"%d\""), nMFooter);
				pgMar+= sFooter;
			}
			pgMar+= _T("/>");
			m_oDocumentWriter.m_oSecPr.WriteString(pgSz);
			m_oDocumentWriter.m_oSecPr.WriteString(pgMar);
			m_oDocumentWriter.m_oSecPr.WriteString(CString(_T("<w:cols w:space=\"708\"/><w:docGrid w:linePitch=\"360\"/>")));
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	};
	int ReadParagraph(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSerParType::pPr == type )
		{
			res = oBinary_pPrReader.Read(length, &m_oCur_pPr);
		}
		else if ( c_oSerParType::Content == type )
		{
			res = Read1(length, &Binary_DocumentTableReader::ReadParagraphContent, this, NULL);
			if(NULL != m_pCurHyperlink)
			{
				m_pCurHyperlink->Write(m_oDocumentWriter.m_oContent);
				RELEASEOBJECT(m_pCurHyperlink);
			}
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	};
	void CommitFirstRun()
	{
		if(true == bFirstRun)
		{
			bFirstRun = false;
			m_oDocumentWriter.m_oContent.WriteString(CString(_T("<w:p>")));
			if(m_oCur_pPr.GetCurSize() > 0)
			{
				m_oDocumentWriter.m_oContent.WriteString(CString(_T("<w:pPr>")));
				m_oDocumentWriter.m_oContent.Write(m_oCur_pPr);
				m_oDocumentWriter.m_oContent.WriteString(CString(_T("</w:pPr>")));
			}
		}
	}
	int ReadParagraphContent(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSerParType::Run == type )
		{
			m_oCur_rPr.Reset();
			res = Read1(length, &Binary_DocumentTableReader::ReadRun, this, NULL);
		}
		else if ( c_oSerParType::CommentStart == type )
		{
			long nId = 0;
			res = Read1(length, &Binary_DocumentTableReader::ReadComment, this, &nId);
			if(NULL != m_pComments)
			{
				CComment* pComment = m_pComments->get(nId);
				if(NULL != pComment)
				{
					CommitFirstRun();
					int nNewId = m_pComments->getNextId(pComment->getCount());
					pComment->setFormatStart(nNewId);
					GetRunStringWriter().WriteString(pComment->writeRef(CString(_T("")), CString(_T("w:commentRangeStart")), CString(_T(""))));
				}
			}
		}
		else if ( c_oSerParType::CommentEnd == type )
		{
			long nId = 0;
			res = Read1(length, &Binary_DocumentTableReader::ReadComment, this, &nId);
			if(NULL != m_pComments)
			{
				CComment* pComment = m_pComments->get(nId);
				if(NULL != pComment && pComment->bIdFormat)
				{
					CommitFirstRun();
					GetRunStringWriter().WriteString(pComment->writeRef(CString(_T("")), CString(_T("w:commentRangeEnd")), CString(_T(""))));
				}
			}
		}
		else if ( c_oSerParType::OMathPara == type )
		{
			CommitFirstRun();
			m_oDocumentWriter.m_oContent.WriteString(CString(_T("<m:oMathPara>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathOMathPara, this, poResult);
			m_oDocumentWriter.m_oContent.WriteString(CString(_T("</m:oMathPara>")));
		}
		else if ( c_oSerParType::OMath == type )
		{
			CommitFirstRun();
			m_oDocumentWriter.m_oContent.WriteString(CString(_T("<m:oMath>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathArg, this, poResult);
			m_oDocumentWriter.m_oContent.WriteString(CString(_T("</m:oMath>")));
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathLong(BYTE type, long length, void* poResult)
	{		
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesValType::Val == type )
			LONG lVal = m_oBufferedStream.ReadLong();
		else
			res = c_oSerConstants::ReadUnknown;

		return res;
	}
	int ReadMathArg(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathContentType::Acc == type )
		{
			GetRunStringWriter().WriteString(CString(_T("<m:acc>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathAcc, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:acc>")));
		}
		else if ( c_oSer_OMathContentType::ArgPr == type )
		{
			GetRunStringWriter().WriteString(CString(_T("<m:argPr>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathArgPr, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:argPr>")));
		}
		else if ( c_oSer_OMathContentType::Bar == type )
		{			
			GetRunStringWriter().WriteString(CString(_T("<m:bar>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathBar, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:bar>")));
		}
		else if ( c_oSer_OMathContentType::BorderBox == type )
		{			
			GetRunStringWriter().WriteString(CString(_T("<m:borderBox>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathBorderBox, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:borderBox>")));
		}
		else if ( c_oSer_OMathContentType::Box == type )
		{			
			GetRunStringWriter().WriteString(CString(_T("<m:box>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathBox, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:box>")));
		}
		else if ( c_oSer_OMathContentType::CtrlPr == type )
		{			
			GetRunStringWriter().WriteString(CString(_T("<m:ctrlPr>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathCtrlPr, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:ctrlPr>")));
		}
		else if ( c_oSer_OMathContentType::Delimiter == type )
		{	
			GetRunStringWriter().WriteString(CString(_T("<m:d>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathDelimiter, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:d>")));
		}
		else if ( c_oSer_OMathContentType::EqArr == type )
		{			
			GetRunStringWriter().WriteString(CString(_T("<m:eqArr>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathEqArr, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:eqArr>")));
		}
		else if ( c_oSer_OMathContentType::Fraction == type )
		{			
			GetRunStringWriter().WriteString(CString(_T("<m:f>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathFraction, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:f>")));
		}
		else if ( c_oSer_OMathContentType::Func == type )
		{			
			GetRunStringWriter().WriteString(CString(_T("<m:func>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathFunc, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:func>")));
		}
		else if ( c_oSer_OMathContentType::GroupChr == type )
		{			
			GetRunStringWriter().WriteString(CString(_T("<m:groupChr>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathGroupChr, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:groupChr>")));
		}
		else if ( c_oSer_OMathContentType::LimLow == type )
		{			
			GetRunStringWriter().WriteString(CString(_T("<m:limLow>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathLimLow, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:limLow>")));
		}
		else if ( c_oSer_OMathContentType::LimUpp == type )
		{			
			GetRunStringWriter().WriteString(CString(_T("<m:limUpp>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathLimUpp, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:limUpp>")));
		}
		else if ( c_oSer_OMathContentType::Matrix == type )
		{			
			GetRunStringWriter().WriteString(CString(_T("<m:m>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathMatrix, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:m>")));
		}
		else if ( c_oSer_OMathContentType::Nary == type )
		{			
			GetRunStringWriter().WriteString(CString(_T("<m:nary>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathNary, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:nary>")));
		}
		else if ( c_oSer_OMathContentType::OMath == type )
		{			
			GetRunStringWriter().WriteString(CString(_T("<m:oMath>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathArg, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:oMath>")));
		}
		else if ( c_oSer_OMathContentType::OMathPara == type )
		{			
			GetRunStringWriter().WriteString(CString(_T("<m:oMathPara>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathOMathPara, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:oMathPara>")));
		}
		else if ( c_oSer_OMathContentType::Phant == type )
		{			
			GetRunStringWriter().WriteString(CString(_T("<m:phant>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathPhant, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:phant>")));
		}
		else if ( c_oSer_OMathContentType::MRun == type )
		{			
			GetRunStringWriter().WriteString(CString(_T("<m:r>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathMRun, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:r>")));
		}
		else if ( c_oSer_OMathContentType::Rad == type )
		{			
			GetRunStringWriter().WriteString(CString(_T("<m:rad>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathRad, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:rad>")));
		}
		else if ( c_oSer_OMathContentType::SPre == type )
		{			
			GetRunStringWriter().WriteString(CString(_T("<m:sPre>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathSPre, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:sPre>")));
		}
		else if ( c_oSer_OMathContentType::SSub == type )
		{			
			GetRunStringWriter().WriteString(CString(_T("<m:sSub>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathSSub, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:sSub>")));
		}
		else if ( c_oSer_OMathContentType::SSubSup == type )
		{			
			GetRunStringWriter().WriteString(CString(_T("<m:sSubSup>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathSSubSup, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:sSubSup>")));
		}
		else if ( c_oSer_OMathContentType::SSup == type )
		{			
			GetRunStringWriter().WriteString(CString(_T("<m:sSup>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathSSup, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:sSup>")));
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathAcc(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathContentType::AccPr == type )
		{
			GetRunStringWriter().WriteString(CString(_T("<m:accPr>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathAccPr, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:accPr>")));
		}
		else if ( c_oSer_OMathContentType::Element == type )
		{			
			GetRunStringWriter().WriteString(CString(_T("<m:e>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathArg, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:e>")));
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}

	int ReadMathAccPr(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesType::Chr == type )
		{
			res = Read2(length, &Binary_DocumentTableReader::ReadMathChr, this, poResult);
		}
		else if ( c_oSer_OMathBottomNodesType::CtrlPr == type )
		{			
			GetRunStringWriter().WriteString(CString(_T("<m:ctrlPr>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathCtrlPr, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:ctrlPr>")));
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathAln(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesValType::Val == type )
		{
			bool bVal = m_oBufferedStream.ReadBool();
			CString sVal = _T("<m:aln");
			if (bVal)
				sVal += _T(" m:val=\"true\" />");
			else
				sVal += _T(" />");
			GetRunStringWriter().WriteString(sVal);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathAlnScr(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesValType::Val == type )
		{
			bool bVal = m_oBufferedStream.ReadBool();
			CString sVal = _T("<m:alnScr");
			if (bVal)
				sVal += _T(" m:val=\"true\" />");
			else
				sVal += _T(" />");
			GetRunStringWriter().WriteString(sVal);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathArgPr(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesType::ArgSz == type )
		{
			res = Read2(length, &Binary_DocumentTableReader::ReadMathArgSz, this, poResult);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathArgSz(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesValType::Val == type )
		{
			LONG lVal;
			lVal = m_oBufferedStream.ReadLong();
			CString sVal(_T("<m:argSz"));
			if (lVal)
			{
				CString sXml; sXml.Format(_T(" m:val=\"%d\""), lVal);
				sVal.Append(sXml);
			}
			sVal.Append(_T(" />"));
			GetRunStringWriter().WriteString(sVal);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathBar(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathContentType::BarPr == type )
		{
			GetRunStringWriter().WriteString(CString(_T("<m:barPr>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathBarPr, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:barPr>")));
		}
		else if ( c_oSer_OMathContentType::Element == type )
		{			
			GetRunStringWriter().WriteString(CString(_T("<m:e>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathArg, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:e>")));
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathBarPr(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesType::CtrlPr == type )
		{
			GetRunStringWriter().WriteString(CString(_T("<m:ctrlPr>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathCtrlPr, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:ctrlPr>")));
		}
		else if ( c_oSer_OMathBottomNodesType::Pos == type )
		{		
			res = Read2(length, &Binary_DocumentTableReader::ReadMathPos, this, poResult);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathBaseJc(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesValType::Val == type )
		{
			BYTE BaseJc;
			CString sBaseJc (_T("top"));
			BaseJc = m_oBufferedStream.ReadByte();			
			switch(BaseJc)
			{
				case 0: sBaseJc = _T("bottom");break;
				case 1: sBaseJc = _T("center");break;
				case 2: sBaseJc = _T("inline");break;
				case 3: sBaseJc = _T("inside");break;
				case 4: sBaseJc = _T("outside");break;
				case 5: sBaseJc = _T("top");break;
			}			
			CString sVal; sVal.Format(_T("<m:pos m:val=\"%s\" />"), sBaseJc);
			GetRunStringWriter().WriteString(sVal);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathBegChr(BYTE type, long length, void* poResult) 
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesValType::Val == type )
		{
				CString sChr = GetMathText (length);
				CString sVal; sVal.Format(_T("<m:begChr m:val=\"%s\" />"), sChr);
				GetRunStringWriter().WriteString(sVal);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathBorderBox(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathContentType::BorderBoxPr == type )
		{
			GetRunStringWriter().WriteString(CString(_T("<m:borderBoxPr>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathBorderBoxPr, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:borderBoxPr>")));
		}
		else if ( c_oSer_OMathContentType::Element == type )
		{		
			GetRunStringWriter().WriteString(CString(_T("<m:e>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathArg, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:e>")));
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathBorderBoxPr(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesType::CtrlPr == type )
		{			
			GetRunStringWriter().WriteString(CString(_T("<m:ctrlPr>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathCtrlPr, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:ctrlPr>")));
		}
		else if ( c_oSer_OMathBottomNodesType::HideBot == type )
		{
			res = Read2(length, &Binary_DocumentTableReader::ReadMathHideBot, this, poResult);
		}
		else if ( c_oSer_OMathBottomNodesType::HideLeft == type )
		{		
			res = Read2(length, &Binary_DocumentTableReader::ReadMathHideLeft, this, poResult);
		}
		else if ( c_oSer_OMathBottomNodesType::HideRight == type )
		{		
			res = Read2(length, &Binary_DocumentTableReader::ReadMathHideRight, this, poResult);
		}
		else if ( c_oSer_OMathBottomNodesType::HideTop == type )
		{		
			res = Read2(length, &Binary_DocumentTableReader::ReadMathHideTop, this, poResult);
		}
		else if ( c_oSer_OMathBottomNodesType::StrikeBLTR == type )
		{		
			res = Read2(length, &Binary_DocumentTableReader::ReadMathStrikeBLTR, this, poResult);
		}
		else if ( c_oSer_OMathBottomNodesType::StrikeH == type )
		{		
			res = Read2(length, &Binary_DocumentTableReader::ReadMathStrikeH, this, poResult);
		}
		else if ( c_oSer_OMathBottomNodesType::StrikeTLBR == type )
		{		
			res = Read2(length, &Binary_DocumentTableReader::ReadMathStrikeTLBR, this, poResult);
		}
		else if ( c_oSer_OMathBottomNodesType::StrikeV == type )
		{		
			res = Read2(length, &Binary_DocumentTableReader::ReadMathStrikeV, this, poResult);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathBox(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathContentType::BoxPr == type )
		{
			GetRunStringWriter().WriteString(CString(_T("<m:boxPr>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathBoxPr, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:boxPr>")));
		}
		else if ( c_oSer_OMathContentType::Element == type )
		{		
			GetRunStringWriter().WriteString(CString(_T("<m:e>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathArg, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:e>")));
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathBoxPr(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesType::Aln == type )
		{
			res = Read2(length, &Binary_DocumentTableReader::ReadMathAln, this, poResult);
		}
		else if ( c_oSer_OMathBottomNodesType::Brk == type )
		{
			res = Read2(length, &Binary_DocumentTableReader::ReadMathBrk, this, poResult);
		}
		else if ( c_oSer_OMathBottomNodesType::CtrlPr == type )
		{		
			GetRunStringWriter().WriteString(CString(_T("<m:ctrlPr>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathCtrlPr, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:ctrlPr>")));
		}
		else if ( c_oSer_OMathBottomNodesType::Diff == type )
		{		
			res = Read2(length, &Binary_DocumentTableReader::ReadMathDiff, this, poResult);
		}
		else if ( c_oSer_OMathBottomNodesType::NoBreak == type )
		{		
			res = Read2(length, &Binary_DocumentTableReader::ReadMathNoBreak, this, poResult);
		}
		else if ( c_oSer_OMathBottomNodesType::OpEmu == type )
		{		
			res = Read2(length, &Binary_DocumentTableReader::ReadMathOpEmu, this, poResult);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathBrk(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesValType::AlnAt == type )
		{
			LONG lVal;
			lVal = m_oBufferedStream.ReadLong();
			CString sVal(_T("<m:brk"));
			if (lVal)
			{
				CString sXml; sXml.Format(_T(" m:alnAt=\"%d\""), lVal);
				sVal.Append(sXml);
			}
			sVal.Append(_T(" />"));
			GetRunStringWriter().WriteString(sVal);
		}
		else if ( c_oSer_OMathBottomNodesValType::Val == type )
		{
			BOOL bVal;
			bVal = m_oBufferedStream.ReadBool();
			CString sVal(_T("<m:brk/>"));
				GetRunStringWriter().WriteString(sVal);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathCGp(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesValType::Val == type )
		{
			LONG lVal;
			lVal = m_oBufferedStream.ReadLong();
			CString sVal(_T("<m:cGp"));
			if (lVal)
			{
				CString sXml; sXml.Format(_T(" m:val=\"%d\""), lVal);
				sVal.Append(sXml);
			}
			sVal.Append(_T(" />"));
			GetRunStringWriter().WriteString(sVal);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}

	int ReadMathCGpRule(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesValType::Val == type )
		{
			BYTE CGpRule;
			CString sCGpRule (_T("centered"));
			CGpRule = m_oBufferedStream.ReadByte();			
			switch(CGpRule)
			{
				case 0: sCGpRule = _T("centered");break;
				case 1: sCGpRule = _T("match");break;
			}			
			CString sVal; sVal.Format(_T("<m:cGpRule m:val=\"%s\" />"), sCGpRule);
			GetRunStringWriter().WriteString(sVal);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}

	int ReadMathChr(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesValType::Val == type )
		{
				CString sChr = GetMathText (length);
				CString sVal; sVal.Format(_T("<m:chr m:val=\"%s\" />"), sChr);
				GetRunStringWriter().WriteString(sVal);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathCount(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesValType::Val == type )
		{
			LONG lVal;
			lVal = m_oBufferedStream.ReadLong();
			CString sVal(_T("<m:count"));
			if (lVal)
			{
				CString sXml; sXml.Format(_T(" m:val=\"%d\""), lVal);
				sVal.Append(sXml);
			}
			sVal.Append(_T(" />"));
			GetRunStringWriter().WriteString(sVal);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathCSp(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesValType::Val == type )
		{
			LONG lVal;
			lVal = m_oBufferedStream.ReadLong();
			CString sVal(_T("<m:cSp"));
			if (lVal)
			{
				CString sXml; sXml.Format(_T(" m:val=\"%d\""), lVal);
				sVal.Append(sXml);
			}
			sVal.Append(_T(" />"));
			GetRunStringWriter().WriteString(sVal);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathCtrlPr(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSerRunType::rPr == type )
		{
			res = oBinary_rPrReader.Read(length, &m_oMath_rPr);
			if(m_oMath_rPr.IsNoEmpty())
			m_oMath_rPr.Write(&GetRunStringWriter());
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathDelimiter(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathContentType::DelimiterPr == type )
		{
			GetRunStringWriter().WriteString(CString(_T("<m:dPr>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathDelimiterPr, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:dPr>")));
		}
		else if ( c_oSer_OMathContentType::Element == type )
		{		
			GetRunStringWriter().WriteString(CString(_T("<m:e>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathArg, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:e>")));
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}	
	int ReadMathDegHide(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesValType::Val == type )
		{
			bool bVal = m_oBufferedStream.ReadBool();
			CString sVal = _T("<m:degHide");
			if (bVal)
				sVal += _T(" m:val=\"true\" />");
			else
				sVal += _T(" />");
			GetRunStringWriter().WriteString(sVal);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathDiff(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesValType::Val == type )
		{
			bool bVal = m_oBufferedStream.ReadBool();
			CString sVal = _T("<m:diff");
			if (bVal)
				sVal += _T(" m:val=\"true\" />");
			else
				sVal += _T(" />");
			GetRunStringWriter().WriteString(sVal);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}	
	int ReadMathDelimiterPr(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesType::Column == type )
		{
			res = Read2(length, &Binary_DocumentTableReader::ReadMathLong, this, poResult);			
		}	
		else if ( c_oSer_OMathBottomNodesType::BegChr == type )
		{
			res = Read2(length, &Binary_DocumentTableReader::ReadMathBegChr, this, poResult);
		}
		else if ( c_oSer_OMathBottomNodesType::CtrlPr == type )
		{
			GetRunStringWriter().WriteString(CString(_T("<m:ctrlPr>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathCtrlPr, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:ctrlPr>")));
		}
		else if ( c_oSer_OMathBottomNodesType::EndChr == type )
		{
			res = Read2(length, &Binary_DocumentTableReader::ReadMathEndChr, this, poResult);
		}
		else if ( c_oSer_OMathBottomNodesType::Grow == type )
		{
			res = Read2(length, &Binary_DocumentTableReader::ReadMathGrow, this, poResult);
		}
		else if ( c_oSer_OMathBottomNodesType::SepChr == type )
		{
			res = Read2(length, &Binary_DocumentTableReader::ReadMathSepChr, this, poResult);
		}
		else if ( c_oSer_OMathBottomNodesType::Shp == type )
		{
			res = Read2(length, &Binary_DocumentTableReader::ReadMathShp, this, poResult);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathEndChr(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesValType::Val == type )
		{
				CString sChr = GetMathText (length);
				CString sVal; sVal.Format(_T("<m:endChr m:val=\"%s\" />"), sChr);
				GetRunStringWriter().WriteString(sVal);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathEqArr(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathContentType::Element == type )
		{
			GetRunStringWriter().WriteString(CString(_T("<m:e>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathArg, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:e>")));
		}
		else if ( c_oSer_OMathContentType::EqArrPr == type )
		{
			GetRunStringWriter().WriteString(CString(_T("<m:eqArrPr>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathEqArrPr, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:eqArrPr>")));
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathEqArrPr(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesType::Row == type )
		{
			res = Read2(length, &Binary_DocumentTableReader::ReadMathLong, this, poResult);			
		}	
		else if ( c_oSer_OMathBottomNodesType::BaseJc == type )
		{
			res = Read2(length, &Binary_DocumentTableReader::ReadMathBaseJc, this, poResult);
		}
		else if ( c_oSer_OMathBottomNodesType::CtrlPr == type )
		{
			GetRunStringWriter().WriteString(CString(_T("<m:ctrlPr>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathCtrlPr, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:ctrlPr>")));
		}
		else if ( c_oSer_OMathBottomNodesType::MaxDist == type )
		{
			res = Read2(length, &Binary_DocumentTableReader::ReadMathMaxDist, this, poResult);
		}
		else if ( c_oSer_OMathBottomNodesType::ObjDist == type )
		{
			res = Read2(length, &Binary_DocumentTableReader::ReadMathObjDist, this, poResult);
		}
		else if ( c_oSer_OMathBottomNodesType::RSp == type )
		{
			res = Read2(length, &Binary_DocumentTableReader::ReadMathRSp, this, poResult);
		}
		else if ( c_oSer_OMathBottomNodesType::RSpRule == type )
		{
			res = Read2(length, &Binary_DocumentTableReader::ReadMathRSpRule, this, poResult);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathFraction(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathContentType::Den == type )
		{
			GetRunStringWriter().WriteString(CString(_T("<m:den>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathArg, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:den>")));
		}
		else if ( c_oSer_OMathContentType::FPr == type )
		{
			GetRunStringWriter().WriteString(CString(_T("<m:fPr>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathFPr, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:fPr>")));
		}
		else if ( c_oSer_OMathContentType::Num == type )
		{
			GetRunStringWriter().WriteString(CString(_T("<m:num>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathArg, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:num>")));
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathFPr(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesType::CtrlPr == type )
		{
			GetRunStringWriter().WriteString(CString(_T("<m:ctrlPr>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathCtrlPr, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:ctrlPr>")));
		}
		else if ( c_oSer_OMathBottomNodesType::Type == type )
		{
			res = Read2(length, &Binary_DocumentTableReader::ReadMathType, this, poResult);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathFunc(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathContentType::Element == type )
		{
			GetRunStringWriter().WriteString(CString(_T("<m:e>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathArg, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:e>")));
		}
		else if ( c_oSer_OMathContentType::FName == type )
		{
			GetRunStringWriter().WriteString(CString(_T("<m:fName>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathArg, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:fName>")));
		}
		else if ( c_oSer_OMathContentType::FuncPr == type )
		{
			GetRunStringWriter().WriteString(CString(_T("<m:funcPr>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathFuncPr, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:funcPr>")));
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathFuncPr(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesType::CtrlPr == type )
		{
			GetRunStringWriter().WriteString(CString(_T("<m:ctrlPr>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathCtrlPr, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:ctrlPr>")));
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathGroupChr(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathContentType::Element == type )
		{
			GetRunStringWriter().WriteString(CString(_T("<m:e>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathArg, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:e>")));
		}
		else if ( c_oSer_OMathContentType::GroupChrPr == type )
		{
			GetRunStringWriter().WriteString(CString(_T("<m:groupChrPr>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathGroupChrPr, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:groupChrPr>")));
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathGroupChrPr(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesType::Chr == type )
		{
			res = Read2(length, &Binary_DocumentTableReader::ReadMathChr, this, poResult);
		}
		else if ( c_oSer_OMathBottomNodesType::CtrlPr == type )
		{
			GetRunStringWriter().WriteString(CString(_T("<m:ctrlPr>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathCtrlPr, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:ctrlPr>")));
		}
		else if ( c_oSer_OMathBottomNodesType::Pos == type )
		{
			res = Read2(length, &Binary_DocumentTableReader::ReadMathPos, this, poResult);
		}
		else if ( c_oSer_OMathBottomNodesType::VertJc == type )
		{
			res = Read2(length, &Binary_DocumentTableReader::ReadMathVertJc, this, poResult);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathGrow(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesValType::Val == type )
		{
			bool bVal = m_oBufferedStream.ReadBool();
			CString sVal = _T("<m:grow");
			if (!bVal)
				sVal += _T(" m:val=\"false\" />");

			GetRunStringWriter().WriteString(sVal);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathHideBot(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesValType::Val == type )
		{
			bool bVal = m_oBufferedStream.ReadBool();
			CString sVal = _T("<m:hideBot");
			if (bVal)
				sVal += _T(" m:val=\"true\" />");
			else
				sVal += _T(" />");
			GetRunStringWriter().WriteString(sVal);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathHideLeft(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesValType::Val == type )
		{
			bool bVal = m_oBufferedStream.ReadBool();
			CString sVal = _T("<m:hideLeft");
			if (bVal)
				sVal += _T(" m:val=\"true\" />");
			else
				sVal += _T(" />");
			GetRunStringWriter().WriteString(sVal);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathHideRight(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesValType::Val == type )
		{
			bool bVal = m_oBufferedStream.ReadBool();
			CString sVal = _T("<m:hideRight");
			if (bVal)
				sVal += _T(" m:val=\"true\" />");
			else
				sVal += _T(" />");
			GetRunStringWriter().WriteString(sVal);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathHideTop(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesValType::Val == type )
		{
			bool bVal = m_oBufferedStream.ReadBool();
			CString sVal = _T("<m:hideTop");
			if (bVal)
				sVal += _T(" m:val=\"true\" />");
			else
				sVal += _T(" />");
			GetRunStringWriter().WriteString(sVal);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}		
	int ReadMathMJc(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesValType::Val == type )
		{
			BYTE MJc;
			CString sMJc (_T("centerGroup"));
			MJc = m_oBufferedStream.ReadByte();			
			switch(MJc)
			{
				case 0: sMJc = _T("center");break;
				case 1: sMJc = _T("centerGroup");break;
				case 2: sMJc = _T("left");break;
				case 3: sMJc = _T("right");break;
			}			
			CString sVal; sVal.Format(_T("<m:mJc m:val=\"%s\" />"), sMJc);
			GetRunStringWriter().WriteString(sVal);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathLimLoc(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesValType::Val == type )
		{
			BYTE LimLoc;
			CString sLimLoc (_T("subSup"));
			LimLoc = m_oBufferedStream.ReadByte();	
			switch(LimLoc)
			{
				case 0: sLimLoc = _T("subSup");break;
				case 1: sLimLoc = _T("undOvr");break;
			}		
			CString sVal; sVal.Format(_T("<m:limLoc m:val=\"%s\" />"), sLimLoc);
			GetRunStringWriter().WriteString(sVal);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}

	int ReadMathLimLow(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathContentType::Element == type )
		{
			GetRunStringWriter().WriteString(CString(_T("<m:e>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathArg, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:e>")));
		}
		else if ( c_oSer_OMathContentType::Lim == type )
		{
			GetRunStringWriter().WriteString(CString(_T("<m:lim>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathArg, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:lim>")));
		}
		else if ( c_oSer_OMathContentType::LimLowPr == type )
		{
			GetRunStringWriter().WriteString(CString(_T("<m:limLowPr>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathLimLowPr, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:limLowPr>")));
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathLimLowPr(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesType::CtrlPr == type )
		{
			GetRunStringWriter().WriteString(CString(_T("<m:ctrlPr>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathCtrlPr, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:ctrlPr>")));
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathLimUpp(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathContentType::Element == type )
		{
			GetRunStringWriter().WriteString(CString(_T("<m:e>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathArg, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:e>")));
		}
		else if ( c_oSer_OMathContentType::Lim == type )
		{
			GetRunStringWriter().WriteString(CString(_T("<m:lim>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathArg, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:lim>")));
		}
		else if ( c_oSer_OMathContentType::LimUppPr == type )
		{
			GetRunStringWriter().WriteString(CString(_T("<m:limUppPr>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathLimUppPr, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:limUppPr>")));
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathLimUppPr(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesType::CtrlPr == type )
		{
			GetRunStringWriter().WriteString(CString(_T("<m:ctrlPr>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathCtrlPr, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:ctrlPr>")));
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathLit(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesValType::Val == type )
		{
			bool bVal = m_oBufferedStream.ReadBool();
			CString sVal = _T("<m:lit");
			if (bVal)
				sVal += _T(" m:val=\"true\" />");
			else
				sVal += _T(" />");
			GetRunStringWriter().WriteString(sVal);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}	
	int ReadMathMatrix(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathContentType::MPr == type )
		{
			GetRunStringWriter().WriteString(CString(_T("<m:mPr>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathMPr, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:mPr>")));
		}
		else if ( c_oSer_OMathContentType::Mr == type )
		{
			GetRunStringWriter().WriteString(CString(_T("<m:mr>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathMr, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:mr>")));
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathMaxDist(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesValType::Val == type )
		{
			bool bVal = m_oBufferedStream.ReadBool();
			CString sVal = _T("<m:maxDist");
			if (bVal)
				sVal += _T(" m:val=\"true\" />");
			else
				sVal += _T(" />");
			GetRunStringWriter().WriteString(sVal);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathMc(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathContentType::McPr == type )
		{
			GetRunStringWriter().WriteString(CString(_T("<m:mcPr>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathMcPr, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:mcPr>")));
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathMcJc(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesValType::Val == type )
		{
			BYTE McJc;
			CString sMcJc (_T("center"));
			McJc = m_oBufferedStream.ReadByte();			
			switch(McJc)
			{
				case 0: sMcJc = _T("center");break;
				case 1: sMcJc = _T("inside");break;
				case 2: sMcJc = _T("left");break;
				case 3: sMcJc = _T("outside");break;
				case 4: sMcJc = _T("right");break;
			}			
			CString sVal; sVal.Format(_T("<m:mcJc m:val=\"%s\" />"), sMcJc);
			GetRunStringWriter().WriteString(sVal);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathMcPr(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesType::Count == type )
		{
			res = Read2(length, &Binary_DocumentTableReader::ReadMathCount, this, poResult);
		}
		else if ( c_oSer_OMathBottomNodesType::McJc == type )
		{
			res = Read2(length, &Binary_DocumentTableReader::ReadMathMcJc, this, poResult);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathMcs(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathContentType::Mc == type )
		{
			GetRunStringWriter().WriteString(CString(_T("<m:mc>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathMc, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:mc>")));
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathMPr(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesType::Row == type )
		{
			res = Read2(length, &Binary_DocumentTableReader::ReadMathLong, this, poResult);
		}
		else if ( c_oSer_OMathBottomNodesType::BaseJc == type )
		{
			res = Read2(length, &Binary_DocumentTableReader::ReadMathBaseJc, this, poResult);
		}
		else if ( c_oSer_OMathBottomNodesType::CGp == type )
		{
			res = Read2(length, &Binary_DocumentTableReader::ReadMathCGp, this, poResult);
		}
		else if ( c_oSer_OMathBottomNodesType::CGpRule == type )
		{
			res = Read2(length, &Binary_DocumentTableReader::ReadMathCGpRule, this, poResult);
		}
		else if ( c_oSer_OMathBottomNodesType::CSp == type )
		{
			res = Read2(length, &Binary_DocumentTableReader::ReadMathCSp, this, poResult);
		}
		else if ( c_oSer_OMathBottomNodesType::CtrlPr == type )
		{
			GetRunStringWriter().WriteString(CString(_T("<m:ctrlPr>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathCtrlPr, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:ctrlPr>")));
		}
		else if ( c_oSer_OMathBottomNodesType::Mcs == type )
		{
			GetRunStringWriter().WriteString(CString(_T("<m:mcs>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathMcs, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:mcs>")));
		}
		else if ( c_oSer_OMathBottomNodesType::PlcHide == type )
		{
			res = Read2(length, &Binary_DocumentTableReader::ReadMathPlcHide, this, poResult);
		}
		else if ( c_oSer_OMathBottomNodesType::RSp == type )
		{
			res = Read2(length, &Binary_DocumentTableReader::ReadMathRSp, this, poResult);
		}
		else if ( c_oSer_OMathBottomNodesType::RSpRule == type )
		{
			res = Read2(length, &Binary_DocumentTableReader::ReadMathRSpRule, this, poResult);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathMr(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathContentType::Element == type )
		{
			GetRunStringWriter().WriteString(CString(_T("<m:e>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathArg, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:e>")));
		}		
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathNary(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathContentType::Element == type )
		{
			GetRunStringWriter().WriteString(CString(_T("<m:e>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathArg, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:e>")));
		}
		else if ( c_oSer_OMathContentType::NaryPr == type )
		{
			GetRunStringWriter().WriteString(CString(_T("<m:naryPr>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathNaryPr, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:naryPr>")));
		}
		else if ( c_oSer_OMathContentType::Sub == type )
		{
			GetRunStringWriter().WriteString(CString(_T("<m:sub>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathArg, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:sub>")));
		}
		else if ( c_oSer_OMathContentType::Sup == type )
		{
			GetRunStringWriter().WriteString(CString(_T("<m:sup>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathArg, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:sup>")));
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathNaryPr(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesType::Chr == type )
		{
			res = Read2(length, &Binary_DocumentTableReader::ReadMathChr, this, poResult);
		}
		else if ( c_oSer_OMathBottomNodesType::CtrlPr == type )
		{
			GetRunStringWriter().WriteString(CString(_T("<m:ctrlPr>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathCtrlPr, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:ctrlPr>")));
		}
		else if ( c_oSer_OMathBottomNodesType::Grow == type )
		{
			res = Read2(length, &Binary_DocumentTableReader::ReadMathGrow, this, poResult);
		}
		else if ( c_oSer_OMathBottomNodesType::LimLoc == type )
		{
			res = Read2(length, &Binary_DocumentTableReader::ReadMathLimLoc, this, poResult);
		}
		else if ( c_oSer_OMathBottomNodesType::SubHide == type )
		{
			res = Read2(length, &Binary_DocumentTableReader::ReadMathSubHide, this, poResult);
		}
		else if ( c_oSer_OMathBottomNodesType::SupHide == type )
		{
			res = Read2(length, &Binary_DocumentTableReader::ReadMathSupHide, this, poResult);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathNoBreak(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesValType::Val == type )
		{
			bool bVal = m_oBufferedStream.ReadBool();
			CString sVal = _T("<m:noBreak");
			if (bVal)
				sVal += _T(" m:val=\"true\" />");
			else
				sVal += _T(" />");
			GetRunStringWriter().WriteString(sVal);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathNor(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesValType::Val == type )
		{
			bool bVal = m_oBufferedStream.ReadBool();
			CString sVal = _T("<m:nor");
			if (bVal)
				sVal += _T(" m:val=\"true\" />");
			else
				sVal += _T(" />");
			GetRunStringWriter().WriteString(sVal);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathObjDist(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesValType::Val == type )
		{
			bool bVal = m_oBufferedStream.ReadBool();
			CString sVal = _T("<m:objDist");
			if (bVal)
				sVal += _T(" m:val=\"true\" />");
			else
				sVal += _T(" />");
			GetRunStringWriter().WriteString(sVal);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathOMathPara(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathContentType::OMath == type )
		{
			GetRunStringWriter().WriteString(CString(_T("<m:oMath>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathArg, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:oMath>")));
		}
		else if ( c_oSer_OMathContentType::OMathParaPr == type )
		{
			GetRunStringWriter().WriteString(CString(_T("<m:oMathParaPr>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathOMathParaPr, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:oMathParaPr>")));
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathOMathParaPr(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesType::MJc == type )
		{
			res = Read2(length, &Binary_DocumentTableReader::ReadMathMJc, this, poResult);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathOpEmu(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesValType::Val == type )
		{
			bool bVal = m_oBufferedStream.ReadBool();
			CString sVal = _T("<m:opEmu");
			if (bVal)
				sVal += _T(" m:val=\"true\" />");
			else
				sVal += _T(" />");
			GetRunStringWriter().WriteString(sVal);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathPhant(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathContentType::Element == type )
		{
			GetRunStringWriter().WriteString(CString(_T("<m:e>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathArg, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:e>")));
		}
		else if ( c_oSer_OMathContentType::PhantPr == type )
		{
			GetRunStringWriter().WriteString(CString(_T("<m:phantPr>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathPhantPr, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:phantPr>")));
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathPhantPr(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesType::CtrlPr == type )
		{
			GetRunStringWriter().WriteString(CString(_T("<m:ctrlPr>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathCtrlPr, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:ctrlPr>")));
		}
		else if ( c_oSer_OMathBottomNodesType::Show == type )
		{
			res = Read2(length, &Binary_DocumentTableReader::ReadMathShow, this, poResult);
		}
		else if ( c_oSer_OMathBottomNodesType::Transp == type )
		{
			res = Read2(length, &Binary_DocumentTableReader::ReadMathTransp, this, poResult);
		}
		else if ( c_oSer_OMathBottomNodesType::ZeroAsc == type )
		{
			res = Read2(length, &Binary_DocumentTableReader::ReadMathZeroAsc, this, poResult);
		}
		else if ( c_oSer_OMathBottomNodesType::ZeroDesc == type )
		{
			res = Read2(length, &Binary_DocumentTableReader::ReadMathZeroDesc, this, poResult);
		}
		else if ( c_oSer_OMathBottomNodesType::ZeroWid == type )
		{
			res = Read2(length, &Binary_DocumentTableReader::ReadMathZeroWid, this, poResult);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathPlcHide(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesValType::Val == type )
		{
			bool bVal = m_oBufferedStream.ReadBool();
			CString sVal = _T("<m:plcHide");
			if (bVal)
				sVal += _T(" m:val=\"true\" />");
			else
				sVal += _T(" />");
			GetRunStringWriter().WriteString(sVal);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathPos(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesValType::Val == type )
		{
			BYTE Pos;
			CString sPos(_T("bot"));
			Pos = m_oBufferedStream.ReadByte();
			
			switch(Pos)
			{
				case 0: sPos = _T("bot");break;
				case 1: sPos = _T("top");break;
			}
			
			CString sVal; sVal.Format(_T("<m:pos m:val=\"%s\" />"), sPos);
			GetRunStringWriter().WriteString(sVal);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	CString GetMathText (long length)
	{
		CString strRes = _T("");
		CString strVal((wchar_t*)m_oBufferedStream.ReadPointer(length), length / 2);
		for (unsigned int i = 0, length = strVal.GetLength(); i < length; ++i )
		{
			WCHAR sChr = strVal.GetAt(i);
			if ( true == IsUnicodeSymbol( sChr ) )
			{
				strRes += sChr;
			}
		}
		strRes.Replace(_T("&"),	_T("&amp;"));			
		strRes.Replace(_T("'"),	_T("&apos;"));
		strRes.Replace(_T("<"),	_T("&lt;"));
		strRes.Replace(_T(">"),	_T("&gt;"));
		strRes.Replace(_T("\""),_T("&quot;"));

		return strRes;
	}
	int ReadMathMRun(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathContentType::MText == type )
		{
			GetRunStringWriter().WriteString(CString(_T("<m:t>")));

			CString sText = GetMathText (length);			
			GetRunStringWriter().WriteString(sText);

			GetRunStringWriter().WriteString(CString(_T("</m:t>")));
		}
		else if ( c_oSer_OMathContentType::RPr == type )
		{
			res = oBinary_rPrReader.Read(length, &m_oMath_rPr);
			if(m_oMath_rPr.IsNoEmpty())
				m_oMath_rPr.Write(&GetRunStringWriter());
		}
		else if ( c_oSer_OMathContentType::MRPr == type )
		{
			GetRunStringWriter().WriteString(CString(_T("<m:rPr>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathMRPr, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:rPr>")));
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathRad(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathContentType::Deg== type )
		{
			GetRunStringWriter().WriteString(CString(_T("<m:deg>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathArg, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:deg>")));
		}
		else if ( c_oSer_OMathContentType::Element == type )
		{
			GetRunStringWriter().WriteString(CString(_T("<m:e>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathArg, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:e>")));
		}
		else if ( c_oSer_OMathContentType::RadPr == type )
		{
			GetRunStringWriter().WriteString(CString(_T("<m:radPr>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathRadPr, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:radPr>")));
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathRadPr(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesType::CtrlPr == type )
		{
			GetRunStringWriter().WriteString(CString(_T("<m:ctrlPr>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathCtrlPr, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:ctrlPr>")));
		}
		else if ( c_oSer_OMathBottomNodesType::DegHide == type )
		{
			res = Read2(length, &Binary_DocumentTableReader::ReadMathDegHide, this, poResult);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathMRPr(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesType::Aln == type )
		{
			res = Read2(length, &Binary_DocumentTableReader::ReadMathAln, this, poResult);
		}
		else if ( c_oSer_OMathBottomNodesType::Brk == type )
		{
			res = Read2(length, &Binary_DocumentTableReader::ReadMathBrk, this, poResult);
		}
		else if ( c_oSer_OMathBottomNodesType::Lit == type )
		{
			res = Read2(length, &Binary_DocumentTableReader::ReadMathLit, this, poResult);
		}
		else if ( c_oSer_OMathBottomNodesType::Nor == type )
		{
			res = Read2(length, &Binary_DocumentTableReader::ReadMathNor, this, poResult);
		}
		else if ( c_oSer_OMathBottomNodesType::Scr == type )
		{
			res = Read2(length, &Binary_DocumentTableReader::ReadMathScr, this, poResult);
		}
		else if ( c_oSer_OMathBottomNodesType::Sty == type )
		{
			res = Read2(length, &Binary_DocumentTableReader::ReadMathSty, this, poResult);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathRSp(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesValType::Val == type )
		{
			LONG lVal;
			lVal = m_oBufferedStream.ReadLong();
			CString sVal(_T("<m:rSp"));
			if (lVal)
			{
				CString sXml; sXml.Format(_T(" m:val=\"%d\""), lVal);
				sVal.Append(sXml);
			}
			sVal.Append(_T(" />"));
			GetRunStringWriter().WriteString(sVal);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathRSpRule(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesValType::Val == type )
		{
			BYTE RSpRule;
			CString sRSpRule (_T("centered"));
			RSpRule = m_oBufferedStream.ReadByte();			
			switch(RSpRule)
			{
				case 0: sRSpRule = _T("centered");break;
				case 1: sRSpRule = _T("match");break;
			}			
			CString sVal; sVal.Format(_T("<m:rSpRule m:val=\"%s\" />"), sRSpRule);
			GetRunStringWriter().WriteString(sVal);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathScr(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesValType::Val == type )
		{
			BYTE Scr;
			CString sScr (_T("roman"));
			Scr = m_oBufferedStream.ReadByte();			
			switch(Scr)
			{
				case 0: sScr = _T("double-struck");break;
				case 1: sScr = _T("fraktur");break;
				case 2: sScr = _T("monospace");break;
				case 3: sScr = _T("roman");break;
				case 4: sScr = _T("sans-serif");break;
				case 5: sScr = _T("script");break;
			}			
			CString sVal; sVal.Format(_T("<m:scr m:val=\"%s\" />"), sScr);
			GetRunStringWriter().WriteString(sVal);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathSepChr(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesValType::Val == type )
		{
				CString sChr = GetMathText (length);
				CString sVal; sVal.Format(_T("<m:sepChr m:val=\"%s\" />"), sChr);
				GetRunStringWriter().WriteString(sVal);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathShow(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesValType::Val == type )
		{
			bool bVal = m_oBufferedStream.ReadBool();
			CString sVal = _T("<m:show");
			if (bVal)
				sVal += _T(" m:val=\"true\" />");
			else
				sVal += _T(" />");
			GetRunStringWriter().WriteString(sVal);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathShp(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesValType::Val == type )
		{
			BYTE Shp;
			CString sShp (_T("centered"));
			Shp = m_oBufferedStream.ReadByte();			
			switch(Shp)
			{
				case 0: sShp = _T("centered");break;
				case 1: sShp = _T("match");break;
			}			
			CString sVal; sVal.Format(_T("<m:shp m:val=\"%s\" />"), sShp);
			GetRunStringWriter().WriteString(sVal);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathSPre(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathContentType::Element == type )
		{
			GetRunStringWriter().WriteString(CString(_T("<m:e>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathArg, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:e>")));
		}
		else if ( c_oSer_OMathContentType::SPrePr == type )
		{
			GetRunStringWriter().WriteString(CString(_T("<m:sPrePr>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathSPrePr, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:sPrePr>")));
		}
		else if ( c_oSer_OMathContentType::Sub == type )
		{
			GetRunStringWriter().WriteString(CString(_T("<m:sub>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathArg, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:sub>")));
		}
		else if ( c_oSer_OMathContentType::Sup == type )
		{
			GetRunStringWriter().WriteString(CString(_T("<m:sup>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathArg, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:sup>")));
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathSPrePr(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesType::CtrlPr == type )
		{
			GetRunStringWriter().WriteString(CString(_T("<m:ctrlPr>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathCtrlPr, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:ctrlPr>")));
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathSSub(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathContentType::Element == type )
		{
			GetRunStringWriter().WriteString(CString(_T("<m:e>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathArg, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:e>")));
		}
		else if ( c_oSer_OMathContentType::SSubPr == type )
		{
			GetRunStringWriter().WriteString(CString(_T("<m:sSubPr>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathSSubPr, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:sSubPr>")));
		}
		else if ( c_oSer_OMathContentType::Sub == type )
		{
			GetRunStringWriter().WriteString(CString(_T("<m:sub>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathArg, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:sub>")));
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathSSubPr(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesType::CtrlPr == type )
		{
			GetRunStringWriter().WriteString(CString(_T("<m:ctrlPr>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathCtrlPr, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:ctrlPr>")));
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathSSubSup(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathContentType::Element == type )
		{
			GetRunStringWriter().WriteString(CString(_T("<m:e>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathArg, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:e>")));
		}
		else if ( c_oSer_OMathContentType::SSubSupPr == type )
		{
			GetRunStringWriter().WriteString(CString(_T("<m:sSubSupPr>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathSSubSupPr, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:sSubSupPr>")));
		}
		else if ( c_oSer_OMathContentType::Sub == type )
		{
			GetRunStringWriter().WriteString(CString(_T("<m:sub>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathArg, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:sub>")));
		}
		else if ( c_oSer_OMathContentType::Sup == type )
		{
			GetRunStringWriter().WriteString(CString(_T("<m:sup>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathArg, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:sup>")));
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathSSubSupPr(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesType::AlnScr == type )
		{
			res = Read2(length, &Binary_DocumentTableReader::ReadMathAlnScr, this, poResult);
		}
		else if ( c_oSer_OMathBottomNodesType::CtrlPr == type )
		{
			GetRunStringWriter().WriteString(CString(_T("<m:ctrlPr>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathCtrlPr, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:ctrlPr>")));
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathSSup(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathContentType::Element == type )
		{
			GetRunStringWriter().WriteString(CString(_T("<m:e>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathArg, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:e>")));
		}
		else if ( c_oSer_OMathContentType::SSupPr == type )
		{
			GetRunStringWriter().WriteString(CString(_T("<m:sSupPr>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathSSupPr, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:sSupPr>")));
		}
		else if ( c_oSer_OMathContentType::Sup == type )
		{
			GetRunStringWriter().WriteString(CString(_T("<m:sup>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathArg, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:sup>")));
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathSSupPr(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesType::CtrlPr == type )
		{
			GetRunStringWriter().WriteString(CString(_T("<m:ctrlPr>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadMathCtrlPr, this, poResult);
			GetRunStringWriter().WriteString(CString(_T("</m:ctrlPr>")));
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathStrikeBLTR(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesValType::Val == type )
		{
			bool bVal = m_oBufferedStream.ReadBool();
			CString sVal = _T("<m:strikeBLTR");
			if (bVal)
				sVal += _T(" m:val=\"true\" />");
			else
				sVal += _T(" />");
			GetRunStringWriter().WriteString(sVal);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathStrikeH(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesValType::Val == type )
		{
			bool bVal = m_oBufferedStream.ReadBool();
			CString sVal = _T("<m:strikeH");
			if (bVal)
				sVal += _T(" m:val=\"true\" />");
			else
				sVal += _T(" />");
			GetRunStringWriter().WriteString(sVal);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathStrikeTLBR(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesValType::Val == type )
		{
			bool bVal = m_oBufferedStream.ReadBool();
			CString sVal = _T("<m:strikeTLBR");
			if (bVal)
				sVal += _T(" m:val=\"true\" />");
			else
				sVal += _T(" />");
			GetRunStringWriter().WriteString(sVal);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathStrikeV(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesValType::Val == type )
		{
			bool bVal = m_oBufferedStream.ReadBool();
			CString sVal = _T("<m:strikeV");
			if (bVal)
				sVal += _T(" m:val=\"true\" />");
			else
				sVal += _T(" />");
			GetRunStringWriter().WriteString(sVal);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathSty(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesValType::Val == type )
		{
			BYTE Sty;
			CString sSty (_T("i"));
			Sty = m_oBufferedStream.ReadByte();			
			switch(Sty)
			{
				case 0: sSty = _T("b");break;
				case 1: sSty = _T("bi");break;
				case 2: sSty = _T("i");break;
				case 3: sSty = _T("p");break;
			}			
			CString sVal; sVal.Format(_T("<m:sty m:val=\"%s\" />"), sSty);
			GetRunStringWriter().WriteString(sVal);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathSubHide(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesValType::Val == type )
		{
			bool bVal = m_oBufferedStream.ReadBool();
			CString sVal = _T("<m:subHide");
			if (bVal)
				sVal += _T(" m:val=\"true\" />");
			else
				sVal += _T(" />");
			GetRunStringWriter().WriteString(sVal);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathSupHide(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesValType::Val == type )
		{
			bool bVal = m_oBufferedStream.ReadBool();
			CString sVal = _T("<m:supHide");
			if (bVal)
				sVal += _T(" m:val=\"true\" />");
			else
				sVal += _T(" />");
			GetRunStringWriter().WriteString(sVal);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathTransp(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesValType::Val == type )
		{
			bool bVal = m_oBufferedStream.ReadBool();
			CString sVal = _T("<m:transp");
			if (bVal)
				sVal += _T(" m:val=\"true\" />");
			else
				sVal += _T(" />");
			GetRunStringWriter().WriteString(sVal);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathType(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesValType::Val == type )
		{
			BYTE Type;
			CString sType (_T("bar"));
			Type = m_oBufferedStream.ReadByte();			
			switch(Type)
			{
				case 0: sType = _T("bar");break;
				case 1: sType = _T("lin");break;
				case 2: sType = _T("noBar");break;
				case 3: sType = _T("skw");break;
			}			
			CString sVal; sVal.Format(_T("<m:type m:val=\"%s\" />"), sType);
			GetRunStringWriter().WriteString(sVal);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathVertJc(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesValType::Val == type )
		{
			BYTE VertJc;
			CString sVertJc (_T("bot"));
			VertJc = m_oBufferedStream.ReadByte();			
			switch(VertJc)
			{
				case 0: sVertJc = _T("bot");break;
				case 1: sVertJc = _T("top");break;
			}			
			CString sVal; sVal.Format(_T("<m:vertJc m:val=\"%s\" />"), sVertJc);
			GetRunStringWriter().WriteString(sVal);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathZeroAsc(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesValType::Val == type )
		{
			bool bVal = m_oBufferedStream.ReadBool();
			CString sVal = _T("<m:zeroAsc");
			if (bVal)
				sVal += _T(" m:val=\"true\" />");
			else
				sVal += _T(" />");
			GetRunStringWriter().WriteString(sVal);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathZeroDesc(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesValType::Val == type )
		{
			bool bVal = m_oBufferedStream.ReadBool();
			CString sVal = _T("<m:zaroDesc");
			if (bVal)
				sVal += _T(" m:val=\"true\" />");
			else
				sVal += _T(" />");
			GetRunStringWriter().WriteString(sVal);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadMathZeroWid(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSer_OMathBottomNodesValType::Val == type )
		{
			bool bVal = m_oBufferedStream.ReadBool();
			CString sVal = _T("<m:zeroWid");
			if (bVal)
				sVal += _T(" m:val=\"true\" />");
			else
				sVal += _T(" />");
			GetRunStringWriter().WriteString(sVal);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadRun(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSerRunType::rPr == type )
		{
			res = oBinary_rPrReader.Read(length, &m_oCur_rPr);
		}
		else if ( c_oSerRunType::Content == type )
		{
			res = Read1(length, &Binary_DocumentTableReader::ReadRunContent, this, NULL);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadRunContent(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if (c_oSerRunType::run == type)
		{
			CommitFirstRun();
			GetRunStringWriter().WriteString(CString(_T("<w:r>")));
			if(m_oCur_rPr.IsNoEmpty())
				m_oCur_rPr.Write(&GetRunStringWriter());
			GetRunStringWriter().WriteString(CString(_T("<w:t xml:space=\"preserve\">")));
			CString sText((wchar_t*)m_oBufferedStream.ReadPointer(length), length / 2);
			CorrectString(sText);
			GetRunStringWriter().WriteString(sText);
			GetRunStringWriter().WriteString(CString(_T("</w:t>")));
			GetRunStringWriter().WriteString(CString(_T("</w:r>")));
		}
		else if (c_oSerRunType::tab == type)
		{
			CommitFirstRun();
			GetRunStringWriter().WriteString(CString(_T("<w:r>")));
			if(m_oCur_rPr.IsNoEmpty())
				m_oCur_rPr.Write(&GetRunStringWriter());
			GetRunStringWriter().WriteString(CString(_T("<w:tab/>")));
			GetRunStringWriter().WriteString(CString(_T("</w:r>")));
		}
		else if (c_oSerRunType::pagenum == type)
		{
			CommitFirstRun();
			GetRunStringWriter().WriteString(CString(_T("<w:r>")));
			if(m_oCur_rPr.IsNoEmpty())
				m_oCur_rPr.Write(&GetRunStringWriter());
			GetRunStringWriter().WriteString(CString(_T("<w:fldChar w:fldCharType=\"begin\"/></w:r><w:r>")));
			if(m_oCur_rPr.IsNoEmpty())
				m_oCur_rPr.Write(&GetRunStringWriter());
			GetRunStringWriter().WriteString(CString(_T("<w:instrText xml:space=\"preserve\">PAGE \\* MERGEFORMAT</w:instrText></w:r><w:r>")));
			if(m_oCur_rPr.IsNoEmpty())
				m_oCur_rPr.Write(&GetRunStringWriter());
			GetRunStringWriter().WriteString(CString(_T("<w:fldChar w:fldCharType=\"separate\"/></w:r><w:r>")));
			if(m_oCur_rPr.IsNoEmpty())
				m_oCur_rPr.Write(&GetRunStringWriter());
			GetRunStringWriter().WriteString(CString(_T("<w:fldChar w:fldCharType=\"end\"/></w:r>")));
		}
		else if (c_oSerRunType::pagebreak == type)
		{
			CommitFirstRun();
			GetRunStringWriter().WriteString(CString(_T("<w:r>")));
			if(m_oCur_rPr.IsNoEmpty())
				m_oCur_rPr.Write(&GetRunStringWriter());
			GetRunStringWriter().WriteString(CString(_T("<w:br w:type=\"page\"/>")));
			GetRunStringWriter().WriteString(CString(_T("</w:r>")));
		}
		else if (c_oSerRunType::linebreak == type)
		{
			CommitFirstRun();
			GetRunStringWriter().WriteString(CString(_T("<w:r>")));
			if(m_oCur_rPr.IsNoEmpty())
				m_oCur_rPr.Write(&GetRunStringWriter());
			GetRunStringWriter().WriteString(CString(_T("<w:br />")));
			GetRunStringWriter().WriteString(CString(_T("</w:r>")));
		}
		else if(c_oSerRunType::image == type)
		{
			CommitFirstRun();
			docImg odocImg(m_oFileWriter.getNextDocPr());
			res = Read2(length, &Binary_DocumentTableReader::ReadImage, this, &odocImg);
			if(odocImg.MediaId >= 0 && odocImg.MediaId < m_oMediaWriter.nImageCount)
			{
				CString sNewImgName = m_oMediaWriter.m_aImageNames[odocImg.MediaId];
				CString sNewImgRel;sNewImgRel = _T("media/") + sNewImgName;
				CorrectString(sNewImgRel);
				long rId;
				BSTR bstrNewImgRel = sNewImgRel.AllocSysString();
				m_oFileWriter.m_pDrawingConverter->WriteRels(_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/image"), bstrNewImgRel, NULL, &rId);
				SysFreeString(bstrNewImgRel);
				odocImg.srId.Format(_T("rId%d"), rId);
				
				
				if(!odocImg.srId.IsEmpty())
				{
					GetRunStringWriter().WriteString(CString(_T("<w:r>")));
					if(m_oCur_rPr.IsNoEmpty())
						m_oCur_rPr.Write(&GetRunStringWriter());
					odocImg.Write(&GetRunStringWriter());
					GetRunStringWriter().WriteString(CString(_T("</w:r>")));
				}
			}
		}
		else if(c_oSerRunType::pptxDrawing == type)
		{
			CDrawingProperty oCDrawingProperty(m_oFileWriter.getNextDocPr());
			res = Read2(length, &Binary_DocumentTableReader::ReadPptxDrawing, this, &oCDrawingProperty);

			if(oCDrawingProperty.IsChart())
			{
				CommitFirstRun();
				GetRunStringWriter().WriteString(CString(_T("<w:r>")));
				if(m_oCur_rPr.IsNoEmpty())
					m_oCur_rPr.Write(&GetRunStringWriter());
				GetRunStringWriter().WriteString(oCDrawingProperty.Write());
				GetRunStringWriter().WriteString(CString(_T("</w:r>")));
			}
			else if(oCDrawingProperty.bDataPos && oCDrawingProperty.bDataLength)
			{
				CString sDrawingProperty = oCDrawingProperty.Write();
				if(false == sDrawingProperty.IsEmpty())
				{
					VARIANT var;
					var.vt = VT_I4;
					var.intVal = m_oFileWriter.m_oChartWriter.getChartCount();
					m_oFileWriter.m_pDrawingConverter->SetAdditionalParam(_T("DocumentChartsCount"), var);

					BSTR bstrDrawingProperty = sDrawingProperty.AllocSysString();
					BSTR bstrDrawingXml = NULL;
					m_oFileWriter.m_pDrawingConverter->SaveObjectEx(m_oFileWriter.m_pArray, oCDrawingProperty.DataPos, oCDrawingProperty.DataLength, bstrDrawingProperty, XMLWRITER_DOC_TYPE_DOCX, &bstrDrawingXml);
					SysFreeString(bstrDrawingProperty);
					CString sDrawingXml(bstrDrawingXml);

					VARIANT vt;
					m_oFileWriter.m_pDrawingConverter->GetAdditionalParam(_T("DocumentChartsCount"), &vt);
					if(VT_I4 == vt.vt)
						m_oFileWriter.m_oChartWriter.setChartCount(vt.intVal);

					if(false == sDrawingXml.IsEmpty())
					{
						CommitFirstRun();
						GetRunStringWriter().WriteString(CString(_T("<w:r>")));
						if(m_oCur_rPr.IsNoEmpty())
							m_oCur_rPr.Write(&GetRunStringWriter());
						GetRunStringWriter().WriteString(sDrawingXml);
						GetRunStringWriter().WriteString(CString(_T("</w:r>")));
						SysFreeString(bstrDrawingXml);
					}
				}
			}
		}
		else if(c_oSerRunType::table == type)
		{
			
			oBinary_tblPrReader.m_sCurTableShd.Empty();
			if(false == bFirstRun)
			{
				if(NULL != m_pCurHyperlink)
				{
					m_pCurHyperlink->Write(m_oDocumentWriter.m_oContent);
					RELEASEOBJECT(m_pCurHyperlink);
				}
				m_oDocumentWriter.m_oContent.WriteString(CString(_T("</w:p>")));
			}
			m_oDocumentWriter.m_oContent.WriteString(CString(_T("<w:tbl>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadDocTable, this, &m_oDocumentWriter.m_oContent);
			m_oDocumentWriter.m_oContent.WriteString(CString(_T("</w:tbl>")));
			bFirstRun = true;
			
			oBinary_tblPrReader.m_sCurTableShd.Empty();
		}
		else if(c_oSerRunType::fldstart == type)
		{
			CommitFirstRun();
			CString sField((wchar_t*)m_oBufferedStream.ReadPointer(length), length / 2);
			if(-1 != sField.Find(_T("HYPERLINK")))
			{
				RELEASEOBJECT(m_pCurHyperlink);
				m_pCurHyperlink = WriteHyperlink::Parse(sField);
				if(NULL != m_pCurHyperlink)
				{
					long rId;
					CString sHref = m_pCurHyperlink->href;
					CorrectString(sHref);
					BSTR bstrHref = sHref.AllocSysString();
					m_oFileWriter.m_pDrawingConverter->WriteRels(_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink"), bstrHref, _T("External"), &rId);
					SysFreeString(bstrHref);
					CString srId;srId.Format(_T("rId%d"), rId);
					m_pCurHyperlink->rId = srId;
				}
			}
			else
			{
				CorrectString(sField);
				GetRunStringWriter().WriteString(CString(_T("<w:r>")));
				if(m_oCur_rPr.IsNoEmpty())
					m_oCur_rPr.Write(&GetRunStringWriter());
				GetRunStringWriter().WriteString(CString(_T("<w:fldChar w:fldCharType=\"begin\"/></w:r><w:r>")));
				if(m_oCur_rPr.IsNoEmpty())
					m_oCur_rPr.Write(&GetRunStringWriter());
				GetRunStringWriter().WriteString(CString(_T("<w:instrText xml:space=\"preserve\">")));
				GetRunStringWriter().WriteString(sField);
				GetRunStringWriter().WriteString(CString(_T("</w:instrText></w:r><w:r>")));
				if(m_oCur_rPr.IsNoEmpty())
					m_oCur_rPr.Write(&GetRunStringWriter());
				GetRunStringWriter().WriteString(CString(_T("<w:fldChar w:fldCharType=\"separate\"/></w:r>")));
			}
		}
		else if(c_oSerRunType::fldend == type)
		{
			CommitFirstRun();
			if(NULL != m_pCurHyperlink)
			{
				m_pCurHyperlink->Write(m_oDocumentWriter.m_oContent);
				RELEASEOBJECT(m_pCurHyperlink);
			}
			else
			{
				GetRunStringWriter().WriteString(CString(_T("<w:r>")));
				if(m_oCur_rPr.IsNoEmpty())
					m_oCur_rPr.Write(&GetRunStringWriter());
				GetRunStringWriter().WriteString(CString(_T("<w:fldChar w:fldCharType=\"end\"/></w:r>")));
			}
		}
		else if ( c_oSerRunType::CommentReference == type )
		{
			long nId = 0;
			res = Read1(length, &Binary_DocumentTableReader::ReadComment, this, &nId);
			if(NULL != m_pComments)
			{
				CComment* pComment = m_pComments->get(nId);
				if(NULL != pComment && pComment->bIdFormat)
				{
					CommitFirstRun();
					GetRunStringWriter().WriteString(pComment->writeRef(CString(_T("<w:r>")), CString(_T("w:commentReference")), CString(_T("</w:r>"))));
				}
			}
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	};
	int ReadComment(BYTE type, long length, void* poResult)
	{
		long* pVal = static_cast<long*>(poResult);
		int res = c_oSerConstants::ReadOk;
		if (c_oSer_CommentsType::Id == type)
			*pVal = m_oBufferedStream.ReadLong();
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadDocTable(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		CStringWriter* pCStringWriter = static_cast<CStringWriter*>(poResult);
		if( c_oSerDocTableType::tblPr == type )
		{
			CWiterTblPr oWiterTblPr;
			oBinary_tblPrReader.Read_tblPrOut(length, &oWiterTblPr);
			pCStringWriter->WriteString(oWiterTblPr.Write(false, true));
		}
		else if( c_oSerDocTableType::tblGrid == type )
		{
			oBinary_tblPrReader.m_aCurTblGrid.RemoveAll();
			pCStringWriter->WriteString(CString(_T("<w:tblGrid>")));
			res = Read2(length, &Binary_DocumentTableReader::Read_tblGrid, this, poResult);
			pCStringWriter->WriteString(CString(_T("</w:tblGrid>")));
		}
		else if( c_oSerDocTableType::Content == type )
		{
			res = Read1(length, &Binary_DocumentTableReader::Read_TableContent, this, poResult);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	};
	int Read_tblGrid(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		CStringWriter* pCStringWriter = static_cast<CStringWriter*>(poResult);
		if( c_oSerDocTableType::tblGrid_Item == type )
		{
			double dgridCol = m_oBufferedStream.ReadDouble2();
			oBinary_tblPrReader.m_aCurTblGrid.Add(dgridCol);
			long ngridCol = Round( g_dKoef_mm_to_twips * dgridCol);
			CString sgridCol;sgridCol.Format(_T("<w:gridCol w:w=\"%d\"/>"), ngridCol);
			pCStringWriter->WriteString(sgridCol);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	};
	int Read_TableContent(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		CStringWriter* pCStringWriter = static_cast<CStringWriter*>(poResult);
		if( c_oSerDocTableType::Row == type )
		{
			pCStringWriter->WriteString(CString(_T("<w:tr>")));
			res = Read1(length, &Binary_DocumentTableReader::Read_Row, this, poResult);
			pCStringWriter->WriteString(CString(_T("</w:tr>")));
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	};
	int Read_Row(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		CStringWriter* pCStringWriter = static_cast<CStringWriter*>(poResult);
		if( c_oSerDocTableType::Row_Pr == type )
		{
			pCStringWriter->WriteString(CString(_T("<w:trPr>")));
			oBinary_tblPrReader.Read_RowPrOut(length, pCStringWriter);
			pCStringWriter->WriteString(CString(_T("</w:trPr>")));
		}
		else if( c_oSerDocTableType::Row_Content == type )
		{
			res = Read1(length, &Binary_DocumentTableReader::ReadRowContent, this, poResult);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	};
	int ReadRowContent(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		CStringWriter* pCStringWriter = static_cast<CStringWriter*>(poResult);
		if( c_oSerDocTableType::Cell == type )
		{
			pCStringWriter->WriteString(CString(_T("<w:tc>")));
			res = Read1(length, &Binary_DocumentTableReader::ReadCell, this, poResult);
			pCStringWriter->WriteString(CString(_T("</w:tc>")));
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	};
	int ReadCell(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		CStringWriter* pCStringWriter = static_cast<CStringWriter*>(poResult);
		if( c_oSerDocTableType::Cell_Pr == type )
		{
			pCStringWriter->WriteString(CString(_T("<w:tcPr>")));
			oBinary_tblPrReader.bCellShd = false;
			oBinary_tblPrReader.Read_CellPrOut(length, pCStringWriter);
			if(false == oBinary_tblPrReader.bCellShd && !oBinary_tblPrReader.m_sCurTableShd.IsEmpty())
			{
				pCStringWriter->WriteString(oBinary_tblPrReader.m_sCurTableShd);
			}
			oBinary_tblPrReader.bCellShd = false;
			pCStringWriter->WriteString(CString(_T("</w:tcPr>")));
		}
		else if( c_oSerDocTableType::Cell_Content == type )
		{
			Binary_DocumentTableReader oBinary_DocumentTableReader(m_oBufferedStream, m_oFileWriter, m_oDocumentWriter, m_pComments);
			res = Read1(length, &Binary_DocumentTableReader::ReadCellContent, this, &oBinary_DocumentTableReader);
			
			if(c_oSerParType::Par != oBinary_DocumentTableReader.m_byteLastElemType)
			{
				m_oDocumentWriter.m_oContent.WriteString(CString(_T("<w:p />")));
			}
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	};
	int ReadCellContent(BYTE type, long length, void* poResult)
	{
		Binary_DocumentTableReader* pBinary_DocumentTableReader = static_cast<Binary_DocumentTableReader*>(poResult);
		return pBinary_DocumentTableReader->ReadDocumentContent(type, length, NULL);
	}
	int Read_SecPr(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if( c_oSerProp_secPrType::pgSz == type )
		{
			res = Read2(length, &Binary_DocumentTableReader::Read_pgSz, this, poResult);
		}
		else if( c_oSerProp_secPrType::pgMar == type )
		{
			res = Read2(length, &Binary_DocumentTableReader::Read_pgMar, this, poResult);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int Read_pgSz(BYTE type, long length, void* poResult)
	{
		SectPr* pSectPr = static_cast<SectPr*>(poResult);
		int res = c_oSerConstants::ReadOk;
		if( c_oSer_pgSzType::Orientation == type )
		{
			pSectPr->cOrientation = m_oBufferedStream.ReadByte();
		}
		else if( c_oSer_pgSzType::W == type )
		{
			pSectPr->W = m_oBufferedStream.ReadDouble2();
		}
		else if( c_oSer_pgSzType::H == type )
		{
			pSectPr->H = m_oBufferedStream.ReadDouble2();
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int Read_pgMar(BYTE type, long length, void* poResult)
	{
		SectPr* pSectPr = static_cast<SectPr*>(poResult);
		int res = c_oSerConstants::ReadOk;
		if( c_oSer_pgMarType::Left == type )
		{
			pSectPr->Left = m_oBufferedStream.ReadDouble2();
		}
		else if( c_oSer_pgMarType::Top == type )
		{
			pSectPr->Top = m_oBufferedStream.ReadDouble2();
		}
		else if( c_oSer_pgMarType::Right == type )
		{
			pSectPr->Right = m_oBufferedStream.ReadDouble2();
		}
		else if( c_oSer_pgMarType::Bottom == type )
		{
			pSectPr->Bottom = m_oBufferedStream.ReadDouble2();
		}
		else if( c_oSer_pgMarType::Header == type )
		{
			pSectPr->bHeader = true;
			pSectPr->Header = m_oBufferedStream.ReadDouble2();
		}
		else if( c_oSer_pgMarType::Footer == type )
		{
			pSectPr->bFooter = true;
			pSectPr->Footer = m_oBufferedStream.ReadDouble2();
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadImage(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		docImg* odocImg = static_cast<docImg*>(poResult);
		if ( c_oSerImageType::MediaId == type )
		{
			odocImg->bMediaId = true;
			odocImg->MediaId = m_oBufferedStream.ReadLong();
		}
		else if ( c_oSerImageType::Type == type )
		{
			odocImg->bType = true;
			odocImg->Type = m_oBufferedStream.ReadByte();
		}
		else if ( c_oSerImageType::Width == type )
		{
			odocImg->bWidth = true;
			odocImg->Width = m_oBufferedStream.ReadDouble2();
		}
		else if ( c_oSerImageType::Height == type )
		{
			odocImg->bHeight = true;
			odocImg->Height = m_oBufferedStream.ReadDouble2();
		}
		else if ( c_oSerImageType::X == type )
		{
			odocImg->bX = true;
			odocImg->X = m_oBufferedStream.ReadDouble2();
		}
		else if ( c_oSerImageType::Y == type )
		{
			odocImg->bY = true;
			odocImg->Y = m_oBufferedStream.ReadDouble2();
		}
		else if ( c_oSerImageType::Padding == type )
		{
			odocImg->bPaddings = true;
			oBinary_tblPrReader.ReadPaddingsOut(length, &odocImg->Paddings);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadPptxDrawing(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		CDrawingProperty* pDrawingProperty = static_cast<CDrawingProperty*>(poResult);
		if ( c_oSerImageType2::Type == type )
		{
			pDrawingProperty->bType = true;
			pDrawingProperty->Type = m_oBufferedStream.ReadByte();
		}
		else if ( c_oSerImageType2::PptxData == type )
		{
			pDrawingProperty->bDataPos = true;
			pDrawingProperty->bDataLength = true;
			pDrawingProperty->DataPos = m_oBufferedStream.GetPosition();
			pDrawingProperty->DataLength = length;
			
			res = c_oSerConstants::ReadUnknown;
		}
		else if ( c_oSerImageType2::Chart == type )
		{
			if(false == m_oFileWriter.m_bSaveChartAsImg)
			{
				BinXlsxRW::BinaryChartReader oBinaryChartReader(m_oBufferedStream, m_oFileWriter.m_pArray, m_oFileWriter.m_pDrawingConverter);
				OOX::Spreadsheet::CChartSpace* pChartSpace = new OOX::Spreadsheet::CChartSpace();
				pChartSpace->m_oChart.Init();
				oBinaryChartReader.ReadChartOut(length, pChartSpace);

				OOX::Spreadsheet::CStringWriter sw;
				pChartSpace->toXML(sw);
				CString sChartContent = sw.GetCString();
				if(false == sChartContent.IsEmpty())
				{
					CString sRelsName;
					int nIndex;
					m_oFileWriter.m_oChartWriter.AddChart(sChartContent, sRelsName, nIndex);

					long rId;
					BSTR bstrChartRelType = OOX::Spreadsheet::FileTypes::Charts.RelationType().AllocSysString();
					BSTR bstrNewImgRel = sRelsName.AllocSysString();
					m_oFileWriter.m_pDrawingConverter->WriteRels(bstrChartRelType, bstrNewImgRel, NULL, &rId);
					SysFreeString(bstrChartRelType);
					SysFreeString(bstrNewImgRel);

					pDrawingProperty->sChartRels.Format(_T("rId%d"), rId);
				}
			}
			else
				res = c_oSerConstants::ReadUnknown;
		}
		else if ( c_oSerImageType2::ChartImg == type )
		{
			if(true == m_oFileWriter.m_bSaveChartAsImg)
			{
				pDrawingProperty->bDataPos = true;
				pDrawingProperty->bDataLength = true;
				pDrawingProperty->DataPos = m_oBufferedStream.GetPosition();
				pDrawingProperty->DataLength = length;
				
			}
			res = c_oSerConstants::ReadUnknown;
		}
		else if ( c_oSerImageType2::BehindDoc == type )
		{
			pDrawingProperty->bBehindDoc = true;
			pDrawingProperty->BehindDoc = m_oBufferedStream.ReadBool();
		}
		else if ( c_oSerImageType2::DistL == type )
		{
			pDrawingProperty->bDistL = true;
			pDrawingProperty->DistL = m_oBufferedStream.ReadDouble2();
		}
		else if ( c_oSerImageType2::DistT == type )
		{
			pDrawingProperty->bDistT = true;
			pDrawingProperty->DistT = m_oBufferedStream.ReadDouble2();
		}
		else if ( c_oSerImageType2::DistR == type )
		{
			pDrawingProperty->bDistR = true;
			pDrawingProperty->DistR = m_oBufferedStream.ReadDouble2();
		}
		else if ( c_oSerImageType2::DistB == type )
		{
			pDrawingProperty->bDistB = true;
			pDrawingProperty->DistB = m_oBufferedStream.ReadDouble2();
		}
		else if ( c_oSerImageType2::LayoutInCell == type )
		{
			pDrawingProperty->bLayoutInCell = true;
			pDrawingProperty->LayoutInCell = m_oBufferedStream.ReadBool();
		}
		else if ( c_oSerImageType2::RelativeHeight == type )
		{
			pDrawingProperty->bRelativeHeight = true;
			pDrawingProperty->RelativeHeight = m_oBufferedStream.ReadLong();
		}
		else if ( c_oSerImageType2::BSimplePos == type )
		{
			pDrawingProperty->bBSimplePos = true;
			pDrawingProperty->BSimplePos = m_oBufferedStream.ReadBool();
		}
		else if ( c_oSerImageType2::EffectExtent == type )
		{
			res = Read2(length, &Binary_DocumentTableReader::ReadEffectExtent, this, poResult);
		}
		else if ( c_oSerImageType2::Extent == type )
		{
			res = Read2(length, &Binary_DocumentTableReader::ReadExtent, this, poResult);
		}
		else if ( c_oSerImageType2::PositionH == type )
		{
			res = Read2(length, &Binary_DocumentTableReader::ReadPositionH, this, poResult);
		}
		else if ( c_oSerImageType2::PositionV == type )
		{
			res = Read2(length, &Binary_DocumentTableReader::ReadPositionV, this, poResult);
		}
		else if ( c_oSerImageType2::SimplePos == type )
		{
			res = Read2(length, &Binary_DocumentTableReader::ReadSimplePos, this, poResult);
		}
		else if ( c_oSerImageType2::WrapNone == type )
		{
			pDrawingProperty->bDrawingPropertyWrap = true;
			pDrawingProperty->DrawingPropertyWrap.bWrappingType = true;
			pDrawingProperty->DrawingPropertyWrap.WrappingType = type;
		}
		else if ( c_oSerImageType2::WrapSquare == type )
		{
			pDrawingProperty->bDrawingPropertyWrap = true;
			pDrawingProperty->DrawingPropertyWrap.bWrappingType = true;
			pDrawingProperty->DrawingPropertyWrap.WrappingType = type;
			res = Read2(length, &Binary_DocumentTableReader::ReadEmptyWrap, this, poResult);
		}
		else if ( c_oSerImageType2::WrapThrough == type )
		{
			pDrawingProperty->bDrawingPropertyWrap = true;
			pDrawingProperty->DrawingPropertyWrap.bWrappingType = true;
			pDrawingProperty->DrawingPropertyWrap.WrappingType = type;
			res = Read2(length, &Binary_DocumentTableReader::ReadWrapThroughTight, this, &pDrawingProperty->DrawingPropertyWrap);
		}
		else if ( c_oSerImageType2::WrapTight == type )
		{
			pDrawingProperty->bDrawingPropertyWrap = true;
			pDrawingProperty->DrawingPropertyWrap.bWrappingType = true;
			pDrawingProperty->DrawingPropertyWrap.WrappingType = type;
			res = Read2(length, &Binary_DocumentTableReader::ReadWrapThroughTight, this, &pDrawingProperty->DrawingPropertyWrap);
		}
		else if ( c_oSerImageType2::WrapTopAndBottom == type )
		{
			pDrawingProperty->bDrawingPropertyWrap = true;
			pDrawingProperty->DrawingPropertyWrap.bWrappingType = true;
			pDrawingProperty->DrawingPropertyWrap.WrappingType = type;
			res = Read2(length, &Binary_DocumentTableReader::ReadEmptyWrap, this, poResult);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadEffectExtent(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		CDrawingProperty* pDrawingProperty = static_cast<CDrawingProperty*>(poResult);
		if ( c_oSerEffectExtent::Left == type )
		{
			pDrawingProperty->bEffectExtentL = true;
			pDrawingProperty->EffectExtentL = m_oBufferedStream.ReadDouble2();
		}
		else if ( c_oSerEffectExtent::Top == type )
		{
			pDrawingProperty->bEffectExtentT = true;
			pDrawingProperty->EffectExtentT = m_oBufferedStream.ReadDouble2();
		}
		else if ( c_oSerEffectExtent::Right == type )
		{
			pDrawingProperty->bEffectExtentR = true;
			pDrawingProperty->EffectExtentR = m_oBufferedStream.ReadDouble2();
		}
		else if ( c_oSerEffectExtent::Bottom == type )
		{
			pDrawingProperty->bEffectExtentB = true;
			pDrawingProperty->EffectExtentB = m_oBufferedStream.ReadDouble2();
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadExtent(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		CDrawingProperty* pDrawingProperty = static_cast<CDrawingProperty*>(poResult);
		if ( c_oSerExtent::Cx == type )
		{
			pDrawingProperty->bWidth = true;
			pDrawingProperty->Width = m_oBufferedStream.ReadDouble2();
		}
		else if ( c_oSerExtent::Cy == type )
		{
			pDrawingProperty->bHeight = true;
			pDrawingProperty->Height = m_oBufferedStream.ReadDouble2();
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadPositionH(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		CDrawingProperty* pDrawingProperty = static_cast<CDrawingProperty*>(poResult);
		if ( c_oSerPosHV::RelativeFrom == type )
		{
			pDrawingProperty->bPositionHRelativeFrom = true;
			pDrawingProperty->PositionHRelativeFrom = m_oBufferedStream.ReadByte();
		}
		else if ( c_oSerPosHV::Align == type )
		{
			pDrawingProperty->bPositionHAlign = true;
			pDrawingProperty->PositionHAlign = m_oBufferedStream.ReadByte();
		}
		else if ( c_oSerPosHV::PosOffset == type )
		{
			pDrawingProperty->bPositionHPosOffset = true;
			pDrawingProperty->PositionHPosOffset = m_oBufferedStream.ReadDouble2();
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadPositionV(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		CDrawingProperty* pDrawingProperty = static_cast<CDrawingProperty*>(poResult);
		if ( c_oSerPosHV::RelativeFrom == type )
		{
			pDrawingProperty->bPositionVRelativeFrom = true;
			pDrawingProperty->PositionVRelativeFrom = m_oBufferedStream.ReadByte();
		}
		else if ( c_oSerPosHV::Align == type )
		{
			pDrawingProperty->bPositionVAlign = true;
			pDrawingProperty->PositionVAlign = m_oBufferedStream.ReadByte();
		}
		else if ( c_oSerPosHV::PosOffset == type )
		{
			pDrawingProperty->bPositionVPosOffset = true;
			pDrawingProperty->PositionVPosOffset = m_oBufferedStream.ReadDouble2();
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadSimplePos(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		CDrawingProperty* pDrawingProperty = static_cast<CDrawingProperty*>(poResult);
		if ( c_oSerSimplePos::X == type )
		{
			pDrawingProperty->bSimplePosX = true;
			pDrawingProperty->SimplePosX = m_oBufferedStream.ReadDouble2();
		}
		else if ( c_oSerSimplePos::Y == type )
		{
			pDrawingProperty->bSimplePosY = true;
			pDrawingProperty->SimplePosY = m_oBufferedStream.ReadDouble2();
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadWrapThroughTight(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		if ( c_oSerWrapThroughTight::WrapPolygon == type )
		{
			res = Read2(length, &Binary_DocumentTableReader::ReadWrapPolygon, this, poResult);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadWrapPolygon(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		CDrawingPropertyWrap* pDrawingPropertyWrap = static_cast<CDrawingPropertyWrap*>(poResult);
		if ( c_oSerWrapPolygon::Edited == type )
		{
			pDrawingPropertyWrap->bEdited = true;
			pDrawingPropertyWrap->Edited = m_oBufferedStream.ReadBool();
		}
		else if ( c_oSerWrapPolygon::Start == type )
		{
			pDrawingPropertyWrap->bStart = true;
			res = Read2(length, &Binary_DocumentTableReader::ReadPolygonPoint, this, &pDrawingPropertyWrap->Start);
		}
		else if ( c_oSerWrapPolygon::ALineTo == type )
		{
			res = Read2(length, &Binary_DocumentTableReader::ReadLineTo, this, poResult);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadLineTo(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		CDrawingPropertyWrap* pDrawingPropertyWrap = static_cast<CDrawingPropertyWrap*>(poResult);
		if ( c_oSerWrapPolygon::LineTo == type )
		{
			CDrawingPropertyWrapPoint* pWrapPoint = new CDrawingPropertyWrapPoint();
			res = Read2(length, &Binary_DocumentTableReader::ReadPolygonPoint, this, pWrapPoint);
			pDrawingPropertyWrap->Points.Add(pWrapPoint);
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadPolygonPoint(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadOk;
		CDrawingPropertyWrapPoint* pWrapPoint = static_cast<CDrawingPropertyWrapPoint*>(poResult);
		if ( c_oSerPoint2D::X == type )
		{
			pWrapPoint->bX = true;
			pWrapPoint->X = m_oBufferedStream.ReadDouble2();
		}
		else if ( c_oSerPoint2D::Y == type )
		{
			pWrapPoint->bY = true;
			pWrapPoint->Y = m_oBufferedStream.ReadDouble2();
		}
		else
			res = c_oSerConstants::ReadUnknown;
		return res;
	}
	int ReadEmptyWrap(BYTE type, long length, void* poResult)
	{
		int res = c_oSerConstants::ReadUnknown;
		return res;
	}
};
class Binary_HdrFtrTableReader : public Binary_CommonReader<Binary_HdrFtrTableReader>
{
	Writers::FileWriter& m_oFileWriter;
	Writers::HeaderFooterWriter& m_oHeaderFooterWriter;
	int nCurType;
	int nCurHeaderType;
	int nHeaderCount;
	int nFooterCount;
public:
	Binary_HdrFtrTableReader(Streams::CBufferedStream& poBufferedStream, Writers::FileWriter& oFileWriter):Binary_CommonReader(poBufferedStream),m_oFileWriter(oFileWriter),m_oHeaderFooterWriter(oFileWriter.m_oHeaderFooterWriter)
	{
		nHeaderCount = 0;
		nFooterCount = 0;
	}
    int Read()
    {
		return ReadTable(&Binary_HdrFtrTableReader::ReadHdrFtrContent, this);
    };
    int ReadHdrFtrContent(BYTE type, long length, void* poResult)
    {
		int res = c_oSerConstants::ReadOk;
		if ( c_oSerHdrFtrTypes::Header == type || c_oSerHdrFtrTypes::Footer == type )
        {
			nCurType = type;
			res = Read1(length, &Binary_HdrFtrTableReader::ReadHdrFtrFEO, this, poResult);
        }
        else
			res = c_oSerConstants::ReadUnknown;
        return res;
    };
    int ReadHdrFtrFEO(BYTE type, long length, void* poResult)
    {
		int res = c_oSerConstants::ReadOk;
		if ( c_oSerHdrFtrTypes::HdrFtr_First == type || c_oSerHdrFtrTypes::HdrFtr_Even == type || c_oSerHdrFtrTypes::HdrFtr_Odd == type )
        {
			nCurHeaderType = type;
            res = Read1(length, &Binary_HdrFtrTableReader::ReadHdrFtrItem, this, poResult);
        }
        else
			res = c_oSerConstants::ReadUnknown;
        return res;
    };
    int ReadHdrFtrItem(BYTE type, long length, void* poResult)
    {
		int res = c_oSerConstants::ReadOk;
		if ( c_oSerHdrFtrTypes::HdrFtr_Content == type )
        {
			Writers::HdrFtrItem* poHdrFtrItem = NULL;
			if(nCurType == c_oSerHdrFtrTypes::Header)
			{
				switch(nCurHeaderType)
				{
				case c_oSerHdrFtrTypes::HdrFtr_First:poHdrFtrItem = &m_oHeaderFooterWriter.m_oHeaderFirst;break;
				case c_oSerHdrFtrTypes::HdrFtr_Even:poHdrFtrItem = &m_oHeaderFooterWriter.m_oHeaderEven;break;
				case c_oSerHdrFtrTypes::HdrFtr_Odd:poHdrFtrItem = &m_oHeaderFooterWriter.m_oHeaderOdd;break;
				}
				nHeaderCount++;
				poHdrFtrItem->m_sFilename.Format(_T("header%d.xml"), nHeaderCount);
			}
			else
			{
				switch(nCurHeaderType)
				{
				case c_oSerHdrFtrTypes::HdrFtr_First:poHdrFtrItem = &m_oHeaderFooterWriter.m_oFooterFirst;break;
				case c_oSerHdrFtrTypes::HdrFtr_Even:poHdrFtrItem = &m_oHeaderFooterWriter.m_oFooterEven;break;
				case c_oSerHdrFtrTypes::HdrFtr_Odd:poHdrFtrItem = &m_oHeaderFooterWriter.m_oFooterOdd;break;
				}
				nFooterCount++;
				poHdrFtrItem->m_sFilename.Format(_T("footer%d.xml"), nFooterCount);
			}
			m_oFileWriter.m_pDrawingConverter->SetDstContentRels();
			Binary_DocumentTableReader oBinary_DocumentTableReader(m_oBufferedStream, m_oFileWriter, poHdrFtrItem->Header, NULL);
			res = Read1(length, &Binary_HdrFtrTableReader::ReadHdrFtrItemContent, this, &oBinary_DocumentTableReader);

			if(false == poHdrFtrItem->IsEmpty())
			{
				CString sRelsPath = m_oFileWriter.m_oDocumentWriter.m_sDir + _T("\\word\\_rels\\") + poHdrFtrItem->m_sFilename + _T(".rels");
				BSTR bstrRelsPath = sRelsPath.AllocSysString();
				m_oFileWriter.m_pDrawingConverter->SaveDstContentRels(bstrRelsPath);
				SysFreeString(bstrRelsPath);
			}
            
        }
        else
			res = c_oSerConstants::ReadUnknown;
        return res;
    };
	int ReadHdrFtrItemContent(BYTE type, long length, void* poResult)
    {
		Binary_DocumentTableReader* pBinary_DocumentTableReader = static_cast<Binary_DocumentTableReader*>(poResult);
		return pBinary_DocumentTableReader->ReadDocumentContent(type, length, NULL);
    };
};
class BinaryFileReader
{
private:
	Streams::CBufferedStream& m_oBufferedStream;
	Writers::FileWriter& m_oFileWriter;
	CString m_sFileInDir;
public: BinaryFileReader(CString& sFileInDir, Streams::CBufferedStream& oBufferedStream, Writers::FileWriter& oFileWriter):m_sFileInDir(sFileInDir),m_oBufferedStream(oBufferedStream), m_oFileWriter(oFileWriter)
		{
		}
		int ReadFile()
		{
			return ReadMainTable();
		}
		int ReadMainTable()
		{
			long res = c_oSerConstants::ReadOk;
			
			res = m_oBufferedStream.Peek(1) == FALSE ? c_oSerConstants::ErrorStream : c_oSerConstants::ReadOk;
			if(c_oSerConstants::ReadOk != res)
				return res;
			long nOtherOffset = -1;
			long nStyleOffset = -1;
			long nSettingsOffset = -1;
			long nDocumentOffset = -1;
			long nCommentsOffset = -1;
			CAtlArray<BYTE> aTypes;
			CAtlArray<long> aOffBits;
			BYTE mtLen = m_oBufferedStream.ReadByte();
			for(int i = 0; i < mtLen; ++i)
			{
				
				res = m_oBufferedStream.Peek(5) == FALSE ? c_oSerConstants::ErrorStream : c_oSerConstants::ReadOk;
				if(c_oSerConstants::ReadOk != res)
					return res;
				BYTE mtiType = m_oBufferedStream.ReadByte();
				long mtiOffBits = m_oBufferedStream.ReadLong();

				if(c_oSerTableTypes::Other == mtiType)
				{
					nOtherOffset = mtiOffBits;
				}
				else if(c_oSerTableTypes::Style == mtiType)
				{
					nStyleOffset = mtiOffBits;
				}
				else if(c_oSerTableTypes::Settings == mtiType)
				{
					nSettingsOffset = mtiOffBits;
				}
				else if(c_oSerTableTypes::Document == mtiType)
				{
					nDocumentOffset = mtiOffBits;
				}
				else
				{
					aTypes.Add(mtiType);
					aOffBits.Add(mtiOffBits);
				}
			}
			if(-1 != nOtherOffset)
			{
				int nOldPos = m_oBufferedStream.GetPosition();
				m_oBufferedStream.Seek(nOtherOffset);
				res = Binary_OtherTableReader(m_sFileInDir, m_oBufferedStream, m_oFileWriter).Read();
				if(c_oSerConstants::ReadOk != res)
					return res;
			}
			if(-1 != nSettingsOffset)
			{
				int nOldPos = m_oBufferedStream.GetPosition();
				m_oBufferedStream.Seek(nSettingsOffset);
				res = Binary_SettingsTableReader(m_oBufferedStream, m_oFileWriter).Read();
				if(c_oSerConstants::ReadOk != res)
					return res;
			}
			else
			{
				m_oFileWriter.m_oSettingWriter.AddSetting(_T("<w:defaultTabStop w:val=\"708\"/>"));
				CString sClrMap(_T("<w:clrSchemeMapping w:bg1=\"light1\" w:t1=\"dark1\" w:bg2=\"light2\" w:t2=\"dark2\" w:accent1=\"accent1\" w:accent2=\"accent2\" w:accent3=\"accent3\" w:accent4=\"accent4\" w:accent5=\"accent5\" w:accent6=\"accent6\" w:hyperlink=\"hyperlink\" w:followedHyperlink=\"followedHyperlink\"/>"));
				m_oFileWriter.m_oSettingWriter.AddSetting(sClrMap);
				BSTR bstrClrMap = sClrMap.AllocSysString();
				m_oFileWriter.m_pDrawingConverter->LoadClrMap(bstrClrMap);
				SysFreeString(bstrClrMap);
			}

			BinaryStyleTableReader oBinaryStyleTableReader(m_oBufferedStream, m_oFileWriter);
			if(-1 != nStyleOffset)
			{
				int nOldPos = m_oBufferedStream.GetPosition();
				m_oBufferedStream.Seek(nStyleOffset);
				res = oBinaryStyleTableReader.Read();
				if(c_oSerConstants::ReadOk != res)
					return res;
			}
			Binary_CommentsTableReader oBinary_CommentsTableReader(m_oBufferedStream, m_oFileWriter);
			for(int i = 0, length = aTypes.GetCount(); i < length; ++i)
			{
				BYTE mtiType = aTypes[i];
				long mtiOffBits = aOffBits[i];

				m_oBufferedStream.Seek(mtiOffBits);
				switch(mtiType)
				{
					
					
				
				
				
				
				
				
				case c_oSerTableTypes::HdrFtr:
					res = Binary_HdrFtrTableReader(m_oBufferedStream, m_oFileWriter).Read();
					break;
				case c_oSerTableTypes::Numbering:
					res = Binary_NumberingTableReader(m_oBufferedStream, m_oFileWriter).Read();
					break;
				
				case c_oSerTableTypes::Comments:
					res = oBinary_CommentsTableReader.Read();
					break;
					
					
					
				}
				if(c_oSerConstants::ReadOk != res)
					return res;
			}
			if(-1 != nDocumentOffset)
			{
				m_oBufferedStream.Seek(nDocumentOffset);

				m_oFileWriter.m_pDrawingConverter->SetDstContentRels();
				long stamdartRId;
				m_oFileWriter.m_pDrawingConverter->WriteRels(_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles"), _T("styles.xml"), NULL, &stamdartRId);
				m_oFileWriter.m_pDrawingConverter->WriteRels(_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings"), _T("settings.xml"), NULL, &stamdartRId);
				m_oFileWriter.m_pDrawingConverter->WriteRels(_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/webSettings"), _T("webSettings.xml"), NULL, &stamdartRId);
				m_oFileWriter.m_pDrawingConverter->WriteRels(_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/fontTable"), _T("fontTable.xml"), NULL, &stamdartRId);
				m_oFileWriter.m_pDrawingConverter->WriteRels(_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme"), _T("theme/theme1.xml"), NULL, &stamdartRId);
				if(false == m_oFileWriter.m_oNumberingWriter.IsEmpty())
				{
					long rId;
					m_oFileWriter.m_pDrawingConverter->WriteRels(_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering"), _T("numbering.xml"), NULL, &rId);
				}
				if(false == m_oFileWriter.m_oHeaderFooterWriter.m_oHeaderFirst.IsEmpty())
				{
					long rId;
					BSTR bstrFilename = m_oFileWriter.m_oHeaderFooterWriter.m_oHeaderFirst.m_sFilename.AllocSysString();
					m_oFileWriter.m_pDrawingConverter->WriteRels(_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/header"), bstrFilename, NULL, &rId);
					SysFreeString(bstrFilename);
					m_oFileWriter.m_oHeaderFooterWriter.m_oHeaderFirst.rId.Format(_T("rId%d"), rId);
				}
				if(false == m_oFileWriter.m_oHeaderFooterWriter.m_oHeaderEven.IsEmpty())
				{
					long rId;
					BSTR bstrFilename = m_oFileWriter.m_oHeaderFooterWriter.m_oHeaderEven.m_sFilename.AllocSysString();
					m_oFileWriter.m_pDrawingConverter->WriteRels(_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/header"), bstrFilename, NULL, &rId);
					SysFreeString(bstrFilename);
					m_oFileWriter.m_oHeaderFooterWriter.m_oHeaderEven.rId.Format(_T("rId%d"), rId);
				}
				if(false == m_oFileWriter.m_oHeaderFooterWriter.m_oHeaderOdd.IsEmpty())
				{
					long rId;
					BSTR bstrFilename = m_oFileWriter.m_oHeaderFooterWriter.m_oHeaderOdd.m_sFilename.AllocSysString();
					m_oFileWriter.m_pDrawingConverter->WriteRels(_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/header"), bstrFilename, NULL, &rId);
					SysFreeString(bstrFilename);
					m_oFileWriter.m_oHeaderFooterWriter.m_oHeaderOdd.rId.Format(_T("rId%d"), rId);
				}
				if(false == m_oFileWriter.m_oHeaderFooterWriter.m_oFooterFirst.IsEmpty())
				{
					long rId;
					BSTR bstrFilename = m_oFileWriter.m_oHeaderFooterWriter.m_oFooterFirst.m_sFilename.AllocSysString();
					m_oFileWriter.m_pDrawingConverter->WriteRels(_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer"), bstrFilename, NULL, &rId);
					SysFreeString(bstrFilename);
					m_oFileWriter.m_oHeaderFooterWriter.m_oFooterFirst.rId.Format(_T("rId%d"), rId);
				}
				if(false == m_oFileWriter.m_oHeaderFooterWriter.m_oFooterEven.IsEmpty())
				{
					long rId;
					BSTR bstrFilename = m_oFileWriter.m_oHeaderFooterWriter.m_oFooterEven.m_sFilename.AllocSysString();
					m_oFileWriter.m_pDrawingConverter->WriteRels(_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer"), bstrFilename, NULL, &rId);
					SysFreeString(bstrFilename);
					m_oFileWriter.m_oHeaderFooterWriter.m_oFooterEven.rId.Format(_T("rId%d"), rId);
				}
				if(false == m_oFileWriter.m_oHeaderFooterWriter.m_oFooterOdd.IsEmpty())
				{
					long rId;
					BSTR bstrFilename = m_oFileWriter.m_oHeaderFooterWriter.m_oFooterOdd.m_sFilename.AllocSysString();
					m_oFileWriter.m_pDrawingConverter->WriteRels(_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer"), bstrFilename, NULL, &rId);
					SysFreeString(bstrFilename);
					m_oFileWriter.m_oHeaderFooterWriter.m_oFooterOdd.rId.Format(_T("rId%d"), rId);
				}
				res = Binary_DocumentTableReader(m_oBufferedStream, m_oFileWriter, m_oFileWriter.m_oDocumentWriter, &oBinary_CommentsTableReader.m_oComments).Read();
				CString sRelsPath = m_oFileWriter.m_oDocumentWriter.m_sDir + _T("\\word\\_rels\\document.xml.rels");

				CComments& oComments = oBinary_CommentsTableReader.m_oComments;
				Writers::CommentsWriter& oCommentsWriter = m_oFileWriter.m_oCommentsWriter;
				CString sContent = oComments.writeContent();
				CString sContentEx = oComments.writeContentExt();
				CString sPeople = oComments.writePeople();
				oCommentsWriter.setElements(sContent, sContentEx, sPeople);
				if(false == oCommentsWriter.m_sComment.IsEmpty())
				{
					long rId;
					m_oFileWriter.m_pDrawingConverter->WriteRels(_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/comments"), _T("comments.xml"), NULL, &rId);
				}
				if(false == oCommentsWriter.m_sCommentExt.IsEmpty())
				{
					long rId;
					m_oFileWriter.m_pDrawingConverter->WriteRels(_T("http://schemas.microsoft.com/office/2011/relationships/commentsExtended"), _T("commentsExtended.xml"), NULL, &rId);
				}
				if(false == oCommentsWriter.m_sPeople.IsEmpty())
				{
					long rId;
					m_oFileWriter.m_pDrawingConverter->WriteRels(_T("http://schemas.microsoft.com/office/2011/relationships/people"), _T("people.xml"), NULL, &rId);
				}

				BSTR bstrRelsPath = sRelsPath.AllocSysString();
				m_oFileWriter.m_pDrawingConverter->SaveDstContentRels(bstrRelsPath);
				SysFreeString(bstrRelsPath);
				if(c_oSerConstants::ReadOk != res)
					return res;
			}
			return res;
		}
};