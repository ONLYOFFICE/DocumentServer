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
#include "..\..\..\..\ASCImageStudio3\ASCGraphics\Interfaces\ASCRenderer.h"

#ifndef ODP_DEF
#ifdef _AVS_GRAPHICS_
#ifndef PPT_DEF
#define PPT_DEF
#endif
#endif
#endif

#ifdef _AVS_GRAPHICS_
#ifndef PPTX_DEF
#define PPTX_DEF
#endif
#endif

#if defined(PPTX_DEF)
#include "PPTXShape/Formula.h"
#endif

#if defined(PPT_DEF)
#include "PPTShape/Formula.h"
using namespace NSGuidesVML;
#endif

#if defined(ODP_DEF)
#include "OdpShape/Formula.h"
#endif

#include "Metric.h"
#include "../../Attributes.h"

using namespace NSAttributes;

namespace NSBaseShape
{
	enum ClassType {unknown, pptx, ppt, odp};
}

enum RulesType
{
	
	rtLineTo			= 0,	
	rtCurveTo			= 1,	
	rtMoveTo			= 2,	
	
	rtClose				= 3,	
	rtEnd				= 4,	
	
	rtRMoveTo			= 5,	
	rtRLineTo			= 6,	
	rtRCurveTo			= 7,	
	
	rtNoFill			= 8,	
	rtNoStroke			= 9,	
	
	rtAngleEllipseTo	= 10,	
	rtAngleEllipse		= 11,	
	
	rtArc				= 12,	
	rtArcTo				= 13,	
	
	rtClockwiseArcTo	= 14,	
	rtClockwiseArc		= 15,	
	
	rtEllipticalQuadrX	= 16,	
	rtEllipticalQuadrY	= 17,	

	rtQuadrBesier		= 18,	

	rtFillColor			= 20, 
	rtLineColor			= 21,

	
	rtOOXMLMoveTo		= 0 + 100,	
	rtOOXMLLineTo		= 1 + 100,	
	rtOOXMLCubicBezTo	= 2 + 100,	
	rtOOXMLArcTo		= 3 + 100,	
	rtOOXMLQuadBezTo	= 4 + 100,	
	rtOOXMLClose		= 5 + 100,	
	rtOOXMLEnd			= 6	+ 100	
};

static CString GetRulerVML(RulesType eRuler)
{
	switch (eRuler)
	{
	case rtMoveTo:				{ return _T("m"); }
	case rtLineTo:				{ return _T("l"); }
	case rtCurveTo:				{ return _T("c"); }
	
	case rtClose:				{ return _T("x"); }
	case rtEnd:					{ return _T("e"); }
	
	case rtRMoveTo:				{ return _T("t"); }
	case rtRLineTo:				{ return _T("r"); }
	case rtRCurveTo:			{ return _T("v"); }
	
	case rtNoFill:				{ return _T("nf"); }
	case rtNoStroke:			{ return _T("ns"); }

	case rtAngleEllipseTo:		{ return _T("ae"); }
	case rtAngleEllipse:		{ return _T("al"); }
	
	case rtArc:					{ return _T("at"); }
	case rtArcTo:				{ return _T("ar"); }

	case rtClockwiseArcTo:		{ return _T("wa"); }
	case rtClockwiseArc:		{ return _T("wr"); }

	case rtEllipticalQuadrX:	{ return _T("qx"); }
	case rtEllipticalQuadrY:	{ return _T("qy"); }

	case rtQuadrBesier:			{ return _T("qb"); }
	default: break;
	};
	return _T("");
}

static RulesType GetRuler(const CString& strName, bool& bRes)
{
	bRes = true;
	if		(_T("moveTo")		== strName)	return rtOOXMLMoveTo;
	else if (_T("lnTo")			== strName)	return rtOOXMLLineTo;
	else if (_T("cubicBezTo")	== strName)	return rtOOXMLCubicBezTo;
	else if (_T("close")		== strName)	return rtOOXMLClose;
	else if (_T("end")			== strName)	return rtOOXMLEnd;
	else if (_T("arcTo")		== strName)	return rtOOXMLArcTo;
	else if (_T("quadBezTo")	== strName)	return rtOOXMLQuadBezTo;

	
	else if	((_T("m") == strName) || (_T("M") == strName))		return rtMoveTo;
	else if ((_T("l") == strName) || (_T("L") == strName))		return rtLineTo;
	else if ((_T("c") == strName) || (_T("C") == strName))		return rtCurveTo;
	else if ((_T("x") == strName) || (_T("Z") == strName))		return rtClose;
	else if ((_T("e") == strName) || (_T("N") == strName))		return rtEnd;
	else if (_T("t") == strName)								return rtRMoveTo;
	else if (_T("r") == strName)								return rtRLineTo;
	else if (_T("v") == strName)								return rtRCurveTo;
	else if ((_T("nf") == strName) || (_T("F") == strName))		return rtNoFill;
	else if ((_T("ns") == strName) || (_T("S") == strName))		return rtNoStroke;
	else if ((_T("ae") == strName) || (_T("T") == strName))		return rtAngleEllipseTo;
	else if ((_T("al") == strName) || (_T("U") == strName))		return rtAngleEllipse;
	else if ((_T("at") == strName) || (_T("A") == strName))		return rtArcTo;
	else if ((_T("ar") == strName) || (_T("B") == strName))		return rtArc;
	else if ((_T("wa") == strName) || (_T("W") == strName))		return rtClockwiseArcTo;
	else if ((_T("wr") == strName) || (_T("V") == strName))		return rtClockwiseArc;
	else if ((_T("qx") == strName) || (_T("X") == strName))		return rtEllipticalQuadrX;
	else if ((_T("qy") == strName) || (_T("Y") == strName))		return rtEllipticalQuadrY;
	else if ((_T("qb") == strName) || (_T("Q") == strName))		return rtQuadrBesier;
	else bRes = false;

	return rtEnd;
}

static double GetSweepAngle(const double& angleStart, const double& angleEnd)
{
	if (angleStart >= angleEnd)
		return angleEnd - angleStart;
	else
		return angleEnd - angleStart - 360;
}

static CString GetRulerName(RulesType eRuler)
{
	switch (eRuler)
	{
	case rtOOXMLMoveTo:		{ return _T("moveto"); }
	case rtOOXMLLineTo:		{ return _T("lineto"); }
	case rtOOXMLCubicBezTo:	{ return _T("curveto"); }
	case rtOOXMLArcTo:		{ return _T("ellipseto"); }
	case rtOOXMLQuadBezTo:	{ return _T("qbesier"); }
	case rtOOXMLClose:		{ return _T("close"); }
	case rtOOXMLEnd:		{ return _T("end"); }

	case rtMoveTo:				{ return _T("moveto"); }
	case rtLineTo:				{ return _T("lineto"); }
	case rtCurveTo:				{ return _T("curveto"); }
	
	case rtClose:				{ return _T("close"); }
	case rtEnd:					{ return _T("end"); }
	
	case rtRMoveTo:				{ return _T("rmoveto"); }
	case rtRLineTo:				{ return _T("rlineto"); }
	case rtRCurveTo:			{ return _T("rcurveto"); }
	
	case rtNoFill:				{ return _T("nofill"); }
	case rtNoStroke:			{ return _T("nostroke"); }

	case rtAngleEllipseTo:		{ return _T("ellipseto"); }
	case rtAngleEllipse:		{ return _T("ellipse"); }
	
	case rtArc:					{ return _T("arc"); }
	case rtArcTo:				{ return _T("arcto"); }

	case rtClockwiseArcTo:		{ return _T("clockwisearcto"); }
	case rtClockwiseArc:		{ return _T("clockwisearc"); }

	case rtEllipticalQuadrX:	{ return _T("ellipticalx"); }
	case rtEllipticalQuadrY:	{ return _T("ellipticaly"); }

	case rtQuadrBesier:			{ return _T("qbesier"); }
	default: break;
	};
	return _T("none");
}

