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

#ifdef __BORLANDC__
	#include "AVSBase64Codec.h"
	using namespace AVSUTILS;
#else
	#include <atlenc.h>
#endif

namespace VLong
{
	class CReferenceObject
	{
	protected:
		long m_lCounter;

		virtual ~CReferenceObject()
		{
		}
	public:
		CReferenceObject()
			: m_lCounter(1)
		{
		}
		void AddRef()
		{
			m_lCounter++;
		}
		void Release()
		{
			m_lCounter--;
			if (0==m_lCounter)
				delete this;
		}
		long GetCounter() const
		{
			return m_lCounter;
		}
	};

	template< typename TUnit >
	class CFlexUnit 
	{
	protected:
		
		TUnit* m_pData;
		
		size_t m_nDataSize;
		
		size_t m_nUsedSize;
	public:
		CFlexUnit()
			: m_pData(NULL)
			, m_nDataSize(0)
			, m_nUsedSize(0)
		{
		}
		virtual ~CFlexUnit()
		{
			if (NULL!=m_pData)
				delete []m_pData;
		}
		inline void Clear()
		{
			m_nUsedSize = 0;
		}
		inline void Reserve(size_t nNewSize)
		{
			if (nNewSize>m_nDataSize)
			{
				TUnit* pNewData = new TUnit[nNewSize];
				if (NULL==pNewData)
				{
					ATLASSERT(FALSE);
					return;
				}
				memset(pNewData, 0, nNewSize*sizeof(TUnit));
				if (NULL!=m_pData)
				{
					memcpy(pNewData, m_pData, m_nUsedSize*sizeof(TUnit));
					delete [] m_pData;
				}
				m_pData = pNewData;
				m_nDataSize = nNewSize;
			}
		}

		
		inline size_t GetUsedSize() const
		{
			return m_nUsedSize;
		}
		inline const TUnit *GetData() const
		{
			return m_pData;
		}
		
		inline TUnit Get(size_t nIndex) const
		{
			if (nIndex>=m_nUsedSize)
				return 0;
			return m_pData[nIndex];
		}
		inline void Set(size_t nIndex, TUnit nVal)
		{
			if (nIndex < m_nUsedSize)
			{
				m_pData[nIndex] = nVal;
				if (0==nVal) 
				{
					while ((0!=m_nUsedSize) && (0==m_pData[m_nUsedSize-1]))
						m_nUsedSize--;
				}
			}
			else if (0!=nVal)
			{
				Reserve(nIndex+1);
				if (nIndex>m_nUsedSize)
					memset(m_pData + m_nUsedSize*sizeof(TUnit), 0, (nIndex - m_nUsedSize) * sizeof(TUnit));
				m_pData[nIndex] = nVal;
				m_nUsedSize = nIndex + 1;
			}
		}
		inline void Pack()
		{
			TUnit* pDataPtr = m_pData + m_nUsedSize - 1;
			while ((m_nUsedSize>0)&&(0==(*pDataPtr)))
			{
				m_nUsedSize--;
				pDataPtr--;
			}
		}
		
		#define BIT_PER_UNIT			(8*sizeof(TUnit))						
		#define Lo(x)					((x) & ((1<<(BIT_PER_UNIT/2))-1))	
		#define Hi(x)					((x) >> (BIT_PER_UNIT/2))			
		#define LH(x)					((x) << (BIT_PER_UNIT/2))			
		inline void MulFast(const CFlexUnit<TUnit> &nVal1, const CFlexUnit<TUnit> &nVal2, size_t nLimitBit)
		{
			
			size_t nLimit = (nLimitBit + BIT_PER_UNIT - 1)/BIT_PER_UNIT; 
			Reserve(nLimit); 
			
			memset(m_pData, 0, nLimit*sizeof(TUnit));
			
			size_t nValSize1 = min(nVal1.GetUsedSize(), nLimit); 
			for (size_t i=0; i<nValSize1; i++)
			{
				TUnit m = nVal1.m_pData[i];
				TUnit c = 0; 

				size_t nValSize2 = min(i + nVal2.GetUsedSize(), nLimit); 

				size_t j=i;
				for (;j<nValSize2; j++)
				{
					
					
					
					TUnit w;
					TUnit v = m_pData[j];
					TUnit p = nVal2.m_pData[j-i];
					v += c; 
					c = ((v < c) ? 1 : 0);
					w = Lo(p)*Lo(m); v += w; c += ( v < w );
					w = Lo(p)*Hi(m); c += Hi(w); w = LH(w); v += w; c += ( v < w );
					w = Hi(p)*Lo(m); c += Hi(w); w = LH(w); v += w; c += ( v < w );
					c += Hi(p) * Hi(m);
					m_pData[j] = v;
				}
				while ((0!=c) && (j<nLimit))
				{
				  m_pData[j] += c;
				  c = ((m_pData[j] < c) ? 1 : 0);
				  j++;
				}
			}
			
			nLimitBit %= BIT_PER_UNIT;
			if (0!=nLimitBit) 
				m_pData[nLimit-1] &= (1<<nLimitBit)-1;

			m_nUsedSize = nLimit;
			Pack();
		}
	};

