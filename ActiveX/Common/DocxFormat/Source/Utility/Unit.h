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
#ifndef _UNIT_INCLUDE_H_
#define _UNIT_INCLUDE_H_

AVSINLINE double Cm_To_Mm     (const double &dValue)
{
	return dValue * 10;
}

AVSINLINE double Cm_To_Pt     (const double &dValue)
{
	return dValue * 72 / 2.54;
}

AVSINLINE double Cm_To_Px     (const double &dValue)
{
	return dValue * 72 * 4 / 3 / 2.54;
}

AVSINLINE double Cm_To_Inch   (const double &dValue)
{
	return dValue / 2.54;
}



AVSINLINE double Cm_To_Dx     (const double &dValue)
{
	return dValue * 72 * 20 / 2.54;
}

AVSINLINE double Cm_To_Sx     (const double &dValue)
{
	return dValue * 72 * 100 * 1000 / 20;
}
AVSINLINE double Cm_To_Multi  (const double &dValue)
{
	return dValue * 72 * 20 / 2.54;
}



AVSINLINE double Cm_To_Emu    (const double &dValue)
{
	return dValue * 360000;
}



AVSINLINE double Mm_To_Cm     (const double &dValue)
{
	return dValue / 10;
}

AVSINLINE double Mm_To_Pt     (const double &dValue)
{
	return dValue * 72 / 10 / 2.54;
}

AVSINLINE double Mm_To_Px     (const double &dValue)
{
	return dValue * 72  * 4 / 3 / 10 / 2.54;
}

AVSINLINE double Mm_To_Inch   (const double &dValue)
{
	return dValue / 2.54 / 10;
}

AVSINLINE double Mm_To_Dx     (const double &dValue)
{
	return dValue * 72 * 20 / 10 / 2.54;
}
AVSINLINE double Mm_To_Sx     (const double &dValue)
{
	return dValue * 72 * 100 * 1000 / 10 / 20;
}
AVSINLINE double Mm_To_Multi  (const double &dValue)
{
	return dValue * 72 * 20 / 10 / 2.54;
}
AVSINLINE double Mm_To_Emu    (const double &dValue)
{
	return dValue * 36000;
}
AVSINLINE double Pt_To_Cm     (const double &dValue)
{
	return dValue * 2.54 / 72;
}

AVSINLINE double Pt_To_Mm     (const double &dValue)
{
	return dValue * 2.54 * 10 / 72;
}

AVSINLINE double Pt_To_Px     (const double &dValue)
{
	return dValue * 4 / 3;
}

AVSINLINE double Pt_To_Inch   (const double &dValue)
{
	return dValue / 72;
}

AVSINLINE double Pt_To_Dx     (const double &dValue)
{
	return dValue * 20;
}

AVSINLINE double Pt_To_Sx     (const double &dValue)
{
	return dValue * 2.54 * 100 * 1000 / 20;
}

AVSINLINE double Pt_To_Multi  (const double &dValue)
{
	return dValue * 20;
}
AVSINLINE double Pt_To_Emu    (const double &dValue)
{
	return dValue * 12700;
}
AVSINLINE double Px_To_Cm     (const double &dValue)
{
	return dValue * 2.54 * 3/ 72 / 4;
}
AVSINLINE double Px_To_Mm     (const double &dValue)
{
	return dValue * 2.54 * 10 * 3/ 72 /4;
}
AVSINLINE double Px_To_Pt     (const double &dValue)
{
	return dValue * 3 / 4;
}
AVSINLINE double Px_To_Inch   (const double &dValue)
{
	return dValue * 3 / 72 / 4;
}

AVSINLINE double Px_To_Dx     (const double &dValue)
{
	return dValue * 20 * 3 / 4;
}
AVSINLINE double Px_To_Sx     (const double &dValue)
{
	return dValue * 2.54 * 100 * 1000 * 3/ 20 / 4;
}

AVSINLINE double Px_To_Multi  (const double &dValue)
{
	return dValue * 20 * 3 / 4;
}

AVSINLINE double Px_To_Emu    (const double &dValue)
{
	return dValue * 9525;
}

AVSINLINE double Inch_To_Cm   (const double &dValue)
{
	return dValue * 2.54;
}
AVSINLINE double Inch_To_Mm   (const double &dValue)
{
	return dValue * 2.54 * 10;
}
AVSINLINE double Inch_To_Pt   (const double &dValue)
{
	return dValue * 72;
}

