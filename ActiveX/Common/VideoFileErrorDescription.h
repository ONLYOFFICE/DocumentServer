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
 #ifdef _MSC_VER
	#pragma once			
#endif	

#ifndef _VIDEOFILEERRORDESCRIPTION_H_	
#define _VIDEOFILEERRORDESCRIPTION_H_

#include <windows.h>

#define AVS_ERROR_FIRST						MAKE_HRESULT(SEVERITY_ERROR, FACILITY_ITF, 0x0300)

#define AVS_ERROR_UNEXPECTED				(AVS_ERROR_FIRST + 0x0000)
#define AVS_ERROR_BUSY						(AVS_ERROR_FIRST + 0x0001)
#define AVS_ERROR_MEMORY					(AVS_ERROR_FIRST + 0x0002)
#define AVS_ERROR_FILEACCESS				(AVS_ERROR_FIRST + 0x0003)
#define AVS_ERROR_FILEFORMAT				(AVS_ERROR_FIRST + 0x0004)
#define AVS_ERROR_VIDEOUNSUPPORTED			(AVS_ERROR_FIRST + 0x0005)
#define AVS_ERROR_AUDIOUNSUPPORTED			(AVS_ERROR_FIRST + 0x0006)
#define AVS_ERROR_INVALIDOPERATION			(AVS_ERROR_FIRST + 0x0007)
#define AVS_ERROR_INVALIDARGUMENT			(AVS_ERROR_FIRST + 0x0008)
#define AVS_ERROR_CONTROLNOTINSTALLED		(AVS_ERROR_FIRST + 0x0009)
#define AVS_ERROR_INDEXOUTOFRANGE			(AVS_ERROR_FIRST + 0x000A)
#define AVS_ERROR_FORMATNOTSUPPORT			(AVS_ERROR_FIRST + 0x000B)
#define AVS_ERROR_FILEFORMATIDENTICAL		(AVS_ERROR_FIRST + 0x000C)
#define AVS_ERROR_FRAMECONVERTING			(AVS_ERROR_FIRST + 0x000D)
#define AVS_ERROR_DATAUNSUPPORTED			(AVS_ERROR_FIRST + 0x000E)
#define AVS_ERROR_FILEOPENCANCEL			(AVS_ERROR_FIRST + 0x000E)

#define AVS_ERROR_QT_CONTAINER				(AVS_ERROR_FIRST + 0x0101)
#define AVS_ERROR_QT_VIDEODESC				(AVS_ERROR_FIRST + 0x0102)
#define AVS_ERROR_QT_AUDIODESC				(AVS_ERROR_FIRST + 0x0103)
#define AVS_ERROR_QT_AUDIOCODEC				(AVS_ERROR_FIRST + 0x0104)
#define AVS_ERROR_QT_VIDEOCODEC				(AVS_ERROR_FIRST + 0x0105)
#define AVS_ERROR_QT_DRM					(AVS_ERROR_FIRST + 0x0106)

#define AVS_ERROR_AVI_CONTAINER				(AVS_ERROR_FIRST + 0x0201)
#define AVS_ERROR_ACM_AUDIOCODEC			(AVS_ERROR_FIRST + 0x0202)
#define AVS_ERROR_ACM_VIDEOCODEC			(AVS_ERROR_FIRST + 0x0203)

#define AVS_ERROR_DVD_CONTENTPROTECT		(AVS_ERROR_FIRST + 0x0301)
#define AVS_ERROR_DVD_REGIONMISMATCH		(AVS_ERROR_FIRST + 0x0302)

#define AVS_ERROR_AUDIOOUTDRIVER			(AVS_ERROR_FIRST + 0x0401)
#define AVS_ERROR_AUDIOINPDRIVER			(AVS_ERROR_FIRST + 0x0402)
#define AVS_ERROR_AUDIOMIXERDRIVER			(AVS_ERROR_FIRST + 0x0403)
#define AVS_ERROR_ASPIDRIVER				(AVS_ERROR_FIRST + 0x0404)
#define AVS_ERROR_STREAM					(AVS_ERROR_FIRST + 0x0405)

#define AVS_ERROR_RM_CONTAINER				(AVS_ERROR_FIRST + 0x0501)
#define AVS_ERROR_RM_DECODER				(AVS_ERROR_FIRST + 0x0502)
#define AVS_ERROR_RM_ENCODER				(AVS_ERROR_FIRST + 0x0503)

#define AVS_ERROR_BLURAY_CONTENTPROTECT		(AVS_ERROR_FIRST + 0x0601)
#define AVS_ERROR_BLURAY_REGIONMISMATCH		(AVS_ERROR_FIRST + 0x0602)

#define AVS_ERROR_NOVIDEODATA    			(AVS_ERROR_FIRST + 0x0901)	
#define AVS_ERROR_NOAUDIODATA    			(AVS_ERROR_FIRST + 0x0902)	

#define		AVS_REMAKER_ERROR_OPEN_SRC_FILE					(AVS_ERROR_FIRST + 0x1001)
#define		AVS_REMAKER_ERROR_CREATE_DST_FILE				(AVS_ERROR_FIRST + 0x1002)
#define		AVS_REMAKER_ERROR_NO_EQUAL_VIDEO				(AVS_ERROR_FIRST + 0x1003)
#define		AVS_REMAKER_ERROR_CONTAINER						(AVS_ERROR_FIRST + 0x1004)

