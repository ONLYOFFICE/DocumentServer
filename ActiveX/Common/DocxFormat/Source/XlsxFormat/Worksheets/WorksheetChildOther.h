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
#ifndef OOX_WORKSHEETCHILDSOTHER_FILE_INCLUDE_H_
#define OOX_WORKSHEETCHILDSOTHER_FILE_INCLUDE_H_

#include "../CommonInclude.h"

namespace OOX
{
	namespace Spreadsheet
	{
		class CPageMargins : public WritingElement
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CPageMargins)
			CPageMargins()
			{
			}
			virtual ~CPageMargins()
			{
			}

		public:
			virtual CString      toXML() const
			{
				return _T("");
			}
			virtual void toXML(CStringWriter& writer) const
			{
				if(m_oLeft.IsInit() || m_oTop.IsInit() || m_oRight.IsInit() || m_oBottom.IsInit() || m_oHeader.IsInit() || m_oFooter.IsInit())
				{
					writer.WriteStringC(CString(_T("<pageMargins")));
					if(m_oLeft.IsInit())
					{
						CString sLeft;
						sLeft.Format(_T(" left=\"%s\""), SpreadsheetCommon::WriteDouble(m_oLeft->ToInches()));
						writer.WriteStringC(sLeft);
					}
					if(m_oRight.IsInit())
					{
						CString sRight;
						sRight.Format(_T(" right=\"%s\""), SpreadsheetCommon::WriteDouble(m_oRight->ToInches()));
						writer.WriteStringC(sRight);
					}
					if(m_oTop.IsInit())
					{
						CString sTop;
						sTop.Format(_T(" top=\"%s\""), SpreadsheetCommon::WriteDouble(m_oTop->ToInches()));
						writer.WriteStringC(sTop);
					}
					if(m_oBottom.IsInit())
					{
						CString sBottom;
						sBottom.Format(_T(" bottom=\"%s\""), SpreadsheetCommon::WriteDouble(m_oBottom->ToInches()));
						writer.WriteStringC(sBottom);
					}
					if(m_oHeader.IsInit())
					{
						CString sHeader;
						sHeader.Format(_T(" header=\"%s\""), SpreadsheetCommon::WriteDouble(m_oHeader->ToInches()));
						writer.WriteStringC(sHeader);
					}
					if(m_oFooter.IsInit())
					{
						CString sFooter;
						sFooter.Format(_T(" footer=\"%s\""), SpreadsheetCommon::WriteDouble(m_oFooter->ToInches()));
						writer.WriteStringC(sFooter);
					}
					writer.WriteStringC(CString(_T("/>")));
				}
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}

			virtual EElementType getType () const
			{
				return et_PageMargins;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )

