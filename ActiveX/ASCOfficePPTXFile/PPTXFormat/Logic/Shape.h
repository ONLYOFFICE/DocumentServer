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
#ifndef PPTX_LOGIC_SHAPE_INCLUDE_H_
#define PPTX_LOGIC_SHAPE_INCLUDE_H_

#include "./../WrapperWritingElement.h"
#include "NvSpPr.h"
#include "SpPr.h"
#include "ShapeStyle.h"
#include "TxBody.h"
#include "ShapeProperties.h"
#include "ShapeTextProperties.h"
#include "UniFill.h"
#include "Ln.h"



namespace PPTX
{
	namespace Logic
	{		
		class Shape : public WrapperWritingElement
		{
		public:
			Shape();
			virtual ~Shape();			
			explicit Shape(XmlUtils::CXmlNode& node);
			const Shape& operator =(XmlUtils::CXmlNode& node);

		public:
			virtual void fromXML(XmlUtils::CXmlNode& node);
			virtual CString toXML() const;
		public:
			CString GetText()const{if(txBody.IsInit()) return txBody->GetText(); return _T(""); };

			void GetShapeFullDescription(Shape& shape, int level = 0)const;
			void GetRect(RECT& pRect)const;
			DWORD GetFill(UniFill& fill)const;
			DWORD GetLine(Ln& line)const;

			void FillShapeProperties(ShapeProperties& props);
			void FillShapeTextProperties(CShapeTextProperties& props);

		private:
			void FillLevelUp()const;
			mutable Shape const * levelUp;
			void Merge(Shape& shape, bool bIsSlidePlaceholder = false)const;
		public:
			void SetLevelUpElement(const Shape& p)const{levelUp = &p;};

			virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
			{
				pWriter->StartRecord(SPTREE_TYPE_SHAPE);

				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeStart);
				pWriter->WriteBool2(0, attrUseBgFill);
				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeEnd);

				pWriter->WriteRecord1(0, nvSpPr);
				pWriter->WriteRecord1(1, spPr);
				pWriter->WriteRecord2(2, style);

				if (pWriter->m_pMainDocument != NULL)
				{
					if (TextBoxShape.is_init())
					{					
						LPSAFEARRAY psaData = NULL;
						BSTR bsTxContent = TextBoxShape->AllocSysString();

						DocxFile2::IAVSOfficeDocxFile2* pDocxFile2 = NULL;
						pWriter->m_pMainDocument->QueryInterface(DocxFile2::IID_IAVSOfficeDocxFile2, (void**)&pDocxFile2);
						
						ULONG lPos = pWriter->GetPosition();

						pDocxFile2->GetBinaryContent(bsTxContent, &psaData);					
						RELEASEINTERFACE(pDocxFile2);

						pWriter->SetPosition(lPos);

						pWriter->StartRecord(4);
						pWriter->WriteBYTEArray((BYTE*)psaData->pvData, psaData->rgsabound[0].cElements);
						pWriter->EndRecord();
						SysFreeString(bsTxContent);
						SafeArrayDestroy(psaData);

						if (TextBoxBodyPr.is_init())
						{
							pWriter->StartRecord(5);
							TextBoxBodyPr->toPPTY(pWriter);
							pWriter->EndRecord();
						}
					}
					else if (txBody.is_init())
					{
						CString strContent = txBody->GetDocxTxBoxContent(pWriter, style);

						LPSAFEARRAY psaData = NULL;
						BSTR bsTxContent = strContent.AllocSysString();

						DocxFile2::IAVSOfficeDocxFile2* pDocxFile2 = NULL;
						pWriter->m_pMainDocument->QueryInterface(DocxFile2::IID_IAVSOfficeDocxFile2, (void**)&pDocxFile2);
						
						pDocxFile2->GetBinaryContent(bsTxContent, &psaData);					
						RELEASEINTERFACE(pDocxFile2);

						pWriter->StartRecord(4);
						pWriter->WriteBYTEArray((BYTE*)psaData->pvData, psaData->rgsabound[0].cElements);
						pWriter->EndRecord();
						SysFreeString(bsTxContent);
						SafeArrayDestroy(psaData);

						pWriter->WriteRecord1(5, txBody->bodyPr);
					}
				}
				else
				{
					pWriter->WriteRecord2(3, txBody);
				}
				
				pWriter->EndRecord();
			}

			void toXmlWriterVML(NSBinPptxRW::CXmlWriter* pWriter, smart_ptr<PPTX::WrapperFile>& oTheme, smart_ptr<PPTX::WrapperWritingElement>& oClrMap);

