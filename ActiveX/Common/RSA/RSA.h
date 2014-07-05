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

#include "VLong.h"

using namespace VLong;
namespace RSA
{
	const static CVLong<DWORD> g_coOne = 1;
	static const size_t g_cnBufferGrow = 200;
	static LPCSTR g_cpszSeparator = "<>";
	class CPrimeFactory
	{
		size_t m_nNP;
		LPDWORD m_pData;
	public:
		CPrimeFactory()
		{
			m_nNP = 0;
			size_t nNP = 200;
			m_pData = new DWORD[nNP];

			
			size_t nSS = 8*nNP; 
			char *pBitTest = new char[nSS+1]; 
			for (size_t i=0; i<=nSS; i++)
				pBitTest[i] = 1;
			DWORD dwP = 2;
			while (TRUE)
			{
				
				while (0==pBitTest[dwP]) 
					dwP++;
				if (dwP == nSS )
					break;
				m_pData[m_nNP] = dwP;
				m_nNP++;
				if (m_nNP == nNP )
					break;
				
				DWORD dwTemp = dwP*2;
				while (dwTemp < nSS)
				{
					pBitTest[dwTemp] = 0;
					dwTemp += dwP;
				}
				dwP++;
			}
			delete []pBitTest;
		}
		virtual ~CPrimeFactory()
		{
			delete []m_pData;
		}
		CVLong<DWORD> FindPrime(CVLong<DWORD> &oStart)
		{
			DWORD dwSS = 1000; 
			char *pBitSet = new char[dwSS]; 
			size_t nTestedCount = 0;
			while (TRUE)
			{
				memset(pBitSet, 1, dwSS);
				for (DWORD i=0; i<m_nNP; i++)
				{
					DWORD dwP = m_pData[i];
					DWORD dwR = (DWORD)(oStart % (CVLong<DWORD>)dwP); 
					if (0!=dwR) 
						dwR = dwP - dwR;
					
					while (dwR < dwSS )
					{
						pBitSet[dwR] = 0;
						dwR += dwP;
					}
				}
				
				for (DWORD i=0; i<dwSS; i++)
				{
					if (0!=pBitSet[i])
					{
						nTestedCount++;
						if (IsProbablePrime(oStart))
						{
							delete []pBitSet;
							return oStart;
						}
					}
					oStart += 1;
				}
			}
			delete []pBitSet;
		}

		
		static BOOL IsProbablePrime(const CVLong<DWORD> &oPrime)
		{
			
			
			const size_t nRep = 4;
			const CVLong<DWORD> arAny[nRep] = {2,3,5,7};
			const CVLong<DWORD> oOne(1);
			for (size_t i=0; i<nRep; i++)
			{
				if (oOne != CMontgomery<DWORD>::ModExp(arAny[i], oPrime - 1, oPrime))
					return FALSE;
			}
			return TRUE;
		}
	};

