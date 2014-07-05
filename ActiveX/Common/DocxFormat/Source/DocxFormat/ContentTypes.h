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
#ifndef OOX_CONTENT_TYPES_INCLUDE_H_
#define OOX_CONTENT_TYPES_INCLUDE_H_

#include "../SystemUtility/SystemUtility.h"

#include "FileType.h"
#include "WritingElement.h"


namespace OOX
{
	namespace ContentTypes
	{
		class CExtensionTable
		{
		public:
			CExtensionTable()
			{
				m_mTable.SetAt( _T("bmp"),  _T("image/bmp"));
				m_mTable.SetAt( _T("gif"),  _T("image/gif"));
				m_mTable.SetAt( _T("png"),  _T("image/png"));
				m_mTable.SetAt( _T("tif"),  _T("image/tiff"));
				m_mTable.SetAt( _T("tiff"), _T("image/tiff"));
				m_mTable.SetAt( _T("jpeg"), _T("image/jpeg"));
				m_mTable.SetAt( _T("jpg"),  _T("image/jpeg"));
				m_mTable.SetAt( _T("jpe"),  _T("image/jpeg"));
				m_mTable.SetAt( _T("jfif"), _T("image/jpeg"));
				m_mTable.SetAt( _T("rels"), _T("application/vnd.openxmlformats-package.relationships+xml"));
				m_mTable.SetAt( _T("bin"),  _T("application/vnd.openxmlformats-officedocument.oleObject"));
				m_mTable.SetAt( _T("xml"),  _T("application/xml"));
				m_mTable.SetAt( _T("emf"),  _T("image/x-emf"));
				m_mTable.SetAt( _T("emz"),  _T("image/x-emz"));
				m_mTable.SetAt( _T("wmf"),  _T("image/x-wmf"));
				m_mTable.SetAt( _T("svm"),  _T("image/svm"));
				m_mTable.SetAt( _T("wav"),  _T("audio/wav"));
				m_mTable.SetAt( _T("xls"),  _T("application/vnd.ms-excel"));
				m_mTable.SetAt( _T("xlsm"), _T("application/vnd.ms-excel.sheet.macroEnabled.12"));
				m_mTable.SetAt( _T("xlsb"), _T("application/vnd.ms-excel.sheet.binary.macroEnabled.12"));
				m_mTable.SetAt( _T("xlsx"), _T("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
				m_mTable.SetAt( _T("ppt"),  _T("application/vnd.ms-powerpoint"));
				m_mTable.SetAt( _T("pptm"), _T("application/vnd.ms-powerpoint.presentation.macroEnabled.12"));			
				m_mTable.SetAt( _T("pptx"), _T("application/vnd.openxmlformats-officedocument.presentationml.presentation"));
				m_mTable.SetAt( _T("sldm"), _T("application/vnd.ms-powerpoint.slide.macroEnabled.12"));			
				m_mTable.SetAt( _T("sldx"), _T("application/vnd.openxmlformats-officedocument.presentationml.slide"));
				m_mTable.SetAt( _T("doc"),  _T("application/msword"));
				m_mTable.SetAt( _T("docm"), _T("aapplication/vnd.ms-word.document.macroEnabled.12"));
				m_mTable.SetAt( _T("docx"), _T("application/vnd.openxmlformats-officedocument.wordprocessingml.document"));
				m_mTable.SetAt( _T("vml"),  _T("application/vnd.openxmlformats-officedocument.vmlDrawing"));
			}
			const CString operator[] (const CString& sExtension) const
			{
				const CAtlMap<CString, CString>::CPair* pPair = m_mTable.Lookup( sExtension );
				if ( NULL == pPair )
					return _T("");
				return pPair->m_value;
			}

		private:
			CAtlMap<CString, CString> m_mTable;
		};
		class CDefault : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CDefault)
			CDefault() 
			{
				m_sExtension = _T("");
			}
			CDefault(const CString& sExtension) : m_sExtension(sExtension)
			{
			}
			virtual ~CDefault()
			{
			}

		public:
			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				m_sExtension = oNode.GetAttribute(_T("Extension"));
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}
			virtual CString      toXML() const
			{
				static const CExtensionTable oTable;
				
				XmlUtils::CAttribute oAttr;
				oAttr.Write( _T("Extension"),   m_sExtension );
				oAttr.Write( _T("ContentType"), oTable[m_sExtension] );

				return XmlUtils::CreateNode(_T("Default"), oAttr );
			}
			virtual EElementType getType() const
			{
				return et_Default;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_ReadSingle( oReader, _T("Extension"), m_sExtension )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			const bool operator ==(const CString& rhs) const
			{
				return m_sExtension == rhs;
			}

		private:

			CString	m_sExtension;
		};
		class COverride : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(COverride)
			COverride()
			{
			}
			COverride(const CString& sType, const CPath& oPath) : m_sType(sType), m_oPart(oPath)
			{
			}
			virtual ~COverride()
			{
			}

		public:

