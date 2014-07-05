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
#ifndef PPTX_LOGIC_TABLE_INCLUDE_H_
#define PPTX_LOGIC_TABLE_INCLUDE_H_

#include "./../../WrapperWritingElement.h"
#include "TableCol.h"
#include "TableRow.h"
#include "TableProperties.h"

namespace PPTX
{
	namespace Logic
	{
		class Table : public WrapperWritingElement
		{
		public:
			PPTX_LOGIC_BASE(Table)

			Table& operator=(const Table& oSrc)
			{
				parentFile		= oSrc.parentFile;
				parentElement	= oSrc.parentElement;

				TableCols.Copy(oSrc.TableCols);
				TableRows.Copy(oSrc.TableRows);

				TableProperties = oSrc.TableProperties;
				return *this;
			}

		public:
			virtual void fromXML(XmlUtils::CXmlNode& node)
			{
				XmlUtils::CXmlNode oNode;
				if (node.GetNode(_T("a:tblGrid"), oNode))
					oNode.LoadArray(_T("a:gridCol"), TableCols);

				node.LoadArray(_T("a:tr"), TableRows);

				TableProperties = node.ReadNode(_T("a:tblPr"));

				FillParentPointersForChilds();
			}

			virtual CString toXML() const
			{
				XmlUtils::CNodeValue oValue;
				oValue.WriteNullable(TableProperties);
				oValue.WriteArray(TableRows);
				oValue.WriteArray(_T("a:tblGrid"), TableCols);

				return XmlUtils::CreateNode(_T("a:tbl"), oValue);
			}

			virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
			{
				pWriter->WriteRecord2(0, TableProperties);
				pWriter->WriteRecordArray(1, 0, TableCols);
				pWriter->WriteRecordArray(2, 0, TableRows);
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
							TableProperties = new Logic::TableProperties();
							TableProperties->fromPPTY(pReader);
							break;
						}
						case 1:
						{
							pReader->Skip(4);
							LONG lCount = pReader->GetLong();
							for (LONG i = 0; i < lCount; ++i)
							{
								pReader->Skip(1);
								TableCols.Add();
								TableCols[i].fromPPTY(pReader);
							}
							break;
						}
						case 2:
						{
							pReader->Skip(4);
							LONG lCount = pReader->GetLong();
							for (LONG i = 0; i < lCount; ++i)
							{
								pReader->Skip(1);
								TableRows.Add();
								TableRows[i].fromPPTY(pReader);
							}
						}
						default:
						{
							break;
						}
					}
				}

				pReader->Seek(_end_rec);
			}

			virtual void toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const
			{
				pWriter->StartNode(_T("a:tbl"));
				pWriter->EndAttributes();

				pWriter->Write(TableProperties);
				
				pWriter->WriteString(_T("<a:tblGrid>"));
				size_t n1 = TableCols.GetCount();
				for (size_t i = 0; i < n1; ++i)
					TableCols[i].toXmlWriter(pWriter);
				pWriter->WriteString(_T("</a:tblGrid>"));

				size_t n2 = TableRows.GetCount();
				for (size_t i = 0; i < n2; ++i)
					TableRows[i].toXmlWriter(pWriter);

				pWriter->EndNode(_T("a:tbl"));
			}
			
		public:
			CAtlArray<TableCol>			TableCols;
			CAtlArray<TableRow>			TableRows;
			nullable<TableProperties>	TableProperties;
		protected:
			virtual void FillParentPointersForChilds()
			{
				if (TableProperties.IsInit())
					TableProperties->SetParentPointer(this);
				
				size_t count = TableRows.GetCount();
				for (size_t i = 0; i < count; ++i)
					TableRows[i].SetParentPointer(this);
			}
		};
	} 
} 

#endif // PPTX_LOGIC_TABLE_INCLUDE_H_