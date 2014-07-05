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

#include "./File.h"
#include "./FontManagerLight.h"
#include "./WinFontStorage.h"
#include "./../Images/ImageGdipFile.h"

[object, uuid("F30AE253-88EF-4ae2-81B6-D9E1502082FF"), dual, pointer_default(unique)]
__interface IWinFonts : IDispatch
{
	[id(1)]		HRESULT Init([in] BSTR bsFolder, [in] VARIANT_BOOL bIsUseSharedMemory, [in] VARIANT_BOOL bIsSaved);
	[id(2)]		HRESULT GetWinFontByParams([in] BSTR bsFontParams, [out] BSTR* pbsFontName, [out] BSTR* pbsFontPath, [out] BSTR* pbsFontStyle, [out] long *plIndex);
	[id(10)]	HRESULT GetParamsByFontName([in] BSTR bsFontName, [out, satype("BYTE")] SAFEARRAY **ppsaPanose, [out] BSTR* pbsFontParams);

	[id(1001)]	HRESULT SetAdditionalParam([in] BSTR ParamName, [in] VARIANT ParamValue);
	[id(1002)]	HRESULT GetAdditionalParam([in] BSTR ParamName, [out, retval] VARIANT* ParamValue);
};

#if defined(_WIN32_WCE) && !defined(_CE_DCOM) && !defined(_CE_ALLOW_SINGLE_THREADED_OBJECTS_IN_MTA)
#error "Single-threaded COM objects are not properly supported on Windows CE platform, such as the Windows Mobile platforms that do not include full DCOM support. Define _CE_ALLOW_SINGLE_THREADED_OBJECTS_IN_MTA to force ATL to support creating single-thread COM object's and allow use of it's single-threaded COM object implementations. The threading model in your rgs file was set to 'Free' as that is the only threading model supported in non DCOM Windows CE platforms."
#endif


[
	coclass,
	default(IWinFonts),
	threading(apartment),
	vi_progid("OfficeCore.WinFonts"),
	progid("OfficeCore.WinFonts.1"),
	version(1.0),
	uuid("86C455AD-20D4-4071-A431-06C79C913B39")
]
class ATL_NO_VTABLE CWinFonts : public IWinFonts
{
private:
	WinFontsStatusStorage    m_oSS;
	
	CWinFontsInfoStorage    *m_pInfoStorage;
	CWinFontsStatusStorage  *m_pStatusStorage;

	CString m_strInputFontDirectory;
	CString	m_strDumpFontSelectionFile;

	CWinFontList*			m_pList;
	SAFEARRAY*				m_pBinaryFonts;
	BOOL					m_bIsInit;

public:
	CWinFonts()
	{
	}

	DECLARE_PROTECT_FINAL_CONSTRUCT()

	HRESULT FinalConstruct()
	{
		m_pStatusStorage = NULL;
		m_pInfoStorage   = NULL;

		m_pList			= NULL;
		m_pBinaryFonts	= NULL;
		m_bIsInit		= FALSE;

		return S_OK;
	}

	void FinalRelease()
	{
		RELEASEOBJECT(m_pStatusStorage);
		RELEASEOBJECT(m_pInfoStorage);

		RELEASEOBJECT(m_pList);
		RELEASEARRAY(m_pBinaryFonts);
	}

public:
	
