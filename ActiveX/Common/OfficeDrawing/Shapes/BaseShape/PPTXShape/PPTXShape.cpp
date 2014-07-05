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
#include "PPTXShape.h"
#include "PresetShapesHeader.h"

CPPTXShape* CPPTXShape::CreateByType(OOXMLShapes::ShapeType type)
{
	switch(type)
	{
	case OOXMLShapes::sptCAccentBorderCallout1: return new OOXMLShapes::CAccentBorderCallout1();
	case OOXMLShapes::sptCAccentBorderCallout2: return new OOXMLShapes::CAccentBorderCallout2();
	case OOXMLShapes::sptCAccentBorderCallout3: return new OOXMLShapes::CAccentBorderCallout3();
	case OOXMLShapes::sptCAccentCallout1: return new OOXMLShapes::CAccentCallout1();
	case OOXMLShapes::sptCAccentCallout2: return new OOXMLShapes::CAccentCallout2();
	case OOXMLShapes::sptCAccentCallout3: return new OOXMLShapes::CAccentCallout3();
	case OOXMLShapes::sptCActionButtonBackPrevious: return new OOXMLShapes::CActionButtonBackPrevious();
	case OOXMLShapes::sptCActionButtonBeginning: return new OOXMLShapes::CActionButtonBeginning();
	case OOXMLShapes::sptCActionButtonBlank: return new OOXMLShapes::CActionButtonBlank();
	case OOXMLShapes::sptCActionButtonDocument: return new OOXMLShapes::CActionButtonDocument();
	case OOXMLShapes::sptCActionButtonEnd: return new OOXMLShapes::CActionButtonEnd();
	case OOXMLShapes::sptCActionButtonForwardNext: return new OOXMLShapes::CActionButtonForwardNext();
	case OOXMLShapes::sptCActionButtonHelp: return new OOXMLShapes::CActionButtonHelp();
	case OOXMLShapes::sptCActionButtonHome: return new OOXMLShapes::CActionButtonHome();
	case OOXMLShapes::sptCActionButtonInformation: return new OOXMLShapes::CActionButtonInformation();
	case OOXMLShapes::sptCActionButtonMovie: return new OOXMLShapes::CActionButtonMovie();
	case OOXMLShapes::sptCActionButtonReturn: return new OOXMLShapes::CActionButtonReturn();
	case OOXMLShapes::sptCActionButtonSound: return new OOXMLShapes::CActionButtonSound();
	case OOXMLShapes::sptCArc: return new OOXMLShapes::CArc();
	case OOXMLShapes::sptCBentArrow: return new OOXMLShapes::CBentArrow();
	case OOXMLShapes::sptCBentConnector2: return new OOXMLShapes::CBentConnector2();
	case OOXMLShapes::sptCBentConnector3: return new OOXMLShapes::CBentConnector3();
	case OOXMLShapes::sptCBentConnector4: return new OOXMLShapes::CBentConnector4();
	case OOXMLShapes::sptCBentConnector5: return new OOXMLShapes::CBentConnector5();
	case OOXMLShapes::sptCBentUpArrow: return new OOXMLShapes::CBentUpArrow();
	case OOXMLShapes::sptCBevel: return new OOXMLShapes::CBevel();
	case OOXMLShapes::sptCBlockArc: return new OOXMLShapes::CBlockArc();
	case OOXMLShapes::sptCBorderCallout1: return new OOXMLShapes::CBorderCallout1();
	case OOXMLShapes::sptCBorderCallout2: return new OOXMLShapes::CBorderCallout2();
	case OOXMLShapes::sptCBorderCallout3: return new OOXMLShapes::CBorderCallout3();
	case OOXMLShapes::sptCBracePair: return new OOXMLShapes::CBracePair();
	case OOXMLShapes::sptCBracketPair: return new OOXMLShapes::CBracketPair();
	case OOXMLShapes::sptCCallout1: return new OOXMLShapes::CCallout1();
	case OOXMLShapes::sptCCallout2: return new OOXMLShapes::CCallout2();
	case OOXMLShapes::sptCCallout3: return new OOXMLShapes::CCallout3();
	case OOXMLShapes::sptCCan: return new OOXMLShapes::CCan();
	case OOXMLShapes::sptCChartPlus: return new OOXMLShapes::CChartPlus();
	case OOXMLShapes::sptCChartStar: return new OOXMLShapes::CChartStar();
	case OOXMLShapes::sptCChartX: return new OOXMLShapes::CChartX();
	case OOXMLShapes::sptCChevron: return new OOXMLShapes::CChevron();
	case OOXMLShapes::sptCChord: return new OOXMLShapes::CChord();
	case OOXMLShapes::sptCCircularArrow: return new OOXMLShapes::CCircularArrow();
	case OOXMLShapes::sptCCloud: return new OOXMLShapes::CCloud();
	case OOXMLShapes::sptCCloudCallout: return new OOXMLShapes::CCloudCallout();
	case OOXMLShapes::sptCCorner: return new OOXMLShapes::CCorner();
	case OOXMLShapes::sptCCornerTabs: return new OOXMLShapes::CCornerTabs();
	case OOXMLShapes::sptCCube: return new OOXMLShapes::CCube();
	case OOXMLShapes::sptCCurvedConnector2: return new OOXMLShapes::CCurvedConnector2();
	case OOXMLShapes::sptCCurvedConnector3: return new OOXMLShapes::CCurvedConnector3();
	case OOXMLShapes::sptCCurvedConnector4: return new OOXMLShapes::CCurvedConnector4();
	case OOXMLShapes::sptCCurvedConnector5: return new OOXMLShapes::CCurvedConnector5();
	case OOXMLShapes::sptCCurvedDownArrow: return new OOXMLShapes::CCurvedDownArrow();
	case OOXMLShapes::sptCCurvedLeftArrow: return new OOXMLShapes::CCurvedLeftArrow();
	case OOXMLShapes::sptCCurvedRightArrow: return new OOXMLShapes::CCurvedRightArrow();
	case OOXMLShapes::sptCCurvedUpArrow: return new OOXMLShapes::CCurvedUpArrow();
	case OOXMLShapes::sptCDecagon: return new OOXMLShapes::CDecagon();
	case OOXMLShapes::sptCDiagStripe: return new OOXMLShapes::CDiagStripe();
	case OOXMLShapes::sptCDiamond: return new OOXMLShapes::CDiamond();
	case OOXMLShapes::sptCDodecagon: return new OOXMLShapes::CDodecagon();
	case OOXMLShapes::sptCDonut: return new OOXMLShapes::CDonut();
	case OOXMLShapes::sptCDoubleWave: return new OOXMLShapes::CDoubleWave();
	case OOXMLShapes::sptCDownArrow: return new OOXMLShapes::CDownArrow();
	case OOXMLShapes::sptCDownArrowCallout: return new OOXMLShapes::CDownArrowCallout();
	case OOXMLShapes::sptCEllipse: return new OOXMLShapes::CEllipse();
	case OOXMLShapes::sptCEllipseRibbon: return new OOXMLShapes::CEllipseRibbon();
	case OOXMLShapes::sptCEllipseRibbon2: return new OOXMLShapes::CEllipseRibbon2();
	case OOXMLShapes::sptCFlowChartAlternateProcess: return new OOXMLShapes::CFlowChartAlternateProcess();
	case OOXMLShapes::sptCFlowChartCollate: return new OOXMLShapes::CFlowChartCollate();
	case OOXMLShapes::sptCFlowChartConnector: return new OOXMLShapes::CFlowChartConnector();
	case OOXMLShapes::sptCFlowChartDecision: return new OOXMLShapes::CFlowChartDecision();
	case OOXMLShapes::sptCFlowChartDelay: return new OOXMLShapes::CFlowChartDelay();
	case OOXMLShapes::sptCFlowChartDisplay: return new OOXMLShapes::CFlowChartDisplay();
	case OOXMLShapes::sptCFlowChartDocument: return new OOXMLShapes::CFlowChartDocument();
	case OOXMLShapes::sptCFlowChartExtract: return new OOXMLShapes::CFlowChartExtract();
	case OOXMLShapes::sptCFlowChartInputOutput: return new OOXMLShapes::CFlowChartInputOutput();
	case OOXMLShapes::sptCFlowChartInternalStorage: return new OOXMLShapes::CFlowChartInternalStorage();
	case OOXMLShapes::sptCFlowChartMagneticDisk: return new OOXMLShapes::CFlowChartMagneticDisk();
	case OOXMLShapes::sptCFlowChartMagneticDrum: return new OOXMLShapes::CFlowChartMagneticDrum();
	case OOXMLShapes::sptCFlowChartMagneticTape: return new OOXMLShapes::CFlowChartMagneticTape();
	case OOXMLShapes::sptCFlowChartManualInput: return new OOXMLShapes::CFlowChartManualInput();
	case OOXMLShapes::sptCFlowChartManualOperation: return new OOXMLShapes::CFlowChartManualOperation();
	case OOXMLShapes::sptCFlowChartMerge: return new OOXMLShapes::CFlowChartMerge();
	case OOXMLShapes::sptCFlowChartMultidocument: return new OOXMLShapes::CFlowChartMultidocument();
	case OOXMLShapes::sptCFlowChartOfflineStorage: return new OOXMLShapes::CFlowChartOfflineStorage();
	case OOXMLShapes::sptCFlowChartOffpageConnector: return new OOXMLShapes::CFlowChartOffpageConnector();
	case OOXMLShapes::sptCFlowChartOnlineStorage: return new OOXMLShapes::CFlowChartOnlineStorage();
	case OOXMLShapes::sptCFlowChartOr: return new OOXMLShapes::CFlowChartOr();
	case OOXMLShapes::sptCFlowChartPredefinedProcess: return new OOXMLShapes::CFlowChartPredefinedProcess();
	case OOXMLShapes::sptCFlowChartPreparation: return new OOXMLShapes::CFlowChartPreparation();
	case OOXMLShapes::sptCFlowChartProcess: return new OOXMLShapes::CFlowChartProcess();
	case OOXMLShapes::sptCFlowChartPunchedCard: return new OOXMLShapes::CFlowChartPunchedCard();
	case OOXMLShapes::sptCFlowChartPunchedTape: return new OOXMLShapes::CFlowChartPunchedTape();
	case OOXMLShapes::sptCFlowChartSort: return new OOXMLShapes::CFlowChartSort();
	case OOXMLShapes::sptCFlowChartSummingJunction: return new OOXMLShapes::CFlowChartSummingJunction();
	case OOXMLShapes::sptCFlowChartTerminator: return new OOXMLShapes::CFlowChartTerminator();
	case OOXMLShapes::sptCFoldedCorner: return new OOXMLShapes::CFoldedCorner();
	case OOXMLShapes::sptCFrame: return new OOXMLShapes::CFrame();
	case OOXMLShapes::sptCFunnel: return new OOXMLShapes::CFunnel();
	case OOXMLShapes::sptCGear6: return new OOXMLShapes::CGear6();
	case OOXMLShapes::sptCGear9: return new OOXMLShapes::CGear9();
	case OOXMLShapes::sptCHalfFrame: return new OOXMLShapes::CHalfFrame();
	case OOXMLShapes::sptCHeart: return new OOXMLShapes::CHeart();
	case OOXMLShapes::sptCHeptagon: return new OOXMLShapes::CHeptagon();
	case OOXMLShapes::sptCHexagon: return new OOXMLShapes::CHexagon();
	case OOXMLShapes::sptCHomePlate: return new OOXMLShapes::CHomePlate();
	case OOXMLShapes::sptCHorizontalScroll: return new OOXMLShapes::CHorizontalScroll();
	case OOXMLShapes::sptCIrregularSeal1: return new OOXMLShapes::CIrregularSeal1();
	case OOXMLShapes::sptCIrregularSeal2: return new OOXMLShapes::CIrregularSeal2();
	case OOXMLShapes::sptCLeftArrow: return new OOXMLShapes::CLeftArrow();
	case OOXMLShapes::sptCLeftArrowCallout: return new OOXMLShapes::CLeftArrowCallout();
	case OOXMLShapes::sptCLeftBrace: return new OOXMLShapes::CLeftBrace();
	case OOXMLShapes::sptCLeftBracket: return new OOXMLShapes::CLeftBracket();
	case OOXMLShapes::sptCLeftCircularArrow: return new OOXMLShapes::CLeftCircularArrow();
	case OOXMLShapes::sptCLeftRightArrow: return new OOXMLShapes::CLeftRightArrow();
	case OOXMLShapes::sptCLeftRightArrowCallout: return new OOXMLShapes::CLeftRightArrowCallout();
	case OOXMLShapes::sptCLeftRightCircularArrow: return new OOXMLShapes::CLeftRightCircularArrow();
	case OOXMLShapes::sptCLeftRightRibbon: return new OOXMLShapes::CLeftRightRibbon();
	case OOXMLShapes::sptCLeftRightUpArrow: return new OOXMLShapes::CLeftRightUpArrow();
	case OOXMLShapes::sptCLeftUpArrow: return new OOXMLShapes::CLeftUpArrow();
	case OOXMLShapes::sptCLightningBolt: return new OOXMLShapes::CLightningBolt();
	case OOXMLShapes::sptCLine: return new OOXMLShapes::CLine();
	case OOXMLShapes::sptCLineInv: return new OOXMLShapes::CLineInv();
	case OOXMLShapes::sptCMathDivide: return new OOXMLShapes::CMathDivide();
	case OOXMLShapes::sptCMathEqual: return new OOXMLShapes::CMathEqual();
	case OOXMLShapes::sptCMathMinus: return new OOXMLShapes::CMathMinus();
	case OOXMLShapes::sptCMathMultiply: return new OOXMLShapes::CMathMultiply();
	case OOXMLShapes::sptCMathNotEqual: return new OOXMLShapes::CMathNotEqual();
	case OOXMLShapes::sptCMathPlus: return new OOXMLShapes::CMathPlus();
	case OOXMLShapes::sptCMoon: return new OOXMLShapes::CMoon();
	case OOXMLShapes::sptCNonIsoscelesTrapezoid: return new OOXMLShapes::CNonIsoscelesTrapezoid();
	case OOXMLShapes::sptCNoSmoking: return new OOXMLShapes::CNoSmoking();
	case OOXMLShapes::sptCNotchedRightArrow: return new OOXMLShapes::CNotchedRightArrow();
	case OOXMLShapes::sptCOctagon: return new OOXMLShapes::COctagon();
	case OOXMLShapes::sptCParallelogram: return new OOXMLShapes::CParallelogram();
	case OOXMLShapes::sptCPentagon: return new OOXMLShapes::CPentagon();
	case OOXMLShapes::sptCPie: return new OOXMLShapes::CPie();
	case OOXMLShapes::sptCPieWedge: return new OOXMLShapes::CPieWedge();
	case OOXMLShapes::sptCPlaque: return new OOXMLShapes::CPlaque();
	case OOXMLShapes::sptCPlaqueTabs: return new OOXMLShapes::CPlaqueTabs();
	case OOXMLShapes::sptCPlus: return new OOXMLShapes::CPlus();
	case OOXMLShapes::sptCQuadArrow: return new OOXMLShapes::CQuadArrow();
	case OOXMLShapes::sptCQuadArrowCallout: return new OOXMLShapes::CQuadArrowCallout();
	case OOXMLShapes::sptCRect: return new OOXMLShapes::CRect();
	case OOXMLShapes::sptCRibbon: return new OOXMLShapes::CRibbon();
	case OOXMLShapes::sptCRibbon2: return new OOXMLShapes::CRibbon2();
	case OOXMLShapes::sptCRightArrow: return new OOXMLShapes::CRightArrow();
	case OOXMLShapes::sptCRightArrowCallout: return new OOXMLShapes::CRightArrowCallout();
	case OOXMLShapes::sptCRightBrace: return new OOXMLShapes::CRightBrace();
	case OOXMLShapes::sptCRightBracket: return new OOXMLShapes::CRightBracket();
	case OOXMLShapes::sptCRound1Rect: return new OOXMLShapes::CRound1Rect();
	case OOXMLShapes::sptCRound2DiagRect: return new OOXMLShapes::CRound2DiagRect();
	case OOXMLShapes::sptCRound2SameRect: return new OOXMLShapes::CRound2SameRect();
	case OOXMLShapes::sptCRoundRect: return new OOXMLShapes::CRoundRect();
	case OOXMLShapes::sptCRtTriangle: return new OOXMLShapes::CRtTriangle();
	case OOXMLShapes::sptCSmileyFace: return new OOXMLShapes::CSmileyFace();
	case OOXMLShapes::sptCSnip1Rect: return new OOXMLShapes::CSnip1Rect();
	case OOXMLShapes::sptCSnip2DiagRect: return new OOXMLShapes::CSnip2DiagRect();
	case OOXMLShapes::sptCSnip2SameRect: return new OOXMLShapes::CSnip2SameRect();
	case OOXMLShapes::sptCSnipRoundRect: return new OOXMLShapes::CSnipRoundRect();
	case OOXMLShapes::sptCSquareTabs: return new OOXMLShapes::CSquareTabs();
	case OOXMLShapes::sptCStar10: return new OOXMLShapes::CStar10();
	case OOXMLShapes::sptCStar12: return new OOXMLShapes::CStar12();
	case OOXMLShapes::sptCStar16: return new OOXMLShapes::CStar16();
	case OOXMLShapes::sptCStar24: return new OOXMLShapes::CStar24();
	case OOXMLShapes::sptCStar32: return new OOXMLShapes::CStar32();
	case OOXMLShapes::sptCStar4: return new OOXMLShapes::CStar4();
	case OOXMLShapes::sptCStar5: return new OOXMLShapes::CStar5();
	case OOXMLShapes::sptCStar6: return new OOXMLShapes::CStar6();
	case OOXMLShapes::sptCStar7: return new OOXMLShapes::CStar7();
	case OOXMLShapes::sptCStar8: return new OOXMLShapes::CStar8();
	case OOXMLShapes::sptCStraightConnector1: return new OOXMLShapes::CStraightConnector1();
	case OOXMLShapes::sptCStripedRightArrow: return new OOXMLShapes::CStripedRightArrow();
	case OOXMLShapes::sptCSun: return new OOXMLShapes::CSun();
	case OOXMLShapes::sptCSwooshArrow: return new OOXMLShapes::CSwooshArrow();
	case OOXMLShapes::sptCTeardrop: return new OOXMLShapes::CTeardrop();
	case OOXMLShapes::sptCTextArchDown: return new OOXMLShapes::CTextArchDown();
	case OOXMLShapes::sptCTextArchDownPour: return new OOXMLShapes::CTextArchDownPour();
	case OOXMLShapes::sptCTextArchUp: return new OOXMLShapes::CTextArchUp();
	case OOXMLShapes::sptCTextArchUpPour: return new OOXMLShapes::CTextArchUpPour();
	case OOXMLShapes::sptCTextButton: return new OOXMLShapes::CTextButton();
	case OOXMLShapes::sptCTextButtonPour: return new OOXMLShapes::CTextButtonPour();
	case OOXMLShapes::sptCTextCanDown: return new OOXMLShapes::CTextCanDown();
	case OOXMLShapes::sptCTextCanUp: return new OOXMLShapes::CTextCanUp();
	case OOXMLShapes::sptCTextCascadeDown: return new OOXMLShapes::CTextCascadeDown();
	case OOXMLShapes::sptCTextCascadeUp: return new OOXMLShapes::CTextCascadeUp();
	case OOXMLShapes::sptCTextChevron: return new OOXMLShapes::CTextChevron();
	case OOXMLShapes::sptCTextChevronInverted: return new OOXMLShapes::CTextChevronInverted();
	case OOXMLShapes::sptCTextCircle: return new OOXMLShapes::CTextCircle();
	case OOXMLShapes::sptCTextCirclePour: return new OOXMLShapes::CTextCirclePour();
	case OOXMLShapes::sptCTextCurveDown: return new OOXMLShapes::CTextCurveDown();
	case OOXMLShapes::sptCTextCurveUp: return new OOXMLShapes::CTextCurveUp();
	case OOXMLShapes::sptCTextDeflate: return new OOXMLShapes::CTextDeflate();
	case OOXMLShapes::sptCTextDeflateBottom: return new OOXMLShapes::CTextDeflateBottom();
	case OOXMLShapes::sptCTextDeflateInflate: return new OOXMLShapes::CTextDeflateInflate();
	case OOXMLShapes::sptCTextDeflateInflateDeflate: return new OOXMLShapes::CTextDeflateInflateDeflate();
	case OOXMLShapes::sptCTextDeflateTop: return new OOXMLShapes::CTextDeflateTop();
	case OOXMLShapes::sptCTextDoubleWave1: return new OOXMLShapes::CTextDoubleWave1();
	case OOXMLShapes::sptCTextFadeDown: return new OOXMLShapes::CTextFadeDown();
	case OOXMLShapes::sptCTextFadeLeft: return new OOXMLShapes::CTextFadeLeft();
	case OOXMLShapes::sptCTextFadeRight: return new OOXMLShapes::CTextFadeRight();
	case OOXMLShapes::sptCTextFadeUp: return new OOXMLShapes::CTextFadeUp();
	case OOXMLShapes::sptCTextInflate: return new OOXMLShapes::CTextInflate();
	case OOXMLShapes::sptCTextInflateBottom: return new OOXMLShapes::CTextInflateBottom();
	case OOXMLShapes::sptCTextInflateTop: return new OOXMLShapes::CTextInflateTop();
	case OOXMLShapes::sptCTextPlain: return new OOXMLShapes::CTextPlain();
	case OOXMLShapes::sptCTextRingInside: return new OOXMLShapes::CTextRingInside();
	case OOXMLShapes::sptCTextRingOutside: return new OOXMLShapes::CTextRingOutside();
	case OOXMLShapes::sptCTextSlantDown: return new OOXMLShapes::CTextSlantDown();
	case OOXMLShapes::sptCTextSlantUp: return new OOXMLShapes::CTextSlantUp();
	case OOXMLShapes::sptCTextStop: return new OOXMLShapes::CTextStop();
	case OOXMLShapes::sptCTextTriangle: return new OOXMLShapes::CTextTriangle();
	case OOXMLShapes::sptCTextTriangleInverted: return new OOXMLShapes::CTextTriangleInverted();
	case OOXMLShapes::sptCTextWave1: return new OOXMLShapes::CTextWave1();
	case OOXMLShapes::sptCTextWave2: return new OOXMLShapes::CTextWave2();
	case OOXMLShapes::sptCTextWave4: return new OOXMLShapes::CTextWave4();
	case OOXMLShapes::sptCTrapezoid: return new OOXMLShapes::CTrapezoid();
	case OOXMLShapes::sptCTriangle: return new OOXMLShapes::CTriangle();
	case OOXMLShapes::sptCUpArrow: return new OOXMLShapes::CUpArrow();
	case OOXMLShapes::sptCUpArrowCallout: return new OOXMLShapes::CUpArrowCallout();
	case OOXMLShapes::sptCUpDownArrow: return new OOXMLShapes::CUpDownArrow();
	case OOXMLShapes::sptCUpDownArrowCallout: return new OOXMLShapes::CUpDownArrowCallout();
	case OOXMLShapes::sptCUturnArrow: return new OOXMLShapes::CUturnArrow();
	case OOXMLShapes::sptCVerticalScroll: return new OOXMLShapes::CVerticalScroll();
	case OOXMLShapes::sptCWave: return new OOXMLShapes::CWave();
	case OOXMLShapes::sptCWedgeEllipseCallout: return new OOXMLShapes::CWedgeEllipseCallout();
	case OOXMLShapes::sptCWedgeRectCallout: return new OOXMLShapes::CWedgeRectCallout();
	case OOXMLShapes::sptCWedgeRoundRectCallout: return new OOXMLShapes::CWedgeRoundRectCallout();
	}
	return NULL;
}