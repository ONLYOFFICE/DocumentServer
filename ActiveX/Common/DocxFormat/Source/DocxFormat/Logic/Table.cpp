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
 #include "Table.h" 
#include "Paragraph.h"
#include "Annotations.h"
#include "Sdt.h"
#include "../Math/oMathPara.h"
#include "../Math/oMath.h"

namespace OOX
{
	namespace Logic
	{
		
		
		
		CTblGridChange::CTblGridChange()
		{
			m_pTblGrid = new CTblGrid();

			if ( m_pTblGrid )
				m_pTblGrid->m_bTblGridChange = true;
		}
		CTblGridChange::CTblGridChange(XmlUtils::CXmlNode& oNode)
		{
			m_pTblGrid = new CTblGrid();

			if ( m_pTblGrid )
				m_pTblGrid->m_bTblGridChange = true;

			fromXML( oNode );
		}
		CTblGridChange::CTblGridChange(XmlUtils::CXmlLiteReader& oReader)
		{
			m_pTblGrid = new CTblGrid();

			if ( m_pTblGrid )
				m_pTblGrid->m_bTblGridChange = true;

			fromXML( oReader );
		}
		CTblGridChange::~CTblGridChange()
		{
			if ( m_pTblGrid )
				delete m_pTblGrid;
		}
		const CTblGridChange& CTblGridChange::operator = (const XmlUtils::CXmlNode &oNode)
		{
			fromXML( (XmlUtils::CXmlNode &)oNode );
			return *this;
		}
		const CTblGridChange& CTblGridChange::operator = (const XmlUtils::CXmlLiteReader& oReader)
		{
			fromXML( (XmlUtils::CXmlLiteReader&)oReader );
			return *this;
		}
		void CTblGridChange::fromXML(XmlUtils::CXmlLiteReader& oReader)
		{
			ReadAttributes( oReader );

			if ( oReader.IsEmptyNode() )
				return;

			int nParentDepth = oReader.GetDepth();
			while( oReader.ReadNextSiblingNode( nParentDepth ) )
			{
				CWCharWrapper sName = oReader.GetName();
				if ( m_pTblGrid && _T("w:tblGrid") == sName )
					m_pTblGrid->fromXML( oReader );
			}

		}
		void CTblGridChange::fromXML(XmlUtils::CXmlNode& oNode)
		{
			oNode.ReadAttributeBase( _T("w:id"),     m_oId );

			XmlUtils::CXmlNode oNode_tblGrid;

			if ( m_pTblGrid && oNode.GetNode( _T("w:tblGrid"), oNode_tblGrid ) )
				m_pTblGrid->fromXML( oNode_tblGrid );

		}
		CString CTblGridChange::toXML() const
		{			
			CString sResult = _T("<w:tblGridChange ");

			if ( m_oId.IsInit() )
			{
				sResult += "w:id=\"";
				sResult += m_oId->ToString();
				sResult += "\" ";
			}

			sResult += _T(">");

			if ( m_pTblGrid )
				sResult += m_pTblGrid->toXML();

			sResult += _T("</w:tblGridChange>");

			return sResult;
		}

		void CTblGridChange::ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
		{
			
			WritingElement_ReadAttributes_Start( oReader )
			WritingElement_ReadAttributes_ReadSingle( oReader, _T("w:id"), m_oId )
			WritingElement_ReadAttributes_End( oReader )
		}
		
		
		
