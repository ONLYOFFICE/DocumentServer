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
#ifndef OOX_LOGIC_INLINE_INCLUDE_H_
#define OOX_LOGIC_INLINE_INCLUDE_H_

#include "./../WritingElement.h"
#include "Extent.h"
#include "EffectExtent.h"
#include "DocPr.h"
#include "Graphic.h"
#include "property.h"
#include "nullable_property.h"
#include "./../Limit/InlineName.h"
#include "DrawingWrap.h"
#include "Point2D.h"

namespace OOX
{
	namespace Logic
	{
		class Inline : public WritingElement
		{
		public:
			Inline();
			virtual ~Inline();
			explicit Inline(const XML::XNode& node);
			const Inline& operator =(const XML::XNode& node);

		public:
			virtual void fromXML(const XML::XNode& node);
			virtual const XML::XNode toXML() const;

		public:
			property<std::string, Limit::InlineName>	Name;

			nullable__<Common::Point<UnitDx>>				distanceLeftTop;
			nullable__<Common::Point<UnitDx>>				distanceRightBottom;

			nullable_property<double>					DistT;	
			nullable_property<double>					DistB;	
			nullable_property<double>					DistL;	
			nullable_property<double>					DistR;	
			nullable_property<Extent>					Extent;
			property<EffectExtent>						EffectExtent;
			nullable_property<DocPr>					DocPr;
			nullable_property<int>						NoChangeAspect;
			property<Graphic>							Graphic;
			
			

			nullable__<Common::Point<UnitSx>>				anchorXY;

			nullable_property<int>						positionV;
			nullable_property<std::string>				positionVRelativeFrom;
			nullable_property<std::string>				positionVAlign;
			nullable_property<int>						positionH;	
			nullable_property<std::string>				positionHRelativeFrom;
			nullable_property<std::string>				positionHAlign;

			nullable_property<DrawingWrap>				Wrap;

			

			nullable_property<bool>						SimplePos;
			nullable_property<Point2D>					SimplePosPoint;
			nullable_property<int>						RelativeHeight;
			nullable_property<bool>						BehindDoc;
			nullable_property<bool>						Locked;
			nullable_property<bool>						LayoutInCell;
			nullable_property<bool>						AllowOverlap;
		};
	} 
} 

#endif // OOX_LOGIC_INLINE_INCLUDE_H