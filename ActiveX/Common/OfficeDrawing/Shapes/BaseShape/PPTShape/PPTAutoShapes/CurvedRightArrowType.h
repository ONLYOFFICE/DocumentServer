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


class CCurvedRightArrowType : public CPPTShape
{
public:
	CCurvedRightArrowType()

    {
        m_bConcentricFill = false;
        m_eJoin = NSOfficeDrawing::lineJoinMiter;
        m_strPath = _T("ar,0@23@3@22,,0@4,0@15@23@1,0@7@2@13l@2@14@22@8@2@12wa,0@23@3@2@11@26@17,0@15@23@1@26@17@22@15xear,0@23@3,0@4@26@17nfe");

        AddGuide(_T("val #0")); 
        AddGuide(_T("val #1")); 
        AddGuide(_T("val #2")); 
        AddGuide(_T("sum #0 width #1")); 
        AddGuide(_T("prod @3 1 2")); 
        AddGuide(_T("sum #1 #1 width")); 
        AddGuide(_T("sum @5 #1 #0")); 
        AddGuide(_T("prod @6 1 2")); 
        AddGuide(_T("mid width #0")); 
        AddGuide(_T("sum height 0 #2")); 
        AddGuide(_T("ellipse @9 height @4")); 
        AddGuide(_T("sum @4 @10 0")); 
        AddGuide(_T("sum @11 #1 width")); 
        AddGuide(_T("sum @7 @10 0")); 
        AddGuide(_T("sum @12 width #0")); 
        AddGuide(_T("sum @5 0 #0")); 
        AddGuide(_T("prod @15 1 2")); 
        AddGuide(_T("mid @4 @7")); 
        AddGuide(_T("sum #0 #1 width")); 
        AddGuide(_T("prod @18 1 2")); 
        AddGuide(_T("sum @17 0 @19")); 
        AddGuide(_T("val width")); 
        AddGuide(_T("val height")); 
        AddGuide(_T("prod height 2 1")); 
        AddGuide(_T("sum @17 0 @4")); 
        AddGuide(_T("ellipse @24 @4 height")); 
        AddGuide(_T("sum height 0 @25")); 
        AddGuide(_T("sum @8 128 0")); 
        AddGuide(_T("prod @5 1 2")); 
        AddGuide(_T("sum @5 0 128")); 
        AddGuide(_T("sum #0 @17 @12")); 
        AddGuide(_T("ellipse @20 @4 height")); 
        AddGuide(_T("sum width 0 #0")); 
        AddGuide(_T("prod @32 1 2")); 
        AddGuide(_T("prod height height 1")); 
        AddGuide(_T("prod @9 @9 1")); 
        AddGuide(_T("sum @34 0 @35")); 
        AddGuide(_T("sqrt @36")); 
        AddGuide(_T("sum @37 height 0")); 
        AddGuide(_T("prod width height @38")); 
        AddGuide(_T("sum @39 64 0")); 
        AddGuide(_T("prod #0 1 2")); 
        AddGuide(_T("ellipse @33 @41 height")); 
        AddGuide(_T("sum height 0 @42")); 
        AddGuide(_T("sum @43 64 0")); 
        AddGuide(_T("prod @4 1 2")); 
        AddGuide(_T("sum #1 0 @45")); 
        AddGuide(_T("prod height 4390 32768"));
        AddGuide(_T("prod height 28378 32768"));

		m_arAdjustments.Add(12960);
		m_arAdjustments.Add(19440);
		m_arAdjustments.Add(14400);
        
        LoadConnectorsList(_T("0,@17;@2,@14;@22,@8;@2,@12;@22,@16"));
        
		m_arConnectorAngles.Add(180);
		m_arConnectorAngles.Add(90);
		m_arConnectorAngles.Add(0);
		m_arConnectorAngles.Add(0);
		m_arConnectorAngles.Add(0);

        LoadTextRect(_T("@47,@45,@48,@46"));
       
        CHandle_ oHandle1;
        oHandle1.position = _T("bottomRight,#0");
        oHandle1.yrange = _T("@40,@29"); 
        m_arHandles.Add(oHandle1);
        
        CHandle_ oHandle2;
        oHandle1.position = _T("bottomRight,#1"); 
        oHandle1.yrange = _T("@27,@21");  
        m_arHandles.Add(oHandle2);

        CHandle_ oHandle3;
        oHandle3.position = _T("#2,bottomRight");
        oHandle3.xrange = _T("@44,@22");
        m_arHandles.Add(oHandle3);
    }
};
