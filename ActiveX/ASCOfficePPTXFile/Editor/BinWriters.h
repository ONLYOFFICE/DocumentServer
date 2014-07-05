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
#include "../../Common/DocxFormat/Source/Base/Nullable.h"
#include "BinReaderWriterDefines.h"

#ifndef AVSINLINE
#if defined(_MSC_VER)
#define AVSINLINE __forceinline
#else
#define AVSINLINE inline
#endif
#endif

#include "../../../../../Common/Base64.h"
#include "ImageManager.h"
#include "./XmlWriter.h"
#include "../PPTXFormat/FileContainer.h"
#include "../PPTXFormat/DocxFormat/WritingElement.h"

namespace NSBinPptxRW
{	
	#define MAX_STACK_SIZE 1024

	#define BYTE_SIZEOF		sizeof(BYTE)
	#define USHORT_SIZEOF	sizeof(USHORT)
	#define ULONG_SIZEOF	sizeof(ULONG)
	#define INT_SIZEOF		sizeof(int)

	#define CHAR_SIZEOF		sizeof(CHAR)
	#define SHORT_SIZEOF	sizeof(SHORT)
	#define LONG_SIZEOF		sizeof(LONG)

	#define DOUBLE_MAIN		10000

	inline LONG __strlen(const char* str)
	{
		const char* s = str;
		for (; *s != 0; ++s);
		return (LONG)(s - str);
	}
	inline LONG __wstrlen(const wchar_t* str)
	{
		const wchar_t* s = str;
		for (; *s != 0; ++s);
		return (LONG)(s - str);
	}


	class CMasterSlideInfo
	{
	public:
		CMasterSlideInfo() : m_arLayoutIndexes(), m_arLayoutImagesBase64()
		{
			m_lThemeIndex = 0;
			m_strImageBase64 = "";
		}

	public:
		LONG m_lThemeIndex;
		CStringA m_strImageBase64;

		CAtlArray<LONG> m_arLayoutIndexes;
		CAtlArray<CStringA> m_arLayoutImagesBase64;
	};

	class CCommonWriter
	{
	public:
		CAtlMap<size_t, LONG> themes;
		CAtlMap<size_t, LONG> slideMasters;
		CAtlMap<size_t, LONG> slides;
		CAtlMap<size_t, LONG> layouts;
		CAtlMap<size_t, LONG> notes;
		CAtlMap<size_t, LONG> notesMasters;		

		CAtlArray<CMasterSlideInfo> m_oRels;
		CAtlArray<LONG> m_oSlide_Layout_Rels;

		NSShapeImageGen::CImageManager	m_oImageManager;
		
		

		NSFontCutter::CFontDstManager*	m_pNativePicker;
		IOfficeFontPicker*				m_pFontPicker;

	public:
		CCommonWriter()
		{
			m_pNativePicker = NULL;
			m_pFontPicker = NULL;
		}
		~CCommonWriter()
		{
			m_pNativePicker = NULL;
			RELEASEINTERFACE(m_pFontPicker);
		}

	public:
		void CreateFontPicker(IOfficeFontPicker* pPicker)
		{
			RELEASEINTERFACE(m_pFontPicker);
			m_pNativePicker = NULL;
			if (pPicker != NULL)
			{
				m_pFontPicker = pPicker;
				ADDREFINTERFACE(m_pFontPicker);
			}

			if (NULL == m_pFontPicker)
			{
				CoCreateInstance(__uuidof(COfficeFontPicker), NULL, CLSCTX_ALL, __uuidof(IOfficeFontPicker), (void**)&m_pFontPicker);
			}
			VARIANT var;
			m_pFontPicker->GetAdditionalParam(L"NativePicker", &var);

			m_pNativePicker = (NSFontCutter::CFontDstManager*)var.pvRecord;
		}
		void CheckFontPicker()
		{
			if (NULL == m_pFontPicker)
				CreateFontPicker(NULL);
		}
	};

	class CImageManager2
	{
	private:
		CAtlMap<CString, CString>	m_mapImages;
		LONG						m_lIndexNextImage;
		CString						m_strDstMedia;

	public:
		BOOL						m_bIsWord;

	public:
		CImageManager2() : m_mapImages(), m_lIndexNextImage(0)
		{
			m_bIsWord = FALSE;
		}
		~CImageManager2()
		{
		}
		AVSINLINE void Clear()
		{
			m_mapImages.RemoveAll();
			m_lIndexNextImage = 0;
		}
		AVSINLINE void SetDstMedia(const CString& strDst)
		{
			m_strDstMedia = strDst;
		}
		AVSINLINE CString GetDstMedia()
		{
			return m_strDstMedia;
		}

	public:
		template <typename T>
		void Serialize(T* pWriter)
		{
			pWriter->WriteBYTE(m_bIsWord ? 1 : 0);
			pWriter->WriteINT(m_lIndexNextImage);
			pWriter->WriteString(m_strDstMedia);
			
			int lCount = (int)m_mapImages.GetCount();
			pWriter->WriteINT(lCount);

			POSITION pos = m_mapImages.GetStartPosition();
			while (NULL != pos)
			{
				CAtlMap<CString, CString>::CPair* pPair = m_mapImages.GetNext(pos);

				pWriter->WriteString(pPair->m_key);
				pWriter->WriteString(pPair->m_value);
			}
		}

		template <typename T>
		void Deserialize(T* pReader)
		{
			m_bIsWord = ((true == pReader->GetBool()) ? TRUE : FALSE);
			m_lIndexNextImage = pReader->GetLong();
			m_strDstMedia = pReader->GetString2();

			m_mapImages.RemoveAll();
			LONG lCount = pReader->GetLong();

			for (LONG i = 0; i < lCount; ++i)
			{
				CString s1 = pReader->GetString2();
				CString s2 = pReader->GetString2();

				m_mapImages.SetAt(s1, s2);
			}
		}

