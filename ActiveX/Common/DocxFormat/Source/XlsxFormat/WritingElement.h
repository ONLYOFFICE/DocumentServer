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


#include "../XML/XmlUtils.h"
#include "atlstr.h"

namespace OOX
{
namespace Spreadsheet
{
#define WritingElementSpreadsheet_AdditionConstructors(Class) \
	Class(XmlUtils::CXmlLiteReader& oReader)\
	{\
		fromXML( oReader );\
	}\
	const Class& operator =(const XmlUtils::CXmlLiteReader& oReader)\
	{\
		fromXML( (XmlUtils::CXmlLiteReader&)oReader );\
		return *this;\
	}

	const double c_ag_Inch_to_MM	= 25.4;
	const double c_ag_1pxWidth		= 25.4 / 96;

	static wchar_t g_wc_amp		= wchar_t('&');
	static wchar_t g_wc_apos	= wchar_t('\'');
	static wchar_t g_wc_lt		= wchar_t('<');
	static wchar_t g_wc_qt		= wchar_t('>');
	static wchar_t g_wc_quot	= wchar_t('\"');

	static _bstr_t g_bstr_amp	= L"&amp;";
	static _bstr_t g_bstr_apos	= L"&apos;";
	static _bstr_t g_bstr_lt	= L"&lt;";
	static _bstr_t g_bstr_qt	= L"&gt;";
	static _bstr_t g_bstr_quot	= L"\"";
	static _bstr_t g_bstr_mdash	= L"&mdash;";

	class CTextItem
	{
	protected:
		wchar_t*	m_pData;
		size_t		m_lSize;

		wchar_t*	m_pDataCur;
		size_t		m_lSizeCur;

	public:
		CTextItem()
		{
			m_pData = NULL;
			m_lSize = 0;

			m_pDataCur	= m_pData;
			m_lSizeCur	= m_lSize;
		}
		CTextItem(const CTextItem& oSrc)
		{
			m_pData = NULL;
			*this = oSrc;
		}
		CTextItem& operator=(const CTextItem& oSrc)
		{
			RELEASEMEM(m_pData);

			m_lSize		= oSrc.m_lSize;
			m_lSizeCur	= oSrc.m_lSizeCur;
			m_pData		= (wchar_t*)malloc(m_lSize * sizeof(wchar_t));

			memcpy(m_pData, oSrc.m_pData, m_lSizeCur * sizeof(wchar_t));

			m_pDataCur = m_pData + m_lSizeCur;

			return *this;
		}

		CTextItem(const size_t& nLen)
		{
			m_lSize = nLen;
			m_pData = (wchar_t*)malloc(m_lSize * sizeof(wchar_t));

			m_lSizeCur = 0;
			m_pDataCur = m_pData;
		}
		CTextItem(wchar_t* pData, const size_t& nLen)
		{
			m_lSize = nLen;
			m_pData = (wchar_t*)malloc(m_lSize * sizeof(wchar_t));

			memcpy(m_pData, pData, m_lSize * sizeof(wchar_t));

			m_lSizeCur = m_lSize;
			m_pDataCur = m_pData + m_lSize;
		}
		CTextItem(wchar_t* pData, BYTE* pUnicodeChecker = NULL)
		{
			size_t nLen = GetStringLen(pData);

			m_lSize = nLen;
			m_pData = (wchar_t*)malloc(m_lSize * sizeof(wchar_t));

			memcpy(m_pData, pData, m_lSize * sizeof(wchar_t));

			m_lSizeCur = m_lSize;
			m_pDataCur = m_pData + m_lSize;

			if (NULL != pUnicodeChecker)
			{
				wchar_t* pMemory = m_pData;
				while (pMemory < m_pDataCur)
				{
					if (!pUnicodeChecker[*pMemory])
						*pMemory = wchar_t(' ');
					++pMemory;
				}
			}
		}
		virtual ~CTextItem()
		{
			RELEASEMEM(m_pData);
		}

