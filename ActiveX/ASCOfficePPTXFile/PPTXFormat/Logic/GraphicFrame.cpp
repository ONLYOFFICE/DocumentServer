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
 #include "./stdafx.h"

#include "GraphicFrame.h"
#include "SpTree.h"
#include "..\Slide.h"
#include "..\SlideLayout.h"
#include "..\SlideMaster.h"

#include "../../ASCOfficeDrawingConverter.h"

namespace PPTX
{
	namespace Logic
	{
		GraphicFrame::GraphicFrame()
		{
		}

		GraphicFrame::~GraphicFrame()
		{
		}

		GraphicFrame::GraphicFrame(XmlUtils::CXmlNode& node)
		{
			fromXML(node);
		}

		const GraphicFrame& GraphicFrame::operator =(XmlUtils::CXmlNode& node)
		{
			fromXML(node);
			return *this;
		}

		void GraphicFrame::fromXML(XmlUtils::CXmlNode& node)
		{
			XmlUtils::CXmlNodes oNodes;
			if (node.GetNodes(_T("*"), oNodes))
			{
				int count = oNodes.GetCount();
				for (int i = 0; i < count; ++i)
				{
					XmlUtils::CXmlNode oNode;
					oNodes.GetAt(i, oNode);
					CString strName = XmlUtils::GetNameNoNS(oNode.GetName());

					if (_T("xfrm") == strName)
						xfrm = oNode;
					else if (_T("nvGraphicFramePr") == strName)
						nvGraphicFramePr = oNode;
					
					if (_T("graphic") == strName)
					{
						XmlUtils::CXmlNode oNodeData;
						if (oNode.GetNode(_T("a:graphicData"), oNodeData))
						{
							XmlUtils::CXmlNode oNode1 = oNodeData.ReadNodeNoNS(_T("tbl"));
							if (oNode1.IsValid())
							{
								Table = oNode1;
								return;
							}
							XmlUtils::CXmlNode oNode2 = oNodeData.ReadNodeNoNS(_T("oleObj"));
							if (oNode2.IsValid())
							{
								oNode2.ReadAttributeBase(L"spid", spid);
								return;
							}
							XmlUtils::CXmlNode oNode3 = oNodeData.ReadNodeNoNS(_T("AlternateContent"));
							if (oNode3.IsValid())
							{
								XmlUtils::CXmlNode oNodeC;
								if (oNode3.GetNode(_T("mc:Choice"), oNodeC))
								{
									XmlUtils::CXmlNode oNodeO;
									if (oNodeC.GetNode(_T("p:oleObj"), oNodeO))
									{
										oNodeO.ReadAttributeBase(L"spid", spid);
									}
								}

								XmlUtils::CXmlNode oNodeFallback;
								if (oNode3.GetNode(_T("mc:Fallback"), oNodeFallback))
								{
									XmlUtils::CXmlNode oNodeO;
									if (oNodeFallback.GetNode(_T("p:oleObj"), oNodeO))
									{
										pic = oNodeO.ReadNode(_T("p:pic"));

										if (pic.is_init())
										{
											xfrm.Merge(pic->spPr.xfrm);
										}
									}
								}
							}
							XmlUtils::CXmlNode oNode4 = oNodeData.ReadNode(_T("dgm:relIds"));
							if (oNode4.IsValid())
							{
								smartArt = oNode4;
							}
							XmlUtils::CXmlNode oNode5 = oNodeData.ReadNode(_T("c:chart"));
							if (oNode5.IsValid())
							{
								chartRec = oNode5;
							}
						}
					}
				}
			}
			
			FillParentPointersForChilds();
		}

