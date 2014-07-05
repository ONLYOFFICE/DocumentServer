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
#ifndef UTILITY_UNIT_INCLUDE_H_
#define UTILITY_UNIT_INCLUDE_H_

#include <string>
#include "Exception/UnitError.h"
#include "ASCStlUtils.h"

template<typename Unit1, typename Unit2>	class UnitConverter;
template<typename V, typename U, int P>		class UnitFactory;

template<typename V, typename U, int P = 2>
class Unit
{
public:
	Unit() : m_value() 
	{
		U::it_not_unit_type();
	}

	Unit(const V& value) : m_value(value)
	{
		U::it_not_unit_type();
	}

	const Unit& operator =(const V& value)
	{
		m_value = value;
		return *this;
	}

	Unit(const std::string& value)
	{
		U::it_not_unit_type();
		fromString(value);
	}

	const Unit& operator =(const std::string& value)
	{
		fromString(value);
		return *this;
	}

	template<typename V2, typename U2, int P2>
	Unit(const Unit<V2, U2, P2>& unit)
	{
		fromUnit(unit);
	}

	template<typename V2, typename U2, int P2>
	const Unit& operator =(const Unit<V2, U2, P2>& unit)
	{
		fromUnit(unit);
		return *this;
	}

	operator const V() const
	{
		return m_value;
	}

	const Unit& operator -=(const Unit& rhs)
	{
		m_value -= rhs.m_value;
		return *this;
	}

	const Unit& operator +=(const Unit& rhs)
	{
		m_value += rhs.m_value;
		return *this;
	}

	const Unit& operator +=(const V rhs)
	{
		m_value += rhs;
		return *this;
	}

	const Unit& operator -=(const V rhs)
	{
		m_value -= rhs;
		return *this;
	}

	const Unit& operator /=(const V rhs)
	{
		m_value /= rhs;
		return *this;
	}

	const Unit& operator *=(const V rhs)
	{
		m_value *= rhs;
		return *this;
	}

	const Unit operator -(const Unit& rhs) const
	{
		Unit result(*this);
		return result -= rhs;
	}

	const Unit operator +(const Unit& rhs) const
	{
		Unit result(*this);
		return result += rhs;
	}

	const Unit operator +(const V& rhs) const
	{
		Unit result(*this);
		return result += rhs;
	}

	const Unit operator -(const V& rhs) const
	{
		Unit result(*this);
		return result -= rhs;
	}

	const Unit operator /(const V& rhs) const
	{
		Unit result(*this);
		return result /= rhs;
	}

	const Unit operator *(const V& rhs) const
	{
		Unit result(*this);
		return result *= rhs;
	}

	const Unit operator-() const
	{
		Unit value = -m_value;
		return value;
	}

	template<typename V2, typename U2, int P2>
	const Unit& operator +=(const Unit<V2, U2, P2>& rhs)
	{
		return *this += Unit(rhs);
	}

	template<typename V2, typename U2, int P2>
	const Unit& operator -=(const Unit<V2, U2, P2>& rhs)
	{
		return *this -= Unit(rhs);
	}

	template<typename V2, typename U2, int P2>
	const Unit operator +(const Unit<V2, U2, P2>& rhs)
	{
		Unit result(*this);
		return result += rhs;
	}

	template<typename V2, typename U2, int P2>
	const Unit operator -(const Unit<V2, U2, P2>& rhs)
	{
		Unit result(*this);
		return result -= rhs;
	}

public:
	inline const std::string ToString() const
	{
		return ToString(m_value) + U::ToString();
	}

	inline const V value() const
	{
		return m_value;
	}

private:
	inline void fromString(const std::string& value)
	{
		if (value.empty())
		{
			m_value = V();
		}
		else
		{
			*this = UnitFactory<V, U, P>::create(value);
		}
	}

	inline const std::string ToString(const int value) const
	{
		return StlUtils::IntToString(value);
	}

	inline const std::string ToString(const double value) const
	{
		std::string format = std::string("%0.") + StlUtils::IntToString(P) + std::string("f");

		char strValue[256];
		sprintf_s(strValue, 256, format.c_str(), value);

		return std::string(strValue);
	}

	
	template<typename V2, typename U2, int P2>
	void fromUnit(const Unit<V2, U2, P2>& unit)
	{
		m_value = UnitConverter<U2, U>::convert<V>(unit.value());
	}

private:

	V m_value;
};


class Cm
{
public:
	static void it_not_unit_type() {}
	static const std::string ToString() {return "cm";}
};


