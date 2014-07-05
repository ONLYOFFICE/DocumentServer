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
#ifndef OOX_VML_INCLUDE_H_
#define OOX_VML_INCLUDE_H_

#include "../../Base/Nullable.h"

#include "../../Common/SimpleTypes_Word.h"
#include "../../Common/SimpleTypes_Vml.h"

#include "VmlWord.h"

#include "../Drawing/DrawingGraphic.h"

#include "../WritingElement.h"
#include "../RId.h"

#include "VmlOfficeDrawing.h"

namespace OOX
{
	namespace Logic
	{
		
		
		
		class CTxbxContent : public WritingElement
		{
		public:
			CTxbxContent()
			{
			}
			CTxbxContent(XmlUtils::CXmlNode &oNode)
			{
				fromXML( oNode );
			}
			CTxbxContent(XmlUtils::CXmlLiteReader& oReader)
			{
				fromXML( oReader );
			}
			virtual ~CTxbxContent()
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

			const CTxbxContent &operator =(const XmlUtils::CXmlNode& oNode)
			{
				fromXML( (XmlUtils::CXmlNode&)oNode );
				return *this;
			}

			const CTxbxContent &operator =(const XmlUtils::CXmlLiteReader& oReader)
			{
				fromXML( (XmlUtils::CXmlLiteReader&)oReader );
				return *this;
			}


		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode);
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader);
			virtual CString      toXML() const;
			virtual EElementType getType() const
			{
				return et_w_txbxContent;
			}

		public:

			
			CSimpleArray<WritingElement *> m_arrItems;
		};
	} 
} 

namespace OOX
{
	namespace Vml
	{
		
		
		
		
		class CVmlAttributes : public virtual WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CVmlAttributes)
			CVmlAttributes()
			{
			}
			virtual ~CVmlAttributes()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );
			}
			virtual CString      toXML() const
			{
				CString sResult;

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

				ComplexTypes_WriteAttribute ( _T("chromakey=\""),  m_oChromaKey );

				if ( SimpleTypes::booleanTrue != m_oFilled.GetValue() )
					sResult += _T("filled=\"false\" ");

				if ( SimpleTypes::colortypeWhite != m_oFillColor.GetValue() )
					sResult += _T("fillcolor=\"") + m_oFillColor.ToString() + _T("\" ");

				if ( 1 != m_oOpacity.GetValue() )
					sResult += _T("opacity=\"") + m_oOpacity.ToString() + _T("\" ");

				ComplexTypes_WriteAttribute ( _T("stroked=\""), m_oStroked );

				if ( SimpleTypes::colortypeBlack != m_oStrokeColor.GetValue() )
					sResult += _T("strokecolor=\"") + m_oStrokeColor.ToString() + _T("\" ");

				if ( 1 != m_oStrokeWeight.GetValue() )
					sResult += _T("strokeweight=\"") + m_oStrokeWeight.ToString() + _T("\" ");

				ComplexTypes_WriteAttribute ( _T("insetpen=\""),  m_oInsetPen );

				if ( 0 != m_oSpt.GetValue() )
					sResult += _T("o:spt=\"") + m_oSpt.ToString() + _T("\" ");

				if ( SimpleTypes::connectortypeStraight != m_oConnectorType.GetValue() )
					sResult += _T("o:connectortype=\"") + m_oConnectorType.ToString() + _T("\" ");

				ComplexTypes_WriteAttribute ( _T("o:bwmode=\""),   m_oBwMode );
				ComplexTypes_WriteAttribute ( _T("o:bwpure=\""),   m_oBwPure );
				ComplexTypes_WriteAttribute ( _T("o:bwnormal=\""), m_oBwNormal );

				if ( SimpleTypes::booleanFalse != m_oForceDash.GetValue() )
					sResult += _T("o:forcedash=\"true\" ");

				if ( SimpleTypes::booleanFalse != m_oOleIcon.GetValue() )
					sResult += _T("o:oleicon=\"true\" ");

				if ( SimpleTypes::booleanFalse != m_oOle.GetValue() )
					sResult += _T("o:ole=\"true\" ");

				if ( SimpleTypes::booleanFalse != m_oPreferRelative.GetValue() )
					sResult += _T("o:preferrelative=\"true\" ");

				if ( SimpleTypes::booleanFalse != m_oClipToWrap.GetValue() )
					sResult += _T("o:cliptowrap=\"true\" ");

				ComplexTypes_WriteAttribute ( _T("o:clip=\""), m_oClip );

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_Unknown;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				m_oHrPct.SetValue( 0 );
				m_oOpacity.SetValue( 1.0 );
				m_oSpt.SetValue( 0 );
				m_oStrokeWeight.FromPoints( 1 );

				
				if ( oReader.GetAttributesCount() <= 0 )
					return;
				
				if ( !oReader.MoveToFirstAttribute() )
					return;
				
				CWCharWrapper wsName = oReader.GetName();
				while( !wsName.IsNull() )
				{
					wchar_t wsChar = wsName[0];
					switch ( wsChar )
					{
					case 'a':
						if      ( _T("alt") == wsName ) m_sAlt = oReader.GetText();
						break;

					case 'c':
						if      ( _T("chromakey")   == wsName ) m_oChromaKey   = oReader.GetText();
						else if ( _T("class")       == wsName ) m_sClass       = oReader.GetText();
						else if ( _T("coordorigin") == wsName ) m_oCoordOrigin = oReader.GetText();
						else if ( _T("coordsize")   == wsName ) m_oCoordSize   = oReader.GetText();
						break;

					case 'f':
						if      ( _T("fillcolor") == wsName ) m_oFillColor = oReader.GetText();
						else if ( _T("filled")    == wsName ) m_oFilled    = oReader.GetText();
						break;

					case 'h':
						if      ( _T("href") == wsName ) m_sHref = oReader.GetText();
						break;

					case 'i':
						if      ( _T("id")       == wsName ) m_sId       = oReader.GetText();
						else if ( _T("insetpen") == wsName ) m_oInsetPen = oReader.GetText();
						break;

					case 'o':
						{
							wchar_t wsChar2 = wsName[2]; 
							switch ( wsChar2 )
							{
							case 'a':
								if      ( _T("o:allowincell")  == wsName ) m_oAllowInCell  = oReader.GetText();
								else if ( _T("o:allowoverlap") == wsName ) m_oAllowOverlap = oReader.GetText();
								else if ( _T("opacity")        == wsName ) m_oOpacity      = oReader.GetText();
								break;
							case 'b':
								if      ( _T("o:borderbottomcolor") == wsName ) m_oBorderBottomColor = oReader.GetText();
								else if ( _T("o:borderleftcolor")   == wsName ) m_oBorderLeftColor   = oReader.GetText();
								else if ( _T("o:borderrightcolor")  == wsName ) m_oBorderRightColor  = oReader.GetText();
								else if ( _T("o:bordertopcolor")    == wsName ) m_oBorderTopColor    = oReader.GetText();
								else if ( _T("o:bullet")            == wsName ) m_oBullet            = oReader.GetText();
								else if ( _T("o:button")            == wsName ) m_oButton            = oReader.GetText();
								else if ( _T("o:bwmode")            == wsName ) m_oBwMode            = oReader.GetText();
								else if ( _T("o:bwnormal")          == wsName ) m_oBwNormal           = oReader.GetText();
								else if ( _T("o:bwpure")            == wsName ) m_oBwPure            = oReader.GetText();
								break;
							case 'c':  
								if      ( _T("o:clip")          == wsName ) m_oClip          = oReader.GetText();
								else if ( _T("o:cliptowrap")    == wsName ) m_oClipToWrap    = oReader.GetText();
								else if ( _T("o:connectortype") == wsName ) m_oConnectorType = oReader.GetText();
								break;
							case 'd':
								if      ( _T("o:doubleclicknotify") == wsName ) m_oDoubleClickNotify = oReader.GetText();
								else if ( _T("o:dgmlayout")         == wsName ) m_oDgmLayout         = oReader.GetText();
								else if ( _T("o:dgmlayoutmru")      == wsName ) m_oDgmLayoutMru      = oReader.GetText();
								else if ( _T("o:dgmnodekind")       == wsName ) m_oDgmNodeKind       = oReader.GetText();
								break;
							case 'f':
								if      ( _T("o:forcedash") == wsName ) m_oForceDash = oReader.GetText();
								break;
							case 'h':  
								if      ( _T("o:hr")        == wsName ) m_oHr        = oReader.GetText();
								else if ( _T("o:hralign")   == wsName ) m_oHrAlign   = oReader.GetText();
								else if ( _T("o:hrnoshade") == wsName ) m_oHrNoShade = oReader.GetText();
								else if ( _T("o:hrpct")     == wsName ) m_oHrPct     = oReader.GetText();
								else if ( _T("o:hrstd")     == wsName ) m_oHrStd     = oReader.GetText();
								break;
							case 'i':
								if      ( _T("o:insetmode") == wsName ) m_oInsetMode = oReader.GetText();
								break;
							case 'o':  
								if      ( _T("o:ole")     == wsName ) m_oOle        = oReader.GetText();
								else if ( _T("o:oleicon") == wsName ) m_oOleIcon    = oReader.GetText();
								else if ( _T("o:oned")    == wsName ) m_oOned       = oReader.GetText();
								break;
							case 'p':
								if      ( _T("o:preferrelative") == wsName ) m_oPreferRelative = oReader.GetText();
								break;
							case 'r':
								if      ( _T("o:regroupid") == wsName ) m_oRegroupId = oReader.GetText();
								break;
							case 's':
								if      ( _T("o:spid") == wsName ) m_sSpId = oReader.GetText();
								else if ( _T("o:spt")  == wsName ) m_oSpt  = oReader.GetText();
								break;
							case 'u':
								if      ( _T("o:userdrawn")  == wsName ) m_oUserDrawn  = oReader.GetText();
								else if ( _T("o:userhidden") == wsName ) m_oUserHidden = oReader.GetText();
								break;
							}

						break;
						}

					case 'p':
						if      ( _T("print") == wsName ) m_oPrint = oReader.GetText();
						break;
					case 's':
						if      ( _T("strokecolor")  == wsName ) m_oStrokeColor  = oReader.GetText();
						else if ( _T("stroked")      == wsName ) m_oStroked      = oReader.GetText();
						else if ( _T("strokeweight") == wsName ) m_oStrokeWeight = oReader.GetText();
						else if ( _T("style")        == wsName ) m_oStyle        = oReader.GetText();
						break;
					case 't':
						if      ( _T("target") == wsName ) m_sTarget = oReader.GetText();
						else if ( _T("title")  == wsName ) m_sTitle  = oReader.GetText();
						break;
					case 'w':
						if      ( _T("wrapcoords") == wsName ) m_oWrapCoords = oReader.GetText();
						break;
					}

					if ( !oReader.MoveToNextAttribute() )
						break;

					wsName = oReader.GetName();
				}
				oReader.MoveToElement();
			}

		public:

			
			
			nullable<CString>                                               m_sId;
			nullable<SimpleTypes::Vml::CCssStyle>                           m_oStyle;
			nullable<CString>                                               m_sHref;
			nullable<CString>                                               m_sTarget;
			nullable<CString>                                               m_sClass;
			nullable<CString>                                               m_sTitle;
			nullable<CString>                                               m_sAlt;
			nullable<SimpleTypes::Vml::CVml_Vector2D>                       m_oCoordSize;
			nullable<SimpleTypes::Vml::CVml_Vector2D>                       m_oCoordOrigin;
			nullable<SimpleTypes::Vml::CVml_Polygon2D>                      m_oWrapCoords;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanTrue>               m_oPrint;
			
			nullable<CString>                                               m_sSpId;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanFalse>              m_oOned;
			nullable<SimpleTypes::CDecimalNumber<>>                         m_oRegroupId;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanFalse>              m_oDoubleClickNotify;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanFalse>              m_oButton;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanFalse>              m_oUserHidden;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanFalse>              m_oBullet;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanFalse>              m_oHr;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanFalse>              m_oHrStd;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanFalse>              m_oHrNoShade;
			SimpleTypes::CDouble                                            m_oHrPct;
			SimpleTypes::CHrAlign<SimpleTypes::hralignLeft>                 m_oHrAlign;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanFalse>              m_oAllowInCell;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanFalse>              m_oAllowOverlap;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanFalse>              m_oUserDrawn;
			nullable<SimpleTypes::CColorType<>>                             m_oBorderTopColor;
			nullable<SimpleTypes::CColorType<>>                             m_oBorderLeftColor;
			nullable<SimpleTypes::CColorType<>>                             m_oBorderBottomColor;
			nullable<SimpleTypes::CColorType<>>                             m_oBorderRightColor;
			nullable<SimpleTypes::CDiagramLayout<>>                         m_oDgmLayout;
			nullable<CString>                                               m_oDgmNodeKind;
			nullable<SimpleTypes::CDiagramLayout<>>                         m_oDgmLayoutMru;
			SimpleTypes::CInsetMode<SimpleTypes::insetmodeCustom>           m_oInsetMode;
			
			
			nullable<SimpleTypes::CColorType<>>                             m_oChromaKey;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanTrue>               m_oFilled;
			SimpleTypes::CColorType<SimpleTypes::colortypeWhite>            m_oFillColor;
			SimpleTypes::Vml::CVml_1_65536                                  m_oOpacity;
			nullable<SimpleTypes::CTrueFalse<>>                             m_oStroked;
			SimpleTypes::CColorType<SimpleTypes::colortypeBlack>            m_oStrokeColor;
			SimpleTypes::CEmu                                               m_oStrokeWeight;
			nullable<SimpleTypes::CTrueFalse<>>                             m_oInsetPen;
			
			SimpleTypes::CDouble                                            m_oSpt;
			SimpleTypes::CConnectorType<SimpleTypes::connectortypeStraight> m_oConnectorType;
			nullable<SimpleTypes::CBWMode<>>                                m_oBwMode;
			nullable<SimpleTypes::CBWMode<>>                                m_oBwPure;
			nullable<SimpleTypes::CBWMode<>>                                m_oBwNormal;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanFalse>              m_oForceDash;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanFalse>              m_oOleIcon;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanFalse>              m_oOle;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanFalse>              m_oPreferRelative;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanFalse>              m_oClipToWrap;
			nullable<SimpleTypes::CTrueFalse<>>                             m_oClip;
		};
		
		
		
		class CVmlShapeElements : public virtual WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CVmlShapeElements)
			CVmlShapeElements()
			{
			}
			virtual ~CVmlShapeElements()
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
				return OOX::et_Unknown;
			}

		public:

			CSimpleArray<WritingElement*> m_arrItems;
		};
	} 
} 

