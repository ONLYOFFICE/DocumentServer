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
#ifndef PPTX_LOGIC_OUTERSHDW_INCLUDE_H_
#define PPTX_LOGIC_OUTERSHDW_INCLUDE_H_

#include "./../../WrapperWritingElement.h"
#include "./../UniColor.h"
#include "./../../Limit/RectAlign.h"

namespace PPTX
{
	namespace Logic
	{

		class OuterShdw : public WrapperWritingElement
		{
		public:
			PPTX_LOGIC_BASE(OuterShdw)

			OuterShdw& operator=(const OuterShdw& oSrc)
			{
				parentFile		= oSrc.parentFile;
				parentElement	= oSrc.parentElement;

				Color			= oSrc.Color;

				algn			= oSrc.algn;
				blurRad			= oSrc.blurRad;
				dir				= oSrc.dir;
				dist			= oSrc.dist;
				kx				= oSrc.kx;
				ky				= oSrc.ky;
				rotWithShape	= oSrc.rotWithShape;
				sx				= oSrc.sx;
				sy				= oSrc.sy;

				return *this;
			}

		public:
			virtual void fromXML(XmlUtils::CXmlNode& node)
			{
				Color.GetColorFrom(node);
				node.ReadAttributeBase(L"algn", algn);
				node.ReadAttributeBase(L"blurRad", blurRad);
				node.ReadAttributeBase(L"dir", dir);
				node.ReadAttributeBase(L"dist", dist);
				node.ReadAttributeBase(L"kx", kx);
				node.ReadAttributeBase(L"ky", ky);
				node.ReadAttributeBase(L"rotWithShape", rotWithShape);
				node.ReadAttributeBase(L"sx", sx);
				node.ReadAttributeBase(L"sy", sy);

				Normalize();

				FillParentPointersForChilds();
			}

			virtual CString toXML() const
			{
				XmlUtils::CAttribute oAttr;
				oAttr.Write(_T("blurRad"), blurRad);
				oAttr.Write(_T("dir"), dist);
				oAttr.Write(_T("dist"), dir);
				oAttr.Write(_T("sx"), sx);
				oAttr.Write(_T("sy"), sy);
				oAttr.Write(_T("kx"), kx);
				oAttr.Write(_T("ky"), ky);
				oAttr.WriteLimitNullable(_T("algn"), algn);
				oAttr.Write(_T("rotWithShape"), rotWithShape);

				XmlUtils::CNodeValue oValue;
				oValue.Write(Color);

				return XmlUtils::CreateNode(_T("a:outerShdw"), oAttr, oValue);
			}

			virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
			{
				pWriter->StartRecord(EFFECT_TYPE_OUTERSHDW);

				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeStart);
				pWriter->WriteLimit2(0, algn);
				pWriter->WriteInt2(1, blurRad);
				pWriter->WriteInt2(2, dir);
				pWriter->WriteInt2(3, dist);
				pWriter->WriteInt2(4, kx);
				pWriter->WriteInt2(5, ky);
				pWriter->WriteInt2(6, sx);
				pWriter->WriteInt2(7, sy);
				pWriter->WriteBool2(8, rotWithShape);
				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeEnd);

				pWriter->WriteRecord1(0, Color);

				pWriter->EndRecord();
			}

		public:
			UniColor Color;

			nullable_limit<Limit::RectAlign>	algn;
			nullable_int						blurRad;
			nullable_int						dir;
			nullable_int						dist;
			nullable_int						kx;
			nullable_int						ky;
			nullable_bool						rotWithShape;
			nullable_int						sx;
			nullable_int						sy;
		protected:
			virtual void FillParentPointersForChilds()
			{
				Color.SetParentPointer(this);
			}

			AVSINLINE void Normalize()
			{
				blurRad.normalize_positive();
				dist.normalize_positive();

				dir.normalize(0, 21600000);
				kx.normalize(-5400000, 5400000);
				ky.normalize(-5400000, 5400000);
			}
		};
	} 
} 

#endif // PPTX_LOGIC_OUTERSHDW_INCLUDE_H_