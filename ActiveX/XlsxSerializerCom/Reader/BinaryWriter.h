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
#include "../../ASCOfficePPTXFile/Editor/BinReaderWriterDefines.h"

#include "../../Common/DocxFormat/Source/SystemUtility/SystemUtility.h"
#include "../../Common/DocxFormat/Source/DocxFormat/Drawing/DrawingColors.h"
#include "../../Common/OfficeFileFormats.h"
#include "../../Common/Base64.h"

#include "FontProcessor.h"
#include "../../Common/DocxFormat/Source/XlsxFormat/Xlsx.h"
#include "../Common/BinReaderWriterDefines.h"
#include "../Common/Common.h"
#include "../../ASCOfficePPTXFile/Editor/FontCutter.h"
#include "../../ASCOfficeDocxFile2/BinWriter/StreamUtils.h"
#include "../Writer/BinaryReader.h"
#include "../Reader/CSVReader.h"



namespace BinXlsxRW {

	static TCHAR* gc_sMediaDirName = _T("media");
	static TCHAR* gc_sMimeName = _T("mimetype");

#ifdef DEFAULT_TABLE_STYLES
	void getDefaultCellStyles(CString& sFileInput, CString& sFileOutput, NSFontCutter::CEmbeddedFontsManager* pEmbeddedFontsManager, OOX::Spreadsheet::CIndexedColors* oIndexedColors, OOX::CTheme* pTheme, BinXlsxRW::FontProcessor& oFontProcessor);
	void getDefaultTableStyles(CString& sFileInput, CString& sFileOutput, NSFontCutter::CEmbeddedFontsManager* pEmbeddedFontsManager, OOX::Spreadsheet::CIndexedColors* oIndexedColors, OOX::CTheme* pTheme, BinXlsxRW::FontProcessor& oFontProcessor);
	void writeTheme(LPSAFEARRAY pThemeData, CString& sFileOutput);
#endif

