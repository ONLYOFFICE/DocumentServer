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


#include "XElementContainer.h"
#include "XNodeContainer.h"
#include "./../XNode.h"
#include "./../XElement.h"
#include "./../XName.h"
#include "NullXElement.h"

namespace XML
{
	namespace Private
	{
		static NullXElement nullXElement;

		XElementContainer::XElementContainer(const XNodeContainer& nodes) : m_container(nodes.container())
		{
		}

		const bool XElementContainer::empty() const
		{
			return size() == 0;
		}

		const size_t XElementContainer::size() const
		{
			size_t size = 0;
			for (const_iterator i = begin(); i != end(); ++i)
				++size;
			return size;
		}

		void XElementContainer::push_back(const XElement& element)
		{
			if (element.is_init() && element.exist())
			{
				m_container->push_back(element);
			}
		}

		void XElementContainer::Add(const XElement& element)
		{
			push_back(element);
		}

		const bool XElementContainer::exist(const XName& xname) const
		{
			if (m_container.IsInit())
			{
				const std::list<XNode>& container = m_container.operator*();
				for (std::list<XNode>::const_iterator i = container.begin(); i != container.end(); ++i)
				{
					if(i->isElement())
					{
						if (XElement(*i)->XName == xname)
							return true;
					}
				}
			}
			return false;
		}

		XElement XElementContainer::operator[] (const XName& xname)
		{
			const std::list<XNode>& container = m_container.operator*();
			for (std::list<XNode>::const_iterator i = container.begin(); i != container.end(); ++i)
			{
				if(i->isElement())
				{
					if (XElement(*i)->XName->Equal(xname))
						return *i;
				}
			}
			for (std::list<XNode>::const_iterator i = container.begin(); i != container.end(); ++i)
			{
				if(i->isElement())
				{
					if (XElement(*i)->XName == xname)
						return *i;
				}
			}
			return nullXElement;
		}

		const XElement XElementContainer::operator[] (const XName& xname) const
		{
			const std::list<XNode>& container = m_container.operator*();
			for (std::list<XNode>::const_iterator i = container.begin(); i != container.end(); ++i)
			{
				if(i->isElement())
				{
					if (XElement(*i)->XName->Equal(xname))
						return *i;
				}
			}
		
			for (std::list<XNode>::const_iterator i = container.begin(); i != container.end(); ++i)
			{
				if(i->isElement())
				{
					if (XElement(*i)->XName == xname)
						return *i;
				}
			}
			
			return nullXElement;
		}

		XElement XElementContainer::get(const XName& xname, const std::string& value)
		{
			for (iterator i = begin(); i != end(); ++i)
			{
				XElement element(*i);
				if (element.Attributes.exist(xname) && element.Attributes[xname].value().ToString() == value)
					return *i;
			}
			return nullXElement;
		}

		const XElement XElementContainer::get(const XName& xname, const std::string& value) const
		{
			for (const_iterator i = begin(); i != end(); ++i)
			{
				XElement element(*i);
				if (element.Attributes.exist(xname) && element.Attributes[xname].value().ToString() == value)
					return *i;
			}
			return nullXElement;
		}

		XElementContainer::iterator XElementContainer:: begin()
		{
			return m_container->begin();
		}

		XElementContainer::iterator XElementContainer::end()
		{
			return m_container->end();
		}

		XElementContainer::const_iterator XElementContainer::begin() const
		{
			return m_container->begin();
		}

		XElementContainer::const_iterator XElementContainer::end() const
		{
			return m_container->end();
		}

		const XNamespaceContainer XElementContainer::usedNamespace() const
		{
			XNamespaceContainer container;

			for (const_iterator i = begin(); i != end(); ++i)
				container.merge(XElement(*i)->usedNamespace());

			return container;
		}

	} 
} // namespace XML