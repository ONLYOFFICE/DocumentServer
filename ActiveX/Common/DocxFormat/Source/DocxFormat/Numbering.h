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
#ifndef OOX_NUMBERING_FILE_INCLUDE_H_
#define OOX_NUMBERING_FILE_INCLUDE_H_

#include "File.h"
#include "WritingElement.h"

#include "Logic/ParagraphProperty.h"
#include "Logic/RunProperty.h"

namespace ComplexTypes
{
	namespace Word
	{
		
		
		
		class CLvlLegacy : public ComplexType
		{
		public:
			ComplexTypes_AdditionConstructors(CLvlLegacy)
			CLvlLegacy()
			{
			}
			virtual ~CLvlLegacy()
			{
			}

			virtual void    FromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("w:legacy"),       m_oLegacy );
				oNode.ReadAttributeBase( _T("w:legacyIndent"), m_oLegacyIndent );
				oNode.ReadAttributeBase( _T("w:legacySpace"),  m_oLegacySpace );
			}
			virtual void    FromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("w:legacy"),       m_oLegacy )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:legacyIndent"), m_oLegacyIndent )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:legacySpace"),  m_oLegacySpace )
				WritingElement_ReadAttributes_End( oReader )
			}
			virtual CString ToString() const
			{
				CString sResult;

				ComplexTypes_WriteAttribute( _T("w:legacy=\""),       m_oLegacy );
				ComplexTypes_WriteAttribute( _T("w:legacyIndent=\""), m_oLegacyIndent );
				ComplexTypes_WriteAttribute( _T("w:legacySpace=\""),  m_oLegacySpace );

				return sResult;
			}

		public:

			nullable<SimpleTypes::COnOff<>             > m_oLegacy;
			nullable<SimpleTypes::CSignedTwipsMeasure  > m_oLegacyIndent;
			nullable<SimpleTypes::CTwipsMeasure        > m_oLegacySpace;
		};

		
		
		
		class CLevelText : public ComplexType
		{
		public:
			ComplexTypes_AdditionConstructors(CLevelText)
			CLevelText()
			{
			}
			virtual ~CLevelText()
			{
			}

			virtual void    FromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("w:null"), m_oNull );
				oNode.ReadAttributeBase( _T("w:val"),  m_sVal );
			}
			virtual void    FromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("w:null"), m_oNull )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:val"),  m_sVal )
				WritingElement_ReadAttributes_End( oReader )
			}
			virtual CString ToString() const
			{
				CString sResult;

				ComplexTypes_WriteAttribute( _T("w:null=\""), m_oNull );

				if ( m_sVal.IsInit() )
				{
					sResult += _T("w:val=\"");
					sResult += m_sVal->GetString();
					sResult += _T("\" ");
				}

				return sResult;
			}

		public:

			nullable<SimpleTypes::COnOff<> > m_oNull;
			nullable<CString               > m_sVal;
		};

		
		
		
		class CLevelSuffix : public ComplexType
		{
		public:
			ComplexTypes_AdditionConstructors(CLevelSuffix)
			CLevelSuffix()
			{
			}
			virtual ~CLevelSuffix()
			{
			}

			virtual void    FromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("w:val"), m_oVal );
			}
			virtual void    FromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_ReadSingle( oReader, _T("w:val"), m_oVal )
				WritingElement_ReadAttributes_End( oReader )
			}
			virtual CString ToString() const
			{
				CString sResult;

				ComplexTypes_WriteAttribute( _T("w:val=\""), m_oVal );

				return sResult;
			}

		public:

			nullable<SimpleTypes::CLevelSuffix<>> m_oVal;
		};

		
		
		
		class CMultiLevelType : public ComplexType
		{
		public:
			ComplexTypes_AdditionConstructors(CMultiLevelType)
			CMultiLevelType()
			{
			}
			virtual ~CMultiLevelType()
			{
			}

			virtual void    FromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("w:val"), m_oVal );
			}
			virtual void    FromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_ReadSingle( oReader, _T("w:val"), m_oVal )
				WritingElement_ReadAttributes_End( oReader )
			}
			virtual CString ToString() const
			{
				CString sResult;

				ComplexTypes_WriteAttribute( _T("w:val=\""), m_oVal );

				return sResult;
			}

		public:

			nullable<SimpleTypes::CMultiLevelType<>> m_oVal;
		};

	} 
} 

