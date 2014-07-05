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
	class CLightningBolt : public CPPTXShape
	{
		public:
			CLightningBolt()
			{
				LoadFromXML(
					_T("<ooxml-shape>")
					_T("<gdLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<gd name=\"x1\" fmla=\"*/ w 5022 21600\" />")
					  _T("<gd name=\"x3\" fmla=\"*/ w 8472 21600\" />")
					  _T("<gd name=\"x4\" fmla=\"*/ w 8757 21600\" />")
					  _T("<gd name=\"x5\" fmla=\"*/ w 10012 21600\" />")
					  _T("<gd name=\"x8\" fmla=\"*/ w 12860 21600\" />")
					  _T("<gd name=\"x9\" fmla=\"*/ w 13917 21600\" />")
					  _T("<gd name=\"x11\" fmla=\"*/ w 16577 21600\" />")
					  _T("<gd name=\"y1\" fmla=\"*/ h 3890 21600\" />")
					  _T("<gd name=\"y2\" fmla=\"*/ h 6080 21600\" />")
					  _T("<gd name=\"y4\" fmla=\"*/ h 7437 21600\" />")
					  _T("<gd name=\"y6\" fmla=\"*/ h 9705 21600\" />")
					  _T("<gd name=\"y7\" fmla=\"*/ h 12007 21600\" />")
					  _T("<gd name=\"y10\" fmla=\"*/ h 14277 21600\" />")
					  _T("<gd name=\"y11\" fmla=\"*/ h 14915 21600\" />")
					_T("</gdLst>")
					_T("<cxnLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<cxn ang=\"3cd4\">")
						_T("<pos x=\"x3\" y=\"t\" />")
					  _T("</cxn>")
					  _T("<cxn ang=\"3cd4\">")
						_T("<pos x=\"l\" y=\"y1\" />")
					  _T("</cxn>")
					  _T("<cxn ang=\"cd2\">")
						_T("<pos x=\"x1\" y=\"y6\" />")
					  _T("</cxn>")
					  _T("<cxn ang=\"cd2\">")
						_T("<pos x=\"x5\" y=\"y11\" />")
					  _T("</cxn>")
					  _T("<cxn ang=\"cd4\">")
						_T("<pos x=\"r\" y=\"b\" />")
					  _T("</cxn>")
					  _T("<cxn ang=\"0\">")
						_T("<pos x=\"x11\" y=\"y7\" />")
					  _T("</cxn>")
					  _T("<cxn ang=\"0\">")
						_T("<pos x=\"x8\" y=\"y2\" />")
					  _T("</cxn>")
					_T("</cxnLst>")
					_T("<rect l=\"x4\" t=\"y4\" r=\"x9\" b=\"y10\" xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\" />")
					_T("<pathLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<path w=\"21600\" h=\"21600\">")
						_T("<moveTo>")
						  _T("<pt x=\"8472\" y=\"0\" />")
						_T("</moveTo>")
						_T("<lnTo>")
						  _T("<pt x=\"12860\" y=\"6080\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"11050\" y=\"6797\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"16577\" y=\"12007\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"14767\" y=\"12877\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"21600\" y=\"21600\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"10012\" y=\"14915\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"12222\" y=\"13987\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"5022\" y=\"9705\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"7602\" y=\"8382\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"0\" y=\"3890\" />")
						_T("</lnTo>")
						_T("<close />")
					  _T("</path>")
					_T("</pathLst>")
					_T("</ooxml-shape>")
				);
			}
	};
}