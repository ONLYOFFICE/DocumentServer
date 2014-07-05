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
#ifndef OOX_XSLXFILE_TYPES_SPREADSHEET_INCLUDE_H_
#define OOX_XSLXFILE_TYPES_SPREADSHEET_INCLUDE_H_

#include "../DocxFormat/FileType.h"


namespace OOX
{
	namespace Spreadsheet
	{
		namespace FileTypes
		{
			const FileType Workbook(L"xl", L"workbook.xml",
												_T("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"),
												_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument"));

			const FileType SharedStrings(L"", L"sharedStrings.xml",
												_T("application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"),
												_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings"));

			const FileType Styles(L"", L"styles.xml",
												_T("application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"),
												_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles"));

			const FileType Worksheet(L"worksheets", L"sheet.xml",
												_T("application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"),
												_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet"), true);

			const FileType Chartsheets(L"chartsheets", L"sheet.xml",
												_T("application/vnd.openxmlformats-officedocument.spreadsheetml.chartsheet+xml"),
												_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/chartsheet"), true);

			const FileType CalcChain(L"", L"calcChain.xml",
												_T("application/vnd.openxmlformats-officedocument.spreadsheetml.calcChain+xml"),
												_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/calcChain"));

			const FileType Drawings(L"../drawings", L"drawing.xml",
												_T("application/vnd.openxmlformats-officedocument.drawing+xml"),
												_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/drawing"), true, true);

			const FileType LegacyDrawings(L"../drawings", L"vmlDrawing.vml",
												_T(""),
												_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/vmlDrawing"), true, true);

			const FileType Comments(L"../", L"comments.xml",
												_T("application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml"),
												_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/comments"), true, true);

			const FileType Image(L"../media", L"image.jpg",
												_T(""),
												_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/image"));

			const FileType Charts(L"../charts", L"chart.xml",
												_T("application/vnd.openxmlformats-officedocument.drawingml.chart+xml"),
												_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/chart"), true, true);

			const FileType Table(L"../tables", L"table.xml",
												_T("application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml"),
												_T("http://schemas.openxmlformats.org/officeDocument/2006/relationships/table"), true, true);

			const FileType Unknown(L"", L"", _T(""), _T(""));

		} 
	}
} 

#endif // OOX_XSLXFILE_TYPES_SPREADSHEET_INCLUDE_H_