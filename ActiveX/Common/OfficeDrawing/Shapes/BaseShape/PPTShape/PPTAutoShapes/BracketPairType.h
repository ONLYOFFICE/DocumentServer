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


class CBracketPairType : public CPPTShape
{
public:
	CBracketPairType()

    {
        m_bConcentricFill = true;
        m_eJoin = NSOfficeDrawing::lineJoinRound;
        

        m_strPath = _T("m@0,nfqx0@0l0@2qy@0,21600em@1,nfqx21600@0l21600@2qy@1,21600em@0,nsqx0@0l0@2qy@0,21600l@1,21600qx21600@2l21600@0qy@1,xe");

        AddGuide(_T("val #0"));
        AddGuide(_T("sum width 0 #0"));
        AddGuide(_T("sum height 0 #0"));
        AddGuide(_T("prod @0 2929 10000"));
        AddGuide(_T("sum width 0 @3"));
        AddGuide(_T("sum height 0 @3"));
        AddGuide(_T("val width"));
        AddGuide(_T("val height"));
        AddGuide(_T("prod width 1 2"));
        AddGuide(_T("prod height 1 2"));
        
		m_arAdjustments.Add(3600);

        LoadConnectorsList(_T("@8,0;0,@9;@8,@7;@6,@9"));
        LoadTextRect(_T("@3,@3,@4,@5"));

        CHandle_ oHandle1;
        oHandle1.position = _T("#0,topLeft");
        oHandle1.switchHandle = _T("true");
        oHandle1.xrange = _T("0,10800");
        m_arHandles.Add(oHandle1);

        m_lLimoX = 10800;
		m_lLimoY = 10800;
    }
};
