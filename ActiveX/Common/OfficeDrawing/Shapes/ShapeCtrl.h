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
#include "..\..\AVSOfficeStudio\Common\OfficeDrawing\Shapes\ShapeIncluder.h"

[object, uuid("5DB4FDAF-54C9-4a9d-AD4E-34EBBBCBAD8A"), dual, pointer_default(unique)]
__interface IOOXMLShape : IDispatch
{
	[id(101)] HRESULT SetAdditionalParam([in] BSTR ParamName, [in] VARIANT ParamValue);
	[id(102)] HRESULT GetAdditionalParam([in] BSTR ParamName, [out, retval] VARIANT* ParamValue);

	[id(201)] HRESULT SetXml([in] BSTR Xml);
	[id(202)] HRESULT SetType([in] LONG lType, [in] double dLeft, [in] double dTop, [in] double dRight, [in] double dBottom, [in] double dStartTime, [in] double dEndTime);
	
	[id(203), propget] HRESULT AdjCount([out, retval] LONG* plCount);
	[id(204)] HRESULT GetAdj([in] LONG Index, [out] IUnknown** ppAdj);
	[id(205)] HRESULT SetAdj([in] LONG Index, [in] IUnknown* pAdj);
	
	[id(301)] HRESULT GetXml([out, retval] BSTR* bsXml);
	[id(302)] HRESULT GetXml2([in] LONG lWidth, [in] LONG lHeight, [out, retval] BSTR* bsXml);
};
	
[coclass, uuid("8C295FC7-0C92-4cb7-8931-D8719CB109E2"), threading(apartment), vi_progid("AVSImageStudio.OOXMLShape"), progid("AVSImageStudio.OOXMLShape1"), version(1.0)]
class ATL_NO_VTABLE COOXMLShape : public IOOXMLShape
{
private:
	CShape* m_pShape;
	LONG	m_lMetric;
	LONG	m_lType;

public:
	
	COOXMLShape() : m_pShape(NULL)
	{
	}
	~COOXMLShape()
	{
	}
	
public:

	STDMETHOD(SetAdditionalParam)(BSTR ParamName, VARIANT ParamValue)
	{
		return S_OK;
	}
	STDMETHOD(GetAdditionalParam)(BSTR ParamName, VARIANT* ParamValue)
	{
		return S_OK;
	}
	
	STDMETHOD(SetXml)(BSTR bsXml)
	{
		CString strXml = (CString)bsXml;

		XmlUtils::CXmlNode oNode;
		if (oNode.FromXmlString(strXml))
		{
			CString strNodeName = oNode.GetName();
			if (_T("pen") == strNodeName)
			{
				
			}
			else if (_T("brush") == strNodeName)
			{
				
			}
			else if (_T("ImagePaint-DrawAutoShape") == strNodeName)
			{
				m_lType = (LONG)Strings::ToInteger(oNode.GetAttributeOrValue(_T("type"), _T("0")));
				RELEASEOBJECT(m_pShape);
				m_pShape = new CShape(NSBaseShape::pptx, m_lType);

				if (!IsValid())
					return S_FALSE;

				m_lMetric					= Strings::ToInteger(oNode.GetAttributeOrValue(_T("metric"), _T("0")));
				m_pShape->m_rcBounds.left	= Strings::ToDouble(oNode.GetAttributeOrValue(_T("left"), _T("0")));
				m_pShape->m_rcBounds.top	= Strings::ToDouble(oNode.GetAttributeOrValue(_T("top"), _T("0")));
				m_pShape->m_rcBounds.right	= Strings::ToDouble(oNode.GetAttributeOrValue(_T("right"), _T("0")));
				m_pShape->m_rcBounds.bottom	= Strings::ToDouble(oNode.GetAttributeOrValue(_T("bottom"), _T("0")));

				XmlUtils::CXmlNodes oAdjusts;

				if (oNode.GetNodes(_T("adj"), oAdjusts))
				{
					LONG lCount = oAdjusts.GetCount();

					for (LONG i = 0; i < lCount; ++i)
					{
						XmlUtils::CXmlNode oNodeA;
						if (oAdjusts.GetAt(i, oNodeA))
						{
							LONG lIndex = (LONG)Strings::ToInteger(oNode.GetAttributeOrValue(_T("index"), _T("0")));
							LONG lAdj	= (LONG)Strings::ToInteger(oNode.GetAttributeOrValue(_T("value"), _T("0"))); 

							m_pShape->m_pShape->SetAdjustment(lIndex, lAdj);
						}
					}
				}

				m_pShape->SetProperties(NULL, NULL);
			}
		}
		
		return S_OK;
	}
	STDMETHOD(SetType)(LONG lType, double dLeft, double dTop, double dRight, double dBottom, double dStartTime, double dEndTime)
	{
		RELEASEOBJECT(m_pShape);
		m_lType = lType;
		m_pShape = new CShape(NSBaseShape::pptx, m_lType);

		m_pShape->m_rcBounds.left	= dLeft;
		m_pShape->m_rcBounds.top	= dTop;
		m_pShape->m_rcBounds.right	= dRight;
		m_pShape->m_rcBounds.bottom	= dBottom;

		m_pShape->m_dStartTime		= dStartTime;
		m_pShape->m_dEndTime		= dEndTime;

		return S_OK;
	}