namespace OOX
{
	namespace Numbering
	{
		
		
		
		class CLvl : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CLvl)
			CLvl()
			{
			}
			virtual ~CLvl()
			{
			}

		public:
			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				if ( _T("w:lvl") != oNode.GetName() )
					return;

				oNode.ReadAttributeBase( _T("w:ilvl"),      m_oIlvl );
				oNode.ReadAttributeBase( _T("w:tentative"), m_oTentative );
				oNode.ReadAttributeBase( _T("w:tplc"),      m_oTplc );

				XmlUtils::CXmlNode oChild;
				
				WritingElement_ReadNode( oNode, oChild, _T("w:isLgl"),          m_oIsLgl );
				WritingElement_ReadNode( oNode, oChild, _T("w:legacy"),         m_oLegacy );
				WritingElement_ReadNode( oNode, oChild, _T("w:lvlJc"),          m_oLvlJc );
				WritingElement_ReadNode( oNode, oChild, _T("w:lvlPicBulletId"), m_oLvlPicBulletId );
				WritingElement_ReadNode( oNode, oChild, _T("w:lvlRestart"),     m_oLvlRestart );
				WritingElement_ReadNode( oNode, oChild, _T("w:lvlText"),        m_oLvlText );
				WritingElement_ReadNode( oNode, oChild, _T("w:numFmt"),         m_oNumFmt );
				WritingElement_ReadNode( oNode, oChild, _T("w:pPr"),            m_oPPr );
				WritingElement_ReadNode( oNode, oChild, _T("w:pStyle"),         m_oPStyle );
				WritingElement_ReadNode( oNode, oChild, _T("w:rPr"),            m_oRPr );
				WritingElement_ReadNode( oNode, oChild, _T("w:start"),          m_oStart );
				WritingElement_ReadNode( oNode, oChild, _T("w:suff"),           m_oSuffix );
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
					if      ( _T("w:isLgl")          == sName ) m_oIsLgl = oReader;
					else if ( _T("w:legacy")         == sName ) m_oLegacy = oReader;
					else if ( _T("w:lvlJc")          == sName ) m_oLvlJc = oReader;
					else if ( _T("w:lvlPicBulletId") == sName ) m_oLvlPicBulletId = oReader;
					else if ( _T("w:lvlRestart")     == sName ) m_oLvlRestart = oReader;
					else if ( _T("w:lvlText")        == sName ) m_oLvlText = oReader;
					else if ( _T("w:numFmt")         == sName ) m_oNumFmt = oReader;
					else if ( _T("w:pPr")            == sName ) m_oPPr = oReader;
					else if ( _T("w:pStyle")         == sName ) m_oPStyle = oReader;
					else if ( _T("w:rPr")            == sName ) m_oRPr = oReader;
					else if ( _T("w:start")          == sName ) m_oStart = oReader;
					else if ( _T("w:suff")           == sName ) m_oSuffix = oReader;

				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<w:lvl ");

				ComplexTypes_WriteAttribute( _T("w:ilvl=\""),      m_oIlvl );
				ComplexTypes_WriteAttribute( _T("w:tentative=\""), m_oTentative );
				ComplexTypes_WriteAttribute( _T("w:tplc=\""),      m_oTplc );

				sResult += _T(">");

				WritingElement_WriteNode_1( _T("<w:isLgl "),          m_oIsLgl );
				WritingElement_WriteNode_1( _T("<w:legacy "),         m_oLegacy );
				WritingElement_WriteNode_1( _T("<w:lvlJc "),          m_oLvlJc );
				WritingElement_WriteNode_1( _T("<w:lvlPicBulletId "), m_oLvlPicBulletId );
				WritingElement_WriteNode_1( _T("<w:lvlRestart "),     m_oLvlRestart );
				WritingElement_WriteNode_1( _T("<w:lvlText "),        m_oLvlText );
				WritingElement_WriteNode_1( _T("<w:numFmt "),         m_oNumFmt );
				WritingElement_WriteNode_2( m_oPPr );
				WritingElement_WriteNode_1( _T("<w:pStyle "),         m_oPStyle );
				WritingElement_WriteNode_2( m_oRPr );
				WritingElement_WriteNode_1( _T("<w:start "),          m_oStart );
				WritingElement_WriteNode_1( _T("<w:suff "),           m_oSuffix );
	
