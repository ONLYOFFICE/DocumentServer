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

#include <gdiplus.h>

#pragma comment(lib, "gdiplus.lib")

using namespace Gdiplus;



class CGdiPlusInit  
{
public:

	CGdiPlusInit()
	{
		m_bPresent = FALSE;
		m_nToken = 0;
	}
	virtual ~CGdiPlusInit()
	{
		if (m_bPresent) 
			Gdiplus::GdiplusShutdown(m_nToken);
	}
	BOOL Init()
	{
		Gdiplus::GdiplusStartupInput pInput;

		try
		{
			Gdiplus::GdiplusStartup(&m_nToken, &pInput, 0);

			m_bPresent = TRUE;
		}
		catch (...)
		{
			m_bPresent = FALSE;
		}

		return m_bPresent;
	}
	BOOL Good()
	{
		return m_bPresent;
	}
	BOOL IsValid()
	{
		return m_bPresent;
	}

private:

	BOOL m_bPresent;
	ULONG_PTR m_nToken;
};
	
namespace GdiPlusEx
{
	class CGdiPlusObject
	{
	protected:
	
		void* m_pGdiPlusObject; 
	
	public:

		CGdiPlusObject()
		{
			m_pGdiPlusObject = NULL;
		}
		virtual ~CGdiPlusObject()
		{
		}
		
		virtual BOOL IsValid()
		{
			if (m_pGdiPlusObject)
				return TRUE;

			return FALSE;
		}
	};
	class CGdiPlusImage : public CGdiPlusObject
	{
	protected:
	
		BYTE* m_pDataCopy;			
		BYTE* m_pDataAttach;		
		HGLOBAL m_hDataCopy;		
	
	public:
		
		CGdiPlusImage()
		{
			m_pDataCopy = NULL;
			m_pDataAttach = NULL;
			m_hDataCopy = NULL;

		}
		~CGdiPlusImage()
		{
			Destroy();
		}

		virtual void Destroy()
		{
			
			if (m_pGdiPlusObject)
			{
				Gdiplus::Image* pGdiPlusImage = (Gdiplus::Image*)m_pGdiPlusObject;

				if (pGdiPlusImage)
					delete pGdiPlusImage;

				m_pGdiPlusObject = NULL;
			}

			
			if (m_pDataCopy)
			{
				delete[] m_pDataCopy;
				m_pDataCopy = NULL;
			}

			
			if (m_hDataCopy)
			{
				GlobalFree(m_hDataCopy);
				m_hDataCopy = NULL;
			}

			m_pDataAttach = NULL;
		}
		
		operator Gdiplus::Image*()
		{
			return (Gdiplus::Image*)m_pGdiPlusObject;
		}
		operator Gdiplus::Bitmap*()
		{
			return (Gdiplus::Bitmap*)m_pGdiPlusObject;
		}
		Gdiplus::Image* operator= (Gdiplus::Image* pImage)
		{
			Destroy();

			m_pGdiPlusObject = (void*)pImage;

			return (Gdiplus::Image*)m_pGdiPlusObject;
		}
		Gdiplus::Bitmap* operator= (Gdiplus::Bitmap* pBitmap)
		{
			Destroy();

			m_pGdiPlusObject = (void*)pBitmap;

			return (Gdiplus::Bitmap*)m_pGdiPlusObject;
		}
		
		int GetWidth()
		{
			if (!IsValid())
				return 0;
			
			return ((Gdiplus::Bitmap*)m_pGdiPlusObject)->GetWidth();
		}
		int GetHeight()
		{
			if (!IsValid())
				return 0;
			
			return ((Gdiplus::Bitmap*)m_pGdiPlusObject)->GetHeight();
		}
		
