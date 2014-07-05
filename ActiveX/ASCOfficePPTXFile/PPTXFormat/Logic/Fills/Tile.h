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
#ifndef PPTX_LOGIC_TILE_INCLUDE_H_
#define PPTX_LOGIC_TILE_INCLUDE_H_

#include "./../../WrapperWritingElement.h"
#include "./../../Limit/RectAlign.h"
#include "./../../Limit/Flip.h"

namespace PPTX
{
	namespace Logic
	{

		class Tile : public WrapperWritingElement
		{
		public:
			PPTX_LOGIC_BASE(Tile)

			Tile& operator=(const Tile& oSrc)
			{
				parentFile		= oSrc.parentFile;
				parentElement	= oSrc.parentElement;

				algn	= oSrc.algn;
				flip	= oSrc.flip;
				sx		= oSrc.sx;
				sy		= oSrc.sy;
				tx		= oSrc.tx;
				ty		= oSrc.ty;

				return *this;
			}

		public:
			virtual void fromXML(XmlUtils::CXmlNode& node)
			{
				node.ReadAttributeBase(L"algn", algn);
				node.ReadAttributeBase(L"flip", flip);
				node.ReadAttributeBase(L"sx", sx);
				node.ReadAttributeBase(L"sy", sy);
				node.ReadAttributeBase(L"tx", tx);
				node.ReadAttributeBase(L"ty", ty);
			}
			virtual CString toXML() const
			{
				XmlUtils::CAttribute oAttr;
				oAttr.WriteLimitNullable(_T("algn"), algn);
				oAttr.WriteLimitNullable(_T("flip"), flip);
				oAttr.Write(_T("sx"), sx);
				oAttr.Write(_T("sy"), sy);
				oAttr.Write(_T("tx"), tx);
				oAttr.Write(_T("ty"), ty);

				return XmlUtils::CreateNode(_T("a:tile"), oAttr);
			}

			virtual void toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const
			{
				pWriter->StartNode(_T("a:tile"));

				pWriter->StartAttributes();
				pWriter->WriteAttribute(_T("algn"), algn);
				pWriter->WriteAttribute(_T("flip"), flip);
				pWriter->WriteAttribute(_T("sx"), sx);
				pWriter->WriteAttribute(_T("sy"), sy);
				pWriter->WriteAttribute(_T("tx"), tx);
				pWriter->WriteAttribute(_T("ty"), ty);
				pWriter->EndAttributes();

				pWriter->EndNode(_T("a:tile"));
			}

			virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
			{
				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeStart);
				pWriter->WriteInt2(0, sx);
				pWriter->WriteInt2(1, sy);
				pWriter->WriteInt2(2, tx);
				pWriter->WriteInt2(3, ty);
				pWriter->WriteLimit2(4, algn);
				pWriter->WriteLimit2(5, flip);
				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeEnd);
			}

		public:
			nullable_limit<Limit::RectAlign>	algn;
			nullable_limit<Limit::Flip>			flip;
			nullable_int						sx;
			nullable_int						sy;
			nullable_int						tx;
			nullable_int						ty;
		protected:
			virtual void FillParentPointersForChilds(){};
		};
	} 
} 

#endif // PPTX_LOGIC_TILE_INCLUDE_H_