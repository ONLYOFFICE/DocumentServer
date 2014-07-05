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
#ifndef PPTX_LIMIT_SLIDELAYOUTTYPE_INCLUDE_H_
#define PPTX_LIMIT_SLIDELAYOUTTYPE_INCLUDE_H_

#include "BaseLimit.h"



namespace PPTX
{
	namespace Limit
	{
		class SlideLayoutType : public BaseLimit
		{
		public:
			SlideLayoutType()
			{
				m_strValue = _T("blank");
			}

			_USE_STRING_OPERATOR
				
			virtual void set(const CString& strValue)
			{
				if ((_T("blank") == strValue) ||
					(_T("chart") == strValue) ||
					(_T("chartAndTx") == strValue) ||
					(_T("clipArtAndTx") == strValue) ||
					(_T("clipArtAndVertTx") == strValue) ||
					(_T("cust") == strValue) ||
					(_T("dgm") == strValue) ||
					(_T("fourObj") == strValue) ||
					(_T("mediaAndTx") == strValue) ||
					(_T("obj") == strValue) ||
					(_T("objAndTwoObj") == strValue) ||
					(_T("objAndTx") == strValue) ||
					(_T("objOnly") == strValue) ||
					(_T("objOverTx") == strValue) ||
					(_T("objTx") == strValue) ||
					(_T("picTx") == strValue) ||
					(_T("secHead") == strValue) ||
					(_T("tbl") == strValue) ||
					(_T("title") == strValue) ||
					(_T("titleOnly") == strValue) ||
					(_T("twoColTx") == strValue) ||
					(_T("twoObj") == strValue) ||
					(_T("twoObjAndObj") == strValue) ||
					(_T("twoObjAndTx") == strValue) ||
					(_T("twoObjOverTx") == strValue) ||
					(_T("twoTxTwoObj") == strValue) ||
					(_T("tx") == strValue) ||
					(_T("txAndChart") == strValue) ||
					(_T("txAndClipArt") == strValue) ||
					(_T("txAndMedia") == strValue) ||
					(_T("txAndObj") == strValue) ||
					(_T("txAndTwoObj") == strValue) ||
					(_T("txOverObj") == strValue) ||
					(_T("vertTitleAndTx") == strValue) ||
					(_T("vertTitleAndTxOverChart") == strValue) ||
					(_T("vertTx") == strValue))
				{
					m_strValue = strValue;
				}
			}

			virtual BYTE GetBYTECode() const
			{
				if (_T("blank") == m_strValue) return 0;
				if (_T("chart") == m_strValue) return 1;
				if (_T("chartAndTx") == m_strValue) return 2;
				if (_T("clipArtAndTx") == m_strValue) return 3;
				if (_T("clipArtAndVertTx") == m_strValue) return 4;
				if (_T("cust") == m_strValue) return 5;
				if (_T("dgm") == m_strValue) return 6;
				if (_T("fourObj") == m_strValue) return 7;
				if (_T("mediaAndTx") == m_strValue) return 8;
				if (_T("obj") == m_strValue) return 9;
				if (_T("objAndTwoObj") == m_strValue) return 10;
				if (_T("objAndTx") == m_strValue) return 11;
				if (_T("objOnly") == m_strValue) return 12;
				if (_T("objOverTx") == m_strValue) return 13;
				if (_T("objTx") == m_strValue) return 14;
				if (_T("picTx") == m_strValue) return 15;
				if (_T("secHead") == m_strValue) return 16;
				if (_T("tbl") == m_strValue) return 17;
				if (_T("title") == m_strValue) return 18;
				if (_T("titleOnly") == m_strValue) return 19;
				if (_T("twoColTx") == m_strValue) return 20;
				if (_T("twoObj") == m_strValue) return 21;
				if (_T("twoObjAndObj") == m_strValue) return 22;
				if (_T("twoObjAndTx") == m_strValue) return 23;
				if (_T("twoObjOverTx") == m_strValue) return 24;
				if (_T("twoTxTwoObj") == m_strValue) return 25;
				if (_T("tx") == m_strValue) return 26;
				if (_T("txAndChart") == m_strValue) return 27;
				if (_T("txAndClipArt") == m_strValue) return 28;
				if (_T("txAndMedia") == m_strValue) return 29;
				if (_T("txAndObj") == m_strValue) return 30;
				if (_T("txAndTwoObj") == m_strValue) return 31;
				if (_T("txOverObj") == m_strValue) return 32;
				if (_T("vertTitleAndTx") == m_strValue) return 33;
				if (_T("vertTitleAndTxOverChart") == m_strValue) return 34;
				if (_T("vertTx") == m_strValue) return 35;
				return 0;				
			}
		};
	} 
} 

#endif // PPTX_LIMIT_SLIDELAYOUTTYPE_INCLUDE_H_