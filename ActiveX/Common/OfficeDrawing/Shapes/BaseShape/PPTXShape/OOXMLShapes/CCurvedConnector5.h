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
 #pragma once
#include "../PPTXShape.h"

namespace OOXMLShapes
{
	class CCurvedConnector5 : public CPPTXShape
	{
		public:
			CCurvedConnector5()
			{
				LoadFromXML(
					_T("<ooxml-shape>")
					_T("<avLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<gd name=\"adj1\" fmla=\"val 50000\" />")
					  _T("<gd name=\"adj2\" fmla=\"val 50000\" />")
					  _T("<gd name=\"adj3\" fmla=\"val 50000\" />")
					_T("</avLst>")
					_T("<gdLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<gd name=\"x3\" fmla=\"*/ w adj1 100000\" />")
					  _T("<gd name=\"x6\" fmla=\"*/ w adj3 100000\" />")
					  _T("<gd name=\"x1\" fmla=\"+/ x3 x6 2\" />")
					  _T("<gd name=\"x2\" fmla=\"+/ l x3 2\" />")
					  _T("<gd name=\"x4\" fmla=\"+/ x3 x1 2\" />")
					  _T("<gd name=\"x5\" fmla=\"+/ x6 x1 2\" />")
					  _T("<gd name=\"x7\" fmla=\"+/ x6 r 2\" />")
					  _T("<gd name=\"y4\" fmla=\"*/ h adj2 100000\" />")
					  _T("<gd name=\"y1\" fmla=\"+/ t y4 2\" />")
					  _T("<gd name=\"y2\" fmla=\"+/ t y1 2\" />")
					  _T("<gd name=\"y3\" fmla=\"+/ y1 y4 2\" />")
					  _T("<gd name=\"y5\" fmla=\"+/ b y4 2\" />")
					  _T("<gd name=\"y6\" fmla=\"+/ y5 y4 2\" />")
					  _T("<gd name=\"y7\" fmla=\"+/ y5 b 2\" />")
					_T("</gdLst>")
					_T("<ahLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<ahXY gdRefX=\"adj1\" minX=\"-2147483647\" maxX=\"2147483647\">")
						_T("<pos x=\"x3\" y=\"y1\" />")
					  _T("</ahXY>")
					  _T("<ahXY gdRefY=\"adj2\" minY=\"-2147483647\" maxY=\"2147483647\">")
						_T("<pos x=\"x1\" y=\"y4\" />")
					  _T("</ahXY>")
					  _T("<ahXY gdRefX=\"adj3\" minX=\"-2147483647\" maxX=\"2147483647\">")
						_T("<pos x=\"x6\" y=\"y5\" />")
					  _T("</ahXY>")
					_T("</ahLst>")
					_T("<rect l=\"l\" t=\"t\" r=\"r\" b=\"b\" xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\" />")
					_T("<pathLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<path fill=\"none\">")
						_T("<moveTo>")
						  _T("<pt x=\"l\" y=\"t\" />")
						_T("</moveTo>")
						_T("<cubicBezTo>")
						  _T("<pt x=\"x2\" y=\"t\" />")
						  _T("<pt x=\"x3\" y=\"y2\" />")
						  _T("<pt x=\"x3\" y=\"y1\" />")
						_T("</cubicBezTo>")
						_T("<cubicBezTo>")
						  _T("<pt x=\"x3\" y=\"y3\" />")
						  _T("<pt x=\"x4\" y=\"y4\" />")
						  _T("<pt x=\"x1\" y=\"y4\" />")
						_T("</cubicBezTo>")
						_T("<cubicBezTo>")
						  _T("<pt x=\"x5\" y=\"y4\" />")
						  _T("<pt x=\"x6\" y=\"y6\" />")
						  _T("<pt x=\"x6\" y=\"y5\" />")
						_T("</cubicBezTo>")
						_T("<cubicBezTo>")
						  _T("<pt x=\"x6\" y=\"y7\" />")
						  _T("<pt x=\"x7\" y=\"b\" />")
						  _T("<pt x=\"r\" y=\"b\" />")
						_T("</cubicBezTo>")
					  _T("</path>")
					_T("</pathLst>")
					_T("</ooxml-shape>")
				);
			}
	};
}