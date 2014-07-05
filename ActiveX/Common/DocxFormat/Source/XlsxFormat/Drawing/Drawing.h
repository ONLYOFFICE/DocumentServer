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
#ifndef OOX_DRAWING_FILE_INCLUDE_H_
#define OOX_DRAWING_FILE_INCLUDE_H_

#include "../CommonInclude.h"

#include "Image.h"
#include "CellAnchor.h"

namespace OOX
{
	namespace Spreadsheet
	{
		class CDrawingWorksheet : public WritingElement
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CDrawingWorksheet)
			CDrawingWorksheet()
			{
			}
			virtual ~CDrawingWorksheet()
			{
			}

		public:
			virtual CString      toXML() const
			{
				return _T("");
			}
			virtual void toXML(CStringWriter& writer) const
			{
				if(m_oId.IsInit())
				{
					CString sVal;sVal.Format(_T("<drawing r:id=\"%s\"/>"), m_oId->GetValue());
					writer.WriteStringC(sVal);
				}
				
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}

			virtual EElementType getType () const
			{
				return et_FromTo;
			}

		private:
			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )

					WritingElement_ReadAttributes_Read_if     ( oReader, _T("r:id"),      m_oId )

					WritingElement_ReadAttributes_End( oReader )
			}
		public:
			nullable<SimpleTypes::CRelationshipId > m_oId;
		};
		class CDrawing : public OOX::FileGlobalEnumerated, public OOX::Spreadsheet::IFileContainer
		{
		public:
			CDrawing()
			{
			}
			CDrawing(const CPath& oPath)
			{
				read( oPath );
			}
			virtual ~CDrawing()
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
				if ( _T("xdr:wsDr") == sName )
				{
					ReadAttributes( oReader );

					if ( !oReader.IsEmptyNode() )
					{
						int nStylesDepth = oReader.GetDepth();
						while ( oReader.ReadNextSiblingNode( nStylesDepth ) )
						{
							sName = oReader.GetName();

							CCellAnchor *pItem = NULL;

							if ( _T("xdr:absoluteAnchor") == sName )
							{
								pItem = new CCellAnchor( oReader );
								pItem->m_oAnchorType.SetValue(SimpleTypes::Spreadsheet::cellanchorAbsolute);
							}
							else if ( _T("xdr:oneCellAnchor") == sName )
							{
								pItem = new CCellAnchor( oReader );
								pItem->m_oAnchorType.SetValue(SimpleTypes::Spreadsheet::cellanchorOneCell);
							}
							else if ( _T("xdr:twoCellAnchor") == sName )
							{
								pItem = new CCellAnchor( oReader );
								pItem->m_oAnchorType.SetValue(SimpleTypes::Spreadsheet::cellanchorTwoCell);
							}

							if ( pItem )
									m_arrItems.Add( pItem );
						}
					}
				}		
			}
			virtual void write(const CPath& oPath, const CPath& oDirectory, CContentTypes& oContent) const
			{
				CStringWriter sXml;
				sXml.WriteStringC(_T("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><xdr:wsDr xmlns:xdr=\"http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing\" xmlns:a=\"http://schemas.openxmlformats.org/drawingml/2006/main\" xmlns:r=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships\">"));
				for(int i = 0, length = m_arrItems.GetSize(); i < length; ++i)
					m_arrItems[i]->toXML(sXml);
				sXml.WriteStringC(_T("</xdr:wsDr>"));				

				CDirectory::SaveToFile( oPath.GetPath(), sXml.GetCString() );
				oContent.Registration( type().OverrideType(), oDirectory, oPath.GetFilename() );
				IFileContainer::Write(oPath, oDirectory, oContent);
			}
			virtual const OOX::FileType type() const
			{
				return OOX::Spreadsheet::FileTypes::Drawings;
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
			const OOX::RId AddImage (CString& sSrc)
			{
				smart_ptr<OOX::File> oImage = smart_ptr<OOX::File>( new OOX::Spreadsheet::Image( sSrc ) );
				const OOX::RId rId = Add( oImage );
				return rId;
			}
		private:
			CPath									m_oReadPath;
			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
			}
			void ClearItems()
			{
				for ( int nIndex = 0; nIndex < m_arrItems.GetSize(); nIndex++ )
				{
					if ( m_arrItems[nIndex] )
						delete m_arrItems[nIndex];

					m_arrItems[nIndex] = NULL;
				}

				m_arrItems.RemoveAll();
			}

		public:
			CSimpleArray<CCellAnchor *>         m_arrItems;
		};
	} 
} 

#endif // OOX_DRAWING_FILE_INCLUDE_H_