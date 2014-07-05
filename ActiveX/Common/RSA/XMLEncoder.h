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
#include "Includer.h"

class CXMLEncoder
{
public:
	CXMLEncoder()
		: m_pBlowfishKey(NULL)
		, m_nBlowfishKeySize(g_cnBlowfishKeySize)
	{
		m_oRSAEncryptor.ImportPublicKey(g_csPublicKey);
		NewBlowfishKey();
	}
	virtual ~CXMLEncoder()
	{
		RELEASEARRAYOBJECTS(m_pBlowfishKey);
	}

	
	
	void EncryptXML(BYTE** ppData, DWORD* pdwDataLen, BOOL bChangeBlowfishKey = FALSE)
	{
		if (bChangeBlowfishKey)
		{
			if (!NewBlowfishKey())
				return;
		}

		m_oBlowfish.Init(m_pBlowfishKey, (DWORD)m_nBlowfishKeySize);
		
		LPBYTE pSrc = (LPBYTE)*ppData;
		DWORD dwInputLen = *pdwDataLen;
		DWORD dwOutputLen = m_oBlowfish.GetOutputLength(dwInputLen);

		LPBYTE pEncBuffer = new BYTE[dwOutputLen];

		if (NULL == pEncBuffer)
			return;	

		m_oBlowfish.Encrypt(pSrc, pEncBuffer, dwInputLen);
		delete []*ppData;
		int nBase64Size = Base64EncodeGetRequiredLength((int)dwOutputLen);
		
		LPSTR pStrData = new char[nBase64Size + 1];
		BOOL bSuccess = Base64Encode(pEncBuffer, (int)dwOutputLen, pStrData, &nBase64Size);
		
		pStrData[nBase64Size] = '\0';
		delete [] pEncBuffer;

		*ppData = (BYTE*)pStrData;
		*pdwDataLen = nBase64Size;

		return;
	}
	
#ifdef UNICODE
	CStringA EncryptXML(CString strXml, BOOL bChangeBlowfishKey = FALSE)
	{
		if (bChangeBlowfishKey)
		{
			if (!NewBlowfishKey())
				return "";
		}

		m_oBlowfish.Init(m_pBlowfishKey, (DWORD)m_nBlowfishKeySize);
		
		LPBYTE pSrc = (LPBYTE)strXml.GetBuffer();
		DWORD dwInputLen = strXml.GetLength() * sizeof(TCHAR);
		DWORD dwOutputLen = m_oBlowfish.GetOutputLength(dwInputLen);

		LPBYTE pEncBuffer = new BYTE[dwOutputLen];
		if (NULL == pEncBuffer)
			return "";	

		m_oBlowfish.Encrypt(pSrc, pEncBuffer, dwInputLen);
		int nBase64Size = Base64EncodeGetRequiredLength((int)dwOutputLen);
		
		LPSTR pStrData = new char[nBase64Size + 1];
		BOOL bSuccess = Base64Encode(pEncBuffer, (int)dwOutputLen, pStrData, &nBase64Size);
		
		pStrData[nBase64Size] = '\0';
		delete [] pEncBuffer;

		CStringA strA(pStrData, nBase64Size);
		delete[] pStrData;
		return strA;
	}
#endif

	CStringA EncryptXML(CStringA strXml, BOOL bChangeBlowfishKey = FALSE)
	{
		if (bChangeBlowfishKey)
		{
			if (!NewBlowfishKey())
				return "";
		}

		m_oBlowfish.Init(m_pBlowfishKey, (DWORD)m_nBlowfishKeySize);
		
		LPBYTE pSrc = (LPBYTE)strXml.GetBuffer();
		DWORD dwInputLen = strXml.GetLength();
		DWORD dwOutputLen = m_oBlowfish.GetOutputLength(dwInputLen);

		LPBYTE pEncBuffer = new BYTE[dwOutputLen];
		if (NULL == pEncBuffer)
			return "";	

		m_oBlowfish.Encrypt(pSrc, pEncBuffer, dwInputLen);
		int nBase64Size = Base64EncodeGetRequiredLength((int)dwOutputLen);
		
		LPSTR pStrData = new char[nBase64Size + 1];
		BOOL bSuccess = Base64Encode(pEncBuffer, (int)dwOutputLen, pStrData, &nBase64Size);
		
		pStrData[nBase64Size] = '\0';
		delete [] pEncBuffer;

		CStringA strA(pStrData, nBase64Size);
		delete[] pStrData;
		return strA;
	}

protected:
	RSA::CRSAEncryptor m_oRSAEncryptor;
	long m_lRSAKeyIndex;

