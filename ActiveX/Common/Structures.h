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
 #ifndef STRUCTURES
#define STRUCTURES

#if _MSC_VER >= 1000
#pragma once
#endif 

#ifndef max
#define max(a,b)            (((a) > (b)) ? (a) : (b))
#endif
#ifndef min
#define min(a,b)            (((a) < (b)) ? (a) : (b))
#endif

namespace Structures
{
	struct POINTI
	{
		int x;
		int y;
		
		POINTI()
		{
			x = y = 0;
		}
		POINTI(int _x, int _y)
		{
			x = _x;
			y = _y;
		}
		POINTI(const POINTI& point)
		{
			operator= (point);
		}
		POINTI(const POINT& point)
		{
			operator= (point);
		}
		
		POINTI& operator= (const POINTI& point)
		{
			x = point.x;
			y = point.y;

			return *this;
		}
		POINTI& operator= (const POINT& point)
		{
			x = point.x;
			y = point.y;

			return *this;
		}
		operator POINT() const
		{
			POINT point;

			point.x = x;
			point.y = y;

			return point;
		}
		
		friend BOOL operator== (const POINTI& point1, const POINTI& point2)
		{
			return (point1.x == point2.x && point1.y == point2.y);
		}
		friend BOOL operator!= (const POINTI& point1, const POINTI& point2)
		{
			return (point1.x != point2.x || point1.y != point2.y);
		}
	
		void Create(int _x, int _y)
		{
			x = _x;
			y = _y;
		}
	};
	struct POINTD
	{
		double x;
		double y;
	
		POINTD()
		{
			x = y = 0.0;
		}
		POINTD(double _x, double _y)
		{
			x = _x;
			y = _y;
		}
		POINTD(const POINTD& point)
		{
			operator= (point);
		}
		
		POINTD& operator= (const POINTD& point)
		{
			x = point.x;
			y = point.y;

			return *this;
		}
		
		void Create(double _x, double _y)
		{
			x = _x;
			y = _y;
		}
	};
	struct RECTI
	{
		int left;
		int top;
		int right;
		int bottom;
		
		RECTI()
		{
			left = top = right = bottom = 0;
		}
		RECTI(int x, int y)
		{
			left = right = x;
			top = bottom = y;
		}
		RECTI(int _left, int _top, int _right, int _bottom)
		{
			left = _left;
			top = _top;
			right = _right;
			bottom = _bottom;
		}
		RECTI(const RECTI& rect)
		{
			operator= (rect);
		}
		RECTI(const RECT& rect)
		{
			operator= (rect);
		}
		
		RECTI& operator= (const RECT& rect)
		{
			left = rect.left;
			top = rect.top;
			right = rect.right;
			bottom = rect.bottom;

			return *this;
		}
		RECTI& operator= (const RECTI& rect)
		{
			left = rect.left;
			top = rect.top;
			right = rect.right;
			bottom = rect.bottom;

			return *this;
		}
		
		friend BOOL operator== (const RECTI& rect1, const RECTI& rect2)
		{
			return (rect1.left == rect2.left && rect1.top == rect2.top && rect1.right == rect2.right && rect1.bottom == rect2.bottom);
		}
		friend BOOL operator!= (const RECTI& rect1, const RECTI& rect2)
		{
			return (rect1.left != rect2.left || rect1.top != rect2.top || rect1.right != rect2.right || rect1.bottom != rect2.bottom);
		}
	
		void Normalize()
		{
			RECTI rect = *this;

			if (left > right)
			{
				right = rect.left;
				left = rect.right;
			}

			if (top > bottom)
			{
				bottom = rect.top;
				top = rect.bottom;
			}
		}
		int GetWidth()
		{
			return right - left;
		}
		int GetHeight()
		{
			return bottom - top;
		}
	
		BOOL IsPointInside(const POINTI& point)
		{
			Normalize();

			if (point.x >= left && point.x <= right && point.y >= top && point.y <= bottom)
				return TRUE;

			return FALSE;
		}
		POINTI GetCenter()
		{
			return POINTI((left + right)/2, (top + bottom)/2);
		}
		void SetCener(int x, int y)
		{
			int cx = (left + right)/2;
			int cy = (top + bottom)/2;

			left = x + (left - cx);
			top = y + (top - cy);
			right = x + (right - cx);
			bottom = y + (bottom - cy);
		}
		void Offset(int x, int y)
		{
			left += x;
			top += y;
			right += x;
			bottom += y;
		}
	};
	struct RECTD
	{
		double left;
		double top;
		double right;
		double bottom;
		
		RECTD()
		{
			left = top = right = bottom = 0.0;
		}
		RECTD(double x, double y)
		{
			left = right = x;
			top = bottom = y;
		}
		RECTD(double _left, double _top, double _right, double _bottom)
		{
			left = _left;
			top = _top;
			right = _right;
			bottom = _bottom;
		}
		RECTD(const RECTD& rect)
		{
			operator= (rect);
		}
		RECTD(const RECTI& rect)
		{
			operator= (rect);
		}
		RECTD(const RECT& rect)
		{
			operator= (rect);
		}
				
