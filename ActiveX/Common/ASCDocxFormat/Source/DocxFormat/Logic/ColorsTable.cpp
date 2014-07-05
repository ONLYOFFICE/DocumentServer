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


#include "ColorsTable.h"
#include "math.h"

namespace OOX
{
	namespace Logic
	{
		ColorsTable::ColorsTable()
		{			
			m_storage.push_back(std::make_pair("black", Common::Color(0x00, 0x00, 0x00)));
			m_storage.push_back(std::make_pair("blue", Common::Color(0x00, 0x00, 0xFF)));
			m_storage.push_back(std::make_pair("cyan", Common::Color(0x00, 0xFF, 0xFF)));
			m_storage.push_back(std::make_pair("green", Common::Color(0x00, 0x80, 0x00)));
			m_storage.push_back(std::make_pair("magenta", Common::Color(0xFF, 0x00, 0xFF)));
			m_storage.push_back(std::make_pair("red", Common::Color(0xFF, 0x00, 0x00)));
			m_storage.push_back(std::make_pair("yellow", Common::Color(0xFF, 0xFF, 0x00)));
			m_storage.push_back(std::make_pair("white", Common::Color(0xFF, 0xFF, 0xFF)));
			m_storage.push_back(std::make_pair("darkBlue", Common::Color(0x00, 0x00, 0x8B)));
			m_storage.push_back(std::make_pair("darkCyan", Common::Color(0x00, 0x8B, 0x8B)));
			m_storage.push_back(std::make_pair("darkGreen", Common::Color(0x00, 0x64, 0x00)));
			m_storage.push_back(std::make_pair("darkMagenta", Common::Color(0x8B, 0x00, 0x8B)));
			m_storage.push_back(std::make_pair("darkRed", Common::Color(0x8B, 0x00, 0x00)));
			m_storage.push_back(std::make_pair("darkYellow", Common::Color(0x80, 0x80, 0x00)));
			m_storage.push_back(std::make_pair("darkGray", Common::Color(0xA9, 0xA9, 0xA9)));
			m_storage.push_back(std::make_pair("lightGray", Common::Color(0xD3, 0xD3, 0xD3)));
			m_storage.push_back(std::make_pair("auto", Common::Color(0x00, 0x00, 0x00)));
		}

		const Common::Color ColorsTable::fromName(const std::string& name) const
		{
			for (std::vector<std::pair<std::string, Common::Color> >::const_iterator iter = m_storage.begin(); iter != m_storage.end(); ++iter)
			{
				if ((*iter).first == name)
					return (*iter).second;
			}

			return Common::Color(0xFF, 0xFF, 0xFF);
		}

		const bool ColorsTable::isFromName(const std::string& name) const
		{
			for (std::vector<std::pair<std::string, Common::Color> >::const_iterator iter = m_storage.begin(); iter != m_storage.end(); ++iter)
			{
				if ((*iter).first == name)
					return true;
			}

			return false;
		}

		const std::string ColorsTable::fromColor(const Common::Color& color) const
		{
			std::string name;
			int diff = 255 * 255 * 3;

			for (std::vector<std::pair<std::string, Common::Color> >::const_iterator iter = m_storage.begin(); iter != m_storage.end(); ++iter)
			{
				int new_diff =	(color.Red - (*iter).second.Red) * (color.Red - (*iter).second.Red) +
												(color.Green - (*iter).second.Green) * (color.Green - (*iter).second.Green) + 
												(color.Blue - (*iter).second.Blue) * (color.Blue - (*iter).second.Blue);

				if (new_diff < diff)
				{
					diff = new_diff;
					name = (*iter).first;
				}
			}

			return name;
		}

	} 
} // namespace OOX