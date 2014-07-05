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
 #include "Vml.h"
#include "VmlOfficeDrawing.h"

#include "Paragraph.h"
#include "Annotations.h"
#include "Run.h"
#include "RunProperty.h"
#include "ParagraphProperty.h"
#include "Sdt.h"
#include "Hyperlink.h"
#include "Table.h"
#include "../Math/oMathPara.h"
#include "../Math/oMath.h"

namespace OOX
{
	
	
	
	
	
	namespace Logic
	{
		
		
		
		void CTxbxContent::fromXML(XmlUtils::CXmlNode& oNode)
		{
			
		}
		void CTxbxContent::fromXML(XmlUtils::CXmlLiteReader& oReader)
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

				if ( pItem )
					m_arrItems.Add( pItem );
			}
		}
		CString CTxbxContent::toXML() const
		{
			CString sResult = _T("<w:txbxContent>");

			for ( int nIndex = 0; nIndex < m_arrItems.GetSize(); nIndex++ )
			{
				if ( m_arrItems[nIndex] )
				{
					sResult += m_arrItems[nIndex]->toXML();
				}
			}

			sResult += _T("</w:txbxContent>");

			return sResult;
		}

	} 
} 
namespace OOX
{
	namespace Vml
	{
		
		
		
		void CVmlShapeElements::fromXML(XmlUtils::CXmlNode& oNode)
		{
			
		}
		void CVmlShapeElements::fromXML(XmlUtils::CXmlLiteReader& oReader)
		{
			if ( oReader.IsEmptyNode() )
				return;

			int nCurDepth = oReader.GetDepth();
			while ( oReader.ReadNextSiblingNode( nCurDepth ) )
			{
				CWCharWrapper sName = oReader.GetName();
				wchar_t wsChar1 = sName[0];
				wchar_t wsChar3 = sName[2];

				WritingElement *pItem = NULL;
				switch ( wsChar1 )
				{
				case 'o':

					switch ( wsChar3 )
					{
					case 'c':

						if ( _T("o:callout") == sName )
							pItem = new OOX::VmlOffice::CCallout( oReader );
						else if ( _T("o:clippath") == sName )
							pItem = new OOX::VmlOffice::CClipPath( oReader );

						break;

					case 'e':

						if ( _T("o:extrusion") == sName )
							pItem = new OOX::VmlOffice::CExtrusion( oReader );

						break;

					case 'l':

						if ( _T("o:lock") == sName )
							pItem = new OOX::VmlOffice::CLock( oReader );

						break;

					case 's':

						if ( _T("o:signatureline") == sName )
							pItem = new OOX::VmlOffice::CSignatureLine( oReader );
						else if ( _T("o:skew") == sName )
							pItem = new OOX::VmlOffice::CSkew( oReader );

						break;
					}

					break;

				case 'p':
					
					

					break;

				case 'v':

					switch ( wsChar3 )
					{
					case 'f':
						if ( _T("v:fill") == sName )
							pItem = new OOX::Vml::CFill( oReader );
						else if ( _T("v:formulas") == sName )
							pItem = new OOX::Vml::CFormulas( oReader );

						break;

					case 'h':

						if ( _T("v:handles") == sName )
							pItem = new OOX::Vml::CHandles( oReader );

						break;

					case 'i':

						if ( _T("v:imagedata") == sName )
							pItem = new OOX::Vml::CImageData( oReader );

						break;

					case 'p':

						if ( _T("v:path") == sName )
							pItem = new OOX::Vml::CPath( oReader );

						break;

					case 's':

						if ( _T("v:shadow") == sName )
							pItem = new OOX::Vml::CShadow( oReader );
						else if ( _T("v:stroke") == sName )
							pItem = new OOX::Vml::CStroke( oReader );

						break;

					case 't':

						if ( _T("v:textbox") == sName )
							pItem = new OOX::Vml::CTextbox( oReader );
						else if ( _T("v:textpath") == sName )
							pItem = new OOX::Vml::CTextPath( oReader );

						break;
					}

					break;


				case 'w':

					if ( _T("wd:anchorLock") == sName )
						pItem = new OOX::VmlWord::CAnchorLock( oReader );
					else if ( _T("wd:borderbottom") == sName )
						pItem = new OOX::VmlWord::CBorder( oReader );
					else if ( _T("wd:borderleft") == sName )
						pItem = new OOX::VmlWord::CBorder( oReader );
					else if ( _T("wd:borderright") == sName )
						pItem = new OOX::VmlWord::CBorder( oReader );
					else if ( _T("wd:bordertop") == sName )
						pItem = new OOX::VmlWord::CBorder( oReader );
					else if ( _T("wd:wrap") == sName )
						pItem = new OOX::VmlWord::CWrap( oReader );
					else if ( _T("w10:wrap") == sName )
						pItem = new OOX::VmlWord::CWrap( oReader );

					break;

				case 'x':

					if ( _T("x:ClientData") == sName )
						pItem = new OOX::Vml::CClientData( oReader );

					break;

				}

				if ( NULL != pItem )
					m_arrItems.Add( pItem );
			}
		}
		CString CVmlShapeElements::toXML() const
		{
			CString sResult;

			for ( int nIndex = 0; nIndex < m_arrItems.GetSize(); nIndex++ )
			{
				if ( m_arrItems[nIndex] )
					sResult += m_arrItems[nIndex]->toXML();
			}

			return sResult;
		};
		
		
		
