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
#ifndef PPTX_LIMIT_TEXTAUTONUMBERSCHEME_INCLUDE_H_
#define PPTX_LIMIT_TEXTAUTONUMBERSCHEME_INCLUDE_H_

#include "BaseLimit.h"


namespace PPTX
{
	namespace Limit
	{
		class TextAutonumberScheme : public BaseLimit
		{
		public:
			TextAutonumberScheme()
			{
				m_strValue = _T("arabicPlain");
			}

			_USE_STRING_OPERATOR
				
			virtual void set(const CString& strValue)
			{
				if ((_T("alphaLcParenBoth") == strValue) ||
					(_T("alphaLcParenR") == strValue) ||
					(_T("alphaLcPeriod") == strValue) ||
					(_T("alphaUcParenBoth") == strValue) ||
					(_T("alphaUcParenR") == strValue) ||
					(_T("alphaUcPeriod") == strValue) ||
					(_T("arabic1Minus") == strValue) ||
					(_T("arabic2Minus") == strValue) ||
					(_T("arabicDbPeriod") == strValue) ||
					(_T("arabicDbPlain") == strValue) ||
					(_T("arabicParenBoth") == strValue) ||
					(_T("arabicParenR") == strValue) ||
					(_T("arabicPeriod") == strValue) ||
					(_T("arabicPlain") == strValue) ||
					(_T("circleNumDbPlain") == strValue) ||
					(_T("circleNumWdBlackPlain") == strValue) ||
					(_T("circleNumWdWhitePlain") == strValue) ||
					(_T("ea1ChsPeriod") == strValue) ||
					(_T("ea1ChsPlain") == strValue) ||
					(_T("ea1ChtPeriod") == strValue) ||
					(_T("ea1ChtPlain") == strValue) ||
					(_T("ea1JpnChsDbPeriod") == strValue) ||
					(_T("ea1JpnKorPeriod") == strValue) ||
					(_T("ea1JpnKorPlain") == strValue) ||
					(_T("hebrew2Minus") == strValue) ||
					(_T("hindiAlpha1Period") == strValue) ||
					(_T("hindiAlphaPeriod") == strValue) ||
					(_T("hindiNumParenR") == strValue) ||
					(_T("hindiNumPeriod") == strValue) ||
					(_T("romanLcParenBoth") == strValue) ||
					(_T("romanLcParenR") == strValue) ||
					(_T("romanLcPeriod") == strValue) ||
					(_T("romanUcParenBoth") == strValue) ||
					(_T("romanUcParenR") == strValue) ||
					(_T("romanUcPeriod") == strValue) ||
					(_T("thaiAlphaParenBoth") == strValue) ||
					(_T("thaiAlphaParenR") == strValue) ||
					(_T("thaiAlphaPeriod") == strValue) ||
					(_T("thaiNumParenBoth") == strValue) ||
					(_T("thaiNumParenR") == strValue) ||
					(_T("thaiNumPeriod") == strValue))
				{
					m_strValue = strValue;
				}
			}

			virtual BYTE GetBYTECode() const
			{
				if (_T("alphaLcParenBoth") == m_strValue) return 0;
				if (_T("alphaLcParenR") == m_strValue) return 1;
				if (_T("alphaLcPeriod") == m_strValue) return 2;
				if (_T("alphaUcParenBoth") == m_strValue) return 3;
				if (_T("alphaUcParenR") == m_strValue) return 4;
				if (_T("alphaUcPeriod") == m_strValue) return 5;
				if (_T("arabic1Minus") == m_strValue) return 6;
				if (_T("arabic2Minus") == m_strValue) return 7;
				if (_T("arabicDbPeriod") == m_strValue) return 8;
				if (_T("arabicDbPlain") == m_strValue) return 9;
				if (_T("arabicParenBoth") == m_strValue) return 10;
				if (_T("arabicParenR") == m_strValue) return 11;
				if (_T("arabicPeriod") == m_strValue) return 12;
				if (_T("arabicPlain") == m_strValue) return 13;
				if (_T("circleNumDbPlain") == m_strValue) return 14;
				if (_T("circleNumWdBlackPlain") == m_strValue) return 15;
				if (_T("circleNumWdWhitePlain") == m_strValue) return 16;
				if (_T("ea1ChsPeriod") == m_strValue) return 17;
				if (_T("ea1ChsPlain") == m_strValue) return 18;
				if (_T("ea1ChtPeriod") == m_strValue) return 19;
				if (_T("ea1ChtPlain") == m_strValue) return 20;
				if (_T("ea1JpnChsDbPeriod") == m_strValue) return 21;
				if (_T("ea1JpnKorPeriod") == m_strValue) return 22;
				if (_T("ea1JpnKorPlain") == m_strValue) return 23;
				if (_T("hebrew2Minus") == m_strValue) return 24;
				if (_T("hindiAlpha1Period") == m_strValue) return 25;
				if (_T("hindiAlphaPeriod") == m_strValue) return 26;
				if (_T("hindiNumParenR") == m_strValue) return 27;
				if (_T("hindiNumPeriod") == m_strValue) return 28;
				if (_T("romanLcParenBoth") == m_strValue) return 29;
				if (_T("romanLcParenR") == m_strValue) return 30;
				if (_T("romanLcPeriod") == m_strValue) return 31;
				if (_T("romanUcParenBoth") == m_strValue) return 32;
				if (_T("romanUcParenR") == m_strValue) return 33;
				if (_T("romanUcPeriod") == m_strValue) return 34;
				if (_T("thaiAlphaParenBoth") == m_strValue) return 35;
				if (_T("thaiAlphaParenR") == m_strValue) return 36;
				if (_T("thaiAlphaPeriod") == m_strValue) return 37;
				if (_T("thaiNumParenBoth") == m_strValue) return 38;
				if (_T("thaiNumParenR") == m_strValue) return 39;
				if (_T("thaiNumPeriod") == m_strValue) return 40;
				return 13;
			}

