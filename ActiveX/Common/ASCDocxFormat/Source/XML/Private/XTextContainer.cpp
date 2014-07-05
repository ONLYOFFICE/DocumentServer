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
 
#include "precompiled_xml.h"


#include "XTextContainer.h"
#include "XNodeContainer.h"
#include "./../XText.h"

namespace XML
{
	namespace Private
	{
		XTextContainer::XTextContainer(const XNodeContainer& nodes)	: m_container(nodes.container())
		{
		}

		const bool XTextContainer::empty() const
		{
			return size() == 0;
		}

		const size_t XTextContainer::size() const
		{
			size_t size = 0;
			for (const_iterator i = begin(); i != end(); ++i)
				++size;
			return size;
		}

		void XTextContainer::push_back(const XText& text)
		{
			if (text.is_init())
			{
				m_container->push_back(text);
			}
		}

		void XTextContainer::Add(const XML::XText& text)
		{
			push_back(text);
		}

		const XString XTextContainer::text() const
		{
			std::string text;
			for (const_iterator i = begin(); i != end(); ++i)
			{
				text += XText(*i)->Value;
			}
			return text.empty() ? XString() : text;
		}

		XTextContainer::iterator XTextContainer:: begin()
		{
			return m_container->begin();
		}

		XTextContainer::iterator XTextContainer::end()
		{
			return m_container->end();
		}

		XTextContainer::const_iterator XTextContainer::begin() const
		{
			return m_container->begin();
		}

		XTextContainer::const_iterator XTextContainer::end() const
		{
			return m_container->end();
		}

	} 
} // namespace XML