static long GetCountPoints(RulesType eRuler)
{
	switch (eRuler)
	{
	case rtOOXMLMoveTo:		return 1;
	case rtOOXMLLineTo:		return 1;
	case rtOOXMLQuadBezTo:	return 2;
	case rtOOXMLCubicBezTo:	return 3;
	case rtOOXMLArcTo:		return 3;
	case rtOOXMLClose:		return 0;
	case rtOOXMLEnd:		return 0;
	default: return 0;
	};
	return 0;
}

static long GetCountPoints2(RulesType eRuler, LONG lRepeatCount)
{
	switch (eRuler)
	{
	case rtMoveTo:				
	case rtRMoveTo:
		{ return 1; }
	
	case rtLineTo:		
	case rtRLineTo:
		{ return lRepeatCount; }
	
	case rtCurveTo:		
	case rtRCurveTo:
		{ return 3 * lRepeatCount; }
	
	case rtNoFill:
	case rtNoStroke:
	case rtClose:
	case rtEnd:	
		{ return 0; }
	
	case rtAngleEllipseTo:
	case rtAngleEllipse:
		{ return lRepeatCount; }
	
	case rtArc:
	case rtArcTo:

	case rtClockwiseArcTo:
	case rtClockwiseArc:
		{ return lRepeatCount; }

	case rtEllipticalQuadrX:
	case rtEllipticalQuadrY:
		{ return 1 * lRepeatCount; }

	case rtQuadrBesier:			
		{ return lRepeatCount; }
	case rtFillColor:
	case rtLineColor:
		{
			return 1;
		}
	default: return 3 * lRepeatCount;
	};

	return 0;
}

class CSlice
{
public:
	RulesType m_eRuler;
	CSimpleArray<POINT> m_arPoints;



private:
	int m_nCountElementsPoint;

public:
	CSlice(RulesType eType = rtMoveTo)
	{
		m_eRuler = eType;


		m_nCountElementsPoint = 0;
	}