	class BinaryCommonWriter
	{
	public: 
		Streams::CBufferedStream &m_oStream;
		BinaryCommonWriter(Streams::CBufferedStream &oCBufferedStream):m_oStream(oCBufferedStream)
		{
		}
		int WriteItemStart(BYTE type)
		{
			
			m_oStream.WriteByte(type);
			return WriteItemWithLengthStart();
		}
		void WriteItemEnd(int nStart)
		{
			WriteItemWithLengthEnd(nStart);
		}
		int WriteItemWithLengthStart()
		{
			
			int nStartPos = m_oStream.GetPosition();
			m_oStream.Skip(4);	
			return nStartPos;
		}
		void WriteItemWithLengthEnd(int nStart)
		{
			
			int nEnd = m_oStream.GetPosition();
			m_oStream.Seek(nStart);
			m_oStream.WriteLong(nEnd - nStart - 4);
			m_oStream.Seek(nEnd);
		}
		void WriteColor(const OOX::Spreadsheet::CColor& color, OOX::Spreadsheet::CIndexedColors* pIndexedColors, OOX::CTheme* theme)
		{
			if(color.m_oAuto.IsInit() && color.m_oAuto->ToBool())
			{
				m_oStream.WriteByte(c_oSer_ColorObjectType::Type);
				m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oStream.WriteByte(c_oSer_ColorType::Auto);
			}
			else
			{
				bool bEmpty = true;
				SimpleTypes::Spreadsheet::CHexColor oRgbColor;
				if(color.m_oIndexed.IsInit())
				{
					int nIndex = (int)color.m_oIndexed->GetValue();
					if(NULL != pIndexedColors && nIndex < pIndexedColors->m_arrItems.GetSize())
					{
							OOX::Spreadsheet::CRgbColor* pRgbColor = pIndexedColors->m_arrItems[nIndex];
							if(pRgbColor->m_oRgb.IsInit())
							{
								bEmpty = false;
								oRgbColor = pRgbColor->m_oRgb.get();
							}
					}
					else
					{
						unsigned char ucA;
						unsigned char ucR;
						unsigned char ucG;
						unsigned char ucB;
						if(OOX::Spreadsheet::CIndexedColors::GetDefaultRGBAByIndex(nIndex, ucR, ucG, ucB, ucA))
						{
							bEmpty = false;
							oRgbColor.Set_A(ucA);
							oRgbColor.Set_R(ucR);
							oRgbColor.Set_G(ucG);
							oRgbColor.Set_B(ucB);
						}
					}
				}
				else if(color.m_oRgb.IsInit())
				{
					bEmpty = false;
					oRgbColor = color.m_oRgb.get();
				}
				if(color.m_oThemeColor.IsInit())
				{
					m_oStream.WriteByte(c_oSer_ColorObjectType::Theme);
					m_oStream.WriteByte(c_oSerPropLenType::Byte);
					m_oStream.WriteByte((BYTE)color.m_oThemeColor->GetValue());
				}
				if(color.m_oTint.IsInit())
				{
					m_oStream.WriteByte(c_oSer_ColorObjectType::Tint);
					m_oStream.WriteByte(c_oSerPropLenType::Double);
					m_oStream.WriteDouble(color.m_oTint->GetValue());
				}
				if(!bEmpty)
				{
					m_oStream.WriteByte(c_oSer_ColorObjectType::Rgb);
					m_oStream.WriteByte(c_oSerPropLenType::Long);
					m_oStream.WriteLong(oRgbColor.ToInt());
				}
			}
		}
		void WriteSafeArray(SAFEARRAY* pBinaryObj)
		{
			int nCurPos = WriteItemWithLengthStart();
			m_oStream.WritePointer((BYTE *)pBinaryObj->pvData, pBinaryObj->rgsabound[0].cElements);
			WriteItemWithLengthEnd(nCurPos);
		}
		void WritePptxTitle(const OOX::Spreadsheet::CChartTitle& oTitle, PPTXFile::IAVSOfficeDrawingConverter* pOfficeDrawingConverter)
		{
			int nCurPos = 0;
			if(oTitle.m_oTx.IsInit() && oTitle.m_oTx->m_oRich.IsInit() && oTitle.m_oTx->m_oRich->m_oXml.IsInit())
			{
				nCurPos = WriteItemStart(c_oSer_ChartTitlePptxType::TxPptx);
				WritePptxParagraph(oTitle.m_oTx->m_oRich->m_oXml.get2(), pOfficeDrawingConverter);
				WriteItemEnd(nCurPos);
			}
			if(oTitle.m_oTxPr.IsInit() && oTitle.m_oTxPr->m_oXml.IsInit())
			{
				nCurPos = WriteItemStart(c_oSer_ChartTitlePptxType::TxPrPptx);
				WritePptxParagraph(oTitle.m_oTxPr->m_oXml.get2(), pOfficeDrawingConverter);
				WriteItemEnd(nCurPos);
			}
		}
		void WritePptxParagraph(CString& sXml, PPTXFile::IAVSOfficeDrawingConverter* pOfficeDrawingConverter)
		{
			LPSAFEARRAY pBinaryObj = NULL;
			BSTR bstrXml = sXml.AllocSysString();
			HRESULT hRes = pOfficeDrawingConverter->GetTxBodyBinary(bstrXml, &pBinaryObj);
			SysFreeString(bstrXml);
			if(S_OK == hRes && NULL != pBinaryObj && pBinaryObj->rgsabound[0].cElements > 0)
				m_oStream.WritePointer((BYTE *)pBinaryObj->pvData, pBinaryObj->rgsabound[0].cElements);
		}
	};
	class BinaryChartWriter
	{
		BinaryCommonWriter m_oBcw;
		PPTXFile::IAVSOfficeDrawingConverter* m_pOfficeDrawingConverter;
	public:
		BinaryChartWriter(Streams::CBufferedStream &oCBufferedStream, PPTXFile::IAVSOfficeDrawingConverter* pOfficeDrawingConverter):m_oBcw(oCBufferedStream),m_pOfficeDrawingConverter(pOfficeDrawingConverter)
		{
		}
	public:
		void Write(const OOX::Spreadsheet::CChartSpace& oChartSpace)
		{
			int nCurPos = 0;
			OOX::Spreadsheet::CChart& oChart = oChartSpace.m_oChart.get2();
			if(oChart.m_oLegend.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_ChartType::Legend);
				WriteLegend(oChart.m_oLegend.get());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			if(oChart.m_oTitle.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_ChartType::TitlePptx);
				m_oBcw.WritePptxTitle(oChart.m_oTitle.get(), m_pOfficeDrawingConverter);
				m_oBcw.WriteItemEnd(nCurPos);
			}
			if(oChart.m_oPlotArea.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_ChartType::PlotArea);
				WritePlotArea(oChart.m_oPlotArea.get());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			
			int nChartStyle = 0;
			if(oChartSpace.m_oStyle.IsInit() && oChartSpace.m_oStyle->m_oVal.IsInit())
			{
				nChartStyle = oChartSpace.m_oStyle->m_oVal->GetValue();
			}
			else if(oChartSpace.m_oAlternateContent.IsInit())
			{
				if(oChartSpace.m_oAlternateContent->m_arrSpreadsheetChoiceItems.GetSize() > 0)
				{
					for(int i = 0, length = oChartSpace.m_oAlternateContent->m_arrSpreadsheetChoiceItems.GetSize(); i < length; ++i)
					{
						OOX::Spreadsheet::WritingElement* we = oChartSpace.m_oAlternateContent->m_arrSpreadsheetChoiceItems[i];
						if(OOX::Spreadsheet::et_c_ChartStyle == we->getType())
						{
							OOX::Spreadsheet::CChartStyle* pChartStyle = static_cast<OOX::Spreadsheet::CChartStyle*>(we);
							if(pChartStyle->m_oVal.IsInit())
								nChartStyle = pChartStyle->m_oVal->GetValue();
						}
					}
				}
				else if(oChartSpace.m_oAlternateContent->m_arrSpreadsheetFallbackItems.GetSize())
				{
					for(int i = 0, length = oChartSpace.m_oAlternateContent->m_arrSpreadsheetFallbackItems.GetSize(); i < length; ++i)
					{
						OOX::Spreadsheet::WritingElement* we = oChartSpace.m_oAlternateContent->m_arrSpreadsheetFallbackItems[i];
						if(OOX::Spreadsheet::et_c_ChartStyle == we->getType())
						{
							OOX::Spreadsheet::CChartStyle* pChartStyle = static_cast<OOX::Spreadsheet::CChartStyle*>(we);
							if(pChartStyle->m_oVal.IsInit())
								nChartStyle = pChartStyle->m_oVal->GetValue();
						}
					}
				}
			}
			if(nChartStyle > 100)
				nChartStyle -= 100;
			if(nChartStyle >= 1 && nChartStyle <= 48)
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_ChartType::Style);
				m_oBcw.m_oStream.WriteLong(nChartStyle);
				m_oBcw.WriteItemEnd(nCurPos);
			}
			if(oChartSpace.m_sSpPr.IsInit())
			{
				BSTR bstrShapeProperties = oChartSpace.m_sSpPr->AllocSysString();
				LPSAFEARRAY pBinaryObj = NULL;
				HRESULT hRes = m_pOfficeDrawingConverter->GetRecordBinary(XMLWRITER_RECORD_TYPE_SPPR, bstrShapeProperties, &pBinaryObj);
				if(S_OK == hRes && NULL != pBinaryObj && pBinaryObj->rgsabound[0].cElements > 0)
				{
					m_oBcw.m_oStream.WriteByte(c_oSer_ChartType::SpPr);
					m_oBcw.WriteSafeArray(pBinaryObj);
				}
				RELEASEARRAY(pBinaryObj);
				SysFreeString(bstrShapeProperties);
			}
		};
		void WriteLegend(const OOX::Spreadsheet::CChartLegend& oChartLegend)
		{
			int nCurPos = 0;
			if(oChartLegend.m_oLayout.IsInit() && oChartLegend.m_oLayout->m_oManualLayout.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_ChartLegendType::Layout);
				WriteLegendLayout(oChartLegend.m_oLayout->m_oManualLayout.get());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			if(oChartLegend.m_oLegendPos.IsInit() && oChartLegend.m_oLegendPos->m_oVal.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_ChartLegendType::LegendPos);
				m_oBcw.m_oStream.WriteByte(oChartLegend.m_oLegendPos->m_oVal->GetValue());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			if(oChartLegend.m_oOverlay.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_ChartLegendType::Overlay);
				m_oBcw.m_oStream.WriteBool(oChartLegend.m_oOverlay->m_oVal.ToBool());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			if(oChartLegend.m_oTxPr.IsInit() && oChartLegend.m_oTxPr->m_oXml.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_ChartLegendType::TxPrPptx);
				m_oBcw.WritePptxParagraph(oChartLegend.m_oTxPr->m_oXml.get2(), m_pOfficeDrawingConverter);
				m_oBcw.WriteItemEnd(nCurPos);
			}
			if(oChartLegend.m_arrItems.GetSize() > 0)
			{
				for(int i = 0, length = oChartLegend.m_arrItems.GetSize(); i < length; ++i)
				{
					nCurPos = m_oBcw.WriteItemStart(c_oSer_ChartLegendType::LegendEntry);
					WriteLegendEntry(*oChartLegend.m_arrItems[i]);
					m_oBcw.WriteItemEnd(nCurPos);
				}
			}
		}
		void WriteLegendEntry(const OOX::Spreadsheet::CChartLegendEntry& oLegendEntry)
		{
			int nCurPos = 0;
			if(oLegendEntry.m_oIndex.IsInit() && oLegendEntry.m_oIndex->m_oVal.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_ChartLegendEntryType::Index);
				m_oBcw.m_oStream.WriteLong(oLegendEntry.m_oIndex->m_oVal->GetValue());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			if(oLegendEntry.m_oDelete.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_ChartLegendEntryType::Delete);
				m_oBcw.m_oStream.WriteBool(oLegendEntry.m_oDelete->m_oVal.ToBool());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			if(oLegendEntry.m_oTxPr.IsInit() && oLegendEntry.m_oTxPr->m_oXml.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_ChartLegendEntryType::TxPrPptx);
				m_oBcw.WritePptxParagraph(oLegendEntry.m_oTxPr->m_oXml.get2(), m_pOfficeDrawingConverter);
				m_oBcw.WriteItemEnd(nCurPos);
			}
		}
		void WriteLegendLayout(const OOX::Spreadsheet::CChartManualLayout& oChartManualLayout)
		{
			int nCurPos = 0;
			if(oChartManualLayout.m_oH.IsInit() && oChartManualLayout.m_oH->m_oVal.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_ChartLegendLayoutType::H);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
				m_oBcw.m_oStream.WriteDouble(oChartManualLayout.m_oH->m_oVal->GetValue());
			}
			if(oChartManualLayout.m_oHMode.IsInit() && oChartManualLayout.m_oHMode->m_oVal.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_ChartLegendLayoutType::HMode);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteByte(oChartManualLayout.m_oHMode->m_oVal->GetValue());
			}
			if(oChartManualLayout.m_oLayoutTarget.IsInit() && oChartManualLayout.m_oLayoutTarget->m_oVal.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_ChartLegendLayoutType::LayoutTarget);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteByte(oChartManualLayout.m_oLayoutTarget->m_oVal->GetValue());
			}
			if(oChartManualLayout.m_oW.IsInit() && oChartManualLayout.m_oW->m_oVal.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_ChartLegendLayoutType::W);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
				m_oBcw.m_oStream.WriteDouble(oChartManualLayout.m_oW->m_oVal->GetValue());
			}
			if(oChartManualLayout.m_oWMode.IsInit() && oChartManualLayout.m_oWMode->m_oVal.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_ChartLegendLayoutType::WMode);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteByte(oChartManualLayout.m_oWMode->m_oVal->GetValue());
			}
			if(oChartManualLayout.m_oX.IsInit() && oChartManualLayout.m_oX->m_oVal.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_ChartLegendLayoutType::X);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
				m_oBcw.m_oStream.WriteDouble(oChartManualLayout.m_oX->m_oVal->GetValue());
			}
			if(oChartManualLayout.m_oXMode.IsInit() && oChartManualLayout.m_oXMode->m_oVal.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_ChartLegendLayoutType::XMode);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteByte(oChartManualLayout.m_oXMode->m_oVal->GetValue());
			}
			if(oChartManualLayout.m_oY.IsInit() && oChartManualLayout.m_oY->m_oVal.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_ChartLegendLayoutType::Y);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
				m_oBcw.m_oStream.WriteDouble(oChartManualLayout.m_oY->m_oVal->GetValue());
			}
			if(oChartManualLayout.m_oYMode.IsInit() && oChartManualLayout.m_oYMode->m_oVal.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_ChartLegendLayoutType::YMode);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteByte(oChartManualLayout.m_oYMode->m_oVal->GetValue());
			}
		}
		void WritePlotArea(const OOX::Spreadsheet::CChartPlotArea& oPlotArea)
		{
			int nCurPos = 0;
			if(oPlotArea.m_oCatAx.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_ChartPlotAreaType::CatAx);
				WriteCatAx(oPlotArea.m_oCatAx.get());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			for(int i = 0, length = oPlotArea.m_arrItems.GetSize(); i < length; ++i)
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_ChartPlotAreaType::ValAx);
				WriteCatAx(*oPlotArea.m_arrItems[i]);
				m_oBcw.WriteItemEnd(nCurPos);
			}
			if(oPlotArea.m_oBasicChart.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_ChartPlotAreaType::BasicChart);
				WriteBasicChart(oPlotArea.m_oBasicChart.get());
				m_oBcw.WriteItemEnd(nCurPos);
			}
		}
		void WriteCatAx(const OOX::Spreadsheet::CChartCatAx& oCatAx)
		{
			int nCurPos = 0;
			if(oCatAx.m_oTitle.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_ChartCatAxType::TitlePptx);
				m_oBcw.WritePptxTitle(oCatAx.m_oTitle.get(), m_pOfficeDrawingConverter);
				m_oBcw.WriteItemEnd(nCurPos);
			}
			if(oCatAx.m_oMajorGridlines.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_ChartCatAxType::MajorGridlines);
				m_oBcw.m_oStream.WriteBool(oCatAx.m_oMajorGridlines->ToBool());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			if(oCatAx.m_oDelete.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_ChartCatAxType::Delete);
				m_oBcw.m_oStream.WriteBool(oCatAx.m_oDelete->m_oVal.ToBool());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			if(oCatAx.m_oAxPos.IsInit() && oCatAx.m_oAxPos->m_oVal.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_ChartCatAxType::AxPos);
				m_oBcw.m_oStream.WriteByte(oCatAx.m_oAxPos->m_oVal->GetValue());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			if(oCatAx.m_oTxPr.IsInit() && oCatAx.m_oTxPr->m_oXml.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_ChartCatAxType::TxPrPptx);
				m_oBcw.WritePptxParagraph(oCatAx.m_oTxPr->m_oXml.get2(), m_pOfficeDrawingConverter);
				m_oBcw.WriteItemEnd(nCurPos);
			}
		}
		void WriteBasicChart(const OOX::Spreadsheet::CChartBasicChart& oChartBasicChart)
		{
			int nCurPos = 0;
			m_oBcw.m_oStream.WriteByte(c_oSer_BasicChartType::Type);
			m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
			m_oBcw.m_oStream.WriteByte(oChartBasicChart.m_eType);

			if(oChartBasicChart.m_oBarDerection.IsInit() && oChartBasicChart.m_oBarDerection->m_oVal.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_BasicChartType::BarDerection);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteByte(oChartBasicChart.m_oBarDerection->m_oVal->GetValue());
			}
			if(oChartBasicChart.m_oGrouping.IsInit() && oChartBasicChart.m_oGrouping->m_oVal.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_BasicChartType::Grouping);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteByte(oChartBasicChart.m_oGrouping->m_oVal->GetValue());
			}
			if(oChartBasicChart.m_oOverlap.IsInit() && oChartBasicChart.m_oOverlap->m_oVal.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_BasicChartType::Overlap);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Long);
				m_oBcw.m_oStream.WriteLong(oChartBasicChart.m_oOverlap->m_oVal->GetValue());
			}
			if(oChartBasicChart.m_arrItems.GetSize() > 0)
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_BasicChartType::Series);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);
				int nCurPos = m_oBcw.WriteItemWithLengthStart();
				WriteSeries(oChartBasicChart.m_arrItems);
				m_oBcw.WriteItemWithLengthEnd(nCurPos);
			}
			if(oChartBasicChart.m_oDataLabels.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_BasicChartType::DataLabels);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);
				int nCurPos = m_oBcw.WriteItemWithLengthStart();
				WriteDataLabels(oChartBasicChart.m_oDataLabels.get());
				m_oBcw.WriteItemWithLengthEnd(nCurPos);
			}
		}
		void WriteSeries(const CSimpleArray<OOX::Spreadsheet::CChartSeries*>& arrSeries)
		{
			int nCurPos = 0;
			for(int i = 0, length = arrSeries.GetSize(); i < length; ++i)
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_BasicChartType::Seria);
				WriteSeria(*arrSeries[i]);
				m_oBcw.WriteItemEnd(nCurPos);
			}
		}
		void WriteSeria(const OOX::Spreadsheet::CChartSeries& oChartSeries)
		{
			int nCurPos = 0;
			if(oChartSeries.m_oXVal.IsInit() && oChartSeries.m_oXVal->m_oNumCacheRef.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_ChartSeriesType::xVal);
				WriteSeriesNumCache(oChartSeries.m_oXVal->m_oNumCacheRef.get());
				m_oBcw.WriteItemEnd(nCurPos);
			}

			if(oChartSeries.m_oVal.IsInit() && oChartSeries.m_oVal->m_oNumCacheRef.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_ChartSeriesType::Val);
				WriteSeriesNumCache(oChartSeries.m_oVal->m_oNumCacheRef.get());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			
			if(oChartSeries.m_oTx.IsInit())
			{
				if(oChartSeries.m_oTx->m_oValue.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSer_ChartSeriesType::Tx);
					m_oBcw.m_oStream.WriteString2(oChartSeries.m_oTx->m_oValue.get2());
				}
				else if(oChartSeries.m_oTx->m_oStrRef.IsInit())
				{
					nCurPos = m_oBcw.WriteItemStart(c_oSer_ChartSeriesType::TxRef);
					WriteSeriesNumCache(oChartSeries.m_oTx->m_oStrRef.get());
					m_oBcw.WriteItemEnd(nCurPos);
				}
			}
			if(oChartSeries.m_oMarker.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_ChartSeriesType::Marker);
				WriteSeriesMarker(oChartSeries.m_oMarker.get());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			if(oChartSeries.m_sSpPr.IsInit())
			{
				BSTR bstrShapeProperties = oChartSeries.m_sSpPr->AllocSysString();
				LPSAFEARRAY pBinaryObj = NULL;
				HRESULT hRes = m_pOfficeDrawingConverter->GetRecordBinary(XMLWRITER_RECORD_TYPE_SPPR, bstrShapeProperties, &pBinaryObj);
				if(S_OK == hRes && NULL != pBinaryObj && pBinaryObj->rgsabound[0].cElements > 0)
				{
					m_oBcw.m_oStream.WriteByte(c_oSer_ChartSeriesType::SpPr);
					m_oBcw.WriteSafeArray(pBinaryObj);
				}
				RELEASEARRAY(pBinaryObj);
				SysFreeString(bstrShapeProperties);
			}
			if(oChartSeries.m_oIndex.IsInit() && oChartSeries.m_oIndex->m_oVal.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_ChartSeriesType::Index);
				m_oBcw.m_oStream.WriteLong(oChartSeries.m_oIndex->m_oVal->GetValue());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			if(oChartSeries.m_oOrder.IsInit() && oChartSeries.m_oOrder->m_oVal.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_ChartSeriesType::Order);
				m_oBcw.m_oStream.WriteLong(oChartSeries.m_oOrder->m_oVal->GetValue());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			if(oChartSeries.m_oDataLabels.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_ChartSeriesType::DataLabels);
				WriteDataLabels(oChartSeries.m_oDataLabels.get());
				m_oBcw.WriteItemEnd(nCurPos);
			}

			if(oChartSeries.m_oCat.IsInit() && oChartSeries.m_oCat->m_oStrRef.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_ChartSeriesType::Cat);
				WriteSeriesNumCache(oChartSeries.m_oCat->m_oStrRef.get());
				m_oBcw.WriteItemEnd(nCurPos);
			}
		}
		void WriteSeriesNumCache(const OOX::Spreadsheet::CChartSeriesNumCacheRef& oChartSeriesNumCacheRef)
		{
			if(oChartSeriesNumCacheRef.m_oFormula.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_ChartSeriesNumCacheType::Formula);
				m_oBcw.m_oStream.WriteString2(oChartSeriesNumCacheRef.m_oFormula->ToString());
			}
			if(oChartSeriesNumCacheRef.m_oNumCache.IsInit() && oChartSeriesNumCacheRef.m_oNumCache->m_arrItems.GetSize() > 0)
			{
				int nCurPos = m_oBcw.WriteItemStart(c_oSer_ChartSeriesNumCacheType::NumCache2);
				WriteSeriesNumCacheValues(oChartSeriesNumCacheRef.m_oNumCache->m_arrItems);
				m_oBcw.WriteItemEnd(nCurPos);
			}
		}
		void WriteSeriesNumCacheValues(CSimpleArray<OOX::Spreadsheet::CChartSeriesNumCachePoint*>& oChartSeriesNumCacheRef)
		{
			for(int i = 0, length = oChartSeriesNumCacheRef.GetSize(); i < length; ++i)
			{
				int nCurPos = m_oBcw.WriteItemStart(c_oSer_ChartSeriesNumCacheType::NumCacheItem);
				WriteSeriesNumCachePoint(*oChartSeriesNumCacheRef[i]);
				m_oBcw.WriteItemEnd(nCurPos);
			}
		}
		void WriteSeriesNumCachePoint(OOX::Spreadsheet::CChartSeriesNumCachePoint& oPoint)
		{
			if(oPoint.m_oValue.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_ChartSeriesNumCacheType::NumCacheVal);
				m_oBcw.m_oStream.WriteString2(oPoint.m_oValue->ToString());
			}
			if(oPoint.m_oIndex.IsInit())
			{
				int nCurPos = m_oBcw.WriteItemStart(c_oSer_ChartSeriesNumCacheType::NumCacheIndex);
				m_oBcw.m_oStream.WriteLong(oPoint.m_oIndex->GetValue());
				m_oBcw.WriteItemEnd(nCurPos);
			}
		}
		void WriteSeriesMarker(const OOX::Spreadsheet::CChartSeriesMarker& oChartSeriesMarker)
		{
			int nCurPos = 0;
			if(oChartSeriesMarker.m_oSize.IsInit() && oChartSeriesMarker.m_oSize->m_oVal.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_ChartSeriesMarkerType::Size);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Long);
				m_oBcw.m_oStream.WriteLong(oChartSeriesMarker.m_oSize->m_oVal->GetValue());
			}
			if(oChartSeriesMarker.m_oSymbol.IsInit() && oChartSeriesMarker.m_oSymbol->m_oVal.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_ChartSeriesMarkerType::Symbol);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteByte(oChartSeriesMarker.m_oSymbol->m_oVal->GetValue());
			}
		}
		void WriteDataLabels(const OOX::Spreadsheet::CChartSeriesDataLabels& oChartSeriesDataLabels)
		{
			if(oChartSeriesDataLabels.m_oShowVal.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_ChartSeriesDataLabelsType::ShowVal);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteBool(oChartSeriesDataLabels.m_oShowVal->m_oVal.ToBool());
			}
			if(oChartSeriesDataLabels.m_oTxPr.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_ChartSeriesDataLabelsType::TxPrPptx);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);
				int nCurPos = m_oBcw.WriteItemWithLengthStart();
				m_oBcw.WritePptxParagraph(oChartSeriesDataLabels.m_oTxPr->m_oXml.get2(), m_pOfficeDrawingConverter);
				m_oBcw.WriteItemWithLengthEnd(nCurPos);
			}
			if(oChartSeriesDataLabels.m_oShowCatName.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_ChartSeriesDataLabelsType::ShowCatName);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteBool(oChartSeriesDataLabels.m_oShowCatName->m_oVal.ToBool());
			}
		}
	};
	class BinaryTableWriter
	{
		BinaryCommonWriter m_oBcw;
	public:
		BinaryTableWriter(Streams::CBufferedStream &oCBufferedStream):m_oBcw(oCBufferedStream)
		{
		}
	public:
		void Write(const OOX::Spreadsheet::CWorksheet& oWorksheet, const OOX::Spreadsheet::CTableParts& oTableParts)
		{
			int nCurPos = 0;
			for(int i = 0, length = oTableParts.m_arrItems.GetSize(); i < length; ++i)
				WriteTablePart(oWorksheet, *oTableParts.m_arrItems[i]);
		};
		void WriteTablePart(const OOX::Spreadsheet::CWorksheet& oWorksheet, const OOX::Spreadsheet::CTablePart& oTablePart)
		{
			int nCurPos = 0;
			if(oTablePart.m_oRId.IsInit())
			{
				smart_ptr<OOX::File> pFile = oWorksheet.Find(OOX::RId(oTablePart.m_oRId->GetValue()));
				if (pFile.IsInit() && OOX::Spreadsheet::FileTypes::Table == pFile->type())
				{
					OOX::Spreadsheet::CTableFile* pTable = static_cast<OOX::Spreadsheet::CTableFile*>(pFile.operator->());
					if(pTable->m_oTable.IsInit())
					{
						nCurPos = m_oBcw.WriteItemStart(c_oSer_TablePart::Table);
						WriteTable(*pTable->m_oTable.GetPointer());
						m_oBcw.WriteItemEnd(nCurPos);
					}
				}
			}
		}
		void WriteTable(OOX::Spreadsheet::CTable& oTable)
		{
			int nCurPos = 0;
			if(oTable.m_oRef.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_TablePart::Ref);
				m_oBcw.m_oStream.WriteString2(oTable.m_oRef->ToString());
			}
			if(oTable.m_oHeaderRowCount.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_TablePart::HeaderRowCount);
				m_oBcw.m_oStream.WriteLong(oTable.m_oHeaderRowCount->GetValue());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			if(oTable.m_oTotalsRowCount.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_TablePart::TotalsRowCount);
				m_oBcw.m_oStream.WriteLong(oTable.m_oTotalsRowCount->GetValue());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			if(oTable.m_oDisplayName.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_TablePart::DisplayName);
				m_oBcw.m_oStream.WriteString2(oTable.m_oDisplayName.get2());
			}
			if(oTable.m_oAutoFilter.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_TablePart::AutoFilter);
				WriteAutoFilter(oTable.m_oAutoFilter.get());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			if(oTable.m_oSortState.IsInit())
			{
				OOX::Spreadsheet::CSortState* pSortState = NULL;
				if(oTable.m_oSortState.IsInit())
					pSortState = oTable.m_oSortState.GetPointer();
				else
					pSortState = oTable.m_oAutoFilter->m_oSortState.GetPointer();

				nCurPos = m_oBcw.WriteItemStart(c_oSer_TablePart::SortState);
				WriteSortState(*pSortState);
				m_oBcw.WriteItemEnd(nCurPos);
			}
			if(oTable.m_oTableColumns.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_TablePart::TableColumns);
				WriteTableColumns(oTable.m_oTableColumns.get());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			if(oTable.m_oTableStyleInfo.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_TablePart::TableStyleInfo);
				WriteTableStyleInfo(oTable.m_oTableStyleInfo.get());
				m_oBcw.WriteItemEnd(nCurPos);
			}
		}
		void WriteAutoFilter(const OOX::Spreadsheet::CAutofilter& oAutofilter)
		{
			int nCurPos = 0;
			if(oAutofilter.m_oRef.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_AutoFilter::Ref);
				m_oBcw.m_oStream.WriteString2(oAutofilter.m_oRef->ToString());
			}
			if(oAutofilter.m_arrItems.GetSize() > 0)
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_AutoFilter::FilterColumns);
				WriteFilterColumns(oAutofilter.m_arrItems);
				m_oBcw.WriteItemEnd(nCurPos);
			}
			if(oAutofilter.m_oSortState.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_AutoFilter::SortState);
				WriteSortState(oAutofilter.m_oSortState.get());
				m_oBcw.WriteItemEnd(nCurPos);
			}
		}
		void WriteFilterColumns(const CSimpleArray<OOX::Spreadsheet::CFilterColumn *>& aFilterColumn)
		{
			int nCurPos = 0;
			for(int i = 0, length = aFilterColumn.GetSize(); i < length; ++i)
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_AutoFilter::FilterColumn);
				WriteFilterColumn(*aFilterColumn[i]);
				m_oBcw.WriteItemEnd(nCurPos);
			}
		}
		void WriteFilterColumn(OOX::Spreadsheet::CFilterColumn& oFilterColumn)
		{
			int nCurPos = 0;
			if(oFilterColumn.m_oColId.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_FilterColumn::ColId);
				m_oBcw.m_oStream.WriteLong(oFilterColumn.m_oColId->GetValue());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			if(oFilterColumn.m_oFilters.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_FilterColumn::Filters);
				WriteFilters(oFilterColumn.m_oFilters.get());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			if(oFilterColumn.m_oCustomFilters.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_FilterColumn::CustomFilters);
				WriteCustomFilters(oFilterColumn.m_oCustomFilters.get());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			if(oFilterColumn.m_oDynamicFilter.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_FilterColumn::DynamicFilter);
				WriteDynamicFilter(oFilterColumn.m_oDynamicFilter.get());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			if(oFilterColumn.m_oColorFilter.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_FilterColumn::ColorFilter);
				WriteColorFilter(oFilterColumn.m_oColorFilter.get());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			if(oFilterColumn.m_oTop10.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_FilterColumn::Top10);
				WriteTop10(oFilterColumn.m_oTop10.get());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			if(oFilterColumn.m_oShowButton.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_FilterColumn::ShowButton);
				m_oBcw.m_oStream.WriteBool(oFilterColumn.m_oShowButton->ToBool());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			if(oFilterColumn.m_oHiddenButton.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_FilterColumn::HiddenButton);
				m_oBcw.m_oStream.WriteBool(oFilterColumn.m_oHiddenButton->ToBool());
				m_oBcw.WriteItemEnd(nCurPos);
			}
		}
		void WriteFilters(const OOX::Spreadsheet::CFilters& oFilters)
		{
			int nCurPos = 0;
			if(oFilters.m_oBlank.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_FilterColumn::FiltersBlank);
				m_oBcw.m_oStream.WriteBool(oFilters.m_oBlank->ToBool());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			for(int i = 0, length = oFilters.m_arrItems.GetSize(); i < length; ++i)
			{
				OOX::Spreadsheet::WritingElement* we = oFilters.m_arrItems[i];
				if(OOX::Spreadsheet::et_Filter == we->getType())
				{
					nCurPos = m_oBcw.WriteItemStart(c_oSer_FilterColumn::Filter);
					WriteFilter(*static_cast<OOX::Spreadsheet::CFilter*>(we));
					m_oBcw.WriteItemEnd(nCurPos);
				}
				else if(OOX::Spreadsheet::et_DateGroupItem == we->getType())
				{
					nCurPos = m_oBcw.WriteItemStart(c_oSer_FilterColumn::DateGroupItem);
					WriteDateGroupItem(*static_cast<OOX::Spreadsheet::CDateGroupItem*>(we));
					m_oBcw.WriteItemEnd(nCurPos);
				}
			}
		}
		void WriteFilter(OOX::Spreadsheet::CFilter& oFilter)
		{
			int nCurPos = 0;
			if(oFilter.m_oVal.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_Filter::Val);
				m_oBcw.m_oStream.WriteString2(oFilter.m_oVal.get2());
			}
		}
		void WriteDateGroupItem(OOX::Spreadsheet::CDateGroupItem& oDateGroupItem)
		{
			int nCurPos = 0;
			if(oDateGroupItem.m_oDateTimeGrouping.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_DateGroupItem::DateTimeGrouping);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteByte(oDateGroupItem.m_oDateTimeGrouping->GetValue());
			}
			if(oDateGroupItem.m_oDay.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_DateGroupItem::Day);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Long);
				m_oBcw.m_oStream.WriteLong(oDateGroupItem.m_oDay->GetValue());
			}
			if(oDateGroupItem.m_oHour.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_DateGroupItem::Hour);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Long);
				m_oBcw.m_oStream.WriteLong(oDateGroupItem.m_oHour->GetValue());
			}
			if(oDateGroupItem.m_oMinute.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_DateGroupItem::Minute);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Long);
				m_oBcw.m_oStream.WriteLong(oDateGroupItem.m_oMinute->GetValue());
			}
			if(oDateGroupItem.m_oMonth.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_DateGroupItem::Month);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Long);
				m_oBcw.m_oStream.WriteLong(oDateGroupItem.m_oMonth->GetValue());
			}
			if(oDateGroupItem.m_oSecond.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_DateGroupItem::Second);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Long);
				m_oBcw.m_oStream.WriteLong(oDateGroupItem.m_oSecond->GetValue());
			}
			if(oDateGroupItem.m_oYear.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_DateGroupItem::Year);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Long);
				m_oBcw.m_oStream.WriteLong(oDateGroupItem.m_oYear->GetValue());
			}
		}
		void WriteCustomFilters(const OOX::Spreadsheet::CCustomFilters& oCustomFilters)
		{
			int nCurPos = 0;
			if(oCustomFilters.m_oAnd.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_CustomFilters::And);
				m_oBcw.m_oStream.WriteBool(oCustomFilters.m_oAnd->ToBool());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			if(oCustomFilters.m_arrItems.GetSize() > 0)
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_CustomFilters::CustomFilters);
				WriteCustomFiltersItems(oCustomFilters.m_arrItems);
				m_oBcw.WriteItemEnd(nCurPos);
			}
		}
		void WriteCustomFiltersItems(const CSimpleArray<OOX::Spreadsheet::CCustomFilter *>& aCustomFilters)
		{
			int nCurPos = 0;
			for(int i = 0, length = aCustomFilters.GetSize(); i < length; ++i)
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_CustomFilters::CustomFilter);
				WriteCustomFiltersItem(*aCustomFilters[i]);
				m_oBcw.WriteItemEnd(nCurPos);
			}
		}
		void WriteCustomFiltersItem(OOX::Spreadsheet::CCustomFilter& oCustomFilter)
		{
			int nCurPos = 0;
			if(oCustomFilter.m_oOperator.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_CustomFilters::Operator);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteByte(oCustomFilter.m_oOperator->GetValue());
			}
			if(oCustomFilter.m_oVal.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_CustomFilters::Val);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);
				m_oBcw.m_oStream.WriteString2(oCustomFilter.m_oVal.get2());
			}
		}
		void WriteDynamicFilter(const OOX::Spreadsheet::CDynamicFilter& oDynamicFilter)
		{
			if(oDynamicFilter.m_oType.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_DynamicFilter::Type);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteByte((BYTE)oDynamicFilter.m_oType->GetValue());
			}
			if(oDynamicFilter.m_oVal.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_DynamicFilter::Val);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
				m_oBcw.m_oStream.WriteDouble(oDynamicFilter.m_oVal->GetValue());
			}
			if(oDynamicFilter.m_oMaxVal.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_DynamicFilter::MaxVal);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
				m_oBcw.m_oStream.WriteDouble(oDynamicFilter.m_oMaxVal->GetValue());
			}
		}
		void WriteColorFilter(const OOX::Spreadsheet::CColorFilter& oColorFilter)
		{
			int nCurPos = 0;
			if(oColorFilter.m_oCellColor.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_ColorFilter::CellColor);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteBool(oColorFilter.m_oCellColor->ToBool());
			}
			if(oColorFilter.m_oDxfId.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_ColorFilter::DxfId);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Long);
				m_oBcw.m_oStream.WriteLong(oColorFilter.m_oDxfId->GetValue());
			}
		}
		void WriteTop10(const OOX::Spreadsheet::CTop10& oTop10)
		{
			int nCurPos = 0;
			if(oTop10.m_oFilterVal.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_Top10::FilterVal);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
				m_oBcw.m_oStream.WriteDouble(oTop10.m_oFilterVal->GetValue());
			}
			if(oTop10.m_oPercent.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_Top10::Percent);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteBool(oTop10.m_oPercent->ToBool());
			}
			if(oTop10.m_oTop.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_Top10::Top);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteBool(oTop10.m_oTop->ToBool());
			}
			if(oTop10.m_oVal.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_Top10::Val);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
				m_oBcw.m_oStream.WriteDouble(oTop10.m_oVal->GetValue());
			}
		}
		void WriteSortCondition(const OOX::Spreadsheet::CSortCondition& oSortCondition)
		{
			int nCurPos = 0;
			if(oSortCondition.m_oRef.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_SortState::ConditionRef);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);
				m_oBcw.m_oStream.WriteString2(oSortCondition.m_oRef->ToString());
			}
			if(oSortCondition.m_oSortBy.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_SortState::ConditionSortBy);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteByte(oSortCondition.m_oSortBy->GetValue());
			}
			if(oSortCondition.m_oDescending.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_SortState::ConditionDescending);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteBool(oSortCondition.m_oDescending->ToBool());
			}
			if(oSortCondition.m_oDxfId.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_SortState::ConditionDxfId);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Long);
				m_oBcw.m_oStream.WriteLong(oSortCondition.m_oDxfId->GetValue());
			}
		}
		void WriteSortState(const OOX::Spreadsheet::CSortState& oSortState)
		{
			int nCurPos = 0;
			if(oSortState.m_oRef.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_SortState::Ref);
				m_oBcw.m_oStream.WriteString2(oSortState.m_oRef->ToString());
			}
			if(oSortState.m_oCaseSensitive.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_SortState::CaseSensitive);
				m_oBcw.m_oStream.WriteBool(oSortState.m_oCaseSensitive->ToBool());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			int nCurPos2 = m_oBcw.WriteItemStart(c_oSer_SortState::SortConditions);
			for(int i = 0, length = oSortState.m_arrItems.GetSize(); i < length; ++i)
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_SortState::SortCondition);
				WriteSortCondition(*oSortState.m_arrItems[i]);
				m_oBcw.WriteItemEnd(nCurPos);
			}
			m_oBcw.WriteItemEnd(nCurPos2);
		}
		void WriteTableColumn(const OOX::Spreadsheet::CTableColumn& oTableColumn)
		{
			int nCurPos = 0;
			if(oTableColumn.m_oName.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_TableColumns::Name);
				m_oBcw.m_oStream.WriteString2(oTableColumn.m_oName.get2());
			}
			if(oTableColumn.m_oTotalsRowLabel.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_TableColumns::TotalsRowLabel);
				m_oBcw.m_oStream.WriteString2(oTableColumn.m_oTotalsRowLabel.get2());
			}
			if(oTableColumn.m_oTotalsRowFunction.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_TableColumns::TotalsRowFunction);
				m_oBcw.m_oStream.WriteByte(oTableColumn.m_oTotalsRowFunction->GetValue());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			if(oTableColumn.m_oTotalsRowFormula.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_TableColumns::TotalsRowFormula);
				m_oBcw.m_oStream.WriteString2(oTableColumn.m_oTotalsRowFormula.get2());
			}
			if(oTableColumn.m_oDataDxfId.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_TableColumns::DataDxfId);
				m_oBcw.m_oStream.WriteLong(oTableColumn.m_oDataDxfId->GetValue());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			if(oTableColumn.m_oCalculatedColumnFormula.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_TableColumns::CalculatedColumnFormula);
				m_oBcw.m_oStream.WriteString2(oTableColumn.m_oCalculatedColumnFormula.get2());
			}
		}
		void WriteTableColumns(const OOX::Spreadsheet::CTableColumns& oTableColumns)
		{
			int nCurPos = 0;
			for(int i = 0, length = oTableColumns.m_arrItems.GetSize(); i < length; ++i)
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_TableColumns::TableColumn);
				WriteTableColumn(*oTableColumns.m_arrItems[i]);
				m_oBcw.WriteItemEnd(nCurPos);
			}
		}
		void WriteTableStyleInfo(const OOX::Spreadsheet::CTableStyleInfo& oTableStyleInfo)
		{
			if(oTableStyleInfo.m_oName.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_TableStyleInfo::Name);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);
				m_oBcw.m_oStream.WriteString2(oTableStyleInfo.m_oName.get2());
			}
			if(oTableStyleInfo.m_oShowColumnStripes.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_TableStyleInfo::ShowColumnStripes);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteBool(oTableStyleInfo.m_oShowColumnStripes->ToBool());
			}
			if(oTableStyleInfo.m_oShowRowStripes.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_TableStyleInfo::ShowRowStripes);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteBool(oTableStyleInfo.m_oShowRowStripes->ToBool());
			}
			if(oTableStyleInfo.m_oShowFirstColumn.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_TableStyleInfo::ShowFirstColumn);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteBool(oTableStyleInfo.m_oShowFirstColumn->ToBool());
			}
			if(oTableStyleInfo.m_oShowLastColumn.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_TableStyleInfo::ShowLastColumn);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteBool(oTableStyleInfo.m_oShowLastColumn->ToBool());
			}
		}
	};
	class BinaryStyleTableWriter
	{
		BinaryCommonWriter m_oBcw;
		NSFontCutter::CEmbeddedFontsManager* m_pEmbeddedFontsManager;
	public:
		BinaryStyleTableWriter(Streams::CBufferedStream &oCBufferedStream, NSFontCutter::CEmbeddedFontsManager* pEmbeddedFontsManager):m_oBcw(oCBufferedStream),m_pEmbeddedFontsManager(pEmbeddedFontsManager)
		{
		};
		void Write(OOX::Spreadsheet::CStyles& styles, OOX::CTheme* pTheme, BinXlsxRW::FontProcessor& oFontProcessor)
		{
			int nStart = m_oBcw.WriteItemWithLengthStart();
			WriteStylesContent(styles, pTheme, oFontProcessor);
			m_oBcw.WriteItemWithLengthEnd(nStart);
		};
		void WriteStylesContent(OOX::Spreadsheet::CStyles& styles, OOX::CTheme* pTheme, BinXlsxRW::FontProcessor& oFontProcessor)
		{
			int nCurPos;
			OOX::Spreadsheet::CIndexedColors* pIndexedColors = NULL;
			if(styles.m_oColors.IsInit() && styles.m_oColors->m_oIndexedColors.IsInit())
				pIndexedColors = styles.m_oColors->m_oIndexedColors.operator ->();
			
			if(styles.m_oBorders.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSerStylesTypes::Borders);
				WriteBorders(styles.m_oBorders.get(), pIndexedColors, pTheme);
				m_oBcw.WriteItemEnd(nCurPos);
			}
			
			if(styles.m_oFills.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSerStylesTypes::Fills);
				WriteFills(styles.m_oFills.get(), pIndexedColors, pTheme);
				m_oBcw.WriteItemEnd(nCurPos);
			}
			
			if(styles.m_oFonts.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSerStylesTypes::Fonts);
				WriteFonts(styles.m_oFonts.get(), pIndexedColors, pTheme, oFontProcessor);
				m_oBcw.WriteItemEnd(nCurPos);
			}
			
			if(styles.m_oNumFmts.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSerStylesTypes::NumFmts);
				WriteNumFmts(styles.m_oNumFmts.get());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			
			if(styles.m_oCellStyleXfs.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSerStylesTypes::CellStyleXfs);
				WriteCellStyleXfs(styles.m_oCellStyleXfs.get());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			
			if(styles.m_oCellXfs.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSerStylesTypes::CellXfs);
				WriteCellXfs(styles.m_oCellXfs.get());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			
			if(styles.m_oCellStyles.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSerStylesTypes::CellStyles);
				WriteCellStyles(styles.m_oCellStyles.get());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			
			if(styles.m_oDxfs.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSerStylesTypes::Dxfs);
				WriteDxfs(styles.m_oDxfs.get(), pIndexedColors, pTheme, oFontProcessor);
				m_oBcw.WriteItemEnd(nCurPos);
			}
			
			if(styles.m_oTableStyles.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSerStylesTypes::TableStyles);
				WriteTableStyles(styles.m_oTableStyles.get());
				m_oBcw.WriteItemEnd(nCurPos);
			}
		};
		void WriteBorders(const OOX::Spreadsheet::CBorders& borders, OOX::Spreadsheet::CIndexedColors* pIndexedColors, OOX::CTheme* pTheme)
		{
			int nCurPos = 0;
			for(int i = 0, length = borders.m_arrItems.GetSize(); i < length; ++i)
			{
					OOX::Spreadsheet::CBorder* pBorder = borders.m_arrItems[i];
					nCurPos = m_oBcw.WriteItemStart(c_oSerStylesTypes::Border);
					WriteBorder(*pBorder, pIndexedColors, pTheme);
					m_oBcw.WriteItemEnd(nCurPos);
			}
		};
		void WriteBorder(const OOX::Spreadsheet::CBorder& border, OOX::Spreadsheet::CIndexedColors* pIndexedColors, OOX::CTheme* pTheme)
		{
			int nCurPos = 0;
			
			if(false != border.m_oBottom.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSerBorderTypes::Bottom);
				WriteBorderProp(border.m_oBottom.get(), pIndexedColors, pTheme);
				m_oBcw.WriteItemEnd(nCurPos);
			}
			
			if(false != border.m_oDiagonal.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSerBorderTypes::Diagonal);
				WriteBorderProp(border.m_oDiagonal.get(), pIndexedColors, pTheme);
				m_oBcw.WriteItemEnd(nCurPos);
			}
			
			if(false != border.m_oEnd.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSerBorderTypes::End);
				WriteBorderProp(border.m_oEnd.get(), pIndexedColors, pTheme);
				m_oBcw.WriteItemEnd(nCurPos);
			}
			
			if(false != border.m_oHorizontal.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSerBorderTypes::Horizontal);
				WriteBorderProp(border.m_oHorizontal.get(), pIndexedColors, pTheme);
				m_oBcw.WriteItemEnd(nCurPos);
			}
			
			if(false != border.m_oStart.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSerBorderTypes::Start);
				WriteBorderProp(border.m_oStart.get(), pIndexedColors, pTheme);
				m_oBcw.WriteItemEnd(nCurPos);
			}
			
			if(false != border.m_oTop.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSerBorderTypes::Top);
				WriteBorderProp(border.m_oTop.get(), pIndexedColors, pTheme);
				m_oBcw.WriteItemEnd(nCurPos);
			}
			
			if(false != border.m_oVertical.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSerBorderTypes::Vertical);
				WriteBorderProp(border.m_oVertical.get(), pIndexedColors, pTheme);
				m_oBcw.WriteItemEnd(nCurPos);
			}
			
			if(false != border.m_oDiagonalDown.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSerBorderTypes::DiagonalDown);
				m_oBcw.m_oStream.WriteBool(border.m_oDiagonalDown->ToBool());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			
			if(false != border.m_oDiagonalUp.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSerBorderTypes::DiagonalUp);
				m_oBcw.m_oStream.WriteBool(border.m_oDiagonalUp->ToBool());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			
			if(false != border.m_oOutline.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSerBorderTypes::Outline);
				m_oBcw.m_oStream.WriteBool(border.m_oOutline->ToBool());
				m_oBcw.WriteItemEnd(nCurPos);
			}
		};
		void WriteBorderProp(const OOX::Spreadsheet::CBorderProp& borderProp, OOX::Spreadsheet::CIndexedColors* pIndexedColors, OOX::CTheme* pTheme)
		{
			int nCurPos = 0;
			
			if(false != borderProp.m_oColor.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerBorderPropTypes::Color);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);
				nCurPos = m_oBcw.WriteItemWithLengthStart();
				m_oBcw.WriteColor(borderProp.m_oColor.get(), pIndexedColors, pTheme);
				m_oBcw.WriteItemWithLengthEnd(nCurPos);
			}
			
			if(false != borderProp.m_oStyle.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerBorderPropTypes::Style);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteByte((byte)borderProp.m_oStyle->GetValue());
			}
		};
		void WriteCellStyleXfs(const OOX::Spreadsheet::CCellStyleXfs& cellStyleXfs)
		{
			int nCurPos = 0;
			for(int i = 0, length = cellStyleXfs.m_arrItems.GetSize(); i < length; ++i)
			{
				OOX::Spreadsheet::WritingElement* we = cellStyleXfs.m_arrItems[i];
				if(OOX::Spreadsheet::et_Xfs == we->getType())
				{
					OOX::Spreadsheet::CXfs* pXfs = static_cast<OOX::Spreadsheet::CXfs*>(we);
					nCurPos = m_oBcw.WriteItemStart(c_oSerStylesTypes::Xfs);
					WriteXfs(*pXfs);
					m_oBcw.WriteItemEnd(nCurPos);
				}
			}
		}
		void WriteCellXfs(const OOX::Spreadsheet::CCellXfs& cellXfs)
		{
			int nCurPos = 0;
			for(int i = 0, length = cellXfs.m_arrItems.GetSize(); i < length; ++i)
			{
				OOX::Spreadsheet::WritingElement* we = cellXfs.m_arrItems[i];
				if(OOX::Spreadsheet::et_Xfs == we->getType())
				{
					OOX::Spreadsheet::CXfs* pXfs = static_cast<OOX::Spreadsheet::CXfs*>(we);
					nCurPos = m_oBcw.WriteItemStart(c_oSerStylesTypes::Xfs);
					WriteXfs(*pXfs);
					m_oBcw.WriteItemEnd(nCurPos);
				}
			}
		};
		void WriteXfs(const OOX::Spreadsheet::CXfs& xfs)
		{
			int nCurPos = 0;
			
			if(false != xfs.m_oApplyAlignment.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerXfsTypes::ApplyAlignment);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteBool(xfs.m_oApplyAlignment->ToBool());
			}
			
			if(false != xfs.m_oApplyBorder.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerXfsTypes::ApplyBorder);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteBool(xfs.m_oApplyBorder->ToBool());
			}
			
			if(false != xfs.m_oApplyFill.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerXfsTypes::ApplyFill);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteBool(xfs.m_oApplyFill->ToBool());
			}
			
			if(false != xfs.m_oApplyFont.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerXfsTypes::ApplyFont);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteBool(xfs.m_oApplyFont->ToBool());
			}
			
			if(false != xfs.m_oApplyNumberFormat.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerXfsTypes::ApplyNumberFormat);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteBool(xfs.m_oApplyNumberFormat->ToBool());
			}
			
			if(false != xfs.m_oBorderId.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerXfsTypes::BorderId);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Long);
				m_oBcw.m_oStream.WriteLong(xfs.m_oBorderId->GetValue());
			}
			
			if(false != xfs.m_oFillId.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerXfsTypes::FillId);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Long);
				m_oBcw.m_oStream.WriteLong(xfs.m_oFillId->GetValue());
			}
			
			if(false != xfs.m_oFontId.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerXfsTypes::FontId);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Long);
				m_oBcw.m_oStream.WriteLong(xfs.m_oFontId->GetValue());
			}
			
			if(false != xfs.m_oNumFmtId.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerXfsTypes::NumFmtId);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Long);
				m_oBcw.m_oStream.WriteLong(xfs.m_oNumFmtId->GetValue());
			}
			
			if(false != xfs.m_oQuotePrefix.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerXfsTypes::QuotePrefix);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteBool(xfs.m_oQuotePrefix->ToBool());
			}
			
			if (false != xfs.m_oXfId.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerXfsTypes::XfId);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Long);
				m_oBcw.m_oStream.WriteLong(xfs.m_oXfId->GetValue());
			}
			
			if(false != xfs.m_oAligment.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerXfsTypes::Aligment);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);
				nCurPos = m_oBcw.WriteItemWithLengthStart();
				WriteAligment(xfs.m_oAligment.get());
				m_oBcw.WriteItemWithLengthEnd(nCurPos);
			}
		};
		void WriteAligment(const OOX::Spreadsheet::CAligment& aligment)
		{
			int nCurPos = 0;
			
			if(false != aligment.m_oHorizontal.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerAligmentTypes::Horizontal);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteByte(aligment.m_oHorizontal->GetValue());
			}
			
			if(false != aligment.m_oIndent.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerAligmentTypes::Indent);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Long);
				m_oBcw.m_oStream.WriteLong(aligment.m_oIndent->GetValue());
			}
			
			if(false != aligment.m_oRelativeIndent.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerAligmentTypes::RelativeIndent);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Long);
				m_oBcw.m_oStream.WriteLong(aligment.m_oRelativeIndent->GetValue());
			}
			
			if(false != aligment.m_oShrinkToFit.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerAligmentTypes::ShrinkToFit);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteBool(aligment.m_oShrinkToFit->ToBool());
			}
			
			if(false != aligment.m_oTextRotation.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerAligmentTypes::TextRotation);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Long);
				m_oBcw.m_oStream.WriteLong(aligment.m_oTextRotation->GetValue());
			}
			
			if(false != aligment.m_oVertical.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerAligmentTypes::Vertical);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteByte(aligment.m_oVertical->GetValue());
			}
			
			if(false != aligment.m_oWrapText.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerAligmentTypes::WrapText);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteBool(aligment.m_oWrapText->ToBool());
			}
		}
		void WriteFills(const OOX::Spreadsheet::CFills& fills, OOX::Spreadsheet::CIndexedColors* pIndexedColors, OOX::CTheme* pTheme)
		{
			int nCurPos = 0;
			for(int i = 0, length = fills.m_arrItems.GetSize(); i < length; ++i)
			{
					OOX::Spreadsheet::CFill* pFill = fills.m_arrItems[i];
					nCurPos = m_oBcw.WriteItemStart(c_oSerStylesTypes::Fill);
					WriteFill(*pFill, pIndexedColors, pTheme, false);
					m_oBcw.WriteItemEnd(nCurPos);
			}
		};
		void WriteFill(const OOX::Spreadsheet::CFill& fill, OOX::Spreadsheet::CIndexedColors* pIndexedColors, OOX::CTheme* pTheme, bool bPriorityBg = false)
		{
			int nCurPos = 0;
			
			OOX::Spreadsheet::CColor* pColor = NULL;
			if(fill.m_oPatternFill.IsInit())
			{
				if((false == fill.m_oPatternFill->m_oPatternType.IsInit() || SimpleTypes::Spreadsheet::patterntypeNone != fill.m_oPatternFill->m_oPatternType->GetValue()))
				{
					if(bPriorityBg)
					{
						if(fill.m_oPatternFill->m_oBgColor.IsInit())
							pColor = fill.m_oPatternFill->m_oBgColor.operator ->();
						else if(fill.m_oPatternFill->m_oFgColor.IsInit())
							pColor = fill.m_oPatternFill->m_oFgColor.operator ->();
					}
					else
					{
						if(fill.m_oPatternFill->m_oFgColor.IsInit())
							pColor = fill.m_oPatternFill->m_oFgColor.operator ->();
						else if(fill.m_oPatternFill->m_oBgColor.IsInit())
							pColor = fill.m_oPatternFill->m_oBgColor.operator ->();
					}
				}
			}
			else
			{
				
				if(fill.m_oGradientFill.IsInit())
				{
					const OOX::Spreadsheet::CGradientFill& gradient = fill.m_oGradientFill.get();
					if(gradient.m_arrItems.GetSize() > 0)
					{
						OOX::Spreadsheet::CGradientStop* pStop = gradient.m_arrItems[0];
						if(pStop->m_oColor.IsInit())
						{
							pColor = pStop->m_oColor.operator ->();
						}
					}
				}
			}
			if(NULL != pColor)
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSerFillTypes::PatternFill);
				int nCurPos2 = m_oBcw.WriteItemStart(c_oSerFillTypes::PatternFillBgColor);
				m_oBcw.WriteColor(*pColor, pIndexedColors, pTheme);
				m_oBcw.WriteItemEnd(nCurPos2);
				m_oBcw.WriteItemEnd(nCurPos);
			}
		};
		void WriteFonts(const OOX::Spreadsheet::CFonts& fonts, OOX::Spreadsheet::CIndexedColors* pIndexedColors, OOX::CTheme* pTheme, BinXlsxRW::FontProcessor& oFontProcessor)
		{
			int nCurPos = 0;
			for(int i = 0, length = fonts.m_arrItems.GetSize(); i < length; ++i)
			{
					OOX::Spreadsheet::CFont* pFont = fonts.m_arrItems[i];
					nCurPos = m_oBcw.WriteItemStart(c_oSerStylesTypes::Font);
					WriteFont(*pFont, pIndexedColors, pTheme, oFontProcessor);
					m_oBcw.WriteItemEnd(nCurPos);
			}
		};
		void WriteFont(const OOX::Spreadsheet::CFont& font, OOX::Spreadsheet::CIndexedColors* pIndexedColors, OOX::CTheme* theme, BinXlsxRW::FontProcessor& oFontProcessor)
		{
			int nCurPos = 0;
			
			if(false != font.m_oBold.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerFontTypes::Bold);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteBool(font.m_oBold->m_oVal.ToBool());
			}
			
			if(false != font.m_oColor.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerFontTypes::Color);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);
				nCurPos = m_oBcw.WriteItemWithLengthStart();
				m_oBcw.WriteColor(font.m_oColor.get(), pIndexedColors, theme);
				m_oBcw.WriteItemWithLengthEnd(nCurPos);
			}
			
			if(false != font.m_oItalic.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerFontTypes::Italic);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteBool(font.m_oItalic->m_oVal.ToBool());
			}
			
			CString sFont;
			if(NULL != theme && font.m_oScheme.IsInit() && font.m_oScheme->m_oFontScheme.IsInit())
			{
				SimpleTypes::Spreadsheet::EFontScheme eFontScheme = font.m_oScheme->m_oFontScheme->GetValue();
				if(SimpleTypes::Spreadsheet::fontschemeMajor == eFontScheme)
					sFont = theme->GetMajorFontOrEmpty();
				else if(SimpleTypes::Spreadsheet::fontschemeMinor == eFontScheme)
					sFont = theme->GetMinorFontOrEmpty();
			}
			if(sFont.IsEmpty() && font.m_oRFont.IsInit() && font.m_oRFont->m_sVal.IsInit())
				sFont = font.m_oRFont->ToString2();
			if(!sFont.IsEmpty())
			{
				
				sFont = oFontProcessor.getFont(sFont);
				m_oBcw.m_oStream.WriteByte(c_oSerFontTypes::RFont);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);
				m_oBcw.m_oStream.WriteString2(sFont);

				if(NULL != m_pEmbeddedFontsManager)
					m_pEmbeddedFontsManager->CheckFont(sFont, oFontProcessor.getFontManager());
			}
			
			if(font.m_oScheme.IsInit() && font.m_oScheme->m_oFontScheme.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerFontTypes::Scheme);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteByte((BYTE)font.m_oScheme->m_oFontScheme->GetValue());
			}
			
			if(false != font.m_oStrike.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerFontTypes::Strike);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteBool(font.m_oStrike->m_oVal.ToBool());
			}
			
			if(false != font.m_oSz.IsInit() && font.m_oSz->m_oVal.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerFontTypes::Sz);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
				m_oBcw.m_oStream.WriteDouble(font.m_oSz->m_oVal->GetValue());
			}
			
			if(false != font.m_oUnderline.IsInit())
			{
				SimpleTypes::Spreadsheet::EUnderline eType = SimpleTypes::Spreadsheet::underlineSingle;
				if(font.m_oUnderline->m_oUnderline.IsInit())
					eType = font.m_oUnderline->m_oUnderline->GetValue();
				
				m_oBcw.m_oStream.WriteByte(c_oSerFontTypes::Underline);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteByte(eType);
			}
			
			if(false != font.m_oVertAlign.IsInit() && font.m_oVertAlign->m_oVerticalAlign.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerFontTypes::VertAlign);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteByte(font.m_oVertAlign->m_oVerticalAlign->GetValue());
			}
		};
		void WriteNumFmts(const OOX::Spreadsheet::CNumFmts& numFmts)
		{
			int nCurPos = 0;
			for(int i = 0, length = numFmts.m_arrItems.GetSize(); i < length; ++i)
			{
				OOX::Spreadsheet::CNumFmt* pNumFmt = numFmts.m_arrItems[i];
				nCurPos = m_oBcw.WriteItemStart(c_oSerStylesTypes::NumFmt);
				WriteNumFmt(*pNumFmt);
				m_oBcw.WriteItemEnd(nCurPos);
			}
		};
		void WriteNumFmt(const OOX::Spreadsheet::CNumFmt& numFmt)
		{
			int nCurPos = 0;
			
			if(numFmt.m_oFormatCode.IsInit())
			{
				CString& sFormatCode = numFmt.m_oFormatCode.get2();
				m_oBcw.m_oStream.WriteByte(c_oSerNumFmtTypes::FormatCode);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);
				m_oBcw.m_oStream.WriteString2(sFormatCode);

				if(NULL != m_pEmbeddedFontsManager)
					m_pEmbeddedFontsManager->CheckString(sFormatCode);
			}
			
			if(numFmt.m_oNumFmtId.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerNumFmtTypes::NumFmtId);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Long);
				m_oBcw.m_oStream.WriteLong(numFmt.m_oNumFmtId->GetValue());
			}
		};
		void WriteCellStyles(const OOX::Spreadsheet::CCellStyles& oCellStyles)
		{
			int nCurPos = 0;
			for (int i = 0, nLength = oCellStyles.m_arrItems.GetSize(); i < nLength; ++i)
			{
				OOX::Spreadsheet::WritingElement* we = oCellStyles.m_arrItems[i];
				if (OOX::Spreadsheet::et_CellStyle == we->getType())
				{
					OOX::Spreadsheet::CCellStyle* pCellStyle = static_cast<OOX::Spreadsheet::CCellStyle*>(we);
					nCurPos = m_oBcw.WriteItemStart(c_oSerStylesTypes::CellStyle);
					WriteCellStyle(*pCellStyle);
					m_oBcw.WriteItemEnd(nCurPos);
				}
			}
		}
		void WriteCellStyle(const OOX::Spreadsheet::CCellStyle& oCellStyle)
		{
			int nCurPos = 0;
			if (oCellStyle.m_oBuiltinId.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_CellStyle::BuiltinId);
				m_oBcw.m_oStream.WriteLong(oCellStyle.m_oBuiltinId->GetValue());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			if (oCellStyle.m_oCustomBuiltin.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_CellStyle::CustomBuiltin);
				m_oBcw.m_oStream.WriteBool(oCellStyle.m_oCustomBuiltin->ToBool());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			if (oCellStyle.m_oHidden.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_CellStyle::Hidden);
				m_oBcw.m_oStream.WriteBool(oCellStyle.m_oHidden->ToBool());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			if (oCellStyle.m_oILevel.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_CellStyle::ILevel);
				m_oBcw.m_oStream.WriteLong(oCellStyle.m_oILevel->GetValue());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			if (oCellStyle.m_oName.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_CellStyle::Name);
				m_oBcw.m_oStream.WriteString2(oCellStyle.m_oName.get2());
			}
			if (oCellStyle.m_oXfId.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_CellStyle::XfId);
				m_oBcw.m_oStream.WriteLong(oCellStyle.m_oXfId->GetValue());
				m_oBcw.WriteItemEnd(nCurPos);
			}
		}
		void WriteDxfs(const OOX::Spreadsheet::CDxfs& oDxfs, OOX::Spreadsheet::CIndexedColors* pIndexedColors, OOX::CTheme* pTheme, BinXlsxRW::FontProcessor& oFontProcessor)
		{
			int nCurPos = 0;
			for(int i = 0, length = oDxfs.m_arrItems.GetSize(); i < length; ++i)
			{
				OOX::Spreadsheet::CDxf* pDxf = oDxfs.m_arrItems[i];
				nCurPos = m_oBcw.WriteItemStart(c_oSerStylesTypes::Dxf);
				WriteDxf(*pDxf, pIndexedColors, pTheme, oFontProcessor);
				m_oBcw.WriteItemEnd(nCurPos);
			}
		};
		void WriteDxf(const OOX::Spreadsheet::CDxf& oDxf, OOX::Spreadsheet::CIndexedColors* pIndexedColors, OOX::CTheme* pTheme, BinXlsxRW::FontProcessor& oFontProcessor)
		{
			int nCurPos = 0;
			if(oDxf.m_oAlignment.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_Dxf::Alignment);
				WriteAligment(oDxf.m_oAlignment.get());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			if(oDxf.m_oBorder.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_Dxf::Border);
				WriteBorder(oDxf.m_oBorder.get(), pIndexedColors, pTheme);
				m_oBcw.WriteItemEnd(nCurPos);
			}
			if(oDxf.m_oFill.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_Dxf::Fill);
				WriteFill(oDxf.m_oFill.get(), pIndexedColors, pTheme, true);
				m_oBcw.WriteItemEnd(nCurPos);
			}
			if(oDxf.m_oFont.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_Dxf::Font);
				WriteFont(oDxf.m_oFont.get(), pIndexedColors, pTheme, oFontProcessor);
				m_oBcw.WriteItemEnd(nCurPos);
			}
			if(oDxf.m_oNumFmt.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_Dxf::NumFmt);
				WriteNumFmt(oDxf.m_oNumFmt.get());
				m_oBcw.WriteItemEnd(nCurPos);
			}
		}
		void WriteTableStyles(const OOX::Spreadsheet::CTableStyles& oTableStyles)
		{
			int nCurPos = 0;
			if(oTableStyles.m_oDefaultTableStyle.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_TableStyles::DefaultTableStyle);
				m_oBcw.m_oStream.WriteString2(oTableStyles.m_oDefaultTableStyle.get2());
			}
			if(oTableStyles.m_oDefaultPivotStyle.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_TableStyles::DefaultPivotStyle);
				m_oBcw.m_oStream.WriteString2(oTableStyles.m_oDefaultPivotStyle.get2());
			}
			if(oTableStyles.m_arrItems.GetSize() > 0)
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_TableStyles::TableStyles);
				WriteTableCustomStyles(oTableStyles.m_arrItems);
				m_oBcw.WriteItemEnd(nCurPos);
			}
		}
		void WriteTableCustomStyles(const CSimpleArray<OOX::Spreadsheet::CTableStyle *>& aTableStyles)
		{
			int nCurPos = 0;
			for(int i = 0, length = aTableStyles.GetSize(); i < length; ++i)
			{
				OOX::Spreadsheet::CTableStyle* pTableStyle = aTableStyles[i];
				nCurPos = m_oBcw.WriteItemStart(c_oSer_TableStyles::TableStyle);
				WriteTableStyle(*pTableStyle);
				m_oBcw.WriteItemEnd(nCurPos);
			}
		}
		void WriteTableStyle(const OOX::Spreadsheet::CTableStyle& oTableStyle)
		{
			int nCurPos = 0;
			if(oTableStyle.m_oName.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_TableStyle::Name);
				m_oBcw.m_oStream.WriteString2(oTableStyle.m_oName.get2());
			}
			if(oTableStyle.m_oPivot.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_TableStyle::Pivot);
				m_oBcw.m_oStream.WriteBool(oTableStyle.m_oPivot->ToBool());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			if(oTableStyle.m_oTable.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_TableStyle::Table);
				m_oBcw.m_oStream.WriteBool(oTableStyle.m_oTable->ToBool());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			if(oTableStyle.m_arrItems.GetSize() > 0)
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_TableStyle::Elements);
				WriteTableStyleElements(oTableStyle.m_arrItems);
				m_oBcw.WriteItemEnd(nCurPos);
			}
			if(oTableStyle.m_oDisplayName.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_TableStyle::DisplayName);
				m_oBcw.m_oStream.WriteString2(oTableStyle.m_oDisplayName.get2());
			}
		}
		void WriteTableStyleElements(const CSimpleArray<OOX::Spreadsheet::CTableStyleElement *>& aTableStyles)
		{
			int nCurPos = 0;
			for(int i = 0, length = aTableStyles.GetSize(); i < length; ++i)
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_TableStyle::Element);
				WriteTableStyleElement(*aTableStyles[i]);
				m_oBcw.WriteItemEnd(nCurPos);
			}
		}
		void WriteTableStyleElement(const OOX::Spreadsheet::CTableStyleElement& oTableStyleElement)
		{
			int nCurPos = 0;
			if(oTableStyleElement.m_oType.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_TableStyleElement::Type);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteByte((BYTE)oTableStyleElement.m_oType->GetValue());
			}
			if(oTableStyleElement.m_oSize.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_TableStyleElement::Size);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Long);
				m_oBcw.m_oStream.WriteLong(oTableStyleElement.m_oSize->GetValue());
			}
			if(oTableStyleElement.m_oDxfId.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_TableStyleElement::DxfId);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Long);
				m_oBcw.m_oStream.WriteLong(oTableStyleElement.m_oDxfId->GetValue());
			}
		}
	};
	class BinarySharedStringTableWriter
	{
		BinaryCommonWriter m_oBcw;
		NSFontCutter::CEmbeddedFontsManager* m_pEmbeddedFontsManager;
	public:
		BinarySharedStringTableWriter(Streams::CBufferedStream &oCBufferedStream, NSFontCutter::CEmbeddedFontsManager* pEmbeddedFontsManager):m_oBcw(oCBufferedStream),m_pEmbeddedFontsManager(pEmbeddedFontsManager)
		{
		};
		void Write(OOX::Spreadsheet::CSharedStrings& sharedString, OOX::Spreadsheet::CIndexedColors* pIndexedColors, OOX::CTheme* pTheme, BinXlsxRW::FontProcessor& oFontProcessor)
		{
			int nStart = m_oBcw.WriteItemWithLengthStart();
			WriteSharedStrings(sharedString, pIndexedColors, pTheme, oFontProcessor);
			m_oBcw.WriteItemWithLengthEnd(nStart);
		};
		void WriteSharedStrings(OOX::Spreadsheet::CSharedStrings& sharedString, OOX::Spreadsheet::CIndexedColors* pIndexedColors, OOX::CTheme* pTheme, BinXlsxRW::FontProcessor& oFontProcessor)
		{
			int nCurPos;
			for(int i = 0, length = sharedString.m_arrItems.GetSize(); i < length; ++i)
			{
				OOX::Spreadsheet::WritingElement* we = sharedString.m_arrItems[i];
				if(OOX::Spreadsheet::et_Si == we->getType())
				{
					OOX::Spreadsheet::CSi* pSi = static_cast<OOX::Spreadsheet::CSi*>(we);
					nCurPos = m_oBcw.WriteItemStart(c_oSerSharedStringTypes::Si);
					WriteSharedString(*pSi, pIndexedColors, pTheme, oFontProcessor);
					m_oBcw.WriteItemWithLengthEnd(nCurPos);
				}
			}
		};
		void WriteSharedString(OOX::Spreadsheet::CSi& si, OOX::Spreadsheet::CIndexedColors* pIndexedColors, OOX::CTheme* pTheme, BinXlsxRW::FontProcessor& oFontProcessor)
		{
			int nCurPos;
			for(int i = 0, length = si.m_arrItems.GetSize(); i < length; ++i)
			{
				OOX::Spreadsheet::WritingElement* we = si.m_arrItems[i];
				if(OOX::Spreadsheet::et_r == we->getType())
				{
					OOX::Spreadsheet::CRun* pRun = static_cast<OOX::Spreadsheet::CRun*>(we);
					nCurPos = m_oBcw.WriteItemStart(c_oSerSharedStringTypes::Run);
					WriteRun(*pRun, pIndexedColors, pTheme, oFontProcessor);
					m_oBcw.WriteItemWithLengthEnd(nCurPos);
				}
				else if(OOX::Spreadsheet::et_t == we->getType())
				{
					OOX::Spreadsheet::CText* pText = static_cast<OOX::Spreadsheet::CText*>(we);
					m_oBcw.m_oStream.WriteByte(c_oSerSharedStringTypes::Text);
					m_oBcw.m_oStream.WriteString2(pText->m_sText);

					if(NULL != m_pEmbeddedFontsManager)
						m_pEmbeddedFontsManager->CheckString(pText->m_sText);
				}
			}
		};
		void WriteRun(OOX::Spreadsheet::CRun& run, OOX::Spreadsheet::CIndexedColors* pIndexedColors, OOX::CTheme* pTheme, BinXlsxRW::FontProcessor& oFontProcessor)
		{
			int nCurPos;
			
			if(run.m_oRPr.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSerSharedStringTypes::RPr);
				WriteRPr(run.m_oRPr.get(), pIndexedColors, pTheme, oFontProcessor);
				m_oBcw.WriteItemWithLengthEnd(nCurPos);
			}
			for(int i = 0, length = run.m_arrItems.GetSize(); i < length; ++i)
			{
				OOX::Spreadsheet::WritingElement* we = run.m_arrItems[i];
				if(OOX::Spreadsheet::et_t == we->getType())
				{
					OOX::Spreadsheet::CText* pText = static_cast<OOX::Spreadsheet::CText*>(we);
					m_oBcw.m_oStream.WriteByte(c_oSerSharedStringTypes::Text);
					m_oBcw.m_oStream.WriteString2(pText->m_sText);

					if(NULL != m_pEmbeddedFontsManager)
						m_pEmbeddedFontsManager->CheckString(pText->m_sText);
				}
			}
		};
		void WriteRPr(const OOX::Spreadsheet::CRPr& rPr, OOX::Spreadsheet::CIndexedColors* pIndexedColors, OOX::CTheme* pTheme, BinXlsxRW::FontProcessor& oFontProcessor)
		{
			int nCurPos = 0;
			
			if(false != rPr.m_oBold.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerFontTypes::Bold);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteBool(rPr.m_oBold->m_oVal.ToBool());
			}
			
			if(false != rPr.m_oColor.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerFontTypes::Color);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);
				nCurPos = m_oBcw.WriteItemWithLengthStart();
				m_oBcw.WriteColor(rPr.m_oColor.get(), pIndexedColors, pTheme);
				m_oBcw.WriteItemWithLengthEnd(nCurPos);
			}
			
			if(false != rPr.m_oItalic.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerFontTypes::Italic);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteBool(rPr.m_oItalic->m_oVal.ToBool());
			}
			
			if(false != rPr.m_oRFont.IsInit() && rPr.m_oRFont->m_sVal.IsInit())
			{
				CString sFont = rPr.m_oRFont->m_sVal.get();
				if(!sFont.IsEmpty())
				{
					sFont = oFontProcessor.getFont(sFont);
					m_oBcw.m_oStream.WriteByte(c_oSerFontTypes::RFont);
					m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);
					m_oBcw.m_oStream.WriteString2(sFont);

					if(NULL != m_pEmbeddedFontsManager)
						m_pEmbeddedFontsManager->CheckFont(sFont, oFontProcessor.getFontManager());
				}
			}
			
			if(rPr.m_oScheme.IsInit() && rPr.m_oScheme->m_oFontScheme.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerFontTypes::Scheme);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteByte((BYTE)rPr.m_oScheme->m_oFontScheme->GetValue());
			}
			
			if(false != rPr.m_oStrike.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerFontTypes::Strike);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteBool(rPr.m_oStrike->m_oVal.ToBool());
			}
			
			if(false != rPr.m_oSz.IsInit() && rPr.m_oSz->m_oVal.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerFontTypes::Sz);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
				m_oBcw.m_oStream.WriteDouble(rPr.m_oSz->m_oVal->GetValue());
			}
			
			if(false != rPr.m_oUnderline.IsInit())
			{
				SimpleTypes::Spreadsheet::EUnderline eType = SimpleTypes::Spreadsheet::underlineSingle;
				if(rPr.m_oUnderline->m_oUnderline.IsInit())
					eType = rPr.m_oUnderline->m_oUnderline->GetValue();
				
				m_oBcw.m_oStream.WriteByte(c_oSerFontTypes::Underline);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteByte(eType);
			}
			
			if(false != rPr.m_oVertAlign.IsInit() && rPr.m_oVertAlign->m_oVerticalAlign.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerFontTypes::VertAlign);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteByte(rPr.m_oVertAlign->m_oVerticalAlign->GetValue());
			}
		};

	};
	class BinaryWorkbookTableWriter
	{
		BinaryCommonWriter m_oBcw;
	public:
		BinaryWorkbookTableWriter(Streams::CBufferedStream &oCBufferedStream):m_oBcw(oCBufferedStream)
		{
		};
		void Write(OOX::Spreadsheet::CWorkbook& workbook)
		{
			int nStart = m_oBcw.WriteItemWithLengthStart();
			WriteWorkbook(workbook);
			m_oBcw.WriteItemWithLengthEnd(nStart);
		};
		void WriteWorkbook(OOX::Spreadsheet::CWorkbook& workbook)
		{
			int nCurPos;
			
			if(workbook.m_oWorkbookPr.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSerWorkbookTypes::WorkbookPr);
				WriteWorkbookPr(workbook.m_oWorkbookPr.get());
				m_oBcw.WriteItemWithLengthEnd(nCurPos);
			}
			
			if(workbook.m_oBookViews.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSerWorkbookTypes::BookViews);
				WriteBookViews(workbook.m_oBookViews.get());
				m_oBcw.WriteItemWithLengthEnd(nCurPos);
			}
			
			if(workbook.m_oDefinedNames.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSerWorkbookTypes::DefinedNames);
				WriteDefinedNames(workbook.m_oDefinedNames.get());
				m_oBcw.WriteItemWithLengthEnd(nCurPos);
			}
		};
		void WriteWorkbookPr(const OOX::Spreadsheet::CWorkbookPr& workbookPr)
		{
			
			if(workbookPr.m_oDate1904.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerWorkbookPrTypes::Date1904);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteBool(workbookPr.m_oDate1904->ToBool());
			}
			
			if(workbookPr.m_oDateCompatibility.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerWorkbookPrTypes::DateCompatibility);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteBool(workbookPr.m_oDateCompatibility->ToBool());
			}
		};
		void WriteBookViews(const OOX::Spreadsheet::CBookViews& bookViews)
		{
			int nCurPos;
			if(bookViews.m_arrItems.GetSize() > 0)
			{
				
				OOX::Spreadsheet::CWorkbookView* pWorkbookView = static_cast<OOX::Spreadsheet::CWorkbookView*>(bookViews.m_arrItems[0]);
				nCurPos = m_oBcw.WriteItemStart(c_oSerWorkbookTypes::WorkbookView);
				WriteWorkbookView(*pWorkbookView);
				m_oBcw.WriteItemWithLengthEnd(nCurPos);
			}
		};
		void WriteWorkbookView(const OOX::Spreadsheet::CWorkbookView& workbookView)
		{
			
			if(workbookView.m_oActiveTab.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerWorkbookViewTypes::ActiveTab);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Long);
				m_oBcw.m_oStream.WriteLong(workbookView.m_oActiveTab->GetValue());
			}
		};
		void WriteDefinedNames(const OOX::Spreadsheet::CDefinedNames& definedNames)
		{
			int nCurPos;
			for(int i = 0, length = definedNames.m_arrItems.GetSize(); i < length; ++i)
			{
				OOX::Spreadsheet::CDefinedName* pDefinedName = definedNames.m_arrItems[i];
				
				nCurPos = m_oBcw.WriteItemStart(c_oSerWorkbookTypes::DefinedName);
				WriteDefinedName(*pDefinedName);
				m_oBcw.WriteItemWithLengthEnd(nCurPos);
			}
		};
		void WriteDefinedName(const OOX::Spreadsheet::CDefinedName& definedName)
		{
			int nCurPos = 0;
			
			if(definedName.m_oName.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerDefinedNameTypes::Name);
				m_oBcw.m_oStream.WriteString2(definedName.m_oName.get2());
			}
			
			if(definedName.m_oRef.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerDefinedNameTypes::Ref);
				m_oBcw.m_oStream.WriteString2(definedName.m_oRef.get2());
			}
			
			if(definedName.m_oLocalSheetId.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSerDefinedNameTypes::LocalSheetId);
				m_oBcw.m_oStream.WriteLong(definedName.m_oLocalSheetId->GetValue());
				m_oBcw.WriteItemWithLengthEnd(nCurPos);		
			}
		};
	};
	class BinaryWorksheetTableWriter
	{
		BinaryCommonWriter m_oBcw;
		NSFontCutter::CEmbeddedFontsManager* m_pEmbeddedFontsManager;
		OOX::Spreadsheet::CIndexedColors* m_pIndexedColors;
		OOX::CTheme* m_pTheme;
		BinXlsxRW::FontProcessor& m_oFontProcessor;
		PPTXFile::IAVSOfficeDrawingConverter* m_pOfficeDrawingConverter;
	public:
		BinaryWorksheetTableWriter(Streams::CBufferedStream &oCBufferedStream, NSFontCutter::CEmbeddedFontsManager* pEmbeddedFontsManager, OOX::Spreadsheet::CIndexedColors* pIndexedColors, OOX::CTheme* pTheme, BinXlsxRW::FontProcessor& oFontProcessor, PPTXFile::IAVSOfficeDrawingConverter* pOfficeDrawingConverter):
		  m_oBcw(oCBufferedStream),m_pEmbeddedFontsManager(pEmbeddedFontsManager),m_pIndexedColors(pIndexedColors),m_pTheme(pTheme),m_oFontProcessor(oFontProcessor),m_pOfficeDrawingConverter(pOfficeDrawingConverter)
		{
		};
		void Write(OOX::Spreadsheet::CWorkbook& workbook, CAtlMap<CString, OOX::Spreadsheet::CWorksheet*>& aWorksheets)
		{
			int nStart = m_oBcw.WriteItemWithLengthStart();
			WriteWorksheets(workbook, aWorksheets);
			m_oBcw.WriteItemWithLengthEnd(nStart);
		};
		void WriteWorksheets(OOX::Spreadsheet::CWorkbook& workbook, CAtlMap<CString, OOX::Spreadsheet::CWorksheet*>& aWorksheets)
		{
			int nCurPos;
			
			if(workbook.m_oSheets.IsInit())
			{
				CSimpleArray<OOX::Spreadsheet::CSheet*>& aWs = workbook.m_oSheets->m_arrItems;
				for(int i = 0, length = aWs.GetSize(); i < length; ++i)
				{
					OOX::Spreadsheet::CSheet* pSheet = aWs[i];
					if(pSheet->m_oRid.IsInit())
					{
						CAtlMap<CString, OOX::Spreadsheet::CWorksheet*>::CPair* pair = aWorksheets.Lookup(pSheet->m_oRid->GetValue());
						if(NULL != pair)
						{
							nCurPos = m_oBcw.WriteItemStart(c_oSerWorksheetsTypes::Worksheet);
							WriteWorksheet(*pSheet, *pair->m_value);
							m_oBcw.WriteItemWithLengthEnd(nCurPos);
						}
					}
				}
			}
		};
		void WriteWorksheet(OOX::Spreadsheet::CSheet& oSheet, OOX::Spreadsheet::CWorksheet& oWorksheet)
		{
			int nCurPos;
			
			nCurPos = m_oBcw.WriteItemStart(c_oSerWorksheetsTypes::WorksheetProp);
			WriteWorksheetProp(oSheet);
			m_oBcw.WriteItemWithLengthEnd(nCurPos);

			
			if(oWorksheet.m_oCols.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSerWorksheetsTypes::Cols);
				WriteCols(oWorksheet.m_oCols.get());
				m_oBcw.WriteItemWithLengthEnd(nCurPos);
			}
			
			if(oWorksheet.m_oDimension.IsInit() && oWorksheet.m_oDimension->m_oRef.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerWorksheetsTypes::Dimension);
				m_oBcw.m_oStream.WriteString2(oWorksheet.m_oDimension->m_oRef.get2());
			}
			
			if(oWorksheet.m_oSheetViews.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSerWorksheetsTypes::SheetViews);
				WriteSheetViews(oWorksheet.m_oSheetViews.get());
				m_oBcw.WriteItemWithLengthEnd(nCurPos);
			}
			
			if(oWorksheet.m_oSheetFormatPr.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSerWorksheetsTypes::SheetFormatPr);
				WriteSheetFormatPr(oWorksheet.m_oSheetFormatPr.get());
				m_oBcw.WriteItemWithLengthEnd(nCurPos);
			}
			
			if(oWorksheet.m_oPageMargins.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSerWorksheetsTypes::PageMargins);
				WritePageMargins(oWorksheet.m_oPageMargins.get());
				m_oBcw.WriteItemWithLengthEnd(nCurPos);
			}
			
			if(oWorksheet.m_oPageSetup.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSerWorksheetsTypes::PageSetup);
				WritePageSetup(oWorksheet.m_oPageSetup.get());
				m_oBcw.WriteItemWithLengthEnd(nCurPos);
			}
			
			if(oWorksheet.m_oPrintOptions.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSerWorksheetsTypes::PrintOptions);
				WritePrintOptions(oWorksheet.m_oPrintOptions.get());
				m_oBcw.WriteItemWithLengthEnd(nCurPos);
			}
			
			if(oWorksheet.m_oHyperlinks.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSerWorksheetsTypes::Hyperlinks);
				WriteHyperlinks(oWorksheet.m_oHyperlinks.get(), oWorksheet);
				m_oBcw.WriteItemWithLengthEnd(nCurPos);
			}
			
			if(oWorksheet.m_oMergeCells.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSerWorksheetsTypes::MergeCells);
				WriteMergeCells(oWorksheet.m_oMergeCells.get());
				m_oBcw.WriteItemWithLengthEnd(nCurPos);
			}
			
			if(oWorksheet.m_oSheetData.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSerWorksheetsTypes::SheetData);
				WriteSheetData(oWorksheet.m_oSheetData.get());
				m_oBcw.WriteItemWithLengthEnd(nCurPos);
			}
			
			if (0 < oWorksheet.m_arrConditionalFormatting.GetCount())
			{
				WriteConditionalFormattings(oWorksheet.m_arrConditionalFormatting);
			}
			
			if(oWorksheet.m_oDrawing.IsInit() && oWorksheet.m_oDrawing->m_oId.IsInit())
			{
				smart_ptr<OOX::File> oFile = oWorksheet.Find(oWorksheet.m_oDrawing->m_oId->GetValue());
				if (oFile.IsInit() && OOX::Spreadsheet::FileTypes::Drawings == oFile->type())
				{
					OOX::Spreadsheet::CDrawing* pDrawing = (OOX::Spreadsheet::CDrawing*)oFile.operator->();
					CString sDrawingRelsPath = pDrawing->GetReadPath().GetPath();
					BSTR bstrDrawing = sDrawingRelsPath.AllocSysString();
					m_pOfficeDrawingConverter->SetRelsPath(bstrDrawing);
					SysFreeString(bstrDrawing);
					
					nCurPos = m_oBcw.WriteItemStart(c_oSerWorksheetsTypes::Drawings);
					WriteDrawings(pDrawing, sDrawingRelsPath);
					m_oBcw.WriteItemWithLengthEnd(nCurPos);
				}
			}
			
			if(oWorksheet.m_oAutofilter.IsInit())
			{
				BinaryTableWriter oBinaryTableWriter(m_oBcw.m_oStream);
				nCurPos = m_oBcw.WriteItemStart(c_oSerWorksheetsTypes::Autofilter);
				oBinaryTableWriter.WriteAutoFilter(oWorksheet.m_oAutofilter.get());
				m_oBcw.WriteItemWithLengthEnd(nCurPos);
			}
			
			if(oWorksheet.m_oTableParts.IsInit())
			{
				BinaryTableWriter oBinaryTableWriter(m_oBcw.m_oStream);
				nCurPos = m_oBcw.WriteItemStart(c_oSerWorksheetsTypes::TableParts);
				oBinaryTableWriter.Write(oWorksheet, oWorksheet.m_oTableParts.get());
				m_oBcw.WriteItemWithLengthEnd(nCurPos);
			}
			
			if(oWorksheet.m_mapComments.GetCount() > 0)
			{
				bool bIsEmpty = true;
				int nCurPos = 0;
				POSITION pos = oWorksheet.m_mapComments.GetStartPosition();
				while ( NULL != pos )
				{
					CAtlMap<CString, OOX::Spreadsheet::CCommentItem*>::CPair* pPair = oWorksheet.m_mapComments.GetNext( pos );
					if(pPair->m_value->IsValid())
					{
						bIsEmpty = false;
						break;
					}
				}
				if(false == bIsEmpty)
				{
					nCurPos = m_oBcw.WriteItemStart(c_oSerWorksheetsTypes::Comments);
					WriteComments(oWorksheet.m_mapComments);
					m_oBcw.WriteItemEnd(nCurPos);
				}
			}
			if (oWorksheet.m_oSheetPr.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSerWorksheetsTypes::SheetPr);
				WriteSheetPr(oWorksheet.m_oSheetPr.get());
				m_oBcw.WriteItemWithLengthEnd(nCurPos);
			}
		};
		void WriteWorksheetProp(OOX::Spreadsheet::CSheet& oSheet)
		{
			
			if(oSheet.m_oName.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerWorksheetPropTypes::Name);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);
				m_oBcw.m_oStream.WriteString2(oSheet.m_oName.get2());
			}
			
			if(oSheet.m_oSheetId.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerWorksheetPropTypes::SheetId);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Long);
				m_oBcw.m_oStream.WriteLong(oSheet.m_oSheetId->GetValue());
			}
			
			if(oSheet.m_oState.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerWorksheetPropTypes::State);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteByte(oSheet.m_oState->GetValue());
			}
		};
		void WriteCols(const OOX::Spreadsheet::CCols& oCols)
		{
			int nCurPos;
			for(int i = 0, length = oCols.m_arrItems.GetSize(); i < length; ++i)
			{
				OOX::Spreadsheet::CCol* pCol = oCols.m_arrItems[i];
				nCurPos = m_oBcw.WriteItemStart(c_oSerWorksheetsTypes::Col);
				WriteCol(*pCol);
				m_oBcw.WriteItemWithLengthEnd(nCurPos);
			}
		};
		void WriteCol(const OOX::Spreadsheet::CCol& oCol)
		{
			
			if(oCol.m_oBestFit.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerWorksheetColTypes::BestFit);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteBool(oCol.m_oBestFit->ToBool());
			}
			
			if(oCol.m_oHidden.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerWorksheetColTypes::Hidden);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteBool(oCol.m_oHidden->ToBool());
			}
			
			if(oCol.m_oMax.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerWorksheetColTypes::Max);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Long);
				m_oBcw.m_oStream.WriteLong(oCol.m_oMax->GetValue());
			}
			
			if(oCol.m_oMin.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerWorksheetColTypes::Min);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Long);
				m_oBcw.m_oStream.WriteLong(oCol.m_oMin->GetValue());
			}
			
			if(oCol.m_oStyle.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerWorksheetColTypes::Style);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Long);
				m_oBcw.m_oStream.WriteLong(oCol.m_oStyle->GetValue());
			}
			
			if(oCol.m_oWidth.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerWorksheetColTypes::Width);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
				m_oBcw.m_oStream.WriteDouble(oCol.m_oWidth->GetValue());
			}
			
			if(oCol.m_oCustomWidth.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerWorksheetColTypes::CustomWidth);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteByte(oCol.m_oCustomWidth->ToBool());
			}
		}

		void WriteSheetViews(const OOX::Spreadsheet::CSheetViews& oSheetViews)
		{
			int nCurPos = 0;
			for (int nIndex = 0, nLength = oSheetViews.m_arrItems.GetSize(); nIndex < nLength; ++nIndex)
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSerWorksheetsTypes::SheetView);
				WriteSheetView(*oSheetViews.m_arrItems[nIndex]);
				m_oBcw.WriteItemEnd(nCurPos);
			}
		}

		void WriteSheetView(const OOX::Spreadsheet::CSheetView& oSheetView)
		{
			int nCurPos = 0;

			if (oSheetView.m_oShowGridLines.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_SheetView::ShowGridLines);
				m_oBcw.m_oStream.WriteBool(oSheetView.m_oShowGridLines->ToBool());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			if (oSheetView.m_oShowRowColHeaders.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_SheetView::ShowRowColHeaders);
				m_oBcw.m_oStream.WriteBool(oSheetView.m_oShowRowColHeaders->ToBool());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			if (oSheetView.m_oPane.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_SheetView::Pane);
				WritePane(oSheetView.m_oPane.get());
				m_oBcw.WriteItemEnd(nCurPos);
			}
		}

		void WritePane(const OOX::Spreadsheet::CPane& oPane)
		{
			int nCurPos = 0;
			if (oPane.m_oState.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_Pane::State);
				m_oBcw.m_oStream.WriteString2(oPane.m_oState.get2());
			}
			if (oPane.m_oTopLeftCell.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_Pane::TopLeftCell);
				m_oBcw.m_oStream.WriteString2(oPane.m_oTopLeftCell.get2());
			}
		}

		void WriteSheetFormatPr(const OOX::Spreadsheet::CSheetFormatPr& oSheetFormatPr)
		{
			
			if(oSheetFormatPr.m_oDefaultColWidth.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerSheetFormatPrTypes::DefaultColWidth);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
				m_oBcw.m_oStream.WriteDouble(oSheetFormatPr.m_oDefaultColWidth->GetValue());
			}
			
			if(oSheetFormatPr.m_oDefaultRowHeight.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerSheetFormatPrTypes::DefaultRowHeight);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
				m_oBcw.m_oStream.WriteDouble(oSheetFormatPr.m_oDefaultRowHeight->GetValue());
			}
			
			if(oSheetFormatPr.m_oBaseColWidth.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerSheetFormatPrTypes::BaseColWidth);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Long);
				m_oBcw.m_oStream.WriteLong(oSheetFormatPr.m_oBaseColWidth->GetValue());
			}
		}
		void WritePageMargins(const OOX::Spreadsheet::CPageMargins& oPageMargins)
		{
			
			if(oPageMargins.m_oLeft.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_PageMargins::Left);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
				m_oBcw.m_oStream.WriteDouble(oPageMargins.m_oLeft->ToMm());
			}
			
			if(oPageMargins.m_oTop.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_PageMargins::Top);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
				m_oBcw.m_oStream.WriteDouble(oPageMargins.m_oTop->ToMm());
			}
			
			if(oPageMargins.m_oRight.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_PageMargins::Right);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
				m_oBcw.m_oStream.WriteDouble(oPageMargins.m_oRight->ToMm());
			}
			
			if(oPageMargins.m_oBottom.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_PageMargins::Bottom);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
				m_oBcw.m_oStream.WriteDouble(oPageMargins.m_oBottom->ToMm());
			}
			
			if(oPageMargins.m_oHeader.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_PageMargins::Header);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
				m_oBcw.m_oStream.WriteDouble(oPageMargins.m_oHeader->ToMm());
			}
			
			if(oPageMargins.m_oFooter.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_PageMargins::Footer);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
				m_oBcw.m_oStream.WriteDouble(oPageMargins.m_oFooter->ToMm());
			}
		}
		void WritePageSetup(const OOX::Spreadsheet::CPageSetup& oPageSetup)
		{
			
			if(oPageSetup.m_oOrientation.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_PageSetup::Orientation);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteByte(oPageSetup.m_oOrientation->GetValue());
			}
			
			if(oPageSetup.m_oPaperSize.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_PageSetup::PaperSize);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteByte(oPageSetup.m_oPaperSize->GetValue());
			}
		}
		void WritePrintOptions(const OOX::Spreadsheet::CPrintOptions& oPrintOptions)
		{
			
			bool bGridLines = false;
			if((oPrintOptions.m_oGridLines.IsInit() && oPrintOptions.m_oGridLines->ToBool()) || (oPrintOptions.m_oGridLinesSet.IsInit() && oPrintOptions.m_oGridLinesSet->ToBool()))
				bGridLines = true;
			m_oBcw.m_oStream.WriteByte(c_oSer_PrintOptions::GridLines);
			m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
			m_oBcw.m_oStream.WriteBool(bGridLines);
			
			if(oPrintOptions.m_oHeadings.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_PrintOptions::Headings);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteBool(oPrintOptions.m_oHeadings->ToBool());
			}
		}
		void WriteHyperlinks(const OOX::Spreadsheet::CHyperlinks& oHyperlinks, OOX::Spreadsheet::CWorksheet& oWorksheet)
		{
			int nCurPos;
			for(int i = 0, length = oHyperlinks.m_arrItems.GetSize(); i < length; ++i)
			{
				OOX::Spreadsheet::CHyperlink* pHyperlink = oHyperlinks.m_arrItems[i];
				nCurPos = m_oBcw.WriteItemStart(c_oSerWorksheetsTypes::Hyperlink);
				WriteHyperlink(*pHyperlink, oWorksheet);
				m_oBcw.WriteItemWithLengthEnd(nCurPos);
			}
		};
		void WriteHyperlink(const OOX::Spreadsheet::CHyperlink& oHyperlink, OOX::Spreadsheet::CWorksheet& oWorksheet)
		{
			CString sRef;
			CString sHyperlink;
			CString sLocation;
			if(oHyperlink.m_oRef.IsInit())
				sRef = oHyperlink.m_oRef.get();
			if(oHyperlink.m_oRid.IsInit())
			{
				if(NULL != oWorksheet.GetCurRls())
				{
					OOX::Rels::CRelationShip* oRels = NULL;
					oWorksheet.GetCurRls()->GetRel( OOX::RId(oHyperlink.m_oRid->GetValue()), &oRels);
					if(NULL != oRels && _T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink") == oRels->Type() )
					{
						if(oRels->IsExternal())
							sHyperlink = oRels->Target().GetPath();
					}
				}
			}
			if(oHyperlink.m_oLocation.IsInit())
				sLocation = oHyperlink.m_oLocation.get();
			if(!sRef.IsEmpty() && (!sHyperlink.IsEmpty() || !sLocation.IsEmpty()))
			{
				
				m_oBcw.m_oStream.WriteByte(c_oSerHyperlinkTypes::Ref);
				m_oBcw.m_oStream.WriteString2(sRef);
				
				if(!sHyperlink.IsEmpty())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerHyperlinkTypes::Hyperlink);
					m_oBcw.m_oStream.WriteString2(sHyperlink);
				}
				
				if(!sLocation.IsEmpty())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerHyperlinkTypes::Location);
					m_oBcw.m_oStream.WriteString2(sLocation);
				}
				
				if(oHyperlink.m_oTooltip.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerHyperlinkTypes::Tooltip);
					m_oBcw.m_oStream.WriteString2(oHyperlink.m_oTooltip.get2());
				}
			}
		};
		void WriteMergeCells(const OOX::Spreadsheet::CMergeCells& oMergeCells)
		{
			for(int i = 0, length = oMergeCells.m_arrItems.GetSize(); i < length; ++i)
			{
				OOX::Spreadsheet::CMergeCell* pMergeCell = oMergeCells.m_arrItems[i];
				if(pMergeCell->m_oRef.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSerWorksheetsTypes::MergeCell);
					m_oBcw.m_oStream.WriteString2(pMergeCell->m_oRef.get2());
				}
			}
		};
		void WriteSheetData(const OOX::Spreadsheet::CSheetData& oSheetData)
		{
			int nCurPos;
			for(int i = 0, length = oSheetData.m_arrItems.GetSize(); i < length; ++i)
			{
				OOX::Spreadsheet::CRow* pRow = oSheetData.m_arrItems[i];
				nCurPos = m_oBcw.WriteItemStart(c_oSerWorksheetsTypes::Row);
				WriteRow(*pRow);
				m_oBcw.WriteItemEnd(nCurPos);
			}
		};
		void WriteRow(const OOX::Spreadsheet::CRow& oRows)
		{
			int nCurPos;
			
			if(oRows.m_oR.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerRowTypes::Row);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Long);
				m_oBcw.m_oStream.WriteLong(oRows.m_oR->GetValue());
			}
			
			if(oRows.m_oS.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerRowTypes::Style);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Long);
				m_oBcw.m_oStream.WriteLong(oRows.m_oS->GetValue());
			}
			
			if(oRows.m_oHt.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerRowTypes::Height);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
				m_oBcw.m_oStream.WriteDouble(oRows.m_oHt->GetValue());
			}
			
			if(oRows.m_oHidden.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerRowTypes::Hidden);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteBool(oRows.m_oHidden->ToBool());
			}
			
			if(oRows.m_oCustomHeight.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerRowTypes::CustomHeight);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteBool(oRows.m_oCustomHeight->ToBool());
			}
			if(oRows.m_arrItems.GetSize() > 0)
			{
				m_oBcw.m_oStream.WriteByte(c_oSerRowTypes::Cells);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);
				nCurPos = m_oBcw.WriteItemWithLengthStart();
				WriteCells(oRows);
				m_oBcw.WriteItemWithLengthEnd(nCurPos);
			}
		};
		void WriteCells(const OOX::Spreadsheet::CRow& oRows)
		{
			int nCurPos;
			for(int i = 0, length = oRows.m_arrItems.GetSize(); i < length; ++i)
			{
				OOX::Spreadsheet::CCell* oCell =oRows.m_arrItems[i];
				nCurPos = m_oBcw.WriteItemStart(c_oSerRowTypes::Cell);
				WriteCell(*oCell);
				m_oBcw.WriteItemWithLengthEnd(nCurPos);
			}
		};
		void WriteCell(const OOX::Spreadsheet::CCell& oCell)
		{
			int nCurPos;
			
			if(oCell.m_oRef.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerCellTypes::Ref);
				m_oBcw.m_oStream.WriteString2(oCell.m_oRef.get2());
			}
			
			if(oCell.m_oStyle.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSerCellTypes::Style);
				m_oBcw.m_oStream.WriteLong(oCell.m_oStyle->GetValue());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			
			if(oCell.m_oType.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSerCellTypes::Type);
				m_oBcw.m_oStream.WriteByte(oCell.m_oType->GetValue());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			
			if(oCell.m_oFormula.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSerCellTypes::Formula);
				WriteFormula(oCell.m_oFormula.get2());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			
			if(oCell.m_oValue.IsInit())
			{
				double dValue = _wtof(oCell.m_oValue->ToString());

				nCurPos = m_oBcw.WriteItemStart(c_oSerCellTypes::Value);
				m_oBcw.m_oStream.WriteDouble(dValue);
				m_oBcw.WriteItemEnd(nCurPos);
			}
		};
		void WriteFormula(OOX::Spreadsheet::CFormula& oFormula)
		{
			
			if(oFormula.m_oAca.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerFormulaTypes::Aca);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteBool(oFormula.m_oAca->ToBool());
			}
			
			if(oFormula.m_oBx.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerFormulaTypes::Bx);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteBool(oFormula.m_oBx->ToBool());
			}
			
			if(oFormula.m_oCa.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerFormulaTypes::Ca);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteBool(oFormula.m_oCa->ToBool());
			}
			
			if(oFormula.m_oDel1.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerFormulaTypes::Del1);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteBool(oFormula.m_oDel1->ToBool());
			}
			
			if(oFormula.m_oDel2.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerFormulaTypes::Del2);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteBool(oFormula.m_oDel2->ToBool());
			}
			
			if(oFormula.m_oDt2D.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerFormulaTypes::Dt2D);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteBool(oFormula.m_oDt2D->ToBool());
			}
			
			if(oFormula.m_oDtr.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerFormulaTypes::Dtr);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteBool(oFormula.m_oDtr->ToBool());
			}
			
			if(oFormula.m_oR1.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerFormulaTypes::R1);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);
				m_oBcw.m_oStream.WriteString2(oFormula.m_oR1.get2());
			}
			
			if(oFormula.m_oR2.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerFormulaTypes::R2);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);
				m_oBcw.m_oStream.WriteString2(oFormula.m_oR2.get2());
			}
			
			if(oFormula.m_oRef.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerFormulaTypes::Ref);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);
				m_oBcw.m_oStream.WriteString2(oFormula.m_oRef.get2());
			}
			
			if(oFormula.m_oSi.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerFormulaTypes::Si);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Long);
				m_oBcw.m_oStream.WriteLong(oFormula.m_oSi->GetValue());
			}
			
			if(oFormula.m_oT.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerFormulaTypes::T);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteByte(oFormula.m_oT->GetValue());
			}
			
			if(!oFormula.m_sText.IsEmpty())
			{
				m_oBcw.m_oStream.WriteByte(c_oSerFormulaTypes::Text);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);
				m_oBcw.m_oStream.WriteString2(oFormula.m_sText);

				if(NULL != m_pEmbeddedFontsManager)
					m_pEmbeddedFontsManager->CheckString(oFormula.m_sText);
			}
		};

		void WriteDrawings(OOX::Spreadsheet::CDrawing* pDrawing, CString& sDrawingRelsPath)
		{
			int nCurPos;
			for(int i = 0, length = pDrawing->m_arrItems.GetSize(); i  < length ; ++i)
			{
				OOX::Spreadsheet::CCellAnchor& pCellAnchor = *pDrawing->m_arrItems[i];
				if(pCellAnchor.isValid())
				{
					
					nCurPos = m_oBcw.WriteItemStart(c_oSerWorksheetsTypes::Drawing);
					WriteDrawing(pDrawing, pCellAnchor, sDrawingRelsPath);
					m_oBcw.WriteItemEnd(nCurPos);
				}
			}
		};
		void WriteDrawing(OOX::Spreadsheet::CDrawing* pDrawing, OOX::Spreadsheet::CCellAnchor& pCellAnchor, CString& sDrawingRelsPath)
		{
			
			int nCurPos;
			nCurPos = m_oBcw.WriteItemStart(c_oSer_DrawingType::Type);
			m_oBcw.m_oStream.WriteByte(pCellAnchor.m_oAnchorType.GetValue());
			m_oBcw.WriteItemEnd(nCurPos);
			
			if(pCellAnchor.m_oFrom.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_DrawingType::From);
				WriteFromTo(pCellAnchor.m_oFrom.get());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			
			if(pCellAnchor.m_oTo.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_DrawingType::To);
				WriteFromTo(pCellAnchor.m_oTo.get());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			
			if(pCellAnchor.m_oPos.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_DrawingType::Pos);
				WritePos(pCellAnchor.m_oPos.get());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			
			if(pCellAnchor.m_oExt.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_DrawingType::Ext);
				WriteExt(pCellAnchor.m_oExt.get());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			BSTR bstrXml = NULL;
			
			if(pCellAnchor.m_oXml.IsInit())
				bstrXml = pCellAnchor.m_oXml->AllocSysString();
			else if(pCellAnchor.m_oGraphicFrame.IsInit())
			{
				if(pCellAnchor.m_oGraphicFrame->m_oChartGraphic.IsInit() && pCellAnchor.m_oGraphicFrame->m_oChartGraphic->m_oGraphicData.IsInit() && pCellAnchor.m_oGraphicFrame->m_oChartGraphic->m_oGraphicData->m_oChart.IsInit())
				{
					nCurPos = m_oBcw.WriteItemStart(c_oSer_DrawingType::GraphicFrame);
					WriteGraphicFrame(pDrawing, pCellAnchor.m_oGraphicFrame.get(), sDrawingRelsPath);
					m_oBcw.WriteItemEnd(nCurPos);
				}
				else if(pCellAnchor.m_oGraphicFrame->m_sXml.IsInit())
					bstrXml = pCellAnchor.m_oGraphicFrame->m_sXml->AllocSysString();
			}
			if(NULL != bstrXml)
			{
				LPSAFEARRAY pBinaryObj = NULL;
				BSTR bstrOutputXml = NULL;
				HRESULT hRes = m_pOfficeDrawingConverter->AddObject(bstrXml, &bstrOutputXml, &pBinaryObj);
				if(S_OK == hRes && NULL != pBinaryObj && pBinaryObj->rgsabound[0].cElements > 0)
				{
					m_oBcw.m_oStream.WriteByte(c_oSer_DrawingType::pptxDrawing);
					m_oBcw.WriteSafeArray(pBinaryObj);
				}
				RELEASEARRAY(pBinaryObj);
				SysFreeString(bstrOutputXml);
				SysFreeString(bstrXml);
			}
		};
		void WriteFromTo(const OOX::Spreadsheet::CFromTo& oFromTo)
		{
			
			if(oFromTo.m_oCol.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_DrawingFromToType::Col);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Long);
				m_oBcw.m_oStream.WriteLong(oFromTo.m_oCol->GetValue());
			}
			
			if(oFromTo.m_oColOff.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_DrawingFromToType::ColOff);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
				m_oBcw.m_oStream.WriteDouble(oFromTo.m_oColOff->ToMm());
			}
			
			if(oFromTo.m_oRow.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_DrawingFromToType::Row);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Long);
				m_oBcw.m_oStream.WriteLong(oFromTo.m_oRow->GetValue());
			}
			
			if(oFromTo.m_oRowOff.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_DrawingFromToType::RowOff);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
				m_oBcw.m_oStream.WriteDouble(oFromTo.m_oRowOff->ToMm());
			}
		};
		void WritePos(const OOX::Spreadsheet::CPos& oPos)
		{
			
			if(oPos.m_oX.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_DrawingPosType::X);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
				m_oBcw.m_oStream.WriteDouble(oPos.m_oX->ToMm());
			}
			
			if(oPos.m_oY.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_DrawingPosType::Y);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
				m_oBcw.m_oStream.WriteDouble(oPos.m_oY->ToMm());
			}
		};
		void WriteExt(const OOX::Spreadsheet::CExt& oExt)
		{
			
			if(oExt.m_oCx.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_DrawingExtType::Cx);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
				m_oBcw.m_oStream.WriteDouble(oExt.m_oCx->ToMm());
			}
			
			if(oExt.m_oCy.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_DrawingExtType::Cy);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
				m_oBcw.m_oStream.WriteDouble(oExt.m_oCy->ToMm());
			}
		};
		void WriteGraphicFrame(OOX::Spreadsheet::CDrawing* pDrawing, const OOX::Spreadsheet::CGraphicFrame& oGraphicFrame, CString& sDrawingRelsPath)
		{
			if(oGraphicFrame.m_oChartGraphic.IsInit() && oGraphicFrame.m_oChartGraphic->m_oGraphicData.IsInit() &&
				oGraphicFrame.m_oChartGraphic->m_oGraphicData->m_oChart.IsInit() && oGraphicFrame.m_oChartGraphic->m_oGraphicData->m_oChart->m_oRId.IsInit())
			{
				
				if(NULL != pDrawing->GetCurRls())
				{
					OOX::Rels::CRelationShip* oRels = NULL;
					pDrawing->GetCurRls()->GetRel(OOX::RId(oGraphicFrame.m_oChartGraphic->m_oGraphicData->m_oChart->m_oRId->GetValue()), &oRels);
					if(NULL != oRels)
					{
						OOX::CPath oNormalizedPath  = OOX::CPath(pDrawing->GetReadPath().GetDirectory()) / oRels->Target().GetPath();
						CString sChartPath = oNormalizedPath.GetPath();
						
						if( INVALID_FILE_ATTRIBUTES != ::GetFileAttributes( sChartPath ) )
						{
							OOX::Spreadsheet::CChartSpace oChart(oNormalizedPath);
							if(oChart.m_oChart.IsInit() && oChart.m_oChart->isValid())
							{
								BSTR bstrChartPath = sChartPath.AllocSysString();
								m_pOfficeDrawingConverter->SetRelsPath(bstrChartPath);
								SysFreeString(bstrChartPath);

								BinaryChartWriter oBinaryChartWriter(m_oBcw.m_oStream, m_pOfficeDrawingConverter);	
								int nCurPos = m_oBcw.WriteItemStart(c_oSer_DrawingType::Chart);
								oBinaryChartWriter.Write(oChart);
								m_oBcw.WriteItemEnd(nCurPos);

								bstrChartPath = sDrawingRelsPath.AllocSysString();
								m_pOfficeDrawingConverter->SetRelsPath(bstrChartPath);
								SysFreeString(bstrChartPath);
							}
						}
					}
				}
			}
		};
		void WriteComments(CAtlMap<CString, OOX::Spreadsheet::CCommentItem*>& mapComments)
		{
			int nCurPos = 0;
			POSITION pos = mapComments.GetStartPosition();
			while ( NULL != pos )
			{
				CAtlMap<CString, OOX::Spreadsheet::CCommentItem*>::CPair* pPair = mapComments.GetNext( pos );
				if(pPair->m_value->IsValid())
				{
					OOX::Spreadsheet::CCommentItem& oComment = *pPair->m_value;
					SerializeCommon::CommentData* pSavedData = getSavedComment(oComment);
					nCurPos = m_oBcw.WriteItemStart(c_oSerWorksheetsTypes::Comment);
					
					WriteComment(oComment, pSavedData, oComment.m_oText);
					m_oBcw.WriteItemEnd(nCurPos);

					RELEASEOBJECT(pSavedData);
				}
			}
		};
		SerializeCommon::CommentData* getSavedComment(OOX::Spreadsheet::CCommentItem& oComment)
		{
			SerializeCommon::CommentData* pCommentData = NULL;
			if(oComment.m_sGfxdata.IsInit())
			{
				const CString& sGfxData = oComment.m_sGfxdata.get2();
				CString sSignatureBase64(_T("WExTV"));
				if(sSignatureBase64 == sGfxData.Left(sSignatureBase64.GetLength()))
				{
					CStringA sSignature(_T("XLST"));
					int nSignatureSize = sSignature.GetLength();
					int nDataLengthSize = sizeof(long);
					int nJunkSize = 2;
					CStringA sGfxDataA = (CStringA)sGfxData;
					int nDataSize = sGfxDataA.GetLength();
					BYTE* pBuffer = new BYTE[nDataSize];
					if(FALSE != Base64::Base64Decode((LPCSTR)sGfxDataA.GetBuffer(), sGfxDataA.GetLength(), pBuffer, &nDataSize))
					{
						int nLength = *((long*)(pBuffer + nSignatureSize));
						Streams::CBuffer oBuffer;
						Streams::CBufferedStream oBufferedStream;
						oBufferedStream.SetBuffer(&oBuffer);
						oBufferedStream.Create((BYTE*)(pBuffer + nSignatureSize + nDataLengthSize), nLength);

						pCommentData = new SerializeCommon::CommentData();
						BinaryCommentReader oBinaryCommentReader(oBufferedStream, NULL);
						oBinaryCommentReader.ReadCommentDataExternal(nLength, pCommentData);
					}
					sGfxDataA.ReleaseBuffer();
					RELEASEARRAYOBJECTS(pBuffer);
				}
			}
			return pCommentData;
		}
		void WriteComment(OOX::Spreadsheet::CCommentItem& oComment, SerializeCommon::CommentData* pCommentData, nullable<OOX::Spreadsheet::CSi>& oCommentText)
		{
			int nCurPos = 0;
			int nRow = 0;
			int nCol = 0;
			if(oComment.m_nRow.IsInit())
			{
				nRow = oComment.m_nRow.get();
				m_oBcw.m_oStream.WriteByte(c_oSer_Comments::Row);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Long);
				m_oBcw.m_oStream.WriteLong(nRow);
			}
			if(oComment.m_nCol.IsInit())
			{
				nCol = oComment.m_nCol.get();
				m_oBcw.m_oStream.WriteByte(c_oSer_Comments::Col);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Long);
				m_oBcw.m_oStream.WriteLong(nCol);
			}
			m_oBcw.m_oStream.WriteByte(c_oSer_Comments::CommentDatas);
			m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);
			nCurPos = m_oBcw.WriteItemWithLengthStart();
			WriteCommentData(oComment, pCommentData, oCommentText);
			m_oBcw.WriteItemWithLengthEnd(nCurPos);

			if(oComment.m_nLeft.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_Comments::Left);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Long);
				m_oBcw.m_oStream.WriteLong(oComment.m_nLeft.get());
			}
			if(oComment.m_nLeftOffset.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_Comments::LeftOffset);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Long);
				m_oBcw.m_oStream.WriteLong(oComment.m_nLeftOffset.get());
			}
			if(oComment.m_nTop.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_Comments::Top);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Long);
				m_oBcw.m_oStream.WriteLong(oComment.m_nTop.get());
			}
			if(oComment.m_nTopOffset.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_Comments::TopOffset);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Long);
				m_oBcw.m_oStream.WriteLong(oComment.m_nTopOffset.get());
			}
			if(oComment.m_nRight.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_Comments::Right);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Long);
				m_oBcw.m_oStream.WriteLong(oComment.m_nRight.get());
			}
			if(oComment.m_nRightOffset.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_Comments::RightOffset);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Long);
				m_oBcw.m_oStream.WriteLong(oComment.m_nRightOffset.get());
			}
			if(oComment.m_nBottom.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_Comments::Bottom);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Long);
				m_oBcw.m_oStream.WriteLong(oComment.m_nBottom.get());
			}
			if(oComment.m_nBottomOffset.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_Comments::BottomOffset);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Long);
				m_oBcw.m_oStream.WriteLong(oComment.m_nBottomOffset.get());
			}
			if(oComment.m_dLeftMM.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_Comments::LeftMM);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
				m_oBcw.m_oStream.WriteDouble(oComment.m_dLeftMM.get());
			}
			if(oComment.m_dTopMM.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_Comments::TopMM);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
				m_oBcw.m_oStream.WriteDouble(oComment.m_dTopMM.get());
			}
			if(oComment.m_dWidthMM.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_Comments::WidthMM);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
				m_oBcw.m_oStream.WriteDouble(oComment.m_dWidthMM.get());
			}
			if(oComment.m_dHeightMM.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_Comments::HeightMM);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Double);
				m_oBcw.m_oStream.WriteDouble(oComment.m_dHeightMM.get());
			}
			if(oComment.m_bMove.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_Comments::MoveWithCells);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteBool(oComment.m_bMove.get());
			}
			if(oComment.m_bSize.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_Comments::SizeWithCells);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteBool(oComment.m_bSize.get());
			}
		}
		void WriteCommentData(OOX::Spreadsheet::CCommentItem& oComment, SerializeCommon::CommentData* pCommentData, nullable<OOX::Spreadsheet::CSi>& oCommentText)
		{
			int nCurPos = 0;
			nCurPos = m_oBcw.WriteItemStart(c_oSer_Comments::CommentData);
			WriteCommentDataContent(&oComment, pCommentData, &oCommentText);
			m_oBcw.WriteItemEnd(nCurPos);
		}
		void WriteCommentDataContent(OOX::Spreadsheet::CCommentItem* pComment, SerializeCommon::CommentData* pCommentData, nullable<OOX::Spreadsheet::CSi>* pCommentText)
		{
			int nCurPos = 0;
			if(NULL != pCommentText && pCommentText->IsInit())
			{
				CString& sText = (*pCommentText)->ToString();
				m_oBcw.m_oStream.WriteByte(c_oSer_CommentData::Text);
				m_oBcw.m_oStream.WriteString2(sText);
			}
			if(NULL != pCommentData)
			{
				if(NULL == pCommentText)
				{
					if(!pCommentData->sText.IsEmpty())
					{
						m_oBcw.m_oStream.WriteByte(c_oSer_CommentData::Text);
						m_oBcw.m_oStream.WriteString2(pCommentData->sText);
					}
				}
				if(!pCommentData->sTime.IsEmpty())
				{
					m_oBcw.m_oStream.WriteByte(c_oSer_CommentData::Time);
					m_oBcw.m_oStream.WriteString2(pCommentData->sTime);
				}
				if(!pCommentData->sUserId.IsEmpty())
				{
					m_oBcw.m_oStream.WriteByte(c_oSer_CommentData::UserId);
					m_oBcw.m_oStream.WriteString2(pCommentData->sUserId);
				}
				if(!pCommentData->sUserName.IsEmpty())
				{
					m_oBcw.m_oStream.WriteByte(c_oSer_CommentData::UserName);
					m_oBcw.m_oStream.WriteString2(pCommentData->sUserName);
				}
				if(!pCommentData->sUserName.IsEmpty())
				{
					m_oBcw.m_oStream.WriteByte(c_oSer_CommentData::UserName);
					m_oBcw.m_oStream.WriteString2(pCommentData->sUserName);
				}
				if(!pCommentData->sQuoteText.IsEmpty())
				{
					m_oBcw.m_oStream.WriteByte(c_oSer_CommentData::QuoteText);
					m_oBcw.m_oStream.WriteString2(pCommentData->sQuoteText);
				}
				if(pCommentData->bSolved)
				{
					nCurPos = m_oBcw.WriteItemStart(c_oSer_CommentData::Solved);
					m_oBcw.m_oStream.WriteBool(pCommentData->Solved);
					m_oBcw.WriteItemEnd(nCurPos);
				}
				if(pCommentData->bDocument)
				{
					nCurPos = m_oBcw.WriteItemStart(c_oSer_CommentData::Document);
					m_oBcw.m_oStream.WriteBool(pCommentData->Document);
					m_oBcw.WriteItemEnd(nCurPos);
				}
				if(pCommentData->aReplies.GetCount() > 0)
				{
					nCurPos = m_oBcw.WriteItemStart(c_oSer_CommentData::Replies);
					WriteCommentReplies(pCommentData->aReplies);
					m_oBcw.WriteItemEnd(nCurPos);
				}
			}
			else if(NULL != pComment)
			{
				if(pComment->m_sAuthor.IsInit())
				{
					m_oBcw.m_oStream.WriteByte(c_oSer_CommentData::UserName);
					m_oBcw.m_oStream.WriteString2(pComment->m_sAuthor.get2());
				}
			}
		}
		void WriteCommentReplies(CAtlArray<SerializeCommon::CommentData*>& aReplies)
		{
			int nCurPos = 0;
			for(int i = 0, length = aReplies.GetCount(); i < length; i++)
			{
				SerializeCommon::CommentData* pReply = aReplies[i];
				nCurPos = m_oBcw.WriteItemStart(c_oSer_CommentData::Reply);
				WriteCommentDataContent(NULL, pReply, NULL);
				m_oBcw.WriteItemEnd(nCurPos);
			}
		}
		void WriteSheetPr(const OOX::Spreadsheet::CSheetPr& oSheetPr)
		{
			int nCurPos = 0;
			if (oSheetPr.m_oCodeName.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_SheetPr::CodeName);
				m_oBcw.m_oStream.WriteString3(oSheetPr.m_oCodeName.get2());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			if (oSheetPr.m_oEnableFormatConditionsCalculation.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_SheetPr::EnableFormatConditionsCalculation);
				m_oBcw.m_oStream.WriteBool(oSheetPr.m_oEnableFormatConditionsCalculation->ToBool());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			if (oSheetPr.m_oFilterMode.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_SheetPr::FilterMode);
				m_oBcw.m_oStream.WriteBool(oSheetPr.m_oFilterMode->ToBool());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			if (oSheetPr.m_oPublished.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_SheetPr::Published);
				m_oBcw.m_oStream.WriteBool(oSheetPr.m_oPublished->ToBool());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			if (oSheetPr.m_oSyncHorizontal.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_SheetPr::SyncHorizontal);
				m_oBcw.m_oStream.WriteBool(oSheetPr.m_oSyncHorizontal->ToBool());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			if (oSheetPr.m_oSyncRef.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_SheetPr::SyncRef);
				m_oBcw.m_oStream.WriteString3(oSheetPr.m_oSyncRef.get2());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			if (oSheetPr.m_oSyncVertical.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_SheetPr::SyncVertical);
				m_oBcw.m_oStream.WriteBool(oSheetPr.m_oSyncVertical->ToBool());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			if (oSheetPr.m_oTransitionEntry.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_SheetPr::TransitionEntry);
				m_oBcw.m_oStream.WriteBool(oSheetPr.m_oTransitionEntry->ToBool());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			if (oSheetPr.m_oTransitionEvaluation.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_SheetPr::TransitionEvaluation);
				m_oBcw.m_oStream.WriteBool(oSheetPr.m_oTransitionEvaluation->ToBool());
				m_oBcw.WriteItemEnd(nCurPos);
			}

			if (oSheetPr.m_oTabColor.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_SheetPr::TabColor);
				m_oBcw.WriteColor(oSheetPr.m_oTabColor.get(), m_pIndexedColors, m_pTheme);
				m_oBcw.WriteItemEnd(nCurPos);
			}
		}
		void WriteConditionalFormattings(CPtrAtlArray<OOX::Spreadsheet::CConditionalFormatting*>& arrConditionalFormatting)
		{
			int nCurPos = 0;
			for (int nIndex = 0, nLength = arrConditionalFormatting.GetCount(); nIndex < nLength; ++nIndex)
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSerWorksheetsTypes::ConditionalFormatting);
				WriteConditionalFormatting(*arrConditionalFormatting[nIndex]);
				m_oBcw.WriteItemEnd(nCurPos);
			}
		}
		void WriteConditionalFormatting(const OOX::Spreadsheet::CConditionalFormatting& oConditionalFormatting)
		{
			int nCurPos = 0;

			if (oConditionalFormatting.m_oPivot.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_ConditionalFormatting::Pivot);
				m_oBcw.m_oStream.WriteBool(oConditionalFormatting.m_oPivot->ToBool());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			if (oConditionalFormatting.m_oSqRef.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_ConditionalFormatting::SqRef);
				m_oBcw.m_oStream.WriteString2(oConditionalFormatting.m_oSqRef->ToString());
			}

			if (0 < oConditionalFormatting.m_arrItems.GetSize())
			{
				WriteConditionalFormattingRules(oConditionalFormatting.m_arrItems);
			}
		}
		void WriteConditionalFormattingRules(const CSimpleArray<OOX::Spreadsheet::CConditionalFormattingRule *>& aConditionalFormattingRules)
		{
			int nCurPos = 0;
			for (int i = 0, length = aConditionalFormattingRules.GetSize(); i < length; ++i)
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_ConditionalFormatting::ConditionalFormattingRule);
				WriteConditionalFormattingRule(*aConditionalFormattingRules[i]);
				m_oBcw.WriteItemEnd(nCurPos);
			}
		}
		void WriteConditionalFormattingRule(const OOX::Spreadsheet::CConditionalFormattingRule& oConditionalFormattingRule)
		{
			int nCurPos = 0;

			if (oConditionalFormattingRule.m_oAboveAverage.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_ConditionalFormattingRule::AboveAverage);
				m_oBcw.m_oStream.WriteBool(oConditionalFormattingRule.m_oAboveAverage->ToBool());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			if (oConditionalFormattingRule.m_oBottom.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_ConditionalFormattingRule::Bottom);
				m_oBcw.m_oStream.WriteBool(oConditionalFormattingRule.m_oBottom->ToBool());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			if (oConditionalFormattingRule.m_oDxfId.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_TableColumns::DataDxfId);
				m_oBcw.m_oStream.WriteLong(oConditionalFormattingRule.m_oDxfId->GetValue());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			if (oConditionalFormattingRule.m_oEqualAverage.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_ConditionalFormattingRule::EqualAverage);
				m_oBcw.m_oStream.WriteBool(oConditionalFormattingRule.m_oEqualAverage->ToBool());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			if (oConditionalFormattingRule.m_oOperator.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_ConditionalFormattingRule::Operator);
				m_oBcw.m_oStream.WriteString2(oConditionalFormattingRule.m_oOperator.get2());
			}
			if (oConditionalFormattingRule.m_oPercent.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_ConditionalFormattingRule::Percent);
				m_oBcw.m_oStream.WriteBool(oConditionalFormattingRule.m_oPercent->ToBool());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			if (oConditionalFormattingRule.m_oPriority.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_ConditionalFormattingRule::Priority);
				m_oBcw.m_oStream.WriteLong(oConditionalFormattingRule.m_oPriority->GetValue());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			if (oConditionalFormattingRule.m_oRank.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_ConditionalFormattingRule::Rank);
				m_oBcw.m_oStream.WriteLong(oConditionalFormattingRule.m_oRank->GetValue());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			if (oConditionalFormattingRule.m_oStdDev.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_ConditionalFormattingRule::StdDev);
				m_oBcw.m_oStream.WriteLong(oConditionalFormattingRule.m_oStdDev->GetValue());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			if (oConditionalFormattingRule.m_oStopIfTrue.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_ConditionalFormattingRule::StopIfTrue);
				m_oBcw.m_oStream.WriteBool(oConditionalFormattingRule.m_oStopIfTrue->ToBool());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			if (oConditionalFormattingRule.m_oText.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_ConditionalFormattingRule::Text);
				m_oBcw.m_oStream.WriteString2(oConditionalFormattingRule.m_oText.get2());
			}
			if (oConditionalFormattingRule.m_oTimePeriod.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_ConditionalFormattingRule::TimePeriod);
				m_oBcw.m_oStream.WriteString2(oConditionalFormattingRule.m_oTimePeriod.get2());
			}
			if (oConditionalFormattingRule.m_oType.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_ConditionalFormattingRule::Type);
				m_oBcw.m_oStream.WriteString2(oConditionalFormattingRule.m_oType.get2());
			}

			if (0 < oConditionalFormattingRule.m_arrItems.GetSize())
			{
				WriteConditionalFormattingRuleElements(oConditionalFormattingRule.m_arrItems);
			}
		}
		void WriteConditionalFormattingRuleElements(const CSimpleArray<OOX::Spreadsheet::WritingElement *>& aConditionalFormattingRuleElements)
		{
			OOX::Spreadsheet::CColorScale* pColorScale = NULL;
			OOX::Spreadsheet::CDataBar* pDataBar = NULL;
			OOX::Spreadsheet::CFormulaCF* pFormulaCF = NULL;
			OOX::Spreadsheet::CIconSet* pIconSet = NULL;

			int nCurPos = 0;
			for (int i = 0, length = aConditionalFormattingRuleElements.GetSize(); i < length; ++i)
			{
				switch (aConditionalFormattingRuleElements[i]->getType())
				{
				case OOX::Spreadsheet::et_ColorScale:
					pColorScale = static_cast<OOX::Spreadsheet::CColorScale*>(aConditionalFormattingRuleElements[i]);
					nCurPos = m_oBcw.WriteItemStart(c_oSer_ConditionalFormattingRule::ColorScale);
					WriteColorScale(*pColorScale);
					m_oBcw.WriteItemEnd(nCurPos);
					break;
				case OOX::Spreadsheet::et_DataBar:
					pDataBar = static_cast<OOX::Spreadsheet::CDataBar*>(aConditionalFormattingRuleElements[i]);
					nCurPos = m_oBcw.WriteItemStart(c_oSer_ConditionalFormattingRule::DataBar);
					WriteDataBar(*pDataBar);
					m_oBcw.WriteItemEnd(nCurPos);
					break;
				case OOX::Spreadsheet::et_FormulaCF:
					pFormulaCF = static_cast<OOX::Spreadsheet::CFormulaCF*>(aConditionalFormattingRuleElements[i]);
					m_oBcw.m_oStream.WriteByte(c_oSer_ConditionalFormattingRule::FormulaCF);
					m_oBcw.m_oStream.WriteString2(pFormulaCF->m_sText);
					break;
				case OOX::Spreadsheet::et_IconSet:
					pIconSet = static_cast<OOX::Spreadsheet::CIconSet*>(aConditionalFormattingRuleElements[i]);
					nCurPos = m_oBcw.WriteItemStart(c_oSer_ConditionalFormattingRule::IconSet);
					WriteIconSet(*pIconSet);
					m_oBcw.WriteItemEnd(nCurPos);
					break;
				}
			}
		}
		void WriteColorScale(const OOX::Spreadsheet::CColorScale& oColorScale)
		{
			OOX::Spreadsheet::CConditionalFormatValueObject* pCFVO = NULL;
			OOX::Spreadsheet::CColor* pColor = NULL;

			
			int nCurPos = 0;

			for (int i = 0, length = oColorScale.m_arrItems.GetSize(); i < length; ++i)
			{
				pCFVO = dynamic_cast<OOX::Spreadsheet::CConditionalFormatValueObject*>(oColorScale.m_arrItems[i]);
				if (NULL != pCFVO)
				{
					nCurPos = m_oBcw.WriteItemStart(c_oSer_ConditionalFormattingRuleColorScale::CFVO);
					WriteCFVO(*pCFVO);
					m_oBcw.WriteItemEnd(nCurPos);
					continue;
				}
				pColor = dynamic_cast<OOX::Spreadsheet::CColor*>(oColorScale.m_arrItems[i]);
				if (NULL != pColor)
				{
					nCurPos = m_oBcw.WriteItemStart(c_oSer_ConditionalFormattingRuleColorScale::Color);
					m_oBcw.WriteColor(*pColor, m_pIndexedColors, m_pTheme);
					m_oBcw.WriteItemEnd(nCurPos);
					continue;
				}
			}
		}
		void WriteDataBar(const OOX::Spreadsheet::CDataBar& oDataBar)
		{
			int nCurPos = 0;

			if (oDataBar.m_oMaxLength.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_ConditionalFormattingDataBar::MaxLength);
				m_oBcw.m_oStream.WriteLong(oDataBar.m_oMaxLength->GetValue());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			if (oDataBar.m_oMinLength.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_ConditionalFormattingDataBar::MinLength);
				m_oBcw.m_oStream.WriteLong(oDataBar.m_oMinLength->GetValue());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			if (oDataBar.m_oShowValue.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_ConditionalFormattingDataBar::ShowValue);
				m_oBcw.m_oStream.WriteBool(oDataBar.m_oShowValue->ToBool());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			if (oDataBar.m_oColor.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_ConditionalFormattingDataBar::Color);
				m_oBcw.WriteColor(oDataBar.m_oColor.get(), m_pIndexedColors, m_pTheme);
				m_oBcw.WriteItemEnd(nCurPos);
			}

			for (int i = 0, length = oDataBar.m_arrItems.GetSize(); i < length; ++i)
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_ConditionalFormattingDataBar::CFVO);
				WriteCFVO(*oDataBar.m_arrItems[i]);
				m_oBcw.WriteItemEnd(nCurPos);
			}
		}
		void WriteIconSet(const OOX::Spreadsheet::CIconSet& oIconSet)
		{
			int nCurPos = 0;

			if (oIconSet.m_oIconSet.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_ConditionalFormattingIconSet::IconSet);
				m_oBcw.m_oStream.WriteString2(oIconSet.m_oIconSet.get2());
			}
			if (oIconSet.m_oPercent.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_ConditionalFormattingIconSet::Percent);
				m_oBcw.m_oStream.WriteBool(oIconSet.m_oPercent->ToBool());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			if (oIconSet.m_oReverse.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_ConditionalFormattingIconSet::Reverse);
				m_oBcw.m_oStream.WriteBool(oIconSet.m_oReverse->ToBool());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			if (oIconSet.m_oShowValue.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_ConditionalFormattingIconSet::ShowValue);
				m_oBcw.m_oStream.WriteBool(oIconSet.m_oShowValue->ToBool());
				m_oBcw.WriteItemEnd(nCurPos);
			}

			for (int i = 0, length = oIconSet.m_arrItems.GetSize(); i < length; ++i)
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_ConditionalFormattingIconSet::CFVO);
				WriteCFVO(*oIconSet.m_arrItems[i]);
				m_oBcw.WriteItemEnd(nCurPos);
			}
		}
		void WriteCFVO(const OOX::Spreadsheet::CConditionalFormatValueObject& oCFVO)
		{
			int nCurPos = 0;
			if (oCFVO.m_oGte.IsInit())
			{
				nCurPos = m_oBcw.WriteItemStart(c_oSer_ConditionalFormattingValueObject::Gte);
				m_oBcw.m_oStream.WriteBool(oCFVO.m_oGte->ToBool());
				m_oBcw.WriteItemEnd(nCurPos);
			}
			if (oCFVO.m_oType.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_ConditionalFormattingValueObject::Type);
				m_oBcw.m_oStream.WriteString2(oCFVO.m_oType.get2());
			}
			if (oCFVO.m_oVal.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_ConditionalFormattingValueObject::Val);
				m_oBcw.m_oStream.WriteString2(oCFVO.m_oVal.get2());
			}
		}
	};
	class BinaryCalcChainTableWriter
	{
		BinaryCommonWriter m_oBcw;
	public:
		BinaryCalcChainTableWriter(Streams::CBufferedStream &oCBufferedStream):m_oBcw(oCBufferedStream)
		{
		};
		void Write(OOX::Spreadsheet::CCalcChain& pCalcChain)
		{
			int nStart = m_oBcw.WriteItemWithLengthStart();
			WriteCalcChainTableContent(pCalcChain);
			m_oBcw.WriteItemWithLengthEnd(nStart);
		};
		void WriteCalcChainTableContent(OOX::Spreadsheet::CCalcChain& pCalcChain)
		{
			int nCurPos;
			for(int i = 0, length = pCalcChain.m_arrItems.GetSize(); i < length; ++i)
			{
				
				nCurPos = m_oBcw.WriteItemStart(c_oSer_CalcChainType::CalcChainItem);
				WriteCalcChain(*pCalcChain.m_arrItems[i]);
				m_oBcw.WriteItemWithLengthEnd(nCurPos);
			}
		};
		void WriteCalcChain(OOX::Spreadsheet::CCalcCell& oCalcCell)
		{
			
			if(oCalcCell.m_oArray.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_CalcChainType::Array);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteBool(oCalcCell.m_oArray->ToBool());
			}
			
			if(oCalcCell.m_oSheetId.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_CalcChainType::SheetId);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Long);
				m_oBcw.m_oStream.WriteLong(oCalcCell.m_oSheetId->GetValue());
			}
			
			if(oCalcCell.m_oDependencyLevel.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_CalcChainType::DependencyLevel);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteBool(oCalcCell.m_oDependencyLevel->ToBool());
			}
			
			if(oCalcCell.m_oRef.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_CalcChainType::Ref);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Variable);
				m_oBcw.m_oStream.WriteString2(oCalcCell.m_oRef.get2());
			}
			
			if(oCalcCell.m_oChildChain.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_CalcChainType::ChildChain);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteBool(oCalcCell.m_oChildChain->ToBool());
			}
			
			if(oCalcCell.m_oNewThread.IsInit())
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_CalcChainType::NewThread);
				m_oBcw.m_oStream.WriteByte(c_oSerPropLenType::Byte);
				m_oBcw.m_oStream.WriteBool(oCalcCell.m_oNewThread->ToBool());
			}
		};
	};
	class BinaryOtherTableWriter
	{
		class EmbeddedBinaryWriter
		{
		private: Streams::CBufferedStream &m_oStream;
		public: EmbeddedBinaryWriter(Streams::CBufferedStream &oStream):m_oStream(oStream)
			{
			}
		public: void WriteBYTE(BYTE btVal)
			{
				m_oStream.WriteByte(btVal);
			}
		public: void WriteString(CString& sVal)
			{
				m_oStream.WriteString1(sVal);
			}
		public: void WriteULONG(long nVal)
			{
				m_oStream.WriteLong(nVal);
			}
		};
		BinaryCommonWriter m_oBcw;
		NSFontCutter::CEmbeddedFontsManager* m_pEmbeddedFontsManager;
		LPSAFEARRAY m_pThemeData;
	public:
		BinaryOtherTableWriter(Streams::CBufferedStream &oCBufferedStream, NSFontCutter::CEmbeddedFontsManager* pEmbeddedFontsManager, LPSAFEARRAY pThemeData):m_oBcw(oCBufferedStream),m_pEmbeddedFontsManager(pEmbeddedFontsManager),m_pThemeData(pThemeData)
		{
		};
		void Write()
		{
			int nStart = m_oBcw.WriteItemWithLengthStart();
			WriteOtherTableContent();
			m_oBcw.WriteItemWithLengthEnd(nStart);
		};
		void WriteOtherTableContent()
		{
			int nCurPos;
			
			if(NULL != m_pEmbeddedFontsManager)
			{
				EmbeddedBinaryWriter oEmbeddedBinaryWriter(m_oBcw.m_oStream);
				nCurPos = m_oBcw.WriteItemStart(c_oSer_OtherType::EmbeddedFonts);
				m_pEmbeddedFontsManager->WriteEmbeddedFonts<EmbeddedBinaryWriter>(&oEmbeddedBinaryWriter);
				m_oBcw.WriteItemWithLengthEnd(nCurPos);
			}
			
			if(NULL != m_pThemeData)
			{
				m_oBcw.m_oStream.WriteByte(c_oSer_OtherType::Theme);
				m_oBcw.WriteSafeArray(m_pThemeData);
			}
		};
	};
	class BinaryFileWriter {
	private:
		BinaryCommonWriter* m_oBcw;
		int m_nLastFilePos;
		int m_nRealTableCount;
		int m_nMainTableStart;
		BinXlsxRW::FontProcessor& m_oFontProcessor;
	public:
		BinaryFileWriter(BinXlsxRW::FontProcessor& oFontProcessor):m_oBcw(NULL),m_oFontProcessor(oFontProcessor)
		{
			m_nLastFilePos = 0;
			m_nRealTableCount = 0;
		}
		~BinaryFileWriter()
		{
			RELEASEOBJECT(m_oBcw);
		}
		void Open(CString& sInputDir, CString& sFileDst, NSFontCutter::CEmbeddedFontsManager* pEmbeddedFontsManager,
			PPTXFile::IAVSOfficeDrawingConverter* pOfficeDrawingConverter, CString& sXMLOptions)
		{
			OOX::CPath path(sFileDst);
			
			CString mediaDir = path.GetDirectory() + gc_sMediaDirName;
			CreateDirectoryW(mediaDir, NULL);

			BSTR bstrMediaDir = mediaDir.AllocSysString();
			pOfficeDrawingConverter->SetMediaDstPath(bstrMediaDir);
			SysFreeString(bstrMediaDir);

			
			CString mimePath = path.GetDirectory() + gc_sMimeName;
			
			
			
			

			long nGrowSize = 1 * 1024 * 1024;
			Streams::CBuffer oBuffer;
			oBuffer.Create(nGrowSize, nGrowSize);
			Streams::CBufferedStream oBufferedStream;
			oBufferedStream.SetBuffer(&oBuffer);

			m_oBcw = new BinaryCommonWriter(oBufferedStream);

			
			BYTE fileType;
			UINT nCodePage;
			WCHAR wcDelimiter;
			SerializeCommon::ReadFileType(sXMLOptions, fileType, nCodePage, wcDelimiter);

			OOX::Spreadsheet::CXlsx *pXlsx = NULL;
			switch(fileType)
			{
			case BinXlsxRW::c_oFileTypes::CSV:
				pXlsx = new OOX::Spreadsheet::CXlsx();
				CSVReader::ReadFromCsvToXlsx(sInputDir, *pXlsx, nCodePage, wcDelimiter);
				break;
			case BinXlsxRW::c_oFileTypes::XLSX:
			default:
				pXlsx = new OOX::Spreadsheet::CXlsx(OOX::CPath(sInputDir));
				break;
			}
			pXlsx->PrepareWorkbook();
			intoBindoc(*pXlsx, oBufferedStream, pEmbeddedFontsManager, pOfficeDrawingConverter);

			BYTE* pbBinBuffer = oBufferedStream.GetBuffer();
			int nBinBufferLen = oBufferedStream.GetPosition();
			int nBase64BufferLen = Base64::Base64EncodeGetRequiredLength(nBinBufferLen, Base64::B64_BASE64_FLAG_NOCRLF);
			BYTE* pbBase64Buffer = new BYTE[nBase64BufferLen];
			if(TRUE == Base64::Base64Encode(pbBinBuffer, nBinBufferLen, (LPSTR)pbBase64Buffer, &nBase64BufferLen, Base64::B64_BASE64_FLAG_NOCRLF))
			{
				CFile oFile;
				oFile.CreateFileW(sFileDst);
				oFile.WriteStringUTF8(WriteFileHeader(nBinBufferLen));
				oFile.WriteFile(pbBase64Buffer, nBase64BufferLen);
				oFile.CloseFile();
			}
			RELEASEARRAYOBJECTS(pbBase64Buffer);
			RELEASEOBJECT(pXlsx);
		}
	private:
		void intoBindoc(OOX::Spreadsheet::CXlsx &oXlsx, Streams::CBufferedStream &oBufferedStream, NSFontCutter::CEmbeddedFontsManager* pEmbeddedFontsManager, PPTXFile::IAVSOfficeDrawingConverter* pOfficeDrawingConverter)
		{
			int nCurPos;
			WriteMainTableStart();
			OOX::Spreadsheet::CStyles* pStyle = oXlsx.GetStyles();
			
			OOX::Spreadsheet::CSharedStrings* pSharedStrings = oXlsx.GetSharedStrings();
			OOX::Spreadsheet::CIndexedColors* pIndexedColors = NULL;
			if(NULL != pStyle && pStyle->m_oColors.IsInit() && pStyle->m_oColors->m_oIndexedColors.IsInit())
				pIndexedColors = pStyle->m_oColors->m_oIndexedColors.operator ->();
#ifdef DEFAULT_TABLE_STYLES
			getDefaultCellStyles(CString(_T("D:\\Subversion\\AVS\\Sources\\TeamlabOffice\\trunk\\XlsxSerializerCom\\XlsxDefaults\\presetCellStylesNew.xml")), CString(_T("C:\\presetCellStyles_output.bin")), pEmbeddedFontsManager, pIndexedColors, oXlsx.GetTheme(), m_oFontProcessor);
			getDefaultTableStyles(CString(_T("D:\\Subversion\\AVS\\Sources\\TeamlabOffice\\trunk\\XlsxSerializerCom\\XlsxDefaults\\presetTableStyles.xml")), CString(_T("C:\\presetTableStyles_output.bin")), pEmbeddedFontsManager, pIndexedColors, oXlsx.GetTheme(), m_oFontProcessor);
#endif
			if(NULL != pSharedStrings)
			{
				nCurPos = WriteTableStart(c_oSerTableTypes::SharedStrings);
				BinarySharedStringTableWriter oBinarySharedStringTableWriter(oBufferedStream, pEmbeddedFontsManager);
				oBinarySharedStringTableWriter.Write(*pSharedStrings, pIndexedColors, oXlsx.GetTheme(), m_oFontProcessor);
				WriteTableEnd(nCurPos);
			}
			
			if(NULL != pStyle)
			{
				nCurPos = WriteTableStart(c_oSerTableTypes::Styles);
				BinaryStyleTableWriter oBinaryStyleTableWriter(oBufferedStream, pEmbeddedFontsManager);
				oBinaryStyleTableWriter.Write(*pStyle, oXlsx.GetTheme(), m_oFontProcessor);
				WriteTableEnd(nCurPos);
			}
			
			OOX::Spreadsheet::CCalcChain* pCalcChain = oXlsx.GetCalcChain();
			if(NULL != pCalcChain)
			{
				nCurPos = WriteTableStart(c_oSerTableTypes::CalcChain);
				BinaryCalcChainTableWriter oBinaryCalcChainTableWriter(oBufferedStream);
				oBinaryCalcChainTableWriter.Write(*pCalcChain);
				WriteTableEnd(nCurPos);
			}

			
			OOX::Spreadsheet::CWorkbook* pWorkbook = oXlsx.GetWorkbook();
			if(NULL != pWorkbook)
			{
				nCurPos = WriteTableStart(c_oSerTableTypes::Workbook);
				BinaryWorkbookTableWriter oBinaryWorkbookTableWriter(oBufferedStream);
				oBinaryWorkbookTableWriter.Write(*pWorkbook);
				WriteTableEnd(nCurPos);

				
				nCurPos = WriteTableStart(c_oSerTableTypes::Worksheets);
				BinaryWorksheetTableWriter oBinaryWorksheetTableWriter(oBufferedStream, pEmbeddedFontsManager, pIndexedColors, oXlsx.GetTheme(), m_oFontProcessor, pOfficeDrawingConverter);
				oBinaryWorksheetTableWriter.Write(*pWorkbook, oXlsx.GetWorksheets());
				WriteTableEnd(nCurPos);
			}

			
			LPSAFEARRAY pThemeData = NULL;
			OOX::CTheme* pTheme = oXlsx.GetTheme();
			if(NULL != pTheme)
			{
				BSTR bstrThemePath = oXlsx.GetTheme()->m_oReadPath.GetPath().AllocSysString();
				pOfficeDrawingConverter->GetThemeBinary(bstrThemePath, &pThemeData);
				SysFreeString(bstrThemePath);
			}

#ifdef DEFAULT_TABLE_STYLES
			writeTheme(pThemeData, CString(_T("c:\\defaultTheme.bin")));
#endif

			
			nCurPos = WriteTableStart(c_oSerTableTypes::Other);
			BinaryOtherTableWriter oBinaryOtherTableWriter(oBufferedStream, pEmbeddedFontsManager, pThemeData);
			oBinaryOtherTableWriter.Write();
			WriteTableEnd(nCurPos);
			
			WriteMainTableEnd();
		}
		CString WriteFileHeader(int nDataSize)
		{
			CString sHeader;
			sHeader.Format(_T("%s;v%d;%d;"), g_sFormatSignature, g_nFormatVersion, nDataSize);
			return sHeader;
		}
		void WriteMainTableStart()
		{
			int nTableCount = 128;
			m_nRealTableCount = 0;
			m_nMainTableStart = m_oBcw->m_oStream.GetPosition();
			
			int nmtItemSize = 5;
			m_nLastFilePos = m_nMainTableStart + nTableCount * nmtItemSize;
			
			m_oBcw->m_oStream.WriteByte(0);
		}
		void WriteMainTableEnd()
		{
			
			m_oBcw->m_oStream.Seek(m_nMainTableStart);
			m_oBcw->m_oStream.WriteByte(m_nRealTableCount);

			
			m_oBcw->m_oStream.Seek(m_nLastFilePos);
		}
		int WriteTableStart(BYTE type, int nStartPos = -1)
		{
			if(-1 != nStartPos)
				m_oBcw->m_oStream.Seek(nStartPos);
			
			
			m_oBcw->m_oStream.WriteByte(type);
			
			m_oBcw->m_oStream.WriteLong(m_nLastFilePos);

			
			
			int nCurPos = m_oBcw->m_oStream.GetPosition();
			
			m_oBcw->m_oStream.Seek(m_nLastFilePos);
			return nCurPos;
		}
		void WriteTableEnd(int nCurPos)
		{
			
			m_nLastFilePos = m_oBcw->m_oStream.GetPosition();
			m_nRealTableCount++;
			
			m_oBcw->m_oStream.Seek(nCurPos);
		}
	};
