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
#ifndef PPTX_SLIDES_SLIDE_INCLUDE_H_
#define PPTX_SLIDES_SLIDE_INCLUDE_H_

#include "WrapperFile.h"
#include "FileContainer.h"

#include "Logic/ClrMapOvr.h"
#include "Logic/CSld.h"
#include "Logic/Transitions/Transition.h"
#include "Logic/Timing/Timing.h"

#include "Logic/ShapeProperties.h"
#include "Logic/Bg.h"

#include "Theme.h"
#include "SlideMaster.h"
#include "SlideLayout.h"
#include "NotesSlide.h"
#include "TableStyles.h"
#include "VmlDrawing.h"

#include "DocxFormat/Media/Image.h"
#include "DocxFormat/External/External.h"
#include "DocxFormat/External/HyperLink.h"

#include "Comments.h"

namespace PPTX
{
	class Slide : public WrapperFile, public PPTX::FileContainer
	{
	public:
		Slide()
		{
		}
		Slide(const OOX::CPath& filename, FileMap& map)
		{
			read(filename, map);
		}
		virtual ~Slide()
		{
		}

	public:
		virtual void read(const OOX::CPath& filename, FileMap& map)
		{
			

			XmlUtils::CXmlNode oNode;
			oNode.FromXmlFile2(filename.m_strFilename);

			oNode.ReadAttributeBase(L"show", show);
			oNode.ReadAttributeBase(L"showMasterPhAnim", showMasterPhAnim);
			oNode.ReadAttributeBase(L"showMasterSp", showMasterSp);

			cSld		= oNode.ReadNode(_T("p:cSld"));
			if (cSld.IsInit())
				cSld->SetParentFilePointer(this);

			clrMapOvr	= oNode.ReadNode(_T("p:clrMapOvr"));
			if (clrMapOvr.IsInit())
				clrMapOvr->SetParentFilePointer(this);

			transition	= oNode.ReadNode(_T("p:transition"));

			if (!transition.IsInit())
			{
				XmlUtils::CXmlNode oNodeMSAlternate;
				if (oNode.GetNode(_T("mc:AlternateContent"), oNodeMSAlternate))
				{
					XmlUtils::CXmlNode oNodeFallback;
					if (oNodeMSAlternate.GetNode(_T("mc:Choice"), oNodeFallback))
					{
						transition = oNodeFallback.ReadNode(_T("p:transition"));
					}
				}
			}

			if (transition.IsInit())
				transition->SetParentFilePointer(this);

			timing		= oNode.ReadNode(_T("p:timing"));
			if (!timing.IsInit())
			{
				XmlUtils::CXmlNode oAlternate;
				if (oNode.GetNode(_T("mc:AlternateContent"), oAlternate))
				{
					XmlUtils::CXmlNode oChoice;
					if (oAlternate.GetNode(_T("mc:Choice"), oChoice))
					{
						timing	=	oChoice.ReadNode(_T("p:timing"));
					}
				}
			}

			if (timing.IsInit())
				timing->SetParentFilePointer(this);
		}
		virtual void write(const OOX::CPath& filename, const OOX::CPath& directory, OOX::ContentTypes::File& content)const
		{
			XmlUtils::CAttribute oAttr;
			oAttr.Write(_T("xmlns:a"), OOX::g_Namespaces.a.m_strLink);
			oAttr.Write(_T("xmlns:r"), OOX::g_Namespaces.r.m_strLink);
			oAttr.Write(_T("xmlns:p"), OOX::g_Namespaces.p.m_strLink);
			oAttr.Write(_T("show"), show);
			oAttr.Write(_T("showMasterPhAnim"), showMasterPhAnim);
			oAttr.Write(_T("showMasterSp"), showMasterSp);

			XmlUtils::CNodeValue oValue;
			oValue.WriteNullable(cSld);
			oValue.WriteNullable(clrMapOvr);
			oValue.WriteNullable(transition);
			oValue.WriteNullable(timing);

			XmlUtils::SaveToFile(filename.m_strFilename, XmlUtils::CreateNode(_T("p:sld"), oAttr, oValue));

			content.registration(type().OverrideType(), directory, filename);
			m_written = true;
			m_WrittenFileName = filename.GetFilename();
			FileContainer::write(filename, directory, content);
		}
		
