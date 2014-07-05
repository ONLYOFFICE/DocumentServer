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
 #ifndef _FONT_MANAGER_LIGHT_H
#define _FONT_MANAGER_LIGHT_H

#include "stdafx.h"
#include <math.h>

#include "./../UncompressedFrame/UncompressedFrame.h"

#include "WinFont.h"
#include FT_OUTLINE_H
#include FT_SIZES_H
#include FT_GLYPH_H
#include FT_TRUETYPE_IDS_H
#include FT_TRUETYPE_TABLES_H
#include FT_XFREE86_H
#include FT_ADVANCES_H

#define LOAD_MODE FT_LOAD_NO_HINTING | FT_LOAD_NO_AUTOHINT | FT_LOAD_NO_BITMAP | FT_LOAD_LINEAR_DESIGN
#define REND_MODE FT_RENDER_MODE_NORMAL

#define FONT_FRACTION_BITS  2
#define FONT_FRACTION      (1 << FONT_FRACTION_BITS)
#define FONT_FRACTION_MULT ((double)1 / (double)FONT_FRACTION)

#define FONT_ITALIC_ANGLE  0.3090169943749 





struct TGlyphBitmap 
{
	int            nX;        
	int            nY;        
	int            nWidth;    
	int            nHeight;   
	BOOL           bAA;       
	unsigned char *pData;     
	BOOL           bFreeData; 

	TGlyphBitmap()
	{
		nX			= 0;
		nY			= 0;
		nWidth		= 0;
		nHeight		= 0;
		bAA			= FALSE;
		pData		= NULL;
		bFreeData	= NULL;
	}
};

enum EGlyphState
{
	glyphstateNormal = 0,  
	glyphstateDeafault,    
	glyphstateMiss         
};

struct TGlyph
{
	long         lUnicode; 
	float        fX;       
	float        fY;       

	float        fLeft;    
	float        fTop;     
	float        fRight;   
	float        fBottom;  

	struct TMetrics
	{
		float fWidth;
		float fHeight;

		float fHoriBearingX;
		float fHoriBearingY;
		float fHoriAdvance;

		float fVertBearingX;
		float fVertBearingY;
		float fVertAdvance;
	} oMetrics;

	EGlyphState  eState;

	bool         bBitmap;
	TGlyphBitmap oBitmap;
};

struct TFontCacheTag 
{
	int   nCode;
	short nFracX;    
	short nFracY;    
	int   nMRU;      

	int   nX;        
	int   nY;        
	int   nWidth;    
	int   nHeight;   
};

class CGlyphString
{
public:

	CGlyphString()
	{
		m_fX = 0;
		m_fY = 0;

		m_fEndX = 0;
		m_fEndY = 0;

		m_nGlyphIndex   = -1;
		m_nGlyphsCount  = 0;
		m_pGlyphsBuffer = NULL;

		m_arrCTM[0] = 1;
		m_arrCTM[1] = 0;
		m_arrCTM[2] = 0;
		m_arrCTM[3] = 1;
		m_arrCTM[4] = 0;
		m_arrCTM[5] = 0;

		m_fTransX = 0;
		m_fTransY = 0;
	}

	CGlyphString(CStringW wsString, float fX = 0, float fY = 0)
	{
		m_nGlyphIndex   = 0;
		m_nGlyphsCount  = wsString.GetLength();

		if ( m_nGlyphsCount > 0 )
			m_pGlyphsBuffer = new TGlyph[m_nGlyphsCount];
		else
			m_pGlyphsBuffer = NULL;

		for ( int nIndex = 0; nIndex < m_nGlyphsCount; nIndex++ )
		{
			
			m_pGlyphsBuffer[nIndex].lUnicode = wsString.GetAt( nIndex );
			m_pGlyphsBuffer[nIndex].bBitmap  = false;
		}

		m_fX = fX;
		m_fY = fY;

		m_arrCTM[0] = 1;
		m_arrCTM[1] = 0;
		m_arrCTM[2] = 0;
		m_arrCTM[3] = 1;
		m_arrCTM[4] = 0;
		m_arrCTM[5] = 0;

		m_fTransX = 0;
		m_fTransY = 0;
	}

	~CGlyphString()
	{
		if ( m_pGlyphsBuffer )
			delete []m_pGlyphsBuffer;
	}


	void SetString(CStringW wsString, float fX = 0, float fY = 0)
	{
		m_fX = fX + m_fTransX;
		m_fY = fY + m_fTransY;

		if ( m_pGlyphsBuffer )
			delete []m_pGlyphsBuffer;

		m_nGlyphsCount = wsString.GetLength();
		m_nGlyphIndex  = 0;

		m_pGlyphsBuffer = new TGlyph[m_nGlyphsCount];
		for ( int nIndex = 0; nIndex < m_nGlyphsCount; nIndex++ )
		{
			
			m_pGlyphsBuffer[nIndex].lUnicode = wsString.GetAt( nIndex );
			m_pGlyphsBuffer[nIndex].bBitmap  = false;
		}
	}

	void Reset()
	{
		if ( m_pGlyphsBuffer )
			delete []m_pGlyphsBuffer;

		m_fX = 0;
		m_fY = 0;

		m_fEndX = 0;
		m_fEndY = 0;

		m_nGlyphIndex   = -1;
		m_nGlyphsCount  = 0;
		m_pGlyphsBuffer = NULL;

		m_arrCTM[0] = 1;
		m_arrCTM[1] = 0;
		m_arrCTM[2] = 0;
		m_arrCTM[3] = 1;
		m_arrCTM[4] = 0;
		m_arrCTM[5] = 0;

		m_fTransX = 0;
		m_fTransY = 0;
	}

	int  GetLength()
	{
		return m_nGlyphsCount;
	}
	void SetBBox(int nIndex, float fLeft, float fTop, float fRight, float fBottom)
	{
		if ( m_nGlyphsCount <= 0 )
			return;

		int nCurIndex = min( m_nGlyphsCount - 1, max( 0, nIndex ) );

		m_pGlyphsBuffer[nCurIndex].fLeft   = fLeft;
		m_pGlyphsBuffer[nCurIndex].fTop    = fTop;
		m_pGlyphsBuffer[nCurIndex].fRight  = fRight;
		m_pGlyphsBuffer[nCurIndex].fBottom = fBottom;
	}
	void SetMetrics(int nIndex, float fWidth, float fHeight, float fHoriAdvance, float fHoriBearingX, float fHoriBearingY, float fVertAdvance, float fVertBearingX, float fVertBearingY)
	{
		if ( m_nGlyphsCount <= 0 )
			return;

		int nCurIndex = min( m_nGlyphsCount - 1, max( 0, nIndex ) );

		m_pGlyphsBuffer[nCurIndex].oMetrics.fHeight       = fHeight;
		m_pGlyphsBuffer[nCurIndex].oMetrics.fHoriAdvance  = fHoriAdvance;
		m_pGlyphsBuffer[nCurIndex].oMetrics.fHoriBearingX = fHoriBearingX;
		m_pGlyphsBuffer[nCurIndex].oMetrics.fHoriBearingY = fHoriBearingY;
		m_pGlyphsBuffer[nCurIndex].oMetrics.fVertAdvance  = fVertAdvance;
		m_pGlyphsBuffer[nCurIndex].oMetrics.fVertBearingX = fVertBearingX;
		m_pGlyphsBuffer[nCurIndex].oMetrics.fVertBearingY = fVertBearingY;
		m_pGlyphsBuffer[nCurIndex].oMetrics.fWidth        = fWidth;
	}
	void SetStartPoint(int nIndex, float fX, float fY)
	{
		if ( m_nGlyphsCount <= 0 )
			return;

		int nCurIndex = min( m_nGlyphsCount - 1, max( 0, nIndex ) );

		m_pGlyphsBuffer[nCurIndex].fX = fX;
		m_pGlyphsBuffer[nCurIndex].fY = fY;
	}
	void SetState(int nIndex, EGlyphState eState)
	{
		if ( m_nGlyphsCount <= 0 )
			return;

		int nCurIndex = min( m_nGlyphsCount - 1, max( 0, nIndex ) );

		m_pGlyphsBuffer[nCurIndex].eState = eState;
	}

	void GetBBox(float *pfLeft, float *pfTop, float *pfRight, float *pfBottom, int nIndex = -1, int nType = 0)
	{
		int nCurIndex = 0;
		if ( nIndex < 0 )
		{
			if ( m_nGlyphsCount <= 0 || m_nGlyphIndex < 1 || m_nGlyphIndex > m_nGlyphsCount )
				return;

			nCurIndex = m_nGlyphIndex - 1;
		}
		else
		{
			if ( m_nGlyphsCount <= 0 )
				return;

			nCurIndex = min( m_nGlyphsCount - 1, max( 0, nIndex ) );
		}

		float fBottom = -m_pGlyphsBuffer[nCurIndex].fBottom;
		float fRight  =  m_pGlyphsBuffer[nCurIndex].fRight;
		float fLeft   =  m_pGlyphsBuffer[nCurIndex].fLeft;
		float fTop    = -m_pGlyphsBuffer[nCurIndex].fTop;


		if ( 0 == nType && !( 1 == m_arrCTM[0] && 0 == m_arrCTM[1] && 0 == m_arrCTM[2] && 1 == m_arrCTM[3] && 0 == m_arrCTM[4] && 0 == m_arrCTM[5] ) )
		{
			
			float arrfX[4] = { fLeft, fLeft,   fRight,  fRight };
			float arrfY[4] = { fTop,  fBottom, fBottom, fTop   };

			float fMinX = (float)(arrfX[0] * m_arrCTM[0] + arrfY[0] * m_arrCTM[2]);
			float fMinY = (float)(arrfX[0] * m_arrCTM[1] + arrfY[0] * m_arrCTM[3]);
			float fMaxX = fMinX;
			float fMaxY = fMinY;
			
			for ( int nIndex = 1; nIndex < 4; nIndex++ )
			{
				float fX = (float)(arrfX[nIndex] * m_arrCTM[0] + arrfY[nIndex] * m_arrCTM[2]);
				float fY = (float)(arrfX[nIndex] * m_arrCTM[1] + arrfY[nIndex] * m_arrCTM[3]);

				fMaxX = max( fMaxX, fX );
				fMinX = min( fMinX, fX );

				fMaxY = max( fMaxY, fY );
				fMinY = min( fMinY, fY );
			}

			fLeft   = fMinX;
			fRight  = fMaxX;
			fTop    = fMinY;
			fBottom = fMaxY;
		}

		*pfLeft   = fLeft   + m_pGlyphsBuffer[nCurIndex].fX + m_fX;
		*pfRight  = fRight  + m_pGlyphsBuffer[nCurIndex].fX + m_fX;
		*pfTop    = fTop    + m_pGlyphsBuffer[nCurIndex].fY + m_fY;
		*pfBottom = fBottom + m_pGlyphsBuffer[nCurIndex].fY + m_fY; 
	}

