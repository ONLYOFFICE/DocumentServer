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
#ifndef OOX_MERGECELLS_FILE_INCLUDE_H_
#define OOX_MERGECELLS_FILE_INCLUDE_H_

#include "../CommonInclude.h"


namespace OOX
{
	namespace Spreadsheet
	{
		
		
		class CMergeCell : public WritingElement
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CMergeCell)
			CMergeCell()
			{
			}
			virtual ~CMergeCell()
			{
			}

		public:
			virtual CString      toXML() const
			{
				return _T("");
			}
			virtual void toXML(CStringWriter& writer) const
			{
				writer.WriteStringC(_T("<mergeCell"));
				if(m_oRef.IsInit())
				{
					CString sVal; sVal.Format(_T(" ref=\"%s\""), XmlUtils::EncodeXmlString(m_oRef.get()));
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
				return et_MergeCell;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )

					WritingElement_ReadAttributes_Read_if     ( oReader, _T("ref"),      m_oRef )

					WritingElement_ReadAttributes_End( oReader )
			}

		public:
				nullable<CString>						m_oRef;
		};

		class CMergeCells  : public WritingElementWithChilds<CMergeCell>
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CMergeCells)
			CMergeCells()
			{
			}
			virtual ~CMergeCells()
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
					writer.WriteStringC(_T("<mergeCells"));
					if(m_oCount.IsInit())
					{
						CString sVal; sVal.Format(_T(" count=\"%d\""), m_oCount->GetValue());
						writer.WriteStringC(sVal);
					}
					writer.WriteStringC(_T(">"));
					for(int i = 0, length = m_arrItems.GetSize(); i < length; ++i)
						m_arrItems[i]->toXML(writer);
					writer.WriteStringC(_T("</mergeCells>"));
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

					if ( _T("mergeCell") == sName )
						m_arrItems.Add( new CMergeCell( oReader ));
				}
			}

			virtual EElementType getType () const
			{
				return et_MergeCells;
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

#endif // OOX_MERGECELLS_FILE_INCLUDE_H_