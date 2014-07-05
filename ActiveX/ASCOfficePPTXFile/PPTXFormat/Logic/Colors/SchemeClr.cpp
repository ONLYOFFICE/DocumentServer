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

#include "SchemeClr.h"
#include "./../../Slide.h"
#include "./../../SlideLayout.h"
#include "./../../SlideMaster.h"
#include "./../../Theme.h"
#include "./../../TableStyles.h"
#include "./../../Presentation.h"

namespace PPTX
{
	namespace Logic
	{
		void SchemeClr::fromXML(XmlUtils::CXmlNode& node)
		{
			val = node.GetAttribute(_T("val"));
			Modifiers.RemoveAll();
			node.LoadArray(_T("*"), Modifiers);
		}

		CString SchemeClr::toXML() const
		{
			XmlUtils::CAttribute oAttr;
			oAttr.Write(_T("val"), val.get());

			XmlUtils::CNodeValue oValue;
			oValue.WriteArray(Modifiers);
			
			return XmlUtils::CreateNode(_T("a:schemeClr"), oAttr, oValue);
		}

		DWORD SchemeClr::GetRGBA(DWORD RGBA) const
		{
			SchemeClr* pColor = const_cast<SchemeClr*>(this);

			DWORD A = RGBA & 0xFF;
			A = A << 24;
			pColor->FillRGBFromVal((RGBA >> 8) + A);
			return ColorBase::GetRGBA(RGBA);
		}

		DWORD SchemeClr::GetARGB(DWORD ARGB) const
		{
			SchemeClr* pColor = const_cast<SchemeClr*>(this);
			
			pColor->FillRGBFromVal(ARGB);
			return ColorBase::GetARGB(ARGB);
		}

		DWORD SchemeClr::GetBGRA(DWORD BGRA) const
		{
			SchemeClr* pColor = const_cast<SchemeClr*>(this);

			DWORD ARGB = (BGRA & 0xFF) << 24;
			ARGB += (BGRA & 0xFF00) << 8;
			ARGB += (BGRA & 0xFF0000) >> 8;
			ARGB += (BGRA & 0xFF000000) >> 24;
			pColor->FillRGBFromVal(ARGB);
			return ColorBase::GetBGRA(BGRA);
		}

		DWORD SchemeClr::GetABGR(DWORD ABGR) const
		{
			SchemeClr* pColor = const_cast<SchemeClr*>(this);

			DWORD ARGB = ABGR & 0xFF00FF00;
			ARGB += (ABGR & 0xFF) << 16;
			ARGB += (ABGR & 0xFF0000) >> 16;
			pColor->FillRGBFromVal(ARGB);
			return ColorBase::GetABGR(ABGR);
		}

		DWORD SchemeClr::GetRGBColor(NSCommon::smart_ptr<PPTX::WrapperFile>& _oTheme, NSCommon::smart_ptr<PPTX::WrapperWritingElement>& _oClrMap, DWORD ARGB)
		{
			DWORD RGB = 0;
			
			CString str = val.get();
			if (str == _T("phClr"))
				RGB = ARGB;
			else 
			{
				smart_ptr<PPTX::Theme> oTheme = _oTheme.smart_dynamic_cast<PPTX::Theme>();
				smart_ptr<PPTX::Logic::ClrMap> oClrMap = _oClrMap.smart_dynamic_cast<PPTX::Logic::ClrMap>();

				if (oTheme.is_init())
				{
					if (oClrMap.is_init())
						str = oClrMap->GetColorSchemeIndex(str);

					RGB = oTheme->GetARGBFromScheme(str);
				}				
			}				

			blue	= static_cast<unsigned char>(RGB & 0xFF);
			green	= static_cast<unsigned char>((RGB & 0xFF00)>>8);
			red		= static_cast<unsigned char>((RGB & 0xFF0000)>>16);
			alpha	= static_cast<unsigned char>((RGB & 0xFF000000)>>24);
			
			return ColorBase::GetARGB(ARGB);
		}

		void SchemeClr::FillRGBFromVal(DWORD rgb)
		{
			DWORD RGB = 0;
			
			CString str = val.get();
			if(str == _T("phClr"))
				RGB = rgb;
			else
			if(parentFileIs<Slide>())
				RGB = parentFileAs<Slide>().GetARGBFromMap(str);
			else if(parentFileIs<SlideLayout>())
				RGB = parentFileAs<SlideLayout>().GetARGBFromMap(str);
			else if(parentFileIs<SlideMaster>())
				RGB = parentFileAs<SlideMaster>().GetARGBFromMap(str);
			else if(parentFileIs<TableStyles>())
				RGB = parentFileAs<TableStyles>().GetARGBFromMap(str);
			else if(parentFileIs<Theme>())
				RGB = parentFileAs<Theme>().GetARGBFromMap(str);
			else if(parentFileIs<Presentation>())
				RGB = parentFileAs<Presentation>().GetARGBFromMap(str);
			
			
			
			
			

			blue	= static_cast<unsigned char>(RGB & 0xFF);
			green	= static_cast<unsigned char>((RGB & 0xFF00)>>8);
			red		= static_cast<unsigned char>((RGB & 0xFF0000)>>16);
			alpha	= static_cast<unsigned char>((RGB & 0xFF000000)>>24);
		}
	} 
} // namespace PPTX