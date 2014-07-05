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
#ifndef OOX_CHARTSTYLE_FILE_INCLUDE_H_
#define OOX_CHARTSTYLE_FILE_INCLUDE_H_

#include "../CommonInclude.h"

namespace OOX
{
	namespace Spreadsheet
	{
		class CChartStyle : public WritingElement
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CChartStyle)
			CChartStyle()
			{
			}
			virtual ~CChartStyle()
			{
			}
		public:
			virtual CString      toXML() const
			{
				int nStyle = 0;
				if(m_oVal.IsInit())
					nStyle = m_oVal->GetValue();
				if(false == (nStyle >= 1 && nStyle <= 48))
					nStyle = 2;
				CString sXml;
				sXml.Format(_T("<mc:AlternateContent xmlns:mc=\"http://schemas.openxmlformats.org/markup-compatibility/2006\"><mc:Choice Requires=\"c14\" xmlns:c14=\"http://schemas.microsoft.com/office/drawing/2007/8/2/chart\"><c14:style val=\"%d\"/></mc:Choice><mc:Fallback><c:style val=\"%d\"/></mc:Fallback></mc:AlternateContent>"), 100 + nStyle, nStyle);
				return sXml;
			}
			virtual void toXML(CStringWriter& writer) const
			{
				writer.WriteStringC(toXML());
			}
			virtual void fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}

			virtual EElementType getType () const
			{
				return et_c_ChartStyle;
			}
		private:
			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("val"), m_oVal )
					WritingElement_ReadAttributes_End( oReader )
			}
		public:
			nullable<SimpleTypes::CUnsignedDecimalNumber<>>						m_oVal;
		};
	} 
} 

#endif // OOX_CHARTSTYLE_FILE_INCLUDE_H_