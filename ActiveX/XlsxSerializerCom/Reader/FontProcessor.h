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
#include "../../Common/DocxFormat/Source/XlsxFormat/Styles/Fonts.h"

namespace BinXlsxRW {
	static TCHAR* gc_sNoNameFont = _T("NoNameFont");
	static TCHAR* gc_sDefaultFontName = _T("Arial");

	class FontProcessor {
		ASCGraphics::IASCFontManager* m_pFontManager;
		CAtlMap<CString, CString> m_mapFontMap;

		CString m_sFontDir;

	public:
		FontProcessor():m_pFontManager(NULL){}
		~FontProcessor()
		{
			RELEASEINTERFACE(m_pFontManager);
		}

		void setFontDir(const CString& fontDir)
		{
			this->m_sFontDir = fontDir;
			initFontManager();
		}
		CString getFontDir()
		{
			return this->m_sFontDir;
		}
		void setFontTable(const OOX::Spreadsheet::CFonts& oFonts)
		{
			for (int i = 0, length = oFonts.m_arrItems.GetSize(); i < length; ++i)
			{
					OOX::Spreadsheet::CFont* pFont = oFonts.m_arrItems[i];
					if(NULL != pFont)
						addToFontMap(*pFont);
			}
		}
		ASCGraphics::IASCFontManager* getFontManager()
		{
			return m_pFontManager;
		}
		CString getFont(const CString& name)
		{
			CString fontName = gc_sDefaultFontName;
			CAtlMap<CString, CString>::CPair* pPair = m_mapFontMap.Lookup( name );
			if ( NULL == pPair )
			{
				if(!name.IsEmpty())
				{
					OOX::Spreadsheet::CFont oFont;
					oFont.m_oRFont.Init();
					oFont.m_oRFont->m_sVal = name;
					addToFontMap(oFont);
					pPair = m_mapFontMap.Lookup( name );
					if (NULL != pPair)
						fontName = pPair->m_value;
				}
			}
			else
				fontName = pPair->m_value;
			return fontName;
		}		
	private:
		void initFontManager()
		{
			RELEASEINTERFACE(m_pFontManager);
			CoCreateInstance(ASCGraphics::CLSID_CASCFontManager, NULL, CLSCTX_ALL, ASCGraphics::IID_IASCFontManager, (void**) &m_pFontManager);

			VARIANT var;
			var.vt = VT_BSTR;
			var.bstrVal = m_sFontDir.AllocSysString();
			m_pFontManager->SetAdditionalParam(L"InitializeFromFolder", var);
			RELEASESYSSTRING(var.bstrVal);

#ifdef BUILD_CONFIG_FULL_VERSION
			CString defaultFontName = gc_sDefaultFontName;
			BSTR defFontName = defaultFontName.AllocSysString();
			m_pFontManager->SetDefaultFont(defFontName);
			SysFreeString(defFontName);
#endif
		}

		void addToFontMap(OOX::Spreadsheet::CFont& font)
		{
			CString parw;
			parw += _T("<FontProperties>");
			if(font.m_oCharset.IsInit() && font.m_oCharset->m_oCharset.IsInit())
			{
				SimpleTypes::Spreadsheet::EFontCharset eCharset = font.m_oCharset->m_oCharset->GetValue();
				
				if(SimpleTypes::fontcharsetANSI !=  eCharset && SimpleTypes::fontcharsetDefault != eCharset)
					parw += _T("<Charset value='") + font.m_oCharset->m_oCharset->ToHexString() + _T("'/>");
			}
			CString sFontName;
			if(font.m_oScheme.IsInit() && font.m_oScheme->m_oFontScheme.IsInit())
			{
				
				const SimpleTypes::Spreadsheet::EFontScheme eFontScheme = font.m_oScheme->m_oFontScheme->GetValue();
				if(SimpleTypes::Spreadsheet::fontschemeNone != eFontScheme)
				{
					
				}
			}
			if(sFontName.IsEmpty() && font.m_oRFont.IsInit() && font.m_oRFont->m_sVal.IsInit())
				sFontName = font.m_oRFont->ToString2();
			if(sFontName.IsEmpty())
				parw += _T("<Name value='") + CString(gc_sNoNameFont) + _T("'/>");
			else
			{
				
				parw += _T("<Name value='")+ sFontName + _T("'/>");
			}
			if(font.m_oFamily.IsInit() && font.m_oFamily->m_oFontFamily.IsInit())
			{
				parw += _T("<FamilyClass name='") + font.m_oFamily->m_oFontFamily->ToString() + _T("'/>");
			}
			parw += _T("</FontProperties>");
			CString params = parw;

			BSTR fontPath;
			BSTR familyName;
			long index = 0;
			BSTR bstrParams = params.AllocSysString();

#ifdef BUILD_CONFIG_FULL_VERSION
			m_pFontManager->GetWinFontByParams(bstrParams, &fontPath, &index);
			int status = m_pFontManager->LoadFontFromFile(fontPath, 12, 72, 72, index);
			SysFreeString(fontPath);
			m_pFontManager->GetFamilyName(&familyName);
#else
			m_pFontManager->GetWinFontByParams(bstrParams, &familyName, &fontPath, NULL, &index);
#endif
			
			CString resFontName = familyName;
			SysFreeString(fontPath);
			SysFreeString(familyName);
			SysFreeString(bstrParams);

			m_mapFontMap.SetAt(sFontName, resFontName);
		}	
	};

}