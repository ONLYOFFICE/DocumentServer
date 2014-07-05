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
#ifndef PPTX_COMMENTS_COMMENTSAUTHORS_H_
#define PPTX_COMMENTS_COMMENTSAUTHORS_H_

#include "WrapperFile.h"
#include "FileContainer.h"

namespace PPTX
{
	namespace Logic
	{
		class CommentAuthor : public WrapperWritingElement
		{
		public:
			PPTX_LOGIC_BASE(CommentAuthor)
		private:
			nullable_int	id;
			nullable_int	last_idx;
			nullable_int	clr_idx;

			nullable_string	name;
			nullable_string	initials;			

		public:
			
			virtual void fromXML(XmlUtils::CXmlNode& node)
			{
				node.ReadAttributeBase(L"id", id);
				node.ReadAttributeBase(L"lastIdx", last_idx);
				node.ReadAttributeBase(L"clrIdx", clr_idx);
				node.ReadAttributeBase(L"name", name);
				node.ReadAttributeBase(L"initials", initials);
			}

			virtual CString toXML() const
			{
				return _T("");
			}

			virtual void toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const
			{
				pWriter->StartNode(_T("p:cmAuthor"));

				pWriter->StartAttributes();
				pWriter->WriteAttribute(_T("id"), id);
				pWriter->WriteAttribute(_T("name"), name);
				pWriter->WriteAttribute(_T("initials"), initials);
				pWriter->WriteAttribute(_T("lastIdx"), last_idx);
				pWriter->WriteAttribute(_T("clrIdx"), clr_idx);
				pWriter->EndAttributes();

				pWriter->EndNode(_T("p:cmAuthor"));
			}

			virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
			{
				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeStart);
				pWriter->WriteInt2(0, id);
				pWriter->WriteInt2(1, last_idx);
				pWriter->WriteInt2(2, clr_idx);
				pWriter->WriteString2(3, name);
				pWriter->WriteString2(4, initials);
				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeEnd);	
			}
			virtual void fromPPTY(NSBinPptxRW::CBinaryFileReader* pReader)
			{
				LONG _end_rec = pReader->GetPos() + pReader->GetLong() + 4;

				pReader->Skip(1); 

				while (true)
				{
					BYTE _at = pReader->GetUChar();
					if (_at == NSBinPptxRW::g_nodeAttributeEnd)
						break;

					switch (_at)
					{
					case 0:
						id = pReader->GetLong();
						break;
					case 1:
						last_idx = pReader->GetLong();
						break;
					case 2:
						clr_idx = pReader->GetLong();
						break;
					case 3:
						name = pReader->GetString2();
						break;
					case 4:
						initials = pReader->GetString2();
						break;
					default:
						break;
					}
				}

				pReader->Seek(_end_rec);
			}

			virtual void FillParentPointersForChilds()
			{
			}
		};
	}
	
	class Authors : public WrapperFile
	{
	private:
		CAtlArray<PPTX::Logic::CommentAuthor> m_arAuthors;

	public:
		Authors()
		{
		}
		Authors(const OOX::CPath& filename, FileMap& map)
		{
			read(filename, map);
		}
		virtual ~Authors()
		{
		}

	public:
		virtual void read(const OOX::CPath& filename, FileMap& map)
		{
			XmlUtils::CXmlNode oNode;
			oNode.FromXmlFile2(filename.m_strFilename);

			XmlUtils::CXmlNodes oNodes;
			oNode.GetNodes(_T("p:cmAuthor"), oNodes);
			int nCount = oNodes.GetCount();
			for (int i = 0; i < nCount; ++i)
			{
				XmlUtils::CXmlNode oCm;
				oNodes.GetAt(i, oCm);

				m_arAuthors.Add();
				m_arAuthors[m_arAuthors.GetCount() - 1].fromXML(oCm);
			}		
		}
		virtual void write(const OOX::CPath& filename, const OOX::CPath& directory, OOX::ContentTypes::File& content)const
		{			
		}
		
	public:
		virtual const OOX::FileType type() const
		{
			return OOX::FileTypes::CommentAuthors;
		}
		virtual const OOX::CPath DefaultDirectory() const
		{
			return type().DefaultDirectory();
		}
		virtual const OOX::CPath DefaultFileName() const
		{
			return type().DefaultFileName();
		}

	public:
		virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
		{
			pWriter->WriteRecordArray(0, 0, m_arAuthors);
		}

		virtual void toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const
		{
			pWriter->StartNode(_T("p:cmAuthorLst"));

			pWriter->StartAttributes();
			pWriter->WriteAttribute(_T("xmlns:a"), OOX::g_Namespaces.a.m_strLink);
			pWriter->WriteAttribute(_T("xmlns:r"), OOX::g_Namespaces.r.m_strLink);
			pWriter->WriteAttribute(_T("xmlns:p"), OOX::g_Namespaces.p.m_strLink);
			pWriter->EndAttributes();

			pWriter->WriteArray2(m_arAuthors);

			pWriter->EndNode(_T("p:cmAuthorLst"));
		}

		virtual void fromPPTY(NSBinPptxRW::CBinaryFileReader* pReader)
		{
			LONG end = pReader->GetPos() + pReader->GetLong() + 4;

			while (pReader->GetPos() < end)
			{
				BYTE _rec = pReader->GetUChar();

				switch (_rec)
				{
					case 0:
					{
						pReader->Skip(4); 
						ULONG lCount = pReader->GetULong();

						for (ULONG i = 0; i < lCount; ++i)
						{
							pReader->Skip(1);
							m_arAuthors.Add();
							m_arAuthors[m_arAuthors.GetCount() - 1].fromPPTY(pReader);
						}
						
						break;
					}
					default:
					{
						pReader->SkipRecord();
						break;
					}
				}
			}

			pReader->Seek(end);
		}
	};
} 

#endif // PPTX_COMMENTS_COMMENTSAUTHORS_H_