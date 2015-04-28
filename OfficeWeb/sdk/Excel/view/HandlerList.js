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
(function (window, undefined) {
    var asc = window["Asc"],
    asc_typeOf = asc.typeOf;
    function asc_CHandlersList(handlers) {
        this.handlers = handlers || {};
        return this;
    }
    asc_CHandlersList.prototype.hasTrigger = function (eventName) {
        return null != this.handlers[eventName];
    };
    asc_CHandlersList.prototype.trigger = function (eventName) {
        var h = this.handlers[eventName],
        t = asc_typeOf(h),
        a = Array.prototype.slice.call(arguments, 1),
        i;
        if (t === "function") {
            return h.apply(this, a);
        }
        if (t === "array") {
            for (i = 0; i < h.length; i += 1) {
                if (asc_typeOf(h[i]) === "function") {
                    h[i].apply(this, a);
                }
            }
            return true;
        }
        return false;
    };
    asc_CHandlersList.prototype.add = function (eventName, eventHandler, replaceOldHandler) {
        var th = this.handlers,
        h, old, t;
        if (replaceOldHandler || !th.hasOwnProperty(eventName)) {
            th[eventName] = eventHandler;
        } else {
            old = h = th[eventName];
            t = asc_typeOf(old);
            if (t !== "array") {
                h = th[eventName] = [];
                if (t === "function") {
                    h.push(old);
                }
            }
            h.push(eventHandler);
        }
    };
    asc_CHandlersList.prototype.remove = function (eventName, eventHandler) {
        var th = this.handlers,
        h = th[eventName],
        i;
        if (th.hasOwnProperty(eventName)) {
            if (asc_typeOf(h) !== "array" || asc_typeOf(eventHandler) !== "function") {
                delete th[eventName];
                return true;
            }
            for (i = h.length - 1; i >= 0; i -= 1) {
                if (h[i] === eventHandler) {
                    delete h[i];
                    return true;
                }
            }
        }
        return false;
    };
    asc.asc_CHandlersList = asc_CHandlersList;
})(window);