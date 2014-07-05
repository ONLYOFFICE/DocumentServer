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
	class CBentArrow : public CPPTXShape
	{
		public:
			CBentArrow()
			{
				LoadFromXML(
					_T("<ooxml-shape>")
					_T("<avLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<gd name=\"adj1\" fmla=\"val 25000\" />")
					  _T("<gd name=\"adj2\" fmla=\"val 25000\" />")
					  _T("<gd name=\"adj3\" fmla=\"val 25000\" />")
					  _T("<gd name=\"adj4\" fmla=\"val 43750\" />")
					_T("</avLst>")
					_T("<gdLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<gd name=\"a2\" fmla=\"pin 0 adj2 50000\" />")
					  _T("<gd name=\"maxAdj1\" fmla=\"*/ a2 2 1\" />")
					  _T("<gd name=\"a1\" fmla=\"pin 0 adj1 maxAdj1\" />")
					  _T("<gd name=\"a3\" fmla=\"pin 0 adj3 50000\" />")
					  _T("<gd name=\"th\" fmla=\"*/ ss a1 100000\" />")
					  _T("<gd name=\"aw2\" fmla=\"*/ ss a2 100000\" />")
					  _T("<gd name=\"th2\" fmla=\"*/ th 1 2\" />")
					  _T("<gd name=\"dh2\" fmla=\"+- aw2 0 th2\" />")
					  _T("<gd name=\"ah\" fmla=\"*/ ss a3 100000\" />")
					  _T("<gd name=\"bw\" fmla=\"+- r 0 ah\" />")
					  _T("<gd name=\"bh\" fmla=\"+- b 0 dh2\" />")
					  _T("<gd name=\"bs\" fmla=\"min bw bh\" />")
					  _T("<gd name=\"maxAdj4\" fmla=\"*/ 100000 bs ss\" />")
					  _T("<gd name=\"a4\" fmla=\"pin 0 adj4 maxAdj4\" />")
					  _T("<gd name=\"bd\" fmla=\"*/ ss a4 100000\" />")
					  _T("<gd name=\"bd3\" fmla=\"+- bd 0 th\" />")
					  _T("<gd name=\"bd2\" fmla=\"max bd3 0\" />")
					  _T("<gd name=\"x3\" fmla=\"+- th bd2 0\" />")
					  _T("<gd name=\"x4\" fmla=\"+- r 0 ah\" />")
					  _T("<gd name=\"y3\" fmla=\"+- dh2 th 0\" />")
					  _T("<gd name=\"y4\" fmla=\"+- y3 dh2 0\" />")
					  _T("<gd name=\"y5\" fmla=\"+- dh2 bd 0\" />")
					  _T("<gd name=\"y6\" fmla=\"+- y3 bd2 0\" />")
					_T("</gdLst>")
					_T("<ahLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<ahXY gdRefX=\"adj1\" minX=\"0\" maxX=\"maxAdj1\">")
						_T("<pos x=\"th\" y=\"b\" />")
					  _T("</ahXY>")
					  _T("<ahXY gdRefY=\"adj2\" minY=\"0\" maxY=\"50000\">")
						_T("<pos x=\"r\" y=\"y4\" />")
					  _T("</ahXY>")
					  _T("<ahXY gdRefX=\"adj3\" minX=\"0\" maxX=\"50000\">")
						_T("<pos x=\"x4\" y=\"t\" />")
					  _T("</ahXY>")
					  _T("<ahXY gdRefX=\"adj4\" minX=\"0\" maxX=\"maxAdj4\">")
						_T("<pos x=\"bd\" y=\"t\" />")
					  _T("</ahXY>")
					_T("</ahLst>")
					_T("<cxnLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<cxn ang=\"3cd4\">")
						_T("<pos x=\"x4\" y=\"t\" />")
					  _T("</cxn>")
					  _T("<cxn ang=\"cd4\">")
						_T("<pos x=\"x4\" y=\"y4\" />")
					  _T("</cxn>")
					  _T("<cxn ang=\"cd4\">")
						_T("<pos x=\"th2\" y=\"b\" />")
					  _T("</cxn>")
					  _T("<cxn ang=\"0\">")
						_T("<pos x=\"r\" y=\"aw2\" />")
					  _T("</cxn>")
					_T("</cxnLst>")
					_T("<rect l=\"l\" t=\"t\" r=\"r\" b=\"b\" xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\" />")
					_T("<pathLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<path>")
						_T("<moveTo>")
						  _T("<pt x=\"l\" y=\"b\" />")
						_T("</moveTo>")
						_T("<lnTo>")
						  _T("<pt x=\"l\" y=\"y5\" />")
						_T("</lnTo>")
						_T("<arcTo wR=\"bd\" hR=\"bd\" stAng=\"cd2\" swAng=\"cd4\" />")
						_T("<lnTo>")
						  _T("<pt x=\"x4\" y=\"dh2\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"x4\" y=\"t\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"r\" y=\"aw2\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"x4\" y=\"y4\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"x4\" y=\"y3\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"x3\" y=\"y3\" />")
						_T("</lnTo>")
						_T("<arcTo wR=\"bd2\" hR=\"bd2\" stAng=\"3cd4\" swAng=\"-5400000\" />")
						_T("<lnTo>")
						  _T("<pt x=\"th\" y=\"b\" />")
						_T("</lnTo>")
						_T("<close />")
					  _T("</path>")
					_T("</pathLst>")
					_T("</ooxml-shape>")
				);
			}
	};
}