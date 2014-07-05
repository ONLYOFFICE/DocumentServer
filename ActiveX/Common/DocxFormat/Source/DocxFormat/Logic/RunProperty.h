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
#ifndef OOX_LOGIC_RUN_PROPERTY_INCLUDE_H_
#define OOX_LOGIC_RUN_PROPERTY_INCLUDE_H_

#include "../WritingElement.h"

#include "../../Base/Nullable.h"
#include "../../Common/SimpleTypes_Shared.h"
#include "../../Common/ComplexTypes.h"

namespace ComplexTypes
{
	namespace Word
	{
		
		
		
		class CEastAsianLayout : public ComplexType
		{
		public:
			ComplexTypes_AdditionConstructors(CEastAsianLayout)
			CEastAsianLayout()
			{
			}
			virtual ~CEastAsianLayout()
			{
			}

			virtual void    FromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("w:combine"),         m_oCombine );
				oNode.ReadAttributeBase( _T("w:combineBrackets"), m_oCombineBrackets );
				oNode.ReadAttributeBase( _T("w:id"),              m_oID );
				oNode.ReadAttributeBase( _T("w:vert"),            m_oVert );
				oNode.ReadAttributeBase( _T("w:vertCompress"),    m_oVertCompress );
			}
			virtual void    FromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )

				WritingElement_ReadAttributes_Read_if     ( oReader, _T("w:combine"),         m_oCombine )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:combineBrackets"), m_oCombineBrackets )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:id"),              m_oID )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:vert"),            m_oVert )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:vertCompress"),    m_oVertCompress )

				WritingElement_ReadAttributes_End( oReader )
			}
			virtual CString ToString() const
			{
				CString sResult;

				if ( m_oCombine.IsInit() )
				{
					sResult += "w:combine=\"";
					sResult += m_oCombine->ToString();
					sResult += "\" ";
				}

				if ( m_oCombineBrackets.IsInit() )
				{
					sResult += "w:combineBrackets=\"";
					sResult += m_oCombineBrackets->ToString();
					sResult += "\" ";
				}

				if ( m_oID.IsInit() )
				{
					sResult += "w:themeTint=\"";
					sResult += m_oID->ToString();
					sResult += "\" ";
				}

				if ( m_oVert.IsInit() )
				{
					sResult += "w:vert=\"";
					sResult += m_oVert->ToString();
					sResult += "\" ";
				}

				if ( m_oVertCompress.IsInit() )
				{
					sResult += "w:vertCompress=\"";
					sResult += m_oVert->ToString();
					sResult += "\" ";
				}

				return sResult;
			}

		public:

			nullable<SimpleTypes::COnOff<>           > m_oCombine;
			nullable<SimpleTypes::CCombineBrackets<> > m_oCombineBrackets;
			nullable<SimpleTypes::CDecimalNumber<>   > m_oID;
			nullable<SimpleTypes::COnOff<>           > m_oVert;
			nullable<SimpleTypes::COnOff<>           > m_oVertCompress;
		};

		
		
		
		class CTextEffect : public ComplexType
		{
		public:
			ComplexTypes_AdditionConstructors(CTextEffect)
			CTextEffect()
			{
			}
			virtual ~CTextEffect()
			{
			}

			virtual void    FromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("w:val"), m_oVal );
			}
			virtual void    FromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_ReadSingle ( oReader, _T("w:val"), m_oVal )
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

			nullable<SimpleTypes::CTextEffect<>> m_oVal;
		};


		
		
		
		class CEm : public ComplexType
		{
		public:
			ComplexTypes_AdditionConstructors(CEm)
			CEm()
			{
			}
			virtual ~CEm()
			{
			}

			virtual void    FromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("w:val"), m_oVal );
			}
			virtual void    FromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_ReadSingle ( oReader, _T("w:val"), m_oVal )
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

			nullable<SimpleTypes::CEm<>> m_oVal;
		};


		
		
		
		class CFitText : public ComplexType
		{
		public:
			ComplexTypes_AdditionConstructors(CFitText)
			CFitText()
			{
			}
			virtual ~CFitText()
			{
			}

			virtual void    FromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("w:id"),  m_oID );
				oNode.ReadAttributeBase( _T("w:val"), m_oVal );
			}
			virtual void    FromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("w:id"),  m_oID  )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:val"), m_oVal )
				WritingElement_ReadAttributes_End( oReader )
			}
			virtual CString ToString() const
			{
				CString sResult;

				if ( m_oID.IsInit() )
				{
					sResult += "w:id=\"";
					sResult += m_oID->ToString();
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

			nullable<SimpleTypes::CDecimalNumber<>> m_oID;
			nullable<SimpleTypes::CTwipsMeasure   > m_oVal;
		};


		
		
		
		class CHighlight : public ComplexType
		{
		public:
			ComplexTypes_AdditionConstructors(CHighlight)
			CHighlight()
			{
			}
			virtual ~CHighlight()
			{
			}

			virtual void    FromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("w:val"), m_oVal );
			}
			virtual void    FromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_ReadSingle ( oReader, _T("w:val"), m_oVal )
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

			nullable<SimpleTypes::CHighlightColor<>> m_oVal;
		};

		
		
		
		class CFonts : public ComplexType
		{
		public:
			ComplexTypes_AdditionConstructors(CFonts)
			CFonts()
			{
			}
			virtual ~CFonts()
			{
			}

			virtual void    FromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("w:ascii"),         m_sAscii );
				oNode.ReadAttributeBase( _T("w:asciiTheme"),    m_oAsciiTheme );
				oNode.ReadAttributeBase( _T("w:cs"),            m_sCs );
				oNode.ReadAttributeBase( _T("w:cstheme"),       m_oCsTheme );
				oNode.ReadAttributeBase( _T("w:eastAsia"),      m_sEastAsia );
				oNode.ReadAttributeBase( _T("w:eastAsiaTheme"), m_oEastAsiaTheme );
				oNode.ReadAttributeBase( _T("w:hAnsi"),         m_sHAnsi );
				oNode.ReadAttributeBase( _T("w:hAnsiTheme"),    m_oHAnsiTheme );
				oNode.ReadAttributeBase( _T("w:hint"),          m_oHint );
			}
			virtual void    FromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )

				WritingElement_ReadAttributes_Read_if     ( oReader, _T("w:ascii"),         m_sAscii )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:asciiTheme"),    m_oAsciiTheme )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:cs"),            m_sCs )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:cstheme"),       m_oCsTheme )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:eastAsia"),      m_sEastAsia )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:eastAsiaTheme"), m_oEastAsiaTheme )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:hAnsi"),         m_sHAnsi )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:hAnsiTheme"),    m_oHAnsiTheme )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:hint"),          m_oHint )

				WritingElement_ReadAttributes_End( oReader )
			}
			virtual CString ToString() const
			{			
				CString sResult;

				if ( m_sAscii.IsInit() )
				{
					sResult += "w:ascii=\"";
					sResult += m_sAscii->GetString();
					sResult += "\" ";
				}

				if ( m_oAsciiTheme.IsInit() )
				{
					sResult += "w:asciiTheme=\"";
					sResult += m_oAsciiTheme->ToString();
					sResult += "\" ";
				}

				if ( m_sCs.IsInit() )
				{
					sResult += "w:cs=\"";
					sResult += m_sCs->GetString();
					sResult += "\" ";
				}

				if ( m_oCsTheme.IsInit() )
				{
					sResult += "w:cstheme=\"";
					sResult += m_oCsTheme->ToString();
					sResult += "\" ";
				}

				if ( m_sEastAsia.IsInit() )
				{
					sResult += "w:eastAsia=\"";
					sResult += m_sEastAsia->GetString();
					sResult += "\" ";
				}

				if ( m_oEastAsiaTheme.IsInit() )
				{
					sResult += "w:eastAsiaTheme=\"";
					sResult += m_oEastAsiaTheme->ToString();
					sResult += "\" ";
				}

				if ( m_sHAnsi.IsInit() )
				{
					sResult += "w:hAnsi=\"";
					sResult += m_sHAnsi->GetString();
					sResult += "\" ";
				}

				if ( m_oHAnsiTheme.IsInit() )
				{
					sResult += "w:hAnsiTheme=\"";
					sResult += m_oHAnsiTheme->ToString();
					sResult += "\" ";
				}

				if ( m_oHint.IsInit() )
				{
					sResult += "w:hint=\"";
					sResult += m_oHint->ToString();
					sResult += "\" ";
				}

				return sResult;
			}

		public:

			nullable<CString              > m_sAscii;
			nullable<SimpleTypes::CTheme<>> m_oAsciiTheme;
			nullable<CString              > m_sCs;
			nullable<SimpleTypes::CTheme<>> m_oCsTheme;
			nullable<CString              > m_sEastAsia;
			nullable<SimpleTypes::CTheme<>> m_oEastAsiaTheme;
			nullable<CString              > m_sHAnsi;
			nullable<SimpleTypes::CTheme<>> m_oHAnsiTheme;
			nullable<SimpleTypes::CHint<> > m_oHint;
		};



		
		
		
		class CUnderline : public ComplexType
		{
		public:
			ComplexTypes_AdditionConstructors(CUnderline)
			CUnderline()
			{
			}
			virtual ~CUnderline()
			{
			}
			virtual void    FromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("w:color"),      m_oColor );
				oNode.ReadAttributeBase( _T("w:themeColor"), m_oThemeColor );
				oNode.ReadAttributeBase( _T("w:themeShade"), m_oThemeShade );
				oNode.ReadAttributeBase( _T("w:themeTint"),  m_oThemeTint );
				oNode.ReadAttributeBase( _T("w:val"),        m_oVal );
			}
			virtual void    FromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )

				WritingElement_ReadAttributes_Read_if     ( oReader, _T("w:color"),      m_oColor )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:themeColor"), m_oThemeColor )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:themeShade"), m_oThemeShade )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:themeTint"),  m_oThemeTint )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:val"),        m_oVal )

				WritingElement_ReadAttributes_End( oReader )
			}
			virtual CString ToString() const
			{			
				CString sResult;

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

				if ( m_oVal.IsInit() )
				{
					sResult += "w:val=\"";
					sResult += m_oVal->ToString();
					sResult += "\" ";
				}

				return sResult;
			}

		public:

			nullable<SimpleTypes::CHexColor<>       > m_oColor;
			nullable<SimpleTypes::CThemeColor<>     > m_oThemeColor;
			nullable<SimpleTypes::CUcharHexNumber<> > m_oThemeShade;
			nullable<SimpleTypes::CUcharHexNumber<> > m_oThemeTint;
			nullable<SimpleTypes::CUnderline<>      > m_oVal;
		};

		
		
		
		class CVerticalAlignRun : public ComplexType
		{
		public:
			ComplexTypes_AdditionConstructors(CVerticalAlignRun)
			CVerticalAlignRun()
			{
			}
			virtual ~CVerticalAlignRun()
			{
			}
			virtual void    FromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("w:val"),        m_oVal );
			}
			virtual void    FromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_ReadSingle ( oReader, _T("w:val"), m_oVal )
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

			nullable<SimpleTypes::CVerticalAlignRun<>> m_oVal;
		};

		
		
		
		class CTextScale : public ComplexType
		{
		public:
			ComplexTypes_AdditionConstructors(CTextScale)
			CTextScale()
			{
			}
			virtual ~CTextScale()
			{
			}
			virtual void    FromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("w:val"), m_oVal );
			}
			virtual void    FromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_ReadSingle ( oReader, _T("w:val"), m_oVal )
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

			nullable<SimpleTypes::CTextScale<> > m_oVal;
		};


	} 
} 

