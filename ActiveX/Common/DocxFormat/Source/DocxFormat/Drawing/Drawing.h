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
#ifndef OOX_LOGIC_DRAWING_INCLUDE_H_
#define OOX_LOGIC_DRAWING_INCLUDE_H_

#include "../../Base/Nullable.h"
#include "../../Common/SimpleTypes_Drawing.h"
#include "../../Common/SimpleTypes_Shared.h"
#include "../../Common/Encoding.h"

#include "../WritingElement.h"
#include "../RId.h"

#include "DrawingExt.h"
#include "DrawingColors.h"
#include "DrawingEffects.h"
#include "DrawingCoreInfo.h"
#include "DrawingGraphic.h"

#include "../../SystemUtility/SystemUtility.h"

namespace OOX
{
	namespace Drawing
	{
		
		
		
		class CNonVisualGraphicFrameProperties : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CNonVisualGraphicFrameProperties)
			CNonVisualGraphicFrameProperties()
			{
			}
			virtual ~CNonVisualGraphicFrameProperties()
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
					if ( _T("a:extLst") == sName )
						m_oExtLst = oReader;
					else if ( _T("a:graphicFrameLocks") == sName )
						m_oGraphicFrameLocks = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<wp:cNvGraphicFramePr>");

				if ( m_oExtLst.IsInit() )
					sResult += m_oExtLst->toXML();
				if ( m_oGraphicFrameLocks.IsInit() )
					sResult += m_oGraphicFrameLocks->toXML();

				sResult += _T("</wp:cNvGraphicFramePr>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_wp_cNvGraphicFramePr;
			}

