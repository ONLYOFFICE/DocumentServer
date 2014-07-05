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
 
#include "precompiled_docxformat.h"


#include "Shape.h"
#include "ShapeType.h"
#include "Rect.h"
#include "Oval.h"
#include "Roundrect.h"
#include "Line.h"

#include "Group.h"

namespace OOX
{
	namespace Logic
	{
		GroupItem::GroupItem()
		{

		}		

		GroupItem::GroupItem(const Oval& elem) : IItemable<WritingElement>(new Oval(elem))
		{	

		}

		GroupItem::GroupItem(const Rect& elem) : IItemable<WritingElement>(new Rect(elem)) 
		{	
		}


		GroupItem::GroupItem(const Roundrect& elem) : IItemable<WritingElement>(new Roundrect(elem)) 
		{

		}

		GroupItem::GroupItem(const ShapeType& elem) : IItemable<WritingElement>(new ShapeType(elem)) 
		{

		}

		GroupItem::GroupItem(const Shape& elem) : IItemable<WritingElement>(new Shape(elem)) 
		{

		}
	
		GroupItem::GroupItem(const Line& elem) : IItemable<WritingElement>(new Line(elem)) 
		{

		}

		GroupItem::GroupItem(const Group& elem) : IItemable<WritingElement>(new Group(elem)) 
		{

		}

		GroupItem::~GroupItem()
		{

		}

		GroupItem::GroupItem(const XML::XNode& node)
		{
			fromXML(node);
		}

		const GroupItem& GroupItem::operator =(const XML::XNode& node)
		{
			fromXML(node);
			return *this;
		}

		void GroupItem::fromXML(const XML::XNode& node)
		{
			const XML::XElement element(node);

			if (element.XName == "oval")
				m_item.reset(new Oval(element));
			if (element.XName == "rect")
				m_item.reset (new Rect(element));
			if (element.XName == "roundrect")
				m_item.reset (new Roundrect(element));
			if (element.XName == "shapetype")
				m_item.reset (new ShapeType(element));
			if (element.XName == "shape")
				m_item.reset (new Shape(element));
			if (element.XName == "line")
				m_item.reset (new Line(element));
			if (element.XName == "group")
				m_item.reset (new Group(element));
		}

		const XML::XNode GroupItem::toXML() const
		{
		return XML::XElement();
		}
	}

	namespace Logic
	{
		Group::Group()
		{

		}

		Group::~Group()
		{

		}	

		Group::Group(const XML::XNode& node)
		{
			fromXML(node);
		}

		void Group::fromXML(const XML::XNode& node)
		{
			const XML::XElement element(node);

			id			=	element.attribute("id").value();
			spid		=	element.attribute("spid").value();
			style		=	element.attribute("style").value();	
			coordorigin	=	element.attribute("coordorigin").value();
			coordsize	=	element.attribute("coordsize").value();

			for (XML::const_node_iterator i = element.Nodes.begin(); i != element.Nodes.end(); ++i)
			{
				if (i->isElement())
				{
					const XML::XElement grelement(*i);

					
					
					{

					}
					
					{
						items->push_back(GroupItem(*i));
					}
				}
			}
		}

		const XML::XNode Group::toXML() const
		{			
			return XML::XElement();
		}
	} 
}