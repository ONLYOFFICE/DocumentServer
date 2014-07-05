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
#ifndef OOX_DOCUMENT_FILE_INCLUDE_H_
#define OOX_DOCUMENT_FILE_INCLUDE_H_

#include "../Base/Nullable.h"

#include "../Common/SimpleTypes_Word.h"
#include "../Common/SimpleTypes_Shared.h"
#include "../Common/Utils.h"

#include "WritingElement.h"
#include "File.h"
#include "FileTypes.h"
#include "IFileContainer.h"

#include "Logic/SectionProperty.h"
#include "Logic/Annotations.h"
#include "Logic/Paragraph.h"
#include "Logic/Sdt.h"
#include "Logic/Table.h"
#include "Math/oMathPara.h"
#include "Math/oMath.h"

#include "External/Hyperlink.h"

namespace OOX
{
	namespace Logic
	{
		
		
		

		
		class CBackground : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CBackground)
			CBackground()
			{
			}
			virtual ~CBackground()
			{
			}

		public:
			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("w:color"),      m_oColor );
				oNode.ReadAttributeBase( _T("w:themeColor"), m_oThemeColor );
				oNode.ReadAttributeBase( _T("w:themeShade"), m_oThemeShade );
				oNode.ReadAttributeBase( _T("w:themeTint"),  m_oThemeTint );
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( oReader.IsEmptyNode() )
					return;

				int nCurDepth = oReader.GetDepth();
				while( oReader.ReadNextSiblingNode( nCurDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();

					if ( _T("w:drawing") == sName )
						m_oDrawing = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<w:background ");

				if ( m_oColor.IsInit() )
				{
					sResult += "w:color=\"";
					sResult += m_oColor->ToString();
					sResult += "\" ";
				}

				if ( m_oThemeColor.IsInit() )
				{
					sResult += "w:themeColor=\"";
					sResult += m_oThemeColor->ToString();
					sResult += "\" ";
				}

				if ( m_oThemeShade.IsInit() )
				{
					sResult += "w:themeShade=\"";
					sResult += m_oThemeShade->ToString();
					sResult += "\" ";
				}

				if ( m_oThemeTint.IsInit() )
				{
					sResult += "w:themeTint=\"";
					sResult += m_oThemeTint->ToString();
					sResult += "\" ";
				}

				if ( m_oDrawing.IsInit() )
				{
					sResult += _T(">");
					sResult += m_oDrawing->toXML();
					sResult += _T("</w:background>");
				}
				else
					sResult += _T("/>");

				return sResult;
			}

			virtual EElementType getType () const
			{
				return et_w_background;
			}
		
		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )

				WritingElement_ReadAttributes_Read_if     ( oReader, _T("w:color"),      m_oColor )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:themeColor"), m_oThemeColor )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:themeShade"), m_oThemeShade )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:themeTint"),  m_oThemeTint )

				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			
			nullable<SimpleTypes::CHexColor<>        > m_oColor;
			nullable<SimpleTypes::CThemeColor<>      > m_oThemeColor;
			nullable<SimpleTypes::CUcharHexNumber<>  > m_oThemeShade;
			nullable<SimpleTypes::CUcharHexNumber<>  > m_oThemeTint;

			
			nullable<OOX::Logic::CDrawing            > m_oDrawing;
		};
	}
}

namespace OOX
{







	
	
	
	class CDocument : public OOX::File, public IFileContainer
	{
	public:
		CDocument()
		{
		}
		CDocument(const CPath& oPath)
		{
			read( oPath );
		}
		virtual ~CDocument()
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

