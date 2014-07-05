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


class CBaseThread
{
public:
	CBaseThread(DWORD_PTR dwAffinityMask)
		: m_bRunThread(FALSE)
		, m_hThread(NULL)
		, m_lPercents(0)
		, m_lError(0)
		, m_dwAffinityMask(dwAffinityMask)
		, m_bSuspend(FALSE)
	{
		if (0==m_dwAffinityMask)
		{
			DWORD_PTR dwProcessAffinityMask = 0;
			DWORD_PTR dwSystemAffinityMask = 0;
			if (GetProcessAffinityMask(GetCurrentProcess(), &dwProcessAffinityMask, &dwSystemAffinityMask))
				m_dwAffinityMask = dwProcessAffinityMask;
		}
	}
	virtual ~CBaseThread()
	{
		Stop();
	}
	virtual void Start(long lPriority)
	{
		if (m_bRunThread)
			return;
		m_lError = 0;
		m_bSuspend = FALSE;
		StartThread();
		SetThreadPriority(m_hThread, lPriority);
		m_lThreadPriority = lPriority;
	}
	virtual void Suspend()
	{
		m_bSuspend = TRUE;
	}
	virtual void Resume()
	{
		m_bSuspend = FALSE;
	}
	virtual void Stop()
	{
		if (!m_bRunThread)
			return;
		m_bRunThread = FALSE;
		if (NULL!=m_hThread)
			WaitForSingleObject(m_hThread,INFINITE);
		RELEASEHANDLE(m_hThread);
	}
	inline BOOL IsSuspended() const
	{		
		return m_bSuspend;
	}
	inline BOOL IsRunned() const
	{		
		return m_bRunThread;
	}
	inline long GetPercents() const
	{
		return m_lPercents;
	}

	inline long GetError() const
	{
		return m_lError;
	}
	inline HANDLE GetHandle()
	{
		return m_hThread;
	}
	inline int GetPriority()
	{
		return GetThreadPriority(m_hThread);
	}
protected:
	HANDLE m_hThread;
	BOOL m_bRunThread;
	BOOL m_bSuspend;
	DWORD_PTR m_dwAffinityMask;
	long m_lPercents;

	long m_lError;
	long m_lThreadPriority;


	void StartThread()
	{
		DWORD dwTemp;
		m_bRunThread = TRUE;
		m_hThread = CreateThread(NULL, 0, &_ThreadProc, (void*)this, 0, &dwTemp);
		SetThreadAffinityMask(m_hThread, m_dwAffinityMask);
	}
	void CheckSuspend()
	{
		while ((m_bSuspend)&&(m_bRunThread))
			Sleep(10);
	}
	static DWORD WINAPI _ThreadProc(void* pv)
	{
		CBaseThread *pThis = (CBaseThread *)pv;
		return pThis->ThreadProc();
	}
	virtual DWORD ThreadProc() = 0;
};