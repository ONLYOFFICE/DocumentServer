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

#include "Pic.h"
#include "SpTree.h"
#include "./../SlideLayout.h"
#include "./../SlideMaster.h"
#include "./../Slide.h"
#include "Media/MediaFile.h"
#include "Media/WavAudioFile.h"

namespace PPTX
{
	namespace Logic
	{

		Pic::Pic()
		{
		}


		Pic::~Pic()
		{
		}
	

		Pic::Pic(XmlUtils::CXmlNode& node)
		{
			fromXML(node);
		}


		const Pic& Pic::operator =(XmlUtils::CXmlNode& node)
		{
			fromXML(node);
			return *this;
		}


		void Pic::fromXML(XmlUtils::CXmlNode& node)
		{
			XmlUtils::CXmlNodes oNodes;
			if (node.GetNodes(_T("*"), oNodes))
			{
				int nCount = oNodes.GetCount();
				for (int i = 0; i < nCount; ++i)
				{
					XmlUtils::CXmlNode item;
					oNodes.GetAt(i, item);

					CString strName = XmlUtils::GetNameNoNS(item.GetName());

					if (_T("nvPicPr") == strName)
						nvPicPr = item;
					else if (_T("blipFill") == strName)
						blipFill = item;
					else if (_T("spPr") == strName)
						spPr = item;
					else if (_T("style") == strName)
					{
						if (!style.IsInit())
							style = item;
					}
				}

				if (!blipFill.blip.is_init())
				{
					XmlUtils::CXmlNode oNodeMSAlternate;
					if (node.GetNode(_T("mc:AlternateContent"), oNodeMSAlternate))
					{
						XmlUtils::CXmlNode oNodeFallback;
						if (oNodeMSAlternate.GetNode(_T("mc:Fallback"), oNodeFallback))
						{
							blipFill = oNodeFallback.ReadNode(_T("p:blipFill"));
						}
					}
				}
			}			
			
			FillParentPointersForChilds();
		}


		CString Pic::toXML() const
		{
			XmlUtils::CNodeValue oValue;
			oValue.Write(nvPicPr);
			oValue.Write(blipFill);
			oValue.Write(spPr);
			oValue.WriteNullable(style);
			
			return XmlUtils::CreateNode(_T("p:pic"), oValue);
		}

		void Pic::FillParentPointersForChilds()
		{
			nvPicPr.SetParentPointer(this);
			blipFill.SetParentPointer(this);
			spPr.SetParentPointer(this);
			if (style.IsInit())
				style->SetParentPointer(this);
		}

		void Pic::GetRect(RECT& pRect)const
		{
			pRect.bottom	= 0;
			pRect.left		= 0;
			pRect.right		= 0;
			pRect.top		= 0;

			if (spPr.xfrm.IsInit())
			{
				pRect.left		= spPr.xfrm->offX.get_value_or(0);
				pRect.top		= spPr.xfrm->offY.get_value_or(0);
				pRect.right		= pRect.left + spPr.xfrm->extX.get_value_or(0);
				pRect.bottom	= pRect.top + spPr.xfrm->extY.get_value_or(0);
			}
			if(parentIs<Logic::SpTree>())
				parentAs<Logic::SpTree>().NormalizeRect(pRect);
		}

		CString Pic::GetFullPicName()const
		{
			if (blipFill.blip.IsInit())
				return blipFill.blip->GetFullPicName();
			return _T("");
		}

		CString Pic::GetVideoLink()const
		{
			CString file = _T("");
			if (parentFileIs<Slide>())
			{
				if (nvPicPr.nvPr.media.is<MediaFile>())
				{
					if ((nvPicPr.nvPr.media.as<MediaFile>().name == _T("videoFile")) || (nvPicPr.nvPr.media.as<MediaFile>().name == _T("quickTimeFile")))
					{
						file = parentFileAs<Slide>().GetLinkFromRId(nvPicPr.nvPr.media.as<MediaFile>().link.get());						
						if (CString (_T("NULL")) == file)	
						{
							if(nvPicPr.nvPr.extLst.GetCount())
							{
								file = parentFileAs<Slide>().GetLinkFromRId(nvPicPr.nvPr.extLst.GetAt(0).link.get());
							}
						}		
					}
				}
			}

			return file;
		}

