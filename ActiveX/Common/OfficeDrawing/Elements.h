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


#include "Shapes\Shape.h"
#include "ElementSettings.h"

using namespace NSOfficeDrawing;

class CElementsContainer;


class IElement
{
public:
	BOOL m_bIsBackground;

	ElementType m_etType;
	CDoubleRect m_rcBounds;
	RECT m_rcBoundsOriginal;

	double m_dStartTime;
	double m_dEndTime;

	CInteractiveInfo m_oActions;
	CAnimationInfo m_oAnimations;

	LONG m_lID;
	LONG m_lMasterID;

	
	LONG m_lPlaceholderID;
	LONG m_lPlaceholderPosition;

	LONG m_lPersistIndex;

	
	
	
	
	
	IStream* m_pStream;
	LONG m_lOffsetTextStyle;
	LONG m_lOffsetTextProp;

	
	CMetricInfo m_oMetric;

	double m_dRotate;	
	bool m_bFlipH;		
	bool m_bFlipV;		
public:	
	IElement()
	{
		m_dRotate = 0.0;
		m_bFlipH = false;
		m_bFlipV = false;
	}
	virtual ~IElement()
	{
		m_pStream = NULL;
		m_lOffsetTextStyle = -1;
		m_lOffsetTextProp = -1;
	}

	virtual CString ToXml() = 0;
	virtual void NormalizeCoords(double dScaleX, double dScaleY)
	{
		m_rcBounds.left		= dScaleX * m_rcBoundsOriginal.left;
		m_rcBounds.right	= dScaleX * m_rcBoundsOriginal.right;
		m_rcBounds.top		= dScaleY * m_rcBoundsOriginal.top;
		m_rcBounds.bottom	= dScaleY * m_rcBoundsOriginal.bottom;

		
	}

	virtual void SetUpProperties(CProperties* pProps, CElementsContainer* pSlide);
	virtual IElement* CreateDublicate() = 0;

protected:
	virtual void SetUpProperty(CProperty* pProp, CElementsContainer* pSlide);

protected:
	virtual void SetProperiesToDublicate(IElement* pDublicate)
	{
		if (NULL == pDublicate)
			return;

		pDublicate->m_bIsBackground = m_bIsBackground;
		
		pDublicate->m_etType = m_etType;
		pDublicate->m_rcBounds = m_rcBounds;

		pDublicate->m_rcBoundsOriginal.left = m_rcBoundsOriginal.left;
		pDublicate->m_rcBoundsOriginal.top = m_rcBoundsOriginal.top;
		pDublicate->m_rcBoundsOriginal.right = m_rcBoundsOriginal.right;
		pDublicate->m_rcBoundsOriginal.bottom = m_rcBoundsOriginal.bottom;

		pDublicate->m_dStartTime = m_dStartTime;
		pDublicate->m_dEndTime = m_dEndTime;

		pDublicate->m_lID = m_lID;
		pDublicate->m_lMasterID = m_lMasterID;

		pDublicate->m_lPlaceholderID = m_lPlaceholderID;
		pDublicate->m_lPlaceholderPosition = m_lPlaceholderPosition;

		pDublicate->m_lPersistIndex = m_lPersistIndex;

		pDublicate->m_pStream = m_pStream;
		pDublicate->m_lOffsetTextStyle = m_lOffsetTextStyle;
		pDublicate->m_lOffsetTextProp = m_lOffsetTextProp;

		pDublicate->m_oMetric = m_oMetric;

		pDublicate->m_dRotate	= m_dRotate;
		pDublicate->m_bFlipH	= m_bFlipH;
		pDublicate->m_bFlipV	= m_bFlipV;
	}
};



class CVideoElement : public IElement
{
public:
	CStringW m_strFileName;

	double   m_dVideoDuration;
	
	BYTE m_nAlpha;
	LONG m_lAngle;

public:
	CVideoElement():IElement()
	{
		m_bIsBackground = FALSE;
		
		m_pStream = NULL;
		m_lOffsetTextStyle = -1;
		m_lOffsetTextProp = -1;
		
		m_lID = -1;
		m_lMasterID = -1;

		m_lPlaceholderID = -1;
		m_lPlaceholderPosition = -1;

		m_lPersistIndex = -1;

		m_etType = etVideo;
		
		m_rcBounds.left = 0; m_rcBounds.top = 0;
		m_rcBounds.right = 1; m_rcBounds.bottom = 1;

		m_rcBoundsOriginal.left = 0; m_rcBoundsOriginal.top = 0;
		m_rcBoundsOriginal.right = 1; m_rcBoundsOriginal.bottom = 1;

		m_strFileName = _T("");

		m_dStartTime = 0.0;
		m_dEndTime = 30.0;

		m_dVideoDuration = 0.0;

		m_nAlpha = 0xFF;
	}

