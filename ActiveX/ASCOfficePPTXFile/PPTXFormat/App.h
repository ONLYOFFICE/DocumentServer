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
#ifndef PPTX_APP_FILE_INCLUDE_H_
#define PPTX_APP_FILE_INCLUDE_H_

#include "WrapperFile.h"
#include "Logic/PartTitle.h"
#include "Logic/HeadingVariant.h"
#include "DocxFormat/FileTypes.h"

using namespace NSBinPptxRW;

namespace PPTX
{
	class App : public WrapperFile
	{
	public:
		App()
		{
		}
		App(const OOX::CPath& filename, FileMap& map)
		{
			read(filename, map);
		}
		virtual ~App()
		{
		}

	public:
		virtual void read(const OOX::CPath& filename, FileMap& map)
		{
			HeadingPairs.RemoveAll();
			TitlesOfParts.RemoveAll();

			XmlUtils::CXmlNode oNode;
			oNode.FromXmlFile2(filename.m_strFilename);

			oNode.ReadNodeValueBase(L"Template", Template);
			oNode.ReadNodeValueBase(L"TotalTime", TotalTime);
			oNode.ReadNodeValueBase(L"Words", Words);
			oNode.ReadNodeValueBase(L"Application", Application);
			oNode.ReadNodeValueBase(L"PresentationFormat", PresentationFormat);
			oNode.ReadNodeValueBase(L"Paragraphs", Paragraphs);
			oNode.ReadNodeValueBase(L"Slides", Slides);
			oNode.ReadNodeValueBase(L"Notes", Notes);
			oNode.ReadNodeValueBase(L"HiddenSlides", HiddenSlides);
			oNode.ReadNodeValueBase(L"MMClips", MMClips);
			oNode.ReadNodeValueBase(L"ScaleCrop", ScaleCrop);

			XmlUtils::CXmlNode oHP = oNode.ReadNode(_T("HeadingPairs"));
			XmlUtils::CXmlNode oNodeVector1;
			if (oHP.GetNode(_T("vt:vector"), oNodeVector1))
			{
				oNodeVector1.ReadAttributeBase(_T("size"), m_Headings);
				oNodeVector1.LoadArray(_T("vt:variant"), HeadingPairs);
			}

			XmlUtils::CXmlNode oTP = oNode.ReadNode(_T("TitlesOfParts"));
			XmlUtils::CXmlNode oNodeVector2;
			if (oTP.GetNode(_T("vt:vector"), oNodeVector2))
			{
				oNodeVector2.ReadAttributeBase(_T("size"), m_VectorSize);
				oNodeVector2.LoadArray(_T("vt:variant"), TitlesOfParts);
			}

			oNode.ReadNodeValueBase(L"Company", Company);
			oNode.ReadNodeValueBase(L"LinksUpToDate", LinksUpToDate);
			oNode.ReadNodeValueBase(L"SharedDoc", SharedDoc);
			oNode.ReadNodeValueBase(L"HyperlinksChanged", HyperlinksChanged);
			oNode.ReadNodeValueBase(L"AppVersion", AppVersion);
			
			
			
			
			
			
			
			
			
			

			Normalize();
		}
		virtual void write(const OOX::CPath& filename, const OOX::CPath& directory, OOX::ContentTypes::File& content)const
		{
			XmlUtils::CAttribute oAttr;
			oAttr.Write(_T("xmlns"), OOX::g_Namespaces.xmlns.m_strLink);
			oAttr.Write(_T("xmlns:vt"), OOX::g_Namespaces.vt.m_strLink);

			XmlUtils::CNodeValue oValue;
			oValue.Write2(_T("Template"), Template);
			oValue.Write2(_T("TotalTime"), TotalTime);
			oValue.Write2(_T("Words"), Words);
			oValue.Write2(_T("Application"), Application);
			oValue.Write2(_T("PresentationFormat"), PresentationFormat);
			oValue.Write2(_T("Paragraphs"), Paragraphs);
			oValue.Write2(_T("Slides"), Slides);
			oValue.Write2(_T("Notes"), Notes);
			oValue.Write2(_T("HiddenSlides"), HiddenSlides);
			oValue.Write2(_T("MMClips"), MMClips);
			oValue.Write2(_T("ScaleCrop"), ScaleCrop);

			XmlUtils::CAttribute oAttr1;
			oAttr1.Write(_T("size"), m_Headings);
			oAttr1.Write(_T("baseType"), _T("variant"));

			XmlUtils::CNodeValue oValue1;
			oValue1.WriteArray(HeadingPairs);

			oValue.Write2(_T("HeadingPairs"), XmlUtils::CreateNode(_T("vt:vector"), oAttr1, oValue1));

			XmlUtils::CAttribute oAttr2;
			oAttr2.Write(_T("size"), m_Headings);
			oAttr2.Write(_T("baseType"), _T("lpstr"));

			XmlUtils::CNodeValue oValue2;
			oValue2.WriteArray(HeadingPairs);

			oValue.Write2(_T("TitlesOfParts"), XmlUtils::CreateNode(_T("vt:vector"), oAttr2, oValue2));
			
			oValue.Write2(_T("Company"), Company);
			oValue.Write2(_T("LinksUpToDate"), LinksUpToDate);
			oValue.Write2(_T("SharedDoc"), SharedDoc);
			oValue.Write2(_T("HyperlinksChanged"), HyperlinksChanged);
			oValue.Write2(_T("AppVersion"), AppVersion);

			XmlUtils::SaveToFile(filename.m_strFilename, XmlUtils::CreateNode(_T("Properties"), oAttr, oValue));

			
			
			
			
			
			
			
			
			
			
			
			
			content.registration(type().OverrideType(), directory, filename);
			m_written = true;

			m_WrittenFileName.m_strFilename = filename.GetFilename();
		}

