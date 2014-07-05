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

#include "stdafx.h"
#include <math.h>
#include "./../Common.h"
#include "./../../../../../../Common/XmlUtils.h"
#include "Parser.h"

namespace NSGuidesOdp
{
	const double dNonDefResult = 27273042316900;
	const long NonDefResult = 0xFFFFFF;
	const double RadKoef = M_PI/10800000.0;

	class CFormulaManager
	{
	private:
		CSimpleMap<CString, long> mapAdjustments;
		CSimpleMap<CString, long> mapGuides;
		CSimpleArray<CString> strGuides;

	private:
		CSimpleArray<long>* Adjustments;
		CSimpleArray<double>* Guides;

	public:
		CFormulaManager(CSimpleArray<long>& a, CSimpleArray<double>& g)
		{
			Adjustments = &a;
			Guides = &g;

			AddGuide(_T("left"), _T("0"));
			AddGuide(_T("top"), _T("0"));
			AddGuide(_T("right"), _T("21600"));
			AddGuide(_T("bottom"), _T("21600"));
			AddGuide(_T("width"), _T("right - left"));
			AddGuide(_T("height"), _T("bottom - top"));
		}

		~CFormulaManager()
		{
			mapAdjustments.RemoveAll();
			mapGuides.RemoveAll();
			strGuides.RemoveAll();
			Adjustments->RemoveAll();
			Guides->RemoveAll();
		}

		CFormulaManager& operator =(const CFormulaManager& manager)
		{
			mapAdjustments.RemoveAll();
			for(int i = 0; i < manager.mapAdjustments.GetSize(); i++)
				mapAdjustments.Add(manager.mapAdjustments.GetKeyAt(i), manager.mapAdjustments.GetValueAt(i));
			mapGuides.RemoveAll();
			for(int i = 0; i < manager.mapGuides.GetSize(); i++)
				mapGuides.Add(manager.mapGuides.GetKeyAt(i), manager.mapGuides.GetValueAt(i));

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

		void AddAdjustment(const CString& name, const long value)
		{
			long num = mapAdjustments.FindKey(name);
			if(num >= 0)
			{
				(*Adjustments)[mapAdjustments.GetValueAt(num)] = value;
				return;
			}
			Adjustments->Add(value);
			mapAdjustments.Add(name, Adjustments->GetSize() - 1);
		}

		void AddGuide(const CString& name, const CString& fmla)
		{
			long num = mapGuides.FindKey(name);
			if(num >= 0)
			{
				strGuides[mapGuides.GetValueAt(num)] = fmla;
				(*Guides)[mapGuides.GetValueAt(num)] = dNonDefResult;
				return;
			}
			strGuides.Add(fmla);
			Guides->Add(dNonDefResult);
			mapGuides.Add(name, strGuides.GetSize() - 1);
		}

		double GetValue(CString str)
		{
			long numGuide = mapGuides.FindKey(str);
			long numAdj = mapAdjustments.FindKey(str);
			if(numGuide >= 0)
			{
				double res = (*Guides)[mapGuides.GetValueAt(numGuide)];
				if(res < dNonDefResult)
					return res;
				TParser parser;
				parser.Compile(strGuides[mapGuides.GetValueAt(numGuide)], *this);
				parser.Evaluate();
				parser.Decompile();
				(*Guides)[mapGuides.GetValueAt(numGuide)] = parser.GetResult();
				return parser.GetResult();
			}
			if(numAdj >= 0)
			{
				return (*Adjustments)[mapAdjustments.GetValueAt(numAdj)];
			}
			return XmlUtils::GetInteger(CString(str));
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
			{
				TParser parser;
				parser.Compile(strGuides[i], *this);
				parser.Evaluate();
				parser.Decompile();
				(*Guides)[i] = parser.GetResult();
			}
		}
	};
}
