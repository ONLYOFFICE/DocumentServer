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
#ifndef PPTX_LOGIC_RUNPROPERTIES_INCLUDE_H_
#define PPTX_LOGIC_RUNPROPERTIES_INCLUDE_H_

#include "./../WrapperWritingElement.h"
#include "./../Limit/TextCaps.h"
#include "./../Limit/TextStrike.h"
#include "./../Limit/TextUnderline.h"
#include "Ln.h"
#include "UniFill.h"
#include "TextFont.h"
#include "EffectProperties.h"
#include "Hyperlink.h"

namespace PPTX
{
	namespace Logic
	{
		class RunProperties : public WrapperWritingElement
		{
		public:
			PPTX_LOGIC_BASE(RunProperties)

		public:
			virtual void fromXML(XmlUtils::CXmlNode& node)
			{
				m_name = node.GetName();

				node.ReadAttributeBase(L"altLang", altLang);
				node.ReadAttributeBase(L"b", b);
				node.ReadAttributeBase(L"bmk", bmk);
				node.ReadAttributeBase(L"cap", cap);
				node.ReadAttributeBase(L"dirty", dirty);
				node.ReadAttributeBase(L"err", err);
				node.ReadAttributeBase(L"i", i);
				node.ReadAttributeBase(L"kern", kern);
				node.ReadAttributeBase(L"kumimoji", kumimoji);
				node.ReadAttributeBase(L"lang", lang);
				node.ReadAttributeBase(L"noProof", noProof);
				node.ReadAttributeBase(L"normalizeH", normalizeH);
				node.ReadAttributeBase(L"smtClean", smtClean);
				node.ReadAttributeBase(L"smtId", altLang);
				node.ReadAttributeBase(L"strike", strike);
				node.ReadAttributeBase(L"sz", sz);
				node.ReadAttributeBase(L"u", u);
				node.ReadAttributeBase(L"baseline", baseline);
				node.ReadAttributeBase(L"spc", spc);

				XmlUtils::CXmlNodes oNodes;
				if (node.GetNodes(_T("*"), oNodes))
				{
					int nCount = oNodes.GetCount();
					for (int i = 0; i < nCount; ++i)
					{
						XmlUtils::CXmlNode oNode;
						oNodes.GetAt(i, oNode);

						CString strName = XmlUtils::GetNameNoNS(oNode.GetName());

						if (_T("ln") == strName)
							ln = oNode;
						else if (_T("latin") == strName)
							latin = oNode;
						else if (_T("ea") == strName)
							ea = oNode;
						else if (_T("cs") == strName)
							cs = oNode;
						else if (_T("sym") == strName)
							sym = oNode;
						else if (_T("hlinkClick") == strName)
							hlinkClick = oNode;
						else if (_T("hlinkMouseOver") == strName)
							hlinkMouseOver = oNode;
					}
				}

				Fill.GetFillFrom(node);
				EffectList.GetEffectListFrom(node);

				Normalize();
				
				FillParentPointersForChilds();
			}
			virtual CString toXML() const
			{
				XmlUtils::CAttribute oAttr;
				oAttr.Write(_T("kumimoji"), kumimoji);
				oAttr.Write(_T("lang"), lang);
				oAttr.Write(_T("altLang"), altLang);
				oAttr.Write(_T("sz"), sz);
				oAttr.Write(_T("b"), b);
				oAttr.Write(_T("i"), i);
				oAttr.WriteLimitNullable(_T("u"), u);
				oAttr.WriteLimitNullable(_T("strike"), strike);
				oAttr.Write(_T("kern"), kern);
				oAttr.WriteLimitNullable(_T("cap"), cap);
				oAttr.Write(_T("spc"), spc);
				oAttr.Write(_T("normalizeH"), normalizeH);
				oAttr.Write(_T("baseline"), baseline);
				oAttr.Write(_T("noProof"), noProof);
				oAttr.Write(_T("dirty"), dirty);
				oAttr.Write(_T("err"), err);
				oAttr.Write(_T("smtClean"), smtClean);
				oAttr.Write(_T("smtId"), smtId);
				oAttr.Write(_T("bmk"), bmk);

				XmlUtils::CNodeValue oValue;
				oValue.WriteNullable(ln);
				oValue.Write(Fill);
				oValue.Write(EffectList);
				oValue.WriteNullable(latin);
				oValue.WriteNullable(ea);
				oValue.WriteNullable(cs);
				oValue.WriteNullable(sym);
				oValue.WriteNullable(hlinkClick);
				oValue.WriteNullable(hlinkMouseOver);

				return XmlUtils::CreateNode(m_name, oAttr, oValue);
			}

