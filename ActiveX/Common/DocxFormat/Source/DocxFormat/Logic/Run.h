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
#ifndef OOX_LOGIC_RUN_INCLUDE_H_
#define OOX_LOGIC_RUN_INCLUDE_H_

#include "RunProperty.h"
#include "RunContent.h"
#include "FldChar.h"
#include "FldSimple.h"

#include "../Drawing/Drawing.h"
#include "Pict.h"
#include "Annotations.h"
#include "AlternateContent.h"
#include "../../XlsxFormat/Chart/ChartStyle.h"

namespace OOX
{
	namespace Logic
	{
		
		
		
		class CRun : public WritingElement
		{
		public:
			CRun()
			{
			}
			CRun(XmlUtils::CXmlNode &oNode)
			{
				fromXML( oNode );
			}
			CRun(XmlUtils::CXmlLiteReader& oReader)
			{
				fromXML( oReader );
			}
			virtual ~CRun()
			{
				Clear();
			}

		public:

			const CRun &operator =(const XmlUtils::CXmlNode& oNode)
			{
				Clear();
				fromXML( (XmlUtils::CXmlNode&)oNode );
				return *this;
			}
			const CRun &operator =(const XmlUtils::CXmlLiteReader& oReader)
			{
				Clear();
				fromXML( (XmlUtils::CXmlLiteReader&)oReader );
				return *this;
			}

			void Clear()
			{
				m_oRsidDel.reset();
				m_oRsidR.reset();
				m_oRsidRPr.reset();

				for ( int nIndex = 0; nIndex < m_arrItems.GetSize(); nIndex++ )
				{
					if ( m_arrItems[nIndex] )
						delete m_arrItems[nIndex];

					m_arrItems[nIndex] = NULL;
				}

				m_arrItems.RemoveAll();

				for ( int nIndex = 0; nIndex < m_arrSpreadsheetItems.GetSize(); nIndex++ )
				{
					if ( m_arrItems[nIndex] )
						delete m_arrSpreadsheetItems[nIndex];

					m_arrSpreadsheetItems[nIndex] = NULL;
				}

				m_arrSpreadsheetItems.RemoveAll();
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("w:rsidDel"), m_oRsidDel );
				oNode.ReadAttributeBase( _T("w:rsidR"),   m_oRsidR );
				oNode.ReadAttributeBase( _T("w:rsidRPr"), m_oRsidRPr );

