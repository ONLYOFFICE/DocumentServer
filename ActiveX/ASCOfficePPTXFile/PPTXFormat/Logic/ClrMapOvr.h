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
#ifndef PPTX_SLIDES_CLRMAPOVR_INCLUDE_H_
#define PPTX_SLIDES_CLRMAPOVR_INCLUDE_H_

#include "./../WrapperWritingElement.h"
#include "ClrMap.h"

namespace PPTX
{
	namespace Logic
	{
		class ClrMapOvr : public WrapperWritingElement
		{
		public:
			PPTX_LOGIC_BASE(ClrMapOvr)

		public:
			virtual void fromXML(XmlUtils::CXmlNode& node)
			{
				overrideClrMapping = node.ReadNodeNoNS(_T("overrideClrMapping"));
				if (overrideClrMapping.is_init())
					overrideClrMapping->m_name = _T("a:overrideClrMapping");
				FillParentPointersForChilds();
			}

			virtual CString toXML() const
			{
				if (overrideClrMapping.IsInit())
					return _T("<p:clrMapOvr>") + overrideClrMapping->toXML() + _T("</p:clrMapOvr>");
				return _T("<p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr>");
			}

			virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
			{
				pWriter->WriteRecord2(0, overrideClrMapping);				
			}

			virtual void toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const
			{
				if (overrideClrMapping.is_init())
				{
					pWriter->WriteString(_T("<p:clrMapOvr>"));
					overrideClrMapping->m_name = _T("a:overrideClrMapping");
					overrideClrMapping->toXmlWriter(pWriter);
					pWriter->WriteString(_T("</p:clrMapOvr>"));
				}
				else
				{
					pWriter->WriteString(_T("<p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr>"));
				}
			}
			virtual void fromPPTY(NSBinPptxRW::CBinaryFileReader* pReader)
			{
				LONG _e = pReader->GetPos() + pReader->GetLong() + 4;

				if (pReader->GetPos() < _e)
				{
					pReader->Skip(1); 
					overrideClrMapping = new Logic::ClrMap();
					overrideClrMapping->fromPPTY(pReader);					
				}

				pReader->Seek(_e);
			}

		public:
			nullable<ClrMap> overrideClrMapping;
		protected:
			virtual void FillParentPointersForChilds()
			{
				if(overrideClrMapping.IsInit())
					overrideClrMapping->SetParentPointer(this);
			}
		};
	} 
} 

#endif // PPTX_SLIDES_CLRMAPOVR_INCLUDE_H_