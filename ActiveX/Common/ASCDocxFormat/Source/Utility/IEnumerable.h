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
#ifndef IENUMERABLE_INCLUDE_H_
#define IENUMERABLE_INCLUDE_H_

#include <vector>


template<typename Type, template<typename Type, typename Allocator> class Container = std::vector, class Allocator = std::allocator<Type> >
class IEnumerable
{
public:
	IEnumerable() {}
	~IEnumerable() {}

public:
	void add(const Type& value) {push_back(value);}
	void push_back(const Type& value) {m_items.push_back(value);}
	void clear() {m_items.clear();}
	const size_t size() const {return m_items.size();}
	const bool empty() const {return m_items.empty();}

public:
	typedef typename Container<Type, Allocator>::iterator iterator;
	typedef typename Container<Type, Allocator>::const_iterator const_iterator;

public:
	iterator begin()	{return m_items.begin();}
	iterator end()		{return m_items.end();}
	const_iterator begin()	const {return m_items.begin();}
	const_iterator end()		const {return m_items.end();}

protected:
	Container<Type, Allocator>	m_items;
};

namespace Odt
{
	template<typename _Iter, typename _Pred>
	_Iter find_if(_Iter iterBegin, _Iter iterEnd, _Pred pred)
	{
		_Iter iter = std::find_if(iterBegin, iterEnd, pred);
			
		if (iter < iterBegin || iter >= iterEnd)
		{
			
			return iterBegin;
		}
		
		return iter;
	}
}

#endif // IENUMERABLE_INCLUDE_H_