	public:
		AVSINLINE CString GenerateImage(const CString& strInput, CString strBase64Image = _T(""))
		{
			CAtlMap<CString, CString>::CPair* pPair = NULL;

			if (_T("") == strBase64Image)
				pPair = m_mapImages.Lookup(strInput);
			else 
				pPair = m_mapImages.Lookup(strBase64Image);

			if (NULL != pPair)
				return pPair->m_value;

			if (IsNeedDownload(strInput))
				return DownloadImage(strInput);

			CString strExts = _T(".jpg");
			int nIndexExt = strInput.ReverseFind(TCHAR('.'));
			if (-1 != nIndexExt)
				strExts = strInput.Mid(nIndexExt);

			if (strExts == _T(".tmp"))
				strExts = _T(".png");

			CString strMetafileImage = _T("");
			if (strExts == _T(".svg"))
			{
				OOX::CPath oPath = strInput;
				CString strFolder = oPath.GetDirectory();
				CString strFileName = oPath.GetFilename();

				strFileName.Delete(strFileName.GetLength() - 4, 4);

				CString str1 = strFolder + strFileName + _T(".emf");
				CString str2 = strFolder + strFileName + _T(".wmf");

				if (OOX::CSystemUtility::IsFileExist(str1))
				{
					strMetafileImage = str1;
					strExts = _T(".emf");
				}
				else if (OOX::CSystemUtility::IsFileExist(str2))
				{
					strMetafileImage = str2;
					strExts = _T(".wmf");
				}
			}
			
			CString strImage = _T("");
			if ((_T(".jpg") == strExts) || (_T(".jpeg") == strExts) || (_T(".png") == strExts) || (_T(".emf") == strExts) || (_T(".wmf") == strExts))
			{
				strImage.Format(_T("image%d"), m_lIndexNextImage++);

				CString strOutput = m_strDstMedia + _T("\\") + strImage + strExts;	

				if (!m_bIsWord)
					strImage  = _T("../media/") + strImage + strExts;
				else
					strImage  = _T("media/") + strImage + strExts;

				if (_T("") == strBase64Image)
					m_mapImages.SetAt(strInput, strImage);
				else
					m_mapImages.SetAt(strBase64Image, strImage);

				
				if (_T("") != strMetafileImage)
					CDirectory::CopyFile(strMetafileImage, strOutput, NULL, NULL);
				else if (strOutput != strInput)
					CDirectory::CopyFile(strInput, strOutput, NULL, NULL);
			}
			else
			{
				
				strExts = _T(".png");
				strImage.Format(_T("image%d"), m_lIndexNextImage++);

				CString strOutput = m_strDstMedia + _T("\\") + strImage + strExts;		

				if (!m_bIsWord)
					strImage  = _T("../media/") + strImage + strExts;
				else
					strImage  = _T("media/") + strImage + strExts;
	
				if (_T("") == strBase64Image)
					m_mapImages.SetAt(strInput, strImage);
				else
					m_mapImages.SetAt(strBase64Image, strImage);

				SaveImageAsPng(strInput, strOutput);
			}
			return strImage;
		}

		void SaveImageAsPng(const CString& strFileSrc, const CString& strFileDst)
		{
#ifdef BUILD_CONFIG_FULL_VERSION
			CString strLoadXml = _T("<transforms><ImageFile-LoadImage sourcepath=\"") + strFileSrc + 
				_T("\"/><ImageFile-SaveAsPng destinationpath=\"") + strFileDst + _T("\" format=\"888\"/></transforms>");

			ImageStudio::IImageTransforms* pTransform = NULL;
			CoCreateInstance(ImageStudio::CLSID_ImageTransforms, NULL, CLSCTX_INPROC_SERVER, ImageStudio::IID_IImageTransforms, (void**)&pTransform);

			VARIANT_BOOL vbRes = VARIANT_FALSE;
			BSTR bsLoad = strLoadXml.AllocSysString();
			pTransform->SetXml(bsLoad, &vbRes);
			SysFreeString(bsLoad);

			pTransform->Transform(&vbRes);
			RELEASEINTERFACE(pTransform);
#else
			OfficeCore::IImageGdipFilePtr pImageFile;
			pImageFile.CreateInstance(OfficeCore::CLSID_CImageGdipFile);

			BSTR bs1 = strFileSrc.AllocSysString();
			BSTR bs2 = strFileDst.AllocSysString();
			pImageFile->OpenFile(bs1);
			pImageFile->SaveFile(bs2, 4);
			SysFreeString(bs1);
			SysFreeString(bs2);
#endif
		}

		void SaveImageAsJPG(const CString& strFileSrc, const CString& strFileDst)
		{
#ifdef BUILD_CONFIG_FULL_VERSION
			CString strLoadXml = _T("<transforms><ImageFile-LoadImage sourcepath=\"") + strFileSrc + 
				_T("\"/><ImageFile-SaveAsJpeg destinationpath=\"") + strFileDst + _T("\" format=\"888\"/></transforms>");

			ImageStudio::IImageTransforms* pTransform = NULL;
			CoCreateInstance(ImageStudio::CLSID_ImageTransforms, NULL, CLSCTX_INPROC_SERVER, ImageStudio::IID_IImageTransforms, (void**)&pTransform);

			VARIANT_BOOL vbRes = VARIANT_FALSE;
			BSTR bsLoad = strLoadXml.AllocSysString();
			pTransform->SetXml(bsLoad, &vbRes);
			SysFreeString(bsLoad);

			pTransform->Transform(&vbRes);
			RELEASEINTERFACE(pTransform);
#else
			OfficeCore::IImageGdipFilePtr pImageFile;
			pImageFile.CreateInstance(OfficeCore::CLSID_CImageGdipFile);

			BSTR bs1 = strFileSrc.AllocSysString();
			BSTR bs2 = strFileDst.AllocSysString();
			pImageFile->OpenFile(bs1);
			pImageFile->SaveFile(bs2, 3);
			SysFreeString(bs1);
			SysFreeString(bs2);
#endif
		}

