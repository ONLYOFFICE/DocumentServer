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
#ifndef OOX_STYLES_INCLUDE_H_
#define OOX_STYLES_INCLUDE_H_

#include "File.h"
#include "property.h"
#include "nullable_property.h"
#include "WritingElement.h"
#include "Logic/TableProperty.h"
#include "Logic/TableCellProperties.h"
#include "Logic/RunProperty.h"
#include "Logic/ParagraphProperty.h"
#include "Logic/TableStyle.h"
#include <vector>

namespace OOX
{
	class Styles : public OOX::File
	{
	public:
		class Style : public WritingElement
		{
		public:
			Style();
			virtual ~Style();
			explicit Style(const XML::XNode& node);
			const Style& operator =(const XML::XNode& node);

		public:
			virtual void fromXML(const XML::XNode& node);
			virtual const XML::XNode toXML() const;

		public:
			property<std::string>							name;
			nullable_property<Logic::RunProperty>			RunProperty;
			nullable_property<Logic::ParagraphProperty>		ParagraphProperty;
			nullable_property<Logic::TableProperty>			tblPr;
			nullable_property<Logic::TableCellProperties>	tcPr;
			property<Logic::TableStyle>						tableStyles;
			property<std::string>							StyleId;
			nullable_property<std::string>					BasedOn;
			nullable_property<std::string>					Next;			
			property<std::string>							Type;
			nullable_property<int>							Default;
			nullable_property<int>							CustomStyle;			
			nullable_property<std::string>					Link;
			nullable_property<int>							UiPriority;
			property<bool>									QFormat;			
			property<bool>									SemiHidden;
			property<bool>									UnhideWhenUsed;	
			property<bool>									AutoRedefine;
		};

		class DocDefaults : public WritingElement
		{
		public:
			DocDefaults();
			virtual ~DocDefaults();
			explicit DocDefaults(const XML::XNode& node);
			const DocDefaults& operator =(const XML::XNode& node);

		public:
			virtual void fromXML(const XML::XNode& node);
			virtual const XML::XNode toXML() const;

		public:
			property<Logic::ParagraphProperty>	ParagraphProperty;
			property<Logic::RunProperty>		RunProperty;
		};

		class LsdException : public WritingElement
		{
		public:
			LsdException();
			virtual ~LsdException();
			explicit LsdException(const XML::XNode& node);
			const LsdException& operator =(const XML::XNode& node);

		public:
			virtual void fromXML(const XML::XNode& node);
			virtual const XML::XNode toXML() const;

		public:
			property<std::string>	Name;
			nullable_property<bool>	SemiHidden;
			nullable_property<int>	UiPriority;
			nullable_property<bool>	UnhideWhenUsed;
			nullable_property<bool>	QFormat;
		};

		class LattentStyles : public WritingElement
		{
		public:
			LattentStyles();
			virtual ~LattentStyles();
			explicit LattentStyles(const XML::XNode& node);
			const LattentStyles& operator =(const XML::XNode& node);

		public:
			virtual void fromXML(const XML::XNode& node);
			virtual const XML::XNode toXML() const;

		public:
			property<bool>							DefLockedState;
			property<int>							DefUIPriority;
			property<bool>							DefSemiHidden;
			property<bool>							DefUnhideWhenUsed;
			property<bool>							DefQFormat;
			property<int>							Count;
			property<std::vector<LsdException> >	LsdExceptions;
		};

	public:

		Styles();
		Styles(const OOX::CPath& filename);
		virtual ~Styles();

	public:
		virtual void read(const OOX::CPath& filename);
		virtual void write(const OOX::CPath& filename, const OOX::CPath& directory, ContentTypes::File& content) const;

	public:
		virtual const FileType type() const;
		virtual const OOX::CPath DefaultDirectory() const;
		virtual const OOX::CPath DefaultFileName() const;

	public:
		const OOX::Styles::Style GetStyleById( const std::string& StyleId ) const;
		const OOX::Styles::Style GetDefaultStyle( const std::string& Type ) const;
		const OOX::Styles::Style Styles::GetStyleWithTypeAndName (const std::string& Type, const std::string& Name) const;

	public:
		property<std::vector<Style> >		Named;
		property<DocDefaults>				Default;
		nullable_property<LattentStyles>	Lattent;
	};
} 

#endif // OOX_STYLES_INCLUDE_H_