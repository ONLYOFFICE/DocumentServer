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
 
#include "precompiled_utility.h"


#include "Encoding.h"
#include <windows.h>
#include "Utility.h"

const std::string Encoding::ansi2utf8(const std::string& line)
{
	return wstring2string(string2wstring(line, CP_ACP), CP_UTF8);
}

const std::string Encoding::cp2utf8(const std::string& line, const unsigned int codePage)
{
	return wstring2string(string2wstring(line, codePage), CP_UTF8);
}

const std::wstring Encoding::ansi2unicode(const std::string& line)
{
	return string2wstring(line, CP_ACP);
}

const std::wstring Encoding::cp2unicode(const std::string& line, const unsigned int codePage)
{
	return string2wstring(line, codePage);
}

const std::string Encoding::utf82ansi(const std::string& line)
{
	return wstring2string(string2wstring(line, CP_UTF8), CP_ACP);
}

const std::wstring Encoding::utf82unicode(const std::string& line)
{
	return string2wstring(line, CP_UTF8);
}

const std::string Encoding::unicode2ansi(const std::wstring& line)
{
	return wstring2string(line, CP_ACP);
}

const std::string Encoding::unicode2utf8(const std::wstring& line)
{
	return wstring2string(line, CP_UTF8);
}

const std::string Encoding::wstring2string(const std::wstring& sLine, const unsigned int codePage)
{
	const int nSize = WideCharToMultiByte(codePage, 0, sLine.c_str(), sLine.length(), NULL, 0, NULL, NULL);
	char *sTemp = new char[nSize];
	if (!sTemp)
		return std::string();

	int size = WideCharToMultiByte(codePage, 0, sLine.c_str(), sLine.length(), sTemp, nSize, NULL, NULL);

	std::string sResult(sTemp, size);
	delete []sTemp;

	return sResult;
}

const std::wstring Encoding::string2wstring(const std::string& sline, const unsigned int codePage)
{
	const int nSize = MultiByteToWideChar(codePage, 0, sline.c_str(), sline.size(), NULL, 0);

	wchar_t *sTemp = new wchar_t[nSize];
	if (!sTemp)
		return std::wstring();

	int size = MultiByteToWideChar(codePage, 0, sline.c_str(), sline.size(), sTemp, nSize);

	std::wstring sResult(sTemp, size);
	delete []sTemp;

	return sResult;
}