	STDMETHOD(SetAdditionalParam)(BSTR ParamName, VARIANT ParamValue)
	{
		CString sParamName = ParamName;
		if ( _T("BinaryFonts") == sParamName && VT_BSTR == ParamValue.vt )
		{
			CheckBinaryData();

			if (NULL != m_pBinaryFonts)
			{
				CFile oFile;
				if (S_OK == oFile.CreateFile((CString)ParamValue.bstrVal))
				{
					oFile.WriteFile((BYTE*)m_pBinaryFonts->pvData, (DWORD)m_pBinaryFonts->rgsabound[0].cElements);
					oFile.CloseFile();
				}
			}
		}
		if ( _T("AllFonts.js") == sParamName && VT_BSTR == ParamValue.vt )
		{
			SaveAllFontsJS((CString)ParamValue.bstrVal);
		}
		if ( _T("InitializeFromFolder") == sParamName && VT_BSTR == ParamValue.vt )
		{
			if ((GetFileAttributes(ParamValue.bstrVal) & FILE_ATTRIBUTE_DIRECTORY) != 0)
			{
				
				CFile oFile;
				if (S_OK == oFile.OpenFile(((CString)ParamValue.bstrVal) + _T("\\font_selection.bin")))
				{
					LONG lSize = (LONG)oFile.GetFileSize();
					BYTE* pData = new BYTE[lSize];
					oFile.ReadFile(pData, (DWORD)lSize);

					m_pList = new CWinFontList(pData, (CString)ParamValue.bstrVal);
					RELEASEARRAYOBJECTS(pData);

					m_bIsInit = TRUE;
				}
				else
				{			
					Init(ParamValue.bstrVal, VARIANT_TRUE, VARIANT_FALSE);
				}
				
			}
			else
			{
				Init(L"", VARIANT_TRUE, VARIANT_FALSE);
			}

		}
		return S_OK;
	}
	STDMETHOD(GetAdditionalParam)(BSTR ParamName, VARIANT* ParamValue)
	{
		CString sParamName = ParamName;
		if ( _T("BinaryFonts") == sParamName )
		{
			ParamValue->vt = VT_SAFEARRAY;
			SafeArrayCopy(m_pBinaryFonts, &ParamValue->parray);
		}
		return S_OK;
	}

	STDMETHOD(GetWinFontByParams)(BSTR bsFontParams, BSTR* pbsFontName, BSTR *pbsFontPath, BSTR* pbsFontStyle, long *plIndex)
	{
		if (!m_bIsInit || !m_pList)
			return S_FALSE;

		CWinFontInfo *pFontInfo = m_pList->GetByParams( (CString)bsFontParams );
		if ( NULL == pFontInfo )
			return S_FALSE;

		if (pbsFontName != NULL)
			*pbsFontName = pFontInfo->m_wsFontName.AllocSysString();

		if (pbsFontPath != NULL)
			*pbsFontPath = pFontInfo->m_wsFontPath.AllocSysString();

		if (pbsFontStyle != NULL)
			*pbsFontStyle = pFontInfo->m_wsStyle.AllocSysString();

		if (plIndex != NULL)
			*plIndex     = pFontInfo->m_lIndex;

		return S_OK;
	}

	STDMETHOD(GetParamsByFontName)(BSTR bsFontName, SAFEARRAY **ppsaPanose, BSTR* pbsFontParams)
	{
		CString props = _T("<FontProperties>");
		props += _T("<Name value='");
		props += ((CString)bsFontName);
		props += _T("' /></FontProperties>");

		CWinFontInfo *pFontInfo = m_pList->GetByParams( props );
		if ( NULL == pFontInfo )
			return S_FALSE;

		SAFEARRAYBOUND saBound;
		saBound.lLbound	  = 0;
		saBound.cElements = 10;

		SAFEARRAY *psaArray = SafeArrayCreate( VT_I1, 1, &saBound );
		memcpy( psaArray->pvData, pFontInfo->m_aPanose, 10 * sizeof(BYTE) );

		*ppsaPanose = psaArray;
		
		return S_OK;
	}

