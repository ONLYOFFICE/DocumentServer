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
#include "StreamUtils.h"
#include "BinReaderWriterDefines.h"
#include "../DocWrapper/FontProcessor.h"
#include "../../Common/Base64.h"
#include "../../ASCOfficePPTXFile/Editor/FontCutter.h"
#include "../../XlsxSerializerCom/Reader/BinaryWriter.h"

namespace BinDocxRW
{
	class FldStruct{
	protected:
		int m_nType;
	public:
		CString m_sFld;
	public: FldStruct(CString sFld, int nType):m_sFld(sFld),m_nType(nType){}
	public: int GetType()
			{
				return m_nType;
			}
	};
	class BinaryCommonWriter
	{
	public: 
		NSFontCutter::CEmbeddedFontsManager* m_pEmbeddedFontsManager;
		Streams::CBufferedStream &m_oStream;
		BinaryCommonWriter(Streams::CBufferedStream &oCBufferedStream, NSFontCutter::CEmbeddedFontsManager* pEmbeddedFontsManager):m_oStream(oCBufferedStream),m_pEmbeddedFontsManager(pEmbeddedFontsManager)
		{
		}
		int WriteItemStart(BYTE type)
		{
			
			m_oStream.WriteByte(type);
			return WriteItemWithLengthStart();
		}
		void WriteItemEnd(int nStart)
		{
			WriteItemWithLengthEnd(nStart);
		}
		int WriteItemWithLengthStart()
		{
			
			int nStartPos = m_oStream.GetPosition();
			m_oStream.Skip(4);	
			return nStartPos;
		}
		void WriteItemWithLengthEnd(int nStart)
		{
			
			int nEnd = m_oStream.GetPosition();
			m_oStream.Seek(nStart);
			m_oStream.WriteLong(nEnd - nStart - 4);
			m_oStream.Seek(nEnd);
		}
		void WriteBorder(const ComplexTypes::Word::CBorder& border)
		{
			if(border.m_oVal.IsInit())
			{
				const SimpleTypes::EBorder& borderVal = border.m_oVal.get().GetValue();
				if(SimpleTypes::bordervalueNone != borderVal && SimpleTypes::bordervalueNil != borderVal)
				{
					if(border.m_oColor.IsInit())
						WriteColor(c_oSerBorderType::Color, border.m_oColor.get());
					if(border.m_oSpace.IsInit())
					{
						m_oStream.WriteByte(c_oSerBorderType::Space);
						m_oStream.WriteByte(c_oSerPropLenType::Double);
						m_oStream.WriteDouble2(border.m_oSpace->ToMM());
					}
					if(border.m_oSz.IsInit())
					{
						m_oStream.WriteByte(c_oSerBorderType::Size);
						m_oStream.WriteByte(c_oSerPropLenType::Double);
						m_oStream.WriteDouble2(border.m_oSz->ToMM());
					}
				}
				
				m_oStream.WriteByte(c_oSerBorderType::Value);
				m_oStream.WriteByte(c_oSerPropLenType::Byte);
				switch(borderVal)
				{
				case SimpleTypes::bordervalueNone:
				case SimpleTypes::bordervalueNil:m_oStream.WriteByte(border_None);break;
				default:m_oStream.WriteByte(border_Single);break;
				}

			}
		};
		void WriteTblBorders(const OOX::Logic::CTblBorders& Borders)
		{
			int nCurPos = 0;
			
			if(Borders.m_oStart.IsInit())
			{
				nCurPos = WriteItemStart(c_oSerBordersType::left);
				WriteBorder(Borders.m_oStart.get());
				WriteItemEnd(nCurPos);
			}
			
			if(Borders.m_oTop.IsInit())
			{
				nCurPos = WriteItemStart(c_oSerBordersType::top);
				WriteBorder(Borders.m_oTop.get());
				WriteItemEnd(nCurPos);
			}
			
			if(Borders.m_oEnd.IsInit())
			{
				nCurPos = WriteItemStart(c_oSerBordersType::right);
				WriteBorder(Borders.m_oEnd.get());
				WriteItemEnd(nCurPos);
			}
			
			if(Borders.m_oBottom.IsInit())
			{
				nCurPos = WriteItemStart(c_oSerBordersType::bottom);
				WriteBorder(Borders.m_oBottom.get());
				WriteItemEnd(nCurPos);
			}
			
			if(Borders.m_oInsideV.IsInit())
			{
				nCurPos = WriteItemStart(c_oSerBordersType::insideV);
				WriteBorder(Borders.m_oInsideV.get());
				WriteItemEnd(nCurPos);
			}
			
			if(Borders.m_oInsideH.IsInit())
			{
				nCurPos = WriteItemStart(c_oSerBordersType::insideH);
				WriteBorder(Borders.m_oInsideH.get());
				WriteItemEnd(nCurPos);
			}
		};
		void WriteTcBorders(const OOX::Logic::CTcBorders& Borders)
		{
			int nCurPos = 0;
			
			if(Borders.m_oStart.IsInit())
			{
				nCurPos = WriteItemStart(c_oSerBordersType::left);
				WriteBorder(Borders.m_oStart.get());
				WriteItemEnd(nCurPos);
			}
			
			if(Borders.m_oTop.IsInit())
			{
				nCurPos = WriteItemStart(c_oSerBordersType::top);
				WriteBorder(Borders.m_oTop.get());
				WriteItemEnd(nCurPos);
			}
			
			if(Borders.m_oEnd.IsInit())
			{
				nCurPos = WriteItemStart(c_oSerBordersType::right);
				WriteBorder(Borders.m_oEnd.get());
				WriteItemEnd(nCurPos);
			}
			
			if(Borders.m_oBottom.IsInit())
			{
				nCurPos = WriteItemStart(c_oSerBordersType::bottom);
				WriteBorder(Borders.m_oBottom.get());
				WriteItemEnd(nCurPos);
			}
			
			if(Borders.m_oInsideV.IsInit())
			{
				nCurPos = WriteItemStart(c_oSerBordersType::insideV);
				WriteBorder(Borders.m_oInsideV.get());
				WriteItemEnd(nCurPos);
			}
			
			if(Borders.m_oInsideH.IsInit())
			{
				nCurPos = WriteItemStart(c_oSerBordersType::insideH);
				WriteBorder(Borders.m_oInsideH.get());
				WriteItemEnd(nCurPos);
			}
		};
		void WritePBorders(const OOX::Logic::CPBdr& Borders)
		{
			int nCurPos = 0;
			
			if(Borders.m_oLeft.IsInit())
			{
				nCurPos = WriteItemStart(c_oSerBordersType::left);
				WriteBorder(Borders.m_oLeft.get());
				WriteItemEnd(nCurPos);
			}
			
			if(Borders.m_oTop.IsInit())
			{
				nCurPos = WriteItemStart(c_oSerBordersType::top);
				WriteBorder(Borders.m_oTop.get());
				WriteItemEnd(nCurPos);
			}
			
			if(Borders.m_oRight.IsInit())
			{
				nCurPos = WriteItemStart(c_oSerBordersType::right);
				WriteBorder(Borders.m_oRight.get());
				WriteItemEnd(nCurPos);
			}
			
			if(Borders.m_oBottom.IsInit())
			{
				nCurPos = WriteItemStart(c_oSerBordersType::bottom);
				WriteBorder(Borders.m_oBottom.get());
				WriteItemEnd(nCurPos);
			}
			
			if(Borders.m_oBetween.IsInit())
			{
				nCurPos = WriteItemStart(c_oSerBordersType::between);
				WriteBorder(Borders.m_oBetween.get());
				WriteItemEnd(nCurPos);
			}
		};
		void WriteColor(BYTE type, const SimpleTypes::CHexColor<>& color)
		{
			if(SimpleTypes::hexcolorRGB == color.GetValue())
			{
				m_oStream.WriteByte(type);
				m_oStream.WriteByte(c_oSerPropLenType::Three);
				m_oStream.WriteByte(color.Get_R());
				m_oStream.WriteByte(color.Get_G());
				m_oStream.WriteByte(color.Get_B());
			}
			else if(SimpleTypes::hexcolorAuto == color.GetValue())
			{
				m_oStream.WriteByte(type);
				m_oStream.WriteByte(c_oSerPropLenType::Three);
				m_oStream.WriteByte(0);
				m_oStream.WriteByte(0);
				m_oStream.WriteByte(0);
			}
		};
		void WriteShd(const ComplexTypes::Word::CShading& Shd)
		{
			if(Shd.m_oFill.IsInit() && SimpleTypes::hexcolorRGB == Shd.m_oFill->GetValue())
			{
				
				if(false != Shd.m_oVal.IsInit())
				{
					m_oStream.WriteByte(c_oSerShdType::Value);
					m_oStream.WriteByte(c_oSerPropLenType::Byte);
					switch(Shd.m_oVal.get().GetValue())
					{
					case SimpleTypes::shdNil: m_oStream.WriteByte(shd_Nil);break;
					default: m_oStream.WriteByte(shd_Clear);break;
					}
				}
				
				if(false != Shd.m_oFill.IsInit())
				{
					
					WriteColor(c_oSerShdType::Color, Shd.m_oFill.get());
				}
			}
		};
		void WriteDistance(const NSCommon::nullable<SimpleTypes::CWrapDistance<>>& m_oDistL,
			const NSCommon::nullable<SimpleTypes::CWrapDistance<>>& m_oDistT,
			const NSCommon::nullable<SimpleTypes::CWrapDistance<>>& m_oDistR,
			const NSCommon::nullable<SimpleTypes::CWrapDistance<>>& m_oDistB)
		{
			
			if(false != m_oDistL.IsInit())
			{
				m_oStream.WriteByte(c_oSerPaddingType::left);
				m_oStream.WriteByte(c_oSerPropLenType::Double);
				m_oStream.WriteDouble2(m_oDistL.get().ToMM());
			}
			
			if(false != m_oDistT.IsInit())
			{
				m_oStream.WriteByte(c_oSerPaddingType::top);
				m_oStream.WriteByte(c_oSerPropLenType::Double);
				m_oStream.WriteDouble2(m_oDistT.get().ToMM());
			}
			
			if(false != m_oDistR.IsInit())
			{
				m_oStream.WriteByte(c_oSerPaddingType::right);
				m_oStream.WriteByte(c_oSerPropLenType::Double);
				m_oStream.WriteDouble2(m_oDistR.get().ToMM());
			}
			
			if(false != m_oDistB.IsInit())
			{
				m_oStream.WriteByte(c_oSerPaddingType::bottom);
				m_oStream.WriteByte(c_oSerPropLenType::Double);
				m_oStream.WriteDouble2(m_oDistB.get().ToMM());
			}
		};
		void WritePaddings(const nullable<SimpleTypes::CTwipsMeasure>& left, const nullable<SimpleTypes::CTwipsMeasure>& top,
			const nullable<SimpleTypes::CTwipsMeasure>& right, const nullable<SimpleTypes::CTwipsMeasure>& bottom)
		{
			
			if(left.IsInit())
			{
				m_oStream.WriteByte(c_oSerPaddingType::left);
				m_oStream.WriteByte(c_oSerPropLenType::Double);
				m_oStream.WriteDouble2(left.get().ToMm());
			}
			
			if(top.IsInit())
			{
				m_oStream.WriteByte(c_oSerPaddingType::top);
				m_oStream.WriteByte(c_oSerPropLenType::Double);
				m_oStream.WriteDouble2(top.get().ToMm());
			}
			
			if(right.IsInit())
			{
				m_oStream.WriteByte(c_oSerPaddingType::right);
				m_oStream.WriteByte(c_oSerPropLenType::Double);
				m_oStream.WriteDouble2(right.get().ToMm());
			}
			
			if(bottom.IsInit())
			{
				m_oStream.WriteByte(c_oSerPaddingType::bottom);
				m_oStream.WriteByte(c_oSerPropLenType::Double);
				m_oStream.WriteDouble2(bottom.get().ToMm());
			}
		};
		void WriteFont(CString& sFontName, BYTE bType, DocWrapper::FontProcessor& m_oFontProcessor)
		{
			if(!sFontName.IsEmpty())
			{
				
				sFontName = m_oFontProcessor.getFont(sFontName);
				if(NULL != m_pEmbeddedFontsManager)
					m_pEmbeddedFontsManager->CheckFont(sFontName, m_oFontProcessor.getFontManager());

				m_oStream.WriteByte(bType);
				m_oStream.WriteByte(c_oSerPropLenType::Variable);
				m_oStream.WriteString2(sFontName);
			}
		};
		void WriteSafeArray(SAFEARRAY* pBinaryObj)
		{
			int nCurPos = WriteItemWithLengthStart();
			m_oStream.WritePointer((BYTE *)pBinaryObj->pvData, pBinaryObj->rgsabound[0].cElements);
			WriteItemWithLengthEnd(nCurPos);
		}
	};