namespace OOX
{
	namespace Vml
	{
		
		
		
		class CArc : public CVmlAttributes, public CVmlShapeElements
		{
		public:
			WritingElement_AdditionConstructors(CArc)
			CArc()
			{
			}
			virtual ~CArc()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );
				CVmlAttributes::fromXML( oReader );

				CVmlShapeElements::fromXML( oReader );
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<v:arc ");

				sResult += CVmlAttributes::toXML();

				sResult += _T("startangle=\"") + m_oStartAngle.ToString() + _T("\" ");
				sResult += _T("endangle=\"")   + m_oEndAngle.ToString()   + _T("\">");

				sResult += CVmlShapeElements::toXML();

				sResult += _T("</v:arc>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_v_arc;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				if ( oReader.GetAttributesCount() <= 0 )
					return;
				
				if ( !oReader.MoveToFirstAttribute() )
					return;
				
				CWCharWrapper wsName = oReader.GetName();
				while( !wsName.IsNull() )
				{
					wchar_t wsChar = wsName[0];
					switch ( wsChar )
					{
					case 'e':
						if      ( _T("endangle") == wsName || _T("endAngle") == wsName ) m_oEndAngle   = oReader.GetText();
						break;

					case 's':
						if      ( _T("startangle") == wsName || _T("startAngle") == wsName ) m_oStartAngle = oReader.GetText();
						break;
					}

					if ( !oReader.MoveToNextAttribute() )
						break;

					wsName = oReader.GetName();
				}
				oReader.MoveToElement();
			}

		public:

			
			SimpleTypes::CDecimalNumber<90> m_oEndAngle;
			SimpleTypes::CDecimalNumber<0>  m_oStartAngle;

		};
		
		
		
		class CCurve : public CVmlAttributes, public CVmlShapeElements
		{
		public:
			WritingElement_AdditionConstructors(CCurve)
			CCurve()
			{
			}
			virtual ~CCurve()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );
				CVmlAttributes::fromXML( oReader );

				CVmlShapeElements::fromXML( oReader );
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<v:curve ");

				sResult += CVmlAttributes::toXML();

				sResult += _T("from=\"")     + m_oFrom.ToString()     + _T("\" ");
				sResult += _T("control1=\"") + m_oControl1.ToString() + _T("\" ");
				sResult += _T("control2=\"") + m_oControl2.ToString() + _T("\" ");
				sResult += _T("to=\"")       + m_oTo.ToString()       + _T("\">");

				sResult += CVmlShapeElements::toXML();

				sResult += _T("</v:curve>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_v_curve;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				if ( oReader.GetAttributesCount() <= 0 )
					return;
				
				if ( !oReader.MoveToFirstAttribute() )
					return;
				
				CWCharWrapper wsName = oReader.GetName();
				while( !wsName.IsNull() )
				{
					wchar_t wsChar = wsName[0];
					switch ( wsChar )
					{
					case 'c':
						if      ( _T("control1") == wsName ) m_oControl1 = oReader.GetText();
						else if ( _T("control2") == wsName ) m_oControl2 = oReader.GetText();
						break;

					case 'f':
						if      ( _T("from")     == wsName ) m_oFrom     = oReader.GetText();
						break;

					case 't':
						if      ( _T("to")       == wsName ) m_oTo       = oReader.GetText();
						break;
					}

					if ( !oReader.MoveToNextAttribute() )
						break;

					wsName = oReader.GetName();
				}
				oReader.MoveToElement();
			}

