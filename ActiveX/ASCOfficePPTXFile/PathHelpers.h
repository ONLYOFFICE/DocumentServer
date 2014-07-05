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

#include <atlutil.h>
#include <atlstr.h>

namespace PathHelpers
{
	static inline BOOL UnescapeURL (LPCWSTR szStringIn, LPWSTR szStringOut, LPDWORD pdwStrLen, DWORD dwMaxLength)
	{
		ATLENSURE(szStringIn != NULL);
		ATLENSURE(szStringOut != NULL);
		
		BOOL bRet = FALSE;

		int nSrcLen =	(int) wcslen(szStringIn);
		int nCnt	=	WideCharToMultiByte(CP_ACP, 0, szStringIn, nSrcLen, NULL, 0, NULL, NULL); 
		if (nCnt != 0)
		{
			nCnt++;
			CHeapPtr<char> szIn;

			char szInBuf[ATL_URL_MAX_URL_LENGTH];
			char *pszIn = szInBuf;

			if (nCnt <= 0)
			{
				return FALSE;
			}

			
			if (nCnt > ATL_URL_MAX_URL_LENGTH)
			{
				if (!szIn.AllocateBytes(nCnt))
				{
					
					return FALSE;
				}
				pszIn = szIn;
			}

			nCnt = WideCharToMultiByte(CP_ACP, 0, szStringIn, nSrcLen, pszIn, nCnt, NULL, NULL); 
			ATLASSERT( nCnt != 0 );

			pszIn[nCnt] = '\0';

			char szOutBuf[ATL_URL_MAX_URL_LENGTH];
			char *pszOut = szOutBuf;
			CHeapPtr<char> szTmp;

			
			if (dwMaxLength > ATL_URL_MAX_URL_LENGTH)
			{
				if (!szTmp.AllocateBytes(dwMaxLength))
				{
					
					return FALSE;
				}
				pszOut = szTmp;
			}

			DWORD dwStrLen = 0;
			bRet = AtlUnescapeUrl(pszIn, pszOut, &dwStrLen, dwMaxLength);

			if (bRet != FALSE)
			{
				
				
				_ATLTRY
				{
					Checked::wmemcpy_s(szStringOut, dwMaxLength, CA2W( pszOut ), dwStrLen);
				}
				_ATLCATCHALL()
				{
					bRet = FALSE;
				}
			}
			if (pdwStrLen)
			{
				*pdwStrLen = dwStrLen;
			}
		}

		return bRet;
	}

	static inline CString ResourceFileSystemPath (const CString& toPath)
	{
		CString sPathName	=	toPath;			

		int lIndex			=	-1;		
		lIndex				=	sPathName.Find(_T("file:///"));
		if (0 == lIndex)
			sPathName		=	sPathName.Mid(8);

		lIndex				=	sPathName.Find(_T("file://"));
		if (0 == lIndex)
			sPathName		=	sPathName.Mid(7);

		lIndex				=	sPathName.Find(_T("file:\\"));
		if (0 == lIndex)
			sPathName		=	sPathName.Mid(6);

		DWORD dwLength		=	0;
		CString filePath;

		if (UnescapeURL (sPathName, filePath.GetBuffer(4096), &dwLength, 4096))
			sPathName		=	filePath;

		filePath.ReleaseBuffer();

		return sPathName;
	}

	static inline CString ResourceFileSystemPathXml (const CString& toPath)
	{
		CString sPathName	=	ResourceFileSystemPath (toPath);			

		sPathName.Replace ( _T("&"),  _T("&amp;") );
		sPathName.Replace ( _T("'"),  _T("&apos;") );
		sPathName.Replace ( _T("<"),  _T("&lt;") );
		sPathName.Replace ( _T(">"),  _T("&gt;") );
		sPathName.Replace ( _T("\""), _T("&quot;") );

		return sPathName;
	}
}