		void GraphicFrame::toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const
		{
			CString strNS = _T("");
			if (pWriter->m_lDocType == XMLWRITER_DOC_TYPE_DOCX && pWriter->m_lGroupIndex >= 0)
			{
				pWriter->StartNode(_T("wpg:graphicFrame"));
				strNS = _T("wpg");
			}
			else if (pWriter->m_lDocType == XMLWRITER_DOC_TYPE_XLSX && pWriter->m_lGroupIndex >= 0)
			{
				pWriter->StartNode(_T("xdr:graphicFrame"));
				strNS = _T("xdr");
			}
			else
			{
				pWriter->StartNode(_T("p:graphicFrame"));
			}

			pWriter->EndAttributes();

			nvGraphicFramePr.toXmlWriter(pWriter);
			
			if (strNS == _T(""))
				xfrm.toXmlWriter(pWriter);
			else
				xfrm.toXmlWriter2(strNS, pWriter);

			if (Table.is_init())
			{
				pWriter->WriteString(_T("<a:graphic><a:graphicData uri=\"http://schemas.openxmlformats.org/drawingml/2006/table\">"));
				Table->toXmlWriter(pWriter);
				pWriter->WriteString(_T("</a:graphicData></a:graphic>"));
			}
			else if (chartRec.is_init())
			{
				pWriter->WriteString(_T("<a:graphic><a:graphicData uri=\"http://schemas.openxmlformats.org/drawingml/2006/chart\">"));
				chartRec->toXmlWriter(pWriter);
				pWriter->WriteString(_T("</a:graphicData></a:graphic>"));
			}

			if (pWriter->m_lDocType == XMLWRITER_DOC_TYPE_DOCX && pWriter->m_lGroupIndex >= 0)
				pWriter->EndNode(_T("wpg:graphicFrame"));
			else if (pWriter->m_lDocType == XMLWRITER_DOC_TYPE_XLSX && pWriter->m_lGroupIndex >= 0)
				pWriter->EndNode(_T("xdr:graphicFrame"));
			else
				pWriter->EndNode(_T("p:graphicFrame"));
		}

		void GraphicFrame::toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
		{
			if (pic.is_init())
			{
				pic->toPPTY(pWriter);
				return;
			}

			if (smartArt.is_init() && !Table.is_init() && !chartRec.is_init() && !spid.is_init())
			{
				smartArt->LoadDrawing(pWriter);
				if (smartArt->diag.is_init())
				{
					smartArt->diag->nvGrpSpPr.cNvPr = nvGraphicFramePr.cNvPr;
					smartArt->diag->nvGrpSpPr.nvPr = nvGraphicFramePr.nvPr;

					bool bIsInitCoords = false;
					if (smartArt->diag->grpSpPr.xfrm.is_init())
						bIsInitCoords = true;
					else
						smartArt->diag->grpSpPr.xfrm = new PPTX::Logic::Xfrm();

					PPTX::Logic::Xfrm* dst = smartArt->diag->grpSpPr.xfrm.GetPointer();
					const PPTX::Logic::Xfrm* src = &xfrm;

					dst->offX = src->offX;
					dst->offY = src->offY;
					dst->extX = src->extX;
					dst->extY = src->extY;

					if (!bIsInitCoords || !dst->chOffX.is_init() || !dst->chOffY.is_init() || !dst->chExtX.is_init() || !dst->chExtY.is_init())
					{
						dst->chOffX = 0;
						dst->chOffY = 0;
						dst->chExtX = src->extX;
						dst->chExtY = src->extY;
					}
					
					dst->flipH = src->flipH;
					dst->flipV = src->flipV;
					dst->rot = src->rot;

					smartArt->toPPTY(pWriter);
				}
			
				return;
			}

			if (!Table.is_init() && !chartRec.is_init() && spid.is_init())
			{				
				
				pWriter->StartRecord(SPTREE_TYPE_PIC);
				
				pWriter->StartRecord(0);
				pWriter->WriteRecord1(0, nvGraphicFramePr.cNvPr);
				pWriter->WriteRecord1(2, nvGraphicFramePr.nvPr);
				pWriter->EndRecord();

				pWriter->StartRecord(1);
				pWriter->StartRecord(FILL_TYPE_BLIP);

				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeStart);
				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeEnd);

