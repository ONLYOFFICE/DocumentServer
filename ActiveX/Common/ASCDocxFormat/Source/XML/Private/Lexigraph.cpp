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


#include "Lexigraph.h"

namespace XML
{
	namespace Private
	{

		const std::string Lexigraph::fromSource(const std::string& input)
		{
			std::string output = input;

			size_t pos = output.find("&lt;");
			while(pos != output.npos)
			{
				output.replace(pos, 4, "<");
				pos = output.find("&lt;", pos + 1);
			}

			pos = output.find("&gt;");
			while(pos != output.npos)
			{
				output.replace(pos, 4, ">");
				pos = output.find("&gt;", pos + 1);
			}

			pos = output.find("&apos;");
			while(pos != output.npos)
			{
				output.replace(pos, 6, "\'");
				pos = output.find("&apos;", pos + 1);
			}

			pos = output.find("&quot;");
			while(pos != output.npos)
			{
				output.replace(pos, 6, "\"");
				pos = output.find("&quot;", pos + 1);
			}

			pos = output.find("&amp;");
			while(pos != output.npos)
			{
				output.replace(pos, 5, "&");
				pos = output.find("&amp;", pos + 1);
			}

			return output;
		}


		const std::string Lexigraph::toSource(const std::string& input)
		{
			std::string output = input;
			size_t pos = output.find('&');
			while(pos != output.npos)
			{
				output.replace(pos, 1, "&amp;");
				pos = output.find('&', pos + 1);
			}

			pos = output.find('<');
			while(pos != output.npos)
			{
				output.replace(pos, 1, "&lt;");
				pos = output.find('<', pos + 1);
			}

			pos = output.find('>');
			while(pos != output.npos)
			{
				output.replace(pos, 1, "&gt;");
				pos = output.find('>', pos + 1);
			}

			pos = output.find('\'');
			while(pos != output.npos)
			{
				output.replace(pos, 1, "&apos;");
				pos = output.find('\'', pos + 1);
			}

			pos = output.find('\"');
			while(pos != output.npos)
			{
				output.replace(pos, 1, "&quot;");
				pos = output.find('\"', pos + 1);
			}

			return output;
		}


		const std::wstring Lexigraph::fromSource(const std::wstring& input)
		{
			std::wstring output = input;

			size_t pos = output.find(L"&lt;");
			while(pos != output.npos)
			{
				output.replace(pos, 4, L"<");
				pos = output.find(L"&lt;", pos + 1);
			}

			pos = output.find(L"&gt;");
			while(pos != output.npos)
			{
				output.replace(pos, 4, L">");
				pos = output.find(L"&gt;", pos + 1);
			}

			pos = output.find(L"&apos;");
			while(pos != output.npos)
			{
				output.replace(pos, 6, L"\'");
				pos = output.find(L"&apos;", pos + 1);
			}

			pos = output.find(L"&quot;");
			while(pos != output.npos)
			{
				output.replace(pos, 6, L"\"");
				pos = output.find(L"&quot;", pos + 1);
			}

			pos = output.find(L"&amp;");
			while(pos != output.npos)
			{
				output.replace(pos, 5, L"&");
				pos = output.find(L"&amp;", pos + 1);
			}

			return output;
		}


		const std::wstring Lexigraph::toSource(const std::wstring& input)
		{
			std::wstring output = input;
			size_t pos = output.find(L'&');
			while(pos != output.npos)
			{
				output.replace(pos, 1, L"&amp;");
				pos = output.find(L'&', pos + 1);
			}

			pos = output.find(L'<');
			while(pos != output.npos)
			{
				output.replace(pos, 1, L"&lt;");
				pos = output.find(L'<', pos + 1);
			}

			pos = output.find(L'>');
			while(pos != output.npos)
			{
				output.replace(pos, 1, L"&gt;");
				pos = output.find(L'>', pos + 1);
			}

			pos = output.find(L'\'');
			while(pos != output.npos)
			{
				output.replace(pos, 1, L"&apos;");
				pos = output.find(L'\'', pos + 1);
			}

			pos = output.find(L'\"');
			while(pos != output.npos)
			{
				output.replace(pos, 1, L"&quot;");
				pos = output.find(L'\"', pos + 1);
			}

			return output;
		}

	} 
} // namespace XML