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
#ifndef OOX_FTNEDN_INCLUDE_H_
#define OOX_FTNEDN_INCLUDE_H_

#include "../Base/Nullable.h"

#include "WritingElement.h"

#include "Logic/Annotations.h"
#include "Logic/Paragraph.h"
#include "Logic/Sdt.h"
#include "Logic/Table.h"
#include "Math/oMathPara.h"
#include "Math/oMath.h"









namespace OOX
{
	
	
	
	class CFtnEdn : public WritingElement
	{
	public:
		CFtnEdn()
		{
			m_eType = et_Unknown;
		}
		CFtnEdn(const XmlUtils::CXmlNode& oNode)
		{
			m_eType = et_Unknown;
			fromXML( (XmlUtils::CXmlNode&)oNode );
		}
		virtual ~CFtnEdn()
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

		const CFtnEdn& operator =(const XmlUtils::CXmlNode& oNode)
		{
			fromXML( (XmlUtils::CXmlNode&)oNode );
			return *this;
		}

		
		
		

		
		
		

		
		
		
		

		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		

		
		
		
		
		
		void Clear()
		{
			m_eType = et_Unknown;

			m_oId.reset();
			m_oType.reset();

			for ( int nIndex = 0; nIndex < m_arrItems.GetSize(); nIndex++ )
			{
				if ( m_arrItems[nIndex] )
					delete m_arrItems[nIndex];

				m_arrItems[nIndex] = NULL;
			}

			m_arrItems.RemoveAll();
		}

	public:

