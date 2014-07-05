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


class CLeftRightUpArrow : public CPPTShape
{
public:
	CLeftRightUpArrow()

    {
        m_bConcentricFill = false;
        m_eJoin = NSOfficeDrawing::lineJoinMiter;
        m_strPath = _T("m10800,l@0@2@1@2@1@6@7@6@7@5,0@8@7,21600@7@9@10@9@10,21600,21600@8@10@5@10@6@4@6@4@2@3@2xe");

		AddGuide(_T("val #0"));
        AddGuide(_T("val #1"));
        AddGuide(_T("val #2"));
        AddGuide(_T("sum 21600 0 #0"));
        AddGuide(_T("sum 21600 0 #1"));
        AddGuide(_T("prod @0 21600 @3"));
        AddGuide(_T("prod @1 21600 @3"));
        AddGuide(_T("prod @2 @3 21600"));
        AddGuide(_T("prod 10800 21600 @3"));
        AddGuide(_T("prod @4 21600 @3"));
        AddGuide(_T("sum 21600 0 @7"));
        AddGuide(_T("sum @5 0 @8"));
        AddGuide(_T("sum @6 0 @8"));
        AddGuide(_T("prod @12 @7 @11"));
        AddGuide(_T("sum 21600 0 @13"));
        AddGuide(_T("sum @0 0 10800"));
        AddGuide(_T("sum @1 0 10800"));
        AddGuide(_T("prod @2 @16 @15"));

		m_arAdjustments.Add(6480);
		m_arAdjustments.Add(8640);
		m_arAdjustments.Add(6171);

        LoadConnectorsList(_T("10800,0;0,@8;10800,@9;21600,@8"));
        
		m_arConnectorAngles.Add(270);
		m_arConnectorAngles.Add(180);
		m_arConnectorAngles.Add(90);
		m_arConnectorAngles.Add(0);

        LoadTextRect(_T("@13,@6,@14,@9;@1,@17,@4,@9"));
       
        CHandle_ oHandle1;
        oHandle1.position = _T("#0,topLeft");
        oHandle1.xrange = _T("@2,@1");
        m_arHandles.Add(oHandle1);

        CHandle_ oHandle2;
        oHandle2.position = _T("#1,#2");
        oHandle2.xrange = _T("@0,10800");
        oHandle2.yrange = _T("0,@5"); 
        m_arHandles.Add(oHandle2);
    }
};
