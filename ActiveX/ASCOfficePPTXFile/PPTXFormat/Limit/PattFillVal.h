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
#ifndef PPTX_LIMIT_PATTFILLVAL_INCLUDE_H_
#define PPTX_LIMIT_PATTFILLVAL_INCLUDE_H_

#include "BaseLimit.h"


namespace PPTX
{
	namespace Limit
	{
		class PattFillVal : public BaseLimit
		{
		public:
			PattFillVal()
			{
				m_strValue = _T("cross");
			}

			_USE_STRING_OPERATOR
				
			virtual void set(const CString& strValue)
			{
				if ((_T("cross") == strValue) || 
					(_T("dashDnDiag") == strValue) || 
					(_T("dashHorz") == strValue) || 
					(_T("dashUpDiag") == strValue) || 
					(_T("dashVert") == strValue) || 
					(_T("diagBrick") == strValue) || 
					(_T("diagCross") == strValue) || 
					(_T("divot") == strValue) || 
					(_T("dkDnDiag") == strValue) || 
					(_T("dkHorz") == strValue) || 
					(_T("dkUpDiag") == strValue) || 
					(_T("dkVert") == strValue) || 
					(_T("dnDiag") == strValue) || 
					(_T("dotDmnd") == strValue) || 
					(_T("dotGrid") == strValue) || 
					(_T("horz") == strValue) || 
					(_T("horzBrick") == strValue) || 
					(_T("lgCheck") == strValue) || 
					(_T("lgConfetti") == strValue) || 
					(_T("lgGrid") == strValue) || 
					(_T("ltDnDiag") == strValue) || 
					(_T("ltHorz") == strValue) || 
					(_T("ltUpDiag") == strValue) || 
					(_T("ltVert") == strValue) || 
					(_T("narHorz") == strValue) || 
					(_T("narVert") == strValue) || 
					(_T("openDmnd") == strValue) || 
					(_T("pct10") == strValue) || 
					(_T("pct20") == strValue) || 
					(_T("pct25") == strValue) || 
					(_T("pct30") == strValue) || 
					(_T("pct40") == strValue) || 
					(_T("pct5") == strValue) || 
					(_T("pct50") == strValue) || 
					(_T("pct60") == strValue) || 
					(_T("pct70") == strValue) || 
					(_T("pct75") == strValue) || 
					(_T("pct80") == strValue) || 
					(_T("pct90") == strValue) || 
					(_T("plaid") == strValue) || 
					(_T("shingle") == strValue) || 
					(_T("smCheck") == strValue) || 
					(_T("smConfetti") == strValue) || 
					(_T("smGrid") == strValue) || 
					(_T("solidDmnd") == strValue) || 
					(_T("sphere") == strValue) || 
					(_T("trellis") == strValue) || 
					(_T("upDiag") == strValue) || 
					(_T("vert") == strValue) || 
					(_T("wave") == strValue) || 
					(_T("wdDnDiag") == strValue) || 
					(_T("wdUpDiag") == strValue) || 
					(_T("weave") == strValue) || 
					(_T("zigZag") == strValue))
				{
					m_strValue = strValue;
				}
			}

			virtual BYTE GetBYTECode() const
			{
				if (_T("cross") == m_strValue)       return 0;
				if (_T("dashDnDiag") == m_strValue)  return 1;
				if (_T("dashHorz") == m_strValue)    return 2;
				if (_T("dashUpDiag") == m_strValue)  return 3;
				if (_T("dashVert") == m_strValue)    return 4;
				if (_T("diagBrick") == m_strValue)   return 5;
				if (_T("diagCross") == m_strValue)   return 6;
				if (_T("divot") == m_strValue)       return 7;
				if (_T("dkDnDiag") == m_strValue)    return 8;
				if (_T("dkHorz") == m_strValue)      return 9;
				if (_T("dkUpDiag") == m_strValue)    return 10;
				if (_T("dkVert") == m_strValue)      return 11;
				if (_T("dnDiag") == m_strValue)      return 12;
				if (_T("dotDmnd") == m_strValue)     return 13;
				if (_T("dotGrid") == m_strValue)     return 14;
				if (_T("horz") == m_strValue)        return 15;
				if (_T("horzBrick") == m_strValue)   return 16;
				if (_T("lgCheck") == m_strValue)     return 17;
				if (_T("lgConfetti") == m_strValue)  return 18;
				if (_T("lgGrid") == m_strValue)      return 19;
				if (_T("ltDnDiag") == m_strValue)    return 20;
				if (_T("ltHorz") == m_strValue)      return 21;
				if (_T("ltUpDiag") == m_strValue)    return 22;
				if (_T("ltVert") == m_strValue)      return 23;
				if (_T("narHorz") == m_strValue)     return 24;
				if (_T("narVert") == m_strValue)     return 25;
				if (_T("openDmnd") == m_strValue)    return 26;
				if (_T("pct10") == m_strValue)       return 27;
				if (_T("pct20") == m_strValue)       return 28;
				if (_T("pct25") == m_strValue)       return 29;
				if (_T("pct30") == m_strValue)       return 30;
				if (_T("pct40") == m_strValue)       return 31;
				if (_T("pct5") == m_strValue)        return 32;
				if (_T("pct50") == m_strValue)       return 33;
				if (_T("pct60") == m_strValue)       return 34;
				if (_T("pct70") == m_strValue)       return 35;
				if (_T("pct75") == m_strValue)       return 36;
				if (_T("pct80") == m_strValue)       return 37;
				if (_T("pct90") == m_strValue)       return 38;
				if (_T("plaid") == m_strValue)       return 39;
				if (_T("shingle") == m_strValue)     return 40;
				if (_T("smCheck") == m_strValue)     return 41;
				if (_T("smConfetti") == m_strValue)  return 42;
				if (_T("smGrid") == m_strValue)      return 43;
				if (_T("solidDmnd") == m_strValue)   return 44;
				if (_T("sphere") == m_strValue)      return 45;
				if (_T("trellis") == m_strValue)     return 46;
				if (_T("upDiag") == m_strValue)      return 47;
				if (_T("vert") == m_strValue)        return 48;
				if (_T("wave") == m_strValue)        return 49;
				if (_T("wdDnDiag") == m_strValue)    return 50;
				if (_T("wdUpDiag") == m_strValue)    return 51;
				if (_T("weave") == m_strValue)       return 52;
				if (_T("zigZag") == m_strValue)      return 53;
				return 0;
			}

