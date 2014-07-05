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
#ifndef PPTX_VMLDRAWING_INCLUDE_H_
#define PPTX_VMLDRAWING_INCLUDE_H_

#include "WrapperFile.h"
#include "FileContainer.h"

#include "DocxFormat/RId.h"
#include "DocxFormat/Media/Image.h"

namespace PPTX
{
	class VmlDrawing : public WrapperFile, public PPTX::FileContainer
	{
	public:
		VmlDrawing()
		{
		}
		VmlDrawing(const OOX::CPath& filename, FileMap& map)
		{
			read(filename, map);
		}
		virtual ~VmlDrawing()
		{
		}

	public:
		virtual void read(const OOX::CPath& filename, FileMap& map)
		{
			
			XmlUtils::CXmlNode oNode;
			oNode.FromXmlFile2(filename.m_strFilename);

			m_strDocument = oNode.GetXml();
		}
		virtual void write(const OOX::CPath& filename, const OOX::CPath& directory, OOX::ContentTypes::File& content)const
		{
			XmlUtils::SaveToFile(filename.m_strFilename, m_strDocument);

			content.registration(type().OverrideType(), directory, filename);
			m_written = true;
			m_WrittenFileName = filename.GetFilename();
			FileContainer::write(filename, directory, content);
		}

	public:
		virtual const OOX::FileType type() const
		{
			return OOX::FileTypes::VmlDrawing;
		}
		virtual const OOX::CPath DefaultDirectory() const
		{
			return type().DefaultDirectory();
		}
		virtual const OOX::CPath DefaultFileName() const
		{
			return type().DefaultFileName();
		}

		
		CAtlMap<CString, OOX::CPath> SpIds;
	private:
		CString m_strDocument;

	public:
		void FillRIds()
		{
			XmlUtils::CXmlNode oNode;
			oNode.FromXmlString(m_strDocument);
			GetRIds(oNode);
		}
		void GetRIds(XmlUtils::CXmlNode& element)
		{
			XmlUtils::CXmlNodes oNodes;
			if (element.GetNodes(_T("*"), oNodes))
			{
				int nCount = oNodes.GetCount();
				for (int i = 0; i < nCount; ++i)
				{
					XmlUtils::CXmlNode oNode;
					oNodes.GetAt(i, oNode);

					CString strName = XmlUtils::GetNameNoNS(oNode.GetName());
					
					if (_T("shape") != strName)
					{
						GetRIds(oNode);
						continue;
					}

					nullable_string		id;
					nullable<OOX::RId>	rid;

					oNode.ReadAttributeBase(L"id", id);
					
					BSTR bsMem = oNode.ReadAttributeBase(L"spid");
					if (NULL != bsMem)
					{
						id = bsMem;
						SysFreeString(bsMem);
					}

					if (id.IsInit())
					{
						XmlUtils::CXmlNode oNodeR = oNode.ReadNodeNoNS(_T("imagedata"));
						if (oNodeR.IsValid())
						{
							oNodeR.ReadAttributeBase(L"o:relid", rid);

							if (rid.IsInit())
							{
								OOX::CPath path = image(*rid)->filename();
						 		SpIds.SetAt(*id, path);
							}
						}
					}

					oNode.ReadAttributeBase(L"spid", id);
				}
			}
		}
	};
} 

#endif // PPTX_VmlDrawingS_VmlDrawing_INCLUDE_H_