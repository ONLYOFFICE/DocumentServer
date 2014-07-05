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
	class CSmileyFace : public CPPTXShape
	{
		public:
			CSmileyFace()
			{
				LoadFromXML(
					_T("<ooxml-shape>")
					_T("<avLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<gd name=\"adj\" fmla=\"val 4653\" />")
					_T("</avLst>")
					_T("<gdLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<gd name=\"a\" fmla=\"pin -4653 adj 4653\" />")
					  _T("<gd name=\"x1\" fmla=\"*/ w 4969 21699\" />")
					  _T("<gd name=\"x2\" fmla=\"*/ w 6215 21600\" />")
					  _T("<gd name=\"x3\" fmla=\"*/ w 13135 21600\" />")
					  _T("<gd name=\"x4\" fmla=\"*/ w 16640 21600\" />")
					  _T("<gd name=\"y1\" fmla=\"*/ h 7570 21600\" />")
					  _T("<gd name=\"y3\" fmla=\"*/ h 16515 21600\" />")
					  _T("<gd name=\"dy2\" fmla=\"*/ h a 100000\" />")
					  _T("<gd name=\"y2\" fmla=\"+- y3 0 dy2\" />")
					  _T("<gd name=\"y4\" fmla=\"+- y3 dy2 0\" />")
					  _T("<gd name=\"dy3\" fmla=\"*/ h a 50000\" />")
					  _T("<gd name=\"y5\" fmla=\"+- y4 dy3 0\" />")
					  _T("<gd name=\"idx\" fmla=\"cos wd2 2700000\" />")
					  _T("<gd name=\"idy\" fmla=\"sin hd2 2700000\" />")
					  _T("<gd name=\"il\" fmla=\"+- hc 0 idx\" />")
					  _T("<gd name=\"ir\" fmla=\"+- hc idx 0\" />")
					  _T("<gd name=\"it\" fmla=\"+- vc 0 idy\" />")
					  _T("<gd name=\"ib\" fmla=\"+- vc idy 0\" />")
					  _T("<gd name=\"wR\" fmla=\"*/ w 1125 21600\" />")
					  _T("<gd name=\"hR\" fmla=\"*/ h 1125 21600\" />")
					_T("</gdLst>")
					_T("<ahLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<ahXY gdRefY=\"adj\" minY=\"-4653\" maxY=\"4653\">")
						_T("<pos x=\"hc\" y=\"y4\" />")
					  _T("</ahXY>")
					_T("</ahLst>")
					_T("<cxnLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<cxn ang=\"3cd4\">")
						_T("<pos x=\"hc\" y=\"t\" />")
					  _T("</cxn>")
					  _T("<cxn ang=\"3cd4\">")
						_T("<pos x=\"il\" y=\"it\" />")
					  _T("</cxn>")
					  _T("<cxn ang=\"cd2\">")
						_T("<pos x=\"l\" y=\"vc\" />")
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
					_T("</cxnLst>")
					_T("<rect l=\"il\" t=\"it\" r=\"ir\" b=\"ib\" xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\" />")
					_T("<pathLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<path stroke=\"false\" extrusionOk=\"false\">")
						_T("<moveTo>")
						  _T("<pt x=\"l\" y=\"vc\" />")
						_T("</moveTo>")
						_T("<arcTo wR=\"wd2\" hR=\"hd2\" stAng=\"cd2\" swAng=\"21600000\" />")
						_T("<close />")
					  _T("</path>")
					  _T("<path fill=\"darkenLess\" extrusionOk=\"false\">")
						_T("<moveTo>")
						  _T("<pt x=\"x2\" y=\"y1\" />")
						_T("</moveTo>")
						_T("<arcTo wR=\"wR\" hR=\"hR\" stAng=\"cd2\" swAng=\"21600000\" />")
						_T("<moveTo>")
						  _T("<pt x=\"x3\" y=\"y1\" />")
						_T("</moveTo>")
						_T("<arcTo wR=\"wR\" hR=\"hR\" stAng=\"cd2\" swAng=\"21600000\" />")
					  _T("</path>")
					  _T("<path fill=\"none\" extrusionOk=\"false\">")
						_T("<moveTo>")
						  _T("<pt x=\"x1\" y=\"y2\" />")
						_T("</moveTo>")
						_T("<quadBezTo>")
						  _T("<pt x=\"hc\" y=\"y5\" />")
						  _T("<pt x=\"x4\" y=\"y2\" />")
						_T("</quadBezTo>")
					  _T("</path>")
					  _T("<path fill=\"none\">")
						_T("<moveTo>")
						  _T("<pt x=\"l\" y=\"vc\" />")
						_T("</moveTo>")
						_T("<arcTo wR=\"wd2\" hR=\"hd2\" stAng=\"cd2\" swAng=\"21600000\" />")
						_T("<close />")
					  _T("</path>")
					_T("</pathLst>")
					_T("</ooxml-shape>")
				);
			}
	};
}