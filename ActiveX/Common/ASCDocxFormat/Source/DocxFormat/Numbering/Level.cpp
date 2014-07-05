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


#include "./../Numbering.h"

namespace OOX
{
	Numbering::Level::Level()
	{
		Tentative	=	0;
		Align		=	Logic::Align();
		NumFmt		=	OOX::Logic::NumFormat();
	}

	Numbering::Level::~Level()
	{
	}

	Numbering::Level::Level(XmlUtils::CXmlNode& oNode)
	{
		fromXML(oNode);
	}

	const Numbering::Level& Numbering::Level::operator =(XmlUtils::CXmlNode& oNode)
	{
		fromXML(oNode);
		return *this;
	}

	void Numbering::Level::fromXML(XmlUtils::CXmlNode& oNode)
	{
		if ( _T("w:lvl") == oNode.GetName() )
		{
			Ilvl = _wtoi(static_cast<const wchar_t*>(oNode.GetAttributeBase( _T("w:ilvl"))));
			Tentative = _wtoi(static_cast<const wchar_t*>(oNode.GetAttributeBase( _T("w:tentative"))));
			Tplc = std::wstring(static_cast<const wchar_t*>(oNode.GetAttributeBase( _T("w:tentative"))));

			XmlUtils::CXmlNode oChild;
			
			if ( oNode.GetNode( _T("w:suff"), oChild ) )
				Suffix = std::wstring(static_cast<const wchar_t*>(oChild.GetAttributeBase( _T("w:val"))));
			
			if ( oNode.GetNode( _T("w:lvlText"), oChild ) )
				Text = std::wstring(static_cast<const wchar_t*>(oChild.GetAttributeBase( _T("w:val"))));
			
			if ( oNode.GetNode( _T("w:lvlJc"), oChild ) )
				Align = Logic::Align(std::wstring(static_cast<const wchar_t*>(oChild.GetAttributeBase( _T("w:val")))));
			
			if ( oNode.GetNode( _T("w:start"), oChild ) )
				Start = _wtoi(static_cast<const wchar_t*>(oChild.GetAttributeBase( _T("w:val"))));

			if ( oNode.GetNode( _T("w:numFmt"), oChild ) )
			{
				OOX::Logic::NumFormat fmt;
				fmt.fromXML(oChild);
				NumFmt = fmt;
			}
		}

		

		
		
	}
} // namespace OOX