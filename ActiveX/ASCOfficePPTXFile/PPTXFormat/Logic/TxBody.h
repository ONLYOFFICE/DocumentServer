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
#ifndef PPTX_LOGIC_TXBODY_INCLUDE_H_
#define PPTX_LOGIC_TXBODY_INCLUDE_H_

#include "./../WrapperWritingElement.h"
#include "BodyPr.h"
#include "TextListStyle.h"
#include "Paragraph.h"
#include "ShapeStyle.h"

namespace PPTX
{
	namespace Logic
	{
		class TxBody : public WrapperWritingElement
		{
		public:
			TxBody()	
			{
				m_ns = _T("p");
			}
			virtual ~TxBody() {}
			explicit TxBody(XmlUtils::CXmlNode& node)	{ fromXML(node); }
			const TxBody& operator =(XmlUtils::CXmlNode& node)
			{
				fromXML(node);
				return *this;
			}
			TxBody(const TxBody& oSrc) { *this = oSrc; }

			TxBody& operator=(const TxBody& oSrc)
			{
				parentFile		= oSrc.parentFile;
				parentElement	= oSrc.parentElement;

				bodyPr			= oSrc.bodyPr;
				lstStyle		= oSrc.lstStyle;
				Paragrs.Copy(oSrc.Paragrs);

				return *this;
			}

		public:
			virtual void fromXML(XmlUtils::CXmlNode& node)
			{
				Paragrs.RemoveAll();

				bodyPr		= node.ReadNode(_T("a:bodyPr"));
				lstStyle	= node.ReadNode(_T("a:lstStyle"));

				node.LoadArray(_T("a:p"), Paragrs);

				FillParentPointersForChilds();
			}
			virtual CString toXML() const
			{
				XmlUtils::CNodeValue oValue;
				oValue.Write(bodyPr);
				oValue.WriteNullable(lstStyle);
				oValue.WriteArray(Paragrs);

				return XmlUtils::CreateNode(_T("p:txBody"), oValue);
			}

			virtual void toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const
			{
				pWriter->StartNode(m_ns + _T(":txBody"));
				pWriter->EndAttributes();

				bodyPr.m_namespace = _T("a");
				bodyPr.toXmlWriter(pWriter);

				if (lstStyle.is_init())
					lstStyle->m_name = _T("a:lstStyle");
				pWriter->Write(lstStyle);
				
				size_t nCount = Paragrs.GetCount();
				for (size_t i = 0; i < nCount; ++i)
					Paragrs[i].toXmlWriter(pWriter);
				
				pWriter->EndNode(m_ns + _T(":txBody"));
			}

			void toXmlWriterExcel(NSBinPptxRW::CXmlWriter* pWriter) const
			{
				

				bodyPr.m_namespace = _T("a");
				bodyPr.toXmlWriter(pWriter);

				if (lstStyle.is_init())
					lstStyle->m_name = _T("a:lstStyle");
				pWriter->Write(lstStyle);
				
				size_t nCount = Paragrs.GetCount();
				for (size_t i = 0; i < nCount; ++i)
					Paragrs[i].toXmlWriter(pWriter);
				
				
			}

			CString GetText()const
			{
				CString result = _T("");
				size_t count = Paragrs.GetCount();

				for (size_t i = 0; i < count; ++i)
					result += Paragrs[i].GetText();
				return result;
			}

			void Merge(nullable<TxBody>& txBody)const
			{
				if(!txBody.is_init())
					txBody = new TxBody();
				bodyPr.Merge(txBody->bodyPr);
				if(lstStyle.is_init())
					lstStyle->Merge(txBody->lstStyle);
			}

			virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
			{
				pWriter->WriteRecord1(0, bodyPr);
				pWriter->WriteRecord2(1, lstStyle);
				pWriter->WriteRecordArray(2, 0, Paragrs);
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
							bodyPr.fromPPTY(pReader);
							break;
						}
						case 1:
						{
							lstStyle = new Logic::TextListStyle();
							lstStyle->fromPPTY(pReader);
							break;
						}
						case 2:
						{
							pReader->Skip(4);
							ULONG _c = pReader->GetULong();
							for (ULONG i = 0; i < _c; ++i)
							{
								pReader->Skip(1); 
								Paragrs.Add();
								Paragrs[Paragrs.GetCount() - 1].fromPPTY(pReader);								
							}
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
			BodyPr					bodyPr;
			nullable<TextListStyle> lstStyle;
			CAtlArray<Paragraph>	Paragrs;

			CString m_ns;
		protected:
			virtual void FillParentPointersForChilds()
			{
				bodyPr.SetParentPointer(this);
				if(lstStyle.is_init())
					lstStyle->SetParentPointer(this);
				
				size_t count = Paragrs.GetCount();
				for (size_t i = 0; i < count; ++i)
					Paragrs[i].SetParentPointer(this);
			}

		public:
			bool IsOneLineParagraphs() const
			{
				if (!bodyPr.wrap.is_init())
					return false;
				return (bodyPr.wrap->get() == _T("none"));
			}

			CString GetDocxTxBoxContent(NSBinPptxRW::CBinaryFileWriter* pWriter, const nullable<PPTX::Logic::ShapeStyle>& shape_style);
		};
	} 
} 

#endif // PPTX_LOGIC_TXBODY_INCLUDE_H