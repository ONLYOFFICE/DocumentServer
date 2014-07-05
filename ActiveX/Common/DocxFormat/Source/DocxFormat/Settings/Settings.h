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
#ifndef OOX_SETTINGS_INCLUDE_H_
#define OOX_SETTINGS_INCLUDE_H_

#include "../../Base/Nullable.h"

#include "../File.h"
#include "../../Common/ComplexTypes.h"
#include "../Logic/VmlOfficeDrawing.h"
#include "../FtnEdn.h"

namespace OOX
{
	namespace Settings
	{
		
		
		
		class CWritingStyle : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CWritingStyle)
			CWritingStyle()
			{
			}
			virtual ~CWritingStyle()
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
				CString sResult = _T("<w:activeWritingStyle ");

				ComplexTypes_WriteAttribute ( _T("w:lang=\""),       m_oLang );
				ComplexTypes_WriteAttribute2( _T("w:vendorID=\""),   m_sVendorID );
				ComplexTypes_WriteAttribute2( _T("w:dllVersion=\""), m_sDllVersion );
				ComplexTypes_WriteAttribute ( _T("w:nlCheck=\""),    m_oNlCheck );
				ComplexTypes_WriteAttribute ( _T("w:checkStyle=\""), m_oCheckSyle );
				ComplexTypes_WriteAttribute2( _T("w:appName=\""),    m_sAppName );

