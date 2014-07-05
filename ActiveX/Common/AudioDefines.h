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

#include <mmreg.h>
#include "mmsystem.h"
#include <Ks.h>
#include <Ksmedia.h>
#include <stdio.h>
#include <math.h>
#include <atlcoll.h>
#include "ASCmmreg.h"

extern SAFEARRAY* SafeArrayCreateVector(VARTYPE  vt,unsigned int  size);
extern HRESULT SafeArrayGetUBound(SAFEARRAY* sa,long lo,__int64* size);
extern LPCSTR OLE2T_my(BSTR bstrStr);
extern BSTR T2OLE_my(LPSTR ansiStr);
extern void CheckChannelsMask(long& Channels,DWORD& Mask);
extern void SetChannelsMaskPreset(long& Channels,DWORD& Mask);
extern inline CComBSTR GetSampleRateStr(long SampleRate);
extern inline CComBSTR GetSampleSizeStr(long SampleSize);
extern inline CComBSTR GetChannelsStr(long Channels,DWORD ChannelsMask);
extern inline CComBSTR GetBitrateStr(double Bitrate,double BitrateMax=0,double BitrateAvg=0);
extern __int64 abs64(__int64 Value);
extern __int64 xabs64(__int64 Value);

#pragma pack(1)

struct WAVEFORMATEX_LPCM
{
	WAVEFORMATEX format;
	DWORD ChannelsMask1;
	WORD Group2Enabled;
	DWORD OffsetGroup;	
	DWORD ChannelsMask2;	
	WORD Reserved[2];
};

struct OGGWAVEFORMAT
{
	WAVEFORMATEX wfx;
	DWORD dwVorbisACMVersion;		
	DWORD dwLibVorbisVersion;		
	DWORD dwChannelsMask;
	
};

struct WAVEFORMATEX_AC3
{
	WAVEFORMATEX wfx;
	DWORD        dwChannelMask; 
};

struct WAVEFORMATEX_AAC
{
	WAVEFORMATEX wfx;
	DWORD	dwChannelMask; 
	WORD	wVersion;
	WORD	wProfile;
	BYTE	arnExtraData[];
};
struct WAVEFORMAT_FLAC
{
	WAVEFORMATEX wfx;
	DWORD dwChannelsMask;
};

struct WAVEFORMATEX_APPLE_LOSSLESS
{
	WAVEFORMATEX wfx;
	DWORD dwChannelsMask;
	BYTE	arnExtraData[];
};

struct WAVEFORMAT_BPCM
{
	WAVEFORMATEX wfx;
	DWORD dwChannelsMask;
};

#pragma pack() 

typedef G723_ADPCMWAVEFORMAT G726_ADPCMWAVEFORMAT;

struct _ExtraInfo
{
	CComBSTR Copyright;
	CComBSTR Title;
	CComBSTR Artist;
	CComBSTR Album;
	CComBSTR Comments;
	CComBSTR Composer;
	CComBSTR URL;
	CComBSTR EncodedBy;
	CComBSTR Genre;
	CComBSTR OriginalArtist;
	long Year;
	long Track;

	struct _Additional
	{
		CComBSTR Name;
		CComBSTR Value;

		_Additional()
		{
			Name = "";
			Value = "";
		}
	};

	struct _Marker
	{
		double Position;
		double Length;
		
		CComBSTR Note;
		CComBSTR Label;

		_Marker()
		{
			Position = 0;
			Length = 0;
			Note = "";
			Label = "";
		}
	};

	CAtlArray<_Additional> Additional;
	CAtlArray<_Marker> Marker;

	IPictureDisp* Picture;

	_ExtraInfo()
	{
		Copyright = "";
		Title = "";
		Artist = "";
		Album = "";
		Comments = "";
		Composer = "";
		URL = "";
		EncodedBy = "";
		Genre = "";
		OriginalArtist = "";
		Year = 0;
		Track = 0;
	
		Picture=NULL;
	}

	void Clear()
	{
		Copyright="";
		Title="";
		Artist="";
		Album="";
		Comments="";
		Composer="";
		URL="";
		EncodedBy="";
		Genre="";
		OriginalArtist="";
		Year=0;
		Track=0;
		
		if (Picture)
		{
			Picture->Release();
		}
		Picture=NULL;
		Additional.RemoveAll();
		Marker.RemoveAll();
	}
};