namespace OOX
{
	namespace Logic
	{
		class CRunProperty;

		
		
		

		class CRPrChange : public WritingElement
		{
		public:
			CRPrChange();
			CRPrChange(XmlUtils::CXmlNode& oNode);
			CRPrChange(XmlUtils::CXmlLiteReader& oReader);
			virtual ~CRPrChange();
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

			nullable<CRunProperty>					 m_pRunPr;
		};


		class CRunProperty : public WritingElement
		{
		public:
			CRunProperty()
			{
				m_bRPRChange = false;
			}
			virtual ~CRunProperty()
			{
			}
			CRunProperty(const XmlUtils::CXmlNode &oNode)
			{
				m_bRPRChange = false;
				fromXML( (XmlUtils::CXmlNode &)oNode );
			}
			CRunProperty(const XmlUtils::CXmlLiteReader& oReader)
			{
				m_bRPRChange = false;
				fromXML( (XmlUtils::CXmlLiteReader&)oReader );
			}
			const CRunProperty& operator=(const XmlUtils::CXmlNode &oNode)
			{
				fromXML( (XmlUtils::CXmlNode &)oNode );
				return *this;
			}
			const CRunProperty& operator=(const XmlUtils::CXmlLiteReader& oReader)
			{
				fromXML( (XmlUtils::CXmlLiteReader&)oReader );
				return *this;
			}
		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				if ( _T("w:rPr") != oNode.GetName() )
					return;