				sResult += _T("/>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_w_activeWritingStyle;
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
					wchar_t wsChar0 = wsName[0]; 
					wchar_t wsChar2 = wsName[2]; 

					if ( 'w' == wsChar0 )
					{
						switch ( wsChar2 )
						{
						case 'a':
							if      ( _T("w:appName")    == wsName ) m_sAppName    = oReader.GetText();
							break;

						case 'c':
							if      ( _T("w:checkStyle") == wsName ) m_oCheckSyle  = oReader.GetText();
							break;

						case 'd':
							if      ( _T("w:dllVersion") == wsName ) m_sDllVersion = oReader.GetText();
							break;

						case 'l':
							if      ( _T("w:lang")       == wsName ) m_oLang       = oReader.GetText();
							break;

						case 'n':
							if      ( _T("w:nlCheck")    == wsName ) m_oNlCheck    = oReader.GetText();
							break;

						case 'v':
							if      ( _T("w:vendorID")   == wsName ) m_sVendorID   = oReader.GetText();
							break;
						}

					}

					if ( !oReader.MoveToNextAttribute() )
						break;

					wsName = oReader.GetName();
				}
				oReader.MoveToElement();
			}

		public:

			
			nullable<CString>               m_sAppName;
			nullable<SimpleTypes::COnOff<>> m_oCheckSyle;
			nullable<CString>               m_sDllVersion;
			nullable<SimpleTypes::CLang>    m_oLang;
			nullable<SimpleTypes::COnOff<>> m_oNlCheck;
			nullable<CString>               m_sVendorID;
		};
		
		
		
		class CAutoCaption : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CAutoCaption)
			CAutoCaption()
			{
			}
			virtual ~CAutoCaption()
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
				CString sResult = _T("<w:autoCaption ");

				ComplexTypes_WriteAttribute2( _T("w:name=\""),    m_sName );
				ComplexTypes_WriteAttribute2( _T("w:caption=\""), m_sCaption );

				sResult += _T("/>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_w_autoCaption;
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
					wchar_t wsChar0 = wsName[0]; 
					wchar_t wsChar2 = wsName[2]; 

					if ( 'w' == wsChar0 )
					{
						switch ( wsChar2 )
						{
						case 'c':
							if      ( _T("w:caption") == wsName ) m_sCaption = oReader.GetText();
							break;

						case 'n':
							if      ( _T("w:name")    == wsName ) m_sName    = oReader.GetText();
							break;
						}

					}

					if ( !oReader.MoveToNextAttribute() )
						break;

					wsName = oReader.GetName();
				}
				oReader.MoveToElement();
			}

		public:

			
			nullable<CString> m_sCaption;
			nullable<CString> m_sName;
		};
		
		
		
		class CAutoCaptions : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CAutoCaptions)
			CAutoCaptions()
			{
			}
			virtual ~CAutoCaptions()
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

					if ( _T("w:autoCaption") == sName )
					{
						OOX::Settings::CAutoCaption oAC = oReader;
						m_arrAutoCaption.Add( oAC );
					}
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<w:autoCaptions>");

				for ( int nIndex = 0; nIndex < m_arrAutoCaption.GetSize(); nIndex++ )
					sResult += m_arrAutoCaption[nIndex].toXML();

				sResult += _T("</w:autoCaptions>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_w_autoCaptions;
			}


		public:

			
			CSimpleArray<OOX::Settings::CAutoCaption> m_arrAutoCaption;
		};
		
		
		
		class CCaption : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CCaption)
			CCaption()
			{
			}
			virtual ~CCaption()
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
				CString sResult = _T("<w:caption w:name=\"") + m_sName + _T("\" ");

				ComplexTypes_WriteAttribute( _T("w:pos=\""),     m_oPos );
				ComplexTypes_WriteAttribute( _T("w:chapNum=\""), m_oChapNum );
				ComplexTypes_WriteAttribute( _T("w:heading=\""), m_oHeading );
				ComplexTypes_WriteAttribute( _T("w:noLabel=\""), m_oNoLabel );
				ComplexTypes_WriteAttribute( _T("w:numFmt=\""),  m_oNumFmt );
				ComplexTypes_WriteAttribute( _T("w:sep=\""),     m_oSep );

				sResult += _T("/>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_w_caption;
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
					wchar_t wsChar0 = wsName[0]; 
					wchar_t wsChar2 = wsName[2]; 

					if ( 'w' == wsChar0 )
					{
						switch ( wsChar2 )
						{
						case 'c':
							if      ( _T("w:chapNum") == wsName ) m_oChapNum = oReader.GetText();
							break;

						case 'h':
							if      ( _T("w:heading") == wsName ) m_oHeading = oReader.GetText();
							break;

						case 'n':
							if      ( _T("w:name")    == wsName ) m_sName    = oReader.GetText();
							else if ( _T("w:noLabel") == wsName ) m_oNoLabel = oReader.GetText();
							else if ( _T("w:numFmt")  == wsName ) m_oNumFmt  = oReader.GetText();
							break;

						case 'p':
							if      ( _T("w:pos")     == wsName ) m_oPos     = oReader.GetText();
							break;

						case 's':
							if      ( _T("w:sep")     == wsName ) m_oSep     = oReader.GetText();
							break;
						}

					}

					if ( !oReader.MoveToNextAttribute() )
						break;

					wsName = oReader.GetName();
				}
				oReader.MoveToElement();
			}

		public:

			
			nullable<SimpleTypes::COnOff<>>         m_oChapNum;
			nullable<SimpleTypes::CDecimalNumber<>> m_oHeading;
			CString                                 m_sName;
			nullable<SimpleTypes::COnOff<>>         m_oNoLabel;
			nullable<SimpleTypes::CNumberFormat<>>  m_oNumFmt;
			nullable<SimpleTypes::CCaptionPos<>>    m_oPos;
			nullable<SimpleTypes::CChapterSep<>>    m_oSep;
		};
		
		
		
		class CCaptions : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CCaptions)
			CCaptions()
			{
			}
			virtual ~CCaptions()
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

					if ( _T("w:caption") == sName )
					{
						OOX::Settings::CCaption oC = oReader;
						m_arrCaption.Add( oC );
					}
					else if ( _T("w:autoCaptions") == sName )
						m_oAutoCaptions = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<w:captions>");

				for ( int nIndex = 0; nIndex < m_arrCaption.GetSize(); nIndex++ )
					sResult += m_arrCaption[nIndex].toXML();

				if ( m_oAutoCaptions.IsInit() )
					sResult += m_oAutoCaptions->toXML();

				sResult += _T("</w:captions>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_w_captions;
			}


		public:

			
			CSimpleArray<OOX::Settings::CCaption>  m_arrCaption;
			nullable<OOX::Settings::CAutoCaptions> m_oAutoCaptions;

		};
		
		
		
		class CCharacterSpacing : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CCharacterSpacing)
			CCharacterSpacing()
			{
			}
			virtual ~CCharacterSpacing()
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
				CString sResult = _T("<w:characterSpacingControl w:val=\"") + m_oVal.ToString() + _T("\"/>");
				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_w_characterSpacingControl;
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
					wchar_t wsChar0 = wsName[0]; 
					wchar_t wsChar2 = wsName[2]; 

					if ( 'w' == wsChar0 )
					{
						switch ( wsChar2 )
						{
						case 'v':
							if      ( _T("w:val") == wsName ) m_oVal = oReader.GetText();
							break;
						}

					}

					if ( !oReader.MoveToNextAttribute() )
						break;

					wsName = oReader.GetName();
				}
				oReader.MoveToElement();
			}

		public:

			
			SimpleTypes::CCharacterSpacing<> m_oVal;
		};
		
		
		
		class CColorSchemeMapping : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CColorSchemeMapping)
			CColorSchemeMapping()
			{
			}
			virtual ~CColorSchemeMapping()
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
				CString sResult = _T("<w:clrSchemeMapping ");

				ComplexTypes_WriteAttribute( _T("w:bg1=\""), m_oBg1 );
				ComplexTypes_WriteAttribute( _T("w:t1=\""),  m_oT1 );
				ComplexTypes_WriteAttribute( _T("w:bg2=\""), m_oBg2 );
				ComplexTypes_WriteAttribute( _T("w:t2=\""),  m_oT2 );
				ComplexTypes_WriteAttribute( _T("w:accent1=\""),  m_oAccent1 );
				ComplexTypes_WriteAttribute( _T("w:accent2=\""),  m_oAccent2 );
				ComplexTypes_WriteAttribute( _T("w:accent3=\""),  m_oAccent3 );
				ComplexTypes_WriteAttribute( _T("w:accent4=\""),  m_oAccent4 );
				ComplexTypes_WriteAttribute( _T("w:accent5=\""),  m_oAccent5 );
				ComplexTypes_WriteAttribute( _T("w:accent6=\""),  m_oAccent6 );
				ComplexTypes_WriteAttribute( _T("w:hyperlink=\""), m_oHyperlink );
				ComplexTypes_WriteAttribute( _T("w:followedHyperlink=\""), m_oFollowedHyperlink );

				sResult += _T("/>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_w_clrSchemeMapping;
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
					wchar_t wsChar0 = wsName[0]; 
					wchar_t wsChar2 = wsName[2]; 

					if ( 'w' == wsChar0 )
					{
						switch ( wsChar2 )
						{
						case 'a':
							if      ( _T("w:accent1") == wsName ) m_oAccent1 = oReader.GetText();
							else if ( _T("w:accent2") == wsName ) m_oAccent2 = oReader.GetText();
							else if ( _T("w:accent3") == wsName ) m_oAccent3 = oReader.GetText();
							else if ( _T("w:accent4") == wsName ) m_oAccent4 = oReader.GetText();
							else if ( _T("w:accent5") == wsName ) m_oAccent5 = oReader.GetText();
							else if ( _T("w:accent6") == wsName ) m_oAccent6 = oReader.GetText();
							break;

						case 'b':
							if      ( _T("w:bg1")     == wsName ) m_oBg1     = oReader.GetText();
							else if ( _T("w:bg2")     == wsName ) m_oBg2     = oReader.GetText();
							break;

						case 'f':
							if      ( _T("w:followedHyperlink") == wsName ) m_oFollowedHyperlink = oReader.GetText();
							break;

						case 'h':
							if      ( _T("w:hyperlink") == wsName ) m_oHyperlink = oReader.GetText();
							break;

						case 't':
							if      ( _T("w:t1") == wsName ) m_oT1 = oReader.GetText();
							else if ( _T("w:t2") == wsName ) m_oT2 = oReader.GetText();
							break;
						}

					}

					if ( !oReader.MoveToNextAttribute() )
						break;

					wsName = oReader.GetName();
				}
				oReader.MoveToElement();
			}

		public:

			
			nullable<SimpleTypes::CWmlColorSchemeIndex<>> m_oAccent1;
			nullable<SimpleTypes::CWmlColorSchemeIndex<>> m_oAccent2;
			nullable<SimpleTypes::CWmlColorSchemeIndex<>> m_oAccent3;
			nullable<SimpleTypes::CWmlColorSchemeIndex<>> m_oAccent4;
			nullable<SimpleTypes::CWmlColorSchemeIndex<>> m_oAccent5;
			nullable<SimpleTypes::CWmlColorSchemeIndex<>> m_oAccent6;
			nullable<SimpleTypes::CWmlColorSchemeIndex<>> m_oBg1;
			nullable<SimpleTypes::CWmlColorSchemeIndex<>> m_oBg2;
			nullable<SimpleTypes::CWmlColorSchemeIndex<>> m_oFollowedHyperlink;
			nullable<SimpleTypes::CWmlColorSchemeIndex<>> m_oHyperlink;
			nullable<SimpleTypes::CWmlColorSchemeIndex<>> m_oT1;
			nullable<SimpleTypes::CWmlColorSchemeIndex<>> m_oT2;
		};
		
		
		
		class CCompatSetting : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CCompatSetting)
			CCompatSetting()
			{
			}
			virtual ~CCompatSetting()
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
				CString sResult = _T("<w:compatSetting ");

				ComplexTypes_WriteAttribute2( _T("w:name=\""), m_sName );
				ComplexTypes_WriteAttribute2( _T("w:uri=\""),  m_sUri );
				ComplexTypes_WriteAttribute2( _T("w:val=\""),  m_sVal );

				sResult += _T("/>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_w_compatSetting;
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
					wchar_t wsChar0 = wsName[0]; 
					wchar_t wsChar2 = wsName[2]; 

					if ( 'w' == wsChar0 )
					{
						switch ( wsChar2 )
						{
						case 'n':
							if      ( _T("w:name") == wsName ) m_sName = oReader.GetText();
							break;

						case 'u':
							if      ( _T("w:uri")  == wsName ) m_sUri  = oReader.GetText();
							break;

						case 'v':
							if      ( _T("w:val")  == wsName ) m_sVal  = oReader.GetText();
							break;
						}

					}

					if ( !oReader.MoveToNextAttribute() )
						break;

					wsName = oReader.GetName();
				}
				oReader.MoveToElement();
			}

		public:

			
			nullable<CString> m_sName;
			nullable<CString> m_sUri;
			nullable<CString> m_sVal;
		};
		
		
		
		class CCompat : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CCompat)
			CCompat()
			{
			}
			virtual ~CCompat()
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

					if ( _T("w:adjustLineHeightInTable") == sName )
						m_oAdjustLineHeightInTable = oReader;
					else if ( _T("w:applyBreakingRules") == sName )
						m_oApplyBreakingRules = oReader;
					else if ( _T("w:balanceSingleByteDoubleByteWidth") == sName )
						m_oBalanceSingleByDoubleWidth = oReader;
					else if ( _T("w:compatSetting") == sName )
					{
						OOX::Settings::CCompatSetting oCS = oReader;
						m_arrCompatSettings.Add( oCS );
					}
					else if ( _T("w:doNotExpandShiftReturn") == sName )
						m_oDoNotExpandShiftReturn = oReader;
					else if ( _T("w:doNotLeaveBackslashAlone") == sName )
						m_oDoNotLeaveBackslaskAlone = oReader;
					else if ( _T("w:spaceForUL") == sName )
						m_oSpaceForUL = oReader;
					else if ( _T("w:ulTrailSpace") == sName )
						m_oUlTrailSpace = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<w:compat>");

				if ( m_oSpaceForUL.IsInit() )
				{
					sResult += _T("<w:spaceForUL ");
					sResult += m_oSpaceForUL->ToString();
					sResult += _T("/>");
				}

				if ( m_oBalanceSingleByDoubleWidth.IsInit() )
				{
					sResult += _T("<w:balanceSingleByteDoubleByteWidth ");
					sResult += m_oBalanceSingleByDoubleWidth->ToString();
					sResult += _T("/>");
				}

				if ( m_oDoNotLeaveBackslaskAlone.IsInit() )
				{
					sResult += _T("<w:doNotLeaveBackslashAlone ");
					sResult += m_oDoNotLeaveBackslaskAlone->ToString();
					sResult += _T("/>");
				}

				if ( m_oUlTrailSpace.IsInit() )
				{
					sResult += _T("<w:ulTrailSpace ");
					sResult += m_oUlTrailSpace->ToString();
					sResult += _T("/>");
				}

				if ( m_oDoNotExpandShiftReturn.IsInit() )
				{
					sResult += _T("<w:doNotExpandShiftReturn ");
					sResult += m_oDoNotExpandShiftReturn->ToString();
					sResult += _T("/>");
				}

				if ( m_oAdjustLineHeightInTable.IsInit() )
				{
					sResult += _T("<w:adjustLineHeightInTable ");
					sResult += m_oAdjustLineHeightInTable->ToString();
					sResult += _T("/>");
				}

				if ( m_oApplyBreakingRules.IsInit() )
				{
					sResult += _T("<w:applyBreakingRules ");
					sResult += m_oApplyBreakingRules->ToString();
					sResult += _T("/>");
				}

				for ( int nIndex = 0; nIndex < m_arrCompatSettings.GetSize(); nIndex++ )
					sResult += m_arrCompatSettings[nIndex].toXML();

				sResult += _T("</w:compat>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_w_compat;
			}


		public:

			

			
			nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue>> m_oAdjustLineHeightInTable;
			nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue>> m_oApplyBreakingRules;
			nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue>> m_oBalanceSingleByDoubleWidth;
			CSimpleArray<OOX::Settings::CCompatSetting>                   m_arrCompatSettings;
			nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue>> m_oDoNotExpandShiftReturn;
			nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue>> m_oDoNotLeaveBackslaskAlone;
			nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue>> m_oSpaceForUL;
			nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue>> m_oUlTrailSpace;

		};
		
		
		
		class CDocProtect : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CDocProtect)
			CDocProtect()
			{
			}
			virtual ~CDocProtect()
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
				CString sResult = _T("<w:documentProtection ");

				ComplexTypes_WriteAttribute ( _T("w:edit=\""),          m_oEdit );
				ComplexTypes_WriteAttribute ( _T("w:formatting=\""),    m_oFormatting );
				ComplexTypes_WriteAttribute ( _T("w:enforcement=\""),   m_oEnforcment );
				ComplexTypes_WriteAttribute ( _T("w:algorithmName=\""), m_oAlgorithmName );
				ComplexTypes_WriteAttribute2( _T("w:hashValue=\""),     m_sHashValue );
				ComplexTypes_WriteAttribute2( _T("w:saltValue=\""),     m_sSaltValue );
				ComplexTypes_WriteAttribute ( _T("w:spinCount=\""),     m_oSpinCount );

				sResult += _T("/>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_w_documentProtection;
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
					wchar_t wsChar0 = wsName[0]; 
					wchar_t wsChar2 = wsName[2]; 

					if ( 'w' == wsChar0 )
					{
						switch ( wsChar2 )
						{
						case 'a':
							if      ( _T("w:algorithmName") == wsName ) m_oAlgorithmName = oReader.GetText();
							break;

						case 'e':
							if      ( _T("w:edit")          == wsName ) m_oEdit          = oReader.GetText();
							else if ( _T("w:enforcement")   == wsName ) m_oEnforcment    = oReader.GetText();
							break;

						case 'f':
							if      ( _T("w:formatting")    == wsName ) m_oFormatting    = oReader.GetText();
							break;
						case 'h':
							if      ( _T("w:hashValue")     == wsName ) m_sHashValue     = oReader.GetText();
							break;
						case 's':
							if      ( _T("w:saltValue")     == wsName ) m_sSaltValue     = oReader.GetText();
							else if ( _T("w:spinCount")     == wsName ) m_oSpinCount     = oReader.GetText();
							break;
						}

					}

					if ( !oReader.MoveToNextAttribute() )
						break;

					wsName = oReader.GetName();
				}
				oReader.MoveToElement();

				
			}

		public:

			

			
			nullable<SimpleTypes::CCryptAlgoritmName<>> m_oAlgorithmName;
			nullable<SimpleTypes::CDocProtect<>>        m_oEdit;
			nullable<SimpleTypes::COnOff<>>             m_oEnforcment;
			nullable<SimpleTypes::COnOff<>>             m_oFormatting;
			nullable<CString>                           m_sHashValue;
			nullable<CString>                           m_sSaltValue;
			nullable<SimpleTypes::CDecimalNumber<>>     m_oSpinCount;
		};
		
		
		
		class CDocType : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CDocType)
			CDocType()
			{
			}
			virtual ~CDocType()
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
				CString sResult = _T("<w:documentType w:val=\"") + m_oVal.ToString() + _T("\"/>");
				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_w_documentType;
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
					wchar_t wsChar0 = wsName[0]; 
					wchar_t wsChar2 = wsName[2]; 

					if ( 'w' == wsChar0 )
					{
						switch ( wsChar2 )
						{
						case 'v':
							if      ( _T("w:val") == wsName ) m_oVal = oReader.GetText();
							break;
						}

					}

					if ( !oReader.MoveToNextAttribute() )
						break;

					wsName = oReader.GetName();
				}
				oReader.MoveToElement();
			}

		public:

			
			SimpleTypes::CDocType<> m_oVal;
		};
		
		
		
		class CDocVar : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CDocVar)
			CDocVar()
			{
			}
			virtual ~CDocVar()
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
				CString sResult = _T("<w:docVar w:name=\"") + m_sName + _T("\" w:val=\"") + m_sVal + _T("\"/>");
				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_w_docVar;
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
					wchar_t wsChar0 = wsName[0]; 
					wchar_t wsChar2 = wsName[2]; 

					if ( 'w' == wsChar0 )
					{
						switch ( wsChar2 )
						{
						case 'n':
							if      ( _T("w:name") == wsName ) m_sName = oReader.GetText();
							break;

						case 'v':
							if      ( _T("w:val")  == wsName ) m_sVal  = oReader.GetText();
							break;
						}

					}

					if ( !oReader.MoveToNextAttribute() )
						break;

					wsName = oReader.GetName();
				}
				oReader.MoveToElement();
			}

		public:

			
			CString m_sName;
			CString m_sVal;
		};
		
		
		
		class CDocVars : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CDocVars)
			CDocVars()
			{
			}
			virtual ~CDocVars()
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

					if ( _T("w:docVar") == sName )
					{
						OOX::Settings::CDocVar oDV = oReader;
						m_arrDocVar.Add( oDV );
					}
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<w:docVars>");

				for ( int nIndex = 0; nIndex < m_arrDocVar.GetSize(); nIndex++ )
					sResult += m_arrDocVar[nIndex].toXML();

				sResult += _T("</w:docVars>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_w_docVars;
			}


		public:

			
			CSimpleArray<OOX::Settings::CDocVar> m_arrDocVar;
		};
		
		
		
		class CKinsoku : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CKinsoku)
			CKinsoku()
			{
			}
			virtual ~CKinsoku()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				m_eType = et_Unknown;

				CWCharWrapper sName = oReader.GetName();
				if ( _T("w:noLineBreaksAfter") == sName )
					m_eType = et_w_noLineBreaksAfter;
				else if ( _T("w:noLineBreaksBefore") == sName )
					m_eType = et_w_noLineBreaksBefore;
				else
					return;

				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}
			virtual CString      toXML() const
			{
				CString sResult;
				
				if ( et_w_noLineBreaksAfter == m_eType )
					sResult	= _T("<w:noLineBreaksAfter w:lang=\"") + m_oLang.ToString() + _T("\" w:val=\"") + m_sVal + _T("\"/>");
				else if ( et_w_noLineBreaksBefore == m_eType ) 
					sResult	= _T("<w:noLineBreaksBefore w:lang=\"") + m_oLang.ToString() + _T("\" w:val=\"") + m_sVal + _T("\"/>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return m_eType;
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
					wchar_t wsChar0 = wsName[0]; 
					wchar_t wsChar2 = wsName[2]; 

					if ( 'w' == wsChar0 )
					{
						switch ( wsChar2 )
						{
						case 'l':
							if      ( _T("w:lang") == wsName ) m_oLang = oReader.GetText();
							break;

						case 'v':
							if      ( _T("w:val")  == wsName ) m_sVal  = oReader.GetText();
							break;
						}

					}

					if ( !oReader.MoveToNextAttribute() )
						break;

					wsName = oReader.GetName();
				}
				oReader.MoveToElement();
			}

		public:

			EElementType       m_eType;

			
			SimpleTypes::CLang m_oLang;
			CString            m_sVal;
		};
		
		
		
		class CProof : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CProof)
			CProof()
			{
			}
			virtual ~CProof()
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
				CString sResult = _T("<w:proofState ");

				ComplexTypes_WriteAttribute ( _T("w:spelling=\""), m_oSpelling );
				ComplexTypes_WriteAttribute ( _T("w:grammar=\""),  m_oGrammar );

				sResult += _T("/>");
				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_w_proofState;
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
					wchar_t wsChar0 = wsName[0]; 
					wchar_t wsChar2 = wsName[2]; 

					if ( 'w' == wsChar0 )
					{
						switch ( wsChar2 )
						{
						case 'g':
							if      ( _T("w:grammar")  == wsName ) m_oGrammar  = oReader.GetText();
							break;

						case 's':
							if      ( _T("w:spelling") == wsName ) m_oSpelling = oReader.GetText();
							break;
						}

					}

					if ( !oReader.MoveToNextAttribute() )
						break;

					wsName = oReader.GetName();
				}
				oReader.MoveToElement();
			}

		public:

			
			nullable<SimpleTypes::CProof<>> m_oGrammar;
			nullable<SimpleTypes::CProof<>> m_oSpelling;
		};
		
		
		
		class CReadingModeInkLockDown : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CReadingModeInkLockDown)
			CReadingModeInkLockDown()
			{
			}
			virtual ~CReadingModeInkLockDown()
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
				CString sResult = _T("<w:readModeInkLockDown ");

				sResult += _T("w:w=\"")        + m_oW.ToString() 
					  + _T("\" w:h=\"")        + m_oH.ToString() 
					  + _T("\" w:fontSz=\"")   + m_oFontSz.ToString() 
					  + _T("\" w:actualPg=\"") + m_oActualPg.ToString() + _T("\"/>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_w_readModeInkLockDown;
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
					wchar_t wsChar0 = wsName[0]; 
					wchar_t wsChar2 = wsName[2]; 

					if ( 'w' == wsChar0 )
					{
						switch ( wsChar2 )
						{
						case 'a':
							if      ( _T("w:actualPg")  == wsName ) m_oActualPg = oReader.GetText();
							break;

						case 'f':
							if      ( _T("w:fontSz")    == wsName ) m_oFontSz   = oReader.GetText();
							break;

						case 'h':
							if      ( _T("w:h")         == wsName ) m_oH        = oReader.GetText();
							break;

						case 'w':
							if      ( _T("w:w")         == wsName ) m_oW        = oReader.GetText();
							break;
						}

					}

					if ( !oReader.MoveToNextAttribute() )
						break;

					wsName = oReader.GetName();
				}
				oReader.MoveToElement();
			}

		public:

			
			SimpleTypes::COnOff<SimpleTypes::onoffFalse> m_oActualPg;
			SimpleTypes::CDecimalNumberOrPercent         m_oFontSz;
			SimpleTypes::CPixelsMeasure<>                m_oH;
			SimpleTypes::CPixelsMeasure<>                m_oW;
		};
		
		
		
		class CTrackChangesView : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CTrackChangesView)
			CTrackChangesView()
			{
			}
			virtual ~CTrackChangesView()
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
				CString sResult = _T("<w:revisionView ");

				ComplexTypes_WriteAttribute ( _T("w:markup=\""),         m_oMarkup );
				ComplexTypes_WriteAttribute ( _T("w:comments=\""),       m_oComments );
				ComplexTypes_WriteAttribute ( _T("w:insDel=\""),         m_oInsDel );
				ComplexTypes_WriteAttribute ( _T("w:formatting=\""),     m_oFormatting );
				ComplexTypes_WriteAttribute ( _T("w:inkAnnotations=\""), m_oInkAnnotataions );

				sResult += _T("/>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_w_revisionView;
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
					wchar_t wsChar0 = wsName[0]; 
					wchar_t wsChar2 = wsName[2]; 

					if ( 'w' == wsChar0 )
					{
						switch ( wsChar2 )
						{
						case 'c':
							if      ( _T("w:comments")       == wsName ) m_oComments        = oReader.GetText();
							break;

						case 'f':
							if      ( _T("w:formatting")     == wsName ) m_oFormatting      = oReader.GetText();
							break;

						case 'i':
							if      ( _T("w:inkAnnotations") == wsName ) m_oInkAnnotataions = oReader.GetText();
							else if ( _T("w:insDel")         == wsName ) m_oInsDel          = oReader.GetText();
							break;

						case 'm':
							if      ( _T("w:markup")         == wsName ) m_oMarkup          = oReader.GetText();
							break;
						}

					}

					if ( !oReader.MoveToNextAttribute() )
						break;

					wsName = oReader.GetName();
				}
				oReader.MoveToElement();
			}

		public:

			
			nullable<SimpleTypes::COnOff<>> m_oComments;
			nullable<SimpleTypes::COnOff<>> m_oFormatting;
			nullable<SimpleTypes::COnOff<>> m_oInkAnnotataions;
			nullable<SimpleTypes::COnOff<>> m_oInsDel;
			nullable<SimpleTypes::COnOff<>> m_oMarkup;
		};
		
		
		
		class CDocRsids : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CDocRsids)
			CDocRsids()
			{
			}
			virtual ~CDocRsids()
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

					if ( _T("w:rsid") == sName )
					{
						ComplexTypes::Word::CLongHexNumber oRsid = oReader;
						m_arrRsid.Add( oRsid );
					}
					else if ( _T("w:rsidRoot") == sName )
						m_oRsidRoot = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<w:rsids>");

				if ( m_oRsidRoot.IsInit() )
				{
					sResult += _T("<w:rsidRoot ");
					sResult += m_oRsidRoot->ToString();
					sResult += _T("/>");
				}

				for ( int nIndex = 0; nIndex < m_arrRsid.GetSize(); nIndex++ )
				{
					sResult += _T("<w:rsid ");
					sResult += m_arrRsid[nIndex].ToString();
					sResult += _T("/>");
				}

				sResult += _T("</w:rsids>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_w_rsids;
			}


		public:

			
			nullable<ComplexTypes::Word::CLongHexNumber>     m_oRsidRoot;
			CSimpleArray<ComplexTypes::Word::CLongHexNumber> m_arrRsid;
		};
		
		
		
		class CSaveThroughXslt : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CSaveThroughXslt)
			CSaveThroughXslt()
			{
			}
			virtual ~CSaveThroughXslt()
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
				CString sResult = _T("<w:saveThroughXslt ");

				ComplexTypes_WriteAttribute ( _T("r:id=\""),         m_rId );
				ComplexTypes_WriteAttribute2( _T("w:solutionID=\""), m_sSolutionID );

				sResult += _T("/>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_w_saveThroughXslt;
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
					if      ( _T("r:id")         == wsName ) m_rId         = oReader.GetText();
					else if ( _T("w:solutionID") == wsName ) m_sSolutionID = oReader.GetText();

					if ( !oReader.MoveToNextAttribute() )
						break;

					wsName = oReader.GetName();
				}
				oReader.MoveToElement();
			}

		public:

			
			nullable<SimpleTypes::CRelationshipId> m_rId;
			nullable<CString>                      m_sSolutionID;
		};
		
		
		
		class CSmartTagType : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CSmartTagType)
			CSmartTagType()
			{
			}
			virtual ~CSmartTagType()
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
				CString sResult = _T("<w:smartTagType ");

				ComplexTypes_WriteAttribute2( _T("w:namespaceuri=\""), m_sNameSpaceUri );
				ComplexTypes_WriteAttribute2( _T("w:name=\""),         m_sName );
				ComplexTypes_WriteAttribute2( _T("w:url=\""),          m_sUrl );

				sResult += _T("/>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_w_smartTagType;
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
					if      ( _T("w:name")         == wsName ) m_sName         = oReader.GetText();
					else if ( _T("w:namespaceuri") == wsName ) m_sNameSpaceUri = oReader.GetText();
					else if ( _T("w:url")          == wsName ) m_sUrl          = oReader.GetText();

					if ( !oReader.MoveToNextAttribute() )
						break;

					wsName = oReader.GetName();
				}
				oReader.MoveToElement();
			}

		public:

			
			nullable<CString> m_sName;
			nullable<CString> m_sNameSpaceUri;
			nullable<CString> m_sUrl;
		};
		
		
		
		class CStylePaneFilter : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CStylePaneFilter)
			CStylePaneFilter()
			{
			}
			virtual ~CStylePaneFilter()
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
				CString sResult = _T("<w:stylePaneFormatFilter ");

				ComplexTypes_WriteAttribute( _T("w:allStyles=\""),                    m_oAllStyles );
				ComplexTypes_WriteAttribute( _T("w:alternateStyleNames=\""),          m_oAlternateStyleNames );
				ComplexTypes_WriteAttribute( _T("w:clearFormatting=\""),              m_oClearFormatting );
				ComplexTypes_WriteAttribute( _T("w:customStyles=\""),                 m_oCustomStyles );
				ComplexTypes_WriteAttribute( _T("w:directFormattingOnNumbering=\""),  m_oDirectFormattingOnNumbering );
				ComplexTypes_WriteAttribute( _T("w:directFormattingOnParagraphs=\""), m_oDirectFormattingOnParagraphs );
				ComplexTypes_WriteAttribute( _T("w:directFormattingOnRuns=\""),       m_oDirectFormattingOnRuns );
				ComplexTypes_WriteAttribute( _T("w:directFormattingOnTables=\""),     m_oDirectFormattingOnTables );
				ComplexTypes_WriteAttribute( _T("w:headingStyles=\""),                m_oHeadingStyles );
				ComplexTypes_WriteAttribute( _T("w:latentStyles=\""),                 m_oLatentStyles );
				ComplexTypes_WriteAttribute( _T("w:numberingStyles=\""),              m_oNumberingStyles );
				ComplexTypes_WriteAttribute( _T("w:stylesInUse=\""),                  m_oStylesInUse );
				ComplexTypes_WriteAttribute( _T("w:tableStyles=\""),                  m_oTableStyles );
				ComplexTypes_WriteAttribute( _T("w:top3HeadingStyles=\""),            m_oTop3HeadingStyles );
				ComplexTypes_WriteAttribute( _T("w:visibleStyles=\""),                m_oVisibleStyles );

				sResult += _T("/>");
				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_w_stylePaneFormatFilter;
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
					wchar_t wsChar0 = wsName[0]; 
					wchar_t wsChar2 = wsName[2]; 

					if ( 'w' == wsChar0 )
					{
						switch ( wsChar2 )
						{
						case 'a':
							if      ( _T("w:allStyles")           == wsName ) m_oAllStyles           = oReader.GetText();
							else if ( _T("w:alternateStyleNames") == wsName ) m_oAlternateStyleNames = oReader.GetText();
							break;

						case 'c':
							if      ( _T("w:clearFormatting") == wsName ) m_oClearFormatting = oReader.GetText();
							else if ( _T("w:customStyles")    == wsName ) m_oCustomStyles    = oReader.GetText();
							break;

						case 'd':
							if      ( _T("w:directFormattingOnNumbering")  == wsName ) m_oDirectFormattingOnNumbering  = oReader.GetText();
							else if ( _T("w:directFormattingOnParagraphs") == wsName ) m_oDirectFormattingOnParagraphs = oReader.GetText();
							else if ( _T("w:directFormattingOnRuns")       == wsName ) m_oDirectFormattingOnRuns       = oReader.GetText();
							else if ( _T("w:directFormattingOnTables")     == wsName ) m_oDirectFormattingOnTables     = oReader.GetText();
							break;

						case 'h':
							if      ( _T("w:headingStyles") == wsName ) m_oHeadingStyles = oReader.GetText();
							break;

						case 'l':
							if      ( _T("w:latentStyles") == wsName ) m_oLatentStyles = oReader.GetText();
							break;

						case 'n':
							if      ( _T("w:numberingStyles") == wsName ) m_oNumberingStyles = oReader.GetText();
							break;

						case 's':
							if      ( _T("w:stylesInUse") == wsName ) m_oStylesInUse = oReader.GetText();
							break;

						case 't':
							if      ( _T("w:tableStyles")       == wsName ) m_oTableStyles       = oReader.GetText();
							else if ( _T("w:top3HeadingStyles") == wsName ) m_oTop3HeadingStyles = oReader.GetText();
							break;

						case 'v':
							if      ( _T("w:visibleStyles") == wsName ) m_oVisibleStyles = oReader.GetText();
							break;
						}

					}

					if ( !oReader.MoveToNextAttribute() )
						break;

					wsName = oReader.GetName();
				}
				oReader.MoveToElement();
			}

		public:

			

			
			nullable<SimpleTypes::COnOff<>> m_oAllStyles;
			nullable<SimpleTypes::COnOff<>> m_oAlternateStyleNames;
			nullable<SimpleTypes::COnOff<>> m_oClearFormatting;
			nullable<SimpleTypes::COnOff<>> m_oCustomStyles;
			nullable<SimpleTypes::COnOff<>> m_oDirectFormattingOnNumbering;
			nullable<SimpleTypes::COnOff<>> m_oDirectFormattingOnParagraphs;
			nullable<SimpleTypes::COnOff<>> m_oDirectFormattingOnRuns;
			nullable<SimpleTypes::COnOff<>> m_oDirectFormattingOnTables;
			nullable<SimpleTypes::COnOff<>> m_oHeadingStyles;
			nullable<SimpleTypes::COnOff<>> m_oLatentStyles;
			nullable<SimpleTypes::COnOff<>> m_oNumberingStyles;
			nullable<SimpleTypes::COnOff<>> m_oStylesInUse;
			nullable<SimpleTypes::COnOff<>> m_oTableStyles;
			nullable<SimpleTypes::COnOff<>> m_oTop3HeadingStyles;
			nullable<SimpleTypes::COnOff<>> m_oVisibleStyles;
		};
		
		
		
		class CStyleSort : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CStyleSort)
			CStyleSort()
			{
			}
			virtual ~CStyleSort()
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
				CString sResult = _T("<w:stylePaneSortMethod w:val=\"") + m_oVal.ToString() + _T("\"/>");
				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_w_stylePaneSortMethod;
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
					if ( _T("w:val") == wsName ) 
						m_oVal = oReader.GetText();

					if ( !oReader.MoveToNextAttribute() )
						break;

					wsName = oReader.GetName();
				}
				oReader.MoveToElement();
			}

		public:

			
			SimpleTypes::CStyleSort<> m_oVal;
		};
		
		
		
		class CView : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CView)
			CView()
			{
			}
			virtual ~CView()
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
				CString sResult = _T("<w:view w:val=\"") + m_oVal.ToString() + _T("\"/>");
				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_w_stylePaneSortMethod;
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
					if ( _T("w:val") == wsName ) 
						m_oVal = oReader.GetText();

					if ( !oReader.MoveToNextAttribute() )
						break;

					wsName = oReader.GetName();
				}
				oReader.MoveToElement();
			}

		public:

			
			SimpleTypes::CView<> m_oVal;
		};
		
		
		
		class CWriteProtection : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CWriteProtection)
			CWriteProtection()
			{
			}
			virtual ~CWriteProtection()
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
				CString sResult = _T("<w:writeProtection ");

				ComplexTypes_WriteAttribute ( _T("w:recommended=\""),   m_oRecommended );
				ComplexTypes_WriteAttribute ( _T("w:algorithmName=\""), m_oAlgorithmName );
				ComplexTypes_WriteAttribute2( _T("w:hashValue=\""),     m_sHashValue );
				ComplexTypes_WriteAttribute2( _T("w:saltValue=\""),     m_sSaltValue );
				ComplexTypes_WriteAttribute ( _T("w:spinCount=\""),     m_oSpinCount );

				sResult += _T("/>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_w_writeProtection;
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
					wchar_t wsChar0 = wsName[0]; 
					wchar_t wsChar2 = wsName[2]; 

					if ( 'w' == wsChar0 )
					{
						switch ( wsChar2 )
						{
						case 'a':
							if      ( _T("w:algorithmName") == wsName ) m_oAlgorithmName = oReader.GetText();
							break;
						case 'h':
							if      ( _T("w:hashValue")     == wsName ) m_sHashValue     = oReader.GetText();
							break;
						case 'r':
							if      ( _T("w:recommended")   == wsName ) m_oRecommended   = oReader.GetText();
							break;
						case 's':
							if      ( _T("w:saltValue")     == wsName ) m_sSaltValue     = oReader.GetText();
							else if ( _T("w:spinCount")     == wsName ) m_oSpinCount     = oReader.GetText();
							break;
						}

					}

					if ( !oReader.MoveToNextAttribute() )
						break;

					wsName = oReader.GetName();
				}
				oReader.MoveToElement();

				
			}

		public:

			

			
			nullable<SimpleTypes::CCryptAlgoritmName<>> m_oAlgorithmName;
			nullable<CString>                           m_sHashValue;
			nullable<SimpleTypes::COnOff<>>             m_oRecommended;
  			nullable<CString>                           m_sSaltValue;
			nullable<SimpleTypes::CDecimalNumber<>>     m_oSpinCount;
		};
		
		
		
		class CZoom : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CZoom)
			CZoom()
			{
			}
			virtual ~CZoom()
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
				CString sResult = _T("<w:zoom ");

				ComplexTypes_WriteAttribute ( _T("w:val=\""), m_oVal );

				sResult += _T("w:percent=\"") + m_oPercent.ToString() + _T("\"/>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_w_zoom;
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
					wchar_t wsChar0 = wsName[0]; 
					wchar_t wsChar2 = wsName[2]; 

					if ( 'w' == wsChar0 )
					{
						switch ( wsChar2 )
						{
						case 'p':
							if      ( _T("w:percent") == wsName ) m_oPercent = oReader.GetText();
							break;
						case 'v':
							if      ( _T("w:val")     == wsName ) m_oVal     = oReader.GetText();
							break;
						}

					}

					if ( !oReader.MoveToNextAttribute() )
						break;

					wsName = oReader.GetName();
				}
				oReader.MoveToElement();

			}

		public:

			
			SimpleTypes::CDecimalNumberOrPercent m_oPercent;
			nullable<SimpleTypes::CZoom<>>       m_oVal;
		};
		
		
		
		class CEdnDocProps : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CEdnDocProps)
			CEdnDocProps()
			{
			}
			virtual ~CEdnDocProps()
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

				int nParentDepth = oReader.GetDepth();
				while( oReader.ReadNextSiblingNode( nParentDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();
					if ( _T("w:numFmt") == sName )
						m_oNumFmt = oReader;
					else if ( _T("w:numRestart") == sName )
						m_oNumRestart = oReader;
					else if ( _T("w:numStart") == sName )
						m_oNumStart = oReader;
					else if ( _T("w:pos") == sName )
						m_oPos = oReader;
					else if ( _T("w:endnote") == sName )
					{
						OOX::CFtnEdnSepRef oFE = oReader;
						m_arrEndnote.Add( oFE );
					}
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<w:endnotePr>");

				for ( int nIndex = 0; nIndex < m_arrEndnote.GetSize(); nIndex++ )
					sResult += m_arrEndnote[nIndex].toXML();

				if ( m_oNumFmt.IsInit() )
				{
					sResult += "<w:numFmt ";
					sResult += m_oNumFmt->ToString();
					sResult += "/>";
				}

				if ( m_oNumRestart.IsInit() )
				{
					sResult += "<w:numRestart ";
					sResult += m_oNumRestart->ToString();
					sResult += "/>";
				}

				if ( m_oNumStart.IsInit() )
				{
					sResult += "<w:numStart ";
					sResult += m_oNumStart->ToString();
					sResult += "/>";
				}

				if ( m_oPos.IsInit() )
				{
					sResult += "<w:pos ";
					sResult += m_oPos->ToString();
					sResult += "/>";
				}

				sResult += _T("</w:endnotePr>");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_w_endnotePr;
			}
		public:

			CSimpleArray<OOX::CFtnEdnSepRef             > m_arrEndnote;
			nullable<ComplexTypes::Word::CNumFmt        > m_oNumFmt;
			nullable<ComplexTypes::Word::CNumRestart    > m_oNumRestart;
			nullable<ComplexTypes::Word::CDecimalNumber > m_oNumStart;
			nullable<ComplexTypes::Word::CEdnPos        > m_oPos;
		};
		
		
		
		class CFtnDocProps : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CFtnDocProps)
			CFtnDocProps()
			{
			}
			virtual ~CFtnDocProps()
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

				int nParentDepth = oReader.GetDepth();
				while( oReader.ReadNextSiblingNode( nParentDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();
					if ( _T("w:numFmt") == sName )
						m_oNumFmt = oReader;
					else if ( _T("w:numRestart") == sName )
						m_oNumRestart = oReader;
					else if ( _T("w:numStart") == sName )
						m_oNumStart = oReader;
					else if ( _T("w:pos") == sName )
						m_oPos = oReader;
					else if ( _T("w:footnote") == sName )
					{
						OOX::CFtnEdnSepRef oFE = oReader;
						m_arrFootnote.Add( oFE );
					}
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<w:footnotePr>");

				for ( int nIndex = 0; nIndex < m_arrFootnote.GetSize(); nIndex++ )
					sResult += m_arrFootnote[nIndex].toXML();

				if ( m_oNumFmt.IsInit() )
				{
					sResult += "<w:numFmt ";
					sResult += m_oNumFmt->ToString();
					sResult += "/>";
				}

				if ( m_oNumRestart.IsInit() )
				{
					sResult += "<w:numRestart ";
					sResult += m_oNumRestart->ToString();
					sResult += "/>";
				}

				if ( m_oNumStart.IsInit() )
				{
					sResult += "<w:numStart ";
					sResult += m_oNumStart->ToString();
					sResult += "/>";
				}

				if ( m_oPos.IsInit() )
				{
					sResult += "<w:pos ";
					sResult += m_oPos->ToString();
					sResult += "/>";
				}

				sResult += _T("</w:footnotePr>");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_w_footnotePr;
			}
		public:

			CSimpleArray<OOX::CFtnEdnSepRef             > m_arrFootnote;
			nullable<ComplexTypes::Word::CNumFmt        > m_oNumFmt;
			nullable<ComplexTypes::Word::CNumRestart    > m_oNumRestart;
			nullable<ComplexTypes::Word::CDecimalNumber > m_oNumStart;
			nullable<ComplexTypes::Word::CFtnPos        > m_oPos;
		};
	} 
} 

