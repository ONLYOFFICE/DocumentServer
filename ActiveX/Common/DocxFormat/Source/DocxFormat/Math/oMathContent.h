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

#include "../../Common/ComplexTypes.h"

#include "oMathBottomNodes.h"
#include "oMath.h"

#include "../Logic/RunContent.h"
#include "../Logic/FldChar.h"
#include "../Logic/RunProperty.h"
#include "../Logic/Annotations.h"
#include "../Drawing/Drawing.h"


namespace OOX
{	
	
	namespace Logic
	{
		typedef CMathArgNodes CDeg;
		typedef CMathArgNodes CDen;
		typedef CMathArgNodes CElement;
		typedef CMathArgNodes CFName;
		typedef CMathArgNodes CLim;
		typedef CMathArgNodes CNum;
		typedef CMathArgNodes COMath;
		typedef CMathArgNodes CSub;
		typedef CMathArgNodes CSup;
		
		
		
		class CAccPr;
		class CAcc : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CAcc)
			CAcc()
			{
			}
			virtual ~CAcc()
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
					if ( _T("m:accPr") == sName )
						m_oAccPr = oReader;
					else if ( _T("m:e") == sName )
						m_oElement = oReader;
				}
			}
			 CString      toXML() const;
			
			virtual EElementType getType() const
			{
				return et_m_acc;
			}
		public:
			
			nullable<OOX::Logic::CAccPr>		m_oAccPr;
			nullable<OOX::Logic::CElement>		m_oElement;
		};

		
		
		
		class CCtrlPr;
		class CAccPr : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CAccPr)
			CAccPr()
			{
			}
			virtual ~CAccPr()
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
					if ( _T("m:chr") == sName )
						m_oChr = oReader;
					else if ( _T("m:ctrlPr") == sName )
						m_oCtrlPr = oReader;
				}
			}
			virtual CString      toXML() const;		

			virtual EElementType getType() const
			{
				return et_m_accPr;
			}
		public:
			
			nullable<OOX::Logic::CChr>			m_oChr;
			nullable<OOX::Logic::CCtrlPr>		m_oCtrlPr;
		};

		
		
		
		class CArgPr : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CArgPr)
			CArgPr()
			{
			}
			virtual ~CArgPr()
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
					if ( _T("m:argSz") == sName )
						m_oArgSz = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<m:argPr>");
				
				if ( m_oArgSz.IsInit() )
					sResult += m_oArgSz->toXML();
				
				sResult += _T("</m:argPr>");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_m_argPr;
			}
		public:
			
			nullable<OOX::Logic::CArgSz>		m_oArgSz;

		};		

		
		
		
		class CBarPr;
		class CBar : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CBar)
			CBar()
			{
			}
			virtual ~CBar()
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
					if ( _T("m:barPr") == sName )
						m_oBarPr = oReader;
					else if ( _T("m:e") == sName )
						m_oElement = oReader;
				}
			}
			virtual CString      toXML() const;

			virtual EElementType getType() const
			{
				return et_m_bar;
			}
		public:
			
			nullable<OOX::Logic::CBarPr>		m_oBarPr;
			nullable<OOX::Logic::CElement>		m_oElement;

		};
		
		
		
		class CBarPr : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CBarPr)
			CBarPr()
			{
			}
			virtual ~CBarPr()
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
					if ( _T("m:ctrlPr") == sName )
						m_oCtrlPr = oReader;
					else if ( _T("m:pos") == sName )
						m_oPos = oReader;
				}
			}
			virtual CString      toXML() const;

			virtual EElementType getType() const
			{
				return et_m_barPr;
			}
		public:
			
			nullable<OOX::Logic::CCtrlPr>		m_oCtrlPr;
			nullable<OOX::Logic::CPos>			m_oPos;
		};		

		
		
		
		class CBorderBoxPr;
		class CBorderBox : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CBorderBox)
			CBorderBox()
			{
			}
			virtual ~CBorderBox()
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
					if ( _T("m:borderBoxPr") == sName )
						m_oBorderBoxPr = oReader;
					else if ( _T("m:e") == sName )
						m_oElement = oReader;
				}
			}
			virtual CString      toXML() const;

			virtual EElementType getType() const
			{
				return et_m_borderBox;
			}
		public:
			
			nullable<OOX::Logic::CBorderBoxPr>	 m_oBorderBoxPr;
			nullable<OOX::Logic::CElement>		 m_oElement;
		};		 

		
		
		
		class CBorderBoxPr : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CBorderBoxPr)
			CBorderBoxPr()
			{
			}
			virtual ~CBorderBoxPr()
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
					if ( _T("m:ctrlPr") == sName )
						m_oCtrlPr = oReader;
					else if ( _T("m:hideBot") == sName )
						m_oHideBot = oReader;
					else if ( _T("m:hideLeft") == sName )
						m_oHideLeft = oReader;
					else if ( _T("m:hideRight") == sName )
						m_oHideRight = oReader;
					else if ( _T("m:hideTop") == sName )
						m_oHideTop = oReader;
					else if ( _T("m:strikeBLTR") == sName )
						m_oStrikeBLTR = oReader;
					else if ( _T("m:strikeH") == sName )
						m_oStrikeH = oReader;
					else if ( _T("m:strikeTLBR") == sName )
						m_oStrikeTLBR = oReader;
					else if ( _T("m:strikeV") == sName )
						m_oStrikeV = oReader;
				}
			}
			virtual CString      toXML() const;

			virtual EElementType getType() const
			{
				return et_m_borderBoxPr;
			}
		public:
			
			nullable<OOX::Logic::CCtrlPr>			 m_oCtrlPr;
			nullable<OOX::Logic::CHideBot>			 m_oHideBot;
			nullable<OOX::Logic::CHideLeft>			 m_oHideLeft;
			nullable<OOX::Logic::CHideRight>		 m_oHideRight;
			nullable<OOX::Logic::CHideTop>			 m_oHideTop;
			nullable<OOX::Logic::CStrikeBLTR>		 m_oStrikeBLTR;
			nullable<OOX::Logic::CStrikeH>			 m_oStrikeH;
			nullable<OOX::Logic::CStrikeTLBR>		 m_oStrikeTLBR;
			nullable<OOX::Logic::CStrikeV>			 m_oStrikeV;
		};
		
		
		
		class CBoxPr;
		class CBox : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CBox)
			CBox()
			{
			}
			virtual ~CBox()
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
					if ( _T("m:boxPr") == sName )
						m_oBoxPr = oReader;
					else if ( _T("m:e") == sName )
						m_oElement = oReader;
				}
			}
			virtual CString      toXML() const;

			virtual EElementType getType() const
			{
				return et_m_box;
			}
		public:
			
			nullable<OOX::Logic::CBoxPr>			 m_oBoxPr;
			nullable<OOX::Logic::CElement>			 m_oElement;
		};		 

		
		
		
		class CBrk;
		class CBoxPr : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CBoxPr)
			CBoxPr()
			{
			}
			virtual ~CBoxPr()
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
					if ( _T("m:aln") == sName )
						m_oAln = oReader;
					else if ( _T("m:brk") == sName )
						m_oBrk = oReader;
					else if ( _T("m:ctrlPr") == sName )
						m_oCtrlPr = oReader;
					else if ( _T("m:diff") == sName )
						m_oDiff = oReader;
					else if ( _T("m:noBreak") == sName )
						m_oNoBreak = oReader;
					else if ( _T("m:opEmu") == sName )
						m_oOpEmu = oReader;
				}
			}
			virtual CString      toXML() const;

			virtual EElementType getType() const
			{
				return et_m_boxPr;
			}

		public:
			
			nullable<OOX::Logic::CAln>			 m_oAln;
			nullable<OOX::Logic::CBrk>			 m_oBrk;
			nullable<OOX::Logic::CCtrlPr>		 m_oCtrlPr;
			nullable<OOX::Logic::CDiff>			 m_oDiff;
			nullable<OOX::Logic::CNoBreak>		 m_oNoBreak;
			nullable<OOX::Logic::COpEmu>		 m_oOpEmu;
		};		

		
		
		
		class CBrk : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CBrk)
			CBrk()
			{
			}
			virtual ~CBrk()
			{
			}

		public:
			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("m:alnAt"), m_alnAt );
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader) 
			{
				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<m:brk m:alnAt=\"");
				sResult += m_alnAt->ToString();
				sResult += _T("\" />");
				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_m_brk;
			}
		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_ReadSingle( oReader, _T("m:alnAt"), m_alnAt )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:
			
			nullable<SimpleTypes::CInteger255<>> m_alnAt;
		};

		
		
		
		class CCtrlPr : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CCtrlPr)
			CCtrlPr()
			{
			}
			virtual ~CCtrlPr()
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
					if ( _T("w:rPr") == sName )
						m_oRPr = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<m:ctrlPr>");

				if ( m_oRPr.IsInit() )
					sResult += m_oRPr->toXML();
				
				sResult += _T("</m:ctrlPr>");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_m_ctrlPr;
			}
		public:			
			
			nullable<OOX::Logic::CRunProperty> m_oRPr;
		};		
		
		
		
		class CDelimiterPr : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CDelimiterPr)
			CDelimiterPr()
			{
			}
			virtual ~CDelimiterPr()
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
					if ( _T("m:begChr") == sName )
						m_oBegChr = oReader;
					else if ( _T("m:ctrlPr") == sName )
						m_oCtrlPr = oReader;
					else if ( _T("m:endChr") == sName )
						m_oEndChr = oReader;
					else if ( _T("m:grow") == sName )
						m_oGrow = oReader;
					else if ( _T("m:sepChr") == sName )
						m_oSepChr = oReader;
					else if ( _T("m:shp") == sName )
						m_oShp = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<m:dPr>");

				if ( m_oBegChr.IsInit() )
					sResult += m_oBegChr->toXML();

				if ( m_oCtrlPr.IsInit() )
					sResult += m_oCtrlPr->toXML();

				if ( m_oEndChr.IsInit() )
					sResult += m_oEndChr->toXML();

				if ( m_oGrow.IsInit() )
					sResult += m_oGrow->toXML();

				if ( m_oSepChr.IsInit() )
					sResult += m_oSepChr->toXML();

				if ( m_oShp.IsInit() )
					sResult += m_oShp->toXML();
				
				sResult += _T("</m:dPr>");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_m_dPr;
			}
		public:				
				
				nullable<OOX::Logic::CBegChr>		m_oBegChr;
				nullable<OOX::Logic::CCtrlPr>		m_oCtrlPr;
				nullable<OOX::Logic::CEndChr>		m_oEndChr;
				nullable<OOX::Logic::CGrow>			m_oGrow;
				nullable<OOX::Logic::CSepChr>		m_oSepChr;
				nullable<OOX::Logic::CShp>			m_oShp;
		};		
		
		
		
		class CDelimiter : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CDelimiter)
			CDelimiter()
			{
			}
			virtual ~CDelimiter()
			{
				Clear();
			}

		public:
			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader) 
			{
				m_lColumn = 0;
				if ( oReader.IsEmptyNode() )
					return;

				int nCurDepth = oReader.GetDepth();
				while( oReader.ReadNextSiblingNode( nCurDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();				
					WritingElement *pItem = NULL;

					if ( _T("m:dPr") == sName )
						pItem = new CDelimiterPr( oReader );
					else if ( _T("m:e") == sName )
					{
						pItem = new CElement( oReader );
						
						m_lColumn++;
					}

					if ( pItem )
						m_arrItems.Add( pItem );
					
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<m:d>");

				for ( int nIndex = 0; nIndex < m_arrItems.GetSize(); nIndex++ )
				{
					if ( m_arrItems[nIndex])
					{
						sResult += m_arrItems[nIndex]->toXML();
					}
				}
				
				sResult += _T("</m:d>");

				return sResult;
			}

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

			virtual EElementType getType() const
			{
				return et_m_d;
			}
		public:
			
			CSimpleArray<WritingElement *> m_arrItems;
			LONG						   m_lColumn;
		};
		
		
		
		class CEqArrPr : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CEqArrPr)
			CEqArrPr()
			{
			}
			virtual ~CEqArrPr()
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
					if ( _T("m:baseJc") == sName )
						m_oBaseJc = oReader;
					else if ( _T("m:ctrlPr") == sName )
						m_oCtrlPr = oReader;
					else if ( _T("m:maxDist") == sName )
						m_oMaxDist = oReader;
					else if ( _T("m:objDist") == sName )
						m_oObjDist = oReader;
					else if ( _T("m:rSp") == sName )
						m_oRSp = oReader;
					else if ( _T("m:rSpRule") == sName )
						m_oRSpRule = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<m:eqArrPr>");

				if ( m_oBaseJc.IsInit() )
					sResult += m_oBaseJc->toXML();

				if ( m_oCtrlPr.IsInit() )
					sResult += m_oCtrlPr->toXML();

				if ( m_oMaxDist.IsInit() )
					sResult += m_oMaxDist->toXML();

				if ( m_oObjDist.IsInit() )
					sResult += m_oObjDist->toXML();

				if ( m_oRSp.IsInit() )
					sResult += m_oRSp->toXML();

				if ( m_oRSpRule.IsInit() )
					sResult += m_oRSpRule->toXML();
				
				sResult += _T("</m:eqArrPr>");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_m_eqArrPr;
			}
		public:				
			
			nullable<OOX::Logic::CBaseJc>		m_oBaseJc;
			nullable<OOX::Logic::CCtrlPr>		m_oCtrlPr;
			nullable<OOX::Logic::CMaxDist>		m_oMaxDist;
			nullable<OOX::Logic::CObjDist>		m_oObjDist;
			nullable<OOX::Logic::CRSp>			m_oRSp;
			nullable<OOX::Logic::CRSpRule>		m_oRSpRule;
		};
		
		
		
		class CEqArr : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CEqArr)
			CEqArr()
			{
			}
			virtual ~CEqArr()
			{
				Clear();
			}

		public:
			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader) 
			{
				m_lRow = 0;
				if ( oReader.IsEmptyNode() )
					return;

				int nCurDepth = oReader.GetDepth();
				while( oReader.ReadNextSiblingNode( nCurDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();				
					WritingElement *pItem = NULL;

					if ( _T("m:eqArrPr") == sName )
						pItem = new CEqArrPr( oReader );
					else if ( _T("m:e") == sName )
					{
						pItem = new CElement( oReader );
						m_lRow++;
					}


					if ( pItem )
						m_arrItems.Add( pItem );
					
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<m:eqArr>");

				for ( int nIndex = 0; nIndex < m_arrItems.GetSize(); nIndex++ )
				{
					if ( m_arrItems[nIndex])
					{
						sResult += m_arrItems[nIndex]->toXML();
					}
				}
				
				sResult += _T("</m:eqArr>");

				return sResult;
			}

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

			virtual EElementType getType() const
			{
				return et_m_eqArr;
			}
		public:
			
			CSimpleArray<WritingElement *>	m_arrItems;
			LONG							m_lRow;
		};				
		
		
		
		class CFPr;
		class CFraction : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CFraction)
			CFraction()
			{
			}
			virtual ~CFraction()
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
					if ( _T("m:den") == sName )
						m_oDen = oReader;
					else if ( _T("m:fPr") == sName )
						m_oFPr = oReader;
					else if ( _T("m:num") == sName )
						m_oNum = oReader;
				}
			}
			virtual CString      toXML() const;

			virtual EElementType getType() const
			{
				return et_m_f;
			}
		public:				
			
			nullable<OOX::Logic::CDen>			m_oDen;
			nullable<OOX::Logic::CFPr>			m_oFPr;
			nullable<OOX::Logic::CNum>			m_oNum;
		};		

		
		
		
		class CFPr : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CFPr)
			CFPr()
			{
			}
			virtual ~CFPr()
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
					if ( _T("m:ctrlPr") == sName )
						m_oCtrlPr = oReader;
					else if ( _T("m:type") == sName )
						m_oType = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<m:fPr>");

				if ( m_oCtrlPr.IsInit() )
					sResult += m_oCtrlPr->toXML();

				if ( m_oType.IsInit() )
					sResult += m_oType->toXML();
				
				sResult += _T("</m:fPr>");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_m_fPr;
			}
		public:				
			
			nullable<OOX::Logic::CCtrlPr>		m_oCtrlPr;
			nullable<OOX::Logic::CType>			m_oType;
		};		
		
		
		
		class CFuncPr;
		class CFunc : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CFunc)
			CFunc()
			{
			}
			virtual ~CFunc()
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
					if ( _T("m:e") == sName )
						m_oElement = oReader;
					else if ( _T("m:fName") == sName )
						m_oFName = oReader;
					else if ( _T("m:funcPr") == sName )
						m_oFuncPr = oReader;
				}
			}
			virtual CString      toXML() const;

			virtual EElementType getType() const
			{
				return et_m_func;
			}
		public:				
			
			nullable<OOX::Logic::CElement>		m_oElement;
			nullable<OOX::Logic::CFName>		m_oFName;
			nullable<OOX::Logic::CFuncPr>		m_oFuncPr;
		};		
		
		
		
		class CFuncPr : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CFuncPr)
			CFuncPr()
			{
			}
			virtual ~CFuncPr()
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
					if ( _T("m:ctrlPr") == sName )
						m_oCtrlPr = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<m:funcPr>");

				if ( m_oCtrlPr.IsInit() )
					sResult += m_oCtrlPr->toXML();
				
				sResult += _T("</m:funcPr>");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_m_funcPr;
			}
		public:				
			
			nullable<OOX::Logic::CCtrlPr>		m_oCtrlPr;
		};		
		
		
		
		class CGroupChrPr;
		class CGroupChr : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CGroupChr)
			CGroupChr()
			{
			}
			virtual ~CGroupChr()
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
					if ( _T("m:e") == sName )
						m_oElement = oReader;
					else if ( _T("m:groupChrPr") == sName )
						m_oGroupChrPr = oReader;
				}
			}
			virtual CString      toXML() const;

			virtual EElementType getType() const
			{
				return et_m_groupChr;
			}
		public:				
			
			nullable<OOX::Logic::CElement>		m_oElement;
			nullable<OOX::Logic::CGroupChrPr>	m_oGroupChrPr;
		};

		
		
		
		class CGroupChrPr : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CGroupChrPr)
			CGroupChrPr()
			{
			}
			virtual ~CGroupChrPr()
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
					if ( _T("m:chr") == sName )
						m_oChr = oReader;
					else if ( _T("m:ctrlPr") == sName )
						m_oCtrlPr = oReader;
					else if ( _T("m:pos") == sName )
						m_oPos = oReader;
					else if ( _T("m:vertJc") == sName )
						m_oVertJc = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<m:groupChrPr>");

				if ( m_oChr.IsInit() )
					sResult += m_oChr->toXML();

				if ( m_oCtrlPr.IsInit() )
					sResult += m_oCtrlPr->toXML();

				if ( m_oPos.IsInit() )
					sResult += m_oPos->toXML();

				if ( m_oVertJc.IsInit() )
					sResult += m_oVertJc->toXML();
				
				sResult += _T("</m:groupChrPr>");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_m_groupChrPr;
			}
		public:				
			
			nullable<OOX::Logic::CChr>			m_oChr;
			nullable<OOX::Logic::CCtrlPr>		m_oCtrlPr;
			nullable<OOX::Logic::CPos>			m_oPos;
			nullable<OOX::Logic::CVertJc>		m_oVertJc;
		};

		
		
		
		class CLimLowPr;
		class CLimLow : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CLimLow)
			CLimLow()
			{
			}
			virtual ~CLimLow()
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
					if ( _T("m:e") == sName )
						m_oElement = oReader;
					else if ( _T("m:lim") == sName )
						m_oLim = oReader;
					else if ( _T("m:limLowPr") == sName )
						m_oLimLowPr = oReader;
				}
			}
			virtual CString      toXML() const;

			virtual EElementType getType() const
			{
				return et_m_limLow;
			}
		public:				
			
			nullable<OOX::Logic::CElement>		 m_oElement;
			nullable<OOX::Logic::CLim>			 m_oLim;
			nullable<OOX::Logic::CLimLowPr>		 m_oLimLowPr;
		};		
		
		
		
		class CLimLowPr : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CLimLowPr)
			CLimLowPr()
			{
			}
			virtual ~CLimLowPr()
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
					if ( _T("m:ctrlPr") == sName )
						m_oCtrlPr = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<m:limLowPr>");

				if ( m_oCtrlPr.IsInit() )
					sResult += m_oCtrlPr->toXML();
				
				sResult += _T("</m:limLowPr>");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_m_limLowPr;
			}
		public:				
			
			nullable<OOX::Logic::CCtrlPr>		 m_oCtrlPr;
		};		 
		
		
		
		class CLimUppPr;
		class CLimUpp : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CLimUpp)
			CLimUpp()
			{
			}
			virtual ~CLimUpp()
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
					if ( _T("m:e") == sName )
						m_oElement = oReader;
					else if ( _T("m:lim") == sName )
						m_oLim = oReader;
					else if ( _T("m:limUppPr") == sName )
						m_oLimUppPr = oReader;
				}
			}
			virtual CString      toXML() const;

			virtual EElementType getType() const
			{
				return et_m_limUpp;
			}
		public:				
			
			nullable<OOX::Logic::CElement>		 m_oElement;
			nullable<OOX::Logic::CLim>			 m_oLim;
			nullable<OOX::Logic::CLimUppPr>		 m_oLimUppPr;
		};		
		
		
		
		class CLimUppPr : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CLimUppPr)
			CLimUppPr()
			{
			}
			virtual ~CLimUppPr()
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
					if ( _T("m:ctrlPr") == sName )
						m_oCtrlPr = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<m:limUppPr>");

				if ( m_oCtrlPr.IsInit() )
					sResult += m_oCtrlPr->toXML();
				
				sResult += _T("</m:limUppPr>");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_m_limUppPr;
			}
		public:				
			
			nullable<OOX::Logic::CCtrlPr>		 m_oCtrlPr;
		};		
		
		
		
		
		class CMathFont : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CMathFont)
			CMathFont()
			{
			}
			virtual ~CMathFont()
			{
			}

		public:
			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("m:val"), m_val );
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader) 
			{
				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<m:mathFont m:val=\"");
				sResult += m_val->GetString();
				sResult += _T("\" />");
				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_m_mathFont;
			}
		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_ReadSingle( oReader, _T("m:val"), m_val )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:
			
			nullable<CString> m_val;
		};			 

		
		
		
		class CMathPr : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CMathPr)
			CMathPr()
			{
			}
			virtual ~CMathPr()
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

				int nCurDepth = oReader.GetDepth();
				while( oReader.ReadNextSiblingNode( nCurDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();				
					WritingElement *pItem = NULL;

					if ( _T("m:brkBin") == sName )
						pItem = new Logic::CBrkBin( oReader );
					else if ( _T("m:brkBinSub") == sName )
						pItem = new CBrkBinSub( oReader );
					else if ( _T("m:defJc") == sName )
						pItem = new CDefJc( oReader );
					else if ( _T("w:dispDef") == sName )
						pItem = new CDispDef( oReader );
					else if ( _T("w:interSp") == sName )
						pItem = new CInterSp( oReader );
					else if ( _T("m:intLim") == sName )
						pItem = new CIntLim( oReader );
					else if ( _T("m:intraSp") == sName )
						pItem = new CIntraSp( oReader );							
					else if ( _T("m:lMargin") == sName )
						pItem = new CLMargin( oReader );
					else if ( _T("m:mathFont") == sName )
						pItem = new CMathFont( oReader );
					else if ( _T("m:naryLim") == sName )
						pItem = new CNaryLim( oReader );
					else if ( _T("m:postSp") == sName )
						pItem = new CPostSp( oReader );
					else if ( _T("m:preSp") == sName )
						pItem = new CPreSp( oReader );
					else if ( _T("m:rMargin") == sName )
						pItem = new CRMargin( oReader );
					else if ( _T("m:smallFrac") == sName )
						pItem = new CSmallFrac( oReader );
					else if ( _T("m:wrapIndent") == sName )
						pItem = new CWrapIndent( oReader );
					else if ( _T("m:wrapRight") == sName )
						pItem = new CWrapRight( oReader );

					if ( pItem )
						m_arrItems.Add( pItem );
					
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<m:mathPr>");

				for ( int nIndex = 0; nIndex < m_arrItems.GetSize(); nIndex++ )
				{
					if ( m_arrItems[nIndex])
					{
						sResult += m_arrItems[nIndex]->toXML();
					}
				}
				
				sResult += _T("</m:mathPr>");

				return sResult;
			}

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

			virtual EElementType getType() const
			{
				return et_m_mathPr;
			}
		public:
			
			CSimpleArray<WritingElement *> m_arrItems;
		};		
		
		
		
		class CMcPr;
		class CMc : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CMc)
			CMc()
			{
			}
			virtual ~CMc()
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
					if ( _T("m:mcPr") == sName )
						m_oMcPr = oReader;
				}
			}
			virtual CString      toXML() const;

			virtual EElementType getType() const
			{
				return et_m_mc;
			}
		public:				
			
			nullable<OOX::Logic::CMcPr>		m_oMcPr;
		};		
		
		
		
		class CMcPr : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CMcPr)
			CMcPr()
			{
			}
			virtual ~CMcPr()
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
					if ( _T("m:count") == sName )
						m_oCount = oReader;
					else if ( _T("m:mcJc") == sName )
						m_oMcJc = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<m:mcPr>");

				if ( m_oCount.IsInit() )
					sResult += m_oCount->toXML();

				if ( m_oMcJc.IsInit() )
					sResult += m_oMcJc->toXML();
				
				sResult += _T("</m:mcPr>");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_m_mcPr;
			}
		public:				
			
			nullable<OOX::Logic::CCount>		m_oCount;
			nullable<OOX::Logic::CMcJc>			m_oMcJc;
		};		
		
		
		
		class CMcs : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CMcs)
			CMcs()
			{
			}
			virtual ~CMcs()
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
					if ( _T("m:mc") == sName )
						m_oMc = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<m:mcs>");

				if ( m_oMc.IsInit() )
					sResult += m_oMc->toXML();
				
				sResult += _T("</m:mcs>");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_m_mcs;
			}
		public:				
			
			nullable<OOX::Logic::CMc>		m_oMc;
		};
		
		
		
		class CMPr : public WritingElement
		{
		public:
			CMPr()
			{
			}
			CMPr(XmlUtils::CXmlNode &oNode)
			{
				fromXML( oNode );
			}
			CMPr(XmlUtils::CXmlLiteReader& oReader)
			{
				fromXML( oReader );
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

					if ( _T("m:baseJc") == sName )
						m_oBaseJc = oReader;
					else if ( _T("m:cGp") == sName )
						m_oCGp = oReader;						
					else if ( _T("m:cGpRule") == sName )
						m_oCGpRule = oReader;
					else if ( _T("m:cSp") == sName )
						m_oCSp = oReader;
					else if ( _T("m:ctrlPr") == sName )
						m_oCtrlPr = oReader;
					else if ( _T("m:mcs") == sName )
						m_oMcs = oReader;
					else if ( _T("m:plcHide") == sName )
						m_oPlcHide = oReader;
					else if ( _T("m:rSp") == sName )
						m_oRSp = oReader;
					else if ( _T("m:rSpRule") == sName )
						m_oRSpRule = oReader;							
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<m:mPr>");

				if ( m_oBaseJc.IsInit() )
					sResult += m_oBaseJc->toXML();
				if ( m_oCGp.IsInit() )
					sResult += m_oCGp->toXML();
				if ( m_oCGpRule.IsInit() )
					sResult += m_oCGpRule->toXML();
				if ( m_oCSp.IsInit() )
					sResult += m_oCSp->toXML();
				if ( m_oCtrlPr.IsInit() )
					sResult += m_oCtrlPr->toXML();
				if ( m_oMcs.IsInit() )
					sResult += m_oMcs->toXML();
				if ( m_oPlcHide.IsInit() )
					sResult += m_oPlcHide->toXML();
				if ( m_oRSp.IsInit() )
					sResult += m_oRSp->toXML();
				if ( m_oRSpRule.IsInit() )
					sResult += m_oRSpRule->toXML();
				
				sResult += _T("</m:mPr>");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_m_mPr;
			}
		public:
			
			nullable<OOX::Logic::CBaseJc>		m_oBaseJc;
			nullable<OOX::Logic::CCGp>			m_oCGp;
			nullable<OOX::Logic::CCGpRule>		m_oCGpRule;
			nullable<OOX::Logic::CCSp>			m_oCSp;
			nullable<OOX::Logic::CCtrlPr>		m_oCtrlPr;
			nullable<OOX::Logic::CMcs>			m_oMcs;
			nullable<OOX::Logic::CPlcHide>		m_oPlcHide;
			nullable<OOX::Logic::CRSp>			m_oRSp;
			nullable<OOX::Logic::CRSpRule>		m_oRSpRule;

		};
		
		
		
		class CMr : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CMr)
			CMr()
			{
			}
			virtual ~CMr()
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

				int nCurDepth = oReader.GetDepth();
				while( oReader.ReadNextSiblingNode( nCurDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();				
					WritingElement *pItem = NULL;

					if ( _T("m:e") == sName )
						pItem = new Logic::CElement( oReader );

					if ( pItem )
						m_arrItems.Add( pItem );
					
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<m:mr>");

				for ( int nIndex = 0; nIndex < m_arrItems.GetSize(); nIndex++ )
				{
					if ( m_arrItems[nIndex])
					{
						sResult += m_arrItems[nIndex]->toXML();
					}
				}
				
				sResult += _T("</m:mr>");

				return sResult;
			}

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

			virtual EElementType getType() const
			{
				return et_m_mr;
			}
		public:				
			
			CSimpleArray<WritingElement *> m_arrItems;
		};
		
		
		
		class CMatrix : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CMatrix)
			CMatrix()
			{
			}
			virtual ~CMatrix()
			{
				Clear();
			}

		public:
			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
			}

			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader) 
			{
				m_lRow = 0;
				if ( oReader.IsEmptyNode() )
					return;

				int nCurDepth = oReader.GetDepth();
				while( oReader.ReadNextSiblingNode( nCurDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();				
					WritingElement *pItem = NULL;

					if ( _T("m:mPr") == sName )
						pItem = new CMPr( oReader );
					else if ( _T("m:mr") == sName )
					{
						pItem = new CMr( oReader );
						m_lRow++;
					}

					if ( pItem )
						m_arrItems.Add( pItem );
					
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<m:m>");

				for ( int nIndex = 0; nIndex < m_arrItems.GetSize(); nIndex++ )
				{
					if ( m_arrItems[nIndex])
					{
						sResult += m_arrItems[nIndex]->toXML();
					}
				}
				
				sResult += _T("</m:m>");

				return sResult;
			}

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

			virtual EElementType getType() const
			{
				return et_m_m;
			}
		public:				
			
			CSimpleArray<WritingElement *> m_arrItems;
			LONG						   m_lRow;
		};
		
		
		
		class CNaryPr;
		class CNary : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CNary)
			CNary()
			{
			}
			virtual ~CNary()
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
					if ( _T("m:e") == sName )
						m_oElement = oReader;
					else if ( _T("m:naryPr") == sName )
						m_oNaryPr = oReader;
					else if ( _T("m:sub") == sName )
						m_oSub = oReader;
					else if ( _T("m:sup") == sName )
						m_oSup = oReader;
				}
			}
			virtual CString      toXML() const;

			virtual EElementType getType() const
			{
				return et_m_nary;
			}
		public:				
			
			nullable<OOX::Logic::CElement>		m_oElement;
			nullable<OOX::Logic::CNaryPr>		m_oNaryPr;
			nullable<OOX::Logic::CSub>			m_oSub;
			nullable<OOX::Logic::CSup>			m_oSup;
		};		
		
		
		
		class CNaryPr : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CNaryPr)
			CNaryPr()
			{
			}
			virtual ~CNaryPr()
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
					if ( _T("m:chr") == sName )
						m_oChr = oReader;
					else if ( _T("m:ctrlPr") == sName )
						m_oCtrlPr = oReader;
					else if ( _T("m:grow") == sName )
						m_oGrow = oReader;
					else if ( _T("m:limLoc") == sName )
						m_oLimLoc = oReader;
					else if ( _T("m:subHide") == sName )
						m_oSubHide = oReader;
					else if ( _T("m:supHide") == sName )
						m_oSupHide = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<m:naryPr>");

				if ( m_oChr.IsInit() )
					sResult += m_oChr->toXML();

				if ( m_oCtrlPr.IsInit() )
					sResult += m_oCtrlPr->toXML();

				if ( m_oGrow.IsInit() )
					sResult += m_oGrow->toXML();

				if ( m_oLimLoc.IsInit() )
					sResult += m_oLimLoc->toXML();

				if ( m_oSubHide.IsInit() )
					sResult += m_oSubHide->toXML();

				if ( m_oSupHide.IsInit() )
					sResult += m_oSupHide->toXML();
				
				sResult += _T("</m:naryPr>");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_m_naryPr;
			}
		public:				
			
			nullable<OOX::Logic::CChr>				m_oChr;
			nullable<OOX::Logic::CCtrlPr>			m_oCtrlPr;
			nullable<OOX::Logic::CGrow>				m_oGrow;
			nullable<OOX::Logic::CLimLoc>			m_oLimLoc;
			nullable<OOX::Logic::CSubHide>			m_oSubHide;
			nullable<OOX::Logic::CSupHide>			m_oSupHide;
		};		
		
		
		
		class COMathParaPr : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(COMathParaPr)
			COMathParaPr()
			{
			}
			virtual ~COMathParaPr()
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
					if ( _T("m:jc") == sName )
						m_oMJc = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<m:oMathParaPr>");

				if ( m_oMJc.IsInit() )
					sResult += m_oMJc->toXML();
				
				sResult += _T("</m:oMathParaPr>");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_m_oMathParaPr;
			}
		public:
				
			
			nullable<OOX::Logic::CMJc>  m_oMJc;
		};			
		
		
		
		class CPhantPr;
		class CPhant : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CPhant)
			CPhant()
			{
			}
			virtual ~CPhant()
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
					if ( _T("m:e") == sName )
						m_oElement = oReader;
					else if ( _T("m:phantPr") == sName )
						m_oPhantPr = oReader;
				}
			}
			virtual CString      toXML() const;

			virtual EElementType getType() const
			{
				return et_m_phant;
			}
		public:				
			
			nullable<OOX::Logic::CElement>  m_oElement;
			nullable<OOX::Logic::CPhantPr>  m_oPhantPr;
		};

		
		
		
		class CPhantPr : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CPhantPr)
			CPhantPr()
			{
			}
			virtual ~CPhantPr()
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
					if ( _T("m:ctrlPr") == sName )
						m_oCtrlPr = oReader;
					else if ( _T("m:show") == sName )
						m_oShow = oReader;
					else if ( _T("m:transp") == sName )
						m_oTransp = oReader;
					else if ( _T("m:zeroAsc") == sName )
						m_oZeroAsc = oReader;
					else if ( _T("m:zeroDesc") == sName )
						m_oZeroDesc = oReader;
					else if ( _T("m:zeroWid") == sName )
						m_oZeroWid = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<m:phantPr>");

				if ( m_oCtrlPr.IsInit() )
					sResult += m_oCtrlPr->toXML();

				if ( m_oShow.IsInit() )
					sResult += m_oShow->toXML();

				if ( m_oTransp.IsInit() )
					sResult += m_oTransp->toXML();

				if ( m_oZeroAsc.IsInit() )
					sResult += m_oZeroAsc->toXML();

				if ( m_oZeroDesc.IsInit() )
					sResult += m_oZeroDesc->toXML();

				if ( m_oZeroWid.IsInit() )
					sResult += m_oZeroWid->toXML();
				
				sResult += _T("</m:oMathPara>");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_m_phantPr;
			}
		public:				
			
			nullable<OOX::Logic::CCtrlPr>			m_oCtrlPr;
			nullable<OOX::Logic::CShow>				m_oShow;
			nullable<OOX::Logic::CTransp>			m_oTransp;
			nullable<OOX::Logic::CZeroAsc>			m_oZeroAsc;
			nullable<OOX::Logic::CZeroDesc>			m_oZeroDesc;
			nullable<OOX::Logic::CZeroWid>			m_oZeroWid;
		};		 
		
		
		
		class CMText;
		class CMRPr;
		class CMRun : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CMRun)
			CMRun()
			{
			}
			virtual ~CMRun()
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
					if ( _T("w:annotationRef") == sName )
						m_oAnnotationRef = oReader;
					else if ( _T("w:br") == sName )
						m_oBr = oReader;
					else if ( _T("w:commentReference") == sName )
						m_oCommentReference = oReader;
					else if ( _T("w:contentPart") == sName )
						m_oContentPart = oReader;
					else if ( _T("w:continuationSeparator") == sName )
						m_oContinuationSeparator = oReader;
					else if ( _T("w:cr") == sName )
						m_oCr = oReader;
					else if ( _T("w:dayLong") == sName )
						m_oDayLong = oReader;
					else if ( _T("w:dayShort") == sName )
						m_oDayShort = oReader;
					else if ( _T("w:delInstrText") == sName )
						m_oDelInstrText = oReader;
					else if ( _T("w:delText") == sName )
						m_oDelText = oReader;
					else if ( _T("w:drawing") == sName ) 
						m_oDrawing = oReader;
					else if ( _T("w:endnoteRef") == sName )
						m_oEndnoteRef = oReader;
					else if ( _T("w:endnoteReference") == sName )
						m_oEndnoteReference = oReader;
					else if ( _T("w:fldChar") == sName )
						m_oFldChar = oReader;
					else if ( _T("w:footnoteRef") == sName )
						m_oFootnoteRef = oReader;
					else if ( _T("w:footnoteReference") == sName )
						m_oFootnoteReference = oReader;
					else if ( _T("w:instrText") == sName )
						m_oInstrText = oReader;
					else if ( _T("w:lastRenderedPageBreak") == sName )
						m_oLastRenderedPageBreak = oReader;
					else if ( _T("w:monthLong") == sName )
						m_oMonthLong = oReader;
					else if ( _T("w:monthShort") == sName )
						m_oMonthShort = oReader;
					else if ( _T("w:noBreakHyphen") == sName )
						m_oNoBreakHyphen = oReader;
					else if ( _T("w:object") == sName )
						m_oObject = oReader;
					else if ( _T("w:pgNum") == sName )
						m_oPgNum = oReader;
					else if ( _T("w:ptab") == sName )
						m_oPtab = oReader;
					else if ( _T("m:rPr") == sName )
						m_oMRPr = oReader ;
					else if ( _T("w:rPr") == sName )
						m_oRPr = oReader;
					else if ( _T("w:ruby") == sName )
						m_oRuby = oReader;
					else if ( _T("w:separator") == sName )
						m_oSeparator = oReader;
					else if ( _T("w:softHyphen") == sName )
						m_oSoftHyphen = oReader;
					else if ( _T("w:sym") == sName )
						m_oSym = oReader;
					else if ( _T("m:t") == sName )
						m_oMText = oReader ;
					else if ( _T("w:t") == sName )
						m_oText = oReader;
					else if ( _T("w:tab") == sName )
						m_oTab = oReader;
					else if ( _T("w:yearLong") == sName )
						m_oYearLong = oReader;
					else if ( _T("w:yearShort") == sName )
						m_oYearShort = oReader;
				}
			}
			virtual CString      toXML() const;			

			virtual EElementType getType() const
			{
				return et_m_r;
			}
		public:
			
			nullable<OOX::Logic::CAnnotationRef>			m_oAnnotationRef;
			nullable<OOX::Logic::CBr>						m_oBr;
			nullable<OOX::Logic::CCommentReference>			m_oCommentReference;
			nullable<OOX::Logic::CContentPart>				m_oContentPart;
			nullable<OOX::Logic::CContinuationSeparator>	m_oContinuationSeparator;
			nullable<OOX::Logic::CCr>						m_oCr;
			nullable<OOX::Logic::CDayLong>					m_oDayLong;
			nullable<OOX::Logic::CDayShort>					m_oDayShort;
			nullable<OOX::Logic::CDelInstrText>				m_oDelInstrText;
			nullable<OOX::Logic::CDelText>					m_oDelText;
			nullable<OOX::Logic::CDrawing>					m_oDrawing;
			nullable<OOX::Logic::CEndnoteRef>				m_oEndnoteRef;
			nullable<OOX::Logic::CEndnoteReference>			m_oEndnoteReference;
			nullable<OOX::Logic::CFldChar>					m_oFldChar;
			nullable<OOX::Logic::CFootnoteRef>				m_oFootnoteRef;
			nullable<OOX::Logic::CFootnoteReference>		m_oFootnoteReference;
			nullable<OOX::Logic::CInstrText>				m_oInstrText;
			nullable<OOX::Logic::CLastRenderedPageBreak>	m_oLastRenderedPageBreak;
			nullable<OOX::Logic::CMonthLong>				m_oMonthLong;
			nullable<OOX::Logic::CMonthShort>				m_oMonthShort;
			nullable<OOX::Logic::CNoBreakHyphen>			m_oNoBreakHyphen;
			nullable<OOX::Logic::CObject>					m_oObject;
			nullable<OOX::Logic::CPgNum>					m_oPgNum;
			nullable<OOX::Logic::CPTab>						m_oPtab;
			nullable<OOX::Logic::CRunProperty>				m_oRPr;
			nullable<OOX::Logic::CMRPr>						m_oMRPr;
			nullable<OOX::Logic::CRuby>						m_oRuby;
			nullable<OOX::Logic::CSeparator>				m_oSeparator;
			nullable<OOX::Logic::CSoftHyphen>				m_oSoftHyphen;
			nullable<OOX::Logic::CSym>						m_oSym;
			nullable<OOX::Logic::CMText>					m_oMText;
			nullable<OOX::Logic::CText>						m_oText;
			nullable<OOX::Logic::CTab>						m_oTab;
			nullable<OOX::Logic::CYearLong>					m_oYearLong;
			nullable<OOX::Logic::CYearShort>				m_oYearShort;
		};		 
		
		
		
		class CRadPr;
		class CRad : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CRad)
			CRad()
			{
			}
			virtual ~CRad()
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
					if ( _T("m:deg") == sName )
						m_oDeg = oReader;
					else if ( _T("m:e") == sName )
						m_oElement = oReader;
					else if ( _T("m:radPr") == sName )
						m_oRadPr = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<m:rad>");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_m_rad;
			}
		public:				
			
			nullable<OOX::Logic::CDeg>				m_oDeg;
			nullable<OOX::Logic::CElement>			m_oElement;
			nullable<OOX::Logic::CRadPr>			m_oRadPr;
		};		 
		
		
		
		class CRadPr : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CRadPr)
			CRadPr()
			{
			}
			virtual ~CRadPr()
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
					if ( _T("m:ctrlPr") == sName )
						m_oCtrlPr = oReader;
					else if ( _T("m:degHide") == sName )
						m_oDegHide = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<m:radPr>");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_m_radPr;
			}
		public:				
			
			nullable<OOX::Logic::CCtrlPr>				m_oCtrlPr;
			nullable<OOX::Logic::CDegHide>				m_oDegHide;
		};		
		
		
		
		class CMRPr : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CMRPr)
			CMRPr()
			{
			}
			virtual ~CMRPr()
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
					if ( _T("m:aln") == sName )
						m_oAln = oReader;
					else if ( _T("m:brk") == sName )
						m_oBrk = oReader;
					else if ( _T("m:lit") == sName )
						m_oLit = oReader;
					else if ( _T("m:nor") == sName )
						m_oNor = oReader;
					else if ( _T("m:scr") == sName )
						m_oScr = oReader;
					else if ( _T("m:sty") == sName )
						m_oSty = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<m:rPr>");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_m_rPr;
			}
		public:				
			
			nullable<OOX::Logic::CAln>			m_oAln;
			nullable<OOX::Logic::CBrk>			m_oBrk;
			nullable<OOX::Logic::CLit>			m_oLit;
			nullable<OOX::Logic::CNor>			m_oNor;
			nullable<OOX::Logic::CScr>			m_oScr;
			nullable<OOX::Logic::CSty>			m_oSty;
		};		
		
		
		
		class CSPrePr;
		class CSPre : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CSPre)
			CSPre()
			{
			}
			virtual ~CSPre()
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
					if ( _T("m:e") == sName )
						m_oElement = oReader;
					else if ( _T("m:sPrePr") == sName )
						m_oSPrePr = oReader;
					else if ( _T("m:sub") == sName )
						m_oSub = oReader;
					else if ( _T("m:sup") == sName )
						m_oSup = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<m:sPre>");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_m_sPre;
			}
		public:				
			
			nullable<OOX::Logic::CElement>		m_oElement;
			nullable<OOX::Logic::CSPrePr>		m_oSPrePr;
			nullable<OOX::Logic::CSub>			m_oSub;
			nullable<OOX::Logic::CSup>			m_oSup;
		};


		
		
		
		class CSPrePr : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CSPrePr)
			CSPrePr()
			{
			}
			virtual ~CSPrePr()
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
					if ( _T("m:ctrlPr") == sName )
						m_oCtrlPr = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<m:sPrePr>");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_m_sPrePr;
			}
		public:				
			
			nullable<OOX::Logic::CCtrlPr>		m_oCtrlPr;
		};		
		
		
		
		class CSSubPr;
		class CSSub : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CSSub)
			CSSub()
			{
			}
			virtual ~CSSub()
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
					if ( _T("m:e") == sName )
						m_oElement = oReader;
					else if ( _T("m:sSubPr") == sName )
						m_oSSubPr = oReader;
					else if ( _T("m:sub") == sName )
						m_oSub = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<m:sSub>");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_m_sSub;
			}
		public:				
			
			nullable<OOX::Logic::CElement>		m_oElement;
			nullable<OOX::Logic::CSSubPr>		m_oSSubPr;
			nullable<OOX::Logic::CSub>			m_oSub;
		};


		
		
		
		class CSSubPr : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CSSubPr)
			CSSubPr()
			{
			}
			virtual ~CSSubPr()
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
					if ( _T("m:ctrlPr") == sName )
						m_oCtrlPr = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<m:sSubPr>");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_m_sSubPr;
			}
		public:				
			
			nullable<OOX::Logic::CCtrlPr>		m_oCtrlPr;
		};		
		
		
		
		class CSSubSupPr;
		class CSSubSup : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CSSubSup)
			CSSubSup()
			{
			}
			virtual ~CSSubSup()
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
					if ( _T("m:e") == sName )
						m_oElement = oReader;
					else if ( _T("m:sSubSupPr") == sName )
						m_oSSubSupPr = oReader;
					else if ( _T("m:sub") == sName )
						m_oSub = oReader;
					else if ( _T("m:sup") == sName )
						m_oSup = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<m:sSubSup>");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_m_sSubSup;
			}
		public:				
			
			nullable<OOX::Logic::CElement>		m_oElement;
			nullable<OOX::Logic::CSSubSupPr>	m_oSSubSupPr;
			nullable<OOX::Logic::CSub>			m_oSub;
			nullable<OOX::Logic::CSup>			m_oSup;
		};		
		
		
		
		class CSSubSupPr : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CSSubSupPr)
			CSSubSupPr()
			{
			}
			virtual ~CSSubSupPr()
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
					if ( _T("m:alnScr") == sName )
						m_oAlnScr = oReader;
					else if ( _T("m:ctrlPr") == sName )
						m_oCtrlPr = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<m:sSubSupPr>");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_m_sSubSupPr;
			}
		public:				
			
			nullable<OOX::Logic::CAlnScr>		m_oAlnScr;
			nullable<OOX::Logic::CCtrlPr>		m_oCtrlPr;
		};		
		
		
		
		class CSSupPr;
		class CSSup : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CSSup)
			CSSup()
			{
			}
			virtual ~CSSup()
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
					if ( _T("m:e") == sName )
						m_oElement = oReader;
					else if ( _T("m:sSupPr") == sName )
						m_oSSupPr = oReader;
					else if ( _T("m:sup") == sName )
						m_oSup = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<m:sSup>");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_m_sSup;
			}
		public:				
			
			nullable<OOX::Logic::CElement>		m_oElement;
			nullable<OOX::Logic::CSSupPr>		m_oSSupPr;
			nullable<OOX::Logic::CSup>			m_oSup;
		};


		
		
		
		class CSSupPr : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CSSupPr)
			CSSupPr()
			{
			}
			virtual ~CSSupPr()
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
					if ( _T("m:ctrlPr") == sName )
						m_oCtrlPr = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<m:sSupPr>");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_m_sSupPr;
			}
		public:				
			
			nullable<OOX::Logic::CCtrlPr>		m_oCtrlPr;
		};		
		
		
		
		class CMText : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CMText)
			CMText() 
			{
			}
			virtual ~CMText() 
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("xml:space"), m_oSpace );

				m_sText = oNode.GetText();
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( oReader.IsEmptyNode() )
					return;

				m_sText = oReader.GetText2();
			}
			virtual CString      toXML() const
			{
				CString sResult;
				
				if ( m_oSpace.IsInit() )
					sResult.Format( _T("<m:t xml:space=\"%s\">"), m_oSpace->ToString() );
				else
					sResult = _T("<m:t>");

				sResult += m_sText;
				sResult += _T("</m:t>");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_m_t;
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
					if ( _T("xml:space") == wsName )
					{
						m_oSpace = oReader.GetText();
						break;
					}

					if ( !oReader.MoveToNextAttribute() )
						break;

					wsName = oReader.GetName();
				}

				oReader.MoveToElement();
			}

		public:

			
			nullable<SimpleTypes::CXmlSpace<> > m_oSpace;
			
			CString                             m_sText;

		};		
	} 
} 

