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
#include "Enums.h"
#include "Structures.h"

using namespace NSOfficeDrawing;
using namespace NSOfficePPT;

class CTypeTransform
{
	RECT m_oRect;
	LONG m_nAngle;

	bool m_bIsFlipV;
	bool m_bIsFlipH;

	bool m_bIsFlipVUse;
	bool m_bIsFlipHUse;

public:
	CTypeTransform()
	{
		m_oRect.left = 0; m_oRect.top = 0;
		m_oRect.right = 1; m_oRect.bottom = 1;

		m_nAngle = 0;

		m_bIsFlipH = false;
		m_bIsFlipV = false;

		m_bIsFlipHUse = false;
		m_bIsFlipVUse = false;
	}
};

class CTypeProtection
{
	bool m_bLockAgainstUngrouping;
	bool m_bLockRotation;
	bool m_bLockAspectRatio;
	bool m_bLockPosition;
	bool m_bLockAgainstSelect;
	bool m_bLockCropping;
	bool m_bLockVertices;
	bool m_bLockText;
	bool m_bLockAdjustHandles;
	bool m_bLockAgainstGrouping;

public:
	CTypeProtection()
	{
		m_bLockAgainstUngrouping = false;
		m_bLockRotation = false;
		m_bLockAspectRatio = false;
		m_bLockPosition = false;
		m_bLockAgainstSelect = false;
		m_bLockCropping = false;
		m_bLockVertices = false;
		m_bLockText = false;
		m_bLockAdjustHandles = false;
		m_bLockAgainstGrouping = false;
	}
};

class CTypeText
{
	LONG m_lTextID;
	RECT m_oBounds;

	NSOfficeDrawing::WrapMode m_WrapMode;
	LONG m_lScale;

	AnchorMode m_AnchorMode;

	TxflMode m_FlMode;

	CdirMode m_FontRotation;

	DWORD m_lNextID;

	TxDirMode m_DirMode;

	LONG m_lColomnsCount;
	LONG m_lMarginColomn;

	bool m_bSelectText;  
	bool m_bAutoTextMargin;
	bool m_bRotateText;
	bool m_bFitShapeToText;
	bool m_bFitTextToShape;

public:
	CTypeText()
	{
		m_lTextID = 0;

		m_oBounds.left = 0x00016530;
		m_oBounds.top = 0x0000B298;
		m_oBounds.right = 0x00016530;
		m_oBounds.bottom = 0x0000B298;

		m_WrapMode = wrapSquare;

		m_lScale = 0;

		m_AnchorMode = anchorTop;

		m_FlMode = txflHorzN;

		m_FontRotation = cdir0;

		m_DirMode = txdirLTR;

		m_lNextID = 0;

		LONG m_lColomnsCount = 1;
		LONG m_lMarginColomn = 91440;

		bool m_bSelectText = true;  
		bool m_bAutoTextMargin = false;
		bool m_bRotateText = false;
		bool m_bFitShapeToText = false;
		bool m_bFitTextToShape = false;
	}
};

class CTypeGeoText
{
	CStringW m_strText;
	GeoTextAlign m_Align;

	DWORD m_nSize;
	DWORD m_nTextSpacing;

	CStringW m_strFontFamily;
	CStringW m_strFontCSS;

	bool m_bReverseRows;
	bool m_bEffect;
	bool m_bVertical;
	bool m_bKern;

	bool m_bTight;
	bool m_bStretch; 
	bool m_bShrinkFit;
	bool m_bBestFit;
	bool m_bNormalize;
	bool m_bDxMeasure;
	bool m_bBold;
	bool m_bItalic;
	bool m_bUnderline;
	bool m_bShadow; 
	bool m_bSmallcaps;
	bool m_bStrikethrough;

public:
	CTypeGeoText()
	{
		m_strText = _T("");
		m_Align = alignTextCenter;

		m_nSize = 0x00240000;
		m_nTextSpacing = 0x00010000;

		m_strFontFamily = _T("");
		m_strFontCSS = _T("");

		m_bReverseRows = false;
		m_bEffect = false;
		m_bVertical = false;
		m_bKern = false;

		m_bTight = false;
		m_bStretch = false; 
		m_bShrinkFit = false;
		m_bBestFit = false;
		m_bNormalize = false;
		m_bDxMeasure = false;
		m_bBold = false;
		m_bItalic = false;
		m_bUnderline = false;
		m_bShadow = false; 
		m_bSmallcaps = false;
		m_bStrikethrough = false;
	}
};

