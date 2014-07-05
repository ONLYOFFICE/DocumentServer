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
#ifndef UTILITY_CODECVT_INCLUDE_H_
#define UTILITY_CODECVT_INCLUDE_H_


#include <locale>



class ucs2_conversion : public std::codecvt<wchar_t, char, std::mbstate_t>
{
protected:
	result do_in(std::mbstate_t& state,
				 const char* from, const char* from_end, const char*& from_next,
				 wchar_t* to, wchar_t* to_limit, wchar_t*& to_next) const;

	result do_out(std::mbstate_t& state,
				  const wchar_t* from, const wchar_t* from_end, const wchar_t*& from_next,
				  char* to, char* to_limit, char*& to_next) const;

	bool do_always_noconv() const throw() { return false; }
	int  do_encoding() const throw() { return 2; }
};


class ube_conversion : public std::codecvt<wchar_t, char, std::mbstate_t>
{
protected:
	result do_in(std::mbstate_t& state,
				 const char* from, const char* from_end, const char*& from_next,
				 wchar_t* to, wchar_t* to_limit, wchar_t*& to_next) const;

	result do_out(std::mbstate_t& state,
				  const wchar_t* from, const wchar_t* from_end, const wchar_t*& from_next,
				  char* to, char* to_limit, char*& to_next) const;

	bool do_always_noconv() const throw() { return false; }
	int  do_encoding() const throw() { return 2; }
};



class utf8_conversion : public std::codecvt<wchar_t, char, std::mbstate_t>
{
protected:
	result do_in(std::mbstate_t& state,
				 const char* from, const char* from_end, const char*& from_next,
				 wchar_t* to, wchar_t* to_limit, wchar_t*& to_next) const;

	result in(std::mbstate_t& state,
				 const char* from, const char* from_end, const char*& from_next,
				 wchar_t* to, wchar_t* to_limit, wchar_t*& to_next) const;

	result do_out(std::mbstate_t& state,
				  const wchar_t* from, const wchar_t* from_end, const wchar_t*& from_next,
				  char* to, char* to_limit, char*& to_next) const;

	result out(std::mbstate_t& state,
				  const wchar_t* from, const wchar_t* from_end, const wchar_t*& from_next,
				  char* to, char* to_limit, char*& to_next) const;

	bool do_always_noconv() const throw() { return false; }
	int  do_encoding() const throw() { return 2; }

private:
	const unsigned char take_6_bits(const unsigned int value, const size_t right_position) const;
	const size_t most_signifant_bit_position(const unsigned int value) const;
};

#endif // UTILITY_CODECVT_INCLUDE_H_