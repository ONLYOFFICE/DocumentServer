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


#include "ParagraphProperty.h"

namespace OOX
{
	namespace Logic
	{
		ParagraphProperty::ParagraphProperty()
		{
			pageBreakBefore		=	false;
		}

		ParagraphProperty::~ParagraphProperty()
		{

		}	

		ParagraphProperty::ParagraphProperty(const XML::XNode& node)
		{
			fromXML(node);
		}

		const ParagraphProperty& ParagraphProperty::operator =(const XML::XNode& node)
		{
			fromXML(node);
			return *this;
		}

		void ParagraphProperty::fromXML(const XML::XNode& node)
		{
			pageBreakBefore			=	false;

			const XML::XElement element(node);

			PStyle					=	element.element("pStyle").attribute("val").value();
			RunProperty				=	element.element("rPr");
			Align					=	element.element("jc").attribute("val").value();
			
			Shading					=	element.element("shd");
			TextFrameProperties		=	element.element("framePr");
			OutlineLvl				=	element.element("outlineLvl").attribute("val").value();
			TextAlignment			=	element.element("textAlignment ").attribute("val").value();
			Ind						=	element.element("ind");
			Spacing					=	element.element("spacing");
			NumPr					=	element.element("numPr");
			ParagraphBorder			=	element.element("pBdr");
			SectorProperty			=	element.element("sectPr");
			Tabs					=	element.element("tabs");
			KeepNext				=	element.element("keepNext").exist();
			KeepLines				=	element.element("keepLines").exist();

			if (element.element("pageBreakBefore").exist())
			{
				if (element.element("pageBreakBefore").attribute("val").exist())
				{
					pageBreakBefore	=	element.element("pageBreakBefore").attribute("val").value();
				}
			}

			ContextualSpacing		=	element.element("contextualSpacing").exist();
			SuppressLineNumbers		=	element.element("suppressLineNumbers").exist();
			WidowControl			=	element.element("widowControl").attribute("val").value();
			PropertyChange			=	element.element("pPrChange");
		}

		const XML::XNode ParagraphProperty::toXML() const
		{
		return XML::XElement();
		}

		const bool ParagraphProperty::isSimple() const
		{
			if (PStyle.is_init())
				return false;
			if (Align.is_init())
				return false;
			
			if (Shading.is_init())
				return false;
			if (TextFrameProperties.is_init())
				return false;
			if (NumPr.is_init())
				return false;
			if (Ind.is_init())
				return false;
			if (Spacing.is_init())
				return false;
			if(*KeepLines)
				return false;
			if(*KeepNext)
				return false;
			if(*SuppressLineNumbers)
				return false;
			if (!RunProperty.is_init())
				return true;
			if (PropertyChange.is_init())
				return false;
			return RunProperty->isSimple();
		}
	} 
} // namespace OOX