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
#ifndef PPTX_LOGIC_UNICOLOR_INCLUDE_H_
#define PPTX_LOGIC_UNICOLOR_INCLUDE_H_

#include "./../WrapperWritingElement.h"
#include "Colors/ColorBase.h"

namespace PPTX
{
	namespace Logic
	{
		class UniColor : public WrapperWritingElement
		{
		public:
			UniColor();
			virtual ~UniColor();			
			explicit UniColor(XmlUtils::CXmlNode& node);
			const UniColor& operator =(XmlUtils::CXmlNode& node);

		public:
			virtual void fromXML(XmlUtils::CXmlNode& node);
			virtual void GetColorFrom(XmlUtils::CXmlNode& element);
			virtual bool is_init()const{return (Color.IsInit());};

			template<class T> AVSINLINE const bool	is() const	{ return Color.is<T>(); }
			template<class T> AVSINLINE T&			as()		{ return Color.as<T>(); }
			template<class T> AVSINLINE const T&	as() const 	{ return Color.as<T>(); }
			
			virtual DWORD GetRGBA(DWORD RGBA = 0)const;
			virtual DWORD GetARGB(DWORD ARGB = 0)const;
			virtual DWORD GetBGRA(DWORD BGRA = 0)const;
			virtual DWORD GetABGR(DWORD ABGR = 0)const;

			virtual DWORD GetRGBColor(NSCommon::smart_ptr<PPTX::WrapperFile>& _oTheme, NSCommon::smart_ptr<PPTX::WrapperWritingElement>& _oClrMap, DWORD ARGB = 0)
			{
				if (Color.is_init())
					return Color->GetRGBColor(_oTheme, _oClrMap, ARGB);
				return 0;
			}

			virtual CString toXML() const;

			virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
			{
				if (Color.is_init())
					Color->toPPTY(pWriter);
			}

			virtual void fromPPTY(NSBinPptxRW::CBinaryFileReader* pReader);

			virtual void toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const
			{
				if (Color.is_init())
					Color->toXmlWriter(pWriter);
			}

		
		public:
			smart_ptr<ColorBase> Color;


		protected:
			virtual void FillParentPointersForChilds(){};
		public:
			virtual void SetParentPointer(const WrapperWritingElement* pParent)
			{
				if(is_init())
					Color->SetParentPointer(pParent);
			};
		};
	} 
} 

#endif // PPTX_LOGIC_UNICOLOR_INCLUDE_H