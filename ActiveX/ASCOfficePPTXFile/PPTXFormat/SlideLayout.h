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
#ifndef PPTX_SLIDES_SLIDELAYOUT_INCLUDE_H_
#define PPTX_SLIDES_SLIDELAYOUT_INCLUDE_H_

#include "WrapperFile.h"
#include "FileContainer.h"

#include "Logic/CSld.h"
#include "Logic/ClrMapOvr.h"
#include "Logic/Transitions/Transition.h"
#include "Logic/Timing/Timing.h"
#include "Logic/Hf.h"
#include "Limit/SlideLayoutType.h"

#include "Logic/Shape.h"
#include "Logic/ShapeProperties.h"

#include "Theme.h"
#include "SlideMaster.h"
#include "TableStyles.h"
#include "VmlDrawing.h"

#include "DocxFormat/FileTypes.h"
#include "DocxFormat/Media/Image.h"
#include "DocxFormat/External/HyperLink.h"
#include "Logic/SpTreeElem.h"

namespace PPTX
{
	class SlideLayout : public WrapperFile, public PPTX::FileContainer
	{
	public:
		SlideLayout()
		{
		}
		SlideLayout(const OOX::CPath& filename, FileMap& map)
		{
			read(filename, map);
		}
		virtual ~SlideLayout()
		{
		}

	public:
		virtual void read(const OOX::CPath& filename, FileMap& map)
		{
			

			XmlUtils::CXmlNode oNode;
			oNode.FromXmlFile2(filename.m_strFilename);

			cSld = oNode.ReadNode(_T("p:cSld"));
			cSld.SetParentFilePointer(this);

			clrMapOvr = oNode.ReadNode(_T("p:clrMapOvr"));
			if(clrMapOvr.is_init())
				clrMapOvr->SetParentFilePointer(this);

			transition = oNode.ReadNode(_T("p:transition"));
			if(transition.is_init())
				transition->SetParentFilePointer(this);

			timing = oNode.ReadNode(_T("p:timing"));
			if(timing.is_init())
				timing->SetParentFilePointer(this);

			hf = oNode.ReadNode(_T("p:hf"));
			if(hf.is_init())
				hf->SetParentFilePointer(this);

			oNode.ReadAttributeBase(L"matchingName", matchingName);
			oNode.ReadAttributeBase(L"preserve", preserve);
			oNode.ReadAttributeBase(L"showMasterPhAnim", showMasterPhAnim);
			oNode.ReadAttributeBase(L"showMasterSp", showMasterSp);
			oNode.ReadAttributeBase(L"type", attrType);
			oNode.ReadAttributeBase(L"userDrawn", userDrawn);
		}
		virtual void write(const OOX::CPath& filename, const OOX::CPath& directory, OOX::ContentTypes::File& content)const
		{
			XmlUtils::CAttribute oAttr;

			oAttr.Write(_T("xmlns:a"), OOX::g_Namespaces.a.m_strLink);
			oAttr.Write(_T("xmlns:r"), OOX::g_Namespaces.r.m_strLink);
			oAttr.Write(_T("xmlns:p"), OOX::g_Namespaces.p.m_strLink);

			oAttr.Write(_T("matchingName"), matchingName);
			oAttr.Write(_T("preserve"), preserve);
			oAttr.Write(_T("showMasterPhAnim"), showMasterPhAnim);
			oAttr.Write(_T("showMasterSp"), showMasterSp);
			oAttr.WriteLimitNullable(_T("type"), attrType);
			oAttr.Write(_T("userDrawn"), userDrawn);

			XmlUtils::CNodeValue oValue;
			oValue.Write(cSld);
			oValue.WriteNullable(clrMapOvr);
			oValue.WriteNullable(transition);
			oValue.WriteNullable(transition);
			oValue.WriteNullable(hf);

			XmlUtils::SaveToFile(filename.m_strFilename, XmlUtils::CreateNode(_T("p:sldLayout"), oAttr, oValue));

			content.registration(type().OverrideType(), directory, filename);
			m_written = true;
			m_WrittenFileName = filename.GetFilename();
			FileContainer::write(filename, directory, content);
		}

