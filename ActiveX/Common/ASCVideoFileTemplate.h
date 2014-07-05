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


[object, uuid("E3C3ABBC-B5B3-4054-8715-AC8F2A60D4F0"), dual, pointer_default(unique)]
__interface IAVSVideoFileTemplate : IDispatch
{
	[id(300000 + 1), propget] HRESULT Status([out, retval] LONG* pVal);

	[id(300000 + 2)] HRESULT OpenFile([in] BSTR fileName);
	[id(300000 + 3)] HRESULT CreateVideoFile([in] BSTR fileName);
	[id(300000 + 4)] HRESULT CloseFile(void);

	[id(300000 + 5)] HRESULT SetAdditionalParam([in] BSTR ParamName, [in] VARIANT ParamValue);
	[id(300000 + 6)] HRESULT GetAdditionalParam([in] BSTR ParamName, [out, retval] VARIANT* ParamValue);

	
	[id(300000 + 7)] HRESULT ReadVideo([out,retval] IUnknown** pVideo);
	[id(300000 + 8)] HRESULT ReadAudio([in] DOUBLE Duration, [out,retval] IUnknown** pAudio);
	[id(300000 + 9)] HRESULT ReadAudioSamples([in] LONG nSamples, [out,retval] IUnknown** pAudio);
	[id(300000 + 10)] HRESULT ReadData([out,retval] IUnknown** pData);

	
	[id(300000 + 11)] HRESULT WriteVideo([in] IUnknown* pVideo);
	[id(300000 + 12)] HRESULT WriteAudio([in] IUnknown* pAudio);
	[id(300000 + 13)] HRESULT WriteData([in] IUnknown* pData);

	[id(300000 + 14), propget] HRESULT SeekEnabled([out, retval] VARIANT_BOOL* pVal);
	[id(300000 + 15), propget] HRESULT SeekMode([out, retval] LONG* pVal);
	[id(300000 + 15), propput] HRESULT SeekMode([in] LONG newVal);
	[id(300000 + 16)] HRESULT Seek([in] DOUBLE nVal);

	[id(300000 + 17)] HRESULT SkipVideo([in] DOUBLE nVal);
	[id(300000 + 18)] HRESULT SkipAudio([in] DOUBLE nVal);
	[id(300000 + 19)] HRESULT SkipData([in] DOUBLE nVal);

	[id(300000 + 20), propget] HRESULT CompressedVideo([out, retval] VARIANT_BOOL* pVal);
	[id(300000 + 20), propput] HRESULT CompressedVideo([in] VARIANT_BOOL newVal);
	[id(300000 + 21), propget] HRESULT CompressedAudio([out, retval] VARIANT_BOOL* pVal);
	[id(300000 + 21), propput] HRESULT CompressedAudio([in] VARIANT_BOOL newVal);
	[id(300000 + 22), propget] HRESULT CompressedData([out, retval] VARIANT_BOOL* pVal);
	[id(300000 + 22), propput] HRESULT CompressedData([in] VARIANT_BOOL newVal);
		   
	
	[id(300000 + 23), propget] HRESULT videoFormat([out, retval] IUnknown** pVal);
	[id(300000 + 23), propput] HRESULT videoFormat([in] IUnknown* newVal);
	[id(300000 + 24), propget] HRESULT audioFormat([out, retval] IUnknown** pVal);
	[id(300000 + 24), propput] HRESULT audioFormat([in] IUnknown* newVal);
	[id(300000 + 25), propget] HRESULT dataFormat([out, retval] IUnknown** pVal);
	[id(300000 + 25), propput] HRESULT dataFormat([in] IUnknown* newVal);
		   
	[id(300000 + 26), propget] HRESULT videoCurrentTime([out, retval] DOUBLE* pVal);
	[id(300000 + 27), propget] HRESULT audioCurrentTime([out, retval] DOUBLE* pVal);
	[id(300000 + 28), propget] HRESULT dataCurrentTime([out, retval] DOUBLE* pVal);
		   
	[id(300000 + 29), propget] HRESULT videoDuration([out, retval] DOUBLE* pVal);
	[id(300000 + 30), propget] HRESULT audioDuration([out, retval] DOUBLE* pVal);
	[id(300000 + 31), propget] HRESULT dataDuration([out, retval] DOUBLE* pVal);
		   
	[id(300000 + 32), propget] HRESULT videoTracksCount([out, retval] LONG* pVal);
	[id(300000 + 32), propput] HRESULT videoTracksCount([in] LONG newVal);
	[id(300000 + 33), propget] HRESULT audioTracksCount([out, retval] LONG* pVal);
	[id(300000 + 33), propput] HRESULT audioTracksCount([in] LONG newVal);
	[id(300000 + 34), propget] HRESULT dataTracksCount([out, retval] LONG* pVal);
	[id(300000 + 34), propput] HRESULT dataTracksCount([in] LONG newVal);
		   
	[id(300000 + 35), propget] HRESULT videoTrackNumber([out, retval] LONG* pVal);
	[id(300000 + 35), propput] HRESULT videoTrackNumber([in] LONG newVal);
	[id(300000 + 36), propget] HRESULT audioTrackNumber([out, retval] LONG* pVal);
	[id(300000 + 36), propput] HRESULT audioTrackNumber([in] LONG newVal);
	[id(300000 + 37), propget] HRESULT dataTrackNumber([out, retval] LONG* pVal);
	[id(300000 + 37), propput] HRESULT dataTrackNumber([in] LONG newVal);

	[id(300000 + 38), propget] HRESULT availableVideoFormatsCount([out, retval] LONG* pVal);
	
	[id(300000 + 39), propget] HRESULT availableVideoFormat([in] LONG Index, [out, retval] IUnknown** pVal);
		   
	[id(300000 + 40), propget] HRESULT availableAudioFormatsCount([out, retval] LONG* pVal);
	
	[id(300000 + 41), propget] HRESULT availableAudioFormat([in] LONG Index, [out, retval] IUnknown** pVal);
		   
	[id(300000 + 42), propget] HRESULT availableDataFormatsCount([out, retval] LONG* pVal);
	
	[id(300000 + 43), propget] HRESULT availableDataFormat([in] LONG Index, [out, retval] IUnknown** pVal);

	
	[id(300000 + 44), propget] HRESULT VideoFrameTrasformFilter([out, retval] IUnknown** pVal);

	
	[id(300000 + 50), propget] HRESULT ExtraData([out, retval] IUnknown** pVal);
	[id(300000 + 50), propput] HRESULT ExtraData([in] IUnknown* newVal);

	[id(300000 + 51), propget] HRESULT ExtraDataEnabled([out, retval] VARIANT_BOOL* pVal);
	[id(300000 + 51), propput] HRESULT ExtraDataEnabled([in] VARIANT_BOOL  newVal);
};