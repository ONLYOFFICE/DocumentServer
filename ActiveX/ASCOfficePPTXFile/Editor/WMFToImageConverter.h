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
#include "../stdafx.h"

#ifdef BUILD_CONFIG_FULL_VERSION

namespace NSWMFToImageConverter
{
	class CImageExt
	{
	private:
		IASCRenderer* m_pSVGRenderer;

		void Init()
		{
			if (NULL != m_pSVGRenderer)
			{
				VARIANT var;
				var.vt = VT_I4;
				var.lVal = 0;
				m_pSVGRenderer->SetAdditionalParam(L"ReInit", var);
			}
			else
			{
				CoCreateInstance( HtmlRenderer::CLSID_CASCSVGWriter, NULL, CLSCTX_ALL, __uuidof(IASCRenderer), (void**)(&m_pSVGRenderer) );
			}
		}

	public:
		CImageExt()
		{
			m_pSVGRenderer = NULL;
		}
		~CImageExt()
		{
			RELEASEINTERFACE(m_pSVGRenderer);
		}		

	public:
		LONG GetImageType(CString strFile)
		{		
			CFile oFile;
			if (S_OK != oFile.OpenFile(strFile))
			{
				oFile.CloseFile();
				return 0;
			}

			DWORD dwSize = (DWORD)oFile.GetFileSize();

			if (44 > dwSize)
			{
				return 0;
			}

			DWORD dwKey = 0;
			oFile.ReadFile((BYTE*)(&dwKey), 4);

			if (0x9AC6CDD7 == dwKey)
			{
				
				oFile.CloseFile();
				return 1;
			}

			if (0x00000001 == dwKey)
			{
				oFile.SetPosition(40);
				oFile.ReadFile((BYTE*)(&dwKey), 4);
				oFile.CloseFile();

				if (0x464D4520 == dwKey)
				{
					
					return 2;
				}
				else
				{
					
					return 0;
				}
			}

			oFile.CloseFile();

			if (0x00090001 == dwKey)
			{
				return 1;
			}

			return 0;
		}

		void MetaDrawOnRenderer(IASCRenderer* pRenderer, BSTR strFile, double dW, double dH)
		{
			if (NULL == pRenderer)
				return;

			
			LONG brush_Alpha1 = 0;
			LONG brush_Alpha2 = 0;
			LONG brush_Color1 = 0;
			LONG brush_Color2 = 0;
			double brush_LinearAngle = 0;
			BSTR brush_TexturePath = NULL;
			LONG brush_TextureMode = 0;
			LONG brush_TextureAlpha = 0;
			LONG brush_Type = 0;

			pRenderer->get_BrushAlpha1( &brush_Alpha1 );
			pRenderer->get_BrushAlpha2( &brush_Alpha2 );
			pRenderer->get_BrushColor1( &brush_Color1 );
			pRenderer->get_BrushColor2( &brush_Color2 );
			pRenderer->get_BrushLinearAngle( &brush_LinearAngle );
			pRenderer->get_BrushTextureMode( &brush_TextureMode );
			pRenderer->get_BrushTextureAlpha( &brush_TextureAlpha );
			pRenderer->get_BrushTexturePath( &brush_TexturePath );
			pRenderer->get_BrushType( &brush_Type );

			BSTR font_Path = NULL;
			BSTR font_Name = NULL;
			double font_Size = 0;
			LONG font_Style = 0;
			BOOL font_GID = 0;

			pRenderer->get_FontName( &font_Name );
			pRenderer->get_FontPath( &font_Path );
			pRenderer->get_FontSize( &font_Size );
			pRenderer->get_FontStyle( &font_Style );
			pRenderer->get_FontStringGID( &font_GID );

			LONG pen_Align = 0;
			LONG pen_Alpha = 0;
			LONG pen_Color = 0;
			pRenderer->get_PenAlign( &pen_Align );
			pRenderer->get_PenAlpha( &pen_Alpha );
			pRenderer->get_PenColor( &pen_Color );

			ASCGraphics::IAVSImage *pImage = NULL;
			CoCreateInstance( __uuidof(ASCGraphics::CAVSImage), NULL, CLSCTX_ALL, __uuidof(ASCGraphics::IAVSImage), (void**)(&pImage) );

			pImage->put_FontManager(NULL);

			pImage->LoadFromFile( strFile );

			if (dW <= 0 && dH <= 0)
			{
				LONG _lw = 0;
				LONG _lh = 0;
				pImage->get_Width(&_lw);
				pImage->get_Height(&_lh);

				LONG lMax = max(_lw, _lh);
				double dKoef = 1000.0 / lMax;
				
				dW = (double)dKoef * _lw * 100;
				dH = (double)dKoef * _lh * 100;

				m_pSVGRenderer->put_Width(dW);
				m_pSVGRenderer->put_Height(dH);
			}

			pImage->DrawOnRenderer( pRenderer, 0, 0, dW, dH );

			RELEASEINTERFACE( pImage );

			
			pRenderer->put_BrushAlpha1( brush_Alpha1 );
			pRenderer->put_BrushAlpha2( brush_Alpha2 );
			pRenderer->put_BrushColor1( brush_Color1 );
			pRenderer->put_BrushColor2( brush_Color2 );
			pRenderer->put_BrushLinearAngle( brush_LinearAngle );
			pRenderer->put_BrushTextureMode( brush_TextureMode );
			pRenderer->put_BrushTextureAlpha( brush_TextureAlpha );
			pRenderer->put_BrushTexturePath( brush_TexturePath ); if ( brush_TexturePath ) ::SysFreeString( brush_TexturePath );
			pRenderer->put_BrushType( brush_Type );

			pRenderer->put_FontName( font_Name ); if ( font_Name ) ::SysFreeString( font_Name );
			pRenderer->put_FontPath( font_Path ); if ( font_Path ) ::SysFreeString( font_Path );
			pRenderer->put_FontSize( font_Size );
			pRenderer->put_FontStyle( font_Style );
			pRenderer->put_FontStringGID( font_GID );

			pRenderer->put_PenAlign( pen_Align );
			pRenderer->put_PenAlpha( pen_Alpha );
			pRenderer->put_PenColor( pen_Color );

			
			pRenderer->PathCommandEnd();
		}

		bool Convert(CString strPath, LONG lWidth, LONG lHeight, CString strDstPath)
		{
			Init();

			m_pSVGRenderer->put_Width(lWidth);
			m_pSVGRenderer->put_Height(lHeight);

			BSTR bsFilePath = strPath.AllocSysString();
			MetaDrawOnRenderer(m_pSVGRenderer, bsFilePath, (double)lWidth, (double)lHeight);
			SysFreeString(bsFilePath);

			VARIANT var;
			m_pSVGRenderer->GetAdditionalParam(L"IsRaster", &var);

			if (VARIANT_TRUE == var.boolVal)
				return false;

			var.vt = VT_BSTR;
			var.bstrVal = strDstPath.AllocSysString();
			m_pSVGRenderer->SetAdditionalParam(L"SaveFile", var);
			SysFreeString((var.bstrVal));

			return true;
		}
	};
}

#endif