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
	class CCurvedLeftArrow : public CPPTXShape
	{
		public:
			CCurvedLeftArrow()
			{
				LoadFromXML(
					_T("<ooxml-shape>")
					_T("<avLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<gd name=\"adj1\" fmla=\"val 25000\" />")
					  _T("<gd name=\"adj2\" fmla=\"val 50000\" />")
					  _T("<gd name=\"adj3\" fmla=\"val 25000\" />")
					_T("</avLst>")
					_T("<gdLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<gd name=\"maxAdj2\" fmla=\"*/ 50000 h ss\" />")
					  _T("<gd name=\"a2\" fmla=\"pin 0 adj2 maxAdj2\" />")
					  _T("<gd name=\"a1\" fmla=\"pin 0 adj1 a2\" />")
					  _T("<gd name=\"th\" fmla=\"*/ ss a1 100000\" />")
					  _T("<gd name=\"aw\" fmla=\"*/ ss a2 100000\" />")
					  _T("<gd name=\"q1\" fmla=\"+/ th aw 4\" />")
					  _T("<gd name=\"hR\" fmla=\"+- hd2 0 q1\" />")
					  _T("<gd name=\"q7\" fmla=\"*/ hR 2 1\" />")
					  _T("<gd name=\"q8\" fmla=\"*/ q7 q7 1\" />")
					  _T("<gd name=\"q9\" fmla=\"*/ th th 1\" />")
					  _T("<gd name=\"q10\" fmla=\"+- q8 0 q9\" />")
					  _T("<gd name=\"q11\" fmla=\"sqrt q10\" />")
					  _T("<gd name=\"idx\" fmla=\"*/ q11 w q7\" />")
					  _T("<gd name=\"maxAdj3\" fmla=\"*/ 100000 idx ss\" />")
					  _T("<gd name=\"a3\" fmla=\"pin 0 adj3 maxAdj3\" />")
					  _T("<gd name=\"ah\" fmla=\"*/ ss a3 100000\" />")
					  _T("<gd name=\"y3\" fmla=\"+- hR th 0\" />")
					  _T("<gd name=\"q2\" fmla=\"*/ w w 1\" />")
					  _T("<gd name=\"q3\" fmla=\"*/ ah ah 1\" />")
					  _T("<gd name=\"q4\" fmla=\"+- q2 0 q3\" />")
					  _T("<gd name=\"q5\" fmla=\"sqrt q4\" />")
					  _T("<gd name=\"dy\" fmla=\"*/ q5 hR w\" />")
					  _T("<gd name=\"y5\" fmla=\"+- hR dy 0\" />")
					  _T("<gd name=\"y7\" fmla=\"+- y3 dy 0\" />")
					  _T("<gd name=\"q6\" fmla=\"+- aw 0 th\" />")
					  _T("<gd name=\"dh\" fmla=\"*/ q6 1 2\" />")
					  _T("<gd name=\"y4\" fmla=\"+- y5 0 dh\" />")
					  _T("<gd name=\"y8\" fmla=\"+- y7 dh 0\" />")
					  _T("<gd name=\"aw2\" fmla=\"*/ aw 1 2\" />")
					  _T("<gd name=\"y6\" fmla=\"+- b 0 aw2\" />")
					  _T("<gd name=\"x1\" fmla=\"+- l ah 0\" />")
					  _T("<gd name=\"swAng\" fmla=\"at2 ah dy\" />")
					  _T("<gd name=\"mswAng\" fmla=\"+- 0 0 swAng\" />")
					  _T("<gd name=\"ix\" fmla=\"+- l idx 0\" />")
					  _T("<gd name=\"iy\" fmla=\"+/ hR y3 2\" />")
					  _T("<gd name=\"q12\" fmla=\"*/ th 1 2\" />")
					  _T("<gd name=\"dang2\" fmla=\"at2 idx q12\" />")
					  _T("<gd name=\"swAng2\" fmla=\"+- dang2 0 swAng\" />")
					  _T("<gd name=\"swAng3\" fmla=\"+- swAng dang2 0\" />")
					  _T("<gd name=\"stAng3\" fmla=\"+- 0 0 dang2\" />")
					_T("</gdLst>")
					_T("<ahLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<ahXY gdRefY=\"adj1\" minY=\"0\" maxY=\"a2\">")
						_T("<pos x=\"x1\" y=\"y5\" />")
					  _T("</ahXY>")
					  _T("<ahXY gdRefY=\"adj2\" minY=\"0\" maxY=\"maxAdj2\">")
						_T("<pos x=\"r\" y=\"y4\" />")
					  _T("</ahXY>")
					  _T("<ahXY gdRefX=\"adj3\" minX=\"0\" maxX=\"maxAdj3\">")
						_T("<pos x=\"x1\" y=\"b\" />")
					  _T("</ahXY>")
					_T("</ahLst>")
					_T("<cxnLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<cxn ang=\"cd2\">")
						_T("<pos x=\"l\" y=\"q12\" />")
					  _T("</cxn>")
					  _T("<cxn ang=\"cd2\">")
						_T("<pos x=\"x1\" y=\"y4\" />")
					  _T("</cxn>")
					  _T("<cxn ang=\"cd3\">")
						_T("<pos x=\"l\" y=\"y6\" />")
					  _T("</cxn>")
					  _T("<cxn ang=\"cd4\">")
						_T("<pos x=\"x1\" y=\"y8\" />")
					  _T("</cxn>")
					  _T("<cxn ang=\"0\">")
						_T("<pos x=\"r\" y=\"iy\" />")
					  _T("</cxn>")
					_T("</cxnLst>")
					_T("<rect l=\"l\" t=\"t\" r=\"r\" b=\"b\" xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\" />")
					_T("<pathLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<path stroke=\"false\" extrusionOk=\"false\">")
						_T("<moveTo>")
						  _T("<pt x=\"l\" y=\"y6\" />")
						_T("</moveTo>")
						_T("<lnTo>")
						  _T("<pt x=\"x1\" y=\"y4\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"x1\" y=\"y5\" />")
						_T("</lnTo>")
						_T("<arcTo wR=\"w\" hR=\"hR\" stAng=\"swAng\" swAng=\"swAng2\" />")
						_T("<arcTo wR=\"w\" hR=\"hR\" stAng=\"stAng3\" swAng=\"swAng3\" />")
						_T("<lnTo>")
						  _T("<pt x=\"x1\" y=\"y8\" />")
						_T("</lnTo>")
						_T("<close />")
					  _T("</path>")
					  _T("<path fill=\"darkenLess\" stroke=\"false\" extrusionOk=\"false\">")
						_T("<moveTo>")
						  _T("<pt x=\"r\" y=\"y3\" />")
						_T("</moveTo>")
						_T("<arcTo wR=\"w\" hR=\"hR\" stAng=\"0\" swAng=\"-5400000\" />")
						_T("<lnTo>")
						  _T("<pt x=\"l\" y=\"t\" />")
						_T("</lnTo>")
						_T("<arcTo wR=\"w\" hR=\"hR\" stAng=\"3cd4\" swAng=\"cd4\" />")
						_T("<close />")
					  _T("</path>")
					  _T("<path fill=\"none\" extrusionOk=\"false\">")
						_T("<moveTo>")
						  _T("<pt x=\"r\" y=\"y3\" />")
						_T("</moveTo>")
						_T("<arcTo wR=\"w\" hR=\"hR\" stAng=\"0\" swAng=\"-5400000\" />")
						_T("<lnTo>")
						  _T("<pt x=\"l\" y=\"t\" />")
						_T("</lnTo>")
						_T("<arcTo wR=\"w\" hR=\"hR\" stAng=\"3cd4\" swAng=\"cd4\" />")
						_T("<lnTo>")
						  _T("<pt x=\"r\" y=\"y3\" />")
						_T("</lnTo>")
						_T("<arcTo wR=\"w\" hR=\"hR\" stAng=\"0\" swAng=\"swAng\" />")
						_T("<lnTo>")
						  _T("<pt x=\"x1\" y=\"y8\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"l\" y=\"y6\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"x1\" y=\"y4\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"x1\" y=\"y5\" />")
						_T("</lnTo>")
						_T("<arcTo wR=\"w\" hR=\"hR\" stAng=\"swAng\" swAng=\"swAng2\" />")
					  _T("</path>")
					_T("</pathLst>")
					_T("</ooxml-shape>")
				);
			}
	};
}