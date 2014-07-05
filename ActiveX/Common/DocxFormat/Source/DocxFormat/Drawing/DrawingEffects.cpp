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
 #include "DrawingEffects.h"

namespace OOX
{
	namespace Drawing
	{
		
		
		
		CBlip::CBlip(const CBlip& oOther)
		{
			Clear();

			m_oCState = oOther.m_oCState;
			m_oEmbed  = oOther.m_oEmbed;
			m_oLink   = oOther.m_oLink;
			m_oExtLst = oOther.m_oExtLst;

			for ( int nIndex = 0; nIndex < oOther.m_arrEffects.GetSize(); nIndex++ )
			{
				OOX::EElementType eType = oOther.m_arrEffects[nIndex]->getType();

				WritingElement *pEffect = NULL;
				switch ( eType )
				{

				case et_a_alphaBiLevel: pEffect = new CAlphaBiLevelEffect      ( (const CAlphaBiLevelEffect&) *oOther.m_arrEffects[nIndex] ); break;
				case et_a_alphaCeiling: pEffect = new CAlphaCeilingEffect      ( (const CAlphaCeilingEffect&) *oOther.m_arrEffects[nIndex] ); break;
				case et_a_alphaFloor:   pEffect = new CAlphaFloorEffect        ( (const CAlphaFloorEffect&) *oOther.m_arrEffects[nIndex] ); break;
				case et_a_alphaInv:     pEffect = new CAlphaInverseEffect      ( (const CAlphaInverseEffect&) *oOther.m_arrEffects[nIndex] ); break;
				case et_a_alphaMod:     pEffect = new CAlphaModulateEffect     ( (const CAlphaModulateEffect&) *oOther.m_arrEffects[nIndex] ); break;
				case et_a_alphaModFix:  pEffect = new CAlphaModulateFixedEffect( (const CAlphaModulateFixedEffect&)*oOther.m_arrEffects[nIndex] ); break;
				case et_a_alphaRepl:    pEffect = new CAlphaReplaceEffect      ( (const CAlphaReplaceEffect&) *oOther.m_arrEffects[nIndex] ); break;
				case et_a_biLevel:      pEffect = new CBiLevelEffect           ( (const CBiLevelEffect&) *oOther.m_arrEffects[nIndex] ); break;
				case et_a_blur:         pEffect = new CBlurEffect              ( (const CBlurEffect&) *oOther.m_arrEffects[nIndex] ); break;
				case et_a_clrChange:    pEffect = new CColorChangeEffect       ( (const CColorChangeEffect&) *oOther.m_arrEffects[nIndex] ); break;
				case et_a_clrRepl:      pEffect = new CColorReplaceEffect      ( (const CColorReplaceEffect&) *oOther.m_arrEffects[nIndex] ); break;
				case et_a_duotone:      pEffect = new CDuotoneEffect           ( (const CDuotoneEffect&) *oOther.m_arrEffects[nIndex] ); break;
				case et_a_fillOverlay:  pEffect = new CFillOverlayEffect       ( (const CFillOverlayEffect&) *oOther.m_arrEffects[nIndex] ); break;
				case et_a_grayscl:      pEffect = new CGrayscaleEffect         ( (const CGrayscaleEffect&) *oOther.m_arrEffects[nIndex] ); break;
				case et_a_hsl:          pEffect = new CHSLEffect               ( (const CHSLEffect&) *oOther.m_arrEffects[nIndex] ); break;
				case et_a_lum:          pEffect = new CLuminanceEffect         ( (const CLuminanceEffect&) *oOther.m_arrEffects[nIndex] ); break;
				case et_a_tint:         pEffect = new CTintEffect              ( (const CTintEffect&) *oOther.m_arrEffects[nIndex] ); break;
				}

				if ( NULL != pEffect )
					m_arrEffects.Add( pEffect );
			}
		}
		void CBlip::fromXML(XmlUtils::CXmlNode& oNode)
		{
			
		}
		void CBlip::fromXML(XmlUtils::CXmlLiteReader& oReader)
		{
			ReadAttributes( oReader );

			if ( oReader.IsEmptyNode() )
				return;

			int nCurDepth = oReader.GetDepth();
			while( oReader.ReadNextSiblingNode( nCurDepth ) )
			{
				CWCharWrapper sName = oReader.GetName();

				WritingElement *pEffect = NULL;

				wchar_t wChar = sName[2]; 
				switch(wChar)
				{
				case 'a':
					if ( _T("a:alphaBiLevel") == sName )
						pEffect = new CAlphaBiLevelEffect( oReader );
					else if ( _T("a:alphaCeiling") == sName )
						pEffect = new CAlphaCeilingEffect( oReader );
					else if ( _T("a:alphaFloor") == sName )
						pEffect = new CAlphaFloorEffect( oReader );
					else if ( _T("a:alphaInv") == sName )
						pEffect = new CAlphaInverseEffect( oReader );
					else if ( _T("a:alphaMod") == sName )
						pEffect = new CAlphaModulateEffect( oReader );
					else if ( _T("a:alphaModFix") == sName )
						pEffect = new CAlphaModulateFixedEffect( oReader );
					else if ( _T("a:alphaRepl") == sName )
						pEffect = new CAlphaReplaceEffect( oReader );

					break;

				case 'b':

					if ( _T("a:biLevel") == sName )
						pEffect = new CBiLevelEffect( oReader );
					else if ( _T("a:blur") == sName )
						pEffect = new CBlurEffect( oReader );

					break;

				case 'c':

					if ( _T("a:clrChange") == sName )
						pEffect = new CColorChangeEffect( oReader );
					else if ( _T("a:clrRepl") == sName )
						pEffect = new CColorReplaceEffect( oReader );

					break;

				case 'd':

					if ( _T("a:duotone") == sName )
						pEffect = new CDuotoneEffect( oReader );

					break;

				case 'e':

					if ( _T("a:extLst") == sName )
						m_oExtLst = oReader;

					break;

				case 'f':
					
					if ( _T("a:fillOverlay") == sName )
						pEffect = new CFillOverlayEffect( oReader );

					break;

				case 'g':

					if ( _T("a:grayscl") == sName )
						pEffect = new CGrayscaleEffect( oReader );

					break;

				case 'h':

					if ( _T("a:hsl") == sName )
						pEffect = new CHSLEffect( oReader );

					break;

				case 'l':

					if ( _T("a:lum") == sName )
						pEffect = new CLuminanceEffect( oReader );

					break;

				case 't':
					
					if ( _T("a:tint") == sName )
						pEffect = new CTintEffect( oReader );

					break;

				}

				if ( NULL != pEffect )
					m_arrEffects.Add( pEffect );
			}
		}
		CString CBlip::toXML() const
		{
			CString sResult = _T("<a:blip ");

			sResult += _T("cstate=\"") + m_oCState.ToString() + _T("\" ");
			if ( _T("") != m_oEmbed.GetValue() )
				sResult += _T("r:embed=\"") + m_oEmbed.GetValue() + _T("\" ");

			if ( _T("") != m_oLink.GetValue() )
				sResult += _T("r:link=\"") + m_oLink.GetValue() + _T("\" ");

			sResult += _T(">");

			for ( int nIndex = 0; nIndex < m_arrEffects.GetSize(); nIndex++ )
				sResult += m_arrEffects[nIndex]->toXML();

			if ( m_oExtLst.IsInit() )
				sResult += m_oExtLst->toXML();

			sResult = _T("</a:blip>");

			return sResult;
		}
		
		
		
