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
#include "Enums.h"
#include "File.h"

#include "gdiplus.h"
#include "CommonZLib.h"
using namespace Gdiplus;

class CExFilesInfo
{
public:
	enum ExFilesType
	{
		eftNone		= 0,
		eftVideo	= 1,
		eftAudio	= 2
	};

public:
	ExFilesType m_eType;
	CString		m_strFilePath;
	CString		m_strPresentationDirectory;

	
	double		m_dStartTime;
	double		m_dEndTime;

	
	bool		m_bLoop;

public:
	CExFilesInfo()
	{
		m_eType			= eftNone;
		m_strFilePath	= _T("");
		m_strPresentationDirectory = _T("");

		m_dStartTime	= 0.0;
		m_dEndTime		= -1.0;

		m_bLoop			= false;
	}
	CExFilesInfo(const CExFilesInfo& oSrc)
	{
		*this = oSrc;
	}
	CExFilesInfo& operator=(const CExFilesInfo& oSrc)
	{
		m_eType			= oSrc.m_eType;
		m_strFilePath	= oSrc.m_strFilePath;

		m_strPresentationDirectory = oSrc.m_strPresentationDirectory;

		m_dStartTime	= oSrc.m_dStartTime;
		m_dEndTime		= oSrc.m_dEndTime;

		m_bLoop			= oSrc.m_bLoop;

		return *this;
	}
	CExFilesInfo& operator=(const int& oSrc)
	{
		m_eType			= eftNone;
		m_strFilePath	= _T("");
		m_strPresentationDirectory = _T("");

		m_dStartTime	= 0.0;
		m_dEndTime		= -1.0;

		m_bLoop			= false;

		return *this;
	}
};

namespace NSAttributes
{
	
	static void CorrectXmlString(CString& strText)
	{
		strText.Replace(L"&",	L"&amp;");
		strText.Replace(L"/",	L"\\");
		strText.Replace(L"%20",	L" ");
		strText.Replace(L"'",	L"&apos;");
		strText.Replace(L"<",	L"&lt;");
		strText.Replace(L">",	L"&gt;");
		strText.Replace(L"\"",	L"&quot;");
	}
	static CString AddEffect(CString strName, CString strParams)
    {
        CString strXml = _T("");

        strXml += _T("<transforms>\r\n");
        strXml += _T(" <") + strName + _T(" ") + strParams + _T(">\r\n");
        strXml += _T(" </") + strName + _T(">\r\n");
        strXml += _T("</transforms>\r\n");

        return strXml;
    }

	static CString AddEffectForGroup(CString strName, CString strParams, CString strChilds = _T(""))
    {
        CString strXml = _T("");
        strXml += _T(" <") + strName + _T(" ") + strParams + _T(">\r\n");
		strXml += strChilds;
        strXml += _T(" </") + strName + _T(">\r\n");
        return strXml;
    }

	static CString BoolToString(bool bValue)
    {
        if (bValue)
            return _T("1");
        return _T("0");
    }

	static CString ToString(int val)
	{
		CString str = _T("");
		str.Format(_T("%d"), val);
		return str;
	}
	static CString ToString(double val)
	{
		CString str = _T("");
		str.Format(_T("%lf"), val);
		return str;
	}
	
	enum BrushType
    {
        BrushTypeSolid =		 1000,
        BrushTypeHorizontal =	 2001,
        BrushTypeVertical =		 2002,
        BrushTypeDiagonal1 =	 2003,
        BrushTypeDiagonal2 =	 2004,
        BrushTypeCenter =		 2005,
        BrushTypePathGradient1 = 2006,	
        BrushTypePathGradient2 = 2007,
        BrushTypeCylinderHor =	 2008,
        BrushTypeCylinderVer =	 2009,
        BrushTypeTexture =		 3008,
        BrushTypePattern =		 3009,
        BrushTypeHatch1 =		 4009,
        BrushTypeHatch53 =		 4061
    };
	
