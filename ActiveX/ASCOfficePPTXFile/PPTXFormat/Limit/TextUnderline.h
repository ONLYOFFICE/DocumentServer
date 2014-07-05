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
#ifndef PPTX_LIMIT_TEXTUNDERLINE_INCLUDE_H_
#define PPTX_LIMIT_TEXTUNDERLINE_INCLUDE_H_

#include "BaseLimit.h"


namespace PPTX
{
	namespace Limit
	{
		class TextUnderline : public BaseLimit
		{
		public:
			TextUnderline()
			{
				m_strValue = _T("sng");
			}

			_USE_STRING_OPERATOR
				
			virtual void set(const CString& strValue)
			{
				if ((_T("dash") == strValue) ||
					(_T("dashHeavy") == strValue) ||
					(_T("dashLong") == strValue) ||
					(_T("dashLongHeavy") == strValue) ||
					(_T("dbl") == strValue) ||
					(_T("dotDash") == strValue) ||
					(_T("dotDashHeavy") == strValue) ||
					(_T("dotDotDash") == strValue) ||
					(_T("dotDotDashHeavy") == strValue) ||
					(_T("dotted") == strValue) ||
					(_T("dottedHeavy") == strValue) ||
					(_T("heavy") == strValue) ||
					(_T("none") == strValue) ||
					(_T("sng") == strValue) ||
					(_T("wavy") == strValue) ||
					(_T("wavyDbl") == strValue) ||
					(_T("wavyHeavy") == strValue) ||
					(_T("words") == strValue))
				{
					m_strValue = strValue;
				}
			}

			virtual BYTE GetBYTECode() const
			{
				if (_T("dash") == m_strValue)
					return 0;
				if (_T("dashHeavy") == m_strValue)
					return 1;
				if (_T("dashLong") == m_strValue)
					return 2;
				if (_T("dashLongHeavy") == m_strValue)
					return 3;
				if (_T("dbl") == m_strValue)
					return 4;
				if (_T("dotDash") == m_strValue)
					return 5;
				if (_T("dotDashHeavy") == m_strValue)
					return 6;
				if (_T("dotDotDash") == m_strValue)
					return 7;
				if (_T("dotDotDashHeavy") == m_strValue)
					return 8;
				if (_T("dotted") == m_strValue)
					return 9;
				if (_T("dottedHeavy") == m_strValue)
					return 10;
				if (_T("heavy") == m_strValue)
					return 11;
				if (_T("none") == m_strValue)
					return 12;
				if (_T("sng") == m_strValue)
					return 13;
				if (_T("wavy") == m_strValue)
					return 14;
				if (_T("wavyDbl") == m_strValue)
					return 15;
				if (_T("wavyHeavy") == m_strValue)
					return 16;
				if (_T("words") == m_strValue)
					return 17;
				return 13;
			}

			virtual void SetBYTECode(const BYTE& src)
			{	
				switch (src)
				{
					case 0:		m_strValue = _T("dash"); break;
					case 1:		m_strValue = _T("dashHeavy"); break;
					case 2:		m_strValue = _T("dashLong"); break;
					case 3:		m_strValue = _T("dashLongHeavy"); break;
					case 4:		m_strValue = _T("dbl"); break;
					case 5:		m_strValue = _T("dotDash"); break;
					case 6:		m_strValue = _T("dotDashHeavy"); break;
					case 7:		m_strValue = _T("dotDotDash"); break;
					case 8:		m_strValue = _T("dotDotDashHeavy"); break;
					case 9:		m_strValue = _T("dotted"); break;
					case 10:	m_strValue = _T("dottedHeavy"); break;
					case 11:	m_strValue = _T("heavy"); break;
					case 12:	m_strValue = _T("none"); break;
					case 13:	m_strValue = _T("sng"); break;
					case 14:	m_strValue = _T("wavy"); break;
					case 15:	m_strValue = _T("wavyDbl"); break;
					case 16:	m_strValue = _T("wavyHeavy"); break;
					case 17:	m_strValue = _T("words"); break;
				default:
					m_strValue = _T("sng");
					break;
				}
			}
		};
	} 
} 

#endif // PPTX_LIMIT_TEXTUNDERLINE_INCLUDE_H_