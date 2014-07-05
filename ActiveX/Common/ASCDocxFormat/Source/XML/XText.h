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
#ifndef XML_XTEXT_INCLUDE_H_
#define XML_XTEXT_INCLUDE_H_

#include "Private/XPointer.h"
#include "Private/Text.h"
#include "Private/NullText.h"
#include "Private/Null.h"
#include "nullable.h"
#include "property.h"
#include "nullable_property.h"
#include "Private/XString.h"
#include "Private/Lexigraph.h"


namespace XML
{
	class XNode;

	class XText : public Private::XPointer<Private::Text>
	{
	public:
		template<typename T>
		explicit XText(const T& value)
			: base(new Private::Text(ToString(value))),
				Value(m_ptr->Value)
		{
		}

		template<typename T>
		explicit XText(const nullable__<T>& value)
			: base(value.is_init() ? new Private::Text(ToString(value))	: 0),
				Value(value.is_init() ? m_ptr->Value : Private::Null::Text().Value)
		{
		}

		template<typename T, class S, class G>
		explicit XText(const nullable_property<T, S, G>& value)
			: base(value.is_init() ? new Private::Text(ToString(value))	: 0),
				Value(value.is_init() ? m_ptr->Value : Private::Null::Text().Value)
		{
		}

		XText(const XNode& xnode);

	public:
		Private::XString& Value;
	};
} 

#endif // XML_XTEXT_INCLUDE_H_