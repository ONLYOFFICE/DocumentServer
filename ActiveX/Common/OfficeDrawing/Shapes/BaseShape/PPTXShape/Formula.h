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

namespace NSGuidesOOXML
{
	const double dNonDefResult = 27273042316900;
	const long NonDefResult = 0xFFFFFF;

	class CFormulaManager;

	class CFormula
	{
	public:
		enum FormulaType
		{
			
			ftOOXMLSum			= 0,	
			ftOOXMLProduct		= 1,	
			ftOOXMLAddDivide	= 2,	
			ftOOXMLAbsolute		= 3,	
			ftOOXMLMin			= 4,	
			ftOOXMLMax			= 5,	
			ftOOXMLIf			= 6,	
			ftOOXMLSqrt			= 7,	
			ftOOXMLMod			= 8,	
			ftOOXMLSin			= 9,	
			ftOOXMLCos			= 10,	
			ftOOXMLTan			= 11,	
			ftOOXMLAtan2		= 12,	
			ftOOXMLSinatan2		= 13,	
			ftOOXMLCosatan2		= 14,	
			ftOOXMLPin			= 15,	
			ftOOXMLVal			= 16	
		};

		static FormulaType GetFormula(CString strName, bool& bRes)
		{
			bRes = true;
			if		(_T("+-") == strName)	return ftOOXMLSum;
			else if (_T("*/") == strName)	return ftOOXMLProduct;
			else if (_T("+/") == strName)	return ftOOXMLAddDivide;
			else if (_T("abs") == strName)	return ftOOXMLAbsolute;
			else if (_T("min") == strName)	return ftOOXMLMin;
			else if (_T("max") == strName)	return ftOOXMLMax;
			else if (_T("?:") == strName)	return ftOOXMLIf;
			else if (_T("sqrt") == strName)	return ftOOXMLSqrt;
			else if (_T("mod") == strName)	return ftOOXMLMod;
			else if (_T("sin") == strName)	return ftOOXMLSin;
			else if (_T("cos") == strName)	return ftOOXMLCos;
			else if (_T("tan") == strName)	return ftOOXMLTan;
			else if (_T("at2") == strName)	return ftOOXMLAtan2;
			else if (_T("sat2") == strName)	return ftOOXMLSinatan2;
			else if (_T("cat2") == strName)	return ftOOXMLCosatan2;
			else if (_T("pin") == strName)	return ftOOXMLPin;
			else if (_T("val") == strName)	return ftOOXMLVal;
			else bRes = false;

			return ftOOXMLVal;
		}

	private:
		FormulaType m_eFormulaType;
		int m_lIndex;
		
		CString m_lParam1;
		CString m_lParam2;
		CString m_lParam3;
	public:
		CFormula(long ind = 0)
		{
			m_eFormulaType = ftOOXMLSum;
			m_lIndex = ind;
			m_lParam1 = _T("0");
			m_lParam2 = _T("0");
			m_lParam3 = _T("0");
		}

		CFormula& operator =(const CFormula& src)
		{
			m_eFormulaType = src.m_eFormulaType;
			m_lIndex = src.m_lIndex;
			m_lParam1 = src.m_lParam1;
			m_lParam2 = src.m_lParam2;
			m_lParam3 = src.m_lParam3;
		}

		void FromString(CString strFormula)
		{
			CSimpleArray<CString> oArrayParams;
			NSStringUtils::ParseString(_T(" "), strFormula, &oArrayParams);
			int nCount = oArrayParams.GetSize();
			if (0 >= nCount)
				return;

			bool bRes = true;
			m_eFormulaType = GetFormula(oArrayParams[0], bRes);


			if (1 < nCount)
				m_lParam1 = oArrayParams[1];
			if (2 < nCount)
				m_lParam2 = oArrayParams[2];
			if (3 < nCount)
				m_lParam3 = oArrayParams[3];
		}

		double Calculate(CFormulaManager& pManager);
	};

