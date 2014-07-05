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
#include "../Structures.h"
#include "BaseShape/BaseShape.h"

#include "../../XmlUtils.h"

#include "StringUtils.h"
#include "Baseshape\Common.h"


#if defined(PPTX_DEF)
#include "BaseShape/PPTXShape/PPTXShape.h"
#endif

#if defined(PPT_DEF)
#include "BaseShape/PPTShape/PPTShape.h"
#endif

#if defined(ODP_DEF)
#include "BaseShape/OdpShape/OdpShape.h"
#endif
using namespace NSAttributes;

class CElementsContainer;
class CProperties;
class CProperty;


const LONG c_ShapeDrawType_Graphic	= 0x01;
const LONG c_ShapeDrawType_Text		= 0x02;
const LONG c_ShapeDrawType_All		= c_ShapeDrawType_Graphic | c_ShapeDrawType_Text;

class CShape
{
public:
	double m_dStartTime;
	double m_dEndTime;

	CDoubleRect m_rcBounds;

	long m_lLimoX;
	long m_lLimoY;

	CPen_ m_oPen;
	CBrush_ m_oBrush;
	CTextAttributesEx m_oText;

	double m_dWidthLogic;
	double m_dHeightLogic;

	
	double m_dTextMarginX;
	double m_dTextMarginY;
	double m_dTextMarginRight;
	double m_dTextMarginBottom;

	LONG m_lDrawType;

	CBaseShape* m_pShape;
public:
	CShape(NSBaseShape::ClassType ClassType, int ShapeType) : m_rcBounds()
	{
		m_lDrawType = c_ShapeDrawType_All;

		m_lLimoX = 0;
		m_lLimoY = 0;

		m_dStartTime = 0.0;
		m_dEndTime = 0.0;

		m_dWidthLogic	= ShapeSize;
		m_dHeightLogic	= ShapeSize;

		m_dTextMarginX		= 0;
		m_dTextMarginY		= 0;
		m_dTextMarginRight	= 0;
		m_dTextMarginBottom	= 0;

		if(ClassType == NSBaseShape::unknown)
			m_pShape = NULL;

#if defined(PPTX_DEF)
		if(ClassType == NSBaseShape::pptx)
		{
			m_pShape = new CPPTXShape();
			m_pShape->SetType(NSBaseShape::pptx, ShapeType);
		}
#endif

#if defined(PPT_DEF)
		if(ClassType == NSBaseShape::ppt)
		{
			m_pShape = new CPPTShape();
			m_pShape->SetType(NSBaseShape::ppt, ShapeType);

			m_dTextMarginX		= 2.54;
			m_dTextMarginY		= 1.27;
			m_dTextMarginRight	= 2.54;
			m_dTextMarginBottom	= 1.27;
		}
#endif

#if defined(ODP_DEF)
		if(ClassType == NSBaseShape::odp)
		{
			m_pShape = new COdpShape();
			m_pShape->SetType(NSBaseShape::odp, ShapeType);
		}
#endif
	}

	~CShape()
	{
		if(m_pShape != NULL)
			delete m_pShape;
	}

	virtual void ReCalculate()
	{
		m_pShape->ReCalculate();
	}

	void SetProperties(CProperties* pProperties, CElementsContainer* pSlide);

	virtual CString GetTextXml(CGeomShapeInfo& oGeomInfo, CMetricInfo& pInfo, double dStartTime, double dEndTime)
	{
		if (m_oText.m_sText.GetLength() == 0)
		{
			return _T("");
		}

		GetTextRect(oGeomInfo);
		return m_oText.ToString(oGeomInfo, pInfo, dStartTime, dEndTime);
	}

	virtual CString GetBrushXml()
	{
		if (!m_pShape->m_bConcentricFill)
			return _T("");
		return m_oBrush.ToString();
	}

	virtual CString GetPenXml()
	{
		return m_oPen.ToString();
	}

