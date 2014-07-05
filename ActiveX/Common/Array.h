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

#include <atlcoll.h>

namespace ArrayUtils
{
	
	template<class T> void ConstructElements(T* pData, int nSize)
	{
		ATLASSERT(!nSize || nSize > 0 && pData);

		
		if (nSize)
			ZeroMemory(pData, nSize * sizeof(T));

		
		for (; nSize--; pData++)
			::new((void*)pData) T;
	}

	
	template<class T> void DestructElements(T* pData, int nSize)
	{
		ATLASSERT(!nSize || nSize > 0 && pData);

		
		for (; nSize--; pData++)
			pData->~T();
	}

	
	template<class T> void SwapElements(T& tL, T& tR)
	{
		T tTemp = tL; tL = tR; tR = tTemp;
	}

	
	template<class T> void SortElements(T* pData, int nSize)
	{
		ATLASSERT(!nSize || nSize > 0 && pData);

		
		if (nSize <= 1)
			return;
		if (nSize == 2)
		{
			if (pData[0] > pData[1])
				SwapElements<T>(pData[0], pData[1]);
			return;
		}

		T tTemp;

		
		int nIndex = (nSize >> 1) - 1, nCurr = 0, nNext = 0;
		int nLast = nSize - 1;
		int nHalf = nSize >> 1;
		do
		{
			
			tTemp = pData[nIndex];

			nCurr = nIndex;
			while (nCurr < nHalf)
			{
				nNext = (nCurr << 1) + 1;
				if (nNext < nLast && pData[nNext + 1] > pData[nNext])
					nNext++;
				if (tTemp >= pData[nNext])
					break;

				
				pData[nCurr] = pData[nNext];
				nCurr = nNext;
			}

			
			pData[nCurr] = tTemp;
		}
		while (nIndex--);

		
		nIndex = nSize;
		while (--nIndex)
		{
			
			tTemp = pData[nIndex];
			pData[nIndex] = pData[0];

			nCurr = 0;
			nLast = nIndex - 1;
			nHalf = nIndex >> 1;
			while (nCurr < nHalf)
			{
				nNext = (nCurr << 1) + 1;
				if (nNext < nLast && pData[nNext + 1] > pData[nNext])
					nNext++;
				if (tTemp >= pData[nNext])
					break;

				
				pData[nCurr] = pData[nNext];
				nCurr = nNext;
			}

			
			pData[nCurr] = tTemp;
		}
	}

	
	template<class T> void SortElements(T* pData, int nSize, int (*pfn)(const T& tElement1, const T& tElement2, void* pUser), void* pUser)
	{
		ATLASSERT(!nSize || nSize > 0 && pData);

		
		if (nSize <= 1)
			return;
		if (nSize == 2)
		{
			if (pfn(pData[0], pData[1], pUser) > 0)
				SwapElements<T>(pData[0], pData[1]);
			return;
		}

		T tTemp;

		
		int nIndex = (nSize >> 1) - 1, nCurr = 0, nNext = 0;
		int nLast = nSize - 1;
		int nHalf = nSize >> 1;
		do
		{
			
			tTemp = pData[nIndex];

			nCurr = nIndex;
			while (nCurr < nHalf)
			{
				nNext = (nCurr << 1) + 1;
				if (nNext < nLast && pfn(pData[nNext + 1], pData[nNext], pUser) > 0)
					nNext++;
				if (pfn(tTemp, pData[nNext], pUser) >= 0)
					break;

				
				pData[nCurr] = pData[nNext];
				nCurr = nNext;
			}

			
			pData[nCurr] = tTemp;
		}
		while (nIndex--);

		
		nIndex = nSize;
		while (--nIndex)
		{
			
			tTemp = pData[nIndex];
			pData[nIndex] = pData[0];

			nCurr = 0;
			nLast = nIndex - 1;
			nHalf = nIndex >> 1;
			while (nCurr < nHalf)
			{
				nNext = (nCurr << 1) + 1;
				if (nNext < nLast && pfn(pData[nNext + 1], pData[nNext], pUser) > 0)
					nNext++;
				if (pfn(tTemp, pData[nNext], pUser) >= 0)
					break;

				
				pData[nCurr] = pData[nNext];
				nCurr = nNext;
			}

			
			pData[nCurr] = tTemp;
		}
	}

	
	template<class S, class T> int BinaryScanForElement(S& tStorage, int nStart, int nCount, const T& tElement, BOOL bLeftmost = FALSE, BOOL bDontFail = FALSE)
	{
		ATLASSERT(nCount >= 0);

		
		int nLow = nStart;
		int nHgh = nStart + nCount - 1;
		while (nLow <= nHgh)
		{
			int nMed = nLow + ((nHgh - nLow) >> 1);
			if (tStorage[nMed] < tElement)
				nLow = nMed + 1;
			else if (tStorage[nMed] > tElement)
				nHgh = nMed - 1;
			else
			{
				if (bLeftmost)
				{
					nHgh = nMed;

					
					while (nLow != nHgh)
					{
						nMed = nLow + ((nHgh - nLow) >> 1);
						if (tStorage[nMed] < tElement)
							nLow = nMed + 1;
						else
							nHgh = nMed;
					}

					nMed = nHgh;
				}

				return nMed;
			}
		}
		return bDontFail? nLow: -1;
	}

	
	template<class S, class T> int BinaryScanForElement(S& tStorage, int nStart, int nCount, const T& tElement, int (*pfn)(const T& tElement1, const T& tElement2, void* pUser), void* pUser, BOOL bLeftmost = FALSE, BOOL bDontFail = FALSE)
	{
		ATLASSERT(nCount >= 0);

		
		int nLow = nStart;
		int nHgh = nStart + nCount - 1;
		while (nLow <= nHgh)
		{
			int nMed = nLow + ((nHgh - nLow) >> 1);
			if (pfn(tStorage[nMed], tElement, pUser) < 0)
				nLow = nMed + 1;
			else if (pfn(tStorage[nMed], tElement, pUser) > 0)
				nHgh = nMed - 1;
			else
			{
				if (bLeftmost)
				{
					nHgh = nMed;

					
					while (nLow != nHgh)
					{
						nMed = nLow + ((nHgh - nLow) >> 1);
						if (pfn(tStorage[nMed], tElement, pUser) < 0)
							nLow = nMed + 1;
						else
							nHgh = nMed;
					}

					nMed = nHgh;
				}

				return nMed;
			}
		}
		return bDontFail? nLow: -1;
	}

	
	template<class T> int RemoveEqualElements(T* pData, int nSize)
	{
		ATLASSERT(!nSize || nSize > 0 && pData);

		if (nSize < 2)
			return nSize;
		int nUsed = 1;

		
		for (int nIndex = 1; nIndex < nSize; nIndex++)
		{
			if (!(pData[nUsed - 1] == pData[nIndex]))
				if (nUsed++ != nIndex)
					pData[nUsed - 1] = pData[nIndex];
		}

		return nUsed;
	}

	
	template<class T> int RemoveEqualElements(T* pData, int nSize, int (*pfn)(const T& tElement1, const T& tElement2, void* pUser), void* pUser)
	{
		ATLASSERT(!nSize || nSize > 0 && pData);

		if (nSize < 2)
			return nSize;
		int nUsed = 1;

		
		for (int nIndex = 1; nIndex < nSize; nIndex++)
		{
			if (pfn(pData[nUsed-1], pData[nIndex], pUser))
				if (nUsed++ != nIndex)
					pData[nUsed - 1] = pData[nIndex];
		}

		
		DestructElements<T>(pData + nUsed, nSize - nUsed);

		return nUsed;
	}