	void GetBBox2(float *pfLeft, float *pfTop, float *pfRight, float *pfBottom)
	{
		if ( m_nGlyphsCount <= 0 )
		{
			*pfLeft   = 0;
			*pfRight  = 0;
			*pfBottom = 0;
			*pfTop    = 0;
		}

		float fBottom = 0;
		float fRight  = 0;
		float fLeft   = 0;
		float fTop    = 0;

		for ( int nIndex = 0; nIndex < m_nGlyphsCount; nIndex++ )
		{
			fBottom = max( fBottom, -m_pGlyphsBuffer[nIndex].fBottom );
			
			
			fTop    = min( fTop, -m_pGlyphsBuffer[nIndex].fTop );
		}

		if ( !( 1 == m_arrCTM[0] && 0 == m_arrCTM[1] && 0 == m_arrCTM[2] && 1 == m_arrCTM[3] && 0 == m_arrCTM[4] && 0 == m_arrCTM[5] ) )
		{
			
			float arrfX[4] = { fLeft, fLeft,   fRight,  fRight };
			float arrfY[4] = { fTop,  fBottom, fBottom, fTop   };

			float fMinX = (float)(arrfX[0] * m_arrCTM[0] + arrfY[0] * m_arrCTM[2]);
			float fMinY = (float)(arrfX[0] * m_arrCTM[1] + arrfY[0] * m_arrCTM[3]);
			float fMaxX = fMinX;
			float fMaxY = fMinY;
			
			for ( int nIndex = 1; nIndex < 4; nIndex++ )
			{
				float fX = (float)(arrfX[nIndex] * m_arrCTM[0] + arrfY[nIndex] * m_arrCTM[2]);
				float fY = (float)(arrfX[nIndex] * m_arrCTM[1] + arrfY[nIndex] * m_arrCTM[3]);

				fMaxX = max( fMaxX, fX );
				fMinX = min( fMinX, fX );

				fMaxY = max( fMaxY, fY );
				fMinY = min( fMinY, fY );
			}

			fLeft   = fMinX;
			fRight  = fMaxX;
			fTop    = fMinY;
			fBottom = fMaxY;
		}

		fLeft   += m_fX;
		fRight  += m_fX;
		fTop    += m_fY;
		fBottom += m_fY; 

		*pfLeft  = min( fLeft, min(m_fX, m_fEndX) );
		*pfRight = max( fRight, max(m_fX, m_fEndX) );
		*pfTop   = min( fTop, min(m_fY, m_fEndY) );
		*pfBottom = max( fBottom, max(m_fY, m_fEndY) );
	}

	void SetCTM(float fA, float fB, float fC, float fD, float fE ,float fF)
	{
		m_arrCTM[0] = fA;
		m_arrCTM[1] = fB;
		m_arrCTM[2] = fC;
		m_arrCTM[3] = fD;
		m_arrCTM[4] = fE;
		m_arrCTM[5] = fF;

		double dDet      = fA * fD - fB * fC;

		if ( dDet < 0.001 && dDet >= 0 )
			dDet =  0.001;
		else if ( dDet > - 0.001 && dDet < 0 )
			dDet = -0.001;

		m_dIDet = 1 / dDet;

	}
	void ResetCTM()
	{
		m_arrCTM[0] = 1;
		m_arrCTM[1] = 0;
		m_arrCTM[2] = 0;
		m_arrCTM[3] = 1;
		m_arrCTM[4] = 0;
		m_arrCTM[5] = 0;

		m_dIDet      = 1;
	}

	void Transform(float *pfX, float *pfY)
	{
		float fX = *pfX, fY = *pfY;

		*pfX = (float) ( fX * m_arrCTM[0] + fY * m_arrCTM[2] + m_arrCTM[4] );
		*pfY = (float) ( fX * m_arrCTM[1] + fY * m_arrCTM[3] + m_arrCTM[5] );
	}
	void SetTrans(float fX, float fY)
	{
		m_fTransX = (float) ( m_dIDet * ( fX * m_arrCTM[3] - m_arrCTM[2] * fY ) );
		m_fTransY = (float) ( m_dIDet * ( fY * m_arrCTM[0] - m_arrCTM[1] * fX ) );
	}
	TGlyph *GetAt(int nIndex)
	{
		if ( m_nGlyphsCount <= 0 )
		{
			return NULL;
		}

		int nCurIndex = min( m_nGlyphsCount - 1, max( 0, nIndex ) );

		return &(m_pGlyphsBuffer[nCurIndex]);
	}

	BOOL GetNext(TGlyph *pGlyph)
	{
		if ( m_nGlyphIndex >= m_nGlyphsCount || m_nGlyphIndex < 0 )
		{
			pGlyph = NULL;
			return FALSE;
		}

		*pGlyph = m_pGlyphsBuffer[m_nGlyphIndex];
		m_nGlyphIndex++;

		return TRUE;
	}

public:

	float   m_fTransX;
	float   m_fTransY;

	float   m_fX; 
	float   m_fY; 

	float   m_fEndX; 
	float   m_fEndY; 

	double  m_arrCTM[6];     
	double  m_dIDet;         
	
private:

	TGlyph *m_pGlyphsBuffer; 
	int     m_nGlyphsCount;  
	int     m_nGlyphIndex;   

};



struct TFontCacheSizes
{
	unsigned short ushUnicode; 
	EGlyphState    eState;     
	int            nCMapIndex; 

	unsigned short ushGID;     

	float   fAdvanceX; 

	struct TBBox
	{ 
		float fMinX;
		float fMaxX;
		float fMinY;
		float fMaxY;
	} oBBox;

	struct TMetrics
	{
		float fWidth;
		float fHeight;

		float fHoriBearingX;
		float fHoriBearingY;
		float fHoriAdvance;

		float fVertBearingX;
		float fVertBearingY;
		float fVertAdvance;
	} oMetrics;

	bool         bBitmap;
	TGlyphBitmap oBitmap;
};

#define FONT_CASHE_SIZES_SIZE 255
#define FONT_CACHE_SIZES_INDEXES_SIZE   65536
#define FONT_CACHE_SIZES_INDEXES_SIZE_2 131072 





class CFreeTypeFont
{
public:
	CFreeTypeFont()
	{
		m_pDefaultFont = NULL;
		m_bUseDefaultFont = FALSE;

		m_pSize = NULL;
		
		m_dTextScale = 1;
		m_dUnitsKoef = 1;
		m_bStringGID = FALSE;
		m_nDefaultChar = -1;
		m_nSymbolic = -1;

		m_pFace = NULL;

		
		m_pBaseAddress = NULL;
		m_hFile = NULL;
		m_hMapFile = NULL;

		
		m_bAntiAliasing = FALSE;
		m_bUseKerning = FALSE;

		m_fSize = 1;
		m_unHorDpi = 0;
		m_unVerDpi = 0;

		m_bNeedDoItalic = FALSE;
		m_bNeedDoBold = FALSE;

		m_fCharSpacing = 0;

		m_nMinX = 0; 
		m_nMinY = 0;
		m_nMaxX = 0;
		m_nMaxY = 0;
		
		m_pCache = NULL;
		m_pCacheTags = NULL;

		m_nGlyphWidth = 0;
		m_nGlyphHeight = 0;
		m_nGlyphSize = 0;

		m_nCacheSets = 0;
		m_nCacheAssoc = 0;
	}
	~CFreeTypeFont()
	{
		CloseFile();
	}

	void SetDefaultFont(CFreeTypeFont* pFont)
	{
		m_pDefaultFont = pFont;
	}
	CFreeTypeFont* GetDefaultFont()
	{
		return m_pDefaultFont;
	}

	void SetUseDefaultFont(BOOL bUse)
	{
		m_bUseDefaultFont = bUse;
	}

	void CloseFile()
	{
		if (NULL != m_pFace) 
			FT_Done_Face(m_pFace);

		if ( m_pBaseAddress )
			UnmapViewOfFile( m_pBaseAddress );
		if ( m_hMapFile )
			CloseHandle( m_hMapFile );
		if ( m_hFile )
			CloseHandle( m_hFile );

		m_pFace = NULL;
		m_pBaseAddress = NULL;
		m_hFile = NULL;
		m_hMapFile = NULL;
	}

	void InitCache() 
	{
		
		m_nGlyphWidth  = m_nMaxX - m_nMinX + 3;
		m_nGlyphHeight = m_nMaxY - m_nMinY + 3;

		if ( m_nGlyphHeight > 1000 || m_nGlyphWidth > 1000 )
		{
			m_nGlyphSize  = 0;
			m_nCacheSets  = 0;
			m_nCacheAssoc = 0;
			m_pCache      = NULL;
			m_pCacheTags  = NULL;

			return;
		}

		if ( m_bAntiAliasing ) 
		{
			m_nGlyphSize = m_nGlyphWidth * m_nGlyphHeight; 
		} 
		else 
		{
			m_nGlyphSize = ((m_nGlyphWidth + 7) >> 3) * m_nGlyphHeight; 
		}

		m_nCacheAssoc = 8;
		if ( m_nGlyphSize <= 256 ) 
		{
			m_nCacheSets = 8;
		} 
		else if ( m_nGlyphSize <= 512 ) 
		{
			m_nCacheSets = 4;
		} 
		else if ( m_nGlyphSize <= 1024 ) 
		{
			m_nCacheSets = 2;
		} 
		else 
		{
			m_nCacheSets = 1;
		}
		m_pCache     = (unsigned char *)malloc( m_nCacheSets * m_nCacheAssoc * m_nGlyphSize );
		m_pCacheTags = (TFontCacheTag *)malloc( m_nCacheSets * m_nCacheAssoc * sizeof(TFontCacheTag) );

		for ( int nIndex = 0; nIndex < m_nCacheSets * m_nCacheAssoc; ++nIndex ) 
		{
			m_pCacheTags[nIndex].nMRU = nIndex & (m_nCacheAssoc - 1);
		}
	}
	void ClearCache()
	{
		if ( m_pCache ) 
		{
			free( m_pCache );
		}
		if ( m_pCacheTags ) 
		{
			free( m_pCacheTags );
		}

		InitCache();
	}

	virtual BOOL GetGlyph(int nCode, int nFracX, int nFracY, TGlyphBitmap *pBitmap)
	{
		
		if ( !m_bAntiAliasing || m_nGlyphHeight > 50 ) 
		{
			nFracX = nFracY = 0;
		}

		
		int nI = ( nCode & (m_nCacheSets - 1) ) * m_nCacheAssoc;
		for ( int nJ = 0; nJ < m_nCacheAssoc; ++nJ ) 
		{
			if ( ( m_pCacheTags[nI + nJ].nMRU & 0x80000000 ) && m_pCacheTags[nI + nJ].nCode == nCode && (int)m_pCacheTags[nI + nJ].nFracX == nFracX && (int)m_pCacheTags[nI + nJ].nFracY == nFracY ) 
			{
				pBitmap->nX      = m_pCacheTags[nI + nJ].nX;
				pBitmap->nY      = m_pCacheTags[nI + nJ].nY;
				pBitmap->nWidth  = m_pCacheTags[nI + nJ].nWidth;
				pBitmap->nHeight = m_pCacheTags[nI + nJ].nHeight;

				for ( int nK = 0; nK < m_nCacheAssoc; ++nK ) 
				{
					if ( nK != nJ && ( m_pCacheTags[nI + nK].nMRU & 0x7fffffff ) < ( m_pCacheTags[nI + nJ].nMRU & 0x7fffffff ) ) 
					{
						++m_pCacheTags[nI + nK].nMRU;
					}
				}

				m_pCacheTags[nI + nJ].nMRU = 0x80000000;

				pBitmap->bAA       = m_bAntiAliasing;
				pBitmap->pData     = m_pCache + (nI + nJ) * m_nGlyphSize;
				pBitmap->bFreeData = FALSE;
				return TRUE;
			}
		}

		
		TGlyphBitmap oNewBitmap;
		if ( !MakeGlyph( nCode, nFracX, nFracY, &oNewBitmap ) ) 
		{
			return FALSE;
		}

		
		if ( oNewBitmap.nWidth > m_nGlyphWidth || oNewBitmap.nHeight > m_nGlyphHeight ) 
		{
			*pBitmap = oNewBitmap;
			return TRUE;
		}

		
		int nSize = 0;
		if ( m_bAntiAliasing ) 
		{
			nSize = oNewBitmap.nWidth * oNewBitmap.nHeight;
		} 
		else 
		{
			nSize = ((oNewBitmap.nWidth + 7) >> 3) * oNewBitmap.nHeight;
		}

		unsigned char *pBuffer = NULL;
		for ( int nJ = 0; nJ < m_nCacheAssoc; ++nJ ) 
		{
			if ( ( m_pCacheTags[nI + nJ].nMRU & 0x7fffffff ) == m_nCacheAssoc - 1 ) 
			{
				m_pCacheTags[nI + nJ].nMRU    = 0x80000000;
				m_pCacheTags[nI + nJ].nCode   = nCode;
				m_pCacheTags[nI + nJ].nFracX  = (short)nFracX;
				m_pCacheTags[nI + nJ].nFracY  = (short)nFracY;
				m_pCacheTags[nI + nJ].nX      = oNewBitmap.nX;
				m_pCacheTags[nI + nJ].nY      = oNewBitmap.nY;
				m_pCacheTags[nI + nJ].nWidth  = oNewBitmap.nWidth;
				m_pCacheTags[nI + nJ].nHeight = oNewBitmap.nHeight;

				pBuffer = m_pCache + (nI + nJ) * m_nGlyphSize;
				memcpy( pBuffer, oNewBitmap.pData, nSize );
			} 
			else 
			{
				++m_pCacheTags[nI + nJ].nMRU;
			}
		}

		*pBitmap = oNewBitmap;

		pBitmap->pData     = pBuffer;
		pBitmap->bFreeData = FALSE;

		if ( oNewBitmap.bFreeData ) 
		{
			free( oNewBitmap.pData );
		}
		return TRUE;
	}

