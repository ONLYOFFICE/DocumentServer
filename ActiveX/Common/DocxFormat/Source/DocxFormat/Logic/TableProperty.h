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

#ifndef OOX_LOGIC_TABLE_PROPERTY_INCLUDE_H_
#define OOX_LOGIC_TABLE_PROPERTY_INCLUDE_H_

#include "../WritingElement.h"

#include "../../Common/ComplexTypes.h"

namespace ComplexTypes
{
	namespace Word
	{
		
		
		
		class CJcTable : public ComplexType
		{
		public:
			ComplexTypes_AdditionConstructors(CJcTable)
			CJcTable()
			{
			}
			virtual ~CJcTable()
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

				if ( m_oVal.IsInit() )
				{
					sResult += "w:val=\"";
					sResult += m_oVal->ToString();
					sResult += "\" ";
				}

				return sResult;
			}

		public:

			nullable<SimpleTypes::CJcTable<> > m_oVal;
		};
		
		
		
		class CTblLayoutType : public ComplexType
		{
		public:
			ComplexTypes_AdditionConstructors(CTblLayoutType)
			CTblLayoutType()
			{
			}
			virtual ~CTblLayoutType()
			{
			}

			virtual void    FromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("w:type"), m_oType );
			}
			virtual void    FromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_ReadSingle( oReader, _T("w:type"), m_oType )
				WritingElement_ReadAttributes_End( oReader )
			}
			virtual CString ToString() const
			{
				CString sResult;

				if ( m_oType.IsInit() )
				{
					sResult += "w:type=\"";
					sResult += m_oType->ToString();
					sResult += "\" ";
				}

				return sResult;
			}

		public:

			nullable<SimpleTypes::CTblLayoutType<> > m_oType;
		};
		
		
		
		class CTblLook : public ComplexType
		{
		public:
			ComplexTypes_AdditionConstructors(CTblLook)
			CTblLook()
			{
			}
			virtual ~CTblLook()
			{
			}

			virtual void    FromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("w:firstColumn"), m_oFirstColumn );
				oNode.ReadAttributeBase( _T("w:firstRow"),    m_oFirstRow );
				oNode.ReadAttributeBase( _T("w:lastColumn"),  m_oLastColumn );
				oNode.ReadAttributeBase( _T("w:lastRow"),     m_oLastRow );
				oNode.ReadAttributeBase( _T("w:noHBand"),     m_oNoHBand );
				oNode.ReadAttributeBase( _T("w:noVBand"),     m_oNoVBand );
				oNode.ReadAttributeBase( _T("w:val"),         m_oVal );
			}
			virtual void    FromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("w:firstColumn"), m_oFirstColumn )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:firstRow"),    m_oFirstRow )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:lastColumn"),  m_oLastColumn )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:lastRow"),     m_oLastRow )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:noHBand"),     m_oNoHBand )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:noVBand"),     m_oNoVBand )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:val"),         m_oVal )
				WritingElement_ReadAttributes_End( oReader )
			}
			virtual CString ToString() const
			{
				CString sResult;

				if ( m_oFirstColumn.IsInit() )
				{
					sResult += "w:firstColumn=\"";
					sResult += m_oFirstColumn->ToString();
					sResult += "\" ";
				}

				if ( m_oFirstRow.IsInit() )
				{
					sResult += "w:firstRow=\"";
					sResult += m_oFirstRow->ToString();
					sResult += "\" ";
				}

				if ( m_oLastColumn.IsInit() )
				{
					sResult += "w:lastColumn=\"";
					sResult += m_oLastColumn->ToString();
					sResult += "\" ";
				}

				if ( m_oLastRow.IsInit() )
				{
					sResult += "w:lastRow=\"";
					sResult += m_oLastRow->ToString();
					sResult += "\" ";
				}

				if ( m_oNoHBand.IsInit() )
				{
					sResult += "w:noHBand=\"";
					sResult += m_oNoHBand->ToString();
					sResult += "\" ";
				}

				if ( m_oNoVBand.IsInit() )
				{
					sResult += "w:noVBand=\"";
					sResult += m_oNoVBand->ToString();
					sResult += "\" ";
				}

				ComplexTypes_WriteAttribute( _T("w:val=\""), m_oVal );

				return sResult;
			}

			const bool IsFirstRow   () const
			{
				if ( m_oFirstRow.IsInit() )
					return ( SimpleTypes::onoffTrue == m_oFirstRow->GetValue() );

				if ( m_oVal.IsInit() )
					return ( 0 != ( m_oVal->GetValue() & 0x0020 ) );

				return false;
			}
			const bool IsLastRow    () const
			{
				if ( m_oLastRow.IsInit() )
					return ( SimpleTypes::onoffTrue == m_oLastRow->GetValue() );

				if ( m_oVal.IsInit() )
					return ( 0 != ( m_oVal->GetValue() & 0x0040 ) );

				return false;
			}
			const bool IsFirstColumn() const
			{
				if ( m_oFirstColumn.IsInit() )
					return ( SimpleTypes::onoffTrue == m_oFirstColumn->GetValue() );

				if ( m_oVal.IsInit() )
					return ( 0 != ( m_oVal->GetValue() & 0x0080 ) );

				return false;
			}
			const bool IsLastColumn () const
			{
				if ( m_oLastColumn.IsInit() )
					return ( SimpleTypes::onoffTrue == m_oLastColumn->GetValue() );

				if ( m_oVal.IsInit() )
					return ( 0 != ( m_oVal->GetValue() & 0x0100 ) );

				return false;
			}
			const bool IsNoHBand    () const
			{
				if ( m_oNoHBand.IsInit() )
					return ( SimpleTypes::onoffTrue == m_oNoHBand->GetValue() );

				if ( m_oVal.IsInit() )
					return ( 0 != ( m_oVal->GetValue() & 0x0200 ) );

				return false;
			}
			const bool IsNoVBand    () const
			{
				if ( m_oNoVBand.IsInit() )
					return ( SimpleTypes::onoffTrue == m_oNoVBand->GetValue() );

				if ( m_oVal.IsInit() )
					return ( 0 != ( m_oVal->GetValue() & 0x0400 ) );

				return false;
			}
			const int GetValue() const
			{
				int nRes = 0;
				if(m_oVal.IsInit())
					nRes = m_oVal->GetValue();
				else
				{
					if ( m_oNoVBand.IsInit() &&  SimpleTypes::onoffTrue == m_oNoVBand->GetValue())
						nRes |= 0x0400;
					if ( m_oNoHBand.IsInit() &&  SimpleTypes::onoffTrue == m_oNoHBand->GetValue())
						nRes |= 0x0200;
					if ( m_oLastColumn.IsInit() &&  SimpleTypes::onoffTrue == m_oLastColumn->GetValue())
						nRes |= 0x0100;
					if ( m_oFirstColumn.IsInit() &&  SimpleTypes::onoffTrue == m_oFirstColumn->GetValue())
						nRes |= 0x0080;
					if ( m_oLastRow.IsInit() &&  SimpleTypes::onoffTrue == m_oLastRow->GetValue())
						nRes |= 0x0040;
					if ( m_oFirstRow.IsInit() &&  SimpleTypes::onoffTrue == m_oFirstRow->GetValue())
						nRes |= 0x0020;
				}
				return nRes;
			}
			void SetValue(int nVal)
			{
				m_oVal.Init();
				m_oVal->SetValue(nVal);
				if ( 0 != (nVal & 0x0400))
				{
					m_oNoVBand.Init();
					m_oNoVBand->FromBool(true);
				}
				if ( 0 != (nVal & 0x0200))
				{
					m_oNoHBand.Init();
					m_oNoHBand->FromBool(true);
				}
				if ( 0 != (nVal & 0x0100))
				{
					m_oLastColumn.Init();
					m_oLastColumn->FromBool(true);
				}
				if ( 0 != (nVal & 0x0080))
				{
					m_oFirstColumn.Init();
					m_oFirstColumn->FromBool(true);
				}
				if ( 0 != (nVal & 0x0040))
				{
					m_oLastRow.Init();
					m_oLastRow->FromBool(true);
				}
				if ( 0 != (nVal & 0x0020))
				{
					m_oFirstRow.Init();
					m_oFirstRow->FromBool(true);
				}
			}
		public:

			nullable<SimpleTypes::COnOff<>          > m_oFirstColumn;
			nullable<SimpleTypes::COnOff<>          > m_oFirstRow;
			nullable<SimpleTypes::COnOff<>          > m_oLastColumn;
			nullable<SimpleTypes::COnOff<>          > m_oLastRow;
			nullable<SimpleTypes::COnOff<>          > m_oNoHBand;
			nullable<SimpleTypes::COnOff<>          > m_oNoVBand;
			nullable<SimpleTypes::CShortHexNumber<> > m_oVal;
		};
		
		
		
		class CTblOverlap : public ComplexType
		{
		public:
			ComplexTypes_AdditionConstructors(CTblOverlap)
			CTblOverlap()
			{
			}
			virtual ~CTblOverlap()
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

				if ( m_oVal.IsInit() )
				{
					sResult += "w:val=\"";
					sResult += m_oVal->ToString();
					sResult += "\" ";
				}

				return sResult;
			}

		public:

			nullable<SimpleTypes::CTblOverlap<> > m_oVal;
		};
		
		
		
		class CTblPPr : public ComplexType
		{
		public:
			ComplexTypes_AdditionConstructors(CTblPPr)
			CTblPPr()
			{
			}
			virtual ~CTblPPr()
			{
			}
			void PrepareAfterRead()
			{
				if(false == m_oHorzAnchor.IsInit())
				{
					m_oHorzAnchor.Init();
					m_oHorzAnchor->SetValue(SimpleTypes::hanchorText);
				}
				if(false == m_oVertAnchor.IsInit())
				{
					m_oVertAnchor.Init();
					m_oVertAnchor->SetValue(SimpleTypes::vanchorMargin);
				}
				if(false == m_oTblpX.IsInit() && false == m_oTblpXSpec.IsInit())
				{
					m_oTblpXSpec.Init();
					m_oTblpXSpec->SetValue(SimpleTypes::xalignLeft);
				}
				if(false == m_oTblpY.IsInit() && false == m_oTblpYSpec.IsInit())
				{
					m_oTblpY.Init();
					m_oTblpY->FromTwips(0);
				}
			}
			virtual void    FromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("w:bottomFromText"), m_oBottomFromText );
				oNode.ReadAttributeBase( _T("w:horzAnchor"),     m_oHorzAnchor );
				oNode.ReadAttributeBase( _T("w:leftFromText"),   m_oLeftFromText );
				oNode.ReadAttributeBase( _T("w:rightFromText"),  m_oRightFromText );
				oNode.ReadAttributeBase( _T("w:tblpX"),          m_oTblpX );
				oNode.ReadAttributeBase( _T("w:tblpXSpec"),      m_oTblpXSpec );
				oNode.ReadAttributeBase( _T("w:tblpY"),          m_oTblpY );
				oNode.ReadAttributeBase( _T("w:tblpYSpec"),      m_oTblpYSpec );
				oNode.ReadAttributeBase( _T("w:topFromText"),    m_oTopFromText );
				oNode.ReadAttributeBase( _T("w:vertAnchor"),     m_oVertAnchor );
				PrepareAfterRead();
			}
			virtual void    FromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("w:bottomFromText"), m_oBottomFromText )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:horzAnchor"),     m_oHorzAnchor )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:leftFromText"),   m_oLeftFromText )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:rightFromText"),  m_oRightFromText )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:tblpX"),          m_oTblpX )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:tblpXSpec"),      m_oTblpXSpec )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:tblpY"),          m_oTblpY )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:tblpYSpec"),      m_oTblpYSpec )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:topFromText"),    m_oTopFromText )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:vertAnchor"),     m_oVertAnchor )
				WritingElement_ReadAttributes_End( oReader )
				PrepareAfterRead();
			}
			virtual CString ToString() const
			{
				CString sResult;

				ComplexTypes_WriteAttribute( _T("w:bottomFromText=\""), m_oBottomFromText );
				ComplexTypes_WriteAttribute( _T("w:horzAnchor=\""),     m_oHorzAnchor );
				ComplexTypes_WriteAttribute( _T("w:leftFromText=\""),   m_oLeftFromText );
				ComplexTypes_WriteAttribute( _T("w:rightFromText=\""),  m_oRightFromText );
				ComplexTypes_WriteAttribute( _T("w:tblpX=\""),          m_oTblpX );
				ComplexTypes_WriteAttribute( _T("w:tblpXSpec=\""),      m_oTblpXSpec );
				ComplexTypes_WriteAttribute( _T("w:tblpY=\""),          m_oTblpY );
				ComplexTypes_WriteAttribute( _T("w:tblpYSpec=\""),      m_oTblpYSpec );
				ComplexTypes_WriteAttribute( _T("w:topFromText=\""),    m_oTopFromText );
				ComplexTypes_WriteAttribute( _T("w:vertAnchor=\""),     m_oVertAnchor );

				return sResult;
			}

		public:

			nullable<SimpleTypes::CTwipsMeasure       > m_oBottomFromText;
			nullable<SimpleTypes::CHAnchor<>          > m_oHorzAnchor;
			nullable<SimpleTypes::CTwipsMeasure       > m_oLeftFromText;
			nullable<SimpleTypes::CTwipsMeasure       > m_oRightFromText;
			nullable<SimpleTypes::CSignedTwipsMeasure > m_oTblpX;
			nullable<SimpleTypes::CXAlign<>           > m_oTblpXSpec;
			nullable<SimpleTypes::CSignedTwipsMeasure > m_oTblpY;
			nullable<SimpleTypes::CYAlign<>           > m_oTblpYSpec;
			nullable<SimpleTypes::CTwipsMeasure       > m_oTopFromText;
			nullable<SimpleTypes::CVAnchor<>          > m_oVertAnchor;

		};
	} 
} 