		AVSINLINE bool IsNeedDownload(const CString& strFile)
		{
			int n1 = strFile.Find(_T("www"));
			int n2 = strFile.Find(_T("http"));
			int n3 = strFile.Find(_T("ftp"));
			int n4 = strFile.Find(_T("https://"));

			if (((n1 >= 0) && (n1 < 10)) || ((n2 >= 0) && (n2 < 10)) || ((n3 >= 0) && (n3 < 10)) || ((n4 >= 0) && (n4 < 10)))
				return true;
			return false;
		}
		AVSINLINE CString DownloadImage(const CString& strFile)
		{
			CFileDownloader oDownloader(strFile, TRUE);
			oDownloader.Start( 1 );
			while ( oDownloader.IsRunned() )
			{
				::Sleep( 10 );
			}

			if ( oDownloader.IsFileDownloaded() )
			{
				return GenerateImage( oDownloader.GetFilePath(), strFile );
			}
			return _T("");
		}
	};


	class CBinaryFileWriter
	{
	public:
		class CSeekTableEntry
		{
		public:
			LONG Type;
			LONG SeekPos;

		public:
			CSeekTableEntry()
			{
				Type = 0;
				SeekPos = 0;
			}
		};

		CCommonWriter m_oCommon;
		CString m_strMainFolder;

		smart_ptr<PPTX::FileContainer> m_pCommonRels;
		IUnknown* m_pMainDocument;

		smart_ptr<PPTX::FileContainer>	ThemeDoc;
		smart_ptr<OOX::WritingElement>	ClrMapDoc;

	private:
		BYTE*		m_pStreamData;
		BYTE*		m_pStreamCur;
		ULONG		m_lSize;

		ULONG		m_lPosition;
		ULONG		m_arStack[MAX_STACK_SIZE];
		ULONG		m_lStackPosition;
		
		CAtlArray<CSeekTableEntry> m_arMainTables;

	public:
		LONG m_lWidthCurShape;
		LONG m_lHeightCurShape;

	public:
		BYTE* GetBuffer()
		{
			return m_pStreamData;
		}
		ULONG GetPosition()
		{
			return m_lPosition;
		}
		void SetPosition(const ULONG& lPosition)
		{
			m_lPosition = lPosition;
			m_pStreamCur = m_pStreamData + m_lPosition;
		}

		double GetWidthMM()
		{
			if (m_lWidthCurShape == 0)
				return -1;
			return (double)m_lWidthCurShape / 36000;
		}
		double GetHeightMM()
		{
			if (m_lHeightCurShape == 0)
				return -1;
			return (double)m_lHeightCurShape / 36000;
		}
		void ClearShapeCurSizes()
		{
			m_lWidthCurShape = 0;
			m_lHeightCurShape = 0;
		}

		
	public:
		AVSINLINE void Clear()
		{
			m_lSize		= 0;
			m_lPosition = 0;

			m_pStreamData	= NULL;
			m_pStreamCur	= NULL;

			m_lStackPosition = 0;
			memset(m_arStack, 0, MAX_STACK_SIZE * sizeof(ULONG));

			m_lWidthCurShape = 0;
			m_lHeightCurShape = 0;
		}

		AVSINLINE void SetMainDocument(IUnknown* pMainDoc)
		{
			RELEASEINTERFACE(m_pMainDocument);
			m_pMainDocument = pMainDoc;
			ADDREFINTERFACE(m_pMainDocument);
		}

		AVSINLINE void ClearNoAttack()
		{
			m_lPosition = 0;
			m_pStreamCur	= m_pStreamData;

			m_lStackPosition = 0;
			memset(m_arStack, 0, MAX_STACK_SIZE * sizeof(ULONG));
		}

		AVSINLINE void CheckBufferSize(size_t lPlus)
		{
			if (NULL != m_pStreamData)
			{
				size_t nNewSize = m_lPosition + lPlus;

				if (nNewSize >= m_lSize)
				{
					while (nNewSize >= m_lSize)
					{
						m_lSize *= 2;
					}
					
					BYTE* pNew = new BYTE[m_lSize];
					memcpy(pNew, m_pStreamData, m_lPosition);

					RELEASEARRAYOBJECTS(m_pStreamData);
					m_pStreamData = pNew;

					m_pStreamCur = m_pStreamData + m_lPosition;
				}
			}
			else
			{
				m_lSize		= 1024 * 1024; 
				m_pStreamData	= new BYTE[m_lSize];

				m_lPosition = 0;
				m_pStreamCur = m_pStreamData;

				CheckBufferSize(lPlus);
			}
		}

