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


class CEllipceRibbon2Type : public CPPTShape
{
public:
	CEllipceRibbon2Type()

    {
        m_bConcentricFill = false;
        m_eJoin = NSOfficeDrawing::lineJoinMiter;
        

        m_strPath = _T("wr@9@34@8@35,0@24@0@23@9,0@8@11@0@22@19@22@9@34@8@35@19@23@3@24l@7@36@3@4at@9@31@8@32@3@4@18@30@9@1@8@33@18@28@17@28@9@31@8@32@17@30,0@4l@5@36xear@9@1@8@33@17@28@0@29nfl@17@30ewr@9@1@8@33@18@28@19@29nfl@18@30em@0@23nfl@0@29em@19@23nfl@19@29e");

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
		AddGuide(_T("prod #2 30573 4096"));  
		AddGuide(_T("prod @10 2 1"));  
		AddGuide(_T("sum @10 height #2")); 
		AddGuide(_T("sum @10 #1 0"));  
		AddGuide(_T("prod #1 1 2"));
		AddGuide(_T("sum @10 @14 0"));
		AddGuide(_T("sum @12 0 #1"));
		AddGuide(_T("sum #0 @5 0"));
		AddGuide(_T("sum width 0 @17"));  
		AddGuide(_T("sum width 0 #0"));  
		AddGuide(_T("sum @6 0 #0"));  
		AddGuide(_T("ellipse @20 width @10"));  
		AddGuide(_T("sum @10 0 @21"));  
		AddGuide(_T("sum @22 @16 @10"));  
		AddGuide(_T("sum #2 @16 @10"));  
		AddGuide(_T("prod @10 2391 32768"));  
		AddGuide(_T("sum @6 0 @17"));  
		AddGuide(_T("ellipse @26 width @10"));  
		AddGuide(_T("sum @10 #1 @27"));  
		AddGuide(_T("sum @22 #1 0"));  
		AddGuide(_T("sum @12 0 @27")); 
		AddGuide(_T("sum height 0 #2"));  
		AddGuide(_T("sum @10 @12 0")); 
		AddGuide(_T("sum @32 @10 @16"));  
		AddGuide(_T("sum @31 @10 @13"));  
		AddGuide(_T("sum @32 @10 @13"));  
		AddGuide(_T("sum @25 @12 @15"));  
		AddGuide(_T("sum @16 0 @15"));  
		AddGuide(_T("prod @37 2 3"));  
		AddGuide(_T("sum @1 @38 0"));  
		AddGuide(_T("sum #2 @38 0"));  
		AddGuide(_T("max @40 675"));  
		AddGuide(_T("prod width 3 8"));  
		AddGuide(_T("sum @42 0 4")); 

        m_arAdjustments.Add(5400);
		m_arAdjustments.Add(16200);
		m_arAdjustments.Add(2700);

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