		public:

			
			SimpleTypes::Vml::CVml_Vector2D_Units m_oFrom;
			SimpleTypes::Vml::CVml_Vector2D_Units m_oControl1;
			SimpleTypes::Vml::CVml_Vector2D_Units m_oControl2;
			SimpleTypes::Vml::CVml_Vector2D_Units m_oTo;

		};
		
		
		
		class CF : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CF)
			CF()
			{
			}
			virtual ~CF()
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
				CString sResult = _T("<v:f eqn=\"") + m_sEqn + _T("\"/>");
				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_v_f;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				if ( oReader.GetAttributesCount() <= 0 )
					return;
				
				if ( !oReader.MoveToFirstAttribute() )
					return;
				
				CWCharWrapper wsName = oReader.GetName();
				while( !wsName.IsNull() )
				{
					wchar_t wsChar = wsName[0];
					switch ( wsChar )
					{
					case 'e':
						if      ( _T("eqn") == wsName ) m_sEqn = oReader.GetText();
						break;
					}

					if ( !oReader.MoveToNextAttribute() )
						break;

					wsName = oReader.GetName();
				}
				oReader.MoveToElement();

				
			}

		public:

			
			CString m_sEqn;

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

				if ( oReader.IsEmptyNode() )
					return;

				int nCurDepth = oReader.GetDepth();
				while ( oReader.ReadNextSiblingNode( nCurDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();
					if ( _T("o:fill") == sName )
						m_oFill = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<v:fill ");
								
				ComplexTypes_WriteAttribute2( _T("id=\""), m_sId );
				sResult += _T("type=\"") + m_oType.ToString() + _T("\" ");
				
				if ( SimpleTypes::booleanTrue != m_oOn.GetValue() )
					sResult += _T("on=\"false\" ");

				if ( SimpleTypes::colortypeWhite != m_oColor.GetValue() )
					sResult += _T("color=\"") + m_oColor.ToString() + _T("\" ");

				if ( 1 != m_oOpacity.GetValue() )
					sResult += _T("opacity=\"") + m_oOpacity.ToString() + _T("\" ");

				if ( SimpleTypes::colortypeWhite != m_oColor2.GetValue() )
					sResult += _T("color2=\"") + m_oColor2.ToString() + _T("\" ");

				ComplexTypes_WriteAttribute2( _T("src=\""),       m_sSrc );
				ComplexTypes_WriteAttribute2( _T("o:href=\""),    m_sHref );
				ComplexTypes_WriteAttribute2( _T("o:althref=\""), m_sAltHref );
				ComplexTypes_WriteAttribute ( _T("size=\""),      m_oSize );
				ComplexTypes_WriteAttribute ( _T("origin=\""),    m_oOrigin );
				ComplexTypes_WriteAttribute ( _T("position=\""),  m_oPosition );

				if ( SimpleTypes::imageaspectIgnore != m_oAspect.GetValue() )
					sResult += _T("aspect=\"") + m_oAspect.ToString() + _T("\" ");

				

				ComplexTypes_WriteAttribute ( _T("angle=\""),         m_oAngle );

				if ( SimpleTypes::booleanTrue != m_oAlignShape.GetValue() )
					sResult += _T("alignshape=\"false\" ");

				if ( 0 != m_oFocus.GetValue() )
					sResult += _T("focus=\"") + m_oFocus.ToString() + _T("\" ");

				if ( 0 != m_oFocusPosition.GetX() || 0 != m_oFocusPosition.GetY() )
					sResult += _T("focusposition=\"") + m_oFocusPosition.ToString() + _T("\" ");

				if ( 0 != m_oFocusSize.GetX() || 0 != m_oFocusSize.GetY() )
					sResult += _T("focussize=\"") + m_oFocusSize.ToString() + _T("\" ");

				if ( SimpleTypes::fillmethodSigma != m_oMethod.GetValue() )
					sResult += _T("method=\"") + m_oMethod.ToString() + _T("\" ");

				ComplexTypes_WriteAttribute ( _T("o:detectmouseclick=\""), m_oDetectMouseClick );
				ComplexTypes_WriteAttribute2( _T("o:title=\""),            m_sTitle );

				if ( 1 != m_oOpacity2.GetValue() )
					sResult += _T("o:opacity2=\"") + m_oOpacity2.ToString() + _T("\" ");

				if ( SimpleTypes::booleanFalse != m_oRecolor.GetValue() )
					sResult += _T("recolor=\"true\" ");

				if ( SimpleTypes::booleanFalse != m_oRotate.GetValue() )
					sResult += _T("rotate=\"true\" ");

				ComplexTypes_WriteAttribute ( _T("r:id=\""),    m_rId );
				ComplexTypes_WriteAttribute ( _T("o:relid=\""), m_oRelId );

				sResult += _T(">");

				if ( m_oFill.IsInit() )
					sResult += m_oFill->toXML();

				sResult += _T("</v:fill>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_v_fill;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				m_oOpacity.SetValue( 1.0 );
				m_oOpacity2.SetValue( 1.0 );
				m_oFocus.SetValue( 0 );
				m_oFocusPosition.SetValue( 0.0, 0.0 );
				m_oFocusSize.SetValue( 0.0, 0.0 );

				CString sColors;
				
				if ( oReader.GetAttributesCount() <= 0 )
					return;
				
				if ( !oReader.MoveToFirstAttribute() )
					return;
				
				CWCharWrapper wsName = oReader.GetName();
				while( !wsName.IsNull() )
				{
					wchar_t wsChar = wsName[0];
					switch ( wsChar )
					{
					case 'a':
						if      ( _T("aspect")     == wsName ) m_oAspect     = oReader.GetText();
						else if ( _T("angle")      == wsName ) m_oAngle      = oReader.GetText();
						else if ( _T("alignshape") == wsName ) m_oAlignShape = oReader.GetText();
						break;

					case 'c':
						if      ( _T("color")  == wsName ) m_oColor   = oReader.GetText();
						else if ( _T("color2") == wsName ) m_oColor2  = oReader.GetText();
						else if ( _T("colors") == wsName ) sColors    = oReader.GetText();
						break;

					case 'i':
						if      ( _T("id")   == wsName ) m_sId  = oReader.GetText();
						break;

					case 'm':
						if      ( _T("method")   == wsName ) m_oMethod = oReader.GetText();
						break;

					case 'f':
						if      ( _T("focus")         == wsName ) m_oFocus         = oReader.GetText();
						else if ( _T("focussize")     == wsName ) m_oFocusSize     = oReader.GetText();
						else if ( _T("focusposition") == wsName ) m_oFocusPosition = oReader.GetText();
						break;

					case 'o':
						if      ( _T("on")                 == wsName ) m_oOn               = oReader.GetText();
						else if ( _T("opacity")            == wsName ) m_oOpacity          = oReader.GetText();
						else if ( _T("o:href")             == wsName ) m_sHref             = oReader.GetText();
						else if ( _T("o:althref")          == wsName ) m_sAltHref          = oReader.GetText();
						else if ( _T("origin")             == wsName ) m_oOrigin           = oReader.GetText();
						else if ( _T("o:detectmouseclick") == wsName ) m_oDetectMouseClick = oReader.GetText();
						else if ( _T("o:title")            == wsName ) m_sTitle            = oReader.GetText();
						else if ( _T("o:opacity2")         == wsName ) m_oOpacity2         = oReader.GetText();
						else if ( _T("o:relid")            == wsName ) m_oRelId            = oReader.GetText();
						break;

					case 'p':
						if      ( _T("position") == wsName ) m_oPosition = oReader.GetText();
						break;

					case 'r':
						if      ( _T("recolor") == wsName ) m_oRecolor = oReader.GetText();
						else if ( _T("rotate")  == wsName ) m_oRotate  = oReader.GetText();
						else if ( _T("r:id")    == wsName ) m_rId      = oReader.GetText();
						break;

					case 's':
						if      ( _T("src")   == wsName ) m_sSrc    = oReader.GetText();
						else if ( _T("size")  == wsName ) m_oSize   = oReader.GetText();
						break;

					case 't':
						if      ( _T("type") == wsName ) m_oType = oReader.GetText();
						break;
					}

					if ( !oReader.MoveToNextAttribute() )
						break;

					wsName = oReader.GetName();
				}
				oReader.MoveToElement();

				
			}

		public:

			typedef struct TIntermediateColor
			{
				double                    dValue;
				SimpleTypes::CColorType<> oColor;
			};

			
			SimpleTypes::CTrueFalse<SimpleTypes::booleanTrue>         m_oAlignShape;
			nullable<CString>                                         m_sAltHref;
			nullable<SimpleTypes::CDecimalNumber<>>                   m_oAngle;
			SimpleTypes::CImageAspect<SimpleTypes::imageaspectIgnore> m_oAspect;
			SimpleTypes::CColorType<SimpleTypes::colortypeWhite>      m_oColor;
			SimpleTypes::CColorType<SimpleTypes::colortypeWhite>      m_oColor2;
			CSimpleArray<TIntermediateColor>                          m_arrColors;
			nullable<SimpleTypes::CTrueFalse<>>                       m_oDetectMouseClick;
			SimpleTypes::CFixedPercentage                             m_oFocus;
			SimpleTypes::Vml::CVml_Vector2D_Percentage                m_oFocusPosition;
			SimpleTypes::Vml::CVml_Vector2D_Percentage                m_oFocusSize;
			nullable<CString>                                         m_sHref;
			nullable<SimpleTypes::CRelationshipId>                    m_rId;
			nullable<CString>                                         m_sId;
			SimpleTypes::CFillMethod<SimpleTypes::fillmethodSigma>    m_oMethod;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanTrue>         m_oOn;
			SimpleTypes::Vml::CVml_1_65536                            m_oOpacity;
			SimpleTypes::Vml::CVml_1_65536                            m_oOpacity2;
			nullable<SimpleTypes::Vml::CVml_Vector2D_1_65536>         m_oOrigin;
			nullable<SimpleTypes::Vml::CVml_Vector2D_1_65536>         m_oPosition;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanFalse>        m_oRecolor;
			nullable<SimpleTypes::CRelationshipId>                    m_oRelId;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanFalse>        m_oRotate;
			nullable<SimpleTypes::Vml::CVml_Vector2D_Units>           m_oSize;
			nullable<CString>                                         m_sSrc;
			nullable<CString>                                         m_sTitle;
			SimpleTypes::CFillType<SimpleTypes::filltypeSolid, 0>     m_oType;

			
			nullable<OOX::VmlOffice::CFill>                           m_oFill;

		};
		
		
		
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
					if ( _T("v:fill") == sName )
						m_oFill = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<v:background ");
								
				ComplexTypes_WriteAttribute2( _T("id=\""), m_sId );
				
				if ( SimpleTypes::booleanTrue != m_oFilled.GetValue() )
					sResult += _T("filled=\"false\" ");

				if ( SimpleTypes::colortypeWhite != m_oFillColor.GetValue() )
					sResult += _T("fillcolor=\"") + m_oFillColor.ToString() + _T("\" ");

				ComplexTypes_WriteAttribute ( _T("o:bwmode=\""),           m_oBwMode );
				ComplexTypes_WriteAttribute ( _T("o:bwpure=\""),           m_oBwPure );
				ComplexTypes_WriteAttribute ( _T("o:bwnormal=\""),         m_oBwNormal );
				ComplexTypes_WriteAttribute ( _T("o:targetscreensize=\""), m_oTargetScreenSize );

				sResult += _T(">");

				if ( m_oFill.IsInit() )
					sResult += m_oFill->toXML();

				sResult += _T("</v:background>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_v_background;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				if ( oReader.GetAttributesCount() <= 0 )
					return;
				
				if ( !oReader.MoveToFirstAttribute() )
					return;
				
				CWCharWrapper wsName = oReader.GetName();
				while( !wsName.IsNull() )
				{
					wchar_t wsChar = wsName[0];
					switch ( wsChar )
					{
					case 'f':
						if      ( _T("fillcolor")  == wsName ) m_oFillColor          = oReader.GetText();
						else if ( _T("filled")     == wsName ) m_oFilled             = oReader.GetText();
						break;

					case 'i':
						if      ( _T("id")         == wsName ) m_sId  = oReader.GetText();
						break;

					case 'o':
						if      ( _T("o:bwmode")   == wsName ) m_oBwMode             = oReader.GetText();
						else if ( _T("o:bwnormal") == wsName ) m_oBwNormal           = oReader.GetText();
						else if ( _T("o:bwpure")   == wsName ) m_oBwPure             = oReader.GetText();
						break;

					case 't':
						if      ( _T("o:targetscreensize") == wsName ) m_oTargetScreenSize = oReader.GetText();
						break;
					}

					if ( !oReader.MoveToNextAttribute() )
						break;

					wsName = oReader.GetName();
				}
				oReader.MoveToElement();
			}

		public:

			
			nullable<SimpleTypes::CBWMode<>>                     m_oBwMode;
			nullable<SimpleTypes::CBWMode<>>                     m_oBwNormal;
			nullable<SimpleTypes::CBWMode<>>                     m_oBwPure;
			SimpleTypes::CColorType<SimpleTypes::colortypeWhite> m_oFillColor;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanTrue>    m_oFilled;
			nullable<CString>                                    m_sId;
			nullable<SimpleTypes::CScreenSize<>>                 m_oTargetScreenSize;

			
			nullable<OOX::Vml::CFill>                            m_oFill;

		};
		
		
		
		class CFormulas : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CFormulas)
			CFormulas()
			{
			}
			virtual ~CFormulas()
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

				int nCurDepth = oReader.GetDepth();
				while ( oReader.ReadNextSiblingNode( nCurDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();
					if ( _T("v:f") == sName )
					{
						OOX::Vml::CF oF = oReader;
						m_arrF.Add( oF );
					}
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<v:formulas>");

				for ( int nIndex = 0; nIndex < m_arrF.GetSize(); nIndex++ )
					sResult += m_arrF[nIndex].toXML();

				sResult += _T("</v:formulas>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_v_formulas;
			}


		public:

			
			CSimpleArray<OOX::Vml::CF> m_arrF;

		};
		
		
		
		class CGroup : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CGroup)
			CGroup()
			{
			}
			virtual ~CGroup()
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
				return OOX::et_v_group;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				m_oHrPct.SetValue( 0 );

				
				if ( oReader.GetAttributesCount() <= 0 )
					return;
				
				if ( !oReader.MoveToFirstAttribute() )
					return;
				
				CWCharWrapper wsName = oReader.GetName();
				while( !wsName.IsNull() )
				{
					wchar_t wsChar = wsName[0];
					switch ( wsChar )
					{
					case 'a':
						if      ( _T("alt") == wsName ) m_sAlt = oReader.GetText();
						break;

					case 'c':
						if      ( _T("class")       == wsName ) m_sClass       = oReader.GetText();
						else if ( _T("coordorigin") == wsName ) m_oCoordOrigin = oReader.GetText();
						else if ( _T("coordsize")   == wsName ) m_oCoordSize   = oReader.GetText();
						break;

					case 'e':
						if      ( _T("editas") == wsName ) m_oEditAs = oReader.GetText();
						break;

					case 'f':
						if      ( _T("fillcolor") == wsName ) m_oFillColor = oReader.GetText();
						else if ( _T("filled")    == wsName ) m_oFilled    = oReader.GetText();
						break;

					case 'h':
						if      ( _T("href") == wsName ) m_sHref = oReader.GetText();
						break;

					case 'i':
						if      ( _T("id")       == wsName ) m_sId       = oReader.GetText();
						break;

					case 'o':
						{
							wchar_t wsChar2 = wsName[2]; 
							switch ( wsChar2 )
							{
							case 'a':
								if      ( _T("o:allowincell")  == wsName ) m_oAllowInCell  = oReader.GetText();
								else if ( _T("o:allowoverlap") == wsName ) m_oAllowOverlap = oReader.GetText();
								break;
							case 'b':
								if      ( _T("o:borderbottomcolor") == wsName ) m_oBorderBottomColor = oReader.GetText();
								else if ( _T("o:borderleftcolor")   == wsName ) m_oBorderLeftColor   = oReader.GetText();
								else if ( _T("o:borderrightcolor")  == wsName ) m_oBorderRightColor  = oReader.GetText();
								else if ( _T("o:bordertopcolor")    == wsName ) m_oBorderTopColor    = oReader.GetText();
								else if ( _T("o:bullet")            == wsName ) m_oBullet            = oReader.GetText();
								else if ( _T("o:button")            == wsName ) m_oButton            = oReader.GetText();
								break;
							case 'd':
								if      ( _T("o:doubleclicknotify") == wsName ) m_oDoubleClickNotify = oReader.GetText();
								else if ( _T("o:dgmlayout")         == wsName ) m_oDgmLayout         = oReader.GetText();
								else if ( _T("o:dgmlayoutmru")      == wsName ) m_oDgmLayoutMru      = oReader.GetText();
								else if ( _T("o:dgmnodekind")       == wsName ) m_oDgmNodeKind       = oReader.GetText();
								break;
							case 'h':  
								if      ( _T("o:hr")        == wsName ) m_oHr        = oReader.GetText();
								else if ( _T("o:hralign")   == wsName ) m_oHrAlign   = oReader.GetText();
								else if ( _T("o:hrnoshade") == wsName ) m_oHrNoShade = oReader.GetText();
								else if ( _T("o:hrpct")     == wsName ) m_oHrPct     = oReader.GetText();
								else if ( _T("o:hrstd")     == wsName ) m_oHrStd     = oReader.GetText();
								break;
							case 'i':
								if      ( _T("o:insetmode") == wsName ) m_oInsetMode = oReader.GetText();
								break;
							case 'o':  
								if      ( _T("o:oned")    == wsName ) m_oOned       = oReader.GetText();
								break;
							case 'r':
								if      ( _T("o:regroupid") == wsName ) m_oRegroupId = oReader.GetText();
								break;
							case 's':
								if      ( _T("o:spid") == wsName ) m_sSpId = oReader.GetText();
								break;
							case 't':
								if      ( _T("o:tableproperties")  == wsName ) m_oTableProperties = oReader.GetText();
								else if ( _T("o:tablelimits")      == wsName ) m_oTableLimits     = oReader.GetText();
								break;
							case 'u':
								if      ( _T("o:userdrawn")  == wsName ) m_oUserDrawn  = oReader.GetText();
								else if ( _T("o:userhidden") == wsName ) m_oUserHidden = oReader.GetText();
								break;
							}

						break;
						}

					case 'p':
						if      ( _T("print") == wsName ) m_oPrint = oReader.GetText();
						break;
					case 's':
						if      ( _T("style") == wsName ) m_oStyle = oReader.GetText();
						break;
					case 't':
						if      ( _T("target") == wsName ) m_sTarget = oReader.GetText();
						else if ( _T("title")  == wsName ) m_sTitle  = oReader.GetText();
						break;
					case 'w':
						if      ( _T("wrapcoords") == wsName ) m_oWrapCoords = oReader.GetText();
						break;
					}

					if ( !oReader.MoveToNextAttribute() )
						break;

					wsName = oReader.GetName();
				}
				oReader.MoveToElement();
			}

		public:


			

			
			nullable<CString>                                               m_sId;
			nullable<SimpleTypes::Vml::CCssStyle>                           m_oStyle;
			nullable<CString>                                               m_sHref;
			nullable<CString>                                               m_sTarget;
			nullable<CString>                                               m_sClass;
			nullable<CString>                                               m_sTitle;
			nullable<CString>                                               m_sAlt;
			nullable<SimpleTypes::Vml::CVml_Vector2D>                       m_oCoordSize;
			nullable<SimpleTypes::Vml::CVml_Vector2D>                       m_oCoordOrigin;
			nullable<SimpleTypes::Vml::CVml_Polygon2D>                      m_oWrapCoords;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanTrue>               m_oPrint;
			nullable<CString>                                               m_sSpId;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanFalse>              m_oOned;
			nullable<SimpleTypes::CDecimalNumber<>>                         m_oRegroupId;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanFalse>              m_oDoubleClickNotify;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanFalse>              m_oButton;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanFalse>              m_oUserHidden;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanFalse>              m_oBullet;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanFalse>              m_oHr;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanFalse>              m_oHrStd;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanFalse>              m_oHrNoShade;
			SimpleTypes::CDouble                                            m_oHrPct;
			SimpleTypes::CHrAlign<SimpleTypes::hralignLeft>                 m_oHrAlign;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanFalse>              m_oAllowInCell;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanFalse>              m_oAllowOverlap;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanFalse>              m_oUserDrawn;
			nullable<SimpleTypes::CColorType<>>                             m_oBorderTopColor;
			nullable<SimpleTypes::CColorType<>>                             m_oBorderLeftColor;
			nullable<SimpleTypes::CColorType<>>                             m_oBorderBottomColor;
			nullable<SimpleTypes::CColorType<>>                             m_oBorderRightColor;
			nullable<SimpleTypes::CDiagramLayout<>>                         m_oDgmLayout;
			nullable<CString>                                               m_oDgmNodeKind;
			nullable<SimpleTypes::CDiagramLayout<>>                         m_oDgmLayoutMru;
			SimpleTypes::CInsetMode<SimpleTypes::insetmodeCustom>           m_oInsetMode;

			SimpleTypes::CTrueFalse<SimpleTypes::booleanTrue>               m_oFilled;
			SimpleTypes::CColorType<SimpleTypes::colortypeWhite>            m_oFillColor;
			nullable<SimpleTypes::CEditAs<>>                                m_oEditAs;
			nullable<SimpleTypes::Vml::CVml_TableLimits>                    m_oTableLimits;
			SimpleTypes::Vml::CVml_TableProperties<0>                       m_oTableProperties;                 

			
			CSimpleArray<WritingElement*>                                   m_arrItems;

		};
		
		
		
		class CH : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CH)
			CH()
			{
			}
			virtual ~CH()
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
				CString sResult = _T("<v:h ");

				if ( SimpleTypes::Vml::vmlvector2dposConstant != m_oPosition.GetTypeX() || SimpleTypes::Vml::vmlvector2dposConstant != m_oPosition.GetTypeY() || 0 != m_oPosition.GetX() || 0 != m_oPosition.GetY() )
					sResult += _T("position=\"") + m_oPosition.ToString() + _T("\" ");
								
				ComplexTypes_WriteAttribute ( _T("polar=\""), m_oPolar );

				if ( 0 != m_oMap.GetX() || 1000 != m_oMap.GetY() )
					sResult += _T("map=\"") + m_oMap.ToString() + _T("\" ");

				if ( SimpleTypes::booleanFalse != m_oInvX.GetValue() )
					sResult += _T("invx=\"true\" ");

				if ( SimpleTypes::booleanFalse != m_oInvY.GetValue() )
					sResult += _T("invy=\"true\" ");

				if ( SimpleTypes::booleanFalse != m_oSwitch.GetValue() )
					sResult += _T("switch=\"true\" ");

				if ( 0 != m_oXRange.GetX() || 0 != m_oXRange.GetY() )
					sResult += _T("xrange=\"") + m_oXRange.ToString() + _T("\" ");

				if ( 0 != m_oYRange.GetX() || 0 != m_oYRange.GetY() )
					sResult += _T("yrange=\"") + m_oYRange.ToString() + _T("\" ");

				if ( 0 != m_oRadiusRange.GetX() || 0 != m_oRadiusRange.GetY() )
					sResult += _T("radiusrange=\"") + m_oRadiusRange.ToString() + _T("\" ");

				sResult += _T("/>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_v_h;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				m_oMap.SetValue( 0, 1000 );
				m_oPosition.SetConstantX( 0 );
				m_oPosition.SetConstantY( 0 );
				m_oRadiusRange.SetValue( 0, 0 );
				m_oXRange.SetValue( 0, 0 );
				m_oYRange.SetValue( 0, 0 );

				
				if ( oReader.GetAttributesCount() <= 0 )
					return;
				
				if ( !oReader.MoveToFirstAttribute() )
					return;
				
				CWCharWrapper wsName = oReader.GetName();
				while( !wsName.IsNull() )
				{
					wchar_t wsChar = wsName[0];
					switch ( wsChar )
					{
					case 'i':
						if      ( _T("invx") == wsName ) m_oInvX = oReader.GetText();
						else if ( _T("invy") == wsName ) m_oInvY = oReader.GetText();
						break;

					case 'm':
						if      ( _T("map") == wsName ) m_oMap = oReader.GetText();
						break;

					case 'p':
						if      ( _T("position") == wsName ) m_oPosition = oReader.GetText();
						else if ( _T("polar")    == wsName ) m_oPolar    = oReader.GetText();
						break;

					case 'r':
						if      ( _T("radiusrange") == wsName ) m_oRadiusRange = oReader.GetText();
						break;

					case 's':
						if      ( _T("switch") == wsName ) m_oSwitch = oReader.GetText();
						break;

					case 'x':
						if      ( _T("xrange") == wsName ) m_oXRange = oReader.GetText();
						break;
					case 'y':
						if      ( _T("yrange") == wsName ) m_oYRange = oReader.GetText();
						break;
					}

					if ( !oReader.MoveToNextAttribute() )
						break;

					wsName = oReader.GetName();
				}
				oReader.MoveToElement();
			}

		public:

			
			SimpleTypes::CTrueFalse<SimpleTypes::booleanFalse>        m_oInvX;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanFalse>        m_oInvY;
			SimpleTypes::Vml::CVml_Vector2D                           m_oMap;
			nullable<SimpleTypes::Vml::CVml_Vector2D>                 m_oPolar;
			SimpleTypes::Vml::CVml_Vector2D_Position                  m_oPosition;
			SimpleTypes::Vml::CVml_Vector2D                           m_oRadiusRange;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanFalse>        m_oSwitch;
			SimpleTypes::Vml::CVml_Vector2D                           m_oXRange;
			SimpleTypes::Vml::CVml_Vector2D                           m_oYRange;
		};
		
		
		
		class CHandles : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CHandles)
			CHandles()
			{
			}
			virtual ~CHandles()
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

				int nCurDepth = oReader.GetDepth();
				while ( oReader.ReadNextSiblingNode( nCurDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();
					if ( _T("v:h") == sName )
					{
						OOX::Vml::CH oH = oReader;
						m_arrH.Add( oH );
					}
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<v:handles>");

				for ( int nIndex = 0; nIndex < m_arrH.GetSize(); nIndex++ )
					sResult += m_arrH[nIndex].toXML();

				sResult += _T("</v:handles>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_v_handles;
			}


		public:

			
			CSimpleArray<OOX::Vml::CH> m_arrH;

		};
		
		
		
		class CImage : public CVmlAttributes, public CVmlShapeElements
		{
		public:
			WritingElement_AdditionConstructors(CImage)
			CImage()
			{
			}
			virtual ~CImage()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );
				CVmlAttributes::fromXML( oReader );

				CVmlShapeElements::fromXML( oReader );
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<v:image ");

				sResult += CVmlAttributes::toXML();

				if ( _T("") !=  m_sSrc )
					sResult += _T("src=\"") + m_sSrc + _T("\" ");

				if ( 0 != m_oCropLeft.GetValue() )
					sResult += _T("cropleft=\"") + m_oCropLeft.ToString() + _T("\" ");

				if ( 0 != m_oCropTop.GetValue() )
					sResult += _T("croptop=\"") + m_oCropTop.ToString() + _T("\" ");

				if ( 0 != m_oCropRight.GetValue() )
					sResult += _T("cropright=\"") + m_oCropRight.ToString() + _T("\" ");

				if ( 0 != m_oCropBottom.GetValue() )
					sResult += _T("cropbottom=\"") + m_oCropBottom.ToString() + _T("\" ");

				if ( 1 != m_oGain.GetValue() )
					sResult += _T("gain=\"") + m_oGain.ToString() + _T("\" ");

				if ( 0 != m_oBlackLevel.GetValue() )
					sResult += _T("blacklevel=\"") + m_oBlackLevel.ToString() + _T("\" ");

				if ( 1 != m_oGamma.GetValue() )
					sResult += _T("gamma=\"") + m_oGamma.ToString() + _T("\" ");

				if ( SimpleTypes::booleanFalse != m_oGrayscale.GetValue() )
					sResult += _T("grayscale=\"true\" ");

				if ( SimpleTypes::booleanFalse != m_oBiLevel.GetValue() )
					sResult += _T("bilevel=\"true\" ");

				sResult += _T(">");

				sResult += CVmlShapeElements::toXML();

				sResult += _T("</v:image>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_v_image;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				m_oBlackLevel.SetValue( 0.0 );
				m_oCropLeft.SetValue( 0.0 );
				m_oCropRight.SetValue( 0.0 );
				m_oCropBottom.SetValue( 0.0 );
				m_oCropTop.SetValue( 0.0 );
				m_oGain.SetValue( 1.0 );
				m_oGamma.SetValue( 1.0 );

				
				if ( oReader.GetAttributesCount() <= 0 )
					return;
				
				if ( !oReader.MoveToFirstAttribute() )
					return;
				
				CWCharWrapper wsName = oReader.GetName();
				while( !wsName.IsNull() )
				{
					wchar_t wsChar = wsName[0];
					switch ( wsChar )
					{
					case 'b':
						if      ( _T("bilevel")    == wsName ) m_oBiLevel    = oReader.GetText();
						else if ( _T("blacklevel") == wsName ) m_oBlackLevel = oReader.GetText();
						break;

					case 'c':
						if      ( _T("chromakey")  == wsName ) m_oChromaKey  = oReader.GetText();
						else if ( _T("cropleft")   == wsName ) m_oCropLeft   = oReader.GetText();
						else if ( _T("croptop")    == wsName ) m_oCropTop    = oReader.GetText();
						else if ( _T("cropright")  == wsName ) m_oCropRight  = oReader.GetText();
						else if ( _T("cropbottom") == wsName ) m_oCropBottom = oReader.GetText();
						break;

					case 'g':
						if      ( _T("gain")       == wsName ) m_oGain       = oReader.GetText();
						if      ( _T("gamma")      == wsName ) m_oGamma      = oReader.GetText();
						if      ( _T("grayscale")  == wsName ) m_oGrayscale  = oReader.GetText();
						break;

					case 's':
						if      ( _T("src")        == wsName ) m_sSrc       = oReader.GetText();
						break;
					}

					if ( !oReader.MoveToNextAttribute() )
						break;

					wsName = oReader.GetName();
				}
				oReader.MoveToElement();
			}

		public:

			
			CString                                            m_sSrc;
			SimpleTypes::Vml::CVml_1_65536                     m_oCropLeft;
			SimpleTypes::Vml::CVml_1_65536                     m_oCropTop;
			SimpleTypes::Vml::CVml_1_65536                     m_oCropRight;
			SimpleTypes::Vml::CVml_1_65536                     m_oCropBottom;
			SimpleTypes::CDouble                               m_oGain;
			SimpleTypes::CDouble                               m_oBlackLevel;
			SimpleTypes::CDouble                               m_oGamma;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanFalse> m_oGrayscale;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanFalse> m_oBiLevel;
		};
		
		
		
		class CImageData : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CImageData)
			CImageData()
			{
			}
			virtual ~CImageData()
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
				CString sResult = _T("<v:imagedata ");

				ComplexTypes_WriteAttribute2( _T("id=\""), m_oId );

				if ( _T("") !=  m_sSrc )
					sResult += _T("src=\"") + m_sSrc + _T("\" ");

				if ( 0 != m_oCropLeft.GetValue() )
					sResult += _T("cropleft=\"") + m_oCropLeft.ToString() + _T("\" ");

				if ( 0 != m_oCropTop.GetValue() )
					sResult += _T("croptop=\"") + m_oCropTop.ToString() + _T("\" ");

				if ( 0 != m_oCropRight.GetValue() )
					sResult += _T("cropright=\"") + m_oCropRight.ToString() + _T("\" ");

				if ( 0 != m_oCropBottom.GetValue() )
					sResult += _T("cropbottom=\"") + m_oCropBottom.ToString() + _T("\" ");

				if ( 1 != m_oGain.GetValue() )
					sResult += _T("gain=\"") + m_oGain.ToString() + _T("\" ");

				if ( 0 != m_oBlackLevel.GetValue() )
					sResult += _T("blacklevel=\"") + m_oBlackLevel.ToString() + _T("\" ");

				if ( 1 != m_oGamma.GetValue() )
					sResult += _T("gamma=\"") + m_oGamma.ToString() + _T("\" ");

				if ( SimpleTypes::booleanFalse != m_oGrayscale.GetValue() )
					sResult += _T("grayscale=\"true\" ");

				if ( SimpleTypes::booleanFalse != m_oBiLevel.GetValue() )
					sResult += _T("bilevel=\"true\" ");

				ComplexTypes_WriteAttribute ( _T("chromakey=\""),    m_oChromaKey );
				ComplexTypes_WriteAttribute ( _T("embosscolor=\""),  m_oEmbossColor );

				ComplexTypes_WriteAttribute2( _T("o:href=\""),             m_oHref );
				ComplexTypes_WriteAttribute2( _T("o:althref=\""),          m_sAltHref );
				ComplexTypes_WriteAttribute2( _T("o:title=\""),            m_sTitle );
				ComplexTypes_WriteAttribute2( _T("o:oleid=\""),            m_oOleId );
				ComplexTypes_WriteAttribute ( _T("o:detectmouseclick=\""), m_oDetectMouseClick );
				ComplexTypes_WriteAttribute ( _T("o:movie=\""),            m_oMovie );
				ComplexTypes_WriteAttribute ( _T("o:relid=\""),            m_oRelId );

				ComplexTypes_WriteAttribute ( _T("r:id=\""),               m_rId );
				ComplexTypes_WriteAttribute ( _T("r:pict=\""),             m_rPict );
				ComplexTypes_WriteAttribute ( _T("r:href=\""),             m_rHref );

				sResult += _T("/>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_v_imagedata;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				m_oBlackLevel.SetValue( 0.0 );
				m_oCropLeft.SetValue( 0.0 );
				m_oCropRight.SetValue( 0.0 );
				m_oCropBottom.SetValue( 0.0 );
				m_oCropTop.SetValue( 0.0 );
				m_oGain.SetValue( 1.0 );
				m_oGamma.SetValue( 1.0 );

				
				if ( oReader.GetAttributesCount() <= 0 )
					return;
				
				if ( !oReader.MoveToFirstAttribute() )
					return;
				
				CWCharWrapper wsName = oReader.GetName();
				while( !wsName.IsNull() )
				{
					wchar_t wsChar = wsName[0];
					switch ( wsChar )
					{
					case 'a':
						if      ( _T("althref")    == wsName ) m_sAltHref    = oReader.GetText();
						break;

					case 'b':
						if      ( _T("bilevel")    == wsName ) m_oBiLevel    = oReader.GetText();
						else if ( _T("blacklevel") == wsName ) m_oBlackLevel = oReader.GetText();
						break;

					case 'c':
						if      ( _T("cropleft")   == wsName ) m_oCropLeft   = oReader.GetText();
						else if ( _T("croptop")    == wsName ) m_oCropTop    = oReader.GetText();
						else if ( _T("cropright")  == wsName ) m_oCropRight  = oReader.GetText();
						else if ( _T("cropbottom") == wsName ) m_oCropBottom = oReader.GetText();
						break;

					case 'e':
						if      ( _T("embosscolor")== wsName ) m_oEmbossColor= oReader.GetText();
						break;

					case 'g':
						if      ( _T("gain")       == wsName ) m_oGain       = oReader.GetText();
						if      ( _T("gamma")      == wsName ) m_oGamma      = oReader.GetText();
						if      ( _T("grayscale")  == wsName ) m_oGrayscale  = oReader.GetText();
						break;

					case 'i':
						if      ( _T("id")         == wsName ) m_oId         = oReader.GetText();
						break;

					case 'o':
						{
							wchar_t wsChar2 = wsName[2]; 
							switch ( wsChar2 )
							{
							case 'd':
								if      ( _T("o:detectmouseclick") == wsName ) m_oDetectMouseClick = oReader.GetText();
								break;
							case 'h':
								if      ( _T("o:href")   == wsName ) m_oHref    = oReader.GetText();
								break;
							case 'm':
								if      ( _T("o:movie")  == wsName ) m_oMovie   = oReader.GetText();
								break;
							case 'o':
								if      ( _T("o:oleid")  == wsName ) m_oOleId   = oReader.GetText();
								break;
							case 'r':
								if      ( _T("o:relid")  == wsName ) m_oRelId   = oReader.GetText();
								break;
							case 't':
								if      ( _T("title")    == wsName ) m_sTitle   = oReader.GetText();
								break;
							}

						break;
						}

					case 'r':
						if      ( _T("r:href")        == wsName ) m_rHref          = oReader.GetText();
						else if ( _T("r:id")          == wsName ) m_rId            = oReader.GetText();
						else if ( _T("r:pict")        == wsName ) m_rPict          = oReader.GetText();
						else if ( _T("recolortarget") == wsName ) m_oRecolorTarget = oReader.GetText();
						break;

					case 's':
						if      ( _T("src")           == wsName ) m_sSrc           = oReader.GetText();
						break;
					}

					if ( !oReader.MoveToNextAttribute() )
						break;

					wsName = oReader.GetName();
				}
				oReader.MoveToElement();
			}

		public:

			
			nullable<CString>                                         m_sAltHref;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanFalse>        m_oBiLevel;
			SimpleTypes::CDouble                                      m_oBlackLevel;
			nullable<SimpleTypes::CColorType<>>                       m_oChromaKey;
			SimpleTypes::Vml::CVml_1_65536                            m_oCropLeft;
			SimpleTypes::Vml::CVml_1_65536                            m_oCropTop;
			SimpleTypes::Vml::CVml_1_65536                            m_oCropRight;
			SimpleTypes::Vml::CVml_1_65536                            m_oCropBottom;
			nullable<SimpleTypes::CTrueFalse<>>                       m_oDetectMouseClick;
			nullable<SimpleTypes::CColorType<>>                       m_oEmbossColor;
			SimpleTypes::CDouble                                      m_oGain;
			SimpleTypes::CDouble                                      m_oGamma;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanFalse>        m_oGrayscale;
			nullable<SimpleTypes::CRelationshipId>                    m_rHref;
			nullable<CString>                                         m_oHref;
			nullable<SimpleTypes::CRelationshipId>                    m_rId;
			nullable<CString>                                         m_oId;
			nullable<SimpleTypes::CDouble>                            m_oMovie;
			nullable<CString>                                         m_oOleId;
			nullable<SimpleTypes::CRelationshipId>                    m_rPict;
			nullable<SimpleTypes::CColorType<>>                       m_oRecolorTarget;
			nullable<SimpleTypes::CRelationshipId>                    m_oRelId;
			CString                                                   m_sSrc;
			nullable<CString>                                         m_sTitle;
		};
		
		
		
		class CLine : public CVmlAttributes, public CVmlShapeElements
		{
		public:
			WritingElement_AdditionConstructors(CLine)
			CLine()
			{
			}
			virtual ~CLine()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );
				CVmlAttributes::fromXML( oReader );

				CVmlShapeElements::fromXML( oReader );
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<v:line ");

				sResult += CVmlAttributes::toXML();

				sResult += _T("from=\"") + m_oFrom.ToString() + _T("\" ");
				sResult += _T("to=\"")   + m_oTo.ToString()   + _T("\">");

				sResult += CVmlShapeElements::toXML();

				sResult += _T("</v:line>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_v_line;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				m_oFrom.SetValue( 0, 0 );
				m_oTo.SetValue( 10, 10 );

				
				if ( oReader.GetAttributesCount() <= 0 )
					return;
				
				if ( !oReader.MoveToFirstAttribute() )
					return;
				
				CWCharWrapper wsName = oReader.GetName();
				while( !wsName.IsNull() )
				{
					wchar_t wsChar = wsName[0];
					switch ( wsChar )
					{
					case 'f':
						if      ( _T("from") == wsName ) m_oFrom = oReader.GetText();
						break;

					case 't':
						if      ( _T("to")   == wsName ) m_oTo   = oReader.GetText();
						break;
					}

					if ( !oReader.MoveToNextAttribute() )
						break;

					wsName = oReader.GetName();
				}
				oReader.MoveToElement();
			}

		public:

			
			SimpleTypes::Vml::CVml_Vector2D_Units m_oFrom;
			SimpleTypes::Vml::CVml_Vector2D_Units m_oTo;

		};
		
		
		
		class COval : public CVmlAttributes, public CVmlShapeElements
		{
		public:
			WritingElement_AdditionConstructors(COval)
			COval()
			{
			}
			virtual ~COval()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				CVmlAttributes::fromXML( oReader );

				CVmlShapeElements::fromXML( oReader );
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<v:oval ");

				sResult += CVmlAttributes::toXML();

				sResult += _T(">");

				sResult += CVmlShapeElements::toXML();

				sResult += _T("</v:oval>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_v_oval;
			}

		};
		
		
		
		class CPath : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CPath)
			CPath()
			{
			}
			virtual ~CPath()
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
				CString sResult = _T("<v:path ");

				ComplexTypes_WriteAttribute2( _T("id=\""), m_oId );
				ComplexTypes_WriteAttribute ( _T("v=\""),  m_oV );

				if ( 0 != m_oLimo.GetX() || 0 != m_oLimo.GetY() )
					sResult += _T("limo=\"") + m_oLimo.ToString() + _T("\" ");

				ComplexTypes_WriteAttribute ( _T("textboxrect=\""), m_oTextBoxRect );

				if ( SimpleTypes::booleanTrue != m_oFillOk.GetValue() )
					sResult += _T("fillok=\"false\" ");
	
				if ( SimpleTypes::booleanTrue != m_oStrokeOk.GetValue() )
					sResult += _T("strokeok=\"false\" ");

				if ( SimpleTypes::booleanTrue != m_oShadowOk.GetValue() )
					sResult += _T("shadowok=\"false\" ");

				if ( SimpleTypes::booleanFalse != m_oArrowOk.GetValue() )
					sResult += _T("arrowok=\"true\" ");

				if ( SimpleTypes::booleanFalse != m_oGradientShapeOk.GetValue() )
					sResult += _T("gradientshapeok=\"true\" ");

				if ( SimpleTypes::booleanFalse != m_oTextPathOk.GetValue() )
					sResult += _T("textpathok=\"true\" ");

				if ( SimpleTypes::booleanFalse != m_oInsetPenOk.GetValue() )
					sResult += _T("insetpenok=\"true\" ");

				if ( SimpleTypes::connecttypeNone != m_oConnectType.GetValue() )
					sResult += _T("o:connecttype=\"") + m_oConnectType.ToString() + _T("\" ");

				ComplexTypes_WriteAttribute2( _T("o:connectlocs=\""),   m_oConnectLocs );
				ComplexTypes_WriteAttribute2( _T("o:connectangles=\""), m_oConnectAngles );

				if ( SimpleTypes::booleanTrue != m_oExtrusionOk.GetValue() )
					sResult += _T("extrusionok=\"false\" ");

				sResult += _T("/>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_v_path;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				m_oLimo.SetValue( 0, 0 );
				
				if ( oReader.GetAttributesCount() <= 0 )
					return;
				
				if ( !oReader.MoveToFirstAttribute() )
					return;
				
				CWCharWrapper wsName = oReader.GetName();
				while( !wsName.IsNull() )
				{
					wchar_t wsChar = wsName[0];
					switch ( wsChar )
					{
					case 'a':
						if      ( _T("arrowok")    == wsName ) m_oArrowOk    = oReader.GetText();
						break;

					case 'f':
						if      ( _T("fillok")     == wsName ) m_oFillOk     = oReader.GetText();
						break;

					case 'g':
						if      ( _T("gradientshapeok") == wsName ) m_oGradientShapeOk = oReader.GetText();
						break;

					case 'i':
						if      ( _T("id")         == wsName ) m_oId         = oReader.GetText();
						else if ( _T("insetpenok") == wsName ) m_oInsetPenOk = oReader.GetText();
						break;

					case 'l':
						if      ( _T("limo")       == wsName ) m_oLimo         = oReader.GetText();
						break;

					case 'o':
						{
							wchar_t wsChar2 = wsName[2]; 
							switch ( wsChar2 )
							{
							case 'c':
								if      ( _T("o:connectangles") == wsName ) m_oConnectAngles = oReader.GetText();
								else if ( _T("o:connectlocs")   == wsName ) m_oConnectLocs   = oReader.GetText();
								else if ( _T("o:connecttype")   == wsName ) m_oConnectType   = oReader.GetText();
								break;
							case 'e':
								if      ( _T("o:extrusionok")   == wsName ) m_oExtrusionOk   = oReader.GetText();
								break;
							}

						break;
						}

					case 's':
						if      ( _T("shadowok")    == wsName ) m_oShadowOk    = oReader.GetText();
						else if ( _T("strokeok")    == wsName ) m_oStrokeOk    = oReader.GetText();
						break;

					case 't':
						if      ( _T("textboxrect") == wsName ) m_oTextBoxRect = oReader.GetText();
						else if ( _T("textpathok")  == wsName ) m_oTextPathOk  = oReader.GetText();
						break;

					case 'v':
						if      ( _T("v")           == wsName ) m_oV           = oReader.GetText();
						break;
					}

					if ( !oReader.MoveToNextAttribute() )
						break;

					wsName = oReader.GetName();
				}
				oReader.MoveToElement();

				
			}

		public:

			
			SimpleTypes::CTrueFalse<SimpleTypes::booleanFalse>        m_oArrowOk;
			nullable<CString>                                         m_oConnectAngles;
			nullable<CString>                                         m_oConnectLocs;
			SimpleTypes::CConnectType<SimpleTypes::connecttypeNone>   m_oConnectType;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanTrue>         m_oExtrusionOk;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanTrue>         m_oFillOk;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanFalse>        m_oGradientShapeOk;
			nullable<CString>                                         m_oId;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanFalse>        m_oInsetPenOk;
			SimpleTypes::Vml::CVml_Vector2D_Units                     m_oLimo;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanTrue>         m_oShadowOk;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanTrue>         m_oStrokeOk;
			nullable<SimpleTypes::Vml::CVml_Polygon2D>                m_oTextBoxRect;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanFalse>        m_oTextPathOk;
			nullable<SimpleTypes::Vml::CVmlPath>                      m_oV;
		};
		
		
		
		class CPolyLine : public CVmlAttributes, public CVmlShapeElements
		{
		public:
			WritingElement_AdditionConstructors(CPolyLine)
			CPolyLine()
			{
			}
			virtual ~CPolyLine()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode);
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader);
			virtual CString      toXML() const;
			virtual EElementType getType() const
			{
				return OOX::et_v_polyline;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				m_oPoints.SetDelimiter( ' ' );

				
				if ( oReader.GetAttributesCount() <= 0 )
					return;
				
				if ( !oReader.MoveToFirstAttribute() )
					return;
				
				CWCharWrapper wsName = oReader.GetName();
				while( !wsName.IsNull() )
				{
					wchar_t wsChar = wsName[0];
					switch ( wsChar )
					{
					case 'p':
						if      ( _T("points") == wsName ) m_oPoints = oReader.GetText();
						break;
					}

					if ( !oReader.MoveToNextAttribute() )
						break;

					wsName = oReader.GetName();
				}
				oReader.MoveToElement();
			}

		public:

			
			SimpleTypes::Vml::CVml_Polygon2D_Units m_oPoints;

		};
		
		
		
		class CRect : public CVmlAttributes, public CVmlShapeElements
		{
		public:
			WritingElement_AdditionConstructors(CRect)
			CRect()
			{
			}
			virtual ~CRect()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				CVmlAttributes::fromXML( oReader );

				CVmlShapeElements::fromXML( oReader );
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<v:rect ");

				sResult += CVmlAttributes::toXML();

				sResult += _T(">");

				sResult += CVmlShapeElements::toXML();

				sResult += _T("</v:rect>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_v_rect;
			}

		};
		
		
		
		class CRoundRect : public CVmlAttributes, public CVmlShapeElements
		{
		public:
			WritingElement_AdditionConstructors(CRoundRect)
			CRoundRect()
			{
			}
			virtual ~CRoundRect()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );
				CVmlAttributes::fromXML( oReader );

				CVmlShapeElements::fromXML( oReader );
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<v:roundrect ");

				sResult += CVmlAttributes::toXML();

				sResult += _T("arcsize=\"") + m_oArcSize.ToString() + _T("\" ");

				sResult += CVmlShapeElements::toXML();

				sResult += _T("</v:roundrect>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_v_roundrect;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				m_oArcSize.SetPercentage( 20 );

				
				if ( oReader.GetAttributesCount() <= 0 )
					return;
				
				if ( !oReader.MoveToFirstAttribute() )
					return;
				
				CWCharWrapper wsName = oReader.GetName();
				while( !wsName.IsNull() )
				{
					wchar_t wsChar = wsName[0];
					switch ( wsChar )
					{
					case 'a':
						if      ( _T("arcsize") == wsName ) m_oArcSize = oReader.GetText();
						break;
					}

					if ( !oReader.MoveToNextAttribute() )
						break;

					wsName = oReader.GetName();
				}
				oReader.MoveToElement();
			}

		public:

			
			SimpleTypes::Vml::CVml_1_65536_Or_Percentage m_oArcSize;

		};
		
		
		
		class CShadow : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CShadow)
			CShadow()
			{
			}
			virtual ~CShadow()
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
				CString sResult = _T("<v:shadow ");

				ComplexTypes_WriteAttribute2( _T("id=\""), m_oId );

				if ( SimpleTypes::booleanTrue != m_oOn.GetValue() )
					sResult += _T("on=\"false\" ");

				if ( SimpleTypes::shadowtypeSingle != m_oType.GetValue() )
					sResult += _T("type=\"") + m_oType.ToString() + _T("\" ");

				if ( SimpleTypes::booleanFalse != m_oObscured.GetValue() )
					sResult += _T("obscured=\"true\" ");

				if ( 128 != m_oColor.Get_R() || 128 != m_oColor.Get_G() || 128 != m_oColor.Get_B() )
					sResult += _T("color=\"") + m_oColor.ToString() + _T("\" ");

				if ( 1 != m_oOpacity.GetValue() )
					sResult += _T("opacity=\"") + m_oOpacity.ToString() + _T("\" ");

				sResult += _T("offset=\"") + m_oOffset.ToString() + _T("\" ");

				if ( 203 != m_oColor2.Get_R() || 203 != m_oColor2.Get_G() || 203 != m_oColor2.Get_B() )
					sResult += _T("color2=\"") + m_oColor2.ToString() + _T("\" ");

				sResult += _T("offset2=\"") + m_oOffset2.ToString() + _T("\" ");

				if ( 0 != m_oOrigin.GetX() || 0 != m_oOrigin.GetY() )
					sResult += _T("origin=\"") + m_oOrigin.ToString() + _T("\" ");

				ComplexTypes_WriteAttribute ( _T("matrix=\""), m_oMatrix );
				
				sResult += _T("/>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_v_shadow;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				m_oColor.SetRGB( 128, 128, 128 );
				m_oColor2.SetRGB( 203, 203, 203 );
				m_oOffset.SetValue_Points( 2, 2 );
				m_oOffset2.SetValue_Points( -2, -2 );
				m_oOpacity.SetValue( 1.0 );
				m_oOrigin.SetValue( 0, 0 );

				
				if ( oReader.GetAttributesCount() <= 0 )
					return;
				
				if ( !oReader.MoveToFirstAttribute() )
					return;
				
				CWCharWrapper wsName = oReader.GetName();
				while( !wsName.IsNull() )
				{
					wchar_t wsChar = wsName[0];
					switch ( wsChar )
					{
					case 'c':
						if      ( _T("color")      == wsName ) m_oColor      = oReader.GetText();
						else if ( _T("color2")     == wsName ) m_oColor2     = oReader.GetText();
						break;

					case 'i':
						if      ( _T("id")         == wsName ) m_oId         = oReader.GetText();
						break;

					case 'm':
						if      ( _T("matrix")     == wsName ) m_oMatrix     = oReader.GetText();
						break;

					case 'o':
						if      ( _T("obscured")   == wsName ) m_oObscured   = oReader.GetText();
						else if ( _T("offset")     == wsName ) m_oOffset     = oReader.GetText();
						else if ( _T("offset2")    == wsName ) m_oOffset2    = oReader.GetText();
						else if ( _T("on")         == wsName ) m_oOn         = oReader.GetText();
						else if ( _T("opacity")    == wsName ) m_oOpacity    = oReader.GetText();
						else if ( _T("origin")     == wsName ) m_oOrigin     = oReader.GetText();
						break;

					case 't':
						if      ( _T("type")       == wsName ) m_oType       = oReader.GetText();
						break;
					}

					if ( !oReader.MoveToNextAttribute() )
						break;

					wsName = oReader.GetName();
				}
				oReader.MoveToElement();
			}

		public:

			
			SimpleTypes::CColorType<SimpleTypes::colortypeRGB>        m_oColor;
			SimpleTypes::CColorType<SimpleTypes::colortypeRGB>        m_oColor2;
			nullable<CString>                                         m_oId;
			nullable<SimpleTypes::Vml::CVml_Matrix>                   m_oMatrix;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanFalse>        m_oObscured;
			SimpleTypes::Vml::CVml_Vector2D_Units_Or_Percentage       m_oOffset;
			SimpleTypes::Vml::CVml_Vector2D_Units_Or_Percentage       m_oOffset2;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanTrue>         m_oOn;
			SimpleTypes::Vml::CVml_1_65536                            m_oOpacity;
			SimpleTypes::Vml::CVml_Vector2D_Percentage                m_oOrigin;
			SimpleTypes::CShadowType<SimpleTypes::shadowtypeSingle>   m_oType;
		};
		
		
		
		class CShape : public CVmlAttributes, public CVmlShapeElements
		{
		public:
			WritingElement_AdditionConstructors(CShape)
			CShape()
			{
			}
			virtual ~CShape()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode);
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader);
			virtual CString      toXML() const;
			virtual EElementType getType() const
			{
				return OOX::et_v_shape;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				if ( oReader.GetAttributesCount() <= 0 )
					return;
				
				if ( !oReader.MoveToFirstAttribute() )
					return;
			
				CWCharWrapper wsName = oReader.GetName();
				while( !wsName.IsNull() )
				{
					wchar_t wsChar = wsName[0];
					switch ( wsChar )
					{
					case 'a':
						if      ( _T("adj")         == wsName ) m_oAdj         = oReader.GetText();
						break;
					case 'e':
						if      ( _T("equationxml") == wsName ) m_sEquationXML = oReader.GetText();
						break;
					case 'o':
						if      ( _T("o:gfxdata")   == wsName ) m_oGfxData       = oReader.GetText();
						break;
					case 'p':
						if      ( _T("path")        == wsName ) m_oPath        = oReader.GetText();
						break;
					case 't':
						if      ( _T("type")        == wsName ) m_sType        = oReader.GetText();
						break;
					}

					if ( !oReader.MoveToNextAttribute() )
						break;

					wsName = oReader.GetName();
				}
				oReader.MoveToElement();

				
			}

		public:

			
			nullable<CString>                    m_sType;
			nullable<CString>                    m_oAdj;
			nullable<SimpleTypes::Vml::CVmlPath> m_oPath;
			nullable<CString>                    m_oGfxData;
			nullable<CString>                    m_sEquationXML;
		};
		
		
		
		class CShapeType : public CVmlAttributes, public CVmlShapeElements
		{
		public:
			WritingElement_AdditionConstructors(CShapeType)
			CShapeType()
			{
			}
			virtual ~CShapeType()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode);
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader);
			virtual CString      toXML() const;
			virtual EElementType getType() const
			{
				return OOX::et_v_shapetype;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				if ( oReader.GetAttributesCount() <= 0 )
					return;
				
				if ( !oReader.MoveToFirstAttribute() )
					return;

				CString sGfxData;
				
				CWCharWrapper wsName = oReader.GetName();
				while( !wsName.IsNull() )
				{
					wchar_t wsChar = wsName[0];
					switch ( wsChar )
					{
					case 'o':
						if      ( _T("o:master") == wsName ) m_oMaster = oReader.GetText();
						break;
					case 'p':
						if      ( _T("path")     == wsName ) m_oPath   = oReader.GetText();
						break;
					case 'a':
						if      ( _T("adj")      == wsName ) m_oAdj    = oReader.GetText();
						break;
					}

					if ( !oReader.MoveToNextAttribute() )
						break;

					wsName = oReader.GetName();
				}
				oReader.MoveToElement();

				
			}

		public:

			
			nullable<CString>                                  m_oAdj;
			nullable<SimpleTypes::Vml::CVmlPath>               m_oPath;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanFalse> m_oMaster;
		};
		class CClientData : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CClientData)
			CClientData()
			{
			}
			virtual ~CClientData()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode);
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader);
			virtual CString      toXML() const;
			virtual EElementType getType() const
			{
				return OOX::et_v_ClientData;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )

					WritingElement_ReadAttributes_Read_if     ( oReader, _T("ObjectType"),      m_oObjectType )

					WritingElement_ReadAttributes_End( oReader )
			}

		public:

			
			nullable<SimpleTypes::Vml::CVmlClientDataObjectType<>>               m_oObjectType;

			nullable<SimpleTypes::COnOff<SimpleTypes::onoffTrue>>               m_oMoveWithCells;
			nullable<SimpleTypes::COnOff<SimpleTypes::onoffTrue>>               m_oSizeWithCells;
			nullable<CString>													m_oAnchor;
			nullable<SimpleTypes::CUnsignedDecimalNumber<>>						m_oRow;
			nullable<SimpleTypes::CUnsignedDecimalNumber<>>						m_oColumn;
		};
		
		
		
		class CStroke : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CStroke)
			CStroke()
			{
			}
			virtual ~CStroke()
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

					if ( _T("o:left") == sName )
						m_oLeft = oReader;
					else if ( _T("o:top") == sName )
						m_oTop = oReader;
					else if ( _T("o:right") == sName )
						m_oRight = oReader;
					else if ( _T("o:bottom") == sName )
						m_oBottom = oReader;
					else if ( _T("o:column") == sName )
						m_oColumn = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<v:stroke ");

				ComplexTypes_WriteAttribute2( _T("id=\""), m_oId );
				if ( SimpleTypes::booleanTrue != m_oOn.GetValue() )
					sResult += _T("on=\"false\" ");

				if ( 1 != m_oWeight.GetValue() )
					sResult += _T("weight=\"") + m_oWeight.ToString() + _T("\" ");

				if ( SimpleTypes::colortypeBlack != m_oColor.GetValue() )
					sResult += _T("color=\"") + m_oColor.ToString() + _T("\" ");

				if ( 1 != m_oOpacity.GetValue() )
					sResult += _T("opacity=\"") + m_oOpacity.ToString() + _T("\" ");

				if ( SimpleTypes::strokelinestyleSingle != m_oLineStyle.GetValue() )
					sResult += _T("linestyle=\"") + m_oLineStyle.ToString() + _T("\" ");
				
				if ( 8 != m_oMiterLimit.GetValue() )
					sResult += _T("miterlimit=\"") + m_oMiterLimit.ToString() + _T("\" ");

				if ( SimpleTypes::strokejoinstyleRound != m_oJoinStyle.GetValue() )
					sResult += _T("joinstyle=\"") + m_oJoinStyle.ToString() + _T("\" ");

				if ( SimpleTypes::strokeendcapFlat != m_oEndCap.GetValue() )
					sResult += _T("endcap=\"") + m_oEndCap.ToString() + _T("\" ");

				if ( SimpleTypes::Vml::vmldashstyleSolid != m_oDahsStyle.GetValue() )
					sResult += _T("dashstyle=\"") + m_oDahsStyle.ToString() + _T("\" ");

				if ( SimpleTypes::filltypeSolid != m_oFillType.GetValue() )
					sResult += _T("filltype=\"") + m_oFillType.ToString() + _T("\" ");

				ComplexTypes_WriteAttribute2( _T("src=\""), m_sSrc );

				if ( SimpleTypes::imageaspectIgnore != m_oImageAspect.GetValue() )
					sResult += _T("imageaspect=\"") + m_oImageAspect.ToString() + _T("\" ");

				ComplexTypes_WriteAttribute ( _T("imagesize=\""), m_oImageSize );

				if ( SimpleTypes::booleanTrue != m_oOn.GetValue() )
					sResult += _T("imagealignshape=\"false\" ");

				ComplexTypes_WriteAttribute ( _T("color2=\""), m_oColor2 );

				if ( SimpleTypes::strokearrowtypeNone != m_oStartArrow.GetValue() )
					sResult += _T("startarrow=\"") + m_oStartArrow.ToString() + _T("\" ");

				if ( SimpleTypes::strokearrowwidthMedium != m_oStartArrowWidth.GetValue() )
					sResult += _T("startarrowwidth=\"") + m_oStartArrowWidth.ToString() + _T("\" ");

				if ( SimpleTypes::strokearrowlengthMedium != m_oStartArrowLength.GetValue() )
					sResult += _T("startarrowlength=\"") + m_oStartArrowLength.ToString() + _T("\" ");

				if ( SimpleTypes::strokearrowtypeNone != m_oEndArrow.GetValue() )
					sResult += _T("endarrow=\"") + m_oEndArrow.ToString() + _T("\" ");

				if ( SimpleTypes::strokearrowwidthMedium != m_oEndArrowWidth.GetValue() )
					sResult += _T("endarrowwidth=\"") + m_oEndArrowWidth.ToString() + _T("\" ");

				if ( SimpleTypes::strokearrowlengthMedium != m_oEndArrowLength.GetValue() )
					sResult += _T("endarrowlength=\"") + m_oEndArrowLength.ToString() + _T("\" ");

				ComplexTypes_WriteAttribute2( _T("o:href=\""),    m_sHref );
				ComplexTypes_WriteAttribute2( _T("o:althref=\""), m_sAltHref );
				ComplexTypes_WriteAttribute2( _T("o:title=\""),   m_sTitle );

				if ( SimpleTypes::booleanFalse != m_oForceDash.GetValue() )
					sResult += _T("o:forcedash=\"true\" ");

				ComplexTypes_WriteAttribute ( _T("r:id=\""),     m_rId );
				ComplexTypes_WriteAttribute ( _T("insetpen=\""), m_oInsetPen );
				ComplexTypes_WriteAttribute ( _T("o:relid=\""),  m_oRelId );

				sResult += _T(">");

				if ( m_oLeft.IsInit() )
					sResult += m_oLeft->toXML();

				if ( m_oTop.IsInit() )
					sResult += m_oTop->toXML();

				if ( m_oRight.IsInit() )
					sResult += m_oRight->toXML();

				if ( m_oBottom.IsInit() )
					sResult += m_oBottom->toXML();

				if ( m_oColumn.IsInit() )
					sResult += m_oColumn->toXML();

				sResult += _T("</v:stroke>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_v_stroke;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				m_oOpacity.SetValue( 1.0 );
				m_oWeight.SetValue( 1.0 );

				
				if ( oReader.GetAttributesCount() <= 0 )
					return;
				
				if ( !oReader.MoveToFirstAttribute() )
					return;
				
				CWCharWrapper wsName = oReader.GetName();
				while( !wsName.IsNull() )
				{
					wchar_t wsChar = wsName[0];
					switch ( wsChar )
					{
					case 'c':
						if      ( _T("color")     == wsName ) m_oColor     = oReader.GetText();
						else if ( _T("color2")    == wsName ) m_oColor2    = oReader.GetText();
						break;
					case 'd':
						if      ( _T("dashstyle") == wsName ) m_oDahsStyle = oReader.GetText();
						break;
					case 'e':
						if      ( _T("endarrow")       == wsName ) m_oEndArrow       = oReader.GetText();
						else if ( _T("endarrowlength") == wsName ) m_oEndArrowLength = oReader.GetText();
						else if ( _T("endarrowwidth")  == wsName ) m_oEndArrowWidth  = oReader.GetText();
						else if ( _T("endcap")         == wsName ) m_oEndCap         = oReader.GetText();
						break;
					case 'f':
						if      ( _T("filltype") == wsName ) m_oFillType = oReader.GetText();
						break;
					case 'i':
						if      ( _T("id")              == wsName ) m_oId              = oReader.GetText();
						else if ( _T("imagealignshape") == wsName ) m_oImageAlignShape = oReader.GetText();
						else if ( _T("imageaspect")     == wsName ) m_oImageAspect     = oReader.GetText();
						else if ( _T("imagesize")       == wsName ) m_oImageSize       = oReader.GetText();
						else if ( _T("insetpen")        == wsName ) m_oInsetPen        = oReader.GetText();
						break;
					case 'j':
						if      ( _T("joinstyle") == wsName ) m_oJoinStyle = oReader.GetText();
						break;
					case 'l':
						if      ( _T("linestyle") == wsName ) m_oLineStyle = oReader.GetText();
						break;
					case 'm':
						if      ( _T("miterlimit") == wsName ) m_oMiterLimit = oReader.GetText();
						break;
					case 'o':
						if      ( _T("o:althref")   == wsName ) m_sAltHref   = oReader.GetText();
						else if ( _T("o:forcedash") == wsName ) m_oForceDash = oReader.GetText();
						else if ( _T("o:href")      == wsName ) m_sHref      = oReader.GetText();
						else if ( _T("on")          == wsName ) m_oOn        = oReader.GetText();
						else if ( _T("opacity")     == wsName ) m_oOpacity   = oReader.GetText();
						else if ( _T("o:relid")     == wsName ) m_oRelId     = oReader.GetText();
						else if ( _T("o:title")     == wsName ) m_sTitle     = oReader.GetText();
						break;
					case 'r':
						if      ( _T("r:id") == wsName ) m_rId = oReader.GetText();
						break;
					case 's':
						if      ( _T("src")              == wsName ) m_sSrc              = oReader.GetText();
						else if ( _T("startarrow")       == wsName ) m_oStartArrow       = oReader.GetText();
						else if ( _T("startarrowlength") == wsName ) m_oStartArrowLength = oReader.GetText();
						else if ( _T("startarrowwidth")  == wsName ) m_oStartArrowWidth  = oReader.GetText();
						break;
					case 'w':
						if      ( _T("weight") == wsName ) m_oWeight = oReader.GetText();
						break;
					}

					if ( !oReader.MoveToNextAttribute() )
						break;

					wsName = oReader.GetName();
				}
				oReader.MoveToElement();

				
			}

		public:

			
			nullable<CString>                                                     m_oId;
			nullable<CString>                                                     m_sAltHref;
			SimpleTypes::CColorType<SimpleTypes::colortypeBlack>                  m_oColor;
			nullable<SimpleTypes::CColorType<SimpleTypes::colortypeBlack>>        m_oColor2;
			SimpleTypes::Vml::CVmlDashStyle<SimpleTypes::Vml::vmldashstyleSolid>  m_oDahsStyle;
			SimpleTypes::CStrokeArrowType<SimpleTypes::strokearrowtypeNone>       m_oEndArrow;
			SimpleTypes::CStrokeArrowLength<SimpleTypes::strokearrowlengthMedium> m_oEndArrowLength;
			SimpleTypes::CStrokeArrowWidth<SimpleTypes::strokearrowwidthMedium>   m_oEndArrowWidth;
			SimpleTypes::CStrokeEndCap<SimpleTypes::strokeendcapFlat>             m_oEndCap;
			SimpleTypes::CFillType<SimpleTypes::filltypeSolid, 0>                 m_oFillType;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanFalse>                    m_oForceDash;
			nullable<CString>                                                     m_sHref;
			nullable<SimpleTypes::CRelationshipId>                                m_rId;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanTrue>                     m_oImageAlignShape;
			SimpleTypes::CImageAspect<SimpleTypes::imageaspectIgnore>             m_oImageAspect;
			nullable<SimpleTypes::Vml::CVml_Vector2D_Units>                       m_oImageSize; 
			nullable<SimpleTypes::CTrueFalse<>>                                   m_oInsetPen;
			SimpleTypes::CStrokeJoinStyle<SimpleTypes::strokejoinstyleRound>      m_oJoinStyle;
			SimpleTypes::CStrokeLineStyle<SimpleTypes::strokelinestyleSingle>     m_oLineStyle;
			SimpleTypes::CDecimalNumber<8>                                        m_oMiterLimit;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanTrue>                     m_oOn;
			SimpleTypes::CDouble                                                  m_oOpacity;
			nullable<SimpleTypes::CRelationshipId>                                m_oRelId;
			nullable<CString>                                                     m_sSrc;
			SimpleTypes::CStrokeArrowType<SimpleTypes::strokearrowtypeNone>       m_oStartArrow;
			SimpleTypes::CStrokeArrowLength<SimpleTypes::strokearrowlengthMedium> m_oStartArrowLength;
			SimpleTypes::CStrokeArrowWidth<SimpleTypes::strokearrowwidthMedium>   m_oStartArrowWidth;
			nullable<CString>                                                     m_sTitle;
			SimpleTypes::CDouble                                                  m_oWeight;

			
			nullable<OOX::VmlOffice::CStrokeChild>                                m_oLeft;
			nullable<OOX::VmlOffice::CStrokeChild>                                m_oTop;
			nullable<OOX::VmlOffice::CStrokeChild>                                m_oRight;
			nullable<OOX::VmlOffice::CStrokeChild>                                m_oBottom;
			nullable<OOX::VmlOffice::CStrokeChild>                                m_oColumn;

		};
		
		
		
		class CTextbox : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CTextbox)
			CTextbox()
			{
			}
			virtual ~CTextbox()
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

					if ( _T("w:txbxContent") == sName )
						m_oTxtbxContent = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<v:textbox ");

				ComplexTypes_WriteAttribute2( _T("id=\""),    m_oId );
				ComplexTypes_WriteAttribute ( _T("style=\""), m_oStyle );

				sResult += _T("inset=\"") + m_oInset.ToString() + _T("\" ");

				if ( SimpleTypes::booleanFalse != m_oSingleClick.GetValue() )
					sResult += _T("o:singleclick=\"true\" ");

				if ( SimpleTypes::insetmodeCustom != m_oInsetMode.GetValue() )
					sResult += _T("o:insetmode=\"") + m_oInsetMode.ToString() + _T("\" ");

				sResult += _T(">");

				if ( m_oTxtbxContent.IsInit() )
					sResult += m_oTxtbxContent->toXML();

				sResult += _T("</v:textbox>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_v_textbox;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				m_oInset.Set(7.2, 3.6, 7.2, 3.6 );
				
				
				if ( oReader.GetAttributesCount() <= 0 )
					return;
				
				if ( !oReader.MoveToFirstAttribute() )
					return;
				
				CWCharWrapper wsName = oReader.GetName();
				while( !wsName.IsNull() )
				{
					wchar_t wsChar = wsName[0];
					switch ( wsChar )
					{
					case 'i':
						if      ( _T("id")            == wsName ) m_oId          = oReader.GetText();
						else if ( _T("inset")         == wsName ) m_oInset       = oReader.GetText();
						else if ( _T("insetmode")     == wsName ) m_oInsetMode   = oReader.GetText();
						break;
					case 'o':
						if      ( _T("o:singleclick") == wsName ) m_oSingleClick = oReader.GetText();
						break;
					case 's':
						if      ( _T("style")         == wsName ) m_oStyle       = oReader.GetText();
						break;
					}

					if ( !oReader.MoveToNextAttribute() )
						break;

					wsName = oReader.GetName();
				}
				oReader.MoveToElement();
			}

		public:

			
			nullable<CString>                                     m_oId;
			nullable<SimpleTypes::Vml::CCssStyle>                 m_oStyle;
			SimpleTypes::Vml::CVml_TextBoxInset                   m_oInset;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanFalse>    m_oSingleClick;
			SimpleTypes::CInsetMode<SimpleTypes::insetmodeCustom> m_oInsetMode;

			
			nullable<OOX::Logic::CTxbxContent>                    m_oTxtbxContent;
		};
		
		
		
		class CTextPath : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CTextPath)
			CTextPath()
			{
			}
			virtual ~CTextPath()
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
				CString sResult = _T("<v:textpath ");

				ComplexTypes_WriteAttribute2( _T("id=\""),    m_oId );
				ComplexTypes_WriteAttribute ( _T("style=\""), m_oStyle );

				if ( SimpleTypes::booleanFalse != m_oOn.GetValue() )
					sResult += _T("on=\"true\" ");

				if ( SimpleTypes::booleanFalse != m_oFitShape.GetValue() )
					sResult += _T("fitshape=\"true\" ");

				if ( SimpleTypes::booleanFalse != m_oFitPath.GetValue() )
					sResult += _T("fitpath=\"true\" ");

				if ( SimpleTypes::booleanFalse != m_oTrim.GetValue() )
					sResult += _T("trim=\"true\" ");

				if ( SimpleTypes::booleanFalse != m_oXScale.GetValue() )
					sResult += _T("xscale=\"true\" ");

				ComplexTypes_WriteAttribute2( _T("string=\""), m_sString );

				sResult += _T("/>");
				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_v_textpath;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{				
				
				if ( oReader.GetAttributesCount() <= 0 )
					return;
				
				if ( !oReader.MoveToFirstAttribute() )
					return;
				
				CWCharWrapper wsName = oReader.GetName();
				while( !wsName.IsNull() )
				{
					wchar_t wsChar = wsName[0];
					switch ( wsChar )
					{
					case 'f':
						if      ( _T("fitpath")  == wsName ) m_oFitPath  = oReader.GetText();
						else if ( _T("fitshape") == wsName ) m_oFitShape = oReader.GetText();
						break;
					case 'i':
						if      ( _T("id")       == wsName ) m_oId       = oReader.GetText();
						break;
					case 'o':
						if      ( _T("on")       == wsName ) m_oOn       = oReader.GetText();
						break;
					case 's':
						if      ( _T("string")   == wsName ) m_sString   = oReader.GetText();
						else if ( _T("style")    == wsName ) m_oStyle    = oReader.GetText();
						break;
					case 't':
						if      ( _T("trim")     == wsName ) m_oTrim     = oReader.GetText();
						break;
					case 'x':
						if      ( _T("xscale")   == wsName ) m_oXScale   = oReader.GetText();
						break;
					}

					if ( !oReader.MoveToNextAttribute() )
						break;

					wsName = oReader.GetName();
				}
				oReader.MoveToElement();
			}

		public:

			
			SimpleTypes::CTrueFalse<SimpleTypes::booleanFalse>    m_oFitPath;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanFalse>    m_oFitShape;
			nullable<CString>                                     m_oId;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanFalse>    m_oOn;
			nullable<CString>                                     m_sString;
			nullable<SimpleTypes::Vml::CCssStyle>                 m_oStyle;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanFalse>    m_oTrim;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanFalse>    m_oXScale;
		};
	} 
} 

