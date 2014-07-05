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
#ifndef OOX_LOGIC_SDT_INCLUDE_H_
#define OOX_LOGIC_SDT_INCLUDE_H_

#include "../WritingElement.h"
#include "RunProperty.h"

namespace ComplexTypes
{
	namespace Word
	{
		
		
		
		class CSdtListItem : public ComplexType
		{
		public:
			ComplexTypes_AdditionConstructors(CSdtListItem)
			CSdtListItem()
			{
			}
			virtual ~CSdtListItem()
			{
			}

			virtual void    FromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("w:displayText"), m_sDisplayText );
				oNode.ReadAttributeBase( _T("w:value"),       m_sValue );
			}
			virtual void    FromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("w:displayText"), m_sDisplayText )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:value"),       m_sValue )
				WritingElement_ReadAttributes_End( oReader )
			}
			virtual CString ToString() const
			{
				CString sResult;

				if ( m_sDisplayText.IsInit() )
				{
					sResult += "w:displayText=\"";
					sResult += m_sDisplayText->GetString();
					sResult += "\" ";
				}

				if ( m_sValue.IsInit() )
				{
					sResult += "w:value=\"";
					sResult += m_sValue->GetString();
					sResult += "\" ";
				}

				return sResult;
			}

		public:

			nullable<CString > m_sDisplayText;
			nullable<CString > m_sValue;
		};

		
		
		
		class CDataBinding : public ComplexType
		{
		public:
			ComplexTypes_AdditionConstructors(CDataBinding)
			CDataBinding()
			{
			}
			virtual ~CDataBinding()
			{
			}

			virtual void    FromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("w:prefixMappings"), m_sPrefixMappings );
				oNode.ReadAttributeBase( _T("w:storeItemID"),    m_sStoreItemID );
				oNode.ReadAttributeBase( _T("w:xpath"),          m_sXPath );
			}
			virtual void    FromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("w:prefixMappings"), m_sPrefixMappings )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:storeItemID"),    m_sStoreItemID )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:xpath"),          m_sXPath )
				WritingElement_ReadAttributes_End( oReader )
			}
			virtual CString ToString() const
			{
				CString sResult;

				if ( m_sPrefixMappings.IsInit() )
				{
					sResult += "w:prefixMappings=\"";
					sResult += m_sPrefixMappings->GetString();
					sResult += "\" ";
				}

				if ( m_sStoreItemID.IsInit() )
				{
					sResult += "w:storeItemID=\"";
					sResult += m_sStoreItemID->GetString();
					sResult += "\" ";
				}

				if ( m_sXPath.IsInit() )
				{
					sResult += "w:xpath=\"";
					sResult += m_sXPath->GetString();
					sResult += "\" ";
				}

				return sResult;
			}

		public:

			nullable<CString > m_sPrefixMappings;
			nullable<CString > m_sStoreItemID;
			nullable<CString > m_sXPath;
		};

		
		
		
		class CCalendarType : public ComplexType
		{
		public:
			ComplexTypes_AdditionConstructors(CCalendarType)
			CCalendarType()
			{
			}
			virtual ~CCalendarType()
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

				sResult.Format( _T("w:val=\"%s\""), m_oVal.ToString() );

				return sResult;
			}

		public:

			SimpleTypes::CCalendarType<SimpleTypes::calendartypeGregorian> m_oVal;
		};

		
		
		
		class CSdtDateMappingType : public ComplexType
		{
		public:
			ComplexTypes_AdditionConstructors(CSdtDateMappingType)
			CSdtDateMappingType()
			{
			}
			virtual ~CSdtDateMappingType()
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

				sResult.Format( _T("w:val=\"%s\""), m_oVal.ToString() );

				return sResult;
			}

		public:

			SimpleTypes::CSdtDateMappingType<SimpleTypes::sdtdatemappingtypeText> m_oVal;
		};

		
		
		
		class CLock : public ComplexType
		{
		public:
			ComplexTypes_AdditionConstructors(CLock)
			CLock()
			{
			}
			virtual ~CLock()
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

				sResult.Format( _T("w:val=\"%s\""), m_oVal.ToString() );

				return sResult;
			}

		public:

			SimpleTypes::CLock<SimpleTypes::lockUnlocked> m_oVal;
		};

		
		
		
		class CSdtText : public ComplexType
		{
		public:
			ComplexTypes_AdditionConstructors(CSdtText)
			CSdtText()
			{
			}
			virtual ~CSdtText()
			{
			}

			virtual void    FromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("w:multiLine"), m_oMultiLine );
			}
			virtual void    FromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_ReadSingle( oReader, _T("w:multiLine"), m_oMultiLine )
				WritingElement_ReadAttributes_End( oReader )
			}
			virtual CString ToString() const
			{
				CString sResult;

				sResult.Format( _T("w:multiLine=\"%s\""), m_oMultiLine.ToString() );

				return sResult;
			}

		public:

			SimpleTypes::COnOff<SimpleTypes::onoffFalse> m_oMultiLine;
		};

	} 
} 

