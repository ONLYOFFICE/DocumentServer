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


class CSeal16Type : public CPPTShape
{
public:
	CSeal16Type()

    {
        m_bConcentricFill = true;
        m_eJoin = NSOfficeDrawing::lineJoinMiter;
        m_strPath = _T("m21600,10800l@5@10,20777,6667@7@12,18436,3163@8@11,14932,822@6@9,10800,0@10@9,6667,822@12@11,3163,3163@11@12,822,6667@9@10,,10800@9@6,822,14932@11@8,3163,18436@12@7,6667,20777@10@5,10800,21600@6@5,14932,20777@8@7,18436,18436@7@8,20777,14932@5@6xe");

        AddGuide(_T("sum 10800 0 #0")); 
        AddGuide(_T("prod @0 32138 32768")); 
        AddGuide(_T("prod @0 6393 32768")); 
        AddGuide(_T("prod @0 27246 32768")); 
        AddGuide(_T("prod @0 18205 32768")); 
        AddGuide(_T("sum @1 10800 0")); 
        AddGuide(_T("sum @2 10800 0")); 
        AddGuide(_T("sum @3 10800 0")); 
        AddGuide(_T("sum @4 10800 0")); 
        AddGuide(_T("sum 10800 0 @1")); 
        AddGuide(_T("sum 10800 0 @2")); 
        AddGuide(_T("sum 10800 0 @3")); 
        AddGuide(_T("sum 10800 0 @4")); 
        AddGuide(_T("prod @0 23170 32768")); 
        AddGuide(_T("sum @13 10800 0")); 
        AddGuide(_T("sum 10800 0 @13"));

        m_arAdjustments.Add(2700);

        LoadConnectorsList(_T("Rectangle"));
        LoadTextRect(_T("@15,@15,@14,@14"));

        CHandle_ oHandle1;
        oHandle1.position = _T("#0,center");
        oHandle1.xrange = _T("0,10800");
        m_arHandles.Add(oHandle1);
    }
};


