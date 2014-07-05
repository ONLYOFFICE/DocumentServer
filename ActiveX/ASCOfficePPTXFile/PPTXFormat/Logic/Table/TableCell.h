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
#ifndef PPTX_LOGIC_TABLE_CELL_INCLUDE_H_
#define PPTX_LOGIC_TABLE_CELL_INCLUDE_H_

#include "./../../WrapperWritingElement.h"
#include "./../TxBody.h"
#include "TableCellProperties.h"
#include "../ShapeProperties.h"

namespace PPTX
{
	namespace Logic
	{
		class TableCell : public WrapperWritingElement
		{
		public:
			TableCell();
			virtual ~TableCell();			
			explicit TableCell(XmlUtils::CXmlNode& node);
			const TableCell& operator =(XmlUtils::CXmlNode& node);

		public:
			virtual void fromXML(XmlUtils::CXmlNode& node);
			virtual CString toXML() const;

			virtual void GetShapeProperties(ShapeProperties& props)const;

			virtual void toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const
			{
				pWriter->StartNode(_T("a:tc"));

				pWriter->StartAttributes();

				pWriter->WriteAttribute(_T("rowSpan"), RowSpan);
				pWriter->WriteAttribute(_T("gridSpan"), GridSpan);
				pWriter->WriteAttribute(_T("hMerge"), HMerge);
				pWriter->WriteAttribute(_T("vMerge"), VMerge);
				pWriter->WriteAttribute(_T("id"), Id);

				pWriter->EndAttributes();

				pWriter->Write(TxBody);
				pWriter->Write(CellProperties);				

				pWriter->EndNode(_T("a:tc"));
			}

			virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
			{
				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeStart);
				pWriter->WriteString2(0, Id);
				pWriter->WriteInt2(1, RowSpan);
				pWriter->WriteInt2(2, GridSpan);
				pWriter->WriteBool2(3, HMerge);
				pWriter->WriteBool2(4, VMerge);
				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeEnd);

				pWriter->WriteRecord2(0, CellProperties);
				pWriter->WriteRecord2(1, TxBody);
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
							Id = pReader->GetString2();
							break;
						}
						case 1:
						{
							RowSpan = pReader->GetLong();
							break;
						}
						case 2:
						{
							GridSpan = pReader->GetLong();
							break;
						}
						case 3:
						{
							HMerge = pReader->GetBool();
							break;
						}
						case 4:
						{
							VMerge = pReader->GetBool();
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
							CellProperties = new TableCellProperties();
							CellProperties->fromPPTY(pReader);
							break;
						}
						case 1:
						{
							TxBody = new Logic::TxBody();
							TxBody->fromPPTY(pReader);
							TxBody->m_ns = _T("a");
							break;
						}
						default:
							break;
					}
				}				

				pReader->Seek(_end_rec);
			}

		public:
			nullable<TxBody>				TxBody;
			nullable<TableCellProperties>	CellProperties;
			nullable_int					RowSpan;
			nullable_int					GridSpan;
			nullable_bool					HMerge;
			nullable_bool					VMerge;
			nullable_string					Id;
		protected:
			virtual void FillParentPointersForChilds();
		};
	} 
} 

#endif // PPTX_LOGIC_TABLE_CELL_INCLUDE_H_