const LPCOLESTR c_pszErrorUnexpected = L"Unexpected error.";
const LPCOLESTR c_pszErrorBusy = L"Busy error.";
const LPCOLESTR c_pszErrorMemory = L"Memory error.";
const LPCOLESTR c_pszErrorFileAccess= L"File access error.";
const LPCOLESTR c_pszErrorFileFormat= L"File format error.";
const LPCOLESTR c_pszErrorVideoUnsupported = L"Video format unsupported.";
const LPCOLESTR c_pszErrorAudioUnsupported = L"Audio format unsupported.";
const LPCOLESTR c_pszErrorDataUnsupported = L"Data format unsupported.";
const LPCOLESTR c_pszErrorInvalidOperation = L"Invalid operation.";
const LPCOLESTR c_pszErrorInvalidArgument = L"Invalid argument.";
const LPCOLESTR c_pszErrorControlNotInstalled = L"Control not installed.";
const LPCOLESTR c_pszErrorIndexOutOfRange = L"Index out of range.";
const LPCOLESTR c_pszErrorFormatNotSupport = L"Format not support.";

const LPCOLESTR c_pszErrorAudioOutDriver = L"Output Driver error.";
const LPCOLESTR c_pszErrorAudioInpDriver = L"Input Driver error.";
const LPCOLESTR c_pszErrorAudioMixerDriver = L"Mixer Driver error.";
const LPCOLESTR c_pszErrorAspiDriver = L"Aspi Driver error.";
const LPCOLESTR c_pszErrorStream = L"The stream is closed or unavailable.";

const LPCOLESTR c_pszErrorQtContainer	= L"QuickTime container not correct.";
const LPCOLESTR c_pszErrorQtVideoDesc	= L"QuickTime video description not correct.";
const LPCOLESTR c_pszErrorQtAudioDesc	= L"QuickTime audio description not correct.";
const LPCOLESTR c_pszErrorQtAudioCodec	= L"QuickTime audio codec not installed.";
const LPCOLESTR c_pszErrorQtVideoCodec	= L"QuickTime video codec is not installed.";
const LPCOLESTR c_pszErrorQtDrm			= L"QuickTime File is protected.";

const LPCOLESTR c_pszErrorAviContainer	= L"AVI container not correct.";
const LPCOLESTR c_pszErrorAcmAudioCodec	= L"ACM audio codec is not installed.";
const LPCOLESTR c_pszErrorAcmVideoCodec	= L"ACM video codec is not installed.";

const LPCOLESTR c_pszErrorRmContainer	= L"RM container not correct.";
const LPCOLESTR c_pszErrorRmDecoder	= L"RM decoder is not installed.";
const LPCOLESTR c_pszErrorRmEncoder	= L"RM encoder is not installed.";

const LPCOLESTR c_pszErrorDVDContentProtect = L"DVD content protected data.";
const LPCOLESTR c_pszErrorDVDRegionMismatch = L"DVD region mismatch";
const LPCOLESTR c_pszErrorBluRayContentProtect = L"BluRay content protected data.";
const LPCOLESTR c_pszErrorBluRayRegionMismatch = L"BluRay region mismatch";

const LPOLESTR c_pszErrorFileFormatIdentical = L"File Format Not Indetical";
const LPOLESTR c_pszErrorFileOpenCancel = L"File Open is cancelled";

const LPOLESTR c_pszErrorFrameConverting = L"Frame Not Converting";

const LPOLESTR c_pszErrorRemakerOpenSrcFile = L"Cannot open source file";
const LPOLESTR c_pszErrorRemakerCreateDstFile = L"Cannot create destination file";
const LPOLESTR c_pszErrorRemakerNoEqualVideo = L"Video Format is not equal. Used key frames only";
const LPOLESTR c_pszErrorRemakerConteiner = L"Error file conteiner";

#define NOERROR				0
#define BUSY				1
#define MEMORY				2
#define FILEACCESS			3
#define FILEFORMAT			4
#define VIDEOUNSUPPORTED	5
#define AUDIOUNSUPPORTED	6
#define INVALIDOPERATION	7
#define INVALIDARGUMENT		8
#define CONTROLNOTINSTALLED	9
#define INDEXOUTOFRANGE		10
#define QT_CONTAINER		11
#define QT_VIDEODESC		12
#define QT_AUDIODESC		13
#define QT_AUDIOCODEC		14
#define QT_VIDEOCODEC		15
#define AVI_CONTAINER		16
#define ACM_AUDIOCODEC		17
#define ACM_VIDEOCODEC		18
#define DVD_CONTENTPROTECT	19
#define AUDIOOUTDRIVER		20
#define AUDIOINPDRIVER		21
#define AUDIOMIXERDRIVER	22
#define ASPIDRIVER			23
#define STREAM				24
#define RM_CONTAINER		25
#define RM_DECODER			26
#define RM_ENCODER			27
#define FORMATNOTSUPPORT	28
#define FRAMECONVERTING		29
#define QT_DRM				30
#define DATAUNSUPPORTED		31
#define DVD_REGIONMISMATCH	32
#define BLURAY_REGIONMISMATCH	33
#define BLURAY_CONTENTPROTECT	34
#define UNEXPECTED			40
#define FILEFORMATIDENTICAL	50
#define FILEOPENCANCEL		60

#define		REMAKER_ERROR_OPEN_SRC_FILE					0x73
#define		REMAKER_ERROR_CREATE_DST_FILE				0x74
#define		REMAKER_ERROR_NO_EQUAL_VIDEO				0x75
#define		REMAKER_ERROR_CONTAINER						0x77

#endif // #ifndef _VIDEOFILEERRORDESCRIPTION_H_	// For Borland compiler