	public:
		virtual const OOX::FileType type() const
		{
			return OOX::FileTypes::SlideLayout;
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
		virtual void GetLevelUp(const Logic::Shape& pShape)const
		{
			if(pShape.nvSpPr.nvPr.ph.is_init())
			{
				CString idx = pShape.nvSpPr.nvPr.ph->idx.get_value_or(_T("0"));
				CString type = pShape.nvSpPr.nvPr.ph->type.get_value_or(_T("body"));
				if(type == _T("ctrTitle"))
					type = _T("title");

				size_t count = cSld.spTree.SpTreeElems.GetCount();
				for(size_t i = 0; i < count; ++i)
				{
					const PPTX::Logic::SpTreeElem* pElem = &cSld.spTree.SpTreeElems[i];
					
					if(pElem->is<Logic::Shape>())
					{
						const Logic::Shape& LayoutShape = pElem->as<Logic::Shape>();
						if(LayoutShape.nvSpPr.nvPr.ph.is_init())
						{
							CString lIdx = LayoutShape.nvSpPr.nvPr.ph->idx.get_value_or(_T("0"));
							CString lType = LayoutShape.nvSpPr.nvPr.ph->type.get_value_or(_T("body"));
							if(lType == _T("ctrTitle"))
								lType = _T("title");
							if((type == lType) && (idx == lIdx))
							{
								pShape.SetLevelUpElement(LayoutShape);
								return;
							}

							
							
							
							
							
							
							
							
							
							
							
							
							
							
							
							
							
							
							
							
							
							
							
							
							
							
							
							
							
							
							
							
							
						}
					}
				}
			}
		}
		virtual void FillShapeProperties(Logic::ShapeProperties& props, const CString& type)const
		{
			if(Master.IsInit())
				Master->FillShapeProperties(props, type);
		}
		virtual void FillShapeTextProperties(Logic::CShapeTextProperties& props, const CString& type)const
		{
			if(Master.IsInit())
				Master->FillShapeTextProperties(props, type);
		}
		virtual void GetBackground(Logic::BgPr& bg, DWORD& ARGB)const
		{
			if(cSld.bg.is_init())
			{
				if(cSld.bg->bgPr.is_init())
					bg = cSld.bg->bgPr.get();
				else if(cSld.bg->bgRef.is_init())
				{
					ARGB = cSld.bg->bgRef->Color.GetARGB();
					Theme->themeElements.fmtScheme.GetFillStyle(cSld.bg->bgRef->idx.get_value_or(0), bg.Fill);
					
				}
			}
			else
			{
				if(Master.IsInit())
					Master->GetBackground(bg, ARGB);
			}
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

		virtual DWORD GetRGBAFromMap(const CString& str)const
		{
			if(!(clrMapOvr.is_init()))
				return Master->GetRGBAFromMap(str);
			if(!(clrMapOvr->overrideClrMapping.is_init()))
				return Master->GetRGBAFromMap(str);
			return Master->GetRGBAFromScheme(clrMapOvr->overrideClrMapping->GetColorSchemeIndex(str));
		}

		virtual DWORD GetARGBFromMap(const CString& str)const
		{
			if(!(clrMapOvr.is_init()))
				return Master->GetARGBFromMap(str);
			if(!(clrMapOvr->overrideClrMapping.is_init()))
				return Master->GetARGBFromMap(str);
			return Master->GetARGBFromScheme(clrMapOvr->overrideClrMapping->GetColorSchemeIndex(str));
		}

		virtual DWORD GetBGRAFromMap(const CString& str)const
		{
			if(!(clrMapOvr.is_init()))
				return Master->GetBGRAFromMap(str);
			if(!(clrMapOvr->overrideClrMapping.is_init()))
				return Master->GetBGRAFromMap(str);
			return Master->GetBGRAFromScheme(clrMapOvr->overrideClrMapping->GetColorSchemeIndex(str));
		}

		virtual DWORD GetABGRFromMap(const CString& str)const
		{
			if(!(clrMapOvr.is_init()))
				return Master->GetABGRFromMap(str);
			if(!(clrMapOvr->overrideClrMapping.is_init()))
				return Master->GetABGRFromMap(str);
			return Master->GetABGRFromScheme(clrMapOvr->overrideClrMapping->GetColorSchemeIndex(str));
		}

		virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
		{
			pWriter->StartRecord(NSBinPptxRW::NSMainTables::SlideLayouts);

			pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeStart);
			pWriter->WriteString2(0, matchingName);
			pWriter->WriteBool2(1, preserve);
			pWriter->WriteBool2(2, showMasterPhAnim);
			pWriter->WriteBool2(3, showMasterSp);
			pWriter->WriteBool2(4, userDrawn);
			pWriter->WriteLimit2(5, attrType);
			pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeEnd);

			pWriter->WriteRecord1(0, cSld);
			pWriter->WriteRecord2(1, clrMapOvr);
			pWriter->WriteRecord2(2, transition);
			pWriter->WriteRecord2(3, timing);
			pWriter->WriteRecord2(4, hf);

			pWriter->EndRecord();
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

				switch (_at)
				{
					case 0:
					{
						matchingName = pReader->GetString2();
						break;
					}
					case 1:
					{
						preserve = pReader->GetBool();
						break;
					}
					case 2:
					{
						showMasterPhAnim = pReader->GetBool();
						break;
					}
					case 3:
					{
						showMasterSp = pReader->GetBool();
						break;
					}
					case 4:
					{
						userDrawn = pReader->GetBool();
						break;
					}
					case 5:
					{
						attrType = new Limit::SlideLayoutType();
						attrType->SetBYTECode(pReader->GetUChar());
						break;
					}
					default:
						break;
				}
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
					case 4:
					{
						hf = new Logic::HF();
						hf->fromPPTY(pReader);
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

		virtual void toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const
		{
			pWriter->StartNode(_T("p:sldLayout"));

			pWriter->StartAttributes();
			pWriter->WriteAttribute(_T("xmlns:a"), OOX::g_Namespaces.a.m_strLink);
			pWriter->WriteAttribute(_T("xmlns:r"), OOX::g_Namespaces.r.m_strLink);
			pWriter->WriteAttribute(_T("xmlns:p"), OOX::g_Namespaces.p.m_strLink);

			pWriter->WriteAttribute(_T("matchingName"), matchingName);
			pWriter->WriteAttribute(_T("preserve"), preserve);
			pWriter->WriteAttribute(_T("showMasterPhAnim"), showMasterPhAnim);
			pWriter->WriteAttribute(_T("showMasterSp"), showMasterSp);
			pWriter->WriteAttribute(_T("type"), attrType);
			pWriter->WriteAttribute(_T("userDrawn"), userDrawn);
			pWriter->EndAttributes();

			cSld.toXmlWriter(pWriter);

			if (clrMapOvr.is_init())
				pWriter->Write(clrMapOvr);
			else
				pWriter->WriteString(_T("<p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr>"));

			pWriter->Write(transition);
			pWriter->Write(timing);
			pWriter->Write(hf);

			pWriter->EndNode(_T("p:sldLayout"));
		}

	public:
		Logic::CSld						cSld;
		nullable<Logic::ClrMapOvr>		clrMapOvr;
		nullable<Logic::Transition>		transition;
		nullable<Logic::Timing>			timing;
		nullable<Logic::HF>				hf;

		
		nullable_string							matchingName;
		nullable_bool							preserve;
		nullable_bool							showMasterPhAnim;
		nullable_bool							showMasterSp;
		nullable_limit<Limit::SlideLayoutType>	attrType;
		nullable_bool							userDrawn;

		smart_ptr<SlideMaster>					Master;
		smart_ptr<Theme>						Theme;
		smart_ptr<TableStyles>					TableStyles;
		smart_ptr<VmlDrawing>					Vml;
		
	public:
		void ApplyRels()
		{
			smart_ptr<OOX::File> pFile = FileContainer::get(OOX::FileTypes::SlideMaster);

			Master = pFile.smart_dynamic_cast<PPTX::SlideMaster>();

			if (Master.IsInit())
				Theme = Master->Theme;
			
			if (Theme.IsInit())
			{	
				TableStyles = Theme->Presentation->get(OOX::FileTypes::TableStyles).smart_dynamic_cast<PPTX::TableStyles>();
			}
		}
		const OOX::CPath GetPathBySpid(const CString& spid)const
		{
			OOX::CPath filename = _T("");
			if((Vml.is_init()) && (spid != _T("")))
			{
				const CAtlMap<CString, OOX::CPath>::CPair* pPair = Vml->SpIds.Lookup(spid);
				if (NULL != pPair)
					filename = pPair->m_value;
			}
			return filename;
		}
	};
} 

#endif // PPTX_SLIDES_SLIDELAYOUT_INCLUDE_H_