	class CRSAKeyGenerator
	{
	protected:
		CVLong<DWORD> m_oMod;
		CVLong<DWORD> m_oExp;
		CVLong<DWORD> m_oP;
		CVLong<DWORD> m_oQ;
		void CalculatePublicKey()
		{
			m_oMod = m_oP*m_oQ;
			m_oExp = 50001; 
			while ( (CVLong<DWORD>::GCD(m_oP - g_coOne, m_oExp) != g_coOne)	|| 
					(CVLong<DWORD>::GCD(m_oQ - g_coOne, m_oExp) != g_coOne))
				m_oExp += 2;
		}
	public:
		LPSTR ExportPrivateKey()
		{	
			LPSTR pszP = m_oP.ExportToBase64(); size_t nPStrLenght = strlen(pszP);
			LPSTR pszQ = m_oQ.ExportToBase64(); size_t nQStrLenght = strlen(pszQ);
			LPSTR pszRet = new char[nPStrLenght + nQStrLenght + 2 + 1];
			pszRet[0] = '\0';
			strcat(pszRet, pszP);
			delete []pszP;
			strcat(pszRet, g_cpszSeparator);
			strcat(pszRet, pszQ);
			delete []pszQ;
			size_t nRetStrLenght = strlen(pszRet);
			for (int i=0; i<(int)nRetStrLenght - 1; i++)
			{
				if (('\r' == pszRet[i])&&('\n' == pszRet[i+1]))
				{
					memcpy(pszRet, pszRet + 2, nRetStrLenght - i - 2);
					nRetStrLenght -= 2;
					i -= 2;
				}				
			}
			return pszRet;			
		}
		LPSTR ExportPublicKey()
		{	
			LPSTR pszMod = m_oMod.ExportToBase64(); size_t nModStrLenght = strlen(pszMod);
			LPSTR pszExp = m_oExp.ExportToBase64(); size_t nExpStrLenght = strlen(pszExp);
			LPSTR pszRet = new char[nModStrLenght + nExpStrLenght + 2 + 1];
			pszRet[0] = '\0';
			strcat(pszRet, pszMod);
			delete []pszMod;
			strcat(pszRet, g_cpszSeparator);
			strcat(pszRet, pszExp);
			delete []pszExp;
			size_t nRetStrLenght = strlen(pszRet);
			for (int i=0; i<(int)nRetStrLenght - 1; i++)
			{
				if (('\r' == pszRet[i])&&('\n' == pszRet[i+1]))
				{
					memcpy(pszRet + i, pszRet + i + 2, nRetStrLenght - i - 2);
					nRetStrLenght -= 2;
					i -= 2;
				}				
			}
			return pszRet;			
		}
		void Create(LPBYTE pKey1, size_t nSizeKey1, LPBYTE pKey2, size_t nSizeKey2)
		{
			CPrimeFactory oPF;
			m_oP = oPF.FindPrime(CVLong<DWORD>::FromBuffer(pKey1, nSizeKey1));
			m_oQ = oPF.FindPrime(CVLong<DWORD>::FromBuffer(pKey2, nSizeKey2));
			if (m_oP > m_oQ) 
			{ 
				CVLong<DWORD> oTmp = m_oP; 
				m_oP = m_oQ; 
				m_oP = oTmp;
			}
			CalculatePublicKey();
		}
	};

	class CRSAEncryptor
	{
	protected:

		CVLong<DWORD> m_oMod;
		CVLong<DWORD> m_oExp;
		CVLong<DWORD> Encrypt(const CVLong<DWORD>& oVal) 
		{
			return CMontgomery<DWORD>::ModExp(oVal, m_oExp, m_oMod);
		}
	public:
		BOOL ImportPublicKey(LPCSTR pszBase64)
		{			
			LPCSTR pszExp = strstr(pszBase64, g_cpszSeparator);
			if (NULL==pszExp)
				return FALSE;
			int nModStrLength = (int)(pszExp - pszBase64);
			LPSTR pszMod = new char [nModStrLength + 1];
			memcpy(pszMod, pszBase64, nModStrLength);
			pszMod[nModStrLength] = '\0';
			m_oMod.ImportFromBase64(pszMod);
			m_oExp.ImportFromBase64(pszExp + 2);
			delete [] pszMod;
#ifdef _DEBUG
			

			LPSTR pszTemp = m_oMod.ExportToBase64();
			
			delete [] pszTemp;
			pszTemp = m_oExp.ExportToBase64();
			
			delete [] pszTemp;
#endif
			return (((CVLong<DWORD>)0!=m_oMod)&&((CVLong<DWORD>)0!=m_oExp));
		}
		
