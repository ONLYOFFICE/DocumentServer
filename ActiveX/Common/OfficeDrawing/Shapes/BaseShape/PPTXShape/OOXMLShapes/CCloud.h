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
	class CCloud : public CPPTXShape
	{
		public:
			CCloud()
			{
				LoadFromXML(
					_T("<ooxml-shape>")
					_T("<gdLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<gd name=\"il\" fmla=\"*/ w 2977 21600\" />")
					  _T("<gd name=\"it\" fmla=\"*/ h 3262 21600\" />")
					  _T("<gd name=\"ir\" fmla=\"*/ w 17087 21600\" />")
					  _T("<gd name=\"ib\" fmla=\"*/ h 17337 21600\" />")
					  _T("<gd name=\"g27\" fmla=\"*/ w 67 21600\" />")
					  _T("<gd name=\"g28\" fmla=\"*/ h 21577 21600\" />")
					  _T("<gd name=\"g29\" fmla=\"*/ w 21582 21600\" />")
					  _T("<gd name=\"g30\" fmla=\"*/ h 1235 21600\" />")
					_T("</gdLst>")
					_T("<cxnLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<cxn ang=\"0\">")
						_T("<pos x=\"g29\" y=\"vc\" />")
					  _T("</cxn>")
					  _T("<cxn ang=\"cd4\">")
						_T("<pos x=\"hc\" y=\"g28\" />")
					  _T("</cxn>")
					  _T("<cxn ang=\"cd2\">")
						_T("<pos x=\"g27\" y=\"vc\" />")
					  _T("</cxn>")
					  _T("<cxn ang=\"3cd4\">")
						_T("<pos x=\"hc\" y=\"g30\" />")
					  _T("</cxn>")
					_T("</cxnLst>")
					_T("<rect l=\"il\" t=\"it\" r=\"ir\" b=\"ib\" xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\" />")
					_T("<pathLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<path w=\"43200\" h=\"43200\">")
						_T("<moveTo>")
						  _T("<pt x=\"3900\" y=\"14370\" />")
						_T("</moveTo>")
						_T("<arcTo wR=\"6753\" hR=\"9190\" stAng=\"-11429249\" swAng=\"7426832\" />")
						_T("<arcTo wR=\"5333\" hR=\"7267\" stAng=\"-8646143\" swAng=\"5396714\" />")
						_T("<arcTo wR=\"4365\" hR=\"5945\" stAng=\"-8748475\" swAng=\"5983381\" />")
						_T("<arcTo wR=\"4857\" hR=\"6595\" stAng=\"-7859164\" swAng=\"7034504\" />")
						_T("<arcTo wR=\"5333\" hR=\"7273\" stAng=\"-4722533\" swAng=\"6541615\" />")
						_T("<arcTo wR=\"6775\" hR=\"9220\" stAng=\"-2776035\" swAng=\"7816140\" />")
						_T("<arcTo wR=\"5785\" hR=\"7867\" stAng=\"37501\" swAng=\"6842000\" />")
						_T("<arcTo wR=\"6752\" hR=\"9215\" stAng=\"1347096\" swAng=\"6910353\" />")
						_T("<arcTo wR=\"7720\" hR=\"10543\" stAng=\"3974558\" swAng=\"4542661\" />")
						_T("<arcTo wR=\"4360\" hR=\"5918\" stAng=\"-16496525\" swAng=\"8804134\" />")
						_T("<arcTo wR=\"4345\" hR=\"5945\" stAng=\"-14809710\" swAng=\"9151131\" />")
						_T("<close />")
					  _T("</path>")
					  _T("<path w=\"43200\" h=\"43200\" fill=\"none\" extrusionOk=\"false\">")
						_T("<moveTo>")
						  _T("<pt x=\"4693\" y=\"26177\" />")
						_T("</moveTo>")
						_T("<arcTo wR=\"4345\" hR=\"5945\" stAng=\"5204520\" swAng=\"1585770\" />")
						_T("<moveTo>")
						  _T("<pt x=\"6928\" y=\"34899\" />")
						_T("</moveTo>")
						_T("<arcTo wR=\"4360\" hR=\"5918\" stAng=\"4416628\" swAng=\"686848\" />")
						_T("<moveTo>")
						  _T("<pt x=\"16478\" y=\"39090\" />")
						_T("</moveTo>")
						_T("<arcTo wR=\"6752\" hR=\"9215\" stAng=\"8257449\" swAng=\"844866\" />")
						_T("<moveTo>")
						  _T("<pt x=\"28827\" y=\"34751\" />")
						_T("</moveTo>")
						_T("<arcTo wR=\"6752\" hR=\"9215\" stAng=\"387196\" swAng=\"959901\" />")
						_T("<moveTo>")
						  _T("<pt x=\"34129\" y=\"22954\" />")
						_T("</moveTo>")
						_T("<arcTo wR=\"5785\" hR=\"7867\" stAng=\"-4217541\" swAng=\"4255042\" />")
						_T("<moveTo>")
						  _T("<pt x=\"41798\" y=\"15354\" />")
						_T("</moveTo>")
						_T("<arcTo wR=\"5333\" hR=\"7273\" stAng=\"1819082\" swAng=\"1665090\" />")
						_T("<moveTo>")
						  _T("<pt x=\"38324\" y=\"5426\" />")
						_T("</moveTo>")
						_T("<arcTo wR=\"4857\" hR=\"6595\" stAng=\"-824660\" swAng=\"891534\" />")
						_T("<moveTo>")
						  _T("<pt x=\"29078\" y=\"3952\" />")
						_T("</moveTo>")
						_T("<arcTo wR=\"4857\" hR=\"6595\" stAng=\"-8950887\" swAng=\"1091722\" />")
						_T("<moveTo>")
						  _T("<pt x=\"22141\" y=\"4720\" />")
						_T("</moveTo>")
						_T("<arcTo wR=\"4365\" hR=\"5945\" stAng=\"-9809656\" swAng=\"1061181\" />")
						_T("<moveTo>")
						  _T("<pt x=\"14000\" y=\"5192\" />")
						_T("</moveTo>")
						_T("<arcTo wR=\"6753\" hR=\"9190\" stAng=\"-4002417\" swAng=\"739161\" />")
						_T("<moveTo>")
						  _T("<pt x=\"4127\" y=\"15789\" />")
						_T("</moveTo>")
						_T("<arcTo wR=\"6753\" hR=\"9190\" stAng=\"9459261\" swAng=\"711490\" />")
					  _T("</path>")
					_T("</pathLst>")
					_T("</ooxml-shape>")
				);
			}
	};
}