				XmlUtils::CXmlNode oChild;

				if ( oNode.GetNode( _T("w:b"), oChild ) )
					m_oBold = oChild;

				if ( oNode.GetNode( _T("w:bCs"), oChild ) )
					m_oBoldCs = oChild;

				if ( oNode.GetNode( _T("w:bdr"), oChild ) )
					m_oBdr = oChild;

				if ( oNode.GetNode( _T("w:caps"), oChild ) )
					m_oCaps = oChild;

				if ( oNode.GetNode( _T("w:color"), oChild ) )
					m_oColor = oChild;

				if ( oNode.GetNode( _T("w:cs"), oChild ) )
					m_oCs = oChild;

				if ( oNode.GetNode( _T("w:dstrike"), oChild ) )
					m_oDStrike = oChild;

				if ( oNode.GetNode( _T("w:eastAsianLayout"), oChild ) )
					m_oEastAsianLayout = oChild;

				if ( oNode.GetNode( _T("w:effect"), oChild ) )
					m_oEffect = oChild;

				if ( oNode.GetNode( _T("w:em"), oChild ) )
					m_oEm = oChild;

				if ( oNode.GetNode( _T("w:emboss"), oChild ) )
					m_oEmboss = oChild;

				if ( oNode.GetNode( _T("w:fitText"), oChild ) )
					m_oFitText = oChild;