	enum BrushTextureMode
	{
		BrushTextureModeStretch		= 0,
		BrushTextureModeTile		= 1,
		BrushTextureModeTileCenter	= 2
	};
    
    class CColor_
	{
	public:
		BYTE R;
		BYTE G;
		BYTE B;
		BYTE A;

	public:
		CColor_()
		{
			R = 0;
			G = 0;
			B = 0;
			A = 0;
		}
		CColor_& operator =(const CColor_& oSrc)
		{
			R = oSrc.R;
			G = oSrc.G;
			B = oSrc.B;
			A = oSrc.A;
			return (*this);
		}

		CColor_& operator =(const DWORD& oSrc)
		{
			R = (BYTE)(oSrc >> 8);
			G = (BYTE)(oSrc >> 16);
			B = (BYTE)(oSrc >> 24);
			A = (BYTE)oSrc;
			return (*this);
		}

		int GetRGB() const
		{
			return (DWORD)R | ((DWORD)G << 8) | ((DWORD)B << 16);
		}

		CString ToString() const
		{
			return NSAttributes::ToString(GetRGB());
		}

		void FromString(CString str)
		{
			int lColor;
			if (str.Find(_T("#"), str[0]))
			{
				lColor = XmlUtils::GetColor(str.Mid(1, 6));
				R = (BYTE)(lColor);
				G = (BYTE)(lColor >> 8);
				B = (BYTE)(lColor >> 16);
				A = 0;				
			}
			else
			{
				lColor = XmlUtils::GetColor(str);
				*this = (DWORD)lColor;
			}
		}
	};

	class CFont_
	{
	public:
		CString m_strFontName;
		int m_nSize;

		bool m_bBold;
		bool m_bItalic;
		bool m_bUnderline;
		bool m_bStrikeout;

		CString m_strPitchFamily;
		BYTE	m_lCharset;

	public:
		CFont_()
		{
			m_strFontName = _T("Arial");
			m_nSize = 16;

			m_bBold = false;
			m_bItalic = false;
			m_bUnderline = false;
			m_bStrikeout = false;

			m_strPitchFamily = _T("");
			m_lCharset		 = 0x01;
		}
		CFont_& operator =(const CFont_& oSrc)
		{
			m_strFontName	= oSrc.m_strFontName;
			m_nSize			= oSrc.m_nSize;

			m_bBold			= oSrc.m_bBold;
			m_bItalic		= oSrc.m_bItalic;
			m_bUnderline	= oSrc.m_bUnderline;
			m_bStrikeout	= oSrc.m_bStrikeout;

			m_strPitchFamily= oSrc.m_strPitchFamily;
			m_lCharset		= oSrc.m_lCharset;

			return (*this);
		}
		CString ToString()
		{
			CString strFont = _T("");

			strFont.Format(_T("font-name='%s' font-size='%d' font-bold='%s' font-italic='%s' font-underline='%s' font-strikeout='%s' "),
				m_strFontName, m_nSize, NSAttributes::BoolToString(m_bBold), NSAttributes::BoolToString(m_bItalic),
				NSAttributes::BoolToString(m_bUnderline), NSAttributes::BoolToString(m_bStrikeout));
			
			return strFont;
		}
	};
	
	class CPen_
    {
	public:
		CColor_ m_oColor;
        BYTE m_nAlpha;
		double Size;

		byte DashStyle;
		byte LineStartCap;
		byte LineEndCap;
		byte LineJoin;

	public:
		CPen_() : m_oColor()
        {
			m_oColor = 0;
            m_nAlpha = 255;
			Size = 0.26458;
			DashStyle = 0;
			LineStartCap = 0;
			LineEndCap = 0;
			LineJoin = 0;
        }
		~CPen_()
		{
		}

