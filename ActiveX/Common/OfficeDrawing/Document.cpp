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
 #include "stdafx.h"
#include "Document.h"

void CDrawingDocument::ToXmlSource3()
{
	m_strXmlVideoSource	=	_T("");
	m_strXmlTransforms	=	_T("");
	m_strXmlOverlays	=	_T("");
	CString strVideoOverlay = _T("");
	CString strAudioOverlay = _T("");

	if ( m_arPages.GetCount () > 0 )
	{
		
		
		double dDuration = 0.0;
		for (size_t nIndex = 0; nIndex < m_arPages.GetCount(); ++nIndex)
		{
			dDuration += m_arPages[nIndex]->m_dDuration;
		}

		

		m_nWriteSlideTimeOffset	=	0.0;
		m_nWriteSlideTime		=	0.0;

		CString XmlSlideSource	=	_T("");

		for ( size_t nIndex = 0; nIndex < m_arPages.GetCount(); ++nIndex )
		{
			CString XmlCompose	=	_T("");

			bool bInsertCutBlack	=	false;
			bool bInsertCutNone		=	false;

			int KeyIndex = m_mapTransitions.FindKey ( (DWORD)nIndex );
			if ( -1 != KeyIndex )
			{
				ODCSlideShowSlideInfoAtom InfoAtom = m_mapTransitions.GetValueAt ( KeyIndex );

				

				XmlCompose		=	GetXmlSlideTransition ( InfoAtom );
			}

			XmlSlideSource.Format ( _T("<ColorSource Color=\"16777215\" Duration=\"%lf\" widthmetric=\"%lf\" heightmetric=\"%lf\">"), 
				m_arPages [ nIndex ]->m_dDuration, (double)m_arPages[nIndex]->m_lWidth, (double)m_arPages[nIndex]->m_lHeight );

			m_strXmlTransforms	=	_T("");
			
			

			m_nWriteSlideTime	=	m_arPages [ nIndex ]->m_dDuration;
		
			double dScaleHor	=	(double)(m_arPages[nIndex]->m_lWidth) / m_arPages[nIndex]->m_lOriginalWidth;
			double dScaleVer	=	(double)(m_arPages[nIndex]->m_lHeight) / m_arPages[nIndex]->m_lOriginalHeight;

			
			Animations::ODCSlideTimeLine* pTimeLine	=	m_mapAnimations.Lookup ( (DWORD)nIndex );
			
			if ( NULL != pTimeLine )
			{
				WriteAnimationXml ( pTimeLine, m_arPages[nIndex], dScaleHor, dScaleVer );
			}
			else
			{
				for ( int nElem = 0; nElem < m_arPages[nIndex]->m_arElements.GetSize(); ++nElem )
				{
					CString strParam = m_arPages[nIndex]->m_arElements[nElem]->ToXml();

					if (etVideo == m_arPages[nIndex]->m_arElements[nElem]->m_etType)
					{
						strVideoOverlay += strParam;
					}
					else if (etAudio == m_arPages[nIndex]->m_arElements[nElem]->m_etType)
					{
						strAudioOverlay += strParam;
					}
					else
					{
						m_strXmlTransforms += strParam;
					}
				}
			}

			

		
			if ( -1 != KeyIndex && 0 == nIndex && XmlCompose.GetLength () > 1 )
			{
				CString strMem = _T("");
				strMem.Format(_T("<ColorSource Color=\"0\" Duration=\"1000\" widthmetric=\"%lf\" heightmetric=\"%lf\" />"),
					(double)m_arPages[nIndex]->m_lWidth, (double)m_arPages[nIndex]->m_lHeight );
				
				m_strXmlVideoSource	+=	strMem;	
			}
			
			m_strXmlVideoSource		+=	XmlCompose;
			
			XmlSlideSource			+=	_T("<VideoTransforms>")	+ m_strXmlTransforms	+	_T("</VideoTransforms>");
			
			

			XmlSlideSource			+=	_T("</ColorSource>");
		
			m_strXmlVideoSource		+=	XmlSlideSource;
		}

		m_strXmlVideoSource			=	_T("<VideoSources>") + m_strXmlVideoSource + _T("</VideoSources>");
	}
	
	m_strXmlTransforms				=	_T("");
	

	m_strXmlOverlays        =   _T("<VideoOverlays>")	+ strVideoOverlay +	_T("</VideoOverlays>") + _T("<AudioOverlays>") + 
		_T("<AudioSources>") + strAudioOverlay +	_T("</AudioSources>") +






	_T("</AudioOverlays>");

	m_strXmlVideoSource = _T("<SingleSource>") + m_strXmlVideoSource + _T("</SingleSource>");
	m_strXmlVideoSource = _T("<MultiSource>") + m_strXmlVideoSource + m_strXmlOverlays + _T("</MultiSource>");
}

