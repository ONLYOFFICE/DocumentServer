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
#ifndef XML_PRIVATE_XCONTAINER_INCLUDE_H_
#define XML_PRIVATE_XCONTAINER_INCLUDE_H_

#include <algorithm>
#include <string>
#include <list>

namespace XML
{
	namespace Private
	{
		template<class T>
		class XContainer
		{
		public:
			void push_back(const T& value);
			void Add(const T& value);
			const bool content(const T& other) const;
			void merge(const XContainer<T>& other);

			const size_t size() const;
			const bool empty() const;

			XContainer<T> const* const	operator->() const	{return this;}
			XContainer<T>*							operator->()				{return this;}

		public:
			const std::string ToString() const;
			const std::wstring ToWString() const;
			virtual void SaveToStringList(std::list<std::string>& strList)const;
			virtual void SaveToWStringList(std::list<std::wstring>& strList)const;

		protected:
			std::list<T> m_container;
			
		};


		template<class T>
		void XContainer<T>::push_back(const T& value)
		{
			if (value.is_init() && !content(value))
				m_container.push_back(value);
				
		}


		template<class T>
		void XContainer<T>::Add(const T& value)
		{
			push_back(value);
		}


		template<class T>
		const bool XContainer<T>::content(const T& other) const
		{
			for(std::list<T>::const_iterator current = m_container.begin(); current != m_container.end(); current++)
			{
				if(*(*current) == *other)
					return true;
			}
			return false;
		}


		template<class T>
		void XContainer<T>::merge(const XContainer<T>& other)
		{
			for(std::list<T>::const_iterator current = other.m_container.begin(); current != other.m_container.end(); current++)
				push_back(*current);
		}


		template<class T>
		const size_t XContainer<T>::size() const
		{
			return m_container.size();
		}


		template<class T>
		const bool XContainer<T>::empty() const 
		{
			return m_container.empty();
		}


		template<class T>
		const std::string XContainer<T>::ToString() const
		{
			std::string result;
			for(std::list<T>::const_iterator current = m_container.begin(); current != m_container.end(); current++)
			{
				result += " ";
				result += (*current)->ToString();
			}
			return result;
		}

		template<class T>
		const std::wstring XContainer<T>::ToWString() const
		{
			std::wstring result;
			for(std::list<T>::const_iterator current = m_container.begin(); current != m_container.end(); current++)
			{
				result += L" ";
				result += (*current)->ToWString();
			}
			return result;
		}

		template<class T>
		void XContainer<T>::SaveToStringList(std::list<std::string>& strList)const
		{
			for(std::list<T>::const_iterator current = m_container.begin(); current != m_container.end(); current++)
			{
				strList.push_back(" ");
				(*current)->SaveToStringList(strList);
			}
		}


		template<class T>
		void XContainer<T>::SaveToWStringList(std::list<std::wstring>& strList)const
		{
			for(std::list<T>::const_iterator current = m_container.begin(); current != m_container.end(); current++)
			{
				strList.push_back(L" ");
				(*current)->SaveToWStringList(strList);
			}
		}

	} 
} 

#endif // XML_PRIVATE_XCONTAINER_INCLUDE_H_