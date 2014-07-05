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


class CSeal24Type : public CPPTShape
{
public:
	CSeal24Type()

    {
        m_bConcentricFill = true;
        m_eJoin = NSOfficeDrawing::lineJoinMiter;
        m_strPath = _T("m21600,10800l@7@14,21232,8005@9@16,20153,5400@11@18,18437,3163@12@17,16200,1447@10@15,13595,368@8@13,10800,0@14@13,8005,368@16@15,5400,1447@18@17,3163,3163@17@18,1447,5400@15@16,368,8005@13@14,,10800@13@8,368,13595@15@10,1447,16200@17@12,3163,18437@18@11,5400,20153@16@9,8005,21232@14@7,10800,21600@8@7,13595,21232@10@9,16200,20153@12@11,18437,18437@11@12,20153,16200@9@10,21232,13595@7@8xe");

        AddGuide(_T("sum 10800 0 #0")); 
        AddGuide(_T("prod @0 32488 32768")); 
        AddGuide(_T("prod @0 4277 32768")); 
        AddGuide(_T("prod @0 30274 32768")); 
        AddGuide(_T("prod @0 12540 32768")); 
        AddGuide(_T("prod @0 25997 32768")); 
        AddGuide(_T("prod @0 19948 32768")); 
        AddGuide(_T("sum @1 10800 0")); 
        AddGuide(_T("sum @2 10800 0")); 
        AddGuide(_T("sum @3 10800 0")); 
        AddGuide(_T("sum @4 10800 0")); 
        AddGuide(_T("sum @5 10800 0")); 
        AddGuide(_T("sum @6 10800 0")); 
        AddGuide(_T("sum 10800 0 @1")); 
        AddGuide(_T("sum 10800 0 @2")); 
        AddGuide(_T("sum 10800 0 @3")); 
        AddGuide(_T("sum 10800 0 @4")); 
        AddGuide(_T("sum 10800 0 @5")); 
        AddGuide(_T("sum 10800 0 @6")); 
        AddGuide(_T("prod @0 23170 32768")); 
        AddGuide(_T("sum @19 10800 0"));
        AddGuide(_T("sum 10800 0 @19"));

		m_arAdjustments.Add(2700);

        LoadConnectorsList(_T("Rectangle"));
        LoadTextRect(_T("@21,@21,@20,@20"));

        CHandle_ oHandle1;
        oHandle1.position = _T("#0,center");
        oHandle1.xrange = _T("0,10800");
        m_arHandles.Add(oHandle1);
    }
};


