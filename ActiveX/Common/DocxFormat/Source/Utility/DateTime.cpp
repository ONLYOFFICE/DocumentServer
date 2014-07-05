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
 #include "DateTime.h"
#include "time.h"




DateTime::DateTime()
{
	time_t oNow;
	tm oLocal;
	time( &oNow );
	localtime_s( &oLocal, &oNow );

	m_nYear        = oLocal.tm_year + 1900;
	m_nMonth       = oLocal.tm_mon + 1;
	m_nDay         = oLocal.tm_mday;
	m_nHour        = oLocal.tm_hour;
	m_nMinute      = oLocal.tm_min;
	m_nSecond      = oLocal.tm_sec;
	m_nMillisecond = 0;
}


DateTime::DateTime(const CString &sValue, const CString &sPattern)	
	:
	m_nYear         ( ParseValue( sValue, sPattern, "%YYYY") ),
	m_nMonth        ( ParseValue( sValue, sPattern, "%MM"  ) ),
	m_nDay          ( ParseValue( sValue, sPattern, "%DD"  ) ),
	m_nHour         ( ParseValue( sValue, sPattern, "%hh"  ) ),
	m_nMinute       ( ParseValue( sValue, sPattern, "%mm"  ) ),
	m_nSecond       ( ParseValue( sValue, sPattern, "%ss"  ) ),
	m_nMillisecond	( ParseValue( sValue, sPattern, "%ms"  ) )
{
}


const CString  DateTime::ToString  (const CString &sPattern) const
{
	CString sResult = sPattern, sTemp;

	sTemp.Format( _T("%04d"), m_nYear        ); sResult.Replace( _T("%YYYY"), sTemp ); sTemp.Empty();
	sTemp.Format( _T("%02d"), m_nMonth       ); sResult.Replace( _T("%MM"),   sTemp ); sTemp.Empty();
	sTemp.Format( _T("%02d"), m_nDay         ); sResult.Replace( _T("%DD"),   sTemp ); sTemp.Empty();
	sTemp.Format( _T("%02d"), m_nHour        ); sResult.Replace( _T("%hh"),   sTemp ); sTemp.Empty();
	sTemp.Format( _T("%02d"), m_nMinute      ); sResult.Replace( _T("%mm"),   sTemp ); sTemp.Empty();
	sTemp.Format( _T("%02d"), m_nSecond      ); sResult.Replace( _T("%ss"),   sTemp ); sTemp.Empty();
	sTemp.Format( _T("%02d"), m_nMillisecond ); sResult.Replace( _T("%ms"),   sTemp );

	return sResult;
}


const DateTime DateTime::Parse     (const CString &sValue, const CString &sPattern)
{
	return DateTime( sValue, sPattern );
}


const int      DateTime::ParseValue(const CString &sValue, const CString &sPattern, const CString &sElement)
{
	const int nPos = sPattern.Find( sElement );

	if ( -1 != nPos )
	{
		int nSepCount = 0;
		for ( int nIndex = 0; nIndex < nPos; nIndex++ )
		{
			if ( '%' == sPattern[nIndex] )
				nSepCount++;
		}

		const CString sNumeric = sValue.Mid( nPos - nSepCount , sElement.GetLength() - 1 );

		return _wtoi( sNumeric );
	}
	return 0;
}