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
#ifndef PPTX_LOGIC_LINEJOIN_INCLUDE_H_
#define PPTX_LOGIC_LINEJOIN_INCLUDE_H_

#include "./../WrapperWritingElement.h"

namespace PPTX
{
	namespace Logic
	{
		enum eJoin {JoinEmpty = 0, JoinRound = 1, JoinBevel = 2, JoinMiter = 3};
	
		class LineJoin : public WrapperWritingElement
		{
		public:
			PPTX_LOGIC_BASE(LineJoin)

			virtual bool is_init()const{return (type==JoinEmpty);};

		public:
			virtual void GetJoinFrom(XmlUtils::CXmlNode& element)
			{
				type = JoinEmpty;

				XmlUtils::CXmlNode oNode;
				if(element.GetNode(_T("a:round"), oNode))
					type = JoinRound;
				else if(element.GetNode(_T("a:bevel"), oNode))
					type = JoinBevel;
				else if(element.GetNode(_T("a:miter"), oNode))
				{
					type = JoinMiter;
					oNode.ReadAttributeBase(L"lim", lim);
				}

				Normalize();
			}
			virtual void fromXML(XmlUtils::CXmlNode& node)
			{
				CString name = XmlUtils::GetNameNoNS(node.GetName());
				
				type = JoinEmpty;

				if (name == _T("round"))
					type = JoinRound;
				else if (name == _T("bevel"))
					type = JoinBevel;
				else if (name == _T("miter"))
				{
					type = JoinMiter;
					node.ReadAttributeBase(L"lim", lim);
				}

				Normalize();
			}
			virtual CString toXML() const
			{
				if(type == JoinRound)
					return _T("<a:round/>");
				else if(type == JoinBevel)
					return _T("<a:bevel/>");
				else if(type == JoinMiter)
				{
					XmlUtils::CAttribute oAttr;
					oAttr.Write(_T("lim"), lim);

					return XmlUtils::CreateNode(_T("a:miter"), oAttr);
				}
				return _T("");
			}

			virtual void toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const
			{
				if (type == JoinRound)
				{
					pWriter->WriteString(_T("<a:round/>"));
				}
				else if (type == JoinBevel)
				{
					pWriter->WriteString(_T("<a:bevel/>"));
				}
				else if (type == JoinMiter)
				{
					pWriter->StartNode(_T("a:miter"));
					pWriter->StartAttributes();
					pWriter->WriteAttribute(_T("lim"), lim);
					pWriter->EndAttributes();
					pWriter->EndNode(_T("a:miter"));
				}
			}

			virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
			{
				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeStart);
				int bb = (int)type;
				pWriter->WriteInt1(0, bb);
				pWriter->WriteInt2(1, lim);
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
							type = (eJoin)pReader->GetLong();
							break;
						}
						case 1:
						{
							lim = pReader->GetLong();
							break;
						}
						default:
							break;
					}
				}

				pReader->Seek(_end_rec);
			}

		public:
			eJoin			type;
			nullable_int	lim;
		protected:
			virtual void FillParentPointersForChilds(){};

			AVSINLINE void Normalize()
			{
				lim.normalize_positive();
			}
		};
	} 
} 

#endif // PPTX_LOGIC_LINEJOIN_INCLUDE_H_