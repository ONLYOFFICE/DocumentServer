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


#include "Attribute.h"
#include "Lexigraph.h"
#include "Encoding.h"


namespace XML
{
	namespace Private
	{

		Attribute::Attribute(const XML::XName& xname, const std::string& value)
			: XName(xname),
				Value(value)
		{
		}


		Attribute::Attribute()
		{
		}


		const bool Attribute::operator ==(const Attribute& rhs) const
		{
			
			return (XName->Equal(*rhs.XName));
		}


		const bool Attribute::operator <(const Attribute& rhs) const
		{
			return ((*XName->Name) < (*rhs.XName->Name));
		}


		const bool Attribute::exist() const
		{
			return true;
		}


		const std::string Attribute::ToString() const
		{
			return XName->ToString() + "=\"" + Private::Lexigraph::toSource(Value->ToString()) + "\"";
		}


		const std::wstring Attribute::ToWString() const
		{
			return XName->ToWString() + L"=\"" + Encoding::utf82unicode(Private::Lexigraph::toSource(Value->ToString())) + L"\"";
		}


		void Attribute::SaveToStringList(std::list<std::string>& strList)const
		{
			XName->SaveToStringList(strList);
			strList.push_back("=\"");
			strList.push_back(Private::Lexigraph::toSource(Value->ToString()));
			strList.push_back("\"");
		}


		void Attribute::SaveToWStringList(std::list<std::wstring>& strList)const
		{
			XName->SaveToWStringList(strList);
			strList.push_back(L"=\"");
			strList.push_back(Encoding::utf82unicode(Private::Lexigraph::toSource(Value->ToString())));
			strList.push_back(L"\"");
		}


		const XString Attribute::value() const
		{
			return *Value;
		}

	} 
} // namespace XML