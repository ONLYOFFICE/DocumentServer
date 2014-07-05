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
#include "Converter.h"

namespace NSBinPptxRW
{
	class CPPTXWriter
	{
	private:
		CBinaryFileReader	m_oReader;
		CImageManager2		m_oImageManager;
		CString				m_strDstFolder;

		CAtlMap<BYTE, LONG> m_mainTables;

		CAtlArray<PPTX::Theme>			m_arThemes;
		
		CAtlArray<PPTX::SlideMaster>	m_arSlideMasters;
		CAtlArray<CSlideMasterInfo>		m_arSlideMasters_Theme;
		
		CAtlArray<PPTX::SlideLayout>	m_arSlideLayouts;
		CAtlArray<LONG>					m_arSlideLayouts_Master;

		CAtlArray<PPTX::Slide>			m_arSlides;
		CAtlArray<LONG>					m_arSlides_Layout;

		CAtlArray<PPTX::NotesMaster>	m_arNotesMasters;
		CAtlArray<PPTX::NotesSlide>		m_arNotesSlides;
		CAtlArray<LONG>					m_arNotesSlides_Master;
		
		PPTX::Presentation				m_oPresentation;
		PPTX::TableStyles				m_oTableStyles;
		PPTX::VmlDrawing				m_oVmlDrawing;
		PPTX::App						m_oApp;
		PPTX::Core						m_oCore;
		PPTX::ViewProps					m_oViewProps;
		PPTX::PresProps					m_oPresProps;

		BOOL							m_bIsDefaultNoteMaster;
		PPTX::NotesSlide				m_oDefaultNote;
		
	public:

		CPPTXWriter()
		{
			m_strDstFolder = _T("");
			m_bIsDefaultNoteMaster = TRUE;
		}
		~CPPTXWriter()
		{
		}

		void Init(CString strFolder)
		{
			m_strDstFolder = strFolder;

			CDirectory::CreateDirectory(m_strDstFolder);
			CDirectory::CreateDirectory(m_strDstFolder, _T("docProps"));
			CString strPPT = m_strDstFolder + _T("\\ppt");
			CDirectory::CreateDirectory(strPPT);
			CDirectory::CreateDirectory(strPPT, _T("media"));

			m_oImageManager.Clear();
			m_oImageManager.SetDstMedia(m_strDstFolder + _T("\\ppt\\media"));

			m_oReader.m_oRels.m_pManager = &m_oImageManager;
		}

