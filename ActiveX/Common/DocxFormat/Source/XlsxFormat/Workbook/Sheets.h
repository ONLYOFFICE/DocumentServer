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
#ifndef OOX_SHEETS_FILE_INCLUDE_H_
#define OOX_SHEETS_FILE_INCLUDE_H_

#include "../CommonInclude.h"


namespace OOX
{
	namespace Spreadsheet
	{
		
		
		class CSheet : public WritingElement
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CSheet)
			CSheet()
			{
			}
			virtual ~CSheet()
			{
			}

		public:
			virtual CString      toXML() const
			{
				return _T("");
			}
			virtual void toXML(CStringWriter& writer) const
			{
				writer.WriteStringC(_T("<sheet"));
				if(m_oName.IsInit())
				{
					CString sVal;sVal.Format(_T(" name=\"%s\""), XmlUtils::EncodeXmlString(m_oName.get()));
					writer.WriteStringC(sVal);
				}
				if(m_oSheetId.IsInit())
				{
					CString sVal;sVal.Format(_T(" sheetId=\"%d\""), m_oSheetId->GetValue());
					writer.WriteStringC(sVal);
				}
				if(m_oState.IsInit())
				{
					CString sVal;sVal.Format(_T(" state=\"%s\""), m_oState->ToString());
					writer.WriteStringC(sVal);
				}
				if(m_oRid.IsInit())
				{
					CString sVal;sVal.Format(_T(" r:id=\"%s\""), m_oRid->GetValue());
					writer.WriteStringC(sVal);
				}
				writer.WriteStringC(_T("/>"));
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}

			virtual EElementType getType () const
			{
				return et_Sheet;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )

					WritingElement_ReadAttributes_Read_if     ( oReader, _T("r:id"),      m_oRid )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("name"),      m_oName )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("sheetId"),      m_oSheetId )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("state"),      m_oState )

					WritingElement_ReadAttributes_End( oReader )
			}

		public:
				nullable<SimpleTypes::CRelationshipId>				m_oRid;
				nullable<CString>									m_oName;
				nullable<SimpleTypes::CUnsignedDecimalNumber<>>		m_oSheetId;
				nullable<SimpleTypes::Spreadsheet::CVisibleType<>>	m_oState;

		};

		class CSheets  : public WritingElementWithChilds<CSheet>
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CSheets)
			CSheets()
			{
			}
			virtual ~CSheets()
			{
			}

		public:
			virtual CString      toXML() const
			{
				return _T("");
			}
			virtual void toXML(CStringWriter& writer) const
			{
				writer.WriteStringC(_T("<sheets>"));
				for(int i = 0, length = m_arrItems.GetSize(); i < length; ++i)
					m_arrItems[i]->toXML(writer);
				writer.WriteStringC(_T("</sheets>"));
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

					if ( _T("sheet") == sName )
						m_arrItems.Add( new CSheet( oReader ));

				}
			}

			virtual EElementType getType () const
			{
				return et_Sheets;
			}
		
		private:
			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
			}
		};
	} 
} 

#endif // OOX_SHEETS_FILE_INCLUDE_H_