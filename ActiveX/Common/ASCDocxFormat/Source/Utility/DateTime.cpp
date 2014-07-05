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


#include "DateTime.h"
#include "ASCStlUtils.h"

DateTime::DateTime()
{
	time_t now;
	tm local;
	time(&now);
	localtime_s(&local, &now);

	m_year = local.tm_year + 1900;
	m_month = local.tm_mon + 1;
	m_day = local.tm_mday;
	m_hour = local.tm_hour;
	m_minute = local.tm_min;
	m_second = local.tm_sec;
	m_millisecond = 0;
}

DateTime::DateTime(const std::string& value, const std::string& pattern)	
	:
	m_year				(ParseValue(value, pattern, "%YYYY")),
	m_month				(ParseValue(value, pattern, "%MM")),
	m_day					(ParseValue(value, pattern, "%DD")),
	m_hour				(ParseValue(value, pattern, "%hh")),
	m_minute			(ParseValue(value, pattern, "%mm")),
	m_second			(ParseValue(value, pattern, "%ss")),
	m_millisecond	(ParseValue(value, pattern, "%ms"))
{
}


const std::string DateTime::ToString(const std::string& pattern) const
{
	std::string result = pattern;

	char buffer[12];

	sprintf_s(buffer, 12, "%04d", m_year);
	StlUtils::ReplaceString(result, "%YYYY",	std::string(buffer));	

	sprintf_s(buffer, 12, "%02d", m_month);	
	StlUtils::ReplaceString(result, "%MM",	std::string(buffer));	

	sprintf_s(buffer, 12, "%02d", m_day);	
	StlUtils::ReplaceString(result, "%DD",	std::string(buffer));		

	sprintf_s(buffer, 12, "%02d", m_hour);	
	StlUtils::ReplaceString(result, "%hh",	std::string(buffer));	

	sprintf_s(buffer, 12, "%02d", m_minute);	
	StlUtils::ReplaceString(result, "%mm",	std::string(buffer));		

	sprintf_s(buffer, 12, "%02d", m_second);	
	StlUtils::ReplaceString(result, "%ss",	std::string(buffer));		

	sprintf_s(buffer, 12, "%02d", m_millisecond);	
	StlUtils::ReplaceString(result, "%ms",	std::string(buffer));	

	return result;
}

const DateTime DateTime::Parse(const std::string& value, const std::string& pattern)
{
	return DateTime(value, pattern);
}

const int DateTime::ParseValue(const std::string& value, const std::string& pattern, const std::string& element)
{
	const int pos = pattern.find(element);
	if (pos != std::string::npos)
	{
		const int sepCount = std::count(pattern.begin(), pattern.begin() + pos, '%');
		const std::string numeric = value.substr(pos - sepCount , element.size() - 1);

		return StlUtils::ToInteger(numeric);
	}

	return 0;
}