#ifdef DEFAULT_TABLE_STYLES
	void getDefaultCellStyles(CString& sFileInput, CString& sFileOutput, NSFontCutter::CEmbeddedFontsManager* pEmbeddedFontsManager, OOX::Spreadsheet::CIndexedColors* oIndexedColors, OOX::CTheme* pTheme, BinXlsxRW::FontProcessor& oFontProcessor)
	{
		enum Types
		{
			Style =  0,
			BuiltinId = 1,
			Hidden = 2,
			CellStyle = 3,
			Xfs = 4,
			Font = 5,
			Fill = 6,
			Border = 7,
			NumFmts = 8
		};
		int BUFFER_GROW_SIZE = 1024;
		Streams::CBuffer oBuffer;
		oBuffer.Create(BUFFER_GROW_SIZE, BUFFER_GROW_SIZE);
		Streams::CBufferedStream oBufferedStream;
		oBufferedStream.SetBuffer(&oBuffer);
		BinaryCommonWriter oBinaryCommonWriter(oBufferedStream);
		BinaryStyleTableWriter oBinaryStyleTableWriter(oBufferedStream, pEmbeddedFontsManager);

		XmlUtils::CXmlLiteReader oReader;
		oReader.FromFile(sFileInput);
		oReader.ReadNextNode();

		if (oReader.IsEmptyNode())
			return;

		bool bIsWriteNormal = false;

		int nAllPos = oBinaryCommonWriter.WriteItemWithLengthStart();
		int nCurDepth = oReader.GetDepth();
		while (oReader.ReadNextSiblingNode(nCurDepth))
		{
			CString sName = oReader.GetName(); 

			nullable<SimpleTypes::CUnsignedDecimalNumber<>>	oBuiltinId;
			nullable<SimpleTypes::COnOff<>>					oHidden;
			nullable<OOX::Spreadsheet::CBorders>			oBorders;
			nullable<OOX::Spreadsheet::CCellStyles>			oCellStyles;
			nullable<OOX::Spreadsheet::CCellStyleXfs>		oCellStyleXfs;
			nullable<OOX::Spreadsheet::CCellXfs>			oCellXfs;
			nullable<OOX::Spreadsheet::CFills>				oFills;
			nullable<OOX::Spreadsheet::CFonts>				oFonts;
			nullable<OOX::Spreadsheet::CNumFmts>			oNumFmts;

			WritingElement_ReadAttributes_Start(oReader)
			WritingElement_ReadAttributes_Read_if		(oReader, _T("builtinId")	, oBuiltinId)
			WritingElement_ReadAttributes_Read_else_if	(oReader, _T("hidden")		, oHidden)
			WritingElement_ReadAttributes_End(oReader)

			oReader.ReadNextNode(); 

			sName = oReader.GetName();
			if (_T("styleSheet") == sName)
			{
				if (!oReader.IsEmptyNode())
				{
					int nStylesDepth = oReader.GetDepth();
					while (oReader.ReadNextSiblingNode(nStylesDepth))
					{
						sName = oReader.GetName();

						if (_T("borders") == sName)
							oBorders = oReader;
						else if (_T("cellStyles") == sName)
							oCellStyles = oReader;
						else if (_T("cellStyleXfs") == sName)
							oCellStyleXfs = oReader;
						else if (_T("cellXfs") == sName)
							oCellXfs = oReader;
						else if (_T("fills") == sName)
							oFills = oReader;
						else if (_T("fonts") == sName)
							oFonts = oReader;
						else if (_T("numFmts") == sName)
							oNumFmts = oReader;
					}
				}
			}

			int nCellStylePos = oBinaryCommonWriter.WriteItemStart(Types::Style);
			int nCurPos = 0;

			if (oBuiltinId.IsInit())
			{
				nCurPos = oBinaryCommonWriter.WriteItemStart(Types::BuiltinId);
				oBinaryCommonWriter.m_oStream.WriteLong(oBuiltinId->GetValue());
				oBinaryCommonWriter.WriteItemEnd(nCurPos);
			}
			if (oHidden.IsInit())
			{
				nCurPos = oBinaryCommonWriter.WriteItemStart(Types::Hidden);
				oBinaryCommonWriter.m_oStream.WriteBool(oHidden->ToBool());
				oBinaryCommonWriter.WriteItemEnd(nCurPos);
			}

			for (int i = 0, nLength = oCellStyles->m_arrItems.GetSize(); i < nLength; ++i)
			{
				OOX::Spreadsheet::WritingElement* we = oCellStyles->m_arrItems[i];
				if (OOX::Spreadsheet::et_CellStyle == we->getType())
				{
					OOX::Spreadsheet::CCellStyle* pCellStyle = static_cast<OOX::Spreadsheet::CCellStyle*>(we);
					if (_T("Normal") == pCellStyle->m_oName.get2())
					{
						if (bIsWriteNormal)
							continue;
						else
						{
							bIsWriteNormal = true;
							i = nLength; 
						}
					}

					nCurPos = oBinaryCommonWriter.WriteItemStart(Types::CellStyle);
					oBinaryStyleTableWriter.WriteCellStyle(*pCellStyle);
					oBinaryCommonWriter.WriteItemEnd(nCurPos);

					const OOX::Spreadsheet::CCellStyleXfs& oCellStyleXfsTmp = oCellStyleXfs.get();
					OOX::Spreadsheet::WritingElement* weXfs = oCellStyleXfsTmp.m_arrItems[pCellStyle->m_oXfId->GetValue()];
					if(OOX::Spreadsheet::et_Xfs == weXfs->getType())
					{
						OOX::Spreadsheet::CXfs* pXfs = static_cast<OOX::Spreadsheet::CXfs*>(weXfs);
						nCurPos = oBinaryCommonWriter.WriteItemStart(Types::Xfs);
						oBinaryStyleTableWriter.WriteXfs(*pXfs);
						oBinaryCommonWriter.WriteItemEnd(nCurPos);

						if (pXfs->m_oFontId.IsInit())
						{
							OOX::Spreadsheet::WritingElement* weFont = oFonts->m_arrItems[pXfs->m_oFontId->GetValue()];
							if(OOX::Spreadsheet::et_Font == weFont->getType())
							{
								OOX::Spreadsheet::CFont* pFont = static_cast<OOX::Spreadsheet::CFont*>(weFont);
								nCurPos = oBinaryCommonWriter.WriteItemStart(Types::Font);
								oBinaryStyleTableWriter.WriteFont(*pFont, oIndexedColors, pTheme, oFontProcessor);
								oBinaryCommonWriter.WriteItemEnd(nCurPos);
							}
						}
						if (pXfs->m_oFillId.IsInit())
						{
							OOX::Spreadsheet::WritingElement* weFill = oFills->m_arrItems[pXfs->m_oFillId->GetValue()];
							if(OOX::Spreadsheet::et_Fill == weFill->getType())
							{
								OOX::Spreadsheet::CFill* pFill = static_cast<OOX::Spreadsheet::CFill*>(weFill);
								nCurPos = oBinaryCommonWriter.WriteItemStart(Types::Fill);
								oBinaryStyleTableWriter.WriteFill(*pFill, oIndexedColors, pTheme);
								oBinaryCommonWriter.WriteItemEnd(nCurPos);
							}
						}
						if (pXfs->m_oBorderId.IsInit())
						{
							OOX::Spreadsheet::WritingElement* weBorder = oBorders->m_arrItems[pXfs->m_oBorderId->GetValue()];
							if(OOX::Spreadsheet::et_Border == weBorder->getType())
							{
								OOX::Spreadsheet::CBorder* pBorder = static_cast<OOX::Spreadsheet::CBorder*>(weBorder);
								nCurPos = oBinaryCommonWriter.WriteItemStart(Types::Border);
								oBinaryStyleTableWriter.WriteBorder(*pBorder, oIndexedColors, pTheme);
								oBinaryCommonWriter.WriteItemEnd(nCurPos);
							}
						}

						if (oNumFmts.IsInit())
						{
							nCurPos = oBinaryCommonWriter.WriteItemStart(Types::NumFmts);
							oBinaryStyleTableWriter.WriteNumFmts(oNumFmts.get());
							oBinaryCommonWriter.WriteItemEnd(nCurPos);
						}
					}
				}
			}

			oBinaryCommonWriter.WriteItemEnd(nCellStylePos);
		}
		oBinaryCommonWriter.WriteItemWithLengthEnd(nAllPos);
		BYTE* pbBinBuffer = oBufferedStream.GetBuffer();
		int nBinBufferLen = oBufferedStream.GetPosition();
		int nBase64BufferLen = Base64::Base64EncodeGetRequiredLength(nBinBufferLen, Base64::B64_BASE64_FLAG_NOCRLF);
		BYTE* pbBase64Buffer = new BYTE[nBase64BufferLen];
		if (TRUE == Base64::Base64Encode(pbBinBuffer, nBinBufferLen, (LPSTR)pbBase64Buffer, &nBase64BufferLen, Base64::B64_BASE64_FLAG_NOCRLF))
		{
			CFile oFile;
			oFile.CreateFileW(sFileOutput);
			oFile.WriteFile(pbBase64Buffer, nBase64BufferLen);
			oFile.CloseFile();
		}
		RELEASEARRAYOBJECTS(pbBase64Buffer);
	}
	void getDefaultTableStyles(CString& sFileInput, CString& sFileOutput, NSFontCutter::CEmbeddedFontsManager* pEmbeddedFontsManager, OOX::Spreadsheet::CIndexedColors* oIndexedColors, OOX::CTheme* pTheme, BinXlsxRW::FontProcessor& oFontProcessor)
	{
		enum Types
		{
			Style =  0,
			Dxf = 1,
			tableStyles = 2
		};
		int BUFFER_GROW_SIZE = 1024;
		Streams::CBuffer oBuffer;
		oBuffer.Create(BUFFER_GROW_SIZE, BUFFER_GROW_SIZE);
		Streams::CBufferedStream oBufferedStream;
		oBufferedStream.SetBuffer(&oBuffer);
		BinaryCommonWriter oBinaryCommonWriter(oBufferedStream);
		BinaryStyleTableWriter oBinaryStyleTableWriter(oBufferedStream, pEmbeddedFontsManager);

		XmlUtils::CXmlLiteReader oReader;
		oReader.FromFile(sFileInput);
		oReader.ReadNextNode();

		if ( oReader.IsEmptyNode() )
			return;

		int nAllPos = oBinaryCommonWriter.WriteItemWithLengthStart();
		int nCurDepth = oReader.GetDepth();
		while( oReader.ReadNextSiblingNode( nCurDepth ) )
		{
			CString sName = oReader.GetName();
			int nStylePos = oBinaryCommonWriter.WriteItemStart(Types::Style);

			
			int nDxfsPos = oBinaryCommonWriter.WriteItemStart(Types::Dxf);
			oReader.ReadNextNode();
			OOX::Spreadsheet::CDxfs oDxfs(oReader);
			oBinaryStyleTableWriter.WriteDxfs(oDxfs, oIndexedColors, pTheme, oFontProcessor);
			oBinaryCommonWriter.WriteItemEnd(nDxfsPos);

			
			int nTableStylesPos = oBinaryCommonWriter.WriteItemStart(Types::tableStyles);
			oReader.ReadNextNode();
			OOX::Spreadsheet::CTableStyles oTableStyles(oReader);
			oBinaryStyleTableWriter.WriteTableStyles(oTableStyles);
			oBinaryCommonWriter.WriteItemEnd(nTableStylesPos);

			oBinaryCommonWriter.WriteItemEnd(nStylePos);
		}
		oBinaryCommonWriter.WriteItemWithLengthEnd(nAllPos);
		BYTE* pbBinBuffer = oBufferedStream.GetBuffer();
		int nBinBufferLen = oBufferedStream.GetPosition();
		int nBase64BufferLen = Base64::Base64EncodeGetRequiredLength(nBinBufferLen, Base64::B64_BASE64_FLAG_NOCRLF);
		BYTE* pbBase64Buffer = new BYTE[nBase64BufferLen];
		if(TRUE == Base64::Base64Encode(pbBinBuffer, nBinBufferLen, (LPSTR)pbBase64Buffer, &nBase64BufferLen, Base64::B64_BASE64_FLAG_NOCRLF))
		{
			CFile oFile;
			oFile.CreateFileW(sFileOutput);
			oFile.WriteFile(pbBase64Buffer, nBase64BufferLen);
			oFile.CloseFile();
		}
		RELEASEARRAYOBJECTS(pbBase64Buffer);
	}
	void writeTheme(LPSAFEARRAY pThemeData, CString& sFileOutput)
	{
		BYTE* pbBinBuffer = (BYTE *)pThemeData->pvData;
		int nBinBufferLen = pThemeData->rgsabound[0].cElements;
		int nBase64BufferLen = Base64::Base64EncodeGetRequiredLength(nBinBufferLen, Base64::B64_BASE64_FLAG_NOCRLF);
		BYTE* pbBase64Buffer = new BYTE[nBase64BufferLen];
		if(TRUE == Base64::Base64Encode(pbBinBuffer, nBinBufferLen, (LPSTR)pbBase64Buffer, &nBase64BufferLen, Base64::B64_BASE64_FLAG_NOCRLF))
		{
			CFile oFile;
			oFile.CreateFileW(sFileOutput);
			oFile.WriteFile(pbBase64Buffer, nBase64BufferLen);
			oFile.CloseFile();
		}
		RELEASEARRAYOBJECTS(pbBase64Buffer);
	}
#endif
}