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
#ifndef PPTX_TABLESTYLES_FILE_INCLUDE_H_
#define PPTX_TABLESTYLES_FILE_INCLUDE_H_

#include "WrapperFile.h"
#include "Logic/TableStyle.h"
#include "Theme.h"
#include "DocxFormat/FileTypes.h"

namespace PPTX
{
	class TableStyles: public WrapperFile
	{
	public:
		TableStyles()
		{
		}
		TableStyles(const OOX::CPath& filename, FileMap& map)
		{
			read(filename, map);
		}
		virtual ~TableStyles()
		{
		}

	public:
		virtual void read(const OOX::CPath& filename, FileMap& map)
		{
			XmlUtils::CXmlNode oNode;
			oNode.FromXmlFile2(filename.m_strFilename);

			oNode.ReadAttributeBase(L"def", def);

			Styles.RemoveAll();
			Logic::TableStyle Style;

			XmlUtils::CXmlNodes oNodes;
			oNode.GetNodes(_T("*"), oNodes);

			int nCount = oNodes.GetCount();
			for (int i = 0; i < nCount; ++i)
			{
				XmlUtils::CXmlNode oMem;
				oNodes.GetAt(i, oMem);

				Style = oMem;
				Styles.SetAt(Style.styleId, Style);
			}

			POSITION pos = Styles.GetStartPosition();
			while (NULL != pos)
			{
				Styles.GetNextValue(pos).SetParentFilePointer(this);
			}
		}
		virtual void write(const OOX::CPath& filename, const OOX::CPath& directory, OOX::ContentTypes::File& content)const
		{
			CString strValue = _T("");
			POSITION pos = Styles.GetStartPosition();
			while (NULL != pos)
			{
				strValue += Styles.GetNextValue(pos).toXML();
			}

			XmlUtils::CAttribute oAttr;
			oAttr.Write(_T("def"), def);

			XmlUtils::SaveToFile(filename.m_strFilename, XmlUtils::CreateNode(_T("a:tblStyleLst"), oAttr, strValue));
			
			content.registration(type().OverrideType(), directory, filename);
			m_written = true;
			m_WrittenFileName = filename.GetFilename();
		}

	public:
		virtual const OOX::FileType type() const
		{
			return OOX::FileTypes::TableStyles;
		}
		virtual const OOX::CPath DefaultDirectory() const
		{
			return type().DefaultDirectory();
		}
		virtual const OOX::CPath DefaultFileName() const
		{
			return type().DefaultFileName();
		}

		virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
		{
			pWriter->StartRecord(NSBinPptxRW::NSMainTables::TableStyles);

			pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeStart);
			pWriter->WriteString1(0, def);
			pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeEnd);

			pWriter->StartRecord(0);
			ULONG len = (ULONG)Styles.GetCount();

			POSITION pos = Styles.GetStartPosition();
			while (NULL != pos)
			{
				const CAtlMap<CString, Logic::TableStyle>::CPair* pPair = Styles.GetNext(pos);
				pWriter->WriteRecord1(1, pPair->m_value);
			}

			pWriter->EndRecord();

			pWriter->EndRecord();
		}

		virtual void fromPPTY(NSBinPptxRW::CBinaryFileReader* pReader)
		{
			pReader->Skip(1);

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
					{
						def = pReader->GetString2();
						break;
					}
					default:
						break;
				}
			}

			BYTE _type = pReader->GetUChar(); 
			pReader->Skip(4); 

			LONG lPos = pReader->GetPos();
			CAtlArray<CString> arrIds;

			while (pReader->GetPos() < _end_rec)
			{
				pReader->Skip(1);

				LONG _end_rec2 = pReader->GetPos() + pReader->GetLong() + 4;
				pReader->Skip(1); 

				while (true)
				{
					BYTE _at = pReader->GetUChar();
					if (_at == NSBinPptxRW::g_nodeAttributeEnd)
						break;

					switch (_at)
					{
						case 0:
						{
							arrIds.Add(pReader->GetString2());
							break;
						}
						case 1:
						{
							CString styleName = pReader->GetString2();
							break;
						}
						default:
							break;
					}
				}

				pReader->Seek(_end_rec2);
			}

			pReader->Seek(lPos);
			size_t nIndex = 0;

			while (pReader->GetPos() < _end_rec)
			{
				pReader->Skip(1);
	
				Logic::TableStyle _style;
				Styles.SetAt(arrIds[nIndex], _style);

				CAtlMap<CString, Logic::TableStyle>::CPair* pPair = Styles.Lookup(arrIds[nIndex]);
				pPair->m_value.m_name = _T("a:tblStyle");
				pPair->m_value.fromPPTY(pReader);

				nIndex++;
			}

			pReader->Seek(_end_rec);
		}

		virtual void toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const
		{
			pWriter->StartNode(_T("a:tblStyleLst"));

			pWriter->StartAttributes();

			pWriter->WriteAttribute(_T("xmlns:a"), OOX::g_Namespaces.a.m_strLink);
			pWriter->WriteAttribute(_T("def"), def);			

			pWriter->EndAttributes();

			POSITION pos = Styles.GetStartPosition();
			while (NULL != pos)
			{
				Styles.GetNextValue(pos).toXmlWriter(pWriter);
			}

			pWriter->EndNode(_T("a:tblStyleLst"));
		}

	public:
		CString def;
		CAtlMap<CString, Logic::TableStyle> Styles;

		void SetTheme(const smart_ptr<PPTX::Theme> theme)
		{
			m_Theme = theme;

			POSITION pos = Styles.GetStartPosition();
			while (NULL != pos)
				Styles.GetNextValue(pos).SetTheme(m_Theme);
		}

		virtual DWORD GetRGBAFromMap(const CString& str)const
		{
			if(m_Theme.IsInit())
				return m_Theme->GetRGBAFromMap(str);
			return 0;
		}

		virtual DWORD GetARGBFromMap(const CString& str)const
		{
			if(m_Theme.IsInit())
				return m_Theme->GetARGBFromMap(str);
			return 0;
		}

		virtual DWORD GetBGRAFromMap(const CString& str)const
		{
			if(m_Theme.IsInit())
				return m_Theme->GetBGRAFromMap(str);
			return 0;
		}

		virtual DWORD GetABGRFromMap(const CString& str)const
		{
			if(m_Theme.IsInit())
				return m_Theme->GetABGRFromMap(str);
			return 0;
		}

	private:
		smart_ptr<PPTX::Theme> m_Theme;
	};
} 

#endif // PPTX_TABLESTYLES_FILE_INCLUDE_H_