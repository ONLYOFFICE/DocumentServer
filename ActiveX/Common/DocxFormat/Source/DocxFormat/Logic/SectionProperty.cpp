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
 #include "SectionProperty.h"

namespace OOX
{
	namespace Logic
	{
		
		
		

		CSectPrChange::CSectPrChange()
		{
			m_pSecPr.Init();
			m_pSecPr->m_bSectPrChange = true;
		}
		CSectPrChange::CSectPrChange(XmlUtils::CXmlNode& oNode)
		{
			m_pSecPr.Init();
			m_pSecPr->m_bSectPrChange = true;

			fromXML( oNode );
		}
		CSectPrChange::CSectPrChange(XmlUtils::CXmlLiteReader& oReader)
		{
			m_pSecPr.Init();
			m_pSecPr->m_bSectPrChange = true;

			fromXML( oReader );
		}
		CSectPrChange::~CSectPrChange()
		{
		}
		void CSectPrChange::fromXML(XmlUtils::CXmlNode& oNode)
		{
			oNode.ReadAttributeBase( _T("w:author"), m_sAuthor );
			oNode.ReadAttributeBase( _T("w:date"),   m_oDate );
			oNode.ReadAttributeBase( _T("w:id"),     m_oId );

			XmlUtils::CXmlNode oNode_sectPr;

			if ( m_pSecPr.IsInit() && oNode.GetNode( _T("w:sectPr"), oNode_sectPr ) )
				m_pSecPr->fromXML( oNode_sectPr );

		}
		void CSectPrChange::fromXML(XmlUtils::CXmlLiteReader& oReader)
		{
			ReadAttributes( oReader );

			if ( oReader.IsEmptyNode() )
				return;

			int nParentDepth = oReader.GetDepth();
			while( oReader.ReadNextSiblingNode( nParentDepth ) )
			{
				CWCharWrapper sName = oReader.GetName();
				if ( _T("w:sectPr") == sName )
					m_pSecPr->fromXML( oReader );
			}
		}
		CString CSectPrChange::toXML() const
		{			
			CString sResult = _T("<w:sectPrChange ");

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

			if ( m_pSecPr.IsInit() )
				sResult += m_pSecPr->toXML();

			sResult += _T("</w:sectPrChange>");

			return sResult;
		}
		EElementType CSectPrChange::getType() const
		{
			return et_w_sectPrChange;
		}
		void CSectPrChange::ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
		{
			
			WritingElement_ReadAttributes_Start( oReader )
			WritingElement_ReadAttributes_Read_if     ( oReader, _T("w:author"), m_sAuthor )
			WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:date"),   m_oDate )
			WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:id"),     m_oId )
			WritingElement_ReadAttributes_End( oReader )
		}
	} 
} // ComplexTypes