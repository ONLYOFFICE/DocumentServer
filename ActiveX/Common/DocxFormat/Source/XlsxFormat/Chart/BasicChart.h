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
#ifndef OOX_BASICCHART_FILE_INCLUDE_H_
#define OOX_BASICCHART_FILE_INCLUDE_H_

#include "../CommonInclude.h"

#include "../../DocxFormat/Drawing/DrawingEffects.h"

namespace OOX
{
	namespace Spreadsheet
	{

		class CChartSeriesNumCachePoint : public WritingElement
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CChartSeriesNumCachePoint)
			CChartSeriesNumCachePoint() {}
			virtual ~CChartSeriesNumCachePoint() {}

		public:
			virtual CString      toXML() const
			{
				return _T("");
			}
			virtual void toXML(CStringWriter& writer) const
			{
				writer.WriteStringC(CString(_T("<c:pt")));
				if(m_oIndex.IsInit())
				{
					CString sIndex;sIndex.Format(_T(" idx=\"%d\""), m_oIndex->GetValue());
					writer.WriteStringC(sIndex);
				}
				writer.WriteStringC(CString(_T(">")));
				if(m_oValue.IsInit())
				{
					CString sValue;sValue.Format(_T("<c:v>%s</c:v>"), m_oValue->ToString());
					writer.WriteStringC(sValue);
				}
				writer.WriteStringC(CString(_T("</c:pt>")));
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

					if ( _T("c:v") == sName )
						m_oValue = oReader;
				}
			}
			virtual EElementType getType() const
			{
				return et_c_NumPoint;
			}
			bool isNumCache()
			{
				bool bRes = true;
				if(m_oValue.IsInit())
				{
					int nVal = _wtoi(m_oValue->m_sText);
					if(0 == nVal && !(m_oValue->m_sText.GetLength() > 0 && '0' == m_oValue->m_sText[0]))
						bRes = false;
				}
				return bRes;
			}
			void setForceCache(bool bStr)
			{
				m_oValue.Init();
				m_oValue->m_sText.Append(_T("0"));
			}
		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )

					WritingElement_ReadAttributes_Read_if     ( oReader, _T("idx"),      m_oIndex )

					WritingElement_ReadAttributes_End( oReader )
			}

		public:
			nullable<SimpleTypes::CUnsignedDecimalNumber<>> m_oIndex;
			nullable<CText> m_oValue;
		};
		class CChartSeriesNumCache : public WritingElementWithChilds<CChartSeriesNumCachePoint>
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CChartSeriesNumCache)
			CChartSeriesNumCache() {}
			virtual ~CChartSeriesNumCache() {}

		public:
			virtual CString      toXML() const
			{
				return _T("");
			}
			virtual void toXML(CStringWriter& writer) const
			{
				if(m_oPtCount.IsInit() && m_oPtCount->m_oVal.IsInit())
				{
					CString sPtCount;
					sPtCount.Format(_T("<c:ptCount val=\"%d\"/>"), m_oPtCount->m_oVal->GetValue());
					writer.WriteStringC(sPtCount);
				}
				int nPtIndex = 0;
				for(int i = 0, length = m_arrItems.GetSize(); i < length; ++i)
					m_arrItems[i]->toXML(writer);
			}
			virtual void toXML2(CStringWriter& writer, bool bStr) const
			{
				if(bStr)
					writer.WriteStringC(_T("<c:strCache>"));
				else
					writer.WriteStringC(_T("<c:numCache>"));
				if(m_oFormatCode.IsInit())
				{
					CString sFormatCode;
					sFormatCode.Format(_T("<c:formatCode>%s</c:formatCode>"), XmlUtils::EncodeXmlString(m_oFormatCode.get()));
					writer.WriteStringC(sFormatCode);
				}
				if(m_oPtCount.IsInit() && m_oPtCount->m_oVal.IsInit())
				{
					CString sPtCount;
					sPtCount.Format(_T("<c:ptCount val=\"%d\"/>"), m_oPtCount->m_oVal->GetValue());
					writer.WriteStringC(sPtCount);
				}
				int nPtIndex = 0;
				for(int i = 0, length = m_arrItems.GetSize(); i < length; ++i)
				{
					CChartSeriesNumCachePoint* pNumCachePoint = m_arrItems[i];
					if(pNumCachePoint->m_oValue.IsInit())
					{
						CString sPt;
						sPt.Format(_T("<c:pt idx=\"%d\"><c:v>%s</c:v></c:pt>"), i, XmlUtils::EncodeXmlString(pNumCachePoint->m_oValue->ToString()));
						writer.WriteStringC(sPt);
					}
				}
				if(bStr)
					writer.WriteStringC(_T("</c:strCache>"));
				else
					writer.WriteStringC(_T("</c:numCache>"));
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

					if ( _T("c:pt") == sName )
						m_arrItems.Add(new CChartSeriesNumCachePoint(oReader));
					else if ( _T("c:ptCount") == sName )
						m_oPtCount = oReader;
					else if ( _T("c:formatCode") == sName )
						m_oFormatCode = oReader.GetText();
				}
			}
			virtual EElementType getType() const
			{
				return et_c_NumCache;
			}
			bool isNumCache()
			{
				bool bRes = true;
				for(int i = 0, length = m_arrItems.GetSize(); i < length; i++)
				{
					if(!m_arrItems[i]->isNumCache())
					{
						bRes = false;
						break;
					}
				}
				return bRes;
			}
			void setForceCache(bool bStr)
			{
				for(int i = 0, length = m_arrItems.GetSize(); i < length; i++)
					m_arrItems[i]->setForceCache(bStr);
			}
		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
			}

		public:
			
			nullable<ComplexTypes::Word::CUnsignedDecimalNumber> m_oPtCount;
			nullable<CString> m_oFormatCode;
		};
		class CChartSeriesNumCacheRef : public WritingElement
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CChartSeriesNumCacheRef)
			CChartSeriesNumCacheRef() {}
			virtual ~CChartSeriesNumCacheRef() {}

		public:
			virtual CString      toXML() const
			{
				return _T("");
			}
			virtual void toXML(CStringWriter& writer) const
			{
			}
			virtual void toXML2(CStringWriter& writer, bool bStr, bool bCheckData, bool bReplaceIfNeed) const
			{
				if(bCheckData)
				{
					bool bStrNew = true;
					if(m_oNumCache->isNumCache())
						bStrNew = false;
					else
						bStrNew = true;
					if(bReplaceIfNeed)
					{
						if(bStr != bStrNew)
							m_oNumCache->setForceCache(bStr);
					}
					else
						bStr = bStrNew;
				}
				if(bStr)
					writer.WriteStringC(CString(_T("<c:strRef>")));
				else
					writer.WriteStringC(CString(_T("<c:numRef>")));
				if(m_oFormula.IsInit())
					m_oFormula->toXML2(writer, CString(_T("c:f")));
				if(m_oNumCache.IsInit())
					m_oNumCache->toXML2(writer, bStr);
				else
				{
					if(bStr)
						writer.WriteStringC(CString(_T("<c:strCache/>")));
					else
						writer.WriteStringC(CString(_T("<c:numCache/>")));
				}
				if(bStr)
					writer.WriteStringC(CString(_T("</c:strRef>")));
				else
					writer.WriteStringC(CString(_T("</c:numRef>")));
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

					if ( _T("c:f") == sName )
						m_oFormula = oReader;
					else if ( _T("c:numCache") == sName || _T("c:strCache") == sName )
						m_oNumCache = oReader;
				}
			}
			virtual EElementType getType() const
			{
				return et_c_NumCacheRef;
			}
			bool isNumCache() const
			{
				bool bRes = true;
				if(m_oNumCache.IsInit())
					bRes = m_oNumCache->isNumCache();
				return bRes;
			}
		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
			}

		public:
			nullable<CText> m_oFormula;
			nullable<CChartSeriesNumCache> m_oNumCache;
		};
		class CChartSeriesNumCacheValues : public WritingElement
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CChartSeriesNumCacheValues)
			CChartSeriesNumCacheValues() {}
			virtual ~CChartSeriesNumCacheValues() {}

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

					if ( _T("c:numRef") == sName || _T("c:strRef") == sName)
						m_oNumCacheRef = oReader;
				}
			}
			virtual EElementType getType() const
			{
				return et_c_NumCacheValues;
			}
		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
			}

		public:
			nullable<CChartSeriesNumCacheRef> m_oNumCacheRef;
		};


		class CChartSeriesStrCacheRef : public WritingElement
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CChartSeriesStrCacheRef)
			CChartSeriesStrCacheRef() {}
			virtual ~CChartSeriesStrCacheRef() {}

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

					if ( _T("c:f") == sName )
						m_oFormula = oReader;
					else if ( _T("c:strCache") == sName )
						m_oNumCache = oReader;
				}
			}
			virtual EElementType getType() const
			{
				return et_c_StrCacheRef;
			}
		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
			}

		public:
			nullable<ComplexTypes::Spreadsheet::CString_> m_oFormula;
			nullable<CChartSeriesNumCache> m_oNumCache;
		};
		class CChartSeriesCat : public WritingElement
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CChartSeriesCat)
			CChartSeriesCat() {}
			virtual ~CChartSeriesCat() {}

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

					if ( _T("c:strRef") == sName )
						m_oStrRef = oReader;
				}
			}
			virtual EElementType getType() const
			{
				return et_c_SeriesCat;
			}
		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
			}

		public:
			nullable<CChartSeriesNumCacheRef> m_oStrRef;
		};


		class CChartSeriesTx : public WritingElement
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CChartSeriesTx)
			CChartSeriesTx() {}
			virtual ~CChartSeriesTx() {}

		public:
			virtual CString      toXML() const
			{
				return _T("");
			}
			virtual void toXML(CStringWriter& writer) const
			{
				if(m_oStrRef.IsInit())
					m_oStrRef->toXML2(writer, true, false, false);
				else if(m_oValue.IsInit())
				{
					writer.WriteStringC(CString(_T("<c:v>")));
					writer.WriteStringC(m_oValue.get2());
					writer.WriteStringC(CString(_T("</c:v>")));
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

					if ( _T("c:v") == sName )
						m_oValue = oReader.GetText2();
					else if ( _T("c:strRef") == sName )
						m_oStrRef = oReader;
				}
			}
			virtual EElementType getType() const
			{
				return et_c_SeriesTx;
			}
		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
			}

		public:
			nullable<CString>		m_oValue;
			nullable<CChartSeriesNumCacheRef> m_oStrRef;
		};


		class CChartSeriesMarker : public WritingElement
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CChartSeriesMarker)
			CChartSeriesMarker() {}
			virtual ~CChartSeriesMarker() {}

		public:
			virtual CString      toXML() const
			{
				return _T("");
			}
			virtual void toXML(CStringWriter& writer) const
			{
				if(m_oSize.IsInit() || (m_oSymbol.IsInit() && m_oSymbol->m_oVal.IsInit()))
				{
					writer.WriteStringC(CString(_T("<c:marker>")));
					if(m_oSize.IsInit())
					{
						CString sXml;
						sXml.Format(_T("<c:size val=\"%d\"/>"), m_oSize.get2());
						writer.WriteStringC(sXml);
					}
					if(m_oSymbol.IsInit() && m_oSymbol->m_oVal.IsInit())
					{
						CString sXml;
						sXml.Format(_T("<c:symbol val=\"%s\"/>"), m_oSymbol->m_oVal->ToString());
						writer.WriteStringC(sXml);
					}
					writer.WriteStringC(CString(_T("</c:marker>")));
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

					if ( _T("c:size") == sName )
						m_oSize = oReader;
					else if ( _T("c:symbol") == sName )
						m_oSymbol = oReader;
				}
			}
			virtual EElementType getType() const
			{
				return et_c_SeriesMarker;
			}
		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
			}

		public:
			nullable<ComplexTypes::Word::CUnsignedDecimalNumber> m_oSize;
			nullable<ComplexTypes::Spreadsheet::CChartSymbol> m_oSymbol;
		};


		class CChartSeriesDataLabels : public WritingElement
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CChartSeriesDataLabels)
			CChartSeriesDataLabels() {}
			virtual ~CChartSeriesDataLabels() {}

		public:
			virtual CString      toXML() const
			{
				CString sRes;
				if(m_oShowVal.IsInit())
					sRes.AppendFormat(_T("<c:showVal val=\"%s\"/>"), m_oShowVal->m_oVal.ToString2(SimpleTypes::onofftostring1));
				else
					sRes.Append(_T("<c:showVal val=\"0\"/>"));
				if(m_oShowCatName.IsInit())
					sRes.AppendFormat(_T("<c:showCatName val=\"%s\"/>"), m_oShowCatName->m_oVal.ToString2(SimpleTypes::onofftostring1));
				else
					sRes.Append(_T("<c:showCatName val=\"0\"/>"));
				if(m_oTxPr.IsInit() && m_oTxPr->m_oXml.IsInit())
					sRes.Append(m_oTxPr->m_oXml.get());
				return sRes;
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

					if ( _T("c:showVal") == sName )
						m_oShowVal = oReader;
					else if ( _T("c:showCatName") == sName )
						m_oShowCatName = oReader;
					else if ( _T("c:txPr") == sName )
						m_oTxPr = oReader;
				}
			}
			virtual EElementType getType() const
			{
				return et_c_SeriesDataLabels;
			}
		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
			}

		public:
			nullable<CChartRich> m_oTxPr;
			nullable<ComplexTypes::Spreadsheet::COnOff2<>> m_oShowVal;
			nullable<ComplexTypes::Spreadsheet::COnOff2<>> m_oShowCatName;
		};


		class CChartSeriesOutline : public WritingElement
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CChartSeriesOutline)
			CChartSeriesOutline() {}
			virtual ~CChartSeriesOutline() {}

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

					if ( _T("a:solidFill") == sName )
						m_oSolidFill = oReader;
				}
			}
			virtual EElementType getType() const
			{
				return et_c_SeriesShapeOutline;
			}
		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
			}

		public:
			nullable<OOX::Drawing::CSolidColorFillProperties> m_oSolidFill;
		};
		class CChartSeriesShapeProperties : public WritingElement
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CChartSeriesShapeProperties)
			CChartSeriesShapeProperties() {}
			virtual ~CChartSeriesShapeProperties() {}

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

					if ( _T("a:ln") == sName )
						m_oOutline = oReader;
				}
			}
			virtual EElementType getType() const
			{
				return et_c_SeriesShapeProperties;
			}
		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
			}

		public:
			nullable<CChartSeriesOutline> m_oOutline;
		};
		class CChartSeriesIndex : public WritingElement
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CChartSeriesIndex)
			CChartSeriesIndex() {}
			virtual ~CChartSeriesIndex() {}

		public:
			virtual CString      toXML() const
			{
				return _T("");
			}
			virtual void toXML(CStringWriter& writer) const
			{
				CString sXml;sXml.Format(_T("<c:idx val=\"%d\"/>"), m_oVal->GetValue());
				writer.WriteStringC(sXml);
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}
			virtual EElementType getType() const
			{
				return et_c_SeriesShapeIndex;
			}
		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
					
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("val"), m_oVal )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:
			nullable<SimpleTypes::CUnsignedDecimalNumber<>> m_oVal;
		};
		class CChartSeriesOrder : public WritingElement
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CChartSeriesOrder)
			CChartSeriesOrder() {}
			virtual ~CChartSeriesOrder() {}

		public:
			virtual CString      toXML() const
			{
				return _T("");
			}
			virtual void toXML(CStringWriter& writer) const
			{
				CString sXml;sXml.Format(_T("<c:order val=\"%d\"/>"), m_oVal->GetValue());
				writer.WriteStringC(sXml);
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}
			virtual EElementType getType() const
			{
				return et_c_SeriesShapeOrder;
			}
		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
					
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("val"), m_oVal )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:
			nullable<SimpleTypes::CUnsignedDecimalNumber<>> m_oVal;
		};

		class CChartSeries : public WritingElement
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CChartSeries)
			CChartSeries() {}
			virtual ~CChartSeries() {}

		public:
			virtual CString      toXML() const
			{
				return _T("");
			}
			virtual CString      toXML2(int index, bool bScatter, bool bLine) const
			{
				CString sRes;
				if(m_oVal.IsInit() && m_oVal->m_oNumCacheRef.IsInit() && m_oVal->m_oNumCacheRef->m_oFormula.IsInit())
				{
					sRes.Append(_T("<c:ser>"));
					
					if(m_oIndex.IsInit() && m_oIndex->m_oVal.IsInit())
						sRes.AppendFormat(_T("<c:idx val=\"%d\"/>"), m_oIndex->m_oVal->GetValue());
					else
						sRes.AppendFormat(_T("<c:idx val=\"%d\"/>"), index);
					if(m_oOrder.IsInit() && m_oOrder->m_oVal.IsInit())
						sRes.AppendFormat(_T("<c:order val=\"%d\"/>"), m_oOrder->m_oVal->GetValue());
					else
						sRes.AppendFormat(_T("<c:order val=\"%d\"/>"), index);
					if(m_oTx.IsInit())
					{
						CStringWriter sw;
						m_oTx->toXML(sw);
						sRes.AppendFormat(_T("<c:tx>%s</c:tx>"), sw.GetCString());
					}
					if(m_sSpPr.IsInit())
						sRes.Append(m_sSpPr.get());
					sRes.Append(_T("<c:invertIfNegative val=\"0\"/>"));

					if(m_oCat.IsInit())
					{
						CStringWriter sw;
						m_oCat->m_oStrRef->toXML2(sw, true, true, false);
						sRes.AppendFormat(_T("<c:cat>%s</c:cat>"), sw.GetCString());
					}
					if(bLine && m_oMarker.IsInit())
					{
						CStringWriter sw;
						m_oMarker->toXML(sw);
						sRes.Append(sw.GetCString());
					}
					if(m_oDataLabels.IsInit())
					{
						sRes.Append(_T("<c:dLbls><c:showLegendKey val=\"0\"/>"));
						sRes.Append(m_oDataLabels->toXML());
						sRes.Append(_T("<c:showSerName val=\"0\"/><c:showPercent val=\"0\"/><c:showBubbleSize val=\"0\"/></c:dLbls>"));
					}
					if(bScatter && m_oXVal.IsInit() && m_oXVal->m_oNumCacheRef.IsInit() && m_oXVal->m_oNumCacheRef->m_oFormula.IsInit())
					{
						CStringWriter sw;
						m_oXVal->m_oNumCacheRef->toXML2(sw, false, true, false);
						sRes.AppendFormat(_T("<c:xVal>%s</c:xVal>"), sw.GetCString());
					}
					
					CStringWriter sw;
					m_oVal->m_oNumCacheRef->toXML2(sw, false, true, true);
					if(bScatter)
						sRes.AppendFormat(_T("<c:yVal>%s</c:yVal>"), sw.GetCString());
					else
						sRes.AppendFormat(_T("<c:val>%s</c:val>"), sw.GetCString());
					if(bScatter || bLine)
						sRes.Append(_T("<c:smooth val=\"0\"/>"));
					sRes.Append(_T("</c:ser>"));
				}
				return sRes;
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

					if ( _T("c:bubbleSize") == sName )
						m_oVal = oReader;
					else if ( _T("c:xVal") == sName )
						m_oXVal = oReader;
					else if ( _T("c:val") == sName || _T("c:yVal") == sName )
						m_oVal = oReader;
					else if ( _T("c:cat") == sName )
						m_oCat = oReader;
					else if ( _T("c:tx") == sName )
						m_oTx = oReader;
					else if ( _T("c:marker") == sName )
						m_oMarker = oReader;
					else if ( _T("c:spPr") == sName )
						m_sSpPr = oReader.GetOuterXml();
					else if ( _T("c:idx") == sName )
						m_oIndex = oReader; 
					else if ( _T("c:order") == sName )
						m_oOrder = oReader;
					else if ( _T("c:dLbls") == sName )
						m_oDataLabels = oReader;
				}
			}
			virtual EElementType getType() const
			{
				return et_c_Series;
			}
		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
			}

		public:
			nullable<CChartSeriesNumCacheValues> m_oXVal;
			nullable<CChartSeriesNumCacheValues> m_oVal;
			nullable<CChartSeriesCat> m_oCat;
			nullable<CChartSeriesTx> m_oTx;
			nullable<CChartSeriesMarker> m_oMarker;
			nullable<CString> m_sSpPr;
			nullable<CChartSeriesIndex> m_oIndex;
			nullable<CChartSeriesOrder> m_oOrder;
			nullable<CChartSeriesDataLabels> m_oDataLabels;
		};
		enum EChartBasicTypes
		{
			chartbasicBarChart		=  0,
			chartbasicBar3DChart	=  1,
			chartbasicLineChart		=  2,
			chartbasicLine3DChart	=  3,
			chartbasicAreaChart		=  4,
			chartbasicPieChart		=  5,
			chartbasicBubbleChart	=  6,
			chartbasicScatterChart	=  7,
			chartbasicRadarChart	=  8,
			chartbasicDoughnutChart	=  9,
			chartbasicStockChart	=  10,
			chartbasicArea3DChart	=  11,
			chartbasicPie3DChart	=  12,
			chartbasicSurfaceChart	=  13,
			chartbasicSurface3DChart=  14
		};
		class CChartBasicChart : public WritingElementWithChilds<CChartSeries>
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CChartBasicChart)
			CChartBasicChart()
			{
			}
			virtual ~CChartBasicChart()
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
			void toXML2(bool bScatter, bool bLine, CString& sBarDir, CString& sGrouping, CString& sSeries, CString& sDataLabels, CString& sOverlap) const
			{
				if(m_oBarDerection.IsInit())
					sBarDir = _T("<c:barDir ") + m_oBarDerection->ToString() + _T("/>");
				if(m_oGrouping.IsInit())
					sGrouping = _T("<c:grouping ") + m_oGrouping->ToString() + _T("/>");
				if(m_oDataLabels.IsInit())
					sDataLabels = m_oDataLabels->toXML();
				for(int i = 0, length = m_arrItems.GetSize(); i < length; ++i)
					sSeries += m_arrItems[i]->toXML2(i, bScatter, bLine);
				if(m_oOverlap.IsInit() && m_oOverlap->m_oVal.IsInit())
				{
					sOverlap.Format(_T("<c:overlap val=\"%d\" />"), m_oOverlap->m_oVal->GetValue());
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

					if ( _T("c:overlap") == sName )
						m_oOverlap = oReader;
					else if ( _T("c:grouping") == sName )
						m_oGrouping = oReader;
					else if ( _T("c:barDir") == sName )
						m_oBarDerection = oReader;
					else if ( _T("c:ser") == sName )
						m_arrItems.Add(new CChartSeries(oReader));
					else if ( _T("c:dLbls") == sName )
						m_oDataLabels = oReader;
				}
			}

			virtual EElementType getType () const
			{
				return et_c_BasicChart;
			}
			virtual void setBasicType (EChartBasicTypes eType)
			{
				m_eType = eType;
			}

		private:
			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
			}
		public:
			EChartBasicTypes m_eType;
			nullable<ComplexTypes::Word::CDecimalNumber > m_oOverlap;
			nullable<ComplexTypes::Spreadsheet::CChartBarGrouping > m_oGrouping;
			nullable<ComplexTypes::Spreadsheet::CChartBarDerection > m_oBarDerection;
			nullable<CChartSeriesDataLabels> m_oDataLabels;
		};
	} 
} 

#endif // OOX_BASICCHART_FILE_INCLUDE_H_