		virtual void read(const CPath& oPath)
		{
			m_oReadPath = oPath;
			IFileContainer::Read( oPath );

#ifdef USE_LITE_READER
			Common::readAllShapeTypes(oPath, m_arrShapeTypes);

			XmlUtils::CXmlLiteReader oReader;
			
			if ( !oReader.FromFile( oPath.GetPath() ) )
				return;

			if ( !oReader.ReadNextNode() )
				return;

			CWCharWrapper sName = oReader.GetName();
			if ( _T("w:document") == sName )
			{
				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
				{
					int nDocumentDepth = oReader.GetDepth();
					while ( oReader.ReadNextSiblingNode( nDocumentDepth ) )
					{
						sName = oReader.GetName();

						if ( _T("w:body") == sName && !oReader.IsEmptyNode() )
						{
							int nBodyDepth = oReader.GetDepth();
							while ( oReader.ReadNextSiblingNode( nBodyDepth ) )
							{
								sName = oReader.GetName();
								WritingElement *pItem = NULL;

								 if ( _T("w:bookmarkEnd") == sName )
									pItem = new Logic::CBookmarkEnd( oReader );
								else if ( _T("w:bookmarkStart") == sName )
									pItem = new Logic::CBookmarkStart( oReader );
								else if ( _T("w:commentRangeEnd") == sName )
									pItem = new Logic::CCommentRangeEnd( oReader );
								else if ( _T("w:commentRangeStart") == sName )
									pItem = new Logic::CCommentRangeStart( oReader );
								
								
								else if ( _T("w:customXmlDelRangeEnd") == sName )
									pItem = new Logic::CCustomXmlDelRangeEnd( oReader );
								else if ( _T("w:customXmlDelRangeStart") == sName )
									pItem = new Logic::CCustomXmlDelRangeStart( oReader );
								else if ( _T("w:customXmlInsRangeEnd") == sName )
									pItem = new Logic::CCustomXmlInsRangeEnd( oReader );
								else if ( _T("w:customXmlInsRangeStart") == sName )
									pItem = new Logic::CCustomXmlInsRangeStart( oReader );
								else if ( _T("w:customXmlMoveFromRangeEnd") == sName ) 
									pItem = new Logic::CCustomXmlMoveFromRangeEnd( oReader );
								else if ( _T("w:customXmlMoveFromRangeStart") == sName )
									pItem = new Logic::CCustomXmlMoveFromRangeStart( oReader );
								else if ( _T("w:customXmlMoveToRangeEnd") == sName ) 
									pItem = new Logic::CCustomXmlMoveToRangeEnd( oReader );
								else if ( _T("w:customXmlMoveToRangeStart") == sName )
									pItem = new Logic::CCustomXmlMoveToRangeStart( oReader );
								else if ( _T("w:del") == sName )
									pItem = new Logic::CDel( oReader );
								else if ( _T("w:ins") == sName )
									pItem = new Logic::CIns( oReader );
								
								
								else if ( _T("w:moveFromRangeEnd") == sName )
									pItem = new Logic::CMoveToRangeEnd( oReader );
								else if ( _T("w:moveFromRangeStart") == sName )
									pItem = new Logic::CMoveToRangeStart( oReader );
								
								
								else if ( _T("w:moveToRangeEnd") == sName )
									pItem = new Logic::CMoveToRangeEnd( oReader );
								else if ( _T("w:moveToRangeStart") == sName )
									pItem = new Logic::CMoveToRangeStart( oReader );
								else if ( _T("m:oMath") == sName )
									pItem = new Logic::COMath( oReader );
								else if ( _T("m:oMathPara") == sName )
									pItem = new Logic::COMathPara( oReader );
								else if ( _T("w:p") == sName )
									pItem = new Logic::CParagraph( oReader );
								else if ( _T("w:permEnd") == sName )
									pItem = new Logic::CPermEnd( oReader );
								else if ( _T("w:permStart") == sName )
									pItem = new Logic::CPermStart( oReader );
								else if ( _T("w:proofErr") == sName )
									pItem = new Logic::CProofErr( oReader );
								else if ( _T("w:sdt") == sName )
									pItem = new Logic::CSdt( oReader );
								else if ( _T("w:sectPr") == sName )
									m_oSectPr = oReader;
								else if ( _T("w:tbl") == sName )
									pItem = new Logic::CTbl( oReader );

								if ( pItem )
									m_arrItems.Add( pItem );
							}
						}
						else if ( _T("w:background") == sName )
							m_oBackground = oReader;
					}
				}
			}			

#else

			XmlUtils::CXmlNode oDocument;
			oDocument.FromXmlFile2( oPath.GetPath() );
			if ( _T("w:document") == oDocument.GetName() )
			{
				oDocument.ReadAttributeBase( _T("w:conformance"), m_oConformance );

				XmlUtils::CXmlNode oBackground;
				if ( oDocument.GetNode( _T("w:background"), oBackground ) )
					m_oBackground = oBackground;

				XmlUtils::CXmlNode oBody;
				if ( oDocument.GetNode( _T("w:body"), oBody ) )
				{
					XmlUtils::CXmlNodes oBodyChilds;
					if ( oBody.GetNodes( _T("*"), oBodyChilds ) )
					{
						XmlUtils::CXmlNode oItem;
						for ( int nIndex = 0; nIndex < oBodyChilds.GetCount(); nIndex++ )
						{
							if ( oBodyChilds.GetAt( nIndex, oItem ) )
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
								else if ( _T("w:sectPr") == sName )
									m_oSectPr = oItem;
								else if ( _T("w:tbl") == sName )
									pItem = new Logic::CTbl( oItem );

								if ( pItem )
									m_arrItems.Add( pItem );
							}
						}
					}
				}
			}	
#endif
		}
		virtual void write(const CPath& oPath, const CPath& oDirectory, CContentTypes& oContent) const
		{
			CString sXml;

			if ( SimpleTypes::conformanceclassTransitional != m_oConformance.GetValue() )
			{
				sXml.Format( _T("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><w:document w:conformance=\"%s\" xmlns:wpc=\"http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas\" xmlns:mc=\"http://schemas.openxmlformats.org/markup-compatibility/2006\" xmlns:o=\"urn:schemas-microsoft-com:office:office\" xmlns:r=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships\" xmlns:m=\"http://schemas.openxmlformats.org/officeDocument/2006/math\" xmlns:v=\"urn:schemas-microsoft-com:vml\" xmlns:wp14=\"http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing\" xmlns:wp=\"http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing\" xmlns:w10=\"urn:schemas-microsoft-com:office:word\" xmlns:w=\"http://schemas.openxmlformats.org/wordprocessingml/2006/main\" xmlns:w14=\"http://schemas.microsoft.com/office/word/2010/wordml\" xmlns:wpg=\"http://schemas.microsoft.com/office/word/2010/wordprocessingGroup\" xmlns:wpi=\"http://schemas.microsoft.com/office/word/2010/wordprocessingInk\" xmlns:wne=\"http://schemas.microsoft.com/office/word/2006/wordml\" xmlns:wps=\"http://schemas.microsoft.com/office/word/2010/wordprocessingShape\" mc:Ignorable=\"w14 wp14\">"), m_oConformance.ToString() );
			}
			else
			{
				sXml = _T("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><w:document xmlns:wpc=\"http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas\" xmlns:mc=\"http://schemas.openxmlformats.org/markup-compatibility/2006\" xmlns:o=\"urn:schemas-microsoft-com:office:office\" xmlns:r=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships\" xmlns:m=\"http://schemas.openxmlformats.org/officeDocument/2006/math\" xmlns:v=\"urn:schemas-microsoft-com:vml\" xmlns:wp14=\"http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing\" xmlns:wp=\"http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing\" xmlns:w10=\"urn:schemas-microsoft-com:office:word\" xmlns:w=\"http://schemas.openxmlformats.org/wordprocessingml/2006/main\" xmlns:w14=\"http://schemas.microsoft.com/office/word/2010/wordml\" xmlns:wpg=\"http://schemas.microsoft.com/office/word/2010/wordprocessingGroup\" xmlns:wpi=\"http://schemas.microsoft.com/office/word/2010/wordprocessingInk\" xmlns:wne=\"http://schemas.microsoft.com/office/word/2006/wordml\" xmlns:wps=\"http://schemas.microsoft.com/office/word/2010/wordprocessingShape\" mc:Ignorable=\"w14 wp14\">");
			}

			if ( m_oBackground.IsInit() )
				sXml += m_oBackground->toXML();

			sXml += _T("<w:body>");

			for ( int nIndex = 0; nIndex < m_arrItems.GetSize(); nIndex++ )
			{
				if ( m_arrItems[nIndex] )
				{
					sXml += m_arrItems[nIndex]->toXML();
				}
			}

			if ( m_oSectPr.IsInit() )
				sXml += m_oSectPr->toXML();

			sXml += _T("</w:body></w:document>");

			CDirectory::SaveToFile( oPath.GetPath(), sXml );

			oContent.Registration( type().OverrideType(), oDirectory, oPath );
			IFileContainer::Write( oPath, oDirectory, oContent );
		}
		virtual const OOX::FileType type() const
		{
			return FileTypes::Document;
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
	public:

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
		void AddImage(const CPath& oImagePath, const long lWidth, const long lHeight)
		{
			

			
			

			

			

			
		}
		void AddImage(const CPath& oImagePath, const long lEmuX, const CString& sHRelativeFrom, const long lEmuY, const CString& sVRelativeFrom, const long lWidthEmu, const long lHeightEmu)
		{
			

			
			

			

			

			
		}
		void AddImageInBegin(const CPath& oImagePath, const long lWidth, const long lHeight)
		{
			

			

			
			

			

			

			
		}
		void AddSpaceToLast(const int nCount)
		{
			if ( m_arrItems.GetSize() > 0 && et_w_p == m_arrItems[m_arrItems.GetSize() - 1]->getType() )
			{
				OOX::Logic::CParagraph* pPara = (OOX::Logic::CParagraph*)m_arrItems[m_arrItems.GetSize() - 1];
				pPara->AddSpace( nCount );
			}
		}
		void AddPageBreak()
		{
			WritingElement *pNewElement = new Logic::CParagraph();
			if ( !pNewElement )
				return;

			Logic::CParagraph* pPara = (Logic::CParagraph*)pNewElement;
			pPara->AddBreak( SimpleTypes::brtypePage );

			m_arrItems.Add( pNewElement );
		}
		void AddText(CString& sText)
		{
			WritingElement *pNewElement = new Logic::CParagraph();
			if ( !pNewElement )
				return;

			Logic::CParagraph* pPara = (Logic::CParagraph*)pNewElement;
			pPara->AddText( sText );

			m_arrItems.Add( pNewElement );
		}
		void AddTextToLast(CString& sText)
		{
			if ( m_arrItems.GetSize() > 0 && et_w_p == m_arrItems[m_arrItems.GetSize() - 1]->getType() )
			{
				OOX::Logic::CParagraph* pPara = (OOX::Logic::CParagraph*)m_arrItems[m_arrItems.GetSize() - 1];
				pPara->AddText( sText );
			}
		}
		void AddHyperlink (CString& sNameHref, CString& sText)
		{
			WritingElement *pNewElement = new Logic::CParagraph;
			if ( !pNewElement )
				return;

			Logic::CParagraph* pPara = (Logic::CParagraph*)pNewElement;

			smart_ptr<OOX::File> oHyperlink = smart_ptr<OOX::File>( new OOX::HyperLink( sNameHref ) );
			const OOX::RId rId = Add( oHyperlink );

			
			

			m_arrItems.Add( pNewElement );
		}
		void AddHyperlinkToLast(CString& sNameHref, CString& sText)
		{
			if ( m_arrItems.GetSize() > 0 && et_w_p == m_arrItems[m_arrItems.GetSize() - 1]->getType() )
			{
				OOX::Logic::CParagraph* pPara = (OOX::Logic::CParagraph*)m_arrItems[m_arrItems.GetSize() - 1];

				smart_ptr<OOX::File> oHyperlink = smart_ptr<OOX::File>( new OOX::HyperLink( sNameHref ) );
				const OOX::RId rId = Add( oHyperlink );

				
				
			}		
		}

	private:
		void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
		{
			
			WritingElement_ReadAttributes_Start( oReader )
			WritingElement_ReadAttributes_ReadSingle( oReader, _T("w:conformance"), m_oConformance )
			WritingElement_ReadAttributes_End( oReader )
		}
	public:
		CPath									m_oReadPath;
		
		SimpleTypes::CConformanceClass<SimpleTypes::conformanceclassTransitional> m_oConformance;

		
		nullable<OOX::Logic::CSectionProperty> m_oSectPr;
		nullable<OOX::Logic::CBackground     > m_oBackground;

		CSimpleArray<WritingElement *>         m_arrItems;
		CSimpleArray<CString>				m_arrShapeTypes;

	};

} 

#endif // OOX_DOCUMENT_FILE_INCLUDE_H_