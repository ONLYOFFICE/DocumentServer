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


#include "RFonts.h"

namespace OOX
{
	namespace Logic
	{
		RFonts::RFonts()
		{

		}

		RFonts::~RFonts()
		{

		}	

		RFonts::RFonts(const XML::XNode& node)
		{
			fromXML(node);
		}

		const RFonts& RFonts::operator =(const XML::XNode& node)
		{
			fromXML(node);
			return *this;
		}

		void RFonts::fromXML(const XML::XNode& node)
		{
			const XML::XElement element(node);
			
			AsciiTheme		=	element.attribute("asciiTheme").value();
			EastAsiaTheme	=	element.attribute("eastAsiaTheme").value();
			HAnsiTheme		=	element.attribute("hAnsiTheme").value();
			Cstheme			=	element.attribute("cstheme").value();
			Hint			=	element.attribute("hint").value();
			ascii			=	element.attribute("ascii").value();
			EastAsia		=	element.attribute("eastAsia").value();
			hAnsi			=	element.attribute("hAnsi").value();
			Cs				=	element.attribute("cs").value();
		}

		const XML::XNode RFonts::toXML() const
		{
		return XML::XElement();
		}

		void RFonts::setFontName(const nullable__<std::string>& fontName)
		{
			ascii		=	fontName;
			hAnsi		=	fontName;
			EastAsia	=	fontName;
			Cs			=	fontName;
		}

		const std::string RFonts::fontType() const
		{
			if (ascii.is_init() || hAnsi.is_init() || Cs.is_init() || EastAsia.is_init())
			{
				return "fontName";
			}
			else if (AsciiTheme.is_init())
			{
				if (AsciiTheme->find("minor") != std::string::npos)
					return "minor";
				else if (AsciiTheme->find("major") != std::string::npos)
					return "major";
				else
					return "none";
			}
			else if (EastAsiaTheme.is_init())
			{
				if (EastAsiaTheme->find("minor") != std::string::npos)
					return "minor";
				else if (EastAsiaTheme->find("major") != std::string::npos)
					return "major";
				else
					return "none";
			}
			else if (HAnsiTheme.is_init())
			{
				if (HAnsiTheme->find("minor") != std::string::npos)
					return "minor";
				else if (HAnsiTheme->find("major") != std::string::npos)
					return "major";
				else
					return "none";
			}
			else if (Cstheme.is_init())
			{
				if (Cstheme->find("minor") != std::string::npos)
					return "minor";
				else if (Cstheme->find("major") != std::string::npos)
					return "major";
				else
					return "none";
			}
			else
			{
				return "none";
			}
		}

		const std::string RFonts::fontTypeAscii() const
		{
			if (AsciiTheme.is_init())
			{
				if (AsciiTheme->find("minor") != std::string::npos)
					return "minor";
				else if (AsciiTheme->find("major") != std::string::npos)
					return "major";
			}
			else if (ascii.is_init())
				return "fontName";
			else
				return "none";
            return "";
		}

		const std::string RFonts::fontTypeHAnsi() const
		{
			if (HAnsiTheme.is_init())
			{
				if (HAnsiTheme->find("minor") != std::string::npos)
					return "minor";
				else if (HAnsiTheme->find("major") != std::string::npos)
					return "major";
			}
			else if (hAnsi.is_init())
				return "fontName";
			else
				return "none";
            return "";
		}

		const std::string RFonts::fontTypeEA() const
		{
			if (EastAsiaTheme.is_init())
			{
				if (EastAsiaTheme->find("minor") != std::string::npos)
					return "minor";
				else if (EastAsiaTheme->find("major") != std::string::npos)
					return "major";
			}
			else if (EastAsia.is_init())
				return "fontName";
			else
				return "none";
            return "";
		}

		const std::string RFonts::fontTypeCS() const
		{
			if (Cstheme.is_init())
			{
				if (Cstheme->find("minor") != std::string::npos)
					return "minor";
				else if (Cstheme->find("major") != std::string::npos)
					return "major";
			}
			else if (Cs.is_init())
				return "fontName";
			else
				return "none";
            return "";
		}

		const nullable__<std::string> RFonts::fontName() const
		{
			if (ascii.is_init())	return ascii;
			if (hAnsi.is_init())	return hAnsi;
			if (EastAsia.is_init())	return EastAsia;
			if (Cs.is_init())		return Cs;

			return nullable__<std::string>();
		}

	} 
} // namespace OOX