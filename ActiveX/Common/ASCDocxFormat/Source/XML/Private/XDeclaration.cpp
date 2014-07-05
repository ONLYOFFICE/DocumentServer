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


#include "XDeclaration.h"
#include "Encoding.h"

namespace XML
{
	namespace Private
	{
		XDeclaration::XDeclaration() : Version("1.0"), Encoding("UTF-8"), Standalone("yes")
		{
		}

		void XDeclaration::fromSource(NSCommon::smart_ptr<XSingleSource> source)
		{
			source->find('?');
			source->next();
			source->skipSpace();

			while (source->get() != '?')
			{
				const std::pair<const std::string, const std::string> pair = source->getPair();
				setValue(pair.first, pair.second);
				source->skipSpace();
			}
			source->find('>');
			source->next();
		}

		void XDeclaration::fromSource(NSCommon::smart_ptr<XWideSource> source)
		{
			source->find(L'?');
			source->next();
			source->skipSpace();

			while (source->get() != L'?')
			{
				const std::pair<const std::wstring, const std::wstring> pair = source->getPair();
				setValue(Encoding::unicode2utf8(pair.first), Encoding::unicode2utf8(pair.second));
				source->skipSpace();
			}
			source->find(L'>');
			source->next();
		}

		const std::string XDeclaration::ToString() const
		{
			return "<?xml version=\"" + Version.ToString() + "\" encoding=\"" + Encoding.ToString() + 
				(Standalone.is_init() ? ("\" standalone=\"" + Standalone.ToString()) : "") + "\" ?>"; 
		}

		const std::wstring XDeclaration::ToWString() const
		{
			return L"<?xml version=\"" + Encoding::utf82unicode(Version.ToString()) + L"\" encoding=\"" + L"Unicode" + 
				(Standalone.is_init() ? (L"\" standalone=\"" + Encoding::utf82unicode(Standalone.ToString())) : L"") + L"\" ?>"; 
		}

		void XDeclaration::setValue(const std::string& name, const std::string& value)
		{
			if (name == "version")
				Version = value;
			else if (name == "encoding")
				Encoding = value;
			else if (name == "standalone")
				Standalone = value;
		}

	} 
} // namespace XML