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
#ifndef PPTX_LOGIC_C_NV_PROPERTIES_INCLUDE_H_
#define PPTX_LOGIC_C_NV_PROPERTIES_INCLUDE_H_

#include "./../WrapperWritingElement.h"
#include "Hyperlink.h"


namespace PPTX
{
	namespace Logic
	{
		class CNvPr : public WrapperWritingElement
		{
		public:
			PPTX_LOGIC_BASE(CNvPr)

		public:
			virtual void fromXML(XmlUtils::CXmlNode& node)
			{
				id		= node.ReadAttributeInt(L"id");
				name	= node.GetAttribute(L"name");
				node.ReadAttributeBase(L"descr", descr);
				node.ReadAttributeBase(L"hidden", hidden);
				node.ReadAttributeBase(L"title", title);

				hlinkClick = node.ReadNode(_T("a:hlinkClick"));
				hlinkHover = node.ReadNode(_T("a:hlinkHover"));

				Normalize();
			}

			virtual CString toXML() const
			{
				XmlUtils::CAttribute oAttr;
				oAttr.Write(_T("id"), id);
				oAttr.Write(_T("name"), name);
				oAttr.Write(_T("descr"), descr);
				oAttr.Write(_T("hidden"), hidden);
				oAttr.Write(_T("title"), title);

				XmlUtils::CNodeValue oValue;
				oValue.WriteNullable(hlinkClick);
				oValue.WriteNullable(hlinkHover);

				return XmlUtils::CreateNode(_T("p:cNvPr"), oAttr, oValue);
			}

			virtual void toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const
			{
				if (pWriter->m_lDocType == XMLWRITER_DOC_TYPE_DOCX)
					pWriter->StartNode(_T("pic:cNvPr"));
				else if (pWriter->m_lDocType == XMLWRITER_DOC_TYPE_XLSX)
					pWriter->StartNode(_T("xdr:cNvPr"));
				else
					pWriter->StartNode(_T("p:cNvPr"));

				int _id = id;
				if (_id < 0)
				{
					_id = pWriter->m_lObjectId;
					++pWriter->m_lObjectId;
				}
				else
				{
					if (pWriter->m_lObjectId <= _id)
					{
						pWriter->m_lObjectId = _id + 1;
					}
				}

				pWriter->StartAttributes();
				pWriter->WriteAttribute(_T("id"), _id);
				pWriter->WriteAttribute(_T("name"), name);
				pWriter->WriteAttribute(_T("descr"), descr);
				pWriter->WriteAttribute(_T("hidden"), hidden);
				pWriter->WriteAttribute(_T("title"), title);

				pWriter->EndAttributes();

				pWriter->Write(hlinkClick);
				pWriter->Write(hlinkHover);

				if (pWriter->m_lDocType == XMLWRITER_DOC_TYPE_DOCX)
					pWriter->EndNode(_T("pic:cNvPr"));
				else if (pWriter->m_lDocType == XMLWRITER_DOC_TYPE_XLSX)
					pWriter->EndNode(_T("xdr:cNvPr"));
				else
					pWriter->EndNode(_T("p:cNvPr"));
			}
			void toXmlWriter2(const CString& strNS, NSBinPptxRW::CXmlWriter* pWriter) const
			{
				
				

				pWriter->StartNode(strNS + _T(":cNvPr"));

				int _id = id;
				if (_id < 0)
				{
					_id = pWriter->m_lObjectId;
					++pWriter->m_lObjectId;
				}
				else
				{
					if (pWriter->m_lObjectId <= _id)
					{
						pWriter->m_lObjectId = _id + 1;
					}
				}

				pWriter->StartAttributes();
				pWriter->WriteAttribute(_T("id"), _id);
				pWriter->WriteAttribute(_T("name"), name);
				pWriter->WriteAttribute(_T("descr"), descr);
				pWriter->WriteAttribute(_T("hidden"), hidden);
				pWriter->WriteAttribute(_T("title"), title);

				pWriter->EndAttributes();

				pWriter->Write(hlinkClick);
				pWriter->Write(hlinkHover);

				pWriter->EndNode(strNS + _T(":cNvPr"));
			}

			virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
			{
				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeStart);
				pWriter->WriteInt1(0, id);
				pWriter->WriteString1(1, name);
				pWriter->WriteBool2(2, hidden);
				pWriter->WriteString2(3, title);
				pWriter->WriteString2(4, descr);
				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeEnd);

				pWriter->WriteRecord2(0, hlinkClick);
				pWriter->WriteRecord2(1, hlinkHover);
			}

			virtual void fromPPTY(NSBinPptxRW::CBinaryFileReader* pReader)
			{
				LONG _end_rec = pReader->GetPos() + pReader->GetLong() + 4;

				pReader->Skip(1); 

				id = 1;
				while (true)
				{
					BYTE _at = pReader->GetUChar();
					if (_at == NSBinPptxRW::g_nodeAttributeEnd)
						break;

					switch (_at)
					{
						case 0:
						{
							id = pReader->GetLong();
							break;
						}
						case 1:
						{
							name = pReader->GetString2();
							break;
						}
						case 2:
						{
							hidden = pReader->GetBool();
							break;
						}
						case 3:
						{
							title = pReader->GetString2();
							break;
						}
						case 4:
						{
							descr = pReader->GetString2();
							break;
						}
						default:
							break;
					}
				}

				

				pReader->Seek(_end_rec);
			}

		public:
			int					id;
			CString				name;
			nullable_string		descr;
			nullable_bool		hidden;
			nullable_string		title;
			nullable<Hyperlink> hlinkClick;
			nullable<Hyperlink> hlinkHover;
		protected:
			virtual void FillParentPointersForChilds()
			{
				if(hlinkClick.IsInit())
					hlinkClick->SetParentPointer(this);
				if(hlinkHover.IsInit())
					hlinkHover->SetParentPointer(this);
			}

			AVSINLINE void Normalize()
			{
				if (id < 0)
					id = 0;
			}
		};
	} 
} 

#endif // PPTX_LOGIC_C_NV_PROPERTIES_INCLUDE_H