	STDMETHOD(Init)(BSTR bsFolder, VARIANT_BOOL bIsUseSharedMemory, VARIANT_BOOL bIsSaved)
	{
		if (m_bIsInit)
			return S_FALSE;

		CString strFolder = _T("");
		if (bsFolder != NULL)
			strFolder = (CString)bsFolder;

		if (VARIANT_TRUE == bIsUseSharedMemory)
		{
			m_pStatusStorage = new CWinFontsStatusStorage( STATUS_STORAGE_NAME );
			do
			{
				bool bGetMaster = false;
				m_pStatusStorage->GetStatus( &bGetMaster, &m_oSS );

				if ( STIF_BROKEN == m_oSS.m_sStatus || STIF_ERROR == m_oSS.m_sStatus )
				{
					m_oSS.m_sStatus = STIF_CREATING;
					m_pStatusStorage->WriteStruct( &m_oSS );

					FT_Library pLibrary = NULL;
					
					if (!FT_Init_FreeType( &pLibrary ))
					{
						if (_T("") == strFolder)
							m_pList = new CWinFontList(pLibrary);
						else
							m_pList = new CWinFontList(pLibrary, strFolder);

						FT_Done_FreeType( pLibrary );
					}

					BYTE* pFontsData = NULL;
					LONG lFontsDataLen = 0;
					m_pList->ToBuffer(&pFontsData, &lFontsDataLen, strFolder);

					m_oSS.m_sStatus   = STIF_AVAILABLE;
					WinFontsInfoStorage oInfo;
					oInfo.GenerateInfo( pFontsData, lFontsDataLen );

					if (bIsSaved)
					{
						SaveBinaryData(pFontsData, (ULONG)lFontsDataLen);
					}

					oInfo.m_lCount  = 1;
					m_oSS.m_lLength = (LONG64)lFontsDataLen;

					RELEASEOBJECT(m_pInfoStorage);
					m_pInfoStorage = new CWinFontsInfoStorage( STATUS_STORAGE_NAME, m_oSS.m_lLength );

					m_pInfoStorage->WriteStruct( &oInfo );
					m_pStatusStorage->WriteStruct( &m_oSS );

					RELEASEARRAYOBJECTS(pFontsData);
				}
				else if ( STIF_CREATING == m_oSS.m_sStatus )
				{
					Sleep ( 100 );
				}
				else if ( STIF_AVAILABLE == m_oSS.m_sStatus )
				{
					RELEASEOBJECT(m_pInfoStorage);
					m_pInfoStorage = new CWinFontsInfoStorage( STATUS_STORAGE_NAME, m_oSS.m_lLength );

					WinFontsInfoStorage oInfo;
					m_pInfoStorage->ReadStruct( &oInfo );

					m_pList = new CWinFontList(oInfo.m_pBuffer, strFolder);
				}
			}
			while ( STIF_CREATING == m_oSS.m_sStatus );
		}
		else
		{
			FT_Library pLibrary = NULL;
					
			if (!FT_Init_FreeType( &pLibrary ))
			{
				if (_T("") == strFolder)
					m_pList = new CWinFontList(pLibrary);
				else
					m_pList = new CWinFontList(pLibrary, strFolder);

				FT_Done_FreeType( pLibrary );
			}

			BYTE* pFontsData = NULL;
			LONG lFontsDataLen = 0;
			m_pList->ToBuffer(&pFontsData, &lFontsDataLen, strFolder);

			if (bIsSaved)
			{
				SaveBinaryData(pFontsData, (ULONG)lFontsDataLen);
			}
		}

		m_bIsInit = TRUE;
		return S_OK;
	}

private:

	void SaveBinaryData(BYTE* pData, ULONG lLen)
	{
		RELEASEARRAY(m_pBinaryFonts);

		SAFEARRAYBOUND	rgsabound[1];
		rgsabound[0].lLbound = 0;
		rgsabound[0].cElements = lLen;
		m_pBinaryFonts = SafeArrayCreate(VT_UI1, 1, rgsabound);

		BYTE* pDataD = (BYTE*)m_pBinaryFonts->pvData;
		memcpy(pDataD, pData, lLen);
	}

	void CheckBinaryData()
	{
		if (!m_bIsInit || NULL != m_pBinaryFonts || NULL == m_pList)
			return;

		BYTE* pData = NULL;
		LONG lLen = 0;
		m_pList->ToBuffer(&pData, &lLen);

		SaveBinaryData(pData, (ULONG)lLen);
		
		RELEASEARRAYOBJECTS(pData);
	}

