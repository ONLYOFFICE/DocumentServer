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
#ifndef OOX_LOGIC_DRAWING_RUN_INCLUDE_H_
#define OOX_LOGIC_DRAWING_RUN_INCLUDE_H_

#include "../../Base/Nullable.h"
#include "../../Common/SimpleTypes_Drawing.h"
#include "../../Common/SimpleTypes_Shared.h"

#include "../WritingElement.h"

namespace OOX
{
	namespace Drawing
	{
		
		
		
		class CTextFont : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CTextFont)
			CTextFont()
			{
				m_eType = et_Unknown;
			}
			virtual ~CTextFont()
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
				if ( _T("a:cs") == sName )
					m_eType = et_a_cs;
				else if ( _T("a:ea") == sName )
					m_eType = et_a_ea;
				else if ( _T("a:latin") == sName )
					m_eType = et_a_latin;
				else if ( _T("a:sym") == sName )
					m_eType = et_a_sym;
				else
					return;

				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}
			virtual CString      toXML() const
			{
				CString sResult;

				switch ( m_eType )
				{
				case et_a_cs:    sResult = _T("<a:cs"); break;
				case et_a_ea:    sResult = _T("<a:ea"); break;
				case et_a_latin: sResult = _T("<a:latin"); break;
				case et_a_sym:   sResult = _T("<a:sym"); break;
				default: return _T("");
				}

				if ( m_oTypeFace.IsInit() )
					sResult += _T(" typeface=\"") + m_oTypeFace->ToString() + _T("\"");

				if ( m_oPanose.IsInit() )
					sResult += _T(" panose=\"") + m_oPanose->ToString() + _T("\"");

				if ( SimpleTypes::pitchfamilyDefUnk != m_oPitchFamily.GetValue() )
					sResult += _T(" pitchFamily=\"") + m_oPitchFamily.ToString() + _T("\"");

				if ( SimpleTypes::fontcharsetDefault != m_oCharset.GetValue() )
					sResult += _T(" charset=\"") + m_oCharset.ToString() + _T("\"");

				sResult += _T("/>");

				return sResult;
			}
			virtual EElementType getType() const
			{
				return m_eType;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				if ( oReader.GetAttributesCount() <= 0 )
					return;
				
				if ( !oReader.MoveToFirstAttribute() )
					return;
				
				CWCharWrapper wsName = oReader.GetName();
				while( !wsName.IsNull() )
				{
					wchar_t wsChar0 = wsName[0]; 

					switch ( wsChar0 )
					{
					case 'c':
						if      ( _T("charset")     == wsName ) m_oCharset = oReader.GetText();
						break;

					case 'p':
						if      ( _T("panose")      == wsName ) m_oPanose = oReader.GetText();
						else if ( _T("pitchFamily") == wsName ) m_oPitchFamily = oReader.GetText();
						break;

					case 't':
						if      ( _T("typeface")    == wsName ) m_oTypeFace = oReader.GetText();
						break;
					}

					if ( !oReader.MoveToNextAttribute() )
						break;

					wsName = oReader.GetName();
				}
				oReader.MoveToElement();
			}

		public:

			EElementType m_eType;

			
			SimpleTypes::CFontCharset<SimpleTypes::fontcharsetDefault> m_oCharset;
			nullable<SimpleTypes::CPanose>                             m_oPanose;
			SimpleTypes::CPitchFamily<SimpleTypes::pitchfamilyDefUnk>  m_oPitchFamily;
			nullable<SimpleTypes::CTextTypeface>                       m_oTypeFace;
		};

	} 
} 

#endif // OOX_LOGIC_DRAWING_RUN_INCLUDE_H_