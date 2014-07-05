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
#ifndef PPTX_SLIDES_SLIDE_SHAPETREEELEM_INCLUDE_H_
#define PPTX_SLIDES_SLIDE_SHAPETREEELEM_INCLUDE_H_

#include "./../WrapperWritingElement.h"
#include "SpPr.h"
#include "ShapeStyle.h"

namespace PPTX
{
	namespace Logic
	{
		void CalculateFill(PPTX::Logic::SpPr& oSpPr, nullable<ShapeStyle>& pShapeStyle, smart_ptr<PPTX::WrapperFile>& oTheme, smart_ptr<PPTX::WrapperWritingElement>& oClrMap, CString& strAttr, CString& strNode);
		void CalculateLine(PPTX::Logic::SpPr& oSpPr, nullable<ShapeStyle>& pShapeStyle, smart_ptr<PPTX::WrapperFile>& oTheme, smart_ptr<PPTX::WrapperWritingElement>& oClrMap, CString& strAttr, CString& strNode);

		class SpTreeElem : public WrapperWritingElement
		{
		public:
			SpTreeElem();
			virtual ~SpTreeElem();
			explicit SpTreeElem(XmlUtils::CXmlNode& node);
			const SpTreeElem& operator =(XmlUtils::CXmlNode& node);

			SpTreeElem& operator=(const SpTreeElem& oSrc)
			{
				m_elem = oSrc.m_elem;
				return *this;
			}
			
		public:
			virtual void fromXML(XmlUtils::CXmlNode& node);
			virtual CString toXML() const;
			virtual bool is_init() const {return (m_elem.IsInit());};

			template<class T> AVSINLINE const bool	is() const	{ return m_elem.is<T>(); }
			template<class T> AVSINLINE T&			as()		{ return m_elem.as<T>(); }
			template<class T> AVSINLINE const T&	as() const 	{ return m_elem.as<T>(); }

			void InitElem(WrapperWritingElement* pElem)
			{
				m_elem.reset(pElem);
			}
			
			virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
			{
				if (m_elem.is_init())
					m_elem->toPPTY(pWriter);
			}
			virtual void fromPPTY(NSBinPptxRW::CBinaryFileReader* pReader);

			virtual void toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const
			{
				if (m_elem.is_init())
					m_elem->toXmlWriter(pWriter);
			}

			smart_ptr<WrapperWritingElement> GetElem()
			{
				return m_elem;
			}

		
		private:
			smart_ptr<WrapperWritingElement> m_elem;
		protected:
			virtual void FillParentPointersForChilds(){};
		public:
			virtual void SetParentPointer(const WrapperWritingElement* pParent) {if(is_init()) m_elem->SetParentPointer(pParent);};
		};
	} 
} 

#endif 
