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
#ifndef PPTX_LOGIC_SLIDE_NVGRPSPPR_INCLUDE_H_
#define PPTX_LOGIC_SLIDE_NVGRPSPPR_INCLUDE_H_

#include "./../WrapperWritingElement.h"
#include "CNvPr.h"
#include "CNvGrpSpPr.h"
#include "NvPr.h"

namespace PPTX
{
	namespace Logic
	{

		class NvGrpSpPr : public WrapperWritingElement
		{
		public:
			PPTX_LOGIC_BASE(NvGrpSpPr)

			NvGrpSpPr& operator=(const NvGrpSpPr& oSrc)
			{
				parentFile		= oSrc.parentFile;
				parentElement	= oSrc.parentElement;

				cNvPr		= oSrc.cNvPr;
				cNvGrpSpPr	= oSrc.cNvGrpSpPr;
				nvPr		= oSrc.nvPr;
				return *this;
			}

		public:
			virtual void fromXML(XmlUtils::CXmlNode& node)
			{
				XmlUtils::CXmlNodes oNodes;
				if (node.GetNodes(_T("*"), oNodes))
				{
					int nCount = oNodes.GetCount();
					for (int i = 0; i < nCount; ++i)
					{
						XmlUtils::CXmlNode oNode;
						oNodes.GetAt(i, oNode);

						CString strName = XmlUtils::GetNameNoNS(oNode.GetName());

						if (_T("cNvPr") == strName)
							cNvPr = oNode;
						else if (_T("cNvGrpSpPr") == strName)
							cNvGrpSpPr = oNode;
						else if (_T("nvPr") == strName)
							nvPr = oNode;
					}
				}

				FillParentPointersForChilds();
			}

			virtual CString toXML() const
			{
				XmlUtils::CNodeValue oValue;
				oValue.Write(cNvPr);
				oValue.Write(cNvGrpSpPr);
				oValue.Write(nvPr);

				return XmlUtils::CreateNode(_T("p:nvGrpSpPr"), oValue);
			}

			virtual void toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const
			{
				if (pWriter->m_lDocType == XMLWRITER_DOC_TYPE_XLSX)
					pWriter->StartNode(_T("xdr:nvGrpSpPr"));
				else
					pWriter->StartNode(_T("p:nvGrpSpPr"));
				
				pWriter->EndAttributes();

				cNvPr.toXmlWriter(pWriter);
				cNvGrpSpPr.toXmlWriter(pWriter);

				if (pWriter->m_lDocType == XMLWRITER_DOC_TYPE_PPTX)
					nvPr.toXmlWriter(pWriter);

				if (pWriter->m_lDocType == XMLWRITER_DOC_TYPE_XLSX)
					pWriter->EndNode(_T("xdr:nvGrpSpPr"));
				else
					pWriter->EndNode(_T("p:nvGrpSpPr"));
			}

			virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
			{
				pWriter->WriteRecord1(0, cNvPr);
				pWriter->WriteRecord1(1, cNvGrpSpPr);
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
							cNvGrpSpPr.fromPPTY(pReader);
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
			CNvGrpSpPr	cNvGrpSpPr;
			NvPr		nvPr;
		protected:
			virtual void FillParentPointersForChilds()
			{
				cNvPr.SetParentPointer(this);
				cNvGrpSpPr.SetParentPointer(this);
				nvPr.SetParentPointer(this);
			}
		};
	} 
} 

#endif // PPTX_LOGIC_SLIDE_NVGRPSPPR_INCLUDE_H_