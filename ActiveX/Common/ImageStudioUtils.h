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

#include <mediaformatdefine.h>
#include <memoryutils.h>
#include <atldefine.h>
#include <gdiplusex.h>
#include "MediaDataDefine.h"

	
namespace ImageStudioUtils
{
	static int CompareStrings(const WCHAR* str1, const WCHAR* str2)
	{
		CString cstr1; cstr1 = str1;
		CString cstr2; cstr2 = str2;

		if (cstr1 == cstr2)
			return 0;

		return 1;
	}
	static DWORD WidthBytes(DWORD bits)
	{
		return (bits + 31) / 32 * 4;
	}
	
	static int GetBit(BYTE value, int pos, BOOL swap = FALSE)
	{
		if (swap)
			pos = 7 - pos;

		int mask = (1 << pos);

		if (value & mask)
			return 1;

		return 0;
	}
	static int GetBitShort(short value, int pos, BOOL swap = FALSE)
	{
		if (swap)
			pos = 15 - pos;

		int mask = (1 << pos);

		if (value & mask)
			return 1;

		return 0;
	}
	static void SetBit(int* value, int pos, BOOL newVal)
	{
		
		int mask = (1 << pos);
		int val = *value;

		
		if (newVal)
			val |= mask;
		else
			val &= ~mask;

		
		*value = val;
	}
	static void SetBit(BYTE* value, int pos, BOOL newVal)
	{
		
		int mask = (1 << pos);
		BYTE val = *value;

		
		if (newVal)
			val |= mask;
		else
			val &= ~mask;

		
		*value = val;
	}
	static void SetBit(short* value, int pos, BOOL newVal)
	{
		
		int mask = (1 << pos);
		short val = *value;

		
		if (newVal)
			val |= mask;
		else
			val &= ~mask;

		
		*value = val;
	}
	static void SwapBits565(BYTE* pData)
	{
		unsigned short* pShorts = (unsigned short*)pData;

		unsigned short nShortSrc = *pShorts;

		unsigned short nShortDst = 0;

		nShortDst |= (nShortSrc & (1 <<  0)) ? (1 <<  4) : 0;
		nShortDst |= (nShortSrc & (1 <<  1)) ? (1 <<  3) : 0;
		nShortDst |= (nShortSrc & (1 <<  2)) ? (1 <<  2) : 0;
		nShortDst |= (nShortSrc & (1 <<  3)) ? (1 <<  1) : 0;
		nShortDst |= (nShortSrc & (1 <<  4)) ? (1 <<  0) : 0;

		nShortDst |= (nShortSrc & (1 <<  5)) ? (1 << 10) : 0;
		nShortDst |= (nShortSrc & (1 <<  6)) ? (1 <<  9) : 0;
		nShortDst |= (nShortSrc & (1 <<  7)) ? (1 <<  8) : 0;
		nShortDst |= (nShortSrc & (1 <<  8)) ? (1 <<  7) : 0;
		nShortDst |= (nShortSrc & (1 <<  9)) ? (1 <<  6) : 0;
		nShortDst |= (nShortSrc & (1 << 10)) ? (1 <<  5) : 0;

		nShortDst |= (nShortSrc & (1 << 11)) ? (1 << 15) : 0;
		nShortDst |= (nShortSrc & (1 << 12)) ? (1 << 14) : 0;
		nShortDst |= (nShortSrc & (1 << 13)) ? (1 << 13) : 0;
		nShortDst |= (nShortSrc & (1 << 14)) ? (1 << 12) : 0;
		nShortDst |= (nShortSrc & (1 << 15)) ? (1 << 11) : 0;

		*pShorts = nShortDst;
	}
	static void SwapBits8(BYTE* pData)
	{
		unsigned char* pChars = (unsigned char*)pData;

		unsigned char nCharSrc = *pChars;

		unsigned char nCharDst = 0;

		nCharDst |= (nCharSrc & (1 << 0)) ? (1 << 7) : 0;
		nCharDst |= (nCharSrc & (1 << 1)) ? (1 << 6) : 0;
		nCharDst |= (nCharSrc & (1 << 2)) ? (1 << 5) : 0;
		nCharDst |= (nCharSrc & (1 << 3)) ? (1 << 4) : 0;
		nCharDst |= (nCharSrc & (1 << 4)) ? (1 << 3) : 0;
		nCharDst |= (nCharSrc & (1 << 5)) ? (1 << 2) : 0;
		nCharDst |= (nCharSrc & (1 << 6)) ? (1 << 1) : 0;
		nCharDst |= (nCharSrc & (1 << 7)) ? (1 << 0) : 0;

		*pChars = nCharDst;
	}
	