namespace OOX
{
	namespace Logic
	{
		
		
		
		class CTblBorders : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CTblBorders)
			CTblBorders()
			{
			}
			virtual ~CTblBorders()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				if ( _T("w:tblBorders") != oNode.GetName() )
					return;

				XmlUtils::CXmlNode oChild;

				if ( oNode.GetNode( _T("w:bottom"), oChild ) )  
					m_oBottom = oChild;

				if ( oNode.GetNode( _T("w:end"), oChild ) )  
					m_oEnd = oChild;

				if ( oNode.GetNode( _T("w:insideH"), oChild ) )  
					m_oInsideH = oChild;

				if ( oNode.GetNode( _T("w:insideV"), oChild ) )  
					m_oInsideV = oChild;

				if ( oNode.GetNode( _T("w:start"), oChild ) )  
					m_oStart = oChild;

				if ( oNode.GetNode( _T("w:top"), oChild ) )  
					m_oTop = oChild;

				if ( !m_oEnd.IsInit() && oNode.GetNode( _T("w:right"), oChild ) )
					m_oEnd = oChild;

				if ( !m_oStart.IsInit() && oNode.GetNode( _T("w:left"), oChild ) )
					m_oStart = oChild;
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader) 
			{
				if ( oReader.IsEmptyNode() )
					return;

				int nParentDepth = oReader.GetDepth();
				while( oReader.ReadNextSiblingNode( nParentDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();
					if ( _T("w:bottom") == sName )
						m_oBottom = oReader;
					else if ( _T("w:end") == sName )
						m_oEnd = oReader;
					else if ( _T("w:insideH") == sName )
						m_oInsideH = oReader;
					else if ( _T("w:insideV") == sName )
						m_oInsideV = oReader;
					else if ( _T("w:start") == sName )
						m_oStart = oReader;
					else if ( _T("w:top") == sName )
						m_oTop = oReader;
					else if ( _T("w:right") == sName )
						m_oEnd = oReader;
					else if ( _T("w:left") == sName )
						m_oStart = oReader;
				}
			}
			virtual CString      toXML() const                     
			{
				CString sResult = _T("<w:tblBorders>");

				if ( m_oBottom.IsInit() )
				{
					sResult += _T("<w:bottom ");
					sResult += m_oBottom->ToString();
					sResult += _T("/>");						
				}

				if ( m_oEnd.IsInit() )
				{
					sResult += _T("<w:end ");
					sResult += m_oEnd->ToString();
					sResult += _T("/>");						
				}

				if ( m_oInsideH.IsInit() )
				{
					sResult += _T("<w:insideH ");
					sResult += m_oInsideH->ToString();
					sResult += _T("/>");						
				}

				if ( m_oInsideV.IsInit() )
				{
					sResult += _T("<w:insideV ");
					sResult += m_oInsideV->ToString();
					sResult += _T("/>");						
				}

				if ( m_oStart.IsInit() )
				{
					sResult += _T("<w:start ");
					sResult += m_oStart->ToString();
					sResult += _T("/>");						
				}

				if ( m_oTop.IsInit() )
				{
					sResult += _T("<w:top ");
					sResult += m_oTop->ToString();
					sResult += _T("/>");						
				}

				sResult += _T("</w:tblBorders>");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_w_tblBorders;
			}
			static const CTblBorders Merge(const CTblBorders& oPrev, const CTblBorders& oCurrent)
			{
				CTblBorders oProperties;
				oProperties.m_oBottom            = Merge( oPrev.m_oBottom,            oCurrent.m_oBottom );
				oProperties.m_oEnd            = Merge( oPrev.m_oEnd,            oCurrent.m_oEnd );
				oProperties.m_oInsideH            = Merge( oPrev.m_oInsideH,            oCurrent.m_oInsideH );
				oProperties.m_oInsideV            = Merge( oPrev.m_oInsideV,            oCurrent.m_oInsideV );
				oProperties.m_oStart            = Merge( oPrev.m_oStart,            oCurrent.m_oStart );
				oProperties.m_oTop            = Merge( oPrev.m_oTop,            oCurrent.m_oTop );

				return oProperties;
			}
			template<typename Type>
			static nullable<Type>     Merge(const nullable<Type> &oPrev, const nullable<Type> &oCurrent)
			{
				nullable<Type> oResult;

				if ( oCurrent.IsInit() )
					oResult = oCurrent;
				else if ( oPrev.IsInit() )
					oResult = oPrev;

				return oResult;
			}
		public:

			nullable<ComplexTypes::Word::CBorder > m_oBottom;
			nullable<ComplexTypes::Word::CBorder > m_oEnd;
			nullable<ComplexTypes::Word::CBorder > m_oInsideH;
			nullable<ComplexTypes::Word::CBorder > m_oInsideV;
			nullable<ComplexTypes::Word::CBorder > m_oStart;
			nullable<ComplexTypes::Word::CBorder > m_oTop;

		};
		
		
		
		class CTblCellMar : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CTblCellMar)
			CTblCellMar()
			{
			}
			virtual ~CTblCellMar()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				if ( _T("w:tblCellMar") != oNode.GetName() )
					return;

				XmlUtils::CXmlNode oChild;

				if ( oNode.GetNode( _T("w:bottom"), oChild ) )  
					m_oBottom = oChild;

				if ( oNode.GetNode( _T("w:end"), oChild ) )  
					m_oEnd = oChild;

				if ( oNode.GetNode( _T("w:start"), oChild ) )  
					m_oStart = oChild;

				if ( oNode.GetNode( _T("w:top"), oChild ) )  
					m_oTop = oChild;

				if ( !m_oEnd.IsInit() && oNode.GetNode( _T("w:right"), oChild ) )
					m_oEnd = oChild;

				if ( !m_oStart.IsInit() && oNode.GetNode( _T("w:left"), oChild ) )
					m_oStart = oChild;
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader) 
			{
				if ( oReader.IsEmptyNode() )
					return;

				int nParentDepth = oReader.GetDepth();
				while( oReader.ReadNextSiblingNode( nParentDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();
					if ( _T("w:bottom") == sName )  
						m_oBottom = oReader;
					else if ( _T("w:end") == sName )  
						m_oEnd = oReader;
					else if ( _T("w:start") == sName )  
						m_oStart = oReader;
					else if ( _T("w:top") == sName )  
						m_oTop = oReader;
					else if ( _T("w:right") == sName )  
						m_oEnd = oReader;
					else if ( _T("w:left") == sName )  
						m_oStart = oReader;
				}
			}
			virtual CString      toXML() const                     
			{
				CString sResult = _T("<w:tblCellMar>");

				if ( m_oBottom.IsInit() )
				{
					sResult += _T("<w:bottom ");
					sResult += m_oBottom->ToString();
					sResult += _T("/>");						
				}

				if ( m_oEnd.IsInit() )
				{
					sResult += _T("<w:end ");
					sResult += m_oEnd->ToString();
					sResult += _T("/>");						
				}

				if ( m_oStart.IsInit() )
				{
					sResult += _T("<w:start ");
					sResult += m_oStart->ToString();
					sResult += _T("/>");						
				}

				if ( m_oTop.IsInit() )
				{
					sResult += _T("<w:top ");
					sResult += m_oTop->ToString();
					sResult += _T("/>");						
				}

				sResult += _T("</w:tblCellMar>");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_w_tblCellMar;
			}
			static const CTblCellMar Merge(const CTblCellMar& oPrev, const CTblCellMar& oCurrent)
			{
				CTblCellMar oProperties;
				oProperties.m_oBottom            = Merge( oPrev.m_oBottom,            oCurrent.m_oBottom );
				oProperties.m_oEnd            = Merge( oPrev.m_oEnd,            oCurrent.m_oEnd );
				oProperties.m_oStart            = Merge( oPrev.m_oStart,            oCurrent.m_oStart );
				oProperties.m_oTop            = Merge( oPrev.m_oTop,            oCurrent.m_oTop );

				return oProperties;
			}
			template<typename Type>
			static nullable<Type>     Merge(const nullable<Type> &oPrev, const nullable<Type> &oCurrent)
			{
				nullable<Type> oResult;

				if ( oCurrent.IsInit() )
					oResult = oCurrent;
				else if ( oPrev.IsInit() )
					oResult = oPrev;

				return oResult;
			}
		public:

			nullable<ComplexTypes::Word::CTblWidth > m_oBottom;
			nullable<ComplexTypes::Word::CTblWidth > m_oEnd;
			nullable<ComplexTypes::Word::CTblWidth > m_oStart;
			nullable<ComplexTypes::Word::CTblWidth > m_oTop;

		};
		
		
		
		class CTableProperty;
		class CTblPrChange : public WritingElement
		{
		public:
			CTblPrChange();
			CTblPrChange(XmlUtils::CXmlNode &oNode);
			CTblPrChange(XmlUtils::CXmlLiteReader& oReader);
			virtual ~CTblPrChange();
			const CTblPrChange& operator = (const XmlUtils::CXmlNode &oNode);
			const CTblPrChange& operator = (const XmlUtils::CXmlLiteReader& oReader);
		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode);
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader);
			virtual CString      toXML() const;
			virtual EElementType getType() const;

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader);

		public:

			
			nullable<CString                       > m_sAuthor;
			nullable<SimpleTypes::CDateTime        > m_oDate;
			nullable<SimpleTypes::CDecimalNumber<> > m_oId;

			
			nullable<CTableProperty>				 m_pTblPr;
		};
		
		
		
		class CTableProperty : public WritingElement
		{
		public:
			CTableProperty()
			{
				m_bTblPrChange = false;
			}
			CTableProperty(XmlUtils::CXmlNode &oNode)
			{
				m_bTblPrChange = false;

				fromXML( oNode );
			}
			CTableProperty(XmlUtils::CXmlLiteReader& oReader)
			{
				m_bTblPrChange = false;

				fromXML( oReader );
			}
			virtual ~CTableProperty()
			{
			}
			const CTableProperty& operator=(const XmlUtils::CXmlNode &oNode)
			{
				fromXML( (XmlUtils::CXmlNode &)oNode );
				return *this;
			}
			const CTableProperty& operator=(const XmlUtils::CXmlLiteReader& oReader)
			{
				fromXML( (XmlUtils::CXmlLiteReader&)oReader );
				return *this;
			}

		public:

			virtual void    fromXML(XmlUtils::CXmlNode& oNode)
			{
				if ( _T("w:tblPr") != oNode.GetName() )
					return;

				XmlUtils::CXmlNode oChild;

				WritingElement_ReadNode( oNode, oChild, _T("w:bidiVisual"),          m_oBidiVisual );
				WritingElement_ReadNode( oNode, oChild, _T("w:jc"),                  m_oJc );
				WritingElement_ReadNode( oNode, oChild, _T("w:shd"),                 m_oShade );
				WritingElement_ReadNode( oNode, oChild, _T("w:tblBorders"),          m_oTblBorders );
				WritingElement_ReadNode( oNode, oChild, _T("w:tblCaption"),          m_oTblCaption );
				WritingElement_ReadNode( oNode, oChild, _T("w:tblCellMar"),          m_oTblCellMar );
				WritingElement_ReadNode( oNode, oChild, _T("w:tblCellSpacing"),      m_oTblCellSpacing );
				WritingElement_ReadNode( oNode, oChild, _T("w:tblDescription"),      m_oTblDescription );
				WritingElement_ReadNode( oNode, oChild, _T("w:tblInd"),              m_oTblInd );
				WritingElement_ReadNode( oNode, oChild, _T("w:tblLayout"),           m_oTblLayout );
				WritingElement_ReadNode( oNode, oChild, _T("w:tblLook"),             m_oTblLook );
				WritingElement_ReadNode( oNode, oChild, _T("w:tblOverlap"),          m_oTblOverlap );
				WritingElement_ReadNode( oNode, oChild, _T("w:tblpPr"),              m_oTblpPr );

				if ( !m_bTblPrChange )
					WritingElement_ReadNode( oNode, oChild, _T("w:tblPrChange"), m_oTblPrChange );

				WritingElement_ReadNode( oNode, oChild, _T("w:tblStyle"),            m_oTblStyle );
				WritingElement_ReadNode( oNode, oChild, _T("w:tblStyleColBandSize"), m_oTblStyleColBandSize );
				WritingElement_ReadNode( oNode, oChild, _T("w:tblStyleRowBandSize"), m_oTblStyleRowBandSize );
				WritingElement_ReadNode( oNode, oChild, _T("w:tblW"),                m_oTblW );
			}
			virtual void    fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				if ( oReader.IsEmptyNode() )
					return;

				int nParentDepth = oReader.GetDepth();
				while( oReader.ReadNextSiblingNode( nParentDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();

					if      ( _T("w:bidiVisual")          == sName ) m_oBidiVisual = oReader;
					else if ( _T("w:jc")                  == sName ) m_oJc = oReader;
					else if ( _T("w:shd")                 == sName ) m_oShade = oReader;
					else if ( _T("w:tblBorders")          == sName ) m_oTblBorders = oReader;
					else if ( _T("w:tblCaption")          == sName ) m_oTblCaption = oReader;
					else if ( _T("w:tblCellMar")          == sName ) m_oTblCellMar = oReader;
					else if ( _T("w:tblCellSpacing")      == sName ) m_oTblCellSpacing = oReader;
					else if ( _T("w:tblDescription")      == sName ) m_oTblDescription = oReader;
					else if ( _T("w:tblInd")              == sName ) m_oTblInd = oReader;
					else if ( _T("w:tblLayout")           == sName ) m_oTblLayout = oReader;
					else if ( _T("w:tblLook")             == sName ) m_oTblLook = oReader;
					else if ( _T("w:tblOverlap")          == sName ) m_oTblOverlap = oReader;
					else if ( _T("w:tblpPr")              == sName ) m_oTblpPr = oReader;
					else if ( !m_bTblPrChange && _T("w:tblPrChange") == sName ) m_oTblPrChange = oReader;
					else if ( _T("w:tblStyle")            == sName ) m_oTblStyle = oReader;
					else if ( _T("w:tblStyleColBandSize") == sName ) m_oTblStyleColBandSize = oReader;
					else if ( _T("w:tblStyleRowBandSize") == sName ) m_oTblStyleRowBandSize = oReader;
					else if ( _T("w:tblW")                == sName ) m_oTblW = oReader;
				}
			}
			virtual CString toXML() const                     
			{
				CString sResult = _T("<w:tblPr>");

				WritingElement_WriteNode_1( _T("<w:bidiVisual "),          m_oBidiVisual );
				WritingElement_WriteNode_1( _T("<w:jc "),                  m_oJc );
				WritingElement_WriteNode_1( _T("<w:shd "),                 m_oShade );
				WritingElement_WriteNode_2( m_oTblBorders );
				WritingElement_WriteNode_1( _T("<w:tblCaption "),          m_oTblCaption );
				WritingElement_WriteNode_2( m_oTblCellMar );
				WritingElement_WriteNode_1( _T("<w:tblCellSpacing "),      m_oTblCellSpacing );
				WritingElement_WriteNode_1( _T("<w:tblDescription "),      m_oTblDescription );
				WritingElement_WriteNode_1( _T("<w:tblInd "),              m_oTblInd );
				WritingElement_WriteNode_1( _T("<w:tblLayout "),           m_oTblLayout );
				WritingElement_WriteNode_1( _T("<w:tblLook "),             m_oTblLook );
				WritingElement_WriteNode_1( _T("<w:tblOverlap "),          m_oTblOverlap );
				WritingElement_WriteNode_1( _T("<w:tblpPr "),              m_oTblpPr );

				if ( !m_bTblPrChange )
					WritingElement_WriteNode_2( m_oTblPrChange );

				WritingElement_WriteNode_1( _T("<w:tblStyle "),            m_oTblStyle );
				WritingElement_WriteNode_1( _T("<w:tblStyleColBandSize "), m_oTblStyleColBandSize );
				WritingElement_WriteNode_1( _T("<w:tblStyleRowBandSize "), m_oTblStyleRowBandSize );
				WritingElement_WriteNode_1( _T("<w:tblW "),                m_oTblW );

				sResult += _T("</w:tblPr>");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_w_tblPr;
			}
			static const CTableProperty Merge(const CTableProperty& oPrev, const CTableProperty& oCurrent)
			{
				CTableProperty oProperties;
				oProperties.m_bTblPrChange            = oPrev.m_bTblPrChange || oCurrent.m_bTblPrChange;
				oProperties.m_oBidiVisual            = Merge( oPrev.m_oBidiVisual,            oCurrent.m_oBidiVisual );
				oProperties.m_oJc            = Merge( oPrev.m_oJc,            oCurrent.m_oJc );
				oProperties.m_oShade            = Merge( oPrev.m_oShade,            oCurrent.m_oShade );

				if ( oCurrent.m_oTblBorders.IsInit() && oPrev.m_oTblBorders.IsInit() )
					oProperties.m_oTblBorders = OOX::Logic::CTblBorders::Merge(oPrev.m_oTblBorders.get(), oCurrent.m_oTblBorders.get());
				else
					oProperties.m_oTblBorders            = Merge( oPrev.m_oTblBorders,            oCurrent.m_oTblBorders );

				oProperties.m_oTblCaption            = Merge( oPrev.m_oTblCaption,            oCurrent.m_oTblCaption );

				if ( oCurrent.m_oTblCellMar.IsInit() && oPrev.m_oTblCellMar.IsInit() )
					oProperties.m_oTblCellMar = OOX::Logic::CTblCellMar::Merge(oPrev.m_oTblCellMar.get(), oCurrent.m_oTblCellMar.get());
				else
					oProperties.m_oTblCellMar            = Merge( oPrev.m_oTblCellMar,            oCurrent.m_oTblCellMar );

				oProperties.m_oTblCellSpacing            = Merge( oPrev.m_oTblCellSpacing,            oCurrent.m_oTblCellSpacing );
				oProperties.m_oTblDescription            = Merge( oPrev.m_oTblDescription,            oCurrent.m_oTblDescription );
				oProperties.m_oTblInd            = Merge( oPrev.m_oTblInd,            oCurrent.m_oTblInd );
				oProperties.m_oTblLayout            = Merge( oPrev.m_oTblLayout,            oCurrent.m_oTblLayout );
				oProperties.m_oTblLook            = Merge( oPrev.m_oTblLook,            oCurrent.m_oTblLook );
				oProperties.m_oTblOverlap            = Merge( oPrev.m_oTblOverlap,            oCurrent.m_oTblOverlap );
				oProperties.m_oTblpPr            = Merge( oPrev.m_oTblpPr,            oCurrent.m_oTblpPr );
				oProperties.m_oTblPrChange            = Merge( oPrev.m_oTblPrChange,            oCurrent.m_oTblPrChange );
				oProperties.m_oTblStyle            = Merge( oPrev.m_oTblStyle,            oCurrent.m_oTblStyle );
				oProperties.m_oTblStyleColBandSize            = Merge( oPrev.m_oTblStyleColBandSize,            oCurrent.m_oTblStyleColBandSize );
				oProperties.m_oTblStyleRowBandSize            = Merge( oPrev.m_oTblStyleRowBandSize,            oCurrent.m_oTblStyleRowBandSize );
				oProperties.m_oTblW            = Merge( oPrev.m_oTblW,            oCurrent.m_oTblW );
				return oProperties;
			}
			template<typename Type>
			static nullable<Type>     Merge(const nullable<Type> &oPrev, const nullable<Type> &oCurrent)
			{
				nullable<Type> oResult;

				if ( oCurrent.IsInit() )
					oResult = oCurrent;
				else if ( oPrev.IsInit() )
					oResult = oPrev;

				return oResult;
			}
		public:

			bool                                                           m_bTblPrChange;

			nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue> > m_oBidiVisual;
			nullable<ComplexTypes::Word::CJcTable                        > m_oJc;
			nullable<ComplexTypes::Word::CShading                        > m_oShade;
			nullable<OOX::Logic::CTblBorders                             > m_oTblBorders;
			nullable<ComplexTypes::Word::CString_                        > m_oTblCaption;
			nullable<OOX::Logic::CTblCellMar                             > m_oTblCellMar;
			nullable<ComplexTypes::Word::CTblWidth                       > m_oTblCellSpacing;
			nullable<ComplexTypes::Word::CString_                        > m_oTblDescription;
			nullable<ComplexTypes::Word::CTblWidth                       > m_oTblInd;
			nullable<ComplexTypes::Word::CTblLayoutType                  > m_oTblLayout;
			nullable<ComplexTypes::Word::CTblLook                        > m_oTblLook;
			nullable<ComplexTypes::Word::CTblOverlap                     > m_oTblOverlap;
			nullable<ComplexTypes::Word::CTblPPr                         > m_oTblpPr;
			nullable<OOX::Logic::CTblPrChange                            > m_oTblPrChange;
			nullable<ComplexTypes::Word::CString_                        > m_oTblStyle;
			nullable<ComplexTypes::Word::CDecimalNumber                  > m_oTblStyleColBandSize;
			nullable<ComplexTypes::Word::CDecimalNumber                  > m_oTblStyleRowBandSize;
			nullable<ComplexTypes::Word::CTblWidth                       > m_oTblW;

		};
	} 
} 