		void CGroup::fromXML(XmlUtils::CXmlNode& oNode)
		{
			
		}
		void CGroup::fromXML(XmlUtils::CXmlLiteReader& oReader)
		{
			ReadAttributes( oReader );

			if ( oReader.IsEmptyNode() )
				return;

			int nCurDepth = oReader.GetDepth();
			while ( oReader.ReadNextSiblingNode( nCurDepth ) )
			{
				CWCharWrapper sName = oReader.GetName();
				wchar_t wsChar1 = sName[0];
				wchar_t wsChar3 = sName[2];

				WritingElement *pItem = NULL;
				switch ( wsChar1 )
				{
				case 'o':

					switch ( wsChar3 )
					{
					case 'c':

						if ( _T("o:callout") == sName )
							pItem = new OOX::VmlOffice::CCallout( oReader );
						else if ( _T("o:clippath") == sName )
							pItem = new OOX::VmlOffice::CClipPath( oReader );

						break;

					case 'd':

						if ( _T("o:diagram") == sName )
							pItem = new OOX::VmlOffice::CDiagram( oReader );

						break;


					case 'e':

						if ( _T("o:extrusion") == sName )
							pItem = new OOX::VmlOffice::CExtrusion( oReader );

						break;

					case 'l':

						if ( _T("o:lock") == sName )
							pItem = new OOX::VmlOffice::CLock( oReader );

						break;

					case 's':

						if ( _T("o:signatureline") == sName )
							pItem = new OOX::VmlOffice::CSignatureLine( oReader );
						else if ( _T("o:skew") == sName )
							pItem = new OOX::VmlOffice::CSkew( oReader );

						break;
					}

					break;

				case 'p':
					
					

					break;

				case 'v':

					switch ( wsChar3 )
					{
					case 'a':
						if ( _T("v:arc") == sName )
							pItem = dynamic_cast<WritingElement*>(new OOX::Vml::CArc( oReader ));
						break;

					case 'c':
						if ( _T("v:curve") == sName )
							pItem = new OOX::Vml::CCurve( oReader );
						break;

					case 'f':
						if ( _T("v:fill") == sName )
							pItem = new OOX::Vml::CFill( oReader );
						else if ( _T("v:formulas") == sName )
							pItem = new OOX::Vml::CFormulas( oReader );

						break;

					case 'g':
						if ( _T("v:group") == sName )
							pItem = new OOX::Vml::CGroup( oReader );

						break;

					case 'h':

						if ( _T("v:handles") == sName )
							pItem = new OOX::Vml::CHandles( oReader );

						break;

					case 'i':

						if ( _T("v:imagedata") == sName )
							pItem = new OOX::Vml::CImageData( oReader );
						else if ( _T("v:image") == sName )
							pItem = new OOX::Vml::CImage( oReader );

						break;

					case 'l':

						if ( _T("v:line") == sName )
							pItem = new OOX::Vml::CLine( oReader );

						break;

					case 'o':

						if ( _T("v:oval") == sName )
							pItem = new OOX::Vml::COval( oReader );

						break;

					case 'p':

						if ( _T("v:path") == sName )
							pItem = new OOX::Vml::CPath( oReader );
						else if ( _T("v:polyline") == sName )
							pItem = new OOX::Vml::CPolyLine( oReader );

						break;

					case 'r':

						if ( _T("v:rect") == sName )
							pItem = new OOX::Vml::CRect( oReader );
						else if ( _T("v:roundrect") == sName )
							pItem = new OOX::Vml::CRoundRect( oReader );

						break;

					case 's':

						if ( _T("v:shadow") == sName )
							pItem = new OOX::Vml::CShadow( oReader );
						else if ( _T("v:shape") == sName )
							pItem = new OOX::Vml::CShape( oReader );
						else if ( _T("v:shapetype") == sName )
							pItem = new OOX::Vml::CShapeType( oReader );
						else if ( _T("v:stroke") == sName )
							pItem = new OOX::Vml::CStroke( oReader );

						break;

					case 't':

						if ( _T("v:textbox") == sName )
							pItem = new OOX::Vml::CTextbox( oReader );
						else if ( _T("v:textpath") == sName )
							pItem = new OOX::Vml::CTextPath( oReader );

						break;
					}

					break;


				case 'w':

					if ( _T("wd:anchorLock") == sName )
						pItem = new OOX::VmlWord::CAnchorLock( oReader );
					else if ( _T("wd:borderbottom") == sName )
						pItem = new OOX::VmlWord::CBorder( oReader );
					else if ( _T("wd:borderleft") == sName )
						pItem = new OOX::VmlWord::CBorder( oReader );
					else if ( _T("wd:borderright") == sName )
						pItem = new OOX::VmlWord::CBorder( oReader );
					else if ( _T("wd:bordertop") == sName )
						pItem = new OOX::VmlWord::CBorder( oReader );
					else if ( _T("wd:wrap") == sName )
						pItem = new OOX::VmlWord::CWrap( oReader );

					break;

				case 'x':

					if ( _T("x:ClientData") == sName )
						pItem = new OOX::Vml::CClientData( oReader );

					break;

				}

				if ( NULL != pItem )
					m_arrItems.Add( pItem );
			}
		}
		CString CGroup::toXML() const
		{
			CString sResult = _T("<v:group ");

			ComplexTypes_WriteAttribute2( _T("id=\""),          m_sId );
			ComplexTypes_WriteAttribute ( _T("style=\""),       m_oStyle );
			ComplexTypes_WriteAttribute2( _T("href=\""),        m_sHref );
			ComplexTypes_WriteAttribute2( _T("target=\""),      m_sTarget );
			ComplexTypes_WriteAttribute2( _T("class=\""),       m_sClass );
			ComplexTypes_WriteAttribute2( _T("title=\""),       m_sTitle );
			ComplexTypes_WriteAttribute2( _T("alt=\""),         m_sAlt );

			ComplexTypes_WriteAttribute ( _T("coordsize=\""),   m_oCoordSize );
			ComplexTypes_WriteAttribute ( _T("coordorigin=\""), m_oCoordOrigin );
			ComplexTypes_WriteAttribute ( _T("wrapcoords=\""),  m_oWrapCoords );

			if ( SimpleTypes::booleanTrue != m_oPrint.GetValue() )
				sResult += _T("print=\"false\" ");

			ComplexTypes_WriteAttribute2( _T("o:spid=\""),      m_sSpId );

			if ( SimpleTypes::booleanFalse != m_oOned.GetValue() )
				sResult += _T("o:oned=\"true\" ");

			ComplexTypes_WriteAttribute ( _T("o:regroupid=\""), m_oRegroupId );

			if ( SimpleTypes::booleanFalse != m_oDoubleClickNotify.GetValue() )
				sResult += _T("o:doubleclicknotify=\"true\" ");

			if ( SimpleTypes::booleanFalse != m_oButton.GetValue() )
				sResult += _T("o:button=\"true\" ");

			if ( SimpleTypes::booleanFalse != m_oUserHidden.GetValue() )
				sResult += _T("o:userhidden=\"true\" ");

			if ( SimpleTypes::booleanFalse != m_oBullet.GetValue() )
				sResult += _T("o:bullet=\"true\" ");

			if ( SimpleTypes::booleanFalse != m_oHr.GetValue() )
				sResult += _T("o:hr=\"true\" ");

			if ( SimpleTypes::booleanFalse != m_oHrStd.GetValue() )
				sResult += _T("o:hrstd=\"true\" ");

			if ( SimpleTypes::booleanFalse != m_oHrNoShade.GetValue() )
				sResult += _T("o:hrnoshade=\"true\" ");

			if ( 0 != m_oHrPct.GetValue() )
				sResult += _T("o:hrpct=\"") + m_oHrPct.ToString() + _T("\" ");

			if ( SimpleTypes::hralignLeft != m_oHrAlign.GetValue() )
				sResult += _T("o:hralign=\"") + m_oHrAlign.ToString() + _T("\" ");

			if ( SimpleTypes::booleanFalse != m_oAllowInCell.GetValue() )
				sResult += _T("o:allowincell=\"true\" ");

			if ( SimpleTypes::booleanFalse != m_oAllowOverlap.GetValue() )
				sResult += _T("o:allowoverlap=\"true\" ");

			if ( SimpleTypes::booleanFalse != m_oUserDrawn.GetValue() )
				sResult += _T("o:userdrawn=\"true\" ");

			ComplexTypes_WriteAttribute ( _T("o:bordertopcolor=\""),    m_oBorderTopColor );
			ComplexTypes_WriteAttribute ( _T("o:borderleftcolor=\""),   m_oBorderLeftColor );
			ComplexTypes_WriteAttribute ( _T("o:borderbottomcolor=\""), m_oBorderBottomColor );
			ComplexTypes_WriteAttribute ( _T("o:borderrightcolor=\""),  m_oBorderRightColor );

			ComplexTypes_WriteAttribute ( _T("o:dgmlayout=\""),     m_oDgmLayout );
			ComplexTypes_WriteAttribute ( _T("o:dgmlayoutmru=\""),  m_oDgmLayoutMru );
			ComplexTypes_WriteAttribute2( _T("o:dgmnodekind=\""),   m_oDgmNodeKind );

			if ( SimpleTypes::insetmodeCustom != m_oInsetMode.GetValue() )
				sResult += _T("o:insetmode=\"") + m_oInsetMode.ToString() + _T("\" ");

			if ( SimpleTypes::booleanTrue != m_oFilled.GetValue() )
				sResult += _T("filled=\"false\" ");

			if ( SimpleTypes::colortypeWhite != m_oFillColor.GetValue() )
				sResult += _T("fillcolor=\"") + m_oFillColor.ToString() + _T("\" ");

			ComplexTypes_WriteAttribute ( _T("editas=\""),     m_oEditAs );
			if ( 0 != m_oTableProperties.GetValue() )
				sResult += _T("o:tableproperties=\"") + m_oTableProperties.ToString() + _T("\" ");

			ComplexTypes_WriteAttribute ( _T("o:tablelimits=\""),  m_oTableLimits );

			sResult += _T(">");

			for ( int nIndex = 0; nIndex < m_arrItems.GetSize(); nIndex++ )
			{
				if ( m_arrItems[nIndex] )
					sResult += m_arrItems[nIndex]->toXML();
			}

			sResult += _T("</v:group>");

			return sResult;
		}
		
		
		
