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
	static CString g_string_ct_Start = _T("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><Types xmlns=\"http://schemas.openxmlformats.org/package/2006/content-types\">");
	static CString g_string_ct_Ext = _T("<Default Extension=\"bmp\" ContentType=\"image/bmp\"/><Default Extension=\"jpg\" ContentType=\"image/jpeg\"/><Default Extension=\"jpeg\" ContentType=\"image/jpeg\"/><Default Extension=\"jpe\" ContentType=\"image/jpeg\"/><Default Extension=\"png\" ContentType=\"image/png\"/><Default Extension=\"gif\" ContentType=\"image/gif\"/><Default Extension=\"emf\" ContentType=\"image/x-emf\"/><Default Extension=\"wmf\" ContentType=\"image/x-wmf\"/><Default Extension=\"rels\" ContentType=\"application/vnd.openxmlformats-package.relationships+xml\"/><Default Extension=\"xml\" ContentType=\"application/xml\"/>");
	static CString g_string_ct_Override = _T("<Override PartName=\"/word/document.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml\"/><Override PartName=\"/word/styles.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml\"/><Override PartName=\"/word/settings.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml\"/><Override PartName=\"/word/webSettings.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.wordprocessingml.webSettings+xml\"/><Override PartName=\"/word/fontTable.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.wordprocessingml.fontTable+xml\"/><Override PartName=\"/word/theme/theme1.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.theme+xml\"/><Override PartName=\"/docProps/core.xml\" ContentType=\"application/vnd.openxmlformats-package.core-properties+xml\"/><Override PartName=\"/docProps/app.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.extended-properties+xml\"/>");
	static CString g_string_ct_End = _T("</Types>");

	class ContentTypesWriter
	{
		CStringWriter	m_oWriter;
		CString	m_sDir;
		CStringWriter	m_oAdditional;
	public:
		ContentTypesWriter(CString sDir):m_sDir(sDir)
		{
		}
		void Write()
		{
			m_oWriter.WriteString(g_string_ct_Start);
			m_oWriter.WriteString(g_string_ct_Ext);
			m_oWriter.WriteString(g_string_ct_Override);
			m_oWriter.Write(m_oAdditional);
			m_oWriter.WriteString(g_string_ct_End);

			CFile oFile;
			oFile.CreateFile(m_sDir + _T("\\[Content_Types].xml"));
			oFile.WriteStringUTF8(m_oWriter.GetData());
			oFile.CloseFile();
		}
		void AddOverride(CString& PartName, CString& ContentType)
		{
			CString sOverride;sOverride.Format(_T("<Override PartName=\"%s\" ContentType=\"%s\"/>"),PartName , ContentType);
			m_oAdditional.WriteString(sOverride);
		}
		void AddOverrideRaw(CString& sXml)
		{
			m_oAdditional.WriteString(sXml);
		}
	};
}