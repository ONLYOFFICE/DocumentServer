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
#ifndef PPTX_LIMIT_PLACEHOLDERTYPE_INCLUDE_H_
#define PPTX_LIMIT_PLACEHOLDERTYPE_INCLUDE_H_

#include "BaseLimit.h"


namespace PPTX
{
	namespace Limit
	{
		AVSINLINE int GetPhType(const CString& strType)
		{
			if (_T("body") == strType)
				return 0;
			if (_T("chart") == strType)
				return 1;
			if (_T("clipArt") == strType)
				return 2;
			if (_T("ctrTitle") == strType)
				return 15;
			if (_T("dgm") == strType)
				return 4;
			if (_T("dt") == strType)
				return 5;
			if (_T("ftr") == strType)
				return 6;
			if (_T("hdr") == strType)
				return 7;
			if (_T("media") == strType)
				return 8;
			if (_T("obj") == strType)
				return 9;
			if (_T("pic") == strType)
				return 10;
			if (_T("sldImg") == strType)
				return 11;
			if (_T("sldNum") == strType)
				return 12;
			if (_T("subTitle") == strType)
				return 0;
			if (_T("tbl") == strType)
				return 14;
			if (_T("title") == strType)
				return 15;
			return 0;
		}

		class PlaceholderType : public BaseLimit
		{
		public:
			PlaceholderType()
			{
				m_strValue = _T("obj");
	 		}

			_USE_STRING_OPERATOR
				
			virtual void set(const CString& strValue)
			{
				if ((_T("body") == strValue) ||
					(_T("chart") == strValue) ||
					(_T("clipArt") == strValue) ||
					(_T("ctrTitle") == strValue) ||
					(_T("dgm") == strValue) ||
					(_T("dt") == strValue) ||
					(_T("ftr") == strValue) ||
					(_T("hdr") == strValue) ||
					(_T("media") == strValue) ||
					(_T("obj") == strValue) ||
					(_T("pic") == strValue) ||
					(_T("sldImg") == strValue) ||
					(_T("sldNum") == strValue) ||
					(_T("subTitle") == strValue) ||
					(_T("tbl") == strValue) ||
					(_T("title") == strValue))
				{
					m_strValue = strValue;
				}
			}

			virtual BYTE GetBYTECode() const
			{
				if (_T("body") == m_strValue)
					return 0;
				if (_T("chart") == m_strValue)
					return 1;
				if (_T("clipArt") == m_strValue)
					return 2;
				if (_T("ctrTitle") == m_strValue)
					return 3;
				if (_T("dgm") == m_strValue)
					return 4;
				if (_T("dt") == m_strValue)
					return 5;
				if (_T("ftr") == m_strValue)
					return 6;
				if (_T("hdr") == m_strValue)
					return 7;
				if (_T("media") == m_strValue)
					return 8;
				if (_T("obj") == m_strValue)
					return 9;
				if (_T("pic") == m_strValue)
					return 10;
				if (_T("sldImg") == m_strValue)
					return 11;
				if (_T("sldNum") == m_strValue)
					return 12;
				if (_T("subTitle") == m_strValue)
					return 13;
				if (_T("tbl") == m_strValue)
					return 14;
				if (_T("title") == m_strValue)
					return 15;
				return 9;
			}
			virtual void SetBYTECode(const BYTE& src)
			{		
				switch (src)
				{
				case 0:
					m_strValue = _T("body");
					break;
				case 1:
					m_strValue = _T("chart");
					break;
				case 2:
					m_strValue = _T("clipArt");
					break;
				case 3:
					m_strValue = _T("ctrTitle");
					break;
				case 4:
					m_strValue = _T("dgm");
					break;
				case 5:
					m_strValue = _T("dt");
					break;
				case 6:
					m_strValue = _T("ftr");
					break;
				case 7:
					m_strValue = _T("hdr");
					break;
				case 8:
					m_strValue = _T("media");
					break;
				case 9:
					m_strValue = _T("obj");
					break;
				case 10:
					m_strValue = _T("pic");
					break;
				case 11:
					m_strValue = _T("sldImg");
					break;
				case 12:
					m_strValue = _T("sldNum");
					break;
				case 13:
					m_strValue = _T("subTitle");
					break;
				case 14:
					m_strValue = _T("tbl");
					break;
				case 15:
					m_strValue = _T("title");
					break;
				default:
					m_strValue = _T("obj");
					break;
				}
			}
		};
	} 
} 

#endif // PPTX_LIMIT_PLACEHOLDERTYPE_INCLUDE_H_