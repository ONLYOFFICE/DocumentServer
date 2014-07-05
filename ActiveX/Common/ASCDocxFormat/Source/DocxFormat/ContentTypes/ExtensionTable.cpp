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


#include "ExtensionTable.h"
#include "Exception/log_range_error.h"
#include "ToString.h"


namespace OOX
{
	namespace ContentTypes
	{

		ExtensionTable::ExtensionTable()
		{
			m_table.insert(std::make_pair(L"gif",	"image/gif"));
			m_table.insert(std::make_pair(L"png",	"image/png"));
			m_table.insert(std::make_pair(L"tif",	"image/tiff"));
			m_table.insert(std::make_pair(L"tiff",	"image/tiff"));
			m_table.insert(std::make_pair(L"jpeg",	"image/jpeg"));
			m_table.insert(std::make_pair(L"jpg",	"image/jpeg"));
			m_table.insert(std::make_pair(L"jpe",	"image/jpeg"));
			m_table.insert(std::make_pair(L"jfif",	"image/jpeg"));
			m_table.insert(std::make_pair(L"rels",	"application/vnd.openxmlformats-package.relationships+xml"));
			m_table.insert(std::make_pair(L"bin",	"application/vnd.openxmlformats-officedocument.oleObject"));
			m_table.insert(std::make_pair(L"xml",	"application/xml"));
			m_table.insert(std::make_pair(L"emf",	"image/x-emf"));
			m_table.insert(std::make_pair(L"emz",	"image/x-emz"));
			m_table.insert(std::make_pair(L"wmf",	"image/x-wmf"));
			m_table.insert(std::make_pair(L"svm",	"image/svm"));
			m_table.insert(std::make_pair(L"wav",	"audio/wav"));
			m_table.insert(std::make_pair(L"xls",	"application/vnd.ms-excel"));
			m_table.insert(std::make_pair(L"xlsm",	"application/vnd.ms-excel.sheet.macroEnabled.12"));
			m_table.insert(std::make_pair(L"xlsb",	"application/vnd.ms-excel.sheet.binary.macroEnabled.12"));
			m_table.insert(std::make_pair(L"xlsx",	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
			m_table.insert(std::make_pair(L"ppt",	"application/vnd.ms-powerpoint"));
			m_table.insert(std::make_pair(L"pptm",	"application/vnd.ms-powerpoint.presentation.macroEnabled.12"));			
			m_table.insert(std::make_pair(L"pptx",	"application/vnd.openxmlformats-officedocument.presentationml.presentation"));
			m_table.insert(std::make_pair(L"sldm",	"application/vnd.ms-powerpoint.slide.macroEnabled.12"));			
			m_table.insert(std::make_pair(L"sldx",	"application/vnd.openxmlformats-officedocument.presentationml.slide"));
			m_table.insert(std::make_pair(L"doc",	"application/msword"));
			m_table.insert(std::make_pair(L"docm",	"aapplication/vnd.ms-word.document.macroEnabled.12"));
			m_table.insert(std::make_pair(L"docx",	"application/vnd.openxmlformats-officedocument.wordprocessingml.document"));
			m_table.insert(std::make_pair(L"vml",	"application/vnd.openxmlformats-officedocument.vmlDrawing"));
		}


		const std::string& ExtensionTable::operator[] (const std::wstring& extension) const
		{
			std::map<std::wstring, std::string>::const_iterator iter = m_table.find(ToLower(extension));
			if (iter == m_table.end())
				throw log_range_error(L"not found " + extension + L" in extension table"); 
			return iter->second;
		}

	} 
} // namespace OOX