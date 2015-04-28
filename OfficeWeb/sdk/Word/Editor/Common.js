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
function Common_CopyObj(Obj) {
    if (!Obj || !("object" == typeof(Obj) || "array" == typeof(Obj))) {
        return Obj;
    }
    var c = "function" === typeof Obj.pop ? [] : {};
    var p, v;
    for (p in Obj) {
        if (Obj.hasOwnProperty(p)) {
            v = Obj[p];
            if (v && "object" === typeof v) {
                c[p] = Common_CopyObj(v);
            } else {
                c[p] = v;
            }
        }
    }
    return c;
}
function Common_CopyObj2(Dst, Obj) {
    if (!Obj || !("object" == typeof(Obj) || "array" == typeof(Obj))) {
        return;
    }
    if (Dst == null) {
        Dst = {};
    }
    var p, v;
    for (p in Obj) {
        if (Obj.hasOwnProperty(p)) {
            v = Obj[p];
            if (v && "object" === typeof v) {
                if ("object" != typeof(Dst[p])) {
                    if ("undefined" != typeof(v.splice)) {
                        Dst[p] = [];
                    } else {
                        Dst[p] = {};
                    }
                }
                Common_CopyObj2(Dst[p], v);
            } else {
                Dst[p] = v;
            }
        }
    }
}
function Common_CmpObj2(Obj1, Obj2) {
    if (!Obj1 || !Obj2 || typeof(Obj1) != typeof(Obj2)) {
        return false;
    }
    var p, v1, v2;
    for (p in Obj2) {
        if (!Obj1.hasOwnProperty(p)) {
            return false;
        }
    }
    for (p in Obj1) {
        if (Obj2.hasOwnProperty(p)) {
            v1 = Obj1[p];
            v2 = Obj2[p];
            if (v1 && v2 && "object" === typeof(v1) && "object" === typeof(v2)) {
                if (false == Common_CmpObj2(v1, v2)) {
                    return false;
                }
            } else {
                if (v1 != v2) {
                    return false;
                }
            }
        } else {
            return false;
        }
    }
    return true;
}