				XmlUtils::CXmlNodes oChilds;
				if ( oNode.GetNodes( _T("*"), oChilds ) )
				{
					XmlUtils::CXmlNode oItem;
					for ( int nIndex = 0; nIndex < oChilds.GetCount(); nIndex++ )
					{
						if ( oChilds.GetAt( nIndex, oItem ) )
						{
							CString sName = oItem.GetName();
							WritingElement *pItem = NULL;

							if ( _T("w:annotationRef") == sName )
								pItem = new CAnnotationRef( oItem );
							else if ( _T("w:br") == sName )
								pItem = new CBr( oItem );
							else if ( _T("w:commentReference") == sName )
								pItem = new CCommentReference( oItem );
							else if ( _T("w:contentPart") == sName )
								pItem = new CContentPart( oItem );
							else if ( _T("w:continuationSeparator") == sName )
								pItem = new CContinuationSeparator( oItem );
							else if ( _T("w:cr") == sName )
								pItem = new CCr( oItem );
							else if ( _T("w:dayLong") == sName )
								pItem = new CDayLong( oItem );
							else if ( _T("w:dayShort") == sName )
								pItem = new CDayShort( oItem );
							else if ( _T("w:delInstrText") == sName )
								pItem = new CDelInstrText( oItem );
							else if ( _T("w:delText") == sName )
								pItem = new CDelText( oItem );
							else if ( _T("w:drawing") == sName ) 
								pItem = new CDrawing( oItem );
							else if ( _T("w:endnoteRef") == sName )
								pItem = new CEndnoteRef( oItem );
							else if ( _T("w:endnoteReference") == sName )
								pItem = new CEndnoteReference( oItem );
							else if ( _T("w:fldChar") == sName )
								pItem = new CFldChar( oItem );
							else if ( _T("w:footnoteRef") == sName )
								pItem = new CFootnoteRef( oItem );
							else if ( _T("w:footnoteReference") == sName )
								pItem = new CFootnoteReference( oItem );
							else if ( _T("w:instrText") == sName )
								pItem = new CInstrText( oItem );
							else if ( _T("w:lastRenderedPageBreak") == sName )
								pItem = new CLastRenderedPageBreak( oItem );
							else if ( _T("w:monthLong") == sName )
								pItem = new CMonthLong( oItem );
							else if ( _T("w:monthShort") == sName )
								pItem = new CMonthShort( oItem );
							else if ( _T("w:noBreakHyphen") == sName )
								pItem = new CNoBreakHyphen( oItem );
							else if ( _T("w:object") == sName )
								pItem = new CPicture( oItem );
							else if ( _T("w:pgNum") == sName )
								pItem = new CPgNum( oItem );
							else if ( _T("w:pict") == sName )
								pItem = new CPicture( oItem );
							else if ( _T("w:ptab") == sName )
								pItem = new CPTab( oItem );
							else if ( _T("w:rPr") == sName )
								pItem = new CRunProperty( oItem );
							else if ( _T("w:ruby") == sName )
								pItem = new CRuby( oItem );
							else if ( _T("w:separator") == sName )
								pItem = new CSeparator( oItem );
							else if ( _T("w:softHyphen") == sName )
								pItem = new CSoftHyphen( oItem );
							else if ( _T("w:sym") == sName )
								pItem = new CSym( oItem );
							else if ( _T("w:t") == sName )
								pItem = new CText( oItem );
							else if ( _T("w:tab") == sName )
								pItem = new CTab( oItem );
							else if ( _T("w:yearLong") == sName )
								pItem = new CYearLong( oItem );
							else if ( _T("w:yearShort") == sName )
								pItem = new CYearShort( oItem );

							if ( pItem )
								m_arrItems.Add( pItem );
						}
					}
				}
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( oReader.IsEmptyNode() )
					return;