namespace OOX
{
	namespace Settings
	{
		
		
		
		class CSchema : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CSchema)
			CSchema()
			{
			}
			virtual ~CSchema()
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
				CString sResult = _T("<sl:schema sl:uri=\"") + m_sUri
					+ _T("\" sl:manifestLocation=\"") + m_sManifestLocation 
					+ _T("\" sl:schemaLocation=\"") + m_sShemaLocation
					+ _T("\" sl:schemaLanguage=\"") + m_sShemaLanguage + _T("\"/>");
				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_sl_schema;
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
					if ( _T("sl:uri") == wsName ) 
						m_sUri = oReader.GetText();
					else if ( _T("sl:schemaLocation") == wsName ) 
						m_sShemaLocation = oReader.GetText();
					else if ( _T("sl:schemaLanguage") == wsName ) 
						m_sShemaLanguage = oReader.GetText();
					else if ( _T("sl:manifestLocation") == wsName ) 
						m_sManifestLocation = oReader.GetText();

					if ( !oReader.MoveToNextAttribute() )
						break;

					wsName = oReader.GetName();
				}
				oReader.MoveToElement();
			}

		public:

			
			CString m_sManifestLocation;
			CString m_sShemaLanguage;
			CString m_sShemaLocation;
			CString m_sUri;

		};
		
		
		
		class CSchemaLibrary : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CSchemaLibrary)
			CSchemaLibrary()
			{
			}
			virtual ~CSchemaLibrary()
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

					if ( _T("sl:schema") == sName )
					{
						OOX::Settings::CSchema oSchema = oReader;
						m_arrSchema.Add( oSchema );
					}
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<sl:schemaLibrary>");

				for ( int nIndex = 0; nIndex < m_arrSchema.GetSize(); nIndex++ )
					sResult += m_arrSchema[nIndex].toXML();

				sResult += _T("</sl:schemaLibrary>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_sl_schemaLibrary;
			}


		public:

			
			CSimpleArray<OOX::Settings::CSchema> m_arrSchema;
		};
	} 
} 

