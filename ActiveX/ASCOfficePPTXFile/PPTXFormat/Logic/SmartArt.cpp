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
 #include "stdafx.h"

#include "./SmartArt.h"
#include "..\Slide.h"
#include "..\SlideLayout.h"
#include "..\SlideMaster.h"

#include "../../ASCOfficeDrawingConverter.h"

namespace PPTX
{
	namespace Logic
	{
		void SmartArt::LoadDrawing(NSBinPptxRW::CBinaryFileWriter* pWriter)
		{
			CString strDataPath = _T("");

			FileContainer* pRels = NULL;
			if (pWriter->m_pCommonRels.is_init())
				pRels = pWriter->m_pCommonRels.operator ->();

			if(id_data.IsInit())
			{
				if(parentFileIs<Slide>())
					strDataPath = parentFileAs<Slide>().GetMediaFullPathNameFromRId(*id_data);
				else if(parentFileIs<SlideLayout>())
					strDataPath = parentFileAs<SlideLayout>().GetMediaFullPathNameFromRId(*id_data);
				else if(parentFileIs<SlideMaster>())
					strDataPath = parentFileAs<SlideMaster>().GetMediaFullPathNameFromRId(*id_data);
				else if(parentFileIs<Theme>())
					strDataPath = parentFileAs<Theme>().GetMediaFullPathNameFromRId(*id_data);
				else if (pRels != NULL)
				{
					smart_ptr<OOX::Image> p = pRels->image(*id_data);
					if (p.is_init())
						strDataPath = p->filename().m_strFilename;
				}
			}

			if (_T("") == strDataPath)
				return;

			nullable<OOX::RId> id_drawing;

			XmlUtils::CXmlNode oNode;
			oNode.FromXmlFile2(strDataPath);

			XmlUtils::CXmlNode oNode2 = oNode.ReadNode(_T("dgm:extLst"));
			if (oNode2.IsValid())
			{
				XmlUtils::CXmlNode oNode3 = oNode2.ReadNode(_T("a:ext"));
				if (oNode3.IsValid())
				{
					XmlUtils::CXmlNode oNode4 = oNode3.ReadNode(_T("dsp:dataModelExt"));
					if (oNode4.IsValid())
					{
						oNode4.ReadAttributeBase(L"relId", id_drawing);
					}
				}
			}

			if (!id_drawing.is_init())
				return;

			CString strDWPath = _T("");
			if(parentFileIs<Slide>())
				strDWPath = parentFileAs<Slide>().GetMediaFullPathNameFromRId(*id_drawing);
			else if(parentFileIs<SlideLayout>())
				strDWPath = parentFileAs<SlideLayout>().GetMediaFullPathNameFromRId(*id_drawing);
			else if(parentFileIs<SlideMaster>())
				strDWPath = parentFileAs<SlideMaster>().GetMediaFullPathNameFromRId(*id_drawing);
			else if(parentFileIs<Theme>())
				strDWPath = parentFileAs<Theme>().GetMediaFullPathNameFromRId(*id_drawing);
			else if (pRels != NULL)
			{
				smart_ptr<OOX::Image> p = pRels->image(*id_drawing);
				if (p.is_init())
					strDWPath = p->filename().m_strFilename;
			}


			if (_T("") != strDWPath)
			{
				XmlUtils::CXmlNode oNodeDW;
				oNodeDW.FromXmlFile2(strDWPath);

				XmlUtils::CXmlNode oNodeS = oNodeDW.ReadNodeNoNS(_T("spTree"));
				diag = oNodeS;

				CCommonRels* pRels = new CCommonRels();
				OOX::CPath filename = strDWPath;
				pRels->_read(filename);

				m_oCommonRels = (FileContainer*)pRels;
			}
		}

		void ChartRec::toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
		{
			LPSAFEARRAY pArray = NULL;

			FileContainer* pRels = NULL;
			if (pWriter->m_pCommonRels.is_init())
				pRels = pWriter->m_pCommonRels.operator ->();

			CString strDataPath = _T("");
			if(id_data.IsInit())
			{
				if(parentFileIs<Slide>())
					strDataPath = parentFileAs<Slide>().GetMediaFullPathNameFromRId(*id_data);
				else if(parentFileIs<SlideLayout>())
					strDataPath = parentFileAs<SlideLayout>().GetMediaFullPathNameFromRId(*id_data);
				else if(parentFileIs<SlideMaster>())
					strDataPath = parentFileAs<SlideMaster>().GetMediaFullPathNameFromRId(*id_data);
				else if(parentFileIs<Theme>())
					strDataPath = parentFileAs<Theme>().GetMediaFullPathNameFromRId(*id_data);
				else if (pRels != NULL)
				{
					smart_ptr<OOX::Image> p = pRels->image(*id_data);
					if (p.is_init())
						strDataPath = p->filename().m_strFilename;
				}
			}

			if (_T("") == strDataPath)
				return;

			XlsxCom::IAVSOfficeXlsxSerizer* pSerializer = NULL;
			if (!SUCCEEDED(CoCreateInstance(XlsxCom::CLSID_CAVSOfficeXlsxSerizer, NULL, CLSCTX_ALL, XlsxCom::IID_IAVSOfficeXlsxSerizer, (void**)&pSerializer)))
				return;

			IAVSOfficeDrawingConverter* pDrawingConverter = NULL;
			CoCreateInstance(__uuidof(CAVSOfficeDrawingConverter), NULL, CLSCTX_ALL, __uuidof(IAVSOfficeDrawingConverter), (void**)&pDrawingConverter);
			if (NULL == pDrawingConverter)
			{
				RELEASEINTERFACE(pSerializer);
				return;
			}

			VARIANT var;
			
			var.vt = VT_UNKNOWN;
			pWriter->m_oCommon.m_pFontPicker->QueryInterface(IID_IUnknown, (void**)&(var.punkVal));
			pDrawingConverter->SetAdditionalParam(L"FontPicker", var);
			RELEASEINTERFACE((var.punkVal));

			var.vt = VT_ARRAY;

			NSBinPptxRW::CBinaryFileWriter oWriter;
			LPSAFEARRAY pSerializeIM = oWriter.Serialize(&pWriter->m_oCommon.m_oImageManager);
			var.parray = pSerializeIM;
			pDrawingConverter->SetAdditionalParam(L"SerializeImageManager", var);

			RELEASEARRAY(pSerializeIM);

			pSerializer->SetDrawingConverter((IUnknown*)pDrawingConverter);

			BSTR bsPath = strDataPath.AllocSysString();
			pSerializer->LoadChart(bsPath, &pArray);
			SysFreeString(bsPath);

			if (NULL != pArray)
			{
				var.parray = NULL;
				pDrawingConverter->GetAdditionalParam(L"SerializeImageManager", &var);

				if (var.parray != NULL)
				{
					NSBinPptxRW::CBinaryFileReader oReader;
					oReader.Deserialize(&pWriter->m_oCommon.m_oImageManager, var.parray);

					RELEASEARRAY((var.parray));
				}

				pWriter->WriteBYTEArray((BYTE*)pArray->pvData, pArray->rgsabound[0].cElements);
			}

			RELEASEARRAY(pArray);

			RELEASEINTERFACE(pDrawingConverter);
			RELEASEINTERFACE(pSerializer);
		}