				if ( oNode.GetNode( _T("w:highlight"), oChild ) )
					m_oHighlight = oChild;

				if ( oNode.GetNode( _T("w:i"), oChild ) )
					m_oItalic = oChild;

				if ( oNode.GetNode( _T("w:iCs"), oChild ) )
					m_oItalicCs = oChild;

				if ( oNode.GetNode( _T("w:imprint"), oChild ) )
					m_oImprint = oChild;

				if ( oNode.GetNode( _T("w:kern"), oChild ) )
					m_oKern = oChild;

				if ( oNode.GetNode( _T("w:lang"), oChild ) )
					m_oLang = oChild;

				if ( oNode.GetNode( _T("w:noProof"), oChild ) )
					m_oNoProof = oChild;

				if ( oNode.GetNode( _T("m:oMath"), oChild ) )
					m_oMath = oChild;

				if ( oNode.GetNode( _T("w:outline"), oChild ) )
					m_oOutline = oChild;

				if ( oNode.GetNode( _T("w:position"), oChild ) )
					m_oPosition = oChild;

				if ( oNode.GetNode( _T("w:rFonts"), oChild ) )
					m_oRFonts = oChild;

				if ( !m_bRPRChange && oNode.GetNode( _T("w:rPrChange"), oChild ) )
					m_oRPrChange = oChild;

				
				
				if ( oNode.GetNode( _T("w:rStyle"), oChild ) )
					m_oRStyle = oChild;

				if ( !m_oRStyle.IsInit() && oNode.GetNode( _T("w:pStyle"), oChild ) )
					m_oRStyle = oChild;

				if ( oNode.GetNode( _T("w:rtl"), oChild ) )
					m_oRtL = oChild;

				if ( oNode.GetNode( _T("w:shadow"), oChild ) )
					m_oShadow = oChild;

				if ( oNode.GetNode( _T("w:shd"), oChild ) )
					m_oShd = oChild;

				if ( oNode.GetNode( _T("w:smallCaps"), oChild ) )
					m_oSmallCaps = oChild;

				if ( oNode.GetNode( _T("w:snapToGrid"), oChild ) )
					m_oSnapToGrid = oChild;

				if ( oNode.GetNode( _T("w:spacing"), oChild ) )
					m_oSpacing = oChild;

				if ( oNode.GetNode( _T("w:specVanish"), oChild ) )
					m_oSpecVanish = oChild;

				if ( oNode.GetNode( _T("w:strike"), oChild ) )
					m_oStrike = oChild;

				if ( oNode.GetNode( _T("w:sz"), oChild ) )
					m_oSz = oChild;

				if ( oNode.GetNode( _T("w:szCs"), oChild ) )
					m_oSzCs = oChild;

				if ( oNode.GetNode( _T("w:u"), oChild ) )
					m_oU = oChild;

				if ( oNode.GetNode( _T("w:vanish"), oChild ) )
					m_oVanish = oChild;

				if ( oNode.GetNode( _T("w:vertAlign"), oChild ) )
					m_oVertAlign = oChild;

				if ( oNode.GetNode( _T("w:w"), oChild ) )
					m_oW = oChild;

				if ( oNode.GetNode( _T("w:webHidden"), oChild ) )
					m_oWebHidden = oChild;

			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				if ( oReader.IsEmptyNode() )
					return;

