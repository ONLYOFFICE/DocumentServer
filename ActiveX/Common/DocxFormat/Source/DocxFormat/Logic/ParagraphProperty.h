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
#ifndef OOX_LOGIC_PARAGRAPH_PROPERTY_INCLUDE_H_
#define OOX_LOGIC_PARAGRAPH_PROPERTY_INCLUDE_H_

#include "../../Common/SimpleTypes_Shared.h"
#include "../../Common/SimpleTypes_Word.h"

#include "./../WritingElement.h"

#include "RunProperty.h"
#include "SectionProperty.h"

namespace ComplexTypes
{
	namespace Word
	{
		
		
		
		class CFramePr : public ComplexType
		{
		public:
			ComplexTypes_AdditionConstructors(CFramePr)
			CFramePr()
			{
			}
			virtual ~CFramePr()
			{
			}

			virtual void    FromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("w:anchorLock"), m_oAnchorLock );
				oNode.ReadAttributeBase( _T("w:dropCap"),    m_oDropCap );
				oNode.ReadAttributeBase( _T("w:h"),          m_oH );
				oNode.ReadAttributeBase( _T("w:hAnchor"),    m_oHAnchor );
				oNode.ReadAttributeBase( _T("w:hRule"),      m_oHRule );
				oNode.ReadAttributeBase( _T("w:hSpace"),     m_oHSpace );
				oNode.ReadAttributeBase( _T("w:lines"),      m_oLines );
				oNode.ReadAttributeBase( _T("w:vAnchor"),    m_oVAnchor );
				oNode.ReadAttributeBase( _T("w:vSpace"),     m_oVSpace );
				oNode.ReadAttributeBase( _T("w:w"),          m_oW );
				oNode.ReadAttributeBase( _T("w:wrap"),       m_oWrap );
				oNode.ReadAttributeBase( _T("w:x"),          m_oX );
				oNode.ReadAttributeBase( _T("w:xAlign"),     m_oXAlign );
				oNode.ReadAttributeBase( _T("w:y"),          m_oY );
				oNode.ReadAttributeBase( _T("w:yAlign"),     m_oYAlign );
			}
			virtual void    FromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("w:anchorLock"), m_oAnchorLock )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:dropCap"),    m_oDropCap )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:h"),          m_oH )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:hAnchor"),    m_oHAnchor )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:hRule"),      m_oHRule )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:hSpace"),     m_oHSpace )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:lines"),      m_oLines )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:vAnchor"),    m_oVAnchor )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:vSpace"),     m_oVSpace )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:w"),          m_oW )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:wrap"),       m_oWrap )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:x"),          m_oX )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:xAlign"),     m_oXAlign )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:y"),          m_oY )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:yAlign"),     m_oYAlign )
				WritingElement_ReadAttributes_End( oReader )
			}
			virtual CString ToString() const
			{
				CString sResult;

				if ( m_oAnchorLock.IsInit() )
				{
					sResult += "w:anchorLock=\"";
					sResult += m_oAnchorLock->ToString();
					sResult += "\" ";
				}

				if ( m_oDropCap.IsInit() )
				{
					sResult += "w:dropCap=\"";
					sResult += m_oDropCap->ToString();
					sResult += "\" ";
				}

				if ( m_oH.IsInit() )
				{
					sResult += "w:h=\"";
					sResult += m_oH->ToString();
					sResult += "\" ";
				}

				if ( m_oHAnchor.IsInit() )
				{
					sResult += "w:hAnchor=\"";
					sResult += m_oHAnchor->ToString();
					sResult += "\" ";
				}

				if ( m_oHRule.IsInit() )
				{
					sResult += "w:hRule=\"";
					sResult += m_oHRule->ToString();
					sResult += "\" ";
				}

				if ( m_oHSpace.IsInit() )
				{
					sResult += "w:hSpace=\"";
					sResult += m_oHSpace->ToString();
					sResult += "\" ";
				}

				if ( m_oLines.IsInit() )
				{
					sResult += "w:lines=\"";
					sResult += m_oLines->ToString();
					sResult += "\" ";
				}

				if ( m_oVAnchor.IsInit() )
				{
					sResult += "w:vAnchor=\"";
					sResult += m_oVAnchor->ToString();
					sResult += "\" ";
				}

				if ( m_oVSpace.IsInit() )
				{
					sResult += "w:vSpace=\"";
					sResult += m_oVSpace->ToString();
					sResult += "\" ";
				}

				if ( m_oW.IsInit() )
				{
					sResult += "w:w=\"";
					sResult += m_oW->ToString();
					sResult += "\" ";
				}

				if ( m_oWrap.IsInit() )
				{
					sResult += "w:wrap=\"";
					sResult += m_oWrap->ToString();
					sResult += "\" ";
				}

				if ( m_oX.IsInit() )
				{
					sResult += "w:x=\"";
					sResult += m_oX->ToString();
					sResult += "\" ";
				}

				if ( m_oXAlign.IsInit() )
				{
					sResult += "w:xAlign=\"";
					sResult += m_oXAlign->ToString();
					sResult += "\" ";
				}

				if ( m_oY.IsInit() )
				{
					sResult += "w:y=\"";
					sResult += m_oY->ToString();
					sResult += "\" ";
				}

				if ( m_oYAlign.IsInit() )
				{
					sResult += "w:yAlign=\"";
					sResult += m_oYAlign->ToString();
					sResult += "\" ";
				}

				return sResult;
			}

		public:

			nullable<SimpleTypes::COnOff<>            > m_oAnchorLock;
			nullable<SimpleTypes::CDropCap<>          > m_oDropCap;
			nullable<SimpleTypes::CTwipsMeasure       > m_oH;
			nullable<SimpleTypes::CHAnchor<>          > m_oHAnchor;
			nullable<SimpleTypes::CHeightRule<>       > m_oHRule;
			nullable<SimpleTypes::CTwipsMeasure       > m_oHSpace;
			nullable<SimpleTypes::CDecimalNumber<>    > m_oLines;
			nullable<SimpleTypes::CVAnchor<>          > m_oVAnchor;
			nullable<SimpleTypes::CTwipsMeasure       > m_oVSpace;
			nullable<SimpleTypes::CTwipsMeasure       > m_oW;
			nullable<SimpleTypes::CWrap<>             > m_oWrap;
			nullable<SimpleTypes::CSignedTwipsMeasure > m_oX;
			nullable<SimpleTypes::CXAlign<>           > m_oXAlign;
			nullable<SimpleTypes::CSignedTwipsMeasure > m_oY;
			nullable<SimpleTypes::CYAlign<>           > m_oYAlign;
		};
		
		
		
		class CInd : public ComplexType
		{
		public:
			ComplexTypes_AdditionConstructors(CInd)
			CInd()
			{
			}
			virtual ~CInd()
			{
			}

			virtual void    FromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("w:end"),            m_oEnd );
				oNode.ReadAttributeBase( _T("w:endChars"),       m_oEndChars );
				oNode.ReadAttributeBase( _T("w:firstLine"),      m_oFirstLine );
				oNode.ReadAttributeBase( _T("w:firstLineChars"), m_oFirstLineChars );
				oNode.ReadAttributeBase( _T("w:hanging"),        m_oHanging );
				oNode.ReadAttributeBase( _T("w:hangingChars"),   m_oHangingChars );
				oNode.ReadAttributeBase( _T("w:start"),          m_oStart );
				oNode.ReadAttributeBase( _T("w:startChars"),     m_oStartChars );

				
				if ( !m_oStart.IsInit() )
					oNode.ReadAttributeBase( _T("w:left"), m_oStart );
				if ( !m_oStartChars.IsInit() )
					oNode.ReadAttributeBase( _T("w:leftChars"), m_oStartChars );
				if ( !m_oEnd.IsInit() )
					oNode.ReadAttributeBase( _T("w:right"), m_oEnd );
				if ( !m_oEndChars.IsInit() )
					oNode.ReadAttributeBase( _T("w:rightChars"), m_oEndChars );
			}
			virtual void    FromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("w:end"),            m_oEnd )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:endChars"),       m_oEndChars )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:firstLine"),      m_oFirstLine )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:firstLineChars"), m_oFirstLineChars )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:hanging"),        m_oHanging )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:hangingChars"),   m_oHangingChars )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:start"),          m_oStart )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:startChars"),     m_oStartChars )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:left"),           m_oStart )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:leftChars"),      m_oStartChars )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:right"),          m_oEnd )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:rightChars"),     m_oEndChars )
				WritingElement_ReadAttributes_End( oReader )
			}
			virtual CString ToString() const
			{
				CString sResult;

				if ( m_oEnd.IsInit() )
				{
					sResult += "w:end=\"";
					sResult += m_oEnd->ToString();
					sResult += "\" ";
				}

				if ( m_oEndChars.IsInit() )
				{
					sResult += "w:endChars=\"";
					sResult += m_oEndChars->ToString();
					sResult += "\" ";
				}

				if ( m_oFirstLine.IsInit() )
				{
					sResult += "w:firstLine=\"";
					sResult += m_oFirstLine->ToString();
					sResult += "\" ";
				}

				if ( m_oFirstLineChars.IsInit() )
				{
					sResult += "w:firstLineChars=\"";
					sResult += m_oFirstLineChars->ToString();
					sResult += "\" ";
				}

				if ( m_oHanging.IsInit() )
				{
					sResult += "w:hanging=\"";
					sResult += m_oHanging->ToString();
					sResult += "\" ";
				}

				if ( m_oHangingChars.IsInit() )
				{
					sResult += "w:hangingChars=\"";
					sResult += m_oHangingChars->ToString();
					sResult += "\" ";
				}

				if ( m_oStart.IsInit() )
				{
					sResult += "w:start=\"";
					sResult += m_oStart->ToString();
					sResult += "\" ";
				}

				if ( m_oStartChars.IsInit() )
				{
					sResult += "w:startChars=\"";
					sResult += m_oStartChars->ToString();
					sResult += "\" ";
				}

				return sResult;
			}

			static const CInd Merge(const CInd& oPrev, const CInd& oCurrent)
			{
				CInd oProperties;
				oProperties.m_oEnd            = Merge( oPrev.m_oEnd,            oCurrent.m_oEnd );
				oProperties.m_oEndChars            = Merge( oPrev.m_oEndChars,            oCurrent.m_oEndChars );
				oProperties.m_oFirstLine            = Merge( oPrev.m_oFirstLine,            oCurrent.m_oFirstLine );
				oProperties.m_oFirstLineChars            = Merge( oPrev.m_oFirstLineChars,            oCurrent.m_oFirstLineChars );
				oProperties.m_oHanging            = Merge( oPrev.m_oHanging,            oCurrent.m_oHanging );
				oProperties.m_oHangingChars            = Merge( oPrev.m_oHangingChars,            oCurrent.m_oHangingChars );
				oProperties.m_oStart            = Merge( oPrev.m_oStart,            oCurrent.m_oStart );
				oProperties.m_oStartChars            = Merge( oPrev.m_oStartChars,            oCurrent.m_oStartChars );
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

			nullable<SimpleTypes::CSignedTwipsMeasure > m_oEnd;
			nullable<SimpleTypes::CDecimalNumber<>    > m_oEndChars;
			nullable<SimpleTypes::CTwipsMeasure       > m_oFirstLine;
			nullable<SimpleTypes::CDecimalNumber<>    > m_oFirstLineChars;
			nullable<SimpleTypes::CTwipsMeasure       > m_oHanging;
			nullable<SimpleTypes::CDecimalNumber<>    > m_oHangingChars;
			nullable<SimpleTypes::CSignedTwipsMeasure > m_oStart;
			nullable<SimpleTypes::CDecimalNumber<>    > m_oStartChars;
		};

		
		
		
		class CSpacing : public ComplexType
		{
		public:
			ComplexTypes_AdditionConstructors(CSpacing)
			CSpacing()
			{
			}
			virtual ~CSpacing()
			{
			}

			virtual void    FromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("w:after"),             m_oAfter );
				oNode.ReadAttributeBase( _T("w:afterAutospacing"),  m_oAfterAutospacing );
				oNode.ReadAttributeBase( _T("w:afterLines"),        m_oAfterLines );
				oNode.ReadAttributeBase( _T("w:before"),            m_oBefore );
				oNode.ReadAttributeBase( _T("w:beforeAutospacing"), m_oBeforeAutospacing );
				oNode.ReadAttributeBase( _T("w:beforeLines"),       m_oBeforeLines );
				oNode.ReadAttributeBase( _T("w:line"),              m_oLine );
				oNode.ReadAttributeBase( _T("w:lineRule"),          m_oLineRule );
			}
			virtual void    FromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("w:after"),             m_oAfter )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:afterAutospacing"),  m_oAfterAutospacing )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:afterLines"),        m_oAfterLines )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:before"),            m_oBefore )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:beforeAutospacing"), m_oBeforeAutospacing )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:beforeLines"),       m_oBeforeLines )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:line"),              m_oLine )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:lineRule"),          m_oLineRule )
				WritingElement_ReadAttributes_End( oReader )
			}
			virtual CString ToString() const
			{
				CString sResult;

				if ( m_oAfter.IsInit() )
				{
					sResult += "w:after=\"";
					sResult += m_oAfter->ToString();
					sResult += "\" ";
				}

				if ( m_oAfterAutospacing.IsInit() )
				{
					sResult += "w:afterAutospacing=\"";
					sResult += m_oAfterAutospacing->ToString();
					sResult += "\" ";
				}

				if ( m_oAfterLines.IsInit() )
				{
					sResult += "w:afterLines=\"";
					sResult += m_oAfterLines->ToString();
					sResult += "\" ";
				}

				if ( m_oBefore.IsInit() )
				{
					sResult += "w:before=\"";
					sResult += m_oBefore->ToString();
					sResult += "\" ";
				}

				if ( m_oBeforeAutospacing.IsInit() )
				{
					sResult += "w:beforeAutospacing=\"";
					sResult += m_oBeforeAutospacing->ToString();
					sResult += "\" ";
				}

				if ( m_oBeforeLines.IsInit() )
				{
					sResult += "w:beforeLines=\"";
					sResult += m_oBeforeLines->ToString();
					sResult += "\" ";
				}

				if ( m_oLine.IsInit() )
				{
					sResult += "w:line=\"";
					sResult += m_oLine->ToString();
					sResult += "\" ";
				}

				if ( m_oLineRule.IsInit() )
				{
					sResult += "w:lineRule=\"";
					sResult += m_oLineRule->ToString();
					sResult += "\" ";
				}

				return sResult;
			}

			static const CSpacing Merge(const CSpacing& oPrev, const CSpacing& oCurrent)
			{
				CSpacing oProperties;
				oProperties.m_oAfter            = Merge( oPrev.m_oAfter,            oCurrent.m_oAfter );
				oProperties.m_oAfterAutospacing            = Merge( oPrev.m_oAfterAutospacing,            oCurrent.m_oAfterAutospacing );
				oProperties.m_oAfterLines            = Merge( oPrev.m_oAfterLines,            oCurrent.m_oAfterLines );
				oProperties.m_oBefore            = Merge( oPrev.m_oBefore,            oCurrent.m_oBefore );
				oProperties.m_oBeforeAutospacing            = Merge( oPrev.m_oBeforeAutospacing,            oCurrent.m_oBeforeAutospacing );
				oProperties.m_oBeforeLines            = Merge( oPrev.m_oBeforeLines,            oCurrent.m_oBeforeLines );
				oProperties.m_oLine            = Merge( oPrev.m_oLine,            oCurrent.m_oLine );
				oProperties.m_oLineRule            = Merge( oPrev.m_oLineRule,            oCurrent.m_oLineRule );
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

			nullable<SimpleTypes::CTwipsMeasure       > m_oAfter;
			nullable<SimpleTypes::COnOff<>            > m_oAfterAutospacing;
			nullable<SimpleTypes::CDecimalNumber<>    > m_oAfterLines;
			nullable<SimpleTypes::CTwipsMeasure       > m_oBefore;
			nullable<SimpleTypes::COnOff<>            > m_oBeforeAutospacing;
			nullable<SimpleTypes::CDecimalNumber<>    > m_oBeforeLines;
			nullable<SimpleTypes::CSignedTwipsMeasure > m_oLine;
			nullable<SimpleTypes::CLineSpacingRule<>  > m_oLineRule;
		};

		
		
		
		class CTabStop : public ComplexType
		{
		public:
			ComplexTypes_AdditionConstructors(CTabStop)
			CTabStop()
			{
			}
			virtual ~CTabStop()
			{
			}

			virtual void    FromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("w:leader"), m_oLeader );
				oNode.ReadAttributeBase( _T("w:pos"),    m_oPos );
				oNode.ReadAttributeBase( _T("w:val"),    m_oVal );
			}
			virtual void    FromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("w:leader"), m_oLeader )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:pos"),    m_oPos )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:val"),    m_oVal )
				WritingElement_ReadAttributes_End( oReader )
			}
			virtual CString ToString() const
			{
				CString sResult;

				if ( m_oLeader.IsInit() )
				{
					sResult += "w:leader=\"";
					sResult += m_oLeader->ToString();
					sResult += "\" ";
				}

				if ( m_oPos.IsInit() )
				{
					sResult += "w:pos=\"";
					sResult += m_oPos->ToString();
					sResult += "\" ";
				}

				if ( m_oVal.IsInit() )
				{
					sResult += "w:val=\"";
					sResult += m_oVal->ToString();
					sResult += "\" ";
				}

				return sResult;
			}

		public:

			nullable<SimpleTypes::CTabTlc<>           > m_oLeader;
			nullable<SimpleTypes::CSignedTwipsMeasure > m_oPos;
			nullable<SimpleTypes::CTabJc<>            > m_oVal;
		};

		
		
		
		class CTextAlignment : public ComplexType
		{
		public:
			ComplexTypes_AdditionConstructors(CTextAlignment)
			CTextAlignment()
			{
			}
			virtual ~CTextAlignment()
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

			nullable<SimpleTypes::CTextAlignment<>> m_oVal;
		};

		
		
		
		class CTextboxTightWrap : public ComplexType
		{
		public:
			ComplexTypes_AdditionConstructors(CTextboxTightWrap)
			CTextboxTightWrap()
			{
			}
			virtual ~CTextboxTightWrap()
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

			nullable<SimpleTypes::CTextboxTightWrap<>> m_oVal;
		};

	} 
} 

