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
#ifndef PPTX_VIEWPROPS_FILE_INCLUDE_H_
#define PPTX_VIEWPROPS_FILE_INCLUDE_H_

#include "WrapperFile.h"
#include "FileContainer.h"

#include "Limit/LastView.h"
#include "ViewProps/GridSpacing.h"
#include "ViewProps/NormalViewPr.h"
#include "ViewProps/NotesTextViewPr.h"
#include "ViewProps/NotesViewPr.h"
#include "ViewProps/OutlineViewPr.h"
#include "ViewProps/SlideViewPr.h"
#include "ViewProps/SorterViewPr.h"

#include "DocxFormat/FileTypes.h"

using namespace NSBinPptxRW;

namespace PPTX
{
	class ViewProps : public WrapperFile, public PPTX::FileContainer
	{
	public:
		ViewProps()
		{
		}
		ViewProps(const OOX::CPath& filename, FileMap& map)
		{
			read(filename, map);
		}
		virtual ~ViewProps()
		{
		}

	public:
		virtual void read(const OOX::CPath& filename, FileMap& map)
		{
			

			XmlUtils::CXmlNode oNode;
			oNode.FromXmlFile2(filename.m_strFilename);

			oNode.ReadAttributeBase(L"lastView", attrLastView);
			oNode.ReadAttributeBase(L"showComments", attrShowComments);

			
			GridSpacing = oNode.ReadNode(_T("p:gridSpacing"));
			if(GridSpacing.is_init())
				GridSpacing->SetParentFilePointer(this);

			NormalViewPr = oNode.ReadNode(_T("normalViewPr"));
			if(NormalViewPr.is_init())
				NormalViewPr->SetParentFilePointer(this);

			NotesTextViewPr = oNode.ReadNode(_T("notesTextViewPr"));
			if(NotesTextViewPr.is_init())
				NotesTextViewPr->SetParentFilePointer(this);

			NotesViewPr = oNode.ReadNode(_T("notesViewPr"));
			if(NotesViewPr.is_init())
				NotesViewPr->SetParentFilePointer(this);

			OutlineViewPr = oNode.ReadNode(_T("outlineViewPr"));
			if(OutlineViewPr.is_init())
				OutlineViewPr->SetParentFilePointer(this);

			SlideViewPr = oNode.ReadNode(_T("slideViewPr"));
			if(SlideViewPr.is_init())
				SlideViewPr->SetParentFilePointer(this);

			SorterViewPr = oNode.ReadNode(_T("sorterViewPr"));
			if(SorterViewPr.is_init())
				SorterViewPr->SetParentFilePointer(this);
		}
		virtual void write(const OOX::CPath& filename, const OOX::CPath& directory, OOX::ContentTypes::File& content)const
		{
			XmlUtils::CAttribute oAttr;
			oAttr.Write(_T("xmlns:a"), OOX::g_Namespaces.a.m_strLink);
			oAttr.Write(_T("xmlns:r"), OOX::g_Namespaces.r.m_strLink);
			oAttr.Write(_T("xmlns:p"), OOX::g_Namespaces.p.m_strLink);
			oAttr.WriteLimitNullable(_T("lastView"), attrLastView);
			oAttr.Write(_T("showComments"), attrShowComments);

			XmlUtils::CNodeValue oValue;
			oValue.WriteNullable(NormalViewPr);
			oValue.WriteNullable(SlideViewPr);
			oValue.WriteNullable(OutlineViewPr);
			oValue.WriteNullable(NotesTextViewPr);
			oValue.WriteNullable(SorterViewPr);
			oValue.WriteNullable(NotesViewPr);
			oValue.WriteNullable(GridSpacing);

			XmlUtils::SaveToFile(filename.m_strFilename, XmlUtils::CreateNode(_T("p:viewPr"), oAttr, oValue));

			content.registration(type().OverrideType(), directory, filename);
			m_written = true;
			m_WrittenFileName = filename.GetFilename();
			FileContainer::write(filename, directory, content);
		}

	public:
		virtual const OOX::FileType type() const
		{
			return OOX::FileTypes::ViewProps;
		}
		virtual const OOX::CPath DefaultDirectory() const
		{
			return type().DefaultDirectory();
		}
		virtual const OOX::CPath DefaultFileName() const
		{
			return type().DefaultFileName();
		}

		virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
		{
			pWriter->StartRecord(NSMainTables::ViewProps);

			pWriter->WriteBYTE(g_nodeAttributeStart);

			pWriter->WriteLimit2(0, attrLastView);
			pWriter->WriteBool2(1, attrShowComments);

			pWriter->WriteBYTE(g_nodeAttributeEnd);

			pWriter->WriteRecord2(0, GridSpacing);
			pWriter->WriteRecord2(1, NormalViewPr);
			pWriter->WriteRecord2(2, NotesTextViewPr);
			pWriter->WriteRecord2(3, NotesViewPr);
			pWriter->WriteRecord2(4, OutlineViewPr);
			pWriter->WriteRecord2(5, SlideViewPr);
			pWriter->WriteRecord2(6, SorterViewPr);

			pWriter->EndRecord();
		}
		virtual void toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const
		{
			pWriter->StartNode(_T("p:viewPr"));

			pWriter->StartAttributes();

			pWriter->WriteAttribute(_T("xmlns:a"), OOX::g_Namespaces.a.m_strLink);
			pWriter->WriteAttribute(_T("xmlns:r"), OOX::g_Namespaces.r.m_strLink);
			pWriter->WriteAttribute(_T("xmlns:p"), OOX::g_Namespaces.p.m_strLink);
			pWriter->WriteAttribute(_T("lastView"), attrLastView);
			pWriter->WriteAttribute(_T("showComments"), attrShowComments);

			pWriter->EndAttributes();

			pWriter->Write(NormalViewPr);
			pWriter->Write(SlideViewPr);
			pWriter->Write(OutlineViewPr);
			pWriter->Write(NotesTextViewPr);
			pWriter->Write(SorterViewPr);
			pWriter->Write(NotesViewPr);
			pWriter->Write(GridSpacing);

			pWriter->EndNode(_T("p:viewPr"));
		}

	public:
		nullable_limit<Limit::LastView>				attrLastView;
		nullable_bool								attrShowComments;

		nullable<nsViewProps::GridSpacing>			GridSpacing;
		nullable<nsViewProps::NormalViewPr>			NormalViewPr;
		nullable<nsViewProps::NotesTextViewPr>		NotesTextViewPr;
		nullable<nsViewProps::NotesViewPr>			NotesViewPr;
		nullable<nsViewProps::OutlineViewPr>		OutlineViewPr;
		nullable<nsViewProps::SlideViewPr>			SlideViewPr;
		nullable<nsViewProps::SorterViewPr>			SorterViewPr;
	};
} 

#endif // PPTX_VIEWPROPS_FILE_INCLUDE_H_