void CDrawingDocument::WriteAnimationXml ( Animations::ODCSlideTimeLine* pTimeLine, CElementsContainer* pSlide, double nScaleW, double nScaleH )
{
	if (NULL == pSlide)
		return;	
	
	for ( int nElemInd = 0; nElemInd < pSlide->m_arElements.GetSize(); ++nElemInd )
	{
		IElement* pSlideElement = pSlide->m_arElements [ nElemInd ];
		if ( NULL != pSlideElement )
		{
			
			if ( 0 == pSlideElement->m_etType )
			{
				
				m_strXmlOverlays	+=	pSlideElement->ToXml ();
				continue;
			}

			
			if ( 2 == pSlideElement->m_etType )
			{
				CImageElement* pImage	=	static_cast<CImageElement*> ( pSlideElement );
				if ( NULL != pImage )
				{
					AnimationsArray* pSources = pTimeLine->GetAnimation().Lookup ( pSlideElement->m_lID );
					if ( pSources )
					{
						m_strXmlTransforms	+=	GetAnimationImageXml ( static_cast<double> ( pSlide->m_lWidth ), static_cast<double> ( pSlide->m_lHeight ), pImage, pSources );
						continue;
					}
				}
			}

			
			if ( 3 == pSlideElement->m_etType ) 
			{
				CShapeElement* pShape	=	static_cast<CShapeElement*> ( pSlideElement );
				if ( NULL != pShape )
				{
					AnimationsArray* pSources = pTimeLine->GetAnimation().Lookup ( pSlideElement->m_lID );
					if ( pSources )
					{
						m_strXmlTransforms	+=	GetAnimationShapeXml ( static_cast<double> ( pSlide->m_lWidth ), static_cast<double> ( pSlide->m_lHeight ), pShape, pSources );
						continue;
					}
				}
			}

			m_strXmlTransforms	+=	pSlideElement->ToXml ();
		}
	}
}

CString CDrawingDocument::GetAnimationImageXml ( double fX, double fY, CImageElement* pImage, AnimationsArray* pSource )
{
	CString Source	=	CString ( _T("") );
		Source.Format (	
				_T("<ImagePaint-DrawImageFromFileAnimate ")
				_T("%s")
				_T(" >")
				_T("%s")
				_T("<timeline type = \"1\"  begin=\"%f\" end=\"%f\" fadein=\"0\" fadeout=\"0\" completeness=\"1.0\"/> ")
				_T("</ImagePaint-DrawImageFromFileAnimate>"),
				GetXmlImageSource ( pImage ),
				GetXmlAnimationSource ( fX, fY, pSource ),
				m_nWriteSlideTimeOffset, m_nWriteSlideTimeOffset + m_nWriteSlideTime );

	return Source;
}

