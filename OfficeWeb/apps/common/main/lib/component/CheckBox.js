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
define(["common/main/lib/component/BaseView", "underscore"], function (base, _) {
    Common.UI.CheckBox = Common.UI.BaseView.extend({
        options: {
            labelText: ""
        },
        disabled: false,
        rendered: false,
        indeterminate: false,
        checked: false,
        value: "unchecked",
        template: _.template('<label class="checkbox-indeterminate"><input type="button"><%= labelText %></label>'),
        initialize: function (options) {
            Common.UI.BaseView.prototype.initialize.call(this, options);
            var me = this,
            el = $(this.el);
            this.render();
            if (this.options.disabled) {
                this.setDisabled(this.options.disabled);
            }
            if (this.options.value !== undefined) {
                this.setValue(this.options.value, true);
            }
            this.$chk.on("click", _.bind(this.onItemCheck, this));
        },
        render: function () {
            var el = $(this.el);
            el.html(this.template({
                labelText: this.options.labelText
            }));
            this.$chk = el.find("input[type=button]");
            this.$label = el.find("label");
            this.rendered = true;
            return this;
        },
        setDisabled: function (disabled) {
            if (disabled !== this.disabled) {
                this.$label.toggleClass("disabled", disabled);
                (disabled) ? this.$chk.attr({
                    disabled: disabled
                }) : this.$chk.removeAttr("disabled");
            }
            this.disabled = disabled;
        },
        isDisabled: function () {
            return this.disabled;
        },
        onItemCheck: function (e) {
            if (!this.disabled) {
                if (this.indeterminate) {
                    this.indeterminate = false;
                    this.setValue(false);
                } else {
                    this.setValue(!this.checked);
                }
            }
        },
        setRawValue: function (value) {
            this.checked = (value === true || value === "true" || value === "1" || value === 1 || value === "checked");
            this.indeterminate = (value === "indeterminate");
            this.$chk.toggleClass("checked", this.checked);
            this.$chk.toggleClass("indeterminate", this.indeterminate);
            this.value = this.indeterminate ? "indeterminate" : (this.checked ? "checked" : "unchecked");
        },
        setValue: function (value, suspendchange) {
            if (this.rendered) {
                this.lastValue = this.value;
                this.setRawValue(value);
                if (suspendchange !== true && this.lastValue !== value) {
                    this.trigger("change", this, this.value, this.lastValue);
                }
            } else {
                this.options.value = value;
            }
        },
        getValue: function () {
            return this.value;
        },
        isChecked: function () {
            return this.checked;
        }
    });
});