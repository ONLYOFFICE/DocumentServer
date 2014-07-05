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
	class CSun : public CPPTXShape
	{
		public:
			CSun()
			{
				LoadFromXML(
					_T("<ooxml-shape>")
					_T("<avLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<gd name=\"adj\" fmla=\"val 25000\" />")
					_T("</avLst>")
					_T("<gdLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<gd name=\"a\" fmla=\"pin 12500 adj 46875\" />")
					  _T("<gd name=\"g0\" fmla=\"+- 50000 0 a\" />")
					  _T("<gd name=\"g1\" fmla=\"*/ g0 30274 32768\" />")
					  _T("<gd name=\"g2\" fmla=\"*/ g0 12540 32768\" />")
					  _T("<gd name=\"g3\" fmla=\"+- g1 50000 0\" />")
					  _T("<gd name=\"g4\" fmla=\"+- g2 50000 0\" />")
					  _T("<gd name=\"g5\" fmla=\"+- 50000 0 g1\" />")
					  _T("<gd name=\"g6\" fmla=\"+- 50000 0 g2\" />")
					  _T("<gd name=\"g7\" fmla=\"*/ g0 23170 32768\" />")
					  _T("<gd name=\"g8\" fmla=\"+- 50000 g7 0\" />")
					  _T("<gd name=\"g9\" fmla=\"+- 50000 0 g7\" />")
					  _T("<gd name=\"g10\" fmla=\"*/ g5 3 4\" />")
					  _T("<gd name=\"g11\" fmla=\"*/ g6 3 4\" />")
					  _T("<gd name=\"g12\" fmla=\"+- g10 3662 0\" />")
					  _T("<gd name=\"g13\" fmla=\"+- g11 3662 0\" />")
					  _T("<gd name=\"g14\" fmla=\"+- g11 12500 0\" />")
					  _T("<gd name=\"g15\" fmla=\"+- 100000 0 g10\" />")
					  _T("<gd name=\"g16\" fmla=\"+- 100000 0 g12\" />")
					  _T("<gd name=\"g17\" fmla=\"+- 100000 0 g13\" />")
					  _T("<gd name=\"g18\" fmla=\"+- 100000 0 g14\" />")
					  _T("<gd name=\"ox1\" fmla=\"*/ w 18436 21600\" />")
					  _T("<gd name=\"oy1\" fmla=\"*/ h 3163 21600\" />")
					  _T("<gd name=\"ox2\" fmla=\"*/ w 3163 21600\" />")
					  _T("<gd name=\"oy2\" fmla=\"*/ h 18436 21600\" />")
					  _T("<gd name=\"x8\" fmla=\"*/ w g8 100000\" />")
					  _T("<gd name=\"x9\" fmla=\"*/ w g9 100000\" />")
					  _T("<gd name=\"x10\" fmla=\"*/ w g10 100000\" />")
					  _T("<gd name=\"x12\" fmla=\"*/ w g12 100000\" />")
					  _T("<gd name=\"x13\" fmla=\"*/ w g13 100000\" />")
					  _T("<gd name=\"x14\" fmla=\"*/ w g14 100000\" />")
					  _T("<gd name=\"x15\" fmla=\"*/ w g15 100000\" />")
					  _T("<gd name=\"x16\" fmla=\"*/ w g16 100000\" />")
					  _T("<gd name=\"x17\" fmla=\"*/ w g17 100000\" />")
					  _T("<gd name=\"x18\" fmla=\"*/ w g18 100000\" />")
					  _T("<gd name=\"x19\" fmla=\"*/ w a 100000\" />")
					  _T("<gd name=\"wR\" fmla=\"*/ w g0 100000\" />")
					  _T("<gd name=\"hR\" fmla=\"*/ h g0 100000\" />")
					  _T("<gd name=\"y8\" fmla=\"*/ h g8 100000\" />")
					  _T("<gd name=\"y9\" fmla=\"*/ h g9 100000\" />")
					  _T("<gd name=\"y10\" fmla=\"*/ h g10 100000\" />")
					  _T("<gd name=\"y12\" fmla=\"*/ h g12 100000\" />")
					  _T("<gd name=\"y13\" fmla=\"*/ h g13 100000\" />")
					  _T("<gd name=\"y14\" fmla=\"*/ h g14 100000\" />")
					  _T("<gd name=\"y15\" fmla=\"*/ h g15 100000\" />")
					  _T("<gd name=\"y16\" fmla=\"*/ h g16 100000\" />")
					  _T("<gd name=\"y17\" fmla=\"*/ h g17 100000\" />")
					  _T("<gd name=\"y18\" fmla=\"*/ h g18 100000\" />")
					_T("</gdLst>")
					_T("<ahLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<ahXY gdRefX=\"adj\" minX=\"12500\" maxX=\"46875\">")
						_T("<pos x=\"x19\" y=\"vc\" />")
					  _T("</ahXY>")
					_T("</ahLst>")
					_T("<cxnLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<cxn ang=\"3cd4\">")
						_T("<pos x=\"hc\" y=\"t\" />")
					  _T("</cxn>")
					  _T("<cxn ang=\"cd2\">")
						_T("<pos x=\"l\" y=\"vc\" />")
					  _T("</cxn>")
					  _T("<cxn ang=\"cd4\">")
						_T("<pos x=\"hc\" y=\"b\" />")
					  _T("</cxn>")
					  _T("<cxn ang=\"0\">")
						_T("<pos x=\"r\" y=\"vc\" />")
					  _T("</cxn>")
					_T("</cxnLst>")
					_T("<rect l=\"x9\" t=\"y9\" r=\"x8\" b=\"y8\" xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\" />")
					_T("<pathLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<path>")
						_T("<moveTo>")
						  _T("<pt x=\"r\" y=\"vc\" />")
						_T("</moveTo>")
						_T("<lnTo>")
						  _T("<pt x=\"x15\" y=\"y18\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"x15\" y=\"y14\" />")
						_T("</lnTo>")
						_T("<close />")
						_T("<moveTo>")
						  _T("<pt x=\"ox1\" y=\"oy1\" />")
						_T("</moveTo>")
						_T("<lnTo>")
						  _T("<pt x=\"x16\" y=\"y13\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"x17\" y=\"y12\" />")
						_T("</lnTo>")
						_T("<close />")
						_T("<moveTo>")
						  _T("<pt x=\"hc\" y=\"t\" />")
						_T("</moveTo>")
						_T("<lnTo>")
						  _T("<pt x=\"x18\" y=\"y10\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"x14\" y=\"y10\" />")
						_T("</lnTo>")
						_T("<close />")
						_T("<moveTo>")
						  _T("<pt x=\"ox2\" y=\"oy1\" />")
						_T("</moveTo>")
						_T("<lnTo>")
						  _T("<pt x=\"x13\" y=\"y12\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"x12\" y=\"y13\" />")
						_T("</lnTo>")
						_T("<close />")
						_T("<moveTo>")
						  _T("<pt x=\"l\" y=\"vc\" />")
						_T("</moveTo>")
						_T("<lnTo>")
						  _T("<pt x=\"x10\" y=\"y14\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"x10\" y=\"y18\" />")
						_T("</lnTo>")
						_T("<close />")
						_T("<moveTo>")
						  _T("<pt x=\"ox2\" y=\"oy2\" />")
						_T("</moveTo>")
						_T("<lnTo>")
						  _T("<pt x=\"x12\" y=\"y17\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"x13\" y=\"y16\" />")
						_T("</lnTo>")
						_T("<close />")
						_T("<moveTo>")
						  _T("<pt x=\"hc\" y=\"b\" />")
						_T("</moveTo>")
						_T("<lnTo>")
						  _T("<pt x=\"x14\" y=\"y15\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"x18\" y=\"y15\" />")
						_T("</lnTo>")
						_T("<close />")
						_T("<moveTo>")
						  _T("<pt x=\"ox1\" y=\"oy2\" />")
						_T("</moveTo>")
						_T("<lnTo>")
						  _T("<pt x=\"x17\" y=\"y16\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"x16\" y=\"y17\" />")
						_T("</lnTo>")
						_T("<close />")
						_T("<moveTo>")
						  _T("<pt x=\"x19\" y=\"vc\" />")
						_T("</moveTo>")
						_T("<arcTo wR=\"wR\" hR=\"hR\" stAng=\"cd2\" swAng=\"21600000\" />")
						_T("<close />")
					  _T("</path>")
					_T("</pathLst>")
					_T("</ooxml-shape>")
				);
			}
	};
}