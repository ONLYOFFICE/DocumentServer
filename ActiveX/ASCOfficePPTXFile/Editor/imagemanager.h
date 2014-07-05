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
#include "math.h"
#include "CalculatorCRC32.h"

#include "../../Common/DocxFormat/Source/SystemUtility/File.h"
#include "FontPicker.h"
using namespace NSFontCutter;

#ifndef AVSINLINE
#define AVSINLINE __forceinline
#endif

#include "../../ASCPresentationEditor/PPTXWriter/FileDownloader.h"
#include "WMFToImageConverter.h"
#include "../../Common/MediaFormatDefine.h"

namespace NSShapeImageGen
{
	const long c_nMaxImageSize = 2000;

	static BOOL _CopyFile(CString strExists, CString strNew, LPPROGRESS_ROUTINE lpFunc, LPVOID lpData) 
	{
		::DeleteFile(strNew);
		return ::CopyFileEx(strExists, strNew, lpFunc, lpData, FALSE, 0); 
	}

	enum ImageType
	{
		itJPG	= 0,
		itPNG	= 1,
		itVIF	= 2,
		itWMF	= 3,
		itEMF	= 4
	};

	class CImageInfo
	{
	public:
		NSShapeImageGen::ImageType	m_eType;
		LONG		m_lID;
		bool		m_bValid;

		CImageInfo()
		{
			m_eType		= itJPG;
			m_lID		= -1;
			m_bValid	= true;
		}
		CImageInfo(const CImageInfo& oSrc)
		{
			*this = oSrc;
		}
		CImageInfo& operator=(const CImageInfo& oSrc)
		{
			m_eType		= oSrc.m_eType;
			m_lID		= oSrc.m_lID;
			m_bValid	= oSrc.m_bValid;

			return *this;
		}

		AVSINLINE CString GetPath(const CString& strMedia)
		{
			CString strExt = _T("");
			strExt.Format(_T("\\image%d.%s"), m_lID, (itJPG == m_eType) ? _T("jpg") : _T("png"));
			return strMedia + strExt;
		}

		AVSINLINE CString GetPath2()
		{
			CString _strExt = _T("png");
			switch (m_eType)
			{
			case itJPG:
				_strExt = _T("jpg");
				break;
			case itWMF:
				_strExt = _T("wmf");
				break;
			case itEMF:
				_strExt = _T("emf");
				break;
			default:
				break;
			}

			CString strExt = _T("");
			strExt.Format(_T("image%d.%s"), m_lID, _strExt);
			return strExt;
		}
	};

	class CImageManager
	{
	public:
		CAtlMap<CString, CImageInfo>	m_mapImagesFile;
		CAtlMap<DWORD, CImageInfo>		m_mapImageData;

		CAtlArray<void*>				m_listDrawings;
		CAtlList<CImageInfo>			m_listImages;

		CString							m_strDstMedia;

		LONG							m_lMaxSizeImage;
		LONG							m_lNextIDImage;

		CCalculatorCRC32				m_oCRC;

		LONG							m_lDstFormat;

#ifdef BUILD_CONFIG_FULL_VERSION
		NSWMFToImageConverter::CImageExt	m_oExt;
#endif

	public:

		CImageManager()
		{
			m_strDstMedia	= _T("");
			m_lMaxSizeImage = c_nMaxImageSize;
			m_lNextIDImage	= 0;
			m_lDstFormat	= 0;
		}

		AVSINLINE void NewDocument()
		{
			m_strDstMedia	= _T("");
			m_lMaxSizeImage = 800;
			m_lNextIDImage	= 0;

			m_mapImageData.RemoveAll();
			m_mapImagesFile.RemoveAll();
			m_listImages.RemoveAll();
		}

