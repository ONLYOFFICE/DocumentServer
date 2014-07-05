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
#ifndef PPTX_LIMIT_CAMERATYPE_INCLUDE_H_
#define PPTX_LIMIT_CAMERATYPE_INCLUDE_H_

#include "BaseLimit.h"


namespace PPTX
{
	namespace Limit
	{
		class CameraType : public BaseLimit
		{
		public:
			CameraType()
			{
				m_strValue = _T("legacyObliqueFront");
			}

			_USE_STRING_OPERATOR
				
			virtual void CameraType::set(const CString& strValue)
			{
				if ((_T("isometricBottomDown") == strValue) ||
					(_T("isometricBottomUp") == strValue) ||
					(_T("isometricLeftDown") == strValue) ||
					(_T("isometricLeftUp") == strValue) ||
					(_T("isometricOffAxis1Left") == strValue) ||
					(_T("isometricOffAxis1Right") == strValue) ||
					(_T("isometricOffAxis1Top") == strValue) ||
					(_T("isometricOffAxis2Left") == strValue) ||
					(_T("isometricOffAxis2Right") == strValue) ||
					(_T("isometricOffAxis2Top") == strValue) ||
					(_T("isometricOffAxis3Bottom") == strValue) ||
					(_T("isometricOffAxis3Left") == strValue) ||
					(_T("isometricOffAxis3Right") == strValue) ||
					(_T("isometricOffAxis4Bottom") == strValue) ||
					(_T("isometricOffAxis4Left") == strValue) ||
					(_T("isometricOffAxis4Right") == strValue) ||
					(_T("isometricRightDown") == strValue) ||
					(_T("isometricRightUp") == strValue) ||
					(_T("isometricTopDown") == strValue) ||
					(_T("isometricTopUp") == strValue) ||
					(_T("legacyObliqueBottom") == strValue) ||
					(_T("legacyObliqueBottomLeft") == strValue) ||
					(_T("legacyObliqueBottomRight") == strValue) ||
					(_T("legacyObliqueFront") == strValue) ||
					(_T("legacyObliqueLeft") == strValue) ||
					(_T("legacyObliqueRight") == strValue) ||
					(_T("legacyObliqueTop") == strValue) ||
					(_T("legacyObliqueTopLeft") == strValue) ||
					(_T("legacyObliqueTopRight") == strValue) ||
					(_T("legacyPerspectiveBottom") == strValue) ||
					(_T("legacyPerspectiveBottomLeft") == strValue) ||
					(_T("legacyPerspectiveBottomRight") == strValue) ||
					(_T("legacyPerspectiveFront") == strValue) ||
					(_T("legacyPerspectiveLeft") == strValue) ||
					(_T("legacyPerspectiveRight") == strValue) ||
					(_T("legacyPerspectiveTop") == strValue) ||
					(_T("legacyPerspectiveTopLeft") == strValue) ||
					(_T("legacyPerspectiveTopRight") == strValue) ||
					(_T("obliqueBottom") == strValue) ||
					(_T("obliqueBottomLeft") == strValue) ||
					(_T("obliqueBottomRight") == strValue) ||
					(_T("obliqueLeft") == strValue) ||
					(_T("obliqueRight") == strValue) ||
					(_T("obliqueTop") == strValue) ||
					(_T("obliqueTopLeft") == strValue) ||
					(_T("obliqueTopRight") == strValue) ||
					(_T("orthographicFront") == strValue) ||
					(_T("perspectiveAbove") == strValue) ||
					(_T("perspectiveAboveLeftFacing") == strValue) ||
					(_T("perspectiveAboveRightFacing") == strValue) ||
					(_T("perspectiveBelow") == strValue) ||
					(_T("perspectiveContrastingLeftFacing") == strValue) ||
					(_T("perspectiveContrastingRightFacing") == strValue) ||
					(_T("perspectiveFront") == strValue) ||
					(_T("perspectiveHeroicExtremeLeftFacing") == strValue) ||
					(_T("perspectiveHeroicExtremeRightFacing") == strValue) ||
					(_T("perspectiveHeroicLeftFacing") == strValue) ||
					(_T("perspectiveHeroicRightFacing") == strValue) ||
					(_T("perspectiveLeft") == strValue) ||
					(_T("perspectiveRelaxed") == strValue) ||
					(_T("perspectiveRelaxedModerately") == strValue) ||
					(_T("perspectiveRight") == strValue))
				{
					m_strValue = strValue;
				}
			}
		};
	} 
} 

#endif // PPTX_LIMIT_CAMERATYPE_INCLUDE_H_