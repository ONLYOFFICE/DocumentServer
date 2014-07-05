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


#include "XWideSource.h"
#include "Lexigraph.h"
#include "Encoding.h"
#include "Exception\not_implement.h"


namespace XML
{
	namespace Private
	{
		XWideSource::XWideSource(eSourceType type)
			: m_SourceType(type)
			, m_current(0)
		{
		}


		XWideSource::~XWideSource()
		{
		}


		void XWideSource::next()
		{
			if(m_SourceType == estLittleEndian)
			{
				m_current = *m_iterator;
				++m_iterator;
				m_current = ((*m_iterator)<<8) + m_current;
				++m_iterator;
			}
			else if(m_SourceType == estBigEndian)
			{
				m_current = *m_iterator;
				++m_iterator;
				m_current = (m_current << 8) + (*m_iterator);
				++m_iterator;
			}
			else
			{
				m_current = *m_iterator;
				++m_iterator;
			}
		}


		void XWideSource::skipSpace()
		{
			for (; isSpace() ; next());
		}


		void XWideSource::find(const wchar_t value)
		{
			for (; m_current != value; next());
		}


		void XWideSource::find(const wchar_t value1, const wchar_t value2)
		{
			for (; ((m_current != value1) && (m_current != value2)); next());
		}


		void XWideSource::findAndSkip(const wchar_t value)
		{
			find(value);
			next();
		}


		const std::pair<const std::wstring, const std::wstring> XWideSource::getName()
		{
			std::wstring prefix = getToSeparator(L':');
			std::wstring name;
			if (get() == L':')
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


		const std::pair<const std::wstring, const std::wstring> XWideSource::getPair()
		{
			const std::wstring name = get(L' ', L'=');
			const std::wstring value = getValue();
			return std::make_pair(name, value);
		}


		const std::pair<const std::pair<const std::wstring, const std::wstring>, const std::wstring> XWideSource::getAttribute()
		{
			const std::pair<const std::wstring, const std::wstring> name = getName();
			const std::wstring value = getValue();
			return std::make_pair(name, value);
		}


		const wchar_t XWideSource::get() const
		{
			return m_current;
		}


		const std::wstring XWideSource::getString(const wchar_t separator)
		{
			std::wstring result;
			while (m_current != separator)
				
			{
				result += m_current;
				next();
			}
			return Lexigraph::fromSource(result);
		}


		const std::wstring XWideSource::getString(const wchar_t separator1, const wchar_t separator2)
		{
			std::wstring result;
			while ((m_current != separator1) && (m_current != separator2))
			
			{
				result += m_current;
				next();
			}
			return Lexigraph::fromSource(result);
		}


		const bool XWideSource::isSpace() const
		{
			if (m_current == L' ' || m_current == L'\n' || m_current == L'\r' || m_current == L'\t')
				return true;
			return false;
		}


		const bool XWideSource::isSeparator() const
		{
			if (m_current == L'<' || m_current == L'>' || m_current == L'=' || m_current == L'/')
				return true;
			return false;
		}


		const std::wstring XWideSource::get(const wchar_t separator1, const wchar_t separator2)
		{
			skipSpace();
			std::wstring result;
			while (m_current != separator1 && m_current != separator2)
			
			{
				result += m_current;
				next();
			}
			return result;
		}


		const std::wstring XWideSource::getToSeparator()
		{
			skipSpace();
			std::wstring result;
			while (!isSeparator() && !isSpace())
			{
				result += m_current;
				next();
			}
			
			return result;
		}


		const std::wstring XWideSource::getToSeparator(const wchar_t separator)
		{
			skipSpace();
			std::wstring result;
			while (!isSeparator() && !isSpace() && m_current != separator)
			{
				result += m_current;
				next();
				
			}
			return result;
		}


		const std::wstring XWideSource::getValue()
		{
			find(L'"', L'\'');
			wchar_t EndChar = get();
			next();
			const std::wstring value = getString(EndChar);
			next();
			return value;
		}

	} 
} // namespace XML