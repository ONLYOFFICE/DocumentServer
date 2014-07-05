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
#include "ElementsContainer.h"

void IElement::SetUpProperties(CProperties *pProps, CElementsContainer *pSlide)
{
	if (NULL == pProps)
		return;

	for (long nIndex = 0; nIndex < pProps->m_lCount; ++nIndex)
	{
		SetUpProperty(&pProps->m_arProperties[nIndex], pSlide);
	}
}

void IElement::SetUpProperty(CProperty *pProp, CElementsContainer *pSlide)
{
	if (hspMaster == pProp->m_ePID)
	{
		m_lMasterID = (LONG)pProp->m_lValue;
	}

	if (rotation == pProp->m_ePID)
	{
		m_dRotate = (double)((LONG)pProp->m_lValue) / 0x00010000;
	}
	if (fFlipH == pProp->m_ePID)
	{
		BYTE flag1 = (BYTE)pProp->m_lValue;
		BYTE flag3 = (BYTE)(pProp->m_lValue >> 16);

		bool bFlipH = (0x01 == (0x01 & flag1));
		bool bFlipV = (0x02 == (0x02 & flag1));

		bool bUseFlipH = (0x01 == (0x01 & flag3));
		bool bUseFlipV = (0x02 == (0x02 & flag3));

		if (bUseFlipH)
			m_bFlipH = bFlipH;

		if (bUseFlipV)
			m_bFlipV = bFlipV;
	}
}

void CImageElement::SetUpProperty(CProperty* pProp, CElementsContainer* pSlide)
{
	IElement::SetUpProperty(pProp, pSlide);
	if (Pib == pProp->m_ePID)
	{
		DWORD dwIndex = pSlide->GetIndexPicture(pProp->m_lValue);
		
		CStringW strVal = (CStringW)CDirectory::ToString(dwIndex);
		m_strFileName = m_strFileName + strVal + L".jpg";
	}
}

void CShapeElement::SetUpProperties(CProperties *pProps, CElementsContainer* pSlide)
{
	IElement::SetUpProperties(pProps, pSlide);
	m_oShape.SetProperties(pProps, pSlide);
}