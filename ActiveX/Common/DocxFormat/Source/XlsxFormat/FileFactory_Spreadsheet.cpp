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
 
#include "CommonInclude.h"


#include "FileTypes_Spreadsheet.h"

#include "SharedStrings/SharedStrings.h"
#include "Styles/Styles.h"
#include "Workbook/Workbook.h"
#include "Worksheets/Worksheet.h"
#include "CalcChain/CalcChain.h"
#include "../DocxFormat/Theme/Theme.h"
#include "Drawing/Image.h"
#include "Table/Table.h"

namespace OOX
{
	namespace Spreadsheet
	{
		smart_ptr<OOX::File> CreateFile(const OOX::CPath& oPath, const OOX::Rels::CRelationShip& oRelation)
		{
			const CPath oFileName = oPath / oRelation.Filename();

			if ( oRelation.Type() == FileTypes::Workbook )
				return smart_ptr<OOX::File>(new CWorkbook( oFileName ));
			else if ( oRelation.Type() == FileTypes::SharedStrings )
				return smart_ptr<OOX::File>(new CSharedStrings( oFileName ));
			else if ( oRelation.Type() == FileTypes::Styles )
				return smart_ptr<OOX::File>(new CStyles( oFileName ));
			else if ( oRelation.Type() == FileTypes::Worksheet )
				return smart_ptr<OOX::File>(new CWorksheet( oFileName ));
			else if ( oRelation.Type() == OOX::FileTypes::Theme )
				return smart_ptr<OOX::File>(new CTheme( oFileName ));
			else if ( oRelation.Type() == FileTypes::Drawings )
				return smart_ptr<OOX::File>(new CDrawing( oFileName ));
			else if ( oRelation.Type() == FileTypes::CalcChain )
				return smart_ptr<OOX::File>(new CCalcChain( oFileName ));
			else if ( oRelation.Type() == OOX::FileTypes::Image )
				return smart_ptr<OOX::File>(new Image( oFileName ));
			else if ( oRelation.Type() == FileTypes::Chartsheets )
				return smart_ptr<OOX::File>(new CWorksheet( oFileName ));
			else if ( oRelation.Type() == FileTypes::Table )
				return smart_ptr<OOX::File>(new CTableFile( oFileName ));
			else if ( oRelation.Type() == FileTypes::LegacyDrawings )
				return smart_ptr<OOX::File>(new CLegacyDrawing( oFileName ));
			else if ( oRelation.Type() == FileTypes::Comments )
				return smart_ptr<OOX::File>(new CComments( oFileName ));
			else if ( oRelation.Type() == FileTypes::Charts )
				return smart_ptr<OOX::File>(new CChartSpace( oFileName ));

			return smart_ptr<OOX::File>( new UnknowTypeFile() );
		}
	}
} // namespace OOX