	virtual ~CVideoElement()
	{
	}

	virtual CString ToXml()
	{
		
		

		double dCentreX = 100.0 * ((double)(m_rcBounds.right + m_rcBounds.left) / 2) / (double)m_oMetric.m_lMillimetresHor;
		double dCentreY = 100.0 * ((double)(m_rcBounds.top + m_rcBounds.bottom) / 2) / (double)m_oMetric.m_lMillimetresVer;

		double dWidth  = 100.0 * ((double)(m_rcBounds.right - m_rcBounds.left)) / (double)m_oMetric.m_lMillimetresHor;
		double dHeight = 100.0 * ((double)(m_rcBounds.bottom - m_rcBounds.top)) / (double)m_oMetric.m_lMillimetresVer;

		CString strOverlay = _T("");
		strOverlay.Format(_T("<OverlaySetting StartTime='%lf' EndTime='%lf'><AlphaTransparency>%d</AlphaTransparency><centerx>%lf</centerx><centery>%lf</centery><widthpercent>%lf</widthpercent><heightpercent>%lf</heightpercent><Rotate Angle='%d'/></OverlaySetting>"), 
							m_dStartTime, m_dEndTime, (int)m_nAlpha,
							dCentreX, dCentreY, dWidth, dHeight,
							(LONG)m_dRotate);

		int lIndex = m_strFileName.Find(L"file:///");
		if (0 == lIndex)
		{
			m_strFileName = m_strFileName.Mid(8);
			m_strFileName.Replace('/', '\\');
		}

		
		CString strFileName = StreamUtils::ConvertCStringWToCString(m_strFileName);
		NSAttributes::CorrectXmlString(strFileName);

		CString strSingleSource = _T("");
		strSingleSource.Format(_T("<SingleSource><VideoSources><VideoSource FilePath='%s' AudioTrack='0' StartTime='0' EndTime='-1' VideoTrack='0' SPTrack='-1' CropScale='0' ResizeType='1'/></VideoSources></SingleSource>"), 
			strFileName);
		
		

		return _T("<VideoOverlay>") + strOverlay + strSingleSource + _T("</VideoOverlay>");
	}

	virtual IElement* CreateDublicate()
	{
		CVideoElement* pVideoElement = new CVideoElement();
		
		SetProperiesToDublicate((IElement*)pVideoElement);

		pVideoElement->m_strFileName		= m_strFileName;
		pVideoElement->m_nAlpha				= m_nAlpha;

		pVideoElement->m_dVideoDuration		= m_dVideoDuration;

		return (IElement*)pVideoElement;
	}
};

class CImageElement : public IElement
{
public:
	CStringW m_strFileName;

	BYTE m_nAlpha;
	bool m_bApplyBounds;
    CDoubleRect m_rcImageBounds;
	CString m_strEffects;


public:
	CImageElement():IElement()
	{
		m_bIsBackground = FALSE;
		
		m_pStream = NULL;
		m_lOffsetTextStyle = -1;
		m_lOffsetTextProp = -1;
		
		m_lID = -1;
		m_lMasterID = -1;

		m_lPlaceholderID = -1;
		m_lPlaceholderPosition = -1;

		m_lPersistIndex = -1;

		m_etType = etPicture;
		
		m_rcBounds.left = 0; m_rcBounds.top = 0;
		m_rcBounds.right = 1; m_rcBounds.bottom = 1;

		m_rcBoundsOriginal.left = 0; m_rcBoundsOriginal.top = 0;
		m_rcBoundsOriginal.right = 1; m_rcBoundsOriginal.bottom = 1;

		m_strFileName = _T("");

		m_dStartTime = 0.0;
		m_dEndTime = 30.0;

		m_nAlpha = 0xFF;

		m_bApplyBounds = false;
		m_rcImageBounds.top = 0.0;
		m_rcImageBounds.left = 0.0;
		m_rcImageBounds.right = 0.0;
		m_rcImageBounds.bottom = 0.0;
		m_strEffects = _T("");
	}

	virtual ~CImageElement()
	{
	}