	public:
		template <typename T>
		void Serialize(T* pWriter)
		{
			pWriter->WriteINT(m_lMaxSizeImage);
			pWriter->WriteINT(m_lNextIDImage);
			pWriter->WriteINT(m_lDstFormat);
			pWriter->WriteString(m_strDstMedia);

			int lCount = (int)m_mapImagesFile.GetCount();
			pWriter->WriteINT(lCount);

			POSITION pos = m_mapImagesFile.GetStartPosition();
			while (NULL != pos)
			{
				CAtlMap<CString, CImageInfo>::CPair* pPair = m_mapImagesFile.GetNext(pos);

				pWriter->WriteString(pPair->m_key);
				pWriter->WriteINT((int)pPair->m_value.m_eType);
				pWriter->WriteINT((int)pPair->m_value.m_lID);
				pWriter->WriteBYTE(pPair->m_value.m_bValid ? 1 : 0);
			}

			lCount = (int)m_mapImageData.GetCount();
			pWriter->WriteINT(lCount);

			pos = m_mapImageData.GetStartPosition();
			while (NULL != pos)
			{
				CAtlMap<DWORD, CImageInfo>::CPair* pPair = m_mapImageData.GetNext(pos);

				pWriter->WriteULONG(pPair->m_key);
				pWriter->WriteINT((int)pPair->m_value.m_eType);
				pWriter->WriteINT((int)pPair->m_value.m_lID);
				pWriter->WriteBYTE(pPair->m_value.m_bValid ? 1 : 0);
			}
		}

		template <typename T>
		void Deserialize(T* pReader)
		{
			m_lMaxSizeImage = pReader->GetLong();
			m_lNextIDImage = pReader->GetLong();
			m_lDstFormat = pReader->GetLong();
			m_strDstMedia = pReader->GetString2();

			m_mapImageData.RemoveAll();
			m_mapImagesFile.RemoveAll();

			LONG lCount = pReader->GetLong();
			for (LONG i = 0; i < lCount; ++i)
			{
				CString sKey = pReader->GetString2();

				CImageInfo oInfo;
				oInfo.m_eType = (NSShapeImageGen::ImageType)pReader->GetLong();
				oInfo.m_lID = pReader->GetLong();
				oInfo.m_bValid = pReader->GetBool();

				m_mapImagesFile.SetAt(sKey, oInfo);
			}

			lCount = pReader->GetLong();
			for (LONG i = 0; i < lCount; ++i)
			{
				DWORD dwKey = (DWORD)pReader->GetULong();

				CImageInfo oInfo;
				oInfo.m_eType = (NSShapeImageGen::ImageType)pReader->GetLong();
				oInfo.m_lID = pReader->GetLong();
				oInfo.m_bValid = pReader->GetBool();

				m_mapImageData.SetAt(dwKey, oInfo);
			}
		}

	public:
		CImageInfo WriteImage(IUnknown* punkImage, double& x, double& y, double& width, double& height)
		{
			CImageInfo info;
			if (NULL == punkImage)
				return info;
			
			if (height < 0)
			{
				FlipY(punkImage);
				height = -height;
				y -= height;
			}
			
			return GenerateImageID(punkImage, max(1.0, width), max(1.0, height));
		}
		CImageInfo WriteImage(CString& strFile, double& x, double& y, double& width, double& height)
		{
			bool bIsDownload = false;
			int n1 = strFile.Find(_T("www"));
			int n2 = strFile.Find(_T("http"));
			int n3 = strFile.Find(_T("ftp"));
			int n4 = strFile.Find(_T("https"));

			if (((n1 >= 0) && (n1 < 10)) || ((n2 >= 0) && (n2 < 10)) || ((n3 >= 0) && (n3 < 10)) || ((n4 >= 0) && (n4 < 10)))
				bIsDownload = true;

			if (bIsDownload)
			{
				CString strFile1 = strFile;
				strFile1.Replace(_T("\\"), _T("/"));
				strFile1.Replace(_T("http:/"), _T("http://"));
				strFile1.Replace(_T("https:/"), _T("https://"));
				strFile1.Replace(_T("ftp:/"), _T("ftp://"));

				CImageInfo oInfo;
				CAtlMap<CString, CImageInfo>::CPair* pPair = m_mapImagesFile.Lookup(strFile1);
				if (pPair != NULL)
					return pPair->m_value;

				CString strDownload = _T("");
				CFileDownloader oDownloader(strFile1, TRUE);
				oDownloader.Start( 1 );
				while ( oDownloader.IsRunned() )
				{
					::Sleep( 10 );
				}

				if ( oDownloader.IsFileDownloaded() )
					strDownload = oDownloader.GetFilePath();

				return GenerateImageID_2(strDownload, strFile1, max(1.0, width), max(1.0, height));
			}
			
			CImageInfo info;
			CFile oFile;
			if (S_OK != oFile.OpenFile(strFile))
				return info;
			
			oFile.CloseFile();

			if (-1 == width && -1 == height)
				return GenerateImageID(strFile, width, height);
			return GenerateImageID(strFile, max(1.0, width), max(1.0, height));
		}
	