		RECTD& operator= (const RECTI& rect)
		{
			left = rect.left;
			top = rect.top;
			right = rect.right;
			bottom = rect.bottom;

			return *this;
		}
		RECTD& operator= (const RECTD& rect)
		{
			left = rect.left;
			top = rect.top;
			right = rect.right;
			bottom = rect.bottom;

			return *this;
		}
		RECTD& operator= (const RECT& rect)
		{
			left = rect.left;
			top = rect.top;
			right = rect.right;
			bottom = rect.bottom;

			return *this;
		}
		
		void Normalize()
		{
			RECTD rect = *this;

			if (left > right)
			{
				right = rect.left;
				left = rect.right;
			}

			if (top > bottom)
			{
				bottom = rect.top;
				top = rect.bottom;
			}
		}
		double GetWidth()
		{
			return right - left;
		}
		double GetHeight()
		{
			return bottom - top;
		}
		BOOL IsPointInside(const POINTD& point)
		{
			Normalize();

			if (point.x >= left && point.x <= right && point.y >= top && point.y <= bottom)
				return TRUE;

			return FALSE;
		}
		POINTD GetCenter()
		{
			return POINTD(0.5*(left + right), 0.5*(top + bottom));
		}
		void SetCenter(double x, double y)
		{
			double cx = 0.5*(left + right);
			double cy = 0.5*(top + bottom);

			left = x + (left - cx);
			top = y + (top - cy);
			right = x + (right - cx);
			bottom = y + (bottom - cy);
		}
		void Offset(double x, double y)
		{
			left += x;
			top += y;
			right += x;
			bottom += y;
		}
	};
}

namespace Templates
{
	template<typename E>
	class CArray
	{
	public:
		CArray()
			: m_pData(NULL)
			, m_nSize(0)
			, m_nMaxSize(0)
			, m_nGrowBy(0)
		{
		}
		~CArray()
		{
			RemoveAll();
		}

		int GetCount() const
		{
			return m_nSize;
		}
		BOOL IsEmpty() const
		{
			return (0>=m_nSize);
		}
		BOOL SetCount( int nNewSize, int nGrowBy = -1 )
		{
			if (-1!=nGrowBy)
			{
				m_nGrowBy = nGrowBy;  
			}

			if (0==nNewSize)
			{
				if(NULL!=m_pData)
				{
					CallDestructors(m_pData, m_nSize);
					free(m_pData);
					m_pData = NULL;
				}
				m_nSize = 0;
				m_nMaxSize = 0;
			}
			else if (nNewSize <= m_nMaxSize)
			{
				
				if( nNewSize > m_nSize )
				{
					
					CallConstructors(m_pData+m_nSize, nNewSize - m_nSize);
				}
				else if (m_nSize > nNewSize)
				{
					
					CallDestructors(m_pData+nNewSize, m_nSize - nNewSize);
				}
				m_nSize = nNewSize;
			}
			else
			{
				if (!GrowBuffer(nNewSize))
					return FALSE;
				CallConstructors(m_pData+m_nSize, nNewSize - m_nSize);
				m_nSize = nNewSize;
			}
			return TRUE;
		}
		void RemoveAll()
		{
			SetCount(0, -1);
		}

		const E& GetAt(int nIndex) const
		{
			if (0>nIndex)
				nIndex = 0;
			else if (nIndex>=m_nSize)
				nIndex = m_nSize;
			return m_pData[nIndex];
		}
		void SetAt(int nIndex, const E &oElement)
		{
			if ((0>nIndex)||(nIndex>=m_nSize))
				return;
			m_pData[nIndex] = oElement;
		}
		E& GetAt(int nIndex)
		{
			if (0>nIndex)
				nIndex = 0;
			else if (nIndex>=m_nSize)
				nIndex = m_nSize;
			return m_pData[nIndex];
		}

		
		int Add(const E& oElement)
		{
			int nIndex = m_nSize;
			if (nIndex >= m_nMaxSize)
			{
				if (!GrowBuffer(nIndex+1))
					return -1;
			}
			::new(m_pData+nIndex)E(oElement);
			m_nSize++;
			return(nIndex);
		}
		int Append(const CArray<E>&arSrc)
		{
			int nOldSize = m_nSize;
			if(!SetCount(m_nSize + arSrc.m_nSize))
				return -1;
			memcpy(m_pData+nOldSize, arSrc.m_pData, arSrc.m_nSize*sizeof(E));
			return( nOldSize );
		}

		const E& operator[](int nIndex) const
		{
			return GetAt(nIndex);
		}
		E& operator[](int nIndex)
		{
			return GetAt(nIndex);
		}

