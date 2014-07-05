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

double NSGuidesOOXML::CFormula::Calculate(NSGuidesOOXML::CFormulaManager& pManager)
{
	if ((0 == m_lIndex) || (-m_lIndex > pManager.Guides->GetSize()) || (m_lIndex > pManager.Adjustments->GetSize()))
		return 0.0;
	if((m_lIndex < 0) && (dNonDefResult > (*pManager.Guides)[-m_lIndex-1]))
		return (*pManager.Guides)[-m_lIndex-1];
	if((m_lIndex > 0) && (NonDefResult != (*pManager.Adjustments)[m_lIndex-1]))
		return (*pManager.Adjustments)[m_lIndex-1];
	
	double a = pManager.GetValue(m_lParam1);
	double b = pManager.GetValue(m_lParam2);
	double c = pManager.GetValue(m_lParam3);
	

	double dRes = 0.0;

	try
	{
		
		switch (m_eFormulaType)
		{
		case ftOOXMLSum:			{ dRes = a + b - c;						break; }
		case ftOOXMLProduct:		{ dRes = (a * b)/c;	break; }
		case ftOOXMLAddDivide:		{ dRes = (a + b)/c;	break; }
		case ftOOXMLAbsolute:		{ dRes = abs(a);						break; }
		case ftOOXMLMin:			{ dRes = min(a, b);						break; }
		case ftOOXMLMax:			{ dRes = max(a, b);						break; }
		case ftOOXMLIf:				{ dRes = (a > 0) ? b : c;				break; }
		case ftOOXMLSqrt:			{ dRes = sqrt(a);						break; }
		case ftOOXMLMod:			{ dRes = sqrt(a*a + b*b + c*c);			break; }
		case ftOOXMLSin:			{ dRes = a * sin(b * RadKoef);			break; }
		case ftOOXMLCos:			{ dRes = a * cos(b * RadKoef);			break; }
		case ftOOXMLTan:			{ dRes = a * tan(b * RadKoef);			break; }
		case ftOOXMLAtan2:			{ dRes = atan2(b,a)/RadKoef;			break; }
		case ftOOXMLSinatan2:		{ dRes = a * sin(atan2(c,b));			break; }
		case ftOOXMLCosatan2:		{ dRes = a * cos(atan2(c,b));			break; }
		case ftOOXMLPin:			{ dRes = (b < a) ? a :((b > c) ? c : b);break; }
		case ftOOXMLVal:			{ dRes = a;								break; }
		default: break;
		};
	}
	catch (...)
	{
		dRes = 0.0;
	}

	
	if(m_lIndex < 0)
		(*pManager.Guides)[-m_lIndex-1] = dRes;
	else
		(*pManager.Adjustments)[m_lIndex-1] = (long)dRes;
	return dRes;
}