	class BinarySigTableWriter
	{
		BinaryCommonWriter m_oBcw;
	public:
		BinarySigTableWriter(Streams::CBufferedStream &oCBufferedStream, NSFontCutter::CEmbeddedFontsManager* pEmbeddedFontsManager):m_oBcw(oCBufferedStream, pEmbeddedFontsManager)
		{
		}
		void Write()
		{
			
			m_oBcw.m_oStream.WriteByte(c_oSerSigTypes::Version);
			m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Long);
			m_oBcw.m_oStream.WriteLong(g_nFormatVersion);
		}
	};
	class Binary_rPrWriter
	{
		BinaryCommonWriter m_oBcw;
	public:
		OOX::CTheme* m_poTheme;
	public:
		DocWrapper::FontProcessor& m_oFontProcessor;
	public: Binary_rPrWriter(Streams::CBufferedStream &oCBufferedStream, NSFontCutter::CEmbeddedFontsManager* pEmbeddedFontsManager, OOX::CTheme* poTheme, DocWrapper::FontProcessor& oFontProcessor):m_oBcw(oCBufferedStream, pEmbeddedFontsManager),m_poTheme(poTheme),m_oFontProcessor(oFontProcessor)
			{
			}
			void Write_rPr(const OOX::Logic::CRunProperty& rPr)
			{
				
				if(false != rPr.m_oBold.IsInit())
				{
					bool bold = SimpleTypes::onoffTrue == rPr.m_oBold.get().m_oVal.GetValue();
					m_oBcw.m_oStream.WriteByte(c_oSerProp_rPrType::Bold);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
					m_oBcw.m_oStream.WriteBool(bold);
				}
				
				if(false != rPr.m_oItalic.IsInit())
				{
					bool italic = SimpleTypes::onoffTrue == rPr.m_oItalic.get().m_oVal.GetValue();
					m_oBcw.m_oStream.WriteByte(c_oSerProp_rPrType::Italic);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
					m_oBcw.m_oStream.WriteBool(italic);
				}
				
				if(false != rPr.m_oU.IsInit())
				{
					const ComplexTypes::Word::CUnderline& oU = rPr.m_oU.get();
					if(oU.m_oVal.IsInit())
					{
						m_oBcw.m_oStream.WriteByte(c_oSerProp_rPrType::Underline);
						m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
						m_oBcw.m_oStream.WriteBool(SimpleTypes::underlineNone != oU.m_oVal.get().GetValue());
					}
				}
				
				if(false != rPr.m_oStrike.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerProp_rPrType::Strikeout);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
					m_oBcw.m_oStream.WriteBool(SimpleTypes::onoffTrue == rPr.m_oStrike.get().m_oVal.GetValue());
				}
				
				if(false != rPr.m_oRFonts.IsInit())
				{
					CString sFontAscii;
					CString sFontHAnsi;
					CString sFontAE;
					CString sFontCS;
					const ComplexTypes::Word::CFonts& oFont = rPr.m_oRFonts.get();
					if(NULL != m_poTheme && oFont.m_oAsciiTheme.IsInit())
					{
						const SimpleTypes::ETheme& eTheme = oFont.m_oAsciiTheme.get().GetValue();
						switch(eTheme)
						{
						case SimpleTypes::themeMajorAscii:
						case SimpleTypes::themeMajorBidi:
						case SimpleTypes::themeMajorEastAsia:
						case SimpleTypes::themeMajorHAnsi:sFontAscii = m_poTheme->GetMajorFont();break;
						case SimpleTypes::themeMinorAscii:
						case SimpleTypes::themeMinorBidi:
						case SimpleTypes::themeMinorEastAsia:
						case SimpleTypes::themeMinorHAnsi:sFontAscii = m_poTheme->GetMinorFont();break;
						}
					}
					else if(oFont.m_sAscii.IsInit())
							sFontAscii = oFont.m_sAscii.get();

					if(NULL != m_poTheme && oFont.m_oHAnsiTheme.IsInit())
					{
						const SimpleTypes::ETheme& eTheme = oFont.m_oHAnsiTheme.get().GetValue();
						switch(eTheme)
						{
						case SimpleTypes::themeMajorAscii:
						case SimpleTypes::themeMajorBidi:
						case SimpleTypes::themeMajorEastAsia:
						case SimpleTypes::themeMajorHAnsi:sFontHAnsi = m_poTheme->GetMajorFont();break;
						case SimpleTypes::themeMinorAscii:
						case SimpleTypes::themeMinorBidi:
						case SimpleTypes::themeMinorEastAsia:
						case SimpleTypes::themeMinorHAnsi:sFontHAnsi = m_poTheme->GetMinorFont();break;
						}
					}
					else if(oFont.m_sHAnsi.IsInit())
						sFontHAnsi = oFont.m_sHAnsi.get();
					if(NULL != m_poTheme && oFont.m_oCsTheme.IsInit())
					{
						const SimpleTypes::ETheme& eTheme = oFont.m_oCsTheme.get().GetValue();
						switch(eTheme)
						{
						case SimpleTypes::themeMajorAscii:
						case SimpleTypes::themeMajorBidi:
						case SimpleTypes::themeMajorEastAsia:
						case SimpleTypes::themeMajorHAnsi:sFontCS = m_poTheme->GetMajorFont();break;
						case SimpleTypes::themeMinorAscii:
						case SimpleTypes::themeMinorBidi:
						case SimpleTypes::themeMinorEastAsia:
						case SimpleTypes::themeMinorHAnsi:sFontCS = m_poTheme->GetMinorFont();break;
						}
					}
					else if(oFont.m_sCs.IsInit())
						sFontCS = oFont.m_sCs.get();
					if(NULL != m_poTheme && oFont.m_oEastAsiaTheme.IsInit())
					{
						const SimpleTypes::ETheme& eTheme = oFont.m_oEastAsiaTheme.get().GetValue();
						switch(eTheme)
						{
						case SimpleTypes::themeMajorAscii:
						case SimpleTypes::themeMajorBidi:
						case SimpleTypes::themeMajorEastAsia:
						case SimpleTypes::themeMajorHAnsi:sFontAE = m_poTheme->GetMajorFont();break;
						case SimpleTypes::themeMinorAscii:
						case SimpleTypes::themeMinorBidi:
						case SimpleTypes::themeMinorEastAsia:
						case SimpleTypes::themeMinorHAnsi:sFontAE = m_poTheme->GetMinorFont();break;
						}
					}
					else if(oFont.m_sEastAsia.IsInit())
						sFontAE = oFont.m_sEastAsia.get();
					m_oBcw.WriteFont(sFontAscii, c_oSerProp_rPrType::FontAscii, m_oFontProcessor);
					m_oBcw.WriteFont(sFontHAnsi, c_oSerProp_rPrType::FontHAnsi, m_oFontProcessor);
					m_oBcw.WriteFont(sFontAE, c_oSerProp_rPrType::FontAE, m_oFontProcessor);
					m_oBcw.WriteFont(sFontCS, c_oSerProp_rPrType::FontCS, m_oFontProcessor);

					
					if(false != oFont.m_oHint.IsInit())
					{
						m_oBcw.m_oStream.WriteByte(c_oSerProp_rPrType::FontHint);
						m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
						m_oBcw.m_oStream.WriteByte((BYTE)oFont.m_oHint->GetValue());
					}
				}
				
				if(false != rPr.m_oSz.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerProp_rPrType::FontSize);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Long);
					m_oBcw.m_oStream.WriteLong(rPr.m_oSz.get().m_oVal.get().ToHps());
				}
				
				if(false != rPr.m_oColor.IsInit())
				{
					m_oBcw.WriteColor(c_oSerProp_rPrType::Color, rPr.m_oColor.get().m_oVal.get());
				}
				
				if(false != rPr.m_oVertAlign.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerProp_rPrType::VertAlign);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
					switch(rPr.m_oVertAlign.get().m_oVal.get().GetValue())
					{
					case SimpleTypes::verticalalignrunSuperscript: m_oBcw.m_oStream.WriteByte(vertalign_SuperScript);break;
					case SimpleTypes::verticalalignrunSubscript: m_oBcw.m_oStream.WriteByte(vertalign_SubScript);break;
					default: m_oBcw.m_oStream.WriteByte(vertalign_Baseline);break;
					}
				}
				
				if(false != rPr.m_oHighlight.IsInit() || false != rPr.m_oShd.IsInit())
				{
					
					bool bHighLightNone = false;
					bool bHighLightColor = false;
					bool bShdNone = false;
					bool bShdColor = false;
					if(false != rPr.m_oHighlight.IsInit())
					{
						const ComplexTypes::Word::CHighlight& oHighlight = rPr.m_oHighlight.get();
						if(oHighlight.m_oVal.IsInit())
						{
							const SimpleTypes::CHighlightColor<>& oHighlightVal = oHighlight.m_oVal.get();
							if(SimpleTypes::highlightcolorNone == oHighlightVal.GetValue())
							{
								bHighLightNone = true;
							}
							else
							{
								bHighLightColor = true;
								SimpleTypes::CHexColor<> oHexColor(oHighlightVal.Get_R(), oHighlightVal.Get_G(), oHighlightVal.Get_B());
								m_oBcw.WriteColor(c_oSerProp_rPrType::HighLight, oHexColor);
							}
						}
					}
					if(false == bHighLightColor && false != rPr.m_oShd.IsInit())
					{
						if(rPr.m_oShd->m_oVal.IsInit())
						{
							const ComplexTypes::Word::CShading& oShd = rPr.m_oShd.get();
							if( SimpleTypes::shdNil == oShd.m_oVal->GetValue())
							{
								bShdNone = true;
							}
							else if(oShd.m_oFill.IsInit() && SimpleTypes::hexcolorRGB == oShd.m_oFill->GetValue())
							{
								bShdColor = true;
								const SimpleTypes::CHexColor<>& oFill = oShd.m_oFill.get();
								SimpleTypes::CHexColor<> oHexColor(oFill.Get_R(), oFill.Get_G(), oFill.Get_B());
								m_oBcw.WriteColor(c_oSerProp_rPrType::HighLight, oHexColor);
							}
						}
					}
					if(false == bHighLightColor && false == bShdColor && ( true == bHighLightNone || true == bShdNone))
					{
						m_oBcw.m_oStream.WriteByte(c_oSerProp_rPrType::HighLightTyped);
						m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
						m_oBcw.m_oStream.WriteByte(c_oSer_ColorType::None);
					}
				}
				
				if(false != rPr.m_oRStyle.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerProp_rPrType::RStyle);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);
					m_oBcw.m_oStream.WriteString2(rPr.m_oRStyle->ToString2());
				}
				
				if(false != rPr.m_oSpacing.IsInit() && false != rPr.m_oSpacing->m_oVal.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerProp_rPrType::Spacing);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
					m_oBcw.m_oStream.WriteDouble2(rPr.m_oSpacing->m_oVal->ToMm());
				}
				
				if(false != rPr.m_oDStrike.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerProp_rPrType::DStrikeout);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
					m_oBcw.m_oStream.WriteBool(rPr.m_oDStrike->m_oVal.ToBool());
				}
				
				if(false != rPr.m_oCaps.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerProp_rPrType::Caps);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
					m_oBcw.m_oStream.WriteBool(rPr.m_oCaps->m_oVal.ToBool());
				}
				
				if(false != rPr.m_oSmallCaps.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerProp_rPrType::SmallCaps);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
					m_oBcw.m_oStream.WriteBool(rPr.m_oSmallCaps->m_oVal.ToBool());
				}
				
				if(false != rPr.m_oPosition.IsInit() && false != rPr.m_oPosition->m_oVal.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerProp_rPrType::Position);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
					m_oBcw.m_oStream.WriteDouble2(rPr.m_oPosition->m_oVal->ToMm());
				}
				
				if(rPr.m_oBoldCs.IsInit())
				{
					bool boldCs = SimpleTypes::onoffTrue == rPr.m_oBoldCs.get().m_oVal.GetValue();
					m_oBcw.m_oStream.WriteByte(c_oSerProp_rPrType::BoldCs);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
					m_oBcw.m_oStream.WriteBool(boldCs);
				}
				
				if(rPr.m_oItalicCs.IsInit())
				{
					bool italicCs = SimpleTypes::onoffTrue == rPr.m_oItalicCs.get().m_oVal.GetValue();
					m_oBcw.m_oStream.WriteByte(c_oSerProp_rPrType::ItalicCs);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
					m_oBcw.m_oStream.WriteBool(italicCs);
				}
				
				if(rPr.m_oSzCs.IsInit() && rPr.m_oSzCs->m_oVal.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerProp_rPrType::FontSizeCs);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Long);
					m_oBcw.m_oStream.WriteLong(rPr.m_oSzCs.get().m_oVal.get().ToHps());
				}
				
				if(false != rPr.m_oCs.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerProp_rPrType::Cs);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
					m_oBcw.m_oStream.WriteBool(rPr.m_oCs->m_oVal.ToBool());
				}
				
				if(false != rPr.m_oRtL.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerProp_rPrType::Rtl);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
					m_oBcw.m_oStream.WriteBool(rPr.m_oRtL->m_oVal.ToBool());
				}
				
				if(false != rPr.m_oLang.IsInit())
				{
					if(rPr.m_oLang->m_oVal.IsInit())
					{
						m_oBcw.m_oStream.WriteByte(c_oSerProp_rPrType::Lang);
						m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);
						m_oBcw.m_oStream.WriteString2(rPr.m_oLang->m_oVal->GetValue());
					}
					if(rPr.m_oLang->m_oBidi.IsInit())
					{
						m_oBcw.m_oStream.WriteByte(c_oSerProp_rPrType::LangBidi);
						m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);
						m_oBcw.m_oStream.WriteString2(rPr.m_oLang->m_oBidi->GetValue());
					}
					if(rPr.m_oLang->m_oEastAsia.IsInit())
					{
						m_oBcw.m_oStream.WriteByte(c_oSerProp_rPrType::LangEA);
						m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);
						m_oBcw.m_oStream.WriteString2(rPr.m_oLang->m_oEastAsia->GetValue());
					}
				}
			};
	};
	class Binary_pPrWriter
	{
		BinaryCommonWriter m_oBcw;
		Binary_rPrWriter brPrs; 
	public: Binary_pPrWriter(Streams::CBufferedStream &oCBufferedStream, NSFontCutter::CEmbeddedFontsManager* pEmbeddedFontsManager, OOX::CTheme* poTheme, DocWrapper::FontProcessor& oFontProcessor):m_oBcw(oCBufferedStream, pEmbeddedFontsManager),brPrs(oCBufferedStream, pEmbeddedFontsManager, poTheme, oFontProcessor)
			{
			}
			void Write_pPr(const OOX::Logic::CParagraphProperty& pPr)
			{
				int nCurPos = 0;
				
				
				CString sStyleId;
				if(false != pPr.m_oPStyle.IsInit())
				{
					sStyleId = pPr.m_oPStyle.get().ToString2();
					m_oBcw.m_oStream.WriteByte(c_oSerProp_pPrType::ParaStyle);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);
					m_oBcw.m_oStream.WriteString2(sStyleId);
				}
				OOX::Logic::CParagraphProperty pCurPr = pPr;
				
				
				
				OOX::Logic::CNumPr oCurNumPr;
				if(pCurPr.m_oNumPr.IsInit())
					oCurNumPr = pCurPr.m_oNumPr.get();
				if(oCurNumPr.m_oNumID.IsInit() || oCurNumPr.m_oIlvl.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerProp_pPrType::numPr);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);
					nCurPos = m_oBcw.WriteItemWithLengthStart();
					WriteNumPr(oCurNumPr, pPr);
					m_oBcw.WriteItemWithLengthEnd(nCurPos);
				}
				
				if(false != pCurPr.m_oContextualSpacing.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerProp_pPrType::ContextualSpacing);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
					m_oBcw.m_oStream.WriteBool(SimpleTypes::onoffTrue == pCurPr.m_oContextualSpacing.get().m_oVal.GetValue());
				}
				
				if(false != pCurPr.m_oInd.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerProp_pPrType::Ind);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);
					nCurPos = m_oBcw.WriteItemWithLengthStart();
					WriteInd(pCurPr.m_oInd.get());
					m_oBcw.WriteItemWithLengthEnd(nCurPos);
				}
				
				if(false != pCurPr.m_oJc.IsInit())
				{
					const ComplexTypes::Word::CJc& oJc = pCurPr.m_oJc.get();
					if(oJc.m_oVal.IsInit())
					{
						const SimpleTypes::CJc<>& oEJc = oJc.m_oVal.get();
						m_oBcw.m_oStream.WriteByte(c_oSerProp_pPrType::Jc);
						m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
						switch(oEJc.GetValue())
						{
						case SimpleTypes::jcCenter: m_oBcw.m_oStream.WriteByte(align_Center);break;
						case SimpleTypes::jcStart:
						case SimpleTypes::jcLeft: m_oBcw.m_oStream.WriteByte(align_Left);break;
						case SimpleTypes::jcEnd:
						case SimpleTypes::jcRight: m_oBcw.m_oStream.WriteByte(align_Right);break;
						case SimpleTypes::jcBoth:
						case SimpleTypes::jcThaiDistribute:
						case SimpleTypes::jcDistribute: m_oBcw.m_oStream.WriteByte(align_Justify);break;
						default: m_oBcw.m_oStream.WriteByte(align_Left);break;
						}
					}
				}
				
				if(false != pCurPr.m_oKeepLines.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerProp_pPrType::KeepLines);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
					m_oBcw.m_oStream.WriteBool(SimpleTypes::onoffTrue == pCurPr.m_oKeepLines.get().m_oVal.GetValue());
				}
				
				if(false != pCurPr.m_oKeepNext.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerProp_pPrType::KeepNext);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
					m_oBcw.m_oStream.WriteBool(SimpleTypes::onoffTrue == pCurPr.m_oKeepNext.get().m_oVal.GetValue());
				}
				
				if(false != pCurPr.m_oPageBreakBefore.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerProp_pPrType::PageBreakBefore);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
					m_oBcw.m_oStream.WriteBool(SimpleTypes::onoffTrue == pCurPr.m_oPageBreakBefore.get().m_oVal.GetValue());
				}
				
				if(false != pCurPr.m_oSpacing.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerProp_pPrType::Spacing);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);
					nCurPos = m_oBcw.WriteItemWithLengthStart();
					WriteSpacing(pCurPr.m_oSpacing.get());
					m_oBcw.WriteItemWithLengthEnd(nCurPos);
				}
				
				if(false != pCurPr.m_oShd.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerProp_pPrType::Shd);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);
					nCurPos = m_oBcw.WriteItemWithLengthStart();
					m_oBcw.WriteShd(pCurPr.m_oShd.get());
					m_oBcw.WriteItemWithLengthEnd(nCurPos);
				}
				
				if(false != pCurPr.m_oWidowControl.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerProp_pPrType::WidowControl);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
					m_oBcw.m_oStream.WriteBool(SimpleTypes::onoffTrue == pCurPr.m_oWidowControl.get().m_oVal.GetValue());
				}
				
				if(false != pCurPr.m_oTabs.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerProp_pPrType::Tab);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);
					nCurPos = m_oBcw.WriteItemWithLengthStart();
					WriteTabs(pCurPr.m_oTabs.get(), pCurPr.m_oInd);
					m_oBcw.WriteItemWithLengthEnd(nCurPos);
				}
				
				if(false != pCurPr.m_oPBdr.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerProp_pPrType::pBdr);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);
					nCurPos = m_oBcw.WriteItemWithLengthStart();
					m_oBcw.WritePBorders(pCurPr.m_oPBdr.get());
					m_oBcw.WriteItemWithLengthEnd(nCurPos);
				}
				
				if(false != pCurPr.m_oRPr.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerProp_pPrType::pPr_rPr);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);
					nCurPos = m_oBcw.WriteItemWithLengthStart();
					brPrs.Write_rPr(pCurPr.m_oRPr.get());
					m_oBcw.WriteItemWithLengthEnd(nCurPos);
				}
				
				if(pCurPr.m_oFramePr.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerProp_pPrType::FramePr);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);
					nCurPos = m_oBcw.WriteItemWithLengthStart();
					WriteFramePr(pCurPr.m_oFramePr.get());
					m_oBcw.WriteItemWithLengthEnd(nCurPos);
				}

			};
			void WriteInd(const ComplexTypes::Word::CInd& Ind)
			{
				
				if(false != Ind.m_oStart.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerProp_pPrType::Ind_Left);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
					m_oBcw.m_oStream.WriteDouble2(Ind.m_oStart.get().ToMm());
				}
				
				if(false != Ind.m_oEnd.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerProp_pPrType::Ind_Right);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
					m_oBcw.m_oStream.WriteDouble2(Ind.m_oEnd.get().ToMm());
				}
				
				if(false != Ind.m_oFirstLine.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerProp_pPrType::Ind_FirstLine);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
					m_oBcw.m_oStream.WriteDouble2(Ind.m_oFirstLine.get().ToMm());
				}
				else if(false != Ind.m_oHanging.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerProp_pPrType::Ind_FirstLine);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
					m_oBcw.m_oStream.WriteDouble2( -1 * Ind.m_oHanging.get().ToMm());
				}
			};
			void WriteSpacing(const ComplexTypes::Word::CSpacing& Spacing)
			{
				
				SimpleTypes::ELineSpacingRule eLineSpacingRule = SimpleTypes::linespacingruleAuto;
				if(false != Spacing.m_oLineRule.IsInit())
					eLineSpacingRule = Spacing.m_oLineRule->GetValue();

				
				if(false != Spacing.m_oLine.IsInit())
				{
					const SimpleTypes::CSignedTwipsMeasure& oLine = Spacing.m_oLine.get();
					double dLineMm = oLine.ToMm();
					if(dLineMm < 0)
					{
						dLineMm = -dLineMm;
						eLineSpacingRule = SimpleTypes::linespacingruleExact;
					}
					m_oBcw.m_oStream.WriteByte(c_oSerProp_pPrType::Spacing_Line);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
					if(SimpleTypes::linespacingruleAuto == eLineSpacingRule)
					{
						SimpleTypes::CSignedTwipsMeasure oTmp;oTmp.FromPoints(12);
						m_oBcw.m_oStream.WriteDouble2(dLineMm / oTmp.ToMm());
					}
					else
					{
						m_oBcw.m_oStream.WriteDouble2(dLineMm);
					}

					
					m_oBcw.m_oStream.WriteByte(c_oSerProp_pPrType::Spacing_LineRule);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
					switch(eLineSpacingRule)
					{
					case SimpleTypes::linespacingruleAtLeast: m_oBcw.m_oStream.WriteByte(linerule_AtLeast);break;
					case SimpleTypes::linespacingruleExact: m_oBcw.m_oStream.WriteByte(linerule_Exact);break;
					default:m_oBcw.m_oStream.WriteByte(linerule_Auto);break;
					}
				}
				
				if(Spacing.m_oBeforeAutospacing.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerProp_pPrType::Spacing_BeforeAuto);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
					m_oBcw.m_oStream.WriteBool(Spacing.m_oBeforeAutospacing->ToBool());
				}
				if(false != Spacing.m_oBefore.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerProp_pPrType::Spacing_Before);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
					m_oBcw.m_oStream.WriteDouble2(Spacing.m_oBefore.get().ToMm());
				}
				
				if(Spacing.m_oAfterAutospacing.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerProp_pPrType::Spacing_AfterAuto);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
					m_oBcw.m_oStream.WriteBool(Spacing.m_oAfterAutospacing->ToBool());
				}
				if(false != Spacing.m_oAfter.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerProp_pPrType::Spacing_After);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
					m_oBcw.m_oStream.WriteDouble2(Spacing.m_oAfter.get().ToMm());
				}
			};
			void WriteTabs(const OOX::Logic::CTabs& Tab, const nullable<ComplexTypes::Word::CInd>& oInd)
			{
				int nCurPos = 0;
				
				for(int i = 0, length = Tab.m_arrTabs.GetSize(); i < length; ++i)
				{
					const ComplexTypes::Word::CTabStop& tabItem = Tab.m_arrTabs[i];
					m_oBcw.m_oStream.WriteByte(c_oSerProp_pPrType::Tab_Item);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);
					nCurPos = m_oBcw.WriteItemWithLengthStart();
					WriteTabItem(tabItem, oInd);
					m_oBcw.WriteItemWithLengthEnd(nCurPos);
				}
			};
			void WriteTabItem(const ComplexTypes::Word::CTabStop& TabItem, const nullable<ComplexTypes::Word::CInd>& oInd)
			{
				
				bool bRight = false;
				if(false != TabItem.m_oVal.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerProp_pPrType::Tab_Item_Val);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
					switch(TabItem.m_oVal.get().GetValue())
					{
					case SimpleTypes::tabjcEnd: break;
					case SimpleTypes::tabjcRight: 
						m_oBcw.m_oStream.WriteByte(g_tabtype_right);
						bRight = true;
						break;
					case SimpleTypes::tabjcCenter: 
						m_oBcw.m_oStream.WriteByte(g_tabtype_center);
						break;
					case SimpleTypes::tabjcClear: 
						m_oBcw.m_oStream.WriteByte(g_tabtype_clear);
						break;
					default: m_oBcw.m_oStream.WriteByte(g_tabtype_left);break;
					}
				}
				
				if(false != TabItem.m_oPos.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerProp_pPrType::Tab_Item_Pos);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
					m_oBcw.m_oStream.WriteDouble2(TabItem.m_oPos.get().ToMm());
				}
			};
			void WriteNumPr(const OOX::Logic::CNumPr& numPr, const OOX::Logic::CParagraphProperty& pPr)
			{
				if(false != numPr.m_oNumID.IsInit())
				{
					const ComplexTypes::Word::CDecimalNumber& oCurNum = numPr.m_oNumID.get();
					if(oCurNum.m_oVal.IsInit())
					{
						
						m_oBcw.m_oStream.WriteByte(c_oSerProp_pPrType::numPr_id);
						m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Long);
						m_oBcw.m_oStream.WriteLong(oCurNum.m_oVal->GetValue());
					}
				}
				if(false != numPr.m_oIlvl.IsInit())
				{
					const ComplexTypes::Word::CDecimalNumber& oCurLvl = numPr.m_oIlvl.get();
					if(oCurLvl.m_oVal.IsInit())
					{
						
						m_oBcw.m_oStream.WriteByte(c_oSerProp_pPrType::numPr_lvl);
						m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Long);
						m_oBcw.m_oStream.WriteLong(oCurLvl.m_oVal->GetValue());
					}
				}
			};
			void WriteFramePr(const ComplexTypes::Word::CFramePr& oFramePr)
			{
				if(oFramePr.m_oDropCap.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSer_FramePrType::DropCap);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
					m_oBcw.m_oStream.WriteByte((BYTE)oFramePr.m_oDropCap->GetValue());
				}
				if(oFramePr.m_oH.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSer_FramePrType::H);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Long);
					m_oBcw.m_oStream.WriteLong(oFramePr.m_oH->ToTwips());
				}
				if(oFramePr.m_oHAnchor.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSer_FramePrType::HAnchor);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
					m_oBcw.m_oStream.WriteByte((BYTE)oFramePr.m_oHAnchor->GetValue());
				}
				if(oFramePr.m_oHRule.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSer_FramePrType::HRule);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
					m_oBcw.m_oStream.WriteByte((BYTE)oFramePr.m_oHRule->GetValue());
				}
				if(oFramePr.m_oHSpace.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSer_FramePrType::HSpace);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Long);
					m_oBcw.m_oStream.WriteLong(oFramePr.m_oHSpace->ToTwips());
				}
				if(oFramePr.m_oLines.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSer_FramePrType::Lines);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Long);
					m_oBcw.m_oStream.WriteLong(oFramePr.m_oLines->GetValue());
				}
				if(oFramePr.m_oVAnchor.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSer_FramePrType::VAnchor);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
					m_oBcw.m_oStream.WriteByte((BYTE)oFramePr.m_oVAnchor->GetValue());
				}
				if(oFramePr.m_oVSpace.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSer_FramePrType::VSpace);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Long);
					m_oBcw.m_oStream.WriteLong(oFramePr.m_oVSpace->ToTwips());
				}
				if(oFramePr.m_oW.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSer_FramePrType::W);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Long);
					m_oBcw.m_oStream.WriteLong(oFramePr.m_oW->ToTwips());
				}
				if(oFramePr.m_oWrap.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSer_FramePrType::Wrap);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
					m_oBcw.m_oStream.WriteByte((BYTE)oFramePr.m_oWrap->GetValue());
				}
				if(oFramePr.m_oX.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSer_FramePrType::X);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Long);
					m_oBcw.m_oStream.WriteLong(oFramePr.m_oX->ToTwips());
				}
				if(oFramePr.m_oXAlign.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSer_FramePrType::XAlign);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
					m_oBcw.m_oStream.WriteByte((BYTE)oFramePr.m_oXAlign->GetValue());
				}
				if(oFramePr.m_oY.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSer_FramePrType::Y);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Long);
					m_oBcw.m_oStream.WriteLong(oFramePr.m_oY->ToTwips());
				}
				if(oFramePr.m_oYAlign.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSer_FramePrType::YAlign);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
					m_oBcw.m_oStream.WriteByte((BYTE)oFramePr.m_oYAlign->GetValue());
				}
			}
	};
	class Binary_tblPrWriter
	{
		BinaryCommonWriter m_oBcw;
	public:
	public: Binary_tblPrWriter(Streams::CBufferedStream &oCBufferedStream, NSFontCutter::CEmbeddedFontsManager* pEmbeddedFontsManager):m_oBcw(oCBufferedStream, pEmbeddedFontsManager)
			{
			}
			void WriteTblPr(OOX::Logic::CTableProperty* p_tblPr)
			{
				OOX::Logic::CTableProperty& tblPr = *p_tblPr;
				int nCurPos = 0;
				
				if(false != tblPr.m_oJc.IsInit() && tblPr.m_oJc->m_oVal.IsInit())
				{
					nCurPos = m_oBcw.WriteItemStart(c_oSerProp_tblPrType::Jc);
					switch(tblPr.m_oJc->m_oVal->GetValue())
					{
					case SimpleTypes::jctableCenter:m_oBcw.m_oStream.WriteByte(align_Center);break;
					case SimpleTypes::jctableEnd:
					case SimpleTypes::jctableRight:m_oBcw.m_oStream.WriteByte(align_Right);break;
					case SimpleTypes::jctableStart:
					case SimpleTypes::jctableLeft:m_oBcw.m_oStream.WriteByte(align_Left);break;
					default:m_oBcw.m_oStream.WriteByte(align_Left);break;
					}
					m_oBcw.WriteItemEnd(nCurPos);
				}
				
				if(tblPr.m_oTblInd.IsInit())
				{
					if(tblPr.m_oTblInd->m_oW.IsInit() && false == tblPr.m_oTblInd->m_oW->IsPercent() &&
						tblPr.m_oTblInd->m_oType.IsInit() && SimpleTypes::tblwidthDxa == tblPr.m_oTblInd->m_oType->GetValue())
					{
						SimpleTypes::CPoint oPoint;
						oPoint.FromTwips(tblPr.m_oTblInd->m_oW->GetValue());

						nCurPos = m_oBcw.WriteItemStart(c_oSerProp_tblPrType::TableInd);
						m_oBcw.m_oStream.WriteDouble2(oPoint.ToMm());
						m_oBcw.WriteItemEnd(nCurPos);
					}
				}
				
				if(tblPr.m_oTblW.IsInit())
					WriteW(c_oSerProp_tblPrType::TableW, tblPr.m_oTblW.get());
				
				if(tblPr.m_oTblCellMar.IsInit())
				{
					nCurPos = m_oBcw.WriteItemStart(c_oSerProp_tblPrType::TableCellMar);
					WriteTblMar(tblPr.m_oTblCellMar.get());
					m_oBcw.WriteItemEnd(nCurPos);
				}
				
				if(tblPr.m_oTblBorders.IsInit())
				{
					nCurPos = m_oBcw.WriteItemStart(c_oSerProp_tblPrType::TableBorders);
					m_oBcw.WriteTblBorders(tblPr.m_oTblBorders.get());
					m_oBcw.WriteItemEnd(nCurPos);
				}
				
				if(tblPr.m_oShade.IsInit())
				{
					nCurPos = m_oBcw.WriteItemStart(c_oSerProp_tblPrType::Shd);
					m_oBcw.WriteShd(tblPr.m_oShade.get());
					m_oBcw.WriteItemEnd(nCurPos);
				}
				if(tblPr.m_oTblStyle.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerProp_tblPrType::Style);
					m_oBcw.m_oStream.WriteString2(tblPr.m_oTblStyle->ToString2());
				}
				
				if(tblPr.m_oTblLook.IsInit())
				{
					nCurPos = m_oBcw.WriteItemStart(c_oSerProp_tblPrType::Look);
					m_oBcw.m_oStream.WriteLong(tblPr.m_oTblLook->GetValue());
					m_oBcw.WriteItemEnd(nCurPos);
				}
				
				if(tblPr.m_oTblLayout.IsInit() && tblPr.m_oTblLayout->m_oType.IsInit())
				{
					nCurPos = m_oBcw.WriteItemStart(c_oSerProp_tblPrType::Layout);
					m_oBcw.m_oStream.WriteByte((BYTE)tblPr.m_oTblLayout->m_oType->GetValue());
					m_oBcw.WriteItemEnd(nCurPos);
				}
				
				if(tblPr.m_oTblpPr.IsInit())
				{
					nCurPos = m_oBcw.WriteItemStart(c_oSerProp_tblPrType::tblpPr2);
					Write_tblpPr(tblPr.m_oTblpPr.get());
					m_oBcw.WriteItemEnd(nCurPos);
				}
			};
			void WriteTblMar(const OOX::Logic::CTblCellMar& cellMar)
			{
				int nCurPos = 0;
				
				if(cellMar.m_oStart.IsInit())
					WriteW(c_oSerMarginsType::left, cellMar.m_oStart.get());
				
				if(cellMar.m_oTop.IsInit())
					WriteW(c_oSerMarginsType::top, cellMar.m_oTop.get());
				
				if(cellMar.m_oEnd.IsInit())
					WriteW(c_oSerMarginsType::right, cellMar.m_oEnd.get());
				
				if(cellMar.m_oBottom.IsInit())
					WriteW(c_oSerMarginsType::bottom, cellMar.m_oBottom.get());
			};
			void WriteCellMar(const OOX::Logic::CTcMar& cellMar)
			{
				int nCurPos = 0;
				
				if(cellMar.m_oStart.IsInit())
					WriteW(c_oSerMarginsType::left, cellMar.m_oStart.get());
				
				if(cellMar.m_oTop.IsInit())
					WriteW(c_oSerMarginsType::top, cellMar.m_oTop.get());
				
				if(cellMar.m_oEnd.IsInit())
					WriteW(c_oSerMarginsType::right, cellMar.m_oEnd.get());
				
				if(cellMar.m_oBottom.IsInit())
					WriteW(c_oSerMarginsType::bottom, cellMar.m_oBottom.get());
			};
			void Write_tblpPr(const ComplexTypes::Word::CTblPPr& pr)
			{
				int nCurPos = 0;
				if(pr.m_oHorzAnchor.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSer_tblpPrType2::HorzAnchor);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
					m_oBcw.m_oStream.WriteByte((BYTE)pr.m_oHorzAnchor->GetValue());
				}
				if(pr.m_oTblpX.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSer_tblpPrType2::TblpX);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
					m_oBcw.m_oStream.WriteDouble2(pr.m_oTblpX->ToMm());
				}
				if(pr.m_oTblpXSpec.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSer_tblpPrType2::TblpXSpec);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
					m_oBcw.m_oStream.WriteByte((BYTE)pr.m_oTblpXSpec->GetValue());
				}
				if(pr.m_oVertAnchor.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSer_tblpPrType2::VertAnchor);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
					m_oBcw.m_oStream.WriteByte((BYTE)pr.m_oVertAnchor->GetValue());
				}
				if(pr.m_oTblpY.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSer_tblpPrType2::TblpY);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
					m_oBcw.m_oStream.WriteDouble2(pr.m_oTblpY->ToMm());
				}
				if(pr.m_oTblpYSpec.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSer_tblpPrType2::TblpYSpec);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
					m_oBcw.m_oStream.WriteByte((BYTE)pr.m_oTblpYSpec->GetValue());
				}
				if(pr.m_oLeftFromText.IsInit() || pr.m_oTopFromText.IsInit() || pr.m_oRightFromText.IsInit() || pr.m_oBottomFromText.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSer_tblpPrType2::Paddings);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);
					nCurPos = m_oBcw.WriteItemWithLengthStart();
					m_oBcw.WritePaddings(pr.m_oLeftFromText, pr.m_oTopFromText, pr.m_oRightFromText, pr.m_oBottomFromText);
					m_oBcw.WriteItemWithLengthEnd(nCurPos);
				}
			};
			void WriteRowPr(const OOX::Logic::CTableRowProperties& rowPr)
			{
				int nCurPos = 0;
				
				if(rowPr.m_oCantSplit.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerProp_rowPrType::CantSplit);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
					m_oBcw.m_oStream.WriteBool( SimpleTypes::onoffTrue == rowPr.m_oCantSplit->m_oVal.GetValue());
				}
				
				if(rowPr.m_oGridAfter.IsInit() || rowPr.m_oWAfter.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerProp_rowPrType::After);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);
					nCurPos = m_oBcw.WriteItemWithLengthStart();
					WriteAfter(rowPr.m_oGridAfter, rowPr.m_oWAfter);
					m_oBcw.WriteItemWithLengthEnd(nCurPos);
				}
				
				if(rowPr.m_oGridBefore.IsInit() || rowPr.m_oWBefore.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerProp_rowPrType::Before);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);
					nCurPos = m_oBcw.WriteItemWithLengthStart();
					WriteBefore(rowPr.m_oGridBefore, rowPr.m_oWBefore);
					m_oBcw.WriteItemWithLengthEnd(nCurPos);
				}
				
				if(rowPr.m_oJc.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerProp_rowPrType::Jc);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
					switch(rowPr.m_oJc->m_oVal->GetValue())
					{
					case SimpleTypes::jctableCenter:m_oBcw.m_oStream.WriteByte(align_Center);break;
					case SimpleTypes::jctableEnd:
					case SimpleTypes::jctableRight:m_oBcw.m_oStream.WriteByte(align_Right);break;
					case SimpleTypes::jctableStart:
					case SimpleTypes::jctableLeft:m_oBcw.m_oStream.WriteByte(align_Left);break;
					default:m_oBcw.m_oStream.WriteByte(align_Left);break;
					}
				}
				
				if(rowPr.m_oTblCellSpacing.IsInit())
				{
					const ComplexTypes::Word::CTblWidth& cs = rowPr.m_oTblCellSpacing.get();
					if(cs.m_oW.IsInit() && false == cs.m_oW->IsPercent() &&
						cs.m_oType.IsInit() && SimpleTypes::tblwidthDxa == cs.m_oType->GetValue())
					{
						SimpleTypes::CPoint oPoint;
						oPoint.FromTwips(cs.m_oW->GetValue());

						m_oBcw.m_oStream.WriteByte(c_oSerProp_rowPrType::TableCellSpacing);
						m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
						m_oBcw.m_oStream.WriteDouble2(oPoint.ToMm() * 2);
					}
				}
				
				if(rowPr.m_oTblHeight.IsInit() && rowPr.m_oTblHeight->m_oVal.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerProp_rowPrType::Height);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);
					nCurPos = m_oBcw.WriteItemWithLengthStart();
					WriteRowHeight(rowPr.m_oTblHeight.get());
					m_oBcw.WriteItemWithLengthEnd(nCurPos);
				}
				
				if(rowPr.m_oTblHeader.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerProp_rowPrType::TableHeader);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
					m_oBcw.m_oStream.WriteBool(rowPr.m_oTblHeader->m_oVal.ToBool());
				}
			};
			void WriteAfter(const nullable<ComplexTypes::Word::CDecimalNumber>& GridAfter, const nullable<ComplexTypes::Word::CTblWidth>& WAfter)
			{
				int nCurPos = 0;
				
				if(GridAfter.IsInit() && GridAfter->m_oVal.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerProp_rowPrType::GridAfter);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Long);
					m_oBcw.m_oStream.WriteLong(GridAfter->m_oVal->GetValue());
				}
				
				if(WAfter.IsInit())
				{
					WriteW(c_oSerProp_rowPrType::WAfter, WAfter.get(), true);
				}
			}
			void WriteBefore(const nullable<ComplexTypes::Word::CDecimalNumber>& GridBefore, const nullable<ComplexTypes::Word::CTblWidth>& WBefore)
			{
				int nCurPos = 0;
				
				if(GridBefore.IsInit() && GridBefore->m_oVal.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerProp_rowPrType::GridBefore);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Long);
					m_oBcw.m_oStream.WriteLong(GridBefore->m_oVal->GetValue());
				}
				
				if(WBefore.IsInit())
				{
					WriteW(c_oSerProp_rowPrType::WBefore, WBefore.get(), true);
				}
			};
			void WriteRowHeight(const ComplexTypes::Word::CHeight& rowHeight)
			{
				if(rowHeight.m_oVal.IsInit())
				{
					
					
					
					SimpleTypes::EHeightRule eHRule = SimpleTypes::heightruleAtLeast;
					if(rowHeight.m_oHRule.IsInit())
						eHRule = rowHeight.m_oHRule->GetValue();
					m_oBcw.m_oStream.WriteByte(c_oSerProp_rowPrType::Height_Rule);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
					switch(eHRule)
					{
					case SimpleTypes::heightruleAtLeast :
					case SimpleTypes::heightruleExact :m_oBcw.m_oStream.WriteByte(heightrule_AtLeast);break;
					default :m_oBcw.m_oStream.WriteByte(heightrule_Auto);break;
					}

					
					m_oBcw.m_oStream.WriteByte(c_oSerProp_rowPrType::Height_Value);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
					m_oBcw.m_oStream.WriteDouble2(rowHeight.m_oVal->ToMm());
				}
			};
			void WriteW(int nType, const ComplexTypes::Word::CTblWidth& tableW, bool bWrite2 = false)
			{
				int nCurPos = 0;
				if(tableW.m_oW.IsInit() && tableW.m_oType.IsInit() && SimpleTypes::tblwidthPct != tableW.m_oType->GetValue())
				{
					if(nType >= 0)
					{
						if(true == bWrite2)
						{
							m_oBcw.m_oStream.WriteByte(nType);
							m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);
							nCurPos = m_oBcw.WriteItemWithLengthStart();
						}
						else
							nCurPos = m_oBcw.WriteItemStart(nType);
					}
					else
					{
						if(true == bWrite2)
							m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);
						nCurPos = m_oBcw.WriteItemWithLengthStart();
					}

					
					if(false != tableW.m_oType.IsInit())
					{
						m_oBcw.m_oStream.WriteByte(c_oSerWidthType::Type);
						m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
						switch(tableW.m_oType->GetValue())
						{
						case SimpleTypes::tblwidthAuto:m_oBcw.m_oStream.WriteByte(tblwidth_Auto);break;
						case SimpleTypes::tblwidthDxa:m_oBcw.m_oStream.WriteByte(tblwidth_Mm);break;
						case SimpleTypes::tblwidthNil:m_oBcw.m_oStream.WriteByte(tblwidth_Nil);break;
						case SimpleTypes::tblwidthPct:m_oBcw.m_oStream.WriteByte(tblwidth_Pct);break;
						default:m_oBcw.m_oStream.WriteByte(tblwidth_Auto);break;
						}

					}
					
					if(false != tableW.m_oW.IsInit())
					{
						m_oBcw.m_oStream.WriteByte(c_oSerWidthType::WDocx);
						m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Long);
						m_oBcw.m_oStream.WriteLong(tableW.m_oW->GetValue());
					}
					if(nType >= 0)
						m_oBcw.WriteItemEnd(nCurPos);
					else
						m_oBcw.WriteItemWithLengthEnd(nCurPos);
				}
			};
			void WriteCellPr(const OOX::Logic::CTableCellProperties& cellPr)
			{
				int nCurPos = 0;
				
				if(cellPr.m_oGridSpan.IsInit() && cellPr.m_oGridSpan->m_oVal.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerProp_cellPrType::GridSpan);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Long);
					m_oBcw.m_oStream.WriteLong(cellPr.m_oGridSpan->m_oVal->GetValue());
				}
				
				if(cellPr.m_oShd.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerProp_cellPrType::Shd);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);
					nCurPos = m_oBcw.WriteItemWithLengthStart();
					m_oBcw.WriteShd(cellPr.m_oShd.get());
					m_oBcw.WriteItemWithLengthEnd(nCurPos);
				}
				
				if(cellPr.m_oTcBorders.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerProp_cellPrType::TableCellBorders);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);
					nCurPos = m_oBcw.WriteItemWithLengthStart();
					m_oBcw.WriteTcBorders(cellPr.m_oTcBorders.get());
					m_oBcw.WriteItemWithLengthEnd(nCurPos);
				}
				
				if(cellPr.m_oTcMar.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerProp_cellPrType::CellMar);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);
					nCurPos = m_oBcw.WriteItemWithLengthStart();
					WriteCellMar(cellPr.m_oTcMar.get());
					m_oBcw.WriteItemWithLengthEnd(nCurPos);
				}
				
				if(cellPr.m_oTcW.IsInit())
				{
					WriteW(c_oSerProp_cellPrType::TableCellW, cellPr.m_oTcW.get(), true);
				}
				
				if(cellPr.m_oVAlign.IsInit() && cellPr.m_oVAlign->m_oVal.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerProp_cellPrType::VAlign);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
					switch(cellPr.m_oVAlign->m_oVal->GetValue())
					{
					case SimpleTypes::verticaljcBottom: m_oBcw.m_oStream.WriteByte(vertalignjc_Bottom); break;
					case SimpleTypes::verticaljcCenter: m_oBcw.m_oStream.WriteByte(vertalignjc_Center); break;
					case SimpleTypes::verticaljcBoth:
					case SimpleTypes::verticaljcTop: m_oBcw.m_oStream.WriteByte(vertalignjc_Top); break;
					default: m_oBcw.m_oStream.WriteByte(vertalignjc_Top);break;
					}
				}
				
				if(cellPr.m_oVMerge.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerProp_cellPrType::VMerge);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
					if(cellPr.m_oVMerge->m_oVal.IsInit())
					{
						switch(cellPr.m_oVMerge->m_oVal->GetValue())
						{
						case SimpleTypes::mergeContinue: m_oBcw.m_oStream.WriteByte(vmerge_Continue); break;
						case SimpleTypes::mergeRestart: m_oBcw.m_oStream.WriteByte(vmerge_Restart); break;
						default: m_oBcw.m_oStream.WriteByte(vmerge_Continue);break;
						}
					}
					else
					{
						m_oBcw.m_oStream.WriteByte(vmerge_Continue);
					}
				}
			};
	};
	class BinaryStyleTableWriter
	{
		BinaryCommonWriter m_oBcw;
		Binary_pPrWriter bpPrs;
		Binary_rPrWriter brPrs;
		Binary_tblPrWriter btblPrs;
		int m_nReaderGenName;
	public:
		BinaryStyleTableWriter(Streams::CBufferedStream &oCBufferedStream, NSFontCutter::CEmbeddedFontsManager* pEmbeddedFontsManager, OOX::CTheme* poTheme, DocWrapper::FontProcessor& oFontProcessor):m_oBcw(oCBufferedStream, pEmbeddedFontsManager),bpPrs(oCBufferedStream, pEmbeddedFontsManager, poTheme, oFontProcessor),brPrs(oCBufferedStream, pEmbeddedFontsManager, poTheme, oFontProcessor),btblPrs(oCBufferedStream, pEmbeddedFontsManager)
		{
			m_nReaderGenName = 0;
		};
		void Write(OOX::CStyles& styles)
		{
			int nStart = m_oBcw.WriteItemWithLengthStart();
			WriteStylesContent(styles);
			m_oBcw.WriteItemWithLengthEnd(nStart);
		};
		void WriteStylesContent(OOX::CStyles& styles)
		{
			int nCurPos;
			if(false != styles.m_oDocDefaults.IsInit())
			{
				const OOX::CDocDefaults& oDocDefaults = styles.m_oDocDefaults.get();

				
				
				OOX::Logic::CParagraphProperty oWordDefParPr;
				oWordDefParPr.m_oSpacing.Init();
				oWordDefParPr.m_oSpacing->m_oAfter.Init();
				oWordDefParPr.m_oSpacing->m_oAfter->FromPoints(0);
				oWordDefParPr.m_oSpacing->m_oBefore.Init();
				oWordDefParPr.m_oSpacing->m_oBefore->FromPoints(0);
				oWordDefParPr.m_oSpacing->m_oLineRule.Init();
				oWordDefParPr.m_oSpacing->m_oLineRule->SetValue(SimpleTypes::linespacingruleAuto);
				oWordDefParPr.m_oSpacing->m_oLine.Init();
				oWordDefParPr.m_oSpacing->m_oLine->FromPoints(12);
				if(false != oDocDefaults.m_oParPr.IsInit())
					oWordDefParPr = OOX::Logic::CParagraphProperty::Merge(oWordDefParPr, oDocDefaults.m_oParPr.get());

				nCurPos = m_oBcw.WriteItemStart(c_oSer_st::DefpPr);
				bpPrs.Write_pPr(oWordDefParPr);
				m_oBcw.WriteItemEnd(nCurPos);

				
				OOX::Logic::CRunProperty oWordDefTextPr;
				oWordDefTextPr.m_oRFonts.Init();
				oWordDefTextPr.m_oRFonts->m_sAscii.Init();
				CString sAscii = brPrs.m_oFontProcessor.getFont(CString(_T("Times New Roman")));
				oWordDefTextPr.m_oRFonts->m_sAscii = sAscii;
				if(NULL != m_oBcw.m_pEmbeddedFontsManager)
					m_oBcw.m_pEmbeddedFontsManager->CheckFont(sAscii, brPrs.m_oFontProcessor.getFontManager());
				oWordDefTextPr.m_oSz.Init();
				oWordDefTextPr.m_oSz->m_oVal.Init();
				oWordDefTextPr.m_oSz->m_oVal->FromPoints(10);

				if(false != oDocDefaults.m_oRunPr.IsInit())
					oWordDefTextPr = OOX::Logic::CRunProperty::Merge(oWordDefTextPr, oDocDefaults.m_oRunPr.get());
				nCurPos = m_oBcw.WriteItemStart(c_oSer_st::DefrPr);
				brPrs.Write_rPr(oWordDefTextPr);
				m_oBcw.WriteItemEnd(nCurPos);
			}
			
			nCurPos = m_oBcw.WriteItemStart(c_oSer_st::Styles);
			WriteStyles(styles.m_arrStyle);
			m_oBcw.WriteItemEnd(nCurPos);
		};
		void WriteStyles(CSimpleArray<OOX::CStyle>& styles)
		{
			int nCurPos = 0;
			for(int i = 0, length = styles.GetSize(); i < length; ++i)
			{
				const OOX::CStyle& style = styles[i];
				if(false != style.m_sStyleId.IsInit())
				{
					nCurPos = m_oBcw.WriteItemStart(c_oSer_sts::Style);
					WriteStyle(style);
					m_oBcw.WriteItemEnd(nCurPos);
				}
			}
		};
		void WriteStyle(const OOX::CStyle& style)
		{
			int nCurPos = 0;
			
			if(false != style.m_sStyleId.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_sts::Style_Id);
				m_oBcw.m_oStream.WriteString2(style.m_sStyleId.get2());
			}
			
			CString sName;
			if(false != style.m_oName.IsInit())
				sName = style.m_oName->ToString2();
			else
				sName.Format(_T("StGen%d"), m_nReaderGenName++);
			m_oBcw.m_oStream.WriteByte(c_oSer_sts::Style_Name);
			m_oBcw.m_oStream.WriteString2(sName);
			
			if(false != style.m_oType.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_sts::Style_Type);
				BYTE byteType = 0;
				switch(style.m_oType->GetValue())
				{
				case SimpleTypes::styletypeCharacter: byteType = styletype_Character;break;
				case SimpleTypes::styletypeNumbering: byteType = styletype_Numbering;break;
				case SimpleTypes::styletypeTable: byteType = styletype_Table;break;
				default:byteType = styletype_Paragraph;break;
				}
				m_oBcw.m_oStream.WriteByte(byteType);
				m_oBcw.WriteItemEnd(nCurPos);
			}
			
			if(false != style.m_oDefault.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_sts::Style_Default);
				m_oBcw.m_oStream.WriteBool(SimpleTypes::onoffTrue == style.m_oDefault->GetValue());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			
			if(false != style.m_oBasedOn.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_sts::Style_BasedOn);
				m_oBcw.m_oStream.WriteString2(style.m_oBasedOn.get().ToString2());
			}
			
			if(false != style.m_oNext.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_sts::Style_Next);
				m_oBcw.m_oStream.WriteString2(style.m_oNext.get().ToString2());
			}
			
			if(false != style.m_oQFormat.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_sts::Style_qFormat);
				m_oBcw.m_oStream.WriteBool(SimpleTypes::onoffTrue == style.m_oQFormat->m_oVal.GetValue());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			
			if(false != style.m_oUiPriority.IsInit() && style.m_oUiPriority->m_oVal.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_sts::Style_uiPriority);
				m_oBcw.m_oStream.WriteLong(style.m_oUiPriority->m_oVal->GetValue());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			
			if(false != style.m_oHidden.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_sts::Style_hidden);
				m_oBcw.m_oStream.WriteBool(SimpleTypes::onoffTrue == style.m_oHidden->m_oVal.GetValue());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			
			if(false != style.m_oSemiHidden.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_sts::Style_semiHidden);
				m_oBcw.m_oStream.WriteBool(SimpleTypes::onoffTrue == style.m_oSemiHidden->m_oVal.GetValue());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			
			if(false != style.m_oUnhideWhenUsed.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_sts::Style_unhideWhenUsed);
				m_oBcw.m_oStream.WriteBool(SimpleTypes::onoffTrue == style.m_oUnhideWhenUsed->m_oVal.GetValue());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			
			if(false != style.m_oRunPr.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_sts::Style_TextPr);
				brPrs.Write_rPr(style.m_oRunPr.get());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			
			if(false != style.m_oParPr.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_sts::Style_ParaPr);
				bpPrs.Write_pPr(style.m_oParPr.get());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			
			if(false != style.m_oTblPr.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_sts::Style_TablePr);
				btblPrs.WriteTblPr(style.m_oTblPr.operator ->());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			
			if(false != style.m_oTrPr.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_sts::Style_RowPr);
				btblPrs.WriteRowPr(style.m_oTrPr.get());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			
			if(false != style.m_oTcPr.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_sts::Style_CellPr);
				btblPrs.WriteCellPr(style.m_oTcPr.get());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			
			if(style.m_arrTblStylePr.GetSize() > 0)
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_sts::Style_TblStylePr);
				WriteTblStylePr(style.m_arrTblStylePr);
				m_oBcw.WriteItemEnd(nCurPos);
			}
		};
		void WriteTblStylePr(const CSimpleArray<OOX::Logic::CTableStyleProperties>& aProperties)
		{
			int nCurPos = 0;
			for(int i = 0, length = aProperties.GetSize(); i < length; ++i)
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSerProp_tblStylePrType::TblStylePr);
				WriteTblStyleProperties(aProperties[i]);
				m_oBcw.WriteItemEnd(nCurPos);
			}
		}
		void WriteTblStyleProperties(const OOX::Logic::CTableStyleProperties& oProperty)
		{
			int nCurPos = 0;
			
			if(oProperty.m_oType.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSerProp_tblStylePrType::Type);
				m_oBcw.m_oStream.WriteByte(oProperty.m_oType->GetValue());
				m_oBcw.WriteItemEnd(nCurPos);

				
				if(false != oProperty.m_oRunPr.IsInit())
				{
					nCurPos = m_oBcw.WriteItemStart(c_oSerProp_tblStylePrType::RunPr);
					brPrs.Write_rPr(oProperty.m_oRunPr.get());
					m_oBcw.WriteItemEnd(nCurPos);
				}
				
				if(false != oProperty.m_oParPr.IsInit())
				{
					nCurPos = m_oBcw.WriteItemStart(c_oSerProp_tblStylePrType::ParPr);
					bpPrs.Write_pPr(oProperty.m_oParPr.get());
					m_oBcw.WriteItemEnd(nCurPos);
				}
				
				if(false != oProperty.m_oTblPr.IsInit())
				{
					nCurPos = m_oBcw.WriteItemStart(c_oSerProp_tblStylePrType::TblPr);
					btblPrs.WriteTblPr(oProperty.m_oTblPr.operator ->());
					m_oBcw.WriteItemEnd(nCurPos);
				}
				
				if(false != oProperty.m_oTrPr.IsInit())
				{
					nCurPos = m_oBcw.WriteItemStart(c_oSerProp_tblStylePrType::TrPr);
					btblPrs.WriteRowPr(oProperty.m_oTrPr.get());
					m_oBcw.WriteItemEnd(nCurPos);
				}
				
				if(false != oProperty.m_oTcPr.IsInit())
				{
					nCurPos = m_oBcw.WriteItemStart(c_oSerProp_tblStylePrType::TcPr);
					btblPrs.WriteCellPr(oProperty.m_oTcPr.get());
					m_oBcw.WriteItemEnd(nCurPos);
				}
			}
		}
	};
	class BinaryNumberingTableWriter
	{
		BinaryCommonWriter m_oBcw;
		Binary_pPrWriter bpPrs;
		Binary_rPrWriter brPrs;
	public:
		BinaryNumberingTableWriter(Streams::CBufferedStream &oCBufferedStream, NSFontCutter::CEmbeddedFontsManager* pEmbeddedFontsManager, OOX::CTheme* poTheme, DocWrapper::FontProcessor& oFontProcessor):m_oBcw(oCBufferedStream, pEmbeddedFontsManager),bpPrs(oCBufferedStream, pEmbeddedFontsManager, poTheme, oFontProcessor),brPrs(oCBufferedStream, pEmbeddedFontsManager, poTheme, oFontProcessor)
		{
		};
		void Write(const OOX::CNumbering& numbering)
		{
			int nStart = m_oBcw.WriteItemWithLengthStart();
			WriteNumberingContent(numbering);
			m_oBcw.WriteItemWithLengthEnd(nStart);
		};
		void WriteNumberingContent(const OOX::CNumbering& numbering)
		{
			int nCurPos = 0;
			
			nCurPos = m_oBcw.WriteItemStart(c_oSerNumTypes::AbstractNums);
			WriteAbstractNums(numbering);
			m_oBcw.WriteItemEnd(nCurPos);

			
			nCurPos = m_oBcw.WriteItemStart(c_oSerNumTypes::Nums);
			WriteNums(numbering);
			m_oBcw.WriteItemEnd(nCurPos);
		};
		void WriteNums(const OOX::CNumbering& numbering)
		{
			int nCurPos = 0;
			for(int i = 0, length = numbering.m_arrNum.GetSize(); i < length; ++i)
			{
				const OOX::Numbering::CNum& num = numbering.m_arrNum[i];
				
				if(num.m_oAbstractNumId.IsInit() && num.m_oAbstractNumId->m_oVal.IsInit() && num.m_oNumId.IsInit())
				{
					nCurPos = m_oBcw.WriteItemStart(c_oSerNumTypes::Num);
					WriteNum(num);
					m_oBcw.WriteItemEnd(nCurPos);
				}
			}
		};
		void WriteNum(const OOX::Numbering::CNum& num)
		{
			int nCurPos = 0;
			int nANumId = num.m_oAbstractNumId->m_oVal->GetValue();
			int nNumId = num.m_oNumId->GetValue();
			m_oBcw.m_oStream.WriteByte(c_oSerNumTypes::Num_ANumId);
			m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Long);
			m_oBcw.m_oStream.WriteLong(nANumId);

			m_oBcw.m_oStream.WriteByte(c_oSerNumTypes::Num_NumId);
			m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Long);
			m_oBcw.m_oStream.WriteLong(nNumId);
		};
		void WriteAbstractNums(const OOX::CNumbering& numbering)
		{
			int nCurPos = 0;
			int nRealCount = 0;
			for(int i = 0, length = numbering.m_arrAbstractNum.GetSize(); i < length; ++i)
			{
				const OOX::Numbering::CAbstractNum& num = numbering.m_arrAbstractNum[i];
				if(false != num.m_oAbstractNumId.IsInit())
				{
					nCurPos = m_oBcw.WriteItemStart(c_oSerNumTypes::AbstractNum);
					WriteAbstractNum(num, nRealCount, numbering.m_arrNum);
					m_oBcw.WriteItemEnd(nCurPos);
					nRealCount++;
				}
			}
		};
		void WriteAbstractNum(const OOX::Numbering::CAbstractNum& num, int nIndex, const CSimpleArray<OOX::Numbering::CNum>& aNums)
		{
			int nCurPos = 0;
			
			if(num.m_oAbstractNumId.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSerNumTypes::AbstractNum_Id);
				m_oBcw.m_oStream.WriteLong(num.m_oAbstractNumId->GetValue());
				m_oBcw.WriteItemEnd(nCurPos);
			}

			
			if(false != num.m_oMultiLevelType.IsInit())
			{
				
				
				
				
			}

			
			if(false != num.m_oNumStyleLink.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerNumTypes::NumStyleLink);
				m_oBcw.m_oStream.WriteString2(num.m_oNumStyleLink.get().ToString2());
			}

			
			if(false != num.m_oStyleLink.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerNumTypes::StyleLink);
				m_oBcw.m_oStream.WriteString2(num.m_oStyleLink.get().ToString2());
			}

			
			nCurPos = m_oBcw.WriteItemStart(c_oSerNumTypes::AbstractNum_Lvls);
			WriteLevels(num.m_arrLvl, num.m_oAbstractNumId.get().GetValue(), aNums);
			m_oBcw.WriteItemEnd(nCurPos);
		};
		void WriteLevels(const CSimpleArray<OOX::Numbering::CLvl>& lvls, int nAId, const CSimpleArray<OOX::Numbering::CNum>& aNums)
		{
			int nCurPos = 0;
			for(int i = 0, length = lvls.GetSize(); i < length; ++i)
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSerNumTypes::Lvl);
				WriteLevel(lvls[i], i, nAId, aNums);
				m_oBcw.WriteItemEnd(nCurPos);
			}
		};
		void WriteLevel(const OOX::Numbering::CLvl& lvl, int index, int nAId, const CSimpleArray<OOX::Numbering::CNum>& aNums)
		{
			int nCurPos = 0;
			
			if(false != lvl.m_oNumFmt.IsInit())
			{
				const ComplexTypes::Word::CNumFmt& oNumFmt = lvl.m_oNumFmt.get();
				if(false != oNumFmt.m_oVal.IsInit())
				{
					const SimpleTypes::CNumberFormat<>& oNumberFormat = oNumFmt.m_oVal.get();
					m_oBcw.m_oStream.WriteByte(c_oSerNumTypes::lvl_Format);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Long);
					switch(oNumberFormat.GetValue())
					{
					case SimpleTypes::numberformatNone: m_oBcw.m_oStream.WriteLong(numbering_numfmt_None);break;
					case SimpleTypes::numberformatBullet: m_oBcw.m_oStream.WriteLong(numbering_numfmt_Bullet);break;
					case SimpleTypes::numberformatDecimal: m_oBcw.m_oStream.WriteLong(numbering_numfmt_Decimal);break;
					case SimpleTypes::numberformatLowerRoman: m_oBcw.m_oStream.WriteLong(numbering_numfmt_LowerRoman);break;
					case SimpleTypes::numberformatUpperRoman: m_oBcw.m_oStream.WriteLong(numbering_numfmt_UpperRoman);break;
					case SimpleTypes::numberformatLowerLetter: m_oBcw.m_oStream.WriteLong(numbering_numfmt_LowerLetter);break;
					case SimpleTypes::numberformatUpperLetter: m_oBcw.m_oStream.WriteLong(numbering_numfmt_UpperLetter);break;
					case SimpleTypes::numberformatDecimalZero: m_oBcw.m_oStream.WriteLong(numbering_numfmt_DecimalZero);break;
					default: m_oBcw.m_oStream.WriteLong(numbering_numfmt_Decimal);break;
					}
				}
			}
			
			if(false != lvl.m_oLvlJc.IsInit())
			{
				const ComplexTypes::Word::CJc& oJc = lvl.m_oLvlJc.get();
				if(false != oJc.m_oVal.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerNumTypes::lvl_Jc);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
					switch(oJc.m_oVal.get().GetValue())
					{
					case SimpleTypes::jcCenter: m_oBcw.m_oStream.WriteByte(align_Center);break;
					case SimpleTypes::jcStart:
					case SimpleTypes::jcLeft: m_oBcw.m_oStream.WriteByte(align_Left);break;
					case SimpleTypes::jcEnd:
					case SimpleTypes::jcRight: m_oBcw.m_oStream.WriteByte(align_Right);break;
					case SimpleTypes::jcBoth:
					case SimpleTypes::jcThaiDistribute:
					case SimpleTypes::jcDistribute: m_oBcw.m_oStream.WriteByte(align_Justify);break;
					default: m_oBcw.m_oStream.WriteByte(align_Left);break;
					}
				}
			}
			
			if(false != lvl.m_oLvlText.IsInit())
			{
				const ComplexTypes::Word::CLevelText& oText = lvl.m_oLvlText.get();
				if(false != oText.m_sVal.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerNumTypes::lvl_LvlText);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);
					nCurPos = m_oBcw.WriteItemWithLengthStart();
					WriteLevelText(oText.m_sVal.get());
					m_oBcw.WriteItemWithLengthEnd(nCurPos);
				}
			}
			
			if(false != lvl.m_oLvlRestart.IsInit())
			{
				const ComplexTypes::Word::CDecimalNumber& oVal = lvl.m_oLvlRestart.get();
				if(oVal.m_oVal.IsInit())
				{
					int nVal = oVal.m_oVal.get().GetValue();
					if(0 != nVal)
						nVal = -1;
					m_oBcw.m_oStream.WriteByte(c_oSerNumTypes::lvl_Restart);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Long);
					m_oBcw.m_oStream.WriteLong(nVal);
				}
			}
			
			if(false != lvl.m_oStart.IsInit())
			{
				const ComplexTypes::Word::CDecimalNumber& oVal = lvl.m_oStart.get();
				if(oVal.m_oVal.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerNumTypes::lvl_Start);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Long);
					m_oBcw.m_oStream.WriteLong(oVal.m_oVal.get().GetValue());
				}
			}
			
			if(false != lvl.m_oSuffix.IsInit())
			{
				const ComplexTypes::Word::CLevelSuffix& oSuff = lvl.m_oSuffix.get();
				if(false != oSuff.m_oVal.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerNumTypes::lvl_Suff);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
					switch(oSuff.m_oVal.get().GetValue())
					{
					case SimpleTypes::levelsuffixNothing: m_oBcw.m_oStream.WriteByte(numbering_suff_Nothing);break;
					case SimpleTypes::levelsuffixSpace: m_oBcw.m_oStream.WriteByte(numbering_suff_Space);break;
					case SimpleTypes::levelsuffixTab: m_oBcw.m_oStream.WriteByte(numbering_suff_Tab);break;
					default: m_oBcw.m_oStream.WriteByte(numbering_suff_Tab);break;
					}
				}
			}
			
			if(false != lvl.m_oPStyle.IsInit() && lvl.m_oPStyle->m_sVal.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerNumTypes::lvl_PStyle);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);
				m_oBcw.m_oStream.WriteString2(lvl.m_oPStyle->m_sVal.get2());
			}
			
			if(false != lvl.m_oPPr.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerNumTypes::lvl_ParaPr);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);
				nCurPos = m_oBcw.WriteItemWithLengthStart();
				bpPrs.Write_pPr(lvl.m_oPPr.get());
				m_oBcw.WriteItemWithLengthEnd(nCurPos);
			}
			
			if(false != lvl.m_oRPr.IsInit())
			{
				OOX::Logic::CRunProperty* p_rPr = NULL;
				if(false != lvl.m_oRPr.IsInit())
					p_rPr = lvl.m_oRPr.operator ->();

				m_oBcw.m_oStream.WriteByte(c_oSerNumTypes::lvl_TextPr);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);
				nCurPos = m_oBcw.WriteItemWithLengthStart();
				if(NULL != p_rPr)
					brPrs.Write_rPr(*p_rPr);
				m_oBcw.WriteItemWithLengthEnd(nCurPos);
			}
		};
		void WriteLevelText(const CString& text)
		{
			int nCurPos = 0;
			for(int i = 0, length = text.GetLength(); i < length; ++i)
			{
				if('%' == text[i] && i + 1 < length && '0' <= text[i + 1] && text[i + 1] <= '9')
				{
					nCurPos = m_oBcw.WriteItemStart(c_oSerNumTypes::lvl_LvlTextItem);

					m_oBcw.m_oStream.WriteByte(c_oSerNumTypes::lvl_LvlTextItemNum);
					int nCurPos2 = m_oBcw.WriteItemWithLengthStart();
					int nNum = text[i + 1] - '0';
					if(nNum > 0)
						nNum--;
					m_oBcw.m_oStream.WriteByte(nNum);
					m_oBcw.WriteItemWithLengthEnd(nCurPos2);

					m_oBcw.WriteItemEnd(nCurPos);
					i++;
				}
				else
				{
					nCurPos = m_oBcw.WriteItemStart(c_oSerNumTypes::lvl_LvlTextItem);

					m_oBcw.m_oStream.WriteByte(c_oSerNumTypes::lvl_LvlTextItemText);
					m_oBcw.m_oStream.WriteString2(CString(text[i]));
					if(NULL != m_oBcw.m_pEmbeddedFontsManager)
						m_oBcw.m_pEmbeddedFontsManager->CheckString(CString(text[i]));

					m_oBcw.WriteItemEnd(nCurPos);
				}
			}
		};
	};
	class BinaryOtherTableWriter
	{
		class EmbeddedBinaryWriter
		{
		private: Streams::CBufferedStream &m_oStream;
		public: EmbeddedBinaryWriter(Streams::CBufferedStream &oStream):m_oStream(oStream)
			{
			}
		public: void WriteBYTE(BYTE btVal)
			{
				m_oStream.WriteByte(btVal);
			}
		public: void WriteString(CString& sVal)
			{
				m_oStream.WriteString1(sVal);
			}
		public: void WriteULONG(long nVal)
			{
				m_oStream.WriteLong(nVal);
			}
		};
		BinaryCommonWriter m_oBcw;
		LPSAFEARRAY m_pTheme;
	public:
		BinaryOtherTableWriter(Streams::CBufferedStream &oCBufferedStream, NSFontCutter::CEmbeddedFontsManager* pEmbeddedFontsManager, LPSAFEARRAY pTheme):m_oBcw(oCBufferedStream, pEmbeddedFontsManager),m_pTheme(pTheme)
		{
		};
		void Write()
		{
			int nStart = m_oBcw.WriteItemWithLengthStart();
			WriteOtherContent();
			m_oBcw.WriteItemWithLengthEnd(nStart);
		}
		void WriteOtherContent()
		{
			
			
			
			
			
			if(NULL != m_oBcw.m_pEmbeddedFontsManager)
			{
				EmbeddedBinaryWriter oEmbeddedBinaryWriter(m_oBcw.m_oStream);
				int nStart = m_oBcw.WriteItemStart(c_oSerOtherTableTypes::EmbeddedFonts);
				m_oBcw.m_pEmbeddedFontsManager->WriteEmbeddedFonts<EmbeddedBinaryWriter>(&oEmbeddedBinaryWriter);
				m_oBcw.WriteItemEnd(nStart);
			}
			if(NULL != m_pTheme)
			{
				m_oBcw.m_oStream.WriteByte(c_oSerOtherTableTypes::DocxTheme);
				m_oBcw.WriteSafeArray(m_pTheme);
			}
		};
		
		
		
		

		
		
		
		
		
		
		
		
		
		
		
		
		
		
	};
	class BinaryDocumentTableWriter
	{
		BinaryCommonWriter m_oBcw;
		Binary_pPrWriter bpPrs;
		Binary_rPrWriter brPrs;
		OOX::Logic::CRunProperty* m_pCurDef_rPr;
		CString m_sCurParStyle;
		OOX::CSettings* m_oSettings;

		
		
		CSimpleArray<FldStruct*> m_aFldChars;
		int m_nSkipFldChar;
		CString m_sFldChar;
		SimpleTypes::EFldCharType m_eFldState;
		OOX::IFileContainer* m_oDocumentRels;
		PPTXFile::IAVSOfficeDrawingConverter* m_pOfficeDrawingConverter;
		CAtlMap<int, bool>* m_mapIgnoreComments;
	public:
		Binary_tblPrWriter btblPrs;
		OOX::Logic::CSectionProperty* pSectPr;
		bool m_bWriteSectPr;
	public:
		BinaryDocumentTableWriter(Streams::CBufferedStream &oCBufferedStream, NSFontCutter::CEmbeddedFontsManager* pEmbeddedFontsManager, OOX::CTheme* poTheme, OOX::CSettings* oSettings, DocWrapper::FontProcessor& oFontProcessor, OOX::IFileContainer* oDocumentRels, PPTXFile::IAVSOfficeDrawingConverter* oOfficeDrawingConverter, CAtlMap<int, bool>* mapIgnoreComments):m_oBcw(oCBufferedStream, pEmbeddedFontsManager),bpPrs(oCBufferedStream, pEmbeddedFontsManager, poTheme, oFontProcessor),brPrs(oCBufferedStream, pEmbeddedFontsManager, poTheme, oFontProcessor),m_oSettings(oSettings),m_oDocumentRels(oDocumentRels),btblPrs(oCBufferedStream, pEmbeddedFontsManager),m_pOfficeDrawingConverter(oOfficeDrawingConverter),m_mapIgnoreComments(mapIgnoreComments)
		{
			pSectPr = NULL;
			m_pCurDef_rPr = NULL;
			m_bWriteSectPr = false;
			m_nSkipFldChar = 0;
			m_eFldState = SimpleTypes::fldchartypeEnd;
		};
		~BinaryDocumentTableWriter()
		{
			RELEASEOBJECT(m_pCurDef_rPr);
			for(int i = 0, length = m_aFldChars.GetSize(); i < length; ++i)
			{
				RELEASEOBJECT(m_aFldChars[i]);
			}
		}
		void prepareOfficeDrawingConverter(PPTXFile::IAVSOfficeDrawingConverter* pOfficeDrawingConverter, CString& sDocumentPath, CSimpleArray<CString>& aShapeTypes)
		{
			BSTR bstrDocumentPath = sDocumentPath.AllocSysString();
			pOfficeDrawingConverter->SetRelsPath(bstrDocumentPath);
			SysFreeString(bstrDocumentPath);
			for(int i = 0, length = aShapeTypes.GetSize(); i < length; ++i)
			{
				CString& sShapeType = aShapeTypes[i];
				BSTR bstrShapeType = sShapeType.AllocSysString();
				pOfficeDrawingConverter->AddShapeType(bstrShapeType);
				SysFreeString(bstrShapeType);
			}
		}
		void Write(CSimpleArray<OOX::WritingElement*>& aElems)
		{
			int nStart = m_oBcw.WriteItemWithLengthStart();
			WriteDocumentContent(aElems);
			m_oBcw.WriteItemWithLengthEnd(nStart);
		};
		void WriteDocumentContent(const CSimpleArray<OOX::WritingElement*>& aElems)
		{
			int nCurPos = 0;
			for ( size_t i = 0, length = aElems.GetSize(); i < length; ++i )
			{
				OOX::WritingElement* item = aElems[i];
				if ( OOX::et_w_p == item->getType())
				{
					OOX::Logic::CParagraph* pParagraph = static_cast<OOX::Logic::CParagraph*>(item);
					
					OOX::Logic::CParagraphProperty* pPr = NULL;
					OOX::Logic::CParagraphProperty* pPr_Ref = NULL;
					for(int i = 0, length = pParagraph->m_arrItems.GetSize(); i < length; ++i)
					{
						OOX::WritingElement* pElem = pParagraph->m_arrItems[i];
						if(OOX::et_w_pPr == pElem->getType())
						{
							pPr_Ref = static_cast<OOX::Logic::CParagraphProperty*>(pElem);
							if(NULL == pPr)
								pPr = new OOX::Logic::CParagraphProperty();
							*pPr = OOX::Logic::CParagraphProperty::Merge(*pPr_Ref, *pPr);
						}
					}
					
					
					if(false == (NULL != pPr && pPr->m_oSectPr.IsInit() && 1 == pParagraph->m_arrItems.GetSize()))
					{
						m_oBcw.m_oStream.WriteByte(c_oSerParType::Par);
						nCurPos = m_oBcw.WriteItemWithLengthStart();
						WriteParapraph(*pParagraph, pPr);
						m_oBcw.WriteItemWithLengthEnd(nCurPos);
					}
					RELEASEOBJECT(pPr);
				}
				else if(OOX::et_w_tbl == item->getType())
				{
					OOX::Logic::CTbl* pTbl = static_cast<OOX::Logic::CTbl*>(item);
					m_oBcw.m_oStream.WriteByte(c_oSerParType::Table);
					nCurPos = m_oBcw.WriteItemWithLengthStart();
					WriteDocTable(*pTbl);
					m_oBcw.WriteItemWithLengthEnd(nCurPos);
				}
				else if(OOX::et_w_sdt == item->getType())
				{
					OOX::Logic::CSdt* pStd = static_cast<OOX::Logic::CSdt*>(item);
					if(pStd->m_oSdtContent.IsInit())
						WriteDocumentContent(pStd->m_oSdtContent.get().m_arrItems);
				}
				else if(OOX::et_w_smartTag == item->getType())
				{
					OOX::Logic::CSmartTag* pSmartTag = static_cast<OOX::Logic::CSmartTag*>(item);
					WriteDocumentContent(pSmartTag->m_arrItems);
				}
				else if(OOX::et_w_dir == item->getType())
				{
					OOX::Logic::CDir* pDir = static_cast<OOX::Logic::CDir*>(item);
					WriteDocumentContent(pDir->m_arrItems);
				}
				else if(OOX::et_w_bdo == item->getType())
				{
					OOX::Logic::CBdo* pBdo = static_cast<OOX::Logic::CBdo*>(item);
					WriteDocumentContent(pBdo->m_arrItems);
				}
			}
			
			if(true == m_bWriteSectPr && NULL != pSectPr)
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSerParType::sectPr);
				WriteSectPr(pSectPr);
				m_oBcw.WriteItemEnd(nCurPos);
			}
		};
		void WriteParapraph(OOX::Logic::CParagraph& par, OOX::Logic::CParagraphProperty* pPr)
		{
			int nCurPos = 0;
			OOX::Logic::CRunProperty* pPr_rPr = NULL;
			RELEASEOBJECT(m_pCurDef_rPr);
			
			if(NULL != pPr)
			{
				m_oBcw.m_oStream.WriteByte(c_oSerParType::pPr);
				nCurPos = m_oBcw.WriteItemWithLengthStart();
				bpPrs.Write_pPr(*pPr);
				m_oBcw.WriteItemWithLengthEnd(nCurPos);

				if(pPr->m_oRPr.IsInit())
				{
					pPr_rPr = new OOX::Logic::CRunProperty();
					(*pPr_rPr) = pPr->m_oRPr.get();
				}
			}

			
			m_oBcw.m_oStream.WriteByte(c_oSerParType::Content);
			nCurPos = m_oBcw.WriteItemWithLengthStart();
			WriteParagraphContent(par.m_arrItems, &pPr_rPr);
			m_oBcw.WriteItemWithLengthEnd(nCurPos);

			RELEASEOBJECT(pPr_rPr);
		};
	FldStruct* ParseField(CString& sFld)
	{
		sFld.Trim();
		FldStruct* pRes = NULL;
		int nIndex = 0;
		if(-1 != (nIndex = sFld.Find(_T("TOC"))))
		{
			pRes = new FldStruct(sFld, fieldstruct_toc);
		}
		else if(-1 != (nIndex = sFld.Find(_T("PAGE"))))
		{
			CString sFindStr(_T("PAGE"));
			bool bPage = true;
			
			if(nIndex + sFindStr.GetLength() < sFld.GetLength())
			{
				TCHAR cNextChar = sFld[nIndex + sFindStr.GetLength()];
				if('A' <= cNextChar && cNextChar <= 'Z')
				{
					bPage = false;
				}
			}
			if(bPage)
			{
				pRes = new FldStruct(sFld, fieldstruct_pagenum);
			}
		}
		else if(-1 != (nIndex = sFld.Find(_T("HYPERLINK"))))
		{
			if(-1 == sFld.Find(_T("\\l")))
				pRes = new FldStruct(sFld, fieldstruct_hyperlink);
			else
				pRes = new FldStruct(sFld, fieldstruct_locallink);
		}
		if(NULL == pRes)
			pRes = new FldStruct(sFld, fieldstruct_none);
		return pRes;
	}
		bool WriteField(CString fld, FldStruct** ppFldStruct, bool bWrapRun)
		{
			bool bRes = false;
			FldStruct* pFldStruct = ParseField(fld);
			if(fieldstruct_pagenum == pFldStruct->GetType() || fieldstruct_hyperlink == pFldStruct->GetType())
			{
				int nCurPos = 0;
				int nCurPos2 = 0;
				if(bWrapRun)
				{
					nCurPos = m_oBcw.WriteItemStart(c_oSerParType::Run);
					nCurPos2 = m_oBcw.WriteItemStart(c_oSerRunType::Content);
				}
				if(fieldstruct_pagenum == pFldStruct->GetType())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerRunType::pagenum);
					m_oBcw.m_oStream.WriteLong(c_oSerPropLenType::Null);
					bRes = true;
				}
				else if(fieldstruct_hyperlink == pFldStruct->GetType())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerRunType::fldstart);
					m_oBcw.m_oStream.WriteString2(pFldStruct->m_sFld);
				}
				if(bWrapRun)
				{
					m_oBcw.WriteItemEnd(nCurPos2);
					m_oBcw.WriteItemEnd(nCurPos);
				}
			}
			if(NULL != ppFldStruct)
				(*ppFldStruct) = pFldStruct;
			else
				RELEASEOBJECT(pFldStruct);
			return bRes;
		}
		void WriteParagraphContent(const CSimpleArray<OOX::WritingElement *>& Content, OOX::Logic::CRunProperty** pPr_rPr, bool bHyperlink = false)
		{
			int nCurPos = 0;
			
			for(int i = 0, length = m_aFldChars.GetSize(); i < length; ++i)
			{
				FldStruct* pFldStruct= m_aFldChars[i];
				if(fieldstruct_hyperlink == pFldStruct->GetType())
				{
					int nCurPos = m_oBcw.WriteItemStart(c_oSerParType::Run);
					int nCurPos2 = m_oBcw.WriteItemStart(c_oSerRunType::Content);
					m_oBcw.m_oStream.WriteByte(c_oSerRunType::fldstart);
					m_oBcw.m_oStream.WriteString2(pFldStruct->m_sFld);
					m_oBcw.WriteItemEnd(nCurPos2);
					m_oBcw.WriteItemEnd(nCurPos);
					break;
				}
			}
			for ( int i = 0, length = Content.GetSize(); i < length; ++i )
			{
				OOX::WritingElement* item = Content[i];
				switch (item->getType())
				{
				case OOX::et_w_fldSimple:
					{
						OOX::Logic::CFldSimple* pFldSimple = static_cast<OOX::Logic::CFldSimple*>(item);
						bool bUseFieldContent = false;
						FldStruct* pFldStruct = NULL;
						if(pFldSimple->m_sInstr.IsInit())
						{
							if(false == WriteField(pFldSimple->m_sInstr.get(), &pFldStruct, true))
								bUseFieldContent = true;
						}
						if(true == bUseFieldContent)
						{
							WriteParagraphContent(pFldSimple->m_arrItems, NULL);
						}
						if( NULL != pFldStruct && fieldstruct_hyperlink == pFldStruct->GetType())
						{
							int nCurPos = m_oBcw.WriteItemStart(c_oSerParType::Run);
							int nCurPos2 = m_oBcw.WriteItemStart(c_oSerRunType::Content);
							m_oBcw.m_oStream.WriteByte(c_oSerRunType::fldend);
							m_oBcw.m_oStream.WriteLong(c_oSerPropLenType::Null);
							m_oBcw.WriteItemEnd(nCurPos2);
							m_oBcw.WriteItemEnd(nCurPos);
						}
						RELEASEOBJECT(pFldStruct);
						break;
					}
				case OOX::et_w_hyperlink:
					{
						OOX::Logic::CHyperlink* pHyperlink = static_cast<OOX::Logic::CHyperlink*>(item);
						WriteHyperlink(pHyperlink);
						break;
					}
				case OOX::et_w_pPr:
					break;
				case OOX::et_w_r:
					{
						OOX::Logic::CRun* pRun = static_cast<OOX::Logic::CRun*>(item);
						WriteRun(pRun->m_arrItems, bHyperlink);
						break;
					}
				case OOX::et_w_sdt:
					{
						OOX::Logic::CSdt* pStd = static_cast<OOX::Logic::CSdt*>(item);
						if(pStd->m_oSdtContent.IsInit())
							WriteParagraphContent(pStd->m_oSdtContent.get().m_arrItems, NULL);
						break;
					}
				case OOX::et_w_smartTag:
					{
						OOX::Logic::CSmartTag* pSmartTag = static_cast<OOX::Logic::CSmartTag*>(item);
						WriteParagraphContent(pSmartTag->m_arrItems, NULL);
						break;
					}
				case OOX::et_w_dir:
					{
						OOX::Logic::CDir* pDir = static_cast<OOX::Logic::CDir*>(item);
						WriteParagraphContent(pDir->m_arrItems, NULL);
						break;
					}
				case OOX::et_w_bdo:
					{
						OOX::Logic::CBdo* pBdo = static_cast<OOX::Logic::CBdo*>(item);
						WriteParagraphContent(pBdo->m_arrItems, NULL);
						break;
					}
				case OOX::et_w_commentRangeStart:
					{
						OOX::Logic::CCommentRangeStart* pCommentRangeStart = static_cast<OOX::Logic::CCommentRangeStart*>(item);
						WriteComment(OOX::et_w_commentRangeStart, pCommentRangeStart->m_oId);
						break;
					}
				case OOX::et_w_commentRangeEnd:
					{
						OOX::Logic::CCommentRangeEnd* pCommentRangeEnd = static_cast<OOX::Logic::CCommentRangeEnd*>(item);
						WriteComment(OOX::et_w_commentRangeEnd, pCommentRangeEnd->m_oId);
						break;
					}
				
				}
			}
			
			for(int i = 0, length = m_aFldChars.GetSize(); i < length; ++i)
			{
				FldStruct* pFldStruct= m_aFldChars[i];
				if(fieldstruct_hyperlink == pFldStruct->GetType())
				{
					int nCurPos = m_oBcw.WriteItemStart(c_oSerParType::Run);
					int nCurPos2 = m_oBcw.WriteItemStart(c_oSerRunType::Content);
					m_oBcw.m_oStream.WriteByte(c_oSerRunType::fldend);
					m_oBcw.m_oStream.WriteLong(c_oSerPropLenType::Null);
					m_oBcw.WriteItemEnd(nCurPos2);
					m_oBcw.WriteItemEnd(nCurPos);
					break;
				}
			}
		};
		void WriteComment(OOX::EElementType eType, nullable<SimpleTypes::CDecimalNumber<>>& oId)
		{
			int nCurPos = 0;
			if(oId.IsInit() && (NULL == m_mapIgnoreComments || NULL == m_mapIgnoreComments->Lookup(oId->GetValue())))
			{
				switch(eType)
				{
				case OOX::et_w_commentRangeStart: nCurPos = m_oBcw.WriteItemStart(c_oSerParType::CommentStart);break;
				case OOX::et_w_commentRangeEnd: nCurPos = m_oBcw.WriteItemStart(c_oSerParType::CommentEnd);break;

				case OOX::et_w_commentReference: nCurPos = m_oBcw.WriteItemStart(c_oSerRunType::CommentReference);break;
				}

				int nCurPos2 = m_oBcw.WriteItemStart(c_oSer_CommentsType::Id);
				m_oBcw.m_oStream.WriteLong(oId->GetValue());
				m_oBcw.WriteItemEnd(nCurPos2);
				m_oBcw.WriteItemEnd(nCurPos);
			}
		}
		void WriteHyperlink(OOX::Logic::CHyperlink* pHyperlink)
		{
			int nCurPos = 0;
			CString sField;
			CString sLink;
			CString sTooltip;
			if(pHyperlink->m_oId.IsInit())
			{
				OOX::Rels::CRelationShip* oRels = NULL;
				if(NULL != m_oDocumentRels)
				{
					smart_ptr<OOX::File> pFile = m_oDocumentRels->Find( OOX::RId(pHyperlink->m_oId.get().GetValue()));
					if (pFile.IsInit() && OOX::FileTypes::HyperLink == pFile->type())
					{
						OOX::HyperLink* pHyperlinkFile = static_cast<OOX::HyperLink*>(pFile.operator ->());
						sLink = pHyperlinkFile->Uri().GetPath();
						if(pHyperlink->m_sAnchor.IsInit())
						{
							sLink += _T("#") + pHyperlink->m_sAnchor.get();
						}
					}
				}

				if(pHyperlink->m_sTooltip.IsInit())
					sTooltip = pHyperlink->m_sTooltip.get();
			}
			
			if(!sLink.IsEmpty())
			{
				sLink.Replace(_T("\""), _T("\\\""));
				sTooltip.Replace(_T("\""), _T("\\\""));
				if(sTooltip.IsEmpty())
					sField.Format(_T("HYPERLINK \"%s\""), sLink);
				else
					sField.Format(_T("HYPERLINK \"%s\" \\o \"%s\""), sLink, sTooltip);

				int nCurPos2 = 0;
				int nCurPos3 = 0;
				nCurPos = m_oBcw.WriteItemStart(c_oSerParType::Run);
				nCurPos2 = m_oBcw.WriteItemStart(c_oSerRunType::Content);
				m_oBcw.m_oStream.WriteByte(c_oSerRunType::fldstart);
				m_oBcw.m_oStream.WriteString2(sField);
				m_oBcw.WriteItemWithLengthEnd(nCurPos2);
				m_oBcw.WriteItemWithLengthEnd(nCurPos);

				WriteParagraphContent(pHyperlink->m_arrItems, NULL, true);

				nCurPos = m_oBcw.WriteItemStart(c_oSerParType::Run);
				nCurPos2 = m_oBcw.WriteItemStart(c_oSerRunType::Content);
				m_oBcw.m_oStream.WriteByte(c_oSerRunType::fldend);
				m_oBcw.m_oStream.WriteLong(c_oSerPropLenType::Null);
				m_oBcw.WriteItemWithLengthEnd(nCurPos2);
				m_oBcw.WriteItemWithLengthEnd(nCurPos);
			}
			else
			{
				WriteParagraphContent(pHyperlink->m_arrItems, NULL, true);
			}
		}
		OOX::Logic::CRunProperty* getRunStyle(CSimpleArray<OOX::WritingElement*>& m_arrItems)
		{
			OOX::Logic::CRunProperty* oCur_rPr = NULL;
			for ( int i = 0, length = m_arrItems.GetSize(); i < length; ++i )
			{
				OOX::WritingElement* item = m_arrItems[i];
				if(OOX::et_w_rPr == item->getType())
				{
					oCur_rPr = static_cast<OOX::Logic::CRunProperty*>(item);
					break;
				}
			}
			return oCur_rPr;
		}
		void WriteRun(CSimpleArray<OOX::WritingElement*>& m_arrItems, bool bHyperlink = false)
		{
			int nCurPos = 0;
			int nIndexStart = 0;
			int nLength = m_arrItems.GetSize();
			bool bWasText = false;
			
			for(int i = 0; i < nLength; ++i)
			{
				OOX::WritingElement* item = m_arrItems[i];
				if(OOX::et_w_sym == item->getType())
				{
					if(bWasText)
					{
						bWasText = false;
						WritePreparedRun(m_arrItems, bHyperlink, nIndexStart, i);
					}
					nCurPos = m_oBcw.WriteItemStart(c_oSerParType::Run);
					WritePreparedRun(m_arrItems, bHyperlink, i, i + 1);
					m_oBcw.WriteItemWithLengthEnd(nCurPos);
					nIndexStart = i + 1;
				}
				else if(OOX::et_w_rPr != item->getType())
					bWasText = true;
			}
			if(nIndexStart < nLength)
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSerParType::Run);
				WritePreparedRun(m_arrItems, bHyperlink, nIndexStart, nLength);
				m_oBcw.WriteItemWithLengthEnd(nCurPos);
			}
		}
		void WriteMathArgNodes(const CSimpleArray<OOX::WritingElement*>& m_arrItems)
		{
			for(int i = 0; i< m_arrItems.GetSize(); ++i)
			{
				OOX::WritingElement* item = m_arrItems[i];
				OOX::EElementType eType = item->getType();
				int nCurPos = 0;
				switch(eType)
				{
				case OOX::et_m_acc:
					{
						OOX::Logic::CAcc* pAcc = static_cast<OOX::Logic::CAcc*>(item);
						nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathContentType::Acc);

						if ( pAcc->m_oAccPr.IsInit() )
							WriteMathAccPr(pAcc->m_oAccPr.get());
						if ( pAcc->m_oElement.IsInit() )
							WriteMathElement(pAcc->m_oElement.get());
						m_oBcw.WriteItemEnd(nCurPos);
						break;
					}
				case OOX::et_m_argPr:
					{
						OOX::Logic::CArgPr* pArgPr = static_cast<OOX::Logic::CArgPr*>(item);
						nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathContentType::ArgPr);

						if ( pArgPr->m_oArgSz.IsInit() )
							WriteMathArgSz(pArgPr->m_oArgSz.get());	
						m_oBcw.WriteItemEnd(nCurPos);
						break;
					}
				case OOX::et_m_bar:
					{
						OOX::Logic::CBar* pBar = static_cast<OOX::Logic::CBar*>(item);
						nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathContentType::Bar);

						if ( pBar->m_oBarPr.IsInit() )
							WriteMathBarPr(pBar->m_oBarPr.get());
						if ( pBar->m_oElement.IsInit() )
							WriteMathElement(pBar->m_oElement.get());
						m_oBcw.WriteItemEnd(nCurPos);
						break;
					}
				case OOX::et_m_borderBox:
					{
						OOX::Logic::CBorderBox* pBorderBox = static_cast<OOX::Logic::CBorderBox*>(item);
						nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathContentType::BorderBox);

						if ( pBorderBox->m_oBorderBoxPr.IsInit() )
							WriteMathBorderBoxPr(pBorderBox->m_oBorderBoxPr.get());
						if ( pBorderBox->m_oElement.IsInit() )
							WriteMathElement(pBorderBox->m_oElement.get());
						m_oBcw.WriteItemEnd(nCurPos);
						break;
					}
				case OOX::et_m_box:
					{
						OOX::Logic::CBox* pBox = static_cast<OOX::Logic::CBox*>(item);
						nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathContentType::Box);

						if ( pBox->m_oBoxPr.IsInit() )
							WriteMathBoxPr(pBox->m_oBoxPr.get());
						if ( pBox->m_oElement.IsInit() )
							WriteMathElement(pBox->m_oElement.get());
						m_oBcw.WriteItemEnd(nCurPos);
						break;
					}
				case OOX::et_m_ctrlPr:
					{
						OOX::Logic::CCtrlPr* pCtrlPr = static_cast<OOX::Logic::CCtrlPr*>(item);
						nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathContentType::CtrlPr);

						if ( pCtrlPr->m_oRPr.IsInit() )
						{
							int nCurPos2 = m_oBcw.WriteItemStart(c_oSerRunType::rPr);
							brPrs.Write_rPr(pCtrlPr->m_oRPr.get());
							m_oBcw.WriteItemEnd(nCurPos2);
						}
						m_oBcw.WriteItemEnd(nCurPos);
						break;
					}
				case OOX::et_m_d:
					{
						OOX::Logic::CDelimiter* pDelimiter = static_cast<OOX::Logic::CDelimiter*>(item);
						nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathContentType::Delimiter);						

						WriteMathDelimiter(pDelimiter->m_arrItems, pDelimiter->m_lColumn);			
						m_oBcw.WriteItemEnd(nCurPos);
						break;
					}
				case OOX::et_m_eqArr:
					{
						OOX::Logic::CEqArr* pEqArr = static_cast<OOX::Logic::CEqArr*>(item);
						nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathContentType::EqArr);

						WriteMathEqArr(pEqArr->m_arrItems, pEqArr->m_lRow);			
						m_oBcw.WriteItemEnd(nCurPos);
						break;
					}
				case OOX::et_m_f:
					{
						OOX::Logic::CFraction* pFraction = static_cast<OOX::Logic::CFraction*>(item);
						nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathContentType::Fraction);

						if ( pFraction->m_oFPr.IsInit() )
							WriteMathFPr(pFraction->m_oFPr.get());
						if ( pFraction->m_oDen.IsInit() )
							WriteMathDen(pFraction->m_oDen.get());						
						if ( pFraction->m_oNum.IsInit() )
							WriteMathNum(pFraction->m_oNum.get());
											
						m_oBcw.WriteItemEnd(nCurPos);
						break;
					}
				case OOX::et_m_func:
					{
						OOX::Logic::CFunc* pFunc = static_cast<OOX::Logic::CFunc*>(item);
						nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathContentType::Func);

						if ( pFunc->m_oFuncPr.IsInit() )
							WriteMathFuncPr(pFunc->m_oFuncPr.get());
						if ( pFunc->m_oElement.IsInit() )
							WriteMathElement(pFunc->m_oElement.get());
						if ( pFunc->m_oFName.IsInit() )
							WriteMathFName(pFunc->m_oFName.get());						
											
						m_oBcw.WriteItemEnd(nCurPos);
						break;
					}
				case OOX::et_m_groupChr:
					{
						OOX::Logic::CGroupChr* pGroupChr = static_cast<OOX::Logic::CGroupChr*>(item);
						nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathContentType::GroupChr);

						if ( pGroupChr->m_oGroupChrPr.IsInit() )
							WriteMathGroupChrPr(pGroupChr->m_oGroupChrPr.get());
						if ( pGroupChr->m_oElement.IsInit() )
							WriteMathElement(pGroupChr->m_oElement.get());						
											
						m_oBcw.WriteItemEnd(nCurPos);
						break;
					}
				case OOX::et_m_limLow:
					{
						OOX::Logic::CLimLow* pLimLow = static_cast<OOX::Logic::CLimLow*>(item);
						nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathContentType::LimLow);

						if ( pLimLow->m_oLimLowPr.IsInit() )
							WriteMathLimLowPr(pLimLow->m_oLimLowPr.get());
						if ( pLimLow->m_oElement.IsInit() )
							WriteMathElement(pLimLow->m_oElement.get());
						if ( pLimLow->m_oLim.IsInit() )
							WriteMathLim(pLimLow->m_oLim.get());						
											
						m_oBcw.WriteItemEnd(nCurPos);
						break;
					}
				case OOX::et_m_limUpp:
					{
						OOX::Logic::CLimUpp* pLimUpp = static_cast<OOX::Logic::CLimUpp*>(item);
						nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathContentType::LimUpp);

						if ( pLimUpp->m_oLimUppPr.IsInit() )
							WriteMathLimUppPr(pLimUpp->m_oLimUppPr.get());
						if ( pLimUpp->m_oElement.IsInit() )
							WriteMathElement(pLimUpp->m_oElement.get());
						if ( pLimUpp->m_oLim.IsInit() )
							WriteMathLim(pLimUpp->m_oLim.get());						
											
						m_oBcw.WriteItemEnd(nCurPos);
						break;
					}
				case OOX::et_m_m:
					{
						OOX::Logic::CMatrix* pMatrix = static_cast<OOX::Logic::CMatrix*>(item);
						nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathContentType::Matrix);

						WriteMathMatrix(pMatrix->m_arrItems, pMatrix->m_lRow);			
						m_oBcw.WriteItemEnd(nCurPos);
						break;
					}
				case OOX::et_m_nary:
					{
						OOX::Logic::CNary* pNary = static_cast<OOX::Logic::CNary*>(item);
						nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathContentType::Nary);

						if ( pNary->m_oNaryPr.IsInit() )
							WriteMathNaryPr(pNary->m_oNaryPr.get());
						if ( pNary->m_oSub.IsInit() )
							WriteMathSub(pNary->m_oSub.get());
						if ( pNary->m_oSup.IsInit() )
							WriteMathSup(pNary->m_oSup.get());
						if ( pNary->m_oElement.IsInit() )
							WriteMathElement(pNary->m_oElement.get());						
											
						m_oBcw.WriteItemEnd(nCurPos);
						break;
					}
				case OOX::et_m_oMath:
					{
						OOX::Logic::COMath* pOMath = static_cast<OOX::Logic::COMath*>(item);
						nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathContentType::OMath);
						WriteMathArgNodes(pOMath->m_arrItems);			
						m_oBcw.WriteItemEnd(nCurPos);
						break;
					}
				case OOX::et_m_oMathPara:
					{
						OOX::Logic::COMathPara* pOMathPara = static_cast<OOX::Logic::COMathPara*>(item);
						nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathContentType::OMathPara);

						if ( pOMathPara->m_oOMath.IsInit() )
							WriteMathOMath(pOMathPara->m_oOMath.get());
						if ( pOMathPara->m_oOMathParaPr.IsInit() )
							WriteMathOMathParaPr(pOMathPara->m_oOMathParaPr.get());
											
						m_oBcw.WriteItemEnd(nCurPos);
						break;
					}
				case OOX::et_m_phant:
					{
						OOX::Logic::CPhant* pPhant = static_cast<OOX::Logic::CPhant*>(item);
						nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathContentType::Phant);

						if ( pPhant->m_oPhantPr.IsInit() )
							WriteMathPhantPr(pPhant->m_oPhantPr.get());
						if ( pPhant->m_oElement.IsInit() )
							WriteMathElement(pPhant->m_oElement.get());						
											
						m_oBcw.WriteItemEnd(nCurPos);
						break;
					}
				case OOX::et_m_r:
					{
						OOX::Logic::CMRun* pMRun = static_cast<OOX::Logic::CMRun*>(item);
						nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathContentType::MRun);

						if ( pMRun->m_oMRPr.IsInit() )
							WriteMathMRPr(pMRun->m_oMRPr.get());
						if ( pMRun->m_oRPr.IsInit() )
						{
							int nCurPos2 = m_oBcw.WriteItemStart(c_oSer_OMathContentType::RPr);
							brPrs.Write_rPr(pMRun->m_oRPr.get());
							m_oBcw.WriteItemEnd(nCurPos2);
						}
						if ( pMRun->m_oMText.IsInit() )
							WriteMathText(pMRun->m_oMText.get());						
											
						m_oBcw.WriteItemEnd(nCurPos);
						break;
					}
				case OOX::et_m_rad:
					{
						OOX::Logic::CRad* pRad = static_cast<OOX::Logic::CRad*>(item);
						nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathContentType::Rad);

						if ( pRad->m_oRadPr.IsInit() )
							WriteMathRadPr(pRad->m_oRadPr.get());
						if ( pRad->m_oDeg.IsInit() )
							WriteMathDeg(pRad->m_oDeg.get());
						if ( pRad->m_oElement.IsInit() )
							WriteMathElement(pRad->m_oElement.get());						
											
						m_oBcw.WriteItemEnd(nCurPos);
						break;
					}
				case OOX::et_m_sPre:
					{
						OOX::Logic::CSPre* pSPre = static_cast<OOX::Logic::CSPre*>(item);
						nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathContentType::SPre);

						if ( pSPre->m_oSPrePr.IsInit() )
							WriteMathSPrePr(pSPre->m_oSPrePr.get());
						if ( pSPre->m_oSub.IsInit() )
							WriteMathSub(pSPre->m_oSub.get());
						if ( pSPre->m_oSup.IsInit() )
							WriteMathSup(pSPre->m_oSup.get());
						if ( pSPre->m_oElement.IsInit() )
							WriteMathElement(pSPre->m_oElement.get());						
											
						m_oBcw.WriteItemEnd(nCurPos);
						break;
					}
				case OOX::et_m_sSub:
					{
						OOX::Logic::CSSub* pSSub = static_cast<OOX::Logic::CSSub*>(item);
						int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathContentType::SSub);

						if ( pSSub->m_oSSubPr.IsInit() )
							WriteMathSSubPr(pSSub->m_oSSubPr.get());
						if ( pSSub->m_oSub.IsInit() )
							WriteMathSub(pSSub->m_oSub.get());
						if ( pSSub->m_oElement.IsInit() )
							WriteMathElement(pSSub->m_oElement.get());						
											
						m_oBcw.WriteItemEnd(nCurPos);
						break;
					}
				case OOX::et_m_sSubSup:
					{
						OOX::Logic::CSSubSup* pSSubSup = static_cast<OOX::Logic::CSSubSup*>(item);
						nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathContentType::SSubSup);

						if ( pSSubSup->m_oSSubSupPr.IsInit() )
							WriteMathSSubSupPr(pSSubSup->m_oSSubSupPr.get());
						if ( pSSubSup->m_oSub.IsInit() )
							WriteMathSub(pSSubSup->m_oSub.get());
						if ( pSSubSup->m_oSup.IsInit() )
							WriteMathSup(pSSubSup->m_oSup.get());
						if ( pSSubSup->m_oElement.IsInit() )
							WriteMathElement(pSSubSup->m_oElement.get());						
											
						m_oBcw.WriteItemEnd(nCurPos);
						break;
					}
				case OOX::et_m_sSup:
					{
						OOX::Logic::CSSup* pSSup = static_cast<OOX::Logic::CSSup*>(item);
						nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathContentType::SSup);

						if ( pSSup->m_oSSupPr.IsInit() )
							WriteMathSSupPr(pSSup->m_oSSupPr.get());
						if ( pSSup->m_oElement.IsInit() )
							WriteMathElement(pSSup->m_oElement.get());
						if ( pSSup->m_oSup.IsInit() )
							WriteMathSup(pSSup->m_oSup.get());												
											
						m_oBcw.WriteItemEnd(nCurPos);
						break;
					}
				}
			}
		}
		void WriteMathAccPr(const OOX::Logic::CAccPr &pAccPr)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathContentType::AccPr);

			if ( pAccPr.m_oChr.IsInit() )
				WriteMathChr(pAccPr.m_oChr.get());
			if ( pAccPr.m_oCtrlPr.IsInit() )
				WriteMathCtrlPr(pAccPr.m_oCtrlPr.get());
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathAln(const OOX::Logic::CAln &pAln)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathBottomNodesType::Aln);
			if (pAln.m_val.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_OMathBottomNodesValType::Val);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteBool(pAln.m_val->GetValue());
			}
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathAlnScr(const OOX::Logic::CAlnScr &pAlnScr)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathBottomNodesType::AlnScr);
			if (pAlnScr.m_val.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_OMathBottomNodesValType::Val);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteBool(pAlnScr.m_val->GetValue());
			}
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathArgPr(const OOX::Logic::CArgPr &pArgPr)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathContentType::ArgPr);

			if ( pArgPr.m_oArgSz.IsInit() )
				WriteMathArgSz(pArgPr.m_oArgSz.get());	
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathArgSz(const OOX::Logic::CArgSz &pArgSz)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathBottomNodesType::ArgSz);
			if (pArgSz.m_val.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_OMathBottomNodesValType::Val);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Long);
				m_oBcw.m_oStream.WriteLong(pArgSz.m_val->GetValue());
			}
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathBarPr(const OOX::Logic::CBarPr &pBarPr)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathContentType::BarPr);

			if ( pBarPr.m_oCtrlPr.IsInit() )
				WriteMathCtrlPr(pBarPr.m_oCtrlPr.get());
			if ( pBarPr.m_oPos.IsInit() )
				WriteMathPos(pBarPr.m_oPos.get());
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathBaseJc(const OOX::Logic::CBaseJc &pBaseJc)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathBottomNodesType::BaseJc);
			if (pBaseJc.m_val.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_OMathBottomNodesValType::Val);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteByte(pBaseJc.m_val->GetValue());
			}
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathBegChr(const OOX::Logic::CBegChr &pBegChr)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathBottomNodesType::BegChr);
			if (pBegChr.m_val.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_OMathBottomNodesValType::Val);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);
				m_oBcw.m_oStream.WriteString2(pBegChr.m_val->GetValue());
			}
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathBorderBoxPr(const OOX::Logic::CBorderBoxPr &pBorderBoxPr)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathContentType::BorderBoxPr);

			if ( pBorderBoxPr.m_oCtrlPr.IsInit() )
				WriteMathCtrlPr(pBorderBoxPr.m_oCtrlPr.get());

			if ( pBorderBoxPr.m_oHideBot.IsInit() )
				WriteMathHideBot(pBorderBoxPr.m_oHideBot.get());
			if ( pBorderBoxPr.m_oHideLeft.IsInit() )
				WriteMathHideLeft(pBorderBoxPr.m_oHideLeft.get());
			if ( pBorderBoxPr.m_oHideRight.IsInit() )
				WriteMathHideRight(pBorderBoxPr.m_oHideRight.get());
			if ( pBorderBoxPr.m_oHideTop.IsInit() )
				WriteMathHideTop(pBorderBoxPr.m_oHideTop.get());
			if ( pBorderBoxPr.m_oStrikeBLTR.IsInit() )
				WriteMathStrikeBLTR(pBorderBoxPr.m_oStrikeBLTR.get());
			if ( pBorderBoxPr.m_oStrikeH.IsInit() )
				WriteMathStrikeH(pBorderBoxPr.m_oStrikeH.get());
			if ( pBorderBoxPr.m_oStrikeTLBR.IsInit() )
				WriteMathStrikeTLBR(pBorderBoxPr.m_oStrikeTLBR.get());
			if ( pBorderBoxPr.m_oStrikeV.IsInit() )
				WriteMathStrikeV(pBorderBoxPr.m_oStrikeV.get());
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathBoxPr(const OOX::Logic::CBoxPr &pBoxPr)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathContentType::BoxPr);

			if ( pBoxPr.m_oAln.IsInit() )
				WriteMathAln(pBoxPr.m_oAln.get());
			if ( pBoxPr.m_oBrk.IsInit() )
				WriteMathBrk(pBoxPr.m_oBrk.get());
			if ( pBoxPr.m_oCtrlPr.IsInit() )
				WriteMathCtrlPr(pBoxPr.m_oCtrlPr.get());
			if ( pBoxPr.m_oDiff.IsInit() )
				WriteMathDiff(pBoxPr.m_oDiff.get());
			if ( pBoxPr.m_oNoBreak.IsInit() )
				WriteMathNoBreak(pBoxPr.m_oNoBreak.get());
			if ( pBoxPr.m_oOpEmu.IsInit() )
				WriteMathOpEmu(pBoxPr.m_oOpEmu.get());
			
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathBrk(const OOX::Logic::CBrk &pBrk)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathBottomNodesType::Brk);
			if (pBrk.m_alnAt.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_OMathBottomNodesValType::AlnAt);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Long);
				m_oBcw.m_oStream.WriteLong(pBrk.m_alnAt->GetValue());
			}
			
			else
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_OMathBottomNodesValType::Val);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);
				m_oBcw.m_oStream.WriteBool(false);
			}
			m_oBcw.WriteItemEnd(nCurPos);

		}
		void WriteMathCGp(const OOX::Logic::CCGp &pCGp)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathBottomNodesType::CGp);
			if (pCGp.m_val.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_OMathBottomNodesValType::Val);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Long);
				m_oBcw.m_oStream.WriteLong(pCGp.m_val->GetValue());
			}
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathCGpRule(const OOX::Logic::CCGpRule &pCGpRule)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathBottomNodesType::CGpRule);
			if (pCGpRule.m_val.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_OMathBottomNodesValType::Val);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteByte(pCGpRule.m_val->GetValue());
			}
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathChr(const OOX::Logic::CChr &pChr)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathBottomNodesType::Chr);
			if (pChr.m_val.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_OMathBottomNodesValType::Val);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);
				CString str = pChr.m_val->GetValue();
				m_oBcw.m_oStream.WriteString2(pChr.m_val->GetValue());
			}
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathCount(const OOX::Logic::CCount &pCount)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathBottomNodesType::Count);
			if (pCount.m_val.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_OMathBottomNodesValType::Val);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Long);
				m_oBcw.m_oStream.WriteLong(pCount.m_val->GetValue());
			}
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathCSp(const OOX::Logic::CCSp &pCSp)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathBottomNodesType::CSp);
			if (pCSp.m_val.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_OMathBottomNodesValType::Val);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Long);
				m_oBcw.m_oStream.WriteLong(pCSp.m_val->GetValue());
			}
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathCtrlPr(const OOX::Logic::CCtrlPr &pCtrlPr)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathBottomNodesType::CtrlPr);

			if ( pCtrlPr.m_oRPr.IsInit() )
			{
				int nCurPos2 = m_oBcw.WriteItemStart(c_oSerRunType::rPr);
				brPrs.Write_rPr(pCtrlPr.m_oRPr.get());
				m_oBcw.WriteItemEnd(nCurPos2);
			}
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathDelimiter(const CSimpleArray<OOX::WritingElement*>& m_arrItems, LONG &lColumn)
		{
			for(int i = 0; i< m_arrItems.GetSize(); ++i)
			{
				OOX::WritingElement* item = m_arrItems[i];
				OOX::EElementType eType = item->getType();
				int nCurPos = 0;
				switch(eType)
				{
				case OOX::et_m_dPr:
					{
						OOX::Logic::CDelimiterPr* pDelimiterPr = static_cast<OOX::Logic::CDelimiterPr*>(item);
						nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathContentType::DelimiterPr);

						if ( lColumn )
							WriteMathColumn (lColumn);
						if ( pDelimiterPr->m_oBegChr.IsInit() )
							WriteMathBegChr(pDelimiterPr->m_oBegChr.get());
						if ( pDelimiterPr->m_oEndChr.IsInit() )
							WriteMathEndChr(pDelimiterPr->m_oEndChr.get());
						if ( pDelimiterPr->m_oCtrlPr.IsInit() )
							WriteMathCtrlPr(pDelimiterPr->m_oCtrlPr.get());						
						if ( pDelimiterPr->m_oGrow.IsInit() )
							WriteMathGrow(pDelimiterPr->m_oGrow.get());
						if ( pDelimiterPr->m_oSepChr.IsInit() )
							WriteMathSepChr(pDelimiterPr->m_oSepChr.get());
						if ( pDelimiterPr->m_oShp.IsInit() )
							WriteMathShp(pDelimiterPr->m_oShp.get());

						m_oBcw.WriteItemEnd(nCurPos);
						break;
					}
				case OOX::et_m_e:
					{
						OOX::Logic::CElement* pElement = static_cast<OOX::Logic::CElement*>(item);
						nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathContentType::Element);

						WriteMathArgNodes(pElement->m_arrItems);

						m_oBcw.WriteItemEnd(nCurPos);
						break;
					}
				}
			}
		}
		void WriteMathDeg(const OOX::Logic::CDeg &pDeg)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathContentType::Deg);
			WriteMathArgNodes(pDeg.m_arrItems);			
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathDegHide(const OOX::Logic::CDegHide &pDegHide)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathBottomNodesType::DegHide);
			if (pDegHide.m_val.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_OMathBottomNodesValType::Val);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteBool(pDegHide.m_val->GetValue());
			}
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathDen(const OOX::Logic::CDen &pDen)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathContentType::Den);
			WriteMathArgNodes(pDen.m_arrItems);			
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathDiff(const OOX::Logic::CDiff &pDiff)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathBottomNodesType::Diff);
			if (pDiff.m_val.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_OMathBottomNodesValType::Val);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteBool(pDiff.m_val->GetValue());
			}
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathDelimiterPr(const OOX::Logic::CDelimiterPr &pDelimiterPr, long &lColumn)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathContentType::DelimiterPr);

			if ( lColumn )
				WriteMathColumn (lColumn);
			if ( pDelimiterPr.m_oBegChr.IsInit() )
				WriteMathBegChr(pDelimiterPr.m_oBegChr.get());
			if ( pDelimiterPr.m_oCtrlPr.IsInit() )
				WriteMathCtrlPr(pDelimiterPr.m_oCtrlPr.get());
			if ( pDelimiterPr.m_oEndChr.IsInit() )
				WriteMathEndChr(pDelimiterPr.m_oEndChr.get());
			if ( pDelimiterPr.m_oGrow.IsInit() )
				WriteMathGrow(pDelimiterPr.m_oGrow.get());
			if ( pDelimiterPr.m_oSepChr.IsInit() )
				WriteMathSepChr(pDelimiterPr.m_oSepChr.get());
			if ( pDelimiterPr.m_oShp.IsInit() )
				WriteMathShp(pDelimiterPr.m_oShp.get());
			
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathElement(const OOX::Logic::CElement &pElement)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathContentType::Element);
			WriteMathArgNodes(pElement.m_arrItems);			
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathEndChr(const OOX::Logic::CEndChr &pEndChr)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathBottomNodesType::EndChr);
			if (pEndChr.m_val.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_OMathBottomNodesValType::Val);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);
				m_oBcw.m_oStream.WriteString2(pEndChr.m_val->GetValue());
			}
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathEqArr(const CSimpleArray<OOX::WritingElement*>& m_arrItems, LONG& lRow)
		{
			for(int i = 0; i< m_arrItems.GetSize(); ++i)
			{
				OOX::WritingElement* item = m_arrItems[i];
				OOX::EElementType eType = item->getType();
				int nCurPos = 0;
				switch(eType)
				{
				case OOX::et_m_eqArrPr:
					{
						OOX::Logic::CEqArrPr* pEqArrPr = static_cast<OOX::Logic::CEqArrPr*>(item);
						nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathContentType::EqArrPr);

						if ( lRow )
							WriteMathRow (lRow);
						if ( pEqArrPr->m_oBaseJc.IsInit() )
							WriteMathBaseJc(pEqArrPr->m_oBaseJc.get());
						if ( pEqArrPr->m_oCtrlPr.IsInit() )
							WriteMathCtrlPr(pEqArrPr->m_oCtrlPr.get());
						if ( pEqArrPr->m_oMaxDist.IsInit() )
							WriteMathMaxDist(pEqArrPr->m_oMaxDist.get());
						if ( pEqArrPr->m_oObjDist.IsInit() )
							WriteMathObjDist(pEqArrPr->m_oObjDist.get());
						if ( pEqArrPr->m_oRSp.IsInit() )
							WriteMathRSp(pEqArrPr->m_oRSp.get());
						if ( pEqArrPr->m_oRSpRule.IsInit() )
							WriteMathRSpRule(pEqArrPr->m_oRSpRule.get());

						m_oBcw.WriteItemEnd(nCurPos);
						break;
					}
				case OOX::et_m_e:
					{
						OOX::Logic::CElement* pElement = static_cast<OOX::Logic::CElement*>(item);
						nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathContentType::Element);

						WriteMathArgNodes(pElement->m_arrItems);

						m_oBcw.WriteItemEnd(nCurPos);
						break;
					}
				}
			}
		}
		void WriteMathFName(const OOX::Logic::CFName &pFName)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathContentType::FName);
			WriteMathArgNodes(pFName.m_arrItems);			
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathFPr(const OOX::Logic::CFPr &pFPr)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathContentType::FPr);

			if ( pFPr.m_oCtrlPr.IsInit() )
				WriteMathCtrlPr(pFPr.m_oCtrlPr.get());
			if ( pFPr.m_oType.IsInit() )
				WriteMathType(pFPr.m_oType.get());
								
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathFuncPr(const OOX::Logic::CFuncPr &pFuncPr)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathContentType::FuncPr);

			if ( pFuncPr.m_oCtrlPr.IsInit() )
				WriteMathCtrlPr(pFuncPr.m_oCtrlPr.get());
								
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathGroupChrPr(const OOX::Logic::CGroupChrPr &pGroupChrPr)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathContentType::GroupChrPr);

			if ( pGroupChrPr.m_oChr.IsInit() )
				WriteMathChr(pGroupChrPr.m_oChr.get());
			if ( pGroupChrPr.m_oCtrlPr.IsInit() )
				WriteMathCtrlPr(pGroupChrPr.m_oCtrlPr.get());
			if ( pGroupChrPr.m_oPos.IsInit() )
				WriteMathPos(pGroupChrPr.m_oPos.get());
			if ( pGroupChrPr.m_oVertJc.IsInit() )
				WriteMathVertJc(pGroupChrPr.m_oVertJc.get());
								
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathGrow(const OOX::Logic::CGrow &pGrow)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathBottomNodesType::Grow);
			if (pGrow.m_val.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_OMathBottomNodesValType::Val);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteBool(pGrow.m_val->GetValue());
			}
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathHideBot(const OOX::Logic::CHideBot &pHideBot)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathBottomNodesType::HideBot);
			if (pHideBot.m_val.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_OMathBottomNodesValType::Val);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteBool(pHideBot.m_val->GetValue());
			}
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathHideLeft(const OOX::Logic::CHideLeft &pHideLeft)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathBottomNodesType::HideLeft);
			if (pHideLeft.m_val.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_OMathBottomNodesValType::Val);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteBool(pHideLeft.m_val->GetValue());
			}
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathHideRight(const OOX::Logic::CHideRight &pHideRight)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathBottomNodesType::HideRight);
			if (pHideRight.m_val.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_OMathBottomNodesValType::Val);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteBool(pHideRight.m_val->GetValue());
			}
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathHideTop(const OOX::Logic::CHideTop &pHideTop)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathBottomNodesType::HideTop);
			if (pHideTop.m_val.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_OMathBottomNodesValType::Val);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteBool(pHideTop.m_val->GetValue());
			}
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathMJc(const OOX::Logic::CMJc &pMJc)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathBottomNodesType::MJc);
			if (pMJc.m_val.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_OMathBottomNodesValType::Val);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteByte(pMJc.m_val->GetValue());
			}
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathLim(const OOX::Logic::CLim &pLim)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathContentType::Lim);
			WriteMathArgNodes(pLim.m_arrItems);			
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathLimLoc(const OOX::Logic::CLimLoc &pLimLoc)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathBottomNodesType::LimLoc);
			if (pLimLoc.m_val.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_OMathBottomNodesValType::Val);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteByte(pLimLoc.m_val->GetValue());
			}
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathColumn(const LONG &lColumn)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathBottomNodesType::Column);
			if (lColumn)
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_OMathBottomNodesValType::Val);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Long);
				m_oBcw.m_oStream.WriteLong(lColumn);
			}
			m_oBcw.WriteItemEnd(nCurPos);
		}	
		void WriteMathRow(const LONG &lRow)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathBottomNodesType::Row);
			if (lRow)
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_OMathBottomNodesValType::Val);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Long);
				m_oBcw.m_oStream.WriteLong(lRow);
			}
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathLimLowPr(const OOX::Logic::CLimLowPr &pLimLowPr)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathContentType::LimLowPr);

			if ( pLimLowPr.m_oCtrlPr.IsInit() )
				WriteMathCtrlPr(pLimLowPr.m_oCtrlPr.get());
								
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathLimUppPr(const OOX::Logic::CLimUppPr &pLimUppPr)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathContentType::LimUppPr);

			if ( pLimUppPr.m_oCtrlPr.IsInit() )
				WriteMathCtrlPr(pLimUppPr.m_oCtrlPr.get());
								
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathLit(const OOX::Logic::CLit &pLit)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathBottomNodesType::Lit);
			if (pLit.m_val.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_OMathBottomNodesValType::Val);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteBool(pLit.m_val->GetValue());
			}
			else
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_OMathBottomNodesValType::Val);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteBool(true);
			}
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathMatrix(const CSimpleArray<OOX::WritingElement*>& m_arrItems, LONG &lRow)
		{
			BOOL bColumn = false;
			for(int i = 0; i< m_arrItems.GetSize(); ++i)
			{
				OOX::WritingElement* item = m_arrItems[i];
				OOX::EElementType eType = item->getType();
				int nCurPos = 0;
				switch(eType)
				{
				case OOX::et_m_mPr:
					{
						OOX::Logic::CMPr* pMPr = static_cast<OOX::Logic::CMPr*>(item);
						nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathContentType::MPr);

						if (lRow)
							WriteMathRow(lRow);
						if ( pMPr->m_oBaseJc.IsInit() )
							WriteMathBaseJc(pMPr->m_oBaseJc.get());
						if ( pMPr->m_oCGp.IsInit() )
							WriteMathCGp(pMPr->m_oCGp.get());
						if ( pMPr->m_oCGpRule.IsInit() )
							WriteMathCGpRule(pMPr->m_oCGpRule.get());
						if ( pMPr->m_oCSp.IsInit() )
							WriteMathCSp(pMPr->m_oCSp.get());
						if ( pMPr->m_oCtrlPr.IsInit() )
							WriteMathCtrlPr(pMPr->m_oCtrlPr.get());
						if ( pMPr->m_oMcs.IsInit() )
							WriteMathMcs(pMPr->m_oMcs.get());
						if ( pMPr->m_oPlcHide.IsInit() )
							WriteMathPlcHide(pMPr->m_oPlcHide.get());
						if ( pMPr->m_oRSp.IsInit() )
							WriteMathRSp(pMPr->m_oRSp.get());
						if ( pMPr->m_oRSpRule.IsInit() )
							WriteMathRSpRule(pMPr->m_oRSpRule.get());

						m_oBcw.WriteItemEnd(nCurPos);
						break;
					}
				case OOX::et_m_mr:
					{
						OOX::Logic::CMr* pMr = static_cast<OOX::Logic::CMr*>(item);
						nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathContentType::Mr);

						WriteMathMr(pMr->m_arrItems);			

						m_oBcw.WriteItemEnd(nCurPos);
						break;
					}
				}
			}
		}
		void WriteMathMaxDist(const OOX::Logic::CMaxDist &pMaxDist)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathBottomNodesType::MaxDist);
			if (pMaxDist.m_val.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_OMathBottomNodesValType::Val);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteBool(pMaxDist.m_val->GetValue());
			}
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathMc(const OOX::Logic::CMc &pMc)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathContentType::Mc);

			if ( pMc.m_oMcPr.IsInit() )
				WriteMathMcPr(pMc.m_oMcPr.get());
								
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathMcJc(const OOX::Logic::CMcJc &pMcJc)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathBottomNodesType::McJc);
			if (pMcJc.m_val.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_OMathBottomNodesValType::Val);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteByte(pMcJc.m_val->GetValue());
			}
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathMcPr(const OOX::Logic::CMcPr &pMcPr)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathContentType::McPr);

			if ( pMcPr.m_oMcJc.IsInit() )
				WriteMathMcJc(pMcPr.m_oMcJc.get());
			if ( pMcPr.m_oCount.IsInit() )
				WriteMathCount(pMcPr.m_oCount.get());			
								
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathMcs(const OOX::Logic::CMcs &pMcs)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathBottomNodesType::Mcs);

			if ( pMcs.m_oMc.IsInit() )
				WriteMathMc(pMcs.m_oMc.get());
								
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathMPr(const OOX::Logic::CMPr &pMPr)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathContentType::MPr);

			if ( pMPr.m_oBaseJc.IsInit() )
				WriteMathBaseJc(pMPr.m_oBaseJc.get());
			if ( pMPr.m_oCGp.IsInit() )
				WriteMathCGp(pMPr.m_oCGp.get());
			if ( pMPr.m_oCGpRule.IsInit() )
				WriteMathCGpRule(pMPr.m_oCGpRule.get());
			if ( pMPr.m_oCSp.IsInit() )
				WriteMathCSp(pMPr.m_oCSp.get());
			if ( pMPr.m_oCtrlPr.IsInit() )
				WriteMathCtrlPr(pMPr.m_oCtrlPr.get());
			if ( pMPr.m_oMcs.IsInit() )
				WriteMathMcs(pMPr.m_oMcs.get());
			if ( pMPr.m_oPlcHide.IsInit() )
				WriteMathPlcHide(pMPr.m_oPlcHide.get());
			if ( pMPr.m_oRSp.IsInit() )
				WriteMathRSp(pMPr.m_oRSp.get());
			if ( pMPr.m_oRSpRule.IsInit() )
				WriteMathRSpRule(pMPr.m_oRSpRule.get());
								
			m_oBcw.WriteItemEnd(nCurPos);
		}		
		void WriteMathMr(const CSimpleArray<OOX::WritingElement*>& m_arrItems)
		{
			for(int i = 0; i< m_arrItems.GetSize(); ++i)
			{
				OOX::WritingElement* item = m_arrItems[i];
				OOX::EElementType eType = item->getType();
				int nCurPos = 0;
				if (eType == OOX::et_m_e)
				{
					OOX::Logic::CElement* pElement = static_cast<OOX::Logic::CElement*>(item);
					nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathContentType::Element);

					WriteMathArgNodes(pElement->m_arrItems);

					m_oBcw.WriteItemEnd(nCurPos);
				}
			}
		}
		void WriteMathNaryPr(const OOX::Logic::CNaryPr &pNaryPr)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathContentType::NaryPr);

			if ( pNaryPr.m_oChr.IsInit() )
				WriteMathChr(pNaryPr.m_oChr.get());
			if ( pNaryPr.m_oCtrlPr.IsInit() )
				WriteMathCtrlPr(pNaryPr.m_oCtrlPr.get());
			if ( pNaryPr.m_oGrow.IsInit() )
				WriteMathGrow(pNaryPr.m_oGrow.get());
			if ( pNaryPr.m_oLimLoc.IsInit() )
				WriteMathLimLoc(pNaryPr.m_oLimLoc.get());
			if ( pNaryPr.m_oSubHide.IsInit() )
				WriteMathSubHide(pNaryPr.m_oSubHide.get());
			if ( pNaryPr.m_oSupHide.IsInit() )
				WriteMathSupHide(pNaryPr.m_oSupHide.get());
								
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathNoBreak(const OOX::Logic::CNoBreak &pNoBreak)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathBottomNodesType::NoBreak);
			if (pNoBreak.m_val.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_OMathBottomNodesValType::Val);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteBool(pNoBreak.m_val->GetValue());
			}
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathNor(const OOX::Logic::CNor &pNor)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathBottomNodesType::Nor);
			m_oBcw.m_oStream.WriteByte(c_oSer_OMathBottomNodesValType::Val);
			m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
			if (pNor.m_val.IsInit())
				m_oBcw.m_oStream.WriteBool(pNor.m_val->GetValue());
			else 
				m_oBcw.m_oStream.WriteBool(false);
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathNum(const OOX::Logic::CNum &pNum)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathContentType::Num);
			WriteMathArgNodes(pNum.m_arrItems);			
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathObjDist(const OOX::Logic::CObjDist &pObjDist)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathBottomNodesType::ObjDist);
			if (pObjDist.m_val.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_OMathBottomNodesValType::Val);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteBool(pObjDist.m_val->GetValue());
			}
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathOMath(const OOX::Logic::COMath &pOMath)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathContentType::OMath);
			WriteMathArgNodes(pOMath.m_arrItems);			
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathOMathPara(const OOX::Logic::COMathPara &pOMathPara)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathContentType::OMathPara);

			if ( pOMathPara.m_oOMath.IsInit() )
				WriteMathOMath(pOMathPara.m_oOMath.get());
			if ( pOMathPara.m_oOMathParaPr.IsInit() )
				WriteMathOMathParaPr(pOMathPara.m_oOMathParaPr.get());
								
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathOMathParaPr(const OOX::Logic::COMathParaPr &pOMathParaPr)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathContentType::OMathParaPr);

			if ( pOMathParaPr.m_oMJc.IsInit() )
				WriteMathMJc(pOMathParaPr.m_oMJc.get());
								
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathOpEmu(const OOX::Logic::COpEmu &pOpEmu)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathBottomNodesType::OpEmu);
			if (pOpEmu.m_val.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_OMathBottomNodesValType::Val);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteBool(pOpEmu.m_val->GetValue());
			}
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathPhantPr(const OOX::Logic::CPhantPr &pPhantPr)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathContentType::PhantPr);

			if ( pPhantPr.m_oCtrlPr.IsInit() )
				WriteMathCtrlPr(pPhantPr.m_oCtrlPr.get());
			if ( pPhantPr.m_oShow.IsInit() )
				WriteMathShow(pPhantPr.m_oShow.get());
			if ( pPhantPr.m_oTransp.IsInit() )
				WriteMathTransp(pPhantPr.m_oTransp.get());
			if ( pPhantPr.m_oZeroAsc.IsInit() )
				WriteMathZeroAsc(pPhantPr.m_oZeroAsc.get());
			if ( pPhantPr.m_oZeroDesc.IsInit() )
				WriteMathZeroDesc(pPhantPr.m_oZeroDesc.get());
			if ( pPhantPr.m_oZeroWid.IsInit() )
				WriteMathZeroWid(pPhantPr.m_oZeroWid.get());
								
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathPlcHide(const OOX::Logic::CPlcHide &pPlcHide)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathBottomNodesType::PlcHide);
			if (pPlcHide.m_val.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_OMathBottomNodesValType::Val);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteBool(pPlcHide.m_val->GetValue());
			}
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathPos(const OOX::Logic::CPos &pPos)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathBottomNodesType::Pos);
			if (pPos.m_val.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_OMathBottomNodesValType::Val);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteByte(pPos.m_val->GetValue());
			}
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathRadPr(const OOX::Logic::CRadPr &pRadPr)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathContentType::RadPr);

			if ( pRadPr.m_oDegHide.IsInit() )
				WriteMathDegHide(pRadPr.m_oDegHide.get());
			if ( pRadPr.m_oCtrlPr.IsInit() )
				WriteMathCtrlPr(pRadPr.m_oCtrlPr.get());			
								
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathMRPr(const OOX::Logic::CMRPr &pMRPr)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathContentType::MRPr);

			if ( pMRPr.m_oAln.IsInit())
				WriteMathAln(pMRPr.m_oAln.get());
			if ( pMRPr.m_oBrk.IsInit() )
				WriteMathBrk(pMRPr.m_oBrk.get());
			if ( pMRPr.m_oLit.IsInit() )
				WriteMathLit(pMRPr.m_oLit.get());
			if ( pMRPr.m_oNor.IsInit() )
				WriteMathNor(pMRPr.m_oNor.get());
			if ( pMRPr.m_oScr.IsInit() )
				WriteMathScr(pMRPr.m_oScr.get());
			if ( pMRPr.m_oSty.IsInit() )
				WriteMathSty(pMRPr.m_oSty.get());
								
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathRSp(const OOX::Logic::CRSp &pRSp)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathBottomNodesType::RSp);
			if (pRSp.m_val.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_OMathBottomNodesValType::Val);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Long);
				m_oBcw.m_oStream.WriteLong(pRSp.m_val->GetValue());
			}
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathRSpRule(const OOX::Logic::CRSpRule &pRSpRule)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathBottomNodesType::RSpRule);
			if (pRSpRule.m_val.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_OMathBottomNodesValType::Val);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteByte(pRSpRule.m_val->GetValue());
			}
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathScr(const OOX::Logic::CScr &pScr)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathBottomNodesType::Scr);
			if (pScr.m_val.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_OMathBottomNodesValType::Val);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteByte(pScr.m_val->GetValue());
			}
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathSepChr(const OOX::Logic::CSepChr &pSepChr)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathBottomNodesType::SepChr);
			if (pSepChr.m_val.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_OMathBottomNodesValType::Val);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);
				m_oBcw.m_oStream.WriteString2(pSepChr.m_val->GetValue());
			}
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathShow(const OOX::Logic::CShow &pShow)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathBottomNodesType::Show);
			if (pShow.m_val.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_OMathBottomNodesValType::Val);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteBool(pShow.m_val->GetValue());
			}
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathShp(const OOX::Logic::CShp &pShp)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathBottomNodesType::Shp);
			if (pShp.m_val.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_OMathBottomNodesValType::Val);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteByte(pShp.m_val->GetValue());
			}
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathSPrePr(const OOX::Logic::CSPrePr &pSPrePr)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathContentType::SPrePr);

			if ( pSPrePr.m_oCtrlPr.IsInit() )
				WriteMathCtrlPr(pSPrePr.m_oCtrlPr.get());
								
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathSSubPr(const OOX::Logic::CSSubPr &pSSubPr)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathContentType::SSubPr);

			if ( pSSubPr.m_oCtrlPr.IsInit() )
				WriteMathCtrlPr(pSSubPr.m_oCtrlPr.get());
								
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathSSubSupPr(const OOX::Logic::CSSubSupPr &pSSubSupPr)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathContentType::SSubSupPr);

			if ( pSSubSupPr.m_oAlnScr.IsInit() )
				WriteMathAlnScr(pSSubSupPr.m_oAlnScr.get());
			if ( pSSubSupPr.m_oCtrlPr.IsInit() )
				WriteMathCtrlPr(pSSubSupPr.m_oCtrlPr.get());
								
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathSSupPr(const OOX::Logic::CSSupPr &pSSupPr)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathContentType::SSupPr);

			if ( pSSupPr.m_oCtrlPr.IsInit() )
				WriteMathCtrlPr(pSSupPr.m_oCtrlPr.get());
								
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathStrikeBLTR(const OOX::Logic::CStrikeBLTR &pStrikeBLTR)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathBottomNodesType::StrikeBLTR);
			if (pStrikeBLTR.m_val.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_OMathBottomNodesValType::Val);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteBool(pStrikeBLTR.m_val->GetValue());
			}
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathStrikeH(const OOX::Logic::CStrikeH &pStrikeH)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathBottomNodesType::StrikeH);
			if (pStrikeH.m_val.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_OMathBottomNodesValType::Val);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteBool(pStrikeH.m_val->GetValue());
			}
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathStrikeTLBR(const OOX::Logic::CStrikeTLBR &pStrikeTLBR)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathBottomNodesType::StrikeTLBR);
			if (pStrikeTLBR.m_val.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_OMathBottomNodesValType::Val);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteBool(pStrikeTLBR.m_val->GetValue());
			}
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathStrikeV(const OOX::Logic::CStrikeV &pStrikeV)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathBottomNodesType::StrikeV);
			if (pStrikeV.m_val.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_OMathBottomNodesValType::Val);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteBool(pStrikeV.m_val->GetValue());
			}
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathSty(const OOX::Logic::CSty &pSty)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathBottomNodesType::Sty);
			if (pSty.m_val.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_OMathBottomNodesValType::Val);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteByte(pSty.m_val->GetValue());
			}
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathSub(const OOX::Logic::CSub &pSub)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathContentType::Sub);
			WriteMathArgNodes(pSub.m_arrItems);			
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathSubHide(const OOX::Logic::CSubHide &pSubHide)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathBottomNodesType::SubHide);
			if (pSubHide.m_val.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_OMathBottomNodesValType::Val);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteBool(pSubHide.m_val->GetValue());
			}
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathSup(const OOX::Logic::CSup &pSup)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathContentType::Sup);
			WriteMathArgNodes(pSup.m_arrItems);			
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathSupHide(const OOX::Logic::CSupHide &pSupHide)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathBottomNodesType::SupHide);
			if (pSupHide.m_val.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_OMathBottomNodesValType::Val);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteBool(pSupHide.m_val->GetValue());
			}
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathText(const OOX::Logic::CMText &pMText)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathContentType::MText);
			if(!pMText.m_sText.IsEmpty())
			{
				CString* pStringC = const_cast<CString*>(&pMText.m_sText);
				m_oBcw.m_oStream.WriteString2(*pStringC);
			}
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathTransp(const OOX::Logic::CTransp &pTransp)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathBottomNodesType::Transp);
			if (pTransp.m_val.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_OMathBottomNodesValType::Val);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteBool(pTransp.m_val->GetValue());
			}
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathType(const OOX::Logic::CType &pType)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathBottomNodesType::Type);
			if (pType.m_val.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_OMathBottomNodesValType::Val);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteByte(pType.m_val->GetValue());
			}
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathVertJc(const OOX::Logic::CVertJc &pVertJc)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathBottomNodesType::VertJc);
			if (pVertJc.m_val.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_OMathBottomNodesValType::Val);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteByte(pVertJc.m_val->GetValue());
			}
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathZeroAsc(const OOX::Logic::CZeroAsc &pZeroAsc)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathBottomNodesType::ZeroAsc);
			if (pZeroAsc.m_val.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_OMathBottomNodesValType::Val);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteBool(pZeroAsc.m_val->GetValue());
			}
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathZeroDesc(const OOX::Logic::CZeroDesc &pZeroDesc)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathBottomNodesType::ZeroDesc);
			if (pZeroDesc.m_val.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_OMathBottomNodesValType::Val);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteBool(pZeroDesc.m_val->GetValue());
			}
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteMathZeroWid(const OOX::Logic::CZeroWid &pZeroWid)
		{
			int nCurPos = m_oBcw.WriteItemStart(c_oSer_OMathBottomNodesType::ZeroWid);
			if (pZeroWid.m_val.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_OMathBottomNodesValType::Val);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteBool(pZeroWid.m_val->GetValue());
			}
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WritePreparedRun(CSimpleArray<OOX::WritingElement*>& m_arrItems, bool bHyperlink, int nIndexStart, int nIndexStop)
		{
			int nCurPos = 0;
			
			OOX::Logic::CRunProperty* oCur_rPr = getRunStyle(m_arrItems);
			if(NULL != oCur_rPr)
			{
				
				if(false == bHyperlink)
				{
					
					for(int i = 0, length = m_aFldChars.GetSize(); i < length; ++i)
						if(fieldstruct_hyperlink == m_aFldChars[i]->GetType() || fieldstruct_locallink == m_aFldChars[i]->GetType())
						{
							bHyperlink = true;
							break;
						}
				}
				if(bHyperlink)
				{
					bool bInTOC = false;
					for(int i = 0, length = m_aFldChars.GetSize(); i < length; ++i)
					{
						if(fieldstruct_toc == m_aFldChars[i]->GetType())
						{
							bInTOC = true;
							break;
						}
					}
					if(bInTOC)
					{
						
						if(oCur_rPr->m_oRStyle.IsInit())
							oCur_rPr->m_oRStyle.reset();
						
						if(oCur_rPr->m_oColor.IsInit() && oCur_rPr->m_oColor->m_oVal.IsInit() && SimpleTypes::hexcolorRGB == oCur_rPr->m_oColor->m_oVal->GetValue())
						{
							unsigned char bR = oCur_rPr->m_oColor->m_oVal->Get_R();
							unsigned char bG = oCur_rPr->m_oColor->m_oVal->Get_G();
							unsigned char bB = oCur_rPr->m_oColor->m_oVal->Get_B();
							if(0x00 == bR && 0x00 == bG && 0xFF == bB)
								oCur_rPr->m_oColor->m_oVal->Set_B(0x00);
						}
						if(oCur_rPr->m_oU.IsInit() && oCur_rPr->m_oU->m_oVal.IsInit() && SimpleTypes::underlineSingle == oCur_rPr->m_oU->m_oVal->GetValue())
							oCur_rPr->m_oU->m_oVal->SetValue(SimpleTypes::underlineNone);
					}
				}
			}
			
			if(nIndexStart < m_arrItems.GetSize() && OOX::et_w_sym == m_arrItems[nIndexStart]->getType())
			{
				OOX::Logic::CSym* oSym = static_cast<OOX::Logic::CSym*>(m_arrItems[nIndexStart]);
				if(oSym->m_oFont.IsInit())
				{
					const CString& sFont = oSym->m_oFont.get();
					if(NULL == oCur_rPr)
						oCur_rPr = new OOX::Logic::CRunProperty();
					oCur_rPr->m_oRFonts.Init();
					oCur_rPr->m_oRFonts->m_sAscii.Init();
					oCur_rPr->m_oRFonts->m_sAscii->Append(sFont);
					oCur_rPr->m_oRFonts->m_sCs.Init();
					oCur_rPr->m_oRFonts->m_sCs->Append(sFont);
					oCur_rPr->m_oRFonts->m_sEastAsia.Init();
					oCur_rPr->m_oRFonts->m_sEastAsia->Append(sFont);
					oCur_rPr->m_oRFonts->m_sHAnsi.Init();
					oCur_rPr->m_oRFonts->m_sHAnsi->Append(sFont);
				}
			}
			
			if(NULL != oCur_rPr)
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSerRunType::rPr);
				brPrs.Write_rPr(*oCur_rPr);
				m_oBcw.WriteItemEnd(nCurPos);
			}

			
			nCurPos = m_oBcw.WriteItemStart(c_oSerRunType::Content);
			WriteRunContent(m_arrItems, nIndexStart, nIndexStop, bHyperlink);
			m_oBcw.WriteItemWithLengthEnd(nCurPos);
		}
		void WriteRunContent(CSimpleArray<OOX::WritingElement*>& m_arrItems, int nIndexStart, int nIndexStop, bool bHyperlink = false)
		{
			for ( int i = nIndexStart; i < nIndexStop; ++i )
			{
				OOX::WritingElement* item = m_arrItems[i];
				switch (item->getType())
				{
				case OOX::et_w_br:
					{
						if(m_nSkipFldChar > 0)
							break;
						OOX::Logic::CBr* pBr = static_cast<OOX::Logic::CBr*>(item);
						int nBreakType = -1;
						switch(pBr->m_oType.GetValue())
						{
						case SimpleTypes::brtypeColumn:
						case SimpleTypes::brtypePage: nBreakType = c_oSerRunType::pagebreak;break;
						case SimpleTypes::brtypeTextWrapping: nBreakType = c_oSerRunType::linebreak;break;
						}
						if(-1 != nBreakType)
						{
							m_oBcw.m_oStream.WriteByte(nBreakType);
							m_oBcw.m_oStream.WriteLong(c_oSerPropLenType::Null);
						}
						break;
					}
				case OOX::et_mc_alternateContent:
				case OOX::et_w_pict:
				case OOX::et_w_drawing:
					{
						if(m_nSkipFldChar > 0)
							break;
						WriteDrawingPptx(item);
						break;
					}
				case OOX::et_w_fldChar:
					{
						OOX::Logic::CFldChar* pFldChar = static_cast<OOX::Logic::CFldChar*>(item);
						if(pFldChar->m_oFldCharType.IsInit())
						{
							if(SimpleTypes::fldchartypeBegin == pFldChar->m_oFldCharType.get().GetValue())
							{
								m_eFldState = SimpleTypes::fldchartypeBegin;
								m_sFldChar.Empty();
								if(m_nSkipFldChar > 0)
									m_nSkipFldChar++;
							}
							else if(SimpleTypes::fldchartypeEnd == pFldChar->m_oFldCharType.get().GetValue())
							{
								m_eFldState = SimpleTypes::fldchartypeEnd;
								if(m_nSkipFldChar > 0)
									m_nSkipFldChar--;
								if(m_aFldChars.GetSize() > 0)
								{
									int nIndex = m_aFldChars.GetSize() - 1;
									FldStruct* pFldStruct = m_aFldChars[nIndex];
									if( fieldstruct_hyperlink == pFldStruct->GetType())
									{
										m_oBcw.m_oStream.WriteByte(c_oSerRunType::fldend);
										m_oBcw.m_oStream.WriteLong(c_oSerPropLenType::Null);
									}
									RELEASEOBJECT(pFldStruct);
									m_aFldChars.RemoveAt(nIndex);
								}
							}
							else if(SimpleTypes::fldchartypeSeparate == pFldChar->m_oFldCharType.get().GetValue())
							{
								m_eFldState = SimpleTypes::fldchartypeSeparate;
								FldStruct* pFldStruct = NULL;
								if(WriteField(m_sFldChar, &pFldStruct, false) )
									m_nSkipFldChar++;
								m_aFldChars.Add(pFldStruct);
							}
						}
					}
					break;
				case OOX::et_w_instrText:
					{
						if(m_nSkipFldChar > 0)
							break;
						OOX::Logic::CInstrText* pInstrText = static_cast<OOX::Logic::CInstrText*>(item);
						if(SimpleTypes::fldchartypeBegin == m_eFldState)
							m_sFldChar += pInstrText->m_sText;
						else
						{
							if(!pInstrText->m_sText.IsEmpty())
							{
								WriteText(pInstrText->m_sText);
							}
						}
					}
					break;
				case OOX::et_w_nonBreakHyphen:
					{
						if(m_nSkipFldChar > 0)
							break;
						WriteText(CString(_T("-")));
					}
					break;
				case OOX::et_w_pgNum:
					{
						if(m_nSkipFldChar > 0)
							break;
						m_oBcw.m_oStream.WriteByte(c_oSerRunType::pagenum);
						m_oBcw.m_oStream.WriteLong(c_oSerPropLenType::Null);
					}
					break;
				case OOX::et_w_ptab:
					break;
				case OOX::et_w_rPr:
					break;
				case OOX::et_w_softHyphen:
					{
						if(m_nSkipFldChar > 0)
							break;
						WriteText(CString(_T("-")));
					}
					break;
				case OOX::et_w_sym:
					{
						OOX::Logic::CSym* oSym = static_cast<OOX::Logic::CSym*>(item);
						if(m_nSkipFldChar > 0)
							break;
						CString sText;
						sText.AppendChar(0x0FFF & oSym->m_oChar->GetValue());
						WriteText(sText);
						break;
					}
				case OOX::et_w_t:
					{
						if(m_nSkipFldChar > 0)
							break;
						CString& sText = static_cast<OOX::Logic::CText*>(item)->m_sText;
						if(!sText.IsEmpty())
						{
							WriteText(sText);
						}
					}
					break;
				case OOX::et_w_tab:
					{
						if(m_nSkipFldChar > 0)
							break;
						m_oBcw.m_oStream.WriteByte(c_oSerRunType::tab);
						m_oBcw.m_oStream.WriteLong(c_oSerPropLenType::Null);
					}
					break;
				case OOX::et_w_commentReference:
					{
						OOX::Logic::CCommentReference* pCommentReference = static_cast<OOX::Logic::CCommentReference*>(item);
						WriteComment(OOX::et_w_commentReference, pCommentReference->m_oId);
						break;
					}
				}
			}
		}
		void WriteText(CString& text)
		{
			m_oBcw.m_oStream.WriteByte(c_oSerRunType::run);
			m_oBcw.m_oStream.WriteString2(text);
			if(NULL != m_oBcw.m_pEmbeddedFontsManager)
				m_oBcw.m_pEmbeddedFontsManager->CheckString(text);
		};
		void WriteDrawingPptx(OOX::WritingElement* item)
		{
			OOX::EElementType pElementType = item->getType();
			CString* pXml = NULL;
			OOX::Logic::CDrawing* pChartDrawing = NULL;
			OOX::Drawing::CChart* pChart = NULL;
			if(OOX::et_mc_alternateContent == pElementType)
			{
				OOX::Logic::CAlternateContent* pAlternateContent = static_cast<OOX::Logic::CAlternateContent*>(item);
				pXml = pAlternateContent->m_sXml.GetPointer();
				if(pAlternateContent->m_arrChoiceItems.GetSize() > 0)
				{
					OOX::WritingElement* we = pAlternateContent->m_arrChoiceItems[0];
					if(OOX::et_w_drawing == we->getType())
					{
						OOX::Logic::CDrawing* pDrawing = static_cast<OOX::Logic::CDrawing*>(we);
						if(pDrawing->m_bAnchor && pDrawing->m_oAnchor.IsInit() && pDrawing->m_oAnchor->m_oGraphic.IsInit() && pDrawing->m_oAnchor->m_oGraphic->m_oChart.IsInit())
						{
							pChartDrawing = pDrawing;
							pChart = pDrawing->m_oAnchor->m_oGraphic->m_oChart.GetPointer();
						}
						else if(pDrawing->m_oInline.IsInit() && pDrawing->m_oInline->m_oGraphic.IsInit() && pDrawing->m_oInline->m_oGraphic->m_oChart.IsInit())
						{
							pChartDrawing = pDrawing;
							pChart = pDrawing->m_oInline->m_oGraphic->m_oChart.GetPointer();
						}
					}
				}
			}
			else if(OOX::et_w_drawing == pElementType)
			{
				OOX::Logic::CDrawing* pDrawing = static_cast<OOX::Logic::CDrawing*>(item);
				pXml = pDrawing->m_sXml.GetPointer();
				if(pDrawing->m_bAnchor && pDrawing->m_oAnchor.IsInit() && pDrawing->m_oAnchor->m_oGraphic.IsInit() && pDrawing->m_oAnchor->m_oGraphic->m_oChart.IsInit())
				{
					pChartDrawing = pDrawing;
					pChart = pDrawing->m_oAnchor->m_oGraphic->m_oChart.GetPointer();
				}
				else if(pDrawing->m_oInline.IsInit() && pDrawing->m_oInline->m_oGraphic.IsInit() && pDrawing->m_oInline->m_oGraphic->m_oChart.IsInit())
				{
					pChartDrawing = pDrawing;
					pChart = pDrawing->m_oInline->m_oGraphic->m_oChart.GetPointer();
				}
			}
			else if(OOX::et_w_pict == pElementType)
			{
				OOX::Logic::CPicture* pPicture = static_cast<OOX::Logic::CPicture*>(item);
				pXml = pPicture->m_sXml.GetPointer();
			}
			if(NULL != pXml)
			{
				if(NULL != pChart)
				{
					if(pChart->m_oRId.IsInit())
					{
						smart_ptr<OOX::File> pFile = m_oDocumentRels->Find( OOX::RId(pChart->m_oRId->GetValue()));
						if (pFile.IsInit() && OOX::FileTypes::Chart == pFile->type())
						{
							OOX::Spreadsheet::CChartSpace* pChartFile = static_cast<OOX::Spreadsheet::CChartSpace*>(pFile.operator ->());
							if(pChartFile->m_oChart.IsInit() && pChartFile->m_oChart->isValid())
							{
								int nCurPos = m_oBcw.WriteItemStart(c_oSerRunType::pptxDrawing);
								WriteDrawing(*pChartDrawing, NULL, pChartFile);
								m_oBcw.WriteItemEnd(nCurPos);
							}
						}
					}
				}
				else
				{
					BSTR bstrXml = pXml->AllocSysString();
					BSTR bstrOutputXml = NULL;
					LPSAFEARRAY pBinaryObj = NULL;
					HRESULT hRes = m_pOfficeDrawingConverter->AddObject(bstrXml, &bstrOutputXml, &pBinaryObj);
					if(S_OK == hRes && NULL != bstrOutputXml && NULL != pBinaryObj && pBinaryObj->rgsabound[0].cElements > 0)
					{
						CString sOutputXml(bstrOutputXml);
						CString sDrawingXml;
						sDrawingXml.Format(_T("<root xmlns:wpc=\"http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas\" xmlns:mc=\"http://schemas.openxmlformats.org/markup-compatibility/2006\" xmlns:o=\"urn:schemas-microsoft-com:office:office\" xmlns:r=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships\" xmlns:m=\"http://schemas.openxmlformats.org/officeDocument/2006/math\" xmlns:v=\"urn:schemas-microsoft-com:vml\" xmlns:wp14=\"http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing\" xmlns:wp=\"http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing\" xmlns:w10=\"urn:schemas-microsoft-com:office:word\" xmlns:w=\"http://schemas.openxmlformats.org/wordprocessingml/2006/main\" xmlns:w14=\"http://schemas.microsoft.com/office/word/2010/wordml\" xmlns:wpg=\"http://schemas.microsoft.com/office/word/2010/wordprocessingGroup\" xmlns:wpi=\"http://schemas.microsoft.com/office/word/2010/wordprocessingInk\" xmlns:wne=\"http://schemas.microsoft.com/office/word/2006/wordml\" xmlns:wps=\"http://schemas.microsoft.com/office/word/2010/wordprocessingShape\"><w:drawing>%s</w:drawing></root>"), sOutputXml);
						XmlUtils::CXmlLiteReader oReader;
						oReader.FromString(sDrawingXml);
						oReader.ReadNextNode();
						oReader.ReadNextNode();
						OOX::Logic::CDrawing oDrawing;
						oDrawing.fromXML2(oReader, true);

						int nCurPos = m_oBcw.WriteItemStart(c_oSerRunType::pptxDrawing);
						WriteDrawing(oDrawing, pBinaryObj, NULL);
						m_oBcw.WriteItemEnd(nCurPos);
					}

					RELEASEARRAY(pBinaryObj);
					SysFreeString(bstrOutputXml);
					SysFreeString(bstrXml);
				}
			}
		}
		void WriteDrawing(OOX::Logic::CDrawing& img, SAFEARRAY* pBinaryObj, OOX::Spreadsheet::CChartSpace* pChart)
		{
			int nCurPos = 0;
			if(img.m_oInline.IsInit())
			{
				const OOX::Drawing::CInline& pInline = img.m_oInline.get();
				if(pInline.m_oExtent.IsInit())
				{
					
					m_oBcw.m_oStream.WriteByte(c_oSerImageType2::Type);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
					m_oBcw.m_oStream.WriteByte(c_oAscWrapStyle::Inline);
					
					m_oBcw.m_oStream.WriteByte(c_oSerImageType2::Extent);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);
					nCurPos = m_oBcw.WriteItemWithLengthStart();
					WriteExtent(pInline.m_oExtent.get());
					m_oBcw.WriteItemWithLengthEnd(nCurPos);
					
					if(NULL != pBinaryObj)
					{
						m_oBcw.m_oStream.WriteByte(c_oSerImageType2::PptxData);
						m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);
						m_oBcw.WriteSafeArray(pBinaryObj);
					}
					
					if(NULL != pChart)
					{
						m_oBcw.m_oStream.WriteByte(c_oSerImageType2::Chart);
						m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);

						BinXlsxRW::BinaryChartWriter oBinaryChartWriter(m_oBcw.m_oStream, m_pOfficeDrawingConverter);	
						int nCurPos = m_oBcw.WriteItemWithLengthStart();
						oBinaryChartWriter.Write(*pChart);
						m_oBcw.WriteItemWithLengthEnd(nCurPos);
					}
				}
			}
			else if(img.m_oAnchor.IsInit() )
			{
				const OOX::Drawing::CAnchor& pAnchor = img.m_oAnchor.get();
				m_oBcw.m_oStream.WriteByte(c_oSerImageType2::Type);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteByte(c_oAscWrapStyle::Flow);
				if(pAnchor.m_oAllowOverlap.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerImageType2::AllowOverlap);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
					m_oBcw.m_oStream.WriteBool(pAnchor.m_oAllowOverlap->ToBool());
				}
				if(pAnchor.m_oBehindDoc.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerImageType2::BehindDoc);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
					m_oBcw.m_oStream.WriteBool(pAnchor.m_oBehindDoc->ToBool());
				}
				if(pAnchor.m_oDistL.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerImageType2::DistL);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
					m_oBcw.m_oStream.WriteDouble2(pAnchor.m_oDistL->ToMM());
				}
				if(pAnchor.m_oDistT.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerImageType2::DistT);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
					m_oBcw.m_oStream.WriteDouble2(pAnchor.m_oDistT->ToMM());
				}
				if(pAnchor.m_oDistR.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerImageType2::DistR);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
					m_oBcw.m_oStream.WriteDouble2(pAnchor.m_oDistR->ToMM());
				}
				if(pAnchor.m_oDistB.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerImageType2::DistB);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
					m_oBcw.m_oStream.WriteDouble2(pAnchor.m_oDistB->ToMM());
				}
				if(pAnchor.m_oHidden.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerImageType2::Hidden);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
					m_oBcw.m_oStream.WriteBool(pAnchor.m_oHidden->ToBool());
				}
				if(pAnchor.m_oLayoutInCell.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerImageType2::LayoutInCell);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
					m_oBcw.m_oStream.WriteBool(pAnchor.m_oLayoutInCell->ToBool());
				}
				if(pAnchor.m_oLocked.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerImageType2::Locked);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
					m_oBcw.m_oStream.WriteBool(pAnchor.m_oLocked->ToBool());
				}
				if(pAnchor.m_oRelativeHeight.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerImageType2::RelativeHeight);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Long);
					m_oBcw.m_oStream.WriteLong(pAnchor.m_oRelativeHeight->GetValue());
				}
				if(pAnchor.m_bSimplePos.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerImageType2::BSimplePos);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
					m_oBcw.m_oStream.WriteBool(pAnchor.m_bSimplePos->ToBool());
				}
				if(pAnchor.m_oEffectExtent.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerImageType2::EffectExtent);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);
					nCurPos = m_oBcw.WriteItemWithLengthStart();
					WriteEffectExtent(pAnchor.m_oEffectExtent.get());
					m_oBcw.WriteItemWithLengthEnd(nCurPos);
				}
				if(pAnchor.m_oExtent.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerImageType2::Extent);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);
					nCurPos = m_oBcw.WriteItemWithLengthStart();
					WriteExtent(pAnchor.m_oExtent.get());
					m_oBcw.WriteItemWithLengthEnd(nCurPos);
				}
				if(pAnchor.m_oPositionH.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerImageType2::PositionH);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);
					nCurPos = m_oBcw.WriteItemWithLengthStart();
					WritePositionH(pAnchor.m_oPositionH.get());
					m_oBcw.WriteItemWithLengthEnd(nCurPos);
				}
				if(pAnchor.m_oPositionV.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerImageType2::PositionV);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);
					nCurPos = m_oBcw.WriteItemWithLengthStart();
					WritePositionV(pAnchor.m_oPositionV.get());
					m_oBcw.WriteItemWithLengthEnd(nCurPos);
				}
				if(pAnchor.m_oSimplePos.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerImageType2::SimplePos);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);
					nCurPos = m_oBcw.WriteItemWithLengthStart();
					WriteSimplePos(pAnchor.m_oSimplePos.get());
					m_oBcw.WriteItemWithLengthEnd(nCurPos);
				}
				if(pAnchor.m_oWrapNone.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerImageType2::WrapNone);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Null);
				}
				if(pAnchor.m_oWrapSquare.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerImageType2::WrapSquare);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);
					nCurPos = m_oBcw.WriteItemWithLengthStart();
					WriteWrapSquare(pAnchor.m_oWrapSquare.get());
					m_oBcw.WriteItemWithLengthEnd(nCurPos);
				}
				if(pAnchor.m_oWrapThrough.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerImageType2::WrapThrough);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);
					nCurPos = m_oBcw.WriteItemWithLengthStart();
					WriteWrapThrough(pAnchor.m_oWrapThrough.get());
					m_oBcw.WriteItemWithLengthEnd(nCurPos);
				}
				if(pAnchor.m_oWrapTight.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerImageType2::WrapTight);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);
					nCurPos = m_oBcw.WriteItemWithLengthStart();
					WriteWrapTight(pAnchor.m_oWrapTight.get());
					m_oBcw.WriteItemWithLengthEnd(nCurPos);
				}
				if(pAnchor.m_oWrapTopAndBottom.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerImageType2::WrapTopAndBottom);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);
					nCurPos = m_oBcw.WriteItemWithLengthStart();
					WriteWrapTopBottom(pAnchor.m_oWrapTopAndBottom.get());
					m_oBcw.WriteItemWithLengthEnd(nCurPos);
				}
				
				
				if(NULL != pBinaryObj)
				{
					m_oBcw.m_oStream.WriteByte(c_oSerImageType2::PptxData);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);
					m_oBcw.WriteSafeArray(pBinaryObj);
				}

				
				if(NULL != pChart)
				{
					m_oBcw.m_oStream.WriteByte(c_oSerImageType2::Chart);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);

					BinXlsxRW::BinaryChartWriter oBinaryChartWriter(m_oBcw.m_oStream, m_pOfficeDrawingConverter);	
					int nCurPos = m_oBcw.WriteItemWithLengthStart();
					oBinaryChartWriter.Write(*pChart);
					m_oBcw.WriteItemWithLengthEnd(nCurPos);
				}
			}
		};
		void WriteEffectExtent(const OOX::Drawing::CEffectExtent& oEffectExtent)
		{
			m_oBcw.m_oStream.WriteByte(c_oSerEffectExtent::Left);
			m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
			m_oBcw.m_oStream.WriteDouble2(oEffectExtent.m_oL.ToMm());

			m_oBcw.m_oStream.WriteByte(c_oSerEffectExtent::Top);
			m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
			m_oBcw.m_oStream.WriteDouble2(oEffectExtent.m_oT.ToMm());

			m_oBcw.m_oStream.WriteByte(c_oSerEffectExtent::Right);
			m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
			m_oBcw.m_oStream.WriteDouble2(oEffectExtent.m_oR.ToMm());

			m_oBcw.m_oStream.WriteByte(c_oSerEffectExtent::Bottom);
			m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
			m_oBcw.m_oStream.WriteDouble2(oEffectExtent.m_oB.ToMm());
		}
		void WriteExtent(const ComplexTypes::Drawing::CPositiveSize2D& oExtent)
		{
			m_oBcw.m_oStream.WriteByte(c_oSerExtent::Cx);
			m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
			m_oBcw.m_oStream.WriteDouble2(oExtent.m_oCx.ToMM());

			m_oBcw.m_oStream.WriteByte(c_oSerExtent::Cy);
			m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
			m_oBcw.m_oStream.WriteDouble2(oExtent.m_oCy.ToMM());
		}
		void WritePositionH(const OOX::Drawing::CPosH& oPosH)
		{
			if(oPosH.m_oRelativeFrom.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerPosHV::RelativeFrom);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteByte((BYTE)oPosH.m_oRelativeFrom->GetValue());
			}
			if(oPosH.m_oAlign.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerPosHV::Align);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteByte((BYTE)oPosH.m_oAlign->GetValue());
			}
			if(oPosH.m_oPosOffset.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerPosHV::PosOffset);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
				m_oBcw.m_oStream.WriteDouble2(oPosH.m_oPosOffset->ToMM());
			}
		}
		void WritePositionV(const OOX::Drawing::CPosV& oPosV)
		{
			if(oPosV.m_oRelativeFrom.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerPosHV::RelativeFrom);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteByte((BYTE)oPosV.m_oRelativeFrom->GetValue());
			}
			if(oPosV.m_oAlign.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerPosHV::Align);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteByte((BYTE)oPosV.m_oAlign->GetValue());
			}
			if(oPosV.m_oPosOffset.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerPosHV::PosOffset);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
				m_oBcw.m_oStream.WriteDouble2(oPosV.m_oPosOffset->ToMM());
			}
		}
		void WriteSimplePos(const ComplexTypes::Drawing::CPoint2D& oSimplePos)
		{
			m_oBcw.m_oStream.WriteByte(c_oSerSimplePos::X);
			m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
			m_oBcw.m_oStream.WriteDouble2(oSimplePos.m_oX.ToMm());

			m_oBcw.m_oStream.WriteByte(c_oSerSimplePos::Y);
			m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
			m_oBcw.m_oStream.WriteDouble2(oSimplePos.m_oY.ToMm());
		}
		void WriteWrapSquare(const OOX::Drawing::CWrapSquare& oWrapSquare)
		{
			int nCurPos = 0;
			if(oWrapSquare.m_oDistL.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerWrapSquare::DistL);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
				m_oBcw.m_oStream.WriteDouble2(oWrapSquare.m_oDistL->ToMM());
			}
			if(oWrapSquare.m_oDistT.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerWrapSquare::DistT);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
				m_oBcw.m_oStream.WriteDouble2(oWrapSquare.m_oDistT->ToMM());
			}
			if(oWrapSquare.m_oDistR.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerWrapSquare::DistR);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
				m_oBcw.m_oStream.WriteDouble2(oWrapSquare.m_oDistR->ToMM());
			}
			if(oWrapSquare.m_oDistB.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerWrapSquare::DistB);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
				m_oBcw.m_oStream.WriteDouble2(oWrapSquare.m_oDistB->ToMM());
			}
			if(oWrapSquare.m_oWrapText.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerWrapSquare::WrapText);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteByte((BYTE)oWrapSquare.m_oWrapText->GetValue());
			}
			if(oWrapSquare.m_oEffectExtent.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerWrapSquare::EffectExtent);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);
				nCurPos = m_oBcw.WriteItemWithLengthStart();
				WriteEffectExtent(oWrapSquare.m_oEffectExtent.get());
				m_oBcw.WriteItemWithLengthEnd(nCurPos);
			}
		}
		void WriteWrapThrough(const OOX::Drawing::CWrapThrough& oWrapThrough)
		{
			int nCurPos = 0;
			if(oWrapThrough.m_oDistL.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerWrapThroughTight::DistL);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
				m_oBcw.m_oStream.WriteDouble2(oWrapThrough.m_oDistL->ToMM());
			}
			if(oWrapThrough.m_oDistR.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerWrapThroughTight::DistR);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
				m_oBcw.m_oStream.WriteDouble2(oWrapThrough.m_oDistR->ToMM());
			}
			if(oWrapThrough.m_oWrapText.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerWrapThroughTight::WrapText);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteByte((BYTE)oWrapThrough.m_oWrapText->GetValue());
			}
			if(oWrapThrough.m_oWrapPolygon.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerWrapThroughTight::WrapPolygon);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);
				nCurPos = m_oBcw.WriteItemWithLengthStart();
				WriteWrapPolygon(oWrapThrough.m_oWrapPolygon.get());
				m_oBcw.WriteItemWithLengthEnd(nCurPos);
			}
		}
		void WriteWrapTight(const OOX::Drawing::CWrapTight& oWrapTight)
		{
			int nCurPos = 0;
			if(oWrapTight.m_oDistL.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerWrapThroughTight::DistL);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
				m_oBcw.m_oStream.WriteDouble2(oWrapTight.m_oDistL->ToMM());
			}
			if(oWrapTight.m_oDistR.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerWrapThroughTight::DistR);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
				m_oBcw.m_oStream.WriteDouble2(oWrapTight.m_oDistR->ToMM());
			}
			if(oWrapTight.m_oWrapText.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerWrapThroughTight::WrapText);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteByte((BYTE)oWrapTight.m_oWrapText->GetValue());
			}
			if(oWrapTight.m_oWrapPolygon.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerWrapThroughTight::WrapPolygon);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);
				nCurPos = m_oBcw.WriteItemWithLengthStart();
				WriteWrapPolygon(oWrapTight.m_oWrapPolygon.get());
				m_oBcw.WriteItemWithLengthEnd(nCurPos);
			}
		}
		void WriteWrapTopBottom(const OOX::Drawing::CWrapTopBottom& oWrapTopBottom)
		{
			int nCurPos = 0;
			if(oWrapTopBottom.m_oDistT.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerWrapTopBottom::DistT);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
				m_oBcw.m_oStream.WriteDouble2(oWrapTopBottom.m_oDistT->ToMM());
			}
			if(oWrapTopBottom.m_oDistB.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerWrapTopBottom::DistB);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
				m_oBcw.m_oStream.WriteDouble2(oWrapTopBottom.m_oDistB->ToMM());
			}
			if(oWrapTopBottom.m_oEffectExtent.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerWrapTopBottom::EffectExtent);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);
				nCurPos = m_oBcw.WriteItemWithLengthStart();
				WriteEffectExtent(oWrapTopBottom.m_oEffectExtent.get());
				m_oBcw.WriteItemWithLengthEnd(nCurPos);
			}
		}
		void WriteWrapPolygon(const OOX::Drawing::CWrapPath& oWrapPath)
		{
			int nCurPos = 0;
			if(oWrapPath.m_oEdited.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerWrapPolygon::Edited);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteBool(oWrapPath.m_oEdited->ToBool());
			}
			if(oWrapPath.m_oStart.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerWrapPolygon::Start);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);
				nCurPos = m_oBcw.WriteItemWithLengthStart();
				WritePoint2D(oWrapPath.m_oStart.get());
				m_oBcw.WriteItemWithLengthEnd(nCurPos);
			}
			if(oWrapPath.m_arrLineTo.GetSize() > 0)
			{
				m_oBcw.m_oStream.WriteByte(c_oSerWrapPolygon::ALineTo);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);
				nCurPos = m_oBcw.WriteItemWithLengthStart();
				WriteLineTo(oWrapPath.m_arrLineTo);
				m_oBcw.WriteItemWithLengthEnd(nCurPos);
			}
		}
		void WriteLineTo(const CSimpleArray<ComplexTypes::Drawing::CPoint2D>& aLineTo)
		{
			int nCurPos = 0;
			for(int i = 0, length = aLineTo.GetSize(); i < length; ++i)
			{
				m_oBcw.m_oStream.WriteByte(c_oSerWrapPolygon::LineTo);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);
				nCurPos = m_oBcw.WriteItemWithLengthStart();
				WritePoint2D(aLineTo[i]);
				m_oBcw.WriteItemWithLengthEnd(nCurPos);
			}
		}
		void WritePoint2D(const ComplexTypes::Drawing::CPoint2D& oPoint2D)
		{
			int nCurPos = 0;
			m_oBcw.m_oStream.WriteByte(c_oSerPoint2D::X);
			m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
			m_oBcw.m_oStream.WriteDouble2(oPoint2D.m_oX.ToMm());

			m_oBcw.m_oStream.WriteByte(c_oSerPoint2D::Y);
			m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
			m_oBcw.m_oStream.WriteDouble2(oPoint2D.m_oY.ToMm());
		}
		void WriteDocTable(OOX::Logic::CTbl& tbl)
		{
			int nCurPos = 0;
			
			
			int nRows = 0;
			int nCols = 0;
			OOX::Logic::CTableProperty* pTblPr = NULL;
			
			GetTableSize(tbl.m_arrItems, nRows, nCols, &pTblPr);
			if(nRows > 0 && nCols > 0)
			{
				
				if(NULL != pTblPr)
				{
					nCurPos = m_oBcw.WriteItemStart(c_oSerDocTableType::tblPr);
					btblPrs.WriteTblPr(pTblPr);
					m_oBcw.WriteItemEnd(nCurPos);
				}

				
				if(tbl.m_oTblGrid.IsInit())
				{
					nCurPos = m_oBcw.WriteItemStart(c_oSerDocTableType::tblGrid);
					WriteTblGrid(tbl.m_oTblGrid.get());
					m_oBcw.WriteItemEnd(nCurPos);
				}
				
				nCurPos = m_oBcw.WriteItemStart(c_oSerDocTableType::Content);
				WriteTableContent(tbl.m_arrItems, pTblPr, nRows, nCols);
				m_oBcw.WriteItemEnd(nCurPos);
			}

			RELEASEOBJECT(pTblPr);
		};
		bool ValidateRow(const CSimpleArray<OOX::WritingElement *>& arrItems)
		{
			
			bool bRes = true;
			for(int i = 0, length = arrItems.GetSize(); i < length; ++i)
			{
				OOX::WritingElement* item = arrItems[i];
				if(OOX::et_w_tc == item->getType())
				{
					OOX::Logic::CTc* tc = static_cast<OOX::Logic::CTc*>(item);
					OOX::Logic::CTableCellProperties* pTcPr = tc->GetProperties();
					bool bVMerge = false;
					if(NULL != pTcPr)
					{
						if(pTcPr->m_oVMerge.IsInit() && pTcPr->m_oVMerge->m_oVal.IsInit() && SimpleTypes::mergeContinue == pTcPr->m_oVMerge->m_oVal->GetValue())
							bVMerge = true;
					}
					if(false == bVMerge)
						return true;
				}
				else if(OOX::et_w_sdt == item->getType())
				{
					OOX::Logic::CSdt* pStd = static_cast<OOX::Logic::CSdt*>(item);
					if(pStd->m_oSdtContent.IsInit())
						if(true == ValidateRow(pStd->m_oSdtContent.get().m_arrItems))
							return true;
				}
				else if(OOX::et_w_smartTag == item->getType())
				{
					OOX::Logic::CSmartTag* pSmartTag = static_cast<OOX::Logic::CSmartTag*>(item);
					if(true == ValidateRow(pSmartTag->m_arrItems))
						return true;
				}
				else if(OOX::et_w_dir == item->getType())
				{
					OOX::Logic::CDir* pDir = static_cast<OOX::Logic::CDir*>(item);
					if(true == ValidateRow(pDir->m_arrItems))
						return true;
				}
				else if(OOX::et_w_bdo == item->getType())
				{
					OOX::Logic::CBdo* pBdo = static_cast<OOX::Logic::CBdo*>(item);
					if(true == ValidateRow(pBdo->m_arrItems))
						return true;
				}
			}
			return false;
		}
		void GetTableSize(CSimpleArray<OOX::WritingElement *>& rows, int& nRows, int& nCols, OOX::Logic::CTableProperty** ppTblPr)
		{
			for(int i = rows.GetSize() - 1; i >= 0; i--)
			{
				OOX::WritingElement* item = rows[i];
				if(OOX::et_w_tblPr == item->getType())
				{
					*ppTblPr = new OOX::Logic::CTableProperty();
					**ppTblPr = *static_cast<OOX::Logic::CTableProperty*>(item);
				}
				else if(OOX::et_w_tr == item->getType())
				{
					OOX::Logic::CTr* pTr = static_cast<OOX::Logic::CTr*>(item);
					if(ValidateRow(pTr->m_arrItems))
					{
						nRows++;
						if(0 == nCols)
						{
							OOX::Logic::CTr* pTr = static_cast<OOX::Logic::CTr*>(item);
							nCols = GetColsCount(pTr->m_arrItems);
						}
					}
					else
					{
						
						rows.RemoveAt(i);
					}
				}
				else if(OOX::et_w_sdt == item->getType())
				{
					OOX::Logic::CSdt* pStd = static_cast<OOX::Logic::CSdt*>(item);
					if(pStd->m_oSdtContent.IsInit())
						GetTableSize(pStd->m_oSdtContent->m_arrItems, nRows, nCols, ppTblPr);
				}
				else if(OOX::et_w_smartTag == item->getType())
				{
					OOX::Logic::CSmartTag* pSmartTag = static_cast<OOX::Logic::CSmartTag*>(item);
					GetTableSize(pSmartTag->m_arrItems, nRows, nCols, ppTblPr);
				}
				else if(OOX::et_w_dir == item->getType())
				{
					OOX::Logic::CDir* pDir = static_cast<OOX::Logic::CDir*>(item);
					GetTableSize(pDir->m_arrItems, nRows, nCols, ppTblPr);
				}
				else if(OOX::et_w_bdo == item->getType())
				{
					OOX::Logic::CBdo* pBdo = static_cast<OOX::Logic::CBdo*>(item);
					GetTableSize(pBdo->m_arrItems, nRows, nCols, ppTblPr);
				}
			}
		}
		int GetColsCount(const CSimpleArray<OOX::WritingElement *>& arrItems)
		{
			int nColCount = 0;
			for(int i = 0, length = arrItems.GetSize(); i < length; ++i)
			{
				OOX::WritingElement* item = arrItems[i];
				if(OOX::et_w_tc == item->getType())
				{
					nColCount++;
					OOX::Logic::CTc* tc = static_cast<OOX::Logic::CTc*>(item);
					for(int j = 0, length2 = tc->m_arrItems.GetSize(); j < length2; ++j)
					{
						OOX::WritingElement* item2 = tc->m_arrItems[j];
						if(OOX::et_w_tcPr == item2->getType())
						{
							OOX::Logic::CTableCellProperties* tcPr = static_cast<OOX::Logic::CTableCellProperties*>(item2);
							if(tcPr->m_oGridSpan.IsInit() && tcPr->m_oGridSpan->m_oVal.IsInit())
							{
								int nGridSpan = tcPr->m_oGridSpan->m_oVal->GetValue();
								if(nGridSpan > 0)
									nColCount += nGridSpan;
							}
						}
					}
				}
				else if(OOX::et_w_sdt == item->getType())
				{
					OOX::Logic::CSdt* pStd = static_cast<OOX::Logic::CSdt*>(item);
					if(pStd->m_oSdtContent.IsInit())
						nColCount += GetColsCount(pStd->m_oSdtContent.get().m_arrItems);
				}
				else if(OOX::et_w_smartTag == item->getType())
				{
					OOX::Logic::CSmartTag* pSmartTag = static_cast<OOX::Logic::CSmartTag*>(item);
					nColCount += GetColsCount(pSmartTag->m_arrItems);
				}
				else if(OOX::et_w_dir == item->getType())
				{
					OOX::Logic::CDir* pDir = static_cast<OOX::Logic::CDir*>(item);
					nColCount += GetColsCount(pDir->m_arrItems);
				}
				else if(OOX::et_w_bdo == item->getType())
				{
					OOX::Logic::CBdo* pBdo = static_cast<OOX::Logic::CBdo*>(item);
					nColCount += GetColsCount(pBdo->m_arrItems);
				}
			}
			return nColCount;
		}
		void WriteTblGrid(const OOX::Logic::CTblGrid& grid)
		{
			for(int i = 0, length = grid.m_arrGridCol.GetSize(); i < length; i++)
			{
				const ComplexTypes::Word::CTblGridCol& item = grid.m_arrGridCol[i];
				if(item.m_oW.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerDocTableType::tblGrid_Item);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
					m_oBcw.m_oStream.WriteDouble2(item.m_oW->ToMm());
				}
			}
		};

		void WriteTableContent(CSimpleArray<OOX::WritingElement *>& Content, OOX::Logic::CTableProperty* pTblPr, int nRows, int nCols)
		{
			int nCurPos = 0;
			int nCurRowIndex = 0;
			for(int i = 0, length = Content.GetSize(); i < length; ++i)
			{
				OOX::WritingElement* item = Content[i];
				if(OOX::et_w_tr == item->getType())
				{
					nCurPos = m_oBcw.WriteItemStart(c_oSerDocTableType::Row);
					WriteRow(*static_cast<OOX::Logic::CTr*>(item), pTblPr, nCurRowIndex, nRows, nCols);
					m_oBcw.WriteItemEnd(nCurPos);
					nCurRowIndex++;
				}
				else if(OOX::et_w_sdt == item->getType())
				{
					OOX::Logic::CSdt* pStd = static_cast<OOX::Logic::CSdt*>(item);
					if(pStd->m_oSdtContent.IsInit())
						WriteTableContent(pStd->m_oSdtContent->m_arrItems, pTblPr, nRows, nCols);
				}
				else if(OOX::et_w_smartTag == item->getType())
				{
					OOX::Logic::CSmartTag* pSmartTag = static_cast<OOX::Logic::CSmartTag*>(item);
					WriteTableContent(pSmartTag->m_arrItems, pTblPr, nRows, nCols);
				}
				else if(OOX::et_w_dir == item->getType())
				{
					OOX::Logic::CDir* pDir = static_cast<OOX::Logic::CDir*>(item);
					WriteTableContent(pDir->m_arrItems, pTblPr, nRows, nCols);
				}
				else if(OOX::et_w_bdo == item->getType())
				{
					OOX::Logic::CBdo* pBdo = static_cast<OOX::Logic::CBdo*>(item);
					WriteTableContent(pBdo->m_arrItems, pTblPr, nRows, nCols);
				}
			}
		};
		void WriteRow(const OOX::Logic::CTr& Row, OOX::Logic::CTableProperty* pTblPr, int nCurRowIndex, int nRows, int nCols)
		{
			int nCurPos = 0;
			
			OOX::Logic::CTableRowProperties* pTrPr = NULL;
			for(int i = 0, length = Row.m_arrItems.GetSize(); i < length; ++i)
			{
				OOX::WritingElement* item = Row.m_arrItems[i];
				if(OOX::et_w_trPr == item->getType())
				{
					pTrPr = new OOX::Logic::CTableRowProperties();
					*pTrPr = *static_cast<OOX::Logic::CTableRowProperties*>(item);
					break;
				}
			}
			if(NULL != pTrPr)
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSerDocTableType::Row_Pr);
				btblPrs.WriteRowPr(*pTrPr);
				m_oBcw.WriteItemEnd(nCurPos);
			}

			
			nCurPos = m_oBcw.WriteItemStart(c_oSerDocTableType::Row_Content);
			WriteRowContent(Row.m_arrItems, pTblPr, nCurRowIndex, nRows, nCols);
			m_oBcw.WriteItemEnd(nCurPos);

			RELEASEOBJECT(pTrPr);
		};

		void WriteRowContent(const CSimpleArray<OOX::WritingElement *>& Content, OOX::Logic::CTableProperty* pTblPr, int nCurRowIndex, int nRows, int nCols)
		{
			int nCurPos = 0;
			int nCurColIndex = 0;
			for(int i = 0, length = Content.GetSize(); i < length; i++)
			{
				OOX::WritingElement* item = Content[i];
				if(OOX::et_w_tc == item->getType())
				{
					OOX::Logic::CTc* tc = static_cast<OOX::Logic::CTc*>(item);
					nCurPos = m_oBcw.WriteItemStart(c_oSerDocTableType::Cell);
					WriteCell(*tc, pTblPr, nCurRowIndex, nCurColIndex, nRows, nCols);
					m_oBcw.WriteItemEnd(nCurPos);
					nCurColIndex++;
				}
				else if(OOX::et_w_sdt == item->getType())
				{
					OOX::Logic::CSdt* pStd = static_cast<OOX::Logic::CSdt*>(item);
					if(pStd->m_oSdtContent.IsInit())
						WriteRowContent(pStd->m_oSdtContent.get().m_arrItems, pTblPr, nCurRowIndex, nRows, nCols);
				}
				else if(OOX::et_w_smartTag == item->getType())
				{
					OOX::Logic::CSmartTag* pSmartTag = static_cast<OOX::Logic::CSmartTag*>(item);
					WriteRowContent(pSmartTag->m_arrItems, pTblPr, nCurRowIndex, nRows, nCols);
				}
				else if(OOX::et_w_dir == item->getType())
				{
					OOX::Logic::CDir* pDir = static_cast<OOX::Logic::CDir*>(item);
					WriteRowContent(pDir->m_arrItems, pTblPr, nCurRowIndex, nRows, nCols);
				}
				else if(OOX::et_w_bdo == item->getType())
				{
					OOX::Logic::CBdo* pBdo = static_cast<OOX::Logic::CBdo*>(item);
					WriteRowContent(pBdo->m_arrItems, pTblPr, nCurRowIndex, nRows, nCols);
				}
			}
		};
		void WriteCell(OOX::Logic::CTc& tc, OOX::Logic::CTableProperty* pTblPr, int nCurRowIndex, int nCurColIndex, int nRows, int nCols)
		{
			int nCurPos = 0;

			
			
			OOX::Logic::CTableCellProperties* pTcPr = NULL;
			for(int i = 0, length = tc.m_arrItems.GetSize(); i < length; ++i)
			{
				OOX::WritingElement* item = tc.m_arrItems[i];
				if(OOX::et_w_tcPr == item->getType())
				{
					pTcPr = new OOX::Logic::CTableCellProperties();
					*pTcPr = *static_cast<OOX::Logic::CTableCellProperties*>(item);
				}
			}
			if(NULL != pTcPr)
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSerDocTableType::Cell_Pr);
				btblPrs.WriteCellPr(*pTcPr);
				m_oBcw.WriteItemEnd(nCurPos);
			}

			
			BinaryDocumentTableWriter oBinaryDocumentTableWriter(m_oBcw.m_oStream, m_oBcw.m_pEmbeddedFontsManager, brPrs.m_poTheme, m_oSettings, brPrs.m_oFontProcessor, m_oDocumentRels, m_pOfficeDrawingConverter, m_mapIgnoreComments);
			nCurPos = m_oBcw.WriteItemStart(c_oSerDocTableType::Cell_Content);
			oBinaryDocumentTableWriter.WriteDocumentContent(tc.m_arrItems);
			m_oBcw.WriteItemEnd(nCurPos);

			RELEASEOBJECT(pTcPr);
		};
		void WriteSectPr(OOX::Logic::CSectionProperty* pSectPr)
		{
			int nCurPos = 0;
			
			nCurPos = m_oBcw.WriteItemStart(c_oSerProp_secPrType::pgSz);
			WritePageSize(pSectPr);
			m_oBcw.WriteItemEnd(nCurPos);
			
			nCurPos = m_oBcw.WriteItemStart(c_oSerProp_secPrType::pgMar);
			WritePageMargin(pSectPr);
			m_oBcw.WriteItemEnd(nCurPos);
			
			nCurPos = m_oBcw.WriteItemStart(c_oSerProp_secPrType::setting);
			WritePageSettings(pSectPr);
			m_oBcw.WriteItemEnd(nCurPos);
		};
		void WritePageSettings(OOX::Logic::CSectionProperty* pSectPr)
		{
			bool titlePg = false;
			bool EvenAndOddHeaders = false;
			if(NULL != pSectPr && pSectPr->m_oTitlePg.IsInit() && SimpleTypes::onoffTrue == pSectPr->m_oTitlePg->m_oVal.GetValue())
				titlePg = true;
			if(NULL != m_oSettings && m_oSettings->m_oEvenAndOddHeaders.IsInit() && SimpleTypes::onoffTrue == m_oSettings->m_oEvenAndOddHeaders.get().m_oVal.GetValue())
				EvenAndOddHeaders = true;
			
			m_oBcw.m_oStream.WriteByte(c_oSerProp_secPrSettingsType::titlePg);
			m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
			m_oBcw.m_oStream.WriteBool(titlePg);
			
			m_oBcw.m_oStream.WriteByte(c_oSerProp_secPrSettingsType::EvenAndOddHeaders);
			m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
			m_oBcw.m_oStream.WriteBool(EvenAndOddHeaders);
		};
		void WritePageSize(OOX::Logic::CSectionProperty* pSectPr)
		{
			double W = Page_Width;
			double H = Page_Height;
			BYTE Orientation = orientation_Portrait;
			if(NULL != pSectPr && pSectPr->m_oPgSz.IsInit())
			{
				const ComplexTypes::Word::CPageSz& pSz = pSectPr->m_oPgSz.get();
				if(pSz.m_oW.IsInit())
					W = pSz.m_oW.get().ToMm();
				if(pSz.m_oH.IsInit())
					H = pSz.m_oH.get().ToMm();
				if(pSz.m_oOrient.IsInit())
				{
					switch(pSz.m_oOrient.get().GetValue())
					{
					case SimpleTypes::pageorientPortrait: Orientation = orientation_Portrait;break;
					case SimpleTypes::pageorientLandscape: Orientation = orientation_Landscape;break;
					}
				}
			}
			
			m_oBcw.m_oStream.WriteByte(c_oSer_pgSzType::W);
			m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
			m_oBcw.m_oStream.WriteDouble2(W);
			
			m_oBcw.m_oStream.WriteByte(c_oSer_pgSzType::H);
			m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
			m_oBcw.m_oStream.WriteDouble2(H);
			
			m_oBcw.m_oStream.WriteByte(c_oSer_pgSzType::Orientation);
			m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
			m_oBcw.m_oStream.WriteByte(Orientation);
		};
		void WritePageMargin(OOX::Logic::CSectionProperty* pSectPr)
		{
			double H = Page_Height;
			double L = X_Left_Margin;
			double T = Y_Top_Margin;
			double R = X_Right_Margin;
			double B = Y_Bottom_Margin;
			double Header = Y_Default_Header;
			double Footer = Y_Default_Footer;
			if(NULL != pSectPr && pSectPr->m_oPgSz.IsInit() && pSectPr->m_oPgMar.IsInit())
			{
				const ComplexTypes::Word::CPageSz& pSz = pSectPr->m_oPgSz.get();
				if(pSz.m_oH.IsInit())
					H = pSz.m_oH.get().ToMm();

				const ComplexTypes::Word::CPageMar& pMar = pSectPr->m_oPgMar.get();
				if(pMar.m_oLeft.IsInit())
					L = pMar.m_oLeft.get().ToMm();
				if(pMar.m_oTop.IsInit())
					T = pMar.m_oTop.get().ToMm();
				if(pMar.m_oRight.IsInit())
					R = pMar.m_oRight.get().ToMm();
				if(pMar.m_oBottom.IsInit())
					B = pMar.m_oBottom.get().ToMm();
				if(pMar.m_oHeader.IsInit())
					Header = pMar.m_oHeader.get().ToMm();
				if(pMar.m_oFooter.IsInit())
					Footer = pMar.m_oFooter.get().ToMm();
			}
			
			m_oBcw.m_oStream.WriteByte(c_oSer_pgMarType::Left);
			m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
			m_oBcw.m_oStream.WriteDouble2(L);
			
			m_oBcw.m_oStream.WriteByte(c_oSer_pgMarType::Top);
			m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
			m_oBcw.m_oStream.WriteDouble2(T);
			
			m_oBcw.m_oStream.WriteByte(c_oSer_pgMarType::Right);
			m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
			m_oBcw.m_oStream.WriteDouble2(R);
			
			m_oBcw.m_oStream.WriteByte(c_oSer_pgMarType::Bottom);
			m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
			m_oBcw.m_oStream.WriteDouble2(B);
			
			m_oBcw.m_oStream.WriteByte(c_oSer_pgMarType::Header);
			m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
			m_oBcw.m_oStream.WriteDouble2(Header);
			
			m_oBcw.m_oStream.WriteByte(c_oSer_pgMarType::Footer);
			m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
			m_oBcw.m_oStream.WriteDouble2(Footer);
		};
	};
	class BinaryHeaderFooterTableWriter
	{
		BinaryCommonWriter m_oBcw;
		CSimpleArray<OOX::WritingElement*>* m_aHdrFirst;
		CSimpleArray<OOX::WritingElement*>* m_aHdrEven;
		CSimpleArray<OOX::WritingElement*>* m_aHdrOdd;
		CSimpleArray<OOX::WritingElement*>* m_aFtrFirst;
		CSimpleArray<OOX::WritingElement*>* m_aFtrEven;
		CSimpleArray<OOX::WritingElement*>* m_aFtrOdd;
		OOX::CHdrFtr* m_oHdrFirstRels;
		OOX::CHdrFtr* m_oHdrEvenRels;
		OOX::CHdrFtr* m_oHdrOddRels;
		OOX::CHdrFtr* m_oFtrFirstRels;
		OOX::CHdrFtr* m_oFtrEvenRels;
		OOX::CHdrFtr* m_oFtrOddRels;

		OOX::Logic::CSectionProperty* m_pSectPr;
		OOX::CSettings* m_oSettings;
		OOX::CTheme* m_poTheme;
		DocWrapper::FontProcessor& m_oFontProcessor;
		PPTXFile::IAVSOfficeDrawingConverter* m_pOfficeDrawingConverter;
		OOX::IFileContainer** m_ppCurRels;
	public:
		OOX::Logic::CSectionProperty* pSectPr;
	public:
		BinaryHeaderFooterTableWriter(Streams::CBufferedStream &oCBufferedStream, OOX::IFileContainer** ppCurRels, NSFontCutter::CEmbeddedFontsManager* pEmbeddedFontsManager, OOX::CTheme* poTheme, DocWrapper::FontProcessor& oFontProcessor,
			CSimpleArray<OOX::WritingElement*>* aHdrFirst, CSimpleArray<OOX::WritingElement*>* aHdrEven, CSimpleArray<OOX::WritingElement*>* aHdrOdd,
			CSimpleArray<OOX::WritingElement*>* aFtrFirst, CSimpleArray<OOX::WritingElement*>* aFtrEven, CSimpleArray<OOX::WritingElement*>* aFtrOdd,
			OOX::CHdrFtr* oHdrFirstRels, OOX::CHdrFtr* oHdrEvenRels, OOX::CHdrFtr* oHdrOddRels, OOX::CHdrFtr* oFtrFirstRels, OOX::CHdrFtr* oFtrEvenRels, OOX::CHdrFtr* oFtrOddRels,
			OOX::Logic::CSectionProperty* pSectPr, OOX::CSettings* oSettings, PPTXFile::IAVSOfficeDrawingConverter* pOfficeDrawingConverter):
		m_ppCurRels(ppCurRels),
		m_oBcw(oCBufferedStream, pEmbeddedFontsManager), m_poTheme(poTheme), m_oFontProcessor(oFontProcessor),
			m_aHdrFirst(aHdrFirst),m_aHdrEven(aHdrEven),m_aHdrOdd(aHdrOdd),
			m_aFtrFirst(aFtrFirst),m_aFtrEven(aFtrEven),m_aFtrOdd(aFtrOdd),
			m_oHdrFirstRels(oHdrFirstRels),m_oHdrEvenRels(oHdrEvenRels),m_oHdrOddRels(oHdrOddRels),
			m_oFtrFirstRels(oFtrFirstRels),m_oFtrEvenRels(oFtrEvenRels),m_oFtrOddRels(oFtrOddRels),
			m_pSectPr(pSectPr),m_oSettings(oSettings),m_pOfficeDrawingConverter(pOfficeDrawingConverter)
		{
			pSectPr = NULL;
		};
		void Write()
		{
			int nStart = m_oBcw.WriteItemWithLengthStart();
			WriteHeaderFooterContent();
			m_oBcw.WriteItemWithLengthEnd(nStart);
		}
		void WriteHeaderFooterContent()
		{
			int nCurPos = 0;
			
			if(NULL != m_aHdrFirst || NULL != m_aHdrEven || NULL != m_aHdrOdd)
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSerHdrFtrTypes::Header);
				WriteHdrFtrContent(m_aHdrFirst, m_aHdrEven, m_aHdrOdd, m_oHdrFirstRels, m_oHdrEvenRels, m_oHdrOddRels, true);
				m_oBcw.WriteItemEnd(nCurPos);
			}
			
			if(NULL != m_aFtrFirst || NULL != m_aFtrEven || NULL != m_aFtrOdd)
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSerHdrFtrTypes::Footer);
				WriteHdrFtrContent(m_aFtrFirst, m_aFtrEven, m_aFtrOdd, m_oFtrFirstRels, m_oFtrEvenRels, m_oFtrOddRels, false);
				m_oBcw.WriteItemEnd(nCurPos);
			}
		};
		void WriteHdrFtrContent(CSimpleArray<OOX::WritingElement*>* aFirst, CSimpleArray<OOX::WritingElement*>* aEven, CSimpleArray<OOX::WritingElement*>* aOdd,
								OOX::CHdrFtr* oFirstRels, OOX::CHdrFtr* oEvenRels, OOX::CHdrFtr* oOddRels, bool bHdr)
		{
			int nCurPos = 0;
			
			if(NULL != aOdd)
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSerHdrFtrTypes::HdrFtr_Odd);
				WriteHdrFtrItem(aOdd, bHdr, oOddRels);
				m_oBcw.WriteItemEnd(nCurPos);
			}
			
			if(NULL != aEven && NULL != m_oSettings && m_oSettings->m_oEvenAndOddHeaders.IsInit() && SimpleTypes::onoffTrue == m_oSettings->m_oEvenAndOddHeaders.get().m_oVal.GetValue() )
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSerHdrFtrTypes::HdrFtr_Even);
				WriteHdrFtrItem(aEven, bHdr, oEvenRels);
				m_oBcw.WriteItemEnd(nCurPos);
			}
			
			if(NULL != aFirst && NULL != m_pSectPr && m_pSectPr->m_oTitlePg.IsInit() && SimpleTypes::onoffTrue == m_pSectPr->m_oTitlePg.get().m_oVal.GetValue())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSerHdrFtrTypes::HdrFtr_First);
				WriteHdrFtrItem(aFirst, bHdr, oFirstRels);
				m_oBcw.WriteItemEnd(nCurPos);
			}
		};
		void WriteHdrFtrItem(CSimpleArray<OOX::WritingElement*>* aContent, bool bHdr, OOX::CHdrFtr* oHdrFtr)
		{
			int nCurPos = 0;
			double BoundY = 0;
			double BoundY2 = 0;
			if(bHdr)
			{
				BoundY = Y_Top_Margin;
				BoundY2 = Y_Default_Header;
				if(NULL != m_pSectPr && m_pSectPr->m_oPgMar.IsInit() && m_pSectPr->m_oPgMar->m_oTop.IsInit())
					BoundY = m_pSectPr->m_oPgMar->m_oTop.get().ToMm();
				if(NULL != m_pSectPr && m_pSectPr->m_oPgMar.IsInit() && m_pSectPr->m_oPgMar->m_oHeader.IsInit())
					BoundY2 = m_pSectPr->m_oPgMar->m_oHeader.get().ToMm();
			}
			else
			{
				double H = Page_Height;
				double B = Y_Bottom_Margin;
				double F = Y_Default_Footer;
				if(NULL != m_pSectPr)
				{
					if(m_pSectPr->m_oPgSz.IsInit() && m_pSectPr->m_oPgSz->m_oH.IsInit())
						H = m_pSectPr->m_oPgSz->m_oH.get().ToMm();
					if(m_pSectPr->m_oPgMar.IsInit())
					{
						if(m_pSectPr->m_oPgMar->m_oBottom.IsInit())
							B = m_pSectPr->m_oPgMar->m_oBottom.get().ToMm();
						if(m_pSectPr->m_oPgMar->m_oFooter.IsInit())
							F = m_pSectPr->m_oPgMar->m_oFooter.get().ToMm();
					}
				}
				BoundY = H - B;
				BoundY2 = H - F;
			}

			
			
			nCurPos = m_oBcw.WriteItemStart(c_oSerHdrFtrTypes::HdrFtr_Y);
			m_oBcw.m_oStream.WriteDouble2(BoundY);
			m_oBcw.WriteItemEnd(nCurPos);
			
			nCurPos = m_oBcw.WriteItemStart(c_oSerHdrFtrTypes::HdrFtr_Y2);
			m_oBcw.m_oStream.WriteDouble2(BoundY2);
			m_oBcw.WriteItemEnd(nCurPos);
			
			(*m_ppCurRels) = oHdrFtr;
			BinaryDocumentTableWriter oBinaryDocumentTableWriter(m_oBcw.m_oStream, m_oBcw.m_pEmbeddedFontsManager, m_poTheme, m_oSettings, m_oFontProcessor, oHdrFtr, m_pOfficeDrawingConverter, NULL);
			oBinaryDocumentTableWriter.prepareOfficeDrawingConverter(m_pOfficeDrawingConverter, oHdrFtr->m_oReadPath.GetPath(),  oHdrFtr->m_arrShapeTypes);
			oBinaryDocumentTableWriter.pSectPr = pSectPr;
			nCurPos = m_oBcw.WriteItemStart(c_oSerHdrFtrTypes::HdrFtr_Content);
			oBinaryDocumentTableWriter.WriteDocumentContent(*aContent);
			m_oBcw.WriteItemEnd(nCurPos);
		};
	};
	class BinaryCommentsTableWriter
	{
		class CCommentWriteTemp
		{
		public:
			OOX::CComment* pComment;
			nullable<bool> bDone;
			nullable<CString> sUserId;
			CAtlArray<CCommentWriteTemp*> aReplies;
		};
		BinaryCommonWriter m_oBcw;
	public:
		BinaryCommentsTableWriter(Streams::CBufferedStream &oCBufferedStream, NSFontCutter::CEmbeddedFontsManager* pEmbeddedFontsManager):m_oBcw(oCBufferedStream, pEmbeddedFontsManager)
		{
		};
		void Write(OOX::CComments& oComments, OOX::CCommentsExt* pCommentsExt, OOX::CPeople* pPeople, CAtlMap<int, bool>& mapIgnoreComments)
		{
			int nStart = m_oBcw.WriteItemWithLengthStart();
			WriteCommentsContent(oComments, pCommentsExt, pPeople, mapIgnoreComments);
			m_oBcw.WriteItemWithLengthEnd(nStart);
		}
		void WriteCommentsContent(OOX::CComments& oComments, OOX::CCommentsExt* pCommentsExt, OOX::CPeople* pPeople, CAtlMap<int, bool>& mapIgnoreComments)
		{
			CAtlMap<CString, CString> mapAuthorToUserId;
			CAtlMap<int, CCommentWriteTemp*> mapParaIdToComment;
			CAtlMap<int, bool> mapCommentsIgnore;
			CAtlArray<CCommentWriteTemp*> aCommentsToWrite;
			
			if(NULL != pPeople)
			{
				for(int i = 0, length = pPeople->m_arrPeoples.GetSize(); i < length; i++)
				{
					OOX::CPerson* pPerson = pPeople->m_arrPeoples[i];
					if(NULL != pPerson && pPerson->m_oAuthor.IsInit() && pPerson->m_oPresenceInfo.IsInit() && pPerson->m_oPresenceInfo->m_oProviderId.IsInit() && _T("Teamlab") == pPerson->m_oPresenceInfo->m_oProviderId.get2() && pPerson->m_oPresenceInfo->m_oUserId.IsInit())
						mapAuthorToUserId[pPerson->m_oAuthor.get2()] = pPerson->m_oPresenceInfo->m_oUserId.get2();
				}
			}
			
			for(int i = 0, length = oComments.m_arrComments.GetSize(); i < length; ++i)
			{
				OOX::CComment* pComment = oComments.m_arrComments[i];
				CCommentWriteTemp* pNewCommentWriteTemp = new CCommentWriteTemp();
				pNewCommentWriteTemp->pComment = pComment;
				if(pComment->m_oAuthor.IsInit())
				{
					CAtlMap<CString, CString>::CPair* pPair = mapAuthorToUserId.Lookup(pComment->m_oAuthor.get2());
					if(NULL != pPair)
						pNewCommentWriteTemp->sUserId = pPair->m_value;
				}
				for(int j = 0, length2 = pComment->m_arrItems.GetSize(); j < length2; j++)
				{
					OOX::WritingElement* pWe = pComment->m_arrItems[j];
					if(OOX::et_w_p == pWe->getType())
					{
						OOX::Logic::CParagraph* pParagraph = static_cast<OOX::Logic::CParagraph*>(pWe);
						if(pParagraph->m_oParaId.IsInit())
							mapParaIdToComment[pParagraph->m_oParaId->GetValue()] = pNewCommentWriteTemp;
					}
				}
				aCommentsToWrite.Add(pNewCommentWriteTemp);
			}
			
			if(NULL != pCommentsExt)
			{
				for(int i = 0, length = pCommentsExt->m_arrComments.GetSize(); i < length; i++)
				{
					OOX::CCommentExt* pCommentExt = pCommentsExt->m_arrComments[i];
					if(pCommentExt->m_oParaId.IsInit())
					{
						CAtlMap<int, CCommentWriteTemp*>::CPair* pPair = mapParaIdToComment.Lookup(pCommentExt->m_oParaId->GetValue());
						if(NULL != pPair)
						{
							CCommentWriteTemp* pCommentWriteTemp = pPair->m_value;
							OOX::CComment* pComment = pCommentWriteTemp->pComment;
							if(pCommentExt->m_oDone.IsInit())
								pCommentWriteTemp->bDone = pCommentExt->m_oDone->ToBool();
							if(pCommentExt->m_oParaIdParent.IsInit())
							{
								int nParaIdParent = pCommentExt->m_oParaIdParent->GetValue();
								CAtlMap<int, CCommentWriteTemp*>::CPair* pPairParent = mapParaIdToComment.Lookup(nParaIdParent);
								if(NULL != pPairParent)
								{
									CCommentWriteTemp* pCommentWriteTempParent = pPairParent->m_value;
									pCommentWriteTempParent->aReplies.Add(pCommentWriteTemp);
									if(NULL != pComment && pComment->m_oId.IsInit())
										mapIgnoreComments[pComment->m_oId->GetValue()] = true;
								}
							}
						}
					}
				}
			}
			int nCurPos = 0;

			for(int i = 0, length = aCommentsToWrite.GetCount(); i < length; ++i)
			{
				CCommentWriteTemp* pCommentWriteTemp = aCommentsToWrite[i];
				if(NULL != pCommentWriteTemp && NULL != pCommentWriteTemp->pComment && pCommentWriteTemp->pComment->m_oId.IsInit() && NULL == mapIgnoreComments.Lookup(pCommentWriteTemp->pComment->m_oId->GetValue()))
				{
					int nStart = m_oBcw.WriteItemStart(c_oSer_CommentsType::Comment);
					WriteComment(*aCommentsToWrite[i]);
					m_oBcw.WriteItemEnd(nStart);
				}
			}

			for(int i = 0, length = aCommentsToWrite.GetCount(); i < length; ++i)
				delete aCommentsToWrite[i];
		};
		void WriteComment(CCommentWriteTemp& oComment)
		{
			int nCurPos = 0;
			OOX::CComment* pComment = oComment.pComment;
			if(NULL != pComment)
			{
				if(pComment->m_oAuthor.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSer_CommentsType::UserName);
					m_oBcw.m_oStream.WriteString2(pComment->m_oAuthor.get2());
				}
				if(pComment->m_oDate.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSer_CommentsType::Date);
					m_oBcw.m_oStream.WriteString2(pComment->m_oDate->ToString());
				}
				if(pComment->m_oId.IsInit())
				{
					nCurPos = m_oBcw.WriteItemStart(c_oSer_CommentsType::Id);
					m_oBcw.m_oStream.WriteLong(pComment->m_oId->GetValue());
					m_oBcw.WriteItemEnd(nCurPos);
				}
				if(pComment->m_oInitials.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSer_CommentsType::Initials);
					m_oBcw.m_oStream.WriteString2(pComment->m_oInitials.get2());
				}
				m_oBcw.m_oStream.WriteByte(c_oSer_CommentsType::Text);
				m_oBcw.m_oStream.WriteString2(pComment->getText());

				if(oComment.sUserId.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSer_CommentsType::UserId);
					m_oBcw.m_oStream.WriteString2(oComment.sUserId.get2());
				}
				if(oComment.bDone.IsInit())
				{
					nCurPos = m_oBcw.WriteItemStart(c_oSer_CommentsType::Solved);
					m_oBcw.m_oStream.WriteBool(oComment.bDone.get2());
					m_oBcw.WriteItemEnd(nCurPos);
				}
				if(oComment.aReplies.GetCount() > 0)
				{
					nCurPos = m_oBcw.WriteItemStart(c_oSer_CommentsType::Replies);
					WriteReplies(oComment.aReplies);
					m_oBcw.WriteItemEnd(nCurPos);
				}
			}

		};
		void WriteReplies(CAtlArray<CCommentWriteTemp*>& aCommentWriteTemp)
		{
			int nCurPos = 0;
			for(int i = 0, length = aCommentWriteTemp.GetCount(); i < length; i++)
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_CommentsType::Comment);
				WriteComment(*aCommentWriteTemp[i]);
				m_oBcw.WriteItemEnd(nCurPos);
			}
		}
	};
	class BinarySettingsTableWriter
	{
		BinaryCommonWriter m_oBcw;
	public:
		BinarySettingsTableWriter(Streams::CBufferedStream &oCBufferedStream, NSFontCutter::CEmbeddedFontsManager* pEmbeddedFontsManager):m_oBcw(oCBufferedStream, pEmbeddedFontsManager)
		{
		};
		void Write(OOX::CSettings& oSettings)
		{
			int nStart = m_oBcw.WriteItemWithLengthStart();
			WriteSettingsContent(oSettings);
			m_oBcw.WriteItemWithLengthEnd(nStart);
		}
		void WriteSettingsContent(OOX::CSettings& oSettings)
		{
			int nCurPos = 0;
			if(oSettings.m_oClrSchemeMapping.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_SettingsType::ClrSchemeMapping);
				WriteColorSchemeMapping(oSettings.m_oClrSchemeMapping.get());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			if(oSettings.m_oDefaultTabStop.IsInit() && oSettings.m_oDefaultTabStop->m_oVal.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_SettingsType::DefaultTabStop);
				m_oBcw.m_oStream.WriteDouble2(oSettings.m_oDefaultTabStop->m_oVal->ToMm());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			if(oSettings.m_oMathPr.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_SettingsType::MathPr);
				WriteMathPr(oSettings.m_oMathPr.get());
				m_oBcw.WriteItemEnd(nCurPos);
			}
		};
		void WriteMathPr(const OOX::Logic::CMathPr &pMathPr)
		{
			for(int i = 0; i< pMathPr.m_arrItems.GetSize(); ++i)
			{
				OOX::WritingElement* item = pMathPr.m_arrItems[i];
				OOX::EElementType eType = item->getType();
				switch(eType)
				{
				case OOX::et_m_brkBin:
					{
						OOX::Logic::CBrkBin* pBrkBin = static_cast<OOX::Logic::CBrkBin*>(item);
						int nCurPos = m_oBcw.WriteItemStart(c_oSer_MathPrType::BrkBin);
						if (pBrkBin->m_val.IsInit())
						{
							m_oBcw.m_oStream.WriteByte(c_oSer_OMathBottomNodesValType::Val);
							m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
							m_oBcw.m_oStream.WriteByte(pBrkBin->m_val->GetValue());
						}
						m_oBcw.WriteItemEnd(nCurPos);
						break;
					}
				case OOX::et_m_brkBinSub:
					{
						OOX::Logic::CBrkBinSub* pBrkBinSub = static_cast<OOX::Logic::CBrkBinSub*>(item);
						int nCurPos = m_oBcw.WriteItemStart(c_oSer_MathPrType::BrkBinSub);
						if (pBrkBinSub->m_val.IsInit())
						{
							m_oBcw.m_oStream.WriteByte(c_oSer_OMathBottomNodesValType::Val);
							m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
							m_oBcw.m_oStream.WriteByte(pBrkBinSub->m_val->GetValue());
						}
						m_oBcw.WriteItemEnd(nCurPos);
						break;
					}
				case OOX::et_m_defJc:
					{
						OOX::Logic::CDefJc* pDefJc = static_cast<OOX::Logic::CDefJc*>(item);
						int nCurPos = m_oBcw.WriteItemStart(c_oSer_MathPrType::DefJc);
						if (pDefJc->m_val.IsInit())
						{
							m_oBcw.m_oStream.WriteByte(c_oSer_OMathBottomNodesValType::Val);
							m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
							m_oBcw.m_oStream.WriteByte(pDefJc->m_val->GetValue());
						}
						m_oBcw.WriteItemEnd(nCurPos);
						break;
					}
				case OOX::et_m_dispDef:
					{
						OOX::Logic::CDispDef* pDispDef = static_cast<OOX::Logic::CDispDef*>(item);
						int nCurPos = m_oBcw.WriteItemStart(c_oSer_MathPrType::DispDef);
						if (pDispDef->m_val.IsInit())
						{
							m_oBcw.m_oStream.WriteByte(c_oSer_OMathBottomNodesValType::Val);
							m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
							m_oBcw.m_oStream.WriteBool(pDispDef->m_val->GetValue());
						}
						m_oBcw.WriteItemEnd(nCurPos);
						break;
					}
				case OOX::et_m_interSp:
					{
						OOX::Logic::CInterSp* pInterSp = static_cast<OOX::Logic::CInterSp*>(item);
						int nCurPos = m_oBcw.WriteItemStart(c_oSer_MathPrType::InterSp);
						if (pInterSp->m_val.IsInit())
						{
							m_oBcw.m_oStream.WriteByte(c_oSer_OMathBottomNodesValType::Val);
							m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
							m_oBcw.m_oStream.WriteDouble2(pInterSp->m_val->ToMm());
						}
						m_oBcw.WriteItemEnd(nCurPos);
						break;
					}
				case OOX::et_m_intLim:
					{
						OOX::Logic::CIntLim* pIntLim = static_cast<OOX::Logic::CIntLim*>(item);
						int nCurPos = m_oBcw.WriteItemStart(c_oSer_MathPrType::IntLim);
						if (pIntLim->m_val.IsInit())
						{
							m_oBcw.m_oStream.WriteByte(c_oSer_OMathBottomNodesValType::Val);
							m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
							m_oBcw.m_oStream.WriteByte(pIntLim->m_val->GetValue());
						}
						m_oBcw.WriteItemEnd(nCurPos);
						break;
					}
				case OOX::et_m_intraSp:
					{
						OOX::Logic::CIntraSp* pIntraSp = static_cast<OOX::Logic::CIntraSp*>(item);
						int nCurPos = m_oBcw.WriteItemStart(c_oSer_MathPrType::IntraSp);
						if (pIntraSp->m_val.IsInit())
						{
							m_oBcw.m_oStream.WriteByte(c_oSer_OMathBottomNodesValType::Val);
							m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
							m_oBcw.m_oStream.WriteDouble2(pIntraSp->m_val->ToMm());
						}
						m_oBcw.WriteItemEnd(nCurPos);
						break;
					}
				case OOX::et_m_lMargin:
					{
						OOX::Logic::CLMargin* pLMargin = static_cast<OOX::Logic::CLMargin*>(item);
						int nCurPos = m_oBcw.WriteItemStart(c_oSer_MathPrType::LMargin);
						if (pLMargin->m_val.IsInit())
						{
							m_oBcw.m_oStream.WriteByte(c_oSer_OMathBottomNodesValType::Val);
							m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
							m_oBcw.m_oStream.WriteDouble2(pLMargin->m_val->ToMm());
						}
						m_oBcw.WriteItemEnd(nCurPos);
						break;
					}
				case OOX::et_m_mathFont:
					{
						OOX::Logic::CMathFont* pMathFont = static_cast<OOX::Logic::CMathFont*>(item);
						int nCurPos = m_oBcw.WriteItemStart(c_oSer_MathPrType::MathFont);
						if (pMathFont->m_val.IsInit())
						{
							m_oBcw.m_oStream.WriteByte(c_oSer_OMathBottomNodesValType::Val);
							m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);
							m_oBcw.m_oStream.WriteString2(pMathFont->m_val.get2());
						}
						m_oBcw.WriteItemEnd(nCurPos);
						break;
					}
				case OOX::et_m_naryLim:
					{
						OOX::Logic::CNaryLim* pNaryLim = static_cast<OOX::Logic::CNaryLim*>(item);
						int nCurPos = m_oBcw.WriteItemStart(c_oSer_MathPrType::NaryLim);
						if (pNaryLim->m_val.IsInit())
						{
							m_oBcw.m_oStream.WriteByte(c_oSer_OMathBottomNodesValType::Val);
							m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
							m_oBcw.m_oStream.WriteByte(pNaryLim->m_val->GetValue());
						}
						m_oBcw.WriteItemEnd(nCurPos);
						break;
					}
				case OOX::et_m_postSp:
					{
						OOX::Logic::CPostSp* pPostSp = static_cast<OOX::Logic::CPostSp*>(item);
						int nCurPos = m_oBcw.WriteItemStart(c_oSer_MathPrType::PostSp);
						if (pPostSp->m_val.IsInit())
						{
							m_oBcw.m_oStream.WriteByte(c_oSer_OMathBottomNodesValType::Val);
							m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
							m_oBcw.m_oStream.WriteDouble2(pPostSp->m_val->ToMm());
						}
						m_oBcw.WriteItemEnd(nCurPos);
						break;
					}
				case OOX::et_m_preSp:
					{
						OOX::Logic::CPreSp* pPreSp = static_cast<OOX::Logic::CPreSp*>(item);
						int nCurPos = m_oBcw.WriteItemStart(c_oSer_MathPrType::PreSp);
						if (pPreSp->m_val.IsInit())
						{
							m_oBcw.m_oStream.WriteByte(c_oSer_OMathBottomNodesValType::Val);
							m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
							m_oBcw.m_oStream.WriteDouble2(pPreSp->m_val->ToMm());
						}
						m_oBcw.WriteItemEnd(nCurPos);
						break;
					}
				case OOX::et_m_rMargin:
					{
						OOX::Logic::CRMargin* pRMargin = static_cast<OOX::Logic::CRMargin*>(item);
						int nCurPos = m_oBcw.WriteItemStart(c_oSer_MathPrType::RMargin);
						if (pRMargin->m_val.IsInit())
						{
							m_oBcw.m_oStream.WriteByte(c_oSer_OMathBottomNodesValType::Val);
							m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
							m_oBcw.m_oStream.WriteDouble2(pRMargin->m_val->ToMm());
						}
						m_oBcw.WriteItemEnd(nCurPos);
						break;
					}
				case OOX::et_m_smallFrac:
					{
						OOX::Logic::CSmallFrac* pSmallFrac = static_cast<OOX::Logic::CSmallFrac*>(item);
						int nCurPos = m_oBcw.WriteItemStart(c_oSer_MathPrType::SmallFrac);
						if (pSmallFrac->m_val.IsInit())
						{
							m_oBcw.m_oStream.WriteByte(c_oSer_OMathBottomNodesValType::Val);
							m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
							m_oBcw.m_oStream.WriteBool(pSmallFrac->m_val->GetValue());
						}
						m_oBcw.WriteItemEnd(nCurPos);
						break;
					}
				case OOX::et_m_wrapIndent:
					{
						OOX::Logic::CWrapIndent* pWrapIndent = static_cast<OOX::Logic::CWrapIndent*>(item);
						int nCurPos = m_oBcw.WriteItemStart(c_oSer_MathPrType::WrapIndent);
						if (pWrapIndent->m_val.IsInit())
						{
							m_oBcw.m_oStream.WriteByte(c_oSer_OMathBottomNodesValType::Val);
							m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
							m_oBcw.m_oStream.WriteDouble2(pWrapIndent->m_val->ToMm());
						}
						m_oBcw.WriteItemEnd(nCurPos);
						break;
					}
				case OOX::et_m_wrapRight:
					{
						OOX::Logic::CWrapRight* pWrapRight = static_cast<OOX::Logic::CWrapRight*>(item);
						int nCurPos = m_oBcw.WriteItemStart(c_oSer_MathPrType::WrapRight);
						if (pWrapRight->m_val.IsInit())
						{
							m_oBcw.m_oStream.WriteByte(c_oSer_OMathBottomNodesValType::Val);
							m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
							m_oBcw.m_oStream.WriteBool(pWrapRight->m_val->GetValue());
						}
						m_oBcw.WriteItemEnd(nCurPos);
						break;
					}
				}
			}			
		}
		void WriteColorSchemeMapping(const OOX::Settings::CColorSchemeMapping& oColorSchemeMapping)
		{
			int nCurPos = 0;
			if(oColorSchemeMapping.m_oAccent1.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_ClrSchemeMappingType::Accent1);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteByte(oColorSchemeMapping.m_oAccent1->GetValue());
			}
			if(oColorSchemeMapping.m_oAccent2.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_ClrSchemeMappingType::Accent2);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteByte(oColorSchemeMapping.m_oAccent2->GetValue());
			}
			if(oColorSchemeMapping.m_oAccent3.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_ClrSchemeMappingType::Accent3);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteByte(oColorSchemeMapping.m_oAccent3->GetValue());
			}
			if(oColorSchemeMapping.m_oAccent4.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_ClrSchemeMappingType::Accent4);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteByte(oColorSchemeMapping.m_oAccent4->GetValue());
			}
			if(oColorSchemeMapping.m_oAccent5.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_ClrSchemeMappingType::Accent5);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteByte(oColorSchemeMapping.m_oAccent5->GetValue());
			}
			if(oColorSchemeMapping.m_oAccent6.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_ClrSchemeMappingType::Accent6);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteByte(oColorSchemeMapping.m_oAccent6->GetValue());
			}
			if(oColorSchemeMapping.m_oBg1.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_ClrSchemeMappingType::Bg1);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteByte(oColorSchemeMapping.m_oBg1->GetValue());
			}
			if(oColorSchemeMapping.m_oBg2.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_ClrSchemeMappingType::Bg2);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteByte(oColorSchemeMapping.m_oBg2->GetValue());
			}
			if(oColorSchemeMapping.m_oFollowedHyperlink.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_ClrSchemeMappingType::FollowedHyperlink);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteByte(oColorSchemeMapping.m_oFollowedHyperlink->GetValue());
			}
			if(oColorSchemeMapping.m_oHyperlink.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_ClrSchemeMappingType::Hyperlink);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteByte(oColorSchemeMapping.m_oHyperlink->GetValue());
			}
			if(oColorSchemeMapping.m_oT1.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_ClrSchemeMappingType::T1);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteByte(oColorSchemeMapping.m_oT1->GetValue());
			}
			if(oColorSchemeMapping.m_oT2.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_ClrSchemeMappingType::T2);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteByte(oColorSchemeMapping.m_oT2->GetValue());
			}
		};
	};
	class BinaryFileWriter
	{
		BinaryCommonWriter m_oBcw;
		int m_nLastFilePos;
		int m_nRealTableCount;
		int m_nMainTableStart;
	public:
		DocWrapper::FontProcessor& m_oFontProcessor;
		NSFontCutter::CEmbeddedFontsManager* m_oEmbeddedFontsManager;
		PPTXFile::IAVSOfficeDrawingConverter* m_pOfficeDrawingConverter;
		OOX::CTheme* m_pTheme;
		OOX::CSettings* m_pSettings;
		OOX::IFileContainer* m_pCurRels;

	public: BinaryFileWriter(Streams::CBufferedStream &oCBufferedStream, DocWrapper::FontProcessor& fp, NSFontCutter::CEmbeddedFontsManager* pEmbeddedFontsManager, PPTXFile::IAVSOfficeDrawingConverter* pOfficeDrawingConverter):
					m_oBcw(oCBufferedStream, pEmbeddedFontsManager), m_oFontProcessor(fp), m_oEmbeddedFontsManager(pEmbeddedFontsManager), m_pOfficeDrawingConverter(pOfficeDrawingConverter)
			{
				m_nLastFilePos = 0;
				m_nRealTableCount = 0;
			}
			static CString WriteFileHeader(long nDataSize)
			{
				CString sHeader;
				sHeader.Format(_T("%s;v%d;%d;"), g_sFormatSignature, g_nFormatVersion, nDataSize);
				return sHeader;
			}
			void WriteMainTableStart()
			{
				int nTableCount = 128;
				m_nRealTableCount = 0;
				m_nMainTableStart = m_oBcw.m_oStream.GetPosition();
				
				int nmtItemSize = 5;
				m_nLastFilePos = m_nMainTableStart + nTableCount * nmtItemSize;
				
				m_oBcw.m_oStream.WriteByte(0);

				
				int nCurPos = WriteTableStart(c_oSerTableTypes::Signature);
				BinarySigTableWriter oBinarySigTableWriter(m_oBcw.m_oStream, m_oBcw.m_pEmbeddedFontsManager);
				oBinarySigTableWriter.Write();
				WriteTableEnd(nCurPos);
			}
			void WriteMainTableEnd(LPSAFEARRAY pTheme)
			{
				
				int nCurPos = WriteTableStart(c_oSerTableTypes::Other);
				BinaryOtherTableWriter oBinaryOtherTableWriter(m_oBcw.m_oStream, m_oBcw.m_pEmbeddedFontsManager, pTheme);
				oBinaryOtherTableWriter.Write();
				WriteTableEnd(nCurPos);

				
				m_oBcw.m_oStream.Seek(m_nMainTableStart);
				m_oBcw.m_oStream.WriteByte(m_nRealTableCount);

				
				m_oBcw.m_oStream.Seek(m_nLastFilePos);
			}
			int ReserveTable(BYTE type)
			{
				
				int nCurPos = m_oBcw.m_oStream.GetPosition();
				
				
				m_oBcw.m_oStream.WriteByte(type);
				
				m_oBcw.m_oStream.WriteLong(m_nLastFilePos);
				return nCurPos;
			}
			int WriteTableStart(BYTE type, int nStartPos = -1)
			{
				if(-1 != nStartPos)
					m_oBcw.m_oStream.Seek(nStartPos);
				
				
				m_oBcw.m_oStream.WriteByte(type);
				
				m_oBcw.m_oStream.WriteLong(m_nLastFilePos);

				
				
				int nCurPos = m_oBcw.m_oStream.GetPosition();
				
				m_oBcw.m_oStream.Seek(m_nLastFilePos);
				return nCurPos;
			}
			void WriteTableEnd(int nCurPos)
			{
				
				m_nLastFilePos = m_oBcw.m_oStream.GetPosition();
				m_nRealTableCount++;
				
				m_oBcw.m_oStream.Seek(nCurPos);
			}
			void intoBindoc(CString& sDir) {
				Streams::CBufferedStream& oBufferedStream = m_oBcw.m_oStream;
				OOX::CDocx oDocx = OOX::CDocx(OOX::CPath(sDir));
				
				m_pTheme = oDocx.GetTheme();
				DocWrapper::FontProcessor& oFontProcessor = m_oFontProcessor;
				OOX::CFontTable* pFontTable = oDocx.GetFontTable();
				if(NULL != pFontTable)
					oFontProcessor.setFontTable(pFontTable);
				m_pSettings = oDocx.GetSettings();

				
				OOX::CDocument* poDocument = oDocx.GetDocument();
				OOX::Logic::CSectionProperty* pFirstSectPr = NULL;
				OOX::Logic::CParagraph* pStartSectionParagraph = NULL;
				for(int i = 0, length = poDocument->m_arrItems.GetSize(); i < length; ++i)
				{
					OOX::WritingElement* we = poDocument->m_arrItems[i];
					if(OOX::et_w_p == we->getType())
					{
						OOX::Logic::CParagraph* pParagraph = static_cast<OOX::Logic::CParagraph*>(we);
						if(NULL != pFirstSectPr && NULL == pStartSectionParagraph)
						{
							pStartSectionParagraph = pParagraph;
						}
						for(int j = 0, length2 = pParagraph->m_arrItems.GetSize(); j < length2; ++j)
						{
							OOX::WritingElement* we2 = pParagraph->m_arrItems[j];
							if(OOX::et_w_pPr == we2->getType())
							{
								OOX::Logic::CParagraphProperty* pParagraphProperty = static_cast<OOX::Logic::CParagraphProperty*>(we2);
								if(pParagraphProperty->m_oSectPr.IsInit())
								{
									if(NULL == pFirstSectPr)
										pFirstSectPr = pParagraphProperty->m_oSectPr.GetPointer();
									const OOX::Logic::CSectionProperty& oSectPr = pParagraphProperty->m_oSectPr.get();
									if(NULL != pStartSectionParagraph && !(oSectPr.m_oType.IsInit() && oSectPr.m_oType->m_oVal.IsInit() && SimpleTypes::sectionmarkContinious == oSectPr.m_oType->m_oVal->GetValue()))
										ParagraphAddBreak(pStartSectionParagraph);
									pStartSectionParagraph = NULL;
								}
							}
						}
					}
				}
				if(poDocument->m_oSectPr.IsInit())
				{
					if(NULL == pFirstSectPr)
						pFirstSectPr = poDocument->m_oSectPr.GetPointer();
					const OOX::Logic::CSectionProperty& oSectPr = poDocument->m_oSectPr.get2();
					if(NULL != pStartSectionParagraph && !(oSectPr.m_oType.IsInit() && oSectPr.m_oType->m_oVal.IsInit() && SimpleTypes::sectionmarkContinious == oSectPr.m_oType->m_oVal->GetValue()))
						ParagraphAddBreak(pStartSectionParagraph);
					pStartSectionParagraph = NULL;
				}
				OOX::CHdrFtr* pHdrFirst = NULL;
				OOX::CHdrFtr* pHdrEven = NULL;
				OOX::CHdrFtr* pHdrDefault = NULL;
				OOX::CHdrFtr* pFtrFirst = NULL;
				OOX::CHdrFtr* pFtrEven = NULL;
				OOX::CHdrFtr* pFtrDefault = NULL;
				if(NULL != pFirstSectPr)
				{
					for(int i = 0, length = pFirstSectPr->m_arrHeaderReference.GetSize(); i < length; ++i)
					{
						const ComplexTypes::Word::CHdrFtrRef& oHdrFtrRef = pFirstSectPr->m_arrHeaderReference[i];
						if(oHdrFtrRef.m_oType.IsInit() && oHdrFtrRef.m_oId.IsInit())
						{
							smart_ptr<OOX::File> pFile = poDocument->Find(OOX::RId(oHdrFtrRef.m_oId->GetValue()));
							if (pFile.IsInit() && OOX::FileTypes::Header == pFile->type())
							{
								OOX::CHdrFtr* pHdrFtr = (OOX::CHdrFtr*)pFile.operator->();
								switch(oHdrFtrRef.m_oType->GetValue())
								{
								case SimpleTypes::hdrftrDefault: pHdrDefault = pHdrFtr;break;
								case SimpleTypes::hdrftrEven: pHdrEven = pHdrFtr;break;
								case SimpleTypes::hdrftrFirst: pHdrFirst = pHdrFtr;break;
								}
							}
						}
					}
					for(int i = 0, length = pFirstSectPr->m_arrFooterReference.GetSize(); i < length; ++i)
					{
						const ComplexTypes::Word::CHdrFtrRef& oHdrFtrRef = pFirstSectPr->m_arrFooterReference[i];
						if(oHdrFtrRef.m_oType.IsInit() && oHdrFtrRef.m_oId.IsInit())
						{
							smart_ptr<OOX::File> pFile = poDocument->Find(OOX::RId(oHdrFtrRef.m_oId->GetValue()));
							if (pFile.IsInit() && OOX::FileTypes::Footer == pFile->type())
							{
								OOX::CHdrFtr* pHdrFtr = (OOX::CHdrFtr*)pFile.operator->();
								switch(oHdrFtrRef.m_oType->GetValue())
								{
								case SimpleTypes::hdrftrDefault: pFtrDefault = pHdrFtr;break;
								case SimpleTypes::hdrftrEven: pFtrEven = pHdrFtr;break;
								case SimpleTypes::hdrftrFirst: pFtrFirst = pHdrFtr;break;
								}
							}
						}
					}
				}
				this->WriteMainTableStart();

				int nCurPos = 0;

				LPSAFEARRAY pThemeData = NULL;
				if(NULL != m_pTheme)
				{
					BSTR bstrThemePath = m_pTheme->m_oReadPath.GetPath().AllocSysString();
					m_pOfficeDrawingConverter->GetThemeBinary(bstrThemePath, &pThemeData);
					SysFreeString(bstrThemePath);
				}

				
				OOX::CSettings* pSettings = oDocx.GetSettings();
				if(NULL != pSettings)
				{
					BinDocxRW::BinarySettingsTableWriter oBinarySettingsTableWriter(oBufferedStream, m_oEmbeddedFontsManager);
					int nCurPos = this->WriteTableStart(BinDocxRW::c_oSerTableTypes::Settings);
					oBinarySettingsTableWriter.Write(*pSettings);
					this->WriteTableEnd(nCurPos);
				}

				
				CAtlMap<int, bool> mapIgnoreComments;
				OOX::CComments* pComments = oDocx.GetComments();
				OOX::CCommentsExt* pCommentsExt = oDocx.GetCommentsExt();
				OOX::CPeople* pPeople = oDocx.GetPeople();
				if(NULL != pComments)
				{
					BinDocxRW::BinaryCommentsTableWriter oBinaryCommentsTableWriter(oBufferedStream, m_oEmbeddedFontsManager);
					int nCurPos = this->WriteTableStart(BinDocxRW::c_oSerTableTypes::Comments);
					oBinaryCommentsTableWriter.Write(*pComments, pCommentsExt, pPeople, mapIgnoreComments);
					this->WriteTableEnd(nCurPos);
				}

				
				OOX::CStyles* pStyles = oDocx.GetStyles();
				BinDocxRW::BinaryStyleTableWriter oBinaryStyleTableWriter(oBufferedStream, m_oEmbeddedFontsManager, m_pTheme, oFontProcessor);
				if(NULL != pStyles)
				{
					int nCurPos = this->WriteTableStart(BinDocxRW::c_oSerTableTypes::Style);
					oBinaryStyleTableWriter.Write(*pStyles);
					this->WriteTableEnd(nCurPos);
				}
				
				OOX::CNumbering* pNumbering = oDocx.GetNumbering();
				BinDocxRW::BinaryNumberingTableWriter oBinaryNumberingTableWriter(oBufferedStream, m_oEmbeddedFontsManager, m_pTheme, oFontProcessor);
				if(NULL != pNumbering)
				{
					nCurPos = this->WriteTableStart(BinDocxRW::c_oSerTableTypes::Numbering);
					oBinaryNumberingTableWriter.Write(*pNumbering);
					this->WriteTableEnd(nCurPos);
				}

				
				if(NULL != pHdrFirst || NULL != pHdrEven || NULL != pHdrDefault || NULL != pFtrFirst || NULL != pFtrEven || NULL != pFtrDefault)
				{
					CSimpleArray<OOX::WritingElement*>* aHdrFirst = NULL;
					if(NULL != pHdrFirst)
						aHdrFirst = &pHdrFirst->m_arrItems;
					CSimpleArray<OOX::WritingElement*>* aHdrEven = NULL;
					if(NULL != pHdrEven)
						aHdrEven = &pHdrEven->m_arrItems;
					CSimpleArray<OOX::WritingElement*>* aHdrOdd = NULL;
					if(NULL != pHdrDefault)
						aHdrOdd = &pHdrDefault->m_arrItems;
					CSimpleArray<OOX::WritingElement*>* aFtrFirst = NULL;
					if(NULL != pFtrFirst)
						aFtrFirst = &pFtrFirst->m_arrItems;
					CSimpleArray<OOX::WritingElement*>* aFtrEven = NULL;
					if(NULL != pFtrEven)
						aFtrEven = &pFtrEven->m_arrItems;
					CSimpleArray<OOX::WritingElement*>* aFtrOdd = NULL;
					if(NULL != pFtrDefault)
						aFtrOdd = &pFtrDefault->m_arrItems;
					nCurPos = this->WriteTableStart(BinDocxRW::c_oSerTableTypes::HdrFtr);
					BinDocxRW::BinaryHeaderFooterTableWriter oBinaryHeaderFooterTableWriter(oBufferedStream, &m_pCurRels,m_oEmbeddedFontsManager, m_pTheme, oFontProcessor,
						aHdrFirst, aHdrEven, aHdrOdd, aFtrFirst, aFtrEven, aFtrOdd,
						pHdrFirst, pHdrEven, pHdrDefault, pFtrFirst, pFtrEven, pFtrDefault,
						pFirstSectPr, m_pSettings, m_pOfficeDrawingConverter);
					oBinaryHeaderFooterTableWriter.pSectPr = pFirstSectPr;
					oBinaryHeaderFooterTableWriter.Write();
					this->WriteTableEnd(nCurPos);
				}

				
				m_pCurRels = poDocument;
				
				nCurPos = this->WriteTableStart(BinDocxRW::c_oSerTableTypes::Document);
				BinDocxRW::BinaryDocumentTableWriter oBinaryDocumentTableWriter(oBufferedStream, m_oEmbeddedFontsManager, m_pTheme, m_pSettings, oFontProcessor, poDocument, m_pOfficeDrawingConverter, &mapIgnoreComments);
				oBinaryDocumentTableWriter.prepareOfficeDrawingConverter(m_pOfficeDrawingConverter, poDocument->m_oReadPath.GetPath(), poDocument->m_arrShapeTypes);
				oBinaryDocumentTableWriter.pSectPr = pFirstSectPr;
				oBinaryDocumentTableWriter.m_bWriteSectPr = true;
				oBinaryDocumentTableWriter.Write(poDocument->m_arrItems);
				this->WriteTableEnd(nCurPos);

				this->WriteMainTableEnd(pThemeData);
			}
			void ParagraphAddBreak(OOX::Logic::CParagraph* pParagraph)
			{
				if(NULL != pParagraph)
				{
					OOX::Logic::CParagraphProperty* pPr = NULL;
					for(int i = 0, length = pParagraph->m_arrItems.GetSize(); i < length; ++i)
					{
						OOX::WritingElement* we = pParagraph->m_arrItems[i];
						if(OOX::et_w_pPr == we->getType())
						{
							pPr = static_cast<OOX::Logic::CParagraphProperty*>(we);
							break;
						}
					}
					if(NULL == pPr)
					{
						pPr = new OOX::Logic::CParagraphProperty();
						if(pParagraph->m_arrItems.GetSize() > 0)
							pParagraph->m_arrItems.SetAtIndex(0, pPr);
						else
							pParagraph->m_arrItems.Add(pPr);
					}
					pPr->m_oPageBreakBefore.Init();
					pPr->m_oPageBreakBefore->m_oVal.FromBool(true);
				}
			}
	};

}