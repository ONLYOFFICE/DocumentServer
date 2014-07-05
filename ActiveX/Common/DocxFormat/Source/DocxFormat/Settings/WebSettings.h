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
#ifndef OOX_WEBSETTINGS_INCLUDE_H_
#define OOX_WEBSETTINGS_INCLUDE_H_

#include "File.h"
#include "../Common/ComplexTypes.h"

namespace SimpleTypes
{	
	
	
	

	enum EOptimizeForBrowserTarget
	{
		optforbrowserXhtmlCSS1 = 0,
		optforbrowserHtml4CSS1 = 1,
		optforbrowserXhtmlCSS2 = 2,
		optforbrowserHtml4CSS2 = 3
	};

	template<EOptimizeForBrowserTarget eDefValue = optforbrowserHtml4CSS2>
	class COptimizeForBrowserTarget : public CSimpleType<EOptimizeForBrowserTarget, eDefValue>
	{
	public:

		COptimizeForBrowserTarget() {} 

		virtual EOptimizeForBrowserTarget FromString(CString &sValue)
		{
			if       ( _T("W3C XHTML+CSS1") == sValue ) m_eValue = optforbrowserXhtmlCSS1;
			else if  ( _T("W3C HTML4+CSS1") == sValue ) m_eValue = optforbrowserHtml4CSS1;
			else if  ( _T("W3C XHTML+CSS2") == sValue ) m_eValue = optforbrowserXhtmlCSS2;
			else if  ( _T("W3C HTML4+CSS2") == sValue ) m_eValue = optforbrowserHtml4CSS2;
			else                                        m_eValue = eDefValue;

			return m_eValue;
		}

		virtual CString                   ToString() const 
		{
			switch(m_eValue)
			{
			case optforbrowserXhtmlCSS1 : return _T("W3C XHTML+CSS1");
			case optforbrowserHtml4CSS1 : return _T("W3C HTML4+CSS1 ");
			case optforbrowserXhtmlCSS2 : return _T("W3C XHTML+CSS2 ");
			case optforbrowserHtml4CSS2 : return _T("W3C HTML4+CSS2 ");
			default                     : return _T("W3C HTML4+CSS2 ");
			}
		}

		SimpleType_FromString     (EOptimizeForBrowserTarget)
		SimpleType_Operator_Equal (COptimizeForBrowserTarget)
	};

} 

namespace ComplexTypes
{
	namespace Word
	{
		
		
		
		class COptimizeForBrowser : public ComplexType
		{
		public:
			ComplexTypes_AdditionConstructors(COptimizeForBrowser)
			COptimizeForBrowser()
			{
			}
			virtual ~COptimizeForBrowser()
			{
			}

			virtual void    FromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("w:val"),    m_oVal );
				oNode.ReadAttributeBase( _T("w:target"), m_oTarget );
			}
			virtual void    FromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("w:val"),    m_oVal )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:target"), m_oTarget )
				WritingElement_ReadAttributes_End( oReader )
			}
			virtual CString ToString() const
			{
				CString sResult;

				ComplexTypes_WriteAttribute( _T("w:val=\""),    m_oVal );
				ComplexTypes_WriteAttribute( _T("w:target=\""), m_oTarget );

				return sResult;
			}

		public:

			nullable<SimpleTypes::COptimizeForBrowserTarget<>> m_oTarget;
			nullable<SimpleTypes::COnOff<>                   > m_oVal;
		};

	} 
} 

namespace OOX
{
	

	
	
	
	class CWebSettings : public OOX::File
	{
	public:
		CWebSettings()
		{
		}
		CWebSettings(const CPath& oPath)
		{
			read( oPath );
		}
		virtual ~CWebSettings()
		{
		}

	public:
		virtual void read(const CPath& oFilePath)
		{
#ifdef USE_LITE_READER
			XmlUtils::CXmlLiteReader oReader;

			if ( !oReader.FromFile( oFilePath.GetPath() ) )
				return;

			if ( !oReader.ReadNextNode() )
				return;

			CWCharWrapper sName = oReader.GetName();
			if ( _T("w:webSettings") == sName && !oReader.IsEmptyNode() )
			{
				int nStylesDepth = oReader.GetDepth();
				while ( oReader.ReadNextSiblingNode( nStylesDepth ) )
				{
					sName = oReader.GetName();
					if ( _T("w:allowPNG") == sName )
						m_oAllowPNG = oReader;
					else if ( _T("w:optimizeForBrowser") == sName )
						m_oOptimizeForBrowser = oReader;
				}
			}

#else
			XmlUtils::CXmlNode oWebSettings;
			oWebSettings.FromXmlFile( oFilePath.GetPath(), true );

			if ( _T("w:webSettings") == oWebSettings.GetName() )
			{
				XmlUtils::CXmlNode oNode;

				if ( oWebSettings.GetNode( _T("w:allowPNG"), oNode ) )
					m_oAllowPNG = oNode;

				if ( oWebSettings.GetNode( _T("w:optimizeForBrowser"), oNode ) )
					m_oOptimizeForBrowser = oNode;
			}
#endif
		}
		virtual void write(const CPath& oFilePath, const CPath& oDirectory, CContentTypes& oContent) const
		{
			CString sXml;
			sXml = _T("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><w:webSettings xmlns:mc=\"http://schemas.openxmlformats.org/markup-compatibility/2006\" xmlns:r=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships\" xmlns:w=\"http://schemas.openxmlformats.org/wordprocessingml/2006/main\" xmlns:w14=\"http://schemas.microsoft.com/office/word/2010/wordml\" mc:Ignorable=\"w14\">");

			if ( m_oAllowPNG.IsInit() )
			{
				sXml += _T("<w:allowPNG ");
				sXml += m_oAllowPNG->ToString();
				sXml += _T("/>");
			}

			if ( m_oOptimizeForBrowser.IsInit() )
			{
				sXml += _T("<w:optimizeForBrowser ");
				sXml += m_oOptimizeForBrowser->ToString();
				sXml += _T("/>");
			}

			sXml += _T("</w:webSettings>");
			CDirectory::SaveToFile( oFilePath.GetPath(), sXml );

			oContent.Registration( type().OverrideType(), oDirectory, oFilePath );
		}

	public:
		virtual const OOX::FileType type() const
		{
			return FileTypes::WebSetting;
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

		
		nullable<ComplexTypes::Word::COnOff2<SimpleTypes::onoffTrue> > m_oAllowPNG;
		nullable<ComplexTypes::Word::COptimizeForBrowser             > m_oOptimizeForBrowser;
	};
} 

#endif // OOX_WEBSETTING_INCLDUE_H_