		CString Pic::GetAudioLink()const
		{
			CString file = _T("");
			if (parentFileIs<Slide>())
			{
				if (nvPicPr.nvPr.media.is<WavAudioFile>())
				{
					return parentFileAs<Slide>().GetLinkFromRId(nvPicPr.nvPr.media.as<WavAudioFile>().embed.get());
				}

				if (nvPicPr.nvPr.media.is<MediaFile>())
				{
					if (nvPicPr.nvPr.media.as<MediaFile>().name == _T("audioFile"))
					{
						file = parentFileAs<Slide>().GetLinkFromRId(nvPicPr.nvPr.media.as<MediaFile>().link.get());		

						if (CString (_T("NULL")) == file)	
						{
							if(nvPicPr.nvPr.extLst.GetCount())
							{
								file = parentFileAs<Slide>().GetLinkFromRId(nvPicPr.nvPr.extLst.GetAt(0).link.get());
							}
						}		
					}
				}
			}
			return file;
		}

		DWORD Pic::GetFill(UniFill& fill)const
		{
			DWORD BGRA = 0;
			fill.SetParentFilePointer(parentFile);

			if (style.IsInit())
			{
				if (parentFileIs<PPTX::Slide>())
					parentFileAs<PPTX::Slide>().Theme->GetFillStyle(style->fillRef.idx.get_value_or(0), fill);
				else if (parentFileIs<PPTX::SlideLayout>())
					parentFileAs<PPTX::SlideLayout>().Theme->GetFillStyle(style->fillRef.idx.get_value_or(0), fill);
				else if (parentFileIs<PPTX::SlideMaster>())
					parentFileAs<PPTX::SlideMaster>().Theme->GetFillStyle(style->fillRef.idx.get_value_or(0), fill);

				BGRA = style->fillRef.Color.GetBGRA();
			}

			if (spPr.Fill.is_init())
				spPr.Fill.Merge(fill);
			return BGRA;
		}

		DWORD Pic::GetLine(Ln& line)const
		{
			DWORD BGRA = 0;
			line.SetParentFilePointer(parentFile);

			if (style.is_init())
			{
				if (parentFileIs<PPTX::Slide>())
					parentFileAs<PPTX::Slide>().Theme->GetLineStyle(style->lnRef.idx.get_value_or(0), line);
				else if (parentFileIs<PPTX::SlideLayout>())
					parentFileAs<PPTX::SlideLayout>().Theme->GetLineStyle(style->lnRef.idx.get_value_or(0), line);
				else if (parentFileIs<PPTX::SlideMaster>())
					parentFileAs<PPTX::SlideMaster>().Theme->GetLineStyle(style->lnRef.idx.get_value_or(0), line);

				BGRA = style->lnRef.Color.GetBGRA();
			}

			if (spPr.ln.IsInit())
				spPr.ln->Merge(line);
			return BGRA;
		}

		
		double Pic::GetStTrim () const
		{
			double trim = 0.0;
			
			if (parentFileIs<Slide>())
			{
				if (nvPicPr.nvPr.media.is<MediaFile>())
				{
					if ((nvPicPr.nvPr.media.as<MediaFile>().name == _T("videoFile")) ||
						(nvPicPr.nvPr.media.as<MediaFile>().name == _T("quickTimeFile")) ||
						(nvPicPr.nvPr.media.as<MediaFile>().name == _T("audioFile")) )
					{
						if (CString (_T("NULL")) == parentFileAs<Slide>().GetLinkFromRId(nvPicPr.nvPr.media.as<MediaFile>().link.get()) )	
						{
							if(nvPicPr.nvPr.extLst.GetCount())
							{
								if (nvPicPr.nvPr.extLst.GetAt(0).st.is_init())
									trim = nvPicPr.nvPr.extLst.GetAt(0).st.get();
							}
						}		
					}
				}
			}

			return trim;
		}

