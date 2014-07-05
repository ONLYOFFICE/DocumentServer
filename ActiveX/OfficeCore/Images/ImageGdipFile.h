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
#include "stdafx.h"
#include "resource.h"       
#include <string>

#include "./GdiPlusEx.h"
#include "./../UncompressedFrame/UncompressedFrame.h"

#define IMAGEFILE_TYPE_NONE				0
#define IMAGEFILE_TYPE_BMP				1
#define IMAGEFILE_TYPE_GIF				2
#define IMAGEFILE_TYPE_JPEG				3
#define IMAGEFILE_TYPE_PNG				4
#define IMAGEFILE_TYPE_TIFF				5
#define IMAGEFILE_TYPE_WMF				6
#define IMAGEFILE_TYPE_EMF				7
#define IMAGEFILE_TYPE_PCX				8
#define IMAGEFILE_TYPE_TGA				9
#define IMAGEFILE_TYPE_IPOD				10
#define IMAGEFILE_TYPE_PSD				11
#define IMAGEFILE_TYPE_JP2				12

namespace ImageUtils
{
	static BOOL ByteArrayToMediaData(BYTE* pArray, int nWidth, int nHeight, IUncompressedFrame** pInterface, BOOL bFlipVertical = TRUE)
	{
		if (!pInterface || nWidth < 1 || nHeight < 1)
			return FALSE;

		*pInterface = NULL;

		IUncompressedFrame* pMediaData = NULL;
		CoCreateInstance(__uuidof(CUncompressedFrame), NULL, CLSCTX_ALL, __uuidof(IUncompressedFrame), (void**)(&pMediaData));
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
		
	static BOOL GdiPlusBitmapToMediaData(Gdiplus::Bitmap* pBitmap, IUncompressedFrame** pInterface, BOOL bFlipVertical = TRUE)
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

	static BOOL MediaDataToGdiPlusImage(IUncompressedFrame* pInterface, BOOL bIsCopy, Gdiplus::Bitmap** pImage)
	{
		if (!pImage || !pInterface)
			return FALSE;

		*pImage = NULL;

		LONG nWidth = 0;
		LONG nHeight = 0;
		BYTE* pPixels = 0;
		LONG lColorSpace = -1;

		pInterface->get_Width(&nWidth);
		pInterface->get_Height(&nHeight);
		pInterface->get_Buffer(&pPixels);
		pInterface->get_ColorSpace(&lColorSpace);

		if ((lColorSpace & CSP_BGRA) != CSP_BGRA)
		{
			
			return FALSE;
		}

		Gdiplus::Bitmap* pBitmap = NULL;
		try
		{
			LONG nDataSize = 4 * nWidth * nHeight;
			
			if (bIsCopy)
			{
				BYTE* pDataCopy = new BYTE[nDataSize];
				memcpy(pDataCopy, pPixels, nDataSize);

				pBitmap = new Bitmap(nWidth, nHeight, 4 * nWidth, PixelFormat32bppARGB, pDataCopy);
			}
			else
			{
				pBitmap = new Bitmap(nWidth, nHeight, 4 * nWidth, PixelFormat32bppARGB, pPixels);
			}

			if (pBitmap && pBitmap->GetLastStatus() != Gdiplus::Ok)
			{
				RELEASEOBJECT(pBitmap);
			}
		}
		catch (...)
		{
		}

		if (NULL != pBitmap)
		{
			*pImage = pBitmap;
			return TRUE;
		}

		return FALSE;
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
			
			if (((CString)(pImageCodecInfo[nEncoder].MimeType)) == pFormat)
			{
				
				*pClsid = pImageCodecInfo[nEncoder].Clsid;

				
				free(pImageCodecInfo);

				
				return;
			}    
		}

		
		free(pImageCodecInfo);

		
		throw 0;
	}

