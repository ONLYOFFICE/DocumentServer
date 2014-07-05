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
#include "Formula.h"
#include <string>
#include "./../BaseShape.h"

#include "../../../../XmlUtils.h"
#include "..\..\CustomGeomShape.h"

using namespace NSOfficeDrawing;

namespace PPTShapes
{
	enum ShapeType : unsigned short
	{
		sptMin = 0,
		sptNotPrimitive = sptMin,
		sptCRect = 1,
		sptCRoundRect = 2,
		sptCEllipse = 3,
		sptCDiamond = 4,
		sptCIsocelesTriangle = 5,
		sptCRtTriangle = 6,
		sptCParallelogram = 7,
		sptCTrapezoid = 8,
		sptCHexagon = 9,
		sptCOctagon = 10,
		sptCPlus = 11,
		sptCStar5 = 12,
		sptCRightArrow = 13,
		sptCThickArrow = 14,
		sptCHomePlate = 15,
		sptCCube = 16,
		sptCBalloon = 17,
		sptCSeal = 18,
		sptCArc = 19,
		sptCLine = 20,
		sptCPlaque = 21,
		sptCCan = 22,
		sptCDonut = 23,
		sptCTextSimple = 24,
		sptCTextOctagon = 25,
		sptCTextHexagon = 26,
		sptCTextCurve = 27,
		sptCTextWave = 28,
		sptCTextRing = 29,
		sptCTextOnCurve = 30,
		sptCTextOnRing = 31,
		sptCStraightConnector1 = 32,
		sptCBentConnector2 = 33,
		sptCBentConnector3 = 34,
		sptCBentConnector4 = 35,
		sptCBentConnector5 = 36,
		sptCCurvedConnector2 = 37,
		sptCCurvedConnector3 = 38,
		sptCCurvedConnector4 = 39,
		sptCCurvedConnector5 = 40,
		sptCCallout1 = 41,
		sptCCallout2 = 42,
		sptCCallout3 = 43,
		sptCAccentCallout1 = 44,
		sptCAccentCallout2 = 45,
		sptCAccentCallout3 = 46,
		sptCBorderCallout1 = 47,
		sptCBorderCallout2 = 48,
		sptCBorderCallout3 = 49,
		sptCAccentBorderCallout1 = 50,
		sptCAccentBorderCallout2 = 51,
		sptCAccentBorderCallout3 = 52,
		sptCRibbon = 53,
		sptCRibbon2 = 54,
		sptCChevron = 55,
		sptCPentagon = 56,
		sptCNoSmoking = 57,
		sptCStar8 = 58,
		sptCStar16 = 59,
		sptCStar32 = 60,
		sptCWedgeRectCallout = 61,
		sptCWedgeRoundRectCallout = 62,
		sptCWedgeEllipseCallout = 63,
		sptCWave = 64,
		sptCFoldedCorner = 65,
		sptCLeftArrow = 66,
		sptCDownArrow = 67,
		sptCUpArrow = 68,
		sptCLeftRightArrow = 69,
		sptCUpDownArrow = 70,
		sptCIrregularSeal1 = 71,
		sptCIrregularSeal2 = 72,
		sptCLightningBolt = 73,
		sptCHeart = 74,
		sptCFrame = 75,
		sptCQuadArrow = 76,
		sptCLeftArrowCallout = 77,
		sptCRightArrowCallout = 78,
		sptCUpArrowCallout = 79,
		sptCDownArrowCallout = 80,
		sptCLeftRightArrowCallout = 81,
		sptCUpDownArrowCallout = 82,
		sptCQuadArrowCallout = 83,
		sptCBevel = 84,
		sptCLeftBracket = 85,
		sptCRightBracket = 86,
		sptCLeftBrace = 87,
		sptCRightBrace = 88,
		sptCLeftUpArrow = 89,
		sptCBentUpArrow = 90,
		sptCBentArrow = 91,
		sptCStar24 = 92,
		sptCStripedRightArrow = 93,
		sptCNotchedRightArrow = 94,
		sptCBlockArc = 95,
		sptCSmileyFace = 96,
		sptCVerticalScroll = 97,
		sptCHorizontalScroll = 98,
		sptCCircularArrow = 99,
		sptCNotchedCircularArrow = 100,
		sptCUturnArrow = 101,
		sptCCurvedRightArrow = 102,
		sptCCurvedLeftArrow = 103,
		sptCCurvedUpArrow = 104,
		sptCCurvedDownArrow = 105,
		sptCCloudCallout = 106,
		sptCEllipseRibbon = 107,
		sptCEllipseRibbon2 = 108,
		sptCFlowChartProcess = 109,
		sptCFlowChartDecision = 110,
		sptCFlowChartInputOutput = 111,
		sptCFlowChartPredefinedProcess = 112,
		sptCFlowChartInternalStorage = 113,
		sptCFlowChartDocument = 114,
		sptCFlowChartMultidocument = 115,
		sptCFlowChartTerminator = 116,
		sptCFlowChartPreparation = 117,
		sptCFlowChartManualInput = 118,
		sptCFlowChartManualOperation = 119,
		sptCFlowChartConnector = 120,
		sptCFlowChartPunchedCard = 121,
		sptCFlowChartPunchedTape = 122,
		sptCFlowChartSummingJunction = 123,
		sptCFlowChartOr = 124,
		sptCFlowChartCollate = 125,
		sptCFlowChartSort = 126,
		sptCFlowChartExtract = 127,
		sptCFlowChartMerge = 128,
		sptCFlowChartOfflineStorage = 129,
		sptCFlowChartOnlineStorage = 130,
		sptCFlowChartMagneticTape = 131,
		sptCFlowChartMagneticDisk = 132,
		sptCFlowChartMagneticDrum = 133,
		sptCFlowChartDisplay = 134,
		sptCFlowChartDelay = 135,
		sptCTextPlain = 136,
		sptCTextStop = 137,
		sptCTextTriangle = 138,
		sptCTextTriangleInverted = 139,
		sptCTextChevron = 140,
		sptCTextChevronInverted = 141,
		sptCTextRingInside = 142,
		sptCTextRingOutside = 143,
		sptCTextArchUp = 144,
		sptCTextArchDown = 145,
		sptCTextCircle = 146,
		sptCTextButton = 147,
		sptCTextArchUpPour = 148,
		sptCTextArchDownPour = 149,
		sptCTextCirclePour = 150,
		sptCTextButtonPour = 151,
		sptCTextCurveUp = 152,
		sptCTextCurveDown = 153,
		sptCTextCascadeUp = 154,
		sptCTextCascadeDown = 155,
		sptCTextWave1 = 156,
		sptCTextWave2 = 157,
		sptCTextWave3 = 158,
		sptCTextWave4 = 159,
		sptCTextInflate = 160,
		sptCTextDeflate = 161,
		sptCTextInflateBottom = 162,
		sptCTextDeflateBottom = 163,
		sptCTextInflateTop = 164,
		sptCTextDeflateTop = 165,
		sptCTextDeflateInflate = 166,
		sptCTextDeflateInflateDeflate = 167,
		sptCTextFadeRight = 168,
		sptCTextFadeLeft = 169,
		sptCTextFadeUp = 170,
		sptCTextFadeDown = 171,
		sptCTextSlantUp = 172,
		sptCTextSlantDown = 173,
		sptCTextCanUp = 174,
		sptCTextCanDown = 175,
		sptCFlowChartAlternateProcess = 176,
		sptCFlowChartOffpageConnector = 177,
		sptCCallout90 = 178,
		sptCAccentCallout90 = 179,
		sptCBorderCallout90 = 180,
		sptCAccentBorderCallout90 = 181,
		sptCLeftRightUpArrow = 182,
		sptCSun = 183,
		sptCMoon = 184,
		sptCBracketPair = 185,
		sptCBracePair = 186,
		sptCStar4 = 187,
		sptCDoubleWave = 188,
		sptCActionButtonBlank = 189,
		sptCActionButtonHome = 190,
		sptCActionButtonHelp = 191,
		sptCActionButtonInformation = 192,
		sptCActionButtonForwardNext = 193,
		sptCActionButtonBackPrevious = 194,
		sptCActionButtonEnd = 195,
		sptCActionButtonBeginning = 196,
		sptCActionButtonReturn = 197,
		sptCActionButtonDocument = 198,
		sptCActionButtonSound = 199,
		sptCActionButtonMovie = 200,
		sptCHostControl = 201,
		sptCTextBox = 202,

		
		sptCChartPlus = 203,
		sptCChartStar,
		sptCChartX,
		sptCChord,
		sptCCloud,
		sptCCorner,
		sptCCornerTabs,
		sptCDecagon,
		sptCDiagStripe,
		sptCDodecagon,
		sptCFunnel,
		sptCGear6,
		sptCGear9,
		sptCHalfFrame,
		sptCHeptagon,
		sptCLeftCircularArrow,
		sptCLeftRightCircularArrow,
		sptCLeftRightRibbon,
		sptCLineInv,
		sptCMathDivide,
		sptCMathEqual,
		sptCMathMinus,
		sptCMathMultiply,
		sptCMathNotEqual,
		sptCMathPlus,
		sptCNonIsoscelesTrapezoid,
		sptCPie,
		sptCPieWedge,
		sptCPlaqueTabs,
		sptCRound1Rect,
		sptCRound2DiagRect,
		sptCRound2SameRect,
		sptCSnip1Rect,
		sptCSnip2DiagRect,
		sptCSnip2SameRect,
		sptCSnipRoundRect,
		sptCSquareTabs,
		sptCStar10,
		sptCStar12,
		
		
		
		
		
