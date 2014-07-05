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
#ifndef PPTX_LOGIC_PARAGRAPH_INCLUDE_H_
#define PPTX_LOGIC_PARAGRAPH_INCLUDE_H_

#include "./../WrapperWritingElement.h"
#include "TextParagraphPr.h"
#include "RunProperties.h"
#include "RunElem.h"

namespace PPTX
{
	namespace Logic
	{
		class Paragraph : public WrapperWritingElement
		{
		public:
			PPTX_LOGIC_BASE(Paragraph)

			Paragraph& operator=(const Paragraph& oSrc)
			{
				parentFile		= oSrc.parentFile;
				parentElement	= oSrc.parentElement;

				pPr			= oSrc.pPr;
				endParaRPr	= oSrc.endParaRPr;
				RunElems.Copy(oSrc.RunElems);

				return *this;
			}

		public:
			virtual void fromXML(XmlUtils::CXmlNode& node)
			{
				RunElems.RemoveAll();

				XmlUtils::CXmlNodes oNodes;
				if (node.GetNodes(_T("*"), oNodes))
				{
					int nCount = oNodes.GetCount();
					for (int i = 0; i < nCount; ++i)
					{
						XmlUtils::CXmlNode oNode;
						oNodes.GetAt(i, oNode);

						CString strName = XmlUtils::GetNameNoNS(oNode.GetName());

						if (_T("pPr") == strName)
							pPr = oNode;
						else if (_T("endParaRPr") == strName)
							endParaRPr = oNode;
						else if ((_T("r") == strName) || (_T("fld") == strName) || (_T("br") == strName))
							RunElems.Add(RunElem(oNode));
					}
				}
				
				FillParentPointersForChilds();
			}
			virtual CString toXML() const
			{
				XmlUtils::CNodeValue oValue;
				oValue.WriteNullable(pPr);
				oValue.WriteArray(RunElems);
				oValue.WriteNullable(endParaRPr);

				return XmlUtils::CreateNode(_T("a:p"), oValue);
			}

			virtual void toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const
			{
				pWriter->StartNode(_T("a:p"));
				pWriter->EndAttributes();

				if (pPr.is_init())
					pPr->m_name = _T("a:pPr");
				pWriter->Write(pPr);

				size_t nCount = RunElems.GetCount();
				for (size_t i = 0; i < nCount; ++i)
					RunElems[i].toXmlWriter(pWriter);

				pWriter->Write(endParaRPr);						
				
				pWriter->EndNode(_T("a:p"));
			}


			virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
			{
				pWriter->WriteRecord2(0, pPr);
				pWriter->WriteRecord2(1, endParaRPr);
				pWriter->WriteRecordArray(2, 0, RunElems);
			}

			virtual void fromPPTY(NSBinPptxRW::CBinaryFileReader* pReader)
			{
				LONG _end_rec = pReader->GetPos() + pReader->GetLong() + 4;

				while (pReader->GetPos() < _end_rec)
				{
					BYTE _at = pReader->GetUChar();
					switch (_at)
					{
						case 0:
						{
							pPr = new Logic::TextParagraphPr();
							pPr->fromPPTY(pReader);
							break;
						}
						case 1:
						{
							endParaRPr = new Logic::RunProperties();
							endParaRPr->m_name = _T("a:endParaRPr");
							endParaRPr->fromPPTY(pReader);
							break;
						}
						case 2:
						{
							pReader->Skip(4);

							ULONG _c = pReader->GetULong();
							for (ULONG i = 0; i < _c; ++i)
							{
								pReader->Skip(5); 
								BYTE _type = pReader->GetUChar();

								switch (_type)
								{
									case PARRUN_TYPE_RUN:
									{
										LONG _end = pReader->GetPos() + pReader->GetLong() + 4;

										pReader->Skip(1); 

										Logic::Run* pRun = new Logic::Run();
										
										while (true)
										{
											BYTE _at2 = pReader->GetUChar();
											if (_at2 == NSBinPptxRW::g_nodeAttributeEnd)
												break;

											if (0 == _at2)
												pRun->SetText(pReader->GetString2());
										}

										while (pReader->GetPos() < _end)
										{
											BYTE _rec = pReader->GetUChar();

											if (0 == _rec)
											{
												pRun->rPr = new Logic::RunProperties();
												pRun->rPr->m_name = _T("a:rPr");
												pRun->rPr->fromPPTY(pReader);
											}
											else
												pReader->SkipRecord();
										}

										RunElems.Add();
										RunElems[RunElems.GetCount() - 1].InitRun(pRun);

										pReader->Seek(_end);
										break;
									}
									case PARRUN_TYPE_FLD:
									{
										LONG _end = pReader->GetPos() + pReader->GetLong() + 4;

										pReader->Skip(1); 

										Logic::Fld* pRun = new Logic::Fld();
										
										while (true)
										{
											BYTE _at2 = pReader->GetUChar();
											if (_at2 == NSBinPptxRW::g_nodeAttributeEnd)
												break;

											if (0 == _at2)
												pRun->id = pReader->GetString2();
											else if (1 == _at2)
												pRun->type = pReader->GetString2();
											else if (2 == _at2)
												pRun->SetText(pReader->GetString2());
										}

										while (pReader->GetPos() < _end)
										{
											BYTE _rec = pReader->GetUChar();

											if (0 == _rec)
											{
												pRun->rPr = new Logic::RunProperties();
												pRun->rPr->m_name = _T("a:rPr");
												pRun->rPr->fromPPTY(pReader);
											}
											else if (1 == _rec)
											{												
												pRun->pPr = new Logic::TextParagraphPr();
												pRun->pPr->m_name = _T("a:pPr");
												pRun->pPr->fromPPTY(pReader);
											}
											else
												pReader->SkipRecord();
										}

										RunElems.Add();
										RunElems[RunElems.GetCount() - 1].InitRun(pRun);

										pReader->Seek(_end);
										break;
									}
									case PARRUN_TYPE_BR:
									{
										LONG _end = pReader->GetPos() + pReader->GetLong() + 4;

										Logic::Br* pRun = new Logic::Br();
										while (pReader->GetPos() < _end)
										{
											BYTE _rec = pReader->GetUChar();

											if (0 == _rec)
											{
												pRun->rPr = new Logic::RunProperties();
												pRun->rPr->m_name = _T("a:rPr");
												pRun->rPr->fromPPTY(pReader);
											}
											else
												pReader->SkipRecord();
										}

										RunElems.Add();
										RunElems[RunElems.GetCount() - 1].InitRun(pRun);

										pReader->Seek(_end);
										break;
									}
									default:
										break;
								}
							}
							break;
						}
						default:
						{
							break;
						}
					}
				}
				pReader->Seek(_end_rec);
			}

			CString GetText()const
			{
				CString result = _T("");
				
				size_t count = RunElems.GetCount();
				for (size_t i = 0; i < count; ++i)
					result += RunElems[i].GetText();
				
				result = result + _T("\n");
				return result;
			}

		public:
			nullable<TextParagraphPr>	pPr;
			CAtlArray<RunElem>			RunElems;
			nullable<RunProperties>		endParaRPr;
		protected:
			virtual void FillParentPointersForChilds()
			{
				if(pPr.IsInit())
					pPr->SetParentPointer(this);
				if(endParaRPr.IsInit())
					endParaRPr->SetParentPointer(this);

				size_t count = RunElems.GetCount();
				for (size_t i = 0; i < count; ++i)
					RunElems[i].SetParentPointer(this);
			}
		};
	} 
} 

#endif // PPTX_LOGIC_PARAGRAPH_INCLUDE_H