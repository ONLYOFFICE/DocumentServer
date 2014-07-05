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
#ifndef PPTX_LOGIC_CAMERA_INCLUDE_H_
#define PPTX_LOGIC_CAMERA_INCLUDE_H_

#include "./../WrapperWritingElement.h"
#include "Rot.h"
#include "./../Limit/CameraType.h"

namespace PPTX
{
	namespace Logic
	{

		class Camera : public WrapperWritingElement
		{
		public:
			PPTX_LOGIC_BASE(Camera)

		public:
			virtual void fromXML(XmlUtils::CXmlNode& node)
			{
				prst	= node.GetAttribute(_T("prst"));
				node.ReadAttributeBase(L"fov", fov);
				node.ReadAttributeBase(L"zoom", zoom);

				rot		= node.ReadNode(_T("a:rot"));
				FillParentPointersForChilds();
			}

			virtual CString toXML() const
			{
				XmlUtils::CAttribute oAttr;
				oAttr.Write(_T("prst"), prst.get());
				oAttr.Write(_T("fov"), fov);
				oAttr.Write(_T("zoom"), zoom);

				XmlUtils::CNodeValue oValue;
				oValue.WriteNullable(rot);

				return XmlUtils::CreateNode(_T("a:camera"), oAttr, oValue);
			}
		public:
			nullable<Rot>		rot;

			Limit::CameraType	prst;
			nullable_int		fov;
			nullable_int		zoom;
		protected:
			virtual void FillParentPointersForChilds()
			{
				if(rot.IsInit())
					rot->SetParentPointer(this);
			}

			AVSINLINE void Normalize()
			{
				fov.normalize(0, 10800000);
				zoom.normalize_positive();
			}
		};
	} 
} 

#endif // PPTX_LOGIC_CAMERA_INCLUDE_H_