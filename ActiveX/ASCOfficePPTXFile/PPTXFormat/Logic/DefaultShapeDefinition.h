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
#ifndef PPTX_LOGIC_DEFAULTSHAPEDEFINITION_INCLUDE_H_
#define PPTX_LOGIC_DEFAULTSHAPEDEFINITION_INCLUDE_H_

#include "./../WrapperWritingElement.h"
#include "SpPr.h"
#include "BodyPr.h"
#include "TextListStyle.h"
#include "ShapeStyle.h"

namespace PPTX
{
	namespace Logic
	{
		class DefaultShapeDefinition : public WrapperWritingElement
		{
		public:
			PPTX_LOGIC_BASE(DefaultShapeDefinition)

			DefaultShapeDefinition& operator=(const DefaultShapeDefinition& oSrc)
			{
				parentFile		= oSrc.parentFile;
				parentElement	= oSrc.parentElement;

				spPr		= oSrc.spPr;
				bodyPr		= oSrc.bodyPr;
				lstStyle	= oSrc.lstStyle;
				style		= oSrc.style;
				m_name		= oSrc.m_name;

				return *this;
			}

		public:
			virtual void fromXML(XmlUtils::CXmlNode& node)
			{
				m_name		= XmlUtils::GetNameNoNS(node.GetName());

				XmlUtils::CXmlNodes oNodes;
				if (node.GetNodes(_T("*"), oNodes))
				{
					int count = oNodes.GetCount();
					for (int i = 0; i < count; ++i)
					{
						XmlUtils::CXmlNode oNode;
						oNodes.GetAt(i, oNode);

						CString strName = XmlUtils::GetNameNoNS(oNode.GetName());

						if (_T("spPr") == strName)
							spPr = oNode;
						else if (_T("bodyPr") == strName)
							bodyPr = oNode;
						else if (_T("lstStyle") == strName)
							lstStyle = oNode;
						else if (_T("style") == strName)
							style = oNode;
					}
				}

				FillParentPointersForChilds();
			}
			virtual CString toXML() const
			{
				XmlUtils::CNodeValue oValue;
				oValue.Write(spPr);
				oValue.Write(bodyPr);
				oValue.Write(lstStyle);
				oValue.WriteNullable(style);

				return XmlUtils::CreateNode(_T("a:") + m_name, oValue);
			}

			virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
			{
				pWriter->WriteRecord1(0, spPr);
				pWriter->WriteRecord1(1, bodyPr);
				pWriter->WriteRecord1(2, lstStyle);
				pWriter->WriteRecord2(3, style);
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
							spPr.m_namespace = _T("a");
							spPr.fromPPTY(pReader);
							break;
						}
						case 1:
						{
							bodyPr.m_namespace = _T("a");
							bodyPr.fromPPTY(pReader);
							break;
						}
						case 2:
						{
							lstStyle.m_name = _T("a:lstStyle");
							lstStyle.fromPPTY(pReader);
							break;
						}
						case 3:
						{
							style = new ShapeStyle();
							style->m_ns = _T("a");
							style->fromPPTY(pReader);
							break;
						}
						default:
							break;
					}
				}

				pReader->Seek(_end_rec);
			}

			virtual void toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const
			{
				pWriter->StartNode(_T("a:") + m_name);
				pWriter->EndAttributes();

				spPr.toXmlWriter(pWriter);
				bodyPr.toXmlWriter(pWriter);
				lstStyle.toXmlWriter(pWriter);
				pWriter->Write(style);

				pWriter->EndNode(_T("a:") + m_name);
			}

		public:
			SpPr					spPr;
			BodyPr					bodyPr;
			TextListStyle			lstStyle;
			nullable<ShapeStyle>	style;
		public:
			CString m_name;
		protected:
			virtual void FillParentPointersForChilds()
			{
				spPr.SetParentPointer(this);
				bodyPr.SetParentPointer(this);
				lstStyle.SetParentPointer(this);
				if(style.IsInit())
					style->SetParentPointer(this);
			}
		};
	} 
} 

#endif // PPTX_LOGIC_DEFAULTSHAPEDEFINITION_INCLUDE_H