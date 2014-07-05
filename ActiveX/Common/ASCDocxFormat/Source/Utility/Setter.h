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
#ifndef UTILITY_SETTER_INCLUDE_H_
#define UTILITY_SETTER_INCLUDE_H_

#include <stdexcept>
#include <algorithm>
#include <set>

#include "CallTraits.h"

namespace setter
{
	template<typename Type>	class base_setter
	{
	protected:
		typedef typename NSCallTraits<Type>::param_type Parameter;

	public:
		void operator()(Type& _value, Parameter value)
		{
			
		}
	};

	class none
	{
	public:
		template<typename T, typename E>
		void operator()(T, E)
		{
		}
	};

	template<typename Type>
	class simple : private base_setter<Type>
	{
	public:
		void operator()(Type& _value, Parameter value)
	    {
			_value = value;
		}
	};

	class read_only
	{
	public:
		template<typename T, typename E>
		void operator()(T, E)
		{
			
		}
	};

	template<typename Type>
	class only_positive : private base_setter<Type>
	{
	public:
		void operator()(Type& _value, Parameter value)
		{
			_value = value < static_cast<Type>(0) ? static_cast<Type>(0) : value;
		}
	};


	template<typename Type, int min_value = 0, int max_value = min_value>
	class between : private base_setter<Type>
	{
	public:
		void operator()(Type& _value, Parameter value)
		{
			if (value < min_value)
				_value = min_value;
			else if (max_value < value)
				_value = max_value;
			else
				_value = value;
		}
	};


	template<typename Type, int min_value = 0, int max_value = min_value>
	class between_throw : private base_setter<Type>
	{
	public:
		void operator()(Type& _value, Parameter value)
		{
			if (value < min_value)
				throw std::range_error("between error");
			else if (max_value < value)
				throw std::range_error("between error");
			else
				_value = value;
		}
	};


	template<typename Type>
	class interval : private base_setter<Type>
	{
	public:
		interval(Parameter min, Parameter max)
			:	_min(min),
				_max(max)
		{
			if (_max < _min)
				std::swap(_min, _max);
		}

		void operator()(Type& _value, Parameter value)
		{
			if (value < _min)
				_value = _min;	
			else if (_max < value)
				_value = _max;
			else
				_value = value;
		}

	private:
		Type _min;
		Type _max;
	};


	template<typename Type>
	class interval_throw : private base_setter<Type>
	{
	public:
		interval_throw(Parameter min, Parameter max)
			:	_min(min),
				_max(max)
		{
			if (_max < _min)
				std::swap(_min, _max);
		}

		void operator()(Type& _value, Parameter value)
		{
			if (value < _min)
				throw std::range_error("interval error");
			else if (_max < value)
				throw std::range_error("interval error");
			else
				_value = value;
		}

	private:
		Type _min;
		Type _max;
	};


	template<typename Type>
	class from : private base_setter<Type>
	{
	protected:
		void add(Parameter value)
		{
			_list.insert(value);
		}

	private:
		virtual const Type no_find() const = 0;

	public:
		void operator()(Type& _value, Parameter value)
		{
			if (_list.find(value) != _list.end())
				_value = value;
			else
				_value = no_find();
		}

	private:
		std::set<Type>	_list;
	};

} 

#endif // UTILITY_SETTER_INCLUDE_H_