class CTypeBlip
{
	RECT m_oCropRect;

	DWORD m_nImageNumber;
	
	
	CStringW m_strFileName;
	BlipFlags m_Flag;

	SColorAtom m_oTransparentColor;

	LONG m_nContrast;
	LONG m_nBrightness;
	LONG m_nGamma;
	LONG m_nPictureID;

	bool m_bPicturePreserveGrays;
	bool m_bRewind;
	bool m_bLooping;
	bool m_bPictureGray;
	bool m_bPictureBiLevel;
	bool m_bPictureActive;

public:
	CTypeBlip()
	{
		m_oCropRect.top = 0; m_oCropRect.left = 0;
		m_oCropRect.right = 0; m_oCropRect.bottom = 0;

		m_strFileName = _T("");
		m_Flag = blipflagComment;

		m_oTransparentColor.R = 0xFF;
		m_oTransparentColor.G = 0xFF;
		m_oTransparentColor.B = 0xFF;
		m_oTransparentColor.Index = 0xFF;

		m_nContrast = 0x0001FFFF;
		m_nBrightness = 0;
		m_nGamma = 0;
		m_nPictureID = 0;

		m_bPicturePreserveGrays = false;
		m_bRewind = false;
		m_bLooping = false;
		m_bPictureGray = false;
		m_bPictureBiLevel = false;
		m_bPictureActive = false;
	}
};

class CTypeGeometry
{
	RECT m_oGeoRect;

	ShapePath m_Path;

	CString m_strVertices;
	CString m_strSegmentInfo;

	LONG m_lAdjustValue1;
	LONG m_lAdjustValue2;
	LONG m_lAdjustValue3;
	LONG m_lAdjustValue4;
	LONG m_lAdjustValue5;
	LONG m_lAdjustValue6;
	LONG m_lAdjustValue7;
	LONG m_lAdjustValue8;
	LONG m_lAdjustValue9;
	LONG m_lAdjustValue10;

	CString m_strConnectionsSites;
	CString m_strConnectionsSitesDir;

	LONG m_nLimoX;
	LONG m_nLimoY;

	CString m_strAdjustHandles;
	CString m_strGuides;
	CString m_strInscribe;

	bool m_bColumnLine;
	bool m_bShadowOK;
	bool m_b3DOK;
	bool m_bLineOK;
	bool m_bGtextOK;
	bool m_bFillShadeShapeOK;
	bool m_bFillOK;

public:
	CTypeGeometry()
	{
		m_oGeoRect.left = 0; m_oGeoRect.top = 0;
		m_oGeoRect.right = 21600; m_oGeoRect.bottom = 21600;

		m_Path = shapeLinesClosed;

		m_strVertices = _T("");
		m_strSegmentInfo = _T("");

		m_lAdjustValue1 = 0;
		m_lAdjustValue2 = 0;
		m_lAdjustValue3 = 0;
		m_lAdjustValue4 = 0;
		m_lAdjustValue5 = 0;
		m_lAdjustValue6 = 0;
		m_lAdjustValue7 = 0;
		m_lAdjustValue8 = 0;
		m_lAdjustValue9 = 0;
		m_lAdjustValue10 = 0;

		m_strConnectionsSites = _T("");
		m_strConnectionsSitesDir = _T("");

		m_nLimoX = 0x80000000;
		m_nLimoY = 0x80000000;

		m_strAdjustHandles = _T("");
		m_strGuides = _T("");
		m_strInscribe = _T("");

		m_bColumnLine = false;
		m_bShadowOK = true;
		m_b3DOK = true;
		m_bLineOK = true;
		m_bGtextOK = false;
		m_bFillShadeShapeOK = false;
		m_bFillOK = true;
	}
};

class CTypeFillStyle
{
	FillType m_FillType;
	SColorAtom m_oColor;
	
	LONG m_nFillOpacity;
	SColorAtom m_oFillBackColor;
	
	LONG m_nFillBackOpacity;

	DWORD m_nImageNumber;
	
	
	
	CStringW m_strFillBlipName;
	BlipFlags m_FillBlipFlags;
	
	LONG m_lFillWidth;
	LONG m_lFillHeight;
	LONG m_lFillAngle;
	LONG m_lFillFocus;
	