	template< typename TUnit >
	class CVLongValue
		: public CFlexUnit<TUnit>
		, public CReferenceObject
	{
	protected:
		virtual ~CVLongValue()
		{
		}
		
		static BOOL BinaryToBase64(const BYTE* pData, size_t nSize, LPSTR pszResult)
		{
			if ((NULL==pData) || (0==nSize))
				return FALSE;

			int nStrSize = Base64EncodeGetRequiredLength((int)nSize);

			BOOL bSuccess = Base64Encode(pData, (int)nSize, pszResult, &nStrSize);
			pszResult[nStrSize] = '\0';
			return bSuccess;
		}
	public:
		CVLongValue()
		{
		}
		
		operator TUnit()
		{
			return Get(0);
		}
		
		inline BOOL IsZero() const
		{
			return (0==m_nUsedSize);
		}
		BOOL IsBitZero(size_t nIndex) const
		{
			return (0!=(Get(nIndex/BIT_PER_UNIT) & (1<<(nIndex % BIT_PER_UNIT))));
		}
		size_t GetBitsCount() const
		{
			size_t nCount = m_nUsedSize*BIT_PER_UNIT;
			while ((0!=nCount) && (0==IsBitZero(nCount - 1)))
				nCount--;
			return nCount;
		}
		long Compare(const CVLongValue& oVal) const
		{
			if (m_nUsedSize > oVal.m_nUsedSize)
				return +1;
			if (m_nUsedSize < oVal.m_nUsedSize)
				return -1;
			TUnit* ptrValData = oVal.m_pData + m_nUsedSize - 1;
			TUnit* ptrThisData = m_pData + m_nUsedSize - 1;
			for (size_t i = m_nUsedSize; i>0; --i, ptrValData--, ptrThisData--)
			{
				if ((*ptrThisData) > (*ptrValData))
					return +1;
				if ((*ptrThisData) < (*ptrValData))
					return -1;
			}
			return 0;
		}
		void SHL()
		{
			
			
			
			
			
			
			
			
			
			TUnit nCarry = 0;
			size_t nOldUsedSize = m_nUsedSize;
			for (size_t i = 0; i<=nOldUsedSize; i++)
			{	
				TUnit nTemp = Get(i);
				Set(i,(nTemp<<1) + nCarry);
				nCarry = nTemp>>(BIT_PER_UNIT-1);
			}

		}
		void SHR()
		{
			TUnit nCarry = 0;
			
			for (long i = (long)m_nUsedSize-1; i>=0; i--)
			{	
				TUnit nTemp = Get(i);
				Set(i, (nTemp>>1) + nCarry);
				nCarry = nTemp<<(BIT_PER_UNIT - 1);
			}
		}
		void SHR(size_t nCount)
		{
			
			size_t nDelta = nCount/BIT_PER_UNIT; 
			nCount %= BIT_PER_UNIT;
			
			size_t nOldUsedSize = m_nUsedSize;
			for (size_t i=0; i<nOldUsedSize; i++)
			{
				TUnit oVal = Get(i + nDelta);
				if (0!=nCount)
				{
					oVal >>= nCount;
					oVal += Get(i + nDelta + 1) << (BIT_PER_UNIT - nCount);
				}
				Set(i, oVal);
			}
		}
		void Add(const CVLongValue& oVal)
		{
			TUnit oCarry = 0;
			size_t nSize = max(m_nUsedSize, oVal.m_nUsedSize);
			Reserve(nSize);
			for (size_t i=0; i < nSize + 1; i++)
			{
				TUnit oThisUnit = Get(i);
				oThisUnit += oCarry; 
				oCarry = ((oThisUnit < oCarry) ? 1 : 0);
				TUnit oValUnit = oVal.Get(i);
				oThisUnit += oValUnit; 
				oCarry += ((oThisUnit < oValUnit) ? 1 : 0);
				Set(i,oThisUnit);
			}
		}
		void Sub(const CVLongValue& oVal)
		{
			TUnit oCarry = 0;
			size_t nOldUsedSize = m_nUsedSize;
			
			for (size_t i=0; i<nOldUsedSize; i++)
			{
				TUnit oValUnit = oVal.Get(i);
				oValUnit += oCarry;
				if (oValUnit >= oCarry)
				{
					TUnit oThisUnit = Get(i);
					TUnit oTemp = oThisUnit - oValUnit;
					oCarry = ((oTemp > oThisUnit) ? 1 : 0);
					Set(i, oTemp);
				}
			}
		}
		void Init(TUnit oVal)
		{
			Clear();
			Set(0, oVal);
		}
		void CopyFrom(const CVLongValue& oVal)
		{
			Clear();
			if (0==oVal.m_nUsedSize)
				return;
			Reserve(oVal.m_nUsedSize);
			memcpy(m_pData, oVal.m_pData, oVal.m_nUsedSize*sizeof(TUnit));
			m_nUsedSize = oVal.m_nUsedSize;
			Pack();
		}
		void Mul(const CVLongValue& oVal1, const CVLongValue& oVal2)
		{
			MulFast(oVal1, oVal2, oVal1.GetBitsCount() + oVal2.GetBitsCount());
		}
		void Div(const CVLongValue& oVal1, const CVLongValue& oVal2, CVLongValue& oRem)
		{
			Init(0);
			oRem.CopyFrom(oVal1);
			CVLongValue oTemp1;
			oTemp1.CopyFrom(oVal2);
			CVLongValue oTemp2;
			oTemp2.Init(1);
			while (oRem.Compare(oTemp1)>0)
			{
				oTemp1.SHL();
				oTemp2.SHL();
			}
			while (oRem.Compare(oVal2) >= 0)
			{
				while (oRem.Compare(oTemp1) < 0)
				{
					oTemp1.SHR();
					oTemp2.SHR();
				}
				oRem.Sub(oTemp1);
				Add(oTemp2);
			}
		}
		
		
		inline LPSTR ExportToBase64()
		{
			int nSize = (int)m_nUsedSize*sizeof(TUnit);
			int nStrSize = Base64EncodeGetRequiredLength((int)nSize);
			LPSTR pszRet = new char[nStrSize + 1];
			BinaryToBase64((LPBYTE)m_pData, nSize, pszRet);
			pszRet[nStrSize] = '\0';
			return pszRet;
		}
		inline BOOL ImportFromBase64(LPCSTR pszBase64)
		{
			Clear();
			int nBase64Length = (int)strlen(pszBase64);
			int nDataSize = Base64DecodeGetRequiredLength(nBase64Length);
			int nUsedSize = nDataSize/sizeof(TUnit) + ((0!=(nDataSize%sizeof(TUnit)))?1:0);
			Reserve(nUsedSize);
			if (!Base64Decode(pszBase64, nBase64Length, (LPBYTE)m_pData, &nDataSize))
				return FALSE;
			m_nUsedSize = nDataSize/sizeof(TUnit) + ((0!=(nDataSize%sizeof(TUnit)))?1:0);
			return TRUE;
		}

	};

