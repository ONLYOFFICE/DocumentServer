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
#ifndef PPTX_SLIDES_COMMON_SLIDE_DATA_INCLUDE_H_
#define PPTX_SLIDES_COMMON_SLIDE_DATA_INCLUDE_H_

#include "./../WrapperWritingElement.h"
#include "Bg.h"
#include "SpTree.h"

namespace PPTX
{
	namespace Logic
	{
		class CSld : public WrapperWritingElement
		{
		public:
			PPTX_LOGIC_BASE(CSld)

		public:
			virtual void fromXML(XmlUtils::CXmlNode& node)
			{
				node.ReadAttributeBase(L"name", attrName);
				bg			= node.ReadNode(_T("p:bg"));
				spTree		= node.ReadNodeNoNS(_T("spTree"));
				
				FillParentPointersForChilds();
			}

			virtual CString toXML() const
			{
				XmlUtils::CAttribute oAttr;
				oAttr.Write(_T("name"), attrName);

				XmlUtils::CNodeValue oValue;
				oValue.WriteNullable(bg);
				oValue.Write(spTree);

				return XmlUtils::CreateNode(_T("p:cSld"), oAttr, oValue);
			}

			virtual void toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const
			{
				pWriter->StartNode(_T("p:cSld"));

				pWriter->StartAttributes();
				pWriter->WriteAttribute2(_T("name"), attrName);
				pWriter->EndAttributes();

				pWriter->Write(bg);
				spTree.toXmlWriter(pWriter);

				pWriter->EndNode(_T("p:cSld"));
			}

			virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
			{
				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeStart);
				pWriter->WriteString2(0, attrName);
				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeEnd);

				pWriter->WriteRecord2(0, bg);
				pWriter->WriteRecord1(1, spTree);
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

					if (0 == _at)
						attrName = pReader->GetString2();
					else
						break;
				}

				while (pReader->GetPos() < _end_rec)
				{
					BYTE _at = pReader->GetUChar();
					switch (_at)
					{
						case 0:
						{
							bg = new Bg();
							bg->fromPPTY(pReader);
							break;
						}
						case 1:
						{
							spTree.m_name = _T("p:spTree");
							spTree.fromPPTY(pReader);
							break;
						}
						default:
						{
							pReader->Seek(_end_rec);
							return;
						}
					}
				}

				pReader->Seek(_end_rec);
			}

		public:
			nullable_string			attrName;

			nullable<Bg>			bg;
			SpTree					spTree;
			
			
		protected:
			virtual void FillParentPointersForChilds()
			{
				if(bg.IsInit())
					bg->SetParentPointer(this);
				spTree.SetParentPointer(this);
			}
		};
	} 
} 

#endif // PPTX_SLIDES_COMMON_SLIDE_DATA_INCLUDE_H_