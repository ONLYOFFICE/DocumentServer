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
#ifndef PPTX_LOGIC_AHBASE_INCLUDE_H_
#define PPTX_LOGIC_AHBASE_INCLUDE_H_

#include "./../WrapperWritingElement.h"
#include "Ah.h"
#include "AhXY.h"
#include "AhPolar.h"

namespace PPTX
{
	namespace Logic
	{
		class AhBase : public WrapperWritingElement
		{
		public:
			PPTX_LOGIC_BASE(AhBase)

		public:
			virtual void fromXML(XmlUtils::CXmlNode& node)
			{
				CString name = XmlUtils::GetNameNoNS(node.GetName());

				if (name == _T("ahXY"))
					ah.reset(new Logic::AhXY(node));
				else if (name == _T("ahPolar"))
					ah.reset(new Logic::AhPolar(node));
				else ah.reset();
			}

			virtual void GetAdjustHandleFrom(XmlUtils::CXmlNode& element)
			{
				XmlUtils::CXmlNode oNode;
				if (element.GetNode(_T("a:ahXY"), oNode))
					ah.reset(new Logic::AhXY(oNode));
				else if(element.GetNode(_T("a:ahPolar"), oNode))
					ah.reset(new Logic::AhPolar(oNode));
				else ah.reset();
			}

			virtual CString toXML() const
			{
				if (ah.is_init())
					return ah->toXML();

				return _T("");
			}

			virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
			{
				if (ah.is_init())
					ah->toPPTY(pWriter);
			}
			virtual void toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const
			{
				if (ah.is_init())
					ah->toXmlWriter(pWriter);
			}
			
			template<class T> const bool is() const { return (!ah.IsInit())?false:(typeid(*ah) == typeid(T));}
			template<class T> T& as() {return static_cast<T&>(*ah);}
			template<class T> const T& as() const {return static_cast<const T&>(*ah);}

			virtual bool is_init()const{return (ah.is_init());};

		public:
			smart_ptr<Ah> ah;
		protected:
			virtual void FillParentPointersForChilds(){};
		public:
			virtual void SetParentPointer(const WrapperWritingElement* pParent)
			{
				if(is_init())
					ah->SetParentPointer(pParent);
			}
			
			CString GetODString()const
			{
				if (!ah.IsInit())
					return _T("");
				return ah->GetODString();
			}
		};
	} 
} 

#endif // PPTX_LOGIC_AHBASE_INCLUDE_H_