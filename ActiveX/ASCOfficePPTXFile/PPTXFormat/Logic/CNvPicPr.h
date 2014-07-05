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
#ifndef PPTX_LOGIC_CNVPICPR_INCLUDE_H_
#define PPTX_LOGIC_CNVPICPR_INCLUDE_H_

#include "./../WrapperWritingElement.h"


namespace PPTX
{
	namespace Logic
	{
		class CNvPicPr : public WrapperWritingElement
		{
		public:
			
			PPTX_LOGIC_BASE(CNvPicPr)

			CNvPicPr& operator=(const CNvPicPr& oSrc)
			{
				parentFile		= oSrc.parentFile;
				parentElement	= oSrc.parentElement;

				preferRelativeResize	= oSrc.preferRelativeResize;

				noAdjustHandles			= oSrc.noAdjustHandles;
				noChangeArrowheads		= oSrc.noChangeArrowheads;
				noChangeAspect			= oSrc.noChangeAspect;
				noChangeShapeType		= oSrc.noChangeShapeType;
				noCrop					= oSrc.noCrop;
				noEditPoints			= oSrc.noEditPoints;
				noGrp					= oSrc.noGrp;
				noMove					= oSrc.noMove;
				noResize				= oSrc.noResize;
				noRot					= oSrc.noRot;
				noSelect				= oSrc.noSelect;

				return *this;
			}

		public:
			virtual void fromXML(XmlUtils::CXmlNode& node)
			{
				node.ReadAttributeBase(L"preferRelativeResize", preferRelativeResize);

				XmlUtils::CXmlNode oNode;
				if (node.GetNode(_T("a:picLocks"), oNode))
				{
					oNode.ReadAttributeBase(L"noAdjustHandles", noAdjustHandles);
					oNode.ReadAttributeBase(L"noChangeArrowheads", noChangeArrowheads);
					oNode.ReadAttributeBase(L"noChangeAspect", noChangeAspect);
					oNode.ReadAttributeBase(L"noChangeShapeType", noChangeShapeType);
					oNode.ReadAttributeBase(L"noCrop", noCrop);
					oNode.ReadAttributeBase(L"noEditPoints", noEditPoints);
					oNode.ReadAttributeBase(L"noGrp", noGrp);
					oNode.ReadAttributeBase(L"noMove", noMove);
					oNode.ReadAttributeBase(L"noResize", noResize);
					oNode.ReadAttributeBase(L"noRot", noRot);
					oNode.ReadAttributeBase(L"noSelect", noSelect);
				}
			}

			virtual CString toXML() const
			{
				XmlUtils::CAttribute oAttr;
				oAttr.Write(_T("noAdjustHandles"), noAdjustHandles);
				oAttr.Write(_T("noChangeAspect"), noChangeAspect);
				oAttr.Write(_T("noChangeArrowheads"), noChangeArrowheads);
				oAttr.Write(_T("noChangeShapeType"), noChangeShapeType);
				oAttr.Write(_T("noEditPoints"), noEditPoints);
				oAttr.Write(_T("noGrp"), noGrp);
				oAttr.Write(_T("noMove"), noMove);
				oAttr.Write(_T("noResize"), noResize);
				oAttr.Write(_T("noRot"), noRot);
				oAttr.Write(_T("noSelect"), noSelect);
				oAttr.Write(_T("noCrop"), noCrop);

				XmlUtils::CAttribute oAttr2;
				oAttr2.Write(_T("preferRelativeResize"), preferRelativeResize);

				if (_T("") == oAttr.m_strValue)
				{
					return XmlUtils::CreateNode(_T("p:cNvPicPr"), oAttr2);
				}

				return XmlUtils::CreateNode(_T("p:cNvPicPr"), oAttr2, XmlUtils::CreateNode(_T("a:picLocks"), oAttr));
			}

