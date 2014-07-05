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
#ifndef PPTX_LOGIC_EFFECTLST_INCLUDE_H_
#define PPTX_LOGIC_EFFECTLST_INCLUDE_H_

#include "./../WrapperWritingElement.h"
#include "Effects\Blur.h"
#include "Effects\Glow.h"
#include "Effects\OuterShdw.h"
#include "Effects\PrstShdw.h"
#include "Effects\InnerShdw.h"
#include "Effects\Reflection.h"
#include "Effects\SoftEdge.h"
#include "Effects\FillOverlay.h"

namespace PPTX
{
	namespace Logic
	{

		class EffectLst : public WrapperWritingElement
		{
		public:
			
			PPTX_LOGIC_BASE(EffectLst)

			EffectLst& operator=(const EffectLst& oSrc)
			{
				parentFile		= oSrc.parentFile;
				parentElement	= oSrc.parentElement;

				blur		= oSrc.blur;
				fillOverlay	= oSrc.fillOverlay;
				glow		= oSrc.glow;
				innerShdw	= oSrc.innerShdw;
				outerShdw	= oSrc.outerShdw;
				prstShdw	= oSrc.prstShdw;
				reflection	= oSrc.reflection;
				softEdge	= oSrc.softEdge;

				return *this;
			}

		public:
			virtual void fromXML(XmlUtils::CXmlNode& node)
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

			virtual CString toXML() const
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

			virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
			{
				pWriter->StartRecord(EFFECTPROPERTIES_TYPE_LIST);

				pWriter->WriteRecord2(0, blur);
				pWriter->WriteRecord2(1, fillOverlay);
				pWriter->WriteRecord2(2, glow);
				pWriter->WriteRecord2(3, innerShdw);
				pWriter->WriteRecord2(4, outerShdw);
				pWriter->WriteRecord2(5, prstShdw);
				pWriter->WriteRecord2(6, reflection);
				pWriter->WriteRecord2(7, softEdge);

				pWriter->EndRecord();
			}

		public:
			nullable<Blur> blur;
			nullable<FillOverlay> fillOverlay;
			nullable<Glow> glow;
			nullable<InnerShdw> innerShdw;
			nullable<OuterShdw> outerShdw;
			nullable<PrstShdw> prstShdw;
			nullable<Reflection> reflection;
			nullable<SoftEdge> softEdge;
		protected:
			virtual void EffectLst::FillParentPointersForChilds()
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
		};
	} 
} 

#endif // PPTX_LOGIC_EFFECTLST_INCLUDE_H_