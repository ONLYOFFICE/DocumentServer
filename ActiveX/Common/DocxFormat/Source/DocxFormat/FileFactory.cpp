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
 #include "FileFactory.h"
#include "File.h"
#include "FileTypes.h"
#include "Rels.h"
#include "App.h"
#include "Core.h"
#include "Document.h"
#include "Theme/Theme.h"
#include "Theme/ThemeOverride.h"
#include "Settings/Settings.h"
#include "Settings/WebSettings.h"
#include "FontTable.h"
#include "Styles.h"
#include "Bibliography.h"
#include "FootNote.h"
#include "EndNote.h"
#include "Media\Image.h"
#include "Media\OleObject.h"
#include "Media\Audio.h"
#include "Media\Video.h"
#include "External\HyperLink.h"
#include "External\ExternalVideo.h"
#include "External\ExternalAudio.h"
#include "External\ExternalImage.h"
#include "HeaderFooter.h"
#include "Numbering.h"
#include "Comments.h"
#include "UnknowTypeFile.h"


namespace OOX
{
	const smart_ptr<OOX::File> CreateFile(const OOX::CPath& oPath, const OOX::Rels::CRelationShip& oRelation)
	{
		const CPath oFileName = oPath / oRelation.Filename();

		if ( oRelation.Type() == FileTypes::App )
			return smart_ptr<OOX::File>(new CApp( oFileName ));
		else if ( oRelation.Type() == FileTypes::Core)
			return smart_ptr<OOX::File>(new CCore( oFileName ));
		else if ( oRelation.Type() == FileTypes::Document)
			return smart_ptr<OOX::File>(new CDocument( oFileName ));
		else if ( oRelation.Type() == FileTypes::Theme)
			return smart_ptr<OOX::File>(new CTheme( oFileName ));
		else if ( oRelation.Type() == FileTypes::ThemeOverride)
			return smart_ptr<OOX::File>(new CThemeOverride( oFileName ));
		else if ( oRelation.Type() == FileTypes::Setting)
			return smart_ptr<OOX::File>(new CSettings( oFileName ));
		else if ( oRelation.Type() == FileTypes::FontTable)
			return smart_ptr<OOX::File>(new CFontTable( oFileName ));
		else if ( oRelation.Type() == FileTypes::Style)
			return smart_ptr<OOX::File>(new CStyles( oFileName ));
		else if ( oRelation.Type() == FileTypes::Bibliography)
			return smart_ptr<OOX::File>(new CBibliography( oFileName ));
		else if ( oRelation.Type() == FileTypes::FootNote)
			return smart_ptr<OOX::File>(new CFootnotes( oFileName ));
		else if ( oRelation.Type() == FileTypes::EndNote)
			return smart_ptr<OOX::File>(new CEndnotes( oFileName ));
		else if ( oRelation.Type() == FileTypes::WebSetting)
			return smart_ptr<OOX::File>(new CWebSettings( oFileName ));
		else if ( oRelation.Type() == FileTypes::HyperLink)
			return smart_ptr<OOX::File>(new HyperLink( oRelation.Target()));
		else if (( oRelation.Type() == FileTypes::ExternalVideo ) && ( oRelation.IsExternal() ))
			return smart_ptr<OOX::File>(new ExternalVideo( oRelation.Target()));
		else if (( oRelation.Type() == FileTypes::ExternalAudio ) && ( oRelation.IsExternal() ))
			return smart_ptr<OOX::File>(new ExternalAudio( oRelation.Target()));
		else if (( oRelation.Type() == FileTypes::ExternalImage ) && ( oRelation.IsExternal() ))
			return smart_ptr<OOX::File>(new ExternalImage( oRelation.Target()));
		else if ( oRelation.Type() == FileTypes::Image)
			return smart_ptr<OOX::File>(new Image( oFileName ));
		else if ( oRelation.Type() == FileTypes::OleObject)
			return smart_ptr<OOX::File>(new OleObject( oFileName ));
		else if ( oRelation.Type() == FileTypes::Audio)
			return smart_ptr<OOX::File>(new Audio( oFileName ));
		else if ( oRelation.Type() == FileTypes::Video)
			return smart_ptr<OOX::File>(new Video( oFileName ));
		else if ( oRelation.Type() == FileTypes::Numbering)
			return smart_ptr<OOX::File>(new CNumbering( oFileName ));
		else if ( oRelation.Type() == FileTypes::Header)
			return smart_ptr<OOX::File>(new CHdrFtr( oFileName ));
		else if ( oRelation.Type() == FileTypes::Footer)
			return smart_ptr<OOX::File>(new CHdrFtr( oFileName ));
		else if ( oRelation.Type() == FileTypes::Comments)
			return smart_ptr<OOX::File>(new CComments( oFileName ));
		else if ( oRelation.Type() == FileTypes::CommentsExt )
			return smart_ptr<OOX::File>(new CCommentsExt( oFileName ));
		else if ( oRelation.Type() == FileTypes::People )
			return smart_ptr<OOX::File>(new CPeople( oFileName ));

		return smart_ptr<OOX::File>( new UnknowTypeFile() );
	}

} // namespace OOX