			virtual void SetBYTECode(const BYTE& src)
			{
				switch (src)
				{
				case 0: m_strValue = _T("cross"); break;
				case 1: m_strValue = _T("dashDnDiag"); break;
				case 2: m_strValue = _T("dashHorz"); break;
				case 3: m_strValue = _T("dashUpDiag"); break;
				case 4: m_strValue = _T("dashVert"); break;
				case 5: m_strValue = _T("diagBrick"); break;
				case 6: m_strValue = _T("diagCross"); break;
				case 7: m_strValue = _T("divot"); break;
				case 8: m_strValue = _T("dkDnDiag"); break;
				case 9: m_strValue = _T("dkHorz"); break;
				case 10: m_strValue = _T("dkUpDiag"); break;
				case 11: m_strValue = _T("dkVert"); break;
				case 12: m_strValue = _T("dnDiag"); break;
				case 13: m_strValue = _T("dotDmnd"); break;
				case 14: m_strValue = _T("dotGrid"); break;
				case 15: m_strValue = _T("horz"); break;
				case 16: m_strValue = _T("horzBrick"); break;
				case 17: m_strValue = _T("lgCheck"); break;
				case 18: m_strValue = _T("lgConfetti"); break;
				case 19: m_strValue = _T("lgGrid"); break;
				case 20: m_strValue = _T("ltDnDiag"); break;
				case 21: m_strValue = _T("ltHorz"); break;
				case 22: m_strValue = _T("ltUpDiag"); break;
				case 23: m_strValue = _T("ltVert"); break;
				case 24: m_strValue = _T("narHorz"); break;
				case 25: m_strValue = _T("narVert"); break;
				case 26: m_strValue = _T("openDmnd"); break;
				case 27: m_strValue = _T("pct10"); break;
				case 28: m_strValue = _T("pct20"); break;
				case 29: m_strValue = _T("pct25"); break;
				case 30: m_strValue = _T("pct30"); break;
				case 31: m_strValue = _T("pct40"); break;
				case 32: m_strValue = _T("pct5"); break;
				case 33: m_strValue = _T("pct50"); break;
				case 34: m_strValue = _T("pct60"); break;
				case 35: m_strValue = _T("pct70"); break;
				case 36: m_strValue = _T("pct75"); break;
				case 37: m_strValue = _T("pct80"); break;
				case 38: m_strValue = _T("pct90"); break;
				case 39: m_strValue = _T("plaid"); break;
				case 40: m_strValue = _T("shingle"); break;
				case 41: m_strValue = _T("smCheck"); break;
				case 42: m_strValue = _T("smConfetti"); break;
				case 43: m_strValue = _T("smGrid"); break;
				case 44: m_strValue = _T("solidDmnd"); break;
				case 45: m_strValue = _T("sphere"); break;
				case 46: m_strValue = _T("trellis"); break;
				case 47: m_strValue = _T("upDiag"); break;
				case 48: m_strValue = _T("vert"); break;
				case 49: m_strValue = _T("wave"); break;
				case 50: m_strValue = _T("wdDnDiag"); break;
				case 51: m_strValue = _T("wdUpDiag"); break;
				case 52: m_strValue = _T("weave"); break;
				case 53: m_strValue = _T("zigZag"); break;
				default:
					m_strValue = _T("cross");
					break;
				}
			}
		};
	} 
} 

#endif // PPTX_LIMIT_PATTFILLVAL_INCLUDE_H_