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

#include <atlcoll.h>
#include <math.h>
#include <Gdiplus.h>

#include "streamutils.h"
#include "xmlutils.h"
#include "atldefine.h"

#include "GdiplusEx.h"
namespace Painter
{
	
	const int c_BrushTypeSolid_ =			0;
	const int c_BrushTypeHorizontal_ =		1;
	const int c_BrushTypeVertical_ =		2;
	const int c_BrushTypeDiagonal1_ =		3;
	const int c_BrushTypeDiagonal2_ =		4;
	const int c_BrushTypeCenter_ =			5;
	const int c_BrushTypePathGradient1_ =	6;	
	const int c_BrushTypePathGradient2_ =	7;
	const int c_BrushTypeTexture_ =			8;
	const int c_BrushTypeHatch1_ =			9;
	const int c_BrushTypeHatch53_ =			61;
	const int c_BrushTypeGradient1_ =		62;
	const int c_BrushTypeGradient6_ =		70;

	
	const int c_BrushTypeSolid =			1000;
	const int c_BrushTypeHorizontal =		2001;
	const int c_BrushTypeVertical =			2002;
	const int c_BrushTypeDiagonal1 =		2003;
	const int c_BrushTypeDiagonal2 =		2004;
	const int c_BrushTypeCenter =			2005;
	const int c_BrushTypePathGradient1 =	2006;	
	const int c_BrushTypePathGradient2 =	2007;
	const int c_BrushTypeCylinderHor =		2008;
	const int c_BrushTypeCylinderVer =		2009;
	const int c_BrushTypeTexture =			3008;
	const int c_BrushTypeHatch1 =			4009;
	const int c_BrushTypeHatch53 =			4061;

	

	
	const int c_BrushTextureModeStretch =	 0;
	const int c_BrushTextureModeTile =		 1;
	const int c_BrushTextureModeTileCenter = 2;

	
	const int c_AlphModeDoNothing =				0;
	const int c_AlphModeReplaceWithBrushAlpha =	1;
	const int c_AlphModeCombine =				2;

	
	inline int ConstantCompatible(int nConstant)
	{
		if( c_BrushTypeDiagonal1_ == nConstant )
			nConstant = c_BrushTypeDiagonal2_;
		else if( c_BrushTypeDiagonal2_ == nConstant )
			nConstant = c_BrushTypeDiagonal1_;

		if (1000 <= nConstant)
			return nConstant;
		if (c_BrushTypeSolid_ == nConstant)
			return nConstant + 1000;
		if (c_BrushTypeHorizontal_ <= nConstant && c_BrushTypePathGradient2_ >= nConstant)
			return nConstant + 2000;
		if (c_BrushTypeTexture_ == nConstant)
			return nConstant + 3000;
		if (c_BrushTypeHatch1_ <= nConstant && c_BrushTypeHatch53_ >= nConstant)
			return nConstant + 4000;
		if (c_BrushTypeGradient1_ <= nConstant && c_BrushTypeGradient6_ >= nConstant)
			return nConstant + 2000 - 61;

		return 1000;
	}
	
	inline BOOL IsBrushTypeGradient(int nType)
	{
		int nCompatibleType = ConstantCompatible(nType);

		return (nCompatibleType >= Painter::c_BrushTypeHorizontal && nCompatibleType <= Painter::c_BrushTypeCylinderVer);
	}
	
	inline void DrawBlurString(int currentBlurSize, Graphics* Gr, Gdiplus::Font* font, StringFormat* format, Brush* brush, BSTR Text, int len, RectF& rect)
	{
		for(int j = 0; j < currentBlurSize; j++) 
		{
			rect.X += 1;
			Gr->DrawString(Text, len, font, rect, format, brush);
		}
		for(int j = 0; j < currentBlurSize; j++) 
		{
			rect.Y += 1;
			Gr->DrawString(Text, len, font, rect, format, brush);
		}
		for(int j = 0; j < currentBlurSize; j++) 
		{
			rect.X -= 1;
			Gr->DrawString(Text, len, font, rect, format, brush);
		}
		for(int j = 0; j < currentBlurSize; j++) 
		{
			rect.X -= 1;
			Gr->DrawString(Text, len, font, rect, format, brush);
		}
		for(int j = 0; j < currentBlurSize; j++) 
		{
			rect.Y -= 1;
			Gr->DrawString(Text, len, font, rect, format, brush);
		}
		for(int j = 0; j < currentBlurSize; j++) 
		{
			rect.Y -= 1;
			Gr->DrawString(Text, len, font, rect, format, brush);
		}
		for(int j = 0; j < currentBlurSize; j++) 
		{
			rect.X += 1;
			Gr->DrawString(Text, len, font, rect, format, brush);
		}
		for(int j = 0; j < currentBlurSize; j++) 
		{
			rect.X += 1;
			Gr->DrawString(Text, len, font, rect, format, brush);
		}
		for(int j = 0; j < currentBlurSize; j++) 
		{
			rect.Y += 1;
			Gr->DrawString(Text, len, font, rect, format, brush);
		}
	}

	
	inline void GetRectCurrentCharacter(Gdiplus::Graphics* graphics, Gdiplus::StringFormat* stringFormat, Gdiplus::Font* font, BSTR Text, int length, int index, Gdiplus::RectF& rectString, Gdiplus::RectF& rectCharacter)
	{
		CharacterRange charRanges[1] = {CharacterRange(index, 1)};
		Region pCharRangeRegions;
		stringFormat->SetMeasurableCharacterRanges(1, charRanges);
		graphics->MeasureCharacterRanges(Text, length, font, rectString, stringFormat, 1, &pCharRangeRegions);

		int count = 1;
		Matrix matrix;
		pCharRangeRegions.GetRegionScans(&matrix, &rectCharacter, &count);
	}
	
	
	class CStream
	{
	protected:

		BYTE* m_pBuffer;
		int m_nOrigin;

	public:

		CStream()
		{
			m_pBuffer = 0;
			m_nOrigin = 0;
		}
		
		inline BOOL IsValid() const
			{ if (m_pBuffer) return TRUE; return FALSE; }
		BYTE*& GetBuffer()
			{ return m_pBuffer; }
		void SetBuffer(BYTE* pBuffer)
			{ m_pBuffer = pBuffer; }
		
		void Seek(int nOrigin = 0)
			{ m_nOrigin = nOrigin; }
		int GetPosition()
			{ return m_nOrigin; }
		BYTE* GetData()
			{ return m_pBuffer + m_nOrigin; }
		
		BYTE ReadByte()
		{
			int nOldOrigin = m_nOrigin;

			m_nOrigin += sizeof(BYTE);

			return *(BYTE*)(m_pBuffer + nOldOrigin);
		}
		short ReadShort()
		{
			int nOldOrigin = m_nOrigin;

			m_nOrigin += sizeof(short);

			return *(short*)(m_pBuffer + nOldOrigin);
		}
		long ReadLong()
		{
			int nOldOrigin = m_nOrigin;

			m_nOrigin += sizeof(long);

			return *(long*)(m_pBuffer + nOldOrigin);
		}
		double ReadDouble()
		{
			int nOldOrigin = m_nOrigin;

			m_nOrigin += sizeof(double);

			return *(double*)(m_pBuffer + nOldOrigin);
		}
		float ReadFloat()
		{
			int nOldOrigin = m_nOrigin;

			m_nOrigin += sizeof(float);

			return *(float*)(m_pBuffer + nOldOrigin);
		}
		CString ReadString()
		{
			int nOldOrigin = m_nOrigin;

			while (TRUE)
			{
				m_nOrigin++;

				if (m_pBuffer[m_nOrigin - 1] == 0)
					break;
			}

			return CString((char*)(m_pBuffer + nOldOrigin));
		}
		BYTE* ReadPointer(int nSize)
		{
			int nOldOrigin = m_nOrigin;

			m_nOrigin += nSize;

			return (BYTE*)(m_pBuffer + nOldOrigin);
		}
		
		void WriteByte(BYTE nValue)
		{
			memcpy(m_pBuffer + m_nOrigin, &nValue, sizeof(BYTE));

			m_nOrigin += sizeof(BYTE);
		}
		void WriteShort(short nValue)
		{
			memcpy(m_pBuffer + m_nOrigin, &nValue, sizeof(short));

			m_nOrigin += sizeof(short);
		}
		void WriteLong(long nValue)
		{
			memcpy(m_pBuffer + m_nOrigin, &nValue, sizeof(long));

			m_nOrigin += sizeof(long);
		}
		void WriteDouble(double dValue)
		{
			memcpy(m_pBuffer + m_nOrigin, &dValue, sizeof(double));

			m_nOrigin += sizeof(double);
		}
		void WriteFloat(float fValue)
		{
			memcpy(m_pBuffer + m_nOrigin, &fValue, sizeof(float));

			m_nOrigin += sizeof(float);
		}
		void WriteString(CString strValue)
		{
			TCHAR* pstr = strValue.GetBuffer();

			memcpy(m_pBuffer + m_nOrigin, pstr, strValue.GetLength());

			m_nOrigin += strValue.GetLength();

			m_pBuffer[m_nOrigin] = 0;

			m_nOrigin += sizeof(_T("0"));
		}
		void WritePointer(BYTE* pData, int nSize)
		{
			memcpy(m_pBuffer + m_nOrigin, pData, nSize);

			m_nOrigin += nSize;
		}
	};

	class CBuffer
	{
		BYTE* m_pBuffer;
		int m_nSize;

	public:

		CBuffer()
		{
			m_nSize = 0;
			m_pBuffer = 0;
		}
		~CBuffer()
		{
			if (m_pBuffer)
				delete[] m_pBuffer;
		}
	};

	class CTexture
	{
	public:
		Gdiplus::Bitmap* Bitmap;

		CString Path;
		BYTE*   BitmapData;
		BOOL    bFlipVertical;

		BOOL bAttach;
		int  nWidth;
		int  nHeight;
		int  nStride;
		
	public:
		
		CTexture()
		{
			Path = "";
			Bitmap = 0;
			BitmapData = 0;
			bFlipVertical = FALSE;
			
			bAttach = FALSE;
			nWidth  = 0;
			nHeight = 0;
			nStride = 0;
		}
		~CTexture()
		{
			Clear();
		}
		
		void Clear()
		{
			if (Bitmap)
			{
				delete Bitmap;
				Bitmap = 0;
			}

			if( FALSE == bAttach )
			{
				if (BitmapData)
				{
					delete[] BitmapData;
					BitmapData = 0;
				}
			}

			Path = "";
			bFlipVertical = FALSE;
			
			bAttach = FALSE;
			nWidth  = 0;
			nHeight = 0;
			nStride = 0;
		}
		BOOL Create(CString path, BOOL bFlip = FALSE)
		{
			Clear();

			BSTR bstr = path.AllocSysString();

			Bitmap = new Gdiplus::Bitmap(bstr);

			SysFreeString(bstr);

			if (!Bitmap || Bitmap->GetLastStatus() != Ok)
				return FALSE;

			RectF boundsRect;
			Unit unit;
			Bitmap->GetBounds(&boundsRect, &unit);

			nWidth  = int(boundsRect.Width + 0.5);
			nHeight = int(boundsRect.Height + 0.5);

			Path = path;
			bFlipVertical = bFlip;

			if (bFlip)
				Bitmap->RotateFlip(RotateNoneFlipY);

			return TRUE;
		}
		BOOL SetImage(CString Name, SAFEARRAY* pImage)
		{
			if (NULL == pImage)
				return FALSE;

			
			VARTYPE type;
			long lBoundC, uBoundC;
			long lBoundW, uBoundW;
			long lBoundH, uBoundH;

			
			if (SafeArrayGetDim(pImage) != 3)
				return FALSE;

			
			if (FAILED(SafeArrayGetVartype(pImage, &type)) || type != VT_UI1 || SafeArrayGetElemsize(pImage) != 1)
				return FALSE;

			
			if (FAILED(SafeArrayGetLBound(pImage, 1, &lBoundC)) || FAILED(SafeArrayGetUBound(pImage, 1, &uBoundC)) ||
				FAILED(SafeArrayGetLBound(pImage, 2, &lBoundW)) || FAILED(SafeArrayGetUBound(pImage, 2, &uBoundW)) ||
				FAILED(SafeArrayGetLBound(pImage, 3, &lBoundH)) || FAILED(SafeArrayGetUBound(pImage, 3, &uBoundH)))
				return FALSE;

			
			int Channels = 1 + uBoundC - lBoundC;
			int Width = 1 + uBoundW - lBoundW;
			int Height = 1 + uBoundH - lBoundH;

			
			if (Channels != 4 || Width < 2 || Height < 2)
				return FALSE;

			Clear();

			
			int sizeImage = 4*Width*Height;
			BitmapData = new BYTE[sizeImage]; 
			memcpy(BitmapData,(BYTE*)((pImage)->pvData),  sizeImage);
			Bitmap = new Gdiplus::Bitmap(Width, Height, Width*4, PixelFormat32bppARGB, BitmapData);
			Bitmap->RotateFlip(RotateNoneFlipY);
			Path = Name;

			bAttach = FALSE;
			nWidth  = Width;
			nHeight = Height;
			nStride = 4*Width;

			return TRUE;
		}
	};

	class CTextureManager
	{
		CAtlArray<CTexture*>  m_textures;
		
	public:

		~CTextureManager()
		{
			Clear();
		}
		
		int GetCount()
		{
			return (int)m_textures.GetCount();
		}
		CTexture* GetAt(int index)
		{
			if (index < 0 || index >= GetCount())
				return 0;

			return m_textures[index];
		}
		CTexture* operator[] (int index)
		{
			return GetAt(index);
		}
		int Find(CString path)
		{
			path.MakeLower();

			for (int index = 0; index < GetCount(); ++index)
			{
				if (m_textures[index]->Path == path)
					return index;
			}

			return -1;
		}
		
		void Clear()
		{
			for (int index = 0; index < GetCount(); ++index)
			{
				CTexture* texture = m_textures[index];

				if (texture)
					delete texture;
			}

			m_textures.RemoveAll();
		}
		void RemoveAt(int index)
		{
			if (index < 0 || index >= GetCount())
				return;

			CTexture* texture = m_textures[index];

			if (texture)
				delete texture;

			m_textures.RemoveAt(index);
		}
		long Add(CString path)
		{
			path.MakeLower();

			int index = Find(path);

			if (index >= 0)
				return index;

			CTexture* texture = new CTexture();

			if (!texture->Create(path))
			{
				delete texture;

				return -1;
			}

			m_textures.Add(texture);

			return GetCount() - 1;
		}
		long Add(CString path, BOOL bVerticalFlip)
		{
			path.MakeLower();

			int index = Find(path);

			if (index >= 0)
				return index;

			CTexture* texture = new CTexture();

			if (!texture->Create(path, bVerticalFlip))
			{
				delete texture;

				return -1;
			}

			m_textures.Add(texture);

			return GetCount() - 1;
		}
		long Add(CString Name, SAFEARRAY* pImage)
		{
			Name.MakeLower();

			int index = Find(Name);

			if (index >= 0)
				return index;

			CTexture* texture = new CTexture();

			if (!texture->SetImage(Name, pImage))
			{
				delete texture;

				return -1;
			}

			m_textures.Add(texture);

			return GetCount() - 1;
		}
		long Add( CTexture* pTexture )
		{
			if( !pTexture )
				return -1;

			int index = Find( pTexture->Path );
			if( index >= 0 )
				return index;

			m_textures.Add( pTexture );

			return GetCount() - 1;
		}
	};

	class CPen
	{
		Gdiplus::Pen* m_pen;

	public:
	
		long Color;
		long Alpha;
		double Size;

		byte DashStyle;
		byte LineStartCap;
		byte LineEndCap;
		byte LineJoin;

		REAL* DashPattern;
		long Count;

