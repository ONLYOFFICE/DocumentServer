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
#ifndef PPTX_LOGIC_SRGBCLR_INCLUDE_H_
#define PPTX_LOGIC_SRGBCLR_INCLUDE_H_

#include "ColorBase.h"

namespace PPTX
{
	namespace Logic
	{
		class SrgbClr : public ColorBase
		{
		public:
			PPTX_LOGIC_BASE(SrgbClr)

		public:
			virtual void fromXML(XmlUtils::CXmlNode& node)
			{
				CString val = node.GetAttribute(_T("val"));
				red		= HexString2Int(val.Mid(0, 2));
				green	= HexString2Int(val.Mid(2, 2));
				blue	= HexString2Int(val.Mid(4, 2));

				Modifiers.RemoveAll();
				node.LoadArray(_T("*"), Modifiers);
			}


			virtual CString toXML() const
			{
				CString str = _T("");
				str.Format(_T("%.02X%.02X%.02X"), red, green, blue);
						
				XmlUtils::CAttribute oAttr;
				oAttr.Write(_T("val"), str);

				XmlUtils::CNodeValue oValue;
				oValue.WriteArray(Modifiers);

				return XmlUtils::CreateNode(_T("a:srgbClr"), oAttr, oValue);
			}
			virtual void toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const
			{
				pWriter->StartNode(_T("a:srgbClr"));
				
				CString str = _T("");
				str.Format(_T("%.02X%.02X%.02X"), red, green, blue);
						
				pWriter->StartAttributes();
				pWriter->WriteAttribute(_T("val"), str);
				pWriter->EndAttributes();

				size_t nCount = Modifiers.GetCount();
				for (size_t i = 0; i < nCount; ++i)
					Modifiers[i].toXmlWriter(pWriter);
				
				pWriter->EndNode(_T("a:srgbClr"));
			}

			virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
			{
				pWriter->StartRecord(COLOR_TYPE_SRGB);

				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeStart);
				pWriter->WriteBYTE(0); pWriter->WriteBYTE(red);
				pWriter->WriteBYTE(1); pWriter->WriteBYTE(green);
				pWriter->WriteBYTE(2); pWriter->WriteBYTE(blue);
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

		protected:
			virtual void FillParentPointersForChilds(){};
		};
	} 
} 

#endif // PPTX_LOGIC_SRGBCLR_INCLUDE_H