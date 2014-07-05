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
#ifndef PPTX_LOGIC_BLDSUB_INCLUDE_H_
#define PPTX_LOGIC_BLDSUB_INCLUDE_H_

#include "./../../WrapperWritingElement.h"
#include "./../../Limit/ChartBuildType.h"
#include "./../../Limit/AnimationDgmBuild.h"

namespace PPTX
{
	namespace Logic
	{
		class BldSub : public WrapperWritingElement
		{
		public:
			PPTX_LOGIC_BASE(BldSub)

		public:
			virtual void fromXML(XmlUtils::CXmlNode& node)
			{
				XmlUtils::CXmlNode oNode;
				if (node.GetNode(_T("a:bldChart"), oNode))
				{
					chart		= true;
					oNode.ReadAttributeBase(L"bld", bldChart);
					oNode.ReadAttributeBase(L"animBg", animBg);
				}
				else if (node.GetNode(_T("a:bldDgm"), oNode))
				{
					chart		= false;
					oNode.ReadAttributeBase(L"bld", bldDgm);
					oNode.ReadAttributeBase(L"rev", rev);
				}
				else
					chart.reset();

				FillParentPointersForChilds();
			}

			virtual CString toXML() const
			{
				if (chart.IsInit())
				{
					if (*chart)
					{
						XmlUtils::CAttribute oAttr;
						oAttr.WriteLimitNullable(_T("bld"), bldChart);
						oAttr.Write(_T("animBg"), animBg);

						return XmlUtils::CreateNode(_T("p:bldSub"), XmlUtils::CreateNode(_T("a:bldChart"), oAttr));
					}

					XmlUtils::CAttribute oAttr;
					oAttr.WriteLimitNullable(_T("bld"), bldDgm);
					oAttr.Write(_T("rev"), rev);

					return XmlUtils::CreateNode(_T("p:bldSub"), XmlUtils::CreateNode(_T("a:bldDgm"), oAttr));
				}
				return _T("<p:bldSub/>");
			}

		public:
			nullable_bool								chart;
			
			nullable_bool								animBg;
			nullable_limit<Limit::ChartBuildType>		bldChart;
			
			nullable_limit<Limit::AnimationDgmBuild>	bldDgm;
			nullable_bool								rev;
		protected:
			virtual void FillParentPointersForChilds(){};
		};
	} 
} 

#endif // PPTX_LOGIC_BLDSUB_INCLUDE_H_