	virtual BOOL MakeGlyph(int nCode, int nFracX, int nFracY, TGlyphBitmap *pBitmap)
	{
		FT_Int unGID = SetCMapForCharCode2( nCode );
		if ( unGID <= 0 )
			return FALSE;

		m_pFace->size = m_pSize;

		FT_Vector oOffset;
		oOffset.x = (FT_Pos)(int)( (double)nFracX * FONT_FRACTION_MULT * 64 );
		oOffset.y = 0;

		FT_GlyphSlot pGlyphSlot = m_pFace->glyph;

		
		if (m_pDefaultFont)
			m_pDefaultFont->UpdateMatrix2();
		UpdateMatrix2();

		if ( FT_Load_Glyph( m_pFace, unGID, LOAD_MODE ) ) 
		{
			return FALSE;
		}

		if ( FT_Render_Glyph( pGlyphSlot, REND_MODE  ) ) 
		{
			return FALSE;
		}

		pBitmap->nX      = pGlyphSlot->bitmap_left;
		pBitmap->nY      = pGlyphSlot->bitmap_top;
		pBitmap->nWidth  = pGlyphSlot->bitmap.width;
		pBitmap->nHeight = pGlyphSlot->bitmap.rows;
		pBitmap->bAA     = m_bAntiAliasing;

		int nRowSize = 0;
		if ( m_bAntiAliasing ) 
		{
			if ( m_bNeedDoBold )
				pBitmap->nWidth++;

			nRowSize = pBitmap->nWidth;
		} 
		else 
		{
			nRowSize = (pBitmap->nWidth + 7) >> 3;
		}

		pBitmap->pData = (unsigned char *)malloc( nRowSize * pBitmap->nHeight );
		pBitmap->bFreeData = TRUE;

		int nIndex;
		unsigned char *pDstBuffer, *pSrcBuffer;

		if ( !m_bNeedDoBold || !m_bAntiAliasing )
		{
			for ( nIndex = 0, pDstBuffer = pBitmap->pData, pSrcBuffer = pGlyphSlot->bitmap.buffer; nIndex < pBitmap->nHeight; ++nIndex, pDstBuffer += nRowSize, pSrcBuffer += pGlyphSlot->bitmap.pitch ) 
			{
				memcpy( pDstBuffer, pSrcBuffer, nRowSize );
			}
		}
		else
		{
			int nY, nX;
			for ( nY = 0, pDstBuffer = pBitmap->pData, pSrcBuffer = pGlyphSlot->bitmap.buffer; nY < pBitmap->nHeight; ++nY, pDstBuffer += nRowSize, pSrcBuffer += pGlyphSlot->bitmap.pitch ) 
			{
				for ( nX = pBitmap->nWidth - 1; nX >= 0; nX-- )
				{
					if ( 0 != nX )
					{
						int nFirstByte, nSecondByte;

						if ( pBitmap->nWidth - 1 == nX )
							nFirstByte = 0;
						else
							nFirstByte = pSrcBuffer[nX];

						nSecondByte = pSrcBuffer[nX - 1];

						pDstBuffer[nX] = min( 255, nFirstByte + nSecondByte);

					}
					else
					{
						pDstBuffer[nX] = pSrcBuffer[nX];
					}
				}
			}

		}

		return TRUE;
	}

	virtual BOOL GetString(CGlyphString *pString)
	{
		if ( pString->GetLength() <= 0 )
			return TRUE;

		unsigned int unPrevGID = 0;
		float fPenX = 0, fPenY = 0;

		FT_Face pSrcFace = m_pFace;

		FT_Face pDefFace = NULL;
		CFreeTypeFont *pDefFont = NULL;
		if ( m_pDefaultFont )
		{
			pDefFont = m_pDefaultFont;
			pDefFace = m_pDefaultFont->m_pFace;
		}

		
		if ( pDefFont )
			pDefFont->UpdateMatrix1();
		UpdateMatrix1();

		for ( int nIndex = 0; nIndex < pString->GetLength(); nIndex++ )
		{
			FT_Face pFace = pSrcFace;
			TGlyph *pCurGlyph = pString->GetAt( nIndex );

			unsigned short ushUnicode = (unsigned short)pCurGlyph->lUnicode;
			int nCacheIndex = FindInSizesCache( ushUnicode );
			unsigned int unGID = 0;

			if ( 0xFFFF == nCacheIndex )
			{
				int nCMapIndex = 0;
				unGID = (unsigned int)SetCMapForCharCode( ushUnicode, &nCMapIndex );
				TFontCacheSizes oSizes;
				oSizes.ushUnicode = ushUnicode;

				if ( !( ( unGID > 0 ) || ( -1 != m_nSymbolic && ( ushUnicode < 0xF000 )  && 0 < ( unGID = (unsigned int)SetCMapForCharCode( ushUnicode + 0xF000, &nCMapIndex ) ) ) ) )
				{
					
					if ( FALSE == m_bUseDefaultFont || NULL == pDefFont || 0 >= ( unGID = pDefFont->SetCMapForCharCode( ushUnicode, &nCMapIndex ) )  )
					{
						if ( m_nDefaultChar < 0 )
						{
							oSizes.ushGID    = -1;
							oSizes.eState    = glyphstateMiss;
							oSizes.fAdvanceX = (float)(pSrcFace->size->metrics.max_advance >> 6) / 2.f;

							
							pString->SetStartPoint( nIndex, fPenX, fPenY );
							pString->SetBBox( nIndex, 0, 0, 0, 0 );
							pString->SetState( nIndex, glyphstateMiss );

							FT_Fixed lAdv = 0;

							fPenX += oSizes.fAdvanceX + m_fCharSpacing;
							unPrevGID = 0;

							continue;
						}
						else
						{
							unGID = m_nDefaultChar;
							oSizes.eState = glyphstateNormal;
							pString->SetState( nIndex, glyphstateNormal );
							pFace = pSrcFace;
						}
					}
					else
					{
						oSizes.eState = glyphstateDeafault;

						pString->SetState( nIndex, glyphstateDeafault );
						pFace = pDefFace;
					}
				}
				else
				{
					oSizes.eState = glyphstateNormal;

					pString->SetState( nIndex, glyphstateNormal );
					pFace = pSrcFace;
				}
				oSizes.ushGID     = unGID;
				oSizes.nCMapIndex = nCMapIndex;

				if ( m_bUseKerning && unPrevGID && ( nIndex >= 0 && pString->GetAt( nIndex )->eState == pString->GetAt( nIndex - 1 )->eState ) )
				{
					FT_Vector oDelta;
					FT_Get_Kerning( pFace, unPrevGID, unGID, FT_KERNING_DEFAULT, &oDelta );
					fPenX += (float)(oDelta.x >> 6);
				}

				float fX = pString->m_fX + fPenX;
				float fY = pString->m_fY + fPenY;

				
				float fXX = (float)(pString->m_arrCTM[4] + fX * pString->m_arrCTM[0] + fY * pString->m_arrCTM[2] - pString->m_fX );
				float fYY = (float)(pString->m_arrCTM[5] + fX * pString->m_arrCTM[1] + fY * pString->m_arrCTM[3] - pString->m_fY );

				pString->SetStartPoint( nIndex, fXX, fYY);

				if ( FT_Load_Glyph( pFace, unGID, LOAD_MODE ) )
				{
					pString->SetStartPoint( nIndex, -0xFFFF, -0xFFFF );
					pString->SetState( nIndex, glyphstateMiss );
					continue;
				}

				FT_Glyph pGlyph = NULL;
				if ( FT_Get_Glyph( pFace->glyph, &pGlyph ) )
				{
					pString->SetStartPoint( nIndex, -0xFFFF, -0xFFFF );
					pString->SetState( nIndex, glyphstateMiss );
					continue;
				}

				FT_BBox oBBox;
				FT_Glyph_Get_CBox( pGlyph, ft_glyph_bbox_gridfit, &oBBox );
				FT_Done_Glyph( pGlyph );

				oSizes.fAdvanceX = (float)(pFace->glyph->linearHoriAdvance * m_dUnitsKoef / pFace->units_per_EM);
				oSizes.oBBox.fMinX = (float)(oBBox.xMin >> 6);
				oSizes.oBBox.fMaxX = (float)(oBBox.xMax >> 6);
				oSizes.oBBox.fMinY = (float)(oBBox.yMin >> 6);
				oSizes.oBBox.fMaxY = (float)(oBBox.yMax >> 6);

				oSizes.oMetrics.fHeight       = (float)(pFace->glyph->metrics.height       >> 6);
				oSizes.oMetrics.fHoriAdvance  = (float)(pFace->glyph->metrics.horiAdvance  >> 6);
				oSizes.oMetrics.fHoriBearingX = (float)(pFace->glyph->metrics.horiBearingX >> 6);
				oSizes.oMetrics.fHoriBearingY = (float)(pFace->glyph->metrics.horiBearingY >> 6);
				oSizes.oMetrics.fVertAdvance  = (float)(pFace->glyph->metrics.vertAdvance  >> 6);
				oSizes.oMetrics.fVertBearingX = (float)(pFace->glyph->metrics.vertBearingX >> 6);
				oSizes.oMetrics.fVertBearingY = (float)(pFace->glyph->metrics.vertBearingY >> 6);
				oSizes.oMetrics.fWidth        = (float)(pFace->glyph->metrics.width        >> 6);

				oSizes.bBitmap = false;
				oSizes.oBitmap.nX        = 0;
				oSizes.oBitmap.nY        = 0;
				oSizes.oBitmap.nHeight   = 0;
				oSizes.oBitmap.nWidth    = 0;
				oSizes.oBitmap.bFreeData = FALSE;
				oSizes.oBitmap.pData     = NULL;
				oSizes.oBitmap.bAA       = FALSE;

				pString->SetMetrics( nIndex, oSizes.oMetrics.fWidth, oSizes.oMetrics.fHeight, oSizes.oMetrics.fHoriAdvance, oSizes.oMetrics.fHoriBearingX, oSizes.oMetrics.fHoriBearingY, oSizes.oMetrics.fVertAdvance, oSizes.oMetrics.fVertBearingX, oSizes.oMetrics.fVertBearingY );
				pString->SetBBox( nIndex, oSizes.oBBox.fMinX, oSizes.oBBox.fMaxY, oSizes.oBBox.fMaxX, oSizes.oBBox.fMinY );
				

				fPenX    += oSizes.fAdvanceX + m_fCharSpacing;
				if ( m_bNeedDoBold )
				{
					
					fPenX += 1;
				}
				AddToSizesCache( oSizes );
			}
			else
			{
				TFontCacheSizes oSizes = m_oCacheSizes.Get(nCacheIndex);

				int nCMapIndex     = oSizes.nCMapIndex;
				unGID              = oSizes.ushGID;
				EGlyphState eState = oSizes.eState;

				if ( glyphstateMiss == eState )
				{
					pString->SetStartPoint( nIndex, fPenX, fPenY );
					pString->SetBBox( nIndex, 0, 0, 0, 0 );
					pString->SetState( nIndex, glyphstateMiss );

					FT_Fixed lAdv = 0;

					fPenX += oSizes.fAdvanceX + m_fCharSpacing;		
					unPrevGID = 0;

					continue;
				}
				else if ( glyphstateDeafault == eState )
				{
					pString->SetState( nIndex, glyphstateDeafault );
					pFace = pDefFace;
				}
				else 
				{
					pString->SetState( nIndex, glyphstateNormal );
					pFace = pSrcFace;
				}

				if ( 0 != pFace->num_charmaps )
				{
					int nCurCMapIndex = FT_Get_Charmap_Index( pFace->charmap );
					if ( nCurCMapIndex != nCMapIndex )
					{
						nCMapIndex = max( 0, nCMapIndex );
						FT_Set_Charmap( pFace, pFace->charmaps[nCMapIndex] );
					}
				}

				if ( m_bUseKerning && unPrevGID && ( nIndex >= 0 && pString->GetAt( nIndex )->eState == pString->GetAt( nIndex - 1 )->eState ) )
				{
					FT_Vector oDelta;
					FT_Get_Kerning( pFace, unPrevGID, unGID, FT_KERNING_DEFAULT, &oDelta );
					fPenX += (float)(oDelta.x >> 6);
				}

				float fX = pString->m_fX + fPenX;
				float fY = pString->m_fY + fPenY;

				
				float fXX = (float)(pString->m_arrCTM[4] + fX * pString->m_arrCTM[0] + fY * pString->m_arrCTM[2] - pString->m_fX );
				float fYY = (float)(pString->m_arrCTM[5] + fX * pString->m_arrCTM[1] + fY * pString->m_arrCTM[3] - pString->m_fY );

				pString->SetStartPoint( nIndex, fXX, fYY);

				pString->SetMetrics( nIndex, oSizes.oMetrics.fWidth, oSizes.oMetrics.fHeight, oSizes.oMetrics.fHoriAdvance, oSizes.oMetrics.fHoriBearingX, oSizes.oMetrics.fHoriBearingY, oSizes.oMetrics.fVertAdvance, oSizes.oMetrics.fVertBearingX, oSizes.oMetrics.fVertBearingY );
				pString->SetBBox( nIndex, oSizes.oBBox.fMinX, oSizes.oBBox.fMaxY, oSizes.oBBox.fMaxX, oSizes.oBBox.fMinY );
				fPenX += oSizes.fAdvanceX + m_fCharSpacing;

				if ( m_bNeedDoBold )
				{
					
					fPenX += 1;
				}

				oSizes.bBitmap = false;
				oSizes.oBitmap.nX        = 0;
				oSizes.oBitmap.nY        = 0;
				oSizes.oBitmap.nHeight   = 0;
				oSizes.oBitmap.nWidth    = 0;
				oSizes.oBitmap.bFreeData = FALSE;
				oSizes.oBitmap.pData     = NULL;
				oSizes.oBitmap.bAA       = FALSE;
				
				

			}
			unPrevGID = unGID;
		}

		pString->m_fEndX = fPenX + pString->m_fX;
		pString->m_fEndY = fPenY + pString->m_fY;

		if ( pDefFont )
			pDefFont->UpdateMatrix2();
		UpdateMatrix2();

		return TRUE;
	}

