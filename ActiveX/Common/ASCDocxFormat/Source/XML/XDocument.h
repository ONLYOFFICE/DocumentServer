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
#ifndef XML_XDOCUMENT_INCLUDE_H_
#define XML_XDOCUMNET_INCLUDE_H_

#include "property.h"
#include "XElement.h"
#include "Private/XDeclaration.h"
#include "Private/XSingleSource.h"
#include "Private/XWideSource.h"

#include "../../../../Common/DocxFormat/Source/SystemUtility/SystemUtility.h"
#include "../../../../Common/DocxFormat/Source/Base/SmartPtr.h"

namespace XML
{
	class XDocument
	{
	public:
		explicit XDocument(const XElement& element);
		explicit XDocument(const wchar_t* source, const bool space = false);
		explicit XDocument(const std::string& source, const bool space = false);
		explicit XDocument(const std::wstring& source, const bool space = false);
		explicit XDocument(const OOX::CPath& source, const bool space = false);

	public:
		XDocument const* const	operator->() const	{return this;}
		XDocument*							operator->()				{return this;}

	public:
		const std::string ToString();
		const std::wstring ToWString();
	
	public:
		void Save(const OOX::CPath& path);
		void Save(std::string& source);
		void Save(std::wstring& source);

	public:
		property<Private::XDeclaration> Declaration;
		XElement	Root;

	private:
		void Load(NSCommon::smart_ptr<Private::XSingleSource> source, const bool space = false);
		void Load(NSCommon::smart_ptr<Private::XWideSource> source, const bool space = false);
	};
} 

#endif // XML_XDOCUMENT_INCLUDE_H_