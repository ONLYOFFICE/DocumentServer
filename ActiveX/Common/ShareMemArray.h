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
#pragma warning( disable : 4996 4244)	

#include <atlcoll.h>
#include "ASCUtils.h"	

#define AVS_USER_NAME_LEN 1024


enum TSMAStatus {SMAS_ERROR, SMAS_ALREADYEXISTS, SMAS_NEW};


template <typename STOR_TYPE>
class CShareMemArray
{
protected:
	HANDLE		m_hAccessMutex;		
	HANDLE		m_hMapFile;			
	STOR_TYPE	*m_pArray;			
	LONG64		m_nSize;			
	CString		m_sMutexName;		
	CString		m_sMapName;			
	TSMAStatus	m_sStatus;

protected:
	
	bool ReadFromSharedMem(LONG64 nIndex, STOR_TYPE &nValue)
	{
		if (NULL == m_pArray)
		{
			m_sStatus = SMAS_ERROR;
			return false;
		}

		__try
		{
			STOR_TYPE *pTable = (STOR_TYPE *) (((BYTE *) m_pArray) + sizeof(LONG64));	
			nValue = pTable[nIndex];
		}
		__except(EXCEPTION_IN_PAGE_ERROR == GetExceptionCode() ? EXCEPTION_EXECUTE_HANDLER : EXCEPTION_CONTINUE_SEARCH)
		{
			
			ATLTRACE2("CIndexerStorage::ReadFromSharedMem()\n");
			return false;
		}
		return true;
	}

	
	bool WriteToSharedMem(LONG64 nIndex, STOR_TYPE aValue)
	{
		if (NULL == m_pArray)
		{
			m_sStatus = SMAS_ERROR;
			return false;
		}

		__try
		{
			STOR_TYPE *pTable = (STOR_TYPE *) (((BYTE *) m_pArray) + sizeof(LONG64));	
			pTable[nIndex] = aValue;
		}
		__except(EXCEPTION_IN_PAGE_ERROR == GetExceptionCode() ? EXCEPTION_EXECUTE_HANDLER : EXCEPTION_CONTINUE_SEARCH)
		{
			
			ATLTRACE2("Error CIndexerStorage::WriteToSharedMem(#i)\n", nIndex);
			return false;
		}
		return true;
	}

	
	bool SaveTable_unsync(CAtlArray<STOR_TYPE> &aTable)
	{
		if ((NULL == m_pArray) || (NULL == m_hMapFile)) 
		{
			m_sStatus = SMAS_ERROR;
			return false;	
		}
	
		bool bRes = true;

		
		LONG64 nCopyCount = (m_nSize <= (LONG64) aTable.GetCount()) ? m_nSize : aTable.GetCount();
		
		
		Size_unsync(m_nSize);

		
		for (LONG64 nIndex = 0; nIndex < nCopyCount; nIndex++)
		{
			bRes &= WriteToSharedMem (nIndex, aTable[nIndex]);
		}

		return bRes;
	}

	
	bool LoadTable_unsync(CAtlArray<STOR_TYPE> &aTable)
	{
		if ((NULL == m_pArray) || (NULL == m_hMapFile)) 
		{
			m_sStatus = SMAS_ERROR;
			return false;	
		}
	
		aTable.RemoveAll();
		
		
		m_nSize = Size_unsync();

		STOR_TYPE nValue;

		
		for (DWORD nIndex = 0; nIndex < m_nSize; nIndex++)
		{	
			if (ReadFromSharedMem(nIndex, nValue))
			{
				
				aTable.Add(nValue);
			}
		}
		return true;
	}

	
	LONG64 Size_unsync()
	{
		LONG64 nValue = -1;

		if (NULL == m_pArray)
		{
			m_sStatus = SMAS_ERROR;
			return nValue;
		}

		__try
		{
			LONG64 *pSize = (LONG64 *) m_pArray;
			nValue = *pSize;
		}
		__except(EXCEPTION_IN_PAGE_ERROR == GetExceptionCode() ? EXCEPTION_EXECUTE_HANDLER : EXCEPTION_CONTINUE_SEARCH)
		{
			
			ATLTRACE2("CIndexerStorage::Size_unsync()\n");
			return -1;
		}
		return nValue;
	}

