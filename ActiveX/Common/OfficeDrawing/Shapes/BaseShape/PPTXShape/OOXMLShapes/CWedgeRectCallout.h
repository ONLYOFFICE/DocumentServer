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
	class CWedgeRectCallout : public CPPTXShape
	{
		public:
			CWedgeRectCallout()
			{
				LoadFromXML(
					_T("<ooxml-shape>")
					_T("<avLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<gd name=\"adj1\" fmla=\"val -20833\" />")
					  _T("<gd name=\"adj2\" fmla=\"val 62500\" />")
					_T("</avLst>")
					_T("<gdLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<gd name=\"dxPos\" fmla=\"*/ w adj1 100000\" />")
					  _T("<gd name=\"dyPos\" fmla=\"*/ h adj2 100000\" />")
					  _T("<gd name=\"xPos\" fmla=\"+- hc dxPos 0\" />")
					  _T("<gd name=\"yPos\" fmla=\"+- vc dyPos 0\" />")
					  _T("<gd name=\"dx\" fmla=\"+- xPos 0 hc\" />")
					  _T("<gd name=\"dy\" fmla=\"+- yPos 0 vc\" />")
					  _T("<gd name=\"dq\" fmla=\"*/ dxPos h w\" />")
					  _T("<gd name=\"ady\" fmla=\"abs dyPos\" />")
					  _T("<gd name=\"adq\" fmla=\"abs dq\" />")
					  _T("<gd name=\"dz\" fmla=\"+- ady 0 adq\" />")
					  _T("<gd name=\"xg1\" fmla=\"?: dxPos 7 2\" />")
					  _T("<gd name=\"xg2\" fmla=\"?: dxPos 10 5\" />")
					  _T("<gd name=\"x1\" fmla=\"*/ w xg1 12\" />")
					  _T("<gd name=\"x2\" fmla=\"*/ w xg2 12\" />")
					  _T("<gd name=\"yg1\" fmla=\"?: dyPos 7 2\" />")
					  _T("<gd name=\"yg2\" fmla=\"?: dyPos 10 5\" />")
					  _T("<gd name=\"y1\" fmla=\"*/ h yg1 12\" />")
					  _T("<gd name=\"y2\" fmla=\"*/ h yg2 12\" />")
					  _T("<gd name=\"t1\" fmla=\"?: dxPos l xPos\" />")
					  _T("<gd name=\"xl\" fmla=\"?: dz l t1\" />")
					  _T("<gd name=\"t2\" fmla=\"?: dyPos x1 xPos\" />")
					  _T("<gd name=\"xt\" fmla=\"?: dz t2 x1\" />")
					  _T("<gd name=\"t3\" fmla=\"?: dxPos xPos r\" />")
					  _T("<gd name=\"xr\" fmla=\"?: dz r t3\" />")
					  _T("<gd name=\"t4\" fmla=\"?: dyPos xPos x1\" />")
					  _T("<gd name=\"xb\" fmla=\"?: dz t4 x1\" />")
					  _T("<gd name=\"t5\" fmla=\"?: dxPos y1 yPos\" />")
					  _T("<gd name=\"yl\" fmla=\"?: dz y1 t5\" />")
					  _T("<gd name=\"t6\" fmla=\"?: dyPos t yPos\" />")
					  _T("<gd name=\"yt\" fmla=\"?: dz t6 t\" />")
					  _T("<gd name=\"t7\" fmla=\"?: dxPos yPos y1\" />")
					  _T("<gd name=\"yr\" fmla=\"?: dz y1 t7\" />")
					  _T("<gd name=\"t8\" fmla=\"?: dyPos yPos b\" />")
					  _T("<gd name=\"yb\" fmla=\"?: dz t8 b\" />")
					_T("</gdLst>")
					_T("<ahLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<ahXY gdRefX=\"adj1\" minX=\"-2147483647\" maxX=\"2147483647\" gdRefY=\"adj2\" minY=\"-2147483647\" maxY=\"2147483647\">")
						_T("<pos x=\"xPos\" y=\"yPos\" />")
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
					  _T("<cxn ang=\"cd4\">")
						_T("<pos x=\"xPos\" y=\"yPos\" />")
					  _T("</cxn>")
					_T("</cxnLst>")
					_T("<rect l=\"l\" t=\"t\" r=\"r\" b=\"b\" xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\" />")
					_T("<pathLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<path>")
						_T("<moveTo>")
						  _T("<pt x=\"l\" y=\"t\" />")
						_T("</moveTo>")
						_T("<lnTo>")
						  _T("<pt x=\"x1\" y=\"t\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"xt\" y=\"yt\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"x2\" y=\"t\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"r\" y=\"t\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"r\" y=\"y1\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"xr\" y=\"yr\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"r\" y=\"y2\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"r\" y=\"b\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"x2\" y=\"b\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"xb\" y=\"yb\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"x1\" y=\"b\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"l\" y=\"b\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"l\" y=\"y2\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"xl\" y=\"yl\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"l\" y=\"y1\" />")
						_T("</lnTo>")
						_T("<close />")
					  _T("</path>")
					_T("</pathLst>")
					_T("</ooxml-shape>")
				);
			}
	};
}