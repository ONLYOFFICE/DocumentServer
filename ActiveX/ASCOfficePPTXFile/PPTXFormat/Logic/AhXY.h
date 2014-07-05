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
#ifndef PPTX_LOGIC_AHXY_INCLUDE_H_
#define PPTX_LOGIC_AHXY_INCLUDE_H_

#include "Ah.h"

namespace PPTX
{
	namespace Logic
	{

		class AhXY : public Ah
		{
		public:
			PPTX_LOGIC_BASE(AhXY)

		public:
			virtual void fromXML(XmlUtils::CXmlNode& node)
			{
				XmlUtils::CXmlNode oPos = node.ReadNode(_T("a:pos"));

				x	= oPos.ReadAttributeBase(L"x");
				y	= oPos.ReadAttributeBase(L"y");

				node.ReadAttributeBase(L"gdRefX", gdRefX);
				node.ReadAttributeBase(L"gdRefY", gdRefY);
				node.ReadAttributeBase(L"maxX", maxX);
				node.ReadAttributeBase(L"maxY", maxY);
				node.ReadAttributeBase(L"minX", minX);
				node.ReadAttributeBase(L"minY", minY);
			}

			virtual CString toXML() const
			{
				XmlUtils::CAttribute oAttr1;
				oAttr1.Write(_T("gdRefX"), gdRefX);
				oAttr1.Write(_T("minX"), minX);
				oAttr1.Write(_T("maxX"), maxX);
				oAttr1.Write(_T("gdRefY"), gdRefY);
				oAttr1.Write(_T("minY"), minY);
				oAttr1.Write(_T("maxY"), maxY);

				XmlUtils::CAttribute oAttr2;
				oAttr2.Write(_T("x"), x);
				oAttr2.Write(_T("y"), y);

				return XmlUtils::CreateNode(_T("a:ahXY"), oAttr1, XmlUtils::CreateNode(_T("a:pos"), oAttr2));
			}

			virtual void toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const
			{
				pWriter->StartNode(_T("a:ahXY"));

				pWriter->StartAttributes();
				pWriter->WriteAttribute(_T("gdRefX"), gdRefX);
				pWriter->WriteAttribute(_T("minX"), minX);
				pWriter->WriteAttribute(_T("maxX"), maxX);
				pWriter->WriteAttribute(_T("gdRefY"), gdRefY);
				pWriter->WriteAttribute(_T("minY"), minY);
				pWriter->WriteAttribute(_T("maxY"), maxY);
				pWriter->EndAttributes();

				pWriter->StartNode(_T("a:pos"));
				pWriter->StartAttributes();
				pWriter->WriteAttribute(_T("x"), x);
				pWriter->WriteAttribute(_T("y"), y);
				pWriter->EndAttributes();
				pWriter->EndNode(_T("a:pos"));

				pWriter->EndNode(_T("a:ahXY"));
			}

			virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
			{
				pWriter->StartRecord(GEOMETRY_TYPE_AH_XY);

				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeStart);
				pWriter->WriteString1(0, x);
				pWriter->WriteString1(1, y);

				pWriter->WriteString2(2, gdRefX);
				pWriter->WriteString2(3, gdRefY);
				pWriter->WriteString2(4, maxX);
				pWriter->WriteString2(5, maxY);
				pWriter->WriteString2(6, minX);
				pWriter->WriteString2(7, minY);
				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeEnd);

				pWriter->EndRecord();
			}

		public:
			CString								x;
			CString								y;

			nullable_string					gdRefX;
			nullable_string					gdRefY;
			nullable_string					maxX;
			nullable_string					maxY;
			nullable_string					minX;
			nullable_string					minY;
		protected:
			virtual void FillParentPointersForChilds(){};
		public:
			
			CString GetODString()const
			{
				XmlUtils::CAttribute oAttr1;
				oAttr1.Write(_T("gdRefX"), gdRefX);
				oAttr1.Write(_T("minX"), minX);
				oAttr1.Write(_T("maxX"), maxX);
				oAttr1.Write(_T("gdRefY"), gdRefY);
				oAttr1.Write(_T("minY"), minY);
				oAttr1.Write(_T("maxY"), maxY);

				XmlUtils::CAttribute oAttr2;
				oAttr2.Write(_T("x"), x);
				oAttr2.Write(_T("y"), y);

				return XmlUtils::CreateNode(_T("ahXY"), oAttr1, XmlUtils::CreateNode(_T("pos"), oAttr2));
			}
		};
	} 
} 

#endif // PPTX_LOGIC_AHXY_INCLUDE_H_