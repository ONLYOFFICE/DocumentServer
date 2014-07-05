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
#ifndef XML_XELEMENT_INCLUDE_H_
#define XML_XELEMENT_INCLUDE_H_

#include <string>
#include <list>

#include "Private/XPointer.h"
#include "Private/Element.h"
#include "property.h"
#include "setter.h"
#include "getter.h"
#include "Private/XString.h"
#include "Private/XNamespaceContainer.h"
#include "Private/XSpace.h"
#include "Private/XSingleSource.h"
#include "Private/XWideSource.h"

#include "../../../../Common/DocxFormat/Source/Base/SmartPtr.h"

namespace XML
{
	class XAttribute;
	class XNamespace;
	class XName;
	class XNode;
	class XText;
	class XContainer;
	class XObject;

	namespace Private
	{
		class XList;
		class XAttributeContainer;
		class XNodeContainer;
		class XElementContainer;
		class XTextContainer;
		class NullXElement;
	}

	class XElement : public Private::XPointer<Private::Element>
	{
	public:
		XElement();
		XElement(const Private::NullXElement&);
		explicit XElement(const XName& xname);
		XElement(const XName& xname, const Private::XList& list);
		XElement(NSCommon::smart_ptr<Private::XSingleSource> source, const Private::XNamespaceContainer& ns, const Private::XSpace& space);
		XElement(NSCommon::smart_ptr<Private::XWideSource> source, const Private::XNamespaceContainer& ns, const Private::XSpace& space);
		const XElement& operator= (const XElement& rhs);
		XElement(const XNode& xnode);

	public:
		template<class T>
		operator const nullable__<T>() const
		{
			if (exist())
				return T(*this);
			return nullable__<T>();
		}

		template<class T, class S, class G>
		operator const property<T, S, G>() const
		{
			return T(*this);
		}

		template<class T, class S, class G>
		operator const nullable_property<T, S, G>() const
		{
			if (exist())
				return T(*this);
			return nullable_property<T, S, G>();
		}

	public:
		XElement const* const	operator->() const	{return this;}
		XElement*							operator->()				{return this;}

	public:
		void Save(const OOX::CPath& path) const;

	public:
		void fromSource(NSCommon::smart_ptr<Private::XSingleSource> source, const Private::XNamespaceContainer& ns, const Private::XSpace& space);
		void fromSource(NSCommon::smart_ptr<Private::XWideSource> source, const Private::XNamespaceContainer& ns, const Private::XSpace& space);
		const std::string ToString() const;
		const std::wstring ToWString() const;
		virtual void SaveToStringList(std::list<std::string>& strList)const;
		virtual void SaveToWStringList(std::list<std::wstring>& strList)const;

	public:
		const bool exist() const;
		const Private::XString text() const;
		const Private::XNamespaceContainer usedNamespace() const;

	public:
		void Add(const XAttribute& attribute);
		void Add(const XNamespace& ns);
		void Add(const XNode& node);
		void Add(const XElement& element);
		void Add(const XText& text);
		void Add(const XContainer& container);
		void Add(const Private::XList& list);

	public:
		XAttribute& attribute(const XName& xname);
		const XAttribute& attribute(const XName& xname) const;

		XElement element(const XName& xname);
		const XElement element(const XName& xname) const;

		XElement element(const XName& xname, const std::string& value);
		const XElement element(const XName& xname, const std::string& value) const;

	public:
		property<XName>&							XName;
		Private::XNamespaceContainer& Namespaces;
		Private::XAttributeContainer&	Attributes;
		Private::XNodeContainer&			Nodes;
		Private::XElementContainer&		Elements;
		Private::XTextContainer&			Texts;
		property<Private::XSpace>&		Space;
	};
} 


template<typename T>
const nullable__<T>& nullable_setter(nullable__<T>& lhs, const XML::XElement& rhs)
{
	return ::nullable_setter(lhs, nullable__<T>(rhs));
}


template<typename T, class S, class G>
const property<T, S, G>& property_setter(property<T, S, G>& lhs, const XML::XElement& rhs)
{
	return ::property_setter(lhs, T(rhs));
}


template<typename T, class S, class G>
const nullable_property<T, S, G>& nullable_property_setter(nullable_property<T, S, G>& lhs, const XML::XElement& rhs)
{
	return ::nullable_property_setter(lhs, nullable_property<T, S, G>(rhs));
}


#endif // XML_XELEMENT_INCLUDE_H_