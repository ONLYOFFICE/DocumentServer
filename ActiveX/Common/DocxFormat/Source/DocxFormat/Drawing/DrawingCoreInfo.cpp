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
 #include "DrawingCoreInfo.h"

namespace OOX
{
	namespace Drawing
	{
		
		
		
		void CNonVisualPictureProperties::fromXML(XmlUtils::CXmlNode& oNode)
		{
			m_eType = et_Unknown;

			
		}
		void CNonVisualPictureProperties::fromXML(XmlUtils::CXmlLiteReader& oReader)
		{
			m_eType = et_Unknown;

			CWCharWrapper sName = oReader.GetName();
			if ( _T("a:cNvPicPr") == sName )
				m_eType = et_a_cNvPicPr;
			else if ( _T("p:cNvPicPr") == sName )
				m_eType = et_p_cNvPicPr;
			else if ( _T("pic:cNvPicPr") == sName )
				m_eType = et_pic_cNvPicPr;
			else
				return;

			ReadAttributes( oReader );

			if ( oReader.IsEmptyNode() )
				return;

			int nCurDepth = oReader.GetDepth();
			while ( oReader.ReadNextSiblingNode( nCurDepth ) )
			{
				sName = oReader.GetName();
				if ( _T("a:picLocks") == sName )
					m_oPicLocks = oReader;
				else if ( _T("a:extLst") == sName )
					m_oExtLst = oReader;
			}
		}
		CString CNonVisualPictureProperties::toXML() const
		{
			CString sResult;

			if ( et_a_cNvPicPr == m_eType )
				sResult = _T("<a:cNvPicPr ");
			else if ( et_p_cNvPicPr == m_eType )
				sResult = _T("<p:cNvPicPr ");
			else if ( et_pic_cNvPicPr == m_eType )
				sResult = _T("<pic:cNvPicPr ");
			else
				return _T("");

			sResult += _T("preferRelativeResize=\"") + m_oPreferRelativeResize.ToString() + _T("\">");

			if ( m_oPicLocks.IsInit() )
				sResult += m_oPicLocks->toXML();

			if ( m_oExtLst.IsInit() )
				sResult += m_oExtLst->toXML();

			if ( et_a_cNvPicPr == m_eType )
				sResult += _T("</a:cNvPicPr>");
			else if ( et_p_cNvPicPr == m_eType )
				sResult += _T("</p:cNvPicPr>");
			else if ( et_pic_cNvPicPr == m_eType )
				sResult += _T("</pic:cNvPicPr>");

			return sResult;
		}
		
		
		
		void CNonVisualDrawingProps::fromXML(XmlUtils::CXmlNode& oNode)
		{
			m_eType = et_Unknown;

			
		}
		void CNonVisualDrawingProps::fromXML(XmlUtils::CXmlLiteReader& oReader)
		{
			m_eType = et_Unknown;
			CWCharWrapper sName = oReader.GetName();

			if ( _T("wp:docPr") == sName )
				m_eType = et_wp_docPr;
			else if ( _T("p:cNvPr") == sName )
				m_eType = et_p_cNvPr;
			else if ( _T("pic:cNvPr") == sName )
				m_eType = et_pic_cNvPr;
			else
				return;

			if ( oReader.IsEmptyNode() )
				return;

			int nCurDepth = oReader.GetDepth();
			while( oReader.ReadNextSiblingNode( nCurDepth ) )
			{
				sName = oReader.GetName();
				if ( _T("a:extLst") == sName )
					m_oExtLst = oReader;
				else if ( _T("a:hlinkClick") == sName )
					m_oHlinkClick = oReader;
				else if ( _T("a:hlinkHover") == sName )
					m_oHlinkHover = oReader;
			}
		}
		CString CNonVisualDrawingProps::toXML() const
		{
			CString sResult = _T("<wp:docPr ");

			if ( et_wp_docPr == m_eType )
				sResult = _T("<wp:docPr ");
			else if ( et_p_cNvPr == m_eType )
				sResult += _T("<p:cNvPr ");
			else if ( et_pic_cNvPr == m_eType )
				sResult = _T("<pic:cNvPr ");
			else
				return _T("");

			if ( m_sDescr.IsInit()  )
			{
				sResult += _T("descr=\"");
				sResult += m_sDescr->GetString();
				sResult += _T("\" ");
			}
			if ( m_oHidden.IsInit() ) sResult += _T("hidden=\"") + m_oHidden->ToString() + _T("\" ");
			if ( m_oId.IsInit()     ) sResult += _T("id=\"")     + m_oId->ToString()     + _T("\" ");
			if ( m_sName.IsInit()   )
			{
				sResult += _T("name=\"");
				sResult += m_sName->GetString();
				sResult += _T("\" ");
			}
			if ( m_sTitle.IsInit()  )
			{
				sResult += _T("title=\"");
				sResult += m_sTitle->GetString();
				sResult += _T("\" ");
			}

			sResult += _T(">");

			if ( m_oExtLst.IsInit() )
				sResult += m_oExtLst->toXML();
			if ( m_oHlinkClick.IsInit() )
				sResult += m_oHlinkClick->toXML();
			if ( m_oHlinkHover.IsInit() )
				sResult += m_oHlinkHover->toXML();

			if ( et_wp_docPr == m_eType )
				sResult += _T("</wp:docPr>");
			else if ( et_p_cNvPr == m_eType )
				sResult += _T("</p:cNvPr>");
			else if ( et_pic_cNvPr == m_eType )
				sResult += _T("</pic:cNvPr>");

			return sResult;
		}
		
		
		