	public:
		virtual const OOX::FileType type() const
		{
			return OOX::FileTypes::App;
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
			pWriter->StartRecord(NSMainTables::App);

			pWriter->WriteBYTE(g_nodeAttributeStart);

			pWriter->WriteString2(0, Template);
			pWriter->WriteString2(1, Application);
			pWriter->WriteString2(2, PresentationFormat);
			pWriter->WriteString2(3, Company);
			pWriter->WriteString2(4, AppVersion);

			pWriter->WriteInt2(5, TotalTime);
			pWriter->WriteInt2(6, Words);
			pWriter->WriteInt2(7, Paragraphs);
			pWriter->WriteInt2(8, Slides);
			pWriter->WriteInt2(9, Notes);
			pWriter->WriteInt2(10, HiddenSlides);
			pWriter->WriteInt2(11, MMClips);
			
			pWriter->WriteBool2(12, ScaleCrop);
			pWriter->WriteBool2(13, LinksUpToDate);
			pWriter->WriteBool2(14, SharedDoc);
			pWriter->WriteBool2(15, HyperlinksChanged);

			pWriter->WriteBYTE(g_nodeAttributeEnd);

			pWriter->EndRecord();
		}
		virtual void toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const
		{
			pWriter->StartNode(_T("Properties"));

			pWriter->StartAttributes();

			pWriter->WriteAttribute(_T("xmlns"), OOX::g_Namespaces.xmlns.m_strLink);
			pWriter->WriteAttribute(_T("xmlns:vt"), OOX::g_Namespaces.vt.m_strLink);

			pWriter->EndAttributes();

			pWriter->WriteNodeValue(_T("Template"), Template);
			pWriter->WriteNodeValue(_T("TotalTime"), TotalTime);
			pWriter->WriteNodeValue(_T("Words"), Words);
			pWriter->WriteNodeValue(_T("Application"), Application);
			pWriter->WriteNodeValue(_T("PresentationFormat"), PresentationFormat);
			pWriter->WriteNodeValue(_T("Paragraphs"), Paragraphs);
			pWriter->WriteNodeValue(_T("Slides"), Slides);
			pWriter->WriteNodeValue(_T("Notes"), Notes);
			pWriter->WriteNodeValue(_T("HiddenSlides"), HiddenSlides);
			pWriter->WriteNodeValue(_T("MMClips"), MMClips);
			pWriter->WriteNodeValue(_T("ScaleCrop"), ScaleCrop);

			pWriter->StartNode(_T("HeadingPairs"));
			pWriter->EndAttributes();

			pWriter->StartNode(_T("vt:vector"));
			pWriter->StartAttributes();
			pWriter->WriteAttribute(_T("size"), (int)HeadingPairs.GetCount());
			pWriter->WriteAttribute(_T("baseType"), (CString)_T("variant"));
			pWriter->EndAttributes();

			pWriter->WriteArray2(HeadingPairs);

			pWriter->EndNode(_T("vt:vector"));
			pWriter->EndNode(_T("HeadingPairs"));

			pWriter->StartNode(_T("TitlesOfParts"));
			pWriter->EndAttributes();

			pWriter->StartNode(_T("vt:vector"));
			pWriter->StartAttributes();
			pWriter->WriteAttribute(_T("size"), (int)TitlesOfParts.GetCount());
			pWriter->WriteAttribute(_T("baseType"), (CString)_T("lpstr"));
			pWriter->EndAttributes();

			pWriter->WriteArray2(TitlesOfParts);

			pWriter->EndNode(_T("vt:vector"));
			pWriter->EndNode(_T("TitlesOfParts"));

			pWriter->WriteNodeValue(_T("Company"), Company);
			pWriter->WriteNodeValue(_T("LinksUpToDate"), LinksUpToDate);
			pWriter->WriteNodeValue(_T("SharedDoc"), SharedDoc);
			pWriter->WriteNodeValue(_T("HyperlinksChanged"), HyperlinksChanged);
			pWriter->WriteNodeValue(_T("AppVersion"), AppVersion);

			pWriter->EndNode(_T("Properties"));
		}

	public:
		nullable_string						Template;				
		nullable_int						TotalTime;				
		nullable_int						Words;					
		nullable_string						Application;			
		nullable_string						PresentationFormat;		
		nullable_int						Paragraphs;				
		nullable_int						Slides;					
		nullable_int						Notes;					
		nullable_int						HiddenSlides;			
		nullable_int						MMClips;				
		nullable_bool						ScaleCrop;				
		CAtlArray<Logic::HeadingVariant>	HeadingPairs;			
		CAtlArray<Logic::PartTitle>			TitlesOfParts;			
		nullable_string						Company;				
		nullable_bool						LinksUpToDate;			
		nullable_bool						SharedDoc;				
		nullable_bool						HyperlinksChanged;		
		nullable_string						AppVersion;				

		
		
		
		
		
		
		
		
		
	private:
		nullable_int						m_VectorSize;
		nullable_int						m_Headings;

		AVSINLINE void Normalize()
		{
			TotalTime.normalize_positive();
			Words.normalize_positive();
			Paragraphs.normalize_positive();
			Slides.normalize_positive();
			Notes.normalize_positive();
			HiddenSlides.normalize_positive();
			MMClips.normalize_positive();
			m_VectorSize.normalize_positive();
			m_Headings.normalize_positive();
		}		
	};
} 

#endif // PPTX_APP_FILE_INCLUDE_H_