	virtual void GetTextRect(CGeomShapeInfo& oInfo)
	{
		
		
		

#ifdef PPT_DEF
		
		
		double dPercentLeft		= 0;
		double dPercentTop		= 0;
		double dPercentRight	= 0;
		double dPercentBottom	= 0;

		if (NSBaseShape::ppt == m_pShape->GetClassType())
		{
			
			CPPTShape* pPPTShape = dynamic_cast<CPPTShape*>(m_pShape);
			if (NULL != pPPTShape)
			{
				pPPTShape->CalcTextRectOffsets(dPercentLeft, dPercentTop, dPercentRight, dPercentBottom);

				oInfo.m_dLeft	+= (dPercentLeft * oInfo.m_dWidth);
				oInfo.m_dTop	+= (dPercentTop * oInfo.m_dHeight);

				oInfo.m_dWidth	-= ((dPercentLeft + dPercentRight) * oInfo.m_dWidth);
				oInfo.m_dHeight	-= ((dPercentTop + dPercentBottom) * oInfo.m_dHeight);
			}
		}

		
		oInfo.m_dLeft	+= m_dTextMarginX;
		oInfo.m_dTop	+= m_dTextMarginY;
		oInfo.m_dWidth  -= (m_dTextMarginX + m_dTextMarginRight);
		oInfo.m_dHeight -= (m_dTextMarginY + m_dTextMarginBottom);	
#endif
#ifdef PPTX_DEF
		double koef = max(oInfo.m_dWidth, oInfo.m_dHeight)/ShapeSize;
		oInfo.m_dLeft += m_pShape->m_arTextRects[0].left * koef;
		oInfo.m_dTop += m_pShape->m_arTextRects[0].top * koef;
		oInfo.m_dWidth = (m_pShape->m_arTextRects[0].right - m_pShape->m_arTextRects[0].left) * koef;
		oInfo.m_dHeight = (m_pShape->m_arTextRects[0].bottom - m_pShape->m_arTextRects[0].top) * koef;

		oInfo.m_dLeft	+= m_dTextMarginX;
		oInfo.m_dTop	+= m_dTextMarginY;
		oInfo.m_dWidth  -= (m_dTextMarginX + m_dTextMarginRight);
		oInfo.m_dHeight -= (m_dTextMarginY + m_dTextMarginBottom);
#endif
	}

