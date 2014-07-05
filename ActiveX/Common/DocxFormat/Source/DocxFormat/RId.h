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
#ifndef OOX_RID_INCLUDE_H_
#define OOX_RID_INCLUDE_H_

#include "../Base/Base.h"
#include "../XML/XmlUtils.h"

namespace OOX
{
	class RId
	{
	public:
		RId() : m_id(0)
		{
		}
		RId(const size_t id) : m_id(id)
		{
		}
		RId(const CString& rid)
		{
			(*this) = rid;
		}
		RId(const RId& oSrc)
		{
			(*this) = oSrc;
		}

	public:
		
		
		
		
		
		const RId& operator= (const CString& rid)
		{
			
			
			CString sFindString(_T("rId"));
			int nFindStringLength = sFindString.GetLength();
			if(0 == rid.Find(sFindString) && rid.GetLength() > nFindStringLength && 0 != isdigit(rid[nFindStringLength]))
			{
				CString strParam = rid.Mid(nFindStringLength);
				m_id = XmlUtils::GetUInteger(strParam.GetBuffer());
			}
			else
			{
				m_id = 0;
				m_sId = rid;
			}
			
			return *this;
		}
		const RId& operator= (const BSTR& rid)
		{
			(*this) = (CString)rid;
			
			return *this;
		}
		const RId& operator= (const RId& oSrc)
		{
			m_id = oSrc.m_id;
			m_sId = oSrc.m_sId;
			return *this;
		}

	public:
		const bool operator ==(const RId& lhs) const
		{
			return m_id == lhs.m_id && m_sId == lhs.m_sId;
		}
		const bool operator !=(const RId& lhs) const
		{
			return !operator ==(lhs);
		}
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		

		AVSINLINE CString get() const 
		{
			return ToString();
		}
		AVSINLINE size_t getNumber() const { return m_id; }
	public:
		const RId	next() const
		{
			return RId(m_id + 1);
		}
		
	public:
		const CString ToString() const
		{
			if(!m_sId.IsEmpty())
				return m_sId;
			else
				return _T("rId") + XmlUtils::UIntToString(m_id);
		}

	private:
		size_t m_id;
		CString m_sId;
	};
} 

#endif // OOX_RID_INCLUDE_H_