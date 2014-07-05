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
#include "../stdafx.h"
#include "../../Common/DocxFormat/Source/SystemUtility/File.h"
#include "BinReaderWriterDefines.h"
#include "FontCutter.h"

namespace NSFontCutter
{
	class CFontDstManager
	{
	public:		
		CAtlMap<CString, CString> m_mapPicks;
		ASCGraphics::IASCFontManager* m_pFontManager;

		CString m_strFontsDir;

		BOOL					m_bIsEmbeddedFonts;
		CEmbeddedFontsManager	m_oEmbeddedFonts;

	public:
		CFontDstManager() : m_mapPicks()
		{
			m_strFontsDir = _T("");

			m_pFontManager = NULL;
			CoCreateInstance(ASCGraphics::CLSID_CASCFontManager, NULL, CLSCTX_ALL, ASCGraphics::IID_IASCFontManager, (void**)&m_pFontManager);

			m_bIsEmbeddedFonts = FALSE;
		}
		~CFontDstManager()
		{
			RELEASEINTERFACE(m_pFontManager);
		}

		void Init(const CString& strDir)
		{
			m_strFontsDir = strDir;

			if (_T("") != m_strFontsDir)
			{
				VARIANT var;
				var.vt = VT_BSTR;
				var.bstrVal = m_strFontsDir.AllocSysString();
				m_pFontManager->SetAdditionalParam(L"InitializeFromFolder", var);
				RELEASESYSSTRING(var.bstrVal);
			}
			else
			{
#ifdef BUILD_CONFIG_OPENSOURCE_VERSION
				m_pFontManager->Init(L"", VARIANT_TRUE, VARIANT_FALSE);
#else
				m_pFontManager->Initialize(L"");
#endif
			}

#ifdef BUILD_CONFIG_FULL_VERSION
			CString defaultFontName = _T("Arial");
			BSTR defFontName = defaultFontName.AllocSysString();
			m_pFontManager->SetDefaultFont(defFontName);
			SysFreeString(defFontName);
#endif
		}

		CString GetTypefacePickByName(const CString& strTypeface)
		{
			CString sFind = strTypeface;

			int nFindTh = sFind.Find(_T("+mj"));
			if (0 == nFindTh)
				return sFind;
			nFindTh = sFind.Find(_T("+mn"));
			if (0 == nFindTh)
				return sFind;

			if (_T("") == sFind)
			{
				sFind = _T("Arial");
			}

			CAtlMap<CString, CString>::CPair* pPair = m_mapPicks.Lookup(sFind);
			if (NULL != pPair)
				return pPair->m_value;

			CString sInputSave = sFind;

			sFind.Replace(_T("'"),	_T("&apos;"));
			sFind.Replace(_T("<"),	_T("&lt;"));
			sFind.Replace(_T(">"),	_T("&gt;"));
			sFind.Replace(_T("\""),	_T("&quot;"));
			sFind.Replace(_T("&"),	_T("&amp;"));

			CString strPick = _T("<FontProperties><Name value=\"") + sFind + _T("\"/></FontProperties>");

			BSTR bsResult = NULL;
			LONG lFontIndex = 0;
			BSTR bsInput = strPick.AllocSysString();
			
#ifdef BUILD_CONFIG_OPENSOURCE_VERSION
			m_pFontManager->GetWinFontByParams(bsInput, &bsResult, NULL, NULL, &lFontIndex);
#else
			m_pFontManager->GetWinFontByParams(bsInput, &bsResult, &lFontIndex);
			CString strPath = (CString)bsResult;

			m_pFontManager->LoadFontFromFile(bsResult, 12, 72, 72, lFontIndex);

			SysFreeString(bsInput);
			SysFreeString(bsResult);

			m_pFontManager->GetFamilyName(&bsResult);
#endif

			CString sRes = bsResult;

			SysFreeString(bsResult);

			if (m_bIsEmbeddedFonts)
				m_oEmbeddedFonts.CheckFont(sRes, m_pFontManager);

			m_mapPicks.SetAt(sInputSave, sRes);
			return sRes;
		}

		template<typename TTextFont>
		CString GetTypefacePick(TTextFont& textFont)
		{
			return GetTypefacePickByName(textFont.typeface);			
		}
	};
}


