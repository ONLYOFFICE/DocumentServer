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
#ifndef OOX_BIBLIOGRAPHY_INCLUDE_H_
#define OOX_BIBLIOGRAPHY_INCLUDE_H_

#include "../Base/Nullable.h"
#include "WritingElement.h"
#include "File.h"

namespace OOX
{
	
	
	
	class CBibliography : public OOX::File
	{
	public:
		CBibliography()
		{

		}
		CBibliography(const CPath& oPath)
		{
			read( oPath );
		}
		virtual ~CBibliography()
		{

		}

	public:
		virtual void read(const CPath& oFilePath)
		{
			XmlUtils::CXmlLiteReader oReader;

			if ( !oReader.FromFile( oFilePath.GetPath() ) )
				return;

			if ( !oReader.ReadNextNode() )
				return;

			CWCharWrapper sName = oReader.GetName();
			if ( _T("b:Sources") == sName && !oReader.IsEmptyNode() )
			{
				ReadAttributes( oReader );
			}
		}
		virtual void write(const CPath& oFilePath, const CPath& oDirectory, CContentTypes& oContent) const
		{
			CString sXml;
			sXml = _T("<b:Sources");
			
			if ( m_sSelectedStyle.IsInit() )
			{
				sXml += _T(" SelectedStyle=\"");
				sXml += m_sSelectedStyle->GetString();
				sXml += _T("\"");
			}

			if ( m_sStyleName.IsInit() )
			{
				sXml += _T(" StyleName=\"");
				sXml += m_sStyleName->GetString();
				sXml += _T("\"");
			}

			if ( m_sURI.IsInit() )
			{
				sXml += _T(" URI=\"");
				sXml += m_sURI->GetString();
				sXml += _T("\"");
			}

			sXml += _T(" xmlns:b=\"http://schemas.openxmlformats.org/officeDocument/2006/bibliography\" xmlns=\"http://schemas.openxmlformats.org/officeDocument/2006/bibliography\">");


			sXml += _T("</a:Sources>");

			CDirectory::SaveToFile( oFilePath.GetPath(), sXml );
			oContent.Registration( type().OverrideType(), oDirectory, oFilePath );
		}


	public:

		virtual const OOX::FileType type() const
		{
			return FileTypes::Bibliography;
		}
		virtual const CPath DefaultDirectory() const
		{
			return type().DefaultDirectory();
		}
		virtual const CPath DefaultFileName() const
		{
			return type().DefaultFileName();
		}

	private:

		void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
		{
			
			WritingElement_ReadAttributes_Start( oReader )
			WritingElement_ReadAttributes_Read_if     ( oReader, _T("SelectedStyle"), m_sSelectedStyle )
			WritingElement_ReadAttributes_Read_else_if( oReader, _T("StyleName"),     m_sStyleName )
			WritingElement_ReadAttributes_Read_else_if( oReader, _T("URI"),           m_sURI )
			WritingElement_ReadAttributes_End( oReader )
		}

	private:

		
		nullable<CString> m_sSelectedStyle;
		nullable<CString> m_sStyleName;
		nullable<CString> m_sURI;

		

		
	};
} 

#endif // OOX_BIBLIOGRAPHY_INCLUDE_H_