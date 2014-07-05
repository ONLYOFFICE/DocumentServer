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
#ifndef PPTX_LIMIT_BEVELTYPE_INCLUDE_H_
#define PPTX_LIMIT_BEVELTYPE_INCLUDE_H_

#include "BaseLimit.h"

namespace PPTX
{
	namespace Limit
	{
		class BevelType : public BaseLimit
		{
		public:
			BevelType()
			{
				m_strValue = _T("circle");
			}

			_USE_STRING_OPERATOR
			
			virtual void set(const CString& strValue)
			{
				if ((_T("angle")		== strValue) ||
					(_T("artDeco")		== strValue) ||
					(_T("circle")		== strValue) ||
					(_T("convex")		== strValue) ||
					(_T("coolSlant")	== strValue) ||
					(_T("cross")		== strValue) ||
					(_T("divot")		== strValue) ||
					(_T("hardEdge")		== strValue) ||
					(_T("relaxedInset") == strValue) ||
					(_T("riblet")		== strValue) ||
					(_T("slope")		== strValue) ||
					(_T("softRound")	== strValue))
				{
					m_strValue = strValue;
				}
			}

			virtual BYTE GetBYTECode() const
			{
				if (_T("angle") == m_strValue)
					return 0;
				if (_T("artDeco") == m_strValue)
					return 1;
				if (_T("circle") == m_strValue)
					return 2;
				if (_T("convex") == m_strValue)
					return 3;
				if (_T("coolSlant") == m_strValue)
					return 4;
				if (_T("cross") == m_strValue)
					return 5;
				if (_T("divot") == m_strValue)
					return 6;
				if (_T("hardEdge") == m_strValue)
					return 7;
				if (_T("relaxedInset") == m_strValue)
					return 8;
				if (_T("riblet") == m_strValue)
					return 9;
				if (_T("slope") == m_strValue)
					return 10;
				if (_T("softRound") == m_strValue)
					return 11;
				return 0;
			}
		};
	} 
} 

#endif // PPTX_LIMIT_BEVELTYPE_INCLUDE_H_