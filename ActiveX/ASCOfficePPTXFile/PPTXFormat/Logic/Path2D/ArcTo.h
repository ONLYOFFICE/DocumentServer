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
#ifndef PPTX_LOGIC_ARCTO_INCLUDE_H_
#define PPTX_LOGIC_ARCTO_INCLUDE_H_

#include "PathBase.h"

namespace PPTX
{
	namespace Logic
	{
		class ArcTo : public PathBase
		{
		public:
			PPTX_LOGIC_BASE(ArcTo)

			ArcTo& operator=(const ArcTo& oSrc)
			{
				parentFile		= oSrc.parentFile;
				parentElement	= oSrc.parentElement;

				wR		= oSrc.wR;
				hR		= oSrc.hR;
				stAng	= oSrc.stAng;
				swAng	= oSrc.swAng;

				return *this;
			}

		public:
			virtual void fromXML(XmlUtils::CXmlNode& node)
			{
				wR		= node.GetAttribute(_T("wR"));
				hR		= node.GetAttribute(_T("hR"));
				stAng	= node.GetAttribute(_T("stAng"));
				swAng	= node.GetAttribute(_T("swAng"));
			}

			virtual CString toXML() const
			{
				XmlUtils::CAttribute oAttr;
				oAttr.Write(_T("wR"), wR);
				oAttr.Write(_T("hR"), hR);
				oAttr.Write(_T("stAng"), stAng);
				oAttr.Write(_T("swAng"), swAng);

				return XmlUtils::CreateNode(_T("a:arcTo"), oAttr);
			}

			virtual void toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const
			{
				pWriter->StartNode(_T("a:arcTo"));
				pWriter->StartAttributes();
				pWriter->WriteAttribute(_T("wR"), wR);
				pWriter->WriteAttribute(_T("hR"), hR);
				pWriter->WriteAttribute(_T("stAng"), stAng);
				pWriter->WriteAttribute(_T("swAng"), swAng);
				pWriter->EndAttributes();
				pWriter->EndNode(_T("a:arcTo"));
			}

			virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
			{
				pWriter->StartRecord(GEOMETRY_TYPE_PATH_ARCTO);

				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeStart);
				pWriter->WriteString1(0, wR);
				pWriter->WriteString1(1, hR);
				pWriter->WriteString1(2, stAng);
				pWriter->WriteString1(3, swAng);
				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeEnd);

				pWriter->EndRecord();
			}

		public:
			CString wR;
			CString hR;
			CString stAng;
			CString swAng;
		protected:
			virtual void FillParentPointersForChilds(){};
		public:
			virtual CString GetODString()const
			{
				XmlUtils::CAttribute oAttr;
				oAttr.Write(_T("wR"), wR);
				oAttr.Write(_T("hR"), hR);
				oAttr.Write(_T("stAng"), stAng);
				oAttr.Write(_T("swAng"), swAng);

				return XmlUtils::CreateNode(_T("arcTo"), oAttr);
			}
		};
	} 
} 

#endif // PPTX_LOGIC_ARCTO_INCLUDE_H_