		AVSINLINE void WriteBYTE(const BYTE& lValue)
		{			
			CheckBufferSize(BYTE_SIZEOF);

			*m_pStreamCur = lValue; 
			m_lPosition += BYTE_SIZEOF;
			m_pStreamCur += BYTE_SIZEOF;
		}
		AVSINLINE void WriteUSHORT(const USHORT& lValue)
		{
			CheckBufferSize(USHORT_SIZEOF);

			*((USHORT*)m_pStreamCur) = lValue; 
			m_lPosition += USHORT_SIZEOF;
			m_pStreamCur += USHORT_SIZEOF;
		}
		AVSINLINE void WriteULONG(const ULONG& lValue)
		{
			CheckBufferSize(ULONG_SIZEOF);

			*((ULONG*)m_pStreamCur) = lValue; 
			m_lPosition += ULONG_SIZEOF;
			m_pStreamCur += ULONG_SIZEOF;
		}
		AVSINLINE void WriteINT(const int& lValue)
		{
			CheckBufferSize(INT_SIZEOF);

			*((int*)m_pStreamCur) = lValue; 
			m_lPosition += INT_SIZEOF;
			m_pStreamCur += INT_SIZEOF;
		}
		AVSINLINE void WriteDouble(const double& dValue)
		{
			CheckBufferSize(USHORT_SIZEOF);

			*((ULONG*)m_pStreamCur) = (ULONG)(dValue / DOUBLE_MAIN); 
			m_lPosition += ULONG_SIZEOF;
			m_pStreamCur += ULONG_SIZEOF;
		}
		AVSINLINE void WriteStringW(const WCHAR* sBuffer)
		{
			LONG lSize = __wstrlen(sBuffer);
			LONG lSizeMem = lSize * sizeof(wchar_t);

			CheckBufferSize(ULONG_SIZEOF + lSizeMem);

			*((ULONG*)m_pStreamCur) = lSizeMem; 
			m_lPosition += ULONG_SIZEOF;
			m_pStreamCur += ULONG_SIZEOF;

			memcpy(m_pStreamCur, sBuffer, lSizeMem);
			m_lPosition += lSizeMem;
			m_pStreamCur += lSizeMem;
		}
		AVSINLINE void WriteBYTEArray(const BYTE* pBuffer, size_t len)
		{
			CheckBufferSize(len);
			memcpy(m_pStreamCur, pBuffer, len);
			m_lPosition += (ULONG)len;
			m_pStreamCur += len;
		}
		AVSINLINE void WriteStringA(const char* sBuffer)
		{
			LONG lSize = __strlen(sBuffer);
			LONG lSizeMem = lSize * sizeof(char);

			CheckBufferSize(ULONG_SIZEOF + lSizeMem);

			*((ULONG*)m_pStreamCur) = lSizeMem; 
			m_lPosition += ULONG_SIZEOF;
			m_pStreamCur += ULONG_SIZEOF;

			memcpy(m_pStreamCur, sBuffer, lSizeMem);
			m_lPosition += lSizeMem;
			m_pStreamCur += lSizeMem;
		}
		AVSINLINE void WriteStringA(CStringA& sBuffer)
		{
			char* pChars = sBuffer.GetBuffer();
			WriteStringA(pChars);
		}
		AVSINLINE void WriteStringW(CString& sBuffer)
		{
			WCHAR* pChars = sBuffer.GetBuffer();
			WriteStringW(pChars);
		}
		

	public: 
		CBinaryFileWriter()
		{
			m_strMainFolder = _T("");
			m_pMainDocument = NULL;
			Clear();
		}
		~CBinaryFileWriter()
		{
			RELEASEARRAYOBJECTS(m_pStreamData);
			RELEASEINTERFACE(m_pMainDocument);
		}

		void StartRecord(LONG lType)
		{
			m_arStack[m_lStackPosition] = m_lPosition + 5; 
			m_lStackPosition++;
			WriteBYTE((BYTE)lType);
			WriteULONG(0);
		}
		void EndRecord()
		{
			m_lStackPosition--;
			(*(LONG*)(m_pStreamData + m_arStack[m_lStackPosition] - 4)) = m_lPosition - m_arStack[m_lStackPosition];
		}

		void StartMainRecord(LONG lType)
		{
			CSeekTableEntry oEntry;
			oEntry.Type = lType;
			oEntry.SeekPos = m_lPosition;
			m_arMainTables.Add(oEntry);
			
		}

		void WriteReserved(size_t lCount)
		{
			CheckBufferSize(lCount);
			memset(m_pStreamCur, 0, lCount);
			m_pStreamCur += lCount;
			m_lPosition += (ULONG)lCount;
		}

		void WriteMainPart()
		{
			BYTE* pData = m_pStreamData;
			size_t nCount = m_arMainTables.GetCount();

			for (size_t i = 0; i < nCount; i++)
			{
				*pData = (BYTE)m_arMainTables[i].Type;
				++pData;
				*((LONG*)pData) = m_arMainTables[i].SeekPos;
				pData += 4;
			}
		}

	public:
		
		void WriteString1(int type, const CString& val)
		{
			BYTE bType = (BYTE)type;
			WriteBYTE(bType);

			ULONG len = (ULONG)val.GetLength();
			WriteULONG(len);

			len <<= 1;

			CString* s = const_cast<CString*>(&val);
			CheckBufferSize(len);

			memcpy(m_pStreamCur, s->GetBuffer(), len);
			m_pStreamCur += len;
			m_lPosition += len;
		}
		void WriteString2(int type, const NSCommon::nullable_string& val)
		{
			if (val.is_init())
				WriteString1(type, *val);
		}
		void WriteString(const CString& val)
		{
			ULONG len = (ULONG)val.GetLength();
			WriteULONG(len);

			len <<= 1;

			CString* s = const_cast<CString*>(&val);
			CheckBufferSize(len);

			memcpy(m_pStreamCur, s->GetBuffer(), len);
			m_pStreamCur += len;
			m_lPosition += len;
		}

		void WriteString1Data(int type, const WCHAR* pData, ULONG len)
		{
			BYTE bType = (BYTE)type;
			WriteBYTE(bType);

			WriteULONG(len);

			len <<= 1;

			CheckBufferSize(len);

			memcpy(m_pStreamCur, (BYTE*)pData, len);
			m_pStreamCur += len;
			m_lPosition += len;
		}