		void CHyperlink::fromXML(XmlUtils::CXmlNode& oNode)
		{
			
		}
		void CHyperlink::fromXML(XmlUtils::CXmlLiteReader& oReader)
		{
			
			CWCharWrapper sName = oReader.GetName();
			if ( _T("a:hlinkClick") == sName  )
				m_eType = et_a_hlinkClick;
			else if ( _T("a:hlinkHover") == sName )
				m_eType = et_a_hlinkHover;


			ReadAttributes( oReader );

			if ( oReader.IsEmptyNode() )
				return;

			int nCurDepth = oReader.GetDepth();
			while( oReader.ReadNextSiblingNode( nCurDepth ) )
			{
				CWCharWrapper sName = oReader.GetName();
				if ( _T("a:extLst") == sName )
					m_oExtLst = oReader;
				else if ( _T("a:snd") == sName )
					m_oSnd = oReader;
			}
		}
		CString CHyperlink::toXML() const
		{
			CString sResult;

			if ( et_a_hlinkClick == m_eType )
				sResult = _T("<a:hlinkClick ");
			else if ( et_a_hlinkHover == m_eType )
				sResult = _T("<a:hlinkHover ");
			else
				return _T("");

			if ( m_sAction.IsInit()         )
			{
				sResult += _T("action=\"");
				sResult += m_sAction->GetString();
				sResult += _T("\" ");
			}

			if ( m_oEndSnd.IsInit()         ) sResult += _T("endSnd=\"")         + m_oEndSnd->ToString()         + _T("\" ");
			if ( m_oHighlightClick.IsInit() ) sResult += _T("highlightClick=\"") + m_oHighlightClick->ToString() + _T("\" ");
			if ( m_oHistory.IsInit()        ) sResult += _T("history=\"")        + m_oHistory->ToString()        + _T("\" ");
			if ( m_oId.IsInit()             ) sResult += _T("r:id=\"")           + m_oId->ToString()             + _T("\" ");

			if ( m_sInvalidUrl.IsInit()     )
			{
				sResult += _T("invalidUrl=\"");
				sResult += m_sInvalidUrl->GetString();
				sResult += _T("\" ");
			}
			if ( m_sTgtFrame.IsInit()       )
			{
				sResult += _T("tgtFrame=\"");
				sResult += m_sTgtFrame->GetString();
				sResult += _T("\" ");
			}
			if ( m_sTooltip.IsInit()        )
			{
				sResult += _T("tooltip=\"");
				sResult += m_sTooltip->GetString();
				sResult += _T("\" ");
			}

			sResult += _T(">");

			if ( m_oExtLst.IsInit() )
				sResult += m_oExtLst->toXML();

			if ( m_oSnd.IsInit() )
				sResult += m_oSnd->toXML();

			if ( et_a_hlinkClick == m_eType )
				sResult = _T("</a:hlinkClick>");
			else if ( et_a_hlinkHover == m_eType )
				sResult = _T("</a:hlinkHover>");

			return sResult;
		}
	} 
} // OOX