	class CFormulaManager
	{
	private:
		CSimpleMap<CString, long> mapAdjustments;
		CSimpleMap<CString, long> mapGuides;
		CSimpleArray<CFormula> strAdjustments;
		CSimpleArray<CFormula> strGuides;
		double m_lShapeWidth;
		double m_lShapeHeight;
	public:
		CSimpleArray<long>* Adjustments;
		CSimpleArray<double>* Guides;

		void SetWidthHeight(double w, double h)
		{
			if((w >= 0) && (h >= 0))
			{
				Clear();
				if(w > h)
				{
					h = (h * ShapeSize)/w;
					if(h < 1.0) h = 1.0;
					w = ShapeSize;
				}
				else if(w < h)
				{
					w = (w * ShapeSize)/h;
					if(w < 1.0) w = 1.0;
					h = ShapeSize;
				}
				else
				{
					w = ShapeSize;
					h = ShapeSize;
				}
				m_lShapeWidth = w;
				m_lShapeHeight = h;
			}
		}
		inline double GetWidth()
		{
			return m_lShapeWidth;
		}
		inline double GetHeight()
		{
			return m_lShapeHeight;
		}

	public:
		CFormulaManager(CSimpleArray<long>& a, CSimpleArray<double>& g)
		{
			Adjustments = &a;
			Guides = &g;

			m_lShapeWidth = ShapeSize;
			m_lShapeHeight = ShapeSize;

			AddGuide(_T("3cd4"), _T("val 16200000"));	
			AddGuide(_T("3cd8"), _T("val 8100000"));	
			AddGuide(_T("5cd8"), _T("val 13500000"));	
			AddGuide(_T("7cd8"), _T("val 18900000"));	
			AddGuide(_T("b"), _T("val h"));				
														
			AddGuide(_T("cd2"), _T("val 10800000"));	
			AddGuide(_T("cd4"), _T("val 5400000"));		
			AddGuide(_T("cd8"), _T("val 2700000"));		
			AddGuide(_T("hc"), _T("*/ w 1 2"));			
			AddGuide(_T("hd2"), _T("*/ h 1 2"));		
			AddGuide(_T("hd3"), _T("*/ h 1 3"));		
			AddGuide(_T("hd4"), _T("*/ h 1 4"));		
			AddGuide(_T("hd5"), _T("*/ h 1 5"));		
			AddGuide(_T("hd6"), _T("*/ h 1 6"));		
			AddGuide(_T("hd8"), _T("*/ h 1 8"));		
			AddGuide(_T("l"), _T("val 0"));				
			AddGuide(_T("ls"), _T("max w h"));			
			AddGuide(_T("r"), _T("val w"));				
														
			AddGuide(_T("ss"), _T("min w h"));			
														
			AddGuide(_T("ssd2"), _T("*/ ss 1 2"));		
			AddGuide(_T("ssd4"), _T("*/ ss 1 4"));		
			AddGuide(_T("ssd6"), _T("*/ ss 1 6"));		
			AddGuide(_T("ssd8"), _T("*/ ss 1 8"));		
			AddGuide(_T("t"), _T("val 0"));				
			AddGuide(_T("vc"), _T("*/ h 1 2"));			
			AddGuide(_T("wd2"), _T("*/ w 1 2"));		
			AddGuide(_T("wd4"), _T("*/ w 1 4"));		
			AddGuide(_T("wd5"), _T("*/ w 1 5"));		
			AddGuide(_T("wd6"), _T("*/ w 1 6"));		
			AddGuide(_T("wd8"), _T("*/ w 1 8"));		
			AddGuide(_T("wd10"), _T("*/ w 1 10"));		
			AddGuide(_T("wd32"), _T("*/ w 1 32"));		
		}

		~CFormulaManager()
		{
			mapAdjustments.RemoveAll();
			mapGuides.RemoveAll();
			strAdjustments.RemoveAll();
			strGuides.RemoveAll();
			Adjustments->RemoveAll();
			Guides->RemoveAll();
		}