	protected:
		inline void CopyFile(CString& strFileSrc, CString& strFileDst)
		{
			_CopyFile(strFileSrc, strFileDst, NULL, NULL);
		}

#ifdef BUILD_CONFIG_OPENSOURCE_VERSION		
		static IUnknown* CreateEmptyImage(int nWidth, int nHeight, BOOL bFlipVertical = TRUE)
		{
			if (nWidth < 1 || nHeight < 1)
				return NULL;

			MediaCore::IAVSUncompressedVideoFrame* pMediaData = NULL;
			CoCreateInstance(MediaCore::CLSID_CAVSUncompressedVideoFrame, NULL, CLSCTX_ALL, MediaCore::IID_IAVSUncompressedVideoFrame, (void**)(&pMediaData));
			if (NULL == pMediaData)
				return NULL;

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
				return NULL;
			}
			
			
			memset(pBufferPtr, 0xFF, nCreatedBufferSize);

			
			IUnknown* punkInterface = NULL;
			pMediaData->QueryInterface(IID_IUnknown, (void**)&punkInterface);
			
			RELEASEINTERFACE(pMediaData);
			return punkInterface;
		}

		void SaveImage(CString& strFileSrc, CImageInfo& oInfo, LONG __width, LONG __height)
		{
			OfficeCore::IImageGdipFilePtr pImageFile;
			pImageFile.CreateInstance(OfficeCore::CLSID_CImageGdipFile);

			BSTR bsSrc = strFileSrc.AllocSysString();
			pImageFile->OpenFile(bsSrc);
			SysFreeString(bsSrc);

			IUnknown* punkFrame = NULL;
			pImageFile->get_Frame(&punkFrame);

			if (NULL == punkFrame)
				punkFrame = CreateEmptyImage(10, 10);

			MediaCore::IAVSUncompressedVideoFrame* pFrame = NULL;
			punkFrame->QueryInterface(MediaCore::IID_IAVSUncompressedVideoFrame, (void**)&pFrame);

			RELEASEINTERFACE(punkFrame);

			LONG lWidth		= 0;
			LONG lHeight	= 0;
			pFrame->get_Width(&lWidth);
			pFrame->get_Height(&lHeight);

			oInfo.m_eType = GetImageType(pFrame);

			RELEASEINTERFACE(pFrame);

			LONG lMaxSize = min(max(lWidth, lHeight), m_lMaxSizeImage);

			if ((lWidth > lMaxSize) || (lHeight > lMaxSize))
			{
				LONG lW = 0;
				LONG lH = 0;
				double dAspect = (double)lWidth / lHeight;

				if (lWidth >= lHeight)
				{
					lW = lMaxSize;
					lH = (LONG)((double)lW / dAspect);
				}
				else
				{
					lH = lMaxSize;
					lW = (LONG)(dAspect * lH);
				}

				pImageFile->Resize(lW, lH, 3);
			}

			LONG lSaveType = 4;
			CString strSaveItem = _T("");
			strSaveItem.Format(_T("\\image%d."), oInfo.m_lID);
			if (itJPG == oInfo.m_eType)
			{
				strSaveItem = m_strDstMedia + strSaveItem + _T("jpg");
				lSaveType = 3;
			}
			else
			{				
				strSaveItem = m_strDstMedia + strSaveItem + _T("png");
			}
			BSTR bsDst = strSaveItem.AllocSysString();
			pImageFile->SaveFile(bsDst, lSaveType);
			SysFreeString(bsDst);
		}
		void SaveImage(IUnknown* punkImage, CImageInfo& oInfo, LONG __width, LONG __height)
		{
			MediaCore::IAVSUncompressedVideoFrame* pFrame = NULL;
			punkImage->QueryInterface(MediaCore::IID_IAVSUncompressedVideoFrame, (void**)&pFrame);

			if (NULL == pFrame)
				return;

			LONG lWidth		= 0;
			LONG lHeight	= 0;
			pFrame->get_Width(&lWidth);
			pFrame->get_Height(&lHeight);

			oInfo.m_eType = GetImageType(pFrame);

			RELEASEINTERFACE(pFrame);

			OfficeCore::IImageGdipFilePtr pImageFile;
			pImageFile.CreateInstance(OfficeCore::CLSID_CImageGdipFile);
			pImageFile->put_Frame(punkImage);

			LONG lMaxSize = min(max(lWidth, lHeight), m_lMaxSizeImage);

			if ((lWidth > lMaxSize) || (lHeight > lMaxSize))
			{
				LONG lW = 0;
				LONG lH = 0;
				double dAspect = (double)lWidth / lHeight;

				if (lWidth >= lHeight)
				{
					lW = lMaxSize;
					lH = (LONG)((double)lW / dAspect);
				}
				else
				{
					lH = lMaxSize;
					lW = (LONG)(dAspect * lH);
				}

				pImageFile->Resize(lW, lH, 3);
			}

			LONG lSaveType = 4;
			CString strSaveItem = _T("");
			strSaveItem.Format(_T("\\image%d."), oInfo.m_lID);
			if (itJPG == oInfo.m_eType)
			{
				strSaveItem = m_strDstMedia + strSaveItem + _T("jpg");
				lSaveType = 3;
			}
			else
			{				
				strSaveItem = m_strDstMedia + strSaveItem + _T("png");
			}
			BSTR bsDst = strSaveItem.AllocSysString();
			pImageFile->SaveFile(bsDst, lSaveType);
			SysFreeString(bsDst);
		}
#else
		void SaveImage(CString& strFileSrc, CImageInfo& oInfo, LONG __width, LONG __height)
		{
			CString strLoadXml = _T("<transforms><ImageFile-LoadImage sourcepath=\"") + strFileSrc + _T("\"/></transforms>");

			ImageStudio::IImageTransforms* pTransform = NULL;
			CoCreateInstance(ImageStudio::CLSID_ImageTransforms, NULL, CLSCTX_INPROC_SERVER, ImageStudio::IID_IImageTransforms, (void**)&pTransform);

			VARIANT_BOOL vbRes = VARIANT_FALSE;
			BSTR bsLoad = strLoadXml.AllocSysString();
			pTransform->SetXml(bsLoad, &vbRes);
			SysFreeString(bsLoad);

			pTransform->Transform(&vbRes);

			VARIANT var;
			var.punkVal = NULL;
			pTransform->GetResult(0, &var);

			if (NULL == var.punkVal)
			{
				RELEASEINTERFACE(pTransform);
				return;
			}

			MediaCore::IAVSUncompressedVideoFrame* pFrame = NULL;
			var.punkVal->QueryInterface(MediaCore::IID_IAVSUncompressedVideoFrame, (void**)&pFrame);

			RELEASEINTERFACE((var.punkVal));

			if (NULL == pFrame)
			{
				RELEASEINTERFACE(pTransform);
				return;
			}

			LONG lWidth		= 0;
			LONG lHeight	= 0;
			pFrame->get_Width(&lWidth);
			pFrame->get_Height(&lHeight);

			oInfo.m_eType = GetImageType(pFrame);

			RELEASEINTERFACE(pFrame);

			CString strSaveItem = _T("");
			strSaveItem.Format(_T("\\image%d."), oInfo.m_lID);
			if (itJPG == oInfo.m_eType)
			{
				strSaveItem = _T("<ImageFile-SaveAsJpeg destinationpath=\"") + m_strDstMedia + strSaveItem + _T("jpg\" format=\"888\"/>");
			}
			else
			{
				strSaveItem = _T("<ImageFile-SaveAsPng destinationpath=\"") + m_strDstMedia + strSaveItem + _T("png\" format=\"888\"/>");
			}

			CString strXml = _T("");

			LONG lMaxSize = min(max(lWidth, lHeight), m_lMaxSizeImage);

			if ((lWidth <= lMaxSize) && (lHeight <= lMaxSize))
			{
				strXml = _T("<transforms>") + strSaveItem + _T("</transforms>");
			}
			else
			{
				LONG lW = 0;
				LONG lH = 0;
				double dAspect = (double)lWidth / lHeight;

				if (lWidth >= lHeight)
				{
					lW = lMaxSize;
					lH = (LONG)((double)lW / dAspect);
				}
				else
				{
					lH = lMaxSize;
					lW = (LONG)(dAspect * lH);
				}

				CString strResize = _T("");
				strResize.Format(_T("<ImageTransform-TransformResize type=\"65536\" width=\"%d\" height=\"%d\"/>"), lW, lH);

				strXml = _T("<transforms>") + strResize + strSaveItem + _T("</transforms>");
			}
			
			VARIANT_BOOL vbSuccess = VARIANT_FALSE;
			BSTR bsXml = strXml.AllocSysString();
			pTransform->SetXml(bsXml, &vbSuccess);
			SysFreeString(bsXml);

			pTransform->Transform(&vbSuccess);

			RELEASEINTERFACE(pTransform);
		}
		void SaveImage(IUnknown* punkImage, CImageInfo& oInfo, LONG __width, LONG __height)
		{
			MediaCore::IAVSUncompressedVideoFrame* pFrame = NULL;
			punkImage->QueryInterface(MediaCore::IID_IAVSUncompressedVideoFrame, (void**)&pFrame);

			if (NULL == pFrame)
				return;

			LONG lWidth		= 0;
			LONG lHeight	= 0;
			pFrame->get_Width(&lWidth);
			pFrame->get_Height(&lHeight);

			oInfo.m_eType = GetImageType(pFrame);

			RELEASEINTERFACE(pFrame);
			
			ImageStudio::IImageTransforms* pTransform = NULL;
			CoCreateInstance(ImageStudio::CLSID_ImageTransforms, NULL ,CLSCTX_INPROC_SERVER, ImageStudio::IID_IImageTransforms, (void**)&pTransform);

			VARIANT var;
			var.vt = VT_UNKNOWN;
			var.punkVal = punkImage;
			pTransform->SetSource(0, var);

			CString strSaveItem = _T("");
			strSaveItem.Format(_T("\\image%d."), oInfo.m_lID);
			if (itJPG == oInfo.m_eType)
			{
				strSaveItem = _T("<ImageFile-SaveAsJpeg destinationpath=\"") + m_strDstMedia + strSaveItem + _T("jpg\" format=\"888\"/>");
			}
			else
			{
				strSaveItem = _T("<ImageFile-SaveAsPng destinationpath=\"") + m_strDstMedia + strSaveItem + _T("png\" format=\"888\"/>");
			}

			LONG lMaxSize = min(max(__width, __height), m_lMaxSizeImage);

			CString strXml = _T("");
			if ((lWidth <= lMaxSize) && (lHeight <= lMaxSize))
			{
				strXml = _T("<transforms>") + strSaveItem + _T("</transforms>");
			}
			else
			{
				LONG lW = 0;
				LONG lH = 0;
				double dAspect = (double)lWidth / lHeight;

				if (lWidth >= lHeight)
				{
					lW = lMaxSize;
					lH = (LONG)((double)lW / dAspect);
				}
				else
				{
					lH = lMaxSize;
					lW = (LONG)(dAspect * lH);
				}

				CString strResize = _T("");
				strResize.Format(_T("<ImageTransform-TransformResize type=\"65536\" width=\"%d\" height=\"%d\"/>"), lW, lH);

				strXml = _T("<transforms>") + strResize + strSaveItem + _T("</transforms>");
			}
			
			VARIANT_BOOL vbSuccess = VARIANT_FALSE;
			BSTR bsXml = strXml.AllocSysString();
			pTransform->SetXml(bsXml, &vbSuccess);
			SysFreeString(bsXml);

			pTransform->Transform(&vbSuccess);

			RELEASEINTERFACE(pTransform);
		}
#endif

