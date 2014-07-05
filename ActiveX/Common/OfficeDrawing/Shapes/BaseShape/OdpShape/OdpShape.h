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
#include "Formula.h"
#include <string>
#include "./../BaseShape.h"
#include "./../../../../../../Common/XmlUtils.h"

using namespace NSOfficeDrawing;

namespace OdpShapes
{
	enum ShapeType : unsigned short
	{
		sptMin = 0,
		sptNotPrimitive = sptMin,
		sptCRect = 1,
		sptCLine = 2,

		sptMax,
		sptNil = 0x0FFF,
		sptCustom = 0x1000
	};
}

class COdpShape : public CBaseShape
{
public:
	OdpShapes::ShapeType m_eType;

	NSGuidesOdp::CFormulaManager FManager;
public:
	COdpShape() : CBaseShape(), FManager(m_arAdjustments, Guides)
	{
		m_eType = OdpShapes::sptMin;
	}

	~COdpShape()
	{
	}







































































	virtual bool LoadFromXML(const CString& xml)
	{
		XmlUtils::CXmlNode oNodePict;
		if (oNodePict.FromXmlString(xml))
		{
			return LoadFromXML(oNodePict);
		}
	}


	virtual bool LoadFromXML(XmlUtils::CXmlNode& root)
	{
		bool res = true;
		res &= LoadAdjustValuesList(root.GetAttributeOrValue(_T("draw:modifiers")));

		XmlUtils::CXmlNodes gdLst;
		if(root.GetNodes(_T("draw:equation"), gdLst))
		{
			for(long i = 0; i < gdLst.GetCount(); i++)
			{
				XmlUtils::CXmlNode gd;
				gdLst.GetAt(i, gd);
				FManager.AddGuide(_T("?") + gd.GetAttribute(_T("draw:name")), gd.GetAttribute(_T("draw:formula")));
			}

		}


		m_strRect = root.GetAttributeOrValue(_T("draw:text-areas"));
		res &= LoadTextRect(m_strRect);

		m_strPath = root.GetAttributeOrValue(_T("draw:enhanced-path"));
		res &= LoadPathList(m_strPath);

		CString viewBox = root.GetAttributeOrValue(_T("svg:viewBox"));

		if(viewBox != _T(""))
		{
			CSimpleArray<CString> borders;

			NSStringUtils::ParseString(_T(" "), viewBox, &borders);






			FManager.AddGuide(_T("left"), borders[0]);
			FManager.AddGuide(_T("top"), borders[1]);
			FManager.AddGuide(_T("right"), borders[2]);
			FManager.AddGuide(_T("bottom"), borders[3]);

			FManager.Clear();
			for(int i = 0; i < m_oPath.m_arParts.GetSize(); i++)
			{
				m_oPath.m_arParts[i].height = (long)FManager.GetValue(_T("height"));
				m_oPath.m_arParts[i].width = (long)FManager.GetValue(_T("width"));
			}


		}


		return res;
	}

	virtual bool LoadAdjustValuesList(const CString& xml)
	{
		if(xml != _T(""))
		{
			CSimpleArray<CString> adjusts;
			NSStringUtils::ParseString(_T(" "), xml, &adjusts);
			m_arAdjustments.RemoveAll();
			CString buffer;
			for(int i = 0; i < adjusts.GetSize(); i++)
			{
				buffer.Format(_T("%i"), i);
				FManager.AddAdjustment(CString(_T("$")) + buffer, XmlUtils::GetInteger(adjusts[i]));
			}
			return true;
		}
		return false;
	}

	virtual bool LoadGuidesList(const CString& xml)
	{
		return true;
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
		if(xml != _T(""))
		{
			CSimpleArray<CString> borders;
			NSStringUtils::ParseString(_T(" "), xml, &borders);

			RECT TextRect;
			TextRect.left = (long)FManager.GetValue(borders[0]);
			TextRect.top = (long)FManager.GetValue(borders[1]);
			TextRect.right = (long)FManager.GetValue(borders[2]);
			TextRect.bottom = (long)FManager.GetValue(borders[3]);
			if(m_arTextRects.GetSize() > 0)
				m_arTextRects[0] = TextRect;
			else m_arTextRects.Add(TextRect);


		}
		return true;
	}

	virtual bool LoadPathList(const CString& xml)
	{
		if(xml != _T(""))
		{
			m_oPath.FromXML(xml, FManager);

			for(int i = 0; i < m_oPath.m_arParts.GetSize(); i++)
			{
				m_oPath.m_arParts[i].height = (long)FManager.GetValue(_T("height"));
				m_oPath.m_arParts[i].width = (long)FManager.GetValue(_T("width"));
			}

			return true;
		}
		return false;
	}

	virtual bool SetAdjustment(long index, long value)
	{
		FManager.Clear();
		
		CString buffer;
		buffer.Format(_T("%i"), index);
		FManager.AddAdjustment(_T("$") + buffer, value);
		return true;
	}

	virtual CString ToXML(CGeomShapeInfo& GeomInfo, CMetricInfo& MetricInfo, double StartTime, double EndTime, CBrush_& Brush, CPen_& Pen)
	{

		ReCalculate();

		return m_oPath.ToXml(GeomInfo, StartTime, EndTime, Pen, Brush, MetricInfo, NSBaseShape::odp);
	}

	virtual void ReCalculate()
	{
		FManager.ReCalculateGuides();
		LoadTextRect(m_strRect);
		LoadPathList(m_strPath);
	}

	static COdpShape* CreateByType(OdpShapes::ShapeType type);
	virtual const ClassType GetClassType()const
	{
		return NSBaseShape::odp;
	}

	virtual bool SetProperties(CBaseShape* Shape)
	{
		if(Shape == NULL)
			return false;

		if(Shape->GetClassType() != NSBaseShape::odp)
			return false;

		FManager = ((COdpShape*)Shape)->FManager;
		return CBaseShape::SetProperties(Shape);
	}

	virtual bool SetToDublicate(CBaseShape* Shape)
	{
		if(Shape == NULL)
			return false;

		if(Shape->GetClassType() != NSBaseShape::odp)
			return false;

		((COdpShape*)Shape)->FManager = FManager;
		return CBaseShape::SetToDublicate(Shape);
	}

	bool SetShapeType(OdpShapes::ShapeType type)
	{
		COdpShape* l_pShape = CreateByType(type);
		if(l_pShape != NULL)
		{
			m_eType = type;

			SetProperties(l_pShape);
			delete l_pShape;
			return true;
		}

		m_eType = OdpShapes::sptCustom;
		return false;
	}
};