CString CDrawingDocument::GetAnimationShapeXml ( double fX, double fY, CShapeElement* pShape, AnimationsArray* pSource )
{
	CGeomShapeInfo infGeomShape;
	
	infGeomShape.m_dLeft	=	pShape->m_rcBounds.left;
	infGeomShape.m_dTop		=	pShape->m_rcBounds.top;
	infGeomShape.m_dWidth	=	pShape->m_rcBounds.right	-	pShape->m_rcBounds.left;
	infGeomShape.m_dHeight	=	pShape->m_rcBounds.bottom	-	pShape->m_rcBounds.top;

	infGeomShape.m_dLimoX	=	pShape->m_oShape.m_lLimoX;
	infGeomShape.m_dLimoY	=	pShape->m_oShape.m_lLimoY;

	CString Source	=	CString ( _T("") );

	for ( int i = 0; i < pShape->m_oShape.m_pShape->m_oPath.m_arParts.GetSize(); ++i )
	{
		Source	+=	CString ( _T("<ImagePaint-DrawGraphicPathAnimate>") );

		CString FillFormat;
		FillFormat.Format ( _T("<stroke>%s</stroke><fill>%s</fill><widthmm>%d</widthmm><heightmm>%d</heightmm>"), 
							NSAttributes::BoolToString ( pShape->m_oShape.m_pShape->m_oPath.m_arParts[i].m_bStroke ), 
							NSAttributes::BoolToString ( pShape->m_oShape.m_pShape->m_oPath.m_arParts[i].m_bFill ),
							pShape->m_oMetric.m_lMillimetresHor,
							pShape->m_oMetric.m_lMillimetresVer );

		Source	+=	FillFormat;

		if ( pShape->m_oShape.m_pShape->m_oPath.m_arParts[i].m_bFill )
		{
			Source += pShape->m_oShape.m_oBrush.ToString2();
		}

		Source += pShape->m_oShape.m_oPen.ToString2 ();

		for ( int nIndex = 0; nIndex < pShape->m_oShape.m_pShape->m_oPath.m_arParts[i].m_arSlices.GetSize(); ++nIndex )
		{
#if defined(PPTX_DEF)
			Source += pShape->m_oShape.m_pShape->m_oPath.m_arParts[i].m_arSlices [ nIndex ].ToXml ( infGeomShape, pShape->m_oShape.m_pShape->m_oPath.m_arParts[i].width,
				pShape->m_oShape.m_pShape->m_oPath.m_arParts[i].height, NSBaseShape::pptx);
#endif
#if defined(PPT_DEF)
			Source += pShape->m_oShape.m_pShape->m_oPath.m_arParts[i].m_arSlices [ nIndex ].ToXml ( infGeomShape, pShape->m_oShape.m_pShape->m_oPath.m_arParts[i].width,
				pShape->m_oShape.m_pShape->m_oPath.m_arParts[i].height, NSBaseShape::ppt);
#endif
#if defined(ODP_DEF)
			Source += pShape->m_oShape.m_pShape->m_oPath.m_arParts[i].m_arSlices [ nIndex ].ToXml ( infGeomShape, pShape->m_oShape.m_pShape->m_oPath.m_arParts[i].width,
				pShape->m_oShape.m_pShape->m_oPath.m_arParts[i].height, NSBaseShape::odp);
#endif

		}

		CString TimeLine;
		TimeLine.Format ( _T("<timeline type = \"1\"  begin=\"%f\" end=\"%f\" fadein=\"0\" fadeout=\"0\" completeness=\"1.0\"/> "),
						m_nWriteSlideTimeOffset, m_nWriteSlideTimeOffset + m_nWriteSlideTime );

		Source	+=	GetXmlAnimationSource ( fX, fY, pSource );
		Source	+=	TimeLine;
		Source	+=	CString ( _T("</ImagePaint-DrawGraphicPathAnimate>") );
	}

	return Source;
}

CString CDrawingDocument::GetXmlImageSource ( CImageElement* pImage )
{
	CString Source;	
	Source.Format (
		_T("left=\"%d\" top=\"%d\" right=\"%d\" bottom=\"%d\" filepath=\"%s\" ")
		_T("metric=\"0\" backcolor=\"-1\" scaletype=\"-1\" scalecolor=\"255\" "),
		pImage->m_rcBounds.left, pImage->m_rcBounds.top, pImage->m_rcBounds.right, pImage->m_rcBounds.bottom, CString ( CW2A ( pImage->m_strFileName ) ) );

	return Source; 
}

CString CDrawingDocument::GetXmlAnimationSource ( double fX, double fY, AnimationsArray* pSource )
{
	CString XmlAnimationSource;

	
	for ( UINT i = 0; i < pSource->GetCount(); ++i )
	{
		CString XmlEffect; 

		Animations::ODTimeLineElement& pESource = pSource->GetAt(i);

		
		if ( 0x00000004 == pESource.m_nEffectType )
		{
			Animations::ODMotionPath path;
			if ( path.Create ( pESource.m_MotionPath ) )
			{
				XmlEffect.Format (	_T("<animation_effect>")
										_T("<effect_id>%d</effect_id>")
										_T("<effect_type>%d</effect_type>")
												_T("%s")							
										_T("<time_delay>%f</time_delay>")
										_T("<time_duration>%f</time_duration>")
											_T("<plale_width>%f</plale_width>")
											_T("<plane_height>%f</plane_height>")
									_T("</animation_effect>"), 
									
									pESource.m_nEffectID,
									pESource.m_nEffectType,
									Animations::Serialize::CreateMotionPath ( path, fX, fY ),
									m_nWriteSlideTimeOffset + pESource.m_nTimeDelay,
									pESource.m_nDuration,
									fX, 
									fY );

									XmlAnimationSource	+=	XmlEffect;
			}
		}

		
		if ( 0x00000001 == pESource.m_nEffectType || 0x00000002 == pESource.m_nEffectType )
		{
			XmlEffect.Format (	_T("<animation_effect>")
									_T("<effect_id>%d</effect_id>")
									_T("<effect_type>%d</effect_type>")
									_T("<effect_dir>%d</effect_dir>")
									_T("<time_delay>%f</time_delay>")
									_T("<time_duration>%f</time_duration>")
									_T("<plale_width>%f</plale_width>")
									_T("<plane_height>%f</plane_height>")
								_T("</animation_effect>"), 
									
								pESource.m_nEffectID,
								pESource.m_nEffectType,
								pESource.m_nEffectDir,
								m_nWriteSlideTimeOffset + pESource.m_nTimeDelay,
								pESource.m_nDuration,
								fX, 
								fY );

								XmlAnimationSource	+=	XmlEffect;
		}
	}	 

	return XmlAnimationSource;
}

