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


#include "Run.h"
#include "./../FormatError.h"
#include "Utility.h"
#include <utility>
#include "Text.h"
#include "Symbol.h"

namespace OOX
{
	namespace Logic
	{

		Run::Run()
		{
		}


		Run::~Run()
		{
		}


		Run::Run(const XML::XNode& node)
		{
			fromXML(node);
		}


		Run::Run(const std::string& text)
		{
			fromTxt(text);
		}


		Run::Run(const std::string& text, const RunProperty& runProperty)
		{
			fromTxt(text);
			Property = runProperty;
		}


		const Run& Run::operator =(const XML::XNode& node)
		{
			fromXML(node);
			return *this;
		}


		const Run& Run::operator =(const std::string& text)
		{
			fromTxt(text);
			return *this;
		}


		void Run::fromXML(const XML::XNode& node)
		{
			const XML::XElement element(node);
			Property = element.element("rPr");

			for (XML::const_node_iterator i = element.Nodes.begin(); i != element.Nodes.end(); ++i)
			{
				if (i->isElement())
				{
					const XML::XElement element(*i);
					
					if (element.XName == "AlternateContent")
					{
						for (XML::const_element_iterator j = element.Elements.begin(); j != element.Elements.end(); ++j)
						{
							const XML::XElement oElement(*j);
							if (oElement.XName == "Fallback")
							{
								for (XML::const_element_iterator j = element.Elements.begin(); j != element.Elements.end(); ++j)
									fromXML (*j);

								break;
							}
						}
					}
					
					if (element.XName == "t" ||element.XName == "tab" || element.XName == "br" || 
							element.XName == "drawing" || element.XName == "pict" || element.XName == "footnoteRef" ||
							element.XName == "endnoteRef" || element.XName == "continuationSeparator" || 
							element.XName == "separator" || element.XName == "footnoteReference" || 
							element.XName == "endnoteReference" || element.XName == "object" ||
							element.XName == "fldChar" || element.XName == "instrText" || element.XName == "sym")
						{
							Items->push_back(RunItem(*i));
						}
				}
				else if (i->isText())
				{
					XML::XText text(*i);
					Items->push_back(RunItem(text.Value));
				}
			}
		}


		void Run::fromTxt(const std::string& text)
		{
			add(text);
		}


		const XML::XNode Run::toXML() const
		{
		return XML::XElement();
		}


		const std::string Run::toTxt() const
		{
			std::string text;

			const std::vector<RunItem>& runs = Items.get();

			for (std::vector<RunItem>::const_iterator iter = runs.begin(); iter != runs.end(); ++iter)
			{
				text += (*iter).toTxt();
			}

			return text;
		}


		const bool Run::empty() const
		{
			return Items->empty();
		}


		void Run::clear()
		{
			Items->clear();
		}


		void Run::add(RunItemBase* item)
		{
			Items->push_back(RunItem(item));
		}


		void Run::add(const std::string& text)
		{
			Items->push_back(RunItem(new Text(text)));
		}

	} 
} // namespace OOX