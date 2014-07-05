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
#include "PPTShape.h"
#include "PresetShapesHeader.h"

#include "..\..\..\ElementsContainer.h"

const double EMU_MM = 36000;


#define CREATE_BY_SPT(SHAPE_TYPE, CLASS_SHAPE_NAME)								\
	case SHAPE_TYPE: { pShape = new CLASS_SHAPE_NAME(); break; }				\


using namespace PPTShapes;
CPPTShape* CPPTShape::CreateByType(PPTShapes::ShapeType type)
{
	CPPTShape* pShape = NULL;
	switch (type)
	{
	case 0: { pShape = new CPPTShape(); break; }
		

		CREATE_BY_SPT(sptAccentBorderCallout90, CAccentBorderCallout90Type)
		CREATE_BY_SPT(sptAccentBorderCallout1, CAccentBorderCallout1Type)
		CREATE_BY_SPT(sptAccentBorderCallout2, CAccentBorderCallout2Type)
		CREATE_BY_SPT(sptAccentBorderCallout3, CAccentBorderCallout3Type)

		CREATE_BY_SPT(sptAccentCallout90, CAccentCallout90Type)
		CREATE_BY_SPT(sptAccentCallout1, CAccentCallout1Type)
		CREATE_BY_SPT(sptAccentCallout2, CAccentCallout2Type)
		CREATE_BY_SPT(sptAccentCallout3, CAccentCallout3Type)

		CREATE_BY_SPT(sptBorderCallout90, CBorderCallout90Type)
		CREATE_BY_SPT(sptBorderCallout1, CBorderCallout1Type)
		CREATE_BY_SPT(sptBorderCallout2, CBorderCallout2Type)
		CREATE_BY_SPT(sptBorderCallout3, CBorderCallout3Type)

		CREATE_BY_SPT(sptCallout90, CCallout90Type)
		CREATE_BY_SPT(sptCallout1, CCallout1Type)
		CREATE_BY_SPT(sptCallout2, CCallout2Type)
		CREATE_BY_SPT(sptCallout3, CCallout3Type)

		CREATE_BY_SPT(sptActionButtonBlank, CActionButtonBlankType)
		CREATE_BY_SPT(sptActionButtonHome, CActionButtonHomeType)
		CREATE_BY_SPT(sptActionButtonHelp, CActionButtonHelpType)
		CREATE_BY_SPT(sptActionButtonInformation, CActionButtonInfoType)
		CREATE_BY_SPT(sptActionButtonBackPrevious, CActionButtonBackType)
		CREATE_BY_SPT(sptActionButtonForwardNext, CActionButtonNextType)
		CREATE_BY_SPT(sptActionButtonBeginning, CActionButtonBeginType)
		CREATE_BY_SPT(sptActionButtonEnd, CActionButtonEndType)
		CREATE_BY_SPT(sptActionButtonReturn, CActionButtonReturnType)
		CREATE_BY_SPT(sptActionButtonDocument, CActionButtonDocType)
		CREATE_BY_SPT(sptActionButtonSound, CActionButtonSoundType)
		CREATE_BY_SPT(sptActionButtonMovie, CActionButtonMovieType)
		
		CREATE_BY_SPT(sptArc, CArcType)
		CREATE_BY_SPT(sptLine, CLineType)

		CREATE_BY_SPT(sptBentArrow, CBentArrowType)
		CREATE_BY_SPT(sptBentUpArrow, CBentUpArrowType)
		CREATE_BY_SPT(sptBevel, CBevelType)
		CREATE_BY_SPT(sptBlockArc, CBlockArcType)
		CREATE_BY_SPT(sptBracePair, CBracePairType)
		CREATE_BY_SPT(sptBracketPair, CBracketPairType)
		
		CREATE_BY_SPT(sptCan, CCanType)
		CREATE_BY_SPT(sptChevron, CChevronType)
		CREATE_BY_SPT(sptCircularArrow, CCircularArrowType)
		CREATE_BY_SPT(sptCloudCallout, CCloudCalloutType)
		CREATE_BY_SPT(sptCube, CCubeType)
		CREATE_BY_SPT(sptCurvedDownArrow, CCurvedDownArrowType)
		CREATE_BY_SPT(sptCurvedLeftArrow, CCurvedLeftArrowType)
		CREATE_BY_SPT(sptCurvedRightArrow, CCurvedRightArrowType)
		CREATE_BY_SPT(sptCurvedUpArrow, CCurvedUpArrowType)

		CREATE_BY_SPT(sptDiamond, CDiamondType)
		CREATE_BY_SPT(sptDonut, CDonutType)
		CREATE_BY_SPT(sptDownArrowCallout, CDownArrowCalloutType)
		CREATE_BY_SPT(sptDownArrow, CDownArrowType)

		CREATE_BY_SPT(sptEllipse, CEllipseType)
		CREATE_BY_SPT(sptEllipseRibbon, CEllipceRibbonType)
		CREATE_BY_SPT(sptEllipseRibbon2, CEllipceRibbon2Type)

		CREATE_BY_SPT(sptFlowChartAlternateProcess, CFlowChartAlternateProcessType)
		CREATE_BY_SPT(sptFlowChartCollate, CFlowChartCollateType)
		CREATE_BY_SPT(sptFlowChartConnector, CFlowChartConnectorType)
		CREATE_BY_SPT(sptFlowChartDecision, CFlowChartDecisionType)
		CREATE_BY_SPT(sptFlowChartDisplay, CFlowChartDisplayType)
		CREATE_BY_SPT(sptFlowChartDelay, CFlowChartDelayType)
		CREATE_BY_SPT(sptFlowChartDocument, CFlowChartDocumentType)
		CREATE_BY_SPT(sptFlowChartExtract, CFlowChartExtractType)
		CREATE_BY_SPT(sptFlowChartInputOutput, CFlowChartInputOutputType)
		CREATE_BY_SPT(sptFlowChartInternalStorage, CFlowChartInternalStorageType)
		CREATE_BY_SPT(sptFlowChartMagneticDisk, CFlowChartMagneticDiskType)
		CREATE_BY_SPT(sptFlowChartMagneticDrum, CFlowChartMagneticDrumType)
		CREATE_BY_SPT(sptFlowChartMagneticTape, CFlowChartMagneticTapeType)
		CREATE_BY_SPT(sptFlowChartManualInput, CFlowChartManualInputType)
		CREATE_BY_SPT(sptFlowChartManualOperation, CFlowChartManualOperationType)
		CREATE_BY_SPT(sptFlowChartMerge, CFlowChartMergeType)
		CREATE_BY_SPT(sptFlowChartMultidocument, CFlowChartMultidocumentType)
		CREATE_BY_SPT(sptFlowChartOffpageConnector, CFlowChartOffpageConnectorType)
		CREATE_BY_SPT(sptFlowChartOnlineStorage, CFlowChartOnlineStorageType)
		CREATE_BY_SPT(sptFlowChartOr, CFlowChartOrType)
		CREATE_BY_SPT(sptFlowChartPredefinedProcess, CFlowChartPredefinedProcessType)
		CREATE_BY_SPT(sptFlowChartPreparation, CFlowChartPreparationType)
		CREATE_BY_SPT(sptFlowChartProcess, CFlowChartProcessType)
		CREATE_BY_SPT(sptFlowChartPunchedCard, CFlowChartPunchedCardType)
		CREATE_BY_SPT(sptFlowChartPunchedTape, CFlowChartPunchedTapeType)
		CREATE_BY_SPT(sptFlowChartSort, CFlowChartSortType)
		CREATE_BY_SPT(sptFlowChartSummingJunction, CFlowChartSummingJunctionType)
		CREATE_BY_SPT(sptFlowChartTerminator, CFlowChartTerminatorType)
		CREATE_BY_SPT(sptFoldedCorner, CFoldedCornerType)

		CREATE_BY_SPT(sptHeart, CHeartType)
		CREATE_BY_SPT(sptHexagon, CHexagonType)
		CREATE_BY_SPT(sptHomePlate, CHomePlateType)

		CREATE_BY_SPT(sptIrregularSeal1, CIrregularSealOneType)
		CREATE_BY_SPT(sptIrregularSeal2, CIrregularSealTwo)
		CREATE_BY_SPT(sptIsocelesTriangle, CIsoscelesTriangleType)

		CREATE_BY_SPT(sptLeftArrowCallout, CLeftArrowCalloutType)
		CREATE_BY_SPT(sptLeftArrow, CLeftArrowType)
		CREATE_BY_SPT(sptLeftBrace, CLeftBraceType)
		CREATE_BY_SPT(sptLeftBracket, CLeftBracketType)
		CREATE_BY_SPT(sptLeftRightArrowCallout, CLeftRightArrowCalloutType)
		CREATE_BY_SPT(sptLeftRightArrow, CLeftRightArrowType)
		CREATE_BY_SPT(sptLeftRightUpArrow, CLeftRightUpArrow)
		CREATE_BY_SPT(sptLeftUpArrow, CLeftUpArrowType)
		CREATE_BY_SPT(sptLightningBolt, CLightningBoltType)

		CREATE_BY_SPT(sptMoon, CMoonType)

		CREATE_BY_SPT(sptNoSmoking, CNoSmokingType)
		CREATE_BY_SPT(sptNotchedRightArrow, CNotchedRightArrowType)

		CREATE_BY_SPT(sptOctagon, COctagonType)

		CREATE_BY_SPT(sptParallelogram, CParallelogramType)
		CREATE_BY_SPT(sptPentagon, CPentagonType)
		CREATE_BY_SPT(sptPlaque, CPlaqueType)
		CREATE_BY_SPT(sptPlus, CPlusType)

		CREATE_BY_SPT(sptQuadArrowCallout, CQuadArrowCalloutType)
		CREATE_BY_SPT(sptQuadArrow, CQuadArrowType)

		CREATE_BY_SPT(sptRectangle, CRectangleType)
		CREATE_BY_SPT(sptRibbon, CRibbonDownType)
		CREATE_BY_SPT(sptRibbon2, CRibbonUpType)
		CREATE_BY_SPT(sptRightArrowCallout, CRightArrowCalloutType)
		CREATE_BY_SPT(sptArrow, CRightArrowType)
		CREATE_BY_SPT(sptRightBrace, CRightBracetype)
		CREATE_BY_SPT(sptRightBracket, CRightBracketType)
		CREATE_BY_SPT(sptRightTriangle, CRightTriangleType)
		CREATE_BY_SPT(sptRoundRectangle, CRoundedRectangleType)

		CREATE_BY_SPT(sptSeal16, CSeal16Type)
		CREATE_BY_SPT(sptSeal24, CSeal24Type)
		CREATE_BY_SPT(sptSeal32, CSeal32Type)
		CREATE_BY_SPT(sptSeal4, CSeal4Type)
		CREATE_BY_SPT(sptSeal8, CSeal8Type)
		CREATE_BY_SPT(sptSmileyFace, CSmileyFaceType)
		CREATE_BY_SPT(sptStar, CStarType)
		CREATE_BY_SPT(sptStraightConnector1, CStraightConnectorType)
		CREATE_BY_SPT(sptStripedRightArrow, CStripedRightArrowType)
		CREATE_BY_SPT(sptSun, CSunType)

		CREATE_BY_SPT(sptTextBox, CTextboxType)
		CREATE_BY_SPT(sptTrapezoid, CTrapezoidType)

		CREATE_BY_SPT(sptUpArrowCallout, CUpArrowCalloutType)
		CREATE_BY_SPT(sptUpArrow, CUpArrowType)
		CREATE_BY_SPT(sptUpDownArrowCallout, CUpDownArrowCalloutType)
		CREATE_BY_SPT(sptUpDownArrow, CUpDownArrowType)
		CREATE_BY_SPT(sptUturnArrow, CUturnArrowType)

		CREATE_BY_SPT(sptVerticalScroll, CVerticalScrollType)
		CREATE_BY_SPT(sptHorizontalScroll, CHorizontalScrollType)

		CREATE_BY_SPT(sptWedgeEllipseCallout, CWedgeEllipseCalloutType)
		CREATE_BY_SPT(sptWedgeRectCallout, CWedgeRectCalloutType)
		CREATE_BY_SPT(sptWedgeRRectCallout, CWedgeRoundedRectCalloutType)

		CREATE_BY_SPT(sptWave, CWaveType)
		CREATE_BY_SPT(sptDoubleWave, CWaveDoubleType)

		case sptBentConnector2:
		case sptBentConnector3:    
		case sptBentConnector4:
		case sptBentConnector5:
			{
				pShape = new CBentConnectorType(); 
				break;
			}
		case sptCurvedConnector2:
		case sptCurvedConnector3:    
		case sptCurvedConnector4:
		case sptCurvedConnector5:
			{
				pShape = new CCurvedConnectorType();
				break;
			}

		case sptTextPlainText:    
		case sptTextStop:  
		case sptTextTriangle:   
		case sptTextTriangleInverted:
		case sptTextChevron:
		case sptTextChevronInverted:
		case sptTextRingInside:
		case sptTextRingOutside:
		case sptTextArchUpCurve:   
		case sptTextArchDownCurve: 
		case sptTextCircleCurve: 
		case sptTextButtonCurve: 
		case sptTextArchUpPour:  
		case sptTextArchDownPour: 
		case sptTextCirclePour:
		case sptTextButtonPour:  
		case sptTextCurveUp:  
		case sptTextCurveDown: 
		case sptTextCascadeUp:   
		case sptTextCascadeDown:
		case sptTextWave1:   
		case sptTextWave2:   
		case sptTextWave3:   
		case sptTextWave4: 
		case sptTextInflate:   
		case sptTextDeflate:    
		case sptTextInflateBottom:  
		case sptTextDeflateBottom:  
		case sptTextInflateTop:
		case sptTextDeflateTop:   
		case sptTextDeflateInflate:   
		case sptTextDeflateInflateDeflate:
		case sptTextFadeRight: 
		case sptTextFadeLeft:   
		case sptTextFadeUp:   
		case sptTextFadeDown:   
		case sptTextSlantUp:    
		case sptTextSlantDown:   
		case sptTextCanUp:   
		case sptTextCanDown:
		{
			pShape = new CTextboxType();
		}

		default: break;
	};

	if (NULL != pShape)
		pShape->m_eType = type;

	return pShape;
}