        CString ToString()
        {
			CString str = _T("");
			str.Format(_T("<pen pen-color='%s' pen-alpha='%d' pen-size='%.6f'></pen>"), m_oColor.ToString(), m_nAlpha, Size);
			return str;
    
				
				
        }
		CString ToString2()
        {
			CString str = _T("");
			str.Format(_T("<pen pen-color='%s' pen-alpha='%d' pen-size='%.6f' pen-style='%d' pen-line-start-cap='%d' pen-line-end-cap='%d' penline-join='%d'></pen>"),
				m_oColor.ToString(), m_nAlpha, Size, DashStyle, LineStartCap, LineEndCap, LineJoin);
			return str;
    
				
				

        }
		CString ToString3()
        {
			CString str = _T("");
			str.Format(_T("<pen color='%s' alpha='%d' size='%.6f' style='%d' line-start-cap='%d' line-end-cap='%d' line-join='%d' />"),
				m_oColor.ToString(), m_nAlpha, Size, DashStyle, LineStartCap, LineEndCap, LineJoin);
			return str;
        }
		CPen_& operator =(const CPen_& oSrc)
		{
			m_oColor = oSrc.m_oColor;
			m_nAlpha = oSrc.m_nAlpha;
			Size = oSrc.Size;
			DashStyle = oSrc.DashStyle;
			LineStartCap = oSrc.LineStartCap;
			LineEndCap = oSrc.LineEndCap;
			LineJoin = oSrc.LineJoin;
			return (*this);
		}
    };
    
    class CTextShadow
    {
	public:
		bool m_bVisible;
        double m_nDistanceX;
        double m_nDistanceY;
        int m_nBlurSize;
        CColor_ m_oColor;
        BYTE m_nAlpha;

	public:
        CTextShadow()
        {
            m_bVisible = false;
            m_nDistanceX = 0.5;
            m_nDistanceY = 0.5;
            m_nBlurSize = 2;
            m_oColor = 0;
            m_nAlpha = 255;
        }
		~CTextShadow()
		{
		}

		CTextShadow& operator =(const CTextShadow& oSrc)
		{
			m_bVisible = oSrc.m_bVisible;
			m_nDistanceX = oSrc.m_nDistanceX;
			m_nDistanceY = oSrc.m_nDistanceY;
			m_nBlurSize = oSrc.m_nBlurSize;
			m_oColor = oSrc.m_oColor;
			m_nAlpha = oSrc.m_nAlpha;
			return (*this);
		}
		CString ToString()
		{
			CString strShadow = _T("");
			strShadow += (_T("shadow-visible=\"") + NSAttributes::BoolToString(m_bVisible) + _T("\" "));
			strShadow += (_T("shadow-distancex=\"") + NSAttributes::ToString(m_nDistanceX) + _T("\" "));
			strShadow += (_T("shadow-distancey=\"") + NSAttributes::ToString(m_nDistanceY) + _T("\" "));
            strShadow += (_T("shadow-blursize=\"") + NSAttributes::ToString(m_nBlurSize) + _T("\" "));
            strShadow += (_T("shadow-color=\"") + m_oColor.ToString() + _T("\" "));
            strShadow += (_T("shadow-alpha=\"") + NSAttributes::ToString((int)m_nAlpha) + _T("\" "));
			return strShadow;
		}
    };

    class CTextEdge
    {
	public:
		int m_nVisible;
        int m_nDistance;
        CColor_ m_oColor;
        BYTE m_nAlpha;

	public:
		CTextEdge()
        {
            m_nVisible = 0;
            m_nDistance = 1;
            m_oColor = 0;
            m_nAlpha = 255;
        }
		
		~CTextEdge()
		{
		}