		REAL DashOffset;
		
		PenAlignment Align;
		
	public:
	
		int GetSize()
		{
			return 2*sizeof(long) + sizeof(double) + 4*sizeof(byte) + sizeof(REAL*) + sizeof(long) + sizeof(REAL);
		}
		void Write(CStream& stream)
		{
			stream.WriteLong(Color);
			stream.WriteLong(Alpha);
			stream.WriteDouble(Size);

			stream.WriteByte(DashStyle);
			stream.WriteByte(LineStartCap);
			stream.WriteByte(LineEndCap);
			stream.WriteByte(LineJoin);

			stream.WriteLong(Count);
			if (DashPattern != NULL)
			{
				for (int i = 0; i < Count; ++i)
				{
					stream.WriteFloat(DashPattern[i]);
				}
			}

			stream.WriteFloat(DashOffset);
		}
		void Read(CStream& stream)
		{
			Color = stream.ReadLong();
			Alpha = stream.ReadLong();
			Size = stream.ReadDouble();

			DashStyle = stream.ReadByte();
			LineStartCap = stream.ReadByte();
			LineEndCap = stream.ReadByte();
			LineJoin = stream.ReadByte();

			Count = stream.ReadLong();
			RELEASEARRAYOBJECTS(DashPattern);
			if (Count != 0)
			{
				DashPattern	= new REAL[Count];

				for (int i = 0; i < Count; ++i)
				{
					DashPattern[i] = stream.ReadFloat();
				}
			}

			DashOffset = stream.ReadFloat();

			Update();
		}
		CString ToXmlString(CString strRootNodeName = _T("pen"), BOOL bAttributed = FALSE)
		{
			XmlUtils::CXmlWriter oXmlWriter;

			if (!bAttributed)
			{
				oXmlWriter.WriteNodeBegin(strRootNodeName);
				oXmlWriter.WriteNode(_T("color"), Color);
				oXmlWriter.WriteNode(_T("alpha"), Alpha);
				oXmlWriter.WriteNode(_T("size"), Size);
				oXmlWriter.WriteNode(_T("style"), DashStyle);
				oXmlWriter.WriteNode(_T("line-start-cap"), LineStartCap);
				oXmlWriter.WriteNode(_T("line-end-cap"), LineEndCap);
				oXmlWriter.WriteNode(_T("line-join"), LineJoin);
				oXmlWriter.WriteNode(_T("dash-pattern-count"), Count);
				oXmlWriter.WriteNodeBegin(_T("dash-pattern"));
				if (DashPattern != NULL)
				{
					for (int i = 0; i < Count; ++i)
					{
						oXmlWriter.WriteNode(_T("dash"), DashPattern[i]);
					}
				}
				oXmlWriter.WriteNodeEnd(_T("dash-pattern"));
				oXmlWriter.WriteNode(_T("dash-offset"), DashOffset);
				oXmlWriter.WriteNode(_T("alignment"), Align);
				oXmlWriter.WriteNodeEnd(strRootNodeName);
			}
			else
			{
				oXmlWriter.WriteNodeBegin(strRootNodeName, TRUE);

				ToXmlAttributes(oXmlWriter);

				oXmlWriter.WriteNodeEnd(strRootNodeName, TRUE);
			}

			return oXmlWriter.GetXmlString();
		}
		void FromXmlString(CString strXml)
		{
			XmlUtils::CXmlReader oXmlReader;

			oXmlReader.SetXmlString(strXml);
			oXmlReader.ReadRootNode();

			FromXmlAttributes(oXmlReader);
		}
		
		BOOL FromStream(Streams::IStream* pStream)
		{
			if (!pStream)
				return FALSE;

			try
			{
				Color = pStream->ReadLong();
				Alpha = pStream->ReadLong();
				Size = pStream->ReadDouble();

				DashStyle = pStream->ReadByte();
				LineStartCap = pStream->ReadByte();
				LineEndCap = pStream->ReadByte();
				LineJoin = pStream->ReadByte();

				Count = pStream->ReadLong();
				RELEASEARRAYOBJECTS(DashPattern);
				if (Count > 0)
				{
					DashPattern	= new REAL[Count];

					for (int i = 0; i < Count; ++i)
					{
						DashPattern[i] = pStream->ReadFloat();
					}
				}

				DashOffset = pStream->ReadFloat();

				Update();

				return TRUE;
			}
			catch (...)
			{
			}

			return FALSE;
		}
		BOOL ToStream(Streams::IStream* pStream)
		{
			if (!pStream)
				return FALSE;

			try
			{
				pStream->WriteLong(Color);
				pStream->WriteLong(Alpha);
				pStream->WriteDouble(Size);

				pStream->WriteByte(DashStyle);
				pStream->WriteByte(LineStartCap);
				pStream->WriteByte(LineEndCap);
				pStream->WriteByte(LineJoin);

				pStream->WriteLong(Count);
				if (DashPattern != NULL)
				{
					for (int i = 0; i < Count; ++i)
					{
						pStream->WriteFloat(DashPattern[i]);
					}
				}

				pStream->WriteFloat(DashOffset);

				return TRUE;
			}
			catch (...)
			{
			}

			return FALSE;
		}
		void ToXmlAttributes(XmlUtils::CXmlWriter& oXmlWriter)
		{
			oXmlWriter.WriteAttribute(_T("color"), Color);
			oXmlWriter.WriteAttribute(_T("alpha"), Alpha);
			oXmlWriter.WriteAttribute(_T("size"), Size);

			oXmlWriter.WriteAttribute(_T("style"), DashStyle);
			oXmlWriter.WriteAttribute(_T("line-start-cap"), LineStartCap);
			oXmlWriter.WriteAttribute(_T("line-end-cap"), LineEndCap);
			oXmlWriter.WriteAttribute(_T("line-join"), LineJoin);

			oXmlWriter.WriteAttribute(_T("dash-offset"), DashOffset);
			oXmlWriter.WriteAttribute(_T("alignment"), Align);
		}
		void FromXmlAttributes(XmlUtils::CXmlReader& oXmlReader)
		{
			Color = XmlUtils::GetInteger(oXmlReader.ReadNodeAttributeOrValue(_T("color"), _T("0")));
			Alpha = XmlUtils::GetInteger(oXmlReader.ReadNodeAttributeOrValue(_T("alpha"), _T("0")));
			Size = XmlUtils::GetDouble(oXmlReader.ReadNodeAttributeOrValue(_T("size"), _T("0")));
			
			DashStyle = (byte)XmlUtils::GetInteger(oXmlReader.ReadNodeAttributeOrValue(_T("style"), _T("0")));
			LineStartCap = (byte)XmlUtils::GetInteger(oXmlReader.ReadNodeAttributeOrValue(_T("line-start-cap"), _T("0")));
			LineEndCap = (byte)XmlUtils::GetInteger(oXmlReader.ReadNodeAttributeOrValue(_T("line-end-cap"), _T("0")));
			LineJoin = (byte)XmlUtils::GetInteger(oXmlReader.ReadNodeAttributeOrValue(_T("line-join"), _T("0")));

			RELEASEARRAYOBJECTS(DashPattern);
			Count = XmlUtils::GetInteger(oXmlReader.ReadNodeAttributeOrValue(_T("dash-pattern-count"), _T("0")));
			if (Count != 0)
			{
				XmlUtils::CXmlNode oPatternNode;
				oXmlReader.ReadNodeList(_T("dash-pattern"));
				if (oPatternNode.FromXmlString(oXmlReader.ReadNodeXml(0)))
				{
					XmlUtils::CXmlNodes oDashNodes;
					if (oPatternNode.GetNodes(_T("dash"), oDashNodes))
					{
						Count = oDashNodes.GetCount();
						if (Count != 0)
						{
							DashPattern = new REAL[Count];
							XmlUtils::CXmlNode oDashNode;
							for (int i = 0; i < Count; ++i)
							{
								oDashNodes.GetAt(i, oDashNode);
								DashPattern[i] = (REAL)XmlUtils::GetDouble(oDashNode.GetText());
							}
						}
					}
				}
			}

			DashOffset = (REAL)XmlUtils::GetDouble(oXmlReader.ReadNodeAttributeOrValue(_T("dash-offset"), _T("0")));

			SetAlignment( XmlUtils::GetInteger(oXmlReader.ReadNodeAttribute(_T("alignment"), _T("0"))) );

			Update();
		}
		void FromXmlNode(XmlUtils::CXmlNode& oXmlNode)
		{
			Color = XmlUtils::GetInteger(oXmlNode.GetAttributeOrValue(_T("color"), _T("0")));
			Alpha = XmlUtils::GetInteger(oXmlNode.GetAttributeOrValue(_T("alpha"), _T("0")));
			Size = XmlUtils::GetDouble(oXmlNode.GetAttributeOrValue(_T("size"), _T("0")));

			DashStyle = (byte)XmlUtils::GetInteger(oXmlNode.GetAttributeOrValue(_T("style"), _T("0")));
			LineStartCap = (byte)XmlUtils::GetInteger(oXmlNode.GetAttributeOrValue(_T("line-start-cap"), _T("0")));
			LineEndCap = (byte)XmlUtils::GetInteger(oXmlNode.GetAttributeOrValue(_T("line-end-cap"), _T("0")));
			LineJoin = (byte)XmlUtils::GetInteger(oXmlNode.GetAttributeOrValue(_T("line-join"), _T("0")));

			RELEASEARRAYOBJECTS(DashPattern);
			Count = XmlUtils::GetInteger(oXmlNode.GetAttributeOrValue(_T("dash-pattern-count"), _T("0")));
			if (Count != 0)
			{
				XmlUtils::CXmlNode oPatternNode;
				if (oXmlNode.GetNode(_T("dash-pattern"), oPatternNode))
				{
					XmlUtils::CXmlNodes oDashNodes;
					if (oPatternNode.GetNodes(_T("dash"), oDashNodes))
					{
						Count = oDashNodes.GetCount();
						if (Count != 0)
						{
							DashPattern = new REAL[Count];
							XmlUtils::CXmlNode oDashNode;
							for (int i = 0; i < Count; ++i)
							{
								oDashNodes.GetAt(i, oDashNode);
								DashPattern[i] = (REAL)XmlUtils::GetDouble(oDashNode.GetText());
							}
						}
					}
				}
			}

			DashOffset = (REAL)XmlUtils::GetDouble(oXmlNode.GetAttributeOrValue(_T("dash-offset"), _T("0")));

			SetAlignment( XmlUtils::GetInteger(oXmlNode.GetAttributeOrValue(_T("alignment"), _T("0"))) );

			Update();
		}
		
		long GetColor() const
		{
			return Color;
		}
		void SetColor(long nColor)
		{
			if (Color != nColor)
				Clear();

			Color = nColor;
		}
		long GetAlpha() const
		{
			return Alpha;
		}
		void SetAlpha(long nAlpha)
		{
			if (Alpha != nAlpha)
				Clear();

			Alpha = nAlpha;
		}
		double GetSize() const
		{
			return Size;
		}
		void SetSize(double dSize)
		{
			if (fabs(Size - dSize) > 0.0001)
				Clear();

			Size = dSize;
		}
		
		byte GetStyle() const
		{
			return DashStyle;
		}
		void SetStyle(byte nStyle)
		{
			if (DashStyle != nStyle)
				Clear();
			
			DashStyle = nStyle;
		}
		byte GetLineStartCap() const
		{
			return LineStartCap;
		}
		void SetLineStartCap(byte nLineStartCap)
		{
			if (LineStartCap != nLineStartCap)
				Clear();

			LineStartCap = nLineStartCap;
		}
		byte GetLineEndCap() const
		{
			return LineEndCap;
		}
		void SetLineEndCap(byte nLineEndCap)
		{
			if (LineEndCap != nLineEndCap)
				Clear();

			LineEndCap = nLineEndCap;
		}
		byte GetLineJoin() const
		{
			return LineJoin;
		}
		void SetLineJoin(byte nLineJoin)
		{
			if (LineJoin != nLineJoin)
				Clear();

			LineJoin = nLineJoin;
		}
		
		long GetDashPatternCount() const
		{
			return Count;
		}
		void GetDashPattern(REAL* arrDashPattern, long& nCount) const
		{
			if (nCount == Count)
			{
				for (int i = 0; i < Count; ++i)
				{
					arrDashPattern[i] = DashPattern[i];
				}
			}
		}
		void SetDashPattern(REAL* arrDashPattern, long nCount)
		{
			if ((arrDashPattern == NULL) || (nCount == 0))
			{
				Count = 0;
				RELEASEARRAYOBJECTS(DashPattern);
			}
			else
			{
				if (Count != nCount)
				{
					Count = nCount;
					RELEASEARRAYOBJECTS(DashPattern);
					DashPattern = new REAL[Count];
				}

				for (int i = 0; i < Count; ++i)
				{
					DashPattern[i] = arrDashPattern[i];
				}
			}
		}
		
		REAL GetDashOffset() const
		{
			return DashOffset;			
		}
		void SetDashOffset(REAL fDashOffset)
		{
			if (DashOffset != fDashOffset)
				Clear();

			DashOffset = fDashOffset;
		}

		void SetAlignment( int align )
		{
			Align = (align == PenAlignmentInset) ? PenAlignmentInset : PenAlignmentCenter;
			
			if( m_pen )
				m_pen->SetAlignment( Align );
		}

		int GetAlignment() const
		{
			return Align;
		}
		
		void ScaleAlpha( double dScale )
		{
			long dNewAlpha = long(Alpha * dScale + 0.5);
			
			if( dNewAlpha > 255 ) dNewAlpha = 255;
			else if( dNewAlpha < 0 ) dNewAlpha = 0;
			
			SetAlpha( dNewAlpha );
		}

		void FromPen(const CPen& oPen)
		{
			SetColor(oPen.GetColor());
			SetAlpha(oPen.GetAlpha());
			SetSize(oPen.GetSize());

			SetStyle(oPen.GetStyle());
			SetLineStartCap(oPen.GetLineStartCap());
			SetLineEndCap(oPen.GetLineEndCap());
			SetLineJoin(oPen.GetLineJoin());

			long nCount = oPen.GetDashPatternCount();
			REAL* arrDashPattern = new REAL[nCount];
			oPen.GetDashPattern(arrDashPattern, nCount);
			SetDashPattern(arrDashPattern, nCount);
			RELEASEARRAYOBJECTS(arrDashPattern);

			SetDashOffset(oPen.GetDashOffset());
			SetAlignment(oPen.GetAlignment());
		}

		BOOL IsEqual(CPen* pPen)
		{
			if (NULL == pPen)
				return FALSE;

			return ((Color == pPen->Color) && (Alpha == pPen->Alpha) && (Size == pPen->Size) &&
				(DashStyle == pPen->DashStyle) && (LineStartCap == pPen->LineStartCap) &&
				(LineEndCap == pPen->LineEndCap) && (LineJoin == pPen->LineJoin));
		}

		void SetDefaultParams()
		{
			Color = 0;
			Alpha = 255;
			Size  = 1;

			DashStyle    = 0;
			LineStartCap = 0;
			LineEndCap   = 0;
			LineJoin     = 0;

			DashPattern = NULL;
			Count       = 0;

			DashOffset = 0;
			Align = Gdiplus::PenAlignmentCenter;
			
		}

		
	public:

