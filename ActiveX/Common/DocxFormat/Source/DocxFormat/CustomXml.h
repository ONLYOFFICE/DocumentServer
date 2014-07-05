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
#ifndef OOX_CUSTOM_XML_INCLUDE_H_
#define OOX_CUSTOM_XML_INCLUDE_H_

#include "File.h"
#include "WritingElement.h"
#include "../Common/SimpleTypes_Shared.h"

namespace OOX
{
	
	
	
	class CCustomXML : public OOX::File
	{
	public:

		class CShemaRef : public WritingElement
		{
		public:
			CShemaRef()
			{
			}
			CShemaRef(const XmlUtils::CXmlNode& oNode)
			{
				fromXML( (XmlUtils::CXmlNode&)oNode );
			}
			virtual ~CShemaRef()
			{
			}

		public:

			const CShemaRef& operator =(const XmlUtils::CXmlNode& oNode)
			{
				fromXML( (XmlUtils::CXmlNode&)oNode );
				return *this;
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("ds:uri"), m_sUri );
			}
			virtual CString      toXML() const
			{
				CString sResult;
				sResult.Format( _T("<ds:schemaRef ds:uri=\"%s\" />"), m_sUri );
				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_ds_schemaRef;
			}

		public:

			CString m_sUri;
		};

		class CShemaRefs : public WritingElement
		{
		public:
			CShemaRefs()
			{
			}
			CShemaRefs(const XmlUtils::CXmlNode& oNode)
			{
				fromXML( (XmlUtils::CXmlNode&)oNode );
			}
			virtual ~CShemaRefs()
			{
			}

		public:

			const CShemaRefs& operator =(const XmlUtils::CXmlNode& oNode)
			{
				fromXML( (XmlUtils::CXmlNode&)oNode );
				return *this;
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				XmlUtils::CXmlNodes oNodes;
				if ( oNode.GetNodes( _T("ds:schemaRef"), oNodes ) )
				{
					XmlUtils::CXmlNode oItem;
					for ( int nIndex = 0; nIndex < oNodes.GetCount(); nIndex++ )
					{
						if ( oNodes.GetAt( nIndex, oItem ) )
						{
							CShemaRef oShemeRef = oItem;
							m_arrShemeRef.Add( oShemeRef );
						}
					}
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<ds:schemaRefs>");

				for ( int nIndex = 0; nIndex < m_arrShemeRef.GetSize(); nIndex++ )
					sResult += m_arrShemeRef[nIndex].toXML();

				sResult += _T("</ds:schemaRefs>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_ds_schemaRefs;
			}

		public:

			CSimpleArray<CShemaRef> m_arrShemeRef;
		};

	public:
	
		CCustomXML()
		{
		}
		CCustomXML(const CPath& oFilePath)
		{
			read( oFilePath );
		}
		virtual ~CCustomXML()
		{
		}

	public:
		virtual void read(const CPath& oFilePath)
		{
			XmlUtils::CXmlNode oCustomXml;
			oCustomXml.FromXmlFile( oFilePath.GetPath(), true );

			if ( _T("ds:datastoreItem") == oCustomXml.GetName() )
			{
				oCustomXml.ReadAttributeBase( _T("ds:itemID"), m_oItemID );

				XmlUtils::CXmlNode oItem;
				if ( oCustomXml.GetNode( _T("ds:schemaRefs"), oItem ) )
					m_oShemaRefs = oItem;
			}
		}
		virtual void write(const CPath& oFilePath, const CPath& oDirectory, CContentTypes& oContent) const
		{
			CString sXml;
			sXml.Format( _T("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><ds:datastoreItem ds:itemID=\"%s\" xmlns:ds=\"http://schemas.openxmlformats.org/officeDocument/2006/customXml\">"), m_oItemID.ToString() );

			if ( m_oShemaRefs.IsInit() )
				sXml += m_oShemaRefs->toXML();

			sXml += _T("</ds:datastoreItem>");
			CDirectory::SaveToFile( oFilePath.GetPath(), sXml );

			oContent.Registration( type().OverrideType(), oDirectory, oFilePath );
		}

	public:
		virtual const OOX::FileType type() const
		{
			return FileTypes::CustomXml;
		}
		virtual const CPath DefaultDirectory() const
		{
			return type().DefaultDirectory();
		}
		virtual const CPath DefaultFileName() const
		{
			return type().DefaultFileName();
		}


	private:

		
		SimpleTypes::CGuid   m_oItemID;

		
		nullable<CShemaRefs> m_oShemaRefs;
	};

} 

#endif // OOX_CUSTOM_XML_INCLUDE_H_