		void CBlipFillProperties::fromXML(XmlUtils::CXmlNode& oNode)
		{
			m_eType = et_Unknown;
			
		}
		void CBlipFillProperties::fromXML(XmlUtils::CXmlLiteReader& oReader)
		{
			m_eType = et_Unknown;
			CWCharWrapper sName = oReader.GetName();
			if ( _T("a:blipFill") == sName )
				m_eType = et_a_blipFill;
			else if ( _T("pic:blipFill") == sName )
				m_eType = et_pic_blipFill;
			else
				return;

			m_eFillModeType = fillmodepropertiesUnknown;
			ReadAttributes( oReader );

			if ( oReader.IsEmptyNode() )
				return;

			int nCurDepth = oReader.GetDepth();
			while ( oReader.ReadNextSiblingNode( nCurDepth ) )
			{
				CWCharWrapper sName = oReader.GetName();
				if ( _T("a:blip") == sName )
					m_oBlip = oReader;
				else if ( _T("a:srcRect") == sName )
					m_oSrcRect = oReader;
				else if ( _T("a:stretch") == sName )
				{
					m_oStretch      = oReader;
					m_eFillModeType = fillmodepropertiesStretch;
				}
				else if ( _T("a:tile") == sName )
				{
					m_oTile         = oReader;
					m_eFillModeType = fillmodepropertiesTile;
				}
			}
		}
		CString CBlipFillProperties::toXML() const
		{
			CString sResult;

			if ( et_a_blipFill == m_eType )
				sResult = _T("<a:blipFill ");
			else if ( et_pic_blipFill == m_eType )
				sResult = _T("<pic:blipFill ");
			else
				return _T("");

			if ( m_oDpi.IsInit() )
			{
				sResult += _T("dpi=\"");
				sResult += m_oDpi->ToString();
				sResult += _T("\" ");
			}

			if ( m_oRotWithShape.IsInit() )
			{
				sResult += _T("rotWithShape=\"");
				sResult += m_oRotWithShape->ToString();
				sResult += _T("\" ");
			}

			sResult += _T(">");

			if ( m_oBlip.IsInit() )
				sResult += m_oBlip->toXML();

			if ( m_oSrcRect.IsInit() )
				sResult += m_oSrcRect->toXML();

			if ( fillmodepropertiesStretch == m_eFillModeType && m_oStretch.IsInit() )
				sResult += m_oStretch->toXML();

			if ( fillmodepropertiesTile == m_eFillModeType && m_oTile.IsInit() )
				sResult += m_oTile->toXML();

			if ( et_a_blipFill == m_eType )
				sResult += _T("</a:blipFill>");
			else if ( et_pic_blipFill == m_eType )
				sResult += _T("</pic:blipFill>");

			return sResult;
		}
        
        
        