        CTextEdge& operator =(const CTextEdge& oSrc)
		{
			m_nVisible = oSrc.m_nVisible;
			m_nDistance = oSrc.m_nDistance;
			m_oColor = oSrc.m_oColor;
			m_nAlpha = oSrc.m_nAlpha;
			return (*this);
		}
		CString ToString()
		{
			CString strEdge = _T("");
			strEdge += (_T("edge-visible='") + NSAttributes::ToString(m_nVisible) + _T("' "));
            strEdge += (_T("edge-dist='") + NSAttributes::ToString(m_nDistance) + _T("' "));
            strEdge += (_T("edge-color='") + m_oColor.ToString() + _T("' "));
            strEdge += (_T("edge-alpha='") + NSAttributes::ToString((int)m_nAlpha) + _T("' "));
			return strEdge;
		}
    };

    class CBrush_
    {
	public:
		struct TSubColor
		{
			CColor_ color;
			long position; 
		};
	
	public:
		int m_nBrushType;
        CColor_ m_oColor1;
        CColor_ m_oColor2;
        BYTE m_Alpha1;
        BYTE m_Alpha2;
		CStringW m_sTexturePath;
        int m_nTextureMode;
        int m_nRectable;
        BYTE m_nTextureAlpha;
		bool m_bApplyBounds;
        RECT m_rcBounds;
		float m_fAngle;
		CString m_strEffects;

		ATL::CSimpleArray<TSubColor> m_arrSubColors;

	public:
		CBrush_()
        {
            m_nBrushType = (int)BrushTypeSolid;
			m_oColor1 = 0xFFFFFFFF;
			m_oColor2 = 0xFFFFFFFF;
            m_Alpha1 = 255;
            m_Alpha2 = 255;
            m_sTexturePath = "";
            m_nTextureMode = 0;
            m_nRectable = 0;
            m_nTextureAlpha = 255;
			m_bApplyBounds = false;
            m_rcBounds.left = 0;
			m_rcBounds.top = 0;
			m_rcBounds.right = 0;
			m_rcBounds.bottom = 0;
			m_strEffects = _T("");
        }

        CBrush_& operator =(const CBrush_& oSrc)
		{
			m_nBrushType = oSrc.m_nBrushType;
			m_oColor1 = oSrc.m_oColor1;
			m_oColor2 = oSrc.m_oColor2;
            m_Alpha1 = oSrc.m_Alpha1;
            m_Alpha2 = oSrc.m_Alpha2;
            m_sTexturePath = oSrc.m_sTexturePath;
            m_nTextureMode = oSrc.m_nTextureMode;
            m_nRectable = oSrc.m_nRectable;
            m_nTextureAlpha = oSrc.m_nTextureAlpha;
			m_bApplyBounds = oSrc.m_bApplyBounds;
            m_rcBounds.left = oSrc.m_rcBounds.left;
			m_rcBounds.top = oSrc.m_rcBounds.top;
			m_rcBounds.right = oSrc.m_rcBounds.right;
			m_rcBounds.bottom = oSrc.m_rcBounds.bottom;
			m_fAngle = oSrc.m_fAngle;
			m_strEffects = oSrc.m_strEffects;
			m_arrSubColors = oSrc.m_arrSubColors;
			return (*this);
		}

		CString SubColorsToString() const
		{
			CString str;

			int count = m_arrSubColors.GetSize();
			for( int i = 0; i < count; i++ )
			{
				str.AppendFormat( CString("%d, %d; "), m_arrSubColors[i].color.GetRGB(), m_arrSubColors[i].position );
			}

			return str;
		}
        
        CString ToString()
        {
			CString strTexture = StreamUtils::ConvertCStringWToCString(m_sTexturePath);
			CorrectXmlString(strTexture);

			return AddEffectForGroup(_T("ImagePaint-SetBrush"), 
				_T("type='") + NSAttributes::ToString(m_nBrushType)
				+ _T("' color1='") + m_oColor1.ToString() + _T("' color2='") + m_oColor2.ToString()
				+ _T("' alpha1='") + NSAttributes::ToString(m_Alpha1) + _T("' alpha2='") + NSAttributes::ToString(m_Alpha2) 
                + _T("' texturepath='") + strTexture + _T("' texturealpha='") + NSAttributes::ToString(m_nTextureAlpha)  
				+ _T("' texturemode='") + NSAttributes::ToString(m_nTextureMode)
				
				
    			
				+ _T("' linearangle='") + NSAttributes::ToString(m_fAngle)
				+ _T("' subcolors='") + SubColorsToString()
				+ _T("'"), m_strEffects);

			
			
                
				
                
        }

