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


class CSeal32Type : public CPPTShape
{
public:
	CSeal32Type()

    {
        m_bConcentricFill = true;
        m_eJoin = NSOfficeDrawing::lineJoinMiter;
        m_strPath = _T("m21600,10800l@9@18,21392,8693@11@20,20777,6667@13@22,19780,4800@15@24,18436,3163@16@23,16800,1820@14@21,14932,822@12@19,12907,208@10@17,10800,0@18@17,8693,208@20@19,6667,822@22@21,4800,1820@24@23,3163,3163@23@24,1820,4800@21@22,822,6667@19@20,208,8693@17@18,,10800@17@10,208,12907@19@12,822,14932@21@14,1820,16800@23@16,3163,18436@24@15,4800,19780@22@13,6667,20777@20@11,8693,21392@18@9,10800,21600@10@9,12907,21392@12@11,14932,20777@14@13,16800,19780@16@15,18436,18436@15@16,19780,16800@13@14,20777,14932@11@12,21392,12907@9@10xe");

		AddGuide(_T("sum 10800 0 #0")); 
        AddGuide(_T("prod @0 32610 32768")); 
        AddGuide(_T("prod @0 3212 32768")); 
        AddGuide(_T("prod @0 31357 32768")); 
        AddGuide(_T("prod @0 9512 32768")); 
        AddGuide(_T("prod @0 28899 32768")); 
        AddGuide(_T("prod @0 15447 32768")); 
        AddGuide(_T("prod @0 25330 32768")); 
        AddGuide(_T("prod @0 20788 32768")); 
        AddGuide(_T("sum @1 10800 0")); 
        AddGuide(_T("sum @2 10800 0")); 
        AddGuide(_T("sum @3 10800 0")); 
        AddGuide(_T("sum @4 10800 0")); 
        AddGuide(_T("sum @5 10800 0")); 
        AddGuide(_T("sum @6 10800 0")); 
        AddGuide(_T("sum @7 10800 0")); 
        AddGuide(_T("sum @8 10800 0")); 
        AddGuide(_T("sum 10800 0 @1")); 
        AddGuide(_T("sum 10800 0 @2")); 
        AddGuide(_T("sum 10800 0 @3")); 
        AddGuide(_T("sum 10800 0 @4")); 
        AddGuide(_T("sum 10800 0 @5")); 
        AddGuide(_T("sum 10800 0 @6")); 
        AddGuide(_T("sum 10800 0 @7")); 
        AddGuide(_T("sum 10800 0 @8")); 
        AddGuide(_T("prod @0 23170 32768")); 
        AddGuide(_T("sum @25 10800 0"));
        AddGuide(_T("sum 10800 0 @25"));

		m_arAdjustments.Add(2700);

        LoadConnectorsList(_T("Rectangle"));
        LoadTextRect(_T("@27,@27,@26,@26"));

        CHandle_ oHandle1;
        oHandle1.position = _T("#0,center");
        oHandle1.xrange = _T("0,10800");
        m_arHandles.Add(oHandle1);
    }
};