	void AddParam(LONG lParam)
	{
		long lPoint = m_nCountElementsPoint % 2;
		if (0 == lPoint)
		{
			POINT point;
			point.x = lParam;
			point.y = 0;
			m_arPoints.Add(point);
		}
		else
		{
			m_arPoints[m_arPoints.GetSize() - 1].y = lParam;
		}
		++m_nCountElementsPoint;
	}
#if defined(PPTX_DEF)
	void FromXML(XmlUtils::CXmlNode& Node, NSGuidesOOXML::CFormulaManager& pManager, double WidthKoef, double HeightKoef)
	{
		m_arPoints.RemoveAll();
		bool bRes = true;
		m_eRuler = GetRuler(Node.GetName(), bRes);
		if((m_eRuler != rtOOXMLClose) && (m_eRuler != rtOOXMLEnd))
		{
			if(m_eRuler != rtOOXMLArcTo)
			{
				XmlUtils::CXmlNodes list;
				Node.GetNodes(_T("pt"), list);
				for(long i = 0; i < GetCountPoints(m_eRuler); i++)
				{
					POINT lpoint;
					XmlUtils::CXmlNode pt;
					list.GetAt(i, pt);
					lpoint.x = (long)(pManager.GetValue(pt.GetAttribute(_T("x")))*WidthKoef);
					lpoint.y = (long)(pManager.GetValue(pt.GetAttribute(_T("y")))*HeightKoef);
					m_arPoints.Add(lpoint);
				}
			}
			else
			{
				POINT size;
				size.x = (long)(pManager.GetValue(Node.GetAttribute(_T("wR")))*WidthKoef);
				size.y = (long)(pManager.GetValue(Node.GetAttribute(_T("hR")))*HeightKoef);
				m_arPoints.Add(size);
				double stAng = pManager.GetValue(Node.GetAttribute(_T("stAng")));
				double swAng = pManager.GetValue(Node.GetAttribute(_T("swAng")));
				double stAng2 = atan2(HeightKoef * sin(stAng * RadKoef), WidthKoef * cos(stAng * RadKoef));
				double swAng2 = atan2(HeightKoef * sin((stAng + swAng) * RadKoef), WidthKoef * cos((stAng + swAng) * RadKoef)) - stAng2;
				POINT angle;
				angle.x = (long)(stAng2/RadKoef);
				angle.y = (long)(swAng2/RadKoef);
				if((angle.y > 0) && (swAng < 0)) angle.y = angle.y - 21600000;
				if((angle.y < 0) && (swAng > 0)) angle.y = angle.y + 21600000;
				if(angle.y == 0) angle.y = 21600000;
				
				
				m_arPoints.Add(angle);
			}
		}
	}
#endif
	CString ToXml(CGeomShapeInfo& pGeomInfo, long w, long h, NSBaseShape::ClassType ClassType)
	{
		switch(ClassType)
		{
#if defined(PPTX_DEF)
		case NSBaseShape::pptx:
			{
				CString strRes = GetRulerName(m_eRuler);

				if ((rtClose == m_eRuler) || (rtEnd == m_eRuler))
					return _T("<part name='") + strRes + _T("'/>");

				double dLeft = pGeomInfo.m_dLeft;
				double dTop = pGeomInfo.m_dTop;

				double dKoefX = max(pGeomInfo.m_dWidth, pGeomInfo.m_dHeight)/ShapeSize;
				double dKoefY = max(pGeomInfo.m_dWidth, pGeomInfo.m_dHeight)/ShapeSize;

				strRes = _T("<part name='") + strRes + _T("' path='");

				CString strPath = _T("");

				switch (m_eRuler)
				{
				case rtOOXMLMoveTo:
					{
						pGeomInfo.m_oCurPoint.dX = 0;
						pGeomInfo.m_oCurPoint.dY = 0;
					}
				case rtOOXMLLineTo:
				case rtOOXMLCubicBezTo:
					{
						int nCount = m_arPoints.GetSize();
						for (int nIndex = 0; nIndex < nCount; ++nIndex)
						{			
							double lX = dLeft + (dKoefX * m_arPoints[nIndex].x);
							double lY = dTop  + (dKoefY * m_arPoints[nIndex].y);

							

							CString str = _T("");
							str.Format(_T("%lf %lf "), lX, lY);
							strPath += str;

							pGeomInfo.m_oCurPoint.dX = lX;
							pGeomInfo.m_oCurPoint.dY = lY;
						}
						break;
					}
				case rtOOXMLQuadBezTo:
					{
						CAtlArray<CGeomShapeInfo::CPointD> arPoints;
						arPoints.Add(pGeomInfo.m_oCurPoint);
						
						int nCount = m_arPoints.GetSize();
						for (int nIndex = 0; nIndex < nCount; ++nIndex)
						{			
							CGeomShapeInfo::CPointD oPoint;
							
							oPoint.dX = dLeft + (dKoefX * m_arPoints[nIndex].x);
							oPoint.dY = dTop  + (dKoefY * m_arPoints[nIndex].y);

							arPoints.Add(oPoint);
						}

						Bez2_3(arPoints, m_eRuler);

						strRes = GetRulerName(m_eRuler);
						strRes = _T("<part name='") + strRes + _T("' path='");
						
						size_t nCountNew = arPoints.GetCount();
						if (0 < nCountNew)
						{
							pGeomInfo.m_oCurPoint = arPoints[nCountNew - 1];
						}

						for (size_t nIndex = 0; nIndex < nCountNew; ++nIndex)
						{	
							CString str = _T("");
							str.Format(_T("%lf %lf "), arPoints[nIndex].dX, arPoints[nIndex].dY);
							strPath += str;
						}
						break;
					}
				case rtOOXMLArcTo:
					{
						double lX = pGeomInfo.m_oCurPoint.dX;
						double lY = pGeomInfo.m_oCurPoint.dY;
						double dAngleP = atan2(m_arPoints[0].x * sin(RadKoef * m_arPoints[1].x), m_arPoints[0].y * cos(RadKoef * m_arPoints[1].x));
						lX += (m_arPoints[0].x * dKoefX) * (-cos(dAngleP));
						lY += (m_arPoints[0].y * dKoefY) * (-sin(dAngleP));
						CString str;
						str = _T("");
						str.Format(_T("%lf %lf "), lX, lY);
						strPath += str;
						double cx = lX;
						double cy = lY;

						lX = (2 * dKoefX * m_arPoints[0].x);
						lY = (2 * dKoefY * m_arPoints[0].y);
						str = _T("");
						str.Format(_T("%lf %lf "), lX, lY);
						strPath += str;

						double dAngle = (m_arPoints[1].y + m_arPoints[1].x)* RadKoef;
						dAngleP = atan2( m_arPoints[0].x * sin(dAngle),  m_arPoints[0].y * cos(dAngle));

						lX = (double)m_arPoints[1].x/60000.0;
						lY = (double)m_arPoints[1].y/60000.0;

						
						
						
						
						
						pGeomInfo.m_oCurPoint.dX = cx + (m_arPoints[0].x * dKoefX) * cos(dAngleP);
						pGeomInfo.m_oCurPoint.dY = cy + (m_arPoints[0].y * dKoefY) * sin(dAngleP);

						str = _T("");
						str.Format(_T("%lf %lf "), lX, lY);
						strPath += str;
						break;
					}
				default:
					break;	
				};

				if (strPath.GetLength() > 1)
				{
					strPath.Delete(strPath.GetLength() - 1);
				}

				strRes += strPath;
				strRes += _T("' />");

				return strRes;
			}
#endif
#if defined(PPT_DEF)
		case NSBaseShape::ppt:
			{
				CString strRes = GetRulerName(m_eRuler);

				if ((rtClose == m_eRuler) || (rtNoFill == m_eRuler) ||
					(rtNoStroke == m_eRuler) || (rtEnd == m_eRuler))
					return _T("<part name='") + strRes + _T("'/>");

				double dLeft = pGeomInfo.m_dLeft;
				double dTop = pGeomInfo.m_dTop;

				double dKoefX = pGeomInfo.m_dWidth / w;
				double dKoefY = pGeomInfo.m_dHeight / h;

				strRes = _T("<part name='") + strRes + _T("' path='");

				CString strPath = _T("");

				switch (m_eRuler)
				{
				case rtMoveTo:
				case rtLineTo:
				case rtCurveTo:
				case rtEllipticalQuadrX:
				case rtEllipticalQuadrY:
					{
						if (rtMoveTo == m_eRuler)
						{
							pGeomInfo.m_oCurPoint.dX = 0;
							pGeomInfo.m_oCurPoint.dY = 0;
						}
						int nCount = m_arPoints.GetSize();
						for (int nIndex = 0; nIndex < nCount; ++nIndex)
						{			
							double lX = dLeft + (dKoefX * m_arPoints[nIndex].x);
							double lY = dTop  + (dKoefY * m_arPoints[nIndex].y);

							

							CString str = _T("");
							str.Format(_T("%lf %lf "), lX, lY);
							
							
							
							strPath += str;

							pGeomInfo.m_oCurPoint.dX = lX;
							pGeomInfo.m_oCurPoint.dY = lY;
						}
						break;
					}
				case rtQuadrBesier:
					{
						CAtlArray<CGeomShapeInfo::CPointD> arPoints;
						arPoints.Add(pGeomInfo.m_oCurPoint);
						
						int nCount = m_arPoints.GetSize();
						for (int nIndex = 0; nIndex < nCount; ++nIndex)
						{			
							CGeomShapeInfo::CPointD oPoint;
							
							oPoint.dX = dLeft + (dKoefX * m_arPoints[nIndex].x);
							oPoint.dY = dTop  + (dKoefY * m_arPoints[nIndex].y);

							arPoints.Add(oPoint);
						}

						Bez2_3(arPoints, m_eRuler);

						strRes = GetRulerName(m_eRuler);
						strRes = _T("<part name='") + strRes + _T("' path='");
						
						size_t nCountNew = arPoints.GetCount();
						if (0 < nCountNew)
						{
							pGeomInfo.m_oCurPoint = arPoints[nCountNew - 1];
						}

						for (size_t nIndex = 0; nIndex < nCountNew; ++nIndex)
						{	
							CString str = _T("");
							str.Format(_T("%lf %lf "), arPoints[nIndex].dX, arPoints[nIndex].dY);
							strPath += str;
						}
						break;
					}
				case rtArcTo:
				case rtClockwiseArcTo:
					{
						int nCount = m_arPoints.GetSize();
						for (int nIndex = 0; nIndex < nCount; ++nIndex)
						{			
							double lX = dLeft + (dKoefX * m_arPoints[nIndex].x);
							double lY = dTop  + (dKoefY * m_arPoints[nIndex].y);

							

							CString str = _T("");
							str.Format(_T("%lf %lf "), lX, lY);
							
							
							strPath += str;

							if (nIndex % 4 != 1)
							{
								pGeomInfo.m_oCurPoint.dX = lX;
								pGeomInfo.m_oCurPoint.dY = lY;
							}
						}
						break;
					}
				case rtArc:
				case rtClockwiseArc:
					{
						int nCount = m_arPoints.GetSize();
						for (int nIndex = 0; nIndex < nCount; ++nIndex)
						{			
							double lX = dLeft + (dKoefX * m_arPoints[nIndex].x);
							double lY = dTop  + (dKoefY * m_arPoints[nIndex].y);

							

							CString str = _T("");
							str.Format(_T("%lf %lf "), lX, lY);
							
							
							strPath += str;

							if (nIndex % 4 > 1)
							{
								pGeomInfo.m_oCurPoint.dX = lX;
								pGeomInfo.m_oCurPoint.dY = lY;
							}
						}
						break;
					}
				case rtRMoveTo:
				case rtRLineTo:
				case rtRCurveTo:
					{
						int nCount = m_arPoints.GetSize();
						for (int nIndex = 0; nIndex < nCount; ++nIndex)
						{
							double lX = pGeomInfo.m_oCurPoint.dX + (dKoefX * m_arPoints[nIndex].x);
							double lY = pGeomInfo.m_oCurPoint.dY + (dKoefY * m_arPoints[nIndex].y);

							

							lX -= pGeomInfo.m_oCurPoint.dX;
							lY -= pGeomInfo.m_oCurPoint.dY;

							CString str = _T("");
							str.Format(_T("%lf %lf "), lX, lY);
							
							
							strPath += str;

							pGeomInfo.m_oCurPoint.dX += lX;
							pGeomInfo.m_oCurPoint.dY += lY;
						}
						break;
					}
				case rtAngleEllipseTo:
				case rtAngleEllipse:
					{
						int nCount = m_arPoints.GetSize();
						for (int nIndex = 0; nIndex < nCount; ++nIndex)
						{			
							double lX = 0;
							double lY = 0;
							if (nIndex % 3 == 0)
							{
								lX = dLeft + (dKoefX * m_arPoints[nIndex].x);
								lY = dTop  + (dKoefY * m_arPoints[nIndex].y);

								CString str = _T("");
								str.Format(_T("%lf %lf "), lX, lY);
								
								
								
								strPath += str;
								continue;
							}
							else if (nIndex % 3 == 1)
							{
								lX = (2 * dKoefX * m_arPoints[nIndex].x);
								lY = (2 * dKoefY * m_arPoints[nIndex].y);

								CString str = _T("");
								str.Format(_T("%lf %lf "), lX, lY);
								
								
								strPath += str;
								continue;
							}
							else 
							{
								double dCx = dLeft + (dKoefX * m_arPoints[nIndex - 2].x);
								double dCy = dTop  + (dKoefY * m_arPoints[nIndex - 2].y);

								double dRad = _hypot(dKoefX * m_arPoints[nIndex - 1].x, dKoefY * m_arPoints[nIndex - 1].y);
								double dAngle = (double)m_arPoints[nIndex].y / pow2_16;
								dAngle *= (3.14159265358979323846 / 180.0);

								lX = m_arPoints[nIndex].x / pow2_16;
								lY = m_arPoints[nIndex].y / pow2_16;

								if (lX < 0) 
									lX += 360;
								if (lY < 0)
									lY += 360;

								pGeomInfo.m_oCurPoint.dX = (dCx + dRad * cos(dAngle));
								pGeomInfo.m_oCurPoint.dX = (dCx - dRad * sin(dAngle));
							}

							
							CString str = _T("");
							str.Format(_T("%lf %lf "), lX, GetSweepAngle(lX, lY));
							
							strPath += str;
							
							
						}
						break;
					}
				default:
					break;	
				};

				if (strPath.GetLength() > 1)
				{
					strPath.Delete(strPath.GetLength() - 1);
				}

				strRes += strPath;
				strRes += _T("' />");

				return strRes;
			}
#endif
#if defined(ODP_DEF)
		case NSBaseShape::odp:
			{
				CString strRes = GetRulerName(m_eRuler);

				if ((rtClose == m_eRuler) || (rtNoFill == m_eRuler) ||
					(rtNoStroke == m_eRuler) || (rtEnd == m_eRuler))
					return _T("<part name='") + strRes + _T("'/>");

				double dLeft = pGeomInfo.m_dLeft;
				double dTop = pGeomInfo.m_dTop;

				double dKoefX = pGeomInfo.m_dWidth / w;
				double dKoefY = pGeomInfo.m_dHeight / h;

				strRes = _T("<part name='") + strRes + _T("' path='");

				CString strPath = _T("");

				switch (m_eRuler)
				{
				case rtMoveTo:
				case rtLineTo:
				case rtCurveTo:
				case rtEllipticalQuadrX:
				case rtEllipticalQuadrY:
					{
						if (rtMoveTo == m_eRuler)
						{
							pGeomInfo.m_oCurPoint.dX = 0;
							pGeomInfo.m_oCurPoint.dY = 0;
						}
						int nCount = m_arPoints.GetSize();
						for (int nIndex = 0; nIndex < nCount; ++nIndex)
						{			
							double lX = dLeft + (dKoefX * m_arPoints[nIndex].x);
							double lY = dTop  + (dKoefY * m_arPoints[nIndex].y);

							

							CString str = _T("");
							str.Format(_T("%lf %lf "), lX, lY);
							
							
							
							strPath += str;

							pGeomInfo.m_oCurPoint.dX = lX;
							pGeomInfo.m_oCurPoint.dY = lY;
						}
						break;
					}
				case rtQuadrBesier:
					{
						CAtlArray<CGeomShapeInfo::CPointD> arPoints;
						arPoints.Add(pGeomInfo.m_oCurPoint);
						
						int nCount = m_arPoints.GetSize();
						for (int nIndex = 0; nIndex < nCount; ++nIndex)
						{			
							CGeomShapeInfo::CPointD oPoint;
							
							oPoint.dX = dLeft + (dKoefX * m_arPoints[nIndex].x);
							oPoint.dY = dTop  + (dKoefY * m_arPoints[nIndex].y);

							arPoints.Add(oPoint);
						}

						Bez2_3(arPoints, m_eRuler);

						strRes = GetRulerName(m_eRuler);
						strRes = _T("<part name='") + strRes + _T("' path='");
						
						size_t nCountNew = arPoints.GetCount();
						if (0 < nCountNew)
						{
							pGeomInfo.m_oCurPoint = arPoints[nCountNew - 1];
						}

						for (size_t nIndex = 0; nIndex < nCountNew; ++nIndex)
						{	
							CString str = _T("");
							str.Format(_T("%lf %lf "), arPoints[nIndex].dX, arPoints[nIndex].dY);
							strPath += str;
						}
						break;
					}
				case rtArcTo:
				case rtClockwiseArcTo:
					{
						int nCount = m_arPoints.GetSize();
						for (int nIndex = 0; nIndex < nCount; ++nIndex)
						{			
							double lX = dLeft + (dKoefX * m_arPoints[nIndex].x);
							double lY = dTop  + (dKoefY * m_arPoints[nIndex].y);

							

							CString str = _T("");
							str.Format(_T("%lf %lf "), lX, lY);
							
							
							strPath += str;

							if (nIndex % 4 != 1)
							{
								pGeomInfo.m_oCurPoint.dX = lX;
								pGeomInfo.m_oCurPoint.dY = lY;
							}
						}
						break;
					}
				case rtArc:
				case rtClockwiseArc:
					{
						int nCount = m_arPoints.GetSize();
						for (int nIndex = 0; nIndex < nCount; ++nIndex)
						{			
							double lX = dLeft + (dKoefX * m_arPoints[nIndex].x);
							double lY = dTop  + (dKoefY * m_arPoints[nIndex].y);

							

							CString str = _T("");
							str.Format(_T("%lf %lf "), lX, lY);
							
							
							strPath += str;

							if (nIndex % 4 > 1)
							{
								pGeomInfo.m_oCurPoint.dX = lX;
								pGeomInfo.m_oCurPoint.dY = lY;
							}
						}
						break;
					}
				case rtAngleEllipseTo:
				case rtAngleEllipse:
					{
						int nCount = m_arPoints.GetSize();
						for (int nIndex = 0; nIndex < nCount; ++nIndex)
						{			
							double lX = 0;
							double lY = 0;
							if (nIndex % 3 == 0)
							{
								lX = dLeft + (dKoefX * m_arPoints[nIndex].x);
								lY = dTop  + (dKoefY * m_arPoints[nIndex].y);

								CString str = _T("");
								str.Format(_T("%lf %lf "), lX, lY);
								
								
								
								strPath += str;
								continue;
							}
							else if (nIndex % 3 == 1)
							{
								lX = (2 * dKoefX * m_arPoints[nIndex].x);
								lY = (2 * dKoefY * m_arPoints[nIndex].y);

								CString str = _T("");
								str.Format(_T("%lf %lf "), lX, lY);
								
								
								strPath += str;
								continue;
							}
							else 
							{
								double dCx = dLeft + (dKoefX * m_arPoints[nIndex - 2].x);
                                double dCy = dTop  + (dKoefY * m_arPoints[nIndex - 2].y);

                                double dRad = _hypot(dKoefX * m_arPoints[nIndex - 1].x, dKoefY * m_arPoints[nIndex - 1].y);
                                double dAngle = (double)m_arPoints[nIndex].y / pow2_16;
                                dAngle *= (3.14159265358979323846 / 180.0);

                                
                                
                                int lx = m_arPoints[nIndex].x / pow2_16;
                                int ly = m_arPoints[nIndex].y / pow2_16;

                                if (lx < 0) lx += 360;
                                if (ly < 0)     ly += 360;
                                if (ly == lx) ly += 360;
                                lX = lx;
                                lY = ly;

                                pGeomInfo.m_oCurPoint.dX = (dCx + dRad * cos(dAngle));
                                pGeomInfo.m_oCurPoint.dY = (dCy - dRad * sin(dAngle));
							}

							
							CString str = _T("");
							str.Format(_T("%lf %lf "), lX, lY - lX);
							
							strPath += str;
							
							
						}
						break;
					}
				default:
					break;	
				};

				if (strPath.GetLength() > 1)
				{
					strPath.Delete(strPath.GetLength() - 1);
				}

				strRes += strPath;
				strRes += _T("' />");

				return strRes;
			}
#endif
		};

		return _T("");
	}

	
	
	

	
	
	

	
	

	
	

	

	

	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	

	

	
	
	
	
	
	

	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	

	
	

	

	
	
	
	
	
	
	
	

	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	

	

	
	
	
	
	
	

	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	

	

	
	
	
	
	
	

	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	

	

	
	

	
	
	
	
	
	

	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	

	
	
	
	
	
	
	
	
	
	
	
	

	
	
	
	
	
	
	
	
	
	
	
	

	
	
	

	
	

	
	
	
	

	
	
	

	
	
	
	
	
	
	
	
	
	
	
	
	

	
	
	
	

	
	

	
	

#if defined(PPT_DEF)
	void ToRenderer(IASCRenderer* pRenderer, CGeomShapeInfo& pGeomInfo, long w, long h)
	{
		if (rtClose == m_eRuler)
		{
			pRenderer->PathCommandClose();
			return;
		}
		if (rtEnd == m_eRuler)
		{
			pRenderer->PathCommandEnd();
			return;
		}
		
		double dLeft = pGeomInfo.m_dLeft;
		double dTop = pGeomInfo.m_dTop;

		double dKoefX = pGeomInfo.m_dWidth / w;
		double dKoefY = pGeomInfo.m_dHeight / h;

		int nCount = m_arPoints.GetSize();
		switch (m_eRuler)
		{
		case rtMoveTo:
		case rtRMoveTo:
			{			
				double lX = 0;
				double lY = 0;
				if (rtMoveTo == m_eRuler)
				{
					lX = dLeft + (dKoefX * m_arPoints[nCount - 1].x);
					lY = dTop  + (dKoefY * m_arPoints[nCount - 1].y);
				}
				else
				{
					lX = pGeomInfo.m_oCurPoint.dX + (dKoefX * m_arPoints[nCount - 1].x);
					lY = pGeomInfo.m_oCurPoint.dY + (dKoefY * m_arPoints[nCount - 1].y);
				}

				
				
				pRenderer->PathCommandMoveTo(lX, lY);

				pGeomInfo.m_oCurPoint.dX = lX;
				pGeomInfo.m_oCurPoint.dY = lY;
				break;
			}
		case rtLineTo:
		case rtRLineTo:
			{
				SAFEARRAY* pArray = SafeArrayCreateVector(VT_R8, 2 * nCount + 2);
				double* pBuffer = (double*)(pArray->pvData);
				double* pBufferMem = pBuffer;

				*pBufferMem = pGeomInfo.m_oCurPoint.dX; ++pBufferMem;
				*pBufferMem = pGeomInfo.m_oCurPoint.dY; ++pBufferMem;
				
				double lX = 0;
				double lY = 0;
				for (int nIndex = 0; nIndex < nCount; ++nIndex)
				{			
					if (rtLineTo == m_eRuler)
					{
						lX = dLeft + (dKoefX * m_arPoints[nIndex].x);
						lY = dTop  + (dKoefY * m_arPoints[nIndex].y);
					}
					else
					{
						lX = pGeomInfo.m_oCurPoint.dX + (dKoefX * m_arPoints[nIndex].x);
						lY = pGeomInfo.m_oCurPoint.dY + (dKoefY * m_arPoints[nIndex].y);
					}

					

					*pBufferMem = (float)lX; ++pBufferMem;
					*pBufferMem = (float)lY; ++pBufferMem;
				}

				pGeomInfo.m_oCurPoint.dX = lX;
				pGeomInfo.m_oCurPoint.dY = lY;

				pRenderer->PathCommandLinesTo(pArray);
				break;
			}
		case rtCurveTo:
		case rtRCurveTo:
			{
				SAFEARRAY* pArray = SafeArrayCreateVector(VT_R8, 2 * nCount + 2);
				double* pBuffer = (double*)(pArray->pvData);
				double* pBufferMem = pBuffer;

				*pBufferMem = pGeomInfo.m_oCurPoint.dX; ++pBufferMem;
				*pBufferMem = pGeomInfo.m_oCurPoint.dY; ++pBufferMem;
				
				double lX = 0;
				double lY = 0;
				for (int nIndex = 0; nIndex < nCount; ++nIndex)
				{			
					if (rtCurveTo == m_eRuler)
					{
						lX = dLeft + (dKoefX * m_arPoints[nIndex].x);
						lY = dTop  + (dKoefY * m_arPoints[nIndex].y);
					}
					else
					{
						lX = pGeomInfo.m_oCurPoint.dX + (dKoefX * m_arPoints[nIndex].x);
						lY = pGeomInfo.m_oCurPoint.dY + (dKoefY * m_arPoints[nIndex].y);
					}

					

					*pBufferMem = (float)lX; ++pBufferMem;
					*pBufferMem = (float)lY; ++pBufferMem;
				}

				pGeomInfo.m_oCurPoint.dX = lX;
				pGeomInfo.m_oCurPoint.dY = lY;

				pRenderer->PathCommandCurvesTo(pArray);
				break;
			}
		case rtEllipticalQuadrX:
		case rtEllipticalQuadrY:
			{
				bool bIsX = true;

				double angleStart = -90;
				double angleSweet = 90;

				if (rtEllipticalQuadrY == m_eRuler)
				{
					bIsX = false;
					angleStart = 180;
					angleSweet = -90;
				}
							
				for (int nIndex = 0; nIndex < nCount; ++nIndex)
				{			
					double lX = dLeft + (dKoefX * m_arPoints[nIndex].x);
					double lY = dTop  + (dKoefY * m_arPoints[nIndex].y);

					double Width  = 2 * (lX  - pGeomInfo.m_oCurPoint.dX);
					double Height = 2 * (lY - pGeomInfo.m_oCurPoint.dY);

					double Left = 0;
					double Top = 0;
					
					ApplyElliptical(bIsX, angleStart, angleSweet, Left, Top, Width, Height, pGeomInfo.m_oCurPoint);
					pRenderer->PathCommandArcTo(Left, Top, Width, Height, angleStart, angleSweet);

					pGeomInfo.m_oCurPoint.dX = lX;
					pGeomInfo.m_oCurPoint.dY = lY;
				}

				break;
			}
		case rtQuadrBesier:
			{
				CAtlArray<CGeomShapeInfo::CPointD> arPoints;
				arPoints.Add(pGeomInfo.m_oCurPoint);
				
				for (int nIndex = 0; nIndex < nCount; ++nIndex)
				{			
					CGeomShapeInfo::CPointD oPoint;
					
					oPoint.dX = dLeft + (dKoefX * m_arPoints[nIndex].x);
					oPoint.dY = dTop  + (dKoefY * m_arPoints[nIndex].y);

					arPoints.Add(oPoint);
				}

				Bez2_3(arPoints, m_eRuler);

				SAFEARRAY* pArray = SafeArrayCreateVector(VT_R8, 2 * nCount);
				double* pBuffer = (double*)(pArray->pvData);
				double* pBufferMem = pBuffer;
				
				double lX = 0;
				double lY = 0;
				for (int nIndex = 0; nIndex < nCount; ++nIndex)
				{			
					lX = dLeft + (dKoefX * m_arPoints[nIndex].x);
					lY = dTop  + (dKoefY * m_arPoints[nIndex].y);

					*pBufferMem = (float)lX; ++pBufferMem;
					*pBufferMem = (float)lX; ++pBufferMem;
				}

				pGeomInfo.m_oCurPoint.dX = lX;
				pGeomInfo.m_oCurPoint.dY = lY;

				pRenderer->PathCommandCurvesTo(pArray);
				break;
			}
		case rtArcTo:
		case rtArc:
			{
				CAtlArray<double> arPoints;				
				for (int nIndex = 0; nIndex < nCount; ++nIndex)
				{			
					double lX = dLeft + (dKoefX * m_arPoints[nIndex].x);
					double lY = dTop  + (dKoefY * m_arPoints[nIndex].y);

					arPoints.Add(lX);
					arPoints.Add(lY);

					if (nIndex % 4 > 1)
					{
						pGeomInfo.m_oCurPoint.dX = lX;
						pGeomInfo.m_oCurPoint.dY = lY;
					}
				}

				if (rtArc == m_eRuler)
				{
					pRenderer->PathCommandStart();
				}

				int nFigure = 0;
				int nSize = (int)arPoints.GetCount();
				while ((nFigure + 8) <= nSize)
				{
					double nCentreX = (arPoints[nFigure]		+ arPoints[nFigure + 2]) / 2;
					double nCentreY = (arPoints[nFigure + 1]	+ arPoints[nFigure + 3]) / 2;

					double angleStart = GetAngle(nCentreX, nCentreY, 
						arPoints[nFigure + 4], arPoints[nFigure + 5]);

					double angleEnd = GetAngle(nCentreX, nCentreY, 
						arPoints[nFigure + 6], arPoints[nFigure + 7]);

					pRenderer->PathCommandArcTo(arPoints[nFigure], arPoints[nFigure + 1],
						arPoints[nFigure + 2] - arPoints[nFigure], 
						arPoints[nFigure + 3] - arPoints[nFigure + 1],
						angleStart, GetSweepAngle(angleStart, angleEnd));

					nFigure += 8;
				}

				break;
			}
		case rtClockwiseArcTo:
		case rtClockwiseArc:
			{
				CAtlArray<double> arPoints;				
				for (int nIndex = 0; nIndex < nCount; ++nIndex)
				{			
					double lX = dLeft + (dKoefX * m_arPoints[nIndex].x);
					double lY = dTop  + (dKoefY * m_arPoints[nIndex].y);

					arPoints.Add(lX);
					arPoints.Add(lY);

					if (nIndex % 4 > 1)
					{
						pGeomInfo.m_oCurPoint.dX = lX;
						pGeomInfo.m_oCurPoint.dY = lY;
					}
				}

				if (rtClockwiseArc == m_eRuler)
				{
					pRenderer->PathCommandStart();
				}

				int nFigure = 0;
				int nSize = (int)arPoints.GetCount();
				while ((nFigure + 8) <= nSize)
				{
					double nCentreX = (arPoints[nFigure]		+ arPoints[nFigure + 2]) / 2;
					double nCentreY = (arPoints[nFigure + 1]	+ arPoints[nFigure + 3]) / 2;

					double angleStart = GetAngle(nCentreX, nCentreY, 
						arPoints[nFigure + 4], arPoints[nFigure + 5]);

					double angleEnd = GetAngle(nCentreX, nCentreY, 
						arPoints[nFigure + 6], arPoints[nFigure + 7]);

					pRenderer->PathCommandArcTo(arPoints[nFigure], arPoints[nFigure + 1],
						arPoints[nFigure + 2] - arPoints[nFigure], 
						arPoints[nFigure + 3] - arPoints[nFigure + 1],
						angleStart, 360 + GetSweepAngle(angleStart, angleEnd));

					nFigure += 8;
				}

				break;
			}
		case rtAngleEllipseTo:
		case rtAngleEllipse:
			{
				CAtlArray<double> arPoints;
				for (int nIndex = 0; nIndex < nCount; ++nIndex)
				{			
					double lX = 0;
					double lY = 0;
					if (nIndex % 3 == 0)
					{
						lX = dLeft + (dKoefX * m_arPoints[nIndex].x);
						lY = dTop  + (dKoefY * m_arPoints[nIndex].y);

						arPoints.Add(lX);
						arPoints.Add(lY);
						
						continue;
					}
					else if (nIndex % 3 == 1)
					{
						lX = (2 * dKoefX * m_arPoints[nIndex].x);
						lY = (2 * dKoefY * m_arPoints[nIndex].y);

						arPoints.Add(lX);
						arPoints.Add(lY);
						
						continue;
					}
					else 
					{
						double dCx = dLeft + (dKoefX * m_arPoints[nIndex - 2].x);
						double dCy = dTop  + (dKoefY * m_arPoints[nIndex - 2].y);

						double dRad = _hypot(dKoefX * m_arPoints[nIndex - 1].x, dKoefY * m_arPoints[nIndex - 1].y);
						double dAngle = (double)m_arPoints[nIndex].y / pow2_16;
						dAngle *= (3.14159265358979323846 / 180.0);

						lX = m_arPoints[nIndex].x / pow2_16;
						lY = m_arPoints[nIndex].y / pow2_16;

						if (lX < 0) 
							lX += 360;
						if (lY < 0)
							lY += 360;

						pGeomInfo.m_oCurPoint.dX = (dCx + dRad * cos(dAngle));
						pGeomInfo.m_oCurPoint.dX = (dCx - dRad * sin(dAngle));
					}

					arPoints.Add(lX);
					arPoints.Add(GetSweepAngle(lX, lY));
				}

				if (rtAngleEllipse == m_eRuler)
				{
					pRenderer->PathCommandStart();
				}

				int nFigure = 0;
				int nSize = (int)arPoints.GetCount();
				while ((nFigure + 6) <= nSize)
				{
					double nLeft	= arPoints[nFigure]		- arPoints[nFigure + 2] / 2;
					double nTop		= arPoints[nFigure + 1]	- arPoints[nFigure + 3] / 2;

					pRenderer->PathCommandArcTo(nLeft, nTop,
						arPoints[nFigure + 2], arPoints[nFigure + 3],
						arPoints[nFigure + 4], arPoints[nFigure + 5]);

					nFigure += 6;
				}

				break;
			}
		default:
			break;	
		};
	}
	double GetAngle(double fCentreX, double fCentreY, double fX, double fY)
	{
		
		double dX = fX - fCentreX;
		double dY = fY - fCentreY;

		double modDX = abs(dX);
		double modDY = abs(dY);

		if ((modDX < 0.01) && (modDY < 0.01))
		{
			return 0;
		}
		if ((modDX < 0.01) && (dY < 0))
		{
			return -90;
		}
		else if (modDX < 0.01)
		{
			return 90;
		}
		if ((modDY < 0.01) && (dX < 0))
		{
			return 180;
		}
		else if (modDY < 0.01)
		{
			return 0;
		}

		double fAngle = atan(dY / dX);
		fAngle *= (180 / M_PI);
		if (dX > 0 && dY > 0)
		{
			return fAngle;
		}
		else if (dX > 0 && dY < 0)
		{
			return fAngle;
		}
		else if (dX < 0 && dY > 0)
		{
			
			return 180 + fAngle;
		}
		else
		{
			
			return fAngle - 180;
		}
	}

