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
#include "./../BaseShape.h"

#include "../../../../XmlUtils.h"

using namespace NSOfficeDrawing;

namespace OOXMLShapes
{
	enum ShapeType : unsigned short
	{
		sptMin = 0,
		sptNotPrimitive = sptMin,
		sptCAccentBorderCallout1,
		sptCAccentBorderCallout2,
		sptCAccentBorderCallout3,
		sptCAccentCallout1,
		sptCAccentCallout2,
		sptCAccentCallout3,
		sptCActionButtonBackPrevious,
		sptCActionButtonBeginning,
		sptCActionButtonBlank,
		sptCActionButtonDocument,
		sptCActionButtonEnd,
		sptCActionButtonForwardNext,
		sptCActionButtonHelp,
		sptCActionButtonHome,
		sptCActionButtonInformation,
		sptCActionButtonMovie,
		sptCActionButtonReturn,
		sptCActionButtonSound,
		sptCArc,
		sptCBentArrow,
		sptCBentConnector2,
		sptCBentConnector3,
		sptCBentConnector4,
		sptCBentConnector5,
		sptCBentUpArrow,
		sptCBevel,
		sptCBlockArc,
		sptCBorderCallout1,
		sptCBorderCallout2,
		sptCBorderCallout3,
		sptCBracePair,
		sptCBracketPair,
		sptCCallout1,
		sptCCallout2,
		sptCCallout3,
		sptCCan,
		sptCChartPlus,
		sptCChartStar,
		sptCChartX,
		sptCChevron,
		sptCChord,
		sptCCircularArrow,
		sptCCloud,
		sptCCloudCallout,
		sptCCorner,
		sptCCornerTabs,
		sptCCube,
		sptCCurvedConnector2,
		sptCCurvedConnector3,
		sptCCurvedConnector4,
		sptCCurvedConnector5,
		sptCCurvedDownArrow,
		sptCCurvedLeftArrow,
		sptCCurvedRightArrow,
		sptCCurvedUpArrow,
		sptCDecagon,
		sptCDiagStripe,
		sptCDiamond,
		sptCDodecagon,
		sptCDonut,
		sptCDoubleWave,
		sptCDownArrow,
		sptCDownArrowCallout,
		sptCEllipse,
		sptCEllipseRibbon,
		sptCEllipseRibbon2,
		sptCFlowChartAlternateProcess,
		sptCFlowChartCollate,
		sptCFlowChartConnector,
		sptCFlowChartDecision,
		sptCFlowChartDelay,
		sptCFlowChartDisplay,
		sptCFlowChartDocument,
		sptCFlowChartExtract,
		sptCFlowChartInputOutput,
		sptCFlowChartInternalStorage,
		sptCFlowChartMagneticDisk,
		sptCFlowChartMagneticDrum,
		sptCFlowChartMagneticTape,
		sptCFlowChartManualInput,
		sptCFlowChartManualOperation,
		sptCFlowChartMerge,
		sptCFlowChartMultidocument,
		sptCFlowChartOfflineStorage,
		sptCFlowChartOffpageConnector,
		sptCFlowChartOnlineStorage,
		sptCFlowChartOr,
		sptCFlowChartPredefinedProcess,
		sptCFlowChartPreparation,
		sptCFlowChartProcess,
		sptCFlowChartPunchedCard,
		sptCFlowChartPunchedTape,
		sptCFlowChartSort,
		sptCFlowChartSummingJunction,
		sptCFlowChartTerminator,
		sptCFoldedCorner,
		sptCFrame,
		sptCFunnel,
		sptCGear6,
		sptCGear9,
		sptCHalfFrame,
		sptCHeart,
		sptCHeptagon,
		sptCHexagon,
		sptCHomePlate,
		sptCHorizontalScroll,
		sptCIrregularSeal1,
		sptCIrregularSeal2,
		sptCLeftArrow,
		sptCLeftArrowCallout,
		sptCLeftBrace,
		sptCLeftBracket,
		sptCLeftCircularArrow,
		sptCLeftRightArrow,
		sptCLeftRightArrowCallout,
		sptCLeftRightCircularArrow,
		sptCLeftRightRibbon,
		sptCLeftRightUpArrow,
		sptCLeftUpArrow,
		sptCLightningBolt,
		sptCLine,
		sptCLineInv,
		sptCMathDivide,
		sptCMathEqual,
		sptCMathMinus,
		sptCMathMultiply,
		sptCMathNotEqual,
		sptCMathPlus,
		sptCMoon,
		sptCNonIsoscelesTrapezoid,
		sptCNoSmoking,
		sptCNotchedRightArrow,
		sptCOctagon,
		sptCParallelogram,
		sptCPentagon,
		sptCPie,
		sptCPieWedge,
		sptCPlaque,
		sptCPlaqueTabs,
		sptCPlus,
		sptCQuadArrow,
		sptCQuadArrowCallout,
		sptCRect,
		sptCRibbon,
		sptCRibbon2,
		sptCRightArrow,
		sptCRightArrowCallout,
		sptCRightBrace,
		sptCRightBracket,
		sptCRound1Rect,
		sptCRound2DiagRect,
		sptCRound2SameRect,
		sptCRoundRect,
		sptCRtTriangle,
		sptCSmileyFace,
		sptCSnip1Rect,
		sptCSnip2DiagRect,
		sptCSnip2SameRect,
		sptCSnipRoundRect,
		sptCSquareTabs,
		sptCStar10,
		sptCStar12,
		sptCStar16,
		sptCStar24,
		sptCStar32,
		sptCStar4,
		sptCStar5,
		sptCStar6,
		sptCStar7,
		sptCStar8,
		sptCStraightConnector1,
		sptCStripedRightArrow,
		sptCSun,
		sptCSwooshArrow,
		sptCTeardrop,
		sptCTextArchDown,
		sptCTextArchDownPour,
		sptCTextArchUp,
		sptCTextArchUpPour,
		sptCTextButton,
		sptCTextButtonPour,
		sptCTextCanDown,
		sptCTextCanUp,
		sptCTextCascadeDown,
		sptCTextCascadeUp,
		sptCTextChevron,
		sptCTextChevronInverted,
		sptCTextCircle,
		sptCTextCirclePour,
		sptCTextCurveDown,
		sptCTextCurveUp,
		sptCTextDeflate,
		sptCTextDeflateBottom,
		sptCTextDeflateInflate,
		sptCTextDeflateInflateDeflate,
		sptCTextDeflateTop,
		sptCTextDoubleWave1,
		sptCTextFadeDown,
		sptCTextFadeLeft,
		sptCTextFadeRight,
		sptCTextFadeUp,
		sptCTextInflate,
		sptCTextInflateBottom,
		sptCTextInflateTop,
		sptCTextPlain,
		sptCTextRingInside,
		sptCTextRingOutside,
		sptCTextSlantDown,
		sptCTextSlantUp,
		sptCTextStop,
		sptCTextTriangle,
		sptCTextTriangleInverted,
		sptCTextWave1,
		sptCTextWave2,
		sptCTextWave4,
		sptCTrapezoid,
		sptCTriangle,
		sptCUpArrow,
		sptCUpArrowCallout,
		sptCUpDownArrow,
		sptCUpDownArrowCallout,
		sptCUturnArrow,
		sptCVerticalScroll,
		sptCWave,
		sptCWedgeEllipseCallout,
		sptCWedgeRectCallout,
		sptCWedgeRoundRectCallout,