		AVSINLINE void AddSize(const size_t& nSize)
		{
			if (NULL == m_pData)
			{
				m_lSize = max(nSize, 1000);				
				m_pData = (wchar_t*)malloc(m_lSize * sizeof(wchar_t));

				m_lSizeCur = 0;
				m_pDataCur = m_pData;
				return;
			}

			if ((m_lSizeCur + nSize) > m_lSize)
			{
				while ((m_lSizeCur + nSize) > m_lSize)
				{
					m_lSize *= 2;
				}

				wchar_t* pRealloc = (wchar_t*)realloc(m_pData, m_lSize * sizeof(wchar_t));
				if (NULL != pRealloc)
				{
					
					m_pData		= pRealloc;
					m_pDataCur	= m_pData + m_lSizeCur;
				}
				else
				{
					wchar_t* pMalloc = (wchar_t*)malloc(m_lSize * sizeof(wchar_t));
					memcpy(pMalloc, m_pData, m_lSizeCur * sizeof(wchar_t));

					free(m_pData);
					m_pData		= pMalloc;
					m_pDataCur	= m_pData + m_lSizeCur;
				}
			}
		}

		AVSINLINE wchar_t* GetData()
		{
			return m_pData;
		}
		AVSINLINE size_t GetCurSize()
		{
			return m_lSizeCur;
		}

	public:

		AVSINLINE void operator+=(const CTextItem& oTemp)
		{
			WriteString(oTemp.m_pData, oTemp.m_lSizeCur);
		}
		AVSINLINE void operator+=(_bstr_t& oTemp)
		{
			size_t nLen = oTemp.length();
			WriteString(oTemp.GetBSTR(), nLen);
		}
		AVSINLINE void operator+=(CString& oTemp)
		{
			size_t nLen = (size_t)oTemp.GetLength();

#ifdef _UNICODE
			WriteString(oTemp.GetBuffer(), nLen);
#else
			CStringW str = (CStringW)oTemp;
			WriteString(str.GetBuffer(), nLen);
#endif
		}
		AVSINLINE wchar_t& operator[](const size_t& nIndex)
		{
			return m_pData[nIndex];
		}

		AVSINLINE void SetText(BSTR& bsText)
		{
			ClearNoAttack();
			size_t nLen = GetStringLen(bsText);

			WriteString(bsText, nLen);
		}
		AVSINLINE void AddSpace()
		{
			AddSize(1);
			*m_pDataCur = wchar_t(' ');

			++m_lSizeCur;
			++m_pDataCur;
		}
		AVSINLINE void AddSpaceFirst()
		{
			AddSize(1);

			wchar_t* pMemory = new wchar_t[m_lSizeCur];
			memcpy(pMemory, m_pData, m_lSizeCur * sizeof(wchar_t));
			memcpy(m_pData + 1, pMemory, m_lSizeCur * sizeof(wchar_t));
			RELEASEARRAYOBJECTS(pMemory);

			*m_pData = wchar_t(' ');

			++m_lSizeCur;
			++m_pDataCur;
		}
		AVSINLINE BOOL IsEqual(const CTextItem& oItem)const
		{
			const wchar_t* pNew = oItem.m_pData;
			for (size_t i = 0; i < m_lSizeCur; ++i)
			{
				if (m_pData[i] != pNew[i])
					return FALSE;
			}
			return TRUE;
		}
		AVSINLINE BOOL IsEqualLast(CTextItem& oItem, BOOL bIsAddSpace)const
		{
			if (bIsAddSpace != TRUE)
				return FALSE;

			size_t size_cur = m_lSizeCur;
			size_t size_item = oItem.m_lSizeCur;
			wchar_t* p1 = m_pData;
			wchar_t* p2 = oItem.m_pData;
			for (size_t i = m_lSizeCur - 1; i >= 0; --i)
			{
				if (WCHAR(' ') != p1[i])
					break;
				--size_cur;
			}
			for (size_t i = oItem.m_lSizeCur - 1; i >= 0; --i)
			{
				if (WCHAR(' ') != p2[i])
					break;
				--size_item;
			}
			size_t len = min(size_cur, size_item);
			p1 = m_pData + size_cur - len;
			p2 = oItem.m_pData + size_item - len;
			for (size_t i = 0; i < len; ++i, ++p1, ++p2)
				if (*p1 != *p2)
					return FALSE;

			if (bIsAddSpace && (size_cur != m_lSizeCur) && (size_item == oItem.m_lSizeCur))
				oItem.AddSpace();
			return TRUE;
		}
		AVSINLINE void CorrectUnicode(const BYTE* pUnicodeChecker)
		{
			if (NULL != pUnicodeChecker)
			{
				wchar_t* pMemory = m_pData;
				while (pMemory < m_pDataCur)
				{
					if (!pUnicodeChecker[*pMemory])
						*pMemory = wchar_t(' ');
					++pMemory;
				}
			}
		}
		AVSINLINE void RemoveLastSpaces()
		{
			wchar_t* pMemory = m_pDataCur - 1;
			while ((pMemory > m_pData) && (wchar_t(' ') == *pMemory))
			{
				--pMemory;
				--m_lSizeCur;
				--m_pDataCur;
			}

		}
		AVSINLINE bool IsSpace()
		{
			if (1 != m_lSizeCur)
				return false;
			return (wchar_t(' ') == *m_pData);
		}
		AVSINLINE void CheckLastSpanLine()
		{
			if (0 == m_lSizeCur)
				return;

			if ((wchar_t(' ') == m_pData[m_lSizeCur - 1]) || (wchar_t('-') == m_pData[m_lSizeCur - 1]))
				return;

			AddSpace();			
		}

