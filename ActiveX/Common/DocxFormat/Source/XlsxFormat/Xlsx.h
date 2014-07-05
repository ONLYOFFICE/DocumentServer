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
#ifndef OOX_XLSX_INCLUDE_H_
#define OOX_XLSX_INCLUDE_H_

#include "../Base/SmartPtr.h"
#include "../DocxFormat/IFileContainer.h"

#include "../SystemUtility/FileSystem/Directory.h"
#include "../DocxFormat/Theme/Theme.h"
#include "../DocxFormat/App.h"
#include "../DocxFormat/Core.h"

#include "Workbook/Workbook.h"
#include "SharedStrings/SharedStrings.h"
#include "Styles/Styles.h"
#include "Worksheets/Worksheet.h"
#include "CalcChain/CalcChain.h"

namespace OOX
{
	namespace Spreadsheet
	{
		class CXlsx : public OOX::Spreadsheet::IFileContainer
		{
		public:

			CXlsx()
			{
				init();
			}
			CXlsx(const CPath& oFilePath)
			{
				init();

				Read( oFilePath );
			}
			~CXlsx()
			{
				if(bDeleteWorkbook)
					RELEASEOBJECT(m_pWorkbook);
				if(bDeleteSharedStrings)
					RELEASEOBJECT(m_pSharedStrings);
				if(bDeleteStyles)
					RELEASEOBJECT(m_pStyles);
				if(bDeleteTheme)
					RELEASEOBJECT(m_pTheme);
				if(bDeleteCalcChain)
					RELEASEOBJECT(m_pCalcChain);
				if(bDeleteWorksheets)
				{
					POSITION pos = m_aWorksheets.GetStartPosition();
					while ( NULL != pos )
					{
						const CAtlMap<CString, CWorksheet*>::CPair* pPair = m_aWorksheets.GetNext( pos );
						delete pPair->m_value;
					}
				}
			}
		public:

