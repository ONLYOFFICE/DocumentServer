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


#include "Namespace.h"
#include "Lexigraph.h"
#include "Encoding.h"


namespace XML
{
	namespace Private
	{
		

		Namespace::Namespace()
			
		{
		}


		Namespace::Namespace(const std::string& prefix, const std::string& name)
			:	Prefix(prefix),
				Name(name)
		{
		}


		const bool Namespace::operator ==(const Namespace& rhs) const
		{
			return Prefix == rhs.Prefix;
		}


		const bool Namespace::operator <(const Namespace& rhs) const
		{
			return Prefix < rhs.Prefix;
		}


		const bool Namespace::exist() const
		{
			return true;
		}


		const std::string Namespace::ToString() const
		{
			if (Prefix != "xmlns")
				return "xmlns:" + (Prefix) + "=\"" + Private::Lexigraph::toSource(Name) + "\"";
			return "xmlns=\"" + Private::Lexigraph::toSource(Name) + "\"";
		}


		const std::wstring Namespace::ToWString() const
		{
			if (Prefix != "xmlns")
				return L"xmlns:" + Encoding::utf82unicode(Prefix) + L"=\""
				+ Encoding::utf82unicode(Private::Lexigraph::toSource(Name)) + L"\"";
			return L"xmlns=\"" + Encoding::utf82unicode(Private::Lexigraph::toSource(Name)) + L"\"";
		}


		void Namespace::SaveToStringList(std::list<std::string>& strList)const
		{
			if (Prefix != "xmlns")
			{
				strList.push_back("xmlns:");
				strList.push_back(Prefix);
				strList.push_back("=\"");
				strList.push_back(Private::Lexigraph::toSource(Name));
				strList.push_back("\"");
				return;
			}
			strList.push_back("xmlns=\"");
			strList.push_back(Private::Lexigraph::toSource(Name));
			strList.push_back("\"");
		}


		void Namespace::SaveToWStringList(std::list<std::wstring>& strList)const
		{
			if (Prefix != "xmlns")
			{
				strList.push_back(L"xmlns:");
				strList.push_back(Encoding::utf82unicode(Prefix));
				strList.push_back(L"=\"");
				strList.push_back(Encoding::utf82unicode(Private::Lexigraph::toSource(Name)));
				strList.push_back(L"\"");
				return;
			}
			strList.push_back(L"xmlns=\"");
			strList.push_back(Encoding::utf82unicode(Private::Lexigraph::toSource(Name)));
			strList.push_back(L"\"");
		}


		const std::string Namespace::GetPrefix()const
		{
			return Prefix;
		}


		const std::string Namespace::GetName()const
		{
			return Name;
		}

	} 
} // namespace XML