		CImageInfo GenerateImageID(IUnknown* punkData, double dWidth, double dHeight)
		{
			CImageInfo oInfo;

			if (NULL == punkData)
				return oInfo;

			LONG lWidth		= (LONG)(dWidth * 96 / 25.4);
			LONG lHeight	= (LONG)(dHeight * 96 / 25.4);

			MediaCore::IAVSUncompressedVideoFrame* pFrame = NULL;
			punkData->QueryInterface(MediaCore::IID_IAVSUncompressedVideoFrame, (void**)&pFrame);

			BYTE* pBuffer = NULL;
			LONG lLen = 0;

			pFrame->get_Buffer(&pBuffer);
			pFrame->get_BufferSize(&lLen);

			DWORD dwSum = m_oCRC.Calc(pBuffer, lLen);

			CAtlMap<DWORD, CImageInfo>::CPair* pPair = m_mapImageData.Lookup(dwSum);
			if (NULL == pPair)
			{
				
				++m_lNextIDImage;
				
				oInfo.m_lID = m_lNextIDImage;
				SaveImage(punkData, oInfo, lWidth, lHeight);
				m_mapImageData.SetAt(dwSum, oInfo);
				m_listImages.AddTail(oInfo);
			}
			else
			{
				oInfo = pPair->m_value;
			}

			RELEASEINTERFACE(pFrame);

			return oInfo;
		}

