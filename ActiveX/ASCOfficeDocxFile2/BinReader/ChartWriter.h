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
#include "Common.h"

namespace Writers
{
	class ChartWriter
	{
		class ChartElem
		{
		public:
			CString content;
			CString filename;
			int index;
		};
		CSimpleArray<ChartElem*> m_aCharts;
		CString m_sDir;
		ContentTypesWriter& m_oContentTypesWriter;
		int nChartCount;
	public:
		ChartWriter(CString sDir, ContentTypesWriter& oContentTypesWriter):m_sDir(sDir),m_oContentTypesWriter(oContentTypesWriter)
		{
			nChartCount = 0;
		}
		~ChartWriter()
		{
			for(int i = 0, length = m_aCharts.GetSize(); i < length; ++i)
			{
				delete m_aCharts[i];
			}
		}
		bool IsEmpty()
		{
			return 0 == m_aCharts.GetSize();
		}
		void Write()
		{
			if(false == IsEmpty())
			{
				CString sChartDir = m_sDir + _T("/word/charts");
				CreateDirectory(sChartDir, NULL);
				for(int i = 0, length = m_aCharts.GetSize(); i < length; ++i)
				{
					ChartElem* elem = m_aCharts[i];
					CString sRelPath = _T("/word/charts/") + elem->filename;
					CString sAbsPath = m_sDir + sRelPath;

					CFile oFile;
					oFile.CreateFile(sAbsPath);
					oFile.WriteStringUTF8(elem->content);
					oFile.CloseFile();

					
					m_oContentTypesWriter.AddOverride(sRelPath, CString(_T("application/vnd.openxmlformats-officedocument.drawingml.chart+xml")));
				}
			}
		}
		void AddChart(CString& content, CString& sRelsName, int& index)
		{
			ChartElem* pChartElem = new ChartElem();
			pChartElem->content = content;
			pChartElem->index = nChartCount + 1;
			nChartCount++;
			pChartElem->filename.Format(_T("chart%d.xml"), pChartElem->index);
			sRelsName = _T("charts/") + pChartElem->filename;
			index = pChartElem->index;

			m_aCharts.Add(pChartElem);
		}
		int getChartCount()
		{
			return nChartCount;
		}
		void setChartCount(int val)
		{
			nChartCount = val;
		}
	};
}