		CEffectContainer::CEffectContainer(const CEffectContainer& oOther)
		{
			Clear();

			m_eType = oOther.m_eType;
			m_sName = oOther.m_sName;
			m_oType = oOther.m_oType;

			for ( int nIndex = 0; nIndex < oOther.m_arrEffects.GetSize(); nIndex++ )
			{
				OOX::EElementType eType = oOther.m_arrEffects[nIndex]->getType();

				WritingElement *pEffect = NULL;
				switch ( eType )
				{

				case et_a_alphaBiLevel: pEffect = new CAlphaBiLevelEffect      ( (const CAlphaBiLevelEffect&) *oOther.m_arrEffects[nIndex] ); break;
				case et_a_alphaCeiling: pEffect = new CAlphaCeilingEffect      ( (const CAlphaCeilingEffect&) *oOther.m_arrEffects[nIndex] ); break;
				case et_a_alphaFloor:   pEffect = new CAlphaFloorEffect        ( (const CAlphaFloorEffect&) *oOther.m_arrEffects[nIndex] ); break;
				case et_a_alphaInv:     pEffect = new CAlphaInverseEffect      ( (const CAlphaInverseEffect&) *oOther.m_arrEffects[nIndex] ); break;
				case et_a_alphaMod:     pEffect = new CAlphaModulateEffect     ( (const CAlphaModulateEffect&) *oOther.m_arrEffects[nIndex] ); break;
				case et_a_alphaModFix:  pEffect = new CAlphaModulateFixedEffect( (const CAlphaModulateFixedEffect&)*oOther.m_arrEffects[nIndex] ); break;
				case et_a_alphaOutset:  pEffect = new CAlphaOutsetEffect       ( (const CAlphaOutsetEffect&) *oOther.m_arrEffects[nIndex] ); break;
				case et_a_alphaRepl:    pEffect = new CAlphaReplaceEffect      ( (const CAlphaReplaceEffect&) *oOther.m_arrEffects[nIndex] ); break;
				case et_a_biLevel:      pEffect = new CBiLevelEffect           ( (const CBiLevelEffect&) *oOther.m_arrEffects[nIndex] ); break;
				case et_a_blend:        pEffect = new CBlendEffect             ( (const CBlendEffect&) *oOther.m_arrEffects[nIndex] ); break;
				case et_a_blur:         pEffect = new CBlurEffect              ( (const CBlurEffect&) *oOther.m_arrEffects[nIndex] ); break;
				case et_a_clrChange:    pEffect = new CColorChangeEffect       ( (const CColorChangeEffect&) *oOther.m_arrEffects[nIndex] ); break;
				case et_a_clrRepl:      pEffect = new CColorReplaceEffect      ( (const CColorReplaceEffect&) *oOther.m_arrEffects[nIndex] ); break;
				case et_a_cont:         pEffect = new CEffectContainer         ( (const CEffectContainer&) *oOther.m_arrEffects[nIndex] ); break;
				case et_a_duotone:      pEffect = new CDuotoneEffect           ( (const CDuotoneEffect&) *oOther.m_arrEffects[nIndex] ); break;
				case et_a_effect:       pEffect = new CEffectReference         ( (const CEffectReference&) *oOther.m_arrEffects[nIndex] ); break;
				case et_a_fill:         pEffect = new CFillEffect              ( (const CFillEffect&) *oOther.m_arrEffects[nIndex] ); break;
				case et_a_fillOverlay:  pEffect = new CFillOverlayEffect       ( (const CFillOverlayEffect&) *oOther.m_arrEffects[nIndex] ); break;
				case et_a_glow:         pEffect = new CGlowEffect              ( (const CGlowEffect&) *oOther.m_arrEffects[nIndex] ); break;
				case et_a_grayscl:      pEffect = new CGrayscaleEffect         ( (const CGrayscaleEffect&) *oOther.m_arrEffects[nIndex] ); break;
				case et_a_hsl:          pEffect = new CHSLEffect               ( (const CHSLEffect&) *oOther.m_arrEffects[nIndex] ); break;
				case et_a_innerShdw:    pEffect = new CInnerShadowEffect       ( (const CInnerShadowEffect&) *oOther.m_arrEffects[nIndex] ); break;
				case et_a_lum:          pEffect = new CLuminanceEffect         ( (const CLuminanceEffect&) *oOther.m_arrEffects[nIndex] ); break;
				case et_a_outerShdw:    pEffect = new COuterShadowEffect       ( (const COuterShadowEffect&) *oOther.m_arrEffects[nIndex] ); break;
				case et_a_prstShdw:     pEffect = new CPresetShadowEffect      ( (const CPresetShadowEffect&) *oOther.m_arrEffects[nIndex] ); break;
				case et_a_reflection:   pEffect = new CReflectionEffect        ( (const CReflectionEffect&) *oOther.m_arrEffects[nIndex] ); break;
				case et_a_relOff:       pEffect = new CRelativeOffsetEffect    ( (const CRelativeOffsetEffect&) *oOther.m_arrEffects[nIndex] ); break;
				case et_a_softEdge:     pEffect = new CSoftEdgesEffect         ( (const CSoftEdgesEffect&) *oOther.m_arrEffects[nIndex] ); break;
				case et_a_tint:         pEffect = new CTintEffect              ( (const CTintEffect&) *oOther.m_arrEffects[nIndex] ); break;
				case et_a_xfrm:         pEffect = new CTransformEffect         ( (const CTransformEffect&) *oOther.m_arrEffects[nIndex] ); break;
				}

				if ( NULL != pEffect )
					m_arrEffects.Add( pEffect );
			}
		}
		void CEffectContainer::fromXML(XmlUtils::CXmlNode& oNode)
		{
			m_eType = et_Unknown;

			
		}
		void CEffectContainer::fromXML(XmlUtils::CXmlLiteReader& oReader)
		{
			CWCharWrapper sName = oReader.GetName();
			if ( _T("a:cont") == sName )
				m_eType = et_a_cont;
			else if ( _T("a:effectDag") == sName )
				m_eType = et_a_effectDag;
			else
			{
				oReader.ReadTillEnd();
				return;
			}

			ReadAttributes( oReader );

			if ( oReader.IsEmptyNode() )
				return;

			int nCurDepth = oReader.GetDepth();
			while ( oReader.ReadNextSiblingNode( nCurDepth ) )
			{
				sName = oReader.GetName();
				wchar_t wChar = sName[2]; 

				WritingElement* pEffect = NULL;

				switch(wChar)
				{
				case 'a':

					if ( _T("a:alphaBiLevel") == sName )
						pEffect = new CAlphaBiLevelEffect( oReader );
					else if ( _T("a:alphaCeiling") == sName )
						pEffect = new CAlphaCeilingEffect( oReader );
					else if ( _T("a:alphaFloor") == sName )
						pEffect = new CAlphaFloorEffect( oReader );
					else if ( _T("a:alphaInv") == sName )
						pEffect = new CAlphaInverseEffect( oReader );
					else if ( _T("a:alphaMod") == sName )
						pEffect = new CAlphaModulateEffect( oReader );
					else if ( _T("a:alphaModFix") == sName )
						pEffect = new CAlphaModulateFixedEffect( oReader );
					else if ( _T("a:alphaOutset") == sName )
						pEffect = new CAlphaOutsetEffect( oReader );
					else if ( _T("a:alphaRepl") == sName )
						pEffect = new CAlphaReplaceEffect( oReader );

					break;

				case 'b':

					if ( _T("a:biLevel") == sName )
						pEffect = new CBiLevelEffect( oReader );
					else if ( _T("a:blend") == sName )
						pEffect = new CBlendEffect( oReader );
					else if ( _T("a:blur") == sName )
						pEffect = new CBlurEffect( oReader );

					break;

				case 'c':

					if ( _T("a:clrChange") == sName )
						pEffect = new CColorChangeEffect( oReader );
					else if ( _T("a:clrRepl") == sName )
						pEffect = new CColorReplaceEffect( oReader );
					else if ( _T("a:cont") == sName )
						pEffect = new CEffectContainer( oReader );

					break;

				case 'd':

					if ( _T("a:duotone") == sName )
						pEffect = new CDuotoneEffect( oReader );

					break;

				case 'e':

					if ( _T("a:effect") == sName )
						pEffect = new CEffectReference( oReader );

					break;

				case 'f':

					if ( _T("a:fill") == sName )
						pEffect = new CFillEffect( oReader );
					else if ( _T("a:fillOverlay") == sName )
						pEffect = new CFillOverlayEffect( oReader );

					break;

				case 'g':

					if ( _T("a:glow") == sName )
						pEffect = new CGlowEffect( oReader );
					else if ( _T("a:grayscl") == sName )
						pEffect = new CGrayscaleEffect( oReader );

					break;

				case 'h':

					if ( _T("a:hsl") == sName )
						pEffect = new CHSLEffect( oReader );

					break;

				case 'i':

					if ( _T("a:innerShdw") == sName )
						pEffect = new CInnerShadowEffect( oReader );

					break;

				case 'l':

					if ( _T("a:lum") == sName )
						pEffect = new CLuminanceEffect( oReader );

					break;

				case 'o':

					if ( _T("a:outerShdw") == sName )
						pEffect = new COuterShadowEffect( oReader );

					break;

				case 'p':

					if ( _T("a:prstShdw") == sName )
						pEffect = new CPresetShadowEffect( oReader );

					break;

				case 'r':

					if ( _T("a:reflection") == sName )
						pEffect = new CReflectionEffect( oReader );
					else if ( _T("a:relOff") == sName )
						pEffect = new CRelativeOffsetEffect( oReader );

					break;

				case 's':

					if ( _T("a:softEdge") == sName )
						pEffect = new CSoftEdgesEffect( oReader );

					break;

				case 't':

					if ( _T("a:tint") == sName )
						pEffect = new CTintEffect( oReader );

					break;

				case 'x':

					if ( _T("a:xfrm") == sName )
						pEffect = new CTransformEffect( oReader );

					break;
				}

				if ( NULL != pEffect )
					m_arrEffects.Add( pEffect );
			}
		}

