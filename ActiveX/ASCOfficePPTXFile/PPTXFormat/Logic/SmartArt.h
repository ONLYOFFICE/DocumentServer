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
#ifndef PPTX_LOGIC_SLIDE_SMARTART_INCLUDE_H_
#define PPTX_LOGIC_SLIDE_SMARTART_INCLUDE_H_

#include "./SpTree.h"

namespace PPTX
{
	namespace Logic
	{
		class SmartArt : public WrapperWritingElement
		{
		public:
			PPTX_LOGIC_BASE(SmartArt)

			SmartArt& operator=(const SmartArt& oSrc)
			{
				parentFile		= oSrc.parentFile;
				parentElement	= oSrc.parentElement;

				diag = oSrc.diag;
				return *this;
			}

		public:
			virtual void fromXML(XmlUtils::CXmlNode& node)
			{
				node.ReadAttributeBase(L"r:dm", id_data);
				FillParentPointersForChilds();
			}


			virtual CString toXML() const
			{
				return _T("");
			}

			virtual void toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const
			{				
			}

			virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
			{
				if (diag.is_init())
				{
					smart_ptr<PPTX::FileContainer> old = pWriter->m_pCommonRels;
					pWriter->m_pCommonRels = m_oCommonRels;
					diag->toPPTY(pWriter);
					pWriter->m_pCommonRels = old;
				}
			}

			virtual void fromPPTY(NSBinPptxRW::CBinaryFileReader* pReader)
			{
				pReader->SkipRecord();
			}

		public:

			nullable<OOX::RId> id_data;

			nullable<PPTX::Logic::SpTree> diag;
			smart_ptr<FileContainer> m_oCommonRels;
		protected:
			virtual void FillParentPointersForChilds()
			{
				if(diag.IsInit())
					diag->SetParentPointer(this);
			}

		public:
			void LoadDrawing(NSBinPptxRW::CBinaryFileWriter* pWriter);
		};

		class ChartRec : public WrapperWritingElement
		{
		public:
			ChartRec()	
			{
				m_pData = NULL;
				m_lChartNumber = 0;
			}
			virtual ~ChartRec() 
			{
				RELEASEARRAY(m_pData);
			}
			explicit ChartRec(XmlUtils::CXmlNode& node)	
			{ 
				fromXML(node); 
			}
			const ChartRec& operator =(XmlUtils::CXmlNode& node)
			{
				fromXML(node);
				return *this;
			}
			ChartRec(const ChartRec& oSrc) 
			{ 
				*this = oSrc; 
			}

			ChartRec& operator=(const ChartRec& oSrc)
			{
				parentFile		= oSrc.parentFile;
				parentElement	= oSrc.parentElement;

				return *this;
			}

		public:
			virtual void fromXML(XmlUtils::CXmlNode& node)
			{
				m_pData = NULL;

				node.ReadAttributeBase(L"r:id", id_data);
				FillParentPointersForChilds();
			}


			virtual CString toXML() const
			{
				return _T("");
			}

			virtual void toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const;
			virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const;

			virtual void fromPPTY(NSBinPptxRW::CBinaryFileReader* pReader);

		public:

			nullable<OOX::RId> id_data;

			LONG m_lChartNumber;
			LPSAFEARRAY m_pData;
		protected:
			virtual void FillParentPointersForChilds()
			{				
			}
		};
	} 
} 

#endif 
