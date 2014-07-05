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
#ifndef OOX_LOGIC_DRAWING_CORE_INFO_INCLUDE_H_
#define OOX_LOGIC_DRAWING_CORE_INFO_INCLUDE_H_

#include "../../Base/Nullable.h"
#include "../../Common/SimpleTypes_Drawing.h"
#include "../../Common/SimpleTypes_Shared.h"

#include "../WritingElement.h"
#include "../RId.h"

#include "DrawingExt.h"
#include "DrawingShape.h"
#include "DrawingTransform.h"
#include "DrawingEffects.h"
#include "DrawingStyles2.h"

namespace OOX
{
	namespace Drawing
	{
		
		
		
		class CPictureLocking;
		class CNonVisualPictureProperties : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CNonVisualPictureProperties)
			CNonVisualPictureProperties()
			{
				m_eType = et_Unknown;
			}
			virtual ~CNonVisualPictureProperties()
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
				WritingElement_ReadAttributes_ReadSingle( oReader, _T("preferRelativeResize"), m_oPreferRelativeResize )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			EElementType      m_eType;

			
			SimpleTypes::COnOff<SimpleTypes::onoffTrue> m_oPreferRelativeResize;

			
			nullable<OOX::Drawing::COfficeArtExtensionList> m_oExtLst;
			nullable<OOX::Drawing::CPictureLocking>         m_oPicLocks;
		};
		
		
		
		class CHyperlink;
		class CNonVisualDrawingProps : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CNonVisualDrawingProps)
			CNonVisualDrawingProps()
			{
				m_eType = et_Unknown;
			}
			virtual ~CNonVisualDrawingProps()
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
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("descr"),  m_sDescr )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("hidden"), m_oHidden )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("id"),     m_oId )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("name"),   m_sName )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("title"),  m_sTitle )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			EElementType m_eType;

			
			nullable<CString>                               m_sDescr;
			nullable<SimpleTypes::COnOff<>>                 m_oHidden;
			nullable<SimpleTypes::CDrawingElementId<>>      m_oId;
			nullable<CString>                               m_sName;
			nullable<CString>                               m_sTitle;

			
			nullable<OOX::Drawing::COfficeArtExtensionList> m_oExtLst;
			nullable<OOX::Drawing::CHyperlink             > m_oHlinkClick;
			nullable<OOX::Drawing::CHyperlink             > m_oHlinkHover;
		};
		
		
		
		class CGraphicalObjectFrameLocking : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CGraphicalObjectFrameLocking)
			CGraphicalObjectFrameLocking()
			{
			}
			virtual ~CGraphicalObjectFrameLocking()
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
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<a:graphicFrameLocks ");
				
				sResult += _T("noChangeAspect=\"") + m_oNoChangeAspect.ToString() + _T("\" ");
				sResult += _T("noDrilldown=\"")    + m_oNoDrilldown.ToString()    + _T("\" ");
				sResult += _T("noGrp=\"")          + m_oNoGrp.ToString()          + _T("\" ");
				sResult += _T("noMove=\"")         + m_oNoMove.ToString()         + _T("\" ");
				sResult += _T("noResize=\"")       + m_oNoResize.ToString()       + _T("\" ");
				sResult += _T("noSelect=\"")       + m_oNoSelect.ToString()       + _T("\" ");

				sResult += _T(">");
				
				if ( m_oExtLst.IsInit() )
					sResult += m_oExtLst->toXML();
				
				sResult += _T("</a:graphicFrameLocks>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_graphicFrameLocks;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("noChangeAspect"), m_oNoChangeAspect )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("noDrilldown"),    m_oNoDrilldown )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("noGrp"),          m_oNoGrp )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("noMove"),         m_oNoMove )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("noResize"),       m_oNoResize )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("noSelect"),       m_oNoSelect )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			
			SimpleTypes::COnOff<SimpleTypes::onoffFalse   > m_oNoChangeAspect;
			SimpleTypes::COnOff<SimpleTypes::onoffFalse   > m_oNoDrilldown;
			SimpleTypes::COnOff<SimpleTypes::onoffFalse   > m_oNoGrp;
			SimpleTypes::COnOff<SimpleTypes::onoffFalse   > m_oNoMove;
			SimpleTypes::COnOff<SimpleTypes::onoffFalse   > m_oNoResize;
			SimpleTypes::COnOff<SimpleTypes::onoffFalse   > m_oNoSelect;

			
			nullable<OOX::Drawing::COfficeArtExtensionList> m_oExtLst;
		};
		
		
		
		class CEmbeddedWAVAudioFile;
		class CHyperlink : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CHyperlink)
			CHyperlink()
			{
				m_eType = et_Unknown;
			}
			virtual ~CHyperlink()
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
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("action"),         m_sAction )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("endSnd"),         m_oEndSnd )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("highlightClick"), m_oHighlightClick )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("history"),        m_oHistory )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("r:id"),           m_oId )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("invalidUrl"),     m_sInvalidUrl )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("tgtFrame"),       m_sTgtFrame )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("tooltip"),        m_sTooltip )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			EElementType                                           m_eType;

			
			nullable<CString                                     > m_sAction;
			nullable<SimpleTypes::COnOff<>                       > m_oEndSnd;
			nullable<SimpleTypes::COnOff<>                       > m_oHighlightClick;
			nullable<SimpleTypes::COnOff<SimpleTypes::onoffTrue> > m_oHistory;
			nullable<SimpleTypes::CRelationshipId                > m_oId;
			nullable<CString                                     > m_sInvalidUrl;
			nullable<CString                                     > m_sTgtFrame;
			nullable<CString                                     > m_sTooltip;

			
			nullable<OOX::Drawing::COfficeArtExtensionList       > m_oExtLst;
			nullable<OOX::Drawing::CEmbeddedWAVAudioFile         > m_oSnd;
		};	
        
        
        
        class CLineProperties : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CLineProperties)
			CLineProperties()
			{
				m_eType       = et_Unknown;
				m_eFillType   = filltypeUnknown;
				m_eDashType   = linedashtypeUnknown;
				m_eJoinType   = linejointypeUnknown;
			}
			virtual ~CLineProperties()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				m_eType       = et_Unknown;
				m_eFillType   = filltypeUnknown;
				m_eDashType   = linedashtypeUnknown;
				m_eJoinType   = linejointypeUnknown;

				
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				m_eType       = et_Unknown;
				m_eFillType   = filltypeUnknown;
				m_eDashType   = linedashtypeUnknown;
				m_eJoinType   = linejointypeUnknown;

				CWCharWrapper sName = oReader.GetName();
				if ( _T("a:ln") == sName )
					m_eType = et_a_ln;
				else
					return;

				ReadAttributes( oReader );

				if ( oReader.IsEmptyNode() )
					return;

				int nCurDepth = oReader.GetDepth();
				while ( oReader.ReadNextSiblingNode( nCurDepth ) )
				{
					sName = oReader.GetName();
					if ( _T("a:bevel") == sName )
					{
						m_oBevel    = oReader;
						m_eJoinType = linejointypeBevel;
					}
					else if ( _T("a:custDash") == sName )
					{
						m_oCustDash = oReader;
						m_eDashType = linedashtypeCustom;
					}
					else if ( _T("a:extLst") == sName )
						m_oExtLst = oReader;
					else if ( _T("a:gradFill") == sName )
					{
						m_oGradFill = oReader;
						m_eFillType = filltypeGradient;
					}
					else if ( _T("a:headEnd") == sName )
						m_oHeadEnd = oReader;
					else if ( _T("a:miter") == sName )
					{
						m_oMiter    = oReader;
						m_eJoinType = linejointypeMiter;
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
					else if ( _T("a:prstDash") == sName )
					{
						m_oPrstDash = oReader;
						m_eDashType = linedashtypePreset;
					}
					else if ( _T("a:round") == sName )
					{
						m_oRound    = oReader;
						m_eJoinType = linejointypeRound;
					}
					else if ( _T("a:solidFill") == sName )
					{
						m_oSolidFill = oReader;
						m_eFillType  = filltypeSolid;
					}
					else if ( _T("a:tailEnd") == sName )
						m_oTailEnd = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult;

				if ( et_a_ln == m_eType )
					sResult = _T("<a:ln ");
				else
					return _T("");

				if ( m_oW.IsInit() )
					sResult += _T("w=\"") + m_oW->ToString() + _T("\" ");
				if ( m_oCap.IsInit() )
					sResult += _T("cap=\"") + m_oCap->ToString() + _T("\" ");
				if ( m_oCmpd.IsInit() )
					sResult += _T("cmpd=\"") + m_oCmpd->ToString() + _T("\" ");
				if ( m_oAlgn.IsInit() )
					sResult += _T("algn=\"") + m_oAlgn->ToString() + _T("\" ");

				sResult += _T(">");


				switch (m_eFillType)
				{
				case filltypeNo:

					if ( m_oNoFill.IsInit() )
						sResult += m_oNoFill->toXML();

					break;

				case filltypeSolid:

					if ( m_oSolidFill.IsInit() )
						sResult += m_oSolidFill->toXML();

					break;

				case filltypeGradient:

					if ( m_oGradFill.IsInit() )
						sResult += m_oGradFill->toXML();

					break;

				case filltypePattern:

					if ( m_oPattFill.IsInit() )
						sResult += m_oPattFill->toXML();

					break;
				}

				switch ( m_eDashType )
				{
				case linedashtypeCustom:

					if ( m_oCustDash.IsInit() )
						sResult += m_oCustDash->toXML();

					break;

				case linedashtypePreset:

					if ( m_oPrstDash.IsInit() )
						sResult += m_oPrstDash->toXML();

					break;
				}

				switch ( m_eJoinType )
				{
				case linejointypeRound:

					if ( m_oRound.IsInit() )
						sResult += m_oRound->toXML();

					break;

				case linejointypeBevel:

					if ( m_oBevel.IsInit() )
						sResult += m_oBevel->toXML();

					break;

				case linejointypeMiter:

					if ( m_oMiter.IsInit() )
						sResult += m_oMiter->toXML();

					break;
				}

				if ( m_oHeadEnd.IsInit() )
					sResult += m_oHeadEnd->toXML();

				if ( m_oTailEnd.IsInit() )
					sResult += m_oTailEnd->toXML();

				if ( m_oExtLst.IsInit() )
					sResult += m_oExtLst->toXML();

				if ( et_a_ln == m_eType )
					sResult += _T("</a:ln>");
				else
					return _T("");

				return sResult;

			}
			virtual EElementType getType() const
			{
				return m_eType;
			}


		public:

			EFillType     GetFillType() const
			{
				return m_eFillType;
			}

			ELineDashType GetDashType() const
			{
				return m_eDashType;
			}

			ELineJoinType GetJoinType() const
			{
				return m_eJoinType;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("algn"), m_oAlgn )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("cap"),  m_oCap )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("cmpd"), m_oCmpd )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w"),    m_oW )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			EElementType                                      m_eType;       

			
			nullable<SimpleTypes::CPenAlignment<>>            m_oAlgn;
			nullable<SimpleTypes::CLineCap<>>                 m_oCap;
			nullable<SimpleTypes::CCompoundLine<>>            m_oCmpd;
			nullable<SimpleTypes::CLineWidth<>>               m_oW;

			
			EFillType                                         m_eFillType;   
			nullable<OOX::Drawing::CGradientFillProperties>   m_oGradFill;
			nullable<OOX::Drawing::CNoFillProperties>         m_oNoFill;
			nullable<OOX::Drawing::CPatternFillProperties>    m_oPattFill;
			nullable<OOX::Drawing::CSolidColorFillProperties> m_oSolidFill;

			ELineDashType                                     m_eDashType;   
			nullable<OOX::Drawing::CDashStopList>             m_oCustDash;
			nullable<OOX::Drawing::CPresetLineDashProperties> m_oPrstDash;

			ELineJoinType                                     m_eJoinType;   
			nullable<OOX::Drawing::CLineJoinBevel>            m_oBevel;
			nullable<OOX::Drawing::CLineJoinMiterProperties>  m_oMiter;
			nullable<OOX::Drawing::CLineJoinRound>            m_oRound;

			nullable<OOX::Drawing::CLineEndProperties>        m_oHeadEnd;
			nullable<OOX::Drawing::CLineEndProperties>        m_oTailEnd;
			nullable<OOX::Drawing::COfficeArtExtensionList>   m_oExtLst;
		};
		
		
		
		class CPictureLocking : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CPictureLocking)
			CPictureLocking()
			{
			}
			virtual ~CPictureLocking()
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

					if ( _T("a:extLst") == sName )
						m_oExtLst = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<a:picLocks ");

				if ( m_oNoAdjustHandles.GetValue() != SimpleTypes::onoffFalse )
					sResult += _T("noAdjustHandles=\"true\" ");

				if ( m_oNoChangeArrowheads.GetValue() != SimpleTypes::onoffFalse )
					sResult += _T("noChangeArrowheads=\"true\" ");

				if ( m_oNoChangeAspect.GetValue() != SimpleTypes::onoffFalse )
					sResult += _T("noChangeAspect=\"true\" ");

				if ( m_oNoChangeShapeType.GetValue() != SimpleTypes::onoffFalse )
					sResult += _T("noChangeShapeType=\"true\" ");

				if ( m_oNoCrop.GetValue() != SimpleTypes::onoffFalse )
					sResult += _T("noCrop=\"true\" ");

				if ( m_oNoEditPoints.GetValue() != SimpleTypes::onoffFalse )
					sResult += _T("noEditPoints=\"true\" ");

				if ( m_oNoGrp.GetValue() != SimpleTypes::onoffFalse )
					sResult += _T("noGrp=\"true\" ");

				if ( m_oNoMove.GetValue() != SimpleTypes::onoffFalse )
					sResult += _T("noMove=\"true\" ");

				if ( m_oNoResize.GetValue() != SimpleTypes::onoffFalse )
					sResult += _T("noResize=\"true\" ");

				if ( m_oNoRot.GetValue() != SimpleTypes::onoffFalse )
					sResult += _T("noRot=\"true\" ");

				if ( m_oNoSelect.GetValue() != SimpleTypes::onoffFalse )
					sResult += _T("noSelect=\"true\" ");

				if ( m_oExtLst.IsInit() )
				{
					sResult += _T(">");
					sResult += m_oExtLst->toXML();
					sResult += _T("</a:picLocks>");
				}
				else
					sResult += _T("/>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return et_a_picLocks;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("noAdjustHandles"), m_oNoAdjustHandles )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("noChangeArrowheads"), m_oNoChangeArrowheads )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("noChangeAspect"), m_oNoChangeAspect )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("noChangeShapeType"), m_oNoChangeShapeType )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("noCrop"), m_oNoCrop )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("noEditPoints"), m_oNoEditPoints )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("noGrp"), m_oNoGrp )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("noMove"), m_oNoMove )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("noResize"), m_oNoResize )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("noRot"), m_oNoRot )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("noSelect"), m_oNoSelect )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			
			SimpleTypes::COnOff<SimpleTypes::onoffFalse> m_oNoAdjustHandles;
			SimpleTypes::COnOff<SimpleTypes::onoffFalse> m_oNoChangeArrowheads;
			SimpleTypes::COnOff<SimpleTypes::onoffFalse> m_oNoChangeAspect;
			SimpleTypes::COnOff<SimpleTypes::onoffFalse> m_oNoChangeShapeType;
			SimpleTypes::COnOff<SimpleTypes::onoffFalse> m_oNoCrop;
			SimpleTypes::COnOff<SimpleTypes::onoffFalse> m_oNoEditPoints;
			SimpleTypes::COnOff<SimpleTypes::onoffFalse> m_oNoGrp;
			SimpleTypes::COnOff<SimpleTypes::onoffFalse> m_oNoMove;
			SimpleTypes::COnOff<SimpleTypes::onoffFalse> m_oNoResize;
			SimpleTypes::COnOff<SimpleTypes::onoffFalse> m_oNoRot;
			SimpleTypes::COnOff<SimpleTypes::onoffFalse> m_oNoSelect;

			
			nullable<OOX::Drawing::COfficeArtExtensionList> m_oExtLst;
		};


        
        
        
        class CEmbeddedWAVAudioFile : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CEmbeddedWAVAudioFile)
			CEmbeddedWAVAudioFile()
			{
			}
			virtual ~CEmbeddedWAVAudioFile()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("r:embed"), m_oEmbed );
				oNode.ReadAttributeBase( _T("name"), m_sName );
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<a:snd ");

				if ( m_oEmbed.IsInit() ) sResult += _T("r:embed=\"") + m_oEmbed->ToString() + _T("\" ");
				if ( m_sName.IsInit()  ) 
				{
					sResult += _T("name=\"");
					sResult += m_sName->GetString();
					sResult += _T("\" ");
				}

				sResult += _T("/>");

				return sResult;

			}
			virtual EElementType getType() const
			{
				return et_a_snd;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("r:embed"), m_oEmbed )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("name"), m_sName )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			nullable<SimpleTypes::CRelationshipId> m_oEmbed;
			nullable<CString                     > m_sName;

		};
        
        
        
        class CShapeProperties : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CShapeProperties)
			CShapeProperties()
			{
				m_eType       = et_Unknown;
				m_eFillType   = filltypeUnknown;
				m_eGeomType   = geomtypeUnknown;
				m_eEffectType = effecttypeUnknown;
			}
			virtual ~CShapeProperties()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				m_eType       = et_Unknown;
				m_eFillType   = filltypeUnknown;
				m_eGeomType   = geomtypeUnknown;
				m_eEffectType = effecttypeUnknown;

				
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				m_eType       = et_Unknown;
				m_eFillType   = filltypeUnknown;
				m_eGeomType   = geomtypeUnknown;
				m_eEffectType = effecttypeUnknown;

				CWCharWrapper sName = oReader.GetName();
				if ( _T("a:spPr") == sName )
					m_eType = et_a_spPr;
				else if ( _T("pic:spPr") == sName )
					m_eType = et_pic_spPr;
				else
					return;

				ReadAttributes( oReader );

				if ( oReader.IsEmptyNode() )
					return;

				int nCurDepth = oReader.GetDepth();
				while ( oReader.ReadNextSiblingNode( nCurDepth ) )
				{
					sName = oReader.GetName();
					if ( _T("a:blipFill") == sName )
					{
						m_oBlipFill = oReader;
						m_eFillType = filltypeBlip;
					}
					else if ( _T("a:custGeom") == sName )
					{
						m_oCustGeom = oReader;
						m_eGeomType = geomtypeCustom;
					}
					else if ( _T("a:effectDag") == sName )
					{
						m_oEffectDag  = oReader;
						m_eEffectType = effecttypeDag;
					}
					else if ( _T("a:effectLst") == sName )
					{
						m_oEffectList = oReader;
						m_eEffectType = effecttypeLst;
					}
					else if ( _T("a:extLst") == sName )
						m_oExtLst = oReader;
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
					else if ( _T("a:ln") == sName )
						m_oLn = oReader;
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
					else if ( _T("a:prstGeom") == sName )
					{
						m_oPrstGeom = oReader;
						m_eGeomType = geomtypePreset;
					}
					else if ( _T("a:scene3d") == sName )
						m_oScene3D = oReader;
					else if ( _T("a:solidFill") == sName )
					{
						m_oSolidFill = oReader;
						m_eFillType  = filltypeSolid;
					}
					else if ( _T("a:sp3d") == sName )
						m_oSp3D = oReader;
					else if ( _T("a:xfrm") == sName )
						m_oXfrm = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult;

				if ( m_eType == et_a_spPr )
					sResult = _T("<a:spPr ");
				else if ( et_pic_spPr == m_eType )
					sResult = _T("<pic:spPr ");
				else
					return _T("");

				
				if ( m_oBwMode.IsInit() )
					sResult += _T("bwMode=\"") + m_oBwMode->ToString() + _T("\">");
				else
					sResult += _T(">");


				
				if ( m_oXfrm.IsInit() )
					sResult += m_oXfrm->toXML();

				switch ( m_eGeomType )
				{
				case geomtypeCustom:

					if ( m_oCustGeom.IsInit() )
						sResult += m_oCustGeom->toXML(); 
					break;

				case geomtypePreset: 

					if ( m_oPrstGeom.IsInit() )
						sResult += m_oPrstGeom->toXML(); 
					break;
				}

				switch ( m_eFillType )
				{
				case filltypeNo:

					if ( m_oNoFill.IsInit() )
						sResult += m_oNoFill->toXML();
					break;

				case filltypeSolid: 

					if ( m_oSolidFill.IsInit() )
						sResult += m_oSolidFill->toXML(); 					
					break;

				case filltypeGradient:

					if ( m_oGradFill.IsInit() )
						sResult += m_oGradFill->toXML();
					break;

				case filltypeBlip:

					if ( m_oBlipFill.IsInit() )
						sResult += m_oBlipFill->toXML();
					break;

				case filltypePattern:

					if ( m_oPattFill.IsInit() )
						sResult += m_oPattFill->toXML();
					break;

				case filltypeGroup:

					if ( m_oGrpFill.IsInit() )
						sResult += m_oGrpFill->toXML();
					break;
				}

				if ( m_oLn.IsInit() )
					sResult += m_oLn->toXML();

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

				if ( m_oExtLst.IsInit() )
					sResult += m_oExtLst->toXML();

				if ( m_eType == et_a_spPr )
					sResult += _T("</a:spPr>");
				else if ( et_pic_spPr == m_eType )
					sResult = _T("</pic:spPr>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return m_eType;
			}
		public:

			EFillType   GetFillType() const
			{
				return m_eFillType;
			}

			EGeomType   GetGeomType() const
			{
				return m_eGeomType;
			}

			EEffectType GetEffectType() const
			{
				return m_eEffectType;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_ReadSingle( oReader, _T("bwMode"), m_oBwMode )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			EElementType                                      m_eType;       

			
			nullable<SimpleTypes::CBlackWhiteMode<>>          m_oBwMode;

			
			EFillType                                         m_eFillType;   
			nullable<OOX::Drawing::CBlipFillProperties>       m_oBlipFill;
			nullable<OOX::Drawing::CGradientFillProperties>   m_oGradFill;
			nullable<OOX::Drawing::CGroupFillProperties>      m_oGrpFill;
			nullable<OOX::Drawing::CNoFillProperties>         m_oNoFill;
			nullable<OOX::Drawing::CPatternFillProperties>    m_oPattFill;
			nullable<OOX::Drawing::CSolidColorFillProperties> m_oSolidFill;

			EGeomType                                         m_eGeomType;   
			nullable<OOX::Drawing::CCustomGeometry2D>         m_oCustGeom;
			nullable<OOX::Drawing::CPresetGeometry2D>         m_oPrstGeom;

			EEffectType                                       m_eEffectType; 
			nullable<OOX::Drawing::CEffectContainer>          m_oEffectDag;
			nullable<OOX::Drawing::CEffectList>               m_oEffectList;

			nullable<OOX::Drawing::CLineProperties>           m_oLn;
			nullable<OOX::Drawing::COfficeArtExtensionList>   m_oExtLst;
			nullable<OOX::Drawing::CScene3D>                  m_oScene3D;
			nullable<OOX::Drawing::CShape3D>                  m_oSp3D;
			nullable<OOX::Drawing::CTransform2D>              m_oXfrm;


		};
        
        
        
        class CShapeStyle : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CShapeStyle)
			CShapeStyle()
			{
			}
			virtual ~CShapeStyle()
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
					if ( _T("a:effectRef") == sName )
						m_oEffectRef = oReader;
					else if ( _T("a:fillRef") == sName )
						m_oFillRef = oReader;
					else if ( _T("a:fontRef") == sName )
						m_oFontRef = oReader;
					else if ( _T("a:lnRef") == sName )
						m_oLnRef = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<a:style>");

				sResult += m_oLnRef.toXML();
				sResult += m_oFillRef.toXML();
				sResult += m_oEffectRef.toXML();
				sResult += m_oFontRef.toXML();

				sResult += _T("</a:style>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return et_a_style;
			}

		public:

			
			OOX::Drawing::CStyleMatrixReference m_oEffectRef;
			OOX::Drawing::CStyleMatrixReference m_oFillRef;
			OOX::Drawing::CFontReference        m_oFontRef;
			OOX::Drawing::CStyleMatrixReference m_oLnRef;
		};
	} 

} 



#endif // OOX_LOGIC_DRAWING_CORE_INFO_INCLUDE_H_