	RECT m_oFillToRect;
	RECT m_oFillRect;
	
	DzType m_FillDztype;
	
	CSimpleArray<SColorAtom> m_arFillShadeColors;
		
	LONG m_arFillShadePreset;
	
	LONG m_nFillOriginX;
	LONG m_nFillOriginY;
	LONG m_nFillShapeOriginX;
	LONG m_nFillShapeOriginY;
	
	ShadeType m_FillShadeType;

	bool m_bRecolorFillAsPicture;
	bool m_bUseShapeAnchor;
	bool m_bFilled;
	bool m_bHitTestFill;
	bool m_billShape;
	bool m_billUseRect;
	bool m_bNoFillHitTest;

public:
	CTypeFillStyle() : m_arFillShadeColors()
	{
		m_FillType = fillSolid;
		
		m_oColor.FromValue(0xFF, 0xFF, 0xFF);
		
		m_nFillOpacity = 0x00010000;
		m_oFillBackColor.FromValue(0xFF, 0xFF, 0xFF);
		
		m_nFillBackOpacity = 0x00010000;

		m_nImageNumber = 0;
		
		m_strFillBlipName = _T("");
		m_FillBlipFlags = blipflagComment;
		
		m_lFillWidth = 0;
		m_lFillHeight = 0;
		m_lFillAngle = 0;
		m_lFillFocus = 0;
		
		m_oFillToRect.left = 0; m_oFillToRect.top = 0;
		m_oFillToRect.right = 0; m_oFillToRect.bottom = 0;

		m_oFillRect.left = 0; m_oFillRect.top = 0;
		m_oFillRect.right = 0; m_oFillRect.bottom = 0;
		
		m_FillDztype = dztypeDefault;
		
		m_arFillShadePreset = 0;
		
		m_nFillOriginX = 0;
		m_nFillOriginY = 0;
		m_nFillShapeOriginX = 0;
		m_nFillShapeOriginY = 0;
		
		m_FillShadeType = shadeDefault;

		m_bRecolorFillAsPicture = false;
		m_bUseShapeAnchor = true;
		m_bFilled = true;
		m_bHitTestFill = true;
		m_billShape = true;
		m_billUseRect = false;
		m_bNoFillHitTest = false;
	}
};

class CTypeLineStyle
{
	SColorAtom m_oColor;
	LONG m_nOpacity;

	SColorAtom m_oBackColor;
	SColorAtom m_oCrMod;

	LineType m_Type;

	DWORD m_nImageNumber;
	
	
	CStringW m_strFileName;
	BlipFlags m_Flag;
	 
	LONG m_nFillWidth;
	LONG m_nFillHeight;
	
	DzType m_FillDztype;

	LONG m_nWidth;
	LONG m_nMiterLimit;

	LinesStyle m_Style;
	LineDashing m_Dashing;
	
	BYTE* m_pDashStyle;
	
	LineEnd m_StartArrowhead;
	LineEnd m_Arrowhead;
	
	LineEndWidth m_StartArrowWidth;
	LineEndLength m_StartArrowLength;
	
	LineEndWidth m_EndArrowWidth;
	LineEndLength m_EndArrowLength;
	
	_LineJoin m_JoinStyle;
	_LineCap m_EndCapStyle;
	
	bool m_bInsetPen;
	bool m_bInsetPenOK;
	bool m_bArrowheadsOK;
	bool m_bLine;
	bool m_bHitTestLine;
	bool m_bFillShape;
	bool m_bNoLineDrawDash;

public:
	CTypeLineStyle()
	{
		m_oColor.FromValue(00, 00, 00);
		m_nOpacity = 0x00010000;

		m_oBackColor.FromValue(0xFF, 0xFF, 0xFF);
		m_oCrMod.FromValue(0xFF, 0xFF, 0xFF);

		m_Type = lineSolidType;

		m_nImageNumber = 0;
		m_strFileName = _T("");
		
		m_Flag = blipflagComment;
		 
		m_nFillWidth = 0;
		m_nFillHeight = 0;
		
		m_FillDztype = dztypeDefault;

		m_nWidth = 9525;
		m_nMiterLimit = 0x00080000;

		m_Style = lineSimple;
		m_Dashing = lineSolid;
		
		m_pDashStyle = NULL;
		
		m_StartArrowhead = lineNoEnd;
		m_Arrowhead = lineNoEnd;
		
		m_StartArrowWidth = lineMediumWidthArrow;
		m_StartArrowLength = lineMediumLenArrow;
		
		m_EndArrowWidth = lineMediumWidthArrow;
		m_EndArrowLength = lineMediumLenArrow;
		
		m_JoinStyle = lineJoinRound;
		m_EndCapStyle = lineEndCapFlat;
		
		m_bInsetPen = false;
		m_bInsetPenOK = true;
		m_bArrowheadsOK = false;
		m_bLine = true;
		m_bHitTestLine = true;
		m_bFillShape = true;
		m_bNoLineDrawDash = false;
	}
};

