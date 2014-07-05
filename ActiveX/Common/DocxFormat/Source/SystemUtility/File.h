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

#include "../XML/XmlUtils.h"

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
	HRESULT OpenOrCreate(CString strFileName)
	{
		CloseFile();

		HRESULT hRes = S_OK;
		DWORD AccessMode =  GENERIC_READ | GENERIC_WRITE;
		DWORD ShareMode = FILE_SHARE_WRITE;
		DWORD Disposition = OPEN_ALWAYS;
		m_hFileHandle = ::CreateFile(strFileName, AccessMode, ShareMode, NULL, Disposition, FILE_ATTRIBUTE_NORMAL, NULL);

		if (NULL == m_hFileHandle || INVALID_HANDLE_VALUE == m_hFileHandle)
			hRes = S_FALSE;
		else 
		{
			ULARGE_INTEGER nTempSize;
			nTempSize.LowPart = ::GetFileSize(m_hFileHandle, &nTempSize.HighPart);
			m_lFileSize = nTempSize.QuadPart;

			SetPosition(m_lFileSize);
		}

		return hRes;
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
		if (m_hFileHandle && nPos <= (ULONG)m_lFileSize)
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
		
		WideCharToMultiByte(CP_UTF8, 0, strXml.GetBuffer(), nLength + 1, saStr.GetBuffer(nLength*3 + 1), nLength*3, NULL, NULL);
		saStr.ReleaseBuffer();    
#else
		wchar_t* pWStr = new wchar_t[nLength + 1];
		if (!pWStr)
			return;

		
		pWStr[nLength] = 0;

		
        MultiByteToWideChar(CP_ACP, 0, strXml, nLength, pWStr, nLength);

        int nLengthW = (int)wcslen(pWStr);

		
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

namespace CDirectory
{
	static CString GetFolderName(CString strFolderPath)
	{
		int n1 = strFolderPath.ReverseFind('\\');
		if (-1 == n1)
			return _T("");

		return strFolderPath.Mid(n1 + 1);
	}
	static CString GetFolderPath(CString strFolderPath)
	{
		int n1 = strFolderPath.ReverseFind('\\');
		if (-1 == n1)
			return _T("");

		return strFolderPath.Mid(0, n1);
	}
	static BOOL OpenFile(CString strFolderPath, CString strFileName, CFile* pFile)
	{
		CString strFile = strFolderPath + '\\' + strFileName;
		return (S_OK == pFile->OpenFile(strFile));
	}
	static BOOL CreateFile(CString strFolderPath, CString strFileName, CFile* pFile)
	{
		CString strFile = strFolderPath + '\\' + strFileName;
		return (S_OK == pFile->CreateFile(strFile));
	}
	static BOOL CreateDirectory(CString strFolderPathRoot, CString strFolderName)
	{
		CString strFolder = strFolderPathRoot + '\\' + strFolderName;
		return ::CreateDirectory(strFolder, NULL);
	}
	static BOOL CreateDirectory(CString strFolderPath)
	{
		return ::CreateDirectory(strFolderPath, NULL);
	}

	static BOOL MoveFile(CString strExists, CString strNew, LPPROGRESS_ROUTINE lpFunc, LPVOID lpData) 
	{
#if (_WIN32_WINNT >= 0x0500)
		return ::MoveFileWithProgress(strExists, strNew, lpFunc, lpData, MOVEFILE_REPLACE_EXISTING | MOVEFILE_WRITE_THROUGH); 
#else
		return ::MoveFileEx(strExists, strNew, MOVEFILE_REPLACE_EXISTING | MOVEFILE_WRITE_THROUGH); 
#endif
	}

	static BOOL CopyFile(CString strExists, CString strNew, LPPROGRESS_ROUTINE lpFunc, LPVOID lpData) 
	{
		DeleteFile(strNew);
		return ::CopyFileEx(strExists, strNew, lpFunc, lpData, FALSE, 0); 
	}

	static CString GetUnder(CString strFolderPathRoot, CString strFolderName)
	{
		CString strFolder = strFolderPathRoot + '\\' + strFolderName;
		return strFolder;
	}

	static CString GetFileName(CString strFullName)
	{
		int nStart = strFullName.ReverseFind('\\');
		CString strName = strFullName.Mid(nStart + 1);
		return strName;
	}

	static CString BYTEArrayToString(BYTE* arr, size_t nCount)
	{
		CString str;
		for (size_t index = 0; index < nCount; ++index)
		{
			if ('\0' != (char)(arr[index]))
				str += (char)(arr[index]);
		}
		if (str.GetLength() == 0)
			str = _T("0");
		return str;
	}

	static CStringW BYTEArrayToStringW(BYTE* arr, size_t nCount)
	{
		CStringW str;
		wchar_t* pArr = (wchar_t*)arr;
		size_t nCountNew = nCount / 2;
		for (size_t index = 0; index < nCountNew; ++index)
		{
			str += pArr[index];
		}
		if (str.GetLength() == 0)
			str = _T("0");
		return str;
	}

	static CString BYTEArrayToString2(USHORT* arr, size_t nCount)
	{
		CString str;
		for (size_t index = 0; index < nCount; ++index)
		{
			if ('\0' != (char)(arr[index]))
				str += (char)(arr[index]);
		}
		if (str.GetLength() == 0)
			str = _T("0");
		return str;
	}

	static CString ToString(DWORD val)
	{
		CString str = _T("");
		str.Format(_T("%d"), (LONG)val);
		return str;
	}

	static CString ToString(UINT64 val, bool bInit)
	{
		CString strCoarse = ToString((DWORD)(val >> 32));
		if (_T("0") != strCoarse)
		{
			return strCoarse + ToString((DWORD)val);
		}
		
		return ToString((DWORD)val);
	}

	static UINT64 GetUINT64(CString strVal)
	{
		UINT64 nRet = 0;
		int nLen = strVal.GetLength();
		while (nLen > 0)
		{
			int nDig = XmlUtils::GetDigit(strVal[0]);
			nRet *= 10;
			nRet += nDig;
			strVal.Delete(0);
			--nLen;
		}
		return nRet;
	}
	static UINT GetUINT(CString strVal)
	{
		return (UINT)GetUINT64(strVal);
	}

	static void WriteValueToNode(CString strName, DWORD value, XmlUtils::CXmlWriter* pWriter)
	{
		pWriter->WriteNodeBegin(strName);
		pWriter->WriteString(CDirectory::ToString(value));
		pWriter->WriteNodeEnd(strName);
	}
	static void WriteValueToNode(CString strName, LONG value, XmlUtils::CXmlWriter* pWriter)
	{
		pWriter->WriteNodeBegin(strName);
		CString strLONG = _T("");
		strLONG.Format(_T("%d"), value);
		pWriter->WriteString(strLONG);
		pWriter->WriteNodeEnd(strName);
	}
	static void WriteValueToNode(CString strName, CString value, XmlUtils::CXmlWriter* pWriter)
	{
		pWriter->WriteNodeBegin(strName);
		pWriter->WriteString(value);
		pWriter->WriteNodeEnd(strName);
	}
	static void WriteValueToNode(CString strName, WCHAR value, XmlUtils::CXmlWriter* pWriter)
	{
		CString str(value);

		pWriter->WriteNodeBegin(strName);
		pWriter->WriteString(str);
		pWriter->WriteNodeEnd(strName);
	}
	static void WriteValueToNode(CString strName, bool value, XmlUtils::CXmlWriter* pWriter)
	{
		pWriter->WriteNodeBegin(strName);
		CString str = (true == value) ? _T("1") : _T("0");
		pWriter->WriteString(str);
		pWriter->WriteNodeEnd(strName);
	}
	static double FixedPointToDouble(DWORD point)
	{
		double dVal = (double)(point % 65536) / 65536;
		dVal += (point / 65536);
		return dVal;
	}
	static LONG NormFixedPoint(DWORD point, LONG base)
	{
		return (LONG)(FixedPointToDouble(point) * base);
	}
	static void SaveToFile(CString strFileName, CString strXml)
	{
        int nLength = strXml.GetLength();

		CStringA saStr;
		
#ifdef UNICODE
		
		WideCharToMultiByte(CP_UTF8, 0, strXml.GetBuffer(), nLength + 1, saStr.GetBuffer(nLength*3 + 1), nLength*3, NULL, NULL);
		saStr.ReleaseBuffer();    
#else
		wchar_t* pWStr = new wchar_t[nLength + 1];
		if (!pWStr)
			return;

		
		pWStr[nLength] = 0;

		
        MultiByteToWideChar(CP_ACP, 0, strXml, nLength, pWStr, nLength);

        int nLengthW = (int)wcslen(pWStr);

		
        WideCharToMultiByte(CP_UTF8, 0, pWStr, nLengthW + 1, saStr.GetBuffer(nLengthW*3 + 1), nLengthW*3, NULL, NULL);
		saStr.ReleaseBuffer();

	    delete[] pWStr;
#endif
		
		CFile oFile;
		oFile.CreateFile(strFileName);
		oFile.WriteFile((void*)saStr.GetBuffer(), saStr.GetLength());
		oFile.CloseFile();
	}

	static void SaveToFile2(CString strFileName, CStringA strVal)
	{
		CFile oFile;
		HRESULT hr = oFile.OpenFileRW(strFileName);

		if (S_OK != hr)
			oFile.CreateFile(strFileName);

		oFile.SkipBytes(oFile.GetFileSize());
		oFile.WriteFile((void*)strVal.GetBuffer(), strVal.GetLength());
		oFile.CloseFile();
	}
}

namespace StreamUtils
{
	static BYTE ReadBYTE(IStream* pStream)
	{
		BYTE lMem = 0;
		ULONG lReadByte = 0;
		pStream->Read(&lMem, 1, &lReadByte);
		if (lReadByte < 1)
		{
			lMem = 0;
		}
		return lMem;
	}
	static WORD ReadWORD(IStream* pStream)
	{
		WORD lWord = 0;
		BYTE pMem[2];
		ULONG lReadByte = 0;
		pStream->Read(pMem, 2, &lReadByte);
		if (lReadByte == 2)
		{
			lWord = ((pMem[1] << 8) | pMem[0]);
		}
		return lWord;
	}
	static DWORD ReadDWORD(IStream* pStream)
	{
		DWORD lDWord = 0;
		BYTE pMem[4];
		ULONG lReadByte = 0;
		pStream->Read(pMem, 4, &lReadByte);
		
#ifdef _DEBUG
		ATLASSERT(4 == lReadByte);
#endif

		if (lReadByte == 4)
		{
			lDWord = ((pMem[3] << 24) | (pMem[2] << 16) | (pMem[1] << 8) | pMem[0]);
		}
		return lDWord;
	}
	static SHORT ReadSHORT(IStream* pStream)
	{
		return (SHORT)ReadWORD(pStream);
	}
	static LONG ReadLONG(IStream* pStream)
	{
		return (LONG)ReadDWORD(pStream);
	}
	
	static FLOAT ReadFLOAT ( IStream* pStream )
	{
		FLOAT Value = 0.0f;
		pStream->Read ( &Value, sizeof (FLOAT), NULL );
		return Value;
	}

	static CString ReadCString(IStream* pStream, LONG lLen)
	{
		char* pData = new char[lLen + 1];
		ULONG lReadByte = 0;
		pStream->Read(pData, lLen, &lReadByte);

		pData[lLen] = 0;

		CString str(pData);

		delete[] pData;
		return str;
	}
	static CStringW ReadCStringW(IStream* pStream, LONG lLen)
	{
		wchar_t* pData = new wchar_t[lLen + 1];
		ULONG lReadByte = 0;
		pStream->Read(pData, 2 * lLen, &lReadByte);

		pData[lLen] = 0;

		CStringW str(pData);
		delete[] pData;
		return str;
	}
	static CString ConvertCStringWToCString(CStringW& strW)
	{
		
		

		BSTR bstr = strW.AllocSysString();
		CString str(bstr);
		SysFreeString(bstr);

		return str;
	}
	static void StreamSeek(long lOffset, IStream* pStream)
	{
		LARGE_INTEGER li; 
		li.LowPart = lOffset; 
		li.HighPart = 0; 
		pStream->Seek(li, STREAM_SEEK_SET, NULL); 
	}
	static void StreamPosition(long& lPosition, IStream* pStream)
	{
		ULARGE_INTEGER uli;
		LARGE_INTEGER li; 
		li.LowPart = 0; 
		li.HighPart = 0; 
		pStream->Seek(li, STREAM_SEEK_CUR, &uli);
		lPosition = (LONG)uli.LowPart;
	}
	static void StreamSkip(long lCount, IStream* pStream)
	{
		LARGE_INTEGER li; 
		li.LowPart = lCount;
		li.HighPart = 0; 
		pStream->Seek(li, STREAM_SEEK_CUR, NULL); 
	}
	static void StreamSkipBack(long lCount, IStream* pStream)
	{
		ULARGE_INTEGER ulPos;
		LARGE_INTEGER li; 
		li.LowPart = 0; 
		li.HighPart = 0; 
		pStream->Seek(li, STREAM_SEEK_CUR, &ulPos); 

		StreamSeek((long)(ulPos.LowPart - lCount), pStream);
	}
}