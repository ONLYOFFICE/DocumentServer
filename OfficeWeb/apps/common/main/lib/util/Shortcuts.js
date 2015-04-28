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
 if (Common === undefined) {
    var Common = {};
}
Common.util = Common.util || {};
define(["backbone", "keymaster"], function (Backbone) {
    var Shortcuts = function (options) {
        this.cid = _.uniqueId("shortcuts");
        this.initialize.apply(this, arguments);
        return this;
    };
    _.extend(Shortcuts.prototype, Backbone.Events, {
        initialize: function () {
            window.key.filter = function (event) {
                return true;
            };
            Common.NotificationCenter.on({
                "modal:show": function (e) {
                    window.key.suspend();
                },
                "modal:close": function (e) {
                    window.key.resume();
                },
                "modal:hide": function (e) {
                    window.key.resume();
                }
            });
        },
        delegateShortcuts: function (options) {
            if (!options || !options.shortcuts) {
                return;
            }
            this.removeShortcuts(options);
            var callback, match, method, scope, shortcut, shortcutKey;
            var _results = [];
            for (shortcut in options.shortcuts) {
                callback = options.shortcuts[shortcut];
                if (!_.isFunction(callback)) {
                    method = options[callback];
                    if (!method) {
                        throw new Error("Method " + callback + " does not exist");
                    }
                } else {
                    method = callback;
                }
                match = shortcut.match(/^(\S+)\s*(.*)$/);
                shortcutKey = match[1];
                scope = match[2].length ? match[2] : "all";
                method = _.bind(method, this);
                _results.push(window.key(shortcutKey, scope, method));
            }
        },
        removeShortcuts: function (options) {
            if (!options || !options.shortcuts) {
                return;
            }
            var match, scope, shortcut, shortcutKey;
            var _results = [];
            for (shortcut in options.shortcuts) {
                match = shortcut.match(/^(\S+)\s*(.*)$/);
                shortcutKey = match[1];
                scope = match[2].length ? match[2] : "all";
                window.key.unbind(shortcutKey, scope);
            }
        },
        suspendEvents: function (key, scope) {
            window.key.suspend(key, scope);
        },
        resumeEvents: function (key, scope) {
            window.key.resume(key, scope);
        }
    });
    Shortcuts.extend = Backbone.View.extend;
    Common.util.Shortcuts = new Shortcuts;
});