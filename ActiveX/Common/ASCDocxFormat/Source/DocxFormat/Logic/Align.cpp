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


#include "Align.h"

namespace OOX
{
	namespace Logic
	{
		Align::Align()
		{
		}

		Align::Align(const Common::Align& align)
		{
			fromBase(align);
		}

		Align::Align(const std::string& value)
		{
			fromString(value);
		}
	
		Align::Align(const std::wstring& value)
		{
			fromString(value);
		}

		const Align& Align::operator= (const Common::Align& align)
		{
			fromBase(align);
			return *this;
		}

		const Align& Align::operator= (const std::string& value)
		{
			fromString(value);
			return *this;
		}

		const std::string Align::ToString() const
		{
			switch (type())
			{
			case left:
				return "left";
			case center:
				return "center";
			case right:
				return "right";
			case both:
				return "both";
			default:
				return "left";
			}
			
			return "left";
		}

		const std::wstring Align::ToStringW() const
		{
			switch (type())
			{
			case left:
				return L"left";
			case center:
				return L"center";
			case right:
				return L"right";
			case both:
				return L"both";
			default:
				return L"left";
			}

			return L"left";
		}

		void Align::fromString(const std::wstring& value)
		{
			if (value == L"center")
				setCenter();
			else if (value == L"right")
				setRight();
			else if (value == L"both")
				setBoth();
			else
				setLeft();
		}

		void Align::fromString(const std::string& value)
		{
			if (value == "center")
				setCenter();
			else if (value == "right")
				setRight();
			else if (value == "both")
				setBoth();
			else
				setLeft();
		}

	} 
} // namespace OOX