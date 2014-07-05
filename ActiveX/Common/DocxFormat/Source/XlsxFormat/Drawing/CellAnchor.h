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
#ifndef OOX_CELLANCHOR_FILE_INCLUDE_H_
#define OOX_CELLANCHOR_FILE_INCLUDE_H_

#include "../CommonInclude.h"

#include "FromTo.h"
#include "Pic.h"
#include "GraphicFrame.h"
#include "Pos.h"

namespace OOX
{
	namespace Spreadsheet
	{
		class CCellAnchor : public WritingElement
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CCellAnchor)
			CCellAnchor(SimpleTypes::Spreadsheet::CCellAnchorType<>& oAnchorType = SimpleTypes::Spreadsheet::CCellAnchorType<>()):m_oAnchorType(oAnchorType)
			{
			}
			virtual ~CCellAnchor()
			{
			}

		public:
			virtual CString      toXML() const
			{
				return _T("");
			}
			virtual void toXML(CStringWriter& writer) const
			{
				if(isValid())
				{
					CString sStart;
					CString sEnd;
					if(m_oFrom.IsInit() && m_oTo.IsInit())
					{
						sStart.Format(_T("<xdr:twoCellAnchor editAs=\"%s\">"), m_oAnchorType.ToString());
						sEnd = _T("</xdr:twoCellAnchor>");
						writer.WriteStringC(sStart);
						if(m_oFrom.IsInit())
							m_oFrom->toXML2(writer, _T("xdr:from"));
						if(m_oTo.IsInit())
							m_oTo->toXML2(writer, _T("xdr:to"));
					}
					else if(m_oFrom.IsInit() && m_oExt.IsInit())
					{
						sStart.Append(_T("<xdr:oneCellAnchor>"));
						sEnd = _T("</xdr:oneCellAnchor>");
						writer.WriteStringC(sStart);
						if(m_oFrom.IsInit())
							m_oFrom->toXML2(writer, _T("xdr:from"));
						if(m_oExt.IsInit())
							m_oExt->toXML(writer);
					}
					else if(m_oPos.IsInit() && m_oExt.IsInit())
					{
						sStart.Append(_T("<xdr:absoluteAnchor>"));
						sEnd = _T("</xdr:absoluteAnchor>");
						writer.WriteStringC(sStart);
						if(m_oPos.IsInit())
						m_oPos->toXML(writer);
						if(m_oExt.IsInit())
							m_oExt->toXML(writer);
					}
					else
						return;
					if(m_oXml.IsInit())
						writer.WriteStringC(m_oXml.get());	
					if(m_oGraphicFrame.IsInit())
						m_oGraphicFrame->toXML(writer);
					writer.WriteStringC(sEnd);	
				}
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

					if ( _T("xdr:from") == sName )
						m_oFrom = oReader;
					else if ( _T("xdr:to") == sName )
						m_oTo = oReader;
					else if ( _T("xdr:pos") == sName )
						m_oPos = oReader;
					else if ( _T("xdr:ext") == sName )
						m_oExt = oReader;
					else if ( _T("xdr:graphicFrame") == sName )
						m_oGraphicFrame = oReader;
					else if ( _T("xdr:pic") == sName || _T("xdr:sp") == sName || _T("xdr:grpSp") == sName || _T("xdr:cxnSp") == sName || _T("mc:AlternateContent") == sName)
						m_oXml = oReader.GetOuterXml();
				}
			}

			virtual EElementType getType () const
			{
				return et_CellAnchor;
			}

			virtual void setAnchorType (SimpleTypes::Spreadsheet::ECellAnchorType eType)
			{
				m_oAnchorType.SetValue(eType);
			}
			virtual SimpleTypes::Spreadsheet::ECellAnchorType getAnchorType () const
			{
				return m_oAnchorType.GetValue();
			}
			bool isValid() const
			{
				SimpleTypes::Spreadsheet::ECellAnchorType eAnchorType = m_oAnchorType.GetValue();
				if(!((m_oFrom.IsInit() && m_oTo.IsInit()) || (m_oFrom.IsInit() && m_oExt.IsInit()) || (m_oPos.IsInit() && m_oExt.IsInit())))
					return false;
				if(false == m_oXml.IsInit() && false == m_oGraphicFrame.IsInit())
					return false;
				return true;
			}
		private:
			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
			}
		public:
			SimpleTypes::Spreadsheet::CCellAnchorType<>		m_oAnchorType;
			nullable<OOX::Spreadsheet::CFromTo>				m_oFrom;
			nullable<OOX::Spreadsheet::CFromTo>				m_oTo;
			nullable<OOX::Spreadsheet::CPos>				m_oPos;
			nullable<OOX::Spreadsheet::CExt>				m_oExt;
			nullable<OOX::Spreadsheet::CGraphicFrame>		m_oGraphicFrame;
			nullable<CString>								m_oXml;
		};
	} 
} 

#endif // OOX_CELLANCHOR_FILE_INCLUDE_H_