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
 
#include "precompiled_xml.h"


#include "XSingleSource.h"
#include "Lexigraph.h"
#include "Exception\not_implement.h"


namespace XML
{
	namespace Private
	{

		XSingleSource::~XSingleSource()
		{
		}


		void XSingleSource::next()
		{
			++m_iterator;
		}


		void XSingleSource::skipSpace()
		{
			for (; isSpace() ; ++m_iterator);
		}


		void XSingleSource::find(const char value)
		{
			
			
			for (; *m_iterator != value; ++m_iterator);
		}


		void XSingleSource::find(const char value1, const char value2)
		{
			for (; ((*m_iterator != value1) && (*m_iterator != value2)); ++m_iterator);
		}


		void XSingleSource::findAndSkip(const char value)
		{
			find(value);
			next();
		}


		const char XSingleSource::get() const
		{
			
			
			return *m_iterator;
		}


		const std::string XSingleSource::getString(const char separator)
		{
			std::string result;
			while (*m_iterator != separator)
				result += *m_iterator++;
			return Lexigraph::fromSource(result);
		}


		const std::string XSingleSource::getString(const char separator1, const char separator2)
		{
			std::string result;
			while ((*m_iterator != separator1) && (*m_iterator != separator2))
				result += *m_iterator++;
			return Lexigraph::fromSource(result);
		}


		const std::pair<const std::string, const std::string> XSingleSource::getName()
		{
			std::string prefix = getToSeparator(':');
			std::string name;
			if (get() == ':')
			{
				next();
				name = getToSeparator();
			}
			else
			{
				std::swap(prefix, name);
			}
			return std::make_pair(prefix, name);
		}


		const std::pair<const std::string, const std::string> XSingleSource::getPair()
		{
			const std::string name = get(' ', '=');
			const std::string value = getValue();
			return std::make_pair(name, value);
		}


		const std::pair<const std::pair<const std::string, const std::string>, const std::string> XSingleSource::getAttribute()
		{
			const std::pair<const std::string, const std::string> name = getName();
			const std::string value = getValue();
			return std::make_pair(name, value);
		}


		const bool XSingleSource::isSpace() const
		{
			if (*m_iterator == ' ' || *m_iterator == '\n' || *m_iterator == '\r' || *m_iterator == '\t')
				return true;
			return false;
		}


		const bool XSingleSource::isSeparator() const
		{
			if (*m_iterator == '<' || *m_iterator == '>' || *m_iterator == '=' || *m_iterator == '/')
				return true;
			return false;
		}


		const std::string XSingleSource::get(const char separator1, const char separator2)
		{
			skipSpace();
			std::string result;
			while (*m_iterator != separator1 && *m_iterator != separator2)
				result += *m_iterator++;
			return result;
		}


		const std::string XSingleSource::getToSeparator()
		{
			skipSpace();
			std::string result;
			while (!isSeparator() && !isSpace())
				result += *m_iterator++;
			return result;
		}


		const std::string XSingleSource::getToSeparator(const char separator)
		{
			skipSpace();
			std::string result;
			while (!isSeparator() && !isSpace() && *m_iterator != separator)
				result += *m_iterator++;
			return result;
		}


		const std::string XSingleSource::getValue()
		{
			find('"', '\'');
			char EndChar = *m_iterator;
			next();
			const std::string value = getString(EndChar);
			next();
			return value;
		}

	} 
} // namespace XML