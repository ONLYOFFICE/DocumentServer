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
 #include "codecvt.h"

using namespace std;


ucs2_conversion::result
ucs2_conversion::do_in(mbstate_t&,
					   const char*  from, const char* from_end, const char*& from_next,
					   wchar_t* to, wchar_t* to_limit, wchar_t*& to_next) const
{
	const int max_input = (from_end - from) & ~1;
	const int max_output = (to_limit - to);
	int count = min(max_input / 2, max_output); 

	from_next = from;
	to_next = to;

	for (;count--; from_next += 2, ++to_next) 
	{
		unsigned char c1 = *from_next;
		unsigned char c2 = *(from_next + 1);
		*to_next = c1 | c2 << 8;
	}

	if (to_next == to && from_next == from_end - 1) 
		return partial;
	return ok; 
}


ucs2_conversion::result
ucs2_conversion::do_out(mbstate_t&,
				  const wchar_t* from, const wchar_t* from_end, const wchar_t*& from_next,
				  char* to, char* to_limit, char*& to_next) const
{
	const int max_input = (from_end - from);
	const int max_output = (to_limit - to) & ~1;
	int count = min(max_input, max_output / 2);	

	from_next = from;
	to_next = to;

	for (;count--; ++from_next, to_next += 2)
	{
		*(to_next + 0) = *from_next & 0xFF;
		*(to_next + 1) = *from_next >> 8 & 0xFF;
	}
	return ok;
}



ube_conversion::result
ube_conversion::do_in(mbstate_t&,
					   const char*  from, const char* from_end, const char*& from_next,
					   wchar_t* to, wchar_t* to_limit, wchar_t*& to_next) const
{
	const int max_input = (from_end - from) & ~1;
	const int max_output = (to_limit - to);
	int count = min(max_input / 2, max_output); 

	from_next = from;
	to_next = to;

	for (;count--; from_next += 2, ++to_next) 
	{
		unsigned char c1 = *from_next;
		unsigned char c2 = *(from_next + 1);
		*to_next = c2 | c1 << 8;
	}

	if (to_next == to && from_next == from_end - 1) 
		return partial;
	return ok; 
}

ube_conversion::result
ube_conversion::do_out(mbstate_t&,
				  const wchar_t* from, const wchar_t* from_end, const wchar_t*& from_next,
				  char* to, char* to_limit, char*& to_next) const
{
	const int max_input = (from_end - from);
	const int max_output = (to_limit - to) & ~1;
	int count = min(max_input, max_output / 2);	

	from_next = from;
	to_next = to;

	for (;count--; ++from_next, to_next += 2)
	{
		*(to_next + 1) = *from_next & 0xFF;
		*(to_next + 0) = *from_next >> 8 & 0xFF;
	}
	return ok;
}


utf8_conversion::result
utf8_conversion::do_in(mbstate_t&,
					   const char*  from, const char* from_end, const char*& from_next,
					   wchar_t* to, wchar_t* to_limit, wchar_t*& to_next) const
{
	from_next = from;
	to_next = to;

	for(; to_next < to_limit && from_next < from_end; ++to_next) 
	{
		if (static_cast<unsigned char>(*from_next) < 0x80)
		{
			*to_next = static_cast<unsigned char>(*from_next++);
		}
		else
		{
			const int zero_bit_pos = most_signifant_bit_position(~*from_next);
			int extra_bytes  = 7 - zero_bit_pos;

			if (from_end - from_next < extra_bytes + 1) 
				return partial;

			*to_next = static_cast<unsigned char>(*from_next++) & ((1 << zero_bit_pos - 1) - 1);
			for (;extra_bytes--; ++from_next) 
			{
				*to_next = *to_next << 6  |  static_cast<unsigned char>(*from_next) & 63;
			}
		}
	}	
	return ok;
}




utf8_conversion::result
utf8_conversion::do_out(mbstate_t&,
				  const wchar_t* from, const wchar_t* from_end, const wchar_t*& from_next,
				  char* to, char* to_limit, char*& to_next) const
{
	from_next = from;
	to_next = to;

	for (;from_next < from_end; ++from_next) 
	{
		const unsigned symbol = *from_next;

		if (symbol < 0x7F) 
		{
			if (to_next < to_limit)
				*to_next++ = static_cast<unsigned char>(symbol);
			else
				return ok;
		}
		else
		{
			const size_t msb_pos = most_signifant_bit_position(symbol);
			int extra_bytes = msb_pos / 6;

			if (to_limit - to_next >= extra_bytes + 1) 
			{
				*to_next = static_cast<unsigned char>(0xFF80 >> extra_bytes);
				*to_next++ |= take_6_bits(symbol, extra_bytes * 6);

				for(;extra_bytes--;)
					*to_next++ = 0x80 | take_6_bits(symbol, extra_bytes * 6);
			}
			else
			{
				return ok;
			}
		}
	}
	return ok;
}


const unsigned char 
utf8_conversion::take_6_bits(const int unsigned value, const size_t right_position) const
{
	return (value >> right_position) & 63;
}


const size_t 
utf8_conversion::most_signifant_bit_position(const unsigned int value) const
{
	size_t result = 0;
	size_t half = 16;

	for(; half > 0; half >>= 1) 
	{
		if (1u << (result + half) <= value )
			result += half;
	}	
	return result + 1;
}
