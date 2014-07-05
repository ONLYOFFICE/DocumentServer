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
#ifndef PPTX_LOGIC_TABLESTYLE_INCLUDE_H_
#define PPTX_LOGIC_TABLESTYLE_INCLUDE_H_

#include "./../WrapperWritingElement.h"
#include "TableBgStyle.h"
#include "TablePartStyle.h"
#include "../Theme.h"

namespace PPTX
{
	namespace Logic
	{
		class TableStyle : public WrapperWritingElement
		{
		public:
			PPTX_LOGIC_BASE(TableStyle)

		public:
			virtual void fromXML(XmlUtils::CXmlNode& node)
			{
				m_name = node.GetName();

				node.ReadAttributeBase(L"styleId", styleId);
				node.ReadAttributeBase(L"styleName", styleName);

				tblBg		= node.ReadNode(_T("a:tblBg"));
				wholeTbl	= node.ReadNode(_T("a:wholeTbl"));
				band1H		= node.ReadNode(_T("a:band1H"));
				band2H		= node.ReadNode(_T("a:band2H"));
				band1V		= node.ReadNode(_T("a:band1V"));
				band2V		= node.ReadNode(_T("a:band2V"));
				lastCol		= node.ReadNode(_T("a:lastCol"));
				firstCol	= node.ReadNode(_T("a:firstCol"));
				lastRow		= node.ReadNode(_T("a:lastRow"));
				seCell		= node.ReadNode(_T("a:seCell"));
				swCell		= node.ReadNode(_T("a:swCell"));
				firstRow	= node.ReadNode(_T("a:firstRow"));
				neCell		= node.ReadNode(_T("a:neCell"));
				nwCell		= node.ReadNode(_T("a:nwCell"));

				FillParentPointersForChilds();
			}
			virtual CString toXML() const
			{
				XmlUtils::CAttribute oAttr;
				oAttr.Write(_T("styleId"), styleId);
				oAttr.Write(_T("styleName"), styleName);

				XmlUtils::CNodeValue oValue;
				oValue.WriteNullable(tblBg);
				oValue.WriteNullable(wholeTbl);
				oValue.WriteNullable(band1H);
				oValue.WriteNullable(band2H);
				oValue.WriteNullable(band1V);
				oValue.WriteNullable(band2V);
				oValue.WriteNullable(lastCol);
				oValue.WriteNullable(firstCol);
				oValue.WriteNullable(lastRow);
				oValue.WriteNullable(seCell);
				oValue.WriteNullable(swCell);
				oValue.WriteNullable(firstRow);
				oValue.WriteNullable(neCell);
				oValue.WriteNullable(nwCell);

				return XmlUtils::CreateNode(m_name, oAttr, oValue);
			}

			virtual void toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const
			{
				pWriter->StartNode(m_name);

				pWriter->StartAttributes();
				pWriter->WriteAttribute(_T("styleId"), styleId);
				pWriter->WriteAttribute(_T("styleName"), styleName);
				pWriter->EndAttributes();

				pWriter->Write(tblBg);
				pWriter->Write(wholeTbl);
				pWriter->Write(band1H);
				pWriter->Write(band2H);
				pWriter->Write(band1V);
				pWriter->Write(band2V);
				pWriter->Write(lastCol);
				pWriter->Write(firstCol);
				pWriter->Write(lastRow);
				pWriter->Write(seCell);
				pWriter->Write(swCell);
				pWriter->Write(firstRow);
				pWriter->Write(neCell);
				pWriter->Write(nwCell);

				pWriter->EndNode(m_name);
			}

			virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
			{
				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeStart);
				pWriter->WriteString1(0, styleId);
				pWriter->WriteString1(1, styleName);
				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeEnd);				

				pWriter->WriteRecord2(0, tblBg);
				pWriter->WriteRecord2(1, wholeTbl);

				pWriter->WriteRecord2(2, band1H);
				pWriter->WriteRecord2(3, band2H);

				pWriter->WriteRecord2(4, band1V);
				pWriter->WriteRecord2(5, band1V);

				pWriter->WriteRecord2(6, lastCol);
				pWriter->WriteRecord2(7, firstCol);

				pWriter->WriteRecord2(8, firstRow);
				pWriter->WriteRecord2(9, lastRow);

				pWriter->WriteRecord2(10, seCell);
				pWriter->WriteRecord2(11, swCell);

