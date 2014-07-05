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
 
#include "precompiled_common.h"


#include "NumFormat.h"

namespace Common
{
	NumFormat::NumFormat() : m_type(decimal)
	{
	}
	
	const NumFormat::Type NumFormat::type() const
	{
		return m_type;
	}

	const NumFormat NumFormat::UpperLetter()
	{
		return NumFormat(upperLetter);
	}

	const NumFormat NumFormat::LowerLetter()
	{
		return NumFormat(lowerLetter);
	}

	const NumFormat NumFormat::UpperRoman()
	{
		return NumFormat(upperRoman);
	}

	const NumFormat NumFormat::LowerRoman()
	{
		return NumFormat(lowerRoman);
	}

	const NumFormat NumFormat::Decimal()
	{
		return NumFormat(decimal);
	}

	const NumFormat NumFormat::Symbol()
	{
		return NumFormat(symbol);
	}

	const NumFormat NumFormat::Bullet()
	{
		return NumFormat(bullet);
	}

	const NumFormat NumFormat::Chicago()
	{
	    return NumFormat(chicago);
	}

	const bool NumFormat::isUpperLetter() const
	{
		return m_type == upperLetter;
	}

	const bool NumFormat::isLowerLetter() const
	{
		return m_type == lowerLetter;
	}

	const bool NumFormat::isUpperRoman() const
	{
		return m_type == upperRoman;
	}

	const bool NumFormat::isLowerRoman() const
	{
		return m_type == lowerRoman;
	}

	const bool NumFormat::isDecimal() const
	{
		return m_type == decimal;
	}

	const bool NumFormat::isSymbol() const
	{
		return m_type == symbol;
	}

	const bool NumFormat::isBullet() const
	{
		return m_type == bullet;
	}
	
	const bool NumFormat::isChicago() const
	{
		return m_type == chicago;
	}

	void NumFormat::setUpperLetter()
	{
		m_type = upperLetter;
	}

	void NumFormat::setLowerLetter()
	{
		m_type = lowerLetter;
	}

	void NumFormat::setUpperRoman()
	{
		m_type = upperRoman;
	}

	void NumFormat::setLowerRoman()
	{
		m_type = lowerRoman;
	}

	void NumFormat::setDecimal()
	{
		m_type = decimal;
	}

	void NumFormat::setSymbol()
	{
		m_type = symbol;
	}

	void NumFormat::setBullet()
	{
		m_type = bullet;
	}

	void NumFormat::setChicago()
	{
		m_type = chicago;
	}

	NumFormat::NumFormat(const NumFormat::Type type) : m_type(type)
	{
	}

	void NumFormat::fromBase(const NumFormat& numFormat)
	{
		m_type = numFormat.m_type;
	}

} // namespace Common