	void SaveAllFontsJS(CString strFile)
	{
		int nCount = m_pList->GetFonts()->GetLength();

		
		CAtlMap<CString, LONG> mapFontFiles;
		CAtlMap<LONG, CString> mapFontFiles2;
		LONG lFontFiles = 0;
		for (int i = 0; i < nCount; ++i)
		{
			CWinFontInfo* pInfo = (CWinFontInfo*)m_pList->GetByIndex(i);

			CString strPath = (CString)pInfo->m_wsFontPath;
			CAtlMap<CString, LONG>::CPair* pPair = mapFontFiles.Lookup(strPath);

			if (NULL == pPair)
			{
				mapFontFiles.SetAt(strPath, lFontFiles);
				mapFontFiles2.SetAt(lFontFiles, strPath);
				++lFontFiles;
			}
		}
		

		
		CAtlMap<CString, CFontInfoJS> mapFonts;
		CAtlArray<CString> arrFonts;

		for (int i = 0; i < nCount; ++i)
		{
			CWinFontInfo* pInfo = (CWinFontInfo*)m_pList->GetByIndex(i);
			CString strPath = (CString)pInfo->m_wsFontPath;
			CString strName = (CString)pInfo->m_wsFontName;

			LONG lFontIndex = 0;
			LONG lFaceIndex = 0;

			CAtlMap<CString, LONG>::CPair* pPairFontFiles = mapFontFiles.Lookup(strPath);
			lFontIndex = pPairFontFiles->m_value;

			if (pInfo->m_lIndex >= 0)
				lFaceIndex = pInfo->m_lIndex;

			CAtlMap<CString, CFontInfoJS>::CPair* pPair = mapFonts.Lookup(pInfo->m_wsFontName);
			if (NULL != pPair)
			{
				pPair->m_value.m_sName = pInfo->m_wsFontName;

				if (pInfo->m_bBold && pInfo->m_bItalic)
				{
					pPair->m_value.m_lIndexBI = lFontIndex;
					pPair->m_value.m_lFaceIndexBI = lFaceIndex;
				}
				else if (pInfo->m_bBold)
				{
					pPair->m_value.m_lIndexB = lFontIndex;
					pPair->m_value.m_lFaceIndexB = lFaceIndex;
				}
				else if (pInfo->m_bItalic)
				{
					pPair->m_value.m_lIndexI = lFontIndex;
					pPair->m_value.m_lFaceIndexI = lFaceIndex;
				}
				else
				{
					pPair->m_value.m_lIndexR = lFontIndex;
					pPair->m_value.m_lFaceIndexR = lFaceIndex;
				}
			}
			else
			{
				CFontInfoJS fontInfo;

				fontInfo.m_sName = pInfo->m_wsFontName;

				if (pInfo->m_bBold && pInfo->m_bItalic)
				{
					fontInfo.m_lIndexBI = lFontIndex;
					fontInfo.m_lFaceIndexBI = lFaceIndex;
				}
				else if (pInfo->m_bBold)
				{
					fontInfo.m_lIndexB = lFontIndex;
					fontInfo.m_lFaceIndexB = lFaceIndex;
				}
				else if (pInfo->m_bItalic)
				{
					fontInfo.m_lIndexI = lFontIndex;
					fontInfo.m_lFaceIndexI = lFaceIndex;
				}
				else
				{
					fontInfo.m_lIndexR = lFontIndex;
					fontInfo.m_lFaceIndexR = lFaceIndex;
				}

				mapFonts.SetAt(fontInfo.m_sName, fontInfo);
				arrFonts.Add(fontInfo.m_sName);
			}
		}
		

		
		size_t nCountFonts = arrFonts.GetCount();
		for (size_t i = 0; i < nCountFonts; ++i)
		{
			for (size_t j = i + 1; j < nCountFonts; ++j)
			{
				if (arrFonts[i] > arrFonts[j])
				{
					CString temp = arrFonts[i];
					arrFonts[i] = arrFonts[j];
					arrFonts[j] = temp;
				}
			}
		}
		

		
		double dW_mm = 80;
		LONG lH1_px = LONG(7 * 96 / 25.4);
		LONG lWidthPix = (LONG)(dW_mm * 96 / 25.4);
		LONG lHeightPix = (LONG)(nCountFonts * lH1_px);

		IUncompressedFrame* pFrame;
		CoCreateInstance(__uuidof(CUncompressedFrame), NULL, CLSCTX_ALL, __uuidof(IUncompressedFrame), (void**)&pFrame);

		pFrame->put_ColorSpace( ( 1 << 6) | ( 1 << 31) ); 
		pFrame->put_Width( lWidthPix );
		pFrame->put_Height( lHeightPix );
		pFrame->put_AspectRatioX( lWidthPix );
		pFrame->put_AspectRatioY( lHeightPix );
		pFrame->put_Interlaced( VARIANT_FALSE );
		pFrame->put_Stride( 0, 4 * lWidthPix );
		pFrame->AllocateBuffer( -1 );

		BYTE* pBuffer = NULL;
		pFrame->get_Buffer(&pBuffer);
		memset(pBuffer, 0xFF, 4 * lWidthPix * lHeightPix);

		for (LONG i = 3; i < lWidthPix * lHeightPix * 4; i += 4)
		{
			pBuffer[i] = 0;
		}

		IImageGdipFile* pImFile;
		CoCreateInstance(__uuidof(CImageGdipFile), NULL, CLSCTX_ALL, __uuidof(IImageGdipFile), (void**)&pImFile);

		IUnknown* punkFrame = NULL;
		pFrame->QueryInterface(IID_IUnknown, (void**)&punkFrame);

		pImFile->put_Frame(punkFrame);

		RELEASEINTERFACE(punkFrame);

		CFontManagerLight oFontManager;
		oFontManager.SetDefaultFont(_T("Arial"), m_pList);

		
		
		if (TRUE)
		{
			CStringWriter oWriterJS;

			
			size_t nCountFiles = mapFontFiles.GetCount();
			if (nCountFiles == 0)
				oWriterJS.WriteStringC(_T("window[\"__fonts_files\"] = []; \n\n"));
			else
			{
				POSITION pos = mapFontFiles.GetStartPosition();
				CString* pMassFiles = new CString[nCountFiles];
				while (NULL != pos)
				{
					const CAtlMap<CString, LONG>::CPair* pPair = mapFontFiles.GetNext(pos);
					
					CString strFontId = pPair->m_key;
					strFontId.Replace(_T("\\\\"), _T("\\"));
					strFontId.Replace(_T("/"), _T("\\"));
					int nStart = strFontId.ReverseFind('\\');
					strFontId = strFontId.Mid(nStart + 1);

					pMassFiles[pPair->m_value] = strFontId;
				}

				oWriterJS.WriteStringC(_T("window[\"__fonts_files\"] = [\n"));
				for (size_t nIndex = 0; nIndex < nCountFiles; ++nIndex)
				{
					oWriterJS.WriteStringC(_T("\""));
					oWriterJS.WriteString(pMassFiles[nIndex]);
					if (nIndex != (nCountFiles - 1))
						oWriterJS.WriteStringC(_T("\",\n"));
					else
						oWriterJS.WriteStringC(_T("\""));
				}
				oWriterJS.WriteStringC(_T("\n];\n\n"));

				RELEASEARRAYOBJECTS(pMassFiles);
			}
			
			CString strArrayInit = _T("");
			strArrayInit.Format(_T("window[\"__fonts_infos\"] = [\n"), nCountFonts);
			oWriterJS.WriteString(strArrayInit);

			for (int index = 0; index < nCountFonts; ++index)
			{
				const CAtlMap<CString, CFontInfoJS>::CPair* pPair = mapFonts.Lookup(arrFonts[index]);

				CString str1 = _T("");
				str1.Format(_T("[\""), index);
				str1 += pPair->m_value.m_sName;
				
				CString strParams = _T("");
				strParams.Format(_T("\",%d,%d,%d,%d,%d,%d,%d,%d]"), pPair->m_value.m_lIndexR, pPair->m_value.m_lFaceIndexR,
										pPair->m_value.m_lIndexI, pPair->m_value.m_lFaceIndexI,
										pPair->m_value.m_lIndexB, pPair->m_value.m_lFaceIndexB,
										pPair->m_value.m_lIndexBI, pPair->m_value.m_lFaceIndexBI);

				oWriterJS.WriteString(str1);
				oWriterJS.WriteString(strParams);

				if (index != (nCountFonts - 1))
					oWriterJS.WriteStringC(_T(",\n"));
				else
					oWriterJS.WriteStringC(_T("\n"));
				
				
				LONG lFontIndex = 0;
				LONG lFaceIndex = 0;
				if (pPair->m_value.m_lIndexR != -1)
				{
					lFontIndex = pPair->m_value.m_lIndexR;
					lFaceIndex = pPair->m_value.m_lFaceIndexR;
				}
				else if (pPair->m_value.m_lIndexI != -1)
				{
					lFontIndex = pPair->m_value.m_lIndexI;
					lFaceIndex = pPair->m_value.m_lFaceIndexI;
				}
				else if (pPair->m_value.m_lIndexI != -1)
				{
					lFontIndex = pPair->m_value.m_lIndexB;
					lFaceIndex = pPair->m_value.m_lFaceIndexB;
				}
				else if (pPair->m_value.m_lIndexBI != -1)
				{
					lFontIndex = pPair->m_value.m_lIndexBI;
					lFaceIndex = pPair->m_value.m_lFaceIndexBI;
				}

				CString strFontPath = _T("");
				CAtlMap<LONG, CString>::CPair* _pair = mapFontFiles2.Lookup(lFontIndex);
				if (NULL != _pair)
					strFontPath = _pair->m_value;

				oFontManager.LoadFontFromFile(strFontPath, 14, 96, 96, lFaceIndex);
				
				CFreeTypeFont* pFont = oFontManager.GetFont();
				BOOL bIsSymbol = FALSE;

				if (pFont)
					bIsSymbol = (-1 != (pFont->GetSymbolic())) ? TRUE : FALSE;

				if (bIsSymbol)
				{
					CString strGetCour = oFontManager.GetFontPath(_T("Courier New"), m_pList);
					if (_T("") != strGetCour)
					{
						oFontManager.LoadFontFromFile(strGetCour, 14, 96, 96, lFaceIndex);
						pFont = oFontManager.GetFont();
					}
				}

				if (pFont)
				{
					pFont->SetStringGID(FALSE);
					pFont->SetCharSpacing(0);
				}

				BSTR bsText = pPair->m_value.m_sName.AllocSysString();
				oFontManager.FillString(bsText, 5, 25.4 * (index * lH1_px + lH1_px) / 96 - 2, 96, 96, pFrame, 255 ); 
				SysFreeString(bsText);
			}
			oWriterJS.WriteStringC(_T("];\n\n"));

			wchar_t sTempPath[MAX_PATH], sTempFile[MAX_PATH];
			if ( 0 == GetTempPath( MAX_PATH, sTempPath ) )
				return;

			if ( 0 == GetTempFileName( sTempPath, L"thumbnail", 0, sTempFile ) )
				return;
			
			CString strThumbnailPath(sTempFile);

			BSTR bsThPath = strThumbnailPath.AllocSysString();
			pImFile->SaveFile(bsThPath, 4);
			SysFreeString(bsThPath);

			RELEASEINTERFACE(pFrame);
			RELEASEINTERFACE(pImFile);

			CFile oImageFile;
			oImageFile.OpenFile(strThumbnailPath);
			int nInputLen = (int)oImageFile.GetFileSize();
			BYTE* pData = new BYTE[nInputLen];
			oImageFile.ReadFile(pData, nInputLen);
			oImageFile.CloseFile();

			BSTR bstrDelFile = strThumbnailPath.AllocSysString();

#ifdef _DEBUG
			CopyFile(bstrDelFile, L"C:\\thumbnail.png", FALSE);
#endif
			DeleteFile(bstrDelFile);
			SysFreeString(bstrDelFile);

			int nOutputLen = Base64EncodeGetRequiredLength(nInputLen, ATL_BASE64_FLAG_NOCRLF);
			BYTE* pOutput = new BYTE[nOutputLen];
			Base64Encode(pData, nInputLen, (LPSTR)pOutput, &nOutputLen, ATL_BASE64_FLAG_NOCRLF);

			CString _s((char*)pOutput, nOutputLen);

			oWriterJS.WriteStringC(_T("window[\"g_standart_fonts_thumbnail\"] = \"data:image/png;base64,"));
			oWriterJS.WriteStringC(_s);
			oWriterJS.WriteStringC(_T("\";\n"));

			CStringA strA = (CStringA)oWriterJS.GetCString();
			CFile oFileFontsJS;
			oFileFontsJS.CreateFile(strFile);
			oFileFontsJS.WriteFile((void*)strA.GetBuffer(), (DWORD)strA.GetLength());
			oFileFontsJS.CloseFile();	
		}
	}

protected:
	class CTextItem
	{
	protected:
		wchar_t*	m_pData;
		size_t		m_lSize;

