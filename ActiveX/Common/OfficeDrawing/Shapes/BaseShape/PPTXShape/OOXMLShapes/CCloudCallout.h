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
	class CCloudCallout : public CPPTXShape
	{
		public:
			CCloudCallout()
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
					  _T("<gd name=\"ht\" fmla=\"cat2 hd2 dxPos dyPos\" />")
					  _T("<gd name=\"wt\" fmla=\"sat2 wd2 dxPos dyPos\" />")
					  _T("<gd name=\"g2\" fmla=\"cat2 wd2 ht wt\" />")
					  _T("<gd name=\"g3\" fmla=\"sat2 hd2 ht wt\" />")
					  _T("<gd name=\"g4\" fmla=\"+- hc g2 0\" />")
					  _T("<gd name=\"g5\" fmla=\"+- vc g3 0\" />")
					  _T("<gd name=\"g6\" fmla=\"+- g4 0 xPos\" />")
					  _T("<gd name=\"g7\" fmla=\"+- g5 0 yPos\" />")
					  _T("<gd name=\"g8\" fmla=\"mod g6 g7 0\" />")
					  _T("<gd name=\"g9\" fmla=\"*/ ss 6600 21600\" />")
					  _T("<gd name=\"g10\" fmla=\"+- g8 0 g9\" />")
					  _T("<gd name=\"g11\" fmla=\"*/ g10 1 3\" />")
					  _T("<gd name=\"g12\" fmla=\"*/ ss 1800 21600\" />")
					  _T("<gd name=\"g13\" fmla=\"+- g11 g12 0\" />")
					  _T("<gd name=\"g14\" fmla=\"*/ g13 g6 g8\" />")
					  _T("<gd name=\"g15\" fmla=\"*/ g13 g7 g8\" />")
					  _T("<gd name=\"g16\" fmla=\"+- g14 xPos 0\" />")
					  _T("<gd name=\"g17\" fmla=\"+- g15 yPos 0\" />")
					  _T("<gd name=\"g18\" fmla=\"*/ ss 4800 21600\" />")
					  _T("<gd name=\"g19\" fmla=\"*/ g11 2 1\" />")
					  _T("<gd name=\"g20\" fmla=\"+- g18 g19 0\" />")
					  _T("<gd name=\"g21\" fmla=\"*/ g20 g6 g8\" />")
					  _T("<gd name=\"g22\" fmla=\"*/ g20 g7 g8\" />")
					  _T("<gd name=\"g23\" fmla=\"+- g21 xPos 0\" />")
					  _T("<gd name=\"g24\" fmla=\"+- g22 yPos 0\" />")
					  _T("<gd name=\"g25\" fmla=\"*/ ss 1200 21600\" />")
					  _T("<gd name=\"g26\" fmla=\"*/ ss 600 21600\" />")
					  _T("<gd name=\"x23\" fmla=\"+- xPos g26 0\" />")
					  _T("<gd name=\"x24\" fmla=\"+- g16 g25 0\" />")
					  _T("<gd name=\"x25\" fmla=\"+- g23 g12 0\" />")
					  _T("<gd name=\"il\" fmla=\"*/ w 2977 21600\" />")
					  _T("<gd name=\"it\" fmla=\"*/ h 3262 21600\" />")
					  _T("<gd name=\"ir\" fmla=\"*/ w 17087 21600\" />")
					  _T("<gd name=\"ib\" fmla=\"*/ h 17337 21600\" />")
					  _T("<gd name=\"g27\" fmla=\"*/ w 67 21600\" />")
					  _T("<gd name=\"g28\" fmla=\"*/ h 21577 21600\" />")
					  _T("<gd name=\"g29\" fmla=\"*/ w 21582 21600\" />")
					  _T("<gd name=\"g30\" fmla=\"*/ h 1235 21600\" />")
					  _T("<gd name=\"pang\" fmla=\"at2 dxPos dyPos\" />")
					_T("</gdLst>")
					_T("<ahLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<ahXY gdRefX=\"adj1\" minX=\"-2147483647\" maxX=\"2147483647\" gdRefY=\"adj2\" minY=\"-2147483647\" maxY=\"2147483647\">")
						_T("<pos x=\"xPos\" y=\"yPos\" />")
					  _T("</ahXY>")
					_T("</ahLst>")
					_T("<cxnLst xmlns=\"http://schemas.openxmlformats.org/drawingml/2006/main\">")
					  _T("<cxn ang=\"cd2\">")
						_T("<pos x=\"g27\" y=\"vc\" />")
					  _T("</cxn>")
					  _T("<cxn ang=\"cd4\">")
						_T("<pos x=\"hc\" y=\"g28\" />")
					  _T("</cxn>")
					  _T("<cxn ang=\"0\">")
						_T("<pos x=\"g29\" y=\"vc\" />")
					  _T("</cxn>")
					  _T("<cxn ang=\"3cd4\">")
						_T("<pos x=\"hc\" y=\"g30\" />")
					  _T("</cxn>")
					  _T("<cxn ang=\"pang\">")
						_T("<pos x=\"xPos\" y=\"yPos\" />")
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
					  _T("<path>")
						_T("<moveTo>")
						  _T("<pt x=\"x23\" y=\"yPos\" />")
						_T("</moveTo>")
						_T("<arcTo wR=\"g26\" hR=\"g26\" stAng=\"0\" swAng=\"21600000\" />")
						_T("<close />")
					  _T("</path>")
					  _T("<path>")
						_T("<moveTo>")
						  _T("<pt x=\"x24\" y=\"g17\" />")
						_T("</moveTo>")
						_T("<arcTo wR=\"g25\" hR=\"g25\" stAng=\"0\" swAng=\"21600000\" />")
						_T("<close />")
					  _T("</path>")
					  _T("<path>")
						_T("<moveTo>")
						  _T("<pt x=\"x25\" y=\"g24\" />")
						_T("</moveTo>")
						_T("<arcTo wR=\"g12\" hR=\"g12\" stAng=\"0\" swAng=\"21600000\" />")
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