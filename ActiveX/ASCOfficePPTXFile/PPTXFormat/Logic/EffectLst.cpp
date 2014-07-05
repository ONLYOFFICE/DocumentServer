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
 #include "EffectLst.h"

namespace PPTX
{
	namespace Logic
	{
		EffectLst::EffectLst()
		{
		}

		EffectLst::~EffectLst()
		{
		}

		EffectLst::EffectLst(XmlUtils::CXmlNode& node)
		{
			fromXML(node);
		}

		const EffectLst& EffectLst::operator =(XmlUtils::CXmlNode& node)
		{
			fromXML(node);
			return *this;
		}

		void EffectLst::fromXML(XmlUtils::CXmlNode& node)
		{
			blur		= node.ReadNode(_T("a:blur"));
			fillOverlay = node.ReadNode(_T("a:fillOverlay"));
			glow		= node.ReadNode(_T("a:glow"));
			innerShdw	= node.ReadNode(_T("a:innerShdw"));
			outerShdw	= node.ReadNode(_T("a:outerShdw"));
			prstShdw	= node.ReadNode(_T("a:prstShdw"));
			reflection	= node.ReadNode(_T("a:reflection"));
			softEdge	= node.ReadNode(_T("a:softEdge"));

			FillParentPointersForChilds();
		}

		CString EffectLst::toXML() const
		{
			CString str = _T("<a:effectLst>");
			if (blur.IsInit())			str += blur->toXML();
			if (fillOverlay.IsInit())	str += fillOverlay->toXML();
			if (glow.IsInit())			str += glow->toXML();
			if (innerShdw.IsInit())		str += innerShdw->toXML();
			if (outerShdw.IsInit())		str += outerShdw->toXML();
			if (prstShdw.IsInit())		str += prstShdw->toXML();
			if (reflection.IsInit())	str += reflection->toXML();
			if (softEdge.IsInit())		str += softEdge->toXML();

			str += _T("</a:effectLst>");
			return str;
		}

		void EffectLst::FillParentPointersForChilds()
		{
			if(blur.IsInit())
				blur->SetParentPointer(this);
			if(fillOverlay.IsInit())
				fillOverlay->SetParentPointer(this);
			if(glow.IsInit())
				glow->SetParentPointer(this);
			if(innerShdw.IsInit())
				innerShdw->SetParentPointer(this);
			if(outerShdw.IsInit())
				outerShdw->SetParentPointer(this);
			if(prstShdw.IsInit())
				prstShdw->SetParentPointer(this);
			if(reflection.IsInit())
				reflection->SetParentPointer(this);
			if(softEdge.IsInit())
				softEdge->SetParentPointer(this);
		}

	} 
} // namespace PPTX