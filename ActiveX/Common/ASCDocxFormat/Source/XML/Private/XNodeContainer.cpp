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


#include "XNodeContainer.h"
#include <algorithm>
#include <numeric>
#include "./../XNode.h"
#include "./../XContainer.h"

namespace XML
{
	namespace Private
	{
		XNodeContainer::XNodeContainer() : m_container(new std::list<XNode>())
		{
		}

		const bool XNodeContainer::empty() const
		{
			return m_container->empty();
		}

		const size_t XNodeContainer::size() const
		{
			return m_container->size();
		}

		void XNodeContainer::Add(const XNode& node)
		{
			push_back(node);
		}

		void XNodeContainer::push_back(const XNode& node)
		{
			if (node.is_init())
			{
				if (node.isElement() || node.isText() || node.isComment())
					m_container->push_back(node);
				else
					merge(XML::XContainer(node)->Nodes);
			}
		}

		void XNodeContainer::merge(const XNodeContainer& other)
		{
			for(std::list<XNode>::const_iterator current = other.m_container->begin(); current != other.m_container->end(); current++)
				push_back(*current);
		}

		const std::string XNodeContainer::ToString() const
		{
			
			return std::string();
		}

		const std::wstring XNodeContainer::ToWString() const
		{
			
			return std::wstring();
		}

		void XNodeContainer::SaveToStringList(std::list<std::string>& strList)const
		{
			for(std::list<XNode>::const_iterator iter = m_container->begin(); iter != m_container->end(); iter++)
			{
				iter->SaveToStringList(strList);
			}
		}

		void XNodeContainer::SaveToWStringList(std::list<std::wstring>& strList)const
		{
			for(std::list<XNode>::const_iterator iter = m_container->begin(); iter != m_container->end(); iter++)
			{
				iter->SaveToWStringList(strList);
			}
		}

		const NSCommon::smart_ptr<std::list<XNode> >	XNodeContainer::container() const
		{
			return m_container;
		}

	} 
} // namespace XML