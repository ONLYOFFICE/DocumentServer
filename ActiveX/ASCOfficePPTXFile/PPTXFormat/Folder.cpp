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
 #include "./stdafx.h"

#include "Folder.h"
#include "DocxFormat/Rels/File.h"
#include "FileMap.h"
#include "DocxFormat/FileTypes.h"
#include "Presentation.h"
#include "Theme.h"
#include "SlideMaster.h"
#include "SlideLayout.h"
#include "Slide.h"
#include "NotesMaster.h"

namespace PPTX
{
	Folder::Folder()
	{		
	}

	Folder::Folder(const OOX::CPath& path, IPPTXEvent* Event)
	{
		read(path, Event);
	}

	void Folder::read(const OOX::CPath& path, IPPTXEvent* Event)
	{
		OOX::Rels::File rels(path);
		PPTX::FileMap map;
		long files = CountFiles(path);
		if(files == 0)
			return;
		m_lPercent = 1000000 / files;
		FileContainer::read(rels, path, map, Event);
		if(m_bCancelled)
			return;

		POSITION pos = NULL;
		smart_ptr<PPTX::Presentation> _presentation = FileContainer::get(OOX::FileTypes::Presentation).smart_dynamic_cast<PPTX::Presentation>();
		if (_presentation.is_init())
		{
			_presentation->commentAuthors = _presentation->get(OOX::FileTypes::CommentAuthors).smart_dynamic_cast<PPTX::Authors>();
		}

		pos = map.m_map.GetStartPosition();
		while (NULL != pos)
		{
			CAtlMap<CString, smart_ptr<OOX::File>>::CPair* pPair = map.m_map.GetNext(pos);
			const OOX::FileType& curType = pPair->m_value->type();

			if (OOX::FileTypes::ThemePPTX == curType)
			{
				smart_ptr<PPTX::Theme> pTheme = pPair->m_value.smart_dynamic_cast<PPTX::Theme>();
				if (pTheme.IsInit())
					pTheme->Presentation = _presentation;
			}
		}

		pos = map.m_map.GetStartPosition();
		while (NULL != pos)
		{
			CAtlMap<CString, smart_ptr<OOX::File>>::CPair* pPair = map.m_map.GetNext(pos);
			const OOX::FileType& curType = pPair->m_value->type();

			if (OOX::FileTypes::SlideMaster == curType)
			{
				smart_ptr<PPTX::SlideMaster> pointer = pPair->m_value.smart_dynamic_cast<PPTX::SlideMaster>();
				if (pointer.is_init())
					pointer->ApplyRels();
			}
		}

		pos = map.m_map.GetStartPosition();
		while (NULL != pos)
		{
			CAtlMap<CString, smart_ptr<OOX::File>>::CPair* pPair = map.m_map.GetNext(pos);
			const OOX::FileType& curType = pPair->m_value->type();

			if (OOX::FileTypes::SlideLayout == curType)
			{
				smart_ptr<PPTX::SlideLayout> pointer = pPair->m_value.smart_dynamic_cast<PPTX::SlideLayout>();
				if (pointer.is_init())
					pointer->ApplyRels();
			}
		}

		pos = map.m_map.GetStartPosition();
		while (NULL != pos)
		{
			CAtlMap<CString, smart_ptr<OOX::File>>::CPair* pPair = map.m_map.GetNext(pos);
			const OOX::FileType& curType = pPair->m_value->type();

			if (OOX::FileTypes::Slide == curType)
			{
				smart_ptr<PPTX::Slide> pointer = pPair->m_value.smart_dynamic_cast<PPTX::Slide>();
				if (pointer.is_init())
					pointer->ApplyRels();
			}
		}

		pos = map.m_map.GetStartPosition();
		while (NULL != pos)
		{
			CAtlMap<CString, smart_ptr<OOX::File>>::CPair* pPair = map.m_map.GetNext(pos);
			const OOX::FileType& curType = pPair->m_value->type();

			if (OOX::FileTypes::NotesMaster == curType)
			{
				smart_ptr<PPTX::NotesMaster> pointer = pPair->m_value.smart_dynamic_cast<PPTX::NotesMaster>();
				if (pointer.is_init())
					pointer->ApplyRels();
			}
		}

		Event->Progress(0, 1000000);
	}

	void Folder::write(const OOX::CPath& path)
	{
		OOX::CSystemUtility::CreateDirectories(path);

		OOX::Rels::File rels;
		OOX::ContentTypes::File content;

		OOX::CPath dir = path;
		FileContainer::write(rels, path, dir, content);

		rels.write(path / _T("/"));
		content.write(path);
		FileContainer::WrittenSetFalse();
	}

	void Folder::createFromTemplate(const OOX::CPath& path)
	{
		
	}

	const bool Folder::isValid(const OOX::CPath& path) const
	{
		return true;
	}

	void Folder::extractPictures(const OOX::CPath& path)
	{
		OOX::CSystemUtility::CreateDirectories(path);
		FileContainer::extractPictures(path);
	}

	void Folder::extractPictures(const OOX::CPath& source, const OOX::CPath& path)
	{
		
		extractPictures(path);
	}

	long Folder::CountFiles(const OOX::CPath& path)
	{
		return OOX::CSystemUtility::GetFilesCount(path.GetDirectory(), true);
	}
} // namespace PPTX