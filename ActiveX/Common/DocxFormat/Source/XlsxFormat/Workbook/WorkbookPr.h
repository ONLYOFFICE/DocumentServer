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
#ifndef OOX_WORKBOOKPR_FILE_INCLUDE_H_
#define OOX_WORKBOOKPR_FILE_INCLUDE_H_

#include "../CommonInclude.h"


namespace OOX
{
	namespace Spreadsheet
	{
		
		
		class CWorkbookPr : public WritingElement
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CWorkbookPr)
			CWorkbookPr()
			{
			}
			virtual ~CWorkbookPr()
			{
			}

		public:
			virtual CString      toXML() const
			{
				return _T("");
			}
			virtual void toXML(CStringWriter& writer) const
			{
				writer.WriteStringC(_T("<workbookPr"));
				if(m_oDefaultThemeVersion.IsInit())
				{
					CString sVal;sVal.Format(_T(" defaultThemeVersion=\"%d\""), m_oDefaultThemeVersion->GetValue());
					writer.WriteStringC(sVal);
				}
				if(m_oDate1904.IsInit())
				{
					CString sVal;sVal.Format(_T(" date1904=\"%s\""), m_oDate1904->ToString2(SimpleTypes::onofftostring1));
					writer.WriteStringC(sVal);
				}
				if(m_oDateCompatibility.IsInit())
				{
					CString sVal;sVal.Format(_T(" dateCompatibility=\"%s\""), m_oDateCompatibility->ToString2(SimpleTypes::onofftostring1));
					writer.WriteStringC(sVal);
				}
				writer.WriteStringC(_T("/>"));
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}

			virtual EElementType getType () const
			{
				return et_WorkbookPr;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )

					WritingElement_ReadAttributes_Read_if     ( oReader, _T("allowRefreshQuery"),      m_oAllowRefreshQuery )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("autoCompressPictures"),      m_oAutoCompressPictures )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("backupFile"),      m_oBackupFile )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("checkCompatibility"),      m_oCheckCompatibility )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("codeName"),      m_oCodeName )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("date1904"),      m_oDate1904 )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("dateCompatibility"),      m_oDateCompatibility )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("defaultThemeVersion"),      m_oDefaultThemeVersion )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("filterPrivacy"),      m_oFilterPrivacy )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("hidePivotFieldList"),      m_oHidePivotFieldList )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("promptedSolutions"),      m_oPromptedSolutions )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("publishItems"),      m_oPublishItems )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("refreshAllConnections"),      m_oRefreshAllConnections )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("showBorderUnselectedTables"),      m_oShowBorderUnselectedTables )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("showInkAnnotation"),      m_oShowInkAnnotation )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("showObjects"),      m_oShowObjects )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("showPivotChartFilter"),      m_oShowPivotChartFilter )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("updateLinks"),      m_oUpdateLinks )

					WritingElement_ReadAttributes_End( oReader )
			}

		public:
				nullable<SimpleTypes::COnOff<>>						m_oAllowRefreshQuery;
				nullable<SimpleTypes::COnOff<>>						m_oAutoCompressPictures;
				nullable<SimpleTypes::COnOff<>>						m_oBackupFile;
				nullable<SimpleTypes::COnOff<>>						m_oCheckCompatibility;
				nullable<SimpleTypes::COnOff<>>						m_oCodeName;
				nullable<SimpleTypes::COnOff<>>						m_oDate1904;
				nullable<SimpleTypes::COnOff<>>						m_oDateCompatibility;
				nullable<SimpleTypes::CUnsignedDecimalNumber<>>		m_oDefaultThemeVersion;
				nullable<SimpleTypes::COnOff<>>						m_oFilterPrivacy;
				nullable<SimpleTypes::COnOff<>>						m_oHidePivotFieldList;
				nullable<SimpleTypes::COnOff<>>						m_oPromptedSolutions;
				nullable<SimpleTypes::COnOff<>>						m_oPublishItems;
				nullable<SimpleTypes::COnOff<>>						m_oRefreshAllConnections;
				nullable<SimpleTypes::COnOff<>>						m_oShowBorderUnselectedTables;
				nullable<SimpleTypes::COnOff<>>						m_oShowInkAnnotation;
				nullable<SimpleTypes::COnOff<>>						m_oShowObjects;
				nullable<SimpleTypes::COnOff<>>						m_oShowPivotChartFilter;
				nullable<SimpleTypes::Spreadsheet::CUpdateLinksType<>>						m_oUpdateLinks;
		};

	} 
} 

#endif // OOX_WORKBOOKPR_FILE_INCLUDE_H_