		CTblPrExChange::CTblPrExChange()
		{
			m_pTblPrEx.Init();
			m_pTblPrEx->m_bTblPrExChange = true;
		}
		CTblPrExChange::CTblPrExChange(XmlUtils::CXmlNode& oNode)
		{
			m_pTblPrEx.Init();
			m_pTblPrEx->m_bTblPrExChange = true;

			fromXML( oNode );
		}
		CTblPrExChange::CTblPrExChange(XmlUtils::CXmlLiteReader& oReader)
		{
			m_pTblPrEx.Init();
			m_pTblPrEx->m_bTblPrExChange = true;

			fromXML( oReader );
		}
		CTblPrExChange::~CTblPrExChange()
		{
		}
		const CTblPrExChange& CTblPrExChange::operator = (const XmlUtils::CXmlNode &oNode)
		{
			fromXML( (XmlUtils::CXmlNode &)oNode );
			return *this;
		}
		const CTblPrExChange& CTblPrExChange::operator = (const XmlUtils::CXmlLiteReader& oReader)
		{
			fromXML( (XmlUtils::CXmlLiteReader&)oReader );
			return *this;
		}
		void CTblPrExChange::fromXML(XmlUtils::CXmlNode& oNode)
		{
			oNode.ReadAttributeBase( _T("w:author"), m_sAuthor );
			oNode.ReadAttributeBase( _T("w:date"),   m_oDate );
			oNode.ReadAttributeBase( _T("w:id"),     m_oId );

			XmlUtils::CXmlNode oNode_tblPrEx;

			if ( m_pTblPrEx.IsInit() && oNode.GetNode( _T("w:tblPrEx"), oNode_tblPrEx ) )
				m_pTblPrEx->fromXML( oNode_tblPrEx );

		}
		void CTblPrExChange::fromXML(XmlUtils::CXmlLiteReader& oReader)
		{
			ReadAttributes( oReader );

			if ( oReader.IsEmptyNode() )
				return;

			int nParentDepth = oReader.GetDepth();
			while( oReader.ReadNextSiblingNode( nParentDepth ) )
			{
				CWCharWrapper sName = oReader.GetName();
				if ( m_pTblPrEx.IsInit() && _T("w:tblPrEx") == sName )
					m_pTblPrEx->fromXML( oReader );
			}
		}
		CString CTblPrExChange::toXML() const
		{			
			CString sResult = _T("<w:tblPrExChange ");

			if ( m_sAuthor.IsInit() )
			{
				sResult += "w:author=\"";
				sResult += m_sAuthor->GetString();
				sResult += "\" ";
			}

			if ( m_oDate.IsInit() )
			{
				sResult += "w:date=\"";
				sResult += m_oDate->ToString();
				sResult += "\" ";
			}

			if ( m_oId.IsInit() )
			{
				sResult += "w:id=\"";
				sResult += m_oId->ToString();
				sResult += "\" ";
			}

			sResult += _T(">");

			if ( m_pTblPrEx.IsInit() )
				sResult += m_pTblPrEx->toXML();

			sResult += _T("</w:tblPrExChange>");

			return sResult;
		}

		void CTblPrExChange::ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
		{
			
			WritingElement_ReadAttributes_Start( oReader )
			WritingElement_ReadAttributes_Read_if     ( oReader, _T("w:author"), m_sAuthor )
			WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:date"),   m_oDate )
			WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:id"),     m_oId )
			WritingElement_ReadAttributes_End( oReader )
		}
		
		
		






