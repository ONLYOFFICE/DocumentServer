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
#ifndef PPTX_LOGIC_TXSTYLES_INCLUDE_H_
#define PPTX_LOGIC_TXSTYLES_INCLUDE_H_

#include "./../WrapperWritingElement.h"
#include "BodyPr.h"
#include "TextListStyle.h"
#include "Paragraph.h"

namespace PPTX
{
	namespace Logic
	{
		class TxStyles : public WrapperWritingElement
		{
		public:
			PPTX_LOGIC_BASE(TxStyles)

		public:
			virtual void fromXML(XmlUtils::CXmlNode& node)
			{
				XmlUtils::CXmlNodes oNodes;
				if (node.GetNodes(_T("*"), oNodes))
				{
					int nCount = oNodes.GetCount();
					for (int i = 0; i < nCount; ++i)
					{
						XmlUtils::CXmlNode oNode;
						oNodes.GetAt(i, oNode);

						CString strName = XmlUtils::GetNameNoNS(oNode.GetName());

						if (_T("titleStyle") == strName)
							titleStyle = oNode;
						else if (_T("bodyStyle") == strName)
							bodyStyle = oNode;
						else if (_T("otherStyle") == strName)
							otherStyle = oNode;
					}
				}

				FillParentPointersForChilds();
			}
			virtual CString toXML() const
			{
				XmlUtils::CNodeValue oValue;
				oValue.WriteNullable(titleStyle);
				oValue.WriteNullable(bodyStyle);
				oValue.WriteNullable(otherStyle);

				return XmlUtils::CreateNode(_T("p:txStyles"), oValue);
			}

			virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
			{
				pWriter->WriteRecord2(0, titleStyle);
				pWriter->WriteRecord2(1, bodyStyle);
				pWriter->WriteRecord2(2, otherStyle);
			}
			virtual void fromPPTY(NSBinPptxRW::CBinaryFileReader* pReader)
			{
				LONG end = pReader->GetPos() + pReader->GetLong() + 4;

				while (pReader->GetPos() < end)
				{
					BYTE _rec = pReader->GetUChar();

					switch (_rec)
					{
						case 0:
						{
							titleStyle = new TextListStyle();
							titleStyle->m_name = _T("p:titleStyle");
							titleStyle->fromPPTY(pReader);
							break;
						}
						case 1:
						{
							bodyStyle = new TextListStyle();
							bodyStyle->m_name = _T("p:bodyStyle");
							bodyStyle->fromPPTY(pReader);
							break;
						}
						case 2:
						{
							otherStyle = new TextListStyle();
							otherStyle->m_name = _T("p:otherStyle");
							otherStyle->fromPPTY(pReader);
							break;
						}
						default:
							break;
					}
				}

				pReader->Seek(end);
			}

			virtual void toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const
			{
				pWriter->StartNode(_T("p:txStyles"));
				pWriter->EndAttributes();

				pWriter->Write(titleStyle);
				pWriter->Write(bodyStyle);
				pWriter->Write(otherStyle);

				pWriter->EndNode(_T("p:txStyles"));
			}

		public:
			nullable<TextListStyle> titleStyle;
			nullable<TextListStyle> bodyStyle;
			nullable<TextListStyle> otherStyle;
		protected:
			virtual void FillParentPointersForChilds()
			{
				if(titleStyle.is_init())
					titleStyle->SetParentPointer(this);
				if(bodyStyle.is_init())
					bodyStyle->SetParentPointer(this);
				if(otherStyle.is_init())
					otherStyle->SetParentPointer(this);
			}
		};
	} 
} 

#endif // PPTX_LOGIC_TXSTYLES_INCLUDE_H