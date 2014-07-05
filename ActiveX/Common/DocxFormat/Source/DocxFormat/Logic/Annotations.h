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

#ifndef OOX_LOGIC_RANGE_MURKUP_ELEMENTS_INCLUDE_H_
#define OOX_LOGIC_RANGE_MURKUP_ELEMENTS_INCLUDE_H_

#include "../../Base/Nullable.h"

#include "../../Common/SimpleTypes_Shared.h"
#include "../../Common/SimpleTypes_Word.h"
#include "../../Common/ComplexTypes.h"

#include "./../WritingElement.h"

namespace OOX
{
	
	namespace Logic
	{
		
		
		
		class CCommentRangeEnd : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CCommentRangeEnd)
			CCommentRangeEnd()
			{
			}
			CCommentRangeEnd(CCommentRangeEnd *pOther)
			{
				m_oDisplacedByCustomXml = pOther->m_oDisplacedByCustomXml;
				m_oId                   = pOther->m_oId;
			}
			virtual ~CCommentRangeEnd()
			{
			}

		public:
			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("w:displacedbyCustomXml"), m_oDisplacedByCustomXml );
				oNode.ReadAttributeBase( _T("w:id"),                   m_oId );
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader) 
			{
				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<w:commentRangeEnd ");

				ComplexTypes_WriteAttribute( _T("w:displacedbyCustomXml=\""), m_oDisplacedByCustomXml );
				ComplexTypes_WriteAttribute( _T("w:id=\""),                   m_oId );

				sResult += _T(" />");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_w_commentRangeEnd;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("w:displacedbyCustomXml"), m_oDisplacedByCustomXml )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:id"),                   m_oId )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			nullable<SimpleTypes::CDisplacedByCustomXml<> > m_oDisplacedByCustomXml;
			nullable<SimpleTypes::CDecimalNumber<>        > m_oId;
		};

		
		
		
		class CCommentRangeStart : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CCommentRangeStart)
			CCommentRangeStart()
			{
			}
			virtual ~CCommentRangeStart()
			{
			}

		public:
			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("w:displacedbyCustomXml"), m_oDisplacedByCustomXml );
				oNode.ReadAttributeBase( _T("w:id"),                   m_oId );
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader) 
			{
				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<w:commentRangeStart ");

				ComplexTypes_WriteAttribute( _T("w:displacedbyCustomXml=\""), m_oDisplacedByCustomXml );
				ComplexTypes_WriteAttribute( _T("w:id=\""),                   m_oId );

				sResult += _T(" />");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_w_commentRangeStart;
			}

		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("w:displacedbyCustomXml"), m_oDisplacedByCustomXml )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:id"),                   m_oId )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			nullable<SimpleTypes::CDisplacedByCustomXml<> > m_oDisplacedByCustomXml;
			nullable<SimpleTypes::CDecimalNumber<>        > m_oId;
		};

	} 
	
	namespace Logic
	{
		
		
		
		class CCustomXmlDelRangeEnd : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CCustomXmlDelRangeEnd)
			CCustomXmlDelRangeEnd()
			{
			}
			virtual ~CCustomXmlDelRangeEnd()
			{
			}

		public:
			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("w:id"), m_oId );
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader) 
			{
				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<w:customXmlDelRangeEnd ");

				ComplexTypes_WriteAttribute( _T("w:id=\""), m_oId );

				sResult += _T(" />");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_w_customXmlDelRangeEnd;
			}
		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_ReadSingle( oReader, _T("w:id"), m_oId )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			nullable<SimpleTypes::CDecimalNumber<>        > m_oId;
		};

		
		
		
		class CCustomXmlDelRangeStart : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CCustomXmlDelRangeStart)
			CCustomXmlDelRangeStart()
			{
			}
			virtual ~CCustomXmlDelRangeStart()
			{
			}


		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("w:author"), m_sAuthor );
				oNode.ReadAttributeBase( _T("w:date"),   m_oDate );
				oNode.ReadAttributeBase( _T("w:id"),     m_oID );
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader) 
			{
				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<w:customXmlDelRangeStart ");

				if ( m_sAuthor.IsInit() )
				{
					sResult += "w:author=\"";
					sResult += m_sAuthor->GetString();
					sResult += "\" ";
				}

				if ( m_oDate.IsInit() )
				{
					sResult += "w:date=\"";
					sResult += m_oDate->ToString();
					sResult += "\" ";
				}

				if ( m_oID.IsInit() )
				{
					sResult += "w:id=\"";
					sResult += m_oID->ToString();
					sResult += "\" ";
				}

				sResult += _T("/>");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_w_customXmlDelRangeStart;
			}
		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("w:author"), m_sAuthor )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:date"),   m_oDate )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:id"),     m_oID )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			nullable<CString                       > m_sAuthor;
			nullable<SimpleTypes::CDateTime        > m_oDate;
			nullable<SimpleTypes::CDecimalNumber<> > m_oID;

		};
		
		
		
		class CCustomXmlInsRangeEnd : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CCustomXmlInsRangeEnd)
			CCustomXmlInsRangeEnd()
			{
			}
			virtual ~CCustomXmlInsRangeEnd()
			{
			}

		public:
			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("w:id"), m_oId );
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader) 
			{
				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<w:customXmlInsRangeEnd ");

				ComplexTypes_WriteAttribute( _T("w:id=\""), m_oId );

				sResult += _T(" />");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_w_customXmlInsRangeEnd;
			}
		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_ReadSingle( oReader, _T("w:id"), m_oId )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			nullable<SimpleTypes::CDecimalNumber<>        > m_oId;
		};

		
		
		
		class CCustomXmlInsRangeStart : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CCustomXmlInsRangeStart)
			CCustomXmlInsRangeStart()
			{
			}
			virtual ~CCustomXmlInsRangeStart()
			{
			}


		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("w:author"), m_sAuthor );
				oNode.ReadAttributeBase( _T("w:date"),   m_oDate );
				oNode.ReadAttributeBase( _T("w:id"),     m_oID );
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader) 
			{
				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<w:customXmlInsRangeStart ");

				if ( m_sAuthor.IsInit() )
				{
					sResult += "w:author=\"";
					sResult += m_sAuthor->GetString();
					sResult += "\" ";
				}

				if ( m_oDate.IsInit() )
				{
					sResult += "w:date=\"";
					sResult += m_oDate->ToString();
					sResult += "\" ";
				}

				if ( m_oID.IsInit() )
				{
					sResult += "w:id=\"";
					sResult += m_oID->ToString();
					sResult += "\" ";
				}

				sResult += _T("/>");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_w_customXmlInsRangeStart;
			}
		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("w:author"), m_sAuthor )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:date"),   m_oDate )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:id"),     m_oID )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			nullable<CString                       > m_sAuthor;
			nullable<SimpleTypes::CDateTime        > m_oDate;
			nullable<SimpleTypes::CDecimalNumber<> > m_oID;

		};
		
		
		
		class CCustomXmlMoveFromRangeEnd : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CCustomXmlMoveFromRangeEnd)
			CCustomXmlMoveFromRangeEnd()
			{
			}
			virtual ~CCustomXmlMoveFromRangeEnd()
			{
			}

		public:
			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("w:id"), m_oId );
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader) 
			{
				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<w:customXmlMoveFromRangeEnd ");

				ComplexTypes_WriteAttribute( _T("w:id=\""), m_oId );

				sResult += _T(" />");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_w_customXmlMoveFromRangeEnd;
			}
		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_ReadSingle( oReader, _T("w:id"), m_oId )
				WritingElement_ReadAttributes_End( oReader )
			}
		public:

			nullable<SimpleTypes::CDecimalNumber<>        > m_oId;
		};

		
		
		
		class CCustomXmlMoveFromRangeStart : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CCustomXmlMoveFromRangeStart)
			CCustomXmlMoveFromRangeStart()
			{
			}
			virtual ~CCustomXmlMoveFromRangeStart()
			{
			}


		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("w:author"), m_sAuthor );
				oNode.ReadAttributeBase( _T("w:date"),   m_oDate );
				oNode.ReadAttributeBase( _T("w:id"),     m_oID );
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader) 
			{
				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<w:customXmlMoveFromRangeStart ");

				if ( m_sAuthor.IsInit() )
				{
					sResult += "w:author=\"";
					sResult += m_sAuthor->GetString();
					sResult += "\" ";
				}

				if ( m_oDate.IsInit() )
				{
					sResult += "w:date=\"";
					sResult += m_oDate->ToString();
					sResult += "\" ";
				}

				if ( m_oID.IsInit() )
				{
					sResult += "w:id=\"";
					sResult += m_oID->ToString();
					sResult += "\" ";
				}

				sResult += _T("/>");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_w_customXmlMoveFromRangeStart;
			}
		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("w:author"), m_sAuthor )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:date"),   m_oDate )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:id"),     m_oID )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			nullable<CString                       > m_sAuthor;
			nullable<SimpleTypes::CDateTime        > m_oDate;
			nullable<SimpleTypes::CDecimalNumber<> > m_oID;

		};
		
		
		
		class CCustomXmlMoveToRangeEnd : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CCustomXmlMoveToRangeEnd)
			CCustomXmlMoveToRangeEnd()
			{
			}
			virtual ~CCustomXmlMoveToRangeEnd()
			{
			}

		public:
			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("w:id"), m_oId );
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader) 
			{
				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<w:customXmlMoveToRangeEnd ");

				ComplexTypes_WriteAttribute( _T("w:id=\""), m_oId );

				sResult += _T(" />");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_w_customXmlMoveToRangeEnd;
			}
		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_ReadSingle( oReader, _T("w:id"), m_oId )
				WritingElement_ReadAttributes_End( oReader )
			}
		public:

			nullable<SimpleTypes::CDecimalNumber<>        > m_oId;
		};

		
		
		
		class CCustomXmlMoveToRangeStart : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CCustomXmlMoveToRangeStart)
			CCustomXmlMoveToRangeStart()
			{
			}
			virtual ~CCustomXmlMoveToRangeStart()
			{
			}


		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("w:author"), m_sAuthor );
				oNode.ReadAttributeBase( _T("w:date"),   m_oDate );
				oNode.ReadAttributeBase( _T("w:id"),     m_oID );
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader) 
			{
				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}

			virtual CString      toXML() const
			{
				CString sResult = _T("<w:customXmlMoveToRangeStart ");

				if ( m_sAuthor.IsInit() )
				{
					sResult += "w:author=\"";
					sResult += m_sAuthor->GetString();
					sResult += "\" ";
				}

				if ( m_oDate.IsInit() )
				{
					sResult += "w:date=\"";
					sResult += m_oDate->ToString();
					sResult += "\" ";
				}

				if ( m_oID.IsInit() )
				{
					sResult += "w:id=\"";
					sResult += m_oID->ToString();
					sResult += "\" ";
				}

				sResult += _T("/>");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_w_customXmlMoveToRangeStart;
			}
		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("w:author"), m_sAuthor )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:date"),   m_oDate )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:id"),     m_oID )
				WritingElement_ReadAttributes_End( oReader )
			}
		public:

			nullable<CString                       > m_sAuthor;
			nullable<SimpleTypes::CDateTime        > m_oDate;
			nullable<SimpleTypes::CDecimalNumber<> > m_oID;

		};
		
		
		
		class CMoveFromRangeEnd : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CMoveFromRangeEnd)
			CMoveFromRangeEnd()
			{
			}
			virtual ~CMoveFromRangeEnd()
			{
			}

		public:
			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("w:displacedbyCustomXml"), m_oDisplacedByCustomXml );
				oNode.ReadAttributeBase( _T("w:id"),                   m_oId );
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader) 
			{
				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<w:moveFromRangeEnd ");

				ComplexTypes_WriteAttribute( _T("w:displacedbyCustomXml=\""), m_oDisplacedByCustomXml );
				ComplexTypes_WriteAttribute( _T("w:id=\""),                   m_oId );

				sResult += _T(" />");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_w_moveFromRangeEnd;
			}
		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("w:displacedbyCustomXml"), m_oDisplacedByCustomXml )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:id"),                   m_oId )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			nullable<SimpleTypes::CDisplacedByCustomXml<> > m_oDisplacedByCustomXml;
			nullable<SimpleTypes::CDecimalNumber<>        > m_oId;
		};

		
		
		
		class CMoveFromRangeStart : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CMoveFromRangeStart)
			CMoveFromRangeStart()
			{
			}
			virtual ~CMoveFromRangeStart()
			{
			}

		public:
			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("w:author"),               m_sAuthor );
				oNode.ReadAttributeBase( _T("w:colFirst"),             m_oColFirst );
				oNode.ReadAttributeBase( _T("w:colLast"),              m_oColLast );
				oNode.ReadAttributeBase( _T("w:date"),                 m_oDate );
				oNode.ReadAttributeBase( _T("w:displacedbyCustomXml"), m_oDisplacedByCustomXml );
				oNode.ReadAttributeBase( _T("w:id"),                   m_oId );
				oNode.ReadAttributeBase( _T("w:name"),                 m_sName );
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader) 
			{
				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<w:moveFromRangeStart ");

				if ( m_sAuthor.IsInit() )
				{
					sResult += _T("w:author=\"");
					sResult += m_sAuthor->GetString();
					sResult += _T("\" ");
				}

				ComplexTypes_WriteAttribute( _T("w:colFirst=\""),             m_oColFirst );
				ComplexTypes_WriteAttribute( _T("w:colLast=\""),              m_oColLast );
				ComplexTypes_WriteAttribute( _T("w:date=\""),                 m_oDate );
				ComplexTypes_WriteAttribute( _T("w:displacedbyCustomXml=\""), m_oDisplacedByCustomXml );
				ComplexTypes_WriteAttribute( _T("w:id=\""),                   m_oId );

				if ( m_sName.IsInit() )
				{
					sResult += _T("w:name=\"");
					sResult += m_sName->GetString();
					sResult += _T("\" ");
				}

				sResult += _T("/>");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_w_moveFromRangeStart;
			}
		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("w:author"),               m_sAuthor )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:colFirst"),             m_oColFirst )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:colLast"),              m_oColLast )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:date"),                 m_oDate )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:displacedbyCustomXml"), m_oDisplacedByCustomXml )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:id"),                   m_oId )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:name"),                 m_sName )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			nullable<CString                              > m_sAuthor;
			nullable<SimpleTypes::CDecimalNumber<>        > m_oColFirst;
			nullable<SimpleTypes::CDecimalNumber<>        > m_oColLast;
			nullable<SimpleTypes::CDateTime               > m_oDate;
			nullable<SimpleTypes::CDisplacedByCustomXml<> > m_oDisplacedByCustomXml;
			nullable<SimpleTypes::CDecimalNumber<>        > m_oId;
			nullable<CString                              > m_sName;
		};

		
		
		
		class CMoveToRangeEnd : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CMoveToRangeEnd)
			CMoveToRangeEnd()
			{
			}
			virtual ~CMoveToRangeEnd()
			{
			}

		public:
			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("w:displacedbyCustomXml"), m_oDisplacedByCustomXml );
				oNode.ReadAttributeBase( _T("w:id"),                   m_oId );
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader) 
			{
				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<w:moveToRangeEnd ");

				ComplexTypes_WriteAttribute( _T("w:displacedbyCustomXml=\""), m_oDisplacedByCustomXml );
				ComplexTypes_WriteAttribute( _T("w:id=\""),                   m_oId );

				sResult += _T(" />");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_w_moveToRangeEnd;
			}
		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("w:displacedbyCustomXml"), m_oDisplacedByCustomXml )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:id"),                   m_oId )
				WritingElement_ReadAttributes_End( oReader )
			}
		public:

			nullable<SimpleTypes::CDisplacedByCustomXml<> > m_oDisplacedByCustomXml;
			nullable<SimpleTypes::CDecimalNumber<>        > m_oId;
		};

		
		
		
		class CMoveToRangeStart : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CMoveToRangeStart)
			CMoveToRangeStart()
			{
			}
			virtual ~CMoveToRangeStart()
			{
			}

		public:
			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("w:author"),               m_sAuthor );
				oNode.ReadAttributeBase( _T("w:colFirst"),             m_oColFirst );
				oNode.ReadAttributeBase( _T("w:colLast"),              m_oColLast );
				oNode.ReadAttributeBase( _T("w:date"),                 m_oDate );
				oNode.ReadAttributeBase( _T("w:displacedbyCustomXml"), m_oDisplacedByCustomXml );
				oNode.ReadAttributeBase( _T("w:id"),                   m_oId );
				oNode.ReadAttributeBase( _T("w:name"),                 m_sName );
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader) 
			{
				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<w:moveToRangeStart ");

				if ( m_sAuthor.IsInit() )
				{
					sResult += _T("w:author=\"");
					sResult += m_sAuthor->GetString();
					sResult += _T("\" ");
				}

				ComplexTypes_WriteAttribute( _T("w:colFirst=\""),             m_oColFirst );
				ComplexTypes_WriteAttribute( _T("w:colLast=\""),              m_oColLast );
				ComplexTypes_WriteAttribute( _T("w:date=\""),                 m_oDate );
				ComplexTypes_WriteAttribute( _T("w:displacedbyCustomXml=\""), m_oDisplacedByCustomXml );
				ComplexTypes_WriteAttribute( _T("w:id=\""),                   m_oId );

				if ( m_sName.IsInit() )
				{
					sResult += _T("w:name=\"");
					sResult += m_sName->GetString();
					sResult += _T("\" ");
				}

				sResult += _T("/>");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_w_moveToRangeStart;
			}
		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("w:author"),               m_sAuthor )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:colFirst"),             m_oColFirst )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:colLast"),              m_oColLast )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:date"),                 m_oDate )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:displacedbyCustomXml"), m_oDisplacedByCustomXml )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:id"),                   m_oId )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:name"),                 m_sName )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			nullable<CString                              > m_sAuthor;
			nullable<SimpleTypes::CDecimalNumber<>        > m_oColFirst;
			nullable<SimpleTypes::CDecimalNumber<>        > m_oColLast;
			nullable<SimpleTypes::CDateTime               > m_oDate;
			nullable<SimpleTypes::CDisplacedByCustomXml<> > m_oDisplacedByCustomXml;
			nullable<SimpleTypes::CDecimalNumber<>        > m_oId;
			nullable<CString                              > m_sName;
		};

	} 
	
	namespace Logic
	{
		
		
		
		class CBookmarkEnd : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CBookmarkEnd)
			CBookmarkEnd()
			{
			}
			CBookmarkEnd(CBookmarkEnd* pOther)
			{
				m_oDisplacedByCustomXml = pOther->m_oDisplacedByCustomXml;
				m_oId                   = pOther->m_oId;
			}
			virtual ~CBookmarkEnd()
			{
			}

		public:
			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("w:displacedbyCustomXml"), m_oDisplacedByCustomXml );
				oNode.ReadAttributeBase( _T("w:id"),                   m_oId );
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader) 
			{
				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<w:bookmarkEnd ");

				ComplexTypes_WriteAttribute( _T("w:displacedbyCustomXml=\""), m_oDisplacedByCustomXml );
				ComplexTypes_WriteAttribute( _T("w:id=\""),                   m_oId );

				sResult += _T(" />");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_w_bookmarkEnd;
			}
		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("w:displacedbyCustomXml"), m_oDisplacedByCustomXml )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:id"),                   m_oId )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			nullable<SimpleTypes::CDisplacedByCustomXml<> > m_oDisplacedByCustomXml;
			nullable<SimpleTypes::CDecimalNumber<>        > m_oId;
		};

		
		
		
		class CBookmarkStart : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CBookmarkStart)
			CBookmarkStart()
			{
			}
			CBookmarkStart(CBookmarkStart *pOther)
			{
				m_oColFirst             = pOther->m_oColFirst;
				m_oColLast              = pOther->m_oColLast;
				m_oDisplacedByCustomXml = pOther->m_oDisplacedByCustomXml;
				m_oId                   = pOther->m_oId;
				m_sName                 = pOther->m_sName;
			}
			virtual ~CBookmarkStart()
			{
			}

		public:
			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("w:colFirst"),             m_oColFirst );
				oNode.ReadAttributeBase( _T("w:colLast"),              m_oColLast );
				oNode.ReadAttributeBase( _T("w:displacedbyCustomXml"), m_oDisplacedByCustomXml );
				oNode.ReadAttributeBase( _T("w:id"),                   m_oId );
				oNode.ReadAttributeBase( _T("w:name"),                 m_sName );
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader) 
			{
				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<w:bookmarkStart ");

				ComplexTypes_WriteAttribute( _T("w:colFirst=\""),             m_oColFirst );
				ComplexTypes_WriteAttribute( _T("w:colLast=\""),              m_oColLast );
				ComplexTypes_WriteAttribute( _T("w:displacedbyCustomXml=\""), m_oDisplacedByCustomXml );
				ComplexTypes_WriteAttribute( _T("w:id=\""),                   m_oId );

				if ( m_sName.IsInit() )
				{
					sResult += _T("w:name=\"");
					sResult += m_sName->GetString();
					sResult += _T("\" ");
				}

				sResult += _T("/>");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_w_bookmarkStart;
			}
		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("w:colFirst"),             m_oColFirst )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:colLast"),              m_oColLast )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:displacedbyCustomXml"), m_oDisplacedByCustomXml )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:id"),                   m_oId )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:name"),                 m_sName )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			nullable<SimpleTypes::CDecimalNumber<>        > m_oColFirst;
			nullable<SimpleTypes::CDecimalNumber<>        > m_oColLast;
			nullable<SimpleTypes::CDisplacedByCustomXml<> > m_oDisplacedByCustomXml;
			nullable<SimpleTypes::CDecimalNumber<>        > m_oId;
			nullable<CString                              > m_sName;
		};

	} 
	
	namespace Logic
	{
		
		
		
		class CPermEnd : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CPermEnd)
			CPermEnd()
			{
			}
			virtual ~CPermEnd()
			{
			}

		public:
			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("w:displacedbyCustomXml"), m_oDisplacedByCustomXml );
				oNode.ReadAttributeBase( _T("w:id"),                   m_sId );
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader) 
			{
				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<w:permEnd ");

				ComplexTypes_WriteAttribute( _T("w:displacedbyCustomXml=\""), m_oDisplacedByCustomXml );

				if ( m_sId.IsInit() )
				{
					sResult += _T("w:id=\"");
					sResult += m_sId->GetString();
					sResult += _T("\" ");
				}

				sResult += _T("/>");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_w_permEnd;
			}
		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("w:displacedbyCustomXml"), m_oDisplacedByCustomXml )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:id"),                   m_sId )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			nullable<SimpleTypes::CDisplacedByCustomXml<> > m_oDisplacedByCustomXml;
			nullable<CString                              > m_sId;
		};

		
		
		
		class CPermStart : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CPermStart)
			CPermStart()
			{
			}
			virtual ~CPermStart()
			{
			}

		public:
			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("w:colFirst"),             m_oColFirst );
				oNode.ReadAttributeBase( _T("w:colLast"),              m_oColLast );
				oNode.ReadAttributeBase( _T("w:displacedbyCustomXml"), m_oDisplacedByCustomXml );
				oNode.ReadAttributeBase( _T("w:ed"),                   m_sEd );
				oNode.ReadAttributeBase( _T("w:edGrp"),                m_oEdGrp );
				oNode.ReadAttributeBase( _T("w:id"),                   m_sId );
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader) 
			{
				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<w:permStart ");

				ComplexTypes_WriteAttribute( _T("w:colFirst=\""),             m_oColFirst );
				ComplexTypes_WriteAttribute( _T("w:colLast=\""),              m_oColLast );
				ComplexTypes_WriteAttribute( _T("w:displacedbyCustomXml=\""), m_oDisplacedByCustomXml );

				if ( m_sEd.IsInit() )
				{
					sResult += _T("w:ed=\"");
					sResult += m_sEd->GetString();
					sResult += _T("\" ");
				}

				ComplexTypes_WriteAttribute( _T("w:edGrp=\""),                m_oEdGrp );

				if ( m_sId.IsInit() )
				{
					sResult += _T("w:id=\"");
					sResult += m_sId->GetString();
					sResult += _T("\" ");
				}

				sResult += _T("/>");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_w_permStart;
			}
		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("w:colFirst"),             m_oColFirst )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:colLast"),              m_oColLast )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:displacedbyCustomXml"), m_oDisplacedByCustomXml )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:ed"),                   m_sEd )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:edGrp"),                m_oEdGrp )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:id"),                   m_sId )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			nullable<SimpleTypes::CDecimalNumber<>        > m_oColFirst;
			nullable<SimpleTypes::CDecimalNumber<>        > m_oColLast;
			nullable<SimpleTypes::CDisplacedByCustomXml<> > m_oDisplacedByCustomXml;
			nullable<CString                              > m_sEd;
			nullable<SimpleTypes::CEdGrp<>                > m_oEdGrp;
			nullable<CString                              > m_sId;
		};

	} 
	
	namespace Logic
	{
		
		
		
		class CProofErr : public WritingElement
		{
		public:
			WritingElement_AdditionConstructors(CProofErr)
			CProofErr()
			{
			}
			virtual ~CProofErr()
			{
			}

		public:
			virtual void         fromXML(XmlUtils::CXmlNode& oNode)
			{
				oNode.ReadAttributeBase( _T("w:type"), m_oType );
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader) 
			{
				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}
			virtual CString      toXML() const
			{
				CString sResult = _T("<w:proofErr ");

				if ( m_oType.IsInit() )
				{
					sResult += _T("w:type=\"");
					sResult += m_oType->ToString();
					sResult += _T("\" ");
				}

				sResult += _T("/>");

				return sResult;
			}

			virtual EElementType getType() const
			{
				return et_w_proofErr;
			}
		private:

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_ReadSingle( oReader, _T("w:type"), m_oType )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			nullable<SimpleTypes::CProofErr<> > m_oType;
		};
	} 
	namespace Logic
	{
		class CIns : public WritingElement
		{
		public:
			CIns()
			{
			}
			CIns(XmlUtils::CXmlNode &oNode)
			{
				fromXML( oNode );
			}
			CIns(XmlUtils::CXmlLiteReader& oReader)
			{
				fromXML( oReader );
			}
			virtual ~CIns()
			{
				Clear();
			}

		public:
			void Clear()
			{		
				for ( int nIndex = 0; nIndex < m_arrItems.GetSize(); nIndex++ )
				{
					if ( m_arrItems[nIndex] )
						delete m_arrItems[nIndex];

					m_arrItems[nIndex] = NULL;
				}

				m_arrItems.RemoveAll();
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode);
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader);
			virtual CString      toXML() const;
			virtual EElementType getType() const
			{
				return et_w_ins;
			}

		private: 

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_ReadSingle( oReader, _T("w:author"), m_oAuthor )
				WritingElement_ReadAttributes_ReadSingle( oReader, _T("w:date"), m_oDate )
				WritingElement_ReadAttributes_ReadSingle( oReader, _T("w:id"), m_oId )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			
			nullable<CString > m_oAuthor;
			nullable<SimpleTypes::CDateTime > m_oDate;
			nullable<SimpleTypes::CDecimalNumber<> > m_oId;

			
			CSimpleArray<WritingElement *>                     m_arrItems;
		};
		class CDel : public WritingElement
		{
		public:
			CDel()
			{
			}
			CDel(XmlUtils::CXmlNode &oNode)
			{
				fromXML( oNode );
			}
			CDel(XmlUtils::CXmlLiteReader& oReader)
			{
				fromXML( oReader );
			}
			virtual ~CDel()
			{
				Clear();
			}

		public:
			void Clear()
			{		
				for ( int nIndex = 0; nIndex < m_arrItems.GetSize(); nIndex++ )
				{
					if ( m_arrItems[nIndex] )
						delete m_arrItems[nIndex];

					m_arrItems[nIndex] = NULL;
				}

				m_arrItems.RemoveAll();
			}

		public:

			virtual void         fromXML(XmlUtils::CXmlNode& oNode);
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader);
			virtual CString      toXML() const;
			virtual EElementType getType() const
			{
				return et_w_del;
			}

		private: 

			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_ReadSingle( oReader, _T("w:author"), m_oAuthor )
				WritingElement_ReadAttributes_ReadSingle( oReader, _T("w:date"), m_oDate )
				WritingElement_ReadAttributes_ReadSingle( oReader, _T("w:id"), m_oId )
				WritingElement_ReadAttributes_End( oReader )
			}

		public:

			
			nullable<CString > m_oAuthor;
			nullable<SimpleTypes::CDateTime > m_oDate;
			nullable<SimpleTypes::CDecimalNumber<> > m_oId;

			
			CSimpleArray<WritingElement *>                     m_arrItems;
		};
	} 
	
} 

#endif 