			virtual void toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const
			{
				pWriter->StartNode(m_name);

				pWriter->StartAttributes();

				pWriter->WriteAttribute(_T("kumimoji"), kumimoji);
				pWriter->WriteAttribute(_T("lang"), lang);
				pWriter->WriteAttribute(_T("altLang"), altLang);
				pWriter->WriteAttribute(_T("sz"), sz);
				pWriter->WriteAttribute(_T("b"), b);
				pWriter->WriteAttribute(_T("i"), i);
				pWriter->WriteAttribute(_T("u"), u);
				pWriter->WriteAttribute(_T("strike"), strike);
				pWriter->WriteAttribute(_T("kern"), kern);
				pWriter->WriteAttribute(_T("cap"), cap);
				pWriter->WriteAttribute(_T("spc"), spc);
				pWriter->WriteAttribute(_T("normalizeH"), normalizeH);
				pWriter->WriteAttribute(_T("baseline"), baseline);
				pWriter->WriteAttribute(_T("noProof"), noProof);
				pWriter->WriteAttribute(_T("dirty"), dirty);
				pWriter->WriteAttribute(_T("err"), err);
				pWriter->WriteAttribute(_T("smtClean"), smtClean);
				pWriter->WriteAttribute(_T("smtId"), smtId);
				pWriter->WriteAttribute(_T("bmk"), bmk);

				pWriter->EndAttributes();

				pWriter->Write(ln);
				Fill.toXmlWriter(pWriter);
				EffectList.toXmlWriter(pWriter);
				pWriter->Write(latin);
				pWriter->Write(ea);
				pWriter->Write(cs);
				pWriter->Write(sym);
				pWriter->Write(hlinkClick);
				pWriter->Write(hlinkMouseOver);

				pWriter->EndNode(m_name);
			}


			void Merge(nullable<RunProperties>& props)const
			{
				if(!props.is_init())
					props = new RunProperties();

				if(ln.is_init())
					ln->Merge(props->ln);
				if(Fill.is_init())
					props->Fill = Fill;
	
				
				
				
				
				

				if(latin.is_init())	latin->Merge(props->latin);
				if(ea.is_init())	ea->Merge(props->ea);
				if(cs.is_init())	cs->Merge(props->cs);
				if(sym.is_init())	sym->Merge(props->sym);
	
				
				if(altLang.is_init()) props->altLang = *altLang;
				if(b.is_init()) props->b = *b;
				if(baseline.is_init()) props->baseline = *baseline;
				if(bmk.is_init()) props->bmk = *bmk;
				if(cap.is_init()) props->cap = *cap;
				if(dirty.is_init()) props->dirty = *dirty;
				if(err.is_init()) props->err = *err;
				if(i.is_init()) props->i = *i;
				if(kern.is_init()) props->kern = *kern;
				if(kumimoji.is_init()) props->kumimoji = *kumimoji;
				if(lang.is_init()) props->lang = *lang;
				if(noProof.is_init()) props->noProof = *noProof;
				if(normalizeH.is_init()) props->normalizeH = *normalizeH;
				if(smtClean.is_init()) props->smtClean = *smtClean;
				if(smtId.is_init()) props->smtId = *smtId;
				if(spc.is_init()) props->spc = *spc;
				if(strike.is_init()) props->strike = *strike;
				if(sz.is_init()) props->sz = *sz;
				if(u.is_init()) props->u = *u;
			}

			virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
			{
				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeStart);

				pWriter->WriteString2(0, altLang);
				pWriter->WriteBool2(1, b);
				pWriter->WriteInt2(2, baseline);
				pWriter->WriteString2(3, bmk);
				pWriter->WriteLimit2(4, cap);
				pWriter->WriteBool2(5, dirty);
				pWriter->WriteBool2(6, err);
				pWriter->WriteBool2(7, i);
				pWriter->WriteInt2(8, kern);
				pWriter->WriteBool2(9, kumimoji);
				pWriter->WriteString2(10, lang);
				pWriter->WriteBool2(11, noProof);
				pWriter->WriteBool2(12, normalizeH);
				pWriter->WriteBool2(13, smtClean);
				pWriter->WriteInt2(14, smtId);
				pWriter->WriteInt2(15, spc);
				pWriter->WriteLimit2(16, strike);
				pWriter->WriteInt2(17, sz);
				pWriter->WriteLimit2(18, u);

				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeEnd);

				pWriter->WriteRecord2(0, ln);
				pWriter->WriteRecord1(1, Fill);
				pWriter->WriteRecord1(2, EffectList);

				pWriter->WriteRecord2(3, latin);
				pWriter->WriteRecord2(4, ea);
				pWriter->WriteRecord2(5, cs);
				pWriter->WriteRecord2(6, sym);