		void WriteBool1(int type, const bool& val)
		{
			BYTE bType = (BYTE)type;
			WriteBYTE(bType);
			WriteBYTE((val == true) ? 1 : 0);
		}
		void WriteBool2(int type, const NSCommon::nullable_bool& val)
		{
			if (val.is_init())
				WriteBool1(type, *val);
		}

		void WriteInt1(int type, const int& val)
		{
			BYTE bType = (BYTE)type;
			WriteBYTE(bType);
			WriteINT(val);
		}
		void WriteInt2(int type, const NSCommon::nullable_int& val)
		{
			if (val.is_init())
				WriteInt1(type, *val);
		}

		void WriteDouble1(int type, const double& val)
		{
			int _val = (int)(val * 10000);
			WriteInt1(type, _val);
		}
		void WriteDouble2(int type, const NSCommon::nullable_double& val)
		{
			if (val.is_init())
				WriteDouble1(type, *val);
		}

		void WriteSize_t1(int type, const size_t& val)
		{
			BYTE bType = (BYTE)type;
			WriteBYTE(bType);
			ULONG ival = (ULONG)val;
			WriteULONG(ival);
		}
		void WriteSize_t2(int type, const NSCommon::nullable_sizet& val)
		{
			if (val.is_init())
				WriteSize_t1(type, *val);
		}

		template<typename T>
		void WriteLimit1(int type, const T& val)
		{
			BYTE bType = (BYTE)type;
			WriteBYTE(bType);
			WriteBYTE(val.GetBYTECode());
		}
		template<typename T>
		void WriteLimit2(int type, const T& val)
		{
			if (val.is_init())
				WriteLimit1(type, *val);
		}

		template<typename T>
		void WriteRecord1(int type, const T& val)
		{
			StartRecord(type);
			val.toPPTY(this);
			EndRecord();
		}
		template<typename T>
		void WriteRecord2(int type, const T& val)
		{
			if (val.is_init())
			{
				StartRecord(type);
				val->toPPTY(this);
				EndRecord();
			}
		}

		template<typename T>
		void WriteRecordArray(int type, int subtype, const CAtlArray<T>& val)
		{
			StartRecord(type);

			ULONG len = (ULONG)val.GetCount();
			WriteULONG(len);

			for (ULONG i = 0; i < len; ++i)
				WriteRecord1(subtype, val[i]);

			EndRecord();
		}

		void GetBase64File(const CString& sFile, CStringA& strDst64)
		{
			CFile oFile;
			HRESULT hr = oFile.OpenFile(sFile);

			if (S_OK != hr)
			{
				strDst64 = "";
				return;
			}

			DWORD dwLen = (DWORD)oFile.GetFileSize();
			BYTE* pBuffer = new BYTE[dwLen];

			oFile.SetPosition(0);
			oFile.ReadFile(pBuffer, dwLen);

			int nBase64BufferLen = Base64::Base64EncodeGetRequiredLength((int)dwLen, Base64::B64_BASE64_FLAG_NOCRLF);
			LPSTR pbBase64Buffer = new CHAR[nBase64BufferLen];
			if (TRUE == Base64::Base64Encode(pBuffer, (int)dwLen, pbBase64Buffer, &nBase64BufferLen, Base64::B64_BASE64_FLAG_NOCRLF))
			{
				strDst64.SetString(pbBase64Buffer, nBase64BufferLen);
			}

			RELEASEARRAYOBJECTS(pBuffer);

			oFile.CloseFile();

			
		}

		void WriteTheme64(LONG lIndex, const CString& sFile)
		{
			GetBase64File(sFile, m_oCommon.m_oRels[lIndex].m_strImageBase64);
		}

		void WriteLayoutTheme64(LONG lIndexTheme, LONG lIndexLayout, const CString& sFile)
		{
			GetBase64File(sFile, m_oCommon.m_oRels[lIndexTheme].m_arLayoutImagesBase64[lIndexLayout]);
		}

		CString GetFolderForGenerateImages()
		{
			return m_strMainFolder + _T("\\extract_themes");
		}

		
		void WriteEmbeddedFonts()
		{
			if (NULL == m_oCommon.m_pNativePicker)
				return;
			
			if (!m_oCommon.m_pNativePicker->m_bIsEmbeddedFonts)
				return;

			StartMainRecord(NSBinPptxRW::NSMainTables::FontsEmbedded);

			
			m_oCommon.m_pNativePicker->m_oEmbeddedFonts.CheckString(_T(".)abcdefghijklmnopqrstuvwxyz"));
			m_oCommon.m_pNativePicker->m_oEmbeddedFonts.CheckFont(_T("Wingdings 3"), m_oCommon.m_pNativePicker->m_pFontManager);
			m_oCommon.m_pNativePicker->m_oEmbeddedFonts.CheckFont(_T("Arial"), m_oCommon.m_pNativePicker->m_pFontManager);

			StartRecord(NSBinPptxRW::NSMainTables::FontsEmbedded);
			m_oCommon.m_pNativePicker->m_oEmbeddedFonts.WriteEmbeddedFonts(this);
			EndRecord();
		}

		
		LPSAFEARRAY Serialize(NSBinPptxRW::CImageManager2* pManager)
		{
			pManager->Serialize(this);
			return GetSafearray();
		}
		LPSAFEARRAY Serialize(NSShapeImageGen::CImageManager* pManager)
		{
			pManager->Serialize(this);
			return GetSafearray();
		}

		AVSINLINE LPSAFEARRAY GetSafearray()
		{			
			ULONG lBinarySize = this->GetPosition();
			if (0 == lBinarySize)
				return NULL;

			SAFEARRAY* pArray = SafeArrayCreateVector(VT_UI1, lBinarySize);
			
			BYTE* pDataD = (BYTE*)pArray->pvData;
			BYTE* pDataS = this->GetBuffer();
			memcpy(pDataD, pDataS, lBinarySize);

			return pArray;
		}
	};