			virtual void toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const
			{
				if (pWriter->m_lDocType == XMLWRITER_DOC_TYPE_DOCX)
					pWriter->StartNode(_T("wps:wsp"));
				else if (pWriter->m_lDocType == XMLWRITER_DOC_TYPE_XLSX)
					pWriter->StartNode(_T("xdr:sp"));
				else
					pWriter->StartNode(_T("p:sp"));

				pWriter->StartAttributes();
				pWriter->WriteAttribute(_T("useBgFill"), attrUseBgFill);
				pWriter->EndAttributes();

				if (pWriter->m_lDocType == XMLWRITER_DOC_TYPE_DOCX)
				{
					
					nvSpPr.cNvSpPr.toXmlWriter2(_T("wps"), pWriter);
				}
				else
					nvSpPr.toXmlWriter(pWriter);
				
				bool bIsPresentStyle = false;
				if (style.is_init() && (style->fillRef.idx.is_init() || style->fillRef.Color.Color.is_init()))
				{
					bIsPresentStyle = true;
				}
				if (pWriter->m_lGroupIndex > 1 && !bIsPresentStyle)
				{
					pWriter->m_lFlag += 0x02;
				}
				spPr.toXmlWriter(pWriter);
				if (pWriter->m_lGroupIndex > 1 && !bIsPresentStyle)
				{
					pWriter->m_lFlag -= 0x02;
				}

				if (style.is_init())
				{
					if (pWriter->m_lDocType == XMLWRITER_DOC_TYPE_DOCX)
						style->m_ns = _T("wps");
					else if (pWriter->m_lDocType == XMLWRITER_DOC_TYPE_XLSX)
						style->m_ns = _T("xdr");
				}

				pWriter->Write(style);

				if (pWriter->m_lDocType != XMLWRITER_DOC_TYPE_DOCX)
				{
					if (pWriter->m_lDocType == XMLWRITER_DOC_TYPE_XLSX && txBody.is_init())
						txBody->m_ns = _T("xdr");
					pWriter->Write(txBody);
				}

				if (pWriter->m_lDocType == XMLWRITER_DOC_TYPE_DOCX)
				{	
					bool bIsWritedBodyPr = false;
					if (TextBoxShape.is_init())
					{
						pWriter->WriteString(_T("<wps:txbx>"));
						pWriter->WriteString(*TextBoxShape);
						pWriter->WriteString(_T("</wps:txbx>"));

						if (TextBoxBodyPr.is_init())
						{
							TextBoxBodyPr->m_namespace = _T("wps");
							TextBoxBodyPr->toXmlWriter(pWriter);
							bIsWritedBodyPr = true;
						}
					}

					if (!bIsWritedBodyPr)
					{
						pWriter->WriteString(_T("<wps:bodyPr rot=\"0\"><a:prstTxWarp prst=\"textNoShape\"><a:avLst/></a:prstTxWarp><a:noAutofit/></wps:bodyPr>"));
					}
				}

				if (pWriter->m_lDocType == XMLWRITER_DOC_TYPE_DOCX)
					pWriter->EndNode(_T("wps:wsp"));
				else if (pWriter->m_lDocType == XMLWRITER_DOC_TYPE_XLSX)
					pWriter->EndNode(_T("xdr:sp"));
				else
					pWriter->EndNode(_T("p:sp"));
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
							attrUseBgFill = pReader->GetBool();
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
							nvSpPr.fromPPTY(pReader);
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
						case 3:
						{
							txBody = new TxBody();
							txBody->fromPPTY(pReader);
							break;
						}
						case 4:
						{
							if (NULL != pReader->m_pMainDocument && NULL != pReader->m_pSourceArray)
							{
								LONG lLenRec = pReader->GetLong();

								LONG lPosition = pReader->GetPos();

								DocxFile2::IAVSOfficeDocxFile2* pDocxFile2 = NULL;
								pReader->m_pMainDocument->QueryInterface(DocxFile2::IID_IAVSOfficeDocxFile2, (void**)&pDocxFile2);
																
								BSTR bsXmlContent = NULL;
								pDocxFile2->GetXmlContent(pReader->m_pSourceArray, pReader->GetPos(), lLenRec, &bsXmlContent);					
								RELEASEINTERFACE(pDocxFile2);

								CString strC = _T("<w:txbxContent>");
								strC += ((CString)(bsXmlContent));
								strC += _T("</w:txbxContent>");
								TextBoxShape = strC;

								SysFreeString(bsXmlContent);

								pReader->Seek(lPosition + lLenRec);
							}
							else
							{
								pReader->SkipRecord();
							}
							break;
						}
						case 5:
						{
							TextBoxBodyPr = new PPTX::Logic::BodyPr();
							TextBoxBodyPr->fromPPTY(pReader);
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
			NvSpPr					nvSpPr;
			SpPr					spPr;
			nullable<ShapeStyle>	style;
			nullable<TxBody>		txBody;

			nullable_string			TextBoxShape;
			nullable<BodyPr>		TextBoxBodyPr;

			bool								isFontRefInSlide;
			mutable nullable<TextParagraphPr>	body[10];
 
			
			nullable_bool			attrUseBgFill;
		protected:
			virtual void FillParentPointersForChilds();
		};
	} 
} 

#endif // PPTX_LOGIC_SHAPE_INCLUDE_H