		void CPolyLine::fromXML(XmlUtils::CXmlNode& oNode)
		{
			
		}
		void CPolyLine::fromXML(XmlUtils::CXmlLiteReader& oReader)
		{
			ReadAttributes( oReader );
			CVmlAttributes::fromXML( oReader );

			if ( oReader.IsEmptyNode() )
				return;

			int nCurDepth = oReader.GetDepth();
			while ( oReader.ReadNextSiblingNode( nCurDepth ) )
			{
				CWCharWrapper sName = oReader.GetName();
				wchar_t wsChar1 = sName[0];
				wchar_t wsChar3 = sName[2];

				WritingElement *pItem = NULL;
				switch ( wsChar1 )
				{
				case 'o':

					switch ( wsChar3 )
					{
					case 'c':

						if ( _T("o:callout") == sName )
							pItem = new OOX::VmlOffice::CCallout( oReader );
						else if ( _T("o:clippath") == sName )
							pItem = new OOX::VmlOffice::CClipPath( oReader );

						break;

					case 'e':

						if ( _T("o:extrusion") == sName )
							pItem = new OOX::VmlOffice::CExtrusion( oReader );

						break;

					case 'i':

						if ( _T("o:ink") == sName )
							pItem = new OOX::VmlOffice::CInk( oReader );

						break;

					case 'l':

						if ( _T("o:lock") == sName )
							pItem = new OOX::VmlOffice::CLock( oReader );

						break;

					case 's':

						if ( _T("o:signatureline") == sName )
							pItem = new OOX::VmlOffice::CSignatureLine( oReader );
						else if ( _T("o:skew") == sName )
							pItem = new OOX::VmlOffice::CSkew( oReader );

						break;
					}

					break;

				case 'p':
					
					

					break;

				case 'v':

					switch ( wsChar3 )
					{
					case 'f':
						if ( _T("v:fill") == sName )
							pItem = new OOX::Vml::CFill( oReader );
						else if ( _T("v:formulas") == sName )
							pItem = new OOX::Vml::CFormulas( oReader );

						break;

					case 'h':

						if ( _T("v:handles") == sName )
							pItem = new OOX::Vml::CHandles( oReader );

						break;

					case 'i':

						if ( _T("v:imagedata") == sName )
							pItem = new OOX::Vml::CImageData( oReader );

						break;

					case 'p':

						if ( _T("v:path") == sName )
							pItem = new OOX::Vml::CPath( oReader );

						break;

					case 's':

						if ( _T("v:shadow") == sName )
							pItem = new OOX::Vml::CShadow( oReader );
						else if ( _T("v:stroke") == sName )
							pItem = new OOX::Vml::CStroke( oReader );

						break;

					case 't':

						if ( _T("v:textbox") == sName )
							pItem = new OOX::Vml::CTextbox( oReader );
						else if ( _T("v:textpath") == sName )
							pItem = new OOX::Vml::CTextPath( oReader );

						break;
					}

					break;


				case 'w':

					if ( _T("wd:anchorLock") == sName )
						pItem = new OOX::VmlWord::CAnchorLock( oReader );
					else if ( _T("wd:borderbottom") == sName )
						pItem = new OOX::VmlWord::CBorder( oReader );
					else if ( _T("wd:borderleft") == sName )
						pItem = new OOX::VmlWord::CBorder( oReader );
					else if ( _T("wd:borderright") == sName )
						pItem = new OOX::VmlWord::CBorder( oReader );
					else if ( _T("wd:bordertop") == sName )
						pItem = new OOX::VmlWord::CBorder( oReader );
					else if ( _T("wd:wrap") == sName )
						pItem = new OOX::VmlWord::CWrap( oReader );

					break;

				case 'x':

					if ( _T("x:ClientData") == sName )
						pItem = new OOX::Vml::CClientData( oReader );

					break;

				}

				if ( NULL != pItem )
					m_arrItems.Add( pItem );
			}
		}
		CString CPolyLine::toXML() const
		{
			CString sResult = _T("<v:polyline ");

			sResult += CVmlAttributes::toXML();

			sResult += _T("points=\"") + m_oPoints.ToString() + _T("\">");

			sResult += CVmlShapeElements::toXML();

			sResult += _T("</v:polyline>");

			return sResult;
		}
		
		
		
