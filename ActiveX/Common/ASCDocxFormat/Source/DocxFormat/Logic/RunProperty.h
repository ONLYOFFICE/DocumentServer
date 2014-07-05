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
#ifndef OOX_LOGIC_RUN_PROPERTY_INCLUDE_H_
#define OOX_LOGIC_RUN_PROPERTY_INCLUDE_H_

#include "./../WritingElement.h"
#include <string>
#include "property.h"
#include "nullable_property.h"
#include "Color.h"
#include "BackgroundColor.h"
#include "Index.h"
#include "Lang.h"
#include "RFonts.h"
#include "Shading.h"
#include "Border.h"
#include "RunPropertyChange.h"
#include "./../Unit.h"
#include "./../Limit/UnderType.h"

namespace OOX
{
	namespace Logic
	{
		class RunProperty : public WritingElement
		{
		public:
			RunProperty();
			virtual ~RunProperty();
			explicit RunProperty(const XML::XNode& node);
			const RunProperty& operator =(const XML::XNode& node);

		public:
			virtual void fromXML(const XML::XNode& node);
			virtual const XML::XNode toXML() const;

		public:
			static const RunProperty merge(const RunProperty& prev, const RunProperty& current);
				
		public:
			const bool isSimple() const;

		public:
			nullable_property<bool>										Bold;
			nullable_property<bool>										Italic;
			nullable_property<bool>										Under;
			nullable_property<bool>										Strike;
			nullable_property<bool>										DStrike;
			nullable_property<std::string, Limit::UnderType>			UnderType;
            nullable_property<bool>										SmallCaps;
			nullable_property<bool>										Caps;
			nullable_property<bool>										Emboss;
			nullable_property<bool>										Imprint;
			nullable_property<bool>										Outline;
			nullable_property<bool>										Shadow;
			nullable_property<bool>										Vanish;
			nullable_property<bool>										WebHidden;
			nullable_property<double>									FontSize;
			nullable_property<std::string>								RStyle;
			nullable_property<Lang>										Lang;
			nullable_property<Index>									Index;
			nullable_property<Color>									FontColor;
			
			nullable_property<BackgroundColor>							Highlight;
			nullable_property<Shading>									Shading;
			nullable_property<RFonts>									rFonts;
			nullable_property<UnitDx>									Spacing;
			nullable_property<int, setter::between<int, 0, 3276> >		Kern;
            nullable_property<int, setter::between<int, -3168, 3168> >	Position;
            nullable_property<int, setter::between<int, 1, 600> >		Scale;
			nullable_property<Border>									Border;
			nullable_property<RunPropertyChange>                        PropertyChange;
			
		};
	} 
} 

#endif // OOX_LOGIC_RUN_PROPERTY_INCLUDE_H_