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


class CBlockArcType : public CPPTShape
{
public:
	CBlockArcType()

    {
        m_bConcentricFill = false;
		m_eJoin = NSOfficeDrawing::lineJoinMiter;
        m_strPath = _T("al10800,10800@0@0@2@14,10800,10800,10800,10800@3@15xe");
		
		AddGuide(_T("val #1"));
        AddGuide(_T("val #0"));
        AddGuide(_T("sum 0 0 #0"));
        AddGuide(_T("sumangle #0 0 180"));
        AddGuide(_T("sumangle #0 0 90"));
        AddGuide(_T("prod @4 2 1"));
        AddGuide(_T("sumangle #0 90 0"));
        AddGuide(_T("prod @6 2 1"));
        AddGuide(_T("abs #0"));
        AddGuide(_T("sumangle @8 0 90"));
        AddGuide(_T("if @9 @7 @5"));
        AddGuide(_T("sumangle @10 0 360"));
        AddGuide(_T("if @10 @11 @10"));
        AddGuide(_T("sumangle @12 0 360"));
        AddGuide(_T("if @12 @13 @12"));
        AddGuide(_T("sum 0 0 @14"));
        AddGuide(_T("val 10800"));
        AddGuide(_T("sum 10800 0 #1"));
        AddGuide(_T("prod #1 1 2"));
        AddGuide(_T("sum @18 5400 0"));
        AddGuide(_T("cos @19 #0"));
        AddGuide(_T("sin @19 #0"));
        AddGuide(_T("sum @20 10800 0"));
        AddGuide(_T("sum @21 10800 0"));
        AddGuide(_T("sum 10800 0 @20"));
        AddGuide(_T("sum #1 10800 0"));
        AddGuide(_T("if @9 @17 @25"));
        AddGuide(_T("if @9 0 21600"));
        AddGuide(_T("cos 10800 #0"));
        AddGuide(_T("sin 10800 #0"));
        AddGuide(_T("sin #1 #0"));
        AddGuide(_T("sum @28 10800 0"));
        AddGuide(_T("sum @29 10800 0"));
        AddGuide(_T("sum @30 10800 0"));
        AddGuide(_T("if @4 0 @31"));
        AddGuide(_T("if #0 @34 0"));
        AddGuide(_T("if @6 @35 @31"));
        AddGuide(_T("sum 21600 0 @36"));
        AddGuide(_T("if @4 0 @33"));
        AddGuide(_T("if #0 @38 @32"));
        AddGuide(_T("if @6 @39 0"));
        AddGuide(_T("if @4 @32 21600"));
        AddGuide(_T("if @6 @41 @33"));

		m_arAdjustments.Add(11796480);
		m_arAdjustments.Add(5400);

		LoadConnectorsList(_T("10800,@27;@22,@23;10800,@26;@24,@23"));

		LoadTextRect(_T("@36,@40,@37,@42"));

		CHandle_ oHandle1;
		oHandle1.position = _T("#1,#0");
		oHandle1.polar = _T("10800,10800");
        oHandle1.radiusrange = _T("0,10800"); 
        oHandle1.switchHandle = _T("true");
        oHandle1.xrange = _T("0,10800");
		m_arHandles.Add(oHandle1);
    }
};
