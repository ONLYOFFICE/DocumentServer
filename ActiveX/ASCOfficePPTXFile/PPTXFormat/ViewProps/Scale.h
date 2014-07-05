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
#ifndef PPTX_VIEWPROPS_SCALE_INCLUDE_H_
#define PPTX_VIEWPROPS_SCALE_INCLUDE_H_

#include "./../WrapperWritingElement.h"
#include "Ratio.h"

namespace PPTX
{
	namespace nsViewProps
	{
		class Scale : public WrapperWritingElement
		{
		public:
			PPTX_LOGIC_BASE(Scale)

		public:
			virtual void fromXML(XmlUtils::CXmlNode& node)
			{
				sx = node.ReadNodeNoNS(_T("sx"));
				sy = node.ReadNodeNoNS(_T("sy"));

				FillParentPointersForChilds();
			}
			virtual CString toXML() const
			{
				XmlUtils::CNodeValue oValue;
				oValue.Write(sx);
				oValue.Write(sy);

				return XmlUtils::CreateNode(_T("p:scale"), oValue);
			}

			virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
			{
				pWriter->WriteRecord1(0, sx);
				pWriter->WriteRecord1(1, sy);
			}

			virtual void toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const
			{
				pWriter->StartNode(_T("p:scale"));
				pWriter->EndAttributes();

				pWriter->StartNode(_T("a:sx"));
				pWriter->StartAttributes();
				pWriter->WriteAttribute(_T("n"), sx.n);
				pWriter->WriteAttribute(_T("d"), sx.d);
				pWriter->EndAttributes();
				pWriter->EndNode(_T("a:sx"));

				pWriter->StartNode(_T("a:sy"));
				pWriter->StartAttributes();
				pWriter->WriteAttribute(_T("n"), sy.n);
				pWriter->WriteAttribute(_T("d"), sy.d);
				pWriter->EndAttributes();
				pWriter->EndNode(_T("a:sy"));
				
				pWriter->EndNode(_T("p:scale"));
			}

		public:
			nsViewProps::Ratio sx;
			nsViewProps::Ratio sy;
		protected:
			virtual void FillParentPointersForChilds()
			{
				sx.SetParentPointer(this);
				sy.SetParentPointer(this);
			}
		};
	} 
} 

#endif // PPTX_VIEWPROPS_SCALE_INCLUDE_H_