	inline double GetSweepAngle(const double& angleStart, const double& angleEnd)
	{
		if (angleStart >= angleEnd)
			return angleEnd - angleStart;
		else
			return angleEnd - angleStart - 360;
	}

	void ApplyElliptical(bool& bIsX, double& angleStart, double& angleSweet, 
		double& Left, double& Top, double& Width, double& Height, const CGeomShapeInfo::CPointD& pointCur)
	{
		
		if (bIsX)
		{
			angleStart = -90;
			angleSweet = 90;

			if ((Width < 0) && (Height < 0))
			{
				angleStart = 90;
				Width *= -1;
				Height *= -1;
				Left = pointCur.dX - Width / 2;
				Top = pointCur.dY - Height;
			}
			else if ((Width < 0) && (Height > 0))
			{
				angleStart = -90;
				angleSweet = -90;
				Width *= -1;
				Left = pointCur.dX - Width / 2;
				Top = pointCur.dY;
			}
			else if ((Width > 0) && (Height < 0))
			{
				angleStart = 90;
				angleSweet = -90;
				Height *= -1;
				Left = pointCur.dX - Width / 2;
				Top = pointCur.dY - Height;
			}
			else
			{
				Left = pointCur.dX - Width / 2;
				Top = pointCur.dY;
			}
		}
		else
		{
			angleStart = 180;
			angleSweet = -90;

			if ((Width < 0) && (Height < 0))
			{
				angleStart = 0;
				Width *= -1;
				Height *= -1;
				Left = pointCur.dX - Width;
				Top = pointCur.dY - Height / 2;
			}
			else if ((Width < 0) && (Height > 0))
			{
				angleStart = 0;
				angleSweet = 90;
				Width *= -1;
				Left = pointCur.dX - Width;
				Top = pointCur.dY - Height / 2;
			}
			else if ((Width > 0) && (Height < 0))
			{
				angleStart = 180;
				angleSweet = 90;
				Height *= -1;
				Left = pointCur.dX;
				Top = pointCur.dY - Height / 2;
			}
			else
			{
				Left = pointCur.dX;
				Top = pointCur.dY - Height / 2;
			}
		}
		bIsX = !bIsX;
	}


#endif

