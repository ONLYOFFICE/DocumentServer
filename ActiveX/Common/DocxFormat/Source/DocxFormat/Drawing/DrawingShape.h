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
#ifndef OOX_LOGIC_DRAWING_SHAPE_INCLUDE_H_
#define OOX_LOGIC_DRAWING_SHAPE_INCLUDE_H_

#include "../../Base/Nullable.h"
#include "../../Common/SimpleTypes_Drawing.h"
#include "../../Common/SimpleTypes_Shared.h"

#include "../WritingElement.h"

namespace OOX
{
	namespace Drawing
	{
		enum EGeomType
		{
			geomtypeUnknown = 0,
			geomtypeCustom  = 1,
			geomtypePreset  = 2,
		};
		
		
		
		class CAdjPoint2D : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CAdjPoint2D)
			CAdjPoint2D()
			{
				m_eType = et_Unknown;
			}
			virtual ~CAdjPoint2D()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				m_eType = et_Unknown;
				
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				m_eType = et_Unknown;
				CWCharWrapper sName = oReader.GetName();

				if ( _T("a:pos") == sName )
					m_eType = et_a_pos;
				else if ( _T("a:pt") == sName )
					m_eType = et_a_pt;
				else
					return;

				ReadAttributes( oReader ); 

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}
			virtual CString      toXML() const
			{
				CString sResult;
				if ( et_a_pos == m_eType )
					sResult = _T("<a:pos x=\"") + m_oX.ToString() + _T("\" y=\"") + m_oY.ToString() + _T("\"/>");
				if ( et_a_pt == m_eType )
					sResult = _T("<a:pt x=\"") + m_oX.ToString() + _T("\" y=\"") + m_oY.ToString() + _T("\"/>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return m_eType;
			}
		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("x"), m_oX )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("y"), m_oY )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			EElementType m_eType;

			
			SimpleTypes::CAdjCoordinate<> m_oX;
			SimpleTypes::CAdjCoordinate<> m_oY;

		};
		
		
		
		class CPolarAdjustHandle : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CPolarAdjustHandle)
			CPolarAdjustHandle()
			{
			}
			virtual ~CPolarAdjustHandle()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader ); 

				if ( oReader.IsEmptyNode() )
					return;

				int nCurDepth = oReader.GetDepth();
				while ( oReader.ReadNextSiblingNode( nCurDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();
					if ( _T("a:pos") == sName )
						m_oPos = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<a:ahPolar ");

				if ( m_oGdRefR.IsInit() )
				{
					sResult += _T("gdRefR=\"");
					sResult += m_oGdRefR->ToString();
					sResult += _T("\" ");
				}

				if ( m_oMinR.IsInit() )
				{
					sResult += _T("minR=\"");
					sResult += m_oMinR->ToString();
					sResult += _T("\" ");
				}

				if ( m_oMaxR.IsInit() )
				{
					sResult += _T("maxR=\"");
					sResult += m_oMaxR->ToString();
					sResult += _T("\" ");
				}

				if ( m_oGdRefAng.IsInit() )
				{
					sResult += _T("gdRefAng=\"");
					sResult += m_oGdRefAng->ToString();
					sResult += _T("\" ");
				}

				if ( m_oMinAng.IsInit() )
				{
					sResult += _T("minAng=\"");
					sResult += m_oMinAng->ToString();
					sResult += _T("\" ");
				}

				if ( m_oMaxAng.IsInit() )
				{
					sResult += _T("maxAng=\"");
					sResult += m_oMaxAng->ToString();
					sResult += _T("\" ");
				}

				sResult += _T(">");

				sResult += m_oPos.toXML();

				sResult += _T("</a:ahPolar>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_ahPolar;
			}
		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("gdRefAng"), m_oGdRefAng )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("gdRefR"),   m_oGdRefR )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("maxAng"),   m_oMaxAng )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("maxR"),     m_oMaxR )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("minAng"),   m_oMinAng )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("minR"),     m_oMinR )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			
			nullable<SimpleTypes::CGeomGuideName>   m_oGdRefAng;
			nullable<SimpleTypes::CGeomGuideName>   m_oGdRefR;
			nullable<SimpleTypes::CAdjAngle<>>      m_oMaxAng;
			nullable<SimpleTypes::CAdjCoordinate<>> m_oMaxR;
			nullable<SimpleTypes::CAdjAngle<>>      m_oMinAng;
			nullable<SimpleTypes::CAdjCoordinate<>> m_oMinR;

			
			OOX::Drawing::CAdjPoint2D               m_oPos;

		};
		
		
		
		class CXYAdjustHandle : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CXYAdjustHandle)
			CXYAdjustHandle()
			{
			}
			virtual ~CXYAdjustHandle()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader ); 

				if ( oReader.IsEmptyNode() )
					return;

				int nCurDepth = oReader.GetDepth();
				while ( oReader.ReadNextSiblingNode( nCurDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();
					if ( _T("a:pos") == sName )
						m_oPos = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<a:ahXY ");

				if ( m_oGdRefX.IsInit() )
				{
					sResult += _T("gdRefX=\"");
					sResult += m_oGdRefX->ToString();
					sResult += _T("\" ");
				}

				if ( m_oMinX.IsInit() )
				{
					sResult += _T("minX=\"");
					sResult += m_oMinX->ToString();
					sResult += _T("\" ");
				}

				if ( m_oMaxX.IsInit() )
				{
					sResult += _T("maxX=\"");
					sResult += m_oMaxX->ToString();
					sResult += _T("\" ");
				}

				if ( m_oGdRefY.IsInit() )
				{
					sResult += _T("gdRefY=\"");
					sResult += m_oGdRefY->ToString();
					sResult += _T("\" ");
				}

				if ( m_oMinY.IsInit() )
				{
					sResult += _T("minY=\"");
					sResult += m_oMinY->ToString();
					sResult += _T("\" ");
				}

				if ( m_oMaxY.IsInit() )
				{
					sResult += _T("maxY=\"");
					sResult += m_oMaxY->ToString();
					sResult += _T("\" ");
				}

				sResult += _T(">");

				sResult += m_oPos.toXML();

				sResult += _T("</a:ahXY>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_ahXY;
			}
		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("gdRefX"), m_oGdRefX )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("gdRefY"), m_oGdRefY )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("maxX"),   m_oMaxX )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("maxY"),   m_oMaxY )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("minX"),   m_oMinX )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("minY"),   m_oMinY )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			
			nullable<SimpleTypes::CGeomGuideName>   m_oGdRefX;
			nullable<SimpleTypes::CGeomGuideName>   m_oGdRefY;
			nullable<SimpleTypes::CAdjCoordinate<>> m_oMaxX;
			nullable<SimpleTypes::CAdjCoordinate<>> m_oMaxY;
			nullable<SimpleTypes::CAdjCoordinate<>> m_oMinX;
			nullable<SimpleTypes::CAdjCoordinate<>> m_oMinY;

			
			OOX::Drawing::CAdjPoint2D               m_oPos;

		};
		
		
		
		class CPath2DArcTo : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CPath2DArcTo)
			CPath2DArcTo()
			{
			}
			virtual ~CPath2DArcTo()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader ); 

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<a:arcTo wR=\"")    + m_oWr.ToString()
					                  + _T("\" hR=\"")    + m_oHr.ToString()
					                  + _T("\" stAng=\"") + m_oStAng.ToString() 
						              + _T("\" swAng=\"") + m_oSwAng.ToString()
						              + _T("\"/>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_arcTo;
			}
		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("hR"),    m_oHr )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("stAng"), m_oStAng )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("swAng"), m_oSwAng )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("wR"),    m_oWr )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			
			SimpleTypes::CAdjCoordinate<> m_oHr;
			SimpleTypes::CAdjAngle<>      m_oStAng;
			SimpleTypes::CAdjAngle<>      m_oSwAng;
			SimpleTypes::CAdjCoordinate<> m_oWr;
		};
		
		
		
		class CPath2DClose : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CPath2DClose)
			CPath2DClose()
			{
			}
			virtual ~CPath2DClose()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}
			virtual CString      toXML() const
			{
				return _T("<a:close/>");;
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_close;
			}
		};
		
		
		
		class CPath2DCubicBezierTo : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CPath2DCubicBezierTo)
			CPath2DCubicBezierTo()
			{
			}
			virtual ~CPath2DCubicBezierTo()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				if ( oReader.IsEmptyNode() )
					return;

				int nPtCount = 0;

				int nCurDepth = oReader.GetDepth();
				while ( oReader.ReadNextSiblingNode( nCurDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();

					if ( 0 == nPtCount && _T("a:pt") == sName )
					{
						m_oCtrl1 = oReader;
						nPtCount++;
					}
					else if ( 1 == nPtCount && _T("a:pt") == sName )
					{
						m_oCtrl2 = oReader;
						nPtCount++;
					}
					else if ( 2 == nPtCount && _T("a:pt") == sName )
					{
						m_oEnd = oReader;
						nPtCount++;
					}
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<a:cubicBezTo>");

				sResult += m_oCtrl1.toXML();
				sResult += m_oCtrl2.toXML();
				sResult += m_oEnd.toXML();

				sResult += _T("</a:cubicBezTo>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_cubicBezTo;
			}

		public:

			OOX::Drawing::CAdjPoint2D m_oCtrl1;
			OOX::Drawing::CAdjPoint2D m_oCtrl2;
			OOX::Drawing::CAdjPoint2D m_oEnd;

		};
		
		
		
		class CConnectionSite : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CConnectionSite)
			CConnectionSite()
			{
			}
			virtual ~CConnectionSite()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( oReader.IsEmptyNode() )
					return;

				int nCurDepth = oReader.GetDepth();
				while ( oReader.ReadNextSiblingNode( nCurDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();

					if ( _T("a:pos") == sName )
						m_oPos = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<a:cxn ang=\"") + m_oAng.ToString() + _T("\">");
				sResult += m_oPos.toXML();
				sResult += _T("</a:cxn>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_cxn;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_ReadSingle( oReader, _T("ang"), m_oAng )
				WritingElement_ReadAttributes_End( oReader )
			}
		public:

			
			SimpleTypes::CAdjAngle<>  m_oAng;

			
			OOX::Drawing::CAdjPoint2D m_oPos;
		};
		
		
		
		class CConnectionSiteList : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CConnectionSiteList)
			CConnectionSiteList()
			{
			}
			virtual ~CConnectionSiteList()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				if ( oReader.IsEmptyNode() )
					return;

				int nCurDepth = oReader.GetDepth();
				while ( oReader.ReadNextSiblingNode( nCurDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();

					if ( _T("a:cxn") == sName )
					{
						OOX::Drawing::CConnectionSite oCxn = oReader;
						m_arrCxn.Add( oCxn );
					}
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<a:cxnLst>");

				for ( int nIndex = 0; nIndex < m_arrCxn.GetSize(); nIndex++ )
					sResult += m_arrCxn[nIndex].toXML();

				sResult += _T("</a:cxnLst>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_cxnLst;
			}

		public:

			
			CSimpleArray<OOX::Drawing::CConnectionSite> m_arrCxn;
		};
		
		
		
		class CGeomGuide : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CGeomGuide)
			CGeomGuide()
			{
			}
			virtual ~CGeomGuide()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader ); 

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<a:gd name=\"") + m_oName.ToString() + _T("\" fmla=\"") + m_oFmla.ToString() + _T("\"/>");
				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_gd;
			}
		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("fmla"), m_oFmla )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("name"), m_oName )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			
			SimpleTypes::CGeomGuideFormula m_oFmla;
			SimpleTypes::CGeomGuideName    m_oName;

		};
		
		
		
		class CGeomGuideList : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CGeomGuideList)
			CGeomGuideList()
			{
				m_eType = et_Unknown;
			}
			virtual ~CGeomGuideList()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				m_eType = et_Unknown;
				
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				m_eType = et_Unknown;
				CWCharWrapper sName = oReader.GetName();

				if ( _T("a:avLst") == sName )
					m_eType = et_a_avLst;
				else if ( _T("a:gdLst") == sName )
					m_eType = et_a_gdLst;
				else
					return;

				if ( oReader.IsEmptyNode() )
					return;

				int nCurDepth = oReader.GetDepth();
				while ( oReader.ReadNextSiblingNode( nCurDepth ) )
				{
					sName = oReader.GetName();

					if ( _T("a:gd") == sName )
					{
						OOX::Drawing::CGeomGuide oGd = oReader;
						m_arrGd.Add( oGd );
					}
				}
			}
			virtual CString      toXML() const
			{
				CString sResult;
				
				if ( et_a_avLst == m_eType )
					sResult = _T("<a:avLst>");
				else if ( et_a_gdLst == m_eType )
					sResult = _T("<a:gdLst>");
				else 
					return _T("");
									

				for ( int nIndex = 0; nIndex < m_arrGd.GetSize(); nIndex++ )
					sResult += m_arrGd[nIndex].toXML();

				if ( et_a_avLst == m_eType )
					sResult += _T("</a:avLst>");
				else if ( et_a_gdLst == m_eType )
					sResult += _T("</a:gdLst>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return m_eType;
			}

		public:

			EElementType                           m_eType;

			
			CSimpleArray<OOX::Drawing::CGeomGuide> m_arrGd;
		};
		
		
		
		class CPath2DLineTo : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CPath2DLineTo)
			CPath2DLineTo()
			{
			}
			virtual ~CPath2DLineTo()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				if ( oReader.IsEmptyNode() )
					return;

				int nCurDepth = oReader.GetDepth();
				while ( oReader.ReadNextSiblingNode( nCurDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();

					if ( _T("a:pt") == sName )
						m_oPt = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<a:lnTo>");
				sResult += m_oPt.toXML();
				sResult += _T("</a:lnTo>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_lnTo;
			}

		public:

			OOX::Drawing::CAdjPoint2D m_oPt;

		};
		
		
		
		class CPath2DMoveTo : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CPath2DMoveTo)
			CPath2DMoveTo()
			{
			}
			virtual ~CPath2DMoveTo()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				if ( oReader.IsEmptyNode() )
					return;

				int nCurDepth = oReader.GetDepth();
				while ( oReader.ReadNextSiblingNode( nCurDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();

					if ( _T("a:pt") == sName )
						m_oPt = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<a:moveTo>");
				sResult += m_oPt.toXML();
				sResult += _T("</a:moveTo>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_moveTo;
			}

		public:

			OOX::Drawing::CAdjPoint2D m_oPt;

		};
		
		
		
		class CPath2DQuadBezierTo : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CPath2DQuadBezierTo)
			CPath2DQuadBezierTo()
			{
			}
			virtual ~CPath2DQuadBezierTo()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				if ( oReader.IsEmptyNode() )
					return;

				int nPtCount = 0;

				int nCurDepth = oReader.GetDepth();
				while ( oReader.ReadNextSiblingNode( nCurDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();

					if ( 0 == nPtCount && _T("a:pt") == sName )
					{
						m_oCtrl = oReader;
						nPtCount++;
					}
					else if ( 1 == nPtCount && _T("a:pt") == sName )
					{
						m_oEnd = oReader;
						nPtCount++;
					}
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<a:quadBezTo>");

				sResult += m_oCtrl.toXML();
				sResult += m_oEnd.toXML();

				sResult += _T("</a:quadBezTo>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_quadBezTo;
			}

		public:

			OOX::Drawing::CAdjPoint2D m_oCtrl;
			OOX::Drawing::CAdjPoint2D m_oEnd;

		};
		
		
		
		class CPath2D : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CPath2D)
			CPath2D()
			{
			}
			CPath2D(const CPath2D& oOther)
			{
				m_oExtrusionOk = oOther.m_oExtrusionOk;
				m_oFill        = oOther.m_oFill;
				m_oH           = oOther.m_oH;
				m_oStroke      = oOther.m_oStroke;
				m_oW           = oOther.m_oW;

				for ( int nIndex = 0; nIndex < oOther.m_arrItems.GetSize(); nIndex++ )
				{
					OOX::EElementType eType = oOther.m_arrItems[nIndex]->getType();

					WritingElement *pItem = NULL;
					switch ( eType )
					{
					case et_a_arcTo:      pItem = new CPath2DArcTo        ( (const CPath2DArcTo&) *oOther.m_arrItems[nIndex] ); break;
					case et_a_close:      pItem = new CPath2DClose        ( (const CPath2DClose&) *oOther.m_arrItems[nIndex] ); break;
					case et_a_cubicBezTo: pItem = new CPath2DCubicBezierTo( (const CPath2DCubicBezierTo&) *oOther.m_arrItems[nIndex] ); break;
					case et_a_lnTo:       pItem = new CPath2DLineTo       ( (const CPath2DLineTo&) *oOther.m_arrItems[nIndex] ); break;
					case et_a_moveTo:     pItem = new CPath2DMoveTo       ( (const CPath2DMoveTo&) *oOther.m_arrItems[nIndex] ); break;
					case et_a_quadBezTo:  pItem = new CPath2DQuadBezierTo ( (const CPath2DQuadBezierTo&) *oOther.m_arrItems[nIndex] ); break;
					}

					if ( NULL != pItem )
						m_arrItems.Add( pItem );
				}
			}
			virtual ~CPath2D()
			{
				Clear();
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader ); 

				if ( oReader.IsEmptyNode() )
					return;

				int nCurDepth = oReader.GetDepth();
				while ( oReader.ReadNextSiblingNode( nCurDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();
					WritingElement* pItem = NULL;

					if ( _T("a:arcTo") == sName )
						pItem = new CPath2DArcTo( oReader );
					else if ( _T("a:close") == sName )
						pItem = new CPath2DClose( oReader );
					else if ( _T("a:cubicBezTo") == sName )
						pItem = new CPath2DCubicBezierTo( oReader );
					else if ( _T("a:lnTo") == sName )
						pItem = new CPath2DLineTo( oReader );
					else if ( _T("a:moveTo") == sName )
						pItem = new CPath2DMoveTo( oReader );
					else if ( _T("a:quadBezTo") == sName )
						pItem = new CPath2DQuadBezierTo( oReader );

					if ( pItem )
						m_arrItems.Add( pItem );
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<a:path w=\"") + m_oW.ToString() 
					                 + _T("\" h=\"") + m_oH.ToString()
									 + _T("\" fill=\"") + m_oFill.ToString() 
									 + _T("\" stroke=\"") + m_oStroke.ToString() 
									 + _T("\" extrusionOk=\"") + m_oExtrusionOk.ToString() 
									 + _T("\">");

				for ( int nIndex = 0; nIndex < m_arrItems.GetSize(); nIndex++ )
				{
					if ( m_arrItems[nIndex] )
						sResult += m_arrItems[nIndex]->toXML();
				}

				sResult += _T("</a:path>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_path;
			}
		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("extrusionOk"), m_oExtrusionOk )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("fill"),        m_oFill )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("h"),           m_oH )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("stroke"),      m_oStroke )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w"),           m_oW )
				WritingElement_ReadAttributes_End( oReader )
			}


		public:

			void Clear()
			{
				for ( int nIndex = 0; nIndex < m_arrItems.GetSize(); nIndex++ )
				{
					if ( m_arrItems[nIndex] )
						delete m_arrItems[nIndex];

					m_arrItems[nIndex] = NULL;
				}

				m_arrItems.RemoveAll();
			}

		public:

			
			SimpleTypes::COnOff<SimpleTypes::onoffTrue>               m_oExtrusionOk;
			SimpleTypes::CPathFillMode<SimpleTypes::pathfillmodeNorm> m_oFill;
			SimpleTypes::CPositiveCoordinate<0>                       m_oH;
			SimpleTypes::COnOff<SimpleTypes::onoffTrue>               m_oStroke;
			SimpleTypes::CPositiveCoordinate<0>                       m_oW;

			
			CSimpleArray<WritingElement*>                             m_arrItems;

		};
		
		
		
		class CPath2DList : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CPath2DList)
			CPath2DList()
			{
			}
			virtual ~CPath2DList()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				if ( oReader.IsEmptyNode() )
					return;

				int nCurDepth = oReader.GetDepth();
				while ( oReader.ReadNextSiblingNode( nCurDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();

					if ( _T("a:path") == sName )
					{
						OOX::Drawing::CPath2D oPath = oReader;
						m_arrPath.Add( oPath );
					}
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<a:pathLst>");

				for ( int nIndex = 0; nIndex < m_arrPath.GetSize(); nIndex++ )
					sResult += m_arrPath[nIndex].toXML();

				sResult += _T("</a:pathLst>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_pathLst;
			}

		public:

			
			CSimpleArray<OOX::Drawing::CPath2D> m_arrPath;
		};
		
		
		
		class CAdjustHandleList : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CAdjustHandleList)
			CAdjustHandleList()
			{
			}
			CAdjustHandleList(const CAdjustHandleList& oOther)
			{
				for ( int nIndex = 0; nIndex < oOther.m_arrItems.GetSize(); nIndex++ )
				{
					OOX::EElementType eType = oOther.m_arrItems[nIndex]->getType();

					WritingElement *pItem = NULL;
					switch ( eType )
					{
					case et_a_ahPolar: pItem = new CPolarAdjustHandle( (const CPolarAdjustHandle&) *oOther.m_arrItems[nIndex] ); break;
					case et_a_ahXY:    pItem = new CXYAdjustHandle   ( (const CXYAdjustHandle&) *oOther.m_arrItems[nIndex] ); break;
					}

					if ( NULL != pItem )
						m_arrItems.Add( pItem );
				}

			}
			virtual ~CAdjustHandleList()
			{
				Clear();
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				if ( oReader.IsEmptyNode() )
					return;

				int nCurDepth = oReader.GetDepth();
				while ( oReader.ReadNextSiblingNode( nCurDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();

					WritingElement* pElement = NULL;

					if ( _T("a:ahPolar") == sName )
						pElement = new CPolarAdjustHandle( oReader );
					else if ( _T("a:ahXY") == sName )  
						pElement = new CXYAdjustHandle( oReader );

					if ( pElement )
						m_arrItems.Add( pElement );
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<a:ahLst>");

				for ( int nIndex = 0; nIndex < m_arrItems.GetSize(); nIndex++ )
				{
					if ( m_arrItems[nIndex] )
						sResult += m_arrItems[nIndex]->toXML();
				}

				sResult += _T("</a:ahLst>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_ahLst;
			}


		public:

			void Clear()
			{
				for ( int nIndex = 0; nIndex < m_arrItems.GetSize(); nIndex++ )
				{
					if ( m_arrItems[nIndex] )
						delete m_arrItems[nIndex];

					m_arrItems[nIndex] = NULL;
				}

				m_arrItems.RemoveAll();
			}

		public:

			
			CSimpleArray<WritingElement*> m_arrItems;
		};
		
		
		
		class CPresetGeometry2D : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CPresetGeometry2D)
			CPresetGeometry2D()
			{
			}
			virtual ~CPresetGeometry2D()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader ); 

				if ( oReader.IsEmptyNode() )
					return;

				int nCurDepth = oReader.GetDepth();
				while ( oReader.ReadNextSiblingNode( nCurDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();
					WritingElement* pItem = NULL;

					if ( _T("a:avLst") == sName )
						m_oAvLst = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<a:prstGeom prst=\"") + m_oPrst.ToString() + _T("\">");

				if ( m_oAvLst.IsInit() )
					sResult += m_oAvLst->toXML();

				sResult += _T("</a:prstGeom>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_prstGeom;
			}
		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_ReadSingle( oReader, _T("prst"), m_oPrst )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			
			SimpleTypes::CShapeType<>              m_oPrst;

			
			nullable<OOX::Drawing::CGeomGuideList> m_oAvLst;

		};
		
		
		
		class CPresetTextShape : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CPresetTextShape)
			CPresetTextShape()
			{
			}
			virtual ~CPresetTextShape()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader ); 

				if ( oReader.IsEmptyNode() )
					return;

				int nCurDepth = oReader.GetDepth();
				while ( oReader.ReadNextSiblingNode( nCurDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();
					WritingElement* pItem = NULL;

					if ( _T("a:avLst") == sName )
						m_oAvLst = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<a:prstTxWarp prst=\"") + m_oPrst.ToString() + _T("\">");

				if ( m_oAvLst.IsInit() )
					sResult += m_oAvLst->toXML();

				sResult += _T("</a:prstTxWarp>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_prstTxWarp;
			}
		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_ReadSingle( oReader, _T("prst"), m_oPrst )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			
			SimpleTypes::CTextShapeType<>          m_oPrst;

			
			nullable<OOX::Drawing::CGeomGuideList> m_oAvLst;

		};
		
		
		
		class CGeomRect : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CGeomRect)
			CGeomRect()
			{
			}
			virtual ~CGeomRect()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader ); 

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<a:rect l=\"") + m_oL.ToString() 
					                 + _T("\" t=\"") + m_oT.ToString() 
					                + _T("\" r=\"") + m_oR.ToString() 
					                + _T("\" b=\"") + m_oB.ToString() 
					                + _T("\"/>");
				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_rect;
			}
		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("b"), m_oB )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("l"), m_oL )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("r"), m_oR )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("t"), m_oT )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			
			SimpleTypes::CAdjCoordinate<> m_oB;
			SimpleTypes::CAdjCoordinate<> m_oL;
			SimpleTypes::CAdjCoordinate<> m_oR;
			SimpleTypes::CAdjCoordinate<> m_oT;

		};
		
		
		
		class CCustomGeometry2D : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CCustomGeometry2D)
			CCustomGeometry2D()
			{
			}
			virtual ~CCustomGeometry2D()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				if ( oReader.IsEmptyNode() )
					return;

				int nCurDepth = oReader.GetDepth();
				while ( oReader.ReadNextSiblingNode( nCurDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();

					if ( _T("a:ahLst") == sName )
						m_oAhLst = oReader;
					else if ( _T("a:avLst") == sName )  
						m_oAvLst = oReader;
					else if ( _T("a:cxnLst") == sName )  
						m_oCnxLst = oReader;
					else if ( _T("a:gdLst") == sName )  
						m_oGdLst = oReader;
					else if ( _T("a:pathLst") == sName )  
						m_oPthLst = oReader;
					else if ( _T("a:rect") == sName )  
						m_oRect = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<a:custGeom>");

				if ( m_oAvLst.IsInit() )
					sResult += m_oAvLst->toXML();

				if ( m_oGdLst.IsInit() )
					sResult += m_oGdLst->toXML();

				if ( m_oAhLst.IsInit() )
					sResult += m_oAhLst->toXML();

				if ( m_oCnxLst.IsInit() )
					sResult += m_oCnxLst->toXML();

				if ( m_oRect.IsInit() )
					sResult += m_oRect->toXML();

				sResult += m_oPthLst.toXML();

				sResult += _T("</a:custGeom>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_custGeom;
			}

		public:

			
			nullable<OOX::Drawing::CAdjustHandleList  > m_oAhLst;
			nullable<OOX::Drawing::CGeomGuideList     > m_oAvLst;
			nullable<OOX::Drawing::CConnectionSiteList> m_oCnxLst;
			nullable<OOX::Drawing::CGeomGuideList     > m_oGdLst;
			nullable<OOX::Drawing::CGeomRect          > m_oRect;
			OOX::Drawing::CPath2DList                   m_oPthLst;
		};
	} 
} 

#endif // OOX_LOGIC_DRAWING_SHAPE_INCLUDE_H_