		CPen()
		{
			m_pen = 0;
			Color = 0;
			Alpha = 255;
			Size = 1;

			DashStyle = 0;
			LineStartCap = 0;
			LineEndCap = 0;
			LineJoin = 0;

			DashPattern = NULL;
			Count = 0;

			DashOffset = 0;
			Align = PenAlignmentCenter;
		}
		CPen( const CPen& other )
		{
			m_pen = NULL;
			Color = other.Color;
			Alpha = other.Alpha;
			Size  = other.Size;

			DashStyle = other.DashStyle;
			LineStartCap = other.LineStartCap;
			LineEndCap = other.LineEndCap;
			LineJoin = other.LineJoin;

			Count = other.Count;
			if (Count != 0)
			{
				DashPattern = new REAL[Count];
				for (int i = 0; i < Count; ++i)
				{
					DashPattern[i] = other.DashPattern[i];
				}
			}

			DashOffset = other.DashOffset;

			Align = other.Align;
		}
		CPen& operator=(const CPen& pen)
		{
			Clear();
			
			FromPen(pen);

			return *this;
		}
		~CPen()
		{
			RELEASEARRAYOBJECTS(DashPattern);

			Clear();
		}
		
		void Update()
		{
			Clear();
		}
		void Clear()
		{
			if (m_pen)
			{
				delete m_pen;
				m_pen = 0;
			}
		}

		Gdiplus::Pen* GetPen()
		{
			if (m_pen)
				return m_pen;

			Gdiplus::Color color((BYTE)Alpha, GetRValue(Color), GetGValue(Color), GetBValue(Color));

			m_pen = new Gdiplus::Pen(color, (REAL)Size);
			m_pen->SetDashStyle((Gdiplus::DashStyle)DashStyle);
			m_pen->SetStartCap((LineCap)LineStartCap);
			m_pen->SetEndCap((LineCap)LineEndCap);
			m_pen->SetLineJoin((Gdiplus::LineJoin)LineJoin);

			if ((Count != 0) && (DashPattern != NULL))
			{
				m_pen->SetDashPattern(DashPattern, Count);
			}

			m_pen->SetDashOffset(DashOffset);
			m_pen->SetAlignment( Align );

			return m_pen;
		}
	};

	class CBrush
	{
		Gdiplus::Brush* m_brush;

		double m_dTransparency; 

	public:

		long Type;
		
		long Color1;
		long Color2;
		long Alpha1;
		long Alpha2;
		long GradientAngle;
		
		CString TexturePath;
		long TextureAlpha;
		long TextureMode;
		
		BOOL Rectable;
		RectF Rect;

	public:

		int GetSize()
		{
			return 4*sizeof(double) + 9*sizeof(long) + TexturePath.GetLength() + 1;
		}
		void Write(CStream& stream)
		{
			stream.WriteLong(Type);

			stream.WriteLong(Color1);
			stream.WriteLong(Alpha1);
			stream.WriteLong(Color2);
			stream.WriteLong(Alpha2);

			stream.WriteLong(GradientAngle);

			stream.WriteString(TexturePath);
			stream.WriteLong(TextureAlpha);
			stream.WriteLong(TextureMode);

			stream.WriteLong(Rectable);
			stream.WriteDouble(Rect.X);
			stream.WriteDouble(Rect.Y);
			stream.WriteDouble(Rect.Width);
			stream.WriteDouble(Rect.Height);
		}
		void Read(CStream& stream)
		{
			Type = stream.ReadLong();

			Color1 = stream.ReadLong();
			Alpha1 = stream.ReadLong();
			Color2 = stream.ReadLong();
			Alpha2 = stream.ReadLong();
			GradientAngle = stream.ReadLong();

			TexturePath = stream.ReadString();
			TextureAlpha = stream.ReadLong();
			TextureMode = stream.ReadLong();

			Rectable = stream.ReadLong();
			Rect.X = (REAL)stream.ReadDouble();
			Rect.Y = (REAL)stream.ReadDouble();
			Rect.Width = (REAL)stream.ReadDouble();
			Rect.Height = (REAL)stream.ReadDouble();

			Update();
		}
		CString ToXmlString(CString strRootNodeName = _T("brush"), BOOL bAttributed = FALSE)
		{
			XmlUtils::CXmlWriter oXmlWriter;

			if (!bAttributed)
			{
				oXmlWriter.WriteNodeBegin(strRootNodeName);

				oXmlWriter.WriteNode(_T("type"), Type);
				oXmlWriter.WriteNode(_T("color1"), Color1);
				oXmlWriter.WriteNode(_T("color2"), Color2);
				oXmlWriter.WriteNode(_T("alpha1"), Alpha1);
				oXmlWriter.WriteNode(_T("alpha2"), Alpha2);
				oXmlWriter.WriteNode(_T("gradient-angle"), GradientAngle);
				oXmlWriter.WriteNode(_T("texturepath"), TexturePath);
				oXmlWriter.WriteNode(_T("texturealpha"), TextureAlpha);
				oXmlWriter.WriteNode(_T("texturemode"), TextureMode);
				oXmlWriter.WriteNode(_T("rectable"), Rectable);

				oXmlWriter.WriteNodeBegin(_T("rectangle"), TRUE);
				oXmlWriter.WriteAttribute(_T("left"), Rect.X);
				oXmlWriter.WriteAttribute(_T("top"), Rect.Y);
				oXmlWriter.WriteAttribute(_T("width"), Rect.Width);
				oXmlWriter.WriteAttribute(_T("height"), Rect.Height);
				oXmlWriter.WriteNodeEnd(_T("rectangle"), TRUE);

				oXmlWriter.WriteNodeEnd(strRootNodeName);
			}
			else
			{
				oXmlWriter.WriteNodeBegin(strRootNodeName, TRUE);

				ToXmlAttributes(oXmlWriter);

				oXmlWriter.WriteNodeEnd(strRootNodeName, TRUE);
			}

			return oXmlWriter.GetXmlString();
		}
		void FromXmlString(CString strXml)
		{
			XmlUtils::CXmlReader oXmlReader;

			oXmlReader.SetXmlString(strXml);
			oXmlReader.ReadRootNode();

			FromXmlAttributes(oXmlReader);
		}
	
		BOOL FromStream(Streams::IStream* pStream)
		{
			if (!pStream)
				return FALSE;

			try
			{
				Type = pStream->ReadLong();
				Type = ConstantCompatible(Type);

				Color1 = pStream->ReadLong();
				Alpha1 = pStream->ReadLong();
				Color2 = pStream->ReadLong();
				Alpha2 = pStream->ReadLong();
				GradientAngle = pStream->ReadLong();

				TexturePath = pStream->ReadString();
				TextureAlpha = pStream->ReadLong();
				TextureMode = pStream->ReadLong();

				Rectable = pStream->ReadLong();
				Rect.X = (REAL)pStream->ReadDouble();
				Rect.Y = (REAL)pStream->ReadDouble();
				Rect.Width = (REAL)pStream->ReadDouble();
				Rect.Height = (REAL)pStream->ReadDouble();

				Update();

				return TRUE;
			}
			catch (...)
			{
			}

			return FALSE;
		}
		BOOL ToStream(Streams::IStream* pStream)
		{
			if (!pStream)
				return FALSE;

			try
			{
				pStream->WriteLong(Type);

				pStream->WriteLong(Color1);
				pStream->WriteLong(Alpha1);
				pStream->WriteLong(Color2);
				pStream->WriteLong(Alpha2);
				pStream->WriteLong(GradientAngle);

				pStream->WriteString(TexturePath);
				pStream->WriteLong(TextureAlpha);
				pStream->WriteLong(TextureMode);

				pStream->WriteLong(Rectable);
				pStream->WriteDouble(Rect.X);
				pStream->WriteDouble(Rect.Y);
				pStream->WriteDouble(Rect.Width);
				pStream->WriteDouble(Rect.Height);

				return TRUE;
			}
			catch (...)
			{
			}

			return FALSE;
		}
		void ToXmlAttributes(XmlUtils::CXmlWriter& oXmlWriter)
		{
			oXmlWriter.WriteAttribute(_T("type"), Type);
			oXmlWriter.WriteAttribute(_T("color1"), Color1);
			oXmlWriter.WriteAttribute(_T("color2"), Color2);
			oXmlWriter.WriteAttribute(_T("alpha1"), Alpha1);
			oXmlWriter.WriteAttribute(_T("alpha2"), Alpha2);
			oXmlWriter.WriteAttribute(_T("gradient-angle"), GradientAngle);
			oXmlWriter.WriteAttribute(_T("texturepath"), TexturePath);
			oXmlWriter.WriteAttribute(_T("texturealpha"), TextureAlpha);
			oXmlWriter.WriteAttribute(_T("texturemode"), TextureMode);
			oXmlWriter.WriteAttribute(_T("rectable"), Rectable);

			oXmlWriter.WriteAttribute(_T("rect-left"), Rect.X);
			oXmlWriter.WriteAttribute(_T("rect-top"), Rect.Y);
			oXmlWriter.WriteAttribute(_T("rect-width"), Rect.Width);
			oXmlWriter.WriteAttribute(_T("rect-height"), Rect.Height);
		}
		void FromXmlAttributes(XmlUtils::CXmlReader& oXmlReader)
		{
			Type = XmlUtils::GetInteger(oXmlReader.ReadNodeAttributeOrValue(_T("type"), _T("0")));
			Type = ConstantCompatible(Type);

			Color1 = XmlUtils::GetInteger(oXmlReader.ReadNodeAttributeOrValue(_T("color1"), _T("0")));
			Color2 = XmlUtils::GetInteger(oXmlReader.ReadNodeAttributeOrValue(_T("color2"), _T("0")));
			Alpha1 = XmlUtils::GetInteger(oXmlReader.ReadNodeAttributeOrValue(_T("alpha1"), _T("0")));
			Alpha2 = XmlUtils::GetInteger(oXmlReader.ReadNodeAttributeOrValue(_T("alpha2"), _T("0")));
			GradientAngle = XmlUtils::GetInteger(oXmlReader.ReadNodeAttributeOrValue(_T("gradient-angle"), _T("0")));

			TexturePath = oXmlReader.ReadNodeAttributeOrValue(_T("texturepath"), _T(""));
			TextureAlpha = XmlUtils::GetInteger(oXmlReader.ReadNodeAttributeOrValue(_T("texturealpha"), _T("0")));
			TextureMode = XmlUtils::GetInteger(oXmlReader.ReadNodeAttributeOrValue(_T("texturemode"), _T("0")));

			Rectable = XmlUtils::GetInteger(oXmlReader.ReadNodeAttributeOrValue(_T("rectable"), _T("0")));

			Rect.X = (REAL)XmlUtils::GetDouble(oXmlReader.ReadNodeAttributeOrValue(_T("rect-left")));
			Rect.Y = (REAL)XmlUtils::GetDouble(oXmlReader.ReadNodeAttributeOrValue(_T("rect-top")));
			Rect.Width = (REAL)XmlUtils::GetDouble(oXmlReader.ReadNodeAttributeOrValue(_T("rect-width")));
			Rect.Height = (REAL)XmlUtils::GetDouble(oXmlReader.ReadNodeAttributeOrValue(_T("rect-height")));

			if (oXmlReader.ReadNode(_T("rectangle")))
			{
				Rect.X = (REAL)XmlUtils::GetDouble(oXmlReader.ReadNodeAttribute(_T("left")));
				Rect.Y = (REAL)XmlUtils::GetDouble(oXmlReader.ReadNodeAttribute(_T("top")));
				Rect.Width = (REAL)XmlUtils::GetDouble(oXmlReader.ReadNodeAttribute(_T("width")));
				Rect.Height = (REAL)XmlUtils::GetDouble(oXmlReader.ReadNodeAttribute(_T("height")));
			}

			Update();
		}		
		void FromXmlNode(XmlUtils::CXmlNode& oXmlNode)
		{
			Type = XmlUtils::GetInteger(oXmlNode.GetAttributeOrValue(_T("type"), _T("0")));
			Type = ConstantCompatible(Type);

			Color1 = XmlUtils::GetInteger(oXmlNode.GetAttributeOrValue(_T("color1"), _T("0")));
			Color2 = XmlUtils::GetInteger(oXmlNode.GetAttributeOrValue(_T("color2"), _T("0")));
			Alpha1 = XmlUtils::GetInteger(oXmlNode.GetAttributeOrValue(_T("alpha1"), _T("0")));
			Alpha2 = XmlUtils::GetInteger(oXmlNode.GetAttributeOrValue(_T("alpha2"), _T("0")));
			GradientAngle = XmlUtils::GetInteger(oXmlNode.GetAttributeOrValue(_T("gradient-angle"), _T("0")));

			TexturePath = oXmlNode.GetAttributeOrValue(_T("texturepath"), _T(""));
			TextureAlpha = XmlUtils::GetInteger(oXmlNode.GetAttributeOrValue(_T("texturealpha"), _T("0")));
			TextureMode = XmlUtils::GetInteger(oXmlNode.GetAttributeOrValue(_T("texturemode"), _T("0")));

			Rectable = XmlUtils::GetInteger(oXmlNode.GetAttributeOrValue(_T("rectable"), _T("0")));

			Rect.X = (REAL)XmlUtils::GetDouble(oXmlNode.GetAttributeOrValue(_T("rect-left")));
			Rect.Y = (REAL)XmlUtils::GetDouble(oXmlNode.GetAttributeOrValue(_T("rect-top")));
			Rect.Width = (REAL)XmlUtils::GetDouble(oXmlNode.GetAttributeOrValue(_T("rect-width")));
			Rect.Height = (REAL)XmlUtils::GetDouble(oXmlNode.GetAttributeOrValue(_T("rect-height")));

			XmlUtils::CXmlNode oNodeRect;
			if (oXmlNode.GetNode(_T("rectangle"), oNodeRect))
			{
				Rect.X = (REAL)XmlUtils::GetDouble(oNodeRect.GetAttributeOrValue(_T("left")));
				Rect.Y = (REAL)XmlUtils::GetDouble(oNodeRect.GetAttributeOrValue(_T("top")));
				Rect.Width = (REAL)XmlUtils::GetDouble(oNodeRect.GetAttributeOrValue(_T("width")));
				Rect.Height = (REAL)XmlUtils::GetDouble(oNodeRect.GetAttributeOrValue(_T("height")));
			}

			Update();
		}		
		
		long GetType() const
		{
			return ConstantCompatible(Type);
		}
		void SetType(long nType)
		{
			if (Type != nType)
				Clear();

			Type = ConstantCompatible(nType);
		}
		long GetColor1() const
		{
			return Color1;
		}
		void SetColor1(long nColor1)
		{
			if (Color1 != nColor1)
				Clear();

			Color1 = nColor1;
		}
		long GetColor2() const
		{
			return Color2;
		}
		void SetColor2(int nColor2)
		{
			if (Color2 != nColor2)
				Clear();

			Color2 = nColor2;
		}
		long GetAlpha1() const
		{
			return Alpha1;
		}
		void SetAlpha1(long nAlpha1)
		{
			if (Alpha1 != nAlpha1)
				Clear();

			Alpha1 = nAlpha1;
		}
		long GetAlpha2() const
		{
			return Alpha2;
		}
		void SetAlpha2(long nAlpha2)
		{
			if (Alpha2 != nAlpha2)
				Clear();

			Alpha2 = nAlpha2;
		}
		long GetGradientAngle() const
		{
			return GradientAngle;
		}
		void SetGradientAngle(long nGradientAngle)
		{
			if (GradientAngle != nGradientAngle)
				Clear();

			GradientAngle = nGradientAngle;
		}
		CString GetTexturePath() const
		{
			return TexturePath;
		}
		void SetTexturePath(const CString& strTexturePath)
		{
			if (TexturePath != strTexturePath)
				Clear();

			TexturePath = strTexturePath;
		}
		long GetTextureAlpha() const
		{
			return TextureAlpha;
		}
		void SetTextureAlpha(long nTextureAlpha)
		{
			if (TextureAlpha != nTextureAlpha)
				Clear();

			TextureAlpha = nTextureAlpha;
		}
		long GetTextureMode() const
		{
			return TextureMode;
		}
		void SetTextureMode(long nTextureMode)
		{
			if (TextureMode != nTextureMode)
				Clear();

			TextureMode = nTextureMode;
		}
		BOOL GetRectable() const
		{
			return Rectable;
		}
		Gdiplus::RectF GetRect() const
		{
			return Rect;
		}
		void SetRect(Gdiplus::RectF* pRect)
		{
			if (NULL == pRect)
			{
				if (Rectable)
					Clear();

				Rectable = FALSE;
			}
			else
			{
				if (!Rectable || pRect->X != Rect.X || pRect->Y != Rect.Y || pRect->Width != Rect.Width || pRect->Height != Rect.Height)
					Clear();

				Rect = *pRect;
				Rectable = TRUE;
			}
		}
		
