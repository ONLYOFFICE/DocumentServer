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
#ifndef PPTX_WRAPPER_WRITING_ELEMENT_INCLUDE_H_
#define PPTX_WRAPPER_WRITING_ELEMENT_INCLUDE_H_

#include "DocxFormat/WritingElement.h"
#include "WrapperFile.h"

#include "../Editor/BinWriters.h"

#define PPTX_LOGIC_BASE(Class)										\
	Class()	{}														\
	virtual ~Class() {}												\
	explicit Class(XmlUtils::CXmlNode& node)	{ fromXML(node); }	\
	const Class& operator =(XmlUtils::CXmlNode& node)				\
	{																\
		fromXML(node);												\
		return *this;												\
	}																\
	Class(const Class& oSrc) { *this = oSrc; }						\

namespace PPTX
{
	class WrapperWritingElement : public OOX::WritingElement
	{
	public:
		WrapperWritingElement() : parentElement(NULL), parentFile(NULL)
		{
		}
		virtual ~WrapperWritingElement()
		{
		}
	protected:
		WrapperWritingElement const* parentElement;
		WrapperFile const* parentFile;
	protected:
		virtual void FillParentPointersForChilds()=0;
	public:
		virtual void SetParentPointer(const WrapperWritingElement* pParent)
		{
			parentElement	= pParent;
			parentFile		= parentElement->parentFile;

			FillParentPointersForChilds();
		}
		virtual void SetParentFilePointer(const WrapperFile* pFile)
		{
			parentFile = pFile;
			FillParentPointersForChilds();
		}
		virtual WrapperWritingElement const* const	GetParentPointer()const		{return parentElement;}
		virtual WrapperFile const* const			GetParentFilePointer()const {return parentFile;}

		virtual void fromXMLString(CString strXml)
		{
			XmlUtils::CXmlNode oNode;
			oNode.FromXmlString(strXml);
			fromXML(oNode);
		}

		virtual OOX::EElementType getType() const
		{
			return OOX::et_Unknown;
		}


		template<class T> const bool parentIs()const
		{
			if (NULL == parentElement)
				return false;
			T* pResult = dynamic_cast<T*>(const_cast<PPTX::WrapperWritingElement*>(parentElement));
			return (NULL != pResult);
		}
		template<class T> const T& parentAs()const
		{
			T* pResult = dynamic_cast<T*>(const_cast<PPTX::WrapperWritingElement*>(parentElement));
			return *pResult;
		}


		template<class T> const bool parentFileIs()const
		{
			if (NULL == parentFile)
				return false;
			T* pResult = dynamic_cast<T*>(const_cast<PPTX::WrapperFile*>(parentFile));
			return (NULL != pResult);
		}
		template<class T> const T& parentFileAs()const
		{
			T* pResult = dynamic_cast<T*>(const_cast<PPTX::WrapperFile*>(parentFile));
			return *pResult;
		}

		
		virtual void fromPPTY(NSBinPptxRW::CBinaryFileReader* pReader)
		{
			pReader->SkipRecord();
		}
        virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
		{
		}
		virtual void toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const
		{
		}
	};
} 

#endif // PPTX_WRAPPER_WRITING_ELEMENT_INCLUDE_H_