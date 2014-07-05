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


class CCircularArrowType : public CPPTShape
{
public:
	CCircularArrowType()
	{
		m_bConcentricFill = false;
		m_eJoin = NSOfficeDrawing::lineJoinMiter;
		m_strPath = _T("al10800,10800@8@8@4@6,10800,10800,10800,10800@9@7l@30@31@17@18@24@25@15@16@32@33xe"); 

		AddGuide(_T("val #1")); 
		AddGuide(_T("val #0")); 
		AddGuide(_T("sum #1 0 #0")); 
		AddGuide(_T("val 10800")); 
		AddGuide(_T("sum 0 0 #1")); 
		AddGuide(_T("sumangle @2 360 0")); 
		AddGuide(_T("if @2 @2 @5")); 
		AddGuide(_T("sum 0 0 @6")); 
		AddGuide(_T("val #2")); 
		AddGuide(_T("sum 0 0 #0"));
		AddGuide(_T("sum #2 0 2700")); 
		AddGuide(_T("cos @10 #1"));
		AddGuide(_T("sin @10 #1"));
		AddGuide(_T("cos 13500 #1")); 
		AddGuide(_T("sin 13500 #1"));
		AddGuide(_T("sum @11 10800 0")); 
		AddGuide(_T("sum @12 10800 0"));
		AddGuide(_T("sum @13 10800 0"));
		AddGuide(_T("sum @14 10800 0"));
		AddGuide(_T("prod #2 1 2 "));
		AddGuide(_T("sum @19 5400 0")); 
		AddGuide(_T("cos @20 #1")); 
		AddGuide(_T("sin @20 #1")); 
		AddGuide(_T("sum @21 10800 0"));
		AddGuide(_T("sum @12 @23 @22")); 
		AddGuide(_T("sum @22 @23 @11")); 
		AddGuide(_T("cos 10800 #1")); 
		AddGuide(_T("sin 10800 #1")); 
		AddGuide(_T("cos #2 #1"));
		AddGuide(_T("sin #2 #1"));
		AddGuide(_T("sum @26 10800 0")); 
		AddGuide(_T("sum @27 10800 0")); 
		AddGuide(_T("sum @28 10800 0")); 
		AddGuide(_T("sum @29 10800 0")); 
		AddGuide(_T("sum @19 5400 0 "));
		AddGuide(_T("cos @34 #0"));
		AddGuide(_T("sin @34 #0"));
		AddGuide(_T("mid #0 #1"));
		AddGuide(_T("sumangle @37 180 0"));
		AddGuide(_T("if @2 @37 @38")); 
		AddGuide(_T("cos 10800 @39"));
		AddGuide(_T("sin 10800 @39"));
		AddGuide(_T("cos #2 @39"));
		AddGuide(_T("sin #2 @39"));
		AddGuide(_T("sum @40 10800 0")); 
		AddGuide(_T("sum @41 10800 0"));
		AddGuide(_T("sum @42 10800 0"));
		AddGuide(_T("sum @43 10800 0"));
		AddGuide(_T("sum @35 10800 0"));
		AddGuide(_T("sum @36 10800 0"));

		m_arAdjustments.Add(-11796480);
		m_arAdjustments.Add(0);
		m_arAdjustments.Add(5400);
		
		LoadConnectorsList(_T("@44,@45;@48,@49;@46,@47;@17,@18;@24,@25;@15,@16"));
		LoadTextRect(_T("3163,3163,18437,18437"));

		CHandle_ oHandle1;
		oHandle1.position = _T("@3,#0");
		oHandle1.polar = _T("10800,10800");
		m_arHandles.Add(oHandle1);

		CHandle_ oHandle2;
		oHandle2.position = _T("#2,#1");
		oHandle2.polar = _T("10800,10800");
		oHandle2.radiusrange = _T("0,10800");
		m_arHandles.Add(oHandle2);
	}
};