    static BYTE GetBrightness(BYTE Red, BYTE Green, BYTE Blue)
	{
		if (Red > Green)
		{
			if (Red > Blue)
				return Red;

			return Blue;
		}

		if (Green > Blue)
			return Green;

		return Blue;
	}
	static BYTE GetLightness(BYTE Red, BYTE Green, BYTE Blue)
	{
		
		BYTE MinValue, MaxValue;

		
		if (Red > Green)
		{
			MaxValue = Blue;
			if (Red > Blue)
				MaxValue = Red;

			MinValue = Blue;
			if (Green < Blue)
				MinValue = Green;
		}
		else
		{
			MaxValue = Blue;
			if (Green > Blue) 
				MaxValue = Green;

			MinValue = Blue;
			if (Red < Blue) 
				MinValue = Red;
		}

		
		return (MaxValue + MinValue)/2;
	}
    static BYTE GetIntensity(BYTE Red, BYTE Green, BYTE Blue)
	{
        return (BYTE)(0.3 * Red + 0.59 * Green + 0.11 * Blue);
	}
		
	static BOOL ByteArrayToMediaData(BYTE* pArray, int nWidth, int nHeight, IUnknown** pInterface, BOOL bFlipVertical = TRUE)
	{
		if (!pInterface || nWidth < 1 || nHeight < 1)
			return FALSE;

		*pInterface = NULL;

		MediaCore::IAVSUncompressedVideoFrame* pMediaData = NULL;

		CoCreateInstance(MediaCore::CLSID_CAVSUncompressedVideoFrame, NULL, CLSCTX_ALL, MediaCore::IID_IAVSUncompressedVideoFrame, (void**)(&pMediaData));
		if (NULL == pMediaData)
			return FALSE;

		if (bFlipVertical)
			pMediaData->put_ColorSpace(CSP_BGRA | CSP_VFLIP);
		else
			pMediaData->put_ColorSpace(CSP_BGRA);

		
		pMediaData->put_Width(nWidth);
		pMediaData->put_Height(nHeight);
		pMediaData->put_AspectRatioX(nWidth);
		pMediaData->put_AspectRatioY(nHeight);
		pMediaData->put_Interlaced(VARIANT_FALSE);
		pMediaData->put_Stride(0, 4*nWidth);
		pMediaData->AllocateBuffer(4*nWidth*nHeight);
		
		
		BYTE* pBufferPtr = 0;
		long nCreatedBufferSize = 0;
		pMediaData->get_Buffer(&pBufferPtr);
		pMediaData->get_BufferSize(&nCreatedBufferSize);
		pMediaData->put_Plane(0, pBufferPtr);

		
		if (!pBufferPtr || nCreatedBufferSize != 4*nWidth*nHeight)
		{
			RELEASEINTERFACE(pMediaData);
			return FALSE;
		}
		
		
		if (pArray != NULL)
			memcpy(pBufferPtr, pArray, nCreatedBufferSize);

		
		*pInterface = pMediaData;

		return TRUE;
	}
	static BOOL SafeArrayToMediaData(SAFEARRAY*& pArray, IUnknown** pInterface, BOOL bDeleteArray = TRUE)
	{
		if (!pArray || pArray->cDims != 3)
			return FALSE;

		
		int nWidth = pArray->rgsabound[1].cElements;
		int nHeight = pArray->rgsabound[0].cElements;

		BOOL bSuccess = ByteArrayToMediaData((BYTE*)pArray->pvData, nWidth, nHeight, pInterface);

		if (!bSuccess)
			return FALSE;

		
		if (bDeleteArray)
		{
			SafeArrayDestroy(pArray);
			pArray = 0;
		}

		return TRUE;
	}
		
