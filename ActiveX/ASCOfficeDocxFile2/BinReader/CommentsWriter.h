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
	static CString g_string_comment_Start = _T("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><w:comments xmlns:wpc=\"http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas\" xmlns:mc=\"http://schemas.openxmlformats.org/markup-compatibility/2006\" xmlns:o=\"urn:schemas-microsoft-com:office:office\" xmlns:r=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships\" xmlns:m=\"http://schemas.openxmlformats.org/officeDocument/2006/math\" xmlns:v=\"urn:schemas-microsoft-com:vml\" xmlns:wp14=\"http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing\" xmlns:wp=\"http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing\" xmlns:w10=\"urn:schemas-microsoft-com:office:word\" xmlns:w=\"http://schemas.openxmlformats.org/wordprocessingml/2006/main\" xmlns:w14=\"http://schemas.microsoft.com/office/word/2010/wordml\" xmlns:w15=\"http://schemas.microsoft.com/office/word/2012/wordml\" xmlns:wpg=\"http://schemas.microsoft.com/office/word/2010/wordprocessingGroup\" xmlns:wpi=\"http://schemas.microsoft.com/office/word/2010/wordprocessingInk\" xmlns:wne=\"http://schemas.microsoft.com/office/word/2006/wordml\" xmlns:wps=\"http://schemas.microsoft.com/office/word/2010/wordprocessingShape\" mc:Ignorable=\"w14 w15 wp14\">");
	static CString g_string_comment_End = _T("</w:comments>");
	static CString g_string_commentExt_Start = _T("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><w15:commentsEx xmlns:wpc=\"http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas\" xmlns:mc=\"http://schemas.openxmlformats.org/markup-compatibility/2006\" xmlns:o=\"urn:schemas-microsoft-com:office:office\" xmlns:r=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships\" xmlns:m=\"http://schemas.openxmlformats.org/officeDocument/2006/math\" xmlns:v=\"urn:schemas-microsoft-com:vml\" xmlns:wp14=\"http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing\" xmlns:wp=\"http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing\" xmlns:w10=\"urn:schemas-microsoft-com:office:word\" xmlns:w=\"http://schemas.openxmlformats.org/wordprocessingml/2006/main\" xmlns:w14=\"http://schemas.microsoft.com/office/word/2010/wordml\" xmlns:w15=\"http://schemas.microsoft.com/office/word/2012/wordml\" xmlns:wpg=\"http://schemas.microsoft.com/office/word/2010/wordprocessingGroup\" xmlns:wpi=\"http://schemas.microsoft.com/office/word/2010/wordprocessingInk\" xmlns:wne=\"http://schemas.microsoft.com/office/word/2006/wordml\" xmlns:wps=\"http://schemas.microsoft.com/office/word/2010/wordprocessingShape\" mc:Ignorable=\"w14 w15 wp14\">");
	static CString g_string_commentExt_End = _T("</w15:commentsEx>");
	static CString g_string_people_Start = _T("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><w15:people xmlns:wpc=\"http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas\" xmlns:mc=\"http://schemas.openxmlformats.org/markup-compatibility/2006\" xmlns:o=\"urn:schemas-microsoft-com:office:office\" xmlns:r=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships\" xmlns:m=\"http://schemas.openxmlformats.org/officeDocument/2006/math\" xmlns:v=\"urn:schemas-microsoft-com:vml\" xmlns:wp14=\"http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing\" xmlns:wp=\"http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing\" xmlns:w10=\"urn:schemas-microsoft-com:office:word\" xmlns:w=\"http://schemas.openxmlformats.org/wordprocessingml/2006/main\" xmlns:w14=\"http://schemas.microsoft.com/office/word/2010/wordml\" xmlns:w15=\"http://schemas.microsoft.com/office/word/2012/wordml\" xmlns:wpg=\"http://schemas.microsoft.com/office/word/2010/wordprocessingGroup\" xmlns:wpi=\"http://schemas.microsoft.com/office/word/2010/wordprocessingInk\" xmlns:wne=\"http://schemas.microsoft.com/office/word/2006/wordml\" xmlns:wps=\"http://schemas.microsoft.com/office/word/2010/wordprocessingShape\" mc:Ignorable=\"w14 w15 wp14\">");
	static CString g_string_people_End = _T("</w15:people>");

	class CommentsWriter
	{
		CString	m_sDir;
		ContentTypesWriter& m_oContentTypesWriter;
	public:
		CString m_sComment;
		CString m_sCommentExt;
		CString m_sPeople;
	public:
		CommentsWriter(CString sDir, ContentTypesWriter& oContentTypesWriter):m_sDir(sDir),m_oContentTypesWriter(oContentTypesWriter)
		{
		}
		void setElements(CString& sComment, CString& sCommentExt, CString& sPeople)
		{
			m_sComment = sComment;
			m_sCommentExt = sCommentExt;
			m_sPeople = sPeople;
		}
		void Write()
		{
			if(false == m_sComment.IsEmpty())
			{
				CFile oFile;
				oFile.CreateFile(m_sDir + _T("\\word\\comments.xml"));
				oFile.WriteStringUTF8(g_string_comment_Start);
				oFile.WriteStringUTF8(m_sComment);
				oFile.WriteStringUTF8(g_string_comment_End);
				oFile.CloseFile();

				
				m_oContentTypesWriter.AddOverride(CString(_T("/word/comments.xml")), CString(_T("application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml")));

				
				
			}
			if(false == m_sCommentExt.IsEmpty())
			{
				CFile oFile;
				oFile.CreateFile(m_sDir + _T("\\word\\commentsExtended.xml"));
				oFile.WriteStringUTF8(g_string_commentExt_Start);
				oFile.WriteStringUTF8(m_sCommentExt);
				oFile.WriteStringUTF8(g_string_commentExt_End);
				oFile.CloseFile();

				
				m_oContentTypesWriter.AddOverride(CString(_T("/word/commentsExtended.xml")), CString(_T("application/vnd.openxmlformats-officedocument.wordprocessingml.commentsExtended+xml")));
			}
			if(false == m_sPeople.IsEmpty())
			{
				CFile oFile;
				oFile.CreateFile(m_sDir + _T("\\word\\people.xml"));
				oFile.WriteStringUTF8(g_string_people_Start);
				oFile.WriteStringUTF8(m_sPeople);
				oFile.WriteStringUTF8(g_string_people_End);
				oFile.CloseFile();

				
				m_oContentTypesWriter.AddOverride(CString(_T("/word/people.xml")), CString(_T("application/vnd.openxmlformats-officedocument.wordprocessingml.people+xml")));
			}
		}
	};
}