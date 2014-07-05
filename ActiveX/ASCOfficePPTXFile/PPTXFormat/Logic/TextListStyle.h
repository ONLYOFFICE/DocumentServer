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
#ifndef PPTX_LOGIC_TEXTSTYLE_INCLUDE_H_
#define PPTX_LOGIC_TEXTSTYLE_INCLUDE_H_

#include "./../WrapperWritingElement.h"
#include "TextParagraphPr.h"

namespace PPTX
{
	namespace Logic
	{

		class TextListStyle : public WrapperWritingElement
		{
		public:
			PPTX_LOGIC_BASE(TextListStyle)

		public:
			virtual void fromXML(XmlUtils::CXmlNode& node)
			{
				m_name = node.GetName();

				 levels[9] = node.ReadNode(_T("a:defPPr"));
				levels[0] = node.ReadNode(_T("a:lvl1pPr"));
				levels[1] = node.ReadNode(_T("a:lvl2pPr"));
				levels[2] = node.ReadNode(_T("a:lvl3pPr"));
				levels[3] = node.ReadNode(_T("a:lvl4pPr"));
				levels[4] = node.ReadNode(_T("a:lvl5pPr"));
				levels[5] = node.ReadNode(_T("a:lvl6pPr"));
				levels[6] = node.ReadNode(_T("a:lvl7pPr"));
				levels[7] = node.ReadNode(_T("a:lvl8pPr"));
				levels[8] = node.ReadNode(_T("a:lvl9pPr"));

				FillParentPointersForChilds();
			}
			virtual CString toXML() const
			{
				XmlUtils::CNodeValue oValue;
				oValue.WriteNullable(  levels[9]);
				oValue.WriteNullable( levels[0]);
				oValue.WriteNullable( levels[1]);
				oValue.WriteNullable( levels[2]);
				oValue.WriteNullable( levels[3]);
				oValue.WriteNullable( levels[4]);
				oValue.WriteNullable( levels[5]);
				oValue.WriteNullable( levels[6]);
				oValue.WriteNullable( levels[7]);
				oValue.WriteNullable( levels[8]);

				return XmlUtils::CreateNode(m_name, oValue);
			}

			virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
			{
				pWriter->WriteRecord2(0, levels[0]);
				pWriter->WriteRecord2(1, levels[1]);
				pWriter->WriteRecord2(2, levels[2]);
				pWriter->WriteRecord2(3, levels[3]);
				pWriter->WriteRecord2(4, levels[4]);
				pWriter->WriteRecord2(5, levels[5]);
				pWriter->WriteRecord2(6, levels[6]);
				pWriter->WriteRecord2(7, levels[7]);
				pWriter->WriteRecord2(8, levels[8]);
				pWriter->WriteRecord2(9, levels[9]);
			}
			virtual void toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const
			{
				pWriter->StartNode(m_name);				
				pWriter->EndAttributes();

				pWriter->Write(  levels[9]);
				pWriter->Write( levels[0]);
				pWriter->Write( levels[1]);
				pWriter->Write( levels[2]);
				pWriter->Write( levels[3]);
				pWriter->Write( levels[4]);
				pWriter->Write( levels[5]);
				pWriter->Write( levels[6]);
				pWriter->Write( levels[7]);
				pWriter->Write( levels[8]);

				pWriter->EndNode(m_name);
			}
			virtual void fromPPTY(NSBinPptxRW::CBinaryFileReader* pReader)
			{
				LONG _end_rec = pReader->GetPos() + pReader->GetLong() + 4;

				CString arr_names[10] = {_T("a:lvl1pPr"), _T("a:lvl2pPr"), _T("a:lvl3pPr"), _T("a:lvl4pPr"), _T("a:lvl5pPr"), 
					_T("a:lvl6pPr"), _T("a:lvl7pPr"), _T("a:lvl8pPr"), _T("a:lvl9pPr"), _T("a:defPPr")};

				while (pReader->GetPos() < _end_rec)
				{
					BYTE _at = pReader->GetUChar();
					levels[_at] = new TextParagraphPr();
					levels[_at]->m_name = arr_names[_at];
					levels[_at]->fromPPTY(pReader);
				}

				pReader->Seek(_end_rec);				
			}

			void Merge(nullable<TextListStyle>& lstStyle)const
			{
				if(!lstStyle.is_init())
					lstStyle = TextListStyle();
				for(int i = 0; i < 10; i++)
					if(levels[i].is_init())
						levels[i]->Merge(lstStyle->levels[i]);
			}
		public:
			nullable<TextParagraphPr> levels[10];
		
		public:
			mutable CString m_name;
		protected:
			virtual void FillParentPointersForChilds()
			{
				for(int i = 0; i < 10; i++)
				{
					if(levels[i].is_init())
						levels[i]->SetParentPointer(this);
				}
			}
		};
	} 
} 

#endif // PPTX_LOGIC_TEXTSTYLE_INCLUDE_H_