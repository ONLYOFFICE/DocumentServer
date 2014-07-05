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

using namespace NSOfficeDrawing;

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

	CString ToString()
	{
		DWORD dwColor = 0;
		
		dwColor |= R;
		dwColor |= (G << 8);
		dwColor |= (B << 16);
		return NSAttributes::ToString((int)dwColor);
	}
};

class CPen_
{
public:
	CColor_ m_oColor;
	int m_nWidth;
    BYTE m_nAlpha;

public:
	CPen_() : m_oColor()
    {
		m_oColor = 0;
		m_nWidth = 1;
        m_nAlpha = 255;
    }

	~CPen_()
	{
	}

    CString ToString()
    {
        return AddEffectForGroup(_T("ImagePaint-SetPen"), _T("color='") 
			+ m_oColor.ToString() + _T("' alpha='") + NSAttributes::ToString((int)m_nAlpha) 
			+ _T("' size='") + NSAttributes::ToString(m_nWidth) + _T("'"));
    }

	CString ToString2()
    {
        return AddEffectForGroup(_T("pen"), _T("pen-color='") 
			+ m_oColor.ToString() + _T("' pen-alpha='") + NSAttributes::ToString((int)m_nAlpha) 
			+ _T("' pen-size='") + NSAttributes::ToString(m_nWidth) + _T("'"));
    }

	CPen_& operator =(const CPen_& oSrc)
	{
		m_oColor = oSrc.m_oColor;
		m_nWidth = oSrc.m_nWidth;
		m_nAlpha = oSrc.m_nAlpha;
		return (*this);
	}
};

class CBrush_
{
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
    RECT m_rcBounds;

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
        m_rcBounds.left = 0;
		m_rcBounds.top = 0;
		m_rcBounds.right = 0;
		m_rcBounds.bottom = 0;
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
        m_rcBounds.left = oSrc.m_rcBounds.left;
		m_rcBounds.top = oSrc.m_rcBounds.top;
		m_rcBounds.right = oSrc.m_rcBounds.right;
		m_rcBounds.bottom = oSrc.m_rcBounds.bottom;
		return (*this);
	}

    CString ToString()
    {
        return AddEffectForGroup(_T("ImagePaint-SetBrush"), 
			_T("type='") + NSAttributes::ToString(m_nBrushType)
			+ _T("' color1='") + m_oColor1.ToString() + _T("' color2='") + m_oColor2.ToString()
			+ _T("' alpha1='") + NSAttributes::ToString(m_Alpha1) + _T("' alpha2='") + NSAttributes::ToString(m_Alpha2) 
            + _T("' texturepath='") + (CString)m_sTexturePath + _T("' texturealpha='") + NSAttributes::ToString(m_nTextureAlpha)  
			+ "' texturemode='" + NSAttributes::ToString(m_nTextureMode)  + _T("'")); 
            
			
            
    }

	CString ToString2()
    {
        return AddEffectForGroup(_T("brush"), 
			_T("brush-type='") + NSAttributes::ToString(m_nBrushType)
			+ _T("' brush-color1='") + m_oColor1.ToString() + _T("' brush-color2='") + m_oColor2.ToString()
			+ _T("' brush-alpha1='") + NSAttributes::ToString(m_Alpha1) + _T("' brush-alpha2='") + NSAttributes::ToString(m_Alpha2) 
            + _T("' brush-texturepath='") + (CString)m_sTexturePath + _T("' brush-texturealpha='") + NSAttributes::ToString(m_nTextureAlpha)  
			+ "' brush-texturemode='" + NSAttributes::ToString(m_nTextureMode)  + _T("'")); 
            
			
            
    }
};

