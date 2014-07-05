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
 
#include "precompiled_docxformat.h"


#include "BorderValue.h"


namespace OOX
{
	namespace Limit
	{
		BorderValueSet::BorderValueSet()
		{
			_list.insert("single");
			_list.insert("none");
			_list.insert("nil");
			_list.insert("candyCorn");
			_list.insert("dashed");
			_list.insert("dotDash");
			_list.insert("dotDotDash");			
			_list.insert("double");
			_list.insert("triple");
			_list.insert("thinThickSmallGap");
			_list.insert("thickThinSmallGap");
			_list.insert("thinThickThinSmallGap");
			_list.insert("thinThickMediumGap");
			_list.insert("thickThinMediumGap");
			_list.insert("thinThickThinMediumGap");
			_list.insert("thinThickLargeGap");
			_list.insert("thickThinLargeGap");
			_list.insert("thinThickThinLargeGap");
			_list.insert("wave");
			_list.insert("doubleWave");
			_list.insert("dashDotStroked");
			_list.insert("threeDEmboss");
			_list.insert("threeDEngrave");
			_list.insert("outset");
			_list.insert("inset");
		}

		BorderValue::BorderValue()
		{
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
		}
		BorderValueSet BorderValue::_set;

		const std::string BorderValue::no_find() const
		{
			return "none";
		}

		void BorderValue::operator()(std::string& _value, Parameter value)
		{
			if (_set._list.find(value) != _set._list.end())
				_value = value;
			else
				_value = no_find();
		}

	} 
} // namespace OOX