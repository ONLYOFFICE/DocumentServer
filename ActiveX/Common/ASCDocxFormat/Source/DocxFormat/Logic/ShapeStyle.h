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
#ifndef OOX_LOGIC_SHAPE_STYLE_INCLUDE_H_
#define OOX_LOGIC_SHAPE_STYLE_INCLUDE_H_

#include <string>

#include "Common.h"
#include "property.h"
#include "Utility.h"
#include "nullable_property.h"

#include "./../Limit/Position.h"
#include "./../Limit/MsoRelative.h"

namespace OOX
{
	namespace Logic
	{
		class ShapeStyle
		{
		public:
			ShapeStyle();
			explicit ShapeStyle(const std::string& value);
			const ShapeStyle& operator=(const std::string& value);

		public:
			const std::string ToString() const;
			void FromString(const std::string& value);

		public:	

			property<Common::Size<Unit<double, Pt, 3> >	>			Size;
			nullable_property<Common::Point<Unit<double, Pt, 0> > >	Point;
			nullable_property<std::string, Limit::Position>			Position;
		
			nullable_property<std::string>							flip;
			nullable_property<std::string>							ZIndex;
			nullable_property<std::string>							rotation;
			nullable_property<std::string>							visibility;			
		
			nullable_property<std::string>							msoWidthPercent;
			nullable_property<std::string>							msoHeightPercent;
			
			nullable_property<std::string>							msoPositionHorizontal;
			nullable_property<std::string>							msoPositionVertical;
			nullable_property<std::string>							msoPositionHorizontalRelative;
			nullable_property<std::string>							msoPositionVerticalRelative;

			nullable_property<std::string>							textAnchor;

			nullable_property<std::string, Limit::MsoRelative>		WidthRelative;
			nullable_property<std::string, Limit::MsoRelative>		HeightRelative;
			
			nullable__<Common::Point< Unit<double, Pt> >>			distanceLeftTop;
			nullable__<Common::Point< Unit<double, Pt> >>			distanceRightBottom;
			
			
			nullable__<Common::Point< Unit<double, Pt> >>			leftTop;
			bool													isLocalUnit;
		};
	} 
} 

#endif // OOX_LOGIC_SHAPE_STYLE_INCLUDE_H_