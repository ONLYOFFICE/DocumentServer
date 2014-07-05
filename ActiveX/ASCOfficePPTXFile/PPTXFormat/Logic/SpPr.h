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
#ifndef PPTX_LOGIC_SPPR_INCLUDE_H_
#define PPTX_LOGIC_SPPR_INCLUDE_H_

#include "./../WrapperWritingElement.h"
#include "./../Limit/BWMode.h"
#include "Xfrm.h"
#include "UniFill.h"
#include "Ln.h"
#include "EffectProperties.h"
#include "Scene3d.h"
#include "Sp3d.h"
#include "Geometry.h"

namespace PPTX
{
	namespace Logic
	{
		class SpPr : public WrapperWritingElement
		{
		public:
			SpPr();
			virtual ~SpPr();			
			explicit SpPr(XmlUtils::CXmlNode& node);
			const SpPr& operator =(XmlUtils::CXmlNode& node);

		public:
			virtual void fromXML(XmlUtils::CXmlNode& node);
			virtual CString toXML() const;

			virtual void toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const
			{
				if (pWriter->m_lDocType == XMLWRITER_DOC_TYPE_DOCX)
				{
					if (0 == (pWriter->m_lFlag & 0x01))
						pWriter->StartNode(_T("wps:spPr"));
					else
						pWriter->StartNode(_T("pic:spPr"));
				}
				else if (pWriter->m_lDocType == XMLWRITER_DOC_TYPE_XLSX)
					pWriter->StartNode(_T("xdr:spPr"));
				else if (pWriter->m_lDocType == XMLWRITER_DOC_TYPE_CHART)
					pWriter->StartNode(_T("c:spPr"));
				else
					pWriter->StartNode(_T("p:spPr"));
				
				pWriter->StartAttributes();
				pWriter->WriteAttribute(_T("bwMode"), bwMode);
				pWriter->EndAttributes();
				
				pWriter->Write(xfrm);
				Geometry.toXmlWriter(pWriter);

				if ((pWriter->m_lFlag & 0x02) != 0 && !Fill.is_init())
				{
					pWriter->WriteString(_T("<a:grpFill/>"));
				}
				Fill.toXmlWriter(pWriter);
				
				pWriter->Write(ln);
				EffectList.toXmlWriter(pWriter);
				pWriter->Write(scene3d);
				pWriter->Write(sp3d);

				if (pWriter->m_lDocType == XMLWRITER_DOC_TYPE_DOCX)
				{
					if (0 == (pWriter->m_lFlag & 0x01))
						pWriter->EndNode(_T("wps:spPr"));
					else
						pWriter->EndNode(_T("pic:spPr"));
				}
				else if (pWriter->m_lDocType == XMLWRITER_DOC_TYPE_XLSX)
					pWriter->EndNode(_T("xdr:spPr"));
				else if (pWriter->m_lDocType == XMLWRITER_DOC_TYPE_CHART)
					pWriter->EndNode(_T("c:spPr"));
				else
					pWriter->EndNode(_T("p:spPr"));
			}

			virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
			{
				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeStart);
				pWriter->WriteLimit2(0, bwMode);
				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeEnd);

				pWriter->WriteRecord2(0, xfrm);
				pWriter->WriteRecord1(1, Geometry);
				pWriter->WriteRecord1(2, Fill);
				pWriter->WriteRecord2(3, ln);
				pWriter->WriteRecord1(4, EffectList);
				pWriter->WriteRecord2(5, scene3d);
				pWriter->WriteRecord2(6, sp3d);
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

					if (0 == _at)
					{
						bwMode = new Limit::BWMode();
						bwMode->SetBYTECode(pReader->GetUChar());
					}
					else
						break;
				}

				while (pReader->GetPos() < _end_rec)
				{
					BYTE _at = pReader->GetUChar();
					switch (_at)
					{
						case 0:
						{
							xfrm = new Logic::Xfrm();
							xfrm->fromPPTY(pReader);
							break;
						}
						case 1:
						{
							Geometry.fromPPTY(pReader);
							break;
						}
						case 2:
						{
							Fill.fromPPTY(pReader);
							break;
						}
						case 3:
						{
							ln = new Logic::Ln();
							ln->fromPPTY(pReader);
							break;
						}
						case 4:
						{
							pReader->SkipRecord();
							break;
						}
						case 5:
						{
							pReader->SkipRecord();
							break;
						}
						case 6:
						{
							pReader->SkipRecord();
							break;
						}
						default:
							break;
					}
				}

				pReader->Seek(_end_rec);
			}

			void Merge(SpPr& spPr)const;

		public:
			nullable<Xfrm>				xfrm;
			Logic::Geometry				Geometry;
			UniFill						Fill;
			nullable<Ln>				ln;
			EffectProperties			EffectList;
			nullable<Scene3d>			scene3d;
			nullable<Sp3d>				sp3d;

			nullable_limit<Limit::BWMode> bwMode;
		
		public:
			CString m_namespace;
		protected:
			virtual void FillParentPointersForChilds();
		};
	} 
} 

#endif // PPTX_LOGIC_SPPR_INCLUDE_H