				pWriter->WriteRecord2(12, neCell);
				pWriter->WriteRecord2(13, nwCell);
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
							styleId = pReader->GetString2();
							break;
						}
						case 1:
						{
							styleName = pReader->GetString2();
							break;
						}
						default:
							break;
					}
				}

				while (pReader->GetPos() < _end_rec)
				{
					BYTE _at = pReader->GetUChar();
					switch (_at)
					{
						case 0:
						{
							tblBg = new TableBgStyle();
							tblBg->fromPPTY(pReader);							
							break;
						}
						case 1:
						{
							wholeTbl = new TablePartStyle();
							wholeTbl->fromPPTY(pReader);
							wholeTbl->m_name = _T("a:wholeTbl");
							break;
						}
						case 2:
						{
							band1H = new TablePartStyle();
							band1H->fromPPTY(pReader);
							band1H->m_name = _T("a:band1H");
							break;
						}
						case 3:
						{
							band2H = new TablePartStyle();
							band2H->fromPPTY(pReader);
							band2H->m_name = _T("a:band2H");
							break;
						}
						case 4:
						{
							band1V = new TablePartStyle();
							band1V->fromPPTY(pReader);
							band1V->m_name = _T("a:band1V");
							break;
						}
						case 5:
						{
							band2V = new TablePartStyle();
							band2V->fromPPTY(pReader);
							band2V->m_name = _T("a:band2V");
							break;
						}
						case 6:
						{
							lastCol = new TablePartStyle();
							lastCol->fromPPTY(pReader);
							lastCol->m_name = _T("a:lastCol");
							break;
						}
						case 7:
						{
							firstCol = new TablePartStyle();
							firstCol->fromPPTY(pReader);
							firstCol->m_name = _T("a:firstCol");
							break;
						}
						case 8:
						{
							firstRow = new TablePartStyle();
							firstRow->fromPPTY(pReader);
							firstRow->m_name = _T("a:firstRow");
							break;
						}
						case 9:
						{
							lastRow = new TablePartStyle();
							lastRow->fromPPTY(pReader);
							lastRow->m_name = _T("a:lastRow");
							break;
						}
						case 10:
						{
							seCell = new TablePartStyle();
							seCell->fromPPTY(pReader);
							seCell->m_name = _T("a:seCell");
							break;
						}
						case 11:
						{
							swCell = new TablePartStyle();
							swCell->fromPPTY(pReader);
							swCell->m_name = _T("a:swCell");
							break;
						}
						case 12:
						{
							neCell = new TablePartStyle();
							neCell->fromPPTY(pReader);
							neCell->m_name = _T("a:neCell");
							break;
						}
						case 13:
						{
							nwCell = new TablePartStyle();
							nwCell->fromPPTY(pReader);
							nwCell->m_name = _T("a:nwCell");
							break;
						}
						default:
							break;
					}
				}				

				pReader->Seek(_end_rec);
			}

		public:
			CString styleId;
			CString styleName;

			nullable<TableBgStyle>	 tblBg;
			nullable<TablePartStyle> wholeTbl;
			nullable<TablePartStyle> band1H;
			nullable<TablePartStyle> band2H;
			nullable<TablePartStyle> band1V;
			nullable<TablePartStyle> band2V;
			nullable<TablePartStyle> lastCol;
			nullable<TablePartStyle> firstCol;
			nullable<TablePartStyle> lastRow;
			nullable<TablePartStyle> seCell;
			nullable<TablePartStyle> swCell;
			nullable<TablePartStyle> firstRow;
			nullable<TablePartStyle> neCell;
			nullable<TablePartStyle> nwCell;
		
		public:
			CString m_name;
		protected:
			virtual void FillParentPointersForChilds()
			{
				if(tblBg.IsInit())
					tblBg->SetParentPointer(this);
				if(wholeTbl.IsInit())
					wholeTbl->SetParentPointer(this);
				if(band1H.IsInit())
					band1H->SetParentPointer(this);
				if(band2H.IsInit())
					band2H->SetParentPointer(this);
				if(band1V.IsInit())
					band1V->SetParentPointer(this);
				if(band2V.IsInit())
					band2V->SetParentPointer(this);
				if(lastCol.IsInit())
					lastCol->SetParentPointer(this);
				if(firstCol.IsInit())
					firstCol->SetParentPointer(this);
				if(lastRow.IsInit())
					lastRow->SetParentPointer(this);
				if(seCell.IsInit())
					seCell->SetParentPointer(this);
				if(swCell.IsInit())
					swCell->SetParentPointer(this);
				if(firstRow.IsInit())
					firstRow->SetParentPointer(this);
				if(neCell.IsInit())
					neCell->SetParentPointer(this);
				if(nwCell.IsInit())
					nwCell->SetParentPointer(this);
			}

		public:
			void SetTheme(const smart_ptr<PPTX::Theme> theme)
			{
				m_Theme = theme;
				if(tblBg.IsInit())
					tblBg->SetTheme(m_Theme);
				if(wholeTbl.IsInit())
					wholeTbl->SetTheme(m_Theme);
				if(band1H.IsInit())
					band1H->SetTheme(m_Theme);
				if(band2H.IsInit())
					band2H->SetTheme(m_Theme);
				if(band1V.IsInit())
					band1V->SetTheme(m_Theme);
				if(band2V.IsInit())
					band2V->SetTheme(m_Theme);
				if(lastCol.IsInit())
					lastCol->SetTheme(m_Theme);
				if(firstCol.IsInit())
					firstCol->SetTheme(m_Theme);
				if(lastRow.IsInit())
					lastRow->SetTheme(m_Theme);
				if(seCell.IsInit())
					seCell->SetTheme(m_Theme);
				if(swCell.IsInit())
					swCell->SetTheme(m_Theme);
				if(firstRow.IsInit())
					firstRow->SetTheme(m_Theme);
				if(neCell.IsInit())
					neCell->SetTheme(m_Theme);
				if(nwCell.IsInit())
					nwCell->SetTheme(m_Theme);
			}
		private:
			smart_ptr<PPTX::Theme> m_Theme;
		};
	} 
} 

#endif // PPTX_LOGIC_TABLESTYLE_INCLUDE_H