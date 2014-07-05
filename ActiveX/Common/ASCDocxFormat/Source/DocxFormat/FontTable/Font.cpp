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
 
#include "precompiled_docxformat.h"


#include "./../FontTable.h"

namespace OOX
{
	FontTable::Font::Font()
	{
		m_name		=	std::wstring(_T("Arial"));
		m_usb0		=	std::wstring(_T("00000000"));
		m_usb1		=	std::wstring(_T("00000000"));
		m_usb2		=	std::wstring(_T("00000000"));	
		m_usb3		=	std::wstring(_T("00000000"));
		m_csb0		=	std::wstring(_T("00000000"));	
		m_csb1		=	std::wstring(_T("00000000"));
		m_family	=	std::wstring(L"");
		m_charset	=	std::wstring(L"");
		m_pitch		=	std::wstring(L"");
		m_panose1	=	std::wstring(L"");
	}

	FontTable::Font::~Font()
	{
	}

	FontTable::Font::Font(XmlUtils::CXmlNode& node)
	{
		fromXML(node);
	}

	const FontTable::Font& FontTable::Font::operator =(XmlUtils::CXmlNode& node)
	{
		fromXML(node);
		return *this;
	}

	void FontTable::Font::fromXML(XmlUtils::CXmlNode& oNode)
	{
		if ( _T("w:font") == oNode.GetName() )
		{
			m_name = std::wstring(static_cast<const wchar_t*>(oNode.GetAttributeBase( _T("w:name"))));

			XmlUtils::CXmlNode oChild;
			if ( oNode.GetNode( _T("w:panose1"), oChild ) )
				m_panose1 = std::wstring(static_cast<const wchar_t*>(oChild.GetAttributeBase( _T("w:val"))));
			if ( oNode.GetNode( _T("w:charset"), oChild ) )
				m_charset = std::wstring(static_cast<const wchar_t*>(oChild.GetAttributeBase( _T("w:val"))));
			if ( oNode.GetNode( _T("w:family"), oChild ) )
				m_family = std::wstring(static_cast<const wchar_t*>(oChild.GetAttributeBase( _T("w:val"))));	
			if ( oNode.GetNode( _T("w:pitch"), oChild ) )
				m_pitch = std::wstring(static_cast<const wchar_t*>(oChild.GetAttributeBase( _T("w:val"))));	
			if ( oNode.GetNode( _T("w:sig"), oChild ) )
			{
				m_usb0	= std::wstring(static_cast<const wchar_t*>(oChild.GetAttributeBase( _T("w:usb0"))));		
				m_usb1	= std::wstring(static_cast<const wchar_t*>(oChild.GetAttributeBase( _T("w:usb1"))));		
				m_usb2	= std::wstring(static_cast<const wchar_t*>(oChild.GetAttributeBase( _T("w:usb2"))));		
				m_usb3	= std::wstring(static_cast<const wchar_t*>(oChild.GetAttributeBase( _T("w:usb3"))));	
				m_csb0	= std::wstring(static_cast<const wchar_t*>(oChild.GetAttributeBase( _T("w:csb0"))));	
				m_csb1	= std::wstring(static_cast<const wchar_t*>(oChild.GetAttributeBase( _T("w:csb1"))));	
			}
		}
	}
} // namespace OOX