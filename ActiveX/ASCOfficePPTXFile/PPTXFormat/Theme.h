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
#ifndef PPTX_THEME_FILE_INCLUDE_H_
#define PPTX_THEME_FILE_INCLUDE_H_

#include "WrapperFile.h"
#include "FileContainer.h"

#include "Theme/ThemeElements.h"
#include "Logic/DefaultShapeDefinition.h"
#include "Theme/ExtraClrScheme.h"

#include "Logic/ShapeProperties.h"
#include "Logic/ClrMap.h"

#include "Presentation.h"
#include "DocxFormat/Media/Image.h"
#include "DocxFormat/External/HyperLink.h"

namespace PPTX
{
	class Theme : public PPTX::WrapperFile, public PPTX::FileContainer
	{
	public:
		Theme()
		{
		}
		Theme(const OOX::CPath& filename, FileMap& map)
		{
			m_map = NULL;
			read(filename, map);
		}
		virtual ~Theme()
		{
		}

	public:
		virtual void read(const OOX::CPath& filename, FileMap& map)
		{
			
			m_map = NULL;

			XmlUtils::CXmlNode oNode;
			oNode.FromXmlFile2(filename.m_strFilename);

			oNode.ReadAttributeBase(_T("name"), name);

			themeElements = oNode.ReadNode(_T("a:themeElements"));
			themeElements.SetParentFilePointer(this);

			XmlUtils::CXmlNode oDefaults;
			if (oNode.GetNode(_T("a:objectDefaults"), oDefaults))
			{
				spDef = oNode.ReadNode(_T("a:spDef"));
				if (spDef.IsInit())
					spDef->SetParentFilePointer(this);

				lnDef = oNode.ReadNode(_T("a:lnDef"));
				if (lnDef.IsInit())
					lnDef->SetParentFilePointer(this);

				txDef = oNode.ReadNode(_T("a:txDef"));
				if (txDef.IsInit())
					txDef->SetParentFilePointer(this);
			}

			extraClrSchemeLst.RemoveAll();
			XmlUtils::CXmlNode oNodeList;
			if (oNode.GetNode(_T("a:extraClrSchemeLst"), oNodeList))
			{
				oNodeList.LoadArray(_T("a:extraClrScheme"), extraClrSchemeLst);
			}

			size_t count = extraClrSchemeLst.GetCount();
			for (size_t i = 0; i < count; ++i)
				extraClrSchemeLst[i].SetParentFilePointer(this);
		}
		virtual void write(const OOX::CPath& filename, const OOX::CPath& directory, OOX::ContentTypes::File& content)const
		{
			XmlUtils::CAttribute oAttr;
			oAttr.Write(_T("xmlns:a"), OOX::g_Namespaces.a.m_strLink);
			oAttr.Write(_T("name"), name);

			XmlUtils::CNodeValue oValue;
			oValue.Write(themeElements);

			oValue.m_strValue += _T("<a:objectDefaults>");
			oValue.WriteNullable(spDef);
			oValue.WriteNullable(lnDef);
			oValue.WriteNullable(txDef);
			oValue.m_strValue += _T("</a:objectDefaults>");

			oValue.WriteArray(_T("a:extraClrSchemeLst"), extraClrSchemeLst);

			XmlUtils::SaveToFile(filename.m_strFilename, XmlUtils::CreateNode(_T("a:theme"), oAttr, oValue));
			
			content.registration(type().OverrideType(), directory, filename);
			m_written = true;
			m_WrittenFileName = filename.GetFilename();
			FileContainer::write(filename, directory, content);
		}

		virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
		{
			pWriter->StartRecord(NSBinPptxRW::NSMainTables::Themes);

			pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeStart);
			pWriter->WriteString2(0, name);
			pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeEnd);

			pWriter->WriteRecord1(0, themeElements);
			pWriter->WriteRecord2(1, spDef);
			pWriter->WriteRecord2(2, lnDef);
			pWriter->WriteRecord2(3, txDef);
			pWriter->WriteRecordArray(4, 0, extraClrSchemeLst);

