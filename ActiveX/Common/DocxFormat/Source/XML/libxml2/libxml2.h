#pragma once

#pragma comment(lib, "libxml2.lib")

#include "win_build/Config.h"
#include "XML/include/libxml/xmlreader.h"

#include <windows.h>
#include "../Utils.h"

namespace XmlUtils
{
	namespace NSFile
	{
		class CFile 
		{
		public:
			CFile() 
			{
				m_hFileHandle = NULL;
				m_lFileSize = 0;
				m_lFilePosition = 0;
			}

			virtual ~CFile()
			{
				CloseFile();
			}

			virtual HRESULT OpenFile(CString FileName)
			{	
				CloseFile();

				HRESULT hRes = S_OK;
				DWORD AccessMode = GENERIC_READ;
				DWORD ShareMode = FILE_SHARE_READ;
				DWORD Disposition = OPEN_EXISTING;
				m_hFileHandle = ::CreateFile(FileName, AccessMode, ShareMode, NULL, Disposition, FILE_ATTRIBUTE_NORMAL, NULL);

				if (NULL == m_hFileHandle || INVALID_HANDLE_VALUE == m_hFileHandle)
					hRes = S_FALSE;
				else 
				{
					ULARGE_INTEGER nTempSize;
					nTempSize.LowPart = ::GetFileSize(m_hFileHandle, &nTempSize.HighPart);
					m_lFileSize = nTempSize.QuadPart;

					SetPosition(0);
				}

				return hRes;
			}

			virtual HRESULT OpenFileRW(CString FileName)
			{	
				CloseFile();

				HRESULT hRes = S_OK;
				DWORD AccessMode = GENERIC_READ | GENERIC_WRITE;
				DWORD ShareMode = FILE_SHARE_READ;
				DWORD Disposition = OPEN_EXISTING;
				m_hFileHandle = ::CreateFile(FileName, AccessMode, ShareMode, NULL, Disposition, 0, 0);

				if (NULL == m_hFileHandle || INVALID_HANDLE_VALUE == m_hFileHandle)
				{
					hRes = S_FALSE;
				}
				else 
				{
					ULARGE_INTEGER nTempSize;
					nTempSize.LowPart = ::GetFileSize(m_hFileHandle, &nTempSize.HighPart);
					m_lFileSize = nTempSize.QuadPart;

					SetPosition(0);
				}

				return hRes;
			}

			HRESULT ReadFile(BYTE* pData, DWORD nBytesToRead)
			{
				DWORD nBytesRead = 0;
				if(NULL == pData)
					return S_FALSE;

				if(m_hFileHandle && (pData))
				{	
					SetPosition(m_lFilePosition);
					::ReadFile(m_hFileHandle, pData, nBytesToRead, &nBytesRead, NULL);
					m_lFilePosition += nBytesRead; 
				}
				return S_OK;
			}

			HRESULT ReadFile2(BYTE* pData, DWORD nBytesToRead)
			{
				DWORD nBytesRead = 0;
				if(NULL == pData)
					return S_FALSE;

				if(m_hFileHandle && (pData))
				{	
					SetPosition(m_lFilePosition);
					::ReadFile(m_hFileHandle, pData, nBytesToRead, &nBytesRead, NULL);
					m_lFilePosition += nBytesRead; 

					for (size_t index = 0; index < nBytesToRead / 2; ++index)
					{
						BYTE temp = pData[index];
						pData[index] = pData[nBytesToRead - index - 1];
						pData[nBytesToRead - index - 1] = temp;
					}
				}
				return S_OK;
			}
			HRESULT ReadFile3(void* pData, DWORD nBytesToRead)
			{
				DWORD nBytesRead = 0;
				if(NULL == pData)
					return S_FALSE;

				if(m_hFileHandle && (pData))
				{	
					SetPosition(m_lFilePosition);
					::ReadFile(m_hFileHandle, pData, nBytesToRead, &nBytesRead, NULL);
					m_lFilePosition += nBytesRead; 
				}
				return S_OK;
			}

			HRESULT WriteFile(void* pData, DWORD nBytesToWrite)
			{
				if(m_hFileHandle)
				{	
					DWORD dwWritten = 0;
					::WriteFile(m_hFileHandle, pData, nBytesToWrite, &dwWritten, NULL);
					m_lFilePosition += nBytesToWrite; 
				}
				return S_OK;
			}

