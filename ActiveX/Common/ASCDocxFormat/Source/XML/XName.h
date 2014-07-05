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
#ifndef XML_XNAME_INCLUDE_H_
#define XML_XNAME_INCLUDE_H_

#include <string>
#include "property.h"
#include "nullable_property.h"
#include "XNamespace.h"

namespace XML
{
	class XName
	{
	public:
		XName();
		XName(const char* name);
		XName(const std::string& name);
		XName(const XNamespace& ns, const std::string& name);

	public:
		const bool Equal(const XName& rhs) const;
		const bool operator ==(const XName& rhs) const;

		XName const* const	operator->() const	{return this;}
		XName*							operator->()				{return this;}

	public:
		const std::string ToString() const;
		const std::wstring ToWString() const;
		virtual void SaveToStringList(std::list<std::string>& strList)const;
		virtual void SaveToWStringList(std::list<std::wstring>& strList)const;

	public:
		nullable_property<XNamespace>		Ns;
		property<std::string>				Name;
	};

	const XName operator +(const XNamespace& ns, const std::string& name);
	const XName operator +(const XNamespace& ns, const char* name);
} 

#endif // XML_XNAME_INCLUDE_H_