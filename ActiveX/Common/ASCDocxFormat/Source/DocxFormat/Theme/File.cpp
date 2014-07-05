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


#include "File.h"
#include "./../FileTypes.h"


namespace OOX
{
	namespace Theme
	{

		File::File()
		{
		}


		File::File(const OOX::CPath& filename)
		{
			read(filename);
		}


		File::~File()
		{
		}


		void File::read(const OOX::CPath& filename)
		{
			const XML::XDocument document(filename);
		
			name = document.Root.attribute("name").value();
			themeElements			= document.Root.element("themeElements");
			objectDefaults		= document.Root.element("objectDefaults");
			extraClrSchemeLst = document.Root.element("extraClrSchemeLst");
		}


		void File::write(const OOX::CPath& filename, const OOX::CPath& directory, ContentTypes::File& content) const
		{
			
			
			
			
			
			

			
		}


		const FileType File::type() const
		{
			return FileTypes::Theme;
		}


		const OOX::CPath File::DefaultDirectory() const
		{
			return type().DefaultDirectory();
		}


		const OOX::CPath File::DefaultFileName() const
		{
			return type().DefaultFileName();
		}


		const std::string File::GetMajorFont() const
		{
			if (themeElements.is_init() 
				&& themeElements->fontScheme.is_init()
				&& themeElements->fontScheme->majorFont.is_init())
				return themeElements->fontScheme->majorFont->latin.get_value_or("Times New Roman");
			else
				return "Times New Roman";
		}
		
		
		const std::string File::GetMinorFont() const
		{
			if (themeElements.is_init() 
				&& themeElements->fontScheme.is_init()
				&& themeElements->fontScheme->minorFont.is_init())
				return themeElements->fontScheme->minorFont->latin.get_value_or("Times New Roman");
			else
				return "Times New Roman";
		}

	} 
} // namespace OOX