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

#include "MediaBuffer.h"

#if defined(_WIN32_WCE) && !defined(_CE_DCOM) && !defined(_CE_ALLOW_SINGLE_THREADED_OBJECTS_IN_MTA)
#error "Single-threaded COM objects are not properly supported on Windows CE platform, such as the Windows Mobile platforms that do not include full DCOM support. Define _CE_ALLOW_SINGLE_THREADED_OBJECTS_IN_MTA to force ATL to support creating single-thread COM object's and allow use of it's single-threaded COM object implementations. The threading model in your rgs file was set to 'Free' as that is the only threading model supported in non DCOM Windows CE platforms."
#endif


[ object, uuid("9934C9A4-F996-4fa9-B7DC-2F11F7BD0E23"), dual, pointer_default(unique) ]
__interface IUncompressedFrame : IDispatch
{
	[id(200000 + 2)] HRESULT CreateDuplicate([in] long DublicateType, [out, retval] IUnknown** punkFrame);

	[id(200000 + 3)] HRESULT AllocateBuffer([in] long BufferSize);
	[id(200000 + 4), propget] HRESULT Buffer([out, retval] BYTE** pVal);
	[id(200000 + 5), propget] HRESULT BufferSize([out, retval] long* pVal);

	[id(200000 + 6), propget] HRESULT DataSize([out, retval] long* pVal);
	[id(200000 + 6), propput] HRESULT DataSize([in] long newVal);

	[id(202000 + 1), propget] HRESULT Plane([in] long Index, [out, retval] BYTE** pVal);
	[id(202000 + 1), propput] HRESULT Plane([in] long Index, [in] BYTE* newVal);
	[id(202000 + 2), propget] HRESULT Stride([in] long Index, [out, retval] long* pVal);
	[id(202000 + 2), propput] HRESULT Stride([in] long Index, [in] long newVal);
	[id(202000 + 3), propget] HRESULT ColorSpace([out, retval] long* pVal);
	[id(202000 + 3), propput] HRESULT ColorSpace([in] long newVal);

	[id(202000 + 4)] HRESULT SetDefaultStrides(void);

	[id(202000 + 5), propget] HRESULT Width([out, retval] long* pVal);
	[id(202000 + 5), propput] HRESULT Width([in] long newVal);
	[id(202000 + 6), propget] HRESULT Height([out, retval] long* pVal);
	[id(202000 + 6), propput] HRESULT Height([in] long newVal);
	[id(202000 + 7), propget] HRESULT AspectRatioX([out, retval] long* pVal);
	[id(202000 + 7), propput] HRESULT AspectRatioX([in] long newVal);
	[id(202000 + 8), propget] HRESULT AspectRatioY([out, retval] long* pVal);
	[id(202000 + 8), propput] HRESULT AspectRatioY([in] long newVal);
	[id(202000 + 9), propget] HRESULT Interlaced([out, retval] VARIANT_BOOL* pVal);
	[id(202000 + 9), propput] HRESULT Interlaced([in] VARIANT_BOOL newVal);

	[id(200000 + 12)] HRESULT SetAdditionalParam([in] BSTR ParamName, [in] VARIANT ParamValue);
	[id(200000 + 13)] HRESULT GetAdditionalParam([in] BSTR ParamName, [out,retval] VARIANT* ParamValue);
};


[ coclass, default(IUncompressedFrame), threading(apartment), vi_progid("OfficeCore.Unc"), progid("OfficeCore.Unc.1"), version(1.0), uuid("85C939DC-E53E-41f7-BE71-2FE0710DDA84") ]
class ATL_NO_VTABLE CUncompressedFrame : public IUncompressedFrame	
{
private:

	CMediaBuffer* m_pMediaBuffer;
	SUncompressedVideoFrame m_oVideoFrame;

	long m_lDataSize;

public:
	DECLARE_PROTECT_FINAL_CONSTRUCT()
	
	CUncompressedFrame()
	{
	}
	~CUncompressedFrame()
	{
	}

public:
	HRESULT FinalConstruct()
	{
		m_lDataSize = 0;
		m_pMediaBuffer = new CMediaBuffer();
		return S_OK;
	}
	void FinalRelease()
	{
		RELEASEINTERFACE(m_pMediaBuffer);
	}

public:

	STDMETHOD(CreateDuplicate)(long DublicateType, IUnknown** punkFrame)
	{
		
		return S_OK;
	}
	STDMETHOD(AllocateBuffer)(long lBufferSize)
	{
		if (lBufferSize <= 0)
		{
			
			LONG lDataSize = m_oVideoFrame.Stride[0]*m_oVideoFrame.Height;
			ATLASSERT(0!=lDataSize);
			
			switch (m_oVideoFrame.ColorSpace & CSP_COLOR_MASK)
			{
			case CSP_I420:
			case CSP_YV12:

				m_pMediaBuffer->SetBuffer(lDataSize + (m_oVideoFrame.Stride[1] + m_oVideoFrame.Stride[2])*m_oVideoFrame.Height/2);
				m_oVideoFrame.Plane[0] = m_pMediaBuffer->GetBuffer();
				m_oVideoFrame.Plane[1] = m_oVideoFrame.Plane[0] + m_oVideoFrame.Stride[0]*m_oVideoFrame.Height;
				m_oVideoFrame.Plane[2] = m_oVideoFrame.Plane[0] + m_oVideoFrame.Stride[0]*m_oVideoFrame.Height + m_oVideoFrame.Stride[1]*m_oVideoFrame.Height/2;
				break;

			

			
			
			
			
			

			case CSP_YUY2:
			case CSP_UYVY:
			case CSP_YVYU:

			case CSP_BGRA:
			case CSP_ABGR:
			case CSP_RGBA:
			case CSP_ARGB:

			case CSP_BGR:
			case CSP_RGB555:
			case CSP_RGB565:

				m_pMediaBuffer->SetBuffer(lDataSize);
				m_oVideoFrame.Plane[0] = m_pMediaBuffer->GetBuffer();
				break;
			}
		}
		else
		{
			m_pMediaBuffer->SetBuffer(lBufferSize);
			m_lDataSize = m_pMediaBuffer->GetBufferSize();

			m_oVideoFrame.Plane[0] = m_pMediaBuffer->GetBuffer();
		}
		ATLASSERT(0!=m_oVideoFrame.Plane[0]);
		return S_OK;
	}
	
public:
	STDMETHOD(get_Plane)(LONG Index, BYTE** pVal)
	{
		*pVal = m_oVideoFrame.Plane[Index];
		return S_OK;
	}
	STDMETHOD(put_Plane)(LONG Index, BYTE* newVal)
	{
		m_oVideoFrame.Plane[Index] = newVal;
		return S_OK;
	}
	STDMETHOD(get_Stride)(LONG Index, LONG* pVal)
	{
		*pVal = m_oVideoFrame.Stride[Index];
		return S_OK;
	}
	STDMETHOD(put_Stride)(LONG Index, LONG newVal)
	{
		m_oVideoFrame.Stride[Index] = newVal;
		return S_OK;
	}
	STDMETHOD(get_ColorSpace)(LONG* pVal)
	{
		*pVal = m_oVideoFrame.ColorSpace;
		return S_OK;
	}
	STDMETHOD(put_ColorSpace)(LONG newVal)
	{
		m_oVideoFrame.ColorSpace = newVal;
		return S_OK;
	}
	
	STDMETHOD(SetDefaultStrides)(void)
	{
		switch (m_oVideoFrame.ColorSpace & CSP_COLOR_MASK)
		{
		case CSP_I420:
		case CSP_YV12:
			m_oVideoFrame.Stride[0] = m_oVideoFrame.Width;
			m_oVideoFrame.Stride[1] = m_oVideoFrame.Width/2;
			m_oVideoFrame.Stride[2] = m_oVideoFrame.Width/2;
			break;
		case CSP_YUY2:
		case CSP_UYVY:
		case CSP_YVYU:

		case CSP_RGB555:
		case CSP_RGB565:
			m_oVideoFrame.Stride[0] = 2*m_oVideoFrame.Width;
			break;
		case CSP_BGRA:
		case CSP_ABGR:
		case CSP_RGBA:
		case CSP_ARGB: 
			m_oVideoFrame.Stride[0] = 4*m_oVideoFrame.Width;
			break;
		case CSP_BGR:
			m_oVideoFrame.Stride[0] = 3*m_oVideoFrame.Width;
			break;
		}

		return S_OK;
	}
	STDMETHOD(get_Width)(LONG* pVal)
	{
		*pVal = m_oVideoFrame.Width;
		return S_OK;
	}
	STDMETHOD(put_Width)(LONG newVal)
	{
		m_oVideoFrame.Width = newVal;
		return S_OK;
	}
	STDMETHOD(get_Height)(LONG* pVal)
	{
		*pVal = m_oVideoFrame.Height;
		return S_OK;
	}
	STDMETHOD(put_Height)(LONG newVal)
	{
		m_oVideoFrame.Height = newVal;
		return S_OK;
	}
	STDMETHOD(get_AspectRatioX)(LONG* pVal)
	{
		*pVal = m_oVideoFrame.AspectX;
		return S_OK;
	}
	STDMETHOD(put_AspectRatioX)(LONG newVal)
	{
		m_oVideoFrame.AspectX = newVal;
		return S_OK;
	}
	STDMETHOD(get_AspectRatioY)(LONG* pVal)
	{
		*pVal = m_oVideoFrame.AspectY;

		return S_OK;
	}
	STDMETHOD(put_AspectRatioY)(LONG newVal)
	{
		m_oVideoFrame.AspectY = newVal;
		return S_OK;
	}
	STDMETHOD(get_Interlaced)(VARIANT_BOOL* pVal)
	{
		*pVal = m_oVideoFrame.Interlaced ? VARIANT_TRUE : VARIANT_FALSE;
		return S_OK;
	}
	STDMETHOD(put_Interlaced)(VARIANT_BOOL newVal)
	{
		m_oVideoFrame.Interlaced = (newVal != VARIANT_FALSE) ? TRUE : FALSE;
		return S_OK;
	}

public:

	STDMETHOD(get_Buffer)(BYTE** pVal)
	{
		*pVal = 0;
		if (NULL != m_pMediaBuffer)
			*pVal = m_pMediaBuffer->GetBuffer();
		return S_OK;
	}
	STDMETHOD(get_BufferSize)(LONG* pVal)
	{
		*pVal = 0;
		if (NULL != m_pMediaBuffer)
			*pVal = m_pMediaBuffer->GetBufferSize();
		return S_OK;
	}
	STDMETHOD(get_DataSize)(long* pVal)
	{
		*pVal = m_lDataSize;
		return S_OK;
	}
	STDMETHOD(put_DataSize)(long newVal)
	{
		if (NULL == m_pMediaBuffer)
			m_lDataSize = 0;
		else
			m_lDataSize = min(newVal, m_pMediaBuffer->GetBufferSize());
		return S_OK;
	}
		
	STDMETHOD(SetAdditionalParam)(BSTR ParamName, VARIANT ParamValue)
	{
		return S_OK;
	}
	STDMETHOD(GetAdditionalParam)(BSTR ParamName, VARIANT* ParamValue)
	{
		return S_OK;
	}
};