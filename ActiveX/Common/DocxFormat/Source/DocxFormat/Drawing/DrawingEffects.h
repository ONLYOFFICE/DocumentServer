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
#ifndef OOX_LOGIC_DRAWING_EFFECTS_INCLUDE_H_
#define OOX_LOGIC_DRAWING_EFFECTS_INCLUDE_H_

#include "../../Base/Nullable.h"
#include "../../Common/SimpleTypes_Drawing.h"
#include "../../Common/SimpleTypes_Shared.h"
#include "../../Common/SimpleTypes_Word.h"

#include "../WritingElement.h"
#include "../RId.h"

#include "DrawingExt.h"
#include "DrawingColors.h"


namespace OOX
{
	namespace Drawing
	{
		enum EEffectType
		{
			effecttypeUnknown = 0,
			effecttypeDag     = 1,
			effecttypeLst     = 2,
		};
		enum ELineDashType
		{
			linedashtypeUnknown = 0,
			linedashtypePreset  = 1,
			linedashtypeCustom  = 2,
		};
		enum ELineJoinType
		{
			linejointypeUnknown = 0,
			linejointypeRound   = 1,
			linejointypeBevel   = 2,
			linejointypeMiter   = 3,
		};
        
        
        
		class CEffectContainer : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CEffectContainer)
			CEffectContainer()
			{
				m_eType = et_Unknown;
			}
			virtual ~CEffectContainer()
			{
				Clear();
			}
			CEffectContainer(const CEffectContainer& oOther);

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode);
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader);
			virtual CString      toXML() const;
			virtual EElementType getType() const
			{
				return m_eType;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("name"), m_sName )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("type"), m_oType )
				WritingElement_ReadAttributes_End( oReader )
			}


		public:

			void Clear()
			{
				for ( int nIndex = 0; nIndex < m_arrEffects.GetSize(); nIndex++ )
				{
					if ( m_arrEffects[nIndex] )
						delete m_arrEffects[nIndex];

					m_arrEffects[nIndex] = NULL;
				}

				m_arrEffects.RemoveAll();
			}

		public:

			
			EElementType m_eType;

			
			nullable<CString>                   m_sName;
			SimpleTypes::CEffectContainerType<> m_oType;

			
			CSimpleArray<WritingElement*>       m_arrEffects;

		};

        
        
        
		class CEffectList : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CEffectList)
			CEffectList()
			{
			}
			virtual ~CEffectList()
			{
				Clear();
			}

			CEffectList(const CEffectList& oOther);

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode);
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader);
			virtual CString      toXML() const;
			virtual EElementType getType() const
			{
				return OOX::et_a_effectLst;
			}

		public:

			void Clear()
			{
				for ( int nIndex = 0; nIndex < m_arrEffects.GetSize(); nIndex++ )
				{
					if ( m_arrEffects[nIndex] )
						delete m_arrEffects[nIndex];

					m_arrEffects[nIndex] = NULL;
				}

				m_arrEffects.RemoveAll();
			}

		public:

			
			CSimpleArray<WritingElement*>       m_arrEffects;

		};

	} 
} 


namespace OOX
{
	namespace Drawing
	{
        
        
        