	public:
		AVSINLINE void WriteString(wchar_t* pString, const size_t& nLen)
		{
			AddSize(nLen);
			
			memcpy(m_pDataCur, pString, nLen << 1);
			m_pDataCur += nLen;
			m_lSizeCur += nLen;
		}
		AVSINLINE size_t GetSize()
		{
			return m_lSize;
		}
		AVSINLINE void Clear()
		{
			RELEASEMEM(m_pData);

			m_pData = NULL;
			m_lSize = 0;

			m_pDataCur	= m_pData;
			m_lSizeCur	= 0;
		}
		AVSINLINE void ClearNoAttack()
		{
			m_pDataCur	= m_pData;
			m_lSizeCur	= 0;
		}

		AVSINLINE size_t GetStringLen(wchar_t* pData)
		{
			wchar_t* s = pData;
			for (; *s != 0; ++s);
			return (size_t)(s - pData);
		}

		AVSINLINE CString GetCString()
		{
			CString str(m_pData, (int)m_lSizeCur);
			return str;
		}
		AVSINLINE wchar_t* GetBuffer()
		{
			return m_pData;
		}
	};

	class CStringWriter : public CTextItem
	{
	public:
		CStringWriter() : CTextItem()
		{
		}
		virtual ~CStringWriter()
		{
		}

	public:

		AVSINLINE void WriteStringB(_bstr_t& bsString)
		{
			size_t nLen = bsString.length();
			CTextItem::WriteString(bsString.GetBSTR(), nLen);
		}
		AVSINLINE void WriteString(CString sString)
		{
			size_t nLen = (size_t)sString.GetLength();

#ifdef _UNICODE
			CTextItem::WriteString(sString.GetBuffer(), nLen);
#else
			CStringW str = (CStringW)sString;
			WriteString(str.GetBuffer(), nLen);
#endif
		}
		AVSINLINE void WriteStringC(const CString& sString)
		{
			size_t nLen = (size_t)sString.GetLength();

			CString* pStr = const_cast<CString*>(&sString);

#ifdef _UNICODE
			CTextItem::WriteString(pStr->GetBuffer(), nLen);
#else
			CStringW str = (CStringW)sString;
			WriteString(str.GetBuffer(), nLen);
#endif
		}
		AVSINLINE void Write(CStringWriter& oWriter)
		{
			CTextItem::WriteString(oWriter.m_pData, oWriter.m_lSizeCur);
		}
		AVSINLINE void WriteI(CTextItem& oItem)
		{
			CTextItem::WriteString(oItem.GetData(), oItem.GetCurSize());
		}

		AVSINLINE void WriteString(wchar_t* pString, const size_t& nLen)
		{
			CTextItem::AddSize(nLen);
			
			memcpy(m_pDataCur, pString, nLen << 1);
			m_pDataCur += nLen;
			m_lSizeCur += nLen;
		}

