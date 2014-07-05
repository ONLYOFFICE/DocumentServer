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
#ifndef OOX_VML_OFFICE_INCLUDE_H_
#define OOX_VML_OFFICE_INCLUDE_H_

#include "../../Base/Nullable.h"

#include "../../Common/SimpleTypes_Shared.h"
#include "../../Common/SimpleTypes_Word.h"
#include "../../Common/SimpleTypes_Vml.h"

#include "../WritingElement.h"
#include "../RId.h"

namespace OOX
{
	namespace VmlOffice
	{
		
		
		
		class CStrokeChild : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CStrokeChild)
			CStrokeChild()
			{
				m_eType = et_Unknown;
			}
			virtual ~CStrokeChild()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				m_eType = et_Unknown;
				
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				m_eType = et_Unknown;
				CWCharWrapper sName = oReader.GetName();

				if ( _T("o:bottom") == sName )
					m_eType = et_o_bottom;
				else if ( _T("o:column") == sName )
					m_eType = et_o_column;
				else if ( _T("o:left") == sName )
					m_eType = et_o_left;
				else if ( _T("o:right") == sName )
					m_eType = et_o_right;
				else if ( _T("o:top") == sName )
					m_eType = et_o_top;
				else
					return;

				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}
			virtual CString      toXML() const
			{
				CString sResult;

				switch( m_eType )
				{
				case et_o_bottom: sResult = _T("<o:bottom "); break;
				case et_o_column: sResult = _T("<o:column "); break;
				case et_o_left  : sResult = _T("<o:left ");   break;
				case et_o_right : sResult = _T("<o:right ");  break;
				case et_o_top   : sResult = _T("<o:top ");    break;
				default: return _T("");
				}

				ComplexTypes_WriteAttribute ( _T("v:ext=\""),            m_oExt );
				ComplexTypes_WriteAttribute ( _T("on=\""),               m_oOn );
				ComplexTypes_WriteAttribute2( _T("weight=\""),           m_sWeight )
				ComplexTypes_WriteAttribute ( _T("color=\""),            m_oColor )
				ComplexTypes_WriteAttribute ( _T("color2=\""),           m_oColor2 )
				ComplexTypes_WriteAttribute2( _T("opacity=\""),          m_sOpacity )
				ComplexTypes_WriteAttribute ( _T("linestyle=\""),        m_oLineStyle )
				ComplexTypes_WriteAttribute ( _T("miterlimit=\""),       m_oMiterLimit )
				ComplexTypes_WriteAttribute ( _T("joinstyle=\""),        m_oJoinStyle )
				ComplexTypes_WriteAttribute ( _T("endcap=\""),           m_oEndCap )
				ComplexTypes_WriteAttribute ( _T("dashstyle=\""),        m_oDashStyle )
				ComplexTypes_WriteAttribute ( _T("insetpen=\""),         m_oInsetPen )
				ComplexTypes_WriteAttribute ( _T("filltype=\""),         m_oFillType )
				ComplexTypes_WriteAttribute2( _T("src=\""),              m_sSrc )
				ComplexTypes_WriteAttribute ( _T("imageaspect=\""),      m_oImageAspect )
				ComplexTypes_WriteAttribute2( _T("imagesize=\""),        m_sImageSize )
				ComplexTypes_WriteAttribute ( _T("imagealignshape=\""),  m_oImageAlignShape )
				ComplexTypes_WriteAttribute ( _T("startarrow=\""),       m_oStartArrow )
				ComplexTypes_WriteAttribute ( _T("startarrowwidth=\""),  m_oStartArrowWidth )
				ComplexTypes_WriteAttribute ( _T("startarrowlength=\""), m_oStartArrowLength )
				ComplexTypes_WriteAttribute ( _T("endarrow=\""),         m_oEndArrow )
				ComplexTypes_WriteAttribute ( _T("endarrowwidth=\""),    m_oEndArrowWidth )
				ComplexTypes_WriteAttribute ( _T("endarrowlength=\""),   m_oEndArrowLength )
				ComplexTypes_WriteAttribute2( _T("o:href=\""),           m_sHref )
				ComplexTypes_WriteAttribute2( _T("althref=\""),          m_sAlthref )
				ComplexTypes_WriteAttribute2( _T("o:title=\""),          m_sTitle )
				ComplexTypes_WriteAttribute ( _T("o:forcedash=\""),      m_oForceDash )

				sResult += _T("/>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return m_eType;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("althref"),          m_sAlthref )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("color"),            m_oColor )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("color2"),           m_oColor2 )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("dashstyle"),        m_oDashStyle )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("endarrow"),         m_oEndArrow )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("endarrowlength"),   m_oEndArrowLength )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("endarrowwidth"),    m_oEndArrowWidth )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("endcap"),           m_oEndCap )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("v:ext"),            m_oExt )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("filltype"),         m_oFillType )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("o:forcedash"),      m_oForceDash )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("o:href"),           m_sHref )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("imagealignshape"),  m_oImageAlignShape )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("imageaspect"),      m_oImageAspect )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("imagesize"),        m_sImageSize )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("insetpen"),         m_oInsetPen )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("joinstyle"),        m_oJoinStyle )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("linestyle"),        m_oLineStyle )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("miterlimit"),       m_oMiterLimit )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("on"),               m_oOn )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("opacity"),          m_sOpacity )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("src"),              m_sSrc )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("startarrow"),       m_oStartArrow )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("startarrowlength"), m_oStartArrowLength )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("startarrowwidth"),  m_oStartArrowWidth )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("o:title"),          m_sTitle )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("weight"),           m_sWeight )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			EElementType                                m_eType;

			
			nullable<CString>                           m_sAlthref;
			nullable<SimpleTypes::CColorType<>>         m_oColor;
			nullable<SimpleTypes::CColorType<>>         m_oColor2;
			nullable<SimpleTypes::Vml::CVmlDashStyle<>> m_oDashStyle;
			nullable<SimpleTypes::CStrokeArrowType<>>   m_oEndArrow;
			nullable<SimpleTypes::CStrokeArrowLength<>> m_oEndArrowLength;
			nullable<SimpleTypes::CStrokeArrowWidth<>>  m_oEndArrowWidth;
			nullable<SimpleTypes::CStrokeEndCap<>>      m_oEndCap;
			nullable<SimpleTypes::CExt<>>               m_oExt;
			nullable<SimpleTypes::CFillType<>>          m_oFillType;
			nullable<SimpleTypes::CTrueFalse<>>         m_oForceDash;
			nullable<CString>                           m_sHref;
			nullable<SimpleTypes::CTrueFalse<>>         m_oImageAlignShape;
			nullable<SimpleTypes::CImageAspect<>>       m_oImageAspect;
			nullable<CString>                           m_sImageSize;
			nullable<SimpleTypes::CTrueFalse<>>         m_oInsetPen;
			nullable<SimpleTypes::CStrokeJoinStyle<>>   m_oJoinStyle;
			nullable<SimpleTypes::CStrokeLineStyle<>>   m_oLineStyle;
			nullable<SimpleTypes::CDecimalNumber<8>>    m_oMiterLimit;
			nullable<SimpleTypes::CTrueFalse<>>         m_oOn;
			nullable<CString>                           m_sOpacity;
			nullable<CString>                           m_sSrc;
			nullable<SimpleTypes::CStrokeArrowType<>>   m_oStartArrow;
			nullable<SimpleTypes::CStrokeArrowLength<>> m_oStartArrowLength;
			nullable<SimpleTypes::CStrokeArrowWidth<>>  m_oStartArrowWidth;
			nullable<CString>                           m_sTitle;
			nullable<CString>                           m_sWeight;

		};
		
		
		
		class CCallout : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CCallout)
			CCallout()
			{
			}
			virtual ~CCallout()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<o:callout ");

				ComplexTypes_WriteAttribute ( _T("v:ext=\""),           m_oExt )
				ComplexTypes_WriteAttribute ( _T("on=\""),              m_oOn )
				ComplexTypes_WriteAttribute ( _T("type=\""),            m_oType )
				ComplexTypes_WriteAttribute ( _T("gap=\""),             m_oGap )
				ComplexTypes_WriteAttribute ( _T("angle=\""),           m_oAngle )
				ComplexTypes_WriteAttribute ( _T("dropauto=\""),        m_oDropAuto )
				ComplexTypes_WriteAttribute ( _T("drop=\""),            m_oDrop )
				ComplexTypes_WriteAttribute ( _T("distance=\""),        m_oDistance )
				ComplexTypes_WriteAttribute ( _T("lengthspecified=\""), m_oLengthSpecified )
				ComplexTypes_WriteAttribute ( _T("length=\""),          m_oLength )
				ComplexTypes_WriteAttribute ( _T("accentbar=\""),       m_oAccentbar )
				ComplexTypes_WriteAttribute ( _T("textborder=\""),      m_oTextBorder )
				ComplexTypes_WriteAttribute ( _T("minusx=\""),          m_oMinusX )
				ComplexTypes_WriteAttribute ( _T("minusy=\""),          m_oMinusY )

				sResult += _T("/>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_o_callout;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("accentbar"),       m_oAccentbar )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("angle"),           m_oAngle )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("distance"),        m_oDistance )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("drop"),            m_oDrop )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("dropauto"),        m_oDropAuto )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("v:ext"),           m_oExt )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("gap"),             m_oGap )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("length"),          m_oLength )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("lengthspecified"), m_oLengthSpecified )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("minusx"),          m_oMinusX )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("minusy"),          m_oMinusY )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("on"),              m_oOn )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("textborder"),      m_oTextBorder )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("type"),            m_oType )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			
			nullable<SimpleTypes::CTrueFalse<>>           m_oAccentbar;
			nullable<SimpleTypes::CVmlAngle<>>            m_oAngle;
			nullable<SimpleTypes::CCoordinate>            m_oDistance;
			nullable<SimpleTypes::CCalloutDrop>           m_oDrop;
			nullable<SimpleTypes::CTrueFalse<>>           m_oDropAuto;
			nullable<SimpleTypes::CExt<>>                 m_oExt;
			nullable<SimpleTypes::CCoordinate>            m_oGap;
			nullable<SimpleTypes::CCoordinate>            m_oLength;
			nullable<SimpleTypes::CTrueFalse<>>           m_oLengthSpecified;
			nullable<SimpleTypes::CTrueFalse<>>           m_oMinusX;
			nullable<SimpleTypes::CTrueFalse<>>           m_oMinusY;
			nullable<SimpleTypes::CTrueFalse<>>           m_oOn;
			nullable<SimpleTypes::CTrueFalse<>>           m_oTextBorder;
			nullable<SimpleTypes::Vml::CVmlCalloutType<>> m_oType;
		};
		
		
		
		class CClipPath : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CClipPath)
			CClipPath()
			{
			}
			virtual ~CClipPath()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<o:clippath o:v=\"") + m_oV.ToString() + _T("\"/>");
				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_o_clippath;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_ReadSingle( oReader, _T("o:v"), m_oV )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			
			SimpleTypes::Vml::CVmlPath m_oV;
		};
		
		
		
		class CColorMenu : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CColorMenu)
			CColorMenu()
			{
			}
			virtual ~CColorMenu()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<o:colormenu ");

				ComplexTypes_WriteAttribute ( _T("v:ext=\""),           m_oExt );

				sResult += _T("extrusioncolor=\"") + m_oExtrusionColor.ToString() + _T("\" ");
				sResult += _T("fillcolor=\"")      + m_oFillColor.ToString()      + _T("\" ");
				sResult += _T("shadowcolor=\"")    + m_oShadowColor.ToString()    + _T("\" ");
				sResult += _T("strokecolor=\"")    + m_oStrokeColor.ToString()    + _T("\"/>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_o_colormenu;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				m_oExtrusionColor = _T("#000000");
				m_oFillColor      = _T("#0000FF");
				m_oShadowColor    = _T("#80800C");
				m_oStrokeColor    = _T("#FFFF00");

				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("v:ext"),          m_oExt )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("extrusioncolor"), m_oExtrusionColor )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("fillcolor"),      m_oFillColor )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("shadowcolor"),    m_oShadowColor )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("strokecolor"),    m_oStrokeColor )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			
			nullable<SimpleTypes::CExt<>>                      m_oExt;
			SimpleTypes::CColorType<SimpleTypes::colortypeRGB> m_oExtrusionColor;
			SimpleTypes::CColorType<SimpleTypes::colortypeRGB> m_oFillColor;
			SimpleTypes::CColorType<SimpleTypes::colortypeRGB> m_oShadowColor;
			SimpleTypes::CColorType<SimpleTypes::colortypeRGB> m_oStrokeColor;
		};
		
		
		
		class CColorMru : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CColorMru)
			CColorMru()
			{
			}
			virtual ~CColorMru()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<o:colormru ");

				ComplexTypes_WriteAttribute ( _T("v:ext=\""), m_oExt );
				sResult += _T("colors=\"");

				for ( int nIndex = 0; nIndex < m_arrColors.GetSize(); nIndex++ )
				{
					sResult += m_arrColors[nIndex].ToString() + _T(",");
				}

				sResult += _T("\"/>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_o_colormru;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				CString sColors;

				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("v:ext"),  m_oExt )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("colors"), sColors )
				WritingElement_ReadAttributes_End( oReader )

				if ( _T("") != sColors )
				{
					int nStartPos = 0;
					int nEndPos = -1;
					CString sColor;
					SimpleTypes::CColorType<> oColor;
					while ( -1 != ( nEndPos = sColors.Find( _T(","), nStartPos )  ) )
					{
						sColor = sColors.Mid( nStartPos, nEndPos - nStartPos );
						oColor = sColor;
						m_arrColors.Add( oColor );
						nStartPos = nEndPos + 1;
					}

					nEndPos = sColors.GetLength();
					sColor = sColors.Mid( nStartPos, nEndPos - nStartPos );
					oColor = sColor;
					if ( SimpleTypes::colortypeNone != oColor.GetValue() )
						m_arrColors.Add( oColor );
				}
			}

		public:

			
			CSimpleArray<SimpleTypes::CColorType<>> m_arrColors;
			nullable<SimpleTypes::CExt<>>           m_oExt;
		};
		
		
		
		class CComplex : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CComplex)
			CComplex()
			{
			}
			virtual ~CComplex()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<o:complex ");
				ComplexTypes_WriteAttribute ( _T("v:ext=\""),  m_oExt );
				sResult += _T("\"/>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_o_complex;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_ReadSingle( oReader, _T("v:ext"),  m_oExt )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			
			nullable<SimpleTypes::CExt<>> m_oExt;
		};
		
		
		
		class CRelation : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CRelation)
			CRelation()
			{
			}
			virtual ~CRelation()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<o:rel ");

				ComplexTypes_WriteAttribute ( _T("v:ext=\""),  m_oExt );
				ComplexTypes_WriteAttribute2( _T("idcntr=\""), m_sIdCntr );
				ComplexTypes_WriteAttribute2( _T("iddest=\""), m_sIdDest );
				ComplexTypes_WriteAttribute2( _T("idsrc=\""),  m_sIdSrc );

				sResult += _T("\"/>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_o_rel;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("v:ext"),  m_oExt )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("idcntr"), m_sIdCntr )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("iddest"), m_sIdDest )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("idsrc"),  m_sIdSrc )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			
			nullable<SimpleTypes::CExt<>> m_oExt;
			nullable<CString>             m_sIdCntr;
			nullable<CString>             m_sIdDest;
			nullable<CString>             m_sIdSrc;
		};
		
		
		
		class CRelationTable : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CRelationTable)
			CRelationTable()
			{
			}
			virtual ~CRelationTable()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( oReader.IsEmptyNode() )
					return;

				int nCurDepth = oReader.GetDepth();
				while ( oReader.ReadNextSiblingNode( nCurDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();
					if ( _T("o:rel") == sName )
					{
						OOX::VmlOffice::CRelation oRel = oReader;
						m_arrRel.Add( oRel );
					}
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<o:relationtable ");

				ComplexTypes_WriteAttribute ( _T("v:ext=\""),  m_oExt );

				sResult += _T("\">");

				for ( int nIndex = 0; nIndex < m_arrRel.GetSize(); nIndex++ )
					sResult += m_arrRel[nIndex].toXML();

				sResult += _T("</o:relationtable>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_o_relationtable;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_ReadSingle( oReader, _T("v:ext"),  m_oExt )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			
			nullable<SimpleTypes::CExt<>>     m_oExt;

			
			CSimpleArray<OOX::VmlOffice::CRelation> m_arrRel;
		};


		
		
		
		class CDiagram : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CDiagram)
			CDiagram()
			{
			}
			virtual ~CDiagram()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( oReader.IsEmptyNode() )
					return;

				int nCurDepth = oReader.GetDepth();
				while ( oReader.ReadNextSiblingNode( nCurDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();
					if ( _T("o:relationtable") == sName )
						m_oRelationTable = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<o:diagram ");

				ComplexTypes_WriteAttribute ( _T("v:ext=\""),            m_oExt )
				ComplexTypes_WriteAttribute ( _T("dgmstyle=\""),         m_oDmgStyle )
				ComplexTypes_WriteAttribute ( _T("autoformat=\""),       m_oAutoFormat )
				ComplexTypes_WriteAttribute ( _T("reverse=\""),          m_oReverse )
				ComplexTypes_WriteAttribute ( _T("autolayout=\""),       m_oAutoLayout )
				ComplexTypes_WriteAttribute ( _T("dgmscalex=\""),        m_oDmgScaleX )
				ComplexTypes_WriteAttribute ( _T("dgmscaley=\""),        m_oDmgScaleY )
				ComplexTypes_WriteAttribute ( _T("dgmfontsize=\""),      m_oDmgFontSize )
				ComplexTypes_WriteAttribute2( _T("constrainbounds=\""),  m_sConstrainbounds )
				ComplexTypes_WriteAttribute ( _T("dgmbasetextscale=\""), m_oDmgBaseTextScale )

				sResult += _T("\">");

				if ( m_oRelationTable.IsInit() )
					sResult += m_oRelationTable->toXML();

				sResult += _T("</o:diagram>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_o_diagram;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("autoformat"),       m_oAutoFormat )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("autolayout"),       m_oAutoLayout )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("constrainbounds"),  m_sConstrainbounds )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("dgmbasetextscale"), m_oDmgBaseTextScale )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("dgmfontsize"),      m_oDmgFontSize )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("dgmscalex"),        m_oDmgScaleX )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("dgmscaley"),        m_oDmgScaleY )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("dgmstyle"),         m_oDmgStyle )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("v:ext"),            m_oExt )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("reverse"),          m_oReverse )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			
			nullable<SimpleTypes::CTrueFalse<>>     m_oAutoFormat;
			nullable<SimpleTypes::CTrueFalse<>>     m_oAutoLayout;
			nullable<CString>                       m_sConstrainbounds;
			nullable<SimpleTypes::CDecimalNumber<>> m_oDmgBaseTextScale;
			nullable<SimpleTypes::CDecimalNumber<>> m_oDmgFontSize;
			nullable<SimpleTypes::CDecimalNumber<>> m_oDmgScaleX;
			nullable<SimpleTypes::CDecimalNumber<>> m_oDmgScaleY;
			nullable<SimpleTypes::CDecimalNumber<>> m_oDmgStyle;
			nullable<SimpleTypes::CExt<>>           m_oExt;
			nullable<SimpleTypes::CTrueFalse<>>     m_oReverse;

			
			nullable<OOX::VmlOffice::CRelationTable>      m_oRelationTable;
		};


		
		
		
		class CEntry : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CEntry)
			CEntry()
			{
			}
			virtual ~CEntry()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<o:entry ");

				ComplexTypes_WriteAttribute ( _T("new=\""), m_oNew );
				ComplexTypes_WriteAttribute ( _T("old=\""), m_oOld );

				sResult += _T("\"/>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_o_entry;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("new"), m_oNew )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("old"), m_oOld )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			
			nullable<SimpleTypes::CDecimalNumber<>> m_oNew;
			nullable<SimpleTypes::CDecimalNumber<>> m_oOld;
		};
		
		
		
		class CEquationXml : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CEquationXml)
			CEquationXml()
			{
			}
			virtual ~CEquationXml()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( oReader.IsEmptyNode() )
					return;

				int nCurDepth = oReader.GetDepth();
				while ( oReader.ReadNextSiblingNode( nCurDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();

					
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<o:equationXml ");
				ComplexTypes_WriteAttribute ( _T("contentType=\""), m_oContentType );
				sResult += _T("\">");

				sResult += _T("</o:equationXml>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_o_equationXml;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_ReadSingle( oReader, _T("contentType"), m_oContentType )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			
			nullable<SimpleTypes::CAlternateMathContentType<>> m_oContentType;
		};
		
		
		
		class CExtrusion : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CExtrusion)
			CExtrusion()
			{
			}
			virtual ~CExtrusion()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<o:extrusion ");

				ComplexTypes_WriteAttribute ( _T("v:ext=\""), m_oExt );

				if ( SimpleTypes::booleanFalse != m_oOn.GetValue() )
					sResult += _T("on=\"") + m_oOn.ToString() + _T("\" ");

				if ( SimpleTypes::extrusiontypeParallel != m_oType.GetValue() )
					sResult += _T("type=\"") + m_oType.ToString() + _T("\" ");

				if ( SimpleTypes::extrusionrenderSolid != m_oRender.GetValue() )
					sResult += _T("render=\"") + m_oRender.ToString() + _T("\" ");

				if ( 0.5 != m_oViewPointOrigin.GetX() || -0.5 != m_oViewPointOrigin.GetY() )
					sResult += _T("viewpointorigin=\"") + m_oRender.ToString() + _T("\" ");

				if ( 0 != m_oViewPoint.GetX() || 0 != m_oViewPoint.GetY() || 0 != m_oViewPoint.GetZ() )
					sResult += _T("viewpoint=\"") + m_oViewPoint.ToString() + _T("\" ");

				if ( SimpleTypes::extrusionplaneXY != m_oPlane.GetValue() )
					sResult += _T("plane=\"") + m_oPlane.ToString() + _T("\" ");

				if ( 225 != m_oSkewAngle.GetValue() )
					sResult += _T("skewangle=\"") + m_oSkewAngle.ToString() + _T("\" ");

				if ( 50 != m_oSkewAmt.GetValue() )
					sResult += _T("skewamt=\"") + m_oSkewAmt.ToString() + _T("\" ");

				if ( 0 != m_oForeDepth.GetValue() )
					sResult += _T("foredepth=\"") + m_oForeDepth.ToString() + _T("\" ");

				if ( 36 != m_oBackDepth.GetValue() )
					sResult += _T("backdepth=\"") + m_oBackDepth.ToString() + _T("\" ");

				if ( 100 != m_oOrientation.GetX() || 0 != m_oOrientation.GetY() || 0 != m_oOrientation.GetZ() )
					sResult += _T("orientation=\"") + m_oOrientation.ToString() + _T("\" ");

				if ( 0 != m_oOrientationAngle.GetValue() )
					sResult += _T("orientationangle=\"") + m_oOrientationAngle.ToString() + _T("\" ");

				if ( SimpleTypes::booleanTrue != m_oLockRotationCenter.GetValue() )
					sResult += _T("lockrotationcenter=\"") + m_oLockRotationCenter.ToString() + _T("\" ");

				if ( SimpleTypes::booleanFalse != m_oAutoRotationCenter.GetValue() )
					sResult += _T("autorotationcenter=\"") + m_oAutoRotationCenter.ToString() + _T("\" ");

				if ( 0 != m_oRotationCenter.GetX() || 0 != m_oRotationCenter.GetY() || 0 != m_oRotationCenter.GetZ() )
					sResult += _T("rotationcenter=\"") + m_oRotationCenter.ToString() + _T("\" ");

				if ( 0 != m_oRotationAngle.GetX() || 0 != m_oRotationAngle.GetY() )
					sResult += _T("rotationangle=\"") + m_oRotationAngle.ToString() + _T("\" ");

				if ( SimpleTypes::colormodeAuto != m_oColorMode.GetValue() )
					sResult += _T("colormode=\"") + m_oColorMode.ToString() + _T("\" ");

				if ( m_oColor.IsInit() )
					sResult += _T("color=\"") + m_oColor->ToString() + _T("\" ");

				if ( 5 != m_oShininess.GetValue() )
					sResult += _T("shininess=\"") + m_oShininess.ToString() + _T("\" ");

				if ( 0 != m_oSpecularity.GetValue() )
					sResult += _T("specularity=\"") + m_oSpecularity.ToString() + _T("\" ");

				if ( 1 != m_oDiffusity.GetValue() )
					sResult += _T("diffusity=\"") + m_oDiffusity.ToString() + _T("\" ");

				if ( SimpleTypes::booleanFalse != m_oMetal.GetValue() )
					sResult += _T("metal=\"") + m_oMetal.ToString() + _T("\" ");

				if ( 1 != m_oEdge.GetValue() )
					sResult += _T("edge=\"") + m_oEdge.ToString() + _T("\" ");

				if ( 30000 != m_oFacet.GetValue() )
					sResult += _T("facet=\"") + m_oFacet.ToString() + _T("\" ");

				if ( SimpleTypes::booleanTrue != m_oLightFace.GetValue() )
					sResult += _T("lightface=\"") + m_oLightFace.ToString() + _T("\" ");

				if ( 0.3 != m_oBrightness.GetValue() )
					sResult += _T("brightness=\"") + m_oBrightness.ToString() + _T("\" ");

				if ( 50000 != m_oLightPosition.GetX() || 0 != m_oLightPosition.GetY() || 10000 != m_oLightPosition.GetZ() )
					sResult += _T("lightposition=\"") + m_oLightPosition.ToString() + _T("\" ");

				if ( 0.6 != m_oLightLevel.GetValue() )
					sResult += _T("lightlevel=\"") + m_oLightLevel.ToString() + _T("\" ");

				if ( SimpleTypes::booleanTrue != m_oLightHarsh.GetValue() )
					sResult += _T("lightharsh=\"") + m_oLightHarsh.ToString() + _T("\" ");

				if ( 50000 != m_oLightPosition2.GetX() || 0 != m_oLightPosition2.GetY() || 10000 != m_oLightPosition2.GetZ() )
					sResult += _T("lightposition2=\"") + m_oLightPosition2.ToString() + _T("\" ");

				if ( 0.6 != m_oLightLevel2.GetValue() )
					sResult += _T("lightlevel2=\"") + m_oLightLevel2.ToString() + _T("\" ");

				if ( SimpleTypes::booleanFalse != m_oLightHarsh2.GetValue() )
					sResult += _T("lightharsh2=\"") + m_oLightHarsh2.ToString() + _T("\" ");

				sResult += _T("/>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_o_extrusion;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				m_oBackDepth.SetValue( 36 );
				m_oBrightness.SetValue( 0.3 );
				m_oDiffusity.SetValue( (double)1.0 );
				m_oEdge.SetValue( 1 );
				m_oForeDepth.SetValue( 0 );
				m_oLightLevel.SetValue( 0.6 );
				m_oLightLevel2.SetValue( 0.6 );
				m_oLightPosition.SetValue( 50000, 0, 10000 );
				m_oLightPosition2.SetValue( 50000, 0, 10000 );
				m_oOrientation.SetValue( 100, 0, 0 );
				m_oRotationAngle.SetValue( 0, 0 );
				m_oRotationCenter.SetValue( 0, 0, 0 );
				m_oSkewAmt.SetValue( 50 );
				m_oSpecularity.SetValue( 0 );
				m_oViewPoint.SetValue( 0, 0, 0 );
				m_oViewPointOrigin.SetValue( 0.5, -0.5 );

				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("autorotationcenter"), m_oAutoRotationCenter )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("backdepth"),          m_oBackDepth )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("brightness"),         m_oBrightness )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("color"),              m_oColor )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("colormode"),          m_oColorMode )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("diffusity"),          m_oDiffusity )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("edge"),               m_oEdge )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("v:ext"),              m_oExt )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("facet"),              m_oFacet )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("foredepth"),          m_oForeDepth )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("lightface"),          m_oLightFace )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("lightharsh"),         m_oLightHarsh )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("lightharsh2"),        m_oLightHarsh2 )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("lightlevel"),         m_oLightLevel )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("lightlevel2"),        m_oLightLevel2 )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("lightposition"),      m_oLightPosition )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("lightposition2"),     m_oLightPosition2 )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("lockrotationcenter"), m_oLockRotationCenter )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("metal"),              m_oMetal )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("on"),                 m_oOn )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("orientation"),        m_oOrientation )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("orientationangle"),   m_oOrientationAngle )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("plane"),              m_oPlane )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("render"),             m_oRender )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("rotationangle"),      m_oRotationAngle )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("rotationcenter"),     m_oRotationCenter )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("shininess"),          m_oShininess )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("skewamt"),            m_oSkewAmt )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("skewangle"),          m_oSkewAngle )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("specularity"),        m_oSpecularity )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("type"),               m_oType )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("viewpoint"),          m_oViewPoint )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("viewpointorigin"),    m_oViewPointOrigin )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			
			SimpleTypes::CTrueFalse<SimpleTypes::booleanFalse>               m_oAutoRotationCenter;
			SimpleTypes::CPoint                                              m_oBackDepth;
			SimpleTypes::Vml::CVml_1_65536                                   m_oBrightness;
			nullable<SimpleTypes::CColorType<>>                              m_oColor;
			SimpleTypes::CColorMode<SimpleTypes::colormodeAuto>              m_oColorMode;
			SimpleTypes::Vml::CVml_1_65536                                   m_oDiffusity;
			SimpleTypes::CPoint                                              m_oEdge;
			nullable<SimpleTypes::CExt<>>                                    m_oExt;
			SimpleTypes::CDecimalNumber<30000>                               m_oFacet;
			SimpleTypes::CPoint                                              m_oForeDepth;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanTrue>                m_oLightFace;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanTrue>                m_oLightHarsh;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanFalse>               m_oLightHarsh2;
			SimpleTypes::Vml::CVml_1_65536                                   m_oLightLevel;
			SimpleTypes::Vml::CVml_1_65536                                   m_oLightLevel2;
			SimpleTypes::Vml::CVml_Vector3D_65536                            m_oLightPosition;
			SimpleTypes::Vml::CVml_Vector3D_65536                            m_oLightPosition2;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanTrue>                m_oLockRotationCenter;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanFalse>               m_oMetal;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanFalse>               m_oOn;
			SimpleTypes::Vml::CVml_Vector3D                                  m_oOrientation;
			SimpleTypes::CDecimalNumber<0>                                   m_oOrientationAngle;
			SimpleTypes::CExtrusionPlane<SimpleTypes::extrusionplaneXY>      m_oPlane;
			SimpleTypes::CExtrusionRender<SimpleTypes::extrusionrenderSolid> m_oRender;
			SimpleTypes::Vml::CVml_Vector2D                                  m_oRotationAngle;
			SimpleTypes::Vml::CVml_Vector3D                                  m_oRotationCenter;
			SimpleTypes::CDecimalNumber<5>                                   m_oShininess;
			SimpleTypes::CPositiveFixedPercentage                            m_oSkewAmt;
			SimpleTypes::CDecimalNumber<225>                                 m_oSkewAngle;
			SimpleTypes::Vml::CVml_1_65536                                   m_oSpecularity;
			SimpleTypes::CExtrusionType<SimpleTypes::extrusiontypeParallel>  m_oType;
			SimpleTypes::Vml::CVml_Vector3D                                  m_oViewPoint;
			SimpleTypes::Vml::CVml_Vector2D_F                                m_oViewPointOrigin;
		};
		
		
		
		class CFieldCodes : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CFieldCodes)
			CFieldCodes()
			{
			}
			virtual ~CFieldCodes()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				if ( oReader.IsEmptyNode() )
					return;

				m_sText = oReader.GetText2();
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<o:FieldCodes>") + m_sText + _T("</o:FieldCodes>");
				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_o_FieldCodes;
			}

		public:

			
			CString m_sText;
		};
		
		
		
		class CFill : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CFill)
			CFill()
			{
			}
			virtual ~CFill()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<o:fill ");

				ComplexTypes_WriteAttribute ( _T("v:ext=\""), m_oExt );
				ComplexTypes_WriteAttribute ( _T("type=\""),  m_oType );

				sResult += _T("/>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_o_fill;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("v:ext"), m_oExt )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("type"),  m_oType )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			
			nullable<SimpleTypes::CExt<>>                                   m_oExt;
			nullable<SimpleTypes::CFillType<SimpleTypes::filltypeSolid, 1>> m_oType;
		};
		
		
		
		class CIdMap : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CIdMap)
			CIdMap()
			{
			}
			virtual ~CIdMap()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<o:idmap ");

				ComplexTypes_WriteAttribute ( _T("v:ext=\""), m_oExt );
				ComplexTypes_WriteAttribute2( _T("data=\""),  m_sData );

				sResult += _T("/>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_o_idmap;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("v:ext"), m_oExt )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("data"),  m_sData )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			
			nullable<CString>             m_sData;
			nullable<SimpleTypes::CExt<>> m_oExt;
		};
		
		
		
		class CInk : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CInk)
			CInk()
			{
			}
			virtual ~CInk()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<o:ink ");

				ComplexTypes_WriteAttribute2( _T("i=\""),           m_sI );
				ComplexTypes_WriteAttribute ( _T("annotation=\""),  m_oAnnotation );
				ComplexTypes_WriteAttribute ( _T("contentType=\""), m_oContentType );

				sResult += _T("/>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_o_ink;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("annotation"),  m_oAnnotation )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("contentType"), m_oContentType )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("i"),           m_sI )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			
			nullable<SimpleTypes::CTrueFalse<>> m_oAnnotation;
			nullable<SimpleTypes::CContentType> m_oContentType;
			nullable<CString>                   m_sI;
		};
		
		
		
		class CLinkType : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CLinkType)
			CLinkType()
			{
			}
			virtual ~CLinkType()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				if ( oReader.IsEmptyNode() )
					return;

				CString sText = oReader.GetText2();
				m_oValue = sText;
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<o:LinkType>") + m_oValue.ToString() + _T("</o:LinkType>");
				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_o_LinkType;
			}

		public:

			
			SimpleTypes::COLELinkType<> m_oValue;
		};
		
		
		
		class CLock : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CLock)
			CLock()
			{
			}
			virtual ~CLock()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<o:lock ");

				ComplexTypes_WriteAttribute ( _T("v:ext=\""), m_oExt );

				if ( SimpleTypes::booleanFalse != m_oPosition.GetValue() )
					sResult += _T("position=\"") + m_oPosition.ToString() + _T("\" ");

				if ( SimpleTypes::booleanFalse != m_oSelection.GetValue() )
					sResult += _T("selection=\"") + m_oSelection.ToString() + _T("\" ");

				if ( SimpleTypes::booleanFalse != m_oGrouping.GetValue() )
					sResult += _T("grouping=\"") + m_oGrouping.ToString() + _T("\" ");

				if ( SimpleTypes::booleanFalse != m_oUnGrouping.GetValue() )
					sResult += _T("ungrouping=\"") + m_oUnGrouping.ToString() + _T("\" ");

				if ( SimpleTypes::booleanFalse != m_oRotation.GetValue() )
					sResult += _T("rotation=\"") + m_oRotation.ToString() + _T("\" ");

				if ( SimpleTypes::booleanFalse != m_oCropping.GetValue() )
					sResult += _T("cropping=\"") + m_oCropping.ToString() + _T("\" ");

				if ( SimpleTypes::booleanFalse != m_oVerticies.GetValue() )
					sResult += _T("verticies=\"") + m_oVerticies.ToString() + _T("\" ");

				if ( SimpleTypes::booleanFalse != m_oAdjustHandles.GetValue() )
					sResult += _T("adjusthandles=\"") + m_oAdjustHandles.ToString() + _T("\" ");

				if ( SimpleTypes::booleanFalse != m_oText.GetValue() )
					sResult += _T("text=\"") + m_oText.ToString() + _T("\" ");

				if ( SimpleTypes::booleanFalse != m_oAspectRatio.GetValue() )
					sResult += _T("aspectratio=\"") + m_oAspectRatio.ToString() + _T("\" ");

				if ( SimpleTypes::booleanFalse != m_oShapeType.GetValue() )
					sResult += _T("shapetype=\"") + m_oShapeType.ToString() + _T("\" ");

				sResult += _T("/>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_o_lock;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("adjusthandles"), m_oAdjustHandles )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("aspectratio"),   m_oAspectRatio )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("cropping"),      m_oCropping )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("v:ext"),         m_oExt )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("grouping"),      m_oGrouping )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("position"),      m_oPosition )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("rotation"),      m_oRotation )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("selection"),     m_oSelection )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("shapetype"),     m_oShapeType )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("text"),          m_oText )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("ungrouping"),    m_oUnGrouping )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("verticies"),     m_oVerticies )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			
			SimpleTypes::CTrueFalse<SimpleTypes::booleanFalse>               m_oAdjustHandles;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanFalse>               m_oAspectRatio;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanFalse>               m_oCropping;
			nullable<SimpleTypes::CExt<>>                                    m_oExt;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanFalse>               m_oGrouping;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanFalse>               m_oPosition;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanFalse>               m_oRotation;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanFalse>               m_oSelection;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanFalse>               m_oShapeType;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanFalse>               m_oText;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanFalse>               m_oUnGrouping;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanFalse>               m_oVerticies;
		};
		
		
		
		class CLockedField : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CLockedField)
			CLockedField()
			{
			}
			virtual ~CLockedField()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				if ( oReader.IsEmptyNode() )
					return;

				CString sText = oReader.GetText2();
				m_oValue = sText;
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<o:LockedField>") + m_oValue.ToString() + _T("</o:LockedField>");
				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_o_LockedField;
			}

		public:

			
			SimpleTypes::CTrueFalse<> m_oValue;
		};

		
		
		
		class COLEObject : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(COLEObject)
			COLEObject()
			{
			}
			virtual ~COLEObject()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( oReader.IsEmptyNode() )
					return;

				int nCurDepth = oReader.GetDepth();
				while ( oReader.ReadNextSiblingNode( nCurDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();
					if ( _T("o:FieldCodes") == sName )
						m_oFieldCodes = oReader;
					else if ( _T("o:LinkType") == sName )
						m_oLinkType = oReader;
					else if ( _T("o:LockedField") == sName )
						m_oLockedField = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<o:OLEObject ");

				ComplexTypes_WriteAttribute ( _T("Type=\""),       m_oType )
				ComplexTypes_WriteAttribute2( _T("ProgID=\""),     m_sProgId )
				ComplexTypes_WriteAttribute2( _T("ShapeID=\""),    m_sShapeId )
				ComplexTypes_WriteAttribute ( _T("DrawAspect=\""), m_oDrawAspect )
				ComplexTypes_WriteAttribute2( _T("ObjectID=\""),   m_sObjectId )
				ComplexTypes_WriteAttribute ( _T("r:id=\""),       m_oId )
				ComplexTypes_WriteAttribute ( _T("UpdateMode=\""), m_oUpdateMode )

				sResult += _T(">");

				if ( m_oLinkType.IsInit() )
					sResult += m_oLinkType->toXML();

				if ( m_oLockedField.IsInit() )
					sResult += m_oLockedField->toXML();

				if ( m_oFieldCodes.IsInit() )
					sResult += m_oFieldCodes->toXML();

				sResult += _T("</o:OLEObject>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_o_OLEObject;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("DrawAspect"), m_oDrawAspect )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("r:id"),       m_oId )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("ObjectID"),   m_sObjectId )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("ProgID"),     m_sProgId )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("ShapeID"),    m_sShapeId )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("Type"),       m_oType )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("UpdateMode"), m_oUpdateMode )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			
			nullable<SimpleTypes::COLEDrawAspect<>> m_oDrawAspect;
			nullable<SimpleTypes::CRelationshipId>  m_oId;
			nullable<CString>                       m_sObjectId;
			nullable<CString>                       m_sProgId;
			nullable<CString>                       m_sShapeId;
			nullable<SimpleTypes::COLEType<>>       m_oType;
			nullable<SimpleTypes::COLEUpdateMode<>> m_oUpdateMode;

			
			nullable<OOX::VmlOffice::CFieldCodes>         m_oFieldCodes;
			nullable<OOX::VmlOffice::CLinkType>           m_oLinkType;
			nullable<OOX::VmlOffice::CLockedField>        m_oLockedField;
		};
		
		
		
		class CProxy : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CProxy)
			CProxy()
			{
			}
			virtual ~CProxy()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<o:proxy ");

				sResult += _T("start=\"")      + m_oStart.ToString()      + _T("\" ");
				sResult += _T("end=\"")        + m_oEnd.ToString()        + _T("\" ");
				sResult += _T("idref=\"")      + m_sIdRef                 + _T("\" ");
				sResult += _T("connectloc=\"") + m_oConnectLoc.ToString() + _T("\"/>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_o_proxy;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("connectloc"), m_oConnectLoc )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("end"),        m_oEnd )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("idref"),      m_sIdRef )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("start"),      m_oStart )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			
			SimpleTypes::CDecimalNumber<0>                     m_oConnectLoc;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanFalse> m_oEnd;
			CString                                            m_sIdRef;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanFalse> m_oStart;
		};
		
		
		
		class CR : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CR)
			CR()
			{
			}
			virtual ~CR()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( oReader.IsEmptyNode() )
					return;

				int nCurDepth = oReader.GetDepth();
				while ( oReader.ReadNextSiblingNode( nCurDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();
					if ( _T("o:proxy") == sName )
					{
						OOX::VmlOffice::CProxy oProxy = oReader;
						m_arrProxy.Add( oProxy );
					}
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<o:r id=\"") + m_sId + _T("\" ");

				ComplexTypes_WriteAttribute ( _T("type=\""),  m_oType )
				ComplexTypes_WriteAttribute ( _T("how=\""),   m_oHow )
				ComplexTypes_WriteAttribute2( _T("idref=\""), m_sIdRef )

				sResult += _T(">");

				for ( int nIndex = 0; nIndex < m_arrProxy.GetSize(); nIndex++ )
					sResult += m_arrProxy[nIndex].toXML();

				sResult += _T("</o:r>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_o_r;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("how"),   m_oHow )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("id"),    m_sId )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("idref"), m_sIdRef )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("type"),  m_oType )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			
			nullable<SimpleTypes::CHow<>>   m_oHow;
			CString                         m_sId;
			nullable<CString>               m_sIdRef;
			nullable<SimpleTypes::CRType<>> m_oType;
			
			
			CSimpleArray<OOX::VmlOffice::CProxy>  m_arrProxy;
		};
		
		
		
		class CRegroupTable : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CRegroupTable)
			CRegroupTable()
			{
			}
			virtual ~CRegroupTable()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( oReader.IsEmptyNode() )
					return;

				int nCurDepth = oReader.GetDepth();
				while ( oReader.ReadNextSiblingNode( nCurDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();
					if ( _T("o:entry") == sName )
					{
						OOX::VmlOffice::CEntry oEntry = oReader;
						m_arrEntry.Add( oEntry );
					}
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<o:regrouptable ");

				ComplexTypes_WriteAttribute ( _T("v:ext=\""), m_oExt );

				sResult += _T(">");

				for ( int nIndex = 0; nIndex < m_arrEntry.GetSize(); nIndex++ )
					sResult += m_arrEntry[nIndex].toXML();

				sResult += _T("</o:regrouptable>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_o_regrouptable;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_ReadSingle( oReader, _T("v:ext"), m_oExt )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			
			nullable<SimpleTypes::CExt<>>        m_oExt;
			
			
			CSimpleArray<OOX::VmlOffice::CEntry> m_arrEntry;
		};
		
		
		
		class CRules : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CRules)
			CRules()
			{
			}
			virtual ~CRules()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( oReader.IsEmptyNode() )
					return;

				int nCurDepth = oReader.GetDepth();
				while ( oReader.ReadNextSiblingNode( nCurDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();
					if ( _T("o:r") == sName )
					{
						OOX::VmlOffice::CR oR = oReader;
						m_arrR.Add( oR );
					}
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<o:rules ");

				ComplexTypes_WriteAttribute ( _T("v:ext=\""), m_oExt );

				sResult += _T(">");

				for ( int nIndex = 0; nIndex < m_arrR.GetSize(); nIndex++ )
					sResult += m_arrR[nIndex].toXML();

				sResult += _T("</o:rules>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_o_rules;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_ReadSingle( oReader, _T("v:ext"), m_oExt )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			
			nullable<SimpleTypes::CExt<>>    m_oExt;
			
			
			CSimpleArray<OOX::VmlOffice::CR> m_arrR;
		};
		
		
		
		class CShapeLayout : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CShapeLayout)
			CShapeLayout()
			{
			}
			virtual ~CShapeLayout()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( oReader.IsEmptyNode() )
					return;

				int nCurDepth = oReader.GetDepth();
				while ( oReader.ReadNextSiblingNode( nCurDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();
					if ( _T("o:idmap") == sName )
						m_oIdMap = oReader;
					else if ( _T("o:regrouptable") == sName )
						m_oRegroupTable = oReader;
					else if ( _T("o:rules") == sName )
						m_oRules = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<o:shapelayout ");

				ComplexTypes_WriteAttribute ( _T("v:ext=\""), m_oExt );

				sResult += _T(">");

				if ( m_oIdMap.IsInit() )
					sResult += m_oIdMap->toXML();

				if ( m_oRegroupTable.IsInit() )
					sResult += m_oRegroupTable->toXML();

				if ( m_oRules.IsInit() )
					sResult += m_oRules->toXML();

				sResult += _T("</o:shapelayout>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_o_shapelayout;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_ReadSingle( oReader, _T("v:ext"), m_oExt )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			
			nullable<SimpleTypes::CExt<>>           m_oExt;
			
			
			nullable<OOX::VmlOffice::CIdMap>        m_oIdMap;
			nullable<OOX::VmlOffice::CRegroupTable> m_oRegroupTable;
			nullable<OOX::VmlOffice::CRules>        m_oRules;
		};
		
		
		
		class CSignatureLine : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CSignatureLine)
			CSignatureLine()
			{
			}
			virtual ~CSignatureLine()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<o:signatureline ");

				ComplexTypes_WriteAttribute ( _T("v:ext=\""), m_oExt );

				if ( SimpleTypes::booleanTrue != m_oIsSignatureLine.GetValue() )
					sResult += _T("issignatureline=\"") + m_oIsSignatureLine.ToString() + _T("\" ");

				ComplexTypes_WriteAttribute ( _T("id=\""),     m_oId );
				ComplexTypes_WriteAttribute ( _T("provid=\""), m_oProvId );

				if ( SimpleTypes::booleanFalse != m_oSigningInstructionsSet.GetValue() )
					sResult += _T("signinginstructionsset=\"") + m_oSigningInstructionsSet.ToString() + _T("\" ");

				if ( SimpleTypes::booleanFalse != m_oAllowComments.GetValue() )
					sResult += _T("allowcomments=\"") + m_oAllowComments.ToString() + _T("\" ");

				if ( SimpleTypes::booleanTrue != m_oShowSignDate.GetValue() )
					sResult += _T("showsigndate=\"") + m_oShowSignDate.ToString() + _T("\" ");

				ComplexTypes_WriteAttribute2( _T("o:suggestedsigner=\""),      m_sSuggestedSigner );
				ComplexTypes_WriteAttribute2( _T("o:suggestedsigner2=\""),     m_sSuggestedSigner2 );
				ComplexTypes_WriteAttribute2( _T("o:suggestedsigneremail=\""), m_sSuggestedSignerEmail );
				ComplexTypes_WriteAttribute2( _T("o:signinginstructions=\""),  m_sSigningInstructions );
				ComplexTypes_WriteAttribute2( _T("o:addlxml=\""),              m_sAddXml );
				ComplexTypes_WriteAttribute2( _T("o:sigprovurl=\""),           m_sSigProvUrl );

				sResult += _T("/>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_o_signatureline;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("o:addlxml"),              m_sAddXml )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("allowcomments"),          m_oAllowComments )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("v:ext"),                  m_oExt )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("id"),                     m_oId )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("issignatureline"),        m_oIsSignatureLine )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("provid"),                 m_oProvId )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("showsigndate"),           m_oShowSignDate )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("o:signinginstructions"),  m_sSigningInstructions )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("signinginstructionsset"), m_oSigningInstructionsSet )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("o:sigprovurl"),           m_sSigProvUrl )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("o:suggestedsigner"),      m_sSuggestedSigner )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("o:suggestedsigner2"),     m_sSuggestedSigner2 )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("o:suggestedsigneremail"), m_sSuggestedSignerEmail )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			
			nullable<CString>                                  m_sAddXml;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanFalse> m_oAllowComments;
			nullable<SimpleTypes::CExt<>>                      m_oExt;
			nullable<SimpleTypes::CGuid>                       m_oId;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanTrue>  m_oIsSignatureLine;
			nullable<SimpleTypes::CGuid>                       m_oProvId;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanTrue>  m_oShowSignDate;
			nullable<CString>                                  m_sSigningInstructions;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanFalse> m_oSigningInstructionsSet;
			nullable<CString>                                  m_sSigProvUrl;
			nullable<CString>                                  m_sSuggestedSigner;
			nullable<CString>                                  m_sSuggestedSigner2;
			nullable<CString>                                  m_sSuggestedSignerEmail;
		};
		
		
		
		class CSkew : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CSkew)
			CSkew()
			{
			}
			virtual ~CSkew()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<o:skew ");

				ComplexTypes_WriteAttribute ( _T("v:ext=\""), m_oExt );
				ComplexTypes_WriteAttribute2( _T("id=\""),    m_sId );

				if ( SimpleTypes::booleanFalse != m_oOn.GetValue() )
					sResult += _T("on=\"") + m_oOn.ToString() + _T("\" ");

				ComplexTypes_WriteAttribute2( _T("offset=\""), m_sOffset );
				ComplexTypes_WriteAttribute2( _T("origin=\""), m_sOrigin );
				ComplexTypes_WriteAttribute2( _T("matrix=\""), m_sMatrix );

				sResult += _T("/>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_o_skew;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("v:ext"),  m_oExt )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("id"),     m_sId )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("matrix"), m_sMatrix )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("offset"), m_sOffset )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("on"),     m_oOn )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("origin"), m_sOrigin )
				WritingElement_ReadAttributes_End( oReader )

				
			}

		public:

			
			nullable<SimpleTypes::CExt<>>                      m_oExt;
			nullable<CString>                                  m_sId;
			nullable<CString>                                  m_sMatrix;
			nullable<CString>                                  m_sOffset;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanFalse> m_oOn;
			nullable<CString>                                  m_sOrigin;
		};
	} 
} 

#endif // OOX_VML_OFFICE_INCLUDE_H_