[object, uuid("5061C3D5-E67E-4bd8-8E32-BE2CFC2D112D"), dual, pointer_default(unique)]
__interface IOfficeFontPicker : IDispatch
{
	[id(1)] HRESULT Init([in] BSTR bsFontsDirectory);
	
	[propget, id(2)] HRESULT FontManager([out, retval] IUnknown** pVal);
	[propput, id(2)] HRESULT FontManager([in] IUnknown* newVal);

	[id(10)] HRESULT SetEmbeddedFontsDirectory([in] BSTR bsFontsDirectory);
	[id(11)] HRESULT SetEmbeddedFontsParam([in] LONG lParam);

	[id(20)] HRESULT CheckString([in] BSTR bsText);
	[id(21)] HRESULT CheckFont([in] BSTR bsFontName);

	[id(22)] HRESULT PickFont([in] LONG lParamType, [in] BSTR bsParams, [out, retval] BSTR* pDstName);

	[id(30)] HRESULT GetBinaryData([in] LONG lType, [out, satype("BYTE")] SAFEARRAY** ppBinaryArray);

	[id(50)] HRESULT SetAdditionalParam([in] BSTR ParamName, [in] VARIANT ParamValue);
	[id(51)] HRESULT GetAdditionalParam([in] BSTR ParamName, [out, retval] VARIANT* ParamValue);	
};


[coclass, uuid("C489E74B-FCAF-450f-A1CB-881CACB65501"), threading(apartment), vi_progid("Office.OfficeFontPicker"), progid("Office.Picker.1"), version(1.0), registration_script("control.rgs")]
class ATL_NO_VTABLE COfficeFontPicker 
	:	public IOfficeFontPicker	
{
private:
	NSFontCutter::CFontDstManager m_oPicker;

public:
	COfficeFontPicker()
	{
	}

	~COfficeFontPicker()
	{
	}

	DECLARE_PROTECT_FINAL_CONSTRUCT()

	HRESULT FinalConstruct()
	{		
		return S_OK;
	}

	void FinalRelease()
	{		
	}

public:
	
	STDMETHOD(Init)(BSTR bsFontsDirectory)
	{
		m_oPicker.Init((CString)bsFontsDirectory);
		return S_OK;
	}
	
	STDMETHOD(get_FontManager)(IUnknown** pVal)
	{
		if (NULL == pVal)
			return S_FALSE;

		*pVal = NULL;
		if (NULL == m_oPicker.m_pFontManager)
			return S_OK;

		m_oPicker.m_pFontManager->QueryInterface(IID_IUnknown, (void**)pVal);
		return S_OK;
	}
	STDMETHOD(put_FontManager)(IUnknown* newVal)
	{
		if (NULL == newVal)
			return S_OK;

		RELEASEINTERFACE((m_oPicker.m_pFontManager));
		newVal->QueryInterface(ASCGraphics::IID_IASCFontManager, (void**)&(m_oPicker.m_pFontManager));
		return S_OK;
	}

	STDMETHOD(SetEmbeddedFontsDirectory)(BSTR bsFontsDirectory)
	{
		m_oPicker.m_oEmbeddedFonts.m_strEmbeddedFontsFolder = (CString)bsFontsDirectory;
		return S_OK;
	}
	STDMETHOD(SetEmbeddedFontsParam)(LONG lParam)
	{
		switch (lParam)
		{
		case 0:
			m_oPicker.m_bIsEmbeddedFonts = FALSE;
			break;
		case 1:
			m_oPicker.m_bIsEmbeddedFonts = TRUE;
			break;
		default:
			break;
		}
		return S_OK;
	}

	STDMETHOD(CheckString)(BSTR bsText)
	{
		m_oPicker.m_oEmbeddedFonts.CheckString((CString)bsText);
		return S_OK;
	}
	STDMETHOD(CheckFont)(BSTR bsFontName)
	{
		m_oPicker.m_oEmbeddedFonts.CheckFont((CString)bsFontName, m_oPicker.m_pFontManager);
		return S_OK;
	}

	STDMETHOD(PickFont)(LONG lParamType, BSTR bsParams, BSTR* pDstName)
	{
		if (NULL == pDstName)
			return S_FALSE;

		if (0 == lParamType)
		{
			CString strResult = m_oPicker.GetTypefacePickByName((CString)bsParams);
			*pDstName = strResult.AllocSysString();
			return S_OK;
		}
		
		return S_OK;
	}

	STDMETHOD(GetBinaryData)(LONG lType, SAFEARRAY** ppBinaryArray);
	STDMETHOD(SetAdditionalParam)(BSTR ParamName, VARIANT ParamValue)
	{
		return S_OK;
	}
	STDMETHOD(GetAdditionalParam)(BSTR ParamName, VARIANT* ParamValue)
	{
		CString name = (CString)ParamName;
		if (name == _T("NativePicker"))
		{
			ParamValue->vt = VT_PTR;
			ParamValue->pvRecord = &m_oPicker;
		}
		else if (name == _T("NativeCutter"))
		{
			ParamValue->vt = VT_PTR;
			ParamValue->pvRecord = &m_oPicker.m_oEmbeddedFonts;
		}
		return S_OK;
	}
};