		void WriteTextHTML(CTextItem& oItem)
		{
			size_t nCurrent = 0;
			size_t nCount	= oItem.GetCurSize();

			size_t nCurrentOld = nCurrent;
			wchar_t* pData = oItem.GetData();
			wchar_t* pStartData = pData;

			while (nCurrent < nCount)
			{
				wchar_t c = *pData++;

				if (g_wc_amp == c)
				{
					if (nCurrentOld != nCurrent)
						WriteString(pStartData, nCurrent - nCurrentOld);

					WriteStringB(g_bstr_amp);

					++nCurrent;
					nCurrentOld = nCurrent;
					pStartData = pData;
				}
				
				else if (g_wc_lt == c)
				{
					if (nCurrentOld != nCurrent)
						WriteString(pStartData, nCurrent - nCurrentOld);

					WriteStringB(g_bstr_lt);

					++nCurrent;
					nCurrentOld = nCurrent;
					pStartData = pData;
				}
				else if (g_wc_qt == c)
				{
					if (nCurrentOld != nCurrent)
						WriteString(pStartData, nCurrent - nCurrentOld);

					WriteStringB(g_bstr_qt);

					++nCurrent;
					nCurrentOld = nCurrent;
					pStartData = pData;
				}
				else if (g_wc_quot == c)
				{
					if (nCurrentOld != nCurrent)
						WriteString(pStartData, nCurrent - nCurrentOld);

					WriteStringB(g_bstr_quot);

					++nCurrent;
					nCurrentOld = nCurrent;
					pStartData = pData;
				}
				else if (8212 == (USHORT)c)
				{
					if (nCurrentOld != nCurrent)
						WriteString(pStartData, nCurrent - nCurrentOld);

					WriteStringB(g_bstr_mdash);

					++nCurrent;
					nCurrentOld = nCurrent;
					pStartData = pData;
				}
				else
				{
					++nCurrent;
				}
			}

			if (nCurrentOld != nCurrent)
				WriteString(pStartData, nCurrent - nCurrentOld);			
		}

		void WriteTextXML(CTextItem& oItem)
		{
			size_t nCurrent = 0;
			size_t nCount	= oItem.GetCurSize();

			size_t nCurrentOld = nCurrent;
			wchar_t* pData = oItem.GetData();
			wchar_t* pStartData = pData;

			while (nCurrent < nCount)
			{
				wchar_t c = *pData++;

				if (g_wc_amp == c)
				{
					if (nCurrentOld != nCurrent)
						WriteString(pStartData, nCurrent - nCurrentOld);

					WriteStringB(g_bstr_amp);

					++nCurrent;
					nCurrentOld = nCurrent;
					pStartData = pData;
				}
				
				else if (g_wc_lt == c)
				{
					if (nCurrentOld != nCurrent)
						WriteString(pStartData, nCurrent - nCurrentOld);

					WriteStringB(g_bstr_lt);

					++nCurrent;
					nCurrentOld = nCurrent;
					pStartData = pData;
				}
				else if (g_wc_qt == c)
				{
					if (nCurrentOld != nCurrent)
						WriteString(pStartData, nCurrent - nCurrentOld);

					WriteStringB(g_bstr_qt);

					++nCurrent;
					nCurrentOld = nCurrent;
					pStartData = pData;
				}
				else if (g_wc_quot == c)
				{
					if (nCurrentOld != nCurrent)
						WriteString(pStartData, nCurrent - nCurrentOld);

					WriteStringB(g_bstr_quot);

					++nCurrent;
					nCurrentOld = nCurrent;
					pStartData = pData;
				}
				else
				{
					++nCurrent;
				}
			}

			if (nCurrentOld != nCurrent)
				WriteString(pStartData, nCurrent - nCurrentOld);			
		}
	};

	enum EElementType
	{
		et_Unknown,

