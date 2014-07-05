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
#ifndef PPTX_CORE_FILE_INCLUDE_H_
#define PPTX_CORE_FILE_INCLUDE_H_

#include "WrapperFile.h"
#include "DocxFormat/WritingElement.h"

#include "Limit/ContentStatus.h"
#include "DocxFormat/FileTypes.h"

using namespace NSBinPptxRW;

namespace PPTX
{
	class Core : public WrapperFile
	{
	public:
		Core()
		{
		}
		Core(const OOX::CPath& filename, FileMap& map)
		{
			read(filename, map);
		}
		virtual ~Core()
		{
		}

	public:
		virtual void read(const OOX::CPath& filename, FileMap& map)
		{
			XmlUtils::CXmlNode oNode;
			oNode.FromXmlFile2(filename.m_strFilename);

			oNode.ReadNodeValueBase(_T("dc:title"), title);
			oNode.ReadNodeValueBase(_T("dc:creator"), creator);
			oNode.ReadNodeValueBase(_T("cp:lastModifiedBy"), lastModifiedBy);
			oNode.ReadNodeValueBase(_T("cp:revision"), revision);
			oNode.ReadNodeValueBase(_T("dcterms:modified"), modified);
			oNode.ReadNodeValueBase(_T("dcterms:created"), created);

	
	
	
		}
		virtual void write(const OOX::CPath& filename, const OOX::CPath& directory, OOX::ContentTypes::File& content)const
		{
			XmlUtils::CAttribute oAttr;
			oAttr.Write(_T("xmlns:dc"), OOX::g_Namespaces.dc.m_strLink);
			
			oAttr.Write(_T("xmlns:dcterms"), OOX::g_Namespaces.dcterms.m_strLink);
			oAttr.Write(_T("xmlns:xsi"), OOX::g_Namespaces.xsi.m_strLink);

			XmlUtils::CNodeValue oValue;
			oValue.Write2(_T("dc:title"), title);
			oValue.Write2(_T("dc:creator"), creator);
			oValue.Write2(_T("cp:lastModifiedBy"), lastModifiedBy);
			oValue.Write2(_T("cp:revision"), revision);

			if (created.IsInit())
			{
				oValue.m_strValue += _T("<dcterms:created xsi:type=\"dcterms:W3CDTF\">");
				oValue.m_strValue += *created;
				oValue.m_strValue += _T("</dcterms:created>");
			}		
			
			oValue.m_strValue += _T("<dcterms:modified xsi:type=\"dcterms:W3CDTF\">");
			if (modified.IsInit())
				oValue.m_strValue += *modified;
			oValue.m_strValue += _T("</dcterms:modified>");

			XmlUtils::SaveToFile(filename.m_strFilename, XmlUtils::CreateNode(_T("cp:coreProperties"), oAttr, oValue));

	
			content.registration(type().OverrideType(), directory, filename);
			m_written = true;
			m_WrittenFileName = filename.GetFilename();
		}

	public:
		virtual const OOX::FileType type() const
		{
			return OOX::FileTypes::Core;
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
			pWriter->StartRecord(NSMainTables::Core);

			pWriter->WriteBYTE(g_nodeAttributeStart);

			pWriter->WriteString2(0, title);
			pWriter->WriteString2(1, creator);
			pWriter->WriteString2(2, lastModifiedBy);
			pWriter->WriteString2(3, revision);
			pWriter->WriteString2(4, created);
			pWriter->WriteString2(5, modified);

			pWriter->WriteBYTE(g_nodeAttributeEnd);

			pWriter->EndRecord();
		}
		virtual void toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const
		{
			pWriter->StartNode(_T("cp:coreProperties"));

			pWriter->StartAttributes();

			pWriter->WriteAttribute(_T("xmlns:cp"), OOX::g_Namespaces.cp.m_strLink);
			pWriter->WriteAttribute(_T("xmlns:dc"), OOX::g_Namespaces.dc.m_strLink);
			pWriter->WriteAttribute(_T("xmlns:dcterms"), OOX::g_Namespaces.dcterms.m_strLink);
			pWriter->WriteAttribute(_T("xmlns:xsi"), OOX::g_Namespaces.xsi.m_strLink);

			pWriter->EndAttributes();

			pWriter->WriteNodeValue(_T("dc:title"), title);
			pWriter->WriteNodeValue(_T("dc:creator"), creator);
			pWriter->WriteNodeValue(_T("cp:lastModifiedBy"), lastModifiedBy);
			pWriter->WriteNodeValue(_T("cp:revision"), revision);

			pWriter->WriteNodeValue(_T("dcterms:created xsi:type=\"dcterms:W3CDTF\""), created);
			pWriter->WriteNodeValue(_T("dcterms:modified xsi:type=\"dcterms:W3CDTF\""), modified);
			
			pWriter->EndNode(_T("cp:coreProperties"));
		}

	public:
		nullable_string		title;
		nullable_string		creator;
		nullable_string		lastModifiedBy;
		nullable_string		revision;

		nullable_string		created;

		nullable_string		modified;

	};
} 

#endif // PPTX_CORE_FILE_INCLUDE_H_