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
#ifndef PPTX_LOGIC_CNVCXNSPPR_INCLUDE_H_
#define PPTX_LOGIC_CNVCXNSPPR_INCLUDE_H_

#include "./../WrapperWritingElement.h"

namespace PPTX
{
	namespace Logic
	{
		class CNvCxnSpPr : public WrapperWritingElement
		{
		public:
			PPTX_LOGIC_BASE(CNvCxnSpPr)
				
			CNvCxnSpPr& operator=(const CNvCxnSpPr& oSrc)
			{
				parentFile		= oSrc.parentFile;
				parentElement	= oSrc.parentElement;

				noAdjustHandles		= oSrc.noAdjustHandles;
				noChangeArrowheads	= oSrc.noChangeArrowheads;
				noChangeAspect		= oSrc.noChangeAspect;
				noChangeShapeType	= oSrc.noChangeShapeType;
				noEditPoints		= oSrc.noEditPoints;
				noGrp				= oSrc.noGrp;
				noMove				= oSrc.noMove;
				noResize			= oSrc.noResize;
				noRot				= oSrc.noRot;
				noSelect			= oSrc.noSelect;

				stCxn_id			= oSrc.stCxn_id;
				stCxn_idx			= oSrc.stCxn_idx;
				endCxn_id			= oSrc.endCxn_id;
				endCxn_idx			= oSrc.endCxn_idx;

				return *this;
			}

		public:
			virtual void fromXML(XmlUtils::CXmlNode& node)
			{
				XmlUtils::CXmlNode l_Locks;
				if (node.GetNode(_T("a:cxnSpLocks"), l_Locks))
				{
					l_Locks.ReadAttributeBase(L"noAdjustHandles", noAdjustHandles);
					l_Locks.ReadAttributeBase(L"noChangeArrowheads", noChangeArrowheads);
					l_Locks.ReadAttributeBase(L"noChangeAspect", noChangeAspect);
					l_Locks.ReadAttributeBase(L"noChangeShapeType", noChangeShapeType);
					l_Locks.ReadAttributeBase(L"noEditPoints", noEditPoints);
					l_Locks.ReadAttributeBase(L"noGrp", noGrp);
					l_Locks.ReadAttributeBase(L"noMove", noMove);
					l_Locks.ReadAttributeBase(L"noResize", noResize);
					l_Locks.ReadAttributeBase(L"noRot", noRot);
					l_Locks.ReadAttributeBase(L"noSelect", noSelect);
				}

				XmlUtils::CXmlNode l_Cxn;
				if (node.GetNode(_T("a:stCxn"), l_Cxn))
				{
					l_Cxn.ReadAttributeBase(L"id", stCxn_id);
					l_Cxn.ReadAttributeBase(L"idx", stCxn_idx);
				}

				XmlUtils::CXmlNode l_endCxn;
				if (node.GetNode(_T("a:endCxn"), l_endCxn))
				{
					l_endCxn.ReadAttributeBase(L"id", endCxn_id);
					l_endCxn.ReadAttributeBase(L"idx", endCxn_idx);
				}
			}


			virtual CString toXML() const
			{
				XmlUtils::CAttribute oAttr1;
				oAttr1.Write(_T("noAdjustHandles"), noAdjustHandles);
				oAttr1.Write(_T("noChangeArrowheads"), noChangeArrowheads);
				oAttr1.Write(_T("noChangeAspect"), noChangeAspect);
				oAttr1.Write(_T("noChangeShapeType"), noChangeShapeType);
				oAttr1.Write(_T("noEditPoints"), noEditPoints);
				oAttr1.Write(_T("noGrp"), noGrp);
				oAttr1.Write(_T("noMove"), noMove);
				oAttr1.Write(_T("noResize"), noResize);
				oAttr1.Write(_T("noRot"), noRot);
				oAttr1.Write(_T("noSelect"), noSelect);

				XmlUtils::CAttribute oAttr2;
				oAttr2.Write(_T("id"), stCxn_id);
				oAttr2.Write(_T("idx"), stCxn_idx);

				XmlUtils::CAttribute oAttr3;
				oAttr3.Write(_T("id"), endCxn_id);
				oAttr3.Write(_T("idx"), endCxn_idx);

				XmlUtils::CNodeValue oValue;
				oValue.m_strValue += XmlUtils::CreateNode(_T("a:cxnSpLocks"), oAttr1);

				if (_T("") != oAttr2.m_strValue)
					oValue.m_strValue += XmlUtils::CreateNode(_T("a:stCxn"), oAttr2);
				if (_T("") != oAttr3.m_strValue)
					oValue.m_strValue += XmlUtils::CreateNode(_T("a:endCxn"), oAttr3);

				return XmlUtils::CreateNode(_T("p:cNvCxnSpPr"), oValue);
			}

