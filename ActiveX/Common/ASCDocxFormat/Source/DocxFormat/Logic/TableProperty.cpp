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


#include "TableProperty.h"

namespace OOX
{
	namespace Logic
	{
		TableProperty::TableProperty()
		{
			tblStyleRowBandSize		=	1;
			tblStyleColBandSize		=	1;

			firstRow				=	0;
			lastRow					=	0;
			firstColumn				=	0;
			lastColumn				=	0;
			noHBand					=	0;
			noVBand					=	0;
		}

		TableProperty::~TableProperty()
		{

		}	

		TableProperty::TableProperty(const XML::XNode& node)
		{
			fromXML(node);
		}

		const TableProperty& TableProperty::operator =(const XML::XNode& node)
		{
			fromXML(node);
			return *this;
		}

		void TableProperty::fromXML(const XML::XNode& node)
		{
			const XML::XElement element(node);

			Style					=	element.element("tblStyle").attribute("val").value();
			Width					=	element.element("tblW");
			Look					=	element.element("tblLook").attribute("val").value();
			Ind						=	element.element("tblInd");
			CellMar					=	element.element("tblCellMar");
			tblBorders				=	element.element("tblBorders");
			Layout					=	element.element("tblLayout").attribute("type").value();

			if (element.element("tblStyleRowBandSize").exist())
				tblStyleRowBandSize	=	element.element("tblStyleRowBandSize").attribute("val").value().ToInt();
			if (element.element("tblStyleColBandSize").exist())
				tblStyleColBandSize	=	element.element("tblStyleColBandSize").attribute("val").value().ToInt();

			if (element.element("tblLook").exist())
			{
				firstRow			=	element.element("tblLook").attribute("firstRow").value().ToInt();
				lastRow				=	element.element("tblLook").attribute("lastRow").value().ToInt();
				firstColumn			=	element.element("tblLook").attribute("firstColumn").value().ToInt();
				lastColumn			=	element.element("tblLook").attribute("lastColumn").value().ToInt();
				noHBand				=	element.element("tblLook").attribute("noHBand").value().ToInt();
				noVBand				=	element.element("tblLook").attribute("noVBand").value().ToInt();

				if (element.element("tblLook").attribute("val").exist())
				{
					std::string str	=	element.element("tblLook").attribute("val").value().ToString();

					int nVal		=	0;
					if (str.length())
					{
						nVal		=	HexString2Int (str);
					}
					
					firstRow		=	(0 != (nVal & 0x0020));
					lastRow			=	(0 != (nVal & 0x0040));
					firstColumn		=	(0 != (nVal & 0x0080));
					lastColumn		=	(0 != (nVal & 0x0100));
					noHBand			=	(0 != (nVal & 0x0200));
					noVBand			=	(0 != (nVal & 0x0400));
				}
			}
		}

		const XML::XNode TableProperty::toXML() const
		{
		return XML::XElement();
		}

	} 
} // namespace OOX