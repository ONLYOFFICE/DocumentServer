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
#ifndef OOX_LOGIC_RUN_INCLUDE_H_
#define OOX_LOGIC_RUN_INCLUDE_H_

#include "ParagraphItemBase.h"
#include "RunProperty.h"
#include "nullable_property.h"
#include <vector>
#include "RunItem.h"
#include "./../RId.h"

namespace OOX
{
	namespace Logic
	{
		class Run : public ParagraphItemBase
		{
		public:
			Run();
			virtual ~Run();
			explicit Run(const XML::XNode& node);
			explicit Run(const std::string& text);
			Run(const std::string& text, const RunProperty& runProperty);
			const Run& operator =(const XML::XNode& node);
			const Run& operator =(const std::string& text);

		public:
			virtual void fromXML(const XML::XNode& node);
			virtual void fromTxt(const std::string& text);
			virtual const XML::XNode toXML() const;
			virtual const std::string toTxt() const;

		public:
			const bool empty() const;
			void clear();

		public:
			nullable_property<RunProperty>		Property;	
			property<std::vector<RunItem> >		Items;

		public:
			template<typename T> void add() {Items->push_back(RunItem(new T()));}
			template<typename T> void add(const T& item) {Items->push_back(RunItem(new T(item)));};
			template<typename T> void add(T* item) {Items->push_back(RunItem(item));}
			void add(RunItemBase* item);
			void add(const std::string& text);
		};
	} 
} 

#endif // OOX_LOGIC_RUN_INCLUDE_H_