		void ScaleAlpha1( double dScale )
		{
			long dNewAlpha = long(Alpha1 * dScale + 0.5);
			
			if( dNewAlpha > 255 ) dNewAlpha = 255;
			else if( dNewAlpha < 0 ) dNewAlpha = 0;
			
			SetAlpha1( dNewAlpha );
		}
		void ScaleAlpha2( double dScale )
		{
			long dNewAlpha = long(Alpha2 * dScale + 0.5);
			
			if( dNewAlpha > 255 ) dNewAlpha = 255;
			else if( dNewAlpha < 0 ) dNewAlpha = 0;
			
			SetAlpha2( dNewAlpha );
		}

		void ScaleTextureAlpha( double dScale )
		{
			long dNewAlpha = long(TextureAlpha * dScale + 0.5);
			
			if( dNewAlpha > 255 ) dNewAlpha = 255;
			else if( dNewAlpha < 0 ) dNewAlpha = 0;
			
			SetTextureAlpha( dNewAlpha );
		}

		void FromBrush(const CBrush& oBrush)
		{
			SetType(oBrush.GetType());
			
			SetColor1(oBrush.GetColor1());
			SetColor2(oBrush.GetColor2());
			SetAlpha1(oBrush.GetAlpha1());
			SetAlpha2(oBrush.GetAlpha2());
			SetGradientAngle(oBrush.GetGradientAngle());
			
			SetTexturePath(oBrush.GetTexturePath());
			SetTextureAlpha(oBrush.GetTextureAlpha());
			SetTextureMode(oBrush.GetTextureMode());
			
			if (!oBrush.GetRectable())
				SetRect(NULL);
			else
				SetRect(&oBrush.GetRect());
		}
		
		void SetTransparency( double dIntensity )
		{
			if( dIntensity > 1 ) dIntensity = 1;
			if( dIntensity < 0 ) dIntensity = 0;

			if( dIntensity != m_dTransparency )
			{
				int nOldAlpha1 = int(m_dTransparency * Alpha1 + 0.5);
				int nNewAlpha1 = int(dIntensity * Alpha1 + 0.5);
				int nOldAlpha2 = int(m_dTransparency * Alpha2 + 0.5);
				int nNewAlpha2 = int(dIntensity * Alpha2 + 0.5);
				int nOldTextureAlpha = int(m_dTransparency * TextureAlpha + 0.5);
				int nNewTextureAlpha = int(dIntensity * TextureAlpha + 0.5);

				if( nNewAlpha1 != nOldAlpha1 ||
					nNewAlpha2 != nOldAlpha2 ||
					nNewTextureAlpha != nOldTextureAlpha )
				{
					Update();
				}

				m_dTransparency = dIntensity;
			}
		}
		double GetTransparency() const
		{
			return m_dTransparency;
		}

		BOOL IsEqual(CBrush* pBrush)
		{
			if (NULL == pBrush)
				return FALSE;

			return ((Type == pBrush->Type) && 
				(Color1 == pBrush->Color1) && (Color2 == pBrush->Color2) &&
				(Alpha1 == pBrush->Alpha1) && (Alpha2 == pBrush->Alpha2) && (GradientAngle == pBrush->GradientAngle));

			
		}

		void SetDefaultParams()
		{
			Type = c_BrushTypeSolid;

			Color1 = 0;
			Alpha1 = 255;
			Color2 = 0;
			Alpha2 = 255;

			TextureAlpha = 255;
			TextureMode  = c_BrushTextureModeStretch;

			

			TexturePath = _T("");

			Rectable = FALSE;

			Rect.X      = 0.0F;
			Rect.Y      = 0.0F;
			Rect.Width  = 0.0F;
			Rect.Height = 0.0F;
		}
		
	public:
		
		CBrush()
		{
			m_brush = 0;

			Type = 0;

			Color1 = 0;
			Alpha1 = 255;
			Color2 = 0;
			Alpha2 = 255;

			GradientAngle = 0;

			TextureAlpha = 255;
			TextureMode = c_BrushTextureModeStretch;

			Rectable = FALSE;
			Rect.X = 0.0F;
			Rect.Y = 0.0F;
			Rect.Width = 0.0F;
			Rect.Height = 0.0F;

			m_dTransparency = 1;
		}
		CBrush( const CBrush& other )
		{
			m_brush = NULL;
			
			Type    = other.Type;
			
			Color1  = other.Color1;
			Alpha1  = other.Alpha1;
			Color2  = other.Color2;
			Alpha2  = other.Alpha2;

			GradientAngle = other.GradientAngle;

			TexturePath  = other.TexturePath;
			TextureAlpha = other.TextureAlpha;
			TextureMode  = other.TextureMode;

			Rectable = other.Rectable;
			Rect     = other.Rect;

			m_dTransparency = other.m_dTransparency;
		}
		CBrush& operator=(const CBrush& brush)
		{
			Clear();

			FromBrush(brush);

			return *this;
		}
		~CBrush()
		{
			Clear();
		}
		
		void Update()
		{
			Clear();
		}
		void Clear()
		{
			if( m_brush )
			{	
				delete m_brush;
				m_brush = 0;
			}
		}

		static bool GetTextRect(BSTR Text, Graphics* pGr, Gdiplus::Font* font, double Left, double Top, RectF* textRect)
		{
			if (!pGr || !font || !textRect)
				return false;

			
			PointF point((REAL)Left, (REAL)Top);
			Status s = pGr->MeasureString(Text, SysStringLen(Text), font, point, textRect);
			if (s != Ok)
				return false;

			return true;
		}

		Gdiplus::Brush* GetBrush(CTextureManager* manager = 0, RectF* pRect = 0, int index = 0, BOOL bAddIfNotExists = FALSE)
		{
			if( m_brush )
			{			
				if( EqualsRectable( pRect ) )
					return m_brush;

				if( BrushTypeTextureFill == m_brush->GetType() )
				{
					Gdiplus::TextureBrush* pBrush = (Gdiplus::TextureBrush*)m_brush;
					SetTextureBrushTransform( pBrush, pRect ); 
					return m_brush;
				}

				Rectable = FALSE;
				Clear();
			}

			int nBrushType = GetType();
			
			
			if (c_BrushTypeTexture == nBrushType && manager)
			{
				int index = manager->Find(TexturePath);

				if (index < 0 && bAddIfNotExists)
					index = manager->Add(TexturePath);

				if (index >= 0)
				{
					Gdiplus::TextureBrush* brush = GetTexureBrush(manager->GetAt(index), pRect );

					m_brush = brush;

					return m_brush;
				}
			}
			
			else if (nBrushType >= c_BrushTypeHatch1 && nBrushType <= c_BrushTypeHatch53)
			{
				Gdiplus::Color color1((BYTE)(Alpha1 * m_dTransparency + 0.5), GetRValue(Color1), GetGValue(Color1), GetBValue(Color1));
				Gdiplus::Color color2((BYTE)(Alpha2 * m_dTransparency + 0.5), GetRValue(Color2), GetGValue(Color2), GetBValue(Color2));
				Gdiplus::HatchBrush* brush = new HatchBrush((HatchStyle)(nBrushType - c_BrushTypeHatch1), color1, color2);

				m_brush = brush;

				return m_brush;
			}
			
			else if (GradientAngle>0 && pRect && nBrushType!=c_BrushTypeSolid)
			{
				Gdiplus::LinearGradientBrush* brush = GetLinearGradientBrushAngle(GradientAngle, pRect);

				m_brush = brush;

				return m_brush;
			}
			
			else if (nBrushType >= c_BrushTypeHorizontal && nBrushType <= c_BrushTypeDiagonal2 && pRect)
			{
				int angle = 0;
				switch(nBrushType)
				{
				case c_BrushTypeVertical:
					angle = 90;
					break;
				case c_BrushTypeDiagonal1:
					angle = 45;
					break;
				case c_BrushTypeDiagonal2:
					angle = 135;
					break;
				}
				Gdiplus::LinearGradientBrush* brush = GetLinearGradientBrushAngle(90 - angle, pRect);

				m_brush = brush;

				return m_brush;
			}
			
			else if ((c_BrushTypeCenter == nBrushType && pRect) || (c_BrushTypePathGradient1 == nBrushType && pRect))
			{
				Gdiplus::PathGradientBrush* brush = GetPathGradientBrushCenter(pRect);

				m_brush = brush;

				return m_brush;
			}
			
			if (c_BrushTypePathGradient2 == nBrushType && pRect)
			{   
				Gdiplus::PathGradientBrush* brush = GetPathGradientBrush(pRect, index);

				m_brush = brush;

				return m_brush;
			}

			
			else if (nBrushType >= c_BrushTypeCylinderHor && nBrushType <= c_BrushTypeCylinderVer && pRect)
			{
				Gdiplus::LinearGradientBrush* brush = GetLinearGradientBrushCHV(nBrushType - c_BrushTypeCylinderHor, pRect);

				m_brush = brush;

				return m_brush;
			}

			
			
			Gdiplus::Color color((BYTE)(Alpha1 * m_dTransparency + 0.5), GetRValue(Color1), GetGValue(Color1), GetBValue(Color1));
			Gdiplus::SolidBrush* brush = new Gdiplus::SolidBrush(color);

			m_brush = brush;

			return m_brush;
		}
	
	private:
	
		ImageAttributes* GetImageAttributes( int nAlpha )
		{
			if( nAlpha < 0 || nAlpha >= 255 )
				return NULL;

			REAL alph = (REAL)(nAlpha / 255.0);
			ColorMatrix colorMatrix = {	
				1.0f, 0.0f, 0.0f, 0.0f, 0.0f,
				0.0f, 1.0f, 0.0f, 0.0f, 0.0f,
				0.0f, 0.0f, 1.0f, 0.0f, 0.0f,
				0.0f, 0.0f, 0.0f, alph, 0.0f,
				0.0f, 0.0f, 0.0f, 0.0f, 1.0f
			};

			ImageAttributes* pImageAtt = new ImageAttributes();
			if( pImageAtt )
				pImageAtt->SetColorMatrix(&colorMatrix, ColorMatrixFlagsDefault, ColorAdjustTypeBitmap);

			return pImageAtt;
		}
		void SetTextureBrushTransform( Gdiplus::TextureBrush* pBrush, Gdiplus::RectF* pBrushRect )
		{
			if( !pBrush )
				return;

			Gdiplus::Image* pImage = pBrush->GetImage();
			Gdiplus::RectF  oImageRect;
			Gdiplus::Unit   oImageUnit;
			if( pImage )
			{
				pImage->GetBounds( &oImageRect, &oImageUnit );
				delete pImage;
			}

			pBrush->ResetTransform();

			Gdiplus::PointF oBrushOffset;
			if( pBrushRect )
			{
				oBrushOffset.X = pBrushRect->X;
				oBrushOffset.Y = pBrushRect->Y;
			}

			switch(TextureMode)
			{
			case c_BrushTextureModeStretch:
				if( pBrushRect )
				{
					pBrush->ScaleTransform( pBrushRect->Width / oImageRect.Width, pBrushRect->Height / oImageRect.Height );
					break;
				}
			
			case c_BrushTextureModeTileCenter:
				if( pBrushRect )
				{
					oBrushOffset.X += (pBrushRect->Width - oImageRect.Width)/2;
					oBrushOffset.Y += (pBrushRect->Height - oImageRect.Height)/2;
					pBrush->SetWrapMode( WrapModeTile );
					break;
				}

			default:
				pBrush->SetWrapMode( WrapModeTile );
			}

			if( oBrushOffset.X != 0 || oBrushOffset.Y != 0)
			{
				pBrush->TranslateTransform( oBrushOffset.X, oBrushOffset.Y, MatrixOrderAppend );
				SetRectable( pBrushRect );
			}

		}
		
		Gdiplus::TextureBrush* GetTexureBrush( Painter::CTexture* pTexture, Gdiplus::RectF* pRect)
		{
			
			int nAlpha = int(TextureAlpha * m_dTransparency + 0.5);
			if( nAlpha < 1 )
				return NULL;

			if( !pTexture )
				return NULL;

			Gdiplus::TextureBrush* pBrush = NULL;

			Gdiplus::Bitmap* pTextureBitmap = pTexture->Bitmap;
			if( !pTextureBitmap )
			{
				BYTE* pBGRA = pTexture->BitmapData;
				int nWidth  = pTexture->nWidth;
				int nHeight = pTexture->nHeight;
				int nStride = pTexture->nStride;
				
				if( NULL == pBGRA || nWidth <=0 || nHeight <= 0 || abs(nStride) < nWidth * 4 )
					return NULL;

				BYTE* pBuffer = NULL;

				
				if( nAlpha < 255 )
				{
					pBuffer = new BYTE[nWidth*nHeight*4];
					if( pBuffer )
					{
						if( nStride < 0 )
						{
							pBGRA += nStride * (nHeight - 1);
							nStride = -nStride;
						}

						
						nStride -= nWidth * 4;

						BYTE* pSrc = pBGRA;
						BYTE* pDst = pBuffer;
						for( int nRow = nHeight; nRow > 0; --nRow, pSrc += nStride )
						{
							for( int nPos = nWidth; nPos > 0; --nPos, pDst += 4, pSrc += 4 )
							{
								DWORD alpha = ((DWORD(pSrc[3]) << 8) + 127) / 255;
								pDst[0] = BYTE(pSrc[0] * alpha >> 8);
								pDst[1] = BYTE(pSrc[1] * alpha >> 8);
								pDst[2] = BYTE(pSrc[2] * alpha >> 8);
								pDst[3] = BYTE(nAlpha);
							}
						}

						pBGRA   = pBuffer;
						nStride = nWidth*4;

						
						
						
						
						
						
						
						
						
					}
				}

				Gdiplus::Bitmap oImage( nWidth, nHeight, nStride, PixelFormat32bppARGB, pBGRA );
				if( Gdiplus::Ok == oImage.GetLastStatus() )
				{
					pBrush = new Gdiplus::TextureBrush( &oImage, Gdiplus::Rect(0, 0, nWidth, nHeight), NULL);
				}

				if( pBuffer )
					delete [] pBuffer;
			}
			else
			{
				
				Gdiplus::ImageAttributes* pImageAttr = GetImageAttributes( nAlpha );
				pBrush = new Gdiplus::TextureBrush(pTextureBitmap, Gdiplus::Rect(0, 0, pTexture->nWidth, pTexture->nHeight), pImageAttr);

				if( pImageAttr )
				{
					delete pImageAttr;
					pImageAttr = NULL;
				}
			}

			SetTextureBrushTransform( pBrush, pRect );

			return pBrush;
		}
		
		Gdiplus::LinearGradientBrush* GetLinearGradientBrushHVD(int type, RectF* pRect)
		{
			Gdiplus::Color color1((BYTE)(Alpha1 * m_dTransparency + 0.5), GetRValue(Color1), GetGValue(Color1), GetBValue(Color1));
			Gdiplus::Color color2((BYTE)(Alpha2 * m_dTransparency + 0.5), GetRValue(Color2), GetGValue(Color2), GetBValue(Color2));
			Gdiplus::LinearGradientBrush* brush = new Gdiplus::LinearGradientBrush(*pRect, color1, color2, (LinearGradientMode)type);
			if( brush )
			{
				brush->SetWrapMode( Gdiplus::WrapModeTileFlipXY );
			}
			

			SetRectable(pRect);
			return brush;
		}
		
