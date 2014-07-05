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

#ifndef OOX_FONTTABLE_INCLUDE_H_
#define OOX_FONTTABLE_INCLUDE_H_

#include "File.h"
#include "Font.h"
#include "FileTypes.h"

#include "../Common/SimpleTypes_Word.h"
#include "../Common/SimpleTypes_Shared.h"

namespace OOX
{
	class CFontTable : public OOX::File
	{
	public:

		CFontTable()
		{
		}
		CFontTable(const CPath &oFilePath)
		{
			read( oFilePath );
		}

		virtual ~CFontTable()
		{
		}

		bool Find(CString &sFontName, CFont &oFont)
		{
			for ( int nIndex = 0; nIndex < m_arrFonts.GetSize(); nIndex++ )
			{
				if ( sFontName == m_arrFonts[nIndex].m_sName )
				{
					oFont = m_arrFonts[nIndex];
					return true;
				}
			}

			return false;
		}


	public:

		virtual void read(const CPath &oFilePath)
		{
			XmlUtils::CXmlNode oFonts;
			oFonts.FromXmlFile( oFilePath.GetPath(), true );

			if ( _T("w:fonts") == oFonts.GetName() )
			{
				XmlUtils::CXmlNodes oFontList;
				oFonts.GetNodes( _T("w:font"), oFontList );

				for ( int nFontIndex = 0; nFontIndex < oFontList.GetCount(); nFontIndex++ )
				{
					XmlUtils::CXmlNode oFontNode;
					if ( oFontList.GetAt( nFontIndex, oFontNode ) )
					{
						CFont oFont;
						oFont.fromXML( oFontNode );
						m_arrFonts.Add( oFont );
					}
				}
			}
		}
		virtual void write(const CPath &oFilePath, const CPath &oDirectoryPath, CContentTypes& content) const
		{
			CString sXml;
			sXml = _T("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><w:fonts xmlns:r=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships\" xmlns:w=\"http://schemas.openxmlformats.org/wordprocessingml/2006/main\">");
			for ( int nIndex = 0; nIndex < m_arrFonts.GetSize(); nIndex++ )
			{
				const CFont &oFont = m_arrFonts[nIndex];
				sXml += oFont.toXML();
			}
			sXml += _T("</w:fonts>");

			CDirectory::SaveToFile( oFilePath.GetPath(), sXml );
		}

	public:

		virtual const FileType type() const
		{
			return FileTypes::FontTable;
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

		CSimpleArray<CFont> m_arrFonts;

	};

} 

#endif // OOX_FONTTABLE_INCLUDE_H_