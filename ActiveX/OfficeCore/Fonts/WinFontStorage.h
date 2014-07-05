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
#include "../../Common/ShareMemArray.h"


#define ISID_DEFAULT                 0x0000 

#define ISID_WIN_FONT_STATUS_STORAGE 0x0001 
#define ISID_WIN_FONT_INFO_STORAGE   0x0002 


#define STORAGE_TABLE_NAME_LEN	1024

#define STATUS_STORAGE_NAME CString( _T("AVS_LOADED_WIN_FONTS") )

namespace NSStrings
{
	static CString ConvertCStringWToCString(CStringW& strW)
	{
		BSTR bstr = strW.AllocSysString();
		CString str(bstr);
		SysFreeString(bstr);

		return str;
	}

	static CStringW GetCStringWFromUTF8( BYTE* pBuffer, LONG64 lCount )
	{
		LONG64 lLenght = 0;
		CStringW strRes = L"";
		for (LONG lIndex = 0; lIndex < lCount; ++lIndex)
		{
			if (0x00 == (0x80 & pBuffer[lIndex]))
			{
				strRes += (WCHAR)pBuffer[lIndex];
				continue;
			}
			else if (0x00 == (0x20 & pBuffer[lIndex]))
			{
				WCHAR mem = (WCHAR)(((pBuffer[lIndex] & 0x1F) << 6) + (pBuffer[lIndex + 1] & 0x3F));
				strRes += mem;

				lIndex += 1;
			}
			else if (0x00 == (0x10 & pBuffer[lIndex]))
			{
				WCHAR mem = (WCHAR)(((pBuffer[lIndex] & 0x0F) << 12) + ((pBuffer[lIndex + 1] & 0x3F) << 6) + (pBuffer[lIndex + 2] & 0x3F));
				strRes += mem;

				lIndex += 2;
			}
		}
		return strRes;
	}
	
	static CString GetCStringFromUTF8( BYTE* pBuffer, LONG64 lCount )
	{
		CStringW strRes = GetCStringWFromUTF8(pBuffer, lCount);
		return ConvertCStringWToCString(strRes);
	}
};






enum WinFontsTableStatus {STIF_ERROR, STIF_AVAILABLE, STIF_CREATING, STIF_BROKEN};

enum StringCoding 
{	
	scASCII		= 0, 
	scUNICODE	= 1, 
	scUTF8		= 2
};



struct WinFontsStatusStorage
{
	
	WinFontsTableStatus	m_sStatus;					
	LONG64              m_lLength;                  

	WinFontsStatusStorage() 
	{
		Reset();
	}

	void Reset()
	{
		
		m_sStatus = STIF_ERROR; 
		m_lLength = 0;
	}
};


struct WinFontsInfoStorage
{
	LONG		m_lCount;
	
	CStringA    m_strXml;
	
	BYTE*		m_pBuffer;
	LONG		m_lCountData;

	WinFontsInfoStorage() 
	{
		Reset();
	}

	~WinFontsInfoStorage()
	{
	}

	void Reset()
	{
		m_lCount			= 0;

		m_strXml			= "";
		m_pBuffer			= NULL;

	}

	void GenerateInfo(BSTR bstrXML)
	{
		m_strXml			= CStringA(bstrXML);

		m_pBuffer			= NULL;
		m_lCountData		= 0;
	}
	void GenerateInfo(BYTE* pBuffer, LONG lCountData)
	{
		m_pBuffer		= pBuffer;
		m_lCountData	= lCountData;
	}

	void Save(BYTE* pBuffer)
	{
		if (NULL == pBuffer)
			return;

		if (0 == m_lCountData)
		{
			memcpy(pBuffer, (BYTE*)m_strXml.GetBuffer(), m_strXml.GetLength());
		}
		else
		{
			memcpy(pBuffer, m_pBuffer, m_lCountData);
		}
	}

	LONG64 GetLength()
	{
		if (0 == m_lCountData)
		{
			return m_strXml.GetLength();
		}
		return m_lCountData;
	}

	void Load(BYTE* pBuffer, LONG64 lLength)
	{
		
		m_lCountData	= (LONG)lLength;

		m_pBuffer = new BYTE[m_lCountData];
		memcpy(m_pBuffer, pBuffer, m_lCountData);
	}
};


class CWinFontsStatusStorage: public CShareMemArray<BYTE>
{
protected:

	bool ReadStruct_unsync(WinFontsStatusStorage *aData)		
	{
		__try
		{
			WinFontsStatusStorage *pTable = (WinFontsStatusStorage *) ( (BYTE *)m_pArray + sizeof(LONG64));	
			memcpy(aData, pTable, sizeof(WinFontsStatusStorage)); 
		}
		__except(EXCEPTION_IN_PAGE_ERROR == GetExceptionCode() ? EXCEPTION_EXECUTE_HANDLER : EXCEPTION_CONTINUE_SEARCH)
		{
			
			
			return false;
		}
		return true;
	}

