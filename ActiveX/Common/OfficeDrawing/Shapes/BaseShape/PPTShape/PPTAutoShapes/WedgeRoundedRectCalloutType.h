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


class CWedgeRoundedRectCalloutType : public CPPTShape
{
public:
	CWedgeRoundedRectCalloutType()

    {
        m_bConcentricFill = false;
        m_eJoin = NSOfficeDrawing::lineJoinMiter;
        m_strPath = _T("m3600,qx,3600l0@8@12@24,0@9,,18000qy3600,21600l@6,21600@15@27@7,21600,18000,21600qx21600,18000l21600@9@18@30,21600@8,21600,3600qy18000,l@7,0@21@33@6,xe");

        AddGuide(_T("sum 10800 0 #0"));
        AddGuide(_T("sum 10800 0 #1"));
        AddGuide(_T("sum #0 0 #1"));
        AddGuide(_T("sum @0 @1 0"));
        AddGuide(_T("sum 21600 0 #0"));
        AddGuide(_T("sum 21600 0 #1"));
        AddGuide(_T("if @0 3600 12600"));
        AddGuide(_T("if @0 9000 18000"));
        AddGuide(_T("if @1 3600 12600"));
        AddGuide(_T("if @1 9000 18000"));
        AddGuide(_T("if @2 0 #0"));
        AddGuide(_T("if @3 @10 0"));
        AddGuide(_T("if #0 0 @11"));
        AddGuide(_T("if @2 @6 #0"));
        AddGuide(_T("if @3 @6 @13"));
        AddGuide(_T("if @5 @6 @14"));
        AddGuide(_T("if @2 #0 21600"));
        AddGuide(_T("if @3 21600 @16"));
        AddGuide(_T("if @4 21600 @17"));
        AddGuide(_T("if @2 #0 @6"));
        AddGuide(_T("if @3 @19 @6"));
        AddGuide(_T("if #1 @6 @20"));
        AddGuide(_T("if @2 @8 #1"));
        AddGuide(_T("if @3 @22 @8"));
        AddGuide(_T("if #0 @8 @23"));
        AddGuide(_T("if @2 21600 #1"));
        AddGuide(_T("if @3 21600 @25"));
        AddGuide(_T("if @5 21600 @26"));
        AddGuide(_T("if @2 #1 @8"));
        AddGuide(_T("if @3 @8 @28"));
        AddGuide(_T("if @4 @8 @29"));
        AddGuide(_T("if @2 #1 0"));
        AddGuide(_T("if @3 @31 0"));
        AddGuide(_T("if #1 0 @32"));
        AddGuide(_T("val #0"));
        AddGuide(_T("val #1"));

		m_arAdjustments.Add(1350);
		m_arAdjustments.Add(25920);
        
        LoadConnectorsList(_T("10800,0;0,10800;10800,21600;21600,10800;@34,@35"));
        LoadTextRect(_T("791,791,20809,20809"));

        CHandle_ oHandle1;
        oHandle1.position = _T("#0,#1");
        m_arHandles.Add(oHandle1);
    }
};