namespace OOX
{
	namespace VmlOffice
	{
		
		
		
		class CShapeDefaults : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CShapeDefaults)
			CShapeDefaults()
			{
			}
			virtual ~CShapeDefaults()
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
					if ( _T("v:fill") == sName )
						m_oVmlFill = oReader;
					else if ( _T("v:stroke") == sName )
						m_oVmlStroke = oReader;
					else if ( _T("v:textbox") == sName )
						m_oVmlTextbox = oReader;
					else if ( _T("v:shadow") == sName )
						m_oVmlShadow = oReader;
					else if ( _T("o:skew") == sName )
						m_oSkew = oReader;
					else if ( _T("o:extrusion") == sName )
						m_oExtrusion = oReader;
					else if ( _T("o:callout") == sName )
						m_oCallout = oReader;
					else if ( _T("o:lock") == sName )
						m_oLock = oReader;
					else if ( _T("o:colormru") == sName )
						m_oColorMru = oReader;
					else if ( _T("o:colormenu") == sName )
						m_oColorMenu = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<o:shapedefaults ");

				ComplexTypes_WriteAttribute ( _T("v:ext=\""), m_oExt );

				if ( 0 != m_oSpIdMax.GetValue() )
					sResult += _T("spidmax=\"") + m_oSpIdMax.ToString() + _T("\" ");