		et_BookViews, 
		et_WorkbookPr,
		et_WorkbookView, 
		et_DefinedNames, 
		et_DefinedName, 
		et_Sheets, 
		et_Sheet, 
		et_Si, 
		et_PhoneticPr, 
		et_r, 
		et_rPr, 
		et_rPh, 
		et_t, 
		et_Borders, 
		et_Border,
		et_BorderProp,
		et_CellStyles,
		et_CellStyle,
		et_CellStyleXfs,
		et_CellXfs,
		et_Xfs,
		et_Aligment,
		et_Protection,
		et_Colors,
		et_Color,
		et_RgbColor,
		et_IndexedColors,
		et_MruColors,
		et_Dxfs,
		et_Dxf,
		et_Fills,
		et_Fill,
		et_GradientFill,
		et_GradientStop,
		et_PatternFill,
		et_BgColor,
		et_FgColor,
		et_Fonts,
		et_Font,
		et_NumFmts,
		et_NumFmt,
		et_TableStyles,
		et_TableStyle,
		et_TableStyleElement,
		et_SheetData,
		et_Row,
		et_Cell,
		et_Formula,
		et_Cols,
		et_Col,
		et_Hyperlinks,
		et_Hyperlink,
		et_PageMargins,
		et_PageSetup,
		et_PrintOptions,
		et_MergeCells,
		et_MergeCell,
		et_Dimension,
		et_SheetFormatPr,
		et_CellAnchor,
		et_Pic,
		et_BlipFill,
		et_Blip,
		et_FromTo,
		et_Pos,
		et_Ext,
		et_CalcCell,
		et_SheetViews,
		et_SheetView,
		et_c_Chart,
		et_c_ChartStyle,
		et_c_Title,
		et_c_Tx,
		et_c_Rich,
		et_a_Paragraph,
		et_a_Run,
		et_a_Text,
		et_c_Legend,
		et_c_Overlay,
		et_c_LegendPos,
		et_c_LegendEntry,
		et_c_Layout,
		et_c_ManualLayout,
		et_c_PlotArea,
		et_c_CatAx,
		et_c_ValAx,
		et_c_CatAy,
		et_c_ValAy,
		et_c_BasicChart,
		et_c_Series,
		et_c_NumPoint,
		et_c_NumCache,
		et_c_NumCacheRef,
		et_c_NumCacheValues,
		et_c_SeriesCat,
		et_c_StrCacheRef,
		et_c_SeriesTx,
		et_c_SeriesMarker,
		et_c_SeriesDataLabels,
		et_c_SeriesShapeProperties,
		et_c_SeriesShapeIndex,
		et_c_SeriesShapeOrder,
		et_c_SeriesShapeOutline,
		et_xdr_GraphicFrame,
		et_xdr_GraphicData,
		et_TableParts,
		et_TablePart,
		et_Table,
		et_TableColumns,
		et_TableColumn,
		et_TableStyleInfo,
		et_SortState,
		et_SortCondition,
		et_Autofilter,
		et_FilterColumn,
		et_ColorFilter,
		et_DynamicFilter,
		et_CustomFilters,
		et_Filters,
		et_Filter,
		et_DateGroupItem,
		et_Authors,
		et_CommentList,
		et_Comment,
		et_ConditionalFormatting,
		et_ConditionalFormattingRule,
		et_ColorScale,
		et_DataBar,
		et_FormulaCF,
		et_IconSet,
		et_ConditionalFormatValueObject,
		et_SheetPr,
		et_Pane
	};
	class WritingElement
	{
	public:
		WritingElement(){}
		virtual ~WritingElement() {}

		virtual void			toXML(CStringWriter& writer) const	= 0;
        virtual CString			toXML() const									= 0;
		virtual EElementType	getType() const
		{
			return et_Unknown;
		}
		virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader) {}
	};

	template<typename ElemType = WritingElement>
	class WritingElementWithChilds : public WritingElement
	{
	public:
		WritingElementWithChilds(){}
		virtual ~WritingElementWithChilds() {ClearItems();}
		virtual void ClearItems()
		{
			for ( int nIndex = 0; nIndex < m_arrItems.GetSize(); nIndex++ )
			{
				if ( m_arrItems[nIndex] )
					delete m_arrItems[nIndex];

				m_arrItems[nIndex] = NULL;
			}

			m_arrItems.RemoveAll();
		}
		CSimpleArray<ElemType *>         m_arrItems;
	};
}
}