		CImageInfo GenerateImageID(CString& strFileName, double dWidth, double dHeight)
		{
			CImageInfo oInfo;
			CAtlMap<CString, CImageInfo>::CPair* pPair = m_mapImagesFile.Lookup(strFileName);

			LONG lWidth		= (LONG)(dWidth * 96 / 25.4);
			LONG lHeight	= (LONG)(dHeight * 96 / 25.4);

			if (NULL == pPair)
			{
#ifdef BUILD_CONFIG_FULL_VERSION
				LONG lImageType = m_oExt.GetImageType(strFileName);

				if (1 == lImageType || 2 == lImageType)
				{
					++m_lNextIDImage;
					oInfo.m_lID = m_lNextIDImage;
					oInfo.m_eType = (1 == lImageType) ? itWMF : itEMF;

					CString strSaveItem = _T("");
					strSaveItem.Format(_T("\\image%d."), oInfo.m_lID);
					strSaveItem = m_strDstMedia + strSaveItem;

					double dKoef = 100 * 96 / 25.4;
					bool bIsSuccess = m_oExt.Convert(strFileName, LONG(dWidth * dKoef), LONG(dHeight * dKoef), strSaveItem + _T("svg"));
					if (bIsSuccess)
					{
						if (itWMF == lImageType)
						{
							CDirectory::CopyFile(strFileName, strSaveItem + _T("wmf"), NULL, NULL);
						}
						else
						{
							CDirectory::CopyFile(strFileName, strSaveItem + _T("emf"), NULL, NULL);
						}

						m_mapImagesFile.SetAt(strFileName, oInfo);
						m_listImages.AddTail(oInfo);
						return oInfo;
					}
					else
					{
						--m_lNextIDImage;
						oInfo.m_eType = itJPG;
					}
				}
#endif

				
				++m_lNextIDImage;
				
				oInfo.m_lID = m_lNextIDImage;
				SaveImage(strFileName, oInfo, lWidth, lHeight);
				m_mapImagesFile.SetAt(strFileName, oInfo);
				m_listImages.AddTail(oInfo);
			}
			else
			{
				oInfo = pPair->m_value;
			}

			return oInfo;
		}

