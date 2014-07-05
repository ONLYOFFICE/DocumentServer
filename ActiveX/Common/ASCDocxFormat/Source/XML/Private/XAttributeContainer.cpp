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


#include "XAttributeContainer.h"
#include "./../XName.h"
#include <algorithm>
#include "NullXAttribute.h"

namespace XML
{
	namespace Private
	{
		static NullXAttribute nullXAttribute;

		const bool XAttributeContainer::exist(const XName& xname) const
		{
			for(const_iterator current = begin(); current != end(); current++)
			{
				if ((*current)->XName->Equal(xname))
					return true;
			}

			for(const_iterator current = begin(); current != end(); current++)
			{
				if ((*current)->XName == xname)
					return true;
			}
			return false;
		}

		XAttribute& XAttributeContainer::operator[] (const XName& xname)
		{
			for(iterator current = begin(); current != end(); current++)
			{
				if ((*current)->XName->Equal(xname))
					return *current;
			}
			for(iterator current = begin(); current != end(); current++)
			{
				if ((*current)->XName == xname)
					return *current;
			}
			return nullXAttribute;
		}

		const XAttribute& XAttributeContainer::operator[] (const XName& xname) const
		{
			for(const_iterator current = begin(); current != end(); current++)
			{
				if ((*current)->XName->Equal(xname))
					return *current;
			}
			for(const_iterator current = begin(); current != end(); current++)
			{
				if ((*current)->XName == xname)
					return *current;
			}
			return nullXAttribute;
		}

		const XNamespaceContainer XAttributeContainer::usedNamespace() const
		{
			XNamespaceContainer container;

			for(const_iterator current = begin(); current != end(); current++)
			{
				if ((*current)->XName->Ns.is_init())
					container.Add((*current)->XName->Ns);
			}

			return container;
		}

		XAttributeContainer::iterator XAttributeContainer:: begin()
		{
			return m_container.begin();
		}

		XAttributeContainer::iterator XAttributeContainer::end()
		{
			return m_container.end();
		}

		XAttributeContainer::const_iterator XAttributeContainer::begin() const
		{
			return m_container.begin();
		}

		XAttributeContainer::const_iterator XAttributeContainer::end() const
		{
			return m_container.end();
		}

	} 
} // namespace XML