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
#ifndef PPTX_LOGIC_GRAPHICEL_INCLUDE_H_
#define PPTX_LOGIC_GRAPHICEL_INCLUDE_H_

#include "./../../WrapperWritingElement.h"
#include "./../../Limit/DgmBuild.h"
#include "./../../Limit/ChartBuild.h"

namespace PPTX
{
	namespace Logic
	{
		class GraphicEl : public WrapperWritingElement
		{
		public:
			PPTX_LOGIC_BASE(GraphicEl)

		public:
			virtual void fromXML(XmlUtils::CXmlNode& node)
			{
				XmlUtils::CXmlNode oNode;
				
				if (node.GetNode(_T("p:chart"), oNode))
				{
					oNode.ReadAttributeBase(L"bldStep", chartBuildStep);
					oNode.ReadAttributeBase(L"seriesIdx", seriesIdx);
					oNode.ReadAttributeBase(L"categoryIdx", categoryIdx);
				}
				else if (node.GetNode(_T("p:dgm"), oNode))
				{
					oNode.ReadAttributeBase(L"bldStep", dgmBuildStep);
					oNode.ReadAttributeBase(L"id", dgmId);
				}
			}

			virtual CString toXML() const
			{
				if (chartBuildStep.IsInit())
				{
					XmlUtils::CAttribute oAttr;
					oAttr.WriteLimitNullable(_T("bldStep"), chartBuildStep);
					oAttr.Write(_T("seriesIdx"), seriesIdx);
					oAttr.Write(_T("categoryIdx"), categoryIdx);

					return XmlUtils::CreateNode(_T("p:graphicEl"), XmlUtils::CreateNode(_T("p:chart"), oAttr));
				}

				XmlUtils::CAttribute oAttr;
				oAttr.Write(_T("id"), dgmId);
				oAttr.WriteLimitNullable(_T("bldStep"), dgmBuildStep);

				return XmlUtils::CreateNode(_T("p:graphicEl"), XmlUtils::CreateNode(_T("p:dgm"), oAttr));
			}
		public:
			
			nullable_string						dgmId;
			nullable_limit<Limit::DgmBuild>		dgmBuildStep;

			
			nullable_limit<Limit::ChartBuild>	chartBuildStep;
			nullable_int						seriesIdx;
			nullable_int						categoryIdx;
		protected:
			virtual void FillParentPointersForChilds(){};
		};
	} 
} 

#endif // PPTX_LOGIC_GRAPHICEL_INCLUDE_H_