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
#include "Common.h"

namespace Writers
{
	static CString g_string_set_Start = _T("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\" ?><w:settings xmlns:w=\"http://schemas.openxmlformats.org/wordprocessingml/2006/main\" xmlns:m=\"http://schemas.openxmlformats.org/officeDocument/2006/math\" xmlns:o=\"urn:schemas-microsoft-com:office:office\" xmlns:v=\"urn:schemas-microsoft-com:vml\">");
	static CString g_string_set_Default = _T("<w:zoom w:percent=\"100\"/><w:characterSpacingControl w:val=\"doNotCompress\"/><w:compat><w:compatSetting w:name=\"compatibilityMode\" w:uri=\"http://schemas.microsoft.com/office/word\" w:val=\"14\"/><w:compatSetting w:name=\"overrideTableStyleFontSizeAndJustification\" w:uri=\"http://schemas.microsoft.com/office/word\" w:val=\"1\"/><w:compatSetting w:name=\"enableOpenTypeFeatures\" w:uri=\"http://schemas.microsoft.com/office/word\" w:val=\"1\"/><w:compatSetting w:name=\"doNotFlipMirrorIndents\" w:uri=\"http://schemas.microsoft.com/office/word\" w:val=\"1\"/></w:compat><w:themeFontLang w:val=\"en-US\" w:eastAsia=\"zh-CN\"/><w:shapeDefaults><o:shapedefaults v:ext=\"edit\" spidmax=\"1026\"/><o:shapelayout v:ext=\"edit\"><o:idmap v:ext=\"edit\" data=\"1\"/></o:shapelayout></w:shapeDefaults><w:decimalSymbol w:val=\".\"/><w:listSeparator w:val=\",\"/>");
	static CString g_string_set_End = _T("</w:settings>");

	class SettingWriter
	{
		CString m_sDir;
		CStringWriter	m_oSettingWriter;
		HeaderFooterWriter& m_oHeaderFooterWriter;
	public:
		SettingWriter(CString sDir, HeaderFooterWriter& oHeaderFooterWriter):m_sDir(sDir),m_oHeaderFooterWriter(oHeaderFooterWriter)
		{
		}
		void Write()
		{
			Prepare();
			CFile oFile;
			oFile.CreateFile(m_sDir + _T("\\word\\settings.xml"));
			oFile.WriteStringUTF8(g_string_set_Start);
			oFile.WriteStringUTF8(m_oSettingWriter.GetData());
			oFile.WriteStringUTF8(g_string_set_Default);
			oFile.WriteStringUTF8(g_string_set_End);
			oFile.CloseFile();
		}
		
		void AddSetting(CString sSetting)
		{
			m_oSettingWriter.WriteString(sSetting);
		}
		void Prepare()
		{
			bool bevenAndOddHeaders = false;
			if(!m_oHeaderFooterWriter.m_oHeaderEven.rId.IsEmpty())
				bevenAndOddHeaders = true;
			if(!m_oHeaderFooterWriter.m_oFooterEven.rId.IsEmpty())
				bevenAndOddHeaders = true;
			if(bevenAndOddHeaders)
				AddSetting(_T("<w:evenAndOddHeaders/>"));
		}
	};
}