	CSlice& operator =(const CSlice& oSrc)
	{
		m_eRuler = oSrc.m_eRuler;
		m_arPoints.RemoveAll();
		for (int nIndex = 0; nIndex < oSrc.m_arPoints.GetSize(); ++nIndex)
		{
			m_arPoints.Add(oSrc.m_arPoints[nIndex]);
		}
		return (*this);
	}

	void ApplyLimo(CGeomShapeInfo& pGeomInfo, double& lX, double& lY)
	{
		if ((0 == pGeomInfo.m_dLimoX) || (0 == pGeomInfo.m_dLimoY))
			return;

		double dAspect = (double)pGeomInfo.m_dLimoX / pGeomInfo.m_dLimoY;
		double lWidth  = (dAspect * pGeomInfo.m_dHeight);

		if (lWidth < pGeomInfo.m_dWidth)
		{
			
			double lXc = pGeomInfo.m_dLeft + pGeomInfo.m_dWidth / 2;
			if ((lX > lXc) || ((lX == lXc) && (pGeomInfo.m_oCurPoint.dX >= lXc)))
			{
				double lXNew = pGeomInfo.m_dLeft + ((lWidth / pGeomInfo.m_dWidth) * (lX - pGeomInfo.m_dLeft));
				lXNew += (pGeomInfo.m_dWidth - lWidth);
				lX = lXNew;
			}
			
			
			
			
			
			
			
			
			
		}
		else if (lWidth != pGeomInfo.m_dWidth)
		{
			
			double lHeight = (pGeomInfo.m_dWidth / dAspect);
			double lYc = pGeomInfo.m_dTop + pGeomInfo.m_dHeight / 2;
			if ((lY > lYc) || ((lY == lYc) && (pGeomInfo.m_oCurPoint.dY >= lYc)))
			{
				double lYNew = pGeomInfo.m_dTop + ((lHeight / pGeomInfo.m_dHeight) * (lY - pGeomInfo.m_dTop));
				lYNew += (pGeomInfo.m_dHeight - lHeight);
				lY = lYNew;
			}
		}
	}

