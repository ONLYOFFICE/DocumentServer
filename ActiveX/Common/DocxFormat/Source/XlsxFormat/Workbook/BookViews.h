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
#ifndef OOX_BOOKVIEWS_FILE_INCLUDE_H_
#define OOX_BOOKVIEWS_FILE_INCLUDE_H_

#include "../CommonInclude.h"


namespace OOX
{
	namespace Spreadsheet
	{
		
		
		class CWorkbookView : public WritingElement
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CWorkbookView)
			CWorkbookView()
			{
			}
			virtual ~CWorkbookView()
			{
			}

		public:
			virtual CString      toXML() const
			{
				return _T("");
			}
			virtual void toXML(CStringWriter& writer) const
			{
				writer.WriteStringC(_T("<workbookView"));
				if(m_oXWindow.IsInit())
				{
					CString sVal;sVal.Format(_T(" xWindow=\"%d\""), m_oXWindow->GetValue());
					writer.WriteStringC(sVal);
				}
				if(m_oYWindow.IsInit())
				{
					CString sVal;sVal.Format(_T(" yWindow=\"%d\""), m_oYWindow->GetValue());
					writer.WriteStringC(sVal);
				}
				if(m_oWindowWidth.IsInit())
				{
					CString sVal;sVal.Format(_T(" windowWidth=\"%d\""), m_oWindowWidth->GetValue());
					writer.WriteStringC(sVal);
				}
				if(m_oWindowHeight.IsInit())
				{
					CString sVal;sVal.Format(_T(" windowHeight=\"%d\""), m_oWindowHeight->GetValue());
					writer.WriteStringC(sVal);
				}
				if(m_oActiveTab.IsInit())
				{
					CString sVal;sVal.Format(_T(" activeTab=\"%d\""), m_oActiveTab->GetValue());
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
				return et_WorkbookView;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )

					WritingElement_ReadAttributes_Read_if     ( oReader, _T("activeTab"),      m_oActiveTab )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("autoFilterDateGrouping"),      m_oAutoFilterDateGrouping )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("firstSheet"),      m_oFirstSheet )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("minimized"),      m_oMinimized )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("showHorizontalScroll"),      m_oShowHorizontalScroll )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("showSheetTabs"),      m_oShowSheetTabs )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("showVerticalScroll"),      m_oShowVerticalScroll )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("tabRatio"),      m_oTabRatio )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("visibility"),      m_oVisibility )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("windowHeight"),      m_oWindowHeight )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("windowWidth"),      m_oWindowWidth )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("xWindow"),      m_oXWindow )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("yWindow"),      m_oYWindow )

					WritingElement_ReadAttributes_End( oReader )
			}

		public:
				nullable<SimpleTypes::CUnsignedDecimalNumber<>>		m_oActiveTab;
				nullable<SimpleTypes::COnOff<>>						m_oAutoFilterDateGrouping;
				nullable<SimpleTypes::CUnsignedDecimalNumber<>>		m_oFirstSheet;
				nullable<SimpleTypes::COnOff<>>						m_oMinimized;
				nullable<SimpleTypes::COnOff<>>						m_oShowHorizontalScroll;
				nullable<SimpleTypes::COnOff<>>						m_oShowSheetTabs;
				nullable<SimpleTypes::COnOff<>>						m_oShowVerticalScroll;
				nullable<SimpleTypes::CUnsignedDecimalNumber<>>		m_oTabRatio;
				nullable<SimpleTypes::Spreadsheet::CVisibleType<>>	m_oVisibility;
				nullable<SimpleTypes::CUnsignedDecimalNumber<>>		m_oWindowHeight;
				nullable<SimpleTypes::CUnsignedDecimalNumber<>>		m_oWindowWidth;
				nullable<SimpleTypes::CDecimalNumber<>>				m_oXWindow;
				nullable<SimpleTypes::CDecimalNumber<>>				m_oYWindow;
		};

		class CBookViews : public WritingElementWithChilds<CWorkbookView>
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CBookViews)
			CBookViews()
			{
			}
			virtual ~CBookViews()
			{
			}

		public:
			virtual CString      toXML() const
			{
				return _T("");
			}
			virtual void toXML(CStringWriter& writer) const
			{
				writer.WriteStringC(_T("<bookViews>"));
				for(int i = 0, length = m_arrItems.GetSize(); i < length; ++i)
					m_arrItems[i]->toXML(writer);
				writer.WriteStringC(_T("</bookViews>"));
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

					if ( _T("workbookView") == sName )
						m_arrItems.Add( new CWorkbookView( oReader ));
				}
			}

			virtual EElementType getType () const
			{
				return et_BookViews;
			}
		
		private:
			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
			}
		};
	} 
} 

#endif // OOX_BOOKVIEWS_FILE_INCLUDE_H_