			virtual void fromXML(XmlUtils::CXmlNode& oNode)
			{
				m_oPart = oNode.GetAttribute(_T("PartName"));
				m_sType = oNode.GetAttribute(_T("ContentType"));
			}
			virtual void fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}
			virtual CString toXML() const
			{
				XmlUtils::CAttribute oAttr;
				CString sPartName = m_oPart.m_strFilename;
				sPartName.Replace(_T("\\"), _T("/"));
				oAttr.Write( _T("PartName"), _T("/") + sPartName);
				oAttr.Write( _T("ContentType"), m_sType );

				return XmlUtils::CreateNode(_T("Override"), oAttr);
			}
			virtual EElementType getType() const
			{
				return et_Override;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("PartName"),    m_oPart )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("ContentType"), m_sType )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			AVSINLINE const CString type() const
			{
				return m_sType;
			}
			AVSINLINE const OOX::CPath filename() const
			{
				return m_oPart;
			}

		private:

			CString						m_sType;
			OOX::CPath					m_oPart;

		};
	} 
} 

namespace OOX
{
	static const CPath c_oContentTypeFileName = L"[Content_Types].xml";

	class CContentTypes
	{
	public:
		CContentTypes()
		{
			AddDefault(OOX::CPath(_T(".rels")));
			AddDefault(OOX::CPath(_T(".bmp")));
			AddDefault(OOX::CPath(_T(".jpg")));
			AddDefault(OOX::CPath(_T(".jpeg")));
			AddDefault(OOX::CPath(_T(".jpe")));
			AddDefault(OOX::CPath(_T(".png")));
			AddDefault(OOX::CPath(_T(".gif")));
			AddDefault(OOX::CPath(_T(".emf")));
			AddDefault(OOX::CPath(_T(".wmf")));
			AddDefault(OOX::CPath(_T(".jpeg")));
		}
		CContentTypes(const CPath& oPath)
		{
			Read( oPath );
		}
		~CContentTypes()
		{
		}

	public:

		BOOL Read (const CPath& oDirPath)
		{
			OOX::CPath oFullPath = oDirPath / c_oContentTypeFileName;

			XmlUtils::CXmlLiteReader oReader;
			if ( !oReader.FromFile( oFullPath.m_strFilename ) )
				return FALSE;
			return ReadFromReader(oReader);
		}
		BOOL ReadFromString (CString& sXml)
		{
			XmlUtils::CXmlLiteReader oReader;
			if ( !oReader.FromString( sXml ) )
				return FALSE;
			return ReadFromReader(oReader);
		}
		BOOL Write(const CPath& oDirPath) const
		{
			CString sXml = _T("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><Types xmlns=\"http://schemas.openxmlformats.org/package/2006/content-types\">");

			for ( int nIndex = 0; nIndex < m_arrDefault.GetSize(); nIndex++ )
				sXml += m_arrDefault[nIndex].toXML();

			POSITION pos = m_arrOverride.GetStartPosition();
			while ( NULL != pos )
			{
				const CAtlMap<CString, ContentTypes::COverride>::CPair* pPair = m_arrOverride.GetNext( pos );
				sXml += pPair->m_value.toXML();
			}

			sXml += _T("</Types>");

			OOX::CPath oFullPath = oDirPath / c_oContentTypeFileName;
			XmlUtils::SaveToFile( oFullPath.m_strFilename, sXml );

			return TRUE;
		}

	public:
		void Registration(const CString& sType, const CPath& oDirectory, const CPath& oFilename)
		{
			const OOX::CPath oFullPath = oDirectory / oFilename;
			AddOverride( sType, oFullPath.m_strFilename );
			AddDefault ( oFullPath );
		}

		void AddDefault(const OOX::CPath& oPath)
		{
			CString sExt = oPath.GetExtention();
			const CString sExtension = sExt.Mid( 1 );

			size_t nCount = m_arrDefault.GetSize();
			size_t nIndex = 0;	

			while ( nIndex < nCount )
			{
				if ( m_arrDefault[(int) nIndex] == sExtension )
					break;

				++nIndex;
			}

			if ( nIndex == nCount )
				m_arrDefault.Add( ContentTypes::CDefault( sExtension ) );
		}

	private:
		BOOL ReadFromReader (XmlUtils::CXmlLiteReader& oReader)
		{
			CWCharWrapper sName;
			if ( !oReader.ReadNextNode() || _T("Types") != ( sName = oReader.GetName() ) || oReader.IsEmptyNode() )
				return FALSE;

			int nTypesDepth = oReader.GetDepth();
			while ( oReader.ReadNextSiblingNode( nTypesDepth ) )
			{
				sName = oReader.GetName();

				if ( _T("Default") == sName )
				{
					ContentTypes::CDefault oDefault = oReader;
					m_arrDefault.Add( oDefault );
				}
				else if ( _T("Override") == sName )
				{
					ContentTypes::COverride oOverride = oReader;
					m_arrOverride.SetAt( oOverride.filename().GetPath(), oOverride );
				}
			}

			return TRUE;
		}
		void AddOverride(const CString& sType, const CString& sPath)
		{
			ContentTypes::COverride oOverride( sType, sPath );
			m_arrOverride.SetAt( oOverride.filename().GetPath(), oOverride );
		}

	public:

		CSimpleArray<ContentTypes::CDefault>  m_arrDefault;
		CAtlMap<CString, ContentTypes::COverride> m_arrOverride;
	};
} 

#endif // OOX_CONTENT_TYPES_INCLUDE_H_