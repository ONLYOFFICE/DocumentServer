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
	class CMoon : public CPPTXShape
	{
		public:
			CMoon()
			{
				LoadFromXML(
					_T("<ooxml-shape>")
					_T("<avLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<gd name=\"adj\" fmla=\"val 50000\" />")
					_T("</avLst>")
					_T("<gdLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<gd name=\"a\" fmla=\"pin 0 adj 87500\" />")
					  _T("<gd name=\"g0\" fmla=\"*/ ss a 100000\" />")
					  _T("<gd name=\"g0w\" fmla=\"*/ g0 w ss\" />")
					  _T("<gd name=\"g1\" fmla=\"+- ss 0 g0\" />")
					  _T("<gd name=\"g2\" fmla=\"*/ g0 g0 g1\" />")
					  _T("<gd name=\"g3\" fmla=\"*/ ss ss g1\" />")
					  _T("<gd name=\"g4\" fmla=\"*/ g3 2 1\" />")
					  _T("<gd name=\"g5\" fmla=\"+- g4 0 g2\" />")
					  _T("<gd name=\"g6\" fmla=\"+- g5 0 g0\" />")
					  _T("<gd name=\"g6w\" fmla=\"*/ g6 w ss\" />")
					  _T("<gd name=\"g7\" fmla=\"*/ g5 1 2\" />")
					  _T("<gd name=\"g8\" fmla=\"+- g7 0 g0\" />")
					  _T("<gd name=\"dy1\" fmla=\"*/ g8 hd2 ss\" />")
					  _T("<gd name=\"g10h\" fmla=\"+- vc 0 dy1\" />")
					  _T("<gd name=\"g11h\" fmla=\"+- vc dy1 0\" />")
					  _T("<gd name=\"g12\" fmla=\"*/ g0 9598 32768\" />")
					  _T("<gd name=\"g12w\" fmla=\"*/ g12 w ss\" />")
					  _T("<gd name=\"g13\" fmla=\"+- ss 0 g12\" />")
					  _T("<gd name=\"q1\" fmla=\"*/ ss ss 1\" />")
					  _T("<gd name=\"q2\" fmla=\"*/ g13 g13 1\" />")
					  _T("<gd name=\"q3\" fmla=\"+- q1 0 q2\" />")
					  _T("<gd name=\"q4\" fmla=\"sqrt q3\" />")
					  _T("<gd name=\"dy4\" fmla=\"*/ q4 hd2 ss\" />")
					  _T("<gd name=\"g15h\" fmla=\"+- vc 0 dy4\" />")
					  _T("<gd name=\"g16h\" fmla=\"+- vc dy4 0\" />")
					  _T("<gd name=\"g17w\" fmla=\"+- g6w 0 g0w\" />")
					  _T("<gd name=\"g18w\" fmla=\"*/ g17w 1 2\" />")
					  _T("<gd name=\"dx2p\" fmla=\"+- g0w g18w w\" />")
					  _T("<gd name=\"dx2\" fmla=\"*/ dx2p -1 1\" />")
					  _T("<gd name=\"dy2\" fmla=\"*/ hd2 -1 1\" />")
					  _T("<gd name=\"stAng1\" fmla=\"at2 dx2 dy2\" />")
					  _T("<gd name=\"enAngp1\" fmla=\"at2 dx2 hd2\" />")
					  _T("<gd name=\"enAng1\" fmla=\"+- enAngp1 0 21600000\" />")
					  _T("<gd name=\"swAng1\" fmla=\"+- enAng1 0 stAng1\" />")
					_T("</gdLst>")
					_T("<ahLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<ahXY gdRefX=\"adj\" minX=\"0\" maxX=\"87500\">")
						_T("<pos x=\"g0w\" y=\"vc\" />")
					  _T("</ahXY>")
					_T("</ahLst>")
					_T("<cxnLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<cxn ang=\"3cd4\">")
						_T("<pos x=\"r\" y=\"t\" />")
					  _T("</cxn>")
					  _T("<cxn ang=\"cd2\">")
						_T("<pos x=\"l\" y=\"vc\" />")
					  _T("</cxn>")
					  _T("<cxn ang=\"cd4\">")
						_T("<pos x=\"r\" y=\"b\" />")
					  _T("</cxn>")
					  _T("<cxn ang=\"0\">")
						_T("<pos x=\"g0w\" y=\"vc\" />")
					  _T("</cxn>")
					_T("</cxnLst>")
					_T("<rect l=\"g12w\" t=\"g15h\" r=\"g0w\" b=\"g16h\" xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\" />")
					_T("<pathLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<path>")
						_T("<moveTo>")
						  _T("<pt x=\"r\" y=\"b\" />")
						_T("</moveTo>")
						_T("<arcTo wR=\"w\" hR=\"hd2\" stAng=\"cd4\" swAng=\"cd2\" />")
						_T("<arcTo wR=\"g18w\" hR=\"dy1\" stAng=\"stAng1\" swAng=\"swAng1\" />")
						_T("<close />")
					  _T("</path>")
					_T("</pathLst>")
					_T("</ooxml-shape>")
				);
			}
	};
}