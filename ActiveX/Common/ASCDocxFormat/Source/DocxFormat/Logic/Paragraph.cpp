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


#include "Paragraph.h"
#include "RunProperty.h"
#include "Exception/log_runtime_error.h"
#include "Run.h"
#include "Drawing.h"
#include "Tab.h"
#include "Break.h"
#include "Text.h"
#include "Symbol.h"


namespace OOX
{
	namespace Logic
	{

		Paragraph::Paragraph()

		{
		}


		Paragraph::~Paragraph()
		{
		}


		Paragraph::Paragraph(const XML::XNode& node)
		{
			fromXML(node);
		}


		Paragraph::Paragraph(const RId& rId, const OOX::CPath& filename, const long width, const long height)

		{
			RunItemBase* drawing = new Drawing(rId, filename, width, height);
			Run run;
			run.add(drawing);
			Items->push_back(run);
		}

		Paragraph::Paragraph(const RId& rId, const OOX::CPath& filename, const long xEmu, const std::string& hRelativeFrom, const long yEmu, const std::string& vRelativeFrom, const long widthEmu, const long heightEmu)

		{
			RunItemBase* drawing = new Drawing(rId, filename, xEmu, hRelativeFrom, yEmu, vRelativeFrom, widthEmu, heightEmu);
			Run run;
			run.add(drawing);
			Items->push_back(run);
		}


		const Paragraph& Paragraph::operator =(const XML::XNode& node)
		{
			fromXML(node);
			return *this;
		}


		void Paragraph::fromXML(const XML::XNode& node)
		{
			const XML::XElement element(node);

			Property = element.element("pPr");
			for (XML::const_element_iterator i = element.Elements.begin(); i != element.Elements.end(); ++i)
			{
				const XML::XElement element(*i);
				if (element.XName == "r" || element.XName == "hyperlink" || element.XName == "bookmarkStart" ||
					element.XName == "bookmarkEnd" || element.XName == "fldSimple" || element.XName == "ins" ||
					element.XName == "del")
				{
					Items->push_back(ParagraphItem(*i));
				}
			}

			
			
		}


		const XML::XNode Paragraph::toXML() const
		{
		return XML::XElement();
		}


		void Paragraph::Add(const Run& run)
		{
			AddRun(run);
		}


		void Paragraph::AddRun(const Run& run)
		{
			Items->push_back(run);
		}


		void Paragraph::AddText(const std::string& text)
		{
			Run run(text);
			Items->push_back(run);
		}


		void Paragraph::AddText(const std::string& text, const nullable__<Logic::RunProperty>& property)
		{
			Run run(text);
			run.Property = property;
			Items->push_back(run);
		}


		void Paragraph::AddTab()
		{
			Run run;
			run.add<Tab>();
			Items->push_back(run);
		}


		void Paragraph::AddTab(const nullable__<Logic::RunProperty>& property)
		{
			Run run;
			run.add<Tab>();
			run.Property = property;
			Items->push_back(run);
		}


		void Paragraph::AddLineBreak()
		{
			Run run;
			run.add<Break>();
			Items->push_back(run);
		}


		void Paragraph::AddBreak(const std::string& type)
		{
			if (type == "page" || type == "line" || type == "column")
			{
				Run run;
				Break* br = new Break();
				br->Type = type;
				run.add(br);
				Items->push_back(run);
			}
		}


		void Paragraph::AddSpace(const size_t count)
		{
			Run run;
			RunItemBase* text = new Text(std::string(count, ' '));
			run.add(text);
			Items->push_back(run);
		}


		void Paragraph::AddSpace(const size_t count, const nullable__<Logic::RunProperty>& property)
		{
			Run run;
			RunItemBase* text = new Text(std::string(count, ' '));
			run.Property = property;
			run.add(text);
			Items->push_back(run);
		}


		void Paragraph::AddHyperlink(const RId& rId, const std::string& text)
		{
			RunProperty runPr;
			runPr.Under = true;
			runPr.UnderType = "single";
			runPr.FontColor = "0000FF";
			Run run(text, runPr);
			Hyperlink hyperlink;
			hyperlink.rId = rId;
			hyperlink.Runs->push_back(run);
			Items->push_back(hyperlink);
		}


		void Paragraph::AddHyperlink(const std::string& nameHref, const std::string& text)
		{
			RunProperty runPr;
			runPr.RStyle = "Hyperlink";
			Run run(text, runPr);
			Hyperlink hyperlink;
			hyperlink.Anchor  = nameHref;
			hyperlink.History = 1; 
			hyperlink.Runs->push_back(run);
			Items->push_back(hyperlink);
		}


		void Paragraph::AddBookmarkStart(const std::string& name)
		{
			BookmarkStart bookmark(name);
			Items->push_back(bookmark);
		}

	
		void Paragraph::AddBookmarkEnd(const std::string& name)
		{
			BookmarkEnd bookmark;
			Items->push_back(bookmark);
		}


		void Paragraph::AddDrawing(const Drawing& drawing)
		{
			



		}


		void Paragraph::setRunProperty(const OOX::Logic::RunProperty& property)
		{
			if (!Property.is_init())
				Property = ParagraphProperty();
			Property->RunProperty = property;
		}	

		
		const bool Paragraph::isInList() const
		{
			if(!Property.is_init())
				return false;
			if(!Property->NumPr.is_init())
				return false;
			if(!Property->NumPr->NumId.is_init())
				return false;
			return true;
			
		}


		const int Paragraph::GetListNum() const
		{
			if(!Property.is_init())
				return 0;
			if(!Property->NumPr.is_init())
				return 0;
			return Property->NumPr->NumId.get_value_or(0);
			
		}


		const int Paragraph::GetLevel() const
		{
			if(!Property.is_init())
				return 0;
			if(!Property->NumPr.is_init())
				return 0;
			if(!Property->NumPr->Ilvl.is_init())
				return 0;
			return Property->NumPr->Ilvl.get() + 1;
		}

	} 
} // namespace OOX