		BOOL CreateFromFile(BSTR FilePath, int nFrame = 0, double* pHorResolution = NULL, double* pVerResolution = NULL )
		{
			Destroy();

			try
			{
				
				
				Bitmap* pBitmap = new Bitmap(FilePath);

				if (pBitmap && pBitmap->GetLastStatus() == Ok)
				{
					GUID format;

					
					pBitmap->GetRawFormat(&format);

					if( nFrame > 0 )
					{
						
						long nFrameCount = 0;

						
						if (format == ImageFormatTIFF)
							nFrameCount = pBitmap->GetFrameCount(&FrameDimensionPage);
						else if (format == ImageFormatGIF)
							nFrameCount = pBitmap->GetFrameCount(&FrameDimensionTime);

						
						if (nFrame < nFrameCount)
						{
							
							if (format == ImageFormatTIFF)
								pBitmap->SelectActiveFrame(&FrameDimensionPage, nFrame);
							else if (format == ImageFormatGIF)
								pBitmap->SelectActiveFrame(&FrameDimensionTime, nFrame);
						}
					}
					
					m_pGdiPlusObject = (void*)pBitmap;

					if( pHorResolution )
						*pHorResolution = pBitmap->GetHorizontalResolution();

					if( pVerResolution )
						*pVerResolution = pBitmap->GetVerticalResolution();

					return TRUE;
				}
			}
			catch (...)
			{
			}

			Destroy();

			return FALSE;
		}
		BOOL CreateFromSafeArray(SAFEARRAY** AvsArray, BOOL CreateCopy)
		{
			if (!AvsArray || !*AvsArray)
				return FALSE;

			try
			{
				int nWidth = (*AvsArray)->rgsabound[1].cElements;
				int nHeight = (*AvsArray)->rgsabound[0].cElements;

				return CreateFromByteArray((BYTE*)((*AvsArray)->pvData), nWidth, nHeight, CreateCopy); 
			}
			catch (...)
			{
			}

			Destroy();

			return FALSE;
		}
		BOOL CreateFromByteArray(BYTE* ByteArray, long Width, long Height, BOOL CreateCopy)
		{
			Destroy();

			if (!ByteArray || Width < 1 || Height < 1)
				return FALSE;

			try
			{
				Destroy();

				Bitmap* pBitmap = NULL;

				if (CreateCopy)
				{
					m_pDataCopy = new BYTE[4*Width*Height];

					memcpy(m_pDataCopy, ByteArray, 4*Width*Height);

					pBitmap = new Bitmap(Width, Height, 4*Width, PixelFormat32bppRGB, m_pDataCopy);
				}
				else
				{
					m_pDataAttach = ByteArray;

					pBitmap = new Bitmap(Width, Height, 4*Width, PixelFormat32bppRGB, m_pDataAttach);
				}

				if (pBitmap && pBitmap->GetLastStatus() == Ok)
				{
					m_pGdiPlusObject = (void*)pBitmap;

					return TRUE;
				}
			}
			catch (...)
			{
			}

			Destroy();

			return FALSE;
		}
		BOOL CreateFromByteArray(BYTE* ByteArray, long Width, long Height, int Stride, int Format, BOOL CreateCopy)
		{
			Destroy();

			if (!ByteArray || Width < 1 || Height < 1)
				return FALSE;

			try
			{
				Destroy();

				Bitmap* pBitmap = NULL;

				if (CreateCopy)
				{
					m_pDataCopy = new BYTE[Stride*Height];

					memcpy(m_pDataCopy, ByteArray, Stride*Height);

					pBitmap = new Bitmap(Width, Height, Stride, Format, m_pDataCopy);
				}
				else
				{
					m_pDataAttach = ByteArray;

					pBitmap = new Bitmap(Width, Height, Stride, Format, m_pDataAttach);
				}

				if (pBitmap && pBitmap->GetLastStatus() == Ok)
				{
					m_pGdiPlusObject = (void*)pBitmap;

					return TRUE;
				}
			}
			catch (...)
			{
			}

			Destroy();

			return FALSE;
		}
		BOOL CreateFromStream(BYTE* ByteArray, long Size)
		{
			Destroy();

			if (!ByteArray || Size < 1)
				return FALSE;

			try
			{
				
				m_hDataCopy = GlobalAlloc(GMEM_FIXED, Size);
				if (!m_hDataCopy)
				{
					Destroy();

					return FALSE;
				}

				
				LPVOID pImageGlobalPtr = GlobalLock(m_hDataCopy);
				if (!pImageGlobalPtr)
				{
					Destroy();

					return FALSE;
				}
				memcpy(pImageGlobalPtr, ByteArray, Size);
				GlobalUnlock(m_hDataCopy);

				
				LPSTREAM pImageStream = NULL;
				if (FAILED(CreateStreamOnHGlobal(m_hDataCopy, FALSE, &pImageStream)))
				{
					Destroy();

					return FALSE;
				}

				
				Bitmap* pBitmap = new Bitmap(pImageStream);

				pImageStream->Release();

				if (pBitmap && pBitmap->GetLastStatus() == Ok)
				{
					m_pGdiPlusObject = (void*)pBitmap;

					return TRUE;
				}
			}
			catch (...)
			{
			}

			Destroy();

			return FALSE;
		}
			
