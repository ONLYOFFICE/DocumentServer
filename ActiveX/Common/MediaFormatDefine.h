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

#ifndef _MEDIAFORMATDEFINE_H_	
#define _MEDIAFORMATDEFINE_H_


#define MEDIAFORMAT_UNKNOWN				0

#define MEDIAFORMAT_AUDIO				100

#define MEDIAFORMAT_RMAUDIO				150
#define MEDIAFORMAT_WMA					151
#define MEDIAFORMAT_MPEG4AUDIO			152
#define MEDIAFORMAT_MPEG3AUDIO			153
#define MEDIAFORMAT_OGGVORBISAUDIO		154

#define MEDIAFORMAT_VIDEO				200
#define MEDIAFORMAT_VIDEO_UNCOMPRESSED	201
#define MEDIAFORMAT_VIDEO_COMPRESSED	202

#define MEDIAFORMAT_MPEG2				250
#define MEDIAFORMAT_H263				251
#define MEDIAFORMAT_MPEG4				252
#define MEDIAFORMAT_H264				253
#define MEDIAFORMAT_MPEGs				254
#define MEDIAFORMAT_WMV					255
#define MEDIAFORMAT_RMVIDEO				256
#define MEDIAFORMAT_EXTERNAL			257
#define MEDIAFORMAT_H264_EXT			258
#define MEDIAFORMAT_VPX					259


#define MEDIAFORMAT_INTELMEDIA          260

#define MEDIAFORMAT_DVD_SUBPICTURE		300
#define MEDIAFORMAT_DVD_SUBPICTURE_COMPRESSED 301

#define MEDIAFORMAT_TEXT				350


#define MEDIAFORMAT_BLURAY_PAT							500
#define MEDIAFORMAT_BLURAY_PROGRAM_MAP					501
#define MEDIAFORMAT_BLURAY_CONDITIONAL_ACCESS_TABLE		502
#define MEDIAFORMAT_BLURAY_TEXT_SUBTITLE				503
#define MEDIAFORMAT_BLURAY_PG							504
#define MEDIAFORMAT_BLURAY_IG							505
#define MEDIAFORMAT_BLURAY_PCR							506

#define	MPEG4_DEFAULT_QUANT				400
#define	MPEG4_MAX_ZONES					64



#define CSP_PLANAR   (1<< 0) 
#define CSP_USER	  CSP_PLANAR
#define CSP_I420     (1<< 1) 
#define CSP_YV12     (1<< 2) 
#define CSP_YUY2     (1<< 3) 
#define CSP_UYVY     (1<< 4) 
#define CSP_YVYU     (1<< 5) 
#define CSP_BGRA     (1<< 6) 
#define CSP_ABGR     (1<< 7) 
#define CSP_RGBA     (1<< 8) 
#define CSP_ARGB     (1<<15) 
#define CSP_BGR      (1<< 9) 
#define CSP_RGB555   (1<<10) 
#define CSP_RGB565   (1<<11) 
#define CSP_SLICE    (1<<12) 
#define CSP_INTERNAL (1<<13) 
#define CSP_NULL     (1<<14) 
#define CSP_I422		 (1<<16) 
#define CSP_I444		 (1<<17) 
#define CSP_RGB8     (1<<18) 
#define CSP_RGB16     (1<<19) 
#define CSP_VFLIP    (1<<31) 

#define CSP_COLOR_MASK	0x7FFFFFFF


#define IMAGEFORMAT_BMP			1
#define IMAGEFORMAT_GIF			2
#define IMAGEFORMAT_JPE			3
#define IMAGEFORMAT_PNG			4
#define IMAGEFORMAT_TIF			5
#define IMAGEFORMAT_WMF			6
#define IMAGEFORMAT_EMF			7
#define IMAGEFORMAT_PCX			8
#define IMAGEFORMAT_TGA			9
#define IMAGEFORMAT_RAS			10



#define	ENCODINGTYPE_CBR						0
#define	ENCODINGTYPE_VBRBITRATE					1
#define	ENCODINGTYPE_VBRQUALITY					2
#define	ENCODINGTYPE_VBRUNCONSTRAINEDQUALITY	3
#define	ENCODINGTYPE_VBRUNCONSTRAINEDBITRATE	4

#define	ENCODINGCOMPLEXITY_LOW		0
#define	ENCODINGCOMPLEXITY_MEDIUM	1
#define	ENCODINGCOMPLEXITY_HIGH		2

#define VIDEOMODESHARP				0
#define VIDEOMODENORMAL				1
#define VIDEOMODESMOOTH				2
#define VIDEOMODESLIDESHOW			3

#define RMAUDIOMUSIC				0
#define RMAUDIOVOICE				1


#endif 
