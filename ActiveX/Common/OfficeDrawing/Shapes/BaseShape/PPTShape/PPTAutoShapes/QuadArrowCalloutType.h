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


class CQuadArrowCalloutType : public CPPTShape
{
public:
	CQuadArrowCalloutType()

    {
        m_bConcentricFill = false;
        m_eJoin = NSOfficeDrawing::lineJoinMiter;
        m_strPath = _T("m@0@0l@3@0@3@2@1@2,10800,0@4@2@5@2@5@0@8@0@8@3@9@3@9@1,21600,10800@9@4@9@5@8@5@8@8@5@8@5@9@4@9,10800,21600@1@9@3@9@3@8@0@8@0@5@2@5@2@4,,10800@2@1@2@3@0@3xe"); 

        AddGuide(_T("val #0")); 
        AddGuide(_T("val #1")); 
        AddGuide(_T("val #2")); 
        AddGuide(_T("val #3")); 
        AddGuide(_T("sum 21600 0 #1")); 
        AddGuide(_T("sum 21600 0 #3")); 
        AddGuide(_T("sum #0 21600 0")); 
        AddGuide(_T("prod @6 1 2")); 
        AddGuide(_T("sum 21600 0 #0")); 
        AddGuide(_T("sum 21600 0 #2"));
        
		m_arAdjustments.Add(5400);
		m_arAdjustments.Add(8100);
		m_arAdjustments.Add(2700);
		m_arAdjustments.Add(9450);

		LoadConnectorsList(_T("Rectangle"));

        LoadTextRect(_T("@0,@0,@8,@8"));

        CHandle_ oHandle1;
        oHandle1.position = _T("topLeft,#0");
        oHandle1.yrange = _T("@2,@1");
        m_arHandles.Add(oHandle1);

        CHandle_ oHandle2;
        oHandle2.position = _T("#1,topLeft");
        oHandle2.xrange = _T("@0,@3");
        m_arHandles.Add(oHandle2);

        CHandle_ oHandle3;
        oHandle3.position = _T("#3,#2");
        oHandle3.xrange = _T("@1,10800");
        oHandle3.yrange = _T("0,@0");
        m_arHandles.Add(oHandle3);
    }
};