		BOOL SaveToSafeArray(SAFEARRAY*& pArray)
		{
			if (!IsValid())
				return FALSE;

			int nWidth = GetWidth();
			int nHeight = GetHeight();
			Gdiplus::Bitmap* pBitmap = (Gdiplus::Bitmap*)m_pGdiPlusObject;

			SAFEARRAYBOUND bounds[3];
			BitmapData oLockData;
			Rect oLockRect(0, 0, nWidth, nHeight);
			
			bounds[0].lLbound = 0;
			bounds[0].cElements = 4;
			bounds[1].lLbound = 0;
			bounds[1].cElements = nWidth;
			bounds[2].lLbound = 0;
			bounds[2].cElements = nHeight;

			pArray = SafeArrayCreate(VT_UI1, 3, bounds);

			if (!pArray)
				return FALSE;

			if (pBitmap->LockBits(&oLockRect, ImageLockModeRead, PixelFormat32bppARGB, &oLockData) == Ok)
			{
				memcpy(pArray->pvData, oLockData.Scan0, 4*nWidth*nHeight);
			}

			if (pBitmap->GetPixelFormat() == PixelFormat1bppIndexed ||
				pBitmap->GetPixelFormat() == PixelFormat4bppIndexed  ||
				pBitmap->GetPixelFormat() == PixelFormat16bppGrayScale ||
				pBitmap->GetPixelFormat() == PixelFormat16bppRGB555 ||
				pBitmap->GetPixelFormat() == PixelFormat16bppRGB565 ||
				pBitmap->GetPixelFormat() == PixelFormat24bppRGB ||
				pBitmap->GetPixelFormat() == PixelFormat32bppRGB )
			{
				BYTE* pData = (BYTE*)(pArray->pvData) + 3;

				for (int index = 0; index < 4*nWidth*nHeight; ++index)
					*pData = 255;
			}

			return TRUE;
		}
	};
	class CGdiPlusGraphics : public CGdiPlusObject
	{
	public:
	
		~CGdiPlusGraphics()
		{
			Destroy();
		}

		virtual void Destroy()
		{
			
			if (m_pGdiPlusObject)
			{
				Gdiplus::Graphics* pGdiPlusGraphics = (Gdiplus::Graphics*)m_pGdiPlusObject;

				if (pGdiPlusGraphics)
					delete pGdiPlusGraphics;

				m_pGdiPlusObject = NULL;
			}
		}
	
		operator Gdiplus::Graphics*()
		{
			return (Gdiplus::Graphics*)m_pGdiPlusObject;
		}
		Gdiplus::Graphics* operator= (Gdiplus::Graphics* pGraphics)
		{
			Destroy();

			m_pGdiPlusObject = (void*)pGraphics;

			return (Gdiplus::Graphics*)m_pGdiPlusObject;
		}
	
		BOOL CreateFromImage(Gdiplus::Image* pImage)
		{
			if (!pImage)
				return FALSE;

			Destroy();

			try
			{

				Graphics* pGraphics = Graphics::FromImage(pImage);

				if (pGraphics && pGraphics->GetLastStatus() == Ok)
				{
					m_pGdiPlusObject = (void*)pGraphics;

					return TRUE;
				}
			}
			catch (...)
			{
			}

			Destroy();

			return FALSE;
		}
		BOOL CreateFromImage(GdiPlusEx::CGdiPlusImage* pImage)
		{
			if (!pImage)
				return FALSE;

			Destroy();

			try
			{
				Bitmap* pBitmap = (Bitmap*)(*pImage);

				if (pBitmap && pBitmap->GetLastStatus() == Ok)
					return CreateFromImage(pBitmap);
			}
			catch (...)
			{
			}

			Destroy();

			return FALSE;
		}
	};
}