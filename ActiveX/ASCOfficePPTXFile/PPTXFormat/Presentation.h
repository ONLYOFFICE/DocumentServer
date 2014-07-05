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
#ifndef PPTX_PRESENTATION_FILE_INCLUDE_H_
#define PPTX_PRESENTATION_FILE_INCLUDE_H_

#include "WrapperFile.h"
#include "FileContainer.h"

#include "Limit/Conformance.h"
#include "Logic/TextListStyle.h"
#include "Logic/ClrMap.h"
#include "Theme/ClrScheme.h"

#include "Presentation/EmbeddedFont.h"
#include "Presentation/Kinsoku.h"
#include "Presentation/NotesSz.h"
#include "Presentation/PhotoAlbum.h"
#include "Logic/XmlId.h"
#include "Presentation/SldSz.h"
#include "DocxFormat/FileTypes.h"
#include "CommentAuthors.h"

namespace PPTX
{
	class Presentation : public WrapperFile, public PPTX::FileContainer
	{
	public:
		Presentation()
		{
		}
		Presentation(const OOX::CPath& filename, FileMap& map)
		{
			read(filename, map);
		}
		virtual ~Presentation()
		{
		}

	public:
		virtual void read(const OOX::CPath& filename, FileMap& map)
		{
			

			XmlUtils::CXmlNode oNode;
			oNode.FromXmlFile2(filename.m_strFilename);

			oNode.ReadAttributeBase(L"autoCompressPictures", attrAutoCompressPictures);
			oNode.ReadAttributeBase(L"bookmarkIdSeed", attrBookmarkIdSeed);
			oNode.ReadAttributeBase(L"compatMode", attrCompatMode);
			oNode.ReadAttributeBase(L"conformance", attrConformance);
			oNode.ReadAttributeBase(L"embedTrueTypeFonts", attrEmbedTrueTypeFonts);
			oNode.ReadAttributeBase(L"firstSlideNum", attrFirstSlideNum);
			oNode.ReadAttributeBase(L"removePersonalInfoOnSave", attrRemovePersonalInfoOnSave);
			oNode.ReadAttributeBase(L"rtl", attrRtl);
			oNode.ReadAttributeBase(L"saveSubsetFonts", attrSaveSubsetFonts);
			oNode.ReadAttributeBase(L"serverZoom", attrServerZoom);
			oNode.ReadAttributeBase(L"showSpecialPlsOnTitleSld", attrShowSpecialPlsOnTitleSld);
			oNode.ReadAttributeBase(L"strictFirstAndLastChars", attrStrictFirstAndLastChars);


			
			
			defaultTextStyle = oNode.ReadNode(_T("p:defaultTextStyle"));
			if(defaultTextStyle.is_init())
				defaultTextStyle->SetParentFilePointer(this);

			embeddedFontLst.RemoveAll();
			XmlUtils::CXmlNode oNodeEmbeddedFonts;
			if (oNode.GetNode(_T("p:embeddedFontLst"), oNodeEmbeddedFonts))
			{
				oNodeEmbeddedFonts.LoadArray(_T("p:embeddedFont"), embeddedFontLst);

				size_t count = embeddedFontLst.GetCount();
				for (size_t i = 0; i < count; ++i)
					embeddedFontLst[i].SetParentFilePointer(this);
			}
			
			handoutMasterIdLst.RemoveAll();
			XmlUtils::CXmlNode oNodeHMList;
			if (oNode.GetNode(_T("p:handoutMasterIdLst"), oNodeHMList))
			{
				oNodeHMList.LoadArray(_T("p:handoutMasterId"), handoutMasterIdLst);

				size_t count = handoutMasterIdLst.GetCount();
				for (size_t i = 0; i < count; ++i)
					handoutMasterIdLst[i].SetParentFilePointer(this);
			}


			kinsoku = oNode.ReadNode(_T("p:kinsoku"));
			if (kinsoku.is_init())
				kinsoku->SetParentFilePointer(this);
			
			
			notesMasterIdLst.RemoveAll();
			XmlUtils::CXmlNode oNodeMIDList;
			if (oNode.GetNode(_T("p:notesMasterIdLst"), oNodeMIDList))
			{
				oNodeMIDList.LoadArray(_T("p:notesMasterId"), notesMasterIdLst);

				size_t count = notesMasterIdLst.GetCount();
				for (size_t i = 0; i < count; ++i)
					notesMasterIdLst[i].SetParentFilePointer(this);
			}

			notesSz = oNode.ReadNode(_T("p:notesSz"));
			if (notesSz.is_init())
				notesSz->SetParentFilePointer(this);

			photoAlbum = oNode.ReadNode(_T("p:photoAlbum"));
			if(photoAlbum.is_init())
				photoAlbum->SetParentFilePointer(this);

			sldIdLst.RemoveAll();
			XmlUtils::CXmlNode oNode_sldId;
			if (oNode.GetNode(_T("p:sldIdLst"), oNode_sldId))
			{
				oNode_sldId.LoadArray(_T("p:sldId"), sldIdLst);

				size_t count = sldIdLst.GetCount();
				for (size_t i = 0; i < count; ++i)
					sldIdLst[i].SetParentFilePointer(this);
			}

			sldMasterIdLst.RemoveAll();
			XmlUtils::CXmlNode oNode_sldM_Id;
			if (oNode.GetNode(_T("p:sldMasterIdLst"), oNode_sldM_Id))
			{
				oNode_sldM_Id.LoadArray(_T("p:sldMasterId"), sldMasterIdLst);

				size_t count = sldMasterIdLst.GetCount();
				for (size_t i = 0; i < count; ++i)
					sldMasterIdLst[i].SetParentFilePointer(this);
			}

			sldSz = oNode.ReadNode(_T("p:sldSz"));
			if (sldSz.is_init())
				sldSz->SetParentFilePointer(this);
			

			Normalize();
		}
		virtual void write(const OOX::CPath& filename, const OOX::CPath& directory, OOX::ContentTypes::File& content)const
		{
			XmlUtils::CAttribute oAttr;
			oAttr.Write(_T("xmlns:a"), OOX::g_Namespaces.a.m_strLink);
			oAttr.Write(_T("xmlns:r"), OOX::g_Namespaces.r.m_strLink);
			oAttr.Write(_T("xmlns:p"), OOX::g_Namespaces.p.m_strLink);

			oAttr.Write(_T("autoCompressPictures"), attrAutoCompressPictures);
			oAttr.Write(_T("bookmarkIdSeed"), attrBookmarkIdSeed);
			oAttr.Write(_T("compatMode"), attrCompatMode);
			oAttr.WriteLimitNullable(_T("conformance"), attrConformance);
			oAttr.Write(_T("embedTrueTypeFonts"), attrEmbedTrueTypeFonts);
			oAttr.Write(_T("firstSlideNum"), attrFirstSlideNum);
			oAttr.Write(_T("removePersonalInfoOnSave"), attrRemovePersonalInfoOnSave);
			oAttr.Write(_T("rtl"), attrRtl);
			oAttr.Write(_T("saveSubsetFonts"), attrSaveSubsetFonts);
			oAttr.Write(_T("serverZoom"), attrServerZoom);
			oAttr.Write(_T("showSpecialPlsOnTitleSld"), attrShowSpecialPlsOnTitleSld);
			oAttr.Write(_T("strictFirstAndLastChars"), attrStrictFirstAndLastChars);

			XmlUtils::CNodeValue oValue;
			oValue.WriteArray(_T("p:sldMasterIdLst"), sldMasterIdLst);

			if (!notesMasterIdLst.IsEmpty())
				oValue.WriteArray(_T("p:notesMasterIdLst"), notesMasterIdLst);
			if (!handoutMasterIdLst.IsEmpty())
				oValue.WriteArray(_T("p:handoutMasterIdLst"), handoutMasterIdLst);
			if (!handoutMasterIdLst.IsEmpty())
				oValue.WriteArray(_T("p:embeddedFontLst"), embeddedFontLst);

			oValue.WriteArray(_T("p:sldIdLst"), sldIdLst);
			oValue.WriteNullable(sldSz);
			oValue.WriteNullable(notesSz);

			oValue.WriteNullable(photoAlbum);
			oValue.WriteNullable(kinsoku);
			oValue.WriteNullable(defaultTextStyle);

			XmlUtils::SaveToFile(filename.m_strFilename, XmlUtils::CreateNode(_T("p:presentation"), oAttr, oValue));

			content.registration(type().OverrideType(), directory, filename);
			m_written = true;
			m_WrittenFileName = filename.GetFilename();
			FileContainer::write(filename, directory, content);
		}

		virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
		{
			pWriter->StartRecord(NSBinPptxRW::NSMainTables::Presentation);

			pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeStart);
			
			pWriter->WriteBool2(0, attrAutoCompressPictures);
			pWriter->WriteInt2(1, attrBookmarkIdSeed);
			pWriter->WriteBool2(2, attrCompatMode);
			pWriter->WriteLimit2(3, attrConformance);
			pWriter->WriteBool2(4, attrEmbedTrueTypeFonts);
			pWriter->WriteInt2(5, attrFirstSlideNum);
			pWriter->WriteBool2(6, attrRemovePersonalInfoOnSave);
			pWriter->WriteBool2(7, attrRtl);
			pWriter->WriteBool2(8, attrSaveSubsetFonts);
			pWriter->WriteString2(9, attrServerZoom);
			pWriter->WriteBool2(10, attrShowSpecialPlsOnTitleSld);
			pWriter->WriteBool2(11, attrStrictFirstAndLastChars);
			
			pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeEnd);

			pWriter->WriteRecord2(0, defaultTextStyle);
			pWriter->WriteRecordArray(1, 0, embeddedFontLst);
			pWriter->WriteRecord2(2, kinsoku);
			pWriter->WriteRecord2(3, notesSz);
			pWriter->WriteRecord2(4, photoAlbum);
			pWriter->WriteRecord2(5, sldSz);