		CString ToString2()
        {
			CString strTexture = StreamUtils::ConvertCStringWToCString(m_sTexturePath);
			CorrectXmlString(strTexture);

			return AddEffectForGroup(_T("brush"), 
				_T("brush-type='") + NSAttributes::ToString(m_nBrushType)
				+ _T("' brush-color1='") + m_oColor1.ToString() + _T("' brush-color2='") + m_oColor2.ToString()
				+ _T("' brush-alpha1='") + NSAttributes::ToString(m_Alpha1) + _T("' brush-alpha2='") + NSAttributes::ToString(m_Alpha2) 
				+ _T("' brush-texturepath='") + strTexture + _T("' brush-texturealpha='") + NSAttributes::ToString(m_nTextureAlpha)  
				+ _T("' brush-texturemode='") + NSAttributes::ToString(m_nTextureMode)
				
				
				
				+ _T("' linearangle='") + NSAttributes::ToString(m_fAngle)
				+ _T("' subcolors='") + SubColorsToString()
				+ _T("'"), m_strEffects);


             
                
				
                
        }
    };

    class CTextAttributes
    {
	public:
        CFont_ m_oFont;
        CBrush_ m_oTextBrush;
        CTextShadow m_oTextShadow;
        CTextEdge m_oTextEdge;

        int m_nTextAlignHorizontal;
        int m_nTextAlignVertical;
        double m_dTextRotate;

	public:
		CTextAttributes() : m_oFont(), m_oTextBrush(), m_oTextShadow(), m_oTextEdge()
        {
			m_oFont.m_nSize = 36;
			m_oTextBrush.m_oColor1 = 0xFF;

			m_nTextAlignHorizontal = 0;
			m_nTextAlignVertical = 0;
			m_dTextRotate = 0;
        }
		CTextAttributes& operator =(const CTextAttributes& oSrc)
		{
			m_oFont = oSrc.m_oFont;
			m_oTextBrush = oSrc.m_oTextBrush;
			m_oTextShadow = oSrc.m_oTextShadow;
			m_oTextEdge = oSrc.m_oTextEdge;

			m_nTextAlignHorizontal = oSrc.m_nTextAlignHorizontal;
			m_nTextAlignVertical = oSrc.m_nTextAlignVertical;
			m_dTextRotate = oSrc.m_dTextRotate;

			return (*this);
		}
        CString ToString()
        {
            CString strText = _T("<Attributes ");

            
			strText += (_T("brush-type='") + NSAttributes::ToString(m_oTextBrush.m_nBrushType) + _T("' "));
            strText += (_T("brush-color1='") + m_oTextBrush.m_oColor1.ToString() + _T("' "));
            strText += (_T("brush-color2='") + m_oTextBrush.m_oColor2.ToString() + _T("' "));
			strText += (_T("brush-alpha1='") + NSAttributes::ToString(m_oTextBrush.m_Alpha1) + _T("' "));
            strText += (_T("brush-alpha2='") + NSAttributes::ToString(m_oTextBrush.m_Alpha2) + _T("' "));
			strText += (_T("brush-texturepath='") + (CString)(m_oTextBrush.m_sTexturePath) + _T("' "));
            strText += (_T("brush-texturealpha='") + NSAttributes::ToString(m_oTextBrush.m_nTextureAlpha) + _T("' "));
            strText += (_T("brush-texturemode='") + NSAttributes::ToString(m_oTextBrush.m_nTextureMode) + _T("' "));
            strText += (_T("brush-rectable='0' "));

            
            strText += m_oFont.ToString();

            
            strText += _T("font-antialiastext='1' ");
			strText += (_T("font-stringalignmentvertical='") + NSAttributes::ToString(m_nTextAlignVertical) + _T("' "));
            strText += (_T("font-stringalignmenthorizontal='") + NSAttributes::ToString(m_nTextAlignHorizontal) + _T("' "));
			strText += (_T("font-angle='") + NSAttributes::ToString((int)m_dTextRotate) + _T("' "));

            
            if (m_oTextShadow.m_bVisible)
				strText += m_oTextShadow.ToString();

            
			if (m_oTextEdge.m_nVisible > 0)
				strText += m_oTextEdge.ToString();
			
			strText += _T("/>");

			return strText;
        }
    };
}