	class CSlideMasterInfo
	{
	public:
		LONG			m_lThemeIndex;
		CAtlArray<LONG> m_arLayouts;

	public:
		CSlideMasterInfo() : m_arLayouts()
		{
			m_lThemeIndex = -1;				
		}
		CSlideMasterInfo(const CSlideMasterInfo& oSrc)
		{
			m_lThemeIndex	= oSrc.m_lThemeIndex;
			m_arLayouts.Copy(oSrc.m_arLayouts);
		}
	};

	class CRelsGenerator
	{
	private:
		CStringWriter m_oWriter;
		int									m_lNextRelsID;
		CAtlMap<CString, int>				m_mapImages;

		CAtlMap<CString, int>				m_mapLinks;

	public:
		CImageManager2*						m_pManager;

	public:
		CRelsGenerator(CImageManager2* pManager = NULL) : m_oWriter(), m_lNextRelsID(1), m_mapImages()
		{
			m_pManager = pManager;
		}
		~CRelsGenerator()
		{
		}
		AVSINLINE void Clear()
		{
			m_oWriter.ClearNoAttack();
			m_lNextRelsID = 1;
			m_mapImages.RemoveAll();
			m_mapLinks.RemoveAll();
		}

		AVSINLINE void StartRels()
		{
			m_oWriter.WriteString(_T("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>"));
			m_oWriter.WriteString(_T("<Relationships xmlns=\"http://schemas.openxmlformats.org/package/2006/relationships\">"));
		}

		AVSINLINE void StartTheme()
		{
			m_oWriter.WriteString(_T("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>"));
			m_oWriter.WriteString(_T("<Relationships xmlns=\"http://schemas.openxmlformats.org/package/2006/relationships\">"));
		}

		AVSINLINE void StartMaster(int nIndexTheme, const CSlideMasterInfo& oInfo)
		{
			m_oWriter.WriteString(_T("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>"));
			m_oWriter.WriteString(_T("<Relationships xmlns=\"http://schemas.openxmlformats.org/package/2006/relationships\">"));

			int nCountLayouts = (int)oInfo.m_arLayouts.GetCount();
			for (int i = 0; i < nCountLayouts; ++i)
			{
				CString str = _T("");
				str.Format(_T("<Relationship Id=\"rId%d\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout\" Target=\"../slideLayouts/slideLayout%d.xml\"/>"), 
					m_lNextRelsID++, oInfo.m_arLayouts[i] + 1);
				m_oWriter.WriteString(str);
			}

			CString s = _T("");
			s.Format(_T("<Relationship Id=\"rId%d\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme\" Target=\"../theme/theme%d.xml\"/>" ),
				m_lNextRelsID++, nIndexTheme + 1);
			m_oWriter.WriteString(s);
		}
		AVSINLINE void StartLayout(int nIndexTheme)
		{
			m_oWriter.WriteString(_T("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>"));
			m_oWriter.WriteString(_T("<Relationships xmlns=\"http://schemas.openxmlformats.org/package/2006/relationships\">"));

			CString str = _T("");
			str.Format(_T("<Relationship Id=\"rId%d\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster\" Target=\"../slideMasters/slideMaster%d.xml\"/>"), 
				m_lNextRelsID++, nIndexTheme + 1);
			m_oWriter.WriteString(str);
		}
		AVSINLINE void StartSlide(int nIndexSlide, int nIndexLayout)
		{
			m_oWriter.WriteString(_T("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>"));
			m_oWriter.WriteString(_T("<Relationships xmlns=\"http://schemas.openxmlformats.org/package/2006/relationships\">"));

			CString str = _T("");
			str.Format(_T("<Relationship Id=\"rId%d\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout\" Target=\"../slideLayouts/slideLayout%d.xml\"/>"), 
				m_lNextRelsID++, nIndexLayout + 1);
			m_oWriter.WriteString(str);

			str = _T("");
			str.Format(_T("<Relationship Id=\"rId%d\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/notesSlide\" Target=\"../notesSlides/notesSlide%d.xml\"/>"), m_lNextRelsID++, nIndexSlide + 1);
			m_oWriter.WriteString(str);
		}
		AVSINLINE void StartNote(int nIndexSlide)
		{
			m_oWriter.WriteString(_T("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\" ?>"));
			m_oWriter.WriteString(_T("<Relationships xmlns=\"http://schemas.openxmlformats.org/package/2006/relationships\">"));

			CString sNum = _T("");
			sNum.Format(_T("%d"), nIndexSlide + 1);
			CString strNoteSlideRels = _T("<Relationship Id=\"rId2\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide\" Target=\"../slides/slide") + sNum + _T(".xml\"/>");

			m_oWriter.WriteString(strNoteSlideRels);
			m_oWriter.WriteString(_T("<Relationship Id=\"rId1\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/notesMaster\" Target=\"../notesMasters/notesMaster1.xml\"/>"));

			m_lNextRelsID = 3;
		}
		AVSINLINE void WriteMasters(int nCount)
		{
			for (int i = 0; i < nCount; ++i)
			{
				CString strRels = _T("");
				strRels.Format(_T("<Relationship Id=\"rId%d\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster\" Target=\"slideMasters/slideMaster%d.xml\" />"), m_lNextRelsID++, i + 1);
				m_oWriter.WriteString(strRels);
			}
		}
		AVSINLINE void WriteThemes(int nCount)
		{
			for (int i = 0; i < nCount; ++i)
			{
				CString strRels = _T("");
				strRels.Format(_T("<Relationship Id=\"rId%d\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme\" Target=\"theme/theme%d.xml\" />"), m_lNextRelsID++, i + 1);
				m_oWriter.WriteString(strRels);
			}
		}
		AVSINLINE void WriteSlides(int nCount)
		{
			for (int i = 0; i < nCount; ++i)
			{
				CString strRels = _T("");
				strRels.Format(_T("<Relationship Id=\"rId%d\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide\" Target=\"slides/slide%d.xml\" />"), m_lNextRelsID++, i + 1);
				m_oWriter.WriteString(strRels);
			}
		}
		AVSINLINE void WriteSlideComments(int nComment)
		{
			CString strRels = _T("");
			strRels.Format(_T("<Relationship Id=\"rId%d\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/comments\" Target=\"../comments/comment%d.xml\"/>"), m_lNextRelsID++, nComment);
			m_oWriter.WriteString(strRels);
		}
		AVSINLINE void EndPresentationRels(const bool& bIsCommentsAuthors = false)
		{
			CString strRels0 = _T("");
			strRels0.Format(_T("<Relationship Id=\"rId%d\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/notesMaster\" Target=\"notesMasters/notesMaster1.xml\"/>"), m_lNextRelsID++);
			CString strRels1 = _T("");
			strRels1.Format(_T("<Relationship Id=\"rId%d\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/presProps\" Target=\"presProps.xml\" />"), m_lNextRelsID++);
			CString strRels2 = _T("");
			strRels2.Format(_T("<Relationship Id=\"rId%d\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/tableStyles\" Target=\"tableStyles.xml\" />"), m_lNextRelsID++);
			CString strRels3 = _T("");
			strRels3.Format(_T("<Relationship Id=\"rId%d\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/viewProps\" Target=\"viewProps.xml\" />"), m_lNextRelsID++);

			m_oWriter.WriteString(strRels0);			
			m_oWriter.WriteString(strRels1);
			m_oWriter.WriteString(strRels2);
			m_oWriter.WriteString(strRels3);

			if (bIsCommentsAuthors)
			{
				CString strRels4 = _T("");
				strRels4.Format(_T("<Relationship Id=\"rId%d\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/commentAuthors\" Target=\"commentAuthors.xml\"/>"), m_lNextRelsID++);
				m_oWriter.WriteString(strRels4);
			}
		}
		AVSINLINE int GetNextId()
		{
			return m_lNextRelsID;
		}
		AVSINLINE void CloseRels()
		{
			m_oWriter.WriteString(_T("</Relationships>"));
		}
		AVSINLINE void AddRels(const CString& strRels)
		{
			m_oWriter.WriteString(strRels);			
		}
		AVSINLINE void SaveRels(const CString& strFile)
		{
			CFile oFile;
			oFile.CreateFile(strFile);
			CString strMem = m_oWriter.GetData();
			oFile.WriteStringUTF8(strMem);
			oFile.CloseFile();
		}

