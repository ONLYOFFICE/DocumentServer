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
#ifndef OOX_LOGIC_DRAWING_PICTURE_INCLUDE_H_
#define OOX_LOGIC_DRAWING_PICTURE_INCLUDE_H_

#include "DrawingCoreInfo.h"
#include "DrawingEffects.h"

namespace OOX
{
	namespace Drawing
	{
		
		
		
		class CPictureNonVisual : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CPictureNonVisual)
			CPictureNonVisual()
			{
				m_eType = et_Unknown;
			}
			virtual ~CPictureNonVisual()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				m_eType = et_Unknown;

				
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				m_eType = et_Unknown;

				CWCharWrapper sName = oReader.GetName();
				if ( _T("pic:nvPicPr") == sName )
					m_eType = et_pic_nvPicPr;
				else
					return;

				if ( oReader.IsEmptyNode() )
					return;

				int nCurDepth = oReader.GetDepth();
				while ( oReader.ReadNextSiblingNode( nCurDepth ) )
				{
					sName = oReader.GetName();

					if ( _T("pic:cNvPicPr") == sName )
						m_oCNvPicPr = oReader;
					else if ( _T("pic:cNvPr") == sName )
						m_oCNvPr = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult;

				if ( et_pic_nvPicPr == m_eType )
					sResult = _T("<pic:nvPicPr>");
				else
					return _T("");

				sResult += m_oCNvPr.toXML();
				sResult += m_oCNvPicPr.toXML();

				if ( et_pic_nvPicPr == m_eType )
					sResult += _T("</pic:nvPicPr>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return m_eType;
			}

		public:

			EElementType      m_eType;

			
			OOX::Drawing::CNonVisualPictureProperties m_oCNvPicPr;
			OOX::Drawing::CNonVisualDrawingProps      m_oCNvPr;
		};
		
		
		
		class CPicture : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CPicture)
			CPicture()
			{
			}
			virtual ~CPicture()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				if ( oReader.IsEmptyNode() )
					return;

				int nCurDepth = oReader.GetDepth();
				while( oReader.ReadNextSiblingNode( nCurDepth ) ) 
				{
					CWCharWrapper sName = oReader.GetName();
					if ( _T("pic:nvPicPr") == sName )
						m_oNvPicPr = oReader;
					else if ( _T("pic:blipFill") == sName )
						m_oBlipFill = oReader;
					else if ( _T("pic:spPr") == sName )
						m_oSpPr = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<pic:pic>");
				sResult += m_oNvPicPr.toXML();
				sResult += m_oBlipFill.toXML();
				sResult += m_oSpPr.toXML();
				sResult += _T("</pic:pic>");
				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_pic_pic;
			}

		public:

			
			OOX::Drawing::CBlipFillProperties m_oBlipFill;
			OOX::Drawing::CPictureNonVisual   m_oNvPicPr;
			OOX::Drawing::CShapeProperties    m_oSpPr;

		};

		class CChart : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CChart)
			CChart()
			{
			}
			virtual ~CChart()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}
			virtual CString      toXML() const
			{
				return _T("");
			}
			virtual EElementType getType() const
			{
				return OOX::et_c_chart;
			}
		private:
			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("r:id"), m_oRId )
					WritingElement_ReadAttributes_End( oReader )
			}
		public:

			
			nullable<SimpleTypes::CRelationshipId> m_oRId;
		};
	} 
} 

#endif // OOX_LOGIC_DRAWING_PICTURE_INCLUDE_H_