		Gdiplus::LinearGradientBrush* GetLinearGradientBrushCHV(int type, RectF* pRect)
		{
			Gdiplus::Color color1((BYTE)(Alpha1 * m_dTransparency + 0.5), GetRValue(Color1), GetGValue(Color1), GetBValue(Color1));
			Gdiplus::Color color2((BYTE)(Alpha2 * m_dTransparency + 0.5), GetRValue(Color2), GetGValue(Color2), GetBValue(Color2));
			
			float angle = 0;

			switch(type)
			{
			case 0: angle = -90; break;
			case 1: angle = -180; break;
			}

			Gdiplus::LinearGradientBrush* brush = new Gdiplus::LinearGradientBrush(*pRect, color1, color2, angle);
			if( brush )
			{
				brush->SetBlendBellShape(0.70f);
				brush->SetWrapMode( Gdiplus::WrapModeTileFlipXY );
			}

			SetRectable(pRect);
			return brush;
		}
		
		Gdiplus::LinearGradientBrush* GetLinearGradientBrushAngle(int nAngle, RectF* pRect)
		{
			Gdiplus::Color color1((BYTE)(Alpha1 * m_dTransparency + 0.5), GetRValue(Color1), GetGValue(Color1), GetBValue(Color1));
			Gdiplus::Color color2((BYTE)(Alpha2 * m_dTransparency + 0.5), GetRValue(Color2), GetGValue(Color2), GetBValue(Color2));

			float angle = (float)(90 - nAngle);

			Gdiplus::LinearGradientBrush* brush = new Gdiplus::LinearGradientBrush(*pRect, color1, color2, angle);
			if( brush )
			{
				
				brush->SetWrapMode( Gdiplus::WrapModeTileFlipXY );
			}

			SetRectable(pRect);
			return brush;
		}
		
		Gdiplus::PathGradientBrush* GetPathGradientBrushCenter(RectF* pRect)
		{
			Gdiplus::Color color1((BYTE)(Alpha1 * m_dTransparency + 0.5), GetRValue(Color1), GetGValue(Color1), GetBValue(Color1));
			Gdiplus::Color color2((BYTE)(Alpha2 * m_dTransparency + 0.5), GetRValue(Color2), GetGValue(Color2), GetBValue(Color2));
			Gdiplus::GraphicsPath path; path.AddRectangle(*pRect);
			PathGradientBrush* brush = new PathGradientBrush(&path);
			if( brush )
			{
				Color colors[] = {color1};
				int count = 1;
				brush->SetSurroundColors(colors, &count);
				brush->SetCenterColor(color2);
				brush->SetWrapMode( Gdiplus::WrapModeTileFlipXY );
				
			}

			SetRectable(pRect);
			return brush;
		}
		
		Gdiplus::PathGradientBrush* GetPathGradientBrush(RectF* pRect, int index)
		{
			Gdiplus::Color color1((BYTE)(Alpha1 * m_dTransparency + 0.5), GetRValue(Color1), GetGValue(Color1), GetBValue(Color1));
			Gdiplus::Color color2((BYTE)(Alpha2 * m_dTransparency + 0.5), GetRValue(Color2), GetGValue(Color2), GetBValue(Color2));
			Gdiplus::GraphicsPath path; path.AddRectangle(*pRect);
			PathGradientBrush* brush = new PathGradientBrush(&path);

			if( brush )
			{
				int colorsCount = 4;
				Color colors1[] = {color1, color2, color2, color1};
				Color colors2[] = {color2, color1, color1, color2};
				Color* pColors = (index % 2) ? colors2 : colors1;
				Color& oColor = (index % 2) ? color2 : color1;

				brush->SetSurroundColors(pColors, &colorsCount);
				brush->SetCenterColor(oColor);
				brush->SetWrapMode( Gdiplus::WrapModeTileFlipXY );
			}

			SetRectable(pRect);
			return brush;
		}

		void SetRectable(RectF* pRect)
		{
			if( pRect )
			{
				Rect = *pRect;
			}
			Rectable = TRUE;
		}
		BOOL EqualsRectable( Gdiplus::RectF* pRect )
		{
			if( !Rectable )
				return TRUE;

			if( !pRect )
				return !Rect.Width && !Rect.Height && !Rect.X && !Rect.Y;
			else
				return Rect.Equals( *pRect );
		}
	};
	class CFont
	{
		Gdiplus::Font* m_font;
	
	public:

		CString Name;
		CString Path;
		double Size;
		BOOL Bold;
		BOOL Italic;
		BOOL Underline;
		BOOL Strikeout;
	
	public:

		int GetSize()
		{
			return Name.GetLength() + 1 + sizeof(double) + 4*sizeof(long) + Path.GetLength() + 1;
		}
		void Write(CStream& stream)
		{
			stream.WriteString(Name);
			stream.WriteString(Path);
			stream.WriteDouble(Size);
			stream.WriteLong(Bold);
			stream.WriteLong(Italic);
			stream.WriteLong(Underline);
			stream.WriteLong(Strikeout);
		}
		void Read(CStream& stream)
		{
			Name = stream.ReadString();
			Path = stream.ReadString();
			Size = stream.ReadDouble();
			Bold = stream.ReadLong();
			Italic = stream.ReadLong();
			Underline = stream.ReadLong();
			Strikeout = stream.ReadLong();

			Update();
		}
		CString ToXmlString(CString strRootNodeName = _T("font"), BOOL bAttributed = FALSE)
		{
			XmlUtils::CXmlWriter oXmlWriter;

			if (!bAttributed)
			{
				oXmlWriter.WriteNodeBegin(strRootNodeName);
				oXmlWriter.WriteNode(_T("name"), Name);
				oXmlWriter.WriteNode(_T("path"), Path);
				oXmlWriter.WriteNode(_T("size"), Size);
				oXmlWriter.WriteNode(_T("bold"), Bold);
				oXmlWriter.WriteNode(_T("italic"), Italic);
				oXmlWriter.WriteNode(_T("underline"), Underline);
				oXmlWriter.WriteNode(_T("strikeout"), Strikeout);
				oXmlWriter.WriteNodeEnd(strRootNodeName);
			}
			else
			{
				oXmlWriter.WriteNodeBegin(strRootNodeName, TRUE);

				ToXmlAttributes(oXmlWriter);

				oXmlWriter.WriteNodeEnd(strRootNodeName, TRUE);
			}

			return oXmlWriter.GetXmlString();
		}
		void FromXmlString(CString strXml)
		{
			XmlUtils::CXmlReader oXmlReader;

			oXmlReader.SetXmlString(strXml);
			oXmlReader.ReadRootNode();

			FromXmlAttributes(oXmlReader);
		}
	
		BOOL FromStream(Streams::IStream* pStream)
		{
			if (!pStream)
				return FALSE;

			try
			{
				Name = pStream->ReadString();
				Path = pStream->ReadString();
				Size = pStream->ReadDouble();
				Bold = pStream->ReadLong();
				Italic = pStream->ReadLong();
				Underline = pStream->ReadLong();
				Strikeout = pStream->ReadLong();

				Update();

				return TRUE;
			}
			catch (...)
			{
			}

			return FALSE;
		}
		BOOL ToStream(Streams::IStream* pStream)
		{
			if (!pStream)
				return FALSE;

			try
			{
				pStream->WriteString(Name);
				pStream->WriteString(Path);
				pStream->WriteDouble(Size);
				pStream->WriteLong(Bold);
				pStream->WriteLong(Italic);
				pStream->WriteLong(Underline);
				pStream->WriteLong(Strikeout);

				return TRUE;
			}
			catch (...)
			{
			}

			return FALSE;
		}
		void ToXmlAttributes(XmlUtils::CXmlWriter& oXmlWriter)
		{
			oXmlWriter.WriteAttribute(_T("name"), Name);
			oXmlWriter.WriteAttribute(_T("path"), Path);
			oXmlWriter.WriteAttribute(_T("size"), Size);
			oXmlWriter.WriteAttribute(_T("bold"), Bold);
			oXmlWriter.WriteAttribute(_T("italic"), Italic);
			oXmlWriter.WriteAttribute(_T("underline"), Underline);
			oXmlWriter.WriteAttribute(_T("strikeout"), Strikeout);
		}
		void FromXmlAttributes(XmlUtils::CXmlReader& oXmlReader)
		{
			Name = oXmlReader.ReadNodeAttributeOrValue(_T("name"), _T("Arial"));
			Path = oXmlReader.ReadNodeAttributeOrValue(_T("path"), _T(""));
			Size = XmlUtils::GetDouble(oXmlReader.ReadNodeAttributeOrValue(_T("size"), _T("0")));
			Bold = XmlUtils::GetInteger(oXmlReader.ReadNodeAttributeOrValue(_T("bold"), _T("0")));
			Italic = XmlUtils::GetInteger(oXmlReader.ReadNodeAttributeOrValue(_T("italic"), _T("0")));
			Underline = XmlUtils::GetInteger(oXmlReader.ReadNodeAttributeOrValue(_T("underline"), _T("0")));
			Strikeout = XmlUtils::GetInteger(oXmlReader.ReadNodeAttributeOrValue(_T("strikeout"), _T("0")));

			Update();
		}		
		void FromXmlNode(XmlUtils::CXmlNode& oXmlNode)
		{
			Name = oXmlNode.GetAttributeOrValue(_T("name"), _T("Arial"));
			Path = oXmlNode.GetAttributeOrValue(_T("path"), _T(""));
			Size = XmlUtils::GetDouble(oXmlNode.GetAttributeOrValue(_T("size"), _T("0")));
			Bold = XmlUtils::GetInteger(oXmlNode.GetAttributeOrValue(_T("bold"), _T("0")));
			Italic = XmlUtils::GetInteger(oXmlNode.GetAttributeOrValue(_T("italic"), _T("0")));
			Underline = XmlUtils::GetInteger(oXmlNode.GetAttributeOrValue(_T("underline"), _T("0")));
			Strikeout = XmlUtils::GetInteger(oXmlNode.GetAttributeOrValue(_T("strikeout"), _T("0")));

			Update();
		}		
		
		CString GetName() const
		{
			return Name;
		}
		void SetName(const CString& strName)
		{
			if (Name != strName)
				Clear();

			Name = strName;
		}
		CString GetPath() const
		{
			return Path;
		}
		void SetPath(const CString& strPath)
		{
			if ( Path != strPath )
				Clear();

			Path = strPath;
		}
		double GetFontSize() const
		{
			return Size;
		}
		void SetFontSize(double dSize)
		{
			if (fabs(Size - dSize) > 0.0001)
				Clear();

			Size = dSize;
		}
		BOOL GetBold() const
		{
			return Bold;
		}
		void SetBold(BOOL bBold)
		{
			if (Bold != bBold)
				Clear();

			Bold = bBold;
		}
		BOOL GetItalic() const
		{
			return Italic;
		}
		void SetItalic(BOOL bItalic)
		{
			if (Italic != bItalic)
				Clear();

			Italic = bItalic;
		}
		BOOL GetUnderline() const
		{
			return Underline;
		}
		void SetUnderline(BOOL bUnderline)
		{
			if (Underline != bUnderline)
				Clear();

			Underline = bUnderline;
		}
		BOOL GetStrikeout() const
		{
			return Strikeout;
		}
		void SetStrikeout(BOOL bStrikeout)
		{
			if (Strikeout != bStrikeout)
				Clear();

			Strikeout = bStrikeout;
		}
		
		void FromFont(const CFont& oFont)
		{
			SetName(oFont.GetName());
			SetPath(oFont.GetPath());
			SetFontSize(oFont.GetFontSize());
			SetBold(oFont.GetBold());
			SetItalic(oFont.GetItalic());
			SetUnderline(oFont.GetUnderline());
			SetStrikeout(oFont.GetStrikeout());
		}

		BOOL IsEqual(CFont* pFont)
		{
			if (NULL == pFont)
				return FALSE;

			return ((Name == pFont->Name) && (Path == pFont->Path) && (Size == pFont->Size) &&
				(Bold == pFont->Bold) && (Italic == pFont->Italic) &&
				(Underline == pFont->Underline) && (Strikeout == pFont->Strikeout));
		}
		void SetDefaultParams()
		{
			Name = _T("Arial");
			Path = _T("");
			
			Size      = 0;
			Bold      = FALSE;
			Italic    = FALSE;
			Underline = 0;
			Strikeout = 0;

			
			
		}


	public:

		CFont()
		{
			m_font = 0;

			Size = 0;
			Bold = FALSE;
			Italic = FALSE;
			Underline = FALSE;
			Strikeout = FALSE;
		}
		CFont( const CFont& other )
		{
			m_font = 0;

			Name      = other.Name;
			Path      = other.Path;
			Size      = other.Size;
			Bold      = other.Bold;
			Italic    = other.Italic;
			Underline = other.Underline;
			Strikeout = other.Strikeout;
		}
		CFont& operator=(const CFont& font)
		{
			Clear();
			
			FromFont(font);

			return *this;
		}
		~CFont()
		{
			Clear();
		}
	
		void Update()
		{
			Clear();
		}
		void Clear()
		{
			if (m_font)
			{
				delete m_font;
				m_font = 0;
			}
		}
		
		Gdiplus::Font* GetFont(Gdiplus::Unit units = Gdiplus::UnitPixel)
		{
			if (m_font)
				return m_font;

			BSTR family = Name.AllocSysString();

			int style = Gdiplus::FontStyleRegular;

			if (Bold)
				style |= Gdiplus::FontStyleBold;
			if (Italic)
				style |= Gdiplus::FontStyleItalic;
			if (Underline)
				style |= Gdiplus::FontStyleUnderline;
			if (Strikeout)
				style |= Gdiplus::FontStyleStrikeout;

			Gdiplus::Font* font = new Gdiplus::Font(family, (REAL)Size, style, units);

			SysFreeString(family);

			m_font = font;

			return m_font;
		}
	};
	class CFormat
	{
		Gdiplus::StringFormat* m_stringFormat;
		
	public:
	
		BOOL AntiAliasPen;
		BOOL AntiAliasBrush;
		BOOL AntiAliasText;

		long StringAlignmentVertical;
		long StringAlignmentHorizontal;

		long ImageAlphMode;

	public:

		int GetSize()
		{
			return 6*sizeof(long);
		}
		void Write(CStream& stream)
		{
			stream.WriteLong(AntiAliasPen);
			stream.WriteLong(AntiAliasBrush);
			stream.WriteLong(AntiAliasText);
			stream.WriteLong(StringAlignmentVertical);
			stream.WriteLong(StringAlignmentHorizontal);
			stream.WriteLong(ImageAlphMode);
		}
		void Read(CStream& stream)
		{
			AntiAliasPen = stream.ReadLong();
			AntiAliasBrush = stream.ReadLong();
			AntiAliasText = stream.ReadLong();
			StringAlignmentVertical = stream.ReadLong();
			StringAlignmentHorizontal = stream.ReadLong();
			ImageAlphMode = stream.ReadLong();

			Update();
		}

