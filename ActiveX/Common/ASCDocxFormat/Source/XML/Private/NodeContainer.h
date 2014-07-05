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
#ifndef XML_PRIVATE_NODE_CONTAINER_INCLUDE_H_
#define XML_PRIVATE_NODE_CONTAINER_INCLUDE_H_

#include <string>
#include <list>

#include "Node.h"
#include "XNodeContainer.h"
#include "XElementContainer.h"
#include "XTextContainer.h"
#include "property.h"
#include "XSpace.h"
#include "XSingleSource.h"
#include "XWideSource.h"

#include "../../../../../Common/DocxFormat/Source/Base/SmartPtr.h"

namespace XML
{
	class XElement;
	class XComment;
	class XText;

	namespace Private
	{
		class XNamespaceContainer;
		class XList;

		class NodeContainer : public Node
		{
		public:
			NodeContainer();
			NodeContainer(const XNodeContainer& nodes);
			virtual ~NodeContainer();

		public:
			explicit NodeContainer(const XElement& element);
			explicit NodeContainer(const XText& text);
			explicit NodeContainer(const XComment& comment);
			explicit NodeContainer(const XList& list);

		public:
			virtual const bool isElement() const;
			virtual const bool isText() const;
			virtual const bool isComment() const;

		public:
			void fromSource(NSCommon::smart_ptr<XSingleSource> source, const XNamespaceContainer& ns, const XSpace& space);
			void fromSource(NSCommon::smart_ptr<XWideSource> source, const XNamespaceContainer& ns, const XSpace& space);
			virtual const std::string ToString() const;
			virtual const std::wstring ToWString() const;
			virtual void SaveToStringList(std::list<std::string>& strList)const;
			virtual void SaveToWStringList(std::list<std::wstring>& strList)const;

		public:
			template<template<typename T, typename A> class C, typename T, typename A>
			explicit NodeContainer(const C<T, A>& container) : Nodes(),	Elements(Nodes), Texts(Nodes)
			{
				for (C<T, A>::const_iterator i = container.begin(); i != container.end(); ++i)
					Nodes.push_back(Write(*i));
			}

		public:
			void Add(const XNode& node);
			void Add(const XElement& node);
			void Add(const XText& text);
			void Add(const XComment& comment);
			void Add(const XList& list);

		private:
			const bool isComment(NSCommon::smart_ptr<XSingleSource> source);
			void insertComment(NSCommon::smart_ptr<XSingleSource> source);
			const bool isComment(NSCommon::smart_ptr<XWideSource> source);
			void insertComment(NSCommon::smart_ptr<XWideSource> source);

		public:
			XNodeContainer		Nodes;
			XElementContainer	Elements;
			XTextContainer		Texts;
		};
	} 
} 

#endif // XML_PRIVATE_NODE_CONTAINER_INCLUDE_H_