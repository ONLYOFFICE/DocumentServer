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
#include "stdafx.h"
#include "resource.h"       

#include "../Common/OfficeFileTemplate.h"

#include "PPTXFormat/PPTXEvent.h"
#include "../../../../Common/GdiPlusEx.h"

#include <shellapi.h>
#include <shlobj.h>
#include <shlwapi.h>
#pragma comment( lib, "shell32.lib" ) 

#include "Editor\PPTXWriter.h"


[object, uuid("ED1EC17E-EE0E-4cae-9E63-1C57235CE286"), dual, pointer_default(unique)]
__interface IAVSOfficePPTXFile : IAVSOfficeFileTemplate
{


	[propget, id(4), helpstring("property TempDirectory")] HRESULT TempDirectory([out, retval] BSTR* pVal);
	[propput, id(4), helpstring("property TempDirectory")] HRESULT TempDirectory([in] BSTR newVal);
	[id(5), helpstring("method GetDVDXml")] HRESULT GetDVDXml([out,retval] BSTR* pbstrPTTXml);
	[id(6), helpstring("method GetBluRayXml")] HRESULT GetBluRayXml([out,retval] BSTR* pbstrDVDXml);
	[propget, id(7), helpstring("property DrawingXml")] HRESULT DrawingXml([out, retval] BSTR* pVal);

	[id(2000 + 0)] HRESULT SetAdditionalParam([in] BSTR ParamName, [in] VARIANT ParamValue);
	[id(2001 + 1)] HRESULT GetAdditionalParam([in] BSTR ParamName, [out, retval] VARIANT* ParamValue);
};


[object, uuid("4F4EA472-EC78-495c-B627-5798EA364468"), dual, pointer_default(unique)]
__interface IAVSOfficePPTXFile2 : IDispatch
{
	[id(10000 + 0)] HRESULT OpenFileToPPTY([in] BSTR bsInputDir, [in] BSTR bsFileDst);
	[id(10000 + 1)] HRESULT OpenDirectoryToPPTY([in] BSTR bsInputDir, [in] BSTR bsFileDst);

	[id(10000 + 2)] HRESULT SetMediaDir([in] BSTR bsMediaDir);
	[id(10000 + 3)] HRESULT SetFontDir([in] BSTR bsFontDir);

	[id(10000 + 4)] HRESULT SetUseSystemFonts([in] VARIANT_BOOL useSystemFonts);
	[id(10000 + 5)] HRESULT ConvertPPTYToPPTX([in] BSTR bsInputFile, [in] BSTR bsFileDst);

	[id(10000 + 6)] HRESULT SetThemesDir([in] BSTR bsThemesPath);
};


