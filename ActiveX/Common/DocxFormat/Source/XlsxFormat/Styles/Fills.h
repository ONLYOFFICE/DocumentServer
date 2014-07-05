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
#ifndef OOX_FILLS_FILE_INCLUDE_H_
#define OOX_FILLS_FILE_INCLUDE_H_

#include "../CommonInclude.h"

#include "rPr.h"

namespace OOX
{
	namespace Spreadsheet
	{
		class CPatternFill : public WritingElement
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CPatternFill)
			CPatternFill()
			{
			}
			virtual ~CPatternFill()
			{
			}

		public:
			virtual CString      toXML() const
			{
				return _T("");
			}
			virtual void toXML(CStringWriter& writer) const
			{
				writer.WriteStringC(_T("<patternFill"));
				if(m_oPatternType.IsInit())
				{
					CString sVal;sVal.Format(_T(" patternType=\"%s\""), m_oPatternType->ToString());
					writer.WriteStringC(sVal);
				}
				if(m_oBgColor.IsInit() || m_oFgColor.IsInit())
				{
					writer.WriteStringC(_T(">"));
					if(m_oBgColor.IsInit() && m_oFgColor.IsInit())
					{
						m_oFgColor->toXML2(writer, _T("fgColor"));
						m_oBgColor->toXML2(writer, _T("bgColor"));
					}
					else if(m_oFgColor.IsInit())
					{
						m_oFgColor->toXML2(writer, _T("fgColor"));
						m_oFgColor->toXML2(writer, _T("bgColor"));
					}
					else if(m_oBgColor.IsInit())
					{
						m_oBgColor->toXML2(writer, _T("fgColor"));
						m_oBgColor->toXML2(writer, _T("bgColor"));
					}
					
					writer.WriteStringC(_T("</patternFill>"));
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

					if ( _T("bgColor") == sName )
						m_oBgColor = oReader;
					else if ( _T("fgColor") == sName )
						m_oFgColor = oReader;
				}
			}

			virtual EElementType getType () const
			{
				return et_PatternFill;
			}

		private:
			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )

					WritingElement_ReadAttributes_Read_if     ( oReader, _T("patternType"),      m_oPatternType )

					WritingElement_ReadAttributes_End( oReader )
			}
		public:
			nullable<SimpleTypes::Spreadsheet::CPatternType<>>	m_oPatternType;
			nullable<CColor>									m_oBgColor;
			nullable<CColor>									m_oFgColor;
		};
		class CGradientStop : public WritingElement
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CGradientStop)
			CGradientStop()
			{
			}
			virtual ~CGradientStop()
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

				if ( oReader.IsEmptyNode() )
					return;

				int nCurDepth = oReader.GetDepth();
				while( oReader.ReadNextSiblingNode( nCurDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();

					if ( _T("color") == sName )
						m_oColor = oReader;
				}
			}

			virtual EElementType getType () const
			{
				return et_GradientStop;
			}

		private:
			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )

					WritingElement_ReadAttributes_Read_if     ( oReader, _T("position"),      m_oPosition )

					WritingElement_ReadAttributes_End( oReader )
			}
		public:
			nullable<SimpleTypes::CDouble>		m_oPosition;
			nullable<CColor>					m_oColor;
		};
		class CGradientFill : public WritingElementWithChilds<CGradientStop>
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CGradientFill)
			CGradientFill()
			{
			}
			virtual ~CGradientFill()
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

				if ( oReader.IsEmptyNode() )
					return;

				int nCurDepth = oReader.GetDepth();
				while( oReader.ReadNextSiblingNode( nCurDepth ) )
				{
					CWCharWrapper sName = oReader.GetName();

					if ( _T("stop") == sName )
						m_arrItems.Add( new CGradientStop( oReader ));
				}
			}

			virtual EElementType getType () const
			{
				return et_GradientFill;
			}

		private:
			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )

					WritingElement_ReadAttributes_Read_if     ( oReader, _T("bottom"),      m_oBottom )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("degree"),      m_oDegree )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("left"),      m_oLeft )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("right"),      m_oRight )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("top"),      m_oTop )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("type"),      m_oType )

					WritingElement_ReadAttributes_End( oReader )
			}
		public:
			nullable<SimpleTypes::CDouble>		m_oBottom;
			nullable<SimpleTypes::CDouble>		m_oDegree;
			nullable<SimpleTypes::CDouble>		m_oLeft;
			nullable<SimpleTypes::CDouble>		m_oRight;
			nullable<SimpleTypes::CDouble>		m_oTop;
			nullable<SimpleTypes::Spreadsheet::CGradientType<>>		m_oType;
		};
		class CFill : public WritingElement
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CFill)
			CFill()
			{
			}
			virtual ~CFill()
			{
			}

		public:
			virtual CString      toXML() const
			{
				return _T("");
			}
			virtual void toXML(CStringWriter& writer) const
			{
				writer.WriteStringC(_T("<fill>"));
				if(m_oPatternFill.IsInit())
					m_oPatternFill->toXML(writer);
				writer.WriteStringC(_T("</fill>"));
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

					if ( _T("gradientFill") == sName )
						m_oGradientFill = oReader;
					else if ( _T("patternFill") == sName )
						m_oPatternFill = oReader;
				}
			}

			virtual EElementType getType () const
			{
				return et_Fill;
			}

		private:
			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
			}
		public:
			nullable<CGradientFill>		m_oGradientFill;
			nullable<CPatternFill>		m_oPatternFill;
		};
		class CFills : public WritingElementWithChilds<CFill>
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CFills)
			CFills()
			{
			}
			virtual ~CFills()
			{
			}

		public:
			virtual CString      toXML() const
			{
				return _T("");
			}
			virtual void toXML(CStringWriter& writer) const
			{
				writer.WriteStringC(_T("<fills"));
				if(m_oCount.IsInit())
				{
					CString sVal;sVal.Format(_T(" count=\"%d\""), m_oCount->GetValue());
					writer.WriteStringC(sVal);
				}
				writer.WriteStringC(_T(">"));
				for(int i = 0, length = m_arrItems.GetSize(); i < length; ++i)
					m_arrItems[i]->toXML(writer);
				writer.WriteStringC(_T("</fills>"));
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

					if ( _T("fill") == sName )
						m_arrItems.Add( new CFill( oReader ));
				}
			}

			virtual EElementType getType () const
			{
				return et_Fills;
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

#endif // OOX_FILLS_FILE_INCLUDE_H_