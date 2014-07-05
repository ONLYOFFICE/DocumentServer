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
#ifndef OOX_TEXT_FILE_INCLUDE_H_
#define OOX_TEXT_FILE_INCLUDE_H_

#include "../CommonInclude.h"


namespace OOX
{
	namespace Spreadsheet
	{
		
		class CText : public WritingElement
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CText)
			CText() {}
			virtual ~CText() {}

		public:
			virtual CString      toXML() const
			{
				return _T("");
			}
			virtual void toXML(CStringWriter& writer) const
			{
				writer.WriteStringC(_T("<t"));
				if(-1 != m_sText.Find(' ') || -1 != m_sText.Find('\n'))
					writer.WriteStringC(_T(" xml:space=\"preserve\""));
				writer.WriteStringC(_T(">"));
				writer.WriteStringC(XmlUtils::EncodeXmlString(m_sText));
				writer.WriteStringC(_T("</t>"));
			}
			virtual void toXML2(CStringWriter& writer, CString name) const
			{
				writer.WriteStringC(_T("<"));
				writer.WriteStringC(name);
				if(-1 != m_sText.Find(' ') || -1 != m_sText.Find('\n'))
					writer.WriteStringC(_T(" xml:space=\"preserve\""));
				writer.WriteStringC(_T(">"));
				writer.WriteStringC(XmlUtils::EncodeXmlString(m_sText));
				writer.WriteStringC(_T("</"));
				writer.WriteStringC(name);
				writer.WriteStringC(_T(">"));
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( oReader.IsEmptyNode() )
					return;

				m_sText = oReader.GetText2();
				m_sText.Replace(_T("\t"), _T(""));
				if(!(m_oSpace.IsInit() && SimpleTypes::xmlspacePreserve == m_oSpace->GetValue()))
				{
					
					int nLength = m_sText.GetLength();
					int nStartIndex = 0;
					int nEndIndex = nLength - 1;
					for(int i = nStartIndex; i < nLength; ++i)
					{
						TCHAR cElem = m_sText[i];
						if(' ' == cElem || '\n' == cElem || '\r' == cElem)
							nStartIndex++;
						else
							break;
					}
					for(int i = nEndIndex; i > nStartIndex; --i)
					{
						TCHAR cElem = m_sText[i];
						if(' ' == cElem || '\n' == cElem || '\r' == cElem)
							nEndIndex--;
						else
							break;
					}
					if(0 != nStartIndex || nLength - 1 != nEndIndex)
					{
						if(nStartIndex <= nEndIndex)
							m_sText = m_sText.Mid(nStartIndex, nEndIndex - nStartIndex + 1);
						else
							m_sText.Empty();
					}
				}
			}
			CString ToString() const
			{
				return m_sText;
			}
			virtual EElementType getType() const
			{
				return et_t;
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

#endif // OOX_TEXT_FILE_INCLUDE_H_