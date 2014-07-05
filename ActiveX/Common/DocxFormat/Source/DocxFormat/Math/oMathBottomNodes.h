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
#include "../WritingElement.h"
#include "../../Common/SimpleTypes_Shared.h"
#include "../../Common/SimpleTypes_OMath.h"

namespace OOX
{	
	namespace Logic
	{		
		
		
		
		template <typename TMathBottomType>
		class CMathBottomNodes : public WritingElement
		{		
		public:
			WritingElement_AdditionConstructors(CMathBottomNodes)
			CMathBottomNodes()
			{				
			}
			virtual ~CMathBottomNodes()
			{
			}
		public:
			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				sNodeName = oNode.GetName();
				if ( _T("m:aln") == sNodeName )
					eType = et_m_aln;
				else if ( _T("m:alnScr") == sNodeName )
					eType = et_m_alnScr;
				else if ( _T("m:argSz") == sNodeName )
					eType = et_m_argSz;
				else if ( _T("m:baseJc") == sNodeName )
					eType = et_m_baseJc;
				else if ( _T("m:begChr") == sNodeName )
					eType = et_m_begChr;
				else if ( _T("m:cGp") == sNodeName )
					eType = et_m_cGp;
				else if ( _T("m:cGpRule") == sNodeName )
					eType = et_m_cGpRule;
				else if ( _T("m:chr") == sNodeName )
					eType = et_m_chr;
				else if ( _T("m:count") == sNodeName )
					eType = et_m_count;
				else if ( _T("m:cSp") == sNodeName )
					eType = et_m_cSp;
				else if ( _T("m:degHide") == sNodeName )
					eType = et_m_degHide;
				else if ( _T("m:diff") == sNodeName )
					eType = et_m_diff;
				else if ( _T("m:endChr") == sNodeName )
					eType = et_m_endChr;
				else if ( _T("m:grow") == sNodeName )
					eType = et_m_grow;
				else if ( _T("m:hideBot") == sNodeName )
					eType = et_m_hideBot;
				else if ( _T("m:hideLeft") == sNodeName )
					eType = et_m_hideLeft;
				else if ( _T("m:hideRight") == sNodeName )
					eType = et_m_hideRight;
				else if ( _T("m:hideTop") == sNodeName )
					eType = et_m_hideTop;
				else if ( _T("m:jc") == sNodeName )
					eType = et_m_jc;
				else if ( _T("m:limLoc") == sNodeName )
					eType = et_m_limLoc;
				else if ( _T("m:lit") == sNodeName )
					eType = et_m_lit;
				else if ( _T("m:maxDist") == sNodeName )
					eType = et_m_maxDist;
				else if ( _T("m:mcJc") == sNodeName )
					eType = et_m_mcJc;
				else if ( _T("m:noBreak") == sNodeName )
					eType = et_m_noBreak;
				else if ( _T("m:nor") == sNodeName )
					eType = et_m_nor;
				else if ( _T("m:objDist") == sNodeName )
					eType = et_m_objDist;
				else if ( _T("m:opEmu") == sNodeName )
					eType = et_m_opEmu;
				else if ( _T("m:plcHide") == sNodeName )
					eType = et_m_plcHide;
				else if ( _T("m:pos") == sNodeName )
					eType = et_m_pos;
				else if ( _T("m:rSp") == sNodeName )
					eType = et_m_rSp;
				else if ( _T("m:rSpRule") == sNodeName )
					eType = et_m_rSpRule;
				else if ( _T("m:scr") == sNodeName )
					eType = et_m_scr;
				else if ( _T("m:sepChr") == sNodeName )
					eType = et_m_sepChr;
				else if ( _T("m:show") == sNodeName )
					eType = et_m_show;
				else if ( _T("m:shp") == sNodeName )
					eType = et_m_shp;
				else if ( _T("m:strikeBLTR") == sNodeName )
					eType = et_m_strikeBLTR;
				else if ( _T("m:strikeH") == sNodeName )
					eType = et_m_strikeH;
				else if ( _T("m:strikeTLBR") == sNodeName )
					eType = et_m_strikeTLBR;
				else if ( _T("m:strikeV") == sNodeName )
					eType = et_m_strikeV;
				else if ( _T("m:sty") == sNodeName )
					eType = et_m_sty;
				else if ( _T("m:subHide") == sNodeName )
					eType = et_m_subHide;
				else if ( _T("m:supHide") == sNodeName )
					eType = et_m_supHide;
				else if ( _T("m:transp") == sNodeName )
					eType = et_m_transp;
				else if ( _T("m:type") == sNodeName )
					eType = et_m_type;
				else if ( _T("m:vertJc") == sNodeName )
					eType = et_m_vertJc;
				else if ( _T("m:zeroAsc") == sNodeName )
					eType = et_m_zeroAsc;
				else if ( _T("m:zeroDesc") == sNodeName )
					eType = et_m_zeroDesc;
				else if ( _T("m:zeroWid") == sNodeName )
					eType = et_m_zeroWid;

