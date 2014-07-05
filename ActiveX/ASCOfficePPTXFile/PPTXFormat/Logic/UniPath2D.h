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
#ifndef PPTX_LOGIC_UNIPATH2D_INCLUDE_H_
#define PPTX_LOGIC_UNIPATH2D_INCLUDE_H_

#include "./../WrapperWritingElement.h"
#include "Path2D/PathBase.h"
#include "Path2D/MoveTo.h"
#include "Path2D/LineTo.h"
#include "Path2D/Close.h"
#include "Path2D/CubicBezTo.h"
#include "Path2D/ArcTo.h"
#include "Path2D/QuadBezTo.h"

namespace PPTX
{
	namespace Logic
	{
		class UniPath2D : public WrapperWritingElement
		{
		public:
			PPTX_LOGIC_BASE(UniPath2D)

		public:
			virtual void fromXML(XmlUtils::CXmlNode& node)
			{
				CString name = XmlUtils::GetNameNoNS(node.GetName());

				if (name == _T("moveTo"))
					Path2D.reset(new Logic::MoveTo(node));
				else if (name == _T("lnTo"))
					Path2D.reset(new Logic::LineTo(node));
				else if (name == _T("cubicBezTo"))
					Path2D.reset(new Logic::CubicBezTo(node));
				else if (name == _T("close"))
					Path2D.reset(new Logic::Close(node));
				else if (name == _T("arcTo"))
					Path2D.reset(new Logic::ArcTo(node));
				else if (name == _T("quadBezTo"))
					Path2D.reset(new Logic::QuadBezTo(node));
				else Path2D.reset();
			}

			virtual void GetPath2DFrom(XmlUtils::CXmlNode& element)
			{
				XmlUtils::CXmlNode oNode;
				
				if(element.GetNode(_T("a:moveTo"), oNode))
					Path2D.reset(new Logic::MoveTo(oNode));
				else if(element.GetNode(_T("a:lnTo"), oNode))
					Path2D.reset(new Logic::LineTo(oNode));
				else if(element.GetNode(_T("a:cubicBezTo"), oNode))
					Path2D.reset(new Logic::CubicBezTo(oNode));
				else if(element.GetNode(_T("a:close"), oNode))
					Path2D.reset(new Logic::Close(oNode));
				else if(element.GetNode(_T("a:arcTo"), oNode))
					Path2D.reset(new Logic::ArcTo(oNode));
				else if(element.GetNode(_T("a:quadBezTo"), oNode))
					Path2D.reset(new Logic::QuadBezTo(oNode));
				else Path2D.reset();
			}

			virtual CString toXML() const
			{
				if (Path2D.IsInit())
					return Path2D->toXML();
				return _T("");
			}

			virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
			{
				if (Path2D.is_init())
					Path2D->toPPTY(pWriter);
			}
			virtual void toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const
			{
				if (Path2D.is_init())
					Path2D->toXmlWriter(pWriter);
			}

			virtual bool is_init()const{return (Path2D.IsInit());};
			
			template<class T> const bool is() const { return (!Path2D.IsInit())?false:(typeid(*Path2D) == typeid(T));}
			template<class T> T& as() {return static_cast<T&>(*Path2D);}
			template<class T> const T& as() const {return static_cast<const T&>(*Path2D);}

		public:
			smart_ptr<PathBase> Path2D;
		protected:
			virtual void FillParentPointersForChilds(){};
		public:
			virtual void SetParentPointer(const WrapperWritingElement* pParent)
			{
				if(is_init())
					Path2D->SetParentPointer(pParent);
			};

			CString GetODString()const
			{
				return Path2D->GetODString();
			}
		};
	} 
} 

#endif // PPTX_LOGIC_UNIPATH2D_INCLUDE_H