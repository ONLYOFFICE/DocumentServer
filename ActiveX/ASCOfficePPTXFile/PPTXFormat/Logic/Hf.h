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
#ifndef PPTX_LOGIC_HF_INCLUDE_H_
#define PPTX_LOGIC_HF_INCLUDE_H_

#include "./../WrapperWritingElement.h"

namespace PPTX
{
	namespace Logic
	{
		class HF : public WrapperWritingElement
		{
		public:
			PPTX_LOGIC_BASE(HF)

		public:
			virtual void fromXML(XmlUtils::CXmlNode& node)
			{
				node.ReadAttributeBase(L"dt", dt);
				node.ReadAttributeBase(L"ftr", ftr);
				node.ReadAttributeBase(L"hdr", hdr);
				node.ReadAttributeBase(L"sldNum", sldNum);
			}
			virtual CString toXML() const
			{
				XmlUtils::CAttribute oAttr;
				oAttr.Write(_T("dt"), dt);
				oAttr.Write(_T("ftr"), ftr);
				oAttr.Write(_T("hdr"), hdr);
				oAttr.Write(_T("sldNum"), sldNum);

				return XmlUtils::CreateNode(_T("p:hf"), oAttr);
			}

			virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
			{
				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeStart);
				pWriter->WriteBool2(0, dt);
				pWriter->WriteBool2(1, ftr);
				pWriter->WriteBool2(2, hdr);
				pWriter->WriteBool2(3, sldNum);
				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeEnd);
			}
			virtual void toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const
			{
				pWriter->StartNode(_T("p:hf"));

				pWriter->StartAttributes();
				pWriter->WriteAttribute(_T("dt"), dt.get_value_or(false));
				pWriter->WriteAttribute(_T("ftr"), ftr.get_value_or(false));
				pWriter->WriteAttribute(_T("hdr"), hdr.get_value_or(false));
				pWriter->WriteAttribute(_T("sldNum"), sldNum.get_value_or(false));
				pWriter->EndAttributes();

				pWriter->EndNode(_T("p:hf"));
			}
			virtual void fromPPTY(NSBinPptxRW::CBinaryFileReader* pReader)
			{
				LONG _e = pReader->GetPos() + pReader->GetLong() + 4;

				pReader->Skip(1); 
				while (true)
				{
					BYTE _at = pReader->GetUChar();
					if (_at == NSBinPptxRW::g_nodeAttributeEnd)
						break;

					if (0 == _at)
						dt = pReader->GetBool();
					else if (1 == _at)
						ftr = pReader->GetBool();
					else if (2 == _at)
						hdr = pReader->GetBool();
					else if (3 == _at)
						sldNum = pReader->GetBool();
				}

				pReader->Seek(_e);
			}

		public:
			nullable_bool		dt;
			nullable_bool		ftr;
			nullable_bool		hdr;
			nullable_bool		sldNum;
		protected:
			virtual void FillParentPointersForChilds(){};
		};
	} 
} 

#endif // PPTX_LOGIC_HF_INCLUDE_H_