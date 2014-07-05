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
#ifndef PPTX_LOGIC_XFRM_INCLUDE_H_
#define PPTX_LOGIC_XFRM_INCLUDE_H_

#include "./../WrapperWritingElement.h"

namespace PPTX
{
	namespace Logic
	{
		class Xfrm : public WrapperWritingElement
		{
		public:
			Xfrm()	
			{
				m_ns = _T("a");
			}
			virtual ~Xfrm() {}
			explicit Xfrm(XmlUtils::CXmlNode& node)	{ fromXML(node); }
			const Xfrm& operator =(XmlUtils::CXmlNode& node)
			{
				fromXML(node);
				return *this;
			}
			Xfrm(const Xfrm& oSrc) { *this = oSrc; }

		public:
			virtual void fromXML(XmlUtils::CXmlNode& node)
			{
				m_ns = XmlUtils::GetNamespace(node.GetName());

				node.ReadAttributeBase(L"flipH", flipH);
				node.ReadAttributeBase(L"flipV", flipV);
				node.ReadAttributeBase(L"rot", rot);

				XmlUtils::CXmlNode oNodeOff;
				if(node.GetNode(_T("a:off"), oNodeOff))
				{
					oNodeOff.ReadAttributeBase(L"x", offX);
					oNodeOff.ReadAttributeBase(L"y", offY);
				}
				XmlUtils::CXmlNode oNodeExt;
				if(node.GetNode(_T("a:ext"), oNodeExt))
				{
					oNodeExt.ReadAttributeBase(L"cx", extX);
					oNodeExt.ReadAttributeBase(L"cy", extY);
				}
				XmlUtils::CXmlNode oNodeChOff;
				if(node.GetNode(_T("a:chOff"), oNodeChOff))
				{
					oNodeChOff.ReadAttributeBase(L"x", chOffX);
					oNodeChOff.ReadAttributeBase(L"y", chOffY);
				}
				XmlUtils::CXmlNode oNodeChExt;
				if(node.GetNode(_T("a:chExt"), oNodeChExt))
				{
					oNodeChExt.ReadAttributeBase(L"cx", chExtX);
					oNodeChExt.ReadAttributeBase(L"cy", chExtY);
				}
				Normalize();
			}

			virtual CString toXML() const
			{
				XmlUtils::CAttribute oAttr;
				oAttr.Write(_T("rot"), rot);
				oAttr.Write(_T("flipH"), flipH);
				oAttr.Write(_T("flipV"), flipV);

				XmlUtils::CNodeValue oValue;
				
				XmlUtils::CAttribute oAttr1;
				oAttr1.Write(_T("x"), offX);
				oAttr1.Write(_T("y"), offY);

				XmlUtils::CAttribute oAttr2;
				oAttr2.Write(_T("cx"), extX);
				oAttr2.Write(_T("cy"), extY);

				XmlUtils::CAttribute oAttr3;
				oAttr3.Write(_T("x"), chOffX);
				oAttr3.Write(_T("y"), chOffY);

				XmlUtils::CAttribute oAttr4;
				oAttr4.Write(_T("cx"), chExtX);
				oAttr4.Write(_T("cy"), chExtY);

				CString strValue = _T("");
				
				if (_T("") != oAttr1.m_strValue)
					strValue += XmlUtils::CreateNode(_T("a:off"), oAttr1);
				if (_T("") != oAttr2.m_strValue)
					strValue += XmlUtils::CreateNode(_T("a:ext"), oAttr2);
				if (_T("") != oAttr3.m_strValue)
					strValue += XmlUtils::CreateNode(_T("a:chOff"), oAttr3);
				if (_T("") != oAttr4.m_strValue)
					strValue += XmlUtils::CreateNode(_T("a:chExt"), oAttr4);
				
				return XmlUtils::CreateNode(m_ns + _T(":xfrm"), oAttr, strValue);
			}

			virtual void toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const
			{
				pWriter->StartNode(m_ns + _T(":xfrm"));

				pWriter->StartAttributes();
				pWriter->WriteAttribute(_T("rot"), rot);
				pWriter->WriteAttribute(_T("flipH"), flipH);
				pWriter->WriteAttribute(_T("flipV"), flipV);
				pWriter->EndAttributes();
				
				if (offX.is_init() || offX.is_init())
				{
					pWriter->StartNode(_T("a:off"));
					pWriter->StartAttributes();
					pWriter->WriteAttribute(_T("x"), offX);
					pWriter->WriteAttribute(_T("y"), offY);
					pWriter->EndAttributes();
					pWriter->EndNode(_T("a:off"));
				}

				if (extX.is_init() || extY.is_init())
				{
					pWriter->StartNode(_T("a:ext"));
					pWriter->StartAttributes();
					pWriter->WriteAttribute(_T("cx"), extX);
					pWriter->WriteAttribute(_T("cy"), extY);
					pWriter->EndAttributes();
					pWriter->EndNode(_T("a:ext"));
				}

				if (chOffX.is_init() || chOffY.is_init())
				{
					pWriter->StartNode(_T("a:chOff"));
					pWriter->StartAttributes();
					pWriter->WriteAttribute(_T("x"), chOffX);
					pWriter->WriteAttribute(_T("y"), chOffY);
					pWriter->EndAttributes();
					pWriter->EndNode(_T("a:chOff"));
				}

				if (chExtX.is_init() || chExtY.is_init())
				{
					pWriter->StartNode(_T("a:chExt"));
					pWriter->StartAttributes();
					pWriter->WriteAttribute(_T("cx"), chExtX);
					pWriter->WriteAttribute(_T("cy"), chExtY);
					pWriter->EndAttributes();
					pWriter->EndNode(_T("a:chExt"));
				}

				pWriter->EndNode(m_ns + _T(":xfrm"));
			}