	virtual CString ToXml()
	{
		LONG lFlags = 0;
		if (m_bFlipH)
			lFlags |= 0x0001;
		if (m_bFlipV)
			lFlags |= 0x0002;

		CString strFileName = StreamUtils::ConvertCStringWToCString(m_strFileName);
		NSAttributes::CorrectXmlString(strFileName);

		

		CString strEffect = _T("");
		strEffect.Format(_T("<ImagePaint-DrawImageFromFile left='%d' top='%d' right='%d' bottom='%d' angle='%lf' flags='%d' filepath='%s' metric='0' backcolor='-1' scaletype='-1' scalecolor='255' widthmetric='%d' heightmetric='%d'>\
				<timeline type='1' begin='%lf' end='%lf' fadein='0' fadeout='0' completeness='1.0' /></ImagePaint-DrawImageFromFile>"), 
				(LONG)m_rcBounds.left, (LONG)m_rcBounds.top, (LONG)m_rcBounds.right, (LONG)m_rcBounds.bottom,
				m_dRotate, lFlags, StreamUtils::ConvertCStringWToCString(m_strFileName), 
				m_oMetric.m_lMillimetresHor, m_oMetric.m_lMillimetresVer, 
				m_dStartTime, m_dEndTime);
		
		return strEffect;
	}

	virtual void SetUpProperty(CProperty* pProp, CElementsContainer* pSlide);

	virtual IElement* CreateDublicate()
	{
		CImageElement* pImageElement = new CImageElement();
		
		SetProperiesToDublicate((IElement*)pImageElement);

		pImageElement->m_strFileName = m_strFileName;
		pImageElement->m_nAlpha = m_nAlpha;

		pImageElement->m_bApplyBounds = m_bApplyBounds;
		pImageElement->m_rcImageBounds.top = m_rcImageBounds.top;
		pImageElement->m_rcImageBounds.left = m_rcImageBounds.left;
		pImageElement->m_rcImageBounds.right = m_rcImageBounds.right;
		pImageElement->m_rcImageBounds.bottom = m_rcImageBounds.bottom;
		pImageElement->m_strEffects = m_strEffects;


		return (IElement*)pImageElement;
	}
};

class CTextElement : public IElement
{
public:
	CTextAttributesEx m_oSettings;

public:

	CTextElement():IElement()
	{
		m_bIsBackground = FALSE;
		
		m_pStream = NULL;
		m_lOffsetTextStyle = -1;
		m_lOffsetTextProp = -1;
		
		m_lID = -1;
		m_lMasterID = -1;

		m_lPlaceholderID = -1;
		m_lPlaceholderPosition = -1;

		m_lPersistIndex = -1;

		m_etType = etText;
	}

	virtual ~CTextElement()
	{
	}

	virtual CString ToXml()
	{
		CGeomShapeInfo oInfo;
		oInfo.SetBounds(m_rcBounds);

		oInfo.m_dRotate = m_dRotate;
		oInfo.m_bFlipH	= m_bFlipH;
		oInfo.m_bFlipV	= m_bFlipV;
		
		CString strXml = m_oSettings.ToString(oInfo, m_oMetric, m_dStartTime, m_dEndTime);
		return strXml;
	}


	virtual IElement* CreateDublicate()
	{
		CTextElement* pTextElement = new CTextElement();
		
		SetProperiesToDublicate((IElement*)pTextElement);

		pTextElement->m_oSettings = m_oSettings;

		return (IElement*)pTextElement;
	}
};

class CShapeElement : public IElement
{
private:
	NSBaseShape::ClassType m_ClassType;
public:
	int m_lShapeType;
	CString m_strXmlTransform;

	
	CShape m_oShape;
	
	
public:
	CShapeElement(NSBaseShape::ClassType ClassType, int eType) :IElement(), m_strXmlTransform(_T("")), m_lShapeType(eType), m_oShape(ClassType, eType)
	{
		m_bIsBackground = FALSE;
		m_ClassType = ClassType;
		
		m_pStream = NULL;
		m_lOffsetTextStyle = -1;
		m_lOffsetTextProp = -1;
		
		m_lID = -1;
		m_lMasterID = -1;

		m_lPlaceholderID = -1;
		m_lPlaceholderPosition = -1;

		m_lPersistIndex = -1;

		m_etType = etShape;

		

		m_oShape.m_rcBounds = m_rcBounds;

		m_oShape.m_dStartTime = m_dStartTime;
		m_oShape.m_dStartTime = m_dEndTime;
		
		
	}

