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


#include "LogDetails.h"
#include "DateTime.h"

namespace Details
{
	const std::string Log::s_dtPattern("%hh:%mm:%ss");


	Log::Log(const std::string& log_file, const std::string& err_file)
#ifdef _DEBUG
		: m_log(log_file.c_str()),
			m_err(err_file.c_str())
#endif
	{
	}


	Log::~Log()
	{
#ifdef _DEBUG
		m_log << std::flush;
		m_err << std::flush;
		m_log.close();
		m_err.close();
#endif
	}


	void Log::event(const std::string& message)
	{
		toLog(" EVENT: " + message);
	}


	void Log::event(const std::wstring& message)
	{
		toLog(L" EVENT: " + message);
	}


	void Log::message(const std::string& message)
	{
		toLog(" MESSAGE: " + message);
	}


	void Log::message(const std::wstring& message)
	{
		toLog(L" MESSAGE: " + message);
	}


	void Log::warning(const std::string& message)
	{
		toLog(" WARNING: " + message);
	}


	void Log::warning(const std::wstring& message)
	{
		toLog(L" WARNING: " + message);
	}


	void Log::error(const std::string& message)
	{
#ifdef _DEBUG
		DateTime dt;
		m_log << std::flush;
		m_err << dt.ToString(s_dtPattern).c_str() << " ERROR: " << message.c_str() << std::endl;
		std::cout << dt.ToString(s_dtPattern) << " ERROR: " << message << std::endl;
#endif
	}


	void Log::error(const std::wstring& message)
	{
#ifdef _DEBUG
		DateTime dt;
		m_log << std::flush;
		m_err << dt.ToString(s_dtPattern).c_str() << L" ERROR: " << message << std::endl;
		std::wcout << dt.ToString(s_dtPattern).c_str() << L" ERROR: " << message << std::endl;
#endif
	}


	void Log::toLog(const std::string& str)
	{
#ifdef _DEBUG
		DateTime dt;
		m_log << dt.ToString(s_dtPattern).c_str() << str.c_str() << "\n";
		std::cout << dt.ToString(s_dtPattern) << str << std::endl;
#endif
	}


	void Log::toLog(const std::wstring& str)
	{
#ifdef _DEBUG
		DateTime dt;
		m_log << dt.ToString(s_dtPattern).c_str() << str << "\n";
		std::wcout << dt.ToString(s_dtPattern).c_str() << str << std::endl;
#endif
	}

} // namespace Details