CString CDrawingDocument::GetXmlSlideTransition ( ODCSlideShowSlideInfoAtom InfoAtom )
{
	CString Source	=	CString ( _T("") );

	int EffectID	=	1;

	switch ( InfoAtom.m_nEffectType )
	{
	case 0 : 
		{
			
		}
		break;
	case 1 : 
		{
			
			EffectID	=	1;							
		}
		break;
	case  2 : 
		{
			if ( 0x00 == InfoAtom.m_nEffectDirection )	
				EffectID	=	1003;
			if ( 0x01 == InfoAtom.m_nEffectDirection )	
				EffectID	=	1001;
		}
		break;
	case  3 : 
		{
			if ( 0x00 == InfoAtom.m_nEffectDirection )	
				EffectID	=	2901;
			if ( 0x01 == InfoAtom.m_nEffectDirection )	
				EffectID	=	2903;
		}
		break;
	case  4 : 
		{
			
#pragma message ("TODO : Cover - �������� ����� ������ � ImageStudio")	
			
			
			
			
			
			
			
		}
		break;
	case  5 : 
		{
#pragma message ("TODO : Dissolve - �������� ����� ������ � ImageStudio")
		
			EffectID	=	1;							
		}
		break;
	case  6 : 
		{
			EffectID	=	4904;						
		}
		break;
	case  7 : 
		{
#pragma message ("TODO : Uncover - �������� ����� ������ � ImageStudio")	
			
			
			
			
			
			
			
			
		}
		break;
	case  8 : 
		{
			if ( 0x00 == InfoAtom.m_nEffectDirection )	
				EffectID	=	5331;
			if ( 0x01 == InfoAtom.m_nEffectDirection )	
				EffectID	=	5332;
		}
		break;
	case  9 : 
		{
			if ( 0x04 == InfoAtom.m_nEffectDirection )	
				EffectID	=	110;
			if ( 0x05 == InfoAtom.m_nEffectDirection )	
				EffectID	=	111;
			if ( 0x06 == InfoAtom.m_nEffectDirection )	
				EffectID	=	109;
			if ( 0x07 == InfoAtom.m_nEffectDirection )	
				EffectID	=	108;
		}
		break;
	case  10: 
		{
			if ( 0x00 == InfoAtom.m_nEffectDirection )	
				EffectID	=	5322;
			if ( 0x01 == InfoAtom.m_nEffectDirection )	
				EffectID	=	5323;
			if ( 0x02 == InfoAtom.m_nEffectDirection )	
				EffectID	=	5321;
			if ( 0x03 == InfoAtom.m_nEffectDirection )	
				EffectID	=	5320;
		}
		break;
	case  11: 
		{
			if ( 0x00 == InfoAtom.m_nEffectDirection )	
				EffectID	=	702;
			if ( 0x01 == InfoAtom.m_nEffectDirection )	
				EffectID	=	701;
		}
		break;
	case  13 :
		{
			if ( 0x00 == InfoAtom.m_nEffectDirection )	
				EffectID	=	5324;
#pragma message ("TODO : Split Horizontal In - �������� ����� ������ � ImageStudio")	
			if ( 0x01 == InfoAtom.m_nEffectDirection )	
				EffectID	=	5324;					
			if ( 0x02 == InfoAtom.m_nEffectDirection )	
				EffectID	=	5325;
#pragma message ("TODO : Split Vertical In - �������� ����� ������ � ImageStudio")
			if ( 0x03 == InfoAtom.m_nEffectDirection )	
				EffectID	=	5325;						
		}
		break;
	case  17 : 
		{
			EffectID	=	704;						
		}
		break;
	case  18 : 
		{
			EffectID	=	708;						
		}
		break;
	case  19 : 
		{
			EffectID	=	3006;						
		}
		break;
	case 20 : 
		{
			if ( 0x00 == InfoAtom.m_nEffectDirection )	
				EffectID	=	1402;
			if ( 0x01 == InfoAtom.m_nEffectDirection )	
				EffectID	=	1404;
			if ( 0x02 == InfoAtom.m_nEffectDirection )	
				EffectID	=	1401;
			if ( 0x03 == InfoAtom.m_nEffectDirection )	
				EffectID	=	1403;
		}
		break;
	case  21 : 
		{
			if ( 0x00 == InfoAtom.m_nEffectDirection )	
				EffectID	=	103;
#pragma message ("TODO : MosaicStrips Vertical - �������� ����� ������ � ImageStudio")
			if ( 0x01 == InfoAtom.m_nEffectDirection )	
				EffectID	=	103;
		}
		break;
	case  22 : 
		{
			EffectID	=	313;						
		}
		break;
	case  23 :
		{
			EffectID	=	1;							
		}
		break;
	case 26 : 
		{
			if ( 0x01 == InfoAtom.m_nEffectDirection )	
				EffectID	=	3004;
			if ( 0x02 == InfoAtom.m_nEffectDirection )	
				EffectID	=	3013;
			if ( 0x03 == InfoAtom.m_nEffectDirection )	
				EffectID	=	3017;
			if ( 0x04 == InfoAtom.m_nEffectDirection )	
				EffectID	=	3019;
			if ( 0x08 == InfoAtom.m_nEffectDirection )	
				EffectID	=	3021;
		}
		break;
	case  27 : 
		{
			EffectID	=	706;						
		}
		break;
	default :
		{
			return Source;
		}
		break;
	}

	Source.Format (	_T("<VideoCompose Time = \"%d\" effectid=\"%d\" />"), InfoAtom.m_nTime, EffectID );	 

	return Source;
}