				sResult += _T("</w:lvl>");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_w_lvl;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("w:ilvl"),      m_oIlvl )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:tentative"), m_oTentative )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:tplc"),      m_oTplc )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			

			nullable<SimpleTypes::CDecimalNumber<> > m_oIlvl;
			nullable<SimpleTypes::COnOff<>         > m_oTentative;
			nullable<SimpleTypes::CLongHexNumber<> > m_oTplc;

			
			nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue> > m_oIsLgl;
			nullable<ComplexTypes::Word::CLvlLegacy                      > m_oLegacy;
			nullable<ComplexTypes::Word::CJc                             > m_oLvlJc;
			nullable<ComplexTypes::Word::CDecimalNumber                  > m_oLvlPicBulletId;
			nullable<ComplexTypes::Word::CDecimalNumber                  > m_oLvlRestart;
			nullable<ComplexTypes::Word::CLevelText                      > m_oLvlText;
			nullable<ComplexTypes::Word::CNumFmt                         > m_oNumFmt;
			nullable<OOX::Logic::CParagraphProperty                      > m_oPPr;
			nullable<ComplexTypes::Word::CString_                        > m_oPStyle;
			nullable<OOX::Logic::CRunProperty                            > m_oRPr;
			nullable<ComplexTypes::Word::CDecimalNumber                  > m_oStart;
			nullable<ComplexTypes::Word::CLevelSuffix                    > m_oSuffix;

		};
		
		
		
		class CAbstractNum : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CAbstractNum)
			CAbstractNum()
			{
			}
			virtual ~CAbstractNum()
			{
			}

		public:
			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				if ( _T("w:abstractNum") != oNode.GetName() )
					return;

				oNode.ReadAttributeBase( _T("w:abstractNumId"), m_oAbstractNumId );

				XmlUtils::CXmlNode oChild;
				
				WritingElement_ReadNode( oNode, oChild, _T("w:multiLevelType"), m_oMultiLevelType );
				WritingElement_ReadNode( oNode, oChild, _T("w:name"),           m_oName );
				WritingElement_ReadNode( oNode, oChild, _T("w:nsid"),           m_oNsid );
				WritingElement_ReadNode( oNode, oChild, _T("w:numStyleLink"),   m_oNumStyleLink );
				WritingElement_ReadNode( oNode, oChild, _T("w:styleLink"),      m_oStyleLink );
				WritingElement_ReadNode( oNode, oChild, _T("w:tmpl"),           m_oTmpl );

				XmlUtils::CXmlNodes oLvlList;
				if ( oNode.GetNodes( _T("w:lvl"), oLvlList ) )
				{
					XmlUtils::CXmlNode oLvlNode;
					for ( int nIndex = 0; nIndex < oLvlList.GetCount(); nIndex++ )
					{
						if ( oLvlList.GetAt( nIndex, oLvlNode ) )
						{
							OOX::Numbering::CLvl oLvl = oLvlNode;
							m_arrLvl.Add( oLvl );
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
					if ( _T("w:lvl") == sName )
					{
						OOX::Numbering::CLvl oLvl = oReader;
						m_arrLvl.Add( oLvl );
					}
					else if ( _T("w:multiLevelType") == sName ) m_oMultiLevelType = oReader;
					else if ( _T("w:name")           == sName ) m_oName = oReader;
					else if ( _T("w:nsid")           == sName ) m_oNsid = oReader;
					else if ( _T("w:numStyleLink")   == sName ) m_oNumStyleLink = oReader;
					else if ( _T("w:styleLink")      == sName ) m_oStyleLink = oReader;
					else if ( _T("w:tmpl")           == sName ) m_oTmpl = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<w:abstractNum ");

				ComplexTypes_WriteAttribute( _T("w:abstractNumId=\""), m_oAbstractNumId );

				sResult += _T(">");

				WritingElement_WriteNode_1( _T("<w:multiLevelType "), m_oMultiLevelType );
				WritingElement_WriteNode_1( _T("<w:name "),           m_oName );
				WritingElement_WriteNode_1( _T("<w:nsid "),           m_oNsid );
				WritingElement_WriteNode_1( _T("<w:numStyleLink "),   m_oNumStyleLink );
				WritingElement_WriteNode_1( _T("<w:styleLink "),      m_oStyleLink );
				WritingElement_WriteNode_1( _T("<w:tmpl "),           m_oTmpl );

				for ( int nIndex = 0; nIndex < m_arrLvl.GetSize(); nIndex++ )
				{
					sResult += m_arrLvl[nIndex].toXML();
				}

	
				sResult += _T("</w:abstractNum>");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_w_abstractNum;
			}
		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_ReadSingle( oReader, _T("w:abstractNumId"), m_oAbstractNumId )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			

			nullable<SimpleTypes::CDecimalNumber<> > m_oAbstractNumId;

			
			CSimpleArray<OOX::Numbering::CLvl                            > m_arrLvl;
			nullable<ComplexTypes::Word::CMultiLevelType                 > m_oMultiLevelType;
			nullable<ComplexTypes::Word::CString_                        > m_oName;
			nullable<ComplexTypes::Word::CLongHexNumber                  > m_oNsid;
			nullable<ComplexTypes::Word::CString_                        > m_oNumStyleLink;
			nullable<ComplexTypes::Word::CString_                        > m_oStyleLink;
			nullable<ComplexTypes::Word::CLongHexNumber                  > m_oTmpl;
		};
		
		
		
		class CNumLvl : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CNumLvl)
			CNumLvl()
			{
			}
			virtual ~CNumLvl()
			{
			}

		public:
			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				if ( _T("w:lvlOverride") != oNode.GetName() )
					return;

				oNode.ReadAttributeBase( _T("w:ilvl"), m_oIlvl );

				XmlUtils::CXmlNode oChild;
				
				WritingElement_ReadNode( oNode, oChild, _T("w:lvl"),           m_oLvl );
				WritingElement_ReadNode( oNode, oChild, _T("w:startOverride"), m_oStartOverride );
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
					if ( _T("w:lvl") == sName )
						m_oLvl = oReader;
					else if ( _T("w:startOverride") == sName )
						m_oStartOverride = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<w:lvlOverride ");

				ComplexTypes_WriteAttribute( _T("w:ilvl=\""), m_oIlvl );

				sResult += _T(">");

				WritingElement_WriteNode_2( m_oLvl );
				WritingElement_WriteNode_1( _T("<w:startOverride "), m_oStartOverride );
	
				sResult += _T("</w:lvlOverride>");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_w_lvlOverride;
			}
		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_ReadSingle( oReader, _T("w:ilvl"), m_oIlvl )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			

			nullable<SimpleTypes::CDecimalNumber<> > m_oIlvl;

			
			nullable<OOX::Numbering::CLvl               > m_oLvl;
			nullable<ComplexTypes::Word::CDecimalNumber > m_oStartOverride;
		};
		
		
		
		class CNum : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CNum)
			CNum()
			{
			}
			virtual ~CNum()
			{
			}

		public:
			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				if ( _T("w:num") != oNode.GetName() )
					return;

				oNode.ReadAttributeBase( _T("w:numId"), m_oNumId );

				XmlUtils::CXmlNode oChild;
				
				WritingElement_ReadNode( oNode, oChild, _T("w:abstractNumId"), m_oAbstractNumId );

				XmlUtils::CXmlNodes oLvlList;
				if ( oNode.GetNodes( _T("w:lvlOverride"), oLvlList ) )
				{
					XmlUtils::CXmlNode oLvlNode;
					for ( int nIndex = 0; nIndex < oLvlList.GetCount(); nIndex++ )
					{
						if ( oLvlList.GetAt( nIndex, oLvlNode ) )
						{
							OOX::Numbering::CNumLvl oNumLvl = oLvlNode;
							m_arrLvlOverride.Add( oNumLvl );
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
					if ( _T("w:lvlOverride") == sName )
					{
						OOX::Numbering::CNumLvl oNumLvl = oReader;
						m_arrLvlOverride.Add( oNumLvl );
					}
					else if ( _T("w:abstractNumId") == sName )
						m_oAbstractNumId = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<w:num ");

				ComplexTypes_WriteAttribute( _T("w:numId=\""), m_oNumId );

				sResult += _T(">");

				WritingElement_WriteNode_1( _T("<w:abstractNumId "), m_oAbstractNumId );

				for ( int nIndex = 0; nIndex < m_arrLvlOverride.GetSize(); nIndex++ )
					sResult += m_arrLvlOverride[nIndex].toXML();

				sResult += _T("</w:num>");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_w_num;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_ReadSingle( oReader, _T("w:numId"), m_oNumId )
				WritingElement_ReadAttributes_End( oReader )
			}
		public:

			

			nullable<SimpleTypes::CDecimalNumber<> > m_oNumId;

			
			nullable<ComplexTypes::Word::CDecimalNumber > m_oAbstractNumId;
			CSimpleArray<OOX::Numbering::CNumLvl        > m_arrLvlOverride;
		};
		
		
		
		class CNumPicBullet : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CNumPicBullet)
			CNumPicBullet()
			{
			}
			virtual ~CNumPicBullet()
			{
			}

		public:
			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("w:numPicBulletId"), m_oNumPicBulletId );

				XmlUtils::CXmlNode oChild;
				
				WritingElement_ReadNode( oNode, oChild, _T("w:drawing"), m_oDrawing );
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
					if ( _T("w:drawing") == sName )
					{
						m_oDrawing = oReader;
					}
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<w:numPicBullet ");

				sResult += m_oNumPicBulletId.ToString() + _T(">");

				sResult += m_oDrawing.toXML();

				sResult += _T("</w:numPicBullet>");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_w_numPicBullet;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_ReadSingle( oReader, _T("w:numPicBulletId"), m_oNumPicBulletId )
				WritingElement_ReadAttributes_End( oReader )
			}
		public:

			
			SimpleTypes::CDecimalNumber<> m_oNumPicBulletId;

			
			OOX::Logic::CDrawing          m_oDrawing;
		};
	} 
} 

