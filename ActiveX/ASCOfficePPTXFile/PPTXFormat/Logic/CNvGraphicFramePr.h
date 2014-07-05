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
#ifndef PPTX_LOGIC_CNVGRAPHICFRAMESPPR_INCLUDE_H_
#define PPTX_LOGIC_CNVGRAPHICFRAMESPPR_INCLUDE_H_

#include "./../WrapperWritingElement.h"

namespace PPTX
{
	namespace Logic
	{
		class CNvGraphicFramePr : public WrapperWritingElement
		{
		public:
			PPTX_LOGIC_BASE(CNvGraphicFramePr)

			CNvGraphicFramePr& operator=(const CNvGraphicFramePr& oSrc)
			{
				parentFile		= oSrc.parentFile;
				parentElement	= oSrc.parentElement;

				noChangeAspect	= oSrc.noChangeAspect;
				noDrilldown		= oSrc.noDrilldown;
				noGrp			= oSrc.noGrp;
				noMove			= oSrc.noMove;
				noResize		= oSrc.noResize;
				noSelect		= oSrc.noSelect;

				return *this;
			}

		public:
			virtual void fromXML(XmlUtils::CXmlNode& node)
			{
				XmlUtils::CXmlNode oNode;			
				if (node.GetNode(_T("a:graphicFrameLocks"), oNode))
				{
					oNode.ReadAttributeBase(L"noChangeAspect", noChangeAspect);
					oNode.ReadAttributeBase(L"noDrilldown", noDrilldown);
					oNode.ReadAttributeBase(L"noGrp", noGrp);
					oNode.ReadAttributeBase(L"noMove", noMove);
					oNode.ReadAttributeBase(L"noResize", noResize);
					oNode.ReadAttributeBase(L"noSelect", noSelect);
				}
			}

			virtual CString toXML() const
			{
				XmlUtils::CAttribute oAttr;
				oAttr.Write(_T("noChangeAspect"), noChangeAspect);
				oAttr.Write(_T("noDrilldown"), noDrilldown);
				oAttr.Write(_T("noGrp"), noGrp);
				oAttr.Write(_T("noMove"), noMove);
				oAttr.Write(_T("noResize"), noResize);
				oAttr.Write(_T("noSelect"), noSelect);

				if (_T("") == oAttr.m_strValue)
					return _T("<p:cNvGraphicFramePr/>");

				return _T("<p:cNvGraphicFramePr>") + XmlUtils::CreateNode(_T("a:graphicFrameLocks"), oAttr) + _T("</p:cNvGraphicFramePr>");
			}

			virtual void toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const
			{
				if (pWriter->m_lDocType == XMLWRITER_DOC_TYPE_XLSX)
					pWriter->StartNode(_T("xdr:cNvGraphicFramePr"));
				else
					pWriter->StartNode(_T("p:cNvGraphicFramePr"));
				
				pWriter->EndAttributes();
				
				pWriter->StartNode(_T("a:graphicFrameLocks"));

				pWriter->StartAttributes();

				pWriter->WriteAttribute(_T("noChangeAspect"), noChangeAspect);
				pWriter->WriteAttribute(_T("noDrilldown"), noDrilldown);
				pWriter->WriteAttribute(_T("noGrp"), noGrp);
				pWriter->WriteAttribute(_T("noMove"), noMove);
				pWriter->WriteAttribute(_T("noResize"), noResize);
				pWriter->WriteAttribute(_T("noSelect"), noSelect);

				pWriter->EndAttributes();

				pWriter->EndNode(_T("a:graphicFrameLocks"));

				if (pWriter->m_lDocType == XMLWRITER_DOC_TYPE_XLSX)
					pWriter->EndNode(_T("xdr:cNvGraphicFramePr"));
				else
					pWriter->EndNode(_T("p:cNvGraphicFramePr"));
			}

			virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
			{
				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeStart);
				pWriter->WriteBool2(0, noChangeAspect);
				pWriter->WriteBool2(1, noDrilldown);
				pWriter->WriteBool2(2, noGrp);
				pWriter->WriteBool2(3, noMove);
				pWriter->WriteBool2(4, noResize);
				pWriter->WriteBool2(5, noSelect);
				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeEnd);
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
							noChangeAspect = pReader->GetBool();
							break;
						}
						case 1:
						{
							noDrilldown = pReader->GetBool();
							break;
						}
						case 2:
						{
							noGrp = pReader->GetBool();
							break;
						}
						case 3:
						{
							noMove = pReader->GetBool();
							break;
						}
						case 4:
						{
							noResize = pReader->GetBool();
							break;
						}
						case 5:
						{
							noSelect = pReader->GetBool();
							break;
						}						
						default:
							break;
					}
				}		

				pReader->Seek(_end_rec);
			}

		public:
			nullable_bool	noChangeAspect;
			nullable_bool	noDrilldown;
			nullable_bool	noGrp;
			nullable_bool	noMove;
			nullable_bool	noResize;
			nullable_bool	noSelect;
		protected:
			virtual void FillParentPointersForChilds(){};
		};
	} 
} 

#endif // PPTX_LOGIC_CNVGRAPHICFRAMESPPR_INCLUDE_H