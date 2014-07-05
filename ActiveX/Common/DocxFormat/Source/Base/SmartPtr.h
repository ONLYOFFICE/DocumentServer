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
#include "Base.h"

namespace NSCommon
{
	template <typename Type> 
	class smart_ptr
	{
	protected:
		Type*			m_pData;
		mutable LONG*	m_pCountRef;
		
	public:
		smart_ptr()
		{
			m_pData		= NULL;
			m_pCountRef = NULL;
		}
		smart_ptr(Type* pPointer)
		{
			m_pData		= pPointer;
			m_pCountRef = new LONG(1);
		}
		smart_ptr(const smart_ptr<Type>& pPointer)
		{
			m_pData		= NULL;
			m_pCountRef	= NULL;
			*this = pPointer;
		}
		~smart_ptr()
		{
			Release();
		}

		AVSINLINE void Release()
		{
			if (!IsInit() || (NULL == m_pCountRef))
				return;

			*m_pCountRef -= 1;
			if (0 >= *m_pCountRef)
			{
				delete m_pData;
				delete m_pCountRef;
			}
			m_pData		= NULL;
			m_pCountRef	= NULL;
		}
		AVSINLINE void AddRef()
		{
			if (!IsInit() || (NULL == m_pCountRef))
				return;
			*m_pCountRef += 1;
		}

	public:
		smart_ptr<Type>& operator=(const Type& oSrc)
		{
			Release();

			m_pData		= new Type(oSrc);
			m_pCountRef = new LONG(1);

			return *this;
		}
		smart_ptr<Type>& operator=(Type* pType)
		{
			Release();
			
			m_pData		= pType;
			m_pCountRef = new LONG(1);

			return *this;
		}
		smart_ptr<Type>& operator=(const smart_ptr<Type>& oSrc)
		{
			Release();

			if ((NULL == oSrc.m_pData) || (NULL == oSrc.m_pCountRef))
				return *this;
			
			*oSrc.m_pCountRef += 1;
			Attach(oSrc.m_pData, oSrc.m_pCountRef);
			return *this;
		}

	public:

		AVSINLINE bool IsInit() const
		{ 
			return (NULL != m_pData); 
		}
		AVSINLINE bool is_init() const
		{
			return IsInit();
		}

		template<class T> AVSINLINE const bool is()const
		{
			if (!IsInit())
				return false;
			T* pResult = dynamic_cast<T*>(const_cast<Type*>(m_pData));
			return (NULL != pResult);
		}
		template<class T> AVSINLINE const T& as()const
		{
			T* pResult = dynamic_cast<T*>(const_cast<Type*>(m_pData));
			return *pResult;
		}
		template<class T> AVSINLINE T& as()
		{
			T* pResult = dynamic_cast<T*>(const_cast<Type*>(m_pData));
			return *pResult;
		}

		template <typename T>
		AVSINLINE void Attach(T* pCast, const LONG* pCountRef)
		{
			m_pData		= pCast;
			m_pCountRef	= const_cast<LONG*>(pCountRef);
		}

		template<typename T> 
		AVSINLINE smart_ptr<T> smart_dynamic_cast()const
		{
			smart_ptr<T> new_type;
			
			if ((NULL == m_pData) || (NULL == m_pCountRef))
				return new_type;
			
			T* pCast = dynamic_cast<T*>(m_pData);

			if (NULL == pCast)
				return new_type;

			*m_pCountRef += 1;

			new_type.Attach(pCast, m_pCountRef);
			
			return new_type;
		}

		AVSINLINE Type& operator*()  { return *m_pData; }
		AVSINLINE Type* operator->() { return  m_pData; }

		AVSINLINE const Type& operator*()  const { return *m_pData; }
		AVSINLINE const Type* operator->() const { return  m_pData; }

		AVSINLINE const Type& get() { return  *m_pData; } const
		
		AVSINLINE void reset(Type* pPointer = NULL)
		{
			*this = pPointer;
		}
	};

	template <typename T>
	static AVSINLINE void normalize_value(T& value, const T& min, const T& max)
	{
		if (value < min)
			value = min;
		else if (value > max)
			value = max;
	}
}