		void OpenPPTY(BYTE* pBuffer, int len, CString srcFolder, CString strThemesFolder)
		{
			int start_pos = 0;

			int cur_pos = start_pos;
			while (cur_pos < len && pBuffer[cur_pos] != (BYTE)(';'))
				++cur_pos;

			if (cur_pos == len || cur_pos == start_pos)
				return;
			CString __str_ppty((LPSTR)(pBuffer + start_pos), cur_pos - start_pos);
			start_pos = cur_pos + 1;

			cur_pos = start_pos;
			while (cur_pos < len && pBuffer[cur_pos] != (BYTE)(';'))
				++cur_pos;

			if (cur_pos == len || cur_pos == start_pos)
				return;

			CString __str_version((LPSTR)(pBuffer + start_pos), cur_pos - start_pos);
			start_pos = cur_pos + 1;

			cur_pos = start_pos;
			while (cur_pos < len && pBuffer[cur_pos] != (BYTE)(';'))
				++cur_pos;

			if (cur_pos == len || cur_pos == start_pos)
				return;

			CString __str_decode_len((LPSTR)(pBuffer + start_pos), cur_pos - start_pos);
			start_pos = cur_pos + 1;

			pBuffer += start_pos;
			len -= start_pos;
			int dstLenTemp = XmlUtils::GetInteger(__str_decode_len);
			

			BYTE* pDstBuffer = new BYTE[dstLenTemp];
			int dstLen = dstLenTemp;
			Base64Decode((LPCSTR)pBuffer, len, pDstBuffer, &dstLen);

			m_oReader.m_strContentTypes = _T("");
			m_oReader.Init(pDstBuffer, 0, dstLen);
			m_oReader.m_strFolder = srcFolder;
			m_oReader.m_strFolderThemes = strThemesFolder;
			
			for (LONG i = 0; i < 30; ++i)
			{
				BYTE _type = m_oReader.GetUChar();
				if (0 == _type)
					break;

				m_mainTables.SetAt(_type, m_oReader.GetLong());				
			}

			CAtlMap<BYTE, LONG>::CPair* pPair = NULL;

			
			CXmlWriter oXmlWriter;

			
			LONG nCountThemes = 0;
			LONG nCountMasters = 0;
			LONG nCountLayouts = 0;
			LONG nCountSlides = 0;

			pPair = m_mainTables.Lookup(NSMainTables::Themes);
			if (NULL != pPair)
			{
				m_oReader.Seek(pPair->m_value);
				nCountThemes = m_oReader.GetLong();
			}
			pPair = m_mainTables.Lookup(NSMainTables::SlideMasters);
			if (NULL != pPair)
			{
				m_oReader.Seek(pPair->m_value);
				nCountMasters = m_oReader.GetLong();
			}
			pPair = m_mainTables.Lookup(NSMainTables::SlideLayouts);
			if (NULL != pPair)
			{
				m_oReader.Seek(pPair->m_value);
				nCountLayouts = m_oReader.GetLong();
			}
			pPair = m_mainTables.Lookup(NSMainTables::Slides);
			if (NULL != pPair)
			{
				m_oReader.Seek(pPair->m_value);
				nCountSlides = m_oReader.GetLong();
			}

			if (0 == nCountThemes || 0 == nCountMasters || 0 == nCountLayouts || 0 == nCountSlides)
			{
				return;
			}

			
			for (LONG i = 0; i < nCountMasters; ++i)
				m_arSlideMasters_Theme.Add();
			for (LONG i = 0; i < nCountLayouts; ++i)
				m_arSlideLayouts_Master.Add(0);
			for (LONG i = 0; i < nCountSlides; ++i)
				m_arSlides_Layout.Add(0);

			
			pPair = m_mainTables.Lookup(NSMainTables::ThemeRels);
			if (NULL != pPair)
			{
				m_oReader.Seek(pPair->m_value);
				m_oReader.Skip(5); 
				
				LONG _count = m_oReader.GetLong();
				for (LONG i = 0; i < _count; ++i)
				{
					BYTE _master_type = m_oReader.GetUChar(); 
					ReadMasterInfo(i);
				}
			}

			
			for (LONG i = 0; i < nCountMasters; ++i)
			{
				size_t _countL = m_arSlideMasters_Theme[i].m_arLayouts.GetCount();				
				for (size_t j = 0; j < _countL; ++j)
				{
					m_arSlideLayouts_Master[m_arSlideMasters_Theme[i].m_arLayouts[j]] = (LONG)i;
				}
			}

			
			pPair = m_mainTables.Lookup(NSMainTables::SlideRels);
			if (NULL != pPair)
			{
				m_oReader.Seek(pPair->m_value);
				m_oReader.Skip(6); 

				while (true)
				{
					BYTE _at = m_oReader.GetUChar();
					if (_at == NSBinPptxRW::g_nodeAttributeEnd)
						break;

					m_arSlides_Layout[_at] = m_oReader.GetULong();
				}
			}

			
			CAtlArray<LONG> arThemes;
			CAtlArray<LONG> arThemesDst;
			CAtlArray<bool> arThemesSave;
			for (LONG i = 0; i < nCountThemes; ++i)
			{
				arThemes.Add(i);
				arThemesDst.Add(0);
				arThemesSave.Add(false);
			}
			for (LONG i = 0; i < nCountMasters; ++i)
			{
				arThemesSave[m_arSlideMasters_Theme[i].m_lThemeIndex] = true;
			}
			LONG lCurrectTheme = 0;
			for (LONG i = 0; i < nCountMasters; ++i)
			{
				if (!arThemesSave[i])
					continue;
				arThemesDst[i] = lCurrectTheme;
				++lCurrectTheme;
			}
			
			for (LONG i = 0; i < nCountMasters; ++i)
			{
				m_arSlideMasters_Theme[i].m_lThemeIndex = arThemesDst[i];
			}
			
			
			pPair = m_mainTables.Lookup(NSMainTables::Themes);
			if (NULL != pPair)
			{
				CString strFolder = m_strDstFolder + _T("\\ppt\\theme");
				CString strFolderRels = strFolder + _T("\\_rels");

				CDirectory::CreateDirectory(strFolder);
				CDirectory::CreateDirectory(strFolderRels);

				m_oReader.Seek(pPair->m_value);
				m_oReader.Skip(4);
								
				for (LONG i = 0; i < nCountThemes; ++i)
				{
					if (!arThemesSave[i])
					{
						
						continue;
					}

					m_arThemes.Add();

					m_oReader.m_oRels.Clear();
					m_oReader.m_oRels.StartTheme();
					m_arThemes[i].fromPPTY(&m_oReader);

					CString strMasterXml = _T("");
					strMasterXml.Format(_T("\\theme%d.xml"), i + 1);
					oXmlWriter.ClearNoAttack();

					m_oReader.m_oRels.CloseRels();

					m_arThemes[i].toXmlWriter(&oXmlWriter);
					oXmlWriter.SaveToFile(strFolder + strMasterXml);
					m_oReader.m_oRels.SaveRels(strFolderRels + strMasterXml + _T(".rels"));
				}
			}

			
			pPair = m_mainTables.Lookup(NSMainTables::SlideMasters);
			if (NULL != pPair)
			{
				CString strFolder = m_strDstFolder + _T("\\ppt\\slideMasters");
				CString strFolderRels = strFolder + _T("\\_rels");

				CDirectory::CreateDirectory(strFolder);
				CDirectory::CreateDirectory(strFolderRels);

				m_oReader.Seek(pPair->m_value);
				m_oReader.Skip(4);

				LONG __nCountLayouts = 0;
				
				for (LONG i = 0; i < nCountMasters; ++i)
				{
					m_arSlideMasters.Add();

					m_oReader.m_oRels.Clear();
					m_oReader.m_oRels.StartMaster(i, m_arSlideMasters_Theme[i]);
					m_arSlideMasters[i].fromPPTY(&m_oReader);
					
					CAtlArray<PPTX::Logic::XmlId>& arrLays = m_arSlideMasters[i].sldLayoutIdLst;
					LONG lLayouts = (LONG)m_arSlideMasters_Theme[i].m_arLayouts.GetCount();
					for (LONG j = 0; j < lLayouts; ++j)
					{
						arrLays.Add();
						
						CString sId = _T("");
						sId.Format(_T("%u"), 0x80000000 + __nCountLayouts + j + 1);

						arrLays[j].m_name = _T("sldLayoutId");
						arrLays[j].id = sId;
						arrLays[j].rid = (size_t)(j + 1);
					}
					__nCountLayouts += (LONG)(lLayouts + 1);

					m_oReader.m_oRels.CloseRels();

					CString strMasterXml = _T("");
					strMasterXml.Format(_T("\\slideMaster%d.xml"), i + 1);
					oXmlWriter.ClearNoAttack();

					m_arSlideMasters[i].toXmlWriter(&oXmlWriter);

					oXmlWriter.SaveToFile(strFolder + strMasterXml);
					m_oReader.m_oRels.SaveRels(strFolderRels + strMasterXml + _T(".rels"));
				}
			}

			
			pPair = m_mainTables.Lookup(NSMainTables::SlideLayouts);
			if (NULL != pPair)
			{
				CString strFolder = m_strDstFolder + _T("\\ppt\\slideLayouts");
				CString strFolderRels = strFolder + _T("\\_rels");

				CDirectory::CreateDirectory(strFolder);
				CDirectory::CreateDirectory(strFolderRels);

				m_oReader.Seek(pPair->m_value);
				m_oReader.Skip(4);
				
				for (LONG i = 0; i < nCountLayouts; ++i)
				{
					m_arSlideLayouts.Add();

					m_oReader.m_oRels.Clear();
					m_oReader.m_oRels.StartLayout(m_arSlideLayouts_Master[i]);
					m_arSlideLayouts[i].fromPPTY(&m_oReader);
					m_oReader.m_oRels.CloseRels();

					CString strMasterXml = _T("");
					strMasterXml.Format(_T("\\slideLayout%d.xml"), i + 1);
					oXmlWriter.ClearNoAttack();

					m_arSlideLayouts[i].toXmlWriter(&oXmlWriter);

					oXmlWriter.SaveToFile(strFolder + strMasterXml);
					m_oReader.m_oRels.SaveRels(strFolderRels + strMasterXml + _T(".rels"));	
				}
			}

			
			int nComment = 1;
			pPair = m_mainTables.Lookup(NSMainTables::Slides);
			if (NULL != pPair)
			{
				CString strFolder = m_strDstFolder + _T("\\ppt\\slides");
				CString strFolderRels = strFolder + _T("\\_rels");

				CDirectory::CreateDirectory(strFolder);
				CDirectory::CreateDirectory(strFolderRels);

				m_oReader.Seek(pPair->m_value);
				m_oReader.Skip(4);
				
				for (LONG i = 0; i < nCountSlides; ++i)
				{
					m_arSlides.Add();

					m_oReader.m_oRels.Clear();
					m_oReader.m_oRels.StartSlide(i, m_arSlides_Layout[i]);
					m_arSlides[i].fromPPTY(&m_oReader);

					if (m_arSlides[i].comments.is_init())
					{
						m_oReader.m_oRels.WriteSlideComments(nComment);
						if (1 == nComment)
						{
							CDirectory::CreateDirectory(m_strDstFolder + _T("\\ppt\\comments"));
						}
						CString strCommentFile = _T("");
						strCommentFile.Format(_T("\\ppt\\comments\\comment%d.xml"), nComment);

						oXmlWriter.ClearNoAttack();
						m_arSlides[i].comments->toXmlWriter(&oXmlWriter);
						oXmlWriter.SaveToFile(m_strDstFolder + strCommentFile);

						++nComment;
					}

					m_oReader.m_oRels.CloseRels();

					CString strMasterXml = _T("");
					strMasterXml.Format(_T("\\slide%d.xml"), i + 1);
					oXmlWriter.ClearNoAttack();

					m_arSlides[i].toXmlWriter(&oXmlWriter);

					oXmlWriter.SaveToFile(strFolder + strMasterXml);
					m_oReader.m_oRels.SaveRels(strFolderRels + strMasterXml + _T(".rels"));	
				}
			}

			if (FALSE)
			{
				
				pPair = m_mainTables.Lookup(NSMainTables::NotesMasters);
				if (NULL != pPair)
				{
					m_oReader.Seek(pPair->m_value);
					LONG lCount = m_oReader.GetLong();
					
					for (LONG i = 0; i < lCount; ++i)
					{
						m_arNotesMasters.Add();
						m_arNotesMasters[i].fromPPTY(&m_oReader);
					}
				}

				
				pPair = m_mainTables.Lookup(NSMainTables::NotesSlides);
				if (NULL != pPair)
				{
					m_oReader.Seek(pPair->m_value);
					LONG lCount = m_oReader.GetLong();
					
					for (LONG i = 0; i < lCount; ++i)
					{
						m_arNotesSlides.Add();
						m_arNotesSlides[i].fromPPTY(&m_oReader);
					}
				}
			}
			else
			{
				
				CreateDefaultNotesMasters((int)m_arThemes.GetCount() + 1);
				CreateDefaultNote();

				CString strFolder = m_strDstFolder + _T("\\ppt\\notesSlides");
				CString strFolderRels = strFolder + _T("\\_rels");

				CDirectory::CreateDirectory(strFolder);
				CDirectory::CreateDirectory(strFolderRels);

				LONG lCount = (LONG)m_arSlides.GetCount();				
				for (LONG i = 0; i < lCount; ++i)
				{
					m_oReader.m_oRels.Clear();
					m_oReader.m_oRels.StartNote(i);
					m_oReader.m_oRels.CloseRels();

					CString strMasterXml = _T("");
					strMasterXml.Format(_T("\\notesSlide%d.xml"), i + 1);
					oXmlWriter.ClearNoAttack();

					m_oDefaultNote.toXmlWriter(&oXmlWriter);

					oXmlWriter.SaveToFile(strFolder + strMasterXml);
					m_oReader.m_oRels.SaveRels(strFolderRels + strMasterXml + _T(".rels"));	
				}
			}

			if (FALSE)
			{
				
				pPair = m_mainTables.Lookup(NSMainTables::App);
				if (NULL != pPair)
				{
					m_oReader.Seek(pPair->m_value);
					m_oApp.fromPPTY(&m_oReader);
				}

				
				pPair = m_mainTables.Lookup(NSMainTables::Core);
				if (NULL != pPair)
				{
					m_oReader.Seek(pPair->m_value);
					m_oCore.fromPPTY(&m_oReader);
				}

				
				pPair = m_mainTables.Lookup(NSMainTables::TableStyles);
				if (NULL != pPair)
				{
					m_oReader.Seek(pPair->m_value);
					m_oTableStyles.fromPPTY(&m_oReader);
				}

				
				pPair = m_mainTables.Lookup(NSMainTables::ViewProps);
				if (NULL != pPair)
				{
					m_oReader.Seek(pPair->m_value);
					m_oViewProps.fromPPTY(&m_oReader);
				}

				CreateDefaultPresProps();
			}
			else
			{
				
				CreateDefaultApp();
				CreateDefaultCore();
				CreateDefaultPresProps();
				
				CreateDefaultViewProps();

				pPair = m_mainTables.Lookup(NSMainTables::TableStyles);
				if (NULL != pPair)
				{
					m_oReader.Seek(pPair->m_value);
					m_oTableStyles.fromPPTY(&m_oReader);
				}

				if (0 == m_oTableStyles.Styles.GetCount())
				{
					CreateDefaultTableStyles();
				}
			}

			
			oXmlWriter.ClearNoAttack();
			m_oApp.toXmlWriter(&oXmlWriter);
			oXmlWriter.SaveToFile(m_strDstFolder + _T("\\docProps\\app.xml"));

			
			oXmlWriter.ClearNoAttack();
			m_oCore.toXmlWriter(&oXmlWriter);
			oXmlWriter.SaveToFile(m_strDstFolder + _T("\\docProps\\core.xml"));

			
			oXmlWriter.ClearNoAttack();
			m_oPresProps.toXmlWriter(&oXmlWriter);
			oXmlWriter.SaveToFile(m_strDstFolder + _T("\\ppt\\presProps.xml"));

			
			oXmlWriter.ClearNoAttack();
			m_oViewProps.toXmlWriter(&oXmlWriter);
			oXmlWriter.SaveToFile(m_strDstFolder + _T("\\ppt\\viewProps.xml"));

			m_oReader.m_oRels.Clear();
			m_oReader.m_oRels.StartRels();

			
			oXmlWriter.ClearNoAttack();
			m_oTableStyles.toXmlWriter(&oXmlWriter);
			oXmlWriter.SaveToFile(m_strDstFolder + _T("\\ppt\\tableStyles.xml"));
			
			
			bool bIsAuthors = false;
			pPair = m_mainTables.Lookup(NSMainTables::Presentation);
			if (NULL != pPair)
			{
				CString strFolder = m_strDstFolder + _T("\\ppt");
				CString strFolderRels = strFolder + _T("\\_rels");

				CDirectory::CreateDirectory(strFolderRels);

				m_oReader.Seek(pPair->m_value);
				m_oPresentation.fromPPTY(&m_oReader);

				m_oPresentation.sldMasterIdLst.RemoveAll();
				LONG nCountLayouts = 0;
				for (LONG i = 0; i < nCountMasters; ++i)
				{
					m_oPresentation.sldMasterIdLst.Add();

					CString sId = _T("");
					sId.Format(_T("%u"), 0x80000000 + nCountLayouts);
					m_oPresentation.sldMasterIdLst[i].m_name = _T("sldMasterId");
					m_oPresentation.sldMasterIdLst[i].id = sId;
					m_oPresentation.sldMasterIdLst[i].rid = (size_t)(i + 1);
					nCountLayouts += (LONG)(m_arSlideMasters_Theme[i].m_arLayouts.GetCount() + 1);
				}

				m_oReader.m_oRels.WriteMasters(nCountMasters);
				m_oReader.m_oRels.WriteThemes(nCountThemes);

				int nCurrentRels = m_oReader.m_oRels.GetNextId();

				m_oPresentation.sldIdLst.RemoveAll();
				for (LONG i = 0; i < nCountSlides; ++i)
				{
					m_oPresentation.sldIdLst.Add();

					CString sId = _T("");
					sId.Format(_T("%u"), 256 + i);
					m_oPresentation.sldIdLst[i].m_name = _T("sldId");
					m_oPresentation.sldIdLst[i].id = sId;
					m_oPresentation.sldIdLst[i].rid = (size_t)nCurrentRels;
					++nCurrentRels;
				}

				m_oReader.m_oRels.WriteSlides(nCountSlides);
				m_oReader.m_oRels.EndPresentationRels(m_oPresentation.commentAuthors.is_init());

				m_oPresentation.notesMasterIdLst.RemoveAll();
				m_oPresentation.notesMasterIdLst.Add();
				m_oPresentation.notesMasterIdLst[0].m_name = _T("notesMasterId");
				m_oPresentation.notesMasterIdLst[0].rid = (size_t)nCurrentRels;

				m_oReader.m_oRels.CloseRels();

				oXmlWriter.ClearNoAttack();
				m_oPresentation.toXmlWriter(&oXmlWriter);

				oXmlWriter.SaveToFile(strFolder + _T("\\presentation.xml"));
				m_oReader.m_oRels.SaveRels(strFolderRels + _T("\\presentation.xml.rels"));	

				if (m_oPresentation.commentAuthors.is_init())
				{
					oXmlWriter.ClearNoAttack();
					m_oPresentation.commentAuthors->toXmlWriter(&oXmlWriter);
					
					oXmlWriter.SaveToFile(strFolder + _T("\\commentAuthors.xml"));
					bIsAuthors = true;
				}
			}

			RELEASEARRAYOBJECTS(pDstBuffer);

			
			CStringWriter oContentTypes;
			oContentTypes.WriteString(_T("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\" ?>\
<Types xmlns=\"http://schemas.openxmlformats.org/package/2006/content-types\">\
<Default Extension=\"png\" ContentType=\"image/png\" />\
<Default Extension=\"jpeg\" ContentType=\"image/jpeg\" />\
<Default Extension=\"wmf\" ContentType=\"image/x-wmf\" />\
<Default Extension=\"rels\" ContentType=\"application/vnd.openxmlformats-package.relationships+xml\" />\
<Default Extension=\"xml\" ContentType=\"application/xml\" />\
<Default Extension=\"gif\" ContentType=\"image/gif\"/>\
<Default Extension=\"emf\" ContentType=\"image/x-emf\"/>\
<Default Extension=\"jpg\" ContentType=\"image/jpeg\"/>\
\
<Override PartName=\"/ppt/presentation.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml\" />\
<Override PartName=\"/ppt/presProps.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.presentationml.presProps+xml\" />\
<Override PartName=\"/ppt/viewProps.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.presentationml.viewProps+xml\" />\
<Override PartName=\"/ppt/tableStyles.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.presentationml.tableStyles+xml\"/>\
<Override PartName=\"/docProps/core.xml\" ContentType=\"application/vnd.openxmlformats-package.core-properties+xml\" />\
<Override PartName=\"/docProps/app.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.extended-properties+xml\" />"));

			
			for (LONG i = 0; i < (LONG)m_arThemes.GetCount(); ++i)
			{
				CString strTheme = _T("");
				strTheme.Format(_T("<Override PartName=\"/ppt/theme/theme%d.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.theme+xml\"/>"), i + 1);
				oContentTypes.WriteString(strTheme);
			}
			if (TRUE)
			{
				
				CString strTheme = _T("");
				strTheme.Format(_T("<Override PartName=\"/ppt/theme/theme%d.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.theme+xml\"/>"), m_arThemes.GetCount() + 1);
				oContentTypes.WriteString(strTheme);

				oContentTypes.WriteString(_T("<Override PartName=\"/ppt/notesMasters/notesMaster1.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.presentationml.notesMaster+xml\"/>"));
			}

			
			for (LONG i = 0; i < nCountMasters; ++i)
			{
				CString strMaster = _T("");
				strMaster.Format(_T("<Override PartName=\"/ppt/slideMasters/slideMaster%d.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml\" />"), i + 1);
				oContentTypes.WriteString(strMaster);
			}

			
			for (LONG i = 0; i < nCountLayouts; ++i)
			{
				CString strL = _T("");
				strL.Format(_T("<Override PartName=\"/ppt/slideLayouts/slideLayout%d.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml\" />"), i + 1);
				oContentTypes.WriteString(strL);
			}

			
			for (LONG i = 0; i < nCountSlides; ++i)
			{
				CString strS = _T("");
				strS.Format(_T("<Override PartName=\"/ppt/slides/slide%d.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.presentationml.slide+xml\" />"), i + 1);
				oContentTypes.WriteString(strS);
			}

			
			for (LONG i = 0; i < nCountSlides; ++i)
			{
				CString strN = _T("");
				strN.Format(_T("<Override PartName=\"/ppt/notesSlides/notesSlide%d.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.presentationml.notesSlide+xml\"/>"), i + 1);
				oContentTypes.WriteString(strN);
			}

			
			for (int i = 1; i < nComment; ++i)
			{
				CString strN = _T("");
				strN.Format(_T("<Override PartName=\"/ppt/comments/comment%d.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.presentationml.comments+xml\"/>"), i);
				oContentTypes.WriteString(strN);				
			}
			
			if (bIsAuthors)
			{
				oContentTypes.WriteString(_T("<Override PartName=\"/ppt/commentAuthors.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.presentationml.commentAuthors+xml\"/>"));
			}

			oContentTypes.WriteString(m_oReader.m_strContentTypes);

			oContentTypes.WriteString(_T("</Types>"));

			CFile oFile;
			oFile.CreateFile(m_strDstFolder + _T("\\[Content_Types].xml"));
			CString strContentTypes = oContentTypes.GetData();
			oFile.WriteStringUTF8(strContentTypes);
			oFile.CloseFile();


			CString strRELS = _T("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>\
<Relationships xmlns=\"http://schemas.openxmlformats.org/package/2006/relationships\">\
<Relationship Id=\"rId3\" Type=\"http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties\" Target=\"docProps/core.xml\"/>\
<Relationship Id=\"rId1\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument\" Target=\"ppt/presentation.xml\"/>\
<Relationship Id=\"rId2\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties\" Target=\"docProps/app.xml\"/>\
</Relationships>");

			CDirectory::CreateDirectory(m_strDstFolder + _T("\\_rels"));
			oFile.CreateFile(m_strDstFolder + _T("\\_rels\\.rels"));
			oFile.WriteStringUTF8(strRELS);
			oFile.CloseFile();

		}

