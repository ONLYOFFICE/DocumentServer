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
#ifndef PPTX_LOGIC_TABLEBGSTYLE_INCLUDE_H_
#define PPTX_LOGIC_TABLEBGSTYLE_INCLUDE_H_

#include "./../WrapperWritingElement.h"
#include "UniFill.h"
#include "FillStyle.h"
#include "StyleRef.h"
#include "../Theme.h"

namespace PPTX
{
	namespace Logic
	{
		class TableBgStyle : public WrapperWritingElement
		{
		public:
			PPTX_LOGIC_BASE(TableBgStyle)

		public:
			virtual void fromXML(XmlUtils::CXmlNode& node)
			{
				fill	= node.ReadNode(_T("a:fill"));
				fillRef = node.ReadNodeNoNS(_T("fillRef"));

				FillParentPointersForChilds();
			}
			virtual CString toXML() const
			{
				XmlUtils::CNodeValue oValue;
				oValue.WriteNullable(fill);
				oValue.WriteNullable(fillRef);

				return XmlUtils::CreateNode(_T("a:tblBg"), oValue);
			}

			virtual void toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const
			{
				pWriter->StartNode(_T("a:tblBg"));
				pWriter->EndAttributes();

				pWriter->Write(fill);
				pWriter->Write(fillRef);

				pWriter->EndNode(_T("a:tblBg"));
			}

			virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
			{
				pWriter->WriteRecord2(0, fill);
				pWriter->WriteRecord2(1, fillRef);
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
							fill = new FillStyle();
							fill->fromPPTY(pReader);							
							break;
						}
						case 1:
						{
							fillRef = new StyleRef();
							fillRef->fromPPTY(pReader);
							fillRef->m_name = _T("a:fillRef");
							break;
						}
						default:
							break;
					}
				}				

				pReader->Seek(_end_rec);
			}

		public:
			
			
			
			nullable<FillStyle>	fill;
			nullable<StyleRef>	fillRef;

			const UniFill GetFillStyle(UniColor& Color)const
			{
				UniFill result;
				result.SetParentFilePointer(parentFile);
				UniColor resColor;
				resColor.SetParentFilePointer(parentFile);
				Color = resColor;

				if(fill.IsInit())
					return fill->Fill;
				if(fillRef.IsInit())
				{
					m_Theme->GetFillStyle(fillRef->idx.get_value_or(0), result);
					Color = fillRef->Color;
					return result;
				}
				return result;
			}
		protected:
			virtual void FillParentPointersForChilds()
			{
				if(fill.IsInit())
					fill->SetParentPointer(this);
				if(fillRef.IsInit())
					fillRef->SetParentPointer(this);
			}

		public:
			void SetTheme(const smart_ptr<PPTX::Theme> theme)
			{
				m_Theme = theme;
			}
		private:
			smart_ptr<PPTX::Theme> m_Theme;
		};
	} 
} 

#endif // PPTX_LOGIC_TABLEBGSTYLE_INCLUDE_H