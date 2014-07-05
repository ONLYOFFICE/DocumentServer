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
#ifndef PPTX_LOGIC_AHPOLAR_INCLUDE_H_
#define PPTX_LOGIC_AHPOLAR_INCLUDE_H_

#include "Ah.h"

namespace PPTX
{
	namespace Logic
	{

		class AhPolar : public Ah
		{
		public:
			PPTX_LOGIC_BASE(AhPolar)

		public:
			virtual void fromXML(XmlUtils::CXmlNode& node)
			{
				XmlUtils::CXmlNode oPos = node.ReadNode(_T("a:pos"));

				x	= oPos.GetAttributeBase(L"x");
				y	= oPos.GetAttributeBase(L"y");

				node.ReadAttributeBase(L"gdRefAng", gdRefAng);
				node.ReadAttributeBase(L"gdRefR", gdRefR);
				node.ReadAttributeBase(L"maxAng", maxAng);
				node.ReadAttributeBase(L"maxR", maxR);
				node.ReadAttributeBase(L"minAng", minAng);
				node.ReadAttributeBase(L"minR", minR);
			}

			virtual CString toXML() const
			{
				XmlUtils::CAttribute oAttr1;
				oAttr1.Write(_T("gdRefR"), gdRefR);
				oAttr1.Write(_T("minR"), minR);
				oAttr1.Write(_T("maxR"), maxR);
				oAttr1.Write(_T("gdRefAng"), gdRefAng);
				oAttr1.Write(_T("minAng"), minAng);
				oAttr1.Write(_T("maxAng"), maxAng);

				XmlUtils::CAttribute oAttr2;
				oAttr2.Write(_T("x"), x);
				oAttr2.Write(_T("y"), y);

				return XmlUtils::CreateNode(_T("a:ahPolar"), oAttr1, XmlUtils::CreateNode(_T("a:pos"), oAttr2));
			}

			virtual void toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const
			{
				pWriter->StartNode(_T("a:ahPolar"));

				pWriter->StartAttributes();
				pWriter->WriteAttribute(_T("gdRefR"), gdRefR);
				pWriter->WriteAttribute(_T("minR"), minR);
				pWriter->WriteAttribute(_T("maxR"), maxR);
				pWriter->WriteAttribute(_T("gdRefAng"), gdRefAng);
				pWriter->WriteAttribute(_T("minAng"), minAng);
				pWriter->WriteAttribute(_T("maxAng"), maxAng);
				pWriter->EndAttributes();

				pWriter->StartNode(_T("a:pos"));
				pWriter->StartAttributes();
				pWriter->WriteAttribute(_T("x"), x);
				pWriter->WriteAttribute(_T("y"), y);
				pWriter->EndAttributes();
				pWriter->EndNode(_T("a:pos"));

				pWriter->EndNode(_T("a:ahPolar"));
			}

			virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
			{
				pWriter->StartRecord(GEOMETRY_TYPE_AH_POLAR);

				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeStart);
				pWriter->WriteString1(0, x);
				pWriter->WriteString1(1, y);

				pWriter->WriteString2(2, gdRefAng);
				pWriter->WriteString2(3, gdRefR);
				pWriter->WriteString2(4, maxAng);
				pWriter->WriteString2(5, maxR);
				pWriter->WriteString2(6, minAng);
				pWriter->WriteString2(7, minR);
				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeEnd);

				pWriter->EndRecord();
			}

		public:
			CString				x;
			CString				y;

			nullable_string gdRefAng;
			nullable_string gdRefR;
			nullable_string maxAng;
			nullable_string maxR;
			nullable_string minAng;
			nullable_string minR;
		protected:
			virtual void FillParentPointersForChilds(){};
		public:
			CString GetODString()const
			{
				XmlUtils::CAttribute oAttr1;
				oAttr1.Write(_T("gdRefR"), gdRefR);
				oAttr1.Write(_T("minR"), minR);
				oAttr1.Write(_T("maxR"), maxR);
				oAttr1.Write(_T("gdRefAng"), gdRefAng);
				oAttr1.Write(_T("minAng"), minAng);
				oAttr1.Write(_T("maxAng"), maxAng);

				XmlUtils::CAttribute oAttr2;
				oAttr2.Write(_T("x"), x);
				oAttr2.Write(_T("y"), y);

				return XmlUtils::CreateNode(_T("ahPolar"), oAttr1, XmlUtils::CreateNode(_T("pos"), oAttr2));
			}
		};
	} 
} 

#endif // PPTX_LOGIC_AHPOLAR_INCLUDE_H_