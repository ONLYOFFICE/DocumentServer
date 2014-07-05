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

#ifndef _USE_MATH_DEFINES
#define _USE_MATH_DEFINES
#endif

#include <math.h>
#include "./../Common.h"

#include "../../../../XmlUtils.h"

namespace NSGuidesVML
{
	enum FormulaType
	{
		
		ftSum			= 0,	
		ftProduct		= 1,	
		ftMid			= 2,	
		ftAbsolute		= 3,	
		ftMin			= 4,	
		ftMax			= 5,	
		ftIf			= 6,	
		ftMod			= 7,	
		ftAtan2			= 8,	
		ftSin			= 9,	
		ftCos			= 10,	
		ftCosatan2		= 11,	
		ftSinatan2		= 12,	
		ftSqrt			= 13,	
		ftSumangle		= 14,	
		ftEllipse		= 15,	
		ftTan			= 16,	
		ftVal			= 17	
	};	

	enum ParamType
	{
		ptFormula			= 0,
		ptAdjust			= 1,
		ptValue				= 2
	};
	
	static LONG GetValue(CString strParam, ParamType& ptType, bool& bRes, 
				long lShapeWidth = ShapeSizeVML, long lShapeHeight = ShapeSizeVML)
	{
		ptType = ptValue;
		bRes = true;
		if ('#' == strParam[0])
		{
			ptType = ptAdjust;
			return (LONG)XmlUtils::GetInteger(strParam.Mid(1));
		}
		else if ('@' == strParam[0])
		{
			ptType = ptFormula;
			return (LONG)XmlUtils::GetInteger(strParam.Mid(1));
		}
		else if (!NSStringUtils::IsNumber(strParam))
		{
			if (_T("width") == strParam)
			{
				return lShapeWidth;
			}
			else if (_T("height") == strParam)
			{
				return lShapeHeight;
			}
			else
			{
				bRes = false;
				return 0;
			}
		}	
		else
		{
			ptType = ptValue;
			return (LONG)XmlUtils::GetInteger(strParam);
		}
	}
	
	static FormulaType GetFormula(CString strName, bool& bRes)
	{
		bRes = true;
		if		(_T("sum") == strName)									return ftSum;
		else if ((_T("prod") == strName) || (_T("product") == strName)) return ftProduct;
		else if (_T("mid") == strName)									return ftMid;
		else if ((_T("absolute") == strName) || (_T("abs") == strName)) return ftAbsolute;
		else if (_T("min") == strName)									return ftMin;
		else if (_T("max") == strName)									return ftMax;
		else if (_T("if") == strName)									return ftIf;
		else if (_T("sqrt") == strName)									return ftSqrt;
		else if (_T("mod") == strName)									return ftMod;
		else if (_T("sin") == strName)									return ftSin;
		else if (_T("cos") == strName)									return ftCos;
		else if (_T("tan") == strName)									return ftTan;
		else if (_T("atan2") == strName)								return ftAtan2;
		else if (_T("sinatan2") == strName)								return ftSinatan2;
		else if (_T("cosatan2") == strName)								return ftCosatan2;
		else if (_T("sumangle") == strName)								return ftSumangle;
		else if (_T("ellipse") == strName)								return ftEllipse;
		else if (_T("val") == strName)									return ftVal;
		else bRes = false;

		return ftVal;
	}
}

namespace NSGuidesVML
{
	class CFormulasManager;
	class CFormula
	{
	public:
		FormulaType m_eFormulaType;
		int m_lIndex;
		
		LONG m_lParam1;
		ParamType m_eType1;

		LONG m_lParam2;
		ParamType m_eType2;

		LONG m_lParam3;
		ParamType m_eType3;

private:
		long m_lCountRecurs;

	public:
		CFormula()
		{
			m_eFormulaType = ftSum;
			m_lIndex = 0;
			m_lParam1 = 0;	m_eType1 = ptValue;
			m_lParam2 = 0;	m_eType2 = ptValue;
			m_lParam3 = 0;	m_eType3 = ptValue;

			m_lCountRecurs = 0;
		}

		CFormula(int nIndex)
		{
			m_eFormulaType = ftSum;
			m_lIndex = nIndex;
			m_lParam1 = 0;	m_eType1 = ptValue;
			m_lParam2 = 0;	m_eType2 = ptValue;
			m_lParam3 = 0;	m_eType3 = ptValue;

			m_lCountRecurs = 0;
		}

