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
#ifndef PPTX_VIEWPROPS_SORTER_VIEW_PROPERTIES_INCLUDE_H_
#define PPTX_VIEWPROPS_SORTER_VIEW_PROPERTIES_INCLUDE_H_

#include "./../WrapperWritingElement.h"
#include "CViewPr.h"

namespace PPTX
{
	namespace nsViewProps
	{
		class SorterViewPr : public WrapperWritingElement
		{
		public:
			PPTX_LOGIC_BASE(SorterViewPr)

		public:
			virtual void fromXML(XmlUtils::CXmlNode& node)
			{
				node.ReadAttributeBase(L"showFormatting", attrShowFormatting);
				CViewPr = node.ReadNode(_T("p:cViewPr"));

				FillParentPointersForChilds();
			}
			virtual CString toXML() const
			{
				XmlUtils::CAttribute oAttr;
				oAttr.Write(_T("showFormatting"), attrShowFormatting);

				XmlUtils::CNodeValue oValue;
				oValue.Write(CViewPr);

				return XmlUtils::CreateNode(_T("p:sorterViewPr"), oAttr, oValue);
			}

			virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
			{
				pWriter->WriteBYTE(g_nodeAttributeStart);
				pWriter->WriteBool2(0, attrShowFormatting);
				pWriter->WriteBYTE(g_nodeAttributeEnd);

				pWriter->WriteRecord1(0, CViewPr);
			}
			virtual void toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const
			{
				pWriter->StartNode(_T("p:sorterViewPr"));

				pWriter->StartAttributes();
				pWriter->WriteAttribute(_T("showFormatting"), attrShowFormatting);
				pWriter->EndAttributes();

				CViewPr.toXmlWriter(pWriter);

				pWriter->EndNode(_T("p:sorterViewPr"));
			}

		public:
			nsViewProps::CViewPr	CViewPr;
			nullable_bool			attrShowFormatting;
		protected:
			virtual void FillParentPointersForChilds()
			{
				CViewPr.SetParentPointer(this);
			}
		};
	} 
} 

#endif // PPTX_VIEWPROPS_SORTER_VIEW_PROPERTIES_INCLUDE_H_