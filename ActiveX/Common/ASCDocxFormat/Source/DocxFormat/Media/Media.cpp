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


#include "Media.h"
#include "..\FileTypes.h"

namespace OOX
{
	Media::Media()
	{
	}

	Media::Media(const OOX::CPath& filename)
	{
		read(filename);
	}

	Media::~Media()
	{
	}

	void Media::read(const OOX::CPath& filename)
	{
		m_filename = filename;
	}

	void Media::write(const OOX::CPath& filename, const OOX::CPath& directory, ContentTypes::File& content) const
	{
	}

	const OOX::CPath Media::filename() const
	{
		return m_filename;
	}

	void Media::copy_to(const OOX::CPath& path) const
	{		
		int c = 0;
	}

} 

namespace OOX
{
	Image::Image()
	{
	}

	Image::Image(const OOX::CPath& filename)
	{
		read(filename);
	}

	Image::~Image()
	{
	}

	void Image::write(const OOX::CPath& filename, const OOX::CPath& directory, ContentTypes::File& content) const
	{
	}

	const FileType Image::type() const
	{
		return FileTypes::Image;
	}

	const OOX::CPath Image::DefaultDirectory() const
	{
		return type().DefaultDirectory();
	}

	const OOX::CPath Image::DefaultFileName() const
	{
		return m_filename;
	}
}

namespace OOX
{
	Video::Video()
	{
	}

	Video::Video(const OOX::CPath& filename)
	{
		read(filename);
	}

	Video::~Video()
	{
	}

	const FileType Video::type() const
	{
		return FileTypes::Video;
	}

	const OOX::CPath Video::DefaultDirectory() const
	{
		return type().DefaultDirectory();
	}

	const OOX::CPath Video::DefaultFileName() const
	{
		return m_filename;
	}
}

namespace OOX
{
	Audio::Audio()
	{
	}

	Audio::Audio(const OOX::CPath& filename)
	{
		read(filename);
	}

	Audio::~Audio()
	{
	}

	const FileType Audio::type() const
	{
		return FileTypes::Audio;
	}

	const OOX::CPath Audio::DefaultDirectory() const
	{
		return type().DefaultDirectory();
	}

	const OOX::CPath Audio::DefaultFileName() const
	{
		return m_filename.GetPath();
	}
}

namespace OOX
{
	OleObject::OleObject()
	{
	}

	OleObject::OleObject(const OOX::CPath& filename)
	{
		read(filename);
	}

	OleObject::~OleObject()
	{
	}

	void OleObject::write(const OOX::CPath& filename, const OOX::CPath& directory, ContentTypes::File& content) const
	{
	}

	const FileType OleObject::type() const
	{
		return FileTypes::OleObject;
	}

	const OOX::CPath OleObject::DefaultDirectory() const
	{
		return type().DefaultDirectory();
	}

	const OOX::CPath OleObject::DefaultFileName() const
	{
		return m_filename;
	}
}
