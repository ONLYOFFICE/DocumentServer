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
#ifndef BINREADER_COMMON
#define BINREADER_COMMON 

#include "FileDownloader.h"
#include "../Foreign/StringWriter.h"

bool IsUnicodeSymbol( WCHAR symbol )
{
	bool result = false;

	if ( ( 0x0009 == symbol ) || ( 0x000A == symbol ) || ( 0x000D == symbol ) ||
		( ( 0x0020 <= symbol ) && ( 0xD7FF >= symbol ) ) || ( ( 0xE000 <= symbol ) && ( symbol <= 0xFFFD ) ) ||
		( ( 0x10000 <= symbol ) && symbol ) )
	{
		result = true;
	}

	return result;		  
}
void CorrectString(CString& strValue)
{
	for (unsigned int i = 0, length = strValue.GetLength(); i < length; ++i )
	{
		if ( false == IsUnicodeSymbol( strValue.GetAt(i) ) )
		{
			strValue.SetAt(i, ' ');
		}
	}
	strValue.Replace(_T("&"),	_T("&amp;"));			
	strValue.Replace(_T("'"),	_T("&apos;"));
	strValue.Replace(_T("<"),	_T("&lt;"));
	strValue.Replace(_T(">"),	_T("&gt;"));
	strValue.Replace(_T("\""),	_T("&quot;"));
}
long Round(double val)
{
	return (long)(val+ 0.5);
}
CString DownloadImage(const CString& strFile)
{
	CFileDownloader oDownloader(strFile, FALSE);
	oDownloader.Start( 1 );
	while ( oDownloader.IsRunned() )
	{
		::Sleep( 10 );
	}
	CString strFileName;
	if ( oDownloader.IsFileDownloaded() )
	{
		strFileName = oDownloader.GetFilePath();
	}
	return strFileName;
}
VOID convertBase64ToImage (CString sImage, CString &pBase64)
{
	HANDLE hFileWriteHandle;
	
	hFileWriteHandle = ::CreateFile (sImage, GENERIC_WRITE, FILE_SHARE_WRITE, NULL, CREATE_ALWAYS, FILE_ATTRIBUTE_NORMAL, 0);
	if (INVALID_HANDLE_VALUE != hFileWriteHandle)
	{
		INT nUTF8Len = WideCharToMultiByte (CP_UTF8, 0, pBase64, pBase64.GetLength (), NULL, NULL, NULL, NULL);
		CHAR *pUTF8String = new CHAR [nUTF8Len + 1];
		::ZeroMemory (pUTF8String, sizeof (CHAR) * (nUTF8Len + 1));

		WideCharToMultiByte (CP_UTF8, 0, pBase64, -1, pUTF8String, nUTF8Len, NULL, NULL);
		CStringA sUnicode; sUnicode = pUTF8String;
		delete[] pUTF8String;

		
		int nShift = 0;
		int nIndex = sUnicode.Find("base64,");
		if(-1 != nIndex)
		{
			nShift = nIndex + 7;
		}
		
		LONG lFileSize = sUnicode.GetLength () - nShift;
		INT nDstLength = lFileSize;
		BYTE *pBuffer = new BYTE [lFileSize];
		::ZeroMemory (pBuffer, lFileSize);
		Base64::Base64Decode ((LPCSTR)sUnicode.GetBuffer () + nShift, lFileSize, pBuffer, &nDstLength);

		
		DWORD dwBytesWrite = 0;
		::WriteFile (hFileWriteHandle, pBuffer, nDstLength, &dwBytesWrite, 0);

		RELEASEARRAYOBJECTS (pBuffer);

		CloseHandle (hFileWriteHandle);
	}
}
#endif