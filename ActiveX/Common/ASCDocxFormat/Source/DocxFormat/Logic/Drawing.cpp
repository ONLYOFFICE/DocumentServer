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


#include "Drawing.h"
#include "Inline.h"


namespace OOX
{
	namespace Logic
	{

		Drawing::Drawing() : haveAnchor(false)
		{
		}


		Drawing::~Drawing()
		{
		}


		Drawing::Drawing(const RId& rId, const OOX::CPath& filename, const long width, const long height)
		{
			haveAnchor	=	false;

			Inline->DistT = 0;
			Inline->DistB = 0;
			Inline->DistL = 0;
			Inline->DistR = 0;

			Inline->Extent = Extent();
			
			int newH;
			int newW;
			int dpi = 96;
			double heightPage	=	25.7;
			double widthPage	=	16.5;
			double maximum		=	__max(width / (widthPage / 2.54 * dpi), height / (heightPage / 2.54 * dpi));

			if (maximum < 1)
			{				
				newW	=	(int) ( width  * 2.54 * 72 * 100.0 * 1000.0 / 20.0 / 96.0);					
				newH	=	(int) ( height * 2.54 * 72 * 100.0 * 1000.0 / 20.0 / 96.0);					
			}
			else
			{				
				newW	=	(int) ( width  / maximum * 2.54 * 72.0 * 100.0 * 1000.0 / 20.0 / 96.0);		
				newH	=	(int) ( height / maximum * 2.54 * 72.0 * 100.0 * 1000.0 / 20.0 / 96.0);		
			}

			Inline->Extent->Size->Width			=	newW;
			Inline->Extent->Size->Height		=	newH;

			Inline->EffectExtent->Left			=	19050;
			Inline->EffectExtent->Top			=	0;
			Inline->EffectExtent->Right			=	3175;
			Inline->EffectExtent->Bottom		=	0;

			Inline->DocPr						=	DocPr();
			Inline->DocPr->Id					=	1;
			Inline->DocPr->Name					=	"Image 0";
			Inline->DocPr->Descr				=	Encoding::unicode2utf8(std::wstring(filename.GetPath()));

			Inline->NoChangeAspect				=	1;
			Inline->Graphic->Uri				=	"http://schemas.openxmlformats.org/drawingml/2006/picture";

			Inline->Graphic->Pic->Id			=	0;
			Inline->Graphic->Pic->Name			=	Encoding::unicode2utf8(std::wstring(filename.GetPath()));
			Inline->Graphic->Pic->rId			=	rId;

			Inline->Graphic->Pic->Off.init();
			Inline->Graphic->Pic->Off->X		=	0;
			Inline->Graphic->Pic->Off->Y		=	0;

			Inline->Graphic->Pic->Ext.init();
			Inline->Graphic->Pic->Ext->Width	=	newW;
			Inline->Graphic->Pic->Ext->Height	=	newH;
			Inline->Graphic->Pic->Prst			=	"rect";
		}

		Drawing::Drawing(const RId& rId, const OOX::CPath& filename, const long xEmu, const std::string& hRelativeFrom, const long yEmu, const std::string& vRelativeFrom, const long widthEmu, const long heightEmu)
		{
			Inline->Name = "anchor";

			Inline->DistT = 0;
			Inline->DistB = 0;
			Inline->DistL = 0;
			Inline->DistR = 0;

			Inline->positionH = xEmu;
			Inline->positionHRelativeFrom = hRelativeFrom;
			Inline->positionV = yEmu;
			Inline->positionVRelativeFrom = vRelativeFrom;

			DrawingWrap wrap;
			wrap.Type = "wrapTopAndBottom";
			wrap.TextWrap = "bothSides";
			Inline->Wrap = wrap;

			Point2D simplePos;
			simplePos.name = "simplePos";
			simplePos.x = 0;
			simplePos.y = 0;

			Inline->SimplePos = false;
			Inline->RelativeHeight = 0;
			Inline->BehindDoc = false;
			Inline->Locked = false;
			Inline->LayoutInCell = true;
			Inline->AllowOverlap = true;

			Inline->SimplePosPoint = simplePos;

			Inline->Extent = Extent();
			
			Inline->Extent->Size->Width  = widthEmu;
			Inline->Extent->Size->Height = heightEmu;

			Inline->EffectExtent->Left = 19050;
			Inline->EffectExtent->Top = 0;
			Inline->EffectExtent->Right = 3175;
			Inline->EffectExtent->Bottom = 0;

			Inline->DocPr = DocPr();
			Inline->DocPr->Id = 1;
			Inline->DocPr->Name = "Image 0";
			Inline->DocPr->Descr = Encoding::unicode2utf8(std::wstring(filename.GetPath()));

			Inline->NoChangeAspect = 1;
			Inline->Graphic->Uri = "http://schemas.openxmlformats.org/drawingml/2006/picture";

			Inline->Graphic->Pic->Id = 0;
			Inline->Graphic->Pic->Name = Encoding::unicode2utf8(std::wstring(filename.GetPath()));
			Inline->Graphic->Pic->rId = rId;

			Inline->Graphic->Pic->Off.init();
			Inline->Graphic->Pic->Off->X = 0;
			Inline->Graphic->Pic->Off->Y = 0;

			Inline->Graphic->Pic->Ext.init();
			Inline->Graphic->Pic->Ext->Width = widthEmu;
			Inline->Graphic->Pic->Ext->Height = heightEmu;
			Inline->Graphic->Pic->Prst = "rect";
		}

		Drawing::Drawing(const XML::XNode& node)
		{
			fromXML(node);
		}

		const Drawing& Drawing::operator =(const XML::XNode& node)
		{
			fromXML(node);
			return *this;
		}

		void Drawing::fromXML(const XML::XNode& node)
		{
			const XML::XElement element(node);
			if (element.element("inline").exist())
			{
				Inline		=	element.element("inline");
				haveAnchor	=	false;
			}
			else if (element.element("anchor").exist())
			{
				Inline		=	element.element("anchor");
				haveAnchor	=	true;
			}
		}

		const XML::XNode Drawing::toXML() const
		{
			return XML::XElement();
		}

		const std::string Drawing::toTxt() const
		{
			return "[image]";
		}

	} 
} // namespace OOX