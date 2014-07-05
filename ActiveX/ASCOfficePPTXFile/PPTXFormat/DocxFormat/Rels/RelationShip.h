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
#ifndef OOX_RELS_RELATION_SHIP_INCLUDE_H_
#define OOX_RELS_RELATION_SHIP_INCLUDE_H_

#include "./../WritingElement.h"
#include "./../RId.h"
#include "./../External/External.h"

namespace OOX
{
	namespace Rels
	{
		class RelationShip : public WritingElement
		{
		public:
			RelationShip(const OOX::RId& rId, const CString& type, const OOX::CPath& filename) : m_rId(rId), m_target(filename), m_type(type)
			{
				m_target.m_strFilename.Replace(_T(" "), _T("_"));
			}
			RelationShip(const OOX::RId& rId, const smart_ptr<External> external): m_rId(rId), m_target(external->Uri()), 
				m_type(external->type().RelationType())
			{
				m_mode = new CString(_T("External"));
			}
			virtual ~RelationShip()
			{
			}
			explicit RelationShip(XmlUtils::CXmlNode& node)
			{
				fromXML(node);
			}
			const RelationShip& operator =(XmlUtils::CXmlNode& node)
			{
				fromXML(node);
				return *this;
			}
			
		public:
			virtual void fromXML(XmlUtils::CXmlNode& node)
			{
				m_rId		= node.GetAttribute(_T("Id"));
				m_target	= node.GetAttribute(_T("Target"));
				m_type		= node.GetAttribute(_T("Type"));
				m_mode		= node.GetAttribute(_T("TargetMode"), _T("Internal"));
			}
			virtual CString toXML() const
			{
				XmlUtils::CAttribute oAttr;
				oAttr.Write(_T("Id"), m_rId.ToString());
				oAttr.Write(_T("Type"), m_type);
				oAttr.Write(_T("Target"), m_target.m_strFilename);
				oAttr.Write(_T("TargetMode"), m_mode);
				
				return XmlUtils::CreateNode(_T("Relationship"), oAttr);
			}

		public:
			const bool operator <(const RelationShip& rhs) const
			{
				return m_rId < rhs.m_rId;
			}

		public:
			const CString type() const
			{
				return m_type;
			}
			const CPath filename() const
			{
				return m_target;
			}
			const CPath target() const
			{
				return m_target;
			}
			const bool isExternal()const
			{
				if (!m_mode.IsInit())
					return false;
				return (*m_mode == "External");
			}
			const RId rId() const
			{
				return m_rId;
			}

		private:
			RId						m_rId;
			CPath					m_target;
			CString					m_type;
			nullable_string			m_mode;
		};
	} 
} 

#endif // OOX_RELS_RELATION_SHIP_INCLUDE_H_