		sptCStar6,
		sptCStar7,
		
		sptCSwooshArrow,
		sptCTeardrop,
		sptCTextDoubleWave1,
		sptCTriangle,

		sptMax,
		sptNil = 0x0FFF,
		sptCustom = 0x1000
	};
}

class CElementsContainer;
class CProperties;
class CProperty;
class CShape;

class CPPTShape : public CBaseShape
{
public:
	PPTShapes::ShapeType			m_eType;
	NSGuidesVML::CFormulasManager	m_oManager;

	NSCustomVML::CCustomVML m_oCustomVML;

	CString m_strPathLimoX;
	CString m_strPathLimoY;

	CAtlArray<CString> m_arStringTextRects;

public:
	CPPTShape() : CBaseShape(), m_arStringTextRects()
	{
		m_eType = PPTShapes::sptMin;

		m_arStringTextRects.Add(_T("0,0,21600,21600"));

		m_strPathLimoX = _T("");
		m_strPathLimoY = _T("");	
	}

	~CPPTShape()
	{
	}
	virtual bool LoadFromXML(const CString& xml)
	{
		XmlUtils::CXmlNode oNodePict;
		if (oNodePict.FromXmlString(xml))
		{
			return LoadFromXML(oNodePict);
		}
		return false;
	}

	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	

	
	
	
	
	

	
	
	
	

	
	
	
	
	
	

	
	
	
	
	

	
	
	
	
	

	
	
	
	
	
	
	
	
	
	

	
	
	
	
	

	
	
	
	

	
	
	

	
	

