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

#include "..\..\Common\MemoryUtils.h"

namespace Streams
{
	class IMemoryObject
	{
		MemoryUtils::CMemoryUtils* m_pMemoryUtils;
		
	public:

		IMemoryObject()
		{
			m_pMemoryUtils = NULL;
		}
			
		void SetMemoryUtils(MemoryUtils::CMemoryUtils* pMemoryUtils)
		{
			m_pMemoryUtils = pMemoryUtils;
		}
		MemoryUtils::CMemoryUtils* GetMemoryUtils()
		{
			return m_pMemoryUtils;
		}
	
		void MemCopy(void* pDestination, void* pSource, int nBytes)
		{
			if (!m_pMemoryUtils)
				memcpy(pDestination, pSource, nBytes);
			else
				m_pMemoryUtils->memcpy(pDestination, pSource, nBytes);
		}
		void MemSet(void* pDestination, unsigned char nValue, int nBytes)
		{
			if (!m_pMemoryUtils)
				memset(pDestination, nValue, nBytes);
			else
				m_pMemoryUtils->memset(pDestination, nValue, nBytes);
		}
	};
	class IStream : public IMemoryObject
	{
	public:
		
		virtual BOOL IsValid() const = 0;
		virtual BYTE* GetBuffer() = 0;
		
		virtual void Seek(int nOrigin = 0) = 0;
		virtual int GetPosition() = 0;
		virtual BYTE* GetData() = 0;
		
		virtual BOOL Peek(int nSizeToRead = 0) = 0;
		virtual BOOL Grow(int nGrowSize) = 0;
		
		virtual BYTE ReadByte() = 0;
		virtual short ReadShort() = 0;
		virtual long ReadLong() = 0;
		virtual double ReadDouble() = 0;
		virtual float ReadFloat() = 0;
		virtual CString ReadString() = 0;
		virtual BYTE* ReadPointer(int nSize) = 0;

		virtual void WriteByte(BYTE nValue) = 0;
		virtual void WriteShort(short nValue) = 0;
		virtual void WriteLong(long nValue) = 0;
		virtual void WriteDouble(double dValue) = 0;
		virtual void WriteFloat(float fValue) = 0;
		virtual void WriteString(CString& strValue) = 0;
		virtual void WritePointer(BYTE* pData, int nSize) = 0;
	};
	
	class CBuffer : public IMemoryObject
	{
	protected:

		BYTE* m_pData;
		LONG m_nSize;
		LONG m_nGrowSize;
		
	public:
		
		CBuffer()
		{
			m_pData = NULL;
			m_nSize = 0;
			m_nGrowSize = 4096;
		}
		~CBuffer()
		{
			Destroy();
		}
		
		void Destroy()
		{
			if (m_pData != NULL)
			{
				delete[] m_pData;
				m_pData = NULL;
			}

			m_nSize = 0;
		}
	
		LONG GetBufferSize()
		{
			return m_nSize;
		}
		LONG GetGrowSize()
		{
			return m_nGrowSize;
		}
		BYTE* GetBuffer()
		{
			return m_pData;
		}
		
		BOOL IsValid()
		{
			if (m_pData == NULL)
				return FALSE;

			return TRUE;
		}
	
		BOOL Create(LONG nSize, LONG nGrowSize = -1)
		{
			Destroy();

			if (nSize < 1)
				return FALSE;

			m_pData = new BYTE[nSize];

			m_nSize = nSize;

			if (!m_pData)
				return FALSE;

			if (nGrowSize > 0)
				m_nGrowSize = nGrowSize;

			return TRUE;
		}
		BOOL Create(BYTE* pData, LONG nSize, LONG nGrowSize = -1)
		{
			if (!pData)
				return FALSE;

			if (!Create(nSize))
				return FALSE;

			if (nGrowSize > 0)
				m_nGrowSize = nGrowSize;

			MemCopy(m_pData, pData, nSize);

			return TRUE;
		}
		
		BOOL Reallocate(LONG nSize)
		{
			if (!IsValid())
				return Create(nSize);

			if (nSize <= m_nSize)
				return TRUE;

			BYTE* pData = new BYTE[nSize];

			if (!pData)
				return FALSE;

			MemCopy(pData, m_pData, m_nSize);

			delete[] m_pData;

			m_pData = pData;

			m_nSize = nSize;

			return TRUE;
		}
		BOOL ReallocateGrow(LONG nGrowSize)
		{
			if (nGrowSize < m_nGrowSize)
				nGrowSize = m_nGrowSize;

			if (nGrowSize < 0)
				return FALSE;

			return Reallocate(m_nSize + nGrowSize);
		}
	};
		
