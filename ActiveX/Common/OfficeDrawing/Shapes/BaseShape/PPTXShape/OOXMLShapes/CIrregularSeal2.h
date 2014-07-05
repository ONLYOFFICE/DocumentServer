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
	class CIrregularSeal2 : public CPPTXShape
	{
		public:
			CIrregularSeal2()
			{
				LoadFromXML(
					_T("<ooxml-shape>")
					_T("<gdLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<gd name=\"x2\" fmla=\"*/ w 9722 21600\" />")
					  _T("<gd name=\"x5\" fmla=\"*/ w 5372 21600\" />")
					  _T("<gd name=\"x16\" fmla=\"*/ w 11612 21600\" />")
					  _T("<gd name=\"x19\" fmla=\"*/ w 14640 21600\" />")
					  _T("<gd name=\"y2\" fmla=\"*/ h 1887 21600\" />")
					  _T("<gd name=\"y3\" fmla=\"*/ h 6382 21600\" />")
					  _T("<gd name=\"y8\" fmla=\"*/ h 12877 21600\" />")
					  _T("<gd name=\"y14\" fmla=\"*/ h 19712 21600\" />")
					  _T("<gd name=\"y16\" fmla=\"*/ h 18842 21600\" />")
					  _T("<gd name=\"y17\" fmla=\"*/ h 15935 21600\" />")
					  _T("<gd name=\"y24\" fmla=\"*/ h 6645 21600\" />")
					_T("</gdLst>")
					_T("<cxnLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<cxn ang=\"3cd4\">")
						_T("<pos x=\"x2\" y=\"y2\" />")
					  _T("</cxn>")
					  _T("<cxn ang=\"cd2\">")
						_T("<pos x=\"l\" y=\"y8\" />")
					  _T("</cxn>")
					  _T("<cxn ang=\"cd4\">")
						_T("<pos x=\"x16\" y=\"y16\" />")
					  _T("</cxn>")
					  _T("<cxn ang=\"0\">")
						_T("<pos x=\"r\" y=\"y24\" />")
					  _T("</cxn>")
					_T("</cxnLst>")
					_T("<rect l=\"x5\" t=\"y3\" r=\"x19\" b=\"y17\" xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\" />")
					_T("<pathLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<path w=\"21600\" h=\"21600\">")
						_T("<moveTo>")
						  _T("<pt x=\"11462\" y=\"4342\" />")
						_T("</moveTo>")
						_T("<lnTo>")
						  _T("<pt x=\"14790\" y=\"0\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"14525\" y=\"5777\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"18007\" y=\"3172\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"16380\" y=\"6532\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"21600\" y=\"6645\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"16985\" y=\"9402\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"18270\" y=\"11290\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"16380\" y=\"12310\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"18877\" y=\"15632\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"14640\" y=\"14350\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"14942\" y=\"17370\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"12180\" y=\"15935\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"11612\" y=\"18842\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"9872\" y=\"17370\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"8700\" y=\"19712\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"7527\" y=\"18125\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"4917\" y=\"21600\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"4805\" y=\"18240\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"1285\" y=\"17825\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"3330\" y=\"15370\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"0\" y=\"12877\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"3935\" y=\"11592\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"1172\" y=\"8270\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"5372\" y=\"7817\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"4502\" y=\"3625\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"8550\" y=\"6382\" />")
						_T("</lnTo>")
						_T("<lnTo>")
						  _T("<pt x=\"9722\" y=\"1887\" />")
						_T("</lnTo>")
						_T("<close />")
					  _T("</path>")
					_T("</pathLst>")
					_T("</ooxml-shape>")
				);
			}
	};
}