	template< typename TUnit>
	class CMontgomery;

	template< typename TUnit>
	class CVLong
	{
		friend class CMontgomery<TUnit>;
	private:
		CVLongValue<TUnit> *m_pValue;
		BOOL m_bNegative;

		long Compare(const CVLong &oVLong) const
		{
			BOOL bZero = ((NULL==m_pValue)||(m_pValue->IsZero()));
			if (IsZero())
			{
				if (oVLong.IsZero())
					return 0;
				else if (oVLong.m_bNegative)
					return +1;
				else
					return -1;
			}
			else if (m_bNegative)
			{
				if (oVLong.IsZero())
					return -1;
				else if (oVLong.m_bNegative)
					
					return (-(m_pValue->Compare(*(oVLong.m_pValue))));
				else
					return -1;
			}
			else
			{
				if (oVLong.IsZero())
					return +1;
				else if (oVLong.m_bNegative)
					
					return +1;
				else
					return (m_pValue->Compare(*(oVLong.m_pValue)));
			}
		}
		void DoCopy()
		{
			if ((NULL!=m_pValue)&&(1<m_pValue->GetCounter()))
			{
				CVLongValue<TUnit> *pValue = new CVLongValue<TUnit>();
				pValue->CopyFrom(*m_pValue);
				m_pValue->Release();
				m_pValue = pValue;
			}
		}
		inline BOOL IsZero() const
		{
			return ((NULL==m_pValue)||(m_pValue->IsZero()));
		}
	public:
		CVLong(TUnit oVal = 0)
			: m_bNegative(FALSE)
		{
			m_pValue = new CVLongValue<TUnit>;
			if (NULL!=m_pValue)
				m_pValue->Init(oVal);
		}
		CVLong(const CVLong<TUnit> &cvlVal)
			: m_bNegative(cvlVal.m_bNegative)
			, m_pValue(cvlVal.m_pValue)
		{
			if (NULL!=m_pValue)
				m_pValue->AddRef();
		}
		virtual ~CVLong()
		{
			if (NULL!=m_pValue)
				m_pValue->Release();
		}
		