		void CShape::fromXML(XmlUtils::CXmlNode& oNode)
		{
			
		}
		void CShape::fromXML(XmlUtils::CXmlLiteReader& oReader)
		{
			ReadAttributes( oReader );
			CVmlAttributes::fromXML( oReader );

			if ( oReader.IsEmptyNode() )
				return;

			int nCurDepth = oReader.GetDepth();
			while ( oReader.ReadNextSiblingNode( nCurDepth ) )
			{
				CWCharWrapper sName = oReader.GetName();
				wchar_t wsChar1 = sName[0];
				wchar_t wsChar3 = sName[2];

				WritingElement *pItem = NULL;
				switch ( wsChar1 )
				{
				case 'o':

					switch ( wsChar3 )
					{
					case 'c':

						if ( _T("o:callout") == sName )
							pItem = new OOX::VmlOffice::CCallout( oReader );
						else if ( _T("o:clippath") == sName )
							pItem = new OOX::VmlOffice::CClipPath( oReader );

						break;

					case 'e':

						if ( _T("o:extrusion") == sName )
							pItem = new OOX::VmlOffice::CExtrusion( oReader );
						else if ( _T("o:equationxml") == sName )
							pItem = new OOX::VmlOffice::CEquationXml( oReader );

						break;

					case 'i':

						if ( _T("o:ink") == sName )
							pItem = new OOX::VmlOffice::CInk( oReader );

						break;

					case 'l':

						if ( _T("o:lock") == sName )
							pItem = new OOX::VmlOffice::CLock( oReader );

						break;

					case 's':

						if ( _T("o:signatureline") == sName )
							pItem = new OOX::VmlOffice::CSignatureLine( oReader );
						else if ( _T("o:skew") == sName )
							pItem = new OOX::VmlOffice::CSkew( oReader );

						break;
					}

					break;

				case 'p':
					
					
					
					

					break;

				case 'v':

					switch ( wsChar3 )
					{
					case 'f':
						if ( _T("v:fill") == sName )
							pItem = new OOX::Vml::CFill( oReader );
						else if ( _T("v:formulas") == sName )
							pItem = new OOX::Vml::CFormulas( oReader );

						break;

					case 'h':

						if ( _T("v:handles") == sName )
							pItem = new OOX::Vml::CHandles( oReader );

						break;

					case 'i':

						if ( _T("v:imagedata") == sName )
							pItem = new OOX::Vml::CImageData( oReader );

						break;

					case 'p':

						if ( _T("v:path") == sName )
							pItem = new OOX::Vml::CPath( oReader );

						break;

					case 's':

						if ( _T("v:shadow") == sName )
							pItem = new OOX::Vml::CShadow( oReader );
						else if ( _T("v:stroke") == sName )
							pItem = new OOX::Vml::CStroke( oReader );

						break;

					case 't':

						if ( _T("v:textbox") == sName )
							pItem = new OOX::Vml::CTextbox( oReader );
						else if ( _T("v:textpath") == sName )
							pItem = new OOX::Vml::CTextPath( oReader );

						break;
					}

					break;


				case 'w':

					if ( _T("wd:anchorLock") == sName )
						pItem = new OOX::VmlWord::CAnchorLock( oReader );
					else if ( _T("wd:borderbottom") == sName )
						pItem = new OOX::VmlWord::CBorder( oReader );
					else if ( _T("wd:borderleft") == sName )
						pItem = new OOX::VmlWord::CBorder( oReader );
					else if ( _T("wd:borderright") == sName )
						pItem = new OOX::VmlWord::CBorder( oReader );
					else if ( _T("wd:bordertop") == sName )
						pItem = new OOX::VmlWord::CBorder( oReader );
					else if ( _T("w10:wrap") == sName )
						pItem = new OOX::VmlWord::CWrap( oReader );

					break;

				case 'x':

					if ( _T("x:ClientData") == sName )
						pItem = new OOX::Vml::CClientData( oReader );

					break;

				}

				if ( NULL != pItem )
					m_arrItems.Add( pItem );
			}
		}
		CString CShape::toXML() const
		{
			CString sResult = _T("<v:shape ");

			sResult += CVmlAttributes::toXML();

			if ( m_sType.IsInit() )
			{
				sResult += _T("type=\"");
				sResult += m_sType->GetString();
				sResult += _T("\" ");
			}

			if ( m_oAdj.IsInit() )
			{
				sResult += _T("adj=\"");
				sResult += m_oAdj->GetString();
				sResult += _T("\" ");
			}

			if ( m_oPath.IsInit() )
				sResult += _T("path=\"") + m_oPath->ToString() + _T("\" ");

			

			if ( m_sEquationXML.IsInit() )
			{
				sResult += _T("equationxml=\"");
				sResult += m_sEquationXML->GetString();
				sResult += _T("\" ");
			}

			sResult += _T(">");

			sResult += CVmlShapeElements::toXML();

			sResult += _T("</v:shape>");

			return sResult;
		}
		
		
		
