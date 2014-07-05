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
 #include "TableProperty.h"

namespace OOX
{
	namespace Logic
	{
		
		
		
		CTblPrChange::CTblPrChange()
		{
			m_pTblPr.Init();
			m_pTblPr->m_bTblPrChange = true;
		}
		CTblPrChange::CTblPrChange(XmlUtils::CXmlNode& oNode)
		{
			m_pTblPr.Init();
			m_pTblPr->m_bTblPrChange = true;

			fromXML( oNode );
		}
		CTblPrChange::CTblPrChange(XmlUtils::CXmlLiteReader& oReader)
		{
			m_pTblPr.Init();
			m_pTblPr->m_bTblPrChange = true;

			fromXML( oReader );
		}
		CTblPrChange::~CTblPrChange()
		{
		}
		const CTblPrChange& CTblPrChange::operator = (const XmlUtils::CXmlNode &oNode)
		{
			fromXML( (XmlUtils::CXmlNode &)oNode );
			return *this;
		}
		const CTblPrChange& CTblPrChange::operator = (const XmlUtils::CXmlLiteReader& oReader)
		{
			fromXML( (XmlUtils::CXmlLiteReader&)oReader );
			return *this;
		}
		void CTblPrChange::fromXML(XmlUtils::CXmlNode& oNode)
		{
			if ( _T("w:tblPrChange") != oNode.GetName() )
				return;

			oNode.ReadAttributeBase( _T("w:author"), m_sAuthor );
			oNode.ReadAttributeBase( _T("w:date"),   m_oDate );
			oNode.ReadAttributeBase( _T("w:id"),     m_oId );

			XmlUtils::CXmlNode oNode_tblPr;

			if ( m_pTblPr.IsInit() && oNode.GetNode( _T("w:tblPr"), oNode_tblPr ) )
				m_pTblPr->fromXML( oNode_tblPr );

		}
		void CTblPrChange::fromXML(XmlUtils::CXmlLiteReader& oReader)
		{
			ReadAttributes( oReader );

			if ( oReader.IsEmptyNode() )
				return;

			int nParentDepth = oReader.GetDepth();
			while( oReader.ReadNextSiblingNode( nParentDepth ) )
			{
				CWCharWrapper sName = oReader.GetName();
				if ( m_pTblPr.IsInit() && _T("w:tblPr") == sName )
					m_pTblPr->fromXML( oReader );
			}
		}
		CString CTblPrChange::toXML() const
		{			
			CString sResult = _T("<w:tblPrChange ");

			if ( m_sAuthor.IsInit() )
			{
				sResult += "w:author=\"";
				sResult += m_sAuthor->GetString();
				sResult += "\" ";
			}

			if ( m_oDate.IsInit() )
			{
				sResult += "w:date=\"";
				sResult += m_oDate->ToString();
				sResult += "\" ";
			}

			if ( m_oId.IsInit() )
			{
				sResult += "w:id=\"";
				sResult += m_oId->ToString();
				sResult += "\" ";
			}

			sResult += _T(">");

			if ( m_pTblPr.IsInit() )
				sResult += m_pTblPr->toXML();

			sResult += _T("</w:tblPrChange>");

			return sResult;
		}
		EElementType CTblPrChange::getType() const
		{
			return et_w_tblPrChange;
		}
		void CTblPrChange::ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
		{
			
			WritingElement_ReadAttributes_Start( oReader )
			WritingElement_ReadAttributes_Read_if     ( oReader, _T("w:author"), m_sAuthor )
			WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:date"),   m_oDate )
			WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:id"),     m_oId )
			WritingElement_ReadAttributes_End( oReader )
		}
	} 
} 
namespace OOX
{
	namespace Logic
	{
		
		
		
		CTrPrChange::CTrPrChange()
		{
			m_pTrPr.Init();
			m_pTrPr->m_bTrPrChange = true;
		}
		CTrPrChange::CTrPrChange(XmlUtils::CXmlNode& oNode)
		{
			m_pTrPr.Init();
			m_pTrPr->m_bTrPrChange = true;

			fromXML( oNode );
		}
		CTrPrChange::CTrPrChange(XmlUtils::CXmlLiteReader& oReader)
		{
			m_pTrPr.Init();
			m_pTrPr->m_bTrPrChange = true;

			fromXML( oReader );
		}
		CTrPrChange::~CTrPrChange()
		{
		}
		const CTrPrChange& CTrPrChange::operator = (const XmlUtils::CXmlNode &oNode)
		{
			fromXML( (XmlUtils::CXmlNode &)oNode );
			return *this;
		}
		const CTrPrChange& CTrPrChange::operator = (const XmlUtils::CXmlLiteReader& oReader)
		{
			fromXML( (XmlUtils::CXmlLiteReader&)oReader );
			return *this;
		}
		void CTrPrChange::fromXML(XmlUtils::CXmlNode& oNode)
		{
			if ( _T("w:trPrChange") != oNode.GetName() )
				return;

			oNode.ReadAttributeBase( _T("w:author"), m_sAuthor );
			oNode.ReadAttributeBase( _T("w:date"),   m_oDate );
			oNode.ReadAttributeBase( _T("w:id"),     m_oId );

			XmlUtils::CXmlNode oNode_tblPr;

			if ( m_pTrPr.IsInit() && oNode.GetNode( _T("w:trPr"), oNode_tblPr ) )
				m_pTrPr->fromXML( oNode_tblPr );

		}
		void CTrPrChange::fromXML(XmlUtils::CXmlLiteReader& oReader)
		{
			ReadAttributes( oReader );

			if ( oReader.IsEmptyNode() )
				return;

			int nParentDepth = oReader.GetDepth();
			while( oReader.ReadNextSiblingNode( nParentDepth ) )
			{
				CWCharWrapper sName = oReader.GetName();
				if ( m_pTrPr.IsInit() && _T("w:trPr") == sName )
					m_pTrPr->fromXML( oReader );
			}
		}
		CString CTrPrChange::toXML() const
		{			
			CString sResult = _T("<w:trPrChange ");

			if ( m_sAuthor.IsInit() )
			{
				sResult += "w:author=\"";
				sResult += m_sAuthor->GetString();
				sResult += "\" ";
			}

			if ( m_oDate.IsInit() )
			{
				sResult += "w:date=\"";
				sResult += m_oDate->ToString();
				sResult += "\" ";
			}

			if ( m_oId.IsInit() )
			{
				sResult += "w:id=\"";
				sResult += m_oId->ToString();
				sResult += "\" ";
			}

			sResult += _T(">");

			if ( m_pTrPr.IsInit() )
				sResult += m_pTrPr->toXML();

			sResult += _T("</w:trPrChange>");

			return sResult;
		}
		EElementType CTrPrChange::getType() const
		{
			return et_w_trPrChange;
		}

