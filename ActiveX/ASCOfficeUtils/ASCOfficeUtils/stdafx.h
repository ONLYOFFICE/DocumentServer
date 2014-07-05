// stdafx.h : include file for standard system include files,
// or project specific include files that are used frequently,
// but are changed infrequently

#pragma once

#ifndef STRICT
#define STRICT
#endif

// Modify the following defines if you have to target a platform prior to the ones specified below.
// Refer to MSDN for the latest info on corresponding values for different platforms.
#ifndef WINVER				// Allow use of features specific to Windows 95 and Windows NT 4 or later.
#define WINVER 0x0400		// Change this to the appropriate value to target Windows 98 and Windows 2000 or later.
#endif

#ifndef _WIN32_WINNT		// Allow use of features specific to Windows NT 4 or later.
#define _WIN32_WINNT 0x0400	// Change this to the appropriate value to target Windows 2000 or later.
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

#include "CSLocker.h"

using namespace ATL;

#include "../../Common/Config.h"

#ifdef BUILD_CONFIG_FULL_VERSION
#import "../../Redist/ASCMediaCore3.dll"					named_guids raw_interfaces_only rename_namespace("MediaCore"), exclude("tagRECT")
#else
#import "../../Redist/OfficeCore.dll"						named_guids raw_interfaces_only rename_namespace("OfficeCore")
#endif

#ifdef _DEBUG
	#pragma comment(lib, "..\\GOCR\\Debug\\GOCR.lib")
	#pragma comment(lib, "..\\PNM\\Debug\\PNM.lib")
#else
	#ifdef BUILD_CONFIG_FULL_VERSION
		#pragma comment(lib, "..\\GOCR\\Release\\GOCR.lib")
		#pragma comment(lib, "..\\PNM\\Release\\PNM.lib")
	#else
		#pragma comment(lib, "..\\GOCR\\ReleaseOpenSource\\GOCR.lib")
		#pragma comment(lib, "..\\PNM\\ReleaseOpenSource\\PNM.lib")
	#endif
#endif

static const long UTILS_ONPROGRESSEVENT_ID = 0;

typedef void (*OnProgressCallback)( LPVOID lpParam, long nID, long nPercent, short* Cancel );

struct ProgressCallback
{
  OnProgressCallback OnProgress;
  LPVOID caller;
};