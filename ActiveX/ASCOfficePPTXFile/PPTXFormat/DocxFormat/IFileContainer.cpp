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

#include "IFileContainer.h"
#include "Rels/File.h"

#ifndef NODOCX

#endif

#include "ContentTypes/File.h"
#include "FileType.h"
#include "External\External.h"
#include "External\HyperLink.h"
#include "Media\Image.h"
#include "Media\OleObject.h"
#include "FileTypes.h"


namespace OOX
{
	UnknowTypeFile IFileContainer::unknow;

	void IFileContainer::read(const CPath& filename)
	{
		OOX::Rels::File rels(filename);
		read(rels, filename.GetDirectory());
	}


	void IFileContainer::read(const Rels::File& rels, const CPath& path)
	{
#ifndef NODOCX
		

		size_t nCount = rels.Relations.m_items.GetCount();
		for (size_t i = 0; i < nCount; ++i)
		{
			add(rels.Relations.m_items[i].rId(), OOX::CreateFile(path, rels.Relations.m_items[i]));
		}
#endif
	}


	void IFileContainer::write(const CPath& filename, const CPath& directory, ContentTypes::File& content) const
	{
		OOX::Rels::File rels;
		CPath current = filename.GetDirectory();
		write(rels, current, directory, content);
		rels.write(filename);
	}


	void IFileContainer::write(Rels::File& rels, const CPath& curdir, const CPath& directory, ContentTypes::File& content) const
	{
		CAtlMap<CString, size_t> namepair;

		POSITION pos = m_container.GetStartPosition();
		while (NULL != pos)
		{
			const CAtlMap<CString, smart_ptr<OOX::File>>::CPair* pPair = m_container.GetNext(pos);
			
			smart_ptr<OOX::File> pFile		= pPair->m_value;
			smart_ptr<OOX::External> pExt	= pFile.smart_dynamic_cast<OOX::External>();

			if (!pExt.IsInit())
			{
				OOX::CPath defdir	= pFile->DefaultDirectory();
				OOX::CPath name		= pFile->DefaultFileName();

				CAtlMap<CString, size_t>::CPair* pNamePair = namepair.Lookup(name.m_strFilename);
				if (NULL == pNamePair)
					namepair.SetAt(name.m_strFilename, 1);
				else
					name = name + pNamePair->m_key;

				OOX::CSystemUtility::CreateDirectories(curdir / defdir);
				pFile->write(curdir / defdir / name, directory / defdir, content);
				rels.registration(pPair->m_key, pFile->type(), defdir / name);
			}
			else
			{
				
				
				rels.registration(pPair->m_key, pExt);
			}
		}
	}


	void IFileContainer::Commit(const CPath& path)
	{
		CAtlMap<CString, size_t> namepair;

		POSITION pos = m_container.GetStartPosition();
		while (NULL != pos)
		{
			CAtlMap<CString, smart_ptr<OOX::File>>::CPair* pPair = m_container.GetNext(pos);
			
			smart_ptr<OOX::File> pFile		= pPair->m_value;
			smart_ptr<OOX::External> pExt	= pFile.smart_dynamic_cast<OOX::External>();

			if (!pExt.IsInit())
			{
				OOX::CPath defdir	= pFile->DefaultDirectory();
				OOX::CPath name		= pFile->DefaultFileName();

				CAtlMap<CString, size_t>::CPair* pNamePair = namepair.Lookup(name.m_strFilename);
				if (NULL == pNamePair)
					namepair.SetAt(name.m_strFilename, 1);
				else
					name = name + pNamePair->m_key;

				OOX::CSystemUtility::CreateDirectories(path / defdir);
				
				smart_ptr<OOX::IFileBuilder> fileBuilder = pPair->m_value.smart_dynamic_cast<OOX::IFileBuilder>();
				if (fileBuilder.is_init())
					fileBuilder->Commit(path / defdir / name);
			}
		}
	}


	void IFileContainer::Finalize(const CPath& filename, const CPath& directory, ContentTypes::File& content)
	{
		OOX::Rels::File rels;
		CPath current = filename.GetDirectory();
		Finalize(rels, current, directory, content);
		rels.write(filename);
	}

	
	void IFileContainer::Finalize(Rels::File& rels, const OOX::CPath& curdir, const OOX::CPath& directory, ContentTypes::File& content)
	{
		CAtlMap<CString, size_t> namepair;

		POSITION pos = m_container.GetStartPosition();
		while (NULL != pos)
		{
			CAtlMap<CString, smart_ptr<OOX::File>>::CPair* pPair = m_container.GetNext(pos);
			
			smart_ptr<OOX::File> pFile		= pPair->m_value;
			smart_ptr<OOX::External> pExt	= pFile.smart_dynamic_cast<OOX::External>();

			if (!pExt.IsInit())
			{
				OOX::CPath defdir	= pFile->DefaultDirectory();
				OOX::CPath name		= pFile->DefaultFileName();

				CAtlMap<CString, size_t>::CPair* pNamePair = namepair.Lookup(name.m_strFilename);
				if (NULL == pNamePair)
					namepair.SetAt(name.m_strFilename, 1);
				else
					name = name + pNamePair->m_key;

				OOX::CSystemUtility::CreateDirectories(curdir / defdir);
				
				smart_ptr<OOX::IFileBuilder> fileBuilder = pFile.smart_dynamic_cast<OOX::IFileBuilder>(); 

				if ( fileBuilder.is_init() )
				{
					fileBuilder->Finalize(curdir / defdir / name, directory / defdir, content);
				}
				else
				{
					pFile->write(curdir / defdir / name, directory / defdir, content);
				}

				rels.registration(pPair->m_key, pFile->type(), defdir / name);
			}
			else
			{
				rels.registration(pPair->m_key, pExt);
			}
		}
	}


