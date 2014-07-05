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


class CRibbonDownType : public CPPTShape
{
public:
	CRibbonDownType()

    {
        m_bConcentricFill = false;
        m_eJoin = NSOfficeDrawing::lineJoinMiter;

        m_strPath = _T("m,l@3,qx@4@11l@4@10@5@10@5@11qy@6,l@21,0@19@15@21@16@9@16@9@17qy@8@22l@1@22qx@0@17l@0@16,0@16,2700@15xem@4@11nfqy@3@12l@1@12qx@0@13@1@10l@4@10em@5@11nfqy@6@12l@8@12qx@9@13@8@10l@5@10em@0@13nfl@0@16em@9@13nfl@9@16e");

        AddGuide(_T("val #0"));
        AddGuide(_T("sum @0 675 0"));
        AddGuide(_T("sum @1 675 0"));
        AddGuide(_T("sum @2 675 0"));
        AddGuide(_T("sum @3 675 0"));
        AddGuide(_T("sum width 0 @4"));
        AddGuide(_T("sum width 0 @3"));
        AddGuide(_T("sum width 0 @2"));
        AddGuide(_T("sum width 0 @1"));
        AddGuide(_T("sum width 0 @0"));
        AddGuide(_T("val #1"));
        AddGuide(_T("prod @10 1 4"));
        AddGuide(_T("prod @11 2 1"));
        AddGuide(_T("prod @11 3 1"));
        AddGuide(_T("prod height 1 2"));
        AddGuide(_T("sum @14 0 @12"));
        AddGuide(_T("sum height 0 @10"));
        AddGuide(_T("sum height 0 @11"));
        AddGuide(_T("prod width 1 2"));
        AddGuide(_T("sum width 0 2700"));
        AddGuide(_T("sum @18 0 2700"));
        AddGuide(_T("val width"));
        AddGuide(_T("val height"));

		m_arAdjustments.Add(5400);
		m_arAdjustments.Add(2700);

        LoadConnectorsList(_T("@18,@10;2700,@15;@18,21600;@19,@15"));
        
        m_arConnectorAngles.Add(270);
		m_arConnectorAngles.Add(180);
		m_arConnectorAngles.Add(90);
		m_arConnectorAngles.Add(0);

        LoadTextRect(_T("@0,@10,@9,21600"));

        CHandle_ oHandle1;
        CHandle_ oHandle2;
        
		oHandle1.position = _T("#0,bottomRight"); 
        oHandle1.xrange = _T("2700,8100");
        oHandle2.position = _T("center,#1");
        oHandle2.yrange = _T("0,7200");
       
		m_arHandles.Add(oHandle1);
        m_arHandles.Add(oHandle2);
    }
};
