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
	class CTextButton : public CPPTXShape
	{
		public:
			CTextButton()
			{
				LoadFromXML(
					_T("<ooxml-shape>")
					_T("<avLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<gd name=\"adj\" fmla=\"val 10800000\" />")
					_T("</avLst>")
					_T("<gdLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<gd name=\"adval\" fmla=\"pin 0 adj 21599999\" />")
					  _T("<gd name=\"bot\" fmla=\"+- 5400000 0 adval\" />")
					  _T("<gd name=\"lef\" fmla=\"+- 10800000 0 adval\" />")
					  _T("<gd name=\"top\" fmla=\"+- 16200000 0 adval\" />")
					  _T("<gd name=\"rig\" fmla=\"+- 21600000 0 adval\" />")
					  _T("<gd name=\"c3\" fmla=\"?: top adval 0\" />")
					  _T("<gd name=\"c2\" fmla=\"?: lef 10800000 c3\" />")
					  _T("<gd name=\"c1\" fmla=\"?: bot rig c2\" />")
					  _T("<gd name=\"stAng\" fmla=\"?: adval c1 0\" />")
					  _T("<gd name=\"w1\" fmla=\"+- 21600000 0 stAng\" />")
					  _T("<gd name=\"stAngB\" fmla=\"?: stAng w1 0\" />")
					  _T("<gd name=\"td1\" fmla=\"*/ bot 2 1\" />")
					  _T("<gd name=\"td2\" fmla=\"*/ top 2 1\" />")
					  _T("<gd name=\"ntd2\" fmla=\"+- 0 0 td2\" />")
					  _T("<gd name=\"w2\" fmla=\"+- 0 0 10800000\" />")
					  _T("<gd name=\"c6\" fmla=\"?: top ntd2 w2\" />")
					  _T("<gd name=\"c5\" fmla=\"?: lef 10800000 c6\" />")
					  _T("<gd name=\"c4\" fmla=\"?: bot td1 c5\" />")
					  _T("<gd name=\"v1\" fmla=\"?: adval c4 10800000\" />")
					  _T("<gd name=\"swAngT\" fmla=\"+- 0 0 v1\" />")
					  _T("<gd name=\"stT\" fmla=\"?: lef stAngB stAng\" />")
					  _T("<gd name=\"stB\" fmla=\"?: lef stAng stAngB\" />")
					  _T("<gd name=\"swT\" fmla=\"?: lef v1 swAngT\" />")
					  _T("<gd name=\"swB\" fmla=\"?: lef swAngT v1\" />")
					  _T("<gd name=\"wt1\" fmla=\"sin wd2 stT\" />")
					  _T("<gd name=\"ht1\" fmla=\"cos hd2 stT\" />")
					  _T("<gd name=\"dx1\" fmla=\"cat2 wd2 ht1 wt1\" />")
					  _T("<gd name=\"dy1\" fmla=\"sat2 hd2 ht1 wt1\" />")
					  _T("<gd name=\"x1\" fmla=\"+- hc dx1 0\" />")
					  _T("<gd name=\"y1\" fmla=\"+- vc dy1 0\" />")
					  _T("<gd name=\"wt2\" fmla=\"sin wd2 stB\" />")
					  _T("<gd name=\"ht2\" fmla=\"cos hd2 stB\" />")
					  _T("<gd name=\"dx2\" fmla=\"cat2 wd2 ht2 wt2\" />")
					  _T("<gd name=\"dy2\" fmla=\"sat2 hd2 ht2 wt2\" />")
					  _T("<gd name=\"x2\" fmla=\"+- hc dx2 0\" />")
					  _T("<gd name=\"y2\" fmla=\"+- vc dy2 0\" />")
					  _T("<gd name=\"wt3\" fmla=\"sin wd2 adj\" />")
					  _T("<gd name=\"ht3\" fmla=\"cos hd2 adj\" />")
					  _T("<gd name=\"dx3\" fmla=\"cat2 wd2 ht3 wt3\" />")
					  _T("<gd name=\"dy3\" fmla=\"sat2 hd2 ht3 wt3\" />")
					  _T("<gd name=\"x3\" fmla=\"+- hc dx3 0\" />")
					  _T("<gd name=\"y3\" fmla=\"+- vc dy3 0\" />")
					_T("</gdLst>")
					_T("<ahLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<ahPolar gdRefAng=\"adj\" minAng=\"0\" maxAng=\"21599999\">")
						_T("<pos x=\"x3\" y=\"y3\" />")
					  _T("</ahPolar>")
					_T("</ahLst>")
					_T("<pathLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<path>")
						_T("<moveTo>")
						  _T("<pt x=\"x1\" y=\"y1\" />")
						_T("</moveTo>")
						_T("<arcTo wR=\"wd2\" hR=\"hd2\" stAng=\"stT\" swAng=\"swT\" />")
					  _T("</path>")
					  _T("<path>")
						_T("<moveTo>")
						  _T("<pt x=\"l\" y=\"vc\" />")
						_T("</moveTo>")
						_T("<lnTo>")
						  _T("<pt x=\"r\" y=\"vc\" />")
						_T("</lnTo>")
					  _T("</path>")
					  _T("<path>")
						_T("<moveTo>")
						  _T("<pt x=\"x2\" y=\"y2\" />")
						_T("</moveTo>")
						_T("<arcTo wR=\"wd2\" hR=\"hd2\" stAng=\"stB\" swAng=\"swB\" />")
					  _T("</path>")
					_T("</pathLst>")
					_T("</ooxml-shape>")
				);
			}
	};
}