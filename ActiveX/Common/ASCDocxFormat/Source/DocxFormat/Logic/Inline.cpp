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


#include "Inline.h"

namespace OOX
{
	namespace Logic
	{
		Inline::Inline()
		{

		}

		Inline::~Inline()
		{

		}

		Inline::Inline(const XML::XNode& node)
		{
			fromXML(node);
		}

		const Inline& Inline::operator =(const XML::XNode& node)
		{
			fromXML(node);
			return *this;
		}

		void Inline::fromXML(const XML::XNode& node)
		{
			const XML::XElement element(node);

			distanceLeftTop.init();

			distanceLeftTop->X			=	element.attribute("distL").value().ToString();
			distanceLeftTop->Y			=	element.attribute("distT").value().ToString();
			
			distanceRightBottom.init();

			distanceRightBottom->X		=	element.attribute("distR").value().ToString();
			distanceRightBottom->Y		=	element.attribute("distB").value().ToString();

			Name						=	element.XName->Name;

			if (element.attribute("distT").exist())
				DistT					=	element.attribute("distT").value();
			if (element.attribute("distB").exist())
				DistB					=	element.attribute("distB").value();
			if (element.attribute("distL").exist())
				DistL					=	element.attribute("distL").value();
			if (element.attribute("distR").exist())
				DistR					=	element.attribute("distR").value();

			Extent						=	element.element("extent");
			DocPr						=	element.element("docPr");
			NoChangeAspect				=	element.element("cNvGraphicFramePr").element("graphicFrameLocks").attribute("noChangeAspect").value();
			Graphic						=	element.element("graphic");
			
			anchorXY.init();
			anchorXY->X					=	0;
			anchorXY->Y					=	0;

			if (element.element("positionH").exist())
			{
				anchorXY->X				=	element.element("positionH").element("posOffset").text().ToString();
				
				positionH				=	element.element("positionH").element("posOffset").text();
				positionHAlign			=	element.element("positionH").element("align").text();
				positionHRelativeFrom	=	element.element("positionH").attribute("relativeFrom").value();
			}

			if (element.element("positionV").exist())
			{
				anchorXY->Y				=	element.element("positionV").element("posOffset").text().ToString();
				
				positionV				=	element.element("positionV").element("posOffset").text();
				positionVAlign			=	element.element("positionV").element("align").text();
				positionVRelativeFrom	=	element.element("positionV").attribute("relativeFrom").value();
			}

			Wrap						=	element;

			SimplePos					=	element.attribute("simplePos").value();
			SimplePosPoint				=	element.element("simplePos");
			RelativeHeight				=	element.attribute("relativeHeight").value();
			BehindDoc					=	element.attribute("behindDoc").value();
			Locked						=	element.attribute("locked").value();
			LayoutInCell				=	element.attribute("layoutInCell").value();
			AllowOverlap				=	element.attribute("allowOverlap").value();
		}

		const XML::XNode Inline::toXML() const
		{
			return XML::XElement();
				
				
				
				
				

				
				
				
				
				
				

				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
		}

	} 
} // namespace OOX