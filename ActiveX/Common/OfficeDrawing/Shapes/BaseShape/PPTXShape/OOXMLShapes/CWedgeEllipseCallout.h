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
	class CWedgeEllipseCallout : public CPPTXShape
	{
		public:
			CWedgeEllipseCallout()
			{
				LoadFromXML(
					_T("<ooxml-shape>")
					_T("<avLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<gd name=\"adj1\" fmla=\"val -20833\" />")
					  _T("<gd name=\"adj2\" fmla=\"val 62500\" />")
					_T("</avLst>")
					_T("<gdLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<gd name=\"dxPos\" fmla=\"*/ w adj1 100000\" />")
					  _T("<gd name=\"dyPos\" fmla=\"*/ h adj2 100000\" />")
					  _T("<gd name=\"xPos\" fmla=\"+- hc dxPos 0\" />")
					  _T("<gd name=\"yPos\" fmla=\"+- vc dyPos 0\" />")
					  _T("<gd name=\"sdx\" fmla=\"*/ dxPos h 1\" />")
					  _T("<gd name=\"sdy\" fmla=\"*/ dyPos w 1\" />")
					  _T("<gd name=\"pang\" fmla=\"at2 sdx sdy\" />")
					  _T("<gd name=\"stAng\" fmla=\"+- pang 660000 0\" />")
					  _T("<gd name=\"enAng\" fmla=\"+- pang 0 660000\" />")
					  _T("<gd name=\"dx1\" fmla=\"cos wd2 stAng\" />")
					  _T("<gd name=\"dy1\" fmla=\"sin hd2 stAng\" />")
					  _T("<gd name=\"x1\" fmla=\"+- hc dx1 0\" />")
					  _T("<gd name=\"y1\" fmla=\"+- vc dy1 0\" />")
					  _T("<gd name=\"dx2\" fmla=\"cos wd2 enAng\" />")
					  _T("<gd name=\"dy2\" fmla=\"sin hd2 enAng\" />")
					  _T("<gd name=\"x2\" fmla=\"+- hc dx2 0\" />")
					  _T("<gd name=\"y2\" fmla=\"+- vc dy2 0\" />")
					  _T("<gd name=\"stAng1\" fmla=\"at2 dx1 dy1\" />")
					  _T("<gd name=\"enAng1\" fmla=\"at2 dx2 dy2\" />")
					  _T("<gd name=\"swAng1\" fmla=\"+- enAng1 0 stAng1\" />")
					  _T("<gd name=\"swAng2\" fmla=\"+- swAng1 21600000 0\" />")
					  _T("<gd name=\"swAng\" fmla=\"?: swAng1 swAng1 swAng2\" />")
					  _T("<gd name=\"idx\" fmla=\"cos wd2 2700000\" />")
					  _T("<gd name=\"idy\" fmla=\"sin hd2 2700000\" />")
					  _T("<gd name=\"il\" fmla=\"+- hc 0 idx\" />")
					  _T("<gd name=\"ir\" fmla=\"+- hc idx 0\" />")
					  _T("<gd name=\"it\" fmla=\"+- vc 0 idy\" />")
					  _T("<gd name=\"ib\" fmla=\"+- vc idy 0\" />")
					_T("</gdLst>")
					_T("<ahLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<ahXY gdRefX=\"adj1\" minX=\"-2147483647\" maxX=\"2147483647\" gdRefY=\"adj2\" minY=\"-2147483647\" maxY=\"2147483647\">")
						_T("<pos x=\"xPos\" y=\"yPos\" />")
					  _T("</ahXY>")
					_T("</ahLst>")
					_T("<cxnLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<cxn ang=\"3cd4\">")
						_T("<pos x=\"hc\" y=\"t\" />")
					  _T("</cxn>")
					  _T("<cxn ang=\"3cd4\">")
						_T("<pos x=\"il\" y=\"it\" />")
					  _T("</cxn>")
					  _T("<cxn ang=\"cd4\">")
						_T("<pos x=\"il\" y=\"ib\" />")
					  _T("</cxn>")
					  _T("<cxn ang=\"cd4\">")
						_T("<pos x=\"hc\" y=\"b\" />")
					  _T("</cxn>")
					  _T("<cxn ang=\"cd4\">")
						_T("<pos x=\"ir\" y=\"ib\" />")
					  _T("</cxn>")
					  _T("<cxn ang=\"0\">")
						_T("<pos x=\"r\" y=\"vc\" />")
					  _T("</cxn>")
					  _T("<cxn ang=\"3cd4\">")
						_T("<pos x=\"ir\" y=\"it\" />")
					  _T("</cxn>")
					  _T("<cxn ang=\"pang\">")
						_T("<pos x=\"xPos\" y=\"yPos\" />")
					  _T("</cxn>")
					_T("</cxnLst>")
					_T("<rect l=\"il\" t=\"it\" r=\"ir\" b=\"ib\" xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\" />")
					_T("<pathLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<path>")
						_T("<moveTo>")
						  _T("<pt x=\"xPos\" y=\"yPos\" />")
						_T("</moveTo>")
						_T("<lnTo>")
						  _T("<pt x=\"x1\" y=\"y1\" />")
						_T("</lnTo>")
						_T("<arcTo wR=\"wd2\" hR=\"hd2\" stAng=\"stAng1\" swAng=\"swAng\" />")
						_T("<close />")
					  _T("</path>")
					_T("</pathLst>")
					_T("</ooxml-shape>")
				);
			}
	};
}