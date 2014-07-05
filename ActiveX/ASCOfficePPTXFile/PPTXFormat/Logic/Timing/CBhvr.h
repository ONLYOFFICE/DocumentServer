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
#ifndef PPTX_LOGIC_CBHVR_INCLUDE_H_
#define PPTX_LOGIC_CBHVR_INCLUDE_H_

#include "./../../WrapperWritingElement.h"
#include "CTn.h"
#include "AttrNameLst.h"
#include "TgtEl.h"
#include "./../../Limit/TLAccumulate.h"
#include "./../../Limit/TLAdditive.h"
#include "./../../Limit/TLOverride.h"
#include "./../../Limit/TLTransform.h"

namespace PPTX
{
	namespace Logic
	{
		class CBhvr : public WrapperWritingElement
		{
		public:
			PPTX_LOGIC_BASE(CBhvr)

		public:
			virtual void fromXML(XmlUtils::CXmlNode& node)
			{
				node.ReadAttributeBase(L"accumulate", accumulate);
				node.ReadAttributeBase(L"additive", additive);
				node.ReadAttributeBase(L"by", by);
				node.ReadAttributeBase(L"from", from);
				node.ReadAttributeBase(L"override", override_);
				node.ReadAttributeBase(L"rctx", rctx);
				node.ReadAttributeBase(L"to", to);
				node.ReadAttributeBase(L"xfrmType", xfrmType);

				cTn			= node.ReadNode(_T("p:cTn"));
				tgtEl		= node.ReadNode(_T("p:tgtEl"));
				attrNameLst = node.ReadNode(_T("p:attrNameLst"));

				FillParentPointersForChilds();
			}

			CString toXML() const
			{
				XmlUtils::CAttribute oAttr;
				oAttr.WriteLimitNullable(_T("accumulate"), accumulate);
				oAttr.WriteLimitNullable(_T("additive"), additive);
				oAttr.Write(_T("by"), by);
				oAttr.Write(_T("from"), from);
				oAttr.WriteLimitNullable(_T("override"), override_);
				oAttr.Write(_T("rctx"), rctx);
				oAttr.Write(_T("to"), to);
				oAttr.WriteLimitNullable(_T("xfrmType"), xfrmType);

				XmlUtils::CNodeValue oValue;
				oValue.Write(cTn);
				oValue.Write(tgtEl);
				oValue.WriteNullable(attrNameLst);

				return XmlUtils::CreateNode(_T("p:cBhvr"), oAttr, oValue);
			}

		public:
			CTn						cTn;
			TgtEl					tgtEl;
			nullable<AttrNameLst>	attrNameLst;

			nullable_limit<Limit::TLAccumulate>		accumulate; 
			nullable_limit<Limit::TLAdditive>		additive;	
			nullable_string							by;			
			nullable_string							from;		
			nullable_limit<Limit::TLOverride>		override_;	
			nullable_string							rctx;		
			nullable_string							to;			
			nullable_limit<Limit::TLTransform>		xfrmType;	
		protected:
			virtual void FillParentPointersForChilds()
			{
				cTn.SetParentPointer(this);
				tgtEl.SetParentPointer(this);
				if(attrNameLst.IsInit())
					attrNameLst->SetParentPointer(this);
			}
		};
	} 
} 

#endif // PPTX_LOGIC_CBHVR_INCLUDE_H