	virtual CString ToXml(CGeomShapeInfo& oGeomInfo, CMetricInfo& pInfo, double dStartTime, double dEndTime)
	{
		CString strImageTransform = _T("");

		oGeomInfo.m_dLimoX = m_lLimoX;
		oGeomInfo.m_dLimoY = m_lLimoY;

		m_pShape->m_oPath.SetCoordsize((LONG)m_dWidthLogic, (LONG)m_dHeightLogic);
		
		if (m_lDrawType & c_ShapeDrawType_Graphic)
		{
			strImageTransform += m_pShape->ToXML(oGeomInfo, pInfo, dStartTime, dEndTime, m_oBrush, m_oPen);
		}
		if (m_lDrawType & c_ShapeDrawType_Text)
		{
			strImageTransform += GetTextXml(oGeomInfo, pInfo, dStartTime, dEndTime);
		}

		return strImageTransform;
	}

#ifdef PPT_DEF
	void ToRenderer(IASCRenderer* pRenderer, CGeomShapeInfo& oGeomInfo, CMetricInfo& pInfo, double dStartTime, double dEndTime)
	{
		oGeomInfo.m_dLimoX = m_lLimoX;
		oGeomInfo.m_dLimoY = m_lLimoY;

		m_pShape->m_oPath.SetCoordsize((LONG)m_dWidthLogic, (LONG)m_dHeightLogic);
		
		if (m_lDrawType & c_ShapeDrawType_Graphic)
		{
			m_pShape->m_oPath.ToRenderer(pRenderer, oGeomInfo, dStartTime, dEndTime, m_oPen, m_oBrush, pInfo);
		}
	}
#endif


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
#if defined(PPTX_DEF)
		if(_T("ooxml-shape") == root.GetName())
		{
			if(m_pShape != NULL)
				delete m_pShape;
			m_pShape = new CPPTXShape();
			
			return ((CPPTXShape*)m_pShape)->LoadFromXML(root);
		}
#endif

#if defined(PPT_DEF)
		if(_T("shape") == root.GetName())
		{
			if(m_pShape != NULL)
				delete m_pShape;
			m_pShape = new CPPTShape();

			XmlUtils::CXmlNode templateNode;
			if (root.GetNode(_T("template"), templateNode)) {
				SetPen(templateNode);
				SetBrush(templateNode);
			}

			SetCoordSize(root);
			SetPen(root);
			SetBrush(root);
			
			
			return ((CPPTShape*)m_pShape)->LoadFromXML(root);			
		}
#endif

#if defined(ODP_DEF)
		if(_T("draw:enhanced-geometry") == root.GetName())
		{
			if(m_pShape != NULL)
				delete m_pShape;
			m_pShape = new COdpShape();
			
			return ((COdpShape*)m_pShape)->LoadFromXML(root);
		}
#endif
		return false;
	}

















































	virtual bool SetToDublicate(CShape* Shape)
	{
		if((Shape == NULL) || (m_pShape == NULL))
			return false;

		Shape->m_dStartTime		= m_dStartTime;
		Shape->m_dEndTime		= m_dEndTime;

		Shape->m_rcBounds		= m_rcBounds;

		Shape->m_lLimoX			= m_lLimoX;
		Shape->m_lLimoY			= m_lLimoY;

		Shape->m_oPen			= m_oPen;
		Shape->m_oBrush			= m_oBrush;
		Shape->m_oText			= m_oText;

		Shape->m_dWidthLogic	= m_dWidthLogic;
		Shape->m_dHeightLogic	= m_dHeightLogic;

		Shape->m_lDrawType		= m_lDrawType;

		Shape->m_dTextMarginX		= m_dTextMarginX;
		Shape->m_dTextMarginY		= m_dTextMarginY;
		Shape->m_dTextMarginRight	= m_dTextMarginRight;
		Shape->m_dTextMarginBottom	= m_dTextMarginBottom;

		return m_pShape->SetToDublicate(Shape->m_pShape);
	}


	void SetPen(XmlUtils::CXmlNode& oNodePict)
	{
		XmlUtils::CXmlNode oNodeTemplate;
		if (oNodePict.GetNode(_T("stroke"), oNodeTemplate))
		{
			CString strColor = oNodeTemplate.GetAttributeOrValue(_T("strokecolor"));
			if (strColor != _T(""))
				m_oPen.m_oColor = getColorFromString(strColor);
			CString strSize = oNodeTemplate.GetAttributeOrValue(_T("strokeweight"));
			if (strSize != _T(""))
				m_oPen.Size = XmlUtils::GetDouble(strSize);
			CString strStroke = oNodeTemplate.GetAttributeOrValue(_T("stroked"));
			if (strStroke == _T("t"))
				m_oPen.m_nAlpha = 255;
			else if (strStroke != _T(""))
				m_oPen.m_nAlpha = 0;
		}
		if (oNodePict.GetNode(_T("v:stroke"), oNodeTemplate))
		{
			CString style = oNodeTemplate.GetAttributeOrValue(_T("dashstyle"));
			if (style == _T("dash") || style == _T("longDash"))
				m_oPen.DashStyle = DashStyleDash;
			else if (style == _T("dashDot") || style == _T("longDashDot"))
				m_oPen.DashStyle = DashStyleDashDot;
			else if (style == _T("dashDotDot") || style == _T("longDashDotDot"))
				m_oPen.DashStyle = DashStyleDashDotDot;
			else if (style == _T("1 1"))
				m_oPen.DashStyle = DashStyleDot;

			CString endarrow = oNodeTemplate.GetAttribute(_T("endarrow"));
			if (endarrow == _T("block"))
				m_oPen.LineEndCap = LineCapArrowAnchor;
		}		
	}

	void SetBrush(XmlUtils::CXmlNode& oNodePict)
	{
#ifdef _DEBUG
		CString xml = oNodePict.GetXml();
#endif
		
		if (oNodePict.GetAttribute(_T("filled")) == _T("f"))
		{
			m_oBrush.m_Alpha1 = 0;
			m_oBrush.m_Alpha2 = 0;
			return;
		}
		XmlUtils::CXmlNode oNodeTemplate;
		CString strColor;
		if (oNodePict.GetNode(_T("fillcolor"), oNodeTemplate))
		{
			strColor = oNodeTemplate.GetAttributeOrValue(_T("val"));
			if (strColor != _T(""))
					m_oBrush.m_oColor1 = getColorFromString(strColor);
		}
		if (strColor != _T("none"))
		{
			if (strColor != _T(""))
				m_oBrush.m_oColor1 = getColorFromString(strColor);
			if (oNodePict.GetNode(_T("fill"), oNodeTemplate))
			{
				CString strColor = oNodeTemplate.GetAttributeOrValue(_T("color2"));
				if (strColor != _T("") && strColor != _T("none"))
					m_oBrush.m_oColor2 = getColor2FromString(strColor, m_oBrush.m_oColor1);

				CString strOpacity1 = oNodeTemplate.GetAttributeOrValue(_T("opacity"));
				if (strOpacity1 != _T(""))
					m_oBrush.m_Alpha1 = getOpacityFromString(strOpacity1);

				CString strOpacity2 = oNodeTemplate.GetAttributeOrValue(_T("o:opacity2"));
				if (strOpacity2 != _T(""))
					m_oBrush.m_Alpha2 = getOpacityFromString(strOpacity2);

				CString focus  = oNodeTemplate.GetAttributeOrValue(_T("focus"));			

				CString typeFill = oNodeTemplate.GetAttributeOrValue(_T("type"));
				if (typeFill == _T("tile") || typeFill == _T("frame") || typeFill == _T("pattern"))
				{
					XmlUtils::CXmlNode oNodeSource;
					if (oNodeTemplate.GetNode(_T("source"), oNodeSource))
					{
						CString path = oNodeSource.GetAttributeOrValue(_T("dir")) + _T("/word/") + oNodeSource.GetText();

						if ( typeFill == _T("tile") )
						{
							m_oBrush.m_nTextureMode = BrushTextureModeTile;
							
							if (strColor != _T("") && strColor != _T("none"))
								m_oBrush.m_nBrushType = BrushTypePattern;
							else
								m_oBrush.m_nBrushType = BrushTypeTexture;
						}
						else if( typeFill == _T("pattern") )
						{
							m_oBrush.m_nTextureMode = BrushTextureModeTileCenter;
							m_oBrush.m_nBrushType = BrushTypeTexture;
						}
						else
						{
							m_oBrush.m_nTextureMode = BrushTextureModeStretch;
							m_oBrush.m_nBrushType = BrushTypeTexture;
						}
						m_oBrush.m_sTexturePath = path;
					}
				}
				else if (typeFill == _T("gradient"))
				{				
					CString rotate = oNodeTemplate.GetAttributeOrValue(_T("rotate"));
					CString angle  = oNodeTemplate.GetAttributeOrValue(_T("angle"));

					m_oBrush.m_fAngle = 90 - (float)XmlUtils::GetDouble( angle );
					m_oBrush.m_nBrushType = BrushTypeHorizontal;

					m_oBrush.m_arrSubColors.RemoveAll();

					CString subcolors = oNodeTemplate.GetAttribute(_T("colors"));
					if( !subcolors.IsEmpty() )
					{
						CBrush_::TSubColor tSubColor;

						int length = subcolors.GetLength();
						int start = 0;

						for( ;; )
						{
							CString para;
							
							int pos = subcolors.Find( _T(';'), start );
							if( pos < 0 )
							{
								if( start < length )
								{
									para = subcolors.Mid( start );
									start = length;
								}
								else
									break;
							}
							else
							{
								para = subcolors.Mid( start, pos - start );
								start = pos + 1;
							}

							if( para.IsEmpty() )
								continue;

							int t = para.Find( _T(' ') );
							if( t < 0 )
								continue;

							tSubColor.position = getRealFromString( para.Mid( 0, t ) );
							tSubColor.color = getColorFromString( para.Mid( t + 1 ) );

							m_oBrush.m_arrSubColors.Add( tSubColor );
						}
					}
				}
				else if (typeFill == _T("gradientRadial"))
				{
					m_oBrush.m_nBrushType = BrushTypeCenter;
					m_oBrush.m_fAngle = 45;
					
					m_oBrush.m_arrSubColors.RemoveAll();

					CString subcolors = oNodeTemplate.GetAttribute(_T("colors"));
					if( !subcolors.IsEmpty() )
					{
						CBrush_::TSubColor tSubColor;

						int length = subcolors.GetLength();
						int start = 0;

						for( ;; )
						{
							CString para;
							
							int pos = subcolors.Find( _T(';'), start );
							if( pos < 0 )
							{
								if( start < length )
								{
									para = subcolors.Mid( start );
									start = length;
								}
								else
									break;
							}
							else
							{
								para = subcolors.Mid( start, pos - start );
								start = pos + 1;
							}

							if( para.IsEmpty() )
								continue;

							int t = para.Find( _T(' ') );
							if( t < 0 )
								continue;

							tSubColor.position = getRealFromString( para.Mid( 0, t ) );
							tSubColor.color = getColorFromString( para.Mid( t + 1 ) );

							m_oBrush.m_arrSubColors.Add( tSubColor );
						}
					}
				}		
				else
				{
					m_oBrush.m_nBrushType = BrushTypeSolid;
				}
			}
		}
	}

	void SetCoordSize(XmlUtils::CXmlNode& oNodePict)
	{
		if (_T("shape") == oNodePict.GetName())
		{
			XmlUtils::CXmlNode oNodeTemplate;
			if (oNodePict.GetNode(_T("coordsize"), oNodeTemplate))
			{
				CString strCoordSize = oNodeTemplate.GetAttributeOrValue(_T("val"));
				if (strCoordSize != _T(""))
				{
					CSimpleArray<CString> oArray;
					NSStringUtils::ParseString(_T(","), strCoordSize, &oArray);
					
					LONG lCountSizes = oArray.GetSize();
					if (2 <= lCountSizes)
					{
						m_dWidthLogic  = XmlUtils::GetInteger(oArray[0]);
						m_dHeightLogic = XmlUtils::GetInteger(oArray[1]);
					}
					else if (1 == lCountSizes)
					{
						m_dWidthLogic  = XmlUtils::GetInteger(oArray[0]);
						m_dHeightLogic = m_dWidthLogic;
					}
					else
					{
						m_dWidthLogic  = 21600;
						m_dHeightLogic = 21600;
					}
				}
			}
			else
			{
				CString id = oNodePict.GetAttributeOrValue(_T("type"));
				if (id != _T(""))
				{
					m_dWidthLogic  = 21600;
					m_dHeightLogic = 21600;
				}
				else
				{
					XmlUtils::CXmlNode oNodeTemplate;
					if (oNodePict.GetNode(_T("template"), oNodeTemplate))
					{
						CString strCoordSize = oNodeTemplate.GetAttributeOrValue(_T("coordsize"));
						if (strCoordSize != _T(""))
						{
							CSimpleArray<CString> oArray;
							NSStringUtils::ParseString(_T(","), strCoordSize, &oArray);
							m_dWidthLogic  = XmlUtils::GetInteger(oArray[0]);
							m_dHeightLogic = XmlUtils::GetInteger(oArray[1]);
						}
					}
				}
			}			
		}
	}


	CColor_ getColorFromString(const CString colorStr)
	{
		CColor_ color;
		int lColor;
		if (colorStr.Find(_T("fill darken")) != -1)
		{
			CString p = colorStr.Mid(colorStr.Find(_T("(")) + 1, colorStr.Find(_T(")")) - colorStr.Find(_T("(")) - 1);
			int c = XmlUtils::GetInteger(colorStr.Mid(colorStr.Find(_T("(")) + 1, colorStr.Find(_T(")")) - colorStr.Find(_T("(")) - 1));
			
		}
		else if (colorStr.Find(_T("#")) != -1)
		{
			lColor = XmlUtils::GetColor(colorStr.Mid(1, 6));
			color.R = (BYTE)(lColor >> 0);
			color.G = (BYTE)(lColor >> 8);
			color.B = (BYTE)(lColor >> 16);
			color.A = 0;
		}
		else
		{
			CString str;

			int pos = colorStr.Find(' ');
			if( pos < 0 )
				str = colorStr;
			else
				str = colorStr.Left( pos );

			int RGB = 0;

			switch(str[0])
			{
			case 'a':
				if(str == "aliceBlue")			{RGB = 0xF0F8FF; break;} 
				if(str == "antiqueWhite")		{RGB = 0xFAEBD7; break;} 
				if(str == "aqua")				{RGB = 0x00FFFF; break;} 
				if(str == "aquamarine")			{RGB = 0x7FFFD4; break;} 
				if(str == "azure")				{RGB = 0xF0FFFF; break;} 
				break;
			case 'b':
				if(str == "beige")				{RGB = 0xF5F5DC; break;} 
				if(str == "bisque")				{RGB = 0xFFE4C4; break;} 
				if(str == "black")				{RGB = 0x000000; break;} 
				if(str == "blanchedAlmond")		{RGB = 0xFFEBCD; break;} 
				if(str == "blue")				{RGB = 0x0000FF; break;} 
				if(str == "blueViolet")			{RGB = 0x8A2BE2; break;} 
				if(str == "brown")				{RGB = 0xA52A2A; break;} 
				if(str == "burlyWood")			{RGB = 0xDEB887; break;} 
				break;
			case 'c':
				if(str == "cadetBlue")			{RGB = 0x5F9EA0; break;} 
				if(str == "chartreuse")			{RGB = 0x7FFF00; break;} 
				if(str == "chocolate")			{RGB = 0xD2691E; break;} 
				if(str == "coral")				{RGB = 0xFF7F50; break;} 
				if(str == "cornflowerBlue")		{RGB = 0x6495ED; break;} 
				if(str == "cornsilk")			{RGB = 0xFFF8DC; break;} 
				if(str == "crimson")			{RGB = 0xDC143C; break;} 
				if(str == "cyan")				{RGB = 0x00FFFF; break;} 
				break;
			case 'd':
				if(str == "darkBlue")			{RGB = 0x00008B; break;} 
				if(str == "darkCyan")			{RGB = 0x008B8B; break;} 
				if(str == "darkGoldenrod")		{RGB = 0xB8860B; break;} 
				if(str == "darkGray")			{RGB = 0xA9A9A9; break;} 
				if(str == "darkGreen")			{RGB = 0x006400; break;} 
				if(str == "darkGrey")			{RGB = 0xA9A9A9; break;} 
				if(str == "darkKhaki")			{RGB = 0xBDB76B; break;} 
				if(str == "darkMagenta")		{RGB = 0x8B008B; break;} 
				if(str == "darkOliveGreen")		{RGB = 0x556B2F; break;} 
				if(str == "darkOrange")			{RGB = 0xFF8C00; break;} 
				if(str == "darkOrchid")			{RGB = 0x9932CC; break;} 
				if(str == "darkRed")			{RGB = 0x8B0000; break;} 
				if(str == "darkSalmon")			{RGB = 0xE9967A; break;} 
				if(str == "darkSeaGreen")		{RGB = 0x8FBC8F; break;} 
				if(str == "darkSlateBlue")		{RGB = 0x483D8B; break;} 
				if(str == "darkSlateGray")		{RGB = 0x2F4F4F; break;} 
				if(str == "darkSlateGrey")		{RGB = 0x2F4F4F; break;} 
				if(str == "darkTurquoise")		{RGB = 0x00CED1; break;} 
				if(str == "darkViolet")			{RGB = 0x9400D3; break;} 
				if(str == "deepPink")			{RGB = 0xFF1493; break;} 
				if(str == "deepSkyBlue")		{RGB = 0x00BFFF; break;} 
				if(str == "dimGray")			{RGB = 0x696969; break;} 
				if(str == "dimGrey")			{RGB = 0x696969; break;} 
				if(str == "dkBlue")				{RGB = 0x00008B; break;} 
				if(str == "dkCyan")				{RGB = 0x008B8B; break;} 
				if(str == "dkGoldenrod")		{RGB = 0xB8860B; break;} 
				if(str == "dkGray")				{RGB = 0xA9A9A9; break;} 
				if(str == "dkGreen")			{RGB = 0x006400; break;} 
				if(str == "dkGrey")				{RGB = 0xA9A9A9; break;} 
				if(str == "dkKhaki")			{RGB = 0xBDB76B; break;} 
				if(str == "dkMagenta")			{RGB = 0x8B008B; break;} 
				if(str == "dkOliveGreen")		{RGB = 0x556B2F; break;} 
				if(str == "dkOrange")			{RGB = 0xFF8C00; break;} 
				if(str == "dkOrchid")			{RGB = 0x9932CC; break;} 
				if(str == "dkRed")				{RGB = 0x8B0000; break;} 
				if(str == "dkSalmon")			{RGB = 0xE9967A; break;} 
				if(str == "dkSeaGreen")			{RGB = 0x8FBC8B; break;} 
				if(str == "dkSlateBlue")		{RGB = 0x483D8B; break;} 
				if(str == "dkSlateGray")		{RGB = 0x2F4F4F; break;} 
				if(str == "dkSlateGrey")		{RGB = 0x2F4F4F; break;} 
				if(str == "dkTurquoise")		{RGB = 0x00CED1; break;} 
				if(str == "dkViolet")			{RGB = 0x9400D3; break;} 
				if(str == "dodgerBlue")			{RGB = 0x1E90FF; break;} 
				break;
			case 'f':
				if(str == "firebrick")			{RGB = 0xB22222; break;} 
				if(str == "floralWhite")		{RGB = 0xFFFAF0; break;} 
				if(str == "forestGreen")		{RGB = 0x228B22; break;} 
				if(str == "fuchsia")			{RGB = 0xFF00FF; break;} 
				break;
			case 'g':
				if(str == "gainsboro")			{RGB = 0xDCDCDC; break;} 
				if(str == "ghostWhite")			{RGB = 0xF8F8FF; break;} 
				if(str == "gold")				{RGB = 0xFFD700; break;} 
				if(str == "goldenrod")			{RGB = 0xDAA520; break;} 
				if(str == "gray")				{RGB = 0x808080; break;} 
				if(str == "green")				{RGB = 0x008000; break;} 
				if(str == "greenYellow")		{RGB = 0xADFF2F; break;} 
				if(str == "grey")				{RGB = 0x808080; break;} 
				break;
			case 'h':
				if(str == "honeydew")			{RGB = 0xF0FFF0; break;} 
				if(str == "hotPink")			{RGB = 0xFF69B4; break;} 
				break;
			case 'i':
				if(str == "indianRed")			{RGB = 0xCD5C5C; break;} 
				if(str == "indigo")				{RGB = 0x4B0082; break;} 
				if(str == "ivory")				{RGB = 0xFFFFF0; break;} 
				break;
			case 'k':
				if(str == "khaki")				{RGB = 0xF0E68C; break;} 
				break;
			case 'l':
				if(str == "lavender")			{RGB = 0xE6E6FA; break;} 
				if(str == "lavenderBlush")		{RGB = 0xFFF0F5; break;} 
				if(str == "lawnGreen")			{RGB = 0x7CFC00; break;} 
				if(str == "lemonChiffon")		{RGB = 0xFFFACD; break;} 
				if(str == "lightBlue")			{RGB = 0xADD8E6; break;} 
				if(str == "lightCoral")			{RGB = 0xF08080; break;} 
				if(str == "lightCyan")			{RGB = 0xE0FFFF; break;} 
				if(str=="lightGoldenrodYellow")	{RGB = 0xFAFAD2;break;} 
				if(str == "lightGray")			{RGB = 0xD3D3D3; break;} 
				if(str == "lightGreen")			{RGB = 0x90EE90; break;} 
				if(str == "lightGrey")			{RGB = 0xD3D3D3; break;} 
				if(str == "lightPink")			{RGB = 0xFFB6C1; break;} 
				if(str == "lightSalmon")		{RGB = 0xFFA07A; break;} 
				if(str == "lightSeaGreen")		{RGB = 0x20B2AA; break;} 
				if(str == "lightSkyBlue")		{RGB = 0x87CEFA; break;} 
				if(str == "lightSlateGray")		{RGB = 0x778899; break;} 
				if(str == "lightSlateGrey")		{RGB = 0x778899; break;} 
				if(str == "lightSteelBlue")		{RGB = 0xB0C4DE; break;} 
				if(str == "lightYellow")		{RGB = 0xFFFFE0; break;} 
				if(str == "lime")				{RGB = 0x00FF00; break;} 
				if(str == "limeGreen")			{RGB = 0x32CD32; break;} 
				if(str == "linen")				{RGB = 0xFAF0E6; break;} 
				if(str == "ltBlue")				{RGB = 0xADD8E6; break;} 
				if(str == "ltCoral")			{RGB = 0xF08080; break;} 
				if(str == "ltCyan")				{RGB = 0xE0FFFF; break;} 
				if(str == "ltGoldenrodYellow")	{RGB = 0xFAFA78; break;} 
				if(str == "ltGray")				{RGB = 0xD3D3D3; break;} 
				if(str == "ltGreen")			{RGB = 0x90EE90; break;} 
				if(str == "ltGrey")				{RGB = 0xD3D3D3; break;} 
				if(str == "ltPink")				{RGB = 0xFFB6C1; break;} 
				if(str == "ltSalmon")			{RGB = 0xFFA07A; break;} 
				if(str == "ltSeaGreen")			{RGB = 0x20B2AA; break;} 
				if(str == "ltSkyBlue")			{RGB = 0x87CEFA; break;} 
				if(str == "ltSlateGray")		{RGB = 0x778899; break;} 
				if(str == "ltSlateGrey")		{RGB = 0x778899; break;} 
				if(str == "ltSteelBlue")		{RGB = 0xB0C4DE; break;} 
				if(str == "ltYellow")			{RGB = 0xFFFFE0; break;} 
				break;
			case 'm':
				if(str == "magenta")			{RGB = 0xFF00FF; break;} 
				if(str == "maroon")				{RGB = 0x800000; break;} 
				if(str == "medAquamarine")		{RGB = 0x66CDAA; break;} 
				if(str == "medBlue")			{RGB = 0x0000CD; break;} 
				if(str == "mediumAquamarine")	{RGB = 0x66CDAA; break;} 
				if(str == "mediumBlue")			{RGB = 0x0000CD; break;} 
				if(str == "mediumOrchid")		{RGB = 0xBA55D3; break;} 
				if(str == "mediumPurple")		{RGB = 0x9370DB; break;} 
				if(str == "mediumSeaGreen")		{RGB = 0x3CB371; break;} 
				if(str == "mediumSlateBlue")	{RGB = 0x7B68EE; break;} 
				if(str == "mediumSpringGreen")	{RGB = 0x00FA9A; break;} 
				if(str == "mediumTurquoise")	{RGB = 0x48D1CC; break;} 
				if(str == "mediumVioletRed")	{RGB = 0xC71585; break;} 
				if(str == "medOrchid")			{RGB = 0xBA55D3; break;} 
				if(str == "medPurple")			{RGB = 0x9370DB; break;} 
				if(str == "medSeaGreen")		{RGB = 0x3CB371; break;} 
				if(str == "medSlateBlue")		{RGB = 0x7B68EE; break;} 
				if(str == "medSpringGreen")		{RGB = 0x00FA9A; break;} 
				if(str == "medTurquoise")		{RGB = 0x48D1CC; break;} 
				if(str == "medVioletRed")		{RGB = 0xC71585; break;} 
				if(str == "midnightBlue")		{RGB = 0x191970; break;} 
				if(str == "mintCream")			{RGB = 0xF5FFFA; break;} 
				if(str == "mistyRose")			{RGB = 0xFFE4FF; break;} 
				if(str == "moccasin")			{RGB = 0xFFE4B5; break;} 
				break;
			case 'n':
				if(str == "navajoWhite")		{RGB = 0xFFDEAD; break;} 
				if(str == "navy")				{RGB = 0x000080; break;} 
				break;
			case 'o':
				if(str == "oldLace")			{RGB = 0xFDF5E6; break;} 
				if(str == "olive")				{RGB = 0x808000; break;} 
				if(str == "oliveDrab")			{RGB = 0x6B8E23; break;} 
				if(str == "orange")				{RGB = 0xFFA500; break;} 
				if(str == "orangeRed")			{RGB = 0xFF4500; break;} 
				if(str == "orchid")				{RGB = 0xDA70D6; break;} 
				break;
			case 'p':
				if(str == "paleGoldenrod")		{RGB = 0xEEE8AA; break;} 
				if(str == "paleGreen")			{RGB = 0x98FB98; break;} 
				if(str == "paleTurquoise")		{RGB = 0xAFEEEE; break;} 
				if(str == "paleVioletRed")		{RGB = 0xDB7093; break;} 
				if(str == "papayaWhip")			{RGB = 0xFFEFD5; break;} 
				if(str == "peachPuff")			{RGB = 0xFFDAB9; break;} 
				if(str == "peru")				{RGB = 0xCD853F; break;} 
				if(str == "pink")				{RGB = 0xFFC0CB; break;} 
				if(str == "plum")				{RGB = 0xD3A0D3; break;} 
				if(str == "powderBlue")			{RGB = 0xB0E0E6; break;} 
				if(str == "purple")				{RGB = 0x800080; break;} 
				break;
			case 'r':
				if(str == "red")				{RGB = 0xFF0000; break;} 
				if(str == "rosyBrown")			{RGB = 0xBC8F8F; break;} 
				if(str == "royalBlue")			{RGB = 0x4169E1; break;} 
				break;
			case 's':
				if(str == "saddleBrown")		{RGB = 0x8B4513; break;} 
				if(str == "salmon")				{RGB = 0xFA8072; break;} 
				if(str == "sandyBrown")			{RGB = 0xF4A460; break;} 
				if(str == "seaGreen")			{RGB = 0x2E8B57; break;} 
				if(str == "seaShell")			{RGB = 0xFFF5EE; break;} 
				if(str == "sienna")				{RGB = 0xA0522D; break;} 
				if(str == "silver")				{RGB = 0xC0C0C0; break;} 
				if(str == "skyBlue")			{RGB = 0x87CEEB; break;} 
				if(str == "slateBlue")			{RGB = 0x6A5AEB; break;} 
				if(str == "slateGray")			{RGB = 0x708090; break;} 
				if(str == "slateGrey")			{RGB = 0x708090; break;} 
				if(str == "snow")				{RGB = 0xFFFAFA; break;} 
				if(str == "springGreen")		{RGB = 0x00FF7F; break;} 
				if(str == "steelBlue")			{RGB = 0x4682B4; break;} 
				break;
			case 't':
				if(str == "tan")				{RGB = 0xD2B48C; break;} 
				if(str == "teal")				{RGB = 0x008080; break;} 
				if(str == "thistle")			{RGB = 0xD8BFD8; break;} 
				if(str == "tomato")				{RGB = 0xFF7347; break;} 
				if(str == "turquoise")			{RGB = 0x40E0D0; break;} 
				break;
			case 'v':
				if(str == "violet")				{RGB = 0xEE82EE; break;} 
				break;
			case 'w':
				if(str == "wheat")				{RGB = 0xF5DEB3; break;} 
				if(str == "white")				{RGB = 0xFFFFFF; break;} 
				if(str == "whiteSmoke")			{RGB = 0xF5F5F5; break;} 
				break;
			case 'y':
				if(str == "yellow")				{RGB = 0xFFFF00; break;} 
				if(str == "yellowGreen")		{RGB = 0x9ACD32; break;} 
				break;
			}
			
			

			color.R = (BYTE)(RGB >>16);
			color.G = (BYTE)(RGB >> 8);
			color.B = (BYTE)(RGB);
			color.A = 0;		
		}
		return color;
	}


	BYTE getOpacityFromString(const CString opacityStr)
	{
		BYTE alpha;
		if (opacityStr.Find(_T("f")) != -1)
			alpha = (BYTE) (XmlUtils::GetDouble(opacityStr) / 65536 * 256);
		else
			alpha = (BYTE)XmlUtils::GetDouble(opacityStr) * 256;
		return alpha;
	}

	long getRealFromString( const CString& str )
	{
		long val = 0;

		if (str.Find(_T("f")) != -1)
			val = XmlUtils::GetInteger(str);
		else
			val = (long)(XmlUtils::GetDouble(str) * 65536);

		return val;
	}


	CColor_ getColor2FromString(const CString colorStr, CColor_ color1)
	{
		CColor_ color;
		if (colorStr.Find(_T("fill darken")) != -1)
		{
			int p = XmlUtils::GetInteger(colorStr.Mid(colorStr.Find(_T("(")) + 1, colorStr.Find(_T(")")) - colorStr.Find(_T("(")) - 1));
			color.R = color1.R * p / 255;
			color.G = color1.G * p / 255;
			color.B = color1.B * p / 255;
		}
		else if (colorStr.Find(_T("fill lighten")) != -1)
		{
			int p = XmlUtils::GetInteger(colorStr.Mid(colorStr.Find(_T("(")) + 1, colorStr.Find(_T(")")) - colorStr.Find(_T("(")) - 1));
			color.R = 255 - (255 - color1.R)* p / 255;
			color.G = 255 - (255 - color1.G)* p / 255;
			color.B = 255 - (255 - color1.B)* p / 255;
		}		
		else
		{
			color = getColorFromString(colorStr);
		}
		return color;
	}
};