			virtual void toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const
			{
				if (pWriter->m_lDocType == XMLWRITER_DOC_TYPE_DOCX)
					pWriter->StartNode(_T("pic:cNvPicPr"));
				else if (pWriter->m_lDocType == XMLWRITER_DOC_TYPE_XLSX)
					pWriter->StartNode(_T("xdr:cNvPicPr"));
				else
					pWriter->StartNode(_T("p:cNvPicPr"));

				pWriter->StartAttributes();
				pWriter->WriteAttribute(_T("preferRelativeResize"), preferRelativeResize);
				pWriter->EndAttributes();

				if (noAdjustHandles.is_init() ||
					noChangeAspect.is_init() ||
					noChangeArrowheads.is_init() ||
					noChangeShapeType.is_init() ||
					noEditPoints.is_init() ||
					noGrp.is_init() ||
					noMove.is_init() ||
					noResize.is_init() ||
					noRot.is_init() ||
					noSelect.is_init() ||
					noCrop.is_init())
				{
					pWriter->StartNode(_T("a:picLocks"));
					pWriter->StartAttributes();
					pWriter->WriteAttribute(_T("noAdjustHandles"), noAdjustHandles);
					pWriter->WriteAttribute(_T("noChangeAspect"), noChangeAspect);
					pWriter->WriteAttribute(_T("noChangeArrowheads"), noChangeArrowheads);
					pWriter->WriteAttribute(_T("noChangeShapeType"), noChangeShapeType);
					pWriter->WriteAttribute(_T("noEditPoints"), noEditPoints);
					pWriter->WriteAttribute(_T("noGrp"), noGrp);
					pWriter->WriteAttribute(_T("noMove"), noMove);
					pWriter->WriteAttribute(_T("noResize"), noResize);
					pWriter->WriteAttribute(_T("noRot"), noRot);
					pWriter->WriteAttribute(_T("noSelect"), noSelect);
					pWriter->WriteAttribute(_T("noCrop"), noCrop);
					pWriter->EndAttributes();
					pWriter->EndNode(_T("a:picLocks"));
				}

				if (pWriter->m_lDocType == XMLWRITER_DOC_TYPE_DOCX)
					pWriter->EndNode(_T("pic:cNvPicPr"));
				else if (pWriter->m_lDocType == XMLWRITER_DOC_TYPE_XLSX)
					pWriter->EndNode(_T("xdr:cNvPicPr"));
				else
					pWriter->EndNode(_T("p:cNvPicPr"));
			}

			virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
			{
				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeStart);
				pWriter->WriteBool2(0, preferRelativeResize);
				pWriter->WriteBool2(1, noAdjustHandles);
				pWriter->WriteBool2(2, noChangeArrowheads);
				pWriter->WriteBool2(3, noChangeAspect);
				pWriter->WriteBool2(4, noChangeShapeType);
				pWriter->WriteBool2(5, noCrop);
				pWriter->WriteBool2(6, noEditPoints);
				pWriter->WriteBool2(7, noGrp);
				pWriter->WriteBool2(8, noMove);
				pWriter->WriteBool2(9, noResize);
				pWriter->WriteBool2(10, noRot);
				pWriter->WriteBool2(11, noSelect);
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
							preferRelativeResize = pReader->GetBool();
							break;
						}
						case 1:
						{
							noAdjustHandles = pReader->GetBool();
							break;
						}
						case 2:
						{
							noChangeArrowheads = pReader->GetBool();
							break;
						}
						case 3:
						{
							noChangeAspect = pReader->GetBool();
							break;
						}
						case 4:
						{
							noChangeShapeType = pReader->GetBool();
							break;
						}
						case 5:
						{
							noCrop = pReader->GetBool();
							break;
						}
						case 6:
						{
							noEditPoints = pReader->GetBool();
							break;
						}
						case 7:
						{
							noGrp = pReader->GetBool();
							break;
						}
						case 8:
						{
							noMove = pReader->GetBool();
							break;
						}
						case 9:
						{
							noResize = pReader->GetBool();
							break;
						}
						case 10:
						{
							noRot = pReader->GetBool();
							break;
						}
						case 11:
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
			nullable_bool		preferRelativeResize;

			nullable_bool		noAdjustHandles;
			nullable_bool		noChangeArrowheads;
			nullable_bool		noChangeAspect;
			nullable_bool		noChangeShapeType;
			nullable_bool		noCrop;
			nullable_bool		noEditPoints;
			nullable_bool		noGrp;
			nullable_bool		noMove;
			nullable_bool		noResize;
			nullable_bool		noRot;
			nullable_bool		noSelect;
		protected:
			virtual void FillParentPointersForChilds(){};
		};
	} 
} 

#endif // PPTX_LOGIC_CNVPICPR_INCLUDE_H