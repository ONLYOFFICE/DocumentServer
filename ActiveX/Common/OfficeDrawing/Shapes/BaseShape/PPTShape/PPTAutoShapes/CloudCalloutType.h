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


class CCloudCalloutType : public CPPTShape
{
public:
	CCloudCalloutType()

    {
        m_bConcentricFill = false;
        m_eJoin = NSOfficeDrawing::lineJoinRound;

        m_strPath = _T("ar,7165,4345,13110,1950,7185,1080,12690,475,11732,4835,17650,1080,12690,2910,17640,2387,9757,10107,20300,2910,17640,8235,19545,7660,12382,14412,21597,8235,19545,14280,18330,12910,11080,18695,18947,14280,18330,18690,15045,14822,5862,21597,15082,18690,15045,20895,7665,15772,2592,21105,9865,20895,7665,19140,2715,14330,,19187,6595,19140,2715,14910,1170,10992,,15357,5945,14910,1170,11250,1665,6692,650,12025,7917,11250,1665,7005,2580,1912,1972,8665,11162,7005,2580,1950,7185xear,7165,4345,13110,1080,12690,2340,13080nfear475,11732,4835,17650,2910,17640,3465,17445nfear7660,12382,14412,21597,7905,18675,8235,19545nfear7660,12382,14412,21597,14280,18330,14400,17370nfear12910,11080,18695,18947,18690,15045,17070,11475nfear15772,2592,21105,9865,20175,9015,20895,7665nfear14330,,19187,6595,19200,3345,19140,2715nfear14330,,19187,6595,14910,1170,14550,1980nfear10992,,15357,5945,11250,1665,11040,2340nfear1912,1972,8665,11162,7650,3270,7005,2580nfear1912,1972,8665,11162,1950,7185,2070,7890nfem@23@37qx@35@24@23@36@34@24@23@37xem@16@33qx@31@17@16@32@30@17@16@33xem@38@29qx@27@39@38@28@26@39@38@29xe");

        AddGuide(_T("sum #0 0 10800"));
        AddGuide(_T("sum #1 0 10800"));
        AddGuide(_T("cosatan2 10800 @0 @1"));
        AddGuide(_T("sinatan2 10800 @0 @1"));
        AddGuide(_T("sum @2 10800 0"));
        AddGuide(_T("sum @3 10800 0"));
        AddGuide(_T("sum @4 0 #0"));
        AddGuide(_T("sum @5 0 #1"));
        AddGuide(_T("mod @6 @7 0"));
        AddGuide(_T("prod 600 11 1"));
        AddGuide(_T("sum @8 0 @9"));
        AddGuide(_T("prod @10 1 3"));
        AddGuide(_T("prod 600 3 1"));
        AddGuide(_T("sum @11 @12 0"));
        AddGuide(_T("prod @13 @6 @8"));
        AddGuide(_T("prod @13 @7 @8"));
        AddGuide(_T("sum @14 #0 0"));
        AddGuide(_T("sum @15 #1 0"));
        AddGuide(_T("prod 600 8 1"));
        AddGuide(_T("prod @11 2 1"));
        AddGuide(_T("sum @18 @19 0"));
        AddGuide(_T("prod @20 @6 @8"));
        AddGuide(_T("prod @20 @7 @8"));
        AddGuide(_T("sum @21 #0 0"));
        AddGuide(_T("sum @22 #1 0"));
        AddGuide(_T("prod 600 2 1"));
        AddGuide(_T("sum #0 600 0"));
        AddGuide(_T("sum #0 0 600"));
        AddGuide(_T("sum #1 600 0"));
        AddGuide(_T("sum #1 0 600"));
        AddGuide(_T("sum @16 @25 0"));
        AddGuide(_T("sum @16 0 @25"));
        AddGuide(_T("sum @17 @25 0"));
        AddGuide(_T("sum @17 0 @25"));
        AddGuide(_T("sum @23 @12 0"));
        AddGuide(_T("sum @23 0 @12"));
        AddGuide(_T("sum @24 @12 0"));
        AddGuide(_T("sum @24 0 @12"));
        AddGuide(_T("val #0"));
        AddGuide(_T("val #1"));

        m_arAdjustments.Add(1350);
		m_arAdjustments.Add(25920);

        LoadConnectorsList(_T("67,10800;10800,21577;21582,10800;10800,1235;@38,@39"));
        LoadTextRect(_T("2977,3262,17087,17337"));

        CHandle_ oHandle1;
        oHandle1.position = _T("#0,#1");
        m_arHandles.Add(oHandle1);
    }
};