	public:
		virtual const OOX::FileType type() const
		{
			return OOX::FileTypes::Slide;
		}
		virtual const OOX::CPath DefaultDirectory() const
		{
			return type().DefaultDirectory();
		}
		virtual const OOX::CPath DefaultFileName() const
		{
			return type().DefaultFileName();
		}

	public:
		virtual void FillShapeProperties(Logic::ShapeProperties& props, const CString& type)const
		{
			if (Layout.IsInit())
				Layout->FillShapeProperties(props, type);
		}
		virtual void FillShapeTextProperties(Logic::CShapeTextProperties& props, const CString& type)const
		{
			if (Layout.IsInit())
				Layout->FillShapeTextProperties(props, type);
		}
		virtual bool GetBackground(Logic::BgPr& bg, DWORD& ARGB)const
		{
			if (cSld->bg.is_init())
			{
				if(cSld->bg->bgPr.is_init())
					bg = cSld->bg->bgPr.get();
				else if(cSld->bg->bgRef.is_init())
				{
					ARGB = cSld->bg->bgRef->Color.GetARGB();
					Theme->themeElements.fmtScheme.GetFillStyle(cSld->bg->bgRef->idx.get_value_or(0), bg.Fill);
				}
				return true;
			}
			else
			{
				if (Layout.IsInit())
					Layout->GetBackground(bg, ARGB);
				return false;
			}
			return false;
		}
		virtual CString GetMediaFullPathNameFromRId(const OOX::RId& rid)const
		{
			smart_ptr<OOX::Image> p = image(rid);
			if (!p.is_init())
				return _T("");
			return p->filename().m_strFilename;
		}
		virtual CString GetFullHyperlinkNameFromRId(const OOX::RId& rid)const
		{
			smart_ptr<OOX::HyperLink> p = hyperlink(rid);
			if (!p.is_init())
				return _T("");
			return p->Uri().m_strFilename;
		}
		virtual CString GetLinkFromRId(const OOX::RId& rid)const
		{
			
			smart_ptr<OOX::External> pExt = find(rid).smart_dynamic_cast<OOX::External>();
			if (pExt.IsInit())
				return pExt->Uri().m_strFilename;

			smart_ptr<OOX::Media> pMedia = find(rid).smart_dynamic_cast<OOX::Media>();
			if (pMedia.IsInit())
				return pMedia->filename().m_strFilename;

			return _T("");
		}

		virtual DWORD GetRGBAFromMap(const CString& str)const
		{
			if(!(clrMapOvr.is_init()))
				return Layout->GetRGBAFromMap(str);
			if(!(clrMapOvr->overrideClrMapping.is_init()))
				return Layout->GetRGBAFromMap(str);
			return Master->GetRGBAFromScheme(clrMapOvr->overrideClrMapping->GetColorSchemeIndex(str));
		}
		virtual DWORD GetARGBFromMap(const CString& str)const
		{
			if(!(clrMapOvr.is_init()))
				return Layout->GetARGBFromMap(str);
			if(!(clrMapOvr->overrideClrMapping.is_init()))
				return Layout->GetARGBFromMap(str);
			return Master->GetARGBFromScheme(clrMapOvr->overrideClrMapping->GetColorSchemeIndex(str));
		}
		virtual DWORD GetBGRAFromMap(const CString& str)const
		{
			if(!(clrMapOvr.is_init()))
				return Layout->GetBGRAFromMap(str);
			if(!(clrMapOvr->overrideClrMapping.is_init()))
				return Layout->GetBGRAFromMap(str);
			return Master->GetBGRAFromScheme(clrMapOvr->overrideClrMapping->GetColorSchemeIndex(str));
		}
		virtual DWORD GetABGRFromMap(const CString& str)const
		{
			if(!(clrMapOvr.is_init()))
				return Layout->GetABGRFromMap(str);
			if(!(clrMapOvr->overrideClrMapping.is_init()))
				return Layout->GetABGRFromMap(str);
			return Master->GetABGRFromScheme(clrMapOvr->overrideClrMapping->GetColorSchemeIndex(str));
		}

		virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
		{
			pWriter->StartRecord(NSBinPptxRW::NSMainTables::Slides);

			pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeStart);
			pWriter->WriteBool2(0, show);
			pWriter->WriteBool2(1, showMasterPhAnim);
			pWriter->WriteBool2(2, showMasterSp);
			pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeEnd);

