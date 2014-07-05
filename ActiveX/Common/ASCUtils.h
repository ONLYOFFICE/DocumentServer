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
 #ifdef _MSC_VER
	#pragma once			
#endif	

#ifndef _AVSUTILS_H_	
#define _AVSUTILS_H_


#include <atlbase.h>
#include <atlcoll.h>
#include <stdio.h>

#include "ASCUtilsDefines.h"

#define ADDREFINTERFACE(pinterface)\
{\
	if (pinterface!=NULL)\
	{\
		pinterface->AddRef();\
	}\
}
#define RELEASEINTERFACE(pinterface)\
{\
	if (pinterface!=NULL)\
	{\
		pinterface->Release();\
		pinterface=NULL;\
	}\
}
#define QUERYINTERFACE(pinterface, pinterface_res, iid)\
{\
	if (pinterface!=NULL)\
		pinterface->QueryInterface(iid, (void**)&pinterface_res);\
	else\
		pinterface_res=NULL;\
}
#define RELEASEMEM(pobject)\
{\
	if (pobject!=NULL)\
	{\
		free(pobject);\
		pobject=NULL;\
	}\
}
#define RELEASEOBJECT(pobject)\
{\
	if (pobject!=NULL)\
	{\
		delete pobject;\
		pobject=NULL;\
	}\
}
#define RELEASEARRAYOBJECTS(pobject)\
{\
	if (pobject!=NULL)\
	{\
		delete []pobject;\
		pobject=NULL;\
	}\
}
#define RELEASEHEAP(pmem)\
{\
	if (pmem!=NULL)\
	{\
		HeapFree(GetProcessHeap(), 0, pmem);\
		pmem=NULL;\
	}\
}
#define RELEASEARRAY(parray)\
{\
	if (parray!=NULL)\
	{\
		SafeArrayDestroy(parray);\
		parray=NULL;\
	}\
}
#define RELEASESYSSTRING(pstring)\
{\
	if (pstring!=NULL)\
	{\
		SysFreeString(pstring);\
		pstring=NULL;\
	}\
}
#define RELEASEHANDLE(phandle)\
{\
	if (phandle!=NULL)\
	{\
		CloseHandle(phandle);\
		phandle=NULL;\
	}\
}

class CSynchAccess
{
public:
	HANDLE	m_hSynchAccess;

public:
	CSynchAccess(HANDLE hSynchAccess)
	{
		m_hSynchAccess=hSynchAccess;
		WaitForSingleObject(m_hSynchAccess, INFINITE);
	}
	
	~CSynchAccess(void)
	{
		if (m_hSynchAccess!=NULL)
			ReleaseMutex(m_hSynchAccess);
	}
};

class IBaseUnknown
{
private:
	LONG	m_dwRef;

public:
	LONG __fastcall AddRef()
	{
		return InterlockedIncrement(&m_dwRef);
	}
	
	LONG __fastcall Release()
	{
		LONG	lResult=InterlockedDecrement(&m_dwRef);
		if (lResult==0)
			delete this;
		return lResult;
	}

public:
	IBaseUnknown()
	{
		m_dwRef=1;
	}
	virtual ~IBaseUnknown()
	{
	}
};

template< typename E, class ETraits = CElementTraits< E > >
class CPtrAtlArray:
	public CAtlArray<E, ETraits>
{
public:
	~CPtrAtlArray()
	{
		FreeAll();
	}

	inline E& GetFromBegin()
	{
		ATLASSERT( GetCount()>0 );
		if (GetCount()==0)
			ATL::AtlThrow(E_INVALIDARG);

		return( GetAt(0) );
	}

	inline E& GetFromEnd()
	{
		ATLASSERT( GetCount()>0 );
		if (GetCount()==0)
			ATL::AtlThrow(E_INVALIDARG);

		return( GetAt(GetCount()-1) );
	}

	void FreeAt(size_t iElement, size_t nCount = 1)
	{
		if (iElement >= GetCount()) return;
		if (iElement + nCount > GetCount()) nCount = GetCount() - iElement;
		for (size_t i = iElement; i < iElement + nCount; i++)
	{
			RELEASEOBJECT(GetAt(i))
		}
		RemoveAt(iElement, nCount);
	}
	void FreeAll()
	{
		for (unsigned int i = 0; i < GetCount(); i++)
		{
			RELEASEOBJECT(GetAt(i))
		}
		RemoveAll();
	}
};

