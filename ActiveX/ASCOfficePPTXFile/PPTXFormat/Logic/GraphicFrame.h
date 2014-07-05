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
#ifndef PPTX_LOGIC_GRAPHICFRAME_INCLUDE_H_
#define PPTX_LOGIC_GRAPHICFRAME_INCLUDE_H_

#include "./../WrapperWritingElement.h"
#include "NvGraphicFramePr.h"
#include "Xfrm.h"
#include "ShapeProperties.h"

#include "Table/Table.h"
#include "SmartArt.h"
#include "Pic.h"


namespace PPTX
{
	namespace Logic
	{
		class GraphicFrame : public WrapperWritingElement
		{
		public:
			GraphicFrame();
			virtual ~GraphicFrame();			
			explicit GraphicFrame(XmlUtils::CXmlNode& node);
			const GraphicFrame& operator =(XmlUtils::CXmlNode& node);

		public:
			virtual void fromXML(XmlUtils::CXmlNode& node);
			virtual CString toXML() const;
			virtual void GetRect(RECT& pRect)const;

			virtual void toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const;
	

			virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const;
			virtual void fromPPTY(NSBinPptxRW::CBinaryFileReader* pReader);
		public:
			NvGraphicFramePr		nvGraphicFramePr;
			Xfrm					xfrm;
			
			
			
			
			
			nullable_string			spid;
			nullable<Table>			Table;
			nullable<SmartArt>		smartArt;
			nullable<ChartRec>		chartRec;
			nullable<Pic>			pic;

			OOX::CPath GetPathBySpid()const;
		protected:
			virtual void FillParentPointersForChilds();
		};
	} 
} 

#endif // PPTX_LOGIC_GRAPHICFRAME_INCLUDE_H