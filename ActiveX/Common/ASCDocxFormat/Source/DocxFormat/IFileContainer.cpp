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
 
#include "precompiled_docxformat.h"


#include "IFileContainer.h"
#include "Rels/File.h"
#include "FileFactory.h"
#include "ContentTypes/File.h"
#include "FileType.h"
#include "External/External.h"
#include "External/HyperLink.h"
#include "Media/Media.h"
#include "FileTypes.h"

namespace OOX
{
	UnknowTypeFile IFileContainer::unknow;

	void IFileContainer::read(const OOX::CPath& filename)
	{
		OOX::Rels::File rels(filename);
		read(rels, OOX::CPath(filename.GetDirectory()));
	}

	void IFileContainer::read(const Rels::File& rels, const OOX::CPath& path)
	{
#ifndef NODOCX
		if (rels.Relations.IsInit())
		{
			for (std::vector<OOX::Rels::RelationShip>::const_iterator iter = rels.Relations.get().m_items.begin();
				iter != rels.Relations.get().m_items.end();
				++iter)
			{
				add((*iter).rId(), OOX::CreateFile(path, (*iter)));
			}
		}
#endif
	}

	void IFileContainer::write(const OOX::CPath& filename, const OOX::CPath& directory, ContentTypes::File& content) const
	{
		OOX::Rels::File rels;
		const OOX::CPath current = filename.GetDirectory();
		write(rels, current, directory, content);
		rels.write(filename);
	}

	void IFileContainer::write(Rels::File& rels, const OOX::CPath& curdir, const OOX::CPath& directory, ContentTypes::File& content) const
	{
	}

	void IFileContainer::Commit(const OOX::CPath& path)
	{		
	}

	void IFileContainer::Finalize(const OOX::CPath& filename, const OOX::CPath& directory, ContentTypes::File& content)
	{
	}
	
	void IFileContainer::Finalize(Rels::File& rels, const OOX::CPath& curdir, const OOX::CPath& directory, ContentTypes::File& content)
	{
	}

	void IFileContainer::extractPictures(const OOX::CPath& path) const
	{
		for (std::map<OOX::RId, NSCommon::smart_ptr<OOX::File>>::const_iterator iter = m_container.begin(); iter != m_container.end(); ++iter)
		{
			if (dynamic_cast<const Image*>((*iter).second.operator->()) != 0)
			{
				const Image& image = static_cast<const Image&>(*(*iter).second);
				image.copy_to(path);
			}
			else if (dynamic_cast<const IFileContainer*>((*iter).second.operator->()) != 0)
			{
				const IFileContainer& container = dynamic_cast<const IFileContainer&>(*(*iter).second);
				container.extractPictures(path);
			}
		}
	}

	Image& IFileContainer::image(const RId rId)
	{
        
        return const_cast<Image&>( static_cast<const IFileContainer*>(this)->image(rId) ); 
		
	}

	const Image& IFileContainer::image(const RId rId) const
	{
		if (m_container.count(rId))
		{            
			if (OOX::File* file = ((OOX::File*)m_container.find(rId)->second.operator->()))
			{
				if (const Image * image = dynamic_cast<const Image*>(file))
					return *image;                
				else
					throw std::runtime_error("invalid rel type");
			}
			else
			{
				throw std::runtime_error("invalid rel");
			}
		}
		else
		{
			throw std::runtime_error("invalid rId");
		}
	}

	HyperLink& IFileContainer::hyperlink(const RId rId)
	{
		return dynamic_cast<HyperLink&>(*m_container[rId]);
	}

	const HyperLink& IFileContainer::hyperlink(const RId rId) const
	{
		return dynamic_cast<const HyperLink&>(*m_container.find(rId)->second);
	}

	OleObject& IFileContainer::oleObject(const RId rId)
	{
		return dynamic_cast<OleObject&>(*m_container[rId]);
	}

	const OleObject& IFileContainer::oleObject(const RId rId) const
	{
		return dynamic_cast<const OleObject&>(*m_container.find(rId)->second);
	}

	const bool IFileContainer::exist(const FileType& type) const
	{
		for (std::map<OOX::RId, NSCommon::smart_ptr<OOX::File>>::const_iterator iter = m_container.begin(); iter != m_container.end(); ++iter)
		{
			if ((*iter).second->type() == type)
				return true;
		}
		return false;
	}

	const bool IFileContainer::exist(const RId& rId) const
	{
		return m_container.find(rId) != m_container.end();
	}

	const bool IFileContainer::isExternal(const OOX::RId& rId) const
	{
		if(m_container.find(rId) != m_container.end())
		{
			std::wstring type = m_container.find(rId)->second->type().RelationType();
			std::wstring name = m_container.find(rId)->second->type().DefaultFileName().GetPath();
			return (((type == OOX::FileTypes::ExternalAudio.RelationType()) || (type == OOX::FileTypes::ExternalImage.RelationType())
				|| (type == OOX::FileTypes::ExternalVideo.RelationType())) && (name == L""));
		}
		return true;
	}

	const NSCommon::smart_ptr<OOX::File> IFileContainer::get(const FileType& type) const
	{
		for (std::map<OOX::RId, NSCommon::smart_ptr<OOX::File>>::const_iterator iter = m_container.begin(); iter != m_container.end(); ++iter)
		{
			if ((*iter).second->type() == type)
				return (*iter).second;
		}
		return NSCommon::smart_ptr<OOX::File>(new UnknowTypeFile(unknow));
	}

	const RId IFileContainer::add(const NSCommon::smart_ptr<OOX::File>& file)
	{
		const RId rId = maxRId().next();
		add(rId, file);
		return rId;
	}

	void IFileContainer::add(const OOX::RId rId, const NSCommon::smart_ptr<OOX::File>& file)
	{
		IDictonary::add(rId, file);
	}

	File& IFileContainer::find(const FileType& type)
	{
		for (std::map<OOX::RId, NSCommon::smart_ptr<OOX::File>>::const_iterator iter = m_container.begin(); iter != m_container.end(); ++iter)
		{
			if ((*iter).second->type() == type)
				return *((OOX::File*)(*iter).second.operator->());
		}
		return unknow;
	}

	const File& IFileContainer::find(const FileType& type) const
	{
		for (std::map<OOX::RId, NSCommon::smart_ptr<OOX::File>>::const_iterator iter = m_container.begin(); iter != m_container.end(); ++iter)
		{
			if ((*iter).second->type() == type)
				return *(*iter).second.operator->();
		}
		return unknow;
	}

	NSCommon::smart_ptr<OOX::File> IFileContainer::operator [](const OOX::RId rId)
	{
		return m_container[rId];
	}

	const NSCommon::smart_ptr<OOX::File> IFileContainer::operator [](const OOX::RId rId) const
	{
		return m_container.find(rId)->second;
	}

	File& IFileContainer::operator [](const FileType& type)
	{
		return find(type);
	}

	const File& IFileContainer::operator [](const FileType& type) const
	{
		return find(type);
	}

	const RId IFileContainer::maxRId() const
	{
		RId rId;
		for (std::map<OOX::RId, NSCommon::smart_ptr<OOX::File>>::const_iterator iter = m_container.begin(); iter != m_container.end(); ++iter)
		{
			if (rId < (*iter).first)
				rId = (*iter).first;
		}
		return rId;
	}

} // namespace OOX