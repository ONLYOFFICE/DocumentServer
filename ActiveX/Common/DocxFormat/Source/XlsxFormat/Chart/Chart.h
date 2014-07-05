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
#ifndef OOX_CHART_FILE_INCLUDE_H_
#define OOX_CHART_FILE_INCLUDE_H_

#include "../CommonInclude.h"

#include "Title.h"
#include "Legend.h"
#include "PlotArea.h"
#include "ChartStyle.h"
#include "../../DocxFormat/Logic/AlternateContent.h"

namespace OOX
{
	namespace Spreadsheet
	{
		static TCHAR* gc_sChartArea = _T("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><c:chartSpace xmlns:a=\"http://schemas.openxmlformats.org/drawingml/2006/main\" xmlns:c=\"http://schemas.openxmlformats.org/drawingml/2006/chart\" xmlns:r=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships\"><c:lang val=\"en-US\"/><c:roundedCorners val=\"0\"/>%s<c:chart>%s<c:plotArea><c:layout/><c:areaChart><c:varyColors val=\"0\"/>%s%s%s<c:dLbls><c:showLegendKey val=\"0\"/>%s<c:showSerName val=\"0\"/><c:showPercent val=\"0\"/><c:showBubbleSize val=\"0\"/></c:dLbls><c:axId val=\"7622\"/><c:axId val=\"5026\"/></c:areaChart><c:catAx><c:axId val=\"7622\"/><c:scaling><c:orientation val=\"minMax\"/></c:scaling>%s%s%s<c:axPos val=\"b\"/><c:majorTickMark val=\"out\"/><c:minorTickMark val=\"none\"/><c:tickLblPos val=\"nextTo\"/>%s<c:crossAx val=\"5026\"/><c:crossesAt val=\"0\"/><c:lblAlgn val=\"ctr\"/><c:auto val=\"1\"/><c:lblOffset val=\"100\"/></c:catAx><c:valAx><c:axId val=\"5026\"/><c:scaling><c:orientation val=\"minMax\"/></c:scaling>%s%s%s<c:axPos val=\"l\"/><c:majorTickMark val=\"out\"/><c:minorTickMark val=\"none\"/><c:tickLblPos val=\"nextTo\"/>%s<c:crossAx val=\"7622\"/><c:crossesAt val=\"0\"/></c:valAx></c:plotArea>%s<c:plotVisOnly val=\"1\"/></c:chart>%s</c:chartSpace>");
		static TCHAR* gc_sChartLine = _T("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><c:chartSpace xmlns:a=\"http://schemas.openxmlformats.org/drawingml/2006/main\" xmlns:c=\"http://schemas.openxmlformats.org/drawingml/2006/chart\" xmlns:r=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships\"><c:lang val=\"en-US\"/><c:roundedCorners val=\"0\"/>%s<c:chart>%s<c:plotArea><c:layout/><c:lineChart><c:varyColors val=\"0\"/>%s%s%s<c:dLbls><c:dLblPos val=\"t\"/><c:showLegendKey val=\"0\"/>%s<c:showSerName val=\"0\"/><c:showPercent val=\"0\"/><c:showBubbleSize val=\"0\"/></c:dLbls><c:marker val=\"1\"/><c:axId val=\"3375\"/><c:axId val=\"13466\"/></c:lineChart><c:catAx><c:axId val=\"3375\"/><c:scaling><c:orientation val=\"minMax\"/></c:scaling>%s%s%s<c:axPos val=\"b\"/><c:majorTickMark val=\"out\"/><c:minorTickMark val=\"none\"/><c:tickLblPos val=\"nextTo\"/>%s<c:crossAx val=\"13466\"/><c:crossesAt val=\"0\"/><c:lblAlgn val=\"ctr\"/><c:auto val=\"1\"/><c:lblOffset val=\"100\"/></c:catAx><c:valAx><c:axId val=\"13466\"/><c:scaling><c:orientation val=\"minMax\"/></c:scaling>%s%s%s<c:axPos val=\"l\"/><c:majorTickMark val=\"out\"/><c:minorTickMark val=\"none\"/><c:tickLblPos val=\"nextTo\"/>%s<c:crossAx val=\"3375\"/><c:crossesAt val=\"0\"/></c:valAx></c:plotArea>%s<c:plotVisOnly val=\"1\"/></c:chart>%s</c:chartSpace>");
		static TCHAR* gc_sChartPie = _T("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><c:chartSpace xmlns:a=\"http://schemas.openxmlformats.org/drawingml/2006/main\" xmlns:c=\"http://schemas.openxmlformats.org/drawingml/2006/chart\" xmlns:r=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships\"><c:lang val=\"en-US\"/><c:roundedCorners val=\"0\"/>%s<c:chart>%s<c:plotArea><c:layout/><c:pieChart><c:varyColors val=\"1\"/>%s%s%s<c:dLbls><c:dLblPos val=\"outEnd\"/><c:showLegendKey val=\"0\"/>%s<c:showSerName val=\"0\"/><c:showPercent val=\"0\"/><c:showBubbleSize val=\"0\"/></c:dLbls><c:firstSliceAng val=\"0\"/></c:pieChart></c:plotArea>%s<c:plotVisOnly val=\"1\"/></c:chart>%s</c:chartSpace>");
		static TCHAR* gc_sChartScatter = _T("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><c:chartSpace xmlns:a=\"http://schemas.openxmlformats.org/drawingml/2006/main\" xmlns:c=\"http://schemas.openxmlformats.org/drawingml/2006/chart\" xmlns:r=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships\"><c:lang val=\"en-US\"/><c:roundedCorners val=\"0\"/>%s<c:chart>%s<c:plotArea><c:layout/><c:scatterChart><c:scatterStyle val=\"lineMarker\"/><c:varyColors val=\"0\" />%s%s%s<c:dLbls><c:showLegendKey val=\"0\"/>%s<c:showSerName val=\"0\"/><c:showPercent val=\"0\"/><c:showBubbleSize val=\"0\"/></c:dLbls><c:axId val=\"28581\"/><c:axId val=\"1636\"/></c:scatterChart><c:valAx><c:axId val=\"28581\"/><c:scaling><c:orientation val=\"minMax\"/></c:scaling>%s%s%s<c:axPos val=\"b\"/><c:majorTickMark val=\"out\"/><c:minorTickMark val=\"none\"/><c:tickLblPos val=\"nextTo\"/>%s<c:crossAx val=\"1636\"/><c:crossesAt val=\"0\"/></c:valAx><c:valAx><c:axId val=\"1636\"/><c:scaling><c:orientation val=\"minMax\"/></c:scaling>%s%s%s<c:axPos val=\"l\"/><c:majorTickMark val=\"out\"/><c:minorTickMark val=\"none\"/><c:tickLblPos val=\"nextTo\"/>%s<c:crossAx val=\"28581\"/><c:crossesAt val=\"0\"/></c:valAx></c:plotArea>%s<c:plotVisOnly val=\"1\"/></c:chart>%s</c:chartSpace>");
		static TCHAR* gc_sChartBar = _T("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><c:chartSpace xmlns:a=\"http://schemas.openxmlformats.org/drawingml/2006/main\" xmlns:c=\"http://schemas.openxmlformats.org/drawingml/2006/chart\" xmlns:r=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships\"><c:lang val=\"en-US\"/><c:roundedCorners val=\"0\"/>%s<c:chart>%s<c:plotArea><c:layout/><c:barChart><c:varyColors val=\"0\"/>%s%s%s<c:dLbls>%s<c:showLegendKey val=\"0\"/>%s<c:showSerName val=\"0\"/><c:showPercent val=\"0\"/><c:showBubbleSize val=\"0\"/></c:dLbls><c:gapWidth val=\"100\"/>%s<c:axId val=\"19816\"/><c:axId val=\"31185\"/></c:barChart><c:catAx><c:axId val=\"19816\"/><c:scaling><c:orientation val=\"minMax\"/></c:scaling>%s%s%s<c:axPos val=\"b\"/><c:majorTickMark val=\"out\"/><c:minorTickMark val=\"none\"/><c:tickLblPos val=\"nextTo\"/>%s<c:crossAx val=\"31185\"/><c:crosses val=\"autoZero\"/><c:lblAlgn val=\"ctr\"/><c:auto val=\"1\"/><c:lblOffset val=\"100\"/></c:catAx><c:valAx><c:axId val=\"31185\"/><c:scaling><c:orientation val=\"minMax\"/></c:scaling>%s%s%s<c:axPos val=\"l\"/><c:majorTickMark val=\"out\"/><c:minorTickMark val=\"none\"/><c:tickLblPos val=\"nextTo\"/>%s<c:crossAx val=\"19816\"/><c:crosses val=\"autoZero\"/></c:valAx></c:plotArea>%s<c:plotVisOnly val=\"1\"/></c:chart>%s</c:chartSpace>");
		static TCHAR* gc_sChartStock = _T("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><c:chartSpace xmlns:a=\"http://schemas.openxmlformats.org/drawingml/2006/main\" xmlns:c=\"http://schemas.openxmlformats.org/drawingml/2006/chart\" xmlns:r=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships\"><c:lang val=\"en-US\"/><c:roundedCorners val=\"0\"/>%s<c:chart>%s<c:plotArea><c:layout/><c:stockChart><c:varyColors val=\"0\"/>%s%s%s<c:dLbls><c:showLegendKey val=\"0\"/>%s<c:showSerName val=\"0\"/><c:showPercent val=\"0\"/><c:showBubbleSize val=\"0\"/></c:dLbls><c:hiLowLines/><c:upDownBars><c:gapWidth val=\"150\"/><c:upBars/><c:downBars/></c:upDownBars><c:axId val=\"10364\"/><c:axId val=\"1630\"/></c:stockChart><c:dateAx><c:axId val=\"10364\"/><c:scaling><c:orientation val=\"minMax\"/></c:scaling>%s%s%s<c:axPos val=\"b\"/><c:majorTickMark val=\"out\"/><c:minorTickMark val=\"none\"/><c:tickLblPos val=\"nextTo\"/>%s<c:crossAx val=\"1630\"/><c:crossesAt val=\"0\"/><c:auto val=\"1\"/><c:lblOffset val=\"100\"/></c:dateAx><c:valAx><c:axId val=\"1630\"/><c:scaling><c:orientation val=\"minMax\"/></c:scaling>%s%s%s<c:axPos val=\"l\"/><c:majorTickMark val=\"out\"/><c:minorTickMark val=\"none\"/><c:tickLblPos val=\"nextTo\"/>%s<c:crossAx val=\"10364\"/><c:crossesAt val=\"0\"/></c:valAx></c:plotArea>%s<c:plotVisOnly val=\"1\"/></c:chart>%s</c:chartSpace>");