namespace OOX
{
	namespace Logic
	{
		
		
		
		class CNumPr : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CNumPr)
			CNumPr()
			{
			}
			virtual ~CNumPr()
			{
			}

		public:
			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				if ( _T("w:numPr") != oNode.GetName() )
					return;

				XmlUtils::CXmlNode oChild;

				if ( oNode.GetNode( _T("w:ilvl"), oChild ) )
					m_oIlvl = oChild;

				if ( oNode.GetNode( _T("w:ins"), oChild ) )
					m_oIns = oChild;

				if ( oNode.GetNode( _T("w:numId"), oChild ) )
					m_oNumID = oChild;
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader) 
			{
				if ( oReader.IsEmptyNode() )
					return;

				int nParentDepth = oReader.GetDepth();
				while( oReader.ReadNextSiblingNode( nParentDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();
					if ( _T("w:ilvl") == sName )
						m_oIlvl = oReader;
					else if ( _T("w:ins") == sName )
						m_oIns = oReader;
					else if ( _T("w:numId") == sName )
						m_oNumID = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<w:numPr>");

				if ( m_oIlvl.IsInit() )
				{
					sResult += "<w:ilvl ";
					sResult += m_oIlvl->ToString();
					sResult += "/>";
				}

				if ( m_oIns.IsInit() )
				{
					sResult += "<w:ins ";
					sResult += m_oIns->ToString();
					sResult += "/>";
				}

				if ( m_oNumID.IsInit() )
				{
					sResult += "<w:numId ";
					sResult += m_oNumID->ToString();
					sResult += "/>";
				}

				sResult += _T("</w:numPr>");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_w_numPr;
			}
		public:

			nullable<ComplexTypes::Word::CDecimalNumber > m_oIlvl;
			nullable<ComplexTypes::Word::CTrackChange   > m_oIns;
			nullable<ComplexTypes::Word::CDecimalNumber > m_oNumID;

		};

		
		
		
		class CPBdr : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CPBdr)
			CPBdr()
			{
			}
			virtual ~CPBdr()
			{
			}
		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				if ( _T("w:pBdr") != oNode.GetName() )
					return;

				XmlUtils::CXmlNode oChild;

				if ( oNode.GetNode( _T("w:bar"), oChild ) )
					m_oBar = oChild;

				if ( oNode.GetNode( _T("w:between"), oChild ) )
					m_oBetween = oChild;

				if ( oNode.GetNode( _T("w:bottom"), oChild ) )
					m_oBottom = oChild;

				if ( oNode.GetNode( _T("w:left"), oChild ) )
					m_oLeft = oChild;

				if ( oNode.GetNode( _T("w:right"), oChild ) )
					m_oRight = oChild;

				if ( oNode.GetNode( _T("w:top"), oChild ) )
					m_oTop = oChild;

			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader) 
			{
				if ( oReader.IsEmptyNode() )
					return;

				int nParentDepth = oReader.GetDepth();
				while( oReader.ReadNextSiblingNode( nParentDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();
					if ( _T("w:bar") == sName )
						m_oBar = oReader;
					else if ( _T("w:between") == sName )
						m_oBetween = oReader;
					else if ( _T("w:bottom") == sName )
						m_oBottom = oReader;
					else if ( _T("w:left") == sName )
						m_oLeft = oReader;
					else if ( _T("w:right") == sName )
						m_oRight = oReader;
					else if ( _T("w:top") == sName )
						m_oTop = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<w:pBdr>");

				if ( m_oBar.IsInit() )
				{
					sResult += "<w:bar ";
					sResult += m_oBar->ToString();
					sResult += "/>";
				}

				if ( m_oBetween.IsInit() )
				{
					sResult += "<w:between ";
					sResult += m_oBetween->ToString();
					sResult += "/>";
				}

				if ( m_oBottom.IsInit() )
				{
					sResult += "<w:bottom ";
					sResult += m_oBottom->ToString();
					sResult += "/>";
				}

				if ( m_oLeft.IsInit() )
				{
					sResult += "<w:left ";
					sResult += m_oLeft->ToString();
					sResult += "/>";
				}

				if ( m_oRight.IsInit() )
				{
					sResult += "<w:right ";
					sResult += m_oRight->ToString();
					sResult += "/>";
				}

				if ( m_oTop.IsInit() )
				{
					sResult += "<w:top ";
					sResult += m_oTop->ToString();
					sResult += "/>";
				}

				sResult += _T("</w:pBdr>");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_w_pBdr;
			}
			static const CPBdr Merge(const CPBdr& oPrev, const CPBdr& oCurrent)
			{
				CPBdr oProperties;
				oProperties.m_oBar            = Merge( oPrev.m_oBar,            oCurrent.m_oBar );
				oProperties.m_oBetween            = Merge( oPrev.m_oBetween,            oCurrent.m_oBetween );
				oProperties.m_oBottom            = Merge( oPrev.m_oBottom,            oCurrent.m_oBottom );
				oProperties.m_oLeft            = Merge( oPrev.m_oLeft,            oCurrent.m_oLeft );
				oProperties.m_oRight            = Merge( oPrev.m_oRight,            oCurrent.m_oRight );
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

			nullable<ComplexTypes::Word::CBorder > m_oBar;
			nullable<ComplexTypes::Word::CBorder > m_oBetween;
			nullable<ComplexTypes::Word::CBorder > m_oBottom;
			nullable<ComplexTypes::Word::CBorder > m_oLeft;
			nullable<ComplexTypes::Word::CBorder > m_oRight;
			nullable<ComplexTypes::Word::CBorder > m_oTop;

		};
		
		
		
		class CParagraphProperty;
		class CPPrChange : public WritingElement
		{
		public:
			CPPrChange();
			CPPrChange(XmlUtils::CXmlNode& oNode);
			CPPrChange(XmlUtils::CXmlLiteReader& oReader);
			const CPPrChange& operator =(const XmlUtils::CXmlNode &oNode);
			const CPPrChange& operator =(const XmlUtils::CXmlLiteReader& oReader);
			virtual ~CPPrChange();

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
			nullable<SimpleTypes::CDecimalNumber<> > m_oID;

			nullable<OOX::Logic::CParagraphProperty> m_pParPr;

		};
		
		
		
		class CTabs : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CTabs)
			CTabs()
			{
			}
			virtual ~CTabs()
			{
			}
		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				if ( _T("w:tabs") != oNode.GetName() )
					return;

				XmlUtils::CXmlNodes oTabs;
				if ( oNode.GetNodes( _T("w:tab"), oTabs ) )
				{
					XmlUtils::CXmlNode oTab;
					for ( int nIndex = 0; nIndex < oTabs.GetCount(); nIndex++ )
					{
						if ( oTabs.GetAt( nIndex, oTab ) )
						{
							ComplexTypes::Word::CTabStop oTabStop = oTab;
							m_arrTabs.Add( oTabStop );
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
					if ( _T("w:tab") == sName )
					{
						ComplexTypes::Word::CTabStop oTabStop = oReader;
						m_arrTabs.Add( oTabStop );
					}
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<w:tabs>");

				for ( int nIndex = 0; nIndex < m_arrTabs.GetSize(); nIndex++ )
				{
					sResult += _T("<w:tab ");
					sResult += m_arrTabs[nIndex].ToString();
					sResult += _T("/>");
				}

				sResult += _T("</w:tabs>");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_w_tabs;
			}
		public:

			CSimpleArray<ComplexTypes::Word::CTabStop> m_arrTabs;
		};
		
		
		
		class CParagraphProperty : public WritingElement
		{
		public:
			CParagraphProperty() 
			{
				m_bPPrChange = false;
			}
			CParagraphProperty(XmlUtils::CXmlNode& oNode)
			{
				m_bPPrChange = false;
				fromXML( oNode );
			}
			CParagraphProperty(XmlUtils::CXmlLiteReader& oReader)
			{
				m_bPPrChange = false;
				fromXML( oReader );
			}
			virtual ~CParagraphProperty() {}
			const CParagraphProperty& operator =(const XmlUtils::CXmlNode &oNode)
			{
				fromXML( (XmlUtils::CXmlNode &)oNode );
				return *this;
			}
			const CParagraphProperty& operator =(const XmlUtils::CXmlLiteReader &oReader)
			{
				fromXML( (XmlUtils::CXmlLiteReader&)oReader );
				return *this;
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				if ( _T("w:pPr") != oNode.GetName() )
					return;

				XmlUtils::CXmlNode oChild;

				if ( oNode.GetNode( _T("w:adjustRightInd"), oChild ) )
					m_oAdjustRightInd = oChild;

				if ( oNode.GetNode( _T("w:autoSpaceDE"), oChild ) )
					m_oAutoSpaceDE = oChild;

				if ( oNode.GetNode( _T("w:autoSpaceDN"), oChild ) )
					m_oAutoSpaceDN = oChild;

				if ( oNode.GetNode( _T("w:bidi"), oChild ) )
					m_oBidi = oChild;

				if ( oNode.GetNode( _T("w:cnfStyle"), oChild ) )
					m_oCnfStyle = oChild;

				if ( oNode.GetNode( _T("w:contextualSpacing"), oChild ) )
					m_oContextualSpacing = oChild;

				if ( oNode.GetNode( _T("w:divId"), oChild ) )
					m_oDivID = oChild;

				if ( oNode.GetNode( _T("w:framePr"), oChild ) )
					m_oFramePr = oChild;

				if ( oNode.GetNode( _T("w:ind"), oChild ) )
					m_oInd = oChild;

				if ( oNode.GetNode( _T("w:jc"), oChild ) )
					m_oJc = oChild;

				if ( oNode.GetNode( _T("w:keepLines"), oChild ) )
					m_oKeepLines = oChild;

				if ( oNode.GetNode( _T("w:keepNext"), oChild ) )
					m_oKeepNext = oChild;

				if ( oNode.GetNode( _T("w:kinsoku"), oChild ) )
					m_oKinsoku = oChild;

				if ( oNode.GetNode( _T("w:mirrorIndents"), oChild ) )
					m_oMirrorIndents = oChild;

				if ( oNode.GetNode( _T("w:numPr"), oChild ) )
					m_oNumPr = oChild;

				if ( oNode.GetNode( _T("w:outlineLvl"), oChild ) )
					m_oOutlineLvl = oChild;

				if ( oNode.GetNode( _T("w:overflowPunct"), oChild ) )
					m_oOverflowPunct = oChild;

				if ( oNode.GetNode( _T("w:pageBreakBefore"), oChild ) )
					m_oPageBreakBefore = oChild;

				if ( oNode.GetNode( _T("w:pBdr"), oChild ) )
					m_oPBdr = oChild;

				if ( !m_bPPrChange && oNode.GetNode( _T("w:pPrChange"), oChild ) )
					m_oPPrChange = oChild;

				if ( oNode.GetNode( _T("w:pStyle"), oChild ) )
					m_oPStyle = oChild;

				if ( !m_bPPrChange && oNode.GetNode( _T("w:rPr"), oChild ) )
					m_oRPr = oChild;

				if ( !m_bPPrChange && oNode.GetNode( _T("w:sectPr"), oChild ) )
					m_oSectPr = oChild;

				if ( oNode.GetNode( _T("w:shd"), oChild ) )
					m_oShd = oChild;

				if ( oNode.GetNode( _T("w:snapToGrid"), oChild ) )
					m_oSnapToGrid = oChild;

				if ( oNode.GetNode( _T("w:spacing"), oChild ) )
					m_oSpacing = oChild;

				if ( oNode.GetNode( _T("w:suppressAutoHyphens"), oChild ) )
					m_oSuppressAutoHyphens = oChild;

				if ( oNode.GetNode( _T("w:suppressLineNumbers"), oChild ) )
					m_oSuppressLineNumbers = oChild;

				if ( oNode.GetNode( _T("w:suppressOverlap"), oChild ) )
					m_oSuppressOverlap = oChild;

				if ( oNode.GetNode( _T("w:tabs"), oChild ) )
					m_oTabs = oChild;

				if ( oNode.GetNode( _T("w:textAlignment"), oChild ) )
					m_oTextAlignment = oChild;

				if ( oNode.GetNode( _T("w:textboxTightWrap"), oChild ) )
					m_oTextboxTightWrap = oChild;

				if ( oNode.GetNode( _T("w:textDirection"), oChild ) )
					m_oTextDirection = oChild;

				if ( oNode.GetNode( _T("w:topLinePunct"), oChild ) )
					m_oTopLinePunct = oChild;

				if ( oNode.GetNode( _T("w:widowControl"), oChild ) )
					m_oWidowControl = oChild;

				if ( oNode.GetNode( _T("w:wordWrap"), oChild ) )
					m_oWordWrap = oChild;
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				if ( oReader.IsEmptyNode() )
					return;

				int nParentDepth = oReader.GetDepth();
				while( oReader.ReadNextSiblingNode( nParentDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();

					if ( _T("w:adjustRightInd") == sName )
						m_oAdjustRightInd = oReader;
					else if ( _T("w:autoSpaceDE") == sName )
						m_oAutoSpaceDE = oReader;
					else if ( _T("w:autoSpaceDN") == sName )
						m_oAutoSpaceDN = oReader;
					else if ( _T("w:bidi") == sName )
						m_oBidi = oReader;
					else if ( _T("w:cnfStyle") == sName )
						m_oCnfStyle = oReader;
					else if ( _T("w:contextualSpacing") == sName )
						m_oContextualSpacing = oReader;
					else if ( _T("w:divId") == sName )
						m_oDivID = oReader;
					else if ( _T("w:framePr") == sName )
						m_oFramePr = oReader;
					else if ( _T("w:ind") == sName )
						m_oInd = oReader;
					else if ( _T("w:jc") == sName )
						m_oJc = oReader;
					else if ( _T("w:keepLines") == sName )
						m_oKeepLines = oReader;
					else if ( _T("w:keepNext") == sName )
						m_oKeepNext = oReader;
					else if ( _T("w:kinsoku") == sName )
						m_oKinsoku = oReader;
					else if ( _T("w:mirrorIndents") == sName )
						m_oMirrorIndents = oReader;
					else if ( _T("w:numPr") == sName )
						m_oNumPr = oReader;
					else if ( _T("w:outlineLvl") == sName )
						m_oOutlineLvl = oReader;
					else if ( _T("w:overflowPunct") == sName )
						m_oOverflowPunct = oReader;
					else if ( _T("w:pageBreakBefore") == sName )
						m_oPageBreakBefore = oReader;
					else if ( _T("w:pBdr") == sName )
						m_oPBdr = oReader;
					if ( !m_bPPrChange && _T("w:pPrChange") == sName )
						m_oPPrChange = oReader;
					else if ( _T("w:pStyle") == sName )
						m_oPStyle = oReader;
					if ( !m_bPPrChange && _T("w:rPr") == sName )
						m_oRPr = oReader;
					if ( !m_bPPrChange && _T("w:sectPr") == sName )
						m_oSectPr = oReader;
					else if ( _T("w:shd") == sName )
						m_oShd = oReader;
					else if ( _T("w:snapToGrid") == sName )
						m_oSnapToGrid = oReader;
					else if ( _T("w:spacing") == sName )
						m_oSpacing = oReader;
					else if ( _T("w:suppressAutoHyphens") == sName )
						m_oSuppressAutoHyphens = oReader;
					else if ( _T("w:suppressLineNumbers") == sName )
						m_oSuppressLineNumbers = oReader;
					else if ( _T("w:suppressOverlap") == sName )
						m_oSuppressOverlap = oReader;
					else if ( _T("w:tabs") == sName )
						m_oTabs = oReader;
					else if ( _T("w:textAlignment") == sName )
						m_oTextAlignment = oReader;
					else if ( _T("w:textboxTightWrap") == sName )
						m_oTextboxTightWrap = oReader;
					else if ( _T("w:textDirection") == sName )
						m_oTextDirection = oReader;
					else if ( _T("w:topLinePunct") == sName )
						m_oTopLinePunct = oReader;
					else if ( _T("w:widowControl") == sName )
						m_oWidowControl = oReader;
					else if ( _T("w:wordWrap") == sName )
						m_oWordWrap = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<w:pPr>");

				if ( m_oAdjustRightInd.IsInit() ) 
				{
					sResult += _T("<w:adjustRightInd ");
					sResult += m_oAdjustRightInd->ToString();
					sResult += _T("/>");
				}

				if ( m_oAutoSpaceDE.IsInit() ) 
				{ 
					sResult += _T("<w:autoSpaceDE ");
					sResult += m_oAutoSpaceDE->ToString();
					sResult += _T("/>");				
				}

				if ( m_oAutoSpaceDN.IsInit() ) 
				{ 
					sResult += _T("<w:autoSpaceDN ");
					sResult += m_oAutoSpaceDN->ToString();
					sResult += _T("/>");	
				}

				if ( m_oBidi.IsInit() ) 
				{ 
					sResult += _T("<w:bidi ");
					sResult += m_oBidi->ToString();	
					sResult += _T("/>");		
				}

				if ( m_oCnfStyle.IsInit() ) 
				{ 
					sResult += _T("<w:cnfStyle "); 
					sResult += m_oCnfStyle->ToString();
					sResult += _T("/>");	
				}

				if ( m_oContextualSpacing.IsInit() ) 
				{ 
					sResult += _T("<w:contextualSpacing ");
					sResult += m_oContextualSpacing->ToString();	
					sResult += _T("/>");		
				}

				if ( m_oDivID.IsInit() ) 
				{ 
					sResult += _T("<w:divId "); 
					sResult += m_oDivID->ToString();	
					sResult += _T("/>");		
				}

				if ( m_oFramePr.IsInit() )
				{ 
					sResult += _T("<w:framePr "); 
					sResult += m_oFramePr->ToString();	
					sResult += _T("/>");	
				}

				if ( m_oInd.IsInit() )
				{ 
					sResult += _T("<w:ind "); 
					sResult += m_oInd->ToString();		
					sResult += _T("/>");	
				}

				if ( m_oJc.IsInit() ) 
				{ 
					sResult += _T("<w:jc ");
					sResult += m_oJc->ToString();		
					sResult += _T("/>");	
				}

				if ( m_oKeepLines.IsInit() )
				{ 
					sResult += _T("<w:keepLines ");
					sResult += m_oKeepLines->ToString();	
					sResult += _T("/>");			
				}

				if ( m_oKeepNext.IsInit() ) 
				{ 
					sResult += _T("<w:keepNext "); 
					sResult += m_oKeepNext->ToString();
					sResult += _T("/>");	
				}

				if ( m_oKinsoku.IsInit() )
				{
					sResult += _T("<w:kinsoku "); 
					sResult += m_oKinsoku->ToString();	
					sResult += _T("/>");	
				}

				if ( m_oMirrorIndents.IsInit() ) 
				{ 
					sResult += _T("<w:mirrorIndents "); 
					sResult += m_oMirrorIndents->ToString();	
					sResult += _T("/>");			
				}

				if ( m_oNumPr.IsInit() ) 
					sResult += m_oNumPr->toXML();	

				if ( m_oOutlineLvl.IsInit() ) 
				{ 
					sResult += _T("<w:outlineLvl ");
					sResult += m_oOutlineLvl->ToString();		
					sResult += _T("/>");		
				}

				if ( m_oOverflowPunct.IsInit() ) 
				{ 					
					sResult += _T("<w:overflowPunct "); 
					sResult += m_oOverflowPunct->ToString();	
					sResult += _T("/>");			
				}

				if ( m_oPageBreakBefore.IsInit() ) 
				{ 
					sResult += _T("<w:pageBreakBefore "); 
					sResult += m_oPageBreakBefore->ToString();
					sResult += _T("/>");		
				}

				if ( m_oPBdr.IsInit() )
					sResult += m_oPBdr->toXML();	

				if ( !m_bPPrChange && m_oPPrChange.IsInit() )
					sResult += m_oPPrChange->toXML();	

				if ( m_oPStyle.IsInit() )
				{
					sResult += _T("<w:pStyle ");
					sResult += m_oPStyle->ToString();
					sResult += _T("/>");
				}

				if ( !m_bPPrChange && m_oRPr.IsInit() )
					sResult += m_oRPr->toXML();		

				if ( !m_bPPrChange && m_oSectPr.IsInit() ) 
					sResult += m_oSectPr->toXML();	

				if ( m_oShd.IsInit() ) 
				{ 
					sResult += _T("<w:shd "); 
					sResult += m_oShd->ToString();		
					sResult += _T("/>");	
				}

				if ( m_oSnapToGrid.IsInit() ) 
				{ 
					sResult += _T("<w:snapToGrid ");
					sResult += m_oSnapToGrid->ToString();	
					sResult += _T("/>");		
				}

				if ( m_oSpacing.IsInit() ) 
				{
					sResult += _T("<w:spacing "); 
					sResult += m_oSpacing->ToString();		
					sResult += _T("/>");		
				}

				if ( m_oSuppressAutoHyphens.IsInit() ) 
				{ 
					sResult += _T("<w:suppressAutoHyphens ");
					sResult += m_oSuppressAutoHyphens->ToString();		
					sResult += _T("/>");		
				}

				if ( m_oSuppressLineNumbers.IsInit() ) 
				{ 
					sResult += _T("<w:suppressLineNumbers "); 
					sResult += m_oSuppressLineNumbers->ToString();		
					sResult += _T("/>");			
				}

				if ( m_oSuppressOverlap.IsInit() ) 
				{ 
					sResult += _T("<w:suppressOverlap "); 
					sResult += m_oSuppressOverlap->ToString();		
					sResult += _T("/>");			
				}

				if ( m_oTabs.IsInit() ) 
					sResult += m_oTabs->toXML();	

				if ( m_oTextAlignment.IsInit() ) 
				{
					sResult += _T("<w:textAlignment "); 
					sResult += m_oTextAlignment->ToString();	
					sResult += _T("/>");		
				}

				if ( m_oTextboxTightWrap.IsInit() ) 
				{
					sResult += _T("<w:textboxTightWrap ");
					sResult += m_oTextboxTightWrap->ToString();	
					sResult += _T("/>");			
				}

				if ( m_oTextDirection.IsInit() )
				{ 
					sResult += _T("<w:textDirection "); 
					sResult += m_oTextDirection->ToString();	
					sResult += _T("/>");		
				}

				if ( m_oTopLinePunct.IsInit() )
				{ 
					sResult += _T("<w:topLinePunct ");
					sResult += m_oTopLinePunct->ToString();	
					sResult += _T("/>");			
				}

				if ( m_oWidowControl.IsInit() ) 
				{ 
					sResult += _T("<w:widowControl "); 
					sResult += m_oWidowControl->ToString();
					sResult += _T("/>");		
				}

				if ( m_oWordWrap.IsInit() ) 
				{
					sResult += _T("<w:wordWrap "); 
					sResult += m_oWordWrap->ToString();	
					sResult += _T("/>");		
				}

				sResult += _T("</w:pPr>");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_w_pPr;
			}
		public:
			static const CParagraphProperty Merge(const CParagraphProperty& oPrev, const CParagraphProperty& oCurrent)
			{
				CParagraphProperty oProperties;
				oProperties.m_oAdjustRightInd            = Merge( oPrev.m_oAdjustRightInd,            oCurrent.m_oAdjustRightInd );
				oProperties.m_oAutoSpaceDE            = Merge( oPrev.m_oAutoSpaceDE,            oCurrent.m_oAutoSpaceDE );
				oProperties.m_oAutoSpaceDN            = Merge( oPrev.m_oAutoSpaceDN,            oCurrent.m_oAutoSpaceDN );
				oProperties.m_oBidi            = Merge( oPrev.m_oBidi,            oCurrent.m_oBidi );
				oProperties.m_oCnfStyle            = Merge( oPrev.m_oCnfStyle,            oCurrent.m_oCnfStyle );
				oProperties.m_oContextualSpacing            = Merge( oPrev.m_oContextualSpacing,            oCurrent.m_oContextualSpacing );
				oProperties.m_oDivID            = Merge( oPrev.m_oDivID,            oCurrent.m_oDivID );
				oProperties.m_oFramePr            = Merge( oPrev.m_oFramePr,            oCurrent.m_oFramePr );

				if ( oCurrent.m_oInd.IsInit() && oPrev.m_oInd.IsInit() )
					oProperties.m_oInd = ComplexTypes::Word::CInd::Merge(oPrev.m_oInd.get(), oCurrent.m_oInd.get());
				else
					oProperties.m_oInd            = Merge( oPrev.m_oInd,            oCurrent.m_oInd );

				oProperties.m_oJc            = Merge( oPrev.m_oJc,            oCurrent.m_oJc );
				oProperties.m_oKeepLines            = Merge( oPrev.m_oKeepLines,            oCurrent.m_oKeepLines );
				oProperties.m_oKeepNext            = Merge( oPrev.m_oKeepNext,            oCurrent.m_oKeepNext );
				oProperties.m_oKinsoku            = Merge( oPrev.m_oKinsoku,            oCurrent.m_oKinsoku );
				oProperties.m_oMirrorIndents            = Merge( oPrev.m_oMirrorIndents,            oCurrent.m_oMirrorIndents );
				oProperties.m_oNumPr            = Merge( oPrev.m_oNumPr,            oCurrent.m_oNumPr );
				oProperties.m_oOutlineLvl            = Merge( oPrev.m_oOutlineLvl,            oCurrent.m_oOutlineLvl );
				oProperties.m_oOverflowPunct            = Merge( oPrev.m_oOverflowPunct,            oCurrent.m_oOverflowPunct );
				oProperties.m_oPageBreakBefore            = Merge( oPrev.m_oPageBreakBefore,            oCurrent.m_oPageBreakBefore );

				if ( oCurrent.m_oPBdr.IsInit() && oPrev.m_oPBdr.IsInit() )
					oProperties.m_oPBdr = OOX::Logic::CPBdr::Merge(oPrev.m_oPBdr.get(), oCurrent.m_oPBdr.get());
				else
					oProperties.m_oPBdr            = Merge( oPrev.m_oPBdr,            oCurrent.m_oPBdr );

				oProperties.m_oPPrChange            = Merge( oPrev.m_oPPrChange,            oCurrent.m_oPPrChange );
				oProperties.m_oPStyle            = Merge( oPrev.m_oPStyle,            oCurrent.m_oPStyle );
				oProperties.m_oRPr            = Merge( oPrev.m_oRPr,            oCurrent.m_oRPr );
				oProperties.m_oSectPr            = Merge( oPrev.m_oSectPr,            oCurrent.m_oSectPr );
				oProperties.m_oShd            = Merge( oPrev.m_oShd,            oCurrent.m_oShd );
				oProperties.m_oSnapToGrid            = Merge( oPrev.m_oSnapToGrid,            oCurrent.m_oSnapToGrid );

				if ( oCurrent.m_oSpacing.IsInit() && oPrev.m_oSpacing.IsInit() )
					oProperties.m_oSpacing = ComplexTypes::Word::CSpacing::Merge(oPrev.m_oSpacing.get(), oCurrent.m_oSpacing.get());
				else 
					oProperties.m_oSpacing            = Merge( oPrev.m_oSpacing,            oCurrent.m_oSpacing );

				oProperties.m_oSuppressAutoHyphens            = Merge( oPrev.m_oSuppressAutoHyphens,            oCurrent.m_oSuppressAutoHyphens );
				oProperties.m_oSuppressLineNumbers            = Merge( oPrev.m_oSuppressLineNumbers,            oCurrent.m_oSuppressLineNumbers );
				oProperties.m_oSuppressOverlap            = Merge( oPrev.m_oSuppressOverlap,            oCurrent.m_oSuppressOverlap );
				oProperties.m_oTabs            = Merge( oPrev.m_oTabs,            oCurrent.m_oTabs );
				oProperties.m_oTextAlignment            = Merge( oPrev.m_oTextAlignment,            oCurrent.m_oTextAlignment );
				oProperties.m_oTextboxTightWrap            = Merge( oPrev.m_oTextboxTightWrap,            oCurrent.m_oTextboxTightWrap );
				oProperties.m_oTextDirection            = Merge( oPrev.m_oTextDirection,            oCurrent.m_oTextDirection );
				oProperties.m_oTopLinePunct            = Merge( oPrev.m_oTopLinePunct,            oCurrent.m_oTopLinePunct );
				oProperties.m_oWidowControl            = Merge( oPrev.m_oWidowControl,            oCurrent.m_oWidowControl );
				oProperties.m_oWordWrap            = Merge( oPrev.m_oWordWrap,            oCurrent.m_oWordWrap );
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
			const bool IsSimple() const
			{
				if ( m_oAdjustRightInd.IsInit() ) 
					return false;


				if ( m_oAutoSpaceDE.IsInit() ) 
					return false;

				if ( m_oAutoSpaceDN.IsInit() ) 
					return false;

				if ( m_oBidi.IsInit() ) 
					return false;

				if ( m_oCnfStyle.IsInit() ) 
					return false;

				if ( m_oContextualSpacing.IsInit() ) 
					return false;

				if ( m_oDivID.IsInit() ) 
					return false;

				if ( m_oFramePr.IsInit() )
					return false;

				if ( m_oInd.IsInit() )
					return false;

				if ( m_oJc.IsInit() ) 
					return false;

				if ( m_oKeepLines.IsInit() )
					return false;

				if ( m_oKeepNext.IsInit() ) 
					return false;

				if ( m_oKinsoku.IsInit() )
					return false;

				if ( m_oMirrorIndents.IsInit() ) 
					return false;
				
				if ( m_oNumPr.IsInit() ) 
					return false;

				if ( m_oOutlineLvl.IsInit() ) 
					return false;

				if ( m_oOverflowPunct.IsInit() ) 
					return false;

				if ( m_oPageBreakBefore.IsInit() ) 
					return false;

				if ( m_oPBdr.IsInit() )
					return false;

				if ( m_oPPrChange.IsInit() )
					return false;

				if ( m_oRPr.IsInit() && !m_oRPr->IsSimple() )
					return false;

				if ( m_oSectPr.IsInit() ) 
					return false;

				if ( m_oShd.IsInit() ) 
					return false;

				if ( m_oSnapToGrid.IsInit() ) 
					return false;

				if ( m_oSpacing.IsInit() ) 
					return false;

				if ( m_oSuppressAutoHyphens.IsInit() ) 
					return false;

				if ( m_oSuppressLineNumbers.IsInit() ) 
					return false;

				if ( m_oSuppressOverlap.IsInit() ) 
					return false;

				if ( m_oTabs.IsInit() ) 
					return false;

				if ( m_oTextAlignment.IsInit() ) 
					return false;

				if ( m_oTextboxTightWrap.IsInit() ) 
					return false;

				if ( m_oTextDirection.IsInit() )
					return false;

				if ( m_oTopLinePunct.IsInit() )
					return false;

				if ( m_oWidowControl.IsInit() ) 
					return false;

				if ( m_oWordWrap.IsInit() ) 
					return false;

				return true;
			}

		public:

			bool                                                           m_bPPrChange;

			nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue> > m_oAdjustRightInd;
			nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue> > m_oAutoSpaceDE;
			nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue> > m_oAutoSpaceDN;
			nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue> > m_oBidi;
			nullable<ComplexTypes::Word::CCnf                            > m_oCnfStyle;
			nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue> > m_oContextualSpacing;
			nullable<ComplexTypes::Word::CDecimalNumber                  > m_oDivID;
			nullable<ComplexTypes::Word::CFramePr                        > m_oFramePr;
			nullable<ComplexTypes::Word::CInd                            > m_oInd;
			nullable<ComplexTypes::Word::CJc                             > m_oJc;
			nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue> > m_oKeepLines;
			nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue> > m_oKeepNext;
			nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue> > m_oKinsoku;
			nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue> > m_oMirrorIndents;
			nullable<OOX::Logic::CNumPr                                  > m_oNumPr;
			nullable<ComplexTypes::Word::CDecimalNumber                  > m_oOutlineLvl;
			nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue> > m_oOverflowPunct;
			nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue> > m_oPageBreakBefore;
			nullable<OOX::Logic::CPBdr                                   > m_oPBdr;
			nullable<OOX::Logic::CPPrChange                              > m_oPPrChange;
			nullable<ComplexTypes::Word::CString_                        > m_oPStyle;
			nullable<OOX::Logic::CRunProperty                            > m_oRPr;
			nullable<OOX::Logic::CSectionProperty                        > m_oSectPr;
			nullable<ComplexTypes::Word::CShading                        > m_oShd;
			nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue> > m_oSnapToGrid;
			nullable<ComplexTypes::Word::CSpacing                        > m_oSpacing;
			nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue> > m_oSuppressAutoHyphens;
			nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue> > m_oSuppressLineNumbers;
			nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue> > m_oSuppressOverlap;
			nullable<OOX::Logic::CTabs                                   > m_oTabs;
			nullable<ComplexTypes::Word::CTextAlignment                  > m_oTextAlignment;
			nullable<ComplexTypes::Word::CTextboxTightWrap               > m_oTextboxTightWrap;
			nullable<ComplexTypes::Word::CTextDirection                  > m_oTextDirection;
			nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue> > m_oTopLinePunct;
			nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue> > m_oWidowControl;
			nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue> > m_oWordWrap;
		};

	} 
} 
#endif // OOX_LOGIC_PARAGRAPH_PROPERTY_INCLUDE_H_