				pWriter->StartRecord(0);
				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeStart);
				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeEnd);

				pWriter->StartRecord(3);

				double dX = 0;
				double dY = 0;
				double dW = 200;
				double dH = 200;
				NSShapeImageGen::CImageInfo oId = pWriter->m_oCommon.m_oImageManager.WriteImage(GetPathBySpid().m_strFilename, dX, dY, dW, dH);
				CString s = oId.GetPath2();

				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeStart);
				pWriter->WriteString1(0, s);
				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeEnd);				

				pWriter->EndRecord();

				pWriter->EndRecord();

				pWriter->EndRecord();
				pWriter->EndRecord();
				
				pWriter->StartRecord(2);
				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeStart);
				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeEnd);
				pWriter->WriteRecord1(0, xfrm);
				pWriter->EndRecord();
				
				pWriter->EndRecord();
				return;
			}

			pWriter->StartRecord(SPTREE_TYPE_GRFRAME);

			pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeStart);
			pWriter->WriteString2(0, spid);
			pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeEnd);

			pWriter->WriteRecord1(0, nvGraphicFramePr);
			pWriter->WriteRecord1(1, xfrm);
			pWriter->WriteRecord2(2, Table);

			if (chartRec.is_init())
			{
				pWriter->WriteRecord2(3, chartRec);
			}

			pWriter->EndRecord();
		}

		void GraphicFrame::fromPPTY(NSBinPptxRW::CBinaryFileReader* pReader)
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
						spid = pReader->GetString2();
						break;
					}	
					default:
						break;
				}
			}

			nvGraphicFramePr.cNvPr.id = -1;

			while (pReader->GetPos() < _end_rec)
			{
				BYTE _at = pReader->GetUChar();
				switch (_at)
				{
					case 0:
					{
						nvGraphicFramePr.fromPPTY(pReader);							
						break;
					}
					case 1:
					{
						xfrm.fromPPTY(pReader);
						xfrm.m_ns = _T("p");
						break;
					}
					case 2:
					{
						Table = new Logic::Table();
						Table->fromPPTY(pReader);
						break;
					}
					case 3:
					{
						chartRec = new Logic::ChartRec();
						chartRec->fromPPTY(pReader);
					}					
					default:
						break;
				}
			}				

			pReader->Seek(_end_rec);
		}

		void GraphicFrame::GetRect(RECT& pRect)const
		{
			pRect.left		= xfrm.offX.get();
			pRect.top		= xfrm.offY.get();
			pRect.right		= pRect.left + xfrm.extX.get();
			pRect.bottom	= pRect.top + xfrm.extY.get();

			if(parentIs<Logic::SpTree>())
				parentAs<Logic::SpTree>().NormalizeRect(pRect);
		}

		CString GraphicFrame::toXML() const
		{
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			return _T("");
		}

		void GraphicFrame::FillParentPointersForChilds()
		{
			xfrm.SetParentPointer(this);
			nvGraphicFramePr.SetParentPointer(this);
			if(Table.IsInit())
				Table->SetParentPointer(this);
			if (smartArt.is_init())
				smartArt->SetParentPointer(this);
			if (chartRec.is_init())
				chartRec->SetParentPointer(this);
			if (pic.is_init())
				pic->SetParentPointer(this);
		}

		OOX::CPath GraphicFrame::GetPathBySpid()const
		{
			OOX::CPath filename = _T("");
			if(parentFileIs<PPTX::Slide>())
				filename = parentFileAs<PPTX::Slide>().GetPathBySpid(spid.get_value_or(_T("")));
			else if(parentFileIs<PPTX::SlideLayout>())
				filename = parentFileAs<PPTX::SlideLayout>().GetPathBySpid(spid.get_value_or(_T("")));
			else if(parentFileIs<PPTX::SlideMaster>())
				filename = parentFileAs<PPTX::SlideMaster>().GetPathBySpid(spid.get_value_or(_T("")));

			return filename;
		}
	} 
} // namespace PPTX