			pWriter->WriteRecord2(6, commentAuthors);

			pWriter->EndRecord();
		}
		virtual void fromPPTY(NSBinPptxRW::CBinaryFileReader* pReader)
		{
			BYTE _type = pReader->GetUChar();
			LONG _len = pReader->GetULong();
			LONG _start_pos = pReader->GetPos();
			LONG _end_pos = _len + _start_pos;

			
			BYTE _sa = pReader->GetUChar();

			while (true)
			{
				BYTE _at = pReader->GetUChar();

				if (_at == NSBinPptxRW::g_nodeAttributeEnd)
					break;

				switch (_at)
				{
					case 0: { attrAutoCompressPictures		= pReader->GetBool(); break; }
					case 1: { attrBookmarkIdSeed			= pReader->GetLong(); break; }
					case 2: { attrCompatMode				= pReader->GetBool(); break; }
					case 3: { attrConformance				= pReader->GetUChar(); break; }
					case 4: { attrEmbedTrueTypeFonts		= pReader->GetBool(); break; }
					case 5: { attrFirstSlideNum				= pReader->GetLong(); break; }
					case 6: { attrRemovePersonalInfoOnSave	= pReader->GetBool(); break; }
					case 7: { attrRtl						= pReader->GetBool(); break; }
					case 8: { attrSaveSubsetFonts			= pReader->GetBool(); break; }
					case 9: { attrServerZoom				= pReader->GetString2(); break; }
					case 10: { attrShowSpecialPlsOnTitleSld = pReader->GetBool(); break; }
					case 11: { attrStrictFirstAndLastChars	= pReader->GetBool(); break; }
					default:
						return;
				}
			}

			while (true)
			{
				if (pReader->GetPos() >= _end_pos)
					break;

				_type = pReader->GetUChar();
				switch (_type)
				{
					case 0:
					{
						defaultTextStyle = PPTX::Logic::TextListStyle();
						defaultTextStyle->m_name = _T("p:defaultTextStyle");
						defaultTextStyle->fromPPTY(pReader);
						break;
					}
					case 1: { pReader->SkipRecord(); break; }
					case 2: { pReader->SkipRecord(); break; }
					case 3: 
					{ 
						notesSz = new nsPresentation::NotesSz();
						pReader->Skip(5); 

						while (true)
						{
							BYTE _at = pReader->GetUChar();

							if (_at == NSBinPptxRW::g_nodeAttributeEnd)
								break;

							switch (_at)
							{
								case 0: { notesSz->cx = pReader->GetLong(); break; }
								case 1: { notesSz->cy = pReader->GetLong(); break; }
								default:
									return;
							}
						}
						break; 
					}
					case 4: { pReader->SkipRecord(); break; }
					case 5:
					{
						sldSz = new nsPresentation::SldSz();
						pReader->Skip(5); 

						while (true)
						{
							BYTE _at = pReader->GetUChar();

							if (_at == NSBinPptxRW::g_nodeAttributeEnd)
								break;

							switch (_at)
							{
								case 0: { sldSz->cx = pReader->GetLong(); break; }
								case 1: { sldSz->cy = pReader->GetLong(); break; }
								case 2: { sldSz->type = pReader->GetUChar(); break; }
								default:
									return;
							}
						}

						break;
					}
					case 6:
					{
						commentAuthors = new PPTX::Authors();
						commentAuthors->fromPPTY(pReader);
						break;
					}
					default:
					{
						pReader->Seek(_end_pos);
						return;
					}
				}
			}

			pReader->Seek(_end_pos);
		}

		virtual void toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const
		{
			pWriter->StartNode(_T("p:presentation"));

			pWriter->StartAttributes();

			pWriter->WriteAttribute(_T("xmlns:a"), OOX::g_Namespaces.a.m_strLink);
			pWriter->WriteAttribute(_T("xmlns:r"), OOX::g_Namespaces.r.m_strLink);
			pWriter->WriteAttribute(_T("xmlns:p"), OOX::g_Namespaces.p.m_strLink);

			pWriter->WriteAttribute(_T("autoCompressPictures"), attrAutoCompressPictures);
			pWriter->WriteAttribute(_T("bookmarkIdSeed"), attrBookmarkIdSeed);
			pWriter->WriteAttribute(_T("compatMode"), attrCompatMode);
			pWriter->WriteAttribute(_T("conformance"), attrConformance);
			pWriter->WriteAttribute(_T("embedTrueTypeFonts"), attrEmbedTrueTypeFonts);
			pWriter->WriteAttribute(_T("firstSlideNum"), attrFirstSlideNum);
			pWriter->WriteAttribute(_T("removePersonalInfoOnSave"), attrRemovePersonalInfoOnSave);
			pWriter->WriteAttribute(_T("rtl"), attrRtl);
			pWriter->WriteAttribute(_T("saveSubsetFonts"), attrSaveSubsetFonts);
			pWriter->WriteAttribute(_T("serverZoom"), attrServerZoom);
			pWriter->WriteAttribute(_T("showSpecialPlsOnTitleSld"), attrShowSpecialPlsOnTitleSld);
			pWriter->WriteAttribute(_T("strictFirstAndLastChars"), attrStrictFirstAndLastChars);

			pWriter->EndAttributes();

			pWriter->WriteArray(_T("p:sldMasterIdLst"), sldMasterIdLst);
			pWriter->WriteArray(_T("p:notesMasterIdLst"), notesMasterIdLst);
			pWriter->WriteArray(_T("p:handoutMasterIdLst"), handoutMasterIdLst);
			pWriter->WriteArray(_T("p:embeddedFontLst"), embeddedFontLst);
			pWriter->WriteArray(_T("p:sldIdLst"), sldIdLst);
			
			pWriter->Write(sldSz);
			pWriter->Write(notesSz);
			pWriter->Write(photoAlbum);
			pWriter->Write(kinsoku);
			pWriter->Write(defaultTextStyle);

			pWriter->EndNode(_T("p:presentation"));
		}

	public:
		virtual const OOX::FileType type() const
		{
			return OOX::FileTypes::Presentation;
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
		
		
		
		nullable<Logic::TextListStyle>			defaultTextStyle;
		CAtlArray<nsPresentation::EmbeddedFont> embeddedFontLst;
		CAtlArray<Logic::XmlId>					handoutMasterIdLst;
		nullable<nsPresentation::Kinsoku>		kinsoku;
		
		CAtlArray<Logic::XmlId>					notesMasterIdLst;
		nullable<nsPresentation::NotesSz>		notesSz;
		nullable<nsPresentation::PhotoAlbum>	photoAlbum;
		CAtlArray<Logic::XmlId>					sldIdLst;
		CAtlArray<Logic::XmlId>					sldMasterIdLst;
		nullable<nsPresentation::SldSz>			sldSz;
		

		
		nullable_bool							attrAutoCompressPictures;
		nullable_int							attrBookmarkIdSeed;
		nullable_bool							attrCompatMode;
		nullable_limit<Limit::Conformance>		attrConformance;
		nullable_bool							attrEmbedTrueTypeFonts;
		nullable_int							attrFirstSlideNum;
		nullable_bool							attrRemovePersonalInfoOnSave;
		nullable_bool							attrRtl;
		nullable_bool							attrSaveSubsetFonts;
		nullable_string							attrServerZoom;
		nullable_bool							attrShowSpecialPlsOnTitleSld;
		nullable_bool							attrStrictFirstAndLastChars;

		smart_ptr<PPTX::Authors>				commentAuthors;

	private:
		Logic::ClrMap		m_clrMap;
		nsTheme::ClrScheme	m_clrScheme;
	public:
		void SetClrMap(Logic::ClrMap map)				{m_clrMap = map;};
		void SetClrScheme(nsTheme::ClrScheme scheme)	{m_clrScheme = scheme;};

		DWORD GetRGBAFromMap(const CString& str)const
		{
			return m_clrScheme.GetRGBAFromScheme(m_clrMap.GetColorSchemeIndex(str));
		}
		DWORD GetARGBFromMap(const CString& str)const
		{
			return m_clrScheme.GetARGBFromScheme(m_clrMap.GetColorSchemeIndex(str));
		}
		DWORD GetBGRAFromMap(const CString& str)const
		{
			return m_clrScheme.GetBGRAFromScheme(m_clrMap.GetColorSchemeIndex(str));
		}
		DWORD GetABGRFromMap(const CString& str)const
		{
			return m_clrScheme.GetABGRFromScheme(m_clrMap.GetColorSchemeIndex(str));
		}

	private:
		AVSINLINE void Normalize()
		{
			attrBookmarkIdSeed.normalize(1, 2147483647);
			attrFirstSlideNum.normalize_positive();
		}
	};
} 

#endif // PPTX_PRESENTATION_FILE_INCLUDE_H_