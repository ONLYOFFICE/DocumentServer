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
	class CTextArchUpPour : public CPPTXShape
	{
		public:
			CTextArchUpPour()
			{
				LoadFromXML(
					_T("<ooxml-shape>")
					_T("<avLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<gd name=\"adj1\" fmla=\"val cd2\" />")
					  _T("<gd name=\"adj2\" fmla=\"val 50000\" />")
					_T("</avLst>")
					_T("<gdLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<gd name=\"adval\" fmla=\"pin 0 adj1 21599999\" />")
					  _T("<gd name=\"v1\" fmla=\"+- 10800000 0 adval\" />")
					  _T("<gd name=\"v2\" fmla=\"+- 32400000 0 adval\" />")
					  _T("<gd name=\"end\" fmla=\"?: v1 v1 v2\" />")
					  _T("<gd name=\"w1\" fmla=\"+- 5400000 0 adval\" />")
					  _T("<gd name=\"w2\" fmla=\"+- 16200000 0 adval\" />")
					  _T("<gd name=\"d1\" fmla=\"+- end 0 adval\" />")
					  _T("<gd name=\"d2\" fmla=\"+- 21600000 d1 0\" />")
					  _T("<gd name=\"c2\" fmla=\"?: w2 d1 d2\" />")
					  _T("<gd name=\"c1\" fmla=\"?: v1 d2 c2\" />")
					  _T("<gd name=\"swAng\" fmla=\"?: w1 d1 c1\" />")
					  _T("<gd name=\"wt1\" fmla=\"sin wd2 adval\" />")
					  _T("<gd name=\"ht1\" fmla=\"cos hd2 adval\" />")
					  _T("<gd name=\"dx1\" fmla=\"cat2 wd2 ht1 wt1\" />")
					  _T("<gd name=\"dy1\" fmla=\"sat2 hd2 ht1 wt1\" />")
					  _T("<gd name=\"x1\" fmla=\"+- hc dx1 0\" />")
					  _T("<gd name=\"y1\" fmla=\"+- vc dy1 0\" />")
					  _T("<gd name=\"adval2\" fmla=\"pin 0 adj2 99000\" />")
					  _T("<gd name=\"ratio\" fmla=\"*/ adval2 1 100000\" />")
					  _T("<gd name=\"iwd2\" fmla=\"*/ wd2 ratio 1\" />")
					  _T("<gd name=\"ihd2\" fmla=\"*/ hd2 ratio 1\" />")
					  _T("<gd name=\"wt2\" fmla=\"sin iwd2 adval\" />")
					  _T("<gd name=\"ht2\" fmla=\"cos ihd2 adval\" />")
					  _T("<gd name=\"dx2\" fmla=\"cat2 iwd2 ht2 wt2\" />")
					  _T("<gd name=\"dy2\" fmla=\"sat2 ihd2 ht2 wt2\" />")
					  _T("<gd name=\"x2\" fmla=\"+- hc dx2 0\" />")
					  _T("<gd name=\"y2\" fmla=\"+- vc dy2 0\" />")
					_T("</gdLst>")
					_T("<ahLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<ahPolar gdRefR=\"adj2\" minR=\"0\" maxR=\"100000\" gdRefAng=\"adj1\" minAng=\"0\" maxAng=\"21599999\">")
						_T("<pos x=\"x2\" y=\"y2\" />")
					  _T("</ahPolar>")
					_T("</ahLst>")
					_T("<pathLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<path>")
						_T("<moveTo>")
						  _T("<pt x=\"x1\" y=\"y1\" />")
						_T("</moveTo>")
						_T("<arcTo wR=\"wd2\" hR=\"hd2\" stAng=\"adval\" swAng=\"swAng\" />")
					  _T("</path>")
					  _T("<path>")
						_T("<moveTo>")
						  _T("<pt x=\"x2\" y=\"y2\" />")
						_T("</moveTo>")
						_T("<arcTo wR=\"iwd2\" hR=\"ihd2\" stAng=\"adval\" swAng=\"swAng\" />")
					  _T("</path>")
					_T("</pathLst>")
					_T("</ooxml-shape>")
				);
			}
	};
}