		virtual void         fromXML(XmlUtils::CXmlNode& oNode)
		{
			if ( _T("w:footnote") == oNode.GetName() )
				m_eType = et_w_footnote;
			else if ( _T("w:endnote") == oNode.GetName() )
				m_eType = et_w_endnote;
			else 
				return;

			oNode.ReadAttributeBase( _T("w:id"),   m_oId   );
			oNode.ReadAttributeBase( _T("w:type"), m_oType );

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
							pItem = new Logic::CBookmarkEnd( oItem );
						else if ( _T("w:bookmarkStart") == sName )
							pItem = new Logic::CBookmarkStart( oItem );
						else if ( _T("w:commentRangeEnd") == sName )
							pItem = new Logic::CCommentRangeEnd( oItem );
						else if ( _T("w:commentRangeStart") == sName )
							pItem = new Logic::CCommentRangeStart( oItem );
						
						
						else if ( _T("w:customXmlDelRangeEnd") == sName )
							pItem = new Logic::CCustomXmlDelRangeEnd( oItem );
						else if ( _T("w:customXmlDelRangeStart") == sName )
							pItem = new Logic::CCustomXmlDelRangeStart( oItem );
						else if ( _T("w:customXmlInsRangeEnd") == sName )
							pItem = new Logic::CCustomXmlInsRangeEnd( oItem );
						else if ( _T("w:customXmlInsRangeStart") == sName )
							pItem = new Logic::CCustomXmlInsRangeStart( oItem );
						else if ( _T("w:customXmlMoveFromRangeEnd") == sName ) 
							pItem = new Logic::CCustomXmlMoveFromRangeEnd( oItem );
						else if ( _T("w:customXmlMoveFromRangeStart") == sName )
							pItem = new Logic::CCustomXmlMoveFromRangeStart( oItem );
						else if ( _T("w:customXmlMoveToRangeEnd") == sName ) 
							pItem = new Logic::CCustomXmlMoveToRangeEnd( oItem );
						else if ( _T("w:customXmlMoveToRangeStart") == sName )
							pItem = new Logic::CCustomXmlMoveToRangeStart( oItem );
						
						
						
						
						
						
						else if ( _T("w:moveFromRangeEnd") == sName )
							pItem = new Logic::CMoveToRangeEnd( oItem );
						else if ( _T("w:moveFromRangeStart") == sName )
							pItem = new Logic::CMoveToRangeStart( oItem );
						
						
						else if ( _T("w:moveToRangeEnd") == sName )
							pItem = new Logic::CMoveToRangeEnd( oItem );
						else if ( _T("w:moveToRangeStart") == sName )
							pItem = new Logic::CMoveToRangeStart( oItem );
						else if ( _T("m:oMath") == sName )
							pItem = new Logic::COMath( oItem );
						else if ( _T("m:oMathPara") == sName )
							pItem = new Logic::COMathPara( oItem );
						else if ( _T("w:p") == sName )
							pItem = new Logic::CParagraph( oItem );
						else if ( _T("w:permEnd") == sName )
							pItem = new Logic::CPermEnd( oItem );
						else if ( _T("w:permStart") == sName )
							pItem = new Logic::CPermStart( oItem );
						else if ( _T("w:proofErr") == sName )
							pItem = new Logic::CProofErr( oItem );
						else if ( _T("w:sdt") == sName )
							pItem = new Logic::CSdt( oItem );
						else if ( _T("w:tbl") == sName )
							pItem = new Logic::CTbl( oItem );

						if ( pItem )
							m_arrItems.Add( pItem );
					}
				}
			}
		}
        virtual CString      toXML() const
		{
			CString sResult;
			
			if ( m_eType == et_w_footnote )
				sResult = _T("<w:footnote ");
			else if ( m_eType == et_w_endnote )
				sResult = _T("<w:endnote ");
			else
				return _T("");

			ComplexTypes_WriteAttribute( _T("w:id=\""),   m_oId );
			ComplexTypes_WriteAttribute( _T("w:type=\""), m_oType );

			sResult += _T(">");

			for ( int nIndex = 0; nIndex < m_arrItems.GetSize(); nIndex++ )
			{
				if ( m_arrItems[nIndex] )
				{
					sResult += m_arrItems[nIndex]->toXML();
				}
			}

			if ( m_eType == et_w_footnote )
				sResult += _T("</w:footnote>");
			else if ( m_eType == et_w_endnote )
				sResult += _T("</w:endnote>");

			return sResult;
		}
		virtual EElementType getType() const
		{
			return m_eType;
		}

	public:

		void AddParagraph(Logic::CParagraph *pPara)
		{
			m_arrItems.Add( (WritingElement*)pPara );
		}

	public:

		OOX::EElementType                        m_eType; 

		
		nullable<SimpleTypes::CDecimalNumber<> > m_oId;
		nullable<SimpleTypes::CFtnEdn<>        > m_oType;

		
		CSimpleArray<WritingElement*           > m_arrItems;
	};

	
	
	
	class CFtnEdnSepRef : public WritingElement
	{
	public:
		CFtnEdnSepRef()
		{
			m_eType = et_Unknown;
		}
		CFtnEdnSepRef(XmlUtils::CXmlNode& oNode)
		{
			m_eType = et_Unknown;
			fromXML( (XmlUtils::CXmlNode&)oNode );
		}
		CFtnEdnSepRef(XmlUtils::CXmlLiteReader& oReader)
		{
			m_eType = et_Unknown;
			fromXML( oReader );
		}
		virtual ~CFtnEdnSepRef()
		{
		}
	public:

		const CFtnEdnSepRef& operator =(const XmlUtils::CXmlNode& oNode)
		{
			fromXML( (XmlUtils::CXmlNode&)oNode );
			return *this;
		}

		const CFtnEdnSepRef& operator =(const XmlUtils::CXmlLiteReader& oReader)
		{
			fromXML( (XmlUtils::CXmlLiteReader&)oReader );
			return *this;
		}

	public:

		virtual void         fromXML(XmlUtils::CXmlNode& oNode)
		{
			if ( _T("w:footnote") == oNode.GetName() )
				m_eType = et_w_footnote;
			else if ( _T("w:endnote") == oNode.GetName() )
				m_eType = et_w_endnote;
			else 
				return;

			oNode.ReadAttributeBase( _T("w:id"),   m_oId   );
		}
		virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
		{
			CWCharWrapper sName = oReader.GetName();
			if ( _T("w:footnote") == sName )
				m_eType = et_w_footnote;
			else if ( _T("w:endnote") == sName )
				m_eType = et_w_endnote;
			else 
				return;

			ReadAttributes( oReader );

			if ( !oReader.IsEmptyNode() )
				oReader.ReadTillEnd();
		}
        virtual CString      toXML() const
		{
			CString sResult;
			
			if ( m_eType == et_w_footnote )
				sResult = _T("<w:footnote ");
			else if ( m_eType == et_w_endnote )
				sResult = _T("<w:endnote ");
			else
				return _T("");

			ComplexTypes_WriteAttribute( _T("w:id=\""),   m_oId );

			sResult += _T("/>");

			return sResult;
		}
		virtual EElementType getType() const
		{
			return m_eType;
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
				if ( _T("w:id") == wsName )
					m_oId = oReader.GetText();

				if ( !oReader.MoveToNextAttribute() )
					break;

				wsName = oReader.GetName();
			}

			oReader.MoveToElement();
		}

	public:

		OOX::EElementType                        m_eType; 

		
		nullable<SimpleTypes::CDecimalNumber<> > m_oId;
	};

} 

#endif // OOX_FTNEDN_INCLUDE_H_