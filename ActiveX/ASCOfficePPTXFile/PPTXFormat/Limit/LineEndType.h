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
#ifndef PPTX_LIMIT_LINEENDTYPE_INCLUDE_H_
#define PPTX_LIMIT_LINEENDTYPE_INCLUDE_H_

#include "BaseLimit.h"


namespace PPTX
{
	namespace Limit
	{
		class LineEndType : public BaseLimit
		{
		public:
			LineEndType()
			{
				m_strValue = _T("none");
			}

			_USE_STRING_OPERATOR
				
			virtual void set(const CString& strValue)
			{
				if ((_T("none") == strValue) ||
					(_T("arrow") == strValue) ||
					(_T("diamond") == strValue) ||
					(_T("oval") == strValue) ||
					(_T("stealth") == strValue) ||
					(_T("triangle") == strValue))
				{
					m_strValue = strValue;
				}
			}

			virtual BYTE GetBYTECode() const
			{
				if (_T("none") == m_strValue)
					return 0;
				if (_T("arrow") == m_strValue)
					return 1;
				if (_T("diamond") == m_strValue)
					return 2;
				if (_T("oval") == m_strValue)
					return 3;
				if (_T("stealth") == m_strValue)
					return 4;
				if (_T("triangle") == m_strValue)
					return 5;
				return 0;
			}

			virtual void SetBYTECode(const BYTE& src)
			{
				switch (src)
				{
				case 0:
					m_strValue = _T("none");
					break;
				case 1:
					m_strValue = _T("arrow");
					break;
				case 2:
					m_strValue = _T("diamond");
					break;
				case 3:
					m_strValue = _T("oval");
					break;
				case 4:
					m_strValue = _T("stealth");
					break;
				case 5:
					m_strValue = _T("triangle");
					break;
				default:
					break;
				}
			}
		};
	} 
} 

#endif // PPTX_LIMIT_LINEENDTYPE_INCLUDE_H_