		class CAlphaBiLevelEffect : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CAlphaBiLevelEffect)
			CAlphaBiLevelEffect()
			{
			}
			virtual ~CAlphaBiLevelEffect()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("thresh"), m_oTresh );
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}

			virtual CString      toXML() const
			{
				CString sResult = _T("<a:alphaBiLevel tresh=\"") + m_oTresh.ToString() + _T("\">");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_alphaBiLevel;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_ReadSingle( oReader, _T("thresh"), m_oTresh )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			SimpleTypes::CPositiveFixedPercentage m_oTresh;

		};

        
        
        
		class CAlphaCeilingEffect : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CAlphaCeilingEffect)
			CAlphaCeilingEffect()
			{
			}
			virtual ~CAlphaCeilingEffect()
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
				return _T("<a:alphaCeiling/>");
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_alphaCeiling;
			}

		};

        
        
        
		class CAlphaFloorEffect : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CAlphaFloorEffect)
			CAlphaFloorEffect()
			{
			}
			virtual ~CAlphaFloorEffect()
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
				return _T("<a:alphaFloor/>");
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_alphaFloor;
			}

		};

        
        
        
		class CAlphaInverseEffect : public OOX::Drawing::CColor
		{
		public:
			WritingElement_AdditionConstructors(CAlphaInverseEffect)
			CAlphaInverseEffect()
			{
			}
			virtual ~CAlphaInverseEffect()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				CColor::fromXML( oNode );
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				CColor::fromXML( oReader );
			}

			virtual CString      toXML() const
			{
				CString sResult = _T("<a:alphaInv>");

				sResult += CColor::toXML();

				sResult += _T("</a:alphaInv>");
				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_alphaInv;
			}

		};

        
        
        
		class CAlphaModulateEffect : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CAlphaModulateEffect)
			CAlphaModulateEffect()
			{
			}
			virtual ~CAlphaModulateEffect()
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
					if ( _T("a:cont") == sName )
						m_oCont = oReader;
				}
			}

			virtual CString      toXML() const
			{
				CString sResult = _T("<a:alphaMod>");
				sResult += m_oCont.toXML();
				sResult += _T("</a:alphaMod>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_alphaMod;
			}

		public:

			OOX::Drawing::CEffectContainer m_oCont;

		};

        
        
        
        class CAlphaModulateFixedEffect : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CAlphaModulateFixedEffect)
			CAlphaModulateFixedEffect()
			{
			}
			virtual ~CAlphaModulateFixedEffect()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("amt"), m_oAmt );
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}

			virtual CString      toXML() const
			{
				CString sResult = _T("<a:alphaModFix amt=\"") + m_oAmt.ToString() + _T("\">");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_alphaModFix;
			}
		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_ReadSingle( oReader, _T("amt"), m_oAmt )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			SimpleTypes::CPositivePercentage m_oAmt;

		};
        
        
        
        class CAlphaOutsetEffect : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CAlphaOutsetEffect)
			CAlphaOutsetEffect()
			{
			}
			virtual ~CAlphaOutsetEffect()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("rad"), m_oRad );
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}

			virtual CString      toXML() const
			{
				CString sResult = _T("<a:alphaOutset rad=\"") + m_oRad.ToString() + _T("\">");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_alphaOutset;
			}
		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_ReadSingle( oReader, _T("rad"), m_oRad )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			SimpleTypes::CCoordinate m_oRad;

		};
        
        
        
        class CAlphaReplaceEffect : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CAlphaReplaceEffect)
			CAlphaReplaceEffect()
			{
			}
			virtual ~CAlphaReplaceEffect()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("a"), m_oA );
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}

			virtual CString      toXML() const
			{
				CString sResult = _T("<a:alphaRepl a=\"") + m_oA.ToString() + _T("\">");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_alphaRepl;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_ReadSingle( oReader, _T("a"), m_oA )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			SimpleTypes::CPositiveFixedPercentage m_oA;

		};
        
        
        
        class CLineJoinBevel : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CLineJoinBevel)
			CLineJoinBevel()
			{
			}
			virtual ~CLineJoinBevel()
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
				return _T("<a:bevel/>");
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_bevel;
			}
		};
        
        
        
		class CBackgroundColor : public OOX::Drawing::CColor
		{
		public:
			WritingElement_AdditionConstructors(CBackgroundColor)
			CBackgroundColor()
			{
			}
			virtual ~CBackgroundColor()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				CColor::fromXML( oNode );
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				CColor::fromXML( oReader );
			}

			virtual CString      toXML() const
			{
				CString sResult = _T("<a:bgClr>");

				sResult += CColor::toXML();

				sResult += _T("</a:bgClr>");
				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_bgClr;
			}

		};

		
        
        
		class CBiLevelEffect : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CBiLevelEffect)
			CBiLevelEffect()
			{
			}
			virtual ~CBiLevelEffect()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("thresh"), m_oTresh );
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}

			virtual CString      toXML() const
			{
				CString sResult = _T("<a:biLevel tresh=\"") + m_oTresh.ToString() + _T("\">");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_biLevel;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_ReadSingle( oReader, _T("thresh"), m_oTresh )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			SimpleTypes::CPositiveFixedPercentage m_oTresh;

		};

        
        
        
		class CBlendEffect : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CBlendEffect)
			CBlendEffect()
			{
			}
			virtual ~CBlendEffect()
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
					if ( _T("a:cont") == sName )
						m_oCont = oReader;
				}
			}

			virtual CString      toXML() const
			{
				CString sResult = _T("<a:blend blend=\"");
				sResult += m_oBlend.ToString() + _T("\">");
				sResult += m_oCont.toXML();
				sResult += _T("</a:blend>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_blend;
			}
		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_ReadSingle( oReader, _T("blend"), m_oBlend )
				WritingElement_ReadAttributes_End( oReader )
			}
		public:

			
			SimpleTypes::CBlendMode<>      m_oBlend;

			
			OOX::Drawing::CEffectContainer m_oCont;

		};

		
		
		
		class CBlip : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CBlip)
			CBlip()
			{
			}
			virtual ~CBlip()
			{
				Clear();
			}
			CBlip(const CBlip& oOther);

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode);
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader);
			virtual CString      toXML() const;
			virtual EElementType getType() const
			{
				return OOX::et_a_blip;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("cstate"),  m_oCState )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("r:embed"), m_oEmbed )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("r:link"),  m_oLink )
				WritingElement_ReadAttributes_End( oReader )
			}


		public:

			void Clear()
			{
				for ( int nIndex = 0; nIndex < m_arrEffects.GetSize(); nIndex++ )
				{
					if ( m_arrEffects[nIndex] )
						delete m_arrEffects[nIndex];

					m_arrEffects[nIndex] = NULL;
				}

				m_arrEffects.RemoveAll();
			}

		public:

			
			SimpleTypes::CBlipCompression<> m_oCState;
			SimpleTypes::CRelationshipId    m_oEmbed;
			SimpleTypes::CRelationshipId    m_oLink;

			
			nullable<OOX::Drawing::COfficeArtExtensionList> m_oExtLst;
			CSimpleArray<WritingElement*>                   m_arrEffects;
		};	
		
		
		
		class CRelativeRect;
		class CTileInfoProperties;
		class CStretchInfoProperties;
		enum EFillModePoperties
		{
			fillmodepropertiesUnknown = 0,
			fillmodepropertiesTile    = 1,
			fillmodepropertiesStretch = 2,
		};
		class CBlipFillProperties : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CBlipFillProperties)
			CBlipFillProperties()
			{
				m_eType         = et_Unknown;
				m_eFillModeType = fillmodepropertiesUnknown;
			}
			virtual ~CBlipFillProperties()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode);
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader);
			virtual CString      toXML() const;
			virtual EElementType getType() const
			{
				return m_eType;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("dpi"),          m_oDpi )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("rotWithShape"), m_oRotWithShape )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			EElementType                                   m_eType;

			EFillModePoperties                             m_eFillModeType;

			
			nullable<SimpleTypes::CDecimalNumber<>>        m_oDpi;
			nullable<SimpleTypes::COnOff<>>                m_oRotWithShape;

			
			nullable<OOX::Drawing::CBlip>                  m_oBlip;
			nullable<OOX::Drawing::CRelativeRect>          m_oSrcRect;
			nullable<OOX::Drawing::CTileInfoProperties>    m_oTile;
			nullable<OOX::Drawing::CStretchInfoProperties> m_oStretch;

		};	
		
        
        
		class CBlurEffect : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CBlurEffect)
			CBlurEffect()
			{
			}
			virtual ~CBlurEffect()
			{
			}


		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("grow"), m_oGrow );
				oNode.ReadAttributeBase( _T("rad"),  m_oRad );
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}

			virtual CString      toXML() const
			{
				CString sResult = _T("<a:blur grow=\"") + m_oGrow.ToString() + _T("\" ") + _T("rad=\"") + m_oRad.ToString() + _T("\">");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_blur;
			}
		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("grow"), m_oGrow )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("rad"),  m_oRad )
				WritingElement_ReadAttributes_End( oReader )
			}
		public:

			SimpleTypes::COnOff<SimpleTypes::onoffTrue> m_oGrow;
			SimpleTypes::CPositiveCoordinate<0>         m_oRad;

		};
        
        
        
		class CClrFrom : public OOX::Drawing::CColor
		{
		public:
			WritingElement_AdditionConstructors(CClrFrom)
			CClrFrom()
			{
			}
			virtual ~CClrFrom()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				CColor::fromXML( oNode );
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				CColor::fromXML( oReader );
			}

			virtual CString      toXML() const
			{
				CString sResult = _T("<a:clrFrom>");

				sResult += CColor::toXML();

				sResult += _T("</a:clrFrom>");
				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_clrFrom;
			}

		};
        
        
        
		class CClrTo : public OOX::Drawing::CColor
		{
		public:
			WritingElement_AdditionConstructors(CClrTo)
			CClrTo()
			{
			}
			virtual ~CClrTo()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				CColor::fromXML( oNode );
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				CColor::fromXML( oReader );
			}

			virtual CString      toXML() const
			{
				CString sResult = _T("<a:clrTo>");

				sResult += CColor::toXML();

				sResult += _T("</a:clrTo>");
				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_clrTo;
			}

		};
		
        
        
		class CColorChangeEffect : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CColorChangeEffect)
			CColorChangeEffect()
			{
			}
			virtual ~CColorChangeEffect()
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
					if ( _T("a:clrFrom") == sName )
						m_oClrFrom = oReader;
					else if ( _T("a:clrTo") == sName )
						m_oClrTo = oReader;
				}
			}

			virtual CString      toXML() const
			{
				CString sResult = _T("<a:clrChange useA=\"") + m_oUseA.ToString() + _T("\">");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_clrChange;
			}
		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_ReadSingle( oReader, _T("useA"), m_oUseA )
				WritingElement_ReadAttributes_End( oReader )
			}
		public:

			
			SimpleTypes::COnOff<SimpleTypes::onoffTrue> m_oUseA;

			
			CClrFrom                                    m_oClrFrom;
			CClrTo                                      m_oClrTo;
		};
        
        
        
		class CColorReplaceEffect : public OOX::Drawing::CColor
		{
		public:
			WritingElement_AdditionConstructors(CColorReplaceEffect)
			CColorReplaceEffect()
			{
			}
			virtual ~CColorReplaceEffect()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				CColor::fromXML( oNode );
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				CColor::fromXML( oReader );
			}

			virtual CString      toXML() const
			{
				CString sResult = _T("<a:clrRepl>");

				sResult += CColor::toXML();

				sResult += _T("</a:clrRepl>");
				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_clrRepl;
			}

		};
		
        
        
		class CDashStop : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CDashStop)
			CDashStop()
			{
			}
			virtual ~CDashStop()
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
				CString sResult = _T("<a:ds d=\"") + m_oD.ToString() + _T("\" sp=\"") + m_oSp.ToString() + _T("\"/>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_ds;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("d"),  m_oD )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("sp"), m_oSp )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			
			SimpleTypes::CPositivePercentage m_oD;
			SimpleTypes::CPositivePercentage m_oSp;
		};
		
        
        
		class CDashStopList : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CDashStopList)
			CDashStopList()
			{
			}
			virtual ~CDashStopList()
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
					if ( _T("a:ds") == sName )
					{
						CDashStop oDs = oReader;
						m_arrDs.Add( oDs );
					}
				}
			}

			virtual CString      toXML() const
			{
				CString sResult = _T("<a:custDash>");

				for ( int nIndex = 0; nIndex < m_arrDs.GetSize(); nIndex++ )
					sResult += m_arrDs[nIndex].toXML();

				sResult += _T("</a:custDash>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_custDash;
			}

		public:

			
			CSimpleArray<CDashStop> m_arrDs;

		};
        
        
        
		class CDuotoneEffect : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CDuotoneEffect)
			CDuotoneEffect()
			{
			}
			virtual ~CDuotoneEffect()
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

				bool bFirstColor = true;
				int nCurDepth = oReader.GetDepth();
				while ( oReader.ReadNextSiblingNode( nCurDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();
					if ( _T("a:hslClr") == sName )
					{
						unsigned char unR = 0, unG = 0, unB = 0, unA = 255;
						OOX::Drawing::CHslColor oColor = oReader;
						oColor.GetRGBA( unR, unG, unB, unA );

						SetColor( bFirstColor, unR, unG, unB, unA );
					}
					else if ( _T("a:prstClr") == sName )
					{
						unsigned char unR = 0, unG = 0, unB = 0, unA = 255;
						OOX::Drawing::CPresetColor oColor = oReader;
						oColor.GetRGBA( unR, unG, unB, unA );

						SetColor( bFirstColor, unR, unG, unB, unA );
					}
					else if ( _T("a:schemeClr") == sName )
					{
						unsigned char unR = 0, unG = 0, unB = 0, unA = 255;
						OOX::Drawing::CSchemeColor oColor = oReader;
						oColor.GetRGBA( unR, unG, unB, unA );

						SetColor( bFirstColor, unR, unG, unB, unA );
					}
					else if ( _T("a:scrgbClr") == sName )
					{
						unsigned char unR = 0, unG = 0, unB = 0, unA = 255;
						OOX::Drawing::CScRgbColor oColor = oReader;
						oColor.GetRGBA( unR, unG, unB, unA );

						SetColor( bFirstColor, unR, unG, unB, unA );
					}
					else if ( _T("a:srgbClr") == sName )
					{
						unsigned char unR = 0, unG = 0, unB = 0, unA = 255;
						OOX::Drawing::CSRgbColor oColor = oReader;
						oColor.GetRGBA( unR, unG, unB, unA );

						SetColor( bFirstColor, unR, unG, unB, unA );
					}
					else if ( _T("a:sysClr") == sName )
					{
						unsigned char unR = 0, unG = 0, unB = 0, unA = 255;
						OOX::Drawing::CSystemColor oColor = oReader;
						oColor.GetRGBA( unR, unG, unB, unA );

						SetColor( bFirstColor, unR, unG, unB, unA );
					}
				}
			}

			virtual CString      toXML() const
			{
				OOX::Drawing::CSRgbColor oColor1, oColor2;
				oColor1.SetRGBA( m_oColor1.Get_R(), m_oColor1.Get_G(), m_oColor1.Get_B(), m_oColor1.Get_A() );
				oColor2.SetRGBA( m_oColor2.Get_R(), m_oColor2.Get_G(), m_oColor2.Get_B(), m_oColor2.Get_A() );

				CString sResult = _T("<a:duotone>");

				sResult += oColor1.toXML();
				sResult += oColor2.toXML();

				sResult += _T("</a:duotone>");
				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_duotone;
			}

		private:

			void SetColor(bool &bFirst, unsigned char unR, unsigned char unG, unsigned char unB, unsigned char unA)
			{
				if ( bFirst )
				{
					m_oColor1.Set_RGBA( unR, unG, unB, unA );
					bFirst = false;
				}
				else
					m_oColor2.Set_RGBA( unR, unG, unB, unA );
			}

		public:

			SimpleTypes::CHexColorRGB<> m_oColor1;
			SimpleTypes::CHexColorRGB<> m_oColor2;
		};
        
        
        
		class CEffectReference : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CEffectReference)
			CEffectReference()
			{
			}
			virtual ~CEffectReference()
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
				CString sResult = _T("<a:effect ref=\"") + m_sRef + _T("\"/>");
				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_effect;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_ReadSingle( oReader, _T("ref"), m_sRef )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			
			CString m_sRef;
		};
        
        
        
		class CForegroundColor : public OOX::Drawing::CColor
		{
		public:
			WritingElement_AdditionConstructors(CForegroundColor)
			CForegroundColor()
			{
			}
			virtual ~CForegroundColor()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				CColor::fromXML( oNode );
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				CColor::fromXML( oReader );
			}

			virtual CString      toXML() const
			{
				CString sResult = _T("<a:fgClr>");

				sResult += CColor::toXML();

				sResult += _T("</a:fgClr>");
				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_fgClr;
			}

		};

		
        
        
		class CRelativeRect : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CRelativeRect)
			CRelativeRect()
			{
				m_eType = et_Unknown;
			}
			virtual ~CRelativeRect()
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
				if ( _T("a:fillRect") == sName )
					m_eType = et_a_fillRect;
				else if ( _T("a:fillToRect") == sName )
					m_eType = et_a_fillToRect;
				else if ( _T("a:tileRect") == sName )
					m_eType = et_a_tileRect;
				else if ( _T("a:srcRect") == sName )
					m_eType = et_a_srcRect;
				else
					return;

				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}

			virtual CString      toXML() const
			{
				CString sResult;
				
				if ( et_a_fillRect == m_eType )
					sResult = _T("<a:fillRect l=\"") + m_oL.ToString()
									   + _T("\" t=\"") + m_oT.ToString()
									   + _T("\" r=\"") + m_oR.ToString()
									   + _T("\" b=\"") + m_oB.ToString()
									   + _T("\"/>");
				else if ( et_a_fillToRect == m_eType )
					sResult = _T("<a:fillToRect l=\"") + m_oL.ToString()
									   + _T("\" t=\"") + m_oT.ToString()
									   + _T("\" r=\"") + m_oR.ToString()
									   + _T("\" b=\"") + m_oB.ToString()
									   + _T("\"/>");
				else if ( et_a_tileRect == m_eType )
					sResult = _T("<a:tileRect l=\"") + m_oL.ToString()
									 + _T("\" t=\"") + m_oT.ToString()
									 + _T("\" r=\"") + m_oR.ToString()
									 + _T("\" b=\"") + m_oB.ToString()
									 + _T("\"/>");
				else if ( et_a_srcRect == m_eType )
					sResult = _T("<a:srcRect l=\"") + m_oL.ToString()
									 + _T("\" t=\"") + m_oT.ToString()
									 + _T("\" r=\"") + m_oR.ToString()
									 + _T("\" b=\"") + m_oB.ToString()
									 + _T("\"/>");


				return sResult;
			}
			virtual EElementType getType() const
			{
				return m_eType;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				m_oL.SetValue( 0 );
				m_oB.SetValue( 0 );
				m_oR.SetValue( 0 );
				m_oT.SetValue( 0 );

				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("b"), m_oB )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("l"), m_oL )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("r"), m_oR )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("t"), m_oT )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			EElementType m_eType;

			
			SimpleTypes::CPercentage m_oB;
			SimpleTypes::CPercentage m_oL;
			SimpleTypes::CPercentage m_oR;
			SimpleTypes::CPercentage m_oT;
		};
        
        
        
		class CGlowEffect : public OOX::Drawing::CColor
		{
		public:
			WritingElement_AdditionConstructors(CGlowEffect)
			CGlowEffect()
			{
			}
			virtual ~CGlowEffect()
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
				CString sResult = _T("<a:glow rad=\"") + m_oRad.ToString() + _T("\">");

				sResult += CColor::toXML();

				sResult += _T("</a:glow>");
				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_glow;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_ReadSingle( oReader, _T("rad"), m_oRad )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			SimpleTypes::CPositiveCoordinate<0> m_oRad;

		};

        
        
        
		class CGradientStopList;
		class CLinearShadeProperties;
		class CPathShadeProperties;
		enum EGradFillType
		{
			gradfilltypeUnknown = 0,
			gradfilltypeLinear  = 1,
			gradfilltypePath    = 2
		};

		class CGradientFillProperties : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CGradientFillProperties)
			CGradientFillProperties()
			{
				m_eGradType = gradfilltypeUnknown;
			}
			virtual ~CGradientFillProperties()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode);
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader);
			virtual CString      toXML() const;
			virtual EElementType getType() const
			{
				return OOX::et_a_gradFill;
			}


		public:

			EGradFillType GetGradType() const
			{
				return m_eGradType;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("flip"),         m_oFlip )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("rotWithShape"), m_oRotWithShape )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			EGradFillType                                  m_eGradType;

			
			nullable<SimpleTypes::CTileFlipMode<>>         m_oFlip;
			nullable<SimpleTypes::COnOff<>       >         m_oRotWithShape;

			
			nullable<OOX::Drawing::CGradientStopList>      m_oGsLst;
			nullable<OOX::Drawing::CLinearShadeProperties> m_oLin;
			nullable<OOX::Drawing::CPathShadeProperties>   m_oPath;
			nullable<OOX::Drawing::CRelativeRect>          m_oTileRect;

		};
		
        
        
		class CGrayscaleEffect : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CGrayscaleEffect)
			CGrayscaleEffect()
			{
			}
			virtual ~CGrayscaleEffect()
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
				return _T("<a:grayscl/>");
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_grayscl;
			}

		};

		
        
        
		class CGroupFillProperties : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CGroupFillProperties)
			CGroupFillProperties()
			{
			}
			virtual ~CGroupFillProperties()
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
				return _T("<a:grpFill/>");
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_grpFill;
			}

		};
		
        
        
		class CGradientStop : public OOX::Drawing::CColor
		{
		public:
			WritingElement_AdditionConstructors(CGradientStop)
			CGradientStop()
			{
			}
			virtual ~CGradientStop()
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
				CString sResult = _T("<a:gs pos=\"") + m_oPos.ToString() + _T("\">");
				sResult += CColor::toXML();
				sResult += _T("</a:gs>");
				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_gs;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_ReadSingle( oReader, _T("pos"), m_oPos )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			SimpleTypes::CPositiveFixedPercentage m_oPos;

		};
		
        
        
		class CGradientStopList : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CGradientStopList)
			CGradientStopList()
			{
			}
			virtual ~CGradientStopList()
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
					if ( _T("a:gs") == sName )
					{
						CGradientStop oGs = oReader;
						m_arrGs.Add( oGs );
					}
				}
			}

			virtual CString      toXML() const
			{
				CString sResult = _T("<a:gsLst>");

				for ( int nIndex = 0; nIndex < m_arrGs.GetSize(); nIndex++ )
					sResult += m_arrGs[nIndex].toXML();

				sResult += _T("</a:gsLst>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_gsLst;
			}

		public:

			
			CSimpleArray<CGradientStop> m_arrGs;

		};
		
        
        
		class CLineEndProperties : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CLineEndProperties)
			CLineEndProperties()
			{
				m_eType = et_Unknown;
			}
			virtual ~CLineEndProperties()
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
				if ( _T("a:tailEnd") == sName )
					m_eType = et_a_tailEnd;
				else if ( _T("a:headEnd") == sName )
					m_eType = et_a_headEnd;
				else 
					return;

				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}

			virtual CString      toXML() const
			{
				CString sResult;
					
				if ( et_a_tailEnd == m_eType )
					sResult = _T("<a:tailEnd ");
				else if ( et_a_headEnd == m_eType )
					sResult = _T("<a:headEnd ");
				else 
					return _T("");
				
				if ( m_oLen.IsInit() )
				{
					sResult += _T("len=\"");
					sResult += m_oLen->ToString();
					sResult += _T("\" ");
				}

				if ( m_oType.IsInit() )
				{
					sResult += _T("type=\"");
					sResult += m_oType->ToString();
					sResult += _T("\" ");
				}

				if ( m_oW.IsInit() )
				{
					sResult += _T("w=\"");
					sResult += m_oW->ToString();
					sResult += _T("\" ");
				}

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
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("len"),  m_oLen )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("type"), m_oType )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w"),    m_oW )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			EElementType m_eType;

			
			nullable<SimpleTypes::CLineEndLength<>> m_oLen;
			nullable<SimpleTypes::CLineEndType<>>   m_oType;
			nullable<SimpleTypes::CLineEndWidth<>>  m_oW;
		};
		
        
        
        class CHSLEffect : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CHSLEffect)
			CHSLEffect()
			{
			}
			virtual ~CHSLEffect()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("hue"), m_oHue );
				oNode.ReadAttributeBase( _T("lum"), m_oLum );
				oNode.ReadAttributeBase( _T("sat"), m_oSat );
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}

			virtual CString      toXML() const
			{
				CString sResult = _T("<a:hsl hue=\"") + m_oHue.ToString() + _T("\" lum=\"") + m_oLum.ToString() + _T("\" sat=\"") + m_oSat.ToString() + _T("\">");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_hsl;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("hue"), m_oHue )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("lum"), m_oLum )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("sat"), m_oSat )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			SimpleTypes::CPositiveFixedAngle<0> m_oHue;
			SimpleTypes::CFixedPercentage       m_oLum;
			SimpleTypes::CFixedPercentage       m_oSat;

		};
		
        
        
		class CInnerShadowEffect : public OOX::Drawing::CColor
		{
		public:
			WritingElement_AdditionConstructors(CInnerShadowEffect)
			CInnerShadowEffect()
			{
			}
			virtual ~CInnerShadowEffect()
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
				CString sResult = _T("<a:innerShdw blurRad=\"") + m_oBlurRad.ToString() + _T("\" dir=\"") + m_oDir.ToString() + _T("\" dist=\"") + m_oDist.ToString() + _T("\">");
				sResult += CColor::toXML();
				sResult += _T("</a:innerShdw>");
				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_innerShdw;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("blurRad"), m_oBlurRad )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("dir"),     m_oDir )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("dist"),    m_oDist )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			SimpleTypes::CPositiveCoordinate<0> m_oBlurRad;
			SimpleTypes::CPositiveFixedAngle<0> m_oDir;
			SimpleTypes::CPositiveCoordinate<0> m_oDist;

		};

		
        
        
        class CLinearShadeProperties : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CLinearShadeProperties)
			CLinearShadeProperties()
			{
			}
			virtual ~CLinearShadeProperties()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("ang"),    m_oAng );
				oNode.ReadAttributeBase( _T("scaled"), m_oScaled );
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}

			virtual CString      toXML() const
			{
				CString sResult = _T("<a:lin ");

				if ( m_oAng.IsInit() )
				{
					sResult += _T("ang=\"");
					sResult += m_oAng->ToString();
					sResult += _T("\" ");
				}

				if ( m_oScaled.IsInit() )	
				{
					sResult += _T("scaled=\"");
					sResult += m_oScaled->ToString();
					sResult += _T("\"");
				}

				sResult += _T("/>");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return OOX::et_a_lin;
			}
		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("ang"),    m_oAng )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("scaled"), m_oScaled )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			
			nullable<SimpleTypes::CPositiveFixedAngle<>> m_oAng;
			nullable<SimpleTypes::COnOff<>>              m_oScaled;
		};

		
        
        
        class CLuminanceEffect : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CLuminanceEffect)
			CLuminanceEffect()
			{
			}
			virtual ~CLuminanceEffect()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("bright"), m_oBright );
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}

			virtual CString      toXML() const
			{
				CString sResult = _T("<a:lum bright=\"") + m_oBright.ToString() + _T("\">");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return OOX::et_a_lum;
			}
		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_ReadSingle( oReader, _T("bright"), m_oBright )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			SimpleTypes::CFixedPercentage m_oBright;

		};

		
        
        
        class CLineJoinMiterProperties : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CLineJoinMiterProperties)
			CLineJoinMiterProperties()
			{
			}
			virtual ~CLineJoinMiterProperties()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("lim"), m_oLim );
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}

			virtual CString      toXML() const
			{
				CString sResult;
				
				if ( m_oLim.IsInit() )
					sResult = _T("<a:miter lim=\"") + m_oLim->ToString() + _T("\">");
				else
					sResult = _T("</a:miter>");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return OOX::et_a_miter;
			}
		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_ReadSingle( oReader, _T("lim"), m_oLim )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			nullable<SimpleTypes::CPositivePercentage> m_oLim;

		};

		
        
        
		class CNoFillProperties : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CNoFillProperties)
			CNoFillProperties()
			{
			}
			virtual ~CNoFillProperties()
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
				return _T("<a:noFill/>");
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_noFill;
			}

		};
		
        
        
		class COuterShadowEffect : public OOX::Drawing::CColor
		{
		public:
			WritingElement_AdditionConstructors(COuterShadowEffect)
			COuterShadowEffect()
			{
			}
			virtual ~COuterShadowEffect()
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
				CString sResult = _T("<a:outerShdw blurRad=\"")      + m_oBlurRad.ToString() 
					                      + _T("\" dir=\"")          + m_oDir.ToString()     
										  + _T("\" dist=\"")         + m_oDist.ToString() 
										  + _T("\" kx=\"")           + m_oKx.ToString() 
										  + _T("\" ky=\"")           + m_oKy.ToString() 
										  + _T("\" rotWithShape=\"") + m_oRotWithShape.ToString() 
										  + _T("\" sx=\"")           + m_oSx.ToString() 
										  + _T("\" sy=\"")           + m_oSy.ToString() 
										  + _T("\" algn=\"")         + m_oAlgn.ToString() 
										  + _T("\">");
				sResult += CColor::toXML();
				sResult += _T("</a:outerShdw>");
				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_outerShdw;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				m_oSx.SetValue( 100 );
				m_oSy.SetValue( 100 );

				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("blurRad"),      m_oBlurRad )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("dir"),          m_oDir )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("dist"),         m_oDist )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("kx"),           m_oKx )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("ky"),           m_oKy )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("rotWithShape"), m_oRotWithShape )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("sx"),           m_oSx )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("sy"),           m_oSy )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("algn"),         m_oAlgn )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			SimpleTypes::CRectAlignment<SimpleTypes::rectalignmentB> m_oAlgn;
			SimpleTypes::CPositiveCoordinate<0>                      m_oBlurRad;
			SimpleTypes::CPositiveFixedAngle<0>                      m_oDir;
			SimpleTypes::CPositiveCoordinate<0>                      m_oDist;
			SimpleTypes::CFixedAngle<>                               m_oKx;
			SimpleTypes::CFixedAngle<>                               m_oKy;
			SimpleTypes::COnOff<SimpleTypes::onoffTrue>              m_oRotWithShape;
			SimpleTypes::CPercentage                                 m_oSx;
			SimpleTypes::CPercentage                                 m_oSy;

		};
		
        
        
		class CPathShadeProperties : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CPathShadeProperties)
			CPathShadeProperties()
			{
			}
			virtual ~CPathShadeProperties()
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
					if ( _T("a:fillToRect") == sName )
						m_oFillToRect = oReader;
				}
			}

			virtual CString      toXML() const
			{
				CString sResult = _T("<a:path ");

				if ( m_oPath.IsInit() )
				{
					sResult += _T("path=\"");
					sResult += m_oPath->ToString();
					sResult += _T("\">");
				}
				else
					sResult += _T(">");

				if ( m_oFillToRect.IsInit() )
					sResult += m_oFillToRect->toXML();

				sResult += _T("</a:path>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_path;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_ReadSingle( oReader, _T("path"), m_oPath )
				WritingElement_ReadAttributes_End( oReader )
			}
		public:


			
			nullable<SimpleTypes::CPathShadeType<>> m_oPath;

			
			nullable<OOX::Drawing::CRelativeRect>   m_oFillToRect;

		};
		
        
        
		class CPatternFillProperties : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CPatternFillProperties)
			CPatternFillProperties()
			{
			}
			virtual ~CPatternFillProperties()
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
					if ( _T("a:bgClr") == sName )
						m_oBgClr = oReader;
					else if ( _T("a:fgClr") == sName )
						m_oFgClr = oReader;
				}
			}

			virtual CString      toXML() const
			{
				CString sResult = _T("<a:pattFill ");

				if ( m_oPrst.IsInit() )
				{
					sResult += _T("prst=\"");
					sResult += m_oPrst->ToString();
					sResult += _T("\">");
				}
				else
					sResult += _T(">");

				if ( m_oFgClr.IsInit() )
					sResult += m_oFgClr->toXML();

				if ( m_oBgClr.IsInit() )
					sResult += m_oBgClr->toXML();

				sResult += _T("</a:pattFill>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_pattFill;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_ReadSingle( oReader, _T("prst"), m_oPrst )
				WritingElement_ReadAttributes_End( oReader )
			}
		public:


			
			nullable<SimpleTypes::CPresetPatternVal<>> m_oPrst;

			
			nullable<OOX::Drawing::CBackgroundColor>   m_oBgClr;
			nullable<OOX::Drawing::CForegroundColor>   m_oFgClr;

		};
		
        
        
        class CPresetLineDashProperties : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CPresetLineDashProperties)
			CPresetLineDashProperties()
			{
			}
			virtual ~CPresetLineDashProperties()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("val"), m_oVal );
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}

			virtual CString      toXML() const
			{
				CString sResult;
				
				if ( m_oVal.IsInit() )
					sResult = _T("<a:prstDash val=\"") + m_oVal->ToString() + _T("\"/>");
				else
					sResult = _T("<a:prstDash/>");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return OOX::et_a_prstDash;
			}
		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_ReadSingle( oReader, _T("val"), m_oVal )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			nullable<SimpleTypes::CPresetLineDashVal<>> m_oVal;

		};

		
        
        
		class CPresetShadowEffect : public OOX::Drawing::CColor
		{
		public:
			WritingElement_AdditionConstructors(CPresetShadowEffect)
			CPresetShadowEffect()
			{
			}
			virtual ~CPresetShadowEffect()
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
				CString sResult = _T("<a:prstShdw dir=\"")  + m_oDir.ToString()     
										 + _T("\" dist=\"") + m_oDist.ToString() 
										 + _T("\" prst=\"") + m_oPrst.ToString() 
										 + _T("\">");
				sResult += CColor::toXML();
				sResult += _T("</a:prstShdw>");
				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_prstShdw;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("dir"),  m_oDir )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("dist"), m_oDist )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("prst"), m_oPrst )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			SimpleTypes::CPositiveFixedAngle<0>         m_oDir;
			SimpleTypes::CPositiveCoordinate<0>         m_oDist;
			SimpleTypes::CPresetShadowVal<>             m_oPrst;

		};

		
        
        
		class CReflectionEffect : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CReflectionEffect)
			CReflectionEffect()
			{
			}
			virtual ~CReflectionEffect()
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
				CString sResult = _T("<a:reflection blurRad=\"")     + m_oBlurRad.ToString() 
					                      + _T("\" dir=\"")          + m_oDir.ToString()     
										  + _T("\" dist=\"")         + m_oDist.ToString() 
										  + _T("\" endA=\"")         + m_oEndA.ToString() 
										  + _T("\" endPos=\"")       + m_oEndPos.ToString() 
										  + _T("\" fadeDir=\"")      + m_oFadeDir.ToString() 
										  + _T("\" kx=\"")           + m_oKx.ToString() 
										  + _T("\" ky=\"")           + m_oKy.ToString() 
										  + _T("\" rotWithShape=\"") + m_oRotWithShape.ToString() 
										  + _T("\" stA=\"")          + m_oStA.ToString() 
										  + _T("\" stPos=\"")        + m_oStPos.ToString() 
										  + _T("\" sx=\"")           + m_oSx.ToString() 
										  + _T("\" sy=\"")           + m_oSy.ToString() 
										  + _T("\" algn=\"")         + m_oAlgn.ToString() 
										  + _T("\"/>");
				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_reflection;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				m_oStA.SetValue( 100 );
				m_oStPos.SetValue( 0 );
				m_oEndA.SetValue( 0 );
				m_oEndPos.SetValue( 100 );
				m_oSx.SetValue( 100 );
				m_oSy.SetValue( 100 );

				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("blurRad"),      m_oBlurRad )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("dir"),          m_oDir )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("dist"),         m_oDist )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("endA"),         m_oEndA )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("endPos"),       m_oEndPos )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("fadeDir"),      m_oFadeDir )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("kx"),           m_oKx )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("ky"),           m_oKy )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("rotWithShape"), m_oRotWithShape )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("stA"),          m_oStA )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("stPos"),        m_oStPos )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("sx"),           m_oSx )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("sy"),           m_oSy )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("algn"),         m_oAlgn )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			
			SimpleTypes::CRectAlignment<SimpleTypes::rectalignmentB> m_oAlgn;
			SimpleTypes::CPositiveCoordinate<0>                      m_oBlurRad;
			SimpleTypes::CPositiveFixedAngle<0>                      m_oDir;
			SimpleTypes::CPositiveCoordinate<0>                      m_oDist;
			SimpleTypes::CPositiveFixedPercentage                    m_oEndA;
			SimpleTypes::CPositiveFixedPercentage                    m_oEndPos;
			SimpleTypes::CPositiveFixedAngle<5400000>                m_oFadeDir;
			SimpleTypes::CFixedAngle<0>                              m_oKx;
			SimpleTypes::CFixedAngle<0>                              m_oKy;
			SimpleTypes::COnOff<SimpleTypes::onoffTrue>              m_oRotWithShape;
			SimpleTypes::CPositiveFixedPercentage                    m_oStA;
			SimpleTypes::CPositiveFixedPercentage                    m_oStPos;
			SimpleTypes::CPercentage                                 m_oSx;
			SimpleTypes::CPercentage                                 m_oSy;

		};
		
        
        
		class CRelativeOffsetEffect : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CRelativeOffsetEffect)
			CRelativeOffsetEffect()
			{
			}
			virtual ~CRelativeOffsetEffect()
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
				CString sResult = _T("<a:relOff tx=\"") + m_oTx.ToString() + _T("\" ty=\"") + m_oTy.ToString() + _T("\"/>");
				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_relOff;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				m_oTx.SetValue( 0 );
				m_oTy.SetValue( 0 );

				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("tx"), m_oTx )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("ty"), m_oTy )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			
			SimpleTypes::CPercentage m_oTx;
			SimpleTypes::CPercentage m_oTy;

		};
		
        
        
		class CLineJoinRound : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CLineJoinRound)
			CLineJoinRound()
			{
			}
			virtual ~CLineJoinRound()
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
				return _T("<a:round/>");
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_round;
			}
		};
		
        
        
		class CSoftEdgesEffect : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CSoftEdgesEffect)
			CSoftEdgesEffect()
			{
			}
			virtual ~CSoftEdgesEffect()
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
				CString sResult = _T("<a:softEdge rad=\"") + m_oRad.ToString() + _T("\"/>");
				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_softEdge;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_ReadSingle( oReader, _T("rad"), m_oRad )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			
			SimpleTypes::CPositiveCoordinate<> m_oRad;

		};
        
        
        
		class CSolidColorFillProperties : public OOX::Drawing::CColor
		{
		public:
			WritingElement_AdditionConstructors(CSolidColorFillProperties)
			CSolidColorFillProperties()
			{
			}
			virtual ~CSolidColorFillProperties()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				CColor::fromXML( oNode );
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				CColor::fromXML( oReader );
			}

			virtual CString      toXML() const
			{
				CString sResult = _T("<a:solidFill>");

				sResult += CColor::toXML();

				sResult += _T("</a:solidFill>");
				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_solidFill;
			}

		};

		
        
        
		class CStretchInfoProperties : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CStretchInfoProperties)
			CStretchInfoProperties()
			{
			}
			virtual ~CStretchInfoProperties()
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
					if ( _T("a:fillRect") == sName )
						m_oFillRect = oReader;
				}
			}

			virtual CString      toXML() const
			{
				CString sResult = _T("<a:stretch>");

				if ( m_oFillRect.IsInit() )
					sResult += m_oFillRect->toXML();

				sResult += _T("</a:stretch>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_stretch;
			}

		public:

			
			nullable<CRelativeRect> m_oFillRect;

		};
        
        
        
        class CTileInfoProperties : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CTileInfoProperties)
			CTileInfoProperties()
			{
			}
			virtual ~CTileInfoProperties()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("algn"), m_oAlgn );
				oNode.ReadAttributeBase( _T("flip"), m_oFlip );
				oNode.ReadAttributeBase( _T("sx"),   m_oSx );
				oNode.ReadAttributeBase( _T("sy"),   m_oSy );
				oNode.ReadAttributeBase( _T("tx"),   m_oTx );
				oNode.ReadAttributeBase( _T("ty"),   m_oTy );
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}

			virtual CString      toXML() const
			{
				CString sResult = _T("<a:tile ");
				
				if ( m_oAlgn.IsInit() )
				{
					sResult += _T("algn=\"");
					sResult += m_oAlgn->ToString();
					sResult += _T("\" ");
				}

				if ( m_oFlip.IsInit() )
				{
					sResult += _T("flip=\"");
					sResult += m_oFlip->ToString();
					sResult += _T("\" ");
				}

				if ( m_oSx.IsInit() )
				{
					sResult += _T("sx=\"");
					sResult += m_oSx->ToString();
					sResult += _T("\" ");
				}

				if ( m_oSy.IsInit() )
				{
					sResult += _T("sy=\"");
					sResult += m_oSy->ToString();
					sResult += _T("\" ");
				}

				if ( m_oTx.IsInit() )
				{
					sResult += _T("tx=\"");
					sResult += m_oTx->ToString();
					sResult += _T("\" ");
				}

				if ( m_oTy.IsInit() )
				{
					sResult += _T("ty=\"");
					sResult += m_oTy->ToString();
					sResult += _T("\" ");
				}

				sResult += _T("/>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_tile;
			}



		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     (oReader, _T("algn"), m_oAlgn )
				WritingElement_ReadAttributes_Read_else_if(oReader, _T("flip"), m_oFlip )
				WritingElement_ReadAttributes_Read_else_if(oReader, _T("sx"),   m_oSx )
				WritingElement_ReadAttributes_Read_else_if(oReader, _T("sy"),   m_oSy )
				WritingElement_ReadAttributes_Read_else_if(oReader, _T("tx"),   m_oTx )
				WritingElement_ReadAttributes_Read_else_if(oReader, _T("ty"),   m_oTy )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			
			nullable<SimpleTypes::CRectAlignment<>> m_oAlgn;
			nullable<SimpleTypes::CTileFlipMode<> > m_oFlip;
			nullable<SimpleTypes::CPercentage     > m_oSx;
			nullable<SimpleTypes::CPercentage     > m_oSy;
			nullable<SimpleTypes::CCoordinate     > m_oTx;
			nullable<SimpleTypes::CCoordinate     > m_oTy;

		};
		
        
        
        class CTintEffect : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CTintEffect)
			CTintEffect()
			{
			}
			virtual ~CTintEffect()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("amt"), m_oAmt );
				oNode.ReadAttributeBase( _T("hue"), m_oHue );
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}

			virtual CString      toXML() const
			{
				CString sResult = _T("<a:tint amt=\"") + m_oAmt.ToString() + _T("\" hue=\"") + m_oHue.ToString() + _T("\">");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return OOX::et_a_tint;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     (oReader, _T("amt"), m_oAmt )
				WritingElement_ReadAttributes_Read_else_if(oReader, _T("hue"), m_oHue )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			SimpleTypes::CFixedPercentage       m_oAmt;
			SimpleTypes::CPositiveFixedAngle<0> m_oHue;

		};
		
        
        
		class CTransformEffect : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CTransformEffect)
			CTransformEffect()
			{
			}
			virtual ~CTransformEffect()
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
				CString sResult = _T("<a:xfrm sx=\"") + m_oSx.ToString() 
									 + _T("\" sy=\"") + m_oSy.ToString() 
									 + _T("\" kx=\"") + m_oKx.ToString() 
									 + _T("\" ky=\"") + m_oKy.ToString() 
									 + _T("\" tx=\"") + m_oTx.ToString() 
									 + _T("\" ty=\"") + m_oTy.ToString() 
									 + _T("\"/>");
				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_xfrm;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				m_oTx.SetValue( 0 );
				m_oTy.SetValue( 0 );
				m_oSx.SetValue( 100 );
				m_oSy.SetValue( 100 );

				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("sx"), m_oSx )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("sy"), m_oSy )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("kx"), m_oKx )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("ky"), m_oKy )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("tx"), m_oTx )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("ty"), m_oTy )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			
			SimpleTypes::CFixedAngle<0> m_oKx;
			SimpleTypes::CFixedAngle<0> m_oKy;
			SimpleTypes::CPercentage    m_oSx;
			SimpleTypes::CPercentage    m_oSy;
			SimpleTypes::CCoordinate    m_oTx;
			SimpleTypes::CCoordinate    m_oTy;

		};
	} 
} 


