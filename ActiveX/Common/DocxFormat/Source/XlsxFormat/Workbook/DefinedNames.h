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
#ifndef OOX_DEFINEDNAMES_FILE_INCLUDE_H_
#define OOX_DEFINEDNAMES_FILE_INCLUDE_H_

#include "../CommonInclude.h"


namespace OOX
{
	namespace Spreadsheet
	{
		
		
		class CDefinedName : public WritingElement
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CDefinedName)
			CDefinedName()
			{
			}
			virtual ~CDefinedName()
			{
			}

		public:
			virtual CString      toXML() const
			{
				return _T("");
			}
			virtual void toXML(CStringWriter& writer) const
			{
				writer.WriteStringC(_T("<definedName"));
				if(m_oName.IsInit())
				{
					CString sVal;sVal.Format(_T(" name=\"%s\""), XmlUtils::EncodeXmlString(m_oName.get()));
					writer.WriteStringC(sVal);
				}
				if(m_oLocalSheetId.IsInit())
				{
					CString sVal;sVal.Format(_T(" localSheetId=\"%d\""), m_oLocalSheetId->GetValue());
					writer.WriteStringC(sVal);
				}
				writer.WriteStringC(_T(">"));
				if(m_oRef.IsInit())
					writer.WriteStringC(XmlUtils::EncodeXmlString(m_oRef.get()));
				writer.WriteStringC(_T("</definedName>"));
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( oReader.IsEmptyNode() )
					return;

				m_oRef = oReader.GetText2();
			}

			virtual EElementType getType () const
			{
				return et_DefinedName;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )

					WritingElement_ReadAttributes_Read_if     ( oReader, _T("comment"),      m_oComment )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("customMenu"),      m_oCustomMenu )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("description"),      m_oDescription )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("function"),      m_oFunction )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("functionGroupId"),      m_oFunctionGroupId )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("help"),      m_oHelp )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("hidden"),      m_oHidden )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("localSheetId"),      m_oLocalSheetId )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("name"),      m_oName )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("publishToServer"),      m_oPublishToServer )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("shortcutKey "),      m_oShortcutKey  )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("statusBar "),      m_oStatusBar  )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("vbProcedure "),      m_oVbProcedure  )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("workbookParameter "),      m_oWorkbookParameter  )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("xlm "),      m_oXlm  )
					

					WritingElement_ReadAttributes_End( oReader )
			}

		public:
				nullable<CString>								m_oComment;
				nullable<CString>								m_oCustomMenu;
				nullable<CString>								m_oDescription;
				nullable<SimpleTypes::COnOff<>>					m_oFunction;
				nullable<SimpleTypes::CUnsignedDecimalNumber<>>	m_oFunctionGroupId;
				nullable<CString>								m_oHelp;
				nullable<SimpleTypes::COnOff<>>					m_oHidden;
				nullable<SimpleTypes::CUnsignedDecimalNumber<>>	m_oLocalSheetId;
				nullable<CString>								m_oName;
				nullable<SimpleTypes::COnOff<>>					m_oPublishToServer;
				nullable<CString>								m_oShortcutKey;
				nullable<CString>								m_oStatusBar;
				nullable<SimpleTypes::COnOff<>>					m_oVbProcedure;
				nullable<SimpleTypes::COnOff<>>					m_oWorkbookParameter;
				nullable<SimpleTypes::COnOff<>>					m_oXlm;

				nullable<CString>								m_oRef;
		};

		class CDefinedNames  : public WritingElementWithChilds<CDefinedName>
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CDefinedNames)
			CDefinedNames()
			{
			}
			virtual ~CDefinedNames()
			{
			}

		public:
			virtual CString      toXML() const
			{
				return _T("");
			}
			virtual void toXML(CStringWriter& writer) const
			{
				if(m_arrItems.GetSize() > 0)
				{
					writer.WriteStringC(_T("<definedNames>"));
					for(int i = 0, length = m_arrItems.GetSize(); i < length; ++i)
						m_arrItems[i]->toXML(writer);
					writer.WriteStringC(_T("</definedNames>"));
				}
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

					if ( _T("definedName") == sName )
						m_arrItems.Add( new CDefinedName( oReader ));
				}
			}

			virtual EElementType getType () const
			{
				return et_BookViews;
			}
		
		private:
			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
			}
		};
	} 
} 

#endif // OOX_DEFINEDNAMES_FILE_INCLUDE_H_