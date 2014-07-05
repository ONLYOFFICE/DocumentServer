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
#ifndef OOX_FONTS_FILE_INCLUDE_H_
#define OOX_FONTS_FILE_INCLUDE_H_

#include "../CommonInclude.h"

#include "rPr.h"

namespace OOX
{
	namespace Spreadsheet
	{
		class CFont : public WritingElement
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CFont)
			CFont()
			{
			}
			virtual ~CFont()
			{
			}

		public:
			virtual CString      toXML() const
			{
				return _T("");
			}
			virtual void toXML(CStringWriter& writer) const
			{
				writer.WriteStringC(_T("<font>"));
				if(m_oBold.IsInit())
				{
					if(SimpleTypes::onoffTrue == m_oBold->m_oVal.GetValue())
						writer.WriteStringC(_T("<b/>"));
					else
						writer.WriteStringC(_T("<b val=\"0\"/>"));
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
						writer.WriteStringC(_T("<condense val=\"0\"/>"));
				}
				if(m_oExtend.IsInit())
				{
					if(SimpleTypes::onoffTrue == m_oExtend->m_oVal.GetValue())
						writer.WriteStringC(_T("<extend/>"));
					else
						writer.WriteStringC(_T("<extend val=\"0\"/>"));
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
						writer.WriteStringC(_T("<i val=\"0\"/>"));
				}
				if(m_oOutline.IsInit())
				{
					if(SimpleTypes::onoffTrue == m_oOutline->m_oVal.GetValue())
						writer.WriteStringC(_T("<outline/>"));
					else
						writer.WriteStringC(_T("<outline val=\"0\"/>"));
				}
				if(m_oRFont.IsInit() && m_oRFont->m_sVal.IsInit())
				{
					CString sVal;sVal.Format(_T("<name val=\"%s\"/>"), XmlUtils::EncodeXmlString(m_oRFont->m_sVal.get()));
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
						writer.WriteStringC(_T("<shadow val=\"0\"/>"));
				}
				if(m_oStrike.IsInit())
				{
					if(SimpleTypes::onoffTrue == m_oStrike->m_oVal.GetValue())
						writer.WriteStringC(_T("<strike/>"));
					else
						writer.WriteStringC(_T("<strike val=\"0\"/>"));
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
				writer.WriteStringC(_T("</font>"));
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
					else if ( _T("name") == sName )
						m_oRFont = oReader;
					else if ( _T("outline") == sName )
						m_oOutline = oReader;
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
				return et_Font;
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
		class CFonts : public WritingElementWithChilds<CFont>
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CFonts)
			CFonts()
			{
			}
			virtual ~CFonts()
			{
			}

		public:
			virtual CString      toXML() const
			{
				return _T("");
			}
			virtual void toXML(CStringWriter& writer) const
			{
				writer.WriteStringC(_T("<fonts"));
				if(m_oCount.IsInit())
				{
					CString sVal;sVal.Format(_T(" count=\"%d\""), m_oCount->GetValue());
					writer.WriteStringC(sVal);
				}
				writer.WriteStringC(_T(">"));
				for(int i = 0, length = m_arrItems.GetSize(); i < length; ++i)
					m_arrItems[i]->toXML(writer);
				writer.WriteStringC(_T("</fonts>"));
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

					if ( _T("font") == sName )
						m_arrItems.Add( new CFont( oReader ));
				}
			}

			virtual EElementType getType () const
			{
				return et_Fonts;
			}
			void AddFont (CFont* pFont)
			{
				m_arrItems.Add(pFont);
				if(false == m_oCount.IsInit())
					m_oCount.Init();
				m_oCount->SetValue(m_arrItems.GetSize());
			}
		private:
			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )

					WritingElement_ReadAttributes_Read_if     ( oReader, _T("count"),      m_oCount )

					WritingElement_ReadAttributes_End( oReader )
			}
		public:
			nullable<SimpleTypes::CUnsignedDecimalNumber<>>		m_oCount;
		};
	} 
} 

#endif // OOX_FONTS_FILE_INCLUDE_H_