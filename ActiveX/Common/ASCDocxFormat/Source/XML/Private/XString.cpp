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


#include "XString.h"
#include "Encoding.h"

namespace XML
{
	namespace Private
	{

		XString::XString()
		{
		}


		XString::XString(const char* value)
			: m_value(value)
		{
		}


		XString::XString(const std::string& value)
			: m_value(value)
		{
		}


		const bool XString::operator ==(const XString& rhs) const
		{
			return m_value == rhs.m_value;
		}


		const bool XString::operator !=(const XString& rhs) const
		{
			return m_value != rhs.m_value;
		}


		const bool XString::operator ==(const std::string& rhs) const
		{
			return m_value.get_value_or("") == rhs;
		}


		const bool XString::operator !=(const std::string& rhs) const
		{
			return m_value.get_value_or("") != rhs;
		}


		const bool XString::operator ==(const char* rhs) const
		{
			return m_value.get_value_or("") == rhs;
		}


		const bool XString::operator !=(const char* rhs) const
		{
			return m_value.get_value_or("") != rhs;
		}


		const bool XString::ToBool() const
		{
			if (!m_value.is_init())
				return false;
			if (m_value == "true" || m_value == "t" || m_value == "1")
				return true;
			return false;
		}


		const int XString::ToInt() const
		{
			try
			{
				std::string str = m_value.get_value_or("0");
				return atoi(str.c_str());
			}
			catch(...)
			{
			}
			return 0;
		}


		const size_t XString::ToSizet() const
		{
			try
			{
				std::string str = m_value.get_value_or("0");
				return (size_t)atoi(str.c_str());
			}
			catch(...)
			{
			}
			return 0;
		}


		const double XString::ToDouble() const
		{
			std::string str = m_value.get_value_or("0");
			double d = 0;
			try
			{
				sscanf(str.c_str(), "%lf", &d);
			}
			catch(...)
			{
				d = 0;
			}
			return d;
		}


		const std::string XString::ToString() const
		{
			return m_value.get_value_or_default();
		}


		const std::wstring XString::ToWString() const
		{
			return Encoding::utf82unicode(m_value.get_value_or_default());
		}

		XString::operator const bool() const
		{
			return ToBool();
		}


		XString::operator const int() const
		{
			return ToInt();
		}


		XString::operator const size_t() const
		{
			return ToSizet();
		}


		XString::operator const double() const
		{
			return ToDouble();
		}


		XString::operator const std::string() const
		{
			return ToString();
		}


		XString::operator const std::wstring() const
		{
			return ToWString();
		}

	} 
} // namespace XML