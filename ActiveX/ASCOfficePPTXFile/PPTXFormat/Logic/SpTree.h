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
#ifndef PPTX_SLIDES_SLIDE_SHAPETREE_INCLUDE_H_
#define PPTX_SLIDES_SLIDE_SHAPETREE_INCLUDE_H_

#include "./../WrapperWritingElement.h"
#include "./../Logic/NvGrpSpPr.h"
#include "./../Logic/GrpSpPr.h"
#include "SpTreeElem.h"
#include "ShapeProperties.h"
#include "ShapeTextProperties.h"

namespace PPTX
{
	namespace Logic
	{

		class SpTree : public WrapperWritingElement
		{
		public:
			PPTX_LOGIC_BASE(SpTree)

			SpTree& operator=(const SpTree& oSrc)
			{
				parentFile		= oSrc.parentFile;
				parentElement	= oSrc.parentElement;

				nvGrpSpPr	= oSrc.nvGrpSpPr;
				grpSpPr		= oSrc.grpSpPr;
				SpTreeElems.Copy(oSrc.SpTreeElems);

				m_name = oSrc.m_name;

				return *this;
			}

		public:
			virtual void fromXML(XmlUtils::CXmlNode& node)
			{
				m_name = node.GetName();
				
				nvGrpSpPr	= node.ReadNodeNoNS(_T("nvGrpSpPr"));
				grpSpPr		= node.ReadNodeNoNS(_T("grpSpPr"));

				SpTreeElems.RemoveAll();

				XmlUtils::CXmlNodes oNodes;
				if (node.GetNodes(_T("*"), oNodes))
				{
					int nCount = oNodes.GetCount();
					for (int i = 0; i < nCount; ++i)
					{
						XmlUtils::CXmlNode oNode;
						oNodes.GetAt(i, oNode);

						CString strName = XmlUtils::GetNameNoNS(oNode.GetName());

						if (_T("cNvPr") == strName)
						{
							nvGrpSpPr.cNvPr = oNode;
						}
						else if (_T("cNvGrpSpPr") == strName)
						{
							nvGrpSpPr.cNvGrpSpPr = oNode;
						}
						else
						{
							SpTreeElem elem(oNode);
							if (elem.is_init())
								SpTreeElems.Add(elem);
						}
					}
				}

				FillParentPointersForChilds();
			}

			virtual CString toXML() const
			{
				XmlUtils::CNodeValue oValue;
				oValue.Write(nvGrpSpPr);
				oValue.Write(grpSpPr);
				oValue.WriteArray(SpTreeElems);

				return XmlUtils::CreateNode(m_name, oValue);
			}

			void toXmlWriterVML(NSBinPptxRW::CXmlWriter* pWriter, smart_ptr<PPTX::WrapperFile>& oTheme, smart_ptr<PPTX::WrapperWritingElement>& oClrMap);

			virtual void toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const
			{
				if (pWriter->m_lDocType == XMLWRITER_DOC_TYPE_DOCX)
				{
					if (pWriter->m_lGroupIndex == 0)
						pWriter->StartNode(_T("wpg:wgp"));
					else
						pWriter->StartNode(_T("wpg:grpSp"));
				}
				else if (pWriter->m_lDocType == XMLWRITER_DOC_TYPE_XLSX)
					pWriter->StartNode(_T("xdr:grpSp"));
				else
					pWriter->StartNode(m_name);

				pWriter->EndAttributes();

				if (pWriter->m_lDocType == XMLWRITER_DOC_TYPE_DOCX)
				{
					
					nvGrpSpPr.cNvGrpSpPr.toXmlWriter2(_T("wpg"), pWriter);
				}
				else
					nvGrpSpPr.toXmlWriter(pWriter);
				
				grpSpPr.toXmlWriter(pWriter);
				
				pWriter->m_lGroupIndex++;

				size_t nCount = SpTreeElems.GetCount();
				for (size_t i = 0; i < nCount; ++i)
					SpTreeElems[i].toXmlWriter(pWriter);

				pWriter->m_lGroupIndex--;
				
				if (pWriter->m_lDocType == XMLWRITER_DOC_TYPE_DOCX)
				{
					if (pWriter->m_lGroupIndex == 0)
						pWriter->EndNode(_T("wpg:wgp"));
					else
						pWriter->EndNode(_T("wpg:grpSp"));
				}
				else if (pWriter->m_lDocType == XMLWRITER_DOC_TYPE_XLSX)
					pWriter->EndNode(_T("xdr:grpSp"));
				else
					pWriter->EndNode(m_name);
			}

