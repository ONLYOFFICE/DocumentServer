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


#include "XList.h"
#include "./../XText.h"
#include "./../XElement.h"
#include "./../XComment.h" 
#include "./../XContainer.h"


namespace XML
{
	namespace Private
	{

		XList::XList()
		{
		}


		XList::XList(const XAttribute& attribute)
		{
			Attributes->push_back(attribute);
		}


		XList::XList(const XNamespace& ns)
		{
			Namespaces->push_back(ns);
		}


		XList::XList(const XText& text)
		{
			Nodes->push_back(text);
		}


		XList::XList(const XElement& element)
		{
			Nodes->push_back(element);
		}


		XList::XList(const XComment& comment)
		{
			Nodes->push_back(comment);
		}


		XList::XList(const XML::XContainer& container)
		{
			Nodes = container->Nodes;
		}


		XList::XList(const XNode& node)
		{
			Nodes->push_back(node);
		}


		XList& XList::Add(const XList& list)
		{
			Attributes->merge(list.Attributes);
			Namespaces->merge(list.Namespaces);
			Nodes->merge(list.Nodes);
			return *this;
		}


		XList& XList::Add(const XAttribute& attribute)
		{
			Attributes->push_back(attribute);
			return *this;
		}


		XList& XList::Add(const XNamespace& ns)
		{
			Namespaces->push_back(ns);
			return *this;
		}


		XList& XList::Add(const XText& text)
		{
			Nodes->push_back(text);
			return *this;
		}


		XList& XList::Add(const XElement& element)
		{
			Nodes->push_back(element);
			return *this;
		}


		XList& XList::Add(const XComment& comment)
		{
			Nodes->push_back(comment);
			return *this;
		}


		XList& XList::Add(const XML::XContainer& container)
		{
			Nodes->push_back(container);
			return *this;
		}


		XList& XList::Add(const XNode& node)
		{
			Nodes->push_back(node);
			return *this;
		}

	} 
} // namespace XML