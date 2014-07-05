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
#ifndef PPTX_LOGIC_CUSTGEOM_INCLUDE_H_
#define PPTX_LOGIC_CUSTGEOM_INCLUDE_H_

#include "./../WrapperWritingElement.h"
#include "Gd.h"
#include "Rect.h"
#include "Path2D.h"
#include "AhBase.h"
#include "Cxn.h"

namespace PPTX
{
	namespace Logic
	{
		class CustGeom : public WrapperWritingElement
		{
		public:
			PPTX_LOGIC_BASE(CustGeom)

			CustGeom& operator=(const CustGeom& oSrc)
			{
				parentFile		= oSrc.parentFile;
				parentElement	= oSrc.parentElement;

				avLst.Copy(oSrc.avLst);
				gdLst.Copy(oSrc.gdLst);
				ahLst.Copy(oSrc.ahLst);
				cxnLst.Copy(oSrc.cxnLst);
				pathLst.Copy(oSrc.pathLst);

				rect = oSrc.rect;

				return *this;
			}

		public:
			virtual void fromXML(XmlUtils::CXmlNode& node)
			{
				XmlUtils::CXmlNode oNode;
				if (node.GetNode(_T("a:avLst"), oNode))
					oNode.LoadArray(_T("a:gd"), avLst);
				if (node.GetNode(_T("a:gdLst"), oNode))
					oNode.LoadArray(_T("a:gd"), gdLst);
				
				if (node.GetNode(_T("a:ahLst"), oNode))
				{
					oNode.LoadArray(_T("a:ahPolar"), ahLst);
					oNode.LoadArray(_T("a:ahXY"), ahLst);
				}

				if (node.GetNode(_T("a:cxnLst"), oNode))
					oNode.LoadArray(_T("a:cxn"), cxnLst);

				if (node.GetNode(_T("a:pathLst"), oNode))
					oNode.LoadArray(_T("a:path"), pathLst);

				rect = node.ReadNodeNoNS(_T("rect"));

				FillParentPointersForChilds();
			}

			virtual CString toXML() const
			{
				XmlUtils::CNodeValue oValue;
				oValue.WriteArray(_T("a:avLst"), avLst);
				oValue.WriteArray(_T("a:gdLst"), gdLst);
				oValue.WriteArray(_T("a:ahLst"), ahLst);
				oValue.WriteArray(_T("a:cxnLst"), cxnLst);
				oValue.WriteNullable(rect);
				oValue.WriteArray(_T("a:pathLst"), pathLst);
				
				return XmlUtils::CreateNode(_T("a:custGeom"), oValue);
			}

			virtual void toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const
			{
				pWriter->StartNode(_T("a:custGeom"));
				pWriter->EndAttributes();

				if (avLst.GetCount() == 0)
					pWriter->WriteString(_T("<a:avLst/>"));
				else
					pWriter->WriteArray(_T("a:avLst"), avLst);
				
				if (gdLst.GetCount() == 0)
					pWriter->WriteString(_T("<a:gdLst/>"));
				else
					pWriter->WriteArray(_T("a:gdLst"), gdLst);

				if (ahLst.GetCount() == 0)
					pWriter->WriteString(_T("<a:ahLst/>"));
				else
					pWriter->WriteArray(_T("a:ahLst"), ahLst);

				if (cxnLst.GetCount() == 0)
					pWriter->WriteString(_T("<a:cxnLst/>"));
				else
					pWriter->WriteArray(_T("a:cxnLst"), cxnLst);		
		
				if (rect.is_init())
					pWriter->Write(rect);
				else
					pWriter->WriteString(_T("<a:rect l=\"0\" t=\"0\" r=\"r\" b=\"b\"/>"));
				pWriter->WriteArray(_T("a:pathLst"), pathLst);
				
				pWriter->EndNode(_T("a:custGeom"));
			}

			virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
			{
				pWriter->StartRecord(GEOMETRY_TYPE_CUSTOM);

				pWriter->WriteRecordArray(0, 1, avLst);
				pWriter->WriteRecordArray(1, 1, gdLst);
				pWriter->WriteRecordArray(2, 1, ahLst);
				pWriter->WriteRecordArray(3, 1, cxnLst);
				pWriter->WriteRecordArray(4, 1, pathLst);
				pWriter->WriteRecord2(5, rect);

				pWriter->EndRecord();
			}

		public:
			CAtlArray<Gd>			avLst;
			CAtlArray<Gd>			gdLst;
			CAtlArray<AhBase>		ahLst;
			CAtlArray<Cxn>			cxnLst;
			nullable<Rect>			rect;
			CAtlArray<Path2D>		pathLst;
		protected:
			virtual void FillParentPointersForChilds()
			{
				size_t count = 0;

				count = avLst.GetCount();
				for (size_t i = 0; i < count; ++i)
					avLst[i].SetParentPointer(this);			

				count = gdLst.GetCount();
				for (size_t i = 0; i < count; ++i)
					gdLst[i].SetParentPointer(this);

				count = ahLst.GetCount();
				for (size_t i = 0; i < count; ++i)
					ahLst[i].SetParentPointer(this);

				count = cxnLst.GetCount();
				for (size_t i = 0; i < count; ++i)
					cxnLst[i].SetParentPointer(this);

				count = pathLst.GetCount();
				for (size_t i = 0; i < count; ++i)
					pathLst[i].SetParentPointer(this);

				if (rect.IsInit())
					rect->SetParentPointer(this);
			}
		public:
			virtual CString GetODString() const
			{
				CString strXml = _T("");

				size_t nCount  = 0;
				
				strXml += _T("<avLst>");
				nCount = avLst.GetCount();
				for (size_t i = 0; i < nCount; ++i)
					strXml += avLst[i].GetODString();
				strXml += _T("</avLst>");

				strXml += _T("<gdLst>");
				nCount = gdLst.GetCount();
				for (size_t i = 0; i < nCount; ++i)
					strXml += gdLst[i].GetODString();
				strXml += _T("</gdLst>");

				strXml += _T("<ahLst>");
				nCount = ahLst.GetCount();
				for (size_t i = 0; i < nCount; ++i)
					strXml += ahLst[i].GetODString();
				strXml += _T("</ahLst>");

				strXml += _T("<cxnLst>");
				nCount = cxnLst.GetCount();
				for (size_t i = 0; i < nCount; ++i)
					strXml += cxnLst[i].GetODString();
				strXml += _T("</cxnLst>");

				strXml += _T("<pathLst>");
				nCount = pathLst.GetCount();
				for (size_t i = 0; i < nCount; ++i)
					strXml += pathLst[i].GetODString();
				strXml += _T("</pathLst>");

				if (rect.IsInit())
					strXml += rect->GetODString();
				
				return XmlUtils::CreateNode(_T("ooxml-shape"), strXml);
			}
		};
	} 
} 

#endif // PPTX_LOGIC_CUSTGEOM_INCLUDE_H