		public:

			
			nullable<OOX::Drawing::COfficeArtExtensionList     > m_oExtLst;
			nullable<OOX::Drawing::CGraphicalObjectFrameLocking> m_oGraphicFrameLocks;
		};
		
		
		
		class CEffectExtent : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CEffectExtent)
			CEffectExtent()
			{
			}
			virtual ~CEffectExtent()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("l"), m_oL );
				oNode.ReadAttributeBase( _T("t"), m_oT );
				oNode.ReadAttributeBase( _T("r"), m_oR );
				oNode.ReadAttributeBase( _T("b"), m_oB );
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<wp:effectExtent ");

				sResult += _T("l=\"") + m_oL.ToString() + _T("\" ");
				sResult += _T("t=\"") + m_oT.ToString() + _T("\" ");
				sResult += _T("r=\"") + m_oR.ToString() + _T("\" ");
				sResult += _T("b=\"") + m_oB.ToString() + _T("\" ");

				sResult += _T("</wp:effectExtent>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_wp_effectExtent;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("l"), m_oL )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("t"), m_oT )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("r"), m_oR )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("b"), m_oB )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			SimpleTypes::CCoordinate m_oB;
			SimpleTypes::CCoordinate m_oL;
			SimpleTypes::CCoordinate m_oR;
			SimpleTypes::CCoordinate m_oT;

		};
		
		
		
		class CPosH : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CPosH)
			CPosH()
			{
			}
			virtual ~CPosH()
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
					if ( _T("wp:align") == sName )
					{
						m_oAlign = oReader.GetText2();
						m_bAlign = true;
					}
					else if ( _T("wp:posOffset") == sName )
					{
						m_oPosOffset = oReader.GetText2();
						m_bAlign = false;
					}
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<wp:positionH ");

				if ( m_oRelativeFrom.IsInit() )
					sResult += _T("relativeFrom=\"") + m_oRelativeFrom->ToString() + _T("\">");
				else
					sResult += _T(">");

				if ( m_bAlign && m_oAlign.IsInit() )
					sResult += _T("<wp:align>") + m_oAlign->ToString() + _T("</wp:align>");
				else if ( !m_bAlign && m_oPosOffset.IsInit() )
					sResult += _T("<wp:posOffset>") + m_oPosOffset->ToString() + _T("</wp:posOffset>");

				sResult += _T("</wp:positionH>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_wp_positionH;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_ReadSingle( oReader, _T("relativeFrom"), m_oRelativeFrom )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			bool IsAlign() const
			{
				return m_bAlign;
			}
			bool IsPosOffset() const
			{
				return !m_bAlign;
			}

		public:

			bool                                     m_bAlign; 

			
			nullable<SimpleTypes::CRelFromH<>      > m_oRelativeFrom;

			
			nullable<SimpleTypes::CAlignH<>        > m_oAlign;
			nullable<SimpleTypes::CPositionOffset<>> m_oPosOffset;
		};
		
		
		
		class CPosV : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CPosV)
			CPosV()
			{
			}
			virtual ~CPosV()
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
					if ( _T("wp:align") == sName )
					{
						m_oAlign = oReader.GetText2();
						m_bAlign = true;
					}
					else if ( _T("wp:posOffset") == sName )
					{
						m_oPosOffset = oReader.GetText2();
						m_bAlign = false;
					}
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<wp:positionV ");

				if ( m_oRelativeFrom.IsInit() )
					sResult += _T("relativeFrom=\"") + m_oRelativeFrom->ToString() + _T("\">");
				else
					sResult += _T(">");

				if ( m_bAlign && m_oAlign.IsInit() )
					sResult += _T("<wp:align>") + m_oAlign->ToString() + _T("</wp:align>");
				else if ( !m_bAlign && m_oPosOffset.IsInit() )
					sResult += _T("<wp:posOffset>") + m_oPosOffset->ToString() + _T("</wp:posOffset>");

				sResult += _T("</wp:positionV>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_wp_positionV;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_ReadSingle( oReader, _T("relativeFrom"), m_oRelativeFrom )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			bool IsAlign() const
			{
				return m_bAlign;
			}
			bool IsPosOffset() const
			{
				return !m_bAlign;
			}

		public:

			bool                                     m_bAlign; 

			
			nullable<SimpleTypes::CRelFromV<>      > m_oRelativeFrom;

			
			nullable<SimpleTypes::CAlignV<>        > m_oAlign;
			nullable<SimpleTypes::CPositionOffset<>> m_oPosOffset;
		};
		
		
		
		class CWrapNone : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CWrapNone)
			CWrapNone()
			{
			}
			virtual ~CWrapNone()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
			}
			virtual CString      toXML() const
			{
				return _T("");
			}
			virtual EElementType getType() const
			{
				return OOX::et_wp_wrapNone;
			}
		};
		
		
		
		class CWrapSquare : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CWrapSquare)
			CWrapSquare()
			{
			}
			virtual ~CWrapSquare()
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
					if ( _T("wp:effectExtents") == sName )
						m_oEffectExtent = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<wp:wrapSquare ");
				if(m_oWrapText.IsInit())
					sResult += _T("wrapText=\"") + m_oWrapText->ToString() + _T("\" ");

				if ( m_oDistB.IsInit() ) sResult += _T("distB=\"") + m_oDistB->ToString() + _T("\" ");
				if ( m_oDistL.IsInit() ) sResult += _T("distL=\"") + m_oDistL->ToString() + _T("\" ");
				if ( m_oDistR.IsInit() ) sResult += _T("distR=\"") + m_oDistR->ToString() + _T("\" ");
				if ( m_oDistT.IsInit() ) sResult += _T("distT=\"") + m_oDistT->ToString() + _T("\" ");

				if ( m_oEffectExtent.IsInit() )
					sResult += m_oEffectExtent->toXML();

				sResult += _T("</wp:wrapSquare>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_wp_wrapSquare;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("distB"),    m_oDistB )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("distL"),    m_oDistL )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("distR"),    m_oDistR )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("distT"),    m_oDistT )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("wrapText"), m_oWrapText )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			
			nullable<SimpleTypes::CWrapDistance<>> m_oDistB;
			nullable<SimpleTypes::CWrapDistance<>> m_oDistL;
			nullable<SimpleTypes::CWrapDistance<>> m_oDistR;
			nullable<SimpleTypes::CWrapDistance<>> m_oDistT;
			nullable<SimpleTypes::CWrapText<>>     m_oWrapText;

			
			nullable<OOX::Drawing::CEffectExtent>  m_oEffectExtent;
		};
		
		
		
		class CWrapPath : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CWrapPath)
			CWrapPath()
			{
			}
			virtual ~CWrapPath()
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

				bool bStart = false;
				while( oReader.ReadNextSiblingNode( nCurDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();
					if ( _T("wp:start") == sName )
					{
						m_oStart = oReader;
						bStart = true;
					}
					else if ( bStart && _T("wp:lineTo") == sName )
					{
						ComplexTypes::Drawing::CPoint2D oPoint = oReader;
						m_arrLineTo.Add( oPoint );
					}
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("");
				
				
				
				

				

				
				

				

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_wp_wrapPolygon;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_ReadSingle( oReader, _T("edited"), m_oEdited )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			
			nullable<SimpleTypes::COnOff<> >              m_oEdited;

			
			nullable<ComplexTypes::Drawing::CPoint2D>               m_oStart;
			CSimpleArray<ComplexTypes::Drawing::CPoint2D> m_arrLineTo;
		};
		
		
		
		class CWrapThrough : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CWrapThrough)
			CWrapThrough()
			{
			}
			virtual ~CWrapThrough()
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
					if ( _T("wp:wrapPolygon") == sName )
						m_oWrapPolygon = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<wp:wrapThrough ");
				
				if ( m_oDistL.IsInit()    ) sResult += _T("distL=\"")    + m_oDistL->ToString()    + _T("\" ");
				if ( m_oDistR.IsInit()    ) sResult += _T("distR=\"")    + m_oDistR->ToString()    + _T("\" ");
				if ( m_oWrapText.IsInit() ) sResult += _T("wrapText=\"") + m_oWrapText->ToString() + _T("\" ");
				
				sResult += _T(">");
				if(m_oWrapPolygon.IsInit())
					sResult += m_oWrapPolygon->toXML();
				sResult += _T("</wp:wrapThrough>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_wp_wrapThrough;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("distL"),    m_oDistL )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("distR"),    m_oDistR )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("wrapText"), m_oWrapText )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			
			nullable<SimpleTypes::CWrapDistance<> >  m_oDistL;
			nullable<SimpleTypes::CWrapDistance<> >  m_oDistR;
			nullable<SimpleTypes::CWrapText<>     >  m_oWrapText;

			
			nullable<OOX::Drawing::CWrapPath>     m_oWrapPolygon;
		};
		
		
		
		class CWrapTight : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CWrapTight)
			CWrapTight()
			{
			}
			virtual ~CWrapTight()
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
					if ( _T("wp:wrapPolygon") == sName )
						m_oWrapPolygon = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<wp:wrapTight ");
				
				if ( m_oDistL.IsInit()    ) sResult += _T("distL=\"")    + m_oDistL->ToString()    + _T("\" ");
				if ( m_oDistR.IsInit()    ) sResult += _T("distR=\"")    + m_oDistR->ToString()    + _T("\" ");
				if ( m_oWrapText.IsInit() ) sResult += _T("wrapText=\"") + m_oWrapText->ToString() + _T("\" ");

				sResult += _T(">");
				if(m_oWrapPolygon.IsInit())
					sResult += m_oWrapPolygon->toXML();
				sResult += _T("</wp:wrapTight>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_wp_wrapTight;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("distL"),    m_oDistL )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("distR"),    m_oDistR )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("wrapText"), m_oWrapText )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			
			nullable<SimpleTypes::CWrapDistance<> >  m_oDistL;
			nullable<SimpleTypes::CWrapDistance<> >  m_oDistR;
			nullable<SimpleTypes::CWrapText<>     >  m_oWrapText;

			
			nullable<OOX::Drawing::CWrapPath>                  m_oWrapPolygon;
		};
		
		
		
		class CWrapTopBottom : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CWrapTopBottom)
			CWrapTopBottom()
			{
			}
			virtual ~CWrapTopBottom()
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
					if ( _T("wp:effectExtent") == sName )
						m_oEffectExtent = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<wp:wrapTopAndBottom ");
				
				if ( m_oDistB.IsInit() ) sResult += _T("distB=\"") + m_oDistB->ToString() + _T("\" ");
				if ( m_oDistT.IsInit() ) sResult += _T("distT=\"") + m_oDistT->ToString() + _T("\" ");

				sResult += _T(">");
				
				if ( m_oEffectExtent.IsInit() )
					sResult += m_oEffectExtent->toXML();
				
				sResult += _T("</wp:wrapTopAndBottom>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_wp_wrapTopAndBottom;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("distB"), m_oDistB )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("distT"), m_oDistT )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			
			nullable<SimpleTypes::CWrapDistance<>> m_oDistB;
			nullable<SimpleTypes::CWrapDistance<>> m_oDistT;

			
			nullable<OOX::Drawing::CEffectExtent>  m_oEffectExtent;
		};
		
		
		
		enum EAnchorWrapType
		{
			anchorwrapUnknown      = 0,
			anchorwrapNone         = 1,
			anchorwrapSquare       = 2,
			anchorwrapThrough      = 3,
			anchorwrapTight        = 4,
			anchorwrapTopAndBottom = 5
		};

		class CAnchor : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CAnchor)
			CAnchor()
			{
			}
			virtual ~CAnchor()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				m_eWrapType = anchorwrapUnknown;

				
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
					if ( _T("wp:cNvGraphicFramePr") == sName )
						m_oCNvGraphicFramePr = oReader;
					else if ( _T("wp:docPr") == sName )
						m_oDocPr = oReader;
					else if ( _T("wp:effectExtent") == sName )
						m_oEffectExtent = oReader;
					else if ( _T("wp:extent") == sName )
						m_oExtent = oReader;
					else if ( _T("a:graphic") == sName )
						m_oGraphic = oReader;
					else if ( _T("wp:positionH") == sName )
						m_oPositionH = oReader;
					else if ( _T("wp:positionV") == sName )
						m_oPositionV = oReader;
					else if ( _T("wp:simplePos") == sName )
						m_oSimplePos = oReader;
					else if ( false == m_eWrapType.IsInit() )
					{
						if ( _T("wp:wrapNone") == sName )
						{
							m_oWrapNone = oReader;
							m_eWrapType = anchorwrapNone;
						}
						else if ( _T("wp:wrapSquare") == sName )
						{
							m_oWrapSquare = oReader;
							m_eWrapType = anchorwrapSquare;
						}
						else if ( _T("wp:wrapThrough") == sName )
						{
							m_oWrapThrough = oReader;
							m_eWrapType = anchorwrapThrough;
						}
						else if ( _T("wp:wrapTight") == sName )
						{
							m_oWrapTight = oReader;
							m_eWrapType = anchorwrapTight;
						}
						else if ( _T("wp:wrapTopAndBottom") == sName )
						{
							m_oWrapTopAndBottom = oReader;
							m_eWrapType = anchorwrapTopAndBottom;
						}
					}
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("");
				
				
				
				
				
				
				
				
				
				
				
				
				

				
				
				
				

				
				

				
				

				
				

				
				

				
				
				
				
				
				

				
				
				
				
				
				

				
				

				
				
				
				

				
				
				
				
				
				

				
				
				
				
				
				

				
				
				

				
				

				
				

				
				
				

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_wp_anchor;
			}

		public:

			
			
			

			
			
			
			
			

			
			
			
			
			
			
			
			
			

			
			
			
			

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("allowOverlap"),   m_oAllowOverlap )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("behindDoc"),      m_oBehindDoc )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("distB"),          m_oDistB )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("distL"),          m_oDistL )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("distR"),          m_oDistR )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("distT"),          m_oDistT )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("hidden"),         m_oHidden )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("layoutInCell"),   m_oLayoutInCell )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("locked"),         m_oLocked )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("relativeHeight"), m_oRelativeHeight )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("simplePos"),      m_bSimplePos )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			nullable<EAnchorWrapType> m_eWrapType;

			
			nullable<SimpleTypes::COnOff<SimpleTypes::onoffFalse>> m_oAllowOverlap;
			nullable<SimpleTypes::COnOff<SimpleTypes::onoffFalse>> m_oBehindDoc;
			nullable<SimpleTypes::CWrapDistance<>      > m_oDistB;
			nullable<SimpleTypes::CWrapDistance<>      > m_oDistL;
			nullable<SimpleTypes::CWrapDistance<>      > m_oDistR;
			nullable<SimpleTypes::CWrapDistance<>      > m_oDistT;
			nullable<SimpleTypes::COnOff<SimpleTypes::onoffFalse>> m_oHidden;
			nullable<SimpleTypes::COnOff<SimpleTypes::onoffFalse>> m_oLayoutInCell;
			nullable<SimpleTypes::COnOff<SimpleTypes::onoffFalse>> m_oLocked;
			nullable<SimpleTypes::CUnsignedDecimalNumber<0> >      m_oRelativeHeight;
			nullable<SimpleTypes::COnOff<SimpleTypes::onoffFalse>> m_bSimplePos;

			
			nullable<OOX::Drawing::CNonVisualGraphicFrameProperties> m_oCNvGraphicFramePr;
			nullable<OOX::Drawing::CNonVisualDrawingProps          > m_oDocPr;
			nullable<OOX::Drawing::CEffectExtent                   > m_oEffectExtent;
			nullable<ComplexTypes::Drawing::CPositiveSize2D        > m_oExtent;
			nullable<OOX::Drawing::CGraphic                        > m_oGraphic;
			nullable<OOX::Drawing::CPosH                           > m_oPositionH;
			nullable<OOX::Drawing::CPosV                           > m_oPositionV;
			nullable<ComplexTypes::Drawing::CPoint2D               > m_oSimplePos;
			nullable<OOX::Drawing::CWrapNone                       > m_oWrapNone;
			nullable<OOX::Drawing::CWrapSquare                     > m_oWrapSquare;
			nullable<OOX::Drawing::CWrapThrough                    > m_oWrapThrough;
			nullable<OOX::Drawing::CWrapTight                      > m_oWrapTight;
			nullable<OOX::Drawing::CWrapTopBottom                  > m_oWrapTopAndBottom;

		};
		
		
		
		class CInline : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CInline)
			CInline()
			{
			}
			virtual ~CInline()
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
					if ( _T("wp:cNvGraphicFramePr") == sName )
						m_oCNvGraphicFramePr = oReader;
					else if ( _T("wp:docPr") == sName )
						m_oDocPr = oReader;
					else if ( _T("wp:effectExtent") == sName )
						m_oEffectExtent = oReader;
					else if ( _T("wp:extent") == sName )
						m_oExtent = oReader;
					else if ( _T("a:graphic") == sName )
						m_oGraphic = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<wp:inline ");
				
				if ( m_oDistB.IsInit() ) sResult += _T("distB=\"") + m_oDistB->ToString() + _T("\" ");
				if ( m_oDistL.IsInit() ) sResult += _T("distL=\"") + m_oDistL->ToString() + _T("\" ");
				if ( m_oDistR.IsInit() ) sResult += _T("distR=\"") + m_oDistR->ToString() + _T("\" ");
				if ( m_oDistT.IsInit() ) sResult += _T("distT=\"") + m_oDistT->ToString() + _T("\" ");

				sResult += _T(">");
				
				if ( m_oExtent.IsInit() )  
					sResult += _T("<wp:extent ") + m_oExtent->ToString() + _T("/>");

				if ( m_oEffectExtent.IsInit() )
					sResult += m_oEffectExtent->toXML();

				if ( m_oDocPr.IsInit() )
					sResult += m_oDocPr->toXML();

				if ( m_oCNvGraphicFramePr.IsInit() )
					sResult += m_oCNvGraphicFramePr->toXML();

				if ( m_oGraphic.IsInit() )
					sResult += m_oGraphic->toXML();
				
				sResult += _T("</wp:inline>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_wp_inline;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("distB"),          m_oDistB )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("distL"),          m_oDistL )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("distR"),          m_oDistR )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("distT"),          m_oDistT )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			
			nullable<SimpleTypes::CWrapDistance<>      > m_oDistB;
			nullable<SimpleTypes::CWrapDistance<>      > m_oDistL;
			nullable<SimpleTypes::CWrapDistance<>      > m_oDistR;
			nullable<SimpleTypes::CWrapDistance<>      > m_oDistT;

			
			nullable<OOX::Drawing::CNonVisualGraphicFrameProperties> m_oCNvGraphicFramePr;
			nullable<OOX::Drawing::CNonVisualDrawingProps          > m_oDocPr;
			nullable<OOX::Drawing::CEffectExtent                   > m_oEffectExtent;
			nullable<ComplexTypes::Drawing::CPositiveSize2D        > m_oExtent;
			nullable<OOX::Drawing::CGraphic>                         m_oGraphic;
		};
	} 
} 

