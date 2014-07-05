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
#ifndef OOX_RPR_FILE_INCLUDE_H_
#define OOX_RPR_FILE_INCLUDE_H_

#include "../CommonInclude.h"



namespace OOX
{
	namespace Spreadsheet
	{
		class CRgbColor : public WritingElement
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CRgbColor)
			CRgbColor()
			{
			}
			virtual ~CRgbColor()
			{
			}

			virtual void    fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}
			virtual EElementType getType () const
			{
				return et_RgbColor;
			}
		private:
			virtual CString      toXML() const
			{
				return _T("");
			}
			virtual void toXML(CStringWriter& writer) const
			{
			}
			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )

					WritingElement_ReadAttributes_Read_if     ( oReader, _T("rgb"),      m_oRgb )

					WritingElement_ReadAttributes_End( oReader )
			}
		public:
			nullable<SimpleTypes::Spreadsheet::CHexColor>						m_oRgb;
		};
		class CIndexedColors : public WritingElementWithChilds<CRgbColor>
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CIndexedColors)
			CIndexedColors()
			{
			}
			virtual ~CIndexedColors()
			{
			}

		public:
			virtual CString      toXML() const
			{
				return _T("");
			}
			virtual void toXML(CStringWriter& writer) const
			{
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( oReader.IsEmptyNode() )
					return;

				int nCurDepth = oReader.GetDepth();
				while( oReader.ReadNextSiblingNode( nCurDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();

					if ( _T("rgbColor") == sName )
						m_arrItems.Add( new CRgbColor( oReader ));
				}
			}

			virtual EElementType getType () const
			{
				return et_IndexedColors;
			}
			static bool GetDefaultRGBAByIndex(int index, unsigned char& unR, unsigned char& unG, unsigned char& unB, unsigned char& unA)
			{
				unA = 255;
				switch(index)
				{
				case 0 : unR = 0x00; unG = 0x00; unB = 0x00; break;
				case 1 : unR = 0xFF; unG = 0xFF; unB = 0xFF; break;
				case 2 : unR = 0xFF; unG = 0x00; unB = 0x00; break;
				case 3 : unR = 0x00; unG = 0xFF; unB = 0x00; break;
				case 4 : unR = 0x00; unG = 0x00; unB = 0xFF; break;

				case 5 : unR = 0xFF; unG = 0xFF; unB = 0x00; break;
				case 6 : unR = 0xFF; unG = 0x00; unB = 0xFF; break;
				case 7 : unR = 0x00; unG = 0xFF; unB = 0xFF; break;
				case 8 : unR = 0x00; unG = 0x00; unB = 0x00; break;
				case 9 : unR = 0xFF; unG = 0xFF; unB = 0xFF; break;

				case 10: unR = 0xFF; unG = 0x00; unB = 0x00; break;
				case 11: unR = 0x00; unG = 0xFF; unB = 0x00; break;
				case 12: unR = 0x00; unG = 0x00; unB = 0xFF; break;
				case 13: unR = 0xFF; unG = 0xFF; unB = 0x00; break;
				case 14: unR = 0xFF; unG = 0x00; unB = 0xFF; break;

				case 15: unR = 0x00; unG = 0xFF; unB = 0xFF; break;
				case 16: unR = 0x80; unG = 0x00; unB = 0x00; break;
				case 17: unR = 0x00; unG = 0x80; unB = 0x00; break;
				case 18: unR = 0x00; unG = 0x00; unB = 0x80; break;
				case 19: unR = 0x80; unG = 0x80; unB = 0x00; break;

				case 20: unR = 0x80; unG = 0x00; unB = 0x80; break;
				case 21: unR = 0x00; unG = 0x80; unB = 0x80; break;
				case 22: unR = 0xC0; unG = 0xC0; unB = 0xC0; break;
				case 23: unR = 0x80; unG = 0x80; unB = 0x80; break;
				case 24: unR = 0x99; unG = 0x99; unB = 0xFF; break;

				case 25: unR = 0x99; unG = 0x33; unB = 0x66; break;
				case 26: unR = 0xFF; unG = 0xFF; unB = 0xCC; break;
				case 27: unR = 0xCC; unG = 0xFF; unB = 0xFF; break;
				case 28: unR = 0x66; unG = 0x00; unB = 0x66; break;
				case 29: unR = 0xFF; unG = 0x80; unB = 0x80; break;

				case 30: unR = 0x00; unG = 0x66; unB = 0xCC; break;
				case 31: unR = 0xCC; unG = 0xCC; unB = 0xFF; break;
				case 32: unR = 0x00; unG = 0x00; unB = 0x80; break;
				case 33: unR = 0xFF; unG = 0x00; unB = 0xFF; break;
				case 34: unR = 0xFF; unG = 0xFF; unB = 0x00; break;

				case 35: unR = 0x00; unG = 0xFF; unB = 0xFF; break;
				case 36: unR = 0x80; unG = 0x00; unB = 0x80; break;
				case 37: unR = 0x80; unG = 0x00; unB = 0x00; break;
				case 38: unR = 0x00; unG = 0x80; unB = 0x80; break;
				case 39: unR = 0x00; unG = 0x00; unB = 0xFF; break;

				case 40: unR = 0x00; unG = 0xCC; unB = 0xFF; break;
				case 41: unR = 0xCC; unG = 0xFF; unB = 0xFF; break;
				case 42: unR = 0xCC; unG = 0xFF; unB = 0xCC; break;
				case 43: unR = 0xFF; unG = 0xFF; unB = 0x99; break;
				case 44: unR = 0x99; unG = 0xCC; unB = 0xFF; break;

				case 45: unR = 0xFF; unG = 0x99; unB = 0xCC; break;
				case 46: unR = 0xCC; unG = 0x99; unB = 0xFF; break;
				case 47: unR = 0xFF; unG = 0xCC; unB = 0x99; break;
				case 48: unR = 0x33; unG = 0x66; unB = 0xFF; break;
				case 49: unR = 0x33; unG = 0xCC; unB = 0xCC; break;

				case 50: unR = 0x99; unG = 0xCC; unB = 0x00; break;
				case 51: unR = 0xFF; unG = 0xCC; unB = 0x00; break;
				case 52: unR = 0xFF; unG = 0x99; unB = 0x00; break;
				case 53: unR = 0xFF; unG = 0x66; unB = 0x00; break;
				case 54: unR = 0x66; unG = 0x66; unB = 0x99; break;

				case 55: unR = 0x96; unG = 0x96; unB = 0x96; break;
				case 56: unR = 0x00; unG = 0x33; unB = 0x66; break;
				case 57: unR = 0x33; unG = 0x99; unB = 0x66; break;
				case 58: unR = 0x00; unG = 0x33; unB = 0x00; break;
				case 59: unR = 0x33; unG = 0x33; unB = 0x00; break;

				case 60: unR = 0x99; unG = 0x33; unB = 0x00; break;
				case 61: unR = 0x99; unG = 0x33; unB = 0x66; break;
				case 62: unR = 0x33; unG = 0x33; unB = 0x99; break;
				case 63: unR = 0x33; unG = 0x33; unB = 0x33; break;
				case 64: unR = 0x00; unG = 0x00; unB = 0x00; break;

				case 65: unR = 0xFF; unG = 0xFF; unB = 0xFF; break;
				default: return false;
				}
				return true;
			}
			static int GetDefaultIndexByRGBA( unsigned char unR, unsigned char unG, unsigned char unB, unsigned char unA)
			{
				if(255 != unA)
					return -1;
				int nIndex = -1;
				if(unR == 0x00 && unG == 0x00 && unB == 0x00)
					nIndex = 64;
				else if(unR == 0xFF && unG == 0xFF && unB == 0xFF)
					nIndex = 65;
				else if(unR == 0x00 && unG == 0x00 && unB == 0x00)
					nIndex = 0;
				else if(unR == 0xFF && unG == 0xFF && unB == 0xFF)
					nIndex = 1;
				else if(unR == 0xFF && unG == 0x00 && unB == 0x00)
					nIndex = 2;
				else if(unR == 0x00 && unG == 0xFF && unB == 0x00)
					nIndex = 3;
				else if(unR == 0x00 && unG == 0x00 && unB == 0xFF)
					nIndex = 4;
				else if(unR == 0xFF && unG == 0xFF && unB == 0x00)
					nIndex = 5;
				else if(unR == 0xFF && unG == 0x00 && unB == 0xFF)
					nIndex = 6;
				else if(unR == 0x00 && unG == 0xFF && unB == 0xFF)
					nIndex = 7;
				else if(unR == 0x00 && unG == 0x00 && unB == 0x00)
					nIndex = 8;
				else if(unR == 0xFF && unG == 0xFF && unB == 0xFF)
					nIndex = 9;
				else if(unR == 0xFF && unG == 0x00 && unB == 0x00)
					nIndex = 10;
				else if(unR == 0x00 && unG == 0xFF && unB == 0x00)
					nIndex = 11;
				else if(unR == 0x00 && unG == 0x00 && unB == 0xFF)
					nIndex = 12;
				else if(unR == 0xFF && unG == 0xFF && unB == 0x00)
					nIndex = 13;
				else if(unR == 0xFF && unG == 0x00 && unB == 0xFF)
					nIndex = 14;
				else if(unR == 0x00 && unG == 0xFF && unB == 0xFF)
					nIndex = 15;
				else if(unR == 0x80 && unG == 0x00 && unB == 0x00)
					nIndex = 16;
				else if(unR == 0x00 && unG == 0x80 && unB == 0x00)
					nIndex = 17;
				else if(unR == 0x00 && unG == 0x00 && unB == 0x80)
					nIndex = 18;
				else if(unR == 0x80 && unG == 0x80 && unB == 0x00)
					nIndex = 19;
				else if(unR == 0x80 && unG == 0x00 && unB == 0x80)
					nIndex = 20;
				else if(unR == 0x00 && unG == 0x80 && unB == 0x80)
					nIndex = 21;
				else if(unR == 0xC0 && unG == 0xC0 && unB == 0xC0)
					nIndex = 22;
				else if(unR == 0x80 && unG == 0x80 && unB == 0x80)
					nIndex = 23;
				else if(unR == 0x99 && unG == 0x99 && unB == 0xFF)
					nIndex = 24;
				else if(unR == 0x99 && unG == 0x33 && unB == 0x66)
					nIndex = 25;
				else if(unR == 0xFF && unG == 0xFF && unB == 0xCC)
					nIndex = 26;
				else if(unR == 0xCC && unG == 0xFF && unB == 0xFF)
					nIndex = 27;
				else if(unR == 0x66 && unG == 0x00 && unB == 0x66)
					nIndex = 28;
				else if(unR == 0xFF && unG == 0x80 && unB == 0x80)
					nIndex = 29;
				else if(unR == 0x00 && unG == 0x66 && unB == 0xCC)
					nIndex = 30;
				else if(unR == 0xCC && unG == 0xCC && unB == 0xFF)
					nIndex = 31;
				else if(unR == 0x00 && unG == 0x00 && unB == 0x80)
					nIndex = 32;
				else if(unR == 0xFF && unG == 0x00 && unB == 0xFF)
					nIndex = 33;
				else if(unR == 0xFF && unG == 0xFF && unB == 0x00)
					nIndex = 34;
				else if(unR == 0x00 && unG == 0xFF && unB == 0xFF)
					nIndex = 35;
				else if(unR == 0x80 && unG == 0x00 && unB == 0x80)
					nIndex = 36;
				else if(unR == 0x80 && unG == 0x00 && unB == 0x00)
					nIndex = 37;
				else if(unR == 0x00 && unG == 0x80 && unB == 0x80)
					nIndex = 38;
				else if(unR == 0x00 && unG == 0x00 && unB == 0xFF)
					nIndex = 39;
				else if(unR == 0x00 && unG == 0xCC && unB == 0xFF)
					nIndex = 40;
				else if(unR == 0xCC && unG == 0xFF && unB == 0xFF)
					nIndex = 41;
				else if(unR == 0xCC && unG == 0xFF && unB == 0xCC)
					nIndex = 42;
				else if(unR == 0xFF && unG == 0xFF && unB == 0x99)
					nIndex = 43;
				else if(unR == 0x99 && unG == 0xCC && unB == 0xFF)
					nIndex = 44;
				else if(unR == 0xFF && unG == 0x99 && unB == 0xCC)
					nIndex = 45;
				else if(unR == 0xCC && unG == 0x99 && unB == 0xFF)
					nIndex = 46;
				else if(unR == 0xFF && unG == 0xCC && unB == 0x99)
					nIndex = 47;
				else if(unR == 0x33 && unG == 0x66 && unB == 0xFF)
					nIndex = 48;
				else if(unR == 0x33 && unG == 0xCC && unB == 0xCC)
					nIndex = 49;
				else if(unR == 0x99 && unG == 0xCC && unB == 0x00)
					nIndex = 50;
				else if(unR == 0xFF && unG == 0xCC && unB == 0x00)
					nIndex = 51;
				else if(unR == 0xFF && unG == 0x99 && unB == 0x00)
					nIndex = 52;
				else if(unR == 0xFF && unG == 0x66 && unB == 0x00)
					nIndex = 53;
				else if(unR == 0x66 && unG == 0x66 && unB == 0x99)
					nIndex = 54;
				else if(unR == 0x96 && unG == 0x96 && unB == 0x96)
					nIndex = 55;
				else if(unR == 0x00 && unG == 0x33 && unB == 0x66)
					nIndex = 56;
				else if(unR == 0x33 && unG == 0x99 && unB == 0x66)
					nIndex = 57;
				else if(unR == 0x00 && unG == 0x33 && unB == 0x00)
					nIndex = 58;
				else if(unR == 0x33 && unG == 0x33 && unB == 0x00)
					nIndex = 59;
				else if(unR == 0x99 && unG == 0x33 && unB == 0x00)
					nIndex = 60;
				else if(unR == 0x99 && unG == 0x33 && unB == 0x66)
					nIndex = 61;
				else if(unR == 0x33 && unG == 0x33 && unB == 0x99)
					nIndex = 62;
				else if(unR == 0x33 && unG == 0x33 && unB == 0x33)
					nIndex = 63;
				return nIndex;
			}
		private:
			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
			}
		};
		class CColor : public WritingElement
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CColor)
			CColor()
			{
			}
			virtual ~CColor()
			{
			}
		public:
			virtual CString      toXML() const
			{
				return _T("");
			}
			virtual void toXML(CStringWriter& writer) const
			{
				
				toXML2(writer, _T("color"));
			}
			void toXML2(CStringWriter& writer, CString sName) const
			{
				writer.WriteStringC(_T("<"));
				writer.WriteStringC(sName);
				if(m_oAuto.IsInit())
				{
					CString sVal;sVal.Format(_T(" auto=\"%s\""), m_oAuto->ToString2(SimpleTypes::onofftostring1));
					writer.WriteStringC(sVal);
				}
				if(m_oIndexed.IsInit())
				{
					CString sVal;sVal.Format(_T(" indexed=\"%d\""), m_oIndexed->GetValue());
					writer.WriteStringC(sVal);
				}
				if(m_oRgb.IsInit())
				{
					int nIndex = OOX::Spreadsheet::CIndexedColors::GetDefaultIndexByRGBA(m_oRgb->Get_R(), m_oRgb->Get_G(), m_oRgb->Get_B(), m_oRgb->Get_A());
					if(-1 == nIndex)
					{
						CString sVal;sVal.Format(_T(" rgb=\"%s\""), m_oRgb->ToString());
						writer.WriteStringC(sVal);
					}
					else
					{
						CString sVal;sVal.Format(_T(" indexed=\"%d\""), nIndex);
						writer.WriteStringC(sVal);
					}
				}
				if(m_oThemeColor.IsInit())
				{
					CString sVal;sVal.Format(_T(" theme=\"%d\""), m_oThemeColor->GetValue());
					writer.WriteStringC(sVal);
				}
				if(m_oTint.IsInit())
				{
					CString sVal;sVal.Format(_T(" tint=\"%s\""), SpreadsheetCommon::WriteDouble(m_oTint->GetValue()));
					writer.WriteStringC(sVal);
				}

				writer.WriteStringC(_T("/>"));
			}
			virtual void    fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}
			virtual EElementType getType () const
			{
				return et_Color;
			}
		private:
			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )

					WritingElement_ReadAttributes_Read_if     ( oReader, _T("auto"),      m_oAuto )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("indexed"),      m_oIndexed )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("rgb"),      m_oRgb )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("theme"),      m_oThemeColor )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("tint"),      m_oTint )

					WritingElement_ReadAttributes_End( oReader )
			}
		public:
			nullable<SimpleTypes::COnOff<>>						m_oAuto;
			nullable<SimpleTypes::CUnsignedDecimalNumber<>>		m_oIndexed;
			nullable<SimpleTypes::Spreadsheet::CHexColor>		m_oRgb;
			nullable<SimpleTypes::Spreadsheet::CThemeColor<>>	m_oThemeColor;
			nullable<SimpleTypes::CDouble>						m_oTint;
		};

		class CMruColors : public WritingElementWithChilds<CColor>
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CMruColors)
			CMruColors()
			{
			}
			virtual ~CMruColors()
			{
			}

		public:
			virtual CString      toXML() const
			{
				return _T("");
			}
			virtual void toXML(CStringWriter& writer) const
			{
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( oReader.IsEmptyNode() )
					return;

				int nCurDepth = oReader.GetDepth();
				while( oReader.ReadNextSiblingNode( nCurDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();

					if ( _T("color") == sName )
						m_arrItems.Add( new CColor( oReader ));
				}
			}

			virtual EElementType getType () const
			{
				return et_MruColors;
			}

		private:
			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
			}
		};
		class CCharset
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CCharset)
			CCharset()
			{
			}
			virtual ~CCharset()
			{
			}

			virtual void    fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}
		private:
			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )

					WritingElement_ReadAttributes_Read_if     ( oReader, _T("val"),      m_oCharset )

					WritingElement_ReadAttributes_End( oReader )
			}
		public:
			nullable<SimpleTypes::Spreadsheet::CFontCharset<>>	m_oCharset;
		};
		class CVerticalAlign
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CVerticalAlign)
			CVerticalAlign()
			{
			}
			virtual ~CVerticalAlign()
			{
			}

			virtual void    fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}
		private:
			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )

					WritingElement_ReadAttributes_Read_if     ( oReader, _T("val"),      m_oVerticalAlign )

					WritingElement_ReadAttributes_End( oReader )
			}
		public:
			nullable<SimpleTypes::CVerticalAlignRun<>>	m_oVerticalAlign;
		};
		class CFontFamily
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CFontFamily)
			CFontFamily()
			{
			}
			virtual ~CFontFamily()
			{
			}

			virtual void    fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}
		private:
			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )

					WritingElement_ReadAttributes_Read_if     ( oReader, _T("val"),      m_oFontFamily )

					WritingElement_ReadAttributes_End( oReader )
			}
		public:
			nullable<SimpleTypes::CFontFamily<>>	m_oFontFamily;
		};
		class CFontScheme
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CFontScheme)
			CFontScheme()
			{
			}
			virtual ~CFontScheme()
			{
			}

			virtual void    fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}
		private:
			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )

					WritingElement_ReadAttributes_Read_if     ( oReader, _T("val"),      m_oFontScheme )

					WritingElement_ReadAttributes_End( oReader )
			}
		public:
			nullable<SimpleTypes::Spreadsheet::CFontScheme<>>	m_oFontScheme;
		};
		class CUnderline
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CUnderline)
			CUnderline()
			{
			}
			virtual ~CUnderline()
			{
			}

			virtual void    fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}
		private:
			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )

					WritingElement_ReadAttributes_Read_if     ( oReader, _T("val"),      m_oUnderline )

					WritingElement_ReadAttributes_End( oReader )
			}
		public:
			nullable<SimpleTypes::Spreadsheet::CUnderline<>>	m_oUnderline;
		};
		
		class CRPr : public WritingElement
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CRPr)
			CRPr()
			{
			}
			virtual ~CRPr()
			{
			}

		public:
			virtual CString      toXML() const
			{
				return _T("");
			}
			virtual void toXML(CStringWriter& writer) const
			{
				writer.WriteStringC(_T("<rPr>"));
				if(m_oBold.IsInit())
				{
					if(SimpleTypes::onoffTrue == m_oBold->m_oVal.GetValue())
						writer.WriteStringC(_T("<b/>"));
					else
						writer.WriteStringC(_T("<b val=\"false\"/>"));
				}
				if(m_oCharset.IsInit() && m_oCharset->m_oCharset.IsInit())
				{
					CString sVal;sVal.Format(_T("<charset val=\"%s\"/>"), m_oCharset->m_oCharset->ToString());
					writer.WriteStringC(sVal);
				}
				if(m_oColor.IsInit())
					m_oColor->toXML2(writer, _T("color"));
				if(m_oCondense.IsInit())
				{
					if(SimpleTypes::onoffTrue == m_oCondense->m_oVal.GetValue())
						writer.WriteStringC(_T("<condense/>"));
					else
						writer.WriteStringC(_T("<condense val=\"false\"/>"));
				}
				if(m_oExtend.IsInit())
				{
					if(SimpleTypes::onoffTrue == m_oExtend->m_oVal.GetValue())
						writer.WriteStringC(_T("<extend/>"));
					else
						writer.WriteStringC(_T("<extend val=\"false\"/>"));
				}
				if(m_oFamily.IsInit() && m_oFamily->m_oFontFamily.IsInit())
				{
					CString sVal;sVal.Format(_T("<family val=\"%s\"/>"), m_oFamily->m_oFontFamily->ToString());
					writer.WriteStringC(sVal);
				}
				if(m_oItalic.IsInit())
				{
					if(SimpleTypes::onoffTrue == m_oItalic->m_oVal.GetValue())
						writer.WriteStringC(_T("<i/>"));
					else
						writer.WriteStringC(_T("<i val=\"false\"/>"));
				}
				if(m_oOutline.IsInit())
				{
					if(SimpleTypes::onoffTrue == m_oOutline->m_oVal.GetValue())
						writer.WriteStringC(_T("<outline/>"));
					else
						writer.WriteStringC(_T("<outline val=\"false\"/>"));
				}
				if(m_oRFont.IsInit() && m_oRFont->m_sVal.IsInit())
				{
					CString sVal;sVal.Format(_T("<rFont val=\"%s\"/>"), XmlUtils::EncodeXmlString(m_oRFont->m_sVal.get()));
					writer.WriteStringC(sVal);
				}
				if(m_oScheme.IsInit() && m_oScheme->m_oFontScheme.IsInit())
				{
					CString sVal;sVal.Format(_T("<scheme val=\"%s\"/>"), m_oScheme->m_oFontScheme->ToString());
					writer.WriteStringC(sVal);
				}
				if(m_oShadow.IsInit())
				{
					if(SimpleTypes::onoffTrue == m_oShadow->m_oVal.GetValue())
						writer.WriteStringC(_T("<shadow/>"));
					else
						writer.WriteStringC(_T("<shadow val=\"false\"/>"));
				}
				if(m_oStrike.IsInit())
				{
					if(SimpleTypes::onoffTrue == m_oStrike->m_oVal.GetValue())
						writer.WriteStringC(_T("<strike/>"));
					else
						writer.WriteStringC(_T("<strike val=\"false\"/>"));
				}
				if(m_oSz.IsInit() && m_oSz->m_oVal.IsInit())
				{
					CString sVal;sVal.Format(_T("<sz val=\"%s\"/>"), SpreadsheetCommon::WriteDouble(m_oSz->m_oVal->GetValue()));
					writer.WriteStringC(sVal);
				}
				if(m_oUnderline.IsInit() && m_oUnderline->m_oUnderline.IsInit())
				{
					CString sVal;
					if( SimpleTypes::underlineSingle != m_oUnderline->m_oUnderline->GetValue())
						sVal.Format(_T("<u val=\"%s\"/>"), m_oUnderline->m_oUnderline->ToString());
					else
						sVal.Format(_T("<u/>"), m_oUnderline->m_oUnderline->ToString());
					writer.WriteStringC(sVal);
				}
				if(m_oVertAlign.IsInit() && m_oVertAlign->m_oVerticalAlign.IsInit())
				{
					CString sVal;sVal.Format(_T("<vertAlign val=\"%s\"/>"), m_oVertAlign->m_oVerticalAlign->ToString());
					writer.WriteStringC(sVal);
				}
				writer.WriteStringC(_T("</rPr>"));
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( oReader.IsEmptyNode() )
					return;

				int nCurDepth = oReader.GetDepth();
				while( oReader.ReadNextSiblingNode( nCurDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();

					if ( _T("b") == sName )
						m_oBold = oReader;
					else if ( _T("charset") == sName )
						m_oCharset = oReader;
					else if ( _T("color") == sName )
						m_oColor = oReader;
					else if ( _T("condense") == sName )
						m_oCondense = oReader;
					else if ( _T("extend") == sName )
						m_oExtend = oReader;
					else if ( _T("family") == sName )
						m_oFamily = oReader;
					else if ( _T("i") == sName )
						m_oItalic = oReader;
					else if ( _T("outline") == sName )
						m_oOutline = oReader;
					else if ( _T("rFont") == sName || _T("name") == sName)
						m_oRFont = oReader;
					else if ( _T("scheme") == sName )
						m_oScheme = oReader;
					else if ( _T("shadow") == sName )
						m_oShadow = oReader;
					else if ( _T("strike") == sName )
						m_oStrike = oReader;
					else if ( _T("sz") == sName )
						m_oSz = oReader;
					else if ( _T("u") == sName )
						m_oUnderline = oReader;
					else if ( _T("vertAlign") == sName )
						m_oVertAlign = oReader;

				}
			}

			virtual EElementType getType () const
			{
				return et_rPr;
			}

		private:
			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
			}
		public:
			nullable<ComplexTypes::Spreadsheet::COnOff2<SimpleTypes::onoffTrue> >	m_oBold;
			nullable<CCharset>												m_oCharset;
			nullable<CColor>												m_oColor;
			nullable<ComplexTypes::Spreadsheet::COnOff2<SimpleTypes::onoffTrue> >	m_oCondense;
			nullable<ComplexTypes::Spreadsheet::COnOff2<SimpleTypes::onoffTrue> >	m_oExtend;
			nullable<CFontFamily >											m_oFamily;
			nullable<ComplexTypes::Spreadsheet::COnOff2<SimpleTypes::onoffTrue> >	m_oItalic;
			nullable<ComplexTypes::Spreadsheet::COnOff2<SimpleTypes::onoffTrue> >	m_oOutline;
			nullable<ComplexTypes::Spreadsheet::CString_>							m_oRFont;
			nullable<CFontScheme>											m_oScheme;
			nullable<ComplexTypes::Spreadsheet::COnOff2<SimpleTypes::onoffTrue> >	m_oShadow;
			nullable<ComplexTypes::Spreadsheet::COnOff2<SimpleTypes::onoffTrue> >	m_oStrike;
			nullable<ComplexTypes::Spreadsheet::CDouble>							m_oSz;
			nullable<CUnderline>											m_oUnderline;
			nullable<CVerticalAlign>										m_oVertAlign;
		};
	} 
} 

#endif // OOX_RPR_FILE_INCLUDE_H_