		wchar_t*	m_pDataCur;
		size_t		m_lSizeCur;

	public:
		CTextItem()
		{
			m_pData = NULL;
			m_lSize = 0;

			m_pDataCur	= m_pData;
			m_lSizeCur	= m_lSize;
		}
		CTextItem(const CTextItem& oSrc)
		{
			m_pData = NULL;
			*this = oSrc;
		}
		CTextItem& operator=(const CTextItem& oSrc)
		{
			RELEASEMEM(m_pData);

			m_lSize		= oSrc.m_lSize;
			m_lSizeCur	= oSrc.m_lSizeCur;
			m_pData		= (wchar_t*)malloc(m_lSize * sizeof(wchar_t));

			memcpy(m_pData, oSrc.m_pData, m_lSizeCur * sizeof(wchar_t));
							
			m_pDataCur = m_pData + m_lSizeCur;

			return *this;
		}

		CTextItem(const size_t& nLen)
		{
			m_lSize = nLen;
			m_pData = (wchar_t*)malloc(m_lSize * sizeof(wchar_t));
				
			m_lSizeCur = 0;
			m_pDataCur = m_pData;
		}
		CTextItem(wchar_t* pData, const size_t& nLen)
		{
			m_lSize = nLen;
			m_pData = (wchar_t*)malloc(m_lSize * sizeof(wchar_t));

			memcpy(m_pData, pData, m_lSize * sizeof(wchar_t));
				
			m_lSizeCur = m_lSize;
			m_pDataCur = m_pData + m_lSize;
		}
		CTextItem(wchar_t* pData, BYTE* pUnicodeChecker = NULL)
		{
			size_t nLen = GetStringLen(pData);

			m_lSize = nLen;
			m_pData = (wchar_t*)malloc(m_lSize * sizeof(wchar_t));

			memcpy(m_pData, pData, m_lSize * sizeof(wchar_t));
				
			m_lSizeCur = m_lSize;
			m_pDataCur = m_pData + m_lSize;

			if (NULL != pUnicodeChecker)
			{
				wchar_t* pMemory = m_pData;
				while (pMemory < m_pDataCur)
				{
					if (!pUnicodeChecker[*pMemory])
						*pMemory = wchar_t(' ');
					++pMemory;
				}
			}
		}
		virtual ~CTextItem()
		{
			RELEASEMEM(m_pData);
		}

