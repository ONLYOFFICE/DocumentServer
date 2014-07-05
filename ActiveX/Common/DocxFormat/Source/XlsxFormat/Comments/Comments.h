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
#ifndef OOX_XLSXCOMMENTS_FILE_INCLUDE_H_
#define OOX_XLSXCOMMENTS_FILE_INCLUDE_H_

#include "../CommonInclude.h"
#include "../../DocxFormat/Logic/Vml.h"
#include "../SharedStrings/Si.h"

namespace OOX
{
	namespace Spreadsheet
	{
		class CCommentItem
		{
		public:
			nullable<unsigned int> m_nLeft;
			nullable<unsigned int> m_nTop;
			nullable<unsigned int> m_nRight;
			nullable<unsigned int> m_nBottom;
			nullable<unsigned int> m_nLeftOffset;
			nullable<unsigned int> m_nTopOffset;
			nullable<unsigned int> m_nRightOffset;
			nullable<unsigned int> m_nBottomOffset;
			nullable<double> m_dLeftMM;
			nullable<double> m_dTopMM;
			nullable<double> m_dWidthMM;
			nullable<double> m_dHeightMM;
			nullable<CString> m_sAuthor;
			nullable<unsigned int> m_nRow;
			nullable<unsigned int> m_nCol;
			nullable<bool> m_bMove;
			nullable<bool> m_bSize;
			nullable<CSi> m_oText;
			nullable<CString> m_sGfxdata;
			CCommentItem()
			{
			}
			bool IsValid()
			{
				return m_nRow.IsInit() && m_nCol.IsInit() && m_sAuthor.IsInit();
			}
		};
		class CAuthors : public WritingElementWithChilds<CString>
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CAuthors)
			CAuthors()
			{
			}
			virtual ~CAuthors()
			{
			}