			void NormalizeRect(RECT& rect)const
			{
				if(grpSpPr.xfrm.IsInit())
				{
					if( (grpSpPr.xfrm->chExtX.get_value_or(0) != 0) && (grpSpPr.xfrm->chExtY.get_value_or(0) != 0) )
					{
						double ScaleX = grpSpPr.xfrm->extX.get_value_or(0)/( double(grpSpPr.xfrm->chExtX.get()) );
						double ScaleY = grpSpPr.xfrm->extY.get_value_or(0)/( double(grpSpPr.xfrm->chExtY.get()) );
						double RectWidth = ScaleX * (rect.right - rect.left);
						double RectHeight = ScaleY * (rect.bottom - rect.top);
						rect.left	= (LONG)((rect.left - grpSpPr.xfrm->chOffX.get()) * ScaleX + grpSpPr.xfrm->offX.get());
						rect.top	= (LONG)((rect.top - grpSpPr.xfrm->chOffY.get()) * ScaleY + grpSpPr.xfrm->offY.get());
						rect.right	= (LONG)(rect.left + RectWidth);
						rect.bottom = (LONG)(rect.top + RectHeight);
					}
				}
				if(parentIs<Logic::SpTree>())
					parentAs<Logic::SpTree>().NormalizeRect(rect);
			}

			virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
			{
				pWriter->StartRecord(SPTREE_TYPE_SPTREE);

				pWriter->WriteRecord1(0, nvGrpSpPr);
				pWriter->WriteRecord1(1, grpSpPr);
				pWriter->WriteRecordArray(2, 0, SpTreeElems);

				pWriter->EndRecord();
			}
			virtual void fromPPTY(NSBinPptxRW::CBinaryFileReader* pReader)
			{
				LONG _end_rec = pReader->GetPos() + pReader->GetLong() + 4;
				pReader->Skip(5); 

				while (pReader->GetPos() < _end_rec)
				{
					BYTE _at = pReader->GetUChar();
					switch (_at)
					{
						case 0:
						{
							nvGrpSpPr.fromPPTY(pReader);
							break;
						}
						case 1:
						{
							grpSpPr.fromPPTY(pReader);
							break;
						}
						case 2:
						{
							pReader->Skip(4); 
							ULONG _c = pReader->GetULong();

							ULONG last = 0;
							for (ULONG i = 0; i < _c; ++i)
							{
								pReader->Skip(5); 
								SpTreeElems.Add();
								SpTreeElems[last].fromPPTY(pReader);
								
								if (!SpTreeElems[last].is_init())
								{
									SpTreeElems.RemoveAt(last);									
								}
								else
								{
									++last;
								}
							}
						}
						default:
						{
							break;
						}
					}				
				}
				pReader->Seek(_end_rec);
			}

		public:
			Logic::NvGrpSpPr		nvGrpSpPr;
			Logic::GrpSpPr			grpSpPr;
			CAtlArray<SpTreeElem>	SpTreeElems;
		
		public:
			CString m_name;
		protected:
			virtual void FillParentPointersForChilds()
			{
				nvGrpSpPr.SetParentPointer(this);
				grpSpPr.SetParentPointer(this);

				size_t count = SpTreeElems.GetCount();
				for (size_t i = 0; i < count; ++i)
					SpTreeElems[i].SetParentPointer(this);
			}
		};
	} 
} 

#endif // PPTX_SLIDES_SLIDE_SHAPETREE_INCLUDE_H_