		__forceinline void AddSize(const size_t& nSize)
		{
			if (NULL == m_pData)
			{
				m_lSize = max(nSize, 1000);				
				m_pData = (wchar_t*)malloc(m_lSize * sizeof(wchar_t));
				
				m_lSizeCur = 0;
				m_pDataCur = m_pData;
				return;
			}

			if ((m_lSizeCur + nSize) > m_lSize)
			{
				while ((m_lSizeCur + nSize) > m_lSize)
				{
					m_lSize *= 2;
				}

				wchar_t* pRealloc = (wchar_t*)realloc(m_pData, m_lSize * sizeof(wchar_t));
				if (NULL != pRealloc)
				{
					
					m_pData		= pRealloc;
					m_pDataCur	= m_pData + m_lSizeCur;
				}
				else
				{
					wchar_t* pMalloc = (wchar_t*)malloc(m_lSize * sizeof(wchar_t));
					memcpy(pMalloc, m_pData, m_lSizeCur * sizeof(wchar_t));

					free(m_pData);
					m_pData		= pMalloc;
					m_pDataCur	= m_pData + m_lSizeCur;
				}
			}
		}

	public:
		
		__forceinline void operator+=(const CTextItem& oTemp)
		{
			WriteString(oTemp.m_pData, oTemp.m_lSizeCur);
		}
		__forceinline void operator+=(_bstr_t& oTemp)
		{
			size_t nLen = oTemp.length();
			WriteString(oTemp.GetBSTR(), nLen);
		}
		__forceinline void operator+=(CString& oTemp)
		{
			size_t nLen = (size_t)oTemp.GetLength();

			#ifdef _UNICODE
			WriteString(oTemp.GetBuffer(), nLen);
			#else
			CStringW str = (CStringW)oTemp;
			WriteString(str.GetBuffer(), nLen);
			#endif
		}
		__forceinline wchar_t operator[](const size_t& nIndex)
		{
			if (nIndex < m_lSizeCur)
				return m_pData[nIndex];

			return 0;
		}