				oNode.ReadAttributeBase( _T("m:val"), m_val );
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader) 
			{
				CString sName = oReader.GetName();
				if ( _T("m:brkBin") == sName )
					eType = et_m_brkBin;
				else if ( _T("m:brkBinSub") == sName )
					eType = et_m_brkBinSub;
				else if ( _T("m:defJc") == sName )
					eType = et_m_defJc;
				else if ( _T("m:dispDef") == sName )
					eType = et_m_dispDef;
				else if ( _T("m:interSp") == sName )
					eType = et_m_interSp;
				else if ( _T("m:intLim") == sName )
					eType = et_m_intLim;
				else if ( _T("m:intraSp") == sName )
					eType = et_m_intraSp;				
				else if ( _T("m:lMargin") == sName )
					eType = et_m_lMargin;				
				else if ( _T("m:naryLim") == sName )
					eType = et_m_naryLim;
				else if ( _T("m:postSp") == sName )
					eType = et_m_postSp;
				else if ( _T("m:preSp") == sName )
					eType = et_m_preSp;
				else if ( _T("m:rMargin") == sName )
					eType = et_m_rMargin;
				else if ( _T("m:smallFrac") == sName )
					eType = et_m_smallFrac;
				else if ( _T("m:wrapIndent") == sName )
					eType = et_m_wrapIndent;
				else if ( _T("m:wrapRight") == sName )
					eType = et_m_wrapRight;

				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<") + sNodeName + _T(" m:val=\"");
				sResult +=  m_val->ToString();
				sResult +=  _T("\" />");
				return sResult;
			}

