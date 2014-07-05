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
 function clone(obj) {
    if (obj == null || typeof(obj) != "object") {
        return obj;
    }
    if (obj.constructor == Array) {
        var clonedArray = [];
        for (var i = 0, length = obj.length; i < length; ++i) {
            clonedArray[i] = clone(obj[i]);
        }
        return clonedArray;
    }
    var clonedObject = {};
    var copyFunc = function (obj) {
        return obj;
    };
    var nullFunc = function (obj) {
        return null;
    };
    var undefinedFunc = function (obj) {
        return undefined;
    };
    var FuncMap = {
        Parent: copyFunc,
        DrawingDocument: copyFunc,
        Document: copyFunc,
        Container: copyFunc,
        parent: copyFunc,
        slide: copyFunc,
        slideLayout: copyFunc,
        LogicDocument: copyFunc,
        table: nullFunc,
        txBody: undefinedFunc,
        graphicObject: nullFunc
    };
    for (var key in obj) {
        if (undefined !== FuncMap[key]) {
            clonedObject[key] = FuncMap[key](obj[key]);
        } else {
            clonedObject[key] = clone(obj[key]);
        }
        if (clonedObject.IsGroup && clonedObject.IsGroup()) {
            for (i = 0; i < clonedObject.ArrGlyph.length; ++i) {
                clonedObject.ArrGlyph[i].Container = clonedObject;
            }
        }
    }
    return clonedObject;
}
function cloneDC(obj) {
    if (obj == null || typeof(obj) != "object") {
        return obj;
    }
    if (obj.constructor == Array) {
        var t = [];
        for (var i = 0; i < obj.length; ++i) {
            t[i] = clone(obj[i]);
        }
        return t;
    }
    var temp = {};
    var copyFunc = function (obj) {
        return obj;
    };
    var FuncMap = {
        Parent: copyFunc,
        DrawingDocument: copyFunc,
        Document: copyFunc,
        DocumentContent: copyFunc,
        Container: copyFunc
    };
    for (var key in obj) {
        if (undefined !== FuncMap[key]) {
            temp[key] = FuncMap[key](obj[key]);
        } else {
            temp[key] = clone(obj[key]);
        }
    }
    return temp;
}
function clonePrototype(obj) {
    if (obj == null || typeof(obj) != "object") {
        return obj;
    }
    if (obj.constructor == Array) {
        var clonedArray = [];
        for (var i = 0; i < obj.length; ++i) {
            clonedArray[i] = clone(obj[i]);
        }
        return clonedArray;
    }
    var clonedObj = {};
    for (var key in obj) {
        clonedObj[key] = clone(obj[key]);
    }
    return clonedObj;
}