			HRESULT WriteFile2(void* pData, DWORD nBytesToWrite)
			{
				if(m_hFileHandle)
				{	
					BYTE* mem = new BYTE[nBytesToWrite];
					memcpy(mem, pData, nBytesToWrite);
					
					for (size_t index = 0; index < nBytesToWrite / 2; ++index)
					{
						BYTE temp = mem[index];
						mem[index] = mem[nBytesToWrite - index - 1];
						mem[nBytesToWrite - index - 1] = temp;
					}
					
					DWORD dwWritten = 0;
					::WriteFile(m_hFileHandle, (void*)mem, nBytesToWrite, &dwWritten, NULL);
					m_lFilePosition += nBytesToWrite; 
					RELEASEARRAYOBJECTS(mem);
				}
				return S_OK;
			}

			HRESULT CreateFile(CString strFileName)
			{
				CloseFile();
				DWORD AccessMode = GENERIC_WRITE;
				DWORD ShareMode = FILE_SHARE_WRITE;
				DWORD Disposition = CREATE_ALWAYS;
				m_hFileHandle = ::CreateFile(strFileName, AccessMode, ShareMode, NULL, Disposition, FILE_ATTRIBUTE_NORMAL, NULL);
				return SetPosition(0);
			}
			HRESULT SetPosition( ULONG64 nPos )
			{	
				if (m_hFileHandle && nPos < (ULONG)m_lFileSize)
				{
					LARGE_INTEGER nTempPos;
					nTempPos.QuadPart = nPos;
					::SetFilePointer(m_hFileHandle, nTempPos.LowPart, &nTempPos.HighPart, FILE_BEGIN);
					m_lFilePosition = nPos;
					return S_OK;
				}
				else 
				{
					return (INVALID_HANDLE_VALUE == m_hFileHandle) ? S_FALSE : S_OK;
				}
			}
			LONG64  GetPosition()
			{
				return m_lFilePosition;
			}
			HRESULT SkipBytes(ULONG64 nCount)
			{
				return SetPosition(m_lFilePosition + nCount);
			}

			HRESULT CloseFile()
			{
				m_lFileSize = 0;
				m_lFilePosition = 0;
				RELEASEHANDLE(m_hFileHandle);
				return S_OK;
			}

			ULONG64 GetFileSize()
			{
				return m_lFileSize;
			}

			HRESULT WriteReserved(DWORD dwCount)
			{
				BYTE* buf = new BYTE[dwCount];
				memset(buf, 0, (size_t)dwCount);
				HRESULT hr = WriteFile(buf, dwCount);
				RELEASEARRAYOBJECTS(buf);
				return hr;
			}
			HRESULT WriteReserved2(DWORD dwCount)
			{
				BYTE* buf = new BYTE[dwCount];
				memset(buf, 0xFF, (size_t)dwCount);
				HRESULT hr = WriteFile(buf, dwCount);
				RELEASEARRAYOBJECTS(buf);
				return hr;
			}
			HRESULT WriteReservedTo(DWORD dwPoint)
			{
				if (m_lFilePosition >= dwPoint)
					return S_OK;

				DWORD dwCount = dwPoint - (DWORD)m_lFilePosition;
				BYTE* buf = new BYTE[dwCount];
				memset(buf, 0, (size_t)dwCount);
				HRESULT hr = WriteFile(buf, dwCount);
				RELEASEARRAYOBJECTS(buf);
				return hr;
			}
			HRESULT SkipReservedTo(DWORD dwPoint)
			{
				if (m_lFilePosition >= dwPoint)
					return S_OK;

				DWORD dwCount = dwPoint - (DWORD)m_lFilePosition;
				return SkipBytes(dwCount);
			}

			LONG GetProgress()
			{
				if (0 >= m_lFileSize)
					return -1;

				double dVal = (double)(100 * m_lFilePosition);
				LONG lProgress = (LONG)(dVal / m_lFileSize);
				return lProgress;
			}

