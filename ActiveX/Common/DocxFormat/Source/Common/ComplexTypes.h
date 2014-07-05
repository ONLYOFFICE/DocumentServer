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

#include "../DocxFormat/WritingElement.h"
#include "../Base/Nullable.h"

#include "SimpleTypes_Word.h"
#include "SimpleTypes_Shared.h"
#include "SimpleTypes_Drawing.h"

namespace ComplexTypes
{
#define ComplexTypes_AdditionConstructors(Class) \
	Class(XmlUtils::CXmlNode& oNode)\
	{\
		FromXML( oNode );\
	}\
	Class(XmlUtils::CXmlLiteReader& oReader)\
	{\
		FromXML( oReader );\
	}\
	const Class& operator =(const XmlUtils::CXmlNode &oNode)\
	{\
		FromXML( (XmlUtils::CXmlNode &)oNode );\
		return *this;\
	}\
	const Class& operator =(const XmlUtils::CXmlLiteReader& oReader)\
	{\
		FromXML( (XmlUtils::CXmlLiteReader&)oReader );\
		return *this;\
	}

#define ComplexTypes_WriteAttribute( sStartString, oValue ) \
	if ( oValue.IsInit() )\
	{\
		sResult += sStartString;\
		sResult += oValue->ToString();\
		sResult += _T("\" ");\
	}

#define ComplexTypes_WriteAttribute2( sStartString, oValue ) \
	if ( oValue.IsInit() )\
	{\
		sResult += sStartString;\
		sResult += oValue->GetString();\
		sResult += _T("\" ");\
	}

	class ComplexType
	{
	public:
		ComplexType(){};
		virtual ~ComplexType() {};

		virtual void    FromXML(XmlUtils::CXmlNode& oNode) = 0;
        virtual CString ToString() const                   = 0;
	};


	namespace Word
	{
		
		
		
		class CBorder : public ComplexType
		{
		public:
			ComplexTypes_AdditionConstructors(CBorder)
			CBorder()
			{
			}
			virtual ~CBorder()
			{
			}