class Pt
{
public:
	static void it_not_unit_type() {}
	static const std::string ToString() {return "pt";}
};


class Px
{
public:
	static void it_not_unit_type() {}
	static const std::string ToString() {return "px";}
};


class Mm
{
public:
	static void it_not_unit_type() {}
	static const std::string ToString() {return "mm";}
};


class Dx
{
public:
	static void it_not_unit_type() {}
	static const std::string ToString() {return "";}
};


class Sx
{
public:
	static void it_not_unit_type() {}
	static const std::string ToString() {return "";}
};


class Multi
{
public:
	static void it_not_unit_type() {}
	static const std::string ToString() {return "*";}
};


class Percent
{
public:
	static void it_not_unit_type() {}
	static const std::string ToString() {return "%";}
};


class Inch
{
public:
	static void it_not_unit_type() {}
	static const std::string ToString() {return "in";}
};


template<typename Unit1, typename Unit2>
class UnitConverter
{
public:
	template<typename V>
	static const V convert(const double value)
	{
		return static_cast<V>(value);
	}
};


template<> class UnitConverter<Cm, Mm>
{
public:
	template<typename V>
	static const V convert(const double value)
	{
		return static_cast<V>(value * 10);
	}
};


template<> class UnitConverter<Cm, Pt>
{
public:
	template<typename V>
	static const V convert(const double value)
	{
		return static_cast<V>(value * 72 / 2.54);
	}
};


template<> class UnitConverter<Cm, Px>
{
public:
	template<typename V>
	static const V convert(const double value)
	{
		return static_cast<V>(value * 72 * 4 / 3 / 2.54);
	}
};


template<> class UnitConverter<Cm, Inch>
{
public:
	template<typename V>
	static const V convert(const double value)
	{
		return static_cast<V>(value / 2.54);
	}
};


template<> class UnitConverter<Cm, Dx>
{
public:
	template<typename V>
	static const V convert(const double value)
	{
		return static_cast<V>(value * 72 * 20 / 2.54);
	}
};


template<> class UnitConverter<Cm, Sx>
{
public:
	template<typename V>
	static const V convert(const double value)
	{
		return static_cast<V>(value * 72 * 100 * 1000 / 20);
	}
};


template<> class UnitConverter<Cm, Multi>
{
public:
	template<typename V>
	static const V convert(const double value)
	{
		return static_cast<V>(value * 72 * 20 / 2.54);
	}
};


template<> class UnitConverter<Mm, Cm>
{
public:
	template<typename V>
	static const V convert(const double value)
	{
		return static_cast<V>(value / 10);
	}
};


template<> class UnitConverter<Mm, Pt>
{
public:
	template<typename V>
	static const V convert(const double value)
	{
		return static_cast<V>(value * 72 / 10 / 2.54);
	}
};


template<> class UnitConverter<Mm, Px>
{
public:
	template<typename V>
	static const V convert(const double value)
	{
		return static_cast<V>(value * 72  * 4 / 3 / 10 / 2.54);
	}
};


template<> class UnitConverter<Mm, Inch>
{
public:
	template<typename V>
	static const V convert(const double value)
	{
		return static_cast<V>(value / 2.54 / 10);
	}
};


template<> class UnitConverter<Mm, Dx>
{
public:
	template<typename V>
	static const V convert(const double value)
	{
		return static_cast<V>(value * 72 * 20 / 10 / 2.54);
	}
};


template<> class UnitConverter<Mm, Sx>
{
public:
	template<typename V>
	static const V convert(const double value)
	{
		return static_cast<V>(value * 72 * 100 * 1000 / 10 / 20);
	}
};


template<> class UnitConverter<Mm, Multi>
{
public:
	template<typename V>
	static const V convert(const double value)
	{
		return static_cast<V>(value * 72 * 20 / 10 / 2.54);
	}
};


template<> class UnitConverter<Pt, Cm>
{
public:
	template<typename V>
	static const V convert(const double value)
	{
		return static_cast<V>(value * 2.54 / 72);
	}
};


template<> class UnitConverter<Pt, Mm>
{
public:
	template<typename V>
	static const V convert(const double value)
	{
		return static_cast<V>(value * 2.54 * 10 / 72);
	}
};

template<> class UnitConverter<Pt, Px>
{
public:
	template<typename V>
	static const V convert(const double value)
	{
		return static_cast<V>(value * 4 / 3);
	}
};


template<> class UnitConverter<Pt, Inch>
{
public:
	template<typename V>
	static const V convert(const double value)
	{
		return static_cast<V>(value / 72);
	}
};