	virtual BOOL GetString2(CGlyphString *pString)
	{
		if ( pString->GetLength() <= 0 )
			return TRUE;

		unsigned int unPrevGID = 0;
		float fPenX = 0, fPenY = 0;

		FT_Face pSrcFace = m_pFace;

		FT_Face pDefFace = NULL;
		CFreeTypeFont* pDefFont = NULL;
		if ( m_pDefaultFont )
		{
			pDefFont = m_pDefaultFont;
			pDefFace = m_pDefaultFont->m_pFace;
		}

		for ( int nIndex = 0; nIndex < pString->GetLength(); nIndex++ )
		{
			
			if ( pDefFont )
				pDefFont->UpdateMatrix1();
			UpdateMatrix1();

			FT_Face pFace = pSrcFace;
			TGlyph *pCurGlyph = pString->GetAt( nIndex );

			unsigned short ushUnicode = (unsigned short)pCurGlyph->lUnicode;
			int nCacheIndex = FindInSizesCache( ushUnicode );
			unsigned int unGID = 0;
			
			if ( 0xFFFF == nCacheIndex )
			{
				int nCMapIndex = 0;
				unGID = (unsigned int)SetCMapForCharCode( ushUnicode, &nCMapIndex );
				TFontCacheSizes oSizes;
				oSizes.ushUnicode = ushUnicode;

				if ( !( ( unGID > 0 ) || ( -1 != m_nSymbolic && ( ushUnicode < 0xF000 )  && 0 < ( unGID = (unsigned int)SetCMapForCharCode( ushUnicode + 0xF000, &nCMapIndex ) ) ) ) )
				{
					
					if ( FALSE == m_bUseDefaultFont || NULL == pDefFont || 0 >= ( unGID = pDefFont->SetCMapForCharCode( ushUnicode, &nCMapIndex ) )  )
					{
						if ( m_nDefaultChar < 0 )
						{
							oSizes.ushGID    = -1;
							oSizes.eState    = glyphstateMiss;
							oSizes.fAdvanceX = (float)(pSrcFace->size->metrics.max_advance >> 6) / 2.f;

							
							pString->SetStartPoint( nIndex, fPenX, fPenY );
							pString->SetBBox( nIndex, 0, 0, 0, 0 );
							pString->SetState( nIndex, glyphstateMiss );

							FT_Fixed lAdv = 0;

							fPenX += oSizes.fAdvanceX + m_fCharSpacing;		
							continue;
						}
						else
						{
							unGID = m_nDefaultChar;
							oSizes.eState = glyphstateNormal;

							pString->SetState( nIndex, glyphstateNormal );
							pFace = pSrcFace;
						}
					}
					else
					{
						oSizes.eState = glyphstateDeafault;

						pString->SetState( nIndex, glyphstateDeafault );
						pFace = pDefFace;
					}
				}
				else
				{
					oSizes.eState = glyphstateNormal;

					pString->SetState( nIndex, glyphstateNormal );
					pFace = pSrcFace;
				}
				oSizes.ushGID     = unGID;
				oSizes.nCMapIndex = nCMapIndex;

				if ( m_bUseKerning && unPrevGID && ( nIndex >= 0 && pString->GetAt( nIndex )->eState == pString->GetAt( nIndex - 1 )->eState ) )
				{
					FT_Vector oDelta;
					FT_Get_Kerning( pFace, unPrevGID, unGID, FT_KERNING_DEFAULT, &oDelta );
					fPenX += (float)(oDelta.x >> 6);
				}

				float fX = pString->m_fX + fPenX;
				float fY = pString->m_fY + fPenY;

				
				float fXX = (float)(pString->m_arrCTM[4] + fX * pString->m_arrCTM[0] + fY * pString->m_arrCTM[2] - pString->m_fX );
				float fYY = (float)(pString->m_arrCTM[5] + fX * pString->m_arrCTM[1] + fY * pString->m_arrCTM[3] - pString->m_fY );

				pString->SetStartPoint( nIndex, fXX, fYY);

				if ( pDefFont )
					pDefFont->UpdateMatrix2();
				UpdateMatrix2();

				if ( FT_Load_Glyph( pFace, unGID, LOAD_MODE ) )
				{
					pString->SetStartPoint( nIndex, -0xFFFF, -0xFFFF );
					pString->SetState( nIndex, glyphstateMiss );
					continue;
				}

				FT_Glyph pGlyph = NULL;
				if ( FT_Get_Glyph( pFace->glyph, &pGlyph ) )
				{
					pString->SetStartPoint( nIndex, -0xFFFF, -0xFFFF );
					pString->SetState( nIndex, glyphstateMiss );
					continue;
				}

				FT_BBox oBBox;
				FT_Glyph_Get_CBox( pGlyph, ft_glyph_bbox_gridfit, &oBBox );
				FT_Done_Glyph( pGlyph );

				float fAdvX = (float)(pFace->glyph->linearHoriAdvance * m_dUnitsKoef / pFace->units_per_EM );
				oSizes.fAdvanceX = fAdvX;
				oSizes.oBBox.fMinX = (float)(oBBox.xMin >> 6);
				oSizes.oBBox.fMaxX = (float)(oBBox.xMax >> 6);
				oSizes.oBBox.fMinY = (float)(oBBox.yMin >> 6);
				oSizes.oBBox.fMaxY = (float)(oBBox.yMax >> 6);

				oSizes.oMetrics.fHeight       = (float)(pFace->glyph->metrics.height       >> 6);
				oSizes.oMetrics.fHoriAdvance  = (float)(pFace->glyph->metrics.horiAdvance  >> 6);
				oSizes.oMetrics.fHoriBearingX = (float)(pFace->glyph->metrics.horiBearingX >> 6);
				oSizes.oMetrics.fHoriBearingY = (float)(pFace->glyph->metrics.horiBearingY >> 6);
				oSizes.oMetrics.fVertAdvance  = (float)(pFace->glyph->metrics.vertAdvance  >> 6);
				oSizes.oMetrics.fVertBearingX = (float)(pFace->glyph->metrics.vertBearingX >> 6);
				oSizes.oMetrics.fVertBearingY = (float)(pFace->glyph->metrics.vertBearingY >> 6);
				oSizes.oMetrics.fWidth        = (float)(pFace->glyph->metrics.width        >> 6);

				pString->SetMetrics( nIndex, oSizes.oMetrics.fWidth, oSizes.oMetrics.fHeight, oSizes.oMetrics.fHoriAdvance, oSizes.oMetrics.fHoriBearingX, oSizes.oMetrics.fHoriBearingY, oSizes.oMetrics.fVertAdvance, oSizes.oMetrics.fVertBearingX, oSizes.oMetrics.fVertBearingY );
				pString->SetBBox( nIndex, oSizes.oBBox.fMinX, oSizes.oBBox.fMaxY, oSizes.oBBox.fMaxX, oSizes.oBBox.fMinY );

				fPenX  += oSizes.fAdvanceX + m_fCharSpacing;
				if ( m_bNeedDoBold )
				{
					
					fPenX += 1;
				}

				pCurGlyph->bBitmap  = true;
				FT_GlyphSlot pGlyphSlot = pFace->glyph;
				if ( FT_Render_Glyph( pGlyphSlot, REND_MODE ) ) 
				{
					return FALSE;
				}

				TGlyphBitmap *pBitmap = &(pCurGlyph->oBitmap);
				pBitmap->nX      = pGlyphSlot->bitmap_left;
				pBitmap->nY      = pGlyphSlot->bitmap_top;
				pBitmap->nWidth  = pGlyphSlot->bitmap.width;
				pBitmap->nHeight = pGlyphSlot->bitmap.rows;
				pBitmap->bAA     = m_bAntiAliasing;

				int nRowSize = 0;
				if ( m_bAntiAliasing ) 
				{
					if ( m_bNeedDoBold )
						pBitmap->nWidth++;

					nRowSize = pBitmap->nWidth;
				} 
				else 
				{
					nRowSize = (pBitmap->nWidth + 7) >> 3;
				}

				if (0 != (nRowSize * pBitmap->nHeight))
					pBitmap->pData = (unsigned char *)malloc( nRowSize * pBitmap->nHeight );
				else
					pBitmap->pData = NULL;

				pBitmap->bFreeData = FALSE; 

				int nIndex2;
				unsigned char *pDstBuffer, *pSrcBuffer;

				if (NULL != pBitmap->pData)
				{
					
					if ( !m_bNeedDoBold || !m_bAntiAliasing )
					{
						for ( nIndex2 = 0, pDstBuffer = pBitmap->pData, pSrcBuffer = pGlyphSlot->bitmap.buffer; nIndex2 < pBitmap->nHeight; ++nIndex2, pDstBuffer += nRowSize, pSrcBuffer += pGlyphSlot->bitmap.pitch ) 
						{
							
							
							
							
							memcpy( pDstBuffer, pSrcBuffer, nRowSize );
						}
					}
					else
					{
						int nY, nX;
						for ( nY = 0, pDstBuffer = pBitmap->pData, pSrcBuffer = pGlyphSlot->bitmap.buffer; nY < pBitmap->nHeight; ++nY, pDstBuffer += nRowSize, pSrcBuffer += pGlyphSlot->bitmap.pitch ) 
						{
							for ( nX = pBitmap->nWidth - 1; nX >= 0; nX-- )
							{
								if ( 0 != nX )
								{
									int nFirstByte, nSecondByte;

									if ( pBitmap->nWidth - 1 == nX )
										nFirstByte = 0;
									else
										nFirstByte = pSrcBuffer[nX];

									nSecondByte = pSrcBuffer[nX - 1];

									pDstBuffer[nX] = min( 255, nFirstByte + nSecondByte);

								}
								else
								{
									pDstBuffer[nX] = pSrcBuffer[nX];
								}
							}
						}

					}
				}

				oSizes.bBitmap			 = pCurGlyph->bBitmap;
				oSizes.oBitmap.bAA       = pBitmap->bAA;
				oSizes.oBitmap.bFreeData = pBitmap->bFreeData;
				oSizes.oBitmap.nX        = pBitmap->nX;
				oSizes.oBitmap.nY        = pBitmap->nY;
				oSizes.oBitmap.nWidth    = pBitmap->nWidth;
				oSizes.oBitmap.nHeight   = pBitmap->nHeight;
				oSizes.oBitmap.pData     = pBitmap->pData;

				AddToSizesCache( oSizes );
			}
			else
			{
				TFontCacheSizes oSizes = m_oCacheSizes.Get(nCacheIndex);

				int nCMapIndex     = oSizes.nCMapIndex;
				unGID              = oSizes.ushGID;
				EGlyphState eState = oSizes.eState;

				if ( glyphstateMiss == eState )
				{
					pString->SetStartPoint( nIndex, fPenX, fPenY );
					pString->SetBBox( nIndex, 0, 0, 0, 0 );
					pString->SetState( nIndex, glyphstateMiss );

					FT_Fixed lAdv = 0;

					fPenX += oSizes.fAdvanceX + m_fCharSpacing;		
					unPrevGID = 0;

					continue;
				}
				else if ( glyphstateDeafault == eState )
				{
					pString->SetState( nIndex, glyphstateDeafault );
					pFace = pDefFace;
				}
				else 
				{
					pString->SetState( nIndex, glyphstateNormal );
					pFace = pSrcFace;
				}

				if ( 0 != pFace->num_charmaps )
				{
					int nCurCMapIndex = FT_Get_Charmap_Index( pFace->charmap );
					if ( nCurCMapIndex != nCMapIndex )
					{
						nCMapIndex = max( 0, nCMapIndex );
						FT_Set_Charmap( pFace, pFace->charmaps[nCMapIndex] );
					}
				}

				if ( m_bUseKerning && unPrevGID && ( nIndex >= 0 && pString->GetAt( nIndex )->eState == pString->GetAt( nIndex - 1 )->eState ) )
				{
					FT_Vector oDelta;
					FT_Get_Kerning( pFace, unPrevGID, unGID, FT_KERNING_DEFAULT, &oDelta );
					fPenX += (float)(oDelta.x >> 6);
				}

				float fX = pString->m_fX + fPenX;
				float fY = pString->m_fY + fPenY;

				
				float fXX = (float)(pString->m_arrCTM[4] + fX * pString->m_arrCTM[0] + fY * pString->m_arrCTM[2] - pString->m_fX );
				float fYY = (float)(pString->m_arrCTM[5] + fX * pString->m_arrCTM[1] + fY * pString->m_arrCTM[3] - pString->m_fY );

				pString->SetStartPoint( nIndex, fXX, fYY);

				pString->SetMetrics( nIndex, oSizes.oMetrics.fWidth, oSizes.oMetrics.fHeight, oSizes.oMetrics.fHoriAdvance, oSizes.oMetrics.fHoriBearingX, oSizes.oMetrics.fHoriBearingY, oSizes.oMetrics.fVertAdvance, oSizes.oMetrics.fVertBearingX, oSizes.oMetrics.fVertBearingY );
				pString->SetBBox( nIndex, oSizes.oBBox.fMinX, oSizes.oBBox.fMaxY, oSizes.oBBox.fMaxX, oSizes.oBBox.fMinY );
				fPenX  += oSizes.fAdvanceX + m_fCharSpacing;

				if ( m_bNeedDoBold )
				{
					
					fPenX += 1;
				}

				pCurGlyph->bBitmap = oSizes.bBitmap;
				pCurGlyph->oBitmap = oSizes.oBitmap;
			}
			unPrevGID = unGID;
		}

		pString->m_fEndX = fPenX + pString->m_fX;
		pString->m_fEndY = fPenY + pString->m_fY;

		if ( pDefFont )
			pDefFont->UpdateMatrix2();
		UpdateMatrix2();


		return TRUE;
	}

