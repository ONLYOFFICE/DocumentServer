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


#include "XNode.h"
#include "XText.h"
#include "XComment.h"
#include "XElement.h"
#include "XContainer.h"


namespace XML
{

	XNode::XNode()
	{
	}


	XNode::XNode(const XText& text)
		: base(text)
	{
	}


	XNode::XNode(const XElement& element)
		: base(element)
	{
	}


	XNode::XNode(const XComment& comment)
		: base(comment)
	{
	}


	XNode::XNode(const XContainer& container)
		: base(container)
	{
	}


	const bool XNode::isElement() const
	{
		return m_ptr->isElement();
	}


	const bool XNode::isText() const
	{
		return m_ptr->isText();
	}


	const bool XNode::isComment() const
	{
		return m_ptr->isComment();
	}


	const std::string XNode::ToString() const
	{
		return m_ptr->ToString();
	}


	const std::wstring XNode::ToWString() const
	{
		return m_ptr->ToWString();
	}


	void XNode::SaveToStringList(std::list<std::string>& strList)const
	{
		m_ptr->SaveToStringList(strList);
	}


	void XNode::SaveToWStringList(std::list<std::wstring>& strList)const
	{
		m_ptr->SaveToWStringList(strList);
	}

} // namespace XML