	private:

		void ReadMasterInfo(LONG nIndexMaster)
		{
			LONG _rec_start = m_oReader.GetPos();
			LONG _end_rec = _rec_start + m_oReader.GetLong() + 4;

			CSlideMasterInfo& oMaster = m_arSlideMasters_Theme[nIndexMaster];			
			
			m_oReader.Skip(1); 

			while (true)
			{
				BYTE _at = m_oReader.GetUChar();
				if (_at == NSBinPptxRW::g_nodeAttributeEnd)
					break;

				switch (_at)
				{
					case 0:
					{
						oMaster.m_lThemeIndex = m_oReader.GetLong();
						break;
					}
					case 1:
					{
						CStringA strMaster64 = m_oReader.GetString2A();
						break;
					}
					default:
						break;
				}
			}

			LONG _lay_count = m_oReader.GetULong();
			for (LONG i = 0; i < _lay_count; ++i)
			{
				m_oReader.Skip(6); 

				while (true)
				{
					BYTE _at = m_oReader.GetUChar();
					if (_at == NSBinPptxRW::g_nodeAttributeEnd)
						break;

					switch (_at)
					{
						case 0:
						{
							oMaster.m_arLayouts.Add();
							oMaster.m_arLayouts[oMaster.m_arLayouts.GetCount() - 1] = m_oReader.GetLong();
							break;
						}
						case 1:
						{
							CStringA strLayout64 = m_oReader.GetString2A();
							break;
						}
						default:
							break;
					}
				}
			}

			m_oReader.Seek(_end_rec);
		}

