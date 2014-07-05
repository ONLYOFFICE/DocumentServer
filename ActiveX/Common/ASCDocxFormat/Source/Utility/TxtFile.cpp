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


#include "TxtFile.h"

#include <streambuf>

#include "Encoding.h"
#include "Utility.h"
#include "Exception/log_runtime_error.h"
#include "codecvt.h"

static const std::string BadSymbols = "\x0A\x0B\x0C\x0D\x0E\x0F\x10\x11\x12\x13\x14\x15\x16\x17\x18\x19";

TxtFile::TxtFile(const OOX::CPath& path) : m_path(path)
{

}

const std::list<std::string> TxtFile::readAnsi() const
{
	std::ifstream file(m_path.GetFilename());
	if (file.bad())
		throw log_runtime_error("can't open text file");

	std::list<std::string> result;
	while (!file.eof() && EOF != file.peek() )
	{
		std::string str;
		std::getline(file, str);

		size_t pos = str.find_first_of(BadSymbols);
		while(pos != str.npos)
		{
			str.erase(pos, 1);
			pos = str.find_first_of(BadSymbols, pos);
		}


		result.push_back(str);
	}
	return result;
}


const std::list<std::wstring> TxtFile::readUnicode() const
{
	std::wifstream file(m_path.GetFilename(), std::ios_base::binary);
	if (file.bad())
		throw log_runtime_error("can't open text file");

	file.imbue(std::locale(std::locale(), new ucs2_conversion()));
	std::list<std::wstring> result;

	while (!file.eof())
	{
		std::wstring str;
		file.ignore();
		std::getline(file, str, L'\x0D');
		result.push_back(str);
	}
	return result;
}


const std::list<std::wstring> TxtFile::readUnicodeWithOutBOM() const
{
	std::wifstream file(m_path.GetFilename(), std::ios_base::binary);
	if (file.bad())
		throw log_runtime_error("can't open text file");

	file.imbue(std::locale(std::locale(), new ucs2_conversion()));
	std::list<std::wstring> result;

	while (!file.eof())
	{
		std::wstring str;
		std::getline(file, str, L'\x0D');
		file.ignore();
		result.push_back(str);
	}
	return result;
}


const std::list<std::wstring> TxtFile::readBigEndian() const
{
	std::wifstream file(m_path.GetFilename(), std::ios_base::binary);
	if (file.bad())
		throw log_runtime_error("can't open text file");

	file.imbue(std::locale(std::locale(), new ube_conversion()));
	std::list<std::wstring> result;

	while (!file.eof())
	{
		std::wstring str;
		file.ignore();
		std::getline(file, str, L'\x0D');
		result.push_back(str);
	}
	return result;
}


const std::list<std::string> TxtFile::readUtf8() const
{
	std::ifstream file(m_path.GetFilename());
	if (file.bad())
		throw log_runtime_error("can't open text file");

	std::list<std::string> result;
	file.ignore(3);

	while (!file.eof())
	{
		std::string str;
		std::getline(file, str);
		result.push_back(str);
	}
	return result;
}


const std::list<std::string> TxtFile::readUtf8withoutPref() const
{
	std::ifstream file(m_path.GetFilename());
	if (file.bad())
		throw log_runtime_error("can't open text file");

	std::list<std::string> result;

	while (!file.eof())
	{
		std::string str;
		std::getline(file, str);
		result.push_back(str);
	}
	return result;
}


void TxtFile::writeAnsi(const std::list<std::string>& content) const
{
	setAnsiStamp();
	std::ofstream file(m_path.GetFilename());

	if (file.bad())
		throw log_runtime_error("can't create text file");

	for (std::list<std::string>::const_iterator iter = content.begin(); iter != content.end(); ++iter)	
	{
		file << (*iter) << std::endl;
	}
}

