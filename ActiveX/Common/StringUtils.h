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

#include "../Common/Structures.h"
#include "../Common/Base64.h"
	
#ifdef USE_ATL_CSTRING
	
	namespace Strings
	{
		static BOOL NotEquals(const CString& strValue1, const CString& strValue2)
		{
			
			

			

			return (strValue1 != strValue2);
		}
		static CString ToLower(const CString& strValue)
		{
			CString s = strValue;
			
			s.MakeLower();

			return s;
		}
		static CString ToUpper(const CString& strValue)
		{
			CString s = strValue;
			
			s.MakeUpper();

			return s;
		}
		static CString Substring(const CString& strValue, int nFirst, int nCount)
		{
			if (nCount < 1)
				return _T("");

			return strValue.Mid(nFirst, nCount);
		}
		static int IndexOf(const CString& strValue, const CString& strSubstring, int nStart = 0)
		{
			return strValue.Find(strSubstring, nStart);
		}
		static int LastIndexOf(const CString& strValue, const CString& strSubstring)
		{
			CString strValueReverse = strValue;
			CString strSubstringReverse = strSubstring;

			strValueReverse.MakeReverse();
			strSubstringReverse.MakeReverse();

			int nIndex = IndexOf(strValueReverse, strSubstringReverse);

			if (nIndex < 0)
				return -1;

			return strValue.GetLength() - nIndex - strSubstring.GetLength();
		}
		static int Split(const CString& strValue, const CString& strSplitter, Templates::CArray<CString>& arrSubstrings)
		{
			if (strSplitter.GetLength() < 1)
			{
				arrSubstrings.Add(strValue);
				return arrSubstrings.GetCount();
			}

			int nStart = 0;

			int nIndex = IndexOf(strValue, strSplitter, nStart);

			while (nIndex >= 0)
			{
				CString strPart = Substring(strValue, nStart, nIndex - nStart);

				if (strPart.GetLength() > 0)
					arrSubstrings.Add(strPart);

				nStart = nIndex + strSplitter.GetLength();

				nIndex = IndexOf(strValue, strSplitter, nStart);
			}

			CString strLastPart = Substring(strValue, nStart, strValue.GetLength() - nStart);

			if (strLastPart.GetLength() > 0)
				arrSubstrings.Add(strLastPart);
		
			return arrSubstrings.GetCount();
		}
		static BOOL StartsWith(const CString& strValue, const CString& strSubstring)
		{
			return (IndexOf(strValue, strSubstring) == 0);
		}
		static BOOL EndsWith(const CString& strValue, const CString& strSubstring)
		{
			return (LastIndexOf(strValue, strSubstring) == strValue.GetLength() - strSubstring.GetLength());
		}
		
		static int ToDigit(TCHAR c)
		{
			if (c >= '0' && c <= '9')
				return (int)(c - '0');
			if (c >= 'a' && c <= 'f')
				return 10 + (int)(c - 'a');
			if (c >= 'A' && c <= 'F')
				return 10 + (int)(c - 'A');

			return 0;
		}
		static COLORREF ToColor(const CString& strValue)
		{
			
			int blue = 0;
			int green = 0;
			int red = 0;

			CString color = strValue; color = color.Trim();
					
			if (color.Find(_T("0x"))!=-1)
				color.Delete(0,2);
			if (color.Find(_T("#"))!=-1)
				color.Delete(0,1);

			while (color.GetLength() < 6)
				color = _T("0") + color;

			red = 16*ToDigit(color[0]) + ToDigit(color[1]);
			green = 16*ToDigit(color[2]) + ToDigit(color[3]);
			blue = 16*ToDigit(color[4]) + ToDigit(color[5]);

			return RGB(red, green, blue);
		}
		static void ToColor(const CString& strValue, int& nR, int& nG, int& nB, int& nA)
		{
			CString color = strValue; color = color.Trim();
					
			if (color.Find(_T("0x"))!=-1)
				color.Delete(0,2);
			if (color.Find(_T("#"))!=-1)
				color.Delete(0,1);

			while (color.GetLength() < 8)
				color = _T("0") + color;

			nA = 16*ToDigit(color[0]) + ToDigit(color[1]);
			nR = 16*ToDigit(color[2]) + ToDigit(color[3]);
			nG = 16*ToDigit(color[4]) + ToDigit(color[5]);
			nB = 16*ToDigit(color[6]) + ToDigit(color[7]);
		}
		static BOOL ToBoolean(const CString& strValue)
		{
			CString s = strValue;
			
			s.MakeLower();

			return (s == _T("true"));
		}
		static int ToInteger(const CString& strValue)
		{
			return _ttoi(strValue);
		}
		static double ToDouble(const CString& strValue)
		{
			double d = 0;

			_stscanf(strValue, _T(" %lf"), &d);

			return d;
		}
		static BOOL ToBinary(const CString& strValue, BYTE*& pData, int& nSizeAllocated, int& nSizeArray)
		{
			pData = NULL;
			nSizeArray = 0;
			nSizeAllocated = Base64::Base64DecodeGetRequiredLength(strValue.GetLength());

			if (nSizeAllocated < 1)
				return FALSE;
			
			pData = new BYTE[nSizeAllocated];
			if (!pData)
				return FALSE;

			nSizeArray = nSizeAllocated;

			CT2A convert(strValue);

			if (!Base64::Base64Decode(convert, strValue.GetLength(), pData, &nSizeArray))
			{
				delete[] pData;
				pData = NULL;
				nSizeArray = 0;
				nSizeAllocated = 0;
				return FALSE;
			}

			return TRUE;
		}
		
		static CString FromInteger(int Value, int Base = 10)
		{
			CString str;
			
			str.Format(_T("%d"), Value);

			return str;
		}
		static CString FromDouble(double Value)
		{
			CString str;
			
			str.Format(_T("%lf"), Value);

			return str;
		}
		static CString FromBoolean(BOOL Value)
		{
			if (Value)
				return _T("true");

			return _T("false");
		}
		static CStringA FromBinary(const BYTE* pData, long lSize)
		{
			if ((NULL == pData) || (0 == lSize))
				return "";

			CStringA sResult;
			int nStrSize = Base64::Base64EncodeGetRequiredLength(lSize);

			LPSTR pStrData = sResult.GetBuffer(nStrSize + 1);
			BOOL bSuccess = Base64::Base64Encode(pData, lSize, pStrData, &nStrSize);
			
			pStrData[nStrSize] = '\0';
			sResult.ReleaseBuffer();
			return sResult;
		}

		static CString FromVariant(VARIANT val)
		{
			CString sVal = _T("");
			switch (VT_TYPEMASK & val.vt)
			{
			case VT_EMPTY:
				break;
			case VT_NULL:
				sVal = _T("");
				break;
			case VT_I2:
				sVal.Format(_T("%d"), val.iVal);
				break;
			case VT_I4:
				sVal.Format(_T("%d"), val.lVal);
				break;
			case VT_R4:
				sVal.Format(_T("%f"), val.fltVal);
				break;
			case VT_R8:
				sVal.Format(_T("%f"), val.dblVal);
				break;
			case VT_DATE:
				sVal.Format(_T("%f"), val.date);
				break;
			case VT_BSTR:
				sVal = val.bstrVal;
				break;
			case VT_BOOL:
				sVal = (VARIANT_TRUE == val.boolVal) ? _T("1") : _T("0");
				break;
			case VT_VARIANT:
				sVal = _T("");
				break;
			case VT_UNKNOWN:
				sVal = _T("");
				
				break;
			case VT_I1:
				sVal.Format(_T("%d"), val.cVal);
				break;
			case VT_UI1:
				sVal.Format(_T("%d"), val.bVal);
				break;
			case VT_UI2:
				sVal.Format(_T("%d"), val.uiVal);
				break;
			case VT_UI4:
				sVal.Format(_T("%d"), val.ulVal);
				break;
			case VT_I8:
				sVal.Format(_T("%d"), val.llVal);
				break;
			case VT_UI8:
				sVal.Format(_T("%d"), val.ullVal);
				break;
			case VT_INT:
				sVal.Format(_T("%d"), val.intVal);
				break;
			case VT_UINT:
				sVal.Format(_T("%d"), val.uintVal);
				break;
			case VT_DECIMAL:
			case VT_CY:
			case VT_SAFEARRAY:
			case VT_VOID:
			case VT_HRESULT:
			case VT_CARRAY:
			case VT_USERDEFINED:
			case VT_LPSTR:
			case VT_LPWSTR:
			case VT_RECORD:
			case VT_INT_PTR:
			case VT_UINT_PTR:
			case VT_FILETIME:
			case VT_BLOB:
			case VT_STREAM:
			case VT_STORAGE:
			case VT_STREAMED_OBJECT:
			case VT_STORED_OBJECT:
			case VT_BLOB_OBJECT:
			case VT_CF:
			case VT_CLSID:
			case VT_VERSIONED_STREAM:
			case VT_BSTR_BLOB:
				sVal = _T("");
				break;
			}

			return sVal;
		}
	}
	
