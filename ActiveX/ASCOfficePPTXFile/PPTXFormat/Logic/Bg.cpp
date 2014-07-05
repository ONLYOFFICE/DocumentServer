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

#include "Bg.h"
#include "../Slide.h"
#include "../SlideMaster.h"
#include "../SlideLayout.h"

namespace PPTX
{
	namespace Logic
	{

		Bg::Bg()
		{
		}


		Bg::~Bg()
		{
		}


		Bg::Bg(XmlUtils::CXmlNode& node)
		{
			fromXML(node);
		}


		const Bg& Bg::operator =(XmlUtils::CXmlNode& node)
		{
			fromXML(node);
			return *this;
		}


		void Bg::fromXML(XmlUtils::CXmlNode& node)
		{
			node.ReadAttributeBase(L"bwMode", bwMode);
			bgPr	= node.ReadNodeNoNS(_T("bgPr"));
			bgRef	= node.ReadNodeNoNS(_T("bgRef"));

			FillParentPointersForChilds();
		}


		CString Bg::toXML() const
		{
			XmlUtils::CAttribute oAttr;
			oAttr.WriteLimitNullable(_T("bwMode"), bwMode);

			XmlUtils::CNodeValue oValue;
			oValue.WriteNullable(bgPr);
			oValue.WriteNullable(bgRef);

			return XmlUtils::CreateNode(_T("p:bg"), oAttr, oValue);
		}

		void Bg::FillParentPointersForChilds()
		{
			
			
			if(bgPr.IsInit())
				bgPr->SetParentPointer(this);
			if(bgRef.IsInit())
				bgRef->SetParentPointer(this);
		}

		void Bg::GetBackground(Logic::BgPr& bg, DWORD& ARGB)const
		{
			if(bgPr.IsInit())
				bg = bgPr.get();
			else
			{
				ARGB = bgRef->Color.GetARGB();
				if(parentFileIs<Slide>())
					parentFileAs<Slide>().Theme->themeElements.fmtScheme.GetFillStyle(bgRef->idx.get_value_or(0), bg.Fill);
				else if(parentFileIs<SlideLayout>())
					parentFileAs<SlideLayout>().Theme->themeElements.fmtScheme.GetFillStyle(bgRef->idx.get_value_or(0), bg.Fill);
				else if(parentFileIs<SlideMaster>())
					parentFileAs<SlideMaster>().Theme->themeElements.fmtScheme.GetFillStyle(bgRef->idx.get_value_or(0), bg.Fill);
			}
		}

	} 
} // namespace PPTX