	template<class T> class CArray : public CAtlArray<T>
	{
	public:
		
		void Sort()
			{ SortElements(GetData(), (int)GetCount()); }
		void Sort(int (*pfn)(const T& tElement1, const T& tElement2, void *pUser), void *pUser)
			{ SortElements(GetData(), (int)GetCount(), pfn, pUser); }
		void SortPart(int nStart, int nSize)
			{ ATLASSERT(nStart >= 0 && nSize >= 0 && nStart + nSize <= (int)GetCount()); SortElements(GetData() + nStart, nSize); }
		void SortPart(int nStart, int nSize, int (*pfn)(const T& tElement1, const T& tElement2, void* pUser), void* pUser)
			{ ATLASSERT(nStart >= 0 && nSize >= 0 && nStart + nSize <= (int)GetCount()); SortElements(GetData() + nStart, nSize, pfn, pUser); }

		
		int BinaryScan(const T& tElement, BOOL bLeftmost = FALSE, BOOL bDontFail = FALSE) const
			{ return BinaryScanForElement(*this, 0, (int)GetCount(), tElement, bLeftmost, bDontFail); }
		int BinaryScan(const T& tElement, int (*pfn)(const T& tElement1, const T& tElement2, void* pUser), void* pUser, BOOL bLeftmost = FALSE, BOOL bDontFail = FALSE) const
			{ return BinaryScanForElement(*this, 0, (int)GetCount(), tElement, pfn, pUser, bLeftmost, bDontFail); }

		
		void RemoveEqual()
			{ SetCount(RemoveEqualElements(GetData(), (int)GetCount())); }
		void RemoveEqual(int (*pfn)(const T& tElement1, const T& tElement2, void* pUser), void* pUser)
			{ SetCount(RemoveEqualElements(GetData(), (int)GetCount(), pfn, pUser)); }
	
		
		BOOL CopyToVariant(int nVariantType, VARIANT *pVariant);
	};

	
	template<class T> BOOL CArray<T>::CopyToVariant(int nVariantType, VARIANT *pVariant)
	{
		
		if (FAILED(VariantClear(pVariant)))
			return FALSE;

		
		if (0 == (int)GetCount())
			return TRUE;

		BOOL bFailed = TRUE;

		
		pVariant->parray = SafeArrayCreateVector(nVariantType, 0, (ULONG)GetSize());
		if (NULL != pVariant->parray)
		{
			pVariant->vt = VT_ARRAY | nVariantType;

    		T* pData = 0;

			
			if (SUCCEEDED(SafeArrayAccessData(pVariant->parray, (void**)&pData)))
			{
				CopyMemory(pData, GetData(), GetSize()*sizeof(T));

				
				if (SUCCEEDED(SafeArrayUnaccessData(pVariant->parray)))
					bFailed = FALSE;
			}
		}
		if (bFailed)
		{
			VariantClear(pVariant);
			return FALSE;
		}

		return TRUE;
	}
}


