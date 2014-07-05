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
#ifndef PPTX_LOGIC_COLORMODIFIER_INCLUDE_H_
#define PPTX_LOGIC_COLORMODIFIER_INCLUDE_H_

#include "./../../WrapperWritingElement.h"

namespace PPTX
{
	namespace Logic
	{
		class ColorModifier : public WrapperWritingElement
		{
		public:
			PPTX_LOGIC_BASE(ColorModifier)
		public:
			virtual void fromXML(XmlUtils::CXmlNode& node)
			{
				name	= node.GetName();
				node.ReadAttributeBase(L"val", val);

				if (name == _T("a:alpha"))
				{
					nullable_string sTmp;
					node.ReadAttributeBase(L"val", sTmp);

					if (val.is_init() && sTmp.is_init() && sTmp->Find(TCHAR('%')) != -1)
						*val = (*val) * 1000;
				}
			}
			virtual CString toXML() const
			{
				XmlUtils::CAttribute oAttr;
				oAttr.Write(_T("val"), val);
				return XmlUtils::CreateNode(name, oAttr);
			}

			ColorModifier& operator=(const ColorModifier& oSrc)
			{
				parentFile		= oSrc.parentFile;
				parentElement	= oSrc.parentElement;

				name		= oSrc.name;
				val			= oSrc.val;
				return *this;
			}

			virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
			{
				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeStart);
				pWriter->WriteString1(0, name);
				pWriter->WriteInt2(1, val);
				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeEnd);
			}

			virtual void toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const
			{				
				pWriter->StartNode(name);
				pWriter->StartAttributes();
				pWriter->WriteAttribute(_T("val"), val);
				pWriter->EndAttributes();
				pWriter->EndNode(name);
			}

		public:
			CString			name;
			nullable_int	val;
		protected:
			virtual void FillParentPointersForChilds(){};
		};
	} 
} 

#endif // PPTX_LOGIC_COLORMODIFIER_INCLUDE_H