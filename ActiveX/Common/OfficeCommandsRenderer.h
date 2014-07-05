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
#include "AVSUtils.h"
#include "atlcoll.h"
#include "Interfaces.h"

#include "TimeMeasurer.h"
#include "TemporaryCS.h"

[coclass, uuid("0D0A274B-2317-4839-B636-C734FCD0DF34"), threading(apartment), vi_progid("PageCommands"), progid("PageCommands.1"), version(1.0)]
class ATL_NO_VTABLE CAVSPageCommands :	public IAVSPageCommands, public IAVSOfficeRendererTemplate2
{
public:
	class CBufferPage
	{
	public:
		enum CommandType
		{
			ctSetPen						= 0,
			ctSetBrush						= 1,
			ctSetFont						= 2,
			ctSetShadow						= 3,
			ctSetEdgeText					= 4,

			ctDrawText						= 5,
			
			ctPathCommandMoveTo				= 6,
			ctPathCommandLineTo				= 7,
			ctPathCommandLinesTo			= 8,
			ctPathCommandCurveTo			= 9,
			ctPathCommandCurvesTo			= 10,
			ctPathCommandArcTo				= 11,
			ctPathCommandClose				= 12,
			ctPathCommandEnd				= 13,
			ctDrawPath						= 14,
			ctPathCommandStart				= 15,
			ctPathCommandGetCurrentPoint	= 16,	

			ctDrawImage						= 17,
			ctDrawImageFromFile				= 18,

			ctSetParams						= 19,

			ctBeginCommand					= 20,
			ctEndCommand					= 21,

			ctSetTransform					= 22,
			ctResetTransform				= 23,
			ctClipMode						= 24,

			ctPathCommandText				= 25
		};

	private: 
		class CCommandsCache
		{
		private:
			class CLetter
			{
			public:
				CString m_strCommand;
				LONG	m_lIndex;

			public:
				CLetter()
				{
					m_strCommand	= _T("");
					m_lIndex		= -1;
				}
				CLetter& operator=(const CLetter& oSrc)
				{
					m_strCommand	= oSrc.m_strCommand;
					m_lIndex		= m_lIndex;
				}
				CLetter(const CLetter& oSrc)
				{
					*this = oSrc;
				}
			};

		private:
			CAtlArray<CLetter> m_arrPens;
			CAtlArray<CLetter> m_arrBrushes;
			CAtlArray<CLetter> m_arrFonts;
			
			

			size_t m_lCountCache;

		public:

			CCommandsCache() : m_arrPens(), m_arrBrushes(), m_arrFonts()
			{
				m_lCountCache = 5;
			}
			~CCommandsCache()
			{
			}

		public:

			LONG AddPen(const CString& str, CAtlArray<CString>* pArray)
			{
				return GetEqualIndex(&m_arrPens, pArray, str);
			}
			LONG AddBrush(const CString& str, CAtlArray<CString>* pArray)
			{
				return GetEqualIndex(&m_arrBrushes, pArray, str);
			}
			LONG AddFont(const CString& str, CAtlArray<CString>* pArray)
			{
				return GetEqualIndex(&m_arrFonts, pArray, str);
			}

		protected:

			LONG GetEqualIndex(CAtlArray<CLetter>* pArray, CAtlArray<CString>* pArrayGlobal, const CString& str)
			{
				size_t nCount = pArray->GetCount();
				size_t nIndex = 0;

				for (; nIndex < nCount; ++nIndex)
				{
					if (((*pArray)[nIndex]).m_strCommand == str)
					{
						return ((*pArray)[nIndex]).m_lIndex;
					}
				}

				

				LONG lIndexNew = (LONG)pArrayGlobal->GetCount();
				pArrayGlobal->Add(str);
				
				if (nIndex >= m_lCountCache)
				{
					pArray->RemoveAt(0);
					--nCount;
				}

				pArray->Add();
				((*pArray)[nCount]).m_strCommand = str;
				((*pArray)[nCount]).m_lIndex	 = lIndexNew;

				return lIndexNew;
			}
		};

	private:
		BYTE* m_pBuffer;
		BYTE* m_pBufferMem;
		
		size_t m_lPosition;
		size_t m_lSize;

		CAtlArray<CString> m_arStrings;
		CAtlArray<IUnknown*> m_arImages;

		BOOL			m_bIsAdvanced;			
		CBufferPage*	m_pAdvancedCommands;

	public:
		float m_fWidth;
		float m_fHeight;

	private:
		LONG m_lSizeofDouble;
		LONG m_lSizeofFloat;
		LONG m_lSizeofLONG;

		CString m_strOldPen;
		CString m_strOldBrush;
		CString m_strOldFont;
		CString m_strOldShadow;
		CString m_strOldEdge;

		CCommandsCache m_oGraphicsCache;

	public:
		CBufferPage() : m_arImages(), m_arStrings(), m_oGraphicsCache()
		{
			Clear();

			m_fWidth = 210;
			m_fHeight = 190;

			m_lSizeofDouble	= sizeof(double);
			m_lSizeofFloat 	= sizeof(float);
			m_lSizeofLONG	= sizeof(long);

			m_strOldPen		= _T("");
			m_strOldBrush	= _T("");
			m_strOldFont	= _T("");
			m_strOldShadow	= _T("");
			m_strOldEdge	= _T("");

			m_pAdvancedCommands = NULL;
			m_bIsAdvanced		= FALSE;
		}
		~CBufferPage()
		{
			RELEASEARRAYOBJECTS(m_pBuffer);

			m_arStrings.RemoveAll();

			size_t nCount = m_arImages.GetCount();
			for (size_t nIndex = 0; nIndex < nCount; ++nIndex)
			{
				IUnknown* punkImage = m_arImages[nIndex];
				RELEASEINTERFACE(punkImage);
			}

			m_arImages.RemoveAll();

			RELEASEOBJECT(m_pAdvancedCommands);
		}

		void ReleaseAdvanced()
		{
			RELEASEOBJECT(m_pAdvancedCommands);
			m_bIsAdvanced = FALSE;
		}

		CBufferPage(const CBufferPage& oSrc)
		{
			*this = oSrc;
		}

		CBufferPage& operator =(const CBufferPage& oSrc)
		{
			m_fWidth	= oSrc.m_fWidth;
			m_fHeight	= oSrc.m_fHeight;

			m_pBuffer = oSrc.m_pBuffer;

			m_arImages.Copy(oSrc.m_arImages);
			m_arStrings.Copy(oSrc.m_arStrings);

			m_lPosition	= oSrc.m_lPosition;
			m_lSize		= oSrc.m_lSize;

			m_pAdvancedCommands = oSrc.m_pAdvancedCommands;
			m_bIsAdvanced		= oSrc.m_bIsAdvanced;
			
			return *this;
		}

		void Clear()
		{
			m_lSize = 1000;
			m_lPosition = 0;

			m_pBuffer = new BYTE[m_lSize];

			m_arImages.RemoveAll();
			m_arStrings.RemoveAll();
		}

		inline LONG ReadLONG(const size_t& pos)
		{
			return *((LONG*)(m_pBuffer + pos));
		}
		inline float ReadFloat(const size_t& pos)
		{
			return *((float*)(m_pBuffer + pos));
		}
		inline BYTE ReadByte(const size_t& pos)
		{
			return *(m_pBuffer + pos);
		}
		inline double ReadDouble(const size_t& pos)
		{
			return *((double*)(m_pBuffer + pos));
		}

