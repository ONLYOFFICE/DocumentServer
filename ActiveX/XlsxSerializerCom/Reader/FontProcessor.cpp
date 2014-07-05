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
 #include "FontProcessor.h"

namespace XlsxReader {
		
	FontProcessor::FontProcessor() 
			: m_pFontManager(NULL) {}

	FontProcessor::~FontProcessor() {
		RELEASEINTERFACE(m_pFontManager);
	}
	
	void FontProcessor::setFontDir(const CString& fontDir) {
		this->m_sFontDir = fontDir;
		initFontManager();
	}
	void FontProcessor::setFontTable(const OOX::Spreadsheet::CFonts& oFonts) {
		for (int i = 0, length = oFonts.m_arrItems.GetSize(); i < length; ++i)
		{
			OOX::Spreadsheet::WritingElement* we = oFonts.m_arrItems[i];
			if(OOX::Spreadsheet::et_Font == we->getType())
			{
				OOX::Spreadsheet::CFont* pFont = static_cast<OOX::Spreadsheet::CFont*>(we);
				if(NULL != pFont)
					addToFontMap(pFont);
			}
		}
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
	
	void FontProcessor::initFontManager() {
		RELEASEINTERFACE(m_pFontManager);
		CoCreateInstance(__uuidof(AVSGraphics::CAVSFontManager), NULL, CLSCTX_ALL, __uuidof(AVSGraphics::IAVSFontManager), (void**) &m_pFontManager);

		VARIANT var;
		var.vt = VT_BSTR;
		var.bstrVal = m_sFontDir.AllocSysString();
		m_pFontManager->SetAdditionalParam(L"InitializeFromFolder", var);
		RELEASESYSSTRING(var.bstrVal);

		CString defaultFontName = _T("Arial");
		BSTR defFontName = defaultFontName.AllocSysString();
		fontManager->SetDefaultFont(defFontName);
		SysFreeString(defFontName);
	}

	void FontProcessor::addToFontMap(OOX::Spreadsheet::CFont* pFont) {
		CString parw;
		parw += _T("<FontProperties>");
		if(pFont->m_oCharset.IsInit() && pFont->m_oCharset->m_oCharset.IsInit())
		{
			SimpleTypes::EFontCharset eCharset = pFont->m_oCharset->m_oCharset->GetValue();
			
			if(SimpleTypes::fontcharsetANSI !=  eCharset && SimpleTypes::fontcharsetDefault != eCharset)
				parw += _T("<Charset value='") + pFont->m_oCharset->m_oCharset->ToHexString() + _T("'/>");
		}
		CString sFontName;
		if(pFont->m_oRFont.IsInit())
			sFontName = pFont->m_oRFont->ToString2();
		if(sFontName.IsEmpty())
			parw += _T("<Name value='") + CString(gc_sNoNameFont) + _T("'/>");
		else
		{
			
			parw += _T("<Name value='")+ sFontName + _T("'/>");
		}
		if(pFont->m_oScheme->m_oFontScheme.IsInit())
		{
		}
		parw += _T("<FamilyClass name='") + font.m_oFamily.ToString() + _T("'/>");
		if(font.m_oPanose.IsInit())
			parw += _T("<Panose value='") + font.m_oPanose->ToString() + _T("'/>");
		if (font.m_oPitch.GetValue() == SimpleTypes::pitchFixed)
			parw += _T("<FixedWidth value='1'/>");
		else
			parw += _T("<FixedWidth value='0'/>");
		parw += _T("<UnicodeRange ");
		if (font.m_oUsb0.IsInit())
			parw += _T("range1='") + font.m_oUsb0->ToString() + _T("' ");
		if (font.m_oUsb1.IsInit())
			parw += _T("range2='") + font.m_oUsb1->ToString() + _T("' ");
		if (font.m_oUsb2.IsInit())
			parw += _T("range3='") + font.m_oUsb2->ToString() + _T("' ");
		if (font.m_oUsb3.IsInit())
			parw += _T("range4='") + font.m_oUsb3->ToString() + _T("' ");
		if (font.m_oCsb0.IsInit())
			parw += _T("coderange1='") + font.m_oCsb0->ToString() + _T("' ");
		if (font.m_oCsb1.IsInit())
			parw += _T("coderange2='") + font.m_oCsb1->ToString() + _T("' ");
		parw += _T("/>");
		parw += _T("</FontProperties>");
		CString params = parw.GetCString();
		
		BSTR fontPath;
		long index = 0;
		BSTR bstrParams = params.AllocSysString();
		fontManager->GetWinFontByParams(bstrParams, &fontPath, &index);
		SysFreeString(bstrParams);
		int status = fontManager->LoadFontFromFile(fontPath, 12, 72, 72, index);
		SysFreeString(fontPath);

		BSTR familyName;
		fontManager->GetFamilyName(&familyName);
		CString resFontName = familyName;
		SysFreeString(familyName);

		fontMap[font.m_sName] = resFontName;
	}	
}