	void Bez2_3(CAtlArray<CGeomShapeInfo::CPointD>& oArray, RulesType& eType)
	{
		if (rtQuadrBesier == eType)
		{
			eType = rtCurveTo;
		}
		else if (rtOOXMLQuadBezTo == eType)
		{
			eType = rtOOXMLCubicBezTo;
		}
		else
		{
			return;
		}
		
		CAtlArray<CGeomShapeInfo::CPointD> arOld;
		arOld.Copy(oArray);

		oArray.RemoveAll();
		
		size_t nStart	= 0;
		size_t nEnd	= 2;

		size_t nCount = arOld.GetCount();
		while (nStart < (nCount - 1))
		{
			if (2 >= (nCount - nStart))
			{
				
				for (size_t i = nStart; i < nCount; ++i)
				{
					oArray.Add(arOld[i]);
				}
				
				nStart = nCount;
				break;
			}
			
			if (4 == (nCount - nStart))
			{
				
				oArray.Add(arOld[nStart]);
				oArray.Add(arOld[nStart + 1]);
				oArray.Add(arOld[nStart + 2]);
				oArray.Add(arOld[nStart + 3]);

				nStart += 4;
				break;
			}

			
			CGeomShapeInfo::CPointD mem1;
			mem1.dX = (arOld[nStart].dX + 2 * arOld[nStart + 1].dX) / 3.0;
			mem1.dY = (arOld[nStart].dY + 2 * arOld[nStart + 1].dY) / 3.0;

			CGeomShapeInfo::CPointD mem2;
			mem2.dX = (2 * arOld[nStart + 1].dX + arOld[nStart + 2].dX) / 3.0;
			mem2.dY = (2 * arOld[nStart + 1].dY + arOld[nStart + 2].dY) / 3.0;

			oArray.Add(mem1);
			oArray.Add(mem2);
			oArray.Add(arOld[nStart + 2]);

			nStart += 2;
		}
	}
};

