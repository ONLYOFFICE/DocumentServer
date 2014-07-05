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
#ifndef OOX_LOGIC_FLD_CHAR_INCLUDE_H_
#define OOX_LOGIC_FLD_CHAR_INCLUDE_H_

#include "../WritingElement.h"
#include "../../Base/Nullable.h"
#include "../../Common/SimpleTypes_Word.h"
#include "../../Common/ComplexTypes.h"

namespace ComplexTypes
{
	namespace Word
	{
		
		
		
		class CMacroName : public ComplexType
		{
		public:
			ComplexTypes_AdditionConstructors(CMacroName)
			CMacroName()
			{
			}
			virtual ~CMacroName()
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

			nullable<SimpleTypes::CMacroName > m_oVal;
		};

		
		
		
		class CFFHelpText : public ComplexType
		{
		public:
			ComplexTypes_AdditionConstructors(CFFHelpText)
			CFFHelpText()
			{
			}
			virtual ~CFFHelpText()
			{
			}

			virtual void    FromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("w:type"), m_oType );
				oNode.ReadAttributeBase( _T("w:val"),  m_oVal );
			}
			virtual void    FromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("w:type"), m_oType )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:val"),  m_oVal )
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

				if ( m_oType.IsInit() )
				{
					sResult += "w:type=\"";
					sResult += m_oType->ToString();
					sResult += "\" ";
				}

				return sResult;
			}

		public:

			nullable<SimpleTypes::CInfoTextType<> > m_oType;
			nullable<SimpleTypes::CFFHelpTextVal  > m_oVal;
		};

		
		
		
		class CFFName : public ComplexType
		{
		public:
			ComplexTypes_AdditionConstructors(CFFName)
			CFFName()
			{
			}
			virtual ~CFFName()
			{
			}

			virtual void    FromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("w:val"),  m_oVal );
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

			nullable<SimpleTypes::CFFName > m_oVal;
		};

		
		
		
		class CFFStatusText : public ComplexType
		{
		public:
			ComplexTypes_AdditionConstructors(CFFStatusText)
			CFFStatusText()
			{
			}
			virtual ~CFFStatusText()
			{
			}

			virtual void    FromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("w:type"), m_oType );
				oNode.ReadAttributeBase( _T("w:val"),  m_oVal );
			}
			virtual void    FromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("w:type"), m_oType )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:val"),  m_oVal )
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

				if ( m_oType.IsInit() )
				{
					sResult += "w:type=\"";
					sResult += m_oType->ToString();
					sResult += "\" ";
				}

				return sResult;
			}

		public:

			nullable<SimpleTypes::CInfoTextType<>  > m_oType;
			nullable<SimpleTypes::CFFStatusTextVal > m_oVal;
		};

		
		
		
		class CFFTextType : public ComplexType
		{
		public:
			ComplexTypes_AdditionConstructors(CFFTextType)
			CFFTextType()
			{
			}
			virtual ~CFFTextType()
			{
			}

			virtual void    FromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("w:val"),  m_oVal );
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

			nullable<SimpleTypes::CFFTextType<> > m_oVal;
		};

	} 
} 

namespace OOX
{
	namespace Logic
	{
		
		
		
		class CFFCheckBox : public WritingElement
		{
		public:
			CFFCheckBox()
			{
			}
			CFFCheckBox(XmlUtils::CXmlNode &oNode)
			{
				fromXML( oNode );
			}
			CFFCheckBox(XmlUtils::CXmlLiteReader& oReader)
			{
				fromXML( oReader );
			}
			virtual ~CFFCheckBox()
			{
			}

		public:
			const CFFCheckBox &operator=(const XmlUtils::CXmlNode &oNode)
			{
				fromXML( (XmlUtils::CXmlNode&) oNode );
				return *this;
			}
			const CFFCheckBox &operator=(const XmlUtils::CXmlLiteReader& oReader)
			{
				fromXML( (XmlUtils::CXmlLiteReader&)oReader );
				return *this;
			}
		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				XmlUtils::CXmlNode oChild;
				WritingElement_ReadNode( oNode, oChild, _T("w:checked"),  m_oChecked );
				WritingElement_ReadNode( oNode, oChild, _T("w:default"),  m_oDefault );
				WritingElement_ReadNode( oNode, oChild, _T("w:size"),     m_oSize );
				WritingElement_ReadNode( oNode, oChild, _T("w:sizeAuto"), m_oSizeAuto );
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				if ( oReader.IsEmptyNode() )
					return;