	virtual bool LoadFromXML(XmlUtils::CXmlNode& oNodePict)
	{		
		CString id = oNodePict.GetAttributeOrValue(_T("type"));
		bool isPathList = false;
		if (id != _T(""))
		{
			SetShapeType((PPTShapes::ShapeType)XmlUtils::GetInteger(id));
		}
		else
		{
			XmlUtils::CXmlNode oNodeTemplate;
			if (oNodePict.GetNode(_T("template"), oNodeTemplate))
			{	
				CString strAdj = oNodeTemplate.GetAttributeOrValue(_T("adj"));
				LoadAdjustValuesList(strAdj);

				XmlUtils::CXmlNode oNodeGuides;
				if (oNodeTemplate.GetNode(_T("v:formulas"), oNodeGuides))
				{
					LoadGuidesList(oNodeGuides.GetXml());
				}

				CString strPath = oNodeTemplate.GetAttributeOrValue(_T("path"));
				if (strPath != _T(""))
				{
					LoadPathList(strPath);
					isPathList = true;
				}
			}
		}

		XmlUtils::CXmlNode oNodeGuides;
		if (oNodePict.GetNode(_T("path"), oNodeGuides))
		{
			CString strPath = oNodeGuides.GetAttributeOrValue(_T("val"));
			if (strPath != _T(""))
			{
				LoadPathList(strPath);
				isPathList = true;
			}
		}

		if (!isPathList)
			ReCalculate();
		return true;
	}
	

