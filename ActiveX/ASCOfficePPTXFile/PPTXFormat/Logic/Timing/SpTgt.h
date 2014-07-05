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
#ifndef PPTX_LOGIC_SPTGT_INCLUDE_H_
#define PPTX_LOGIC_SPTGT_INCLUDE_H_

#include "./../../WrapperWritingElement.h"
#include "TxEl.h"
#include "GraphicEl.h"
#include "./../../Limit/TLChartSubElement.h"

namespace PPTX
{
	namespace Logic
	{
		class SpTgt : public WrapperWritingElement
		{
		public:
			PPTX_LOGIC_BASE(SpTgt)

		public:
			virtual void fromXML(XmlUtils::CXmlNode& node)
			{
				spid	= node.GetAttribute(_T("spid"));

				XmlUtils::CXmlNode oNode;
				bg		= (TRUE == node.GetNode(_T("p:bg"), oNode)) ? true : false;

				XmlUtils::CXmlNode oNodeMem;
				if (node.GetNode(_T("p:subSp"), oNodeMem))
				{
					oNodeMem.ReadAttributeBase(L"spid", subSpid);
				}
				else if (node.GetNode(_T("p:oleChartEl"), oNodeMem))
				{
					oNodeMem.ReadAttributeBase(L"type", type);
					oNodeMem.ReadAttributeBase(L"lvl", lvl);
				}
				else
				{
					txEl		= node.ReadNode(_T("p:txEl"));
					graphicEl	= node.ReadNode(_T("p:graphicEl"));
				}

				Normalize();

				FillParentPointersForChilds();
			}

			virtual CString toXML() const
			{
				XmlUtils::CAttribute oAttr;
				oAttr.Write(_T("spid"), spid);
				
				if (bg)
				{
					return XmlUtils::CreateNode(_T("p:spTgt"), oAttr, _T("<p:bg/>"));
				}
				if (subSpid.IsInit())
				{
					XmlUtils::CAttribute oAttr2;
					oAttr2.Write(_T("spid"), subSpid);

					return XmlUtils::CreateNode(_T("p:spTgt"), oAttr, XmlUtils::CreateNode(_T("p:subSp"), oAttr2));
				}
				if (type.IsInit())
				{
					XmlUtils::CAttribute oAttr2;
					oAttr2.WriteLimitNullable(_T("type"), type);
					oAttr2.Write(_T("lvl"), lvl);

					return XmlUtils::CreateNode(_T("p:spTgt"), oAttr, XmlUtils::CreateNode(_T("p:oleChartEl"), oAttr2));
				}
				if (txEl.IsInit())
				{
					return XmlUtils::CreateNode(_T("p:spTgt"), oAttr, txEl->toXML());
				}
				if (graphicEl.IsInit())
				{
					return XmlUtils::CreateNode(_T("p:spTgt"), oAttr, graphicEl->toXML());
				}
				return XmlUtils::CreateNode(_T("p:spTgt"), oAttr);
			}
		public:
			CString										spid;

			bool										bg;
			nullable_string								subSpid;

			
			nullable_limit<Limit::TLChartSubElement>	type;
			nullable_int								lvl;

			nullable<TxEl>								txEl;
			nullable<GraphicEl>							graphicEl;
		protected:
			virtual void FillParentPointersForChilds()
			{
				if (txEl.IsInit())
					txEl->SetParentPointer(this);
				if (graphicEl.IsInit())
					graphicEl->SetParentPointer(this);
			}

			AVSINLINE void Normalize()
			{
				lvl.normalize_positive();
			}
		};
	} 
} 

#endif // PPTX_LOGIC_SPTGT_INCLUDE_H_