	virtual short GetAscender()
	{
		return m_pFace->ascender;
	}

	virtual short GetDescender()
	{
		return m_pFace->descender;
	}

	virtual unsigned short GetUnitsPerEm()
	{
		return m_pFace->units_per_EM;
	}

	virtual short GetLineSpacing()
	{
		return m_pFace->height;
	}

	virtual char * GetFamilyName()
	{
		return m_pFace->family_name;
	}

	virtual long GetFacesCount()
	{
		return m_pFace->num_faces;
	}

	virtual long GetFaceIndex()
	{
		return m_pFace->face_index;
	}

	virtual long GetGlyphsCount()
	{
		return m_pFace->num_glyphs;
	}

	virtual char *GetStyleName()
	{
		return m_pFace->style_name;
	}

	virtual short GetUnderlinePosition()
	{
		return m_pFace->underline_position;
	}

	virtual short GetUnderlineThickness()
	{
		return m_pFace->underline_thickness;	
	}

	virtual short GetMaxAdvanceWidth()
	{
		return m_pFace->max_advance_width;
	}

	virtual short GetMaxAdvanceHeight()
	{
		return m_pFace->max_advance_height;
	}

	virtual void GetBBox(long *plMinX, long *plMinY, long *plMaxX, long *plMaxY)
	{
		*plMinX = m_pFace->bbox.xMin;
		*plMinY = m_pFace->bbox.yMin;
		*plMaxX = m_pFace->bbox.xMax;
		*plMaxY = m_pFace->bbox.yMax;
	}

	virtual bool IsCharAvailable(long lUnicode)
	{
		return ( SetCMapForCharCode2( lUnicode ) > 0 );
	}

	virtual void SetSizeAndDpi(float fSize, unsigned int unHorDpi, unsigned int unVerDpi)
	{
		if ( m_pDefaultFont )
		{
			m_pDefaultFont->SetSizeAndDpi( fSize, unHorDpi, unVerDpi );
		}

		ClearCache();
		ClearSizesCache();

		float fOldSize = m_fSize;
		float fNewSize = fSize;
		float fKoef    = fNewSize / fOldSize;

		if ( fKoef > 1.001 || fKoef < 0.999 || unHorDpi != m_unHorDpi || unVerDpi != m_unVerDpi )
		{
			m_unHorDpi = unHorDpi;
			m_unVerDpi = unVerDpi;

			if ( fKoef > 1.001 || fKoef < 0.999 )
			{
				m_fSize    = fNewSize;
				UpdateMatrix0();
			}

			m_dUnitsKoef = m_unHorDpi / 72.0 * m_fSize;

			
			if ( FT_Set_Char_Size( m_pFace, 0, (int)(fNewSize * 64), unHorDpi, unVerDpi ) ) 
			{
				return;
			}
		}
	}

	virtual const char *GetFontFormat()
	{
		return FT_Get_X11_Font_Format(m_pFace);
	}

	virtual int IsUnicodeRangeAvailable(unsigned long ulBit, unsigned int un4ByteIndex)
	{
		FT_Face pFace = m_pFace;
		TT_OS2 *pOs2 = (TT_OS2 *)FT_Get_Sfnt_Table( pFace, ft_sfnt_os2 );
		if ( NULL == pOs2 || 0xFFFF == pOs2->version )
			return -1;

		int nResult = 0;

		unsigned long ulMult = 1;
		for ( unsigned long ulIndex = 0; ulIndex < ulBit; ulIndex++ )
			ulMult <<= 1;

		switch(un4ByteIndex)
		{
		case 0: if ( pOs2->ulUnicodeRange1  & ulMult ) nResult = 1; break;
		case 1: if ( pOs2->ulUnicodeRange2  & ulMult ) nResult = 1; break;
		case 2: if ( pOs2->ulUnicodeRange3  & ulMult ) nResult = 1; break;
		case 3: if ( pOs2->ulUnicodeRange4  & ulMult ) nResult = 1; break;
		case 4: if ( pOs2->ulCodePageRange1 & ulMult ) nResult = 1; break;
		case 5: if ( pOs2->ulCodePageRange2 & ulMult ) nResult = 1; break;
		}

		
		
		
		
		
		
		
		
		
		
		
		

		if ( 4 == un4ByteIndex && 0 == nResult )
		{
			for( int nIndex = 0; nIndex < pFace->num_charmaps; nIndex++ )
			{
				
				if ( 31 == ulBit && 0 == pFace->charmaps[nIndex]->encoding_id && 3 == pFace->charmaps[nIndex]->platform_id )
				{
					nResult = 1;
					break;
				}

				
				if ( 17 == ulBit && 2 == pFace->charmaps[nIndex]->encoding_id && 3 == pFace->charmaps[nIndex]->platform_id )
				{
					nResult = 1;
					break;
				}

				
				if ( 18 == ulBit && 3 == pFace->charmaps[nIndex]->encoding_id && 3 == pFace->charmaps[nIndex]->platform_id )
				{
					nResult = 1;
					break;
				}

				
				if ( 20 == ulBit && 4 == pFace->charmaps[nIndex]->encoding_id && 3 == pFace->charmaps[nIndex]->platform_id )
				{
					nResult = 1;
					break;
				}

				
				if ( 19 == ulBit && 5 == pFace->charmaps[nIndex]->encoding_id && 3 == pFace->charmaps[nIndex]->platform_id )
				{
					nResult = 1;
					break;
				}

				
				if ( 21 == ulBit && 6 == pFace->charmaps[nIndex]->encoding_id && 3 == pFace->charmaps[nIndex]->platform_id )
				{
					nResult = 1;
					break;
				}
			}
		}

		return nResult;
	}

	virtual unsigned long GetCodeByGID(unsigned short unGID)
	{
		FT_Face pFace = m_pFace;

		if ( 0 == pFace->num_charmaps )
			return unGID;

		int nCharCode = 0;

		if ( !pFace )
			return nCharCode;

		for ( int nIndex = 0; nIndex < pFace->num_charmaps; nIndex++ )
		{
			FT_CharMap pCharMap = pFace->charmaps[nIndex];

			if ( FT_Set_Charmap( pFace, pCharMap ) )
				continue;

			FT_ULong unCharCode;
			FT_UInt  unCurGID;         
	        
			unCharCode = FT_Get_First_Char( pFace, &unCurGID );

			while ( unCurGID != 0 )                                            
			{                                                                
				if ( unGID == unCurGID )
					return unCharCode;

				unCharCode = FT_Get_Next_Char( pFace, unCharCode, &unCurGID );        
			}                                                                
		}

		return 0;
	}

