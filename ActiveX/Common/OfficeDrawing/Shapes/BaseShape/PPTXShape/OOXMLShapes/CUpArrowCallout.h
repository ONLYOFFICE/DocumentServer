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
	class CUpArrowCallout : public CPPTXShape
	{
		public:
			CUpArrowCallout()
			{
				LoadFromXML(
					_T("<ooxml-shape>")
					_T("<avLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<gd name=\"adj1\" fmla=\"val 25000\" />")
					  _T("<gd name=\"adj2\" fmla=\"val 25000\" />")
					  _T("<gd name=\"adj3\" fmla=\"val 25000\" />")
					  _T("<gd name=\"adj4\" fmla=\"val 64977\" />")
					_T("</avLst>")
					_T("<gdLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<gd name=\"maxAdj2\" fmla=\"*/ 50000 w ss\" />")
					  _T("<gd name=\"a2\" fmla=\"pin 0 adj2 maxAdj2\" />")
					  _T("<gd name=\"maxAdj1\" fmla=\"*/ a2 2 1\" />")
					  _T("<gd name=\"a1\" fmla=\"pin 0 adj1 maxAdj1\" />")
					  _T("<gd name=\"maxAdj3\" fmla=\"*/ 100000 h ss\" />")
					  _T("<gd name=\"a3\" fmla=\"pin 0 adj3 maxAdj3\" />")
					  _T("<gd name=\"q2\" fmla=\"*/ a3 ss h\" />")
					  _T("<gd name=\"maxAdj4\" fmla=\"+- 100000 0 q2\" />")
					  _T("<gd name=\"a4\" fmla=\"pin 0 adj4 maxAdj4\" />")
					  _T("<gd name=\"dx1\" fmla=\"*/ ss a2 100000\" />")
					  _T("<gd name=\"dx2\" fmla=\"*/ ss a1 200000\" />")
					  _T("<gd name=\"x1\" fmla=\"+- hc 0 dx1\" />")
					  _T("<gd name=\"x2\" fmla=\"+- hc 0 dx2\" />")
					  _T("<gd name=\"x3\" fmla=\"+- hc dx2 0\" />")
					  _T("<gd name=\"x4\" fmla=\"+- hc dx1 0\" />")
					  _T("<gd name=\"y1\" fmla=\"*/ ss a3 100000\" />")
					  _T("<gd name=\"dy2\" fmla=\"*/ h a4 100000\" />")
					  _T("<gd name=\"y2\" fmla=\"+- b 0 dy2\" />")
					  _T("<gd name=\"y3\" fmla=\"+/ y2 b 2\" />")
					_T("</gdLst>")
					_T("<ahLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<ahXY gdRefX=\"adj1\" minX=\"0\" maxX=\"maxAdj1\">")
						_T("<pos x=\"x2\" y=\"y1\" />")
					  _T("</ahXY>")
					  _T("<ahXY gdRefX=\"adj2\" minX=\"0\" maxX=\"maxAdj2\">")
						_T("<pos x=\"x1\" y=\"t\" />")
					  _T("</ahXY>")
					  _T("<ahXY gdRefY=\"adj3\" minY=\"0\" maxY=\"maxAdj3\">")
						_T("<pos x=\"r\" y=\"y1\" />")
					  _T("</ahXY>")
					  _T("<ahXY gdRefY=\"adj4\" minY=\"0\" maxY=\"maxAdj4\">")
						_T("<pos x=\"l\" y=\"y2\" />")
					  _T("</ahXY>")
					_T("</ahLst>")
					_T("<cxnLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<cxn ang=\"3cd4\">")
						_T("<pos x=\"hc\" y=\"t\" />")
					  _T("</cxn>")
					  _T("<cxn ang=\"cd2\">")
						_T("<pos x=\"l\" y=\"y2\" />")
					  _T("</cxn>")
					  _T("<cxn ang=\"cd4\">")
						_T("<pos x=\"hc\" y=\"b\" />")
					  _T("</cxn>")
					  _T("<cxn ang=\"0\">")
						_T("<pos x=\"r\" y=\"y2\" />")
					  _T("</cxn>")
					_T("</cxnLst>")
					_T("<rect l=\"l\" t=\"y2\" r=\"r\" b=\"b\" xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\" />")
					_T("<pathLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<path>")
						_T("<moveTo>")
						  _T("<pt x=\"l\" y=\"y2\" />")
						_T("</moveTo>")
						_T("<lnTo>")
						  _T("<pt x=\"x2\" y=\"y2\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"x2\" y=\"y1\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"x1\" y=\"y1\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"hc\" y=\"t\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"x4\" y=\"y1\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"x3\" y=\"y1\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"x3\" y=\"y2\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"r\" y=\"y2\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"r\" y=\"b\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"l\" y=\"b\" />")
						_T("</lnTo>")
						_T("<close />")
					  _T("</path>")
					_T("</pathLst>")
					_T("</ooxml-shape>")
				);
			}
	};
}