AVSINLINE double Inch_To_Px   (const double &dValue)
{
	return dValue * 72 * 4 / 3;
}

AVSINLINE double Inch_To_Dx   (const double &dValue)
{
	return dValue * 72 * 20;
}

AVSINLINE double Inch_To_Sx   (const double &dValue)
{
	return dValue * 1000 * 100 * 2.54 * 72 / 20;
}

AVSINLINE double Inch_To_Multi(const double &dValue)
{
	return dValue * 72 * 20;
}
AVSINLINE double Inch_To_Emu  (const double &dValue)
{
	return dValue * 914400;
}
AVSINLINE double Dx_To_Cm     (const double &dValue)
{
	return dValue * 2.54 / 72 / 20;
}
AVSINLINE double Dx_To_Mm     (const double &dValue)
{
	return dValue * 2.54 * 10 / 72 / 20;
}
AVSINLINE double Dx_To_Pt     (const double &dValue)
{
	return dValue / 20;
}

AVSINLINE double Dx_To_Px     (const double &dValue)
{
	return dValue * 4 / 3 / 20;
}

AVSINLINE double Dx_To_Inch   (const double &dValue)
{
	return dValue / 20 / 72;
}

AVSINLINE double Dx_To_Sx     (const double &dValue)
{
	return dValue * 635;
}

AVSINLINE double Dx_To_Multi  (const double &dValue)
{
	return dValue;
}

AVSINLINE double Dx_To_Emu    (const double &dValue)
{
	return dValue * 635;
}

AVSINLINE double Sx_To_Cm     (const double &dValue)
{
	return dValue * 20 / 72 / 100 / 1000;
}
AVSINLINE double Sx_To_Mm     (const double &dValue)
{
	return dValue * 20 / 72 / 100 / 1000 * 10;
}
AVSINLINE double Sx_To_Pt     (const double &dValue)
{
	return dValue * 20 / 100 / 1000 / 2.54;
}

AVSINLINE double Sx_To_Px     (const double &dValue)
{
	return dValue * 20 * 4 / 3 / 100 / 1000 / 2.54;
}

AVSINLINE double Sx_To_Inch   (const double &dValue)
{
	return dValue * 20 / 2.54 / 72 / 100 / 1000;
}

AVSINLINE double Sx_To_Dx     (const double &dValue)
{
	return dValue * 20 * 20 / 2.54 / 100 / 1000;
}

AVSINLINE double Sx_To_Multi  (const double &dValue)
{
	return dValue * 20 * 20 / 2.54 / 100 / 1000;
}

AVSINLINE double Sx_To_Emu    (const double &dValue)
{
	return dValue;
}

AVSINLINE double Multi_To_Cm  (const double &dValue)
{
	return dValue * 2.54 / 72 / 20;
}
AVSINLINE double Multi_To_Mm  (const double &dValue)
{
	return dValue * 2.54 * 10 / 72 / 20;
}
AVSINLINE double Multi_To_Pt  (const double &dValue)
{
	return dValue / 20;
}

AVSINLINE double Multi_To_Px  (const double &dValue)
{
	return dValue * 4 / 3 / 20;
}

AVSINLINE double Multi_To_Inch(const double &dValue)
{
	return dValue / 20 / 72;
}

AVSINLINE double Multi_To_Sx  (const double &dValue)
{
	return dValue * 635;
}

AVSINLINE double Multi_To_Dx  (const double &dValue)
{
	return dValue;
}




AVSINLINE double Multi_To_Emu (const double &dValue)
{
	return dValue * 635;
}




AVSINLINE double Emu_To_Cm    (const double &dValue)
{
	return dValue / 360000;
}
AVSINLINE double Emu_To_Mm    (const double &dValue)
{
	return dValue / 36000;
}
AVSINLINE double Emu_To_Pt    (const double &dValue)
{
	return dValue / 12700;
}

AVSINLINE double Emu_To_Px    (const double &dValue)
{
	return dValue / 9525;
}

AVSINLINE double Emu_To_Inch  (const double &dValue)
{
	return dValue / 914400;
}

AVSINLINE double Emu_To_Sx    (const double &dValue)
{
	return dValue;
}

AVSINLINE double Emu_To_Dx    (const double &dValue)
{
	return dValue / 635;
}
AVSINLINE double Emu_To_Multi (const double &dValue)
{
	return dValue / 635;
}





#endif // _UNIT_INCLUDE_H_