			pWriter->WriteRecord2(0, cSld);
			pWriter->WriteRecord2(1, clrMapOvr);
			pWriter->WriteRecord2(2, transition);
			pWriter->WriteRecord2(3, timing);

			pWriter->WriteRecord2(4, comments);
			
			pWriter->EndRecord();
		}

		virtual void toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const
		{
			pWriter->StartNode(_T("p:sld"));

			pWriter->StartAttributes();
			pWriter->WriteAttribute(_T("xmlns:a"), OOX::g_Namespaces.a.m_strLink);
			pWriter->WriteAttribute(_T("xmlns:r"), OOX::g_Namespaces.r.m_strLink);
			pWriter->WriteAttribute(_T("xmlns:p"), OOX::g_Namespaces.p.m_strLink);

			pWriter->WriteAttribute(_T("showMasterPhAnim"), showMasterPhAnim);
			pWriter->WriteAttribute(_T("showMasterSp"), showMasterSp);
			pWriter->WriteAttribute(_T("show"), show);
			pWriter->EndAttributes();

			pWriter->Write(cSld);

			if (clrMapOvr.is_init())
				pWriter->Write(clrMapOvr);
			else
				pWriter->WriteString(_T("<p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr>"));

			pWriter->Write(transition);
			pWriter->Write(timing);

			pWriter->EndNode(_T("p:sld"));
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
					show = pReader->GetBool();
				else if (1 == _at)
					showMasterPhAnim = pReader->GetBool();
				else if (2 == _at)
					showMasterSp = pReader->GetBool();
			}

			while (pReader->GetPos() < end)
			{
				BYTE _rec = pReader->GetUChar();

				switch (_rec)
				{
					case 0:
					{
						cSld = new Logic::CSld();
						cSld->fromPPTY(pReader);
						break;
					}
					case 1:
					{
						clrMapOvr = new Logic::ClrMapOvr();
						clrMapOvr->fromPPTY(pReader);
						break;
					}
					case 2:
					{
						transition = new Logic::Transition();
						transition->fromPPTY(pReader);
						break;
					}
					case 3:
					{
						timing = new Logic::Timing();
						timing->fromPPTY(pReader);
						break;
					}
					case 4:
					{
						comments = new PPTX::Comments();
						comments->fromPPTY(pReader);
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
		nullable_bool		show;
		nullable_bool		showMasterPhAnim;
		nullable_bool		showMasterSp;

		nullable<Logic::ClrMapOvr>	clrMapOvr;
		nullable<Logic::CSld>		cSld;
		nullable<Logic::Transition> transition;
		nullable<Logic::Timing>		timing;

		smart_ptr<SlideLayout>	Layout;
		smart_ptr<SlideMaster>	Master;
		smart_ptr<NotesSlide>	Note;
		smart_ptr<Theme>		Theme;
		smart_ptr<VmlDrawing>	Vml;
		smart_ptr<TableStyles>	TableStyles;

		smart_ptr<PPTX::Comments>	comments;

	public:
		void ApplyRels()
		{
			Layout	= FileContainer::get(OOX::FileTypes::SlideLayout).smart_dynamic_cast<PPTX::SlideLayout>();
			Note	= FileContainer::get(OOX::FileTypes::NotesSlide).smart_dynamic_cast<PPTX::NotesSlide>();
			comments = FileContainer::get(OOX::FileTypes::SlideComments).smart_dynamic_cast<PPTX::Comments>();
			Master	= Layout->Master;
			Theme	= Layout->Theme;
			
			TableStyles = Theme->Presentation->get(OOX::FileTypes::TableStyles).smart_dynamic_cast<PPTX::TableStyles>();

			if (exist(OOX::FileTypes::VmlDrawing))
			{
				Vml = FileContainer::get(OOX::FileTypes::VmlDrawing).smart_dynamic_cast<PPTX::VmlDrawing>();
				Vml->FillRIds();
			}
		}
		const OOX::CPath GetPathBySpid(const CString& spid)const
		{
			OOX::CPath filename = _T("");
			if((Vml.is_init()) && (spid != ""))
			{
				const CAtlMap<CString, OOX::CPath>::CPair *pPair = Vml->SpIds.Lookup(spid);

				if (NULL != pPair)
					filename = pPair->m_value;
			}
			return filename;
		}
	};
} 

#endif // PPTX_SLIDES_SLIDE_INCLUDE_H_