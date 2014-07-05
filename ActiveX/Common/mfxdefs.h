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
 
#ifndef __MFXDEFS_H__
#define __MFXDEFS_H__

#ifdef __cplusplus
extern "C"
{
#endif 

typedef unsigned char       mfxU8;
typedef char                mfxI8;
typedef short               mfxI16;
typedef unsigned short      mfxU16;
typedef unsigned int        mfxU32;
typedef int                 mfxI32;
typedef unsigned long       mfxUL32;
typedef long                mfxL32;
typedef float               mfxF32;
typedef double              mfxF64;
typedef unsigned __int64    mfxU64;         
typedef __int64             mfxI64;
typedef void*               mfxHDL;
typedef mfxHDL              mfxMemId;

typedef struct {
    mfxI16  x;
    mfxI16  y;
} mfxI16Pair;


typedef enum
{
    
    MFX_ERR_NONE                        = 0,    

    
    MFX_ERR_UNKNOWN                     = -1,   

    
    MFX_ERR_NULL_PTR                    = -2,   
    MFX_ERR_UNSUPPORTED                 = -3,   
    MFX_ERR_MEMORY_ALLOC                = -4,   
    MFX_ERR_NOT_ENOUGH_BUFFER           = -5,   
    MFX_ERR_INVALID_HANDLE              = -6,   
    MFX_ERR_LOCK_MEMORY                 = -7,   
    MFX_ERR_NOT_INITIALIZED             = -8,   
    MFX_ERR_NOT_FOUND                   = -9,   
    MFX_ERR_MORE_DATA                   = -10,  
    MFX_ERR_MORE_SURFACE                = -11,  
    MFX_ERR_ABORTED                     = -12,  
    MFX_ERR_DEVICE_LOST                 = -13,  
    MFX_ERR_INCOMPATIBLE_VIDEO_PARAM    = -14,  
    MFX_ERR_INVALID_VIDEO_PARAM         = -15,  
    MFX_ERR_UNDEFINED_BEHAVIOR          = -16,  
    MFX_ERR_DEVICE_FAILED               = -17,  

    
    MFX_WRN_IN_EXECUTION                = 1,    
    MFX_WRN_DEVICE_BUSY                 = 2,    
    MFX_WRN_VIDEO_PARAM_CHANGED         = 3,    
    MFX_WRN_PARTIAL_ACCELERATION        = 4,    
    MFX_WRN_INCOMPATIBLE_VIDEO_PARAM    = 5,    
    MFX_WRN_VALUE_NOT_CHANGED           = 6     

} mfxStatus;

#ifdef __cplusplus
}
#endif 

#endif 
