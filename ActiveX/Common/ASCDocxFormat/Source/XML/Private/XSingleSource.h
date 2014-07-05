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
#ifndef XML_PRIVATE_XSINGLE_SOURCE_INCLUDE_H_
#define XML_PRIVATE_XSINGLE_SOURCE_INCLUDE_H_

#include <iterator>
#include <string>

namespace XML
{
	namespace Private
	{
		class XSingleSource
		{
		public:
			virtual ~XSingleSource();

		public:
			virtual void next();
			virtual void skipSpace();
			virtual void find(const char value);
			virtual void find(const char value1, const char value2);
			virtual void findAndSkip(const char value);
			virtual const char get() const;
			virtual const std::string getString(const char separator);
			virtual const std::string getString(const char separator1, const char separator2);

		public:
			virtual const std::pair<const std::string, const std::string> getName();
			virtual const std::pair<const std::string, const std::string> getPair();
			virtual const std::pair<const std::pair<const std::string, const std::string>, const std::string> getAttribute();

		private:
			const bool isSpace() const;
			const bool isSeparator() const;

			const std::string get(const char separator1, const char separator2);
			const std::string getToSeparator();
			const std::string getToSeparator(const char separator);
			const std::string getValue();

		protected:
			std::istreambuf_iterator<char>	m_iterator;
		};
	} 
} 

#endif // XML_PRIVATE_XSINGLE_SOURCE_INCLUDE_H_