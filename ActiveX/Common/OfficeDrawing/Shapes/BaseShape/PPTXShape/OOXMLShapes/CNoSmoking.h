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
	class CNoSmoking : public CPPTXShape
	{
		public:
			CNoSmoking()
			{
				LoadFromXML(
					_T("<ooxml-shape>")
					_T("<avLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<gd name=\"adj\" fmla=\"val 18750\" />")
					_T("</avLst>")
					_T("<gdLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<gd name=\"a\" fmla=\"pin 0 adj 50000\" />")
					  _T("<gd name=\"dr\" fmla=\"*/ ss a 100000\" />")
					  _T("<gd name=\"iwd2\" fmla=\"+- wd2 0 dr\" />")
					  _T("<gd name=\"ihd2\" fmla=\"+- hd2 0 dr\" />")
					  _T("<gd name=\"ang\" fmla=\"at2 w h\" />")
					  _T("<gd name=\"ct\" fmla=\"cos ihd2 ang\" />")
					  _T("<gd name=\"st\" fmla=\"sin iwd2 ang\" />")
					  _T("<gd name=\"m\" fmla=\"mod ct st 0\" />")
					  _T("<gd name=\"n\" fmla=\"*/ iwd2 ihd2 m\" />")
					  _T("<gd name=\"drd2\" fmla=\"*/ dr 1 2\" />")
					  _T("<gd name=\"dang\" fmla=\"at2 n drd2\" />")
					  _T("<gd name=\"2dang\" fmla=\"*/ dang 2 1\" />")
					  _T("<gd name=\"swAng\" fmla=\"+- -10800000 2dang 0\" />")
					  _T("<gd name=\"t3\" fmla=\"at2 w h\" />")
					  _T("<gd name=\"stAng1\" fmla=\"+- t3 0 dang\" />")
					  _T("<gd name=\"stAng2\" fmla=\"+- stAng1 0 cd2\" />")
					  _T("<gd name=\"ct1\" fmla=\"cos ihd2 stAng1\" />")
					  _T("<gd name=\"st1\" fmla=\"sin iwd2 stAng1\" />")
					  _T("<gd name=\"m1\" fmla=\"mod ct1 st1 0\" />")
					  _T("<gd name=\"n1\" fmla=\"*/ iwd2 ihd2 m1\" />")
					  _T("<gd name=\"dx1\" fmla=\"cos n1 stAng1\" />")
					  _T("<gd name=\"dy1\" fmla=\"sin n1 stAng1\" />")
					  _T("<gd name=\"x1\" fmla=\"+- hc dx1 0\" />")
					  _T("<gd name=\"y1\" fmla=\"+- vc dy1 0\" />")
					  _T("<gd name=\"x2\" fmla=\"+- hc 0 dx1\" />")
					  _T("<gd name=\"y2\" fmla=\"+- vc 0 dy1\" />")
					  _T("<gd name=\"idx\" fmla=\"cos wd2 2700000\" />")
					  _T("<gd name=\"idy\" fmla=\"sin hd2 2700000\" />")
					  _T("<gd name=\"il\" fmla=\"+- hc 0 idx\" />")
					  _T("<gd name=\"ir\" fmla=\"+- hc idx 0\" />")
					  _T("<gd name=\"it\" fmla=\"+- vc 0 idy\" />")
					  _T("<gd name=\"ib\" fmla=\"+- vc idy 0\" />")
					_T("</gdLst>")
					_T("<ahLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<ahPolar gdRefR=\"adj\" minR=\"0\" maxR=\"50000\">")
						_T("<pos x=\"dr\" y=\"vc\" />")
					  _T("</ahPolar>")
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
					  _T("<path>")
						_T("<moveTo>")
						  _T("<pt x=\"l\" y=\"vc\" />")
						_T("</moveTo>")
						_T("<arcTo wR=\"wd2\" hR=\"hd2\" stAng=\"cd2\" swAng=\"cd4\" />")
						_T("<arcTo wR=\"wd2\" hR=\"hd2\" stAng=\"3cd4\" swAng=\"cd4\" />")
						_T("<arcTo wR=\"wd2\" hR=\"hd2\" stAng=\"0\" swAng=\"cd4\" />")
						_T("<arcTo wR=\"wd2\" hR=\"hd2\" stAng=\"cd4\" swAng=\"cd4\" />")
						_T("<close />")
						_T("<moveTo>")
						  _T("<pt x=\"x1\" y=\"y1\" />")
						_T("</moveTo>")
						_T("<arcTo wR=\"iwd2\" hR=\"ihd2\" stAng=\"stAng1\" swAng=\"swAng\" />")
						_T("<close />")
						_T("<moveTo>")
						  _T("<pt x=\"x2\" y=\"y2\" />")
						_T("</moveTo>")
						_T("<arcTo wR=\"iwd2\" hR=\"ihd2\" stAng=\"stAng2\" swAng=\"swAng\" />")
						_T("<close />")
					  _T("</path>")
					_T("</pathLst>")
					_T("</ooxml-shape>")
				);
			}
	};
}