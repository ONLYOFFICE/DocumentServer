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







[ object, uuid("804C1FF6-7020-477E-AD9F-980E9201C237"), dual, pointer_default(unique) ]
__interface IOfficeOCR : IDispatch
{
	[id(1)]			HRESULT Recognize([in] IUnknown *Image, [out, retval] BSTR* Text);					

	[id(2), propput]HRESULT OutputFormat([in] LONG Type);												
	[id(2), propget]HRESULT OutputFormat([ out, retval ] LONG *Type);									

	[id(3), propput]HRESULT GrayLevel([in] LONG Type);													
	[id(3), propget]HRESULT GrayLevel([ out, retval ] LONG *Type);										

	[id(4), propput]HRESULT DustSize([in] LONG Type);													
	[id(4), propget]HRESULT DustSize([ out, retval ] LONG *Type);										

	[id(5), propput]HRESULT SpaceWidthDots([in] LONG Type);												
	[id(5), propget]HRESULT SpaceWidthDots([ out, retval ] LONG *Type);									

	[id(6), propput]HRESULT Certainty([in] LONG Type);													
	[id(6), propget]HRESULT Certainty([ out, retval ] LONG *Type);										

	[id(100000)]	HRESULT SetAdditionalParam([in] BSTR ParamName, [in] VARIANT ParamValue);			
	[id(100001)]	HRESULT GetAdditionalParam([in] BSTR ParamName, [out, retval] VARIANT* ParamValue);	
};