		void InsertAt(int nIndex, const E& oElement)
		{
			if (nIndex>=m_nSize)
			{
				Add(oElement);
				return;
			}

			
			int nOldSize = m_nSize;
			if(!SetCount(m_nSize + 1, -1))
				return;

			memcpy(m_pData + (nIndex + 1), m_pData + nIndex, sizeof(E)*(nOldSize-nIndex));
			m_pData[nIndex] = oElement;
		}
		void InsertArrayAt(int nStart, const CArray<E> &arNew)
		{
			if (nStart>=m_nSize)
			{
				Append(arNew);
				return;
			}
			
			int nNewArrayCount = arNew.GetCount();
			
			int nOldSize = m_nSize;
			if(!SetCount(m_nSize + nNewArrayCount, -1))
				return;

			
			memcpy(m_pData + (nStart + nNewArrayCount), m_pData + nStart, sizeof(E)*(nOldSize-nStart));

			for (int nIndex = nStartl nIndex<nNewArrayCount; nIndex++)
				m_pData[nIndex] = arNew[nIndex];
		}
		void RemoveAt(int nIndex)
		{
			if ((0>nIndex)||(nIndex>=m_nSize))
				return;
			m_pData[nIndex].~E();

			memcpy(m_pData + nIndex, m_pData + nIndex + 1, (m_nSize - nIndex)*sizeof(E));
			m_nSize--;
		}
	private:
		BOOL GrowBuffer(int nNewSize)
		{
			if (nNewSize > m_nMaxSize)
			{
				if (NULL==m_pData)
				{
					int nAllocSize =  (m_nGrowBy>nNewSize) ? m_nGrowBy : nNewSize;
					m_pData = static_cast<E*>(calloc(nAllocSize, sizeof(E)));
					if (NULL==m_pData)
						return FALSE;
					m_nMaxSize = nAllocSize;
				}
				else
				{
					
					int nGrowBy = m_nGrowBy;
					if (0==nGrowBy)
					{
						
						
						nGrowBy = m_nSize/8;
						nGrowBy = (nGrowBy < 4) ? 4 : ((nGrowBy > 1024) ? 1024 : nGrowBy);
					}
					int nNewMax = max(nNewSize, (m_nMaxSize+nGrowBy));

					E* pNewData = static_cast<E*>(calloc(nNewMax, sizeof(E)));
					if (NULL==pNewData)
					{
						return FALSE;
					}

					
					memcpy(pNewData, m_pData, m_nSize*sizeof(E));

					
					free(m_pData);
					m_pData = pNewData;
					m_nMaxSize = nNewMax;
				}
			}
			return TRUE;
		}
	
	private:
		E* m_pData;
		int m_nSize;
		int m_nMaxSize;
		int m_nGrowBy;

		void CallDestructors(E* pData, int nCount)
		{
			for (int i=0; i<nCount; i++)
				pData[i].~E();
		}
		void CallConstructors(E* pData, int nCount)
		{
			for (int i=0; i<nCount; i++)
				::new(pData + i) E;
		}
	};
	template<typename K, typename V>
	class CMap
	{
	public:
		class CPair
		{
		public:
			CPair(const K &oKey, const V &oValue)
				: m_key(oKey)
				, m_value(oValue)
			{
			}
			const K m_key;
			V m_value;
		};
	public:
		CMap()
		{
		}
		~CMap()
		{
			RemoveAll();
		}
		void SetAt(const K &oKey, const V &oValue)
		{
			int nIndex = FindByKey(oKey);
			if (-1==nIndex)
			{
				CPair *pPair = new CPair(oKey, oValue);
				if (NULL==pPair)
					return;
				m_arPair.Add(pPair);
			}
			else
			{
				m_arPair[nIndex]->m_value = oValue;
			}
		}
		CPair *Lookup(const K &oKey)
		{
			int nIndex = FindByKey(oKey);
			if (-1==nIndex)
				return NULL;
			return m_arPair[nIndex];
		}
		const CPair *Lookup(const K &oKey) const
		{
			int nIndex = FindByKey(oKey);
			if (-1==nIndex)
				return NULL;
			return m_arPair[nIndex];
		}
		CPair *GetAt(int nIndex)
		{
			if ((nIndex<0)||(nIndex>=m_arPair.GetCount()))
				return NULL;
			return m_arPair[nIndex];
		}
		const CPair *GetAt(int nIndex) const
		{
			if ((nIndex<0)||(nIndex>=m_arPair.GetCount()))
				return NULL;
			return m_arPair[nIndex];
		}
		void RemoveKey(const K &oKey)
		{
			int nIndex = FindByKey(oKey);
			if (-1==nIndex)
				return;
			if (NULL!=m_arPair[nIndex])
				delete m_arPair[nIndex];
			m_arPair.RemoveAt(nIndex);
		}
		void RemoveAll()
		{
			int nCount = m_arPair.GetCount();
			for (int nIndex = 0; nIndex<nCount; nIndex++)
			{
				if (NULL==m_arPair[nIndex])
					continue;
				delete m_arPair[nIndex];
			}
			m_arPair.RemoveAll();
		}
		int GetCount() const
		{
			return m_arPair.GetCount();
		}
	protected:
		int FindByKey(const K &oKey) const
		{
			int nCount = m_arPair.GetCount();
			for (int nIndex = 0; nIndex<nCount; nIndex++)
			{
				if (NULL==m_arPair[nIndex])
					continue;
				if (oKey==m_arPair[nIndex]->m_key)
					return nIndex;
			}
			return -1;
		}
		CArray<CPair *> m_arPair;
	};
};

#endif//STRUCTURES