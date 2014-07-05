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
#ifndef PPTX_LOGIC_NVCXNSPPR_INCLUDE_H_
#define PPTX_LOGIC_NVCXNSPPR_INCLUDE_H_

#include "./../WrapperWritingElement.h"
#include "CNvPr.h"
#include "CNvCxnSpPr.h"
#include "NvPr.h"


namespace PPTX
{
	namespace Logic
	{
		class NvCxnSpPr : public WrapperWritingElement
		{
		public:
			PPTX_LOGIC_BASE(NvCxnSpPr)

			NvCxnSpPr& operator=(const NvCxnSpPr& oSrc)
			{
				parentFile		= oSrc.parentFile;
				parentElement	= oSrc.parentElement;

				cNvPr		= oSrc.cNvPr;
				cNvCxnSpPr	= oSrc.cNvCxnSpPr;
				nvPr		= oSrc.nvPr;

				return *this;
			}

		public:
			virtual void NvCxnSpPr::fromXML(XmlUtils::CXmlNode& node)
			{
				cNvPr		= node.ReadNode(_T("p:cNvPr"));
				cNvCxnSpPr	= node.ReadNode(_T("p:cNvCxnSpPr"));
				nvPr		= node.ReadNode(_T("p:nvPr"));

				FillParentPointersForChilds();
			}

			virtual CString NvCxnSpPr::toXML() const
			{
				XmlUtils::CNodeValue oValue;
				oValue.Write(cNvPr);
				oValue.Write(cNvCxnSpPr);
				oValue.Write(nvPr);

				return XmlUtils::CreateNode(_T("<p:nvCxnSpPr>"), oValue);
			}
			virtual void toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const
			{
				pWriter->StartNode(_T("p:nvCxnSpPr"));
				pWriter->EndAttributes();

				cNvPr.toXmlWriter(pWriter);
				cNvCxnSpPr.toXmlWriter(pWriter);
				nvPr.toXmlWriter(pWriter);

				pWriter->EndNode(_T("p:nvCxnSpPr"));
			}

			virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
			{
				pWriter->WriteRecord1(0, cNvPr);
				pWriter->WriteRecord1(1, cNvCxnSpPr);
				pWriter->WriteRecord1(2, nvPr);
			}

			virtual void fromPPTY(NSBinPptxRW::CBinaryFileReader* pReader)
			{
				LONG _end_rec = pReader->GetPos() + pReader->GetLong() + 4;

				while (pReader->GetPos() < _end_rec)
				{
					BYTE _at = pReader->GetUChar();
					switch (_at)
					{
						case 0:
						{
							cNvPr.fromPPTY(pReader);
							break;
						}
						case 1:
						{
							cNvCxnSpPr.fromPPTY(pReader);
							break;
						}
						case 2:
						{
							nvPr.fromPPTY(pReader);
							break;
						}
						default:
							break;
					}
				}

				pReader->Seek(_end_rec);
			}

		public:
			CNvPr		cNvPr;
			CNvCxnSpPr	cNvCxnSpPr;
			NvPr		nvPr;
		protected:
			virtual void FillParentPointersForChilds()
			{
				cNvPr.SetParentPointer(this);
				cNvCxnSpPr.SetParentPointer(this);
				nvPr.SetParentPointer(this);
			}
		};
	} 
} 

#endif // PPTX_LOGIC_NVCXNSPPR_INCLUDE_H