void TxtFile::writeUnicode(const std::list<std::wstring>& content) const
{
	setUnicodeStamp();
	std::wofstream file(m_path.GetFilename(), std::ios_base::binary | std::ios_base::app);

	if (file.bad())
		throw log_runtime_error("can't create text file");

	file.imbue(std::locale(std::locale(), new ucs2_conversion()));

	for (std::list<std::wstring>::const_iterator iter = content.begin(); iter != content.end(); ++iter)	
	{
		file << (*iter) << L'\x0D' << L'\x0A';
	}
}

void TxtFile::writeBigEndian(const std::list<std::wstring>& content) const
{
	setBigEndianStamp();
	std::wofstream file(m_path.GetFilename(), std::ios_base::binary | std::ios_base::app);

	if (file.bad())
		throw log_runtime_error("can't create text file");

	file.imbue(std::locale(std::locale(), new ube_conversion()));
	
	for (std::list<std::wstring>::const_iterator iter = content.begin(); iter != content.end(); ++iter)	
	{
		file << (*iter) << L'\x0D' << L'\x0A';
	}
}

void TxtFile::writeUtf8(const std::list<std::string>& content) const
{
	setUtf8Stamp();
	std::ofstream file(m_path.GetFilename(), std::ios_base::app);

	if (file.bad())
		throw log_runtime_error("can't create text file");

	for (std::list<std::string>::const_iterator iter = content.begin(); iter != content.end(); ++iter)	
	{
		file << (*iter) << std::endl;
	}
}


void TxtFile::writeUtf8withoutPref(const std::list<std::string>& content) const
{
	std::ofstream file(m_path.GetFilename());

	if (file.bad())
		throw log_runtime_error("can't create text file");

	for (std::list<std::string>::const_iterator iter = content.begin(); iter != content.end(); ++iter)	
	{
		file << (*iter) << std::endl;
	}
}

const bool TxtFile::isAnsi() const
{
	return true;
}

const bool TxtFile::isUnicode() const
{
	std::ifstream file(m_path.GetFilename(), std::ios_base::binary);
	if (file.bad())
		throw log_runtime_error("can't open text file");

	char symbol;

	file >> symbol;
	if (symbol != '\xFF')
		return false;

	file >> symbol;
	if (symbol != '\xFE')
		return false;

	return true;
}

const bool TxtFile::isUnicodeWithOutBOM() const
{
	std::ifstream file(m_path.GetFilename(), std::ios_base::binary);
	if (file.bad())
		throw log_runtime_error("can't open text file");

	std::string str;
	std::getline(file, str, '\x0A');
	bool bUnicode = (str.find('\x0') != str.npos);

	return bUnicode;
}

const bool TxtFile::isBigEndian() const
{
	std::ifstream file(m_path.GetFilename(), std::ios_base::binary);
	if (file.bad())
		throw log_runtime_error("can't open text file");

	char symbol;

	file >> symbol;
	if (symbol != '\xFE')
		return false;

	file >> symbol;
	if (symbol != '\xFF')
		return false;

	return true;
}

const bool TxtFile::isUtf8() const
{
	std::ifstream file(m_path.GetFilename(), std::ios_base::binary);
	if (file.bad())
		throw log_runtime_error("can't open text file");

	char symbol;

	file >> symbol;
	if (symbol != '\xEF')
		return false;

	file >> symbol;
	if (symbol != '\xBB')
		return false;

	file >> symbol;
	if (symbol != '\xBF')
		return false;

	return true;
}

void TxtFile::setAnsiStamp() const
{
}

void TxtFile::setUnicodeStamp() const
{
	std::wofstream file(m_path.GetFilename(), std::ios_base::binary);
	file << '\xFF' << '\xFE';
}

void TxtFile::setBigEndianStamp() const
{
	std::wofstream file(m_path.GetFilename(), std::ios_base::binary);
	file << '\xFE' << '\xFF';
}

void TxtFile::setUtf8Stamp() const
{
	std::wofstream file(m_path.GetFilename(), std::ios_base::binary);
	file << '\xEF' << '\xBB' << '\xBF';
}