#endif

#ifdef USE_EXTENDED_STRINGS

	#ifdef USE_MFC_STRING
		
		class CMfcString
		{
			CString m_string;

		public:
			
			CMfcString()
			{
				m_string.Empty();
			}
			CMfcString(const CMfcString& str)
			{
				operator= (str);
			}
			CMfcString(const TCHAR ch)
			{
				operator= (ch);
			}
			CMfcString(const TCHAR* pch)
			{
				operator= (pch);
			}
			CMfcString(const _bstr_t& bstr_t)
			{
				operator= (bstr_t);
			}
			CMfcString(const CString& str)
			{
				operator= (str);
			}
			
			CMfcString& operator= (const CMfcString& str)
			{
				m_string = str.m_string;
				
				return *this;
			}
			CMfcString& operator= (const TCHAR ch)
			{
				m_string = ch;
				
				return *this;
			}
			CMfcString& operator= (const TCHAR* pch)
			{
				m_string = pch;
				
				return *this;
			}
			CMfcString& operator= (const _bstr_t& bstr_t)
			{
				m_string = (TCHAR*)bstr_t;

				return *this;
			}
			CMfcString& operator= (const CString& str)
			{
				m_string = str;

				return *this;
			}
				
			CMfcString& operator += (const CMfcString& str)
			{
				m_string += str.m_string;
				
				return *this;
			}
			CMfcString& operator += (const TCHAR ch)
			{
				CMfcString str(ch);
				
				return operator += (str);
			}
			CMfcString& operator += (const TCHAR* pch)
			{
				CMfcString str(pch);
				
				return operator += (str);
			}
			CMfcString& operator += (const _bstr_t& bstr_t)
			{
				CMfcString str(bstr_t);
				
				return operator += (str);
			}
			CMfcString& operator += (const CString& str)
			{
				m_string += str;

				return *this;
			}
				
			friend CMfcString operator+ (const CMfcString& str1, const CMfcString& str2)
			{
				CMfcString str(str1);
				
				str += str2;
				
				return str;
			}
			friend BOOL operator== (const CMfcString& str1, const CMfcString& str2)
			{
				return (str1.m_string.Compare(str2.m_string) == 0);
			}
			friend BOOL operator!= (const CMfcString& str1, const CMfcString& str2)
			{
				return !operator== (str1, str2);
			}
				
			TCHAR operator[] (int index) const
			{
				return m_string[index];
			}
			operator TCHAR*() const
			{
				return (TCHAR*)m_string;
			}
			operator _bstr_t() const
			{
				_bstr_t strResult(m_string);
				
				return strResult;
			}
			operator CString()
			{
				return m_string;
			}
				
			int GetLength() const
			{
				return (int)m_string.GetLength();
			}
			TCHAR* GetBuffer(int nSize)
			{
				return m_string.GetBuffer(nSize);
			}
			BOOL IsEmpty()
			{
				return m_string.IsEmpty();
			}
			void Reserve(int size)
			{
				m_string.Preallocate(size);
			}
			void Clear()
			{
				m_string = _T("");
			}
			void Delete(int index, int count)
			{
				m_string.Delete(index, count);
			}
			void MakeLower()
			{
				m_string.MakeLower();
			}
			void MakeUpper()
			{
				m_string.MakeUpper();
			}
			void Append(const CMfcString& str)
			{
				m_string.Append(str.m_string);
			}
			void Replace(const CMfcString& strOld, const CMfcString& strNew)
			{
				m_string.Replace(strOld.m_string, strNew.m_string);
			}
			void Insert(int index, const CMfcString& str)
			{
				m_string.Insert(index, str.m_string);
			}
			void TrimLeft() 
			{ 
				m_string.TrimLeft();
			}
			void TrimRight() 
			{ 
				m_string.TrimRight();
			}
			void Trim() 
			{
				TrimLeft();
				TrimRight();
			}
			
			CMfcString Left(int count) const
			{
				return Substring(0, count);
			}
			CMfcString Right(int count) const
			{
				return Substring(m_string.GetLength() - count, count);
			}
			CMfcString Substring(int index, int count) const
			{
				CMfcString strResult;
				
				strResult.m_string = m_string.Mid(index, count);
				
				return strResult;
			}
			
			void Format(const TCHAR* strFormat,...)
			{
				va_list args;
				
				va_start(args, strFormat);
				
				m_string.Format(strFormat, args);
				
				va_end(args);
			}
			
			int Compare(const CMfcString& str)
			{
				return m_string.Compare(str.m_string);
			}
			int CompareNoCase(const CMfcString& str)
			{
				return m_string.CompareNoCase(str.m_string);
			}
			int IndexOf(TCHAR ch, int start) const
			{
				return (int)m_string.Find(ch, start);
			}
			int IndexOf(const CMfcString& str, int start) const
			{
				return (int)m_string.Find(str.m_string, start);
			}
			int LastIndexOf(TCHAR ch) const
			{
				return (int)m_string.ReverseFind(ch);
			}
			int LastIndexOf(const CMfcString& str) const
			{
				CString strValueReverse = m_string;
				CString strSubstringReverse = str;

				strValueReverse.MakeReverse();
				strSubstringReverse.MakeReverse();

				int nIndex = IndexOf(strSubstringReverse, 0);

				if (nIndex < 0)
					return -1;

				return GetLength() - nIndex - str.GetLength();
			}
			BOOL StartsWith(const CMfcString& str) const
			{
				return (IndexOf(str, 0) == 0);
			}
			BOOL StartsWith(TCHAR ch) const
			{
				return (IndexOf(ch, 0) == 0);
			}
			BOOL EndsWith(const CMfcString& str) const
			{
				return (LastIndexOf(str) == (m_string.GetLength() - str.m_string.GetLength()));
			}
			BOOL EndsWith(TCHAR ch) const
			{
				return (m_string.ReverseFind(ch) == (m_string.GetLength() - 1));
			}
		};
			
		#undef String
		#define String CMfcString
		
	#endif
	
	#ifdef USE_STD_STRING
		
		#include <string>
		#include <vector>
		#include <algorithm>	
		
		typedef std::basic_string<TCHAR> TStdString;
		
		namespace std
		{
			class Tokenizer 
			{
			protected:
						
				size_t m_Offset;
				const TStdString m_String;
				TStdString m_Token;
				TStdString m_Delimiters;
					
			public:

				Tokenizer(const TStdString& str) 
					: m_String(str)
					, m_Offset(0)
					, m_Delimiters(" \t\n\r")
				{
				}
				Tokenizer(const TStdString& str, const TStdString& delimiters)
					: m_String(str)
					, m_Offset(0)
					, m_Delimiters(delimiters)
				{
				}
				
				BOOL nextToken()
				{
					return nextToken(m_Delimiters);
				}
				BOOL nextToken(const TStdString& delimiters)
				{
					
					size_t i = m_String.find_first_not_of(delimiters, m_Offset);

					if (i == TStdString::npos)
					{
						m_Offset = m_String.length();
						return FALSE;
					}

					
					size_t j = m_String.find_first_of(delimiters, i);
					if (j == TStdString::npos)
					{
						m_Token = m_String.substr(i);
						m_Offset = m_String.length();
						return TRUE;
					}

					
					m_Token = m_String.substr(i, j - i);
					m_Offset = j;

					return TRUE;
				}
				const TStdString getToken() const
				{
					return m_Token;
				}
				
				
				void reset()
				{
					m_Offset = 0;
				}
			};
			
			std::vector<TStdString> split(const TStdString& str, const TStdString& delimiters)
			{
				std::vector<TStdString> ss;

				Tokenizer tokenizer(str, delimiters);

				while (tokenizer.nextToken())
					ss.push_back(tokenizer.getToken());

				return ss;
			}
		}
		
		class CStdString
		{
			TStdString m_string;

		public:
			
			CStdString()
			{
				m_string.clear();
			}
			CStdString(const CStdString& str)
			{
				operator= (str);
			}
			CStdString(const TCHAR ch)
			{
				operator= (ch);
			}
			CStdString(const TCHAR* pch)
			{
				operator= (pch);
			}
			CStdString(const BSTR bstr)
			{
				operator= (bstr);
			}
			CStdString(const TStdString& str)
			{
				operator= (str);
			}
			
			CStdString& operator= (const CStdString& str)
			{
				m_string = str.m_string;
				
				return *this;
			}
			CStdString& operator= (const TCHAR ch)
			{
				m_string = ch;
				
				return *this;
			}
			CStdString& operator= (const TCHAR* pch)
			{
				m_string = pch;
				
				return *this;
			}
			CStdString& operator= (const BSTR bstr)
			{
				m_string = (TCHAR*)bstr;
				
				return *this;
			}
			CStdString& operator= (const TStdString& str)
			{
				m_string = str;

				return *this;
			}
				
			CStdString& operator += (const CStdString& str)
			{
				m_string += str.m_string;
				
				return *this;
			}
			CStdString& operator += (const TCHAR ch)
			{
				CStdString str(ch);
				
				return operator += (str);
			}
			CStdString& operator += (const TCHAR* pch)
			{
				CStdString str(pch);
				
				return operator += (str);
			}
			CStdString& operator += (const BSTR bstr)
			{
				CStdString str(bstr);
				
				return operator += (str);
			}
			CStdString& operator += (const TStdString& str)
			{
				m_string += str;

				return *this;
			}
				
			friend CStdString operator+ (const CStdString& str1, const CStdString& str2)
			{
				CStdString str(str1);
				
				str += str2;
				
				return str;
			}
			friend BOOL operator== (const CStdString& str1, const CStdString& str2)
			{
				return (str1.m_string.compare(str2.m_string) == 0);
			}
			friend BOOL operator!= (const CStdString& str1, const CStdString& str2)
			{
				return !operator== (str1, str2);
			}
				
			TCHAR operator[] (int index) const
			{
				return m_string[index];
			}
			operator BSTR() const
			{
				return (BSTR)m_string.c_str();
			}
			operator TStdString()
			{
				return m_string;
			}
			operator TCHAR*() const
			{
				return (TCHAR*)m_string.data();
			}

				
			int GetLength() const
			{
				return (int)m_string.length();
			}
			TCHAR* GetBuffer(int nSize)
			{
				if (nSize > 0)
					Reserve(nSize);

				return (TCHAR*)m_string.data();
			}
			BOOL IsEmpty()
			{
				return m_string.empty();
			}
			void Reserve(int size)
			{
				m_string.reserve(size);
			}
			void Clear()
			{
				m_string.clear();
			}
			void Delete(int index, int count)
			{
				m_string.erase(index, count);
			}
			void MakeLower()
			{
				std::transform(m_string.begin(), m_string.end(), m_string.begin(), tolower);
			}
			void MakeUpper()
			{
				std::transform(m_string.begin(), m_string.end(), m_string.begin(), toupper);
			}
			void Append(const CStdString& str)
			{
				m_string.append(str.m_string);
			}
			void Replace(const CStdString& strOld, const CStdString& strNew)
			{
				if (strOld.m_string.empty())
					return;

				size_t nPos = 0;

				for (;;)
				{
					nPos = m_string.find(strOld.m_string, nPos);

					if (nPos == m_string.npos)
						break;

					m_string.replace(nPos, strOld.m_string.size(), strNew.m_string);

					nPos += strNew.m_string.size();
				}
			}
			void Insert(int index, const CStdString& str)
			{
				m_string.insert(index, str.m_string);
			}
			void TrimLeft() 
			{ 
				TStdString::iterator oIterator;

				for (oIterator = m_string.begin(); oIterator != m_string.end(); ++oIterator)
					if (!isspace(*oIterator))
						break;

				if (oIterator == m_string.end())
					m_string.clear();
				else
					m_string.erase(m_string.begin(), oIterator);
			}
			void TrimRight() 
			{ 
				if (m_string.begin() == m_string.end())
					return;

				TStdString::iterator oIterator;

				for (oIterator = m_string.end() - 1; ; --oIterator)
				{
					if (!isspace(*oIterator))
					{
						m_string.erase(oIterator + 1, m_string.end());
						break;
					}

					if (oIterator == m_string.begin())
					{
						m_string.clear();
						break;
					}
				}
			}
			void Trim() 
			{
				TrimLeft();
				TrimRight();
			}
			
			CStdString Left(int count) const
			{
				CStdString strResult;
				
				strResult.m_string = m_string.substr(0, count);
				
				return strResult;
			}
			CStdString Right(int count) const
			{
				CStdString strResult;
				
				strResult.m_string = m_string.substr(m_string.length() - count, count);
				
				return strResult;
			}
			CStdString Substring(int index, int count) const
			{
				CStdString strResult;
				
				strResult.m_string = m_string.substr(index, count);
				
				return strResult;
			}
			
			int Format(const TCHAR* strFormat,...)
			{
				int nMaxChars = 4096;  

				std::vector<TCHAR> _buffer(nMaxChars);
				
				va_list argList;
				va_start(argList, strFormat);

				
				int ret = _vsnprintf(&_buffer[0], nMaxChars, strFormat, argList);


				va_end(argList);
				
				m_string.assign(&_buffer[0], ret);
				
				return ret;
			}
			
			int Compare(const CStdString& str)
			{
				return m_string.compare(str.m_string);
			}
			int CompareNoCase(const CStdString& str)
			{
				TStdString::const_iterator oIterator1 = m_string.begin();
				TStdString::const_iterator oIterator2 = str.m_string.begin();

				
				while ( (oIterator1 != m_string.end()) && (oIterator2 != str.m_string.end()) ) 
				{ 
					
					if (::toupper(*oIterator1) != ::toupper(*oIterator2))
						return (::toupper(*oIterator1) < ::toupper(*oIterator2)) ? -1 : 1;  

					
					++oIterator1;
					++oIterator2;
				}

				
				size_t size1 = m_string.size();
				size_t size2 = str.m_string.size();

				
				if (size1 == size2) 
					return 0;

				return (size1 < size2) ? -1 : 1;
			}
			int IndexOf(TCHAR ch, int start) const
			{
				return (int)m_string.find(ch, start);
			}
			int IndexOf(const CStdString& str, int start) const
			{
				return (int)m_string.find(str.m_string, start);
			}
			int LastIndexOf(TCHAR ch) const
			{
				return (int)m_string.rfind(ch);
			}
			int LastIndexOf(const CStdString& str) const
			{
				return (int)m_string.rfind(str.m_string);
			}
			BOOL StartsWith(const CStdString& str) const
			{
				return (m_string.find(str.m_string, 0) == 0);
			}
			BOOL StartsWith(TCHAR ch) const
			{
				return (m_string.find(ch, 0) == 0);
			}
			BOOL EndsWith(const CStdString& str) const
			{
				return (m_string.rfind(str.m_string) == (m_string.length() - str.m_string.length()));
			}
			BOOL EndsWith(TCHAR ch) const
			{
				return (m_string.rfind(ch) == (m_string.length() - 1));
			}
		};
		
		#undef String
		#define String CStdString
	
	#endif
	
	namespace Strings
	{
		static BOOL NotEquals(const TCHAR* pszValue1, const TCHAR* pszValue2)
		{
			
			

			

			String strValue1 = pszValue1;
			String strValue2 = pszValue2;

			return (strValue1 != strValue2);
		}
		static String ToLower(const String& strValue)
		{
			String s = strValue;
			
			s.MakeLower();

			return s;
		}
		static String ToUpper(const String& strValue)
		{
			String s = strValue;
			
			s.MakeUpper();

			return s;
		}
		static String Substring(const String& strValue, int nFirst, int nCount)
		{
			if (nCount < 1)
				return _T("");

			return strValue.Substring(nFirst, nCount);
		}
		static int IndexOf(const String& strValue, const String& strSubstring, int nStart = 0)
		{
			return strValue.IndexOf(strSubstring, nStart);
		}
		static int LastIndexOf(const String& strValue, const String& strSubstring)
		{
			return strValue.LastIndexOf(strSubstring);
		}
		static int Split(const TCHAR* pszValue, const TCHAR* pszSplitter, Templates::CArray<String>& arrSubstrings)
		{
			String strValue = pszValue;
			String strSplitter = pszSplitter;

			if (strSplitter.GetLength() < 1)
			{
				arrSubstrings.Add(strValue);
				return arrSubstrings.GetCount();
			}

			int nStart = 0;

			int nIndex = IndexOf(strValue, strSplitter, nStart);

			while (nIndex >= 0)
			{
				String strPart = Substring(strValue, nStart, nIndex - nStart);

				if (strPart.GetLength() > 0)
					arrSubstrings.Add(strPart);

				nStart = nIndex + strSplitter.GetLength();

				nIndex = IndexOf(strValue, strSplitter, nStart);
			}

			String strLastPart = Substring(strValue, nStart, strValue.GetLength() - nStart);

			if (strLastPart.GetLength() > 0)
				arrSubstrings.Add(strLastPart);
		
			return arrSubstrings.GetCount();
		}
		static BOOL StartsWith(const String& strValue, const String& strSubstring)
		{
			return strValue.StartsWith(strSubstring);
		}
		static BOOL EndsWith(const String& strValue, const String& strSubstring)
		{
			return strValue.EndsWith(strSubstring);
		}
		
		static int ToDigit(char c)
		{
			if (c >= '0' && c <= '9')
				return (int)(c - '0');
			if (c >= 'a' && c <= 'f')
				return 10 + (int)(c - 'a');
			if (c >= 'A' && c <= 'F')
				return 10 + (int)(c - 'A');

			return 0;
		}
		static COLORREF ToColor(const TCHAR* strValue)
		{
			
			int blue = 0;
			int green = 0;
			int red = 0;

			String color = strValue;
			
			color.Trim();
					
			if (color.IndexOf("0x", 0) != -1)
				color.Delete(0, 2);
			if (color.IndexOf("#", 0) != -1)
				color.Delete(0, 1);

			while (color.GetLength() < 6)
				color = String("0") + color;

			red = 16*ToDigit(color[0]) + ToDigit(color[1]);
			green = 16*ToDigit(color[2]) + ToDigit(color[3]);
			blue = 16*ToDigit(color[4]) + ToDigit(color[5]);

			return RGB(red, green, blue);
		}
		static BOOL ToBoolean(const TCHAR* strValue)
		{
			String s = strValue;
			
			s.MakeLower();

			return (s == String("true"));
		}
		static int ToInteger(const TCHAR* strValue)
		{
			int nValue = 0;

			sscanf(strValue, " %d", &nValue);

			return nValue;
		}
		static double ToDouble(const TCHAR* strValue)
		{
			double dValue = 0;

			sscanf(strValue, " %lf", &dValue);

			return dValue;
		}
		static BOOL ToBinary(const TCHAR* pszValue, BYTE*& pData, int& nSizeAllocated, int& nSizeArray)
		{
			String strValue = pszValue;

			pData = NULL;
			nSizeArray = 0;
			nSizeAllocated = Base64::Base64DecodeGetRequiredLength(strValue.GetLength());

			if (nSizeAllocated < 1)
				return FALSE;
			
			pData = new BYTE[nSizeAllocated];
			if (!pData)
				return FALSE;

			nSizeArray = nSizeAllocated;

			if (!Base64::Base64Decode(pszValue, strValue.GetLength(), pData, &nSizeArray))
			{
				delete[] pData;
				pData = NULL;
				nSizeArray = 0;
				nSizeAllocated = 0;
				return FALSE;
			}

			return TRUE;
		}
		
		static String FromInteger(int nValue, int Base = 10)
		{
			String str;
			
			str.Format("%d", nValue);

			return str;
		}
		static String FromDouble(double dValue)
		{
			String str;
			
			str.Format("%lf", dValue);

			return str;
		}
		static String FromBoolean(BOOL bValue)
		{
			if (bValue)
				return "true";

			return "false";
		}
		static String FromBinary(const BYTE* pData, long lSize)
		{
			if ((NULL == pData) || (0 == lSize))
				return _T("");

			String sResult;
			int nStrSize = Base64::Base64EncodeGetRequiredLength(lSize);

			LPSTR pStrData = sResult.GetBuffer(nStrSize + 1);
			BOOL bSuccess = Base64::Base64Encode(pData, lSize, pStrData, &nStrSize);
			
			pStrData[nStrSize] = '\0';
			sResult.Clear();
			return sResult;
		}

		static String FromVariant(VARIANT val)
		{
			String sVal = _T("");
			switch (VT_TYPEMASK & val.vt)
			{
			case VT_EMPTY:
				break;
			case VT_NULL:
				sVal = _T("");
				break;
			case VT_I2:
				sVal.Format("%d", val.iVal);
				break;
			case VT_I4:
				sVal.Format("%d", val.lVal);
				break;
			case VT_R4:
				sVal.Format("%f", val.fltVal);
				break;
			case VT_R8:
				sVal.Format("%f", val.dblVal);
				break;
			case VT_DATE:
				sVal.Format("%f", val.date);
				break;
			case VT_BSTR:
				sVal = val.bstrVal;
				break;
			case VT_BOOL:
				sVal = (VARIANT_TRUE == val.boolVal) ? "1" : "0";
				break;
			case VT_VARIANT:
				sVal = _T("");
				break;
			case VT_UNKNOWN:
				sVal = _T("");
				
				break;
			case VT_I1:
				sVal.Format("%d", val.cVal);
				break;
			case VT_UI1:
				sVal.Format("%d", val.bVal);
				break;
			case VT_UI2:
				sVal.Format("%d", val.uiVal);
				break;
			case VT_UI4:
				sVal.Format("%d", val.ulVal);
				break;
			case VT_I8:
				sVal.Format("%d", val.llVal);
				break;
			case VT_UI8:
				sVal.Format("%d", val.ullVal);
				break;
			case VT_INT:
				sVal.Format("%d", val.intVal);
				break;
			case VT_UINT:
				sVal.Format("%d", val.uintVal);
				break;
			case VT_DECIMAL:
			case VT_CY:
			case VT_SAFEARRAY:
			case VT_VOID:
			case VT_HRESULT:
			case VT_CARRAY:
			case VT_USERDEFINED:
			case VT_LPSTR:
			case VT_LPWSTR:
			case VT_RECORD:
			case VT_INT_PTR:
			case VT_UINT_PTR:
			case VT_FILETIME:
			case VT_BLOB:
			case VT_STREAM:
			case VT_STORAGE:
			case VT_STREAMED_OBJECT:
			case VT_STORED_OBJECT:
			case VT_BLOB_OBJECT:
			case VT_CF:
			case VT_CLSID:
			case VT_VERSIONED_STREAM:
			case VT_BSTR_BLOB:
				sVal = _T("");
				break;
			}

			return sVal;
		}
	}
	
#endif
