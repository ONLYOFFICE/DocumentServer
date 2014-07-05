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
#include "Elements.h"



class CElementsContainer
{
public:
	
	long m_lWidth;   
	long m_lHeight; 

	
	long m_lOriginalWidth;
	long m_lOriginalHeight;

	double m_dDuration;
	double m_dCurrentTime;
	bool m_bDefaultDuration;

	double m_dStartTime;
	double m_dEndTime;
	
	CSimpleArray<IElement*> m_arElements;

	CSimpleArray<SColorAtom> m_arColorScheme;
	CSimpleArray<CFont_>* m_pFonts;

	
	
	CAtlArray<BOOL>* m_parEmptyPictures;
	
public:

	CElementsContainer() : m_arElements(), m_arColorScheme(), m_pFonts(NULL)
	{
		m_lWidth = 210;
		m_lHeight = 190;

		m_lOriginalWidth = 0;
		m_lOriginalHeight = 0;

		m_dCurrentTime = 0.0;
		m_dDuration = 30000.0;

		m_dStartTime = 0.0;
		m_dEndTime = m_dDuration;
		m_bDefaultDuration = true;

		m_parEmptyPictures = NULL;
	}

	~CElementsContainer()
	{
		Clear();
	}

	void Clear()
	{
		int nCount = m_arElements.GetSize();
		for (int nIndex = nCount - 1; nIndex >= 0; --nIndex)
		{
			IElement* pElem = m_arElements[nIndex];
			m_arElements.RemoveAt(nIndex);
			RELEASEOBJECT(pElem);
		}
	}

	void NormalizeCoordinates()
	{
		
		
		

		double dScaleX = (double)m_lWidth / m_lOriginalWidth;
		double dScaleY = (double)m_lHeight / m_lOriginalHeight;

		for (int nIndex = 0; nIndex < m_arElements.GetSize(); ++nIndex)
		{
			m_arElements[nIndex]->NormalizeCoords(dScaleX, dScaleY);

			CShapeElement* pElem = dynamic_cast<CShapeElement*>(m_arElements[nIndex]);
			if (NULL != pElem)
			{
				pElem->SetUpProperties(NULL, NULL);
			}
		}
	}

	CString ToXml()
	{
		CString str = _T("");
		str.Format(_T("<ColorSource Color='65535' Duration='%lf'/>"), m_dDuration);
		return str;
	}

	DWORD GetIndexPicture(DWORD lIndex)
	{
		if (NULL == m_parEmptyPictures)
			return lIndex;
		
		LONG lResult = 0;
		size_t nCount = m_parEmptyPictures->GetCount();

		if (lIndex > nCount)
			return 0;

		for (size_t nIndex = 0; nIndex < lIndex; ++nIndex)
		{
			if ((*m_parEmptyPictures)[nIndex])
				++lResult;
		}
		return lIndex - lResult;
	}
};
