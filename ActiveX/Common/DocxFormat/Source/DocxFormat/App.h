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
#ifndef OOX_APP_INCLUDE_H_
#define OOX_APP_INCLUDE_H_

#include "File.h"
#include "../Base/Nullable.h"
#include "../Common/SimpleTypes_Word.h"
#include "../Common/SimpleTypes_Shared.h"

namespace OOX
{
	class CApp : public OOX::File
	{
	public:
		CApp()
		{
		}
		CApp(const CPath& oPath)
		{
			read( oPath );
		}
		virtual ~CApp()
		{
		}


	public:
		virtual void read(const CPath& oPath)
		{
			XmlUtils::CXmlNode oProperties;
			oProperties.FromXmlFile( oPath.GetPath(), true );

			if ( _T("Properties") == oProperties.GetName() )
			{
				XmlUtils::CXmlNode oItem;

				if ( oProperties.GetNode( _T("Application"), oItem ) )
					m_sApplication = oItem.GetText();

				if ( oProperties.GetNode( _T("AppVersion"), oItem ) )
					m_sAppVersion = oItem.GetText();

				if ( oProperties.GetNode( _T("Characters"), oItem ) )
				{
					SimpleTypes::CDecimalNumber<> oNum = oItem.GetText();
					m_nCharacters = oNum.GetValue();
				}

				if ( oProperties.GetNode( _T("CharactersWithSpaces"), oItem ) )
				{
					SimpleTypes::CDecimalNumber<> oNum = oItem.GetText();
					m_nCharactersWithSpaces = oNum.GetValue();
				}

				if ( oProperties.GetNode( _T("Company"), oItem ) )
					m_sCompany = oItem.GetText();

				if ( oProperties.GetNode( _T("DocSecurity"), oItem ) )
				{
					SimpleTypes::CDecimalNumber<> oNum = oItem.GetText();
					m_nDocSecurity = oNum.GetValue();
				}

				if ( oProperties.GetNode( _T("HiddenSlides"), oItem ) )
				{
					SimpleTypes::CDecimalNumber<> oNum = oItem.GetText();
					m_nHiddenSlides = oNum.GetValue();
				}

				if ( oProperties.GetNode( _T("HyperlinkBase"), oItem ) )
					m_sHyperlinkBase = oItem.GetText();

				if ( oProperties.GetNode( _T("HyperlinksChanged"), oItem ) )
				{
					SimpleTypes::COnOff<> oBool = oItem.GetText();
					m_bHyperlinksChanged = (oBool.GetValue() == SimpleTypes::onoffTrue);
				}

				if ( oProperties.GetNode( _T("Lines"), oItem ) )
				{
					SimpleTypes::CDecimalNumber<> oNum = oItem.GetText();
					m_nLines = oNum.GetValue();
				}

				if ( oProperties.GetNode( _T("LinksUpToDate"), oItem ) )
				{
					SimpleTypes::COnOff<> oBool = oItem.GetText();
					m_bLinksUpToDate = (oBool.GetValue() == SimpleTypes::onoffTrue);
				}

				if ( oProperties.GetNode( _T("Manager"), oItem ) )
					m_sManager = oItem.GetText();

				if ( oProperties.GetNode( _T("MMClips"), oItem ) )
				{
					SimpleTypes::CDecimalNumber<> oNum = oItem.GetText();
					m_nMMClips = oNum.GetValue();
				}

				if ( oProperties.GetNode( _T("Notes"), oItem ) )
				{
					SimpleTypes::CDecimalNumber<> oNum = oItem.GetText();
					m_nNotes = oNum.GetValue();
				}

				if ( oProperties.GetNode( _T("Pages"), oItem ) )
				{
					SimpleTypes::CDecimalNumber<> oNum = oItem.GetText();
					m_nPages = oNum.GetValue();
				}

				if ( oProperties.GetNode( _T("Paragraphs"), oItem ) )
				{
					SimpleTypes::CDecimalNumber<> oNum = oItem.GetText();
					m_nParagraphs = oNum.GetValue();
				}

				if ( oProperties.GetNode( _T("ScaleCrop"), oItem ) )
				{
					SimpleTypes::COnOff<> oBool = oItem.GetText();
					m_bScaleCrop = (oBool.GetValue() == SimpleTypes::onoffTrue);
				}

				if ( oProperties.GetNode( _T("SharedDoc"), oItem ) )
				{
					SimpleTypes::COnOff<> oBool = oItem.GetText();
					m_bSharedDoc = (oBool.GetValue() == SimpleTypes::onoffTrue);
				}

				if ( oProperties.GetNode( _T("Slides"), oItem ) )
				{
					SimpleTypes::CDecimalNumber<> oNum = oItem.GetText();
					m_nSlides = oNum.GetValue();
				}

				if ( oProperties.GetNode( _T("Template"), oItem ) )
					m_sTemplate = oItem.GetText();

				if ( oProperties.GetNode( _T("TotalTime"), oItem ) )
				{
					SimpleTypes::CDecimalNumber<> oNum = oItem.GetText();
					m_nTotalTime = oNum.GetValue();
				}

				if ( oProperties.GetNode( _T("Words"), oItem ) )
				{
					SimpleTypes::CDecimalNumber<> oNum = oItem.GetText();
					m_nWords = oNum.GetValue();
				}
			}
		}
		virtual void write(const CPath& oPath, const CPath& oDirectory, CContentTypes& oContent) const
		{
			CString sXml;
			sXml = _T("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><Properties xmlns=\"http://schemas.openxmlformats.org/officeDocument/2006/extended-properties\" xmlns:vt=\"http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes\">");

			if ( m_sApplication.IsInit() )
			{
				sXml += _T("<Application>");
				sXml += m_sApplication.get();
				sXml += _T("</Application>");
			}

			if ( m_sAppVersion.IsInit() )
			{
				sXml += _T("<AppVersion>");
				sXml += m_sAppVersion.get();
				sXml += _T("</AppVersion>");
			}

			if ( m_nCharacters.IsInit() )
			{
				SimpleTypes::CDecimalNumber<> oNum;
				oNum.SetValue( m_nCharacters.get() );

				sXml += _T("<Characters>");
				sXml += oNum.ToString();
				sXml += _T("</Characters>");
			}

			if ( m_nCharactersWithSpaces.IsInit() )
			{
				SimpleTypes::CDecimalNumber<> oNum;
				oNum.SetValue( m_nCharactersWithSpaces.get() );

				sXml += _T("<CharactersWithSpaces>");
				sXml += oNum.ToString();
				sXml += _T("</CharactersWithSpaces>");
			}

			if ( m_sCompany.IsInit() )
			{
				sXml += _T("<Company>");
				sXml += m_sCompany.get();
				sXml += _T("</Company>");
			}

			if ( m_nDocSecurity.IsInit() )
			{
				SimpleTypes::CDecimalNumber<> oNum;
				oNum.SetValue( m_nDocSecurity.get() );

				sXml += _T("<DocSecurity>");
				sXml += oNum.ToString();
				sXml += _T("</DocSecurity>");
			}

			if ( m_nHiddenSlides.IsInit() )
			{
				SimpleTypes::CDecimalNumber<> oNum;
				oNum.SetValue( m_nHiddenSlides.get() );

				sXml += _T("<HiddenSlides>");
				sXml += oNum.ToString();
				sXml += _T("</HiddenSlides>");
			}

			if ( m_sHyperlinkBase.IsInit() )
			{
				sXml += _T("<HyperlinkBase>");
				sXml += m_sHyperlinkBase.get();
				sXml += _T("</HyperlinkBase>");
			}

			if ( m_bHyperlinksChanged.IsInit() )
			{
				SimpleTypes::COnOff<> oBool;
				oBool.SetValue( m_bHyperlinksChanged.get() ? SimpleTypes::onoffTrue : SimpleTypes::onoffFalse );

				sXml += _T("<HyperlinksChanged>");
				sXml += oBool.ToString();
				sXml += _T("</HyperlinksChanged>");
			}

			if ( m_nLines.IsInit() )
			{
				SimpleTypes::CDecimalNumber<> oNum;
				oNum.SetValue( m_nLines.get() );

				sXml += _T("<Lines>");
				sXml += oNum.ToString();
				sXml += _T("</Lines>");
			}

			if ( m_bLinksUpToDate.IsInit() )
			{
				SimpleTypes::COnOff<> oBool;
				oBool.SetValue( m_bLinksUpToDate.get() ? SimpleTypes::onoffTrue : SimpleTypes::onoffFalse );

				sXml += _T("<LinksUpToDate>");
				sXml += oBool.ToString();
				sXml += _T("</LinksUpToDate>");
			}

			if ( m_sManager.IsInit() )
			{
				sXml += _T("<Manager>");
				sXml += m_sManager.get();
				sXml += _T("</Manager>");
			}

			if ( m_nMMClips.IsInit() )
			{
				SimpleTypes::CDecimalNumber<> oNum;
				oNum.SetValue( m_nMMClips.get() );

				sXml += _T("<MMClips>");
				sXml += oNum.ToString();
				sXml += _T("</MMClips>");
			}

			if ( m_nNotes.IsInit() )
			{
				SimpleTypes::CDecimalNumber<> oNum;
				oNum.SetValue( m_nNotes.get() );

				sXml += _T("<Notes>");
				sXml += oNum.ToString();
				sXml += _T("</Notes>");
			}

			if ( m_nPages.IsInit() )
			{
				SimpleTypes::CDecimalNumber<> oNum;
				oNum.SetValue( m_nPages.get() );

				sXml += _T("<Pages>");
				sXml += oNum.ToString();
				sXml += _T("</Pages>");
			}

			if ( m_nParagraphs.IsInit() )
			{
				SimpleTypes::CDecimalNumber<> oNum;
				oNum.SetValue( m_nParagraphs.get() );

				sXml += _T("<Paragraphs>");
				sXml += oNum.ToString();
				sXml += _T("</Paragraphs>");
			}

			if ( m_bScaleCrop.IsInit() )
			{
				SimpleTypes::COnOff<> oBool;
				oBool.SetValue( m_bScaleCrop.get() ? SimpleTypes::onoffTrue : SimpleTypes::onoffFalse );

				sXml += _T("<ScaleCrop>");
				sXml += oBool.ToString();
				sXml += _T("</ScaleCrop>");
			}

			if ( m_bSharedDoc.IsInit() )
			{
				SimpleTypes::COnOff<> oBool;
				oBool.SetValue( m_bSharedDoc.get() ? SimpleTypes::onoffTrue : SimpleTypes::onoffFalse );

				sXml += _T("<SharedDoc>");
				sXml += oBool.ToString();
				sXml += _T("</SharedDoc>");
			}

			if ( m_nSlides.IsInit() )
			{
				SimpleTypes::CDecimalNumber<> oNum;
				oNum.SetValue( m_nSlides.get() );

				sXml += _T("<Slides>");
				sXml += oNum.ToString();
				sXml += _T("</Slides>");
			}

			if ( m_sTemplate.IsInit() )
			{
				sXml += _T("<Template>");
				sXml += m_sTemplate.get();
				sXml += _T("</Template>");
			}

			if ( m_nTotalTime.IsInit() )
			{
				SimpleTypes::CDecimalNumber<> oNum;
				oNum.SetValue( m_nTotalTime.get() );

				sXml += _T("<TotalTime>");
				sXml += oNum.ToString();
				sXml += _T("</TotalTime>");
			}

			if ( m_nWords.IsInit() )
			{
				SimpleTypes::CDecimalNumber<> oNum;
				oNum.SetValue( m_nWords.get() );

				sXml += _T("<Words>");
				sXml += oNum.ToString();
				sXml += _T("</Words>");
			}

			sXml += _T("</Properties>");

			CDirectory::SaveToFile( oPath.GetPath(), sXml );
			oContent.Registration( type().OverrideType(), oDirectory, oPath.GetFilename() );
		}

