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


class CFlowChartPunchedTapeType : public CPPTShape
{
public:
	CFlowChartPunchedTapeType()

    {
        m_bConcentricFill = false;
        m_eJoin = NSOfficeDrawing::lineJoinMiter;
        m_strPath = _T("m21597,19450v-225,-558,-750,-1073,-1650,-1545c18897,17605,17585,17347,16197,17260v-1500,87,-2700,345,-3787,645c11472,18377,10910,18892,10800,19450v-188,515,-750,1075,-1613,1460c8100,21210,6825,21425,5400,21597,3937,21425,2700,21210,1612,20910,675,20525,150,19965,,19450l,2147v150,558,675,1073,1612,1460c2700,3950,3937,4165,5400,4337,6825,4165,8100,3950,9187,3607v863,-387,1425,-902,1613,-1460c10910,1632,11472,1072,12410,600,13497,300,14697,85,16197,v1388,85,2700,300,3750,600c20847,1072,21372,1632,21597,2147xe"); 
        LoadConnectorsList(_T("10800,2147;0,10800;10800,19450;21600,10800"));
        LoadTextRect(_T("0,4337,21600,17260"));
    }
};