			pWriter->EndRecord();
		}
		virtual void toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const
		{
			pWriter->StartNode(_T("a:theme"));

			pWriter->StartAttributes();
			pWriter->WriteAttribute(_T("xmlns:a"), OOX::g_Namespaces.a.m_strLink);
			pWriter->WriteAttribute(_T("xmlns:r"), OOX::g_Namespaces.r.m_strLink);
			pWriter->WriteAttribute(_T("xmlns:p"), OOX::g_Namespaces.p.m_strLink);
			pWriter->WriteAttribute2(_T("name"), name);
			pWriter->EndAttributes();

			themeElements.toXmlWriter(pWriter);
			pWriter->StartNode(_T("a:objectDefaults"));
			pWriter->EndAttributes();
			pWriter->Write(spDef);
			pWriter->Write(lnDef);
			pWriter->Write(txDef);
			pWriter->EndNode(_T("a:objectDefaults"));

			pWriter->WriteArray(_T("a:extraClrSchemeLst"), extraClrSchemeLst);

			pWriter->EndNode(_T("a:theme"));
		}
		virtual void fromPPTY(NSBinPptxRW::CBinaryFileReader* pReader)
		{
			BYTE type = pReader->GetUChar();

			LONG _rec_start = pReader->GetPos();
			LONG _end_rec = _rec_start + pReader->GetULong() + 4;

			pReader->Skip(1); 

			while (true)
			{
				BYTE _at = pReader->GetUChar();
				if (_at == NSBinPptxRW::g_nodeAttributeEnd)
					break;

				if (0 == _at)
					name = pReader->GetString2();
				else
					break;
			}

			while (pReader->GetPos() < _end_rec)
			{
				BYTE _at = pReader->GetUChar();
				switch (_at)
				{
					case 0:
					{
						
						themeElements.fromPPTY(pReader);
						break;
					}
					case 1:
					{
						spDef = new Logic::DefaultShapeDefinition();
						spDef->m_name = _T("spDef");
						spDef->fromPPTY(pReader);
						break;
					}
					case 2:
					{
						lnDef = new Logic::DefaultShapeDefinition();
						lnDef->m_name = _T("lnDef");
						lnDef->fromPPTY(pReader);
						break;
					}
					case 3:
					{
						txDef = new Logic::DefaultShapeDefinition();
						txDef->m_name = _T("txDef");
						txDef->fromPPTY(pReader);
						break;
					}
					case 4:
					{
						extraClrSchemeLst.RemoveAll();
						pReader->Skip(4); 
						ULONG _len = pReader->GetULong();
						for (ULONG i = 0; i < _len; ++i)
						{
							pReader->Skip(1); 
							extraClrSchemeLst.Add();
							extraClrSchemeLst[i].fromPPTY(pReader);
						}
					}
				}
			}

			pReader->Seek(_end_rec);			
		}

	public:
		virtual const OOX::FileType type() const
		{
			return OOX::FileTypes::ThemePPTX;
		}
		virtual const OOX::CPath DefaultDirectory() const
		{
			return type().DefaultDirectory();
		}
		virtual const OOX::CPath DefaultFileName() const
		{
			return type().DefaultFileName();
		}

		
		DWORD GetRGBAFromScheme(const CString& str)const
		{
			return themeElements.clrScheme.GetRGBAFromScheme(str);
		}
		DWORD GetARGBFromScheme(const CString& str)const
		{
			return themeElements.clrScheme.GetARGBFromScheme(str);
		}
		DWORD GetBGRAFromScheme(const CString& str)const
		{
			return themeElements.clrScheme.GetBGRAFromScheme(str);
		}
		DWORD GetABGRFromScheme(const CString& str)const
		{
			return themeElements.clrScheme.GetABGRFromScheme(str);
		}

		
		DWORD GetRGBAFromMap(const CString& str)const
		{
			return GetRGBAFromScheme(m_map->GetColorSchemeIndex(str));
		}
		DWORD GetARGBFromMap(const CString& str)const
		{
			return GetARGBFromScheme(m_map->GetColorSchemeIndex(str));
		}
		DWORD GetBGRAFromMap(const CString& str)const
		{
			return GetBGRAFromScheme(m_map->GetColorSchemeIndex(str));
		}
		DWORD GetABGRFromMap(const CString& str)const
		{
			return GetABGRFromScheme(m_map->GetColorSchemeIndex(str));
		}

		virtual void FillShapeProperties(Logic::ShapeProperties& props, const CString& type)const
		{
			if(Presentation.IsInit())
			{
				props.FillFromTextListStyle(Presentation->defaultTextStyle);
				props.SetTextType(0);
			}
			if(type == _T("table-cell"))
				props.FillMasterFontSize(1800);
			
			
			
			
			
			
			props.SetMajorLatin(themeElements.fontScheme.majorFont.latin);
			props.SetMinorLatin(themeElements.fontScheme.minorFont.latin);
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
		void GetLineStyle(int number, Logic::Ln& lnStyle)const
		{
			themeElements.fmtScheme.GetLineStyle(number, lnStyle);
		}
		void GetFillStyle(int number, Logic::UniFill& fillStyle)const
		{
			themeElements.fmtScheme.GetFillStyle(number, fillStyle);
		}

	public:
		nullable_string							name;
		nsTheme::ThemeElements					themeElements;
		nullable<Logic::DefaultShapeDefinition> spDef;
		nullable<Logic::DefaultShapeDefinition> lnDef;
		nullable<Logic::DefaultShapeDefinition> txDef;
		
		CAtlArray<nsTheme::ExtraClrScheme>		extraClrSchemeLst;

		smart_ptr<Presentation>					Presentation;

	public:
		void SetColorMap(const Logic::ClrMap& map){m_map = &map;};
	
	private:
		Logic::ClrMap const* m_map;
	};
} 

#endif // PPTX_THEME_FILE_INCLUDE_H_