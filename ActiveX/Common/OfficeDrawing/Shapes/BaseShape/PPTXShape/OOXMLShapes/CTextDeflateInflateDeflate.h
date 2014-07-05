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
	class CTextDeflateInflateDeflate : public CPPTXShape
	{
		public:
			CTextDeflateInflateDeflate()
			{
				LoadFromXML(
					_T("<ooxml-shape>")
					_T("<avLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<gd name=\"adj\" fmla=\"val 25000\" />")
					_T("</avLst>")
					_T("<gdLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<gd name=\"a\" fmla=\"pin 3000 adj 47000\" />")
					  _T("<gd name=\"dy\" fmla=\"*/ a h 100000\" />")
					  _T("<gd name=\"del\" fmla=\"*/ h 3 100\" />")
					  _T("<gd name=\"ey1\" fmla=\"*/ h 30 100\" />")
					  _T("<gd name=\"ey2\" fmla=\"*/ h 36 100\" />")
					  _T("<gd name=\"ey3\" fmla=\"*/ h 63 100\" />")
					  _T("<gd name=\"ey4\" fmla=\"*/ h 70 100\" />")
					  _T("<gd name=\"by\" fmla=\"+- b 0 dy\" />")
					  _T("<gd name=\"yh1\" fmla=\"+- dy 0 del\" />")
					  _T("<gd name=\"yl1\" fmla=\"+- dy del 0\" />")
					  _T("<gd name=\"yh2\" fmla=\"+- by 0 del\" />")
					  _T("<gd name=\"yl2\" fmla=\"+- by del 0\" />")
					  _T("<gd name=\"y1\" fmla=\"+- yh1 yh1 ey1\" />")
					  _T("<gd name=\"y2\" fmla=\"+- yl1 yl1 ey2\" />")
					  _T("<gd name=\"y3\" fmla=\"+- yh2 yh2 ey3\" />")
					  _T("<gd name=\"y4\" fmla=\"+- yl2 yl2 ey4\" />")
					_T("</gdLst>")
					_T("<ahLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<ahXY gdRefY=\"adj\" minY=\"3000\" maxY=\"47000\">")
						_T("<pos x=\"hc\" y=\"dy\" />")
					  _T("</ahXY>")
					_T("</ahLst>")
					_T("<pathLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<path>")
						_T("<moveTo>")
						  _T("<pt x=\"l\" y=\"t\" />")
						_T("</moveTo>")
						_T("<lnTo>")
						  _T("<pt x=\"r\" y=\"t\" />")
						_T("</lnTo>")
					  _T("</path>")
					  _T("<path>")
						_T("<moveTo>")
						  _T("<pt x=\"l\" y=\"ey1\" />")
						_T("</moveTo>")
						_T("<quadBezTo>")
						  _T("<pt x=\"hc\" y=\"y1\" />")
						  _T("<pt x=\"r\" y=\"ey1\" />")
						_T("</quadBezTo>")
					  _T("</path>")
					  _T("<path>")
						_T("<moveTo>")
						  _T("<pt x=\"l\" y=\"ey2\" />")
						_T("</moveTo>")
						_T("<quadBezTo>")
						  _T("<pt x=\"hc\" y=\"y2\" />")
						  _T("<pt x=\"r\" y=\"ey2\" />")
						_T("</quadBezTo>")
					  _T("</path>")
					  _T("<path>")
						_T("<moveTo>")
						  _T("<pt x=\"l\" y=\"ey3\" />")
						_T("</moveTo>")
						_T("<quadBezTo>")
						  _T("<pt x=\"hc\" y=\"y3\" />")
						  _T("<pt x=\"r\" y=\"ey3\" />")
						_T("</quadBezTo>")
					  _T("</path>")
					  _T("<path>")
						_T("<moveTo>")
						  _T("<pt x=\"l\" y=\"ey4\" />")
						_T("</moveTo>")
						_T("<quadBezTo>")
						  _T("<pt x=\"hc\" y=\"y4\" />")
						  _T("<pt x=\"r\" y=\"ey4\" />")
						_T("</quadBezTo>")
					  _T("</path>")
					  _T("<path>")
						_T("<moveTo>")
						  _T("<pt x=\"l\" y=\"b\" />")
						_T("</moveTo>")
						_T("<lnTo>")
						  _T("<pt x=\"r\" y=\"b\" />")
						_T("</lnTo>")
					  _T("</path>")
					_T("</pathLst>")
					_T("</ooxml-shape>")
				);
			}
	};
}