namespace ComplexTypes
{
	namespace Word
	{
		
		
		
		class CHeight : public ComplexType
		{
		public:
			ComplexTypes_AdditionConstructors(CHeight)
			CHeight()
			{
			}
			virtual ~CHeight()
			{
			}

			virtual void    FromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("w:hRule"), m_oHRule );
				oNode.ReadAttributeBase( _T("w:val"),   m_oVal );
			}
			virtual void    FromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("w:hRule"), m_oHRule )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:val"),   m_oVal )
				WritingElement_ReadAttributes_End( oReader )
			}
			virtual CString ToString() const
			{
				CString sResult;

				ComplexTypes_WriteAttribute( _T("w:hRule=\""), m_oHRule );
				ComplexTypes_WriteAttribute( _T("w:val=\""),   m_oVal );

				return sResult;
			}

		public:

			nullable<SimpleTypes::CHeightRule<> > m_oHRule;
			nullable<SimpleTypes::CTwipsMeasure > m_oVal;
		};

	} 
} 

namespace OOX
{
	namespace Logic
	{
		
		
		
		class CTableRowProperties;
		class CTrPrChange : public WritingElement
		{
		public:
			CTrPrChange();
			CTrPrChange(XmlUtils::CXmlNode &oNode);
			CTrPrChange(XmlUtils::CXmlLiteReader& oReader);
			virtual ~CTrPrChange();
			const CTrPrChange& operator = (const XmlUtils::CXmlNode &oNode);
			const CTrPrChange& operator = (const XmlUtils::CXmlLiteReader& oReader);
		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode);
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader);
			virtual CString      toXML() const;
			virtual EElementType getType() const;

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader);

		public:

			
			nullable<CString                       > m_sAuthor;
			nullable<SimpleTypes::CDateTime        > m_oDate;
			nullable<SimpleTypes::CDecimalNumber<> > m_oId;

			
			nullable<CTableRowProperties>            m_pTrPr;
		};
		
		
		
		class CTableRowProperties : public WritingElement
		{
		public:
			CTableRowProperties()
			{
				m_bTrPrChange = false;
			}
			CTableRowProperties(XmlUtils::CXmlNode &oNode)
			{
				m_bTrPrChange = false;

				fromXML( (XmlUtils::CXmlNode &)oNode );
			}
			CTableRowProperties(XmlUtils::CXmlLiteReader& oReader)
			{
				m_bTrPrChange = false;

				fromXML( (XmlUtils::CXmlLiteReader&)oReader );
			}
			virtual ~CTableRowProperties()
			{
			}

			const CTableRowProperties& operator =(const XmlUtils::CXmlNode &oNode)
			{
				fromXML( (XmlUtils::CXmlNode &)oNode );
				return *this;
			}
			const CTableRowProperties& operator =(const XmlUtils::CXmlLiteReader& oReader)
			{
				fromXML( (XmlUtils::CXmlLiteReader&)oReader );
				return *this;
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				if ( _T("w:trPr") != oNode.GetName() )
					return;

				XmlUtils::CXmlNode oChild;

				WritingElement_ReadNode( oNode, oChild, _T("w:cantSplit"),      m_oCantSplit );
				WritingElement_ReadNode( oNode, oChild, _T("w:cnfStyle"),       m_oCnfStyle );
				WritingElement_ReadNode( oNode, oChild, _T("w:del"),            m_oDel );
				WritingElement_ReadNode( oNode, oChild, _T("w:divId"),          m_oDivId );
				WritingElement_ReadNode( oNode, oChild, _T("w:gridAfter"),      m_oGridAfter );
				WritingElement_ReadNode( oNode, oChild, _T("w:gridBefore"),     m_oGridBefore );
				WritingElement_ReadNode( oNode, oChild, _T("w:hidden"),         m_oHidden );
				WritingElement_ReadNode( oNode, oChild, _T("w:ins"),            m_oIns );
				WritingElement_ReadNode( oNode, oChild, _T("w:jc"),             m_oJc );
				WritingElement_ReadNode( oNode, oChild, _T("w:tblCellSpacing"), m_oTblCellSpacing );
				WritingElement_ReadNode( oNode, oChild, _T("w:tblHeader"),      m_oTblHeader );
				WritingElement_ReadNode( oNode, oChild, _T("w:trHeight"),       m_oTblHeight );

				if ( !m_bTrPrChange )
					WritingElement_ReadNode( oNode, oChild, _T("w:trPrChange"), m_oTrPrChange );

				WritingElement_ReadNode( oNode, oChild, _T("w:wAfter"),         m_oWAfter );
				WritingElement_ReadNode( oNode, oChild, _T("w:wBefore"),        m_oWBefore );
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				if ( oReader.IsEmptyNode() )
					return;

				int nParentDepth = oReader.GetDepth();
				while( oReader.ReadNextSiblingNode( nParentDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();

					if      ( _T("w:cantSplit")      == sName ) m_oCantSplit = oReader;
					else if ( _T("w:cnfStyle")       == sName ) m_oCnfStyle = oReader;
					else if ( _T("w:del")            == sName ) m_oDel = oReader;
					else if ( _T("w:divId")          == sName ) m_oDivId = oReader;
					else if ( _T("w:gridAfter")      == sName ) m_oGridAfter = oReader;
					else if ( _T("w:gridBefore")     == sName ) m_oGridBefore = oReader;
					else if ( _T("w:hidden")         == sName ) m_oHidden = oReader;
					else if ( _T("w:ins")            == sName ) m_oIns = oReader;
					else if ( _T("w:jc")             == sName ) m_oJc = oReader;
					else if ( _T("w:tblCellSpacing") == sName ) m_oTblCellSpacing = oReader;
					else if ( _T("w:tblHeader")      == sName ) m_oTblHeader = oReader;
					else if ( _T("w:trHeight")       == sName ) m_oTblHeight = oReader;
					else if ( !m_bTrPrChange && _T("w:trPrChange") == sName ) m_oTrPrChange = oReader;
					else if ( _T("w:wAfter")         == sName ) m_oWAfter = oReader;
					else if ( _T("w:wBefore")        == sName ) m_oWBefore = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<w:trPr>");

				WritingElement_WriteNode_1( _T("<w:cantSplit "),      m_oCantSplit );
				WritingElement_WriteNode_1( _T("<w:cnfStyle "),       m_oCnfStyle );
				WritingElement_WriteNode_1( _T("<w:del "),            m_oDel );
				WritingElement_WriteNode_1( _T("<w:divId "),          m_oDivId );
				WritingElement_WriteNode_1( _T("<w:gridAfter "),      m_oGridAfter );
				WritingElement_WriteNode_1( _T("<w:gridBefore "),     m_oGridBefore );
				WritingElement_WriteNode_1( _T("<w:hidden "),         m_oHidden );
				WritingElement_WriteNode_1( _T("<w:ins "),            m_oIns );
				WritingElement_WriteNode_1( _T("<w:jc "),             m_oJc );
				WritingElement_WriteNode_1( _T("<w:tblCellSpacing "), m_oTblCellSpacing );
				WritingElement_WriteNode_1( _T("<w:tblHeader "),      m_oTblHeader );
				WritingElement_WriteNode_1( _T("<w:trHeight "),       m_oTblHeight );

				if ( !m_bTrPrChange )
					WritingElement_WriteNode_2( m_oTrPrChange );

				WritingElement_WriteNode_1( _T("<w:wAfter "),         m_oWAfter );
				WritingElement_WriteNode_1( _T("<w:wBefore "),        m_oWBefore );

				sResult += _T("</w:trPr>");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_w_trPr;
			}
			static const CTableRowProperties Merge(const CTableRowProperties& oPrev, const CTableRowProperties& oCurrent)
			{
				CTableRowProperties oProperties;

				oProperties.m_bTrPrChange            = oPrev.m_bTrPrChange || oCurrent.m_bTrPrChange;
				oProperties.m_oCantSplit            = Merge( oPrev.m_oCantSplit,            oCurrent.m_oCantSplit );
				oProperties.m_oCnfStyle            = Merge( oPrev.m_oCnfStyle,            oCurrent.m_oCnfStyle );
				oProperties.m_oDel            = Merge( oPrev.m_oDel,            oCurrent.m_oDel );
				oProperties.m_oDivId            = Merge( oPrev.m_oDivId,            oCurrent.m_oDivId );
				oProperties.m_oGridAfter            = Merge( oPrev.m_oGridAfter,            oCurrent.m_oGridAfter );
				oProperties.m_oGridBefore            = Merge( oPrev.m_oGridBefore,            oCurrent.m_oGridBefore );
				oProperties.m_oHidden            = Merge( oPrev.m_oHidden,            oCurrent.m_oHidden );
				oProperties.m_oIns            = Merge( oPrev.m_oIns,            oCurrent.m_oIns );
				oProperties.m_oJc            = Merge( oPrev.m_oJc,            oCurrent.m_oJc );
				oProperties.m_oTblCellSpacing            = Merge( oPrev.m_oTblCellSpacing,            oCurrent.m_oTblCellSpacing );
				oProperties.m_oTblHeader            = Merge( oPrev.m_oTblHeader,            oCurrent.m_oTblHeader );
				oProperties.m_oTblHeight            = Merge( oPrev.m_oTblHeight,            oCurrent.m_oTblHeight );
				oProperties.m_oTrPrChange            = Merge( oPrev.m_oTrPrChange,            oCurrent.m_oTrPrChange );
				oProperties.m_oWAfter            = Merge( oPrev.m_oWAfter,            oCurrent.m_oWAfter );
				oProperties.m_oWBefore            = Merge( oPrev.m_oWBefore,            oCurrent.m_oWBefore );

				return oProperties;
			}
			template<typename Type>
			static nullable<Type>     Merge(const nullable<Type> &oPrev, const nullable<Type> &oCurrent)
			{
				nullable<Type> oResult;

				if ( oCurrent.IsInit() )
					oResult = oCurrent;
				else if ( oPrev.IsInit() )
					oResult = oPrev;

				return oResult;
			}
		public:

			bool                                                           m_bTrPrChange;

			nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue> > m_oCantSplit;
			nullable<ComplexTypes::Word::CCnf                            > m_oCnfStyle;
			nullable<ComplexTypes::Word::CTrackChange                    > m_oDel;
			nullable<ComplexTypes::Word::CDecimalNumber                  > m_oDivId;
			nullable<ComplexTypes::Word::CDecimalNumber                  > m_oGridAfter;
			nullable<ComplexTypes::Word::CDecimalNumber                  > m_oGridBefore;
			nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue> > m_oHidden;
			nullable<ComplexTypes::Word::CTrackChange                    > m_oIns;
			nullable<ComplexTypes::Word::CJcTable                        > m_oJc;
			nullable<ComplexTypes::Word::CTblWidth                       > m_oTblCellSpacing;
			nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue> > m_oTblHeader;
			nullable<ComplexTypes::Word::CHeight                         > m_oTblHeight;
			nullable<OOX::Logic::CTrPrChange                             > m_oTrPrChange;
			nullable<ComplexTypes::Word::CTblWidth                       > m_oWAfter;
			nullable<ComplexTypes::Word::CTblWidth                       > m_oWBefore;
		};

	} 
} 