	void IFileContainer::extractPictures(const OOX::CPath& path) const
	{
		POSITION pos = m_container.GetStartPosition();
		while (NULL != pos)
		{
			smart_ptr<OOX::File> pFile		= m_container.GetNextValue(pos);

			smart_ptr<Image> pImage = pFile.smart_dynamic_cast<Image>();
			if (pImage.is_init())
			{
				pImage->copy_to(path);
				continue;
			}
			smart_ptr<IFileContainer> pExt = pFile.smart_dynamic_cast<IFileContainer>();
			if (pExt.is_init())
			{
				pExt->extractPictures(path);
				continue;
			}
		}
	}


	smart_ptr<Image> IFileContainer::image(const RId& rId) const
	{
		const CAtlMap<CString, smart_ptr<OOX::File>>::CPair* pPair = m_container.Lookup(rId.get());
		if (NULL == pPair)
			return smart_ptr<Image>();
		return pPair->m_value.smart_dynamic_cast<Image>();
	}

	smart_ptr<HyperLink> IFileContainer::hyperlink(const RId& rId) const
	{
		const CAtlMap<CString, smart_ptr<OOX::File>>::CPair* pPair = m_container.Lookup(rId.get());
		if (NULL == pPair)
			return smart_ptr<HyperLink>();
		return pPair->m_value.smart_dynamic_cast<HyperLink>();
	}

	smart_ptr<OleObject> IFileContainer::oleObject(const RId& rId) const
	{
		const CAtlMap<CString, smart_ptr<OOX::File>>::CPair* pPair = m_container.Lookup(rId.get());
		if (NULL == pPair)
			return smart_ptr<OleObject>();
		return pPair->m_value.smart_dynamic_cast<OleObject>();
	}

	const bool IFileContainer::exist(const FileType& type) const
	{
		POSITION pos = m_container.GetStartPosition();
		while (NULL != pos)
		{
			const CAtlMap<CString, smart_ptr<OOX::File>>::CPair* pPair = m_container.GetNext(pos);
			if (type == pPair->m_value->type())
				return true;
		}
		return false;
	}


	const bool IFileContainer::exist(const RId& rId) const
	{
		const CAtlMap<CString, smart_ptr<OOX::File>>::CPair* pPair = m_container.Lookup(rId.get());
		return (NULL != pPair);
	}


	const bool IFileContainer::isExternal(const OOX::RId& rId) const
	{
		const CAtlMap<CString, smart_ptr<OOX::File>>::CPair* pPair = m_container.Lookup(rId.get());

		if (NULL != pPair)
		{
			CString type	= pPair->m_value->type().RelationType();
			CString name	= pPair->m_value->type().DefaultFileName().m_strFilename;
			
			return (((type == OOX::FileTypes::ExternalAudio.RelationType()) || (type == OOX::FileTypes::ExternalImage.RelationType())
				|| (type == OOX::FileTypes::ExternalVideo.RelationType())) && (name == _T("")));
		}
		return true;
	}


	smart_ptr<OOX::File> IFileContainer::get(const FileType& type)
	{
		POSITION pos = m_container.GetStartPosition();
		while (NULL != pos)
		{
			CAtlMap<CString, smart_ptr<OOX::File>>::CPair* pPair = m_container.GetNext(pos);
			if (type == pPair->m_value->type())
				return pPair->m_value;
		}
		return smart_ptr<OOX::File>(new UnknowTypeFile(unknow));
	}


	const RId IFileContainer::add(const smart_ptr<OOX::File>& file)
	{
		const RId rId = maxRId().next();
		add(rId, file);
		return rId;
	}


	void IFileContainer::add(const OOX::RId rId, const smart_ptr<OOX::File>& file)
	{
		
		m_container.SetAt(rId.get(), file);
	}


	smart_ptr<OOX::File> IFileContainer::find(const FileType& type) const
	{
		POSITION pos = m_container.GetStartPosition();
		while (NULL != pos)
		{
			const CAtlMap<CString, smart_ptr<OOX::File>>::CPair* pPair = m_container.GetNext(pos);
			if (type == pPair->m_value->type())
				return pPair->m_value;
		}
		return smart_ptr<OOX::File>((OOX::File*)new UnknowTypeFile());
	}

	smart_ptr<OOX::File> IFileContainer::find(const OOX::RId& rId) const
	{
		const CAtlMap<CString, smart_ptr<OOX::File>>::CPair* pPair = m_container.Lookup(rId.get());
		if (NULL != pPair)
			return pPair->m_value;

		smart_ptr<OOX::File> pointer;
		return pointer;
	}


	smart_ptr<OOX::File> IFileContainer::operator [](const OOX::RId rId)
	{
		CAtlMap<CString, smart_ptr<OOX::File>>::CPair* pPair = m_container.Lookup(rId.get());
		if (NULL != pPair)
			return pPair->m_value;

		smart_ptr<OOX::File> pointer;
		return pointer;
	}


	smart_ptr<OOX::File> IFileContainer::operator [](const FileType& type)
	{
		return find(type);
	}

	const RId IFileContainer::maxRId()
	{
		++m_lMaxRid;
		return RId(m_lMaxRid);
	}

} // namespace OOX