namespace OOX
{
	namespace Settings
	{
		
		
		
		class CShapeDefaults : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CShapeDefaults)
			CShapeDefaults()
			{
				m_eType = et_Unknown;
			}
			virtual ~CShapeDefaults()
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

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				m_eType = et_Unknown;
				
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{			
				m_eType = et_Unknown;
				CWCharWrapper sName = oReader.GetName();

				if ( _T("w:hdrShapeDefaults") == sName )
					m_eType = et_w_hdrShapeDefaults;
				else if ( _T("w:shapeDefaults") == sName )
					m_eType = et_w_shapeDefaults;
				else
					return;

				if ( oReader.IsEmptyNode() )
					return;

				int nCurDepth = oReader.GetDepth();
				while ( oReader.ReadNextSiblingNode( nCurDepth ) )
				{
					sName = oReader.GetName();

					WritingElement* pItem = NULL;

					wchar_t wChar0 = sName[0];
					if ( 'o' == wChar0 )
					{
						wchar_t wChar2 = sName[2]; 
						switch ( wChar2 )
						{
						case 'b':
							if ( _T("o:bottom") == sName )
								pItem = new OOX::VmlOffice::CStrokeChild( oReader );

							break;

						case 'c':
							if ( _T("o:callout") == sName )
								pItem = new OOX::VmlOffice::CCallout( oReader );
							else if ( _T("o:clippath") == sName )
								pItem = new OOX::VmlOffice::CClipPath( oReader );
							else if ( _T("o:column") == sName )
								pItem = new OOX::VmlOffice::CStrokeChild( oReader );
							else if ( _T("o:complex") == sName )
								pItem = new OOX::VmlOffice::CComplex( oReader );

							break;

						case 'd':
							if ( _T("o:diagram") == sName )
								pItem = new OOX::VmlOffice::CDiagram( oReader );

							break;

						case 'e':
							if ( _T("o:equationxml") == sName )
								pItem = new OOX::VmlOffice::CEquationXml( oReader );
							else if ( _T("o:extrusion") == sName )
								pItem = new OOX::VmlOffice::CExtrusion( oReader );

							break;

						case 'f':
							if ( _T("o:fill") == sName )
								pItem = new OOX::VmlOffice::CFill( oReader );

							break;

						case 'i':
							if ( _T("o:ink") == sName )
								pItem = new OOX::VmlOffice::CInk( oReader );

							break;

						case 'l':
							if ( _T("o:left") == sName )
								pItem = new OOX::VmlOffice::CStrokeChild( oReader );
							else if ( _T("o:lock") == sName )
								pItem = new OOX::VmlOffice::CLock( oReader );

							break;

						case 'O':
							if ( _T("o:OLEObject") == sName )
								pItem = new OOX::VmlOffice::COLEObject( oReader );

							break;

						case 'r':
							if ( _T("o:right") == sName )
								pItem = new OOX::VmlOffice::CStrokeChild( oReader );

							break;

						case 's':
							if ( _T("o:shapedefaults") == sName )
								pItem = new OOX::VmlOffice::CShapeDefaults( oReader );
							else if ( _T("o:shapelayout") == sName )
								pItem = new OOX::VmlOffice::CShapeLayout( oReader );
							else if ( _T("o:signatureline") == sName )
								pItem = new OOX::VmlOffice::CSignatureLine( oReader );
							else if ( _T("o:skew") == sName )
								pItem = new OOX::VmlOffice::CSkew( oReader );

							break;

						case 't':
							if ( _T("o:top") == sName )
								pItem = new OOX::VmlOffice::CStrokeChild( oReader );

							break;
						}
					}

					if ( pItem )
						m_arrItems.Add( pItem );
				}
			}

