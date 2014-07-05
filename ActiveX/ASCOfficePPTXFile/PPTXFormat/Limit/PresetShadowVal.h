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
#ifndef PPTX_LIMIT_PRESETSHADOWVAL_INCLUDE_H_
#define PPTX_LIMIT_PRESETSHADOWVAL_INCLUDE_H_

#include "BaseLimit.h"



namespace PPTX
{
	namespace Limit
	{
		class PresetShadowVal : public BaseLimit
		{
		public:
			PresetShadowVal()
			{
				m_strValue = _T("shdw1");
			}

			_USE_STRING_OPERATOR
				
			virtual void set(const CString& strValue)
			{
				if ((_T("shdw1") == strValue) ||
					(_T("shdw2") == strValue) ||
					(_T("shdw3") == strValue) ||
					(_T("shdw4") == strValue) ||
					(_T("shdw5") == strValue) ||
					(_T("shdw6") == strValue) ||
					(_T("shdw7") == strValue) ||
					(_T("shdw8") == strValue) ||
					(_T("shdw9") == strValue) ||
					(_T("shdw10") == strValue) ||
					(_T("shdw11") == strValue) ||
					(_T("shdw12") == strValue) ||
					(_T("shdw13") == strValue) ||
					(_T("shdw14") == strValue) ||
					(_T("shdw15") == strValue) ||
					(_T("shdw16") == strValue) ||
					(_T("shdw17") == strValue) ||
					(_T("shdw18") == strValue) ||
					(_T("shdw19") == strValue) ||
					(_T("shdw20") == strValue))
				{
					m_strValue = strValue;
				}
			}

			virtual BYTE GetBYTECode() const
			{
				if (_T("shdw1") == m_strValue)
					return 0;
				if (_T("shdw2") == m_strValue)
					return 1;
				if (_T("shdw3") == m_strValue)
					return 2;
				if (_T("shdw4") == m_strValue)
					return 3;
				if (_T("shdw5") == m_strValue)
					return 4;
				if (_T("shdw6") == m_strValue)
					return 5;
				if (_T("shdw7") == m_strValue)
					return 6;
				if (_T("shdw8") == m_strValue)
					return 7;
				if (_T("shdw9") == m_strValue)
					return 8;
				if (_T("shdw10") == m_strValue)
					return 9;
				if (_T("shdw11") == m_strValue)
					return 10;
				if (_T("shdw12") == m_strValue)
					return 11;
				if (_T("shdw13") == m_strValue)
					return 12;
				if (_T("shdw14") == m_strValue)
					return 13;
				if (_T("shdw15") == m_strValue)
					return 14;
				if (_T("shdw16") == m_strValue)
					return 15;
				if (_T("shdw17") == m_strValue)
					return 16;
				if (_T("shdw18") == m_strValue)
					return 17;
				if (_T("shdw19") == m_strValue)
					return 18;
				if (_T("shdw20") == m_strValue)
					return 19;
				
				return 0;
			}
		};
	} 
} 

#endif // PPTX_LIMIT_PRESETSHADOWVAL_INCLUDE_H_