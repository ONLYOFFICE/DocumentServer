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
#include "../PPTShape.h"


class CIrregularSealOneType : public CPPTShape
{
public:
	CIrregularSealOneType()

    {
        m_bConcentricFill = false;
        m_eJoin = NSOfficeDrawing::lineJoinMiter;

        m_strPath = _T("m10800,5800l8352,2295,7312,6320,370,2295,4627,7617,,8615r3722,3160l135,14587r5532,-650l4762,17617,7715,15627r770,5973l10532,14935r2715,4802l14020,14457r4125,3638l16837,12942r4763,348l17607,10475,21097,8137,16702,7315,18380,4457r-4225,868l14522,xe");

        LoadConnectorsList(_T("14522,0;0,8615;8485,21600;21600,13290"));
		
		m_arConnectorAngles.Add(270);
		m_arConnectorAngles.Add(180);
		m_arConnectorAngles.Add(90);
		m_arConnectorAngles.Add(0);

        LoadTextRect(_T("4627,6320,16702,13937"));
    }
};