	virtual void GetPanose(char **ppPanose)
	{
		TT_OS2 *pTable = (TT_OS2 *)FT_Get_Sfnt_Table( m_pFace, ft_sfnt_os2 );

		::memset( *ppPanose, 0x00, 10 );
		if ( NULL == pTable )
			return;

		::memcpy( *ppPanose, pTable->panose, 10 );
	}

	virtual bool IsFixedWidth()
	{
		return FT_IS_FIXED_WIDTH( m_pFace ) != 0;
	}

	virtual unsigned short GetNameIndex(char *sName)
	{
		unsigned int unGID = FT_Get_Name_Index( m_pFace, sName );
		return unGID;
	}

	virtual void SetStringGID(BOOL bGID)
	{
		if ( m_bStringGID == bGID )
			return;

		ClearSizesCache();
		m_bStringGID = bGID;
	}

	virtual BOOL GetStringGID()
	{
		return m_bStringGID;
	}

	virtual void ResetFontMatrix()
	{
		if ( m_pDefaultFont )
		{
			m_pDefaultFont->ResetFontMatrix();
		}

		if ( m_bNeedDoItalic )
		{
			m_arrdFontMatrix[0] = 1;
			m_arrdFontMatrix[1] = 0;
			m_arrdFontMatrix[2] = FONT_ITALIC_ANGLE;
			m_arrdFontMatrix[3] = 1;
			m_arrdFontMatrix[4] = 0;
			m_arrdFontMatrix[5] = 0;
		}
		else
		{
			m_arrdFontMatrix[0] = 1;
			m_arrdFontMatrix[1] = 0;
			m_arrdFontMatrix[2] = 0;
			m_arrdFontMatrix[3] = 1;
			m_arrdFontMatrix[4] = 0;
			m_arrdFontMatrix[5] = 0;
		}

		UpdateMatrix0();
	}

	virtual void ResetTextMatrix()
	{
		if ( m_pDefaultFont )
		{
			m_pDefaultFont->ResetTextMatrix();
		}

		m_arrdTextMatrix[0] = 1;
		m_arrdTextMatrix[1] = 0;
		m_arrdTextMatrix[2] = 0;
		m_arrdTextMatrix[3] = 1;
		m_arrdTextMatrix[4] = 0;
		m_arrdTextMatrix[5] = 0;
	}

	virtual void ApplyTransform(float fA, float fB, float fC, float fD, float fE, float fF)
	{
		if ( m_pDefaultFont )
		{
			m_pDefaultFont->ApplyTransform( fA, fB, fC, fD, fE, fF );
		}

		double arrTemp[6] = { m_arrdFontMatrix[0], m_arrdFontMatrix[1], m_arrdFontMatrix[2], m_arrdFontMatrix[3] };

		m_arrdFontMatrix[0] = arrTemp[0] * fA + arrTemp[1] * fC;
		m_arrdFontMatrix[1] = arrTemp[0] * fB + arrTemp[1] * fD;
		m_arrdFontMatrix[2] = arrTemp[2] * fA + arrTemp[3] * fC;
		m_arrdFontMatrix[3] = arrTemp[2] * fB + arrTemp[3] * fD;
		m_arrdFontMatrix[4] = arrTemp[4] * fA + arrTemp[5] * fC + fE;
		m_arrdFontMatrix[5] = arrTemp[4] * fB + arrTemp[5] * fD + fF;

		UpdateMatrix0();
	}

	virtual void SetFontMatrix(float fA, float fB, float fC, float fD, float fE, float fF)
	{
		if ( m_pDefaultFont )
		{
			m_pDefaultFont->SetFontMatrix( fA, fB, fC, fD, fE, fF );
		}

		if ( m_bNeedDoItalic ) 
		{
			m_arrdFontMatrix[0] = fA;
			m_arrdFontMatrix[1] = fB;
			m_arrdFontMatrix[2] = fC + fA * FONT_ITALIC_ANGLE;
			m_arrdFontMatrix[3] = fD + fB * FONT_ITALIC_ANGLE;
			m_arrdFontMatrix[4] = fE;
			m_arrdFontMatrix[5] = fF;
		}
		else
		{
			m_arrdFontMatrix[0] = fA;
			m_arrdFontMatrix[1] = fB;
			m_arrdFontMatrix[2] = fC;
			m_arrdFontMatrix[3] = fD;
			m_arrdFontMatrix[4] = fE;
			m_arrdFontMatrix[5] = fF;
		}

		ClearSizesCache();
	}

	virtual void SetTextMatrix(float fA, float fB, float fC, float fD, float fE, float fF)
	{
		if ( m_pDefaultFont )
		{
			m_pDefaultFont->SetTextMatrix( fA, fB, fC, fD, fE, fF );
		}

		m_arrdTextMatrix[0] =  fA;
		m_arrdTextMatrix[1] = -fB;
		m_arrdTextMatrix[2] = -fC;
		m_arrdTextMatrix[3] =  fD;
		m_arrdTextMatrix[4] =  fE;
		m_arrdTextMatrix[5] =  fF;

		ClearSizesCache();
	}

	int GetSymbolic()
	{
		return m_nSymbolic;
	}

public:

	int SetCMapForCharCode(long lUnicode, int *pnCMapIndex)
	{
		*pnCMapIndex = -1;

		if ( m_bStringGID || 0 == m_pFace->num_charmaps )
			return lUnicode;

		int nCharIndex = 0;

		if ( !m_pFace )
			return nCharIndex;

		for ( int nIndex = 0; nIndex < m_pFace->num_charmaps; nIndex++ )
		{
			FT_CharMap pCharMap = m_pFace->charmaps[nIndex];

			if ( FT_Set_Charmap( m_pFace, pCharMap ) )
				continue;

			FT_Encoding pEncoding = pCharMap->encoding;

			if ( FT_ENCODING_UNICODE == pEncoding )
			{
				if ( nCharIndex = FT_Get_Char_Index( m_pFace, lUnicode ) )
				{
					*pnCMapIndex = nIndex;
					return nCharIndex;
				}
			}
			else if ( FT_ENCODING_NONE == pEncoding || FT_ENCODING_MS_SYMBOL == pEncoding || FT_ENCODING_APPLE_ROMAN == pEncoding )
			{
				FT_ULong  charcode;
				FT_UInt   gindex;


				charcode = FT_Get_First_Char( m_pFace, &gindex );                   
				while ( gindex != 0 )                                            
				{                                                               
					charcode = FT_Get_Next_Char( m_pFace, charcode, &gindex );       
					if ( charcode == lUnicode )
					{
						nCharIndex = gindex;
						*pnCMapIndex = nIndex;
						break;
					}
				}                                                               

				if ( nCharIndex = FT_Get_Char_Index( m_pFace, lUnicode ) )
				{
					*pnCMapIndex = nIndex;
				}
			}
		}

		return nCharIndex;
	}
	int SetCMapForCharCode2(long lUnicode)
	{
		if ( m_bStringGID )
			return lUnicode;

		FT_Int unGID;
		int nCMapIndex = 0;
		int nCacheIndex = m_arrCacheSizesIndexs[(unsigned short)lUnicode];
		if ( 0xFFFF == nCacheIndex )
		{
			return unGID = SetCMapForCharCode( lUnicode, &nCMapIndex );
		}
		else
		{
			TFontCacheSizes oSizes = m_oCacheSizes.Get(nCacheIndex);
			unGID = oSizes.ushGID;
			nCMapIndex = oSizes.nCMapIndex;
			if ( 0 != m_pFace->num_charmaps )
			{
				int nCurCMapIndex = FT_Get_Charmap_Index( m_pFace->charmap );
				if ( nCurCMapIndex != nCMapIndex )
				{
					nCMapIndex = max( 0, nCMapIndex );
					FT_Set_Charmap( m_pFace, m_pFace->charmaps[nCMapIndex] );
				}
			}
		}

		return unGID;
	}
	inline void UpdateMatrix0()
	{
		FT_Face pFace = m_pFace;

		double dSize = m_fSize;

		m_dTextScale = sqrt( m_arrdTextMatrix[2] * m_arrdTextMatrix[2] + m_arrdTextMatrix[3] * m_arrdTextMatrix[3] );

		double dDiv = pFace->bbox.xMax > 20000 ? 65536 : 1;

		

		if ( pFace->units_per_EM == 0 )
			pFace->units_per_EM = 2048;

		int nX = (int)((m_arrdFontMatrix[0] * pFace->bbox.xMin + m_arrdFontMatrix[2] * pFace->bbox.yMin) * dSize / (dDiv * pFace->units_per_EM));
		m_nMinX = m_nMaxX = nX;

		int nY = (int)((m_arrdFontMatrix[1] * pFace->bbox.xMin + m_arrdFontMatrix[3] * pFace->bbox.yMin) * dSize / (dDiv * pFace->units_per_EM));
		m_nMinY = m_nMaxY = nY;

		nX = (int)((m_arrdFontMatrix[0] * pFace->bbox.xMin + m_arrdFontMatrix[2] * pFace->bbox.yMax) * dSize / (dDiv * pFace->units_per_EM));

		if ( nX < m_nMinX ) 
		{
			m_nMinX = nX;
		} 
		else if ( nX > m_nMaxX ) 
		{
			m_nMaxX = nX;
		}

		nY = (int)((m_arrdFontMatrix[1] * pFace->bbox.xMin + m_arrdFontMatrix[3] * pFace->bbox.yMax) * dSize / (dDiv * pFace->units_per_EM));

		if ( nY < m_nMinY ) 
		{
			m_nMinY = nY;
		} 
		else if ( nY > m_nMaxY ) 
		{
			m_nMaxY = nY;
		}

		nX = (int)((m_arrdFontMatrix[0] * pFace->bbox.xMax + m_arrdFontMatrix[2] * pFace->bbox.yMin) * dSize / (dDiv * pFace->units_per_EM));
		if ( nX < m_nMinX ) 
		{
			m_nMinX = nX;
		} 
		else if ( nX > m_nMaxX ) 
		{
			m_nMaxX = nX;
		}

		nY = (int)((m_arrdFontMatrix[1] * pFace->bbox.xMax + m_arrdFontMatrix[3] * pFace->bbox.yMin) * dSize / (dDiv * pFace->units_per_EM));
		if ( nY < m_nMinY ) 
		{
			m_nMinY = nY;
		} 
		else if ( nY > m_nMaxY ) 
		{
			m_nMaxY = nY;
		}

		nX = (int)((m_arrdFontMatrix[0] * pFace->bbox.xMax + m_arrdFontMatrix[2] * pFace->bbox.yMax) * dSize / (dDiv * pFace->units_per_EM));
		if ( nX < m_nMinX ) 
		{
			m_nMinX = nX;
		} 
		else if ( nX > m_nMaxX ) 
		{
			m_nMaxX = nX;
		}

		nY = (int)((m_arrdFontMatrix[1] * pFace->bbox.xMax + m_arrdFontMatrix[3] * pFace->bbox.yMax) * dSize / (dDiv * pFace->units_per_EM));
		if ( nY < m_nMinY ) 
		{
			m_nMinY = nY;
		} 
		else if ( nY > m_nMaxY ) 
		{
			m_nMaxY = nY;
		}

		
		if ( m_nMaxX == m_nMinX ) 
		{
			m_nMinX = 0;
			m_nMaxX = (int)dSize;
		}

		if ( m_nMaxY == m_nMinY ) 
		{
			m_nMinY = 0;
			m_nMaxY = (int)((double)1.2 * dSize);
		}

		
		m_oFontMatrix.xx = (FT_Fixed)(m_arrdFontMatrix[0] * 65536);
		m_oFontMatrix.yx = (FT_Fixed)(m_arrdFontMatrix[1] * 65536);
		m_oFontMatrix.xy = (FT_Fixed)(m_arrdFontMatrix[2] * 65536);
		m_oFontMatrix.yy = (FT_Fixed)(m_arrdFontMatrix[3] * 65536);

		m_oTextMatrix.xx = (FT_Fixed)((m_arrdTextMatrix[0] / m_dTextScale) * 65536);
		m_oTextMatrix.yx = (FT_Fixed)((m_arrdTextMatrix[1] / m_dTextScale) * 65536);
		m_oTextMatrix.xy = (FT_Fixed)((m_arrdTextMatrix[2] / m_dTextScale) * 65536);
		m_oTextMatrix.yy = (FT_Fixed)((m_arrdTextMatrix[3] / m_dTextScale) * 65536);

		FT_Set_Transform( pFace, &m_oFontMatrix, NULL );
	}
	inline void UpdateMatrix1()
	{
		m_oFontMatrix.xx = (FT_Fixed)(m_arrdFontMatrix[0] * 65536);
		m_oFontMatrix.yx = (FT_Fixed)(m_arrdFontMatrix[1] * 65536);
		m_oFontMatrix.xy = (FT_Fixed)(m_arrdFontMatrix[2] * 65536);
		m_oFontMatrix.yy = (FT_Fixed)(m_arrdFontMatrix[3] * 65536);

		FT_Set_Transform( m_pFace, &m_oFontMatrix, NULL );
	}
	inline void UpdateMatrix2()
	{
		m_oFontMatrix.xx = (FT_Fixed)(( m_arrdFontMatrix[0] * m_arrdTextMatrix[0] + m_arrdFontMatrix[1] * m_arrdTextMatrix[2] ) * 65536);
		m_oFontMatrix.yx = (FT_Fixed)(( m_arrdFontMatrix[0] * m_arrdTextMatrix[1] + m_arrdFontMatrix[1] * m_arrdTextMatrix[3] ) * 65536);
		m_oFontMatrix.xy = (FT_Fixed)(( m_arrdFontMatrix[2] * m_arrdTextMatrix[0] + m_arrdFontMatrix[3] * m_arrdTextMatrix[2] ) * 65536);
		m_oFontMatrix.yy = (FT_Fixed)(( m_arrdFontMatrix[2] * m_arrdTextMatrix[1] + m_arrdFontMatrix[3] * m_arrdTextMatrix[3] ) * 65536);

		FT_Set_Transform( m_pFace, &m_oFontMatrix, NULL );
	}
	void InitSizesCache()
	{
		m_oCacheSizes.Init();
	}
	void ClearSizesCache()
	{
		m_oCacheSizes.Clear();
		::memset( m_arrCacheSizesIndexs, 0xFF, FONT_CACHE_SIZES_INDEXES_SIZE_2 );
	}
	void AddToSizesCache(TFontCacheSizes oSizes)
	{
		m_arrCacheSizesIndexs[oSizes.ushUnicode] = m_oCacheSizes.Add( oSizes );
	}
	__forceinline int FindInSizesCache(int nCode)
	{
		return m_arrCacheSizesIndexs[nCode];
	}
	void GetDefaultChar()
	{
		TT_OS2 *pTable = (TT_OS2*)FT_Get_Sfnt_Table(m_pFace, ft_sfnt_os2);

		if (NULL == pTable)
			m_nDefaultChar = -1;

		m_nDefaultChar = pTable->usDefaultChar;
	}
	int GetSymbolicCmapIndex()
	{
		TT_OS2 *pOs2 = (TT_OS2 *)FT_Get_Sfnt_Table( m_pFace, ft_sfnt_os2 );
		if ( NULL == pOs2 || 0xFFFF == pOs2->version )
			return -1;

		
		if ( !( pOs2->ulCodePageRange1 & 0x80000000 ) && !( pOs2->ulCodePageRange1 == 0 && pOs2->ulCodePageRange2 == 0 ) )
			return -1;

		for( int nIndex = 0; nIndex < m_pFace->num_charmaps; nIndex++ )
		{
			
			if ( 0 == m_pFace->charmaps[nIndex]->encoding_id && 3 == m_pFace->charmaps[nIndex]->platform_id )
				return nIndex;
		}

		return -1;
	}