class CMetaHeader
{
public:
	DWORD cbSize;
	RECT rcBounds;
	POINT ptSize;
	DWORD cbSave;
	BYTE compression;
	BYTE filter;

public:
	CMetaHeader()
	{
	}
	void FromStream(IStream* pStream)
	{
		cbSize = StreamUtils::ReadDWORD(pStream);
		
		rcBounds.left = StreamUtils::ReadLONG(pStream);
		rcBounds.top = StreamUtils::ReadLONG(pStream);
		rcBounds.right = StreamUtils::ReadLONG(pStream);
		rcBounds.bottom = StreamUtils::ReadLONG(pStream);

		ptSize.x = StreamUtils::ReadLONG(pStream);
		ptSize.y = StreamUtils::ReadLONG(pStream);

		cbSave = StreamUtils::ReadDWORD(pStream);

		compression = StreamUtils::ReadBYTE(pStream);
		filter = StreamUtils::ReadBYTE(pStream);
	}

	void ToEMFHeader(ENHMETAHEADER3* pHeader)
	{
		if (NULL == pHeader)
			return;

		pHeader->iType = 0x00000001;
		pHeader->nSize = 88;

		pHeader->rclBounds.left		= rcBounds.left;
		pHeader->rclBounds.top		= rcBounds.top;
		pHeader->rclBounds.right	= rcBounds.right;
		pHeader->rclBounds.bottom	= rcBounds.bottom;

		
		pHeader->rclFrame.left		= rcBounds.left;
		pHeader->rclFrame.top		= rcBounds.top;
		pHeader->rclFrame.right		= rcBounds.right;
		pHeader->rclFrame.bottom	= rcBounds.bottom;

		pHeader->dSignature = 0x464D4520;
		pHeader->nVersion	= 0x00010000;
		pHeader->nBytes		= cbSize;

		pHeader->nRecords = 1;
		pHeader->nHandles = 0;

		pHeader->sReserved = 0;

		pHeader->nDescription = 0;
		pHeader->offDescription = 0;

		pHeader->nPalEntries = 0;

		pHeader->szlDevice.cx		= 200;
		pHeader->szlDevice.cy		= 200;

		
		pHeader->szlMillimeters.cx	= 100;
		pHeader->szlMillimeters.cy	= 100;
	}

	void ToWMFHeader(WmfPlaceableFileHeader* pHeader)
	{
		if (NULL == pHeader)
			return;

		pHeader->Key = 0x9AC6CDD7;
		pHeader->Hmf = 0;

		pHeader->BoundingBox.Left = (short)rcBounds.left;
		pHeader->BoundingBox.Top = (short)rcBounds.top;
		pHeader->BoundingBox.Right = (short)rcBounds.right;
		pHeader->BoundingBox.Bottom = (short)rcBounds.bottom;

		pHeader->Inch = 1440; 
		pHeader->Reserved = 0;

		pHeader->Checksum = 0;
		pHeader->Checksum ^= (pHeader->Key & 0x0000FFFFL);
		pHeader->Checksum ^= ((pHeader->Key & 0xFFFF0000L) >> 16);
		
		pHeader->Checksum ^= pHeader->Hmf; 
		
		pHeader->Checksum ^= pHeader->BoundingBox.Left;
		pHeader->Checksum ^= pHeader->BoundingBox.Top; 
		pHeader->Checksum ^= pHeader->BoundingBox.Right;
		pHeader->Checksum ^= pHeader->BoundingBox.Bottom; 
		
		pHeader->Checksum ^= pHeader->Inch;
		pHeader->Checksum ^= (pHeader->Reserved & 0x0000FFFFL);
		pHeader->Checksum ^= ((pHeader->Reserved & 0xFFFF0000L) >> 16);
	}

