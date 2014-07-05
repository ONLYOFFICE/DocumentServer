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
 
#ifndef __MFXSTRUCTURES_H__
#define __MFXSTRUCTURES_H__
#include "mfxdefs.h"

#pragma warning(disable: 4201)

#ifdef __cplusplus
extern "C" {
#endif

#define MFX_MAKEFOURCC(A,B,C,D)    ((((int)A))+(((int)B)<<8)+(((int)C)<<16)+(((int)D)<<24))


typedef struct {
    mfxU32  BufferId;
    mfxU32  BufferSz;
} mfxExtBuffer;


typedef struct {
    mfxU32  reserved[8];

    mfxU32  FourCC;
    mfxU16  Width;
    mfxU16  Height;

    mfxU16  CropX;
    mfxU16  CropY;
    mfxU16  CropW;
    mfxU16  CropH;

    mfxU32  FrameRateExtN;
    mfxU32  FrameRateExtD;
    mfxU16  reserved3;

    mfxU16  AspectRatioW;
    mfxU16  AspectRatioH;

    mfxU16  PicStruct;
    mfxU16  ChromaFormat;
    mfxU16  reserved2;
} mfxFrameInfo;


enum {
    MFX_FOURCC_NV12         =MFX_MAKEFOURCC('N','V','1','2'),   
    MFX_FOURCC_YV12         =MFX_MAKEFOURCC('Y','V','1','2'),
    MFX_FOURCC_YUY2         =MFX_MAKEFOURCC('Y','U','Y','2'),
    MFX_FOURCC_RGB3         =MFX_MAKEFOURCC('R','G','B','3'),   
    MFX_FOURCC_RGB4         =MFX_MAKEFOURCC('R','G','B','4')    
};


enum {
    MFX_PICSTRUCT_UNKNOWN       =0x00,
    MFX_PICSTRUCT_PROGRESSIVE   =0x01,
    MFX_PICSTRUCT_FIELD_TFF     =0x02,
    MFX_PICSTRUCT_FIELD_BFF     =0x04,

    MFX_PICSTRUCT_FIELD_REPEATED=0x10,  
    MFX_PICSTRUCT_FRAME_DOUBLING=0x20,  
    MFX_PICSTRUCT_FRAME_TRIPLING=0x40   
};


enum {
    MFX_CHROMAFORMAT_MONOCHROME =0,
    MFX_CHROMAFORMAT_YUV420     =1,
    MFX_CHROMAFORMAT_YUV422     =2,
    MFX_CHROMAFORMAT_YUV444     =3
};


typedef struct {
    mfxU32      reserved[8];

    mfxU64      TimeStamp;
    mfxU32      FrameOrder;
    mfxU16      Locked;
    mfxU16      Pitch;

    
    union {
        mfxU8   *Y;
        mfxU8   *R;
    };
    union {
        mfxU8   *UV;            
        mfxU8   *VU;            
        mfxU8   *CbCr;          
        mfxU8   *CrCb;          
        mfxU8   *Cb;
        mfxU8   *U;
        mfxU8   *G;
    };
    union {
        mfxU8   *Cr;
        mfxU8   *V;
        mfxU8   *B;
    };
    mfxU8       *A;
    mfxMemId    MemId;

    
    mfxU16      Corrupted;
    mfxU16      reserved2;
} mfxFrameData;


typedef struct {
    mfxU32  reserved[4];
    mfxFrameInfo    Info;
    mfxFrameData    Data;
} mfxFrameSurface1;


typedef struct {
    mfxU32  reserved[8];

    mfxFrameInfo    FrameInfo;
    mfxU32  CodecId;
    mfxU16  CodecProfile;
    mfxU16  CodecLevel;
    mfxU16  NumThread;

    union {
        
        struct {
            mfxU16  TargetUsage;

            mfxU16  GopPicSize;
            mfxU16  GopRefDist;
            mfxU16  GopOptFlag;
            mfxU16  IdrInterval;

            mfxU16  RateControlMethod;
            mfxU16  InitialDelayInKB;
            mfxU16  BufferSizeInKB;
            mfxU16  TargetKbps;
            mfxU16  MaxKbps;

            mfxU16  NumSlice;
            mfxU16  NumRefFrame;
            mfxU16  EncodedOrder;
        };
        struct {    
            mfxU16  DecodedOrder;
            mfxU16  reserved2[12];
        };
    };
} mfxInfoMFX;

typedef struct {
    mfxU32  reserved[8];
    mfxFrameInfo    In;
    mfxFrameInfo    Out;
} mfxInfoVPP;

typedef struct {
    mfxU32  reserved[4];
    union {
        mfxInfoMFX  mfx;
        mfxInfoVPP  vpp;
    };
    mfxU16  Protected;
    mfxU16  IOPattern;
    mfxExtBuffer** ExtParam;
    mfxU16  NumExtParam;
    mfxU16  reserved2;
} mfxVideoParam;


enum {
    MFX_IOPATTERN_IN_VIDEO_MEMORY   = 0x01,
    MFX_IOPATTERN_IN_SYSTEM_MEMORY  = 0x02,
    MFX_IOPATTERN_OUT_VIDEO_MEMORY  = 0x10,
    MFX_IOPATTERN_OUT_SYSTEM_MEMORY = 0x20
};


enum {
    MFX_CODEC_AVC          =MFX_MAKEFOURCC('A','V','C',' '),
    MFX_CODEC_MPEG2       =MFX_MAKEFOURCC('M','P','G','2'),
    MFX_CODEC_VC1         =MFX_MAKEFOURCC('V','C','1',' ')
};


enum {
    MFX_PROFILE_UNKNOWN         =0,
    MFX_LEVEL_UNKNOWN           =0,

    
    MFX_PROFILE_AVC_BASELINE    =66,
    MFX_PROFILE_AVC_MAIN        =77,
    MFX_PROFILE_AVC_HIGH        =100,

    MFX_LEVEL_AVC_1             =10,
    MFX_LEVEL_AVC_1b            =9,
    MFX_LEVEL_AVC_11            =11,
    MFX_LEVEL_AVC_12            =12,
    MFX_LEVEL_AVC_13            =13,
    MFX_LEVEL_AVC_2             =20,
    MFX_LEVEL_AVC_21            =21,
    MFX_LEVEL_AVC_22            =22,
    MFX_LEVEL_AVC_3             =30,
    MFX_LEVEL_AVC_31            =31,
    MFX_LEVEL_AVC_32            =32,
    MFX_LEVEL_AVC_4             =40,
    MFX_LEVEL_AVC_41            =41,
    MFX_LEVEL_AVC_42            =42,
    MFX_LEVEL_AVC_5             =50,
    MFX_LEVEL_AVC_51            =51,

    
    MFX_PROFILE_MPEG2_SIMPLE    =0x50,
    MFX_PROFILE_MPEG2_MAIN      =0x40,
    MFX_PROFILE_MPEG2_HIGH      =0x10,

    MFX_LEVEL_MPEG2_LOW         =0xA,
    MFX_LEVEL_MPEG2_MAIN        =0x8,
    MFX_LEVEL_MPEG2_HIGH        =0x4,
    MFX_LEVEL_MPEG2_HIGH1440    =0x6,

    
    MFX_PROFILE_VC1_SIMPLE      =(0+1),
    MFX_PROFILE_VC1_MAIN        =(4+1),
    MFX_PROFILE_VC1_ADVANCED    =(12+1),

    
    MFX_LEVEL_VC1_LOW           =(0+1),
    MFX_LEVEL_VC1_MEDIAN        =(2+1),
    MFX_LEVEL_VC1_HIGH          =(4+1),

    
    MFX_LEVEL_VC1_0             =(0x00+1),
    MFX_LEVEL_VC1_1             =(0x01+1),
    MFX_LEVEL_VC1_2             =(0x02+1),
    MFX_LEVEL_VC1_3             =(0x03+1),
    MFX_LEVEL_VC1_4             =(0x04+1)
};


enum {
    MFX_GOP_CLOSED          =1,
    MFX_GOP_STRICT          =2
};


enum {
    MFX_TARGETUSAGE_UNKNOWN         =0,
    MFX_TARGETUSAGE_BEST_QUALITY    =1,
    MFX_TARGETUSAGE_BALANCED        =4,
    MFX_TARGETUSAGE_BEST_SPEED      =7
};


enum {
    MFX_RATECONTROL_CBR     =1,
    MFX_RATECONTROL_VBR     =2
};

typedef struct {
    mfxExtBuffer Header;

    mfxU16      reserved1;
    mfxU16      RateDistortionOpt;
    mfxU16      MECostType;
    mfxU16      MESearchType;
    mfxI16Pair  MVSearchWindow;
    mfxU16      EndOfSequence;
    mfxU16      FramePicture;

    union {
        struct {    
            mfxU16      CAVLC;
            mfxU16      reserved2[7];
            mfxU16      RefPicListReordering;
            mfxU16      ResetRefList;
            mfxU16      reserved3[2];

            mfxU16      IntraPredBlockSize;
            mfxU16      InterPredBlockSize;
            mfxU16      MVPrecision;
            mfxU16      MaxDecFrameBuffering;

            mfxU16      AUDelimiter;
            mfxU16      EndOfStream;
            mfxU16      PicTimingSEI;
            mfxU16      VuiNalHrdParameters;
        };
    };
} mfxExtCodingOption;


enum {
    MFX_BLOCKSIZE_UNKNOWN   = 0,
    MFX_BLOCKSIZE_MIN_16X16 = 1, 
    MFX_BLOCKSIZE_MIN_8X8   = 2, 
    MFX_BLOCKSIZE_MIN_4X4   = 3  
};


enum {
    MFX_MVPRECISION_UNKNOWN    = 0,
    MFX_MVPRECISION_INTEGER    = (1 << 0),
    MFX_MVPRECISION_HALFPEL    = (1 << 1),
    MFX_MVPRECISION_QUARTERPEL = (1 << 2)
};


enum {
    MFX_COSTTYPE_UNKNOWN       = 0,
    MFX_COSTTYPE_SAD           = (1 << 0), 
    MFX_COSTTYPE_SSD           = (1 << 1), 
    MFX_COSTTYPE_SATD_HADAMARD = (1 << 2)  
};

enum {
    MFX_SEARCHTYPE_UNKNOWN  = 0,
    MFX_SEARCHTYPE_FULL     = (1 << 0),
    MFX_SEARCHTYPE_UMH      = (1 << 1),
    MFX_SEARCHTYPE_LOG      = (1 << 2),
    MFX_SEARCHTYPE_SQUARE   = (1 << 4),
    MFX_SEARCHTYPE_DIAMOND  = (1 << 5)
};

enum {
    MFX_CODINGOPTION_UNKNOWN    =0,
    MFX_CODINGOPTION_ON         =0x10,
    MFX_CODINGOPTION_OFF        =0x20
};


typedef struct {
    mfxU32      reserved[8];

    mfxU64      TimeStamp;
    mfxU8*      Data;
    mfxU32      DataOffset;
    mfxU32      DataLength;
    mfxU32      MaxLength;

    mfxU16      PicStruct;
    mfxU16      FrameType;
    mfxU16      DataFlag;
    mfxU16      reserved2;
} mfxBitstream;


enum {
    MFX_BITSTREAM_COMPLETE_FRAME    = 0x0001        
};


enum {
    MFX_EXTBUFF_CODING_OPTION       =   MFX_MAKEFOURCC('C','D','O','P'),
    MFX_EXTBUFF_CODING_OPTION_SPSPPS=   MFX_MAKEFOURCC('C','O','S','P'),
    MFX_EXTBUFF_VPP_DONOTUSE        =   MFX_MAKEFOURCC('N','U','S','E'),
    MFX_EXTBUFF_VPP_AUXDATA         =   MFX_MAKEFOURCC('A','U','X','D'),
    MFX_EXTBUFF_VPP_DENOISE         =   MFX_MAKEFOURCC('D','N','I','S'),
    MFX_EXTBUFF_VPP_SCENE_ANALYSIS  =   MFX_MAKEFOURCC('S','C','L','Y')
};


typedef struct {
    mfxExtBuffer    Header;
    mfxU32          NumAlg;
    mfxU32*         AlgList;
} mfxExtVPPDoNotUse;


typedef struct {
    mfxU32  reserved[16];
    mfxU32  NumFrame;
    mfxU64  NumBit;
    mfxU32  NumCachedFrame;
} mfxEncodeStat;

typedef struct {
    mfxU32  reserved[16];
    mfxU32  NumFrame;
    mfxU32  NumSkippedFrame;
    mfxU32  NumError;
    mfxU32  NumCachedFrame;
} mfxDecodeStat;

typedef struct {
    mfxU32  reserved[16];
    mfxU32  NumFrame;
    mfxU32  NumCachedFrame;
} mfxVPPStat;

typedef struct {
    mfxExtBuffer    Header;
    mfxU32          SpatialComplexity;
    mfxU32          TemporalComplexity;
    mfxU16          SceneChangeRate;
    mfxU16          RepeatedFrame;
} mfxExtVppAuxData;

typedef struct {
    mfxU32      reserved[4];
    mfxU8       *Data;      
    mfxU32      NumBit;     
    mfxU16      Type;       
    mfxU16      BufSize;    
} mfxPayload;

typedef struct {
    mfxU32  reserved[8];

    mfxU16  FrameType;
    mfxU16  NumExtParam;
    mfxU16  NumPayload;     
    mfxU16  reserved2;

    mfxExtBuffer    **ExtParam;
    mfxPayload      **Payload;      
} mfxEncodeCtrl;


enum {
    
    MFX_MEMTYPE_PERSISTENT_MEMORY   =0x0002
};


enum {
    MFX_MEMTYPE_DXVA2_DECODER_TARGET       =0x0010,
    MFX_MEMTYPE_DXVA2_PROCESSOR_TARGET     =0x0020,
    MFX_MEMTYPE_SYSTEM_MEMORY              =0x0040,

    MFX_MEMTYPE_FROM_ENCODE     = 0x0100,
    MFX_MEMTYPE_FROM_DECODE     = 0x0200,
    MFX_MEMTYPE_FROM_VPPIN      = 0x0400,
    MFX_MEMTYPE_FROM_VPPOUT     = 0x0800,

    MFX_MEMTYPE_INTERNAL_FRAME  = 0x0001,
    MFX_MEMTYPE_EXTERNAL_FRAME  = 0x0002
};

typedef struct {
    mfxU32  reserved[4];
    mfxFrameInfo    Info;
    mfxU16  Type;   
    mfxU16  NumFrameMin;
    mfxU16  NumFrameSuggested;
    mfxU16  reserved2;
} mfxFrameAllocRequest;

typedef struct {
    mfxU32      reserved[4];
    mfxMemId    *mids;      
    mfxU16      NumFrameActual;
    mfxU16      reserved2;
} mfxFrameAllocResponse;


enum {
    MFX_FRAMETYPE_I             =0x1,
    MFX_FRAMETYPE_P             =0x2,
    MFX_FRAMETYPE_B             =0x4,
    MFX_FRAMETYPE_S             =0x8,

    MFX_FRAMETYPE_REF           =0x40,
    MFX_FRAMETYPE_IDR           =0x80
};

typedef enum {
    MFX_HANDLE_DIRECT3D_DEVICE_MANAGER9         =1      
} mfxHandleType;

typedef enum {
    MFX_SKIPMODE_NOSKIP=0,
    MFX_SKIPMODE_MORE=1,
    MFX_SKIPMODE_LESS=2
} mfxSkipMode;


typedef enum {
    MFX_IMPL_AUTO=0,        
    MFX_IMPL_SOFTWARE,      
    MFX_IMPL_HARDWARE,      
    MFX_IMPL_UNSUPPORTED=0  
} mfxIMPL;


typedef union {
    struct {
        mfxU16  Minor;
        mfxU16  Major;
    };
    mfxU32  Version;
} mfxVersion;

typedef struct {
    mfxExtBuffer    Header;
    mfxU8           *SPSBuffer;
    mfxU8           *PPSBuffer;
    mfxU16          SPSBufSize;
    mfxU16          PPSBufSize;
    mfxU16          SPSId;
    mfxU16          PPSId;
} mfxExtCodingOptionSPSPPS;

#ifdef __cplusplus
} 
#endif

#endif