	public:
		virtual const OOX::FileType type() const
		{
			return FileTypes::App;
		}
		virtual const CPath DefaultDirectory() const
		{
			return type().DefaultDirectory();
		}
		virtual const CPath DefaultFileName() const
		{
			return type().DefaultFileName();
		}

		void SetDocSecurity(int nVal)
		{
			m_nDocSecurity = nVal;
		}
		void SetScaleCrop(bool bVal)
		{
			m_bScaleCrop = bVal;
		}
		void SetCompany(CString sVal)
		{
			m_sCompany = sVal;
		}
		void SetLinksUpToDate(bool bVal)
		{
			m_bLinksUpToDate = bVal;
		}
		void SetSharedDoc(bool bVal)
		{
			m_bSharedDoc = bVal;
		}
		void SetHyperlinksChanged(bool bVal)
		{
			m_bHyperlinksChanged = bVal;
		}
	private:
		
		
		
		

		nullable<CString> m_sApplication;
		nullable<CString> m_sAppVersion;
		nullable<int>     m_nCharacters;
		nullable<int>     m_nCharactersWithSpaces;
		nullable<CString> m_sCompany;
		nullable<int>     m_nDocSecurity;
		nullable<int>     m_nHiddenSlides;
		nullable<CString> m_sHyperlinkBase;
		nullable<bool>    m_bHyperlinksChanged;
		nullable<int>     m_nLines;
		nullable<bool>    m_bLinksUpToDate;
		nullable<CString> m_sManager;
		nullable<int>     m_nMMClips;
		nullable<int>     m_nNotes;
		nullable<int>     m_nPages;
		nullable<int>     m_nParagraphs;
		nullable<CString> m_sPresentationForm;
		nullable<bool>    m_bScaleCrop;
		nullable<bool>    m_bSharedDoc;
		nullable<int>     m_nSlides;
		nullable<CString> m_sTemplate;
		nullable<int>     m_nTotalTime;
		nullable<int>     m_nWords;
	};
} 

#endif // OOX_APP_INCLUDE_H_