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
#include "VideoFileErrorDescription.h"
class CAVSATLError
{
public:
	CLSID m_clsid;
	IID m_iid;
	CAVSATLError(CLSID clsid, IID iid)
	{
		m_clsid = clsid; 
		m_iid = iid;
	}
	HRESULT Error(LONG Code)
	{
		LPCOLESTR lpszDesc;
		HRESULT hRes;
		switch(Code)
		{
			case NOERROR:				return S_OK;
			case BUSY:					hRes=AVS_ERROR_BUSY;lpszDesc=c_pszErrorBusy;break;
			case MEMORY:				hRes=AVS_ERROR_MEMORY;lpszDesc=c_pszErrorMemory;break;
			case FILEACCESS:			hRes=AVS_ERROR_FILEACCESS;lpszDesc=c_pszErrorFileAccess;break;
			case FILEFORMAT:			hRes=AVS_ERROR_FILEFORMAT;lpszDesc=c_pszErrorFileFormat;break;
			case VIDEOUNSUPPORTED:		hRes=AVS_ERROR_VIDEOUNSUPPORTED;lpszDesc=c_pszErrorVideoUnsupported;break;
			case AUDIOUNSUPPORTED:		hRes=AVS_ERROR_AUDIOUNSUPPORTED;lpszDesc=c_pszErrorAudioUnsupported;break;
			case INVALIDOPERATION:		hRes=AVS_ERROR_INVALIDOPERATION;lpszDesc=c_pszErrorInvalidOperation;break;
			case INVALIDARGUMENT:		hRes=AVS_ERROR_INVALIDARGUMENT;lpszDesc=c_pszErrorInvalidArgument;break;
			case CONTROLNOTINSTALLED:	hRes=AVS_ERROR_CONTROLNOTINSTALLED;lpszDesc=c_pszErrorControlNotInstalled;break;
			case INDEXOUTOFRANGE:		hRes=AVS_ERROR_INDEXOUTOFRANGE;lpszDesc=c_pszErrorIndexOutOfRange;break;
			case QT_CONTAINER:			hRes=AVS_ERROR_QT_CONTAINER;lpszDesc=c_pszErrorQtContainer;break;
			case QT_VIDEODESC:			hRes=AVS_ERROR_QT_VIDEODESC;lpszDesc=c_pszErrorQtVideoDesc;break;
			case QT_AUDIODESC:			hRes=AVS_ERROR_QT_AUDIODESC;lpszDesc=c_pszErrorQtAudioDesc;break;
			case QT_AUDIOCODEC:			hRes=AVS_ERROR_QT_AUDIOCODEC;lpszDesc=c_pszErrorQtAudioCodec;break;
			case QT_VIDEOCODEC:			hRes=AVS_ERROR_QT_VIDEOCODEC;lpszDesc=c_pszErrorQtVideoCodec;break;
			case AVI_CONTAINER:			hRes=AVS_ERROR_AVI_CONTAINER;lpszDesc=c_pszErrorAviContainer;break;
			case ACM_AUDIOCODEC:		hRes=AVS_ERROR_ACM_AUDIOCODEC;lpszDesc=c_pszErrorAcmAudioCodec;break;
			case ACM_VIDEOCODEC:		hRes=AVS_ERROR_ACM_VIDEOCODEC;lpszDesc=c_pszErrorAcmVideoCodec;break;
			case DVD_CONTENTPROTECT:	hRes=AVS_ERROR_DVD_CONTENTPROTECT;lpszDesc=c_pszErrorDVDContentProtect;break;
			case DVD_REGIONMISMATCH:	hRes=AVS_ERROR_DVD_REGIONMISMATCH;lpszDesc=c_pszErrorDVDRegionMismatch;break;
			
			case BLURAY_CONTENTPROTECT:	hRes=AVS_ERROR_BLURAY_CONTENTPROTECT;lpszDesc=c_pszErrorBluRayContentProtect;break;
			case BLURAY_REGIONMISMATCH:	hRes=AVS_ERROR_BLURAY_REGIONMISMATCH;lpszDesc=c_pszErrorBluRayRegionMismatch;break;

			case AUDIOOUTDRIVER:		hRes=AVS_ERROR_AUDIOOUTDRIVER;lpszDesc=c_pszErrorAudioOutDriver;break;
			case AUDIOINPDRIVER:		hRes=AVS_ERROR_AUDIOINPDRIVER;lpszDesc=c_pszErrorAudioInpDriver;break;
			case AUDIOMIXERDRIVER:		hRes=AVS_ERROR_AUDIOMIXERDRIVER;lpszDesc=c_pszErrorAudioMixerDriver;break;
			case ASPIDRIVER:			hRes=AVS_ERROR_ASPIDRIVER;lpszDesc=c_pszErrorAspiDriver;break;
			case STREAM :				hRes=AVS_ERROR_STREAM;lpszDesc=c_pszErrorStream;break;
			case FILEFORMATIDENTICAL:	hRes=AVS_ERROR_FILEFORMATIDENTICAL;lpszDesc=c_pszErrorFileFormatIdentical;break;
			case FILEOPENCANCEL:		hRes=AVS_ERROR_FILEOPENCANCEL;lpszDesc=c_pszErrorFileOpenCancel;break;

			case REMAKER_ERROR_OPEN_SRC_FILE:	hRes=AVS_REMAKER_ERROR_OPEN_SRC_FILE;lpszDesc=c_pszErrorRemakerOpenSrcFile;break;
			case REMAKER_ERROR_CREATE_DST_FILE:	hRes=AVS_REMAKER_ERROR_CREATE_DST_FILE;lpszDesc=c_pszErrorRemakerCreateDstFile;break;
			case REMAKER_ERROR_NO_EQUAL_VIDEO:	hRes=AVS_ERROR_FILEOPENCANCEL;lpszDesc=c_pszErrorFileOpenCancel;break;
			case REMAKER_ERROR_CONTAINER:		hRes=AVS_ERROR_FILEOPENCANCEL;lpszDesc=c_pszErrorFileOpenCancel;break;

			case UNEXPECTED:			
			default:					hRes=AVS_ERROR_UNEXPECTED;lpszDesc=c_pszErrorUnexpected;break;
		}

		return AtlReportError(m_clsid, lpszDesc, m_iid, hRes);
	}
};

