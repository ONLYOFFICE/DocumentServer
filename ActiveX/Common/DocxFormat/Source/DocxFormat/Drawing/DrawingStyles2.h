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
#ifndef OOX_LOGIC_DRAWING_STYLES2_INCLUDE_H_
#define OOX_LOGIC_DRAWING_STYLES2_INCLUDE_H_

#include "../../Base/Nullable.h"
#include "../../Common/SimpleTypes_Drawing.h"
#include "../../Common/SimpleTypes_Shared.h"
#include "../../Common/SimpleTypes_Word.h"

#include "../WritingElement.h"

#include "DrawingExt.h"
#include "Drawing3D.h"

namespace OOX
{
	namespace Drawing
	{
        
        
        
		class CFontReference : public OOX::Drawing::CColor
		{
		public:
			WritingElement_AdditionConstructors(CFontReference)
			CFontReference()
			{
			}
			virtual ~CFontReference()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				CColor::fromXML( oNode );
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				CColor::fromXML( oReader );
			}

			virtual CString      toXML() const
			{
				CString sResult = _T("<a:fontRef idx=\"") + m_oIdx.ToString() + _T("\">");

				sResult += CColor::toXML();

				sResult += _T("</a:fontRef>");
				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_fontRef;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_ReadSingle( oReader, _T("idx"), m_oIdx )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			SimpleTypes::CFontCollectionIndex<> m_oIdx;

		};
		
		
		
		class CScene3D : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CScene3D)
			CScene3D()
			{
			}
			virtual ~CScene3D()
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
					if ( _T("a:backdrop") == sName )
						m_oBackdrop = oReader;
					else if ( _T("a:camera") == sName )
						m_oCamera = oReader;
					else if ( _T("a:extLst") == sName )
						m_oExtLst = oReader;
					else if ( _T("a:lightRig") == sName )
						m_oLightRig = oReader;
				}
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<a:scene3d>");

				sResult += m_oCamera.toXML();
				sResult += m_oLightRig.toXML();

				if ( m_oBackdrop.IsInit() )  
					sResult += m_oBackdrop->toXML();

				if ( m_oExtLst.IsInit() )
					sResult += m_oExtLst->toXML();

				sResult += _T("</a:scene3d>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return OOX::et_a_scene3d;
			}

		public:

			
			OOX::Drawing::CCamera                           m_oCamera;
			OOX::Drawing::CLightRig                         m_oLightRig;
			nullable<OOX::Drawing::CBackdrop>               m_oBackdrop;
			nullable<OOX::Drawing::COfficeArtExtensionList> m_oExtLst;

		};
	} 

	namespace Drawing
	{
        
        
        
		class CStyleMatrixReference : public OOX::Drawing::CColor
		{
		public:
			WritingElement_AdditionConstructors(CStyleMatrixReference)
			CStyleMatrixReference()
			{
			}
			virtual ~CStyleMatrixReference()
			{
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				CColor::fromXML( oNode );
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				CWCharWrapper sName = oReader.GetName();
				if ( _T("a:effectRef") == sName )
					m_eType = et_a_effectRef;
				else if ( _T("a:fillRef") == sName )
					m_eType = et_a_fillRef;
				else if ( _T("a:lnRef") == sName )
					m_eType = et_a_lnRef;
				else
					return;

				ReadAttributes( oReader );

				CColor::fromXML( oReader );
			}

			virtual CString      toXML() const
			{
				CString sResult;
				
				switch ( m_eType )
				{
				case et_a_effectRef: sResult = _T("<a:effectRef idx=\"") + m_oIdx.ToString() + _T("\">");
				case et_a_fillRef  : sResult = _T("<a:fillRef idx=\"")   + m_oIdx.ToString() + _T("\">");
				case et_a_lnRef    : sResult = _T("<a:lnRef idx=\"")     + m_oIdx.ToString() + _T("\">");
				default: return _T("");
				}

				sResult += CColor::toXML();

				switch ( m_eType )
				{
				case et_a_effectRef: sResult += _T("</a:effectRef>");
				case et_a_fillRef  : sResult += _T("</a:fillRef>");
				case et_a_lnRef    : sResult += _T("</a:lnRef>");
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
				WritingElement_ReadAttributes_ReadSingle( oReader, _T("idx"), m_oIdx )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			EElementType                  m_eType;

			
			SimpleTypes::CDecimalNumber<> m_oIdx;

		};
	} 

} 

#endif // OOX_LOGIC_DRAWING_STYLES_INCLUDE2_H_