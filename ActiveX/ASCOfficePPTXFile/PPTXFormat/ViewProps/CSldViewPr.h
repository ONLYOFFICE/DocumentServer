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
#ifndef PPTX_VIEWPROPS_COMMON_SLIDE_VIEW_PROPERTIES_INCLUDE_H_
#define PPTX_VIEWPROPS_COMMON_SLIDE_VIEW_PROPERTIES_INCLUDE_H_

#include "./../WrapperWritingElement.h"
#include "CViewPr.h"
#include "Guide.h"

namespace PPTX
{
	namespace nsViewProps
	{
		class CSldViewPr : public WrapperWritingElement
		{
		public:
			PPTX_LOGIC_BASE(CSldViewPr)

			CSldViewPr& operator=(const CSldViewPr& oSrc)
			{
				parentFile		= oSrc.parentFile;
				parentElement	= oSrc.parentElement;

				CViewPr				= oSrc.CViewPr;
				attrShowGuides		= oSrc.attrShowGuides;
				attrSnapToGrid		= oSrc.attrSnapToGrid;
				attrSnapToObjects	= oSrc.attrSnapToObjects;
				
				GuideLst.Copy(oSrc.GuideLst);

				return *this;
			}

		public:
			virtual void fromXML(XmlUtils::CXmlNode& node)
			{
				GuideLst.RemoveAll();

				CViewPr = node.ReadNode(_T("p:cViewPr"));

				node.ReadNode(_T("p:guideLst")).LoadArray(_T("p:guide"), GuideLst);

				node.ReadAttributeBase(L"showGuides", attrShowGuides);
				node.ReadAttributeBase(L"snapToGrid", attrSnapToGrid);
				node.ReadAttributeBase(L"snapToObjects", attrSnapToObjects);

				FillParentPointersForChilds();
			}
			virtual CString toXML() const
			{
				XmlUtils::CAttribute oAttr;
				oAttr.Write(_T("showGuides"), attrShowGuides);
				oAttr.Write(_T("snapToGrid"), attrSnapToGrid);
				oAttr.Write(_T("snapToObjects"), attrSnapToObjects);

				XmlUtils::CNodeValue oValue;
				oValue.Write(CViewPr);
				oValue.WriteArray(_T("p:guideLst"), GuideLst);

				return XmlUtils::CreateNode(_T("p:cSldViewPr"), oAttr, oValue);
			}

			virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
			{
				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeStart);
				pWriter->WriteBool2(0, attrShowGuides);
				pWriter->WriteBool2(1, attrSnapToGrid);
				pWriter->WriteBool2(2, attrSnapToObjects);
				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeEnd);

				pWriter->WriteRecord1(0, CViewPr);

				pWriter->StartRecord(1);
				ULONG len = (ULONG)GuideLst.GetCount();
				pWriter->WriteULONG(len);
				for (ULONG i = 0; i < len; i++)
				{
					pWriter->WriteRecord1(2, GuideLst[i]);
				}
				pWriter->EndRecord();
			}
			virtual void toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const
			{
				pWriter->StartNode(_T("p:cSldViewPr"));

				pWriter->StartAttributes();

				pWriter->WriteAttribute(_T("showGuides"), attrShowGuides);
				pWriter->WriteAttribute(_T("snapToGrid"), attrSnapToGrid);
				pWriter->WriteAttribute(_T("snapToObjects"), attrSnapToObjects);

				pWriter->EndAttributes();

				CViewPr.toXmlWriter(pWriter);
				pWriter->WriteArray(_T("p:guideLst"), GuideLst);	

				pWriter->EndNode(_T("p:cSldViewPr"));
			}

		public:
			nsViewProps::CViewPr	CViewPr;
			CAtlArray<Guide>		GuideLst;

			nullable_bool			attrShowGuides;
			nullable_bool			attrSnapToGrid;
			nullable_bool			attrSnapToObjects;
		protected:
			virtual void FillParentPointersForChilds()
			{
				CViewPr.SetParentPointer(this);

				size_t count = GuideLst.GetCount();
				for (size_t i = 0; i < count; ++i)
					GuideLst[i].SetParentPointer(this);
			}
		};
	} 
} 

#endif // PPTX_VIEWPROPS_COMMON_SLIDE_VIEW_PROPERTIES_INCLUDE_H_