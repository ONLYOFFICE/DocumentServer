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


#include "FileFactory.h"
#include "File.h"
#include "FileTypes.h"
#include "Rels/RelationShip.h"
#include "App.h"
#include "Core.h"
#include "Document.h"
#include "Theme/File.h"
#include "Settings/File.h"
#include "FontTable.h"
#include "Styles.h"
#include "Item.h"
#include "FootNote.h"
#include "EndNote.h"
#include "WebSettings.h"
#include "Media/Media.h"
#include "External\HyperLink.h"
#include "External\ExternalVideo.h"
#include "External\ExternalAudio.h"
#include "External\ExternalImage.h"
#include "Header.h"
#include "Footer.h"
#include "Numbering.h"
#include "UnknowTypeFile.h"

namespace OOX
{
	const NSCommon::smart_ptr<File> CreateFile(const OOX::CPath& path, const Rels::RelationShip& relation)
	{
		OOX::CPath filename = path / relation.filename();

		if (relation.type() == FileTypes::App)
			return NSCommon::smart_ptr<File>(new App(filename));
		else if (relation.type() == FileTypes::Core)
			return NSCommon::smart_ptr<File>(new Core(filename));
		else if (relation.type() == FileTypes::Document)
			return NSCommon::smart_ptr<File>(new Document(filename));
		else if (relation.type() == FileTypes::Theme)
			return NSCommon::smart_ptr<File>(new Theme::File(filename));
		else if (relation.type() == FileTypes::Setting)
			return NSCommon::smart_ptr<File>(new Settings::File(filename));
		else if (relation.type() == FileTypes::FontTable)
			return NSCommon::smart_ptr<File>(new FontTable(filename));
		else if (relation.type() == FileTypes::Style)
			return NSCommon::smart_ptr<File>(new Styles(filename));
		
		
		else if (relation.type() == FileTypes::FootNote)
			return NSCommon::smart_ptr<File>(new FootNote(filename));
		else if (relation.type() == FileTypes::EndNote)
			return NSCommon::smart_ptr<File>(new EndNote(filename));
		else if (relation.type() == FileTypes::WebSetting)
			return NSCommon::smart_ptr<File>(new WebSettings(filename));
		else if (relation.type() == FileTypes::HyperLink)
			return NSCommon::smart_ptr<File>(new HyperLink(relation.target()));
		else if ((relation.type() == FileTypes::ExternalVideo) && (relation.isExternal()))
			return NSCommon::smart_ptr<File>(new ExternalVideo(relation.target()));
		else if ((relation.type() == FileTypes::ExternalAudio) && (relation.isExternal()))
			return NSCommon::smart_ptr<File>(new ExternalAudio(relation.target()));
		else if ((relation.type() == FileTypes::ExternalImage) && (relation.isExternal()))
			return NSCommon::smart_ptr<File>(new ExternalImage(relation.target()));
		else if (relation.type() == FileTypes::Image)
			return NSCommon::smart_ptr<File>(new Image(filename));
		else if (relation.type() == FileTypes::OleObject)
			return NSCommon::smart_ptr<File>(new OleObject(filename));
		else if (relation.type() == FileTypes::Audio)
			return NSCommon::smart_ptr<File>(new Audio(filename));
		else if (relation.type() == FileTypes::Video)
			return NSCommon::smart_ptr<File>(new Video(filename));
		else if (relation.type() == FileTypes::Numbering)
			return NSCommon::smart_ptr<File>(new Numbering(filename));
		else if (relation.type() == FileTypes::Header)
			return NSCommon::smart_ptr<File>(new Header(filename));
		else if (relation.type() == FileTypes::Footer)
			return NSCommon::smart_ptr<File>(new Footer(filename));

		return NSCommon::smart_ptr<File>(new UnknowTypeFile());
	}

} // namespace OOX