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

#define ADDREFINTERFACE(pinterface)\
{\
	if (pinterface!=NULL)\
	{\
		pinterface->AddRef();\
	}\
}
#define RELEASEINTERFACE(pinterface)\
{\
	if (pinterface!=NULL)\
	{\
		pinterface->Release();\
		pinterface=NULL;\
	}\
}
#define QUERYINTERFACE(pinterface, pinterface_res, iid)\
{\
	if (pinterface!=NULL)\
		pinterface->QueryInterface(iid, (void**)&pinterface_res);\
	else\
		pinterface_res=NULL;\
}
#define RELEASEMEM(pobject)\
{\
	if (pobject!=NULL)\
	{\
		free(pobject);\
		pobject=NULL;\
	}\
}
#define RELEASEOBJECT(pobject)\
{\
	if (pobject!=NULL)\
	{\
		delete pobject;\
		pobject=NULL;\
	}\
}
#define RELEASEARRAYOBJECTS(pobject)\
{\
	if (pobject!=NULL)\
	{\
		delete []pobject;\
		pobject=NULL;\
	}\
}
#define RELEASEHEAP(pmem)\
{\
	if (pmem!=NULL)\
	{\
		HeapFree(GetProcessHeap(), 0, pmem);\
		pmem=NULL;\
	}\
}
#define RELEASEARRAY(parray)\
{\
	if (parray!=NULL)\
	{\
		SafeArrayDestroy(parray);\
		parray=NULL;\
	}\
}
#define RELEASESYSSTRING(pstring)\
{\
	if (pstring!=NULL)\
	{\
		SysFreeString(pstring);\
		pstring=NULL;\
	}\
}
#define RELEASEHANDLE(phandle)\
{\
	if (phandle!=NULL)\
	{\
		CloseHandle(phandle);\
		phandle=NULL;\
	}\
}

class CMediaBuffer
{
protected:
	
	__declspec(align(32)) LONG m_dwRef;

	BYTE* m_pMediaBuffer;
	LONG m_lFrameSize;
	LONG m_lBufferSize;
public:
	
	CMediaBuffer()
	{
		m_dwRef = 1;
		m_pMediaBuffer = NULL;
		m_lFrameSize = 0;
		m_lBufferSize = 0;
	}
	~CMediaBuffer(void)
	{
		RELEASEHEAP(m_pMediaBuffer);
	}
	
	LONG __fastcall AddRef()
	{
		return InterlockedIncrement(&m_dwRef);
	}
	LONG __fastcall Release()
	{
		long lResult = InterlockedDecrement(&m_dwRef);
		if (lResult == 0)
			delete this;

		return lResult;
	}
	BOOL __fastcall SetBuffer(LONG lSize, BOOL bAlign64 = TRUE)
	{
		RELEASEHEAP(m_pMediaBuffer);

		m_lFrameSize = lSize;

		if (bAlign64)
			m_lBufferSize = ((lSize + 63) & 0xFFFFFFC0) + 64;
		else
			m_lBufferSize = lSize;

		if (m_lBufferSize == 0)
			return TRUE;

		
		m_pMediaBuffer = (BYTE*)::HeapAlloc(GetProcessHeap(), NULL, m_lBufferSize);

		if (!m_pMediaBuffer)
			return FALSE;

		LONG lAlignSize = (m_lBufferSize - m_lFrameSize);

		if (lAlignSize > 0)
		{
			memset(m_pMediaBuffer + m_lFrameSize, 0xFF, lAlignSize);
		}

		return TRUE;
	}
	
	BYTE* GetBuffer()
	{
		return m_pMediaBuffer;
	}
	LONG GetBufferSize()
	{
		return m_lFrameSize;
	}
};


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
#define CSP_VFLIP    (1<<31) 

#define CSP_COLOR_MASK	0x7FFFFFFF

#define PLANE_COUNT			4

struct SUncompressedVideoFrame
{
	BYTE* Plane[PLANE_COUNT];
	LONG Stride[PLANE_COUNT];

	LONG Width;
	LONG Height;

	LONG ColorSpace;
	LONG AspectX;
	LONG AspectY;
	BOOL Interlaced;

	double kx;
	double ky;

	SUncompressedVideoFrame()
		: Width(320)
		, Height(240)
		, ColorSpace(CSP_BGRA|CSP_VFLIP)
		, AspectX(0)
		, AspectY(1)
		, Interlaced(false)
		, kx(1.0)
		, ky(1.0)
	{
		for (int i=0;i<PLANE_COUNT;i++)
		{
            Plane[i] = NULL;
			Stride[i] = 0;
		}
	}
	SUncompressedVideoFrame& operator= (const SUncompressedVideoFrame& x)
	{
		for (int i=0;i<PLANE_COUNT;i++)
		{
            Plane[i] = x.Plane[i];
			Stride[i] = x.Stride[i];
		}

		Width = x.Width;
		Height = x.Height;

		ColorSpace = x.ColorSpace;
		AspectX = x.AspectX;
		AspectY = x.AspectY;
		Interlaced = x.Interlaced;

		kx = x.kx;
		ky = x.ky;

		return *this;
	}
};