class CTypeShadowStyle
{
	ShadowType m_Type;
	
	SColorAtom m_oColor;
	SColorAtom m_Highlight;
	
	LONG m_nOpacity;
	
	LONG m_nOffsetX;
	LONG m_nOffsetY;
	
	LONG m_nSecondOffsetX;
	LONG m_nSecondOffsetY;
	
	LONG m_nScaleXToX;
	LONG m_nScaleYToX;
	LONG m_nScaleXToY;
	LONG m_nScaleYToY;
	
	LONG m_nPerspectiveX;
	LONG m_nPerspectiveY;
	
	LONG m_nWeight;
	
	LONG m_nOriginX;
	LONG m_nOriginY;
	
	bool m_bShadow;
	bool m_bShadowObscured;

public:
	CTypeShadowStyle()
	{
		m_Type = shadowOffset;
	
		m_oColor.FromValue(0x80, 0x80, 0x80);
		m_Highlight.FromValue(0xCB, 0xCB, 0xCB);
		
		m_nOpacity = 0x00010000;
		
		m_nOffsetX = 25400;
		m_nOffsetY = 25400;
		
		m_nSecondOffsetX = 0;
		m_nSecondOffsetY = 0;
		
		m_nScaleXToX = 0x00010000;
		m_nScaleYToX = 0;
		m_nScaleXToY = 0;
		m_nScaleYToY = 0x00010000;
		
		m_nPerspectiveX = 0;
		m_nPerspectiveY = 0;
		
		m_nWeight = 0x00000100;
		
		m_nOriginX = 0;
		m_nOriginY = 0;
		
		m_bShadow = false;
		m_bShadowObscured = false;
	}
};

class CTypePerspectiveStyle
{
	XFormType m_Type;
	LONG m_nOffsetX;
	LONG m_nOffsetY;
	
	LONG m_nScaleXToX;
	LONG m_nScaleYToX;
	LONG m_nScaleXToY;
	LONG m_nScaleYToY;
	
	LONG m_nPerspectiveX;
	LONG m_nPerspectiveY;
	
	LONG m_nWeight;
	
	LONG m_nOriginX;
	LONG m_nOriginY;
	
	bool m_bPerspective;

public:
	CTypePerspectiveStyle()
	{
		m_Type = xformShape;
		m_nOffsetX = 0;
		m_nOffsetY = 0;
		
		m_nScaleXToX = 0x00010000;
		m_nScaleYToX = 0;
		m_nScaleXToY = 0;
		m_nScaleYToY = 0x00010000;
		
		m_nPerspectiveX = 0;
		m_nPerspectiveY = 0;
		
		m_nWeight = 0x00000100;
		
		m_nOriginX = 0x00008000;
		m_nOriginY = 0x00008000;
		
		m_bPerspective = false;
	}
};

class CType3DObject
{
	LONG m_c3DSpecularAmt;
	LONG m_c3DDiffuseAmt;
	LONG m_c3DShininess;
	LONG m_c3DEdgeThickness;
	LONG m_c3DExtrudeForward;
	LONG m_c3DExtrudeBackward;
	LONG m_c3DExtrudePlane;
	
	SColorAtom m_c3DExtrusionColor;
	SColorAtom c3DCrMod;
	
	bool m_b3D;
	bool m_bc3DMetallic;
	bool m_bc3DUseExtrusionColor;
	bool m_bc3DLightFace;

public:
	CType3DObject()
	{
		m_c3DSpecularAmt = 0;
		m_c3DDiffuseAmt = 0x00010000;
		m_c3DShininess = 5;
		m_c3DEdgeThickness = 12700;
		m_c3DExtrudeForward = 0;
		m_c3DExtrudeBackward = 457200;
		m_c3DExtrudePlane = 0;
		
		m_c3DExtrusionColor.FromValue(0xFF, 0xFF, 0xFF);
		c3DCrMod.FromValue(0xFF, 0xFF, 0xFF);
		
		m_b3D = false;
		m_bc3DMetallic = false;
		m_bc3DUseExtrusionColor = false;
		m_bc3DLightFace = true;
	}
};

