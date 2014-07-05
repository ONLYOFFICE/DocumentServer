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
	class CCube : public CPPTXShape
	{
		public:
			CCube()
			{
				LoadFromXML(
					_T("<ooxml-shape>")
					_T("<avLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<gd name=\"adj\" fmla=\"val 25000\" />")
					_T("</avLst>")
					_T("<gdLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<gd name=\"a\" fmla=\"pin 0 adj 100000\" />")
					  _T("<gd name=\"y1\" fmla=\"*/ ss a 100000\" />")
					  _T("<gd name=\"y4\" fmla=\"+- b 0 y1\" />")
					  _T("<gd name=\"y2\" fmla=\"*/ y4 1 2\" />")
					  _T("<gd name=\"y3\" fmla=\"+/ y1 b 2\" />")
					  _T("<gd name=\"x4\" fmla=\"+- r 0 y1\" />")
					  _T("<gd name=\"x2\" fmla=\"*/ x4 1 2\" />")
					  _T("<gd name=\"x3\" fmla=\"+/ y1 r 2\" />")
					_T("</gdLst>")
					_T("<ahLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<ahXY gdRefY=\"adj\" minY=\"0\" maxY=\"100000\">")
						_T("<pos x=\"l\" y=\"y1\" />")
					  _T("</ahXY>")
					_T("</ahLst>")
					_T("<cxnLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<cxn ang=\"3cd4\">")
						_T("<pos x=\"x3\" y=\"t\" />")
					  _T("</cxn>")
					  _T("<cxn ang=\"3cd4\">")
						_T("<pos x=\"x2\" y=\"y1\" />")
					  _T("</cxn>")
					  _T("<cxn ang=\"cd2\">")
						_T("<pos x=\"l\" y=\"y3\" />")
					  _T("</cxn>")
					  _T("<cxn ang=\"cd4\">")
						_T("<pos x=\"x2\" y=\"b\" />")
					  _T("</cxn>")
					  _T("<cxn ang=\"0\">")
						_T("<pos x=\"x4\" y=\"y3\" />")
					  _T("</cxn>")
					  _T("<cxn ang=\"0\">")
						_T("<pos x=\"r\" y=\"y2\" />")
					  _T("</cxn>")
					_T("</cxnLst>")
					_T("<rect l=\"l\" t=\"y1\" r=\"x4\" b=\"b\" xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\" />")
					_T("<pathLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<path stroke=\"false\" extrusionOk=\"false\">")
						_T("<moveTo>")
						  _T("<pt x=\"l\" y=\"y1\" />")
						_T("</moveTo>")
						_T("<lnTo>")
						  _T("<pt x=\"x4\" y=\"y1\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"x4\" y=\"b\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"l\" y=\"b\" />")
						_T("</lnTo>")
						_T("<close />")
					  _T("</path>")
					  _T("<path stroke=\"false\" fill=\"darkenLess\" extrusionOk=\"false\">")
						_T("<moveTo>")
						  _T("<pt x=\"x4\" y=\"y1\" />")
						_T("</moveTo>")
						_T("<lnTo>")
						  _T("<pt x=\"r\" y=\"t\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"r\" y=\"y4\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"x4\" y=\"b\" />")
						_T("</lnTo>")
						_T("<close />")
					  _T("</path>")
					  _T("<path stroke=\"false\" fill=\"lightenLess\" extrusionOk=\"false\">")
						_T("<moveTo>")
						  _T("<pt x=\"l\" y=\"y1\" />")
						_T("</moveTo>")
						_T("<lnTo>")
						  _T("<pt x=\"y1\" y=\"t\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"r\" y=\"t\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"x4\" y=\"y1\" />")
						_T("</lnTo>")
						_T("<close />")
					  _T("</path>")
					  _T("<path fill=\"none\" extrusionOk=\"false\">")
						_T("<moveTo>")
						  _T("<pt x=\"l\" y=\"y1\" />")
						_T("</moveTo>")
						_T("<lnTo>")
						  _T("<pt x=\"y1\" y=\"t\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"r\" y=\"t\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"r\" y=\"y4\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"x4\" y=\"b\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"l\" y=\"b\" />")
						_T("</lnTo>")
						_T("<close />")
						_T("<moveTo>")
						  _T("<pt x=\"l\" y=\"y1\" />")
						_T("</moveTo>")
						_T("<lnTo>")
						  _T("<pt x=\"x4\" y=\"y1\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"r\" y=\"t\" />")
						_T("</lnTo>")
						_T("<moveTo>")
						  _T("<pt x=\"x4\" y=\"y1\" />")
						_T("</moveTo>")
						_T("<lnTo>")
						  _T("<pt x=\"x4\" y=\"b\" />")
						_T("</lnTo>")
					  _T("</path>")
					_T("</pathLst>")
					_T("</ooxml-shape>")
				);
			}
	};
}