			virtual void SetBYTECode(const BYTE& src)
			{
				switch (src)
				{
					case 0: m_strValue = _T("alphaLcParenBoth"); break;
					case 1: m_strValue = _T("alphaLcParenR"); break;
					case 2: m_strValue = _T("alphaLcPeriod"); break;
					case 3: m_strValue = _T("alphaUcParenBoth"); break;
					case 4: m_strValue = _T("alphaUcParenR"); break;
					case 5: m_strValue = _T("alphaUcPeriod"); break;
					case 6: m_strValue = _T("arabic1Minus"); break;
					case 7: m_strValue = _T("arabic2Minus"); break;
					case 8: m_strValue = _T("arabicDbPeriod"); break;
					case 9: m_strValue = _T("arabicDbPlain"); break;
					case 10: m_strValue = _T("arabicParenBoth"); break;
					case 11: m_strValue = _T("arabicParenR"); break;
					case 12: m_strValue = _T("arabicPeriod"); break;
					case 13: m_strValue = _T("arabicPlain"); break;
					case 14: m_strValue = _T("circleNumDbPlain"); break;
					case 15: m_strValue = _T("circleNumWdBlackPlain"); break;
					case 16: m_strValue = _T("circleNumWdWhitePlain"); break;
					case 17: m_strValue = _T("ea1ChsPeriod"); break;
					case 18: m_strValue = _T("ea1ChsPlain"); break;
					case 19: m_strValue = _T("ea1ChtPeriod"); break;
					case 20: m_strValue = _T("ea1ChtPlain"); break;
					case 21: m_strValue = _T("ea1JpnChsDbPeriod"); break;
					case 22: m_strValue = _T("ea1JpnKorPeriod"); break;
					case 23: m_strValue = _T("ea1JpnKorPlain"); break;
					case 24: m_strValue = _T("hebrew2Minus"); break;
					case 25: m_strValue = _T("hindiAlpha1Period"); break;
					case 26: m_strValue = _T("hindiAlphaPeriod"); break;
					case 27: m_strValue = _T("hindiNumPeriod"); break;
					case 28: m_strValue = _T("hindiNumPeriod"); break;
					case 29: m_strValue = _T("romanLcParenBoth"); break;
					case 30: m_strValue = _T("romanLcParenR"); break;
					case 31: m_strValue = _T("romanLcPeriod"); break;
					case 32: m_strValue = _T("romanUcParenBoth"); break;
					case 33: m_strValue = _T("romanUcParenR"); break;
					case 34: m_strValue = _T("romanUcPeriod"); break;
					case 35: m_strValue = _T("thaiAlphaParenBoth"); break;
					case 36: m_strValue = _T("thaiAlphaParenR"); break;
					case 37: m_strValue = _T("thaiAlphaPeriod"); break;
					case 38: m_strValue = _T("thaiNumParenBoth"); break;
					case 39: m_strValue = _T("thaiNumParenR"); break;
					case 40: m_strValue = _T("thaiNumPeriod"); break;
				default:
					m_strValue = _T("arabicPlain");
					break;
				}
			}
		};
	} 
} 

#endif // PPTX_LIMIT_TEXTAUTONUMBERSCHEME_INCLUDE_H_