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
#ifndef OOX_NUMBERING_FILE_INCLUDE_H_
#define OOX_NUMBERING_FILE_INCLUDE_H_

#include <vector>
#include <string>

#include "File.h"
#include "Logic/Align.h"
#include "Logic/ParagraphProperty.h"
#include "Logic/RunProperty.h"
#include "Logic/NumFormat.h"

#include "../.././../../Common/DocxFormat/Source/Base/Nullable.h"
#include "../.././../../Common/DocxFormat/Source/Xml/XmlUtils.h"

namespace OOX
{
	class Numbering : public OOX::File
	{
	public:
		class Level
		{
		public:
			Level();
			virtual ~Level();
			
			Level(XmlUtils::CXmlNode& oNode);
			const Level& operator =(XmlUtils::CXmlNode& oNode);

		public:
			virtual void fromXML(XmlUtils::CXmlNode& oNode);

		public:
			NSCommon::nullable<int>							Ilvl;
			NSCommon::nullable<std::wstring>				Tplc;
			NSCommon::nullable<int>							Start;
			NSCommon::nullable<Logic::NumFormat>			NumFmt;
			NSCommon::nullable<std::wstring>				Suffix;
			NSCommon::nullable<std::wstring>				Text;
			NSCommon::nullable<Logic::Align>				Align;
			NSCommon::nullable<Logic::ParagraphProperty>	ParagraphProperty;
			NSCommon::nullable<Logic::RunProperty>			RunProperty;
			NSCommon::nullable<int>							Tentative;
		};

		class LevelOverride 
		{
		public:
			LevelOverride();
			virtual ~LevelOverride();
			
			LevelOverride(XmlUtils::CXmlNode& oNode);
			const LevelOverride& operator =(XmlUtils::CXmlNode& oNode);

		public:
			virtual void fromXML(XmlUtils::CXmlNode& oNode);

		public:
		    NSCommon::nullable<int>				Ilvl;
			NSCommon::nullable<int>				StartOverride;
			NSCommon::nullable<Level>			Level;
		};

		class AbstractNum
		{
		public:
			AbstractNum();
			virtual ~AbstractNum();
			
			AbstractNum(XmlUtils::CXmlNode& oNode);
			const AbstractNum& operator =(XmlUtils::CXmlNode& oNode);

		public:
			virtual void fromXML(XmlUtils::CXmlNode& oNode);

		public:
			const Level getLevel(const int numLevel) const;

		public:
			std::vector<Level>					Levels;
			
			NSCommon::nullable<int>				Id;
			NSCommon::nullable<std::wstring>	Nsid;
			NSCommon::nullable<std::wstring>	MultiLevelType;
			NSCommon::nullable<std::wstring>	Tmpl;		
			NSCommon::nullable<std::wstring>	numStyleLink;
		};

		class Num 
		{
		public:
			Num();
			virtual ~Num();
			
			Num(XmlUtils::CXmlNode& oNode);
			const Num& operator =(XmlUtils::CXmlNode& oNode);

		public:
			virtual void fromXML(XmlUtils::CXmlNode& oNode);

		public:
			NSCommon::nullable<int>		NumId;
			NSCommon::nullable<int>		AbstractNumId;

			std::vector<LevelOverride>	LevelOverrides;
		};

	public:
		Numbering();
		Numbering(const OOX::CPath& filename);
		virtual ~Numbering();

	public:
		virtual void read(const OOX::CPath& filename);
		virtual void write(const OOX::CPath& filename, const OOX::CPath& directory, ContentTypes::File& content) const;

	public:
		virtual const FileType type() const;
		virtual const OOX::CPath DefaultDirectory() const;
		virtual const OOX::CPath DefaultFileName() const;

	public:
		void clear();

	public:

		std::vector<AbstractNum>	AbstractNums;
		std::vector<Num>			Nums;
	};
} 

#endif // OOX_NUMBERING_FILE_INCLUDE_H_