		CFormula& operator =(const CFormula& oSrc)
		{
			m_eFormulaType	= oSrc.m_eFormulaType;
			m_lIndex		= oSrc.m_lIndex;

			m_lParam1		= oSrc.m_lParam1;
			m_eType1		= oSrc.m_eType1;
			
			m_lParam2		= oSrc.m_lParam2;
			m_eType2		= oSrc.m_eType2;
			
			m_lParam3		= oSrc.m_lParam3;
			m_eType3		= oSrc.m_eType3;

			m_lCountRecurs = 0;
			return (*this);
		}

		void FromString(CString strFormula, long lShapeWidth = ShapeSizeVML, long lShapeHeight = ShapeSizeVML)
		{
			CSimpleArray<CString> oArrayParams;
			NSStringUtils::ParseString(_T(" "), strFormula, &oArrayParams);
			int nCount = oArrayParams.GetSize();
			if (0 >= nCount)
				return;

			bool bRes = true;
			m_eFormulaType = GetFormula(oArrayParams[0], bRes);

			ParamType ptType = ptValue;
			if (1 < nCount)
			{
				m_lParam1 = GetValue(oArrayParams[1], ptType, bRes, lShapeWidth, lShapeHeight);
				m_eType1 = ptType;		
			}
			if (2 < nCount)
			{
				m_lParam2 = GetValue(oArrayParams[2], ptType, bRes, lShapeWidth, lShapeHeight);
				m_eType2 = ptType;		
			}
			if (3 < nCount)
			{
				m_lParam3 = GetValue(oArrayParams[3], ptType, bRes, lShapeWidth, lShapeHeight);
				m_eType3 = ptType;		
			}
		}
		LONG Calculate(CFormulasManager* pManager);
	};

	class CFormulasManager
	{
	public:
		CSimpleArray<LONG>* m_pAdjustments;
		CSimpleArray<LONG> m_arResults;

		CSimpleArray<CFormula> m_arFormulas;

		long m_lShapeWidth;
		long m_lShapeHeight;

	public:
		CFormulasManager() : m_arFormulas(), m_arResults()
		{
			m_pAdjustments	= NULL;
			m_lShapeWidth	= ShapeSizeVML;
			m_lShapeHeight	= ShapeSizeVML;
		}
		CFormulasManager& operator =(const CFormulasManager& oSrc)
		{
			m_pAdjustments	= oSrc.m_pAdjustments;
			m_lShapeWidth	= oSrc.m_lShapeWidth;
			m_lShapeHeight	= oSrc.m_lShapeHeight;

			m_arResults.RemoveAll();
			for (int nIndex = 0; nIndex < oSrc.m_arResults.GetSize(); ++nIndex)
			{
				m_arResults.Add(oSrc.m_arResults[nIndex]);
			}
			m_arFormulas.RemoveAll();
			for (int nIndex = 0; nIndex < oSrc.m_arFormulas.GetSize(); ++nIndex)
			{
				m_arFormulas.Add(oSrc.m_arFormulas[nIndex]);
			}
			
			return (*this);
		}

		void RemoveAll()
		{
			m_pAdjustments	= NULL;
			m_lShapeWidth	= ShapeSizeVML;
			m_lShapeHeight	= ShapeSizeVML;

			m_arFormulas.RemoveAll();
			m_arResults.RemoveAll();
		}

		void Clear(CSimpleArray<LONG>* pAdjusts)
		{
			m_pAdjustments = pAdjusts;
			
			
			
			for (int nIndex = 0; nIndex < m_arResults.GetSize(); ++nIndex)
			{
				m_arResults[nIndex] = 0xFFFFFFFF;
			}
		}
		void AddFormula(CString strFormula)
		{
			CFormula oFormula(m_arFormulas.GetSize());
			oFormula.FromString(strFormula, m_lShapeWidth, m_lShapeHeight);
			m_arFormulas.Add(oFormula);
			m_arResults.Add(0xFFFFFFFF);
		}
		void AddFormula(CFormula oFormula)
		{
			oFormula.m_lIndex = m_arFormulas.GetSize();
			m_arFormulas.Add(oFormula);
			m_arResults.Add(0xFFFFFFFF);
		}
		void CalculateResults()
		{
			for (int index = 0; index < m_arFormulas.GetSize(); ++index)
			{
				LONG lResult = m_arFormulas[index].Calculate(this);
			}

			
			
		}
	};
}
