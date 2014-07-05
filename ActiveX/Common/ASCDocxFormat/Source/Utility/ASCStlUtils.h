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

#ifndef ASC_STL_UTILS_INCLUDE_H_
#define ASC_STL_UTILS_INCLUDE_H_

#include <vector>
#include <string>
#include <iosfwd>
#include <sstream>

namespace StlUtils
{
	static inline std::wstring ReplaceString(std::wstring subject, const std::wstring& search, const std::wstring& replace) 
	{
		size_t pos = 0;

		while ((pos = subject.find(search, pos)) != std::string::npos)
		{
			subject.replace(pos, search.length(), replace);
			pos += replace.length();
		}

		return subject;
	}

	static inline std::string ReplaceString(std::string subject, const std::string& search, const std::string& replace) 
	{
		size_t pos = 0;

		while ((pos = subject.find(search, pos)) != std::string::npos)
		{
			subject.replace(pos, search.length(), replace);
			pos += replace.length();
		}

		return subject;
	}

	static inline std::vector<std::string>& Split(const std::string& s, char delim, std::vector<std::string>& elems)
	{
		std::stringstream ss(s);
		std::string item;

		while (std::getline(ss, item, delim)) 
			elems.push_back(item);

		return elems;
	}

	static inline bool SplitStrings(std::vector<std::string>& elems, const std::string& s, char delim)
	{
		StlUtils::Split(s, delim, elems);
		return (0 != elems.size());
	}

	
	static inline std::wstring IntToWideString(int value, int radix = 10)
	{
		wchar_t strValue[256];
		_itow_s(value, strValue, 256, radix);
		return std::wstring(strValue);
	}

	static inline std::wstring DoubleToWideString(double value)
	{
		wchar_t strValue[256];
		swprintf_s(strValue, 256, L"%f", value);
		return std::wstring(strValue);
	}

	static inline std::string IntToString(int value, int radix = 10)
	{
		char strValue[256];
		_itoa_s(value, strValue, 256, radix);
		return std::string(strValue);
	}

	static inline std::string DoubleToString(double value)
	{
		char strValue[256];
		sprintf_s(strValue, 256, "%f", value);
		return std::string(strValue);
	}

	static int ToInteger(const std::string& strValue)
	{
		return atoi(strValue.c_str());
	}

	static int ToInteger(const std::wstring& strValue)
	{
		return _wtoi(strValue.c_str());
	}

	static double ToDouble(const std::string& strValue)
	{
		return atof(strValue.c_str());
	}

	static double ToDouble(const std::wstring& strValue)
	{
		return _wtof(strValue.c_str());
	}
}

#endif // ASC_STL_UTILS_INCLUDE_H_