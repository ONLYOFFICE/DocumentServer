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
#ifndef PPTX_LOGIC_CNVGRPSPPR_INCLUDE_H_
#define PPTX_LOGIC_CNVGRPSPPR_INCLUDE_H_

#include "./../WrapperWritingElement.h"

namespace PPTX
{
	namespace Logic
	{
		class CNvGrpSpPr : public WrapperWritingElement
		{
		public:
			PPTX_LOGIC_BASE(CNvGrpSpPr)

			CNvGrpSpPr& operator=(const CNvGrpSpPr& oSrc)
			{
				parentFile		= oSrc.parentFile;
				parentElement	= oSrc.parentElement;

				noChangeAspect	= oSrc.noChangeAspect;
				noGrp			= oSrc.noGrp;
				noMove			= oSrc.noMove;
				noResize		= oSrc.noResize;
				noRot			= oSrc.noRot;
				noSelect		= oSrc.noSelect;
				noUngrp			= oSrc.noUngrp;

				return *this;
			}

		public:
			virtual void fromXML(XmlUtils::CXmlNode& node)
			{
				XmlUtils::CXmlNode oNode;
				if (node.GetNode(_T("a:grpSpLocks"), oNode))
				{
					oNode.ReadAttributeBase(L"noChangeAspect", noChangeAspect);
					oNode.ReadAttributeBase(L"noGrp", noGrp);
					oNode.ReadAttributeBase(L"noMove", noMove);
					oNode.ReadAttributeBase(L"noResize", noResize);
					oNode.ReadAttributeBase(L"noRot", noRot);
					oNode.ReadAttributeBase(L"noSelect", noSelect);
					oNode.ReadAttributeBase(L"noUngrp", noUngrp);
				}
			}

			virtual CString toXML() const
			{
				XmlUtils::CAttribute oAttr;
				oAttr.Write(_T("noChangeAspect"), noChangeAspect);
				oAttr.Write(_T("noGrp"), noGrp);
				oAttr.Write(_T("noMove"), noMove);
				oAttr.Write(_T("noResize"), noResize);
				oAttr.Write(_T("noRot"), noRot);
				oAttr.Write(_T("noSelect"), noSelect);
				oAttr.Write(_T("noUngrp"), noUngrp);

				if (_T("") == oAttr.m_strValue)
					return _T("<p:cNvGrpSpPr/>");

				return _T("<p:cNvGrpSpPr>") + XmlUtils::CreateNode(_T("a:grpSpLocks"), oAttr) + _T("</p:cNvGrpSpPr>");
			}

			virtual void toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const
			{
				if (!noChangeAspect.is_init() &&
					!noGrp.is_init() &&
					!noMove.is_init() &&
					!noResize.is_init() &&
					!noRot.is_init() &&
					!noSelect.is_init() &&
					!noUngrp.is_init())
				{
					if (pWriter->m_lDocType == XMLWRITER_DOC_TYPE_XLSX)
						pWriter->WriteString(_T("<xdr:cNvGrpSpPr/>"));
					else
						pWriter->WriteString(_T("<p:cNvGrpSpPr/>"));
					return;
				}

				if (pWriter->m_lDocType == XMLWRITER_DOC_TYPE_XLSX)
					pWriter->WriteString(_T("<xdr:cNvGrpSpPr>"));
				else
					pWriter->WriteString(_T("<p:cNvGrpSpPr>"));

				pWriter->StartNode(_T("a:grpSpLocks"));

				pWriter->StartAttributes();
				pWriter->WriteAttribute(_T("noChangeAspect"), noChangeAspect);
				pWriter->WriteAttribute(_T("noGrp"), noGrp);
				pWriter->WriteAttribute(_T("noMove"), noMove);
				pWriter->WriteAttribute(_T("noResize"), noResize);
				pWriter->WriteAttribute(_T("noRot"), noRot);
				pWriter->WriteAttribute(_T("noSelect"), noSelect);
				pWriter->WriteAttribute(_T("noUngrp"), noUngrp);
				pWriter->EndAttributes();
				
				pWriter->EndNode(_T("a:grpSpLocks"));

				if (pWriter->m_lDocType == XMLWRITER_DOC_TYPE_XLSX)
					pWriter->WriteString(_T("</xdr:cNvGrpSpPr>"));
				else
					pWriter->WriteString(_T("</p:cNvGrpSpPr>"));
			}

			void toXmlWriter2(const CString& strNS, NSBinPptxRW::CXmlWriter* pWriter) const
			{
				if (!noChangeAspect.is_init() &&
					!noGrp.is_init() &&
					!noMove.is_init() &&
					!noResize.is_init() &&
					!noRot.is_init() &&
					!noSelect.is_init() &&
					!noUngrp.is_init())
				{
					pWriter->WriteString(_T("<") + strNS + _T(":cNvGrpSpPr/>"));
					return;
				}

				pWriter->StartNode(strNS + _T(":cNvGrpSpPr"));
				pWriter->StartNode(_T("a:grpSpLocks"));

				pWriter->StartAttributes();
				pWriter->WriteAttribute(_T("noChangeAspect"), noChangeAspect);
				pWriter->WriteAttribute(_T("noGrp"), noGrp);
				pWriter->WriteAttribute(_T("noMove"), noMove);
				pWriter->WriteAttribute(_T("noResize"), noResize);
				pWriter->WriteAttribute(_T("noRot"), noRot);
				pWriter->WriteAttribute(_T("noSelect"), noSelect);
				pWriter->WriteAttribute(_T("noUngrp"), noUngrp);
				pWriter->EndAttributes();
				
				pWriter->EndNode(_T("a:grpSpLocks"));
				pWriter->EndNode(strNS + _T(":cNvGrpSpPr"));
			}

			virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
			{
				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeStart);
				pWriter->WriteBool2(0, noChangeAspect);
				pWriter->WriteBool2(1, noGrp);
				pWriter->WriteBool2(2, noMove);
				pWriter->WriteBool2(3, noResize);
				pWriter->WriteBool2(4, noRot);
				pWriter->WriteBool2(5, noSelect);
				pWriter->WriteBool2(6, noUngrp);
				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeEnd);
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
							noChangeAspect = pReader->GetBool();
							break;
						}
						case 1:
						{
							noGrp = pReader->GetBool();
							break;
						}
						case 2:
						{
							noMove = pReader->GetBool();
							break;
						}
						case 3:
						{
							noResize = pReader->GetBool();
							break;
						}
						case 4:
						{
							noRot = pReader->GetBool();
							break;
						}
						case 5:
						{
							noSelect = pReader->GetBool();
							break;
						}
						case 6:
						{
							noUngrp = pReader->GetBool();
							break;
						}
						default:
							break;
					}
				}

				pReader->Seek(_end_rec);
			}

		public:
			nullable_bool		noChangeAspect;
			nullable_bool		noGrp;
			nullable_bool		noMove;
			nullable_bool		noResize;
			nullable_bool		noRot;
			nullable_bool		noSelect;
			nullable_bool		noUngrp;
		protected:
			virtual void FillParentPointersForChilds(){};
		};
	} 
} 

#endif // PPTX_LOGIC_CNVGRPSPPR_INCLUDE_H