			virtual void    FromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("w:color"),      m_oColor );
				oNode.ReadAttributeBase( _T("w:frame"),      m_oFrame );
				oNode.ReadAttributeBase( _T("w:shadow"),     m_oShadow );
				oNode.ReadAttributeBase( _T("w:space"),      m_oSpace );
				oNode.ReadAttributeBase( _T("w:sz"),         m_oSz );
				oNode.ReadAttributeBase( _T("w:themeColor"), m_oThemeColor );
				oNode.ReadAttributeBase( _T("w:themeShade"), m_oThemeShade );
				oNode.ReadAttributeBase( _T("w:themeTint"),  m_oThemeTint );
				oNode.ReadAttributeBase( _T("w:val"),        m_oVal );
			}
			virtual void    FromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )

				WritingElement_ReadAttributes_Read_if     ( oReader, _T("w:color"),      m_oColor )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:frame"),      m_oFrame )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:shadow"),     m_oShadow )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:space"),      m_oSpace )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:sz"),         m_oSz )
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

				if ( m_oFrame.IsInit() )
				{
					sResult += "w:frame=\"";
					sResult += m_oFrame->ToString();
					sResult += "\" ";
				}

				if ( m_oShadow.IsInit() )
				{
					sResult += "w:shadow=\"";
					sResult += m_oShadow->ToString();
					sResult += "\" ";
				}

				if ( m_oSpace.IsInit() )
				{
					sResult += "w:space=\"";
					sResult += m_oSpace->ToString();
					sResult += "\" ";
				}

				if ( m_oSz.IsInit() )
				{
					sResult += "w:sz=\"";
					sResult += m_oSz->ToString();
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

			nullable<SimpleTypes::CHexColor<>           > m_oColor;
			nullable<SimpleTypes::COnOff<>              > m_oFrame;
			nullable<SimpleTypes::COnOff<>              > m_oShadow;
			nullable<SimpleTypes::CPointMeasure<>       > m_oSpace;
			nullable<SimpleTypes::CEighthPointMeasure<> > m_oSz;
			nullable<SimpleTypes::CThemeColor<>         > m_oThemeColor;
			nullable<SimpleTypes::CUcharHexNumber<>     > m_oThemeShade;
			nullable<SimpleTypes::CUcharHexNumber<>     > m_oThemeTint;
			nullable<SimpleTypes::CBorder<>             > m_oVal;

		};

		
		
		
		class CLanguage : public ComplexType
		{
		public:
			ComplexTypes_AdditionConstructors(CLanguage)
			CLanguage()
			{
			}
			virtual ~CLanguage()
			{
			}

			virtual void    FromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("w:bidi"),     m_oBidi );
				oNode.ReadAttributeBase( _T("w:eastAsia"), m_oEastAsia );
				oNode.ReadAttributeBase( _T("w:val"),      m_oVal );
			}
			virtual void    FromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )

				WritingElement_ReadAttributes_Read_if     ( oReader, _T("w:bidi"),     m_oBidi )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:eastAsia"), m_oEastAsia )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:val"),      m_oVal )

				WritingElement_ReadAttributes_End( oReader )
			}
			virtual CString ToString() const
			{			
				CString sResult;

				if ( m_oBidi.IsInit() )
				{
					sResult += "w:bidi=\"";
					sResult += m_oBidi->ToString();
					sResult += "\" ";
				}

				if ( m_oEastAsia.IsInit() )
				{
					sResult += "w:eastAsia=\"";
					sResult += m_oEastAsia->ToString();
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

			nullable<SimpleTypes::CLang> m_oBidi;
			nullable<SimpleTypes::CLang> m_oEastAsia;
			nullable<SimpleTypes::CLang> m_oVal;
		};

		
		
		
		class CLang : public ComplexType
		{
		public:
			ComplexTypes_AdditionConstructors(CLang)
			CLang()
			{
			}
			virtual ~CLang()
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

			nullable<SimpleTypes::CLang> m_oVal;
		};

		
		
		
		class CShading : public ComplexType
		{
		public:
			ComplexTypes_AdditionConstructors(CShading)
			CShading()
			{
			}
			virtual ~CShading()
			{
			}

			virtual void    FromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("w:color"),          m_oColor );
				oNode.ReadAttributeBase( _T("w:fill"),           m_oFill );
				oNode.ReadAttributeBase( _T("w:themeColor"),     m_oThemeColor );
				oNode.ReadAttributeBase( _T("w:themeFill"),      m_oThemeFill );
				oNode.ReadAttributeBase( _T("w:themeFillShade"), m_oThemeFillShade );
				oNode.ReadAttributeBase( _T("w:themeFillTint"),  m_oThemeFillTint );
				oNode.ReadAttributeBase( _T("w:themeShade"),     m_oThemeShade );
				oNode.ReadAttributeBase( _T("w:themeTint"),      m_oThemeTint );
				oNode.ReadAttributeBase( _T("w:val"),            m_oVal );
			}
			virtual void    FromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )

				WritingElement_ReadAttributes_Read_if     ( oReader, _T("w:color"),          m_oColor )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:fill"),           m_oFill )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:themeColor"),     m_oThemeColor )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:themeFill"),      m_oThemeFill )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:themeFillShade"), m_oThemeFillShade )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:themeFillTint"),  m_oThemeFillTint )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:themeShade"),     m_oThemeShade )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:themeTint"),      m_oThemeTint )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:val"),            m_oVal )
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

				if ( m_oFill.IsInit() )
				{
					sResult += "w:fill=\"";
					sResult += m_oFill->ToString();
					sResult += "\" ";
				}

				if ( m_oThemeColor.IsInit() )
				{
					sResult += "w:themeColor=\"";
					sResult += m_oThemeColor->ToString();
					sResult += "\" ";
				}

				if ( m_oThemeFill.IsInit() )
				{
					sResult += "w:themeFill=\"";
					sResult += m_oThemeFill->ToString();
					sResult += "\" ";
				}

				if ( m_oThemeFillShade.IsInit() )
				{
					sResult += "w:themeFillShade=\"";
					sResult += m_oThemeFillShade->ToString();
					sResult += "\" ";
				}

				if ( m_oThemeFillTint.IsInit() )
				{
					sResult += "w:themeFillTint=\"";
					sResult += m_oThemeFillTint->ToString();
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

			nullable<SimpleTypes::CHexColor<>           > m_oColor;
			nullable<SimpleTypes::CHexColor<>           > m_oFill;
			nullable<SimpleTypes::CThemeColor<>         > m_oThemeColor;
			nullable<SimpleTypes::CThemeColor<>         > m_oThemeFill;
			nullable<SimpleTypes::CUcharHexNumber<>     > m_oThemeFillShade;
			nullable<SimpleTypes::CUcharHexNumber<>     > m_oThemeFillTint;
			nullable<SimpleTypes::CUcharHexNumber<>     > m_oThemeShade;
			nullable<SimpleTypes::CUcharHexNumber<>     > m_oThemeTint;
			nullable<SimpleTypes::CShd<>                > m_oVal;

		};


		
		
		
		class CTblWidth : public ComplexType
		{
		public:
			ComplexTypes_AdditionConstructors(CTblWidth)
			CTblWidth()
			{
			}
			virtual ~CTblWidth()
			{
			}

			virtual void    FromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("w:type"), m_oType );
				oNode.ReadAttributeBase( _T("w:w"),    m_oW );
			}
			virtual void    FromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )

				WritingElement_ReadAttributes_Read_if     ( oReader, _T("w:type"), m_oType )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:w"),    m_oW )
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

				if ( m_oW.IsInit() )
				{
					sResult += "w:w=\"";
					sResult += m_oW->ToString();
					sResult += "\" ";
				}

				return sResult;
			}

		public:

			nullable<SimpleTypes::CTblWidth<>            > m_oType;
			nullable<SimpleTypes::CDecimalNumberOrPercent> m_oW;

		};


		
		
		
		class COnOff : public ComplexType
		{
		public:
			ComplexTypes_AdditionConstructors(COnOff)
			COnOff()
			{
			}
			virtual ~COnOff()
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

			nullable<SimpleTypes::COnOff<>> m_oVal;

		};

		template<SimpleTypes::EOnOff eDefValue = SimpleTypes::onoffTrue>
		class COnOff2 : public ComplexType
		{
		public:
			ComplexTypes_AdditionConstructors(COnOff2)
				COnOff2()
			{
			}
			virtual ~COnOff2()
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

				sResult += "w:val=\"";
				sResult += m_oVal.ToString();
				sResult += "\" ";

				return sResult;
			}

		public:

			SimpleTypes::COnOff<eDefValue> m_oVal;

		};

		
		
		
		class CString_ : public ComplexType
		{
		public:
			ComplexTypes_AdditionConstructors(CString_)
			CString_()
			{
			}
			virtual ~CString_()
			{
			}

			virtual void    FromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("w:val"), m_sVal );
			}
			virtual void    FromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_ReadSingle( oReader, _T("w:val"), m_sVal )
				WritingElement_ReadAttributes_End( oReader )
			}
			virtual CString ToString() const
			{
				CString sResult;

				if ( m_sVal.IsInit() )
				{
					sResult += "w:val=\"";
					sResult += m_sVal->GetString();
					sResult += "\" ";
				}

				return sResult;
			}
			CString ToString2() const
			{
				CString sResult;

				if ( m_sVal.IsInit() )
					sResult += m_sVal.get();

				return sResult;
			}

		public:

			nullable<CString> m_sVal;
		};
		
		
		
		class CSignedTwipsMeasure : public ComplexType
		{
		public:
			ComplexTypes_AdditionConstructors(CSignedTwipsMeasure)
			CSignedTwipsMeasure()
			{
			}
			virtual ~CSignedTwipsMeasure()
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

			nullable<SimpleTypes::CSignedTwipsMeasure> m_oVal;
		};

		
		
		
		class CHpsMeasure : public ComplexType
		{
		public:
			ComplexTypes_AdditionConstructors(CHpsMeasure)
			CHpsMeasure()
			{
			}
			virtual ~CHpsMeasure()
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

			nullable<SimpleTypes::CHpsMeasure> m_oVal;
		};
		
		
		
		class CColor : public ComplexType
		{
		public:
			ComplexTypes_AdditionConstructors(CColor)
			CColor()
			{
			}
			virtual ~CColor()
			{
			}

			virtual void    FromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("w:themeColor"), m_oThemeColor );
				oNode.ReadAttributeBase( _T("w:themeShade"), m_oThemeShade );
				oNode.ReadAttributeBase( _T("w:themeTint"),  m_oThemeTint );
				oNode.ReadAttributeBase( _T("w:val"),        m_oVal );
			}
			virtual void    FromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )

				WritingElement_ReadAttributes_Read_if     ( oReader, _T("w:themeColor"), m_oThemeColor )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:themeShade"), m_oThemeShade )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:themeTint"),  m_oThemeTint )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:val"),        m_oVal )
				
				WritingElement_ReadAttributes_End( oReader )
			}
			virtual CString ToString() const
			{
				CString sResult;

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

				sResult;

				return sResult;
			}

		public:

			nullable<SimpleTypes::CThemeColor<>         > m_oThemeColor;
			nullable<SimpleTypes::CUcharHexNumber<>     > m_oThemeShade;
			nullable<SimpleTypes::CUcharHexNumber<>     > m_oThemeTint;
			nullable<SimpleTypes::CHexColor<>           > m_oVal;
		};
		
		
		
		class CSignedHpsMeasure : public ComplexType
		{
		public:
			ComplexTypes_AdditionConstructors(CSignedHpsMeasure)
			CSignedHpsMeasure()
			{
			}
			virtual ~CSignedHpsMeasure()
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

			nullable<SimpleTypes::CSignedHpsMeasure> m_oVal;
		};
		
		
		
		class CNumFmt : public ComplexType
		{
		public:
			ComplexTypes_AdditionConstructors(CNumFmt)
			CNumFmt()
			{
			}
			virtual ~CNumFmt()
			{
			}

			virtual void    FromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("w:format"), m_sFormat );
				oNode.ReadAttributeBase( _T("w:val"),    m_oVal );
			}
			virtual void    FromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("w:format"), m_sFormat )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:val"),    m_oVal )
				WritingElement_ReadAttributes_End( oReader )
			}
			virtual CString ToString() const
			{
				CString sResult;

				if ( m_sFormat.IsInit() )
				{
					sResult += "w:format=\"";
					sResult += m_sFormat->GetString();
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

			nullable<CString                      > m_sFormat;
			nullable<SimpleTypes::CNumberFormat<> > m_oVal;
		};


		
		
		
		class CNumRestart : public ComplexType
		{
		public:
			ComplexTypes_AdditionConstructors(CNumRestart)
			CNumRestart()
			{
			}
			virtual ~CNumRestart()
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

			nullable<SimpleTypes::CRestartNumber<> > m_oVal;
		};


		
		
		
		class CDecimalNumber : public ComplexType
		{
		public:
			ComplexTypes_AdditionConstructors(CDecimalNumber)
			CDecimalNumber()
			{
			}
			virtual ~CDecimalNumber()
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

			nullable<SimpleTypes::CDecimalNumber<> > m_oVal;
		};
		
		
		
		class CDecimalNumberOrPrecent : public ComplexType
		{
		public:
			ComplexTypes_AdditionConstructors(CDecimalNumberOrPrecent)
			CDecimalNumberOrPrecent()
			{
			}
			virtual ~CDecimalNumberOrPrecent()
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

			nullable<SimpleTypes::CDecimalNumberOrPercent> m_oVal;
		};
		
		
		
		class CRel : public ComplexType
		{
		public:
			ComplexTypes_AdditionConstructors(CRel)
			CRel()
			{
			}
			virtual ~CRel()
			{
			}

			virtual void    FromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("r:id"), m_oId );
			}
			virtual void    FromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_ReadSingle( oReader, _T("r:id"), m_oId )
				WritingElement_ReadAttributes_End( oReader )
			}
			virtual CString ToString() const
			{
				CString sResult;

				if ( m_oId.IsInit() )
				{
					sResult += "r:id=\"";
					sResult += m_oId->ToString();
					sResult += "\" ";
				}

				return sResult;
			}

		public:

			nullable<SimpleTypes::CRelationshipId > m_oId;
		};

		
		
		
		class CTextDirection : public ComplexType
		{
		public:
			ComplexTypes_AdditionConstructors(CTextDirection)
			CTextDirection()
			{
			}
			virtual ~CTextDirection()
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

			nullable<SimpleTypes::CTextDirection<> > m_oVal;
		};


		
		
		
		class CVerticalJc : public ComplexType
		{
		public:
			ComplexTypes_AdditionConstructors(CVerticalJc)
			CVerticalJc()
			{
			}
			virtual ~CVerticalJc()
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

			nullable<SimpleTypes::CVerticalJc<> > m_oVal;
		};


		
		
		
		class CCnf : public ComplexType
		{
		public:
			ComplexTypes_AdditionConstructors(CCnf)
			CCnf()
			{
			}
			virtual ~CCnf()
			{
			}

			virtual void    FromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("w:evenHBand"),           m_oEvenHBand );
				oNode.ReadAttributeBase( _T("w:evenVBand"),           m_oEvenVBand );
				oNode.ReadAttributeBase( _T("w:firstColumn"),         m_oFirstColumn );
				oNode.ReadAttributeBase( _T("w:firstRow"),            m_oFirstRow );
				oNode.ReadAttributeBase( _T("w:firstRowFirstColumn"), m_oFirstRowFirstColumn );
				oNode.ReadAttributeBase( _T("w:firstRowLastColumn"),  m_oFirstRowLastColumn );
				oNode.ReadAttributeBase( _T("w:lastColumn"),          m_oLastColumn );
				oNode.ReadAttributeBase( _T("w:lastRow"),             m_oLastRow );
				oNode.ReadAttributeBase( _T("w:lastRowFirstColumn"),  m_oLastRowFirstColumn );
				oNode.ReadAttributeBase( _T("w:lastRowLastColumn"),   m_oLastRowLastColumn );
				oNode.ReadAttributeBase( _T("w:oddHBand"),            m_oOddHBand );
				oNode.ReadAttributeBase( _T("w:oddVBand"),            m_oOddVBand );
				oNode.ReadAttributeBase( _T("w:val"),                 m_oVal );
			}
			virtual void    FromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("w:evenHBand"),           m_oEvenHBand )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:evenVBand"),           m_oEvenVBand )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:firstColumn"),         m_oFirstColumn )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:firstRow"),            m_oFirstRow )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:firstRowFirstColumn"), m_oFirstRowFirstColumn )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:firstRowLastColumn"),  m_oFirstRowLastColumn )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:lastColumn"),          m_oLastColumn )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:lastRow"),             m_oLastRow )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:lastRowFirstColumn"),  m_oLastRowFirstColumn )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:lastRowLastColumn"),   m_oLastRowLastColumn )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:oddHBand"),            m_oOddHBand )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:oddVBand"),            m_oOddVBand )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:val"),                 m_oVal )
				WritingElement_ReadAttributes_End( oReader )
			}
			virtual CString ToString() const
			{
				CString sResult;

				if ( m_oEvenHBand.IsInit() )
				{
					sResult += "w:evenHBand=\"";
					sResult += m_oEvenHBand->ToString();
					sResult += "\" ";
				}

				if ( m_oEvenVBand.IsInit() )
				{
					sResult += "w:evenVBand=\"";
					sResult += m_oEvenVBand->ToString();
					sResult += "\" ";
				}

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

				if ( m_oFirstRowFirstColumn.IsInit() )
				{
					sResult += "w:firstRowFirstColumn=\"";
					sResult += m_oFirstRowFirstColumn->ToString();
					sResult += "\" ";
				}

				if ( m_oFirstRowLastColumn.IsInit() )
				{
					sResult += "w:firstRowLastColumn=\"";
					sResult += m_oFirstRowLastColumn->ToString();
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

				if ( m_oLastRowFirstColumn.IsInit() )
				{
					sResult += "w:lastRowFirstColumn=\"";
					sResult += m_oLastRowFirstColumn->ToString();
					sResult += "\" ";
				}

				if ( m_oLastRowLastColumn.IsInit() )
				{
					sResult += "w:lastRowLastColumn=\"";
					sResult += m_oLastRowLastColumn->ToString();
					sResult += "\" ";
				}

				if ( m_oOddHBand.IsInit() )
				{
					sResult += "w:oddHBand=\"";
					sResult += m_oOddHBand->ToString();
					sResult += "\" ";
				}

				if ( m_oOddVBand.IsInit() )
				{
					sResult += "w:oddVBand=\"";
					sResult += m_oOddVBand->ToString();
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

			nullable<SimpleTypes::COnOff<> > m_oEvenHBand;
			nullable<SimpleTypes::COnOff<> > m_oEvenVBand;
			nullable<SimpleTypes::COnOff<> > m_oFirstColumn;
			nullable<SimpleTypes::COnOff<> > m_oFirstRow;
			nullable<SimpleTypes::COnOff<> > m_oFirstRowFirstColumn;
			nullable<SimpleTypes::COnOff<> > m_oFirstRowLastColumn;
			nullable<SimpleTypes::COnOff<> > m_oLastColumn;
			nullable<SimpleTypes::COnOff<> > m_oLastRow;
			nullable<SimpleTypes::COnOff<> > m_oLastRowFirstColumn;
			nullable<SimpleTypes::COnOff<> > m_oLastRowLastColumn;
			nullable<SimpleTypes::COnOff<> > m_oOddHBand;
			nullable<SimpleTypes::COnOff<> > m_oOddVBand;
			nullable<SimpleTypes::CCnf<>   > m_oVal;
		};
		
		
		
		class CJc : public ComplexType
		{
		public:
			ComplexTypes_AdditionConstructors(CJc)
			CJc()
			{
			}
			virtual ~CJc()
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

				sResult;

				return sResult;
			}

		public:

			nullable<SimpleTypes::CJc<> > m_oVal;
		};
		
		
		
		class CTrackChange : public ComplexType
		{
		public:
			ComplexTypes_AdditionConstructors(CTrackChange)
			CTrackChange()
			{
			}
			virtual ~CTrackChange()
			{
			}

			virtual void    FromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("w:author"), m_sAuthor );
				oNode.ReadAttributeBase( _T("w:date"),   m_oDate );
				oNode.ReadAttributeBase( _T("w:id"),     m_oID );
			}
			virtual void    FromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("w:author"), m_sAuthor )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:date"),   m_oDate  )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:id"),     m_oID )
				WritingElement_ReadAttributes_End( oReader )
			}
			virtual CString ToString() const
			{
				CString sResult;

				if ( m_sAuthor.IsInit() )
				{
					sResult += "w:author=\"";
					sResult += m_sAuthor->GetString();
					sResult += "\" ";
				}

				if ( m_oDate.IsInit() )
				{
					sResult += "w:date=\"";
					sResult += m_oDate->ToString();
					sResult += "\" ";
				}

				if ( m_oID.IsInit() )
				{
					sResult += "w:id=\"";
					sResult += m_oID->ToString();
					sResult += "\" ";
				}

				return sResult;
			}

		public:

			nullable<CString                       > m_sAuthor;
			nullable<SimpleTypes::CDateTime        > m_oDate;
			nullable<SimpleTypes::CDecimalNumber<> > m_oID;

		};
		
		
		
		class CLongHexNumber : public ComplexType
		{
		public:
			ComplexTypes_AdditionConstructors(CLongHexNumber)
			CLongHexNumber()
			{
			}
			virtual ~CLongHexNumber()
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

			nullable<SimpleTypes::CLongHexNumber<>> m_oVal;

		};
		
		
		
		class CUnsignedDecimalNumber : public ComplexType
		{
		public:
			ComplexTypes_AdditionConstructors(CUnsignedDecimalNumber)
			CUnsignedDecimalNumber()
			{
			}
			virtual ~CUnsignedDecimalNumber()
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

			nullable<SimpleTypes::CUnsignedDecimalNumber<> > m_oVal;
		};

		
		
		
		class CTwipsMeasure : public ComplexType
		{
		public:
			ComplexTypes_AdditionConstructors(CTwipsMeasure)
			CTwipsMeasure()
			{
			}
			virtual ~CTwipsMeasure()
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

			nullable<SimpleTypes::CTwipsMeasure> m_oVal;
		};

		
		
		
		class CEmpty : public ComplexType
		{
		public:
			ComplexTypes_AdditionConstructors(CEmpty)
			CEmpty()
			{
			}
			virtual ~CEmpty()
			{
			}

			virtual void    FromXML(XmlUtils::CXmlNode& oNode)
			{
			}
			virtual void    FromXML(XmlUtils::CXmlLiteReader& oReader)
			{
			}
			virtual CString ToString() const
			{
				return _T("");
			}
		};

		
		
		
		class CEdnPos : public ComplexType
		{
		public:
			ComplexTypes_AdditionConstructors(CEdnPos)
			CEdnPos()
			{
			}
			virtual ~CEdnPos()
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

			nullable<SimpleTypes::CEdnPos<> > m_oVal;
		};

		
		
		
		class CFtnPos : public ComplexType
		{
		public:
			ComplexTypes_AdditionConstructors(CFtnPos)
			CFtnPos()
			{
			}
			virtual ~CFtnPos()
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

			nullable<SimpleTypes::CFtnPos<> > m_oVal;
		};

	} 
    namespace Drawing
    {
        
        
        
        class CPoint2D : public ComplexType
		{
		public:
			ComplexTypes_AdditionConstructors(CPoint2D)
			CPoint2D()
			{
			}
			virtual ~CPoint2D()
			{
			}

		public:
			virtual void    FromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("x"), m_oX );
				oNode.ReadAttributeBase( _T("y"), m_oY );
			}
			virtual void    FromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("x"), m_oX )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("y"), m_oY )
				WritingElement_ReadAttributes_End( oReader )
			}
			virtual CString ToString() const
			{
				CString sResult;

				sResult += _T("x=\"") + m_oX.ToString() + _T("\" ");
				sResult += _T("y=\"") + m_oY.ToString() + _T("\" ");

				return sResult;
			}

		public:
			SimpleTypes::CCoordinate m_oX;
			SimpleTypes::CCoordinate m_oY;

		};
        
        
        
        class CPositiveSize2D : public ComplexType
		{
		public:
			ComplexTypes_AdditionConstructors(CPositiveSize2D)
			CPositiveSize2D()
			{
			}
			virtual ~CPositiveSize2D()
			{
			}

		public:

			virtual void    FromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("cx"), m_oCx );
				oNode.ReadAttributeBase( _T("cy"), m_oCy );
			}
			virtual void    FromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("cx"), m_oCx )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("cy"), m_oCy )
				WritingElement_ReadAttributes_End( oReader )
			}

			virtual CString ToString() const
			{
				CString sResult;

				sResult += _T("cx=\"") + m_oCx.ToString() + _T("\" ");
				sResult += _T("cy=\"") + m_oCy.ToString() + _T("\" ");

				return sResult;
			}
		public:
			
			SimpleTypes::CPositiveCoordinate<> m_oCx;
			SimpleTypes::CPositiveCoordinate<> m_oCy;

		}; 
    }
} 
