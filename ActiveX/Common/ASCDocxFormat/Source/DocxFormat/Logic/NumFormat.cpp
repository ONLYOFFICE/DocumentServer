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


#include "NumFormat.h"

namespace OOX
{
	namespace Logic
	{
		NumFormat::NumFormat()
		{
		}

		NumFormat::~NumFormat()
		{
		}

		NumFormat::NumFormat(const Common::NumFormat& numFormat)
		{
			fromBase(numFormat);
		}

		NumFormat::NumFormat(const XML::XNode& node)
		{
			fromXML(node);
		}

		NumFormat::NumFormat(const std::string& format)
		{
			fromString(format);
		}
		NumFormat::NumFormat(const std::wstring& format)
		{
			fromStringW(format);
		}

		NumFormat::NumFormat(XmlUtils::CXmlNode& oNode)
		{
			fromXML(oNode);
		}

		const NumFormat& NumFormat::operator = (const Common::NumFormat& numFormat)
		{
			fromBase(numFormat);
			return *this;
		}

		const NumFormat& NumFormat::operator = (const XML::XNode& node)
		{
			fromXML(node);
			return *this;
		}

		const NumFormat& NumFormat::operator = (const std::string& format)
		{
			fromString(format);	
			return *this;
		}

		void NumFormat::fromXML(const XML::XNode& node)
		{
			XML::XElement element(node);
			fromString(element.attribute("val").value());
		}

		void NumFormat::fromXML(XmlUtils::CXmlNode& oNode)
		{
			fromStringW(std::wstring(static_cast<const wchar_t*>(oNode.GetAttributeBase( _T("w:val")))));
		}

		const XML::XNode NumFormat::toXML() const
		{
		return XML::XElement();
		}


		const std::string NumFormat::ToString() const
		{
			switch (type())
			{
			case upperLetter:
				return "upperLetter";
			case lowerLetter:
				return "lowerLetter";
			case upperRoman:
				return "upperRoman";
			case lowerRoman:
				return "lowerRoman";
			case decimal:
				return "decimal";
			case symbol:
				return "symbol";
			case bullet:
				return "bullet";
			case chicago:
				return "chicago";
			default:
				return "decimal";
			}
		}

		const std::wstring NumFormat::ToStringW() const
		{
			switch (type())
			{
			case upperLetter:
				return L"upperLetter";
			case lowerLetter:
				return L"lowerLetter";
			case upperRoman:
				return L"upperRoman";
			case lowerRoman:
				return L"lowerRoman";
			case decimal:
				return L"decimal";
			case symbol:
				return L"symbol";
			case bullet:
				return L"bullet";
			case chicago:
				return L"chicago";
			default:
				return L"decimal";
			}

			return L"decimal";
		}

		void NumFormat::fromString(const std::string& value)
		{
			if (value == "upperLetter")
				setUpperLetter();
			else if (value == "lowerLetter")
				setLowerLetter();
			else if (value == "upperRoman")
				setUpperRoman();
			else if (value == "lowerRoman")
				setLowerRoman();
			else if (value == "symbol")
				setSymbol();
			else if (value == "bullet")
				setBullet();
			else if (value == "chicago")
				setChicago();
			else
				setDecimal();
		}
		void NumFormat::fromStringW(const std::wstring& value)
		{
			if (value == L"upperLetter")
				setUpperLetter();
			else if (value == L"lowerLetter")
				setLowerLetter();
			else if (value == L"upperRoman")
				setUpperRoman();
			else if (value == L"lowerRoman")
				setLowerRoman();
			else if (value == L"symbol")
				setSymbol();
			else if (value == L"bullet")
				setBullet();
			else if (value == L"chicago")
				setChicago();

			setDecimal();
		}

	} 
} // namespace OOX