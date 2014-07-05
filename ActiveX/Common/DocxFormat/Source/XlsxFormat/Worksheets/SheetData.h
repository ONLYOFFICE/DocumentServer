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
#ifndef OOX_SHEETDATA_FILE_INCLUDE_H_
#define OOX_SHEETDATA_FILE_INCLUDE_H_

#include "../CommonInclude.h"

#include "../SharedStrings/Si.h"

namespace OOX
{
	namespace Spreadsheet
	{
		class CFormula : public WritingElement
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CFormula)
			CFormula()
			{
			}
			virtual ~CFormula()
			{
			}

		public:
			virtual CString      toXML() const
			{
				return _T("");
			}
			virtual void toXML(CStringWriter& writer) const
			{
				writer.WriteStringC(_T("<f"));
				if(m_oAca.IsInit())
				{
					CString sVal; sVal.Format(_T(" aca=\"%s\""), m_oAca->ToString2(SimpleTypes::onofftostring1));
					writer.WriteStringC(sVal);
				}
				if(m_oBx.IsInit())
				{
					CString sVal; sVal.Format(_T(" bx=\"%s\""), m_oBx->ToString2(SimpleTypes::onofftostring1));
					writer.WriteStringC(sVal);
				}
				if(m_oCa.IsInit())
				{
					CString sVal; sVal.Format(_T(" ca=\"%s\""), m_oCa->ToString2(SimpleTypes::onofftostring1));
					writer.WriteStringC(sVal);
				}
				if(m_oDel1.IsInit())
				{
					CString sVal; sVal.Format(_T(" del1=\"%s\""), m_oDel1->ToString2(SimpleTypes::onofftostring1));
					writer.WriteStringC(sVal);
				}
				if(m_oDel2.IsInit())
				{
					CString sVal; sVal.Format(_T(" del2=\"%s\""), m_oDel2->ToString2(SimpleTypes::onofftostring1));
					writer.WriteStringC(sVal);
				}
				if(m_oDt2D.IsInit())
				{
					CString sVal; sVal.Format(_T(" dt2D=\"%s\""), m_oDt2D->ToString2(SimpleTypes::onofftostring1));
					writer.WriteStringC(sVal);
				}
				if(m_oDtr.IsInit())
				{
					CString sVal; sVal.Format(_T(" dtr=\"%s\""), m_oDtr->ToString2(SimpleTypes::onofftostring1));
					writer.WriteStringC(sVal);
				}
				if(m_oR1.IsInit())
				{
					CString sVal; sVal.Format(_T(" r1=\"%s\""), m_oR1.get());
					writer.WriteStringC(sVal);
				}
				if(m_oR2.IsInit())
				{
					CString sVal; sVal.Format(_T(" r2=\"%s\""), m_oR2.get());
					writer.WriteStringC(sVal);
				}
				if(m_oRef.IsInit())
				{
					CString sVal; sVal.Format(_T(" ref=\"%s\""), m_oRef.get());
					writer.WriteStringC(sVal);
				}
				if(m_oSi.IsInit())
				{
					CString sVal; sVal.Format(_T(" si=\"%d\""), m_oSi->GetValue());
					writer.WriteStringC(sVal);
				}
				if(m_oT.IsInit())
				{
					CString sVal; sVal.Format(_T(" t=\"%s\""), m_oT->ToString());
					writer.WriteStringC(sVal);
				}
				writer.WriteStringC(_T(">"));
				writer.WriteStringC(XmlUtils::EncodeXmlString(m_sText));
				writer.WriteStringC(_T("</f>"));
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( oReader.IsEmptyNode() )
					return;

				m_sText = oReader.GetText2();
			}

			virtual EElementType getType () const
			{
				return et_Formula;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )

