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
#ifndef PPTX_LOGIC_TCSTYLE_INCLUDE_H_
#define PPTX_LOGIC_TCSTYLE_INCLUDE_H_

#include "./../WrapperWritingElement.h"
#include "TcBdr.h"
#include "Cell3D.h"
#include "FillStyle.h"
#include "StyleRef.h"

namespace PPTX
{
	namespace Logic
	{
		class TcStyle : public WrapperWritingElement
		{
		public:
			PPTX_LOGIC_BASE(TcStyle)

		public:
			virtual void fromXML(XmlUtils::CXmlNode& node)
			{
				tcBdr	= node.ReadNode(_T("a:tcBdr"));
				cell3D	= node.ReadNode(_T("a:cell3D"));
				fill	= node.ReadNode(_T("a:fill"));
				fillRef = node.ReadNodeNoNS(_T("fillRef"));

				FillParentPointersForChilds();
			}
			virtual CString toXML() const
			{
				XmlUtils::CNodeValue oValue;
				oValue.WriteNullable(tcBdr);
				oValue.WriteNullable(fill);
				oValue.WriteNullable(fillRef);
				oValue.WriteNullable(cell3D);

				return XmlUtils::CreateNode(_T("a:tcStyle"), oValue);
			}

			virtual void toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const
			{
				pWriter->StartNode(_T("a:tcStyle"));
				pWriter->EndAttributes();

				pWriter->Write(tcBdr);
				pWriter->Write(fillRef);
				pWriter->Write(fill);
				pWriter->Write(cell3D);

				pWriter->EndNode(_T("a:tcStyle"));
			}

			virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
			{
				pWriter->WriteRecord2(0, tcBdr);
				pWriter->WriteRecord2(1, fillRef);
				pWriter->WriteRecord2(2, fill);
				pWriter->WriteRecord2(3, cell3D);
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
							tcBdr = new TcBdr();
							tcBdr->fromPPTY(pReader);							
							break;
						}
						case 1:
						{
							fillRef = new StyleRef();
							fillRef->fromPPTY(pReader);
							fillRef->m_name = _T("a:fillRef");
							break;
						}
						case 2:
						{
							fill = new FillStyle();
							fill->fromPPTY(pReader);
							break;
						}
						case 3:
						{
							cell3D = new Cell3D();
							cell3D->fromPPTY(pReader);
							break;
						}
						default:
							break;
					}
				}				

				pReader->Seek(_end_rec);
			}

		public:
			nullable<TcBdr>			tcBdr;
			
			nullable<StyleRef>		fillRef;
			nullable<FillStyle>		fill;
			nullable<Cell3D>		cell3D;
		protected:
			virtual void FillParentPointersForChilds()
			{
				if(tcBdr.IsInit())
					tcBdr->SetParentPointer(this);
				if(fill.IsInit())
					fill->SetParentPointer(this);
				if(fillRef.IsInit())
					fillRef->SetParentPointer(this);
				if(cell3D.IsInit())
					cell3D->SetParentPointer(this);
			}
		};

	} 
} 

#endif // PPTX_LOGIC_TCSTYLE_INCLUDE_H