				ComplexTypes_WriteAttribute ( _T("style=\""), m_oStyle );

				if ( SimpleTypes::booleanTrue != m_oFill.GetValue() )
					sResult += _T("fill=\"false\" ");

				ComplexTypes_WriteAttribute ( _T("fillcolor=\""), m_oFillColor );

				if ( SimpleTypes::booleanTrue != m_oStroke.GetValue() )
					sResult += _T("stroke=\"false\" ");

				if ( SimpleTypes::colortypeBlack != m_oStrokeColor.GetValue() )
					sResult += _T("strokecolor=\"") + m_oStrokeColor.ToString() + _T("\" ");

				if ( SimpleTypes::booleanFalse != m_oAllowInCell.GetValue() )
					sResult += _T("o:allowincell=\"true\" ");

				sResult += _T(">");

				if ( m_oVmlFill.IsInit() )
					sResult += m_oVmlFill->toXML();

				if ( m_oVmlStroke.IsInit() )
					sResult += m_oVmlStroke->toXML();

				if ( m_oVmlTextbox.IsInit() )
					sResult += m_oVmlTextbox->toXML();

				if ( m_oVmlShadow.IsInit() )
					sResult += m_oVmlShadow->toXML();

				if ( m_oSkew.IsInit() )
					sResult += m_oSkew->toXML();

