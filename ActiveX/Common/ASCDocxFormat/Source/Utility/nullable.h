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
#ifndef UTILITY_NULLABLE_INCLUDE_H_
#define UTILITY_NULLABLE_INCLUDE_H_

#include <string>

#include "CallTraits.h"
#include "Exception/not_init_nullable.h"

#include "../../../../Common/DocxFormat/Source/Base/SmartPtr.h"



template<typename T> class nullable__
{
private:
	typedef typename NSCallTraits<T>::param_type Parameter;

private:

	template<class T, bool big_type> class InternalNullable
	{
	private:
		typedef typename NSCallTraits<T>::param_type Parameter;

	public:
		InternalNullable() {}
		InternalNullable(Parameter value) : _value(new T(value)) {}

		inline void operator =(Parameter value) { _value.reset(new T(value));}
		inline void operator =(const nullable__<T>& value)
		{
			if (value.is_init())
				_value.reset(new T(value));
			else
				_value = NSCommon::smart_ptr<T>();
		}

		inline Parameter get() const {return *_value;}
		inline Parameter get_value_or(Parameter value) const {return is_init() ? get() : value;}


		inline T const* get_ptr() const {return _value.operator->();}	
		inline T*       get_ptr()       {return _value.operator->();}	

		inline T const* operator->() const	{return _value.operator->();}	
		inline T*		operator->()		{return _value.operator->();}		

		inline const T&	operator*() const	{return (_value.operator*());}
		inline T&		operator*()			{return (_value.operator*());}

		inline const bool is_init() const {return _value.is_init();}
		inline void reset() {_value.reset();}

	private:
		NSCommon::smart_ptr<T> _value;
	};

	template<class T> class InternalNullable<T, false>
	{
	private:
		typedef typename NSCallTraits<T>::param_type Parameter;

	public:
		InternalNullable() {}
		InternalNullable(Parameter value) : _value(new T(value)) {}

		inline void operator =(Parameter value) {_value = value;}
		inline void operator =(const nullable__<T>& value) 
		{ 
			if (value.is_init())
				_value.reset(new T(value));
			else
				_value = NSCommon::smart_ptr<T>();
		}		
		inline Parameter get() const {return *_value;}
		inline Parameter get_value_or(Parameter value) const {return is_init() ? get() : value;}

		inline T const* get_ptr() const {return _value.operator->();}	
		inline T*       get_ptr()       {return _value.operator->();}	

		inline T const* operator->() const	{return _value.operator->();}	
		inline T*		operator->()		{return _value.operator->();}		

		inline const T&	operator*() const	{return (_value.operator*());}
		inline T&		operator*()			{return (_value.operator*());}

		inline const bool is_init() const {return _value.is_init();}
		inline void reset() {_value.reset();}

	private:

		NSCommon::smart_ptr<T> _value;
	};

public:

	nullable__() {}
	nullable__(Parameter value) : _value(value) {}

	template<typename U>
	const nullable__<T>& operator =(const U& value)
	{
		return ::nullable_setter(*this, value);
	}
	template<typename U>
	const nullable__<T>& nullable_setter(const U& value)
	{
		_value = static_cast<T>(value);
		return *this;
	}
	inline const nullable__<T>& nullable_setter(const nullable__<T>& value)
	{
		_value = value;
		return *this;
	}

	inline operator Parameter() const {return _value.get();}

	inline Parameter get() const 
	{
		if (!is_init())
			throw not_init_nullable();
		return _value.get();
	}

	inline Parameter get_value_or(Parameter value) const 
	{
		return _value.get_value_or(value);
	}

	inline const T get_value_or_default() const
	{
		return get_value_or(T());
	}

	inline T const* operator->() const 
	{
		if (!is_init())
			throw not_init_nullable();
		return _value.get_ptr();
	}

	inline T* operator->()       
	{
		if (!is_init())
			throw not_init_nullable();
		return _value.get_ptr();
	}

	inline T const* get_ptr() const 
	{
		if (!is_init())
			throw not_init_nullable();
		return _value.get_ptr();
	}

	inline T* get_ptr()
	{
		if (!is_init())
			throw not_init_nullable();
		return _value.get_ptr();
	}

	inline T const& operator*() const 
	{
		if (!is_init())
			throw not_init_nullable();
		return *_value;
	}

	inline T& operator*()
	{
		if (!is_init())
			throw not_init_nullable();
		return *_value;
	}

	inline const bool is_init() const 
	{
		return _value.is_init();
	}

	inline void reset() 
	{
		_value.reset();
	}

	inline void init()
	{
		if (!is_init())
			_value = T();
	}

	inline const std::string ToString() const 
	{
		return ::ToString(get());
	}

	inline const bool operator ==(nullable__<T> const& rhs) const {return _value.get() == rhs._value.get();}
	inline const bool operator !=(nullable__<T> const& rhs) const {return _value.get() != rhs._value.get();}
	inline const bool operator < (nullable__<T> const& rhs) const {return _value.get() <  rhs._value.get();}
	inline const bool operator > (nullable__<T> const& rhs) const {return _value.get() >  rhs._value.get();}
	inline const bool operator <=(nullable__<T> const& rhs) const {return _value.get() <= rhs._value.get();}
	inline const bool operator >=(nullable__<T> const& rhs) const {return _value.get() >= rhs._value.get();}

	inline const bool operator ==(Parameter rhs) const {return _value.get() == rhs;}
	inline const bool operator !=(Parameter rhs) const {return _value.get() != rhs;}
	inline const bool operator < (Parameter rhs) const {return _value.get() <  rhs;}
	inline const bool operator > (Parameter rhs) const {return _value.get() >  rhs;}
	inline const bool operator <=(Parameter rhs) const {return _value.get() <= rhs;}
	inline const bool operator >=(Parameter rhs) const {return _value.get() >= rhs;}

	template<typename T> const bool operator ==(const T rhs) const {return _value.get() == rhs;}
	template<typename T> const bool operator !=(const T rhs) const {return _value.get() != rhs;}
	template<typename T> const bool operator < (const T rhs) const {return _value.get() < rhs;}
	template<typename T> const bool operator > (const T rhs) const {return _value.get() > rhs;}
	template<typename T> const bool operator <=(const T rhs) const {return _value.get() <= rhs;}
	template<typename T> const bool operator >=(const T rhs) const {return _value.get() >= rhs;}

private:

	static const int size_of_big_object = 128;

	InternalNullable<T, sizeof(T) / (size_of_big_object + 1) >= 1> _value;
};

