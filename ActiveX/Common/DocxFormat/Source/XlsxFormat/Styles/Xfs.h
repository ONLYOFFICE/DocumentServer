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
#ifndef OOX_XFS_FILE_INCLUDE_H_
#define OOX_XFS_FILE_INCLUDE_H_

#include "../CommonInclude.h"

namespace OOX
{
	namespace Spreadsheet
	{
		class CAligment : public WritingElement
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CAligment)
			CAligment()
			{
			}
			virtual ~CAligment()
			{
			}

		public:
			virtual CString      toXML() const
			{
				return _T("");
			}
			virtual void toXML(CStringWriter& writer) const
			{
				writer.WriteStringC(_T("<alignment"));
				if(m_oHorizontal.IsInit())
				{
					CString sVal;sVal.Format(_T(" horizontal=\"%s\""), m_oHorizontal->ToString());
					writer.WriteStringC(sVal);
				}
				if(m_oIndent.IsInit())
				{
					CString sVal;sVal.Format(_T(" indent=\"%d\""), m_oIndent->GetValue());
					writer.WriteStringC(sVal);
				}
				if(m_oJustifyLastLine.IsInit())
				{
					CString sVal;sVal.Format(_T(" justifyLastLine=\"%s\""), m_oJustifyLastLine->ToString2(SimpleTypes::onofftostring1));
					writer.WriteStringC(sVal);
				}
				if(m_oReadingOrder.IsInit())
				{
					CString sVal;sVal.Format(_T(" readingOrder=\"%d\""), m_oReadingOrder->GetValue());
					writer.WriteStringC(sVal);
				}
				if(m_oRelativeIndent.IsInit())
				{
					CString sVal;sVal.Format(_T(" relativeIndent=\"%d\""), m_oRelativeIndent->GetValue());
					writer.WriteStringC(sVal);
				}
				if(m_oShrinkToFit.IsInit())
				{
					CString sVal;sVal.Format(_T(" shrinkToFit=\"%s\""), m_oShrinkToFit->ToString2(SimpleTypes::onofftostring1));
					writer.WriteStringC(sVal);
				}
				if(m_oTextRotation.IsInit())
				{
					CString sVal;sVal.Format(_T(" textRotation=\"%d\""), m_oTextRotation->GetValue());
					writer.WriteStringC(sVal);
				}
				if(m_oVertical.IsInit())
				{
					CString sVal;sVal.Format(_T(" vertical=\"%s\""), m_oVertical->ToString());
					writer.WriteStringC(sVal);
				}
				if(m_oWrapText.IsInit())
				{
					CString sVal;sVal.Format(_T(" wrapText=\"%s\""), m_oWrapText->ToString2(SimpleTypes::onofftostring1));
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
				return et_Aligment;
			}
			bool IsEmpty()
			{
				return !(m_oHorizontal.IsInit() || m_oIndent.IsInit() || m_oJustifyLastLine.IsInit() || m_oReadingOrder.IsInit() || m_oRelativeIndent.IsInit() ||
					m_oShrinkToFit.IsInit() || m_oTextRotation.IsInit() || (m_oVertical.IsInit() && SimpleTypes::Spreadsheet::verticalalignmentBottom != m_oVertical->GetValue()) || m_oWrapText.IsInit());
			}
		private:
			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )

					WritingElement_ReadAttributes_Read_if     ( oReader, _T("horizontal"),      m_oHorizontal )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("indent"),      m_oIndent )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("justifyLastLine"),      m_oJustifyLastLine )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("readingOrder"),      m_oReadingOrder )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("relativeIndent"),      m_oRelativeIndent )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("shrinkToFit"),      m_oShrinkToFit )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("textRotation"),      m_oTextRotation )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("vertical"),      m_oVertical )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("wrapText"),      m_oWrapText )

					WritingElement_ReadAttributes_End( oReader )
			}
		public:
			nullable<SimpleTypes::Spreadsheet::CHorizontalAlignment<>>		m_oHorizontal;
			nullable<SimpleTypes::CUnsignedDecimalNumber<>>					m_oIndent;
			nullable<SimpleTypes::COnOff<>>									m_oJustifyLastLine;
			nullable<SimpleTypes::CUnsignedDecimalNumber<>>					m_oReadingOrder;
			nullable<SimpleTypes::CDecimalNumber<>>							m_oRelativeIndent;
			nullable<SimpleTypes::COnOff<>>									m_oShrinkToFit;
			nullable<SimpleTypes::CUnsignedDecimalNumber<>>					m_oTextRotation;
			nullable<SimpleTypes::Spreadsheet::CVerticalAlignment<>>		m_oVertical;
			nullable<SimpleTypes::COnOff<>>									m_oWrapText;
		};
		class CProtection : public WritingElement
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CProtection)
			CProtection()
			{
			}
			virtual ~CProtection()
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
				return et_Protection;
			}

		private:
			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )

					WritingElement_ReadAttributes_Read_if     ( oReader, _T("hidden"),      m_oHidden )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("locked"),      m_oLocked )

					WritingElement_ReadAttributes_End( oReader )
			}
		public:
			nullable<SimpleTypes::COnOff<>>									m_oHidden;
			nullable<SimpleTypes::COnOff<>>									m_oLocked;
		};
		
		
		class CXfs : public WritingElement
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CXfs)
			CXfs()
			{
			}
			virtual ~CXfs()
			{
			}

		public:
			virtual CString      toXML() const
			{
				return _T("");
			}
			virtual void toXML(CStringWriter& writer) const
			{
				writer.WriteStringC(_T("<xf"));
				if(m_oFontId.IsInit())
				{
					CString sVal;sVal.Format(_T(" fontId=\"%d\""), m_oFontId->GetValue());
					writer.WriteStringC(sVal);
				}
				if(m_oFillId.IsInit())
				{
					CString sVal;sVal.Format(_T(" fillId=\"%d\""), m_oFillId->GetValue());
					writer.WriteStringC(sVal);
				}
				if(m_oBorderId.IsInit())
				{
					CString sVal;sVal.Format(_T(" borderId=\"%d\""), m_oBorderId->GetValue());
					writer.WriteStringC(sVal);
				}
				if(m_oNumFmtId.IsInit())
				{
					CString sVal;sVal.Format(_T(" numFmtId=\"%d\""), m_oNumFmtId->GetValue());
					writer.WriteStringC(sVal);
				}
				if(m_oXfId.IsInit())
				{
					CString sVal;sVal.Format(_T(" xfId=\"%d\""), m_oXfId->GetValue());
					writer.WriteStringC(sVal);
				}
				if(m_oApplyNumberFormat.IsInit())
				{
					CString sVal;sVal.Format(_T(" applyNumberFormat=\"%s\""), m_oApplyNumberFormat->ToString2(SimpleTypes::onofftostring1));
					writer.WriteStringC(sVal);
				}
				if(m_oApplyFont.IsInit())
				{
					CString sVal;sVal.Format(_T(" applyFont=\"%s\""), m_oApplyFont->ToString2(SimpleTypes::onofftostring1));
					writer.WriteStringC(sVal);
				}
				if(m_oApplyFill.IsInit())
				{
					CString sVal;sVal.Format(_T(" applyFill=\"%s\""), m_oApplyFill->ToString2(SimpleTypes::onofftostring1));
					writer.WriteStringC(sVal);
				}
				if(m_oApplyBorder.IsInit())
				{
					CString sVal;sVal.Format(_T(" applyBorder=\"%s\""), m_oApplyBorder->ToString2(SimpleTypes::onofftostring1));
					writer.WriteStringC(sVal);
				}
				if(m_oApplyAlignment.IsInit())
				{
					CString sVal;sVal.Format(_T(" applyAlignment=\"%s\""), m_oApplyAlignment->ToString2(SimpleTypes::onofftostring1));
					writer.WriteStringC(sVal);
				}
				if(m_oQuotePrefix.IsInit())
				{
					CString sVal;sVal.Format(_T(" quotePrefix=\"%s\""), m_oQuotePrefix->ToString2(SimpleTypes::onofftostring1));
					writer.WriteStringC(sVal);
				}
				if(m_oAligment.IsInit())
				{
					writer.WriteStringC(_T(">"));
					m_oAligment->toXML(writer);
					writer.WriteStringC(_T("</xf>"));
				}
				else
					writer.WriteStringC(_T("/>"));
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

					if ( _T("alignment") == sName )
						m_oAligment = oReader;
					else if( _T("protection") == sName )
						m_oProtection = oReader;
				}
			}

			virtual EElementType getType () const
			{
				return et_Xfs;
			}

		private:
			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )

					WritingElement_ReadAttributes_Read_if     ( oReader, _T("applyAlignment"),      m_oApplyAlignment )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("applyBorder"),      m_oApplyBorder )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("applyFill"),      m_oApplyFill )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("applyFont"),      m_oApplyFont )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("applyNumberFormat"),      m_oApplyNumberFormat )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("applyProtection"),      m_oApplyProtection )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("borderId"),      m_oBorderId )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("fillId"),      m_oFillId )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("fontId"),      m_oFontId )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("numFmtId"),      m_oNumFmtId )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("pivotButton"),      m_oPivotButton )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("quotePrefix"),      m_oQuotePrefix )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("xfId"),      m_oXfId )

					WritingElement_ReadAttributes_End( oReader )
			}
		public:
			nullable<SimpleTypes::COnOff<>>					m_oApplyAlignment;
			nullable<SimpleTypes::COnOff<>>					m_oApplyBorder;
			nullable<SimpleTypes::COnOff<>>					m_oApplyFill;
			nullable<SimpleTypes::COnOff<>>					m_oApplyFont;
			nullable<SimpleTypes::COnOff<>>					m_oApplyNumberFormat;
			nullable<SimpleTypes::COnOff<>>					m_oApplyProtection;

			nullable<SimpleTypes::CUnsignedDecimalNumber<>>	m_oBorderId;
			nullable<SimpleTypes::CUnsignedDecimalNumber<>>	m_oFillId;
			nullable<SimpleTypes::CUnsignedDecimalNumber<>>	m_oFontId;
			nullable<SimpleTypes::CUnsignedDecimalNumber<>>	m_oNumFmtId;
			nullable<SimpleTypes::COnOff<>>					m_oPivotButton;
			nullable<SimpleTypes::COnOff<>>					m_oQuotePrefix;
			nullable<SimpleTypes::CUnsignedDecimalNumber<>>	m_oXfId;

			nullable<CAligment>								m_oAligment;
			nullable<CProtection>							m_oProtection;
			
		};

		class CCellXfs  : public WritingElementWithChilds<CXfs>
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CCellXfs)
			CCellXfs()
			{
			}
			virtual ~CCellXfs()
			{
			}

		public:
			virtual CString      toXML() const
			{
				return _T("");
			}
			virtual void toXML(CStringWriter& writer) const
			{
				writer.WriteStringC(_T("<cellXfs"));
				if(m_oCount.IsInit())
				{
					CString sVal;sVal.Format(_T(" count=\"%d\""), m_oCount->GetValue());
					writer.WriteStringC(sVal);
				}
				writer.WriteStringC(_T(">"));
				for(int i = 0, length = m_arrItems.GetSize(); i < length; ++i)
					m_arrItems[i]->toXML(writer);
				writer.WriteStringC(_T("</cellXfs>"));
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

					if ( _T("xf") == sName )
						m_arrItems.Add( new CXfs( oReader ));
				}
			}

			virtual EElementType getType () const
			{
				return et_CellXfs;
			}

		private:
			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )

					WritingElement_ReadAttributes_Read_if     ( oReader, _T("count"),      m_oCount )

					WritingElement_ReadAttributes_End( oReader )
			}
		public:
			nullable<SimpleTypes::CUnsignedDecimalNumber<>>		m_oCount;
		};
		class CCellStyleXfs  : public WritingElementWithChilds<CXfs>
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CCellStyleXfs)
			CCellStyleXfs()
			{
			}
			virtual ~CCellStyleXfs()
			{
			}

		public:
			virtual CString      toXML() const
			{
				return _T("");
			}
			virtual void toXML(CStringWriter& writer) const
			{
				writer.WriteStringC(_T("<cellStyleXfs"));
				if(m_oCount.IsInit())
				{
					CString sVal;sVal.Format(_T(" count=\"%d\""), m_oCount->GetValue());
					writer.WriteStringC(sVal);
				}
				writer.WriteStringC(_T(">"));
				for(int i = 0, length = m_arrItems.GetSize(); i < length; ++i)
					m_arrItems[i]->toXML(writer);
				writer.WriteStringC(_T("</cellStyleXfs>"));
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

					if ( _T("xf") == sName )
						m_arrItems.Add( new CXfs( oReader ));
				}
			}

			virtual EElementType getType () const
			{
				return et_CellStyleXfs;
			}

		private:
			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )

					WritingElement_ReadAttributes_Read_if     ( oReader, _T("count"),      m_oCount )

					WritingElement_ReadAttributes_End( oReader )
			}
		public:
			nullable<SimpleTypes::CUnsignedDecimalNumber<>>		m_oCount;
		};
	} 
} 

#endif // OOX_XFS_FILE_INCLUDE_H_