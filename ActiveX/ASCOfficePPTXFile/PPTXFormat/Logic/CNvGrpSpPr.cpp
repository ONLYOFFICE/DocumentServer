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
 #include "CNvGrpSpPr.h"

namespace PPTX
{
	namespace Logic
	{

		CNvGrpSpPr::CNvGrpSpPr()
		{
		}


		CNvGrpSpPr::~CNvGrpSpPr()
		{
		}
	

		CNvGrpSpPr::CNvGrpSpPr(XmlUtils::CXmlNode& node)
		{
			fromXML(node);
		}


		const CNvGrpSpPr& CNvGrpSpPr::operator =(XmlUtils::CXmlNode& node)
		{
			fromXML(node);
			return *this;
		}


		void CNvGrpSpPr::fromXML(XmlUtils::CXmlNode& node)
		{
			XmlUtils::CXmlNode oNode;
			if (node.GetNode(_T("a:grpSpLocks"), oNode))
			{
				oNode.ReadAttributeBase(L"noChangeAspect", noChangeAspect);
				oNode.ReadAttributeBase(L"noGrp", noGrp);
				oNode.ReadAttributeBase(L"noMove", noMove);
				oNode.ReadAttributeBase(L"noResize", noResize);
				oNode.ReadAttributeBase(L"noRot", noRot);
				oNode.ReadAttributeBase(L"noSelect", noSelect);
				oNode.ReadAttributeBase(L"noUngrp", noUngrp);
			}
		}


		CString CNvGrpSpPr::toXML() const
		{
			XmlUtils::CAttribute oAttr;
			oAttr.Write(_T("noChangeAspect"), noChangeAspect);
			oAttr.Write(_T("noGrp"), noGrp);
			oAttr.Write(_T("noMove"), noMove);
			oAttr.Write(_T("noResize"), noResize);
			oAttr.Write(_T("noRot"), noRot);
			oAttr.Write(_T("noSelect"), noSelect);
			oAttr.Write(_T("noUngrp"), noUngrp);

			if (_T("") == oAttr.m_strValue)
				return _T("<p:cNvGrpSpPr/>");

			return _T("<p:cNvGrpSpPr>") + XmlUtils::CreateNode(_T("a:grpSpLocks"), oAttr) + _T("</p:cNvGrpSpPr>");
		}

	} 
} // namespace PPTX