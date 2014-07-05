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

class CTimeMeasurer
{
public:
	CTimeMeasurer()
	{
		QueryPerformanceFrequency(&m_liFreq);	
		QueryPerformanceCounter(&m_liStart);
	}
	virtual ~CTimeMeasurer()
	{
	}

	void Reset()
	{
		QueryPerformanceCounter(&m_liStart);
	}
	
	virtual float GetTimeInterval()
	{
		LARGE_INTEGER liFinish;
		QueryPerformanceCounter(&liFinish);
		return (float)((liFinish.QuadPart-m_liStart.QuadPart)/(float)m_liFreq.LowPart);
	}
protected:
	LARGE_INTEGER m_liStart;
	LARGE_INTEGER m_liFreq;	
};

class CTimeMeasurerExt
	: public CTimeMeasurer
{
public:
	CTimeMeasurerExt()
		: m_bIsSuspended(FALSE)
	{
		m_liSuspendedTime.QuadPart = 0;
	}
	virtual ~CTimeMeasurerExt()
	{
	}
	void Suspend()
	{
		if (m_bIsSuspended)
			return;
		m_bIsSuspended = TRUE;
		QueryPerformanceCounter(&m_liStartSuspend);
	}
	void Resume()
	{
		if (!m_bIsSuspended)
			return;
		LARGE_INTEGER liTemp;
		QueryPerformanceCounter(&liTemp);
		m_liSuspendedTime.QuadPart += liTemp.QuadPart - m_liStartSuspend.QuadPart;
		m_bIsSuspended = FALSE;
	}
	
	virtual float GetTimeInterval()
	{
		if (m_bIsSuspended)
			return (float)((m_liStartSuspend.QuadPart - m_liStart.QuadPart - m_liSuspendedTime.QuadPart)/(float)m_liFreq.LowPart);

		LARGE_INTEGER liFinish;
		QueryPerformanceCounter(&liFinish);
		return (float)((liFinish.QuadPart - m_liStart.QuadPart - m_liSuspendedTime.QuadPart)/(float)m_liFreq.LowPart);
	}
protected:
	LARGE_INTEGER m_liStartSuspend;
	LARGE_INTEGER m_liSuspendedTime;
	BOOL m_bIsSuspended;
};

class CTraceTimer
{
public:
	CTraceTimer(const CString &sTitle)
		: m_sTitle(sTitle)
	{
	}
	~CTraceTimer()
	{
		ATLTRACE("%s %0.3f\n",m_sTitle,m_oTimer.GetTimeInterval());
	}
	void Trace(const CString &sSubTitle)
	{
		ATLTRACE("%s::%s %0.3f\n",m_sTitle,sSubTitle,m_oTimer.GetTimeInterval());
	}
protected:
	CTimeMeasurer m_oTimer;
	CString m_sTitle;
};