template<> class UnitConverter<Pt, Dx>
{
public:
	template<typename V>
	static const V convert(const double value)
	{
		return static_cast<V>(value * 20);
	}
};


template<> class UnitConverter<Pt, Sx>
{
public:
	template<typename V>
	static const V convert(const double value)
	{
		return static_cast<V>(value * 2.54 * 100 * 1000 / 20);
	}
};


template<> class UnitConverter<Pt, Multi>
{
public:
	template<typename V>
	static const V convert(const double value)
	{
		return static_cast<V>(value * 20);
	}
};


template<> class UnitConverter<Px, Cm>
{
public:
	template<typename V>
	static const V convert(const double value)
	{
		return static_cast<V>(value * 2.54 * 3/ 72 / 4);
	}
};


template<> class UnitConverter<Px, Mm>
{
public:
	template<typename V>
	static const V convert(const double value)
	{
		return static_cast<V>(value * 2.54 * 10 * 3/ 72 /4);
	}
};


template<> class UnitConverter<Px, Pt>
{
public:
	template<typename V>
	static const V convert(const double value)
	{
		return static_cast<V>(value * 3 / 4);
	}
};


template<> class UnitConverter<Px, Inch>
{
public:
	template<typename V>
	static const V convert(const double value)
	{
		return static_cast<V>(value * 3 / 72 / 4);
	}
};


template<> class UnitConverter<Px, Dx>
{
public:
	template<typename V>
	static const V convert(const double value)
	{
		return static_cast<V>(value * 20 * 3 / 4);
	}
};


template<> class UnitConverter<Px, Sx>
{
public:
	template<typename V>
	static const V convert(const double value)
	{
		return static_cast<V>(value * 2.54 * 100 * 1000 * 3/ 20 / 4);
	}
};


template<> class UnitConverter<Px, Multi>
{
public:
	template<typename V>
	static const V convert(const double value)
	{
		return static_cast<V>(value * 20 * 3 / 4);
	}
};


template<> class UnitConverter<Inch, Cm>
{
public:
	template<typename V>
	static const V convert(const double value)
	{
		return static_cast<V>(value * 2.54);
	}
};


template<> class UnitConverter<Inch, Mm>
{
public:
	template<typename V>
	static const V convert(const double value)
	{
		return static_cast<V>(value * 2.54 * 10);
	}
};


template<> class UnitConverter<Inch, Pt>
{
public:
	template<typename V>
	static const V convert(const double value)
	{
		return static_cast<V>(value * 72);
	}
};


template<> class UnitConverter<Inch, Px>
{
public:
	template<typename V>
	static const V convert(const double value)
	{
		return static_cast<V>(value * 72 * 4 / 3);
	}
};



template<> class UnitConverter<Inch, Dx>
{
public:
	template<typename V>
	static const V convert(const double value)
	{
		return static_cast<V>(value * 72 * 20);
	}
};


template<> class UnitConverter<Inch, Sx>
{
public:
	template<typename V>
	static const V convert(const double value)
	{
		return static_cast<V>(value * 1000 * 100 * 2.54 * 72 / 20  );
	}
};


template<> class UnitConverter<Inch, Multi>
{
public:
	template<typename V>
	static const V convert(const double value)
	{
		return static_cast<V>(value * 72 * 20);
	}
};


template<> class UnitConverter<Dx, Cm>
{
public:
	template<typename V>
	static const V convert(const double value)
	{
		return static_cast<V>(value * 2.54 / 72 / 20);
	}
};


template<> class UnitConverter<Dx, Mm>
{
public:
	template<typename V>
	static const V convert(const double value)
	{
		return static_cast<V>(value * 2.54 * 10 / 72 / 20);
	}
};


template<> class UnitConverter<Dx, Pt>
{
public:
	template<typename V>
	static const V convert(const double value)
	{
		return static_cast<V>(value / 20);
	}
};


template<> class UnitConverter<Dx, Px>
{
public:
	template<typename V>
	static const V convert(const double value)
	{
		return static_cast<V>(value * 4 / 3 / 20);
	}
};


template<> class UnitConverter<Dx, Inch>
{
public:
	template<typename V>
	static const V convert(const double value)
	{
		return static_cast<V>(value / 20 / 72);
	}
};


template<> class UnitConverter<Dx, Sx>
{
public:
	template<typename V>
	static const V convert(const double value)
	{
		return static_cast<V>(value * 1000 * 1000 * 2.54 / 100 / 1000 );
	}
};


template<> class UnitConverter<Dx, Multi>
{
public:
	template<typename V>
	static const V convert(const double value)
	{
		return static_cast<V>(value);
	}
};


