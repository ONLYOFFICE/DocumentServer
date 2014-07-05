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
 
#include "precompiled_docxformat.h"


#include "OleWrap.h"
#include "Wrap.h"


namespace OOX
{
	namespace Logic
	{

		OleWrap::OleWrap()
		{
		}


		OleWrap::OleWrap(const Common::Wrap& wrap)
		{
			fromBase(wrap);
		}


		OleWrap::OleWrap(const std::string& value)
		{
			fromString(value);
		}


		OleWrap::OleWrap(const XML::XElement& element)			
		{
			
			nullable_property<OOX::Logic::Wrap>	wrap;
			wrap = element.element("wrap");


			nullable_property<std::string> wrapCoords;
			wrapCoords = element.attribute("wrapcoords").value();
						
			if(wrapCoords.is_init())
				WrapCoords = wrapCoords;
			if(wrap.is_init())
				OleWrap(wrap->Type);
			else 
				OleWrap("none");
			
		}

		
		const OleWrap& OleWrap::operator = (const Common::Wrap& wrap)
		{
			fromBase(wrap);
			return *this;
		}


		const OleWrap& OleWrap::operator = (const std::string& value)
		{
			fromString(value);
			return *this;
		}


		const std::string OleWrap::ToString() const
		{
			switch (type())
			{
			case square:
				return "square";
			case tight:
				return "tight";
			case topAndBottom:
				return "topAndBottom";
			case none:
				return "none";
			default:
				return "square";
			}
		}


		void OleWrap::fromString(const std::string& value)
		{
			if (value == "square")
				setSquare();
			else if (value == "tight")
				setTight();
			else if (value == "topAndBottom")
				setTopAndBottom();
			else if (value == "none")
				setNone();
			else 
				setSquare();
		}
	} 
} // namespace OOX