	static BOOL GdiPlusBitmapToMediaData(Gdiplus::Bitmap* pBitmap, IUnknown** pInterface, BOOL bFlipVertical = TRUE)
	{
		if (!pBitmap)
			return FALSE;

		int nWidth = pBitmap->GetWidth();
		int nHeight = pBitmap->GetHeight();

		Gdiplus::Rect oRect(0, 0, nWidth, nHeight);
		Gdiplus::BitmapData oBitmapData;

		if (pBitmap->LockBits(&oRect, ImageLockModeRead, PixelFormat32bppARGB, &oBitmapData) != Ok)
			return FALSE;

		BOOL bSuccess = ByteArrayToMediaData((BYTE*)oBitmapData.Scan0, nWidth, nHeight, pInterface, bFlipVertical);
		
		pBitmap->UnlockBits(&oBitmapData);

		return bSuccess;
	}
	static BOOL GdiPlusImageToMediaData(GdiPlusEx::CGdiPlusImage* pImage, IUnknown** pInterface, BOOL bFlipVertical = TRUE)
	{
		if (!pImage || !pImage->IsValid())
			return FALSE;

		Gdiplus::Bitmap* pBitmap = (Bitmap*)(*pImage);

		return GdiPlusBitmapToMediaData(pBitmap, pInterface, bFlipVertical);
	}
	static BOOL GdiPlusImageToSafeArray(GdiPlusEx::CGdiPlusImage* pImage, SAFEARRAY** pArray)
	{
		if (!pImage || !pImage->IsValid())
			return FALSE;

		return pImage->SaveToSafeArray(*pArray);
	}
	