				int nParentDepth = oReader.GetDepth();
				while( oReader.ReadNextSiblingNode( nParentDepth )  )
				{
					CWCharWrapper sName = oReader.GetName();
					WritingElement *pItem = NULL;

					if ( _T("w:b") == sName )
						m_oBold = oReader;
					else if ( _T("w:bCs") == sName )
						m_oBoldCs = oReader;
					else if ( _T("w:bdr") == sName )
						m_oBdr = oReader;
					else if ( _T("w:caps") == sName )
						m_oCaps = oReader;
					else if ( _T("w:color") == sName )
						m_oColor = oReader;
					else if ( _T("w:cs") == sName )
						m_oCs = oReader;
					else if ( _T("w:dstrike") == sName )
						m_oDStrike = oReader;
					else if ( _T("w:eastAsianLayout") == sName )
						m_oEastAsianLayout = oReader;
					else if ( _T("w:effect") == sName )
						m_oEffect = oReader;
					else if ( _T("w:em") == sName )
						m_oEm = oReader;
					else if ( _T("w:emboss") == sName )
						m_oEmboss = oReader;
					else if ( _T("w:fitText") == sName )
						m_oFitText = oReader;
					else if ( _T("w:highlight") == sName )
						m_oHighlight = oReader;
					else if ( _T("w:i") == sName )
						m_oItalic = oReader;
					else if ( _T("w:iCs") == sName )
						m_oItalicCs = oReader;
					else if ( _T("w:imprint") == sName )
						m_oImprint = oReader;
					else if ( _T("w:kern") == sName )
						m_oKern = oReader;
					else if ( _T("w:lang") == sName )
						m_oLang = oReader;
					else if ( _T("w:noProof") == sName )
						m_oNoProof = oReader;
					else if ( _T("m:oMath") == sName )
						m_oMath = oReader;
					else if ( _T("w:outline") == sName )
						m_oOutline = oReader;
					else if ( _T("w:position") == sName )
						m_oPosition = oReader;
					else if ( _T("w:rFonts") == sName )
						m_oRFonts = oReader;
					else if ( !m_bRPRChange && _T("w:rPrChange") == sName )
						m_oRPrChange = oReader;
					
					
					else if ( _T("w:rStyle") == sName )
						m_oRStyle = oReader;
					else if ( !m_oRStyle.IsInit() && _T("w:pStyle") == sName )
						m_oRStyle = oReader;
					else if ( _T("w:rtl") == sName )
						m_oRtL = oReader;
					else if ( _T("w:shadow") == sName )
						m_oShadow = oReader;
					else if ( _T("w:shd") == sName )
						m_oShd = oReader;
					else if ( _T("w:smallCaps") == sName )
						m_oSmallCaps = oReader;
					else if ( _T("w:snapToGrid") == sName )
						m_oSnapToGrid = oReader;
					else if ( _T("w:spacing") == sName )
						m_oSpacing = oReader;
					else if ( _T("w:specVanish") == sName )
						m_oSpecVanish = oReader;
					else if ( _T("w:strike") == sName )
						m_oStrike = oReader;
					else if ( _T("w:sz") == sName )
						m_oSz = oReader;
					else if ( _T("w:szCs") == sName )
						m_oSzCs = oReader;
					else if ( _T("w:u") == sName )
						m_oU = oReader;
					else if ( _T("w:vanish") == sName )
						m_oVanish = oReader;
					else if ( _T("w:vertAlign") == sName )
						m_oVertAlign = oReader;
					else if ( _T("w:w") == sName )
						m_oW = oReader;
					else if ( _T("w:webHidden") == sName )
						m_oWebHidden = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<w:rPr>");

				if ( m_oBold.IsInit() )
				{
					sResult += _T("<w:b ");
					sResult += m_oBold->ToString();
					sResult += _T("/>");
				}

				if ( m_oBoldCs.IsInit() )
				{
					sResult += _T("<w:bCs ");
					sResult += m_oBoldCs->ToString();
					sResult += _T("/>");
				}

				if ( m_oBdr.IsInit() )
				{
					sResult += _T("<w:bdr ");
					sResult += m_oBdr->ToString();
					sResult += _T("/>");
				}

				if ( m_oCaps.IsInit() )
				{
					sResult += _T("<w:caps ");
					sResult += m_oCaps->ToString();
					sResult += _T("/>");
				}

				if ( m_oColor.IsInit() )
				{
					sResult += _T("<w:color ");
					sResult += m_oColor->ToString();
					sResult += _T("/>");
				}

				if ( m_oCs.IsInit() )
				{
					sResult += _T("<w:cs ");
					sResult += m_oCs->ToString();
					sResult += _T("/>");
				}

				if ( m_oDStrike.IsInit() )
				{
					sResult += _T("<w:dstrike ");
					sResult += m_oDStrike->ToString();
					sResult += _T("/>");
				}

				if ( m_oEastAsianLayout.IsInit() )
				{
					sResult += _T("<w:eastAsianLayout ");
					sResult += m_oEastAsianLayout->ToString();
					sResult += _T("/>");
				}

				if ( m_oEffect.IsInit() )
				{
					sResult += _T("<w:effect ");
					sResult += m_oEffect->ToString();
					sResult += _T("/>");
				}

				if ( m_oEm.IsInit() )
				{
					sResult += _T("<w:em ");
					sResult += m_oEm->ToString();
					sResult += _T("/>");
				}

				if ( m_oEmboss.IsInit() )
				{
					sResult += _T("<w:emboss ");
					sResult += m_oEmboss->ToString();
					sResult += _T("/>");
				}

				if ( m_oFitText.IsInit() )
				{
					sResult += _T("<w:fitText ");
					sResult += m_oFitText->ToString();
					sResult += _T("/>");
				}

				if ( m_oHighlight.IsInit() )
				{
					sResult += _T("<w:highlight ");
					sResult += m_oHighlight->ToString();
					sResult += _T("/>");
				}

				if ( m_oItalic.IsInit() )
				{
					sResult += _T("<w:i ");
					sResult += m_oItalic->ToString();
					sResult += _T("/>");
				}

				if ( m_oItalicCs.IsInit() )
				{
					sResult += _T("<w:iCs ");
					sResult += m_oItalicCs->ToString();
					sResult += _T("/>");
				}

				if ( m_oImprint.IsInit() )
				{
					sResult += _T("<w:imprint ");
					sResult += m_oImprint->ToString();
					sResult += _T("/>");
				}

				if ( m_oKern.IsInit() )
				{
					sResult += _T("<w:kern ");
					sResult += m_oKern->ToString();
					sResult += _T("/>");
				}

				if ( m_oLang.IsInit() )
				{
					sResult += _T("<w:lang ");
					sResult += m_oLang->ToString();
					sResult += _T("/>");
				}

				if ( m_oNoProof.IsInit() )
				{
					sResult += _T("<w:noProof ");
					sResult += m_oNoProof->ToString();
					sResult += _T("/>");
				}

				if ( m_oMath.IsInit() )
				{
					sResult += _T("<m:oMath ");
					sResult += m_oMath->ToString();
					sResult += _T("/>");
				}

				if ( m_oOutline.IsInit() )
				{
					sResult += _T("<w:outline ");
					sResult += m_oOutline->ToString();
					sResult += _T("/>");
				}

				if ( m_oPosition.IsInit() )
				{
					sResult += _T("<w:position ");
					sResult += m_oPosition->ToString();
					sResult += _T("/>");
				}

				if ( m_oRFonts.IsInit() )
				{
					sResult += _T("<w:rFonts ");
					sResult += m_oRFonts->ToString();
					sResult += _T("/>");
				}

				if ( !m_bRPRChange && m_oRPrChange.IsInit() )
					sResult += m_oRPrChange->toXML();

				if ( m_oRStyle.IsInit() )
				{
					sResult += _T("<w:rStyle ");
					sResult += m_oRStyle->ToString();
					sResult += _T("/>");
				}

				if ( m_oRtL.IsInit() )
				{
					sResult += _T("<w:rtl ");
					sResult += m_oRtL->ToString();
					sResult += _T("/>");
				}

				if ( m_oShadow.IsInit() )
				{
					sResult += _T("<w:shadow ");
					sResult += m_oShadow->ToString();
					sResult += _T("/>");
				}

				if ( m_oShd.IsInit() )
				{
					sResult += _T("<w:shd ");
					sResult += m_oShd->ToString();
					sResult += _T("/>");
				}

				if ( m_oSmallCaps.IsInit() )
				{
					sResult += _T("<w:smallCaps ");
					sResult += m_oSmallCaps->ToString();
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

				if ( m_oSpecVanish.IsInit() )
				{
					sResult += _T("<w:specVanish ");
					sResult += m_oSpecVanish->ToString();
					sResult += _T("/>");
				}

				if ( m_oStrike.IsInit() )
				{
					sResult += _T("<w:strike ");
					sResult += m_oStrike->ToString();
					sResult += _T("/>");
				}

				if ( m_oSz.IsInit() )
				{
					sResult += _T("<w:sz ");
					sResult += m_oSz->ToString();
					sResult += _T("/>");
				}

				if ( m_oSzCs.IsInit() )
				{
					sResult += _T("<w:szCs ");
					sResult += m_oSzCs->ToString();
					sResult += _T("/>");
				}

				if ( m_oU.IsInit() )
				{
					sResult += _T("<w:u ");
					sResult += m_oU->ToString();
					sResult += _T("/>");
				}

				if ( m_oVanish.IsInit() )
				{
					sResult += _T("<w:vanish ");
					sResult += m_oVanish->ToString();
					sResult += _T("/>");
				}

				if ( m_oVertAlign.IsInit() )
				{
					sResult += _T("<w:vertAlign ");
					sResult += m_oVertAlign->ToString();
					sResult += _T("/>");
				}

				if ( m_oW.IsInit() )
				{
					sResult += _T("<w:vertAlign ");
					sResult += m_oW->ToString();
					sResult += _T("/>");
				}

				if ( m_oWebHidden.IsInit() )
				{
					sResult += _T("<w:webHidden ");
					sResult += m_oWebHidden->ToString();
					sResult += _T("/>");
				}

				sResult += _T("</w:rPr>");

				return sResult;
			}


			virtual EElementType getType() const
			{
				return et_w_rPr;
			}

		public:

			static const CRunProperty Merge(const CRunProperty& oPrev, const CRunProperty& oCurrent)
			{
				CRunProperty oProperties;
				oProperties.m_oBold            = Merge( oPrev.m_oBold,            oCurrent.m_oBold );
				oProperties.m_oBoldCs          = Merge( oPrev.m_oBoldCs,          oCurrent.m_oBoldCs );
				oProperties.m_oBdr             = Merge( oPrev.m_oBdr,             oCurrent.m_oBdr );
				oProperties.m_oCaps            = Merge( oPrev.m_oCaps,            oCurrent.m_oCaps );
				oProperties.m_oColor           = Merge( oPrev.m_oColor,           oCurrent.m_oColor );
				oProperties.m_oCs              = Merge( oPrev.m_oCs,              oCurrent.m_oCs );
				oProperties.m_oDStrike         = Merge( oPrev.m_oDStrike,         oCurrent.m_oDStrike );
				oProperties.m_oEastAsianLayout = Merge( oPrev.m_oEastAsianLayout, oCurrent.m_oEastAsianLayout );
				oProperties.m_oEffect          = Merge( oPrev.m_oEffect,          oCurrent.m_oEffect );
				oProperties.m_oEm              = Merge( oPrev.m_oEm,              oCurrent.m_oEm );
				oProperties.m_oEmboss          = Merge( oPrev.m_oEmboss,          oCurrent.m_oEmboss );
				oProperties.m_oFitText         = Merge( oPrev.m_oFitText,         oCurrent.m_oFitText );
				oProperties.m_oHighlight       = Merge( oPrev.m_oHighlight,       oCurrent.m_oHighlight );
				oProperties.m_oItalic          = Merge( oPrev.m_oItalic,          oCurrent.m_oItalic );
				oProperties.m_oItalicCs        = Merge( oPrev.m_oItalicCs,        oCurrent.m_oItalicCs );
				oProperties.m_oImprint         = Merge( oPrev.m_oImprint,         oCurrent.m_oImprint );
				oProperties.m_oKern            = Merge( oPrev.m_oKern,            oCurrent.m_oKern );
				oProperties.m_oLang            = Merge( oPrev.m_oLang,            oCurrent.m_oLang );
				oProperties.m_oNoProof         = Merge( oPrev.m_oNoProof,         oCurrent.m_oNoProof );
				oProperties.m_oMath            = Merge( oPrev.m_oMath,            oCurrent.m_oMath );
				oProperties.m_oOutline         = Merge( oPrev.m_oOutline,         oCurrent.m_oOutline );
				oProperties.m_oPosition        = Merge( oPrev.m_oPosition,        oCurrent.m_oPosition );
				oProperties.m_oRFonts          = Merge( oPrev.m_oRFonts,          oCurrent.m_oRFonts );
				oProperties.m_oRStyle          = Merge( oPrev.m_oRStyle,          oCurrent.m_oRStyle );
				oProperties.m_oRtL             = Merge( oPrev.m_oRtL,             oCurrent.m_oRtL );
				oProperties.m_oShadow          = Merge( oPrev.m_oShadow,          oCurrent.m_oShadow );
				oProperties.m_oShd             = Merge( oPrev.m_oShd,             oCurrent.m_oShd );
				oProperties.m_oSmallCaps       = Merge( oPrev.m_oSmallCaps,       oCurrent.m_oSmallCaps );
				oProperties.m_oSnapToGrid      = Merge( oPrev.m_oSnapToGrid,      oCurrent.m_oSnapToGrid );
				oProperties.m_oSpacing         = Merge( oPrev.m_oSpacing,         oCurrent.m_oSpacing );
				oProperties.m_oSpecVanish      = Merge( oPrev.m_oSpecVanish,      oCurrent.m_oSpecVanish );
				oProperties.m_oStrike          = Merge( oPrev.m_oStrike,          oCurrent.m_oStrike );
				oProperties.m_oSz              = Merge( oPrev.m_oSz,              oCurrent.m_oSz );
				oProperties.m_oSzCs            = Merge( oPrev.m_oSzCs,            oCurrent.m_oSzCs );
				oProperties.m_oU               = Merge( oPrev.m_oU,               oCurrent.m_oU );
				oProperties.m_oVanish          = Merge( oPrev.m_oVanish,          oCurrent.m_oVanish );
				oProperties.m_oVertAlign       = Merge( oPrev.m_oVertAlign,       oCurrent.m_oVertAlign );
				oProperties.m_oW               = Merge( oPrev.m_oW,               oCurrent.m_oW );
				oProperties.m_oWebHidden       = Merge( oPrev.m_oWebHidden,       oCurrent.m_oWebHidden );

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
			const bool IsSimple() const
			{
				if ( m_oBold.IsInit() )
					return false;

				if ( m_oBoldCs.IsInit() )
					return false;

				if ( m_oBdr.IsInit() )
					return false;

				if ( m_oCaps.IsInit() )
					return false;

				if ( m_oColor.IsInit() )
					return false;

				if ( m_oCs.IsInit() )
					return false;

				if ( m_oDStrike.IsInit() )
					return false;

				if ( m_oEastAsianLayout.IsInit() )
					return false;

				if ( m_oEffect.IsInit() )
					return false;

				if ( m_oEm.IsInit() )
					return false;

				if ( m_oEmboss.IsInit() )
					return false;

				if ( m_oFitText.IsInit() )
					return false;

				if ( m_oHighlight.IsInit() )
					return false;

				if ( m_oItalic.IsInit() )
					return false;

				if ( m_oItalicCs.IsInit() )
					return false;

				if ( m_oImprint.IsInit() )
					return false;

				if ( m_oKern.IsInit() )
					return false;

				if ( m_oLang.IsInit() )
					return false;

				if ( m_oNoProof.IsInit() )
					return false;

				if ( m_oMath.IsInit() )
					return false;

				if ( m_oOutline.IsInit() )
					return false;

				if ( m_oPosition.IsInit() )
					return false;

				if ( m_oRFonts.IsInit() )
					return false;

				if ( m_oRStyle.IsInit() )
					return false;

				if ( m_oRtL.IsInit() )
					return false;

				if ( m_oShadow.IsInit() )
					return false;

				if ( m_oShd.IsInit() )
					return false;

				if ( m_oSmallCaps.IsInit() )
					return false;

				if ( m_oSnapToGrid.IsInit() )
					return false;

				if ( m_oSpacing.IsInit() )
					return false;

				if ( m_oSpecVanish.IsInit() )
					return false;

				if ( m_oStrike.IsInit() )
					return false;

				if ( m_oSz.IsInit() )
					return false;

				if ( m_oSzCs.IsInit() )
					return false;

				if ( m_oU.IsInit() )
					return false;

				if ( m_oVanish.IsInit() )
					return false;

				if ( m_oVertAlign.IsInit() )
					return false;

				if ( m_oW.IsInit() )
					return false;

				if ( m_oWebHidden.IsInit() )
					return false;

				return true;
			}


		public:

			bool                                                     m_bRPRChange; 

			nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue> > m_oBold;
			nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue> > m_oBoldCs;
			nullable<ComplexTypes::Word::CBorder                         > m_oBdr;
			nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue> > m_oCaps;
			nullable<ComplexTypes::Word::CColor                          > m_oColor;
			nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue> > m_oCs;
			nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue> > m_oDStrike;
			nullable<ComplexTypes::Word::CEastAsianLayout                > m_oEastAsianLayout;
			nullable<ComplexTypes::Word::CTextEffect                     > m_oEffect;
			nullable<ComplexTypes::Word::CEm                             > m_oEm;
			nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue> > m_oEmboss;
			nullable<ComplexTypes::Word::CFitText                        > m_oFitText;
			nullable<ComplexTypes::Word::CHighlight                      > m_oHighlight;
			nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue> > m_oItalic;
			nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue> > m_oItalicCs;
			nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue> > m_oImprint;
			nullable<ComplexTypes::Word::CHpsMeasure                     > m_oKern;
			nullable<ComplexTypes::Word::CLanguage                       > m_oLang;
			nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue> > m_oNoProof;
			nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue> > m_oMath;
			nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue> > m_oOutline;
			nullable<ComplexTypes::Word::CSignedHpsMeasure               > m_oPosition;
			nullable<ComplexTypes::Word::CFonts                          > m_oRFonts;
			nullable<OOX::Logic::CRPrChange                              > m_oRPrChange;
			nullable<ComplexTypes::Word::CString_                        > m_oRStyle;
			nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue> > m_oRtL;
			nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue> > m_oShadow;
			nullable<ComplexTypes::Word::CShading                        > m_oShd;
			nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue> > m_oSmallCaps;
			nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue> > m_oSnapToGrid;
			nullable<ComplexTypes::Word::CSignedTwipsMeasure             > m_oSpacing;
			nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue> > m_oSpecVanish;
			nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue> > m_oStrike;
			nullable<ComplexTypes::Word::CHpsMeasure                     > m_oSz;
			nullable<ComplexTypes::Word::CHpsMeasure                     > m_oSzCs;
			nullable<ComplexTypes::Word::CUnderline                      > m_oU;
			nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue> > m_oVanish;
			nullable<ComplexTypes::Word::CVerticalAlignRun               > m_oVertAlign;
			nullable<ComplexTypes::Word::CTextScale                      > m_oW;
			nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue> > m_oWebHidden;
		};

	} 
} 

#endif // OOX_LOGIC_RUN_PROPERTY_INCLUDE_H_