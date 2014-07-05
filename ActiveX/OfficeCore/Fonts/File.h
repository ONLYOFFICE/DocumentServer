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
#include "windows.h"

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
			delete[] mem;
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
		CloseHandle(m_hFileHandle);
		m_hFileHandle = NULL;
		return S_OK;
	}

	ULONG64 GetFileSize()
	{
		return m_lFileSize;
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

	LONG GetProgress()
	{
		if (0 >= m_lFileSize)
			return -1;

		double dVal = (double)(100 * m_lFilePosition);
		LONG lProgress = (LONG)(dVal / m_lFileSize);
		return lProgress;
	}

protected:
	HANDLE m_hFileHandle;		
	LONG64 m_lFileSize;
	LONG64 m_lFilePosition;
};