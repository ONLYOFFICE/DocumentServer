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
#ifndef PPTX_LIMIT_BASE_INCLUDE_H_
#define PPTX_LIMIT_BASE_INCLUDE_H_

#include "../../../Common/DocxFormat/Source/Base/Base.h"

#define _USE_STRING_OPERATOR						\
	virtual void operator=(const CString& value)	\
	{												\
		set(value);									\
	}												\
	virtual void operator=(const BSTR& value)		\
	{												\
		set((CString)value);						\
	}										

namespace PPTX
{
	namespace Limit
	{
		class BaseLimit
		{
		public:
			BaseLimit(const CString& str = _T("")) : m_strValue(str)
			{
			}

			BaseLimit(const BaseLimit& oSrc)
			{
				*this = oSrc;
			}

			BaseLimit& operator=(const BaseLimit& oSrc)
			{
				m_strValue = oSrc.m_strValue;
				return *this;
			}

			void operator=(const CString& str)
			{
				set(str);
			}
			AVSINLINE void _set(const CString& strValue)
			{
				set(strValue);
			}

		public:
			virtual void set(const CString& strValue)		= 0;

			AVSINLINE CString& get() 
			{
				return m_strValue;
			}
			AVSINLINE const CString& get() const 
			{
				return m_strValue;
			}

			virtual BYTE GetBYTECode() const
			{
				return 0;
			}
			virtual void SetBYTECode(const BYTE& src)
			{				
			}

		protected:
			CString m_strValue;
		};
	} 
} 

#endif // PPTX_LIMIT_BASE_INCLUDE_H_