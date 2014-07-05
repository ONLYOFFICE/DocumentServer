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
#ifndef XML_FILL_INCLUDE_H_
#define XML_FILL_INCLUDE_H_

#include "property.h"
#include "./../XElement.h"
#include "./../Private/XElementContainer.h"

namespace XML
{
	template<class T> void Fill(T& container, const XML::XElement& element)
	{
		for (Private::XElementContainer::const_iterator i = element.Elements.begin(); i != element.Elements.end(); ++i)
		{
			container.push_back(T::value_type(XElement(*i)));
			container.back().this_is_not_xobject_class();
		}
	}


	template<class T> void Fill(property<T>& container, const XML::XElement& element)
	{
		for (Private::XElementContainer::const_iterator i = element.Elements.begin(); i != element.Elements.end(); ++i)
		{
			container->push_back(T::value_type(XElement(*i)));
			container->back().this_is_not_xobject_class();
		}
	}


	template<class T> void Fill(T& container, const XML::XElement& element, const std::string& name)
	{
		for (Private::XElementContainer::const_iterator i = element.Elements.begin(); i != element.Elements.end(); ++i)
		{
			if (XElement(*i)->XName == name)
			{
				container.push_back(T::value_type(XElement(*i)));
				container.back().this_is_not_xobject_class();
			}
		}
	}


	template<class T> void Fill(property<T>& container, const XML::XElement& element, const std::string& name)
	{
		for (Private::XElementContainer::const_iterator i = element.Elements.begin(); i != element.Elements.end(); ++i)
		{
			if (XElement(*i)->XName == name)
			{
				container->push_back(T::value_type(XElement(*i)));
				container->back().this_is_not_xobject_class();
			}
		}
	}


	template<class T> void Fill(T& container, const XML::XElement& element, const std::string& name1, const std::string& name2)
	{
		for (Private::XElementContainer::const_iterator i = element.Elements.begin(); i != element.Elements.end(); ++i)
		{
			const std::string name = XElement(*i)->XName->Name;
			if (name == name1 || name == name2)
			{
				container.push_back(T::value_type(XElement(*i)));
				container.back().this_is_not_xobject_class();
			}
		}
	}


	template<class T> void Fill(property<T>& container, const XML::XElement& element, const std::string& name1, const std::string& name2)
	{
		for (Private::XElementContainer::const_iterator i = element.Elements.begin(); i != element.Elements.end(); ++i)
		{
			const std::string name = XElement(*i)->XName->Name;
			if (name == name1 || name == name2)
			{
				container->push_back(T::value_type(XElement(*i)));
				container->back().this_is_not_xobject_class();
			}
		}
	}


	template<class T> void Fill(T& container, const XML::XElement& element, const std::string& name1, const std::string& name2, const std::string& name3)
	{
		for (Private::XElementContainer::const_iterator i = element.Elements.begin(); i != element.Elements.end(); ++i)
		{
			const std::string name = XElement(*i)->XName->Name;
			if (name == name1 || name == name2 || name == name3)
			{
				container.push_back(T::value_type(XElement(*i)));
				container.back().this_is_not_xobject_class();
			}
		}
	}


	template<class T> void Fill(property<T>& container, const XML::XElement& element, const std::string& name1, const std::string& name2, const std::string& name3)
	{
		for (Private::XElementContainer::const_iterator i = element.Elements.begin(); i != element.Elements.end(); ++i)
		{
			const std::string name = XElement(*i)->XName->Name;
			if (name == name1 || name == name2 || name == name3)
			{
				container->push_back(T::value_type(XElement(*i)));
				container->back().this_is_not_xobject_class();
			}
		}
	}

	template<class T> void Fill(T& container, const XML::XElement& element, const std::string& name1, const std::string& name2, const std::string& name3, const std::string& name4)
	{
		for (Private::XElementContainer::const_iterator i = element.Elements.begin(); i != element.Elements.end(); ++i)
		{
			const std::string name = XElement(*i)->XName->Name;
			if (name == name1 || name == name2 || name == name3 || name == name4)
			{
				container.push_back(T::value_type(XElement(*i)));
				container.back().this_is_not_xobject_class();
			}
		}
	}