		inline LONG ReadLONG()
		{
			LONG l = *((LONG*)m_pBufferMem);
			m_pBufferMem += m_lSizeofLONG;
			return l;
		}
		inline float ReadFloat()
		{
			float l = *((float*)m_pBufferMem);
			m_pBufferMem += m_lSizeofFloat;
			return l;
		}
		inline BYTE ReadByte()
		{
			BYTE l = *m_pBufferMem;
			++m_pBufferMem;
			return l;
		}
		inline double ReadDouble()
		{
			double l = *((double*)m_pBufferMem);
			m_pBufferMem += m_lSizeofDouble;
			return l;
		}

		void CheckBufferSize(size_t lPlus)
		{
			size_t nNewSize = m_lPosition + lPlus;

			if (nNewSize >= m_lSize)
			{
				while (nNewSize >= m_lSize)
				{
					m_lSize *= 2;
				}
				
				BYTE* pNew = new BYTE[m_lSize];
				memcpy(pNew, m_pBuffer, m_lPosition);

				RELEASEARRAYOBJECTS(m_pBuffer);
				m_pBuffer = pNew;
			}
		}

		void Write(LONG lCommand)
		{
			size_t lMem = sizeof(LONG);

			CheckBufferSize(lMem);

			*((LONG*)(m_pBuffer + m_lPosition))	= lCommand; m_lPosition += sizeof(LONG);
		}

		void Write(LONG lCommand, LONG lType)
		{
			size_t lMem = 2 * sizeof(LONG);

			CheckBufferSize(lMem);

			*((LONG*)(m_pBuffer + m_lPosition))	= lCommand; m_lPosition += sizeof(LONG);
			*((LONG*)(m_pBuffer + m_lPosition))	= lType;	m_lPosition += sizeof(LONG);
		}

		void Write(LONG lCommand, float f1, float f2)
		{
			size_t lMem = sizeof(LONG) + 2 * sizeof(float);

			CheckBufferSize(lMem);

			*((LONG*)(m_pBuffer + m_lPosition))	= lCommand; m_lPosition += sizeof(LONG);
			*((float*)(m_pBuffer + m_lPosition))= f1;		m_lPosition += sizeof(float);
			*((float*)(m_pBuffer + m_lPosition))= f2;		m_lPosition += sizeof(float);
		}

		void Write(LONG lCommand, float f1, float f2, float f3, float f4, float f5, float f6)
		{
			size_t lMem = sizeof(LONG) + 6 * sizeof(float);

			CheckBufferSize(lMem);

			*((LONG*)(m_pBuffer + m_lPosition))	= lCommand; m_lPosition += sizeof(LONG);
			*((float*)(m_pBuffer + m_lPosition))= f1;		m_lPosition += sizeof(float);
			*((float*)(m_pBuffer + m_lPosition))= f2;		m_lPosition += sizeof(float);
			*((float*)(m_pBuffer + m_lPosition))= f3;		m_lPosition += sizeof(float);
			*((float*)(m_pBuffer + m_lPosition))= f4;		m_lPosition += sizeof(float);
			*((float*)(m_pBuffer + m_lPosition))= f5;		m_lPosition += sizeof(float);
			*((float*)(m_pBuffer + m_lPosition))= f6;		m_lPosition += sizeof(float);
		}

		void Write(LONG lCommand, LONG lCount, float* pData)
		{
			size_t lFloats = lCount * sizeof(float);
			size_t lMem = 2 * sizeof(LONG) + lFloats;

			CheckBufferSize(lMem);

			*((LONG*)(m_pBuffer + m_lPosition))	= lCommand; m_lPosition += sizeof(LONG);
			*((LONG*)(m_pBuffer + m_lPosition))	= lCount;	m_lPosition += sizeof(LONG);

			memcpy(m_pBuffer + m_lPosition, pData, lFloats);
			m_lPosition += lFloats;
		}

		void Write(LONG lCommand, const CString& sString)
		{
			LONG lIndex = -1;
			
			switch (lCommand)
			{
			case ctSetPen:
				{
					if (m_strOldPen == sString)
						return;

					m_strOldPen = sString;

					lIndex = m_oGraphicsCache.AddPen(sString, &m_arStrings);
					break;
				}
			case ctSetBrush:
				{
					if (m_strOldBrush == sString)
						return;

					m_strOldBrush = sString;

					lIndex = m_oGraphicsCache.AddBrush(sString, &m_arStrings);
					break;
				}
			case ctSetFont:
				{
					if (m_strOldFont == sString)
						return;

					m_strOldFont = sString;

					lIndex = m_oGraphicsCache.AddFont(sString, &m_arStrings);
					break;
				}
			case ctSetShadow:
				{
					if (m_strOldShadow == sString)
						return;

					m_strOldShadow = sString;
					break;
				}
			case ctSetEdgeText:
				{
					if (m_strOldEdge == sString)
						return;

					m_strOldEdge = sString;
					break;
				}			
			};
			
			size_t lMem = 2 * sizeof(LONG);

			CheckBufferSize(lMem);

			if (-1 == lIndex)
			{
				*((LONG*)(m_pBuffer + m_lPosition))	= lCommand;						m_lPosition += sizeof(LONG);
				*((LONG*)(m_pBuffer + m_lPosition))	= (LONG)m_arStrings.GetCount();	m_lPosition += sizeof(LONG);

				m_arStrings.Add(sString);
			}
			else
			{
				*((LONG*)(m_pBuffer + m_lPosition))	= lCommand;						m_lPosition += sizeof(LONG);
				*((LONG*)(m_pBuffer + m_lPosition))	= lIndex;						m_lPosition += sizeof(LONG);
			}			
		}

		
		inline void WritePath(const LONG& lType)
		{
			if (m_bIsAdvanced)
			{
				return m_pAdvancedCommands->WritePath(lType);
			}
			
			size_t lMem = 2 * sizeof(LONG);

			CheckBufferSize(lMem);

			*((LONG*)(m_pBuffer + m_lPosition))	= ctDrawPath;	m_lPosition += sizeof(LONG);
			*((LONG*)(m_pBuffer + m_lPosition))	= lType;		m_lPosition += sizeof(LONG);
		}

		inline void WriteString(const CString& strText, const float& fX, const float& fY, const float& fWidth, const float& fHeight, const float& fBaseOffset, BOOL bIsPath = FALSE)
		{
			if (m_bIsAdvanced)
			{
				return m_pAdvancedCommands->WriteString(strText, fX, fY, fWidth, fHeight, fBaseOffset, bIsPath);
			}
			
			size_t lMem = 2 * sizeof(LONG) + 5 * sizeof(float);

			CheckBufferSize(lMem);

			LONG lCommandType = (FALSE == bIsPath) ? ctDrawText : ctPathCommandText; 

			*((LONG*)(m_pBuffer + m_lPosition))	= lCommandType;						m_lPosition += sizeof(LONG);
			
			*((LONG*)(m_pBuffer + m_lPosition))	= (LONG)m_arStrings.GetCount();		m_lPosition += sizeof(LONG);

			*((float*)(m_pBuffer + m_lPosition))= fX;								m_lPosition += sizeof(float);
			*((float*)(m_pBuffer + m_lPosition))= fY;								m_lPosition += sizeof(float);
			*((float*)(m_pBuffer + m_lPosition))= fWidth;							m_lPosition += sizeof(float);
			*((float*)(m_pBuffer + m_lPosition))= fHeight;							m_lPosition += sizeof(float);
			*((float*)(m_pBuffer + m_lPosition))= fBaseOffset;						m_lPosition += sizeof(float);

			m_arStrings.Add(strText);
		}

