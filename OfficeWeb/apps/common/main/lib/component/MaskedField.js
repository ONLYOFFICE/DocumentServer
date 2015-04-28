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
define(["common/main/lib/component/BaseView"], function () {
    Common.UI.MaskedField = Common.UI.BaseView.extend({
        options: {
            maskExp: "",
            maxLength: 999
        },
        initialize: function (options) {
            Common.UI.BaseView.prototype.initialize.call(this, options);
            var me = this,
            el = $(this.el);
            el.addClass("masked-field");
            el.attr("maxlength", me.options.maxLength);
            el.on("keypress", function (e) {
                var charCode = String.fromCharCode(e.which);
                if (!me.options.maskExp.test(charCode) && !e.ctrlKey && e.keyCode !== Common.UI.Keys.DELETE && e.keyCode !== Common.UI.Keys.BACKSPACE && e.keyCode !== Common.UI.Keys.LEFT && e.keyCode !== Common.UI.Keys.RIGHT && e.keyCode !== Common.UI.Keys.HOME && e.keyCode !== Common.UI.Keys.END && e.keyCode !== Common.UI.Keys.ESC && e.keyCode !== Common.UI.Keys.INSERT && e.keyCode !== Common.UI.Keys.TAB) {
                    if (e.keyCode == Common.UI.Keys.RETURN) {
                        me.trigger("changed", me, el.val());
                    }
                    e.preventDefault();
                    e.stopPropagation();
                }
            });
            el.on("input", function (e) {
                me.trigger("change", me, el.val());
            });
            el.on("blur", function (e) {
                me.trigger("changed", me, el.val());
            });
        },
        render: function () {
            return this;
        },
        setValue: function (value) {
            if (this.options.maskExp.test(value) && value.length <= this.options.maxLength) {
                $(this.el).val(value);
            }
        },
        getValue: function () {
            $(this.el).val();
        }
    });
});