		operator TUnit()
		{
			if (NULL==m_pValue)
				return 0;
			return *m_pValue;
		}
		CVLong& operator =(const CVLong& oVal)
		{
			if (NULL!=m_pValue)
				m_pValue->Release();
			m_pValue = oVal.m_pValue;
			if (NULL!=m_pValue)
				m_pValue->AddRef();
			m_bNegative = oVal.m_bNegative;
			return *this;
		}

		
		friend CVLong operator +(const CVLong& oVLong1, const CVLong& oVLong2)
		{
			CVLong oRes = oVLong1;
			oRes += oVLong2;
			return oRes;
		}
		friend CVLong operator -(const CVLong& oVLong1, const CVLong& oVLong2)
		{
			CVLong oRes = oVLong1;
			oRes -= oVLong2;
			return oRes;
		}
		friend CVLong operator *(const CVLong& oVLong1, const CVLong& oVLong2)
		{
			if ((NULL==oVLong1.m_pValue)||(NULL==oVLong2.m_pValue))
				return CVLong(0);
			CVLong oRes;
			oRes.m_pValue->Mul(*oVLong1.m_pValue, *oVLong2.m_pValue);
			oRes.m_bNegative = 
							(((oVLong1.m_bNegative)	&&	(!oVLong2.m_bNegative))	|| 
							 ((!oVLong1.m_bNegative)	&&	(oVLong2.m_bNegative)));
			return oRes;
		}
		friend CVLong operator /(const CVLong& oVLong1, const CVLong& oVLong2)
		{
			if (NULL==oVLong1.m_pValue)
				return CVLong(0);
			if (NULL==oVLong1.m_pValue)
			{
				ATLASSERT(FALSE);
				return CVLong(0);
			}
			CVLong oRes;
			CVLongValue<TUnit> *pRemValue = new CVLongValue<TUnit>;
			oRes.m_pValue->Div(*oVLong1.m_pValue, *oVLong2.m_pValue, *pRemValue);
			pRemValue->Release();
			oRes.m_bNegative = 
							(((oVLong1.m_bNegative)	&&	(!oVLong2.m_bNegative))	|| 
							 ((!oVLong1.m_bNegative)&&	(oVLong2.m_bNegative)));
			return oRes;
		}
		friend CVLong operator %(const CVLong& oVLong1, const CVLong& oVLong2)
		{
			if (NULL==oVLong1.m_pValue)
				return CVLong(0);
			if (NULL==oVLong1.m_pValue)
			{
				ATLASSERT(FALSE);
				return CVLong(0);
			}
			CVLong oTemp;
			CVLong oRem;
			oTemp.m_pValue->Div(*oVLong1.m_pValue, *oVLong2.m_pValue, *oRem.m_pValue);
			oRem.m_bNegative = oVLong2.m_bNegative;
			return oRem;
		}
		CVLong& operator += (const CVLong& oVLong)
		{
			if (oVLong.IsZero())
				return *this;

			if (NULL==m_pValue)
			{
				m_pValue = oVLong.m_pValue;
				if (NULL!=m_pValue)
					m_pValue->AddRef();
				m_bNegative = oVLong.m_bNegative;
				return *this;
			}			
			if (((m_bNegative)	&&	(oVLong.m_bNegative))||
				((!m_bNegative)	&&	(!oVLong.m_bNegative)))
			{
				DoCopy();
				m_pValue->Add(*oVLong.m_pValue);
			}
			else if (m_pValue->Compare(*oVLong.m_pValue) >= 0 )
			{
				DoCopy();
				m_pValue->Sub(*oVLong.m_pValue);
			}
			else
			{
				CVLong oTemp = *this;
				*this = oVLong;
				*this += oTemp;
			}
			return *this;
		}
		CVLong& operator -=(const CVLong& oVLong)
		{
			if (oVLong.IsZero())
				return *this;

			if (NULL==m_pValue)
			{
				m_pValue = oVLong.m_pValue;
				if (NULL!=m_pValue)
					m_pValue->AddRef();
				m_bNegative = (!oVLong.m_bNegative);
				return *this;
			}			
			if (((m_bNegative)	&&	(!oVLong.m_bNegative))||
				((!m_bNegative)	&&	(oVLong.m_bNegative)))
			{
				DoCopy();
				m_pValue->Add(*oVLong.m_pValue);
			}
			else if (m_pValue->Compare(*oVLong.m_pValue) >= 0 )
			{
				DoCopy();
				m_pValue->Sub(*oVLong.m_pValue);
			}
			else
			{
				CVLong oTemp = *this;
				*this = oVLong;
				*this -= oTemp;
				m_bNegative = (!m_bNegative);
			}
			return *this;
		}

		
		friend inline int operator !=(const CVLong& oVLong1, const CVLong& oVLong2)
		{
			return (0 != oVLong1.Compare(oVLong2));
		}
		friend inline int operator ==(const CVLong& oVLong1, const CVLong& oVLong2)
		{
			return (0 == oVLong1.Compare(oVLong2)); 
		}
		friend inline int operator >=(const CVLong& oVLong1, const CVLong& oVLong2)
		{
			return (0 <= oVLong1.Compare(oVLong2)); 
		}
		friend inline int operator <=(const CVLong& oVLong1, const CVLong& oVLong2)
		{
			return (0 >= oVLong1.Compare(oVLong2)); 
		}
		friend inline int operator > (const CVLong& oVLong1, const CVLong& oVLong2)
		{
			return (0 < oVLong1.Compare(oVLong2)); 
		}
		friend inline int operator < (const CVLong& oVLong1, const CVLong& oVLong2)
		{
			return (0 > oVLong1.Compare(oVLong2)); 
		}
		
