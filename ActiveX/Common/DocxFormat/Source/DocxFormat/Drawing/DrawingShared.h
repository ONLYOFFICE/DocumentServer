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
#ifndef OOX_LOGIC_DRAWING_SHARED_INCLUDE_H_
#define OOX_LOGIC_DRAWING_SHARED_INCLUDE_H_

#include "../../Base/Nullable.h"
#include "../../Common/SimpleTypes_Drawing.h"
#include "../../Common/SimpleTypes_Shared.h"

#include "../WritingElement.h"

#include "DrawingExt.h"

namespace OOX
{
	namespace Drawing
	{
		
		
		
		class CColorMapping : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CColorMapping)
			CColorMapping()
			{
				m_eType = et_Unknown;
			}
			virtual ~CColorMapping()
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
				if ( _T("a:clrMap") == sName )
					m_eType = et_a_clrMap;
				else if ( _T("a:overrideClrMapping") == sName )
					m_eType = et_a_overrideClrMapping;
				else
					return;

				ReadAttributes( oReader );

				if ( oReader.IsEmptyNode() )
					return;

				int nCurDepth = oReader.GetDepth();
				while ( oReader.ReadNextSiblingNode( nCurDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();
					if ( _T("a:extLst") == sName )
						m_oExtLst = oReader;
				}
			}
			virtual CString      toXML() const
			{
				if ( et_a_clrMap == m_eType )
				{
					CString sResult = _T("<a:clrMap bg1=\"")     + m_oBg1.ToString()     +
						_T("\" tx1=\"")     + m_oTx1.ToString()     + 
						_T("\" bg2=\"")     + m_oBg2.ToString()     +
						_T("\" tx2=\"")     + m_oTx2.ToString()     +
						_T("\" accent1=\"") + m_oAccent1.ToString() + 
						_T("\" accent2=\"") + m_oAccent2.ToString() + 
						_T("\" accent3=\"") + m_oAccent3.ToString() + 
						_T("\" accent4=\"") + m_oAccent4.ToString() + 
						_T("\" accent5=\"") + m_oAccent5.ToString() + 
						_T("\" accent6=\"") + m_oAccent6.ToString() + _T("\"");

					if ( m_oExtLst.IsInit() )
					{
						sResult += _T(">");
						sResult += m_oExtLst->toXML();
						sResult += _T("</a:clrMap>");
					}
					else
						sResult += _T("/>");

					return sResult;
				}
				else if ( et_a_overrideClrMapping == m_eType )
				{
					CString sResult = _T("<a:overrideClrMapping bg1=\"")     + m_oBg1.ToString()     +
						_T("\" tx1=\"")     + m_oTx1.ToString()     + 
						_T("\" bg2=\"")     + m_oBg2.ToString()     +
						_T("\" tx2=\"")     + m_oTx2.ToString()     +
						_T("\" accent1=\"") + m_oAccent1.ToString() + 
						_T("\" accent2=\"") + m_oAccent2.ToString() + 
						_T("\" accent3=\"") + m_oAccent3.ToString() + 
						_T("\" accent4=\"") + m_oAccent4.ToString() + 
						_T("\" accent5=\"") + m_oAccent5.ToString() + 
						_T("\" accent6=\"") + m_oAccent6.ToString() + _T("\"");

					if ( m_oExtLst.IsInit() )
					{
						sResult += _T(">");
						sResult += m_oExtLst->toXML();
						sResult += _T("</a:overrideClrMapping>");
					}
					else
						sResult += _T("/>");

					return sResult;
				}

				return _T("");
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

					switch ( wsChar0 )
					{
					case 'a':
						if      ( _T("accent1") == wsName ) m_oAccent1 = oReader.GetText();
						else if ( _T("accent2") == wsName ) m_oAccent2 = oReader.GetText();
						else if ( _T("accent3") == wsName ) m_oAccent3 = oReader.GetText();
						else if ( _T("accent4") == wsName ) m_oAccent4 = oReader.GetText();
						else if ( _T("accent5") == wsName ) m_oAccent5 = oReader.GetText();
						else if ( _T("accent6") == wsName ) m_oAccent6 = oReader.GetText();
						break;

					case 'b':
						if      ( _T("bg1") == wsName ) m_oBg1 = oReader.GetText();
						else if ( _T("bg2") == wsName ) m_oBg2 = oReader.GetText();
						break;

					case 'f':
						if      ( _T("folHlink") == wsName ) m_oFloHlink = oReader.GetText();
						break;

					case 'h':
						if      ( _T("hlink") == wsName ) m_oHlink = oReader.GetText();
						break;

					case 't':
						if      ( _T("tx1") == wsName ) m_oTx1 = oReader.GetText();
						else if ( _T("tx2") == wsName ) m_oTx2 = oReader.GetText();
						break;
					}

					if ( !oReader.MoveToNextAttribute() )
						break;

					wsName = oReader.GetName();
				}
				oReader.MoveToElement();
			}

		public:

			EElementType m_eType;

			
			SimpleTypes::CColorSchemeIndex<> m_oAccent1;
			SimpleTypes::CColorSchemeIndex<> m_oAccent2;
			SimpleTypes::CColorSchemeIndex<> m_oAccent3;
			SimpleTypes::CColorSchemeIndex<> m_oAccent4;
			SimpleTypes::CColorSchemeIndex<> m_oAccent5;
			SimpleTypes::CColorSchemeIndex<> m_oAccent6;
			SimpleTypes::CColorSchemeIndex<> m_oBg1;
			SimpleTypes::CColorSchemeIndex<> m_oBg2;
			SimpleTypes::CColorSchemeIndex<> m_oFloHlink;
			SimpleTypes::CColorSchemeIndex<> m_oHlink;
			SimpleTypes::CColorSchemeIndex<> m_oTx1;
			SimpleTypes::CColorSchemeIndex<> m_oTx2;

			
			nullable<OOX::Drawing::COfficeArtExtensionList> m_oExtLst;

		};

		
		
		
		class CColorScheme : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CColorScheme)
			CColorScheme()
			{
			}
			virtual ~CColorScheme()
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
					if ( _T("a:accent1") == sName )
						m_oAccent1 = oReader;
					else if ( _T("a:accent2") == sName )
						m_oAccent2 = oReader;
					else if ( _T("a:accent3") == sName )
						m_oAccent3 = oReader;
					else if ( _T("a:accent4") == sName )
						m_oAccent4 = oReader;
					else if ( _T("a:accent5") == sName )
						m_oAccent5 = oReader;
					else if ( _T("a:accent6") == sName )
						m_oAccent6 = oReader;
					else if ( _T("a:dk1") == sName )
						m_oDk1 = oReader;
					else if ( _T("a:dk2") == sName )
						m_oDk2 = oReader;
					else if ( _T("a:extLst") == sName )
						m_oExtLst = oReader;
					else if ( _T("a:folHlink") == sName )
						m_oFolHlink = oReader;
					else if ( _T("a:hlink") == sName )
						m_oHlink = oReader;
					else if ( _T("a:lt1") == sName )
						m_oLt1 = oReader;
					else if ( _T("a:lt2") == sName )
						m_oLt2 = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<a:clrScheme name=\"") + m_sName + _T("\">");

				sResult += m_oDk1.toXML();
				sResult += m_oLt1.toXML();
				sResult += m_oDk2.toXML();
				sResult += m_oLt2.toXML();
				sResult += m_oAccent1.toXML();
				sResult += m_oAccent2.toXML();
				sResult += m_oAccent3.toXML();
				sResult += m_oAccent4.toXML();
				sResult += m_oAccent5.toXML();
				sResult += m_oAccent6.toXML();
				sResult += m_oHlink.toXML();
				sResult += m_oFolHlink.toXML();

				if ( m_oExtLst.IsInit() )
					sResult += m_oExtLst->toXML();

				sResult += _T("</a:clrScheme>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_clrScheme;
			}
		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_ReadSingle( oReader, _T("name"), m_sName )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			
			CString                                         m_sName;

			
			OOX::Drawing::CStyleColor                       m_oAccent1;
			OOX::Drawing::CStyleColor                       m_oAccent2;
			OOX::Drawing::CStyleColor                       m_oAccent3;
			OOX::Drawing::CStyleColor                       m_oAccent4;
			OOX::Drawing::CStyleColor                       m_oAccent5;
			OOX::Drawing::CStyleColor                       m_oAccent6;
			OOX::Drawing::CStyleColor                       m_oDk1;
			OOX::Drawing::CStyleColor                       m_oDk2;
			OOX::Drawing::CStyleColor                       m_oFolHlink;
			OOX::Drawing::CStyleColor                       m_oHlink;
			OOX::Drawing::CStyleColor                       m_oLt1;
			OOX::Drawing::CStyleColor                       m_oLt2;
			nullable<OOX::Drawing::COfficeArtExtensionList> m_oExtLst;
		};

		
		
		
		class CCustomColorList : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CCustomColorList)
			CCustomColorList()
			{
			}
			virtual ~CCustomColorList()
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
					if ( _T("a:custClr") == sName )
					{
						OOX::Drawing::CCustomColor oCustClr = oReader;
						m_arrCustClr.Add( oCustClr );
					}
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<a:custClrLst>");

				for ( int nIndex = 0; nIndex < m_arrCustClr.GetSize(); nIndex++ )
					sResult += m_arrCustClr[nIndex].toXML();

				sResult += _T("</a:custClrLst>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_custClrLst;
			}

		public:

			
			CSimpleArray<OOX::Drawing::CCustomColor> m_arrCustClr;
		};

		
		
		
		class CColorSchemeAndMapping : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CColorSchemeAndMapping)
			CColorSchemeAndMapping()
			{
			}
			virtual ~CColorSchemeAndMapping()
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
					if ( _T("a:clrScheme") == sName )
						m_oClrScheme = oReader;
					else if ( _T("a:clrMap") == sName )
						m_oClrMap = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<a:extraClrScheme>");

				sResult += m_oClrScheme.toXML();

				if ( m_oClrMap.IsInit() )
					sResult += m_oClrMap->toXML();

				sResult += _T("</a:extraClrScheme>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_extraClrScheme;
			}

		public:

			
			OOX::Drawing::CColorScheme            m_oClrScheme;
			nullable<OOX::Drawing::CColorMapping> m_oClrMap;
		};

		
		
		
		class CColorSchemeList : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CColorSchemeList)
			CColorSchemeList()
			{
			}
			virtual ~CColorSchemeList()
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
					if ( _T("a:extraClrScheme") == sName )
					{
						OOX::Drawing::CColorSchemeAndMapping oExtra = oReader;
						m_arrExtraClrScheme.Add( oExtra );
					}
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<a:extraClrSchemeLst>");

				for ( int nIndex = 0; nIndex < m_arrExtraClrScheme.GetSize(); nIndex++ )
					sResult += m_arrExtraClrScheme[nIndex].toXML();

				sResult += _T("</a:extraClrSchemeLst>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_extraClrSchemeLst;
			}

		public:

			
			CSimpleArray<OOX::Drawing::CColorSchemeAndMapping> m_arrExtraClrScheme;
		};

		
		
		
		class CMasterColorMapping : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CMasterColorMapping)
			CMasterColorMapping()
			{
			}
			virtual ~CMasterColorMapping()
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
				return _T("<a:masterClrMapping/>");
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_masterClrMapping;
			}
		};

		
		
		
		class CObjectStyleDefaults : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CObjectStyleDefaults)
			CObjectStyleDefaults()
			{
			}
			virtual ~CObjectStyleDefaults()
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
					if ( _T("a:extLst") == sName )
						m_oExtLst = oReader;
					else if ( _T("a:lnDef") == sName )
						m_oLnDef = oReader;
					else if ( _T("a:spDef") == sName )
						m_oSpDef = oReader;
					else if ( _T("a:txDef") == sName )
						m_oTxDef = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<a:objectDefaults>");

				if ( m_oSpDef.IsInit() )
					sResult += m_oSpDef->toXML();

				if ( m_oLnDef.IsInit() )
					sResult += m_oLnDef->toXML();

				if ( m_oTxDef.IsInit() )
					sResult += m_oTxDef->toXML();

				if ( m_oExtLst.IsInit() )
					sResult += m_oExtLst->toXML();

				sResult += _T("</a:objectDefaults>");
				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_objectDefaults;
			}

		public:

			
			nullable<OOX::Drawing::COfficeArtExtensionList> m_oExtLst;
			nullable<OOX::Drawing::CDefaultShapeDefinition> m_oLnDef;
			nullable<OOX::Drawing::CDefaultShapeDefinition> m_oSpDef;
			nullable<OOX::Drawing::CDefaultShapeDefinition> m_oTxDef;
		};
		
		
		
		class CBaseStyles : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CBaseStyles)
			CBaseStyles()
			{
			}
			virtual ~CBaseStyles()
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
					if ( _T("a:clrScheme") == sName )
						m_oClrScheme = oReader;
					else if ( _T("a:extLst") == sName )
						m_oExtLst = oReader;
					else if ( _T("a:fmtScheme") == sName )
						m_oFmtScheme = oReader;
					else if ( _T("a:fontScheme") == sName )
						m_oFontScheme = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<a:themeElements>");

				sResult += m_oClrScheme.toXML();
				sResult += m_oFontScheme.toXML();
				sResult += m_oFmtScheme.toXML();

				if ( m_oExtLst.IsInit() )
					sResult += m_oExtLst->toXML();

				sResult += _T("</a:themeElements>");
				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_themeElements;
			}

		public:

			
			OOX::Drawing::CColorScheme                      m_oClrScheme;
			OOX::Drawing::CStyleMatrix                      m_oFmtScheme;
			OOX::Drawing::CFontScheme                       m_oFontScheme;
			nullable<OOX::Drawing::COfficeArtExtensionList> m_oExtLst;
		};

	} 
} 

#endif // OOX_LOGIC_DRAWING_SHARED_INCLUDE_H_