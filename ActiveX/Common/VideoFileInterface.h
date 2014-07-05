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
#include "ASCVideoFileTemplate.h"


[ object, uuid("3A836AA4-429F-4742-A6B6-98D579FE744F"), dual, pointer_default(unique)]
__interface IVideoFile3 : IAVSVideoFileTemplate
{
	
	[id(303000 + 1), propget]	HRESULT VideoFileType([out, retval] long *pVal);
	[id(303000 + 1), propput]	HRESULT VideoFileType([in] long newVal);

	[id(303000 + 10)]			HRESULT GetFileType([in]BSTR FilePath, [out, retval] long *pVal);
	
	[id(303000 + 20)]			HRESULT GetInternalInterface([out, retval] IUnknown **pVal);

	[id(303000 + 30), propget]	HRESULT TransformEnable([out, retval] VARIANT_BOOL *pVal);
	[id(303000 + 30), propput]	HRESULT TransformEnable([in] VARIANT_BOOL newVal);
	
	[id(303000 + 31), propget]	HRESULT VideoReadingFormat([out, retval] IUnknown **pVal);
	[id(303000 + 31), propput]	HRESULT VideoReadingFormat([in] IUnknown *pVal);
	
	[id(303000 + 35), propget]	HRESULT AudioReadingFormat([out, retval] IUnknown **pVal);
	[id(303000 + 35), propput]	HRESULT AudioReadingFormat([in] IUnknown *pVal);

	[id(303000 + 40)]			HRESULT SeekToFrame([in] long Frame);
};
