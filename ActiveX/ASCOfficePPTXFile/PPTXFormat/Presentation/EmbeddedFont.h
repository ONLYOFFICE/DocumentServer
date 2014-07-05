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
#ifndef PPTX_PRESENTATION_EMBEDDEDFONT_INCLUDE_H_
#define PPTX_PRESENTATION_EMBEDDEDFONT_INCLUDE_H_

#include "./../WrapperWritingElement.h"
#include "EmbeddedFontDataId.h"
#include "./../Logic/TextFont.h"

namespace PPTX
{
	namespace nsPresentation
	{
		class EmbeddedFont : public WrapperWritingElement
		{
		public:
			PPTX_LOGIC_BASE(EmbeddedFont)

		public:
			virtual void fromXML(XmlUtils::CXmlNode& node)
			{
				Bold		= node.ReadNode(_T("p:bold"));
				BoldItalic	= node.ReadNode(_T("p:boldItalic"));
				Italic		= node.ReadNode(_T("p:italic"));
				Regular		= node.ReadNode(_T("p:regular"));
				Font		= node.ReadNode(_T("p:font"));

				FillParentPointersForChilds();
			}
			virtual CString toXML() const
			{
				XmlUtils::CNodeValue oValue;
				oValue.WriteNullable(Bold);
				oValue.WriteNullable(BoldItalic);
				oValue.WriteNullable(Italic);
				oValue.WriteNullable(Regular);
				oValue.Write(Font);

				return XmlUtils::CreateNode(_T("p:embeddedFont"), oValue);
			}
		public:
			nullable<EmbeddedFontDataId> Bold;
			nullable<EmbeddedFontDataId> BoldItalic;
			nullable<EmbeddedFontDataId> Italic;
			nullable<EmbeddedFontDataId> Regular;
			Logic::TextFont Font;
		protected:
			virtual void FillParentPointersForChilds()
			{
				if(Bold.is_init())
					Bold->SetParentPointer(this);
				if(BoldItalic.is_init())
					BoldItalic->SetParentPointer(this);
				if(Italic.is_init())
					Italic->SetParentPointer(this);
				if(Regular.is_init())
					Regular->SetParentPointer(this);
				Font.SetParentPointer(this);
			}
		};
	} 
} 

#endif // PPTX_PRESENTATION_EMBEDDEDFONT_INCLUDE_H_