	CShapeElement(const CString& str):IElement(), m_oShape(NSBaseShape::unknown, 0x1000)
	{
		m_lShapeType = 0x1000;
		m_oShape.LoadFromXML(str);
		m_ClassType = m_oShape.m_pShape->GetClassType();
	}

	virtual ~CShapeElement()
	{
		
	}

	virtual CString ToXml()
	{
		m_strXmlTransform = _T("");
		
		CGeomShapeInfo oInfo;
		oInfo.SetBounds(m_rcBounds);

		oInfo.m_dRotate = m_dRotate;
		oInfo.m_bFlipH	= m_bFlipH;
		oInfo.m_bFlipV	= m_bFlipV;

		m_strXmlTransform = m_oShape.ToXml(oInfo, m_oMetric, m_dStartTime, m_dEndTime);

		return m_strXmlTransform;
	}

	virtual void SetUpProperties(CProperties* pProps, CElementsContainer* pSlide);

	virtual IElement* CreateDublicate()
	{
		CShapeElement* pShapeElement = new CShapeElement(m_ClassType, m_lShapeType);
		
		SetProperiesToDublicate((IElement*)pShapeElement);

		m_oShape.SetToDublicate(&pShapeElement->m_oShape);
		
		pShapeElement->m_strXmlTransform = m_strXmlTransform;

		return (IElement*)pShapeElement;
	}
};

class CAudioElement : public IElement
{
public:
	CStringW m_strFileName;
	
	BYTE m_nAmplify;
	bool m_bWithVideo;
	double m_dAudioDuration;
	bool m_bLoop;

	double m_dClipStartTime;
	double m_dClipEndTime;

public:
	CAudioElement():IElement()
	{
		m_bIsBackground = FALSE;
		
		m_pStream = NULL;
		m_lOffsetTextStyle = -1;
		m_lOffsetTextProp = -1;
		
		m_lID = -1;
		m_lMasterID = -1;

		m_lPlaceholderID = -1;
		m_lPlaceholderPosition = -1;

		m_lPersistIndex = -1;

		m_etType = etAudio;
		
		m_rcBounds.left = 0; m_rcBounds.top = 0;
		m_rcBounds.right = 1; m_rcBounds.bottom = 1;

		m_rcBoundsOriginal.left = 0; m_rcBoundsOriginal.top = 0;
		m_rcBoundsOriginal.right = 1; m_rcBoundsOriginal.bottom = 1;

		m_strFileName = _T("");

		m_dStartTime = 0.0;
		m_dEndTime = 30.0;

		m_nAmplify = 100;
		m_bWithVideo = false;

		m_dAudioDuration = 0.0;
		m_bLoop = false;

		m_dClipStartTime	= 0.0;
		m_dClipEndTime		= -1.0;
	}

	virtual ~CAudioElement()
	{
	}

	virtual CString ToXml()
	{

		CString strOverlay1 = _T("");
		CString strOverlay2 = _T("");
		strOverlay1.Format(_T("<AudioSource StartTime='%lf' Duration='%lf' Amplify='%lf'>"), m_dStartTime, m_dEndTime-m_dStartTime, (double)m_nAmplify);

		int lIndex = m_strFileName.Find(L"file:///");
		if (0 == lIndex)
		{
			m_strFileName = m_strFileName.Mid(8);
			m_strFileName.Replace('/', '\\');
			m_strFileName.Replace(L"%20", L" ");
		}

		CString strFileName = StreamUtils::ConvertCStringWToCString(m_strFileName);
		NSAttributes::CorrectXmlString(strFileName);
		
		strOverlay2.Format(_T("<Source StartTime='%lf' EndTime='%lf' FilePath='%s'/></AudioSource>"), m_dClipStartTime, m_dClipEndTime, strFileName);

		
		strOverlay1 += strOverlay2;

		return strOverlay1;
	}

	virtual IElement* CreateDublicate()
	{
		CAudioElement* pAudioElement = new CAudioElement();
		
		SetProperiesToDublicate((IElement*)pAudioElement);

		pAudioElement->m_strFileName = m_strFileName;
		pAudioElement->m_nAmplify = m_nAmplify;
		pAudioElement->m_bWithVideo = m_bWithVideo;

		pAudioElement->m_dAudioDuration = m_dAudioDuration;
		pAudioElement->m_bLoop			= m_bLoop;

		pAudioElement->m_dClipStartTime	= m_dClipStartTime;
		pAudioElement->m_dClipEndTime	= m_dClipEndTime;

		return (IElement*)pAudioElement;
	}
};