		sptMax,
		sptNil = 0x0FFF,
		sptCustom = 0x1000
	};
}

class CPPTXShape : public CBaseShape
{
public:
	OOXMLShapes::ShapeType m_eType;

	NSGuidesOOXML::CFormulaManager FManager;
public:
	CPPTXShape() : CBaseShape(), FManager(m_arAdjustments, Guides)
	{
		m_eType = OOXMLShapes::sptMin;
	}

	~CPPTXShape()
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

	virtual bool LoadFromXML(XmlUtils::CXmlNode& root)
	{
		
		
		XmlUtils::CXmlNode avLst;
		bool res = true;
		if(root.GetNode(_T("avLst"), avLst))
			res &= LoadAdjustValuesList(avLst.GetXml());

		XmlUtils::CXmlNode gdLst;
		if(root.GetNode(_T("gdLst"), gdLst))
			res &= LoadGuidesList(gdLst.GetXml());

		XmlUtils::CXmlNode ahLst;
		if(root.GetNode(_T("ahLst"), ahLst))
			res &= LoadAdjustHandlesList(ahLst.GetXml());

		XmlUtils::CXmlNode cxnLst;
		if(root.GetNode(_T("cxnLst"), cxnLst))
			res &= LoadConnectorsList(cxnLst.GetXml());

		XmlUtils::CXmlNode textRect;
		if(root.GetNode(_T("rect"), textRect))
		{
			m_strRect = textRect.GetXml();
			res &= LoadTextRect(m_strRect);
		}

		XmlUtils::CXmlNode pathLst;
		if(root.GetNode(_T("pathLst"), pathLst))
		{
			m_strPath = pathLst.GetXml();
			res &= LoadPathList(m_strPath);
		}

		return res;
	}