		CImageInfo GenerateImageID_2(CString& strFileName, CString& strUrl, double dWidth, double dHeight)
		{
			CImageInfo oInfo;
			LONG lWidth		= (LONG)(dWidth * 96 / 25.4);
			LONG lHeight	= (LONG)(dHeight * 96 / 25.4);

#ifdef BUILD_CONFIG_FULL_VERSION
			LONG lImageType = m_oExt.GetImageType(strFileName);

			if (1 == lImageType || 2 == lImageType)
			{
				++m_lNextIDImage;
				oInfo.m_lID = m_lNextIDImage;
				oInfo.m_eType = (1 == lImageType) ? itWMF : itEMF;

				CString strSaveItem = _T("");
				strSaveItem.Format(_T("\\image%d."), oInfo.m_lID);
				strSaveItem = m_strDstMedia + strSaveItem;

				double dKoef = 100 * 96 / 25.4;
				bool bIsSuccess = m_oExt.Convert(strFileName, LONG(dWidth * dKoef), LONG(dHeight * dKoef), strSaveItem + _T("svg"));
				if (bIsSuccess)
				{
					if (itWMF == lImageType)
					{
						CDirectory::CopyFile(strFileName, strSaveItem + _T("wmf"), NULL, NULL);
					}
					else
					{
						CDirectory::CopyFile(strFileName, strSaveItem + _T("emf"), NULL, NULL);
					}
					m_mapImagesFile.SetAt(strFileName, oInfo);
					m_listImages.AddTail(oInfo);
					return oInfo;
				}
				else
				{
					--m_lNextIDImage;
					oInfo.m_eType = itJPG;
				}
			}
#endif

			
			++m_lNextIDImage;
			
			oInfo.m_lID = m_lNextIDImage;
			SaveImage(strFileName, oInfo, lWidth, lHeight);
			m_mapImagesFile.SetAt(strUrl, oInfo);
			m_listImages.AddTail(oInfo);
			
			return oInfo;
		}