					WritingElement_ReadAttributes_Read_if     ( oReader, _T("left"),      m_oLeft)
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("top"),      m_oTop)
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("right"),      m_oRight)
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("bottom"),      m_oBottom)
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("header"),      m_oHeader)
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("footer"),      m_oFooter)

					WritingElement_ReadAttributes_End( oReader )
			}

		public:
			nullable<SimpleTypes::CInch>	m_oLeft;
			nullable<SimpleTypes::CInch>	m_oTop;
			nullable<SimpleTypes::CInch>	m_oRight;
			nullable<SimpleTypes::CInch>	m_oBottom;
			nullable<SimpleTypes::CInch>	m_oHeader;
			nullable<SimpleTypes::CInch>	m_oFooter;
		};
		class CPageSetup : public WritingElement
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CPageSetup)
			CPageSetup()
			{
			}
			virtual ~CPageSetup()
			{
			}

		public:
			virtual CString      toXML() const
			{
				return _T("");
			}
			virtual void toXML(CStringWriter& writer) const
			{
				if(m_oPaperSize.IsInit() || m_oOrientation.IsInit())
				{
					writer.WriteStringC(CString(_T("<pageSetup")));
					if(m_oPaperSize.IsInit())
					{
						CString sPaperSize;
						sPaperSize.Format(_T(" paperSize=\"%s\""), m_oPaperSize->ToString());
						writer.WriteStringC(sPaperSize);
					}
					if(m_oOrientation.IsInit())
					{
						CString sOrientation;
						sOrientation.Format(_T(" orientation=\"%s\""), m_oOrientation->ToString());
						writer.WriteStringC(sOrientation);
					}
					writer.WriteStringC(CString(_T("/>")));
				}
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}

			virtual EElementType getType () const
			{
				return et_PageSetup;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )

					WritingElement_ReadAttributes_Read_if     ( oReader, _T("orientation"),      m_oOrientation)
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("paperSize"),      m_oPaperSize)

					WritingElement_ReadAttributes_End( oReader )
			}

		public:
			nullable<SimpleTypes::CPageOrientation<>>	m_oOrientation;
			nullable<SimpleTypes::Spreadsheet::CPageSize<>>	m_oPaperSize;
		};
		class CPrintOptions : public WritingElement
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CPrintOptions)
			CPrintOptions()
			{
			}
			virtual ~CPrintOptions()
			{
			}

		public:
			virtual CString      toXML() const
			{
				return _T("");
			}
			virtual void toXML(CStringWriter& writer) const
			{
				if(m_oGridLines.IsInit() || m_oGridLinesSet.IsInit() || m_oHeadings.IsInit())
				{
					writer.WriteStringC(CString(_T("<printOptions")));
					if(m_oHeadings.IsInit())
					{
						CString sHeadings;
						sHeadings.Format(_T(" headings=\"%s\""), m_oHeadings->ToString2(SimpleTypes::onofftostring1));
						writer.WriteStringC(sHeadings);
					}
					if(m_oGridLines.IsInit())
					{
						CString sGridLines;
						sGridLines.Format(_T(" gridLines=\"%s\""), m_oGridLines->ToString2(SimpleTypes::onofftostring1));
						writer.WriteStringC(sGridLines);
					}
					if(m_oGridLinesSet.IsInit())
					{
						CString sGridLinesSet;
						sGridLinesSet.Format(_T(" gridLinesSet=\"%s\""), m_oGridLinesSet->ToString2(SimpleTypes::onofftostring1));
						writer.WriteStringC(sGridLinesSet);
					}
					writer.WriteStringC(CString(_T("/>")));
				}
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}

			virtual EElementType getType () const
			{
				return et_PrintOptions;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )

					WritingElement_ReadAttributes_Read_if     ( oReader, _T("gridLines"),      m_oGridLines)
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("gridLinesSet"),      m_oGridLinesSet)
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("headings"),      m_oHeadings)
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("horizontalCentered"),      m_oHorizontalCentered)
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("verticalCentered"),      m_oVerticalCentered)

					WritingElement_ReadAttributes_End( oReader )
			}

		public:
			nullable<SimpleTypes::COnOff<>>	m_oGridLines;
			nullable<SimpleTypes::COnOff<>>	m_oGridLinesSet;
			nullable<SimpleTypes::COnOff<>>	m_oHeadings;
			nullable<SimpleTypes::COnOff<>>	m_oHorizontalCentered;
			nullable<SimpleTypes::COnOff<>>	m_oVerticalCentered;
		};
		class CDimension : public WritingElement
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CDimension)
			CDimension()
			{
			}
			virtual ~CDimension()
			{
			}

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

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}

			virtual EElementType getType () const
			{
				return et_Dimension;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )

					WritingElement_ReadAttributes_Read_if     ( oReader, _T("ref"),      m_oRef)

					WritingElement_ReadAttributes_End( oReader )
			}

		public:
				nullable<CString>	m_oRef;
		};

		class CSheetFormatPr : public WritingElement
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CSheetFormatPr)
			CSheetFormatPr()
			{
			}
			virtual ~CSheetFormatPr()
			{
			}

		public:
			virtual CString      toXML() const
			{
				return _T("");
			}
			virtual void toXML(CStringWriter& writer) const
			{
				writer.WriteStringC(_T("<sheetFormatPr"));
				if(m_oBaseColWidth.IsInit())
				{
					CString sVal; sVal.Format(_T(" baseColWidth=\"%d\""), m_oBaseColWidth->GetValue());
					writer.WriteStringC(sVal);
				}
				if(m_oCustomHeight.IsInit())
				{
					CString sVal; sVal.Format(_T(" customHeight=\"%s\""), m_oCustomHeight->ToString2(SimpleTypes::onofftostring1));
					writer.WriteStringC(sVal);
				}
				if(m_oDefaultColWidth.IsInit())
				{
					CString sVal; sVal.Format(_T(" defaultColWidth=\"%s\""), SpreadsheetCommon::WriteDouble(m_oDefaultColWidth->GetValue()));
					writer.WriteStringC(sVal);
				}
				if(m_oDefaultRowHeight.IsInit())
				{
					CString sVal; sVal.Format(_T(" defaultRowHeight=\"%s\""), SpreadsheetCommon::WriteDouble(m_oDefaultRowHeight->GetValue()));
					writer.WriteStringC(sVal);
				}
				if(m_oOutlineLevelCol.IsInit())
				{
					CString sVal; sVal.Format(_T(" outlineLevelCol=\"%d\""), m_oOutlineLevelCol->GetValue());
					writer.WriteStringC(sVal);
				}
				if(m_oOutlineLevelRow.IsInit())
				{
					CString sVal; sVal.Format(_T(" outlineLevelRow=\"%d\""), m_oOutlineLevelRow->GetValue());
					writer.WriteStringC(sVal);
				}
				if(m_oThickBottom.IsInit())
				{
					CString sVal; sVal.Format(_T(" thickBottom=\"%s\""), m_oThickBottom->ToString2(SimpleTypes::onofftostring1));
					writer.WriteStringC(sVal);
				}
				if(m_oThickTop.IsInit())
				{
					CString sVal; sVal.Format(_T(" thickTop=\"%s\""), m_oThickTop->ToString2(SimpleTypes::onofftostring1));
					writer.WriteStringC(sVal);
				}
				if(m_oZeroHeight.IsInit())
				{
					CString sVal; sVal.Format(_T(" zeroHeight=\"%s\""), m_oZeroHeight->ToString2(SimpleTypes::onofftostring1));
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
				return et_SheetFormatPr;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )

					WritingElement_ReadAttributes_Read_if     ( oReader, _T("baseColWidth"),      m_oBaseColWidth)	
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("customHeight"),      m_oCustomHeight )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("defaultColWidth"),      m_oDefaultColWidth )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("defaultRowHeight"),      m_oDefaultRowHeight )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("outlineLevelCol"),      m_oOutlineLevelCol )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("outlineLevelRow"),      m_oOutlineLevelRow )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("thickBottom"),      m_oThickBottom )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("thickTop"),      m_oThickTop )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("zeroHeight"),      m_oZeroHeight )

					WritingElement_ReadAttributes_End( oReader )
			}

		public:
				nullable<SimpleTypes::CUnsignedDecimalNumber<>>	m_oBaseColWidth;
				nullable<SimpleTypes::COnOff<>>					m_oCustomHeight;
				nullable<SimpleTypes::CDouble>					m_oDefaultColWidth;
				nullable<SimpleTypes::CDouble>					m_oDefaultRowHeight;
				nullable<SimpleTypes::CUnsignedDecimalNumber<>>	m_oOutlineLevelCol;
				nullable<SimpleTypes::CUnsignedDecimalNumber<>>	m_oOutlineLevelRow;
				nullable<SimpleTypes::COnOff<>>					m_oThickBottom;
				nullable<SimpleTypes::COnOff<>>					m_oThickTop;
				nullable<SimpleTypes::COnOff<>>					m_oZeroHeight;
		};

		class CPane : public WritingElement
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CPane)
			CPane()
			{
			}
			virtual ~CPane()
			{
			}

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

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}

			virtual EElementType getType () const
			{
				return et_Pane;
			}

		private:
			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )

				WritingElement_ReadAttributes_Read_if     ( oReader, _T("activePane")	, m_oActivePane)
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("state")		, m_oState)
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("topLeftCell")	, m_oTopLeftCell)
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("xSplit")		, m_oXSplit)
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("ySplit")		, m_oYSplit)	

				WritingElement_ReadAttributes_End( oReader )
			}

		public:
			nullable<CString>				m_oActivePane;
			nullable<CString>				m_oState;	
			nullable<CString>				m_oTopLeftCell;
			nullable<SimpleTypes::CDouble>	m_oXSplit;
			nullable<SimpleTypes::CDouble>	m_oYSplit;
		};

		
		
		
		
		class CSheetView : public WritingElement
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CSheetView)
			CSheetView()
			{
			}
			virtual ~CSheetView()
			{
			}

		public:
			virtual CString      toXML() const
			{
				return _T("");
			}
			virtual void toXML(CStringWriter& writer) const
			{
				writer.WriteStringC(_T("<sheetView"));
				if(m_oColorId.IsInit())
				{
					CString sVal; sVal.Format(_T(" colorId=\"%d\""), m_oColorId->GetValue());
					writer.WriteStringC(sVal);
				}
				if(m_oDefaultGridColor.IsInit())
				{
					CString sVal; sVal.Format(_T(" defaultGridColor=\"%s\""), m_oDefaultGridColor->ToString2(SimpleTypes::onofftostring1));
					writer.WriteStringC(sVal);
				}
				if(m_oRightToLeft.IsInit())
				{
					CString sVal; sVal.Format(_T(" rightToLeft=\"%s\""), m_oRightToLeft->ToString2(SimpleTypes::onofftostring1));
					writer.WriteStringC(sVal);
				}
				if(m_oShowFormulas.IsInit())
				{
					CString sVal; sVal.Format(_T(" showFormulas=\"%s\""), m_oShowFormulas->ToString2(SimpleTypes::onofftostring1));
					writer.WriteStringC(sVal);
				}
				if(m_oShowGridLines.IsInit())
				{
					CString sVal; sVal.Format(_T(" showGridLines=\"%s\""), m_oShowGridLines->ToString2(SimpleTypes::onofftostring1));
					writer.WriteStringC(sVal);
				}
				if(m_oShowOutlineSymbols.IsInit())
				{
					CString sVal; sVal.Format(_T(" showOutlineSymbols=\"%s\""), m_oShowOutlineSymbols->ToString2(SimpleTypes::onofftostring1));
					writer.WriteStringC(sVal);
				}
				if(m_oShowRowColHeaders.IsInit())
				{
					CString sVal; sVal.Format(_T(" showRowColHeaders=\"%s\""), m_oShowRowColHeaders->ToString2(SimpleTypes::onofftostring1));
					writer.WriteStringC(sVal);
				}
				if(m_oShowRuler.IsInit())
				{
					CString sVal; sVal.Format(_T(" showRuler=\"%s\""), m_oShowRuler->ToString2(SimpleTypes::onofftostring1));
					writer.WriteStringC(sVal);
				}
				if(m_oShowWhiteSpace.IsInit())
				{
					CString sVal; sVal.Format(_T(" showWhiteSpace=\"%s\""), m_oShowWhiteSpace->ToString2(SimpleTypes::onofftostring1));
					writer.WriteStringC(sVal);
				}
				if(m_oShowZeros.IsInit())
				{
					CString sVal; sVal.Format(_T(" showZeros=\"%s\""), m_oShowZeros->ToString2(SimpleTypes::onofftostring1));
					writer.WriteStringC(sVal);
				}
				if(m_oWabSelected.IsInit())
				{
					CString sVal; sVal.Format(_T(" tabSelected=\"%s\""), m_oWabSelected->ToString2(SimpleTypes::onofftostring1));
					writer.WriteStringC(sVal);
				}
				if(m_oTopLeftCell.IsInit())
				{
					CString sVal; sVal.Format(_T(" topLeftCell=\"%s\""), m_oTopLeftCell.get());
					writer.WriteStringC(sVal);
				}
				if(m_oView.IsInit())
				{
					CString sVal; sVal.Format(_T(" view=\"%s\""), m_oView->ToString());
					writer.WriteStringC(sVal);
				}
				if(m_oWindowProtection.IsInit())
				{
					CString sVal; sVal.Format(_T(" windowProtection=\"%s\""), m_oWindowProtection->ToString2(SimpleTypes::onofftostring1));
					writer.WriteStringC(sVal);
				}
				if(m_oWorkbookViewId.IsInit())
				{
					CString sVal; sVal.Format(_T(" workbookViewId=\"%d\""), m_oWorkbookViewId->GetValue());
					writer.WriteStringC(sVal);
				}
				if(m_oZoomScale.IsInit())
				{
					CString sVal; sVal.Format(_T(" zoomScale=\"%d\""), m_oZoomScale->GetValue());
					writer.WriteStringC(sVal);
				}
				if(m_oZoomScaleNormal.IsInit())
				{
					CString sVal; sVal.Format(_T(" zoomScaleNormal=\"%d\""), m_oZoomScaleNormal->GetValue());
					writer.WriteStringC(sVal);
				}
				if(m_oZoomScalePageLayoutView.IsInit())
				{
					CString sVal; sVal.Format(_T(" zoomScalePageLayoutView=\"%d\""), m_oZoomScalePageLayoutView->GetValue());
					writer.WriteStringC(sVal);
				}
				if(m_oZoomScaleSheetLayoutView.IsInit())
				{
					CString sVal; sVal.Format(_T(" zoomScaleSheetLayoutView=\"%d\""), m_oZoomScaleSheetLayoutView->GetValue());
					writer.WriteStringC(sVal);
				}
				writer.WriteStringC(_T("/>"));
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if (oReader.IsEmptyNode())
					return;

				int nCurDepth = oReader.GetDepth();
				while (oReader.ReadNextSiblingNode(nCurDepth))
				{
					CWCharWrapper sName = oReader.GetName();

					if (_T("pane") == sName)
						m_oPane = oReader;
				}
			}

			virtual EElementType getType () const
			{
				return et_SheetView;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )

					WritingElement_ReadAttributes_Read_if     ( oReader, _T("colorId"),      m_oColorId)
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("defaultGridColor"),      m_oDefaultGridColor)
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("rightToLeft"),      m_oRightToLeft)
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("showFormulas"),      m_oShowFormulas)
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("showGridLines"),      m_oShowGridLines)
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("showOutlineSymbols"),      m_oShowOutlineSymbols)
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("showRowColHeaders"),      m_oShowRowColHeaders)
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("showRuler"),      m_oShowRuler)
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("showWhiteSpace"),      m_oShowWhiteSpace)
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("showZeros"),      m_oShowZeros)
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("tabSelected"),      m_oWabSelected)
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("topLeftCell"),      m_oTopLeftCell)
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("view"),      m_oView)
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("windowProtection"),      m_oWindowProtection)
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("workbookViewId"),      m_oWorkbookViewId)
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("zoomScale"),      m_oZoomScale)
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("zoomScaleNormal"),      m_oZoomScaleNormal)
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("zoomScalePageLayoutView"),      m_oZoomScalePageLayoutView)
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("zoomScaleSheetLayoutView"),      m_oZoomScaleSheetLayoutView)		

					WritingElement_ReadAttributes_End( oReader )
			}

		public:
				nullable<CPane>										m_oPane;

				nullable<SimpleTypes::CUnsignedDecimalNumber<>>		m_oColorId;
				nullable<SimpleTypes::COnOff<>>						m_oDefaultGridColor;
				nullable<SimpleTypes::COnOff<>>						m_oRightToLeft;
				nullable<SimpleTypes::COnOff<>>						m_oShowFormulas;
				nullable<SimpleTypes::COnOff<>>						m_oShowGridLines;
				nullable<SimpleTypes::COnOff<>>						m_oShowOutlineSymbols;
				nullable<SimpleTypes::COnOff<>>						m_oShowRowColHeaders;
				nullable<SimpleTypes::COnOff<>>						m_oShowRuler;
				nullable<SimpleTypes::COnOff<>>						m_oShowWhiteSpace;
				nullable<SimpleTypes::COnOff<>>						m_oShowZeros;
				nullable<SimpleTypes::COnOff<>>						m_oWabSelected;
				nullable<CString>									m_oTopLeftCell;
				nullable<SimpleTypes::Spreadsheet::CSheetViewType<>>m_oView;
				nullable<SimpleTypes::COnOff<>>						m_oWindowProtection;
				nullable<SimpleTypes::CUnsignedDecimalNumber<>>		m_oWorkbookViewId;
				nullable<SimpleTypes::CUnsignedDecimalNumber<>>		m_oZoomScale;
				nullable<SimpleTypes::CUnsignedDecimalNumber<>>		m_oZoomScaleNormal;
				nullable<SimpleTypes::CUnsignedDecimalNumber<>>		m_oZoomScalePageLayoutView;
				nullable<SimpleTypes::CUnsignedDecimalNumber<>>		m_oZoomScaleSheetLayoutView;
		};

		class CSheetViews : public WritingElementWithChilds<CSheetView>
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CSheetViews)
			CSheetViews()
			{
			}
			virtual ~CSheetViews()
			{
			}

		public:
			virtual CString      toXML() const
			{
				return _T("");
			}
			virtual void toXML(CStringWriter& writer) const
			{
				if(m_arrItems.GetSize() > 0)
				{
					writer.WriteStringC(_T("<sheetViews>"));
					for(int i = 0, length = m_arrItems.GetSize();  i< length; ++i)
						m_arrItems[i]->toXML(writer);
					writer.WriteStringC(_T("</sheetViews>"));
				}
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

					if ( _T("sheetView") == sName )
						m_arrItems.Add( new CSheetView( oReader ));
				}
			}

			virtual EElementType getType () const
			{
				return et_SheetViews;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
			}

		public:
		};

		class CSheetPr : public WritingElement
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CSheetPr)
			CSheetPr()
			{
			}
			virtual ~CSheetPr()
			{
			}

		public:
			virtual CString      toXML() const
			{
				return _T("");
			}
			virtual void toXML(CStringWriter& writer) const
			{
				if (m_oTabColor.IsInit())
				{
					writer.WriteStringC(_T("<sheetPr>"));
					m_oTabColor->toXML2(writer, _T("tabColor"));
					writer.WriteStringC(_T("</sheetPr>"));
				}
			}
			virtual void fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( oReader.IsEmptyNode() )
					return;

				int nCurDepth = oReader.GetDepth();
				while( oReader.ReadNextSiblingNode( nCurDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();

					if ( _T("tabColor") == sName )
						m_oTabColor = oReader;
					
					
					
				}
			}
			virtual EElementType getType () const
			{
				return et_SheetPr;
			}

		private:
			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if		( oReader, _T("codeName"),							m_oCodeName )
				WritingElement_ReadAttributes_Read_else_if	( oReader, _T("enableFormatConditionsCalculation"),	m_oEnableFormatConditionsCalculation )
				WritingElement_ReadAttributes_Read_else_if	( oReader, _T("filterMode"),						m_oFilterMode )
				WritingElement_ReadAttributes_Read_else_if	( oReader, _T("published"),							m_oPublished )
				WritingElement_ReadAttributes_Read_else_if	( oReader, _T("syncHorizontal"),					m_oSyncHorizontal )
				WritingElement_ReadAttributes_Read_else_if	( oReader, _T("syncRef"),							m_oSyncRef )
				WritingElement_ReadAttributes_Read_else_if	( oReader, _T("syncVertical"),						m_oSyncVertical )
				WritingElement_ReadAttributes_Read_else_if	( oReader, _T("transitionEntry"),					m_oTransitionEntry )
				WritingElement_ReadAttributes_Read_else_if	( oReader, _T("transitionEvaluation"),				m_oTransitionEvaluation )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:
			nullable<CColor>					m_oTabColor;

			nullable<CString>					m_oCodeName;
			nullable<SimpleTypes::COnOff<>>		m_oEnableFormatConditionsCalculation;
			nullable<SimpleTypes::COnOff<>>		m_oFilterMode;
			nullable<SimpleTypes::COnOff<>>		m_oPublished;
			nullable<SimpleTypes::COnOff<>>		m_oSyncHorizontal;
			nullable<CString>					m_oSyncRef;
			nullable<SimpleTypes::COnOff<>>		m_oSyncVertical;
			nullable<SimpleTypes::COnOff<>>		m_oTransitionEntry;
			nullable<SimpleTypes::COnOff<>>		m_oTransitionEvaluation;
		};

	} 
} 

#endif // OOX_WORKSHEETCHILDSOTHER_FILE_INCLUDE_H_