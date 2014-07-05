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
#ifndef PPTX_THEME_EXTRACLRSCHEME_INCLUDE_H_
#define PPTX_THEME_EXTRACLRSCHEME_INCLUDE_H_

#include "./../WrapperWritingElement.h"
#include "ClrScheme.h"
#include "./../Logic/ClrMap.h"

namespace PPTX
{
	namespace nsTheme
	{
		class ExtraClrScheme : public WrapperWritingElement
		{
		public:
			PPTX_LOGIC_BASE(ExtraClrScheme)

		public:
			virtual void fromXML(XmlUtils::CXmlNode& node)
			{
				clrScheme	= node.ReadNode(_T("a:clrScheme"));
				clrMap		= node.ReadNode(_T("a:clrMap"));

				FillParentPointersForChilds();
			}
			virtual CString toXML() const
			{
				XmlUtils::CNodeValue oValue;
				oValue.Write(clrScheme);
				oValue.WriteNullable(clrMap);

				return XmlUtils::CreateNode(_T("a:extraClrScheme"), oValue);
			}

			virtual void toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const
			{
				pWriter->StartNode(_T("a:extraClrScheme"));
				pWriter->EndAttributes();

				clrScheme.toXmlWriter(pWriter);
				pWriter->Write(clrMap);

				pWriter->EndNode(_T("a:extraClrScheme"));
			}

			virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
			{
				pWriter->WriteRecord1(0, clrScheme);
				pWriter->WriteRecord2(1, clrMap);
			}
			virtual void fromPPTY(NSBinPptxRW::CBinaryFileReader* pReader)
			{
				LONG _e = pReader->GetPos() + pReader->GetLong() + 4;

				while (pReader->GetPos() < _e)
				{
					BYTE _rec = pReader->GetUChar();

					switch (_rec)
					{
						case 0:
						{
							clrScheme.fromPPTY(pReader);
							break;
						}
						case 1:
						{
							clrMap = new Logic::ClrMap();
							clrMap->m_name = _T("a:clrMap");
							clrMap->fromPPTY(pReader);
							break;
						}
						default:
							break;
					}
				}

				pReader->Seek(_e);				
			}

		public:
			ClrScheme				clrScheme;
			nullable<Logic::ClrMap> clrMap;
		protected:
			virtual void FillParentPointersForChilds()
			{
				clrScheme.SetParentPointer(this);
				if(clrMap.is_init())
					clrMap->SetParentPointer(this);
			}
		};
	} 
} 

#endif // PPTX_THEME_EXTRACLRSCHEME_INCLUDE_H