namespace OOX
{
	class CNumbering : public OOX::File
	{
	public:
		CNumbering()
		{
		}
		CNumbering(const CPath& oPath)
		{
			read( oPath );
		}
		virtual ~CNumbering()
		{
		}
	public:

		virtual void read(const CPath& oFilePath)
		{
#ifdef USE_LITE_READER

			XmlUtils::CXmlLiteReader oReader;
			
			if ( !oReader.FromFile( oFilePath.GetPath() ) )
				return;

			if ( !oReader.ReadNextNode() )
				return;

			CWCharWrapper sName = oReader.GetName();
			if ( _T("w:numbering") == sName && !oReader.IsEmptyNode() )
			{
				int nNumberingDepth = oReader.GetDepth();
				while ( oReader.ReadNextSiblingNode( nNumberingDepth ) )
				{
					sName = oReader.GetName();
					if ( _T("w:abstractNum") == sName )
					{
						OOX::Numbering::CAbstractNum oAbstractNum = oReader;
						m_arrAbstractNum.Add( oAbstractNum );
					}
					else if ( _T("w:num") == sName )
					{
						OOX::Numbering::CNum oNum = oReader;
						m_arrNum.Add( oNum );
					}
					else if ( _T("w:numIdMacAtCleanup") == sName )
						m_oNumIdMacAtCleanup = oReader;
					else if ( _T("w:numPicBullet") == sName )
					{
						OOX::Numbering::CNumPicBullet oNumPic = oReader;
						m_arrNumPicBullet.Add( oNumPic );
					}
				}
			}
#else
			XmlUtils::CXmlNode oNumbering;
			oNumbering.FromXmlFile( oFilePath.GetPath(), true );

			if ( _T("w:numbering") == oNumbering.GetName() )
			{
				XmlUtils::CXmlNodes oAbstractNumList;
				oNumbering.GetNodes( _T("w:abstractNum"), oAbstractNumList );

				for ( int nIndex = 0; nIndex < oAbstractNumList.GetCount(); nIndex++ )
				{
					XmlUtils::CXmlNode oAbstractNumNode;
					if ( oAbstractNumList.GetAt( nIndex, oAbstractNumNode ) )
					{
						OOX::Numbering::CAbstractNum oAbstractNum = oAbstractNumNode;
						m_arrAbstractNum.Add( oAbstractNum );
					}
				}

				XmlUtils::CXmlNodes oNumList;
				oNumbering.GetNodes( _T("w:num"), oNumList );

				for ( int nIndex = 0; nIndex < oNumList.GetCount(); nIndex++ )
				{
					XmlUtils::CXmlNode oNumNode;
					if ( oNumList.GetAt( nIndex, oNumNode ) )
					{
						OOX::Numbering::CNum oNum = oNumNode;
						m_arrNum.Add( oNum );
					}
				}

				XmlUtils::CXmlNode oNumIdPicBulletNode;
				if ( oNumbering.GetNode( _T("w:numIdMacAtCleanup"), oNumIdPicBulletNode ) )
					m_oNumIdMacAtCleanup = oNumIdPicBulletNode;

				
				
				XmlUtils::CXmlNodes oNumPicList;
				oNumbering.GetNodes( _T("w:numPicBullet"), oNumPicList );

				for ( int nIndex = 0; nIndex < oNumPicList.GetCount(); nIndex++ )
				{
					XmlUtils::CXmlNode oNumNode;
					if ( oNumPicList.GetAt( nIndex, oNumNode ) )
					{
						OOX::Numbering::CNumPicBullet oNum = oNumNode;
						m_arrNumPicBullet.Add( oNum );
					}
				}
			}
#endif
		}

