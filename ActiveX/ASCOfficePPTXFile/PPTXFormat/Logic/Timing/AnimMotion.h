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
#ifndef PPTX_LOGIC_ANIMMOTION_INCLUDE_H_
#define PPTX_LOGIC_ANIMMOTION_INCLUDE_H_

#include "./../../WrapperWritingElement.h"
#include "CBhvr.h"
#include "./../../Limit/TLOrigin.h"
#include "./../../Limit/TLPathEditMode.h"

namespace PPTX
{
	namespace Logic
	{
		class AnimMotion : public WrapperWritingElement
		{
		public:
			PPTX_LOGIC_BASE(AnimMotion)

		public:
			virtual void fromXML(XmlUtils::CXmlNode& node)
			{
				cBhvr = node.ReadNode(_T("p:cBhvr"));
				
				XmlUtils::CXmlNode oNodeBy;
				if (node.GetNode(_T("p:by"), oNodeBy))
				{
					oNodeBy.ReadAttributeBase(L"x", byX);
					oNodeBy.ReadAttributeBase(L"y", byY);
				}
				XmlUtils::CXmlNode oNodeFrom;
				if (node.GetNode(_T("p:from"), oNodeFrom))
				{
					oNodeFrom.ReadAttributeBase(L"x", fromX);
					oNodeFrom.ReadAttributeBase(L"y", fromY);
				}
				XmlUtils::CXmlNode oNodeTo;
				if (node.GetNode(_T("p:to"), oNodeTo))
				{
					oNodeTo.ReadAttributeBase(L"x", toX);
					oNodeTo.ReadAttributeBase(L"y", toY);
				}
				XmlUtils::CXmlNode oNodeCtr;
				if (node.GetNode(_T("p:rCtr"), oNodeCtr))
				{
					oNodeCtr.ReadAttributeBase(L"x", rCtrX);
					oNodeCtr.ReadAttributeBase(L"y", rCtrY);
				}

				node.ReadAttributeBase(L"path", path);
				node.ReadAttributeBase(L"ptsTypes", ptsTypes);
				node.ReadAttributeBase(L"rAng", rAng);
				node.ReadAttributeBase(L"origin", origin);
				node.ReadAttributeBase(L"pathEditMode", pathEditMode);

				FillParentPointersForChilds();
			}

			virtual CString toXML() const
			{
				XmlUtils::CAttribute oAttr;
				oAttr.WriteLimitNullable(_T("origin"), origin);
				oAttr.Write(_T("path"), path);
				oAttr.WriteLimitNullable(_T("pathEditMode"), pathEditMode);
				oAttr.Write(_T("rAng"), rAng);
				oAttr.Write(_T("ptsTypes"), ptsTypes);

				XmlUtils::CNodeValue oValue;
				
				if (byX.IsInit() || byY.IsInit())
				{
					XmlUtils::CAttribute oAttr1;
					oAttr1.Write(_T("x"), byX);
					oAttr1.Write(_T("y"), byY);

					oValue.m_strValue += XmlUtils::CreateNode(_T("p:by"), oAttr1);
				}
				if (fromY.IsInit() || fromY.IsInit())
				{
					XmlUtils::CAttribute oAttr1;
					oAttr1.Write(_T("x"), fromX);
					oAttr1.Write(_T("y"), fromY);

					oValue.m_strValue += XmlUtils::CreateNode(_T("p:from"), oAttr1);
				}
				if (toX.IsInit() || toY.IsInit())
				{
					XmlUtils::CAttribute oAttr1;
					oAttr1.Write(_T("x"), toX);
					oAttr1.Write(_T("y"), toY);

					oValue.m_strValue += XmlUtils::CreateNode(_T("p:to"), oAttr1);
				}
				if (rCtrX.IsInit() || rCtrY.IsInit())
				{
					XmlUtils::CAttribute oAttr1;
					oAttr1.Write(_T("x"), rCtrX);
					oAttr1.Write(_T("y"), rCtrY);

					oValue.m_strValue += XmlUtils::CreateNode(_T("p:rCtr"), oAttr1);
				}
				oValue.Write(cBhvr);

				return XmlUtils::CreateNode(_T("p:animMotion"), oAttr, oValue);
			}

		public:
			CBhvr					cBhvr;

			nullable_int			byX;
			nullable_int			byY;
			nullable_int			fromX;
			nullable_int			fromY;
			nullable_int			toX;
			nullable_int			toY;
			nullable_int			rCtrX;
			nullable_int			rCtrY;

			nullable_limit<Limit::TLOrigin>			origin; 
			nullable_string							path;	
															
															
															
			nullable_limit<Limit::TLPathEditMode>	pathEditMode;	
			nullable_string							ptsTypes;		
																	
																	
																	
			nullable_int			rAng;
		protected:
			virtual void FillParentPointersForChilds()
			{
				cBhvr.SetParentPointer(this);
			}
		};
	} 
} 

#endif // PPTX_LOGIC_ANIMMOTION_INCLUDE_H