	template<class T> void Fill(property<T>& container, const XML::XElement& element, const std::string& name1, const std::string& name2, const std::string& name3, const std::string& name4)
	{
		for (Private::XElementContainer::const_iterator i = element.Elements.begin(); i != element.Elements.end(); ++i)
		{
			const std::string name = XElement(*i)->XName->Name;
			if (name == name1 || name == name2 || name == name3 || name == name4)
			{
				container->push_back(T::value_type(XElement(*i)));
				container->back().this_is_not_xobject_class();
			}
		}
	}

	template<class T> void Fill(T& container, const XML::XElement& element, const std::string& name1, const std::string& name2, const std::string& name3, const std::string& name4, const std::string& name5)
	{
		for (Private::XElementContainer::const_iterator i = element.Elements.begin(); i != element.Elements.end(); ++i)
		{
			const std::string name = XElement(*i)->XName->Name;
			if (name == name1 || name == name2 || name == name3 || name == name4 || name == name5)
			{
				container.push_back(T::value_type(XElement(*i)));
				container.back().this_is_not_xobject_class();
			}
		}
	}

	template<class T> void Fill(property<T>& container, const XML::XElement& element, const std::string& name1, const std::string& name2, const std::string& name3, const std::string& name4, const std::string& name5)
	{
		for (Private::XElementContainer::const_iterator i = element.Elements.begin(); i != element.Elements.end(); ++i)
		{
			const std::string name = XElement(*i)->XName->Name;
			if (name == name1 || name == name2 || name == name3 || name == name4 || name == name5)
			{
				container->push_back(T::value_type(XElement(*i)));
				container->back().this_is_not_xobject_class();
			}
		}
	}

	template<class T> void Fill(T& container, const XML::XElement& element, const std::string& name1, const std::string& name2, const std::string& name3, const std::string& name4, const std::string& name5, const std::string& name6)
	{
		for (Private::XElementContainer::const_iterator i = element.Elements.begin(); i != element.Elements.end(); ++i)
		{
			const std::string name = XElement(*i)->XName->Name;
			if (name == name1 || name == name2 || name == name3 || name == name4 || name == name5 || name == name6)
			{
				container.push_back(T::value_type(XElement(*i)));
				container.back().this_is_not_xobject_class();
			}
		}
	}

	template<class T> void Fill(property<T>& container, const XML::XElement& element, const std::string& name1, const std::string& name2, const std::string& name3, const std::string& name4, const std::string& name5, const std::string& name6)
	{
		for (Private::XElementContainer::const_iterator i = element.Elements.begin(); i != element.Elements.end(); ++i)
		{
			const std::string name = XElement(*i)->XName->Name;
			if (name == name1 || name == name2 || name == name3 || name == name4 || name == name5 || name == name6)
			{
				container->push_back(T::value_type(XElement(*i)));
				container->back().this_is_not_xobject_class();
			}
		}
	}

	template<class T> void Fill(T& container, const XML::XElement& element, const std::string& name1, const std::string& name2, const std::string& name3, const std::string& name4, const std::string& name5, const std::string& name6, const std::string& name7)
	{
		for (Private::XElementContainer::const_iterator i = element.Elements.begin(); i != element.Elements.end(); ++i)
		{
			const std::string name = XElement(*i)->XName->Name;
			if (name == name1 || name == name2 || name == name3 || name == name4 || name == name5 || name == name6 || name == name7)
			{
				container.push_back(T::value_type(XElement(*i)));
				container.back().this_is_not_xobject_class();
			}
		}
	}

	template<class T> void Fill(property<T>& container, const XML::XElement& element, const std::string& name1, const std::string& name2, const std::string& name3, const std::string& name4, const std::string& name5, const std::string& name6, const std::string& name7)
	{
		for (Private::XElementContainer::const_iterator i = element.Elements.begin(); i != element.Elements.end(); ++i)
		{
			const std::string name = XElement(*i)->XName->Name;
			if (name == name1 || name == name2 || name == name3 || name == name4 || name == name5 || name == name6 || name == name7)
			{
				container->push_back(T::value_type(XElement(*i)));
				container->back().this_is_not_xobject_class();
			}
		}
	}

