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
#ifndef OOX_GRAPHICFRAME_FILE_INCLUDE_H_
#define OOX_GRAPHICFRAME_FILE_INCLUDE_H_

#include "../CommonInclude.h"

namespace OOX
{
	namespace Spreadsheet
	{
		class CGraphicChart : public WritingElement
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CGraphicChart)
			CGraphicChart()
			{
			}
			virtual ~CGraphicChart()
			{
			}

		public:
			virtual CString      toXML() const
			{
				return _T("");
			}
			virtual void toXML(CStringWriter& writer) const
			{
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}

			virtual EElementType getType () const
			{
				return et_Blip;
			}

		private:
			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )

					WritingElement_ReadAttributes_Read_if     ( oReader, _T("r:id"),      m_oRId )

					WritingElement_ReadAttributes_End( oReader )
			}
		public:
			nullable<SimpleTypes::CRelationshipId>				m_oRId;
		};
		class CGraphicData : public WritingElement
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CGraphicData)
			CGraphicData()
			{
			}
			virtual ~CGraphicData()
			{
			}

		public:
			virtual CString      toXML() const
			{
				return _T("");
			}
			virtual void toXML(CStringWriter& writer) const
			{
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( oReader.IsEmptyNode() )
					return;

				int nCurDepth = oReader.GetDepth();
				while( oReader.ReadNextSiblingNode( nCurDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();

					if ( _T("c:chart") == sName )
						m_oChart = oReader;
				}
			}

			virtual EElementType getType () const
			{
				return et_xdr_GraphicData;
			}

		private:
			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
			}
		public:
			nullable<CGraphicChart>		m_oChart;
		};
		class CChartGraphic : public WritingElement
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CChartGraphic)
			CChartGraphic()
			{
			}
			virtual ~CChartGraphic()
			{
			}

		public:
			virtual CString      toXML() const
			{
				return _T("");
			}
			virtual void toXML(CStringWriter& writer) const
			{
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( oReader.IsEmptyNode() )
					return;

				int nCurDepth = oReader.GetDepth();
				while( oReader.ReadNextSiblingNode( nCurDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();

					if ( _T("a:graphicData") == sName )
						m_oGraphicData = oReader;
				}
			}

			virtual EElementType getType () const
			{
				return et_xdr_GraphicFrame;
			}

		private:
			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
			}
		public:
			nullable<CGraphicData>		m_oGraphicData;
		};
		class CGraphicFrame : public WritingElement
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CGraphicFrame)
			CGraphicFrame()
			{
			}
			virtual ~CGraphicFrame()
			{
			}

		public:
			virtual CString      toXML() const
			{
				return _T("");
			}
			virtual void toXML(CStringWriter& writer) const
			{
				CString sRes;
				if(m_oChartGraphic.IsInit() && m_oChartGraphic->m_oGraphicData.IsInit() && m_oChartGraphic->m_oGraphicData->m_oChart.IsInit() && m_oChartGraphic->m_oGraphicData->m_oChart->m_oRId.IsInit())
					sRes.Format(_T("<xdr:graphicFrame macro=\"\"><xdr:nvGraphicFramePr><xdr:cNvPr id=\"1\" name=\"diagram\"/><xdr:cNvGraphicFramePr/></xdr:nvGraphicFramePr><xdr:xfrm><a:off x=\"0\" y=\"0\"/><a:ext cx=\"0\" cy=\"0\"/></xdr:xfrm><a:graphic><a:graphicData uri=\"http://schemas.openxmlformats.org/drawingml/2006/chart\"><c:chart xmlns:c=\"http://schemas.openxmlformats.org/drawingml/2006/chart\" xmlns:r=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships\" r:id=\"%s\"/></a:graphicData></a:graphic></xdr:graphicFrame><xdr:clientData/>"), m_oChartGraphic->m_oGraphicData->m_oChart->m_oRId->ToString());
				writer.WriteStringC(sRes);
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				if ( oReader.IsEmptyNode() )
					return;

				m_sXml.Init();
				m_sXml->Append(oReader.GetOuterXml());
				CString sXml;
				sXml.Format(_T("<root xmlns:xdr=\"http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing\" xmlns:a=\"http://schemas.openxmlformats.org/drawingml/2006/main\">%s</root>"), m_sXml.get());
				XmlUtils::CXmlLiteReader oSubReader;
				oSubReader.FromString(sXml);
				oSubReader.ReadNextNode();
				oSubReader.ReadNextNode();

				int nCurDepth = oSubReader.GetDepth();
				while( oSubReader.ReadNextSiblingNode( nCurDepth ) )
				{
					CWCharWrapper sName = oSubReader.GetName();

					if ( _T("a:graphic") == sName )
						m_oChartGraphic = oSubReader;
				}
			}

			virtual EElementType getType () const
			{
				return et_xdr_GraphicFrame;
			}

		private:
			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
			}
		public:
			nullable<CChartGraphic>		m_oChartGraphic;
			nullable<CString> m_sXml;
		};
	} 
} 

#endif // OOX_GRAPHICFRAME_FILE_INCLUDE_H_