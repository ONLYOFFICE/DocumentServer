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
#ifndef OOX_LOGIC_PICT_INCLUDE_H_
#define OOX_LOGIC_PICT_INCLUDE_H_

#include "RunItemBase.h"
#include "Shape.h"
#include "ShapeType.h"
#include "Rect.h"
#include "Oval.h"
#include "Line.h"
#include "Roundrect.h"
#include "OleObject.h"
#include "Group.h"
#include "./../Limit/PictName.h"

namespace OOX
{
	namespace Logic
	{
		class Pict : public RunItemBase
		{
		public:
			Pict();
			virtual ~Pict();
			explicit Pict(const XML::XNode& node);
			
		public:
			virtual void fromXML(const XML::XNode& node);
			virtual const XML::XNode toXML() const;
			const std::string toTxt() const;

		public:
			const bool hasPictures() const;
			const bool isOle() const;

		public:

			property<std::string, Limit::PictName>	name;

			nullable_property<Shape>				shape;
			nullable_property<ShapeType>			shapetype;
			nullable_property<Rect>					rect;
			nullable_property<Oval>					oval;
			nullable_property<OOX::Logic::Line>		line;
			nullable_property<Roundrect>			roundrect;
			nullable_property<Group>				group;
			
			nullable_property<std::string>			DxaOrig;
			nullable_property<std::string>			DyaOrig;
			nullable_property<OleObject>			OleObject;
		};
	} 
} 

#endif // OOX_LOGIC_PICT_INCLUDE_H_