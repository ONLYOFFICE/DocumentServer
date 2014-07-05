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

namespace MemoryUtils
{
	class CMemoryUtils
	{
	public:
		CMemoryUtils()
		{
			m_bMMXSupported = CheckForMMX();
			m_bSSESupported = CheckForSSE();
		}
		~CMemoryUtils()
		{
		}

		BOOL IsMMXSupported() const
		{
			return m_bMMXSupported;
		}
		BOOL IsSSESupported() const
		{
			return m_bSSESupported;
		}
		void memset(void *pDest, unsigned char value, int nBytes) const
		{
			if (nBytes<0) return;
#ifdef _M_X64
			::memset(pDest, value, nBytes);
#else
			if (!m_bMMXSupported)
			{
				::memset(pDest, value, nBytes);
				return;
			}
			int nOffset  = (int)((reinterpret_cast<ULONG64>(pDest)) % 8);

			if (nBytes < 32)
			{
				::memset(pDest, value, nBytes);
			}
			else
			{
				if (nOffset != 0)
				{
					int nPreBytes = 8-nOffset;
					memset(pDest, value, nPreBytes);
					pDest = (void*)((BYTE*)pDest + nPreBytes);
					nBytes -= nPreBytes;
				}

				int nLoops = nBytes/64;
				unsigned __int64 value8x = value;
				value8x = value8x | (value8x<<8);
				value8x = value8x | (value8x<<16);
				value8x = value8x | (value8x<<32);

				if (nLoops > 0)
				__asm
				{
					mov ecx, nLoops
					mov edi, pDest

					movq mm0, qword ptr value8x
					movq mm1, qword ptr value8x
					movq mm2, qword ptr value8x
					movq mm3, qword ptr value8x
					movq mm4, qword ptr value8x
					movq mm5, qword ptr value8x
					movq mm6, qword ptr value8x
					movq mm7, qword ptr value8x

					ALIGN 16
					MMX_memset_loop:

						MOVQ       [edi], mm0       
						MOVQ       [edi+8], mm1
						MOVQ       [edi+16], mm2
						MOVQ       [edi+24], mm3
						MOVQ       [edi+32], mm4
						MOVQ       [edi+40], mm5
						MOVQ       [edi+48], mm6
						MOVQ       [edi+56], mm7
		                
						ADD        edi, 64

						dec    ecx
						jnz    MMX_memset_loop

					EMMS
				}

				int nBytesDone = nLoops*64;
				int nBytesLeft = nBytes - nBytesDone;
				if (nBytesLeft > 0)
					::memset((unsigned char *)pDest + nBytesDone, value, nBytesLeft);
			}
#endif 
		}

		
		
		
		void memcpy(void *pDest, void *pSrc, int nBytes) const
		{
			if (nBytes<0) return;

#ifdef _M_X64
			::memcpy(pDest, pSrc, nBytes);
#else
			if (!m_bMMXSupported)
			{
				::memcpy(pDest, pSrc, nBytes);
				return;
			}

			int nOffsetSrc  = (int)((reinterpret_cast<ULONG64>(pSrc)) % 8);
			int nOffsetDst = (int)((reinterpret_cast<ULONG64>(pDest)) % 8);

			if (nOffsetSrc != nOffsetDst || nBytes < 32)
			{
				
				::memcpy(pDest, pSrc, nBytes);
			}
			else
			{
				if (nOffsetSrc != 0)
				{
					int nPreBytes = 8 - nOffsetSrc;
					::memcpy(pDest, pSrc, nPreBytes);
					pSrc = (void*)((BYTE*)pSrc + nPreBytes);
					pDest = (void*)((BYTE*)pDest + nPreBytes);
					nBytes -= nPreBytes;
					
					
				}

				int nLoops = nBytes/64;

				if (nLoops > 0)
				__asm
				{
					mov ecx, nLoops
					mov eax, pSrc
					mov edi, pDest

					ALIGN 16
					MMX_memcpy_loop:

						MOVQ       mm0, [eax]   
						MOVQ       mm1, [eax+8] 
						MOVQ       mm2, [eax+16]
						MOVQ       mm3, [eax+24]
						MOVQ       mm4, [eax+32]
						MOVQ       mm5, [eax+40]
						MOVQ       mm6, [eax+48]
						MOVQ       mm7, [eax+56]

						MOVQ       [edi], mm0       
						MOVQ       [edi+8], mm1
						MOVQ       [edi+16], mm2
						MOVQ       [edi+24], mm3
						MOVQ       [edi+32], mm4
						MOVQ       [edi+40], mm5
						MOVQ       [edi+48], mm6
						MOVQ       [edi+56], mm7
		                
						ADD        eax, 64
						ADD        edi, 64

						dec    ecx
						jnz    MMX_memcpy_loop

					EMMS
				}

				int nBytesDone = nLoops*64;
				int nBytesLeft = nBytes - nBytesDone;
				if (nBytesLeft > 0)
				{
					::memcpy((unsigned char *)pDest + nBytesDone, (unsigned char *)pSrc + nBytesDone, nBytesLeft);
				}
			}
#endif 
		}


	protected:
		BOOL m_bMMXSupported;
		BOOL m_bSSESupported;

		BOOL CheckForMMX()
		{
#ifndef _M_X64
			DWORD dwMMX = 0;
			DWORD *pdwMMX = &dwMMX;
			__try {
				__asm {
					mov eax, 1
					cpuid
					mov edi, pdwMMX
					mov dword ptr [edi], edx
				}
			}
			__except(EXCEPTION_EXECUTE_HANDLER)
			{
				dwMMX = 0;
			}

			if (dwMMX & 0x00800000)  
				return TRUE;

			return FALSE;
#else 
			return FALSE;
#endif
		}
		BOOL CheckForSSE()
		{
#ifndef _M_X64
			

			DWORD dwSSE = 0;
			DWORD *pdwSSE = &dwSSE;
			__try {
				__asm
				{
					mov eax, 1
					cpuid
					mov edi, pdwSSE
					mov dword ptr [edi], edx
				}
			}
			__except(EXCEPTION_EXECUTE_HANDLER)
			{
				dwSSE = 0;
			}

			if (dwSSE & 0x02000000)  
				return TRUE;

			return FALSE;

#else 
			return FALSE;
#endif
		}

	};
};