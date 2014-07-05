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
#include "..\..\..\..\Common\OfficeRendererTemplate.h"

[object, uuid("BFD24172-C1B1-4de0-8CFF-378A4F9EC111"), dual, pointer_default(unique)]
__interface IAVSPageCommands : IAVSOfficeRendererTemplate
{
	[id(1000 + 1), propget]	HRESULT Width([out, retval] FLOAT* lWidth);
	[id(1000 + 2), propget]	HRESULT Height([out, retval] FLOAT* lHeight);

	[id(1000 + 3)]			HRESULT Draw([in] IUnknown* punkRenderer, [in] double dDPIX, [in] double dDPIY, [in] BOOL* pBreak);
	[id(1000 + 6)]			HRESULT Draw2([in] IUnknown* punkRenderer, [in] double dDPIX, [in] double dDPIY, [in] BOOL* pBreak);

	[id(1000 + 4)]			HRESULT InitAdvancedCommands();
	[id(1000 + 5)]			HRESULT DestroyAdvancedCommands();
};

[object, uuid("38BD7597-2053-41cf-AE1D-00A62609F580"), dual, pointer_default(unique)]
__interface IAVSCommandsRenderer : IAVSOfficeRendererTemplate
{
	[id(1000 + 1)] HRESULT DrawPage([in] LONG lPageNumber, [in] IUnknown* punkRenderer);

	[id(1000 + 2), propget] HRESULT PageCount([out, retval] LONG* lPageNumber);
	[id(1000 + 3)] HRESULT GetPageSize([in] LONG lPageNumber, [out] FLOAT* pfWidth, [out] FLOAT* pfHeight);

	[id(1000 + 4)] HRESULT LockPage([in] LONG lPageNumber, [out, retval] IUnknown** ppunkPage);
};

[dispinterface, uuid("71412D3A-845E-47e1-A3EE-0D3EF4A07A67")]
__interface _IAVSCommandsRendererEvents
{
	[id(100)] HRESULT OnNewPage(double dWidthMm, double dHeightMm);
	[id(101)] HRESULT OnCompletePage();
};
