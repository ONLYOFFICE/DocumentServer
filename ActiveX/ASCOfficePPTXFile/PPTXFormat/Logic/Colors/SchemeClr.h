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
#ifndef PPTX_LOGIC_SCHEMECLR_INCLUDE_H_
#define PPTX_LOGIC_SCHEMECLR_INCLUDE_H_

#include "./../../Limit/SchemeClrVal.h"
#include "./../../Theme/ClrScheme.h"
#include "ColorBase.h"

namespace PPTX
{
	namespace Logic
	{
		class SchemeClr : public ColorBase
		{
		public:
			PPTX_LOGIC_BASE(SchemeClr)

		public:
			virtual void fromXML(XmlUtils::CXmlNode& node);
			virtual CString toXML() const;

			virtual void toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const
			{
				pWriter->StartNode(_T("a:schemeClr"));
						
				pWriter->StartAttributes();
				pWriter->WriteAttribute(_T("val"), val.get());
				pWriter->EndAttributes();

				size_t nCount = Modifiers.GetCount();
				for (size_t i = 0; i < nCount; ++i)
					Modifiers[i].toXmlWriter(pWriter);
				
				pWriter->EndNode(_T("a:schemeClr"));
			}

			virtual DWORD GetRGBA(DWORD RGBA) const;
			virtual DWORD GetARGB(DWORD ARGB) const;
			virtual DWORD GetBGRA(DWORD BGRA) const;
			virtual DWORD GetABGR(DWORD ABGR) const;

			virtual DWORD GetRGBColor(NSCommon::smart_ptr<PPTX::WrapperFile>& _oTheme, NSCommon::smart_ptr<PPTX::WrapperWritingElement>& _oClrMap, DWORD ARGB = 0);

			virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
			{
				pWriter->StartRecord(COLOR_TYPE_SCHEME);

				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeStart);
				pWriter->WriteLimit1(0, val);
				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeEnd);

				ULONG len = (ULONG)Modifiers.GetCount();
				if (len != 0)
				{
					pWriter->StartRecord(0);
					pWriter->WriteULONG(len);

					for (ULONG i = 0; i < len; ++i)
					{
						pWriter->WriteRecord1(1, Modifiers[i]);
					}

					pWriter->EndRecord();
				}

				pWriter->EndRecord();
			}

		public:
			Limit::SchemeClrVal val;
		private:
			void FillRGBFromVal(DWORD rgb);

		protected:
			virtual void FillParentPointersForChilds(){};
		};
	} 
} 

#endif // PPTX_LOGIC_SCHEMECLR_INCLUDE_H