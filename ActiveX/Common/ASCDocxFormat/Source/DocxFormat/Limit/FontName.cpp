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


#include "FontName.h"


namespace OOX
{
	namespace Limit
	{

		FontName::FontName()
		{
			add("Calibri");
			add("Times New Roman");
			add("Agency FB");
			add("Arial");
			add("Algerian");
			add("Arial Black");
			add("Arial Narrow");
			add("Arial Rounded MT Bold");
			add("Arial Unicode MS");
			add("Aston-F1");
			add("Baskerville Old Face");
			add("Bauhaus 93");
			add("Bell MT");
			add("Berlin Sans FB");
			add("Berlin Sans FB Demi");
			add("Bernard MT Condensed");
			add("Blackadder ITC");
			add("Bodoni MT");
			add("Bodoni MT Black");
			add("Bodoni MT Condensed");
			add("Bodoni MT Poster Compressed");
			add("Book Antiqua");
			add("Bookman Old Style");
			add("Bookshelf Symbol 7");
			add("Bradley Hand ITC");
			add("Britannic Bold");
			add("Broadway");
			add("Brush Script MT");
			add("Californian FB");
			add("Calisto MT");
			add("Cambria");
			add("Cambria Math");
			add("Candara");
			add("Castellar");
			add("Centaur");
			add("Century");
			add("Century Gothic");
			add("Century Schoolbook");
			add("Chiller");
			add("Colonna MT");
			add("Comic Sans MS");
			add("Consolas");
			add("Constantia");
			add("Cooper Black");
			add("Copperplate Gothic Bold");
			add("Copperplate Gothic Light");
			add("Corbel");
			add("Courier New");
			add("Curlz MT");
			add("Edwardian Script ITC");
			add("Elephant");
			add("Engravers MT");
			add("Eras Bold ITC");
			add("Eras Demi ITC");
			add("Eras Light ITC");
			add("Eras Medium ITC");
			add("Estrangelo Edessa");
			add("Felix Titling");
			add("Footlight MT Light");
			add("Forte");
			add("Franklin Gothic Book");
			add("Franklin Gothic Demi");
			add("Franklin Gothic Demi Cond");
			add("Franklin Gothic Heavy");
			add("Franklin Gothic Medium");
			add("Franklin Gothic Medium Cond");
			add("Freestyle Script");
			add("French Script MT");
			add("Garamond");
			add("Gautami");
			add("Georgia");
			add("Gigi");
			add("Gill Sans MT");
			add("Gill Sans MT Condensed");
			add("Gill Sans MT Ext Condensed Bold");
			add("Gill Sans Ultra Bold");
			add("Gill Sans Ultra Bold Condensed");
			add("Gloucester MT Extra Condensed");
			add("Goudy Old Style");
			add("Goudy Stout");
			add("Haettenschweiler");
			add("Harlow Solid Italic");
			add("Harrington");
			add("High Tower Text");
			add("Impact");
			add("Imprint MT Shadow");
			add("Informal Roman");
			add("Jokerman");
			add("Juice ITC");
			add("Kristen ITC");
			add("Kunstler Script");
			add("Latha");
			add("Lucida Bright");
			add("Lucida Calligraphy");
			add("Lucida Console");
			add("Lucida Fax");
			add("Lucida Handwriting");
			add("Lucida Sans");
			add("Lucida Sans Typewriter");
			add("Lucida Sans Unicode");
			add("Magneto");
			add("Maiandra GD");
			add("Mangal");
			add("Marlett");
			add("Matura MT Script Capitals");
			add("Microsoft Sans Serif");
			add("Mistral");
			add("Modern No. 20");
			add("Monotype Corsiva");
			add("MS Mincho");
			add("MS Outlook");
			add("MS Reference Sans Serif");
			add("MS Reference Specialty");
			add("MT Extra");
			add("MV Boli");
			add("Niagara Engraved");
			add("Niagara Solid");
			add("OCR A Extended");
			add("Old English Text MT");
			add("Onyx");
			add("OpenSymbol");
			add("Palace Script MT");
			add("Palatino Linotype");
			add("Papyrus");
			add("Parchment");
			add("Perpetua");
			add("Perpetua Titling MT");
			add("Playbill");
			add("Poor Richard");
			add("Pristina");
			add("Raavi");
			add("Rage Italic");
			add("Ravie");
			add("Rockwell");
			add("Rockwell Condensed");
			add("Rockwell Extra Bold");
			add("Script MT Bold");
			add("Segoe Print");
			add("Segoe Script");
			add("Segoe UI");
			add("Showcard Gothic");
			add("Shruti");
			add("SimHei");
			add("Snap ITC");
			add("Stencil");
			add("Sylfaen");
			add("Symbol");
			add("Tahoma");
			add("Tempus Sans ITC");
	        add("Thorndale");
			add("Trebuchet MS");
			add("Tunga");
			add("Tw Cen MT");
			add("Tw Cen MT Condensed");
			add("Tw Cen MT Condensed Extra Bold");
			add("Verdana");
			add("Viner Hand ITC");
			add("Vivaldi");
			add("Vladimir Script");
			add("Webdings");
			add("Wide Latin");
			add("Wingdings");
			add("Wingdings 2");
			add("Wingdings 3");
		}


		const std::string FontName::no_find() const
		{
			return "Times New Roman";
		}

	} 
} // namespace OOX