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
#ifndef PPTX_LIMIT_TEXTSHAPETYPE_INCLUDE_H_
#define PPTX_LIMIT_TEXTSHAPETYPE_INCLUDE_H_

#include "BaseLimit.h"


namespace PPTX
{
	namespace Limit
	{
		class TextShapeType : public BaseLimit
		{
		public:
			TextShapeType()
			{
				m_strValue = _T("textNoShape");
	 		}

			_USE_STRING_OPERATOR
				
			virtual void set(const CString& strValue)
			{
				if ((_T("textArchDown") == strValue) ||
					(_T("textArchDownPour") == strValue) ||
					(_T("textArchUp") == strValue) ||
					(_T("textArchUpPour") == strValue) ||
					(_T("textButton") == strValue) ||
					(_T("textButtonPour") == strValue) ||
					(_T("textCanDown") == strValue) ||
					(_T("textCanUp") == strValue) ||
					(_T("textCascadeDown") == strValue) ||
					(_T("textCascadeUp") == strValue) ||
					(_T("textChevron") == strValue) ||
					(_T("textChevronInverted") == strValue) ||
					(_T("textCircle") == strValue) ||
					(_T("textCirclePour") == strValue) ||
					(_T("textCurveDown") == strValue) ||
					(_T("textCurveUp") == strValue) ||
					(_T("textDeflate") == strValue) ||
					(_T("textDeflateBottom") == strValue) ||
					(_T("textDeflateInflate") == strValue) ||
					(_T("textDeflateInflateDeflate") == strValue) ||
					(_T("textDeflateTop") == strValue) ||
					(_T("textDoubleWave1") == strValue) ||
					(_T("textFadeDown") == strValue) ||
					(_T("textFadeLeft") == strValue) ||
					(_T("textFadeRight") == strValue) ||
					(_T("textFadeUp") == strValue) ||
					(_T("textInflate") == strValue) ||
					(_T("textInflateBottom") == strValue) ||
					(_T("textInflateTop") == strValue) ||
					(_T("textNoShape") == strValue) ||
					(_T("textPlain") == strValue) ||
					(_T("textRingInside") == strValue) ||
					(_T("textRingOutside") == strValue) ||
					(_T("textSlantDown") == strValue) ||
					(_T("textSlantUp") == strValue) ||
					(_T("textStop") == strValue) ||
					(_T("textTriangle") == strValue) ||
					(_T("textTriangleInverted") == strValue) ||
					(_T("textWave1") == strValue) ||
					(_T("textWave2") == strValue) ||
					(_T("textWave4") == strValue))
				{
					m_strValue = strValue;
				}
			}

			virtual BYTE GetBYTECode() const
			{
				if (_T("textArchDown") == m_strValue) return 0;
				if (_T("textArchDownPour") == m_strValue) return 1;
				if (_T("textArchUp") == m_strValue) return 2;
				if (_T("textArchUpPour") == m_strValue) return 3;
				if (_T("textButton") == m_strValue) return 4;
				if (_T("textButtonPour") == m_strValue) return 5;
				if (_T("textCanDown") == m_strValue) return 6;
				if (_T("textCanUp") == m_strValue) return 7;
				if (_T("textCascadeDown") == m_strValue) return 8;
				if (_T("textCascadeUp") == m_strValue) return 9;
				if (_T("textChevron") == m_strValue) return 10;
				if (_T("textChevronInverted") == m_strValue) return 11;
				if (_T("textCircle") == m_strValue) return 12;
				if (_T("textCirclePour") == m_strValue) return 13;
				if (_T("textCurveDown") == m_strValue) return 14;
				if (_T("textCurveUp") == m_strValue) return 15;
				if (_T("textDeflate") == m_strValue) return 16;
				if (_T("textDeflateBottom") == m_strValue) return 17;
				if (_T("textDeflateInflate") == m_strValue) return 18;
				if (_T("textDeflateInflateDeflate") == m_strValue) return 19;
				if (_T("textDeflateTop") == m_strValue) return 20;
				if (_T("textDoubleWave1") == m_strValue) return 21;
				if (_T("textFadeDown") == m_strValue) return 22;
				if (_T("textFadeLeft") == m_strValue) return 23;
				if (_T("textFadeRight") == m_strValue) return 24;
				if (_T("textFadeUp") == m_strValue) return 25;
				if (_T("textInflate") == m_strValue) return 26;
				if (_T("textInflateBottom") == m_strValue) return 27;
				if (_T("textInflateTop") == m_strValue) return 28;
				if (_T("textNoShape") == m_strValue) return 29;
				if (_T("textPlain") == m_strValue) return 30;
				if (_T("textRingInside") == m_strValue) return 31;
				if (_T("textRingOutside") == m_strValue) return 32;
				if (_T("textSlantDown") == m_strValue) return 33;
				if (_T("textSlantUp") == m_strValue) return 34;
				if (_T("textStop") == m_strValue) return 35;
				if (_T("textTriangle") == m_strValue) return 36;
				if (_T("textTriangleInverted") == m_strValue) return 37;
				if (_T("textWave1") == m_strValue) return 38;
				if (_T("textWave2") == m_strValue) return 39;
				if (_T("textWave4") == m_strValue) return 40;
				return 29;
			}
		};
	} 
} 

#endif // PPTX_LIMIT_TEXTSHAPETYPE_INCLUDE_H_