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


class CRightArrowType : public CPPTShape
{
public:
	CRightArrowType()

    {
        m_bConcentricFill = false;
        m_eJoin = NSOfficeDrawing::lineJoinMiter;

        m_strPath = _T("m@0,l@0@1,0@1,0@2@0@2@0,21600,21600,10800xe");

        AddGuide(_T("val #0"));
        AddGuide(_T("val #1"));
        AddGuide(_T("sum height 0 #1"));
        AddGuide(_T("sum 10800 0 #1"));
        AddGuide(_T("sum width 0 #0"));
        AddGuide(_T("prod @4 @3 10800"));
        AddGuide(_T("sum width 0 @5"));

        m_arAdjustments.Add(16200);
		m_arAdjustments.Add(5400);

        LoadConnectorsList(_T("@0,0;0,10800;@0,21600;21600,10800"));

        m_arConnectorAngles.Add(270);
		m_arConnectorAngles.Add(180);
		m_arConnectorAngles.Add(90);
		m_arConnectorAngles.Add(0);

        LoadTextRect(_T("0,@1,@6,@2"));

        CHandle_ oHandle1;
        oHandle1.position = _T("#0,#1");
        oHandle1.xrange = _T("0,21600");
        oHandle1.yrange = _T("0,10800");
        m_arHandles.Add(oHandle1);
    }
};
