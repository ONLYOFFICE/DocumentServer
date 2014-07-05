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


#include "XName.h"
#include <algorithm>
#include "Encoding.h"
#include "ToString.h"


namespace XML
{

	XName::XName()
	{
	}


	XName::XName(const char* name)
		:	Name(name)
	{
	}


	XName::XName(const std::string& name)
		: Name(name)
	{
	}


	XName::XName(const XNamespace& ns, const std::string& name)
		:	Ns(ns),
			Name(name)
	{
	}


	const bool XName::Equal(const XName& rhs) const
	{
		if (rhs.Ns.is_init() && Ns.is_init())
			return	((rhs.Ns->GetPrefix() == Ns->GetPrefix()) && 
							(rhs.Name.ToString() == Name.ToString()));
		if (!rhs.Ns.is_init() && !Ns.is_init())
			return rhs.Name.ToString() == Name.ToString();
		return false;
	}


	const bool XName::operator ==(const XName& rhs) const
	{
		if (!rhs.Ns.is_init() || !Ns.is_init())
			return Name.ToString() == rhs.Name.ToString();
		return	((Ns->GetPrefix() == rhs.Ns->GetPrefix()) && 
						(Name.ToString() == rhs.Name.ToString()));
	}


	const std::string XName::ToString() const
	{
		if (!Ns.is_init())
			return Name;
		return Ns->GetPrefix() + ":" + Name.ToString();
	}


	const std::wstring XName::ToWString() const
	{
		if (!Ns.is_init())
			return Encoding::utf82unicode(Name.ToString());
		return Encoding::utf82unicode(Ns->GetPrefix()) + L":" + Encoding::utf82unicode(Name.ToString());
	}


	void XName::SaveToStringList(std::list<std::string>& strList)const
	{
		if (!Ns.is_init())
		{
			strList.push_back(*Name);
			return;
		}
		strList.push_back(Ns->GetPrefix());
		strList.push_back(":");
		strList.push_back(*Name);
	}


	void XName::SaveToWStringList(std::list<std::wstring>& strList)const
	{
		if (!Ns.is_init())
		{
			strList.push_back(Encoding::utf82unicode(*Name));
			return;
		}
		strList.push_back(Encoding::utf82unicode(Ns->GetPrefix()));
		strList.push_back(L":");
		strList.push_back(Encoding::utf82unicode(*Name));
	}


	const XName operator +(const XNamespace& ns, const std::string& name)
	{
		return XName(ns, name);
	}


	const XName operator +(const XNamespace& ns, const char* name)
	{
		return XName(ns, name);
	}

} // namespace XML