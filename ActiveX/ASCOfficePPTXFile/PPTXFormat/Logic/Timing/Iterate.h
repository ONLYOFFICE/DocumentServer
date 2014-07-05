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
#ifndef PPTX_LOGIC_ITERATE_INCLUDE_H_
#define PPTX_LOGIC_ITERATE_INCLUDE_H_

#include "./../../WrapperWritingElement.h"
#include "./../../Limit/IterateType.h"

namespace PPTX
{
	namespace Logic
	{
		class Iterate : public WrapperWritingElement
		{
		public:
			PPTX_LOGIC_BASE(Iterate)

		public:
			virtual void fromXML(XmlUtils::CXmlNode& node)
			{
				node.ReadAttributeBase(L"type", type);
				node.ReadAttributeBase(L"backwards", backwards);

				XmlUtils::CXmlNode oNode;			
				if (node.GetNode(_T("p:tmAbs"), oNode))
					oNode.ReadAttributeBase(L"val", tmAbs);
				else if (node.GetNode(_T("p:tmPct"), oNode))
					oNode.ReadAttributeBase(L"val", tmPct);

				FillParentPointersForChilds();
			}

			virtual CString toXML() const
			{
				XmlUtils::CAttribute oAttr;
				oAttr.WriteLimitNullable(_T("type"), type);
				oAttr.Write(_T("backwards"), backwards);
				
				if (tmAbs.IsInit())
				{
					XmlUtils::CAttribute oAttr1;
					oAttr1.Write(_T("val"), tmAbs);
					return XmlUtils::CreateNode(_T("p:iterate"), oAttr, XmlUtils::CreateNode(_T("p:tmAbs"), oAttr1));
				}
				else if (tmPct.IsInit())
				{
					XmlUtils::CAttribute oAttr1;
					oAttr1.Write(_T("val"), tmPct);
					return XmlUtils::CreateNode(_T("p:iterate"), oAttr, XmlUtils::CreateNode(_T("p:tmPct"), oAttr1));
				}

				return XmlUtils::CreateNode(_T("p:iterate"), oAttr);
			}

		public:
			nullable_limit<Limit::IterateType>		type;
			nullable_bool							backwards;

			nullable_string							tmAbs;
			nullable_int							tmPct;
		protected:
			virtual void FillParentPointersForChilds(){};
		};
	} 
} 

#endif // PPTX_LOGIC_ITERATE_INCLUDE_H