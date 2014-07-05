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
#ifndef PPTX_LOGIC_BLDP_INCLUDE_H_
#define PPTX_LOGIC_BLDP_INCLUDE_H_

#include "./../../WrapperWritingElement.h"
#include "./../../Limit/ParaBuildType.h"
#include "TmplLst.h"

namespace PPTX
{
	namespace Logic
	{
		class BldP : public WrapperWritingElement
		{
		public:
			PPTX_LOGIC_BASE(BldP)

		public:
			virtual void fromXML(XmlUtils::CXmlNode& node)
			{
				tmplLst				= node.ReadNode(_T("p:tmplLst"));

				spid				= node.GetAttribute(_T("spid"));
				grpId				= node.ReadAttributeInt(L"grpId");
				node.ReadAttributeBase(L"uiExpand", uiExpand);
				node.ReadAttributeBase(L"build", build);
				node.ReadAttributeBase(L"bldLvl", bldLvl);
				node.ReadAttributeBase(L"animBg", animBg);
				node.ReadAttributeBase(L"autoUpdateAnimBg", autoUpdateAnimBg);
				node.ReadAttributeBase(L"rev", rev);
				node.ReadAttributeBase(L"advAuto", advAuto);

				Normalize();

				FillParentPointersForChilds();
			}

			virtual CString toXML() const
			{
				XmlUtils::CAttribute oAttr;
				oAttr.Write(_T("spid"), spid);
				oAttr.Write(_T("grpId"), grpId);
				oAttr.Write(_T("uiExpand"), uiExpand);
				oAttr.WriteLimitNullable(_T("build"), build);
				oAttr.Write(_T("bldLvl"), bldLvl);
				oAttr.Write(_T("animBg"), animBg);
				oAttr.Write(_T("autoUpdateAnimBg"), autoUpdateAnimBg);
				oAttr.Write(_T("rev"), rev);
				oAttr.Write(_T("advAuto"), advAuto);
				oAttr.Write(_T("spid"), spid);

				XmlUtils::CNodeValue oValue;
				oValue.WriteNullable(tmplLst);

				return XmlUtils::CreateNode(_T("p:bldP"), oAttr, oValue);
			}

		public:
			nullable<TmplLst>						tmplLst;

			CString									spid;
			int										grpId;
			nullable_bool							uiExpand;
			nullable_limit<Limit::ParaBuildType>	build;
			nullable_int							bldLvl;
			nullable_bool							animBg;
			nullable_bool							autoUpdateAnimBg;
			nullable_bool							rev;
			nullable_string							advAuto;
		protected:
			virtual void FillParentPointersForChilds()
			{
				if(tmplLst.IsInit())
					tmplLst->SetParentPointer(this);
			}

			AVSINLINE void Normalize()
			{
				if (grpId < 0)
					grpId = 0;

				if (bldLvl.IsInit())
					if (*bldLvl < 0)
						*bldLvl = 0;
			}
		};
	} 
} 

#endif // PPTX_LOGIC_BLDP_INCLUDE_H