template<class T> const bool operator== (const T x, nullable__<T> const& y) {return y == x;} 
template<class T> const bool operator!= (const T x, nullable__<T> const& y) {return y != x;}
template<class T> const bool operator<  (const T x, nullable__<T> const& y) {return y >= x;}
template<class T> const bool operator>  (const T x, nullable__<T> const& y) {return y <= x;}
template<class T> const bool operator<= (const T x, nullable__<T> const& y) {return y >  x;}
template<class T> const bool operator>= (const T x, nullable__<T> const& y) {return y <  x;}
template<typename V, class T> const bool operator ==(const V x, nullable__<T> const& y) {return y == x;}
template<typename V, class T> const bool operator !=(const V x, nullable__<T> const& y) {return y != x;}
template<typename V, class T> const bool operator < (const V x, nullable__<T> const& y) {return y < x;}
template<typename V, class T> const bool operator > (const V x, nullable__<T> const& y) {return y > x;}
template<typename V, class T> const bool operator <=(const V x, nullable__<T> const& y) {return y <= x;}
template<typename V, class T> const bool operator >=(const V x, nullable__<T> const& y) {return y >= x;}

template<typename T, typename U> const nullable__<T>& nullable_setter(nullable__<T>& lhs, const U& rhs)
{
	return lhs.nullable_setter(rhs);
}

template<typename T> const std::string ToString(const nullable__<T>& value)
{
	return value.ToString();
}

#endif // UTILITY_NULLABLE_INCLUDE_H_