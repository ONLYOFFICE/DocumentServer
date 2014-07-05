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


class CCurvedUpArrowType : public CPPTShape
{
public:
	CCurvedUpArrowType()

    {
        m_bConcentricFill = false;
        m_eJoin = NSOfficeDrawing::lineJoinMiter;
        m_strPath = _T("ar0@22@3@21,,0@4@21@14@22@1@21@7@21@12@2l@13@2@8,0@11@2wa0@22@3@21@10@2@16@24@14@22@1@21@16@24@14,xewr@14@22@1@21@7@21@16@24nfe");

        AddGuide(_T("val #0"));  
        AddGuide(_T("val #1")); 
        AddGuide(_T("val #2")); 
        AddGuide(_T("sum #0 width #1")); 
        AddGuide(_T("prod @3 1 2")); 
        AddGuide(_T("sum #1 #1 width "));
        AddGuide(_T("sum @5 #1 #0")); 
        AddGuide(_T("prod @6 1 2")); 
        AddGuide(_T("mid width #0")); 
        AddGuide(_T("ellipse #2 height @4")); 
        AddGuide(_T("sum @4 @9 0 "));
        AddGuide(_T("sum @10 #1 width")); 
        AddGuide(_T("sum @7 @9 0 "));
        AddGuide(_T("sum @11 width #0 "));
        AddGuide(_T("sum @5 0 #0 "));
        AddGuide(_T("prod @14 1 2 "));
        AddGuide(_T("mid @4 @7 "));
        AddGuide(_T("sum #0 #1 width "));
        AddGuide(_T("prod @17 1 2 "));
        AddGuide(_T("sum @16 0 @18 "));
        AddGuide(_T("val width "));
        AddGuide(_T("val height "));
        AddGuide(_T("sum 0 0 height")); 
        AddGuide(_T("sum @16 0 @4 "));
        AddGuide(_T("ellipse @23 @4 height "));
        AddGuide(_T("sum @8 128 0 "));
        AddGuide(_T("prod @5 1 2 "));
        AddGuide(_T("sum @5 0 128 "));
        AddGuide(_T("sum #0 @16 @11 "));
        AddGuide(_T("sum width 0 #0 "));
        AddGuide(_T("prod @29 1 2 "));
        AddGuide(_T("prod height height 1 "));
        AddGuide(_T("prod #2 #2 1 "));
        AddGuide(_T("sum @31 0 @32 "));
        AddGuide(_T("sqrt @33 "));
        AddGuide(_T("sum @34 height 0 "));
        AddGuide(_T("prod width height @35")); 
        AddGuide(_T("sum @36 64 0 "));
        AddGuide(_T("prod #0 1 2 "));
        AddGuide(_T("ellipse @30 @38 height "));
        AddGuide(_T("sum @39 0 64 "));
        AddGuide(_T("prod @4 1 2"));
        AddGuide(_T("sum #1 0 @41 "));
        AddGuide(_T("prod height 4390 32768"));
        AddGuide(_T("prod height 28378 32768"));

        m_arAdjustments.Add(12960);
		m_arAdjustments.Add(19440);
		m_arAdjustments.Add(7200);

		LoadConnectorsList(_T("@8,0;@11,@2;@15,0;@16,@21;@13,@2"));
        
		m_arConnectorAngles.Add(270);
		m_arConnectorAngles.Add(270);
		m_arConnectorAngles.Add(270);
		m_arConnectorAngles.Add(90);
		m_arConnectorAngles.Add(0);

        LoadTextRect(_T("@41,@43,@42,@44"));
 
        CHandle_ oHandle1;
        oHandle1.position = _T("#0,topLeft");
        oHandle1.xrange = _T("@37,@27");
        m_arHandles.Add(oHandle1);

        CHandle_ oHandle2;
        oHandle1.position = _T("#1,topLeft");
        oHandle1.xrange = _T("@25,@20");
        m_arHandles.Add(oHandle2);

        CHandle_ oHandle3;
        oHandle3.position = _T("bottomRight,#2");
        oHandle3.yrange = _T("0,@40");
        m_arHandles.Add(oHandle3);
    }
};
