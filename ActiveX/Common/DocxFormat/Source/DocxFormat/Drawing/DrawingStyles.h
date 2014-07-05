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
#ifndef OOX_LOGIC_DRAWING_STYLES_INCLUDE_H_
#define OOX_LOGIC_DRAWING_STYLES_INCLUDE_H_

#include "../../Base/Nullable.h"
#include "../../Common/SimpleTypes_Drawing.h"
#include "../../Common/SimpleTypes_Shared.h"

#include "../WritingElement.h"

#include "DrawingStyles2.h"
#include "DrawingExt.h"
#include "DrawingEffects.h"
#include "DrawingRun.h"
#include "DrawingBody.h"
#include "DrawingCoreInfo.h"

namespace OOX
{
	namespace Drawing
	{
		
        
		
		
        
		class CStyleColor : public OOX::Drawing::CColor
		{
		public:
			WritingElement_AdditionConstructors(CStyleColor)
			CStyleColor()
			{
				m_eType = et_Unknown;
			}
			virtual ~CStyleColor()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				m_eType = et_Unknown;
				CColor::fromXML( oNode );
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				m_eType = et_Unknown;
				CWCharWrapper sName = oReader.GetName();
				wchar_t wChar2 = sName[2];

				switch ( wChar2 )
				{
				case 'a':
					if ( _T("a:accent1") == sName )
						m_eType = et_a_accent1;
					else if ( _T("a:accent2") == sName )
						m_eType = et_a_accent2;
					else if ( _T("a:accent3") == sName )
						m_eType = et_a_accent3;
					else if ( _T("a:accent4") == sName )
						m_eType = et_a_accent4;
					else if ( _T("a:accent5") == sName )
						m_eType = et_a_accent5;
					else if ( _T("a:accent6") == sName )
						m_eType = et_a_accent6;
					break;

				case 'd':
					if ( _T("a:dk1") == sName )
						m_eType = et_a_dk1;
					else if ( _T("a:dk2") == sName )
						m_eType = et_a_dk2;
					break;

				case 'f':
					if ( _T("a:folHlink") == sName )
						m_eType = et_a_folHlink;
					break;

				case 'h':
					if ( _T("a:hlink") == sName )
						m_eType = et_a_hlink;
					break;

				case 'l':
					if ( _T("a:lt1") == sName )
						m_eType = et_a_lt1;
					else if ( _T("a:lt2") == sName )
						m_eType = et_a_lt2;
					break;

				default:
					return;
				}

				CColor::fromXML( oReader );
			}

			virtual CString      toXML() const
			{
				CString sResult;
				
				switch ( m_eType )
				{
				case et_a_accent1:  sResult = _T("<a:accent1>"); break;
				case et_a_accent2:  sResult = _T("<a:accent2>"); break;
				case et_a_accent3:  sResult = _T("<a:accent3>"); break;
				case et_a_accent4:  sResult = _T("<a:accent4>"); break;
				case et_a_accent5:  sResult = _T("<a:accent5>"); break;
				case et_a_accent6:  sResult = _T("<a:accent6>"); break;
				case et_a_dk1:      sResult = _T("<a:dk1>"); break;
				case et_a_dk2:      sResult = _T("<a:dk2>"); break;
				case et_a_folHlink: sResult = _T("<a:folHlink>"); break;
				case et_a_hlink:    sResult = _T("<a:hlink>"); break;
				case et_a_lt1:      sResult = _T("<a:lt1>"); break;
				case et_a_lt2:      sResult = _T("<a:lt2>"); break;
				default: return _T("");
				}

				sResult += CColor::toXML();

				switch ( m_eType )
				{
				case et_a_accent1:  sResult += _T("</a:accent1>"); break;
				case et_a_accent2:  sResult += _T("</a:accent2>"); break;
				case et_a_accent3:  sResult += _T("</a:accent3>"); break;
				case et_a_accent4:  sResult += _T("</a:accent4>"); break;
				case et_a_accent5:  sResult += _T("</a:accent5>"); break;
				case et_a_accent6:  sResult += _T("</a:accent6>"); break;
				case et_a_dk1:      sResult += _T("</a:dk1>"); break;
				case et_a_dk2:      sResult += _T("</a:dk2>"); break;
				case et_a_folHlink: sResult += _T("</a:folHlink>"); break;
				case et_a_hlink:    sResult += _T("</a:hlink>"); break;
				case et_a_lt1:      sResult += _T("</a:lt1>"); break;
				case et_a_lt2:      sResult += _T("</a:lt2>"); break;
				}

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_accent1;
			}

