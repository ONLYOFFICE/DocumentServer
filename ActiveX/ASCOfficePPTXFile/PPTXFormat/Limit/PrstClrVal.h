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
#ifndef PPTX_LIMIT_PRSTCLRVAL_INCLUDE_H_
#define PPTX_LIMIT_PRSTCLRVAL_INCLUDE_H_

#include "BaseLimit.h"


namespace PPTX
{
	namespace Limit
	{
		class PrstClrVal : public BaseLimit
		{
		public:
			PrstClrVal()
			{
				m_strValue = _T("black");
	 		}

			_USE_STRING_OPERATOR
				
			virtual void set(const CString& strValue)
			{
				if ((_T("aliceBlue") == strValue) || 
					(_T("antiqueWhite") == strValue) || 
					(_T("aqua") == strValue) || 
					(_T("aquamarine") == strValue) || 
					(_T("azure") == strValue) || 
					(_T("beige") == strValue) || 
					(_T("bisque") == strValue) || 
					(_T("black") == strValue) || 
					(_T("blanchedAlmond") == strValue) || 
					(_T("blue") == strValue) || 
					(_T("blueViolet") == strValue) || 
					(_T("brown") == strValue) || 
					(_T("burlyWood") == strValue) || 
					(_T("cadetBlue") == strValue) || 
					(_T("chartreuse") == strValue) || 
					(_T("chocolate") == strValue) || 
					(_T("coral") == strValue) || 
					(_T("cornflowerBlue") == strValue) || 
					(_T("cornsilk") == strValue) || 
					(_T("crimson") == strValue) || 
					(_T("cyan") == strValue) || 
					(_T("darkBlue") == strValue) || 
					(_T("darkCyan") == strValue) || 
					(_T("darkGoldenrod") == strValue) || 
					(_T("darkGray") == strValue) || 
					(_T("darkGreen") == strValue) || 
					(_T("darkGrey") == strValue) || 
					(_T("darkKhaki") == strValue) || 
					(_T("darkMagenta") == strValue) || 
					(_T("darkOliveGreen") == strValue) || 
					(_T("darkOrange") == strValue) || 
					(_T("darkOrchid") == strValue) || 
					(_T("darkRed") == strValue) || 
					(_T("darkSalmon") == strValue) || 
					(_T("darkSeaGreen") == strValue) || 
					(_T("darkSlateBlue") == strValue) || 
					(_T("darkSlateGray") == strValue) || 
					(_T("darkSlateGrey") == strValue) || 
					(_T("darkTurquoise") == strValue) || 
					(_T("darkViolet") == strValue) || 
					(_T("deepPink") == strValue) || 
					(_T("deepSkyBlue") == strValue) || 
					(_T("dimGray") == strValue) || 
					(_T("dimGrey") == strValue) || 
					(_T("dkBlue") == strValue) || 
					(_T("dkCyan") == strValue) || 
					(_T("dkGoldenrod") == strValue) || 
					(_T("dkGray") == strValue) || 
					(_T("dkGreen") == strValue) || 
					(_T("dkGrey") == strValue) || 
					(_T("dkKhaki") == strValue) || 
					(_T("dkMagenta") == strValue) || 
					(_T("dkOliveGreen") == strValue) || 
					(_T("dkOrange") == strValue) || 
					(_T("dkOrchid") == strValue) || 
					(_T("dkRed") == strValue) || 
					(_T("dkSalmon") == strValue) || 
					(_T("dkSeaGreen") == strValue) || 
					(_T("dkSlateBlue") == strValue) || 
					(_T("dkSlateGray") == strValue) || 
					(_T("dkSlateGrey") == strValue) || 
					(_T("dkTurquoise") == strValue) || 
					(_T("dkViolet") == strValue) || 
					(_T("dodgerBlue") == strValue) || 
					(_T("firebrick") == strValue) || 
					(_T("floralWhite") == strValue) || 
					(_T("forestGreen") == strValue) || 
					(_T("fuchsia") == strValue) || 
					(_T("gainsboro") == strValue) || 
					(_T("ghostWhite") == strValue) || 
					(_T("gold") == strValue) || 
					(_T("goldenrod") == strValue) || 
					(_T("gray") == strValue) || 
					(_T("green") == strValue) || 
					(_T("greenYellow") == strValue) || 
					(_T("grey") == strValue) || 
					(_T("honeydew") == strValue) || 
					(_T("hotPink") == strValue) || 
					(_T("indianRed") == strValue) || 
					(_T("indigo") == strValue) || 
					(_T("ivory") == strValue) || 
					(_T("khaki") == strValue) || 
					(_T("lavender") == strValue) || 
					(_T("lavenderBlush") == strValue) || 
					(_T("lawnGreen") == strValue) || 
					(_T("lemonChiffon") == strValue) || 
					(_T("lightBlue") == strValue) || 
					(_T("lightCoral") == strValue) || 
					(_T("lightCyan") == strValue) || 
					(_T("lightGoldenrodYellow") == strValue) || 
					(_T("lightGray") == strValue) || 
					(_T("lightGreen") == strValue) || 
					(_T("lightGrey") == strValue) || 
					(_T("lightPink") == strValue) || 
					(_T("lightSalmon") == strValue) || 
					(_T("lightSeaGreen") == strValue) || 
					(_T("lightSkyBlue") == strValue) || 
					(_T("lightSlateGray") == strValue) || 
					(_T("lightSlateGrey") == strValue) || 
					(_T("lightSteelBlue") == strValue) || 
					(_T("lightYellow") == strValue) || 
					(_T("lime") == strValue) || 
					(_T("limeGreen") == strValue) || 
					(_T("linen") == strValue) || 
					(_T("ltBlue") == strValue) || 
					(_T("ltCoral") == strValue) || 
					(_T("ltCyan") == strValue) || 
					(_T("ltGoldenrodYellow") == strValue) || 
					(_T("ltGray") == strValue) || 
					(_T("ltGreen") == strValue) || 
					(_T("ltGrey") == strValue) || 
					(_T("ltPink") == strValue) || 
					(_T("ltSalmon") == strValue) || 
					(_T("ltSeaGreen") == strValue) || 
					(_T("ltSkyBlue") == strValue) || 
					(_T("ltSlateGray") == strValue) || 
					(_T("ltSlateGrey") == strValue) || 
					(_T("ltSteelBlue") == strValue) || 
					(_T("ltYellow") == strValue) || 
					(_T("magenta") == strValue) || 
					(_T("maroon") == strValue) || 
					(_T("medAquamarine") == strValue) || 
					(_T("medBlue") == strValue) || 
					(_T("mediumAquamarine") == strValue) || 
					(_T("mediumBlue") == strValue) || 
					(_T("mediumOrchid") == strValue) || 
					(_T("mediumPurple") == strValue) || 
					(_T("mediumSeaGreen") == strValue) || 
					(_T("mediumSlateBlue") == strValue) || 
					(_T("mediumSpringGreen") == strValue) || 
					(_T("mediumTurquoise") == strValue) || 
					(_T("mediumVioletRed") == strValue) || 
					(_T("medOrchid") == strValue) || 
					(_T("medPurple") == strValue) || 
					(_T("medSeaGreen") == strValue) || 
					(_T("medSlateBlue") == strValue) || 
					(_T("medSpringGreen") == strValue) || 
					(_T("medTurquoise") == strValue) || 
					(_T("medVioletRed") == strValue) || 
					(_T("midnightBlue") == strValue) || 
					(_T("mintCream") == strValue) || 
					(_T("mistyRose") == strValue) || 
					(_T("moccasin") == strValue) || 
					(_T("navajoWhite") == strValue) || 
					(_T("navy") == strValue) || 
					(_T("oldLace") == strValue) || 
					(_T("olive") == strValue) || 
					(_T("oliveDrab") == strValue) || 
					(_T("orange") == strValue) || 
					(_T("orangeRed") == strValue) || 
					(_T("orchid") == strValue) || 
					(_T("paleGoldenrod") == strValue) || 
					(_T("paleGreen") == strValue) || 
					(_T("paleTurquoise") == strValue) || 
					(_T("paleVioletRed") == strValue) || 
					(_T("papayaWhip") == strValue) || 
					(_T("peachPuff") == strValue) || 
					(_T("peru") == strValue) || 
					(_T("pink") == strValue) || 
					(_T("plum") == strValue) || 
					(_T("powderBlue") == strValue) || 
					(_T("purple") == strValue) || 
					(_T("red") == strValue) || 
					(_T("rosyBrown") == strValue) || 
					(_T("royalBlue") == strValue) || 
					(_T("saddleBrown") == strValue) || 
					(_T("salmon") == strValue) || 
					(_T("sandyBrown") == strValue) || 
					(_T("seaGreen") == strValue) || 
					(_T("seaShell") == strValue) || 
					(_T("sienna") == strValue) || 
					(_T("silver") == strValue) || 
					(_T("skyBlue") == strValue) || 
					(_T("slateBlue") == strValue) || 
					(_T("slateGray") == strValue) || 
					(_T("slateGrey") == strValue) || 
					(_T("snow") == strValue) || 
					(_T("springGreen") == strValue) || 
					(_T("steelBlue") == strValue) || 
					(_T("tan") == strValue) || 
					(_T("teal") == strValue) || 
					(_T("thistle") == strValue) || 
					(_T("tomato") == strValue) || 
					(_T("turquoise") == strValue) || 
					(_T("violet") == strValue) || 
					(_T("wheat") == strValue) || 
					(_T("white") == strValue) || 
					(_T("whiteSmoke") == strValue) || 
					(_T("yellow") == strValue) || 
					(_T("yellowGreen") == strValue)) 
				{
					m_strValue = strValue;
				}
			}
		};
	} 
} 

#endif // PPTX_LIMIT_PRSTCLRVAL_INCLUDE_H_