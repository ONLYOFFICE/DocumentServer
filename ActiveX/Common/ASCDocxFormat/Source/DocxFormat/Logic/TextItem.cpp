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


#include "TextItem.h"
#include "Paragraph.h"
#include "Table.h"
#include "Sdt.h"
#include "BookmarkStartParagraph.h"
#include "BookmarkEndParagraph.h"

namespace OOX
{
	namespace Logic
	{
		TextItem::TextItem()
		{
		}

		TextItem::~TextItem()
		{
		}

		TextItem::TextItem(const Paragraph& paragraph) : m_item(new Paragraph(paragraph))
		{
		}

		TextItem::TextItem(const Table& table) : m_item(new Table(table))
		{
		}

		TextItem::TextItem(const Sdt& sdt) : m_item(new Sdt(sdt))
		{
		}

		TextItem::TextItem(const BookmarkStartParagraph& bookmark)	: m_item(new BookmarkStartParagraph(bookmark))
		{
		}

		TextItem::TextItem(const BookmarkEndParagraph& bookmark): m_item(new BookmarkEndParagraph(bookmark))
		{
		}
	
		TextItem::TextItem(const XML::XNode& node)
		{
			fromXML(node);
		}

		const TextItem& TextItem::operator =(const XML::XNode& node)
		{
			fromXML(node);
			return *this;
		}

		TextItem::TextItem(XmlUtils::CXmlNode& node)
		{
			fromXML(node);
		}

		const TextItem& TextItem::operator =(XmlUtils::CXmlNode& node)
		{
			fromXML(node);
			return *this;
		}	
		
		void TextItem::fromXML(const XML::XNode& node)
		{
			const XML::XElement element(node);

			if (element->XName == "p")
			{
				m_item.reset(new Paragraph(node));
			}
			else if (element->XName == "tbl")
			{
				m_item.reset(new Table(node));
			}
			else if (element->XName == "sdt")
			{
				m_item.reset(new Sdt(node));
			}
			else if (element->XName == "bookmarkStart")
			{
				m_item.reset(new BookmarkStartParagraph(node));
			}
			else if (element->XName == "bookmarkEnd")
			{
				m_item.reset(new BookmarkEndParagraph(node));
			}
		}

		void TextItem::fromXML(XmlUtils::CXmlNode& node)
		{
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
		}

		const XML::XNode TextItem::toXML() const
		{
			return m_item->toXML();
		}	

	} 
} // namespace OOX