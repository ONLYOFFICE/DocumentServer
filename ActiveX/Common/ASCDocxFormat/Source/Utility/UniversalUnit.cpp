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


#include "UniversalUnit.h"
#include "ToString.h"

const double UniversalUnit::MminEmu = 1.0 / EmuinMm;
const double UniversalUnit::CminEmu = 1.0 / EmuinCm;
const double UniversalUnit::PtinEmu = 1.0 / EmuinPt;
const double UniversalUnit::InchinEmu = 1.0 / EmuinInch;
const double UniversalUnit::PercentforRead = 1.0 /  PercentforWrite;
const double UniversalUnit::DxinEmu = 1.0 / EmuinDx;

UniversalUnit::UniversalUnit()
	: m_value(0), 
		Type(Emu),
		Precesion(3)
{
}

UniversalUnit::UniversalUnit(const int value)
	: m_value(static_cast<long>(value)), 
		Type(Emu),
		Precesion(3)
{
}

UniversalUnit::UniversalUnit(const long value)
	: m_value(value), 
		Type(Emu),
		Precesion(3)
{
}

UniversalUnit::UniversalUnit(const size_t value)
	: m_value(static_cast<long>(value)), 
		Type(Emu),
		Precesion(3)
{
}

UniversalUnit::UniversalUnit(const double value)
	: m_value(static_cast<long>(value)), 
		Type(Emu),
		Precesion(3)
{
}

UniversalUnit::UniversalUnit(const std::string& value)
	: Precesion(3)
{
	fromString(value);
}

UniversalUnit::UniversalUnit(const char* value)
	: Precesion(3)
{
	fromString(value);
}

UniversalUnit::UniversalUnit(const UniversalUnit& rhs)
	: m_value(rhs.m_value),
		Type(rhs.Type),
		Precesion(rhs.Precesion)
{
}

UniversalUnit::UniversalUnit(const UnitType type)
	: m_value(0),
		Type(type),
		Precesion(3)
{
}

UniversalUnit::UniversalUnit(const long value, const UnitType type)
	: m_value(toEmu(value, type)),
		Type(type),
		Precesion(3)
{
}

const UniversalUnit& UniversalUnit::operator =(const std::string& value)
{
	fromString(value);
	return *this;
}

const UniversalUnit& UniversalUnit::operator =(const char* value)
{
	fromString(value);
	return *this;
}

const UniversalUnit& UniversalUnit::operator =(const UniversalUnit& rhs)
{
	m_value = rhs.m_value;
	if (Type == Emu)
		Type = rhs.Type;
	return *this;
}

UniversalUnit::operator const double()const
{
	return fromEmu();
}

const bool UniversalUnit::operator ==(const UniversalUnit& rhs) const
{
	return m_value == rhs.m_value;
}

const bool UniversalUnit::operator !=(const UniversalUnit& rhs) const
{
	return m_value != rhs.m_value;
}

const bool UniversalUnit::operator > (const UniversalUnit& rhs) const
{
	return m_value > rhs.m_value;
}

const bool UniversalUnit::operator >=(const UniversalUnit& rhs) const
{
	return m_value >= rhs.m_value;
}

const bool UniversalUnit::operator < (const UniversalUnit& rhs) const
{
	return m_value < rhs.m_value;
}

const bool UniversalUnit::operator <=(const UniversalUnit& rhs) const
{
	return m_value <= rhs.m_value;
}

void UniversalUnit::apply(const UniversalUnit& unit)
{
	if (Type == Percent)
	{
		m_value	=	static_cast<long>((double)unit.m_value * ((double)m_value * PercentforRead / 100.0));
		Type	=	unit.Type;
	}
}

const double UniversalUnit::value(const UnitType& type) const
{
	return fromEmu(m_value, type);
}


const std::string UniversalUnit::ToString() const
{
	return std::string();
}

const long UniversalUnit::toEmu(const double value, const UnitType type)
{
	switch(type)
	{
		case Mm:
			return static_cast<long>(value * EmuinMm);
		case Cm:
			return static_cast<long>(value * EmuinCm);
		case Pt: 
			return static_cast<long>(value * EmuinPt);
		case Inch: 
			return static_cast<long>(value * EmuinInch);
		case Percent:
			return static_cast<long>(value * PercentforWrite);
		case Multi: 
			return static_cast<long>(value);
		case Dx: 
			return static_cast<long>(value) * EmuinDx;
		default: 
			return static_cast<long>(value);
	}
}


const double UniversalUnit::fromEmu(const long value, const UnitType type)
{
	switch(type)
	{
		case Mm:
			return value * MminEmu;
		case Cm:
			return value * CminEmu;
		case Pt: 
			return value * PtinEmu;
		case Inch: 
			return value * InchinEmu;
		case Percent:
			return value * PercentforRead;
		case Multi: 
			return value;
		case Dx: 
			return value * DxinEmu;
		default: 
			return value;
	}
}