		inline void WriteImage(IUnknown* punkImage, const float& fX, const float& fY, const float& fWidth, const float& fHeight)
		{
			if (m_bIsAdvanced)
			{
				return m_pAdvancedCommands->WriteImage(punkImage, fX, fY, fWidth, fHeight);
			}

			size_t lMem = 2 * sizeof(LONG) + 4 * sizeof(float);

			CheckBufferSize(lMem);

			*((LONG*)(m_pBuffer + m_lPosition))	= ctDrawImage;					m_lPosition += sizeof(LONG);

			*((LONG*)(m_pBuffer + m_lPosition))	= (LONG)m_arImages.GetCount();	m_lPosition += sizeof(LONG);

			*((float*)(m_pBuffer + m_lPosition))= fX;							m_lPosition += sizeof(float);
			*((float*)(m_pBuffer + m_lPosition))= fY;							m_lPosition += sizeof(float);
			*((float*)(m_pBuffer + m_lPosition))= fWidth;						m_lPosition += sizeof(float);
			*((float*)(m_pBuffer + m_lPosition))= fHeight;						m_lPosition += sizeof(float);

			ADDREFINTERFACE(punkImage);
			m_arImages.Add(punkImage);
		}

		inline void WriteImage(CString strPath, const float& fX, const float& fY, const float& fWidth, const float& fHeight)
		{
			if (m_bIsAdvanced)
			{
				return m_pAdvancedCommands->WriteImage(strPath, fX, fY, fWidth, fHeight);
			}
			
			size_t lMem = 2 * sizeof(LONG) + 4 * sizeof(float);

			CheckBufferSize(lMem);

			*((LONG*)(m_pBuffer + m_lPosition))	= ctDrawImageFromFile;			m_lPosition += sizeof(LONG);

			*((LONG*)(m_pBuffer + m_lPosition))	= (LONG)m_arStrings.GetCount();	m_lPosition += sizeof(LONG);

			*((float*)(m_pBuffer + m_lPosition))= fX;							m_lPosition += sizeof(float);
			*((float*)(m_pBuffer + m_lPosition))= fY;							m_lPosition += sizeof(float);
			*((float*)(m_pBuffer + m_lPosition))= fWidth;						m_lPosition += sizeof(float);
			*((float*)(m_pBuffer + m_lPosition))= fHeight;						m_lPosition += sizeof(float);

			m_arStrings.Add(strPath);
		}

		inline void WriteParams(const double& dAngle, const double& x, const double& y, const double& width, const double& height,	const LONG& lFlags)
		{
			if (m_bIsAdvanced)
			{
				return m_pAdvancedCommands->WriteParams(dAngle, x, y, width, height, lFlags);
			}
			
			size_t lMem = 2 * sizeof(LONG) + 5 * sizeof(double);

			CheckBufferSize(lMem);

			*((LONG*)(m_pBuffer + m_lPosition))	= ctSetParams;	m_lPosition += sizeof(LONG);

			*((double*)(m_pBuffer + m_lPosition))= dAngle;		m_lPosition += sizeof(double);
			*((double*)(m_pBuffer + m_lPosition))= x;			m_lPosition += sizeof(double);
			*((double*)(m_pBuffer + m_lPosition))= y;			m_lPosition += sizeof(double);
			*((double*)(m_pBuffer + m_lPosition))= width;		m_lPosition += sizeof(double);
			*((double*)(m_pBuffer + m_lPosition))= height;		m_lPosition += sizeof(double);

			*((LONG*)(m_pBuffer + m_lPosition))	= lFlags;		m_lPosition += sizeof(LONG);
		}

		inline void WriteSetTransform(double d1, double d2, double d3, double d4, double d5, double d6)
		{
			if (m_bIsAdvanced)
			{
				return m_pAdvancedCommands->WriteSetTransform(d1, d2, d3, d4, d5, d6);
			}
			
			size_t lMem = sizeof(LONG) + 6 * sizeof(double);

			CheckBufferSize(lMem);

			*((LONG*)(m_pBuffer + m_lPosition))	= ctSetTransform;	m_lPosition += sizeof(LONG);

			*((double*)(m_pBuffer + m_lPosition))= d1;				m_lPosition += sizeof(double);
			*((double*)(m_pBuffer + m_lPosition))= d2;				m_lPosition += sizeof(double);
			*((double*)(m_pBuffer + m_lPosition))= d3;				m_lPosition += sizeof(double);
			*((double*)(m_pBuffer + m_lPosition))= d4;				m_lPosition += sizeof(double);
			*((double*)(m_pBuffer + m_lPosition))= d5;				m_lPosition += sizeof(double);
			*((double*)(m_pBuffer + m_lPosition))= d6;				m_lPosition += sizeof(double);		
		}
		inline void WriteResetTransform()
		{
			if (m_bIsAdvanced)
			{
				return m_pAdvancedCommands->WriteResetTransform();
			}
			
			size_t lMem = sizeof(LONG);

			CheckBufferSize(lMem);

			*((LONG*)(m_pBuffer + m_lPosition))	= ctResetTransform;	m_lPosition += sizeof(LONG);
		}

		inline void WriteClipMode(LONG lMode)
		{
			if (m_bIsAdvanced)
			{
				return m_pAdvancedCommands->WriteClipMode(lMode);
			}
			
			size_t lMem = 2 * sizeof(LONG);

			CheckBufferSize(lMem);

			*((LONG*)(m_pBuffer + m_lPosition))	= ctClipMode;	m_lPosition += sizeof(LONG);
			*((LONG*)(m_pBuffer + m_lPosition))	= lMode;		m_lPosition += sizeof(LONG);
		}

		inline void InitAdvancedCommands()
		{
			RELEASEOBJECT(m_pAdvancedCommands);
			m_bIsAdvanced = TRUE;
			m_pAdvancedCommands = new CBufferPage();

			m_pAdvancedCommands->m_fWidth	= m_fWidth;
			m_pAdvancedCommands->m_fHeight	= m_fHeight;
		}