		void CShapeType::fromXML(XmlUtils::CXmlNode& oNode)
		{
			
		}
		void CShapeType::fromXML(XmlUtils::CXmlLiteReader& oReader)
		{
			ReadAttributes( oReader );
			CVmlAttributes::fromXML( oReader );

			if ( oReader.IsEmptyNode() )
				return;

			int nCurDepth = oReader.GetDepth();
			while ( oReader.ReadNextSiblingNode( nCurDepth ) )
			{
				CWCharWrapper sName = oReader.GetName();
				wchar_t wsChar1 = sName[0];
				wchar_t wsChar3 = sName[2];

				WritingElement *pItem = NULL;
				switch ( wsChar1 )
				{
				case 'o':

					switch ( wsChar3 )
					{
					case 'c':

						if ( _T("o:callout") == sName )
							pItem = new OOX::VmlOffice::CCallout( oReader );
						else if ( _T("o:clippath") == sName )
							pItem = new OOX::VmlOffice::CClipPath( oReader );
						else if ( _T("o:complex") == sName )
							pItem = new OOX::VmlOffice::CComplex( oReader );

						break;

					case 'e':

						if ( _T("o:extrusion") == sName )
							pItem = new OOX::VmlOffice::CExtrusion( oReader );

						break;

					case 'l':

						if ( _T("o:lock") == sName )
							pItem = new OOX::VmlOffice::CLock( oReader );

						break;

					case 's':

						if ( _T("o:signatureline") == sName )
							pItem = new OOX::VmlOffice::CSignatureLine( oReader );
						else if ( _T("o:skew") == sName )
							pItem = new OOX::VmlOffice::CSkew( oReader );

						break;
					}

					break;

				case 'p':
					
					

					break;

				case 'v':

					switch ( wsChar3 )
					{
					case 'f':
						if ( _T("v:fill") == sName )
							pItem = new OOX::Vml::CFill( oReader );
						else if ( _T("v:formulas") == sName )
							pItem = new OOX::Vml::CFormulas( oReader );

						break;

					case 'h':

						if ( _T("v:handles") == sName )
							pItem = new OOX::Vml::CHandles( oReader );

						break;

					case 'i':

						if ( _T("v:imagedata") == sName )
							pItem = new OOX::Vml::CImageData( oReader );

						break;

					case 'p':

						if ( _T("v:path") == sName )
							pItem = new OOX::Vml::CPath( oReader );

						break;

					case 's':

						if ( _T("v:shadow") == sName )
							pItem = new OOX::Vml::CShadow( oReader );
						else if ( _T("v:stroke") == sName )
							pItem = new OOX::Vml::CStroke( oReader );

						break;

					case 't':

						if ( _T("v:textbox") == sName )
							pItem = new OOX::Vml::CTextbox( oReader );
						else if ( _T("v:textpath") == sName )
							pItem = new OOX::Vml::CTextPath( oReader );

						break;
					}

					break;


				case 'w':

					if ( _T("wd:anchorLock") == sName )
						pItem = new OOX::VmlWord::CAnchorLock( oReader );
					else if ( _T("wd:borderbottom") == sName )
						pItem = new OOX::VmlWord::CBorder( oReader );
					else if ( _T("wd:borderleft") == sName )
						pItem = new OOX::VmlWord::CBorder( oReader );
					else if ( _T("wd:borderright") == sName )
						pItem = new OOX::VmlWord::CBorder( oReader );
					else if ( _T("wd:bordertop") == sName )
						pItem = new OOX::VmlWord::CBorder( oReader );
					else if ( _T("wd:wrap") == sName )
						pItem = new OOX::VmlWord::CWrap( oReader );

					break;

				case 'x':

					if ( _T("x:ClientData") == sName )
						pItem = new OOX::Vml::CClientData( oReader );

					break;

				}

				if ( NULL != pItem )
					m_arrItems.Add( pItem );
			}
		}
		CString CShapeType::toXML() const
		{
			CString sResult = _T("<v:shapetype ");

			sResult += CVmlAttributes::toXML();

			if ( m_oAdj.IsInit() )
			{
				sResult += _T("adj=\"");
				sResult += m_oAdj->GetString();
				sResult += _T("\" ");
			}

			if ( m_oPath.IsInit() )
				sResult += _T("path=\"") + m_oPath->ToString() + _T("\" ");

			if ( SimpleTypes::booleanFalse != m_oMaster.GetValue() )
				sResult += _T("o:master=\"true\" ");

			sResult += _T(">");

			sResult += CVmlShapeElements::toXML();

			sResult += _T("</v:shapetype>");

			return sResult;
		}

