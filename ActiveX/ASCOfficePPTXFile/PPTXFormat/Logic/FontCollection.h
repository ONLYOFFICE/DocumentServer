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
#ifndef PPTX_LOGIC_FONTCOLLECTION_INCLUDE_H_
#define PPTX_LOGIC_FONTCOLLECTION_INCLUDE_H_

#include "./../WrapperWritingElement.h"
#include "TextFont.h"
#include "SupplementalFont.h"

namespace PPTX
{
	namespace Logic
	{

		class FontCollection : public WrapperWritingElement
		{
		public:
			PPTX_LOGIC_BASE(FontCollection)

			FontCollection& operator=(const FontCollection& oSrc)
			{
				parentFile		= oSrc.parentFile;
				parentElement	= oSrc.parentElement;

				latin	= oSrc.latin;
				ea		= oSrc.ea;
				cs		= oSrc.cs;
				Fonts.Copy(oSrc.Fonts);

				m_name	= oSrc.m_name;

				return *this;
			}

		public:
			virtual void fromXML(XmlUtils::CXmlNode& node)
			{
				m_name = node.GetName();

				XmlUtils::CXmlNodes oNodes;
				if (node.GetNodes(_T("*"), oNodes))
				{
					int nCount = oNodes.GetCount();
					for (int i = 0; i < nCount; ++i)
					{
						XmlUtils::CXmlNode oNode;
						oNodes.GetAt(i, oNode);

						CString strName = XmlUtils::GetNameNoNS(oNode.GetName());

						if (_T("latin") == strName)
							latin = oNode;
						else if (_T("ea") == strName)
							ea = oNode;
						else if (_T("cs") == strName)
							cs = oNode;
						else if (_T("font") == strName)
							Fonts.Add(SupplementalFont(oNode));
					}
				}

				FillParentPointersForChilds();
			}
			virtual CString toXML() const
			{
				XmlUtils::CNodeValue oValue;
				oValue.Write(latin);
				oValue.Write(ea);
				oValue.Write(cs);
				oValue.WriteArray(Fonts);

				return XmlUtils::CreateNode(m_name, oValue);
			}

			virtual void toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const
			{
				pWriter->StartNode(m_name);
				pWriter->EndAttributes();

				latin.toXmlWriter(pWriter);
				ea.toXmlWriter(pWriter);				
				cs.toXmlWriter(pWriter);
				
				size_t nCount = Fonts.GetCount();
				for (size_t i = 0; i < nCount; ++i)
					Fonts[i].toXmlWriter(pWriter);

				pWriter->EndNode(m_name);
			}

			virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
			{
				pWriter->WriteRecord1(0, latin);
				pWriter->WriteRecord1(1, ea);
				pWriter->WriteRecord1(2, cs);
				pWriter->WriteRecordArray(3, 0, Fonts);
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
							latin.fromPPTY(pReader);
							latin.m_name = _T("a:latin");
							break;
						}
						case 1:
						{
							ea.fromPPTY(pReader);
							ea.m_name = _T("a:ea");
							break;
						}
						case 2:
						{
							cs.fromPPTY(pReader);
							cs.m_name = _T("a:cs");
							break;
						}
						case 3:
						{
							pReader->Skip(4);
							ULONG _c = pReader->GetULong();
							for (ULONG i = 0; i < _c; ++i)
							{
								pReader->Skip(1); 
								Fonts.Add();
								Fonts[i].m_name = _T("a:font");
								Fonts[i].fromPPTY(pReader);
							}
							break;
						}
						default:
							break;
					}
				}

				pReader->Seek(_end_rec);
			}

		public:
			TextFont					latin;
			TextFont					ea;
			TextFont					cs;
			CAtlArray<SupplementalFont> Fonts;
		
		public:
			CString m_name;
		protected:
			virtual void FillParentPointersForChilds()
			{
				latin.SetParentPointer(this);
				ea.SetParentPointer(this);
				cs.SetParentPointer(this);

				size_t count = Fonts.GetCount();
				for (size_t i = 0; i < count; ++i)
					Fonts[i].SetParentPointer(this);
			}
		};
	} 
} 

#endif // PPTX_LOGIC_FONTCOLLECTION_INCLUDE_H_