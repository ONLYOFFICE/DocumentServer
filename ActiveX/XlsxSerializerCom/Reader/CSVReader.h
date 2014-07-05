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
#include <stack>

namespace CSVReader
{
	void AddCell(CString &sText, INT nStartCell, std::stack<INT> &oDeleteChars, OOX::Spreadsheet::CRow &oRow, INT nRow, INT nCol, BOOL bIsWrap)
	{
		while(!oDeleteChars.empty())
		{
			INT nIndex = oDeleteChars.top() - nStartCell;
			sText.Delete(nIndex);
			oDeleteChars.pop();
		}

		OOX::Spreadsheet::CCell *pCell = new OOX::Spreadsheet::CCell();
		pCell->m_oType.Init();

		WCHAR *pEndPtr;
		LONG lValue = wcstol(sText, &pEndPtr, 10);
		if (NULL != *pEndPtr)
		{
			
			pCell->m_oType->SetValue(SimpleTypes::Spreadsheet::celltypeInlineStr);
			pCell->m_oRichText.Init();
			OOX::Spreadsheet::CText *pText = new OOX::Spreadsheet::CText();
			pText->m_sText = sText;
			pCell->m_oRichText->m_arrItems.Add(pText);
		}
		else
		{
			
			pCell->m_oType->SetValue(SimpleTypes::Spreadsheet::celltypeNumber);
			pCell->m_oValue.Init();
			pCell->m_oValue->m_sText = sText;
		}

		if (bIsWrap)
		{
			
			pCell->m_oStyle.Init();
			pCell->m_oStyle->SetValue(1);
		}

		pCell->m_oRef.Init();
		pCell->m_oRef = OOX::Spreadsheet::CWorksheet::combineRef(nRow, nCol);
		oRow.m_arrItems.Add(pCell);
	}
	void ReadFromCsvToXlsx(CString &sFileName, OOX::Spreadsheet::CXlsx &oXlsx, UINT nCodePage, CONST WCHAR wcDelimiter)
	{
		
		oXlsx.CreateWorkbook();
		
		oXlsx.CreateStyles();

		
		OOX::Spreadsheet::CStyles *pStyles = oXlsx.GetStyles();
		pStyles->m_oCellXfs.Init();
		pStyles->m_oCellXfs->m_oCount.Init();
		pStyles->m_oCellXfs->m_oCount->SetValue(2);

		
		OOX::Spreadsheet::CXfs* pXfs = NULL;
		pXfs = new OOX::Spreadsheet::CXfs();
		pXfs->m_oBorderId.Init();
		pXfs->m_oBorderId->SetValue(0);
		pXfs->m_oFillId.Init();
		pXfs->m_oFillId->SetValue(0);
		pXfs->m_oFontId.Init();
		pXfs->m_oFontId->SetValue(0);
		pXfs->m_oNumFmtId.Init();
		pXfs->m_oNumFmtId->SetValue(0);
		pStyles->m_oCellXfs->m_arrItems.Add(pXfs);

		
		pXfs = new OOX::Spreadsheet::CXfs();
		pXfs->m_oBorderId.Init();
		pXfs->m_oBorderId->SetValue(0);
		pXfs->m_oFillId.Init();
		pXfs->m_oFillId->SetValue(0);
		pXfs->m_oFontId.Init();
		pXfs->m_oFontId->SetValue(0);
		pXfs->m_oNumFmtId.Init();
		pXfs->m_oNumFmtId->SetValue(0);

		pXfs->m_oApplyAlignment.Init();
		pXfs->m_oApplyAlignment->SetValue(SimpleTypes::onoffTrue);
		pXfs->m_oAligment.Init();
		pXfs->m_oAligment->m_oWrapText.Init();
		pXfs->m_oAligment->m_oWrapText->SetValue(SimpleTypes::onoffTrue);
		pStyles->m_oCellXfs->m_arrItems.Add(pXfs);

		CString sSheetRId = _T("rId1");
		OOX::Spreadsheet::CWorksheet* pWorksheet = new OOX::Spreadsheet::CWorksheet();
		pWorksheet->m_oSheetData.Init();
		OOX::Spreadsheet::CSheet *pSheet = new OOX::Spreadsheet::CSheet();
		pSheet->m_oRid.Init();
		pSheet->m_oRid->SetValue(sSheetRId);

		OOX::Spreadsheet::CWorkbook *pWorkbook = oXlsx.GetWorkbook();
		pWorkbook->m_oSheets.Init();
		pWorkbook->m_oSheets->m_arrItems.Add(pSheet);

		MemoryMapping::CMappingFile oMappingFile = MemoryMapping::CMappingFile();
		if(FALSE != oMappingFile.Open(sFileName))
		{
			long nFileSize = oMappingFile.GetSize();
			LPCSTR pFileData = (LPCSTR)oMappingFile.GetData();

			INT nSize = MultiByteToWideChar(nCodePage, 0, pFileData, nFileSize, NULL, 0);
			WCHAR *pTemp = new WCHAR [nSize];
			::ZeroMemory (pTemp, sizeof(WCHAR) * nSize);
			MultiByteToWideChar (nCodePage, 0, pFileData, nFileSize, pTemp, nSize);
			oMappingFile.Close();

			CONST WCHAR wcNewLineN = _T('\n');
			CONST WCHAR wcNewLineR = _T('\r');
			CONST WCHAR wcQuote = _T('"');
			CONST WCHAR wcTab = _T('\t');

			BOOL bIsWrap = FALSE;
			WCHAR wcCurrent;
			INT nStartCell = 0;
			std::stack<INT> oDeleteChars;
			BOOL bInQuote = FALSE;
			INT nIndexRow = 0;
			INT nIndexCol = 0;
			OOX::Spreadsheet::CRow *pRow = new OOX::Spreadsheet::CRow();
			pRow->m_oR.Init();
			pRow->m_oR->SetValue(nIndexRow + 1);
			for (INT nIndex = 0; nIndex < nSize; ++nIndex)
			{
				wcCurrent = pTemp[nIndex];
				if (wcDelimiter == wcCurrent)
				{
					if (bInQuote)
						continue;
					
					CString sCellText(pTemp + nStartCell, nIndex - nStartCell);
					AddCell(sCellText, nStartCell, oDeleteChars, *pRow, nIndexRow, nIndexCol++, bIsWrap);
					bIsWrap = FALSE;

					nStartCell = nIndex + 1;
					if (nStartCell == nSize)
					{
						pWorksheet->m_oSheetData->m_arrItems.Add(pRow);
						pRow = NULL;
					}
				}
				else if (wcNewLineN == wcCurrent || wcNewLineR == wcCurrent)
				{
					if (bInQuote)
					{
						
						bIsWrap = TRUE;
						continue;
					}
					
					if (nStartCell != nIndex)
					{
						CString sCellText(pTemp + nStartCell, nIndex - nStartCell);
						AddCell(sCellText, nStartCell, oDeleteChars, *pRow, nIndexRow, nIndexCol++, bIsWrap);
						bIsWrap = FALSE;
					}

					nStartCell = nIndex + 1;

					pWorksheet->m_oSheetData->m_arrItems.Add(pRow);
					pRow = new OOX::Spreadsheet::CRow();
					pRow->m_oR.Init();
					pRow->m_oR->SetValue(++nIndexRow + 1);
					nIndexCol = 0;
				}
				else if (wcQuote == wcCurrent)
				{
					
					if (FALSE == bInQuote && nStartCell == nIndex && nIndex + 1 != nSize)
					{
						
						bInQuote = !bInQuote;
						nStartCell = nIndex + 1;
					}
					else if (TRUE == bInQuote)
					{
						
						oDeleteChars.push(nIndex);

						
						if (nIndex + 1 != nSize && wcQuote == pTemp[nIndex + 1])
							++nIndex;
						else
							bInQuote = !bInQuote;
					}
				}
				else if (wcTab == wcCurrent)
				{
					
					oDeleteChars.push(nIndex);
				}
			}

			if (nStartCell != nSize)
			{
				
				CString sCellText(pTemp + nStartCell, nSize - nStartCell);
				AddCell(sCellText, nStartCell, oDeleteChars, *pRow, nIndexRow, nIndexCol++, bIsWrap);
				pWorksheet->m_oSheetData->m_arrItems.Add(pRow);
			}
			else
			{
				RELEASEOBJECT(pRow);
			}

			RELEASEARRAYOBJECTS(pTemp);
		}

		CAtlMap<CString, OOX::Spreadsheet::CWorksheet*> &arrWorksheets = oXlsx.GetWorksheets();
		arrWorksheets.SetAt(sSheetRId, pWorksheet);
	}
}