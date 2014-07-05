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
 if (Common === undefined) {
    var Common = {};
}
Common.IrregularStack = function (config) {
    var _stack = [];
    var _compare = function (obj1, obj2) {
        if (typeof obj1 === "object" && typeof obj2 === "object" && window.JSON) {
            return window.JSON.stringify(obj1) === window.JSON.stringify(obj2);
        }
        return obj1 === obj2;
    };
    config = config || {};
    var _strongCompare = config.strongCompare || _compare;
    var _weakCompare = config.weakCompare || _compare;
    var _indexOf = function (obj, compare) {
        for (var i = _stack.length - 1; i >= 0; i--) {
            if (compare(_stack[i], obj)) {
                return i;
            }
        }
        return -1;
    };
    var _push = function (obj) {
        _stack.push(obj);
    };
    var _pop = function (obj) {
        var index = _indexOf(obj, _strongCompare);
        if (index != -1) {
            var removed = _stack.splice(index, 1);
            return removed[0];
        }
        return undefined;
    };
    var _get = function (obj) {
        var index = _indexOf(obj, _weakCompare);
        if (index != -1) {
            return _stack[index];
        }
        return undefined;
    };
    var _exist = function (obj) {
        return ! (_indexOf(obj, _strongCompare) < 0);
    };
    return {
        push: _push,
        pop: _pop,
        get: _get,
        exist: _exist
    };
};