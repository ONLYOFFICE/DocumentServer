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
 #ifndef _TIMER_H_
#define _TIMER_H_

#include "ATLDefine.h"


template <class Derived, class T, const IID* piid>
class CTimer
{
public:

	CTimer()
	{
		m_bCOMTimerOn = FALSE;
		m_bAPITimerOn = FALSE;

		m_hAPIThread = NULL;
		m_dwAPIThreadID = 0;

		m_hCOMThread = NULL;
		m_dwCOMThreadID = 0;

		m_pStream = NULL;
	}

	HRESULT APITimerOn(DWORD dwTimerInterval)
	{
		Derived* pDerived = ((Derived*)this);

		m_dwAPITimerInterval = dwTimerInterval;
		if (m_bAPITimerOn) 
			return S_OK;

		m_bAPITimerOn = TRUE;

		
		m_hAPIThread = CreateThread(NULL, 0, &_APIApartment, (void*)this, 0, &m_dwAPIThreadID);

		return S_OK;
	}

	HRESULT COMTimerOn(DWORD dwTimerInterval)
	{
		HRESULT hRes;
		Derived* pDerived = ((Derived*)this);

		m_dwCOMTimerInterval = dwTimerInterval;
		if (m_bCOMTimerOn) 
			return S_OK;

		m_bCOMTimerOn = TRUE;
		m_pStream = NULL;


		hRes = CoMarshalInterThreadInterfaceInStream(*piid, (T*)pDerived, &m_pStream);

		m_hCOMThread = CreateThread(NULL, 0, &_COMApartment, (void*)this, 0, &m_dwCOMThreadID);

		return S_OK;
	}

	void APITimerOff()
	{
		if (m_bAPITimerOn) 
		{
			m_bAPITimerOn = FALSE;
			if (NULL!=m_hAPIThread)
				WaitForSingleObject(m_hAPIThread, INFINITE);
		}
		RELEASEHANDLE(m_hAPIThread);	
	}

	void COMTimerOff()
	{
		if (m_bCOMTimerOn) 
		{
			m_bCOMTimerOn = FALSE;
			if (NULL != m_hCOMThread)
			{
				WaitWithMessageLoop(m_hCOMThread);	
			}
		}
		RELEASEHANDLE(m_hCOMThread);
	}



private:
	
	BOOL WaitWithMessageLoop(HANDLE hEvent)
	{
		while(1)
		{
			const DWORD dwRet = MsgWaitForMultipleObjects(1, &hEvent, FALSE, INFINITE, QS_ALLINPUT);

			if (WAIT_OBJECT_0 == dwRet)
				return TRUE;    

			if (dwRet != WAIT_OBJECT_0 + 1)
				break;          

			MSG msg;

			
			while (PeekMessage(&msg,NULL,NULL,NULL,PM_REMOVE))
			{
				TranslateMessage (&msg);
				DispatchMessage (&msg);
				if (WAIT_OBJECT_0 == WaitForSingleObject(hEvent, 0))
					return TRUE; 
			}
		}
		return FALSE;
	}

	static DWORD WINAPI _APIApartment(void* pv)
	{
		CTimer<Derived, T, piid>* pThis = (CTimer<Derived, T, piid>*) pv;
		pThis->APIApartment();
		return 0;
	}

	static DWORD WINAPI _COMApartment(void* pv)
	{
		CTimer<Derived, T, piid>* pThis = (CTimer<Derived, T, piid>*) pv;
		pThis->COMApartment();
		return 0;
	}

	DWORD APIApartment()
	{
		DWORD m_startTime, m_curTime;
		m_startTime = GetTickCount();

		CoInitialize(NULL);

		while(m_bAPITimerOn)
		{
			m_curTime = GetTickCount();
			while(m_curTime - m_startTime < m_dwAPITimerInterval)
			{
				Sleep(10);
				if(!m_bAPITimerOn) break;
				m_curTime = GetTickCount();
			}

			m_startTime = GetTickCount();
			
			OnTimer();
			
		}
		CoUninitialize();
		return 0;
	}

	DWORD COMApartment()
	{
		DWORD m_startTime (0), m_curTime (0);
		m_startTime = GetTickCount();
		HRESULT hRes = CoInitialize(NULL);

		T* piObj = NULL;

		if (m_pStream)
			hRes = CoGetInterfaceAndReleaseStream(m_pStream, *piid, (void**) &piObj);

		while(m_bCOMTimerOn)
		{
			m_curTime = GetTickCount();
			while (m_curTime - m_startTime < m_dwCOMTimerInterval)
			{
				Sleep(10);
				if (!m_bCOMTimerOn) break;
				m_curTime = GetTickCount();
			}

			m_startTime = GetTickCount();
			if (piObj)
				piObj->_OnTimer();
		}
		RELEASEINTERFACE (piObj);
		CoUninitialize();
		return 0;
	}


public:
	DWORD	m_dwCOMTimerInterval;
	DWORD	m_dwAPITimerInterval;

virtual	void OnTimer (void)
		{
			return;
		}


private:
	HANDLE	m_hAPIThread;
	DWORD	m_dwAPIThreadID;
	BOOL	m_bAPITimerOn;
	
	HANDLE	m_hCOMThread;
	DWORD	m_dwCOMThreadID;
	BOOL	m_bCOMTimerOn;

	LPSTREAM m_pStream;
};

#endif