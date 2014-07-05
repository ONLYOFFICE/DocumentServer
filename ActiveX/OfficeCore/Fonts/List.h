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
 #ifndef _LIST_H
#define _LIST_H





class CList 
{

public:

	
	CList() 
	{
		m_nItemSize = 8;
		m_ppData = (void **)::malloc( m_nItemSize * sizeof(void*) );
		m_nCount = 0;
		m_nIncreament = 0;
	}

	
	CList(int nSize) 
	{
		m_nItemSize = nSize;
		m_ppData = (void **)::malloc( m_nItemSize * sizeof(void*) );
		m_nCount = 0;
		m_nIncreament = 0;
	}


	
    ~CList() 
	{
		if ( m_ppData )
			::free( m_ppData );
	}

	int GetLength() 
	{ 
		return m_nCount; 
	}

	
	
	void *GetByIndex(int nIndex) 
	{
		if ( nIndex < 0 || nIndex >= m_nCount )
			return NULL;
		return m_ppData[ nIndex ]; 
	}

	
	void Append(void *pItem) 
	{
		if ( m_nCount >= m_nItemSize )
			Expand();
		m_ppData[m_nCount++] = pItem;
	}


	
	void Append(CList *pList) 
	{
		while ( m_nCount + pList->m_nCount > m_nItemSize )
			Expand();
		for (int nIndex = 0; nIndex < pList->m_nCount; ++nIndex )
			m_ppData[m_nCount++] = pList->m_ppData[ nIndex ];
	}


	
	
	void Insert(int nIndex, void *pItem) 
	{
		if ( 0 > nIndex  || nIndex > m_nCount )
			return;
		if ( m_nCount >= m_nItemSize ) 
			Expand();
		if ( nIndex < m_nCount ) 
			memmove( m_ppData + nIndex + 1, m_ppData + nIndex, ( m_nCount - nIndex ) * sizeof(void *));
		m_ppData[ nIndex ] = pItem;
		++m_nCount;
	}

	
	
	void *Delete(int nIndex) 
	{
		void *pItem = m_ppData[ nIndex ];
		if ( nIndex < m_nCount - 1 ) 
			memmove( m_ppData + nIndex, m_ppData + nIndex + 1, (m_nCount - nIndex - 1) * sizeof(void *));
		--m_nCount;
		if ( m_nItemSize - m_nCount >= ((m_nIncreament > 0) ? m_nIncreament : m_nItemSize / 2 ) )
			Shrink();
		return pItem;
	}

	
	
	void Sort(int (*CompareFunc)(const void *pItem1, const void *pItem2 ) ) 
	{
		qsort( m_ppData, m_nCount, sizeof(void *), CompareFunc);
	}

	
	
	
	void SetAllocationIncreament(int nIncreament) 
	{ 
		m_nIncreament = nIncreament; 
	}

private:

	void Expand() 
	{
		m_nItemSize += ( m_nIncreament > 0 ) ? m_nIncreament : m_nItemSize;
		m_ppData = (void **)::realloc( m_ppData, m_nItemSize * sizeof(void*) );
	}

	void Shrink() 
	{
		m_nItemSize -= ( m_nIncreament > 0 ) ? m_nIncreament : m_nItemSize / 2;
		m_ppData = (void **)::realloc( m_ppData, m_nItemSize * sizeof(void*) );
	}


private:

  void **m_ppData;      
  int    m_nItemSize;   
  int    m_nCount;      
  int    m_nIncreament; 
};

#define DeleteCList(list, T)                        \
  do {                                              \
    CList *_list = (list);                          \
    {                                               \
      int _i;                                       \
      for (_i = 0; _i < _list->GetLength(); ++_i) { \
        delete (T*)_list->GetByIndex(_i);                  \
      }                                             \
      delete _list;                                 \
    }                                               \
  } while (0)

#endif 