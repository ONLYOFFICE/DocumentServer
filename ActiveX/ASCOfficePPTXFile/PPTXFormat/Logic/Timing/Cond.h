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
#ifndef PPTX_LOGIC_COND_INCLUDE_H_
#define PPTX_LOGIC_COND_INCLUDE_H_

#include "./../../WrapperWritingElement.h"
#include "./../../Limit/TLTriggerEvent.h"
#include "./../../Limit/TLRuntimeTrigger.h"
#include "TgtEl.h"

namespace PPTX
{
	namespace Logic
	{
		class Cond : public WrapperWritingElement
		{
		public:
			PPTX_LOGIC_BASE(Cond)

		public:
			virtual void fromXML(XmlUtils::CXmlNode& node)
			{
				name	= XmlUtils::GetNameNoNS(node.GetName());
		
				node.ReadAttributeBase(L"delay", delay);
				node.ReadAttributeBase(L"evt", evt);

				XmlUtils::CXmlNode oNode;
				if (node.GetNode(_T("p:tn"), oNode))
					oNode.ReadAttributeBase(L"val", tn);
				else if (node.GetNode(_T("p:rtn"), oNode))
					oNode.ReadAttributeBase(L"val", rtn);

				tgtEl = node.ReadNode(_T("p:tgtEl"));
				
				Normalize();
				FillParentPointersForChilds();
			}

			virtual CString toXML() const
			{
				XmlUtils::CAttribute oAttr;
				oAttr.Write(_T("delay"), delay);
				oAttr.WriteLimitNullable(_T("evt"), evt);

				XmlUtils::CNodeValue oValue;
				oValue.WriteNullable(tgtEl);

				if (tn.IsInit())
				{
					XmlUtils::CAttribute oAttr1;
					oAttr1.Write(_T("val"), tn);

					return XmlUtils::CreateNode(_T("p:") + name, oAttr, oValue.m_strValue + XmlUtils::CreateNode(_T("p:tn"), oAttr1));
				}
				else if (rtn.IsInit())
				{
					XmlUtils::CAttribute oAttr1;
					oAttr1.WriteLimitNullable(_T("val"), rtn);

					return XmlUtils::CreateNode(_T("p:") + name, oAttr, oValue.m_strValue + XmlUtils::CreateNode(_T("p:rtn"), oAttr1));
				}

				return XmlUtils::CreateNode(_T("p:") + name, oAttr, oValue);
			}

		public:
			CString									name;

			nullable_limit<Limit::TLRuntimeTrigger> rtn;
			nullable<TgtEl>							tgtEl;
			nullable_int							tn;

			nullable_string							delay;
			nullable_limit<Limit::TLTriggerEvent>	evt;
		protected:
			virtual void FillParentPointersForChilds()
			{
				if(tgtEl.IsInit())
					tgtEl->SetParentPointer(this);
			}

			AVSINLINE void Normalize()
			{
				tn.normalize_positive();
			}
		};
	} 
} 

#endif // PPTX_LOGIC_COND_INCLUDE_H