	void UpdateStyles(BOOL bBold, BOOL bItalic)
	{
		CStringA sStyle = GetStyleName();

		
		BOOL bSrcBold   = ( -1 != sStyle.Find( "Bold" ) );
		BOOL bSrcItalic = ( -1 != sStyle.Find( "Italic" ) );

		if ( !bBold ) 
		{
			SetBold( FALSE );
		}
		else if ( bBold ) 
		{
			if ( bSrcBold )
			{
				
				SetBold( FALSE );
			}
			else
			{
				
				SetBold( TRUE );
			}
		}

		if ( !bItalic ) 
		{
			SetItalic( FALSE );
		}
		else if ( bItalic ) 
		{
			if ( bSrcItalic )
			{
				
				SetItalic( FALSE );
			}
			else
			{
				
				SetItalic( TRUE );
			}
		}
	}

	
	
	
	

	
	void SetBold(BOOL bBold)
	{
		m_bNeedDoBold = bBold;
	};

	
	BOOL GetBold()
	{
		return m_bNeedDoBold;
	}

	
	void SetItalic(BOOL bItalic)
	{
		m_bNeedDoItalic = bItalic;
		ResetFontMatrix();
	}

	
	BOOL GetItalic()
	{
		return m_bNeedDoItalic;
	}
	

public:
	BOOL LoadFont(FT_Library pLibrary, wchar_t* wsFileName, long lIndex, BOOL bUseAA, BOOL bUseKern)
	{
		CloseFile();

		FT_Face pFace = NULL;

		
		HANDLE hFile = CreateFile( (LPCWSTR)wsFileName, GENERIC_READ, FILE_SHARE_READ, NULL, OPEN_EXISTING, FILE_ATTRIBUTE_NORMAL, NULL);
		if (INVALID_HANDLE_VALUE == hFile)
			return NULL; 

		
		DWORD nFileSize = GetFileSize(hFile, NULL);
		HANDLE hMapFile = CreateFileMapping(hFile, NULL, PAGE_READONLY, 0, nFileSize, NULL);
		if (NULL == hMapFile)
		{
			CloseHandle( hFile );
			return FALSE; 
		}

		void *pBaseAddress = MapViewOfFile( hMapFile, FILE_MAP_READ, 0, 0, 0 );
		if ( !pBaseAddress )
		{
			CloseHandle( hMapFile );
			CloseHandle( hFile );
			return FALSE;
		}

		FT_Open_Args oOpenArgs;
		oOpenArgs.flags = FT_OPEN_MEMORY;
		oOpenArgs.memory_base = (BYTE*)pBaseAddress;
		oOpenArgs.memory_size = (FT_Long)nFileSize;

		if (FT_Open_Face(pLibrary, &oOpenArgs, lIndex, &pFace))
		{
			CloseHandle( hMapFile );
			CloseHandle( hFile );
			return FALSE;
		}

		if ( NULL == pFace->charmap && 0 != pFace->num_charmaps )
			FT_Set_Charmap( pFace, pFace->charmaps[0] );

		m_pFace         = pFace;

		m_pBaseAddress = pBaseAddress;
		m_hFile        = hFile;
		m_hMapFile     = hMapFile;

		
		m_dUnitsKoef   = 1.0;
		m_nDefaultChar = -1;

		GetDefaultChar();
		m_nSymbolic = GetSymbolicCmapIndex();

		if ( FT_New_Size( m_pFace, &m_pSize ) ) 
		{
			return FALSE;
		}
		m_pFace->size = m_pSize;

		
		if ( FT_Set_Char_Size( m_pFace, 0, (int)m_fSize * 64, 0, 0 ) ) 
		{
			return FALSE;
		}

		
		ResetFontMatrix();
		ResetTextMatrix();

		m_bAntiAliasing = bUseAA;
		m_bUseKerning = bUseKern;
		if ( TRUE == m_bUseKerning )
		{
			m_bUseKerning = ( FT_HAS_KERNING( m_pFace ) > 0 ? TRUE : FALSE );
		}

		InitSizesCache();
		::memset( m_arrCacheSizesIndexs, 0xFF, FONT_CACHE_SIZES_INDEXES_SIZE_2 );

		m_bStringGID = FALSE;
		

		return true;
	}

	void SetCharSpacing(float fCharSpacing)
	{
		m_fCharSpacing = fCharSpacing;
	}

	
	float GetCharSpacing()
	{
		return m_fCharSpacing;
	}

private:

	FT_Size   m_pSize;
	FT_Matrix m_oFontMatrix;
	FT_Matrix m_oTextMatrix;
	double    m_dTextScale;
	double    m_dUnitsKoef;
	BOOL      m_bStringGID;
	int       m_nDefaultChar; 
	int       m_nSymbolic;    

	FT_Face              m_pFace; 

	
	void                *m_pBaseAddress;
	HANDLE               m_hFile;
	HANDLE               m_hMapFile;

	CFreeTypeFont*	m_pDefaultFont;
	BOOL m_bUseDefaultFont;

	
	double         m_arrdFontMatrix[6]; 
	double         m_arrdTextMatrix[6]; 
	BOOL           m_bAntiAliasing;     
	BOOL           m_bUseKerning;       

	float          m_fSize;             
	unsigned int   m_unHorDpi;          
	unsigned int   m_unVerDpi;          

	BOOL           m_bNeedDoItalic;     
	BOOL           m_bNeedDoBold;       

	float          m_fCharSpacing;      

	int            m_nMinX;        
	int            m_nMinY;        
	int            m_nMaxX;        
	int            m_nMaxY;        

	unsigned char *m_pCache;       
	TFontCacheTag *m_pCacheTags;   

	int            m_nGlyphWidth;  
	int            m_nGlyphHeight; 
	int            m_nGlyphSize;   

	int            m_nCacheSets;   
	int            m_nCacheAssoc;  

	class CFontCacheSizes
	{

	public:
		CFontCacheSizes()
		{

		}
		~CFontCacheSizes()
		{
		}
		void Init()
		{
			m_arrSizes.RemoveAll();
		}
		void Clear()
		{
			for ( int nIndex = 0; nIndex < m_arrSizes.GetSize(); nIndex++ )
			{
				unsigned char *pData = m_arrSizes.GetData()[nIndex].oBitmap.pData;
				if ( NULL != pData )
				{
					free( pData );
					pData = NULL;
				}
			}

			m_arrSizes.RemoveAll();
		}

		int Add(TFontCacheSizes oSizes)
		{
			m_arrSizes.Add( oSizes );
			return m_arrSizes.GetSize() - 1;
		}

		TFontCacheSizes Get(int nIndex)
		{
			return m_arrSizes.GetData()[nIndex];
		}

	private:

		CSimpleArray<TFontCacheSizes> m_arrSizes;
	} m_oCacheSizes;
	
	unsigned short m_arrCacheSizesIndexs[FONT_CACHE_SIZES_INDEXES_SIZE];
};

class CFontManagerLight
{
private:
	long          m_lUnit;
	CGlyphString  m_oGlyphString;    

	FT_Library		m_pLibrary;
	CFreeTypeFont*	m_pFont;           

	BOOL          m_bStringGID;      
	BOOL          m_bUseDefaultFont; 

	double        m_dCharSpacing;    

	BOOL		m_bAntiAliasing;
	BOOL		m_bUseKerning;
	BOOL		m_bUseCIDs;

	CFreeTypeFont* m_pDefaultFont[4]; 

public:

	CFontManagerLight()
	{
		m_pFont = NULL;
		for (LONG i = 0; i < 4; ++i)
			m_pDefaultFont[i] = NULL;

		m_pLibrary = NULL;
		if (FT_Init_FreeType(&m_pLibrary))
			m_pLibrary = NULL;

		m_bStringGID = FALSE;
		m_bUseDefaultFont = TRUE;

		m_dCharSpacing = 0;

		m_bAntiAliasing = TRUE;
		m_bUseKerning = TRUE;
		m_bUseCIDs = FALSE;
	}

	~CFontManagerLight()
	{
		RELEASEOBJECT(m_pFont);

		for (LONG i = 0; i < 4; ++i)
			RELEASEOBJECT((m_pDefaultFont[i]));

		if (NULL != m_pLibrary)
		{
			FT_Done_FreeType(m_pLibrary);
			m_pLibrary = NULL;
		}		
	}

	BOOL LoadFontFromFile(CString sSrcPath, float fEmSize, double dHorDpi, double dVerDpi, long lFaceIndex)
	{
		if (!m_pLibrary)
			return FALSE;

		RELEASEOBJECT(m_pFont);

		m_pFont = new CFreeTypeFont();
		BSTR bsFontPath = sSrcPath.AllocSysString();
		BOOL bIsOpened = m_pFont->LoadFont(m_pLibrary, bsFontPath, lFaceIndex, m_bAntiAliasing, m_bUseKerning);
		SysFreeString(bsFontPath);

		if (!bIsOpened)
		{
			RELEASEOBJECT(m_pFont);
			return FALSE;
		}
		
		m_pFont->UpdateStyles(FALSE, FALSE);
		m_pFont->SetDefaultFont(m_pDefaultFont[0]);
		m_pFont->SetUseDefaultFont( m_bUseDefaultFont );

		fEmSize = (float)UpdateSize( (double) fEmSize, dVerDpi, (unsigned int)dVerDpi );
		m_pFont->SetSizeAndDpi( fEmSize, (unsigned int)dHorDpi, (unsigned int)dVerDpi );

		m_pFont->SetStringGID( m_bStringGID );
		m_pFont->SetCharSpacing( (float)m_dCharSpacing );
		
		m_oGlyphString.ResetCTM();
		m_pFont->SetTextMatrix( 1, 0, 0, 1, 0, 0 );

		return S_OK;
	}

	CFreeTypeFont* GetFont()
	{
		return m_pFont;
	}

	BOOL LoadString(BSTR bsString, float fX, float fY)
	{
		if ( !m_pFont )
			return FALSE;

		CStringW wsBuffer = CStringW( bsString );

		m_oGlyphString.SetString( wsBuffer, fX, fY );
		m_pFont->GetString( &m_oGlyphString );

		return TRUE;
	}
	BOOL LoadString2(BSTR bsString, float fX, float fY)
	{
		if ( !m_pFont )
		{
			m_oGlyphString.Reset();
			return FALSE;
		}

		CStringW wsBuffer = CStringW( bsString );

		m_oGlyphString.SetString( wsBuffer, fX, fY );
		m_pFont->GetString2( &m_oGlyphString );

		return TRUE;
	}

	BOOL GetNextChar(TGlyphBitmap& oBitmap, float& fX, float& fY)
	{
		fX = -0xFFFF;
		fY = -0xFFFF;
		oBitmap.pData = NULL;

		BOOL ret = FALSE;
		BOOL bNotLast = TRUE;

		TGlyph oCurGlyph;
		if ( !(m_oGlyphString.GetNext( &oCurGlyph )) )
		{
			return ret;
		}

		if (!m_pFont)
			return ret;
		
		if ( glyphstateNormal == oCurGlyph.eState || ( glyphstateDeafault == oCurGlyph.eState && NULL != m_pFont->GetDefaultFont() ) )
		{
			long lUnicode = oCurGlyph.lUnicode;
			CFreeTypeFont *pCurFont = NULL;

			if ( glyphstateNormal == oCurGlyph.eState )
				pCurFont = m_pFont;
			else
				pCurFont = m_pFont->GetDefaultFont();

			if ( false == oCurGlyph.bBitmap )
				pCurFont->GetGlyph( lUnicode, 0, 0, &oBitmap );
			else
				oBitmap = oCurGlyph.oBitmap;

			if ( oBitmap.nWidth <= 0 || oBitmap.nHeight <= 0 )
			{
				oBitmap.pData = NULL;
			}
			fX = m_oGlyphString.m_fX + oCurGlyph.fX + oBitmap.nX;
			fY = m_oGlyphString.m_fY + oCurGlyph.fY - oBitmap.nY; 

		}
		else
		{
			
			oBitmap.pData = NULL;

			fX = m_oGlyphString.m_fX + oCurGlyph.fX;
			fY = m_oGlyphString.m_fY + oCurGlyph.fY;
		}
		ret = TRUE;
		return ret;
	}

	BOOL FillString(BSTR bsText, double dX, double dY, double dDpiX, double dDpiY, IUncompressedFrame* pFrame, DWORD dwColor)
	{
		double _x = dX * dDpiX / 25.4;
		double _y = dY * dDpiY / 25.4;

		m_pFont->SetTextMatrix(1, 0, 0, 1, 0, 0);
		LoadString2(bsText, (float)_x, (float)_y);
		float fX = 0;
		float fY = 0;
		VARIANT_BOOL bRes = VARIANT_FALSE;

		while (TRUE)
		{
			TGlyphBitmap oGlyph;
			float fX = 0, fY = 0;

			BOOL ret = GetNextChar(oGlyph, fX, fY);

			if (FALSE == ret)
				break;

			if (NULL != oGlyph.pData)
			{
				FillGlyph(pFrame, (int)fX, (int)fY, dwColor, oGlyph);				
			}
		}

		return TRUE;
	}

	void FillGlyph(IUncompressedFrame* pFrame, int x, int y, DWORD dwColor, TGlyphBitmap& oGlyph)
	{
		
		BYTE* pBuffer = NULL;
		pFrame->get_Buffer(&pBuffer);

		LONG lWidth = 0;
		LONG lHeight = 0;

		pFrame->get_Width(&lWidth);
		pFrame->get_Height(&lHeight);

		LONG _srcX = 0;
		LONG _srcY = 0;
		LONG _srcW = oGlyph.nWidth;
		LONG _srcH = oGlyph.nHeight;

		if (x < 0)
		{
			_srcX += x;
			_srcW += x;
			x = 0;
		}
		if (y < 0)
		{
			_srcY += y;
			_srcH += y;
			y = 0;
		}
		LONG lOffsetX = x + _srcW - lWidth;
		LONG lOffsetY = y + _srcH - lHeight;
		if (lOffsetX > 0)
			_srcW -= lOffsetX;
		if (lOffsetY > 0)
			_srcH -= lOffsetY;

		if (_srcW <= 0 || _srcH <= 0)
			return;

		LONG lR = _srcX + _srcW;
		LONG lB = _srcY + _srcH;

		BYTE cb = (BYTE)((dwColor >> 24) & 0xFF);
		BYTE cg = (BYTE)((dwColor >> 16) & 0xFF);
		BYTE cr = (BYTE)((dwColor >> 8) & 0xFF);
		BYTE ca = (BYTE)(dwColor & 0xFF);

		BYTE* pLine = pBuffer + 4 * y * lWidth + 4 * x;
		for (LONG j = _srcY; j < lB; ++j)
		{
			BYTE* pAlpha = oGlyph.pData + oGlyph.nWidth * j + _srcX;
			BYTE* pPixels = pLine;

			for (LONG i = _srcX; i < lR; ++i, ++pAlpha)
			{
				_blend_pixel(pPixels, cr, cg, cb, ca, *pAlpha);
				pPixels += 4;
			}

			pLine += (4 * lWidth);
		}
	}

	void SetDefaultFont(CString strName, CWinFontList* pList)
	{
		for ( int nIndex = 0; nIndex < 4; nIndex++ )
		{
			LONG bBold, bItalic;

			switch(  nIndex )
			{
			case 0: bBold = 0; bItalic = 0; break;
			case 1: bBold = 1;  bItalic = 0; break;
			case 2: bBold = 0; bItalic = 1;  break;
			case 3: bBold = 1;  bItalic = 1;  break;
			}

			CString strStyle = _T("");
			strStyle.Format(_T("<Style bold='%d' italic='%d'/>"), bBold, bItalic);

			CString strFontName = strName;
			
			strFontName.Replace(L"&",	L"&amp;");
			strFontName.Replace(L"'",	L"&apos;");
			strFontName.Replace(L"<",	L"&lt;");
			strFontName.Replace(L">",	L"&gt;");
			strFontName.Replace(L"\"",	L"&quot;");

			CString sXml = _T("<FontProperties><Name value='");
			sXml += strFontName;
			sXml += _T("'/>");
			sXml += strStyle;
			sXml += _T("</FontProperties>");

			CWinFontInfo *pFontInfo = pList->GetByParams(sXml);
			if (NULL == pFontInfo)
				continue;

			RELEASEOBJECT((m_pDefaultFont[nIndex]));

			m_pDefaultFont[nIndex] = new CFreeTypeFont();
			
			BSTR bsFontPath = pFontInfo->m_wsFontPath.AllocSysString();
			BOOL bIsOpened = m_pDefaultFont[nIndex]->LoadFont(m_pLibrary, bsFontPath, pFontInfo->m_lIndex, m_bAntiAliasing, m_bUseKerning);
			SysFreeString(bsFontPath);

			if (!bIsOpened)
			{
				RELEASEOBJECT(m_pDefaultFont[nIndex]);
				continue;
			}
			
			m_pDefaultFont[nIndex]->UpdateStyles(bBold, bItalic);
		}
	}

	CString GetFontPath(CString strName, CWinFontList* pList)
	{
		CString strFontName = strName;
		
		strFontName.Replace(L"&",	L"&amp;");
		strFontName.Replace(L"'",	L"&apos;");
		strFontName.Replace(L"<",	L"&lt;");
		strFontName.Replace(L">",	L"&gt;");
		strFontName.Replace(L"\"",	L"&quot;");

		CString sXml = _T("<FontProperties><Name value='");
		sXml += strFontName;
		sXml += _T("'/>");
		sXml += _T("</FontProperties>");

		CWinFontInfo *pFontInfo = pList->GetByParams(sXml);
		if (pFontInfo)
			return pFontInfo->m_wsFontPath;

		return _T("");		
	}

private:

	double UpdateSize(double dOldSize, double dDpi, double dNewDpi)
	{
		if ( 0 == dNewDpi ) dNewDpi = 72.0;
		if ( 0 == dDpi    ) dDpi    = 72.0;

		return dOldSize * dDpi / dNewDpi;
	}
	double UpdateDpi(double dDpi, double dSize, double dNewSize)
	{
		if ( 0 == dNewSize ) dNewSize = 10.0;
		if ( 0 == dDpi     ) dDpi     = 72.0;

		return dDpi * dSize / dNewSize;
	}

	__forceinline void _blend_pixel(BYTE* p, BYTE cr, BYTE cg, BYTE cb, BYTE ca, BYTE cover)
	{
		BYTE alpha = (BYTE)((ca * (cover + 1)) >> 8);
		if (alpha == 255)
		{
			p[0] = cb;
			p[1] = cg;
			p[2] = cr;
			p[3] = 255;
		}

		BYTE r = p[2];
		BYTE g = p[1];
		BYTE b = p[0];
		BYTE a = p[3];
		p[2] = (BYTE)(((cr - r) * alpha + (r << 8)) >> 8);
		p[1] = (BYTE)(((cg - g) * alpha + (g << 8)) >> 8);
		p[0] = (BYTE)(((cb - b) * alpha + (b << 8)) >> 8);
		p[3] = (BYTE)((alpha + a) - ((alpha * a + 255) >> 8));
	}
};

#endif 