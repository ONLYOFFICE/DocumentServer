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
#ifndef OOX_LOGIC_PARAGRAPH_INCLUDE_H_
#define OOX_LOGIC_PARAGRAPH_INCLUDE_H_

#include "TextItemBase.h"
#include <string>
#include <vector>
#include "ParagraphItem.h"
#include "ParagraphProperty.h"
#include "RunProperty.h"
#include "property.h"
#include "nullable_property.h"
#include "Run.h"
#include "Shape.h"
#include "OLEObject.h"
#include "./../RId.h"
#include "Drawing.h"

namespace OOX
{
	namespace Logic
	{
		class Paragraph : public TextItemBase
		{
		public:
			Paragraph();
			virtual ~Paragraph();
			explicit Paragraph(const XML::XNode& node);
			explicit Paragraph(const RId& rId, const OOX::CPath& imagePath, const long width, const long height);
			explicit Paragraph(const RId& rId, const OOX::CPath& filename, const long xEmu, const std::string& hRelativeFrom, const long yEmu, const std::string& vRelativeFrom, const long widthEmu, const long heightEmu);
			const Paragraph& operator =(const XML::XNode& node);

		public:
			virtual void fromXML(const XML::XNode& node);
			virtual const XML::XNode toXML() const;

		public:
			
			void Add(const Run& run);
			void AddRun(const Run& run);
			void AddText(const std::string& text);
			void AddText(const std::string& text, const nullable__<Logic::RunProperty>& property);
			void AddTab();
			void AddTab(const nullable__<Logic::RunProperty>& property);
			void AddLineBreak();
			void AddBreak(const std::string& type);			
			void AddSpace(const size_t count);
			void AddSpace(const size_t count, const nullable__<Logic::RunProperty>& property);
			void AddHyperlink(const RId& rId, const std::string& text);
			void AddHyperlink(const std::string& nameHref, const std::string& text);
			void AddDrawing(const Drawing& drawing);

			void AddBookmarkStart(const std::string& name);
			void AddBookmarkEnd(const std::string& name);

		public:
			void setRunProperty(const RunProperty& property);	

		public:
			const bool isInList() const;
			const int GetListNum() const;
			const int GetLevel() const;
		
		public:
			nullable_property<ParagraphProperty>		Property;
			property<std::vector<ParagraphItem> >		Items;
			property<int> CountInList;
		};
	} 
} 

#endif 
