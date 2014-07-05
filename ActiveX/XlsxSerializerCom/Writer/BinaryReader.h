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
#include "../../Common/FileWriter.h"
#include "../../Common/MappingFile.h"
#include "../../Common/Base64.h"
#include "../../Common/ATLDefine.h"

#include "../../Common/DocxFormat/Source/SystemUtility/FileSystem/Directory.h"

#include "../../ASCOfficeDocxFile2/BinWriter/StreamUtils.h"
#include "../Common/BinReaderWriterDefines.h"
#include "../Common/Common.h"
#include "../Writer/CSVWriter.h"

namespace BinXlsxRW {

	template <typename CallbackType > class Binary_CommonReader
	{
	protected:
		Streams::CBufferedStream& m_oBufferedStream;
		typedef int (CallbackType::*funcArg)(BYTE type, long length, void* arg);
	public:
		Binary_CommonReader(Streams::CBufferedStream& poBufferedStream):m_oBufferedStream(poBufferedStream)
		{
		}
		int ReadTable(funcArg fReadFunction, void* poFuncObj, void* arg = NULL)
		{
			int res = c_oSerConstants::ReadOk;
			
			res = m_oBufferedStream.Peek(4) == FALSE ? c_oSerConstants::ErrorStream : c_oSerConstants::ReadOk;
			if(c_oSerConstants::ReadOk != res)
				return res;
			long stLen = m_oBufferedStream.ReadLong();
			
			res = m_oBufferedStream.Peek(stLen) == FALSE ? c_oSerConstants::ErrorStream : c_oSerConstants::ReadOk;
			if(c_oSerConstants::ReadOk != res)
				return res;
			return Read1(stLen, fReadFunction, poFuncObj, arg);
		}
		int Read1(long stLen, funcArg fReadFunction, void* poFuncObj, void* arg = NULL)
		{
			int res = c_oSerConstants::ReadOk;
			long stCurPos = 0;
			while(stCurPos < stLen)
			{
				
				BYTE type = m_oBufferedStream.ReadByte();
				long length =  m_oBufferedStream.ReadLong();
				res = (((CallbackType*)poFuncObj)->*fReadFunction)(type, length, arg);
				if(res == c_oSerConstants::ReadUnknown)
				{
					m_oBufferedStream.ReadPointer(length);
					res = c_oSerConstants::ReadOk;
				}
				else if(res != c_oSerConstants::ReadOk)
					return res;
				stCurPos += length + 5;
			}
			return res;
		}
		int Read2(long stLen, funcArg fReadFunction, void* poFuncObj, void* arg = NULL)
		{
			int res = c_oSerConstants::ReadOk;
			long stCurPos = 0;
			while(stCurPos < stLen)
			{
				
				BYTE type = m_oBufferedStream.ReadByte();
				long lenType =  m_oBufferedStream.ReadByte();
				int nCurPosShift = 2;
				int nRealLen;
				switch(lenType)
				{
				case c_oSerPropLenType::Null: nRealLen = 0;break;
				case c_oSerPropLenType::Byte: nRealLen = 1;break;
				case c_oSerPropLenType::Short: nRealLen = 2;break;
				case c_oSerPropLenType::Three: nRealLen = 3;break;
				case c_oSerPropLenType::Long: nRealLen = 4;break;
				case c_oSerPropLenType::Double: nRealLen = 8;break;
				case c_oSerPropLenType::Variable:
					nRealLen = m_oBufferedStream.ReadLong();
					nCurPosShift += 4;
					break;
				default:return c_oSerConstants::ErrorUnknown;
				}
				res = (((CallbackType*)poFuncObj)->*fReadFunction)(type, nRealLen, arg);
				if(res == c_oSerConstants::ReadUnknown)
				{
					m_oBufferedStream.ReadPointer(nRealLen);
					res = c_oSerConstants::ReadOk;
				}
				else if(res != c_oSerConstants::ReadOk)
					return res;
				stCurPos += nRealLen + nCurPosShift;
			}
			return res;
		}
	};
	class ImageObject
	{
	public:
		CString sPath;
		int nIndex;
		CAtlMap<OOX::Spreadsheet::CDrawing*, CString> mapDrawings;
		bool bNeedCreate;
	public:
		ImageObject()
		{
		}
		ImageObject(CString& _sPath, int _nIndex)
		{
			sPath = _sPath;
			nIndex = _nIndex;
			bNeedCreate = true;
		}
	};
	class Binary_CommonReader2
	{
	protected:
		Streams::CBufferedStream& m_poBufferedStream;
	public:
		Binary_CommonReader2(Streams::CBufferedStream& poBufferedStream):m_poBufferedStream(poBufferedStream)
		{
		}
		int ReadColor(BYTE type, long length, void* poResult)
		{
			OOX::Spreadsheet::CColor* pColor = static_cast<OOX::Spreadsheet::CColor*>(poResult);
			int res = c_oSerConstants::ReadOk;
			if(c_oSer_ColorObjectType::Type == type)
			{
				BYTE byteColorType = m_poBufferedStream.ReadByte();
				if(c_oSer_ColorType::Auto == byteColorType)
				{
					pColor->m_oAuto.Init();
					pColor->m_oAuto->SetValue(SimpleTypes::onoffTrue);
				}
			}
			else if(c_oSer_ColorObjectType::Rgb == type)
			{
				pColor->m_oRgb.Init();
				pColor->m_oRgb->FromInt(m_poBufferedStream.ReadLong());
			}
			else if(c_oSer_ColorObjectType::Theme == type)
			{
				pColor->m_oThemeColor.Init();
				pColor->m_oThemeColor->SetValue((SimpleTypes::Spreadsheet::EThemeColor)m_poBufferedStream.ReadByte());
			}
			else if(c_oSer_ColorObjectType::Tint == type)
			{
				pColor->m_oTint.Init();
				pColor->m_oTint->SetValue(m_poBufferedStream.ReadDouble());
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		}
	};
	class BinaryChartReader : public Binary_CommonReader<BinaryChartReader>
	{
		Binary_CommonReader2 m_oBcr2;
		LPSAFEARRAY m_pArray;
		PPTXFile::IAVSOfficeDrawingConverter* m_pOfficeDrawingConverter;
	public:
		BinaryChartReader(Streams::CBufferedStream& oBufferedStream, LPSAFEARRAY pArray, PPTXFile::IAVSOfficeDrawingConverter* pOfficeDrawingConverter):Binary_CommonReader(oBufferedStream),m_oBcr2(oBufferedStream),m_pArray(pArray),m_pOfficeDrawingConverter(pOfficeDrawingConverter)
		{
		}
		int Read(long length, OOX::Spreadsheet::CChartSpace* pChartSpace)
		{
			pChartSpace->m_oChart.Init();
			return Read1(length, &BinaryChartReader::ReadGraphicFrame, this, pChartSpace);
		};
		int ReadGraphicFrame(BYTE type, long length, void* poResult)
		{
			int res = c_oSerConstants::ReadOk;
			if(c_oSer_DrawingType::Chart == type)
			{
				res = Read1(length, &BinaryChartReader::ReadChart, this, poResult);
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		};
		int ReadChartOut(long length, OOX::Spreadsheet::CChartSpace* pChartSpace)
		{
			return Read1(length, &BinaryChartReader::ReadChart, this, pChartSpace);
		}
		int ReadChart(BYTE type, long length, void* poResult)
		{
			int res = c_oSerConstants::ReadOk;
			OOX::Spreadsheet::CChartSpace* pChartSpace = static_cast<OOX::Spreadsheet::CChartSpace*>(poResult);
			OOX::Spreadsheet::CChart* pChart = pChartSpace->m_oChart.GetPointer();
			if(c_oSer_ChartType::Legend == type)
			{
				pChart->m_oLegend.Init();
				res = Read1(length, &BinaryChartReader::ReadLegend, this, pChart->m_oLegend.GetPointer());
			}
			else if(c_oSer_ChartType::Title == type)
			{
				CString sTitle = CString((wchar_t*)m_oBufferedStream.ReadPointer(length), length / 2);
				pChart->m_oTitle.Init();
				if(false == sTitle.IsEmpty())
				{
					SerializeCommon::CorrectString(sTitle);
					CString sXml;sXml.Format(_T("<c:rich><a:bodyPr/><a:lstStyle/><a:p><a:pPr><a:defRPr/></a:pPr><a:r><a:rPr sz=\"1800\"><a:latin typeface=\"Arial\" pitchFamily=\"34\" charset=\"0\"/><a:cs typeface=\"Arial\" pitchFamily=\"34\" charset=\"0\"/></a:rPr><a:t>%s</a:t></a:r></a:p></c:rich>"), sTitle);
					pChart->m_oTitle->m_oTx.Init();
					pChart->m_oTitle->m_oTx->m_oRich.Init();
					pChart->m_oTitle->m_oTx->m_oRich->m_oXml.Init();
					pChart->m_oTitle->m_oTx->m_oRich->m_oXml->Append(sXml);
				}
			}
			else if(c_oSer_ChartType::PlotArea == type)
			{
				pChart->m_oPlotArea.Init();
				res = Read1(length, &BinaryChartReader::ReadPlotArea, this, pChart->m_oPlotArea.GetPointer());
			}
			else if(c_oSer_ChartType::Style == type)
			{
				pChartSpace->m_oStyle.Init();
				pChartSpace->m_oStyle->m_oVal.Init();
				pChartSpace->m_oStyle->m_oVal->SetValue(m_oBufferedStream.ReadLong());
			}
			else if(c_oSer_ChartType::TitlePptx == type)
			{
				pChart->m_oTitle.Init();
				res = Read1(length, &BinaryChartReader::ReadPptxTitle, this, pChart->m_oTitle.GetPointer());
			}
			else if(c_oSer_ChartType::SpPr == type)
			{
				BSTR bstrXml = NULL;
				HRESULT hRes = m_pOfficeDrawingConverter->GetRecordXml(m_pArray, m_oBufferedStream.GetPosition(), length, XMLWRITER_RECORD_TYPE_SPPR, XMLWRITER_DOC_TYPE_CHART,&bstrXml);
				if(S_OK == hRes && NULL != bstrXml)
				{
					pChartSpace->m_sSpPr.Init();
					pChartSpace->m_sSpPr->Append(bstrXml);
					SysFreeString(bstrXml);
				}

				m_oBufferedStream.Skip(length);
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		};
		int ReadLegend(BYTE type, long length, void* poResult)
		{
			int res = c_oSerConstants::ReadOk;
			OOX::Spreadsheet::CChartLegend* pLegend = static_cast<OOX::Spreadsheet::CChartLegend*>(poResult);
			if(c_oSer_ChartLegendType::Layout == type)
			{
				pLegend->m_oLayout.Init();
				pLegend->m_oLayout->m_oManualLayout.Init();
				res = Read2(length, &BinaryChartReader::ReadLegendLayout, this, pLegend->m_oLayout->m_oManualLayout.GetPointer());
			}
			else if(c_oSer_ChartLegendType::LegendPos == type)
			{
				pLegend->m_oLegendPos.Init();
				pLegend->m_oLegendPos->m_oVal.Init();
				pLegend->m_oLegendPos->m_oVal->SetValue((SimpleTypes::Spreadsheet::EChartLegendPos)m_oBufferedStream.ReadByte());
			}
			else if(c_oSer_ChartLegendType::Overlay == type)
			{
				pLegend->m_oOverlay.Init();
				pLegend->m_oOverlay->FromBool(m_oBufferedStream.ReadBool());
			}
			else if(c_oSer_ChartLegendType::TxPrPptx == type)
			{
				BSTR bstrsTxPrXml = NULL;
				m_pOfficeDrawingConverter->GetTxBodyXml(m_pArray, m_oBufferedStream.GetPosition(), length, &bstrsTxPrXml);
				m_oBufferedStream.Skip(length);
				SysFreeString(bstrsTxPrXml);
				CString sTxPrXml(bstrsTxPrXml);
				CString sXml;
				sXml.AppendFormat(CString(_T("<c:txPr>%s</c:txPr>")), sTxPrXml);

				pLegend->m_oTxPr.Init();
				pLegend->m_oTxPr->m_oXml.Init();
				pLegend->m_oTxPr->m_oXml->Append(sXml);
			}
			else if(c_oSer_ChartLegendType::LegendEntry == type)
			{
				OOX::Spreadsheet::CChartLegendEntry* pLegendEntry = new OOX::Spreadsheet::CChartLegendEntry();
				res = Read1(length, &BinaryChartReader::ReadLegendEntry, this, pLegendEntry);
				pLegend->m_arrItems.Add(pLegendEntry);
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		};
		int ReadLegendEntry(BYTE type, long length, void* poResult)
		{
			int res = c_oSerConstants::ReadOk;
			OOX::Spreadsheet::CChartLegendEntry* pLegendEntry = static_cast<OOX::Spreadsheet::CChartLegendEntry*>(poResult);
			if(c_oSer_ChartLegendEntryType::Index == type)
			{
				pLegendEntry->m_oIndex.Init();
				pLegendEntry->m_oIndex->m_oVal.Init();
				pLegendEntry->m_oIndex->m_oVal->SetValue(m_oBufferedStream.ReadLong());
			}
			else if(c_oSer_ChartLegendEntryType::Delete == type)
			{
				pLegendEntry->m_oDelete.Init();
				pLegendEntry->m_oDelete->m_oVal.FromBool(m_oBufferedStream.ReadBool());
			}
			else if(c_oSer_ChartLegendEntryType::TxPrPptx == type)
			{
				BSTR bstrsTxPrXml = NULL;
				m_pOfficeDrawingConverter->GetTxBodyXml(m_pArray, m_oBufferedStream.GetPosition(), length, &bstrsTxPrXml);
				m_oBufferedStream.Skip(length);
				SysFreeString(bstrsTxPrXml);
				CString sTxPrXml(bstrsTxPrXml);
				CString sXml;
				sXml.AppendFormat(CString(_T("<c:txPr>%s</c:txPr>")), sTxPrXml);
				pLegendEntry->m_oTxPr.Init();
				pLegendEntry->m_oTxPr->m_oXml.Init();
				pLegendEntry->m_oTxPr->m_oXml->Append(sXml);
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		}
		int ReadLegendLayout(BYTE type, long length, void* poResult)
		{
			int res = c_oSerConstants::ReadOk;
			OOX::Spreadsheet::CChartManualLayout* pPlotArea = static_cast<OOX::Spreadsheet::CChartManualLayout*>(poResult);
			if(c_oSer_ChartLegendLayoutType::H == type)
			{
				pPlotArea->m_oH.Init();
				pPlotArea->m_oH->m_oVal.Init();
				pPlotArea->m_oH->m_oVal->SetValue(m_oBufferedStream.ReadDouble());
			}
			else if(c_oSer_ChartLegendLayoutType::HMode == type)
			{
				pPlotArea->m_oHMode.Init();
				pPlotArea->m_oHMode->m_oVal.Init();
				pPlotArea->m_oHMode->m_oVal->SetValue((SimpleTypes::Spreadsheet::EChartHMode)m_oBufferedStream.ReadByte());
			}
			else if(c_oSer_ChartLegendLayoutType::LayoutTarget == type)
			{
				pPlotArea->m_oLayoutTarget.Init();
				pPlotArea->m_oLayoutTarget->m_oVal.Init();
				pPlotArea->m_oLayoutTarget->m_oVal->SetValue((SimpleTypes::Spreadsheet::EChartLayoutTarget)m_oBufferedStream.ReadByte());
			}
			else if(c_oSer_ChartLegendLayoutType::W == type)
			{
				pPlotArea->m_oW.Init();
				pPlotArea->m_oW->m_oVal.Init();
				pPlotArea->m_oW->m_oVal->SetValue(m_oBufferedStream.ReadDouble());
			}
			else if(c_oSer_ChartLegendLayoutType::WMode == type)
			{
				pPlotArea->m_oWMode.Init();
				pPlotArea->m_oWMode->m_oVal.Init();
				pPlotArea->m_oWMode->m_oVal->SetValue((SimpleTypes::Spreadsheet::EChartHMode)m_oBufferedStream.ReadByte());
			}
			else if(c_oSer_ChartLegendLayoutType::X == type)
			{
				pPlotArea->m_oX.Init();
				pPlotArea->m_oX->m_oVal.Init();
				pPlotArea->m_oX->m_oVal->SetValue(m_oBufferedStream.ReadDouble());
			}
			else if(c_oSer_ChartLegendLayoutType::XMode == type)
			{
				pPlotArea->m_oXMode.Init();
				pPlotArea->m_oXMode->m_oVal.Init();
				pPlotArea->m_oXMode->m_oVal->SetValue((SimpleTypes::Spreadsheet::EChartHMode)m_oBufferedStream.ReadByte());
			}
			else if(c_oSer_ChartLegendLayoutType::Y == type)
			{
				pPlotArea->m_oY.Init();
				pPlotArea->m_oY->m_oVal.Init();
				pPlotArea->m_oY->m_oVal->SetValue(m_oBufferedStream.ReadDouble());
			}
			else if(c_oSer_ChartLegendLayoutType::YMode == type)
			{
				pPlotArea->m_oYMode.Init();
				pPlotArea->m_oYMode->m_oVal.Init();
				pPlotArea->m_oYMode->m_oVal->SetValue((SimpleTypes::Spreadsheet::EChartHMode)m_oBufferedStream.ReadByte());
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		}
		int ReadPlotArea(BYTE type, long length, void* poResult)
		{
			int res = c_oSerConstants::ReadOk;
			OOX::Spreadsheet::CChartPlotArea* pPlotArea = static_cast<OOX::Spreadsheet::CChartPlotArea*>(poResult);
			if(c_oSer_ChartPlotAreaType::CatAx == type)
			{
				pPlotArea->m_oCatAx.Init();
				res = Read1(length, &BinaryChartReader::ReadAx, this, pPlotArea->m_oCatAx.GetPointer());
			}
			else if(c_oSer_ChartPlotAreaType::ValAx == type)
			{
				OOX::Spreadsheet::CChartCatAx* pNewValAx = new OOX::Spreadsheet::CChartCatAx();
				res = Read1(length, &BinaryChartReader::ReadAx, this, pNewValAx);
				pPlotArea->m_arrItems.Add(pNewValAx);
			}
			else if(c_oSer_ChartPlotAreaType::BasicChart == type)
			{
				pPlotArea->m_oBasicChart.Init();
				res = Read2(length, &BinaryChartReader::ReadBasicChart, this, pPlotArea->m_oBasicChart.GetPointer());
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		};
		int ReadAx(BYTE type, long length, void* poResult)
		{
			int res = c_oSerConstants::ReadOk;
			OOX::Spreadsheet::CChartCatAx* pCatAx = static_cast<OOX::Spreadsheet::CChartCatAx*>(poResult);
			if(c_oSer_ChartCatAxType::Title == type)
			{
				CString sTitle = CString((wchar_t*)m_oBufferedStream.ReadPointer(length), length / 2);
				pCatAx->m_oTitle.Init();

				if(false == sTitle.IsEmpty())
				{
					SerializeCommon::CorrectString(sTitle);
					CString sXml;sXml.Format(_T("<c:rich><a:bodyPr/><a:lstStyle/><a:p><a:pPr><a:defRPr/></a:pPr><a:r><a:rPr><a:latin typeface=\"Arial\" pitchFamily=\"34\" charset=\"0\"/><a:cs typeface=\"Arial\" pitchFamily=\"34\" charset=\"0\"/></a:rPr><a:t>%s</a:t></a:r></a:p></c:rich>"), sTitle);
					pCatAx->m_oTitle->m_oTx.Init();
					pCatAx->m_oTitle->m_oTx->m_oRich.Init();
					pCatAx->m_oTitle->m_oTx->m_oRich->m_oXml.Init();
					pCatAx->m_oTitle->m_oTx->m_oRich->m_oXml->Append(sXml);
				}
			}
			else if(c_oSer_ChartCatAxType::MajorGridlines == type)
			{
				pCatAx->m_oMajorGridlines.Init();
				pCatAx->m_oMajorGridlines->FromBool(m_oBufferedStream.ReadBool());
			}
			else if(c_oSer_ChartCatAxType::Delete == type)
			{
				pCatAx->m_oDelete.Init();
				pCatAx->m_oDelete->m_oVal.FromBool(m_oBufferedStream.ReadBool());
			}
			else if(c_oSer_ChartCatAxType::AxPos == type)
			{
				pCatAx->m_oAxPos.Init();
				pCatAx->m_oAxPos->m_oVal.Init();
				pCatAx->m_oAxPos->m_oVal->SetValue((SimpleTypes::Spreadsheet::EChartAxPos)m_oBufferedStream.ReadByte());
			}
			
			
			
			
			
			
			
			
			else if(c_oSer_ChartCatAxType::TitlePptx == type)
			{
				pCatAx->m_oTitle.Init();
				res = Read1(length, &BinaryChartReader::ReadPptxTitle, this, pCatAx->m_oTitle.GetPointer());
			}
			else if(c_oSer_ChartCatAxType::TxPrPptx == type)
			{
				BSTR bstrsTxPrXml = NULL;
				m_pOfficeDrawingConverter->GetTxBodyXml(m_pArray, m_oBufferedStream.GetPosition(), length, &bstrsTxPrXml);
				m_oBufferedStream.Skip(length);
				SysFreeString(bstrsTxPrXml);
				CString sTxPrXml(bstrsTxPrXml);
				CString sXml;
				sXml.AppendFormat(CString(_T("<c:txPr>%s</c:txPr>")), sTxPrXml);
				pCatAx->m_oTxPr.Init();
				pCatAx->m_oTxPr->m_oXml.Init();
				pCatAx->m_oTxPr->m_oXml->Append(sXml);
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		};
		int ReadBasicChart(BYTE type, long length, void* poResult)
		{
			int res = c_oSerConstants::ReadOk;
			OOX::Spreadsheet::CChartBasicChart* pBasicChart = static_cast<OOX::Spreadsheet::CChartBasicChart*>(poResult);
			if(c_oSer_BasicChartType::Type == type)
			{
				pBasicChart->m_eType = (OOX::Spreadsheet::EChartBasicTypes)m_oBufferedStream.ReadByte();
			}
			else if(c_oSer_BasicChartType::BarDerection == type)
			{
				pBasicChart->m_oBarDerection.Init();
				pBasicChart->m_oBarDerection->m_oVal.Init();
				pBasicChart->m_oBarDerection->m_oVal->SetValue((SimpleTypes::Spreadsheet::EChartBarDerection)m_oBufferedStream.ReadByte());
			}
			else if(c_oSer_BasicChartType::Grouping == type)
			{
				pBasicChart->m_oGrouping.Init();
				pBasicChart->m_oGrouping->m_oVal.Init();
				pBasicChart->m_oGrouping->m_oVal->SetValue((SimpleTypes::Spreadsheet::EChartBarGrouping)m_oBufferedStream.ReadByte());
			}
			else if(c_oSer_BasicChartType::Overlap == type)
			{
				pBasicChart->m_oOverlap.Init();
				pBasicChart->m_oOverlap->m_oVal.Init();
				pBasicChart->m_oOverlap->m_oVal->SetValue(m_oBufferedStream.ReadLong());
			}
			else if(c_oSer_BasicChartType::Series == type)
			{
				res = Read1(length, &BinaryChartReader::ReadSeries, this, pBasicChart);
			}
			else if(c_oSer_BasicChartType::DataLabels == type)
			{
				pBasicChart->m_oDataLabels.Init();
				res = Read2(length, &BinaryChartReader::ReadDataLabels, this, pBasicChart->m_oDataLabels.GetPointer());
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		};
		int ReadSeries(BYTE type, long length, void* poResult)
		{
			int res = c_oSerConstants::ReadOk;
			OOX::Spreadsheet::CChartBasicChart* pBasicChart = static_cast<OOX::Spreadsheet::CChartBasicChart*>(poResult);
			if(c_oSer_BasicChartType::Seria == type)
			{
				OOX::Spreadsheet::CChartSeries* pSeria = new OOX::Spreadsheet::CChartSeries();
				res = Read1(length, &BinaryChartReader::ReadSeria, this, pSeria);
				pBasicChart->m_arrItems.Add(pSeria);
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		};
		int ReadSeria(BYTE type, long length, void* poResult)
		{
			int res = c_oSerConstants::ReadOk;
			OOX::Spreadsheet::CChartSeries* pSeria = static_cast<OOX::Spreadsheet::CChartSeries*>(poResult);
			if(c_oSer_ChartSeriesType::xVal == type)
			{
				pSeria->m_oXVal.Init();
				pSeria->m_oXVal->m_oNumCacheRef.Init();
				res = Read1(length, &BinaryChartReader::ReadSeriesNumCache, this, pSeria->m_oXVal->m_oNumCacheRef.GetPointer());
			}
			else if(c_oSer_ChartSeriesType::Val == type)
			{
				pSeria->m_oVal.Init();
				pSeria->m_oVal->m_oNumCacheRef.Init();
				res = Read1(length, &BinaryChartReader::ReadSeriesNumCache, this, pSeria->m_oVal->m_oNumCacheRef.GetPointer());
			}
			else if(c_oSer_ChartSeriesType::Tx == type)
			{
				if(false == pSeria->m_oTx.IsInit())
					pSeria->m_oTx.Init();
				pSeria->m_oTx->m_oValue.Init();
				pSeria->m_oTx->m_oValue->Append(m_oBufferedStream.ReadString2(length));
			}
			else if(c_oSer_ChartSeriesType::TxRef == type)
			{
				if(false == pSeria->m_oTx.IsInit())
					pSeria->m_oTx.Init();
				pSeria->m_oTx->m_oStrRef.Init();
				res = Read1(length, &BinaryChartReader::ReadSeriesNumCache, this, pSeria->m_oTx->m_oStrRef.GetPointer());
			}
			else if(c_oSer_ChartSeriesType::Marker == type)
			{
				pSeria->m_oMarker.Init();
				res = Read2(length, &BinaryChartReader::ReadSeriesMarker, this, pSeria->m_oMarker.GetPointer());
			}
			else if(c_oSer_ChartSeriesType::Index == type)
			{
				pSeria->m_oIndex.Init();
				pSeria->m_oIndex->m_oVal.Init();
				pSeria->m_oIndex->m_oVal->SetValue(m_oBufferedStream.ReadLong());
			}
			else if(c_oSer_ChartSeriesType::Order == type)
			{
				pSeria->m_oOrder.Init();
				pSeria->m_oOrder->m_oVal.Init();
				pSeria->m_oOrder->m_oVal->SetValue(m_oBufferedStream.ReadLong());
			}
			else if(c_oSer_ChartSeriesType::DataLabels == type)
			{
				pSeria->m_oDataLabels.Init();
				res = Read2(length, &BinaryChartReader::ReadDataLabels, this, pSeria->m_oDataLabels.GetPointer());
			}
			else if(c_oSer_ChartSeriesType::SpPr == type)
			{
				BSTR bstrXml = NULL;
				HRESULT hRes = m_pOfficeDrawingConverter->GetRecordXml(m_pArray, m_oBufferedStream.GetPosition(), length, XMLWRITER_RECORD_TYPE_SPPR, XMLWRITER_DOC_TYPE_CHART,&bstrXml);
				if(S_OK == hRes && NULL != bstrXml)
				{
					pSeria->m_sSpPr.Init();
					pSeria->m_sSpPr->Append(bstrXml);
					SysFreeString(bstrXml);
				}
				m_oBufferedStream.Skip(length);
			}
			else if(c_oSer_ChartSeriesType::Cat == type)
			{
				pSeria->m_oCat.Init();
				pSeria->m_oCat->m_oStrRef.Init();
				res = Read1(length, &BinaryChartReader::ReadSeriesNumCache, this, pSeria->m_oCat->m_oStrRef.GetPointer());
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		};
		int ReadSeriesNumCache(BYTE type, long length, void* poResult)
		{
			int res = c_oSerConstants::ReadOk;
			OOX::Spreadsheet::CChartSeriesNumCacheRef* pNumCacheRef = static_cast<OOX::Spreadsheet::CChartSeriesNumCacheRef*>(poResult);
			if(c_oSer_ChartSeriesNumCacheType::Formula == type)
			{
				pNumCacheRef->m_oFormula.Init();
				pNumCacheRef->m_oFormula->m_sText = CString((wchar_t*)m_oBufferedStream.ReadPointer(length), length / 2);
			}
			else if(c_oSer_ChartSeriesNumCacheType::NumCache == type)
			{
				pNumCacheRef->m_oNumCache.Init();
				OOX::Spreadsheet::CChartSeriesNumCache* oCache = pNumCacheRef->m_oNumCache.GetPointer();
				res = Read1(length, &BinaryChartReader::ReadNumCacheVal, this, oCache);
				oCache->m_oPtCount.Init();
				oCache->m_oPtCount->m_oVal.Init();
				oCache->m_oPtCount->m_oVal->SetValue(oCache->m_arrItems.GetSize());
			}
			else if(c_oSer_ChartSeriesNumCacheType::NumCache2 == type)
			{
				pNumCacheRef->m_oNumCache.Init();
				OOX::Spreadsheet::CChartSeriesNumCache* oCache = pNumCacheRef->m_oNumCache.GetPointer();
				res = Read1(length, &BinaryChartReader::ReadNumCache2, this, oCache);
				oCache->m_oPtCount.Init();
				oCache->m_oPtCount->m_oVal.Init();
				oCache->m_oPtCount->m_oVal->SetValue(oCache->m_arrItems.GetSize());
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		};
		int ReadNumCache2(BYTE type, long length, void* poResult)
		{
			int res = c_oSerConstants::ReadOk;
			OOX::Spreadsheet::CChartSeriesNumCache* oCache = static_cast<OOX::Spreadsheet::CChartSeriesNumCache*>(poResult);
			if(c_oSer_ChartSeriesNumCacheType::NumCacheItem == type)
			{
				OOX::Spreadsheet::CChartSeriesNumCachePoint *pNumCachePoint = new OOX::Spreadsheet::CChartSeriesNumCachePoint();
				res = Read1(length, &BinaryChartReader::ReadNumCache2Val, this, pNumCachePoint);
				oCache->m_arrItems.Add(pNumCachePoint);
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		}
		int ReadNumCacheVal(BYTE type, long length, void* poResult)
		{
			int res = c_oSerConstants::ReadOk;
			OOX::Spreadsheet::CChartSeriesNumCache* pDataLabels = static_cast<OOX::Spreadsheet::CChartSeriesNumCache*>(poResult);
			if(c_oSer_ChartSeriesNumCacheType::NumCacheVal == type)
			{
				OOX::Spreadsheet::CChartSeriesNumCachePoint *pNumCachePoint = new OOX::Spreadsheet::CChartSeriesNumCachePoint();
				pNumCachePoint->m_oValue.Init();
				pNumCachePoint->m_oValue->m_sText = CString((wchar_t*)m_oBufferedStream.ReadPointer(length), length / 2);
				pNumCachePoint->m_oIndex.Init();
				pNumCachePoint->m_oIndex->SetValue(pDataLabels->m_arrItems.GetSize());
				pDataLabels->m_arrItems.Add(pNumCachePoint);
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		};
		int ReadNumCache2Val(BYTE type, long length, void* poResult)
		{
			int res = c_oSerConstants::ReadOk;
			OOX::Spreadsheet::CChartSeriesNumCachePoint* pNumCachePoint = static_cast<OOX::Spreadsheet::CChartSeriesNumCachePoint*>(poResult);
			if(c_oSer_ChartSeriesNumCacheType::NumCacheVal == type)
			{
				pNumCachePoint->m_oValue.Init();
				pNumCachePoint->m_oValue->m_sText = CString((wchar_t*)m_oBufferedStream.ReadPointer(length), length / 2);
			}
			else if(c_oSer_ChartSeriesNumCacheType::NumCacheIndex == type)
			{
				pNumCachePoint->m_oIndex.Init();
				pNumCachePoint->m_oIndex->SetValue(m_oBufferedStream.ReadLong());
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		};
		int ReadSeriesMarker(BYTE type, long length, void* poResult)
		{
			int res = c_oSerConstants::ReadOk;
			OOX::Spreadsheet::CChartSeriesMarker* pSeriesMarker = static_cast<OOX::Spreadsheet::CChartSeriesMarker*>(poResult);
			if(c_oSer_ChartSeriesMarkerType::Size == type)
			{
				pSeriesMarker->m_oSize.Init();
				pSeriesMarker->m_oSize->m_oVal.Init();
				pSeriesMarker->m_oSize->m_oVal->SetValue(m_oBufferedStream.ReadLong());
			}
			else if(c_oSer_ChartSeriesMarkerType::Symbol == type)
			{
				pSeriesMarker->m_oSymbol.Init();
				pSeriesMarker->m_oSymbol->m_oVal.Init();
				pSeriesMarker->m_oSymbol->m_oVal->SetValue((SimpleTypes::Spreadsheet::EChartSymbol)m_oBufferedStream.ReadByte());
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		}
		int ReadDataLabels(BYTE type, long length, void* poResult)
		{
			int res = c_oSerConstants::ReadOk;
			OOX::Spreadsheet::CChartSeriesDataLabels* pDataLabels = static_cast<OOX::Spreadsheet::CChartSeriesDataLabels*>(poResult);
			if(c_oSer_ChartSeriesDataLabelsType::ShowVal == type)
			{
				pDataLabels->m_oShowVal.Init();
				pDataLabels->m_oShowVal->m_oVal.FromBool(m_oBufferedStream.ReadBool());
			}
			else if(c_oSer_ChartSeriesDataLabelsType::TxPrPptx == type)
			{
				BSTR bstrsTxPrXml = NULL;
				m_pOfficeDrawingConverter->GetTxBodyXml(m_pArray, m_oBufferedStream.GetPosition(), length, &bstrsTxPrXml);
				m_oBufferedStream.Skip(length);
				SysFreeString(bstrsTxPrXml);
				CString sTxPrXml(bstrsTxPrXml);
				CString sXml;
				sXml.AppendFormat(CString(_T("<c:txPr>%s</c:txPr>")), sTxPrXml);
				pDataLabels->m_oTxPr.Init();
				pDataLabels->m_oTxPr->m_oXml.Init();
				pDataLabels->m_oTxPr->m_oXml->Append(sXml);
			}
			else if(c_oSer_ChartSeriesDataLabelsType::ShowCatName == type)
			{
				pDataLabels->m_oShowCatName.Init();
				pDataLabels->m_oShowCatName->m_oVal.FromBool(m_oBufferedStream.ReadBool());
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		};
		int ReadColor(BYTE type, long length, void* poResult)
		{
			return m_oBcr2.ReadColor(type, length, poResult);
		}
		int ReadPptxTitle(BYTE type, long length, void* poResult)
		{
			int res = c_oSerConstants::ReadOk;
			OOX::Spreadsheet::CChartTitle* pChartTitle = static_cast<OOX::Spreadsheet::CChartTitle*>(poResult);
			if(c_oSer_ChartTitlePptxType::TxPptx == type)
			{
				BSTR bstrTitleXml = NULL;
				m_pOfficeDrawingConverter->GetTxBodyXml(m_pArray, m_oBufferedStream.GetPosition(), length, &bstrTitleXml);
				m_oBufferedStream.Skip(length);
				SysFreeString(bstrTitleXml);
				CString sTitleXml(bstrTitleXml);
				CString sXml;
				sXml.AppendFormat(CString(_T("<c:rich>%s</c:rich>")), sTitleXml);

				pChartTitle->m_oTx.Init();
				pChartTitle->m_oTx->m_oRich.Init();
				pChartTitle->m_oTx->m_oRich->m_oXml.Init();
				pChartTitle->m_oTx->m_oRich->m_oXml->Append(sXml);
			}
			else if(c_oSer_ChartTitlePptxType::TxPrPptx == type)
			{
				BSTR bstrTitleXml = NULL;
				m_pOfficeDrawingConverter->GetTxBodyXml(m_pArray, m_oBufferedStream.GetPosition(), length, &bstrTitleXml);
				m_oBufferedStream.Skip(length);
				SysFreeString(bstrTitleXml);
				CString sTitleXml(bstrTitleXml);
				CString sXml;
				sXml.AppendFormat(CString(_T("<c:txPr>%s</c:txPr>")), sTitleXml);

				pChartTitle->m_oTxPr.Init();
				pChartTitle->m_oTxPr->m_oXml.Init();
				pChartTitle->m_oTxPr->m_oXml->Append(sXml);
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		}
	};
	class BinaryTableReader : public Binary_CommonReader<BinaryTableReader>
	{
		public:
		BinaryTableReader(Streams::CBufferedStream& oBufferedStream):Binary_CommonReader(oBufferedStream)
		{
		}
		int Read(long length, OOX::Spreadsheet::CWorksheet* pWorksheet)
		{
			return Read1(length, &BinaryTableReader::ReadTablePart, this, pWorksheet);
		}
		int ReadTablePart(BYTE type, long length, void* poResult)
		{
			int res = c_oSerConstants::ReadOk;
			OOX::Spreadsheet::CWorksheet* pWorksheet = static_cast<OOX::Spreadsheet::CWorksheet*>(poResult);
			if(c_oSer_TablePart::Table == type)
			{
				OOX::Spreadsheet::CTableFile* pTable = new OOX::Spreadsheet::CTableFile();
				pTable->m_oTable.Init();
				res = Read1(length, &BinaryTableReader::ReadTable, this, pTable->m_oTable.GetPointer());

				OOX::Spreadsheet::CTablePart* pTablePart = new OOX::Spreadsheet::CTablePart();
				NSCommon::smart_ptr<OOX::File> pTableFile(pTable);
				const OOX::RId oRId = pWorksheet->Add(pTableFile);
				pTablePart->m_oRId.Init();
				pTablePart->m_oRId->SetValue(oRId.get());
				pWorksheet->m_oTableParts->m_arrItems.Add(pTablePart);
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		};
		int ReadTable(BYTE type, long length, void* poResult)
		{
			int res = c_oSerConstants::ReadOk;
			OOX::Spreadsheet::CTable* pTable = static_cast<OOX::Spreadsheet::CTable*>(poResult);
			if(c_oSer_TablePart::Ref == type)
			{
				pTable->m_oRef.Init();
				pTable->m_oRef->SetValue(m_oBufferedStream.ReadString2(length));
			}
			else if(c_oSer_TablePart::HeaderRowCount == type)
			{
				pTable->m_oHeaderRowCount.Init();
				pTable->m_oHeaderRowCount->SetValue(m_oBufferedStream.ReadLong());
			}
			else if(c_oSer_TablePart::TotalsRowCount == type)
			{
				pTable->m_oTotalsRowCount.Init();
				pTable->m_oTotalsRowCount->SetValue(m_oBufferedStream.ReadLong());
			}
			else if(c_oSer_TablePart::DisplayName == type)
			{
				pTable->m_oDisplayName.Init();
				pTable->m_oDisplayName->Append(m_oBufferedStream.ReadString2(length));
			}
			else if(c_oSer_TablePart::AutoFilter == type)
			{
				pTable->m_oAutoFilter.Init();
				res = Read1(length, &BinaryTableReader::ReadAutoFilter, this, pTable->m_oAutoFilter.GetPointer());
			}
			else if(c_oSer_TablePart::SortState == type)
			{
				pTable->m_oSortState.Init();
				res = Read1(length, &BinaryTableReader::ReadSortState, this, pTable->m_oSortState.GetPointer());
			}
			else if(c_oSer_TablePart::TableColumns == type)
			{
				pTable->m_oTableColumns.Init();
				res = Read1(length, &BinaryTableReader::ReadTableColumns, this, pTable->m_oTableColumns.GetPointer());
			}
			else if(c_oSer_TablePart::TableStyleInfo == type)
			{
				pTable->m_oTableStyleInfo.Init();
				res = Read2(length, &BinaryTableReader::ReadTableStyleInfo, this, pTable->m_oTableStyleInfo.GetPointer());
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		}
		int ReadAutoFilter(BYTE type, long length, void* poResult)
		{
			int res = c_oSerConstants::ReadOk;
			OOX::Spreadsheet::CAutofilter* pAutofilter = static_cast<OOX::Spreadsheet::CAutofilter*>(poResult);
			if(c_oSer_AutoFilter::Ref == type)
			{
				pAutofilter->m_oRef.Init();
				pAutofilter->m_oRef->SetValue(m_oBufferedStream.ReadString2(length));
			}
			else if(c_oSer_AutoFilter::FilterColumns == type)
			{
				res = Read1(length, &BinaryTableReader::ReadFilterColumns, this, poResult);
			}
			else if(c_oSer_AutoFilter::SortState == type)
			{
				pAutofilter->m_oSortState.Init();
				res = Read1(length, &BinaryTableReader::ReadSortState, this, pAutofilter->m_oSortState.GetPointer());
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		}
		int ReadFilterColumns(BYTE type, long length, void* poResult)
		{
			int res = c_oSerConstants::ReadOk;
			OOX::Spreadsheet::CAutofilter* pAutofilter = static_cast<OOX::Spreadsheet::CAutofilter*>(poResult);
			if(c_oSer_AutoFilter::FilterColumn == type)
			{
				OOX::Spreadsheet::CFilterColumn* pFilterColumn = new OOX::Spreadsheet::CFilterColumn();
				res = Read1(length, &BinaryTableReader::ReadFilterColumn, this, pFilterColumn);
				pAutofilter->m_arrItems.Add(pFilterColumn);
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		}
		int ReadFilterColumn(BYTE type, long length, void* poResult)
		{
			int res = c_oSerConstants::ReadOk;
			OOX::Spreadsheet::CFilterColumn* pFilterColumn = static_cast<OOX::Spreadsheet::CFilterColumn*>(poResult);
			if(c_oSer_FilterColumn::ColId == type)
			{
				pFilterColumn->m_oColId.Init();
				pFilterColumn->m_oColId->SetValue(m_oBufferedStream.ReadLong());
			}
			else if(c_oSer_FilterColumn::Filters == type)
			{
				pFilterColumn->m_oFilters.Init();
				res = Read1(length, &BinaryTableReader::ReadFilterFilters, this, pFilterColumn->m_oFilters.GetPointer());
			}
			else if(c_oSer_FilterColumn::CustomFilters == type)
			{
				pFilterColumn->m_oCustomFilters.Init();
				res = Read1(length, &BinaryTableReader::ReadCustomFilters, this, pFilterColumn->m_oCustomFilters.GetPointer());
			}
			else if(c_oSer_FilterColumn::DynamicFilter == type)
			{
				pFilterColumn->m_oDynamicFilter.Init();
				res = Read2(length, &BinaryTableReader::ReadDynamicFilter, this, pFilterColumn->m_oDynamicFilter.GetPointer());
			}
			else if(c_oSer_FilterColumn::ColorFilter == type)
			{
				pFilterColumn->m_oColorFilter.Init();
				res = Read2(length, &BinaryTableReader::ReadColorFilter, this, pFilterColumn->m_oColorFilter.GetPointer());
			}
			else if(c_oSer_FilterColumn::Top10 == type)
			{
				pFilterColumn->m_oTop10.Init();
				res = Read2(length, &BinaryTableReader::ReadTop10, this, pFilterColumn->m_oTop10.GetPointer());
			}
			else if(c_oSer_FilterColumn::HiddenButton == type)
			{
				pFilterColumn->m_oHiddenButton.Init();
				pFilterColumn->m_oHiddenButton->FromBool(m_oBufferedStream.ReadBool());
			}
			else if(c_oSer_FilterColumn::ShowButton == type)
			{
				pFilterColumn->m_oShowButton.Init();
				pFilterColumn->m_oShowButton->FromBool(m_oBufferedStream.ReadBool());
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		}
		int ReadFilterFilters(BYTE type, long length, void* poResult)
		{
			int res = c_oSerConstants::ReadOk;
			OOX::Spreadsheet::CFilters* pFilters = static_cast<OOX::Spreadsheet::CFilters*>(poResult);
			if(c_oSer_FilterColumn::Filter == type)
			{
				OOX::Spreadsheet::CFilter* pFilter = new OOX::Spreadsheet::CFilter();
				res = Read1(length, &BinaryTableReader::ReadFilterFilter, this, pFilter);
				pFilters->m_arrItems.Add(pFilter);
			}
			else if(c_oSer_FilterColumn::DateGroupItem == type)
			{
				OOX::Spreadsheet::CDateGroupItem* pDateGroupItem = new OOX::Spreadsheet::CDateGroupItem();
				res = Read2(length, &BinaryTableReader::ReadDateGroupItem, this, pDateGroupItem);
				pFilters->m_arrItems.Add(pDateGroupItem);
			}
			else if(c_oSer_FilterColumn::FiltersBlank == type)
			{
				pFilters->m_oBlank.Init();
				pFilters->m_oBlank->FromBool(m_oBufferedStream.ReadBool());
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		}
		int ReadFilterFilter(BYTE type, long length, void* poResult)
		{
			int res = c_oSerConstants::ReadOk;
			OOX::Spreadsheet::CFilter* pFilters = static_cast<OOX::Spreadsheet::CFilter*>(poResult);
			if(c_oSer_Filter::Val == type)
			{
				pFilters->m_oVal.Init();
				pFilters->m_oVal->Append(m_oBufferedStream.ReadString2(length));
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		}
		int ReadDateGroupItem(BYTE type, long length, void* poResult)
		{
			int res = c_oSerConstants::ReadOk;
			OOX::Spreadsheet::CDateGroupItem* pDateGroupItem = static_cast<OOX::Spreadsheet::CDateGroupItem*>(poResult);
			if(c_oSer_DateGroupItem::DateTimeGrouping == type)
			{
				pDateGroupItem->m_oDateTimeGrouping.Init();
				pDateGroupItem->m_oDateTimeGrouping->SetValue((SimpleTypes::Spreadsheet::EDateTimeGroup)m_oBufferedStream.ReadByte());
			}
			else if(c_oSer_DateGroupItem::Day == type)
			{
				pDateGroupItem->m_oDay.Init();
				pDateGroupItem->m_oDay->SetValue(m_oBufferedStream.ReadLong());
			}
			else if(c_oSer_DateGroupItem::Hour == type)
			{
				pDateGroupItem->m_oHour.Init();
				pDateGroupItem->m_oHour->SetValue(m_oBufferedStream.ReadLong());
			}
			else if(c_oSer_DateGroupItem::Minute == type)
			{
				pDateGroupItem->m_oMinute.Init();
				pDateGroupItem->m_oMinute->SetValue(m_oBufferedStream.ReadLong());
			}
			else if(c_oSer_DateGroupItem::Month == type)
			{
				pDateGroupItem->m_oMonth.Init();
				pDateGroupItem->m_oMonth->SetValue(m_oBufferedStream.ReadLong());
			}
			else if(c_oSer_DateGroupItem::Second == type)
			{
				pDateGroupItem->m_oSecond.Init();
				pDateGroupItem->m_oSecond->SetValue(m_oBufferedStream.ReadLong());
			}
			else if(c_oSer_DateGroupItem::Year == type)
			{
				pDateGroupItem->m_oYear.Init();
				pDateGroupItem->m_oYear->SetValue(m_oBufferedStream.ReadLong());
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		}
		int ReadCustomFilters(BYTE type, long length, void* poResult)
		{
			int res = c_oSerConstants::ReadOk;
			OOX::Spreadsheet::CCustomFilters* pCustomFilters = static_cast<OOX::Spreadsheet::CCustomFilters*>(poResult);
			if(c_oSer_CustomFilters::And == type)
			{
				pCustomFilters->m_oAnd.Init();
				pCustomFilters->m_oAnd->FromBool(m_oBufferedStream.ReadBool());
			}
			else if(c_oSer_CustomFilters::CustomFilters == type)
			{
				res = Read1(length, &BinaryTableReader::ReadCustomFilter, this, poResult);
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		}
		int ReadCustomFilter(BYTE type, long length, void* poResult)
		{
			int res = c_oSerConstants::ReadOk;
			OOX::Spreadsheet::CCustomFilters* pCustomFilters = static_cast<OOX::Spreadsheet::CCustomFilters*>(poResult);
			if(c_oSer_CustomFilters::CustomFilter == type)
			{
				OOX::Spreadsheet::CCustomFilter* pCustomFilter = new OOX::Spreadsheet::CCustomFilter();
				res = Read2(length, &BinaryTableReader::ReadCustomFiltersItem, this, pCustomFilter);
				pCustomFilters->m_arrItems.Add(pCustomFilter);
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		}
		int ReadCustomFiltersItem(BYTE type, long length, void* poResult)
		{
			int res = c_oSerConstants::ReadOk;
			OOX::Spreadsheet::CCustomFilter* pCustomFilter = static_cast<OOX::Spreadsheet::CCustomFilter*>(poResult);
			if(c_oSer_CustomFilters::Operator == type)
			{
				pCustomFilter->m_oOperator.Init();
				pCustomFilter->m_oOperator->SetValue((SimpleTypes::Spreadsheet::ECustomFilter)m_oBufferedStream.ReadByte());
			}
			else if(c_oSer_CustomFilters::Val == type)
			{
				pCustomFilter->m_oVal.Init();
				pCustomFilter->m_oVal->Append(m_oBufferedStream.ReadString2(length));
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		}
		int ReadDynamicFilter(BYTE type, long length, void* poResult)
		{
			int res = c_oSerConstants::ReadOk;
			OOX::Spreadsheet::CDynamicFilter* pDynamicFilter = static_cast<OOX::Spreadsheet::CDynamicFilter*>(poResult);
			if(c_oSer_DynamicFilter::Type == type)
			{
				pDynamicFilter->m_oType.Init();
				pDynamicFilter->m_oType->SetValue((SimpleTypes::Spreadsheet::EDynamicFilterType)m_oBufferedStream.ReadByte());
			}
			else if(c_oSer_DynamicFilter::Val == type)
			{
				pDynamicFilter->m_oVal.Init();
				pDynamicFilter->m_oVal->SetValue(m_oBufferedStream.ReadDouble());
			}
			else if(c_oSer_DynamicFilter::MaxVal == type)
			{
				pDynamicFilter->m_oMaxVal.Init();
				pDynamicFilter->m_oMaxVal->SetValue(m_oBufferedStream.ReadDouble());
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		}
		int ReadColorFilter(BYTE type, long length, void* poResult)
		{
			int res = c_oSerConstants::ReadOk;
			OOX::Spreadsheet::CColorFilter* pColorFilter = static_cast<OOX::Spreadsheet::CColorFilter*>(poResult);
			if(c_oSer_ColorFilter::CellColor == type)
			{
				pColorFilter->m_oCellColor.Init();
				pColorFilter->m_oCellColor->FromBool(m_oBufferedStream.ReadBool());
			}
			else if(c_oSer_ColorFilter::DxfId == type)
			{
				pColorFilter->m_oDxfId.Init();
				pColorFilter->m_oDxfId->SetValue(m_oBufferedStream.ReadLong());
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		}
		int ReadTop10(BYTE type, long length, void* poResult)
		{
			int res = c_oSerConstants::ReadOk;
			OOX::Spreadsheet::CTop10* pTop10 = static_cast<OOX::Spreadsheet::CTop10*>(poResult);
			if(c_oSer_Top10::FilterVal == type)
			{
				pTop10->m_oFilterVal.Init();
				pTop10->m_oFilterVal->SetValue(m_oBufferedStream.ReadDouble());
			}
			else if(c_oSer_Top10::Percent == type)
			{
				pTop10->m_oPercent.Init();
				pTop10->m_oPercent->FromBool(m_oBufferedStream.ReadBool());
			}
			else if(c_oSer_Top10::Top == type)
			{
				pTop10->m_oTop.Init();
				pTop10->m_oTop->FromBool(m_oBufferedStream.ReadBool());
			}
			else if(c_oSer_Top10::Val == type)
			{
				pTop10->m_oVal.Init();
				pTop10->m_oVal->SetValue(m_oBufferedStream.ReadDouble());
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		}
		int ReadSortState(BYTE type, long length, void* poResult)
		{
			int res = c_oSerConstants::ReadOk;
			OOX::Spreadsheet::CSortState* pSortState = static_cast<OOX::Spreadsheet::CSortState*>(poResult);
			if(c_oSer_SortState::Ref == type)
			{
				pSortState->m_oRef.Init();
				pSortState->m_oRef->SetValue(m_oBufferedStream.ReadString2(length));
			}
			else if(c_oSer_SortState::CaseSensitive == type)
			{
				pSortState->m_oCaseSensitive.Init();
				pSortState->m_oCaseSensitive->FromBool(m_oBufferedStream.ReadBool());
			}
			else if(c_oSer_SortState::SortConditions == type)
			{
				res = Read1(length, &BinaryTableReader::ReadSortConditions, this, pSortState);
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		}
		int ReadSortConditions(BYTE type, long length, void* poResult)
		{
			int res = c_oSerConstants::ReadOk;
			OOX::Spreadsheet::CSortState* pSortState = static_cast<OOX::Spreadsheet::CSortState*>(poResult);
			if(c_oSer_SortState::SortCondition == type)
			{
				OOX::Spreadsheet::CSortCondition* pSortCondition = new OOX::Spreadsheet::CSortCondition();
				res = Read2(length, &BinaryTableReader::ReadSortCondition, this, pSortCondition);
				pSortState->m_arrItems.Add(pSortCondition);
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		}
		int ReadSortCondition(BYTE type, long length, void* poResult)
		{
			int res = c_oSerConstants::ReadOk;
			OOX::Spreadsheet::CSortCondition* pSortCondition = static_cast<OOX::Spreadsheet::CSortCondition*>(poResult);
			if(c_oSer_SortState::ConditionRef == type)
			{
				pSortCondition->m_oRef.Init();
				pSortCondition->m_oRef->SetValue(m_oBufferedStream.ReadString2(length));
			}
			else if(c_oSer_SortState::ConditionSortBy == type)
			{
				pSortCondition->m_oSortBy.Init();
				pSortCondition->m_oSortBy->SetValue((SimpleTypes::Spreadsheet::ESortBy)m_oBufferedStream.ReadByte());
			}
			else if(c_oSer_SortState::ConditionDescending == type)
			{
				pSortCondition->m_oDescending.Init();
				pSortCondition->m_oDescending->FromBool(m_oBufferedStream.ReadBool());
			}
			else if(c_oSer_SortState::ConditionDxfId == type)
			{
				pSortCondition->m_oDxfId.Init();
				pSortCondition->m_oDxfId->SetValue(m_oBufferedStream.ReadLong());
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		}
		int ReadTableColumns(BYTE type, long length, void* poResult)
		{
			int res = c_oSerConstants::ReadOk;
			OOX::Spreadsheet::CTableColumns* pTableColumns = static_cast<OOX::Spreadsheet::CTableColumns*>(poResult);
			if(c_oSer_TableColumns::TableColumn == type)
			{
				OOX::Spreadsheet::CTableColumn* pTableColumn = new OOX::Spreadsheet::CTableColumn();
				res = Read1(length, &BinaryTableReader::ReadTableColumn, this, pTableColumn);
				pTableColumn->m_oId.Init();
				pTableColumn->m_oId->SetValue(pTableColumns->m_arrItems.GetSize() + 1);
				pTableColumns->m_arrItems.Add(pTableColumn);
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		}
		int ReadTableColumn(BYTE type, long length, void* poResult)
		{
			int res = c_oSerConstants::ReadOk;
			OOX::Spreadsheet::CTableColumn* pTableColumn = static_cast<OOX::Spreadsheet::CTableColumn*>(poResult);
			if(c_oSer_TableColumns::Name == type)
			{
				pTableColumn->m_oName.Init();
				pTableColumn->m_oName->Append(m_oBufferedStream.ReadString2(length));
			}
			else if(c_oSer_TableColumns::TotalsRowLabel == type)
			{
				pTableColumn->m_oTotalsRowLabel.Init();
				pTableColumn->m_oTotalsRowLabel->Append(m_oBufferedStream.ReadString2(length));
			}
			else if(c_oSer_TableColumns::TotalsRowFunction == type)
			{
				pTableColumn->m_oTotalsRowFunction.Init();
				pTableColumn->m_oTotalsRowFunction->SetValue((SimpleTypes::Spreadsheet::ETotalsRowFunction)m_oBufferedStream.ReadByte());
			}
			else if(c_oSer_TableColumns::TotalsRowFormula == type)
			{
				pTableColumn->m_oTotalsRowFormula.Init();
				pTableColumn->m_oTotalsRowFormula->Append(m_oBufferedStream.ReadString2(length));
			}
			else if(c_oSer_TableColumns::DataDxfId == type)
			{
				pTableColumn->m_oDataDxfId.Init();
				pTableColumn->m_oDataDxfId->SetValue(m_oBufferedStream.ReadLong());
			}
			else if(c_oSer_TableColumns::CalculatedColumnFormula == type)
			{
				pTableColumn->m_oCalculatedColumnFormula.Init();
				pTableColumn->m_oCalculatedColumnFormula->Append(m_oBufferedStream.ReadString2(length));
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		}
		int ReadTableStyleInfo(BYTE type, long length, void* poResult)
		{
			int res = c_oSerConstants::ReadOk;
			OOX::Spreadsheet::CTableStyleInfo* pTableStyleInfo = static_cast<OOX::Spreadsheet::CTableStyleInfo*>(poResult);
			if(c_oSer_TableStyleInfo::Name == type)
			{
				pTableStyleInfo->m_oName.Init();
				pTableStyleInfo->m_oName->Append(m_oBufferedStream.ReadString2(length));
			}
			else if(c_oSer_TableStyleInfo::ShowColumnStripes == type)
			{
				pTableStyleInfo->m_oShowColumnStripes.Init();
				pTableStyleInfo->m_oShowColumnStripes->FromBool(m_oBufferedStream.ReadBool());
			}
			else if(c_oSer_TableStyleInfo::ShowRowStripes == type)
			{
				pTableStyleInfo->m_oShowRowStripes.Init();
				pTableStyleInfo->m_oShowRowStripes->FromBool(m_oBufferedStream.ReadBool());
			}
			else if(c_oSer_TableStyleInfo::ShowFirstColumn == type)
			{
				pTableStyleInfo->m_oShowFirstColumn.Init();
				pTableStyleInfo->m_oShowFirstColumn->FromBool(m_oBufferedStream.ReadBool());
			}
			else if(c_oSer_TableStyleInfo::ShowLastColumn == type)
			{
				pTableStyleInfo->m_oShowLastColumn.Init();
				pTableStyleInfo->m_oShowLastColumn->FromBool(m_oBufferedStream.ReadBool());
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		}
	};
	class BinarySharedStringTableReader : public Binary_CommonReader<BinarySharedStringTableReader>
	{
		OOX::Spreadsheet::CSharedStrings& m_oSharedStrings;
		Binary_CommonReader2 m_oBcr;
	public:
		BinarySharedStringTableReader(Streams::CBufferedStream& oBufferedStream, OOX::Spreadsheet::CSharedStrings& oSharedStrings):Binary_CommonReader(oBufferedStream), m_oSharedStrings(oSharedStrings), m_oBcr(oBufferedStream)
		{
		}
		int Read()
		{
			int res = ReadTable(&BinarySharedStringTableReader::ReadSharedStringTableContent, this);
			m_oSharedStrings.m_oCount.Init();
			m_oSharedStrings.m_oCount->SetValue(m_oSharedStrings.m_arrItems.GetSize());
			m_oSharedStrings.m_oUniqueCount.Init();
			m_oSharedStrings.m_oUniqueCount->SetValue(m_oSharedStrings.m_arrItems.GetSize());
			return res;
		};
		int ReadSharedStringTableContent(BYTE type, long length, void* poResult)
		{
			int res = c_oSerConstants::ReadOk;
			if(c_oSerSharedStringTypes::Si == type)
			{
				OOX::Spreadsheet::CSi* pSi = new OOX::Spreadsheet::CSi();
				res = Read1(length, &BinarySharedStringTableReader::ReadSi, this, pSi);
				m_oSharedStrings.m_arrItems.Add(pSi);
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		};
		int ReadSi(BYTE type, long length, void* poResult)
		{
			OOX::Spreadsheet::CSi* pSi = static_cast<OOX::Spreadsheet::CSi*>(poResult);
			int res = c_oSerConstants::ReadOk;
			if(c_oSerSharedStringTypes::Run == type)
			{
				OOX::Spreadsheet::CRun* pRun = new OOX::Spreadsheet::CRun();
				res = Read1(length, &BinarySharedStringTableReader::ReadRun, this, pRun);
				pSi->m_arrItems.Add(pRun);
			}
			else if(c_oSerSharedStringTypes::Text == type)
			{
				CString sText((wchar_t*)m_oBufferedStream.ReadPointer(length), length / 2);
				OOX::Spreadsheet::CText* pText = new OOX::Spreadsheet::CText();
				pText->m_sText = sText;
				if(-1 == sText.Find(_T(" ")))
				{
					pText->m_oSpace.Init();
					pText->m_oSpace->SetValue(SimpleTypes::xmlspacePreserve);
				}
				pSi->m_arrItems.Add(pText);
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		};
		int ReadRun(BYTE type, long length, void* poResult)
		{
			OOX::Spreadsheet::CRun* pRun = static_cast<OOX::Spreadsheet::CRun*>(poResult);
			int res = c_oSerConstants::ReadOk;
			if(c_oSerSharedStringTypes::RPr == type)
			{
				pRun->m_oRPr.Init();
				res = Read2(length, &BinarySharedStringTableReader::ReadRPr, this, pRun->m_oRPr.GetPointer());
			}
			else if(c_oSerSharedStringTypes::Text == type)
			{
				CString sText((wchar_t*)m_oBufferedStream.ReadPointer(length), length / 2);
				OOX::Spreadsheet::CText* pText = new OOX::Spreadsheet::CText();
				pText->m_sText = sText;
				if(-1 == sText.Find(_T(" ")))
				{
					pText->m_oSpace.Init();
					pText->m_oSpace->SetValue(SimpleTypes::xmlspacePreserve);
				}
				pRun->m_arrItems.Add(pText);
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		};
		int ReadRPr(BYTE type, long length, void* poResult)
		{
			OOX::Spreadsheet::CRPr* pFont = static_cast<OOX::Spreadsheet::CRPr* >(poResult);
			int res = c_oSerConstants::ReadOk;
			if(c_oSerFontTypes::Bold == type)
			{
				pFont->m_oBold.Init();
				pFont->m_oBold->m_oVal.SetValue((false != m_oBufferedStream.ReadBool()) ? SimpleTypes::onoffTrue : SimpleTypes::onoffFalse);
			}
			else if(c_oSerFontTypes::Color == type)
			{
				pFont->m_oColor.Init();
				res = Read2(length, &BinarySharedStringTableReader::ReadColor, this, pFont->m_oColor.GetPointer());
			}
			else if(c_oSerFontTypes::Italic == type)
			{
				pFont->m_oItalic.Init();
				pFont->m_oItalic->m_oVal.SetValue((false != m_oBufferedStream.ReadBool()) ? SimpleTypes::onoffTrue : SimpleTypes::onoffFalse);
			}
			else if(c_oSerFontTypes::RFont == type)
			{
				CString sFontName((wchar_t*)m_oBufferedStream.ReadPointer(length), length / 2);
				pFont->m_oRFont.Init();
				pFont->m_oRFont->m_sVal.Init();
				pFont->m_oRFont->m_sVal->Append(sFontName);
			}
			else if(c_oSerFontTypes::Scheme == type)
			{
				pFont->m_oScheme.Init();
				pFont->m_oScheme->m_oFontScheme.Init();
				pFont->m_oScheme->m_oFontScheme->SetValue((SimpleTypes::Spreadsheet::EFontScheme)m_oBufferedStream.ReadByte());
			}
			else if(c_oSerFontTypes::Strike == type)
			{
				pFont->m_oStrike.Init();
				pFont->m_oStrike->m_oVal.SetValue((false != m_oBufferedStream.ReadBool()) ? SimpleTypes::onoffTrue : SimpleTypes::onoffFalse);
			}
			else if(c_oSerFontTypes::Sz == type)
			{
				pFont->m_oSz.Init();
				pFont->m_oSz->m_oVal.Init();
				pFont->m_oSz->m_oVal->SetValue(m_oBufferedStream.ReadDouble());
			}
			else if(c_oSerFontTypes::Underline == type)
			{
				pFont->m_oUnderline.Init();
				pFont->m_oUnderline->m_oUnderline.Init();
				pFont->m_oUnderline->m_oUnderline->SetValue((SimpleTypes::Spreadsheet::EUnderline)m_oBufferedStream.ReadByte());
			}
			else if(c_oSerFontTypes::VertAlign == type)
			{
				pFont->m_oVertAlign.Init();
				pFont->m_oVertAlign->m_oVerticalAlign.Init();
				pFont->m_oVertAlign->m_oVerticalAlign->SetValue((SimpleTypes::EVerticalAlignRun)m_oBufferedStream.ReadByte());
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		};
		int ReadColor(BYTE type, long length, void* poResult)
		{
			return m_oBcr.ReadColor(type, length, poResult);
		}
	};
	class BinaryStyleTableReader : public Binary_CommonReader<BinaryStyleTableReader>
	{
		OOX::Spreadsheet::CStyles& m_oStyles;
		Binary_CommonReader2 m_oBcr;
	public:
		BinaryStyleTableReader(Streams::CBufferedStream& oBufferedStream, OOX::Spreadsheet::CStyles& oStyles):Binary_CommonReader(oBufferedStream), m_oStyles(oStyles), m_oBcr(oBufferedStream)
		{
		}
		int Read()
		{
			return ReadTable(&BinaryStyleTableReader::ReadStyleTableContent, this);
		};
		int ReadStyleTableContent(BYTE type, long length, void* poResult)
		{
			int res = c_oSerConstants::ReadOk;
			if(c_oSerStylesTypes::Borders == type)
			{
				m_oStyles.m_oBorders.Init();
				res = Read1(length, &BinaryStyleTableReader::ReadBorders, this, poResult);
				m_oStyles.m_oBorders->m_oCount.Init();
				m_oStyles.m_oBorders->m_oCount->SetValue(m_oStyles.m_oBorders->m_arrItems.GetSize());
			}
			else if(c_oSerStylesTypes::Fills == type)
			{
				m_oStyles.m_oFills.Init();
				res = Read1(length, &BinaryStyleTableReader::ReadFills, this, poResult);
				m_oStyles.m_oFills->m_oCount.Init();
				m_oStyles.m_oFills->m_oCount->SetValue(m_oStyles.m_oFills->m_arrItems.GetSize());
			}
			else if(c_oSerStylesTypes::Fonts == type)
			{
				m_oStyles.m_oFonts.Init();
				res = Read1(length, &BinaryStyleTableReader::ReadFonts, this, poResult);
				m_oStyles.m_oFonts->m_oCount.Init();
				m_oStyles.m_oFonts->m_oCount->SetValue(m_oStyles.m_oFonts->m_arrItems.GetSize());
			}
			else if(c_oSerStylesTypes::NumFmts == type)
			{
				m_oStyles.m_oNumFmts.Init();
				res = Read1(length, &BinaryStyleTableReader::ReadNumFmts, this, poResult);
				m_oStyles.m_oNumFmts->m_oCount.Init();
				m_oStyles.m_oNumFmts->m_oCount->SetValue(m_oStyles.m_oNumFmts->m_arrItems.GetSize());
			}
			else if(c_oSerStylesTypes::CellStyleXfs == type)
			{
				m_oStyles.m_oCellStyleXfs.Init();
				res = Read1(length, &BinaryStyleTableReader::ReadCellStyleXfs, this, poResult);
				m_oStyles.m_oCellStyleXfs->m_oCount.Init();
				m_oStyles.m_oCellStyleXfs->m_oCount->SetValue(m_oStyles.m_oCellStyleXfs->m_arrItems.GetSize());
			}
			else if(c_oSerStylesTypes::CellXfs == type)
			{
				m_oStyles.m_oCellXfs.Init();
				res = Read1(length, &BinaryStyleTableReader::ReadCellXfs, this, poResult);
				m_oStyles.m_oCellXfs->m_oCount.Init();
				m_oStyles.m_oCellXfs->m_oCount->SetValue(m_oStyles.m_oCellXfs->m_arrItems.GetSize());
			}
			else if(c_oSerStylesTypes::CellStyles == type)
			{
				m_oStyles.m_oCellStyles.Init();
				res = Read1(length, &BinaryStyleTableReader::ReadCellStyles, this, poResult);
				m_oStyles.m_oCellStyles->m_oCount.Init();
				m_oStyles.m_oCellStyles->m_oCount->SetValue(m_oStyles.m_oCellStyles->m_arrItems.GetSize());
			}
			else if(c_oSerStylesTypes::Dxfs == type)
			{
				m_oStyles.m_oDxfs.Init();
				res = Read1(length, &BinaryStyleTableReader::ReadDxfs, this, m_oStyles.m_oDxfs.GetPointer());
				m_oStyles.m_oDxfs->m_oCount.Init();
				m_oStyles.m_oDxfs->m_oCount->SetValue(m_oStyles.m_oDxfs->m_arrItems.GetSize());
			}
			else if(c_oSerStylesTypes::TableStyles == type)
			{
				m_oStyles.m_oTableStyles.Init();
				res = Read1(length, &BinaryStyleTableReader::ReadTableStyles, this, m_oStyles.m_oTableStyles.GetPointer());
				if(false == m_oStyles.m_oTableStyles->m_oCount.IsInit())
				{
					m_oStyles.m_oTableStyles->m_oCount.Init();
					m_oStyles.m_oTableStyles->m_oCount->SetValue(0);
				}
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		};
		int ReadBorders(BYTE type, long length, void* poResult)
		{
			int res = c_oSerConstants::ReadOk;
			if(c_oSerStylesTypes::Border == type)
			{
				OOX::Spreadsheet::CBorder* pBorder = new OOX::Spreadsheet::CBorder();
				res = Read1(length, &BinaryStyleTableReader::ReadBorder, this, pBorder);
				m_oStyles.m_oBorders->m_arrItems.Add(pBorder);
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		};
		int ReadBorder(BYTE type, long length, void* poResult)
		{
			OOX::Spreadsheet::CBorder* pBorder = static_cast<OOX::Spreadsheet::CBorder*>(poResult);
			int res = c_oSerConstants::ReadOk;
			if(c_oSerBorderTypes::Bottom == type)
			{
				pBorder->m_oBottom.Init();
				res = Read2(length, &BinaryStyleTableReader::ReadBorderProp, this, pBorder->m_oBottom.GetPointer());
			}
			else if(c_oSerBorderTypes::Diagonal == type)
			{
				pBorder->m_oDiagonal.Init();
				res = Read2(length, &BinaryStyleTableReader::ReadBorderProp, this, pBorder->m_oDiagonal.GetPointer());
			}
			else if(c_oSerBorderTypes::End == type)
			{
				pBorder->m_oEnd.Init();
				res = Read2(length, &BinaryStyleTableReader::ReadBorderProp, this, pBorder->m_oEnd.GetPointer());
			}
			else if(c_oSerBorderTypes::Horizontal == type)
			{
				pBorder->m_oHorizontal.Init();
				res = Read2(length, &BinaryStyleTableReader::ReadBorderProp, this, pBorder->m_oHorizontal.GetPointer());
			}
			else if(c_oSerBorderTypes::Start == type)
			{
				pBorder->m_oStart.Init();
				res = Read2(length, &BinaryStyleTableReader::ReadBorderProp, this, pBorder->m_oStart.GetPointer());
			}
			else if(c_oSerBorderTypes::Top == type)
			{
				pBorder->m_oTop.Init();
				res = Read2(length, &BinaryStyleTableReader::ReadBorderProp, this, pBorder->m_oTop.GetPointer());
			}
			else if(c_oSerBorderTypes::Vertical == type)
			{
				pBorder->m_oVertical.Init();
				res = Read2(length, &BinaryStyleTableReader::ReadBorderProp, this, pBorder->m_oVertical.GetPointer());
			}
			else if(c_oSerBorderTypes::DiagonalDown == type)
			{
				pBorder->m_oDiagonalDown.Init();
				bool bDD = m_oBufferedStream.ReadBool();
				pBorder->m_oDiagonalDown->SetValue((false != bDD) ? SimpleTypes::onoffTrue : SimpleTypes::onoffFalse);
			}
			else if(c_oSerBorderTypes::DiagonalUp == type)
			{
				pBorder->m_oDiagonalUp.Init();
				bool bDU = m_oBufferedStream.ReadBool();
				pBorder->m_oDiagonalUp->SetValue((false != bDU) ? SimpleTypes::onoffTrue : SimpleTypes::onoffFalse);
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		};
		int ReadBorderProp(BYTE type, long length, void* poResult)
		{
			OOX::Spreadsheet::CBorderProp* pBorderProp = static_cast<OOX::Spreadsheet::CBorderProp*>(poResult);
			int res = c_oSerConstants::ReadOk;
			if(c_oSerBorderPropTypes::Style == type)
			{
				pBorderProp->m_oStyle.Init();
				pBorderProp->m_oStyle->SetValue((SimpleTypes::Spreadsheet::EBorderStyle)m_oBufferedStream.ReadByte());
			}
			else if(c_oSerBorderPropTypes::Color == type)
			{
				pBorderProp->m_oColor.Init();
				res = Read2(length, &BinaryStyleTableReader::ReadColor, this, pBorderProp->m_oColor.GetPointer());
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		};
		int ReadColor(BYTE type, long length, void* poResult)
		{
			return m_oBcr.ReadColor(type, length, poResult);
		}
		int ReadFills(BYTE type, long length, void* poResult)
		{
			int res = c_oSerConstants::ReadOk;
			if(c_oSerStylesTypes::Fill == type)
			{
				OOX::Spreadsheet::CFill* pFill = new OOX::Spreadsheet::CFill();
				pFill->m_oPatternFill.Init();
				pFill->m_oPatternFill->m_oPatternType.Init();
				pFill->m_oPatternFill->m_oPatternType->SetValue(SimpleTypes::Spreadsheet::patterntypeNone);
				res = Read1(length, &BinaryStyleTableReader::ReadFill, this, pFill);
				m_oStyles.m_oFills->m_arrItems.Add(pFill);
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		};
		int ReadFill(BYTE type, long length, void* poResult)
		{
			OOX::Spreadsheet::CFill* pFill = static_cast<OOX::Spreadsheet::CFill* >(poResult);
			int res = c_oSerConstants::ReadOk;
			if(c_oSerFillTypes::PatternFill == type)
			{
				if(false == pFill->m_oPatternFill.IsInit())
				{
					pFill->m_oPatternFill.Init();
					pFill->m_oPatternFill->m_oPatternType.Init();
					pFill->m_oPatternFill->m_oPatternType->SetValue(SimpleTypes::Spreadsheet::patterntypeNone);
				}
				res = Read1(length, &BinaryStyleTableReader::ReadPatternFill, this, pFill->m_oPatternFill.GetPointer());
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		};
		int ReadPatternFill(BYTE type, long length, void* poResult)
		{
			OOX::Spreadsheet::CPatternFill* pPatternFill = static_cast<OOX::Spreadsheet::CPatternFill* >(poResult);
			int res = c_oSerConstants::ReadOk;
			if(c_oSerFillTypes::PatternFillBgColor == type)
			{
				pPatternFill->m_oFgColor.Init();
				res = Read2(length, &BinaryStyleTableReader::ReadColor, this, pPatternFill->m_oFgColor.GetPointer());
				pPatternFill->m_oPatternType->SetValue(SimpleTypes::Spreadsheet::patterntypeSolid);
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		};
		int ReadFonts(BYTE type, long length, void* poResult)
		{
			int res = c_oSerConstants::ReadOk;
			if(c_oSerStylesTypes::Font == type)
			{
				OOX::Spreadsheet::CFont* pFont = new OOX::Spreadsheet::CFont();
				res = Read2(length, &BinaryStyleTableReader::ReadFont, this, pFont);
				m_oStyles.m_oFonts->m_arrItems.Add(pFont);
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		};
		int ReadFont(BYTE type, long length, void* poResult)
		{
			OOX::Spreadsheet::CFont* pFont = static_cast<OOX::Spreadsheet::CFont* >(poResult);
			int res = c_oSerConstants::ReadOk;
			if(c_oSerFontTypes::Bold == type)
			{
				pFont->m_oBold.Init();
				pFont->m_oBold->m_oVal.SetValue((false != m_oBufferedStream.ReadBool()) ? SimpleTypes::onoffTrue : SimpleTypes::onoffFalse);
			}
			else if(c_oSerFontTypes::Color == type)
			{
				pFont->m_oColor.Init();
				res = Read2(length, &BinaryStyleTableReader::ReadColor, this, pFont->m_oColor.GetPointer());
			}
			else if(c_oSerFontTypes::Italic == type)
			{
				pFont->m_oItalic.Init();
				pFont->m_oItalic->m_oVal.SetValue((false != m_oBufferedStream.ReadBool()) ? SimpleTypes::onoffTrue : SimpleTypes::onoffFalse);
			}
			else if(c_oSerFontTypes::RFont == type)
			{
				CString sFontName((wchar_t*)m_oBufferedStream.ReadPointer(length), length / 2);
				pFont->m_oRFont.Init();
				pFont->m_oRFont->m_sVal.Init();
				pFont->m_oRFont->m_sVal->Append(sFontName);
			}
			else if(c_oSerFontTypes::Scheme == type)
			{
				pFont->m_oScheme.Init();
				pFont->m_oScheme->m_oFontScheme.Init();
				pFont->m_oScheme->m_oFontScheme->SetValue((SimpleTypes::Spreadsheet::EFontScheme)m_oBufferedStream.ReadByte());
			}
			else if(c_oSerFontTypes::Strike == type)
			{
				pFont->m_oStrike.Init();
				pFont->m_oStrike->m_oVal.SetValue((false != m_oBufferedStream.ReadBool()) ? SimpleTypes::onoffTrue : SimpleTypes::onoffFalse);
			}
			else if(c_oSerFontTypes::Sz == type)
			{
				pFont->m_oSz.Init();
				pFont->m_oSz->m_oVal.Init();
				pFont->m_oSz->m_oVal->SetValue(m_oBufferedStream.ReadDouble());
			}
			else if(c_oSerFontTypes::Underline == type)
			{
				pFont->m_oUnderline.Init();
				pFont->m_oUnderline->m_oUnderline.Init();
				pFont->m_oUnderline->m_oUnderline->SetValue((SimpleTypes::Spreadsheet::EUnderline)m_oBufferedStream.ReadByte());
			}
			else if(c_oSerFontTypes::VertAlign == type)
			{
				pFont->m_oVertAlign.Init();
				pFont->m_oVertAlign->m_oVerticalAlign.Init();
				pFont->m_oVertAlign->m_oVerticalAlign->SetValue((SimpleTypes::EVerticalAlignRun)m_oBufferedStream.ReadByte());
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		};
		int ReadNumFmts(BYTE type, long length, void* poResult)
		{
			int res = c_oSerConstants::ReadOk;
			if(c_oSerStylesTypes::NumFmt == type)
			{
				OOX::Spreadsheet::CNumFmt* pNumFmt = new OOX::Spreadsheet::CNumFmt();
				res = Read2(length, &BinaryStyleTableReader::ReadNumFmt, this, pNumFmt);
				m_oStyles.m_oNumFmts->m_arrItems.Add(pNumFmt);
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		};
		int ReadNumFmt(BYTE type, long length, void* poResult)
		{
			OOX::Spreadsheet::CNumFmt* pNumFmt = static_cast<OOX::Spreadsheet::CNumFmt*>(poResult);
			int res = c_oSerConstants::ReadOk;
			if(c_oSerNumFmtTypes::FormatCode == type)
			{
				CString sFormatCode((wchar_t*)m_oBufferedStream.ReadPointer(length), length / 2);
				pNumFmt->m_oFormatCode.Init();
				pNumFmt->m_oFormatCode->Append(sFormatCode);
			}
			else if(c_oSerNumFmtTypes::NumFmtId == type)
			{
				pNumFmt->m_oNumFmtId.Init();
				pNumFmt->m_oNumFmtId->SetValue(m_oBufferedStream.ReadLong());
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		};
		int ReadCellStyleXfs(BYTE type, long length, void* poResult)
		{
			int res = c_oSerConstants::ReadOk;
			if(c_oSerStylesTypes::Xfs == type)
			{
				OOX::Spreadsheet::CXfs* pXfs = new OOX::Spreadsheet::CXfs();
				res = Read2(length, &BinaryStyleTableReader::ReadXfs, this, pXfs);
				m_oStyles.m_oCellStyleXfs->m_arrItems.Add(pXfs);
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		}
		int ReadCellXfs(BYTE type, long length, void* poResult)
		{
			int res = c_oSerConstants::ReadOk;
			if(c_oSerStylesTypes::Xfs == type)
			{
				OOX::Spreadsheet::CXfs* pXfs = new OOX::Spreadsheet::CXfs();
				res = Read2(length, &BinaryStyleTableReader::ReadXfs, this, pXfs);
				m_oStyles.m_oCellXfs->m_arrItems.Add(pXfs);
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		};
		int ReadXfs(BYTE type, long length, void* poResult)
		{
			OOX::Spreadsheet::CXfs* pXfs = static_cast<OOX::Spreadsheet::CXfs*>(poResult);
			int res = c_oSerConstants::ReadOk;
			if(c_oSerXfsTypes::ApplyAlignment == type)
			{
				pXfs->m_oApplyAlignment.Init();
				pXfs->m_oApplyAlignment->SetValue(false != m_oBufferedStream.ReadBool() ? SimpleTypes::onoffTrue : SimpleTypes::onoffFalse);
			}
			else if(c_oSerXfsTypes::ApplyBorder == type)
			{
				pXfs->m_oApplyBorder.Init();
				pXfs->m_oApplyBorder->SetValue(false != m_oBufferedStream.ReadBool() ? SimpleTypes::onoffTrue : SimpleTypes::onoffFalse);
			}
			else if(c_oSerXfsTypes::ApplyFill == type)
			{
				pXfs->m_oApplyFill.Init();
				pXfs->m_oApplyFill->SetValue(false != m_oBufferedStream.ReadBool() ? SimpleTypes::onoffTrue : SimpleTypes::onoffFalse);
			}
			else if(c_oSerXfsTypes::ApplyFont == type)
			{
				pXfs->m_oApplyFont.Init();
				pXfs->m_oApplyFont->SetValue(false != m_oBufferedStream.ReadBool() ? SimpleTypes::onoffTrue : SimpleTypes::onoffFalse);
			}
			else if(c_oSerXfsTypes::ApplyNumberFormat == type)
			{
				pXfs->m_oApplyNumberFormat.Init();
				pXfs->m_oApplyNumberFormat->SetValue(false != m_oBufferedStream.ReadBool() ? SimpleTypes::onoffTrue : SimpleTypes::onoffFalse);
			}
			else if(c_oSerXfsTypes::BorderId == type)
			{
				pXfs->m_oBorderId.Init();
				pXfs->m_oBorderId->SetValue(m_oBufferedStream.ReadLong());
			}
			else if(c_oSerXfsTypes::FillId == type)
			{
				pXfs->m_oFillId.Init();
				pXfs->m_oFillId->SetValue(m_oBufferedStream.ReadLong());
			}
			else if(c_oSerXfsTypes::FontId == type)
			{
				pXfs->m_oFontId.Init();
				pXfs->m_oFontId->SetValue(m_oBufferedStream.ReadLong());
			}
			else if(c_oSerXfsTypes::NumFmtId == type)
			{
				pXfs->m_oNumFmtId.Init();
				pXfs->m_oNumFmtId->SetValue(m_oBufferedStream.ReadLong());
			}
			else if(c_oSerXfsTypes::QuotePrefix == type)
			{
				pXfs->m_oQuotePrefix.Init();
				pXfs->m_oQuotePrefix->SetValue(false != m_oBufferedStream.ReadBool() ? SimpleTypes::onoffTrue : SimpleTypes::onoffFalse);
			}
			else if(c_oSerXfsTypes::Aligment == type)
			{
				pXfs->m_oAligment.Init();
				res = Read2(length, &BinaryStyleTableReader::ReadAligment, this, pXfs->m_oAligment.GetPointer());
			}
			else if (c_oSerXfsTypes::XfId == type)
			{
				pXfs->m_oXfId.Init();
				pXfs->m_oXfId->SetValue(m_oBufferedStream.ReadLong());
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		};
		int ReadAligment(BYTE type, long length, void* poResult)
		{
			OOX::Spreadsheet::CAligment* pAligment = static_cast<OOX::Spreadsheet::CAligment*>(poResult);
			int res = c_oSerConstants::ReadOk;
			if(c_oSerAligmentTypes::Horizontal == type)
			{
				pAligment->m_oHorizontal.Init();
				pAligment->m_oHorizontal->SetValue((SimpleTypes::Spreadsheet::EHorizontalAlignment)m_oBufferedStream.ReadByte());
			}
			else if(c_oSerAligmentTypes::Indent == type)
			{
				pAligment->m_oIndent.Init();
				pAligment->m_oIndent->SetValue(m_oBufferedStream.ReadLong());
			}
			else if(c_oSerAligmentTypes::RelativeIndent == type)
			{
				pAligment->m_oRelativeIndent.Init();
				pAligment->m_oRelativeIndent->SetValue(m_oBufferedStream.ReadLong());
			}
			else if(c_oSerAligmentTypes::ShrinkToFit == type)
			{
				pAligment->m_oShrinkToFit.Init();
				pAligment->m_oShrinkToFit->SetValue(false != m_oBufferedStream.ReadBool() ? SimpleTypes::onoffTrue : SimpleTypes::onoffFalse);
			}
			else if(c_oSerAligmentTypes::TextRotation == type)
			{
				pAligment->m_oTextRotation.Init();
				pAligment->m_oTextRotation->SetValue(m_oBufferedStream.ReadLong());
			}
			else if(c_oSerAligmentTypes::Vertical == type)
			{
				pAligment->m_oVertical.Init();
				pAligment->m_oVertical->SetValue((SimpleTypes::Spreadsheet::EVerticalAlignment)m_oBufferedStream.ReadByte());
			}
			else if(c_oSerAligmentTypes::WrapText == type)
			{
				pAligment->m_oWrapText.Init();
				pAligment->m_oWrapText->SetValue(false != m_oBufferedStream.ReadBool() ? SimpleTypes::onoffTrue : SimpleTypes::onoffFalse);
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		};
		int ReadDxfs(BYTE type, long length, void* poResult)
		{
			int res = c_oSerConstants::ReadOk;
			OOX::Spreadsheet::CDxfs* pDxfs = static_cast<OOX::Spreadsheet::CDxfs*>(poResult);
			if(c_oSerStylesTypes::Dxf == type)
			{
				OOX::Spreadsheet::CDxf* pDxf = new OOX::Spreadsheet::CDxf();
				res = Read1(length, &BinaryStyleTableReader::ReadDxf, this, pDxf);
				pDxfs->m_arrItems.Add(pDxf);
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		}
		int ReadDxf(BYTE type, long length, void* poResult)
		{
			int res = c_oSerConstants::ReadOk;
			OOX::Spreadsheet::CDxf* pDxf = static_cast<OOX::Spreadsheet::CDxf*>(poResult);
			if(c_oSer_Dxf::Alignment == type)
			{
				pDxf->m_oAlignment.Init();
				res = Read2(length, &BinaryStyleTableReader::ReadAligment, this, pDxf->m_oAlignment.GetPointer());
			}
			else if(c_oSer_Dxf::Border == type)
			{
				pDxf->m_oBorder.Init();
				res = Read1(length, &BinaryStyleTableReader::ReadBorder, this, pDxf->m_oBorder.GetPointer());
			}
			else if(c_oSer_Dxf::Fill == type)
			{
				pDxf->m_oFill.Init();
				res = Read1(length, &BinaryStyleTableReader::ReadFill, this, pDxf->m_oFill.GetPointer());
			}
			else if(c_oSer_Dxf::Font == type)
			{
				pDxf->m_oFont.Init();
				res = Read2(length, &BinaryStyleTableReader::ReadFont, this, pDxf->m_oFont.GetPointer());
			}
			else if(c_oSer_Dxf::NumFmt == type)
			{
				pDxf->m_oNumFmt.Init();
				res = Read2(length, &BinaryStyleTableReader::ReadNumFmt, this, pDxf->m_oNumFmt.GetPointer());
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		}
		int ReadCellStyles(BYTE type, long length, void* poResult)
		{
			int res = c_oSerConstants::ReadOk;
			if(c_oSerStylesTypes::CellStyle == type)
			{
				OOX::Spreadsheet::CCellStyle* pCellStyle = new OOX::Spreadsheet::CCellStyle();
				res = Read1(length, &BinaryStyleTableReader::ReadCellStyle, this, pCellStyle);
				m_oStyles.m_oCellStyles->m_arrItems.Add(pCellStyle);
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		}
		int ReadCellStyle(BYTE type, long length, void* poResult)
		{
			OOX::Spreadsheet::CCellStyle* pCellStyle = static_cast<OOX::Spreadsheet::CCellStyle*>(poResult);
			int res = c_oSerConstants::ReadOk;
			if(c_oSer_CellStyle::BuiltinId == type)
			{
				pCellStyle->m_oBuiltinId.Init();
				pCellStyle->m_oBuiltinId->SetValue(m_oBufferedStream.ReadLong());
			}
			else if(c_oSer_CellStyle::CustomBuiltin == type)
			{
				pCellStyle->m_oCustomBuiltin.Init();
				pCellStyle->m_oCustomBuiltin->SetValue(false != m_oBufferedStream.ReadBool() ? SimpleTypes::onoffTrue : SimpleTypes::onoffFalse);
			}
			else if(c_oSer_CellStyle::Hidden == type)
			{
				pCellStyle->m_oHidden.Init();
				pCellStyle->m_oHidden->SetValue(false != m_oBufferedStream.ReadBool() ? SimpleTypes::onoffTrue : SimpleTypes::onoffFalse);
			}
			else if(c_oSer_CellStyle::ILevel == type)
			{
				pCellStyle->m_oILevel.Init();
				pCellStyle->m_oILevel->SetValue(m_oBufferedStream.ReadLong());
			}
			else if(c_oSer_CellStyle::Name == type)
			{
				pCellStyle->m_oName.Init();
				pCellStyle->m_oName->Append(m_oBufferedStream.ReadString2(length));
			}
			else if(c_oSer_CellStyle::XfId == type)
			{
				pCellStyle->m_oXfId.Init();
				pCellStyle->m_oXfId->SetValue(m_oBufferedStream.ReadLong());
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		}
		int ReadTableStyles(BYTE type, long length, void* poResult)
		{
			int res = c_oSerConstants::ReadOk;
			OOX::Spreadsheet::CTableStyles* pTableStyles = static_cast<OOX::Spreadsheet::CTableStyles*>(poResult);
			if(c_oSer_TableStyles::DefaultTableStyle == type)
			{
				pTableStyles->m_oDefaultTableStyle.Init();
				pTableStyles->m_oDefaultTableStyle->Append(m_oBufferedStream.ReadString2(length));
			}
			else if(c_oSer_TableStyles::DefaultPivotStyle == type)
			{
				pTableStyles->m_oDefaultPivotStyle.Init();
				pTableStyles->m_oDefaultPivotStyle->Append(m_oBufferedStream.ReadString2(length));
			}
			else if(c_oSer_TableStyles::TableStyles == type)
			{
				res = Read1(length, &BinaryStyleTableReader::ReadTableCustomStyles, this, pTableStyles);
				pTableStyles->m_oCount.Init();
				pTableStyles->m_oCount->SetValue(pTableStyles->m_arrItems.GetSize());
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		}
		int ReadTableCustomStyles(BYTE type, long length, void* poResult)
		{
			int res = c_oSerConstants::ReadOk;
			OOX::Spreadsheet::CTableStyles* pTableStyles = static_cast<OOX::Spreadsheet::CTableStyles*>(poResult);
			if(c_oSer_TableStyles::TableStyle == type)
			{
				OOX::Spreadsheet::CTableStyle* pTableStyle = new OOX::Spreadsheet::CTableStyle();
				res = Read1(length, &BinaryStyleTableReader::ReadTableCustomStyle, this, pTableStyle);
				pTableStyles->m_arrItems.Add(pTableStyle);
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		}
		int ReadTableCustomStyle(BYTE type, long length, void* poResult)
		{
			int res = c_oSerConstants::ReadOk;
			OOX::Spreadsheet::CTableStyle* pTableStyle = static_cast<OOX::Spreadsheet::CTableStyle*>(poResult);
			if(c_oSer_TableStyle::Name == type)
			{
				pTableStyle->m_oName.Init();
				pTableStyle->m_oName->Append(m_oBufferedStream.ReadString2(length));
			}
			else if(c_oSer_TableStyle::Pivot == type)
			{
				pTableStyle->m_oPivot.Init();
				pTableStyle->m_oPivot->FromBool(m_oBufferedStream.ReadBool());
			}
			else if(c_oSer_TableStyle::Table == type)
			{
				pTableStyle->m_oTable.Init();
				pTableStyle->m_oTable->FromBool(m_oBufferedStream.ReadBool());
			}
			else if(c_oSer_TableStyle::Elements == type)
			{
				res = Read1(length, &BinaryStyleTableReader::ReadTableCustomStyleElements, this, pTableStyle);
				pTableStyle->m_oCount.Init();
				pTableStyle->m_oCount->SetValue(pTableStyle->m_arrItems.GetSize());
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		}
		int ReadTableCustomStyleElements(BYTE type, long length, void* poResult)
		{
			int res = c_oSerConstants::ReadOk;
			OOX::Spreadsheet::CTableStyle* pTableStyle = static_cast<OOX::Spreadsheet::CTableStyle*>(poResult);
			if(c_oSer_TableStyle::Element == type)
			{
				OOX::Spreadsheet::CTableStyleElement* pTableStyleElement = new OOX::Spreadsheet::CTableStyleElement();
				res = Read2(length, &BinaryStyleTableReader::ReadTableCustomStyleElement, this, pTableStyleElement);
				pTableStyle->m_arrItems.Add(pTableStyleElement);
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		}
		int ReadTableCustomStyleElement(BYTE type, long length, void* poResult)
		{
			int res = c_oSerConstants::ReadOk;
			OOX::Spreadsheet::CTableStyleElement* pTableStyleElement = static_cast<OOX::Spreadsheet::CTableStyleElement*>(poResult);
			if(c_oSer_TableStyleElement::Type == type)
			{
				pTableStyleElement->m_oType.Init();
				pTableStyleElement->m_oType->SetValue((SimpleTypes::Spreadsheet::ETableStyleType)m_oBufferedStream.ReadByte());
			}
			else if(c_oSer_TableStyleElement::Size == type)
			{
				pTableStyleElement->m_oSize.Init();
				pTableStyleElement->m_oSize->SetValue(m_oBufferedStream.ReadLong());
			}
			else if(c_oSer_TableStyleElement::DxfId == type)
			{
				pTableStyleElement->m_oDxfId.Init();
				pTableStyleElement->m_oDxfId->SetValue(m_oBufferedStream.ReadLong());
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		}
	};
	class BinaryWorkbookTableReader : public Binary_CommonReader<BinaryWorkbookTableReader>
	{
		OOX::Spreadsheet::CWorkbook& m_oWorkbook;
	public:
		BinaryWorkbookTableReader(Streams::CBufferedStream& oBufferedStream, OOX::Spreadsheet::CWorkbook& oWorkbook):Binary_CommonReader(oBufferedStream), m_oWorkbook(oWorkbook)
		{
		}
		int Read()
		{
			return ReadTable(&BinaryWorkbookTableReader::ReadWorkbookTableContent, this);
		};
		int ReadWorkbookTableContent(BYTE type, long length, void* poResult)
		{
			int res = c_oSerConstants::ReadOk;
			if(c_oSerWorkbookTypes::WorkbookPr == type)
			{
				m_oWorkbook.m_oWorkbookPr.Init();
				res = Read2(length, &BinaryWorkbookTableReader::ReadWorkbookPr, this, poResult);
			}
			else if(c_oSerWorkbookTypes::BookViews == type)
			{
				m_oWorkbook.m_oBookViews.Init();
				res = Read1(length, &BinaryWorkbookTableReader::ReadBookViews, this, poResult);
			}
			else if(c_oSerWorkbookTypes::DefinedNames == type)
			{
				m_oWorkbook.m_oDefinedNames.Init();
				res = Read1(length, &BinaryWorkbookTableReader::ReadDefinedNames, this, poResult);
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		};
		int ReadWorkbookPr(BYTE type, long length, void* poResult)
		{
			int res = c_oSerConstants::ReadOk;
			if(c_oSerWorkbookPrTypes::Date1904 == type)
			{
				m_oWorkbook.m_oWorkbookPr->m_oDate1904.Init();
				m_oWorkbook.m_oWorkbookPr->m_oDate1904->SetValue(false != m_oBufferedStream.ReadBool() ? SimpleTypes::onoffTrue : SimpleTypes::onoffFalse);
			}
			else if(c_oSerWorkbookPrTypes::DateCompatibility == type)
			{
				m_oWorkbook.m_oWorkbookPr->m_oDateCompatibility.Init();
				m_oWorkbook.m_oWorkbookPr->m_oDateCompatibility->SetValue(false != m_oBufferedStream.ReadBool() ? SimpleTypes::onoffTrue : SimpleTypes::onoffFalse);
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		};
		int ReadBookViews(BYTE type, long length, void* poResult)
		{
			int res = c_oSerConstants::ReadOk;
			if(c_oSerWorkbookTypes::WorkbookView == type)
			{
				OOX::Spreadsheet::CWorkbookView* pWorkbookView = new OOX::Spreadsheet::CWorkbookView();
				res = Read2(length, &BinaryWorkbookTableReader::ReadWorkbookView, this, pWorkbookView);
				m_oWorkbook.m_oBookViews->m_arrItems.Add(pWorkbookView);
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		};
		int ReadWorkbookView(BYTE type, long length, void* poResult)
		{
			OOX::Spreadsheet::CWorkbookView* pWorkbookView = static_cast<OOX::Spreadsheet::CWorkbookView*>(poResult);
			int res = c_oSerConstants::ReadOk;
			if(c_oSerWorkbookViewTypes::ActiveTab == type)
			{
				pWorkbookView->m_oActiveTab.Init();
				pWorkbookView->m_oActiveTab->SetValue(m_oBufferedStream.ReadLong());
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		};
		int ReadDefinedNames(BYTE type, long length, void* poResult)
		{
			int res = c_oSerConstants::ReadOk;
			if(c_oSerWorkbookTypes::DefinedName == type)
			{
				OOX::Spreadsheet::CDefinedName* pDefinedName = new OOX::Spreadsheet::CDefinedName();
				res = Read1(length, &BinaryWorkbookTableReader::ReadDefinedName, this, pDefinedName);
				m_oWorkbook.m_oDefinedNames->m_arrItems.Add(pDefinedName);
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		};
		int ReadDefinedName(BYTE type, long length, void* poResult)
		{
			OOX::Spreadsheet::CDefinedName* pDefinedName = static_cast<OOX::Spreadsheet::CDefinedName*>(poResult);
			int res = c_oSerConstants::ReadOk;
			if(c_oSerDefinedNameTypes::Name == type)
			{
				CString sName((wchar_t*)m_oBufferedStream.ReadPointer(length), length / 2);
				pDefinedName->m_oName.Init();
				pDefinedName->m_oName->Append(sName);
			}
			else if(c_oSerDefinedNameTypes::Ref == type)
			{
				CString sRef((wchar_t*)m_oBufferedStream.ReadPointer(length), length / 2);
				pDefinedName->m_oRef.Init();
				pDefinedName->m_oRef->Append(sRef);
			}
			else if(c_oSerDefinedNameTypes::LocalSheetId == type)
			{
				pDefinedName->m_oLocalSheetId.Init();
				pDefinedName->m_oLocalSheetId->SetValue(m_oBufferedStream.ReadLong());
			}
			return res;
		};
	};
	class BinaryCommentReader : public Binary_CommonReader<BinaryCommentReader>
	{
		OOX::Spreadsheet::CWorksheet* m_pCurWorksheet;
	public:
		BinaryCommentReader(Streams::CBufferedStream& oBufferedStream, OOX::Spreadsheet::CWorksheet* pCurWorksheet):Binary_CommonReader(oBufferedStream),m_pCurWorksheet(pCurWorksheet)
		{
		}
		int Read(long length, void* poResult)
		{
			return Read1(length, &BinaryCommentReader::ReadComments, this, poResult);
		}
		int ReadCommentDataExternal(long length, void* poResult)
		{
			return Read1(length, &BinaryCommentReader::ReadCommentData, this, poResult);
		}
		int ReadComments(BYTE type, long length, void* poResult)
		{
			int res = c_oSerConstants::ReadOk;
			if(c_oSerWorksheetsTypes::Comment == type)
			{
				OOX::Spreadsheet::CCommentItem* pNewComment = new OOX::Spreadsheet::CCommentItem();
				res = Read2(length, &BinaryCommentReader::ReadComment, this, pNewComment);

				if(NULL != m_pCurWorksheet && pNewComment->IsValid())
				{
					CString sId;sId.Format(_T("%d-%d"), pNewComment->m_nRow.get(), pNewComment->m_nCol.get());
					m_pCurWorksheet->m_mapComments.SetAt(sId, pNewComment);
				}
				else
					RELEASEOBJECT(pNewComment);
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		};
		int ReadComment(BYTE type, long length, void* poResult)
		{
			int res = c_oSerConstants::ReadOk;
			OOX::Spreadsheet::CCommentItem* pNewComment = static_cast<OOX::Spreadsheet::CCommentItem*>(poResult);
			if ( c_oSer_Comments::Row == type )
				pNewComment->m_nRow = m_oBufferedStream.ReadLong();
			else if ( c_oSer_Comments::Col == type )
				pNewComment->m_nCol = m_oBufferedStream.ReadLong();
			else if ( c_oSer_Comments::CommentDatas == type )
				res = Read1(length, &BinaryCommentReader::ReadCommentDatas, this, pNewComment);
			else if ( c_oSer_Comments::Left == type )
				pNewComment->m_nLeft = m_oBufferedStream.ReadLong();
			else if ( c_oSer_Comments::Top == type )
				pNewComment->m_nTop = m_oBufferedStream.ReadLong();
			else if ( c_oSer_Comments::Right == type )
				pNewComment->m_nRight = m_oBufferedStream.ReadLong();
			else if ( c_oSer_Comments::Bottom == type )
				pNewComment->m_nBottom = m_oBufferedStream.ReadLong();
			else if ( c_oSer_Comments::LeftOffset == type )
				pNewComment->m_nLeftOffset = m_oBufferedStream.ReadLong();
			else if ( c_oSer_Comments::TopOffset == type )
				pNewComment->m_nTopOffset = m_oBufferedStream.ReadLong();
			else if ( c_oSer_Comments::RightOffset == type )
				pNewComment->m_nRightOffset = m_oBufferedStream.ReadLong();
			else if ( c_oSer_Comments::BottomOffset == type )
				pNewComment->m_nBottomOffset = m_oBufferedStream.ReadLong();
			else if ( c_oSer_Comments::LeftMM == type )
				pNewComment->m_dLeftMM = m_oBufferedStream.ReadDouble();
			else if ( c_oSer_Comments::TopMM == type )
				pNewComment->m_dTopMM = m_oBufferedStream.ReadDouble();
			else if ( c_oSer_Comments::WidthMM == type )
				pNewComment->m_dWidthMM = m_oBufferedStream.ReadDouble();
			else if ( c_oSer_Comments::HeightMM == type )
				pNewComment->m_dHeightMM = m_oBufferedStream.ReadDouble();
			else if ( c_oSer_Comments::MoveWithCells == type )
				pNewComment->m_bMove = m_oBufferedStream.ReadBool();
			else if ( c_oSer_Comments::SizeWithCells == type )
				pNewComment->m_bSize = m_oBufferedStream.ReadBool();
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		};
		int ReadCommentDatas(BYTE type, long length, void* poResult)
		{
			int res = c_oSerConstants::ReadOk;
			OOX::Spreadsheet::CCommentItem* pNewComment = static_cast<OOX::Spreadsheet::CCommentItem*>(poResult);
			if ( c_oSer_Comments::CommentData == type )
			{
				if(!pNewComment->m_sGfxdata.IsInit())
				{
					int nStartPos = m_oBufferedStream.GetPosition();
					BYTE* pSourceBuffer = m_oBufferedStream.ReadPointer(length);
					m_oBufferedStream.Seek(nStartPos);
					
					CStringA sSignature(_T("XLST"));
					int nSignatureSize = sSignature.GetLength();
					int nDataLengthSize = sizeof(long);
					int nJunkSize = 2;
					int nWriteBufferLength = nSignatureSize + nDataLengthSize + length + nJunkSize;
					BYTE* pWriteBuffer = new BYTE[nWriteBufferLength];
					memcpy(pWriteBuffer, sSignature.GetBuffer(), nSignatureSize);
					sSignature.ReleaseBuffer();
					memcpy(pWriteBuffer + nSignatureSize, &length, nDataLengthSize);
					memcpy(pWriteBuffer + nSignatureSize + nDataLengthSize, pSourceBuffer, length);
					
					memset(pWriteBuffer + nSignatureSize + nDataLengthSize + length, 0, nJunkSize);

					int nBase64BufferLen = Base64::Base64EncodeGetRequiredLength(nWriteBufferLength, Base64::B64_BASE64_FLAG_NONE);
					BYTE* pbBase64Buffer = new BYTE[nBase64BufferLen];
					CString sGfxdata;
					if(TRUE == Base64::Base64Encode(pWriteBuffer, nWriteBufferLength, (LPSTR)pbBase64Buffer, &nBase64BufferLen, Base64::B64_BASE64_FLAG_NONE))
					{
						sGfxdata = CString((LPSTR)pbBase64Buffer, nBase64BufferLen);
						
						sGfxdata.Append(_T("\r\n"));
					}
					RELEASEARRAYOBJECTS(pbBase64Buffer);
					RELEASEARRAYOBJECTS(pWriteBuffer);

					if(!sGfxdata.IsEmpty())
					{
						pNewComment->m_sGfxdata.Init();
						pNewComment->m_sGfxdata->Append(sGfxdata);
					}
				}
				if(!pNewComment->m_oText.IsInit())
				{
					SerializeCommon::CommentData oCommentData;
					res = Read1(length, &BinaryCommentReader::ReadCommentData, this, &oCommentData);
					pNewComment->m_sAuthor = oCommentData.sUserName;
					pNewComment->m_oText.Init();
					parseCommentData(&oCommentData, pNewComment->m_oText.get2());
				}
				else
					res = c_oSerConstants::ReadUnknown;
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		}
		int ReadCommentData(BYTE type, long length, void* poResult)
		{
			int res = c_oSerConstants::ReadOk;
			SerializeCommon::CommentData* pComments = static_cast<SerializeCommon::CommentData*>(poResult);
			if ( c_oSer_CommentData::Text == type )
				pComments->sText = CString((wchar_t*)m_oBufferedStream.ReadPointer(length), length / 2);
			else if ( c_oSer_CommentData::Time == type )
				pComments->sTime = CString((wchar_t*)m_oBufferedStream.ReadPointer(length), length / 2);
			else if ( c_oSer_CommentData::UserId == type )
				pComments->sUserId = CString((wchar_t*)m_oBufferedStream.ReadPointer(length), length / 2);
			else if ( c_oSer_CommentData::UserName == type )
				pComments->sUserName = CString((wchar_t*)m_oBufferedStream.ReadPointer(length), length / 2);
			else if ( c_oSer_CommentData::QuoteText == type )
				pComments->sQuoteText = CString((wchar_t*)m_oBufferedStream.ReadPointer(length), length / 2);
			else if ( c_oSer_CommentData::Solved == type )
			{
				pComments->bSolved = true;
				pComments->Solved = m_oBufferedStream.ReadBool();
			}
			else if ( c_oSer_CommentData::Document == type )
			{
				pComments->bDocument = true;
				pComments->Document = m_oBufferedStream.ReadBool();
			}
			else if ( c_oSer_CommentData::Replies == type )
				res = Read1(length, &BinaryCommentReader::ReadCommentReplies, this, &pComments->aReplies);
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		}
		int ReadCommentReplies(BYTE type, long length, void* poResult)
		{
			int res = c_oSerConstants::ReadOk;
			CAtlArray<SerializeCommon::CommentData*>* pComments = static_cast<CAtlArray<SerializeCommon::CommentData*>*>(poResult);
			if ( c_oSer_CommentData::Reply == type )
			{
				SerializeCommon::CommentData* pCommentData = new SerializeCommon::CommentData();
				res = Read1(length, &BinaryCommentReader::ReadCommentData, this, pCommentData);
				pComments->Add(pCommentData);
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		}
		void parseCommentData(SerializeCommon::CommentData* pCommentData, OOX::Spreadsheet::CSi& oSi)
		{
			if(NULL != pCommentData && false == pCommentData->sText.IsEmpty())
			{
				OOX::Spreadsheet::CRun* pRun = new OOX::Spreadsheet::CRun();
				pRun->m_oRPr.Init();
				OOX::Spreadsheet::CRPr& pRPr = pRun->m_oRPr.get2();
				pRPr.m_oRFont.Init();
				pRPr.m_oRFont->m_sVal.Init();
				pRPr.m_oRFont->m_sVal->Append(_T("Tahoma"));
				pRPr.m_oSz.Init();
				pRPr.m_oSz->m_oVal.Init();
				pRPr.m_oSz->m_oVal->SetValue(8);

				OOX::Spreadsheet::CText* pText = new OOX::Spreadsheet::CText();
				pText->m_sText.Append(pCommentData->sText);

				pRun->m_arrItems.Add(pText);
				oSi.m_arrItems.Add(pRun);
			}
		}
	};
	class BinaryWorksheetsTableReader : public Binary_CommonReader<BinaryWorksheetsTableReader>
	{
		Binary_CommonReader2 m_oBcr2;
		OOX::Spreadsheet::CWorkbook& m_oWorkbook;
		OOX::Spreadsheet::CSharedStrings* m_pSharedStrings;
		CAtlMap<CString, OOX::Spreadsheet::CWorksheet*>&  m_mapWorksheets;
		CAtlMap<long, ImageObject*>& m_mapMedia;
		OOX::Spreadsheet::CSheet* m_pCurSheet;
		OOX::Spreadsheet::CWorksheet* m_pCurWorksheet;
		OOX::Spreadsheet::CDrawing* m_pCurDrawing;

		CString& m_sDestinationDir;
		CString m_sMediaDir;
		LPSAFEARRAY m_pArray;
		PPTXFile::IAVSOfficeDrawingConverter* m_pOfficeDrawingConverter;
	public:
		BinaryWorksheetsTableReader(Streams::CBufferedStream& oBufferedStream, OOX::Spreadsheet::CWorkbook& oWorkbook,
			OOX::Spreadsheet::CSharedStrings* pSharedStrings, CAtlMap<CString, OOX::Spreadsheet::CWorksheet*>& mapWorksheets,
			CAtlMap<long, ImageObject*>& mapMedia, CString& sDestinationDir, LPSAFEARRAY pArray,
			PPTXFile::IAVSOfficeDrawingConverter* pOfficeDrawingConverter) : Binary_CommonReader(oBufferedStream), m_oWorkbook(oWorkbook),
			m_oBcr2(oBufferedStream), m_mapWorksheets(mapWorksheets), m_mapMedia(mapMedia), m_sDestinationDir(sDestinationDir), m_sMediaDir(m_sDestinationDir + _T("\\xl\\media")), m_pSharedStrings(pSharedStrings)
		{
			m_pCurSheet = NULL;
			m_pCurWorksheet = NULL;
			m_pCurDrawing = NULL;
			m_pArray = pArray;
			m_pOfficeDrawingConverter = pOfficeDrawingConverter;
		}
		int Read()
		{
			m_oWorkbook.m_oSheets.Init();
			return ReadTable(&BinaryWorksheetsTableReader::ReadWorksheetsTableContent, this);
		};
		int ReadWorksheetsTableContent(BYTE type, long length, void* poResult)
		{
			int res = c_oSerConstants::ReadOk;
			if(c_oSerWorksheetsTypes::Worksheet == type)
			{
				m_pCurSheet = new OOX::Spreadsheet::CSheet();
				m_pCurWorksheet = new OOX::Spreadsheet::CWorksheet();
				res = Read1(length, &BinaryWorksheetsTableReader::ReadWorksheet, this, poResult);
				if(m_pCurSheet->m_oName.IsInit())
				{
					m_mapWorksheets.SetAt(m_pCurSheet->m_oName.get(), m_pCurWorksheet);
					m_oWorkbook.m_oSheets->m_arrItems.Add(m_pCurSheet);
				}
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		};
		int ReadWorksheet(BYTE type, long length, void* poResult)
		{
			int res = c_oSerConstants::ReadOk;
			if(c_oSerWorksheetsTypes::WorksheetProp == type)
			{
				res = Read2(length, &BinaryWorksheetsTableReader::ReadWorksheetProp, this, poResult);
				const OOX::RId& oRId = m_oWorkbook.Add(smart_ptr<OOX::File>(m_pCurWorksheet));
				m_pCurSheet->m_oRid.Init();
				m_pCurSheet->m_oRid->SetValue(oRId.get());
			}
			else if(c_oSerWorksheetsTypes::Cols == type)
			{
				m_pCurWorksheet->m_oCols.Init();
				res = Read1(length, &BinaryWorksheetsTableReader::ReadWorksheetCols, this, poResult);
			}
			else if (c_oSerWorksheetsTypes::SheetViews == type)
			{
				m_pCurWorksheet->m_oSheetViews.Init();
				res = Read1(length, &BinaryWorksheetsTableReader::ReadSheetViews, this, poResult);
			}
			else if (c_oSerWorksheetsTypes::SheetPr == type)
			{
				m_pCurWorksheet->m_oSheetPr.Init();
				res = Read1(length, &BinaryWorksheetsTableReader::ReadSheetPr, this, m_pCurWorksheet->m_oSheetPr.GetPointer());
			}
			else if(c_oSerWorksheetsTypes::SheetFormatPr == type)
			{
				m_pCurWorksheet->m_oSheetFormatPr.Init();
				res = Read2(length, &BinaryWorksheetsTableReader::ReadSheetFormatPr, this, m_pCurWorksheet->m_oSheetFormatPr.GetPointer());
			}
			else if(c_oSerWorksheetsTypes::PageMargins == type)
			{
				m_pCurWorksheet->m_oPageMargins.Init();
				res = Read2(length, &BinaryWorksheetsTableReader::ReadPageMargins, this, m_pCurWorksheet->m_oPageMargins.GetPointer());
			}
			else if(c_oSerWorksheetsTypes::PageSetup == type)
			{
				m_pCurWorksheet->m_oPageSetup.Init();
				res = Read2(length, &BinaryWorksheetsTableReader::ReadPageSetup, this, m_pCurWorksheet->m_oPageSetup.GetPointer());
			}
			else if(c_oSerWorksheetsTypes::PrintOptions == type)
			{
				m_pCurWorksheet->m_oPrintOptions.Init();
				res = Read2(length, &BinaryWorksheetsTableReader::ReadPrintOptions, this, m_pCurWorksheet->m_oPrintOptions.GetPointer());
			}
			else if(c_oSerWorksheetsTypes::Hyperlinks == type)
			{
				m_pCurWorksheet->m_oHyperlinks.Init();
				res = Read1(length, &BinaryWorksheetsTableReader::ReadHyperlinks, this, poResult);
			}
			else if(c_oSerWorksheetsTypes::MergeCells == type)
			{
				m_pCurWorksheet->m_oMergeCells.Init();
				res = Read1(length, &BinaryWorksheetsTableReader::ReadMergeCells, this, poResult);
				m_pCurWorksheet->m_oMergeCells->m_oCount.Init();
				m_pCurWorksheet->m_oMergeCells->m_oCount->SetValue(m_pCurWorksheet->m_oMergeCells->m_arrItems.GetSize());
			}
			else if(c_oSerWorksheetsTypes::Drawings == type)
			{
				CString sRelsDir;
				sRelsDir.Format(_T("%s\\xl\\drawings\\_rels"), m_sDestinationDir);
				DWORD dwFileAttr = ::GetFileAttributes( sRelsDir );
				if( dwFileAttr == INVALID_FILE_ATTRIBUTES )
					OOX::CSystemUtility::CreateDirectories(sRelsDir);
				CString sMediaDir;
				sMediaDir.Format(_T("%s\\xl\\media"), m_sDestinationDir);
				dwFileAttr = ::GetFileAttributes( sMediaDir );
				if( dwFileAttr == INVALID_FILE_ATTRIBUTES )
					OOX::CSystemUtility::CreateDirectories(sMediaDir);

				m_pOfficeDrawingConverter->SetDstContentRels();
				m_pCurDrawing = new OOX::Spreadsheet::CDrawing();
				res = Read1(length, &BinaryWorksheetsTableReader::ReadDrawings, this, m_pCurDrawing);
				NSCommon::smart_ptr<OOX::File> pDrawingFile(m_pCurDrawing);
				const OOX::RId oRId = m_pCurWorksheet->Add(pDrawingFile);
				m_pCurWorksheet->m_oDrawing.Init();
				m_pCurWorksheet->m_oDrawing->m_oId.Init();
				m_pCurWorksheet->m_oDrawing->m_oId->SetValue(oRId.get());

				CString sFilename = m_pCurDrawing->m_sFilename;
				CString sRelsPath;
				sRelsPath.Format(_T("%s\\%s.rels"), sRelsDir, sFilename);
				BSTR bstrRelsPath = sRelsPath.AllocSysString();
				m_pOfficeDrawingConverter->SaveDstContentRels(bstrRelsPath);
				SysFreeString(bstrRelsPath);
			}
			else if(c_oSerWorksheetsTypes::SheetData == type)
			{
				m_pCurWorksheet->m_oSheetData.Init();
				res = Read1(length, &BinaryWorksheetsTableReader::ReadSheetData, this, poResult);
			}
			else if (c_oSerWorksheetsTypes::ConditionalFormatting == type)
			{
				
			}
			else if(c_oSerWorksheetsTypes::Comments == type)
			{
				BinaryCommentReader oBinaryCommentReader(m_oBufferedStream, m_pCurWorksheet);
				oBinaryCommentReader.Read(length, poResult);
				if(m_pCurWorksheet->m_mapComments.GetCount() > 0)
				{
					OOX::Spreadsheet::CLegacyDrawing* pLegacyDrawing = new OOX::Spreadsheet::CLegacyDrawing();
					pLegacyDrawing->m_mapComments = &m_pCurWorksheet->m_mapComments;
					NSCommon::smart_ptr<OOX::File> pLegacyDrawingFile(pLegacyDrawing);
					const OOX::RId oRId = m_pCurWorksheet->Add(pLegacyDrawingFile);
					m_pCurWorksheet->m_oLegacyDrawingWorksheet.Init();
					m_pCurWorksheet->m_oLegacyDrawingWorksheet->m_oId.Init();
					m_pCurWorksheet->m_oLegacyDrawingWorksheet->m_oId->SetValue(oRId.get());

					CAtlMap<CString, unsigned int> mapAuthors;
					OOX::Spreadsheet::CComments* pComments = new OOX::Spreadsheet::CComments();
					pComments->m_oCommentList.Init();
					CSimpleArray<OOX::Spreadsheet::CComment*>& aComments = pComments->m_oCommentList->m_arrItems;
					pComments->m_oAuthors.Init();
					CSimpleArray<CString*>& aAuthors = pComments->m_oAuthors->m_arrItems;

					POSITION pos = m_pCurWorksheet->m_mapComments.GetStartPosition();
					while ( NULL != pos )
					{
						CAtlMap<CString, OOX::Spreadsheet::CCommentItem*>::CPair* pPair = m_pCurWorksheet->m_mapComments.GetNext( pos );
						if(pPair->m_value->IsValid())
						{
							OOX::Spreadsheet::CCommentItem* pCommentItem = pPair->m_value;
							OOX::Spreadsheet::CComment* pNewComment = new OOX::Spreadsheet::CComment();
							if(pCommentItem->m_nRow.IsInit() && pCommentItem->m_nCol.IsInit())
							{
								pNewComment->m_oRef.Init();
								pNewComment->m_oRef->SetValue(OOX::Spreadsheet::CWorksheet::combineRef(pCommentItem->m_nRow.get(), pCommentItem->m_nCol.get()));
							}

							if(pCommentItem->m_sAuthor.IsInit())
							{
								const CString& sAuthor = pCommentItem->m_sAuthor.get();
								CAtlMap<CString, unsigned int>::CPair* pair = mapAuthors.Lookup(sAuthor);
								unsigned int nAuthorId;
								if(NULL != pair)
									nAuthorId = pair->m_value;
								else
								{
									nAuthorId = mapAuthors.GetCount();
									mapAuthors.SetAt(sAuthor, nAuthorId);
									aAuthors.Add(new CString(sAuthor));
								}
								pNewComment->m_oAuthorId.Init();
								pNewComment->m_oAuthorId->SetValue(nAuthorId);
							}

							OOX::Spreadsheet::CSi* pSi = pCommentItem->m_oText.GetPointerEmptyNullable();
							if(NULL != pSi)
								pNewComment->m_oText.reset(pSi);
							aComments.Add(pNewComment);
						}
					}

					NSCommon::smart_ptr<OOX::File> pCommentsFile(pComments);
					m_pCurWorksheet->Add(pCommentsFile);
				}
			}
			else if(c_oSerWorksheetsTypes::Autofilter == type)
			{
				BinaryTableReader oBinaryTableReader(m_oBufferedStream);
				m_pCurWorksheet->m_oAutofilter.Init();
				res = oBinaryTableReader.Read1(length, &BinaryTableReader::ReadAutoFilter, &oBinaryTableReader, m_pCurWorksheet->m_oAutofilter.GetPointer());
			}
			else if(c_oSerWorksheetsTypes::TableParts == type)
			{
				BinaryTableReader oBinaryTableReader(m_oBufferedStream);
				m_pCurWorksheet->m_oTableParts.Init();
				oBinaryTableReader.Read(length, m_pCurWorksheet);
				m_pCurWorksheet->m_oTableParts->m_oCount.Init();
				m_pCurWorksheet->m_oTableParts->m_oCount->SetValue(m_pCurWorksheet->m_oTableParts->m_arrItems.GetSize());
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		};
		int ReadWorksheetProp(BYTE type, long length, void* poResult)
		{
			int res = c_oSerConstants::ReadOk;
			if(c_oSerWorksheetPropTypes::Name == type)
			{
				CString sName((wchar_t*)m_oBufferedStream.ReadPointer(length), length / 2);
				m_pCurSheet->m_oName.Init();
				m_pCurSheet->m_oName->Append(sName);
			}
			else if(c_oSerWorksheetPropTypes::SheetId == type)
			{
				m_pCurSheet->m_oSheetId.Init();
				m_pCurSheet->m_oSheetId->SetValue(m_oBufferedStream.ReadLong());
			}
			else if(c_oSerWorksheetPropTypes::State == type)
			{
				m_pCurSheet->m_oState.Init();
				m_pCurSheet->m_oState->SetValue((SimpleTypes::Spreadsheet::EVisibleType)m_oBufferedStream.ReadByte());
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		};
		int ReadWorksheetCols(BYTE type, long length, void* poResult)
		{
			int res = c_oSerConstants::ReadOk;
			if(c_oSerWorksheetsTypes::Col == type)
			{
				OOX::Spreadsheet::CCol* pCol = new OOX::Spreadsheet::CCol();
				res = Read2(length, &BinaryWorksheetsTableReader::ReadWorksheetCol, this, pCol);
				m_pCurWorksheet->m_oCols->m_arrItems.Add(pCol);
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		};
		int ReadWorksheetCol(BYTE type, long length, void* poResult)
		{
			OOX::Spreadsheet::CCol* pCol = static_cast<OOX::Spreadsheet::CCol*>(poResult);
			int res = c_oSerConstants::ReadOk;
			if(c_oSerWorksheetColTypes::BestFit == type)
			{
				pCol->m_oBestFit.Init();
				pCol->m_oBestFit->SetValue(false != m_oBufferedStream.ReadBool() ? SimpleTypes::onoffTrue : SimpleTypes::onoffFalse);
			}
			else if(c_oSerWorksheetColTypes::Hidden == type)
			{
				pCol->m_oHidden.Init();
				pCol->m_oHidden->SetValue(false != m_oBufferedStream.ReadBool() ? SimpleTypes::onoffTrue : SimpleTypes::onoffFalse);
			}
			else if(c_oSerWorksheetColTypes::Max == type)
			{
				pCol->m_oMax.Init();
				pCol->m_oMax->SetValue(m_oBufferedStream.ReadLong());
			}
			else if(c_oSerWorksheetColTypes::Min == type)
			{
				pCol->m_oMin.Init();
				pCol->m_oMin->SetValue(m_oBufferedStream.ReadLong());
			}
			else if(c_oSerWorksheetColTypes::Style == type)
			{
				pCol->m_oStyle.Init();
				pCol->m_oStyle->SetValue(m_oBufferedStream.ReadLong());
			}
			else if(c_oSerWorksheetColTypes::Width == type)
			{
				pCol->m_oWidth.Init();
				pCol->m_oWidth->SetValue(m_oBufferedStream.ReadDouble());
				if(g_nFormatVersion < 2)
				{
					pCol->m_oCustomWidth.Init();
					pCol->m_oCustomWidth->SetValue(SimpleTypes::onoffTrue);
				}
			}
			else if(c_oSerWorksheetColTypes::CustomWidth == type)
			{
				pCol->m_oCustomWidth.Init();
				pCol->m_oCustomWidth->SetValue(false != m_oBufferedStream.ReadBool() ? SimpleTypes::onoffTrue : SimpleTypes::onoffFalse);
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		};
		int ReadSheetViews(BYTE type, long length, void* poResult)
		{
			int res = c_oSerConstants::ReadOk;
			if(c_oSerWorksheetsTypes::SheetView == type)
			{
				OOX::Spreadsheet::CSheetView* pSheetView = new OOX::Spreadsheet::CSheetView();
				res = Read1(length, &BinaryWorksheetsTableReader::ReadSheetView, this, pSheetView);
				m_pCurWorksheet->m_oSheetViews->m_arrItems.Add(pSheetView);
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		}
		int ReadSheetView(BYTE type, long length, void* poResult)
		{
			OOX::Spreadsheet::CSheetView* pSheetView = static_cast<OOX::Spreadsheet::CSheetView*>(poResult);
			int res = c_oSerConstants::ReadOk;
			if(c_oSer_SheetView::ShowGridLines == type)
			{
				pSheetView->m_oShowGridLines.Init();
				pSheetView->m_oShowGridLines->SetValue(false != m_oBufferedStream.ReadBool() ? SimpleTypes::onoffTrue : SimpleTypes::onoffFalse);
			}
			else if(c_oSer_SheetView::ShowRowColHeaders == type)
			{
				pSheetView->m_oShowRowColHeaders.Init();
				pSheetView->m_oShowRowColHeaders->SetValue(false != m_oBufferedStream.ReadBool() ? SimpleTypes::onoffTrue : SimpleTypes::onoffFalse);
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		}
		int ReadSheetPr(BYTE type, long length, void* poResult)
		{
			OOX::Spreadsheet::CSheetPr* pSheetPr = static_cast<OOX::Spreadsheet::CSheetPr*>(poResult);
			int res = c_oSerConstants::ReadOk;
			if(c_oSer_SheetPr::CodeName == type)
			{
				pSheetPr->m_oCodeName.Init();
				pSheetPr->m_oCodeName->Append(m_oBufferedStream.ReadString2(length));
			}
			else if(c_oSer_SheetPr::EnableFormatConditionsCalculation == type)
			{
				pSheetPr->m_oEnableFormatConditionsCalculation.Init();
				pSheetPr->m_oEnableFormatConditionsCalculation->SetValue(false != m_oBufferedStream.ReadBool() ? SimpleTypes::onoffTrue : SimpleTypes::onoffFalse);
			}
			else if(c_oSer_SheetPr::FilterMode == type)
			{
				pSheetPr->m_oFilterMode.Init();
				pSheetPr->m_oFilterMode->SetValue(false != m_oBufferedStream.ReadBool() ? SimpleTypes::onoffTrue : SimpleTypes::onoffFalse);
			}
			else if(c_oSer_SheetPr::Published == type)
			{
				pSheetPr->m_oPublished.Init();
				pSheetPr->m_oPublished->SetValue(false != m_oBufferedStream.ReadBool() ? SimpleTypes::onoffTrue : SimpleTypes::onoffFalse);
			}
			else if(c_oSer_SheetPr::SyncHorizontal == type)
			{
				pSheetPr->m_oSyncHorizontal.Init();
				pSheetPr->m_oSyncHorizontal->SetValue(false != m_oBufferedStream.ReadBool() ? SimpleTypes::onoffTrue : SimpleTypes::onoffFalse);
			}
			else if(c_oSer_SheetPr::SyncRef == type)
			{
				pSheetPr->m_oSyncRef.Init();
				pSheetPr->m_oSyncRef->Append(m_oBufferedStream.ReadString2(length));
			}
			else if(c_oSer_SheetPr::SyncVertical == type)
			{
				pSheetPr->m_oSyncVertical.Init();
				pSheetPr->m_oSyncVertical->SetValue(false != m_oBufferedStream.ReadBool() ? SimpleTypes::onoffTrue : SimpleTypes::onoffFalse);
			}
			else if(c_oSer_SheetPr::TransitionEntry == type)
			{
				pSheetPr->m_oTransitionEntry.Init();
				pSheetPr->m_oTransitionEntry->SetValue(false != m_oBufferedStream.ReadBool() ? SimpleTypes::onoffTrue : SimpleTypes::onoffFalse);
			}
			else if(c_oSer_SheetPr::TransitionEvaluation == type)
			{
				pSheetPr->m_oTransitionEvaluation.Init();
				pSheetPr->m_oTransitionEvaluation->SetValue(false != m_oBufferedStream.ReadBool() ? SimpleTypes::onoffTrue : SimpleTypes::onoffFalse);
			}
			else if(c_oSer_SheetPr::TabColor == type)
			{
				pSheetPr->m_oTabColor.Init();
				res = Read2(length, &BinaryWorksheetsTableReader::ReadColor, this, pSheetPr->m_oTabColor.GetPointer());
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		}
		int ReadColor(BYTE type, long length, void* poResult)
		{
			return m_oBcr2.ReadColor(type, length, poResult);
		}
		int ReadSheetFormatPr(BYTE type, long length, void* poResult)
		{
			OOX::Spreadsheet::CSheetFormatPr* pSheetFormatPr = static_cast<OOX::Spreadsheet::CSheetFormatPr*>(poResult);
			int res = c_oSerConstants::ReadOk;
			if(c_oSerSheetFormatPrTypes::DefaultColWidth == type)
			{
				pSheetFormatPr->m_oDefaultColWidth.Init();
				pSheetFormatPr->m_oDefaultColWidth->SetValue(m_oBufferedStream.ReadDouble());
			}
			else if(c_oSerSheetFormatPrTypes::DefaultRowHeight == type)
			{
				pSheetFormatPr->m_oDefaultRowHeight.Init();
				pSheetFormatPr->m_oDefaultRowHeight->SetValue(m_oBufferedStream.ReadDouble());
			}
			else if (c_oSerSheetFormatPrTypes::BaseColWidth == type)
			{
				pSheetFormatPr->m_oBaseColWidth.Init();
				pSheetFormatPr->m_oBaseColWidth->SetValue(m_oBufferedStream.ReadLong());
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		};
		int ReadPageMargins(BYTE type, long length, void* poResult)
		{
			OOX::Spreadsheet::CPageMargins* pPageMargins = static_cast<OOX::Spreadsheet::CPageMargins*>(poResult);
			int res = c_oSerConstants::ReadOk;
			if(c_oSer_PageMargins::Left == type)
			{
				pPageMargins->m_oLeft.Init();
				pPageMargins->m_oLeft->FromMm(m_oBufferedStream.ReadDouble());
			}
			else if(c_oSer_PageMargins::Top == type)
			{
				pPageMargins->m_oTop.Init();
				pPageMargins->m_oTop->FromMm(m_oBufferedStream.ReadDouble());
			}
			else if(c_oSer_PageMargins::Right == type)
			{
				pPageMargins->m_oRight.Init();
				pPageMargins->m_oRight->FromMm(m_oBufferedStream.ReadDouble());
			}
			else if(c_oSer_PageMargins::Bottom == type)
			{
				pPageMargins->m_oBottom.Init();
				pPageMargins->m_oBottom->FromMm(m_oBufferedStream.ReadDouble());
			}
			else if(c_oSer_PageMargins::Header == type)
			{
				pPageMargins->m_oHeader.Init();
				pPageMargins->m_oHeader->FromMm(m_oBufferedStream.ReadDouble());
			}
			else if(c_oSer_PageMargins::Footer == type)
			{
				pPageMargins->m_oFooter.Init();
				pPageMargins->m_oFooter->FromMm(m_oBufferedStream.ReadDouble());
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		};
		int ReadPageSetup(BYTE type, long length, void* poResult)
		{
			OOX::Spreadsheet::CPageSetup* pPageSetup = static_cast<OOX::Spreadsheet::CPageSetup*>(poResult);
			int res = c_oSerConstants::ReadOk;
			if(c_oSer_PageSetup::Orientation == type)
			{
				pPageSetup->m_oOrientation.Init();
				pPageSetup->m_oOrientation->SetValue((SimpleTypes::EPageOrientation)m_oBufferedStream.ReadByte());
			}
			else if(c_oSer_PageSetup::PaperSize == type)
			{
				pPageSetup->m_oPaperSize.Init();
				pPageSetup->m_oPaperSize->SetValue((SimpleTypes::Spreadsheet::EPageSize)m_oBufferedStream.ReadByte());
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		};
		int ReadPrintOptions(BYTE type, long length, void* poResult)
		{
			OOX::Spreadsheet::CPrintOptions* pPrintOptions = static_cast<OOX::Spreadsheet::CPrintOptions*>(poResult);
			int res = c_oSerConstants::ReadOk;
			if(c_oSer_PrintOptions::GridLines == type)
			{
				bool bGridLines = m_oBufferedStream.ReadBool();
				pPrintOptions->m_oGridLines.Init();
				pPrintOptions->m_oGridLines->FromBool(bGridLines);
				pPrintOptions->m_oGridLinesSet.Init();
				pPrintOptions->m_oGridLinesSet->FromBool(bGridLines);
			}
			else if(c_oSer_PrintOptions::Headings == type)
			{
				pPrintOptions->m_oHeadings.Init();
				pPrintOptions->m_oHeadings->FromBool(m_oBufferedStream.ReadBool());
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		};
		int ReadHyperlinks(BYTE type, long length, void* poResult)
		{
			int res = c_oSerConstants::ReadOk;
			if(c_oSerWorksheetsTypes::Hyperlink == type)
			{
				OOX::Spreadsheet::CHyperlink* pHyperlink = new OOX::Spreadsheet::CHyperlink();
				res = Read1(length, &BinaryWorksheetsTableReader::ReadHyperlink, this, pHyperlink);
				m_pCurWorksheet->m_oHyperlinks->m_arrItems.Add(pHyperlink);
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		};
		int ReadHyperlink(BYTE type, long length, void* poResult)
		{
			OOX::Spreadsheet::CHyperlink* pHyperlink = static_cast<OOX::Spreadsheet::CHyperlink*>(poResult);
			int res = c_oSerConstants::ReadOk;
			if(c_oSerHyperlinkTypes::Ref == type)
			{
				CString sRef((wchar_t*)m_oBufferedStream.ReadPointer(length), length / 2);
				pHyperlink->m_oRef.Init();
				pHyperlink->m_oRef->Append(sRef);
			}
			else if(c_oSerHyperlinkTypes::Hyperlink == type)
			{
				CString sHyperlink((wchar_t*)m_oBufferedStream.ReadPointer(length), length / 2);
				const OOX::RId& rId = m_pCurWorksheet->AddHyperlink(sHyperlink);
				pHyperlink->m_oRid.Init();
				pHyperlink->m_oRid->SetValue(rId.get());
			}
			else if(c_oSerHyperlinkTypes::Location == type)
			{
				CString sLocation((wchar_t*)m_oBufferedStream.ReadPointer(length), length / 2);
				pHyperlink->m_oLocation.Init();
				pHyperlink->m_oLocation->Append(sLocation);
			}
			else if(c_oSerHyperlinkTypes::Tooltip == type)
			{
				CString sTooltip((wchar_t*)m_oBufferedStream.ReadPointer(length), length / 2);
				pHyperlink->m_oTooltip.Init();
				pHyperlink->m_oTooltip->Append(sTooltip);
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		};
		int ReadMergeCells(BYTE type, long length, void* poResult)
		{
			int res = c_oSerConstants::ReadOk;
			if(c_oSerWorksheetsTypes::MergeCell == type)
			{
				CString sRef((wchar_t*)m_oBufferedStream.ReadPointer(length), length / 2);
				OOX::Spreadsheet::CMergeCell* pMergeCell = new OOX::Spreadsheet::CMergeCell();
				pMergeCell->m_oRef.Init();
				pMergeCell->m_oRef->Append(sRef);
				m_pCurWorksheet->m_oMergeCells->m_arrItems.Add(pMergeCell);
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		};
		int ReadDrawings(BYTE type, long length, void* poResult)
		{
			OOX::Spreadsheet::CDrawing* pDrawing = static_cast<OOX::Spreadsheet::CDrawing*>(poResult);
			int res = c_oSerConstants::ReadOk;
			if(c_oSerWorksheetsTypes::Drawing == type)
			{
				OOX::Spreadsheet::CCellAnchor* pCellAnchor = new OOX::Spreadsheet::CCellAnchor();
				res = Read1(length, &BinaryWorksheetsTableReader::ReadDrawing, this, pCellAnchor);
				pDrawing->m_arrItems.Add(pCellAnchor);
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		};
		int ReadDrawing(BYTE type, long length, void* poResult)
		{
			OOX::Spreadsheet::CCellAnchor* pCellAnchor = static_cast<OOX::Spreadsheet::CCellAnchor*>(poResult);
			int res = c_oSerConstants::ReadOk;
			if(c_oSer_DrawingType::Type == type)
			{
				pCellAnchor->setAnchorType((SimpleTypes::Spreadsheet::ECellAnchorType)m_oBufferedStream.ReadByte());
			}
			else if(c_oSer_DrawingType::From == type)
			{
				pCellAnchor->m_oFrom.Init();
				res = Read2(length, &BinaryWorksheetsTableReader::ReadFromTo, this, pCellAnchor->m_oFrom.GetPointer());
			}
			else if(c_oSer_DrawingType::To == type)
			{
				pCellAnchor->m_oTo.Init();
				res = Read2(length, &BinaryWorksheetsTableReader::ReadFromTo, this, pCellAnchor->m_oTo.GetPointer());
			}
			else if(c_oSer_DrawingType::Pos == type)
			{
				pCellAnchor->m_oPos.Init();
				res = Read2(length, &BinaryWorksheetsTableReader::ReadPos, this, pCellAnchor->m_oPos.GetPointer());
			}
			else if(c_oSer_DrawingType::Ext == type)
			{
				pCellAnchor->m_oExt.Init();
				res = Read1(length, &BinaryWorksheetsTableReader::ReadExt, this, pCellAnchor->m_oExt.GetPointer());
			}
			else if(c_oSer_DrawingType::Pic == type)
			{
				res = Read1(length, &BinaryWorksheetsTableReader::ReadPic, this, poResult);
			}
			else if(c_oSer_DrawingType::GraphicFrame == type)
			{
				OOX::Spreadsheet::CChartSpace* pChartSpace = new OOX::Spreadsheet::CChartSpace();
				BinaryChartReader oBinaryChartReader(m_oBufferedStream, m_pArray, m_pOfficeDrawingConverter);
				oBinaryChartReader.Read(length, pChartSpace);
				NSCommon::smart_ptr<OOX::File> pChartFile(pChartSpace);
				pChartFile->m_bDoNotAddRels = true;
				m_pCurDrawing->Add(pChartFile);

				long rId;
				CString sNewImgRel;
				sNewImgRel.Format(_T("../charts/%s"), pChartFile->m_sFilename);
				BSTR bstrNewImgRel = sNewImgRel.AllocSysString();
				m_pOfficeDrawingConverter->WriteRels(_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/chart"), bstrNewImgRel, NULL, &rId);
				SysFreeString(bstrNewImgRel);
				CString sNewRid;
				sNewRid.Format(_T("rId%d"), rId);

				pCellAnchor->m_oGraphicFrame.Init();
				pCellAnchor->m_oGraphicFrame->m_oChartGraphic.Init();
				pCellAnchor->m_oGraphicFrame->m_oChartGraphic->m_oGraphicData.Init();
				pCellAnchor->m_oGraphicFrame->m_oChartGraphic->m_oGraphicData->m_oChart.Init();
				pCellAnchor->m_oGraphicFrame->m_oChartGraphic->m_oGraphicData->m_oChart->m_oRId.Init();
				pCellAnchor->m_oGraphicFrame->m_oChartGraphic->m_oGraphicData->m_oChart->m_oRId->SetValue(sNewRid);
			}
			else if(c_oSer_DrawingType::pptxDrawing == type)
			{
				if(NULL != m_pCurDrawing)
				{
					VARIANT var;
					var.vt = VT_I4;
					var.intVal = m_pCurDrawing->GetGlobalNumberByType(OOX::Spreadsheet::FileTypes::Charts.OverrideType());
					m_pOfficeDrawingConverter->SetAdditionalParam(_T("DocumentChartsCount"), var);
				}

				BSTR bstrXml = NULL;
				HRESULT hRes = m_pOfficeDrawingConverter->SaveObjectEx(m_pArray, m_oBufferedStream.GetPosition(), length, NULL, XMLWRITER_DOC_TYPE_XLSX, &bstrXml);

				if(NULL != m_pCurDrawing)
				{
					VARIANT vt;
					m_pOfficeDrawingConverter->GetAdditionalParam(_T("DocumentChartsCount"), &vt);
					if(VT_I4 == vt.vt)
						m_pCurDrawing->SetGlobalNumberByType(OOX::Spreadsheet::FileTypes::Charts.OverrideType(), vt.intVal);
				}

				if(S_OK == hRes && NULL != bstrXml)
				{
					pCellAnchor->m_oXml.Init();
					pCellAnchor->m_oXml->AppendFormat(_T("%s<xdr:clientData/>"), bstrXml);
					SysFreeString(bstrXml);
				}
				m_oBufferedStream.Skip(length);
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		};
		int ReadFromTo(BYTE type, long length, void* poResult)
		{
			OOX::Spreadsheet::CFromTo* pFromTo = static_cast<OOX::Spreadsheet::CFromTo*>(poResult);
			int res = c_oSerConstants::ReadOk;
			if(c_oSer_DrawingFromToType::Col == type)
			{
				pFromTo->m_oCol.Init();
				pFromTo->m_oCol->SetValue(m_oBufferedStream.ReadLong());
			}
			else if(c_oSer_DrawingFromToType::ColOff == type)
			{
				double dColOffMm = m_oBufferedStream.ReadDouble();
				pFromTo->m_oColOff.Init();
				pFromTo->m_oColOff->FromMm(dColOffMm);
			}
			else if(c_oSer_DrawingFromToType::Row == type)
			{
				pFromTo->m_oRow.Init();
				pFromTo->m_oRow->SetValue(m_oBufferedStream.ReadLong());
			}
			else if(c_oSer_DrawingFromToType::RowOff == type)
			{
				double dRowOffMm = m_oBufferedStream.ReadDouble();
				pFromTo->m_oRowOff.Init();
				pFromTo->m_oRowOff->FromMm(dRowOffMm);
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		};
		int ReadExt(BYTE type, long length, void* poResult)
		{
			OOX::Spreadsheet::CExt* pExt = static_cast<OOX::Spreadsheet::CExt*>(poResult);
			int res = c_oSerConstants::ReadOk;
			if(c_oSer_DrawingExtType::Cx == type)
			{
				double dCxMm = m_oBufferedStream.ReadDouble();
				pExt->m_oCx.Init();
				pExt->m_oCx->FromMm(dCxMm);
			}
			else if(c_oSer_DrawingExtType::Cy == type)
			{
				double dCyMm = m_oBufferedStream.ReadDouble();
				pExt->m_oCy.Init();
				pExt->m_oCy->FromMm(dCyMm);
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		};
		int ReadPos(BYTE type, long length, void* poResult)
		{
			OOX::Spreadsheet::CPos* pPos = static_cast<OOX::Spreadsheet::CPos*>(poResult);
			int res = c_oSerConstants::ReadOk;
			if(c_oSer_DrawingPosType::X == type)
			{
				double dXMm = m_oBufferedStream.ReadDouble();
				pPos->m_oX.Init();
				pPos->m_oX->FromMm(dXMm);
			}
			else if(c_oSer_DrawingPosType::Y == type)
			{
				double dYMm = m_oBufferedStream.ReadDouble();
				pPos->m_oY.Init();
				pPos->m_oY->FromMm(dYMm);
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		};
		int ReadPic(BYTE type, long length, void* poResult)
		{
			OOX::Spreadsheet::CCellAnchor* pCellAnchor = static_cast<OOX::Spreadsheet::CCellAnchor*>(poResult);
			int res = c_oSerConstants::ReadOk;
			if(c_oSer_DrawingType::PicSrc == type)
			{
				long nId = m_oBufferedStream.ReadLong();
				CAtlMap<long, ImageObject*>::CPair* pair = m_mapMedia.Lookup(nId);
				if(NULL != pair)
				{
					CString sRId;
					CAtlMap<OOX::Spreadsheet::CDrawing*, CString>::CPair* pPair = pair->m_value->mapDrawings.Lookup(m_pCurDrawing);
					if(NULL == pPair)
					{
						CString sNewImageName;
						sNewImageName.Format(_T("image%d%s"), pair->m_value->nIndex, OOX::CPath(pair->m_value->sPath).GetExtention(true));
						CString sNewImagePath = m_sMediaDir + _T("\\") + sNewImageName;
						if(pair->m_value->bNeedCreate)
						{
							pair->m_value->bNeedCreate = false;
							DWORD dwFileAttr = ::GetFileAttributes( m_sMediaDir );
							if( dwFileAttr == INVALID_FILE_ATTRIBUTES )
								OOX::CSystemUtility::CreateDirectories(m_sMediaDir);
							::CopyFile(pair->m_value->sPath, sNewImagePath, FALSE);
						}
						long rId;
						CString sNewImgRel;
						sNewImgRel.Format(_T("../media/%s"), sNewImageName);
						BSTR bstrNewImgRel = sNewImgRel.AllocSysString();
						m_pOfficeDrawingConverter->WriteRels(_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/image"), bstrNewImgRel, NULL, &rId);
						SysFreeString(bstrNewImgRel);

						sRId.Format(_T("rId%d"), rId);
						pair->m_value->mapDrawings.SetAt(m_pCurDrawing, sRId);
					}
					else
						sRId = pPair->m_value;
					pCellAnchor->m_oXml.Init();
					pCellAnchor->m_oXml->AppendFormat(_T("<xdr:pic><xdr:nvPicPr><xdr:cNvPr id=\"1\" name=\"Image 1\"></xdr:cNvPr><xdr:cNvPicPr><a:picLocks noChangeAspect=\"1\"></a:picLocks></xdr:cNvPicPr></xdr:nvPicPr><xdr:blipFill><a:blip r:embed=\"%s\"></a:blip><a:stretch></a:stretch></xdr:blipFill><xdr:spPr><a:prstGeom prst=\"rect\"><a:avLst/></a:prstGeom></xdr:spPr></xdr:pic><xdr:clientData/>"), sRId);
				}
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		};
		int ReadSheetData(BYTE type, long length, void* poResult)
		{
			int res = c_oSerConstants::ReadOk;
			if(c_oSerWorksheetsTypes::Row == type)
			{
				OOX::Spreadsheet::CRow* pRow = new OOX::Spreadsheet::CRow();
				res = Read2(length, &BinaryWorksheetsTableReader::ReadRow, this, pRow);
				m_pCurWorksheet->m_oSheetData->m_arrItems.Add(pRow);
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		};
		int ReadRow(BYTE type, long length, void* poResult)
		{
			OOX::Spreadsheet::CRow* pRow = static_cast<OOX::Spreadsheet::CRow*>(poResult);
			int res = c_oSerConstants::ReadOk;
			if(c_oSerRowTypes::Row == type)
			{
				pRow->m_oR.Init();
				pRow->m_oR->SetValue(m_oBufferedStream.ReadLong());
			}
			else if(c_oSerRowTypes::Style == type)
			{
				pRow->m_oS.Init();
				pRow->m_oS->SetValue(m_oBufferedStream.ReadLong());
				pRow->m_oCustomFormat.Init();
				pRow->m_oCustomFormat->FromBool(true);
			}
			else if(c_oSerRowTypes::Height == type)
			{
				pRow->m_oHt.Init();
				pRow->m_oHt->SetValue(m_oBufferedStream.ReadDouble());
				if(g_nFormatVersion < 2)
				{
					pRow->m_oCustomHeight.Init();
					pRow->m_oCustomHeight->SetValue(SimpleTypes::onoffTrue);
				}
			}
			else if(c_oSerRowTypes::Hidden == type)
			{
				pRow->m_oHidden.Init();
				pRow->m_oHidden->SetValue(false != m_oBufferedStream.ReadBool() ? SimpleTypes::onoffTrue : SimpleTypes::onoffFalse);
			}
			else if(c_oSerRowTypes::CustomHeight == type)
			{
				pRow->m_oCustomHeight.Init();
				pRow->m_oCustomHeight->SetValue(false != m_oBufferedStream.ReadBool() ? SimpleTypes::onoffTrue : SimpleTypes::onoffFalse);
			}
			else if(c_oSerRowTypes::Cells == type)
			{
				res = Read1(length, &BinaryWorksheetsTableReader::ReadCells, this, pRow);
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		};
		int ReadCells(BYTE type, long length, void* poResult)
		{
			OOX::Spreadsheet::CRow* pRow = static_cast<OOX::Spreadsheet::CRow*>(poResult);
			int res = c_oSerConstants::ReadOk;
			if(c_oSerRowTypes::Cell == type)
			{
				OOX::Spreadsheet::CCell* pCell = new OOX::Spreadsheet::CCell();
				res = Read1(length, &BinaryWorksheetsTableReader::ReadCell, this, pCell);
				
				if(NULL != m_pSharedStrings && pCell->m_oType.IsInit() && pCell->m_oValue.IsInit())
				{
					SimpleTypes::Spreadsheet::ECellTypeType eCellType = pCell->m_oType->GetValue();
					bool bMoveText = false;
					if(SimpleTypes::Spreadsheet::celltypeError == eCellType)
						bMoveText = true;
					else if((SimpleTypes::Spreadsheet::celltypeSharedString == eCellType && pCell->m_oFormula.IsInit()))
					{
						bMoveText = true;
						pCell->m_oType->SetValue(SimpleTypes::Spreadsheet::celltypeStr);
					}
					if(bMoveText)
					{
						int nValue = _wtoi(pCell->m_oValue->ToString());
						if(nValue >=0 && nValue < m_pSharedStrings->m_arrItems.GetSize())
						{
							OOX::Spreadsheet::CSi *pSi = static_cast<OOX::Spreadsheet::CSi *>(m_pSharedStrings->m_arrItems[nValue]);
							if(NULL != pSi && pSi->m_arrItems.GetSize() > 0)
							{
								OOX::Spreadsheet::WritingElement* pWe = pSi->m_arrItems[0];
								if(OOX::Spreadsheet::et_t == pWe->getType())
								{
									OOX::Spreadsheet::CText* pText = static_cast<OOX::Spreadsheet::CText*>(pWe);
									pCell->m_oValue->m_sText = pText->m_sText;
									pCell->m_oValue->m_oSpace = pText->m_oSpace;
								}
							}
						}
					}
				}
				pRow->m_arrItems.Add(pCell);
			}
			else
				res = c_oSerConstants::ReadUnknown;


			return res;
		};
		int ReadCell(BYTE type, long length, void* poResult)
		{
			OOX::Spreadsheet::CCell* pCell = static_cast<OOX::Spreadsheet::CCell*>(poResult);
			int res = c_oSerConstants::ReadOk;
			if(c_oSerCellTypes::Ref == type)
			{
				CString sRef((wchar_t*)m_oBufferedStream.ReadPointer(length), length / 2);
				pCell->m_oRef.Init();
				pCell->m_oRef->Append(sRef);
			}
			else if(c_oSerCellTypes::Style == type)
			{
				pCell->m_oStyle.Init();
				pCell->m_oStyle->SetValue(m_oBufferedStream.ReadLong());
			}
			else if(c_oSerCellTypes::Type == type)
			{
				pCell->m_oType.Init();
				pCell->m_oType->SetValue((SimpleTypes::Spreadsheet::ECellTypeType)m_oBufferedStream.ReadByte());
			}
			else if(c_oSerCellTypes::Formula == type)
			{
				pCell->m_oFormula.Init();
				res = Read2(length, &BinaryWorksheetsTableReader::ReadFormula, this, pCell->m_oFormula.GetPointer());
			}
			else if(c_oSerCellTypes::Value == type)
			{
				double dValue = m_oBufferedStream.ReadDouble();
				pCell->m_oValue.Init();
				pCell->m_oValue->m_sText.AppendFormat(_T("%s"), OOX::Spreadsheet::SpreadsheetCommon::WriteDouble(dValue));
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		};
		int ReadFormula(BYTE type, long length, void* poResult)
		{
			OOX::Spreadsheet::CFormula* pFormula = static_cast<OOX::Spreadsheet::CFormula*>(poResult);
			int res = c_oSerConstants::ReadOk;
			if(c_oSerFormulaTypes::Aca == type)
			{
				pFormula->m_oAca.Init();
				pFormula->m_oAca->SetValue(false != m_oBufferedStream.ReadBool() ? SimpleTypes::onoffTrue : SimpleTypes::onoffFalse);
			}
			else if(c_oSerFormulaTypes::Bx == type)
			{
				pFormula->m_oBx.Init();
				pFormula->m_oBx->SetValue(false != m_oBufferedStream.ReadBool() ? SimpleTypes::onoffTrue : SimpleTypes::onoffFalse);
			}
			else if(c_oSerFormulaTypes::Ca == type)
			{
				pFormula->m_oCa.Init();
				pFormula->m_oCa->SetValue(false != m_oBufferedStream.ReadBool() ? SimpleTypes::onoffTrue : SimpleTypes::onoffFalse);
			}
			else if(c_oSerFormulaTypes::Del1 == type)
			{
				pFormula->m_oDel1.Init();
				pFormula->m_oDel1->SetValue(false != m_oBufferedStream.ReadBool() ? SimpleTypes::onoffTrue : SimpleTypes::onoffFalse);
			}
			else if(c_oSerFormulaTypes::Del2 == type)
			{
				pFormula->m_oDel2.Init();
				pFormula->m_oDel2->SetValue(false != m_oBufferedStream.ReadBool() ? SimpleTypes::onoffTrue : SimpleTypes::onoffFalse);
			}
			else if(c_oSerFormulaTypes::Dt2D == type)
			{
				pFormula->m_oDt2D.Init();
				pFormula->m_oDt2D->SetValue(false != m_oBufferedStream.ReadBool() ? SimpleTypes::onoffTrue : SimpleTypes::onoffFalse);
			}
			else if(c_oSerFormulaTypes::Dtr == type)
			{
				pFormula->m_oDtr.Init();
				pFormula->m_oDtr->SetValue(false != m_oBufferedStream.ReadBool() ? SimpleTypes::onoffTrue : SimpleTypes::onoffFalse);
			}
			else if(c_oSerFormulaTypes::R1 == type)
			{
				CString sR1((wchar_t*)m_oBufferedStream.ReadPointer(length), length / 2);
				pFormula->m_oR1.Init();
				pFormula->m_oR1->Append(sR1);
			}
			else if(c_oSerFormulaTypes::R2 == type)
			{
				CString sR2((wchar_t*)m_oBufferedStream.ReadPointer(length), length / 2);
				pFormula->m_oR2.Init();
				pFormula->m_oR2->Append(sR2);
			}
			else if(c_oSerFormulaTypes::Ref == type)
			{
				CString sRef((wchar_t*)m_oBufferedStream.ReadPointer(length), length / 2);
				pFormula->m_oRef.Init();
				pFormula->m_oRef->Append(sRef);
			}
			else if(c_oSerFormulaTypes::Si == type)
			{
				pFormula->m_oSi.Init();
				pFormula->m_oSi->SetValue(m_oBufferedStream.ReadLong());
			}
			else if(c_oSerFormulaTypes::T == type)
			{
				pFormula->m_oT.Init();
				pFormula->m_oT->SetValue((SimpleTypes::Spreadsheet::ECellFormulaType)m_oBufferedStream.ReadByte());
			}
			else if(c_oSerFormulaTypes::Text == type)
			{
				CString sText((wchar_t*)m_oBufferedStream.ReadPointer(length), length / 2);
				pFormula->m_sText.Append(sText);
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		};

		void AddLineBreak(OOX::Spreadsheet::CSi& oSi)
		{
			OOX::Spreadsheet::CRun* pRun = new OOX::Spreadsheet::CRun();
			pRun->m_oRPr.Init();
			OOX::Spreadsheet::CRPr& pRPr = pRun->m_oRPr.get2();
			pRPr.m_oRFont.Init();
			pRPr.m_oRFont->m_sVal.Init();
			pRPr.m_oRFont->m_sVal->Append(_T("Tahoma"));
			pRPr.m_oSz.Init();
			pRPr.m_oSz->m_oVal.Init();
			pRPr.m_oSz->m_oVal->SetValue(8);
			pRPr.m_oBold.Init();
			pRPr.m_oBold->FromBool(true);

			OOX::Spreadsheet::CText* pText = new OOX::Spreadsheet::CText();
			pText->m_sText.Append(_T("\n"));

			pRun->m_arrItems.Add(pText);
			oSi.m_arrItems.Add(pRun);
		}
	};
	class BinaryOtherTableReader : public Binary_CommonReader<BinaryOtherTableReader>
	{
		CAtlMap<long, ImageObject*>& m_mapMedia;
		CSimpleArray<CString>& m_aDeleteFiles;
		CString& m_sFileInDir;
		long m_nCurId;
		CString m_sCurSrc;
		long m_nCurIndex;
		CString& m_sTempTheme;
		LPSAFEARRAY m_pArray;
		PPTXFile::IAVSOfficeDrawingConverter* m_pOfficeDrawingConverter;
	public:
		BinaryOtherTableReader(Streams::CBufferedStream& oBufferedStream, CAtlMap<long, ImageObject*>& mapMedia, CString& sFileInDir, CSimpleArray<CString>& aDeleteFiles, CString& sTempTheme, LPSAFEARRAY pArray, PPTXFile::IAVSOfficeDrawingConverter* pOfficeDrawingConverter):Binary_CommonReader(oBufferedStream), m_mapMedia(mapMedia),m_aDeleteFiles(aDeleteFiles),m_sFileInDir(sFileInDir),m_sTempTheme(sTempTheme),m_pArray(pArray),m_pOfficeDrawingConverter(pOfficeDrawingConverter)
		{
			m_nCurId = 0;
			m_sCurSrc = _T("");
			m_nCurIndex = 1;
		}
		int Read()
		{
			return ReadTable(&BinaryOtherTableReader::ReadOtherTableContent, this);
		};
		int ReadOtherTableContent(BYTE type, long length, void* poResult)
		{
			int res = c_oSerConstants::ReadOk;
			if(c_oSer_OtherType::Media == type)
				res = Read1(length, &BinaryOtherTableReader::ReadMediaContent, this, poResult);
			else if(c_oSer_OtherType::Theme == type)
			{
				BSTR bstrTempTheme = m_sTempTheme.AllocSysString();
				m_pOfficeDrawingConverter->SaveThemeXml(m_pArray, m_oBufferedStream.GetPosition(), length, bstrTempTheme);
				SysFreeString(bstrTempTheme);
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		};
		int ReadMediaContent(BYTE type, long length, void* poResult)
		{
			int res = c_oSerConstants::ReadOk;
			if(c_oSer_OtherType::MediaItem == type)
			{
				m_nCurId = -1;
				m_sCurSrc = _T("");
				res = Read1(length, &BinaryOtherTableReader::ReadMediaItem, this, poResult);
				if(-1 != m_nCurId && false == m_sCurSrc.IsEmpty())
				{
					m_mapMedia.SetAt(m_nCurId, new ImageObject(m_sCurSrc, m_nCurIndex));
					m_nCurIndex++;
				}
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		};
		int ReadMediaItem(BYTE type, long length, void* poResult)
		{
			int res = c_oSerConstants::ReadOk;
			if(c_oSer_OtherType::MediaSrc == type)
			{
				CString sImage = CString((wchar_t*)m_oBufferedStream.ReadPointer(length), length / 2);
				CString sImageSrc;
				bool bAddToDelete = false;
				if(0 == sImage.Find(_T("data:")))
				{
					wchar_t sTempPath[MAX_PATH], sTempFile[MAX_PATH];
					if ( 0 == GetTempPath( MAX_PATH, sTempPath ) )
						return S_FALSE;

					if ( 0 == GetTempFileName( sTempPath, _T("CSS"), 0, sTempFile ) )
						return S_FALSE;
					CString sNewTempFile = SerializeCommon::changeExtention(CString(sTempFile), CString(_T("jpg")));
					::MoveFile(sTempFile, sNewTempFile);
					sImageSrc = sNewTempFile;
					SerializeCommon::convertBase64ToImage(sImageSrc, sImage);
					bAddToDelete = true;
				}
				else if(0 == sImage.Find(_T("http:")) || 0 == sImage.Find(_T("https:")) || 0 == sImage.Find(_T("ftp:")) || 0 == sImage.Find(_T("www")))
				{
					
					sImageSrc = SerializeCommon::DownloadImage(sImage);
					CString sNewTempFile = SerializeCommon::changeExtention(sImageSrc, CString(_T("jpg")));
					::MoveFile(sImageSrc, sNewTempFile);
					sImageSrc = sNewTempFile;
					bAddToDelete = true;
				}
				else
				{
					if (0 == sImage.Find(_T("file:///")))
					{
						sImageSrc = sImage;
						sImageSrc.Replace(_T("file:///"), _T(""));
					}
					else
					{
						
						sImageSrc = m_sFileInDir + _T("media\\") + sImage;
					}
				}
				
				DWORD dwFileAttr = ::GetFileAttributes( sImageSrc );
				if( dwFileAttr != INVALID_FILE_ATTRIBUTES && 0 == (dwFileAttr & FILE_ATTRIBUTE_DIRECTORY ) )
				{
					m_sCurSrc = sImageSrc;
					if(bAddToDelete)
						m_aDeleteFiles.Add(sImageSrc);
				}
			}
			else if(c_oSer_OtherType::MediaId == type)
			{
				m_nCurId = m_oBufferedStream.ReadLong();
			}
			else
				res = c_oSerConstants::ReadUnknown;
			return res;
		};
	};
	class BinaryFileReader
	{
	public: BinaryFileReader()
			{
			}
			int ReadFile(CString sSrcFileName, CString sDstPath, CString& sTempTheme,
				PPTXFile::IAVSOfficeDrawingConverter* pOfficeDrawingConverter, CString& sXMLOptions)
			{
				bool bResultOk = false;
				MemoryMapping::CMappingFile oMappingFile = MemoryMapping::CMappingFile();
				if(FALSE != oMappingFile.Open(CString(sSrcFileName)))
				{
					long nBase64DataSize = oMappingFile.GetSize();
					BYTE* pBase64Data = oMappingFile.GetData();

					
					bool bValidFormat = false;
					CString sSignature(g_sFormatSignature);
					int nSigLength = sSignature.GetLength();
					if(nBase64DataSize > nSigLength)
					{
						CStringA sCurSig((char*)pBase64Data, nSigLength);
						if((CStringA)sSignature == sCurSig)
						{
							bValidFormat = true;
						}
					}
					if(bValidFormat)
					{
						
						int nIndex = nSigLength;
						int nType = 0;
						CStringA version = "";
						CStringA dst_len = "";
						while (true)
						{
							nIndex++;
							BYTE _c = pBase64Data[nIndex];
							if (_c == ';')
							{

								if(0 == nType)
								{
									nType = 1;
									continue;
								}
								else
								{
									nIndex++;
									break;
								}
							}
							if(0 == nType)
								version.AppendChar(_c);
							else
								dst_len.AppendChar(_c);
						}
						int nDataSize = atoi(dst_len);

						SAFEARRAYBOUND	rgsabound[1];
						rgsabound[0].lLbound = 0;
						rgsabound[0].cElements = nDataSize;
						LPSAFEARRAY pArray = SafeArrayCreate(VT_UI1, 1, rgsabound);
						if(FALSE != Base64::Base64Decode((LPCSTR)(pBase64Data + nIndex), nBase64DataSize - nIndex, (BYTE*)pArray->pvData, &nDataSize))
						{
							Streams::CBuffer oBuffer;
							Streams::CBufferedStream oBufferedStream;
							oBufferedStream.SetBuffer(&oBuffer);
							oBufferedStream.Create((BYTE*)pArray->pvData, nDataSize);

							int nVersion = g_nFormatVersion;
							if(version.GetLength() > 0)
							{
								version = version.Right(version.GetLength() - 1);
								int nTempVersion = atoi(version);
								if(0 != nTempVersion)
									nVersion = nTempVersion;
							}
							OOX::Spreadsheet::CXlsx oXlsx;
							CSimpleArray<CString> aDeleteFiles;
							ReadMainTable(oXlsx, oBufferedStream, OOX::CPath(sSrcFileName).GetDirectory(), sDstPath, aDeleteFiles, sTempTheme, pArray, pOfficeDrawingConverter);
							CString sAdditionalContentTypes;
							if(NULL != pOfficeDrawingConverter)
							{
								VARIANT vt;
								pOfficeDrawingConverter->GetAdditionalParam(_T("ContentTypes"), &vt);
								if(VT_BSTR == vt.vt)
									sAdditionalContentTypes = vt.bstrVal;
							}
							oXlsx.PrepareToWrite();

							
							BYTE fileType;
							UINT nCodePage;
							WCHAR wcDelimiter;
							SerializeCommon::ReadFileType(sXMLOptions, fileType, nCodePage, wcDelimiter);

							switch(fileType)
							{
							case BinXlsxRW::c_oFileTypes::CSV:
								CSVWriter::WriteFromXlsxToCsv(sDstPath, oXlsx, nCodePage, wcDelimiter);
								break;
							case BinXlsxRW::c_oFileTypes::XLSX:
							default:
								oXlsx.Write(sDstPath, sTempTheme, sAdditionalContentTypes);
								break;
							}

							
							for(int i = 0, length = aDeleteFiles.GetSize(); i < length; ++i)
								DeleteFile(aDeleteFiles[i]);
							bResultOk = true;
						}
						RELEASEARRAY(pArray);
					}
					oMappingFile.Close();
				}
				return S_OK;
			}
			int ReadMainTable(OOX::Spreadsheet::CXlsx& oXlsx, Streams::CBufferedStream& oBufferedStream, CString& sFileInDir, CString& sOutDir, CSimpleArray<CString>& aDeleteFiles, CString& sTempTheme, LPSAFEARRAY pArray, PPTXFile::IAVSOfficeDrawingConverter* pOfficeDrawingConverter)
			{
				long res = c_oSerConstants::ReadOk;
				
				res = oBufferedStream.Peek(1) == FALSE ? c_oSerConstants::ErrorStream : c_oSerConstants::ReadOk;
				if(c_oSerConstants::ReadOk != res)
					return res;
				long nOtherOffset = -1;
				CAtlArray<BYTE> aTypes;
				CAtlArray<long> aOffBits;
				long nOtherOffBits = -1;
				long nSharedStringsOffBits = -1;
				BYTE mtLen = oBufferedStream.ReadByte();
				for(int i = 0; i < mtLen; ++i)
				{
					
					res = oBufferedStream.Peek(5) == FALSE ? c_oSerConstants::ErrorStream : c_oSerConstants::ReadOk;
					if(c_oSerConstants::ReadOk != res)
						return res;
					BYTE mtiType = oBufferedStream.ReadByte();
					long mtiOffBits = oBufferedStream.ReadLong();
					if(c_oSerTableTypes::Other == mtiType)
						nOtherOffBits = mtiOffBits;
					else if(c_oSerTableTypes::SharedStrings == mtiType)
						nSharedStringsOffBits = mtiOffBits;
					else
					{
						aTypes.Add(mtiType);
						aOffBits.Add(mtiOffBits);
					}
				}
				CAtlMap<long, ImageObject*> mapMedia;
				if(-1 != nOtherOffBits)
				{
					oBufferedStream.Seek(nOtherOffBits);
					res = BinaryOtherTableReader(oBufferedStream, mapMedia, sFileInDir, aDeleteFiles, sTempTheme, pArray, pOfficeDrawingConverter).Read();
					if(c_oSerConstants::ReadOk != res)
						return res;
				}
				OOX::Spreadsheet::CSharedStrings* pSharedStrings = NULL;
				if(-1 != nSharedStringsOffBits)
				{
					oBufferedStream.Seek(nSharedStringsOffBits);
					pSharedStrings = oXlsx.CreateSharedStrings();
					res = BinarySharedStringTableReader(oBufferedStream, *pSharedStrings).Read();
					if(c_oSerConstants::ReadOk != res)
						return res;
				}

				OOX::Spreadsheet::CWorkbook* pWorkbook = oXlsx.CreateWorkbook();
				for(int i = 0, length = aTypes.GetCount(); i < length; ++i)
				{
					BYTE mtiType = aTypes[i];
					long mtiOffBits = aOffBits[i];

					oBufferedStream.Seek(mtiOffBits);
					switch(mtiType)
					{
					case c_oSerTableTypes::Styles:
						{
							OOX::Spreadsheet::CStyles* pStyles = oXlsx.CreateStyles();
							res = BinaryStyleTableReader(oBufferedStream, *pStyles).Read();
						}
						break;
					case c_oSerTableTypes::Workbook:
						{
							res = BinaryWorkbookTableReader(oBufferedStream, *pWorkbook).Read();
						}
						break;
					case c_oSerTableTypes::Worksheets:
						{
							res = BinaryWorksheetsTableReader(oBufferedStream, *pWorkbook, pSharedStrings, oXlsx.GetWorksheets(), mapMedia, sOutDir, pArray, pOfficeDrawingConverter).Read();
						}
						break;
					}
					if(c_oSerConstants::ReadOk != res)
						return res;
				}
				POSITION pos = mapMedia.GetStartPosition();
				while ( NULL != pos )
				{
					CAtlMap<long, ImageObject*>::CPair* pPair = mapMedia.GetNext( pos );
					delete pPair->m_value;
				}
				mapMedia.RemoveAll();
				return res;
			}
			void initWorkbook(OOX::Spreadsheet::CWorkbook* pWorkbook)
			{

			}
	};
};