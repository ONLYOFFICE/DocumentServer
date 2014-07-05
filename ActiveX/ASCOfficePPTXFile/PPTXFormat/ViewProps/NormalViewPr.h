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
#ifndef PPTX_VIEWPROPS_NORMAL_VIEW_PROPERTIES_INCLUDE_H_
#define PPTX_VIEWPROPS_NORMAL_VIEW_PROPERTIES_INCLUDE_H_

#include "./../WrapperWritingElement.h"
#include "Restored.h"
#include "./../Limit/SplitterBarState.h"

namespace PPTX
{
	namespace nsViewProps
	{
		class NormalViewPr : public WrapperWritingElement
		{
		public:
			PPTX_LOGIC_BASE(NormalViewPr)

		public:
			virtual void fromXML(XmlUtils::CXmlNode& node)
			{
				node.ReadAttributeBase(L"horzBarState", attrHorzBarState);
				node.ReadAttributeBase(L"vertBarState", attrVertBarState);

				node.ReadAttributeBase(L"preferSingleView", attrPreferSingleView);
				node.ReadAttributeBase(L"showOutlineIcons", attrShowOutlineIcons);
				node.ReadAttributeBase(L"snapVertSplitter", attrSnapVertSplitter);

				restoredLeft	= node.ReadNodeNoNS(_T("restoredLeft"));
				restoredTop		= node.ReadNodeNoNS(_T("restoredTop"));

				FillParentPointersForChilds();
			}
			virtual CString toXML() const
			{
				XmlUtils::CAttribute oAttr;
				oAttr.Write(_T("horzBarState"), attrHorzBarState->get());
				oAttr.Write(_T("vertBarState"), attrVertBarState->get());

				oAttr.Write(_T("preferSingleView"), attrPreferSingleView);
				oAttr.Write(_T("showOutlineIcons"), attrShowOutlineIcons);
				oAttr.Write(_T("snapVertSplitter"), attrSnapVertSplitter);

				XmlUtils::CNodeValue oValue;
				oValue.Write(restoredTop);
				oValue.Write(restoredLeft);

				return XmlUtils::CreateNode(_T("p:normalViewPr"), oAttr, oValue);
			}
			virtual void toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const
			{
				pWriter->StartNode(_T("p:normalViewPr"));

				pWriter->StartAttributes();

				pWriter->WriteAttribute(_T("horzBarState"), attrHorzBarState);
				pWriter->WriteAttribute(_T("vertBarState"), attrVertBarState);
				pWriter->WriteAttribute(_T("preferSingleView"), attrPreferSingleView);
				pWriter->WriteAttribute(_T("showOutlineIcons"), attrShowOutlineIcons);
				pWriter->WriteAttribute(_T("snapVertSplitter"), attrSnapVertSplitter);

				pWriter->EndAttributes();

				pWriter->StartNode(_T("p:restoredLeft"));
				pWriter->StartAttributes();
				pWriter->WriteAttribute(_T("sz"), restoredLeft.sz);
				pWriter->WriteAttribute(_T("autoAdjust"), restoredLeft.autoAdjust);
				pWriter->EndAttributes();
				pWriter->EndNode(_T("p:restoredLeft"));

				pWriter->StartNode(_T("p:restoredTop"));
				pWriter->StartAttributes();
				pWriter->WriteAttribute(_T("sz"), restoredTop.sz);
				pWriter->WriteAttribute(_T("autoAdjust"), restoredTop.autoAdjust);
				pWriter->EndAttributes();
				pWriter->EndNode(_T("p:restoredTop"));

				pWriter->EndNode(_T("p:normalViewPr"));
			}

			virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
			{
				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeStart);
				pWriter->WriteBool2(0, attrPreferSingleView);
				pWriter->WriteBool2(1, attrShowOutlineIcons);
				pWriter->WriteBool2(2, attrSnapVertSplitter);
				pWriter->WriteLimit2(3, attrHorzBarState);
				pWriter->WriteLimit2(4, attrVertBarState);
				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeEnd);

				pWriter->WriteRecord1(0, restoredLeft);
				pWriter->WriteRecord1(1, restoredTop);
			}

		public:
			nsViewProps::Restored					restoredLeft;
			nsViewProps::Restored					restoredTop;

			nullable_limit<Limit::SplitterBarState> attrHorzBarState;
			nullable_limit<Limit::SplitterBarState> attrVertBarState;
			nullable_bool							attrPreferSingleView;
			nullable_bool							attrShowOutlineIcons;
			nullable_bool							attrSnapVertSplitter;
		protected:
			virtual void FillParentPointersForChilds()
			{
				restoredLeft.SetParentPointer(this);
				restoredTop.SetParentPointer(this);
			}
		};
	} 
} 

#endif // PPTX_VIEWPROPS_NORMAL_VIEW_PROPERTIES_INCLUDE_H_