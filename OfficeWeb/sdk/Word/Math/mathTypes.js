/*
 * (c) Copyright Ascensio System SIA 2010-2015
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
 "use strict";
var MATH_FRACTION = 0;
var MATH_DEGREE = 1;
var MATH_DEGREESubSup = 2;
var MATH_RADICAL = 3;
var MATH_NARY = 4;
var MATH_DELIMITER = 5;
var MATH_GROUP_CHARACTER = 6;
var MATH_FUNCTION = 7;
var MATH_ACCENT = 8;
var MATH_BORDER_BOX = 9;
var MATH_LIMIT = 10;
var MATH_MATRIX = 11;
var MATH_BOX = 12;
var MATH_EQ_ARRAY = 13;
var MATH_BAR = 14;
var MATH_PHANTOM = 15;
var MATH_RUN = 16;
var BAR_FRACTION = 0;
var SKEWED_FRACTION = 1;
var LINEAR_FRACTION = 2;
var NO_BAR_FRACTION = 3;
var DEGREE_SUPERSCRIPT = 1;
var DEGREE_SUBSCRIPT = -1;
var DEGREE_SubSup = 1;
var DEGREE_PreSubSup = -1;
var SQUARE_RADICAL = 0;
var DEGREE_RADICAL = 1;
var NARY_INTEGRAL = 0;
var NARY_DOUBLE_INTEGRAL = 1;
var NARY_TRIPLE_INTEGRAL = 2;
var NARY_CONTOUR_INTEGRAL = 3;
var NARY_SURFACE_INTEGRAL = 4;
var NARY_VOLUME_INTEGRAL = 5;
var NARY_SIGMA = 6;
var NARY_PRODUCT = 7;
var NARY_COPRODUCT = 8;
var NARY_UNION = 9;
var NARY_INTERSECTION = 10;
var NARY_LOGICAL_OR = 11;
var NARY_LOGICAL_AND = 12;
var NARY_TEXT_OPER = 13;
var NARY_UndOvr = 0;
var NARY_SubSup = 1;
var BOX_DIFF = 0;
var BOX_OpEmu = 1;
var BOX_ALIGN = 2;
var BOX_BREAK = 3;
var BOX_NOBREAK = 4;
var OPERATOR_EMPTY = -1;
var OPERATOR_TEXT = 0;
var PARENTHESIS_LEFT = 1;
var PARENTHESIS_RIGHT = 2;
var BRACKET_CURLY_LEFT = 3;
var BRACKET_CURLY_RIGHT = 4;
var BRACKET_SQUARE_LEFT = 5;
var BRACKET_SQUARE_RIGHT = 6;
var BRACKET_ANGLE_LEFT = 7;
var BRACKET_ANGLE_RIGHT = 8;
var HALF_SQUARE_LEFT = 9;
var HALF_SQUARE_RIGHT = 10;
var HALF_SQUARE_LEFT_UPPER = 11;
var HALF_SQUARE_RIGHT_UPPER = 12;
var DELIMITER_LINE = 13;
var DELIMITER_DOUBLE_LINE = 14;
var WHITE_SQUARE_LEFT = 15;
var WHITE_SQUARE_RIGHT = 16;
var BRACKET_CURLY_TOP = 17;
var BRACKET_CURLY_BOTTOM = 18;
var ARROW_LEFT = 19;
var ARROW_RIGHT = 20;
var ARROW_LR = 21;
var DOUBLE_LEFT_ARROW = 22;
var DOUBLE_RIGHT_ARROW = 23;
var DOUBLE_ARROW_LR = 24;
var ACCENT_ARROW_LEFT = 26;
var ACCENT_ARROW_RIGHT = 27;
var ACCENT_ARROW_LR = 28;
var ACCENT_HALF_ARROW_LEFT = 29;
var ACCENT_HALF_ARROW_RIGHT = 30;
var PARENTHESIS_TOP = 31;
var PARENTHESIS_BOTTOM = 32;
var BRACKET_SQUARE_TOP = 33;
var ACCENT_ONE_DOT = 31;
var ACCENT_TWO_DOTS = 32;
var ACCENT_THREE_DOTS = 33;
var ACCENT_GRAVE = 34;
var ACCENT_ACUTE = 35;
var ACCENT_CIRCUMFLEX = 36;
var ACCENT_COMB_CARON = 37;
var ACCENT_LINE = 38;
var ACCENT_DOUBLE_LINE = 39;
var SINGLE_LINE = 40;
var DOUBLE_LINE = 41;
var ACCENT_TILDE = 42;
var ACCENT_BREVE = 43;
var ACCENT_INVERT_BREVE = 44;
var ACCENT_SIGN = 45;
var ACCENT_TEXT = 46;
var TXT_ROMAN = 0;
var TXT_SCRIPT = 1;
var TXT_FRAKTUR = 2;
var TXT_DOUBLE_STRUCK = 3;
var TXT_SANS_SERIF = 4;
var TXT_MONOSPACE = 5;
var OPER_DELIMITER = 0;
var OPER_SEPARATOR = 1;
var OPER_GROUP_CHAR = 2;
var OPER_ACCENT = 3;
var OPER_BAR = 4;
var TURN_0 = 0;
var TURN_180 = 1;
var TURN_MIRROR_0 = 2;
var TURN_MIRROR_180 = 3;
var DELIMITER_SHAPE_MATH = 0;
var DELIMITER_SHAPE_CENTERED = 1;
var LIMIT_LOW = 0;
var LIMIT_UP = 1;
var MCJC_CENTER = 0;
var MCJC_LEFT = 1;
var MCJC_RIGHT = 2;
var MCJC_INSIDE = 0;
var MCJC_OUTSIDE = 0;
var BASEJC_CENTER = 0;
var BASEJC_TOP = 1;
var BASEJC_BOTTOM = 2;
var BASEJC_INLINE = 0;
var BASEJC_INSIDE = 0;
var BASEJC_OUTSIDE = 0;
var JC_CENTER = 0;
var JC_CENTERGROUP = 1;
var JC_LEFT = 2;
var JC_RIGHT = 3;
var MATH_TEXT = 0;
var MATH_RUN_PRP = 1;
var MATH_COMP = 2;
var MATH_EMPTY = 3;
var MATH_PLACEHOLDER = 4;
var MATH_PARA_RUN = 5;
var LOCATION_TOP = 0;
var LOCATION_BOT = 1;
var LOCATION_LEFT = 2;
var LOCATION_RIGHT = 3;
var LOCATION_SEP = 4;
var VJUST_TOP = 0;
var VJUST_BOT = 1;
var BREAK_BEFORE = 0;
var BREAK_AFTER = 1;
var BREAK_REPEAT = 2;
var BREAK_MIN_MIN = 0;
var BREAK_PLUS_MIN = 1;
var BREAK_MIN_PLUS = 2;
var STY_BOLD = 0;
var STY_BI = 1;
var STY_ITALIC = 2;
var STY_PLAIN = 3;