namespace OOX
{
	namespace Logic
	{
		
		
		
		class CDrawing : public WritingElement
		{
		public:
			CDrawing()
			{
			}
			CDrawing(XmlUtils::CXmlNode& oNode)
			{
				fromXML( oNode );
			}
			CDrawing(XmlUtils::CXmlLiteReader& oReader)
			{
				fromXML( oReader );
			}
			
			
			

			

			
			
			
			

			
			

			
			
			
			

			
			
			
			
			
			
			
			
			
			

			
			

			
			
			
			

			
			
			
			
			

			
			
			
			
			
			
			
			

			
			
			

			
			
			
			
			
			
			
			

			

			
			
			
			

			
			

			
			
			
			
			
			
			
			
			

			

			
			
			
			
			
			

			
			
			

			
			
			

			
			
			
			
			

			
			

			
			
			

			
			
			
			
			

			
			
			

			
			
			

			
			
			
			
			
			virtual ~CDrawing()
			{
			}
			const CDrawing& operator =(const XmlUtils::CXmlNode& oNode)
			{
				fromXML( (XmlUtils::CXmlNode&)oNode );
				return *this;
			}
			const CDrawing& operator =(const XmlUtils::CXmlLiteReader& oReader)
			{
				fromXML( (XmlUtils::CXmlLiteReader&)oReader );
				return *this;
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				fromXML2(oReader, false);
			}
			void fromXML2(XmlUtils::CXmlLiteReader& oReader, bool bDoNotReadXml)
			{
				if ( oReader.IsEmptyNode() )
					return;
				XmlUtils::CXmlLiteReader* pReader = NULL;
				if(bDoNotReadXml)
				{
					pReader = &oReader;
				}
				else
				{
					m_sXml.Init();
					m_sXml->Append(oReader.GetOuterXml());
					CString sXml;
					sXml.Format(_T("<root xmlns:wpc=\"http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas\" xmlns:mc=\"http://schemas.openxmlformats.org/markup-compatibility/2006\" xmlns:o=\"urn:schemas-microsoft-com:office:office\" xmlns:r=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships\" xmlns:m=\"http://schemas.openxmlformats.org/officeDocument/2006/math\" xmlns:v=\"urn:schemas-microsoft-com:vml\" xmlns:wp14=\"http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing\" xmlns:wp=\"http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing\" xmlns:w10=\"urn:schemas-microsoft-com:office:word\" xmlns:w=\"http://schemas.openxmlformats.org/wordprocessingml/2006/main\" xmlns:w14=\"http://schemas.microsoft.com/office/word/2010/wordml\" xmlns:wpg=\"http://schemas.microsoft.com/office/word/2010/wordprocessingGroup\" xmlns:wpi=\"http://schemas.microsoft.com/office/word/2010/wordprocessingInk\" xmlns:wne=\"http://schemas.microsoft.com/office/word/2006/wordml\" xmlns:wps=\"http://schemas.microsoft.com/office/word/2010/wordprocessingShape\">%s</root>"), m_sXml.get());
					pReader = new XmlUtils::CXmlLiteReader();
					pReader->FromString(sXml);
					pReader->ReadNextNode();
					pReader->ReadNextNode();
				}

				int nCurDepth = pReader->GetDepth();
				while( pReader->ReadNextSiblingNode( nCurDepth ) )
				{
					CWCharWrapper sName = pReader->GetName();
					if ( _T("wp:inline") == sName )
					{
						m_oInline = *pReader;
						m_bAnchor = false;
					}
					else if ( _T("wp:anchor") == sName )
					{
						m_oAnchor = *pReader;
						m_bAnchor = true;
					}
				}
				if(false == bDoNotReadXml)
				{
					delete pReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<w:drawing>");

				if ( m_bAnchor && m_oAnchor.IsInit() )
					sResult += m_oAnchor->toXML();
				else if ( !m_bAnchor && m_oInline.IsInit() )
					sResult += m_oInline->toXML();

				sResult += _T("</w:drawing>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_w_drawing;
			}

		public:

			bool IsAnchor() const
			{
				return m_bAnchor;
			}
			bool IsInline() const
			{
				return !m_bAnchor;
			}

		public:

			bool                            m_bAnchor; 

			nullable<CString> m_sXml;
			
			nullable<OOX::Drawing::CAnchor> m_oAnchor;
			nullable<OOX::Drawing::CInline> m_oInline;
		};
	} 
} 

#endif // OOX_LOGIC_DRAWING_INCLUDE_H_