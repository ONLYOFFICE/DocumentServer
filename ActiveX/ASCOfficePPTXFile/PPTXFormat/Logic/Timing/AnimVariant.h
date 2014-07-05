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
#ifndef PPTX_LOGIC_ANIMVARIANT_INCLUDE_H_
#define PPTX_LOGIC_ANIMVARIANT_INCLUDE_H_

#include "./../../WrapperWritingElement.h"
#include "./../UniColor.h"

namespace PPTX
{
	namespace Logic
	{
		class AnimVariant : public WrapperWritingElement
		{
		public:
			PPTX_LOGIC_BASE(AnimVariant)

		public:
			virtual void fromXML(XmlUtils::CXmlNode& node)
			{
				name	= XmlUtils::GetNameNoNS(node.GetName());

				XmlUtils::CXmlNode oNode;

				if (node.GetNode(_T("p:boolVal"), oNode))
					oNode.ReadAttributeBase(L"val", boolVal);
				else if (node.GetNode(_T("p:intVal"), oNode))
					oNode.ReadAttributeBase(L"val", intVal);
				else if (node.GetNode(_T("p:fltVal"), oNode))
					oNode.ReadAttributeBase(L"val", fltVal);
				else if (node.GetNode(_T("p:clrVal"), oNode))
					clrVal.GetColorFrom(oNode);
				else if (node.GetNode(_T("p:strVal"), oNode))
					oNode.ReadAttributeBase(L"val", strVal);

				FillParentPointersForChilds();
			}

			virtual CString toXML() const
			{
				XmlUtils::CNodeValue oValue;

				if (strVal.IsInit())
				{
					XmlUtils::CAttribute oAttr;
					oAttr.Write(_T("val"), strVal);
					oValue.m_strValue += XmlUtils::CreateNode(_T("p:strVal"), oAttr);
				}
				if (boolVal.IsInit())
				{
					XmlUtils::CAttribute oAttr;
					oAttr.Write(_T("val"), boolVal);
					oValue.m_strValue += XmlUtils::CreateNode(_T("p:boolVal"), oAttr);
				}
				if (intVal.IsInit())
				{
					XmlUtils::CAttribute oAttr;
					oAttr.Write(_T("val"), intVal);
					oValue.m_strValue += XmlUtils::CreateNode(_T("p:intVal"), oAttr);
				}
				if (fltVal.IsInit())
				{
					XmlUtils::CAttribute oAttr;
					oAttr.Write(_T("val"), fltVal);
					oValue.m_strValue += XmlUtils::CreateNode(_T("p:fltVal"), oAttr);
				}
				if (clrVal.is_init())
				{
					oValue.m_strValue += (_T("<p:clrVal>") + clrVal.toXML() + _T("</p:clrVal>"));
				}
				
				return XmlUtils::CreateNode(_T("p:") + name, oValue);
			}
		public:
			CString				name;

			nullable_bool		boolVal;
			nullable_string		strVal;
			nullable_int		intVal;
			nullable_double		fltVal;

			UniColor			clrVal;
		protected:
			virtual void FillParentPointersForChilds()
			{
				clrVal.SetParentPointer(this);
			}
		};
	} 
} 

#endif // PPTX_LOGIC_ANIMVARIANT_INCLUDE_H_