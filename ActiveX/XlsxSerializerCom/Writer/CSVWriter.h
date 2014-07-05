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

namespace CSVWriter
{
	void WriteFile(CFile *pFile, WCHAR **pWriteBuffer, INT &nCurrentIndex, CString &sWriteString, UINT &nCodePage, BOOL bIsEnd = FALSE)
	{
		if (NULL == pFile || NULL == pWriteBuffer)
			return;
		INT nCountChars = sWriteString.GetLength();
		if (0 == nCountChars && !bIsEnd)
			return;

		CONST INT c_nSize = 1048576; 
		CONST INT nSizeWchar = sizeof(WCHAR);
		if (NULL == *pWriteBuffer)
		{
			*pWriteBuffer = new WCHAR[c_nSize];
			::ZeroMemory(*pWriteBuffer, nSizeWchar * c_nSize);
			nCurrentIndex = 0;
		}

		if (nCountChars + nCurrentIndex > c_nSize || bIsEnd)
		{
			
			INT nSize = WideCharToMultiByte(nCodePage, 0, *pWriteBuffer, nCurrentIndex, NULL, NULL, NULL, NULL);
			CHAR *pString = new CHAR [nSize];
			::ZeroMemory (pString, sizeof (CHAR) * nSize);
			WideCharToMultiByte (CP_UTF8, 0, *pWriteBuffer, -1, pString, nSize, NULL, NULL);

			pFile->WriteFile(pString, sizeof (CHAR) * nSize);
			RELEASEARRAYOBJECTS(pString);
			
			::ZeroMemory(*pWriteBuffer, nSizeWchar * c_nSize);
			nCurrentIndex = 0;
		}
		
		if (!bIsEnd)
		{
			::CopyMemory(*pWriteBuffer + nCurrentIndex, sWriteString.GetBuffer(), nCountChars * nSizeWchar);
			nCurrentIndex += nCountChars;
		}
	}
	void WriteFromXlsxToCsv(CString &sFileDst, OOX::Spreadsheet::CXlsx &oXlsx, UINT nCodePage, CONST WCHAR wcDelimiter)
	{
		CFile oFile;
		oFile.CreateFileW(sFileDst);

		LONG lActiveSheet = 0;
		CString sSheetRId = _T("Sheet1"); 
		OOX::Spreadsheet::CWorkbook *pWorkbook = oXlsx.GetWorkbook();
		if (NULL != pWorkbook)
		{
			
			if (pWorkbook->m_oBookViews.IsInit() && 0 < pWorkbook->m_oBookViews->m_arrItems.GetSize())
			{
				if (pWorkbook->m_oBookViews->m_arrItems[0]->m_oActiveTab.IsInit())
				{
					lActiveSheet = pWorkbook->m_oBookViews->m_arrItems[0]->m_oActiveTab->GetValue();
					if (0 > lActiveSheet)
						lActiveSheet = 0;
				}
			}

			
			if (pWorkbook->m_oSheets.IsInit() && 0 <= pWorkbook->m_oSheets->m_arrItems.GetSize())
			{
				if (lActiveSheet <= pWorkbook->m_oSheets->m_arrItems.GetSize())
					sSheetRId = pWorkbook->m_oSheets->m_arrItems[lActiveSheet]->m_oName.get2();
				else
					sSheetRId = pWorkbook->m_oSheets->m_arrItems[0]->m_oName.get2();
			}

			CAtlMap<CString, OOX::Spreadsheet::CWorksheet*> &arrWorksheets = oXlsx.GetWorksheets();
			CAtlMap<CString, OOX::Spreadsheet::CWorksheet*>::CPair* pPair = arrWorksheets.Lookup(sSheetRId);
			if (NULL != pPair)
			{
				OOX::Spreadsheet::CWorksheet *pWorksheet = pPair->m_value;
				if (NULL != pWorksheet && pWorksheet->m_oSheetData.IsInit())
				{
					OOX::Spreadsheet::CSharedStrings *pSharedStrings = oXlsx.GetSharedStrings();
					CString sNewLineN = _T("\n");
					CString sDelimiter = _T(""); sDelimiter += wcDelimiter;
					CONST WCHAR wcQuote = _T('"');
					CString sEscape = _T("\"\n");
					sEscape += wcDelimiter;

					INT nCurrentIndex = 0;
					WCHAR *pWriteBuffer = NULL;

					INT nRowCurrent = 1;
					for (INT i = 0; i < pWorksheet->m_oSheetData->m_arrItems.GetSize(); ++i)
					{
						OOX::Spreadsheet::CRow *pRow = static_cast<OOX::Spreadsheet::CRow *>(pWorksheet->m_oSheetData->m_arrItems[i]);
						INT nRow = pRow->m_oR.IsInit() ? pRow->m_oR->GetValue() : 0 == i ? nRowCurrent : nRowCurrent + 1;

						while (nRow > nRowCurrent)
						{
							
							++nRowCurrent;
							WriteFile(&oFile, &pWriteBuffer, nCurrentIndex, sNewLineN, nCodePage);
						}

						INT nColCurrent = 1;
						for (INT j = 0; j < pRow->m_arrItems.GetSize(); ++j)
						{
							INT nRowTmp = 0;
							INT nCol = 0;
							if (!OOX::Spreadsheet::CWorksheet::parseRef(pRow->m_arrItems[j]->m_oRef.get2(), nRowTmp, nCol))
								nCol = 0 == j ? nColCurrent : nColCurrent + 1;

							while (nCol > nColCurrent)
							{
								
								++nColCurrent;
								WriteFile(&oFile, &pWriteBuffer, nCurrentIndex, sDelimiter, nCodePage);
							}

							OOX::Spreadsheet::CCell *pCell = static_cast<OOX::Spreadsheet::CCell *>(pRow->m_arrItems[j]);

							
							CString sCellValue = _T("");
							if (pCell->m_oValue.IsInit())
							{
								if (pCell->m_oType.IsInit() && SimpleTypes::Spreadsheet::celltypeNumber != pCell->m_oType->GetValue())
								{
									int nValue = _wtoi(pCell->m_oValue->ToString());
									if (0 <= nValue && nValue < pSharedStrings->m_arrItems.GetSize())
									{
										OOX::Spreadsheet::CSi *pSi = static_cast<OOX::Spreadsheet::CSi *>(pSharedStrings->m_arrItems[nValue]);
										if (NULL != pSi && pSi->m_arrItems.GetSize() > 0)
											if(NULL != pSi && pSi->m_arrItems.GetSize() > 0)
											{
												OOX::Spreadsheet::WritingElement* pWe = pSi->m_arrItems[0];
												if(OOX::Spreadsheet::et_t == pWe->getType())
												{
													OOX::Spreadsheet::CText* pText = static_cast<OOX::Spreadsheet::CText*>(pWe);
													sCellValue = pText->m_sText;
												}
											}
									}
								}
								else 
								{
									sCellValue = pCell->m_oValue->ToString();
								}
							}

							
							if (-1 != sCellValue.FindOneOf(sEscape))
							{
								sCellValue.Replace(_T("\""), _T("\"\""));
								sCellValue = wcQuote + sCellValue + wcQuote;
							}
							
							WriteFile(&oFile, &pWriteBuffer, nCurrentIndex, sCellValue, nCodePage);
						}
					}

					WriteFile(&oFile, &pWriteBuffer, nCurrentIndex, sNewLineN, nCodePage, TRUE);
					RELEASEARRAYOBJECTS(pWriteBuffer);
				}
			}
		}

		oFile.CloseFile();
	}
}