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


class CQuadArrowType : public CPPTShape
{
public:
	CQuadArrowType()

    {
        m_bConcentricFill = false;
        m_eJoin = NSOfficeDrawing::lineJoinMiter;
        m_strPath = _T("m10800,l@0@2@1@2@1@1@2@1@2@0,,10800@2@3@2@4@1@4@1@5@0@5,10800,21600@3@5@4@5@4@4@5@4@5@3,21600,10800@5@0@5@1@4@1@4@2@3@2xe");

		AddGuide(_T("val #0"));
        AddGuide(_T("val #1"));
        AddGuide(_T("val #2"));
        AddGuide(_T("sum 21600 0 #0"));
        AddGuide(_T("sum 21600 0 #1"));
        AddGuide(_T("sum 21600 0 #2"));
        AddGuide(_T("sum #0 0 10800"));
        AddGuide(_T("sum #1 0 10800"));
        AddGuide(_T("prod @7 #2 @6"));
        AddGuide(_T("sum 21600 0 @8"));

		m_arAdjustments.Add(6480);
		m_arAdjustments.Add(8640);
		m_arAdjustments.Add(4320);

		LoadConnectorsList(_T("Rectangle"));

        LoadTextRect(_T("@8,@1,@9,@4;@1,@8,@4,@9"));
       
        CHandle_ oHandle1;
        oHandle1.position = _T("#0,topLeft");
        oHandle1.xrange = _T("@2,@1");
        m_arHandles.Add(oHandle1);
        
		CHandle_ oHandle2;
        oHandle2.position = _T("#1,#2");
        oHandle2.xrange = _T("@0,10800");
        oHandle2.yrange = _T("0,@0"); 
        m_arHandles.Add(oHandle2);
    }
};
