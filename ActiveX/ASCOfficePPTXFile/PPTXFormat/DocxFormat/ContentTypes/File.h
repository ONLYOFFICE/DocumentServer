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
#ifndef OOX_CONTENT_TYPES_FILE_INCLUDE_H_
#define OOX_CONTENT_TYPES_FILE_INCLUDE_H_

#include "OverrideTable.h"
#include "DefaultTable.h"
#include "./../FileType.h"


namespace OOX
{
	namespace ContentTypes
	{
		static const CPath s_filename = L"[Content_Types].xml";

		class File
		{
		public:
			File()
			{
			}
			File(const CPath& path)
			{
				read(path);
			}
			virtual ~File()
			{
			}

		public:
			virtual void read(const CPath& path)
			{
				OOX::CPath oPath = path / s_filename;
				XmlUtils::CXmlNode oNode;
				if (oNode.FromXmlFile(oPath.m_strFilename))
				{
					Default		= oNode;
					Override	= oNode;
				}
			}
			virtual void write(const CPath& path) const
			{
				XmlUtils::CAttribute oAttr;
				oAttr.Write(_T("xmlns"), _T("http://schemas.openxmlformats.org/package/2006/content-types"));

				XmlUtils::CNodeValue oValue;
				oValue.Write(Default);
				oValue.Write(Override);

				OOX::CPath savepath = path / s_filename;

				XmlUtils::SaveToFile(savepath.m_strFilename, XmlUtils::CreateNode(_T("Types"), oAttr, oValue));
			}
			virtual const bool isValid() const
			{
				return true;
			}

		public:
			void registration(const CString& type, const CPath& directory, const CPath& filename)
			{
				Override.add(type, directory / filename.m_strFilename);
				Default.add(directory / filename.m_strFilename);
			}

		public:
			OverrideTable	Override;
			DefaultTable	Default;
		};
	} 
} 

#endif // DOCX_CONTENT_TYPES_FILE_INCLUDE_H_