#define	RANGE_NONE		     0
#define	RANGE_48_DB		     1
#define	RANGE_96_DB		     2
#define	RANGE_144_DB	     3
#define	RANGE_192_DB	     4

#define	NORMALPLAY	     1
#define	PLAYTOEND	     2
#define	PLAYLOOPED	     3

#define	READ			1
#define	READWRITE	    2

#define	ACM_DRIVER_OUT	1
#define	X_AUDIO			2
#define	MAD	    		3

#define	ACM_DRIVER_IN	 1
#define	LAME		     2

#define	MONO		     1
#define	STEREO		     2
#define	CHANNELS_2_1     3
#define	CHANNELS_3_0     4
#define	CHANNELS_3_1     5
#define	CHANNELS_2_2     6
#define	CHANNELS_3_2     7
#define	CHANNELS_4_1     8
#define	CHANNELS_5_1     9
#define	CHANNELS_4_2     10
#define	CHANNELS_5_2     11
#define	CHANNELS_7_1     12

#define	BPS_2_BIT	     2
#define	BPS_3_BIT	     3
#define	BPS_4_BIT	     4
#define	BPS_5_BIT	     5
#define	BPS_8_BIT	     8
#define	BPS_16_BIT	     16
#define	BPS_24_BIT	     24
#define	BPS_32_BIT	     32

#define	VBR_NONE		     -1
#define	VBR_DEFAULT		      0
#define	VBR_OLD			      1
#define	VBR_NEW			      2
#define	VBR_MTRH		      3
#define	VBR_ABR			      4

#define	SIMPLY				1
#define	JOINTSTEREO			2
#define	FORCEDJOINTSTEREO   3
#define	DUALCHANNEL			4

#define F_ALL					1
#define F_MP3					2
#define F_MP2					3
#define F_OGG				    4
#define F_VOX					5
#define F_G721					6
#define F_G723					7
#define F_G726				    8
#define F_G723_1				9
#define F_G729					10		
#define F_SPEEX					11
#define F_MPC					12
#define F_AC3					14
#define F_MSADPCM				15
#define F_IMAADPCM				16
#define F_ALAW					17
#define F_ULAW					18
#define F_GSM					19
#define F_PCM				     20
#define F_DTS				     21
#define F_AAC				     22
#define F_AMR				     23
#define F_QCELP				     25
#define F_QUICKTIME				 30
#define F_FLAC					 36
#define F_WMA					 40
#define F_LPCM					 43
#define	F_APPLELOSSLESS			44
#define F_QDM2					45
#define F_MLP					 46
#define F_BPCM					 47
#define	F_TRUEHD				48
#define F_TRANSF				999
#define F_LastSet				1000

#define	rawALAW			1
#define	rawULAW			2
#define	rawGSM			3
#define	rawMS_ADPCM     4
#define	rawIMA_ADPCM_MS 5
#define	rawIMA_ADPCM_QT 6

#define	aifcALAW		1
#define	aifcULAW		2
#define	aifcGSM			3
#define	aifcIMA_ADPCM   4
#define	aifcG721		5
#define	aifcG723		6
#define	aifcVOX			7

#define	CURRENT_POS	     1
#define	END_POS			 2
#define	BEGIN_POS	     3

#define LOWPASSFILTER	1
#define HIGHPASSFILTER	2
#define NOTCHFILTER		3
#define BANDPASSFILTER	4
#define LOWSHELFFILTER	5
#define HIGHSHELFFILTER	6

#define DELAY			1
#define PHASER			2
#define FLANGER			3
#define CHORUS			4
#define COMPRESSOR		5
#define EXPANDER		6

#define FASTRESAMPLING		1
#define QUALITYRESAMPLING	2

#define TRIM_LEFT  0
#define TRIM_RIGHT 1
#define TRIM_BOTH  2

#define WAVEFORM 0
#define SPECTRAL 1
#define ENVELOPE 2

#define RECORD_CLEAR	1
#define RECORD_MIX		2

static const long g_carlModeAMR[] = 
{
	4750, 5150, 5900, 6700, 7400, 7950, 10200, 12200, 0
};

static const long g_carlModeAWB[] = 
{
	6600, 8850, 12650, 14250, 15850, 18250, 19850, 23050, 23850
};

#define VORBISACM_VERSION			0x20020201
#define LIBVORBIS_VERSION			0x20020717	