		CString ToXmlString(CString strRootNodeName = _T("format"), BOOL bAttributed = FALSE)
		{
			XmlUtils::CXmlWriter oXmlWriter;

			if (!bAttributed)
			{
				oXmlWriter.WriteNodeBegin(strRootNodeName);
				oXmlWriter.WriteNode(_T("antialiaspen"), AntiAliasPen);
				oXmlWriter.WriteNode(_T("antialiasbrush"), AntiAliasBrush);
				oXmlWriter.WriteNode(_T("antialiastext"), AntiAliasText);
				oXmlWriter.WriteNode(_T("stringalignmentvertical"), StringAlignmentVertical);
				oXmlWriter.WriteNode(_T("stringalignmenthorizontal"), StringAlignmentHorizontal);
				oXmlWriter.WriteNode(_T("imagealphmode"), ImageAlphMode);
				oXmlWriter.WriteNodeEnd(strRootNodeName);
			}
			else
			{
				oXmlWriter.WriteNodeBegin(strRootNodeName, TRUE);

				ToXmlAttributes(oXmlWriter);

				oXmlWriter.WriteNodeEnd(strRootNodeName, TRUE);
			}

			return oXmlWriter.GetXmlString();
		}
		void FromXmlString(CString strXml)
		{
			XmlUtils::CXmlReader oXmlReader;

			oXmlReader.SetXmlString(strXml);
			oXmlReader.ReadRootNode();

			FromXmlAttributes(oXmlReader);
		}
	
		BOOL FromStream(Streams::IStream* pStream)
		{
			if (!pStream)
				return FALSE;

			try
			{
				AntiAliasPen = pStream->ReadLong();
				AntiAliasBrush = pStream->ReadLong();
				AntiAliasText = pStream->ReadLong();
				StringAlignmentVertical = pStream->ReadLong();
				StringAlignmentHorizontal = pStream->ReadLong();
				ImageAlphMode = pStream->ReadLong();

				Update();

				return TRUE;
			}
			catch (...)
			{
			}

			return FALSE;
		}
		BOOL ToStream(Streams::IStream* pStream)
		{
			if (!pStream)
				return FALSE;

			try
			{
				pStream->WriteLong(AntiAliasPen);
				pStream->WriteLong(AntiAliasBrush);
				pStream->WriteLong(AntiAliasText);
				pStream->WriteLong(StringAlignmentVertical);
				pStream->WriteLong(StringAlignmentHorizontal);
				pStream->WriteLong(ImageAlphMode);

				return TRUE;
			}
			catch (...)
			{
			}

			return FALSE;
		}
		void ToXmlAttributes(XmlUtils::CXmlWriter& oXmlWriter)
		{
			oXmlWriter.WriteAttribute(_T("antialiaspen"), AntiAliasPen);
			oXmlWriter.WriteAttribute(_T("antialiasbrush"), AntiAliasBrush);
			oXmlWriter.WriteAttribute(_T("antialiastext"), AntiAliasText);
			oXmlWriter.WriteAttribute(_T("stringalignmentvertical"), StringAlignmentVertical);
			oXmlWriter.WriteAttribute(_T("stringalignmenthorizontal"), StringAlignmentHorizontal);
			oXmlWriter.WriteAttribute(_T("imagealphmode"), ImageAlphMode);
		}
		void FromXmlAttributes(XmlUtils::CXmlReader& oXmlReader)
		{
			AntiAliasPen = XmlUtils::GetInteger(oXmlReader.ReadNodeAttributeOrValue(_T("antialiaspen"), _T("1")));
			AntiAliasBrush = XmlUtils::GetInteger(oXmlReader.ReadNodeAttributeOrValue(_T("antialiasbrush"), _T("1")));
			AntiAliasText = XmlUtils::GetInteger(oXmlReader.ReadNodeAttributeOrValue(_T("antialiastext"), _T("0")));
			StringAlignmentVertical = XmlUtils::GetInteger(oXmlReader.ReadNodeAttributeOrValue(_T("stringalignmentvertical"), _T("0")));
			StringAlignmentHorizontal = XmlUtils::GetInteger(oXmlReader.ReadNodeAttributeOrValue(_T("stringalignmenthorizontal"), _T("0")));
			ImageAlphMode = XmlUtils::GetInteger(oXmlReader.ReadNodeAttributeOrValue(_T("imagealphmode"), _T("0")));

			Update();
		}		
		void FromXmlNode(XmlUtils::CXmlNode& oXmlNode)
		{
			AntiAliasPen = XmlUtils::GetInteger(oXmlNode.GetAttributeOrValue(_T("antialiaspen"), _T("1")));
			AntiAliasBrush = XmlUtils::GetInteger(oXmlNode.GetAttributeOrValue(_T("antialiasbrush"), _T("1")));
			AntiAliasText = XmlUtils::GetInteger(oXmlNode.GetAttributeOrValue(_T("antialiastext"), _T("0")));
			StringAlignmentVertical = XmlUtils::GetInteger(oXmlNode.GetAttributeOrValue(_T("stringalignmentvertical"), _T("0")));
			StringAlignmentHorizontal = XmlUtils::GetInteger(oXmlNode.GetAttributeOrValue(_T("stringalignmenthorizontal"), _T("0")));
			ImageAlphMode = XmlUtils::GetInteger(oXmlNode.GetAttributeOrValue(_T("imagealphmode"), _T("0")));

			Update();
		}		
			
		static StringAlignment GetAlignment(long val)
		{
			switch(val)
			{
				case 0:
					return StringAlignmentNear;
				case 1:
					return StringAlignmentCenter;
				case 2:
					return StringAlignmentFar;
			}
			return StringAlignmentNear;
		}
		
		BOOL GetAntiAliasPen() const
		{
			return AntiAliasPen;
		}
		void SetAntiAliasPen(BOOL bAntiAliasPen)
		{
			AntiAliasPen = bAntiAliasPen;
		}
		BOOL GetAntiAliasBrush() const
		{
			return AntiAliasBrush;
		}
		void SetAntiAliasBrush(BOOL bAntiAliasBrush)
		{
			AntiAliasBrush = bAntiAliasBrush;
		}
		BOOL GetAntiAliasText() const
		{
			return AntiAliasText;
		}
		void SetAntiAliasText(BOOL bAntiAliasText)
		{
			AntiAliasText = bAntiAliasText;
		}
		long GetStringAlignmentVertical() const
		{
			return StringAlignmentVertical;
		}
		void SetStringAlignmentVertical(long nStringAlignmentVertical)
		{
			if (StringAlignmentVertical != nStringAlignmentVertical)
				Clear();

			StringAlignmentVertical = nStringAlignmentVertical;
		}
		long GetStringAlignmentHorizontal() const
		{
			return StringAlignmentHorizontal;
		}
		void SetStringAlignmentHorizontal(long nStringAlignmentHorizontal)
		{
			if (StringAlignmentHorizontal != nStringAlignmentHorizontal)
				Clear();

			StringAlignmentHorizontal = nStringAlignmentHorizontal;
		}
		long GetImageAlphaMode() const
		{
			return ImageAlphMode;
		}
		void SetImageAlphaMode(long nImageAlphaMode)
		{
			ImageAlphMode = nImageAlphaMode;
		}
		
		void FromFormat(const CFormat& oFormat)
		{
			SetAntiAliasPen(oFormat.GetAntiAliasPen());
			SetAntiAliasBrush(oFormat.GetAntiAliasBrush());
			SetAntiAliasText(oFormat.GetAntiAliasText());
			SetStringAlignmentVertical(oFormat.GetStringAlignmentVertical());
			SetStringAlignmentHorizontal(oFormat.GetStringAlignmentHorizontal());
			SetImageAlphaMode(oFormat.GetImageAlphaMode());
		}
		
	public:
		
		CFormat()
		{
			m_stringFormat = 0;
			AntiAliasPen = TRUE;
			AntiAliasBrush = TRUE;
			AntiAliasText = TRUE;
			StringAlignmentVertical = 0;
			StringAlignmentHorizontal = 0;
			ImageAlphMode = 0;
		}
		CFormat( const CFormat& other )
		{
			m_stringFormat = 0;
			
			AntiAliasPen   = other.AntiAliasPen;
			AntiAliasBrush = other.AntiAliasBrush;
			AntiAliasText  = other.AntiAliasText;
			StringAlignmentVertical   = other.StringAlignmentVertical;
			StringAlignmentHorizontal = other.StringAlignmentHorizontal;
			ImageAlphMode  = other.ImageAlphMode;
		}
		CFormat& operator=(const CFormat& other)
		{
			Clear();

			AntiAliasPen   = other.AntiAliasPen;
			AntiAliasBrush = other.AntiAliasBrush;
			AntiAliasText  = other.AntiAliasText;
			StringAlignmentVertical   = other.StringAlignmentVertical;
			StringAlignmentHorizontal = other.StringAlignmentHorizontal;
			ImageAlphMode  = other.ImageAlphMode;
			
			return *this;
		}
		~CFormat()
		{
			Clear();
		}
		
		void Update()
		{
			Clear();
		}
		void Clear()
		{
			if (m_stringFormat)
			{
				delete m_stringFormat;
				m_stringFormat = 0;
			}
		}

		Gdiplus::StringFormat* GetStringFormat()
		{
			if (m_stringFormat)
				return m_stringFormat;

			StringFormat* pStringFormat = new StringFormat();
			pStringFormat->SetAlignment(GetAlignment(StringAlignmentHorizontal));
			pStringFormat->SetLineAlignment(GetAlignment(StringAlignmentVertical)); 
			
			m_stringFormat = pStringFormat;

			return m_stringFormat;
		}
	};
	class CShadow
	{
		Gdiplus::Brush* m_brush;
	
	public:
	
		BOOL Visible;
		double DistanceX;
		double DistanceY;
		double BlurSize;
		long Color;
		long Alpha;
	
	public:
	
		int GetSize()
		{
			return 3*sizeof(long) + 3*sizeof(double);
		}
		void Write(CStream& stream)
		{
			stream.WriteLong(Visible);
			stream.WriteDouble(DistanceX);
			stream.WriteDouble(DistanceY);
			stream.WriteDouble(BlurSize);
			stream.WriteLong(Color);
			stream.WriteLong(Alpha);
		}
		void Read(CStream& stream)
		{
			Visible = stream.ReadLong();
			DistanceX = stream.ReadDouble();
			DistanceY = stream.ReadDouble();
			BlurSize = stream.ReadDouble();
			Color = stream.ReadLong();
			Alpha = stream.ReadLong();

			Update();
		}
		CString ToXmlString(CString strRootNodeName = _T("shadow"), BOOL bAttributed = FALSE)
		{
			XmlUtils::CXmlWriter oXmlWriter;

			if (!bAttributed)
			{
				oXmlWriter.WriteNodeBegin(strRootNodeName);
				oXmlWriter.WriteNode(_T("visible"), Visible);
				oXmlWriter.WriteNode(_T("distancex"), DistanceX);
				oXmlWriter.WriteNode(_T("distancey"), DistanceY);
				oXmlWriter.WriteNode(_T("blursize"), BlurSize);
				oXmlWriter.WriteNode(_T("color"), Color);
				oXmlWriter.WriteNode(_T("alpha"), Alpha);
				oXmlWriter.WriteNodeEnd(strRootNodeName);
			}
			else
			{
				oXmlWriter.WriteNodeBegin(strRootNodeName, TRUE);

				ToXmlAttributes(oXmlWriter);

				oXmlWriter.WriteNodeEnd(strRootNodeName, TRUE);
			}

			return oXmlWriter.GetXmlString();
		}
		void FromXmlString(CString strXml)
		{
			XmlUtils::CXmlReader oXmlReader;

			oXmlReader.SetXmlString(strXml);
			oXmlReader.ReadRootNode();

			FromXmlAttributes(oXmlReader);
		}
	
		BOOL FromStream(Streams::IStream* pStream)
		{
			if (!pStream)
				return FALSE;

			try
			{
				Visible = pStream->ReadLong();
				DistanceX = pStream->ReadDouble();
				DistanceY = pStream->ReadDouble();
				BlurSize = pStream->ReadDouble();
				Color = pStream->ReadLong();
				Alpha = pStream->ReadLong();

				Update();

				return TRUE;
			}
			catch (...)
			{
			}

			return FALSE;
		}
		BOOL ToStream(Streams::IStream* pStream)
		{
			if (!pStream)
				return FALSE;

			try
			{
				pStream->WriteLong(Visible);
				pStream->WriteDouble(DistanceX);
				pStream->WriteDouble(DistanceY);
				pStream->WriteDouble(BlurSize);
				pStream->WriteLong(Color);
				pStream->WriteLong(Alpha);

				return TRUE;
			}
			catch (...)
			{
			}

			return FALSE;
		}
		void ToXmlAttributes(XmlUtils::CXmlWriter& oXmlWriter)
		{
			oXmlWriter.WriteAttribute(_T("visible"), Visible);
			oXmlWriter.WriteAttribute(_T("distancex"), DistanceX);
			oXmlWriter.WriteAttribute(_T("distancey"), DistanceY);
			oXmlWriter.WriteAttribute(_T("blursize"), BlurSize);
			oXmlWriter.WriteAttribute(_T("color"), Color);
			oXmlWriter.WriteAttribute(_T("alpha"), Alpha);
		}
		void FromXmlAttributes(XmlUtils::CXmlReader& oXmlReader)
		{
			Visible = XmlUtils::GetInteger(oXmlReader.ReadNodeAttributeOrValue(_T("visible"), _T("0")));
			DistanceX = XmlUtils::GetDouble(oXmlReader.ReadNodeAttributeOrValue(_T("distancex"), _T("0")));
			DistanceY = XmlUtils::GetDouble(oXmlReader.ReadNodeAttributeOrValue(_T("distancey"), _T("0")));
			BlurSize = XmlUtils::GetDouble(oXmlReader.ReadNodeAttributeOrValue(_T("blursize"), _T("0")));
			Color = XmlUtils::GetInteger(oXmlReader.ReadNodeAttributeOrValue(_T("color"), _T("0")));
			Alpha = XmlUtils::GetInteger(oXmlReader.ReadNodeAttributeOrValue(_T("alpha"), _T("0")));

			Update();
		}		
		void FromXmlNode(XmlUtils::CXmlNode& oXmlNode)
		{
			Visible = XmlUtils::GetInteger(oXmlNode.GetAttributeOrValue(_T("visible"), _T("0")));
			DistanceX = XmlUtils::GetDouble(oXmlNode.GetAttributeOrValue(_T("distancex"), _T("0")));
			DistanceY = XmlUtils::GetDouble(oXmlNode.GetAttributeOrValue(_T("distancey"), _T("0")));
			BlurSize = XmlUtils::GetDouble(oXmlNode.GetAttributeOrValue(_T("blursize"), _T("0")));
			Color = XmlUtils::GetInteger(oXmlNode.GetAttributeOrValue(_T("color"), _T("0")));
			Alpha = XmlUtils::GetInteger(oXmlNode.GetAttributeOrValue(_T("alpha"), _T("0")));

			Update();
		}		
		
		BOOL GetVisible() const
		{
			return Visible;
		}
		void SetVisible(BOOL bVisible)
		{
			Visible = bVisible;
		}
		double GetDistanceX() const
		{
			return DistanceX;
		}
		void SetDistanceX(double nDistanceX)
		{
			DistanceX = nDistanceX;
		}
		double GetDistanceY() const
		{
			return DistanceY;
		}
		void SetDistanceY(double nDistanceY)
		{
			DistanceY = nDistanceY;
		}
		double GetBlurSize() const
		{
			return BlurSize;
		}
		void SetBlurSize(double nBlurSize)
		{
			BlurSize = nBlurSize;
		}
		long GetColor() const
		{
			return Color;
		}
		void SetColor(long nColor)
		{
			if (Color != nColor)
				Clear();

			Color = nColor;
		}
		long GetAlpha() const
		{
			return Alpha;
		}
		void SetAlpha(long nAlpha)
		{
			if (Alpha != nAlpha)
				Clear();

			Alpha = nAlpha;
		}
		
		void FromShadow(const CShadow& oShadow)
		{
			SetVisible(oShadow.GetVisible());
			SetDistanceX(oShadow.GetDistanceX());
			SetDistanceY(oShadow.GetDistanceY());
			SetBlurSize(oShadow.GetBlurSize());
			SetColor(oShadow.GetColor());
			SetAlpha(oShadow.GetAlpha());
		}