template< typename E, class ETraits = CElementTraits< E > >
class CIPtrAtlArray:
	public CAtlArray<E, ETraits>
{
public:
	~CIPtrAtlArray()
	{
		FreeAll();
	}
	inline E& GetFromBegin()
	{
		ATLASSERT( GetCount()>0 );
		if (GetCount()==0)
			ATL::AtlThrow(E_INVALIDARG);

		return( GetAt(0) );
	}

	inline E& GetFromEnd()
	{
		ATLASSERT( GetCount()>0 );
		if (GetCount()==0)
			AtlThrow(E_INVALIDARG);

		return( GetAt(GetCount()-1) );
	}

	void FreeAt(size_t iElement, size_t nCount = 1)
	{
		if (iElement >= GetCount()) return;
		if (iElement + nCount > GetCount()) nCount = GetCount() - iElement;
		for (size_t i = iElement; i < iElement + nCount; i++)
		{
			RELEASEINTERFACE(GetAt(i))
		}
		RemoveAt(iElement, nCount);
	}
	void FreeAll()
	{
		for (unsigned int i = 0; i < GetCount(); i++)
		{
			RELEASEINTERFACE(GetAt(i))
		}
		RemoveAll();
	}
};

class CPerfomanceCounter
{
private:
	LARGE_INTEGER		m_PerformanceCounter;
	FILE*				m_fLogFile;

	LARGE_INTEGER		m_PCBeg;
	LARGE_INTEGER		m_PCEnd;
	LARGE_INTEGER		m_PCFreq;

	LONG				m_CallCounter;
public:
	void __fastcall ReInitCounter()
	{
		m_PerformanceCounter.QuadPart=0;
		m_CallCounter=0;
	}

	void __fastcall StartCounter()
	{
		QueryPerformanceCounter(&m_PCBeg);
		m_CallCounter++;
	}
	DOUBLE __fastcall StopCounter()
	{
		QueryPerformanceCounter(&m_PCEnd);
		m_PerformanceCounter.QuadPart += m_PCEnd.QuadPart - m_PCBeg.QuadPart;

		double	fps=(double)m_PerformanceCounter.QuadPart/m_PCFreq.QuadPart;
		fps/=m_CallCounter;
		fps=1/fps;
		if (m_fLogFile!=NULL)
		{
			fprintf(m_fLogFile, "FPS=%f\n", fps);
			fflush(m_fLogFile);
		}
		return fps;
	}

	CPerfomanceCounter(char* fileName)
	{
		m_PerformanceCounter.QuadPart=0;
		m_CallCounter=0;
		QueryPerformanceFrequency(&m_PCFreq);

		m_fLogFile=NULL;
		if (fileName!=NULL)
		{
			fopen_s(&m_fLogFile, fileName, "a");
		}
	}
	~CPerfomanceCounter()
	{
		if (m_fLogFile!=NULL)
		{
			fclose(m_fLogFile);
			m_fLogFile=NULL;
		}
	}
};

static SAFEARRAY* SafeArrayCreateVector(VARTYPE vt, unsigned int size)
{
	SAFEARRAYBOUND	rgsabound[1];
	rgsabound[0].lLbound = 0;
	rgsabound[0].cElements = size;
	return SafeArrayCreate(vt, 1, rgsabound);
}
#endif // #ifndef _AVSUTILS_H_	// For Borland compiler