	class CStream : public IStream
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
		
		virtual BOOL IsValid() const
		{
			if (m_pBuffer)
				return TRUE;

			return FALSE;
		}
		virtual BYTE* GetBuffer()
		{
			return m_pBuffer;
		}
		void SetBuffer(BYTE* pBuffer)
		{
			m_pBuffer = pBuffer;
		}
		
		virtual BOOL Peek(int nSizeToRead = 0)
		{
			return TRUE; 
		}
		virtual BOOL Grow(int nGrowSize)
		{
			return TRUE; 
		}

		virtual void Seek(int nOrigin = 0)
		{
			m_nOrigin = nOrigin;
		}
		virtual int GetPosition()
		{
			return m_nOrigin;
		}
		virtual BYTE* GetData()
		{
			return m_pBuffer + m_nOrigin;
		}
		
		virtual BYTE ReadByte()
		{
			int nOldOrigin = m_nOrigin;

			m_nOrigin += sizeof(BYTE);

			return *(BYTE*)(m_pBuffer + nOldOrigin);
		}
		virtual short ReadShort()
		{
			int nOldOrigin = m_nOrigin;

			m_nOrigin += sizeof(short);

			return *(short*)(m_pBuffer + nOldOrigin);
		}
		virtual long ReadLong()
		{
			int nOldOrigin = m_nOrigin;

			m_nOrigin += sizeof(long);

			return *(long*)(m_pBuffer + nOldOrigin);
		}
		virtual double ReadDouble()
		{
			int nOldOrigin = m_nOrigin;

			m_nOrigin += sizeof(double);

			return *(double*)(m_pBuffer + nOldOrigin);
		}
		virtual float ReadFloat()
		{
			int nOldOrigin = m_nOrigin;

			m_nOrigin += sizeof(float);

			return *(float*)(m_pBuffer + nOldOrigin);
		}
		virtual CString ReadString()
		{
			int nOldOrigin = m_nOrigin;
			int nTCharIndex = 0;

			size_t nTCharSize = sizeof (TCHAR);
			TCHAR *pstrBuffer = (TCHAR *)(m_pBuffer + m_nOrigin);

			while (TRUE)
			{
				++nTCharIndex;
				m_nOrigin += (int)nTCharSize;

				if (_T ('\0') == pstrBuffer [nTCharIndex - 1])
					break;
			}

			return CString ((TCHAR *)(m_pBuffer + nOldOrigin));
		}
		virtual BYTE* ReadPointer(int nSize)
		{
			int nOldOrigin = m_nOrigin;

			m_nOrigin += nSize;

			return (BYTE*)(m_pBuffer + nOldOrigin);
		}
		
