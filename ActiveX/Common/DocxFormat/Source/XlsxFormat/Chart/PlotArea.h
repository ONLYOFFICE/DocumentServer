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
#ifndef OOX_CHARTPLOTAREA_FILE_INCLUDE_H_
#define OOX_CHARTPLOTAREA_FILE_INCLUDE_H_

#include "../CommonInclude.h"
#include "Title.h"
#include "BasicChart.h"

namespace OOX
{
	namespace Spreadsheet
	{
		class CChartCatAx : public WritingElement
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CChartCatAx)
			CChartCatAx() {}
			virtual ~CChartCatAx() {}

		public:
			virtual CString      toXML() const
			{
				return _T("");
			}
			virtual void toXML(CStringWriter& writer) const
			{
			}
			void toXML2(CString& sDelete, CString& sMajorGrid, CString& sAxTitle, CString& sTxPr) const
			{
				if(m_oDelete.IsInit())
					sDelete.Format(_T("<c:delete val=\"%s\"/>"), m_oDelete->m_oVal.ToString2(SimpleTypes::onofftostring1));
				if(m_oAxPos.IsInit())
				{
					CString sAxPos;
					sAxPos.Format(_T("<c:axPos %s/>"), m_oAxPos->ToString());
				}
				if(m_oMajorGridlines.IsInit() && true == m_oMajorGridlines->ToBool())
					sMajorGrid = _T("<c:majorGridlines/>");
				if(m_oTitle.IsInit())
				{
					CStringWriter temp;
					m_oTitle->toXML(temp);
					sAxTitle = temp.GetCString();
				}

				
				
				
				
				if(m_oTxPr.IsInit() && m_oTxPr->m_oXml.IsInit())
				{
					sTxPr = m_oTxPr->m_oXml.get();
				}
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

					if ( _T("c:title") == sName )
						m_oTitle = oReader;
					else if ( _T("c:delete") == sName )
						m_oDelete = oReader;
					else if ( _T("c:majorGridlines") == sName )
					{
						m_oMajorGridlines.Init();
						m_oMajorGridlines->SetValue(SimpleTypes::onoffTrue);
					}
					else if ( _T("c:axPos") == sName )
						m_oAxPos = oReader;
					else if ( _T("c:numFmt") == sName )
						m_oNumFmt = oReader;
					else if ( _T("c:txPr") == sName )
						m_oTxPr = oReader;
				}
			}
			virtual EElementType getType() const
			{
				return et_c_CatAx;
			}
		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
			}

		public:
			nullable<CChartTitle> m_oTitle;
			nullable<ComplexTypes::Spreadsheet::COnOff2<>> m_oDelete;
			nullable<SimpleTypes::COnOff<>> m_oMajorGridlines;
			nullable<ComplexTypes::Spreadsheet::CChartAxPos> m_oAxPos;
			nullable<OOX::Spreadsheet::CNumFmt> m_oNumFmt;
			nullable<OOX::Spreadsheet::CChartRich> m_oTxPr;
		};
		class CChartPlotArea : public WritingElementWithChilds<CChartCatAx>
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CChartPlotArea)
			CChartPlotArea()
			{
			}
			virtual ~CChartPlotArea()
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
			void toXML2(bool bScatter, bool bLine, CString& sBarDir, CString& sGrouping, CString& sSeries, CString& sDataLabels, CString& sOverlap, CString& sCatAxDelete, CString& sCatAxMajorGrid, CString& sCatAxTitle, CString& sCatTxPr, CString& sValAxDelete, CString& sValAxMajorGrid, CString& sValAxTitle, CString& sValTxPr) const
			{
				if(m_oBasicChart.IsInit())
					m_oBasicChart->toXML2(bScatter, bLine, sBarDir, sGrouping, sSeries, sDataLabels, sOverlap);
				if(m_oCatAx.IsInit())
				{
					m_oCatAx->toXML2(sCatAxDelete, sCatAxMajorGrid, sCatAxTitle, sCatTxPr);
					if(m_arrItems.GetSize() > 0)
						m_arrItems[0]->toXML2(sValAxDelete, sValAxMajorGrid, sValAxTitle, sValTxPr);
				}
				else
				{
					if(m_arrItems.GetSize() > 0)
						m_arrItems[0]->toXML2(sCatAxDelete, sCatAxMajorGrid, sCatAxTitle, sCatTxPr);
					if(m_arrItems.GetSize() > 1)
						m_arrItems[1]->toXML2(sValAxDelete, sValAxMajorGrid, sValAxTitle, sValTxPr);
				}
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

					if ( _T("c:barChart") == sName )
					{
						m_oBasicChart = oReader;
						m_oBasicChart->setBasicType(OOX::Spreadsheet::chartbasicBarChart);
					}
					else if ( _T("c:bar3DChart") == sName )
					{
						m_oBasicChart = oReader;
						m_oBasicChart->setBasicType(OOX::Spreadsheet::chartbasicBar3DChart);
					}
					else if ( _T("c:lineChart") == sName )
					{
						m_oBasicChart = oReader;
						m_oBasicChart->setBasicType(OOX::Spreadsheet::chartbasicLineChart);
					}
					else if ( _T("c:line3DChart") == sName )
					{
						m_oBasicChart = oReader;
						m_oBasicChart->setBasicType(OOX::Spreadsheet::chartbasicLine3DChart);
					}
					else if ( _T("c:areaChart") == sName )
					{
						m_oBasicChart = oReader;
						m_oBasicChart->setBasicType(OOX::Spreadsheet::chartbasicAreaChart);
					}
					else if ( _T("c:area3DChart") == sName )
					{
						m_oBasicChart = oReader;
						m_oBasicChart->setBasicType(OOX::Spreadsheet::chartbasicArea3DChart);
					}
					else if ( _T("c:pieChart") == sName )
					{
						m_oBasicChart = oReader;
						m_oBasicChart->setBasicType(OOX::Spreadsheet::chartbasicPieChart);
					}
					else if ( _T("c:pie3DChart") == sName )
					{
						m_oBasicChart = oReader;
						m_oBasicChart->setBasicType(OOX::Spreadsheet::chartbasicPie3DChart);
					}
					else if ( _T("c:bubbleChart") == sName )
					{
						m_oBasicChart = oReader;
						m_oBasicChart->setBasicType(OOX::Spreadsheet::chartbasicBubbleChart);
					}
					else if ( _T("c:scatterChart") == sName )
					{
						m_oBasicChart = oReader;
						m_oBasicChart->setBasicType(OOX::Spreadsheet::chartbasicScatterChart);
					}
					else if ( _T("c:radarChart") == sName )
					{
						m_oBasicChart = oReader;
						m_oBasicChart->setBasicType(OOX::Spreadsheet::chartbasicRadarChart);
					}
					else if ( _T("c:doughnutChart") == sName )
					{
						m_oBasicChart = oReader;
						m_oBasicChart->setBasicType(OOX::Spreadsheet::chartbasicDoughnutChart);
					}
					else if ( _T("c:stockChart") == sName )
					{
						m_oBasicChart = oReader;
						m_oBasicChart->setBasicType(OOX::Spreadsheet::chartbasicStockChart);
					}
					else if ( _T("c:surfaceChart") == sName )
					{
						m_oBasicChart = oReader;
						m_oBasicChart->setBasicType(OOX::Spreadsheet::chartbasicSurfaceChart);
					}
					else if ( _T("c:surface3DChart") == sName )
					{
						m_oBasicChart = oReader;
						m_oBasicChart->setBasicType(OOX::Spreadsheet::chartbasicSurface3DChart);
					}
					else if ( _T("c:catAx") == sName || _T("c:dateAx") == sName )
						m_oCatAx = oReader;
					else if ( _T("c:valAx") == sName )
						m_arrItems.Add( new CChartCatAx(oReader));
					else if ( _T("c:serAx") == sName )
						m_oSerAx = oReader;
				}
			}

			virtual EElementType getType () const
			{
				return et_c_PlotArea;
			}

		private:
			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
			}
		public:
			nullable<CChartCatAx>		m_oCatAx;
			nullable<CChartCatAx>		m_oSerAx;
			nullable<CChartBasicChart>	m_oBasicChart;
		};
	} 
} 

#endif // OOX_CHARTPLOTAREA_FILE_INCLUDE_H_