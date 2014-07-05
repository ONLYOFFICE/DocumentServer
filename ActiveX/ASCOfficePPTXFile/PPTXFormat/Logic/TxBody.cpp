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
#include "stdafx.h"
#include "./TxBody.h"
#include "../Theme.h"
#include "./ClrMap.h"

namespace PPTX
{
	namespace Logic
	{
		CString TxBody::GetDocxTxBoxContent(NSBinPptxRW::CBinaryFileWriter* pWriter, const nullable<ShapeStyle>& shape_style)
		{
			CString strXml = _T("<w:txbxContent ");

			strXml += _T("\
	xmlns:wpc=\"http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas\" \
	xmlns:mc=\"http://schemas.openxmlformats.org/markup-compatibility/2006\" \
	xmlns:o=\"urn:schemas-microsoft-com:office:office\" \
	xmlns:r=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships\" \
	xmlns:m=\"http://schemas.openxmlformats.org/officeDocument/2006/math\" \
	xmlns:v=\"urn:schemas-microsoft-com:vml\" \
	xmlns:ve=\"http://schemas.openxmlformats.org/markup-compatibility/2006\" \
	xmlns:w=\"http://schemas.openxmlformats.org/wordprocessingml/2006/main\" \
	xmlns:wp=\"http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing\" \
	xmlns:wp14=\"http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing\" \
	xmlns:w10=\"urn:schemas-microsoft-com:office:word\" \
	xmlns:w14=\"http://schemas.microsoft.com/office/word/2010/wordml\" \
	xmlns:w15=\"http://schemas.microsoft.com/office/word/2012/wordml\" \
	xmlns:wpg=\"http://schemas.microsoft.com/office/word/2010/wordprocessingGroup\" \
	xmlns:wpi=\"http://schemas.microsoft.com/office/word/2010/wordprocessingInk\" \
	xmlns:wne=\"http://schemas.microsoft.com/office/word/2006/wordml\" \
	xmlns:wps=\"http://schemas.microsoft.com/office/word/2010/wordprocessingShape\" \
	xmlns:a=\"http://schemas.openxmlformats.org/drawingml/2006/main\" \
	xmlns:a14=\"http://schemas.microsoft.com/office/drawing/2010/main\" \
	xmlns:pic=\"http://schemas.openxmlformats.org/drawingml/2006/picture\"");

			strXml += _T(">");
			
			smart_ptr<PPTX::WrapperFile> pTheme				= pWriter->ThemeDoc.smart_dynamic_cast<PPTX::WrapperFile>();
			smart_ptr<PPTX::WrapperWritingElement> pClrMap	= pWriter->ClrMapDoc.smart_dynamic_cast<PPTX::WrapperWritingElement>();

			CString sThemeFont = _T("");
			
			DWORD dwColor = 0;
			if (shape_style.is_init() && shape_style->fontRef.idx.is_init())
			{
				if (shape_style->fontRef.idx->get() == _T("major"))
					sThemeFont = _T("+mj-lt");
				else
					sThemeFont = _T("+mn-lt");
			}

			NSBinPptxRW::CXmlWriter oWriter;

			oWriter.WriteString(strXml);

			double dKoef = 635; 

			size_t nCount = Paragrs.GetCount();
			for (size_t i = 0; i < nCount; ++i)
			{
				PPTX::Logic::Paragraph& oPar = Paragrs[i];

				oWriter.StartNode(_T("w:p"));
				oWriter.StartAttributes();
				oWriter.EndAttributes();

				nullable<PPTX::Logic::RunProperties> pRunProps;
				pRunProps = new PPTX::Logic::RunProperties();

				if (oPar.pPr.is_init())
				{
					nullable<PPTX::Logic::TextParagraphPr> pPr;
					pPr = new PPTX::Logic::TextParagraphPr();
					
					if (oPar.pPr->lvl.is_init() && lstStyle.is_init())
					{
						int nLvl = *oPar.pPr->lvl;
						if (nLvl >= 0 && nLvl < 10)
						{
							if (lstStyle->levels[nLvl].is_init())
							{
								lstStyle->levels[nLvl]->Merge(pPr);

								if (lstStyle->levels[nLvl]->defRPr.is_init())
									lstStyle->levels[nLvl]->defRPr->Merge(pRunProps);
							}
						}
					}
					oPar.pPr->Merge(pPr);

					if (pPr->indent.is_init() || pPr->marL.is_init() || pPr->marR.is_init())
					{
						oWriter.StartNode(_T("w:ind"));
						oWriter.StartAttributes();
						if (oPar.pPr->marL.is_init())
							oWriter.WriteAttribute(_T("w:left"), (int)((double)(*pPr->marL) / 635));
						if (oPar.pPr->marR.is_init())
							oWriter.WriteAttribute(_T("w:right"), (int)((double)(*pPr->marR) / 635));
						if (oPar.pPr->indent.is_init())
							oWriter.WriteAttribute(_T("w:firstLine"), (int)((double)(*pPr->indent) / 635));
						oWriter.EndAttributes();
						oWriter.EndNode(_T("w:ind"));
					}

					if (TRUE)
					{
						oWriter.WriteString(_T("<w:spacing w:before=\"0\" w:after=\"0\" />"));
					}

					if (pPr->algn.is_init())
					{
						LONG _code = pPr->algn->GetBYTECode();

						oWriter.StartNode(_T("w:jc"));
						switch (_code)
						{
						case 0:
							
							oWriter.WriteAttribute(_T("w:val"), (CString)_T("center"));
							break;
						case 2:
						case 3:
							
							oWriter.WriteAttribute(_T("w:val"), (CString)_T("both"));
							break;
						case 5:
							
							oWriter.WriteAttribute(_T("w:val"), (CString)_T("right"));
							break;
						default:
							oWriter.WriteAttribute(_T("w:val"), (CString)_T("left"));
							break;
						}

						oWriter.EndAttributes();
						oWriter.EndNode(_T("w:jc"));
					}

					if (pPr->fontAlgn.is_init())
					{
						BYTE nFA = pPr->fontAlgn->GetBYTECode();

						oWriter.StartNode(_T("w:textAlignment"));
						switch (nFA)
						{
						case 0: 
							oWriter.WriteAttribute(_T("w:val"), (CString)_T("auto")); 
							break;
						case 1: 
							oWriter.WriteAttribute(_T("w:val"), (CString)_T("bottom")); 
							break;
						case 2: 
							oWriter.WriteAttribute(_T("w:val"), (CString)_T("baseline")); 
							break;
						case 3: 
							oWriter.WriteAttribute(_T("w:val"), (CString)_T("center")); 
							break;
						case 4: 
							oWriter.WriteAttribute(_T("w:val"), (CString)_T("top")); 
							break;
						default:
							oWriter.WriteAttribute(_T("w:val"), (CString)_T("baseline")); 
							break;
						}

						oWriter.EndAttributes();
						oWriter.EndNode(_T("w:textAlignment"));
					}
				}

				size_t nCountRuns = oPar.RunElems.GetCount();
				for (size_t j = 0; j < nCountRuns; ++j)
				{
					if (oPar.RunElems[j].is<PPTX::Logic::Run>())
					{
						PPTX::Logic::Run& oRun = oPar.RunElems[j].as<PPTX::Logic::Run>();

						nullable<PPTX::Logic::RunProperties> pRPr;
						pRPr = new PPTX::Logic::RunProperties();
						
						if (_T("") != sThemeFont)
						{
							pRPr->latin = new PPTX::Logic::TextFont();
							pRPr->latin->typeface = sThemeFont;

							pRPr->ea = new PPTX::Logic::TextFont();
							pRPr->ea->typeface = sThemeFont;

							pRPr->cs = new PPTX::Logic::TextFont();
							pRPr->cs->typeface = sThemeFont;

							pRPr->sym = new PPTX::Logic::TextFont();
							pRPr->sym->typeface = sThemeFont;
						}

						pRunProps->Merge(pRPr);

						if (oRun.rPr.is_init())
							oRun.rPr->Merge(pRPr);

						bool bIsWriteColor = false;
						DWORD dwColor = 0;

						if (pRPr->Fill.is_init() && pRPr->Fill.is<PPTX::Logic::SolidFill>())
						{
							PPTX::Logic::SolidFill& oFill = pRPr->Fill.as<PPTX::Logic::SolidFill>();

							if (oFill.Color.is_init())
							{
								bIsWriteColor = true;
								dwColor = oFill.Color.GetRGBColor(pTheme, pClrMap, 0);
							}
						}
						else if (shape_style.is_init() && shape_style->fontRef.Color.is_init())
						{
							bIsWriteColor = true;
							dwColor = shape_style->fontRef.Color.GetRGBColor(pTheme, pClrMap, 0);
						}

						oWriter.StartNode(_T("w:r"));
						oWriter.EndAttributes();

						
						oWriter.StartNode(_T("w:rPr"));
						oWriter.EndAttributes();

						if (pRPr->latin.is_init() || pRPr->ea.is_init() || pRPr->cs.is_init())
						{
							oWriter.StartNode(_T("w:rFonts"));

							if (pRPr->latin.is_init())
							{
								CString sPick = pWriter->m_oCommon.m_pNativePicker->GetTypefacePick(pRPr->latin.get2());

								if (sPick == _T("minor") || sPick == _T("+mn-lt"))
								{
									oWriter.WriteAttribute(_T("w:asciiTheme"), (CString)_T("minorHAnsi"));
									oWriter.WriteAttribute(_T("w:hAnsiTheme"), (CString)_T("minorHAnsi"));
								}
								else if (sPick == _T("major") || sPick == _T("+mj-lt"))
								{
									oWriter.WriteAttribute(_T("w:asciiTheme"), (CString)_T("majorHAnsi"));
									oWriter.WriteAttribute(_T("w:hAnsiTheme"), (CString)_T("majorHAnsi"));
								}
								else
								{
									oWriter.WriteAttribute(_T("w:ascii"), sPick);
									oWriter.WriteAttribute(_T("w:hAnsi"), sPick);
								}
							}
							if (pRPr->ea.is_init())
							{
								CString sPick = pWriter->m_oCommon.m_pNativePicker->GetTypefacePick(pRPr->ea.get2());

								if (sPick == _T("minor") || sPick == _T("+mn-lt"))
								{
									oWriter.WriteAttribute(_T("w:eastAsiaTheme"), (CString)_T("minorEastAsia"));
								}
								else if (sPick == _T("major") || sPick == _T("+mj-lt"))
								{
									oWriter.WriteAttribute(_T("w:eastAsiaTheme"), (CString)_T("majorEastAsia"));
								}
								else
								{
									oWriter.WriteAttribute(_T("w:eastAsia"), sPick);
								}
							}
							if (pRPr->cs.is_init())
							{
								CString sPick = pWriter->m_oCommon.m_pNativePicker->GetTypefacePick(pRPr->cs.get2());

								if (sPick == _T("minor") || sPick == _T("+mn-lt"))
								{
									oWriter.WriteAttribute(_T("w:cstheme"), (CString)_T("minorBidi"));
								}
								else if (sPick == _T("major") || sPick == _T("+mj-lt"))
								{
									oWriter.WriteAttribute(_T("w:cstheme"), (CString)_T("majorBidi"));
								}
								else
								{
									oWriter.WriteAttribute(_T("w:cs"), sPick);
								}
							}
							
							oWriter.WriteNodeEnd(_T("w:rFonts"), TRUE, TRUE);
						}

						if (bIsWriteColor)
						{
							BYTE _r = (BYTE)((dwColor >> 16) & 0xFF);
							BYTE _g = (BYTE)((dwColor >> 8) & 0xFF);
							BYTE _b = (BYTE)((dwColor) & 0xFF);
							CString sHex = _T("");
							sHex.Format(_T("<w:color w:val=\"%02X%02X%02X\" />"), _r, _g, _b);
							oWriter.WriteString(sHex);
						}

						if (pRPr->b.get_value_or(false))
							oWriter.WriteString(_T("<w:b/>"));

						if (pRPr->i.get_value_or(false))
							oWriter.WriteString(_T("<w:i/>"));

						if (pRPr->strike.is_init())
						{
							BYTE lType = pRPr->strike->GetBYTECode();
							if (0 == lType)
								oWriter.WriteString(_T("<w:dstrike/>"));
							else if (2 == lType)
								oWriter.WriteString(_T("<w:strike/>"));
						}

						if (pRPr->sz.is_init())
						{
							double dSize = (double)pRPr->sz.get();
							dSize /= 100;
							int nSize = (int)(dSize * 2);
							
							CString strFS = _T("");
							strFS.Format(_T("<w:sz w:val=\"%d\"/><w:szCs w:val=\"%d\"/>"), nSize, nSize);
							oWriter.WriteString(strFS);
						}
						
						if (pRPr->u.is_init())
						{
							BYTE lType = pRPr->u->GetBYTECode();
							if (12 != lType)
								oWriter.WriteString(_T("<w:u w:val=\"single\"/>"));							
						}

						oWriter.EndNode(_T("w:rPr"));

						oWriter.StartNode(_T("w:t"));
						oWriter.StartAttributes();
						oWriter.WriteAttribute(_T("xml:space"), (CString)_T("preserve"));
						oWriter.EndAttributes();
						oWriter.WriteString(oRun.GetText());
						oWriter.EndNode(_T("w:t"));

						oWriter.EndNode(_T("w:r"));
					}
				}

				oWriter.EndNode(_T("w:p"));
			}

			oWriter.WriteString(_T("</w:txbxContent>"));

			return oWriter.GetXmlString();
		}
	} 
} 

