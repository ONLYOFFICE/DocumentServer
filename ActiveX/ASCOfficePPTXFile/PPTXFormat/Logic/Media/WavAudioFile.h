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
#ifndef PPTX_LOGIC_WAVAUDIOFILE_INCLUDE_H_
#define PPTX_LOGIC_WAVAUDIOFILE_INCLUDE_H_

#include "../../WrapperWritingElement.h"
#include "../../DocxFormat/RId.h"

namespace PPTX
{
	namespace Logic
	{
		class WavAudioFile : public WrapperWritingElement
		{
		public:
			PPTX_LOGIC_BASE(WavAudioFile)

			WavAudioFile& operator=(const WavAudioFile& oSrc)
			{
				parentFile		= oSrc.parentFile;
				parentElement	= oSrc.parentElement;

				name  = oSrc.name;
				embed = oSrc.embed;
				m_name = oSrc.m_name;
				return *this;
			}
		public:
			virtual void fromXML(XmlUtils::CXmlNode& node)
			{
				m_name	= XmlUtils::GetNameNoNS(node.GetName());

				embed	= node.GetAttribute(_T("r:embed"));
				node.ReadAttributeBase(L"name", name);
			}

			virtual CString toXML() const
			{
				XmlUtils::CAttribute oAttr;
				oAttr.Write(_T("r:embed"), embed.ToString());
				oAttr.Write(_T("name"), name);

				return XmlUtils::CreateNode(_T("a:") + m_name, oAttr);
			}

			virtual void toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const
			{
				pWriter->StartNode(_T("a:") + m_name);

				pWriter->StartAttributes();
				pWriter->WriteAttribute(_T("r:embed"), embed.ToString());
				pWriter->WriteAttribute(_T("name"), name);
				pWriter->EndAttributes();
				
				pWriter->EndNode(_T("a:") + m_name);
			}

		public:
			nullable_string name;
			OOX::RId		embed;
		public:
			CString			m_name;
		protected:
			virtual void FillParentPointersForChilds(){};
		};
	} 
} 

#endif // PPTX_LOGIC_WAVAUDIOFILE_INCLUDE_H_