void CPPTShape::SetProperty(CProperty* pProperty, CElementsContainer* pSlide, CShape* pParentShape)
{
	if (NULL == pParentShape)
		return;

	
	
	
	if (NSOfficeDrawing::geoRight == pProperty->m_ePID)
	{
		pParentShape->m_dWidthLogic = (double)(pProperty->m_lValue);
	}
	if (NSOfficeDrawing::geoBottom == pProperty->m_ePID)
	{
		pParentShape->m_dHeightLogic = (double)(pProperty->m_lValue);
	}
	
	if (NSOfficeDrawing::shapePath == pProperty->m_ePID)
	{
		m_oCustomVML.SetPath((RulesType)pProperty->m_lValue);
	}
	
	if ((NSOfficeDrawing::pSegmentInfo == pProperty->m_ePID) && (pProperty->m_bComplex))
	{
		m_oCustomVML.LoadSegments(pProperty);
	}
	
	if ((NSOfficeDrawing::pVertices == pProperty->m_ePID) && (pProperty->m_bComplex))
	{
		m_oCustomVML.LoadVertices(pProperty);
	}
	if ((NSOfficeDrawing::pGuides == pProperty->m_ePID) && (pProperty->m_bComplex))
	{
		m_oCustomVML.LoadGuides(pProperty);
	}

	if (NSOfficeDrawing::dxTextLeft == pProperty->m_ePID)
	{
		pParentShape->m_dTextMarginX = (double)pProperty->m_lValue / EMU_MM;
	}
	else if (NSOfficeDrawing::dxTextRight == pProperty->m_ePID)
	{
		pParentShape->m_dTextMarginRight = (double)pProperty->m_lValue / EMU_MM;
	}
	else if (NSOfficeDrawing::dyTextTop == pProperty->m_ePID)
	{
		pParentShape->m_dTextMarginY = (double)pProperty->m_lValue / EMU_MM;
	}
	else if (NSOfficeDrawing::dyTextBottom == pProperty->m_ePID)
	{
		pParentShape->m_dTextMarginBottom = (double)pProperty->m_lValue / EMU_MM;
	}
	else if (NSOfficeDrawing::WrapText == pProperty->m_ePID)
	{
		pParentShape->m_oText.m_lWrapMode = (LONG)pProperty->m_lValue;
	}

	
	if ((NSOfficeDrawing::adjustValue <= pProperty->m_ePID) && 
		(NSOfficeDrawing::adjust10Value >= pProperty->m_ePID))
	{
		LONG lIndexAdj = pProperty->m_ePID - NSOfficeDrawing::adjustValue;
		if (lIndexAdj >= 0 && lIndexAdj < m_arAdjustments.GetSize())
		{
			
			m_oCustomVML.LoadAdjusts(lIndexAdj, (LONG)pProperty->m_lValue);
		}
		else
		{
			m_oCustomVML.LoadAdjusts(lIndexAdj, (LONG)pProperty->m_lValue);
		}
	}

	
	bool bIsFilled = true;
	if (NSOfficeDrawing::fillType == pProperty->m_ePID)
	{
		DWORD dwType = pProperty->m_lValue;
		if (NSOfficeDrawing::fillPattern == dwType ||
			NSOfficeDrawing::fillTexture == dwType ||
			NSOfficeDrawing::fillPicture == dwType)
		{
			pParentShape->m_oBrush.m_nBrushType = NSAttributes::BrushTypeTexture;

			pParentShape->m_oBrush.m_nTextureMode = (NSOfficeDrawing::fillPicture == dwType) ? NSAttributes::BrushTextureModeStretch : NSAttributes::BrushTextureModeTile;
		}
		else if (NSOfficeDrawing::fillShade == dwType			||
					NSOfficeDrawing::fillShadeCenter == dwType	||
					NSOfficeDrawing::fillShadeTitle == dwType)
		{
			pParentShape->m_oBrush.m_nBrushType = NSAttributes::BrushTypeVertical;
		}
		else if (NSOfficeDrawing::fillShadeShape == dwType	|| NSOfficeDrawing::fillShadeScale == dwType)
		{
			pParentShape->m_oBrush.m_nBrushType = NSAttributes::BrushTypeSolid;
		}
		else
		{
			pParentShape->m_oBrush.m_nBrushType = NSAttributes::BrushTypeSolid;
		}
	}
	else if (NSOfficeDrawing::fillBlip == pProperty->m_ePID)
	{
		DWORD dwIndex = pSlide->GetIndexPicture(pProperty->m_lValue);
		
		CStringW strVal = (CStringW)CDirectory::ToString(dwIndex);
		
		int nIndex	= pParentShape->m_oBrush.m_sTexturePath.ReverseFind(WCHAR('\\'));
		int nLen	= pParentShape->m_oBrush.m_sTexturePath.GetLength() - 1;
		if (nLen != nIndex)
		{
			pParentShape->m_oBrush.m_sTexturePath.Delete(nIndex + 1, nLen - nIndex);
		}

		pParentShape->m_oBrush.m_sTexturePath = pParentShape->m_oBrush.m_sTexturePath + strVal + L".jpg";
	}
	else if (NSOfficeDrawing::fillColor == pProperty->m_ePID)
	{
		SetColor(pProperty->m_lValue, pParentShape->m_oBrush.m_oColor1, pSlide);
	}
	else if (NSOfficeDrawing::fillBackColor == pProperty->m_ePID)
	{
		SetColor(pProperty->m_lValue, pParentShape->m_oBrush.m_oColor2, pSlide);
	}
	else if (NSOfficeDrawing::fillOpacity == pProperty->m_ePID)
	{
		pParentShape->m_oBrush.m_Alpha1 = (BYTE)min(255, CDirectory::NormFixedPoint(pProperty->m_lValue, 255));
	}
	else if (NSOfficeDrawing::fillBackOpacity == pProperty->m_ePID)
	{
		pParentShape->m_oBrush.m_Alpha2 = (BYTE)min(255, CDirectory::NormFixedPoint(pProperty->m_lValue, 255));
	}
	else if (NSOfficeDrawing::fillBackground == pProperty->m_ePID)
	{
		bIsFilled = false;
	}
	else if (NSOfficeDrawing::fNoFillHitTest == pProperty->m_ePID)
	{
		BYTE flag1 = (BYTE)(pProperty->m_lValue);
		BYTE flag2 = (BYTE)(pProperty->m_lValue >> 16);

		bool bNoFillHitTest			= (0x01 == (0x01 & flag1));
		bool bFillUseRect			= (0x02 == (0x02 & flag1));
		bool bFillShape				= (0x04 == (0x04 & flag1));
		bool bHitTestFill			= (0x08 == (0x08 & flag1));
		bool bFilled				= (0x10 == (0x10 & flag1));
		bool bUseShapeAnchor		= (0x20 == (0x20 & flag1));
		bool bRecolorFillAsPictures = (0x40 == (0x40 & flag1));

		bool bUsebNoFillHitTest			= (0x01 == (0x01 & flag2));
		bool bUsebFillUseRect			= (0x02 == (0x02 & flag2));
		bool bUsebFillShape				= (0x04 == (0x04 & flag2));
		bool bUsebHitTestFill			= (0x08 == (0x08 & flag2));
		bool bUsebFilled				= (0x10 == (0x10 & flag2));
		bool bUsebUseShapeAnchor		= (0x20 == (0x20 & flag2));
		bool bUsebRecolorFillAsPictures = (0x40 == (0x40 & flag2));

		if (bUsebFilled)
			bIsFilled = bFilled;
	}
	

	
	bool bIsDraw = true;
	if (NSOfficeDrawing::lineColor == pProperty->m_ePID)
	{
		SetColor(pProperty->m_lValue, pParentShape->m_oPen.m_oColor, pSlide);
	}
	else if (NSOfficeDrawing::lineOpacity == pProperty->m_ePID)
	{
		pParentShape->m_oPen.m_nAlpha = (BYTE)min(255, CDirectory::NormFixedPoint(pProperty->m_lValue, 255));
	}
	else if (NSOfficeDrawing::lineWidth == pProperty->m_ePID)
	{
		pParentShape->m_oPen.Size = (double)pProperty->m_lValue / EMU_MM;
	}
	else if (NSOfficeDrawing::lineDashing == pProperty->m_ePID)
	{
		switch (pProperty->m_lValue)
		{
		case 0: 
			{ 
				pParentShape->m_oPen.DashStyle = 0; 
				break; 
			}	
		case 1: 
		case 6:
		case 7:
			{ 
				pParentShape->m_oPen.DashStyle = 1; 
				break; 
			}	
		case 2:
		case 5:
			{ 
				pParentShape->m_oPen.DashStyle = 2; 
				break; 
			}	
		case 3:
		case 8:
		case 9:
			{ 
				pParentShape->m_oPen.DashStyle = 3; 
				break; 
			}	
	    case 4:
		case 10:
			{ 
				pParentShape->m_oPen.DashStyle = 4;
				break; 
			}	
		default:
			{
				pParentShape->m_oPen.DashStyle = 0;
				break; 
			}
		};
	}
	else if (NSOfficeDrawing::lineJoinStyle == pProperty->m_ePID)
	{
		switch (pProperty->m_lValue)
		{
		case 0: 
			{ 
				pParentShape->m_oPen.LineJoin = 1; 
				break; 
			}	
		case 1: 

			{ 
				pParentShape->m_oPen.LineJoin = 1; 
				break; 
			}	
		case 2:
			{ 
				pParentShape->m_oPen.LineJoin = 2; 
				break; 
			}	
		default:
			{
				pParentShape->m_oPen.LineJoin = 2;
				break; 
			}
		};
	}
	else if (NSOfficeDrawing::lineStartArrowhead == pProperty->m_ePID)
	{
		switch (pProperty->m_lValue)
		{
		case 1: 
		case 2:
		case 5:
			{ 
				pParentShape->m_oPen.LineStartCap = 0x14; 
				break; 
			}
		case 3:
		case 4:

			{ 
				pParentShape->m_oPen.LineStartCap = 2; 
				break; 
			}
		default:
			{
				pParentShape->m_oPen.LineStartCap = 0;
				break; 
			}
		};
	}
	else if (NSOfficeDrawing::lineEndArrowhead == pProperty->m_ePID)
	{
		switch (pProperty->m_lValue)
		{
		case 1: 
		case 2:
		case 5:
			{ 
				pParentShape->m_oPen.LineEndCap = 0x14; 
				break; 
			}
		case 3:
		case 4:

			{ 
				pParentShape->m_oPen.LineEndCap = 2; 
				break; 
			}
		default:
			{
				pParentShape->m_oPen.LineEndCap = 0;
				break; 
			}
		};
	}
	else if (NSOfficeDrawing::fNoLineDrawDash == pProperty->m_ePID)
	{
		BYTE flag1 = (BYTE)(pProperty->m_lValue);
		BYTE flag2 = (BYTE)(pProperty->m_lValue >> 8);
		BYTE flag3 = (BYTE)(pProperty->m_lValue >> 16);
		BYTE flag4 = (BYTE)(pProperty->m_lValue >> 24);

		bool bNoLineDrawDash			= (0x01 == (0x01 & flag1));
		bool bLineFillShape				= (0x02 == (0x02 & flag1));
		bool bHitTestLine				= (0x04 == (0x04 & flag1));
		bool bLine						= (0x08 == (0x08 & flag1));
		bool bArrowheadsOK				= (0x10 == (0x10 & flag1));
		bool bInsertPenOK				= (0x20 == (0x20 & flag1));
		bool bInsertPen					= (0x40 == (0x40 & flag1));

		bool bLineOpaqueBackColor		= (0x02 == (0x02 & flag2));

		bool bUsebNoLineDrawDash		= (0x01 == (0x01 & flag3));
		bool bUsebLineFillShape			= (0x02 == (0x02 & flag3));
		bool bUsebHitTestLine			= (0x04 == (0x04 & flag3));
		bool bUsebLine					= (0x08 == (0x08 & flag3));
		bool bUsebArrowheadsOK			= (0x10 == (0x10 & flag3));
		bool bUsebInsertPenOK			= (0x20 == (0x20 & flag3));
		bool bUsebInsertPen				= (0x40 == (0x40 & flag3));

		bool bUsebLineOpaqueBackColor	= (0x02 == (0x02 & flag4));

		if (bUsebLine)
			bIsDraw = bLine;
	}

	
	
	if (NSOfficeDrawing::gtextUNICODE == pProperty->m_ePID)
	{
		if (pProperty->m_bComplex && 0 < pProperty->m_lValue)
		{
			CStringW str = CDirectory::BYTEArrayToStringW(pProperty->m_pOptions, pProperty->m_lValue);
			pParentShape->m_oText.m_sText = str;
		}
	}
	
	
	

	if (NSOfficeDrawing::gtextFont == pProperty->m_ePID)
	{
		if (pProperty->m_bComplex && 0 < pProperty->m_lValue)
		{
			CStringW str = CDirectory::BYTEArrayToStringW(pProperty->m_pOptions, pProperty->m_lValue);
			pParentShape->m_oText.m_oAttributes.m_oFont.m_strFontName = (CString)str;
		}
	}
	else if (NSOfficeDrawing::gtextSize == pProperty->m_ePID)
	{
		pParentShape->m_oText.m_oAttributes.m_oFont.m_nSize = (INT)((pProperty->m_lValue >> 16) & 0x0000FFFF);
	}
	else if (NSOfficeDrawing::anchorText == pProperty->m_ePID)
	{
		switch (pProperty->m_lValue)
		{
		case NSOfficeDrawing::anchorTop:
		case NSOfficeDrawing::anchorTopBaseline:
			{
				
				pParentShape->m_oText.m_oAttributes.m_nTextAlignVertical = 0;
				break;
			}
		case NSOfficeDrawing::anchorMiddle:
			{
				
				pParentShape->m_oText.m_oAttributes.m_nTextAlignVertical = 1;
				break;
			}
		case NSOfficeDrawing::anchorBottom:
		case NSOfficeDrawing::anchorBottomBaseline:
			{
				pParentShape->m_oText.m_oAttributes.m_nTextAlignHorizontal = 0;
				pParentShape->m_oText.m_oAttributes.m_nTextAlignVertical = 2;
				break;
			}
		case NSOfficeDrawing::anchorTopCentered:
		case NSOfficeDrawing::anchorTopCenteredBaseline:
			{
				pParentShape->m_oText.m_oAttributes.m_nTextAlignHorizontal = 1;
				pParentShape->m_oText.m_oAttributes.m_nTextAlignVertical = 0;
				break;
			}
		case NSOfficeDrawing::anchorMiddleCentered:
			{
				pParentShape->m_oText.m_oAttributes.m_nTextAlignHorizontal = 1;
				pParentShape->m_oText.m_oAttributes.m_nTextAlignVertical = 1;
				break;
			}
		case NSOfficeDrawing::anchorBottomCentered:
		case NSOfficeDrawing::anchorBottomCenteredBaseline:
			{
				pParentShape->m_oText.m_oAttributes.m_nTextAlignHorizontal = 1;
				pParentShape->m_oText.m_oAttributes.m_nTextAlignVertical = 2;
				break;
			}
		default:
			{
				pParentShape->m_oText.m_oAttributes.m_nTextAlignHorizontal = 1;
				pParentShape->m_oText.m_oAttributes.m_nTextAlignVertical = 0;
			}
		};
	}
	else if (NSOfficeDrawing::gtextAlign == pProperty->m_ePID)
	{
		switch (pProperty->m_lValue)
		{
		case NSOfficeDrawing::alignTextLeft:
			{
				pParentShape->m_oText.m_oAttributes.m_nTextAlignHorizontal = 0;
				break;
			}
		case NSOfficeDrawing::alignTextCenter:
			{
				pParentShape->m_oText.m_oAttributes.m_nTextAlignHorizontal = 1;
				break;
			}
		case NSOfficeDrawing::alignTextRight:
			{
				pParentShape->m_oText.m_oAttributes.m_nTextAlignHorizontal = 2;
				break;
			}
		default:
			{
				pParentShape->m_oText.m_oAttributes.m_nTextAlignHorizontal = 1;
			}
		};
	}
	else if (NSOfficeDrawing::gtextFStrikethrough == pProperty->m_ePID)
	{
		
		BYTE flag1 = (BYTE)(pProperty->m_lValue);
		BYTE flag2 = (BYTE)(pProperty->m_lValue >> 8);
		BYTE flag3 = (BYTE)(pProperty->m_lValue >> 16);
		BYTE flag4 = (BYTE)(pProperty->m_lValue >> 24);

		bool bStrikethrought			= (0x01 == (0x01 & flag1));
		bool bSmallCaps					= (0x02 == (0x02 & flag1));
		bool bShadow					= (0x04 == (0x04 & flag1));
		bool bUnderline					= (0x08 == (0x08 & flag1));
		bool bItalic					= (0x10 == (0x10 & flag1));
		bool bBold						= (0x20 == (0x20 & flag1));

		bool bUseStrikethrought			= (0x01 == (0x01 & flag3));
		bool bUseSmallCaps				= (0x02 == (0x02 & flag3));
		bool bUseShadow					= (0x04 == (0x04 & flag3));
		bool bUseUnderline				= (0x08 == (0x08 & flag3));
		bool bUseItalic					= (0x10 == (0x10 & flag3));
		bool bUseBold					= (0x20 == (0x20 & flag3));

		bool bVertical					= (0x20 == (0x20 & flag2));
		bool bUseVertical				= (0x20 == (0x20 & flag4));

		if (bUseStrikethrought)
			pParentShape->m_oText.m_oAttributes.m_oFont.m_bStrikeout = bStrikethrought;
		if (bUseShadow)
			pParentShape->m_oText.m_oAttributes.m_oTextShadow.m_bVisible = true;
		if (bUseUnderline)
			pParentShape->m_oText.m_oAttributes.m_oFont.m_bUnderline = bUnderline;
		if (bUseItalic)
			pParentShape->m_oText.m_oAttributes.m_oFont.m_bItalic = bItalic;
		if (bUseBold)
			pParentShape->m_oText.m_oAttributes.m_oFont.m_bBold = bBold;

		if (bUseVertical)
			pParentShape->m_oText.m_bVertical = (true == bVertical) ? TRUE : FALSE;
	}
	else if (NSOfficeDrawing::fFitTextToShape == pProperty->m_ePID)
	{
		BYTE flag1 = (BYTE)(pProperty->m_lValue);
		BYTE flag2 = (BYTE)(pProperty->m_lValue >> 8);
		BYTE flag3 = (BYTE)(pProperty->m_lValue >> 16);
		BYTE flag4 = (BYTE)(pProperty->m_lValue >> 24);

		bool bFitShapeToText		= (0x02 == (0x02 & flag1));
		bool bAutoTextMargin		= (0x08 == (0x08 & flag1));
		bool bSelectText			= (0x10 == (0x10 & flag1));

		bool bUseFitShapeToText		= (0x02 == (0x02 & flag3));
		bool bUseAutoTextMargin		= (0x08 == (0x08 & flag3));
		bool bUseSelectText			= (0x10 == (0x10 & flag3));

		if (bUseAutoTextMargin)
		{
			if (bAutoTextMargin)
			{
				pParentShape->m_dTextMarginX		= 2.54;
				pParentShape->m_dTextMarginRight	= 1.27;
				pParentShape->m_dTextMarginY		= 2.54;
				pParentShape->m_dTextMarginBottom	= 1.27;
			}
		}
	}

	

	
	if (NSOfficeDrawing::fFillOK == pProperty->m_ePID)
	{
		BYTE flag1 = (BYTE)(pProperty->m_lValue);
		BYTE flag2 = (BYTE)(pProperty->m_lValue >> 8);
		BYTE flag3 = (BYTE)(pProperty->m_lValue >> 16);
		BYTE flag4 = (BYTE)(pProperty->m_lValue >> 24);

		bool bFillOk					= (0x01 == (0x01 & flag1));
		bool bFillShadeShapeOk			= (0x02 == (0x02 & flag1));
		bool bGTextOk					= (0x04 == (0x04 & flag1));
		bool bLineOk					= (0x08 == (0x08 & flag1));
		bool b3DOk						= (0x10 == (0x10 & flag1));
		bool bShadowOk					= (0x20 == (0x20 & flag1));

		bool bUseFillOk					= (0x01 == (0x01 & flag3));
		bool bUseFillShadeShapeOk		= (0x02 == (0x02 & flag3));
		bool bUseGTextOk				= (0x04 == (0x04 & flag3));
		bool bUseLineOk					= (0x08 == (0x08 & flag3));
		bool bUse3DOk					= (0x10 == (0x10 & flag3));
		bool bUseShadowOk				= (0x20 == (0x20 & flag3));

		if (bUseLineOk)
			bIsDraw = bLineOk;

		if (bUseFillOk)
			bIsFilled = bFillOk;
	}

	if (!bIsDraw)
	{
		pParentShape->m_oPen.m_nAlpha = 0;
	}

	if (!bIsFilled)
	{
		pParentShape->m_oBrush.m_nBrushType = (int)BrushTypeSolid;
		pParentShape->m_oBrush.m_Alpha1 = 0;
		pParentShape->m_oBrush.m_Alpha2 = 0;
	}
}

