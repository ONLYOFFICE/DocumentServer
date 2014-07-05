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
#ifndef PPTX_LOGIC_ANIMCLR_INCLUDE_H_
#define PPTX_LOGIC_ANIMCLR_INCLUDE_H_

#include "./../../WrapperWritingElement.h"
#include "CBhvr.h"
#include "./../UniColor.h"
#include "./../../Limit/TLColorSpace.h"
#include "./../../Limit/TLColorDirection.h"

namespace PPTX
{
	namespace Logic
	{
		class AnimClr : public WrapperWritingElement
		{
		public:
			PPTX_LOGIC_BASE(AnimClr)

		public:
			virtual void fromXML(XmlUtils::CXmlNode& node)
			{
				node.ReadAttributeBase(L"clrSpc", clrSpc);
				node.ReadAttributeBase(L"dir", dir);

				cBhvr	= node.ReadNode(_T("cBhvr"));

				XmlUtils::CXmlNode oNodeFrom;
				if (node.GetNode(_T("p:from"), oNodeFrom))
					from.GetColorFrom(oNodeFrom);

				XmlUtils::CXmlNode oNodeTo;
				if (node.GetNode(_T("p:to"), oNodeTo))
					to.GetColorFrom(oNodeTo);

				XmlUtils::CXmlNode oNodeBy;
				if (node.GetNode(_T("p:by"), oNodeBy))
				{
					XmlUtils::CXmlNode oRGB;
					XmlUtils::CXmlNode oHSL;
					if (oNodeBy.GetNode(_T("p:rgb"), oRGB))
					{
						oRGB.ReadAttributeBase(L"r", byR);
						oRGB.ReadAttributeBase(L"g", byG);
						oRGB.ReadAttributeBase(L"b", byB);
					}
					else if (oNodeBy.GetNode(_T("p:hsl"), oRGB))
					{
						oHSL.ReadAttributeBase(L"h", byH);
						oHSL.ReadAttributeBase(L"s", byS);
						oHSL.ReadAttributeBase(L"l", byL);
					}
				}

				FillParentPointersForChilds();
			}

			virtual CString toXML() const
			{
				XmlUtils::CAttribute oAttr;
				oAttr.WriteLimitNullable(_T("clrSpc"), clrSpc);
				oAttr.WriteLimitNullable(_T("dir"), dir);

				XmlUtils::CNodeValue oValue;
				oValue.Write(cBhvr);

				if (byR.IsInit() && byG.IsInit() && byB.IsInit())
				{
					XmlUtils::CAttribute oAttr1;
					oAttr1.Write(_T("r"), byR);
					oAttr1.Write(_T("g"), byG);
					oAttr1.Write(_T("b"), byB);

					oValue.m_strValue += (_T("<p:by>") + XmlUtils::CreateNode(_T("p:rgb"), oAttr1) + _T("</p:by>"));
				}
				else if (byH.IsInit() && byS.IsInit() && byL.IsInit())
				{
					XmlUtils::CAttribute oAttr1;
					oAttr1.Write(_T("h"), byH);
					oAttr1.Write(_T("s"), byS);
					oAttr1.Write(_T("l"), byL);

					oValue.m_strValue += (_T("<p:by>") + XmlUtils::CreateNode(_T("p:hsl"), oAttr1) + _T("</p:by>"));
				}

				if (from.is_init())
					oValue.m_strValue += XmlUtils::CreateNode(_T("p:from"), from.toXML());
				if (to.is_init())
					oValue.m_strValue += XmlUtils::CreateNode(_T("p:to"), to.toXML());

				return XmlUtils::CreateNode(_T("p:animClr"), oAttr, oValue);
			}

		public:
			CBhvr			cBhvr;

			nullable_int	byR;
			nullable_int	byG;
			nullable_int	byB;
			nullable_int	byH;
			nullable_int	byS;
			nullable_int	byL;
			UniColor		from;
			UniColor		to;

			nullable_limit<Limit::TLColorSpace>		clrSpc; 
			nullable_limit<Limit::TLColorDirection> dir;	
		protected:
			virtual void FillParentPointersForChilds()
			{
				cBhvr.SetParentPointer(this);
				from.SetParentPointer(this);
				to.SetParentPointer(this);
			}
		};
	} 
} 

#endif // PPTX_LOGIC_ANIMCLR_INCLUDE_H