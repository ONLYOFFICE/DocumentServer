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
#ifndef PPTX_LOGIC_LINEEND_INCLUDE_H_
#define PPTX_LOGIC_LINEEND_INCLUDE_H_

#include "./../WrapperWritingElement.h"
#include "./../Limit/LineEndType.h"
#include "./../Limit/LineEndSize.h"

namespace PPTX
{
	namespace Logic
	{
		class LineEnd : public WrapperWritingElement
		{
		public:
			PPTX_LOGIC_BASE(LineEnd)

		public:
			virtual void fromXML(XmlUtils::CXmlNode& node)
			{
				m_name = node.GetName();
				
				node.ReadAttributeBase(L"type", type);
				node.ReadAttributeBase(L"w", w);
				node.ReadAttributeBase(L"len", len);
			}
			virtual CString toXML() const
			{
				XmlUtils::CAttribute oAttr;
				oAttr.WriteLimitNullable(_T("type"), type);
				oAttr.WriteLimitNullable(_T("w"), w);
				oAttr.WriteLimitNullable(_T("len"), len);

				return XmlUtils::CreateNode(m_name, oAttr);
			}

			virtual void toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const
			{
				pWriter->StartNode(m_name);

				pWriter->StartAttributes();
				pWriter->WriteAttribute(_T("type"), type);
				pWriter->WriteAttribute(_T("w"), w);
				pWriter->WriteAttribute(_T("len"), len);
				pWriter->EndAttributes();

				pWriter->EndNode(m_name);
			}

			virtual void Merge(nullable<LineEnd>& line)const
			{
				if(!line.IsInit())
					line = LineEnd();
				if(type.IsInit())
					line->type = *type;
				if(w.IsInit())
					line->w = *w;
				if(len.IsInit())
					line->len = *len;
			}

			virtual void fromPPTY(NSBinPptxRW::CBinaryFileReader* pReader)
			{
				LONG _end_rec = pReader->GetPos() + pReader->GetLong() + 4;
				pReader->Skip(1); 

				while (true)
				{
					BYTE _at = pReader->GetUChar();
					if (_at == NSBinPptxRW::g_nodeAttributeEnd)
						break;

					switch (_at)
					{
						case 0:
						{
							type = new Limit::LineEndType();
							type->SetBYTECode(pReader->GetUChar());
							break;
						}
						case 1:
						{
							w = new Limit::LineEndSize();
							w->SetBYTECode(pReader->GetUChar());
							break;
						}
						case 2:
						{
							len = new Limit::LineEndSize();
							len->SetBYTECode(pReader->GetUChar());
							break;
						}
						default:
							break;
					}
				}

				pReader->Seek(_end_rec);
			}

			virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
			{
				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeStart);
				pWriter->WriteLimit2(0, type);
				pWriter->WriteLimit2(1, w);
				pWriter->WriteLimit2(2, len);
				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeEnd);				
			}

		public:
			nullable_limit<Limit::LineEndType> type;
			nullable_limit<Limit::LineEndSize> w;
			nullable_limit<Limit::LineEndSize> len;
		
		public:
			CString m_name;
		protected:
			virtual void FillParentPointersForChilds(){};
		};
	} 
} 

#endif // PPTX_LOGIC_LINEEND_INCLUDE_H_