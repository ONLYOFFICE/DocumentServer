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
	class CRightBrace : public CPPTXShape
	{
		public:
			CRightBrace()
			{
				LoadFromXML(
					_T("<ooxml-shape>")
					_T("<avLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<gd name=\"adj1\" fmla=\"val 8333\" />")
					  _T("<gd name=\"adj2\" fmla=\"val 50000\" />")
					_T("</avLst>")
					_T("<gdLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<gd name=\"a2\" fmla=\"pin 0 adj2 100000\" />")
					  _T("<gd name=\"q1\" fmla=\"+- 100000 0 a2\" />")
					  _T("<gd name=\"q2\" fmla=\"min q1 a2\" />")
					  _T("<gd name=\"q3\" fmla=\"*/ q2 1 2\" />")
					  _T("<gd name=\"maxAdj1\" fmla=\"*/ q3 h ss\" />")
					  _T("<gd name=\"a1\" fmla=\"pin 0 adj1 maxAdj1\" />")
					  _T("<gd name=\"y1\" fmla=\"*/ ss a1 100000\" />")
					  _T("<gd name=\"y3\" fmla=\"*/ h a2 100000\" />")
					  _T("<gd name=\"y2\" fmla=\"+- y3 0 y1\" />")
					  _T("<gd name=\"y4\" fmla=\"+- b 0 y1\" />")
					  _T("<gd name=\"dx1\" fmla=\"cos wd2 2700000\" />")
					  _T("<gd name=\"dy1\" fmla=\"sin y1 2700000\" />")
					  _T("<gd name=\"ir\" fmla=\"+- l dx1 0\" />")
					  _T("<gd name=\"it\" fmla=\"+- y1 0 dy1\" />")
					  _T("<gd name=\"ib\" fmla=\"+- b dy1 y1\" />")
					_T("</gdLst>")
					_T("<ahLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<ahXY gdRefY=\"adj1\" minY=\"0\" maxY=\"maxAdj1\">")
						_T("<pos x=\"hc\" y=\"y1\" />")
					  _T("</ahXY>")
					  _T("<ahXY gdRefY=\"adj2\" minY=\"0\" maxY=\"100000\">")
						_T("<pos x=\"r\" y=\"y3\" />")
					  _T("</ahXY>")
					_T("</ahLst>")
					_T("<cxnLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<cxn ang=\"cd4\">")
						_T("<pos x=\"l\" y=\"t\" />")
					  _T("</cxn>")
					  _T("<cxn ang=\"cd2\">")
						_T("<pos x=\"r\" y=\"y3\" />")
					  _T("</cxn>")
					  _T("<cxn ang=\"3cd4\">")
						_T("<pos x=\"l\" y=\"b\" />")
					  _T("</cxn>")
					_T("</cxnLst>")
					_T("<rect l=\"l\" t=\"it\" r=\"ir\" b=\"ib\" xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\" />")
					_T("<pathLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<path stroke=\"false\" extrusionOk=\"false\">")
						_T("<moveTo>")
						  _T("<pt x=\"l\" y=\"t\" />")
						_T("</moveTo>")
						_T("<arcTo wR=\"wd2\" hR=\"y1\" stAng=\"3cd4\" swAng=\"cd4\" />")
						_T("<lnTo>")
						  _T("<pt x=\"hc\" y=\"y2\" />")
						_T("</lnTo>")
						_T("<arcTo wR=\"wd2\" hR=\"y1\" stAng=\"cd2\" swAng=\"-5400000\" />")
						_T("<arcTo wR=\"wd2\" hR=\"y1\" stAng=\"3cd4\" swAng=\"-5400000\" />")
						_T("<lnTo>")
						  _T("<pt x=\"hc\" y=\"y4\" />")
						_T("</lnTo>")
						_T("<arcTo wR=\"wd2\" hR=\"y1\" stAng=\"0\" swAng=\"cd4\" />")
						_T("<close />")
					  _T("</path>")
					  _T("<path fill=\"none\">")
						_T("<moveTo>")
						  _T("<pt x=\"l\" y=\"t\" />")
						_T("</moveTo>")
						_T("<arcTo wR=\"wd2\" hR=\"y1\" stAng=\"3cd4\" swAng=\"cd4\" />")
						_T("<lnTo>")
						  _T("<pt x=\"hc\" y=\"y2\" />")
						_T("</lnTo>")
						_T("<arcTo wR=\"wd2\" hR=\"y1\" stAng=\"cd2\" swAng=\"-5400000\" />")
						_T("<arcTo wR=\"wd2\" hR=\"y1\" stAng=\"3cd4\" swAng=\"-5400000\" />")
						_T("<lnTo>")
						  _T("<pt x=\"hc\" y=\"y4\" />")
						_T("</lnTo>")
						_T("<arcTo wR=\"wd2\" hR=\"y1\" stAng=\"0\" swAng=\"cd4\" />")
					  _T("</path>")
					_T("</pathLst>")
					_T("</ooxml-shape>")
				);
			}
	};
}