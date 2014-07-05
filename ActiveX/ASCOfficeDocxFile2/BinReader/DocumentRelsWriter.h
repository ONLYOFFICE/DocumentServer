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
	class DocumentRelsWriter
	{
		CStringWriter m_oWriter;
		CString	m_sDir;
		int m_nRid;
		CAtlArray<CString> m_aRels;
		bool bDocumentRels;
	public:
		DocumentRelsWriter(CString sDir, bool bDocumentRels, int nRid = 1):m_sDir(sDir),bDocumentRels(bDocumentRels)
		{
			m_nRid = nRid;
		}
		void Write(CString sFileName)
		{
			CString s_dr_Start;
			CString s_dr_End;
			if(true == bDocumentRels)
			{
				s_dr_Start = _T("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><Relationships xmlns=\"http://schemas.openxmlformats.org/package/2006/relationships\"><Relationship Id=\"rId1\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles\" Target=\"styles.xml\"/><Relationship Id=\"rId3\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings\" Target=\"settings.xml\"/><Relationship Id=\"rId4\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/webSettings\" Target=\"webSettings.xml\"/><Relationship Id=\"rId5\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/fontTable\" Target=\"fontTable.xml\"/><Relationship Id=\"rId6\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme\" Target=\"theme/theme1.xml\"/>");
				s_dr_End = _T("</Relationships>");
			}
			else
			{
				s_dr_Start = _T("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><Relationships xmlns=\"http://schemas.openxmlformats.org/package/2006/relationships\">");
				s_dr_End = _T("</Relationships>");
			}
			if(m_nRid > 1)
			{
				m_oWriter.WriteString(s_dr_Start);
				for(int i = 0, length = m_aRels.GetCount(); i < length; ++i)
				{
					m_oWriter.WriteString(m_aRels[i]);
				}
				m_oWriter.WriteString(s_dr_End);

				CFile oFile;
				oFile.CreateFile(m_sDir + _T("\\word\\_rels\\") + sFileName);
				oFile.WriteStringUTF8(m_oWriter.GetData());
				oFile.CloseFile();
			}
		}
		CString AddRels(CString sType, CString sTarget, bool bExternal = false)
		{
			CorrectString(sType);
			CorrectString(sTarget);
			CString srId;srId.Format(_T("rId%d"), m_nRid);
			CString sRels;
			if(bExternal)
				sRels.Format(_T("<Relationship Id=\"%s\" Type=\"%s\" Target=\"%s\" TargetMode=\"External\"/>"), srId, sType, sTarget);
			else
				sRels.Format(_T("<Relationship Id=\"%s\" Type=\"%s\" Target=\"%s\"/>"), srId, sType, sTarget);
			m_nRid++;
			m_aRels.Add(sRels);
			return srId;
		}
	};
}