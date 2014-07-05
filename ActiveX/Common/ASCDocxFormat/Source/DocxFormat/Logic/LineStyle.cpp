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


#include "LineStyle.h"

namespace OOX
{
	namespace Logic
	{			
		LineStyle::LineStyle()
		{

		}

		LineStyle::~LineStyle()
		{

		}

		LineStyle::LineStyle(const XML::XNode& node)
		{
			fromXML(node);
		}

		const LineStyle& LineStyle::operator = (const XML::XNode& node)
		{
			fromXML(node);
			return *this;
		}

		void LineStyle::fromXML(const XML::XNode& node)
		{
			const XML::XElement element(node);

			if (element.attribute("stroked").exist())
				stroked					=	element.attribute("stroked").value();

			if (element.attribute("strokecolor").exist())
				strokeColor				=	element.attribute("strokecolor").value();

			if (element.attribute("strokeweight").exist())
				strokeWeight			=	element.attribute("strokeweight").value();

			const XML::XElement strokeXML = element.element("stroke");
			if (strokeXML.is_init())
			{
				if (strokeXML.attribute("linestyle").exist())
					lineStyle			=	strokeXML.attribute ("linestyle").value();
				if (strokeXML.attribute("dashstyle").exist())
					dashStyle			=	strokeXML.attribute ("dashstyle").value();
				if (strokeXML.attribute("opacity").exist())
					opacity				=	strokeXML.attribute ("opacity").value();
				if (strokeXML.attribute("endcap").exist())
					endcap				=	strokeXML.attribute ("endcap").value();
				if (strokeXML.attribute("startarrow").exist())
					startarrow			=	strokeXML.attribute ("startarrow").value();
				if (strokeXML.attribute("endarrow").exist())
					endarrow			=	strokeXML.attribute ("endarrow").value();			
				if (strokeXML.attribute("startarrowwidth").exist())
					startarrowwidth		=	strokeXML.attribute ("startarrowwidth").value();
				if (strokeXML.attribute("startarrowlength").exist())
					startarrowlength	=	strokeXML.attribute ("startarrowlength").value();
				if (strokeXML.attribute("endarrowwidth").exist())
					endarrowwidth		=	strokeXML.attribute ("endarrowwidth").value();
				if (strokeXML.attribute("endarrowlength").exist())
					endarrowlength		=	strokeXML.attribute ("endarrowlength").value();
			}	

			if (element.attribute("color").exist())
				strokeColor				=	element.attribute("color").value();			
			if (element.attribute("opacity").exist())
				strokeColor			=	element.attribute("opacity").value();	
			if (element.attribute("weight").exist())
				strokeWeight			=	element.attribute("weight").value();	
			if (element.attribute("endcap").exist())
				endcap					=	element.attribute("endcap").value();	
			if (element.attribute("startarrow").exist())
				startarrow				=	element.attribute ("startarrow").value();
			if (element.attribute("endarrow").exist())
				endarrow				=	element.attribute ("endarrow").value();
			if (element.attribute("startarrowwidth").exist())
				startarrowwidth			=	element.attribute ("startarrowwidth").value();
			if (element.attribute("startarrowlength").exist())
				startarrowlength		=	element.attribute ("startarrowlength").value();
			if (element.attribute("endarrowwidth").exist())
				endarrowwidth			=	element.attribute ("endarrowwidth").value();
			if (element.attribute("endarrowlength").exist())
				endarrowlength			=	element.attribute ("endarrowlength").value();
		}

		const XML::XNode LineStyle::toXML() const
		{			
			return XML::XElement();
		}

	} 
} 