	virtual bool LoadAdjustValuesList(const CString& xml)
	{
		CSimpleArray<CString> arAdj;
		NSStringUtils::ParseString(_T(","), xml, &arAdj);

		m_arAdjustments.RemoveAll();
		for (int nIndex = 0; nIndex < arAdj.GetSize(); ++nIndex)
		{
			m_arAdjustments.Add((LONG)XmlUtils::GetInteger(arAdj[nIndex]));
		}
		return true;
	}

	virtual bool LoadGuidesList(const CString& xml)
	{
		XmlUtils::CXmlNode oNodeGuides;
		if (oNodeGuides.FromXmlString(xml) && (_T("v:formulas") == oNodeGuides.GetName()))
		{
			m_oManager.RemoveAll();
			
			XmlUtils::CXmlNodes oList;
			if (oNodeGuides.GetNodes(_T("v:f"), oList))
			{
				int lCount = oList.GetCount();
				for (int nIndex = 0; nIndex < lCount; ++nIndex)
				{
					XmlUtils::CXmlNode oNodeFormula;
					oList.GetAt(nIndex, oNodeFormula);

					m_oManager.AddFormula(oNodeFormula.GetAttributeOrValue(_T("eqn")));
				}
			}

			m_oManager.Clear(&m_arAdjustments);
			m_oManager.CalculateResults();
			return true;
		}

		return false;
	}

	virtual void AddGuide(const CString& strGuide)
	{
		m_oManager.AddFormula(strGuide);
	}

	virtual bool LoadAdjustHandlesList(const CString& xml)
	{
		return true;
	}

	virtual bool LoadConnectorsList(const CString& xml)
	{
		return true;
	}

	virtual bool LoadTextRect(const CString& xml)
	{
		CSimpleArray<CString> oArray;
		NSStringUtils::ParseString(_T(";"), xml, &oArray);

		LONG lCount = (LONG)oArray.GetSize();

		if (lCount <= 0)
			return true;

		m_arStringTextRects.RemoveAll();
		for (LONG i = 0; i < lCount; ++i)
		{
			m_arStringTextRects.Add(oArray[i]);
		}
		
		return true;
	}

	virtual bool LoadPathList(const CString& xml)
	{
		m_strPath = xml;
		m_oPath.FromXML(xml, m_oManager);
		return true;
	}

	virtual bool SetAdjustment(long index, long value)
	{
		return (TRUE == m_arAdjustments.SetAtIndex(index, value));
	}

	virtual CString ToXML(CGeomShapeInfo& GeomInfo, CMetricInfo& MetricInfo, double StartTime, double EndTime, CBrush_& Brush, CPen_& Pen)
	{
		if ((_T("") != m_strPathLimoX) || _T("") != m_strPathLimoY)
		{
			m_strPath = (GeomInfo.m_dWidth >= GeomInfo.m_dHeight) ? m_strPathLimoX : m_strPathLimoY;
			ReCalculate();
			m_oPath.SetCoordsize(21600, 21600);
		}
		
		return m_oPath.ToXml(GeomInfo, StartTime, EndTime, Pen, Brush, MetricInfo, NSBaseShape::ppt);
	}

	virtual void ReCalculate()
	{
		m_oManager.Clear(&m_arAdjustments);
		m_oManager.CalculateResults();

		LoadPathList(m_strPath);
	}

	static CPPTShape* CreateByType(PPTShapes::ShapeType type);
	virtual const ClassType GetClassType()const
	{
		return NSBaseShape::ppt;
	}

