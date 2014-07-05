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
#ifndef OOX_COMMENTS_FILE_INCLUDE_H_
#define OOX_COMMENTS_FILE_INCLUDE_H_

#include "File.h"
#include "../Base/Nullable.h"

#include "WritingElement.h"

#include "Logic/Annotations.h"
#include "Logic/Paragraph.h"
#include "Logic/Sdt.h"
#include "Logic/Table.h"
#include "Math/oMathPara.h"
#include "Math/oMath.h"

namespace OOX
{
	class CComment : public WritingElement
	{
	public:
		WritingElement_AdditionConstructors(CComment)
			CComment()
		{
		}
		virtual ~CComment()
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
		virtual void         fromXML(XmlUtils::CXmlNode& oNode)
		{
		}
		virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader) 
		{
			ReadAttributes( oReader );

			if ( oReader.IsEmptyNode() )
				return;

			int nParentDepth = oReader.GetDepth();
			while( oReader.ReadNextSiblingNode( nParentDepth ) )
			{
				CString sName = oReader.GetName();
				WritingElement *pItem = NULL;

				if ( _T("w:bookmarkEnd") == sName )
					pItem = new Logic::CBookmarkEnd( oReader );
				else if ( _T("w:bookmarkStart") == sName )
					pItem = new Logic::CBookmarkStart( oReader );
				else if ( _T("w:commentRangeEnd") == sName )
					pItem = new Logic::CCommentRangeEnd( oReader );
				else if ( _T("w:commentRangeStart") == sName )
					pItem = new Logic::CCommentRangeStart( oReader );
				
				
				else if ( _T("w:customXmlDelRangeEnd") == sName )
					pItem = new Logic::CCustomXmlDelRangeEnd( oReader );
				else if ( _T("w:customXmlDelRangeStart") == sName )
					pItem = new Logic::CCustomXmlDelRangeStart( oReader );
				else if ( _T("w:customXmlInsRangeEnd") == sName )
					pItem = new Logic::CCustomXmlInsRangeEnd( oReader );
				else if ( _T("w:customXmlInsRangeStart") == sName )
					pItem = new Logic::CCustomXmlInsRangeStart( oReader );
				else if ( _T("w:customXmlMoveFromRangeEnd") == sName ) 
					pItem = new Logic::CCustomXmlMoveFromRangeEnd( oReader );
				else if ( _T("w:customXmlMoveFromRangeStart") == sName )
					pItem = new Logic::CCustomXmlMoveFromRangeStart( oReader );
				else if ( _T("w:customXmlMoveToRangeEnd") == sName ) 
					pItem = new Logic::CCustomXmlMoveToRangeEnd( oReader );
				else if ( _T("w:customXmlMoveToRangeStart") == sName )
					pItem = new Logic::CCustomXmlMoveToRangeStart( oReader );
				else if ( _T("w:del") == sName )
					pItem = new Logic::CDel( oReader );
				else if ( _T("w:ins") == sName )
					pItem = new Logic::CIns( oReader );
				
				
				else if ( _T("w:moveFromRangeEnd") == sName )
					pItem = new Logic::CMoveToRangeEnd( oReader );
				else if ( _T("w:moveFromRangeStart") == sName )
					pItem = new Logic::CMoveToRangeStart( oReader );
				
				
				else if ( _T("w:moveToRangeEnd") == sName )
					pItem = new Logic::CMoveToRangeEnd( oReader );
				else if ( _T("w:moveToRangeStart") == sName )
					pItem = new Logic::CMoveToRangeStart( oReader );
				else if ( _T("m:oMath") == sName )
					pItem = new Logic::COMath( oReader );
				else if ( _T("m:oMathPara") == sName )
					pItem = new Logic::COMathPara( oReader );
				else if ( _T("w:p") == sName )
					pItem = new Logic::CParagraph( oReader );
				else if ( _T("w:permEnd") == sName )
					pItem = new Logic::CPermEnd( oReader );
				else if ( _T("w:permStart") == sName )
					pItem = new Logic::CPermStart( oReader );
				else if ( _T("w:proofErr") == sName )
					pItem = new Logic::CProofErr( oReader );
				else if ( _T("w:sdt") == sName )
					pItem = new Logic::CSdt( oReader );
				else if ( _T("w:tbl") == sName )
					pItem = new Logic::CTbl( oReader );

				if ( pItem )
					m_arrItems.Add( pItem );
			}
		}
		virtual CString      toXML() const
		{
			CString sResult = _T("");
			return sResult;
		}

