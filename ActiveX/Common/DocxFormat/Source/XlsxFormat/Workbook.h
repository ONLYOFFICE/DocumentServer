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
#ifndef OOX_WORKBOOK_FILE_INCLUDE_H_
#define OOX_WORKBOOK_FILE_INCLUDE_H_

#include "../../Base/Nullable.h"

#include "FileTypes.h"

namespace OOX
{
	namespace Spreadsheet
	{
		class CWorkbook : public OOX::File, public IFileContainer
		{
		public:
			CWorkbook()
			{
			}
			CWorkbook(const CPath& oPath)
			{
			}
			virtual ~CWorkbook()
			{
			}
		public:

			virtual void read(const CPath& oPath)
			{
			}
			virtual void write(const CPath& oPath, const CPath& oDirectory, CContentTypes& oContent) const
			{
			}
			virtual const OOX::FileType type() const
			{
				return OOX::Spreadsheet::FileTypes::Workbook;
			}
			virtual const CPath DefaultDirectory() const
			{
				return type().DefaultDirectory();
			}
			virtual const CPath DefaultFileName() const
			{
				return type().DefaultFileName();
			}
			const CPath& GetReadPath()
			{
				return m_oReadPath;
			}
		public:

			void ClearItems()
			{
			}

		private:
			CPath									m_oReadPath;
			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
					WritingElement_ReadAttributes_ReadSingle( oReader, _T("w:conformance"), m_oConformance )
					WritingElement_ReadAttributes_End( oReader )
			}

		public:

			CSimpleArray<WritingElement *>         m_arrItems;

		};
	} 
} 

#endif // OOX_WORKBOOK_FILE_INCLUDE_H_