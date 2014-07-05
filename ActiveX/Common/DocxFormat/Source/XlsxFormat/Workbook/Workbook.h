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
#ifndef OOX_WORKBOOK_FILE_INCLUDE_H_
#define OOX_WORKBOOK_FILE_INCLUDE_H_

#include "../CommonInclude.h"

#include "BookViews.h"
#include "DefinedNames.h"
#include "Sheets.h"
#include "WorkbookPr.h"

namespace OOX
{
	namespace Spreadsheet
	{
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		class CWorkbook : public OOX::File, public OOX::Spreadsheet::IFileContainer
		{
		public:
			CWorkbook()
			{
			}
			CWorkbook(const CPath& oPath)
			{
				read(oPath);
			}
			virtual ~CWorkbook()
			{
			}
		public:

			virtual void read(const CPath& oPath)
			{
				m_oReadPath = oPath;
				IFileContainer::Read( oPath );

				XmlUtils::CXmlLiteReader oReader;

				if ( !oReader.FromFile( oPath.GetPath() ) )
					return;

				if ( !oReader.ReadNextNode() )
					return;

				CWCharWrapper sName = oReader.GetName();
				if ( _T("workbook") == sName )
				{
					if ( !oReader.IsEmptyNode() )
					{
						int nDocumentDepth = oReader.GetDepth();
						while ( oReader.ReadNextSiblingNode( nDocumentDepth ) )
						{
							sName = oReader.GetName();

							if ( _T("bookViews") == sName )
								m_oBookViews = oReader;
							else if ( _T("definedNames") == sName )
								m_oDefinedNames = oReader;
							else if ( _T("sheets") == sName )
								m_oSheets = oReader;
							else if ( _T("workbookPr") == sName )
								m_oWorkbookPr = oReader;
						}
					}
				}		
			}
			virtual void write(const CPath& oPath, const CPath& oDirectory, CContentTypes& oContent) const
			{
				CStringWriter sXml;
				sXml.WriteStringC(_T("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><workbook xmlns=\"http://schemas.openxmlformats.org/spreadsheetml/2006/main\" xmlns:r=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships\">"));

				if(m_oWorkbookPr.IsInit())
					m_oWorkbookPr->toXML(sXml);
				if(m_oBookViews.IsInit())
					m_oBookViews->toXML(sXml);
				if(m_oSheets.IsInit())
					m_oSheets->toXML(sXml);
				if(m_oDefinedNames.IsInit())
					m_oDefinedNames->toXML(sXml);

				sXml.WriteStringC(_T("<calcPr calcId=\"145621\"/>"));
				sXml.WriteStringC(_T("</workbook>"));

				CDirectory::SaveToFile( oPath.GetPath(), sXml.GetCString() );

				oContent.Registration( type().OverrideType(), oDirectory, oPath.GetFilename() );
				IFileContainer::Write( oPath, oDirectory, oContent );
			}
			virtual const OOX::FileType type() const
			{
				return OOX::Spreadsheet::FileTypes::Workbook;
			}
			virtual const CPath DefaultDirectory() const
			{
				return type().DefaultDirectory();
			}
			virtual const CPath DefaultFileName() const
			{
				return type().DefaultFileName();
			}
			const CPath& GetReadPath()
			{
				return m_oReadPath;
			}
			void PrepareToWrite()
			{
				
				if(false == m_oWorkbookPr.IsInit())
					m_oWorkbookPr.Init();
				
				
				
				
				
				
				
				if(false == m_oBookViews.IsInit())
					m_oBookViews.Init();
				if(0 == m_oBookViews->m_arrItems.GetSize())
					m_oBookViews->m_arrItems.Add(new OOX::Spreadsheet::CWorkbookView());
				OOX::Spreadsheet::CWorkbookView* pWorkbookView = m_oBookViews->m_arrItems[0];
				if(false == pWorkbookView->m_oXWindow.IsInit())
				{
					pWorkbookView->m_oXWindow.Init();
					pWorkbookView->m_oXWindow->SetValue(360);
				}
				if(false == pWorkbookView->m_oYWindow.IsInit())
				{
					pWorkbookView->m_oYWindow.Init();
					pWorkbookView->m_oYWindow->SetValue(15);
				}
				if(false == pWorkbookView->m_oWindowWidth.IsInit())
				{
					pWorkbookView->m_oWindowWidth.Init();
					pWorkbookView->m_oWindowWidth->SetValue(20955);
				}
				if(false == pWorkbookView->m_oWindowHeight.IsInit())
				{
					pWorkbookView->m_oWindowHeight.Init();
					pWorkbookView->m_oWindowHeight->SetValue(9720);
				}
			}
		private:
			CPath									m_oReadPath;

		public:
			nullable<OOX::Spreadsheet::CBookViews> m_oBookViews;
			nullable<OOX::Spreadsheet::CDefinedNames> m_oDefinedNames;
			nullable<OOX::Spreadsheet::CSheets> m_oSheets;
			nullable<OOX::Spreadsheet::CWorkbookPr> m_oWorkbookPr;

		};
	} 
} 

#endif // OOX_WORKBOOK_FILE_INCLUDE_H_