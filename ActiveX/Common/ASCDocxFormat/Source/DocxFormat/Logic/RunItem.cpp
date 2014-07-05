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


#include "RunItem.h"
#include "Text.h"
#include "Symbol.h"
#include "Drawing.h"
#include "Pict.h"
#include "ContinuationSeparator.h"
#include "FootnoteRef.h"
#include "EndnoteRef.h"
#include "Separator.h"
#include "Tab.h"
#include "Break.h"
#include "FootnoteReference.h"
#include "EndnoteReference.h"

#include "Pict.h"
#include "FldChar.h"
#include "InstrText.h"
#include "DelText.h"
#include "NullRun.h"

namespace OOX
{
	namespace Logic
	{
		RunItem::RunItem()
		{

		}

		RunItem::~RunItem()
		{

		}

		RunItem::RunItem(RunItemBase* item)
		{
			fromItem(item);
		}

		RunItem::RunItem(const XML::XNode& node)
		{
			fromXML(node);
		}

		RunItem::RunItem(const std::string& text)
		{
			fromTxt(text);
		}

		const RunItem& RunItem::operator =(RunItemBase* item)
		{
			fromItem(item);
			return *this;
		}

		const RunItem& RunItem::operator =(const XML::XNode& node)
		{
			fromXML(node);
			return *this;
		}

		const RunItem& RunItem::operator =(const std::string& text)
		{
			fromTxt(text);
			return *this;
		}

		void RunItem::fromItem(RunItemBase* item)
		{
			m_item.reset(item);
		}

		void RunItem::fromXML(const XML::XNode& node)
		{
			const XML::XElement element(node);

			if (element.XName == "t")
				fromItem(new Text(node));
			else if (element.XName == "tab")
				fromItem(new Tab(node));
			else if (element.XName == "br")
				fromItem(new Break(node));
			else if (element.XName == "drawing")
				fromItem(new Drawing(node));
			else if (element.XName == "pict" || element.XName == "object")
				fromItem(new Pict(node));
			else if (element.XName == "footnoteRef")
				fromItem(new FootnoteRef(node));
			else if (element.XName == "endnoteRef")
				fromItem(new EndnoteRef(node));
			else if (element.XName == "continuationSeparator")
				fromItem(new ContinuationSeparator(node));
			else if (element.XName == "separator")
				fromItem(new Separator(node));
			else if (element.XName == "footnoteReference")
				fromItem(new FootnoteReference(node));
			else if (element.XName == "endnoteReference")
				fromItem(new EndnoteReference(node));
			
			else if (element.XName == "fldChar")
				fromItem(new FldChar(node));
			else if (element.XName == "instrText")
				fromItem(new InstrText(node));
			else if (element.XName == "sym")
				fromItem(new Symbol(node));
			else if (element.XName == "delText")
				fromItem(new DelText(node));
			else
				fromItem(new NullRun(node));
		}

		const XML::XNode RunItem::toXML() const
		{
		return XML::XElement();
		}

		void RunItem::fromTxt(const std::string& text)
		{
			m_item.reset(new Text(text));
		}

		const std::string RunItem::toTxt() const
		{
			return m_item->toTxt();
		}

	} 
} // namespace OOX