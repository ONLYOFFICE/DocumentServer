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
#include "Path.h"
#include "Common.h"

using namespace NSBaseShape;
class CHandle_
{
public:
    CString position;
    CString xrange;
	CString yrange;
    CString switchHandle;
    CString polar;
    CString radiusrange; 

public:
	CHandle_()
	{
		position = _T("");
		xrange = _T("");
		yrange = _T("");
		switchHandle = _T("");
		polar = _T("");
		radiusrange = _T(""); 
	}
	CHandle_& operator =(const CHandle_& oSrc)
	{
		position		= oSrc.position;
		xrange			= oSrc.xrange;
		yrange			= oSrc.yrange;
		switchHandle	= oSrc.switchHandle;
		polar			= oSrc.polar;
		radiusrange		= oSrc.radiusrange;
		return (*this);
	}
};

class CBaseShape
{


	public:
		CSimpleArray<long> m_arAdjustments;
		CSimpleArray<double> Guides;
	public: 
		NSOfficeDrawing::_LineJoin m_eJoin;
		bool m_bConcentricFill;

		CSimpleArray<CPoint> m_arConnectors;
		CSimpleArray<LONG> m_arConnectorAngles;

		CSimpleArray<RECT> m_arTextRects;
		
		CSimpleArray<CHandle_> m_arHandles;

		CString m_strTransformXml;

		CString m_strPath;
		CString m_strRect;

		LONG m_lLimoX;
		LONG m_lLimoY;
		
		NSShapes::CPath m_oPath;
	public:
		CBaseShape()
		{
		}

		virtual bool LoadFromXML(const CString& xml) = 0;
		virtual bool LoadFromXML(XmlUtils::CXmlNode& xmlNode) = 0;
		virtual bool LoadAdjustValuesList(const CString& xml) = 0;
		virtual bool LoadGuidesList(const CString& xml) = 0;
		virtual bool LoadAdjustHandlesList(const CString& xml) = 0;
		virtual bool LoadConnectorsList(const CString& xml) = 0;
		virtual bool LoadTextRect(const CString& xml) = 0;
		virtual bool LoadPathList(const CString& xml) = 0;
		virtual bool SetAdjustment(long index, long value) = 0;
		virtual CString ToXML(CGeomShapeInfo& GeomInfo, CMetricInfo& MetricInfo, double StartTime, double EndTime, CBrush_& Brush, CPen_& Pen) = 0;
		virtual void ReCalculate() = 0;

		virtual void AddGuide(const CString& strGuide)	{}

		static CBaseShape* CreateByType(ClassType ClassType, int ShapeType);
		virtual const ClassType GetClassType()const=0;
		bool SetType(ClassType ClassType, int ShapeType);

		virtual bool SetProperties(CBaseShape* Shape)
		{
			if( Shape == NULL)
				return false;

			m_oPath		= Shape->m_oPath;
			m_strPath	= Shape->m_strPath;
			m_strRect	= Shape->m_strRect;
			
			m_arAdjustments.RemoveAll();
			for(int i = 0; i < Shape->m_arAdjustments.GetSize(); i++)
				m_arAdjustments.Add(Shape->m_arAdjustments[i]);

			Guides.RemoveAll();
			for(int i = 0; i < Shape->Guides.GetSize(); i++)
				Guides.Add(Shape->Guides[i]);

			m_eJoin				= Shape->m_eJoin;
			m_bConcentricFill	= Shape->m_bConcentricFill;

			m_arConnectors.RemoveAll();
			for(int i = 0; i < Shape->m_arConnectors.GetSize(); i++)
				m_arConnectors.Add(Shape->m_arConnectors[i]);

			m_arConnectorAngles.RemoveAll();
			for(int i = 0; i < Shape->m_arConnectorAngles.GetSize(); i++)
				m_arConnectorAngles.Add(Shape->m_arConnectorAngles[i]);

			m_arTextRects.RemoveAll();
			for(int i = 0; i < Shape->m_arTextRects.GetSize(); i++)
				m_arTextRects.Add(Shape->m_arTextRects[i]);

			m_strRect = Shape->m_strRect;
			m_strTransformXml = Shape->m_strTransformXml;
			return true;
		}

		virtual bool SetToDublicate(CBaseShape* Shape)
		{
			if( Shape == NULL)
				return false;

			Shape->m_oPath		= m_oPath;
			Shape->m_strPath	= m_strPath;
			Shape->m_strRect	= m_strRect;
			
			Shape->m_arAdjustments.RemoveAll();
			for(int i = 0; i < m_arAdjustments.GetSize(); i++)
				Shape->m_arAdjustments.Add(m_arAdjustments[i]);

			Shape->Guides.RemoveAll();
			for(int i = 0; i < Guides.GetSize(); i++)
				Shape->Guides.Add(Guides[i]);

			Shape->m_eJoin				= m_eJoin;
			Shape->m_bConcentricFill	= m_bConcentricFill;

			Shape->m_arConnectors.RemoveAll();
			for(int i = 0; i < m_arConnectors.GetSize(); i++)
				Shape->m_arConnectors.Add(m_arConnectors[i]);

			Shape->m_arConnectorAngles.RemoveAll();
			for(int i = 0; i < m_arConnectorAngles.GetSize(); i++)
				Shape->m_arConnectorAngles.Add(m_arConnectorAngles[i]);

			Shape->m_arTextRects.RemoveAll();
			for(int i = 0; i < m_arTextRects.GetSize(); i++)
				Shape->m_arTextRects.Add(m_arTextRects[i]);
			Shape->m_strRect = m_strRect;

			Shape->m_strTransformXml = m_strTransformXml;
			return true;
		}
};