namespace NSShapes
{
class CPartPath
{
public:
	bool m_bFill;
	bool m_bStroke;
	long width;
	long height;
	CSimpleArray<CSlice> m_arSlices;

public:
	CPartPath() : m_arSlices()
	{
		m_bFill = true;
		m_bStroke = true;
		width = 43200;
		height = 43200;
	}
#if defined(PPTX_DEF)
	void FromXML(XmlUtils::CXmlNode& PathNode, NSGuidesOOXML::CFormulaManager& pManager)
	{
		m_bFill = PathNode.GetAttribute(_T("fill"), _T("norm")) != _T("none");
		CString stroke = PathNode.GetAttribute(_T("stroke"), _T("true"));
		m_bStroke = (stroke == _T("true")) || (stroke == _T("1"));
		width = (long)XmlUtils::GetInteger(PathNode.GetAttribute(_T("w"), _T("0")));
		height = (long)XmlUtils::GetInteger(PathNode.GetAttribute(_T("h"), _T("0")));
		if(width == 0) width = (long)pManager.GetWidth();
		if(height == 0) height = (long)pManager.GetHeight();

		XmlUtils::CXmlNodes list;
		PathNode.GetNodes(_T("*"), list);
		for(long i = 0; i < list.GetCount(); i++)
		{
			CSlice slice;
			XmlUtils::CXmlNode node;
			list.GetAt(i, node);
			slice.FromXML(node, pManager, pManager.GetWidth()/width, pManager.GetHeight()/height);
			m_arSlices.Add(slice);
		}

		
		
		
	}
#endif
#if defined(PPT_DEF)
	void FromXML(CString strPath , NSGuidesVML::CFormulasManager& pManager)
	{
		NSStringUtils::CheckPathOn_Fill_Stroke(strPath, m_bFill, m_bStroke);
		CSimpleArray<CString> oArray;

		NSStringUtils::ParsePath2(strPath, &oArray);

		ParamType eParamType = ptValue;
		RulesType eRuler = rtEnd; 
		LONG lValue;
		bool bRes = true;

		for (int nIndex = 0; nIndex < oArray.GetSize(); ++nIndex)
		{
			lValue = GetValue(oArray[nIndex], eParamType, bRes);
			if (bRes)
			{	
				switch (eParamType)
				{
				case ptFormula: { lValue = pManager.m_arResults[lValue]; break; }
				case ptAdjust:  { lValue = (*(pManager.m_pAdjustments))[lValue]; break; }
				default: break;
				};
				if (0 != m_arSlices.GetSize())
				{
					m_arSlices[m_arSlices.GetSize() - 1].AddParam(lValue);
				}
			}
			else
			{
				eRuler = GetRuler(oArray[nIndex], bRes);
				if (bRes)
				{
					if (rtNoFill == eRuler)
					{
						m_bFill = false;
					}
					else if (rtNoStroke == eRuler)
					{
						m_bStroke = false;
					}
					else
					{				
						CSlice oSlice(eRuler);
						m_arSlices.Add(oSlice);
					}
				}
			}
		}
	}
#endif
#if defined(ODP_DEF)
	void FromXML(CString strPath , NSGuidesOdp::CFormulaManager& pManager)
	{
		NSStringUtils::CheckPathOn_Fill_Stroke(strPath, m_bFill, m_bStroke);
		CSimpleArray<CString> oArray;
		
		NSStringUtils::ParseString(_T(" "), strPath, &oArray);

		RulesType eRuler = rtEnd; 
		LONG lValue;
		bool bRes = true;

		for (int nIndex = 0; nIndex < oArray.GetSize(); ++nIndex)
		{
			eRuler = GetRuler(oArray[nIndex], bRes);
			if (bRes)
			{
				if (rtNoFill == eRuler)
				{
					m_bFill = false;
				}
				else if (rtNoStroke == eRuler)
				{
					m_bStroke = false;
				}
				else
				{				
					CSlice oSlice(eRuler);
					m_arSlices.Add(oSlice);
				}
			}
			else
			{
				lValue = (long)pManager.GetValue(oArray[nIndex]);
				if (0 != m_arSlices.GetSize())
				{
					m_arSlices[m_arSlices.GetSize() - 1].AddParam(lValue);
				}
			}
		}
	}
#endif