	LPBYTE m_pBlowfishKey;
	size_t m_nBlowfishKeySize;
	CBlowfish m_oBlowfish;

	BOOL NewBlowfishKey()
	{
		if (NULL != m_pBlowfishKey)
			delete []m_pBlowfishKey;
		
		m_pBlowfishKey = new BYTE[g_cnBlowfishKeySize];
		
		if (NULL == m_pBlowfishKey)
			return FALSE;

		srand(GetTickCount());
		for (long i = 0; i < g_cnBlowfishKeySize; i++)
			m_pBlowfishKey[i] = (rand() % 255) + 1;

		return TRUE;
	}

public:
	
	template<typename T>
	void ToInterface(T* pInterface)
	{
		SetKeyIndex(pInterface);
		SendBlowfishKey(pInterface);
	}

	IUnknown* GetBlowfishKey()
	{
		LPBYTE pEncodedKey = NULL; size_t nEncodedKeySize = 0;
		if (!m_oRSAEncryptor.Encrypt(m_pBlowfishKey, m_nBlowfishKeySize, pEncodedKey, nEncodedKeySize))
			return NULL;

		MediaCore::IAVSMediaData *pData = NULL;
		CoCreateInstance(MediaCore::CLSID_CAVSMediaData, NULL, CLSCTX_ALL, MediaCore::IID_IAVSMediaData, (void**)&pData);
		if (NULL == pData)
		{
			delete []pEncodedKey;
			return NULL;
		}
		
		pData->AllocateBuffer((long)nEncodedKeySize);
		LPBYTE pBuffer = NULL;
		pData->get_Buffer(&pBuffer);
		memcpy(pBuffer, pEncodedKey, nEncodedKeySize);
		delete []pEncodedKey;

		IUnknown* punkRes = NULL;
		pData->QueryInterface(IID_IUnknown, (void**)&punkRes);

		RELEASEINTERFACE(pData);
		return punkRes;
	}

protected:
	template<typename T>
	void SetKeyIndex(T* pData)
	{
		if (NULL == pData)
			return;
		
		VARIANT val;
		val.vt		= VT_I4;
		val.lVal	= m_lRSAKeyIndex;

		BSTR bstrName = g_csKeyIndexParamName.AllocSysString();
		pData->SetAdditionalParam(bstrName, val);
		SysFreeString(bstrName);
	}
	
	template<typename T>
	void SendBlowfishKey(T* pInterface)
	{
		if (NULL == pInterface)
			return;
		
		LPBYTE pEncodedKey = NULL; size_t nEncodedKeySize = 0;
		if (!m_oRSAEncryptor.Encrypt(m_pBlowfishKey, m_nBlowfishKeySize, pEncodedKey, nEncodedKeySize))
			return FALSE;

		MediaCore::IAVSMediaData *pData = NULL;
		CoCreateInstance(MediaCore::CLSID_CAVSMediaData, NULL, CLSCTX_ALL, MediaCore::IID_IAVSMediaData, (void**)&pData);
		if (NULL == pData)
		{
			delete []pEncodedKey;
			return;
		}
		
		pData->AllocateBuffer((long)nEncodedKeySize);
		LPBYTE pBuffer = NULL;
		pData->get_Buffer(&pBuffer);
		memcpy(pBuffer, pEncodedKey, nEncodedKeySize);
		delete []pEncodedKey;

		VARIANT val;
		val.vt = VT_UNKNOWN;
		pData->QueryInterface(__uuidof(IUnknown), (void**)&val.punkVal);
		RELEASEINTERFACE(pData);

		BSTR bstrName = g_csBlowfishKeyParamName.AllocSysString();
		pInterface->SetAdditionalParam(bstrName, val);
		SysFreeString(bstrName);		
		
		RELEASEINTERFACE(val.punkVal);
		return TRUE;
	}
};
