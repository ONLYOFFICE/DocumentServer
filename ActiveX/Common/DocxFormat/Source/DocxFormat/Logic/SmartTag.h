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
#ifndef OOX_LOGIC_SMARTTAG_INCLUDE_H_
#define OOX_LOGIC_SMARTTAG_INCLUDE_H_

#include "../../Base/Nullable.h"

#include "../WritingElement.h"
#include "../../Common/SimpleTypes_Word.h"
#include "../../Common/SimpleTypes_Shared.h"

namespace OOX
{
	namespace Logic
	{
		
		
		
		class CSmartTag : public WritingElement
		{
		public:
			CSmartTag()
			{
			}
			CSmartTag(XmlUtils::CXmlNode &oNode)
			{
				fromXML( oNode );
			}
			CSmartTag(XmlUtils::CXmlLiteReader& oReader)
			{
				fromXML( oReader );
			}
			virtual ~CSmartTag()
			{
				for ( int nIndex = 0; nIndex < m_arrItems.GetSize(); nIndex++ )
				{
					if ( m_arrItems[nIndex] )
						delete m_arrItems[nIndex];

					m_arrItems[nIndex] = NULL;
				}

				m_arrItems.RemoveAll();
			}

		public:

			const CSmartTag &operator =(const XmlUtils::CXmlNode& oNode)
			{
				Clear();
				fromXML( (XmlUtils::CXmlNode&)oNode );
				return *this;
			}
			const CSmartTag &operator =(const XmlUtils::CXmlLiteReader& oReader)
			{
				Clear();
				fromXML( (XmlUtils::CXmlLiteReader&)oReader );
				return *this;
			}

			void Clear()
			{
				m_sElement.reset();
				m_sUri.reset();
				
				for ( int nIndex = 0; nIndex < m_arrItems.GetSize(); nIndex++ )
				{
					if ( m_arrItems[nIndex] )
						delete m_arrItems[nIndex];

					m_arrItems[nIndex] = NULL;
				}

				m_arrItems.RemoveAll();
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode);
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader);
			virtual CString      toXML() const;
			virtual EElementType getType() const
			{
				return et_w_smartTag;
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
					if      ( _T("w:element")         == wsName ) m_sElement         = oReader.GetText();
					else if ( _T("w:uri")          == wsName ) m_sUri          = oReader.GetText();

					if ( !oReader.MoveToNextAttribute() )
						break;

					wsName = oReader.GetName();
				}
				oReader.MoveToElement();
			}

		public:

			
			nullable<CString> m_sElement;
			nullable<CString> m_sUri;

			
			CSimpleArray<WritingElement *>                          m_arrItems;
		};
	} 
} 

#endif // OOX_LOGIC_SMARTTAG_INCLUDE_H_