	void Size_unsync(LONG64 aSize)
	{
		if (NULL == m_pArray)
		{
			m_sStatus = SMAS_ERROR;
			return;
		}

		__try
		{
			LONG64 *pSize = (LONG64*) m_pArray;	
			*pSize = aSize;
		}
		__except(EXCEPTION_IN_PAGE_ERROR == GetExceptionCode() ? EXCEPTION_EXECUTE_HANDLER : EXCEPTION_CONTINUE_SEARCH)
		{
			
			ATLTRACE2("Error CIndexerStorage::Size_unsync(LONG64 aSize)\n");
		}
	}

public:
	
	
	CShareMemArray(CString &aFileName, LONG64 aSize, DWORD aId = ISID_DEFAULT):
	  m_hMapFile(NULL), m_nSize(aSize), m_pArray(NULL), m_sStatus(SMAS_ERROR)
	{
		
		TCHAR aDrive[_MAX_DRIVE];
		TCHAR aDir[_MAX_DIR];
		TCHAR aFName[_MAX_FNAME];
		TCHAR aExt[_MAX_EXT];

		_tsplitpath (aFileName.GetBuffer(), aDrive, aDir, aFName, aExt);
		

		
		DWORD dwPathID = 0;
		TCHAR tcPathIDItem = 0;

		
		for (int i = 0; i < (int) _tcslen(aDir); i++) 
		{
			tcPathIDItem ^= aDir[i];
			dwPathID ^= dwPathID << 1;
			dwPathID += (DWORD) tcPathIDItem;
		}

		
		DWORD dwExtID = 0;
		TCHAR tcExtIDItem = 0;		
		for (int i = 0; i < (int) _tcslen(aExt); i++) 
		{
			tcExtIDItem ^= aExt[i];
			 dwExtID ^=  dwExtID << 1;
			 dwExtID += (DWORD) tcExtIDItem;
		}
		
		
		
		
		
		
		m_sMutexName.Format(_T("Local\\avs_mutex%u_%s_%06x_%06I64x_%06x"), aId, aFName, dwPathID, aSize, dwExtID);
		m_sMapName.Format(_T("Local\\avs_storage%u_%s_%06x_%06I64x_%06x"), aId, aFName, dwPathID, aSize, dwExtID);

		
		TCHAR pBufferUserName[AVS_USER_NAME_LEN];
		DWORD dwBufferUserNameLen = AVS_USER_NAME_LEN;
		GetUserName(pBufferUserName, &dwBufferUserNameLen);
		
		CString strUserName(pBufferUserName, dwBufferUserNameLen);
		m_sMutexName	+= strUserName;
		m_sMapName		+= strUserName;

		
		m_hAccessMutex = CreateMutex(NULL, FALSE, m_sMutexName.GetBuffer());

		
		CSynchAccess oAccess = m_hAccessMutex;
		
		
		ATLTRACE2("CShareMemArray()::CShareMemArray(): m_nSize = %d\n", m_nSize);

		ULARGE_INTEGER nMappingSize;
		nMappingSize.QuadPart = m_nSize * sizeof(STOR_TYPE) + sizeof(LONG64);

		m_hMapFile = CreateFileMapping(INVALID_HANDLE_VALUE, NULL, PAGE_READWRITE, nMappingSize.HighPart, nMappingSize.LowPart, m_sMapName.GetBuffer());
		if (NULL == m_hMapFile)
		{
			
			ATLTRACE2("CShareMemArray::CShareMemArray():CreateFileMapping() FAILS (0x%x)!\n", GetLastError());
			m_sStatus = SMAS_ERROR;
		}
		else 
		{
			
			m_sStatus = (GetLastError() == ERROR_ALREADY_EXISTS) ? SMAS_ALREADYEXISTS : SMAS_NEW;
			ATLTRACE2 (SMAS_ALREADYEXISTS == m_sStatus ? "CShareMemArray: open existing!\n" : "CShareMemArray: create new!\n");

			
			m_pArray = (STOR_TYPE *) MapViewOfFile(m_hMapFile, FILE_MAP_ALL_ACCESS, 0, 0, (SIZE_T) nMappingSize.QuadPart);
			if (NULL == m_pArray)
			{
				
				ATLTRACE2("CShareMemArray::CShareMemArray():MapViewOfFile() FAILS (0x%x)!\n", GetLastError());
				m_sStatus = SMAS_ERROR;
			}
		}
	}
	
	virtual ~CShareMemArray()
	{
		if (m_pArray) UnmapViewOfFile(m_pArray);			
		if (NULL != m_hMapFile) CloseHandle(m_hMapFile);	
		if (NULL != m_hAccessMutex) CloseHandle(m_hAccessMutex);	
	}

public:
	
	
	bool Save(CAtlArray<STOR_TYPE> &aTable)
	{
		CSynchAccess oAccess = m_hAccessMutex;
		return SaveTable_unsync(aTable);
	}

	
	bool Load(CAtlArray<STOR_TYPE> &aTable)
	{
		CSynchAccess oAccess = m_hAccessMutex;
		return LoadTable_unsync(aTable);
	}

	
	LONG64 Size()
	{
		CSynchAccess oAccess = m_hAccessMutex;
		return Size_unsync();
	}

	

	
	TSMAStatus Status(void) const 
	{
		CSynchAccess oAccess = m_hAccessMutex;
		return m_sStatus;
	}
};

