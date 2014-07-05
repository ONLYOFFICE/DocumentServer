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


#include "Border.h"


namespace OOX
{
	namespace Logic
	{

		Border::Border()
		{
		}


		Border::~Border()
		{
		}
	

		Border::Border(const XML::XNode& node)
		{
			fromXML(node);
		}


		Border::Border(const std::string& name, const BorderItem& border)
			: Name(name),
				Bdr(border)
		{
		}


		const Border& Border::operator =(const XML::XNode& node)
		{
			fromXML(node);
			return *this;
		}


		void Border::fromXML(const XML::XNode& node)
		{
			const XML::XElement element(node);
			Name			= element.XName->Name; 
			Bdr->Value		= element.attribute("val").value();
			if (element.attribute("sz").value().ToString() == "auto")
				Bdr->Sz		= 0;
			else
				Bdr->Sz		= element.attribute("sz").value();
			Bdr->Space		= element.attribute("space").value();
			Bdr->Color		= element.attribute("color").value();
			Bdr->ThemeColor = element.attribute("themeColor").value();
		}


		const XML::XNode Border::toXML() const
		{
		return XML::XElement();
		}

	} 
} // namespace OOX