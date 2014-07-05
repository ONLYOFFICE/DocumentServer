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
#ifndef PPTX_IFILE_CONTAINER_INCLUDE_H_
#define PPTX_IFILE_CONTAINER_INCLUDE_H_

#include "DocxFormat/IFileContainer.h"
#include "FileMap.h"
#include "PPTXEvent.h"

namespace PPTX
{
	class FileContainer : public OOX::IFileContainer
	{
	public:
		FileContainer()
		{
			m_lPercent = 0;
			m_bCancelled = false;
		}
		virtual ~FileContainer()
		{
		}
	protected:
		void read(const OOX::CPath& filename);
		void read(const OOX::Rels::File& rels, const OOX::CPath& path);

		void read(const OOX::CPath& filename, FileMap& map, IPPTXEvent* Event);
		void read(const OOX::Rels::File& rels, const OOX::CPath& path, FileMap& map, IPPTXEvent* Event);
		void write(const OOX::CPath& filename, const OOX::CPath& directory, OOX::ContentTypes::File& content) const;
		void write(OOX::Rels::File& rels, const OOX::CPath& current, const OOX::CPath& directory, OOX::ContentTypes::File& content) const;

		void WrittenSetFalse();

		long m_lPercent;
		bool m_bCancelled;
	};

	class CCommonRels : public PPTX::FileContainer
	{
	public:
		CCommonRels() : PPTX::FileContainer()
		{
		}
	
		void _read(const OOX::CPath& filename);
		void _read(const OOX::Rels::File& rels, const OOX::CPath& path);
	};
} 

#endif // PPTX_IFILE_CONTAINER_INCLUDE_H_