	virtual bool LoadAdjustValuesList(const CString& xml)
	{
		XmlUtils::CXmlNode avLst;
		if(avLst.FromXmlString(xml))
		{
			XmlUtils::CXmlNodes list;
			if(avLst.GetNodes(_T("gd"), list))
			{
				for(long i = 0; i < list.GetCount(); i++)
				{
					XmlUtils::CXmlNode gd;
					list.GetAt(i, gd);
					FManager.AddAdjustment(gd.GetAttribute(_T("name")), gd.GetAttribute(_T("fmla")));
				}
			}
			return true;
		}
		return false;
	}

	virtual bool LoadGuidesList(const CString& xml)
	{
		XmlUtils::CXmlNode gdLst;
		if(gdLst.FromXmlString(xml))
		{
			XmlUtils::CXmlNodes list;
			if(gdLst.GetNodes(_T("gd"), list))
			{
				for(long i = 0; i < list.GetCount(); i++)
				{
					XmlUtils::CXmlNode gd;
					list.GetAt(i, gd);
					FManager.AddGuide(gd.GetAttribute(_T("name")), gd.GetAttribute(_T("fmla")));
				}
			}
			return true;
		}
		return false;
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
		XmlUtils::CXmlNode rect;
		if(rect.FromXmlString(xml))
		{
			RECT TextRect;
			TextRect.top = (long)FManager.GetValue(rect.GetAttribute(_T("t")));
			TextRect.left = (long)FManager.GetValue(rect.GetAttribute(_T("l")));
			TextRect.right = (long)FManager.GetValue(rect.GetAttribute(_T("r")));
			TextRect.bottom = (long)FManager.GetValue(rect.GetAttribute(_T("b")));
			if(m_arTextRects.GetSize() > 0)
				m_arTextRects[0] = TextRect;
			else m_arTextRects.Add(TextRect);
			return true;
		}
		return false;
	}

	virtual bool LoadPathList(const CString& xml)
	{
		XmlUtils::CXmlNode pathLst;
		if(pathLst.FromXmlString(xml))
		{
			XmlUtils::CXmlNodes list;
			if(pathLst.GetNodes(_T("path"), list))
			{
				m_oPath.FromXML(list, FManager);
			}
			return true;
		}
		return false;
	}

	virtual bool SetAdjustment(long index, long value)
	{
		FManager.Clear();
		return (TRUE == m_arAdjustments.SetAtIndex(index, value));
	}

	virtual CString ToXML(CGeomShapeInfo& GeomInfo, CMetricInfo& MetricInfo, double StartTime, double EndTime, CBrush_& Brush, CPen_& Pen)
	{
		FManager.SetWidthHeight((long)GeomInfo.m_dWidth, (long)GeomInfo.m_dHeight);
		ReCalculate();

		return m_oPath.ToXml(GeomInfo, StartTime, EndTime, Pen, Brush, MetricInfo, NSBaseShape::pptx);
	}

	virtual void ReCalculate()
	{
		FManager.ReCalculateGuides();
		LoadTextRect(m_strRect);
		LoadPathList(m_strPath);
	}

	static CPPTXShape* CreateByType(OOXMLShapes::ShapeType type);
	virtual const ClassType GetClassType()const
	{
		return NSBaseShape::pptx;
	}

	virtual bool SetProperties(CBaseShape* Shape)
	{
		if(Shape == NULL)
			return false;

		if(Shape->GetClassType() != NSBaseShape::pptx)
			return false;

		FManager = ((CPPTXShape*)Shape)->FManager;
		return CBaseShape::SetProperties(Shape);
	}

	virtual bool SetToDublicate(CBaseShape* Shape)
	{
		if(Shape == NULL)
			return false;

		if(Shape->GetClassType() != NSBaseShape::pptx)
			return false;

		((CPPTXShape*)Shape)->FManager = FManager;
		return CBaseShape::SetToDublicate(Shape);
	}

	bool SetShapeType(OOXMLShapes::ShapeType type)
	{
		CPPTXShape* l_pShape = CreateByType(type);
		if(l_pShape != NULL)
		{
			m_eType = type;

			SetProperties(l_pShape);
			delete l_pShape;
			return true;
		}

		m_eType = OOXMLShapes::sptCustom;
		return false;
	}
};