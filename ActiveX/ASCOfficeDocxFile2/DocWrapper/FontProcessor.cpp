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
#include "FontProcessor.h"

#include "../../Common/ASCUtils.h"
#include "Foreign/StringWriter.h"

using SimpleTypes::EPitch;

namespace DocWrapper {
	
	bool FontProcessor::useSystemFonts = false;
	
	FontProcessor::FontProcessor() 
			: fontManager(NULL) {}
	FontProcessor::~FontProcessor() {
		RELEASEINTERFACE(fontManager);
	}
	
	void FontProcessor::setFontDir(const CString& fontDir) {
		this->fontDir = fontDir;
		initFontManager();
	}
	void FontProcessor::setFontTable(OOX::CFontTable* fontTable) {
		for (int i = 0; i < fontTable->m_arrFonts.GetSize(); ++i)
			addToFontMap(fontTable->m_arrFonts[i]);
	}
	
	CString FontProcessor::getFont(const CString& name) {
		CString fontName = _T("Arial");
		if (fontMap.find(name) != fontMap.end())
			fontName = fontMap[name];
		else
		{
			OOX::CFont font;
			font.m_sName = name;
			addToFontMap(font);
			if (fontMap.find(name) != fontMap.end())
				fontName = fontMap[name];
		}
		return fontName;
	}
	void FontProcessor::getFonts(CAtlArray<CString>& fonts) {
		fonts.RemoveAll();
		std::map<CString, CString>::iterator it = fontMap.begin();
		for (; it != fontMap.end(); ++it) {
			bool contains = false;
			for (int i = 0; i < (int) fonts.GetCount(); ++i)
				if (fonts[i] == it->second) {
					contains = true;
					break;
				}
			if (!contains)
				fonts.Add(it->second);
		}
	}
	
	void FontProcessor::initFontManager() {
		RELEASEINTERFACE(fontManager);

		fontManager = NULL;
		CoInitialize(NULL);
		CoCreateInstance(ASCGraphics::CLSID_CASCFontManager, NULL, CLSCTX_ALL, __uuidof(ASCGraphics::IASCFontManager), (void**) &fontManager);

		VARIANT var;
		var.vt = VT_BSTR;
		var.bstrVal = fontDir.AllocSysString();
		fontManager->SetAdditionalParam(L"InitializeFromFolder", var);
		RELEASESYSSTRING(var.bstrVal);

		if (useSystemFonts) {
			CString options = _T("<FontManagerOptions><FontDir path='") + fontDir + _T("' /></FontManagerOptions>");
			BSTR bsOptions = options.AllocSysString();


#ifdef BUILD_CONFIG_OPENSOURCE_VERSION
			fontManager->Init(bsOptions, VARIANT_TRUE, VARIANT_FALSE);
#else
			fontManager->Initialize(bsOptions);
#endif


			SysFreeString(bsOptions);
		}

#ifdef BUILD_CONFIG_FULL_VERSION
		CString defaultFontName = _T("Arial");
		BSTR defFontName = defaultFontName.AllocSysString();
		fontManager->SetDefaultFont(defFontName);
		SysFreeString(defFontName);
#endif
	}
	void FontProcessor::addToFontMap(OOX::CFont& font) {
		CStringWriter parw;
		parw.WriteString(CString(_T("<FontProperties>")));
		if(font.m_oCharset.IsInit())
		{
			SimpleTypes::EFontCharset eCharset = font.m_oCharset->GetValue();
			
			if(SimpleTypes::fontcharsetANSI != eCharset && SimpleTypes::fontcharsetDefault != eCharset)
				parw.WriteString(_T("<Charset value='") + font.m_oCharset->ToString() + _T("'/>"));
		}
		if(font.m_sName.IsEmpty())
			parw.WriteString(CString(_T("<Name value='Arial'/>")));
		else
		{
			CString sName = font.m_sName;
			ToXmlString(sName);
			parw.WriteString(_T("<Name value='")+ sName + _T("'/>"));
		}
		if (font.m_oAltName.IsInit())
		{
			CString sAltName = *font.m_oAltName;
			ToXmlString(sAltName);
			parw.WriteString(_T("<AltName value='") + sAltName + _T("'/>"));
		}
		parw.WriteString(_T("<FamilyClass name='") + font.m_oFamily.ToString() + _T("'/>"));
		if(font.m_oPanose.IsInit())
			parw.WriteString(_T("<Panose value='") + font.m_oPanose->ToString() + _T("'/>"));
		if (font.m_oPitch.GetValue() == SimpleTypes::pitchFixed)
			parw.WriteString(CString(_T("<FixedWidth value='1'/>")));
		else
			parw.WriteString(CString(_T("<FixedWidth value='0'/>")));
		parw.WriteString(CString(_T("<UnicodeRange ")));
		if (font.m_oUsb0.IsInit())
			parw.WriteString(_T("range1='") + font.m_oUsb0->ToString() + _T("' "));
		if (font.m_oUsb1.IsInit())
			parw.WriteString(_T("range2='") + font.m_oUsb1->ToString() + _T("' "));
		if (font.m_oUsb2.IsInit())
			parw.WriteString(_T("range3='") + font.m_oUsb2->ToString() + _T("' "));
		if (font.m_oUsb3.IsInit())
			parw.WriteString(_T("range4='") + font.m_oUsb3->ToString() + _T("' "));
		if (font.m_oCsb0.IsInit())
			parw.WriteString(_T("coderange1='") + font.m_oCsb0->ToString() + _T("' "));
		if (font.m_oCsb1.IsInit())
			parw.WriteString(_T("coderange2='") + font.m_oCsb1->ToString() + _T("' "));
		parw.WriteString(CString(_T("/>")));
		parw.WriteString(CString(_T("</FontProperties>")));
		CString params = parw.GetData();
		
		BSTR fontPath = NULL;
		BSTR familyName = NULL;
		long index = 0;
		BSTR bstrParams = params.AllocSysString();

#ifdef BUILD_CONFIG_OPENSOURCE_VERSION
		fontManager->GetWinFontByParams(bstrParams, &familyName, &fontPath, NULL, &index);
#else
		fontManager->GetWinFontByParams(bstrParams, &fontPath, &index);
		int status = fontManager->LoadFontFromFile(fontPath, 12, 72, 72, index);
		SysFreeString(fontPath);
		
		fontManager->GetFamilyName(&familyName);		
#endif

		CString resFontName = familyName;

		SysFreeString(bstrParams);
		SysFreeString(fontPath);
		SysFreeString(familyName);

		fontMap[font.m_sName] = resFontName;
	}
	
	bool FontProcessor::checkRange(OOX::CFont& font) {
		return true;
		
	}
	void FontProcessor::ToXmlString(CString& strVal)
	{
		strVal.Replace(L"&",	L"&amp;");
		strVal.Replace(L"'",	L"&apos;");
		strVal.Replace(L"<",	L"&lt;");
		strVal.Replace(L">",	L"&gt;");
		strVal.Replace(L"\"",	L"&quot;");
	}
	
}