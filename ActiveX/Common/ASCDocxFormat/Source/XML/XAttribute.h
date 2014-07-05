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
#ifndef XML_XATTRIBUTE_INCLUDE_H_
#define XML_XATTRIBUTE_INNLUDE_H_

#include "Private/XPointer.h"
#include "Private/Attribute.h"
#include "Private/XString.h"

namespace XML
{
	namespace Private
	{
		class NullAttribute;
	}

	class XAttribute : public Private::XPointer<Private::Attribute>
	{
	public:
		XAttribute();

		template<typename Type>
		XAttribute(const XName& name, const Type& value)
			: base(new Private::Attribute(name, ToString(value)))
		{
		}

		template<typename Type>
		XAttribute(const XName& name, const nullable__<Type>& value)
			: base(value.is_init() ? new Private::Attribute(name, ToString(value)) : 0)
		{
		}

		template<typename Type, class S, class G>
		XAttribute(const XName& name, const nullable_property<Type, S, G>& value)
			: base(value.is_init() ? new Private::Attribute(name, ToString(value)) : 0)
		{
		}

	protected:
		XAttribute(Private::NullAttribute);

	public:
		virtual const bool exist() const;
		virtual const Private::XString value() const;
		virtual const Private::XString get_value_or(const std::string& def)const;
		const bool operator ==(const XAttribute& rhs) const;
		const bool operator <(const XAttribute& rhs) const;

	};
} 

#endif // XML_XATTRIBUTE_INCLUDE_H_