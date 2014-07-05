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
 
#include "precompiled_docxformat.h"


#include "Core.h"
#include "FileTypes.h"

namespace OOX
{
	Core::Core()
	{
	}

	Core::Core(const OOX::CPath& filename)
	{
		read(filename);
	}

	Core::~Core()
	{
	}

	void Core::read(const OOX::CPath& oPath)
	{
		XmlUtils::CXmlNode document;
		document.FromXmlFile( oPath.GetPath(), true );

		if ( _T("cp:coreProperties") == document.GetName() )
		{
			XmlUtils::CXmlNode item;

			if ( document.GetNode( _T("cp:category"), item ) )
				m_sCategory = std::wstring(static_cast<const wchar_t*>(item.GetText()));

			if ( document.GetNode( _T("cp:contentStatus"), item ) )
				m_sContentStatus = std::wstring(static_cast<const wchar_t*>(item.GetText()));

			if ( document.GetNode( _T("dcterms:created"), item ) )
				m_sCreated = std::wstring(static_cast<const wchar_t*>(item.GetText()));

			if ( document.GetNode( _T("dc:creator"), item ) )
				m_sCreator = std::wstring(static_cast<const wchar_t*>(item.GetText()));

			if ( document.GetNode( _T("dc:description"), item ) )
				m_sDescription = std::wstring(static_cast<const wchar_t*>(item.GetText()));

			if ( document.GetNode( _T("dc:identifier"), item ) )
				m_sIdentifier = std::wstring(static_cast<const wchar_t*>(item.GetText()));

			if ( document.GetNode( _T("cp:keywords"), item ) )
				m_sKeywords = std::wstring(static_cast<const wchar_t*>(item.GetText()));

			if ( document.GetNode( _T("dc:language"), item ) )
				m_sLanguage = std::wstring(static_cast<const wchar_t*>(item.GetText()));

			if ( document.GetNode( _T("cp:lastModifiedBy"), item ) )
				m_sLastModifiedBy = std::wstring(static_cast<const wchar_t*>(item.GetText()));

			if ( document.GetNode( _T("cp:lastPrinted"), item ) )
				m_sLastPrinted = std::wstring(static_cast<const wchar_t*>(item.GetText()));

			if ( document.GetNode( _T("dcterms:modified"), item ) )
				m_sModified = std::wstring(static_cast<const wchar_t*>(item.GetText()));

			if ( document.GetNode( _T("cp:revision"), item ) )
				m_sRevision = std::wstring(static_cast<const wchar_t*>(item.GetText()));

			if ( document.GetNode( _T("dc:subject"), item ) )
				m_sSubject = std::wstring(static_cast<const wchar_t*>(item.GetText()));

			if ( document.GetNode( _T("dc:title"), item ) )
				m_sTitle = std::wstring(static_cast<const wchar_t*>(item.GetText()));

			if ( document.GetNode( _T("cp:version"), item ) )
				m_sVersion = std::wstring(static_cast<const wchar_t*>(item.GetText()));
		}
	}

	void Core::write(const OOX::CPath& oPath, const OOX::CPath& directory, ContentTypes::File& content) const
	{
	}

	const FileType Core::type() const
	{
		return FileTypes::Core;
	}

	const OOX::CPath Core::DefaultDirectory() const
	{
		return type().DefaultDirectory();
	}

	const OOX::CPath Core::DefaultFileName() const
	{
		return type().DefaultFileName();
	}

} // namespace OOX