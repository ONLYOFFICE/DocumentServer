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
#ifndef OOX_THEME_THEME_INCLUDE_H_
#define OOX_THEME_THEME_INCLUDE_H_

#include "../../Base/Nullable.h"
#include "../WritingElement.h"

#include "../Drawing/DrawingStyles.h"
#include "../Drawing/DrawingShared.h"

namespace OOX
{
	
	
	
	class CTheme : public OOX::File
	{
	public:
		CTheme()
		{
			m_bWriteContent = true;
		}

		CTheme(const CPath& oPath)
		{
			m_bWriteContent = true;
			read( oPath );
		}

		virtual ~CTheme()
		{
		}

	public:
		virtual void read(const CPath& oFilePath)
		{
			m_oReadPath = oFilePath;
			XmlUtils::CXmlLiteReader oReader;

			if ( !oReader.FromFile( oFilePath.GetPath() ) )
				return;

			if ( !oReader.ReadNextNode() )
				return;

			CWCharWrapper sName = oReader.GetName();
			if ( _T("a:theme") == sName && !oReader.IsEmptyNode() )
			{
				ReadAttributes( oReader );

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
							if      ( _T("a:custClrLst")        == sName ) m_oCustClrLst        = oReader;
							break;
						case 'e':
							if      ( _T("a:extLst")            == sName ) m_oExtLst            = oReader;
							else if ( _T("a:extraClrSchemeLst") == sName ) m_oExtraClrSchemeLst = oReader;
							break;
						case 'o':
							if      ( _T("a:objectDefaults")    == sName ) m_oObjectDefaults    = oReader;
							break;
						case 't':
							if      ( _T("a:themeElements")     == sName ) m_oThemeElements     = oReader;
							break;
						}
					}
				}
			}
		}
		virtual void write(const CPath& oFilePath, const CPath& oDirectory, CContentTypes& oContent) const
		{
			if(m_bWriteContent)
			{
				CString sXml;
				sXml = _T("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><a:theme xmlns:a=\"http://schemas.openxmlformats.org/drawingml/2006/main\" name=\"") + m_sName + _T("\">");

				sXml += m_oThemeElements.toXML();

				if ( m_oObjectDefaults.IsInit() )
					sXml += m_oObjectDefaults->toXML();

				if ( m_oExtraClrSchemeLst.IsInit() )
					sXml += m_oExtraClrSchemeLst->toXML();

				if ( m_oCustClrLst.IsInit() )
					sXml += m_oCustClrLst->toXML();

				if ( m_oExtLst.IsInit() )
					sXml += m_oExtLst->toXML();

				sXml += _T("</a:theme>");

				CDirectory::SaveToFile( oFilePath.GetPath(), sXml );
			}
			oContent.Registration( type().OverrideType(), oDirectory, oFilePath.GetFilename() );
		}

	public:
		virtual const OOX::FileType type() const
		{
			return FileTypes::Theme;
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
			if ( m_oThemeElements.m_oFontScheme.m_oMajorFont.m_oLatin.m_oTypeFace.IsInit() )
				return m_oThemeElements.m_oFontScheme.m_oMajorFont.m_oLatin.m_oTypeFace->GetValue();
			else
				return _T("Times New Roman");
		}		
		const CString GetMinorFont() const
		{
			if ( m_oThemeElements.m_oFontScheme.m_oMinorFont.m_oLatin.m_oTypeFace.IsInit() )
				return m_oThemeElements.m_oFontScheme.m_oMinorFont.m_oLatin.m_oTypeFace->GetValue();
			else
				return _T("Times New Roman");
		}
		const CString GetMajorFontOrEmpty() const
		{
			if ( m_oThemeElements.m_oFontScheme.m_oMajorFont.m_oLatin.m_oTypeFace.IsInit() )
				return m_oThemeElements.m_oFontScheme.m_oMajorFont.m_oLatin.m_oTypeFace->GetValue();
			else
				return CString();
		}		
		const CString GetMinorFontOrEmpty() const
		{
			if ( m_oThemeElements.m_oFontScheme.m_oMinorFont.m_oLatin.m_oTypeFace.IsInit() )
				return m_oThemeElements.m_oFontScheme.m_oMinorFont.m_oLatin.m_oTypeFace->GetValue();
			else
				return CString();
		}
		void DoNotWriteContent(bool bDoNotWriteContent)
		{
			m_bWriteContent = !bDoNotWriteContent;
		}
	private:

		void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
		{
			
			WritingElement_ReadAttributes_Start( oReader )
			WritingElement_ReadAttributes_ReadSingle( oReader, _T("name"), m_sName )
			WritingElement_ReadAttributes_End( oReader )
		}

	public:
		CPath									m_oReadPath;
		
		CString                                        m_sName;

		
		nullable<OOX::Drawing::CCustomColorList>        m_oCustClrLst;
		nullable<OOX::Drawing::COfficeArtExtensionList> m_oExtLst;
		nullable<OOX::Drawing::CColorSchemeList>       m_oExtraClrSchemeLst;
		nullable<OOX::Drawing::CObjectStyleDefaults>   m_oObjectDefaults;
		OOX::Drawing::CBaseStyles                      m_oThemeElements;

		bool m_bWriteContent;
	};
} 

#endif // OOX_THEME_THEME_INCLUDE_H_