		CString CEffectContainer::toXML() const
		{
			CString sResult;

			if ( et_a_cont == m_eType )
				sResult = _T("<a:cont ");
			else if ( et_a_effectDag == m_eType )
				sResult = _T("<a:effectDag ");
			else
				return _T("");

			if ( m_sName.IsInit() )
			{
				sResult += _T("name=\"");
				sResult += m_sName->GetString();
				sResult += _T("\" ");
			}

			sResult += _T("type=\"") + m_oType.ToString() + _T("\">");

			for ( int nIndex = 0; nIndex < m_arrEffects.GetSize(); nIndex++ )
				sResult += m_arrEffects[nIndex]->toXML();

			if ( et_a_cont == m_eType )
				sResult += _T("</a:cont>");
			else if ( et_a_effectDag == m_eType )
				sResult = _T("</a:effectDag>");

			return sResult;
		}

        
        
        
		CEffectList::CEffectList(const CEffectList& oOther)
		{
			Clear();

			for ( int nIndex = 0; nIndex < oOther.m_arrEffects.GetSize(); nIndex++ )
			{
				OOX::EElementType eType = oOther.m_arrEffects[nIndex]->getType();

				WritingElement *pEffect = NULL;
				switch ( eType )
				{
				case et_a_blur:        pEffect = new CBlurEffect        ( (const CBlurEffect&)        *oOther.m_arrEffects[nIndex] ); break;
				case et_a_fillOverlay: pEffect = new CFillOverlayEffect ( (const CFillOverlayEffect&) *oOther.m_arrEffects[nIndex] ); break;
				case et_a_glow:        pEffect = new CGlowEffect        ( (const CGlowEffect&)        *oOther.m_arrEffects[nIndex] ); break;
				case et_a_innerShdw:   pEffect = new CInnerShadowEffect ( (const CInnerShadowEffect&) *oOther.m_arrEffects[nIndex] ); break;
				case et_a_outerShdw:   pEffect = new COuterShadowEffect ( (const COuterShadowEffect&) *oOther.m_arrEffects[nIndex] ); break;
				case et_a_prstShdw:    pEffect = new CPresetShadowEffect( (const CPresetShadowEffect&)*oOther.m_arrEffects[nIndex] ); break;
				case et_a_reflection:  pEffect = new CReflectionEffect  ( (const CReflectionEffect&)  *oOther.m_arrEffects[nIndex] ); break;
				case et_a_softEdge:    pEffect = new CSoftEdgesEffect   ( (const CSoftEdgesEffect&)   *oOther.m_arrEffects[nIndex] ); break;
				}

				if ( NULL != pEffect )
					m_arrEffects.Add( pEffect );
			}
		}
		void CEffectList::fromXML(XmlUtils::CXmlNode& oNode)
		{
			
		}
		void CEffectList::fromXML(XmlUtils::CXmlLiteReader& oReader)
		{
			if ( oReader.IsEmptyNode() )
				return;

			int nCurDepth = oReader.GetDepth();
			while ( oReader.ReadNextSiblingNode( nCurDepth ) )
			{
				CWCharWrapper sName = oReader.GetName();
				wchar_t wChar = sName[2]; 

				WritingElement* pEffect = NULL;

				switch(wChar)
				{
				case 'b':

					if ( _T("a:blur") == sName )
						pEffect = new CBlurEffect( oReader );

					break;

				case 'f':

					if ( _T("a:fillOverlay") == sName )
						pEffect = new CFillOverlayEffect( oReader );

					break;

				case 'g':

					if ( _T("a:glow") == sName )
						pEffect = new CGlowEffect( oReader );

					break;

				case 'i':

					if ( _T("a:innerShdw") == sName )
						pEffect = new CInnerShadowEffect( oReader );

					break;

				case 'o':

					if ( _T("a:outerShdw") == sName )
						pEffect = new COuterShadowEffect( oReader );

					break;

				case 'p':

					if ( _T("a:prstShdw") == sName )
						pEffect = new CPresetShadowEffect( oReader );

					break;

				case 'r':

					if ( _T("a:reflection") == sName )
						pEffect = new CReflectionEffect( oReader );

					break;

				case 's':

					if ( _T("a:softEdge") == sName )
						pEffect = new CSoftEdgesEffect( oReader );

					break;
				}

				if ( NULL != pEffect )
					m_arrEffects.Add( pEffect );
			}
		}