void UniversalUnit::toEmu(const double value)
{
	m_value = toEmu(value, Type);
}


const double UniversalUnit::fromEmu() const
{
	return fromEmu(m_value, Type);
}


void UniversalUnit::fromString(const std::string& str)
{
	const size_t pos = str.find_first_not_of("-.0123456789");
	if (pos == std::string::npos)
	{
		Type = Emu;
		if (0 != str.length())
			m_value =  static_cast<long>(atof(str.c_str()));
		else
			m_value = 0;
		return;
	}

	const std::string unit = str.substr(pos, str.size() - pos);
	double value;

	if (0 != pos)
		value = atof(str.substr(0, pos).c_str());			
	else
		value = 0.0;

	if (unit == ToLower("mm"))
		Type = Mm;
	else if (unit == ToLower("cm"))
		Type = Cm;
	else if (unit == ToLower("pt"))
		Type = Pt;
	else if (unit == ToLower("in"))
		Type = Inch;
	else if (unit == "%")
		Type = Percent;
	else if (unit == "*")
		Type = Multi;
	else
		Type = Emu;

	toEmu(value);
}

const UniversalUnit UniversalUnit::operator -() const
{
	UniversalUnit unit(-m_value);
	unit.Type = Type;
	return unit;
}

const UniversalUnit& UniversalUnit::operator +=(const UniversalUnit& rhs)
{
	m_value += rhs.m_value;
	return *this;
}

const UniversalUnit& UniversalUnit::operator -=(const UniversalUnit& rhs)
{
	m_value -= rhs.m_value;
	return *this;
}

const UniversalUnit UniversalUnit::operator +(const UniversalUnit& rhs) const
{
	UniversalUnit unit(m_value + rhs.m_value);
	unit.Type = Type;
	return unit;
}

const UniversalUnit UniversalUnit::operator -(const UniversalUnit& rhs) const
{
	UniversalUnit unit(m_value - rhs.m_value);
	unit.Type = Type;
	return unit;
}

const UniversalUnit operator +(const double lhs, const UniversalUnit& rhs)
{
	UniversalUnit unit(UniversalUnit::toEmu(lhs, rhs.Type) + rhs.m_value);
	unit.Type = rhs.Type;
	return unit;
}


const UniversalUnit operator -(const double lhs, const UniversalUnit& rhs)
{
	UniversalUnit unit(UniversalUnit::toEmu(lhs, rhs.Type) - rhs.m_value);
	unit.Type = rhs.Type;
	return unit;
}

const UniversalUnit operator *(const double lhs, const UniversalUnit& rhs)
{
	UniversalUnit unit(lhs * rhs.m_value);
	unit.Type = rhs.Type;
	return unit;
}

const UniversalUnit operator /(const double lhs, const UniversalUnit& rhs)
{
	UniversalUnit unit(lhs / rhs.m_value);
	unit.Type = rhs.Type;
	return unit;
}

const UniversalUnit operator +(const int lhs, const UniversalUnit& rhs)
{
	UniversalUnit unit(UniversalUnit::toEmu(lhs, rhs.Type) + rhs.m_value);
	unit.Type = rhs.Type;
	return unit;
}

const UniversalUnit operator -(const int lhs, const UniversalUnit& rhs)
{
	UniversalUnit unit(UniversalUnit::toEmu(lhs, rhs.Type) - rhs.m_value);
	unit.Type = rhs.Type;
	return unit;
}

const UniversalUnit operator *(const int lhs, const UniversalUnit& rhs)
{
	UniversalUnit unit(lhs * rhs.m_value);
	unit.Type = rhs.Type;
	return unit;
}

const UniversalUnit operator /(const int lhs, const UniversalUnit& rhs)
{
	UniversalUnit unit(lhs / rhs.m_value);
	unit.Type = rhs.Type;
	return unit;
}

const UniversalUnit operator +(const long lhs, const UniversalUnit& rhs)
{
	UniversalUnit unit(UniversalUnit::toEmu(lhs, rhs.Type) + rhs.m_value);
	unit.Type = rhs.Type;
	return unit;
}

const UniversalUnit operator -(const long lhs, const UniversalUnit& rhs)
{
	UniversalUnit unit(UniversalUnit::toEmu(lhs, rhs.Type) - rhs.m_value);
	unit.Type = rhs.Type;
	return unit;
}

const UniversalUnit operator *(const long lhs, const UniversalUnit& rhs)
{
	UniversalUnit unit(lhs * rhs.m_value);
	unit.Type = rhs.Type;
	return unit;
}

const UniversalUnit operator /(const long lhs, const UniversalUnit& rhs)
{
	UniversalUnit unit(lhs / rhs.m_value);
	unit.Type = rhs.Type;
	return unit;
}