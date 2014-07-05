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

#include "FileContainer.h"
#include "DocxFormat/Rels/File.h"
#include "FileFactory.h"
#include "DocxFormat/ContentTypes/File.h"
#include "DocxFormat/FileType.h"
#include "DocxFormat/FileTypes.h"
#include "DocxFormat/External/Hyperlink.h"
#include "WrapperFile.h"

namespace PPTX
{
	void FileContainer::read(const OOX::CPath& filename)
	{
		
	}

	void FileContainer::read(const OOX::Rels::File& rels, const OOX::CPath& path)
	{
		
	}

	void FileContainer::read(const OOX::CPath& filename, FileMap& map, IPPTXEvent* Event)
	{
		OOX::Rels::File rels(filename);
		OOX::CPath path = filename.GetDirectory();
		read(rels, path, map, Event);
	}

	void FileContainer::read(const OOX::Rels::File& rels, const OOX::CPath& path, FileMap& map, IPPTXEvent* Event)
	{
		bool bIsSlide = false;
		OOX::File* pSrcFile = dynamic_cast<OOX::File*>(this);
		if (NULL != pSrcFile)
			bIsSlide = (pSrcFile->type() == OOX::FileTypes::Slide) ? true : false;

		size_t nCount = rels.Relations.m_items.GetCount();
		for (size_t i = 0; i < nCount; ++i)
		{
			const OOX::Rels::RelationShip* pRelation = &(rels.Relations.m_items[i]);
			OOX::CPath normPath = path / pRelation->target();

			CAtlMap<CString, smart_ptr<OOX::File>>::CPair* pPair = map.find(normPath);

			if (bIsSlide && (pRelation->type() == OOX::FileTypes::Slide))
			{
				long percent = Event->GetPercent();

				smart_ptr<OOX::File> file = smart_ptr<OOX::File>(new OOX::HyperLink(pRelation->target()));

				bool res = Event->Progress(0, percent + m_lPercent);
				if (res)
				{
					m_bCancelled = true;
					break;
				}

				add(pRelation->rId(), file);			
			}
			else
			{
				if (NULL != pPair)
				{
					add(pRelation->rId(), pPair->m_value);
				}
				else
				{
					long percent = Event->GetPercent();

					smart_ptr<OOX::File> file = PPTX::FileFactory::CreateFilePPTX(path, *pRelation, map);													
					bool res = Event->Progress(0, percent + m_lPercent);
					if (res)
					{
						m_bCancelled = true;
						break;
					}
					
					map.add(normPath, file);
					add(pRelation->rId(), file);

					smart_ptr<FileContainer> pContainer = file.smart_dynamic_cast<FileContainer>();
					if (pContainer.IsInit())
					{
						pContainer->m_lPercent = m_lPercent;
						Event->AddPercent(m_lPercent);

						pContainer->read(normPath, map, Event);
						m_bCancelled = pContainer->m_bCancelled;
					}
				}
			}
		}
	}

	void FileContainer::write(const OOX::CPath& filename, const OOX::CPath& directory, OOX::ContentTypes::File& content) const
	{
		OOX::Rels::File rels;
		OOX::CPath current = filename.GetDirectory();
		write(rels, current, directory, content);
		rels.write(filename);
	}

	void FileContainer::write(OOX::Rels::File& rels, const OOX::CPath& curdir, const OOX::CPath& directory, OOX::ContentTypes::File& content) const
	{
		CAtlMap<CString, size_t> namepair;

		POSITION pos = m_container.GetStartPosition();
		while (NULL != pos)
		{
			const CAtlMap<CString, smart_ptr<OOX::File>>::CPair* pPair = m_container.GetNext(pos);

			smart_ptr<OOX::File>		pFile	= pPair->m_value;
			smart_ptr<OOX::External>	pExt	= pFile.smart_dynamic_cast<OOX::External>();

			if (!pExt.IsInit())
			{
				smart_ptr<PPTX::WrapperFile> file = pFile.smart_dynamic_cast<PPTX::WrapperFile>();

				if (file.IsInit())
				{
					if (file->GetWrittenStatus() == false)
					{
						OOX::CPath defdir	= pFile->DefaultDirectory();
						OOX::CPath name		= pFile->DefaultFileName();

						

						OOX::CSystemUtility::CreateDirectories(directory / defdir);
						pFile->write(directory / defdir / name, directory, content);
						rels.registration(pPair->m_key, pFile->type(), defdir / name);
					}
					else
					{
						OOX::CPath defdir	= pFile->DefaultDirectory();
						OOX::CPath name		= file->GetWrittenFileName();

						rels.registration(pPair->m_key, pFile->type(), defdir / name);
					}
				}
				else
				{
					OOX::CPath defdir	= pFile->DefaultDirectory();
					OOX::CPath name		= pFile->DefaultFileName();

					OOX::CSystemUtility::CreateDirectories(directory / defdir);
					pFile->write(directory / defdir / name, directory, content);
					rels.registration(pPair->m_key, pFile->type(), defdir / name);
				}
			}
			else
			{
				rels.registration(pPair->m_key, pExt);
			}
		}
	}

	void FileContainer::WrittenSetFalse()
	{
		POSITION pos = m_container.GetStartPosition();
		while (NULL != pos)
		{
			smart_ptr<OOX::File> pFile = m_container.GetNextValue(pos);

			smart_ptr<PPTX::WrapperFile>	pWrapFile = pFile.smart_dynamic_cast<PPTX::WrapperFile>();
			smart_ptr<PPTX::FileContainer>	pWrapCont = pFile.smart_dynamic_cast<PPTX::FileContainer>();

			if (pWrapFile.is_init() && !pWrapFile->GetWrittenStatus())
			{
				pWrapFile->WrittenSetFalse();	

				if (pWrapCont.is_init())
				{
					pWrapCont->WrittenSetFalse();
				}
			}			
		}
	}

	void CCommonRels::_read(const OOX::Rels::File& rels, const OOX::CPath& path)
	{
		size_t nCount = rels.Relations.m_items.GetCount();
		for (size_t i = 0; i < nCount; ++i)
		{
			const OOX::Rels::RelationShip* pRelation = &(rels.Relations.m_items[i]);

			smart_ptr<OOX::File> _file = PPTX::FileFactory::CreateFilePPTX_OnlyMedia(path, *pRelation);
			add(pRelation->rId(), _file);	
		}
	}

	void CCommonRels::_read(const OOX::CPath& filename)
	{
		OOX::Rels::File rels(filename);
		OOX::CPath path = filename.GetDirectory();
		_read(rels, path);
	}
} // namespace PPTX