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
#include "stdafx.h"
#include "Formula.h"

LONG NSGuidesVML::CFormula::Calculate(NSGuidesVML::CFormulasManager* pManager)
{
	if ((0 > m_lIndex) || (m_lIndex >= pManager->m_arResults.GetSize()))
		return 0;
	if (0xFFFFFFFF != pManager->m_arResults[m_lIndex])
	{
		return pManager->m_arResults[m_lIndex];
	}
	
	LONG lResult = 0;

	LONG lGuidesCount	= pManager->m_arFormulas.GetSize();
	LONG lAdjCount		= pManager->m_pAdjustments->GetSize();
	
	LONG a1 = m_lParam1;
	if (ptFormula == m_eType1)
	{
		a1 = (m_lParam1 >= lGuidesCount) ? 0 : pManager->m_arFormulas[m_lParam1].Calculate(pManager);
	}
	else if (ptAdjust == m_eType1)
	{
		a1 = (m_lParam1 >= lAdjCount) ? 0 : (*(pManager->m_pAdjustments))[m_lParam1];
	}

	LONG b1 = m_lParam2;
	if (ptFormula == m_eType2)
	{
		b1 = (m_lParam2 >= lGuidesCount) ? 0 : pManager->m_arFormulas[m_lParam2].Calculate(pManager);
	}
	else if (ptAdjust == m_eType2)
	{
		b1 = (m_lParam2 >= lAdjCount) ? 0 : (*(pManager->m_pAdjustments))[m_lParam2];
	}

	LONG c1 = m_lParam3;
	if (ptFormula == m_eType3)
	{
		c1 = (m_lParam3 >= lGuidesCount) ? 0 : pManager->m_arFormulas[m_lParam3].Calculate(pManager);
	}
	else if (ptAdjust == m_eType3)
	{
		c1 = (m_lParam3 >= lAdjCount) ? 0 : (*(pManager->m_pAdjustments))[m_lParam3];
	}

	double a = (double)a1;
	double b = (double)b1;
	double c = (double)c1;

	double dRes = 0.0;

	try
	{
		
		switch (m_eFormulaType)
		{
		case ftSum:			{ dRes = a + b - c;				break; }
		case ftProduct:		{ 
								if (0 == c) 
									c = 1; 
								
								dRes = a * b / c; 
								break; 
							}
		case ftMid:			{ dRes = (a + b) / 2.0;			break; }
		case ftAbsolute:	{ dRes = abs(a);				break; }
		
		case ftMin:			{ dRes = min(a, b);				break; }
		case ftMax:			{ dRes = max(a, b);				break; }
		case ftIf:			{ dRes = (a > 0) ? b : c;		break; }
		case ftSqrt:		{ dRes = sqrt(a);				break; }
		case ftMod:			{ dRes = sqrt(a*a + b*b + c*c); break; }
		
		case ftSin:			{ 
								
								
								dRes = a * sin(M_PI * b / (pow2_16 * 180));
								break; 
							}
		case ftCos:			{ 
								
								
								dRes = a * cos(M_PI * b / (pow2_16 * 180));
								break; 
							}
		case ftTan:			{ 
								
								dRes = a * tan(M_PI * b / (pow2_16 * 180));
								break; 
							}
		case ftAtan2:		{ 
								dRes =  180 * pow2_16 * atan2(b,a) / M_PI;	
								break; 
							}
		
		case ftSinatan2:	{ dRes = a * sin(atan2(c,b));	break; }
		case ftCosatan2:	{ dRes = a * cos(atan2(c,b));	break; }
		
		case ftSumangle:	{ 
								
								dRes = a + b * pow2_16 - c * pow2_16;
								
								

								break; 
							}
		case ftEllipse:		{ 
								if (0 == b)
									b = 1;
								dRes = c * sqrt(1-(a*a/(b*b)));	
								break; 
							}
		case ftVal:			{ dRes = a;						break; }
		default: break;
		};
	}
	catch (...)
	{
		dRes = 0;
	}

	lResult = (LONG)dRes;
	pManager->m_arResults[m_lIndex] = lResult;
	return lResult;
}