			BOOL Read(const CPath& oFilePath)
			{
				
				OOX::CRels oRels( oFilePath / L"/" );
				IFileContainer::Read( oRels, oFilePath );

				

				
				smart_ptr<OOX::File> pFile = Find(OOX::Spreadsheet::FileTypes::Workbook);
				if (pFile.IsInit() && OOX::Spreadsheet::FileTypes::Workbook == pFile->type())
					m_pWorkbook = (OOX::Spreadsheet::CWorkbook*)pFile.operator->();
				else 
					m_pWorkbook = NULL;

				if ( m_pWorkbook )
				{
					OOX::Spreadsheet::IFileContainer* pDocumentContainer = (OOX::Spreadsheet::IFileContainer*)m_pWorkbook;

					
					pFile = pDocumentContainer->Find( OOX::Spreadsheet::FileTypes::SharedStrings );
					if ( pFile.IsInit() && OOX::Spreadsheet::FileTypes::SharedStrings == pFile->type() )
						m_pSharedStrings = (OOX::Spreadsheet::CSharedStrings*)pFile.operator->();
					else 
						m_pSharedStrings = NULL;

					
					pFile = pDocumentContainer->Find( OOX::Spreadsheet::FileTypes::Styles );
					if ( pFile.IsInit() && OOX::Spreadsheet::FileTypes::Styles == pFile->type() )
						m_pStyles = (OOX::Spreadsheet::CStyles*)pFile.operator->();
					else 
						m_pStyles = NULL;

					
					

					
					pFile = pDocumentContainer->Find(OOX::FileTypes::Theme);
					if (pFile.IsInit() && OOX::FileTypes::Theme == pFile->type())
						m_pTheme = (OOX::CTheme*)pFile.operator->();
					else 
						m_pTheme = NULL;

					
					pFile = pDocumentContainer->Find(OOX::Spreadsheet::FileTypes::CalcChain);
					if (pFile.IsInit() && OOX::Spreadsheet::FileTypes::CalcChain == pFile->type())
						m_pCalcChain = (OOX::Spreadsheet::CCalcChain*)pFile.operator->();
					else 
						m_pCalcChain = NULL;


					CAtlMap<CString, smart_ptr<OOX::File>> aWorksheetsFiles;
					pDocumentContainer->FindAllByType(OOX::Spreadsheet::FileTypes::Worksheet, aWorksheetsFiles);
					pDocumentContainer->FindAllByType(OOX::Spreadsheet::FileTypes::Chartsheets, aWorksheetsFiles);

					POSITION pos = aWorksheetsFiles.GetStartPosition();
					while ( NULL != pos )
					{
						const CAtlMap<CString, smart_ptr<OOX::File>>::CPair* pPair = aWorksheetsFiles.GetNext( pos );
						m_aWorksheets.SetAt(pPair->m_key, (OOX::Spreadsheet::CWorksheet*)pPair->m_value.operator->());
					}
				}

				return TRUE;
			}
			BOOL Write(const CPath& oDirPath, CString& sTempTheme, CString& sAdditionalContentTypes)
			{
				if(NULL == m_pWorkbook || 0 == m_aWorksheets.GetCount())
					return FALSE;
				PrepareToWrite();

				OOX::CContentTypes oContentTypes;

				
				
				OOX::CApp* pApp = new OOX::CApp();
				pApp->SetDocSecurity(0);
				pApp->SetScaleCrop(false);
				pApp->SetCompany(_T("Ascensio System"));
				pApp->SetLinksUpToDate(false);
				pApp->SetSharedDoc(false);
				pApp->SetHyperlinksChanged(false);

				smart_ptr<OOX::File> pAppFile(pApp);
				const OOX::RId oAppRId = Add(pAppFile);
				
				OOX::CCore* pCore = new OOX::CCore();
				pCore->SetCreator(_T(""));
				pCore->SetLastModifiedBy(_T(""));
				smart_ptr<OOX::File> pCoreFile(pCore);
				const OOX::RId oCoreRId = Add(pCoreFile);

				
				CPath oXlPath = oDirPath / m_pWorkbook->DefaultDirectory();
				WriteWorkbook(oXlPath, sTempTheme);

				IFileContainer::Write(oDirPath / _T("/"), OOX::CPath(_T("")), oContentTypes);
				if(!sAdditionalContentTypes.IsEmpty())
				{
					CString sAdditionalContentTypesWrapped;
					sAdditionalContentTypesWrapped.Format(_T("<Types xmlns=\"http://schemas.openxmlformats.org/package/2006/content-types\">%s</Types>"), sAdditionalContentTypes);
					OOX::CContentTypes oTempContentTypes;
					oTempContentTypes.ReadFromString(sAdditionalContentTypesWrapped);
					POSITION pos = oTempContentTypes.m_arrOverride.GetStartPosition();
					while ( NULL != pos )
					{
						CAtlMap<CString, ContentTypes::COverride>::CPair* pPair = oTempContentTypes.m_arrOverride.GetNext( pos );
						ContentTypes::COverride& oOverride = pPair->m_value;
						const OOX::CPath& oPath = oOverride.filename();
						oContentTypes.Registration(oOverride.type(), oPath.GetDirectory(), oPath.GetFilename());
					}
				}
				oContentTypes.Write(oDirPath);
				return TRUE;
			}
			BOOL WriteWorkbook(const CPath& oDirPath, CString& sTempTheme)
			{
				
				OOX::CTheme* pTheme = new OOX::CTheme();
				pTheme->DoNotWriteContent(true);
				smart_ptr<OOX::File> pThemeFile(pTheme);
				m_pWorkbook->Add(pThemeFile);
				CPath oThemeDir = oDirPath / pTheme->DefaultDirectory();
				OOX::CSystemUtility::CreateDirectories( oThemeDir );
				::CopyFile(sTempTheme, (oThemeDir / pTheme->DefaultFileName()).GetPath(), FALSE);
				
				if(NULL != m_pSharedStrings && m_pSharedStrings->m_arrItems.GetSize() > 0)
				{
					smart_ptr<OOX::File> pSharedStringsFile(m_pSharedStrings);
					bDeleteSharedStrings = false;
					m_pWorkbook->Add(pSharedStringsFile);
				}
				
				if(NULL != m_pStyles)
				{
					smart_ptr<OOX::File> pStylesFile(m_pStyles);
					bDeleteStyles = false;
					m_pWorkbook->Add(pStylesFile);
				}

				
				smart_ptr<OOX::File> pWorkbookFile(m_pWorkbook);
				bDeleteWorkbook = false;
				Add(pWorkbookFile);
				return TRUE;
			}
			void PrepareToWrite()
			{
				if(NULL != m_pWorkbook)
					m_pWorkbook->PrepareToWrite();
				if(NULL != m_pStyles)
					m_pStyles->PrepareToWrite();
				POSITION pos = m_aWorksheets.GetStartPosition();
				while ( NULL != pos )
				{
					const CAtlMap<CString, CWorksheet*>::CPair* pPair = m_aWorksheets.GetNext( pos );
					pPair->m_value->PrepareToWrite();
				}
			}
		public:
			CWorkbook  *GetWorkbook () const
			{
				return m_pWorkbook;
			}
			CWorkbook  *CreateWorkbook ()
			{
				if(bDeleteWorkbook)
					RELEASEOBJECT(m_pWorkbook);
				m_pWorkbook = new CWorkbook();
				bDeleteWorkbook = true;
				return m_pWorkbook;
			}
			CSharedStrings  *GetSharedStrings () const
			{
				return m_pSharedStrings;
			}
			CSharedStrings  *CreateSharedStrings ()
			{
				if(bDeleteSharedStrings)
					RELEASEOBJECT(m_pSharedStrings);
				m_pSharedStrings = new CSharedStrings();
				bDeleteSharedStrings = true;
				return m_pSharedStrings;
			}
			CStyles  *GetStyles () const
			{
				return m_pStyles;
			}
			CStyles  *CreateStyles ()
			{
				if(bDeleteStyles)
					RELEASEOBJECT(m_pStyles);
				m_pStyles = new CStyles();
				bDeleteStyles = true;
				return m_pStyles;
			}
			CTheme  *GetTheme () const
			{
				return m_pTheme;
			}
			CCalcChain  *GetCalcChain () const
			{
				return m_pCalcChain;
			}
			CAtlMap<CString, CWorksheet*>  &GetWorksheets ()
			{
				return m_aWorksheets;
			}
			void PrepareWorkbook()
			{
				IFileContainer::m_mapEnumeratedGlobal.RemoveAll();
				
				if(NULL != m_pStyles )
				{
					
					if(false == m_pStyles->m_oFonts.IsInit())
						m_pStyles->m_oFonts.Init();
					if(m_pStyles->m_oFonts->m_arrItems.GetSize() == 0)
						m_pStyles->m_oFonts->AddFont(new OOX::Spreadsheet::CFont());
					OOX::Spreadsheet::CFont* pFont = m_pStyles->m_oFonts->m_arrItems[0];
					if(false == pFont->m_oRFont.IsInit())
					{
						pFont->m_oRFont.Init();
						pFont->m_oRFont->m_sVal = _T("Arial");
					}
					if(false == pFont->m_oSz.IsInit() || false == pFont->m_oSz->m_oVal.IsInit())
					{
						pFont->m_oSz.Init();
						pFont->m_oSz->m_oVal.Init();
						pFont->m_oSz->m_oVal->SetValue(11.0);
					}
					
					if(false == m_pStyles->m_oFills.IsInit())
						m_pStyles->m_oFills.Init();
					if(m_pStyles->m_oFills->m_arrItems.GetSize() == 0)
						m_pStyles->m_oFills->m_arrItems.Add(new OOX::Spreadsheet::CFill());
						OOX::Spreadsheet::CFill* pFill = m_pStyles->m_oFills->m_arrItems[0];
						if(false == pFill->m_oGradientFill.IsInit())
						{
							if(false == pFill->m_oPatternFill.IsInit())
								pFill->m_oPatternFill.Init();
							if(false == pFill->m_oPatternFill->m_oPatternType.IsInit())
								pFill->m_oPatternFill->m_oPatternType.Init();
							pFill->m_oPatternFill->m_oPatternType->SetValue(SimpleTypes::Spreadsheet::patterntypeNone);
						}
					if(false == m_pStyles->m_oBorders.IsInit())
						m_pStyles->m_oBorders.Init();
					if(m_pStyles->m_oBorders->m_arrItems.GetSize() == 0)
						m_pStyles->m_oBorders->m_arrItems.Add(new OOX::Spreadsheet::CBorder());

					
					if(false == m_pStyles->m_oCellXfs.IsInit())
						m_pStyles->m_oCellXfs.Init();
					if(m_pStyles->m_oCellXfs->m_arrItems.GetSize() == 0)
						m_pStyles->m_oCellXfs->m_arrItems.Add(new OOX::Spreadsheet::CXfs());

					OOX::Spreadsheet::CXfs* pXfs = m_pStyles->m_oCellXfs->m_arrItems[0];
					if(false == pXfs->m_oBorderId.IsInit())
					{
						pXfs->m_oBorderId.Init();
						pXfs->m_oBorderId->SetValue(0);
					}
					if(false == pXfs->m_oFillId.IsInit())
					{
						pXfs->m_oFillId.Init();
						pXfs->m_oFillId->SetValue(0);
					}
					if(false == pXfs->m_oFontId.IsInit())
					{
						pXfs->m_oFontId.Init();
						pXfs->m_oFontId->SetValue(0);
					}
					if(false == pXfs->m_oNumFmtId.IsInit())
					{
						pXfs->m_oNumFmtId.Init();
						pXfs->m_oNumFmtId->SetValue(0);
					}
				}
				
				POSITION pos = m_aWorksheets.GetStartPosition();
				while ( NULL != pos )
				{
					const CAtlMap<CString, CWorksheet*>::CPair* pPair = m_aWorksheets.GetNext( pos );
					PrepareWorksheet(pPair->m_value);
				}
				
			}
		private:
			void PrepareWorksheet(CWorksheet* pWorksheet)
			{
				if(pWorksheet->m_oSheetData.IsInit())
				{
					CSimpleArray<OOX::Spreadsheet::CRow*>& aRows = pWorksheet->m_oSheetData->m_arrItems;
					for(int i = 0, length = aRows.GetSize(); i < length; ++i)
					{
						OOX::Spreadsheet::CRow* pRow = aRows[i];
						CSimpleArray<OOX::Spreadsheet::CCell*>& aCells = pRow->m_arrItems;
						for(int j = 0, length2 = aCells.GetSize(); j < length2; ++j)
						{
							OOX::Spreadsheet::CCell* pCell = aCells[j];
							if(pCell->m_oType.IsInit())
							{
								if(SimpleTypes::Spreadsheet::celltypeInlineStr == pCell->m_oType->GetValue())
								{
									CSharedStrings* pSharedStrings = GetSharedStrings();
									if(NULL == pSharedStrings)
										pSharedStrings = CreateSharedStrings();
									OOX::Spreadsheet::CSi* pSi = pCell->m_oRichText.GetPointerEmptyNullable();
									if(NULL != pSi)
									{
										int nIndex = pSharedStrings->AddSi(pSi);
										
										pCell->m_oValue.Init();
										pCell->m_oValue->m_sText.Format(_T("%d"), nIndex);
										
										pCell->m_oType.Init();
										pCell->m_oType->SetValue(SimpleTypes::Spreadsheet::celltypeSharedString);
									}
								}
								else if(SimpleTypes::Spreadsheet::celltypeStr == pCell->m_oType->GetValue() || SimpleTypes::Spreadsheet::celltypeError == pCell->m_oType->GetValue())
								{
									CSharedStrings* pSharedStrings = GetSharedStrings();
									if(NULL == pSharedStrings)
										pSharedStrings = CreateSharedStrings();
									CString sValue;
									if(pCell->m_oValue.IsInit())
										sValue = pCell->m_oValue->ToString();
									
									CSi* pSi = new CSi();
									CText* pText =  new CText();
									pText->m_sText = sValue;
									pSi->m_arrItems.Add(pText);
									int nIndex = pSharedStrings->AddSi(pSi);
									
									pCell->m_oValue.Init();
									pCell->m_oValue->m_sText.Format(_T("%d"), nIndex);
									
									if(SimpleTypes::Spreadsheet::celltypeStr == pCell->m_oType->GetValue())
									{
										pCell->m_oType.Init();
										pCell->m_oType->SetValue(SimpleTypes::Spreadsheet::celltypeSharedString);
									}
								}
							}
							
						}
					}
				}
			}
			void init()
			{
				m_pWorkbook = NULL;
				m_pSharedStrings = NULL;
				m_pStyles = NULL;
				m_pTheme = NULL;
				m_pCalcChain = NULL;

				bDeleteWorkbook = false;
				bDeleteSharedStrings = false;
				bDeleteStyles = false;
				bDeleteTheme = false;
				bDeleteCalcChain = false;
				bDeleteWorksheets = false;
			}
		private:
			CWorkbook  *m_pWorkbook;
			bool bDeleteWorkbook;
			CSharedStrings  *m_pSharedStrings;
			bool bDeleteSharedStrings;
			CStyles  *m_pStyles;
			bool bDeleteStyles;
			CTheme  *m_pTheme;
			bool bDeleteTheme;
			CCalcChain  *m_pCalcChain;
			bool bDeleteCalcChain;
			CAtlMap<CString, CWorksheet*> m_aWorksheets;
			bool bDeleteWorksheets;
		};

	} 
} 

#endif // OOX_XLSX_INCLUDE_H_