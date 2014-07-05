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
	class CTextDeflate : public CPPTXShape
	{
		public:
			CTextDeflate()
			{
				LoadFromXML(
					_T("<ooxml-shape>")
					_T("<avLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<gd name=\"adj\" fmla=\"val 18750\" />")
					_T("</avLst>")
					_T("<gdLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<gd name=\"a\" fmla=\"pin 0 adj 37500\" />")
					  _T("<gd name=\"dy\" fmla=\"*/ a ss 100000\" />")
					  _T("<gd name=\"gd0\" fmla=\"*/ dy 4 3\" />")
					  _T("<gd name=\"gd1\" fmla=\"+- h 0 gd0\" />")
					  _T("<gd name=\"adjY\" fmla=\"+- t dy 0\" />")
					  _T("<gd name=\"y0\" fmla=\"+- t gd0 0\" />")
					  _T("<gd name=\"y1\" fmla=\"+- t gd1 0\" />")
					  _T("<gd name=\"x0\" fmla=\"+- l wd3 0\" />")
					  _T("<gd name=\"x1\" fmla=\"+- r 0 wd3\" />")
					_T("</gdLst>")
					_T("<ahLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<ahXY gdRefY=\"adj\" minY=\"0\" maxY=\"37500\">")
						_T("<pos x=\"hc\" y=\"adjY\" />")
					  _T("</ahXY>")
					_T("</ahLst>")
					_T("<pathLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<path>")
						_T("<moveTo>")
						  _T("<pt x=\"l\" y=\"t\" />")
						_T("</moveTo>")
						_T("<cubicBezTo>")
						  _T("<pt x=\"x0\" y=\"y0\" />")
						  _T("<pt x=\"x1\" y=\"y0\" />")
						  _T("<pt x=\"r\" y=\"t\" />")
						_T("</cubicBezTo>")
					  _T("</path>")
					  _T("<path>")
						_T("<moveTo>")
						  _T("<pt x=\"l\" y=\"b\" />")
						_T("</moveTo>")
						_T("<cubicBezTo>")
						  _T("<pt x=\"x0\" y=\"y1\" />")
						  _T("<pt x=\"x1\" y=\"y1\" />")
						  _T("<pt x=\"r\" y=\"b\" />")
						_T("</cubicBezTo>")
					  _T("</path>")
					_T("</pathLst>")
					_T("</ooxml-shape>")
				);
			}
	};
}