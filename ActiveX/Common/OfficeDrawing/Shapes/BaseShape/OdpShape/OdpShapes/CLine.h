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
#include "../OdpShape.h"

namespace OdpShapes
{
	class CLine : public COdpShape
	{
		public:
			CLine()
			{
				LoadFromXML(








					_T("<draw:enhanced-geometry xmlns:draw=\"urn:oasis:names:tc:opendocument:xmlns:drawing:1.0\" xmlns:svg=\"urn:oasis:names:tc:opendocument:xmlns:svg-compatible:1.0\" svg:viewBox=\"0 0 21600 21600\" draw:type=\"non-primitive-line\" draw:modifiers=\"0 0 21600 21600 21600 21600\" draw:enhanced-path=\"M ?f0 ?f1 L ?f4 ?f5 Z N\">")
					  _T("<draw:equation draw:name=\"f0\" draw:formula=\"$0*21600/$4\" />") 
					  _T("<draw:equation draw:name=\"f1\" draw:formula=\"$1*21600/$5\" />") 
					  _T("<draw:equation draw:name=\"f2\" draw:formula=\"$2*21600/$4\" />") 
					  _T("<draw:equation draw:name=\"f3\" draw:formula=\"$3*21600/$5\" />") 
					  _T("<draw:equation draw:name=\"f4\" draw:formula=\"?f0 + ?f2\" />") 
					  _T("<draw:equation draw:name=\"f5\" draw:formula=\"?f1 + ?f3\" />") 
					_T("</draw:enhanced-geometry>")
				);
			}
	};
}