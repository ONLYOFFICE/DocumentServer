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
	class CFunnel : public CPPTXShape
	{
		public:
			CFunnel()
			{
				LoadFromXML(
					_T("<ooxml-shape>")
					_T("<gdLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<gd name=\"d\" fmla=\"*/ ss 1 20\" />")
					  _T("<gd name=\"rw2\" fmla=\"+- wd2 0 d\" />")
					  _T("<gd name=\"rh2\" fmla=\"+- hd4 0 d\" />")
					  _T("<gd name=\"t1\" fmla=\"cos wd2 480000\" />")
					  _T("<gd name=\"t2\" fmla=\"sin hd4 480000\" />")
					  _T("<gd name=\"da\" fmla=\"at2 t1 t2\" />")
					  _T("<gd name=\"2da\" fmla=\"*/ da 2 1\" />")
					  _T("<gd name=\"stAng1\" fmla=\"+- cd2 0 da\" />")
					  _T("<gd name=\"swAng1\" fmla=\"+- cd2 2da 0\" />")
					  _T("<gd name=\"swAng3\" fmla=\"+- cd2 0 2da\" />")
					  _T("<gd name=\"rw3\" fmla=\"*/ wd2 1 4\" />")
					  _T("<gd name=\"rh3\" fmla=\"*/ hd4 1 4\" />")
					  _T("<gd name=\"ct1\" fmla=\"cos hd4 stAng1\" />")
					  _T("<gd name=\"st1\" fmla=\"sin wd2 stAng1\" />")
					  _T("<gd name=\"m1\" fmla=\"mod ct1 st1 0\" />")
					  _T("<gd name=\"n1\" fmla=\"*/ wd2 hd4 m1\" />")
					  _T("<gd name=\"dx1\" fmla=\"cos n1 stAng1\" />")
					  _T("<gd name=\"dy1\" fmla=\"sin n1 stAng1\" />")
					  _T("<gd name=\"x1\" fmla=\"+- hc dx1 0\" />")
					  _T("<gd name=\"y1\" fmla=\"+- hd4 dy1 0\" />")
					  _T("<gd name=\"ct3\" fmla=\"cos rh3 da\" />")
					  _T("<gd name=\"st3\" fmla=\"sin rw3 da\" />")
					  _T("<gd name=\"m3\" fmla=\"mod ct3 st3 0\" />")
					  _T("<gd name=\"n3\" fmla=\"*/ rw3 rh3 m3\" />")
					  _T("<gd name=\"dx3\" fmla=\"cos n3 da\" />")
					  _T("<gd name=\"dy3\" fmla=\"sin n3 da\" />")
					  _T("<gd name=\"x3\" fmla=\"+- hc dx3 0\" />")
					  _T("<gd name=\"vc3\" fmla=\"+- b 0 rh3\" />")
					  _T("<gd name=\"y2\" fmla=\"+- vc3 dy3 0\" />")
					  _T("<gd name=\"x2\" fmla=\"+- wd2 0 rw2\" />")
					  _T("<gd name=\"cd\" fmla=\"*/ cd2 2 1\" />")
					_T("</gdLst>")
					_T("<rect l=\"l\" t=\"t\" r=\"r\" b=\"b\" xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\" />")
					_T("<pathLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<path>")
						_T("<moveTo>")
						  _T("<pt x=\"x1\" y=\"y1\" />")
						_T("</moveTo>")
						_T("<arcTo hR=\"hd4\" wR=\"wd2\" stAng=\"stAng1\" swAng=\"swAng1\" />")
						_T("<lnTo>")
						  _T("<pt x=\"x3\" y=\"y2\" />")
						_T("</lnTo>")
						_T("<arcTo hR=\"rh3\" wR=\"rw3\" stAng=\"da\" swAng=\"swAng3\" />")
						_T("<close />")
						_T("<moveTo>")
						  _T("<pt x=\"x2\" y=\"hd4\" />")
						_T("</moveTo>")
						_T("<arcTo hR=\"rh2\" wR=\"rw2\" stAng=\"cd2\" swAng=\"-21600000\" />")
						_T("<close />")
					  _T("</path>")
					_T("</pathLst>")
					_T("</ooxml-shape>")
				);
			}
	};
}