	CString ToXml(CGeomShapeInfo& pGeomInfo, double dStartTime, double dEndTime, CPen_& pPen, CBrush_& pFore, CMetricInfo& pInfo, NSBaseShape::ClassType ClassType)
	{
		CString strTimeLine = _T("");
		strTimeLine.Format(_T("<timeline type='1' begin='%lf' end='%lf' fadein='0' fadeout='0' completeness='1.0'/>"), dStartTime, dEndTime);

		CString strFill = _T("");
		strFill.Format(_T(" stroke='%s' fill='%s' angle='%lf' flags='%d' bounds-left='%lf' bounds-top='%lf' bounds-right='%lf' bounds-bottom='%lf' widthmm='%d' heightmm='%d'>"),
			NSAttributes::BoolToString(m_bStroke), NSAttributes::BoolToString(m_bFill), 
			pGeomInfo.m_dRotate, pGeomInfo.GetFlags(), 
			pGeomInfo.m_dLeft, pGeomInfo.m_dTop, pGeomInfo.m_dLeft + pGeomInfo.m_dWidth, pGeomInfo.m_dTop + pGeomInfo.m_dHeight,
			pInfo.m_lMillimetresHor, pInfo.m_lMillimetresVer);

		strFill += pPen.ToString2();
		if (m_bFill)
			strFill += pFore.ToString2();

		CString strResult = _T("<ImagePaint-DrawGraphicPath") + strFill;
		for (int nIndex = 0; nIndex < m_arSlices.GetSize(); ++nIndex)
		{
			strResult += m_arSlices[nIndex].ToXml(pGeomInfo, width, height, ClassType);
		}
		strResult += strTimeLine;
		strResult += _T("</ImagePaint-DrawGraphicPath>");

		return strResult;
	}

#if defined(PPT_DEF)
	void ToRenderer(IASCRenderer* pRenderer, CGeomShapeInfo& pGeomInfo, 
		double dStartTime, double dEndTime, CPen_& pPen, CBrush_& pFore, CMetricInfo& pInfo)
	{
		LONG lType = 0;
		if (m_bStroke)
		{
			lType = 1;

			BSTR bsXml = pPen.ToString3().AllocSysString();
			pRenderer->SetPen(bsXml);
			SysFreeString(bsXml);
		}
		if (m_bFill)
		{
			lType += c_nWindingFillMode;

			BSTR bsXml = pFore.ToString().AllocSysString();
			pRenderer->SetBrush(bsXml);
			SysFreeString(bsXml);
		}

		pRenderer->put_Width(pInfo.m_lMillimetresHor);
		pRenderer->put_Height(pInfo.m_lMillimetresVer);

		pRenderer->SetCommandParams(pGeomInfo.m_dRotate, pGeomInfo.m_dLeft, pGeomInfo.m_dTop, 
			pGeomInfo.m_dWidth, pGeomInfo.m_dHeight, pGeomInfo.GetFlags());

		pRenderer->BeginCommand(c_nPathType);

		int nSlises = m_arSlices.GetSize();
		for (int nIndex = 0; nIndex < nSlises; ++nIndex)
		{
			m_arSlices[nIndex].ToRenderer(pRenderer, pGeomInfo, width, height);
		}
		
		pRenderer->DrawPath(lType);
		
		pRenderer->PathCommandEnd();
		pRenderer->EndCommand(c_nPathType);
		pRenderer->SetCommandParams(0, -1, -1, -1, -1, 0);
	}
#endif


	CPartPath& operator =(const CPartPath& oSrc)
	{
		m_bFill = oSrc.m_bFill;
		m_bStroke = oSrc.m_bStroke;

		width = oSrc.width;
		height = oSrc.height;

		m_arSlices.RemoveAll();
		for (int nIndex = 0; nIndex < oSrc.m_arSlices.GetSize(); ++nIndex)
		{
			m_arSlices.Add(oSrc.m_arSlices[nIndex]);
		}
		return (*this);
	}
};

class CPath
{
public:
	CSimpleArray<CPartPath> m_arParts;
public:
#if defined(PPTX_DEF)
	void FromXML(XmlUtils::CXmlNodes& list, NSGuidesOOXML::CFormulaManager& pManager)
	{
		m_arParts.RemoveAll();
		for(long i = 0; i < list.GetCount(); i++)
		{
			XmlUtils::CXmlNode path;
			list.GetAt(i, path);
			CPartPath part;
			part.FromXML(path, pManager);
			m_arParts.Add(part);
		}
	}
#endif
#if defined(PPT_DEF)
	void FromXML(CString strPath, NSGuidesVML::CFormulasManager& pManager)
	{
		m_arParts.RemoveAll();
		CSimpleArray<CString> oArray;
		NSStringUtils::ParseString(_T("e"), strPath, &oArray);

		for (int nIndex = 0; nIndex < oArray.GetSize(); ++nIndex)
		{
			CPartPath oPath;
			m_arParts.Add(oPath);
			m_arParts[m_arParts.GetSize() - 1].FromXML(oArray[nIndex], pManager);
		}
	}
#endif
#if defined(ODP_DEF)
	void FromXML(CString strPath, NSGuidesOdp::CFormulaManager& pManager)
	{
		m_arParts.RemoveAll();
		CSimpleArray<CString> oArray;
		NSStringUtils::ParseString(_T("N"), strPath, &oArray);

		for (int nIndex = 0; nIndex < oArray.GetSize(); ++nIndex)
		{
			CPartPath oPath;
			m_arParts.Add(oPath);
			m_arParts[m_arParts.GetSize() - 1].FromXML(oArray[nIndex], pManager);
		}
	}
#endif

	CString ToXml(CGeomShapeInfo& pGeomInfo, double dStartTime, double dEndTime, CPen_& pPen, CBrush_& pFore, CMetricInfo& pInfo, NSBaseShape::ClassType ClassType)
	{
		CString strResult = _T("");
		for (int nIndex = 0; nIndex < m_arParts.GetSize(); ++nIndex)
		{
			strResult += m_arParts[nIndex].ToXml(pGeomInfo, dStartTime, dEndTime, pPen, pFore, pInfo, ClassType);
		}
		return strResult;
	}

#if defined(PPT_DEF)
	void ToRenderer(IASCRenderer* pRenderer, CGeomShapeInfo& pGeomInfo, double dStartTime, 
		double dEndTime, CPen_& pPen, CBrush_& pFore, CMetricInfo& pInfo)
	{
		int nSize = m_arParts.GetSize();
		for (int nIndex = 0; nIndex < nSize; ++nIndex)
		{
			m_arParts[nIndex].ToRenderer(pRenderer, pGeomInfo, dStartTime, dEndTime, pPen, pFore, pInfo);
		}
	}
#endif

	CPath& operator =(const CPath& oSrc)
	{
		m_arParts.RemoveAll();
		for (int nIndex = 0; nIndex < oSrc.m_arParts.GetSize(); ++nIndex)
		{
			m_arParts.Add(oSrc.m_arParts[nIndex]);
		}
		return (*this);
	}

	void SetCoordsize(LONG lWidth, LONG lHeight)
	{
		for (int nIndex = 0; nIndex < m_arParts.GetSize(); ++nIndex)
		{
			m_arParts[nIndex].width = lWidth;
			m_arParts[nIndex].height = lHeight;
		}
	}
};
}