		inline void Draw(IAVSOfficeRendererTemplate* pRenderer, double dDPIX, double dDPIY)
		{
			if (NULL == pRenderer)
				return;

			
			pRenderer->SetWidth(m_fWidth);
			pRenderer->SetHeight(m_fHeight);

			
			size_t lPosMem = 0;

			LONG lSizeofDouble	= sizeof(double);
			LONG lSizeofFloat 	= sizeof(float);
			LONG lSizeofLONG	= sizeof(LONG);

			m_pBufferMem = m_pBuffer;

			
			

			
			
			
			

			

			
			
			
			
			
			

			
			

			
			
			
			
			
			

			
			

			
			
			
			
			
			

			
			

			
			
			
			
			
			

			
			
			
			
			
			
			
			
			

			
			

			
			

			
			
			
			

			
			
			
			
			

			
			
			
			
			
			
			
			
			
			

			
			
			
			
			
			

			
			

			
			
			
			

			
			
			
			
			
			
			
			

			
			
			
			
			
			
			
			

			
			
			

			
			

			

			

			
			
			
			
			
			
			
			
			
			
			
			

			
			
			
			
			
			
			
			

			
			
			

			
			

			

			

			
			
			
			
			
			
			
			
			
			
			
			

			
			
			
			
			
			
			
			
			
			
			
			
			

			
			
			
			
			

			

			
			
			
			
			

			
			
			
			
			
			
			
			
			
			

			
			
			
			
			
			
			
			
			
			
			
			

			

			
			
			
			

			
			

			
			

			
			
			
			
			
			
			
			
			
			

			

			
			
			
			
			

			
			
			
			
			
			

			

			
			
			
			
			
			
			
			
			
			

			
			

			
			
			
			
			
			
			
			
			
			
			

			
			
			
			
			
			
			
			
			
			
			
			
			

			
			
			
			
			
			
			
			
			
			
			
			
			

			
			
			

			HRESULT hRes = S_OK;
			while (m_lPosition > (m_pBufferMem - m_pBuffer))
			{
				LONG eCommand = ReadLONG();
				
				switch (eCommand)
				{
				case ctSetPen:
					{
						LONG lIndex = ReadLONG();

						CComBSTR oBSTR(m_arStrings[lIndex]);
						hRes = pRenderer->SetPen(oBSTR.m_str);

						break;
					}
				case ctSetBrush:
					{
						LONG lIndex = ReadLONG();

						CComBSTR oBSTR(m_arStrings[lIndex]);
						hRes = pRenderer->SetBrush(oBSTR.m_str);

						break;
					}
				case ctSetFont:
					{
						LONG lIndex = ReadLONG();

						CComBSTR oBSTR(m_arStrings[lIndex]);
						hRes = pRenderer->SetFont(oBSTR.m_str);

						break;
					}
				case ctSetShadow:
					{
						LONG lIndex = ReadLONG();

						CComBSTR oBSTR(m_arStrings[lIndex]);
						hRes = pRenderer->SetShadow(oBSTR.m_str);
						
						break;
					}
				case ctSetEdgeText:
					{
						LONG lIndex = ReadLONG();

						CComBSTR oBSTR(m_arStrings[lIndex]);
						hRes = pRenderer->SetEdgeText(oBSTR.m_str);

						break;
					}

				case ctDrawText:
				case ctPathCommandText:
					{
						LONG lIndex			= ReadLONG();

						float fX			= ReadFloat();
						float fY			= ReadFloat();
						float fWidth		= ReadFloat();
						float fHeight		= ReadFloat();
						float fBaseOffset	= ReadFloat();

						CComBSTR oBSTR(m_arStrings[lIndex]);
						
						if (ctDrawText == eCommand)
						{
							hRes = pRenderer->CommandDrawText(oBSTR.m_str, fX, fY, fWidth, fHeight, fBaseOffset);
						}
						else
						{
							IAVSOfficeRendererTemplate2* pTemplate2 = NULL;
							pRenderer->QueryInterface(__uuidof(IAVSOfficeRendererTemplate2), (void**)&pTemplate2);

							if (NULL != pTemplate2)
							{
								hRes = pTemplate2->PathCommandText(oBSTR.m_str, fX, fY, fWidth, fHeight, fBaseOffset);
								RELEASEINTERFACE(pTemplate2);
							}
						}

						break;
					}

				case ctPathCommandMoveTo:
					{
						float fX = ReadFloat();
						float fY = ReadFloat();

						hRes = pRenderer->PathCommandMoveTo(fX, fY);
						
						break;
					}
				case ctPathCommandLineTo:
					{
						float fX = ReadFloat();
						float fY = ReadFloat();

						hRes = pRenderer->PathCommandLineTo(fX, fY);
						
						break;
					}
				case ctPathCommandLinesTo:
					{
						LONG lCount = ReadLONG();
						ULONG lFloats = lCount * lSizeofFloat;

						SAFEARRAYBOUND rgsab;
						rgsab.lLbound	= 0;
						rgsab.cElements	= lCount;

						SAFEARRAY* pArray = SafeArrayCreate(VT_R4, 1, &rgsab);
						memcpy(pArray->pvData, m_pBufferMem, lFloats);

						m_pBufferMem += lFloats;

						hRes = pRenderer->PathCommandLinesTo(&pArray);

						RELEASEARRAY(pArray);
						
						break;
					}
				case ctPathCommandCurveTo:
					{
						float fX1 = ReadFloat();
						float fY1 = ReadFloat();
						float fX2 = ReadFloat();
						float fY2 = ReadFloat();
						float fX3 = ReadFloat();
						float fY3 = ReadFloat();

						hRes = pRenderer->PathCommandCurveTo(fX1, fY1, fX2, fY2, fX3, fY3);
						
						break;
					}
				case ctPathCommandCurvesTo:
					{
						LONG lCount = ReadLONG();
						ULONG lFloats = lCount * lSizeofFloat;

						SAFEARRAYBOUND rgsab;
						rgsab.lLbound	= 0;
						rgsab.cElements	= lCount;

						SAFEARRAY* pArray = SafeArrayCreate(VT_R4, 1, &rgsab);
						memcpy(pArray->pvData, m_pBufferMem, lFloats);

						m_pBufferMem += lFloats;

						hRes = pRenderer->PathCommandCurvesTo(&pArray);

						RELEASEARRAY(pArray);
						
						break;
					}
				case ctPathCommandArcTo:
					{
						float fX1 = ReadFloat();
						float fY1 = ReadFloat();
						float fX2 = ReadFloat();
						float fY2 = ReadFloat();
						float fX3 = ReadFloat();
						float fY3 = ReadFloat();

						hRes = pRenderer->PathCommandArcTo(fX1, fY1, fX2, fY2, fX3, fY3);
						
						break;
					}
				case ctPathCommandClose:
					{
						hRes = pRenderer->PathCommandClose();
						
						break;
					}
				case ctPathCommandEnd:
					{
						hRes = pRenderer->PathCommandEnd();

						break;
					}
				case ctDrawPath:
					{
						LONG lType = ReadLONG();

						hRes = pRenderer->DrawPath(lType);

						break;
					}
				case ctPathCommandStart:
					{
						hRes = pRenderer->PathCommandStart();

						break;
					}
				case ctDrawImage:
					{
						LONG lIndex			= ReadLONG();
						
						float fX			= ReadFloat();
						float fY			= ReadFloat();
						float fWidth		= ReadFloat();
						float fHeight		= ReadFloat();

						hRes = pRenderer->DrawImage(&m_arImages[lIndex], fX, fY, fWidth, fHeight);
						
						break;
					}
				case ctDrawImageFromFile:
					{
						LONG lIndex			= ReadLONG();
						
						float fX			= ReadFloat();
						float fY			= ReadFloat();
						float fWidth		= ReadFloat();
						float fHeight		= ReadFloat();

						ImageStudio::Serialize::Paint::Common::CDrawImageFromFile oEffect;

						oEffect.Left	= (double)fX;
						oEffect.Top		= (double)fY;
						oEffect.Right	= (double)(fX + fWidth);
						oEffect.Bottom  = (double)(fY + fHeight);

						oEffect.m_dWidthMM	= (double)m_fWidth;
						oEffect.m_dHeightMM	= (double)m_fHeight;

						oEffect.FilePath = m_arStrings[lIndex];
						oEffect.Draw(pRenderer, dDPIX, dDPIY) ? S_OK : S_FALSE;
						
						break;
					}
				case ctSetParams:
					{
						double angle		= ReadDouble();
						double left			= ReadDouble();
						double top			= ReadDouble();
						double width		= ReadDouble();
						double height		= ReadDouble();
						LONG   flags		= ReadLONG();

						hRes = pRenderer->SetCommandParams(angle, left, top, width, height, flags);

						break;
					}
				case ctBeginCommand:
					{
						LONG lType			= ReadLONG();

						hRes = pRenderer->BeginCommand(lType);
						break;
					}
				case ctEndCommand:
					{
						LONG lType			= ReadLONG();

						hRes = pRenderer->EndCommand(lType);

						break;
					}
				case ctSetTransform:
					{
						double d1		= ReadDouble();
						double d2		= ReadDouble();
						double d3		= ReadDouble();
						double d4		= ReadDouble();
						double d5		= ReadDouble();
						double d6		= ReadDouble();

						IAVSOfficeRendererTemplate2* pTemplate2 = NULL;
						pRenderer->QueryInterface(__uuidof(IAVSOfficeRendererTemplate2), (void**)&pTemplate2);

						if (NULL != pTemplate2)
						{
							pTemplate2->SetTransform(d1, d2, d3, d4, d5, d6);
							RELEASEINTERFACE(pTemplate2);
						}
						break;
					}
				case ctResetTransform:
					{
						IAVSOfficeRendererTemplate2* pTemplate2 = NULL;
						pRenderer->QueryInterface(__uuidof(IAVSOfficeRendererTemplate2), (void**)&pTemplate2);

						if (NULL != pTemplate2)
						{
							pTemplate2->ResetTransform();
							RELEASEINTERFACE(pTemplate2);
						}
						break;
					}
				case ctClipMode:
					{
						LONG lMode		= ReadLONG();
						
						IAVSOfficeRendererTemplate2* pTemplate2 = NULL;
						pRenderer->QueryInterface(__uuidof(IAVSOfficeRendererTemplate2), (void**)&pTemplate2);

						if (NULL != pTemplate2)
						{
							pTemplate2->put_ClipMode(lMode);
							RELEASEINTERFACE(pTemplate2);
						}
						break;
					}
				default:
					{
						
						return;
					}
				};

				if (S_OK != hRes)
					break;
			}

			

			if (m_bIsAdvanced)
			{
				m_pAdvancedCommands->Draw(pRenderer, dDPIX, dDPIY);
			}
		}		
	};

protected:

	CBufferPage m_oPage;

public:

	CAVSPageCommands() : m_oPage()
	{
	}

	~CAVSPageCommands()
	{
	}

public:
	STDMETHOD(NewPage)()
	{
		return S_OK;
	}

	STDMETHOD(get_Height)(float* fHeight)
	{
		if (NULL != fHeight)
			*fHeight = m_oPage.m_fHeight;
		return S_OK;
	}
	STDMETHOD(get_Width)(float* fWidth)
	{		
		if (NULL != fWidth)
			*fWidth = m_oPage.m_fWidth;
		return S_OK;
	}
	STDMETHOD(SetHeight)(float fHeight)
	{
		m_oPage.m_fHeight = fHeight;
		return S_OK;
	}
	STDMETHOD(SetWidth)(float fWidth)
	{		
		m_oPage.m_fWidth = fWidth;		
		return S_OK;
	}
	
	
	STDMETHOD(SetPen)(BSTR bsXML)
	{
		m_oPage.Write(CBufferPage::ctSetPen, (CString)bsXML);		
		return S_OK;
	}
	STDMETHOD(SetBrush)(BSTR bsXML)
	{
		m_oPage.Write(CBufferPage::ctSetBrush, (CString)bsXML);		
		return S_OK;
	}
	STDMETHOD(SetFont)(BSTR bsXML)
	{
		m_oPage.Write(CBufferPage::ctSetFont, (CString)bsXML);		
		return S_OK;
	}
	STDMETHOD(SetShadow)(BSTR bsXML)
	{
		m_oPage.Write(CBufferPage::ctSetShadow, (CString)bsXML);		
		return S_OK;
	}
	STDMETHOD(SetEdgeText)(BSTR bsXML)
	{
		m_oPage.Write(CBufferPage::ctSetEdgeText, (CString)bsXML);		
		return S_OK;
	}
	
	
	STDMETHOD(CommandDrawText)(BSTR bsText, float fX, float fY, float fWidth, float fHeight, float fBaseLineOffset)
	{
		m_oPage.WriteString((CString)bsText, fX, fY, fWidth, fHeight, fBaseLineOffset);
		return S_OK;
	}
	
	
	STDMETHOD(PathCommandMoveTo)(float fX, float fY)
	{
		m_oPage.Write(CBufferPage::ctPathCommandMoveTo, fX, fY);
		return S_OK;
	}
	STDMETHOD(PathCommandLineTo)(float fX, float fY)
	{
		m_oPage.Write(CBufferPage::ctPathCommandLineTo, fX, fY);
		return S_OK;
	}
	STDMETHOD(PathCommandLinesTo)(SAFEARRAY** ppPoints)
	{
		LONG lCount = (*ppPoints)->rgsabound[0].cElements;
		float* pData = (float*)((*ppPoints)->pvData);

		m_oPage.Write(CBufferPage::ctPathCommandLinesTo, lCount, pData);
		return S_OK;
	}

	STDMETHOD(PathCommandCurveTo)(float fX1, float fY1, float fX2, float fY2, float fX3, float fY3)
	{
		m_oPage.Write(CBufferPage::ctPathCommandCurveTo, fX1, fY1, fX2, fY2, fX3, fY3);
		return S_OK;
	}
	STDMETHOD(PathCommandCurvesTo)(SAFEARRAY** ppPoints)
	{
		LONG lCount = (*ppPoints)->rgsabound[0].cElements;
		float* pData = (float*)((*ppPoints)->pvData);

		m_oPage.Write(CBufferPage::ctPathCommandCurvesTo, lCount, pData);
		return S_OK;
	}
	STDMETHOD(PathCommandArcTo)(float fX, float fY, float fWidth, float fHeight, float fStartAngle, float fSweepAngle)
	{
		m_oPage.Write(CBufferPage::ctPathCommandArcTo, 
			fX, fY, fWidth, fHeight, fStartAngle, fSweepAngle);

		return S_OK;
	}
	STDMETHOD(PathCommandClose)()
	{
		m_oPage.Write(CBufferPage::ctPathCommandClose);
		return S_OK;
	}
	STDMETHOD(PathCommandEnd)()
	{
		m_oPage.Write(CBufferPage::ctPathCommandEnd);
		return S_OK;
	}

	STDMETHOD(PathCommandStart)()
	{
		m_oPage.Write(CBufferPage::ctPathCommandStart);
		return S_OK;
	}
	STDMETHOD(PathCommandGetCurrentPoint)(float* fX, float* fY)
	{
		return S_OK;
	}
	
	STDMETHOD(DrawPath)(long nType)
	{
		m_oPage.WritePath(nType);
		return S_OK;		
	}
	
	STDMETHOD(DrawImage)(IUnknown **pInterface, float fX, float fY, float fWidth, float fHeight)
	{
		m_oPage.WriteImage(*pInterface, fX, fY, fWidth, fHeight);
		return S_OK;	
	}
	
