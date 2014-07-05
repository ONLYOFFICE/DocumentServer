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


#include "FillStyle.h"

namespace OOX
{
	namespace Logic
	{			
		FillStyle::FillStyle()
		{

		}

		FillStyle::~FillStyle()
		{

		}

		FillStyle::FillStyle(const XML::XNode& node)
		{
			fromXML(node);
		}

		const FillStyle& FillStyle::operator = (const XML::XNode& node)
		{
			fromXML(node);
			return *this;
		}

		void FillStyle::fromXML(const XML::XNode& node)
		{
			const XML::XElement element(node);

			if (element.attribute("filled").exist())
				filled		=	element.attribute("filled").value();
			if (element.attribute("fillcolor").exist())
				fillcolor	=	element.attribute("fillcolor").value();			

			const XML::XElement fillXML	= element.element("fill");
			if (fillXML.is_init())
			{
				if (fillXML.attribute("opacity").exist())
					opacity	=	fillXML.attribute ("opacity").value();
				if (fillXML.attribute("id").exist())
					Id		=	fillXML.attribute("id").value();
				if (fillXML.attribute("type").exist())
					type	=	fillXML.attribute("type").value();
				if (fillXML.attribute("recolor").exist())
					recolor	=	fillXML.attribute("recolor").value();
				if (fillXML.attribute("rotate").exist())
					rotate	=	fillXML.attribute("rotate").value();
			}	

			if (element.attribute("color").exist())
				fillcolor	=	element.attribute("color").value();			
			if (element.attribute("opacity").exist())
				opacity		=	element.attribute("opacity").value();
		}

		const XML::XNode FillStyle::toXML() const
		{			
			return XML::XElement();
		}
	} 
}