void CPPTShape::SetColor(const DWORD& dwVal, CColor_& oColor, CElementsContainer* pSlide)
{
	SColorAtom oColorAtom;
	oColorAtom.FromValue(dwVal);
	if (oColorAtom.bSchemeIndex)
	{
		if (oColorAtom.R < (BYTE)pSlide->m_arColorScheme.GetSize())
		{
			oColor.R = pSlide->m_arColorScheme[oColorAtom.R].R;
			oColor.G = pSlide->m_arColorScheme[oColorAtom.R].G;
			oColor.B = pSlide->m_arColorScheme[oColorAtom.R].B;
		}
		else
		{
			oColor.R = oColorAtom.R;
			oColor.G = oColorAtom.G;
			oColor.B = oColorAtom.B;
		}
	}
	else
	{
		oColor.R = oColorAtom.R;
		oColor.G = oColorAtom.G;
		oColor.B = oColorAtom.B;
	}
}

void CPPTShape::SetProperties(CProperties* pProperties, CElementsContainer* pSlide, CShape* pParentShape)
{
	m_oCustomVML.SetAdjusts(&m_arAdjustments);
	
	if (NULL != pProperties)
	{
		
		for (long nIndex = 0; nIndex < pProperties->m_lCount; ++nIndex)
		{
			SetProperty(&(pProperties->m_arProperties[nIndex]), pSlide, pParentShape);
		}
	}

	
	
	m_oCustomVML.ToCustomShape(this, m_oManager);
	ReCalculate();
}