		inline LPSTR ExportToBase64()
		{
			if (NULL==m_pValue)
				return "";
			return m_pValue->ExportToBase64();
		}
		inline BOOL ImportFromBase64(LPCSTR pszBase64)
		{
			if (NULL!=m_pValue)
				m_pValue->Release();
			m_pValue = new CVLongValue<TUnit>;
			if (NULL==m_pValue)
				return FALSE;
			return m_pValue->ImportFromBase64(pszBase64);
		}
		inline size_t ToBuffer(LPBYTE pBuffer)
		{
			size_t nRet = GetByteRealDataSize();
			
			
			LPBYTE pBufferPtr = pBuffer;
			LPBYTE pDataPtr = (LPBYTE)m_pValue->GetData() + nRet - 1;
			for (size_t i = 0; i<nRet; i++, pBufferPtr++, pDataPtr--)
			{
				*pBufferPtr = *pDataPtr;
			}
			return nRet;
		}
		inline size_t GetByteRealDataSize()
		{
			size_t nRet = m_pValue->GetUsedSize()*sizeof(TUnit);
			LPBYTE pDataPtr = (LPBYTE)m_pValue->GetData() + nRet - 1;
			for (;(nRet>0)&&(0==(*pDataPtr)); nRet--, pDataPtr--)
				;
			return nRet;			
		}
		