			virtual CString      toXML() const
			{
				CString sResult;
				
				if ( et_w_hdrShapeDefaults == m_eType )
					sResult = _T("<w:hdrShapeDefaults>");
				else if ( et_w_shapeDefaults == m_eType )
					sResult = _T("<w:shapeDefaults>");
				else
					return _T("");

				for ( int nIndex = 0; nIndex < m_arrItems.GetSize(); nIndex++ )
				{
					if ( m_arrItems[nIndex] )
						sResult += m_arrItems[nIndex]->toXML();
				}

				if ( et_w_hdrShapeDefaults == m_eType )
					sResult += _T("</w:hdrShapeDefaults>");
				else if ( et_w_shapeDefaults == m_eType )
					sResult += _T("</w:shapeDefaults>");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return m_eType;
			}


		public:

			EElementType                   m_eType;

			
			CSimpleArray<WritingElement*>  m_arrItems; 

		};
	} 
} 


namespace OOX
{
	
	
	
	class CSettings : public OOX::File
	{
	public:
		CSettings()
		{
		}
		CSettings(const CPath& oPath)
		{
			read( oPath );
		}
		virtual ~CSettings()
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
			if ( _T("w:settings") == sName && !oReader.IsEmptyNode() )
			{
				int nStylesDepth = oReader.GetDepth();
				while ( oReader.ReadNextSiblingNode( nStylesDepth ) )
				{
					sName = oReader.GetName();

					wchar_t wChar0 = sName[0];
					wchar_t wChar2 = sName[2];

					if ( 'w' == wChar0 )
					{
						switch ( wChar2 )
						{
						case 'a':
							if      ( _T("w:activeWritingStyle")         == sName ) m_oActiveWritingStyle         = oReader;
							else if ( _T("w:alignBordersAndEdges")       == sName ) m_oAlignBordersAndEdges       = oReader;
							else if ( _T("w:alwaysMergeEmptyNamespace")  == sName ) m_oAlwaysMergeEmptyNamespace  = oReader;
							else if ( _T("w:alwaysShowPlaceholderText")  == sName ) m_oAlwaysShowPlaceholderText  = oReader;
							else if ( _T("w:attachedSchema")             == sName ) m_oAttachedSchema             = oReader;
							else if ( _T("w:attachedTemplate")           == sName ) m_oAttachedTemplate           = oReader;
							else if ( _T("w:autoFormatOverride")         == sName ) m_oAutoFormatOverride         = oReader;
							else if ( _T("w:autoHyphenation")            == sName ) m_oAutoHyphenation            = oReader;
							break;
						case 'b':
							if      ( _T("w:bookFoldPrinting")           == sName ) m_oBookFoldPrinting           = oReader;
							else if ( _T("w:bookFoldPrintingSheets")     == sName ) m_oBookFoldPrintingSheets     = oReader;
							else if ( _T("w:bookFoldRevPrinting")        == sName ) m_oBookFoldRevPrinting        = oReader;
							else if ( _T("w:bordersDoNotSurroundFooter") == sName ) m_oBordersDoNotSurroundFooter = oReader;
							else if ( _T("w:bordersDoNotSurroundHeader") == sName ) m_oBordersDoNotSurroundHeader = oReader;
							break;
						case 'c':
							if      ( _T("w:captions")                   == sName ) m_oCaptions                   = oReader;
							else if ( _T("w:characterSpacingControl")    == sName ) m_oCharacterSpacingControl    = oReader;
							else if ( _T("w:clickAndTypeStyle")          == sName ) m_oClickAndTypeStyle          = oReader;
							else if ( _T("w:clrSchemeMapping")           == sName ) m_oClrSchemeMapping           = oReader;
							else if ( _T("w:compat")                     == sName ) m_oCompat                     = oReader;
							else if ( _T("w:consecutiveHyphenLimit")     == sName ) m_oConsecutiveHyphenLimit     = oReader;
							break;
						case 'd':
							if      ( _T("w:decimalSymbol")              == sName ) m_oDecimalSymbol              = oReader;
							else if ( _T("w:defaultTableStyle")          == sName ) m_oDefaultTableStyle          = oReader;
							else if ( _T("w:defaultTabStop")             == sName ) m_oDefaultTabStop             = oReader;
							else if ( _T("w:displayBackgroundShape")     == sName ) m_oDisplayBackgroundShape     = oReader;
							else if ( _T("w:displayHorizontalDrawingGridEvery") == sName ) m_oDisplayHorizontalDrawingGridEvery = oReader;
							else if ( _T("w:displayVerticalDrawingGridEvery")   == sName ) m_oDisplayVerticalDrawingGridEvery   = oReader;
							else if ( _T("w:documentProtection")         == sName ) m_oDocumentProtection         = oReader;
							else if ( _T("w:documentType")               == sName ) m_oDocumentType               = oReader;
							else if ( _T("w:docVars")                    == sName ) m_oDocVars                    = oReader;
							else if ( _T("w:doNotAutoCompressPictures")  == sName ) m_oDoNotAutoCompressPictures  = oReader;
							else if ( _T("w:doNotDemarcateInvalidXml")   == sName ) m_oDoNotDemarcateInvalidXml   = oReader;
							else if ( _T("w:doNotDisplayPageBoundaries") == sName ) m_oDoNotDisplayPageBoundaries = oReader;
							else if ( _T("w:doNotEmbedSmartTags")        == sName ) m_oDoNotEmbedSmartTags        = oReader;
							else if ( _T("w:doNotHyphenateCaps")         == sName ) m_oDoNotHyphenateCaps         = oReader;
							else if ( _T("w:doNotIncludeSubdocsInStats") == sName ) m_oDoNotIncludeSubdocsInStats = oReader;
							else if ( _T("w:doNotShadeFormData")         == sName ) m_oDoNotShadeFormData         = oReader;
							else if ( _T("w:doNotTrackFormatting")       == sName ) m_oDoNotTrackFormatting       = oReader;
							else if ( _T("w:doNotTrackMoves")            == sName ) m_oDoNotTrackMoves            = oReader;
							else if ( _T("w:doNotUseMarginsForDrawingGridOrigin") == sName ) m_oDoNotUseMarginsForDrawingGridOrigin = oReader;
							else if ( _T("w:doNotValidateAgainstSchema") == sName ) m_oDoNotValidateAgainstSchema = oReader;
							else if ( _T("w:drawingGridHorizontalOrigin")  == sName ) m_oDrawingGridHorizontalOrigin  = oReader;
							else if ( _T("w:drawingGridHorizontalSpacing") == sName ) m_oDrawingGridHorizontalSpacing = oReader;
							else if ( _T("w:drawingGridVerticalOrigin")  == sName ) m_oDrawingGridVerticalOrigin  = oReader;
							else if ( _T("w:drawingGridVerticalSpacing") == sName ) m_oDrawingGridVerticalSpacing = oReader;
							break;
						case 'e':
							if      ( _T("w:embedSystemFonts")           == sName ) m_oEmbedSystemFonts           = oReader;
							else if ( _T("w:embedTrueTypeFonts")         == sName ) m_oEmbedTrueTypeFonts         = oReader;
							else if ( _T("w:endnotePr")                  == sName ) m_oEndnotePr                  = oReader;
							else if ( _T("w:evenAndOddHeaders")          == sName ) m_oEvenAndOddHeaders          = oReader;
							break;
						case 'f':
							if      ( _T("w:footnotePr")                 == sName ) m_oFootnotePr                 = oReader;
							else if ( _T("w:forceUpgrade")               == sName ) m_oForceUpgrade               = oReader;
							else if ( _T("w:formsDesign")                == sName ) m_oFormsDesign                = oReader;
							break;
						case 'g':
							if      ( _T("w:gutterAtTop")                == sName ) m_oGutterAtTop                = oReader;
							break;
						case 'h':
							if      ( _T("w:hdrShapeDefaults")           == sName ) m_oHdrShapeDefaults           = oReader;
							else if ( _T("w:hideGrammaticalErrors")      == sName ) m_oHideGrammaticalErrors      = oReader;
							else if ( _T("w:hideSpellingErrors")         == sName ) m_oHideSpellingErrors         = oReader;
							else if ( _T("w:hyphenationZone")            == sName ) m_oHyphenationZone            = oReader;
							break;
						case 'i':
							if      ( _T("w:ignoreMixedContent")         == sName ) m_oIgnoreMixedContent         = oReader;
							break;
						case 'l':
							if      ( _T("w:linkStyles")                 == sName ) m_oLinkStyles                 = oReader;
							else if ( _T("w:listSeparator")              == sName ) m_oListSeparator              = oReader;
							break;
						case 'm':
							if      ( _T("w:mirrorMargins")              == sName ) m_oMirrorMargins              = oReader;
							break;
						case 'n':
							if      ( _T("w:noLineBreaksAfter")          == sName ) m_oNoLineBreaksAfter          = oReader;
							else if ( _T("w:noLineBreaksBefore")         == sName ) m_oNoLineBreaksBefore         = oReader;
							else if ( _T("w:noPunctuationKerning")       == sName ) m_oNoPunctuationKerning       = oReader;
							break;
						case 'p':
							if      ( _T("w:printFormsData")             == sName ) m_oPrintFormsData             = oReader;
							else if ( _T("w:printFractionalCharacterWidth") == sName ) m_oPrintFractionalCharacterWidth = oReader;
							else if ( _T("w:printPostScriptOverText")    == sName ) m_oPrintPostScriptOverText    = oReader;
							else if ( _T("w:printTwoOnOne")              == sName ) m_oPrintTwoOnOne              = oReader;
							else if ( _T("w:proofState")                 == sName ) m_oProofState                 = oReader;
							break;
						case 'r':
							if      ( _T("w:readModeInkLockDown")        == sName ) m_oReadModeInkLockDown        = oReader;
							else if ( _T("w:removeDateAndTime")          == sName ) m_oRemoveDateAndTime          = oReader;
							else if ( _T("w:removePersonalInformation")  == sName ) m_oRemovePersonalInformation  = oReader;
							else if ( _T("w:revisionView")               == sName ) m_oRevisionView               = oReader;
							else if ( _T("w:rsids")                      == sName ) m_oRsids                      = oReader;
							break;
						case 's':
							if      ( _T("w:saveFormsData")              == sName ) m_oSaveFormsData              = oReader;
							else if ( _T("w:saveInvalidXml")             == sName ) m_oSaveInvalidXml             = oReader;
							else if ( _T("w:savePreviewPicture")         == sName ) m_oSavePreviewPicture         = oReader;
							else if ( _T("w:saveSubsetFonts")            == sName ) m_oSaveSubsetFonts            = oReader;
							else if ( _T("w:saveThroughXslt")            == sName ) m_oSaveThroughtXslt           = oReader;
							else if ( _T("w:saveXmlDataOnly")            == sName ) m_oSaveXmlDataOnly            = oReader;
							else if ( _T("w:shapeDefaults")              == sName ) m_oShapeDefaults              = oReader;
							else if ( _T("w:showEnvelope")               == sName ) m_oShowEnvelope               = oReader;
							else if ( _T("w:showXMLTags")                == sName ) m_oShowXMLTags                = oReader;
							else if ( _T("w:smartTagType")               == sName )
							{
								OOX::Settings::CSmartTagType oSTT = oReader;
								m_arrSmartTagType.Add( oSTT );
							}
							else if ( _T("w:strictFirstAndLastChars")    == sName ) m_oStrictFirstAndLastChars    = oReader;
							else if ( _T("w:styleLockQFSet")             == sName ) m_oStyleLockQFSet             = oReader;
							else if ( _T("w:styleLockTheme")             == sName ) m_oStyleLockTheme             = oReader;
							else if ( _T("w:stylePaneFormatFilter")      == sName ) m_oStylePaneFormatFilter      = oReader;
							else if ( _T("w:stylePaneSortMethod")        == sName ) m_oStylePaneSortMethod        = oReader;
							else if ( _T("w:summaryLength")              == sName ) m_oSummaryLength              = oReader;
							break;
						case 't':
							if      ( _T("w:themeFontLang")              == sName ) m_oThemeFontLang              = oReader;
							else if ( _T("w:trackRevisions")             == sName ) m_oTrackRevisions             = oReader;
							break;
						case 'u':
							if      ( _T("w:updateFields")               == sName ) m_oUpdateFields               = oReader;
							else if ( _T("w:useXSLTWhenSaving")          == sName ) m_oUseXSLTWhenSaving          = oReader;
							break;
						case 'v':
							if      ( _T("w:view")                       == sName ) m_oView                       = oReader;
							break;
						case 'w':
							if      ( _T("w:writeProtection")            == sName ) m_oWriteProtection            = oReader;
							break;
						case 'z':
							if      ( _T("w:zoom")                       == sName ) m_oZoom                       = oReader;
							break;
						}
					}
					else if ( 's' == wChar0 )
					{
						if ( _T("sl:schemaLibrary") == sName )
							m_oSchemaLibrary = oReader;
					}
					else if ( 'm' == wChar0 )
					{
						if ( _T("m:mathPr") == sName )
							m_oMathPr = oReader;
					}
				}
			}

#else
			XmlUtils::CXmlNode oWebSettings;
			oWebSettings.FromXmlFile( oFilePath.GetPath(), true );

