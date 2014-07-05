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

#include "../Base/Base.h"
#include "../Base/SmartPtr.h"

#include <atlcoll.h>
#include <atlenc.h>

#ifndef _USE_NULLABLE_PROPERTY_
using namespace NSCommon;
#endif
namespace XmlUtils
{
	static CString strInvalidValue		= _T("x(-Jdl%^8sFGs@gkp14jJU(90dyjhjnb*EcfFf%#2124sf98hc");
	static _bstr_t g_cpszXML_TextExt	= L"./text()";

	
	AVSINLINE static int     GetDigit   (TCHAR c)
	{
		if (c >= '0' && c <= '9')
			return (int)(c - '0');
		if (c >= 'a' && c <= 'f')
			return 10 + (int)(c - 'a');
		if (c >= 'A' && c <= 'F')
			return 10 + (int)(c - 'A');

		return 0;
	}
	AVSINLINE static bool     IsDigit   (TCHAR c)
	{
		if (c >= '0' && c <= '9')
			return true;
		return false;
	}
	AVSINLINE static __int64 GetHex     (const CString& string)
	{
		__int64 nResult = 0;
		int nLen = string.GetLength();
		for ( int nIndex = 0; nIndex < nLen; ++nIndex )
		{
			nResult += GetDigit( string[nIndex] ) << ( 4 * ( nLen - 1 - nIndex ) );
		}

		return nResult;
	}
	AVSINLINE static int     GetColor   (const CString& string)
	{
		
		int blue = 0;
		int green = 0;
		int red = 0;

		CString color = string; color = color.Trim();
				
		if (color.Find(_T("0x"))!=-1)
			color.Delete(0,2);
		if (color.Find(_T("#"))!=-1)
			color.Delete(0,1);

		while (color.GetLength() < 6)
			color = _T("0") + color;

		red = 16*GetDigit(color[0]) + GetDigit(color[1]);
		green = 16*GetDigit(color[2]) + GetDigit(color[3]);
		blue = 16*GetDigit(color[4]) + GetDigit(color[5]);

		return RGB(red, green, blue);
	}
	AVSINLINE static BOOL    GetBoolean (const CString& string)
	{
		CString s = string; s.MakeLower();

		return (s == _T("true"));
	}
	AVSINLINE static bool    GetBoolean2(const CString& string)
	{
		CString sTemp = string; sTemp.MakeLower();

		return ( _T("true") == sTemp || _T("1") == sTemp || _T("t") == sTemp || _T("on") == sTemp );
	}
	AVSINLINE static int     GetInteger (const CString& string)
	{
		return _ttoi(string);
	}
	AVSINLINE static double  GetDouble  (const CString& string)
	{
		double d = 0;
		_stscanf(string, _T("%lf"), &d);
		return d;
	}
	AVSINLINE static float   GetFloat   (const CString& string)
	{
		float f = 0;
		_stscanf(string, _T("%f"), &f);
		return f;
	}
	AVSINLINE static int     GetInteger (BSTR string)
	{
		return _wtoi(string);
	}
	AVSINLINE static size_t  GetUInteger(BSTR string)
	{
		return (size_t)_wtoi(string);
	}
	AVSINLINE static double  GetDouble  (BSTR string)
	{
		double d = 0;
		swscanf(string, _T("%lf"), &d);
		return d;
	}
	AVSINLINE static float   GetFloat   (BSTR string)
	{
		float f = 0;
		swscanf(string, _T("%f"), &f);
		return f;
	}
	AVSINLINE static void    GetDouble  (BSTR string, double* p)
	{
		*p = 0;
		swscanf(string, _T("%lf"), *p);
	}
	AVSINLINE static void    GetFloat   (BSTR string, float* p)
	{
		*p = 0;
		swscanf(string, _T("%f"), *p);
	}
	AVSINLINE static void    GetInteger (BSTR string, int* p)
	{
		*p = 0;
		swscanf(string, _T("%d"), *p);
	}

	AVSINLINE CString BoolToString  (const bool  & value)
	{
		CString sResult = ( value ? _T("true") : _T("false") );
		return sResult;
	}
	AVSINLINE CString IntToString   (const int   & value)
	{
		CString str = _T("");
		str.Format(_T("%d"), value);
		return str;
	}
	AVSINLINE CString UIntToString  (const size_t   & value)
	{
		CString str = _T("");
		str.Format(_T("%u"), value);
		return str;
	}
	AVSINLINE CString FloatToString (const float & value)
	{
		CString str = _T("");
		str.Format(_T("%f"), value);
		return str;
	}
	AVSINLINE CString DoubleToString(const double& value)
	{
		CString str = _T("");
		str.Format(_T("%lf"), value);
		return str;
	}
	AVSINLINE static CString GetLower(const CString& string)
	{
		
		
		CString sResult;

		for( int nIndex = 0; nIndex < string.GetLength(); nIndex++)
			sResult += wchar_t( towlower(string[nIndex]) );

		return sResult;
	}
	AVSINLINE static CString GetUpper(const CString& string)
	{
		CString sResult;

		for( int nIndex = 0; nIndex < string.GetLength(); nIndex++)
			sResult += wchar_t( towupper(string[nIndex]) );

		return sResult;
	}
	AVSINLINE static bool IsUnicodeSymbol( WCHAR symbol )
	{
		bool result = false;

		if ( ( 0x0009 == symbol ) || ( 0x000A == symbol ) || ( 0x000D == symbol ) ||
			( ( 0x0020 <= symbol ) && ( 0xD7FF >= symbol ) ) || ( ( 0xE000 <= symbol ) && ( symbol <= 0xFFFD ) ) ||
			( ( 0x10000 <= symbol ) && symbol ) )
		{
			result = true;
		}

		return result;		  
	}
	AVSINLINE static CString EncodeXmlString(const CString& string)
	{
		CString sResult = string;
		for (unsigned int i = 0, length = sResult.GetLength(); i < length; ++i )
		{
			if ( false == IsUnicodeSymbol( sResult.GetAt(i) ) )
			{
				sResult.SetAt(i, ' ');
			}
		}
		sResult.Replace(_T("&"),	_T("&amp;"));			
		sResult.Replace(_T("'"),	_T("&apos;"));
		sResult.Replace(_T("<"),	_T("&lt;"));
		sResult.Replace(_T(">"),	_T("&gt;"));
		sResult.Replace(_T("\""),	_T("&quot;"));
		return sResult;
	}
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