namespace ComplexTypes
{
	namespace Word
	{
		
		
		
		class CCellMergeTrackChange : public ComplexType
		{
		public:
			ComplexTypes_AdditionConstructors(CCellMergeTrackChange)
			CCellMergeTrackChange()
			{
			}
			virtual ~CCellMergeTrackChange()
			{
			}

			virtual void    FromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("w:author"),     m_sAuthor );
				oNode.ReadAttributeBase( _T("w:date"),       m_oDate );
				oNode.ReadAttributeBase( _T("w:id"),         m_oId );
				oNode.ReadAttributeBase( _T("w:vMerge"),     m_oVMerge );
				oNode.ReadAttributeBase( _T("w:vMergeOrig"), m_oVMergeOrig );
			}
			virtual void    FromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("w:author"),     m_sAuthor )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:date"),       m_oDate )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:id"),         m_oId )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:vMerge"),     m_oVMerge )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:vMergeOrig"), m_oVMergeOrig )
				WritingElement_ReadAttributes_End( oReader )
			}
			virtual CString ToString() const
			{
				CString sResult;

				if ( m_sAuthor.IsInit() )
				{
					sResult += _T("w:author=\"");
					sResult += m_sAuthor->GetString();
					sResult += _T("\" ");
				}

				ComplexTypes_WriteAttribute( _T("w:date=\""),       m_oDate );
				ComplexTypes_WriteAttribute( _T("w:id=\""),         m_oId );
				ComplexTypes_WriteAttribute( _T("w:vMerge=\""),     m_oVMerge );
				ComplexTypes_WriteAttribute( _T("w:vMergeOrig=\""), m_oVMergeOrig );

				return sResult;
			}

		public:

			nullable<CString                          > m_sAuthor;
			nullable<SimpleTypes::CDateTime           > m_oDate;
			nullable<SimpleTypes::CDecimalNumber<>    > m_oId;
			nullable<SimpleTypes::CAnnotationVMerge<> > m_oVMerge;
			nullable<SimpleTypes::CAnnotationVMerge<> > m_oVMergeOrig;

		};
		
		
		
		class CHMerge : public ComplexType
		{
		public:
			ComplexTypes_AdditionConstructors(CHMerge)
			CHMerge()
			{
			}
			virtual ~CHMerge()
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

			nullable<SimpleTypes::CMerge<> > m_oVal;

		};

		
		
		
		class CVMerge : public ComplexType
		{
		public:
			ComplexTypes_AdditionConstructors(CVMerge)
			CVMerge()
			{
			}
			virtual ~CVMerge()
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

			nullable<SimpleTypes::CMerge<> > m_oVal;

		};

	} 
} 