	STDMETHOD(DrawImageFromFile)(BSTR bstrPath, float fX, float fY, float fWidth, float fHeight)
	{
		m_oPage.WriteImage((CString)bstrPath, fX, fY, fWidth, fHeight);
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
	
	
	STDMETHOD(Draw)(IUnknown* punkRenderer, double dDPIX, double dDPIY, BOOL* pBreak)
	{
		IAVSOfficeRendererTemplate* pRenderer = NULL;
		punkRenderer->QueryInterface(__uuidof(IAVSOfficeRendererTemplate), (void**)&pRenderer);

		if (NULL == pRenderer)
			return S_FALSE;

		m_oPage.Draw(pRenderer, dDPIX, dDPIY);

		RELEASEINTERFACE(pRenderer);

		return S_OK;
	}

	STDMETHOD(Draw2)(IUnknown* punkRenderer, double dDPIX, double dDPIY, BOOL* pBreak)
	{
		IAVSOfficeRendererTemplate* pRenderer = NULL;
		punkRenderer->QueryInterface(__uuidof(IAVSOfficeRendererTemplate), (void**)&pRenderer);

		if (NULL == pRenderer)
			return S_FALSE;

		m_oPage.Draw(pRenderer, dDPIX, dDPIY);

		RELEASEINTERFACE(pRenderer);

		return S_OK;
	}

	STDMETHOD(BeginCommand)(DWORD lType)
	{
		m_oPage.Write(CBufferPage::ctBeginCommand, (LONG)lType);
		return S_OK;	
	}
	STDMETHOD(EndCommand)(DWORD lType)
	{
		m_oPage.Write(CBufferPage::ctEndCommand, lType);
		return S_OK;
	}
	STDMETHOD(CommandDrawTextEx)(BSTR bsText, float fX, float fY, float fWidth, float fHeight, float fBaseLineOffset, DWORD lFlags, BSTR sParams)
	{
		return CommandDrawText(bsText, fX, fY, fWidth, fHeight, fBaseLineOffset);
	}
	STDMETHOD(GetCommandParams)(double* dAngle, double* dLeft, double* dTop, double* dWidth, double* dHeight, DWORD* lFlags)
	{
		return S_OK;
	}
	STDMETHOD(SetCommandParams)(double dAngle,  double dLeft,  double dTop,  double dWidth,  double dHeight,  DWORD lFlags)
	{
		m_oPage.WriteParams(dAngle, dLeft, dTop, dWidth, dHeight, lFlags);
		return S_OK;
	}

	STDMETHOD(SetTransform)(double dA, double dB, double dC, double dD, double dE, double dF)
	{
		m_oPage.WriteSetTransform(dA, dB, dC, dD, dE, dF);
		return S_OK;
	}
	STDMETHOD(GetTransform)(double *pdA, double *pdB, double *pdC, double *pdD, double *pdE, double *pdF)
	{
		return S_FALSE;
	}
	STDMETHOD(ResetTransform)(void)
	{
		m_oPage.WriteResetTransform();
		return S_OK;
	}

	STDMETHOD(get_ClipMode)(LONG* plMode)
	{
		return S_OK;
	}
	STDMETHOD(put_ClipMode)(LONG lMode)
	{
		m_oPage.WriteClipMode(lMode);
		return S_OK;
	}

	STDMETHOD(PathCommandText)(BSTR bsText, float fX, float fY, float fWidth, float fHeight, float fBaseLineOffset)
	{
		m_oPage.WriteString((CString)bsText, fX, fY, fWidth, fHeight, fBaseLineOffset, TRUE);
		return S_OK;
	}

	STDMETHOD(InitAdvancedCommands)()
	{
		m_oPage.InitAdvancedCommands();
		return S_OK;
	}
	STDMETHOD(DestroyAdvancedCommands)()
	{
		m_oPage.ReleaseAdvanced();
		return S_OK;
	}
};


[coclass, uuid("27743EB0-2D08-47fe-A927-EE7E4538DD62"), event_source(com), threading(apartment), vi_progid("CommandsRenderer"), progid("CommandsRenderer.1"), version(1.0)]
class ATL_NO_VTABLE CAVSCommandsRenderer
	:	public IAVSCommandsRenderer, public IAVSOfficeRendererTemplate2
{
protected:

	float m_fCurrentX;
	float m_fCurrentY;

	LONG m_lPagesCount;
	CAtlArray<IAVSPageCommands*> m_arPages;

	BOOL m_bCompleteLastPage;
	
	
	CRITICAL_SECTION m_oCS;

	
	double m_dCurrentAngle;
	
	double m_dCurrentLeft;
	double m_dCurrentTop;
	double m_dCurrentWidth;
	double m_dCurrentHeight;

	DWORD m_lCurrentFlags;

	double m_dWindowDPIX;
	double m_dWindowDPIY;

public:

	__event __interface _IAVSCommandsRendererEvents;

	CAVSCommandsRenderer() : m_arPages()
	{
		m_fCurrentX = 0;
		m_fCurrentY = 0;

		m_lPagesCount = 0;

		m_bCompleteLastPage = FALSE;

		
		InitializeCriticalSection ( &m_oCS );

		m_dCurrentAngle		= 0;
	
		m_dCurrentLeft		= 0;
		m_dCurrentTop		= 0;
		m_dCurrentWidth		= 0;
		m_dCurrentHeight	= 0;

		m_lCurrentFlags		= 0;

		m_dWindowDPIX		= -1;
		m_dWindowDPIY		= -1;

	}

	~CAVSCommandsRenderer()
	{
		size_t lCount = m_arPages.GetCount();
		for (size_t nIndex = 0; nIndex < lCount; ++nIndex)
		{
			IAVSPageCommands* pPage = m_arPages[nIndex];
			RELEASEINTERFACE(pPage);
		}
		
		m_arPages.RemoveAll();

		
		DeleteCriticalSection  ( &m_oCS );
	}

public:
	STDMETHOD(NewPage)()
	{
		
		CTemporaryCS CS ( &m_oCS );

		IAVSPageCommands* pPage = NULL;
		CoCreateInstance( __uuidof(CAVSPageCommands), NULL, CLSCTX_INPROC, __uuidof(IAVSPageCommands), (void**)&pPage );

		pPage->SetWidth(0);
		pPage->SetHeight(0);

		++m_lPagesCount;
		m_bCompleteLastPage = FALSE;
		
		m_arPages.Add(pPage);

		OnNewPage(0, 0);

		return S_OK;
	}
	STDMETHOD(SetHeight)(float fHeight)
	{
		LONG lPageIndex = m_lPagesCount - 1;
		if (lPageIndex < 0 || lPageIndex >= m_arPages.GetCount())
			return S_FALSE;
		
		m_arPages[lPageIndex]->SetHeight(max(10.0, fHeight));

		return S_OK;
	}
	STDMETHOD(SetWidth)(float fWidth)
	{		
		LONG lPageIndex = m_lPagesCount - 1;
		if (lPageIndex < 0 || lPageIndex >= m_arPages.GetCount())
			return S_FALSE;
		
		m_arPages[lPageIndex]->SetWidth(max(10.0, fWidth));
		
		return S_OK;
	}
	
	
	STDMETHOD(SetPen)(BSTR bsXML)
	{
		LONG lPageIndex = m_lPagesCount - 1;
		if (lPageIndex < 0 || lPageIndex >= m_arPages.GetCount())
			return S_FALSE;
		
		m_arPages[lPageIndex]->SetPen(bsXML);
		return S_OK;
	}
	STDMETHOD(SetBrush)(BSTR bsXML)
	{
		LONG lPageIndex = m_lPagesCount - 1;
		if (lPageIndex < 0 || lPageIndex >= m_arPages.GetCount())
			return S_FALSE;

		m_arPages[lPageIndex]->SetBrush(bsXML);
		return S_OK;
	}
	STDMETHOD(SetFont)(BSTR bsXML)
	{
		LONG lPageIndex = m_lPagesCount - 1;
		if (lPageIndex < 0 || lPageIndex >= m_arPages.GetCount())
			return S_FALSE;

		m_arPages[lPageIndex]->SetFont(bsXML);
		return S_OK;
	}
	STDMETHOD(SetShadow)(BSTR bsXML)
	{
		LONG lPageIndex = m_lPagesCount - 1;
		if (lPageIndex < 0 || lPageIndex >= m_arPages.GetCount())
			return S_FALSE;

		m_arPages[lPageIndex]->SetShadow(bsXML);
		return S_OK;
	}
	STDMETHOD(SetEdgeText)(BSTR bsXML)
	{
		LONG lPageIndex = m_lPagesCount - 1;
		if (lPageIndex < 0 || lPageIndex >= m_arPages.GetCount())
			return S_FALSE;

		m_arPages[lPageIndex]->SetEdgeText(bsXML);
		return S_OK;
	}
	
	
	STDMETHOD(CommandDrawText)(BSTR bsText, float fX, float fY, float fWidth, float fHeight, float fBaseLineOffset)
	{
		LONG lPageIndex = m_lPagesCount - 1;
		if (lPageIndex < 0 || lPageIndex >= m_arPages.GetCount())
			return S_FALSE;

		m_arPages[lPageIndex]->CommandDrawText(bsText, fX, fY, fWidth, fHeight, fBaseLineOffset);
		return S_OK;
	}
	
	
	STDMETHOD(PathCommandMoveTo)(float fX, float fY)
	{
		LONG lPageIndex = m_lPagesCount - 1;
		if (lPageIndex < 0 || lPageIndex >= m_arPages.GetCount())
			return S_FALSE;

		m_fCurrentX = fX;
		m_fCurrentY = fY;

		m_arPages[lPageIndex]->PathCommandMoveTo(fX, fY);
		return S_OK;
	}
	STDMETHOD(PathCommandLineTo)(float fX, float fY)
	{
		LONG lPageIndex = m_lPagesCount - 1;
		if (lPageIndex < 0 || lPageIndex >= m_arPages.GetCount())
			return S_FALSE;

		m_fCurrentX = fX;
		m_fCurrentY = fY;

		m_arPages[lPageIndex]->PathCommandLineTo(fX, fY);

		return S_OK;
	}
	STDMETHOD(PathCommandLinesTo)(SAFEARRAY** ppPoints)
	{
		LONG lPageIndex = m_lPagesCount - 1;
		if (lPageIndex < 0 || lPageIndex >= m_arPages.GetCount())
			return S_FALSE;

		LONG lCount = (*ppPoints)->rgsabound[0].cElements;
		float* pData = (float*)((*ppPoints)->pvData);

		m_arPages[lPageIndex]->PathCommandLinesTo(ppPoints);

		if (2 <= lCount)
		{
			m_fCurrentX = pData[lCount - 1];
			m_fCurrentY = pData[lCount - 2];
		}

		return S_OK;
	}

	STDMETHOD(PathCommandCurveTo)(float fX1, float fY1, float fX2, float fY2, float fX3, float fY3)
	{
		LONG lPageIndex = m_lPagesCount - 1;
		if (lPageIndex < 0 || lPageIndex >= m_arPages.GetCount())
			return S_FALSE;

		m_arPages[lPageIndex]->PathCommandCurveTo(fX1, fY1, fX2, fY2, fX3, fY3);

		m_fCurrentX = fX3;
		m_fCurrentY = fY3;

		return S_OK;
	}
	STDMETHOD(PathCommandCurvesTo)(SAFEARRAY** ppPoints)
	{
		LONG lPageIndex = m_lPagesCount - 1;
		if (lPageIndex < 0 || lPageIndex >= m_arPages.GetCount())
			return S_FALSE;

		LONG lCount = (*ppPoints)->rgsabound[0].cElements;
		float* pData = (float*)((*ppPoints)->pvData);

		m_arPages[lPageIndex]->PathCommandCurvesTo(ppPoints);

		if (2 <= lCount)
		{
			m_fCurrentX = pData[lCount - 1];
			m_fCurrentY = pData[lCount - 2];
		}

		return S_OK;
	}
	STDMETHOD(PathCommandArcTo)(float fX, float fY, float fWidth, float fHeight, float fStartAngle, float fSweepAngle)
	{
		LONG lPageIndex = m_lPagesCount - 1;
		if (lPageIndex < 0 || lPageIndex >= m_arPages.GetCount())
			return S_FALSE;

		if ((0 == fWidth) && (0 == fHeight))
		{
			m_fCurrentX = fX;
			m_fCurrentY = fY;
			return S_OK;
		}

		m_arPages[lPageIndex]->PathCommandArcTo(fX, fY, fWidth, fHeight, fStartAngle, fSweepAngle);

		float fEndAngle = fStartAngle + fSweepAngle;

		while (fEndAngle < 0)
		{
			fEndAngle += 360;
		}
		while (fEndAngle > 360)
		{
			fEndAngle -= 360;
		}

		
		double dA = fWidth / 2;
		double dB = fHeight / 2;

		double dCx = fX + dA;
		double dCy = fY + dB;

		if (abs(fEndAngle - 90) < 1)
		{
			m_fCurrentX = (float)dCx;
			m_fCurrentY = fY + fHeight;
			return S_OK;
		}
		if (abs(fEndAngle - 270) < 1)
		{
			m_fCurrentX = (float)dCx;
			m_fCurrentY = fY;
			return S_OK;
		}

		double dTan = abs(tan(fEndAngle * M_PI / 180));
		
		double dXMem = (dA * dB / _hypot(dB, dA * dTan));
		double dYMem = dXMem * dTan;

		if ((fEndAngle > 90) && (fEndAngle < 270))
		{
			dXMem *= -1;			
		}
		if ((fEndAngle > 180) && (fEndAngle < 360))
		{
			dYMem *= -1;
		}

		m_fCurrentX = (float)(dCx + dXMem);
		m_fCurrentY = (float)(dCy + dYMem);

		return S_OK;
	}
	STDMETHOD(PathCommandClose)()
	{
		LONG lPageIndex = m_lPagesCount - 1;
		if (lPageIndex < 0 || lPageIndex >= m_arPages.GetCount())
			return S_FALSE;

		m_arPages[lPageIndex]->PathCommandClose();
		return S_OK;
	}
	STDMETHOD(PathCommandEnd)()
	{
		LONG lPageIndex = m_lPagesCount - 1;
		if (lPageIndex < 0 || lPageIndex >= m_arPages.GetCount())
			return S_FALSE;

		m_arPages[lPageIndex]->PathCommandEnd();

		return S_OK;
	}

	STDMETHOD(PathCommandStart)()
	{
		LONG lPageIndex = m_lPagesCount - 1;
		if (lPageIndex < 0 || lPageIndex >= m_arPages.GetCount())
			return S_FALSE;

		m_arPages[lPageIndex]->PathCommandStart();

		return S_OK;
	}
	STDMETHOD(PathCommandGetCurrentPoint)(float* fX, float* fY)
	{
		if ((NULL == fX) || (NULL == fY))
			return S_FALSE;

		*fX = m_fCurrentX;
		*fY = m_fCurrentY;

		return S_OK;
	}
	
	STDMETHOD(DrawPath)(long nType)
	{
		LONG lPageIndex = m_lPagesCount - 1;
		if (lPageIndex < 0 || lPageIndex >= m_arPages.GetCount())
			return S_FALSE;

		m_arPages[lPageIndex]->DrawPath(nType);

		return S_OK;		
	}
	
	STDMETHOD(DrawImage)(IUnknown **pInterface, float fX, float fY, float fWidth, float fHeight)
	{
		LONG lPageIndex = m_lPagesCount - 1;
		if ((lPageIndex < 0) || (lPageIndex >= m_arPages.GetCount()) || (NULL == pInterface))
			return S_FALSE;

		m_arPages[lPageIndex]->DrawImage(pInterface, fX, fY, fWidth, fHeight);

		return S_OK;	
	}
	
	STDMETHOD(DrawImageFromFile)(BSTR bstrPath, float fX, float fY, float fWidth, float fHeight)
	{
		LONG lPageIndex = m_lPagesCount - 1;
		if ((lPageIndex < 0) || (lPageIndex >= m_arPages.GetCount()))
		{
			return S_FALSE;
		}

		m_arPages[lPageIndex]->DrawImageFromFile(bstrPath, fX, fY, fWidth, fHeight);
		return S_OK;	
	}
	
	STDMETHOD(SetAdditionalParam)(BSTR ParamName, VARIANT ParamValue)
	{
		CString strParamName = (CString)ParamName; 
		
		if (_T("CurrentX") == strParamName)
		{
			m_fCurrentX = ParamValue.fltVal;
			return S_OK;
		}
		if (_T("CurrentY") == strParamName)
		{
			m_fCurrentY = ParamValue.fltVal;
			return S_OK;
		}
		if (_T("DPIX") == strParamName)
		{
			m_dWindowDPIX = ParamValue.dblVal;
			return S_OK;
		}
		if (_T("DPIY") == strParamName)
		{
			m_dWindowDPIY = ParamValue.dblVal;
			return S_OK;
		}
		
		return S_OK;
	}
	STDMETHOD(GetAdditionalParam)(BSTR ParamName, VARIANT* ParamValue)
	{
		if (NULL == ParamValue)
			return S_FALSE;
		
		CString strParamName = (CString)ParamName; 

		if (_T("DPIX") == strParamName)
		{
			ParamValue->vt = VT_R8;
			ParamValue->dblVal = m_dWindowDPIX;
			return S_OK;
		}
		if (_T("DPIY") == strParamName)
		{
			ParamValue->vt = VT_R8;
			ParamValue->dblVal = m_dWindowDPIY;
			return S_OK;
		}
		return S_OK;
	}
	
	
	STDMETHOD(DrawPage)(LONG lPageNumber, IUnknown* punkRenderer)
	{
		
		CTemporaryCS CS ( &m_oCS );

		if ((0 > lPageNumber) || (lPageNumber >= m_lPagesCount) || (NULL == punkRenderer))
		{
			return S_FALSE;
		}

		m_arPages[lPageNumber]->Draw(punkRenderer, m_dWindowDPIX, m_dWindowDPIY, NULL);
		return S_OK;
	}

	STDMETHOD(get_PageCount)(LONG* plPages)
	{
		if (NULL == plPages)
			return S_FALSE;

		CTemporaryCS CS ( &m_oCS );

		if (m_bCompleteLastPage)
		{
			*plPages = m_lPagesCount;
		}
		else
		{
			*plPages = max(0, (m_lPagesCount - 1));
		}

		return S_OK;
	}

	STDMETHOD(GetPageSize)(LONG lPageNumber, FLOAT* pfWidth, FLOAT* pfHeight)
	{		
		if ((0 > lPageNumber) || (lPageNumber >= m_lPagesCount))
			return S_FALSE;

		m_arPages[lPageNumber]->get_Width(pfWidth);
		m_arPages[lPageNumber]->get_Height(pfHeight);
		
		return S_OK;
	}

	STDMETHOD(BeginCommand)(DWORD lType)
	{
		LONG lPageIndex = m_lPagesCount - 1;
		if (lPageIndex < 0 || lPageIndex >= m_arPages.GetCount())
			return S_FALSE;

		m_arPages[lPageIndex]->BeginCommand(lType);

		return S_OK;	
	}
	STDMETHOD(EndCommand)(DWORD lType)
	{
		if (c_nPageType == lType)
		{
			m_bCompleteLastPage = TRUE;

			OnCompletePage();
		}
		else
		{
			LONG lPageIndex = m_lPagesCount - 1;
			if (lPageIndex < 0 || lPageIndex >= m_arPages.GetCount())
				return S_FALSE;

			m_arPages[lPageIndex]->EndCommand(lType);
		}
		
		return S_OK;
	}
	STDMETHOD(CommandDrawTextEx)(BSTR bsText, float fX, float fY, float fWidth, float fHeight, float fBaseLineOffset, DWORD lFlags, BSTR sParams)
	{
		return CommandDrawText(bsText, fX, fY, fWidth, fHeight, fBaseLineOffset);
	}
	STDMETHOD(GetCommandParams)(double* dAngle, double* dLeft, double* dTop, double* dWidth, double* dHeight, DWORD* lFlags)
	{
		if (NULL != dAngle) 
			*dAngle = m_dCurrentAngle;
		
		if (NULL != dLeft)
			*dLeft = m_dCurrentLeft;
		if (NULL != dTop)
			*dTop = m_dCurrentTop;
		if (NULL != dWidth)
			*dWidth = m_dCurrentWidth;
		if (NULL != dHeight)
			*dHeight = m_dCurrentHeight;

		if (NULL != lFlags)
			*lFlags = m_lCurrentFlags;
		
		return S_OK;
	}
	STDMETHOD(SetCommandParams)(double dAngle,  double dLeft,  double dTop,  double dWidth,  double dHeight,  DWORD lFlags)
	{
		LONG lPageIndex = m_lPagesCount - 1;
		if (lPageIndex < 0 || lPageIndex >= m_arPages.GetCount())
			return S_FALSE;

		m_arPages[lPageIndex]->SetCommandParams(dAngle, dLeft, dTop, dWidth, dHeight, lFlags);

		return S_OK;
	}

	STDMETHOD(SetTransform)(double dA, double dB, double dC, double dD, double dE, double dF)
	{
		LONG lPageIndex = m_lPagesCount - 1;
		if (lPageIndex < 0 || lPageIndex >= m_arPages.GetCount())
			return S_FALSE;

		IAVSOfficeRendererTemplate2* pRend2 = NULL;
		m_arPages[lPageIndex]->QueryInterface(__uuidof(IAVSOfficeRendererTemplate2), (void**)&pRend2);

		if (NULL != pRend2)
		{
			pRend2->SetTransform(dA, dB, dC, dD, dE, dF);
			RELEASEINTERFACE(pRend2);
		}

		return S_OK;
	}
	STDMETHOD(GetTransform)(double *pdA, double *pdB, double *pdC, double *pdD, double *pdE, double *pdF)
	{
		return S_FALSE;
	}
	STDMETHOD(ResetTransform)(void)
	{
		LONG lPageIndex = m_lPagesCount - 1;
		if (lPageIndex < 0 || lPageIndex >= m_arPages.GetCount())
			return S_FALSE;

		IAVSOfficeRendererTemplate2* pRend2 = NULL;
		m_arPages[lPageIndex]->QueryInterface(__uuidof(IAVSOfficeRendererTemplate2), (void**)&pRend2);

		if (NULL != pRend2)
		{
			pRend2->ResetTransform();
			RELEASEINTERFACE(pRend2);
		}

		return S_OK;
	}

	STDMETHOD(get_ClipMode)(LONG* plMode)
	{
		return S_OK;
	}
	STDMETHOD(put_ClipMode)(LONG lMode)
	{
		LONG lPageIndex = m_lPagesCount - 1;
		if (lPageIndex < 0 || lPageIndex >= m_arPages.GetCount())
			return S_FALSE;

		IAVSOfficeRendererTemplate2* pRend2 = NULL;
		m_arPages[lPageIndex]->QueryInterface(__uuidof(IAVSOfficeRendererTemplate2), (void**)&pRend2);

		if (NULL != pRend2)
		{
			pRend2->put_ClipMode(lMode);
			RELEASEINTERFACE(pRend2);
		}

		return S_OK;
	}

	STDMETHOD(PathCommandText)(BSTR bsText, float fX, float fY, float fWidth, float fHeight, float fBaseLineOffset)
	{
		LONG lPageIndex = m_lPagesCount - 1;
		if (lPageIndex < 0 || lPageIndex >= m_arPages.GetCount())
			return S_FALSE;

		IAVSOfficeRendererTemplate2* pRend2 = NULL;
		m_arPages[lPageIndex]->QueryInterface(__uuidof(IAVSOfficeRendererTemplate2), (void**)&pRend2);

		if (NULL != pRend2)
		{
			pRend2->PathCommandText(bsText, fX, fY, fWidth, fHeight, fBaseLineOffset);
			RELEASEINTERFACE(pRend2);
		}
		
		return S_OK;
	}

	STDMETHOD(LockPage)(LONG lPageNumber, IUnknown** ppunkPage)
	{
		if (lPageNumber < 0 || lPageNumber >= m_arPages.GetCount())
			return S_FALSE;

		if (NULL == ppunkPage)
			return S_FALSE;

		m_arPages[lPageNumber]->QueryInterface(IID_IUnknown, (void**)ppunkPage);

		return S_OK;
	}
};











//������ �� ���� ��� ������� DrawGraphicPath � �� ����������