	static BOOL MediaDataToBGRAMediaData(IUnknown** pInterface, MediaCore::IAVSUncompressedVideoFrame*& pMediaData, BOOL bCreateDublicate = FALSE)
	{
		pMediaData = NULL;

		if (NULL == pInterface || NULL == (*pInterface))
			return FALSE;

		MediaCore::IAVSUncompressedVideoFrame* pMediaDataIn = NULL;
		(*pInterface)->QueryInterface(MediaCore::IID_IAVSUncompressedVideoFrame, (void**)(&pMediaDataIn));
		if (NULL == pMediaDataIn)
			return FALSE;

		LONG lWidth = 0; pMediaDataIn->get_Width(&lWidth);
		LONG lHeight = 0; pMediaDataIn->get_Height(&lHeight);
		LONG lAspectX = 0; pMediaDataIn->get_AspectRatioX(&lAspectX);
		LONG lAspectY = 0; pMediaDataIn->get_AspectRatioY(&lAspectY);

		
		
		if (TRUE)
		{
			MediaFormat::IAVSVideoFormat* pMediaFormat = NULL;
			CoCreateInstance(MediaFormat::CLSID_CAVSVideoFormat, NULL, CLSCTX_ALL, MediaFormat::IID_IAVSVideoFormat, (void**)(&pMediaFormat));
			if (NULL == pMediaFormat)
			{
				pMediaDataIn->Release();
				return FALSE;
			}

			MediaCore::IAVSVideoFrameTransform* pMediaTransform = NULL;
			CoCreateInstance(MediaCore::CLSID_CAVSVideoFrameTransform, NULL, CLSCTX_ALL, MediaCore::IID_IAVSVideoFrameTransform, (void**)(&pMediaTransform));
			if (NULL == pMediaTransform)
			{
				pMediaDataIn->Release();
				pMediaFormat->Release();
				return FALSE;
			}

			pMediaFormat->SetDefaultProperties();
			pMediaFormat->put_Width(lWidth);
			pMediaFormat->put_Height(lHeight);
			pMediaFormat->put_AspectRatioX(lAspectX);
			pMediaFormat->put_AspectRatioY(lAspectY);
			pMediaFormat->put_ColorSpace(CSP_BGRA | CSP_VFLIP);

			

			pMediaTransform->SetVideoFormat(pMediaFormat);
			
			IUnknown *pTransformResult = NULL;
			pMediaTransform->TransformFrame(pMediaDataIn, &pTransformResult);
			if (NULL != pTransformResult)
			{
				if (((*pInterface)==pTransformResult)&&(bCreateDublicate))
				{
					MediaCore::IAVSMediaData *pData = NULL;
					pTransformResult->QueryInterface(MediaCore::IID_IAVSMediaData, (void**)(&pData));
					if (NULL!=pData)
					{
						MediaCore::IAVSMediaData *pmdOutFrame = NULL;
						pData->CreateDuplicate(DUBLICATE_TYPE_COPY, &pmdOutFrame);
						pData->Release();
						if (NULL!=pmdOutFrame)
						{
							pmdOutFrame->QueryInterface(MediaCore::IID_IAVSUncompressedVideoFrame, (void**)(&pMediaData));
							pmdOutFrame->Release();
						}
					}					
				}
				else
				{
					pTransformResult->QueryInterface(MediaCore::IID_IAVSUncompressedVideoFrame, (void**)(&pMediaData));
				}
				pTransformResult->Release();
			}

			pMediaFormat->Release();
			pMediaTransform->Release();
		}

		pMediaDataIn->Release();

		return (NULL != pMediaData);
	}
	static BOOL MediaDataToByteArray(IUnknown** pInterface, MediaCore::IAVSUncompressedVideoFrame*& pMediaData, BYTE*& pArray, int& nWidth, int& nHeight)
	{
		if (!pInterface || !*pInterface)
			return FALSE;

		pMediaData = NULL;
		if (!MediaDataToBGRAMediaData(pInterface, pMediaData))
			return FALSE;

		LONG lWidth = 0; pMediaData->get_Width(&lWidth);
		LONG lHeight = 0; pMediaData->get_Height(&lHeight);
		LONG lColorSpace = 0; pMediaData->get_ColorSpace(&lColorSpace);
		LONG lStride = 0; pMediaData->get_Stride(0, &lStride);
		LONG lBufferSize = 0; pMediaData->get_BufferSize(&lBufferSize);
		BYTE* pSourceBuffer = 0; pMediaData->get_Buffer(&pSourceBuffer);

		
		if (CSP_BGRA != (CSP_COLOR_MASK & lColorSpace) || 4*lWidth != lStride || lWidth < 1 || lHeight < 1 || lBufferSize != 4*lWidth*lHeight || !pSourceBuffer)
		{
			pMediaData->Release();
			pMediaData = NULL;
			return FALSE;
		}

		
		pArray = pSourceBuffer;
		nWidth = lWidth;
		nHeight = lHeight;

		return TRUE;
	}
	static BOOL MediaDataToSafeArray(IUnknown** pInterface, SAFEARRAY*& pArray)
	{
		int nWidth = 0;
		int nHeight = 0;
		BYTE* pPixels = 0;
		MediaCore::IAVSUncompressedVideoFrame* pMediaData = NULL;

		if (!MediaDataToByteArray(pInterface, pMediaData, pPixels, nWidth, nHeight))
			return FALSE;

		SAFEARRAYBOUND saBounds[3];
		saBounds[0].lLbound = saBounds[1].lLbound = saBounds[2].lLbound = 0;
		saBounds[0].cElements = 4;
		saBounds[1].cElements = nWidth;
		saBounds[2].cElements = nHeight;

		pArray = SafeArrayCreate(VT_UI1, 3, saBounds);
		if (!pArray)
		{
			pMediaData->Release();
			return FALSE;
		}

		
		memcpy(pArray->pvData, pPixels, 4*nWidth*nHeight);

		pMediaData->Release();

		return TRUE;
	}
	static BOOL MediaDataToGdiPlusImage(IUnknown** pInterface, GdiPlusEx::CGdiPlusImage* pImage)
	{
		if (!pImage)
			return FALSE;

		int nWidth = 0;
		int nHeight = 0;
		BYTE* pPixels = 0;
		MediaCore::IAVSUncompressedVideoFrame* pMediaData = NULL;

		if (!MediaDataToByteArray(pInterface, pMediaData, pPixels, nWidth, nHeight))
			return FALSE;

		pImage->Destroy();

		if (!pImage->CreateFromByteArray(pPixels, nWidth, nHeight, TRUE))
			return FALSE;

		pMediaData->Release();

		return TRUE;
	}
	
