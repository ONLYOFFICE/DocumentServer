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
#ifndef OOX_FILE_TYPES_INCLUDE_H_
#define OOX_FILE_TYPES_INCLUDE_H_

#include "FileType.h"


namespace OOX
{
	namespace FileTypes
	{
		const FileType App(L"docProps", L"app.xml",
												_T("application/vnd.openxmlformats-officedocument.extended-properties+xml"),
												_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties"));

		const FileType Core(L"docProps", L"core.xml",
												_T("application/vnd.openxmlformats-package.core-properties+xml"),
												_T("http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties"));

		const FileType Document(L"word", L"document.xml",
												_T("application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"),
												_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument"));

		const FileType Theme(L"theme", L"theme.xml",
												_T("application/vnd.openxmlformats-officedocument.theme+xml"),
												_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme"));

		const FileType Setting(L"", L"settings.xml",
												_T("application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"),
												_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings"));

		const FileType FontTable(L"", L"fontTable.xml",
												_T("application/vnd.openxmlformats-officedocument.wordprocessingml.fontTable+xml"),
												_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/fontTable"));

		const FileType Style(L"", L"styles.xml",
												_T("application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"),
												_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles"));

		const FileType Item(L"customXml", L"item.xml",
												_T("WARNING not implement"),
												_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/customXml"));

		const FileType FootNote(L"", L"footnotes.xml",
												_T("application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml"),
												_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/footnotes"));

		const FileType EndNote(L"", L"endnotes.xml",
												_T("application/vnd.openxmlformats-officedocument.wordprocessingml.endnotes+xml"),
												_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/endnotes"));

		const FileType WebSetting(L"", L"webSettings.xml",
												_T("application/vnd.openxmlformats-officedocument.wordprocessingml.webSettings+xml"),
												_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/webSettings"));

		const FileType Header(L"", L"header.xml",
												_T("application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml"),
												_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/header"));

		const FileType Footer(L"", L"footer.xml", 
												_T("application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"),
												_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer"));

		const FileType Numbering(L"", L"numbering.xml", 
												_T("application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"),
												_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering"));

		const FileType CustomXml(L"customXml", L"itemProps.xml",
												_T("application/vnd.openxmlformats-officedocument.customXmlProperties+xml"),
												_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/customXmlProps"));

		const FileType HyperLink(L"", L"", 
												_T(""), 
												_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink"));

		const FileType ExternalImage(L"", L"", 
												_T(""), 
												_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/image"));

		const FileType ExternalAudio(L"", L"", 
												_T(""), 
												_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/audio"));

		const FileType ExternalVideo(L"", L"", 
												_T(""), 
												_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/video"));

		const FileType Image(L"media", L"image", 
												_T(""), 
												_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/image"));

		const FileType Audio(L"media", L"audio", 
												_T(""), 
												_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/audio"));

		const FileType Video(L"media", L"video", 
												_T(""), 
												_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/video"));

		const FileType Data(L"diagrams", L"data.xml",
												_T("application/vnd.openxmlformats-officedocument.drawingml.diagramData+xml"),
												_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/diagramData"));

		const FileType DrawingDiag(L"diagrams", L"drawing.xml",
												_T("application/vnd.openxmlformats-officedocument.drawingml.diagramDrawing+xml"),
												_T("http://schemas.microsoft.com/office/2007/relationships/diagramDrawing"));

		const FileType Layout(L"diagrams", L"layout.xml",
												_T("application/vnd.openxmlformats-officedocument.drawingml.diagramLayout+xml"),
												_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/diagramLayout"));

		const FileType Colors(L"diagrams", L"colors.xml",
												_T("application/vnd.openxmlformats-officedocument.drawingml.diagramColors+xml"),
												_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/diagramColors"));

		const FileType QuickStyle(L"diagrams", L"quickStyle.xml",
												_T("application/vnd.openxmlformats-officedocument.drawingml.diagramStyle+xml"),
												_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/diagramQuickStyle"));

		const FileType Chart(L"charts", L"chart.xml",
												_T("application/vnd.openxmlformats-officedocument.drawingml.chart+xml"),
												_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/chart"));
		

		const FileType MicrosoftOfficeExcelWorksheet(L"embeddings", L"Microsoft_Office_Excel_Worksheet.xlsx",
												_T(""),
												_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/package"));

		const FileType MicrosoftOfficeExcel_97_2003_Worksheet(L"embeddings", L"Microsoft_Office_Excel_97-2003_Worksheet.xls",
												_T(""),
												_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/oleObject"));

		const FileType MicrosoftOfficeExcelBinaryWorksheet(L"embeddings", L"Microsoft_Office_Excel_Binary_Worksheet.xlsb",
												_T(""),
												_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/package"));

		const FileType MicrosoftOfficeExcelMacro_EnabledWorksheet(L"embeddings", L"Microsoft_Office_Excel_Macro-Enabled_Worksheet.xlsm",
												_T(""),
												_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/package"));

		const FileType MicrosoftOfficeExcelChart(L"embeddings", L"Microsoft_Office_Excel_Chart.xlsx",
												_T(""),
												_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/oleObject"));


		const FileType MicrosoftOfficeWordDocument(L"embeddings", L"Microsoft_Office_Word_Document.docx",
												_T(""),
												_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/package"));

		const FileType MicrosoftOfficeWord_97_2003_Document(L"embeddings", L"Microsoft_Office_Word_97_-_2003_Document.doc",
												_T(""),
												_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/oleObject"));

		const FileType MicrosoftOfficeWordMacro_EnabledDocument(L"embeddings", L"Microsoft_Office_Word_Macro-Enabled_Document.docm",
												_T(""),
												_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/package"));


		const FileType MicrosoftOfficePowerPointPresentation(L"embeddings", L"Microsoft_Office_PowerPoint_Presentation.pptx",
												_T(""),
												_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/package"));

		const FileType MicrosoftOfficePowerPoint_97_2003_Presentation(L"embeddings", L"Microsoft_Office_PowerPoint_97-2003_Presentation.xlsx",
												_T(""),
												_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/oleObject"));

		const FileType MicrosoftOfficePowerPointMacro_EnabledPresentation(L"embeddings", L"Microsoft_Office_PowerPoint_Macro-Enabled_Presentation.pptm",
												_T(""),
												_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/package"));
		

		const FileType MicrosoftOfficePowerPointSlide(L"embeddings", L"Microsoft_Office_PowerPoint_Slide.sldx",
												_T(""),
												_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/package"));

		const FileType MicrosoftOfficePowerPointMacro_EnabledSlide(L"embeddings", L"Microsoft_Office_PowerPoint_Macro-Enabled_Slide.sldm",
												_T(""),
												_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/package"));
				
		
		const FileType OleObject(L"embeddings", L"oleObject.bin",
												_T(""),
												_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/oleObject"));
		
		const FileType Glossary(L"glossary", L"document.xml",
												_T("application/vnd.openxmlformats-officedocument.wordprocessingml.document.glossary+xml"),
												_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/glossaryDocument"));

		const FileType Slide(L"ppt/slides", L"slide.xml",
												_T("application/vnd.openxmlformats-officedocument.presentationml.slide+xml"),
												_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide"));

		const FileType SlideLayout(L"ppt/slideLayouts", L"slideLayout.xml",
												_T("application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml"),
												_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout"));

		const FileType SlideComments(L"ppt/comments", L"comment.xml",
												_T("application/vnd.openxmlformats-officedocument.presentationml.comment+xml"),
												_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/comments"));

		const FileType CommentAuthors(L"ppt", L"commentAuthors.xml",
												_T("application/vnd.openxmlformats-officedocument.presentationml.commentAuthors.main+xml"),
												_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/commentAuthors"));

		const FileType SlideMaster(L"ppt/slideMasters", L"slideMaster.xml",
												_T("application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml"),
												_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster"));

		const FileType NotesSlide(L"ppt/notesSlides", L"notesSlide.xml",
												_T("application/vnd.openxmlformats-officedocument.presentationml.notesSlide+xml"),
												_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/notesSlide"));

		const FileType NotesMaster(L"ppt/notesMasters", L"notesMaster.xml",
												_T("application/vnd.openxmlformats-officedocument.presentationml.notesMaster+xml"),
												_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/notesMaster"));

		const FileType HandoutMaster(L"ppt/handoutMasters", L"handoutMaster.xml",
												_T("application/vnd.openxmlformats-officedocument.presentationml.handoutMaster+xml"),
												_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/handoutMaster"));

		const FileType Presentation(L"ppt", L"presentation.xml",
												_T("application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"),
												_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument"));

		const FileType PresProps(L"ppt", L"presProps.xml",
												_T("application/vnd.openxmlformats-officedocument.presentationml.presProps+xml"),
												_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/presProps"));

		const FileType TableStyles(L"ppt", L"tableStyles.xml",
												_T("application/vnd.openxmlformats-officedocument.presentationml.tableStyles+xml"),
												_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/tableStyles"));

		const FileType ViewProps(L"ppt", L"viewProps.xml",
												_T("application/vnd.openxmlformats-officedocument.presentationml.viewProps+xml"),
												_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/viewProps"));

		const FileType ThemePPTX(L"ppt/theme", L"theme.xml",
												_T("application/vnd.openxmlformats-officedocument.theme+xml"),
												_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme"));

		const FileType VmlDrawing(L"ppt", L"vmlDrawing.vml",
												_T(""),
												_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/vmlDrawing"));

		const FileType Media(L"ppt/media", L"", _T(""), 	_T("http://schemas.microsoft.com/office/2007/relationships/media"));


		const FileType Unknow(L"", L"", _T(""), _T(""));

	} 
} 

#endif // OOX_FILE_TYPES_INCLUDE_H_