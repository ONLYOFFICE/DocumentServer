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
#ifndef OOX_DOCUMENT_FILE_INCLUDE_H_
#define OOX_DOCUMENT_FILE_INCLUDE_H_

#include "File.h"
#include "IFileContainer.h"
#include "property.h"
#include "Logic/TextItem.h"
#include "Logic/SectorProperty.h"
#include "Logic/Background.h"
#include "IFileBuilder.h"

namespace OOX
{
	class Document : public OOX::File, public IFileContainer, public IFileBuilder
	{
	public:
		Document();
		Document(const OOX::CPath& filename);
		virtual ~Document();

	public:
		virtual void read(const OOX::CPath& filename);
		virtual void write(const OOX::CPath& filename, const OOX::CPath& directory, ContentTypes::File& content) const;

	public:
		virtual const FileType type() const;
		virtual const OOX::CPath DefaultDirectory() const;
		virtual const OOX::CPath DefaultFileName() const;

	public:
		virtual void Commit(const OOX::CPath& path);
		virtual void Finalize(const OOX::CPath& path, const OOX::CPath& directory, ContentTypes::File& content);

	public:
		void addImage(const OOX::CPath& imagePath, const long width, const long height);
        void addImage(const OOX::CPath& imagePath, const long xEmu, const std::string& hRelativeFrom, const long yEmu , const std::string& vRelativeFrom, const long widthEmu, const long heightEmu);
		void addImageInBegin(const OOX::CPath& imagePath, const long width, const long height);
		void addSpaceToLast(const int count);
		void addPageBreak();
		void addText(const std::wstring& text);
		void addText(const std::string& text);
		void addTextToLast(const std::wstring& text);
		void addTextToLast(const std::string& text);
		void addHyperlink(const std::wstring& nameHref, const std::wstring& text);
		void addHyperlink(const std::string& nameHref, const std::string& text);
		void addHyperlinkToLast(const std::wstring& nameHref, const std::wstring& text);
		void addHyperlinkToLast(const std::string& nameHref, const std::string& text);

	public:
		property<Logic::SectorProperty>				SectorProperty;
		property<std::vector<Logic::TextItem> >		Items;
		nullable_property<Logic::Background>		Background;
	};
} 

#endif // OOX_DOCUMENT_FILE_INCLUDE_H_