	static void DecompressDeflate(BYTE* pSrc, LONG lSrcSize, BYTE** ppDst, LONG& lDstSize)
	{
		CComPtr<IEncodingFilterFactory> pEFF;
		HRESULT hr = pEFF.CoCreateInstance(CLSID_StdEncodingFilterFac);
		CComPtr<IDataFilter> pDF;
		
		if (!pEFF || FAILED(pEFF->GetDefaultFilter( L"deflate", L"text", &pDF))) 
			return;

		
		BYTE* outBuff = new BYTE[200000];
		DWORD dwOutBuffSize = sizeof(outBuff);

		long dwRead = 0, dwWritten = 0;
		
		
		hr = pDF->DoDecode(0, lSrcSize, pSrc, dwOutBuffSize, outBuff, lSrcSize, &dwRead, &dwWritten, 0);
	}
};

class CMetaFileBuffer
{
public:
	BOOL m_bIsValid;

private:
	BYTE* m_pMetaHeader;
	BYTE* m_pMetaFile;

	LONG m_lMetaHeaderSize;
	LONG m_lMetaFileSize;

public:
	CMetaFileBuffer()
	{
		m_bIsValid = FALSE;

		m_pMetaHeader = NULL;
		m_pMetaFile = NULL;

		m_lMetaHeaderSize = 0;
		m_lMetaFileSize = 0;
	}
	~CMetaFileBuffer()
	{
		RELEASEARRAYOBJECTS(m_pMetaHeader);
		RELEASEARRAYOBJECTS(m_pMetaFile);
	}

	void SetHeader(BYTE* pHeader, LONG lSize)
	{
		m_pMetaHeader = pHeader;
		m_lMetaHeaderSize = lSize;
	}

	void SetData(BYTE* pCompress, LONG lCompressSize, LONG lUncompressSize, BOOL bIsCompressed)
	{
		if (!bIsCompressed)
		{
			m_pMetaFile = pCompress;
			m_lMetaFileSize = lUncompressSize;
		}
		else
		{
			ULONG lSize = lUncompressSize;
			m_pMetaFile = new BYTE[lUncompressSize];
			BOOL bRes = NSZLib::Decompress(pCompress, (ULONG)lCompressSize, m_pMetaFile, lSize);
			if (bRes)
			{
				m_lMetaFileSize = (LONG)lSize;
			}
			else
			{
				RELEASEARRAYOBJECTS(m_pMetaFile);
				m_lMetaFileSize = 0;
			}
		}
	}

	void ToFile(CFile* pFile)
	{
		if (NULL != m_pMetaHeader)
		{
			pFile->WriteFile((void*)m_pMetaHeader, m_lMetaHeaderSize);
		}
		if (NULL != m_pMetaFile)
		{
			pFile->WriteFile((void*)m_pMetaFile, m_lMetaFileSize);
		}
	}
};

static void ParseString(CString strDelimeters, CString strSource, 
		CAtlArray<CString>* pArrayResults, bool bIsCleared = true)
{
	if (NULL == pArrayResults)
		return;

	if (bIsCleared)
		pArrayResults->RemoveAll();

	CString resToken;
	int curPos= 0;

	resToken = strSource.Tokenize(strDelimeters, curPos);
	while (resToken != _T(""))
	{
		pArrayResults->Add(resToken);
		resToken = strSource.Tokenize(strDelimeters, curPos);
	};
}