		void SetDefaultParams()
		{
			Visible   = FALSE;
			DistanceX = 15;
			DistanceY = 15;
			BlurSize  = 0;
			Color     = 0;
			Alpha     = 120;
		}
		
	public:
	
		CShadow()
		{
			m_brush = 0;
			Visible = TRUE;
			DistanceX = 15;
			DistanceY = 15;
			BlurSize = 0;
			Color = 0;
			Alpha = 120;
		}
		CShadow( const CShadow& other )
		{
			m_brush   = NULL;
			
			Visible   = other.Visible;
			DistanceX = other.DistanceX;
			DistanceY = other.DistanceY;
			BlurSize  = other.BlurSize;
			Color     = other.Color;
			Alpha     = other.Alpha;
						
		}
		CShadow& operator=(const CShadow& shadow)
		{
			Clear();

			FromShadow(shadow);

			return *this;
		}
		~CShadow()
		{
			Clear();
		}
	
		void Update()
		{
			Clear();
		}
		void Clear()
		{
			if( m_brush )
			{
				delete m_brush;
				m_brush = 0;
			}
		}

		Gdiplus::Brush* GetBrush()
		{
			if (m_brush)
				return m_brush;

			Gdiplus::Color color((BYTE)Alpha, GetRValue(Color), GetGValue(Color), GetBValue(Color));
			Gdiplus::Brush* pBrush = new SolidBrush(color);

			m_brush = pBrush;

			return m_brush;
		}

		void Draw(Graphics* Gr, Gdiplus::Font* font, StringFormat* format, BSTR Text, int len, RectF& rectDraw)
		{
			if (!Visible || !Gr)
				return;

			RectF shadowRect = rectDraw;
			shadowRect.X += float(DistanceX);
			shadowRect.Y += float(DistanceY);

			if (BlurSize) 
			{
				Gdiplus::Color color((BYTE)Alpha, GetRValue(Color), GetGValue(Color), GetBValue(Color));
				SolidBrush solid(color);
				RectF temp = shadowRect;
				for(float i = (float)BlurSize + 1.0F; i >= 1.0F; i--) 
				{
					int iAlpha = (int)((double)(Alpha/8./i/1.1));
					solid.SetColor(Gdiplus::Color((BYTE)iAlpha, GetRValue(Color), GetGValue(Color), GetBValue(Color)));
					DrawBlurString((int)i, Gr, font, format, &solid, Text, len, temp);
					temp = shadowRect;
				}
			}
			else
				Gr->DrawString(Text, len, font, shadowRect, format, GetBrush());
		}

		void Draw(Graphics* Gr, Gdiplus::Font* font, StringFormat* format, BSTR Text, int len, RectF& rectDraw, BYTE alpha)
		{
			if (!Visible || !Gr)
				return;

			RectF shadowRect = rectDraw;
			shadowRect.X += float(DistanceX);
			shadowRect.Y += float(DistanceY);

			Gdiplus::Color color((BYTE)(Alpha*alpha/255), GetRValue(Color), GetGValue(Color), GetBValue(Color));
			SolidBrush solid(color);

			if (BlurSize) 
			{	
				RectF temp = shadowRect;
				int nBlurSize = int(BlurSize);
				for(int i = 1; i <= nBlurSize + 1; i++) 
				{
					int iAlpha = (int)((double)((Alpha*alpha/255.)/8/(i)/1.1));
					solid.SetColor(Gdiplus::Color((BYTE)iAlpha, GetRValue(Color), GetGValue(Color), GetBValue(Color)));
					DrawBlurString(i, Gr, font, format, &solid, Text, len, temp);
					temp = shadowRect;
				}
			}
			else
				Gr->DrawString(Text, len, font, shadowRect, format, &solid);
		}
	};
	class CEdgeText
	{
		Gdiplus::Brush* m_brush;
		Gdiplus::Pen*   m_pen;

		double m_dTransparency; 
	
	public:
	
		long Visible;
		double Dist;
		long Color;
		long Alpha;
	
	public:
		
		int GetSize()
		{
			return 3*sizeof(long) + sizeof(double);
		}
		void Write(CStream& stream)
		{
			stream.WriteLong(Visible);
			stream.WriteDouble(Dist);
			stream.WriteLong(Color);
			stream.WriteLong(Alpha);
		}
		void Read(CStream& stream)
		{
			Visible = stream.ReadLong();
			Dist = stream.ReadDouble();
			Color = stream.ReadLong();
			Alpha = stream.ReadLong();

			Update();
		}
		CString ToXmlString(CString strRootNodeName = _T("edgetext"), BOOL bAttributed = FALSE)
		{
			XmlUtils::CXmlWriter oXmlWriter;

			if (!bAttributed)
			{
				oXmlWriter.WriteNodeBegin(strRootNodeName);
				oXmlWriter.WriteNode(_T("visible"), Visible);
				oXmlWriter.WriteNode(_T("dist"), Dist);
				oXmlWriter.WriteNode(_T("color"), Color);
				oXmlWriter.WriteNode(_T("alpha"), Alpha);
				oXmlWriter.WriteNodeEnd(strRootNodeName);
			}
			else
			{
				oXmlWriter.WriteNodeBegin(strRootNodeName, TRUE);

				ToXmlAttributes(oXmlWriter);

				oXmlWriter.WriteNodeEnd(strRootNodeName, TRUE);
			}

			return oXmlWriter.GetXmlString();
		}
		void FromXmlString(CString strXml)
		{
			XmlUtils::CXmlReader oXmlReader;

			oXmlReader.SetXmlString(strXml);
			oXmlReader.ReadRootNode();

			FromXmlAttributes(oXmlReader);
		}
	
		BOOL FromStream(Streams::IStream* pStream)
		{
			if (!pStream)
				return FALSE;

			try
			{
				Visible = pStream->ReadLong();
				Dist = pStream->ReadDouble();
				Color = pStream->ReadLong();
				Alpha = pStream->ReadLong();

				Update();

				return TRUE;
			}
			catch (...)
			{
			}

			return FALSE;
		}
		BOOL ToStream(Streams::IStream* pStream)
		{
			if (!pStream)
				return FALSE;

			try
			{
				pStream->WriteLong(Visible);
				pStream->WriteDouble(Dist);
				pStream->WriteLong(Color);
				pStream->WriteLong(Alpha);

				return TRUE;
			}
			catch (...)
			{
			}

			return FALSE;
		}
		void ToXmlAttributes(XmlUtils::CXmlWriter& oXmlWriter)
		{
			oXmlWriter.WriteAttribute(_T("visible"), Visible);
			oXmlWriter.WriteAttribute(_T("dist"), Dist);
			oXmlWriter.WriteAttribute(_T("color"), Color);
			oXmlWriter.WriteAttribute(_T("alpha"), Alpha);
		}
		void FromXmlAttributes(XmlUtils::CXmlReader& oXmlReader)
		{
			Visible = XmlUtils::GetInteger(oXmlReader.ReadNodeAttributeOrValue(_T("visible"), _T("0")));
			Dist = XmlUtils::GetDouble(oXmlReader.ReadNodeAttributeOrValue(_T("dist"), _T("0")));
			Color = XmlUtils::GetInteger(oXmlReader.ReadNodeAttributeOrValue(_T("color"), _T("0")));
			Alpha = XmlUtils::GetInteger(oXmlReader.ReadNodeAttributeOrValue(_T("alpha"), _T("0")));

			Update();
		}		
		void FromXmlNode(XmlUtils::CXmlNode& oXmlNode)
		{
			Visible = XmlUtils::GetInteger(oXmlNode.GetAttributeOrValue(_T("visible"), _T("0")));
			Dist = XmlUtils::GetDouble(oXmlNode.GetAttributeOrValue(_T("dist"), _T("0")));
			Color = XmlUtils::GetInteger(oXmlNode.GetAttributeOrValue(_T("color"), _T("0")));
			Alpha = XmlUtils::GetInteger(oXmlNode.GetAttributeOrValue(_T("alpha"), _T("0")));

			Update();
		}		
		
		long GetVisible() const
		{
			return Visible;
		}
		void SetVisible(long nVisible)
		{
			Visible = nVisible;
		}
		double GetDistance() const
		{
			return Dist;
		}
		void SetDistance(double nDistance)
		{
			Dist = nDistance;
		}
		long GetColor() const
		{
			return Color;
		}
		void SetColor(long nColor)
		{
			if (Color != nColor)
				Clear();

			Color = nColor;
		}
		long GetAlpha() const
		{
			return Alpha;
		}
		void SetAlpha(long nAlpha)
		{
			if (Alpha != nAlpha)
				Clear();

			Alpha = nAlpha;
		}
		
		void FromEdge(const CEdgeText& oEdge)
		{
			SetVisible(oEdge.GetVisible());
			SetDistance(oEdge.GetDistance());
			SetColor(oEdge.GetColor());
			SetAlpha(oEdge.GetAlpha());
		}

		void SetDefaultParams()
		{
			Visible = 0;
			Dist    = 5;
			Color   = 0;
			Alpha   = 255;
		}
		
	public:
	
		CEdgeText()
		{
			m_brush = 0;
			m_pen = 0;
			Visible = 0;
			Dist = 5;
			Color = 0;
			Alpha = 255;
			m_dTransparency = 1;
		}
		CEdgeText( const CEdgeText& other )
		{
			m_brush = 0;
			m_pen   = 0;
			Visible = other.Visible;
			Dist    = other.Dist;
			Color   = other.Color;
			Alpha   = other.Alpha;
			
			m_dTransparency = other.m_dTransparency;
		}
		CEdgeText& operator=(const CEdgeText& edge)
		{
			Clear();

			FromEdge(edge);

			return *this;
		}
		~CEdgeText()
		{
			Clear();
		}
	
		void Update()
		{
			Clear();
		}
		void Clear()
		{
			if (m_brush)
			{
				delete m_brush;
				m_brush = 0;
			}

			if (m_pen)
			{
				delete m_pen;
				m_pen   = 0;
			}
		}
		
		void SetTransparency( double dIntensity )
		{
			if( dIntensity > 1 ) dIntensity = 1;
			if( dIntensity < 0 ) dIntensity = 0;

			if( dIntensity != m_dTransparency )
			{
				int nOldAlpha = int(m_dTransparency * Alpha + 0.5);
				int nNewAlpha = int(dIntensity * Alpha + 0.5);

				if( nNewAlpha != nOldAlpha )
				{
					Update();
				}

				m_dTransparency = dIntensity;
			}
		}
		double GetTransparency() const
		{
			return m_dTransparency;
		}
		
		Gdiplus::Brush* GetBrush()
		{
			if (m_brush)
				return m_brush;

			Gdiplus::Color color((BYTE)(Alpha * m_dTransparency + 0.5), GetRValue(Color), GetGValue(Color), GetBValue(Color));
			Gdiplus::Brush* pBrush = new SolidBrush(color);

			m_brush = pBrush;

			return m_brush;
		}
		Gdiplus::Pen* GetPen()
		{
			if (m_pen)
				return m_pen;

			Gdiplus::Color color((BYTE)(Alpha * m_dTransparency + 0.5), GetRValue(Color), GetGValue(Color), GetBValue(Color));
			Gdiplus::Pen* pPen = new Gdiplus::Pen( color, REAL(Dist) );

			if( pPen )
			{
				pPen->SetLineJoin(LineJoinRound);
			}

			m_pen = pPen;

			return pPen;
		}

		
		void Draw(Graphics* Gr, Gdiplus::Font* font, StringFormat* format, BSTR Text, int len, RectF& rectDraw)
		{
			if (!Visible || !Gr)
				return;

			if (Visible == -1)
			{
				Gdiplus::Color color((BYTE)(Alpha), GetRValue(Color), GetGValue(Color), GetBValue(Color));
				SolidBrush solid(color);

				RectF temp = rectDraw;
				int offset = int(Dist);
				for(int i = offset; i >= 1; i--) 
				{
					int iAlpha = (int)((double)(Alpha/8/(i)/1.1));
					solid.SetColor(Gdiplus::Color((BYTE)iAlpha, GetRValue(Color), GetGValue(Color), GetBValue(Color)));
					DrawBlurString(i, Gr, font, format, &solid, Text, len, temp);
					temp = rectDraw;
				}
			}

			if (Visible == 1)
			{
				
				SmoothingMode oldSmoothingMode = Gr->GetSmoothingMode();
				Gr->SetSmoothingMode(SmoothingModeHighQuality);

				
				RectF temp = rectDraw;
				FontFamily family; font->GetFamily(&family);
				GraphicsPath path; path.AddString(Text, len, &family, font->GetStyle(), font->GetSize(), temp, format);

				
				int offset = int(Dist);
				for (int i = 1; i <= offset; i++)
				{
					Gdiplus::Pen pen(Gdiplus::Color((BYTE)(Alpha*i/offset), GetRValue(Color), GetGValue(Color), GetBValue(Color)), (REAL) 2*(offset - i + 1));
					pen.SetLineCap(LineCapRound, LineCapRound, DashCapRound);
					Gr->DrawPath(&pen, &path);
				}

				
				Gr->SetSmoothingMode(oldSmoothingMode);
			}
			if (Visible == 2)
			{
				
				GraphicsState state = Gr->Save();
				Gr->SetSmoothingMode(SmoothingModeHighQuality);
				Gr->SetClip(rectDraw);

				
				RectF temp = rectDraw;
				FontFamily family; font->GetFamily(&family);
				GraphicsPath path; path.AddString(Text, len, &family, font->GetStyle(), font->GetSize(), temp, format);

				
				int offset = int(Dist);
				for (int i = 1; i <= offset; i++)
				{
					Gdiplus::Pen pen(Gdiplus::Color((BYTE)(Alpha*i/offset), GetRValue(Color), GetGValue(Color), GetBValue(Color)), (REAL) 2*(offset - i + 1));
					pen.SetLineCap(LineCapRound, LineCapRound, DashCapRound);
					Gr->DrawPath(&pen, &path);
				}

				
				Gr->Restore(state);
			}
		}
		void Draw(Graphics* Gr, Gdiplus::Font* font, StringFormat* format, BSTR Text, int len, RectF& rectDraw, BYTE alpha)
		{
			if (!Visible || !Gr)
				return;

			if (Visible == -1)
			{
				Gdiplus::Color color((BYTE)((double)(Alpha*alpha/255.), GetRValue(Color), GetGValue(Color), GetBValue(Color)));
				SolidBrush solid(color);
				RectF temp = rectDraw;
				for(int i = 1; i <= Dist; i++) 
				{
					int iAlpha = (int)((double)(Alpha*alpha/255./8/(i)/1.1));
					solid.SetColor(Gdiplus::Color((BYTE)iAlpha, GetRValue(Color), GetGValue(Color), GetBValue(Color)));
					DrawBlurString(i, Gr, font, format, &solid, Text, len, temp);
					temp = rectDraw;
				}
			}
			if (Visible == 1)
			{
				
				SmoothingMode oldSmoothingMode = Gr->GetSmoothingMode();
				Gr->SetSmoothingMode(SmoothingModeHighQuality);

				
				FontFamily family; font->GetFamily(&family);
				GraphicsPath path; path.AddString(Text, len, &family, font->GetStyle(), font->GetSize(), rectDraw, format);

				
				int offset = int(Dist);
				for (int i = 1; i <= offset; i++)
				{
					Gdiplus::Pen pen(Gdiplus::Color((BYTE)(Alpha*i*alpha/(offset*255)), GetRValue(Color), GetGValue(Color), GetBValue(Color)), (REAL) 2*(offset - i + 1));
					pen.SetLineCap(LineCapRound, LineCapRound, DashCapRound);
					Gr->DrawPath(&pen, &path);
				}

				
				Gr->SetSmoothingMode(oldSmoothingMode);
			}
		}
	};
	
	
	class CLine
	{
	public:
	
