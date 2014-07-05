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


#include "ParagraphItem.h"
#include "./../FormatError.h"

namespace OOX
{
	namespace Logic
	{
		ParagraphItem::ParagraphItem()
		{
		}
		
		ParagraphItem::ParagraphItem(const Run& run)
			: IItemable<ParagraphItemBase>(new Run(run))
		{
		}


		ParagraphItem::ParagraphItem(const Hyperlink& hyperlink)
			: IItemable<ParagraphItemBase>(new Hyperlink(hyperlink))
		{
		}


		ParagraphItem::ParagraphItem(const BookmarkStart& start)
			: IItemable<ParagraphItemBase>(new BookmarkStart(start))
		{
		}
		
		
		ParagraphItem::ParagraphItem(const BookmarkEnd& end)
			: IItemable<ParagraphItemBase>(new BookmarkEnd(end))
		{
		}


		ParagraphItem::~ParagraphItem()
		{
		}


		ParagraphItem::ParagraphItem(const XML::XNode& node)
		{
			fromXML(node);
		}


		const ParagraphItem& ParagraphItem::operator =(const XML::XNode& node)
		{
			fromXML(node);
			return *this;
		}


		void ParagraphItem::fromXML(const XML::XNode& node)
		{
			const XML::XElement element(node);

			if (element.XName == "r")
				m_item.reset(new Run(element));
			else if (element.XName == ("hyperlink"))
				m_item.reset(new Hyperlink(element));
			else if (element.XName == ("bookmarkStart"))
				m_item.reset(new BookmarkStart(element));
			else if (element.XName == ("bookmarkEnd"))
				m_item.reset(new BookmarkEnd(element));
			else if (element.XName == ("fldSimple"))
				m_item.reset(new FldSimple(element));
			else if (element.XName == ("ins"))
				m_item.reset(new Insert(element));
			else if (element.XName == ("del"))
				m_item.reset(new Delete(element));
			else
				throw FormatError("bad ParagraphItem type");		
		}
		
		
		const XML::XNode ParagraphItem::toXML() const
		{
			return XML::XNode();	
		}


		const std::string ParagraphItem::toTxt() const
		{
			return m_item->toTxt();
		}

	} 
} // namespace OOX