[coclass, uuid("5731F488-94FF-44b7-8A3E-54CBB746F5B1"), event_source(com), threading(apartment), vi_progid("AVSOfficePPTXFile.OfficePPTXFile"), progid("AVSOfficePPTXFile.OfficePPTXFile.1"), version(1.0), registration_script("control.rgs")]
class ATL_NO_VTABLE CAVSOfficePPTXFile 
	:	public IAVSOfficePPTXFile
	,	public IAVSOfficePPTXFile2
	,	public PPTX::IPPTXEvent
{
private:
	OfficeUtils::IOfficeUtils*		m_pOfficeUtils;
	PPTX::Folder*					m_pFolder;
	CStringW						m_strTempDir;
	CString							m_strDirectory;

	
	CString		m_strFontDirectory;
	CString		m_strMediaDirectory;
	BOOL		m_bIsUseSystemFonts;
	CString		m_strEmbeddedFontsDirectory;

	CString		m_strFolderThemes;

	CGdiPlusInit m_oInit;

public:

	__event __interface _IAVSOfficeFileTemplateEvents2;
	CAVSOfficePPTXFile()
	{
		WCHAR buffer[4096];
		GetTempPathW(4096, buffer);
		m_strTempDir = CStringW(buffer);
		GetLongPathNameW(m_strTempDir.GetString(), buffer, 4096);
		m_strTempDir = CStringW(buffer) + CStringW("_PPTX\\");

		
		m_strFontDirectory = _T("");
		m_strMediaDirectory = _T("");
		m_bIsUseSystemFonts = FALSE;
		m_strEmbeddedFontsDirectory = _T("");

		m_strFolderThemes = _T("");
	}

	~CAVSOfficePPTXFile()
	{
	}

	DECLARE_PROTECT_FINAL_CONSTRUCT()

	HRESULT FinalConstruct()
	{
		m_pFolder		= NULL;
		m_pOfficeUtils	= NULL;

		if (S_OK != CoCreateInstance(__uuidof(OfficeUtils::COfficeUtils), NULL, CLSCTX_INPROC_SERVER, __uuidof(OfficeUtils::IOfficeUtils),(void**)&m_pOfficeUtils))
			return S_FALSE;

		m_oInit.Init();
		return S_OK;
	}

	void FinalRelease()
	{
		RELEASEINTERFACE(m_pOfficeUtils);
		RELEASEOBJECT(m_pFolder);
	}

public:
	HRESULT LoadFromFile(BSTR sSrcFileName, BSTR sDstPath, BSTR sXMLOptions)
	{
		CStringW localTempDir(sDstPath);
		if((sDstPath != NULL) || (localTempDir != ""))
		{
			int res = SHCreateDirectoryExW(NULL, localTempDir.GetString(), NULL);
			if((res != ERROR_SUCCESS) && (res != ERROR_ALREADY_EXISTS) && (res != ERROR_FILE_EXISTS))
				return S_FALSE;
			put_TempDirectory(sDstPath);
		}
		else
		{
			int res = SHCreateDirectoryExW(NULL, m_strTempDir, NULL);
			if((res != ERROR_SUCCESS) && (res != ERROR_ALREADY_EXISTS) && (res != ERROR_FILE_EXISTS))
				return S_FALSE;
		}
		localTempDir = m_strTempDir;

		

		if(m_pOfficeUtils == NULL)
			return S_FALSE;

		BSTR bsParam = localTempDir.AllocSysString();
		HRESULT hr = m_pOfficeUtils->ExtractToDirectory( sSrcFileName, bsParam, NULL, 0);
		SysFreeString(bsParam);
		if(hr != S_OK)
			return hr;

		RELEASEOBJECT(m_pFolder);
		m_pFolder = new PPTX::Folder();

		if(!m_pFolder->isValid(localTempDir))
		{
			RELEASEOBJECT(m_pFolder);
			return S_FALSE;
		}
		m_pFolder->read(localTempDir, (PPTX::IPPTXEvent*)this);
		if(GetPercent() < 1000000)
		{
			RELEASEOBJECT(m_pFolder);
			return S_FALSE;
		}
		smart_ptr<PPTX::Presentation> presentation = m_pFolder->get(OOX::FileTypes::Presentation).smart_dynamic_cast<PPTX::Presentation>();
		if (!presentation.is_init())
		{
			RemoveDirOrFile(m_strTempDir, false);
			return S_FALSE;
		}

		m_strDirectory = (CString)sSrcFileName;
		int nIndex = m_strDirectory.ReverseFind(TCHAR('\\'));
		if (-1 != nIndex)
			m_strDirectory = m_strDirectory.Mid(0, nIndex);

		return S_OK;
	}
public:
	HRESULT SaveToFile(BSTR sDstFileName, BSTR sSrcPath, BSTR sXMLOptions)
	{
		if (NULL == m_pFolder)
			return S_FALSE;

		OOX::CPath oPath;
		oPath.m_strFilename = CString(sSrcPath);
		m_pFolder->write(oPath);

		return m_pOfficeUtils->CompressFileOrDirectory( sSrcPath, sDstFileName, -1 );
	}

public:
	STDMETHOD(get_TempDirectory)(BSTR* pVal)
	{
		*pVal = m_strTempDir.AllocSysString();
		return S_OK;
	}
	STDMETHOD(put_TempDirectory)(BSTR newVal)
	{
		CStringW TempStr(newVal);
		if(PathIsDirectoryW(TempStr.GetString()))
		{
			if(TempStr.Right(1) != L"\\")
				TempStr += L"\\";
			m_strTempDir = TempStr;
			return S_OK;
		}
		return S_FALSE;
	}
public:
	STDMETHOD(GetDVDXml)(BSTR* pbstrPTTXml)
	{
		return S_OK;
	}
	STDMETHOD(GetBluRayXml)(BSTR* pbstrDVDXml)
	{
		return S_OK;
	}
public:
	STDMETHOD(get_DrawingXml)(BSTR* pVal)
	{
		if ((NULL == m_pFolder) || (NULL == pVal))
			return S_FALSE;

		return S_OK;
	}

	STDMETHOD(SetAdditionalParam)(BSTR ParamName, VARIANT ParamValue)
	{
		CString sParamName; sParamName = ParamName;
		if (_T("EmbeddedFontsDirectory") == sParamName && ParamValue.vt == VT_BSTR)
		{		
			m_strEmbeddedFontsDirectory = ParamValue.bstrVal;
			return S_OK;
		}		
		return S_OK;
	}

	STDMETHOD(GetAdditionalParam)(BSTR ParamName, VARIANT* ParamValue)
	{
		if (NULL == ParamValue)
			return S_FALSE;

		return S_OK;
	}

	virtual bool Progress(long ID, long Percent)
	{
		SHORT res = 0;
		percent = Percent;
		OnProgressEx(ID, Percent, &res);
		return (res != 0);
	}

	
	STDMETHOD(SetMediaDir)(BSTR bsMediaDir) 
	{
		m_strMediaDirectory = bsMediaDir;
		return S_OK;
	}
	STDMETHOD(SetFontDir)(BSTR bsFontDir)
	{
		m_strFontDirectory = bsFontDir;
		return S_OK;
	}
	STDMETHOD(SetThemesDir)(BSTR bsDir)
	{
		m_strFolderThemes = bsDir;
		return S_OK;
	}
	STDMETHOD(SetUseSystemFonts)(VARIANT_BOOL useSystemFonts) 
	{
		m_bIsUseSystemFonts = (VARIANT_TRUE == useSystemFonts);
		return S_OK;
	}
	STDMETHOD(OpenFileToPPTY)(BSTR bsInput, BSTR bsOutput)
	{
		int res = SHCreateDirectoryExW(NULL, m_strTempDir, NULL);
		if((res != ERROR_SUCCESS) && (res != ERROR_ALREADY_EXISTS) && (res != ERROR_FILE_EXISTS))
			return S_FALSE;

		if (m_pOfficeUtils == NULL)
			return S_FALSE;

		BSTR localTempDir = m_strTempDir.AllocSysString();
		HRESULT hr = m_pOfficeUtils->ExtractToDirectory(bsInput, localTempDir, NULL, 0);
		if(hr != S_OK)
			return hr;

		SysFreeString(localTempDir);

		RELEASEOBJECT(m_pFolder);
		m_pFolder = new PPTX::Folder();

		if (!m_pFolder->isValid(m_strTempDir))
		{
			RELEASEOBJECT(m_pFolder);
			return S_FALSE;
		}
		m_pFolder->read(m_strTempDir, (PPTX::IPPTXEvent*)this);
		if(GetPercent() < 1000000)
		{
			RELEASEOBJECT(m_pFolder);
			return S_FALSE;
		}
		smart_ptr<PPTX::Presentation> presentation = m_pFolder->get(OOX::FileTypes::Presentation).smart_dynamic_cast<PPTX::Presentation>();
		if (!presentation.is_init())
		{
			RemoveDirOrFile(m_strTempDir, false);
			return S_FALSE;
		}

		m_strDirectory = (CString)bsInput;
		int nIndex = m_strDirectory.ReverseFind(TCHAR('\\'));
		if (-1 != nIndex)
			m_strDirectory = m_strDirectory.Mid(0, nIndex);

		NSBinPptxRW::CBinaryFileWriter oBinaryWriter;
		oBinaryWriter.m_oCommon.CheckFontPicker();
		oBinaryWriter.m_oCommon.m_pNativePicker->Init(m_strFontDirectory);

		CString sDstFileOutput = bsOutput;
		m_strMediaDirectory = sDstFileOutput;
		nIndex = m_strMediaDirectory.ReverseFind(TCHAR('\\'));
		if (-1 != nIndex)
			m_strMediaDirectory = m_strMediaDirectory.Mid(0, nIndex);

		oBinaryWriter.m_strMainFolder = m_strMediaDirectory;
		m_strMediaDirectory = m_strMediaDirectory + _T("\\media");
		oBinaryWriter.m_oCommon.m_oImageManager.m_strDstMedia = m_strMediaDirectory;

		CDirectory::CreateDirectory(m_strMediaDirectory);
		
		if (_T("") != m_strEmbeddedFontsDirectory)
		{
			CDirectory::CreateDirectory(m_strEmbeddedFontsDirectory);

			if (NULL != oBinaryWriter.m_oCommon.m_pFontPicker)
			{
				oBinaryWriter.m_oCommon.m_pNativePicker->m_bIsEmbeddedFonts = TRUE;
				oBinaryWriter.m_oCommon.m_pNativePicker->m_oEmbeddedFonts.m_strEmbeddedFontsFolder = m_strEmbeddedFontsDirectory;
			}
		}
		
		PPTX2EditorAdvanced::Convert(oBinaryWriter, *m_pFolder, m_strDirectory, sDstFileOutput);

		return S_OK;

	}
	STDMETHOD(OpenDirectoryToPPTY)(BSTR bsInput, BSTR bsOutput)
	{
		RELEASEOBJECT(m_pFolder);
		m_pFolder = new PPTX::Folder();

		if (!m_pFolder->isValid((CString)bsInput))
		{
			RELEASEOBJECT(m_pFolder);
			return S_FALSE;
		}

		m_pFolder->read((CString)bsInput, (PPTX::IPPTXEvent*)this);
		if(GetPercent() < 1000000)
		{
			RELEASEOBJECT(m_pFolder);
			return S_FALSE;
		}
		smart_ptr<PPTX::Presentation> presentation = m_pFolder->get(OOX::FileTypes::Presentation).smart_dynamic_cast<PPTX::Presentation>();
		if (!presentation.is_init())
		{
			RemoveDirOrFile(m_strTempDir, false);
			return S_FALSE;
		}

		m_strDirectory = (CString)bsInput;
		int nIndex = m_strDirectory.ReverseFind(TCHAR('\\'));
		if (-1 != nIndex)
			m_strDirectory = m_strDirectory.Mid(0, nIndex);

		NSBinPptxRW::CBinaryFileWriter oBinaryWriter;
		oBinaryWriter.m_oCommon.CheckFontPicker();
		oBinaryWriter.m_oCommon.m_pNativePicker->Init(m_strFontDirectory);

		CString sDstFileOutput = (CString)bsOutput;
		m_strMediaDirectory = sDstFileOutput;
		nIndex = m_strMediaDirectory.ReverseFind(TCHAR('\\'));
		if (-1 != nIndex)
			m_strMediaDirectory = m_strMediaDirectory.Mid(0, nIndex);

		oBinaryWriter.m_strMainFolder = m_strMediaDirectory;
		m_strMediaDirectory = m_strMediaDirectory + _T("\\media");
		oBinaryWriter.m_oCommon.m_oImageManager.m_strDstMedia = m_strMediaDirectory;

		CDirectory::CreateDirectory(m_strMediaDirectory);
		
		PPTX2EditorAdvanced::Convert(oBinaryWriter, *m_pFolder, m_strDirectory, sDstFileOutput);

		return S_OK;
	}

	STDMETHOD(ConvertPPTYToPPTX)(BSTR bsInput, BSTR bsOutput)
	{
#ifdef _DEBUG
		m_strTempDir = _T("C:\\PPTMemory\\PPTX_test");
#endif

		int len = m_strTempDir.GetLength();
		while (len != 0 && m_strTempDir[len - 1] == (TCHAR)'\\')
		{
			m_strTempDir.Delete(len - 1);
			--len;
		}

		NSBinPptxRW::CPPTXWriter oWriter;
		oWriter.Init(m_strTempDir);
		
		CFile oFileBinary;
		oFileBinary.OpenFile((CString)bsInput);
		LONG lFileSize = (LONG)oFileBinary.GetFileSize();
		BYTE* pSrcBuffer = new BYTE[lFileSize];
		oFileBinary.ReadFile(pSrcBuffer, (DWORD)lFileSize);
		oFileBinary.CloseFile();
		CString srcFolder = CDirectory::GetFolderPath((CString)bsInput);
		oWriter.OpenPPTY(pSrcBuffer, lFileSize, srcFolder, m_strFolderThemes);
		RELEASEARRAYOBJECTS(pSrcBuffer);

		BSTR bsInput2 = m_strTempDir.AllocSysString();
		HRESULT hRes = m_pOfficeUtils->CompressFileOrDirectory(bsInput2, bsOutput, -1 );
		SysFreeString(bsInput2);

		
		RemoveDirOrFile(m_strTempDir);

		return hRes;
	}

private:

	INT32 RemoveDirOrFile(CString sPath, bool bIsRemoveHead = true)
	{
		DWORD dwFileAttrib = ::GetFileAttributes( sPath );
		if(  dwFileAttrib != INVALID_FILE_ATTRIBUTES )
		{
			DWORD dwResult = 0;
			if( 0 != (FILE_ATTRIBUTE_DIRECTORY & dwFileAttrib) )
			{
				HANDLE Handle;
				WIN32_FIND_DATA FindData;
				DWORDLONG Result = 0;

				Handle = FindFirstFile( ( sPath + _T("\\*.*") ), &FindData );
				if ( Handle == INVALID_HANDLE_VALUE )
					return 0;
				do
				{
					BOOL bRes = TRUE;
					if( ( CString( FindData.cFileName ) != _T(".") ) && ( CString( FindData.cFileName ) != _T("..") ) )
						if( FindData.dwFileAttributes & FILE_ATTRIBUTE_DIRECTORY )
							Result += RemoveDirOrFile( sPath + _T("\\") + FindData.cFileName ); 
						else
							bRes = DeleteFile( sPath + _T("\\") + FindData.cFileName );
					if( FALSE == bRes )
						dwResult += 1;
				}
				while( FindNextFile( Handle, &FindData ) != 0 );
				FindClose( Handle );

				if (bIsRemoveHead)
				{
					BOOL bRes = RemoveDirectory( sPath );
					if( FALSE == bRes )
						dwResult += 1;
				}
			}
			else
			{
				if( FALSE == DeleteFile( sPath ) )
					dwResult = 1;
			}

			return dwResult;
		}
		return 0;
	}
};