		class CChart : public WritingElement
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CChart)
			CChart()
			{
			}
			virtual ~CChart()
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
			virtual void toXML2(CStringWriter& writer, nullable<CChartStyle> oChartStyle, CString& sSpPr) const
			{
				if(m_oPlotArea.IsInit() && m_oPlotArea->m_oBasicChart.IsInit())
				{
					CString sChartPattern;
					bool bPie = false;
					bool bBar = false;
					bool bScatter = false;
					bool bLine = false;
					switch(m_oPlotArea->m_oBasicChart->m_eType)
					{
					case OOX::Spreadsheet::chartbasicBarChart:
					case OOX::Spreadsheet::chartbasicBar3DChart: sChartPattern = gc_sChartBar;bBar = true;break;
					case OOX::Spreadsheet::chartbasicRadarChart: 
					case OOX::Spreadsheet::chartbasicAreaChart: sChartPattern = gc_sChartArea;break;
					case OOX::Spreadsheet::chartbasicLineChart: 
					case OOX::Spreadsheet::chartbasicLine3DChart: sChartPattern = gc_sChartLine;bLine = true;break;
					case OOX::Spreadsheet::chartbasicPieChart: 
					case OOX::Spreadsheet::chartbasicDoughnutChart: sChartPattern = gc_sChartPie;bPie = true;break;
					case OOX::Spreadsheet::chartbasicBubbleChart: 
					case OOX::Spreadsheet::chartbasicScatterChart: sChartPattern = gc_sChartScatter;bScatter = true;break;
					case OOX::Spreadsheet::chartbasicStockChart: sChartPattern = gc_sChartStock;break;
					default:sChartPattern = gc_sChartLine;
					}

					CString title;
					if(m_oTitle.IsInit())
					{
						CStringWriter sTempWriter;
						m_oTitle->toXML(sTempWriter);
						title = sTempWriter.GetCString();
					}
					CString style;
					if(oChartStyle.IsInit())
						style = oChartStyle->toXML();
					else
					{
						CChartStyle oCChartStyle;
						style = oCChartStyle.toXML();
					}
					CString sBarDir;
					CString sGrouping;
					CString sSeries;
					CString sDataLabels;
					CString sOverlap;
					CString sCatAxDelete;
					CString sCatAxMajorGrid;
					CString sCatAxTitle;
					CString sCatTxPr;
					CString sValAxDelete;
					CString sValAxMajorGrid;
					CString sValAxTitle;
					CString sValTxPr;
					m_oPlotArea->toXML2(bScatter, bLine, sBarDir, sGrouping, sSeries, sDataLabels, sOverlap, sCatAxDelete, sCatAxMajorGrid, sCatAxTitle, sCatTxPr, sValAxDelete, sValAxMajorGrid, sValAxTitle, sValTxPr);
					CStringWriter legend;
					if(m_oLegend.IsInit())
						m_oLegend->toXML(legend);

					CString sChart;
					if(bPie)
						sChart.Format(sChartPattern, style, title, sBarDir, sGrouping, sSeries, sDataLabels, legend.GetCString(), sSpPr);
					else if(bBar)
					{
						CString sDLblPos = _T("<c:dLblPos val=\"outEnd\"/>");
						if(m_oPlotArea->m_oBasicChart.IsInit() && m_oPlotArea->m_oBasicChart->m_oGrouping.IsInit() && m_oPlotArea->m_oBasicChart->m_oGrouping->m_oVal.IsInit())
						{
							switch(m_oPlotArea->m_oBasicChart->m_oGrouping->m_oVal->GetValue())
							{
							case SimpleTypes::Spreadsheet::chartbargroupingPercentStacked : sDLblPos = _T("<c:dLblPos val=\"inEnd\"/>");break;
							case SimpleTypes::Spreadsheet::chartbargroupingStacked : sDLblPos = _T("<c:dLblPos val=\"inEnd\"/>");break;
							}
						}
						sChart.Format(sChartPattern, style, title, sBarDir, sGrouping, sSeries, sDLblPos, sDataLabels, sOverlap, sCatAxDelete, sCatAxMajorGrid, sCatAxTitle, sCatTxPr, sValAxDelete, sValAxMajorGrid, sValAxTitle, sValTxPr, legend.GetCString(), sSpPr);
					}
					else
						sChart.Format(sChartPattern, style, title, sBarDir, sGrouping, sSeries, sDataLabels, sCatAxDelete, sCatAxMajorGrid, sCatAxTitle, sCatTxPr, sValAxDelete, sValAxMajorGrid, sValAxTitle, sValTxPr, legend.GetCString(), sSpPr);
					writer.WriteStringC(sChart);
				}
			}
			virtual void fromXML(XmlUtils::CXmlLiteReader& oReader)
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
					else if ( _T("c:legend") == sName )
						m_oLegend = oReader;
					else if ( _T("c:plotArea") == sName )
						m_oPlotArea = oReader;
				}
			}

			virtual EElementType getType () const
			{
				return et_c_Chart;
			}
			bool isValid()
			{
				if(m_oPlotArea.IsInit() && m_oPlotArea->m_oBasicChart.IsInit())
				{
					return OOX::Spreadsheet::chartbasicBubbleChart != m_oPlotArea->m_oBasicChart->m_eType;
				}
				return false;
			}
		private:
			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
			}
		public:
			nullable<CChartTitle>						m_oTitle;
			nullable<CChartLegend>						m_oLegend;
			nullable<CChartPlotArea>					m_oPlotArea;
		};
		class CChartSpace : public OOX::FileGlobalEnumerated, public OOX::Spreadsheet::IFileContainer
		{
		public:
			CChartSpace()
			{
			}
			CChartSpace(const CPath& oPath)
			{
				read( oPath );
			}
			virtual ~CChartSpace()
			{
			}
		public:

			virtual void read(const CPath& oPath)
			{
				m_oReadPath = oPath;
				IFileContainer::Read( oPath );

				XmlUtils::CXmlLiteReader oReader;

				if ( !oReader.FromFile( oPath.GetPath() ) )
					return;

				if ( !oReader.ReadNextNode() )
					return;

				CWCharWrapper sName = oReader.GetName();
				if ( _T("c:chartSpace") == sName )
				{
					ReadAttributes( oReader );

					if ( !oReader.IsEmptyNode() )
					{
						int nStylesDepth = oReader.GetDepth();
						while ( oReader.ReadNextSiblingNode( nStylesDepth ) )
						{
							sName = oReader.GetName();

							if ( _T("c:chart") == sName )
								m_oChart = oReader;
							else if ( _T("c:style") == sName )
								m_oStyle = oReader;
							else if ( _T("mc:AlternateContent") == sName )
								m_oAlternateContent = oReader;
							else if ( _T("c:spPr") == sName )
								m_sSpPr = oReader.GetOuterXml();
						}
					}
				}
			}
			virtual void write(const CPath& oPath, const CPath& oDirectory, CContentTypes& oContent) const
			{
				if(isValid())
				{
					write2(oPath.GetPath());
					oContent.Registration( type().OverrideType(), oDirectory, oPath.GetFilename() );
					IFileContainer::Write(oPath, oDirectory, oContent);
				}
			}
			bool write2(const CString& sFilename) const
			{
				bool bRes = false;
				if(isValid())
				{
					CStringWriter sXml;
					toXML(sXml);

					CDirectory::SaveToFile( sFilename, sXml.GetCString() );
					bRes = true;
				}
				return bRes;
			}
			bool isValid() const
			{
				return m_oChart.IsInit() && m_oChart->isValid();
			}
			void toXML(CStringWriter& sXml) const
			{
				CString sSpPr;
				if(m_sSpPr.IsInit())
					sSpPr = m_sSpPr.get();
				m_oChart->toXML2(sXml, m_oStyle, sSpPr);
			}
			virtual const OOX::FileType type() const
			{
				return OOX::Spreadsheet::FileTypes::Charts;
			}
			virtual const CPath DefaultDirectory() const
			{
				return type().DefaultDirectory();
			}
			virtual const CPath DefaultFileName() const
			{
				return type().DefaultFileName();
			}
			const CPath& GetReadPath()
			{
				return m_oReadPath;
			}

		private:
			CPath									m_oReadPath;
			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
			}
		public:
			nullable<CChart>         m_oChart;
			nullable<CChartStyle>						m_oStyle;
			nullable<OOX::Logic::CAlternateContent>		m_oAlternateContent;
			nullable<CString>							m_sSpPr;
		};
	} 
} 

#endif // OOX_CHART_FILE_INCLUDE_H_