template<> class UnitConverter<Sx, Cm>
{
public:
	template<typename V>
	static const V convert(const double value)
	{
		return static_cast<V>(value * 20 / 72 / 100 / 1000);
	}
};


template<> class UnitConverter<Sx, Mm>
{
public:
	template<typename V>
	static const V convert(const double value)
	{
		return static_cast<V>(value * 20 / 72 / 100 / 1000 * 10);
	}
};


template<> class UnitConverter<Sx, Pt>
{
public:
	template<typename V>
	static const V convert(const double value)
	{
		return static_cast<V>(value * 20 / 100 / 1000 / 2.54);
	}
};


template<> class UnitConverter<Sx, Px>
{
public:
	template<typename V>
	static const V convert(const double value)
	{
		return static_cast<V>(value * 20 * 4 / 3 / 100 / 1000 / 2.54);
	}
};


template<> class UnitConverter<Sx, Inch>
{
public:
	template<typename V>
	static const V convert(const double value)
	{
		return static_cast<V>(value * 20 / 2.54 / 72 / 100 / 1000);
	}
};


template<> class UnitConverter<Sx, Dx>
{
public:
	template<typename V>
	static const V convert(const double value)
	{
		return static_cast<V>(value * 20 * 20 / 2.54 / 100 / 1000);
	}
};


template<> class UnitConverter<Sx, Multi>
{
public:
	template<typename V>
	static const V convert(const double value)
	{
		return static_cast<V>(value * 20 * 20 / 2.54 / 100 / 1000);
	}
};


template<> class UnitConverter<Multi, Cm>
{
public:
	template<typename V>
	static const V convert(const double value)
	{
		return static_cast<V>(value * 2.54 / 72 / 20);
	}
};


template<> class UnitConverter<Multi, Mm>
{
public:
	template<typename V>
	static const V convert(const double value)
	{
		return static_cast<V>(value * 2.54 * 10 / 72 / 20);
	}
};


template<> class UnitConverter<Multi, Pt>
{
public:
	template<typename V>
	static const V convert(const double value)
	{
		return static_cast<V>(value / 20);
	}
};


template<> class UnitConverter<Multi, Px>
{
public:
	template<typename V>
	static const V convert(const double value)
	{
		return static_cast<V>(value * 4 / 3 / 20);
	}
};


template<> class UnitConverter<Multi, Inch>
{
public:
	template<typename V>
	static const V convert(const double value)
	{
		return static_cast<V>(value / 20 / 72);
	}
};


template<> class UnitConverter<Multi, Sx>
{
public:
	template<typename V>
	static const V convert(const double value)
	{
		return static_cast<V>(value * 1000 * 1000 * 2.54 / 100 / 1000 );
	}
};


template<> class UnitConverter<Multi, Dx>
{
public:
	template<typename V>
	static const V convert(const double value)
	{
		return static_cast<V>(value);
	}
};

template<typename V, typename U, int P>
class UnitFactory
{
public:
	inline static const Unit<V, U, P> create(const std::string& str)
	{
		try
		{
			const size_t pos = str.find_first_not_of("-.0123456789");

			if (pos == std::string::npos)
			{
				if (std::string::npos != str.find('.'))
					return Unit<V, U, P>((V)StlUtils::ToDouble(str));

				return Unit<V, U, P>((V)StlUtils::ToInteger(str));
			}

			const std::string unit = str.substr(pos, str.size() - pos);

			if (0 == pos)
			{
				return Unit<V, Cm, P>(0);
			}

			V value;

			if (std::string::npos != str.find('.'))
				value = (V)StlUtils::ToDouble(str.substr(0, pos));
			else			
				value = (V)StlUtils::ToInteger(str.substr(0, pos));

			if (unit == Cm::ToString())
				return Unit<V, Cm, P>(value);
			else if (unit == Mm::ToString())
				return Unit<V, Mm, P>(value);
			else if (unit == Pt::ToString())
				return Unit<V, Pt, P>(value);
			else if (unit == Px::ToString())
				return Unit<V, Px, P>(value);
			else if (unit == Multi::ToString())
				return Unit<V, Multi, P>(value);
			else if (unit == Percent::ToString())
				return Unit<V, Percent, P>(value);
			else if (unit == Inch::ToString())
				return Unit<V, Inch, P>(value);
			else
				throw UnitError("Bad unit");
		}
		catch (...)
		{
			return Unit<V, Cm, P>(0);
		}
	}
};

#endif // UTILITY_UNIT_INCLUDE_H_