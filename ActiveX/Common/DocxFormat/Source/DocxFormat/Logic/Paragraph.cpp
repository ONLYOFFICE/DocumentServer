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
 #include "Paragraph.h"
#include "Annotations.h"
#include "Run.h"
#include "RunProperty.h"
#include "ParagraphProperty.h"
#include "FldSimple.h"
#include "Bdo.h"
#include "Sdt.h"
#include "Hyperlink.h"
#include "SmartTag.h"
#include "Dir.h"
#include "../Math/oMathPara.h"
#include "../Math/oMath.h"








namespace OOX
{
	namespace Logic
	{
		
		
		

		void    CParagraph::fromXML(XmlUtils::CXmlNode& oNode)
		{
			oNode.ReadAttributeBase( _T("w:rsidDel"),      m_oRsidDel );
			oNode.ReadAttributeBase( _T("w:rsidP"),        m_oRsidP );
			oNode.ReadAttributeBase( _T("w:rsidR"),        m_oRsidR );
			oNode.ReadAttributeBase( _T("w:rsidRDefault"), m_oRsidRDefault );
			oNode.ReadAttributeBase( _T("w:rsidRPr"),      m_oRsidRPr );

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

						if ( _T("w:bdo") == sName )
							pItem = new CBdo( oItem );
						else if ( _T("w:bookmarkEnd") == sName )
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
						
						
						else if ( _T("w:dir") == sName )
							pItem = new CDir( oItem );
						else if ( _T("w:fldSimple") == sName )
							pItem = new CFldSimple( oItem );
						else if ( _T("w:hyperlink") == sName )
							pItem = new CHyperlink( oItem );
						
						
						
						
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
						else if ( _T("w:pPr") == sName )
							pItem = new CParagraphProperty( oItem );
						else if ( _T("w:proofErr") == sName )
							pItem = new CProofErr( oItem );
						else if ( _T("w:r") == sName )
							pItem = new CRun( oItem );
						else if ( _T("w:sdt") == sName )
							pItem = new CSdt( oItem );
						else if ( _T("w:smartTag") == sName )
							pItem = new CSmartTag( oItem );
						
						

						if ( pItem )
							m_arrItems.Add( pItem );
					}
				}
			}
		}


		void    CParagraph::fromXML(XmlUtils::CXmlLiteReader& oReader)
		{
			ReadAttributes( oReader );

			if ( oReader.IsEmptyNode() )
				return;

			int nParentDepth = oReader.GetDepth();
			while( oReader.ReadNextSiblingNode( nParentDepth ) )
			{
				CWCharWrapper sName = oReader.GetName();
				WritingElement *pItem = NULL;

				if ( _T("w:bdo") == sName )
					pItem = new CBdo( oReader );
				else if ( _T("w:bookmarkEnd") == sName )
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
				else if ( _T("w:dir") == sName )
					pItem = new CDir( oReader );
				else if ( _T("w:fldSimple") == sName )
					pItem = new CFldSimple( oReader );
				else if ( _T("w:hyperlink") == sName )
					pItem = new CHyperlink( oReader );
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
				else if ( _T("w:pPr") == sName )
					pItem = new CParagraphProperty( oReader );
				else if ( _T("w:proofErr") == sName )
					pItem = new CProofErr( oReader );
				else if ( _T("w:r") == sName )
					pItem = new CRun( oReader );
				else if ( _T("w:sdt") == sName )
					pItem = new CSdt( oReader );
				else if ( _T("w:smartTag") == sName )
					pItem = new CSmartTag( oReader );
				
				

				if ( pItem )
					m_arrItems.Add( pItem );
			}
		}
		CString CParagraph::toXML() const
		{
			CString sResult = _T("<w:p ");

			ComplexTypes_WriteAttribute( _T("w:rsidDel=\""),      m_oRsidDel );
			ComplexTypes_WriteAttribute( _T("w:rsidP=\""),        m_oRsidP );
			ComplexTypes_WriteAttribute( _T("w:rsidR=\""),        m_oRsidR );
			ComplexTypes_WriteAttribute( _T("w:rsidRDefault=\""), m_oRsidRDefault );
			ComplexTypes_WriteAttribute( _T("w:rsidRPr=\""),      m_oRsidRPr );
			ComplexTypes_WriteAttribute( _T("w14:paraId=\""),      m_oParaId );
			ComplexTypes_WriteAttribute( _T("w14:textId=\""),      m_oTextId );

			sResult += _T(">");

			for ( int nIndex = 0; nIndex < m_arrItems.GetSize(); nIndex++ )
			{
				if ( m_arrItems[nIndex] )
				{
					sResult += m_arrItems[nIndex]->toXML();
				}
			}

			sResult += _T("</w:p>");

			return sResult;
		}

		void    CParagraph::ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
		{
			
			WritingElement_ReadAttributes_Start( oReader )

			WritingElement_ReadAttributes_Read_if     ( oReader, _T("w:rsidDel"),      m_oRsidDel )
			WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:rsidP"),        m_oRsidP )
			WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:rsidR"),        m_oRsidR )
			WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:rsidRDefault"), m_oRsidRDefault )
			WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:rsidRPr"),      m_oRsidRPr )
			WritingElement_ReadAttributes_Read_else_if( oReader, _T("w14:paraId"),		m_oParaId )
			WritingElement_ReadAttributes_Read_else_if( oReader, _T("w14:textId"),      m_oTextId )

			WritingElement_ReadAttributes_End( oReader )
		}
		void CParagraph::AddRun(CRun *pRun)
		{
			m_arrItems.Add( (WritingElement*)pRun );
		}
		void CParagraph::AddText(CString& sText)
		{
			WritingElement *pR = new CRun();
			if ( !pR )
				return;

			WritingElement *pT = new CText();
			if ( !pT )
			{
				delete pR;
				return;
			}

			CText *pText = (CText*)pT;
			pText->m_sText  = sText;
			pText->m_oSpace = new SimpleTypes::CXmlSpace<>();
			pText->m_oSpace->SetValue( SimpleTypes::xmlspacePreserve );


			((CRun*)pR)->m_arrItems.Add( pT );

			m_arrItems.Add( pR );
		}
		void CParagraph::AddText(CString& sText, CRunProperty *pProperty)
		{
			WritingElement *pR = new CRun();
			if ( !pR )
				return;

			WritingElement *pT = new CText();
			if ( !pT )
			{
				delete pR;
				return;
			}

			CText *pText = (CText*)pT;
			pText->m_sText  = sText;
			pText->m_oSpace = new SimpleTypes::CXmlSpace<>();
			pText->m_oSpace->SetValue( SimpleTypes::xmlspacePreserve );

			if ( pProperty )
				((CRun*)pR)->m_arrItems.Add( (WritingElement*)pProperty );

			((CRun*)pR)->m_arrItems.Add( pT );

			m_arrItems.Add( pR );
		}
		void CParagraph::AddTab()
		{
			WritingElement *pR = new CRun();
			if ( !pR )
				return;

			WritingElement *pTab = new CTab();
			if ( !pTab )
			{
				delete pR;
				return;
			}

			((CRun*)pR)->m_arrItems.Add( pTab );

			m_arrItems.Add( pR );
		}


		void CParagraph::AddTab(CRunProperty *pProperty)
		{
			WritingElement *pR = new CRun();
			if ( !pR )
				return;

			WritingElement *pTab = new CTab();
			if ( !pTab )
			{
				delete pR;
				return;
			}
			if ( pProperty )
				((CRun*)pR)->m_arrItems.Add( (WritingElement*)pProperty );

			((CRun*)pR)->m_arrItems.Add( pTab );

			m_arrItems.Add( pR );
		}


		void CParagraph::AddBreak(SimpleTypes::EBrType eType)
		{
			WritingElement *pR = new CRun();
			if ( !pR )
				return;

			WritingElement *pBr = new CBr();
			if ( !pBr )
			{
				delete pR;
				return;
			}

			((CBr*)pBr)->m_oType.SetValue( eType );

			((CRun*)pR)->m_arrItems.Add( pBr );

			m_arrItems.Add( pR );
		}


		void CParagraph::AddSpace(const int nCount)
		{
			WritingElement *pR = new CRun();
			if ( !pR )
				return;

			WritingElement *pT = new CText();
			if ( !pT )
			{
				delete pR;
				return;
			}

			CText *pText = (CText*)pT;
			char *sString = new char[nCount + 1];
			::memset( sString, 0x20, nCount );
			sString[nCount] = '\0';
			pText->m_sText = sString;
			delete sString;
			pText->m_oSpace = new SimpleTypes::CXmlSpace<>();
			pText->m_oSpace->SetValue( SimpleTypes::xmlspacePreserve );

			((CRun*)pR)->m_arrItems.Add( pT );

			m_arrItems.Add( pR );
		}
		void CParagraph::AddSpace(const int nCount, CRunProperty *pProperty)
		{
			WritingElement *pR = new CRun();
			if ( !pR )
				return;

			WritingElement *pT = new CText();
			if ( !pT )
			{
				delete pR;
				return;
			}

			CText *pText = (CText*)pT;
			char *sString = new char[nCount + 1];
			::memset( sString, 0x20, nCount );
			sString[nCount] = '\0';
			pText->m_sText = sString;
			delete sString;
			pText->m_oSpace = new SimpleTypes::CXmlSpace<>();
			pText->m_oSpace->SetValue( SimpleTypes::xmlspacePreserve );

			if ( pProperty )
				((CRun*)pR)->m_arrItems.Add( (WritingElement*)pProperty );

			((CRun*)pR)->m_arrItems.Add( pT );

			m_arrItems.Add( pR );
		}


		void CParagraph::AddBookmarkStart(int nId, CString& sName)
		{
			WritingElement *pBS = new CBookmarkStart();
			if ( !pBS )
				return;

			((CBookmarkStart*)pBS)->m_oId   = new SimpleTypes::CDecimalNumber<>();
			((CBookmarkStart*)pBS)->m_oId->SetValue( nId );
			((CBookmarkStart*)pBS)->m_sName = sName;

			m_arrItems.Add( pBS );
		}	
		void CParagraph::AddBookmarkEnd  (int nId)
		{
			WritingElement *pBE = new CBookmarkEnd();
			if ( !pBE )
				return;

			((CBookmarkEnd*)pBE)->m_oId = new SimpleTypes::CDecimalNumber<>();
			((CBookmarkEnd*)pBE)->m_oId->SetValue( nId );

			m_arrItems.Add( pBE );
		}


	} 
} // namespace OOX