class CType3DStyle
{
	LONG m_c3DYRotationAngle;
	LONG m_c3DXRotationAngle;
	
	LONG m_c3DRotationAxisX;
	LONG m_c3DRotationAxisY;
	LONG m_c3DRotationAxisZ;

	LONG m_c3DRotationAngle;
	
	LONG m_c3DRotationCenterX;
	LONG m_c3DRotationCenterY;
	LONG m_c3DRotationCenterZ;
	
	e3DRenderMode c3DRenderMode;
	
	LONG m_c3DTolerance;

	LONG m_c3DXViewpoint;
	LONG m_c3DYViewpoint;
	LONG m_c3DZViewpoint;
	
	LONG m_c3DOriginX;
	LONG m_c3DOriginY;
	
	LONG m_c3DSkewAngle;
	LONG m_c3DSkewAmount;
	LONG m_c3DAmbientIntensity;
	
	LONG m_c3DKeyX;
	LONG m_c3DKeyY;
	LONG m_c3DKeyZ;
	
	LONG m_c3DKeyIntensity;
	
	LONG m_c3DFillX;
	LONG m_c3DFillY;
	LONG m_c3DFillZ;
	LONG m_c3DFillIntensity;
	
	bool m_bc3DConstrainRotation;
	bool m_bc3DRotationCenterAuto;
	bool m_bc3DParallel;
	bool m_bc3DKeyHarsh;
	bool m_bc3DFillHarsh;

public:
	CType3DStyle()
	{
		m_c3DYRotationAngle = 0;
		m_c3DXRotationAngle = 0;
		
		m_c3DRotationAxisX = 100;
		m_c3DRotationAxisY = 0;
		m_c3DRotationAxisZ = 0;

		m_c3DRotationAngle = 0;
		
		m_c3DRotationCenterX = 0;
		m_c3DRotationCenterY = 0;
		m_c3DRotationCenterZ = 0;
		
		c3DRenderMode = FullRender;
		
		m_c3DTolerance = 30000;

		m_c3DXViewpoint = 1250000;
		m_c3DYViewpoint = -1250000;
		m_c3DZViewpoint = 9000000;
		
		m_c3DOriginX = 32768;
		m_c3DOriginY = -32768;
		
		m_c3DSkewAngle = -8847360;
		m_c3DSkewAmount = 50;
		m_c3DAmbientIntensity = 20000;
		
		m_c3DKeyX = 50000;
		m_c3DKeyY = 0;
		m_c3DKeyZ = 10000;
		
		m_c3DKeyIntensity = 38000;
		
		m_c3DFillX = -50000;
		m_c3DFillY = 0;
		m_c3DFillZ = 10000;
		m_c3DFillIntensity = 38000;
		
		m_bc3DConstrainRotation = true;
		m_bc3DRotationCenterAuto = false;
		m_bc3DParallel = true;
		m_bc3DKeyHarsh = true;
		m_bc3DFillHarsh = false;
	}
};

class CTypeShape
{
	DWORD m_MasterID;
	
	CxStyle m_cxstyle;
	
	BwMode m_bWMode;
	BwMode m_bWModePureBW;
	BwMode m_bWModeBW;
	
	LONG m_nIdDiscussAnchor;
	
	DGMLO m_dgmLayout;
	DGMNK m_dgmNodeKind;
	DGMLO m_dgmLayoutMRU;
	
	CString m_strEquationXML;
	
	bool m_bPolicyLabel;
	bool m_bPolicyBarcode;
	bool m_bFlipHQFE5152;
	bool m_bFlipVQFE5152;
	