		__forceinline void SetText(BSTR& bsText)
		{
			ClearNoAttack();
			size_t nLen = GetStringLen(bsText);

			WriteString(bsText, nLen);

			for (size_t i = 0; i < nLen; ++i)
			{
				if (WCHAR(8233) == m_pData[i])
					m_pData[i] = WCHAR(' ');
			}
		}
		__forceinline void AddSpace()
		{
			AddSize(1);
			*m_pDataCur = wchar_t(' ');

			++m_lSizeCur;
			++m_pDataCur;
		}
		__forceinline void CorrectUnicode(const BYTE* pUnicodeChecker)
		{
			if (NULL != pUnicodeChecker)
			{
				wchar_t* pMemory = m_pData;
				while (pMemory < m_pDataCur)
				{
					if (!pUnicodeChecker[*pMemory])
						*pMemory = wchar_t(' ');
					++pMemory;
				}
			}
		}
		__forceinline void RemoveLastSpaces()
		{
			wchar_t* pMemory = m_pDataCur - 1;
			while ((pMemory > m_pData) && (wchar_t(' ') == *pMemory))
			{
				--pMemory;
				--m_lSizeCur;
				--m_pDataCur;
			}

		}
		__forceinline bool IsSpace()
		{
			if (1 != m_lSizeCur)
				return false;
			return (wchar_t(' ') == *m_pData);
		}
		