		void CTrPrChange::ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
		{
			
			WritingElement_ReadAttributes_Start( oReader )
			WritingElement_ReadAttributes_Read_if     ( oReader, _T("w:author"), m_sAuthor )
			WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:date"),   m_oDate )
			WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:id"),     m_oId )
			WritingElement_ReadAttributes_End( oReader )
		}
	} 
} 

namespace OOX
{
	namespace Logic
	{
		
		
		
		CTcPrChange::CTcPrChange()
		{
			m_pTcPr.Init();
			m_pTcPr->m_bTcPrChange = true;
		}
		CTcPrChange::CTcPrChange(XmlUtils::CXmlNode& oNode)
		{
			m_pTcPr.Init();
			m_pTcPr->m_bTcPrChange = true;

			fromXML( oNode );
		}
		CTcPrChange::CTcPrChange(XmlUtils::CXmlLiteReader& oReader)
		{
			m_pTcPr.Init();
			m_pTcPr->m_bTcPrChange = true;

			fromXML( oReader );
		}
		CTcPrChange::~CTcPrChange()
		{
		}
		const CTcPrChange& CTcPrChange::operator = (const XmlUtils::CXmlNode &oNode)
		{
			fromXML( (XmlUtils::CXmlNode &)oNode );
			return *this;
		}
		const CTcPrChange& CTcPrChange::operator = (const XmlUtils::CXmlLiteReader& oReader)
		{
			fromXML( (XmlUtils::CXmlLiteReader&)oReader );
			return *this;
		}
		void CTcPrChange::fromXML(XmlUtils::CXmlNode& oNode)
		{
			if ( _T("w:tcPrChange") != oNode.GetName() )
				return;

			oNode.ReadAttributeBase( _T("w:author"), m_sAuthor );
			oNode.ReadAttributeBase( _T("w:date"),   m_oDate );
			oNode.ReadAttributeBase( _T("w:id"),     m_oId );

			XmlUtils::CXmlNode oNode_tcPr;

			if ( m_pTcPr.IsInit() && oNode.GetNode( _T("w:tcPr"), oNode_tcPr ) )
				m_pTcPr->fromXML( oNode_tcPr );

		}
		void CTcPrChange::fromXML(XmlUtils::CXmlLiteReader& oReader)
		{
			ReadAttributes( oReader );

			if ( oReader.IsEmptyNode() )
				return;

			int nParentDepth = oReader.GetDepth();
			while( oReader.ReadNextSiblingNode( nParentDepth ) )
			{
				CWCharWrapper sName = oReader.GetName();
				if ( m_pTcPr.IsInit() && _T("w:tcPr") == sName )
					m_pTcPr->fromXML( oReader );
			}
		}
		CString CTcPrChange::toXML() const
		{			
			CString sResult = _T("<w:tcPrChange ");

			if ( m_sAuthor.IsInit() )
			{
				sResult += "w:author=\"";
				sResult += m_sAuthor->GetString();
				sResult += "\" ";
			}

			if ( m_oDate.IsInit() )
			{
				sResult += "w:date=\"";
				sResult += m_oDate->ToString();
				sResult += "\" ";
			}

			if ( m_oId.IsInit() )
			{
				sResult += "w:id=\"";
				sResult += m_oId->ToString();
				sResult += "\" ";
			}

			sResult += _T(">");

			if ( m_pTcPr.IsInit() )
				sResult += m_pTcPr->toXML();

			sResult += _T("</w:tcPrChange>");

			return sResult;
		}
		EElementType CTcPrChange::getType() const
		{
			return et_w_tcPrChange;
		}
		void CTcPrChange::ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
		{
			
			WritingElement_ReadAttributes_Start( oReader )
			WritingElement_ReadAttributes_Read_if     ( oReader, _T("w:author"), m_sAuthor )
			WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:date"),   m_oDate )
			WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:id"),     m_oId )
			WritingElement_ReadAttributes_End( oReader )
		}
	} 
} // namespace OOX