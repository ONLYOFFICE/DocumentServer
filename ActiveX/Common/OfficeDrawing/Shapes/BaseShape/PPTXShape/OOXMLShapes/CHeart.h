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
	class CHeart : public CPPTXShape
	{
		public:
			CHeart()
			{
				LoadFromXML(
					_T("<ooxml-shape>")
					_T("<gdLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<gd name=\"dx1\" fmla=\"*/ w 49 48\" />")
					  _T("<gd name=\"dx2\" fmla=\"*/ w 10 48\" />")
					  _T("<gd name=\"x1\" fmla=\"+- hc 0 dx1\" />")
					  _T("<gd name=\"x2\" fmla=\"+- hc 0 dx2\" />")
					  _T("<gd name=\"x3\" fmla=\"+- hc dx2 0\" />")
					  _T("<gd name=\"x4\" fmla=\"+- hc dx1 0\" />")
					  _T("<gd name=\"y1\" fmla=\"+- t 0 hd3\" />")
					  _T("<gd name=\"il\" fmla=\"*/ w 1 6\" />")
					  _T("<gd name=\"ir\" fmla=\"*/ w 5 6\" />")
					  _T("<gd name=\"ib\" fmla=\"*/ h 2 3\" />")
					_T("</gdLst>")
					_T("<cxnLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<cxn ang=\"3cd4\">")
						_T("<pos x=\"hc\" y=\"hd4\" />")
					  _T("</cxn>")
					  _T("<cxn ang=\"cd4\">")
						_T("<pos x=\"hc\" y=\"b\" />")
					  _T("</cxn>")
					_T("</cxnLst>")
					_T("<rect l=\"il\" t=\"hd4\" r=\"ir\" b=\"ib\" xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\" />")
					_T("<pathLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<path>")
						_T("<moveTo>")
						  _T("<pt x=\"hc\" y=\"hd4\" />")
						_T("</moveTo>")
						_T("<cubicBezTo>")
						  _T("<pt x=\"x3\" y=\"y1\" />")
						  _T("<pt x=\"x4\" y=\"hd4\" />")
						  _T("<pt x=\"hc\" y=\"b\" />")
						_T("</cubicBezTo>")
						_T("<cubicBezTo>")
						  _T("<pt x=\"x1\" y=\"hd4\" />")
						  _T("<pt x=\"x2\" y=\"y1\" />")
						  _T("<pt x=\"hc\" y=\"hd4\" />")
						_T("</cubicBezTo>")
						_T("<close />")
					  _T("</path>")
					_T("</pathLst>")
					_T("</ooxml-shape>")
				);
			}
	};
}