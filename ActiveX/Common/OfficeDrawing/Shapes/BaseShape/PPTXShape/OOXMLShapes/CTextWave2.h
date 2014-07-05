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
	class CTextWave2 : public CPPTXShape
	{
		public:
			CTextWave2()
			{
				LoadFromXML(
					_T("<ooxml-shape>")
					_T("<avLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<gd name=\"adj1\" fmla=\"val 12500\" />")
					  _T("<gd name=\"adj2\" fmla=\"val 0\" />")
					_T("</avLst>")
					_T("<gdLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<gd name=\"a1\" fmla=\"pin 0 adj1 20000\" />")
					  _T("<gd name=\"a2\" fmla=\"pin -10000 adj2 10000\" />")
					  _T("<gd name=\"y1\" fmla=\"*/ h a1 100000\" />")
					  _T("<gd name=\"dy2\" fmla=\"*/ y1 10 3\" />")
					  _T("<gd name=\"y2\" fmla=\"+- y1 0 dy2\" />")
					  _T("<gd name=\"y3\" fmla=\"+- y1 dy2 0\" />")
					  _T("<gd name=\"y4\" fmla=\"+- b 0 y1\" />")
					  _T("<gd name=\"y5\" fmla=\"+- y4 0 dy2\" />")
					  _T("<gd name=\"y6\" fmla=\"+- y4 dy2 0\" />")
					  _T("<gd name=\"of\" fmla=\"*/ w a2 100000\" />")
					  _T("<gd name=\"of2\" fmla=\"*/ w a2 50000\" />")
					  _T("<gd name=\"x1\" fmla=\"abs of\" />")
					  _T("<gd name=\"dx2\" fmla=\"?: of2 0 of2\" />")
					  _T("<gd name=\"x2\" fmla=\"+- l 0 dx2\" />")
					  _T("<gd name=\"dx5\" fmla=\"?: of2 of2 0\" />")
					  _T("<gd name=\"x5\" fmla=\"+- r 0 dx5\" />")
					  _T("<gd name=\"dx3\" fmla=\"+/ dx2 x5 3\" />")
					  _T("<gd name=\"x3\" fmla=\"+- x2 dx3 0\" />")
					  _T("<gd name=\"x4\" fmla=\"+/ x3 x5 2\" />")
					  _T("<gd name=\"x6\" fmla=\"+- l dx5 0\" />")
					  _T("<gd name=\"x10\" fmla=\"+- r dx2 0\" />")
					  _T("<gd name=\"x7\" fmla=\"+- x6 dx3 0\" />")
					  _T("<gd name=\"x8\" fmla=\"+/ x7 x10 2\" />")
					  _T("<gd name=\"x9\" fmla=\"+- r 0 x1\" />")
					  _T("<gd name=\"xAdj\" fmla=\"+- hc of 0\" />")
					_T("</gdLst>")
					_T("<ahLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<ahXY gdRefY=\"adj1\" minY=\"0\" maxY=\"20000\">")
						_T("<pos x=\"l\" y=\"y1\" />")
					  _T("</ahXY>")
					  _T("<ahXY gdRefX=\"adj2\" minX=\"-10000\" maxX=\"10000\">")
						_T("<pos x=\"xAdj\" y=\"b\" />")
					  _T("</ahXY>")
					_T("</ahLst>")
					_T("<pathLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<path>")
						_T("<moveTo>")
						  _T("<pt x=\"x2\" y=\"y1\" />")
						_T("</moveTo>")
						_T("<cubicBezTo>")
						  _T("<pt x=\"x3\" y=\"y3\" />")
						  _T("<pt x=\"x4\" y=\"y2\" />")
						  _T("<pt x=\"x5\" y=\"y1\" />")
						_T("</cubicBezTo>")
					  _T("</path>")
					  _T("<path>")
						_T("<moveTo>")
						  _T("<pt x=\"x6\" y=\"y4\" />")
						_T("</moveTo>")
						_T("<cubicBezTo>")
						  _T("<pt x=\"x7\" y=\"y6\" />")
						  _T("<pt x=\"x8\" y=\"y5\" />")
						  _T("<pt x=\"x10\" y=\"y4\" />")
						_T("</cubicBezTo>")
					  _T("</path>")
					_T("</pathLst>")
					_T("</ooxml-shape>")
				);
			}
	};
}