				if ( m_oExtrusion.IsInit() )
					sResult += m_oExtrusion->toXML();

				if ( m_oCallout.IsInit() )
					sResult += m_oCallout->toXML();

				if ( m_oLock.IsInit() )
					sResult += m_oLock->toXML();

				if ( m_oColorMru.IsInit() )
					sResult += m_oColorMru->toXML();

				if ( m_oColorMenu.IsInit() )
					sResult += m_oColorMenu->toXML();

				sResult += _T("</o:shapedefaults>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_o_shapedefaults;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{				
				
				if ( oReader.GetAttributesCount() <= 0 )
					return;
				
				if ( !oReader.MoveToFirstAttribute() )
					return;
				
				CWCharWrapper wsName = oReader.GetName();
				while( !wsName.IsNull() )
				{
					wchar_t wsChar = wsName[0];
					switch ( wsChar )
					{
					case 'f':
						if      ( _T("fill")          == wsName ) m_oFill        = oReader.GetText();
						else if ( _T("fillcolor")     == wsName ) m_oFillColor   = oReader.GetText();
						break;
					case 'o':
						if      ( _T("o:allowincell") == wsName ) m_oAllowInCell = oReader.GetText();
						break;
					case 's':
						if      ( _T("spidmax")       == wsName ) m_oSpIdMax     = oReader.GetText();
						else if ( _T("style")         == wsName ) m_oStyle       = oReader.GetText();
						else if ( _T("stroke")        == wsName ) m_oStroke      = oReader.GetText();
						else if ( _T("strokecolor")   == wsName ) m_oStrokeColor = oReader.GetText();
						break;
					case 'v':
						if      ( _T("v:ext")         == wsName ) m_oExt         = oReader.GetText();
						break;
					}

					if ( !oReader.MoveToNextAttribute() )
						break;

					wsName = oReader.GetName();
				}
				oReader.MoveToElement();
			}


