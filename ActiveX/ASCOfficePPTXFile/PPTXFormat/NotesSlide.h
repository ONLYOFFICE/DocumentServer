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
#ifndef PPTX_SLIDES_NOTESSLIDE_INCLUDE_H_
#define PPTX_SLIDES_NOTESSLIDE_INCLUDE_H_

#include "WrapperFile.h"
#include "FileContainer.h"
#include "Logic/ClrMapOvr.h"
#include "Logic/CSld.h"
#include "DocxFormat/FileTypes.h"

namespace PPTX
{
	class NotesSlide : public WrapperFile, public PPTX::FileContainer
	{
	public:
		NotesSlide()
		{
		}
		NotesSlide(const OOX::CPath& filename, FileMap& map)
		{
			read(filename, map);
		}
		virtual ~NotesSlide()
		{
		}

	public:
		virtual void read(const OOX::CPath& filename, FileMap& map)
		{
			

			XmlUtils::CXmlNode oNode;
			oNode.FromXmlFile2(filename.m_strFilename);

			oNode.ReadAttributeBase(L"showMasterPhAnim", showMasterPhAnim);
			oNode.ReadAttributeBase(L"showMasterSp", showMasterSp);

			cSld = oNode.ReadNode(_T("p:cSld"));
			cSld.SetParentFilePointer(this);

			clrMapOvr = oNode.ReadNode(_T("p:clrMapOvr"));
			if (clrMapOvr.IsInit())
				clrMapOvr->SetParentFilePointer(this);
		}
		virtual void write(const OOX::CPath& filename, const OOX::CPath& directory, OOX::ContentTypes::File& content)const
		{
			XmlUtils::CAttribute oAttr;
			oAttr.Write(_T("xmlns:a"), OOX::g_Namespaces.a.m_strLink);
			oAttr.Write(_T("xmlns:r"), OOX::g_Namespaces.r.m_strLink);
			oAttr.Write(_T("xmlns:p"), OOX::g_Namespaces.p.m_strLink);

			oAttr.Write(_T("showMasterPhAnim"), showMasterPhAnim);
			oAttr.Write(_T("showMasterSp"), showMasterSp);

			XmlUtils::CNodeValue oValue;
			oValue.Write(cSld);
			oValue.WriteNullable(clrMapOvr);

			XmlUtils::SaveToFile(filename.m_strFilename, XmlUtils::CreateNode(_T("p:notes"), oAttr, oValue));
			
			content.registration(type().OverrideType(), directory, filename);
			m_written = true;
			m_WrittenFileName = filename.GetFilename();
			FileContainer::write(filename, directory, content);
		}

	public:
		virtual const OOX::FileType type() const
		{
			return OOX::FileTypes::NotesSlide;
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
			pWriter->StartRecord(NSBinPptxRW::NSMainTables::NotesSlides);

			pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeStart);
			pWriter->WriteBool2(0, showMasterPhAnim);
			pWriter->WriteBool2(1, showMasterSp);
			pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeEnd);

			pWriter->WriteRecord1(0, cSld);
			pWriter->WriteRecord2(1, clrMapOvr);

			pWriter->EndRecord();
		}
		virtual void toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const
		{
			pWriter->StartNode(_T("p:notes"));

			pWriter->StartAttributes();
			pWriter->WriteAttribute(_T("xmlns:a"), OOX::g_Namespaces.a.m_strLink);
			pWriter->WriteAttribute(_T("xmlns:r"), OOX::g_Namespaces.r.m_strLink);
			pWriter->WriteAttribute(_T("xmlns:p"), OOX::g_Namespaces.p.m_strLink);
			pWriter->WriteAttribute(_T("showMasterPhAnim"), showMasterPhAnim);
			pWriter->WriteAttribute(_T("showMasterSp"), showMasterSp);
			pWriter->EndAttributes();

			cSld.toXmlWriter(pWriter);
			pWriter->Write(clrMapOvr);

			pWriter->EndNode(_T("p:notes"));
		}

		virtual void fromPPTY(NSBinPptxRW::CBinaryFileReader* pReader)
		{
			pReader->Skip(1); 
			LONG end = pReader->GetPos() + pReader->GetLong() + 4;

			pReader->Skip(1); 
			while (true)
			{
				BYTE _at = pReader->GetUChar();
				if (_at == NSBinPptxRW::g_nodeAttributeEnd)
					break;

				if (0 == _at)
					showMasterPhAnim = pReader->GetBool();
				else if (1 == _at)
					showMasterSp = pReader->GetBool();
			}

			while (pReader->GetPos() < end)
			{
				BYTE _rec = pReader->GetUChar();

				switch (_rec)
				{
					case 0:
					{
						cSld.fromPPTY(pReader);
						break;
					}
					case 1:
					{
						clrMapOvr = new Logic::ClrMapOvr();
						clrMapOvr->fromPPTY(pReader);
						break;
					}
					default:
					{
						pReader->SkipRecord();
						break;
					}
				}
			}

			pReader->Seek(end);
		}

	public:
		Logic::CSld					cSld;
		nullable<Logic::ClrMapOvr>	clrMapOvr;

		nullable_bool				showMasterPhAnim;
		nullable_bool				showMasterSp;
	};
} 

#endif // PPTX_SLIDES_NOTESSLIDE_INCLUDE_H_