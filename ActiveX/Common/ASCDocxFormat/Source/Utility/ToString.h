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
#ifndef UTILITY_TO_STRING_INCLUDE_H_
#define UTILITY_TO_STRING_INCLUDE_H_

#include <string>
#include <wchar.h>

const std::string ToString(const bool value);
const std::string ToString(const int value);
const std::string ToString(const size_t value);
const std::string ToString(const double value);
const std::string ToString(const std::string& value);
const std::string ToString(const char* value);
const std::string ToString(const std::wstring& value);
const std::string ToString(const wchar_t* value);

const std::wstring ToWString(const bool value);
const std::wstring ToWString(const int value);
const std::wstring ToWString(const size_t value);
const std::wstring ToWString(const double value);
const std::wstring ToWString(const std::string& value);
const std::wstring ToWString(const char* value);
const std::wstring ToWString(const std::wstring& value);
const std::wstring ToWString(const wchar_t* value);

template<class T> const std::string ToString(const T& value) {return value.ToString();}
template<class T> const std::wstring ToWString(const T& value) {return value.ToWString();}


const std::string ToUpper(const char* value);
const std::string ToUpper(const std::string& value);
const std::wstring ToUpper(const wchar_t* value);
const std::wstring ToUpper(const std::wstring& value);

const std::string ToLower(const char* value);
const std::string ToLower(std::string value);
const std::wstring ToLower(const wchar_t* value);
const std::wstring ToLower(std::wstring value);

#endif // UTILITY_TO_STRING_INCLUDE_H_