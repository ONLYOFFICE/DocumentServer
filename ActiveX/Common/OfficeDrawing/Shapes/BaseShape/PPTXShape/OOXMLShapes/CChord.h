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
	class CChord : public CPPTXShape
	{
		public:
			CChord()
			{
				LoadFromXML(
					_T("<ooxml-shape>")
					_T("<avLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<gd name=\"adj1\" fmla=\"val 2700000\" />")
					  _T("<gd name=\"adj2\" fmla=\"val 16200000\" />")
					_T("</avLst>")
					_T("<gdLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<gd name=\"stAng\" fmla=\"pin 0 adj1 21599999\" />")
					  _T("<gd name=\"enAng\" fmla=\"pin 0 adj2 21599999\" />")
					  _T("<gd name=\"sw1\" fmla=\"+- enAng 0 stAng\" />")
					  _T("<gd name=\"sw2\" fmla=\"+- sw1 21600000 0\" />")
					  _T("<gd name=\"swAng\" fmla=\"?: sw1 sw1 sw2\" />")
					  _T("<gd name=\"wt1\" fmla=\"sin wd2 stAng\" />")
					  _T("<gd name=\"ht1\" fmla=\"cos hd2 stAng\" />")
					  _T("<gd name=\"dx1\" fmla=\"cat2 wd2 ht1 wt1\" />")
					  _T("<gd name=\"dy1\" fmla=\"sat2 hd2 ht1 wt1\" />")
					  _T("<gd name=\"wt2\" fmla=\"sin wd2 enAng\" />")
					  _T("<gd name=\"ht2\" fmla=\"cos hd2 enAng\" />")
					  _T("<gd name=\"dx2\" fmla=\"cat2 wd2 ht2 wt2\" />")
					  _T("<gd name=\"dy2\" fmla=\"sat2 hd2 ht2 wt2\" />")
					  _T("<gd name=\"x1\" fmla=\"+- hc dx1 0\" />")
					  _T("<gd name=\"y1\" fmla=\"+- vc dy1 0\" />")
					  _T("<gd name=\"x2\" fmla=\"+- hc dx2 0\" />")
					  _T("<gd name=\"y2\" fmla=\"+- vc dy2 0\" />")
					  _T("<gd name=\"x3\" fmla=\"+/ x1 x2 2\" />")
					  _T("<gd name=\"y3\" fmla=\"+/ y1 y2 2\" />")
					  _T("<gd name=\"midAng0\" fmla=\"*/ swAng 1 2\" />")
					  _T("<gd name=\"midAng\" fmla=\"+- stAng midAng0 cd2\" />")
					  _T("<gd name=\"idx\" fmla=\"cos wd2 2700000\" />")
					  _T("<gd name=\"idy\" fmla=\"sin hd2 2700000\" />")
					  _T("<gd name=\"il\" fmla=\"+- hc 0 idx\" />")
					  _T("<gd name=\"ir\" fmla=\"+- hc idx 0\" />")
					  _T("<gd name=\"it\" fmla=\"+- vc 0 idy\" />")
					  _T("<gd name=\"ib\" fmla=\"+- vc idy 0\" />")
					_T("</gdLst>")
					_T("<ahLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<ahPolar gdRefAng=\"adj1\" minAng=\"0\" maxAng=\"21599999\">")
						_T("<pos x=\"x1\" y=\"y1\" />")
					  _T("</ahPolar>")
					  _T("<ahPolar gdRefAng=\"adj2\" minAng=\"0\" maxAng=\"21599999\">")
						_T("<pos x=\"x2\" y=\"y2\" />")
					  _T("</ahPolar>")
					_T("</ahLst>")
					_T("<cxnLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<cxn ang=\"stAng\">")
						_T("<pos x=\"x1\" y=\"y1\" />")
					  _T("</cxn>")
					  _T("<cxn ang=\"enAng\">")
						_T("<pos x=\"x2\" y=\"y2\" />")
					  _T("</cxn>")
					  _T("<cxn ang=\"midAng\">")
						_T("<pos x=\"x3\" y=\"y3\" />")
					  _T("</cxn>")
					_T("</cxnLst>")
					_T("<rect l=\"il\" t=\"it\" r=\"ir\" b=\"ib\" xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\" />")
					_T("<pathLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<path>")
						_T("<moveTo>")
						  _T("<pt x=\"x1\" y=\"y1\" />")
						_T("</moveTo>")
						_T("<arcTo wR=\"wd2\" hR=\"hd2\" stAng=\"stAng\" swAng=\"swAng\" />")
						_T("<close />")
					  _T("</path>")
					_T("</pathLst>")
					_T("</ooxml-shape>")
				);
			}
	};
}