		CString CEffectList::toXML() const
		{
			CString sResult = _T("<a:effectLst>");

			for ( int nIndex = 0; nIndex < m_arrEffects.GetSize(); nIndex++ )
				sResult += m_arrEffects[nIndex]->toXML();

			sResult += _T("</a:effectLst>");

			return sResult;
		}

		
        
        
		void CGradientFillProperties::fromXML(XmlUtils::CXmlNode& oNode)
		{
			m_eGradType = gradfilltypeUnknown;
			
		}
		void CGradientFillProperties::fromXML(XmlUtils::CXmlLiteReader& oReader)
		{
			m_eGradType = gradfilltypeUnknown;

			ReadAttributes( oReader );

			if ( oReader.IsEmptyNode() )
				return;

			int nCurDepth = oReader.GetDepth();
			while ( oReader.ReadNextSiblingNode( nCurDepth ) )
			{
				CWCharWrapper sName = oReader.GetName();
				if ( _T("a:gsLst") == sName )
					m_oGsLst = oReader;
				else if ( _T("a:lin") == sName )
				{
					m_oLin = oReader;
					m_eGradType = gradfilltypeLinear;
				}
				else if ( _T("a:path") == sName )
				{
					m_oPath = oReader;
					m_eGradType = gradfilltypePath;
				}
				else if ( _T("a:tileRect") == sName )
					m_oTileRect = oReader;
			}
		}
		CString CGradientFillProperties::toXML() const
		{
			CString sResult = _T("<a:gradFill ");

			if ( m_oFlip.IsInit() )
			{
				sResult += _T("flip=\"");
				sResult += m_oFlip->ToString();
				sResult += _T("\" ");
			}

			if ( m_oRotWithShape.IsInit() )
			{
				sResult += _T("rotWithShape=\"");
				sResult += m_oRotWithShape->ToString();
				sResult += _T("\" ");
			}

			sResult += _T(">");

			if ( m_oGsLst.IsInit() )
				sResult += m_oGsLst->toXML();

			if ( m_oLin.IsInit() && gradfilltypeLinear == m_eGradType )
				sResult += m_oLin->toXML();

			if ( m_oPath.IsInit() && gradfilltypePath == m_eGradType )
				sResult += m_oPath->toXML();

			if ( m_oTileRect.IsInit() )
				sResult += m_oTileRect->toXML();

			sResult += _T("</a:gradFill>");

			return sResult;
		}

	} 
} // OOX