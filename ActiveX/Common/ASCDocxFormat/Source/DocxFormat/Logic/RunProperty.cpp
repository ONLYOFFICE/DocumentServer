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


#include "RunProperty.h"

namespace OOX
{
	namespace Logic
	{

		RunProperty::RunProperty()
		{
		}


		RunProperty::~RunProperty()
		{
		}
	

		RunProperty::RunProperty(const XML::XNode& node)
		{
			fromXML(node);
		}


		const RunProperty& RunProperty::operator =(const XML::XNode& node)
		{
			fromXML(node);
			return *this;
		}


		void RunProperty::fromXML(const XML::XNode& node)
		{
			const XML::XElement element(node);

			
			if (element.element("b").exist())
			{
				if (!(element.element("b").attribute("val").exist() && element.element("b").attribute("val").value().ToBool() == false))
					Bold = true;
				else
					Bold = false;
			}

			if (element.element("i").exist())
			{
				if (!(element.element("i").attribute("val").exist() && element.element("i").attribute("val").value().ToBool() == false))
					Italic = true;
				else
					Italic = false;
			}
			
			if (element.element("u").exist())
			{
				Under = true;
				UnderType = element.element("u").attribute("val").value();
			}

			if (element.element("strike").exist())
			{
				if(!(element.element("strike").attribute("val").exist() && element.element("strike").attribute("val").value().ToBool() == false))
					Strike = true;
				else
					Strike = false;
			}

			if (element.element("dstrike").exist())
			{
				if (!(element.element("dstrike").attribute("val").exist() && element.element("dstrike").attribute("val").value().ToBool() == false))
					DStrike = true;
				else
					DStrike = false;
			}

		    if (element.element("smallCaps").exist())
			{
				if(!(element.element("smallCaps").attribute("val").exist() && element.element("smallCaps").attribute("val").value().ToBool() == false))
					SmallCaps = true;
				else
					SmallCaps = false;
			}

			if (element.element("caps").exist())
			{
				if (!(element.element("caps").attribute("val").exist() && element.element("caps").attribute("val").value().ToBool() == false))
					Caps = true;
				else
					Caps = false;
			}

			if (element.element("emboss").exist())
			{
				if (!(element.element("emboss").attribute("val").exist() && element.element("emboss").attribute("val").value().ToBool() == false))
					Emboss = true;
				else
					Emboss = false;
			}

	        if (element.element("imprint").exist())
			{
				if (!(element.element("imprint").attribute("val").exist() && element.element("imprint").attribute("val").value().ToBool() == false))
					Imprint = true;
				else
					Imprint = false;
			}

			if (element.element("outline").exist())
			{
				if (!(element.element("outline").attribute("val").exist() && element.element("outline").attribute("val").value().ToBool() == false))
					Outline = true;
				else
					Outline = false;
			}

		    if (element.element("shadow").exist())
			{
				if (!(element.element("shadow").attribute("val").exist() && element.element("shadow").attribute("val").value().ToBool() == false))
					Shadow = true;
				else
					Shadow = false;
			}

	        if (element.element("vanish").exist())
			{
				if (!(element.element("vanish").attribute("val").exist() && element.element("vanish").attribute("val").value().ToBool() == false))
					Vanish = true;
				else
					Vanish = false;
			}

		    WebHidden	= element.element("webHidden").exist();
			Lang		= element.element("lang");
			rFonts		= element.element("rFonts");
			RStyle		= element.element("rStyle").attribute("val").value();
			FontSize	= element.element("sz").attribute("val").value();			
			Index		= element.element("vertAlign").attribute("val").value();
			FontColor	= element.element("color").attribute("val").value();
			
			Highlight	= element.element("highlight").attribute("val").value();
		    Shading		= element.element("shd");
			Spacing		= element.element("spacing").attribute("val").value();
			Kern		= element.element("kern").attribute("val").value();
			Position	= element.element("position").attribute("val").value();
			Scale		= element.element("w").attribute("val").value();
			Border = element.element("bdr");
			PropertyChange = element.element("rPrChange");
		}


		const XML::XNode RunProperty::toXML() const
		{
		return XML::XElement();
		}

		const bool RunProperty::isSimple() const
		{
			

			if (RStyle.is_init())
				return false;
			if (Spacing.is_init())
				return false;
			if (rFonts.is_init())
				return false;
			if (FontSize.is_init())
				return false;
			if (Index.is_init())
				return false;
			if (FontColor.is_init())
				return false;
			
				
			if (Shading.is_init())
				return false;
			if (Bold.is_init())
				return false;
			if (Italic.is_init())
				return false;
			if (Under.is_init() && UnderType != "none")
				return false;
			if (Strike.is_init())
				return false;
			if (DStrike.is_init())
				return false;
			if (SmallCaps.is_init())
				return false;
			if (Caps.is_init())
				return false;
			if (Emboss.is_init())
				return false;
			if (Imprint.is_init())
				return false;
			if (Outline.is_init())
				return false;
			if (Shadow.is_init())
				return false;
			if (Vanish.is_init())
				return false;
			if (Kern.is_init())
				return false;
			if (Position.is_init())
				return false;
			if (Scale.is_init())
				return false;
			if (Border.is_init())
				return false;
			if (PropertyChange.is_init())
				return false;

			return true;
		}

		const RunProperty RunProperty::merge(const RunProperty& prev, const RunProperty& current)
		{
			RunProperty properties;
			properties.Bold			  = ::merge(prev.Bold, current.Bold);
			properties.Italic		  = ::merge(prev.Italic, current.Italic);
			properties.Under		  = ::merge(prev.Under, current.Under);
			properties.Strike		  = ::merge(prev.Strike, current.Strike);
			properties.DStrike		  = ::merge(prev.DStrike, current.DStrike);
			properties.SmallCaps	  = ::merge(prev.SmallCaps, current.SmallCaps);
			properties.Caps			  = ::merge(prev.Caps, current.Caps);
			properties.Emboss		  = ::merge(prev.Emboss, current.Emboss);
			properties.Imprint		  = ::merge(prev.Imprint, current.Imprint);
			properties.Outline		  = ::merge(prev.Outline, current.Outline);
			properties.Shadow		  = ::merge(prev.Shadow, current.Shadow);
			properties.Vanish		  = ::merge(prev.Vanish, current.Vanish);
			properties.WebHidden	  = ::merge(prev.WebHidden, current.WebHidden);
			properties.FontSize		  = ::merge(prev.FontSize, current.FontSize);
			properties.RStyle		  = ::merge(prev.RStyle, current.RStyle);
			properties.Lang			  = ::merge(prev.Lang, current.Lang);
			properties.Index		  = ::merge(prev.Index, current.Index);
			properties.FontColor	  = ::merge(prev.FontColor, current.FontColor);
			
			properties.Shading		  = ::merge(prev.Shading, current.Shading);
	
			properties.rFonts		  = ::merge(prev.rFonts, current.rFonts);
			properties.Spacing		  = ::merge(prev.Spacing, current.Spacing);
			properties.Kern			  = ::merge(prev.Kern, current.Kern);
			properties.Position		  = ::merge(prev.Position, current.Position);
			properties.Scale		  = ::merge(prev.Scale, current.Scale);
			properties.Border		  = ::merge(prev.Border, current.Border);
			properties.PropertyChange = ::merge(prev.PropertyChange, current.PropertyChange);
			return properties;
		}

	} 
} // namespace OOX