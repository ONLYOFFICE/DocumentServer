// stdafx.h : include file for standard system include files,
// or project specific include files that are used frequently,
// but are changed infrequently

#pragma once
#define _CRT_SECURE_NO_DEPRECATE 1
#define _CRT_NONSTDC_NO_DEPRECATE 1

#ifndef STRICT
#define STRICT
#endif

// Modify the following defines if you have to target a platform prior to the ones specified below.
// Refer to MSDN for the latest info on corresponding values for different platforms.
#ifndef WINVER				// Allow use of features specific to Windows 95 and Windows NT 4 or later.
#define WINVER 0x0501		// Change this to the appropriate value to target Windows 98 and Windows 2000 or later.
#endif

#ifndef _WIN32_WINNT		// Allow use of features specific to Windows NT 4 or later.
#define _WIN32_WINNT 0x0500	// Change this to the appropriate value to target Windows 2000 or later.
#endif						

#ifndef _WIN32_WINDOWS		// Allow use of features specific to Windows 98 or later.
#define _WIN32_WINDOWS 0x0410 // Change this to the appropriate value to target Windows Me or later.
#endif

#ifndef _WIN32_IE			// Allow use of features specific to IE 4.0 or later.
#define _WIN32_IE 0x0400	// Change this to the appropriate value to target IE 5.0 or later.
#endif

#define _ATL_APARTMENT_THREADED
#define _ATL_NO_AUTOMATIC_NAMESPACE

#define _ATL_CSTRING_EXPLICIT_CONSTRUCTORS	// some CString constructors will be explicit

// turns off ATL's hiding of some common and often safely ignored warning messages
#define _ATL_ALL_WARNINGS

#include <atlbase.h>
#include <atlcom.h>
#include <atlwin.h>
#include <atltypes.h>
#include <atlctl.h>
#include <atlhost.h>
#include <atlcoll.h>
#include "../Common/atldefine.h"

#define _USE_MATH_DEFINES
#include <math.h>
#include <wingdi.h>

#define NODOCX
#define PPTX_DEF

#define PPT_DEF
#define ENABLE_PPT_TO_PPTX_CONVERT
#define _AVS_PPT_SHAPE_INCLUDE_

using namespace ATL;
#include "../ASCImageStudio3/ASCGraphics/Interfaces/ASCRenderer.h"
#include "../Common/Config.h"

#import "../Redist/ASCOfficeUtils.dll"			named_guids raw_interfaces_only rename_namespace("OfficeUtils")
#import "../Redist/ASCOfficeDocxFile2.dll"		named_guids raw_interfaces_only rename_namespace("DocxFile2")
#import "../Redist/XlsxSerializerCom.dll"		named_guids raw_interfaces_only rename_namespace("XlsxCom"), exclude("_IAVSOfficeFileTemplateEvents"), exclude("_IAVSOfficeFileTemplateEvents2")

#ifdef BUILD_CONFIG_OPENSOURCE_VERSION

#import "../Redist/OfficeCore.dll"				named_guids raw_interfaces_only rename_namespace("OfficeCore")

namespace MediaCore
{
	typedef OfficeCore::IUncompressedFrame IAVSUncompressedVideoFrame;
	const GUID CLSID_CAVSUncompressedVideoFrame = OfficeCore::CLSID_CUncompressedFrame;
	const GUID IID_IAVSUncompressedVideoFrame = OfficeCore::IID_IUncompressedFrame;
}

namespace ASCGraphics
{
	typedef OfficeCore::IWinFonts IASCFontManager;
	const GUID CLSID_CASCFontManager = OfficeCore::CLSID_CWinFonts;
	const GUID IID_IASCFontManager = OfficeCore::IID_IWinFonts;
}

#else

#define AVS_USE_CONVERT_PPTX_TOCUSTOM_VML

#import "../Redist/ASCMediaCore3.dll"			named_guids raw_interfaces_only rename_namespace("MediaCore"), exclude("tagRECT")
#import "../Redist/ASCImageStudio3.dll"			named_guids raw_interfaces_only rename_namespace("ImageStudio"), exclude("IASCRenderer")
#import "../Redist/ASCHTMLRenderer.dll"			named_guids raw_interfaces_only rename_namespace("HtmlRenderer"), exclude("IASCRenderer")

#import "../Redist/ASCGraphics.dll"				named_guids raw_interfaces_only rename_namespace("ASCGraphics"), exclude("IASCRenderer")
#import "../Redist/ASCFontConverter.dll"		named_guids raw_interfaces_only rename_namespace("Fonts")

#endif