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
#ifndef PPTX_LOGIC_ALPHAOUTSET_INCLUDE_H_
#define PPTX_LOGIC_ALPHAOUTSET_INCLUDE_H_

#include "./../../WrapperWritingElement.h"

namespace PPTX
{
	namespace Logic
	{

		class AlphaOutset : public WrapperWritingElement
		{
		public:
			
			PPTX_LOGIC_BASE(AlphaOutset)

			AlphaOutset& operator=(const AlphaOutset& oSrc)
			{
				parentFile		= oSrc.parentFile;
				parentElement	= oSrc.parentElement;

				rad = oSrc.rad;
				return *this;
			}

		public:
			virtual void fromXML(XmlUtils::CXmlNode& node)
			{
				node.ReadAttributeBase(L"rad", rad);
			}

			virtual CString toXML() const
			{
				if (rad.IsInit())
				{
					CString str = _T("");
					str.Format(_T("<a:alphaOutset rad=\"%u\" />"), *rad);
					return str;
				}

				return _T("<a:alphaOutset/>");
			}

			virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
			{
				pWriter->StartRecord(EFFECT_TYPE_ALPHAOUTSET);

				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeStart);
				pWriter->WriteSize_t2(0, rad);
				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeEnd);

				pWriter->EndRecord();
			}

		public:
			nullable_sizet rad;
		protected:
			virtual void FillParentPointersForChilds(){};
		};
	} 
} 

#endif // PPTX_LOGIC_ALPHAOUTSET_INCLUDE_H_