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
#ifndef PPTX_LOGIC_RUN_INCLUDE_H_
#define PPTX_LOGIC_RUN_INCLUDE_H_

#include "RunBase.h"
#include "./../RunProperties.h"


namespace PPTX
{
	namespace Logic
	{
		class Run : public RunBase
		{
		public:
			PPTX_LOGIC_BASE(Run)

			Run& operator=(const Run& oSrc)
			{
				parentFile		= oSrc.parentFile;
				parentElement	= oSrc.parentElement;

				rPr = oSrc.rPr;
				text = oSrc.text;

				return *this;
			}

		public:
			virtual void fromXML(XmlUtils::CXmlNode& node)
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

						if (_T("rPr") == strName)
						{
							rPr = oNode;
						}
						else if (_T("t") == strName)
						{
							if (!text.IsInit())
								text = oNode.GetTextExt();
						}
					}
				}
				
				FillParentPointersForChilds();
			}

			virtual CString toXML() const
			{
				XmlUtils::CNodeValue oValue;
				oValue.WriteNullable(rPr);
				
				if (text.IsInit())
					oValue.m_strValue += (_T("<a:t>") + *text + _T("</a:t>"));

				return XmlUtils::CreateNode(_T("a:r"), oValue);
			}

			virtual void toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const
			{
				pWriter->StartNode(_T("a:r"));
				pWriter->EndAttributes();

				if (rPr.is_init())
					rPr->m_name = _T("a:rPr");
				pWriter->Write(rPr);

				if (text.is_init())
				{
					pWriter->WriteString(_T("<a:t>"));
					pWriter->WriteStringXML(*text);
					pWriter->WriteString(_T("</a:t>"));
				}
				
				pWriter->EndNode(_T("a:r"));
			}

			virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
			{
				pWriter->StartRecord(PARRUN_TYPE_RUN);

				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeStart);
				pWriter->WriteString2(0, text);
				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeEnd);

				pWriter->WriteRecord2(0, rPr);

				pWriter->EndRecord();

				if (pWriter->m_oCommon.m_pNativePicker->m_bIsEmbeddedFonts)
					pWriter->m_oCommon.m_pNativePicker->m_oEmbeddedFonts.CheckString(text);
			}

			virtual CString GetText()const{return text.get_value_or(_T(""));};
			void SetText(const CString& srcText)
			{
				text = srcText;
			}
		public:
			nullable<RunProperties> rPr;
		private:
			nullable_string			text;
		protected:
			virtual void FillParentPointersForChilds()
			{
				if(rPr.IsInit())
					rPr->SetParentPointer(this);
			}
		};
	} 
} 

#endif // PPTX_LOGIC_RUN_INCLUDE_H