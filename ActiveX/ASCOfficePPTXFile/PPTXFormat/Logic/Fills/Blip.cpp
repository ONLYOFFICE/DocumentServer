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
 #include "./stdafx.h"

#include "Blip.h"
#include "./../../Slide.h"
#include "./../../SlideMaster.h"
#include "./../../SlideLayout.h"
#include "./../../Theme.h"

namespace PPTX
{
	namespace Logic
	{
		void Blip::fromXML(XmlUtils::CXmlNode& node)
		{
			m_namespace = XmlUtils::GetNamespace(node.GetName());

			node.ReadAttributeBase(L"r:embed", embed);
			node.ReadAttributeBase(L"r:link", link);
			node.ReadAttributeBase(L"cstate", cstate);

			Effects.RemoveAll();
			node.LoadArray(_T("*"), Effects);

			FillParentPointersForChilds();
		}

		CString Blip::toXML() const
		{
			XmlUtils::CAttribute oAttr;

			if (embed.IsInit())
				oAttr.Write(_T("r:embed"), embed->ToString());
			if (link.IsInit())
				oAttr.Write(_T("r:link"), link->ToString());
			oAttr.WriteLimitNullable(_T("cstate"), cstate);

			XmlUtils::CNodeValue oValue;
			oValue.WriteArray(Effects);

			CString strName = (_T("") == m_namespace) ? _T("blip") : (m_namespace + _T(":blip"));
			return XmlUtils::CreateNode(strName, oAttr, oValue);
		}

		void Blip::FillParentPointersForChilds()
		{
			size_t count = Effects.GetCount();
			for(size_t i = 0; i < count; ++i)
				Effects[i].SetParentPointer(this);
		}

		CString Blip::GetFullPicName(FileContainer* pRels)const
		{
			if(embed.IsInit())
			{
				if (pRels != NULL)
				{
					smart_ptr<OOX::Image> p = pRels->image(*embed);
					if (p.is_init())
						return p->filename().m_strFilename;
				}

				if(parentFileIs<Slide>())
					return parentFileAs<Slide>().GetMediaFullPathNameFromRId(*embed);
				else if(parentFileIs<SlideLayout>())
					return parentFileAs<SlideLayout>().GetMediaFullPathNameFromRId(*embed);
				else if(parentFileIs<SlideMaster>())
					return parentFileAs<SlideMaster>().GetMediaFullPathNameFromRId(*embed);
				else if(parentFileIs<Theme>())
					return parentFileAs<Theme>().GetMediaFullPathNameFromRId(*embed);
				return _T("");
			}
			else if(link.IsInit())
			{
				if (pRels != NULL)
				{
					smart_ptr<OOX::Image> p = pRels->image(*link);
					if (p.is_init())
						return p->filename().m_strFilename;
				}

				if(parentFileIs<Slide>())
					return parentFileAs<Slide>().GetMediaFullPathNameFromRId(*link);
				else if(parentFileIs<SlideLayout>())
					return parentFileAs<SlideLayout>().GetMediaFullPathNameFromRId(*link);
				else if(parentFileIs<SlideMaster>())
					return parentFileAs<SlideMaster>().GetMediaFullPathNameFromRId(*link);
				else if(parentFileIs<Theme>())
					return parentFileAs<Theme>().GetMediaFullPathNameFromRId(*link);
				return _T("");
			}
			return _T("");
		}
	} 
} // namespace PPTX