			if ( _T("w:settings") == oWebSettings.GetName() )
			{
				XmlUtils::CXmlNode oNode;
			}
#endif
		}
		virtual void write(const CPath& oFilePath, const CPath& oDirectory, CContentTypes& oContent) const
		{
			CString sXml;
			sXml = _T("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><w:settings xmlns:mc=\"http://schemas.openxmlformats.org/markup-compatibility/2006\" xmlns:o=\"urn:schemas-microsoft-com:office:office\" xmlns:r=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships\" xmlns:m=\"http://schemas.openxmlformats.org/officeDocument/2006/math\" xmlns:v=\"urn:schemas-microsoft-com:vml\" xmlns:w10=\"urn:schemas-microsoft-com:office:word\" xmlns:w=\"http://schemas.openxmlformats.org/wordprocessingml/2006/main\" xmlns:w14=\"http://schemas.microsoft.com/office/word/2010/wordml\" xmlns:sl=\"http://schemas.openxmlformats.org/schemaLibrary/2006/main\" mc:Ignorable=\"w14\">");

			
			if ( m_oWriteProtection.IsInit() )
				sXml += m_oWriteProtection->toXML();

			
			if ( m_oView.IsInit() )
				sXml += m_oView->toXML();

			
			if ( m_oZoom.IsInit() )
				sXml += m_oZoom->toXML();

			
			if ( m_oRemovePersonalInformation.IsInit() )
				sXml += _T("<w:removePersonalInformation ") + m_oRemovePersonalInformation->ToString() + _T("/>");

			
			if ( m_oRemoveDateAndTime.IsInit() )
				sXml += _T("<w:removeDateAndTime ") + m_oRemoveDateAndTime->ToString() + _T("/>");

			
			if ( m_oDoNotDisplayPageBoundaries.IsInit() )
				sXml += _T("<w:doNotDisplayPageBoundaries ") + m_oDoNotDisplayPageBoundaries->ToString() + _T("/>");

			
			if ( m_oDisplayBackgroundShape.IsInit() )
				sXml += _T("<w:displayBackgroundShape ") + m_oDisplayBackgroundShape->ToString() + _T("/>");

			
			if ( m_oPrintPostScriptOverText.IsInit() )
				sXml += _T("<w:printPostScriptOverText ") + m_oPrintPostScriptOverText->ToString() + _T("/>");

			
			if ( m_oPrintFractionalCharacterWidth.IsInit() )
				sXml += _T("<w:printFractionalCharacterWidth ") + m_oPrintFractionalCharacterWidth->ToString() + _T("/>");

			
			if ( m_oPrintFormsData.IsInit() )
				sXml += _T("<w:printFormsData ") + m_oPrintFormsData->ToString() + _T("/>");

			
			if ( m_oEmbedTrueTypeFonts.IsInit() )
				sXml += _T("<w:embedTrueTypeFonts ") + m_oEmbedTrueTypeFonts->ToString() + _T("/>");

			
			if ( m_oEmbedSystemFonts.IsInit() )
				sXml += _T("<w:embedSystemFonts ") + m_oEmbedSystemFonts->ToString() + _T("/>");

			
			if ( m_oSaveSubsetFonts.IsInit() )
				sXml += _T("<w:saveSubsetFonts ") + m_oSaveSubsetFonts->ToString() + _T("/>");

			
			if ( m_oSaveFormsData.IsInit() )
				sXml += _T("<w:saveFormsData ") + m_oSaveFormsData->ToString() + _T("/>");

			
			if ( m_oMirrorMargins.IsInit() )
				sXml += _T("<w:mirrorMargins ") + m_oMirrorMargins->ToString() + _T("/>");

			
			if ( m_oAlignBordersAndEdges.IsInit() )
				sXml += _T("<w:alignBordersAndEdges ") + m_oAlignBordersAndEdges->ToString() + _T("/>");

			
			if ( m_oBordersDoNotSurroundHeader.IsInit() )
				sXml += _T("<w:bordersDoNotSurroundHeader ") + m_oBordersDoNotSurroundHeader->ToString() + _T("/>");

			
			if ( m_oBordersDoNotSurroundFooter.IsInit() )
				sXml += _T("<w:bordersDoNotSurroundFooter ") + m_oBordersDoNotSurroundFooter->ToString() + _T("/>");

			
			if ( m_oGutterAtTop.IsInit() )
				sXml += _T("<w:gutterAtTop ") + m_oGutterAtTop->ToString() + _T("/>");

			
			if ( m_oHideSpellingErrors.IsInit() )
				sXml += _T("<w:hideSpellingErrors ") + m_oHideSpellingErrors->ToString() + _T("/>");

			
			if ( m_oHideGrammaticalErrors.IsInit() )
				sXml += _T("<w:hideGrammaticalErrors ") + m_oHideGrammaticalErrors->ToString() + _T("/>");

			
			if ( m_oActiveWritingStyle.IsInit() )
				sXml += m_oActiveWritingStyle->toXML();

			
			if ( m_oProofState.IsInit() )
				sXml += m_oProofState->toXML();

			
			if ( m_oFormsDesign.IsInit() )
				sXml += _T("<w:formsDesign ") + m_oFormsDesign->ToString() + _T("/>");

			
			if ( m_oAttachedTemplate.IsInit() )
				sXml += _T("<w:attachedTemplate ") + m_oAttachedTemplate->ToString() + _T("/>");

			
			if ( m_oLinkStyles.IsInit() )
				sXml += _T("<w:linkStyles ") + m_oLinkStyles->ToString() + _T("/>");

			
			if ( m_oStylePaneFormatFilter.IsInit() )
				sXml += m_oStylePaneFormatFilter->toXML();

			
			if ( m_oStylePaneSortMethod.IsInit() )
				sXml += m_oStylePaneSortMethod->toXML();

			
			if ( m_oDocumentType.IsInit() )
				sXml += m_oDocumentType->toXML();

			

			
			if ( m_oRevisionView.IsInit() )
				sXml += m_oRevisionView->toXML();

			
			if ( m_oTrackRevisions.IsInit() )
				sXml += _T("<w:trackRevisions ") + m_oTrackRevisions->ToString() + _T("/>");

			
			if ( m_oDoNotTrackMoves.IsInit() )
				sXml += _T("<w:doNotTrackMoves ") + m_oDoNotTrackMoves->ToString() + _T("/>");

			
			if ( m_oDoNotTrackFormatting.IsInit() )
				sXml += _T("<w:doNotTrackFormatting ") + m_oDoNotTrackFormatting->ToString() + _T("/>");

			
			if ( m_oDocumentProtection.IsInit() )
				sXml += m_oDocumentProtection->toXML();

			
			if ( m_oAutoFormatOverride.IsInit() )
				sXml += _T("<w:autoFormatOverride ") + m_oAutoFormatOverride->ToString() + _T("/>");

			
			if ( m_oStyleLockTheme.IsInit() )
				sXml += _T("<w:styleLockTheme ") + m_oStyleLockTheme->ToString() + _T("/>");

			
			if ( m_oStyleLockQFSet.IsInit() )
				sXml += _T("<w:styleLockQFSet ") + m_oStyleLockQFSet->ToString() + _T("/>");

			
			if ( m_oDefaultTabStop.IsInit() )
				sXml += _T("<w:defaultTabStop ") + m_oDefaultTabStop->ToString() + _T("/>");

			
			if ( m_oAutoHyphenation.IsInit() )
				sXml += _T("<w:autoHyphenation ") + m_oAutoHyphenation->ToString() + _T("/>");

			
			if ( m_oConsecutiveHyphenLimit.IsInit() )
				sXml += _T("<w:consecutiveHyphenLimit ") + m_oConsecutiveHyphenLimit->ToString() + _T("/>");

			
			if ( m_oHyphenationZone.IsInit() )
				sXml += _T("<w:hyphenationZone ") + m_oHyphenationZone->ToString() + _T("/>");

			
			if ( m_oDoNotHyphenateCaps.IsInit() )
				sXml += _T("<w:doNotHyphenateCaps ") + m_oDoNotHyphenateCaps->ToString() + _T("/>");

			
			if ( m_oShowEnvelope.IsInit() )
				sXml += _T("<w:showEnvelope ") + m_oShowEnvelope->ToString() + _T("/>");

			
			if ( m_oSummaryLength.IsInit() )
				sXml += _T("<w:summaryLength ") + m_oSummaryLength->ToString() + _T("/>");

			
			if ( m_oClickAndTypeStyle.IsInit() )
				sXml += _T("<w:clickAndTypeStyle ") + m_oClickAndTypeStyle->ToString() + _T("/>");

			
			if ( m_oDefaultTableStyle.IsInit() )
				sXml += _T("<w:defaultTableStyle ") + m_oDefaultTableStyle->ToString() + _T("/>");

			
			if ( m_oEvenAndOddHeaders.IsInit() )
				sXml += _T("<w:evenAndOddHeaders ") + m_oEvenAndOddHeaders->ToString() + _T("/>");

			
			if ( m_oBookFoldRevPrinting.IsInit() )
				sXml += _T("<w:bookFoldRevPrinting ") + m_oBookFoldRevPrinting->ToString() + _T("/>");

			
			if ( m_oBookFoldPrinting.IsInit() )
				sXml += _T("<w:bookFoldPrinting ") + m_oBookFoldPrinting->ToString() + _T("/>");

			
			if ( m_oBookFoldPrintingSheets.IsInit() )
				sXml += _T("<w:bookFoldPrintingSheets ") + m_oBookFoldPrintingSheets->ToString() + _T("/>");

			
			if ( m_oDrawingGridHorizontalSpacing.IsInit() )
				sXml += _T("<w:drawingGridHorizontalSpacing ") + m_oDrawingGridHorizontalSpacing->ToString() + _T("/>");

			
			if ( m_oDrawingGridVerticalSpacing.IsInit() )
				sXml += _T("<w:drawingGridVerticalSpacing ") + m_oDrawingGridVerticalSpacing->ToString() + _T("/>");

			
			if ( m_oDisplayHorizontalDrawingGridEvery.IsInit() )
				sXml += _T("<w:displayHorizontalDrawingGridEvery ") + m_oDisplayHorizontalDrawingGridEvery->ToString() + _T("/>");

			
			if ( m_oDisplayVerticalDrawingGridEvery.IsInit() )
				sXml += _T("<w:displayVerticalDrawingGridEvery ") + m_oDisplayVerticalDrawingGridEvery->ToString() + _T("/>");

			
			if ( m_oDoNotUseMarginsForDrawingGridOrigin.IsInit() )
				sXml += _T("<w:doNotUseMarginsForDrawingGridOrigin ") + m_oDoNotUseMarginsForDrawingGridOrigin->ToString() + _T("/>");

			
			if ( m_oDrawingGridHorizontalOrigin.IsInit() )
				sXml += _T("<w:drawingGridHorizontalOrigin ") + m_oDrawingGridHorizontalOrigin->ToString() + _T("/>");

			
			if ( m_oDrawingGridVerticalOrigin.IsInit() )
				sXml += _T("<w:drawingGridVerticalOrigin ") + m_oDrawingGridVerticalOrigin->ToString() + _T("/>");

			
			if ( m_oDoNotShadeFormData.IsInit() )
				sXml += _T("<w:doNotShadeFormData ") + m_oDoNotShadeFormData->ToString() + _T("/>");

			
			if ( m_oNoPunctuationKerning.IsInit() )
				sXml += _T("<w:noPunctuationKerning ") + m_oNoPunctuationKerning->ToString() + _T("/>");

			
			if ( m_oCharacterSpacingControl.IsInit() )
				sXml += m_oCharacterSpacingControl->toXML();

			
			if ( m_oPrintTwoOnOne.IsInit() )
				sXml += _T("<w:printTwoOnOne ") + m_oPrintTwoOnOne->ToString() + _T("/>");

			
			if ( m_oStrictFirstAndLastChars.IsInit() )
				sXml += _T("<w:strictFirstAndLastChars ") + m_oStrictFirstAndLastChars->ToString() + _T("/>");

			
			if ( m_oNoLineBreaksAfter.IsInit() )
				sXml += m_oNoLineBreaksAfter->toXML();

			
			if ( m_oNoLineBreaksBefore.IsInit() )
				sXml += m_oNoLineBreaksBefore->toXML();

			
			if ( m_oSavePreviewPicture.IsInit() )
				sXml += _T("<w:savePreviewPicture ") + m_oSavePreviewPicture->ToString() + _T("/>");

			
			if ( m_oDoNotValidateAgainstSchema.IsInit() )
				sXml += _T("<w:doNotValidateAgainstSchema ") + m_oDoNotValidateAgainstSchema->ToString() + _T("/>");

			
			if ( m_oSaveInvalidXml.IsInit() )
				sXml += _T("<w:saveInvalidXml ") + m_oSaveInvalidXml->ToString() + _T("/>");

			
			if ( m_oIgnoreMixedContent.IsInit() )
				sXml += _T("<w:ignoreMixedContent ") + m_oIgnoreMixedContent->ToString() + _T("/>");

			
			if ( m_oAlwaysShowPlaceholderText.IsInit() )
				sXml += _T("<w:alwaysShowPlaceholderText ") + m_oAlwaysShowPlaceholderText->ToString() + _T("/>");

			
			if ( m_oDoNotDemarcateInvalidXml.IsInit() )
				sXml += _T("<w:doNotDemarcateInvalidXml ") + m_oDoNotDemarcateInvalidXml->ToString() + _T("/>");

			
			if ( m_oSaveXmlDataOnly.IsInit() )
				sXml += _T("<w:saveXmlDataOnly ") + m_oSaveXmlDataOnly->ToString() + _T("/>");

			
			if ( m_oUseXSLTWhenSaving.IsInit() )
				sXml += _T("<w:useXSLTWhenSaving ") + m_oUseXSLTWhenSaving->ToString() + _T("/>");

			
			if ( m_oSaveThroughtXslt.IsInit() )
				sXml += m_oSaveThroughtXslt->toXML();

			
			if ( m_oShowXMLTags.IsInit() )
				sXml += _T("<w:showXMLTags ") + m_oShowXMLTags->ToString() + _T("/>");

			
			if ( m_oAlwaysMergeEmptyNamespace.IsInit() )
				sXml += _T("<w:alwaysMergeEmptyNamespace ") + m_oAlwaysMergeEmptyNamespace->ToString() + _T("/>");

			
			if ( m_oUpdateFields.IsInit() )
				sXml += _T("<w:updateFields ") + m_oUpdateFields->ToString() + _T("/>");

			
			if ( m_oHdrShapeDefaults.IsInit() )
				sXml += m_oHdrShapeDefaults->toXML();

			
			if ( m_oFootnotePr.IsInit() )
				sXml += m_oFootnotePr->toXML();

			
			if ( m_oEndnotePr.IsInit() )
				sXml += m_oEndnotePr->toXML();

			
			if ( m_oCompat.IsInit() )
				sXml += m_oCompat->toXML();

			
			if ( m_oDocVars.IsInit() )
				sXml += m_oDocVars->toXML();

			
			if ( m_oRsids.IsInit() )
				sXml += m_oRsids->toXML();

			
			if ( m_oMathPr.IsInit() )
				sXml += m_oMathPr->toXML();

			
			if ( m_oAttachedSchema.IsInit() )
				sXml += _T("<w:attachedSchema ") + m_oAttachedSchema->ToString() + _T("/>");

			
			if ( m_oThemeFontLang.IsInit() )
				sXml += _T("<w:themeFontLang ") + m_oThemeFontLang->ToString() + _T("/>");

			
			if ( m_oClrSchemeMapping.IsInit() )
				sXml += m_oClrSchemeMapping->toXML();

			
			if ( m_oDoNotIncludeSubdocsInStats.IsInit() )
				sXml += _T("<w:doNotIncludeSubdocsInStats ") + m_oDoNotIncludeSubdocsInStats->ToString() + _T("/>");

			
			if ( m_oDoNotAutoCompressPictures.IsInit() )
				sXml += _T("<w:doNotAutoCompressPictures ") + m_oDoNotAutoCompressPictures->ToString() + _T("/>");

			
			if ( m_oForceUpgrade.IsInit() )
				sXml += _T("<<w:forceUpgrade/>");

			
			if ( m_oCaptions.IsInit() )
				sXml += m_oCaptions->toXML();

			
			if ( m_oReadModeInkLockDown.IsInit() )
				sXml += m_oReadModeInkLockDown->toXML();

			
			for ( int nIndex = 0; nIndex < m_arrSmartTagType.GetSize(); nIndex++ )
				sXml += m_arrSmartTagType[nIndex].toXML();

			
			if ( m_oSchemaLibrary.IsInit() )
				sXml += m_oSchemaLibrary->toXML();

			
			if ( m_oShapeDefaults.IsInit() )
				sXml += m_oShapeDefaults->toXML();

			
			if ( m_oDoNotEmbedSmartTags.IsInit() )
				sXml += _T("<w:doNotEmbedSmartTags ") + m_oDoNotEmbedSmartTags->ToString() + _T("/>");

			
			if ( m_oDecimalSymbol.IsInit() )
				sXml += _T("<w:decimalSymbol ") + m_oDecimalSymbol->ToString() + _T("/>");

			
			if ( m_oListSeparator.IsInit() )
				sXml += _T("<w:listSeparator ") + m_oListSeparator->ToString() + _T("/>");

			sXml += _T("</w:settings>");
			CDirectory::SaveToFile( oFilePath.GetPath(), sXml );

			oContent.Registration( type().OverrideType(), oDirectory, oFilePath );
		}

