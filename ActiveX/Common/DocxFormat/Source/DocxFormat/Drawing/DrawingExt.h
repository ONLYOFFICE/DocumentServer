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
#ifndef OOX_LOGIC_DRAWING_EXT_INCLUDE_H_
#define OOX_LOGIC_DRAWING_EXT_INCLUDE_H_

#include "../../Base/Nullable.h"
#include "../WritingElement.h"

namespace OOX
{
	namespace Drawing
	{
		
		
		
		class COfficeArtExtension : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(COfficeArtExtension)
			COfficeArtExtension()
			{
			}
			virtual ~COfficeArtExtension()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("uri"), m_oUri );
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( oReader.IsEmptyNode() )
					return;
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<a:ext ");
				
				if ( m_oUri.IsInit() )
				{
					sResult += _T("uri=\"");
					sResult += m_oUri->GetString();
					sResult += _T("\">");
				}
				else
					sResult += _T(">");

				sResult += _T("</a:ext>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_ext;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_ReadSingle( oReader, _T("uri"), m_oUri )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			
			nullable<CString> m_oUri;

			
		};
		
		
		
		class COfficeArtExtensionList : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(COfficeArtExtensionList)
			COfficeArtExtensionList()
			{
			}
			virtual ~COfficeArtExtensionList()
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
					if ( _T("a:ext") == sName )
					{
						OOX::Drawing::COfficeArtExtension oExt = oReader;
						m_arrExt.Add( oExt );
					}
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<a:extLst>");
				
				for ( int nIndex = 0; nIndex < m_arrExt.GetSize(); nIndex++ )
					sResult += m_arrExt[nIndex].toXML();

				sResult += _T("</a:extLst>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_extLst;
			}

		public:

			
			CSimpleArray<OOX::Drawing::COfficeArtExtension> m_arrExt;
		};
	} 
} 

#endif // OOX_LOGIC_DRAWING_EXT_INCLUDE_H_