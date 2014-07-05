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


#include "RelationShip.h"

#include "ASCStlUtils.h"
#include "Encoding.h"

namespace OOX
{
	namespace Rels
	{
		RelationShip::RelationShip(const RId& rId, const std::string& type, const OOX::CPath& filename)
		{
			m_rId		=	rId;
			m_target	=	filename;

			std::wstring newFilename = filename.GetPath();
			StlUtils::ReplaceString(newFilename, L" ", L"_");
			m_target	=	OOX::CPath(newFilename.c_str());
		}

		RelationShip::RelationShip(const RId& rId, const NSCommon::smart_ptr<External> external) 
		{
			m_rId		=	rId;
			m_target	=	external->Uri();
			m_type		=	external->type().RelationType();
			m_mode		=	std::wstring(L"External");
		}

		RelationShip::~RelationShip()
		{
		}

		RelationShip::RelationShip(XmlUtils::CXmlNode& oNode)
		{
			fromXML(oNode);
		}

		const RelationShip& RelationShip::operator =(XmlUtils::CXmlNode& oNode)
		{
			fromXML(oNode);
			return *this;
		}

		void RelationShip::fromXML(XmlUtils::CXmlNode& oNode)
		{
			m_rId		=	std::wstring(static_cast<const wchar_t*>(oNode.GetAttributeBase( _T("Id"))));
			m_target	=	OOX::CPath(static_cast<const wchar_t*>(oNode.GetAttributeBase( _T("Target"))));
			m_type		=	std::wstring(static_cast<const wchar_t*>(oNode.GetAttributeBase( _T("Type"))));

			if (oNode.GetAttributeBase(_T("TargetMode")).GetLength())
			{
				m_mode	=	std::wstring(static_cast<const wchar_t*>(oNode.GetAttributeBase(_T("TargetMode"))));
			}
		}

		const bool RelationShip::operator <(const RelationShip& rhs) const
		{
			return m_rId < rhs.m_rId;
		}

		const std::wstring RelationShip::type() const
		{
			return m_type;
		}

		const OOX::CPath RelationShip::filename() const
		{
			return m_target;
		}

		const OOX::CPath RelationShip::target() const
		{
			return m_target;
		}

		const bool RelationShip::isExternal()const
		{
			if (m_mode.IsInit())
				return (m_mode.get() == std::wstring(L"External"));

			return false;
		}

		const RId RelationShip::rId() const
		{
			return m_rId;
		}

	} 
} // namespace OOX