			virtual void toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const
			{
				pWriter->StartNode(_T("p:cNvCxnSpPr"));
				pWriter->EndAttributes();

				pWriter->StartNode(_T("a:cxnSpLocks"));
				pWriter->StartAttributes();
				pWriter->WriteAttribute(_T("noAdjustHandles"), noAdjustHandles);
				pWriter->WriteAttribute(_T("noChangeArrowheads"), noChangeArrowheads);
				pWriter->WriteAttribute(_T("noChangeAspect"), noChangeAspect);
				pWriter->WriteAttribute(_T("noChangeShapeType"), noChangeShapeType);
				pWriter->WriteAttribute(_T("noEditPoints"), noEditPoints);
				pWriter->WriteAttribute(_T("noGrp"), noGrp);
				pWriter->WriteAttribute(_T("noMove"), noMove);
				pWriter->WriteAttribute(_T("noResize"), noResize);
				pWriter->WriteAttribute(_T("noRot"), noRot);
				pWriter->WriteAttribute(_T("noSelect"), noSelect);
				pWriter->EndAttributes();
				pWriter->EndNode(_T("a:cxnSpLocks"));

				if (stCxn_id.is_init() || stCxn_idx.is_init())
				{
					pWriter->StartNode(_T("a:stCxn"));
					pWriter->StartAttributes();
					pWriter->WriteAttribute(_T("id"), stCxn_id);
					pWriter->WriteAttribute(_T("idx"), stCxn_idx);
					pWriter->EndAttributes();
					pWriter->EndNode(_T("a:stCxn"));
				}

				if (endCxn_id.is_init() || endCxn_idx.is_init())
				{
					pWriter->StartNode(_T("a:endCxn"));
					pWriter->StartAttributes();
					pWriter->WriteAttribute(_T("id"), endCxn_id);
					pWriter->WriteAttribute(_T("idx"), endCxn_idx);
					pWriter->EndAttributes();
					pWriter->EndNode(_T("a:endCxn"));
				}

				pWriter->EndNode(_T("p:cNvCxnSpPr"));
			}

			virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
			{
				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeStart);
				pWriter->WriteBool2(0, noAdjustHandles);
				pWriter->WriteBool2(1, noChangeArrowheads);
				pWriter->WriteBool2(2, noChangeAspect);
				pWriter->WriteBool2(3, noChangeShapeType);
				pWriter->WriteBool2(4, noEditPoints);
				pWriter->WriteBool2(5, noGrp);
				pWriter->WriteBool2(6, noMove);
				pWriter->WriteBool2(7, noResize);
				pWriter->WriteBool2(8, noRot);
				pWriter->WriteBool2(9, noSelect);

				pWriter->WriteInt2(10, stCxn_id);
				pWriter->WriteInt2(11, stCxn_idx);
				pWriter->WriteInt2(12, endCxn_id);
				pWriter->WriteInt2(13, endCxn_idx);
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
							noAdjustHandles = pReader->GetBool();
							break;
						}
						case 1:
						{
							noChangeArrowheads = pReader->GetBool();
							break;
						}
						case 2:
						{
							noChangeAspect = pReader->GetBool();
							break;
						}
						case 3:
						{
							noChangeShapeType = pReader->GetBool();
							break;
						}
						case 4:
						{
							noEditPoints = pReader->GetBool();
							break;
						}
						case 5:
						{
							noGrp = pReader->GetBool();
							break;
						}
						case 6:
						{
							noMove = pReader->GetBool();
							break;
						}
						case 7:
						{
							noResize = pReader->GetBool();
							break;
						}
						case 8:
						{
							noRot = pReader->GetBool();
							break;
						}
						case 9:
						{
							noSelect = pReader->GetBool();
							break;
						}
						case 10:
						{
							stCxn_id = pReader->GetLong();
							break;
						}
						case 11:
						{
							stCxn_idx = pReader->GetLong();
							break;
						}
						case 12:
						{
							endCxn_id = pReader->GetLong();
							break;
						}
						case 13:
						{
							endCxn_idx = pReader->GetLong();
							break;
						}
						default:
							break;
					}
				}

				pReader->Seek(_end_rec);
			}

		public:
			nullable_bool	noAdjustHandles;
			nullable_bool	noChangeArrowheads;
			nullable_bool	noChangeAspect;
			nullable_bool	noChangeShapeType;
			nullable_bool	noEditPoints;
			nullable_bool	noGrp;
			nullable_bool	noMove;
			nullable_bool	noResize;
			nullable_bool	noRot;
			nullable_bool	noSelect;

			nullable_int	stCxn_id;
			nullable_int	stCxn_idx;
			nullable_int	endCxn_id;
			nullable_int	endCxn_idx;
		
		protected:
			virtual void FillParentPointersForChilds(){};
			AVSINLINE void Normalize()
			{
				stCxn_id.normalize_positive();
				stCxn_idx.normalize_positive();
				endCxn_id.normalize_positive();
				endCxn_idx.normalize_positive();
			}
		};
	} 
} 

#endif // PPTX_LOGIC_CNVCXNSPPR_INCLUDE_H