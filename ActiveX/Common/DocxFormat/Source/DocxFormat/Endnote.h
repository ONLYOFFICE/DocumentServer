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
#ifndef OOX_ENDNOTE_INCLUDE_H_
#define OOX_ENDNOTE_INCLUDE_H_

#include "File.h"
#include "IFileContainer.h"
#include "FtnEdn.h"
#include "Logic/RunContent.h"

namespace OOX
{
	
	
	
	class CEndnotes : public OOX::File, public OOX::IFileContainer
	{
	public:

		CEndnotes()
		{
		}
		CEndnotes(const CPath& oPath)
		{
			read( oPath );
		}
		virtual ~CEndnotes()
		{
			for ( int nIndex = 0; nIndex < m_arrEndnote.GetSize(); nIndex++ )
			{
				if ( m_arrEndnote[nIndex] )
					delete m_arrEndnote[nIndex];
			}

			m_arrEndnote.RemoveAll();
		}
	public:

		virtual void read(const CPath& oPath)
		{
			IFileContainer::Read( oPath );

			XmlUtils::CXmlNode oEndnotes;
			oEndnotes.FromXmlFile( oPath.GetPath(), true );

			if ( _T("w:endnotes") == oEndnotes.GetName() )
			{
				XmlUtils::CXmlNodes oEndnoteList;
				oEndnotes.GetNodes( _T("w:endnote"), oEndnoteList );

				for ( int nIndex = 0; nIndex < oEndnoteList.GetCount(); nIndex++ )
				{
					XmlUtils::CXmlNode oEndnoteNode;
					if ( oEndnoteList.GetAt( nIndex, oEndnoteNode ) )
					{
						CFtnEdn *pEndnote = new CFtnEdn( oEndnoteNode );
						m_arrEndnote.Add( pEndnote );
					}
				}
			}
		}
		virtual void write(const CPath& oPath, const CPath& oDirectory, CContentTypes& oContent) const
		{
			CString sXml;
			sXml = _T("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><w:endnotes xmlns:wpc=\"http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas\" xmlns:mc=\"http://schemas.openxmlformats.org/markup-compatibility/2006\" xmlns:o=\"urn:schemas-microsoft-com:office:office\" xmlns:r=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships\" xmlns:m=\"http://schemas.openxmlformats.org/officeDocument/2006/math\" xmlns:v=\"urn:schemas-microsoft-com:vml\" xmlns:wp14=\"http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing\" xmlns:wp=\"http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing\" xmlns:w10=\"urn:schemas-microsoft-com:office:word\" xmlns:w=\"http://schemas.openxmlformats.org/wordprocessingml/2006/main\" xmlns:w14=\"http://schemas.microsoft.com/office/word/2010/wordml\" xmlns:wpg=\"http://schemas.microsoft.com/office/word/2010/wordprocessingGroup\" xmlns:wpi=\"http://schemas.microsoft.com/office/word/2010/wordprocessingInk\" xmlns:wne=\"http://schemas.microsoft.com/office/word/2006/wordml\" xmlns:wps=\"http://schemas.microsoft.com/office/word/2010/wordprocessingShape\" mc:Ignorable=\"w14 wp14\">");
			for ( int nIndex = 0; nIndex < m_arrEndnote.GetSize(); nIndex++ )
			{
				if ( m_arrEndnote[nIndex] )
					sXml += m_arrEndnote[nIndex]->toXML();
			}
			sXml += _T("</w:endnotes>");
			CDirectory::SaveToFile( oPath.GetPath(), sXml );

			oContent.Registration( type().OverrideType(), oDirectory, oPath );
			IFileContainer::Write( oPath, oDirectory, oContent );
		}

	public:
		virtual const OOX::FileType type() const
		{
			return FileTypes::EndNote;
		}
		virtual const CPath DefaultDirectory() const
		{
			return type().DefaultDirectory();
		}
		virtual const CPath DefaultFileName() const
		{
			return type().DefaultFileName();
		}

	public:

		OOX::CFtnEdn *Find(const OOX::Logic::CEndnoteReference& oReference) const
		{
			if ( !oReference.m_oId.IsInit() )
				return NULL;

			for ( int nIndex = 0; nIndex < m_arrEndnote.GetSize(); nIndex++ )
			{
				if ( m_arrEndnote[nIndex]->m_oId.IsInit() && ( m_arrEndnote[nIndex]->m_oId == oReference.m_oId ) )
					return m_arrEndnote[nIndex];
			}

			return NULL;
		}
		void       Add(OOX::CFtnEdn* pEndnote)
		{
			m_arrEndnote.Add( pEndnote );
		}		
		const int  GetCount() const
		{
			return m_arrEndnote.GetSize();
		}

	public:

		CSimpleArray<OOX::CFtnEdn*> m_arrEndnote;
	};
} 
#endif // OOX_ENDNOTE_INCLUDE_H_