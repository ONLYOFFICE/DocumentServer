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
define(["backbone"], function (Backbone) {
    Common.UI = _.extend(Common.UI || {},
    {
        Keys: {
            BACKSPACE: 8,
            TAB: 9,
            RETURN: 13,
            SHIFT: 16,
            CTRL: 17,
            ALT: 18,
            ESC: 27,
            LEFT: 37,
            UP: 38,
            RIGHT: 39,
            DOWN: 40,
            DELETE: 46,
            HOME: 36,
            END: 35,
            SPACE: 32,
            PAGEUP: 33,
            PAGEDOWN: 34,
            INSERT: 45,
            NUM_PLUS: 107,
            NUM_MINUS: 109,
            F1: 112,
            F2: 113,
            F3: 114,
            F4: 115,
            F5: 116,
            F6: 117,
            F7: 118,
            F8: 119,
            F9: 120,
            F10: 121,
            F11: 122,
            F12: 123,
            EQUALITY: 187,
            MINUS: 189
        },
        BaseView: Backbone.View.extend({
            isSuspendEvents: false,
            initialize: function (options) {
                this.options = this.options ? _({}).extend(this.options, options) : options;
            },
            setVisible: function (visible) {
                return this[visible ? "show" : "hide"]();
            },
            isVisible: function () {
                return $(this.el).is(":visible");
            },
            suspendEvents: function () {
                this.isSuspendEvents = true;
            },
            resumeEvents: function () {
                this.isSuspendEvents = false;
            }
        }),
        getId: function (prefix) {
            return _.uniqueId(prefix || "asc-gen");
        }
    });
});