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
 
#include "precompiled_xml.h"


#include "XDocument.h"
#include "Private/XSpace.h"
#include "Exception/not_implement.h"
#include "Private/XFileSource.h"
#include "Private/XWFileSource.h"
#include "Private/XStringSource.h"
#include "Private/XWStringSource.h"
#include <list>
#include "Utility.h"

namespace XML
{

	XDocument::XDocument(const XElement& element)
		: Root(element)
	{
	}

	XDocument::XDocument(const wchar_t* source, const bool space)
	{
		OOX::CPath path(source);
		TxtFile text(path);
		if(text.isUnicode())
		{
			NSCommon::smart_ptr<Private::XWideSource> xsource(new Private::XWFileSource(path, Private::XWideSource::estLittleEndian));
			Load(xsource, space);
		}
		else if((text.isBigEndian()) || (text.isUnicodeWithOutBOM()))
		{
			NSCommon::smart_ptr<Private::XWideSource> xsource(new Private::XWFileSource(path, Private::XWideSource::estBigEndian));
			Load(xsource, space);
		}
		else
		{
			NSCommon::smart_ptr<Private::XSingleSource> xsource(new Private::XFileSource(path));
			Load(xsource, space);
		}
	}


	XDocument::XDocument(const std::string& source, const bool space)
	{
		NSCommon::smart_ptr<Private::XSingleSource> xsource(new Private::XStringSource(source));
		Load(xsource, space);
	}


	XDocument::XDocument(const std::wstring& source, const bool space)
	{
		NSCommon::smart_ptr<Private::XWideSource> xsource(new Private::XWStringSource(source));
		Load(xsource, space);
	}

	XDocument::XDocument(const OOX::CPath& source, const bool space)
	{
		TxtFile text(source);
		if(text.isUnicode())
		{
			NSCommon::smart_ptr<Private::XWideSource> xsource(new Private::XWFileSource(source, Private::XWideSource::estLittleEndian));
			Load(xsource, space);
		}
		else if((text.isBigEndian()) || (text.isUnicodeWithOutBOM()))
		{
			NSCommon::smart_ptr<Private::XWideSource> xsource(new Private::XWFileSource(source, Private::XWideSource::estBigEndian));
			Load(xsource, space);
		}
		else
		{
			NSCommon::smart_ptr<Private::XSingleSource> xsource(new Private::XFileSource(source));
			Load(xsource, space);
		}
	}


	const std::string XDocument::ToString()
	{
		Root->Namespaces.merge(Root->usedNamespace());

		std::list<std::string> strList;
		strList.push_back(Declaration->ToString());
		Root->SaveToStringList(strList);

		std::string result = "";
		size_t length = 0;
		for(std::list<std::string>::const_iterator iter = strList.begin(); iter != strList.end(); iter++)
		{
			length += iter->length();
		}
		result.reserve(length);
		for(std::list<std::string>::const_iterator iter = strList.begin(); iter != strList.end(); iter++)
		{
			result += *iter;
		}

		return result;
		
	}


	const std::wstring XDocument::ToWString()
	{
		Root->Namespaces.merge(Root->usedNamespace());

		std::list<std::wstring> strList;
		strList.push_back(Declaration->ToWString());
		Root->SaveToWStringList(strList);

		std::wstring result = L"";
		size_t length = 0;
		for(std::list<std::wstring>::const_iterator iter = strList.begin(); iter != strList.end(); iter++)
		{
			length += iter->length();
		}
		result.reserve(length);
		for(std::list<std::wstring>::const_iterator iter = strList.begin(); iter != strList.end(); iter++)
		{
			result += *iter;
		}

		return result;
		
	}


	void XDocument::Load(NSCommon::smart_ptr<Private::XSingleSource> source, const bool space)
	{
		source->findAndSkip('<');
		if (source->get() == '?')
		{
			Declaration->fromSource(source);
			source->findAndSkip('<');
		}
		source->skipSpace();
		Root->fromSource(source, Root->Namespaces, space);
	}


	void XDocument::Load(NSCommon::smart_ptr<Private::XWideSource> source, const bool space)
	{
		source->findAndSkip(L'<');
		if (source->get() == L'?')
		{
			Declaration->fromSource(source);
			source->findAndSkip(L'<');
		}
		source->skipSpace();
		Root->fromSource(source, Root->Namespaces, space);
	}

	void XDocument::Save(const OOX::CPath& path)
	{
		std::ofstream file(path.GetPath());
		if (!file.bad())
		{
			file << ToString();
			file.close();
		}
	}


	void XDocument::Save(std::string& source)
	{
		source.clear();
		source = ToString();
	}


	void XDocument::Save(std::wstring& source)
	{
		source.clear();
		source = ToWString();
	}

} // namespace XML