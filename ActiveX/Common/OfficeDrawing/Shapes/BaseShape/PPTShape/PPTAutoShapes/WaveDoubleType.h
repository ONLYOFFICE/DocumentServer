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


class CWaveDoubleType : public CPPTShape
{
public:
	CWaveDoubleType()

    {
        m_bConcentricFill = false;
        m_eJoin = NSOfficeDrawing::lineJoinMiter;
        

        m_strPath = _T("m@43@0c@42@1@41@3@40@0@39@1@38@3@37@0l@30@4c@31@5@32@6@33@4@34@5@35@6@36@4xe");

		AddGuide(_T("val #0"));  
		AddGuide(_T("prod @0 41 9"));  
		AddGuide(_T("prod @0 23 9"));  
		AddGuide(_T("sum 0 0 @2"));  
		AddGuide(_T("sum 21600 0 #0"));  
		AddGuide(_T("sum 21600 0 @1"));  
		AddGuide(_T("sum 21600 0 @3"));  
		AddGuide(_T("sum #1 0 10800"));  
		AddGuide(_T("sum 21600 0 #1"));  
		AddGuide(_T("prod @8 1 3"));  
		AddGuide(_T("prod @8 2 3"));  
		AddGuide(_T("prod @8 4 3"));  
		AddGuide(_T("prod @8 5 3"));  
		AddGuide(_T("prod @8 2 1"));  
		AddGuide(_T("sum 21600 0 @9"));  
		AddGuide(_T("sum 21600 0 @10")); 
		AddGuide(_T("sum 21600 0 @8"));  
		AddGuide(_T("sum 21600 0 @11"));  
		AddGuide(_T("sum 21600 0 @12"));  
		AddGuide(_T("sum 21600 0 @13")); 
		AddGuide(_T("prod #1 1 3"));  
		AddGuide(_T("prod #1 2 3"));  
		AddGuide(_T("prod #1 4 3"));  
		AddGuide(_T("prod #1 5 3"));  
		AddGuide(_T("prod #1 2 1"));  
		AddGuide(_T("sum 21600 0 @20")); 
		AddGuide(_T("sum 21600 0 @21"));  
		AddGuide(_T("sum 21600 0 @22"));  
		AddGuide(_T("sum 21600 0 @23"));  
		AddGuide(_T("sum 21600 0 @24"));  
		AddGuide(_T("if @7 @19 0"));  
		AddGuide(_T("if @7 @18 @20"));  
		AddGuide(_T("if @7 @17 @21"));
		AddGuide(_T("if @7 @16 #1"));  
		AddGuide(_T("if @7 @15 @22"));  
		AddGuide(_T("if @7 @14 @23"));  
		AddGuide(_T("if @7 21600 @24"));  
		AddGuide(_T("if @7 0 @29"));  
		AddGuide(_T("if @7 @9 @28"));  
		AddGuide(_T("if @7 @10 @27"));  
		AddGuide(_T("if @7 @8 @8"));  
		AddGuide(_T("if @7 @11 @26"));  
		AddGuide(_T("if @7 @12 @25")); 
		AddGuide(_T("if @7 @13 21600"));  
		AddGuide(_T("sum @36 0 @30"));  
		AddGuide(_T("sum @4 0 @0"));  
		AddGuide(_T("max @30 @37")); 
		AddGuide(_T("min @36 @43"));  
		AddGuide(_T("prod @0 2 1"));  
		AddGuide(_T("sum 21600 0 @48"));  
		AddGuide(_T("mid @36 @43"));  
		AddGuide(_T("mid @30 @37"));

        m_arAdjustments.Add(1404);
		m_arAdjustments.Add(10800);

        LoadConnectorsList(_T("@40,@0;@51,10800;@33,@4;@50,10800"));
        LoadTextRect(_T("@46,@48,@47,@49"));

		m_arConnectorAngles.Add(270);
		m_arConnectorAngles.Add(180);
		m_arConnectorAngles.Add(90);
		m_arConnectorAngles.Add(0);

		CHandle_ oHandle1;
        oHandle1.position = _T("topLeft,#0");
        oHandle1.yrange = _T("0,2229");
        m_arHandles.Add(oHandle1);

		CHandle_ oHandle2;
        oHandle2.position = _T("bottomRight,#1");
        oHandle2.xrange = _T("8640,12960");
        m_arHandles.Add(oHandle2);
    }
};