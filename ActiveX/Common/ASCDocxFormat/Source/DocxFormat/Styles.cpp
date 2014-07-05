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


#include "Styles.h"
#include "FileTypes.h"

namespace OOX
{
	Styles::Styles()
	{

	}

	Styles::Styles(const OOX::CPath& filename)
	{
		read(filename);
	}

	Styles::~Styles()
	{

	}

	void Styles::read(const OOX::CPath& filename)
	{
		const XML::XDocument document(filename);
		
		Default	=	document.Root.element("docDefaults");
		Lattent	=	document.Root.element("latentStyles");
		
		Fill(Named, document.Root, "style");
	}

	void Styles::write(const OOX::CPath& filename, const OOX::CPath& directory, ContentTypes::File& content) const
	{
	}

	const FileType Styles::type() const
	{
		return FileTypes::Style;
	}

	const OOX::CPath Styles::DefaultDirectory() const
	{
		return type().DefaultDirectory();
	}

	const OOX::CPath Styles::DefaultFileName() const
	{
		return type().DefaultFileName();
	}

	const OOX::Styles::Style Styles::GetStyleById(const std::string& Id) const
	{
		for (size_t i = 0; i < Named->size(); ++i)
		{
			if (Named->operator [](i).StyleId == Id)
				return Named->operator [](i);
		}

		return OOX::Styles::Style();
	}

	const OOX::Styles::Style Styles::GetDefaultStyle(const std::string& Type) const
	{
		OOX::Styles::Style defSt;

		const std::vector<Style>& st = Named.get();
		for (std::vector<Style>::const_iterator iter = st.begin(); iter != st.begin(); ++iter)
		{
			if (((*iter).Type == Type) && (*iter).Default.is_init() && (*(*iter).Default == 1))
			{
				defSt = (*iter);   
			}
		}

		return defSt;
	}

	const OOX::Styles::Style Styles::GetStyleWithTypeAndName (const std::string& Type, const std::string& Name) const
	{
		OOX::Styles::Style defSt;
		
		const std::vector<Style>& st = Named.get();
		for (std::vector<Style>::const_iterator iter = st.begin(); iter != st.begin(); ++iter)
		{
			if (((*iter).Type == Type) && ((*iter).name == Name))
			{
				defSt = (*iter);   
			}
		}

		return defSt;
	}

} // namespace OOX