	public:
		virtual const OOX::FileType type() const
		{
			return FileTypes::Setting;
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

		
		nullable<OOX::Settings::CWritingStyle>                        m_oActiveWritingStyle;
		nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue>> m_oAlignBordersAndEdges;
		nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue>> m_oAlwaysMergeEmptyNamespace;
		nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue>> m_oAlwaysShowPlaceholderText;
		nullable<ComplexTypes::Word::CString_>                        m_oAttachedSchema;
		nullable<ComplexTypes::Word::CRel>                            m_oAttachedTemplate;
		nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue>> m_oAutoFormatOverride;
		nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue>> m_oAutoHyphenation;
		nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue>> m_oBookFoldPrinting;
		nullable<ComplexTypes::Word::CDecimalNumber>                  m_oBookFoldPrintingSheets;
		nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue>> m_oBookFoldRevPrinting;
		nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue>> m_oBordersDoNotSurroundFooter;
		nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue>> m_oBordersDoNotSurroundHeader;
		nullable<OOX::Settings::CCaptions>                            m_oCaptions;
		nullable<OOX::Settings::CCharacterSpacing>                    m_oCharacterSpacingControl;
		nullable<ComplexTypes::Word::CString_>                        m_oClickAndTypeStyle;
		nullable<OOX::Settings::CColorSchemeMapping>                  m_oClrSchemeMapping;
		nullable<OOX::Settings::CCompat>                              m_oCompat;
		nullable<ComplexTypes::Word::CDecimalNumber>                  m_oConsecutiveHyphenLimit;
		nullable<ComplexTypes::Word::CString_>                        m_oDecimalSymbol;
		nullable<ComplexTypes::Word::CString_>                        m_oDefaultTableStyle;
		nullable<ComplexTypes::Word::CTwipsMeasure>                   m_oDefaultTabStop;
		nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue>> m_oDisplayBackgroundShape;
		nullable<ComplexTypes::Word::CDecimalNumber>                  m_oDisplayHorizontalDrawingGridEvery;
		nullable<ComplexTypes::Word::CDecimalNumber>                  m_oDisplayVerticalDrawingGridEvery;
		nullable<OOX::Settings::CDocProtect>                          m_oDocumentProtection;
		nullable<OOX::Settings::CDocType>                             m_oDocumentType;
		nullable<OOX::Settings::CDocVars>                             m_oDocVars;
		nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue>> m_oDoNotAutoCompressPictures;
		nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue>> m_oDoNotDemarcateInvalidXml;
		nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue>> m_oDoNotDisplayPageBoundaries;
		nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue>> m_oDoNotEmbedSmartTags;
		nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue>> m_oDoNotHyphenateCaps;
		nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue>> m_oDoNotIncludeSubdocsInStats;
		nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue>> m_oDoNotShadeFormData;
		nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue>> m_oDoNotTrackFormatting;
		nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue>> m_oDoNotTrackMoves;
		nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue>> m_oDoNotUseMarginsForDrawingGridOrigin;
		nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue>> m_oDoNotValidateAgainstSchema;
		nullable<ComplexTypes::Word::CTwipsMeasure>                   m_oDrawingGridHorizontalOrigin;
		nullable<ComplexTypes::Word::CTwipsMeasure>                   m_oDrawingGridHorizontalSpacing;
		nullable<ComplexTypes::Word::CTwipsMeasure>                   m_oDrawingGridVerticalOrigin;
		nullable<ComplexTypes::Word::CTwipsMeasure>                   m_oDrawingGridVerticalSpacing;
		nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue>> m_oEmbedSystemFonts;
		nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue>> m_oEmbedTrueTypeFonts;
		nullable<OOX::Settings::CEdnDocProps>                         m_oEndnotePr;
		nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue>> m_oEvenAndOddHeaders;
		nullable<OOX::Settings::CFtnDocProps>                         m_oFootnotePr;
		nullable<ComplexTypes::Word::CEmpty>                          m_oForceUpgrade;
		nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue>> m_oFormsDesign;
		nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue>> m_oGutterAtTop;
		nullable<OOX::Settings::CShapeDefaults>                       m_oHdrShapeDefaults;
		nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue>> m_oHideGrammaticalErrors;
		nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue>> m_oHideSpellingErrors;
		nullable<ComplexTypes::Word::CTwipsMeasure>                   m_oHyphenationZone;
		nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue>> m_oIgnoreMixedContent;
		nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue>> m_oLinkStyles;
		nullable<ComplexTypes::Word::CString_>                        m_oListSeparator;
		
		nullable<OOX::Logic::CMathPr>								  m_oMathPr;
		nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue>> m_oMirrorMargins;
		nullable<OOX::Settings::CKinsoku>                             m_oNoLineBreaksAfter;
		nullable<OOX::Settings::CKinsoku>                             m_oNoLineBreaksBefore;
		nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue>> m_oNoPunctuationKerning;
		nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue>> m_oPrintFormsData;
		nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue>> m_oPrintFractionalCharacterWidth;
		nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue>> m_oPrintPostScriptOverText;
		nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue>> m_oPrintTwoOnOne;
		nullable<OOX::Settings::CProof>                               m_oProofState;
		nullable<OOX::Settings::CReadingModeInkLockDown>              m_oReadModeInkLockDown;
		nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue>> m_oRemoveDateAndTime;
		nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue>> m_oRemovePersonalInformation;
		nullable<OOX::Settings::CTrackChangesView>                    m_oRevisionView;
		nullable<OOX::Settings::CDocRsids>                            m_oRsids;
		nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue>> m_oSaveFormsData;
		nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue>> m_oSaveInvalidXml;
		nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue>> m_oSavePreviewPicture;
		nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue>> m_oSaveSubsetFonts;
		nullable<OOX::Settings::CSaveThroughXslt>                     m_oSaveThroughtXslt;
		nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue>> m_oSaveXmlDataOnly;
		nullable<OOX::Settings::CSchemaLibrary>                       m_oSchemaLibrary;
		nullable<OOX::Settings::CShapeDefaults>                       m_oShapeDefaults;
		nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue>> m_oShowEnvelope;
		nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue>> m_oShowXMLTags;
		CSimpleArray<OOX::Settings::CSmartTagType>                    m_arrSmartTagType;
		nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue>> m_oStrictFirstAndLastChars;
		nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue>> m_oStyleLockQFSet;
		nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue>> m_oStyleLockTheme;
		nullable<OOX::Settings::CStylePaneFilter>                     m_oStylePaneFormatFilter;
		nullable<OOX::Settings::CStyleSort>                           m_oStylePaneSortMethod;
		nullable<ComplexTypes::Word::CDecimalNumberOrPrecent>         m_oSummaryLength;
		nullable<ComplexTypes::Word::CLanguage>                       m_oThemeFontLang;
		nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue>> m_oTrackRevisions;
		nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue>> m_oUpdateFields;
		nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue>> m_oUseXSLTWhenSaving;
		nullable<OOX::Settings::CView>                                m_oView;
		nullable<OOX::Settings::CWriteProtection>                     m_oWriteProtection;
		nullable<OOX::Settings::CZoom>                                m_oZoom;
	};
} 

#endif 