		virtual void write(const CPath& oFilePath, const CPath& oDirectory, CContentTypes& oContent) const
		{
			CString sXml;
			sXml = _T("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><w:numbering xmlns:mc=\"http://schemas.openxmlformats.org/markup-compatibility/2006\" xmlns:r=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships\" xmlns:w=\"http://schemas.openxmlformats.org/wordprocessingml/2006/main\" xmlns:w14=\"http://schemas.microsoft.com/office/word/2010/wordml\" mc:Ignorable=\"w14\">");

			for ( int nIndex = 0; nIndex < m_arrAbstractNum.GetSize(); nIndex++ )
			{
				sXml += m_arrAbstractNum[nIndex].toXML();
			}

			for ( int nIndex = 0; nIndex < m_arrNum.GetSize(); nIndex++ )
			{
				sXml += m_arrNum[nIndex].toXML();
			}

			if ( m_oNumIdMacAtCleanup.IsInit() )
			{
				sXml += _T("<w:numIdMacAtCleanup ");
				sXml += m_oNumIdMacAtCleanup->ToString();
				sXml += _T("/>");
			}

			for ( int nIndex = 0; nIndex < m_arrNumPicBullet.GetSize(); nIndex++ )
			{
				sXml += m_arrNumPicBullet[nIndex].toXML();
			}

			sXml += _T("</w:numbering>");

			CDirectory::SaveToFile( oFilePath.GetPath(), sXml );
		}

	public:

		virtual const OOX::FileType type() const
		{
			return FileTypes::Numbering;
		}
		virtual const CPath DefaultDirectory() const
		{
			return type().DefaultDirectory();
		}
		virtual const CPath DefaultFileName() const
		{
			return type().DefaultFileName();
		}

	public:

		CSimpleArray<OOX::Numbering::CAbstractNum   > m_arrAbstractNum;
		CSimpleArray<OOX::Numbering::CNum           > m_arrNum;
		nullable<ComplexTypes::Word::CDecimalNumber > m_oNumIdMacAtCleanup;
		CSimpleArray<OOX::Numbering::CNumPicBullet  > m_arrNumPicBullet;

	};
} 

#endif // OOX_NUMBERING_FILE_INCLUDE_H_