					WritingElement_ReadAttributes_Read_if     ( oReader, _T("aca"),      m_oAca )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("bx"),      m_oBx )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("ca"),      m_oCa )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("del1"),      m_oDel1 )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("del2"),      m_oDel2 )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("dt2D"),      m_oDt2D )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("dtr"),      m_oDtr )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("r1"),      m_oR1 )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("r2"),      m_oR2 )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("ref"),      m_oRef )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("si"),      m_oSi )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("t"),      m_oT )

					WritingElement_ReadAttributes_End( oReader )
			}

		public:
				nullable<SimpleTypes::COnOff<>>							m_oAca;
				nullable<SimpleTypes::COnOff<>>							m_oBx;
				nullable<SimpleTypes::COnOff<>>							m_oCa;
				nullable<SimpleTypes::COnOff<>>							m_oDel1;
				nullable<SimpleTypes::COnOff<>>							m_oDel2;
				nullable<SimpleTypes::COnOff<>>							m_oDt2D;
				nullable<SimpleTypes::COnOff<>>							m_oDtr;
				nullable<CString>										m_oR1;
				nullable<CString>										m_oR2;
				nullable<CString>										m_oRef;
				nullable<SimpleTypes::CUnsignedDecimalNumber<>>			m_oSi;
				nullable<SimpleTypes::Spreadsheet::CCellFormulaType<>>	m_oT;

				CString m_sText;
		};

		class CCell : public WritingElement
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CCell)
			CCell()
			{
			}
			virtual ~CCell()
			{
			}

		public:
			virtual CString      toXML() const
			{
				return _T("");
			}
			virtual void toXML(CStringWriter& writer) const
			{
				writer.WriteStringC(_T("<c"));
				if(m_oCellMetadata.IsInit())
				{
					CString sVal; sVal.Format(_T(" cm=\"%d\""), m_oCellMetadata->GetValue());
					writer.WriteStringC(sVal);
				}
				if(m_oShowPhonetic.IsInit())
				{
					CString sVal; sVal.Format(_T(" ph=\"%s\""), m_oShowPhonetic->ToString2(SimpleTypes::onofftostring1));
					writer.WriteStringC(sVal);
				}
				if(m_oRef.IsInit())
				{
					CString sVal; sVal.Format(_T(" r=\"%s\""), m_oRef.get());
					writer.WriteStringC(sVal);
				}
				if(m_oStyle.IsInit())
				{
					CString sVal; sVal.Format(_T(" s=\"%d\""), m_oStyle->GetValue());
					writer.WriteStringC(sVal);
				}
				if(m_oType.IsInit() && SimpleTypes::Spreadsheet::celltypeNumber != m_oType->GetValue())
				{
					CString sVal; sVal.Format(_T(" t=\"%s\""), m_oType->ToString());
					writer.WriteStringC(sVal);
				}
				if(m_oValueMetadata.IsInit())
				{
					CString sVal; sVal.Format(_T(" vm=\"%d\""), m_oValueMetadata->GetValue());
					writer.WriteStringC(sVal);
				}
				if(m_oFormula.IsInit() || m_oRichText.IsInit() || m_oValue.IsInit())
				{
					writer.WriteStringC(_T(">"));
					if(m_oFormula.IsInit())
						m_oFormula->toXML(writer);
					if(m_oRichText.IsInit())
						m_oRichText->toXML2(writer);
					if(m_oValue.IsInit())
						m_oValue->toXML2(writer, _T("v"));
					writer.WriteStringC(_T("</c>"));
				}
				else
					writer.WriteStringC(_T("/>"));
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

					if ( _T("f") == sName )
						m_oFormula = oReader;
					else if ( _T("is") == sName )
						m_oRichText = oReader;
					else if ( _T("v") == sName )
						m_oValue = oReader;
				}
			}

			virtual EElementType getType () const
			{
				return et_Cell;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )

					WritingElement_ReadAttributes_Read_if     ( oReader, _T("cm"),      m_oCellMetadata )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("ph"),      m_oShowPhonetic )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("r"),      m_oRef )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("s"),      m_oStyle )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("t"),      m_oType )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("vm"),      m_oValueMetadata )

					WritingElement_ReadAttributes_End( oReader )
			}

		public:
				nullable<SimpleTypes::CUnsignedDecimalNumber<>>		m_oCellMetadata;
				nullable<SimpleTypes::COnOff<>>						m_oShowPhonetic;
				nullable<CString>									m_oRef;
				nullable<SimpleTypes::CUnsignedDecimalNumber<>>		m_oStyle;
				nullable<SimpleTypes::Spreadsheet::CCellTypeType<>>	m_oType;
				nullable<SimpleTypes::CUnsignedDecimalNumber<>>		m_oValueMetadata;

				nullable<CFormula>	m_oFormula;
				nullable<CSi>		m_oRichText;
				nullable<CText>		m_oValue;
		};

		
		
		class CRow : public WritingElementWithChilds<CCell>
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CRow)
			CRow()
			{
			}
			virtual ~CRow()
			{
			}

		public:
			virtual CString      toXML() const
			{
				return _T("");
			}
			virtual void toXML(CStringWriter& writer) const
			{
				writer.WriteStringC(_T("<row"));
				if(m_oCollapsed.IsInit())
				{
					CString sVal; sVal.Format(_T(" collapsed=\"%s\""), m_oCollapsed->ToString2(SimpleTypes::onofftostring1));
					writer.WriteStringC(sVal);
				}
				if(m_oCustomFormat.IsInit())
				{
					CString sVal; sVal.Format(_T(" customFormat=\"%s\""), m_oCustomFormat->ToString2(SimpleTypes::onofftostring1));
					writer.WriteStringC(sVal);
				}
				if(m_oHt.IsInit())
				{
					CString sVal; sVal.Format(_T(" ht=\"%s\""), SpreadsheetCommon::WriteDouble(m_oHt->GetValue()));
					writer.WriteStringC(sVal);
				}
				if(m_oCustomHeight.IsInit())
				{
					CString sVal; sVal.Format(_T(" customHeight=\"%s\""), m_oCustomHeight->ToString2(SimpleTypes::onofftostring1));
					writer.WriteStringC(sVal);
				}
				if(m_oHidden.IsInit())
				{
					CString sVal; sVal.Format(_T(" hidden=\"%s\""), m_oHidden->ToString2(SimpleTypes::onofftostring1));
					writer.WriteStringC(sVal);
				}

				if(m_oOutlineLevel.IsInit())
				{
					CString sVal; sVal.Format(_T(" outlineLevel=\"%d\""), m_oOutlineLevel->GetValue());
					writer.WriteStringC(sVal);
				}
				if(m_oPh.IsInit())
				{
					CString sVal; sVal.Format(_T(" ph=\"%s\""), m_oPh->ToString2(SimpleTypes::onofftostring1));
					writer.WriteStringC(sVal);
				}
				if(m_oR.IsInit())
				{
					CString sVal; sVal.Format(_T(" r=\"%d\""), m_oR->GetValue());
					writer.WriteStringC(sVal);
				}
				if(m_oS.IsInit())
				{
					CString sVal; sVal.Format(_T(" s=\"%d\""), m_oS->GetValue());
					writer.WriteStringC(sVal);
				}
				if(m_oThickBot.IsInit())
				{
					CString sVal; sVal.Format(_T(" thickBot=\"%s\""), m_oThickBot->ToString2(SimpleTypes::onofftostring1));
					writer.WriteStringC(sVal);
				}
				if(m_oThickTop.IsInit())
				{
					CString sVal; sVal.Format(_T(" thickTop=\"%s\""), m_oThickTop->ToString2(SimpleTypes::onofftostring1));
					writer.WriteStringC(sVal);
				}
				writer.WriteStringC(_T(">"));
				for(int i = 0, length = m_arrItems.GetSize(); i < length; ++i)
					m_arrItems[i]->toXML(writer);
				writer.WriteStringC(_T("</row>"));
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

					if ( _T("c") == sName )
						m_arrItems.Add( new CCell( oReader ));
				}
			}

			virtual EElementType getType () const
			{
				return et_Row;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )

					WritingElement_ReadAttributes_Read_if     ( oReader, _T("collapsed"),      m_oCollapsed )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("customFormat"),      m_oCustomFormat )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("customHeight"),      m_oCustomHeight )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("hidden"),      m_oHidden )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("ht"),      m_oHt )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("outlineLevel"),      m_oOutlineLevel )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("ph"),      m_oPh )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("r"),      m_oR )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("s"),      m_oS )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("thickBot"),      m_oThickBot )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("thickTop"),      m_oThickTop )

					WritingElement_ReadAttributes_End( oReader )
			}

		public:
				nullable<SimpleTypes::COnOff<>>					m_oCollapsed;
				nullable<SimpleTypes::COnOff<>>					m_oCustomFormat;
				nullable<SimpleTypes::COnOff<>>					m_oCustomHeight;
				nullable<SimpleTypes::COnOff<>>					m_oHidden;
				nullable<SimpleTypes::CDouble>					m_oHt;
				nullable<SimpleTypes::CUnsignedDecimalNumber<>>	m_oOutlineLevel;
				nullable<SimpleTypes::COnOff<>>					m_oPh;
				nullable<SimpleTypes::CUnsignedDecimalNumber<>>	m_oR;
				nullable<SimpleTypes::CUnsignedDecimalNumber<>>	m_oS;
				nullable<SimpleTypes::COnOff<>>					m_oThickBot;
				nullable<SimpleTypes::COnOff<>>					m_oThickTop;

		};

		class CSheetData  : public WritingElementWithChilds<CRow>
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CSheetData)
			CSheetData()
			{
			}
			virtual ~CSheetData()
			{
			}

		public:
			virtual CString      toXML() const
			{
				return _T("");
			}
			virtual void toXML(CStringWriter& writer) const
			{
				writer.WriteStringC(_T("<sheetData>"));
				for(int i = 0, length = m_arrItems.GetSize(); i < length; ++i)
					m_arrItems[i]->toXML(writer);
				writer.WriteStringC(_T("</sheetData>"));
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

					if ( _T("row") == sName )
						m_arrItems.Add(new CRow( oReader ));
				}
			}

			virtual EElementType getType () const
			{
				return et_SheetData;
			}
		
		private:
			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
			}
		};
	} 
} 

#endif // OOX_SHEETDATA_FILE_INCLUDE_H_