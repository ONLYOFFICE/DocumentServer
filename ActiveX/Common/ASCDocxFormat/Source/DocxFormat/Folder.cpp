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


#include "Folder.h"
#include "Rels/File.h"
#include "Document.h"

namespace Docx
{
	Folder::Folder()
	{		
	}

	Folder::Folder(const OOX::CPath& path)
	{
		read(path);
	}

	void Folder::read(const OOX::CPath& path)
	{
		OOX::Rels::File rels(path / L"/");
		IFileContainer::read(rels, path);
	}

	void Folder::write(const OOX::CPath& path) const
	{
		OOX::CSystemUtility::CreateDirectories(path);

		OOX::Rels::File rels;
		OOX::ContentTypes::File content;

		IFileContainer::write(rels, path, OOX::CPath(L""), content);

		rels.write(path / L"/");
		content.write(path);
	}

	void Folder::createFromTemplate(const OOX::CPath& path)
	{
		read(path);
	}

	void Folder::Commit(const OOX::CPath& path)
	{
		OOX::CSystemUtility::CreateDirectories(path);
		IFileContainer::Commit(path);
	}

	void Folder::Finalize(const OOX::CPath& path)
	{
		OOX::CSystemUtility::CreateDirectories(path);

		OOX::Rels::File rels;
		OOX::ContentTypes::File content;

		IFileContainer::Finalize(rels, path, OOX::CPath(L""), content);

		rels.write(path / L"/");
		content.write(path);
	}

	const bool Folder::isValid(const OOX::CPath& path) const
	{
		return true;
	}

	void Folder::extractPictures(const OOX::CPath& path)
	{
		OOX::CSystemUtility::CreateDirectories(path);
		OOX::IFileContainer::extractPictures(path);
	}

	void Folder::extractPictures(const OOX::CPath& source, const OOX::CPath& path)
	{
		read(source);
		extractPictures(path);
	}

	void Folder::addImage(const OOX::CPath& imagePath, const long width, const long height)
	{
		if (exist<OOX::Document>())
		{
			OOX::Document& document = find<OOX::Document>();
			document.addImage(imagePath, width, height);
		}
	}

	void Folder::addImageInBegin(const OOX::CPath& imagePath, const long width, const long height)
	{
		if (exist<OOX::Document>())
		{
			OOX::Document& document = find<OOX::Document>();
			document.addImageInBegin(imagePath, width, height);
		}
	}

	void Folder::addSpaceToLast(const int count)
	{
		if (exist<OOX::Document>())
		{
			OOX::Document& document = find<OOX::Document>();
			document.addSpaceToLast(count);
		}
	}

	void Folder::addPageBreak()
	{
		if (exist<OOX::Document>())
		{
			OOX::Document& document = find<OOX::Document>();
			document.addPageBreak();
		}
	}

	void Folder::addText(const std::wstring& text)
	{
		if (exist<OOX::Document>())
		{
			OOX::Document& document = find<OOX::Document>();
			document.addText(text);
		}
	}

	void Folder::addText(const std::string& text)
	{
		if (exist<OOX::Document>())
		{
			OOX::Document& document = find<OOX::Document>();
			document.addText(text);
		}
	}

	void Folder::addTextToLast(const std::wstring& text)
	{
		if (exist<OOX::Document>())
		{
			OOX::Document& document = find<OOX::Document>();
			document.addTextToLast(text);
		}
	}

	void Folder::addTextToLast(const std::string& text)
	{
		if (exist<OOX::Document>())
		{
			OOX::Document& document = find<OOX::Document>();
			document.addTextToLast(text);
		}
	}

	void Folder::addHyperlink(const std::wstring& nameHref, const std::wstring& text)
	{
		if (exist<OOX::Document>())
		{
			OOX::Document& document = find<OOX::Document>();
			document.addHyperlink(nameHref, text);
		}
	}

	void Folder::addHyperlink(const std::string& nameHref, const std::string& text)
	{
		if (exist<OOX::Document>())
		{
			OOX::Document& document = find<OOX::Document>();
			document.addHyperlink(nameHref, text);
		}
	}

	void Folder::addHyperlinkToLast(const std::wstring& nameHref, const std::wstring& text)
	{
		if (exist<OOX::Document>())
		{
			OOX::Document& document = find<OOX::Document>();
			document.addHyperlinkToLast(nameHref, text);
		}
	}

	void Folder::addHyperlinkToLast(const std::string& nameHref, const std::string& text)
	{
		if (exist<OOX::Document>())
		{
			OOX::Document& document = find<OOX::Document>();
			document.addHyperlinkToLast(nameHref, text);
		}
	}

} // namespace Docx