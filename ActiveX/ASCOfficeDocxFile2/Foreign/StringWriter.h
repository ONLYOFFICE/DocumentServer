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
#include "../../Common/DocxFormat/Source/DocxFormat/File.h"

static wchar_t g_wc_amp		= wchar_t('&');
static wchar_t g_wc_apos	= wchar_t('\'');
static wchar_t g_wc_lt		= wchar_t('<');
static wchar_t g_wc_qt		= wchar_t('>');
static wchar_t g_wc_quot	= wchar_t('\"');

static _bstr_t g_bstr_amp	= L"&amp;";
static _bstr_t g_bstr_apos	= L"&apos;";
static _bstr_t g_bstr_lt	= L"&lt;";
static _bstr_t g_bstr_qt	= L"&gt;";
static _bstr_t g_bstr_quot	= L"\"";
static _bstr_t g_bstr_mdash	= L"&mdash;";

namespace NSCommon
{
	class CStringWriter
	{
	private:
		wchar_t*	m_pData;
		size_t		m_lSize;

		wchar_t*	m_pDataCur;
		size_t		m_lSizeCur;

	public:
		CStringWriter()
		{
			m_pData = NULL;
			m_lSize = 0;

			m_pDataCur	= m_pData;
			m_lSizeCur	= m_lSize;
		}
		~CStringWriter()
		{
			RELEASEMEM(m_pData);
		}

		__forceinline void AddSize(size_t nSize, const size_t nSizeMin = 1000)
		{
			if (NULL == m_pData)
			{
				m_lSize = max(nSize, nSizeMin);				
				m_pData = (wchar_t*)malloc(m_lSize * sizeof(wchar_t));

				m_lSizeCur = 0;
				m_pDataCur = m_pData;
				return;
			}

			if ((m_lSizeCur + nSize) > m_lSize)
			{
				while ((m_lSizeCur + nSize) > m_lSize)
				{
					m_lSize *= 2;
				}

				wchar_t* pRealloc = (wchar_t*)realloc(m_pData, m_lSize * sizeof(wchar_t));
				if (NULL != pRealloc)
				{
					
					m_pData		= pRealloc;
					m_pDataCur	= m_pData + m_lSizeCur;
				}
				else
				{
					wchar_t* pMalloc = (wchar_t*)malloc(m_lSize * sizeof(wchar_t));
					memcpy(pMalloc, m_pData, m_lSizeCur * sizeof(wchar_t));

					free(m_pData);
					m_pData		= pMalloc;
					m_pDataCur	= m_pData + m_lSizeCur;
				}
			}
		}

	public:

		inline void WriteString(wchar_t* pString, size_t& nLen)
		{
			AddSize(nLen);
			
			memcpy(m_pDataCur, pString, nLen << 1);
			m_pDataCur += nLen;
			m_lSizeCur += nLen;
		}
		
		
		
		
		
		inline void WriteString(CString& sString)
		{
			size_t nLen = (size_t)sString.GetLength();

#ifdef _UNICODE
			WriteString(sString.GetBuffer(), nLen);
#else
			CStringW str = (CStringW)sString;
			WriteString(str.GetBuffer(), nLen);
#endif
		}

		inline size_t GetCurSize()
		{
			return m_lSizeCur;
		}

		inline void Write(CStringWriter& oWriter)
		{
			WriteString(oWriter.m_pData, oWriter.m_lSizeCur);
		}

		inline void Clear()
		{
			RELEASEMEM(m_pData);

			m_pData = NULL;
			m_lSize = 0;

			m_pDataCur	= m_pData;
			m_lSizeCur	= 0;
		}
		inline void ClearNoAttack()
		{
			m_pDataCur	= m_pData;
			m_lSizeCur	= 0;
		}

		CString GetData()
		{
			CString str(m_pData, (int)m_lSizeCur);
			return str;
		}
	};
}