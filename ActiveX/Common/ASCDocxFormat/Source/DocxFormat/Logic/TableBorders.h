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
#ifndef OOX_LOGIC_TABLE_BORDERS_INCLUDE_H_
#define OOX_LOGIC_TABLE_BORDERS_INCLUDE_H_

#include "./../WritingElement.h"
#include "Border.h"

namespace OOX
{
	namespace Logic
	{
		class TableBorders : public WritingElement
		{
		public:
			TableBorders();
			virtual ~TableBorders();
			explicit TableBorders(const XML::XNode& node);
			const TableBorders& operator =(const XML::XNode& node);

		public:
			virtual void fromXML(const XML::XNode& node);
			virtual const XML::XNode toXML() const;

			

			inline bool GetBorder (int nInd, Border& oBorder) const
			{
				if (0 == nInd)
				{
					if (top.is_init())
					{
						oBorder	= top;
						return true;
					}
				}
			
				if (1 == nInd)
				{
					if (bottom.is_init())
					{
						oBorder	= bottom;
						return true;
					}
				}
				
				if (2 == nInd)
				{
					if (left.is_init())
					{
						oBorder	= left;
						return true;
					}
				}
				
				if (3 == nInd)
				{
					if (right.is_init())
					{
						oBorder	= right;
						return true;
					}
				}
			
				if (4 == nInd)
				{
					if (insideH.is_init())
					{
						oBorder	= insideH;
						return true;
					}
				}
				
				if (5 == nInd)
				{
					if (insideV.is_init())
					{
						oBorder	= insideV;
						return true;
					}
				}

				return false;
			}

			inline bool ValidBorder (int nInd)	const
			{
				if (0 == nInd)
				{
					if (top.is_init())
						return true;

					return false;
				}

				if (1 == nInd)
				{
					if (bottom.is_init())
						return true;

					return false;
				}

				if (2 == nInd)
				{
					if (left.is_init())
						return true;

					return false;
				}

				if (3 == nInd)
				{
					if (right.is_init())
						return true;

					return false;
				}

				if (4 == nInd)
				{
					if (insideH.is_init())
						return true;

					return false;
				}

				if (5 == nInd)
				{
					if (insideV.is_init())
						return true;

					return false;
				}

				return false;
			}


		public:

			nullable_property<Border>	top;
			nullable_property<Border>	bottom;
			nullable_property<Border>	left;
			nullable_property<Border>	right;
			nullable_property<Border>	insideH;
			nullable_property<Border>	insideV;
		};
	} 
} 

#endif // OOX_LOGIC_TABLE_BORDERS_INCLUDE_H_