		public:

			
			SimpleTypes::CTrueFalse<SimpleTypes::booleanFalse>   m_oAllowInCell;
			nullable<SimpleTypes::CExt<>>                        m_oExt;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanTrue>    m_oFill;
			nullable<SimpleTypes::CColorType<>>                  m_oFillColor;
			SimpleTypes::CDecimalNumber<0>                       m_oSpIdMax;
			SimpleTypes::CTrueFalse<SimpleTypes::booleanTrue>    m_oStroke;
			SimpleTypes::CColorType<SimpleTypes::colortypeBlack> m_oStrokeColor;
			nullable<SimpleTypes::Vml::CCssStyle>                m_oStyle;

			
			nullable<OOX::Vml::CFill>                            m_oVmlFill;
			nullable<OOX::Vml::CStroke>                          m_oVmlStroke;
			nullable<OOX::Vml::CTextbox>                         m_oVmlTextbox;
			nullable<OOX::Vml::CShadow>                          m_oVmlShadow;

			nullable<OOX::VmlOffice::CSkew>                      m_oSkew;
			nullable<OOX::VmlOffice::CExtrusion>                 m_oExtrusion;
			nullable<OOX::VmlOffice::CCallout>                   m_oCallout;
			nullable<OOX::VmlOffice::CLock>                      m_oLock;
			nullable<OOX::VmlOffice::CColorMru>                  m_oColorMru;
			nullable<OOX::VmlOffice::CColorMenu>                 m_oColorMenu;
		};
	} 
} 

#endif // OOX_VML_INCLUDE_H_