		void CreateDefaultApp()
		{
			m_oApp.TotalTime = 0;
			m_oApp.Words = 0;
			m_oApp.Application = _T("Teamlab Office");
			m_oApp.PresentationFormat = _T("On-screen Show (4:3)");
			m_oApp.Paragraphs = 0;
			m_oApp.Slides = (int)m_arSlides.GetCount();
			m_oApp.Notes = (int)m_arSlides.GetCount();
			m_oApp.HiddenSlides = 0;
			m_oApp.MMClips = 2;
			m_oApp.ScaleCrop = false;

			int nCountThemes = (int)m_arSlideMasters.GetCount();
			int nCountSlides = (int)m_arSlides.GetCount();

			m_oApp.HeadingPairs.Add();
			m_oApp.HeadingPairs[0].m_type = _T("lpstr");
			m_oApp.HeadingPairs[0].m_strContent = _T("Theme");
			m_oApp.HeadingPairs.Add();
			m_oApp.HeadingPairs[1].m_type = _T("i4");
			m_oApp.HeadingPairs[1].m_iContent = nCountThemes;
			m_oApp.HeadingPairs.Add();
			m_oApp.HeadingPairs[2].m_type = _T("lpstr");
			m_oApp.HeadingPairs[2].m_strContent = _T("Slide Titles");
			m_oApp.HeadingPairs.Add();
			m_oApp.HeadingPairs[3].m_type = _T("i4");
			m_oApp.HeadingPairs[3].m_iContent = nCountSlides;

			for (int i = 0; i < nCountThemes; ++i)
			{
				CString s = _T("");
				s.Format(_T("Theme %d"), i + 1);
				m_oApp.TitlesOfParts.Add();
				m_oApp.TitlesOfParts[i].m_title = s;
			}

			for (int i = 0; i < nCountSlides; ++i)
			{
				CString s = _T("");
				s.Format(_T("Slide %d"), i + 1);
				m_oApp.TitlesOfParts.Add();
				m_oApp.TitlesOfParts[nCountThemes + i].m_title = s;
			}
			
			m_oApp.Company = _T("Teamlab Office");
			m_oApp.LinksUpToDate = false;
			m_oApp.SharedDoc = false;
			m_oApp.HyperlinksChanged = false;
			m_oApp.AppVersion = _T("1.0000");			
		}
		void CreateDefaultCore()
		{
			m_oCore.title = _T("Slide 1");
			m_oCore.creator  = _T("Teamlab Office");
			m_oCore.lastModifiedBy = _T("Teamlab Office");
			m_oCore.revision = _T("1");
		}
		void CreateDefaultViewProps()
		{
			m_oViewProps.NormalViewPr = new PPTX::nsViewProps::NormalViewPr();
			m_oViewProps.NormalViewPr->restoredLeft.sz = 15620;
			m_oViewProps.NormalViewPr->restoredTop.sz = 94660;

			m_oViewProps.SlideViewPr = new PPTX::nsViewProps::SlideViewPr();
			m_oViewProps.SlideViewPr->CSldViewPr.CViewPr.attrVarScale = true;
			m_oViewProps.SlideViewPr->CSldViewPr.CViewPr.Scale.sx.n = 104;
			m_oViewProps.SlideViewPr->CSldViewPr.CViewPr.Scale.sx.d = 100;
			m_oViewProps.SlideViewPr->CSldViewPr.CViewPr.Scale.sy.n = 104;
			m_oViewProps.SlideViewPr->CSldViewPr.CViewPr.Scale.sy.d = 100;
			m_oViewProps.SlideViewPr->CSldViewPr.CViewPr.Origin.x = -1236;
			m_oViewProps.SlideViewPr->CSldViewPr.CViewPr.Origin.y = -90;

			m_oViewProps.SlideViewPr->CSldViewPr.GuideLst.Add();
			m_oViewProps.SlideViewPr->CSldViewPr.GuideLst[0].orient = _T("horz");
			m_oViewProps.SlideViewPr->CSldViewPr.GuideLst[0].pos = 2160;
			m_oViewProps.SlideViewPr->CSldViewPr.GuideLst.Add();
			m_oViewProps.SlideViewPr->CSldViewPr.GuideLst[1].pos = 2880;

			m_oViewProps.NotesTextViewPr = new PPTX::nsViewProps::NotesTextViewPr();
			m_oViewProps.NotesTextViewPr->CViewPr.Origin.x = 0;
			m_oViewProps.NotesTextViewPr->CViewPr.Origin.y = 0;
			m_oViewProps.NotesTextViewPr->CViewPr.Scale.sx.n = 100;
			m_oViewProps.NotesTextViewPr->CViewPr.Scale.sx.d = 100;
			m_oViewProps.NotesTextViewPr->CViewPr.Scale.sy.n = 100;
			m_oViewProps.NotesTextViewPr->CViewPr.Scale.sy.d = 100;

			m_oViewProps.GridSpacing = new PPTX::nsViewProps::GridSpacing();
			m_oViewProps.GridSpacing->cx = 72008;
			m_oViewProps.GridSpacing->cy = 72008;
		}
		void CreateDefaultTableStyles()
		{
			m_oTableStyles.def = _T("{5C22544A-7EE6-4342-B048-85BDC9FD1C3A}");
		}
		void CreateDefaultPresProps()
		{
			
		}
		void CreateDefaultNotesMasters(int nIndexTheme)
		{
			HINSTANCE hInst = _AtlBaseModule.GetModuleInstance();
			
			CString strThemeNotes = _T("");
			strThemeNotes.Format(_T("\\ppt\\theme\\theme%d.xml"), (int)m_arThemes.GetCount() + 1);
			LoadResourceFile(hInst, MAKEINTRESOURCE(IDB_XML_NOTESTHEME), _T("PPTXW"), m_strDstFolder + strThemeNotes);

			CDirectory::CreateDirectory(m_strDstFolder + _T("\\ppt\\notesMasters"));
			LoadResourceFile(hInst, MAKEINTRESOURCE(IDB_XML_NOTESMASTER), _T("PPTXW"), m_strDstFolder + _T("\\ppt\\notesMasters\\notesMaster1.xml"));

			CDirectory::CreateDirectory(m_strDstFolder + _T("\\ppt\\notesMasters\\_rels"));
			CString strThemeNotesNum = _T("");
			strThemeNotesNum.Format(_T("%d"), (int)m_arThemes.GetCount() + 1);
			CString strVal = _T("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>\
<Relationships xmlns=\"http://schemas.openxmlformats.org/package/2006/relationships\">\
<Relationship Id=\"rId1\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme\" Target=\"../theme/theme") + strThemeNotesNum + _T(".xml\"/></Relationships>");
			CFile oFileRels;
			oFileRels.CreateFile(m_strDstFolder + _T("\\ppt\\notesMasters\\_rels\\notesMaster1.xml.rels"));
			oFileRels.WriteStringUTF8(strVal);
			oFileRels.CloseFile();
		}
		void CreateDefaultNote()
		{
			PPTX::Logic::NvGrpSpPr& nvGrpSpPr = m_oDefaultNote.cSld.spTree.nvGrpSpPr;
			nvGrpSpPr.cNvPr.id = 1;
			nvGrpSpPr.cNvPr.name = _T("");

			PPTX::Logic::Xfrm* xfrm = new PPTX::Logic::Xfrm();
			xfrm->offX = 0;
			xfrm->offY = 0;
			xfrm->extX = 0;
			xfrm->extY = 0;
			xfrm->chOffX = 0;
			xfrm->chOffY = 0;
			xfrm->chExtX = 0;
			xfrm->chExtY = 0;
			m_oDefaultNote.cSld.spTree.m_name = _T("p:spTree");
			m_oDefaultNote.cSld.spTree.grpSpPr.xfrm = xfrm;

			
			PPTX::Logic::Shape* pShape = new PPTX::Logic::Shape();
			pShape->nvSpPr.cNvPr.id = 100000;
			pShape->nvSpPr.cNvPr.name = _T("");

			pShape->nvSpPr.cNvSpPr.noGrp = true;
			pShape->nvSpPr.cNvSpPr.noChangeArrowheads = true;

			pShape->nvSpPr.nvPr.ph = new PPTX::Logic::Ph();
			pShape->nvSpPr.nvPr.ph->type = _T("body");
			pShape->nvSpPr.nvPr.ph->idx = _T("1");

			PPTX::Logic::TxBody* pTxBody = new PPTX::Logic::TxBody();
			pTxBody->Paragrs.Add();
			
			PPTX::Logic::Run* pTxRun = new PPTX::Logic::Run();
			pTxRun->rPr = new PPTX::Logic::RunProperties();
			pTxRun->rPr->smtClean = false;
			pTxRun->SetText(_T("")); 

			pShape->txBody = pTxBody;

			pTxBody->Paragrs[0].RunElems.Add();
			pTxBody->Paragrs[0].RunElems[0].InitRun(pTxRun);

			m_oDefaultNote.cSld.spTree.SpTreeElems.Add();
			m_oDefaultNote.cSld.spTree.SpTreeElems[0].InitElem(pShape);

			m_oDefaultNote.clrMapOvr = new PPTX::Logic::ClrMapOvr();
		}

	private:

		void LoadResourceFile(HINSTANCE hInst, LPCTSTR sResName, LPCTSTR sResType, const CString& strDstFile)
		{
			HRSRC hrRes = FindResource(hInst, sResName, sResType);
			if (!hrRes)
				return;

			HGLOBAL hGlobal = LoadResource(hInst, hrRes);
			DWORD sz = SizeofResource(hInst, hrRes);
			void* ptrRes = LockResource(hGlobal);
			
			CFile oFile;
			oFile.CreateFile(strDstFile);
			oFile.WriteFile(ptrRes, sz);

			UnlockResource(hGlobal);
			FreeResource(hGlobal);
		}
	};
}
