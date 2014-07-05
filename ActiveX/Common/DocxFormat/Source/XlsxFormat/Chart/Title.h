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
#ifndef OOX_CHARTTITLE_FILE_INCLUDE_H_
#define OOX_CHARTTITLE_FILE_INCLUDE_H_

#include "../CommonInclude.h"

namespace OOX
{
	namespace Spreadsheet
	{
		class CChartText : public WritingElement
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CChartText)
			CChartText() {}
			virtual ~CChartText() {}

		public:
			virtual CString      toXML() const
			{
				return _T("");
			}
			virtual void toXML(CStringWriter& writer) const
			{
				writer.WriteStringC(_T("<a:t"));
				if(-1 != m_sText.Find(' ') || -1 != m_sText.Find('\n'))
					writer.WriteStringC(_T(" xml:space=\"preserve\""));
				writer.WriteStringC(_T(">"));
				writer.WriteStringC(XmlUtils::EncodeXmlString(m_sText));
				writer.WriteStringC(_T("</a:t>"));
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( oReader.IsEmptyNode() )
					return;

				m_sText = oReader.GetText2();
			}
			CString ToString() const
			{
				return m_sText;
			}
			virtual EElementType getType() const
			{
				return et_a_Text;
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
		class CChartRun : public WritingElementWithChilds<CChartText>
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CChartRun)
			CChartRun()
			{
			}
			virtual ~CChartRun()
			{
			}
		public:
			virtual CString      toXML() const
			{
				return _T("");
			}
			virtual void toXML(CStringWriter& writer) const
			{
			}
			virtual void fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( oReader.IsEmptyNode() )
					return;

				int nCurDepth = oReader.GetDepth();
				while( oReader.ReadNextSiblingNode( nCurDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();

					if ( _T("a:t") == sName )
						m_arrItems.Add( new CChartText( oReader ));
				}
			}

			virtual EElementType getType () const
			{
				return et_a_Run;
			}
		private:
			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
			}
		};
		class CChartParagraph : public WritingElementWithChilds<CChartRun>
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CChartParagraph)
			CChartParagraph()
			{
			}
			virtual ~CChartParagraph()
			{
			}
		public:
			virtual CString      toXML() const
			{
				return _T("");
			}
			virtual void toXML(CStringWriter& writer) const
			{
			}
			virtual void fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( oReader.IsEmptyNode() )
					return;

				int nCurDepth = oReader.GetDepth();
				while( oReader.ReadNextSiblingNode( nCurDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();

					if ( _T("a:r") == sName )
						m_arrItems.Add( new CChartRun( oReader ));
				}
			}

			virtual EElementType getType () const
			{
				return et_a_Paragraph;
			}
		private:
			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
			}
		};
		class CChartRich : public WritingElement
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CChartRich)
			CChartRich() {}
			virtual ~CChartRich() {}

		public:
			virtual CString      toXML() const
			{
				return _T("");
			}
			virtual void toXML(CStringWriter& writer) const
			{
				if(m_oXml.IsInit())
					writer.WriteStringC(m_oXml.get());
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				if ( oReader.IsEmptyNode() )
					return;
				m_oXml.Init();
				m_oXml->AppendFormat(_T("<c:rich xmlns:c=\"http://schemas.openxmlformats.org/drawingml/2006/chart\" xmlns:a=\"http://schemas.openxmlformats.org/drawingml/2006/main\" xmlns:r=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships\">%s</c:rich>"), oReader.GetInnerXml());
			}
			virtual EElementType getType() const
			{
				return et_c_Rich;
			}
		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
			}
		public:
			nullable<CString> m_oXml;
		};
		class CChartTx : public WritingElement
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CChartTx)
			CChartTx() {}
			virtual ~CChartTx() {}

		public:
			virtual CString      toXML() const
			{
				return _T("");
			}
			virtual void toXML(CStringWriter& writer) const
			{
				writer.WriteStringC(_T("<c:tx>"));
				if(m_oRich.IsInit())
					m_oRich->toXML(writer);
				writer.WriteStringC(_T("</c:tx>"));
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

					if ( _T("c:rich") == sName )
						m_oRich = oReader;
				}
			}
			virtual EElementType getType() const
			{
				return et_c_Tx;
			}
		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
			}
		public:

			
			nullable<CChartRich> m_oRich;
		};
		class CChartTitle : public WritingElement
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CChartTitle)
			CChartTitle()
			{
			}
			virtual ~CChartTitle()
			{
			}
		public:
			virtual CString      toXML() const
			{
				return _T("");
			}
			virtual void toXML(CStringWriter& writer) const
			{
				writer.WriteStringC(_T("<c:title>"));
				if(m_oTx.IsInit())
					m_oTx->toXML(writer);
				writer.WriteStringC(_T("<c:layout/><c:overlay val=\"0\"/>"));
				if(m_oTxPr.IsInit())
					m_oTxPr->toXML(writer);
				writer.WriteStringC(_T("</c:title>"));
			}
			virtual void fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( oReader.IsEmptyNode() )
					return;

				int nCurDepth = oReader.GetDepth();
				while( oReader.ReadNextSiblingNode( nCurDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();

					if ( _T("c:tx") == sName )
						m_oTx = oReader;
					else if ( _T("c:txPr") == sName )
						m_oTxPr = oReader;
				}
			}

			virtual EElementType getType () const
			{
				return et_c_Title;
			}
		private:
			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
			}
		public:
			nullable<CChartTx>						m_oTx;
			nullable<CChartRich>					m_oTxPr;
		};
	} 
} 

#endif // OOX_CHARTTITLE_FILE_INCLUDE_H_