		void CClientData::fromXML(XmlUtils::CXmlNode& oNode)
		{
			
		}
		void CClientData::fromXML(XmlUtils::CXmlLiteReader& oReader)
		{
			ReadAttributes( oReader );

			if ( oReader.IsEmptyNode() )
				return;

			int nCurDepth = oReader.GetDepth();
			while ( oReader.ReadNextSiblingNode( nCurDepth ) )
			{
				CWCharWrapper sName = oReader.GetName();

				if ( _T("x:MoveWithCells") == sName )
					m_oMoveWithCells = oReader.GetText2();
				else if ( _T("x:SizeWithCells") == sName )
					m_oSizeWithCells = oReader.GetText2();
				else if ( _T("x:Anchor") == sName )
					m_oAnchor = oReader.GetText2();
				else if ( _T("x:Row") == sName )
					m_oRow = oReader.GetText2();
				else if ( _T("x:Column") == sName )
					m_oColumn = oReader.GetText2();
			}
		}
		CString CClientData::toXML() const
		{
			CString sResult = _T("<x:ClientData ");
			if(m_oObjectType.IsInit())
				sResult += m_oObjectType->ToString();
			sResult += _T(">");
			if(m_oMoveWithCells.IsInit() && true == m_oMoveWithCells->ToBool())
				sResult += _T("<x:MoveWithCells/>");
			if(m_oSizeWithCells.IsInit() && true == m_oSizeWithCells->ToBool())
				sResult += _T("<x:SizeWithCells/>");
			if(m_oAnchor.IsInit())
			{
				CString sAnchor;sAnchor.Format(_T("<x:Anchor>%s</x:Anchor>"), m_oAnchor.get());
				sResult += sAnchor;
			}
			if(m_oRow.IsInit())
			{
				CString sRow;sRow.Format(_T("<x:Row>%d</x:Row>"), m_oRow.get());
				sResult += sRow;
			}
			if(m_oColumn.IsInit())
			{
				CString sColumn;sColumn.Format(_T("<x:Column>%d</x:Column>"), m_oColumn.get());
				sResult += sColumn;
			}
			sResult = _T("</x:ClientData>");
			return sResult;
		}
	} 
} 
