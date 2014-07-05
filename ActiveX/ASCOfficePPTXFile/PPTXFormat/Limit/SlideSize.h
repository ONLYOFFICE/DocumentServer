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
#ifndef PPTX_LIMIT_SLIDESIZE_INCLUDE_H_
#define PPTX_LIMIT_SLIDESIZE_INCLUDE_H_

#include "BaseLimit.h"



namespace PPTX
{
	namespace Limit
	{
		class SlideSize : public BaseLimit
		{
		public:
			SlideSize()
			{
				m_strValue = _T("screen4x3");
			}

			_USE_STRING_OPERATOR
				
			virtual void set(const CString& strValue)
			{
				if ((_T("35mm") == strValue) ||
					(_T("A3") == strValue) ||
					(_T("A4") == strValue) ||
					(_T("B4ISO") == strValue) ||
					(_T("B4JIS") == strValue) ||
					(_T("B5ISO") == strValue) ||
					(_T("B5JIS") == strValue) ||
					(_T("banner") == strValue) ||
					(_T("custom") == strValue) ||
					(_T("hagakiCard") == strValue) ||
					(_T("ledger") == strValue) ||
					(_T("letter") == strValue) ||
					(_T("overhead") == strValue) ||
					(_T("screen16x10") == strValue) ||
					(_T("screen16x9") == strValue) ||
					(_T("screen4x3") == strValue))
				{
					m_strValue = strValue;
				}
			}

			virtual BYTE GetBYTECode() const
			{
				if (_T("35mm") == m_strValue) return 0;
				if (_T("A3") == m_strValue) return 1;
				if (_T("A4") == m_strValue) return 2;
				if (_T("B4ISO") == m_strValue) return 3;
				if (_T("B4JIS") == m_strValue) return 4;
				if (_T("B5ISO") == m_strValue) return 5;
				if (_T("B5JIS") == m_strValue) return 6;
				if (_T("banner") == m_strValue) return 7;
				if (_T("custom") == m_strValue) return 8;
				if (_T("hagakiCard") == m_strValue) return 9;
				if (_T("ledger") == m_strValue) return 10;
				if (_T("letter") == m_strValue) return 11;
				if (_T("overhead") == m_strValue) return 12;
				if (_T("screen16x10") == m_strValue) return 13;
				if (_T("screen16x9") == m_strValue) return 14;
				if (_T("screen4x3") == m_strValue) return 15;

				return 15;
			}
			virtual void SetBYTECode(const BYTE& type)
			{
				switch (type)
				{
				case 0: m_strValue = _T("35mm"); break;
				case 1: m_strValue = _T("A3"); break;
				case 2: m_strValue = _T("A4"); break;
				case 3: m_strValue = _T("B4ISO"); break;
				case 4: m_strValue = _T("B4JIS"); break;
				case 5: m_strValue = _T("B5ISO"); break;
				case 6: m_strValue = _T("B5JIS"); break;
				case 7: m_strValue = _T("banner"); break;
				case 8: m_strValue = _T("custom"); break;
				case 9: m_strValue = _T("hagakiCard"); break;
				case 10: m_strValue = _T("ledger"); break;
				case 11: m_strValue = _T("letter"); break;
				case 12: m_strValue = _T("overhead"); break;
				case 13: m_strValue = _T("screen16x10"); break;
				case 14: m_strValue = _T("screen16x9"); break;
				case 15: m_strValue = _T("screen4x3"); break;
				default:
					m_strValue = _T("screen4x3");					
				}
			}
		};
	} 
} 

#endif // PPTX_LIMIT_SLIDESIZE_INCLUDE_H_