namespace OOX
{
	namespace Logic
	{
		
		
		
		class CHeaders : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CHeaders)
			CHeaders()
			{
			}
			virtual ~CHeaders()
			{
			}

		public:
			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				if ( _T("w:headers") != oNode.GetName() )
					return;

				XmlUtils::CXmlNodes oHeaders;

				if ( oNode.GetNodes( _T("w:header"), oHeaders ) )
				{
					XmlUtils::CXmlNode oHeader;
					for ( int nIndex = 0; nIndex < oHeaders.GetCount(); nIndex++ )
					{
						if ( oHeaders.GetAt( nIndex, oHeader ) )
						{
							ComplexTypes::Word::CString_ oHead = oHeader;
							m_arrHeaders.Add( oHead );
						}
					}
				}
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader) 
			{
				if ( oReader.IsEmptyNode() )
					return;

				int nParentDepth = oReader.GetDepth();
				while( oReader.ReadNextSiblingNode( nParentDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();

					if ( _T("w:header") == sName )
					{
						ComplexTypes::Word::CString_ oHead = oReader;
						m_arrHeaders.Add( oHead );
					}
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<w:headers>");

				for ( int nIndex = 0; nIndex < m_arrHeaders.GetSize(); nIndex++ )
				{		
					sResult += _T("<w:header ");
					sResult += m_arrHeaders[nIndex].ToString();
					sResult += _T("/>");
				}

				sResult += _T("</w:headers>");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_w_headers;
			}
		public:

			CSimpleArray<ComplexTypes::Word::CString_ > m_arrHeaders;
		};

		
		
		
		class CTcBorders : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CTcBorders)
			CTcBorders()
			{
			}
			virtual ~CTcBorders()
			{
			}

		public:
			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				if ( _T("w:tcBorders") != oNode.GetName() )
					return;

				XmlUtils::CXmlNode oChild;

				WritingElement_ReadNode( oNode, oChild, _T("w:bottom"),  m_oBottom );
				WritingElement_ReadNode( oNode, oChild, _T("w:end"),     m_oEnd );
				WritingElement_ReadNode( oNode, oChild, _T("w:insideH"), m_oInsideH );
				WritingElement_ReadNode( oNode, oChild, _T("w:insideV"), m_oInsideV );
				WritingElement_ReadNode( oNode, oChild, _T("w:start"),   m_oStart );
				WritingElement_ReadNode( oNode, oChild, _T("w:tl2br"),   m_oTL2BR );
				WritingElement_ReadNode( oNode, oChild, _T("w:top"),     m_oTop );
				WritingElement_ReadNode( oNode, oChild, _T("w:tr2bl"),   m_oTR2BL );

				if ( !m_oEnd.IsInit() )
					WritingElement_ReadNode( oNode, oChild, _T("w:right"), m_oEnd );

				if ( !m_oStart.IsInit() )
					WritingElement_ReadNode( oNode, oChild, _T("w:left"),  m_oStart );
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader) 
			{
				if ( oReader.IsEmptyNode() )
					return;

				int nParentDepth = oReader.GetDepth();
				while( oReader.ReadNextSiblingNode( nParentDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();

					if      ( _T("w:bottom")  == sName ) m_oBottom = oReader;
					else if ( _T("w:end")     == sName ) m_oEnd = oReader;
					else if ( _T("w:insideH") == sName ) m_oInsideH = oReader;
					else if ( _T("w:insideV") == sName ) m_oInsideV = oReader;
					else if ( _T("w:start")   == sName ) m_oStart = oReader;
					else if ( _T("w:tl2br")   == sName ) m_oTL2BR = oReader;
					else if ( _T("w:top")     == sName ) m_oTop = oReader;
					else if ( _T("w:tr2bl")   == sName ) m_oTR2BL = oReader;
					else if ( !m_oEnd.IsInit()   && _T("w:right") == sName ) m_oEnd = oReader;
					else if ( !m_oStart.IsInit() && _T("w:left")  == sName ) m_oStart = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<w:tcBorders>");

				WritingElement_WriteNode_1( _T("<w:bottom "),  m_oBottom );
				WritingElement_WriteNode_1( _T("<w:end "),     m_oEnd );
				WritingElement_WriteNode_1( _T("<w:insideH "), m_oInsideH );
				WritingElement_WriteNode_1( _T("<w:insideV "), m_oInsideV );
				WritingElement_WriteNode_1( _T("<w:start "),   m_oStart );
				WritingElement_WriteNode_1( _T("<w:tl2br "),   m_oTL2BR );
				WritingElement_WriteNode_1( _T("<w:top "),     m_oTop );
				WritingElement_WriteNode_1( _T("<w:tr2bl "),   m_oTR2BL );

				sResult += _T("</w:tcBorders>");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_w_tcBorders;
			}
			static const CTcBorders Merge(const CTcBorders& oPrev, const CTcBorders& oCurrent)
			{
				CTcBorders oProperties;
				oProperties.m_oBottom            = Merge( oPrev.m_oBottom,            oCurrent.m_oBottom );
				oProperties.m_oEnd            = Merge( oPrev.m_oEnd,            oCurrent.m_oEnd );
				oProperties.m_oInsideH            = Merge( oPrev.m_oInsideH,            oCurrent.m_oInsideH );
				oProperties.m_oInsideV            = Merge( oPrev.m_oInsideV,            oCurrent.m_oInsideV );
				oProperties.m_oStart            = Merge( oPrev.m_oStart,            oCurrent.m_oStart );
				oProperties.m_oTL2BR            = Merge( oPrev.m_oTL2BR,            oCurrent.m_oTL2BR );
				oProperties.m_oTop            = Merge( oPrev.m_oTop,            oCurrent.m_oTop );
				oProperties.m_oTR2BL            = Merge( oPrev.m_oTR2BL,            oCurrent.m_oTR2BL );

				return oProperties;
			}
			template<typename Type>
			static nullable<Type>     Merge(const nullable<Type> &oPrev, const nullable<Type> &oCurrent)
			{
				nullable<Type> oResult;

				if ( oCurrent.IsInit() )
					oResult = oCurrent;
				else if ( oPrev.IsInit() )
					oResult = oPrev;

				return oResult;
			}
		public:

			nullable<ComplexTypes::Word::CBorder > m_oBottom;
			nullable<ComplexTypes::Word::CBorder > m_oEnd;
			nullable<ComplexTypes::Word::CBorder > m_oInsideH;
			nullable<ComplexTypes::Word::CBorder > m_oInsideV;
			nullable<ComplexTypes::Word::CBorder > m_oStart;
			nullable<ComplexTypes::Word::CBorder > m_oTL2BR;
			nullable<ComplexTypes::Word::CBorder > m_oTop;
			nullable<ComplexTypes::Word::CBorder > m_oTR2BL;
		};

		
		
		
		class CTcMar : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CTcMar)
			CTcMar()
			{
			}
			virtual ~CTcMar()
			{
			}

		public:
			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				if ( _T("w:tcMar") != oNode.GetName() )
					return;

				XmlUtils::CXmlNode oChild;

				WritingElement_ReadNode( oNode, oChild, _T("w:bottom"),  m_oBottom );
				WritingElement_ReadNode( oNode, oChild, _T("w:end"),     m_oEnd );
				WritingElement_ReadNode( oNode, oChild, _T("w:start"),   m_oStart );
				WritingElement_ReadNode( oNode, oChild, _T("w:top"),     m_oTop );

				if ( !m_oEnd.IsInit() )
					WritingElement_ReadNode( oNode, oChild, _T("w:right"), m_oEnd );

				if ( !m_oStart.IsInit() )
					WritingElement_ReadNode( oNode, oChild, _T("w:left"),  m_oStart );
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader) 
			{
				if ( oReader.IsEmptyNode() )
					return;

				int nParentDepth = oReader.GetDepth();
				while( oReader.ReadNextSiblingNode( nParentDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();

					if      ( _T("w:bottom")  == sName ) m_oBottom = oReader;
					else if ( _T("w:end")     == sName ) m_oEnd = oReader;
					else if ( _T("w:start")   == sName ) m_oStart = oReader;
					else if ( _T("w:top")     == sName ) m_oTop = oReader;
					else if ( !m_oEnd.IsInit()   && _T("w:right") == sName ) m_oEnd = oReader;
					else if ( !m_oStart.IsInit() && _T("w:left")  == sName ) m_oStart = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<w:tcMar>");

				WritingElement_WriteNode_1( _T("<w:bottom "), m_oBottom );
				WritingElement_WriteNode_1( _T("<w:end "),    m_oEnd );
				WritingElement_WriteNode_1( _T("<w:start "),  m_oStart );
				WritingElement_WriteNode_1( _T("<w:top "),    m_oTop );

				sResult += _T("</w:tcMar>");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_w_tcMar;
			}
			static const CTcMar Merge(const CTcMar& oPrev, const CTcMar& oCurrent)
			{
				CTcMar oProperties;
				oProperties.m_oBottom            = Merge( oPrev.m_oBottom,            oCurrent.m_oBottom );
				oProperties.m_oEnd            = Merge( oPrev.m_oEnd,            oCurrent.m_oEnd );
				oProperties.m_oStart            = Merge( oPrev.m_oStart,            oCurrent.m_oStart );
				oProperties.m_oTop            = Merge( oPrev.m_oTop,            oCurrent.m_oTop );

				return oProperties;
			}
			template<typename Type>
			static nullable<Type>     Merge(const nullable<Type> &oPrev, const nullable<Type> &oCurrent)
			{
				nullable<Type> oResult;

				if ( oCurrent.IsInit() )
					oResult = oCurrent;
				else if ( oPrev.IsInit() )
					oResult = oPrev;

				return oResult;
			}
		public:

			nullable<ComplexTypes::Word::CTblWidth > m_oBottom;
			nullable<ComplexTypes::Word::CTblWidth > m_oEnd;
			nullable<ComplexTypes::Word::CTblWidth > m_oStart;
			nullable<ComplexTypes::Word::CTblWidth > m_oTop;
		};

		
		
		
		class CTableCellProperties;
		class CTcPrChange : public WritingElement
		{
		public:
			CTcPrChange();
			CTcPrChange(XmlUtils::CXmlNode &oNode);
			CTcPrChange(XmlUtils::CXmlLiteReader& oReader);
			virtual ~CTcPrChange();
			const CTcPrChange& operator = (const XmlUtils::CXmlNode &oNode);
			const CTcPrChange& operator = (const XmlUtils::CXmlLiteReader& oReader);
		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode);
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader);
			virtual CString      toXML() const;
			virtual EElementType getType() const;

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader);

		public:

			
			nullable<CString                       > m_sAuthor;
			nullable<SimpleTypes::CDateTime        > m_oDate;
			nullable<SimpleTypes::CDecimalNumber<> > m_oId;

			
			nullable<CTableCellProperties>			 m_pTcPr;
		};
		
		
		
		class CTableCellProperties : public WritingElement
		{
		public: 
			CTableCellProperties()
			{
				m_bTcPrChange = false;
			}
			CTableCellProperties(XmlUtils::CXmlNode &oNode)
			{
				m_bTcPrChange = false;

				fromXML( oNode );
			}
			CTableCellProperties(XmlUtils::CXmlLiteReader& oReader)
			{
				m_bTcPrChange = false;

				fromXML( oReader );
			}
			virtual ~CTableCellProperties()
			{
			}

			const CTableCellProperties& operator =(const XmlUtils::CXmlNode &oNode)
			{
				fromXML( (XmlUtils::CXmlNode &)oNode );
				return *this;
			}
			const CTableCellProperties& operator =(const XmlUtils::CXmlLiteReader& oReader)
			{
				fromXML( (XmlUtils::CXmlLiteReader&)oReader );
				return *this;
			}
		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				if ( _T("w:tcPr") != oNode.GetName() )
					return;

				XmlUtils::CXmlNode oChild;

				WritingElement_ReadNode( oNode, oChild, _T("w:cellDel"),        m_oCellDel );
				WritingElement_ReadNode( oNode, oChild, _T("w:cellIns"),        m_oCellIns );
				WritingElement_ReadNode( oNode, oChild, _T("w:cellMerge"),      m_oCellMerge );
				WritingElement_ReadNode( oNode, oChild, _T("w:cnfStyle"),       m_oCnfStyle );
				WritingElement_ReadNode( oNode, oChild, _T("w:gridSpan"),       m_oGridSpan );
				WritingElement_ReadNode( oNode, oChild, _T("w:headers"),        m_oHeaders );
				WritingElement_ReadNode( oNode, oChild, _T("w:hideMark"),       m_oHideMark );

				
				WritingElement_ReadNode( oNode, oChild, _T("w:hmerge"),         m_oHMerge );
				if ( !m_oHMerge.IsInit() )
					WritingElement_ReadNode( oNode, oChild, _T("w:hMerge"),     m_oHMerge );

				WritingElement_ReadNode( oNode, oChild, _T("w:noWrap"),         m_oNoWrap );
				WritingElement_ReadNode( oNode, oChild, _T("w:shd"),            m_oShd );
				WritingElement_ReadNode( oNode, oChild, _T("w:tcBorders"),      m_oTcBorders );
				WritingElement_ReadNode( oNode, oChild, _T("w:tcFitText"),      m_oTcFitText );
				WritingElement_ReadNode( oNode, oChild, _T("w:tcMar"),          m_oTcMar );

				if ( !m_bTcPrChange )
					WritingElement_ReadNode( oNode, oChild, _T("w:tcPrChange"), m_oTcPrChange );

				WritingElement_ReadNode( oNode, oChild, _T("w:tcW"),            m_oTcW );
				WritingElement_ReadNode( oNode, oChild, _T("w:textDirection"),  m_oTextDirection );
				WritingElement_ReadNode( oNode, oChild, _T("w:vAlign"),         m_oVAlign );

				
				WritingElement_ReadNode( oNode, oChild, _T("w:vmerge"),         m_oVMerge );
				if ( !m_oVMerge.IsInit() )
					WritingElement_ReadNode( oNode, oChild, _T("w:vMerge"),     m_oVMerge );
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				if ( oReader.IsEmptyNode() )
					return;

				int nParentDepth = oReader.GetDepth();
				while( oReader.ReadNextSiblingNode( nParentDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();

					if      ( _T("w:cellDel")        == sName ) m_oCellDel = oReader;
					else if ( _T("w:cellIns")        == sName ) m_oCellIns = oReader;
					else if ( _T("w:cellMerge")      == sName ) m_oCellMerge = oReader;
					else if ( _T("w:cnfStyle")       == sName ) m_oCnfStyle = oReader;
					else if ( _T("w:gridSpan")       == sName ) m_oGridSpan = oReader;
					else if ( _T("w:headers")        == sName ) m_oHeaders = oReader;
					else if ( _T("w:hideMark")       == sName ) m_oHideMark = oReader;
					
					else if ( _T("w:hmerge")         == sName ) m_oHMerge = oReader;
					else if ( _T("w:hMerge")         == sName ) m_oHMerge = oReader;
					else if ( _T("w:noWrap")         == sName ) m_oNoWrap = oReader;
					else if ( _T("w:shd")            == sName ) m_oShd = oReader;
					else if ( _T("w:tcBorders")      == sName ) m_oTcBorders = oReader;
					else if ( _T("w:tcFitText")      == sName ) m_oTcFitText = oReader;
					else if ( _T("w:tcMar")          == sName ) m_oTcMar = oReader;
					else if ( !m_bTcPrChange && _T("w:tcPrChange") == sName ) m_oTcPrChange = oReader;
					else if ( _T("w:tcW")            == sName ) m_oTcW = oReader;
					else if ( _T("w:textDirection")  == sName ) m_oTextDirection = oReader;
					else if ( _T("w:vAlign")         == sName ) m_oVAlign = oReader;
					
					else if ( _T("w:vmerge")         == sName ) m_oVMerge = oReader;
					else if ( _T("w:vMerge")         == sName ) m_oVMerge = oReader;
				}
			}
			virtual CString      toXML() const             
			{
				CString sResult = _T("<w:tcPr>");

				WritingElement_WriteNode_1( _T("<w:cellDel "),        m_oCellDel );
				WritingElement_WriteNode_1( _T("<w:cellIns "),        m_oCellIns );
				WritingElement_WriteNode_1( _T("<w:cellMerge "),      m_oCellMerge );
				WritingElement_WriteNode_1( _T("<w:cnfStyle "),       m_oCnfStyle );
				WritingElement_WriteNode_1( _T("<w:gridSpan "),       m_oGridSpan );
				WritingElement_WriteNode_2( m_oHeaders );
				WritingElement_WriteNode_1( _T("<w:hideMark "),       m_oHideMark );
				WritingElement_WriteNode_1( _T("<w:hmerge "),         m_oHMerge );
				WritingElement_WriteNode_1( _T("<w:noWrap "),         m_oNoWrap );
				WritingElement_WriteNode_1( _T("<w:shd "),            m_oShd );
				WritingElement_WriteNode_2( m_oTcBorders );
				WritingElement_WriteNode_1( _T("<w:tcFitText "),      m_oTcFitText );
				WritingElement_WriteNode_2( m_oTcMar );

				if ( !m_bTcPrChange )
					WritingElement_WriteNode_2( m_oTcPrChange );

				WritingElement_WriteNode_1( _T("<w:tcW "),            m_oTcW );
				WritingElement_WriteNode_1( _T("<w:textDirection "),  m_oTextDirection );
				WritingElement_WriteNode_1( _T("<w:vAlign "),         m_oVAlign );
				WritingElement_WriteNode_1( _T("<w:vmerge "),         m_oVMerge );

				sResult += _T("</w:tcPr>");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_w_tcPr;
			}
			static const CTableCellProperties Merge(const CTableCellProperties& oPrev, const CTableCellProperties& oCurrent)
			{
				CTableCellProperties oProperties;
				oProperties.m_bTcPrChange            = oPrev.m_bTcPrChange || oCurrent.m_bTcPrChange;
				oProperties.m_oCellDel            = Merge( oPrev.m_oCellDel,            oCurrent.m_oCellDel );
				oProperties.m_oCellIns            = Merge( oPrev.m_oCellIns,            oCurrent.m_oCellIns );
				oProperties.m_oCellMerge            = Merge( oPrev.m_oCellMerge,            oCurrent.m_oCellMerge );
				oProperties.m_oCnfStyle            = Merge( oPrev.m_oCnfStyle,            oCurrent.m_oCnfStyle );
				oProperties.m_oGridSpan            = Merge( oPrev.m_oGridSpan,            oCurrent.m_oGridSpan );
				oProperties.m_oHeaders            = Merge( oPrev.m_oHeaders,            oCurrent.m_oHeaders );
				oProperties.m_oHideMark            = Merge( oPrev.m_oHideMark,            oCurrent.m_oHideMark );
				oProperties.m_oHMerge            = Merge( oPrev.m_oHMerge,            oCurrent.m_oHMerge );
				oProperties.m_oNoWrap            = Merge( oPrev.m_oNoWrap,            oCurrent.m_oNoWrap );
				oProperties.m_oShd            = Merge( oPrev.m_oShd,            oCurrent.m_oShd );

				if ( oCurrent.m_oTcBorders.IsInit() && oPrev.m_oTcBorders.IsInit() )
					oProperties.m_oTcBorders = OOX::Logic::CTcBorders::Merge(oPrev.m_oTcBorders.get(), oCurrent.m_oTcBorders.get());
				else
					oProperties.m_oTcBorders            = Merge( oPrev.m_oTcBorders,            oCurrent.m_oTcBorders );

				oProperties.m_oTcFitText            = Merge( oPrev.m_oTcFitText,            oCurrent.m_oTcFitText );

				if ( oCurrent.m_oTcMar.IsInit() && oPrev.m_oTcMar.IsInit() )
					oProperties.m_oTcMar = OOX::Logic::CTcMar::Merge(oPrev.m_oTcMar.get(), oCurrent.m_oTcMar.get());
				else
					oProperties.m_oTcMar            = Merge( oPrev.m_oTcMar,            oCurrent.m_oTcMar );

				oProperties.m_oTcPrChange            = Merge( oPrev.m_oTcPrChange,            oCurrent.m_oTcPrChange );
				oProperties.m_oTcW            = Merge( oPrev.m_oTcW,            oCurrent.m_oTcW );
				oProperties.m_oTextDirection            = Merge( oPrev.m_oTextDirection,            oCurrent.m_oTextDirection );
				oProperties.m_oVAlign            = Merge( oPrev.m_oVAlign,            oCurrent.m_oVAlign );
				oProperties.m_oVMerge            = Merge( oPrev.m_oVMerge,            oCurrent.m_oVMerge );

				return oProperties;
			}
			template<typename Type>
			static nullable<Type>     Merge(const nullable<Type> &oPrev, const nullable<Type> &oCurrent)
			{
				nullable<Type> oResult;

				if ( oCurrent.IsInit() )
					oResult = oCurrent;
				else if ( oPrev.IsInit() )
					oResult = oPrev;

				return oResult;
			}
		public:

			bool m_bTcPrChange;

			nullable<ComplexTypes::Word::CTrackChange                    > m_oCellDel;
			nullable<ComplexTypes::Word::CTrackChange                    > m_oCellIns;
			nullable<ComplexTypes::Word::CCellMergeTrackChange           > m_oCellMerge;
			nullable<ComplexTypes::Word::CCnf                            > m_oCnfStyle;
			nullable<ComplexTypes::Word::CDecimalNumber                  > m_oGridSpan;
			nullable<OOX::Logic::CHeaders                                > m_oHeaders;
			nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue> > m_oHideMark;
			nullable<ComplexTypes::Word::CHMerge                         > m_oHMerge;
			nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue> > m_oNoWrap;
			nullable<ComplexTypes::Word::CShading                        > m_oShd;
			nullable<OOX::Logic::CTcBorders                              > m_oTcBorders;
			nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue> > m_oTcFitText;
			nullable<OOX::Logic::CTcMar                                  > m_oTcMar;
			nullable<OOX::Logic::CTcPrChange                             > m_oTcPrChange;
			nullable<ComplexTypes::Word::CTblWidth                       > m_oTcW;
			nullable<ComplexTypes::Word::CTextDirection                  > m_oTextDirection;
			nullable<ComplexTypes::Word::CVerticalJc                     > m_oVAlign;
			nullable<ComplexTypes::Word::CVMerge                         > m_oVMerge;

		};
	} 
} 

#endif // OOX_LOGIC_TABLE_PROPERTY_INCLUDE_H_