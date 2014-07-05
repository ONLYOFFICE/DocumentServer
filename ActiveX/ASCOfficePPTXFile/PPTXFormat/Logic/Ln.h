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
#ifndef PPTX_LOGIC_LN_INCLUDE_H_
#define PPTX_LOGIC_LN_INCLUDE_H_

#include "./../WrapperWritingElement.h"
#include "./../Limit/PenAlign.h"
#include "./../Limit/LineCap.h"
#include "./../Limit/CompoundLine.h"
#include "UniFill.h"
#include "PrstDash.h"
#include "LineEnd.h"
#include "LineJoin.h"

namespace PPTX
{
	namespace Logic
	{
		class Ln : public WrapperWritingElement
		{
		public:
			PPTX_LOGIC_BASE(Ln)

		public:
			virtual void fromXML(XmlUtils::CXmlNode& node)
			{
				m_name = _T("a:ln");

				node.ReadAttributeBase(L"algn", algn);
				node.ReadAttributeBase(L"cap", cap);
				node.ReadAttributeBase(L"cmpd", cmpd);
				node.ReadAttributeBase(L"w", w);

				Fill.GetFillFrom(node);
				prstDash	= node.ReadNode(_T("a:prstDash"));
				Join.GetJoinFrom(node);
				headEnd		= node.ReadNode(_T("a:headEnd"));
				tailEnd		= node.ReadNode(_T("a:tailEnd"));

				Normalize();
				
				FillParentPointersForChilds();
			}
			virtual CString toXML() const
			{
				XmlUtils::CAttribute oAttr;
				oAttr.Write(_T("w"), w);
				oAttr.WriteLimitNullable(_T("cap"), cap);
				oAttr.WriteLimitNullable(_T("cmpd"), cmpd);
				oAttr.WriteLimitNullable(_T("algn"), algn);

				XmlUtils::CNodeValue oValue;
				oValue.Write(Fill);
				oValue.WriteNullable(prstDash);
				oValue.Write(Join);
				oValue.WriteNullable(headEnd);
				oValue.WriteNullable(tailEnd);

				return XmlUtils::CreateNode(_T("a:ln"), oAttr, oValue);
			}

			virtual void toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const
			{
				CString _name = m_name;
				if (_name == _T(""))
					_name = _T("a:ln");

				pWriter->StartNode(_name);			

				pWriter->StartAttributes();
				pWriter->WriteAttribute(_T("w"), w);
				pWriter->WriteAttribute(_T("cap"), cap);
				pWriter->WriteAttribute(_T("cmpd"), cmpd);
				pWriter->WriteAttribute(_T("algn"), algn);
				pWriter->EndAttributes();

				Fill.toXmlWriter(pWriter);
				pWriter->Write(prstDash);
				Join.toXmlWriter(pWriter);
				pWriter->Write(headEnd);
				pWriter->Write(tailEnd);

				pWriter->EndNode(_name);
			}

			virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
			{
				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeStart);
				pWriter->WriteLimit2(0, algn);
				pWriter->WriteLimit2(1, cap);
				pWriter->WriteLimit2(2, cmpd);
				pWriter->WriteInt2(3, w);
				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeEnd);

				pWriter->WriteRecord1(0, Fill);
				pWriter->WriteRecord2(1, prstDash);
				pWriter->WriteRecord1(2, Join);
				pWriter->WriteRecord2(3, headEnd);
				pWriter->WriteRecord2(4, tailEnd);
			}

			virtual void fromPPTY(NSBinPptxRW::CBinaryFileReader* pReader)
			{
				m_name = _T("a:ln");

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
							algn = new Limit::PenAlign();
							algn->SetBYTECode(pReader->GetUChar());
							break;
						}
						case 1:
						{
							cap = new Limit::LineCap();
							cap->SetBYTECode(pReader->GetUChar());
							break;
						}
						case 2:
						{
							cmpd = new Limit::CompoundLine();
							cmpd->SetBYTECode(pReader->GetUChar());
							break;
						}
						case 3:
						{
							w = pReader->GetLong();
							break;
						}
						default:
							break;
					}
				}

				while (pReader->GetPos() < _end_rec)
				{
					BYTE _at = pReader->GetUChar();
					switch (_at)
					{
						case 0:
						{
							Fill.fromPPTY(pReader);
							break;
						}
						case 1:
						{
							
							pReader->SkipRecord();
							break;
						}
						case 2:
						{
							Join.fromPPTY(pReader);
							break;
						}
						case 3:
						{
							headEnd = new Logic::LineEnd();
							headEnd->m_name = _T("a:headEnd");
							headEnd->fromPPTY(pReader);
							break;
						}
						case 4:
						{
							tailEnd = new Logic::LineEnd();
							tailEnd->m_name = _T("a:tailEnd");
							tailEnd->fromPPTY(pReader);
							break;
						}
						default:
							break;
					}
				}

				pReader->Seek(_end_rec);
			}

			
			virtual void Merge(nullable<Ln>& line)const
			{
				if(!line.IsInit())
					line = Ln();

				if(Fill.is_init())
					line->Fill = Fill;
				if(prstDash.is_init())
					line->prstDash = *prstDash;
				if(Join.is_init())
					line->Join = Join;
				if(headEnd.is_init())
					headEnd->Merge(line->headEnd);
				if(tailEnd.is_init())
					tailEnd->Merge(line->tailEnd);

				if(algn.is_init())
					line->algn = *algn;
				if(cap.is_init())
					line->cap = *cap;
				if(cmpd.is_init())
					line->cmpd = *cmpd;
				if(w.is_init())
					line->w = *w;
			}

			virtual void Merge(Ln& line)const
			{
				if(Fill.is_init())
					line.Fill = Fill;
				if(prstDash.is_init())
					line.prstDash = *prstDash;
				if(Join.is_init())
					line.Join = Join;
				if(headEnd.is_init())
					headEnd->Merge(line.headEnd);
				if(tailEnd.is_init())
					tailEnd->Merge(line.tailEnd);

				if(algn.is_init())
					line.algn = *algn;
				if(cap.is_init())
					line.cap = *cap;
				if(cmpd.is_init())
					line.cmpd = *cmpd;
				if(w.is_init())
					line.w = *w;
			}

		public:
			UniFill						Fill;
			nullable<PrstDash>			prstDash;
			
			LineJoin					Join;
			nullable<LineEnd>			headEnd;
			nullable<LineEnd>			tailEnd;

			nullable_limit<Limit::PenAlign>		algn;
			nullable_limit<Limit::LineCap>		cap;
			nullable_limit<Limit::CompoundLine> cmpd;
			nullable_int						w;

			CString m_name;
		protected:
			virtual void FillParentPointersForChilds()
			{
				Fill.SetParentPointer(this);
				Join.SetParentPointer(this);
				if(prstDash.IsInit())
					prstDash->SetParentPointer(this);
				if(headEnd.IsInit())
					headEnd->SetParentPointer(this);
				if(tailEnd.IsInit())
					tailEnd->SetParentPointer(this);
			}

			AVSINLINE void Normalize()
			{
				w.normalize(0, 20116800);
			}
		};
	} 
} 

#endif // PPTX_LOGIC_LN_INCLUDE_H_