		ImageType GetImageType(MediaCore::IAVSUncompressedVideoFrame* pFrame)
		{
			if (2 == m_lDstFormat)
				return itJPG;

			LONG lWidth		= 0;
			LONG lHeight	= 0;
			BYTE* pBuffer	= NULL;

			pFrame->get_Width(&lWidth);
			pFrame->get_Height(&lHeight);
			pFrame->get_Buffer(&pBuffer);

			BYTE* pBufferMem = pBuffer + 3;
			LONG lCountPix = lWidth * lHeight;

			for (LONG i = 0; i < lCountPix; ++i, pBufferMem += 4)
			{
				if (255 != *pBufferMem)
					return itPNG;
			}
			return itJPG;
		}

		void FlipY(IUnknown* punkImage)
		{
			if (NULL == punkImage)
				return;

			MediaCore::IAVSUncompressedVideoFrame* pFrame = NULL;
			punkImage->QueryInterface(MediaCore::IID_IAVSUncompressedVideoFrame, (void**)&pFrame);

			if (NULL == pFrame)
				return;

			BYTE* pBuffer	= NULL;
			LONG lWidth		= 0;
			LONG lHeight	= 0;
			LONG lStride	= 0;

			pFrame->get_Buffer(&pBuffer);
			pFrame->get_Width(&lWidth);
			pFrame->get_Height(&lHeight);
			pFrame->get_Stride(0, &lStride);

			if (lStride < 0)
				lStride = -lStride;
			
			if ((lWidth * 4) != lStride)
			{
				RELEASEINTERFACE(pFrame);
				return;
			}

			BYTE* pBufferMem = new BYTE[lStride];

			BYTE* pBufferEnd = pBuffer + lStride * (lHeight - 1);

			LONG lCountV = lHeight / 2;

			for (LONG lIndexV = 0; lIndexV < lCountV; ++lIndexV)
			{
				memcpy(pBufferMem, pBuffer, lStride);
				memcpy(pBuffer, pBufferEnd, lStride);
				memcpy(pBufferEnd, pBufferMem, lStride);
				
				pBuffer		+= lStride;
				pBufferEnd	-= lStride;
			}

			RELEASEARRAYOBJECTS(pBufferMem);
			RELEASEINTERFACE(pFrame);
		}

		void FlipX(IUnknown* punkImage)
		{
			if (NULL == punkImage)
				return;

			MediaCore::IAVSUncompressedVideoFrame* pFrame = NULL;
			punkImage->QueryInterface(MediaCore::IID_IAVSUncompressedVideoFrame, (void**)&pFrame);

			if (NULL == pFrame)
				return;

			BYTE* pBuffer	= NULL;
			LONG lWidth		= 0;
			LONG lHeight	= 0;
			LONG lStride	= 0;

			pFrame->get_Buffer(&pBuffer);
			pFrame->get_Width(&lWidth);
			pFrame->get_Height(&lHeight);
			pFrame->get_Stride(0, &lStride);

			if (lStride < 0)
				lStride = -lStride;
			
			if ((lWidth * 4) != lStride)
			{
				RELEASEINTERFACE(pFrame);
				return;
			}

			DWORD* pBufferDWORD	= (DWORD*)pBuffer;

			LONG lW2 = lWidth / 2;
			for (LONG lIndexV = 0; lIndexV < lHeight; ++lIndexV)
			{
				DWORD* pMem1 = pBufferDWORD;
				DWORD* pMem2 = pBufferDWORD + lWidth - 1;
				
				LONG lI = 0;
				while (lI < lW2)
				{
					DWORD dwMem = *pMem1;
					*pMem1++ = *pMem2;
					*pMem2-- = dwMem;
				}
			}

			RELEASEINTERFACE(pFrame);
		}
	};	
}