	STDMETHOD(get_AdjCount)(LONG* plCount)
	{
		if (!IsValid() || NULL == plCount)
			return S_FALSE;

		*plCount = m_pShape->m_pShape->m_arAdjustments.GetSize();
		return S_OK;
	}
	
	STDMETHOD(GetAdj)(LONG Index, IUnknown** ppAdj)
	{
		return S_OK;
	}
	STDMETHOD(SetAdj)(LONG Index, IUnknown* ppAdj)
	{
		return S_OK;
	}
	
	STDMETHOD(GetXml)(BSTR* bsXml)
	{
		if (!IsValid() || NULL == bsXml)
			return FALSE;
		
		XmlUtils::CXmlWriter oWriter;

		oWriter.WriteNodeBegin(_T("ImagePaint-DrawAutoShape") , TRUE);
		
		oWriter.WriteAttribute(_T("type"), m_lType);
		oWriter.WriteAttribute(_T("metric"), m_lMetric);

		oWriter.WriteAttribute(_T("left"),		m_pShape->m_rcBounds.left);
		oWriter.WriteAttribute(_T("top"),		m_pShape->m_rcBounds.top);
		oWriter.WriteAttribute(_T("right"),		m_pShape->m_rcBounds.right);
		oWriter.WriteAttribute(_T("bottom"),	m_pShape->m_rcBounds.bottom);

		oWriter.WriteNodeEnd(_T("ImagePaint-DrawAutoShape"), FALSE, FALSE);

		LONG lCountAdj = m_pShape->m_pShape->m_arAdjustments.GetSize();
		for (LONG i = 0; i < lCountAdj; ++i)
		{
			oWriter.WriteNodeBegin(_T("adj") , TRUE);
		
			oWriter.WriteAttribute(_T("index"), i);
			oWriter.WriteAttribute(_T("value"), m_pShape->m_pShape->m_arAdjustments[i]);

			oWriter.WriteNodeEnd(_T("adj"), TRUE);
		}

		CString strTimeLine = _T("");
		strTimeLine.Format(_T("<timeline type='1' begin='%lf' end='%lf' fadein='0' fadeout='0' completeness='1.0'/>"), m_pShape->m_dStartTime, m_pShape->m_dEndTime);
		oWriter.WriteString(strTimeLine);

		oWriter.WriteNodeEnd(_T("ImagePaint-DrawAutoShape"));

		return S_OK;
	}
	STDMETHOD(GetXml2)(LONG lWidth, LONG lHeight, BSTR* bsXml)
	{
		if (!IsValid() || NULL == bsXml)
			return FALSE;

		switch (m_lMetric)
		{
		case ImageStudio::Serialize::c_nMetricPercents:
			{
				double dValX = (double)lWidth  / 100.0;
				double dValY = (double)lHeight / 100.0;
				
				m_pShape->m_rcBounds.left	*= dValX;
				m_pShape->m_rcBounds.top	*= dValY;
				m_pShape->m_rcBounds.right	*= dValX;
				m_pShape->m_rcBounds.bottom *= dValY;
				break;
			}
		case ImageStudio::Serialize::c_nMetricNormalizedCoordinates:
		case ImageStudio::Serialize::c_nMetricAlternativeNormalizedCoordinates:
			{
				double dValX = (double)lWidth;
				double dValY = (double)lHeight;
				
				m_pShape->m_rcBounds.left	*= dValX;
				m_pShape->m_rcBounds.top	*= dValY;
				m_pShape->m_rcBounds.right	*= dValX;
				m_pShape->m_rcBounds.bottom *= dValY;
				break;
			}
		default:
			break;
		};

		m_lMetric = ImageStudio::Serialize::c_nMetricPixels;

		CGeomShapeInfo oInfo;
		oInfo.SetBounds(m_pShape->m_rcBounds);

		oInfo.m_dRotate = 0.0;
		oInfo.m_bFlipH	= FALSE;
		oInfo.m_bFlipV	= TRUE;

		CMetricInfo oMetric;
		oMetric.m_lMillimetresHor = lWidth;
		oMetric.m_lMillimetresVer = lHeight;

		*bsXml = m_pShape->ToXml(oInfo, oMetric, m_pShape->m_dStartTime, m_pShape->m_dEndTime).AllocSysString();
		return S_OK;
	}

protected:

	BOOL IsValid()
	{
		if (NULL == m_pShape)
			return FALSE;

		if (NULL == m_pShape->m_pShape)
			return FALSE;

		return TRUE;
	}
};