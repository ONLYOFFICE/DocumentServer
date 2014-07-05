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
	class CMathDivide : public CPPTXShape
	{
		public:
			CMathDivide()
			{
				LoadFromXML(
					_T("<ooxml-shape>")
					_T("<avLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<gd name=\"adj1\" fmla=\"val 23520\" />")
					  _T("<gd name=\"adj2\" fmla=\"val 5880\" />")
					  _T("<gd name=\"adj3\" fmla=\"val 11760\" />")
					_T("</avLst>")
					_T("<gdLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<gd name=\"a1\" fmla=\"pin 1000 adj1 36745\" />")
					  _T("<gd name=\"ma1\" fmla=\"+- 0 0 a1\" />")
					  _T("<gd name=\"ma3h\" fmla=\"+/ 73490 ma1 4\" />")
					  _T("<gd name=\"ma3w\" fmla=\"*/ 36745 w h\" />")
					  _T("<gd name=\"maxAdj3\" fmla=\"min ma3h ma3w\" />")
					  _T("<gd name=\"a3\" fmla=\"pin 1000 adj3 maxAdj3\" />")
					  _T("<gd name=\"m4a3\" fmla=\"*/ -4 a3 1\" />")
					  _T("<gd name=\"maxAdj2\" fmla=\"+- 73490 m4a3 a1\" />")
					  _T("<gd name=\"a2\" fmla=\"pin 0 adj2 maxAdj2\" />")
					  _T("<gd name=\"dy1\" fmla=\"*/ h a1 200000\" />")
					  _T("<gd name=\"yg\" fmla=\"*/ h a2 100000\" />")
					  _T("<gd name=\"rad\" fmla=\"*/ h a3 100000\" />")
					  _T("<gd name=\"dx1\" fmla=\"*/ w 73490 200000\" />")
					  _T("<gd name=\"y3\" fmla=\"+- vc 0 dy1\" />")
					  _T("<gd name=\"y4\" fmla=\"+- vc dy1 0\" />")
					  _T("<gd name=\"a\" fmla=\"+- yg rad 0\" />")
					  _T("<gd name=\"y2\" fmla=\"+- y3 0 a\" />")
					  _T("<gd name=\"y1\" fmla=\"+- y2 0 rad\" />")
					  _T("<gd name=\"y5\" fmla=\"+- b 0 y1\" />")
					  _T("<gd name=\"x1\" fmla=\"+- hc 0 dx1\" />")
					  _T("<gd name=\"x3\" fmla=\"+- hc dx1 0\" />")
					  _T("<gd name=\"x2\" fmla=\"+- hc 0 rad\" />")
					_T("</gdLst>")
					_T("<ahLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<ahXY gdRefY=\"adj1\" minY=\"1000\" maxY=\"36745\">")
						_T("<pos x=\"l\" y=\"y3\" />")
					  _T("</ahXY>")
					  _T("<ahXY gdRefY=\"adj2\" minY=\"0\" maxY=\"maxAdj2\">")
						_T("<pos x=\"r\" y=\"y2\" />")
					  _T("</ahXY>")
					  _T("<ahXY gdRefX=\"adj3\" minX=\"1000\" maxX=\"maxAdj3\">")
						_T("<pos x=\"x2\" y=\"t\" />")
					  _T("</ahXY>")
					_T("</ahLst>")
					_T("<cxnLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<cxn ang=\"0\">")
						_T("<pos x=\"x3\" y=\"vc\" />")
					  _T("</cxn>")
					  _T("<cxn ang=\"cd4\">")
						_T("<pos x=\"hc\" y=\"y5\" />")
					  _T("</cxn>")
					  _T("<cxn ang=\"cd2\">")
						_T("<pos x=\"x1\" y=\"vc\" />")
					  _T("</cxn>")
					  _T("<cxn ang=\"3cd4\">")
						_T("<pos x=\"hc\" y=\"y1\" />")
					  _T("</cxn>")
					_T("</cxnLst>")
					_T("<rect l=\"x1\" t=\"y3\" r=\"x3\" b=\"y4\" xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\" />")
					_T("<pathLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<path>")
						_T("<moveTo>")
						  _T("<pt x=\"hc\" y=\"y1\" />")
						_T("</moveTo>")
						_T("<arcTo hR=\"rad\" wR=\"rad\" stAng=\"3cd4\" swAng=\"21600000\" />")
						_T("<close />")
						_T("<moveTo>")
						  _T("<pt x=\"hc\" y=\"y5\" />")
						_T("</moveTo>")
						_T("<arcTo hR=\"rad\" wR=\"rad\" stAng=\"cd4\" swAng=\"21600000\" />")
						_T("<close />")
						_T("<moveTo>")
						  _T("<pt x=\"x1\" y=\"y3\" />")
						_T("</moveTo>")
						_T("<lnTo>")
						  _T("<pt x=\"x3\" y=\"y3\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"x3\" y=\"y4\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"x1\" y=\"y4\" />")
						_T("</lnTo>")
						_T("<close />")
					  _T("</path>")
					_T("</pathLst>")
					_T("</ooxml-shape>")
				);
			}
	};
}