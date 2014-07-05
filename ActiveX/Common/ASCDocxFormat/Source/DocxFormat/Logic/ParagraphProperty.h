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
#ifndef OOX_LOGIC_PARAGRAPH_PROPERTY_INCLUDE_H_
#define OOX_LOGIC_PARAGRAPH_PROPERTY_INCLUDE_H_

#include "./../WritingElement.h"
#include "RunProperty.h"
#include "Spacing.h"
#include <string>
#include "nullable_property.h"
#include "Color.h"
#include "Align.h"
#include "NumPr.h"
#include "ParagraphBorder.h"
#include "Ind.h"
#include "TabsProperty.h"
#include "Shading.h"
#include "TextFrameProperties.h"
#include "ParagraphPropertyChange.h"
#include "./../Document.h"
#include "./../Limit/TextAlignment.h"

namespace OOX
{
	namespace Logic
	{
		class ParagraphProperty : public WritingElement
		{
		public:
			ParagraphProperty();
			virtual ~ParagraphProperty();
			explicit ParagraphProperty(const XML::XNode& node);
			const ParagraphProperty& operator =(const XML::XNode& node);

		public:
			virtual void fromXML(const XML::XNode& node);
			virtual const XML::XNode toXML() const;

		public:			
			const bool isSimple() const;

		public:
			nullable_property<std::string>				PStyle;
			nullable_property<RunProperty>				RunProperty;

			nullable_property<Align>					Align;
			
			nullable_property<Spacing>					Spacing;
			nullable_property<NumPr>					NumPr;
			nullable_property<ParagraphBorder>			ParagraphBorder;
			nullable_property<Ind>						Ind;
		
			nullable_property<Shading>                  Shading; 
			nullable_property<TextFrameProperties>      TextFrameProperties;

			nullable_property<SectorProperty>			SectorProperty;
			nullable_property<int>						OutlineLvl;
			nullable_property<TabsProperty>				Tabs;
			property<bool>								KeepNext;
			property<bool>								KeepLines;
			property<bool>								pageBreakBefore;
			property<bool>                              ContextualSpacing;
			property<bool>								SuppressLineNumbers;
			nullable_property<bool>						WidowControl;

			nullable_property<std::string, Limit::TextAlignment> TextAlignment;
			nullable_property<ParagraphPropertyChange> PropertyChange;
		};
	} 
} 

#endif // OOX_LOGIC_PARAGRAPH_PROPERTY_INCLUDE_H_