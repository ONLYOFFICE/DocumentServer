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
#ifndef OOX_DOCX_INCLUDE_H_
#define OOX_DOCX_INCLUDE_H_

#include "../Base/SmartPtr.h"

#include "Rels.h"
#include "IFileContainer.h"
#include "FileTypes.h"
#include "App.h"
#include "Core.h"
#include "Document.h"
#include "FontTable.h"
#include "Numbering.h"
#include "Comments.h"
#include "Styles.h"
#include "Footnote.h"
#include "Endnote.h"
#include "Settings\WebSettings.h"
#include "Settings\Settings.h"
#include "External\HyperLink.h"
#include "Media\Image.h"
#include "Media\OleObject.h"
#include "HeaderFooter.h"
#include "Theme\Theme.h"

namespace OOX
{
	class CDocx : public OOX::IFileContainer
	{
	public:

		CDocx()
		{
			m_pDocument  = NULL;
			m_pFontTable = NULL;
			m_pNumbering = NULL;
			m_pStyles    = NULL;
			m_pApp       = NULL;
			m_pCore      = NULL;
			m_pEndnotes  = NULL;
			m_pFootnotes = NULL;
			m_pSettings  = NULL;
			m_pTheme     = NULL;
			m_pComments  = NULL;
			m_pCommentsExt = NULL;
			m_pPeople	= NULL;
		}
		CDocx(const CPath& oFilePath)
		{
			m_pDocument  = NULL;
			m_pFontTable = NULL;
			m_pNumbering = NULL;
			m_pStyles    = NULL;
			m_pApp       = NULL;
			m_pCore      = NULL;
			m_pEndnotes  = NULL;
			m_pFootnotes = NULL;
			m_pSettings  = NULL;
			m_pTheme     = NULL;
			m_pComments  = NULL;
			m_pCommentsExt = NULL;
			m_pPeople	= NULL;

			Read( oFilePath );
		}

	public:

		BOOL Read(const CPath& oFilePath);
		BOOL Write(const CPath& oFilePath)
		{

			

			return FALSE;

			
			CreateDirectoryW( oFilePath.GetPath(), NULL );

			OOX::CRels         oRels;
			OOX::CContentTypes oContent;

			IFileContainer::Write( oRels, oFilePath, OOX::CPath( L"" ), oContent );
			oRels.Write( oFilePath / L"/" );
			oContent.Write( oFilePath );

			return TRUE;
		}



	public:

		OOX::CDocument  *GetDocument () const
		{
			return m_pDocument;
		}
		OOX::CFontTable *GetFontTable() const
		{
			return m_pFontTable;
		}
		OOX::CNumbering *GetNumbering() const
		{
			return m_pNumbering;
		}
		OOX::CStyles    *GetStyles   () const
		{
			return m_pStyles;
		}
		OOX::CEndnotes  *GetEndnotes () const
		{
			return m_pEndnotes;
		}
		OOX::CFootnotes *GetFootnotes() const
		{
			return m_pFootnotes;
		}
		OOX::CApp       *GetApp      () const
		{
			return m_pApp;
		}
		OOX::CCore      *GetCore     () const
		{
			return m_pCore;
		}
		OOX::CSettings  *GetSettings () const
		{
			return m_pSettings;
		}
		OOX::CComments  *GetComments () const
		{
			return m_pComments;
		}
		OOX::CCommentsExt  *GetCommentsExt () const
		{
			return m_pCommentsExt;
		}
		OOX::CPeople  *GetPeople () const
		{
			return m_pPeople;
		}

		OOX::CTheme		*GetTheme () const
		{
			return m_pTheme;
		}

		OOX::CHdrFtr    *GetHeaderOrFooter(const OOX::RId& rId) const
		{
			if ( m_pDocument )
			{
				OOX::IFileContainer* pDocumentContainer = (OOX::IFileContainer*)m_pDocument;

				smart_ptr<OOX::File> pFile = pDocumentContainer->Find( rId );
				if ( pFile.IsInit() && ( OOX::FileTypes::Header == pFile->type() || OOX::FileTypes::Footer == pFile->type() ) )
					return (OOX::CHdrFtr*)pFile.operator->();
				else 
					return NULL;
			}
			
			return NULL;
		}

	public:

		OOX::CApp       *m_pApp;
		OOX::CCore      *m_pCore;

		OOX::CDocument  *m_pDocument;   
		OOX::CFontTable *m_pFontTable;  
		OOX::CNumbering *m_pNumbering;  
		OOX::CStyles    *m_pStyles;     
		OOX::CFootnotes *m_pFootnotes;  
		OOX::CEndnotes  *m_pEndnotes;   
		OOX::CSettings  *m_pSettings;   
		OOX::CComments  *m_pComments;   
		OOX::CCommentsExt *m_pCommentsExt;
		OOX::CPeople	*m_pPeople;		
		
		OOX::CTheme		*m_pTheme;

	};
} 

#endif // OOX_DOCX_INCLUDE_H_