	virtual bool SetProperties(CBaseShape* Shape)
	{
		if(Shape == NULL)
			return false;

		if(Shape->GetClassType() != NSBaseShape::ppt)
			return false;

		m_oManager = ((CPPTShape*)Shape)->m_oManager;

		m_strPathLimoX = ((CPPTShape*)Shape)->m_strPathLimoX;
		m_strPathLimoY = ((CPPTShape*)Shape)->m_strPathLimoY;

		m_arStringTextRects.Copy(((CPPTShape*)Shape)->m_arStringTextRects);
		
		return CBaseShape::SetProperties(Shape);
	}

	virtual bool SetToDublicate(CBaseShape* Shape)
	{
		if(Shape == NULL)
			return false;

		if(Shape->GetClassType() != NSBaseShape::ppt)
			return false;

		((CPPTShape*)Shape)->m_oManager = m_oManager;

		((CPPTShape*)Shape)->m_strPathLimoX = m_strPathLimoX;
		((CPPTShape*)Shape)->m_strPathLimoY = m_strPathLimoY;

		((CPPTShape*)Shape)->m_arStringTextRects.Copy(m_arStringTextRects);

		return CBaseShape::SetToDublicate(Shape);
	}

	bool SetShapeType(PPTShapes::ShapeType type)
	{
		CPPTShape* l_pShape = CreateByType(type);
		if(l_pShape != NULL)
		{
			m_eType = type;

			SetProperties(l_pShape);
			delete l_pShape;
			return true;
		}

		m_eType = PPTShapes::sptCustom;
		return false;
	}

	virtual void SetProperty(CProperty* pProperty, CElementsContainer* pSlide, CShape* pParentShape);
	virtual void SetColor(const DWORD& dwVal, CColor_& oColor, CElementsContainer* pSlide);

	void SetProperties(CProperties* pProperties, CElementsContainer* pSlide, CShape* pParentShape);

	void CalcTextRectOffsets(double& dPercentLeft, double& dPercentTop, double& dPercentRight, double& dPercentBottom, LONG nIndex = 0)
	{
		dPercentLeft	= 0;
		dPercentTop		= 0;
		dPercentRight	= 0;
		dPercentBottom	= 0;

		if ((nIndex < 0) || (nIndex >= (LONG)m_arStringTextRects.GetCount()))
			return;

		if (m_oPath.m_arParts.GetSize() == 0)
			return;

		LONG lWidth		= m_oPath.m_arParts[0].width;
		LONG lHeight	= m_oPath.m_arParts[0].height;

		CSimpleArray<CString> oArray;
		NSStringUtils::ParseString(_T(","), m_arStringTextRects[nIndex], &oArray);

		if (4 != oArray.GetSize())
			return;
		
		LONG lLeft		= 0;
		LONG lTop		= 0;
		LONG lRight		= 0;
		LONG lBottom	= 0;

		bool bOk = true;

		bOk = (bOk && GetPos(oArray[0], lLeft));
		bOk = (bOk && GetPos(oArray[1], lTop));
		bOk = (bOk && GetPos(oArray[2], lRight));
		bOk = (bOk && GetPos(oArray[3], lBottom));

		if (!bOk)
			return;

		dPercentLeft	= (double)lLeft		/ lWidth;
		dPercentTop		= (double)lTop		/ lHeight;

		dPercentRight	= (double)(lWidth - lRight)		/ lWidth;
		dPercentBottom	= (double)(lHeight - lBottom)	/ lHeight;
	}

protected:

	bool GetPos(CString str, LONG& lValue)
	{
		if (str.GetLength() == 0)
			return false;

		TCHAR mem = str.GetAt(0);

		bool bFormula = false;
		if ('@' == mem)
		{
			bFormula = true;
			str.Delete(0);
		}
		
		if (!NSStringUtils::IsNumber(str))
			return false;

		lValue = 0;
		lValue = _ttoi(str);

		if (bFormula)
		{
			if (lValue >= 0 || lValue < m_oManager.m_arResults.GetSize())
			{
				lValue = m_oManager.m_arResults[lValue];
				return true;
			}
			return false;
		}

		return true;
	}
};