void CDrawingDocument::NormalizeTransitionTime()
{
	int Transition1 = 0;
	int Duration = 0;
	int Transition2 = 0;

	for(int i = 0; i < m_arPages.GetCount(); i++)
	{
		int index = m_mapTransitions.FindKey(i);
		if(index >= 0)
			Transition1 = m_mapTransitions.GetValueAt(index).m_nTime;
		else
			Transition1 = 0;

		Duration = m_arPages[i]->m_dDuration;

		index = m_mapTransitions.FindKey(i+1);
		if(index >= 0)
			Transition2 = m_mapTransitions.GetValueAt(index).m_nTime;
		else
			Transition2 = 0;

		if(i == 0)
		{
			if(Transition1 == 0)
				m_arPages[i]->m_dStartTime = 0;
			else
				m_arPages[i]->m_dStartTime = 1000;
		}
		else
			m_arPages[i]->m_dStartTime = m_arPages[i-1]->m_dStartTime + m_arPages[i-1]->m_dDuration;
		m_arPages[i]->m_dDuration = Transition1 + Duration + Transition2;
		m_arPages[i]->m_dEndTime = m_arPages[i]->m_dStartTime + m_arPages[i]->m_dDuration;

		for(int j = 0; j < m_arPages[i]->m_arElements.GetSize(); j++)
		{
			if(m_arPages[i]->m_arElements[j]->m_etType == etAudio)
			{
				if(((CAudioElement*)(m_arPages[i]->m_arElements[j]))->m_bWithVideo == false)
					continue;
			}
			if((m_arPages[i]->m_arElements[j]->m_etType == etVideo) || (m_arPages[i]->m_arElements[j]->m_etType == etAudio))
			{
				double VideoDuration = m_arPages[i]->m_arElements[j]->m_dEndTime - m_arPages[i]->m_arElements[j]->m_dStartTime;
				m_arPages[i]->m_arElements[j]->m_dStartTime = m_arPages[i]->m_dStartTime + Transition1;
				m_arPages[i]->m_arElements[j]->m_dEndTime = min(m_arPages[i]->m_dEndTime - Transition2, m_arPages[i]->m_dStartTime + Transition1 + VideoDuration);
			}
			else
			{
				
				m_arPages[i]->m_arElements[j]->m_dEndTime = m_arPages[i]->m_dDuration;
			}
		}
	}
}