				int nParentDepth = oReader.GetDepth();
				while( oReader.ReadNextSiblingNode( nParentDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();
					WritingElement *pItem = NULL;
					OOX::Spreadsheet::WritingElement *pSpreadsheetItem = NULL;

					if ( _T("mc:AlternateContent") == sName )
						pItem = new CAlternateContent( oReader );
					else if ( _T("w:annotationRef") == sName )
						pItem = new CAnnotationRef( oReader );
					else if ( _T("w:br") == sName )
						pItem = new CBr( oReader );
					else if ( _T("w:commentReference") == sName )
						pItem = new CCommentReference( oReader );
					else if ( _T("w:contentPart") == sName )
						pItem = new CContentPart( oReader );
					else if ( _T("w:continuationSeparator") == sName )
						pItem = new CContinuationSeparator( oReader );
					else if ( _T("w:cr") == sName )
						pItem = new CCr( oReader );
					else if ( _T("w:dayLong") == sName )
						pItem = new CDayLong( oReader );
					else if ( _T("w:dayShort") == sName )
						pItem = new CDayShort( oReader );
					else if ( _T("w:delInstrText") == sName )
						pItem = new CDelInstrText( oReader );
					else if ( _T("w:delText") == sName )
						pItem = new CDelText( oReader );
					else if ( _T("w:drawing") == sName ) 
						pItem = new CDrawing( oReader );
					else if ( _T("w:endnoteRef") == sName )
						pItem = new CEndnoteRef( oReader );
					else if ( _T("w:endnoteReference") == sName )
						pItem = new CEndnoteReference( oReader );
					else if ( _T("w:fldChar") == sName )
						pItem = new CFldChar( oReader );
					else if ( _T("w:footnoteRef") == sName )
						pItem = new CFootnoteRef( oReader );
					else if ( _T("w:footnoteReference") == sName )
						pItem = new CFootnoteReference( oReader );
					else if ( _T("w:instrText") == sName )
						pItem = new CInstrText( oReader );
					else if ( _T("w:lastRenderedPageBreak") == sName )
						pItem = new CLastRenderedPageBreak( oReader );
					else if ( _T("w:monthLong") == sName )
						pItem = new CMonthLong( oReader );
					else if ( _T("w:monthShort") == sName )
						pItem = new CMonthShort( oReader );
					else if ( _T("w:noBreakHyphen") == sName )
						pItem = new CNoBreakHyphen( oReader );
					else if ( _T("w:object") == sName )
						pItem = new CPicture( oReader );
					else if ( _T("w:pgNum") == sName )
						pItem = new CPgNum( oReader );
					else if ( _T("w:pict") == sName )
						pItem = new CPicture( oReader );
					else if ( _T("w:ptab") == sName )
						pItem = new CPTab( oReader );
					else if ( _T("w:rPr") == sName )
						pItem = new CRunProperty( oReader );
					else if ( _T("w:ruby") == sName )
						pItem = new CRuby( oReader );
					else if ( _T("w:separator") == sName )
						pItem = new CSeparator( oReader );
					else if ( _T("w:softHyphen") == sName )
						pItem = new CSoftHyphen( oReader );
					else if ( _T("w:sym") == sName )
						pItem = new CSym( oReader );
					else if ( _T("w:t") == sName )
						pItem = new CText( oReader );
					else if ( _T("w:tab") == sName )
						pItem = new CTab( oReader );
					else if ( _T("w:yearLong") == sName )
						pItem = new CYearLong( oReader );
					else if ( _T("c:style") == sName )
						pSpreadsheetItem = new OOX::Spreadsheet::CChartStyle( oReader );
					else if ( _T("c14:style") == sName )
						pSpreadsheetItem = new OOX::Spreadsheet::CChartStyle( oReader );

					if ( pItem )
						m_arrItems.Add( pItem );
					if ( pSpreadsheetItem )
						m_arrSpreadsheetItems.Add( pSpreadsheetItem );
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<w:r ");

				ComplexTypes_WriteAttribute( _T("w:rsidDel=\""), m_oRsidDel );
				ComplexTypes_WriteAttribute( _T("w:rsidR=\""),   m_oRsidR );
				ComplexTypes_WriteAttribute( _T("w:rsidRPr=\""), m_oRsidRPr );

				sResult += _T(">");

				for ( int nIndex = 0; nIndex < m_arrItems.GetSize(); nIndex++ )
				{
					if ( m_arrItems[nIndex] )
					{
						sResult += m_arrItems[nIndex]->toXML();
					}
				}
				for ( int nIndex = 0; nIndex < m_arrSpreadsheetItems.GetSize(); nIndex++ )
				{
					if ( m_arrSpreadsheetItems[nIndex] )
					{
						sResult += m_arrSpreadsheetItems[nIndex]->toXML();
					}
				}
				

				sResult += _T("</w:r>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return et_w_r;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				if ( oReader.GetAttributesCount() <= 0 )
					return;

				if ( !oReader.MoveToFirstAttribute() )
					return;

				CWCharWrapper wsName = oReader.GetName();
				while( !wsName.IsNull() )
				{
					if ( _T("w:rsidDel") == wsName )
						m_oRsidDel = oReader.GetText();
					else if ( _T("w:rsidR") == wsName )
						m_oRsidR = oReader.GetText();
					else if ( _T("w:rsidRPr") == wsName )
						m_oRsidRPr = oReader.GetText();

					if ( !oReader.MoveToNextAttribute() )
						break;

					wsName = oReader.GetName();
				}

				oReader.MoveToElement();
			}

		public:

			
			nullable<SimpleTypes::CLongHexNumber<> > m_oRsidDel;
			nullable<SimpleTypes::CLongHexNumber<> > m_oRsidR;
			nullable<SimpleTypes::CLongHexNumber<> > m_oRsidRPr;

			
			CSimpleArray<WritingElement *> m_arrItems;
			CSimpleArray<OOX::Spreadsheet::WritingElement *> m_arrSpreadsheetItems;
		};
	} 
} 

#endif // OOX_LOGIC_RUN_INCLUDE_H_