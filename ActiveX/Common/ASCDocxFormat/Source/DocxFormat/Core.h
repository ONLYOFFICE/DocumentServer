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
#ifndef OOX_CORE_INCLUDE_H_
#define OOX_CORE_INCLUDE_H_

#include "File.h"

#include "../.././../../Common/DocxFormat/Source/Base/Nullable.h"
#include "../.././../../Common/DocxFormat/Source/Xml/XmlUtils.h"

namespace OOX
{
	class Core : public OOX::File
	{
	public:
		Core();
		Core(const OOX::CPath& filename);
		virtual ~Core();

	public:
		virtual void read(const OOX::CPath& oPath);
		virtual void write(const OOX::CPath& oPath, const OOX::CPath& directory, ContentTypes::File& content) const;

	public:
		virtual const FileType type() const;
		virtual const OOX::CPath DefaultDirectory() const;
		virtual const OOX::CPath DefaultFileName() const;

	private:

		NSCommon::nullable<std::wstring> m_sCategory;
		NSCommon::nullable<std::wstring> m_sContentStatus;
		NSCommon::nullable<std::wstring> m_sCreated;
		NSCommon::nullable<std::wstring> m_sCreator;
		NSCommon::nullable<std::wstring> m_sDescription;
		NSCommon::nullable<std::wstring> m_sIdentifier;
		NSCommon::nullable<std::wstring> m_sKeywords;
		NSCommon::nullable<std::wstring> m_sLanguage;
		NSCommon::nullable<std::wstring> m_sLastModifiedBy;
		NSCommon::nullable<std::wstring> m_sLastPrinted;
		NSCommon::nullable<std::wstring> m_sModified;
		NSCommon::nullable<std::wstring> m_sRevision;
		NSCommon::nullable<std::wstring> m_sSubject;
		NSCommon::nullable<std::wstring> m_sTitle;
		NSCommon::nullable<std::wstring> m_sVersion;

	};
} 

#endif // OOX_CORE_INCLUDE_H_