		AVSINLINE int WriteImage(const CString& strImagePath, CString strBase64Image = _T(""))
		{
			CString strImage = m_pManager->GenerateImage(strImagePath, strBase64Image);
			CAtlMap<CString, int>::CPair* pPair = m_mapImages.Lookup(strImage);

			if (NULL != pPair)
			{
				return pPair->m_value;				
			}

			m_mapImages.SetAt(strImage, m_lNextRelsID);
			CString strRid = _T("");
			strRid.Format(_T("rId%d"), m_lNextRelsID++);

			CString strRels = _T("");
			strRels.Format(_T("<Relationship Id=\"%s\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/image\" Target=\"%s\"/>"),
				strRid, strImage);
			m_oWriter.WriteString(strRels);

			return m_lNextRelsID - 1;
		}
		AVSINLINE int WriteChart(int nChartNumber, LONG lDocType = XMLWRITER_DOC_TYPE_PPTX)
		{
			CString strChart = _T("");

			if (lDocType == XMLWRITER_DOC_TYPE_DOCX)
			{
				strChart.Format(_T("charts/chart%d.xml"), nChartNumber);
			}
			else
			{
				strChart.Format(_T("../charts/chart%d.xml"), nChartNumber);
			}
			
			CString strRid = _T("");
			strRid.Format(_T("rId%d"), m_lNextRelsID++);

			CString strRels = _T("");
			strRels.Format(_T("<Relationship Id=\"%s\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/chart\" Target=\"%s\"/>"),
				strRid, strChart);
			m_oWriter.WriteString(strRels);

			return m_lNextRelsID - 1;
		}	

		AVSINLINE int WriteRels(const BSTR& bsType, const BSTR& bsTarget, const BSTR& bsTargetMode)
		{
			CString strRid = _T("");
			strRid.Format(_T("rId%d"), m_lNextRelsID++);

			CString strType = _T("Type=\"") + (CString)bsType + _T("\" ");
			CString strTarget = _T("Target=\"") + (CString)bsTarget + _T("\" ");
			CString strTargetMode = (NULL == bsTargetMode) ? _T("") : (_T("TargetMode=\"") + (CString)bsTargetMode + _T("\""));

			CString strRels = _T("<Relationship Id=\"") + strRid + _T("\" ") + strType + strTarget + strTargetMode + _T("/>");
			m_oWriter.WriteString(strRels);
			return m_lNextRelsID - 1;
		}

