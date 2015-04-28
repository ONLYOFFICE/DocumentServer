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
var min_distance_joined = 2;
function JoinedH(shape1, shape2) {
    var l, r, l2, r2;
    l = shape1.x;
    r = l + shape1.extX;
    l2 = shape2.x;
    r2 = l2 + shape2.extX;
    var d = l - l2;
    if (Math.abs(d) < min_distance_joined) {
        return d;
    }
    d = l - r2;
    if (Math.abs(d) < min_distance_joined) {
        return d;
    }
    d = r - l2;
    if (Math.abs(d) < min_distance_joined) {
        return d;
    }
    d = r - r2;
    if (Math.abs(d) < min_distance_joined) {
        return d;
    }
    return 0;
}
function JoinedV(shape1, shape2) {
    var t, b, t2, b2;
    t = shape1.y;
    b = t + shape1.extY;
    t2 = shape2.y;
    b2 = t2 + shape2.extY;
    var d = t - t2;
    if (Math.abs(d) < min_distance_joined) {
        return d;
    }
    d = t - b2;
    if (Math.abs(d) < min_distance_joined) {
        return d;
    }
    d = b - t2;
    if (Math.abs(d) < min_distance_joined) {
        return d;
    }
    d = b - b2;
    if (Math.abs(d) < min_distance_joined) {
        return d;
    }
    return 0;
}
function JoinedPointH(X, shape2) {
    var l2, r2;
    l2 = shape2.x;
    r2 = l2 + shape2.extX;
    var d = X - l2;
    if (Math.abs(d) < min_distance_joined) {
        return d;
    }
    d = X - r2;
    if (Math.abs(d) < min_distance_joined) {
        return d;
    }
    return 0;
}
function JoinedPointV(Y, shape2) {
    var t2, b2;
    t2 = shape2.y;
    b2 = t2 + shape2.extY;
    var d = Y - t2;
    if (Math.abs(d) < min_distance_joined) {
        return d;
    }
    d = Y - b2;
    if (Math.abs(d) < min_distance_joined) {
        return d;
    }
    return 0;
}