	static BOOL SaveGdipImage(const CString& strFilePath, Gdiplus::Bitmap* pBitmap, const CString& strFormat)
	{
		try
		{
			CLSID clsId;
			GetEncoderClsid(strFormat, &clsId);

			BSTR bstrFilePath = strFilePath.AllocSysString();
			Gdiplus::Status nStatus = pBitmap->Save(bstrFilePath, &clsId, NULL);
			SysFreeString(bstrFilePath);

			if (nStatus == Gdiplus::Ok)
				return TRUE;
		}
		catch(...)
		{
			return FALSE;
		}
		return FALSE;
	}
}

#if defined(_WIN32_WCE) && !defined(_CE_DCOM) && !defined(_CE_ALLOW_SINGLE_THREADED_OBJECTS_IN_MTA)
#error "Single-threaded COM objects are not properly supported on Windows CE platform, such as the Windows Mobile platforms that do not include full DCOM support. Define _CE_ALLOW_SINGLE_THREADED_OBJECTS_IN_MTA to force ATL to support creating single-thread COM object's and allow use of it's single-threaded COM object implementations. The threading model in your rgs file was set to 'Free' as that is the only threading model supported in non DCOM Windows CE platforms."
#endif


[ object, uuid("6CF1F592-0653-45a6-B37B-258D329930DC"), dual, pointer_default(unique) ]
__interface IImageGdipFile : IDispatch
{
	[id(1)]				HRESULT OpenFile([in] BSTR bsFileName);
	[id(2)]				HRESULT SaveFile([in] BSTR bsFileName, [in] LONG lFormat);

	[id(3), propget]	HRESULT Frame([out, retval] IUnknown** punkFrame);
	[id(3), propput]	HRESULT Frame([in] IUnknown* punkFrame);

	[id(4)]				HRESULT Resize([in] LONG lWidth, [in] LONG lHeight, [in] LONG lMode);

	[id(100)]			HRESULT SetAdditionalParam([in] BSTR ParamName, [in] VARIANT ParamValue);
	[id(101)]			HRESULT GetAdditionalParam([in] BSTR ParamName, [out,retval] VARIANT* ParamValue);
};


[ coclass, default(IImageGdipFile), threading(apartment), vi_progid("OfficeCore.GdipImage"), progid("OfficeCore.GdipImage.1"), version(1.0), uuid("3BFAB91D-E27A-474b-9ACF-B791FD2CF559") ]
class ATL_NO_VTABLE CImageGdipFile : public IImageGdipFile
{
private:
	CGdiPlusInit m_oInit;
	IUncompressedFrame* m_pFrame;

public:
	DECLARE_PROTECT_FINAL_CONSTRUCT()
	
	CImageGdipFile()
	{
	}
	~CImageGdipFile()
	{
	}

public:
	HRESULT FinalConstruct()
	{
		m_pFrame = NULL;
		m_oInit.Init();
		return S_OK;
	}
	void FinalRelease()
	{
		RELEASEINTERFACE(m_pFrame);
	}

public:

