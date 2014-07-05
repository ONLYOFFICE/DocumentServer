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
#ifndef OOX_STYLES_FILE_INCLUDE_H_
#define OOX_STYLES_FILE_INCLUDE_H_

#include "../CommonInclude.h"

#include "Borders.h"
#include "CellStyles.h"
#include "Xfs.h"
#include "Colors.h"
#include "Dxf.h"
#include "Fills.h"
#include "Fonts.h"
#include "NumFmts.h"
#include "TableStyles.h"

namespace OOX
{
	namespace Spreadsheet
	{
		
		
		class CStyles : public OOX::File, public OOX::Spreadsheet::IFileContainer
		{
		public:
			CStyles()
			{
			}
			CStyles(const CPath& oPath)
			{
				read( oPath );
			}
			virtual ~CStyles()
			{
			}
		public:

			virtual void read(const CPath& oPath)
			{
				m_oReadPath = oPath;
				IFileContainer::Read( oPath );

				XmlUtils::CXmlLiteReader oReader;

				if ( !oReader.FromFile( oPath.GetPath() ) )
					return;

				if ( !oReader.ReadNextNode() )
					return;

				CWCharWrapper sName = oReader.GetName();
				if ( _T("styleSheet") == sName )
				{
					ReadAttributes( oReader );

					if ( !oReader.IsEmptyNode() )
					{
						int nStylesDepth = oReader.GetDepth();
						while ( oReader.ReadNextSiblingNode( nStylesDepth ) )
						{
							sName = oReader.GetName();

							if ( _T("borders") == sName )
								m_oBorders = oReader;
							else if ( _T("cellStyles") == sName )
								m_oCellStyles = oReader;
							else if ( _T("cellStyleXfs") == sName )
								m_oCellStyleXfs = oReader;
							else if ( _T("cellXfs") == sName )
								m_oCellXfs = oReader;
							else if ( _T("colors") == sName )
								m_oColors = oReader;
							else if ( _T("dxfs") == sName )
								m_oDxfs = oReader;
							
							
							else if ( _T("fills") == sName )
								m_oFills = oReader;
							else if ( _T("fonts") == sName )
								m_oFonts = oReader;
							else if ( _T("numFmts") == sName )
								m_oNumFmts = oReader;
							else if ( _T("tableStyles") == sName )
								m_oTableStyles = oReader;
						}
					}
				}		
			}
			virtual void write(const CPath& oPath, const CPath& oDirectory, CContentTypes& oContent) const
			{
				CStringWriter sXml;
				sXml.WriteStringC(_T("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><styleSheet xmlns=\"http://schemas.openxmlformats.org/spreadsheetml/2006/main\" xmlns:mc=\"http://schemas.openxmlformats.org/markup-compatibility/2006\" mc:Ignorable=\"x14ac\" xmlns:x14ac=\"http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac\">"));
				if(m_oNumFmts.IsInit())
					m_oNumFmts->toXML(sXml);
				if(m_oFonts.IsInit())
					m_oFonts->toXML(sXml);
				if(m_oFills.IsInit())
					m_oFills->toXML(sXml);
				if(m_oBorders.IsInit())
					m_oBorders->toXML(sXml);
				if(m_oCellStyleXfs.IsInit())
					m_oCellStyleXfs->toXML(sXml);
				if(m_oCellXfs.IsInit())
					m_oCellXfs->toXML(sXml);
				if(m_oCellStyles.IsInit())
					m_oCellStyles->toXML(sXml);
				if(m_oColors.IsInit())
					m_oColors->toXML(sXml);
				if(m_oDxfs.IsInit())
					m_oDxfs->toXML(sXml);
				if(m_oTableStyles.IsInit())
					m_oTableStyles->toXML(sXml);
				sXml.WriteStringC(_T("</styleSheet>"));

				CDirectory::SaveToFile( oPath.GetPath(), sXml.GetCString() );
				oContent.Registration( type().OverrideType(), oDirectory, oPath.GetFilename() );
			}
			void PrepareToWrite()
			{
				
				if(false == m_oFills.IsInit())
					m_oFills.Init();
				
				if(m_oCellXfs.IsInit())
				{
					for(int i = 0, length = m_oCellXfs->m_arrItems.GetSize(); i < length; ++i)
					{
						OOX::Spreadsheet::CXfs* xfs = m_oCellXfs->m_arrItems[i];
						if (false == xfs->m_oXfId.IsInit())
						{
							xfs->m_oXfId.Init();
							xfs->m_oXfId->SetValue(0);
						}
					}
				}
				
				if(false == m_oCellStyles.IsInit())
					m_oCellStyles.Init();
				if(false == m_oCellStyles->m_oCount.IsInit())
				{
					m_oCellStyles->m_oCount.Init();
					m_oCellStyles->m_oCount->SetValue(1);
				}
				if(0 == m_oCellStyles->m_arrItems.GetSize())
				{
					CCellStyle* pCellStyle = new CCellStyle();
					pCellStyle->m_oName = _T("Normal");
					pCellStyle->m_oXfId.Init();
					pCellStyle->m_oXfId->SetValue(0);
					pCellStyle->m_oBuiltinId.Init();
					pCellStyle->m_oBuiltinId->SetValue(0);
					m_oCellStyles->m_arrItems.Add(pCellStyle);
				}
				
				if(false == m_oCellStyleXfs.IsInit())
					m_oCellStyleXfs.Init();
				if(false == m_oCellStyleXfs->m_oCount.IsInit())
				{
					m_oCellStyleXfs->m_oCount.Init();
					m_oCellStyleXfs->m_oCount->SetValue(1);
				}
				if(0 == m_oCellStyleXfs->m_arrItems.GetSize())
				{
					CXfs* pXfs = new CXfs();
					pXfs->m_oNumFmtId.Init();
					pXfs->m_oNumFmtId->SetValue(0);
					pXfs->m_oFontId.Init();
					pXfs->m_oFontId->SetValue(0);
					pXfs->m_oFillId.Init();
					pXfs->m_oFillId->SetValue(0);
					pXfs->m_oBorderId.Init();
					pXfs->m_oBorderId->SetValue(0);
					m_oCellStyleXfs->m_arrItems.Add(pXfs);
				}
				
				if(false == m_oDxfs.IsInit())
					m_oDxfs.Init();
				if(false == m_oDxfs->m_oCount.IsInit())
				{
					m_oDxfs->m_oCount.Init();
					m_oDxfs->m_oCount->SetValue(0);
				}
				
				if(false == m_oTableStyles.IsInit())
				{
					m_oTableStyles.Init();
					m_oTableStyles->m_oCount.Init();
					m_oTableStyles->m_oCount->SetValue(0);
				}
				if(false == m_oTableStyles->m_oDefaultPivotStyle.IsInit())
					m_oTableStyles->m_oDefaultTableStyle = _T("TableStyleMedium2");
				if(false == m_oTableStyles->m_oDefaultPivotStyle.IsInit())
					m_oTableStyles->m_oDefaultPivotStyle = _T("PivotStyleLight16");
			}
			virtual const OOX::FileType type() const
			{
				return OOX::Spreadsheet::FileTypes::Styles;
			}
			virtual const CPath DefaultDirectory() const
			{
				return type().DefaultDirectory();
			}
			virtual const CPath DefaultFileName() const
			{
				return type().DefaultFileName();
			}
			const CPath& GetReadPath()
			{
				return m_oReadPath;
			}

		private:
			CPath									m_oReadPath;
			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
			}

		public:
			nullable<OOX::Spreadsheet::CBorders>		m_oBorders;
			nullable<OOX::Spreadsheet::CCellStyles>		m_oCellStyles;
			nullable<OOX::Spreadsheet::CCellStyleXfs>	m_oCellStyleXfs;
			nullable<OOX::Spreadsheet::CCellXfs>		m_oCellXfs;
			nullable<OOX::Spreadsheet::CColors>			m_oColors;
			nullable<OOX::Spreadsheet::CDxfs>			m_oDxfs;
			nullable<OOX::Spreadsheet::CFills>			m_oFills;
			nullable<OOX::Spreadsheet::CFonts>			m_oFonts;
			nullable<OOX::Spreadsheet::CNumFmts>		m_oNumFmts;
			nullable<OOX::Spreadsheet::CTableStyles>	m_oTableStyles;
		};
	} 
} 

#endif // OOX_STYLES_FILE_INCLUDE_H_