namespace OOX
{
	namespace Drawing
	{
		
        
        
		enum EFillType
		{
			filltypeUnknown  = 0,
			filltypeBlip     = 1,
			filltypeGradient = 2,
			filltypeGroup    = 3,
			filltypeNo       = 4,
			filltypePattern  = 5,
			filltypeSolid    = 6
		};

		class CFillEffect : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CFillEffect)
			CFillEffect()
			{
			}
			virtual ~CFillEffect()
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
					if ( _T("a:blipFill") == sName )
					{
						m_oBlipFill = oReader;
						m_eFillType = filltypeBlip;
					}
					else if ( _T("a:gradFill") == sName )
					{
						m_oGradFill = oReader;
						m_eFillType = filltypeGradient;
					}
					else if ( _T("a:grpFill") == sName )
					{
						m_oGrpFill  = oReader;
						m_eFillType = filltypeGroup;
					}
					else if ( _T("a:noFill") == sName )
					{
						m_oNoFill   = oReader;
						m_eFillType = filltypeNo;
					}
					else if ( _T("a:pattFill") == sName )
					{
						m_oPattFill = oReader;
						m_eFillType = filltypePattern;
					}
					else if ( _T("a:solidFill") == sName )
					{
						m_oSolidFill = oReader;
						m_eFillType  = filltypeSolid;
					}
				}
			}

			virtual CString      toXML() const
			{
				CString sResult = _T("<a:fill>");

				switch ( m_eFillType )
				{
				case filltypeBlip:     sResult += m_oBlipFill.toXML();  break;
				case filltypeGradient: sResult += m_oGradFill.toXML();  break;
				case filltypeGroup:    sResult += m_oGrpFill.toXML();   break;
				case filltypeNo:       sResult += m_oNoFill.toXML();    break;
				case filltypePattern:  sResult += m_oPattFill.toXML();  break;
				case filltypeSolid:    sResult += m_oSolidFill.toXML(); break;
				}

				sResult += _T("</a:fill>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_fill;
			}

		public:

			EFillType GetFillType() const
			{
				return m_eFillType;
			}

		public:

			EFillType m_eFillType;

			
			OOX::Drawing::CBlipFillProperties       m_oBlipFill;
			OOX::Drawing::CGradientFillProperties   m_oGradFill;
			OOX::Drawing::CGroupFillProperties      m_oGrpFill;
			OOX::Drawing::CNoFillProperties         m_oNoFill;
			OOX::Drawing::CPatternFillProperties    m_oPattFill;
			OOX::Drawing::CSolidColorFillProperties m_oSolidFill;
		};
		
        
        
		class CFillOverlayEffect : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CFillOverlayEffect)
			CFillOverlayEffect()
			{
			}
			virtual ~CFillOverlayEffect()
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
					if ( _T("a:blipFill") == sName )
					{
						m_oBlipFill = oReader;
						m_eFillType = filltypeBlip;
					}
					else if ( _T("a:gradFill") == sName )
					{
						m_oGradFill = oReader;
						m_eFillType = filltypeGradient;
					}
					else if ( _T("a:grpFill") == sName )
					{
						m_oGrpFill  = oReader;
						m_eFillType = filltypeGroup;
					}
					else if ( _T("a:noFill") == sName )
					{
						m_oNoFill   = oReader;
						m_eFillType = filltypeNo;
					}
					else if ( _T("a:pattFill") == sName )
					{
						m_oPattFill = oReader;
						m_eFillType = filltypePattern;
					}
					else if ( _T("a:solidFill") == sName )
					{
						m_oSolidFill = oReader;
						m_eFillType  = filltypeSolid;
					}
				}
			}

			virtual CString      toXML() const
			{
				CString sResult = _T("<a:fillOverlay blend=\"") + m_oBlend.ToString() + _T("\">");

				switch ( m_eFillType )
				{
				case filltypeBlip:     sResult += m_oBlipFill.toXML();  break;
				case filltypeGradient: sResult += m_oGradFill.toXML();  break;
				case filltypeGroup:    sResult += m_oGrpFill.toXML();   break;
				case filltypeNo:       sResult += m_oNoFill.toXML();    break;
				case filltypePattern:  sResult += m_oPattFill.toXML();  break;
				case filltypeSolid:    sResult += m_oSolidFill.toXML(); break;
				}

				sResult += _T("</a:fillOverlay>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_fillOverlay;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_ReadSingle( oReader, _T("blend"), m_oBlend )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			EFillType GetFillType() const
			{
				return m_eFillType;
			}

		public:

			EFillType                               m_eFillType;

			
			SimpleTypes::CBlendMode<>               m_oBlend;

			
			OOX::Drawing::CBlipFillProperties       m_oBlipFill;
			OOX::Drawing::CGradientFillProperties   m_oGradFill;
			OOX::Drawing::CGroupFillProperties      m_oGrpFill;
			OOX::Drawing::CNoFillProperties         m_oNoFill;
			OOX::Drawing::CPatternFillProperties    m_oPattFill;
			OOX::Drawing::CSolidColorFillProperties m_oSolidFill;
		};
	} 
} 

#endif // OOX_LOGIC_DRAWING_EFFECTS_INCLUDE_H_