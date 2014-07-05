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


class CBracePairType : public CPPTShape
{
public:
	CBracePairType()

    {
        m_bConcentricFill = false;
        m_eJoin = NSOfficeDrawing::lineJoinMiter;
        

        m_strPath = _T("m@9,nfqx@0@0l@0@7qy0@4@0@8l@0@6qy@9,21600em@10,nfqx@5@0l@5@7qy21600@4@5@8l@5@6qy@10,21600em@9,nsqx@0@0l@0@7qy0@4@0@8l@0@6qy@9,21600l@10,21600qx@5@6l@5@8qy21600@4@5@7l@5@0qy@10,xe");

        AddGuide(_T("val #0"));
        AddGuide(_T("val width"));
        AddGuide(_T("val height"));
        AddGuide(_T("prod width 1 2"));
        AddGuide(_T("prod height 1 2"));
        AddGuide(_T("sum width 0 #0"));
        AddGuide(_T("sum height 0 #0"));
        AddGuide(_T("sum @4 0 #0"));
        AddGuide(_T("sum @4 #0 0"));
        AddGuide(_T("prod #0 2 1"));
        AddGuide(_T("sum width 0 @9"));
        AddGuide(_T("prod #0 9598 32768"));
        AddGuide(_T("sum height 0 @11"));
        AddGuide(_T("sum @11 #0 0"));
        AddGuide(_T("sum width 0 @13"));

        m_arAdjustments.Add(1800);

        LoadConnectorsList(_T("@3,0;0,@4;@3,@2;@1,@4"));
        LoadTextRect(_T("@13,@11,@14,@12"));

        CHandle_ oHandle1;
        oHandle1.position = _T("topLeft,#0");
        oHandle1.switchHandle = _T("true");
        oHandle1.yrange = _T("0,5400");
        m_arHandles.Add(oHandle1);

        m_lLimoX = 10800;
		m_lLimoY = 10800;
    }
};