		BOOL Encrypt(LPBYTE pSrcBuffer, size_t nSrcSize, LPBYTE &pDstBuffer, size_t &nDstSize)
		{
			if ((0==nSrcSize)||(NULL==pSrcBuffer))
				return FALSE;

			size_t nDstBufferSize = nSrcSize + 1024;
			pDstBuffer = new BYTE[nDstBufferSize];
			if (NULL==pDstBuffer)
				return FALSE;
			LPBYTE pDstBufferPtr = pDstBuffer;
			nDstSize = 0;
			CVLong<DWORD> oKoef = 256;
			for (size_t i=0; i<nSrcSize;)
			{
				CVLong<DWORD> oSrcVal = 0;
				size_t j = i;
				for (; j < nSrcSize; j++)
				{
					CVLong<DWORD> oTemp = oSrcVal*oKoef + (CVLong<DWORD>)pSrcBuffer[j];
					if (oTemp>=m_oMod)
						break;
					oSrcVal = oTemp;
				}
				CVLong<DWORD> oDstVal = Encrypt(oSrcVal);
				i = j;
				size_t nDstValSize = oDstVal.GetByteRealDataSize();
				if (nDstSize + nDstValSize>nDstBufferSize)
				{
					LPBYTE pDstBufferOld = pDstBuffer;
					pDstBuffer = new BYTE[nDstBufferSize + g_cnBufferGrow];
					if (NULL==pDstBuffer)
					{
						delete [] pDstBufferOld;
						return FALSE;
					}
					memcpy(pDstBuffer, pDstBufferOld, nDstBufferSize);
					delete [] pDstBufferOld;
					nDstBufferSize += g_cnBufferGrow;
					pDstBufferPtr += nDstSize;					
				}
				oDstVal.ToBuffer(pDstBufferPtr);
				pDstBufferPtr += nDstValSize;
				nDstSize += nDstValSize;
			}
			return TRUE;
		}
		LPSTR Encrypt(LPCSTR pszSrc)
		{			
			LPBYTE pEncBuffer = NULL; size_t nEncBufferSize = 0;
			if (!Encrypt((LPBYTE)pszSrc, strlen(pszSrc), pEncBuffer, nEncBufferSize))
				return "";

			int nStrSize = Base64EncodeGetRequiredLength((int)nEncBufferSize);
			LPSTR pStrData = new char[nStrSize + 1];
			BOOL bSuccess = Base64Encode(pEncBuffer, (int)nEncBufferSize, pStrData, &nStrSize);
			pStrData[nStrSize] = '\0';
			delete [] pEncBuffer;
			return pStrData;
		}
	};

	class CRSADecryptor
	{
	protected:
		CVLong<DWORD> m_oMod;
		CVLong<DWORD> m_oExp;
		CVLong<DWORD> m_oP;
		CVLong<DWORD> m_oQ;
		void CalculatePublicKey()
		{
			m_oMod = m_oP*m_oQ;
			m_oExp = 50001; 
			while ( (CVLong<DWORD>::GCD(m_oP - g_coOne, m_oExp) != g_coOne)	|| 
					(CVLong<DWORD>::GCD(m_oQ - g_coOne, m_oExp) != g_coOne))
				m_oExp += 2;
		}
		CVLong<DWORD> Decrypt(CVLong<DWORD>& oVal)
		{
			
			
			CVLong<DWORD> oD = CVLong<DWORD>::ModInv(m_oExp, (m_oP - g_coOne)*(m_oQ - g_coOne));
			CVLong<DWORD> oU = CVLong<DWORD>::ModInv(m_oP, m_oQ);
			CVLong<DWORD> oDP = oD % (m_oP - g_coOne);
			CVLong<DWORD> oDQ = oD % (m_oQ - g_coOne);

			
			CVLong<DWORD> oA = CMontgomery<DWORD>::ModExp(oVal % m_oP, oDP, m_oP);
			CVLong<DWORD> oB = CMontgomery<DWORD>::ModExp(oVal % m_oQ, oDQ, m_oQ);
			if (oB < oA) 
				oB += m_oQ;
			return oA + m_oP * ( ((oB - oA) * oU) % m_oQ);
		}
	public:
		BOOL ImportPrivateKey(LPCSTR pszBase64)
		{
			LPCSTR pszQ = strstr(pszBase64, g_cpszSeparator);
			if (NULL==pszQ)
				return FALSE;
			int nPStrLength = (int)(pszQ - pszBase64);
			LPSTR pszP = new char [nPStrLength + 1];
			memcpy(pszP, pszBase64, nPStrLength);
			pszP[nPStrLength] = '\0';
			m_oP.ImportFromBase64(pszP);
			m_oQ.ImportFromBase64(pszQ + 2);
			delete [] pszP;

			if (((CVLong<DWORD>)0==m_oP)&&((CVLong<DWORD>)0==m_oQ))
				return FALSE;
			CalculatePublicKey();
#ifdef _DEBUG
			
			LPBYTE pTemp = new BYTE[1024];
			m_oP.ToBuffer(pTemp);
			
			for (size_t i=0; i<m_oP.GetByteRealDataSize(); i++)
			{	
				
			}
			
			
			m_oQ.ToBuffer(pTemp);
			
			for (size_t i=0; i<m_oQ.GetByteRealDataSize(); i++)
			{	
				
			}
			

			m_oMod.ToBuffer(pTemp);
			
			for (size_t i=0; i<m_oMod.GetByteRealDataSize(); i++)
			{	
				
			}
			
			
			m_oExp.ToBuffer(pTemp);
			
			for (size_t i=0; i<m_oExp.GetByteRealDataSize(); i++)
			{	
				
			}
			
			delete [] pTemp;
			
			
			
			
#endif
			return TRUE;
		}
		
