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
 #ifdef _MSC_VER
	#pragma once			
#endif	

#ifndef _MEDIADATADEFINE_H_	
#define _MEDIADATADEFINE_H_


#define DUBLICATE_TYPE_LINK				1
#define DUBLICATE_TYPE_COPY				2

#define INGNORETIMESTAMP				0
#define USETIMESTAMP					1
#define USETIMESTAMPALWAYS				2
#define TIMESTAMPCOMPENSATE				3
#define AUDIO_BUFFER_MODE_COUNT			4



#define UNCOMPRESSEDALLOCATE			-1

#define RESIZE_MODE_NEAREST				0
#define RESIZE_MODE_LINEAR				1
#define RESIZE_MODE_CUBIC				2
#define RESIZE_MODE_SUPER				3

#define RESIZE_MODE_COUNT				4


#define DEINTERLACE_METHOD_BLEND		0
#define DEINTERLACE_METHOD_MIDDLE		1

#define DEINTERLACE_METHOD_COUNT		2


#define DVD_SUBPICTURE_COLOR_COUNT		4

#endif // #ifndef _MEDIADATADEFINE_H_	// For Borland compiler