		CFormulaManager& operator =(const CFormulaManager& manager)
		{
			m_lShapeWidth = manager.m_lShapeWidth;
			m_lShapeHeight = manager.m_lShapeWidth;

			mapAdjustments.RemoveAll();
			for(int i = 0; i < manager.mapAdjustments.GetSize(); i++)
				mapAdjustments.Add(manager.mapAdjustments.GetKeyAt(i), manager.mapAdjustments.GetValueAt(i));
			mapGuides.RemoveAll();
			for(int i = 0; i < manager.mapGuides.GetSize(); i++)
				mapGuides.Add(manager.mapGuides.GetKeyAt(i), manager.mapGuides.GetValueAt(i));

			strAdjustments.RemoveAll();
			for(int i = 0; i < manager.strAdjustments.GetSize(); i++)
				strAdjustments.Add(manager.strAdjustments[i]);
			strGuides.RemoveAll();
			for(int i = 0; i < manager.strGuides.GetSize(); i++)
				strGuides.Add(manager.strGuides[i]);

			Adjustments->RemoveAll();
			for(int i = 0; i < manager.Adjustments->GetSize(); i++)
				Adjustments->Add((*manager.Adjustments)[i]);
			Guides->RemoveAll();
			for(int i = 0; i < manager.Guides->GetSize(); i++)
				Guides->Add((*manager.Guides)[i]);

			return *this;
		}

		void AddAdjustment(const CString& name, const CString& fmla)
		{
			long num = mapAdjustments.FindKey(name);
			if(num >= 0)
			{
				strAdjustments[mapAdjustments.GetValueAt(num)].FromString(fmla);
				(*Adjustments)[mapAdjustments.GetValueAt(num)] = NonDefResult;
				return;
			}
			CFormula formula( strAdjustments.GetSize() + 1);
			formula.FromString(fmla);
			strAdjustments.Add(formula);
			Adjustments->Add(NonDefResult);
			mapAdjustments.Add(name, strAdjustments.GetSize() - 1);
		}

		void AddGuide(const CString& name, const CString& fmla)
		{
			long num = mapGuides.FindKey(name);
			if(num >= 0)
			{
				strGuides[mapGuides.GetValueAt(num)].FromString(fmla);
				(*Guides)[mapGuides.GetValueAt(num)] = dNonDefResult;
				return;
			}
			CFormula formula( -strGuides.GetSize() - 1);
			formula.FromString(fmla);
			strGuides.Add(formula);
			Guides->Add(dNonDefResult);
			mapGuides.Add(name, strGuides.GetSize() - 1);
		}

		double GetValue(CString str)
		{
			if(str == _T("w")) return m_lShapeWidth;
			if(str == _T("h")) return m_lShapeHeight;

			long numGuide = mapGuides.FindKey(str);
			long numAdj = mapAdjustments.FindKey(str);
			if(numGuide >= 0)
			{
				double res = (*Guides)[mapGuides.GetValueAt(numGuide)];
				if(res < dNonDefResult)
					return res;
				return strGuides[mapGuides.GetValueAt(numGuide)].Calculate(*this);
			}
			if(numAdj >= 0)
			{
				long res = (*Adjustments)[mapAdjustments.GetValueAt(numAdj)];
				if(res != NonDefResult)
					return res;
				return strAdjustments[mapAdjustments.GetValueAt(numAdj)].Calculate(*this);
			}
			return XmlUtils::GetInteger(str);
		}

		void Clear()
		{
			
			
			for(long i = 0; i < Guides->GetSize(); i++)
				(*Guides)[i] = dNonDefResult;
		}

		void ReCalculateGuides()
		{
			Clear();
			for(long i = 0; i < strGuides.GetSize(); i++)
				(*Guides)[i] = strGuides[i].Calculate(*this);
		}
	};
}