			virtual EElementType getType() const
			{
				return eType;
			}
		private:
			EElementType eType;	
			CString sNodeName;

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_ReadSingle( oReader, _T("m:val"), m_val )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:
			nullable<TMathBottomType> m_val;			
		};

		typedef	CMathBottomNodes<SimpleTypes::COnOff<>> CAln;
		typedef CMathBottomNodes<SimpleTypes::COnOff<>> CAlnScr;
		typedef CMathBottomNodes<SimpleTypes::CInteger2<>> CArgSz;
		typedef CMathBottomNodes<SimpleTypes::CYAlign<>> CBaseJc;
		typedef CMathBottomNodes<SimpleTypes::CMChar> CBegChr;
		typedef CMathBottomNodes<SimpleTypes::CBreakBin<>> CBrkBin;
		typedef CMathBottomNodes<SimpleTypes::CBreakBinSub<>> CBrkBinSub;
		typedef CMathBottomNodes<SimpleTypes::CUnSignedInteger<>> CCGp;
		typedef CMathBottomNodes<SimpleTypes::CSpacingRule<>> CCGpRule;
		typedef CMathBottomNodes<SimpleTypes::CMChar> CChr;
		typedef CMathBottomNodes<SimpleTypes::CInteger255<>> CCount;
		typedef CMathBottomNodes<SimpleTypes::CUnSignedInteger<>> CCSp;
		typedef CMathBottomNodes<SimpleTypes::CMJc<>> CDefJc;
		typedef CMathBottomNodes<SimpleTypes::COnOff<>> CDegHide;
		typedef CMathBottomNodes<SimpleTypes::COnOff<>> CDiff;
		typedef CMathBottomNodes<SimpleTypes::COnOff<>> CDispDef;
		typedef CMathBottomNodes<SimpleTypes::CMChar> CEndChr;
		typedef CMathBottomNodes<SimpleTypes::COnOff<>> CGrow;
		typedef CMathBottomNodes<SimpleTypes::COnOff<>> CHideBot;
		typedef CMathBottomNodes<SimpleTypes::COnOff<>> CHideLeft;
		typedef CMathBottomNodes<SimpleTypes::COnOff<>> CHideRight;
		typedef CMathBottomNodes<SimpleTypes::COnOff<>> CHideTop;
		typedef CMathBottomNodes<SimpleTypes::CTwipsMeasure> CInterSp;
		typedef CMathBottomNodes<SimpleTypes::CLimLoc<>> CIntLim;
		typedef CMathBottomNodes<SimpleTypes::CTwipsMeasure> CIntraSp;
		typedef CMathBottomNodes<SimpleTypes::CMJc<>> CMJc;
		typedef CMathBottomNodes<SimpleTypes::CLimLoc<>> CLimLoc;
		typedef CMathBottomNodes<SimpleTypes::COnOff<>> CLit;
		typedef CMathBottomNodes<SimpleTypes::CTwipsMeasure> CLMargin;
		typedef CMathBottomNodes<SimpleTypes::COnOff<>> CMaxDist;
		typedef CMathBottomNodes<SimpleTypes::CXAlign<>> CMcJc;
		typedef CMathBottomNodes<SimpleTypes::CLimLoc<>> CNaryLim;
		typedef CMathBottomNodes<SimpleTypes::COnOff<>> CNoBreak;
		typedef CMathBottomNodes<SimpleTypes::COnOff<>> CNor;
		typedef CMathBottomNodes<SimpleTypes::COnOff<>> CObjDist;
		typedef CMathBottomNodes<SimpleTypes::COnOff<>> COpEmu;
		typedef CMathBottomNodes<SimpleTypes::COnOff<>> CPlcHide;
		typedef CMathBottomNodes<SimpleTypes::CTopBot<>> CPos;
		typedef CMathBottomNodes<SimpleTypes::CTwipsMeasure> CPostSp;
		typedef CMathBottomNodes<SimpleTypes::CTwipsMeasure> CPreSp;
		typedef CMathBottomNodes<SimpleTypes::CTwipsMeasure> CRMargin;
		typedef CMathBottomNodes<SimpleTypes::CUnSignedInteger<>> CRSp;
		typedef CMathBottomNodes<SimpleTypes::CSpacingRule<>> CRSpRule;
		typedef CMathBottomNodes<SimpleTypes::CScript<>> CScr;
		typedef CMathBottomNodes<SimpleTypes::CMChar> CSepChr;
		typedef CMathBottomNodes<SimpleTypes::COnOff<>> CShow;
		typedef CMathBottomNodes<SimpleTypes::CShp<>> CShp;
		typedef CMathBottomNodes<SimpleTypes::COnOff<>> CSmallFrac;
		typedef CMathBottomNodes<SimpleTypes::COnOff<>> CStrikeBLTR;
		typedef CMathBottomNodes<SimpleTypes::COnOff<>> CStrikeH;
		typedef CMathBottomNodes<SimpleTypes::COnOff<>> CStrikeTLBR;
		typedef CMathBottomNodes<SimpleTypes::COnOff<>> CStrikeV;
		typedef CMathBottomNodes<SimpleTypes::CStyle<>> CSty;
		typedef CMathBottomNodes<SimpleTypes::COnOff<>> CSubHide;
		typedef CMathBottomNodes<SimpleTypes::COnOff<>> CSupHide;
		typedef CMathBottomNodes<SimpleTypes::COnOff<>> CTransp;
		typedef CMathBottomNodes<SimpleTypes::CFType<>> CType;
		typedef CMathBottomNodes<SimpleTypes::CTopBot<>> CVertJc;
		typedef CMathBottomNodes<SimpleTypes::CTwipsMeasure> CWrapIndent;
		typedef CMathBottomNodes<SimpleTypes::COnOff<>> CWrapRight;
		typedef CMathBottomNodes<SimpleTypes::COnOff<>> CZeroAsc;
		typedef CMathBottomNodes<SimpleTypes::COnOff<>> CZeroDesc;
		typedef CMathBottomNodes<SimpleTypes::COnOff<>> CZeroWid;

	}
}//OOX