	template<class T> void Fill(T& container, const XML::XElement& element, const std::string& name1, const std::string& name2, const std::string& name3, const std::string& name4, const std::string& name5, const std::string& name6, const std::string& name7, const std::string& name8)
	{
		for (Private::XElementContainer::const_iterator i = element.Elements.begin(); i != element.Elements.end(); ++i)
		{
			const std::string name = XElement(*i)->XName->Name;
			if (name == name1 || name == name2 || name == name3 || name == name4 || name == name5 || name == name6 || name == name7 || name == name8)
			{
				container.push_back(T::value_type(XElement(*i)));
				container.back().this_is_not_xobject_class();
			}
		}
	}

	template<class T> void Fill(property<T>& container, const XML::XElement& element, const std::string& name1, const std::string& name2, const std::string& name3, const std::string& name4, const std::string& name5, const std::string& name6, const std::string& name7, const std::string& name8)
	{
		for (Private::XElementContainer::const_iterator i = element.Elements.begin(); i != element.Elements.end(); ++i)
		{
			const std::string name = XElement(*i)->XName->Name;
			if (name == name1 || name == name2 || name == name3 || name == name4 || name == name5 || name == name6 || name == name7 || name == name8)
			{
				container->push_back(T::value_type(XElement(*i)));
				container->back().this_is_not_xobject_class();
			}
		}
	}

	template<class T> void Fill(T& container, const XML::XElement& element, const std::string& name1, const std::string& name2, const std::string& name3, const std::string& name4, const std::string& name5, const std::string& name6, const std::string& name7, const std::string& name8, const std::string& name9)
	{
		for (Private::XElementContainer::const_iterator i = element.Elements.begin(); i != element.Elements.end(); ++i)
		{
			const std::string name = XElement(*i)->XName->Name;
			if (name == name1 || name == name2 || name == name3 || name == name4 || name == name5 || name == name6 || name == name7 || name == name8 || name == name9)
			{
				container.push_back(T::value_type(XElement(*i)));
				container.back().this_is_not_xobject_class();
			}
		}
	}

	template<class T> void Fill(property<T>& container, const XML::XElement& element, const std::string& name1, const std::string& name2, const std::string& name3, const std::string& name4, const std::string& name5, const std::string& name6, const std::string& name7, const std::string& name8, const std::string& name9)
	{
		for (Private::XElementContainer::const_iterator i = element.Elements.begin(); i != element.Elements.end(); ++i)
		{
			const std::string name = XElement(*i)->XName->Name;
			if (name == name1 || name == name2 || name == name3 || name == name4 || name == name5 || name == name6 || name == name7 || name == name8 || name == name9)
			{
				container->push_back(T::value_type(XElement(*i)));
				container->back().this_is_not_xobject_class();
			}
		}
	}

	template<class T> void Fill(T& container, const XML::XElement& element, const std::string& name1, const std::string& name2, const std::string& name3, const std::string& name4, const std::string& name5, const std::string& name6, const std::string& name7, const std::string& name8, const std::string& name9, const std::string& name10)
	{
		for (Private::XElementContainer::const_iterator i = element.Elements.begin(); i != element.Elements.end(); ++i)
		{
			const std::string name = XElement(*i)->XName->Name;
			if (name == name1 || name == name2 || name == name3 || name == name4 || name == name5 || name == name6 || name == name7 || name == name8 || name == name9 || name == name10)
			{
				container.push_back(T::value_type(XElement(*i)));
				container.back().this_is_not_xobject_class();
			}
		}
	}

	template<class T> void Fill(property<T>& container, const XML::XElement& element, const std::string& name1, const std::string& name2, const std::string& name3, const std::string& name4, const std::string& name5, const std::string& name6, const std::string& name7, const std::string& name8, const std::string& name9, const std::string& name10)
	{
		for (Private::XElementContainer::const_iterator i = element.Elements.begin(); i != element.Elements.end(); ++i)
		{
			const std::string name = XElement(*i)->XName->Name;
			if (name == name1 || name == name2 || name == name3 || name == name4 || name == name5 || name == name6 || name == name7 || name == name8 || name == name9 || name == name10)
			{
				container->push_back(T::value_type(XElement(*i)));
				container->back().this_is_not_xobject_class();
			}
		}
	}

} 

#endif // XML_FILL_INCLUDE_H_