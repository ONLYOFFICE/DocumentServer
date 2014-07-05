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
	class CIrregularSeal1 : public CPPTXShape
	{
		public:
			CIrregularSeal1()
			{
				LoadFromXML(
					_T("<ooxml-shape>")
					_T("<gdLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<gd name=\"x5\" fmla=\"*/ w 4627 21600\" />")
					  _T("<gd name=\"x12\" fmla=\"*/ w 8485 21600\" />")
					  _T("<gd name=\"x21\" fmla=\"*/ w 16702 21600\" />")
					  _T("<gd name=\"x24\" fmla=\"*/ w 14522 21600\" />")
					  _T("<gd name=\"y3\" fmla=\"*/ h 6320 21600\" />")
					  _T("<gd name=\"y6\" fmla=\"*/ h 8615 21600\" />")
					  _T("<gd name=\"y9\" fmla=\"*/ h 13937 21600\" />")
					  _T("<gd name=\"y18\" fmla=\"*/ h 13290 21600\" />")
					_T("</gdLst>")
					_T("<cxnLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<cxn ang=\"3cd4\">")
						_T("<pos x=\"x24\" y=\"t\" />")
					  _T("</cxn>")
					  _T("<cxn ang=\"cd2\">")
						_T("<pos x=\"l\" y=\"y6\" />")
					  _T("</cxn>")
					  _T("<cxn ang=\"cd4\">")
						_T("<pos x=\"x12\" y=\"b\" />")
					  _T("</cxn>")
					  _T("<cxn ang=\"0\">")
						_T("<pos x=\"r\" y=\"y18\" />")
					  _T("</cxn>")
					_T("</cxnLst>")
					_T("<rect l=\"x5\" t=\"y3\" r=\"x21\" b=\"y9\" xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\" />")
					_T("<pathLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<path w=\"21600\" h=\"21600\">")
						_T("<moveTo>")
						  _T("<pt x=\"10800\" y=\"5800\" />")
						_T("</moveTo>")
						_T("<lnTo>")
						  _T("<pt x=\"14522\" y=\"0\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"14155\" y=\"5325\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"18380\" y=\"4457\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"16702\" y=\"7315\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"21097\" y=\"8137\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"17607\" y=\"10475\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"21600\" y=\"13290\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"16837\" y=\"12942\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"18145\" y=\"18095\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"14020\" y=\"14457\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"13247\" y=\"19737\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"10532\" y=\"14935\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"8485\" y=\"21600\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"7715\" y=\"15627\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"4762\" y=\"17617\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"5667\" y=\"13937\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"135\" y=\"14587\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"3722\" y=\"11775\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"0\" y=\"8615\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"4627\" y=\"7617\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"370\" y=\"2295\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"7312\" y=\"6320\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"8352\" y=\"2295\" />")
						_T("</lnTo>")
						_T("<close />")
					  _T("</path>")
					_T("</pathLst>")
					_T("</ooxml-shape>")
				);
			}
	};
}