			void WriteStringUTF8(CString& strXml)
			{
				int nLength = strXml.GetLength();

				CStringA saStr;
				
		#ifdef UNICODE
				// Encoding Unicode to UTF-8
				WideCharToMultiByte(CP_UTF8, 0, strXml.GetBuffer(), nLength + 1, saStr.GetBuffer(nLength*3 + 1), nLength*3, NULL, NULL);
				saStr.ReleaseBuffer();    
		#else
				wchar_t* pWStr = new wchar_t[nLength + 1];
				if (!pWStr)
					return;

				// set end string
				pWStr[nLength] = 0;

				// Encoding ASCII to Unicode
				MultiByteToWideChar(CP_ACP, 0, strXml, nLength, pWStr, nLength);

				int nLengthW = (int)wcslen(pWStr);

				// Encoding Unicode to UTF-8
				WideCharToMultiByte(CP_UTF8, 0, pWStr, nLengthW + 1, saStr.GetBuffer(nLengthW*3 + 1), nLengthW*3, NULL, NULL);
				saStr.ReleaseBuffer();

				delete[] pWStr;
		#endif
				
				WriteFile((void*)saStr.GetBuffer(), saStr.GetLength());
			}

		protected:
			HANDLE m_hFileHandle;		
			LONG64 m_lFileSize;
			LONG64 m_lFilePosition;
		};
	}

		
	typedef 
	enum XmlNodeType
	{	
		XmlNodeType_None					= 0,
		XmlNodeType_Element					= 1,
		XmlNodeType_Attribute				= 2,
		XmlNodeType_Text					= 3,
		XmlNodeType_CDATA					= 4,
		XmlNodeType_ENTITY_REFERENCE		= 5,
		XmlNodeType_ENTITY					= 6,
		XmlNodeType_ProcessingInstruction	= 7,
		XmlNodeType_Comment					= 8,
		XmlNodeType_Document				= 9,
		XmlNodeType_DocumentType			= 10,
		XmlNodeType_DOCUMENT_FRAGMENT		= 11,
		XmlNodeType_NOTATION				= 12,
		XmlNodeType_Whitespace				= 13,
		XmlNodeType_SIGNIFICANT_WHITESPACE	= 14,
		XmlNodeType_EndElement				= 15,
		XmlNodeType_TYPE_END_ENTITY			= 16,
		XmlNodeType_XmlDeclaration			= 17,
		_XmlNodeType_Last					= 17
    } XmlNodeType;

	class CXmlLiteReader
	{
		xmlTextReaderPtr	reader;
		
		BYTE*				m_pStream;
		LONG				m_lStreamLen;
	public:

		CXmlLiteReader()
		{			
			reader = NULL;
			m_pStream = NULL;
		}
		~CXmlLiteReader()
		{
			if (NULL != m_pStream)
				delete []m_pStream;
		}

	public:

		inline void Clear()
		{
		}

		inline BOOL IsValid()
		{
			return ( NULL != reader );
		}