		virtual void WriteByte(BYTE nValue)
		{
			MemCopy(m_pBuffer + m_nOrigin, &nValue, sizeof(BYTE));

			m_nOrigin += sizeof(BYTE);
		}
		virtual void WriteShort(short nValue)
		{
			MemCopy(m_pBuffer + m_nOrigin, &nValue, sizeof(short));

			m_nOrigin += sizeof(short);
		}
		virtual void WriteLong(long nValue)
		{
			MemCopy(m_pBuffer + m_nOrigin, &nValue, sizeof(long));

			m_nOrigin += sizeof(long);
		}
		virtual void WriteDouble(double dValue)
		{
			MemCopy(m_pBuffer + m_nOrigin, &dValue, sizeof(double));

			m_nOrigin += sizeof(double);
		}
		virtual void WriteFloat(float fValue)
		{
			MemCopy(m_pBuffer + m_nOrigin, &fValue, sizeof(float));

			m_nOrigin += sizeof(float);
		}
		virtual void WriteString(CString strValue)
		{
			size_t nTCharSize = sizeof (TCHAR);

			TCHAR *pstr = strValue.GetBuffer ();

			MemCopy (m_pBuffer + m_nOrigin, pstr, strValue.GetLength () * (int)nTCharSize);

			m_nOrigin += strValue.GetLength () * (int)nTCharSize;

			TCHAR *pstrBuffer = (TCHAR *)(m_pBuffer + m_nOrigin);
			pstrBuffer [0] = _T ('\0');

			m_nOrigin += (int)nTCharSize;
		}
		virtual void WritePointer(BYTE* pData, int nSize)
		{
			MemCopy(m_pBuffer + m_nOrigin, pData, nSize);

			m_nOrigin += nSize;
		}
	};

	class CBufferedStream : public IStream
	{
	protected:
		
		CBuffer* m_pBuffer;
		int m_nOrigin;
			
	protected:
	
		inline BOOL ValidatePosition(int nPosition)
		{
			if (!m_pBuffer)
				return FALSE;

			return (nPosition <= m_pBuffer->GetBufferSize());
		}
		
	public:

		CBufferedStream()
		{
			m_pBuffer = NULL;
			m_nOrigin = 0;
		}
		
		virtual BOOL IsValid() const
		{
			if (!m_pBuffer)
				return FALSE;

			return m_pBuffer->IsValid();
		}
		virtual BYTE* GetBuffer()
		{
			if (!m_pBuffer)
				return NULL;

			return m_pBuffer->GetBuffer();
		}
		virtual void SetBuffer(CBuffer* pBuffer)
		{
			m_pBuffer = pBuffer;
		}
		
		virtual BOOL Create(LONG nSize, LONG nGrowSize = -1)
		{
			if (m_pBuffer)
				return m_pBuffer->Create(nSize, nGrowSize);

			return FALSE;
		}
		virtual BOOL Create(BYTE* pData, LONG nSize, LONG nGrowSize = -1)
		{
			if (m_pBuffer)
				return m_pBuffer->Create(pData, nSize, nGrowSize);

			return FALSE;
		}
		void Skip(int nDif)
		{
			if(nDif > 0 && !Grow(nDif))
				return;
			if (!ValidatePosition(m_nOrigin + nDif))
				return;

			m_nOrigin += nDif;
		}
		virtual void Seek(int nOrigin = 0)
		{
			if (!ValidatePosition(nOrigin))
				return;

			m_nOrigin = nOrigin;
		}
		virtual int GetPosition()
		{
			return m_nOrigin;
		}
		virtual BYTE* GetData()
		{
			if (!m_pBuffer)
				return NULL;

			return m_pBuffer->GetBuffer() + m_nOrigin;
		}
		
		virtual BOOL Peek(int nSizeToRead = 0)
		{
			return ValidatePosition(m_nOrigin + nSizeToRead);
		}
		virtual BOOL Grow(int nGrowSize)
		{
			if (!m_pBuffer)
				return FALSE;

			if (m_nOrigin + nGrowSize + 1 < m_pBuffer->GetBufferSize())
				return TRUE;

			return m_pBuffer->ReallocateGrow(nGrowSize + 1);
		}
		
		virtual BYTE ReadByte()
		{
			if (!Peek(sizeof(BYTE)))
				return 0;

			int nOldOrigin = m_nOrigin;

			m_nOrigin += sizeof(BYTE);

			return *(BYTE*)(m_pBuffer->GetBuffer() + nOldOrigin);
		}
		virtual bool ReadBool()
		{
			return 0 != ReadByte();
		}
		virtual short ReadShort()
		{
			if (!Peek(sizeof(short)))
				return 0;

			int nOldOrigin = m_nOrigin;

			m_nOrigin += sizeof(short);

			return *(short*)(m_pBuffer->GetBuffer() + nOldOrigin);
		}
		virtual long ReadLong()
		{
			if (!Peek(sizeof(long)))
				return 0;

			int nOldOrigin = m_nOrigin;

			m_nOrigin += sizeof(long);

			return *(long*)(m_pBuffer->GetBuffer() + nOldOrigin);
		}
		virtual double ReadDouble()
		{
			if (!Peek(sizeof(double)))
				return 0;

			int nOldOrigin = m_nOrigin;

			m_nOrigin += sizeof(double);

			return *(double*)(m_pBuffer->GetBuffer() + nOldOrigin);
		}
		double ReadDouble2()
		{
			
			long nRes = ReadLong();
			return 1.0 * nRes / 100000;
		}
		virtual float ReadFloat()
		{
			if (!Peek(sizeof(float)))
				return 0;

			int nOldOrigin = m_nOrigin;

			m_nOrigin += sizeof(float);

			return *(float*)(m_pBuffer->GetBuffer() + nOldOrigin);
		}
		virtual CString ReadString()
		{
			int nOldOrigin = m_nOrigin;
			int nTCharIndex = 0;

			size_t nTCharSize = sizeof (TCHAR);
			TCHAR *pstrBuffer = (TCHAR *)(m_pBuffer->GetBuffer() + m_nOrigin);

			while (TRUE)
			{
				if (!Peek ((int)nTCharSize))
					return _T ("");

				++nTCharIndex;
				m_nOrigin += (int)nTCharSize;

				if (_T ('\0') == pstrBuffer[nTCharIndex - 1])
					break;
			}

			return CString ((TCHAR*)(m_pBuffer->GetBuffer() + nOldOrigin));
		}
		virtual CString ReadString2(int length)
		{
			return CString((wchar_t*)ReadPointer(length), length / 2);
		}
		virtual BYTE* ReadPointer(int nSize)
		{
			if (!Peek(nSize))
				return NULL;

			int nOldOrigin = m_nOrigin;

			m_nOrigin += nSize;

			return (BYTE*)(m_pBuffer->GetBuffer() + nOldOrigin);
		}
		void WriteBool(bool bValue)
		{
			WriteByte(false == bValue ? 0 : 1);
		}
		virtual void WriteByte(BYTE nValue)
		{
			if (!Grow(sizeof(BYTE)))
				return;

			MemCopy(m_pBuffer->GetBuffer() + m_nOrigin, &nValue, sizeof(BYTE));

			m_nOrigin += sizeof(BYTE);
		}
		virtual void WriteShort(short nValue)
		{
			if (!Grow(sizeof(short)))
				return;

			MemCopy(m_pBuffer->GetBuffer() + m_nOrigin, &nValue, sizeof(short));

			m_nOrigin += sizeof(short);
		}
		virtual void WriteLong(long nValue)
		{
			if (!Grow(sizeof(long)))
				return;

			MemCopy(m_pBuffer->GetBuffer() + m_nOrigin, &nValue, sizeof(long));

			m_nOrigin += sizeof(long);
		}
		virtual void WriteDouble(double dValue)
		{
			if (!Grow(sizeof(double)))
				return;

			MemCopy(m_pBuffer->GetBuffer() + m_nOrigin, &dValue, sizeof(double));

			m_nOrigin += sizeof(double);
		}
		virtual void WriteDouble2(double dValue)
		{
			long nValue = (long)(dValue * 100000);
			WriteLong(nValue);
		}
		virtual void WriteFloat(float fValue)
		{
			if (!Grow(sizeof(float)))
				return;

			MemCopy(m_pBuffer->GetBuffer() + m_nOrigin, &fValue, sizeof(float));

			m_nOrigin += sizeof(float);
		}
		virtual void WriteString(CString& strValue)
		{
			size_t nTCharSize = sizeof (TCHAR);

			if (!Grow (strValue.GetLength () * (int)nTCharSize + (int)nTCharSize))
				return;

			TCHAR* pstr = strValue.GetBuffer ();

			MemCopy (m_pBuffer->GetBuffer () + m_nOrigin, pstr, strValue.GetLength () * (int)nTCharSize);

			m_nOrigin += strValue.GetLength () * (int)nTCharSize;

			
			TCHAR *pstrBuffer = (TCHAR *)(m_pBuffer->GetBuffer () + m_nOrigin);
			pstrBuffer [0] = _T ('\0');

			m_nOrigin += (int)nTCharSize;
		}
		virtual void WriteString1(CString& strValue)
		{
			int nStrLen = strValue.GetLength();
			WriteLong( nStrLen);

			size_t nTCharSize = sizeof (TCHAR);
			if (!Grow ( nStrLen * (int)nTCharSize))
				return;
			TCHAR* pstr = strValue.GetBuffer ();

			MemCopy (m_pBuffer->GetBuffer () + m_nOrigin, pstr, strValue.GetLength () * (int)nTCharSize);

			m_nOrigin += strValue.GetLength () * (int)nTCharSize;
		}
		virtual void WriteString2(CString& strValue)
		{
			int nStrLen = strValue.GetLength();
			WriteLong( 2 * nStrLen);

			size_t nTCharSize = sizeof (TCHAR);
			if (!Grow ( nStrLen * (int)nTCharSize))
				return;
			TCHAR* pstr = strValue.GetBuffer ();

			MemCopy (m_pBuffer->GetBuffer () + m_nOrigin, pstr, strValue.GetLength () * (int)nTCharSize);

			m_nOrigin += strValue.GetLength () * (int)nTCharSize;
		}
		virtual void WriteString3(CString& strValue)
		{
			int nStrLen = strValue.GetLength();

			size_t nTCharSize = sizeof (TCHAR);
			if (!Grow ( nStrLen * (int)nTCharSize))
				return;
			TCHAR* pstr = strValue.GetBuffer ();

			MemCopy (m_pBuffer->GetBuffer () + m_nOrigin, pstr, strValue.GetLength () * (int)nTCharSize);

			m_nOrigin += strValue.GetLength () * (int)nTCharSize;
		}
		virtual void WritePointer(BYTE* pData, int nSize)
		{
			if (!Grow(nSize))
				return;

			MemCopy(m_pBuffer->GetBuffer() + m_nOrigin, pData, nSize);

			m_nOrigin += nSize;
		}
	};
}
