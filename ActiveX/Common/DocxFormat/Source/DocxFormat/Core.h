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
#ifndef OOX_CORE_INCLUDE_H_
#define OOX_CORE_INCLUDE_H_

#include "File.h"
#include "../Base/Nullable.h"

namespace OOX
{
	class CCore : public OOX::File
	{
	public:
		CCore()
		{
		}
		CCore(const CPath& oPath)
		{
			read( oPath );
		}
		virtual ~CCore()
		{
		}

	public:
		virtual void read(const CPath& oPath)
		{
			XmlUtils::CXmlNode oProperties;
			oProperties.FromXmlFile( oPath.GetPath(), true );

			if ( _T("cp:coreProperties") == oProperties.GetName() )
			{
				XmlUtils::CXmlNode oItem;

				if ( oProperties.GetNode( _T("cp:category"), oItem ) )
					m_sCategory = oItem.GetText();

				if ( oProperties.GetNode( _T("cp:contentStatus"), oItem ) )
					m_sContentStatus = oItem.GetText();

				if ( oProperties.GetNode( _T("dcterms:created"), oItem ) )
					m_sCreated = oItem.GetText();

				if ( oProperties.GetNode( _T("dc:creator"), oItem ) )
					m_sCreator = oItem.GetText();

				if ( oProperties.GetNode( _T("dc:description"), oItem ) )
					m_sDescription = oItem.GetText();

				if ( oProperties.GetNode( _T("dc:identifier"), oItem ) )
					m_sIdentifier = oItem.GetText();

				if ( oProperties.GetNode( _T("cp:keywords"), oItem ) )
					m_sKeywords = oItem.GetText();

				if ( oProperties.GetNode( _T("dc:language"), oItem ) )
					m_sLanguage = oItem.GetText();

				if ( oProperties.GetNode( _T("cp:lastModifiedBy"), oItem ) )
					m_sLastModifiedBy = oItem.GetText();

				if ( oProperties.GetNode( _T("cp:lastPrinted"), oItem ) )
					m_sLastPrinted = oItem.GetText();

				if ( oProperties.GetNode( _T("dcterms:modified"), oItem ) )
					m_sModified = oItem.GetText();

				if ( oProperties.GetNode( _T("cp:revision"), oItem ) )
					m_sRevision = oItem.GetText();

				if ( oProperties.GetNode( _T("dc:subject"), oItem ) )
					m_sSubject = oItem.GetText();

				if ( oProperties.GetNode( _T("dc:title"), oItem ) )
					m_sTitle = oItem.GetText();

				if ( oProperties.GetNode( _T("cp:version"), oItem ) )
					m_sVersion = oItem.GetText();
			}
		}
		virtual void write(const CPath& oPath, const CPath& oDirectory, CContentTypes& oContent) const
		{
			CString sXml;
			sXml = _T("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><cp:coreProperties xmlns:cp=\"http://schemas.openxmlformats.org/package/2006/metadata/core-properties\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:dcterms=\"http://purl.org/dc/terms/\" xmlns:dcmitype=\"http://purl.org/dc/dcmitype/\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">");

			if ( m_sCategory.IsInit() )
			{
				sXml += _T("<cp:category>");
				sXml += m_sCategory.get();
				sXml += _T("</cp:category>");
			}

			if ( m_sContentStatus.IsInit() )
			{
				sXml += _T("<cp:contentStatus>");
				sXml += m_sContentStatus.get();
				sXml += _T("</cp:contentStatus>");
			}

			if ( m_sCreated.IsInit() )
			{
				sXml += _T("<dcterms:created xsi:type=\"dcterms:W3CDTF\">");
				sXml += m_sCreated.get();
				sXml += _T("</dcterms:created>");
			}

			if ( m_sCreator.IsInit() )
			{
				sXml += _T("<dc:creator>");
				sXml += m_sCreator.get();
				sXml += _T("</dc:creator>");
			}

			if ( m_sDescription.IsInit() )
			{
				sXml += _T("<dc:description>");
				sXml += m_sDescription.get();
				sXml += _T("</dc:description>");
			}

			if ( m_sIdentifier.IsInit() )
			{
				sXml += _T("<dc:identifier>");
				sXml += m_sIdentifier.get();
				sXml += _T("</dc:identifier>");
			}

			if ( m_sKeywords.IsInit() )
			{
				sXml += _T("<cp:keywords>");
				sXml += m_sKeywords.get();
				sXml += _T("</cp:keywords>");
			}

			if ( m_sLanguage.IsInit() )
			{
				sXml += _T("<dc:language>");
				sXml += m_sLanguage.get();
				sXml += _T("</dc:language>");
			}

			if ( m_sLastModifiedBy.IsInit() )
			{
				sXml += _T("<cp:lastModifiedBy>");
				sXml += m_sLastModifiedBy.get();
				sXml += _T("</cp:lastModifiedBy>");
			}

			if ( m_sLastPrinted.IsInit() )
			{
				sXml += _T("<cp:lastPrinted>");
				sXml += m_sLastPrinted.get();
				sXml += _T("</cp:lastPrinted>");
			}

			if ( m_sModified.IsInit() )
			{
				sXml += _T("<dcterms:modified xsi:type=\"dcterms:W3CDTF\">");
				sXml += m_sModified.get();
				sXml += _T("</dcterms:modified>");
			}

			if ( m_sRevision.IsInit() )
			{
				sXml += _T("<cp:revision>");
				sXml += m_sRevision.get();
				sXml += _T("</cp:revision>");
			}

			if ( m_sSubject.IsInit() )
			{
				sXml += _T("<dc:subject>");
				sXml += m_sSubject.get();
				sXml += _T("</dc:subject>");
			}

			if ( m_sTitle.IsInit() )
			{
				sXml += _T("<dc:title>");
				sXml += m_sTitle.get();
				sXml += _T("</dc:title>");
			}

			if ( m_sVersion.IsInit() )
			{
				sXml += _T("<cp:version>");
				sXml += m_sVersion.get();
				sXml += _T("</cp:version>");
			}

			sXml += _T("</cp:coreProperties>");

			CDirectory::SaveToFile( oPath.GetPath(), sXml );
			oContent.Registration( type().OverrideType(), oDirectory, oPath.GetFilename() );
		}

	public:
		virtual const FileType type() const
		{
			return FileTypes::Core;
		}

		virtual const CPath DefaultDirectory() const
		{
			return type().DefaultDirectory();
		}
		virtual const CPath DefaultFileName() const
		{
			return type().DefaultFileName();
		}

		void SetCreator(CString sVal)
		{
			m_sCreator = sVal;
		}
		void SetLastModifiedBy(CString sVal)
		{
			m_sLastModifiedBy = sVal;
		}
	private:

		nullable<CString> m_sCategory;
		nullable<CString> m_sContentStatus;
		nullable<CString> m_sCreated;
		nullable<CString> m_sCreator;
		nullable<CString> m_sDescription;
		nullable<CString> m_sIdentifier;
		nullable<CString> m_sKeywords;
		nullable<CString> m_sLanguage;
		nullable<CString> m_sLastModifiedBy;
		nullable<CString> m_sLastPrinted;
		nullable<CString> m_sModified;
		nullable<CString> m_sRevision;
		nullable<CString> m_sSubject;
		nullable<CString> m_sTitle;
		nullable<CString> m_sVersion;
	};
} 

#endif // OOX_CORE_INCLUDE_H_