	bool m_bPreferRelativeResize;
	bool m_bLockShapeType;
	bool m_bInitiator;
	bool m_bDeleteAttachedObject;
	bool m_bBackground;

public:
	CTypeShape()
	{
		m_MasterID = 0;
	
		m_cxstyle = cxstyleNone;
		
		m_bWMode = bwAutomatic;
		m_bWModePureBW = bwAutomatic;
		m_bWModeBW = bwAutomatic;
		
		m_nIdDiscussAnchor = 0;
		
		m_dgmLayout = dgmloNil;
		m_dgmNodeKind = dgmnkNil;
		m_dgmLayoutMRU = dgmloNil;
		
		m_strEquationXML = _T("");
		
		m_bPolicyLabel = false;
		m_bPolicyBarcode = false;
		m_bFlipHQFE5152 = false;
		m_bFlipVQFE5152 = false;
		
		m_bPreferRelativeResize = false;
		m_bLockShapeType = false;
		m_bInitiator = false;
		m_bDeleteAttachedObject = false;
		m_bBackground = false;
	}
};

class CTypeGroupShape
{
	CStringW m_strName;
	CStringW m_strDescription;

	CStringW m_strHyperlink;
	
	BYTE* m_pWrapPolygonVertices;

	RECT m_DxRectWrapDist;

	LONG m_nRegroupID;
	
	RECT m_RectGroup;
	
	CStringW m_strTooltip;
	CStringW m_strScript;
	
	LONG m_nPercentHR;
	LONG m_AlignHR;
	
	LONG m_nDxHeightHR;
	LONG m_nDxWidthHR;
	
	CStringW m_strScriptExtAttr;

	LONG m_nScriptLang;
	
	CStringW m_strScriptIdAttr;
	CStringW m_strScriptLangAttr;
	
	SColorAtom m_oBorderTopColor;
	SColorAtom m_oBorderLeftColor;
	SColorAtom m_oBorderBottomColor;
	SColorAtom m_oBorderRightColor;

	LONG m_nTableProperties;
	BYTE* m_pTableRowProperties;
	LONG m_nScriptHtmlLocation;
	
	CStringW m_strApplet;

	CStringW m_strFrameTrgtUnused;
	CStringW m_strWebBot;
	CStringW m_strAppletArg;
	CStringW m_strAccessBlob;
	
	BYTE* m_pMetroBlob;
	
	LONG m_dhgt;
	
	bool m_bLayoutInCell;
	bool m_bIsBullet;
	bool m_bStandardHR;
	bool m_bNoshadeHR;
	bool m_bHorizRule;
	bool m_bUserDrawn;
	bool m_bAllowOverlap;
	bool m_bReallyHidden;
	bool m_bScriptAnchor;

public:
	CTypeGroupShape()
	{
		m_strName = _T("");
		m_strDescription = _T("");

		m_strHyperlink = _T("");
		
		m_pWrapPolygonVertices = NULL;

		m_DxRectWrapDist.left =  0x0001BE7C; m_DxRectWrapDist.top = 0;
		m_DxRectWrapDist.right =  0x0001BE7C; m_DxRectWrapDist.bottom = 0;

		LONG m_nRegroupID = 0;
		
		m_RectGroup.left =  0; m_RectGroup.top = 0;
		m_RectGroup.right =  20000; m_RectGroup.bottom = 20000;
		
		m_strTooltip = _T("");
		m_strScript = _T("STD");
		
		m_nPercentHR = 1000;
		m_AlignHR = 0;
		
		m_nDxHeightHR = 0;
		m_nDxWidthHR = 0;
		
		m_strScriptExtAttr = _T("STD");
		m_nScriptLang = 1;
		
		m_strScriptIdAttr = _T("STD");
		m_strScriptLangAttr = _T("STD");
		
		m_oBorderTopColor.FromValue(0xFF, 0xFF, 0xFF);
		m_oBorderLeftColor.FromValue(0xFF, 0xFF, 0xFF);
		m_oBorderBottomColor.FromValue(0xFF, 0xFF, 0xFF);
		m_oBorderRightColor.FromValue(0xFF, 0xFF, 0xFF);

		m_nTableProperties = 0;
		m_pTableRowProperties = NULL;
		m_nScriptHtmlLocation = 2;
		
		m_strApplet = _T("");

		m_strFrameTrgtUnused = _T("");
		m_strWebBot = _T("STD");
		m_strAppletArg = _T("");
		m_strAccessBlob = _T("");
		
		m_pMetroBlob = NULL;
		
		m_dhgt = 0;
		
		m_bLayoutInCell = true;
		m_bIsBullet = false;
		m_bStandardHR = false;
		m_bNoshadeHR = false;
		m_bHorizRule = false;
		m_bUserDrawn = false;
		m_bAllowOverlap = true;
		m_bReallyHidden = false;
		m_bScriptAnchor = false;
	}
};

