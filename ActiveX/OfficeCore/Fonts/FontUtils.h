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
 #ifndef _FONT_UTILS_H
#define _FONT_UTILS_H

#include FT_SFNT_NAMES_H

#define fabs(X) ( X >= 0 ? X : -X )

namespace FontConstants
{
	enum FontStyle
	{
		FontStyleRegular    = 0,
		FontStyleBold       = 1,
		FontStyleItalic     = 2,
		FontStyleBoldItalic = 3,
		FontStyleUnderline  = 4,
		FontStyleStrikeout  = 8
	};
}


#define UNKNOWN_CHARSET 3 
                          



#define MAX_FONT_CACHE_SIZE 16
#define MAX_FONT_NAME_LEN   50
#define MAX_FONT_STYLE_LEN  40

static long GetNextNameValue(HKEY key, LPCTSTR pszSubkey, LPTSTR pszName, LPTSTR pszData)
{
	static HKEY hkey = NULL;	
	static DWORD dwIndex = 0;	
	LONG retval;

	
	if (pszSubkey == NULL && pszName == NULL && pszData == NULL)
	{
		if (hkey)
			RegCloseKey(hkey);
		hkey = NULL;
		return ERROR_SUCCESS;
	}

	
	if (pszSubkey && pszSubkey[0] != 0)
	{
		retval = RegOpenKeyEx(key, pszSubkey, 0, KEY_READ, &hkey);
		if (retval != ERROR_SUCCESS)
		{
			return retval;
		}
		dwIndex = 0;
	}
	else
	{
		dwIndex++;
	}

	_ASSERTE(pszName != NULL && pszData != NULL);

	*pszName = 0;
	*pszData = 0;

	TCHAR szValueName[MAX_PATH];
	DWORD dwValueNameSize = sizeof(szValueName)-1;
	BYTE szValueData[MAX_PATH];
	DWORD dwValueDataSize = sizeof(szValueData)-1;
	DWORD dwType = 0;

	retval = RegEnumValue(hkey, dwIndex, szValueName, &dwValueNameSize, NULL,
		&dwType, szValueData, &dwValueDataSize);
	if (retval == ERROR_SUCCESS)
	{
		lstrcpy(pszName, (LPTSTR)szValueName);
		lstrcpy(pszData, (LPTSTR)szValueData);
	}

	return retval;
}



static FT_Error FT_New_FaceW(FT_Library pLibrary, wchar_t *wsFilePath, FT_Long lIndex, FT_Face *pFace)
{
	USES_CONVERSION;
	FT_Open_Args oOpenArgs;
	oOpenArgs.flags    = FT_OPEN_PATHNAME;
	oOpenArgs.pathname = W2A( wsFilePath );

	FT_Parameter *pParams = (FT_Parameter *)::malloc( sizeof(FT_Parameter) * 4 );
	pParams[0].tag  = FT_MAKE_TAG( 'i', 'g', 'p', 'f' );
	pParams[0].data = NULL;
	pParams[1].tag  = FT_MAKE_TAG( 'i', 'g', 'p', 's' );
	pParams[1].data = NULL; 
	pParams[2].tag  = FT_PARAM_TAG_IGNORE_PREFERRED_FAMILY;
	pParams[2].data = NULL; 
	pParams[3].tag  = FT_PARAM_TAG_IGNORE_PREFERRED_SUBFAMILY;
	pParams[3].data = NULL; 

	oOpenArgs.num_params = 4;
	oOpenArgs.params     = pParams;

	int nError  = FT_Open_Face( pLibrary, &oOpenArgs, lIndex, pFace );

	::free( pParams );
	return nError;
}

static int  GetDefaultCharset(BOOL bUseDefCharset = TRUE)
{
	if ( !bUseDefCharset )
		return UNKNOWN_CHARSET;

	LOCALESIGNATURE LocSig;
	GetLocaleInfo( GetSystemDefaultLCID(), LOCALE_FONTSIGNATURE, (LPWSTR)&LocSig, sizeof(LocSig) / sizeof(TCHAR) );

	if ( LocSig.lsCsbDefault[0] & 1 )
		return 0;
	else if ( LocSig.lsCsbDefault[0] & 2 )
		return 238;
	else if ( LocSig.lsCsbDefault[0] & 4 )
		return 204;
	else if ( LocSig.lsCsbDefault[0] & 8 )
		return 161;
	else if ( LocSig.lsCsbDefault[0] & 16 )
		return 162;
	else if ( LocSig.lsCsbDefault[0] & 32 )
		return 177;
	else if ( LocSig.lsCsbDefault[0] & 64 )
		return 178;
	else if ( LocSig.lsCsbDefault[0] & 128 )
		return 186;
	else if ( LocSig.lsCsbDefault[0] & 256 )
		return 163;
	else if ( LocSig.lsCsbDefault[0] & 0x10000 )
		return 222;
	else if ( LocSig.lsCsbDefault[0] & 0x20000 )
		return 128;
	else if ( LocSig.lsCsbDefault[0] & 0x40000 )
		return 134;
	else if ( LocSig.lsCsbDefault[0] & 0x80000 )
		return 129;
	else if ( LocSig.lsCsbDefault[0] & 0x100000 )
		return 136;
	else if ( LocSig.lsCsbDefault[0] & 0x200000 )
		return 130;
	else if ( LocSig.lsCsbDefault[0] & 0x20000000 )
		return 77;
	else if ( LocSig.lsCsbDefault[0] & 0x40000000 )
		return 255;
	else if ( LocSig.lsCsbDefault[0] & 0x80000000 )
		return 2;

	return 0;
}

static void GetCodePageByCharset(unsigned char unCharset, unsigned long *pulBit, unsigned int *punLongIndex)
{
	
	


	
	

	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	

	

	if ( punLongIndex )
		*punLongIndex = 4;

	if ( unCharset == DEFAULT_CHARSET )
		unCharset = GetDefaultCharset();
	
	if ( pulBit )
	{
		switch( unCharset )
		{
		case 0x00: *pulBit =  0; break;
		case 0xEE: *pulBit =  1; break;
		case 0xCC: *pulBit =  2; break;
		case 0xA1: *pulBit =  3; break;
		case 0xA2: *pulBit =  4; break;
		case 0xB1: *pulBit =  5; break;
		case 0xB2: *pulBit =  6; break;
		case 0xBA: *pulBit =  7; break;
		case 0xA3: *pulBit =  8; break;
		case 0xDE: *pulBit = 16; break;
		case 0x80: *pulBit = 17; break;
		case 0x86: *pulBit = 18; break;
		case 0x81: *pulBit = 19; break;
		case 0x88: *pulBit = 20; break;
		case 0x82: *pulBit = 21; break;
		case 0x4D: *pulBit = 29; break;
		case 0x02: *pulBit = 31; break;
		case 0xFF: *pulBit = 30; break;
		default:   *pulBit =  0; break;
		}
	}


}
#endif 