				int nParentDepth = oReader.GetDepth();
				while( oReader.ReadNextSiblingNode( nParentDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();
					if ( _T("w:checked") == sName )
						m_oChecked = oReader;
					else if ( _T("w:default") == sName )
						m_oDefault = oReader;
					else if ( _T("w:size") == sName )
						m_oSize = oReader;
					else if ( _T("w:sizeAuto") == sName )
						m_oSizeAuto = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<w:checkBox>");

				WritingElement_WriteNode_1( _T("<w:checked "),  m_oChecked );
				WritingElement_WriteNode_1( _T("<w:default "),  m_oDefault );
				WritingElement_WriteNode_1( _T("<w:size "),     m_oSize );
				WritingElement_WriteNode_1( _T("<w:sizeAuto "), m_oSizeAuto );

				sResult += _T("</w:checkBox>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return et_w_checkBox;
			}

		public:

			
			nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue> > m_oChecked;
			nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue> > m_oDefault;
			nullable<ComplexTypes::Word::CHpsMeasure                     > m_oSize;
			nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue> > m_oSizeAuto;

		};

		
		
		
		class CFFDDList : public WritingElement
		{
		public:
			CFFDDList()
			{
			}
			CFFDDList(XmlUtils::CXmlNode &oNode)
			{
				fromXML( oNode );
			}
			CFFDDList(XmlUtils::CXmlLiteReader& oReader)
			{
				fromXML( oReader );
			}
			virtual ~CFFDDList()
			{
			}

		public:
			const CFFDDList &operator=(const XmlUtils::CXmlNode &oNode)
			{
				fromXML( (XmlUtils::CXmlNode&) oNode );
				return *this;
			}
			const CFFDDList &operator=(const XmlUtils::CXmlLiteReader& oReader)
			{
				fromXML( (XmlUtils::CXmlLiteReader&)oReader );
				return *this;
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				XmlUtils::CXmlNode oChild;
				WritingElement_ReadNode( oNode, oChild, _T("w:default"), m_oDefault );
				WritingElement_ReadNode( oNode, oChild, _T("w:result"),  m_oResult );

				XmlUtils::CXmlNodes oListEntryNodes;
				if ( oNode.GetNodes( _T("w:listEntry"), oListEntryNodes ) )
				{
					XmlUtils::CXmlNode oListEntryNode;
					for ( int nIndex = 0; nIndex < oListEntryNodes.GetCount(); nIndex++ )
					{
						if ( oListEntryNodes.GetAt( nIndex, oListEntryNode ) )
						{
							ComplexTypes::Word::CString_ oListEntry = oListEntryNode;
							m_arrListEntry.Add( oListEntry );
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
					if ( _T("w:default") == sName )
						m_oDefault = oReader;
					else if ( _T("w:result") == sName )
						m_oResult = oReader;
					else if ( _T("w:listEntry") == sName )
					{
						ComplexTypes::Word::CString_ oListEntry = oReader;
						m_arrListEntry.Add( oListEntry );
					}
				}
			}				
			virtual CString      toXML() const
			{
				CString sResult = _T("<w:ddList>");

				WritingElement_WriteNode_1( _T("<w:default "), m_oDefault );
				WritingElement_WriteNode_1( _T("<w:result "),  m_oResult );

				for ( int nIndex = 0; nIndex < m_arrListEntry.GetSize(); nIndex++ )
				{
					sResult += _T("<w:listEntry ");
					sResult += m_arrListEntry[nIndex].ToString();
					sResult += _T("/>");
				}

				sResult += _T("</w:ddList>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return et_w_ddList;
			}

		public:

			
			nullable<ComplexTypes::Word::CDecimalNumber > m_oDefault;
			nullable<ComplexTypes::Word::CDecimalNumber > m_oResult;
			CSimpleArray<ComplexTypes::Word::CString_   > m_arrListEntry;
		};

		
		
		
		class CFFTextInput : public WritingElement
		{
		public:
			CFFTextInput()
			{
			}
			CFFTextInput(XmlUtils::CXmlNode &oNode)
			{
				fromXML( oNode );
			}
			CFFTextInput(XmlUtils::CXmlLiteReader& oReader)
			{
				fromXML( oReader );
			}
			virtual ~CFFTextInput()
			{
			}

		public:
			const CFFTextInput &operator=(const XmlUtils::CXmlNode &oNode)
			{
				fromXML( (XmlUtils::CXmlNode&) oNode );
				return *this;
			}
			const CFFTextInput &operator=(const XmlUtils::CXmlLiteReader& oReader)
			{
				fromXML( (XmlUtils::CXmlLiteReader&)oReader );
				return *this;
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				XmlUtils::CXmlNode oChild;
				WritingElement_ReadNode( oNode, oChild, _T("w:default"),   m_oDefault );
				WritingElement_ReadNode( oNode, oChild, _T("w:format"),    m_oFormat );
				WritingElement_ReadNode( oNode, oChild, _T("w:maxLength"), m_oMaxLength );
				WritingElement_ReadNode( oNode, oChild, _T("w:type"),      m_oType );
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				if ( oReader.IsEmptyNode() )
					return;

				int nParentDepth = oReader.GetDepth();
				while( oReader.ReadNextSiblingNode( nParentDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();
					if ( _T("w:default") == sName )
						m_oDefault = oReader;
					else if ( _T("w:format") == sName )
						m_oFormat = oReader;
					else if ( _T("w:maxLength") == sName )
						m_oMaxLength = oReader;
					else if ( _T("w:type") == sName )
						m_oType = oReader;
				}
			}				
			virtual CString      toXML() const
			{
				CString sResult = _T("<w:textInput>");

				WritingElement_WriteNode_1( _T("<w:default "),   m_oDefault );
				WritingElement_WriteNode_1( _T("<w:format "),    m_oFormat );
				WritingElement_WriteNode_1( _T("<w:maxLength "), m_oMaxLength );
				WritingElement_WriteNode_1( _T("<w:type "),      m_oType );

				sResult += _T("</w:textInput>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return et_w_textInput;
			}

		public:

			
			nullable<ComplexTypes::Word::CString_       > m_oDefault;
			nullable<ComplexTypes::Word::CString_       > m_oFormat;
			nullable<ComplexTypes::Word::CDecimalNumber > m_oMaxLength;
			nullable<ComplexTypes::Word::CFFTextType    > m_oType;

		};

		
		
		
		class CFFData : public WritingElement
		{
		public:
			CFFData()
			{
			}
			CFFData(XmlUtils::CXmlNode &oNode)
			{
				fromXML( oNode );
			}
			CFFData(XmlUtils::CXmlLiteReader& oReader)
			{
				fromXML( oReader );
			}
			virtual ~CFFData()
			{
			}

		public:
			const CFFData &operator=(const XmlUtils::CXmlNode &oNode)
			{
				fromXML( (XmlUtils::CXmlNode&) oNode );
				return *this;
			}
			const CFFData &operator=(const XmlUtils::CXmlLiteReader& oReader)
			{
				fromXML( (XmlUtils::CXmlLiteReader&)oReader );
				return *this;
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				XmlUtils::CXmlNode oChild;
				WritingElement_ReadNode( oNode, oChild, _T("w:calcOnExit"), m_oCalcOnExit );
				WritingElement_ReadNode( oNode, oChild, _T("w:checkBox"),   m_oCheckBox );
				WritingElement_ReadNode( oNode, oChild, _T("w:ddList"),     m_oDDList );
				WritingElement_ReadNode( oNode, oChild, _T("w:enabled"),    m_oEnabled );
				WritingElement_ReadNode( oNode, oChild, _T("w:entryMacro"), m_oEntryMacro );
				WritingElement_ReadNode( oNode, oChild, _T("w:exitMacro"),  m_oExitMacro );
				WritingElement_ReadNode( oNode, oChild, _T("w:helpText"),   m_oHelpText );
				WritingElement_ReadNode( oNode, oChild, _T("w:label"),      m_oLabel );
				WritingElement_ReadNode( oNode, oChild, _T("w:name"),       m_oName );
				WritingElement_ReadNode( oNode, oChild, _T("w:statusText"), m_oStatusText );
				WritingElement_ReadNode( oNode, oChild, _T("w:tabIndex"),   m_oTabIndex );
				WritingElement_ReadNode( oNode, oChild, _T("w:textInput"),  m_oTextInput );
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				if ( oReader.IsEmptyNode() )
					return;

				int nParentDepth = oReader.GetDepth();
				while( oReader.ReadNextSiblingNode( nParentDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();

					if      ( _T("w:calcOnExit") == sName ) m_oCalcOnExit = oReader;
					else if ( _T("w:checkBox")   == sName ) m_oCheckBox = oReader;
					else if ( _T("w:ddList")     == sName ) m_oDDList = oReader;
					else if ( _T("w:enabled")    == sName ) m_oEnabled = oReader;
					else if ( _T("w:entryMacro") == sName ) m_oEntryMacro = oReader;
					else if ( _T("w:exitMacro")  == sName ) m_oExitMacro = oReader;
					else if ( _T("w:helpText")   == sName ) m_oHelpText = oReader;
					else if ( _T("w:label")      == sName ) m_oLabel = oReader;
					else if ( _T("w:name")       == sName ) m_oName = oReader;
					else if ( _T("w:statusText") == sName ) m_oStatusText = oReader;
					else if ( _T("w:tabIndex")   == sName ) m_oTabIndex = oReader;
					else if ( _T("w:textInput")  == sName ) m_oTextInput = oReader;
				}
			}				
			virtual CString      toXML() const
			{
				CString sResult = _T("<w:ffData>");

				WritingElement_WriteNode_1( _T("<w:calcOnExit "), m_oCalcOnExit );
				WritingElement_WriteNode_2( m_oCheckBox );
				WritingElement_WriteNode_2( m_oDDList );
				WritingElement_WriteNode_1( _T("<w:enabled "),    m_oEnabled );
				WritingElement_WriteNode_1( _T("<w:entryMacro "), m_oEntryMacro );
				WritingElement_WriteNode_1( _T("<w:exitMacro "),  m_oExitMacro );
				WritingElement_WriteNode_1( _T("<w:helpText "),   m_oHelpText );
				WritingElement_WriteNode_1( _T("<w:label "),      m_oLabel );
				WritingElement_WriteNode_1( _T("<w:name "),       m_oName );
				WritingElement_WriteNode_1( _T("<w:statusText "), m_oStatusText );
				WritingElement_WriteNode_1( _T("<w:tabIndex "),   m_oTabIndex );
				WritingElement_WriteNode_2( m_oTextInput );

				sResult += _T("</w:ffData>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return et_w_ffData;
			}

		public:

			
			nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue> > m_oCalcOnExit;
			nullable<OOX::Logic::CFFCheckBox                             > m_oCheckBox;
			nullable<OOX::Logic::CFFDDList                               > m_oDDList;
			nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue> > m_oEnabled;
			nullable<ComplexTypes::Word::CMacroName                      > m_oEntryMacro;
			nullable<ComplexTypes::Word::CMacroName                      > m_oExitMacro;
			nullable<ComplexTypes::Word::CFFHelpText                     > m_oHelpText;
			nullable<ComplexTypes::Word::CDecimalNumber                  > m_oLabel;
			nullable<ComplexTypes::Word::CFFName                         > m_oName;
			nullable<ComplexTypes::Word::CFFStatusText                   > m_oStatusText;
			nullable<ComplexTypes::Word::CUnsignedDecimalNumber          > m_oTabIndex;
			nullable<OOX::Logic::CFFTextInput                            > m_oTextInput;

		};

		
		
		
		class CFldChar : public WritingElement
		{
		public:
			CFldChar()
			{
			}
			CFldChar(XmlUtils::CXmlNode &oNode)
			{
				fromXML( oNode );
			}
			CFldChar(XmlUtils::CXmlLiteReader& oReader)
			{
				fromXML( oReader );
			}
			virtual ~CFldChar()
			{
			}

		public:
			const CFldChar &operator=(const XmlUtils::CXmlNode &oNode)
			{
				fromXML( (XmlUtils::CXmlNode&) oNode );
				return *this;
			}
			const CFldChar &operator=(const XmlUtils::CXmlLiteReader& oReader)
			{
				fromXML( (XmlUtils::CXmlLiteReader&)oReader );
				return *this;
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("w:dirty"),       m_oDirty );
				oNode.ReadAttributeBase( _T("w:fldCharType"), m_oFldCharType );
				oNode.ReadAttributeBase( _T("w:fldLock"),     m_oFldLock );

				XmlUtils::CXmlNode oChild;
				WritingElement_ReadNode( oNode, oChild, _T("w:ffData"), m_oFFData );
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( oReader.IsEmptyNode() )
					return;

				int nParentDepth = oReader.GetDepth();
				while( oReader.ReadNextSiblingNode( nParentDepth )  )
				{
					CWCharWrapper sName = oReader.GetName();
					WritingElement *pItem = NULL;

					if ( _T("w:ffData") == sName )
						m_oFFData = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<w:fldChar ");

				ComplexTypes_WriteAttribute( _T("w:dirty=\""),       m_oDirty );
				ComplexTypes_WriteAttribute( _T("w:fldCharType=\""), m_oFldCharType );
				ComplexTypes_WriteAttribute( _T("w:fldLock=\""),     m_oFldLock );

				if ( m_oFFData.IsInit() )
				{
					sResult += _T(">");
					sResult += m_oFFData->toXML();
					sResult += _T("</w:fldChar>");
				}
				else
				{
					sResult += _T("/>");
				}

				return sResult;
			}
			virtual EElementType getType() const
			{
				return et_w_fldChar;
			}
		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )

				WritingElement_ReadAttributes_Read_if     ( oReader, _T("w:dirty"),       m_oDirty )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:fldCharType"), m_oFldCharType )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:fldLock"),     m_oFldLock )

				WritingElement_ReadAttributes_End( oReader )
			}


		public:

			
			nullable<SimpleTypes::COnOff<>       > m_oDirty;
			nullable<SimpleTypes::CFldCharType<> > m_oFldCharType;
			nullable<SimpleTypes::COnOff<>       > m_oFldLock;

			
			nullable<OOX::Logic::CFFData         > m_oFFData;
		};
	} 
} 

#endif // OOX_LOGIC_FLD_CHAR_INCLUDE_H_