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


#include "TableRow.h"
#include "Exception/log_runtime_error.h"

namespace OOX
{
	namespace Logic
	{
		TableRow::TableRow()
		{

		}

		TableRow::~TableRow()
		{

		}

		TableRow::TableRow(const XML::XNode& node)
		{
			fromXML(node);
		}

		const TableRow& TableRow::operator =(const XML::XNode& node)
		{
			fromXML(node);
			return *this;
		}

		void TableRow::fromXML(const XML::XNode& node)
		{
			const XML::XElement element(node);
			
			Properties	= element.element("trPr");
			int numCol = 0;
			for (XML::const_element_iterator i = element.Elements.begin(); i != element.Elements.end(); ++i)
			{
				XML::XElement element(*i);
				if (element.XName == "tc")
				{
					TableCell cell(*i);
					cell.NumCol = numCol;
					Cells->push_back(cell);

					int count = cell.Properties->GridSpan.get_value_or(1);

					
					while(count-- > 0)
						numCol++;
				}
				else if (element.XName == "sdt")
				{
					if(element.element("sdtContent").exist())
					{
						if(element.element("sdtContent").element("tc").exist())
						{
							
							TableCell cell(element.element("sdtContent").element("tc"));
							cell.NumCol = numCol;
							Cells->push_back(cell);

							int count = cell.Properties->GridSpan.get_value_or(1);

							
							while(count-- > 0)
								numCol++;
						}
					}
				}
			}
		}

		const XML::XNode TableRow::toXML() const
		{
		return XML::XElement();
		}

		const TableCell TableRow::getCellByNumCol(const int num) const
		{
			const std::vector<TableCell>& runs = Cells.get();

			for (std::vector<TableCell>::const_iterator iter = runs.begin(); iter != runs.end(); ++iter)
			{
				if ((*iter).NumCol == num)
					return (*iter);
			}

			throw log_runtime_error("bad num column");
		}

		const bool TableRow::isCellByNumCol(const int num) const
		{
			const std::vector<TableCell>& runs = Cells.get();

			for (std::vector<TableCell>::const_iterator iter = runs.begin(); iter != runs.end(); ++iter)
			{
				if ((*iter).NumCol == num)
					return true;
			}
			
			return false;
		}

	} 
} // namespace OOX