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
	class CTextPlain : public CPPTXShape
	{
		public:
			CTextPlain()
			{
				LoadFromXML(
					_T("<ooxml-shape>")
					_T("<avLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<gd name=\"adj\" fmla=\"val 50000\" />")
					_T("</avLst>")
					_T("<gdLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<gd name=\"a\" fmla=\"pin 30000 adj 70000\" />")
					  _T("<gd name=\"mid\" fmla=\"*/ a w 100000\" />")
					  _T("<gd name=\"midDir\" fmla=\"+- mid 0 hc\" />")
					  _T("<gd name=\"dl\" fmla=\"+- mid 0 l\" />")
					  _T("<gd name=\"dr\" fmla=\"+- r 0 mid\" />")
					  _T("<gd name=\"dl2\" fmla=\"*/ dl 2 1\" />")
					  _T("<gd name=\"dr2\" fmla=\"*/ dr 2 1\" />")
					  _T("<gd name=\"dx\" fmla=\"?: midDir dr2 dl2\" />")
					  _T("<gd name=\"xr\" fmla=\"+- l dx 0\" />")
					  _T("<gd name=\"xl\" fmla=\"+- r 0 dx\" />")
					  _T("<gd name=\"tlx\" fmla=\"?: midDir l xl\" />")
					  _T("<gd name=\"trx\" fmla=\"?: midDir xr r\" />")
					  _T("<gd name=\"blx\" fmla=\"?: midDir xl l\" />")
					  _T("<gd name=\"brx\" fmla=\"?: midDir r xr\" />")
					_T("</gdLst>")
					_T("<ahLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<ahXY gdRefX=\"adj\" minX=\"30000\" maxX=\"70000\">")
						_T("<pos x=\"mid\" y=\"b\" />")
					  _T("</ahXY>")
					_T("</ahLst>")
					_T("<pathLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<path>")
						_T("<moveTo>")
						  _T("<pt x=\"tlx\" y=\"t\" />")
						_T("</moveTo>")
						_T("<lnTo>")
						  _T("<pt x=\"trx\" y=\"t\" />")
						_T("</lnTo>")
					  _T("</path>")
					  _T("<path>")
						_T("<moveTo>")
						  _T("<pt x=\"blx\" y=\"b\" />")
						_T("</moveTo>")
						_T("<lnTo>")
						  _T("<pt x=\"brx\" y=\"b\" />")
						_T("</lnTo>")
					  _T("</path>")
					_T("</pathLst>")
					_T("</ooxml-shape>")
				);
			}
	};
}