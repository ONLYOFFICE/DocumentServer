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
#ifndef OOX_LOGIC_DRAWING_TRANSFORM_INCLUDE_H_
#define OOX_LOGIC_DRAWING_TRANSFORM_INCLUDE_H_

#include "../../Base/Nullable.h"
#include "../../Common/SimpleTypes_Drawing.h"
#include "../../Common/ComplexTypes.h"

#include "../WritingElement.h"

namespace OOX
{
	namespace Drawing
	{
		
		
		
		class CGroupTransform2D : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CGroupTransform2D)
			CGroupTransform2D()
			{
				m_eType = et_Unknown;
			}
			virtual ~CGroupTransform2D()
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
				if ( _T("a:xfrm") == sName )
					m_eType = et_a_xfrm;
				else
					return;

				ReadAttributes( oReader );

				if ( oReader.IsEmptyNode() )
					return;

				int nCurDepth = oReader.GetDepth();
				while ( oReader.ReadNextSiblingNode( nCurDepth ) )
				{
					sName = oReader.GetName();

					if ( _T("a:chExt") == sName )
						m_oChExt = oReader;
					else if ( _T("a:chOff") == sName )
						m_oChOff = oReader;
					else if ( _T("a:ext") == sName )
						m_oExt = oReader;
					else if ( _T("a:off") == sName )
						m_oOff = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult;
				
				
				switch ( m_eType )
				{
				case et_a_xfrm: 
					
					sResult = _T("<a:xfrm flipH=\"") + m_oFlipH.ToString()
						+ _T("\" flipV=\"") + m_oFlipV.ToString()
						+ _T("\" rot=\"") + m_oRot.ToString()
						+ _T("\">");

					break;

				default:

					return _T("");
				}

				if ( m_oOff.IsInit() )
					sResult += _T("<a:off ") + m_oOff->ToString() + _T("/>");

				if ( m_oExt.IsInit() )
					sResult += _T("<a:ext ") + m_oExt->ToString() + _T("/>");

				if ( m_oChOff.IsInit() )
					sResult += _T("<a:chOff ") + m_oChOff->ToString() + _T("/>");

				if ( m_oChExt.IsInit() )
					sResult += _T("<a:chExt ") + m_oChExt->ToString() + _T("/>");

				switch ( m_eType )
				{
				case et_a_xfrm: sResult = _T("</a:xfrm>"); break;
				}

				return sResult;
			}
			virtual EElementType getType() const
			{
				return m_eType;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("flipH"), m_oFlipH )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("flipV"), m_oFlipV )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("rot"),   m_oRot )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			EElementType                                     m_eType;

			
			SimpleTypes::COnOff<SimpleTypes::onoffFalse>     m_oFlipH;
			SimpleTypes::COnOff<SimpleTypes::onoffFalse>     m_oFlipV;
			SimpleTypes::CAngle<0>                           m_oRot;

			
			nullable<ComplexTypes::Drawing::CPositiveSize2D> m_oChExt;
			nullable<ComplexTypes::Drawing::CPoint2D>        m_oChOff;
			nullable<ComplexTypes::Drawing::CPositiveSize2D> m_oExt;
			nullable<ComplexTypes::Drawing::CPositiveSize2D> m_oOff;

		};
		
		
		
		class CTransform2D : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CTransform2D)
			CTransform2D()
			{
				m_eType = et_Unknown;
			}
			virtual ~CTransform2D()
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
				if ( _T("a:xfrm") == sName )
					m_eType = et_a_xfrm;
				else
					return;

				ReadAttributes( oReader );

				if ( oReader.IsEmptyNode() )
					return;

				int nCurDepth = oReader.GetDepth();
				while ( oReader.ReadNextSiblingNode( nCurDepth ) )
				{
					sName = oReader.GetName();

					if ( _T("a:ext") == sName )
						m_oExt = oReader;
					else if ( _T("a:off") == sName )
						m_oOff = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult;
				
				
				switch ( m_eType )
				{
				case et_a_xfrm: 
					
					sResult = _T("<a:xfrm flipH=\"") + m_oFlipH.ToString()
						+ _T("\" flipV=\"") + m_oFlipV.ToString()
						+ _T("\" rot=\"") + m_oRot.ToString()
						+ _T("\">");

					break;

				default:

					return _T("");
				}

				if ( m_oOff.IsInit() )
					sResult += _T("<a:off ") + m_oOff->ToString() + _T("/>");

				if ( m_oExt.IsInit() )
					sResult += _T("<a:ext ") + m_oExt->ToString() + _T("/>");

				switch ( m_eType )
				{
				case et_a_xfrm: sResult = _T("</a:xfrm>"); break;
				}

				return sResult;
			}
			virtual EElementType getType() const
			{
				return m_eType;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("flipH"), m_oFlipH )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("flipV"), m_oFlipV )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("rot"),   m_oRot )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			EElementType                                     m_eType;

			
			SimpleTypes::COnOff<SimpleTypes::onoffFalse>     m_oFlipH;
			SimpleTypes::COnOff<SimpleTypes::onoffFalse>     m_oFlipV;
			SimpleTypes::CAngle<0>                           m_oRot;

			
			nullable<ComplexTypes::Drawing::CPositiveSize2D> m_oExt;
			nullable<ComplexTypes::Drawing::CPositiveSize2D> m_oOff;

		};



	} 
} 

#endif // OOX_LOGIC_DRAWING_TRANSFORM_INCLUDE_H_