		double Pic::GetEndTrim () const
		{
			double trim = -1.0;
			
			if (parentFileIs<Slide>())
			{
				if (nvPicPr.nvPr.media.is<MediaFile>())
				{
					if ((nvPicPr.nvPr.media.as<MediaFile>().name == _T("videoFile")) ||
						(nvPicPr.nvPr.media.as<MediaFile>().name == _T("quickTimeFile")) ||
						(nvPicPr.nvPr.media.as<MediaFile>().name == _T("audioFile")) )
					{
						if (CString (_T("NULL")) == parentFileAs<Slide>().GetLinkFromRId(nvPicPr.nvPr.media.as<MediaFile>().link.get()))	
						{
							if(nvPicPr.nvPr.extLst.GetCount())
							{
								if (nvPicPr.nvPr.extLst.GetAt(0).end.is_init())
									trim = nvPicPr.nvPr.extLst.GetAt(0).end.get();
							}
						}		
					}
				}
			}

			return trim;
		}

		long Pic::GetRefId() const
		{
			return (long) nvPicPr.cNvPr.id;
		}

		void Pic::toXmlWriterVML(NSBinPptxRW::CXmlWriter *pWriter, NSCommon::smart_ptr<PPTX::WrapperFile>& _oTheme, NSCommon::smart_ptr<PPTX::WrapperWritingElement>& _oClrMap)
		{
			smart_ptr<PPTX::Theme> oTheme = _oTheme.smart_dynamic_cast<PPTX::Theme>();
			smart_ptr<PPTX::Logic::ClrMap> oClrMap = oTheme.smart_dynamic_cast<PPTX::Logic::ClrMap>();

			int dL = 0;
			int dT = 0;
			int dW = 0;
			int dH = 0;

			CString strId = _T("");
			strId.Format(_T("picture %d"), pWriter->m_lObjectIdVML);
			CString strSpid = _T("");
			strSpid.Format(_T("_x%04d_s%04d"), 0xFFFF & (pWriter->m_lObjectIdVML >> 16), 0xFFFF & pWriter->m_lObjectIdVML);
			pWriter->m_lObjectIdVML++;

			if (spPr.xfrm.is_init())
			{
				if (spPr.xfrm->offX.is_init())
					dL = (*spPr.xfrm->offX);
				if (spPr.xfrm->offY.is_init())
					dT = (*spPr.xfrm->offY);
				if (spPr.xfrm->extX.is_init())
					dW = (*spPr.xfrm->extX);
				if (spPr.xfrm->extY.is_init())
					dH = (*spPr.xfrm->extY);
			}

			NSBinPptxRW::CXmlWriter oStylesWriter;
			oStylesWriter.WriteAttributeCSS(_T("position"), _T("absolute"));
			oStylesWriter.WriteAttributeCSS_int(_T("left"), dL);
			oStylesWriter.WriteAttributeCSS_int(_T("top"), dT);
			oStylesWriter.WriteAttributeCSS_int(_T("width"), dW);
			oStylesWriter.WriteAttributeCSS_int(_T("height"), dH);

			if (spPr.xfrm.is_init())
			{
				if (spPr.xfrm->rot.is_init())
				{
					int nRot = (int)((double)(*(spPr.xfrm->rot)) / 60000.0);
					oStylesWriter.WriteAttributeCSS_int(_T("rotation"), nRot);
				}
				bool bIsFH = spPr.xfrm->flipH.get_value_or(false);
				bool bIsFV = spPr.xfrm->flipV.get_value_or(false);
				if (bIsFH && bIsFV)
				{
					oStylesWriter.WriteAttributeCSS(_T("flip"), _T("xy"));
				}
				else if (bIsFH)
				{
					oStylesWriter.WriteAttributeCSS(_T("flip"), _T("x"));
				}
				else if (bIsFV)
				{
					oStylesWriter.WriteAttributeCSS(_T("flip"), _T("y"));
				}
			}

			if (spPr.Geometry.is_init())
			{
				CString strPath = _T("");
				CString strTextRect = _T("");

				LONG lW = 43200;
				LONG lH = 43200;
				if (spPr.xfrm.is_init())
				{
					lW = spPr.xfrm->extX.get_value_or(43200);
					lH = spPr.xfrm->extY.get_value_or(43200);
				}

#ifdef AVS_USE_CONVERT_PPTX_TOCUSTOM_VML
				spPr.Geometry.ConvertToCustomVML(pWriter->m_pOOXToVMLRenderer, strPath, strTextRect, lW, lH);
#endif

				pWriter->StartNode(_T("v:shape"));

				pWriter->WriteAttribute(_T("id"), strId);
				pWriter->WriteAttribute(_T("o:spid"), strSpid);

				pWriter->StartAttributes();
				pWriter->WriteAttribute(_T("style"), oStylesWriter.GetXmlString());
				pWriter->WriteAttribute(_T("coordsize"), (CString)_T("100000,100000"));
				pWriter->WriteAttribute(_T("path"), strPath);

				if (pWriter->m_strAttributesMain)
				{
					pWriter->WriteString(pWriter->m_strAttributesMain);
					pWriter->m_strAttributesMain = _T("");
				}

				CString strNodeVal = _T("");
				if (!spPr.ln.is_init())
				{
					pWriter->WriteAttribute(_T("stroked"), (CString)_T("false"));
				}
				else
				{
					CString strPenAttr = _T("");
					nullable<ShapeStyle> pShapeStyle;
					CalculateLine(spPr, pShapeStyle, _oTheme, _oClrMap, strPenAttr, strNodeVal);
					pWriter->WriteString(strPenAttr);
				}

				pWriter->EndAttributes();

				pWriter->StartNode(_T("v:path"));
				pWriter->StartAttributes();
				pWriter->WriteAttribute(_T("textboxrect"), strTextRect);
				pWriter->EndAttributes();
				pWriter->EndNode(_T("v:path"));

				if (blipFill.blip.is_init() && blipFill.blip->embed.is_init())
				{
					pWriter->StartNode(_T("v:imagedata"));
					pWriter->StartAttributes();
					pWriter->WriteAttribute(_T("r:id"), blipFill.blip->embed->ToString());
					pWriter->WriteAttribute(_T("o:title"), CString(_T("")));
					pWriter->EndAttributes();
					pWriter->EndNode(_T("v:imagedata"));
				}

				pWriter->EndNode(_T("v:shape"));
			}
			else
			{
				pWriter->StartNode(_T("v:rect"));

				pWriter->StartAttributes();

				pWriter->WriteAttribute(_T("id"), strId);
				pWriter->WriteAttribute(_T("o:spid"), strSpid);

				pWriter->WriteAttribute(_T("style"), oStylesWriter.GetXmlString());
				pWriter->EndAttributes();

				if (blipFill.blip.is_init() && blipFill.blip->embed.is_init())
				{
					pWriter->StartNode(_T("v:imagedata"));
					pWriter->StartAttributes();
					pWriter->WriteAttribute(_T("r:id"), blipFill.blip->embed->ToString());
					pWriter->WriteAttribute(_T("o:title"), CString(_T("")));
					pWriter->EndAttributes();
					pWriter->EndNode(_T("v:imagedata"));
				}

				pWriter->EndNode(_T("v:rect"));
			}
		}
	} 
} // namespace PPTX