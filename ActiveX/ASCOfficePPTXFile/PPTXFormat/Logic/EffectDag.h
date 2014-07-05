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
#ifndef PPTX_LOGIC_EFFECTDAG_INCLUDE_H_
#define PPTX_LOGIC_EFFECTDAG_INCLUDE_H_

#include "./../WrapperWritingElement.h"
#include "UniEffect.h"
#include "./../Limit/EffectContainerType.h"

namespace PPTX
{
	namespace Logic
	{

		class EffectDag : public WrapperWritingElement
		{
		public:
			
			PPTX_LOGIC_BASE(EffectDag)

			EffectDag& operator=(const EffectDag& oSrc)
			{
				parentFile		= oSrc.parentFile;
				parentElement	= oSrc.parentElement;

				Effects.Copy(oSrc.Effects);
				name = oSrc.name;
				type = oSrc.type;
				m_name = oSrc.m_name;
				return *this;
			}

		public:
			virtual void fromXML(XmlUtils::CXmlNode& node)
			{
				m_name	= node.GetName();
				node.ReadAttributeBase(L"name", name);
				node.ReadAttributeBase(L"type", type);
				Effects.RemoveAll();
				node.LoadArray(_T("*"), Effects);

				FillParentPointersForChilds();
			}

			virtual CString toXML() const
			{
				XmlUtils::CAttribute oAttr;
				oAttr.Write(_T("name"), name);
				oAttr.WriteLimitNullable(_T("type"), type);

				XmlUtils::CNodeValue oValue;
				oValue.WriteArray(Effects);

				return XmlUtils::CreateNode(m_name, oAttr, oValue);
			}

			virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
			{
				pWriter->StartRecord(EFFECT_TYPE_DAG);

				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeStart);
				pWriter->WriteString2(0, name);
				pWriter->WriteLimit2(1, type);
				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeEnd);

				pWriter->StartRecord(0);
				ULONG len = (ULONG)Effects.GetCount();
				pWriter->WriteULONG(len);
				
				for (ULONG i = 0; i < len; ++i)
				{
					pWriter->WriteRecord1(1, Effects[i]);
				}

				pWriter->EndRecord();

				pWriter->EndRecord();
			}

		public:
			CAtlArray<UniEffect>						Effects;
			nullable_string								name;
			nullable_limit<Limit::EffectContainerType>	type;
			CString										m_name;
		protected:
			virtual void FillParentPointersForChilds()
			{
				size_t count = Effects.GetCount();
				for(size_t i = 0; i < count; ++i)
					Effects[i].SetParentPointer(this);
			}
		};
	} 
} 

#endif // PPTX_LOGIC_EFFECTDAG_INCLUDE_H_