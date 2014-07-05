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
#ifndef OOX_RELS_FILE_INCLUDE_H_
#define OOX_RELS_FILE_INCLUDE_H_

#include "RelationTable.h"
#include "./../FileType.h"
#include "./../FileTypes.h"
#include "./../RId.h"
#include "./../External/External.h"

#include "../../../../Common/DocxFormat/Source/Base/SmartPtr.h"
#include "../../../../Common/DocxFormat/Source/SystemUtility/SystemUtility.h"


namespace OOX
{
	namespace Rels
	{
		class File
		{
		public:
			File()
			{
			}
			File(const CPath& filename)
			{
				read(filename);
			}
			~File()
			{
			}

		public:
			void read(const CPath& filename)
			{
				CPath strFile = createFileName(filename);

				if (CSystemUtility::IsFileExist(strFile))
				{
					XmlUtils::CXmlNode oNode;
					if (oNode.FromXmlFile2(strFile.GetPath()))
						Relations = oNode;
				}
			}
			void read2(const CPath& filename)
			{
				CPath strFile = filename;

				if (CSystemUtility::IsFileExist(strFile))
				{
					XmlUtils::CXmlNode oNode;
					if (oNode.FromXmlFile2(strFile.GetPath()))
						Relations = oNode;
				}
			}
			void write(const CPath& filename) const
			{
				if (0 < Relations.m_items.GetCount())
				{
					CPath file = createFileName(filename);
					CSystemUtility::CreateDirectories(file.GetDirectory());

					XmlUtils::CXmlWriter oWriter;
					oWriter.WriteNodeBegin(_T("Relationship"), TRUE);
					oWriter.WriteAttribute(_T("xmlns"), _T("http://schemas.openxmlformats.org/package/2006/relationships"));
					oWriter.WriteNodeEnd(_T("Relationship"), FALSE, TRUE);

					oWriter.WriteString(Relations.toXML());

					oWriter.WriteNodeEnd(_T("Relationship"));

					CDirectory::SaveToFile(file.GetPath(), oWriter.GetXmlString());
				}
			}
			const bool isValid() const
			{
				return true;
			}

		public:
			void registration(const RId& rId, const FileType& type, const CPath& filename)
			{
				if(!(type == FileTypes::Unknow))
				{
					CString strFileName	= filename.m_strFilename;
					CString strDir		= filename.GetDirectory() + _T("");
					if (_T("") == filename.GetExtention())
					{
						if (type.RelationType() == "http://schemas.openxmlformats.org/officeDocument/2006/relationships/oleObject")
						{
							strFileName += L".bin";
							Relations.registration(rId, type.RelationType(), strDir + strFileName);
						}
						else if (type.RelationType() =="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image")
						{
							strFileName += L".wmf" ;
							Relations.registration(rId, type.RelationType(), strDir + strFileName);
						}
					}
					else
					{
						
					}
				}
			}
			void registration(const RId& rId, const smart_ptr<External> external)
			{
				Relations.registration(rId, external);
			}

		private:
			const CPath createFileName(const CPath& filename) const
			{
				CString strTemp = filename.GetDirectory() + _T("\\_rels\\");
				if (filename.GetFilename() == _T(""))
					strTemp += _T(".rels");
				else
					strTemp += (filename.GetFilename() + _T(".rels"));
				return strTemp;
			}
			
		public:
			RelationTable Relations;
		};
	} 
} 

#endif // OOX_RELS_FILE_INCLUDE_H_