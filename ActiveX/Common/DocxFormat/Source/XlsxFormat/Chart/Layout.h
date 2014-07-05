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
#ifndef OOX_CHARTLAYOUT_FILE_INCLUDE_H_
#define OOX_CHARTLAYOUT_FILE_INCLUDE_H_

#include "../CommonInclude.h"

namespace OOX
{
	namespace Spreadsheet
	{
		class CChartManualLayout : public WritingElement
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CChartManualLayout)
			CChartManualLayout() {}
			virtual ~CChartManualLayout() {}

		public:
			virtual CString      toXML() const
			{
				return _T("");
			}
			virtual void toXML(CStringWriter& writer) const
			{
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( oReader.IsEmptyNode() )
					return;

				int nCurDepth = oReader.GetDepth();
				while( oReader.ReadNextSiblingNode( nCurDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();

					if ( _T("c:h") == sName )
						m_oH = oReader;
					else if ( _T("c:hMode") == sName )
						m_oHMode = oReader;
					else if ( _T("c:layoutTarget") == sName )
						m_oLayoutTarget = oReader;
					else if ( _T("c:w") == sName )
						m_oW = oReader;
					else if ( _T("c:wMode") == sName )
						m_oWMode = oReader;
					else if ( _T("c:x") == sName )
						m_oX = oReader;
					else if ( _T("c:xMode") == sName )
						m_oXMode = oReader;
					else if ( _T("c:y") == sName )
						m_oY = oReader;
					else if ( _T("c:yMode") == sName )
						m_oYMode = oReader;
				}
			}
			virtual EElementType getType() const
			{
				return et_c_ManualLayout;
			}
		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
			}

		public:

			
			nullable<ComplexTypes::Spreadsheet::CDouble> m_oH;
			nullable<ComplexTypes::Spreadsheet::CChartHMode> m_oHMode;
			nullable<ComplexTypes::Spreadsheet::CChartLayoutTarget> m_oLayoutTarget;
			nullable<ComplexTypes::Spreadsheet::CDouble> m_oW;
			nullable<ComplexTypes::Spreadsheet::CChartHMode> m_oWMode;
			nullable<ComplexTypes::Spreadsheet::CDouble> m_oX;
			nullable<ComplexTypes::Spreadsheet::CChartHMode> m_oXMode;
			nullable<ComplexTypes::Spreadsheet::CDouble> m_oY;
			nullable<ComplexTypes::Spreadsheet::CChartHMode> m_oYMode;
		};
		class CChartLayout : public WritingElement
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CChartLayout)
			CChartLayout() {}
			virtual ~CChartLayout() {}

		public:
			virtual CString      toXML() const
			{
				return _T("");
			}
			virtual void toXML(CStringWriter& writer) const
			{
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( oReader.IsEmptyNode() )
					return;

				int nCurDepth = oReader.GetDepth();
				while( oReader.ReadNextSiblingNode( nCurDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();

					if ( _T("c:manualLayout") == sName )
						m_oManualLayout = oReader;
				}
			}
			virtual EElementType getType() const
			{
				return et_c_Layout;
			}
		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
			}

		public:

			
			nullable<CChartManualLayout> m_oManualLayout;
		};
	} 
} 

#endif // OOX_CHARTLAYOUT_FILE_INCLUDE_H_