	bool WriteStruct_unsync(WinFontsStatusStorage *aData)	
	{
		__try
		{
			WinFontsStatusStorage *pTable = (WinFontsStatusStorage *) ( (BYTE *)m_pArray + sizeof(LONG64));	
			memcpy(pTable, aData, sizeof(WinFontsStatusStorage)); 
		}
		__except(EXCEPTION_IN_PAGE_ERROR == GetExceptionCode() ? EXCEPTION_EXECUTE_HANDLER : EXCEPTION_CONTINUE_SEARCH)
		{
			
			
			return false;
		}
		return true;
	}

public:

	bool ReadStruct(WinFontsStatusStorage *aData)
	{
		CSynchAccess oAccess = m_hAccessMutex;
		return ReadStruct_unsync(aData);
	}
	bool WriteStruct(WinFontsStatusStorage *aData)
	{
		CSynchAccess oAccess = m_hAccessMutex;
		return WriteStruct_unsync(aData);
	}

public:

	
	
	bool GetStatus(bool *bForceControl, WinFontsStatusStorage* aIS)
	{
		bool bTryToForceControl = bForceControl && (*bForceControl);

		if (NULL == aIS) return false;

		if (bForceControl) *bForceControl = false;	

		
		CSynchAccess oAccess = m_hAccessMutex;
		
		if (!ReadStruct_unsync(aIS)) return false;	

		if ((STIF_BROKEN == aIS->m_sStatus) || (STIF_ERROR == aIS->m_sStatus))
		{
			
			if (bTryToForceControl)
			{
				
				aIS->Reset();
				aIS->m_sStatus = STIF_CREATING;
				*bForceControl = WriteStruct_unsync(aIS);	
			}
		}

		return true;
	}
	
	bool SetBroken()
	{
		CSynchAccess oAccess = m_hAccessMutex;
		WinFontsStatusStorage sStor;
		sStor.m_sStatus = STIF_BROKEN;
		
		return WriteStruct_unsync(&sStor);
	}

private:
	
	bool Save(CAtlArray<BYTE> &aTable)
	{
		return false;
	}

	bool Load(CAtlArray<BYTE> &aTable)
	{
		return false;
	}


public:
	CWinFontsStatusStorage(CString &aName): CShareMemArray(aName, sizeof(WinFontsStatusStorage), ISID_WIN_FONT_STATUS_STORAGE)
	{
		
		
	};	
	~CWinFontsStatusStorage()
	{
		
	};
};


class CWinFontsInfoStorage: public CShareMemArray<BYTE>
{
protected:

	bool ReadStruct_unsync(WinFontsInfoStorage *aData)		
	{
		__try
		{
			LONG64 lLength = Size();
			aData->Load((BYTE*)m_pArray + sizeof(LONG64), lLength);	
		}
		__except(EXCEPTION_IN_PAGE_ERROR == GetExceptionCode() ? EXCEPTION_EXECUTE_HANDLER : EXCEPTION_CONTINUE_SEARCH)
		{
			
			
			return false;
		}
		return true;
	}

	bool WriteStruct_unsync(WinFontsInfoStorage *aData)	
	{
		__try
		{
			LONG64 *pSize = (LONG64*)m_pArray;	
			*pSize = m_nSize;

			aData->Save((BYTE*)m_pArray + sizeof(LONG64));	
		}
		__except(EXCEPTION_IN_PAGE_ERROR == GetExceptionCode() ? EXCEPTION_EXECUTE_HANDLER : EXCEPTION_CONTINUE_SEARCH)
		{
			
			
			return false;
		}
		return true;
	}

public:

	bool ReadStruct(WinFontsInfoStorage *aData)
	{
		
		return ReadStruct_unsync(aData);
	}
	bool WriteStruct(WinFontsInfoStorage *aData)
	{
		CSynchAccess oAccess = m_hAccessMutex;
		return WriteStruct_unsync(aData);
	}
	bool WriteCount(WinFontsInfoStorage *aData)
	{
		__try
		{
			BYTE* pData = (BYTE*)m_pArray + sizeof(LONG64);
			*((LONG*)pData) = aData->m_lCount;
		}
		__except(EXCEPTION_IN_PAGE_ERROR == GetExceptionCode() ? EXCEPTION_EXECUTE_HANDLER : EXCEPTION_CONTINUE_SEARCH)
		{
			
			
			return false;
		}
		return true;
	}

private:
	
	bool Save(CAtlArray<BYTE> &aTable)
	{
		return false;
	}

	bool Load(CAtlArray<BYTE> &aTable)
	{
		return false;
	}


public:
	CWinFontsInfoStorage(CString &aFileName, LONG64 lSize): CShareMemArray(aFileName, lSize, ISID_WIN_FONT_INFO_STORAGE)
	{
		
	};	
	~CWinFontsInfoStorage()
	{
		
	};
};
