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


#include "Ind.h"


namespace OOX
{
	namespace Logic
	{

		Ind::Ind()
		{
		}


		Ind::~Ind()
		{
		}


		Ind::Ind(const XML::XNode& node)
		{
			fromXML(node);
		}


		const Ind& Ind::operator =(const XML::XNode& node)
		{
			fromXML(node);
			return *this;
		}

		
		void Ind::fromXML(const XML::XNode& node)
		{
			const XML::XElement element(node);
			
			if (element.attribute("left").exist())
			{
				int left = element.attribute("left").value();
				UniversalUnit value(left, UniversalUnit::Dx);
				Left = value;
			}
			
			if (element.attribute("right").exist())
			{
				int right = element.attribute("right").value();
				UniversalUnit value(right, UniversalUnit::Dx);
				Right = value;
			}
			if (element.attribute("hanging").exist())
			{
				int hanging = element.attribute("hanging").value();
				UniversalUnit value(hanging, UniversalUnit::Dx);
				Hanging = value;
			}
			
			if (element.attribute("firstLine").exist())
			{
				int first = element.attribute("firstLine").value();
				UniversalUnit value(first, UniversalUnit::Dx);
				FirstLine = value;
			}
		}


		const XML::XNode Ind::toXML() const
		{
		return XML::XElement();
		}


		const bool Ind::isSimple() const
		{
			return (!Left.is_init() && !Right.is_init() && !Hanging.is_init() && !FirstLine.is_init());
		}

	} 
} // namespace OOX