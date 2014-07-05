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
#ifndef PPTX_LOGIC_CXNSP_INCLUDE_H_
#define PPTX_LOGIC_CXNSP_INCLUDE_H_

#include "./../WrapperWritingElement.h"
#include "NvCxnSpPr.h"
#include "SpPr.h"
#include "ShapeStyle.h"


namespace PPTX
{
	namespace Logic
	{
		class CxnSp : public WrapperWritingElement
		{
		public:
			CxnSp();
			virtual ~CxnSp();			
			explicit CxnSp(XmlUtils::CXmlNode& node);
			const CxnSp& operator =(XmlUtils::CXmlNode& node);

		public:
			virtual void fromXML(XmlUtils::CXmlNode& node);
			virtual CString toXML() const;
			virtual void GetRect(RECT& pRect)const;

			DWORD GetLine(Ln& line)const;
			DWORD GetFill(UniFill& fill)const;

			virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
			{
				pWriter->StartRecord(SPTREE_TYPE_CXNSP);

				pWriter->WriteRecord1(0, nvCxnSpPr);
				pWriter->WriteRecord1(1, spPr);
				pWriter->WriteRecord2(2, style);

				pWriter->EndRecord();
			}

			virtual void toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const
			{
				pWriter->StartNode(_T("p:cxnSp"));
				pWriter->EndAttributes();

				nvCxnSpPr.toXmlWriter(pWriter);
				spPr.toXmlWriter(pWriter);
				pWriter->Write(style);

				pWriter->EndNode(_T("p:cxnSp"));
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
							nvCxnSpPr.fromPPTY(pReader);
							break;
						}
						case 1:
						{
							spPr.fromPPTY(pReader);
							break;
						}
						case 2:
						{
							style = new ShapeStyle();
							style->m_ns = _T("p");
							style->fromPPTY(pReader);
							break;
						}
						default:
						{
							break;
						}
					}
				}

				pReader->Seek(_end_rec);
			}

		public:
			NvCxnSpPr				nvCxnSpPr;
			SpPr					spPr;
			nullable<ShapeStyle>	style;
		protected:
			virtual void FillParentPointersForChilds();
		};
	} 
} 

#endif // PPTX_LOGIC_CXNSP_INCLUDE_H