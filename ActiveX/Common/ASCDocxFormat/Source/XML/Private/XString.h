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
#ifndef XML_PRIVATE_XSTRING_INCLUDE_H_
#define XML_PRIVATE_XSTRING_INCLUDE_H_

#include <string>
#include "nullable.h"
#include "property.h"
#include "nullable_property.h"
#include "Parse.h"

#include "../../../../../Common/DocxFormat/Source/SystemUtility/SystemUtility.h"

namespace XML
{
	namespace Private
	{
		class XString
		{
		public:
			XString();
			XString(const char* value);
			XString(const std::string& value);

		public:
			const bool operator ==(const XString& rhs) const;
			const bool operator !=(const XString& rhs) const;
			const bool operator ==(const std::string& rhs) const;
			const bool operator !=(const std::string& rhs) const;
			const bool operator ==(const char* rhs) const;
			const bool operator !=(const char* rhs) const;

		public:
			const bool ToBool() const;
			const int ToInt() const;
			const size_t ToSizet() const;
			const double ToDouble() const;
			const std::string ToString() const;
			const std::wstring ToWString() const;

			operator const bool() const;
			operator const int() const;
			operator const size_t() const;
			operator const double() const;
			operator const std::string() const;
			operator const std::wstring() const;

			template<typename T> 
			operator const nullable__<T>() const 
			{
				if (m_value.is_init())
					return Parse<T>(m_value);
				return nullable__<T>();
			}	
			
			template<typename T, class S, class G> 
			operator const nullable_property<T, S, G>() const 
			{
				if (m_value.is_init())
					return Parse<T>(m_value);
				return nullable_property<T, S, G>();
			}

		public:
			template<typename T> const bool operator ==(const T value) const
			{
				return static_cast<T>(*this) == value;
			}

			template<typename T> const bool operator !=(const T value) const
			{
				return static_cast<T>(*this) != value;
			}

			template<typename T> const bool operator > (const T value) const
			{
				return static_cast<T>(*this) > value;
			}

			template<typename T> const bool operator < (const T value) const
			{
				return static_cast<T>(*this) < value;
			}

			template<typename T> const bool operator >=(const T value) const
			{
				return static_cast<T>(*this) >= value;
			}

			template<typename T> const bool operator <=(const T value) const
			{
				return static_cast<T>(*this) <= value;
			}

			template<typename T, class S, class G> const bool operator ==(const property<T, S, G> value) const
			{
				return static_cast<T>(*this) == *value;
			}

			template<typename T, class S, class G> const bool operator !=(const property<T, S, G> value) const
			{
				return static_cast<T>(*this) != *vlaue;
			}

			template<typename T, class S, class G> const bool operator > (const property<T, S, G> value) const
			{
				return static_cast<T>(*this) > *value;
			}

			template<typename T, class S, class G> const bool operator < (const property<T, S, G> value) const
			{
				return static_cast<T>(*this) < *value;
			}

			template<typename T, class S, class G> const bool operator >=(const property<T, S, G> value) const
			{
				return static_cast<T>(*this) >= *value;
			}

			template<typename T, class S, class G> const bool operator <=(const property<T, S, G> value) const
			{
				return static_cast<T>(*this) <= *value;
			}

			template<typename T> const bool operator ==(const nullable__<T> value) const
			{
				return static_cast<T>(*this) == *value;
			}

			template<typename T> const bool operator !=(const nullable__<T> value) const
			{
				return static_cast<T>(*this) != *value;
			}

			template<typename T> const bool operator > (const nullable__<T> value) const
			{
				return static_cast<T>(*this) > *value;
			}

			template<typename T> const bool operator < (const nullable__<T> value) const
			{
				return static_cast<T>(*this) < *value;
			}

			template<typename T> const bool operator >=(const nullable__<T> value) const
			{
				return static_cast<T>(*this) >= *value;
			}

			template<typename T> const bool operator <=(const nullable__<T> value) const
			{
				return static_cast<T>(*this) <= *value;
			}

			template<typename T, class S, class G> const bool operator ==(const nullable_property<T, S, G> value) const
			{
				return static_cast<T>(*this) == *value;
			}

			template<typename T, class S, class G> const bool operator !=(const nullable_property<T, S, G> value) const
			{
				return static_cast<T>(*this) != *vlaue;
			}

			template<typename T, class S, class G> const bool operator > (const nullable_property<T, S, G> value) const
			{
				return static_cast<T>(*this) > *value;
			}

			template<typename T, class S, class G> const bool operator < (const nullable_property<T, S, G> value) const
			{
				return static_cast<T>(*this) < *value;
			}

			template<typename T, class S, class G> const bool operator >=(const nullable_property<T, S, G> value) const
			{
				return static_cast<T>(*this) >= *value;
			}

			template<typename T, class S, class G> const bool operator <=(const nullable_property<T, S, G> value) const
			{
				return static_cast<T>(*this) <= *value;
			}

		private:
			nullable__<std::string> m_value;
		};
	} 
} 


template<typename T>
const nullable__<T>& nullable_setter(nullable__<T>& lhs, const XML::Private::XString& rhs)
{
	return ::nullable_setter(lhs, nullable__<T>(rhs));
}

template<typename T, class S, class G>
const property<T, S, G>& property_setter(property<T, S, G>& lhs, const XML::Private::XString& rhs)
{
	return ::property_setter(lhs, T(rhs));
}

template<typename T, class S, class G>
const nullable_property<T, S, G>& nullable_property_setter(nullable_property<T, S, G>& lhs, const XML::Private::XString& rhs)
{
	return ::nullable_property_setter(lhs, nullable_property<T, S, G>(rhs));
}

#endif // XML_PRIVATE_XSTRING_INCLUDE_H_