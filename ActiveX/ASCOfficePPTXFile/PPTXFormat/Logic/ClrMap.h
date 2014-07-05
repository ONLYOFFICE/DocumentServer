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
#ifndef PPTX_LOGIC_CLRMAP_INCLUDE_H_
#define PPTX_LOGIC_CLRMAP_INCLUDE_H_

#include "./../WrapperWritingElement.h"
#include "./../Limit/ColorSchemeIndex.h"

namespace PPTX
{
	namespace Logic
	{
		class ClrMap : public WrapperWritingElement
		{
		public:
			PPTX_LOGIC_BASE(ClrMap)

			ClrMap& operator=(const ClrMap& oSrc)
			{
				parentFile		= oSrc.parentFile;
				parentElement	= oSrc.parentElement;

				m_name = oSrc.m_name;
				
				ColorMap.RemoveAll();
				POSITION pos = oSrc.ColorMap.GetStartPosition();
				while (NULL != pos)
				{
					const CAtlMap<CString, Limit::ColorSchemeIndex>::CPair* pPair = oSrc.ColorMap.GetNext(pos);
					ColorMap.SetAt(pPair->m_key, pPair->m_value);
				}
				return *this;
			}

		public:
			virtual void fromXML(XmlUtils::CXmlNode& node)
			{
				m_name = node.GetName();

				ColorMap.RemoveAll();

				Limit::ColorSchemeIndex lColorIndex;
				
				lColorIndex._set(node.GetAttribute(_T("accent1")));	ColorMap.SetAt(_T("accent1"), lColorIndex);
				lColorIndex._set(node.GetAttribute(_T("accent2")));	ColorMap.SetAt(_T("accent2"), lColorIndex);
				lColorIndex._set(node.GetAttribute(_T("accent3")));	ColorMap.SetAt(_T("accent3"), lColorIndex);
				lColorIndex._set(node.GetAttribute(_T("accent4")));	ColorMap.SetAt(_T("accent4"), lColorIndex);
				lColorIndex._set(node.GetAttribute(_T("accent5")));	ColorMap.SetAt(_T("accent5"), lColorIndex);
				lColorIndex._set(node.GetAttribute(_T("accent6")));	ColorMap.SetAt(_T("accent6"), lColorIndex);
				lColorIndex._set(node.GetAttribute(_T("bg1")));		ColorMap.SetAt(_T("bg1"), lColorIndex);
				lColorIndex._set(node.GetAttribute(_T("bg2")));		ColorMap.SetAt(_T("bg2"), lColorIndex);
				lColorIndex._set(node.GetAttribute(_T("tx1")));		ColorMap.SetAt(_T("tx1"), lColorIndex);
				lColorIndex._set(node.GetAttribute(_T("tx2")));		ColorMap.SetAt(_T("tx2"), lColorIndex);
				lColorIndex._set(node.GetAttribute(_T("folHlink")));ColorMap.SetAt(_T("folHlink"), lColorIndex);
				lColorIndex._set(node.GetAttribute(_T("hlink")));	ColorMap.SetAt(_T("hlink"), lColorIndex);
			}

			void fromXMLW(XmlUtils::CXmlNode& node)
			{
				m_name = node.GetName();

				ColorMap.RemoveAll();

				Limit::ColorSchemeIndex lColorIndex;

				lColorIndex._set(node.GetAttribute(_T("w:accent1")));			ColorMap.SetAt(_T("accent1"), lColorIndex);
				lColorIndex._set(node.GetAttribute(_T("w:accent2")));			ColorMap.SetAt(_T("accent2"), lColorIndex);
				lColorIndex._set(node.GetAttribute(_T("w:accent3")));			ColorMap.SetAt(_T("accent3"), lColorIndex);
				lColorIndex._set(node.GetAttribute(_T("w:accent4")));			ColorMap.SetAt(_T("accent4"), lColorIndex);
				lColorIndex._set(node.GetAttribute(_T("w:accent5")));			ColorMap.SetAt(_T("accent5"), lColorIndex);
				lColorIndex._set(node.GetAttribute(_T("w:accent6")));			ColorMap.SetAt(_T("accent6"), lColorIndex);
				lColorIndex._set(node.GetAttribute(_T("w:bg1")));				ColorMap.SetAt(_T("bg1"), lColorIndex);
				lColorIndex._set(node.GetAttribute(_T("w:bg2")));				ColorMap.SetAt(_T("bg2"), lColorIndex);
				lColorIndex._set(node.GetAttribute(_T("w:t1")));				ColorMap.SetAt(_T("tx1"), lColorIndex);
				lColorIndex._set(node.GetAttribute(_T("w:t2")));				ColorMap.SetAt(_T("tx2"), lColorIndex);
				lColorIndex._set(node.GetAttribute(_T("w:followedHyperlink")));	ColorMap.SetAt(_T("folHlink"), lColorIndex);
				lColorIndex._set(node.GetAttribute(_T("w:hyperlink")));			ColorMap.SetAt(_T("hlink"), lColorIndex);
			}

			virtual CString toXML() const
			{
				XmlUtils::CAttribute oAttr;
				
				POSITION pos = ColorMap.GetStartPosition();
				while (NULL != pos)
				{
					oAttr.Write(ColorMap.GetKeyAt(pos), ColorMap.GetValueAt(pos).get());
					ColorMap.GetNext(pos);
				}

				return XmlUtils::CreateNode(m_name, oAttr);
			}
			virtual void toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const
			{
				pWriter->StartNode(m_name);

				pWriter->StartAttributes();
				POSITION pos = ColorMap.GetStartPosition();
				while (NULL != pos)
				{
					pWriter->WriteAttribute(ColorMap.GetKeyAt(pos), ColorMap.GetValueAt(pos).get());
					ColorMap.GetNext(pos);
				}
				pWriter->EndAttributes();

				pWriter->EndNode(m_name);
			}

			virtual CString GetColorSchemeIndex(const CString& str)const
			{
				const CAtlMap<CString, Limit::ColorSchemeIndex>::CPair* pPair = ColorMap.Lookup(str);
				if (NULL != pPair)
					return pPair->m_value.get();
				return str;
			}

			virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
			{
				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeStart);

				POSITION pos = ColorMap.GetStartPosition();

				while (NULL != pos)
				{
					const CAtlMap<CString, Limit::ColorSchemeIndex>::CPair* pPair = ColorMap.GetNext(pos);
					pWriter->WriteLimit1(SchemeClr_GetBYTECode(pPair->m_key), pPair->m_value);
				}

				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeEnd);
			}

			virtual void fromPPTY(NSBinPptxRW::CBinaryFileReader* pReader)
			{
				LONG _e = pReader->GetPos() + pReader->GetLong() + 4;

				pReader->Skip(1); 

				while (true)
				{
					BYTE _at = pReader->GetUChar();
					if (_at == NSBinPptxRW::g_nodeAttributeEnd)
						break;

					BYTE ind = pReader->GetUChar();
					Limit::ColorSchemeIndex _index;
					_index.SetStringCode(ind);

					ColorMap.SetAt(SchemeClr_GetStringCode(_at), _index);
				}

				pReader->Seek(_e);				
			}

		public:

			CAtlMap<CString, Limit::ColorSchemeIndex> ColorMap;

		public:
			CString			m_name;
		protected:
			virtual void FillParentPointersForChilds(){};
		};
	} 
} 

#endif // PPTX_LOGIC_CLRMAP_INCLUDE_H_