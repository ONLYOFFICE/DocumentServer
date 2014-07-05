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
#ifndef OOX_THEME_THEME_OVERRIDE_INCLUDE_H_
#define OOX_THEME_THEME_OVERRIDE_INCLUDE_H_

#include "../../Base/Nullable.h"
#include "../WritingElement.h"

#include "../Drawing/DrawingStyles.h"
#include "../Drawing/DrawingShared.h"

namespace OOX
{
	
	
	
	class CThemeOverride : public OOX::File
	{
	public:
		CThemeOverride()
		{
		}

		CThemeOverride(const CPath& oPath)
		{
			read( oPath );
		}

		virtual ~CThemeOverride()
		{
		}

	public:
		virtual void read(const CPath& oFilePath)
		{
			XmlUtils::CXmlLiteReader oReader;

			if ( !oReader.FromFile( oFilePath.GetPath() ) )
				return;

			if ( !oReader.ReadNextNode() )
				return;

			CWCharWrapper sName = oReader.GetName();
			if ( _T("a:themeOverride") == sName && !oReader.IsEmptyNode() )
			{
				int nThemeDepth = oReader.GetDepth();
				while ( oReader.ReadNextSiblingNode( nThemeDepth ) )
				{
					sName = oReader.GetName();

					wchar_t wChar0 = sName[0];
					wchar_t wChar2 = sName[2];

					if ( 'a' == wChar0 )
					{
						switch ( wChar2 )
						{
						case 'c':
							if      ( _T("a:clrScheme")  == sName ) m_oClrScheme  = oReader;
							break;
						case 'f':
							if      ( _T("a:fmtScheme")  == sName ) m_oFmtScheme  = oReader;
							else if ( _T("a:fontScheme") == sName ) m_oFontScheme = oReader;
							break;
						}
					}
				}
			}
		}
		virtual void write(const CPath& oFilePath, const CPath& oDirectory, CContentTypes& oContent) const
		{
			CString sXml;
			sXml = _T("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><a:themeOverride xmlns:a=\"http://schemas.openxmlformats.org/drawingml/2006/main\" >");

			if ( m_oClrScheme.IsInit() )
				sXml += m_oClrScheme->toXML();

			if ( m_oFontScheme.IsInit() )
				sXml += m_oFontScheme->toXML();

			if ( m_oFmtScheme.IsInit() )
				sXml += m_oFmtScheme->toXML();

			sXml += _T("</a:themeOverride>");

			CDirectory::SaveToFile( oFilePath.GetPath(), sXml );
			oContent.Registration( type().OverrideType(), oDirectory, oFilePath );
		}

	public:
		virtual const OOX::FileType type() const
		{
			return FileTypes::ThemeOverride;
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

		const CString GetMajorFont() const
		{
			if ( m_oFontScheme.IsInit() &&  m_oFontScheme->m_oMajorFont.m_oLatin.m_oTypeFace.IsInit() )
				return m_oFontScheme->m_oMajorFont.m_oLatin.m_oTypeFace->GetValue();
			else
				return _T("Times New Roman");
		}		
		const CString GetMinorFont() const
		{
			if ( m_oFontScheme.IsInit() &&  m_oFontScheme->m_oMinorFont.m_oLatin.m_oTypeFace.IsInit() )
				return m_oFontScheme->m_oMinorFont.m_oLatin.m_oTypeFace->GetValue();
			else
				return _T("Times New Roman");
		}

	public:

		
		nullable<OOX::Drawing::CColorScheme> m_oClrScheme;
		nullable<OOX::Drawing::CFontScheme>  m_oFontScheme;
		nullable<OOX::Drawing::CStyleMatrix> m_oFmtScheme;
	};
} 

#endif // OOX_THEME_THEME_OVERRIDE_INCLUDE_H_