		inline BOOL FromFile(CString& sFilePath)
		{
			Clear();

			NSFile::CFile oFile;
			oFile.OpenFile(sFilePath);
			m_lStreamLen = (int)oFile.GetFileSize();
			m_pStream = new BYTE[m_lStreamLen];
			oFile.ReadFile(m_pStream, (DWORD)m_lStreamLen);
			oFile.CloseFile();

			reader = xmlReaderForMemory((char*)m_pStream, m_lStreamLen, NULL, NULL, 0);

			return TRUE;
		}
		inline BOOL FromString(CString& sXml)
		{
			Clear();
			UnicodeToUtf8(sXml, m_pStream, m_lStreamLen);

			reader = xmlReaderForMemory((char*)m_pStream, m_lStreamLen, NULL, NULL, 0);

			return TRUE;
		}
		inline BOOL Read(XmlNodeType &oNodeType)
		{
			if ( !IsValid() )
				return FALSE;

			if ( 0 == xmlTextReaderRead(reader) )
				return FALSE;

			oNodeType = (XmlNodeType)xmlTextReaderNodeType(reader);

			return TRUE;
		}
		inline BOOL ReadNextNode()
		{
			if ( !IsValid() )
				return FALSE;

			XmlNodeType oNodeType = XmlNodeType_None;
			
			while ( XmlNodeType_Element != oNodeType )
			{
				if (!xmlTextReaderRead(reader))
					break;

				oNodeType = (XmlNodeType)xmlTextReaderNodeType(reader);
			}

			if ( XmlNodeType_Element == oNodeType )
				return TRUE;

			return FALSE;
		}
		inline BOOL ReadNextSiblingNode(int nDepth)
		{
			// Перед использованием этой функции надо проверить,
			// пустая ли родительская нода. 
			if ( !IsValid() )
				return FALSE;

			XmlNodeType eNodeType = XmlNodeType_None;
			int nCurDepth = -1;
			
			while ( xmlTextReaderRead(reader) )
			{
				eNodeType = (XmlNodeType)xmlTextReaderNodeType(reader);
				nCurDepth = xmlTextReaderDepth(reader);

				if (nCurDepth <= nDepth)
					break;

				if ( XmlNodeType_Element == eNodeType && nCurDepth == nDepth + 1 )
					return TRUE;
				else if ( XmlNodeType_EndElement == eNodeType && nCurDepth == nDepth + 1 )
					return FALSE;
			}

			return FALSE;
		}
		inline BOOL ReadTillEnd(int nDepth = -2)
		{
			if ( !IsValid() )
				return FALSE;

			if ( -2 == nDepth )
				nDepth = GetDepth();
			else if ( nDepth == GetDepth() && xmlTextReaderIsEmptyElement(reader) )
				return TRUE;

			XmlNodeType eNodeType = XmlNodeType_None;

			int nCurDepth = -1;
			// У закрывающего тэга глубина на 1 больше, чем у открывающего
			while( TRUE )
			{
				if ( 0 == xmlTextReaderRead(reader) )
					break;

				eNodeType = (XmlNodeType)xmlTextReaderNodeType(reader);

				nCurDepth = GetDepth();
				if ( nCurDepth <= nDepth )
					break;
				
				if ( XmlNodeType_EndElement == eNodeType && nCurDepth == nDepth + 1 )
					break;
			}

			return TRUE;
		}
		inline const wchar_t* GetName()
		{
			if ( !IsValid() )
				return NULL;

			xmlChar* pName = xmlTextReaderName(reader);
			return UnicodeFromUtf8(pName);
		}
		inline int GetDepth()
		{
			if ( !IsValid() )
				return -1;

			return xmlTextReaderDepth(reader);
		}
		inline BOOL IsEmptyNode()
		{
			if ( !IsValid() )
				return FALSE;

			return xmlTextReaderIsEmptyElement(reader);
		}

		inline const WCHAR *GetText()
		{
			if ( !IsValid() )
				return NULL;

			xmlChar* pValue = xmlTextReaderValue(reader);
			return UnicodeFromUtf8(pValue);
		}
		inline CString GetText2()
		{
			if ( !IsValid() )
				return _T("");

			// TO DO: Ускорить (убрать CString)
			CString sResult;

			if ( xmlTextReaderIsEmptyElement(reader) )
				return sResult;

			int nDepth = GetDepth();
			XmlNodeType eNodeType = XmlNodeType_EndElement;
			while ( Read( eNodeType ) && GetDepth() >= nDepth && XmlNodeType_EndElement != eNodeType )
			{
				if ( eNodeType == XmlNodeType_Text || eNodeType == XmlNodeType_Whitespace || eNodeType == XmlNodeType_SIGNIFICANT_WHITESPACE )
					sResult += GetText();
			}

			return sResult;
		}
		inline CString GetOuterXml()
		{
			return GetXml(false);
		}
		inline CString GetInnerXml()
		{
			return GetXml(true);
		}
		inline int  GetAttributesCount()
		{
			if ( !IsValid() )
				return -1;

			return xmlTextReaderAttributeCount(reader);
		}
		inline BOOL MoveToFirstAttribute()
		{
			if ( !IsValid() )
				return FALSE;

			return (BOOL)xmlTextReaderMoveToFirstAttribute(reader);
		}
		inline BOOL MoveToNextAttribute()
		{
			if ( !IsValid() )
				return FALSE;

			return (BOOL)xmlTextReaderMoveToNextAttribute(reader);;
		}

