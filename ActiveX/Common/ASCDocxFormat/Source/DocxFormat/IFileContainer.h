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
#ifndef OOX_IFILE_CONTAINER_INCLUDE_H_
#define OOX_IFILE_CONTAINER_INCLUDE_H_

#include "IDictonary.h"
#include "RId.h"
#include "UnknowTypeFile.h"
#include "IFileBuilder.h"

#include "../../../../Common/DocxFormat/Source/Base/SmartPtr.h"

namespace OOX {class File;}
namespace OOX {class FileType;}
namespace OOX {namespace Rels {class File;}}
namespace OOX {namespace ContentTypes {class File;}}
namespace OOX {class Image;}
namespace OOX {class HyperLink;}
namespace OOX {class OleObject;}

namespace OOX
{
	class IFileContainer : public IDictonary<OOX::RId, NSCommon::smart_ptr<OOX::File> >
	{
	protected:
		void read(const OOX::CPath& filename);
		void read(const Rels::File& rels, const OOX::CPath& path);
		void write(const OOX::CPath& filename, const OOX::CPath& directory, ContentTypes::File& content) const;
		void write(Rels::File& rels, const OOX::CPath& current, const OOX::CPath& directory, ContentTypes::File& content) const;

	protected:
		void Commit(const OOX::CPath& path);
		void Finalize(const OOX::CPath& filename, const OOX::CPath& directory, ContentTypes::File& content);
		void Finalize(Rels::File& rels, const OOX::CPath& current, const OOX::CPath& directory, ContentTypes::File& content);

	public:
		typedef std::pair<const OOX::RId, NSCommon::smart_ptr<OOX::File> > RIdFilePair;

	public:
		void extractPictures(const OOX::CPath& path) const;

	public:
		Image& image(const RId rId);
		const Image& image(const RId rId) const;

		HyperLink& hyperlink(const RId rId);
		const HyperLink& hyperlink(const RId rId) const;

		OleObject& oleObject(const RId rId);
		const OleObject& oleObject(const RId rId) const;

	public:
		template<typename T> const bool exist() const;
		const bool exist(const FileType& type) const;
		const bool exist(const OOX::RId& rId) const;
		const bool isExternal(const OOX::RId& rId) const;

		const NSCommon::smart_ptr<OOX::File> get(const FileType& type) const;
		const RId add(const NSCommon::smart_ptr<OOX::File>& file);
		void add(const OOX::RId rId, const NSCommon::smart_ptr<OOX::File>& file);

		File& find(const FileType& type);
		const File& find(const FileType& type) const;

		NSCommon::smart_ptr<OOX::File> operator [](const OOX::RId rId);
		const NSCommon::smart_ptr<OOX::File> operator [](const OOX::RId rId) const;

		File& operator [](const FileType& type);
		const File& operator [](const FileType& type) const;

	 template<typename T> T& find();
	 template<typename T> const T& find() const;

	protected:
		static UnknowTypeFile unknow;

	private:
		const RId maxRId() const;
	};


	template<typename T>
	const bool IFileContainer::exist() const
	{
		T file;
		return exist(file.type());
	}

	template<typename T>
	T& IFileContainer::find()
	{
		T file;
		return dynamic_cast<T&>(find(file.type()));
	}

	template<typename T>
	const T& IFileContainer::find() const
	{
		T file;
		return dynamic_cast<const T&>(find(file.type()));
	}

} 

#endif // OOX_IFILE_CONTAINER_INCLUDE_H_