		void    CTbl::fromXML(XmlUtils::CXmlNode& oNode)
		{
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

						if ( _T("w:bookmarkEnd") == sName )
							pItem = new CBookmarkEnd( oItem );
						else if ( _T("w:bookmarkStart") == sName )
							pItem = new CBookmarkStart( oItem );
						else if ( _T("w:commentRangeEnd") == sName )
							pItem = new CCommentRangeEnd( oItem );
						else if ( _T("w:commentRangeStart") == sName )
							pItem = new CCommentRangeStart( oItem );
						
						
						else if ( _T("w:customXmlDelRangeEnd") == sName )
							pItem = new CCustomXmlDelRangeEnd( oItem );
						else if ( _T("w:customXmlDelRangeStart") == sName )
							pItem = new CCustomXmlDelRangeStart( oItem );
						else if ( _T("w:customXmlInsRangeEnd") == sName )
							pItem = new CCustomXmlInsRangeEnd( oItem );
						else if ( _T("w:customXmlInsRangeStart") == sName )
							pItem = new CCustomXmlInsRangeStart( oItem );
						else if ( _T("w:customXmlMoveFromRangeEnd") == sName ) 
							pItem = new CCustomXmlMoveFromRangeEnd( oItem );
						else if ( _T("w:customXmlMoveFromRangeStart") == sName )
							pItem = new CCustomXmlMoveFromRangeStart( oItem );
						else if ( _T("w:customXmlMoveToRangeEnd") == sName ) 
							pItem = new CCustomXmlMoveToRangeEnd( oItem );
						else if ( _T("w:customXmlMoveToRangeStart") == sName )
							pItem = new CCustomXmlMoveToRangeStart( oItem );
						
						
						
						
						
						
						else if ( _T("w:moveFromRangeEnd") == sName )
							pItem = new CMoveToRangeEnd( oItem );
						else if ( _T("w:moveFromRangeStart") == sName )
							pItem = new CMoveToRangeStart( oItem );
						
						
						else if ( _T("w:moveToRangeEnd") == sName )
							pItem = new CMoveToRangeEnd( oItem );
						else if ( _T("w:moveToRangeStart") == sName )
							pItem = new CMoveToRangeStart( oItem );
						else if ( _T("m:oMath") == sName )
							pItem = new COMath( oItem );
						else if ( _T("m:oMathPara") == sName )
							pItem = new COMathPara( oItem );
						else if ( _T("w:permEnd") == sName )
							pItem = new CPermEnd( oItem );
						else if ( _T("w:permStart") == sName )
							pItem = new CPermStart( oItem );
						else if ( _T("w:proofErr") == sName )
							pItem = new CProofErr( oItem );
						else if ( _T("w:sdt") == sName )
							pItem = new CSdt( oItem );
						else if ( _T("w:tblGrid") == sName )
							m_oTblGrid = oItem;
						else if ( _T("w:tblPr") == sName )
							pItem = new CTableProperty( oItem );
						else if ( _T("w:tr") == sName )
							pItem = new CTr( oItem );

						if ( pItem )
							m_arrItems.Add( pItem );
					}
				}
			}
		}


		void    CTbl::fromXML(XmlUtils::CXmlLiteReader& oReader)
		{
			if ( oReader.IsEmptyNode() )
				return;

			int nParentDepth = oReader.GetDepth();
			while( oReader.ReadNextSiblingNode( nParentDepth ) )
			{
				CWCharWrapper sName = oReader.GetName();
				WritingElement *pItem = NULL;

				if ( _T("w:bookmarkEnd") == sName )
					pItem = new CBookmarkEnd( oReader );
				else if ( _T("w:bookmarkStart") == sName )
					pItem = new CBookmarkStart( oReader );
				else if ( _T("w:commentRangeEnd") == sName )
					pItem = new CCommentRangeEnd( oReader );
				else if ( _T("w:commentRangeStart") == sName )
					pItem = new CCommentRangeStart( oReader );
				
				
				else if ( _T("w:customXmlDelRangeEnd") == sName )
					pItem = new CCustomXmlDelRangeEnd( oReader );
				else if ( _T("w:customXmlDelRangeStart") == sName )
					pItem = new CCustomXmlDelRangeStart( oReader );
				else if ( _T("w:customXmlInsRangeEnd") == sName )
					pItem = new CCustomXmlInsRangeEnd( oReader );
				else if ( _T("w:customXmlInsRangeStart") == sName )
					pItem = new CCustomXmlInsRangeStart( oReader );
				else if ( _T("w:customXmlMoveFromRangeEnd") == sName ) 
					pItem = new CCustomXmlMoveFromRangeEnd( oReader );
				else if ( _T("w:customXmlMoveFromRangeStart") == sName )
					pItem = new CCustomXmlMoveFromRangeStart( oReader );
				else if ( _T("w:customXmlMoveToRangeEnd") == sName ) 
					pItem = new CCustomXmlMoveToRangeEnd( oReader );
				else if ( _T("w:customXmlMoveToRangeStart") == sName )
					pItem = new CCustomXmlMoveToRangeStart( oReader );
				else if ( _T("w:del") == sName )
					pItem = new CDel( oReader );
				else if ( _T("w:ins") == sName )
					pItem = new CIns( oReader );
				
				
				else if ( _T("w:moveFromRangeEnd") == sName )
					pItem = new CMoveToRangeEnd( oReader );
				else if ( _T("w:moveFromRangeStart") == sName )
					pItem = new CMoveToRangeStart( oReader );
				
				
				else if ( _T("w:moveToRangeEnd") == sName )
					pItem = new CMoveToRangeEnd( oReader );
				else if ( _T("w:moveToRangeStart") == sName )
					pItem = new CMoveToRangeStart( oReader );
				else if ( _T("m:oMath") == sName )
					pItem = new COMath( oReader );
				else if ( _T("m:oMathPara") == sName )
					pItem = new COMathPara( oReader );
				else if ( _T("w:permEnd") == sName )
					pItem = new CPermEnd( oReader );
				else if ( _T("w:permStart") == sName )
					pItem = new CPermStart( oReader );
				else if ( _T("w:proofErr") == sName )
					pItem = new CProofErr( oReader );
				else if ( _T("w:sdt") == sName )
					pItem = new CSdt( oReader );
				else if ( _T("w:tblGrid") == sName )
					m_oTblGrid = oReader;
				else if ( _T("w:tblPr") == sName )
					pItem = new CTableProperty( oReader );
				else if ( _T("w:tr") == sName )
					pItem = new CTr( oReader );

				if ( pItem )
					m_arrItems.Add( pItem );
			}
		}


		CString CTbl::toXML() const
		{
			CString sResult = _T("<w:tbl>");

			if ( m_oTblGrid.IsInit() )
			{
				sResult += m_oTblGrid->toXML();
			}

			for ( int nIndex = 0; nIndex < m_arrItems.GetSize(); nIndex++ )
			{
				if ( m_arrItems[nIndex] )
				{
					sResult += m_arrItems[nIndex]->toXML();
				}
			}

			sResult += _T("</w:tbl>");

			return sResult;
		}

		
		
		






		void    CTr::fromXML(XmlUtils::CXmlNode& oNode)
		{
			oNode.ReadAttributeBase( _T("w:rsidDel"), m_oRsidDel );
			oNode.ReadAttributeBase( _T("w:rsidR"),   m_oRsidR );
			oNode.ReadAttributeBase( _T("w:rsidRPr"), m_oRsidRPr );
			oNode.ReadAttributeBase( _T("w:rsidTr"),  m_oRsidTr );

			XmlUtils::CXmlNodes oChilds;
			int nNumCol = 0;
			if ( oNode.GetNodes( _T("*"), oChilds ) )
			{
				XmlUtils::CXmlNode oItem;
				for ( int nIndex = 0; nIndex < oChilds.GetCount(); nIndex++ )
				{
					if ( oChilds.GetAt( nIndex, oItem ) )
					{
						CString sName = oItem.GetName();
						WritingElement *pItem = NULL;

						if ( _T("w:bookmarkEnd") == sName )
							pItem = new CBookmarkEnd( oItem );
						else if ( _T("w:bookmarkStart") == sName )
							pItem = new CBookmarkStart( oItem );
						else if ( _T("w:commentRangeEnd") == sName )
							pItem = new CCommentRangeEnd( oItem );
						else if ( _T("w:commentRangeStart") == sName )
							pItem = new CCommentRangeStart( oItem );
						
						
						else if ( _T("w:customXmlDelRangeEnd") == sName )
							pItem = new CCustomXmlDelRangeEnd( oItem );
						else if ( _T("w:customXmlDelRangeStart") == sName )
							pItem = new CCustomXmlDelRangeStart( oItem );
						else if ( _T("w:customXmlInsRangeEnd") == sName )
							pItem = new CCustomXmlInsRangeEnd( oItem );
						else if ( _T("w:customXmlInsRangeStart") == sName )
							pItem = new CCustomXmlInsRangeStart( oItem );
						else if ( _T("w:customXmlMoveFromRangeEnd") == sName ) 
							pItem = new CCustomXmlMoveFromRangeEnd( oItem );
						else if ( _T("w:customXmlMoveFromRangeStart") == sName )
							pItem = new CCustomXmlMoveFromRangeStart( oItem );
						else if ( _T("w:customXmlMoveToRangeEnd") == sName ) 
							pItem = new CCustomXmlMoveToRangeEnd( oItem );
						else if ( _T("w:customXmlMoveToRangeStart") == sName )
							pItem = new CCustomXmlMoveToRangeStart( oItem );
						
						
						
						
						
						
						else if ( _T("w:moveFromRangeEnd") == sName )
							pItem = new CMoveToRangeEnd( oItem );
						else if ( _T("w:moveFromRangeStart") == sName )
							pItem = new CMoveToRangeStart( oItem );
						
						
						else if ( _T("w:moveToRangeEnd") == sName )
							pItem = new CMoveToRangeEnd( oItem );
						else if ( _T("w:moveToRangeStart") == sName )
							pItem = new CMoveToRangeStart( oItem );
						else if ( _T("m:oMath") == sName )
							pItem = new COMath( oItem );
						else if ( _T("m:oMathPara") == sName )
							pItem = new COMathPara( oItem );
						else if ( _T("w:permEnd") == sName )
							pItem = new CPermEnd( oItem );
						else if ( _T("w:permStart") == sName )
							pItem = new CPermStart( oItem );
						else if ( _T("w:proofErr") == sName )
							pItem = new CProofErr( oItem );
						else if ( _T("w:sdt") == sName )
							pItem = new CSdt( oItem );
						else if ( _T("w:tblPrEx") == sName )
							pItem = new CTblPrEx( oItem );
						else if ( _T("w:tc") == sName )
						{
							pItem = new CTc( oItem );
							if ( pItem )
							{
								CTc *pCell = (CTc *)pItem;
								pCell->m_nNumCol = nNumCol;
								
								CTableCellProperties *pProps = pCell->GetProperties();
								if ( pProps )
								{
									if ( pProps->m_oGridSpan.IsInit() && pProps->m_oGridSpan->m_oVal.IsInit() )
										nNumCol += pProps->m_oGridSpan->m_oVal->GetValue();
									else
										nNumCol++;
								}
								else
									nNumCol++;
							}
						}
						else if ( _T("w:trPr") == sName )
							pItem = new CTableRowProperties( oItem );

						if ( pItem )
							m_arrItems.Add( pItem );
					}
				}
			}
		}


		void    CTr::fromXML(XmlUtils::CXmlLiteReader& oReader)
		{
			ReadAttributes( oReader );

			if ( oReader.IsEmptyNode() )
				return;

			int nParentDepth = oReader.GetDepth();
			int nNumCol = 0;
			while( oReader.ReadNextSiblingNode( nParentDepth ) )
			{
				CWCharWrapper sName = oReader.GetName();
				WritingElement *pItem = NULL;

				if ( _T("w:bookmarkEnd") == sName )
					pItem = new CBookmarkEnd( oReader );
				else if ( _T("w:bookmarkStart") == sName )
					pItem = new CBookmarkStart( oReader );
				else if ( _T("w:commentRangeEnd") == sName )
					pItem = new CCommentRangeEnd( oReader );
				else if ( _T("w:commentRangeStart") == sName )
					pItem = new CCommentRangeStart( oReader );
				
				
				else if ( _T("w:customXmlDelRangeEnd") == sName )
					pItem = new CCustomXmlDelRangeEnd( oReader );
				else if ( _T("w:customXmlDelRangeStart") == sName )
					pItem = new CCustomXmlDelRangeStart( oReader );
				else if ( _T("w:customXmlInsRangeEnd") == sName )
					pItem = new CCustomXmlInsRangeEnd( oReader );
				else if ( _T("w:customXmlInsRangeStart") == sName )
					pItem = new CCustomXmlInsRangeStart( oReader );
				else if ( _T("w:customXmlMoveFromRangeEnd") == sName ) 
					pItem = new CCustomXmlMoveFromRangeEnd( oReader );
				else if ( _T("w:customXmlMoveFromRangeStart") == sName )
					pItem = new CCustomXmlMoveFromRangeStart( oReader );
				else if ( _T("w:customXmlMoveToRangeEnd") == sName ) 
					pItem = new CCustomXmlMoveToRangeEnd( oReader );
				else if ( _T("w:customXmlMoveToRangeStart") == sName )
					pItem = new CCustomXmlMoveToRangeStart( oReader );
				else if ( _T("w:del") == sName )
					pItem = new CDel( oReader );
				else if ( _T("w:ins") == sName )
					pItem = new CIns( oReader );
				
				
				else if ( _T("w:moveFromRangeEnd") == sName )
					pItem = new CMoveToRangeEnd( oReader );
				else if ( _T("w:moveFromRangeStart") == sName )
					pItem = new CMoveToRangeStart( oReader );
				
				
				else if ( _T("w:moveToRangeEnd") == sName )
					pItem = new CMoveToRangeEnd( oReader );
				else if ( _T("w:moveToRangeStart") == sName )
					pItem = new CMoveToRangeStart( oReader );
				else if ( _T("m:oMath") == sName )
					pItem = new COMath( oReader );
				else if ( _T("m:oMathPara") == sName )
					pItem = new COMathPara( oReader );
				else if ( _T("w:permEnd") == sName )
					pItem = new CPermEnd( oReader );
				else if ( _T("w:permStart") == sName )
					pItem = new CPermStart( oReader );
				else if ( _T("w:proofErr") == sName )
					pItem = new CProofErr( oReader );
				else if ( _T("w:sdt") == sName )
					pItem = new CSdt( oReader );
				else if ( _T("w:tblPrEx") == sName )
					pItem = new CTblPrEx( oReader );
				else if ( _T("w:tc") == sName )
				{
					pItem = new CTc( oReader );
					if ( pItem )
					{
						CTc *pCell = (CTc *)pItem;
						pCell->m_nNumCol = nNumCol;

						CTableCellProperties *pProps = pCell->GetProperties();
						if ( pProps )
						{
							if ( pProps->m_oGridSpan.IsInit() && pProps->m_oGridSpan->m_oVal.IsInit() )
								nNumCol += pProps->m_oGridSpan->m_oVal->GetValue();
							else
								nNumCol++;
						}
						else
							nNumCol++;
					}
				}
				else if ( _T("w:trPr") == sName )
					pItem = new CTableRowProperties( oReader );

				if ( pItem )
					m_arrItems.Add( pItem );
			}
		}


		CString CTr::toXML() const
		{
				CString sResult = _T("<w:tr ");

				ComplexTypes_WriteAttribute( _T("w:rsidDel=\""), m_oRsidDel );
				ComplexTypes_WriteAttribute( _T("w:rsidR=\""),   m_oRsidR );
				ComplexTypes_WriteAttribute( _T("w:rsidRPr=\""), m_oRsidRPr );
				ComplexTypes_WriteAttribute( _T("w:rsidTr=\""),  m_oRsidTr );

				sResult += _T(">");

				for ( int nIndex = 0; nIndex < m_arrItems.GetSize(); nIndex++ )
				{
					if ( m_arrItems[nIndex] )
					{
						sResult += m_arrItems[nIndex]->toXML();
					}
				}

				sResult += _T("</w:tr>");

				return sResult;
		}
		void    CTr::ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
		{
			
			WritingElement_ReadAttributes_Start( oReader )
			WritingElement_ReadAttributes_Read_if     ( oReader, _T("w:rsidDel"), m_oRsidDel )
			WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:rsidR"),   m_oRsidR )
			WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:rsidRPr"), m_oRsidRPr )
			WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:rsidTr"),  m_oRsidTr )
			WritingElement_ReadAttributes_End( oReader )
		}
		
		
		







		void    CTc::fromXML(XmlUtils::CXmlNode& oNode)
		{
			oNode.ReadAttributeBase( _T("w:id"), m_sId );

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

if ( _T("w:bookmarkEnd") == sName )
							pItem = new CBookmarkEnd( oItem );
						else if ( _T("w:bookmarkStart") == sName )
							pItem = new CBookmarkStart( oItem );
						else if ( _T("w:commentRangeEnd") == sName )
							pItem = new CCommentRangeEnd( oItem );
						else if ( _T("w:commentRangeStart") == sName )
							pItem = new CCommentRangeStart( oItem );
						
						
						else if ( _T("w:customXmlDelRangeEnd") == sName )
							pItem = new CCustomXmlDelRangeEnd( oItem );
						else if ( _T("w:customXmlDelRangeStart") == sName )
							pItem = new CCustomXmlDelRangeStart( oItem );
						else if ( _T("w:customXmlInsRangeEnd") == sName )
							pItem = new CCustomXmlInsRangeEnd( oItem );
						else if ( _T("w:customXmlInsRangeStart") == sName )
							pItem = new CCustomXmlInsRangeStart( oItem );
						else if ( _T("w:customXmlMoveFromRangeEnd") == sName ) 
							pItem = new CCustomXmlMoveFromRangeEnd( oItem );
						else if ( _T("w:customXmlMoveFromRangeStart") == sName )
							pItem = new CCustomXmlMoveFromRangeStart( oItem );
						else if ( _T("w:customXmlMoveToRangeEnd") == sName ) 
							pItem = new CCustomXmlMoveToRangeEnd( oItem );
						else if ( _T("w:customXmlMoveToRangeStart") == sName )
							pItem = new CCustomXmlMoveToRangeStart( oItem );
						
						
						
						
						
						
						else if ( _T("w:moveFromRangeEnd") == sName )
							pItem = new CMoveToRangeEnd( oItem );
						else if ( _T("w:moveFromRangeStart") == sName )
							pItem = new CMoveToRangeStart( oItem );
						
						
						else if ( _T("w:moveToRangeEnd") == sName )
							pItem = new CMoveToRangeEnd( oItem );
						else if ( _T("w:moveToRangeStart") == sName )
							pItem = new CMoveToRangeStart( oItem );
						else if ( _T("m:oMath") == sName )
							pItem = new COMath( oItem );
						else if ( _T("m:oMathPara") == sName )
							pItem = new COMathPara( oItem );
						else if ( _T("w:p") == sName )
							pItem = new CParagraph( oItem );
						else if ( _T("w:permEnd") == sName )
							pItem = new CPermEnd( oItem );
						else if ( _T("w:permStart") == sName )
							pItem = new CPermStart( oItem );
						else if ( _T("w:proofErr") == sName )
							pItem = new CProofErr( oItem );
						else if ( _T("w:sdt") == sName )
							pItem = new CSdt( oItem );
						else if ( _T("w:tbl") == sName )
							pItem = new CTbl( oItem );
						else if ( _T("w:tcPr") == sName )
							pItem = new CTableCellProperties( oItem );

						if ( pItem )
							m_arrItems.Add( pItem );
					}
				}
			}
		}


		void    CTc::fromXML(XmlUtils::CXmlLiteReader& oReader)
		{
			ReadAttributes( oReader );

			if ( oReader.IsEmptyNode() )
				return;

			int nParentDepth = oReader.GetDepth();
			while( oReader.ReadNextSiblingNode( nParentDepth ) )
			{
				CWCharWrapper sName = oReader.GetName();
				WritingElement *pItem = NULL;

				if ( _T("w:bookmarkEnd") == sName )
					pItem = new CBookmarkEnd( oReader );
				else if ( _T("w:bookmarkStart") == sName )
					pItem = new CBookmarkStart( oReader );
				else if ( _T("w:commentRangeEnd") == sName )
					pItem = new CCommentRangeEnd( oReader );
				else if ( _T("w:commentRangeStart") == sName )
					pItem = new CCommentRangeStart( oReader );
				
				
				else if ( _T("w:customXmlDelRangeEnd") == sName )
					pItem = new CCustomXmlDelRangeEnd( oReader );
				else if ( _T("w:customXmlDelRangeStart") == sName )
					pItem = new CCustomXmlDelRangeStart( oReader );
				else if ( _T("w:customXmlInsRangeEnd") == sName )
					pItem = new CCustomXmlInsRangeEnd( oReader );
				else if ( _T("w:customXmlInsRangeStart") == sName )
					pItem = new CCustomXmlInsRangeStart( oReader );
				else if ( _T("w:customXmlMoveFromRangeEnd") == sName ) 
					pItem = new CCustomXmlMoveFromRangeEnd( oReader );
				else if ( _T("w:customXmlMoveFromRangeStart") == sName )
					pItem = new CCustomXmlMoveFromRangeStart( oReader );
				else if ( _T("w:customXmlMoveToRangeEnd") == sName ) 
					pItem = new CCustomXmlMoveToRangeEnd( oReader );
				else if ( _T("w:customXmlMoveToRangeStart") == sName )
					pItem = new CCustomXmlMoveToRangeStart( oReader );
				else if ( _T("w:del") == sName )
					pItem = new CDel( oReader );
				else if ( _T("w:ins") == sName )
					pItem = new CIns( oReader );
				
				
				else if ( _T("w:moveFromRangeEnd") == sName )
					pItem = new CMoveToRangeEnd( oReader );
				else if ( _T("w:moveFromRangeStart") == sName )
					pItem = new CMoveToRangeStart( oReader );
				
				
				else if ( _T("w:moveToRangeEnd") == sName )
					pItem = new CMoveToRangeEnd( oReader );
				else if ( _T("w:moveToRangeStart") == sName )
					pItem = new CMoveToRangeStart( oReader );
				else if ( _T("m:oMath") == sName )
					pItem = new COMath( oReader );
				else if ( _T("m:oMathPara") == sName )
					pItem = new COMathPara( oReader );
				else if ( _T("w:p") == sName )
					pItem = new CParagraph( oReader );
				else if ( _T("w:permEnd") == sName )
					pItem = new CPermEnd( oReader );
				else if ( _T("w:permStart") == sName )
					pItem = new CPermStart( oReader );
				else if ( _T("w:proofErr") == sName )
					pItem = new CProofErr( oReader );
				else if ( _T("w:sdt") == sName )
					pItem = new CSdt( oReader );
				else if ( _T("w:tbl") == sName )
					pItem = new CTbl( oReader );
				else if ( _T("w:tcPr") == sName )
					pItem = new CTableCellProperties( oReader );

				if ( pItem )
					m_arrItems.Add( pItem );
			}
		}

		CString CTc::toXML() const
		{
				CString sResult;

				if ( m_sId.IsInit() )
				{
					sResult += _T("<w:tc w:id=\"");
					sResult += m_sId->GetString();
					sResult += _T("\">");
				}
				else
					sResult = _T("<w:tc>");

				for ( int nIndex = 0; nIndex < m_arrItems.GetSize(); nIndex++ )
				{
					if ( m_arrItems[nIndex] )
					{
						sResult += m_arrItems[nIndex]->toXML();
					}
				}

				sResult += _T("</w:tc>");

				return sResult;
		}
		void    CTc::ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
		{
			
			WritingElement_ReadAttributes_Start( oReader )
			WritingElement_ReadAttributes_ReadSingle( oReader, _T("w:id"), m_sId )
			WritingElement_ReadAttributes_End( oReader )
		}
	} 
} // namespace OOX