	static BYTE* ExtractImage(SAFEARRAY** pArray, int& nWidth, int& nHeight, int& nChannels)
	{
		
		if (!pArray || !(*pArray))
			return 0;

		
		nWidth = nHeight = 0;

		
		VARTYPE type;
		long lBoundC, uBoundC;
		long lBoundW, uBoundW;
		long lBoundH, uBoundH;

		
		if (SafeArrayGetDim(*pArray) != 3)
			return 0;

		
		if (FAILED(SafeArrayGetVartype(*pArray, &type)) || type != VT_UI1 || SafeArrayGetElemsize(*pArray) != 1)
			return 0;

		
		if (FAILED(SafeArrayGetLBound(*pArray, 1, &lBoundC)) || FAILED(SafeArrayGetUBound(*pArray, 1, &uBoundC)) ||
			FAILED(SafeArrayGetLBound(*pArray, 2, &lBoundW)) || FAILED(SafeArrayGetUBound(*pArray, 2, &uBoundW)) ||
			FAILED(SafeArrayGetLBound(*pArray, 3, &lBoundH)) || FAILED(SafeArrayGetUBound(*pArray, 3, &uBoundH)))
			return 0;

		
		nChannels = 1 + uBoundC - lBoundC;
		nWidth = 1 + uBoundW - lBoundW;
		nHeight = 1 + uBoundH - lBoundH;

		
		return (BYTE*)((*pArray)->pvData);
	}
	static BOOL ExtractFromArray(void** Image, int& width, int& height, BYTE*& pixels)
	{
		SAFEARRAY** Array = ((SAFEARRAY**)Image);

		int channels = 0;

		pixels = ImageStudioUtils::ExtractImage(Array, width, height, channels);

		
		if (!pixels || channels != 4)
			return FALSE;

		
		return TRUE;
	}
		
	static void FillAlphaChannel(SAFEARRAY** pArray, int Value)
	{
		
		if (!pArray)
			return;
		if (!*pArray)
			return;

		
		int nWidth, nHeight, nChannels;

		
		BYTE* pData = ExtractImage(pArray, nWidth, nHeight, nChannels);

		
		if (!pData)
			return;

		
		int nSize = nChannels*nWidth*nHeight;

		
		for (int nIndex = 0; nIndex < nSize; nIndex += nChannels)
			pData[nIndex + nChannels - 1] = Value;
	}
	static COLORREF GetColorLight(COLORREF color, int levels = 16)
	{
		int nR = min(255, max(0, levels + GetRValue(color)));
		int nG = min(255, max(0, levels + GetGValue(color)));
		int nB = min(255, max(0, levels + GetBValue(color)));

		return RGB(nR, nG, nB);
	}
	static COLORREF GetColorDark(COLORREF color, int levels = 16)
	{
		return GetColorLight(color, -levels);
	}
	static DWORD Align32(DWORD n)
	{
		return (((n * (DWORD)8) + 31) & ~31) >> 3;
	}
		
	static void DestroySafeArray(SAFEARRAY** pArray)
	{
		
		if (!pArray || !*pArray)
			return;

		
		try
		{
			long uBound = 0;
			if (SUCCEEDED(SafeArrayGetUBound(*pArray, 0, &uBound)) && uBound > 0)
				SafeArrayDestroy(*pArray);

			if (SafeArrayGetElemsize(*pArray) > 0)
				SafeArrayDestroy(*pArray);
		}
		catch(...)
		{
			
		}
	}
	static void GetEncoderClsid(const WCHAR* pFormat, CLSID* pClsid)
	{
		
		UINT nEncoders = 0;
		UINT nSize = 0;
		Gdiplus::ImageCodecInfo* pImageCodecInfo = 0;

		
		Gdiplus::GetImageEncodersSize(&nEncoders, &nSize);

		
		if (!nSize)
			throw 0;

		
		pImageCodecInfo = (Gdiplus::ImageCodecInfo*)(malloc(nSize));

		
		if (!pImageCodecInfo)
			throw 0;

		
		Gdiplus::GetImageEncoders(nEncoders, nSize, pImageCodecInfo);

		
		for (UINT nEncoder = 0; nEncoder < nEncoders; ++nEncoder)
		{
			
			if (CompareStrings(pImageCodecInfo[nEncoder].MimeType, pFormat) == 0)
			{
				
				*pClsid = pImageCodecInfo[nEncoder].Clsid;

				
				free(pImageCodecInfo);

				
				return;
			}    
		}

		
		free(pImageCodecInfo);

		
		throw 0;
	}
}
