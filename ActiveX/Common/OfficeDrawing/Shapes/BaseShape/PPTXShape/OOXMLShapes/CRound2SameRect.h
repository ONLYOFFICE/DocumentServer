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
	class CRound2SameRect : public CPPTXShape
	{
		public:
			CRound2SameRect()
			{
				LoadFromXML(
					_T("<ooxml-shape>")
					_T("<avLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<gd name=\"adj1\" fmla=\"val 16667\" />")
					  _T("<gd name=\"adj2\" fmla=\"val 0\" />")
					_T("</avLst>")
					_T("<gdLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<gd name=\"a1\" fmla=\"pin 0 adj1 50000\" />")
					  _T("<gd name=\"a2\" fmla=\"pin 0 adj2 50000\" />")
					  _T("<gd name=\"tx1\" fmla=\"*/ ss a1 100000\" />")
					  _T("<gd name=\"tx2\" fmla=\"+- r 0 tx1\" />")
					  _T("<gd name=\"bx1\" fmla=\"*/ ss a2 100000\" />")
					  _T("<gd name=\"bx2\" fmla=\"+- r 0 bx1\" />")
					  _T("<gd name=\"by1\" fmla=\"+- b 0 bx1\" />")
					  _T("<gd name=\"d\" fmla=\"+- tx1 0 bx1\" />")
					  _T("<gd name=\"tdx\" fmla=\"*/ tx1 29289 100000\" />")
					  _T("<gd name=\"bdx\" fmla=\"*/ bx1 29289 100000\" />")
					  _T("<gd name=\"il\" fmla=\"?: d tdx bdx\" />")
					  _T("<gd name=\"ir\" fmla=\"+- r 0 il\" />")
					  _T("<gd name=\"ib\" fmla=\"+- b 0 bdx\" />")
					_T("</gdLst>")
					_T("<ahLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<ahXY gdRefX=\"adj1\" minX=\"0\" maxX=\"50000\">")
						_T("<pos x=\"tx2\" y=\"t\" />")
					  _T("</ahXY>")
					  _T("<ahXY gdRefX=\"adj2\" minX=\"0\" maxX=\"50000\">")
						_T("<pos x=\"bx1\" y=\"b\" />")
					  _T("</ahXY>")
					_T("</ahLst>")
					_T("<cxnLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<cxn ang=\"0\">")
						_T("<pos x=\"r\" y=\"vc\" />")
					  _T("</cxn>")
					  _T("<cxn ang=\"cd4\">")
						_T("<pos x=\"hc\" y=\"b\" />")
					  _T("</cxn>")
					  _T("<cxn ang=\"cd2\">")
						_T("<pos x=\"l\" y=\"vc\" />")
					  _T("</cxn>")
					  _T("<cxn ang=\"3cd4\">")
						_T("<pos x=\"hc\" y=\"t\" />")
					  _T("</cxn>")
					_T("</cxnLst>")
					_T("<rect l=\"il\" t=\"tdx\" r=\"ir\" b=\"ib\" xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\" />")
					_T("<pathLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<path>")
						_T("<moveTo>")
						  _T("<pt x=\"tx1\" y=\"t\" />")
						_T("</moveTo>")
						_T("<lnTo>")
						  _T("<pt x=\"tx2\" y=\"t\" />")
						_T("</lnTo>")
						_T("<arcTo wR=\"tx1\" hR=\"tx1\" stAng=\"3cd4\" swAng=\"cd4\" />")
						_T("<lnTo>")
						  _T("<pt x=\"r\" y=\"by1\" />")
						_T("</lnTo>")
						_T("<arcTo wR=\"bx1\" hR=\"bx1\" stAng=\"0\" swAng=\"cd4\" />")
						_T("<lnTo>")
						  _T("<pt x=\"bx1\" y=\"b\" />")
						_T("</lnTo>")
						_T("<arcTo wR=\"bx1\" hR=\"bx1\" stAng=\"cd4\" swAng=\"cd4\" />")
						_T("<lnTo>")
						  _T("<pt x=\"l\" y=\"tx1\" />")
						_T("</lnTo>")
						_T("<arcTo wR=\"tx1\" hR=\"tx1\" stAng=\"cd2\" swAng=\"cd4\" />")
						_T("<close />")
					  _T("</path>")
					_T("</pathLst>")
					_T("</ooxml-shape>")
				);
			}
	};
}