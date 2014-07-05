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
#ifndef XML_PRIVATE_XLIST_INCLUDE_H_
#define XML_PRIVATE_XLIST_INCLUDE_H_

#include "XAttributeContainer.h"
#include "XNamespaceContainer.h"
#include "XNodeContainer.h"
#include "property.h"


namespace XML
{
	class XText;
	class XElement;
	class XComment;
	class XContainer;
	class XNode;

	namespace Private
	{
		class XList
		{
		public:
			XList();
			XList(const XAttribute& attribute);
			XList(const XNamespace& ns);
			XList(const XText& text);
			XList(const XElement& element);
			XList(const XComment& comment);
			XList(const XML::XContainer& container);
			XList(const XNode& node);

		public:
			XList& Add(const XList& list);
			XList& Add(const XAttribute& attribute);
			XList& Add(const XNamespace& ns);
			XList& Add(const XText& text);
			XList& Add(const XElement& element);
			XList& Add(const XComment& comment);
			XList& Add(const XML::XContainer& container);
			XList& Add(const XNode& node);

		public:
			property<XAttributeContainer> Attributes;
			property<XNamespaceContainer> Namespaces;
			property<XNodeContainer>			Nodes;
		};
	} 

	template<class T>
	Private::XList& operator ,(Private::XList& rhs, const T& lhs)
	{
		return rhs.Add(lhs);
	}

	template<class T>
	Private::XList operator ,(const XNamespace& rhs, const T& lhs)
	{
		return Private::XList(rhs).Add(lhs);
	}

	template<class T>
	Private::XList operator ,(const XAttribute& rhs, const T& lhs)
	{
		return Private::XList(rhs).Add(lhs);
	}

	template<class T>
	Private::XList operator ,(const XText& rhs, const T& lhs)
	{
		return Private::XList(rhs).Add(lhs);
	}

	template<class T>
	Private::XList operator ,(const XElement& rhs, const T& lhs)
	{
		return Private::XList(rhs).Add(lhs);
	}

	template<class T>
	Private::XList operator ,(const XComment& rhs, const T& lhs)
	{
		return Private::XList(rhs).Add(lhs);
	}

	template<class T>
	Private::XList operator ,(const XContainer& rhs, const T& lhs)
	{
		return Private::XList(rhs).Add(lhs);
	}

	template<class T>
	Private::XList operator ,(const XNode& rhs, const T& lhs)
	{
		return Private::XList(rhs).Add(lhs);
	}


	template<class T>
	Private::XList& operator +(Private::XList& rhs, const T& lhs)
	{
		return rhs.Add(lhs);
	}

	template<class T>
	Private::XList operator +(const XAttribute& rhs, const T& lhs)
	{
		return Private::XList(rhs).Add(lhs);
	}

	template<class T>
	Private::XList operator +(const XNamespace& rhs, const T& lhs)
	{
		return Private::XList(rhs).Add(lhs);
	}

	template<class T>
	Private::XList operator +(const XText& rhs, const T& lhs)
	{
		return Private::XList(rhs).Add(lhs);
	}

	template<class T>
	Private::XList operator +(const XElement& rhs, const T& lhs)
	{
		return Private::XList(rhs).Add(lhs);
	}

	template<class T>
	Private::XList operator +(const XComment& rhs, const T& lhs)
	{
		return Private::XList(rhs).Add(lhs);
	}

	template<class T>
	Private::XList operator +(const XContainer& rhs, const T& lhs)
	{
		return Private::XList(rhs).Add(lhs);
	}

	template<class T>
	Private::XList operator +(const XNode& rhs, const T& lhs)
	{
		return Private::XList(rhs).Add(lhs);
	}

} 

#endif // XML_PRIVATE_XLIST_INCLUDE_H_