		AVSINLINE int WriteHyperlink(const CString& strLink, const bool& bIsActionInit)
		{
			CAtlMap<CString, int>::CPair* pPair = m_mapLinks.Lookup(strLink);

			if (NULL != pPair)
			{
				return pPair->m_value;				
			}

			m_mapLinks.SetAt(strLink, m_lNextRelsID);
			CString strRid = _T("");
			strRid.Format(_T("rId%d"), m_lNextRelsID++);

			CString sLink = strLink;
			sLink.Replace(L"&",	L"&amp;");
			sLink.Replace(L"'",	L"&apos;");
			sLink.Replace(L"<",	L"&lt;");
			sLink.Replace(L">",	L"&gt;");
			sLink.Replace(L"\"",L"&quot;");

			bool bIsSlide = (0 == sLink.Find(_T("slide")));
			if (!bIsActionInit)
				bIsSlide = false;

			CString strRels = _T("");

			if (!bIsSlide)
			{
				strRels.Format(_T("<Relationship Id=\"%s\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink\" Target=\"%s\" TargetMode=\"External\"/>"),
					strRid, sLink);
			}
			else
			{
				strRels.Format(_T("<Relationship Id=\"%s\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide\" Target=\"%s\"/>"), 
					strRid ,sLink);
			}

			m_oWriter.WriteString(strRels);

			return m_lNextRelsID - 1;
		}		
	};

	class CBinaryFileReader
	{
	private:
		BYTE* m_pData;
		LONG m_lSize;
		LONG m_lPos;
		BYTE* m_pDataCur;

		LONG m_lNextId;

	public:
		CRelsGenerator m_oRels;
		CString m_strFolder;
		CString m_strFolderThemes;

		LONG m_lChartNumber;
		CString m_strContentTypes;

		IUnknown* m_pMainDocument;
		SAFEARRAY* m_pSourceArray;

		LONG		m_lDocumentType;
		IUnknown*	m_pDrawingConverter;
	
	public:
		CBinaryFileReader()
		{
			m_pMainDocument = NULL;
			m_pSourceArray = NULL;

			m_lNextId = 0;

			m_lChartNumber = 1;
			m_strContentTypes = _T("");

			m_lDocumentType = XMLWRITER_DOC_TYPE_PPTX;
			m_pDrawingConverter = NULL;
		}
		~CBinaryFileReader()
		{
			RELEASEINTERFACE(m_pMainDocument);
		}

		AVSINLINE void SetMainDocument(IUnknown* pMainDoc)
		{
			RELEASEINTERFACE(m_pMainDocument);
			m_pMainDocument = pMainDoc;
			ADDREFINTERFACE(m_pMainDocument);
		}

	public:
		void Init(BYTE* pData, LONG lStart, LONG lSize)
		{
			m_pData = pData;
			m_lSize = lSize + lStart;
			m_lPos = lStart;
			m_pDataCur = m_pData + m_lPos;
		}
		LONG GenerateNextId()
		{
			++m_lNextId;
			return m_lNextId;
		}

	public:

		AVSINLINE int Seek(LONG _pos)
		{
			if (_pos > m_lSize)
				return 1;
			m_lPos = _pos;
			m_pDataCur = m_pData + m_lPos;
			return 0;
		}
		AVSINLINE int Skip(LONG _skip)
		{
			if (_skip < 0)
				return 1;
			return Seek(m_lPos + _skip);
		}
		
		
		AVSINLINE BYTE GetUChar()
		{
			if (m_lPos >= m_lSize)
				return 0;

			BYTE res = *m_pDataCur;
			++m_lPos;
			++m_pDataCur;
			return res;
		}
		AVSINLINE bool GetBool()
		{
			int res = GetUChar();
			return (res == 1) ? true : false;
		}

		
		AVSINLINE USHORT GetUShort()
		{
			if (m_lPos + 1 >= m_lSize)
				return 0;

			USHORT res = *((USHORT*)m_pDataCur);
			m_lPos += 2;
			m_pDataCur += 2;
			return res;		
		}

		
		AVSINLINE ULONG GetULong()
		{
			if (m_lPos + 3 >= m_lSize)
				return 0;

			ULONG res = *((ULONG*)m_pDataCur);
			m_lPos += 4;
			m_pDataCur += 4;
			return res;
		}

		AVSINLINE LONG GetLong()
		{
			return (LONG)GetULong();			
		}

		
		AVSINLINE CString GetString(LONG len)
		{
			len *= 2;
			if (m_lPos + len > m_lSize)
				return _T("");
			
			CString res((WCHAR*)m_pDataCur, len >> 1);
			m_lPos += len;
			m_pDataCur += len;
			return res;			
		}
		AVSINLINE CStringA GetString1(LONG len)
		{
			if (m_lPos + len > m_lSize)
				return "";

			CStringA res((CHAR*)m_pDataCur, len);
			m_lPos += len;
			m_pDataCur += len;
			return res;
		}
		CString GetString2()
		{
			LONG len = GetULong();
			return GetString(len);
		}

		LPSAFEARRAY GetArray(LONG len)
		{
			if (0 == len)
				return NULL;
			if (m_lPos + len > m_lSize)
				return NULL;

			SAFEARRAY* pArray = SafeArrayCreateVector(VT_UI1, (ULONG)len);
			
			BYTE* pDataD = (BYTE*)pArray->pvData;
			memcpy(pDataD, m_pDataCur, len);

			m_lPos += len;
			m_pDataCur += len;

			return pArray;
		}

		CStringA GetString2A()
		{
			LONG len = GetULong();
			return GetString1(len);
		}

		void SkipRecord()
		{
			LONG _len = GetULong();
			Skip(_len);
		}

		LONG GetPos()
		{
			return m_lPos;
		}

	public:
		void Deserialize(NSBinPptxRW::CImageManager2* pManager, LPSAFEARRAY pArray)
		{
			BYTE* pData = (BYTE*)pArray->pvData;
			this->Init(pData, 0, pArray->rgsabound[0].cElements);

			pManager->Deserialize(this);
		}
		void Deserialize(NSShapeImageGen::CImageManager* pManager, LPSAFEARRAY pArray)
		{
			BYTE* pData = (BYTE*)pArray->pvData;
			this->Init(pData, 0, pArray->rgsabound[0].cElements);

			pManager->Deserialize(this);
		}
	};
}