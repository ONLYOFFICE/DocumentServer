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


class CEllipceRibbonType : public CPPTShape
{
public:
	CEllipceRibbonType()

    {
        m_bConcentricFill = false;
        m_eJoin = NSOfficeDrawing::lineJoinMiter;
        

        m_strPath = _T("ar@9@38@8@37,0@27@0@26@9@13@8@4@0@25@22@25@9@38@8@37@22@26@3@27l@7@40@3,wa@9@35@8@10@3,0@21@33@9@36@8@1@21@31@20@31@9@35@8@10@20@33,,l@5@40xewr@9@36@8@1@20@31@0@32nfl@20@33ear@9@36@8@1@21@31@22@32nfl@21@33em@0@26nfl@0@32em@22@26nfl@22@32e");

		AddGuide(_T("val #0"));
		AddGuide(_T("val #1"));  
		AddGuide(_T("val #2"));  
		AddGuide(_T("val width"));  
		AddGuide(_T("val height"));  
		AddGuide(_T("prod width 1 8"));  
		AddGuide(_T("prod width 1 2"));  
		AddGuide(_T("prod width 7 8"));  
		AddGuide(_T("prod width 3 2"));  
		AddGuide(_T("sum 0 0 @6"));  
		AddGuide(_T("sum height 0 #2"));  
		AddGuide(_T("prod @10 30573 4096"));  
		AddGuide(_T("prod @11 2 1"));  
		AddGuide(_T("sum height 0 @12"));  
		AddGuide(_T("sum @11 #2 0"));  
		AddGuide(_T("sum @11 height #1"));  
		AddGuide(_T("sum height 0 #1"));  
		AddGuide(_T("prod @16 1 2"));  
		AddGuide(_T("sum @11 @17 0"));  
		AddGuide(_T("sum @14 #1 height"));  
		AddGuide(_T("sum #0 @5 0"));  
		AddGuide(_T("sum width 0 @20"));  
		AddGuide(_T("sum width 0 #0"));  
		AddGuide(_T("sum @6 0 #0"));  
		AddGuide(_T("ellipse @23 width @11"));  
		AddGuide(_T("sum @24 height @11"));  
		AddGuide(_T("sum @25 @11 @19"));  
		AddGuide(_T("sum #2 @11 @19"));  
		AddGuide(_T("prod @11 2391 32768"));  
		AddGuide(_T("sum @6 0 @20"));  
		AddGuide(_T("ellipse @29 width @11"));  
		AddGuide(_T("sum #1 @30 @11"));  
		AddGuide(_T("sum @25 #1 height"));  
		AddGuide(_T("sum height @30 @14"));  
		AddGuide(_T("sum @11 @14 0"));  
		AddGuide(_T("sum height 0 @34"));  
		AddGuide(_T("sum @35 @19 @11"));  
		AddGuide(_T("sum @10 @15 @11")); 
		AddGuide(_T("sum @35 @15 @11"));  
		AddGuide(_T("sum @28 @14 @18"));  
		AddGuide(_T("sum height 0 @39"));  
		AddGuide(_T("sum @19 0 @18"));  
		AddGuide(_T("prod @41 2 3"));  
		AddGuide(_T("sum #1 0 @42"));  
		AddGuide(_T("sum #2 0 @42"));  
		AddGuide(_T("min @44 20925"));  
		AddGuide(_T("prod width 3 8"));  
		AddGuide(_T("sum @46 0 4"));

        m_arAdjustments.Add(5400);
		m_arAdjustments.Add(5400);
		m_arAdjustments.Add(18900);

        LoadConnectorsList(_T("@6,0;@5,@36;@6,@1;@7,@36"));
        LoadTextRect(_T("@0,@22,@19,@1"));

		m_arConnectorAngles.Add(270);
		m_arConnectorAngles.Add(180);
		m_arConnectorAngles.Add(90);
		m_arConnectorAngles.Add(0);

		CHandle_ oHandle1;
        oHandle1.position = _T("topLeft,#0");
        oHandle1.xrange = _T("@5,@43");
        m_arHandles.Add(oHandle1);

		CHandle_ oHandle2;
        oHandle2.position = _T("center,#1");
        oHandle2.yrange = _T("@39,@31");
        m_arHandles.Add(oHandle2);

		CHandle_ oHandle3;
        oHandle3.position = _T("topLeft,#2");
        oHandle3.yrange = _T("@41,@24 ");
        m_arHandles.Add(oHandle3);
    }
};