		__forceinline void AddSize(size_t nSize)
		{
			if (NULL == m_pData)
			{
				m_lSize = max(nSize, 1000);				
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

		__forceinline void WriteString(wchar_t* pString, size_t& nLen)
		{
			AddSize(nLen);
			
			memcpy(m_pDataCur, pString, nLen << 1);
			m_pDataCur += nLen;
			m_lSizeCur += nLen;
		}
		__forceinline void WriteString(_bstr_t& bsString)
		{
			size_t nLen = bsString.length();
			WriteString(bsString.GetBSTR(), nLen);
		}
		__forceinline void WriteString(const CString& sString)
		{
			size_t nLen = (size_t)sString.GetLength();

#ifdef _UNICODE
			CString str = sString;
			WriteString(str.GetBuffer(), nLen);
#else
			CStringW str = (CStringW)sString;
			WriteString(str.GetBuffer(), nLen);
#endif
		}

		__forceinline void AddCharSafe(const TCHAR& _c)
		{
			AddSize(1);
			*m_pDataCur++ = _c;
			++m_lSizeCur;
		}
		__forceinline void AddChar2Safe(const TCHAR _c1, const TCHAR& _c2)
		{
			AddSize(2);
			*m_pDataCur++ = _c1;
			*m_pDataCur++ = _c2;
			m_lSizeCur += 2;
		}

		inline void WriteEncodeXmlString(const wchar_t* pString)
		{
			const wchar_t* pData = pString;
			while (*pData != 0)
			{
				BYTE _code = CheckCode(*pData);

				switch (_code)
				{
				case 1:
					AddCharSafe(*pData);
					break;
				case 0:
					AddCharSafe((WCHAR)' ');
					break;
				case 2:
					AddSize(5);
					*m_pDataCur++ = (WCHAR)('&');
					*m_pDataCur++ = (WCHAR)('a');
					*m_pDataCur++ = (WCHAR)('m');
					*m_pDataCur++ = (WCHAR)('p');
					*m_pDataCur++ = (WCHAR)(';');
					m_lSizeCur += 5;
					break;
				case 3:
					AddSize(6);
					*m_pDataCur++ = (WCHAR)('&');
					*m_pDataCur++ = (WCHAR)('a');
					*m_pDataCur++ = (WCHAR)('p');
					*m_pDataCur++ = (WCHAR)('o');
					*m_pDataCur++ = (WCHAR)('s');
					*m_pDataCur++ = (WCHAR)(';');
					m_lSizeCur += 6;
					break;
				case 4:
					AddSize(4);
					*m_pDataCur++ = (WCHAR)('&');
					*m_pDataCur++ = (WCHAR)('l');
					*m_pDataCur++ = (WCHAR)('t');
					*m_pDataCur++ = (WCHAR)(';');
					m_lSizeCur += 4;
					break;
				case 5:
					AddSize(4);
					*m_pDataCur++ = (WCHAR)('&');
					*m_pDataCur++ = (WCHAR)('g');
					*m_pDataCur++ = (WCHAR)('t');
					*m_pDataCur++ = (WCHAR)(';');
					m_lSizeCur += 4;
					break;
				case 6:
					AddSize(6);
					*m_pDataCur++ = (WCHAR)('&');
					*m_pDataCur++ = (WCHAR)('q');
					*m_pDataCur++ = (WCHAR)('u');
					*m_pDataCur++ = (WCHAR)('o');
					*m_pDataCur++ = (WCHAR)('t');
					*m_pDataCur++ = (WCHAR)(';');
					m_lSizeCur += 6;
					break;
				default:
					break;						
				}
			
				++pData;
			}

		}

		__forceinline size_t GetCurSize()
		{
			return m_lSizeCur;
		}

		__forceinline void Write(CStringWriter& oWriter)
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

	protected:
		static BYTE m_arTableUnicodes[65536];
		static BOOL m_bInitTable;

	protected:
		static BYTE CheckCode(const WCHAR& c)
		{
			if (!m_bInitTable)
			{
				memset(m_arTableUnicodes, 0, 65536);
				m_arTableUnicodes[0x0009] = 1;
				m_arTableUnicodes[0x000A] = 1;
				m_arTableUnicodes[0x000D] = 1;

				memset(m_arTableUnicodes + 0x0020, 1, 0xD7FF - 0x0020 + 1);
				memset(m_arTableUnicodes + 0xE000, 1, 0xFFFD - 0xE000 + 1);

				m_arTableUnicodes['&'] = 2;
				m_arTableUnicodes['\''] = 3;
				m_arTableUnicodes['<'] = 4;
				m_arTableUnicodes['>'] = 5;
				m_arTableUnicodes['\"'] = 6;

				m_bInitTable = TRUE;
			}
			return m_arTableUnicodes[c];
		}
	};	
}