				pWriter->WriteRecord2(7, hlinkClick);
				pWriter->WriteRecord2(8, hlinkMouseOver);
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
							altLang = pReader->GetString2();
							break;
						}
						case 1:
						{
							b = pReader->GetBool();
							break;
						}
						case 2:
						{
							baseline = pReader->GetLong();
							break;
						}
						case 3:
						{
							bmk = pReader->GetString2();
							break;
						}
						case 4:
						{
							cap = new Limit::TextCaps();
							cap->SetBYTECode(pReader->GetUChar());
							break;
						}
						case 5:
						{
							dirty = pReader->GetBool();
							break;
						}
						case 6:
						{
							err = pReader->GetBool();
							break;
						}
						case 7:
						{
							i = pReader->GetBool();
							break;
						}
						case 8:
						{
							kern = pReader->GetLong();
							break;
						}
						case 9:
						{
							kumimoji = pReader->GetBool();
							break;
						}
						case 10:
						{
							lang = pReader->GetString2();
							break;
						}
						case 11:
						{
							noProof = pReader->GetBool(); 
							break;
						}
						case 12:
						{
							normalizeH = pReader->GetBool();
							break;
						}
						case 13:
						{
							smtClean = pReader->GetBool();
							break;
						}
						case 14:
						{
							smtId = pReader->GetLong();
							break;
						}
						case 15:
						{
							spc = pReader->GetLong();
							break;
						}
						case 16:
						{
							strike = new Limit::TextStrike();
							strike->SetBYTECode(pReader->GetUChar());
							break;
						}
						case 17:
						{
							sz = pReader->GetLong();
							break;
						}
						case 18:
						{
							u = new Limit::TextUnderline();
							u->SetBYTECode(pReader->GetUChar());
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
							ln = new Logic::Ln();
							ln->fromPPTY(pReader);
							break;
						}
						case 1:
						{
							Fill.fromPPTY(pReader);
							break;
						}
						case 2:
						{
							
							pReader->SkipRecord();
							break;
						}
						case 3:
						{
							latin = new Logic::TextFont();
							latin->m_name = _T("a:latin");
							latin->fromPPTY(pReader);
							break;
						}
						case 4:
						{
							ea = new Logic::TextFont();
							ea->m_name = _T("a:ea");
							ea->fromPPTY(pReader);
							break;
						}
						case 5:
						{
							cs = new Logic::TextFont();
							cs->m_name = _T("a:cs");
							cs->fromPPTY(pReader);
							break;
						}
						case 6:
						{
							sym = new Logic::TextFont();
							sym->m_name = _T("a:sym");
							sym->fromPPTY(pReader);
							break;
						}
						case 7:
						{
							hlinkClick = new Logic::Hyperlink();
							hlinkClick->m_name = _T("hlinkClick");
							hlinkClick->fromPPTY(pReader);
							break;
						}
						case 8:
						{
							
							pReader->SkipRecord();
						}
						default:
						{
							pReader->SkipRecord();
						}
					}
				}

				pReader->Seek(_end_rec);
			}

		public:
			
			nullable<Ln>						ln;
			UniFill								Fill;
			EffectProperties					EffectList;
			
			
			
			
			
			nullable<TextFont>					latin;
			nullable<TextFont>					ea;
			nullable<TextFont>					cs;
			nullable<TextFont>					sym;
			nullable<Hyperlink>					hlinkClick;
			nullable<Hyperlink>					hlinkMouseOver;
			

			
			nullable_string						altLang;
			nullable_bool						b;
			nullable_int						baseline;
			nullable_string						bmk;
			nullable_limit<Limit::TextCaps>		cap;
			nullable_bool						dirty;
			nullable_bool						err;
			nullable_bool						i;
			nullable_int						kern;
			nullable_bool						kumimoji;
			nullable_string						lang;
			nullable_bool						noProof;
			nullable_bool						normalizeH;
			nullable_bool						smtClean;
			nullable_int						smtId;
			nullable_int						spc;
			nullable_limit<Limit::TextStrike>	strike;
			nullable_int						sz;
			nullable_limit<Limit::TextUnderline> u;
		
		public:
			CString m_name;
		protected:
			virtual void FillParentPointersForChilds()
			{
				if(ln.is_init())
					ln->SetParentPointer(this);
				Fill.SetParentPointer(this);
				EffectList.SetParentPointer(this);
				if(latin.is_init())
					latin->SetParentPointer(this);
				if(ea.is_init())
					ea->SetParentPointer(this);
				if(cs.is_init())
					cs->SetParentPointer(this);
				if(sym.is_init())
					sym->SetParentPointer(this);
				if(hlinkClick.is_init())
					hlinkClick->SetParentPointer(this);
				if(hlinkMouseOver.is_init())
					hlinkMouseOver->SetParentPointer(this);
			}

			AVSINLINE void Normalize()
			{
				kern.normalize(0, 400000);
				smtId.normalize_positive();
				spc.normalize(-4000, 4000);
				sz.normalize(10, 400000);
			}

		public:
			PPTX::Logic::UniColor GetColor()const
			{
				if (Fill.is<SolidFill>())
					return Fill.as<SolidFill>().Color;
				if (Fill.is<GradFill>())
					return Fill.as<GradFill>().GetFrontColor();

				UniColor oUniColor;
				return oUniColor;
			}
		};
	} 
} 

#endif // PPTX_LOGIC_RUNPROPERTIES_INCLUDE_H