		void Create(LPBYTE pKey1, size_t nSizeKey1, LPBYTE pKey2, size_t nSizeKey2)
		{
			CPrimeFactory oPF;
			m_oP = oPF.FindPrime(CVLong<DWORD>::FromBuffer(pKey1, nSizeKey1));
			m_oQ = oPF.FindPrime(CVLong<DWORD>::FromBuffer(pKey2, nSizeKey2));
			if (m_oP > m_oQ) 
			{ 
				CVLong<DWORD> oTmp = m_oP; 
				m_oP = m_oQ; 
				m_oP = oTmp;
			}
			CalculatePublicKey();
		}
		BOOL Decrypt(LPBYTE pSrcBuffer, size_t nSrcSize, LPBYTE &pDstBuffer, size_t &nDstSize)
		{
			if ((0==nSrcSize)||(NULL==pSrcBuffer))
				return FALSE;

			size_t nDstBufferSize = nSrcSize + 1024;
			pDstBuffer = new BYTE[nDstBufferSize];
			if (NULL==pDstBuffer)
				return FALSE;
			LPBYTE pDstBufferPtr = pDstBuffer;
			size_t nDstBufferCursor = 0;
			CVLong<DWORD> oKoef = 256;
			for (size_t i=0; i<nSrcSize; )
			{
				CVLong<DWORD> oSrcVal = 0;
				size_t j = i;
				for (; j < nSrcSize; j++)
				{
					CVLong<DWORD> oTemp = oSrcVal*oKoef + (CVLong<DWORD>)pSrcBuffer[j];
					if (oTemp>=m_oMod)
						break;
					oSrcVal = oTemp;
				}
				CVLong<DWORD> oDstVal = Decrypt(oSrcVal);
				i = j;
				size_t nDstValSize = oDstVal.GetByteRealDataSize();
				if (nDstBufferCursor + nDstValSize>nDstBufferSize)
				{
					LPBYTE pDstBufferOld = pDstBuffer;
					pDstBuffer = new BYTE[nDstBufferSize + g_cnBufferGrow];
					if (NULL==pDstBuffer)
					{
						delete [] pDstBufferOld;
						return FALSE;
					}
					memcpy(pDstBuffer, pDstBufferOld, nDstBufferSize);
					delete [] pDstBufferOld;
					nDstBufferSize += g_cnBufferGrow;
					pDstBufferPtr += nDstBufferCursor;					
				}
				oDstVal.ToBuffer(pDstBufferPtr);
				pDstBufferPtr += nDstValSize;
				nDstBufferCursor += nDstValSize;
			}
			nDstSize = nDstBufferCursor;
			return TRUE;
		}
		LPSTR Decrypt(LPCSTR pszBase64)
		{
			int nBase64StrLen = (int)strlen(pszBase64);
			int nEncSize;
			nEncSize = Base64DecodeGetRequiredLength(nBase64StrLen);
			LPBYTE pEncBuffer = new BYTE[nEncSize];
			if (NULL==pEncBuffer)
				return "";
			if (!Base64Decode(pszBase64, nBase64StrLen, pEncBuffer, &nEncSize))
			{
				delete []pEncBuffer;
				return "";
			}
			LPBYTE pDecBuffer = NULL;
			size_t nDecSize = 0;
			if (!Decrypt(pEncBuffer, nEncSize, pDecBuffer, nDecSize))
			{
				delete []pEncBuffer;
				return "";
			}
			
			LPSTR pStr = new char[nDecSize+1];
			memcpy((LPBYTE)pStr, pDecBuffer, nDecSize);
			pStr[nDecSize] = '\0';
			delete [] pEncBuffer;
			delete [] pDecBuffer;
			return pStr;
		}
	};
};