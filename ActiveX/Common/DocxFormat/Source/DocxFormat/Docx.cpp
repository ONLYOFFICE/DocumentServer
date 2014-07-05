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
 #include "Docx.h"

namespace OOX {
	
	BOOL CDocx::Read(const CPath& oFilePath) {
		
		OOX::CRels oRels( oFilePath / L"/" );
		IFileContainer::Read( oRels, oFilePath );

		

		
		smart_ptr<OOX::File> pFile = Find(OOX::FileTypes::Document);
		if (pFile.IsInit() && OOX::FileTypes::Document == pFile->type())
			m_pDocument = (OOX::CDocument*)pFile.operator->();
		else 
			m_pDocument = NULL;

		if ( m_pDocument )
		{
			OOX::IFileContainer* pDocumentContainer = (OOX::IFileContainer*)m_pDocument;

			
			pFile = pDocumentContainer->Find( OOX::FileTypes::FontTable );
			if ( pFile.IsInit() && OOX::FileTypes::FontTable == pFile->type() )
				m_pFontTable = (OOX::CFontTable*)pFile.operator->();
			else 
				m_pFontTable = NULL;

			
			pFile = pDocumentContainer->Find( OOX::FileTypes::Numbering );
			if ( pFile.IsInit() && OOX::FileTypes::Numbering == pFile->type() )
				m_pNumbering = (OOX::CNumbering*)pFile.operator->();
			else 
				m_pNumbering = NULL;

			
			pFile = pDocumentContainer->Find( OOX::FileTypes::Style );
			if ( pFile.IsInit() && OOX::FileTypes::Style == pFile->type() )
				m_pStyles = (OOX::CStyles*)pFile.operator->();
			else 
				m_pStyles = NULL;

			
			pFile = pDocumentContainer->Find( OOX::FileTypes::FootNote );
			if ( pFile.IsInit() && OOX::FileTypes::FootNote == pFile->type() )
				m_pFootnotes = (OOX::CFootnotes*)pFile.operator->();
			else
				m_pFootnotes = NULL;

			pFile = pDocumentContainer->Find( OOX::FileTypes::EndNote );
			if ( pFile.IsInit() && OOX::FileTypes::EndNote == pFile->type() )
				m_pEndnotes = (OOX::CEndnotes*)pFile.operator->();
			else
				m_pEndnotes = NULL;

			
			pFile = pDocumentContainer->Find( OOX::FileTypes::Setting );
			if ( pFile.IsInit() && OOX::FileTypes::Setting == pFile->type() )
				m_pSettings = (OOX::CSettings*)pFile.operator->();
			else 
				m_pSettings = NULL;

			
			pFile = pDocumentContainer->Find( OOX::FileTypes::Comments );
			if ( pFile.IsInit() && OOX::FileTypes::Comments == pFile->type() )
				m_pComments = (OOX::CComments*)pFile.operator->();
			else 
				m_pComments = NULL;

			
			pFile = pDocumentContainer->Find( OOX::FileTypes::CommentsExt );
			if ( pFile.IsInit() && OOX::FileTypes::CommentsExt == pFile->type() )
				m_pCommentsExt = (OOX::CCommentsExt*)pFile.operator->();
			else 
				m_pCommentsExt = NULL;

			
			pFile = pDocumentContainer->Find( OOX::FileTypes::People );
			if ( pFile.IsInit() && OOX::FileTypes::People == pFile->type() )
				m_pPeople = (OOX::CPeople*)pFile.operator->();
			else 
				m_pPeople = NULL;

			
			

			
			pFile = pDocumentContainer->Find(OOX::FileTypes::Theme);
			if (pFile.IsInit() && OOX::FileTypes::Theme == pFile->type())
				m_pTheme = (OOX::CTheme*)pFile.operator->();
			else 
				m_pTheme = NULL;
		}

		
		pFile = Find( OOX::FileTypes::App );
		if ( pFile.IsInit() && OOX::FileTypes::App == pFile->type() )
			m_pApp = (OOX::CApp*)pFile.operator->();
		else 
			m_pApp = NULL;

		pFile = Find( OOX::FileTypes::Core );
		if ( pFile.IsInit() && OOX::FileTypes::Core == pFile->type() )
			m_pCore = (OOX::CCore*)pFile.operator->();
		else 
			m_pCore = NULL;

		return TRUE;
	}
	
}