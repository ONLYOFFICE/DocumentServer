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
#ifndef OOX_LOGIC_DRAWING_BODY_INCLUDE_H_
#define OOX_LOGIC_DRAWING_BODY_INCLUDE_H_

#include "../../Base/Nullable.h"
#include "../../Common/SimpleTypes_Drawing.h"
#include "../../Common/SimpleTypes_Shared.h"

#include "../WritingElement.h"

#include "DrawingStyles2.h"
#include "DrawingEffects.h"
#include "Drawing3D.h"
#include "DrawingShape.h"

namespace OOX
{
	namespace Drawing
	{
		enum ETextAutofitType
		{
			textautofitNone   = 0,
			textautofitNo     = 1,
			textautofitNormal = 2,
			textautofitShape  = 3,
		};
		
		
		
		class CTextNoAutofit : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CTextNoAutofit)
			CTextNoAutofit()
			{
			}
			virtual ~CTextNoAutofit()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}
			virtual CString      toXML() const
			{
				return _T("<a:noAutofit/>");
			}
			virtual EElementType getType() const
			{
				return et_a_noAutofit;
			}
		};

		
		
		
		class CTextNormalAutofit : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CTextNormalAutofit)
			CTextNormalAutofit()
			{
			}
			virtual ~CTextNormalAutofit()
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
				CString sResult = _T("<a:normAutofit fontScale=\"") + m_oFontScale.ToString()
					+ _T("\" lnSpcReduction=\"") + m_oLnSpcReduction.ToString() + _T("\"/>");
				return sResult;
			}
			virtual EElementType getType() const
			{
				return et_a_normAutofit;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				m_oFontScale.SetValue( 100 );
				m_oLnSpcReduction.SetValue( 0 );

				
				if ( oReader.GetAttributesCount() <= 0 )
					return;
				
				if ( !oReader.MoveToFirstAttribute() )
					return;
				
				CWCharWrapper wsName = oReader.GetName();
				while( !wsName.IsNull() )
				{
					wchar_t wsChar0 = wsName[0]; 

					switch ( wsChar0 )
					{
					case 'f':
						if      ( _T("fontScale")      == wsName ) m_oFontScale      = oReader.GetText();
						break;

					case 'l':
						if      ( _T("lnSpcReduction") == wsName ) m_oLnSpcReduction = oReader.GetText();
						break;
					}

					if ( !oReader.MoveToNextAttribute() )
						break;

					wsName = oReader.GetName();
				}
				oReader.MoveToElement();
			}

		public:

			SimpleTypes::CTextFontScalePercentOrPercentString m_oFontScale;
			SimpleTypes::CTextSpacingPercentOrPercentString   m_oLnSpcReduction;
		};

		
		
		
		class CTextShapeAutofit : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CTextShapeAutofit)
			CTextShapeAutofit()
			{
			}
			virtual ~CTextShapeAutofit()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}
			virtual CString      toXML() const
			{
				return _T("<a:spAutoFit/>");
			}
			virtual EElementType getType() const
			{
				return et_a_spAutoFit;
			}
		};

		
		
		
		class CTextBodyProperties : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CTextBodyProperties)
			CTextBodyProperties()
			{
				m_eAutoFitType = textautofitNone;
				m_eText3DType  = text3dtypeUnknown;
			}
			virtual ~CTextBodyProperties()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				m_eAutoFitType = textautofitNone;
				m_eText3DType  = text3dtypeUnknown;

				
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				m_eAutoFitType = textautofitNone;
				m_eText3DType  = text3dtypeUnknown;

				ReadAttributes( oReader );

				if ( oReader.IsEmptyNode() )
					return;

				int nCurDepth = oReader.GetDepth();
				while ( oReader.ReadNextSiblingNode( nCurDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();

					if ( _T("a:extLst") == sName )
						m_oExtLst = oReader;
					else if ( _T("a:flatTx") == sName )
					{
						m_eText3DType = text3dtypeFlat;
						m_oFlatTx = oReader;
					}
					else if ( _T("a:noAutofit") == sName )
					{
						m_eAutoFitType = textautofitNo;
						m_oNoAutofit = oReader;
					}
					else if ( _T("a:normAutofit") == sName )
					{
						m_eAutoFitType = textautofitNormal;
						m_oNormAutofit = oReader;
					}
					else if ( _T("a:prstTxWarp") == sName )
						m_oPrstTxWrap = oReader;
					else if ( _T("a:scene3d") == sName )
						m_oScene3D = oReader;
					else if ( _T("a:sp3d") == sName )
					{
						m_eText3DType = text3dtypeShape;
						m_oSp3D = oReader;
					}
					else if ( _T("a:spAutoFit") == sName )
					{
						m_eAutoFitType = textautofitShape;
						m_oSpAutoFit = oReader;
					}
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<a:bodyPr");

				if ( 0 != m_oRot.GetAngle() )
					sResult += _T(" rot=\"") + m_oRot.ToString() + _T("\"");

				if ( SimpleTypes::onoffFalse != m_oSpcFirstLastPara.GetValue() )
					sResult += _T(" spcFirstLastPara=\"1\"");

				if ( m_oVertOverflow.IsInit() )
					sResult += _T(" vertOverflow=\"") + m_oVertOverflow->ToString() + _T("\"");

				if ( m_oHorzOverflow.IsInit() )
					sResult += _T(" horzOverflow=\"") + m_oHorzOverflow->ToString() + _T("\"");

				if ( SimpleTypes::textverticaltypeHorz != m_oVert.GetValue() )
					sResult += _T(" vert=\"") + m_oVert.ToString() + _T("\"");

				if ( SimpleTypes::textwrappingtypeSquare != m_oWrap.GetValue() )
					sResult += _T(" wrap=\"") + m_oWrap.ToString() + _T("\"");

				if ( 91440 != m_oLIns.ToEmu() )
					sResult += _T(" lIns=\"") + m_oLIns.ToString() + _T("\"");

				if ( 45720 != m_oTIns.ToEmu() )
					sResult += _T(" tIns=\"") + m_oTIns.ToString() + _T("\"");

				if ( 91440 != m_oRIns.ToEmu() )
					sResult += _T(" rIns=\"") + m_oRIns.ToString() + _T("\"");

				if ( 45720 != m_oBIns.ToEmu() )
					sResult += _T(" bIns=\"") + m_oBIns.ToString() + _T("\"");

				if ( 1 != m_oNumCol.GetValue() )
					sResult += _T(" numCol=\"") + m_oNumCol.ToString() + _T("\""); 

				if ( 0 != m_oSpcCol.GetValue() )
					sResult += _T(" spcCol=\"") + m_oSpcCol.ToString() + _T("\""); 

				if ( SimpleTypes::onoffFalse != m_oRtlCol.GetValue() )
					sResult += _T(" rtlCol=\"1\"");

				if ( SimpleTypes::onoffFalse != m_oFromWordArt.GetValue() )
					sResult += _T(" fromWordArt=\"1\"");

				if ( SimpleTypes::textanchoringtypeT != m_oAnchor.GetValue() )
					sResult += _T(" anchor=\"") + m_oAnchor.ToString() + _T("\"");

				if ( SimpleTypes::onoffFalse != m_oAnchorCtr.GetValue() )
					sResult += _T(" anchorCtr=\"1\"");

				if ( SimpleTypes::onoffFalse != m_oForceAA.GetValue() )
					sResult += _T(" forceAA=\"1\"");

				if ( SimpleTypes::onoffFalse != m_oUpright.GetValue() )
					sResult += _T(" upright=\"1\"");

				if ( SimpleTypes::onoffFalse != m_oCompatLnSpc.GetValue() )
					sResult += _T(" compatLnSpc=\"1\"");

				sResult += _T(">");

				if ( m_oPrstTxWrap.IsInit() )
					sResult += m_oPrstTxWrap->toXML();

				switch ( m_eAutoFitType )
				{
				case textautofitNo:
					if ( m_oNoAutofit.IsInit() )
						sResult += m_oNoAutofit->toXML();

					break;
				case textautofitNormal:
					if ( m_oNormAutofit.IsInit() )
						sResult += m_oNormAutofit->toXML();

					break;
				case textautofitShape:
					if ( m_oSpAutoFit.IsInit() )
						sResult += m_oSpAutoFit->toXML();
					break;
				}

				if ( m_oScene3D.IsInit() )
					sResult += m_oScene3D->toXML();

				switch ( m_eText3DType )
				{
				case text3dtypeFlat:

					if ( m_oFlatTx.IsInit() )
						sResult += m_oFlatTx->toXML();

					break;

				case text3dtypeShape:

					if ( m_oSp3D.IsInit() )
						sResult += m_oSp3D->toXML();

					break;
				}

				if ( m_oExtLst.IsInit() )
					sResult += m_oExtLst->toXML();

				sResult += _T("</a:bodyPr>");
				return sResult;
			}
			virtual EElementType getType() const
			{
				return et_a_bodyPr;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				m_oBIns.SetValue(45720);
				m_oLIns.SetValue(91440);
				m_oRIns.SetValue(91440);
				m_oTIns.SetValue(45720);

				
				if ( oReader.GetAttributesCount() <= 0 )
					return;
				
				if ( !oReader.MoveToFirstAttribute() )
					return;
				
				CWCharWrapper wsName = oReader.GetName();
				while( !wsName.IsNull() )
				{
					wchar_t wsChar0 = wsName[0]; 

					switch ( wsChar0 )
					{
					case 'a':
						if      ( _T("anchor")           == wsName ) m_oAnchor           = oReader.GetText();
						else if ( _T("anchorCtr")        == wsName ) m_oAnchorCtr        = oReader.GetText();
						break;
					case 'b':
						if      ( _T("bIns")             == wsName ) m_oBIns             = oReader.GetText();
						break;
					case 'c':
						if      ( _T("compatLnSpc")      == wsName ) m_oCompatLnSpc      = oReader.GetText();
						break;
					case 'f':
						if      ( _T("forceAA")          == wsName ) m_oForceAA          = oReader.GetText();
						else if ( _T("fromWordArt")      == wsName ) m_oFromWordArt      = oReader.GetText();
						break;
					case 'h':
						if      ( _T("horzOverflow")     == wsName ) m_oHorzOverflow     = oReader.GetText();
						break;
					case 'l':
						if      ( _T("lIns")             == wsName ) m_oLIns             = oReader.GetText();
						break;
					case 'n':
						if      ( _T("numCol")           == wsName ) m_oNumCol           = oReader.GetText();
						break;
					case 'r':
						if      ( _T("rIns")             == wsName ) m_oRIns             = oReader.GetText();
						else if ( _T("rot")              == wsName ) m_oRot              = oReader.GetText();
						else if ( _T("rtlCol")           == wsName ) m_oRtlCol           = oReader.GetText();
						break;
					case 's':
						if      ( _T("spcCol")           == wsName ) m_oSpcCol           = oReader.GetText();
						else if ( _T("spcFirstLastPara") == wsName ) m_oSpcFirstLastPara = oReader.GetText();
						break;
					case 't':
						if      ( _T("tIns")             == wsName ) m_oTIns             = oReader.GetText();
						break;
					case 'u':
						if      ( _T("upright")          == wsName ) m_oUpright          = oReader.GetText();
						break;
					case 'v':
						if      ( _T("vert")             == wsName ) m_oVert             = oReader.GetText();
						else if ( _T("vertOverflow")     == wsName ) m_oVertOverflow     = oReader.GetText();
						break;
					case 'w':
						if      ( _T("wrap")             == wsName ) m_oWrap             = oReader.GetText();
						break;
					}

					if ( !oReader.MoveToNextAttribute() )
						break;

					wsName = oReader.GetName();
				}
				oReader.MoveToElement();
			}


		public:

			
			SimpleTypes::CTextAnchoringType<SimpleTypes::textanchoringtypeT>    m_oAnchor;
			SimpleTypes::COnOff<SimpleTypes::onoffFalse>                        m_oAnchorCtr;
			SimpleTypes::CCoordinate32                                          m_oBIns;
			SimpleTypes::COnOff<SimpleTypes::onoffFalse>                        m_oCompatLnSpc;
			SimpleTypes::COnOff<SimpleTypes::onoffFalse>                        m_oForceAA;
			SimpleTypes::COnOff<SimpleTypes::onoffFalse>                        m_oFromWordArt;
			nullable<SimpleTypes::CTextHorzOverflowType<>>                      m_oHorzOverflow;
			SimpleTypes::CCoordinate32                                          m_oLIns;
			SimpleTypes::CTextColumnCount<1>                                    m_oNumCol;
			SimpleTypes::CCoordinate32                                          m_oRIns;
			SimpleTypes::CAngle<0>                                              m_oRot;
			SimpleTypes::COnOff<SimpleTypes::onoffFalse>                        m_oRtlCol;
			SimpleTypes::CPositiveCoordinate32<0>                               m_oSpcCol;
			SimpleTypes::COnOff<SimpleTypes::onoffFalse>                        m_oSpcFirstLastPara;
			SimpleTypes::CCoordinate32                                          m_oTIns;
			SimpleTypes::COnOff<SimpleTypes::onoffFalse>                        m_oUpright;
			SimpleTypes::CTextVerticalType<SimpleTypes::textverticaltypeHorz>   m_oVert;
			nullable<SimpleTypes::CTextVertOverflowType<>>                      m_oVertOverflow;
			SimpleTypes::CTextWrappingType<SimpleTypes::textwrappingtypeSquare> m_oWrap;

			
			ETextAutofitType                                                    m_eAutoFitType;
			EText3DType                                                         m_eText3DType;
			nullable<OOX::Drawing::COfficeArtExtensionList>                     m_oExtLst;
			nullable<OOX::Drawing::CFlatText>                                   m_oFlatTx;
			nullable<OOX::Drawing::CTextNoAutofit>                              m_oNoAutofit;
			nullable<OOX::Drawing::CTextNormalAutofit>                          m_oNormAutofit;
			nullable<OOX::Drawing::CPresetTextShape>                            m_oPrstTxWrap;
			nullable<OOX::Drawing::CScene3D>                                    m_oScene3D;
			nullable<OOX::Drawing::CShape3D>                                    m_oSp3D;
			nullable<OOX::Drawing::CTextShapeAutofit>                           m_oSpAutoFit;
		};

	} 
} 

#endif // OOX_LOGIC_DRAWING_BODY_INCLUDE_H_