		double X1;
		double Y1;
		double X2;
		double Y2;
		
	public:
	
		int GetSize()
		{
			return 4*sizeof(double) + (4);
		}
		void Write(CStream& stream)
		{
			stream.WriteDouble(X1);
			stream.WriteDouble(Y1);
			stream.WriteDouble(X2);
			stream.WriteDouble(Y2);
		}
		void Read(CStream& stream)
		{
			Clear();

			X1 = stream.ReadDouble();
			Y1 = stream.ReadDouble();
			X2 = stream.ReadDouble();
			Y2 = stream.ReadDouble();
		}
		CString ToXmlString(CString strRootNodeName = _T("line"), BOOL bAttributed = FALSE)
		{
			XmlUtils::CXmlWriter oXmlWriter;

			if (!bAttributed)
			{
				oXmlWriter.WriteNodeBegin(strRootNodeName);
				oXmlWriter.WriteNode(_T("x1"), X1);
				oXmlWriter.WriteNode(_T("y1"), Y1);
				oXmlWriter.WriteNode(_T("x2"), X2);
				oXmlWriter.WriteNode(_T("y2"), Y2);
				oXmlWriter.WriteNodeEnd(strRootNodeName);
			}
			else
			{
				oXmlWriter.WriteNodeBegin(strRootNodeName, TRUE);
				oXmlWriter.WriteAttribute(_T("x1"), X1);
				oXmlWriter.WriteAttribute(_T("y1"), Y1);
				oXmlWriter.WriteAttribute(_T("x2"), X2);
				oXmlWriter.WriteAttribute(_T("y2"), Y2);
				oXmlWriter.WriteNodeEnd(strRootNodeName, TRUE);
			}

			return oXmlWriter.GetXmlString();
		}
		void FromXmlString(CString strXml)
		{
			Clear();

			XmlUtils::CXmlReader oXmlReader;

			oXmlReader.SetXmlString(strXml);
			oXmlReader.ReadRootNode();

			X1 = XmlUtils::GetDouble(oXmlReader.ReadNodeAttributeOrValue(_T("x1"), _T("0")));
			Y1 = XmlUtils::GetDouble(oXmlReader.ReadNodeAttributeOrValue(_T("y1"), _T("0")));
			X2 = XmlUtils::GetDouble(oXmlReader.ReadNodeAttributeOrValue(_T("x2"), _T("0")));
			Y2 = XmlUtils::GetDouble(oXmlReader.ReadNodeAttributeOrValue(_T("y2"), _T("0")));
		}
		
	public:

		CLine()
		{
			X1 = 0;
			Y1 = 0;
			X2 = 0;
			Y2 = 0;
		}
		CLine& operator=(const CLine& line)
		{
			Clear();

			X1 = line.X1;
			Y1 = line.Y1;
			X2 = line.X2;
			Y2 = line.Y2;

			return *this;
		}
		~CLine()
		{
			Clear();
		}
		
		void Clear()
		{
			X1 = 0;
			Y1 = 0;
			X2 = 0;
			Y2 = 0;
		}
	};
	class CRectangle
	{
	public:
	
		double Left;
		double Top;
		double Width;
		double Height;
		
	public:
	
		int GetSize()
		{
			return 4*sizeof(double) + (4);
		}
		void Write(CStream& stream)
		{
			stream.WriteDouble(Left);
			stream.WriteDouble(Top);
			stream.WriteDouble(Width);
			stream.WriteDouble(Height);
		}
		void Read(CStream& stream)
		{
			Clear();

			Left = stream.ReadDouble();
			Top = stream.ReadDouble();
			Width = stream.ReadDouble();
			Height = stream.ReadDouble();
		}
		CString ToXmlString(CString strRootNodeName = _T("rectangle"), BOOL bAttributed = FALSE)
		{
			XmlUtils::CXmlWriter oXmlWriter;

			if (!bAttributed)
			{
				oXmlWriter.WriteNodeBegin(strRootNodeName);
				oXmlWriter.WriteNode(_T("left"), Left);
				oXmlWriter.WriteNode(_T("top"), Top);
				oXmlWriter.WriteNode(_T("width"), Width);
				oXmlWriter.WriteNode(_T("height"), Height);
				oXmlWriter.WriteNodeEnd(strRootNodeName);
			}
			else
			{
				oXmlWriter.WriteNodeBegin(strRootNodeName, TRUE);
				oXmlWriter.WriteAttribute(_T("left"), Left);
				oXmlWriter.WriteAttribute(_T("top"), Top);
				oXmlWriter.WriteAttribute(_T("width"), Width);
				oXmlWriter.WriteAttribute(_T("height"), Height);
				oXmlWriter.WriteNodeEnd(strRootNodeName, TRUE);
			}

			return oXmlWriter.GetXmlString();
		}
		void FromXmlString(CString strXml)
		{
			Clear();

			XmlUtils::CXmlReader oXmlReader;

			oXmlReader.SetXmlString(strXml);
			oXmlReader.ReadRootNode();

			Left = XmlUtils::GetDouble(oXmlReader.ReadNodeAttributeOrValue(_T("left"), _T("0")));
			Top = XmlUtils::GetDouble(oXmlReader.ReadNodeAttributeOrValue(_T("top"), _T("0")));
			Width = XmlUtils::GetDouble(oXmlReader.ReadNodeAttributeOrValue(_T("width"), _T("0")));
			Height = XmlUtils::GetDouble(oXmlReader.ReadNodeAttributeOrValue(_T("height"), _T("0")));
		}
		
	public:

		CRectangle()
		{
			Left = 0;
			Top = 0;
			Width = 0;
			Height = 0;
		}
		CRectangle& operator=(const CRectangle& rectangle)
		{
			Clear();

			Left = rectangle.Left;
			Top = rectangle.Top;
			Width = rectangle.Width;
			Height = rectangle.Height;

			return *this;
		}
		~CRectangle()
		{
			Clear();
		}
		
		void Clear()
		{
			Left = 0;
			Top = 0;
			Width = 0;
			Height = 0;
		}
	};
	class CEllipse
	{
	public:
	
		double Left;
		double Top;
		double Width;
		double Height;
		
	public:
	
		int GetSize()
		{
			return 4*sizeof(double) + (4);
		}
		void Write(CStream& stream)
		{
			stream.WriteDouble(Left);
			stream.WriteDouble(Top);
			stream.WriteDouble(Width);
			stream.WriteDouble(Height);
		}
		void Read(CStream& stream)
		{
			Clear();

			Left = stream.ReadDouble();
			Top = stream.ReadDouble();
			Width = stream.ReadDouble();
			Height = stream.ReadDouble();
		}
		CString ToXmlString(CString strRootNodeName = _T("ellipse"), BOOL bAttributed = FALSE)
		{
			XmlUtils::CXmlWriter oXmlWriter;

			if (!bAttributed)
			{
				oXmlWriter.WriteNodeBegin(strRootNodeName);
				oXmlWriter.WriteNode(_T("left"), Left);
				oXmlWriter.WriteNode(_T("top"), Top);
				oXmlWriter.WriteNode(_T("width"), Width);
				oXmlWriter.WriteNode(_T("height"), Height);
				oXmlWriter.WriteNodeEnd(strRootNodeName);
			}
			else
			{
				oXmlWriter.WriteNodeBegin(strRootNodeName, TRUE);
				oXmlWriter.WriteAttribute(_T("left"), Left);
				oXmlWriter.WriteAttribute(_T("top"), Top);
				oXmlWriter.WriteAttribute(_T("width"), Width);
				oXmlWriter.WriteAttribute(_T("height"), Height);
				oXmlWriter.WriteNodeEnd(strRootNodeName, TRUE);
			}

			return oXmlWriter.GetXmlString();
		}
		void FromXmlString(CString strXml)
		{
			Clear();

			XmlUtils::CXmlReader oXmlReader;

			oXmlReader.SetXmlString(strXml);
			oXmlReader.ReadRootNode();

			Left = XmlUtils::GetDouble(oXmlReader.ReadNodeAttributeOrValue(_T("left"), _T("0")));
			Top = XmlUtils::GetDouble(oXmlReader.ReadNodeAttributeOrValue(_T("top"), _T("0")));
			Width = XmlUtils::GetDouble(oXmlReader.ReadNodeAttributeOrValue(_T("width"), _T("0")));
			Height = XmlUtils::GetDouble(oXmlReader.ReadNodeAttributeOrValue(_T("height"), _T("0")));
		}
		
	public:

		CEllipse()
		{
			Left = 0;
			Top = 0;
			Width = 0;
			Height = 0;
		}
		CEllipse& operator=(const CEllipse& ellipse)
		{
			Clear();

			Left = ellipse.Left;
			Top = ellipse.Top;
			Width = ellipse.Width;
			Height = ellipse.Height;

			return *this;
		}
		~CEllipse()
		{
			Clear();
		}
		
		void Clear()
		{
			Left = 0;
			Top = 0;
			Width = 0;
			Height = 0;
		}
	};
	class CText
	{
	public:
	
		double Left;
		double Top;
		double Width;
		double Height;
		CString Text;
		
	public:
	
		int GetSize()
		{
			return 4*sizeof(double) + Text.GetLength() + 1 + (4);
		}
		void Write(CStream& stream)
		{
			stream.WriteDouble(Left);
			stream.WriteDouble(Top);
			stream.WriteDouble(Width);
			stream.WriteDouble(Height);
			stream.WriteString(Text);
		}
		void Read(CStream& stream)
		{
			Clear();

			Left = stream.ReadDouble();
			Top = stream.ReadDouble();
			Width = stream.ReadDouble();
			Height = stream.ReadDouble();
			Text = stream.ReadString();
		}
		CString ToXmlString(CString strRootNodeName = _T("text"), BOOL bAttributed = FALSE)
		{
			XmlUtils::CXmlWriter oXmlWriter;

			if (!bAttributed)
			{
				oXmlWriter.WriteNodeBegin(strRootNodeName);
				oXmlWriter.WriteNode(_T("left"), Left);
				oXmlWriter.WriteNode(_T("top"), Top);
				oXmlWriter.WriteNode(_T("width"), Width);
				oXmlWriter.WriteNode(_T("height"), Height);
				oXmlWriter.WriteNode(_T("text"), Text);
				oXmlWriter.WriteNodeEnd(strRootNodeName);
			}
			else
			{
				oXmlWriter.WriteNodeBegin(strRootNodeName, TRUE);
				oXmlWriter.WriteAttribute(_T("left"), Left);
				oXmlWriter.WriteAttribute(_T("top"), Top);
				oXmlWriter.WriteAttribute(_T("width"), Width);
				oXmlWriter.WriteAttribute(_T("height"), Height);
				oXmlWriter.WriteAttribute(_T("text"), Text);
				oXmlWriter.WriteNodeEnd(strRootNodeName, TRUE);
			}

			return oXmlWriter.GetXmlString();
		}
		void FromXmlString(CString strXml)
		{
			Clear();

			XmlUtils::CXmlReader oXmlReader;

			oXmlReader.SetXmlString(strXml);
			oXmlReader.ReadRootNode();

			Left = XmlUtils::GetDouble(oXmlReader.ReadNodeAttributeOrValue(_T("left"), _T("0")));
			Top = XmlUtils::GetDouble(oXmlReader.ReadNodeAttributeOrValue(_T("top"), _T("0")));
			Width = XmlUtils::GetDouble(oXmlReader.ReadNodeAttributeOrValue(_T("width"), _T("0")));
			Height = XmlUtils::GetDouble(oXmlReader.ReadNodeAttributeOrValue(_T("height"), _T("0")));
			Text = oXmlReader.ReadNodeAttributeOrValue(_T("text"), _T(""));
		}
		
	public:

		CText()
		{
			Left = 0;
			Top = 0;
			Width = 0;
			Height = 0;
			Text = "";
		}
		CText& operator=(const CText& text)
		{
			Clear();

			Left = text.Left;
			Top = text.Top;
			Width = text.Width;
			Height = text.Height;
			Text = text.Text;

			return *this;
		}
		~CText()
		{
			Clear();
		}
		
		void Clear()
		{
			Left = 0;
			Top = 0;
			Width = 0;
			Height = 0;
			Text = "";
		}
	};
	
	
	class CTransformCrop
	{
	public:
	
		BOOL ClearBackground;
		double Left;
		double Top;
		double Width;
		double Height;
		
	public:
	
		int GetSize()
		{
			return 4*sizeof(double) + sizeof(long) + (4);
		}
		void Write(CStream& stream)
		{
			stream.WriteLong(ClearBackground);
			stream.WriteDouble(Left);
			stream.WriteDouble(Top);
			stream.WriteDouble(Width);
			stream.WriteDouble(Height);
		}
		void Read(CStream& stream)
		{
			Clear();

			ClearBackground = stream.ReadLong();
			Left = stream.ReadDouble();
			Top = stream.ReadDouble();
			Width = stream.ReadDouble();
			Height = stream.ReadDouble();
		}
		CString ToXmlString(CString strRootNodeName = _T("transform-crop"), BOOL bAttributed = FALSE)
		{
			XmlUtils::CXmlWriter oXmlWriter;

			if (!bAttributed)
			{
				oXmlWriter.WriteNodeBegin(strRootNodeName);
				oXmlWriter.WriteNode(_T("clear"), ClearBackground);
				oXmlWriter.WriteNode(_T("left"), Left);
				oXmlWriter.WriteNode(_T("top"), Top);
				oXmlWriter.WriteNode(_T("width"), Width);
				oXmlWriter.WriteNode(_T("height"), Height);
				oXmlWriter.WriteNodeEnd(strRootNodeName);
			}
			else
			{
				oXmlWriter.WriteNodeBegin(strRootNodeName, TRUE);
				oXmlWriter.WriteAttribute(_T("clear"), ClearBackground);
				oXmlWriter.WriteAttribute(_T("left"), Left);
				oXmlWriter.WriteAttribute(_T("top"), Top);
				oXmlWriter.WriteAttribute(_T("width"), Width);
				oXmlWriter.WriteAttribute(_T("height"), Height);
				oXmlWriter.WriteNodeEnd(strRootNodeName, TRUE);
			}

			return oXmlWriter.GetXmlString();
		}
		void FromXmlString(CString strXml)
		{
			Clear();

			XmlUtils::CXmlReader oXmlReader;

			oXmlReader.SetXmlString(strXml);
			oXmlReader.ReadRootNode();

			ClearBackground = XmlUtils::GetInteger(oXmlReader.ReadNodeAttributeOrValue(_T("clear"), _T("0")));
			Left = XmlUtils::GetDouble(oXmlReader.ReadNodeAttributeOrValue(_T("left"), _T("0")));
			Top = XmlUtils::GetDouble(oXmlReader.ReadNodeAttributeOrValue(_T("top"), _T("0")));
			Width = XmlUtils::GetDouble(oXmlReader.ReadNodeAttributeOrValue(_T("width"), _T("0")));
			Height = XmlUtils::GetDouble(oXmlReader.ReadNodeAttributeOrValue(_T("height"), _T("0")));
		}
		
	public:

		CTransformCrop()
		{
			ClearBackground = 1;
			Left = 0;
			Top = 0;
			Width = 0;
			Height = 0;
		}
		CTransformCrop& operator=(const CTransformCrop& transform)
		{
			Clear();

			ClearBackground = transform.ClearBackground;
			Left = transform.Left;
			Top = transform.Top;
			Width = transform.Width;
			Height = transform.Height;

			return *this;
		}
		~CTransformCrop()
		{
			Clear();
		}
		
		void Clear()
		{
			ClearBackground = 1;
			Left = 0;
			Top = 0;
			Width = 0;
			Height = 0;
		}
	};
}
