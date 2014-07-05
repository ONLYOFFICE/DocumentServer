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
		const FileType App(OOX::CPath(L"docProps"),			OOX::CPath(L"app.xml"),				L"application/vnd.openxmlformats-officedocument.extended-properties+xml", L"http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties");
		const FileType Core(OOX::CPath(L"docProps"),		OOX::CPath(L"core.xml"),			L"application/vnd.openxmlformats-package.core-properties+xml", L"http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties");
		const FileType Document(OOX::CPath(L"word"),		OOX::CPath(L"document.xml"),		L"application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml", L"http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument");
		const FileType Theme(OOX::CPath(L"theme"),			OOX::CPath(L"theme.xml"),			L"application/vnd.openxmlformats-officedocument.theme+xml", L"http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme");
		const FileType Setting(OOX::CPath(L""),				OOX::CPath(L"settings.xml"),		L"application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml", L"http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings");
		const FileType FontTable(OOX::CPath(L""),			OOX::CPath(L"fontTable.xml"),		L"application/vnd.openxmlformats-officedocument.wordprocessingml.fontTable+xml", L"http://schemas.openxmlformats.org/officeDocument/2006/relationships/fontTable");
		const FileType Style(OOX::CPath(L""),				OOX::CPath(L"styles.xml"),			L"application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml", L"http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles");
		const FileType Item(OOX::CPath(L"customXml"),		OOX::CPath(L"item.xml"),			L"WARNING not implement", L"http://schemas.openxmlformats.org/officeDocument/2006/relationships/customXml");
		const FileType FootNote(OOX::CPath(L""),			OOX::CPath(L"footnotes.xml"),		L"application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml", L"http://schemas.openxmlformats.org/officeDocument/2006/relationships/footnotes");
		const FileType EndNote(OOX::CPath(L""),				OOX::CPath(L"endnotes.xml"),		L"application/vnd.openxmlformats-officedocument.wordprocessingml.endnotes+xml", L"http://schemas.openxmlformats.org/officeDocument/2006/relationships/endnotes");
		const FileType WebSetting(OOX::CPath(L""),			OOX::CPath(L"webSettings.xml"),		L"application/vnd.openxmlformats-officedocument.wordprocessingml.webSettings+xml", L"http://schemas.openxmlformats.org/officeDocument/2006/relationships/webSettings");
		const FileType Header(OOX::CPath(L""),				OOX::CPath(L"header.xml"),			L"application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml", L"http://schemas.openxmlformats.org/officeDocument/2006/relationships/header");
		const FileType Footer(OOX::CPath(L""),				OOX::CPath(L"footer.xml"), 			L"application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml", L"http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer");	
		const FileType Numbering(OOX::CPath(L""),			OOX::CPath(L"numbering.xml"), 		L"application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml", L"http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering");
		const FileType ItemProp(OOX::CPath(L"customXml"),	OOX::CPath(L"itemProps.xml"),		L"application/vnd.openxmlformats-officedocument.customXmlProperties+xml", L"http://schemas.openxmlformats.org/officeDocument/2006/relationships/customXmlProps");
		const FileType HyperLink(OOX::CPath(L""),			OOX::CPath(L""),					L"", L"http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink");
		const FileType ExternalImage(OOX::CPath(L""),		OOX::CPath(L""),					L"", L"http://schemas.openxmlformats.org/officeDocument/2006/relationships/image");
		const FileType ExternalAudio(OOX::CPath(L""),		OOX::CPath(L""),					L"", L"http://schemas.openxmlformats.org/officeDocument/2006/relationships/audio");
		const FileType ExternalVideo(OOX::CPath(L""),		OOX::CPath(L""),					L"", L"http://schemas.openxmlformats.org/officeDocument/2006/relationships/video");
		const FileType Image(OOX::CPath(L"media"),			OOX::CPath(L"image"),				L"", L"http://schemas.openxmlformats.org/officeDocument/2006/relationships/image");
		const FileType Audio(OOX::CPath(L"media"),			OOX::CPath(L"audio"),				L"", L"http://schemas.openxmlformats.org/officeDocument/2006/relationships/audio");
		const FileType Video(OOX::CPath(L"media"),			OOX::CPath(L"video"),				L"", L"http://schemas.openxmlformats.org/officeDocument/2006/relationships/video");
		const FileType Data(OOX::CPath(L"diagrams"),		OOX::CPath(L"data.xml"),			L"application/vnd.openxmlformats-officedocument.drawingml.diagramData+xml", L"http://schemas.openxmlformats.org/officeDocument/2006/relationships/diagramData");
		const FileType Layout(OOX::CPath(L"diagrams"),		OOX::CPath(L"layout.xml"),			L"application/vnd.openxmlformats-officedocument.drawingml.diagramLayout+xml", L"http://schemas.openxmlformats.org/officeDocument/2006/relationships/diagramLayout");
		const FileType Colors(OOX::CPath(L"diagrams"),		OOX::CPath(L"colors.xml"),			L"application/vnd.openxmlformats-officedocument.drawingml.diagramColors+xml", L"http://schemas.openxmlformats.org/officeDocument/2006/relationships/diagramColors");
		const FileType QuickStyle(OOX::CPath(L"diagrams"),	OOX::CPath(L"quickStyle.xml"),		L"application/vnd.openxmlformats-officedocument.drawingml.diagramStyle+xml", L"http://schemas.openxmlformats.org/officeDocument/2006/relationships/diagramQuickStyle");
		const FileType Chart(OOX::CPath(L"charts"),			OOX::CPath(L"chart.xml"),			L"application/vnd.openxmlformats-officedocument.drawingml.chart+xml", L"http://schemas.openxmlformats.org/officeDocument/2006/relationships/chart");		
		const FileType MicrosoftOfficeExcelWorksheet(						OOX::CPath(L"embeddings"),	OOX::CPath(L"Microsoft_Office_Excel_Worksheet.xlsx"), L"", L"http://schemas.openxmlformats.org/officeDocument/2006/relationships/package");
		const FileType MicrosoftOfficeExcel_97_2003_Worksheet(				OOX::CPath(L"embeddings"),	OOX::CPath(L"Microsoft_Office_Excel_97-2003_Worksheet.xls"), L"", L"http://schemas.openxmlformats.org/officeDocument/2006/relationships/oleObject");
		const FileType MicrosoftOfficeExcelBinaryWorksheet(					OOX::CPath(L"embeddings"),	OOX::CPath(L"Microsoft_Office_Excel_Binary_Worksheet.xlsb"), L"", L"http://schemas.openxmlformats.org/officeDocument/2006/relationships/package");
		const FileType MicrosoftOfficeExcelMacro_EnabledWorksheet(			OOX::CPath(L"embeddings"),	OOX::CPath(L"Microsoft_Office_Excel_Macro-Enabled_Worksheet.xlsm"), L"", L"http://schemas.openxmlformats.org/officeDocument/2006/relationships/package");
		const FileType MicrosoftOfficeExcelChart(							OOX::CPath(L"embeddings"),	OOX::CPath(L"Microsoft_Office_Excel_Chart.xlsx"), L"", L"http://schemas.openxmlformats.org/officeDocument/2006/relationships/oleObject");
		const FileType MicrosoftOfficeWordDocument(							OOX::CPath(L"embeddings"),	OOX::CPath(L"Microsoft_Office_Word_Document.docx"), L"", L"http://schemas.openxmlformats.org/officeDocument/2006/relationships/package");
		const FileType MicrosoftOfficeWord_97_2003_Document(				OOX::CPath(L"embeddings"),	OOX::CPath(L"Microsoft_Office_Word_97_-_2003_Document.doc"), L"", L"http://schemas.openxmlformats.org/officeDocument/2006/relationships/oleObject");
		const FileType MicrosoftOfficeWordMacro_EnabledDocument(			OOX::CPath(L"embeddings"),	OOX::CPath(L"Microsoft_Office_Word_Macro-Enabled_Document.docm"), L"", L"http://schemas.openxmlformats.org/officeDocument/2006/relationships/package");
		const FileType MicrosoftOfficePowerPointPresentation(				OOX::CPath(L"embeddings"),	OOX::CPath(L"Microsoft_Office_PowerPoint_Presentation.pptx"), L"", L"http://schemas.openxmlformats.org/officeDocument/2006/relationships/package");
		const FileType MicrosoftOfficePowerPoint_97_2003_Presentation(		OOX::CPath(L"embeddings"),	OOX::CPath(L"Microsoft_Office_PowerPoint_97-2003_Presentation.xlsx"), L"", L"http://schemas.openxmlformats.org/officeDocument/2006/relationships/oleObject");
		const FileType MicrosoftOfficePowerPointMacro_EnabledPresentation(	OOX::CPath(L"embeddings"),	OOX::CPath(L"Microsoft_Office_PowerPoint_Macro-Enabled_Presentation.pptm"), L"", L"http://schemas.openxmlformats.org/officeDocument/2006/relationships/package");		
		const FileType MicrosoftOfficePowerPointSlide(						OOX::CPath(L"embeddings"),	OOX::CPath(L"Microsoft_Office_PowerPoint_Slide.sldx"), L"", L"http://schemas.openxmlformats.org/officeDocument/2006/relationships/package");
		const FileType MicrosoftOfficePowerPointMacro_EnabledSlide(			OOX::CPath(L"embeddings"),	OOX::CPath(L"Microsoft_Office_PowerPoint_Macro-Enabled_Slide.sldm"), L"", L"http://schemas.openxmlformats.org/officeDocument/2006/relationships/package");						
		const FileType OleObject(OOX::CPath(L"embeddings"), OOX::CPath(L"oleObject.bin"),		L"", L"http://schemas.openxmlformats.org/officeDocument/2006/relationships/oleObject");		
		const FileType Glossary(OOX::CPath(L"glossary"),	OOX::CPath(L"document.xml"),		L"application/vnd.openxmlformats-officedocument.wordprocessingml.document.glossary+xml", L"http://schemas.openxmlformats.org/officeDocument/2006/relationships/glossaryDocument");
		const FileType Slide(OOX::CPath(L""),				OOX::CPath(L"slide.xml"),			L"application/vnd.openxmlformats-officedocument.presentationml.slide+xml", L"http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide");
		const FileType SlideLayout(OOX::CPath(L""),			OOX::CPath(L"slideLayout.xml"),		L"application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml", L"http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout");
		const FileType SlideMaster(OOX::CPath(L""),			OOX::CPath(L"slideMaster.xml"),		L"application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml", L"http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster");
		const FileType NotesSlide(OOX::CPath(L""),			OOX::CPath(L"notesSlide.xml"),		L"application/vnd.openxmlformats-officedocument.presentationml.notesSlide+xml", L"http://schemas.openxmlformats.org/officeDocument/2006/relationships/notesSlide");
		const FileType NotesMaster(OOX::CPath(L""),			OOX::CPath(L"notesMaster.xml"),		L"application/vnd.openxmlformats-officedocument.presentationml.notesMaster+xml", L"http://schemas.openxmlformats.org/officeDocument/2006/relationships/notesMaster");
		const FileType HandoutMaster(OOX::CPath(L""),		OOX::CPath(L"handoutMaster.xml"),	L"application/vnd.openxmlformats-officedocument.presentationml.handoutMaster+xml", L"http://schemas.openxmlformats.org/officeDocument/2006/relationships/handoutMaster");
		const FileType Presentation(OOX::CPath(L"ppt"),		OOX::CPath(L"presentation.xml"),	L"application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml", L"http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument");
		const FileType PresProps(OOX::CPath(L""),			OOX::CPath(L"presProps.xml"),		L"application/vnd.openxmlformats-officedocument.presentationml.presProps+xml", L"http://schemas.openxmlformats.org/officeDocument/2006/relationships/presProps");
		const FileType TableStyles(OOX::CPath(L""),			OOX::CPath(L"tableStyles.xml"),		L"application/vnd.openxmlformats-officedocument.presentationml.tableStyles+xml", L"http://schemas.openxmlformats.org/officeDocument/2006/relationships/tableStyles");
		const FileType ViewProps(OOX::CPath(L""),			OOX::CPath(L"viewProps.xml"),		L"application/vnd.openxmlformats-officedocument.presentationml.viewProps+xml", L"http://schemas.openxmlformats.org/officeDocument/2006/relationships/viewProps");
		const FileType ThemePPTX(OOX::CPath(L""),			OOX::CPath(L"theme.xml"),			L"application/vnd.openxmlformats-officedocument.theme+xml", L"http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme");
		const FileType VmlDrawing(OOX::CPath(L""),			OOX::CPath(L"vmlDrawing.vml"),		L"", L"http://schemas.openxmlformats.org/officeDocument/2006/relationships/vmlDrawing");
		const FileType Unknow(OOX::CPath(L""),				OOX::CPath(L""),					L"", L"");

	} 
} 

#endif // OOX_FILE_TYPES_INCLUDE_H_