		virtual EElementType getType() const
		{
			return et_w_comment;
		}
		CString getText() const
		{
			bool bFirstPar = true;
			CString sRes = getTextArr(m_arrItems, bFirstPar);
			return sRes;
		}
	private:
		CString getTextArr(const CSimpleArray<WritingElement* >& arrItems, bool& bFirstPar) const
		{
			CString sRes;
			for(int i = 0, length = arrItems.GetSize(); i < length; ++i)
			{
				WritingElement* item = arrItems[i];
				switch(item->getType())
				{
				case OOX::et_w_sdt:
					{
						OOX::Logic::CSdt* pStd = static_cast<OOX::Logic::CSdt*>(item);
						if(pStd->m_oSdtContent.IsInit())
							sRes += getTextArr(pStd->m_oSdtContent->m_arrItems, bFirstPar);
					}
					break;
				case OOX::et_w_smartTag:
					{
						OOX::Logic::CSmartTag* pSmartTag = static_cast<OOX::Logic::CSmartTag*>(item);
						sRes += getTextArr(pSmartTag->m_arrItems, bFirstPar);
					}
					break;
				case OOX::et_w_dir:
					{
						OOX::Logic::CDir* pDir = static_cast<OOX::Logic::CDir*>(item);
						sRes += getTextArr(pDir->m_arrItems, bFirstPar);
					}
					break;
				case OOX::et_w_bdo:
					{
						OOX::Logic::CBdo* pBdo = static_cast<OOX::Logic::CBdo*>(item);
						sRes += getTextArr(pBdo->m_arrItems, bFirstPar);
					}
					break;
				case OOX::et_w_tbl:
					{
						OOX::Logic::CTbl* pTbl = static_cast<OOX::Logic::CTbl*>(item);
						sRes += getTextArr(pTbl->m_arrItems, bFirstPar);
					}
					break;
				case OOX::et_w_tr:
					{
						OOX::Logic::CTr* pTr = static_cast<OOX::Logic::CTr*>(item);
						sRes += getTextArr(pTr->m_arrItems, bFirstPar);
					}
					break;
				case OOX::et_w_tc:
					{
						OOX::Logic::CTc* pTc = static_cast<OOX::Logic::CTc*>(item);
						sRes += getTextArr(pTc->m_arrItems, bFirstPar);
					}
					break;
				case OOX::et_w_hyperlink:
					{
						OOX::Logic::CHyperlink* pHyperlink = static_cast<OOX::Logic::CHyperlink*>(item);
						sRes += getTextArr(pHyperlink->m_arrItems, bFirstPar);
					}
					break;
				case OOX::et_w_p:
					{
						if(bFirstPar)
							bFirstPar = false;
						else
							sRes += "\n";
						OOX::Logic::CParagraph* pParagraph = static_cast<OOX::Logic::CParagraph*>(item);
						sRes += getTextArr(pParagraph->m_arrItems, bFirstPar);
					}
					break;
				case OOX::et_w_r:
					{
						OOX::Logic::CRun* pRun = static_cast<OOX::Logic::CRun*>(item);
						sRes += getTextArr(pRun->m_arrItems, bFirstPar);
					}
					break;
				case OOX::et_w_br:
					sRes += "\n";
					break;
				case OOX::et_w_nonBreakHyphen:
				case OOX::et_w_softHyphen:
					sRes += "-";
					break;
				case OOX::et_w_tab:
					sRes += " ";
					break;
				case OOX::et_w_sym:
					{
						OOX::Logic::CSym* oSym = static_cast<OOX::Logic::CSym*>(item);
						sRes.AppendChar(0x0FFF & oSym->m_oChar->GetValue());
					}
					break;
				case OOX::et_w_t:
					{
						CString& sText = static_cast<OOX::Logic::CText*>(item)->m_sText;
						if(!sText.IsEmpty())
						{
							sRes += sText;
						}
					}
					break;
				}
			}
			return sRes;
		}
		void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
		{
			
			WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("w:author"),      m_oAuthor )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:date"), m_oDate )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:id"),      m_oId )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w:initials"),      m_oInitials )
				WritingElement_ReadAttributes_End( oReader )
		}

	public:

		

		nullable<CString > m_oAuthor;
		nullable<SimpleTypes::CDateTime > m_oDate;
		nullable<SimpleTypes::CDecimalNumber<> > m_oId;
		nullable<CString > m_oInitials;

		
		CSimpleArray<WritingElement* > m_arrItems;

	};

	class CComments : public OOX::File
	{
	public:
		CComments()
		{
		}
		CComments(const CPath& oPath)
		{
			read( oPath );
		}
		virtual ~CComments()
		{
			for(int i = 0, length = m_arrComments.GetSize(); i < length; ++i)
				delete m_arrComments[i];
			m_arrComments.RemoveAll();
		}
	public:

		virtual void read(const CPath& oFilePath)
		{
#ifdef USE_LITE_READER

			XmlUtils::CXmlLiteReader oReader;
			
			if ( !oReader.FromFile( oFilePath.GetPath() ) )
				return;

			if ( !oReader.ReadNextNode() )
				return;

			CWCharWrapper sName = oReader.GetName();
			if ( _T("w:comments") == sName && !oReader.IsEmptyNode() )
			{
				int nNumberingDepth = oReader.GetDepth();
				while ( oReader.ReadNextSiblingNode( nNumberingDepth ) )
				{
					sName = oReader.GetName();
					if ( _T("w:comment") == sName )
						m_arrComments.Add( new CComment(oReader) );
				}
			}
#endif
		}

		virtual void write(const CPath& oFilePath, const CPath& oDirectory, CContentTypes& oContent) const
		{
		}

	public:

		virtual const OOX::FileType type() const
		{
			return FileTypes::Comments;
		}
		virtual const CPath DefaultDirectory() const
		{
			return type().DefaultDirectory();
		}
		virtual const CPath DefaultFileName() const
		{
			return type().DefaultFileName();
		}

	public:

		CSimpleArray<CComment*> m_arrComments;

	};
	class CCommentExt : public WritingElement
	{
	public:
		WritingElement_AdditionConstructors(CCommentExt)
			CCommentExt()
		{
		}
		virtual ~CCommentExt()
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
			CString sResult = _T("");
			return sResult;
		}

		virtual EElementType getType() const
		{
			return et_w15_commentEx;
		}
	private:
		void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
		{
			
			WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("w15:paraId"),      m_oParaId )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w15:paraIdParent"), m_oParaIdParent )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w15:done"), m_oDone )
				WritingElement_ReadAttributes_End( oReader )
		}

	public:

		

		nullable<SimpleTypes::CLongHexNumber<> > m_oParaId;
		nullable<SimpleTypes::CLongHexNumber<> > m_oParaIdParent;
		nullable<SimpleTypes::COnOff<> > m_oDone;
	};

	class CCommentsExt : public OOX::File
	{
	public:
		CCommentsExt()
		{
		}
		CCommentsExt(const CPath& oPath)
		{
			read( oPath );
		}
		virtual ~CCommentsExt()
		{
			for(int i = 0, length = m_arrComments.GetSize(); i < length; ++i)
				delete m_arrComments[i];
			m_arrComments.RemoveAll();
		}
	public:

		virtual void read(const CPath& oFilePath)
		{
#ifdef USE_LITE_READER

			XmlUtils::CXmlLiteReader oReader;

			if ( !oReader.FromFile( oFilePath.GetPath() ) )
				return;

			if ( !oReader.ReadNextNode() )
				return;

			CWCharWrapper sName = oReader.GetName();
			if ( _T("w15:commentsEx") == sName && !oReader.IsEmptyNode() )
			{
				int nNumberingDepth = oReader.GetDepth();
				while ( oReader.ReadNextSiblingNode( nNumberingDepth ) )
				{
					sName = oReader.GetName();
					if ( _T("w15:commentEx") == sName )
						m_arrComments.Add( new CCommentExt(oReader) );
				}
			}
#endif
		}

		virtual void write(const CPath& oFilePath, const CPath& oDirectory, CContentTypes& oContent) const
		{
		}

	public:

		virtual const OOX::FileType type() const
		{
			return FileTypes::CommentsExt;
		}
		virtual const CPath DefaultDirectory() const
		{
			return type().DefaultDirectory();
		}
		virtual const CPath DefaultFileName() const
		{
			return type().DefaultFileName();
		}

	public:

		CSimpleArray<CCommentExt*> m_arrComments;

	};

	class CPresenceInfo : public WritingElement
	{
	public:
		WritingElement_AdditionConstructors(CPresenceInfo)
			CPresenceInfo()
		{
		}
		virtual ~CPresenceInfo()
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
			CString sResult = _T("");
			return sResult;
		}

		virtual EElementType getType() const
		{
			return et_w15_presenceInfo;
		}
	private:
		void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
		{
			
			WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("w15:providerId"),      m_oProviderId )
				WritingElement_ReadAttributes_Read_else_if( oReader, _T("w15:userId"), m_oUserId )
				WritingElement_ReadAttributes_End( oReader )
		}

	public:

		

		nullable<CString > m_oProviderId;
		nullable<CString > m_oUserId;
	};

	class CPerson : public WritingElement
	{
	public:
		WritingElement_AdditionConstructors(CPerson)
			CPerson()
		{
		}
		virtual ~CPerson()
		{
		}

	public:
		virtual void         fromXML(XmlUtils::CXmlNode& oNode)
		{
		}
		virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader) 
		{
			ReadAttributes( oReader );

			if ( oReader.IsEmptyNode() )
				return;

			int nParentDepth = oReader.GetDepth();
			while( oReader.ReadNextSiblingNode( nParentDepth ) )
			{
				CString sName = oReader.GetName();
				if ( _T("w15:presenceInfo") == sName )
					m_oPresenceInfo = oReader;
			}
		}
		virtual CString      toXML() const
		{
			CString sResult = _T("");
			return sResult;
		}

		virtual EElementType getType() const
		{
			return et_w15_person;
		}
	private:
		void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
		{
			
			WritingElement_ReadAttributes_Start( oReader )
				WritingElement_ReadAttributes_Read_if     ( oReader, _T("w15:author"),      m_oAuthor )
				WritingElement_ReadAttributes_End( oReader )
		}

	public:

		
		nullable<CString > m_oAuthor;

		nullable<CPresenceInfo> m_oPresenceInfo;
	};
	class CPeople : public OOX::File
	{
	public:
		CPeople()
		{
		}
		CPeople(const CPath& oPath)
		{
			read( oPath );
		}
		virtual ~CPeople()
		{
			for(int i = 0, length = m_arrPeoples.GetSize(); i < length; ++i)
				delete m_arrPeoples[i];
			m_arrPeoples.RemoveAll();
		}
	public:

		virtual void read(const CPath& oFilePath)
		{
#ifdef USE_LITE_READER
			XmlUtils::CXmlLiteReader oReader;

			if ( !oReader.FromFile( oFilePath.GetPath() ) )
				return;

			if ( !oReader.ReadNextNode() )
				return;

			CWCharWrapper sName = oReader.GetName();
			if ( _T("w15:people") == sName && !oReader.IsEmptyNode() )
			{
				int nNumberingDepth = oReader.GetDepth();
				while ( oReader.ReadNextSiblingNode( nNumberingDepth ) )
				{
					sName = oReader.GetName();
					if ( _T("w15:person") == sName )
						m_arrPeoples.Add( new CPerson(oReader) );
				}
			}
#endif
		}

		virtual void write(const CPath& oFilePath, const CPath& oDirectory, CContentTypes& oContent) const
		{
		}

	public:

		virtual const OOX::FileType type() const
		{
			return FileTypes::People;
		}
		virtual const CPath DefaultDirectory() const
		{
			return type().DefaultDirectory();
		}
		virtual const CPath DefaultFileName() const
		{
			return type().DefaultFileName();
		}

	public:

		CSimpleArray<CPerson*> m_arrPeoples;
	};

} 

#endif // OOX_COMMENTS_FILE_INCLUDE_H_