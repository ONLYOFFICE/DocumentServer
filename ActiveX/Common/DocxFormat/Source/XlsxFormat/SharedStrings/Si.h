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
#ifndef OOX_SI_FILE_INCLUDE_H_
#define OOX_SI_FILE_INCLUDE_H_

#include "../CommonInclude.h"

#include "PhoneticPr.h"
#include "Run.h"

namespace OOX
{
	namespace Spreadsheet
	{
		
		
		class CSi : public WritingElementWithChilds<>
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CSi)
			CSi()
			{
			}
			virtual ~CSi()
			{
			}

		public:
			virtual CString      toXML() const
			{
				return _T("");
			}
			virtual void toXML(CStringWriter& writer) const
			{
				writer.WriteStringC(_T("<si>"));
				for(int i = 0, length = m_arrItems.GetSize(); i < length; ++i)
					m_arrItems[i]->toXML(writer);
				writer.WriteStringC(_T("</si>"));
			}
			virtual void toXML2(CStringWriter& writer) const
			{
				for(int i = 0, length = m_arrItems.GetSize(); i < length; ++i)
					m_arrItems[i]->toXML(writer);
			}
			CString ToString()
			{
				CString sRes;
				for(int i = 0, length = m_arrItems.GetSize(); i < length; ++i)
				{
					WritingElement* we = m_arrItems[i];
					if(OOX::Spreadsheet::et_r == we->getType())
					{
						CRun* pRun = static_cast<CRun*>(we);
						for(int j = 0, length2 = pRun->m_arrItems.GetSize(); j < length2; ++j)
						{
							CText* pText = pRun->m_arrItems[j];
							sRes.Append(pText->ToString());
						}
					}
					else if(OOX::Spreadsheet::et_t == we->getType())
					{
						CText* pText = static_cast<CText*>(we);
						sRes.Append(pText->ToString());
					}
				}
				return sRes;
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

					WritingElement *pItem = NULL;
					if ( _T("phoneticPr") == sName )
						pItem = new CPhonetic( oReader );
					else if ( _T("r") == sName )
						pItem = new CRun( oReader );
					else if ( _T("rPh") == sName )
						pItem = new CRPh( oReader );
					else if ( _T("t") == sName )
						pItem = new CText( oReader );

					if ( NULL != pItem )
						m_arrItems.Add( pItem );
				}
			}

			virtual EElementType getType () const
			{
				return et_Si;
			}

		private:
			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
			}
		};
	} 
} 

#endif // OOX_SI_FILE_INCLUDE_H_