namespace OOX
{
	namespace Logic
	{
		
		
		
		class CSdtComboBox : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CSdtComboBox)
			CSdtComboBox()
			{
			}
			virtual ~CSdtComboBox()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("w:lastValue"), m_sLastValue );

				XmlUtils::CXmlNodes oChilds;
				if ( oNode.GetNodes( _T("w:listItem"), oChilds ) )
				{
					XmlUtils::CXmlNode oItemNode;
					for ( int nIndex = 0; nIndex < oChilds.GetCount(); nIndex++ )
					{
						if ( oChilds.GetAt( nIndex, oItemNode ) )
						{
							ComplexTypes::Word::CSdtListItem oListItem = oItemNode;
							m_arrListItem.Add( oListItem );
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
					if ( _T("w:listItem") == sName )
					{
						ComplexTypes::Word::CSdtListItem oListItem = oReader;
						m_arrListItem.Add( oListItem );
					}
				}
			}
			virtual CString      toXML() const
			{
				CString sResult;
				
				if ( m_sLastValue.IsInit() )
				{
					sResult = _T("<w:comboBox w:lastValue=\"");
					sResult += m_sLastValue->GetString();
					sResult += _T("\">");
				}
				else
					sResult = _T("<w:comboBox>");

				for ( int nIndex = 0; nIndex < m_arrListItem.GetSize(); nIndex++ )
				{
					sResult += _T("<w:listItem ");
					sResult += m_arrListItem[nIndex].ToString();
					sResult += _T("/>");
				}

				sResult += _T("</w:comboBox>");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_w_comboBox;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_ReadSingle( oReader, _T("w:lastValue"), m_sLastValue )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			
			nullable<CString >                             m_sLastValue;

			
			CSimpleArray<ComplexTypes::Word::CSdtListItem> m_arrListItem;
		};

		
		
		
		class CDate : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CDate)
			CDate()
			{
			}
			virtual ~CDate()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("w:fullDate"), m_oFullDate );

				XmlUtils::CXmlNode oChild;

				WritingElement_ReadNode( oNode, oChild, _T("w:calendar"),          m_oCalendar );
				WritingElement_ReadNode( oNode, oChild, _T("w:dateFormat"),        m_oDateFormat );
				WritingElement_ReadNode( oNode, oChild, _T("w:lid"),               m_oLid );
				WritingElement_ReadNode( oNode, oChild, _T("w:storeMappedDataAs"), m_oStoreMappedDataAs );
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
					if ( _T("w:calendar") == sName )
						m_oCalendar = oReader;
					else if ( _T("w:dateFormat") == sName )
						m_oDateFormat = oReader;
					else if ( _T("w:lid") == sName )
						m_oLid = oReader;
					else if ( _T("w:storeMappedDataAs") == sName )
						m_oStoreMappedDataAs = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult;
				
				if ( m_oFullDate.IsInit() )
				{
					sResult = _T("<w:date w:fullDate=\"");
					sResult += m_oFullDate->ToString();
					sResult += _T("\">");
				}
				else
					sResult = _T("<w:date>");

				WritingElement_WriteNode_1( _T("<w:calendar "),          m_oCalendar );
				WritingElement_WriteNode_1( _T("<w:dateFormat "),        m_oDateFormat );
				WritingElement_WriteNode_1( _T("<w:lid "),               m_oLid );
				WritingElement_WriteNode_1( _T("<w:storeMappedDataAs "), m_oStoreMappedDataAs );

				sResult += _T("</w:date>");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_w_date;
			}
		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_ReadSingle( oReader, _T("w:fullDate"), m_oFullDate )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			
			nullable<SimpleTypes::CDateTime                 > m_oFullDate;

			
			nullable<ComplexTypes::Word::CCalendarType      > m_oCalendar;
			nullable<ComplexTypes::Word::CString_           > m_oDateFormat;
			nullable<ComplexTypes::Word::CLang              > m_oLid;
			nullable<ComplexTypes::Word::CSdtDateMappingType> m_oStoreMappedDataAs;
		};

		
		
		
		class CSdtDocPart : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CSdtDocPart)
			CSdtDocPart()
			{
			}
			virtual ~CSdtDocPart()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				XmlUtils::CXmlNode oChild;

				WritingElement_ReadNode( oNode, oChild, _T("w:docPartCategory"), m_oDocPartCategory );
				WritingElement_ReadNode( oNode, oChild, _T("w:docPartGallery"),  m_oDocPartGallery );
				WritingElement_ReadNode( oNode, oChild, _T("w:docPartUnique"),   m_oDocPartUnique );
			}

			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader) 
			{
				if ( oReader.IsEmptyNode() )
					return;

				int nParentDepth = oReader.GetDepth();
				while( oReader.ReadNextSiblingNode( nParentDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();
					if ( _T("w:docPartCategory") == sName )
						m_oDocPartCategory = oReader;
					else if ( _T("w:docPartGallery") == sName )
						m_oDocPartGallery = oReader;
					else if ( _T("w:docPartUnique") == sName )
						m_oDocPartUnique = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<w:docPartList>");

				WritingElement_WriteNode_1( _T("<w:docPartCategory "), m_oDocPartCategory );
				WritingElement_WriteNode_1( _T("<w:docPartGallery "),  m_oDocPartGallery );
				WritingElement_WriteNode_1( _T("<w:docPartUnique "),   m_oDocPartUnique );

				sResult += _T("</w:docPartList>");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_w_docPartList;
			}
		public:

 			nullable<ComplexTypes::Word::CString_                       > m_oDocPartCategory;
			nullable<ComplexTypes::Word::CString_                       > m_oDocPartGallery;
			nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue>> m_oDocPartUnique;
		};

		
		
		
		class CSdtDropDownList : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CSdtDropDownList)
			CSdtDropDownList()
			{
			}
			virtual ~CSdtDropDownList()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("w:lastValue"), m_sLastValue );

				XmlUtils::CXmlNodes oChilds;
				if ( oNode.GetNodes( _T("w:listItem"), oChilds ) )
				{
					XmlUtils::CXmlNode oItemNode;
					for ( int nIndex = 0; nIndex < oChilds.GetCount(); nIndex++ )
					{
						if ( oChilds.GetAt( nIndex, oItemNode ) )
						{
							ComplexTypes::Word::CSdtListItem oListItem = oItemNode;
							m_arrListItem.Add( oListItem );
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
					if ( _T("w:listItem") == sName )
					{
						ComplexTypes::Word::CSdtListItem oListItem = oReader;
						m_arrListItem.Add( oListItem );
					}
				}
			}
			virtual CString      toXML() const
			{
				CString sResult;
				
				if ( m_sLastValue.IsInit() )
				{
					sResult = _T("<w:dropDownList w:lastValue=\"");
					sResult += m_sLastValue->GetString();
					sResult += _T("\">");
				}
				else
					sResult = _T("<w:dropDownList>");

				for ( int nIndex = 0; nIndex < m_arrListItem.GetSize(); nIndex++ )
				{
					sResult += _T("<w:listItem ");
					sResult += m_arrListItem[nIndex].ToString();
					sResult += _T("/>");
				}

				sResult += _T("</w:dropDownList>");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_w_dropDownList;
			}
		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_ReadSingle( oReader, _T("w:lastValue"), m_sLastValue )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			
			nullable<CString >                             m_sLastValue;

			
			CSimpleArray<ComplexTypes::Word::CSdtListItem> m_arrListItem;
		};

		
		
		
		class CPlaceHolder : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CPlaceHolder)
			CPlaceHolder()
			{
			}
			virtual ~CPlaceHolder()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				XmlUtils::CXmlNode oChild;

				WritingElement_ReadNode( oNode, oChild, _T("w:docPart"), m_oDocPart );
			}

			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader) 
			{
				if ( oReader.IsEmptyNode() )
					return;

				int nParentDepth = oReader.GetDepth();
				while( oReader.ReadNextSiblingNode( nParentDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();
					if ( _T("w:docPart") == sName )
						m_oDocPart = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<w:placeholder>");

				WritingElement_WriteNode_1( _T("<w:docPart "), m_oDocPart );

				sResult += _T("</w:placeholder>");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_w_placeholder;
			}
		public:

			
			nullable<ComplexTypes::Word::CString_> m_oDocPart;
		};

		
		
		
		class CSdtEndPr : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CSdtEndPr)
			CSdtEndPr()
			{
			}
			virtual ~CSdtEndPr()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				XmlUtils::CXmlNode oChild;

				if ( oNode.GetNode( _T("w:rPr"), oChild ) )
					m_oRPr = oChild;
			}

			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader) 
			{
				if ( oReader.IsEmptyNode() )
					return;

				int nParentDepth = oReader.GetDepth();
				while( oReader.ReadNextSiblingNode( nParentDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();
					if ( _T("w:rPr") == sName )
						m_oRPr = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<w:sdtEndPr>");

				if ( m_oRPr.IsInit() )
					sResult += m_oRPr->toXML();

				sResult += _T("</w:sdtEndPr>");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_w_sdtEndPr;
			}
		public:

			nullable<OOX::Logic::CRunProperty> m_oRPr;
		};

		
		
		
		enum ESdtType
		{
			sdttypeUnknown      = -1,
			sdttypeBibliography =  0,
			sdttypeCitation     =  1,
			sdttypeComboBox     =  2,
			sdttypeDate         =  3,
			sdttypeDocPartList  =  4,
			sdttypeDocPartObj   =  5,
			sdttypeDropDownList =  6,
			sdttypeEquation     =  7,
			sdttypeGroup        =  8,
			sdttypePicture      =  9,
			sdttypeRichText     = 10,
			sdttypeText         = 11
		};

		class CSdtPr : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CSdtPr)
			CSdtPr()
			{
				m_eType = sdttypeUnknown;
			}
			virtual ~CSdtPr()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				m_eType = sdttypeUnknown;

				XmlUtils::CXmlNode oChild;

				if ( oNode.GetNode( _T("w:alias"), oChild ) )
					m_oAlias = oChild;

				if ( oNode.GetNode( _T("w:bibliography"), oChild ) )
					m_eType = sdttypeBibliography;

				if ( sdttypeUnknown == m_eType && oNode.GetNode( _T("w:citation"), oChild ) )
					m_eType = sdttypeCitation;

				if ( sdttypeUnknown == m_eType && oNode.GetNode( _T("w:alias"), oChild ) )
				{
					m_oComboBox = oChild;
					m_eType = sdttypeComboBox;
				}

				if ( oNode.GetNode( _T("w:dataBinding"), oChild ) )
					m_oDataBinding = oChild;

				if ( sdttypeUnknown == m_eType && oNode.GetNode( _T("w:date"), oChild ) )
				{
					m_oDate = oChild;
					m_eType = sdttypeDate;
				}

				if ( sdttypeUnknown == m_eType && oNode.GetNode( _T("w:docPartList"), oChild ) )
				{
					m_oDocPartList = oChild;
					m_eType = sdttypeDocPartList;
				}

				if ( sdttypeUnknown == m_eType && oNode.GetNode( _T("w:docPartObj"), oChild ) )
				{
					m_oDocPartObj = oChild;
					m_eType = sdttypeDocPartObj;
				}

				if ( sdttypeUnknown == m_eType && oNode.GetNode( _T("w:dropDownList"), oChild ) )
				{
					m_oDropDownList = oChild;
					m_eType = sdttypeDropDownList;
				}

				if ( sdttypeUnknown == m_eType && oNode.GetNode( _T("w:equation"), oChild ) )
					m_eType = sdttypeEquation;

				if ( sdttypeUnknown == m_eType && oNode.GetNode( _T("w:group"), oChild ) )
					m_eType = sdttypeGroup;

				if ( oNode.GetNode( _T("w:id"), oChild ) )
					m_oId = oChild;

				if ( oNode.GetNode( _T("w:label"), oChild ) )
					m_oLabel = oChild;

				if ( oNode.GetNode( _T("w:lock"), oChild ) )
					m_oLock = oChild;

				if ( sdttypeUnknown == m_eType && oNode.GetNode( _T("w:picture"), oChild ) )
					m_eType = sdttypePicture;

				if ( oNode.GetNode( _T("w:placeholder"), oChild ) )
					m_oPlaceHolder = oChild;

				if ( sdttypeUnknown == m_eType && oNode.GetNode( _T("w:richText"), oChild ) )
					m_eType = sdttypeRichText;

				if ( oNode.GetNode( _T("w:rPr"), oChild ) )
					m_oRPr = oChild;

				if ( oNode.GetNode( _T("w:showingPlcHdr"), oChild ) )
					m_oShowingPlcHdr = oChild;

				if ( oNode.GetNode( _T("w:tabIndex"), oChild ) )
					m_oTabIndex = oChild;

				if ( oNode.GetNode( _T("w:tag"), oChild ) )
					m_oTag = oChild;

				if ( oNode.GetNode( _T("w:temporary"), oChild ) )
					m_oTemporary = oChild;

				if ( sdttypeUnknown == m_eType && oNode.GetNode( _T("w:text"), oChild ) )
				{
					m_oText = oChild;
					m_eType = sdttypeText;
				}
			}

			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader) 
			{
				m_eType = sdttypeUnknown;

				if ( oReader.IsEmptyNode() )
					return;

				int nParentDepth = oReader.GetDepth();
				while( oReader.ReadNextSiblingNode( nParentDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();

					if      ( _T("w:alias") == sName )
						m_oAlias = oReader;
					else if ( _T("w:bibliography") == sName )
						m_eType = sdttypeBibliography;
					else if ( sdttypeUnknown == m_eType && _T("w:citation") == sName )
						m_eType = sdttypeCitation;
					else if ( sdttypeUnknown == m_eType && _T("w:alias") == sName )
					{
						m_oComboBox = oReader;
						m_eType = sdttypeComboBox;
					}
					else if ( _T("w:dataBinding") == sName )
						m_oDataBinding = oReader;
					else if ( sdttypeUnknown == m_eType && _T("w:date") == sName )
					{
						m_oDate = oReader;
						m_eType = sdttypeDate;
					}
					else if ( sdttypeUnknown == m_eType && _T("w:docPartList") == sName )
					{
						m_oDocPartList = oReader;
						m_eType = sdttypeDocPartList;
					}
					else if ( sdttypeUnknown == m_eType && _T("w:docPartObj") == sName )
					{
						m_oDocPartObj = oReader;
						m_eType = sdttypeDocPartObj;
					}
					else if ( sdttypeUnknown == m_eType && _T("w:dropDownList") == sName )
					{
						m_oDropDownList = oReader;
						m_eType = sdttypeDropDownList;
					}
					else if ( sdttypeUnknown == m_eType && _T("w:equation") == sName )
						m_eType = sdttypeEquation;
					else if ( sdttypeUnknown == m_eType && _T("w:group") == sName )
						m_eType = sdttypeGroup;
					else if ( _T("w:id") == sName )
						m_oId = oReader;
					else if ( _T("w:label") == sName )
						m_oLabel = oReader;
					else if ( _T("w:lock") == sName )
						m_oLock = oReader;
					else if ( sdttypeUnknown == m_eType && _T("w:picture") == sName )
						m_eType = sdttypePicture;
					else if ( _T("w:placeholder") == sName )
						m_oPlaceHolder = oReader;
					else if ( sdttypeUnknown == m_eType && _T("w:richText") == sName )
						m_eType = sdttypeRichText;
					else if ( _T("w:rPr") == sName )
						m_oRPr = oReader;
					else if ( _T("w:showingPlcHdr") == sName )
						m_oShowingPlcHdr = oReader;
					else if ( _T("w:tabIndex") == sName )
						m_oTabIndex = oReader;
					else if ( _T("w:tag") == sName )
						m_oTag = oReader;
					else if ( _T("w:temporary") == sName )
						m_oTemporary = oReader;
					else if ( sdttypeUnknown == m_eType && _T("w:text") == sName )
					{
						m_oText = oReader;
						m_eType = sdttypeText;
					}
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<w:sdtPr>");

				WritingElement_WriteNode_2( m_oRPr );
				WritingElement_WriteNode_1( _T("<w:alias "),         m_oAlias );
				WritingElement_WriteNode_1( _T("<w:label "),         m_oLabel );
				WritingElement_WriteNode_1( _T("<w:tabIndex "),      m_oTabIndex );
				WritingElement_WriteNode_1( _T("<w:lock "),          m_oLock );
				WritingElement_WriteNode_2( m_oPlaceHolder );
				WritingElement_WriteNode_1( _T("<w:showingPlcHdr "), m_oShowingPlcHdr );
				WritingElement_WriteNode_1( _T("<w:dataBinding "),   m_oDataBinding );
				WritingElement_WriteNode_1( _T("<w:temporary "),     m_oTemporary );
				WritingElement_WriteNode_1( _T("<w:id "),            m_oId );
				WritingElement_WriteNode_1( _T("<w:tag "),           m_oTag );

				switch(m_eType)
				{
				case sdttypeBibliography:
					{
						sResult += _T("<bibliography/>");
						break;
					}
				case sdttypeCitation:
					{
						sResult += _T("<w:citation/>");
						break;
					}
				case sdttypeComboBox:
					{
						if ( m_oComboBox.IsInit() )
							sResult += m_oComboBox->toXML();

						break;
					}
				case sdttypeDate:
					{
						if ( m_oDate.IsInit() )
							sResult += m_oDate->toXML();

						break;
					}
				case sdttypeDocPartList:
					{
						if ( m_oDocPartList.IsInit() )
							sResult += m_oDocPartList->toXML();

						break;
					}
				case sdttypeDocPartObj:
					{
						if ( m_oDocPartObj.IsInit() )
							sResult += m_oDocPartObj->toXML();

						break;
					}
				case sdttypeDropDownList:
					{
						if ( m_oDropDownList.IsInit() )
							sResult += m_oDropDownList->toXML();

						break;
					}
				case sdttypeEquation:
					{
						sResult += _T("<w:equation/>");
						break;
					}
				case sdttypeGroup:
					{
						sResult += _T("<w:group/>");
						break;
					}
				case sdttypePicture:
					{
						sResult += _T("<w:picture/>");
						break;
					}
				case sdttypeRichText:
					{
						sResult += _T("<w:richText/>");
						break;
					}
				case sdttypeText:
					{
						if ( m_oText.IsInit() )
						{
							sResult += _T("<w:text ");
							sResult += m_oText->ToString();
							sResult += _T("/>");
						}
						break;
					}
				}

				sResult += _T("</w:sdtPr>");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_w_sdtPr;
			}
		public:

			ESdtType                                                      m_eType;

			
			nullable<ComplexTypes::Word::CString_                       > m_oAlias;
			nullable<OOX::Logic::CSdtComboBox                           > m_oComboBox;
			nullable<ComplexTypes::Word::CDataBinding                   > m_oDataBinding;
			nullable<OOX::Logic::CDate                                  > m_oDate;
			nullable<OOX::Logic::CSdtDocPart                            > m_oDocPartList;
			nullable<OOX::Logic::CSdtDocPart                            > m_oDocPartObj;
			nullable<OOX::Logic::CSdtDropDownList                       > m_oDropDownList;
			nullable<ComplexTypes::Word::CDecimalNumber                 > m_oId;
			nullable<ComplexTypes::Word::CDecimalNumber                 > m_oLabel;
			nullable<ComplexTypes::Word::CLock                          > m_oLock;
			nullable<OOX::Logic::CPlaceHolder                           > m_oPlaceHolder;
			nullable<OOX::Logic::CRunProperty                           > m_oRPr;
			nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue>> m_oShowingPlcHdr;
			nullable<ComplexTypes::Word::CUnsignedDecimalNumber         > m_oTabIndex;
			nullable<ComplexTypes::Word::CString_                       > m_oTag;
			nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue>> m_oTemporary;
			nullable<ComplexTypes::Word::CSdtText                       > m_oText;
		};
		
		
		
		class CSdtContent : public WritingElement
		{
		public:
			CSdtContent()
			{
			}
			CSdtContent(XmlUtils::CXmlNode &oNode)
			{
				fromXML( oNode );
			}
			CSdtContent(XmlUtils::CXmlLiteReader& oReader)
			{
				fromXML( oReader );
			}
			virtual ~CSdtContent()
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

			const CSdtContent &operator =(const XmlUtils::CXmlNode& oNode)
			{
				Clear();
				fromXML( (XmlUtils::CXmlNode&)oNode );
				return *this;
			}
			const CSdtContent &operator =(const XmlUtils::CXmlLiteReader& oReader)
			{
				Clear();
				fromXML( (XmlUtils::CXmlLiteReader&)oReader );
				return *this;
			}

			void Clear()
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

			virtual void         fromXML(XmlUtils::CXmlNode& oNode);
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader);
			virtual CString      toXML() const;
			virtual EElementType getType() const
			{
				return et_w_sdtContent;
			}
		public:

			
			CSimpleArray<WritingElement *> m_arrItems;
		};

		
		
		
		class CSdt : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CSdt)
			CSdt()
			{
			}
			virtual ~CSdt()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				XmlUtils::CXmlNode oChild;

				if ( oNode.GetNode( _T("w:sdtContent"), oChild ) )
					m_oSdtContent = oChild;

				if ( oNode.GetNode( _T("w:sdtEndPr"), oChild ) )
					m_oSdtEndPr = oChild;

				if ( oNode.GetNode( _T("w:sdtPr"), oChild ) )
					m_oSdtPr = oChild;
			}

			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader) 
			{
				if ( oReader.IsEmptyNode() )
					return;

				int nParentDepth = oReader.GetDepth();
				while( oReader.ReadNextSiblingNode( nParentDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();
					if ( _T("w:sdtContent") == sName )
						m_oSdtContent = oReader;
					else if ( _T("w:sdtEndPr") == sName )
						m_oSdtEndPr = oReader;
					else if ( _T("w:sdtPr") == sName )
						m_oSdtPr = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<w:sdt>");

				if ( m_oSdtPr.IsInit() )
					sResult += m_oSdtPr->toXML();

				if ( m_oSdtEndPr.IsInit() )
					sResult += m_oSdtEndPr->toXML();

				if ( m_oSdtContent.IsInit() )
					sResult += m_oSdtContent->toXML();

				sResult += _T("</w:sdt>");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_w_sdt;
			}
		public:

			nullable<OOX::Logic::CSdtContent> m_oSdtContent;
			nullable<OOX::Logic::CSdtEndPr  > m_oSdtEndPr;
			nullable<OOX::Logic::CSdtPr     > m_oSdtPr;
		};
	} 
} 

#endif // OOX_LOGIC_SDT_INCLUDE_H_