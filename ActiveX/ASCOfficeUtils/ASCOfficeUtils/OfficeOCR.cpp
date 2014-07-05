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
 #include "stdafx.h"
#include "../../Common/ASCUtils.h"
#include "../../Common/MediaFormatDefine.h"
#include "OfficeOCR.h"
#include "ImageToPNM.h"
#include "gocr.h"

COfficeOCR::COfficeOCR ()
: CAVSATLError ( __uuidof ( COfficeOCR ), __uuidof ( IOfficeOCR ) )
{
	m_lOutputFormatType = OUTPUT_FORMAT_TYPE_XML;
	m_lGrayLevel = 0;
	m_lDustSize = -1;
	m_lSpaceWidthDots = 0;
	m_lCertainty = 95;
}

HRESULT COfficeOCR::FinalConstruct()
{
	return S_OK;
}

void COfficeOCR::FinalRelease()
{
}

STDMETHODIMP COfficeOCR::Recognize ( IUnknown *Image, BSTR* Text )
{
#ifdef BUILD_CONFIG_FULL_VERSION
	if ( NULL == Text )
		return CAVSATLError::Error ( MEMORY );

	*Text = NULL;

	if ( NULL == Image )
		return CAVSATLError::Error ( FILEFORMAT );

	MediaCore::IAVSUncompressedVideoFrame *pUncompressedVideoFrame = NULL; Image->QueryInterface ( &pUncompressedVideoFrame );
	if ( NULL == pUncompressedVideoFrame )
		return CAVSATLError::Error ( FILEFORMAT );

	LPBYTE pBuffer = NULL; pUncompressedVideoFrame->get_Buffer ( &pBuffer );

	LONG lWidth = 0; pUncompressedVideoFrame->get_Width ( &lWidth );
	LONG lHeight = 0; pUncompressedVideoFrame->get_Height ( &lHeight );
	LONG lColorSpace = 0; pUncompressedVideoFrame->get_ColorSpace ( &lColorSpace );

	LONG lBitCount = 0;

	if ( ( CSP_BGRA & CSP_COLOR_MASK ) == lColorSpace || ( ( CSP_BGRA | CSP_VFLIP ) & CSP_COLOR_MASK ) == lColorSpace ||
		 ( CSP_ABGR & CSP_COLOR_MASK ) == lColorSpace || ( ( CSP_ABGR | CSP_VFLIP ) & CSP_COLOR_MASK ) == lColorSpace ||
		 ( CSP_RGBA & CSP_COLOR_MASK ) == lColorSpace || ( ( CSP_RGBA | CSP_VFLIP ) & CSP_COLOR_MASK ) == lColorSpace ||
		 ( CSP_ARGB & CSP_COLOR_MASK ) == lColorSpace || ( ( CSP_ARGB | CSP_VFLIP ) & CSP_COLOR_MASK ) == lColorSpace )
		lBitCount = 32;
	else if ( ( CSP_BGR & CSP_COLOR_MASK ) == lColorSpace || ( ( CSP_BGR | CSP_VFLIP ) & CSP_COLOR_MASK ) == lColorSpace )
		lBitCount = 24;
	else if ( ( CSP_RGB555 & CSP_COLOR_MASK ) == lColorSpace || ( ( CSP_RGB555 | CSP_VFLIP ) & CSP_COLOR_MASK ) == lColorSpace ||
			  ( CSP_RGB565 & CSP_COLOR_MASK ) == lColorSpace || ( ( CSP_RGB565 | CSP_VFLIP ) & CSP_COLOR_MASK ) == lColorSpace )
		lBitCount = 16;
	else
		lBitCount = 32;

	long lCount = 0;

	CHAR *pPBMImage = convertToPNM ( pBuffer, lWidth, lHeight, lBitCount, true, true, lCount );

	CStringA sOutputFormat = "";
	switch ( m_lOutputFormatType )
	{
	case OUTPUT_FORMAT_TYPE_XML :
		sOutputFormat = "XML";
		break;
	case OUTPUT_FORMAT_TYPE_TEXT :
		sOutputFormat = "UTF8";
		break;
	}

	CHAR *pText = PNMToText (pPBMImage, lCount, sOutputFormat.GetBuffer(), m_lGrayLevel, m_lDustSize, m_lSpaceWidthDots, m_lCertainty);
	free ( pPBMImage );
	RELEASEINTERFACE ( pUncompressedVideoFrame );

	CString sText ( pText );
	free ( pText );

	CString sResult = _T("");
	if ( OUTPUT_FORMAT_TYPE_XML == m_lOutputFormatType )
	{
		sResult += _T("<?xml version=\"1.0\" encoding=\"utf-8\" ?>");
		sResult += _T ("<Text>");
	}
	sResult += sText;
	if ( OUTPUT_FORMAT_TYPE_XML == m_lOutputFormatType )
		sResult += _T ("</Text>");

	*Text = sResult.AllocSysString();
#endif
	return S_OK;
}

STDMETHODIMP COfficeOCR::put_OutputFormat ( LONG Type )
{
	if ( 0 <= Type && 2 >Type )
		m_lOutputFormatType = Type;

	return S_OK;
}

STDMETHODIMP COfficeOCR::get_OutputFormat ( LONG *Type )
{
	*Type = m_lOutputFormatType;
	return S_OK;
}

STDMETHODIMP COfficeOCR::put_GrayLevel ( LONG Type )
{
	m_lGrayLevel = Type;
	if ( 0 > m_lGrayLevel )
		m_lGrayLevel = 0;
	if ( 255 < m_lGrayLevel )
		m_lGrayLevel = 255;

	return S_OK;
}

STDMETHODIMP COfficeOCR::get_GrayLevel ( LONG *Type )
{
	*Type = m_lDustSize;
	return S_OK;
}

STDMETHODIMP COfficeOCR::put_DustSize ( LONG Type )
{
	m_lDustSize = Type;
	return S_OK;
}

STDMETHODIMP COfficeOCR::get_DustSize ( LONG *Type )
{
	*Type = m_lGrayLevel;
	return S_OK;
}

STDMETHODIMP COfficeOCR::put_SpaceWidthDots ( LONG Type )
{
	m_lSpaceWidthDots = Type;
	if ( 0 > m_lSpaceWidthDots )
		m_lSpaceWidthDots = 0;
	return S_OK;
}

STDMETHODIMP COfficeOCR::get_SpaceWidthDots ( LONG *Type )
{
	*Type = m_lSpaceWidthDots;
	return S_OK;
}

STDMETHODIMP COfficeOCR::put_Certainty ( LONG Type )
{
	m_lCertainty = Type;
	if ( 0 > m_lCertainty )
		m_lSpaceWidthDots = 0;
	if ( 100 < m_lCertainty )
		m_lCertainty = 100;
	return S_OK;
}

STDMETHODIMP COfficeOCR::get_Certainty ( LONG *Type )
{
	*Type = m_lCertainty;
	return S_OK;
}

STDMETHODIMP COfficeOCR::SetAdditionalParam ( BSTR ParamName, VARIANT ParamValue )
{
	return S_OK;
}

STDMETHODIMP COfficeOCR::GetAdditionalParam ( BSTR ParamName, VARIANT *ParamValue )
{
	return S_OK;
}