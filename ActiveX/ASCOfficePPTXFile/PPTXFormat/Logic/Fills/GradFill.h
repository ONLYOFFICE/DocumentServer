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
#ifndef PPTX_LOGIC_GRADFILL_INCLUDE_H_
#define PPTX_LOGIC_GRADFILL_INCLUDE_H_

#include "./../../WrapperWritingElement.h"
#include "./../../Limit/Flip.h"
#include "./../Rect.h"
#include "./../Gs.h"
#include "./../Lin.h"
#include "./../Path.h"

namespace PPTX
{
	namespace Logic
	{

		class GradFill : public WrapperWritingElement
		{
		public:
			PPTX_LOGIC_BASE(GradFill)

			GradFill& operator=(const GradFill& oSrc)
			{
				parentFile		= oSrc.parentFile;
				parentElement	= oSrc.parentElement;

				flip		 = oSrc.flip;
				rotWithShape = oSrc.rotWithShape;

				GsLst.Copy(oSrc.GsLst);
				lin			= oSrc.lin;
				path		= oSrc.path;
				tileRect	= oSrc.tileRect;

				m_namespace	= oSrc.m_namespace;
				
				return *this;
			}

		public:
			virtual void fromXML(XmlUtils::CXmlNode& node)
			{
				m_namespace = XmlUtils::GetNamespace(node.GetName());

				node.ReadAttributeBase(L"flip", flip);
				node.ReadAttributeBase(L"rotWithShape", rotWithShape);

				node.LoadArray(_T("a:gsLst"), _T("a:gs"), GsLst);

				XmlUtils::CXmlNodes oNodes;
				if (node.GetNodes(_T("*"), oNodes))
				{
					int nCount = oNodes.GetCount();
					for (int i = 0; i < nCount; ++i)
					{
						XmlUtils::CXmlNode oNode;
						oNodes.GetAt(i, oNode);

						CString strName = XmlUtils::GetNameNoNS(oNode.GetName());

						if (_T("path") == strName)
						{
							if (!path.IsInit())
								path = oNode;
						}
						else if (_T("lin") == strName)
						{
							if (!lin.IsInit())
								lin = oNode;
						}
						else if (_T("tileRect") == strName)
						{
							if (!tileRect.IsInit())
								tileRect = oNode;
						}
					}
				}

				FillParentPointersForChilds();
			}

			virtual CString toXML() const
			{
				XmlUtils::CAttribute oAttr;
				oAttr.WriteLimitNullable(_T("flip"), flip);
				oAttr.Write(_T("rotWithShape"), rotWithShape);

				XmlUtils::CNodeValue oValue;
				oValue.WriteArray(_T("a:gsLst"), GsLst);
				oValue.WriteNullable(path);
				oValue.WriteNullable(lin);
				oValue.WriteNullable(tileRect);

				CString strName = (_T("") == m_namespace) ? _T("gradFill") : (m_namespace + _T(":gradFill"));
				return XmlUtils::CreateNode(strName, oAttr, oValue);
			}

			virtual void toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const
			{
				CString strName = (_T("") == m_namespace) ? _T("gradFill") : (m_namespace + _T(":gradFill"));
				pWriter->StartNode(strName);

				pWriter->StartAttributes();
				pWriter->WriteAttribute(_T("flip"), flip);
				pWriter->WriteAttribute(_T("rotWithShape"), rotWithShape);
				pWriter->EndAttributes();

				pWriter->WriteArray(_T("a:gsLst"), GsLst);
				pWriter->Write(path);
				pWriter->Write(lin);
				pWriter->Write(tileRect);

				pWriter->EndNode(strName);
			}

			virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
			{
				pWriter->StartRecord(FILL_TYPE_GRAD);

				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeStart);
				pWriter->WriteLimit2(0, flip);
				pWriter->WriteBool2(1, rotWithShape);
				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeEnd);

				pWriter->StartRecord(0);

				ULONG len = (ULONG)GsLst.GetCount();
				pWriter->WriteULONG(len);

				for (ULONG i = 0; i < len; ++i)
				{
					pWriter->WriteRecord1(0, GsLst[i]);
				}

				pWriter->EndRecord();

				pWriter->WriteRecord2(1, lin);
				pWriter->WriteRecord2(2, path);
				pWriter->WriteRecord2(3, tileRect);

				pWriter->EndRecord();
			}

			void Merge(GradFill& fill)const
			{
				if(flip.IsInit())
					fill.flip = *flip;
				if(rotWithShape.IsInit())
					fill.rotWithShape = *rotWithShape;
				if(tileRect.IsInit())
					fill.tileRect = tileRect;
				if(0 != GsLst.GetCount())
				{
					fill.GsLst.RemoveAll();
					fill.GsLst.Copy(GsLst);
				}

				if(lin.IsInit())
				{
					fill.lin = lin;
					fill.path.reset();
				}
				if(path.IsInit())
				{
					fill.path = path;
					fill.lin.reset();
				}
			}

			UniColor GetFrontColor()const
			{
				if (0 == GsLst.GetCount())
					return UniColor();
				return GsLst[0].color;
			}

		public:
			nullable_limit<Limit::Flip> flip;
			nullable_bool				rotWithShape;

			CAtlArray<Gs>				GsLst;
			nullable<Lin>				lin;
			nullable<Path>				path;
			nullable<Rect>				tileRect;

			CString m_namespace;
		protected:
			virtual void FillParentPointersForChilds()
			{
				size_t count = GsLst.GetCount();
				for (size_t i = 0; i < count; ++i)
					GsLst[i].SetParentPointer(this);
				
				if(lin.IsInit())
					lin->SetParentPointer(this);
				if(path.IsInit())
					path->SetParentPointer(this);
				if(tileRect.IsInit())
					tileRect->SetParentPointer(this);
			}
		};
	} 
} 

#endif // PPTX_LOGIC_GRADFILL_INCLUDE_H_