	STDMETHOD(OpenFile)(BSTR bsFileName)
	{
		try
		{
			RELEASEINTERFACE(m_pFrame);
			Bitmap oBitmap(bsFileName);

			if (oBitmap.GetLastStatus() == Gdiplus::Ok)
			{
				ImageUtils::GdiPlusBitmapToMediaData(&oBitmap, &m_pFrame);
			}
			else
			{
				Metafile oMeta(bsFileName);
				UINT lSrcW = oMeta.GetWidth();
				UINT lSrcH = oMeta.GetHeight();

				if (oMeta.GetLastStatus() == Gdiplus::Ok && lSrcW > 0 && lSrcH > 0)
				{
					UINT lMaxSize = 1000;
					LONG lDstW = lSrcW;
					LONG lDstH = lSrcH;
					if (lSrcW > lMaxSize || lSrcH > lMaxSize)
					{
						double dKoef1 = (double)lMaxSize / lSrcW;
						double dKoef2 = (double)lMaxSize / lSrcH;
						double dKoef = min(dKoef1, dKoef2);

						lDstW = (LONG)(dKoef * lSrcW);
						lDstH = (LONG)(dKoef * lSrcH);

						Bitmap oBitmapMeta(lDstW, lDstH, PixelFormat32bppARGB);
						Graphics oGraphics(&oBitmapMeta);
						oGraphics.DrawImage(&oMeta, 0, 0, lDstW, lDstH);

						if (oBitmapMeta.GetLastStatus() == Gdiplus::Ok)
						{
							ImageUtils::GdiPlusBitmapToMediaData(&oBitmapMeta, &m_pFrame);
						}
					}
				}
			}
		}
		catch(...)
		{
		}
		return S_OK;
	}
	STDMETHOD(SaveFile)(BSTR bsFileName, LONG lFormat)
	{
		if (NULL != m_pFrame)
		{
			Bitmap* pBitmap = NULL;
			BOOL bIsValidBitmap = ImageUtils::MediaDataToGdiPlusImage(m_pFrame, FALSE, &pBitmap);

			if (!bIsValidBitmap)
				return S_FALSE;

			CString strFormat = _T("");
			switch (lFormat)
			{
			case IMAGEFILE_TYPE_PNG:
				strFormat = _T("image/png");
				break;
			case IMAGEFILE_TYPE_JPEG:
				strFormat = _T("image/jpeg");
				break;
			case IMAGEFILE_TYPE_BMP:
				strFormat = _T("image/bmp");
				break;
			case IMAGEFILE_TYPE_GIF:
				strFormat = _T("image/gif");
				break;
			case IMAGEFILE_TYPE_TIFF:
				strFormat = _T("image/tiff");
				break;
			default:
				break;
			}

			if (_T("") == strFormat)
			{
				RELEASEOBJECT(pBitmap);
				return S_FALSE;
			}

			BOOL bIsSaved = FALSE;
			try
			{
				bIsSaved = ImageUtils::SaveGdipImage((CString)bsFileName, pBitmap, strFormat);
			}
			catch(...)
			{
			}
			RELEASEOBJECT(pBitmap);
			
			if (bIsSaved)
				return S_OK;			
		}
		return S_FALSE;
	}

	STDMETHOD(get_Frame)(IUnknown** punkFrame)
	{
		if (!punkFrame)
			return S_FALSE;

		*punkFrame = NULL;
		if (NULL != m_pFrame)
			m_pFrame->QueryInterface(IID_IUnknown, (void**)punkFrame);

		return S_OK;
	}
	STDMETHOD(put_Frame)(IUnknown* punkFrame)
	{
		RELEASEINTERFACE(m_pFrame);

		if (NULL != punkFrame)
			punkFrame->QueryInterface(__uuidof(IUncompressedFrame), (void**)&m_pFrame);

		return S_OK;
	}

	STDMETHOD(Resize)(LONG lWidth, LONG lHeight, LONG lMode)
	{
		if (lWidth <= 0 || lHeight <= 0)
			return S_FALSE;

		Bitmap* pBitmap = NULL;
		BOOL bIsValidSrc = ImageUtils::MediaDataToGdiPlusImage(m_pFrame, FALSE, &pBitmap);

		if (!bIsValidSrc)
			return S_FALSE;

		Bitmap oDst(lWidth, lHeight, PixelFormat32bppARGB);
		Graphics* pGraphics = Graphics::FromImage(&oDst);

		pGraphics->SetInterpolationMode((Gdiplus::InterpolationMode)lMode);
		pGraphics->DrawImage(pBitmap, 0, 0, lWidth, lHeight);

		RELEASEOBJECT(pGraphics);
		RELEASEOBJECT(pBitmap);

		RELEASEINTERFACE(m_pFrame);

		ImageUtils::GdiPlusBitmapToMediaData(&oDst, &m_pFrame);		
		return S_OK;
	}

public:
	STDMETHOD(SetAdditionalParam)(BSTR ParamName, VARIANT ParamValue)
	{
		return S_OK;
	}
	STDMETHOD(GetAdditionalParam)(BSTR ParamName, VARIANT* ParamValue)
	{
		return S_OK;
	}
};