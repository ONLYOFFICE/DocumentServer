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


class CVerticalScrollType : public CPPTShape
{
public:
	CVerticalScrollType()

    {
        m_bConcentricFill = false;
        m_eJoin = NSOfficeDrawing::lineJoinMiter;
        

        m_strPath = _T("m@5,qx@1@2l@1@0@2@0qx0@7@2,21600l@9,21600qx@10@7l@10@1@11@1qx21600@2@11,xem@5,nfqx@6@2@5@1@4@3@5@2l@6@2em@5@1nfl@10@1em@2,21600nfqx@1@7l@1@0em@2@0nfqx@3@8@2@7l@1@7e");

		AddGuide(_T("sum height 0 #0"));  
		AddGuide(_T("val #0"));  
		AddGuide(_T("prod @1 1 2")); 
		AddGuide(_T("prod @1 3 4"));
		AddGuide(_T("prod @1 5 4"));
		AddGuide(_T("prod @1 3 2"));
		AddGuide(_T("prod @1 2 1"));
		AddGuide(_T("sum height 0 @2"));  
		AddGuide(_T("sum height 0 @3"));  
		AddGuide(_T("sum width 0 @5"));  
		AddGuide(_T("sum width 0 @1"));  
		AddGuide(_T("sum width 0 @2"));  
		AddGuide(_T("val height"));  
		AddGuide(_T("prod height 1 2"));  
		AddGuide(_T("prod width 1 2"));

        m_arAdjustments.Add(2700);

        LoadConnectorsList(_T("@14,0;@1,@13;@14,@12;@10,@13"));
        LoadTextRect(_T("@1,@1,@10,@7"));

		m_arConnectorAngles.Add(270);
		m_arConnectorAngles.Add(180);
		m_arConnectorAngles.Add(90);
		m_arConnectorAngles.Add(0);

		CHandle_ oHandle1;
        oHandle1.position = _T("topLeft,#0");
        oHandle1.yrange = _T("0,5400");
        m_arHandles.Add(oHandle1);

		m_lLimoX = 10800;
		m_lLimoY = 10800;
    }
};