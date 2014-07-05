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
#ifndef UTILITY_UTILITY_INCLUDE_H_
#define UTILITY_UTILITY_INCLUDE_H_

#include "DateTime.h"
#include "Parse.h"
#include "ToString.h"
#include "Unit.h"
#include "Encoding.h"
#include "TxtFile.h"
#include "UniversalUnit.h"

template<typename Out, typename In>
static const std::vector<Out> transform(const std::vector<In>& lines, const Out(*func)(const In&))
{
	std::vector<Out> result;
	for (std::vector<Out>::const_iterator iter = lines.begin(); iter != lines.end(); ++iter)
	{
		result.push_back(func(*iter));
	}

	return result;
}

template<typename Out, typename In>
static const std::list<Out> transform(const std::list<In>& lines, const Out(*func)(const In&))
{
	std::list<Out> result;
	for (std::vector<Out>::const_iterator iter = lines.begin(); iter != lines.end(); ++iter)
	{
		result.push_back(func(*iter));
	}
	return result;
}

template<typename Out, typename In, typename In2>
static const std::list<Out> transform2(const std::list<In>& lines, const int codepage, const Out(*func)(const In&, const In2 codePage))
{
	std::list<Out> result;
	for (std::vector<Out>::const_iterator iter = lines.begin(); iter != lines.end(); ++iter)
	{
		result.push_back(func(*iter, codepage));
	}
	return result;
}

#endif // UTILITY_UTILITY_INCLUDE_H_