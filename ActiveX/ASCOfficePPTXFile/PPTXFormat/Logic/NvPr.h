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
 #ifndef PPTX_LOGIC_NV_PROPERTIES_INCLUDE_H_
#define PPTX_LOGIC_NV_PROPERTIES_INCLUDE_H_

#include "./../WrapperWritingElement.h"
#include "Ph.h"
#include "UniMedia.h"
#include "ExtP.h"

namespace PPTX
{
	namespace Logic
	{
		class NvPr : public WrapperWritingElement
		{
		public:
			PPTX_LOGIC_BASE(NvPr)
				
			NvPr& operator=(const NvPr& oSrc)
			{
				isPhoto		=	oSrc.isPhoto;
				userDrawn	=	oSrc.userDrawn;
				media		=	oSrc.media;
				ph			=	oSrc.ph;

				extLst.Copy(oSrc.extLst);
				
				return *this;
			}

		public:
			virtual void fromXML(XmlUtils::CXmlNode& node)
			{
				node.ReadAttributeBase(L"isPhoto", isPhoto);
				node.ReadAttributeBase(L"userDrawn", userDrawn);

				ph			= node.ReadNode(_T("p:ph"));
				media.GetMediaFrom(node);

				XmlUtils::CXmlNode list;
				if (node.GetNode(_T("p:extLst"), list))
				{
					XmlUtils::CXmlNodes oNodes;
					if (list.GetNodes(_T("*"), oNodes))
					{
						int nCount = oNodes.GetCount();
						for (int i = 0; i < nCount; ++i)
						{
							XmlUtils::CXmlNode oNode;
							oNodes.GetAt(i, oNode);	

							Ext element;
							element.fromXML(oNode);
							extLst.Add (element);
						}
					}
				}
			}
			virtual CString toXML() const
			{
				XmlUtils::CAttribute oAttr;
				oAttr.Write(_T("isPhoto"), isPhoto);
				oAttr.Write(_T("userDrawn"), userDrawn);

				XmlUtils::CNodeValue oValue;
				oValue.WriteNullable(ph);
				oValue.Write(media);

				return XmlUtils::CreateNode(_T("p:nvPr"), oAttr, oValue);
			}

			virtual void toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const
			{
				pWriter->StartNode(_T("p:nvPr"));

				pWriter->StartAttributes();
				pWriter->WriteAttribute(_T("isPhoto"), isPhoto);
				pWriter->WriteAttribute(_T("userDrawn"), userDrawn);
				pWriter->EndAttributes();

				pWriter->Write(ph);
				media.toXmlWriter(pWriter);
				pWriter->WriteArray(_T("p:extLst"), extLst);				
				
				pWriter->EndNode(_T("p:nvPr"));
			}

			virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
			{
				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeStart);
				pWriter->WriteBool2(0, isPhoto);
				pWriter->WriteBool2(1, userDrawn);
				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeEnd);

				pWriter->WriteRecord2(0, ph);
				pWriter->WriteRecord1(1, media);
				pWriter->WriteRecordArray(2, 0, extLst);
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
							isPhoto = pReader->GetBool();
							break;
						}
						case 1:
						{
							userDrawn = pReader->GetBool();
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
							ph = new Ph();
							ph->fromPPTY(pReader);
							break;
						}
						default:
						{
							
							pReader->SkipRecord();
							break;
						}
					}
				}

				pReader->Seek(_end_rec);
			}

		public:
			
			nullable_bool			isPhoto;
			nullable_bool			userDrawn;

			
			nullable<Ph>			ph;
			UniMedia				media;
			
			CAtlArray<Ext>			extLst;
		protected:
			virtual void FillParentPointersForChilds()
			{
				if(ph.IsInit())
					ph->SetParentPointer(this);
				if(media.is_init())
					media.SetParentPointer(this);
			}
		};
	} 
} 

#endif // PPTX_LOGIC_NV_PROPERTIES_INCLUDE_H