		void ChartRec::toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const
		{
			if (!id_data.is_init() || NULL == m_pData)
				return;
			
			CString strData = _T("<c:chart xmlns:c=\"http://schemas.openxmlformats.org/drawingml/2006/chart\" \
xmlns:r=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships\" r:id=\"") + id_data->ToString() + _T("\"/>");

			pWriter->WriteString(strData);
		}

		void ChartRec::fromPPTY(NSBinPptxRW::CBinaryFileReader* pReader)
		{
			ULONG lLen = pReader->GetLong();
			m_pData = pReader->GetArray(lLen);

			m_lChartNumber = pReader->m_lChartNumber;
			pReader->m_lChartNumber++;
			int lId = pReader->m_oRels.WriteChart(m_lChartNumber, pReader->m_lDocumentType);

			
			XlsxCom::IAVSOfficeXlsxSerizer* pSerializer = NULL;
			if (!SUCCEEDED(CoCreateInstance(XlsxCom::CLSID_CAVSOfficeXlsxSerizer, NULL, CLSCTX_ALL, XlsxCom::IID_IAVSOfficeXlsxSerizer, (void**)&pSerializer)))
				return;

			IAVSOfficeDrawingConverter* pDrawingConverter = NULL;
			CoCreateInstance(__uuidof(CAVSOfficeDrawingConverter), NULL, CLSCTX_ALL, __uuidof(IAVSOfficeDrawingConverter), (void**)&pDrawingConverter);
			if (NULL == pDrawingConverter)
			{
				RELEASEINTERFACE(pSerializer);
				return;
			}

			VARIANT var;
			var.vt = VT_ARRAY;

			NSBinPptxRW::CBinaryFileWriter oWriter;
			LPSAFEARRAY pSerializeIM = oWriter.Serialize(pReader->m_oRels.m_pManager);
			var.parray = pSerializeIM;
			pDrawingConverter->SetAdditionalParam(L"SerializeImageManager2", var);

			RELEASEARRAY(pSerializeIM);

			pSerializer->SetDrawingConverter((IUnknown*)pDrawingConverter);

			CString strDstChart = pReader->m_oRels.m_pManager->GetDstMedia();
			int nPos = strDstChart.ReverseFind(TCHAR('m'));
			if (-1 != nPos)
				strDstChart = strDstChart.Mid(0, nPos);

			strDstChart += _T("charts");
			if (1 == m_lChartNumber)
			{
				CDirectory::CreateDirectory(strDstChart);
			}
			CString strChart = _T("");
			strChart.Format(_T("chart%d.xml"), m_lChartNumber);

			strChart = strDstChart + _T("\\") + strChart;

			BSTR bsFile = strChart.AllocSysString();
			BSTR bsContentTypes = NULL;

			if (pReader->m_lDocumentType == XMLWRITER_DOC_TYPE_DOCX)
				pSerializer->SaveChart(m_pData, 0, lLen, bsFile, L"/word/charts/", &bsContentTypes);
			else if (pReader->m_lDocumentType == XMLWRITER_DOC_TYPE_XLSX)
				pSerializer->SaveChart(m_pData, 0, lLen, bsFile, L"/xl/charts/", &bsContentTypes);
			else
				pSerializer->SaveChart(m_pData, 0, lLen, bsFile, L"/ppt/charts/", &bsContentTypes);

			pReader->m_strContentTypes += ((CString)bsContentTypes);
			SysFreeString(bsContentTypes);
			SysFreeString(bsFile);

			var.parray = NULL;
			pDrawingConverter->GetAdditionalParam(L"SerializeImageManager2", &var);

			if (var.parray != NULL)
			{
				NSBinPptxRW::CBinaryFileReader oReader;
				oReader.Deserialize(pReader->m_oRels.m_pManager, var.parray);

				RELEASEARRAY((var.parray));
			}				

			RELEASEINTERFACE(pDrawingConverter);
			RELEASEINTERFACE(pSerializer);

			id_data = new OOX::RId((size_t)lId);
		}
	} 
} 
