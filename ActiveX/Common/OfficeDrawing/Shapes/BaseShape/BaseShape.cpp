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
#include "stdafx.h"
#include "BaseShape.h"

#if defined(PPTX_DEF)
#include "PPTXShape/PPTXShape.h"
#endif

#if defined(PPT_DEF)
#include "PPTShape/PPTShape.h"
#endif

#if defined(ODP_DEF)
#include "OdpShape/OdpShape.h"
#endif

CBaseShape* CBaseShape::CreateByType(NSBaseShape::ClassType ClassType, int ShapeType)
{
#if defined(PPTX_DEF)
	if(ClassType == pptx)
	{
		return CPPTXShape::CreateByType((OOXMLShapes::ShapeType)ShapeType);
	}
#endif

#if defined(PPT_DEF)

#endif

#if defined(ODP_DEF)
	if(ClassType == NSBaseShape::odp)
	{
		return COdpShape::CreateByType((OdpShapes::ShapeType)ShapeType);
	}
#endif
	return NULL;
}

bool CBaseShape::SetType(NSBaseShape::ClassType ClassType, int ShapeType)
{
	if(ClassType != GetClassType())
		return false;
#if defined(PPTX_DEF)
	if(ClassType == pptx)
	{
		return ((CPPTXShape*)this)->SetShapeType((OOXMLShapes::ShapeType)ShapeType);
	}
#endif

#if defined(PPT_DEF)
	if(ClassType == ppt)
	{
		return ((CPPTShape*)this)->SetShapeType((PPTShapes::ShapeType)ShapeType);
	}
#endif

#if defined(ODP_DEF)
	if(ClassType == NSBaseShape::odp)
	{
		return ((COdpShape*)this)->SetShapeType((OdpShapes::ShapeType)ShapeType);
	}
#endif

	return false;
}