		inline BOOL MoveToElement()
		{
			if ( !IsValid() )
				return FALSE;

			return (BOOL)xmlTextReaderMoveToElement(reader);
		}
	private:
		inline CString GetXml(bool bInner)
		{
			if ( !IsValid() )
				return _T("");

			CStringWriter oResult;
			if(false == bInner)
				WriteElement(oResult);

			int nDepth = GetDepth();
			if ( 0 == xmlTextReaderIsEmptyElement(reader) )
			{
				XmlNodeType eNodeType = XmlNodeType_None;

				int nCurDepth = -1;
				// У закрывающего тэга глубина на 1 больше, чем у открывающего
				while( TRUE )
				{
					if ( 0 == xmlTextReaderRead(reader) )
						break;

					eNodeType = (XmlNodeType)xmlTextReaderNodeType(reader);

					nCurDepth = GetDepth();
					if ( eNodeType == XmlNodeType_Text || eNodeType == XmlNodeType_Whitespace )
						oResult.WriteEncodeXmlString(GetText());
					else if(eNodeType == XmlNodeType_Element)
						WriteElement(oResult);
					else if(eNodeType == XmlNodeType_EndElement)
					{
						if(false == bInner || nCurDepth != nDepth + 1)
						{
							oResult.AddChar2Safe(TCHAR('<'), TCHAR('/'));
							oResult.WriteEncodeXmlString(GetName());
							oResult.AddCharSafe(TCHAR('>'));
						}
					}

					nCurDepth = GetDepth();
					if ( nCurDepth <= nDepth )
						break;

					if ( XmlNodeType_EndElement == eNodeType && nCurDepth == nDepth )
						break;
				}
			}

			return oResult.GetData();
		}
		void WriteElement(CStringWriter& oResult)
		{
			oResult.AddCharSafe((TCHAR)'<');
			oResult.WriteEncodeXmlString(GetName());
			if(GetAttributesCount() > 0)
			{
				MoveToFirstAttribute();
				CString sName = GetName();
				while( !sName.IsEmpty() )
				{
					oResult.AddCharSafe(TCHAR(' '));
					oResult.WriteEncodeXmlString(GetName());
					oResult.AddChar2Safe(TCHAR('='), TCHAR('\"'));
					oResult.WriteEncodeXmlString(GetText());
					oResult.AddCharSafe(TCHAR('\"'));

					if ( !MoveToNextAttribute() )
						break;
					sName = GetName();
				}
				MoveToElement();
			}
			if (IsEmptyNode())
				oResult.AddChar2Safe(TCHAR('/'), TCHAR('>'));
			else
				oResult.AddCharSafe(TCHAR('>'));
		}

		WCHAR* UnicodeFromUtf8(xmlChar* pValue)
		{
			BYTE* pBuffer = (BYTE*)pValue;
			LONG lCount = strlen((char*)pValue);
			LONG lLenght = 0;

			WCHAR* pUnicodeString = new WCHAR[lCount + 1];
			LONG lIndexUnicode = 0;

			for (LONG lIndex = 0; lIndex < lCount; ++lIndex)
			{
				if (0x00 == (0x80 & pBuffer[lIndex]))
				{
					//strRes += (WCHAR)pBuffer[lIndex];
					pUnicodeString[lIndexUnicode++] = (WCHAR)pBuffer[lIndex];
					continue;
				}
				else if (0x00 == (0x20 & pBuffer[lIndex]))
				{
					WCHAR mem = (WCHAR)(((pBuffer[lIndex] & 0x1F) << 6) + (pBuffer[lIndex + 1] & 0x3F));
					
					//strRes += mem;
					pUnicodeString[lIndexUnicode++] = mem;

					lIndex += 1;
				}
				else if (0x00 == (0x10 & pBuffer[lIndex]))
				{
					WCHAR mem = (WCHAR)(((pBuffer[lIndex] & 0x0F) << 12) + ((pBuffer[lIndex + 1] & 0x3F) << 6) + (pBuffer[lIndex + 2] & 0x3F));
					
					//strRes += mem;
					pUnicodeString[lIndexUnicode++] = mem;

					lIndex += 2;
				}
				else
				{
					BYTE mem = pBuffer[lIndex];
					//pUnicodeString[lIndexUnicode++] = mem;
				}
			}

			pUnicodeString[lIndexUnicode] = 0;
			return pUnicodeString;
		}

		void UnicodeToUtf8(CString& strXml, BYTE*& pBuffer, LONG& lLen)
		{
			int nLength = strXml.GetLength();

			pBuffer = new BYTE[nLength*3 + 1];
			
			// Encoding Unicode to UTF-8
			WideCharToMultiByte(CP_UTF8, 0, strXml.GetBuffer(), nLength + 1, (LPSTR)pBuffer, nLength*3, NULL, NULL);
			lLen = strlen((LPSTR)pBuffer);
		}
	};


}