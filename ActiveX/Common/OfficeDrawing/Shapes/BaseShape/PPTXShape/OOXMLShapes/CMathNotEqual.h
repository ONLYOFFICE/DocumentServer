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
	class CMathNotEqual : public CPPTXShape
	{
		public:
			CMathNotEqual()
			{
				LoadFromXML(
					_T("<ooxml-shape>")
					_T("<avLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<gd name=\"adj1\" fmla=\"val 23520\" />")
					  _T("<gd name=\"adj2\" fmla=\"val 6600000\" />")
					  _T("<gd name=\"adj3\" fmla=\"val 11760\" />")
					_T("</avLst>")
					_T("<gdLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<gd name=\"a1\" fmla=\"pin 0 adj1 50000\" />")
					  _T("<gd name=\"crAng\" fmla=\"pin 4200000 adj2 6600000\" />")
					  _T("<gd name=\"2a1\" fmla=\"*/ a1 2 1\" />")
					  _T("<gd name=\"maxAdj3\" fmla=\"+- 100000 0 2a1\" />")
					  _T("<gd name=\"a3\" fmla=\"pin 0 adj3 maxAdj3\" />")
					  _T("<gd name=\"dy1\" fmla=\"*/ h a1 100000\" />")
					  _T("<gd name=\"dy2\" fmla=\"*/ h a3 200000\" />")
					  _T("<gd name=\"dx1\" fmla=\"*/ w 73490 200000\" />")
					  _T("<gd name=\"x1\" fmla=\"+- hc 0 dx1\" />")
					  _T("<gd name=\"x8\" fmla=\"+- hc dx1 0\" />")
					  _T("<gd name=\"y2\" fmla=\"+- vc 0 dy2\" />")
					  _T("<gd name=\"y3\" fmla=\"+- vc dy2 0\" />")
					  _T("<gd name=\"y1\" fmla=\"+- y2 0 dy1\" />")
					  _T("<gd name=\"y4\" fmla=\"+- y3 dy1 0\" />")
					  _T("<gd name=\"cadj2\" fmla=\"+- crAng 0 cd4\" />")
					  _T("<gd name=\"xadj2\" fmla=\"tan hd2 cadj2\" />")
					  _T("<gd name=\"len\" fmla=\"mod xadj2 hd2 0\" />")
					  _T("<gd name=\"bhw\" fmla=\"*/ len dy1 hd2\" />")
					  _T("<gd name=\"bhw2\" fmla=\"*/ bhw 1 2\" />")
					  _T("<gd name=\"x7\" fmla=\"+- hc xadj2 bhw2\" />")
					  _T("<gd name=\"dx67\" fmla=\"*/ xadj2 y1 hd2\" />")
					  _T("<gd name=\"x6\" fmla=\"+- x7 0 dx67\" />")
					  _T("<gd name=\"dx57\" fmla=\"*/ xadj2 y2 hd2\" />")
					  _T("<gd name=\"x5\" fmla=\"+- x7 0 dx57\" />")
					  _T("<gd name=\"dx47\" fmla=\"*/ xadj2 y3 hd2\" />")
					  _T("<gd name=\"x4\" fmla=\"+- x7 0 dx47\" />")
					  _T("<gd name=\"dx37\" fmla=\"*/ xadj2 y4 hd2\" />")
					  _T("<gd name=\"x3\" fmla=\"+- x7 0 dx37\" />")
					  _T("<gd name=\"dx27\" fmla=\"*/ xadj2 2 1\" />")
					  _T("<gd name=\"x2\" fmla=\"+- x7 0 dx27\" />")
					  _T("<gd name=\"rx7\" fmla=\"+- x7 bhw 0\" />")
					  _T("<gd name=\"rx6\" fmla=\"+- x6 bhw 0\" />")
					  _T("<gd name=\"rx5\" fmla=\"+- x5 bhw 0\" />")
					  _T("<gd name=\"rx4\" fmla=\"+- x4 bhw 0\" />")
					  _T("<gd name=\"rx3\" fmla=\"+- x3 bhw 0\" />")
					  _T("<gd name=\"rx2\" fmla=\"+- x2 bhw 0\" />")
					  _T("<gd name=\"dx7\" fmla=\"*/ dy1 hd2 len\" />")
					  _T("<gd name=\"rxt\" fmla=\"+- x7 dx7 0\" />")
					  _T("<gd name=\"lxt\" fmla=\"+- rx7 0 dx7\" />")
					  _T("<gd name=\"rx\" fmla=\"?: cadj2 rxt rx7\" />")
					  _T("<gd name=\"lx\" fmla=\"?: cadj2 x7 lxt\" />")
					  _T("<gd name=\"dy3\" fmla=\"*/ dy1 xadj2 len\" />")
					  _T("<gd name=\"dy4\" fmla=\"+- 0 0 dy3\" />")
					  _T("<gd name=\"ry\" fmla=\"?: cadj2 dy3 t\" />")
					  _T("<gd name=\"ly\" fmla=\"?: cadj2 t dy4\" />")
					  _T("<gd name=\"dlx\" fmla=\"+- w 0 rx\" />")
					  _T("<gd name=\"drx\" fmla=\"+- w 0 lx\" />")
					  _T("<gd name=\"dly\" fmla=\"+- h 0 ry\" />")
					  _T("<gd name=\"dry\" fmla=\"+- h 0 ly\" />")
					  _T("<gd name=\"xC1\" fmla=\"+/ rx lx 2\" />")
					  _T("<gd name=\"xC2\" fmla=\"+/ drx dlx 2\" />")
					  _T("<gd name=\"yC1\" fmla=\"+/ ry ly 2\" />")
					  _T("<gd name=\"yC2\" fmla=\"+/ y1 y2 2\" />")
					  _T("<gd name=\"yC3\" fmla=\"+/ y3 y4 2\" />")
					  _T("<gd name=\"yC4\" fmla=\"+/ dry dly 2\" />")
					_T("</gdLst>")
					_T("<ahLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<ahXY gdRefY=\"adj1\" minY=\"0\" maxY=\"50000\">")
						_T("<pos x=\"l\" y=\"y1\" />")
					  _T("</ahXY>")
					  _T("<ahPolar gdRefAng=\"adj2\" minAng=\"4200000\" maxAng=\"6600000\">")
						_T("<pos x=\"lx\" y=\"t\" />")
					  _T("</ahPolar>")
					  _T("<ahXY gdRefY=\"adj3\" minY=\"0\" maxY=\"maxAdj3\">")
						_T("<pos x=\"r\" y=\"y2\" />")
					  _T("</ahXY>")
					_T("</ahLst>")
					_T("<cxnLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<cxn ang=\"0\">")
						_T("<pos x=\"x8\" y=\"yC2\" />")
					  _T("</cxn>")
					  _T("<cxn ang=\"0\">")
						_T("<pos x=\"x8\" y=\"yC3\" />")
					  _T("</cxn>")
					  _T("<cxn ang=\"cd4\">")
						_T("<pos x=\"xC2\" y=\"yC4\" />")
					  _T("</cxn>")
					  _T("<cxn ang=\"cd2\">")
						_T("<pos x=\"x1\" y=\"yC2\" />")
					  _T("</cxn>")
					  _T("<cxn ang=\"cd2\">")
						_T("<pos x=\"x1\" y=\"yC3\" />")
					  _T("</cxn>")
					  _T("<cxn ang=\"3cd4\">")
						_T("<pos x=\"xC1\" y=\"yC1\" />")
					  _T("</cxn>")
					_T("</cxnLst>")
					_T("<rect l=\"x1\" t=\"y1\" r=\"x8\" b=\"y4\" xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\" />")
					_T("<pathLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<path>")
						_T("<moveTo>")
						  _T("<pt x=\"x1\" y=\"y1\" />")
						_T("</moveTo>")
						_T("<lnTo>")
						  _T("<pt x=\"x6\" y=\"y1\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"lx\" y=\"ly\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"rx\" y=\"ry\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"rx6\" y=\"y1\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"x8\" y=\"y1\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"x8\" y=\"y2\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"rx5\" y=\"y2\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"rx4\" y=\"y3\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"x8\" y=\"y3\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"x8\" y=\"y4\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"rx3\" y=\"y4\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"drx\" y=\"dry\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"dlx\" y=\"dly\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"x3\" y=\"y4\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"x1\" y=\"y4\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"x1\" y=\"y3\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"x4\" y=\"y3\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"x5\" y=\"y2\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"x1\" y=\"y2\" />")
						_T("</lnTo>")
						_T("<close />")
					  _T("</path>")
					_T("</pathLst>")
					_T("</ooxml-shape>")
				);
			}
	};
}