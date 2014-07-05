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
#ifndef XML_PRIVATE_XWIDE_SOURCE_INCLUDE_H_
#define XML_PRIVATE_XWIDE_SOURCE_INCLUDE_H_

#include <iterator>
#include <string>

namespace XML
{
	namespace Private
	{
		class XWideSource
		{
		public:
			enum eSourceType {estLittleEndian, estBigEndian, estStringSource};
		public:
			XWideSource(eSourceType type);
			~XWideSource();

		public:
			virtual void next();
			virtual void skipSpace();
			virtual	void find(const wchar_t value);
			virtual	void find(const wchar_t value1, const wchar_t value2);
			virtual void findAndSkip(const wchar_t value);

		public:
			virtual const std::pair<const std::wstring, const std::wstring> getName();
			virtual const std::pair<const std::wstring, const std::wstring> getPair();
			virtual const std::pair<const std::pair<const std::wstring, const std::wstring>, const std::wstring> getAttribute();

		public:
			virtual const wchar_t get() const;
			virtual const std::wstring getString(const wchar_t separator);
			virtual const std::wstring getString(const wchar_t separator1, const wchar_t separator2);

		private:
			const bool isSpace() const;
			const bool isSeparator() const;

			const std::wstring get(const wchar_t separator1, const wchar_t separator2);
			const std::wstring getToSeparator();
			const std::wstring getToSeparator(const wchar_t separator);
			const std::wstring getValue();

		protected:
			std::istreambuf_iterator<wchar_t>		m_iterator;
			wchar_t									m_current;
			eSourceType								m_SourceType;
		};
	} 
} 

#endif // XML_PRIVATE_XWIDE_SOURCE_INCLUDE_H_