		public:

			EElementType m_eType;

		};


 		
		
		
		class CBackgroundFillStyleList : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CBackgroundFillStyleList)
			CBackgroundFillStyleList()
			{
			}
			CBackgroundFillStyleList(const CBackgroundFillStyleList& oOther)
			{
				for ( int nIndex = 0; nIndex < oOther.m_arrItems.GetSize(); nIndex++ )
				{
					OOX::EElementType eType = oOther.m_arrItems[nIndex]->getType();

					WritingElement *pItem = NULL;
					switch ( eType )
					{
					case et_a_blipFill: pItem = new CBlipFillProperties      ( (const CBlipFillProperties&) *oOther.m_arrItems[nIndex] ); break;
					case et_a_gradFill: pItem = new CGradientFillProperties  ( (const CGradientFillProperties&) *oOther.m_arrItems[nIndex] ); break;
					case et_a_grpFill:  pItem = new CGroupFillProperties     ( (const CGroupFillProperties&) *oOther.m_arrItems[nIndex] ); break;
					case et_a_noFill:   pItem = new CNoFillProperties        ( (const CNoFillProperties&) *oOther.m_arrItems[nIndex] ); break;
					case et_a_pattFill: pItem = new CPatternFillProperties   ( (const CPatternFillProperties&) *oOther.m_arrItems[nIndex] ); break;
					case et_a_solidFill:pItem = new CSolidColorFillProperties( (const CSolidColorFillProperties&) *oOther.m_arrItems[nIndex] ); break;
					}

					if ( NULL != pItem )
						m_arrItems.Add( pItem );
				}
			}
			virtual ~CBackgroundFillStyleList()
			{
				Clear();
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
					WritingElement *pItem = NULL;

					if ( _T("a:blipFill") == sName )
						pItem = new OOX::Drawing::CBlipFillProperties( oReader );
					else if ( _T("a:gradFill") == sName )
						pItem = new OOX::Drawing::CGradientFillProperties( oReader );
					else if ( _T("a:grpFill") == sName )
						pItem = new OOX::Drawing::CGroupFillProperties( oReader );
					else if ( _T("a:noFill") == sName )
						pItem = new OOX::Drawing::CNoFillProperties( oReader );
					else if ( _T("a:pattFill") == sName )
						pItem = new OOX::Drawing::CPatternFillProperties( oReader );
					else if ( _T("a:solidFill") == sName )
						pItem = new OOX::Drawing::CSolidColorFillProperties( oReader );

					if ( pItem )
						m_arrItems.Add( pItem );
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<a:bgFillStyleLst>"); 

				for ( int nIndex = 0; nIndex < m_arrItems.GetSize(); nIndex++ )
				{
					if ( m_arrItems[nIndex] )
					{
						sResult += m_arrItems[nIndex]->toXML();
					}
				}
				
				sResult += _T("</a:bgFillStyleLst>"); 

				return sResult;
			}
			virtual EElementType getType() const
			{
				return et_a_bgFillStyleLst;
			}


		public:

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

			
			CSimpleArray<WritingElement*> m_arrItems;
		};
		
        
        
		class CCustomColor : public OOX::Drawing::CColor
		{
		public:
			WritingElement_AdditionConstructors(CCustomColor)
			CCustomColor()
			{
			}
			virtual ~CCustomColor()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				CColor::fromXML( oNode );
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				CColor::fromXML( oReader );
			}

			virtual CString      toXML() const
			{
				CString sResult = _T("<a:custClr name=\"") + m_sName + _T("\">");

				sResult += CColor::toXML();

				sResult += _T("</a:custClr>");
				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_custClr;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_ReadSingle( oReader, _T("name"), m_sName )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			CString m_sName;

		};
		
		
		
		class CEffectStyleItem : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CEffectStyleItem)
			CEffectStyleItem()
			{
				m_eEffectType = effecttypeUnknown;
			}
			virtual ~CEffectStyleItem()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				m_eEffectType = effecttypeUnknown;
				
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				m_eEffectType = effecttypeUnknown;

				if ( oReader.IsEmptyNode() )
					return;

				int nCurDepth = oReader.GetDepth();
				while( oReader.ReadNextSiblingNode( nCurDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();
					if ( _T("a:effectDag") == sName )
					{
						m_oEffectDag  = oReader;
						m_eEffectType = effecttypeDag;
					}
					else if ( _T("a:effectLst") == sName )
					{
						m_oEffectList = oReader;
						m_eEffectType = effecttypeLst;
					}
					else if ( _T("a:scene3d") == sName )
						m_oScene3D = oReader;
					else if ( _T("a:sp3d") == sName )
						m_oSp3D = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<a:effectStyle>"); 

				switch ( m_eEffectType )
				{
				case effecttypeDag:

					if ( m_oEffectDag.IsInit() )
						sResult += m_oEffectDag->toXML();
					break;

				case effecttypeLst:

					if ( m_oEffectList.IsInit() )
						sResult += m_oEffectList->toXML();
					break;
				}

				if ( m_oScene3D.IsInit() )
					sResult += m_oScene3D->toXML();

				if ( m_oSp3D.IsInit() )
					sResult += m_oSp3D->toXML();

				sResult += _T("</a:effectStyle>"); 

				return sResult;
			}
			virtual EElementType getType() const
			{
				return et_a_effectStyle;
			}

		public:

			
			EEffectType                                       m_eEffectType; 
			nullable<OOX::Drawing::CEffectContainer>          m_oEffectDag;
			nullable<OOX::Drawing::CEffectList>               m_oEffectList;

			nullable<OOX::Drawing::CScene3D>                  m_oScene3D;
			nullable<OOX::Drawing::CShape3D>                  m_oSp3D;
		};

		
		
		
		class CEffectStyleList : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CEffectStyleList)
			CEffectStyleList()
			{
			}
			virtual ~CEffectStyleList()
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
				while( oReader.ReadNextSiblingNode( nCurDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();
					if ( _T("a:effectStyle") == sName )
					{
						OOX::Drawing::CEffectStyleItem oEffectStyle = oReader;
						m_arrEffectStyle.Add( oEffectStyle );
					}
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<a:effectStyleLst>"); 

				for ( int nIndex = 0; nIndex < m_arrEffectStyle.GetSize(); nIndex++ )
					sResult += m_arrEffectStyle[nIndex].toXML();

				sResult += _T("</a:effectStyleLst>"); 

				return sResult;
			}
			virtual EElementType getType() const
			{
				return et_a_effectStyleLst;
			}

		public:

			
			CSimpleArray<OOX::Drawing::CEffectStyleItem> m_arrEffectStyle;
		};

 		
		
		
		class CFillStyleList : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CFillStyleList)
			CFillStyleList()
			{
			}
			CFillStyleList(const CFillStyleList& oOther)
			{
				for ( int nIndex = 0; nIndex < oOther.m_arrItems.GetSize(); nIndex++ )
				{
					OOX::EElementType eType = oOther.m_arrItems[nIndex]->getType();

					WritingElement *pItem = NULL;
					switch ( eType )
					{
					case et_a_blipFill: pItem = new CBlipFillProperties      ( (const CBlipFillProperties&) *oOther.m_arrItems[nIndex] ); break;
					case et_a_gradFill: pItem = new CGradientFillProperties  ( (const CGradientFillProperties&) *oOther.m_arrItems[nIndex] ); break;
					case et_a_grpFill:  pItem = new CGroupFillProperties     ( (const CGroupFillProperties&) *oOther.m_arrItems[nIndex] ); break;
					case et_a_noFill:   pItem = new CNoFillProperties        ( (const CNoFillProperties&) *oOther.m_arrItems[nIndex] ); break;
					case et_a_pattFill: pItem = new CPatternFillProperties   ( (const CPatternFillProperties&) *oOther.m_arrItems[nIndex] ); break;
					case et_a_solidFill:pItem = new CSolidColorFillProperties( (const CSolidColorFillProperties&) *oOther.m_arrItems[nIndex] ); break;
					}

					if ( NULL != pItem )
						m_arrItems.Add( pItem );
				}
			}
			virtual ~CFillStyleList()
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
				
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{		
				if ( oReader.IsEmptyNode() )
					return;

				int nParentDepth = oReader.GetDepth();
				while( oReader.ReadNextSiblingNode( nParentDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();
					WritingElement *pItem = NULL;

					if ( _T("a:blipFill") == sName )
						pItem = new OOX::Drawing::CBlipFillProperties( oReader );
					else if ( _T("a:gradFill") == sName )
						pItem = new OOX::Drawing::CGradientFillProperties( oReader );
					else if ( _T("a:grpFill") == sName )
						pItem = new OOX::Drawing::CGroupFillProperties( oReader );
					else if ( _T("a:noFill") == sName )
						pItem = new OOX::Drawing::CNoFillProperties( oReader );
					else if ( _T("a:pattFill") == sName )
						pItem = new OOX::Drawing::CPatternFillProperties( oReader );
					else if ( _T("a:solidFill") == sName )
						pItem = new OOX::Drawing::CSolidColorFillProperties( oReader );

					if ( pItem )
						m_arrItems.Add( pItem );
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<a:fillStyleLst>"); 

				for ( int nIndex = 0; nIndex < m_arrItems.GetSize(); nIndex++ )
				{
					if ( m_arrItems[nIndex] )
					{
						sResult += m_arrItems[nIndex]->toXML();
					}
				}
				
				sResult += _T("</a:fillStyleLst>"); 

				return sResult;
			}
			virtual EElementType getType() const
			{
				return et_a_fillStyleLst;
			}

		public:

			
			CSimpleArray<WritingElement*> m_arrItems;
		};
		
		
		
		class CSupplementalFont : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CSupplementalFont)
			CSupplementalFont()
			{
			}
			virtual ~CSupplementalFont()
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
				CString sResult = _T("<a:font script=\"") + m_sScript + _T("\" typeface=\"") + m_oTypeFace.ToString() + _T("\"/>");
				return sResult;
			}
			virtual EElementType getType() const
			{
				return et_a_font;
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
					case 's':
						if      ( _T("script")   == wsName ) m_sScript   = oReader.GetText();
						break;

					case 't':
						if      ( _T("typeface") == wsName ) m_oTypeFace = oReader.GetText();
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

			
			CString                    m_sScript;
			SimpleTypes::CTextTypeface m_oTypeFace;
		};
		
		
		
		class CDefaultShapeDefinition : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CDefaultShapeDefinition)
			CDefaultShapeDefinition()
			{
				m_eType = et_Unknown;
			}
			virtual ~CDefaultShapeDefinition()
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
				if ( _T("a:lnDef") == sName )
					m_eType = et_a_lnDef;
				else if ( _T("a:spDef") == sName )
					m_eType = et_a_spDef;
				else if ( _T("a:txDef") == sName )
					m_eType = et_a_txDef;
				else 
					return;

				if ( oReader.IsEmptyNode() )
					return;

				int nCurDepth = oReader.GetDepth();
				while( oReader.ReadNextSiblingNode( nCurDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();
					if ( _T("a:bodyPr") == sName )
						m_oBodyPr = oReader;
					else if ( _T("a:extLst") == sName )
						m_oExtLst = oReader;
					
					
					else if ( _T("a:spPr") == sName )
						m_oSpPr = oReader;
					else if ( _T("a:style") == sName )
						m_oStyle = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult;
				
				switch ( m_eType )
				{
				case et_a_lnDef: sResult = _T("<a:lnDef>"); break;
				case et_a_spDef: sResult = _T("<a:spDef>"); break;
				case et_a_txDef: sResult = _T("<a:txDef>"); break;
				default: return _T("");
				}

				sResult += m_oSpPr.toXML();
				sResult += m_oBodyPr.toXML();
				
				
				if ( m_oStyle.IsInit() )
					sResult += m_oStyle->toXML();

				if ( m_oExtLst.IsInit() )
					sResult += m_oExtLst->toXML();

				switch ( m_eType )
				{
				case et_a_lnDef: sResult += _T("</a:lnDef>"); break;
				case et_a_spDef: sResult += _T("</a:spDef>"); break;
				case et_a_txDef: sResult += _T("</a:txDef>"); break;
				}

				return sResult;
			}
			virtual EElementType getType() const
			{
				return m_eType;
			}

		public:

			EElementType                                    m_eType;

			
			OOX::Drawing::CTextBodyProperties               m_oBodyPr;
			nullable<OOX::Drawing::COfficeArtExtensionList> m_oExtLst;
			
			
			OOX::Drawing::CShapeProperties                  m_oSpPr;
			nullable<OOX::Drawing::CShapeStyle>             m_oStyle;
		};


		
		
		
		class CLineStyleList : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CLineStyleList)
			CLineStyleList()
			{
			}
			virtual ~CLineStyleList()
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
				while( oReader.ReadNextSiblingNode( nCurDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();
					if ( _T("a:ln") == sName )
					{
						OOX::Drawing::CLineProperties oLP = oReader;
						m_arrLn.Add( oLP );
					}
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<a:lnStyleLst>"); 

				for ( int nIndex = 0; nIndex < m_arrLn.GetSize(); nIndex++ )
					sResult += m_arrLn[nIndex].toXML();

				sResult += _T("</a:lnStyleLst>"); 

				return sResult;
			}
			virtual EElementType getType() const
			{
				return et_a_lnStyleLst;
			}

		public:

			
			CSimpleArray<OOX::Drawing::CLineProperties> m_arrLn;
		};

		
		
		
		class CFontCollection : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CFontCollection)
			CFontCollection()
			{
				m_eType = et_Unknown;
			}
			virtual ~CFontCollection()
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
				if ( _T("a:majorFont") == sName )
					m_eType = et_a_majorFont;
				else if ( _T("a:minorFont") == sName )
					m_eType = et_a_minorFont;
				else 
					return;

				if ( oReader.IsEmptyNode() )
					return;

				int nCurDepth = oReader.GetDepth();
				while( oReader.ReadNextSiblingNode( nCurDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();
					if ( _T("a:cs") == sName )
						m_oCs = oReader;
					else if ( _T("a:ea") == sName )
						m_oEa = oReader;
					else if ( _T("a:extLst") == sName )
						m_oExtLst = oReader;
					else if ( _T("a:font") == sName )
					{
						OOX::Drawing::CSupplementalFont oFont = oReader;
						m_arrFont.Add( oFont );
					}
					else if ( _T("a:latin") == sName )
						m_oLatin = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult;
				
				switch ( m_eType )
				{
				case et_a_majorFont: sResult = _T("<a:majorFont>"); break;
				case et_a_minorFont: sResult = _T("<a:minorFont>"); break;
				default: return _T("");
				}

				sResult += m_oLatin.toXML();
				sResult += m_oEa.toXML();
				sResult += m_oCs.toXML();

				for ( int nIndex = 0; nIndex < m_arrFont.GetSize(); nIndex++ )
					sResult += m_arrFont[nIndex].toXML();

				if ( m_oExtLst.IsInit() )
					sResult += m_oExtLst->toXML();

				switch ( m_eType )
				{
				case et_a_majorFont: sResult += _T("</a:majorFont>"); break;
				case et_a_minorFont: sResult += _T("</a:minorFont>"); break;
				}

				return sResult;
			}
			virtual EElementType getType() const
			{
				return m_eType;
			}

		public:

			EElementType                                    m_eType;

			
			OOX::Drawing::CTextFont                         m_oCs;
			OOX::Drawing::CTextFont                         m_oEa;
			nullable<OOX::Drawing::COfficeArtExtensionList> m_oExtLst;
			CSimpleArray<OOX::Drawing::CSupplementalFont>   m_arrFont;
			OOX::Drawing::CTextFont                         m_oLatin;
		};


		
		
		
		class CStyleMatrix : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CStyleMatrix)
			CStyleMatrix()
			{
			}
			virtual ~CStyleMatrix()
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
				while( oReader.ReadNextSiblingNode( nCurDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();
					if ( _T("a:bgFillStyleLst") == sName )
						m_oBgFillStyleLst = oReader;
					else if ( _T("a:effectStyleLst") == sName )
						m_oEffectStyleLst = oReader;
					else if ( _T("a:fillStyleLst") == sName )
						m_oFillStyleLst = oReader;
					else if ( _T("a:lnStyleLst") == sName )
						m_oLineStyleLst = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<a:fmtScheme name=\">") + m_sName + _T("\">"); 

				sResult += m_oFillStyleLst.toXML();
				sResult += m_oLineStyleLst.toXML();
				sResult += m_oEffectStyleLst.toXML();
				sResult += m_oBgFillStyleLst.toXML();

				sResult += _T("</a:fmtScheme>"); 

				return sResult;
			}
			virtual EElementType getType() const
			{
				return et_a_fmtScheme;
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
					if ( _T("name") == wsName ) 
						m_sName = oReader.GetText();

					if ( !oReader.MoveToNextAttribute() )
						break;

					wsName = oReader.GetName();
				}
				oReader.MoveToElement();
			}

		public:

			
			CString                                m_sName;

			
			OOX::Drawing::CBackgroundFillStyleList m_oBgFillStyleLst;
			OOX::Drawing::CEffectStyleList         m_oEffectStyleLst;
			OOX::Drawing::CFillStyleList           m_oFillStyleLst;
			OOX::Drawing::CLineStyleList           m_oLineStyleLst;
		};


		
		
		
		class CFontScheme : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CFontScheme)
			CFontScheme()
			{
			}
			virtual ~CFontScheme()
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
				while( oReader.ReadNextSiblingNode( nCurDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();
					if ( _T("a:extLst") == sName )
						m_oExtLst = oReader;
					else if ( _T("a:majorFont") == sName )
						m_oMajorFont = oReader;
					else if ( _T("a:minorFont") == sName )
						m_oMinorFont = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<a:fontScheme name=\">") + m_sName + _T("\">"); 

				sResult += m_oMajorFont.toXML();
				sResult += m_oMinorFont.toXML();

				if ( m_oExtLst.IsInit() )
					sResult += m_oExtLst->toXML();

				sResult += _T("</a:fontScheme>"); 

				return sResult;
			}
			virtual EElementType getType() const
			{
				return et_a_fontScheme;
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
					if ( _T("name") == wsName ) 
						m_sName = oReader.GetText();

					if ( !oReader.MoveToNextAttribute() )
						break;

					wsName = oReader.GetName();
				}
				oReader.MoveToElement();
			}

		public:

			
			CString                                         m_sName;

			
			OOX::Drawing::CFontCollection                   m_oMajorFont;
			OOX::Drawing::CFontCollection                   m_oMinorFont;
			nullable<OOX::Drawing::COfficeArtExtensionList> m_oExtLst;
		};


	} 
} 

#endif // OOX_LOGIC_DRAWING_STYLES_INCLUDE_H_