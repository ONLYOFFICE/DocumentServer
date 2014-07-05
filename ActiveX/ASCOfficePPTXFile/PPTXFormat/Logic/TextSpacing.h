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
#ifndef PPTX_LOGIC_TEXTSPACING_INCLUDE_H_
#define PPTX_LOGIC_TEXTSPACING_INCLUDE_H_

#include "./../WrapperWritingElement.h"

namespace PPTX
{
	namespace Logic
	{

		class TextSpacing : public WrapperWritingElement
		{
		public:
			PPTX_LOGIC_BASE(TextSpacing)

		public:
			virtual void fromXML(XmlUtils::CXmlNode& node)
			{
				m_name = node.GetName();

				node.ReadNode(_T("a:spcPct")).ReadAttributeBase(L"val", spcPct);
				node.ReadNode(_T("a:spcPts")).ReadAttributeBase(L"val", spcPts);

				Normalize();
			}
			virtual CString toXML() const
			{
				XmlUtils::CNodeValue oValue;
				
				if (spcPct.is_init())
				{
					oValue.m_strValue.Format(_T("<a:spcPct val=\"%d\" />"), *spcPct);
				}
				else
				{
					oValue.m_strValue.Format(_T("<a:spcPct val=\"%d\" />"), spcPts.get_value_or(0));
				}

				return XmlUtils::CreateNode(m_name, oValue);
			}
			virtual void toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const
			{
				pWriter->StartNode(m_name);				
				pWriter->EndAttributes();

				if (spcPct.is_init())
				{
					pWriter->StartNode(_T("a:spcPct"));
					pWriter->StartAttributes();
					pWriter->WriteAttribute(_T("val"), *spcPct);
					pWriter->EndAttributes();
					pWriter->EndNode(_T("a:spcPct"));					
				}
				else
				{
					pWriter->StartNode(_T("a:spcPts"));
					pWriter->StartAttributes();
					pWriter->WriteAttribute(_T("val"), spcPts.get_value_or(0));
					pWriter->EndAttributes();
					pWriter->EndNode(_T("a:spcPts"));
				}

				pWriter->EndNode(m_name);
			}

			virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
			{
				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeStart);
				pWriter->WriteInt2(0, spcPct);
				pWriter->WriteInt2(1, spcPts);
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
							spcPct = pReader->GetLong();					
							break;
						}
						case 1:
						{
							spcPts = pReader->GetLong();
							break;
						}						
						default:
							break;
					}
				}

				pReader->Seek(_end_rec);
			}

		public:
			nullable_int spcPct;
			nullable_int spcPts;

			int GetVal()const
			{
				if(spcPts.is_init())
					return -spcPts.get();
				else
					return spcPct.get_value_or(100000)/1000;
			}
		
		public:
			CString m_name;
		protected:
			virtual void FillParentPointersForChilds(){};

			AVSINLINE void Normalize()
			{
				spcPts.normalize(0, 158400);
			}
		};
	} 
} 

#endif // PPTX_LOGIC_TEXTSPACING_INCLUDE_H_