			void toXmlWriter2(const CString& strNS, NSBinPptxRW::CXmlWriter* pWriter) const
			{
				pWriter->StartNode(strNS + _T(":xfrm"));

				pWriter->StartAttributes();
				pWriter->WriteAttribute(_T("rot"), rot);
				pWriter->WriteAttribute(_T("flipH"), flipH);
				pWriter->WriteAttribute(_T("flipV"), flipV);
				pWriter->EndAttributes();
				
				if (offX.is_init() || offX.is_init())
				{
					pWriter->StartNode(_T("a:off"));
					pWriter->StartAttributes();
					pWriter->WriteAttribute(_T("x"), offX);
					pWriter->WriteAttribute(_T("y"), offY);
					pWriter->EndAttributes();
					pWriter->EndNode(_T("a:off"));
				}

				if (extX.is_init() || extY.is_init())
				{
					pWriter->StartNode(_T("a:ext"));
					pWriter->StartAttributes();
					pWriter->WriteAttribute(_T("cx"), extX);
					pWriter->WriteAttribute(_T("cy"), extY);
					pWriter->EndAttributes();
					pWriter->EndNode(_T("a:ext"));
				}

				if (chOffX.is_init() || chOffY.is_init())
				{
					pWriter->StartNode(_T("a:chOff"));
					pWriter->StartAttributes();
					pWriter->WriteAttribute(_T("x"), chOffX);
					pWriter->WriteAttribute(_T("y"), chOffY);
					pWriter->EndAttributes();
					pWriter->EndNode(_T("a:chOff"));
				}

				if (chExtX.is_init() || chExtY.is_init())
				{
					pWriter->StartNode(_T("a:chExt"));
					pWriter->StartAttributes();
					pWriter->WriteAttribute(_T("cx"), chExtX);
					pWriter->WriteAttribute(_T("cy"), chExtY);
					pWriter->EndAttributes();
					pWriter->EndNode(_T("a:chExt"));
				}

				pWriter->EndNode(strNS + _T(":xfrm"));
			}

			virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
			{
				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeStart);
				pWriter->WriteInt2(0, offX);
				pWriter->WriteInt2(1, offY);
				pWriter->WriteInt2(2, extX);
				pWriter->WriteInt2(3, extY);
				pWriter->WriteInt2(4, chOffX);
				pWriter->WriteInt2(5, chOffY);
				pWriter->WriteInt2(6, chExtX);
				pWriter->WriteInt2(7, chExtY);
				pWriter->WriteBool2(8, flipH);
				pWriter->WriteBool2(9, flipV);
				pWriter->WriteInt2(10, rot);
				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeEnd);
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
							offX = pReader->GetLong();
							break;
						}
						case 1:
						{
							offY = pReader->GetLong();
							break;
						}
						case 2:
						{
							extX = pReader->GetLong();
							break;
						}
						case 3:
						{
							extY = pReader->GetLong();
							break;
						}
						case 4:
						{
							chOffX = pReader->GetLong();
							break;
						}
						case 5:
						{
							chOffY = pReader->GetLong();
							break;
						}
						case 6:
						{
							chExtX = pReader->GetLong();
							break;
						}
						case 7:
						{
							chExtY = pReader->GetLong();
							break;
						}
						case 8:
						{
							flipH = pReader->GetBool();
							break;
						}
						case 9:
						{
							flipV = pReader->GetBool();
							break;
						}
						case 10:
						{
							rot = pReader->GetLong();
							break;
						}
						default:
							break;
					}
				}

				pReader->Seek(_end_rec);
			}

			void Merge(nullable<Xfrm>& xfrm)const
			{
				if(!xfrm.IsInit())
					xfrm = new Xfrm();
				if(offX.IsInit())
					xfrm->offX = *offX;
				if(offY.IsInit())
					xfrm->offY = *offY;
				if(extX.IsInit())
					xfrm->extX = *extX;
				if(extY.IsInit())
					xfrm->extY = *extY;
				if(chOffX.IsInit())
					xfrm->chOffX = *chOffX;
				if(chOffY.IsInit())
					xfrm->chOffY = *chOffY;
				if(chExtX.IsInit())
					xfrm->chExtX = *chExtX;
				if(chExtY.IsInit())
					xfrm->chExtY = *chExtY;
				if(flipH.IsInit())
					xfrm->flipH = *flipH;
				if(flipV.IsInit())
					xfrm->flipV = *flipV;
				if(rot.IsInit())
					xfrm->rot = *rot;
			}

		public:
			nullable_int		offX;
			nullable_int		offY;
			nullable_int		extX;
			nullable_int		extY;
			nullable_int		chOffX;
			nullable_int		chOffY;
			nullable_int		chExtX;
			nullable_int		chExtY;

			nullable_bool		flipH;
			nullable_bool		flipV;
			nullable_int		rot;
		public:
			CString m_ns;
		protected:
			virtual void FillParentPointersForChilds(){};

			AVSINLINE void Normalize()
			{
				extX.normalize_positive();
				extY.normalize_positive();
				chExtX.normalize_positive();
				chExtY.normalize_positive();
			}
		};
	} 
} 

#endif // PPTX_LOGIC_XFRM_INCLUDE_H