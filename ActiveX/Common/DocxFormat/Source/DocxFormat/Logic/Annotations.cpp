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
 #include "Annotations.h"
#include "Bdo.h"
#include "Paragraph.h"
#include "Annotations.h"
#include "Run.h"
#include "FldSimple.h"
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
		void CIns::fromXML(XmlUtils::CXmlNode& oNode)
		{
			
		}
		void CIns::fromXML(XmlUtils::CXmlLiteReader& oReader)
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
		CString CIns::toXML() const
		{
			
			CString sResult = _T("");
			return sResult;
		}
		void CDel::fromXML(XmlUtils::CXmlNode& oNode)
		{
			
		}
		void CDel::fromXML(XmlUtils::CXmlLiteReader& oReader)
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
		CString CDel::toXML() const
		{
			
			CString sResult = _T("");
			return sResult;
		}
	} 
} // namespace OOX