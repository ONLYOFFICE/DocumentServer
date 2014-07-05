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

#ifndef _INTERNALCODECTYPES_H_	
#define _INTERNALCODECTYPES_H_



#define NONE_INTERNALCODEC				0

#define XVID_INTERNALCODEC				1
#define H263_INTERNALCODEC				4
	#define H263_INTERNALENCODER		4	
	#define H263_INTERNALDECODER		5	
#define H264_INTERNALCODEC				8
#define MPEG2_INTERNALCODEC				21




#define UNCOMPRESSEDVIDEO_INTERNALCODEC 24
#define VP8_INTERNALCODEC				25
#define QT_INTERNALCODEC				26


#define INTELMEDIA_H264_INTERNALCODEC	27
#define INTELMEDIA_MPEG2_INTERNALCODEC	28
#define INTELMEDIA_VC1_INTERNALCODEC	29


#define FF_H263_INTERNALCODEC			256
#define FF_H263P_INTERNALCODEC			269
#define FF_FLV_INTERNALCODEC			270

#define FF_H264_INTERNALCODEC			257
#define FF_SVQ1_INTERNALCODEC			258
#define FF_SVQ3_INTERNALCODEC			259
#define FF_DV_INTERNALCODEC				260

#define FF_MJPEG_INTERNALCODEC			261
#define FF_MJPEGB_INTERNALCODEC			272
#define FF_SP5X_INTERNALCODEC			273
#define FF_LJPEG_INTERNALCODEC			274

#define FF_MSMPEG4_INTERNALCODEC		262
#define FF_MSMPEG4V1_INTERNALCODEC		263
#define FF_MSMPEG4V2_INTERNALCODEC		264
#define FF_MSMPEG4V3_INTERNALCODEC		265
#define FF_CINEPAK_INTERNALCODEC		266
#define FF_INDEO2_INTERNALCODEC			267
#define FF_INDEO3_INTERNALCODEC			268

#define FF_HUFFMAN_INTERNALCODEC		275
#define FF_8BPS_INTERNALCODEC			276
#define FF_VC1_INTERNALCODEC			277

#define FF_RLE_INTERNALCODEC			278
#define FF_SMC_INTERNALCODEC			279
#define FF_RPZA_INTERNALCODEC			280
#define FF_QDRW_INTERNALCODEC			281
#define FF_CYUV_INTERNALCODEC			282

#define FF_H261_INTERNALCODEC			283
#define FF_ASUSV1_INTERNALCODEC			284
#define FF_ASUSV2_INTERNALCODEC			285
#define FF_QPEG_INTERNALCODEC			286
#define FF_MSRLE_INTERNALCODEC			287

#define FF_ON2VP3_INTERNALCODEC			298
#define FF_ON2VP5_INTERNALCODEC			299
#define FF_ON2VP6F_INTERNALCODEC		300
#define FF_ON2VP6_INTERNALCODEC			301

#define FF_MPEG2_INTERNALCODEC			302

#define FF_WMV7_INTERNALCODEC			303
#define FF_WMV8_INTERNALCODEC			304 
#define FF_WMV9_INTERNALCODEC			305
#define FF_THEORA_INTERNALCODEC			306
#define FF_FLIC_INTERNALCODEC			307
#define FF_AMV_INTERNALCODEC			308
#define FF_RV10_INTERNALCODEC			309
#define FF_RV20_INTERNALCODEC			310
#define FF_RV30_INTERNALCODEC			311
#define FF_RV40_INTERNALCODEC			312
#define FF_FLASHSV_INTERNALCODEC		313
#define FF_SWSCALE_INTERNALCODEC		314
#define FF_FRAPS_INTERNALCODEC			315
#define FF_TSCC_INTERNALCODEC			316
#define FF_DNXHD_INTERNALCODEC			317
#define FF_HUFFMPEG_INTERNALCODEC		318
#define FF_VP8_INTERNALCODEC			319
#define FF_JPEG2000_INTERNALCODEC		320
#define FF_V210_INTERNALCODEC			321

#define LAST_FFMPEGCODEC				321


#define RV7_INTERNALCODEC				512
#define RV8_INTERNALCODEC				513
#define RV9_INTERNALCODEC				514
#define RV10_INTERNALCODEC				515


#endif // #ifndef _INTERNALCODECTYPES_H_	// For Borland compiler