	public:
		__forceinline void WriteString(wchar_t* pString, const size_t& nLen)
		{
			AddSize(nLen);
			
			memcpy(m_pDataCur, pString, nLen << 1);
			m_pDataCur += nLen;
			m_lSizeCur += nLen;
		}
		__forceinline size_t GetCurSize()
		{
			return m_lSizeCur;
		}
		__forceinline size_t GetSize()
		{
			return m_lSize;
		}
		__forceinline void Clear()
		{
			RELEASEMEM(m_pData);
			
			m_pData = NULL;
			m_lSize = 0;

			m_pDataCur	= m_pData;
			m_lSizeCur	= 0;
		}
		__forceinline void ClearNoAttack()
		{
			m_pDataCur	= m_pData;
			m_lSizeCur	= 0;
		}

		__forceinline size_t GetStringLen(wchar_t* pData)
		{
			wchar_t* s = pData;
			for (; *s != 0; ++s);
			return (size_t)(s - pData);
		}

		__forceinline CString GetCString()
		{
			CString str(m_pData, (int)m_lSizeCur);
			return str;
		}
		__forceinline wchar_t* GetBuffer()
		{
			return m_pData;
		}
	};

	class CStringWriter : public CTextItem
	{
	public:
		CStringWriter() : CTextItem()
		{
		}
		virtual ~CStringWriter()
		{
		}

	public:
		
		__forceinline void WriteString(_bstr_t& bsString)
		{
			size_t nLen = bsString.length();
			CTextItem::WriteString(bsString.GetBSTR(), nLen);
		}
		__forceinline void WriteString(CString& sString)
		{
			size_t nLen = (size_t)sString.GetLength();

			#ifdef _UNICODE
			CTextItem::WriteString(sString.GetBuffer(), nLen);
			#else
			CStringW str = (CStringW)sString;
			WriteString(str.GetBuffer(), nLen);
			#endif
		}
		__forceinline void WriteStringC(const CString& sString)
		{
			CString* pPointer = const_cast<CString*>(&sString);
			
			size_t nLen = (size_t)pPointer->GetLength();

			#ifdef _UNICODE
			CTextItem::WriteString(pPointer->GetBuffer(), nLen);
			#else
			CStringW str = (CStringW)sString;
			WriteString(str.GetBuffer(), nLen);
			#endif
		}
		__forceinline void WriteString(wchar_t* pString, const size_t& nLen)
		{
			CTextItem::WriteString(pString, nLen);
		}
		__forceinline void Write(CStringWriter& oWriter)
		{
			CTextItem::WriteString(oWriter.m_pData, oWriter.m_lSizeCur);
		}
	};

	class CFontInfoJS
	{
	public:		
		CString	m_sName;

		LONG	m_lIndexR;
		LONG	m_lFaceIndexR;
		LONG	m_lIndexI;
		LONG	m_lFaceIndexI;
		LONG	m_lIndexB;
		LONG	m_lFaceIndexB;
		LONG	m_lIndexBI;
		LONG	m_lFaceIndexBI;

		CFontInfoJS()
		{
			m_sName			= _T("");

			m_lIndexR		= -1;
			m_lFaceIndexR	= -1;
			m_lIndexI		= -1;
			m_lFaceIndexI	= -1;
			m_lIndexB		= -1;
			m_lFaceIndexB	= -1;
			m_lIndexBI		= -1;
			m_lFaceIndexBI	= -1;
		}

		CFontInfoJS(const CFontInfoJS& oSrc)
		{
			*this = oSrc;
		}

		CFontInfoJS& operator=(const CFontInfoJS& oSrc)
		{
			m_sName			= oSrc.m_sName;

			m_lIndexR	= oSrc.m_lIndexR;
			m_lIndexI	= oSrc.m_lIndexI;
			m_lIndexB	= oSrc.m_lIndexB;
			m_lIndexBI	= oSrc.m_lIndexBI;

			m_lFaceIndexR	= oSrc.m_lFaceIndexR;
			m_lFaceIndexI	= oSrc.m_lFaceIndexI;
			m_lFaceIndexB	= oSrc.m_lFaceIndexB;
			m_lFaceIndexBI	= oSrc.m_lFaceIndexBI;

			return *this;
		}
	};
};