		public:
			virtual CString      toXML() const
			{
				return _T("");
			}
			virtual void toXML(CStringWriter& writer) const
			{
				writer.WriteStringC(CString("<authors>"));
				for(int i = 0, length = m_arrItems.GetSize(); i < length; ++i)
				{
					CString sAuthor;sAuthor.Format(_T("<author>%s</author>"), XmlUtils::EncodeXmlString(*m_arrItems[i]));
					writer.WriteStringC(sAuthor);
				}
				writer.WriteStringC(CString("</authors>"));
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

					if ( _T("author") == sName )
						m_arrItems.Add(new CString(oReader.GetText2()));
				}
			}

			virtual EElementType getType () const
			{
				return et_Authors;
			}

		private:
			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
			}
		};
		class CComment : public WritingElement
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CComment)
			CComment()
			{
			}
			virtual ~CComment()
			{
			}

		public:
			virtual CString      toXML() const
			{
				return _T("");
			}
			virtual void toXML(CStringWriter& writer) const
			{
				if(m_oRef.IsInit() && m_oAuthorId.IsInit() && m_oText.IsInit())
				{
					writer.WriteStringC(CString("<comment"));
					if(m_oRef.IsInit())
					{
						CString sRef;sRef.Format(_T(" ref=\"%s\""), XmlUtils::EncodeXmlString(m_oRef->GetValue()));
						writer.WriteStringC(sRef);
					}
					if(m_oAuthorId.IsInit())
					{
						CString sAuthorId;sAuthorId.Format(_T(" authorId=\"%d\""), m_oAuthorId->GetValue());
						writer.WriteStringC(sAuthorId);
					}
					writer.WriteStringC(CString(">"));
					
					writer.WriteStringC(CString("<text>"));
					m_oText->toXML2(writer);
					writer.WriteStringC(CString("</text>"));
					writer.WriteStringC(CString("</comment>"));
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

					if ( _T("text") == sName )
						m_oText  =oReader;
				}
			}

			virtual EElementType getType () const
			{
				return et_Comment;
			}

		private:
			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )

					WritingElement_ReadAttributes_Read_if     ( oReader, _T("ref"),      m_oRef )
					WritingElement_ReadAttributes_Read_if     ( oReader, _T("authorId"),      m_oAuthorId )

					WritingElement_ReadAttributes_End( oReader )
			}
		public:
			nullable<SimpleTypes::CRelationshipId > m_oRef;
			nullable<SimpleTypes::CUnsignedDecimalNumber<> > m_oAuthorId;

			nullable<CSi> m_oText;
		};
		class CCommentList : public WritingElementWithChilds<CComment>
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CCommentList)
			CCommentList()
			{
			}
			virtual ~CCommentList()
			{
			}

		public:
			virtual CString      toXML() const
			{
				return _T("");
			}
			virtual void toXML(CStringWriter& writer) const
			{
				writer.WriteStringC(CString("<commentList>"));
				for(int i = 0, length = m_arrItems.GetSize(); i < length; ++i)
				{
					m_arrItems[i]->toXML(writer);
				}
				writer.WriteStringC(CString("</commentList>"));
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

					if ( _T("comment") == sName )
						m_arrItems.Add(new CComment(oReader));
				}
			}

			virtual EElementType getType () const
			{
				return et_CommentList;
			}

		private:
			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
			}
		};
		class CComments : public OOX::FileGlobalEnumerated, public OOX::Spreadsheet::IFileContainer
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
			}
		public:

			virtual void read(const CPath& oPath)
			{
				m_oReadPath = oPath;
				IFileContainer::Read( oPath );

				XmlUtils::CXmlLiteReader oReader;

				if ( !oReader.FromFile( oPath.GetPath() ) )
					return;

				if ( !oReader.ReadNextNode() )
					return;

				CWCharWrapper sName = oReader.GetName();
				if ( _T("comments") == sName )
				{
					ReadAttributes( oReader );

					if ( !oReader.IsEmptyNode() )
					{
						int nStylesDepth = oReader.GetDepth();
						while ( oReader.ReadNextSiblingNode( nStylesDepth ) )
						{
							sName = oReader.GetName();

							if ( _T("authors") == sName )
								m_oAuthors = oReader;
							else if ( _T("commentList") == sName )
								m_oCommentList = oReader;
						}
					}
				}		
			}
			virtual void write(const CPath& oPath, const CPath& oDirectory, CContentTypes& oContent) const
			{
				CStringWriter sXml;
				sXml.WriteStringC(_T("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><comments xmlns=\"http://schemas.openxmlformats.org/spreadsheetml/2006/main\">"));
				if(m_oAuthors.IsInit())
					m_oAuthors->toXML(sXml);
				if(m_oCommentList.IsInit())
					m_oCommentList->toXML(sXml);
				sXml.WriteStringC(_T("</comments>"));

				CDirectory::SaveToFile( oPath.GetPath(), sXml.GetCString() );
				oContent.Registration( type().OverrideType(), oDirectory, oPath.GetFilename() );
				IFileContainer::Write(oPath, oDirectory, oContent);
			}
			virtual const OOX::FileType type() const
			{
				return OOX::Spreadsheet::FileTypes::Comments;
			}
			virtual const CPath DefaultDirectory() const
			{
				return type().DefaultDirectory();
			}
			virtual const CPath DefaultFileName() const
			{
				return type().DefaultFileName();
			}
			const CPath& GetReadPath()
			{
				return m_oReadPath;
			}
		private:
			CPath									m_oReadPath;
			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
			}
		public:
			nullable<CAuthors > m_oAuthors;
			nullable<CCommentList > m_oCommentList;
		};
		class CLegacyDrawingWorksheet : public WritingElement
		{
		public:
			WritingElementSpreadsheet_AdditionConstructors(CLegacyDrawingWorksheet)
			CLegacyDrawingWorksheet()
			{
			}
			virtual ~CLegacyDrawingWorksheet()
			{
			}

		public:
			virtual CString      toXML() const
			{
				return _T("");
			}
			virtual void toXML(CStringWriter& writer) const
			{
				if(m_oId.IsInit())
				{
					CString sVal;sVal.Format(_T("<legacyDrawing r:id=\"%s\"/>"), m_oId->GetValue());
					writer.WriteStringC(sVal);
				}
				
			}
			virtual void         fromXML(XmlUtils::CXmlLiteReader& oReader)
			{
				ReadAttributes( oReader );

				if ( !oReader.IsEmptyNode() )
					oReader.ReadTillEnd();
			}

			virtual EElementType getType () const
			{
				return et_FromTo;
			}

		private:
			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
				
				WritingElement_ReadAttributes_Start( oReader )

					WritingElement_ReadAttributes_Read_if     ( oReader, _T("r:id"),      m_oId )

					WritingElement_ReadAttributes_End( oReader )
			}
		public:
			nullable<SimpleTypes::CRelationshipId > m_oId;
		};
		class CLegacyDrawing : public OOX::FileGlobalEnumerated, public OOX::Spreadsheet::IFileContainer
		{
		public:
			CLegacyDrawing()
			{
				m_mapComments = NULL;
			}
			CLegacyDrawing(const CPath& oPath)
			{
				m_mapComments = NULL;
				read( oPath );
			}
			virtual ~CLegacyDrawing()
			{
				ClearItems();
			}
		public:

			virtual void read(const CPath& oPath)
			{
				m_oReadPath = oPath;
				IFileContainer::Read( oPath );

				XmlUtils::CXmlLiteReader oReader;

				if ( !oReader.FromFile( oPath.GetPath() ) )
					return;

				if ( !oReader.ReadNextNode() )
					return;

				CWCharWrapper sName = oReader.GetName();
				if ( _T("xml") == sName )
				{
					ReadAttributes( oReader );

					if ( !oReader.IsEmptyNode() )
					{
						int nStylesDepth = oReader.GetDepth();
						while ( oReader.ReadNextSiblingNode( nStylesDepth ) )
						{
							sName = oReader.GetName();

							OOX::Vml::CShape *pItem = NULL;

							if ( _T("v:shape") == sName )
							{
								pItem = new OOX::Vml::CShape( oReader );

								if ( pItem )
									m_arrItems.Add( pItem );
							}
						}
					}
				}		
			}
			virtual void write(const CPath& oPath, const CPath& oDirectory, CContentTypes& oContent) const
			{
				if(NULL != m_mapComments && m_mapComments->GetCount() > 0)
				{
					CStringWriter sXml;
					sXml.WriteStringC(_T("<xml xmlns:v=\"urn:schemas-microsoft-com:vml\" xmlns:o=\"urn:schemas-microsoft-com:office:office\" xmlns:x=\"urn:schemas-microsoft-com:office:excel\"><o:shapelayout v:ext=\"edit\"><o:idmap v:ext=\"edit\" data=\"1\"/></o:shapelayout><v:shapetype id=\"_x0000_t202\" coordsize=\"21600,21600\" o:spt=\"202\" path=\"m,l,21600r21600,l21600,xe\"><v:stroke joinstyle=\"miter\"/><v:path gradientshapeok=\"t\" o:connecttype=\"rect\"/></v:shapetype>"));
					int nIndex = 1025;
					POSITION pos = m_mapComments->GetStartPosition();
					while ( NULL != pos )
					{
						CAtlMap<CString, OOX::Spreadsheet::CCommentItem*>::CPair* pPair = m_mapComments->GetNext( pos );
						if(NULL != pPair)
						{
							OOX::Spreadsheet::CCommentItem* comment = pPair->m_value;
							CString sStyle;
							if(comment->m_dLeftMM.IsInit())
							{
								SimpleTypes::CPoint oPoint;oPoint.FromMm(comment->m_dLeftMM.get());
								sStyle.AppendFormat(_T("margin-left:%spt;"), OOX::Spreadsheet::SpreadsheetCommon::WriteDouble(oPoint.ToPoints()));
							}
							if(comment->m_dTopMM.IsInit())
							{
								SimpleTypes::CPoint oPoint;oPoint.FromMm(comment->m_dTopMM.get());
								sStyle.AppendFormat(_T("margin-top:%spt;"), OOX::Spreadsheet::SpreadsheetCommon::WriteDouble(oPoint.ToPoints()));
							}
							if(comment->m_dWidthMM.IsInit())
							{
								SimpleTypes::CPoint oPoint;oPoint.FromMm(comment->m_dWidthMM.get());
								sStyle.AppendFormat(_T("width:%spt;"), OOX::Spreadsheet::SpreadsheetCommon::WriteDouble(oPoint.ToPoints()));
							}
							if(comment->m_dHeightMM.IsInit())
							{
								SimpleTypes::CPoint oPoint;oPoint.FromMm(comment->m_dHeightMM.get());
								sStyle.AppendFormat(_T("height:%spt;"), OOX::Spreadsheet::SpreadsheetCommon::WriteDouble(oPoint.ToPoints()));
							}
							CString sClientData;
							sClientData.Append(_T("<x:ClientData ObjectType=\"Note\">"));
							if(comment->m_bMove.IsInit() && true == comment->m_bMove.get())
								sClientData.Append(_T("<x:MoveWithCells/>"));
							if(comment->m_bSize.IsInit() && true == comment->m_bSize.get())
								sClientData.Append(_T("<x:SizeWithCells/>"));
							if(comment->m_nLeft.IsInit() && comment->m_nLeftOffset.IsInit() && comment->m_nTop.IsInit() && comment->m_nTopOffset.IsInit() &&
								comment->m_nRight.IsInit() && comment->m_nRightOffset.IsInit() && comment->m_nBottom.IsInit() && comment->m_nBottomOffset.IsInit())
									sClientData.AppendFormat(_T("<x:Anchor>%d, %d, %d, %d, %d, %d, %d, %d</x:Anchor>"), 
									comment->m_nLeft.get(), comment->m_nLeftOffset.get(), comment->m_nTop.get(), comment->m_nTopOffset.get(),
									comment->m_nRight.get(), comment->m_nRightOffset.get(), comment->m_nBottom.get(), comment->m_nBottomOffset.get());
							sClientData.Append(_T("<x:AutoFill>False</x:AutoFill>"));
							if(comment->m_nRow.IsInit())
								sClientData.AppendFormat(_T("<x:Row>%d</x:Row>"), comment->m_nRow.get());
							if(comment->m_nCol.IsInit())
								sClientData.AppendFormat(_T("<x:Column>%d</x:Column>"), comment->m_nCol.get());
							sClientData.Append(_T("</x:ClientData>"));
							CString sGfxdata;
							if(comment->m_sGfxdata.IsInit())
								sGfxdata.Format(_T("o:gfxdata=\"%s\""), comment->m_sGfxdata.get2());
							CString sShape;sShape.Format(_T("<v:shape id=\"_x0000_s%d\" type=\"#_x0000_t202\" style='position:absolute;%sz-index:4;visibility:hidden' %s fillcolor=\"#ffffe1\" o:insetmode=\"auto\"><v:fill color2=\"#ffffe1\"/><v:shadow on=\"t\" color=\"black\" obscured=\"t\"/><v:path o:connecttype=\"none\"/><v:textbox style='mso-direction-alt:auto'><div style='text-align:left'></div></v:textbox>%s</v:shape>"), nIndex, sStyle, sGfxdata, sClientData);
							sXml.WriteStringC(sShape);
							nIndex++;
						}
					}
					sXml.WriteStringC(_T("</xml>"));

					CDirectory::SaveToFile( oPath.GetPath(), sXml.GetCString() );
					oContent.AddDefault( oPath.GetFilename() );
					IFileContainer::Write(oPath, oDirectory, oContent);
				}
			}
			virtual const OOX::FileType type() const
			{
				return OOX::Spreadsheet::FileTypes::LegacyDrawings;
			}
			virtual const CPath DefaultDirectory() const
			{
				return type().DefaultDirectory();
			}
			virtual const CPath DefaultFileName() const
			{
				return type().DefaultFileName();
			}
			const CPath& GetReadPath()
			{
				return m_oReadPath;
			}
		private:
			CPath									m_oReadPath;
			void ReadAttributes(XmlUtils::CXmlLiteReader& oReader)
			{
			}
			void ClearItems()
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
			CSimpleArray<OOX::Vml::CShape *>         m_arrItems;
			CAtlMap<CString, OOX::Spreadsheet::CCommentItem*>* m_mapComments;
		};
	} 
} 

#endif // OOX_XLSXCOMMENTS_FILE_INCLUDE_H_