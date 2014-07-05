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
#include "ElementsContainer.h"
#include "AnimationTypes.h"

typedef Animations::ODCSlideTimeLine::ODAnimationList AnimationsArray;
class CDrawingDocument
{
public:
	CAtlArray<CElementsContainer*> m_arPages;

	CString m_strXmlVideoSource;
	CString m_strXmlTransforms;
	CString m_strXmlOverlays;

	
	
	
	CSimpleMap <DWORD, ODCSlideShowSlideInfoAtom> m_mapTransitions;

	CSimpleMap <DWORD, Animations::ODCSlideTimeLine*>	m_mapAnimations;

	double	m_nWriteSlideTimeOffset;
	double	m_nWriteSlideTime;
public:

	CDrawingDocument() : m_arPages()
	{
	}

	~CDrawingDocument()
	{
		Clear();
	}

	void Clear()
	{
		m_arPages.RemoveAll();
	}

	void ToXMLSource()
	{
		m_strXmlVideoSource = _T("");
		m_strXmlTransforms = _T("");
		m_strXmlOverlays = _T("");

		if (0 != m_arPages.GetCount())
		{
			CString strXmlVideoSource = _T("");
			
			double dDuration = 0.0;
			for (size_t nIndex = 0; nIndex < m_arPages.GetCount(); ++nIndex)
			{
				dDuration += m_arPages[nIndex]->m_dDuration;
			}

			strXmlVideoSource.Format(_T("<VideoSources><ColorSource Color='16777215' Duration='%lf'/></VideoSources>"),
							dDuration);

			for (size_t nIndex = 0; nIndex < m_arPages.GetCount(); ++nIndex)
			{
				double dScaleHor = (double)(m_arPages[nIndex]->m_lWidth) / m_arPages[nIndex]->m_lOriginalWidth;
				double dScaleVer = (double)(m_arPages[nIndex]->m_lHeight) / m_arPages[nIndex]->m_lOriginalHeight;
				
				for (int nElem = 0; nElem < m_arPages[nIndex]->m_arElements.GetSize(); ++nElem)
				{
					CString strParam = m_arPages[nIndex]->m_arElements[nElem]->ToXml();

					if (etVideo == m_arPages[nIndex]->m_arElements[nElem]->m_etType)
					{
						m_strXmlOverlays += strParam;
					}
					else
					{
						m_strXmlTransforms += strParam;
					}
				}
			}

			if (_T("") != m_strXmlTransforms)
			{
				m_strXmlTransforms = _T("<VideoTransforms>") + m_strXmlTransforms + _T("</VideoTransforms>");
			}
			if (_T("") != m_strXmlOverlays)
			{
				m_strXmlOverlays = _T("<VideoOverlays>") + m_strXmlOverlays + _T("</VideoOverlays>");
			}

			m_strXmlVideoSource = strXmlVideoSource;
		}
	}

	void ToXmlSource2()
	{
		m_strXmlVideoSource	=	_T("");
		m_strXmlTransforms	=	_T("");
		m_strXmlOverlays	=	_T("");

		if ( m_arPages.GetCount () > 0 )
		{
			
			
			double dDuration = 0.0;
			for (size_t nIndex = 0; nIndex < m_arPages.GetCount(); ++nIndex)
			{
				dDuration += m_arPages[nIndex]->m_dDuration;
			}

			

			CString XmlSlideSource	=	_T("");

			for ( size_t nIndex = 0; nIndex < m_arPages.GetCount(); ++nIndex )
			{
				XmlSlideSource.Format ( _T("<ColorSource Color=\"16777215\" Duration=\"%lf\" widthmetric=\"%lf\" heightmetric=\"%lf\">"), 
					m_arPages [ nIndex ]->m_dDuration, (double)m_arPages[nIndex]->m_lWidth, (double)m_arPages[nIndex]->m_lHeight );

				m_strXmlTransforms	=	_T("");
				m_strXmlOverlays	=	_T("");

				for ( int nElem = 0; nElem < m_arPages[nIndex]->m_arElements.GetSize(); ++nElem )
				{
					CString strParam = m_arPages[nIndex]->m_arElements[nElem]->ToXml();

					if (etVideo == m_arPages[nIndex]->m_arElements[nElem]->m_etType)
					{
						m_strXmlOverlays += strParam;
					}
					else
					{
						m_strXmlTransforms += strParam;
					}
				}

				
				
				XmlSlideSource			+=	_T("<VideoTransforms>")	+ m_strXmlTransforms	+	_T("</VideoTransforms>");
				XmlSlideSource			+=	_T("<VideoOverlays>")	+ m_strXmlOverlays		+	_T("</VideoOverlays>");
				XmlSlideSource			+=	_T("</ColorSource>");
			
				m_strXmlVideoSource		+=	XmlSlideSource;
			}

			m_strXmlVideoSource			=	_T("<VideoSources>") + m_strXmlVideoSource + _T("</VideoSources>");
		}
		
		m_strXmlTransforms				=	_T("");
		m_strXmlOverlays				=	_T("");

		m_strXmlVideoSource = _T("<MultiSource><SingleSource>") + m_strXmlVideoSource + _T("</SingleSource></MultiSource>");
	}


	void ToXmlSource3();
	void WriteAnimationXml ( Animations::ODCSlideTimeLine* pTimeLine, CElementsContainer* pSlide, double nScaleW, double nScaleH );
	CString GetAnimationImageXml ( double fX, double fY, CImageElement* pImage, AnimationsArray* pSource );
	CString GetAnimationShapeXml ( double fX, double fY, CShapeElement* pShape, AnimationsArray* pSource );
	CString GetXmlImageSource ( CImageElement* pImage );
	CString GetXmlAnimationSource ( double fX, double fY, AnimationsArray* pSource );
	CString GetXmlSlideTransition ( ODCSlideShowSlideInfoAtom InfoAtom );
	void NormalizeTransitionTime();
};