		static CVLong GCD(const CVLong& oVLong1, const CVLong& oVLong2)
		{
			CVLong oTemp1 = oVLong1;
			CVLong oTemp2 = oVLong2;
			while (TRUE)
			{
				if ((CVLong)0==oTemp2)
					return oTemp1;
				oTemp1 = oTemp1 % oTemp2;
				if ((CVLong)0==oTemp1)
					return oTemp2;
				oTemp2 = oTemp2 % oTemp1;

			}
		}
		static CVLong ModInv(const CVLong& oVLong, const CVLong& oMod)
		{
			CVLong j=1;
			CVLong i=0;
			CVLong b=oMod;
			CVLong c=oVLong;
			CVLong x,y;
			while (c!=(CVLong)0)
			{
				x = b / c;
				y = b - x*c;
				b = c;
				c = y;
				y = j;
				j = i - j*x;
				i = y;
			}
			if ( i < (CVLong)0 )
				i += oMod;
			return i;
		}
		static CVLong FromBuffer(LPBYTE pBuffer, size_t nSize)
		{	
			const CVLong coKoeff = 256;
			CVLong oRes = 0;
			LPBYTE pBufferPtr = pBuffer;
			for (size_t i=0; i<nSize; i++, pBufferPtr++)
			{
				oRes = oRes * coKoeff + (CVLong)(*pBufferPtr);
			}
			return oRes;
		}

	};
	
	template< typename TUnit >
	class CMontgomery 
	{
		CVLong<TUnit> m_oR, m_oR1, m_oM, m_oN1;
		CVLong<TUnit> m_oT, m_oK;
		size_t m_nRBitsCount;
		void Mul(CVLong<TUnit> &oVLong1, const CVLong<TUnit> &oVLong2)
		{
			
			m_oT.m_pValue->MulFast(*oVLong1.m_pValue, *oVLong2.m_pValue, m_nRBitsCount*2);

			
			m_oK.m_pValue->MulFast(*m_oT.m_pValue, *m_oN1.m_pValue, m_nRBitsCount);			

			
			oVLong1.m_pValue->MulFast(*m_oK.m_pValue, *m_oM.m_pValue, m_nRBitsCount*2);
			oVLong1 += m_oT;
			oVLong1.m_pValue->SHR(m_nRBitsCount);

			if (oVLong1>=m_oM) 
				oVLong1 -= m_oM;
		}
	public:
		CMontgomery(const CVLong<TUnit> &oVal)
		{
			m_oM = oVal;
			m_nRBitsCount = 0;
			m_oR = 1; 
			while (m_oR < m_oM)
			{
				m_oR += m_oR; 
				m_nRBitsCount++;
			}
			m_oR1 = CVLong<TUnit>::ModInv(m_oR - m_oM, m_oM);
			m_oN1 = m_oR - CVLong<TUnit>::ModInv(m_oM, m_oR);
		}

		CVLong<TUnit> Exp( const CVLong<TUnit> &oVal, const CVLong<TUnit> &oExp)
		{
			CVLong<TUnit> oRes = m_oR - m_oM;
			CVLong<TUnit> oTemp = (oVal * m_oR) % m_oM;
			size_t nBitsCount = oExp.m_pValue->GetBitsCount();
			size_t i = 0;
			while (TRUE)
			{
				if (oExp.m_pValue->IsBitZero(i))
					Mul(oRes, oTemp);
				i++;
				if (i==nBitsCount)
					break;
				Mul(oTemp, oTemp);
			}
			oRes = (oRes * m_oR1) % m_oM;
			return oRes;
		}
		static CVLong<TUnit> ModExp(const CVLong<TUnit> &oVLong, const CVLong<TUnit> &oExp, const CVLong<TUnit> &oMod)
		{
			CMontgomery oTemp(oMod);
			return oTemp.Exp(oVLong, oExp);
		}
	};
	
};