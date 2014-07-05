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
 Ext.define("Common.component.IndeterminateCheckBox", {
    extend: "Ext.form.field.Checkbox",
    alias: "widget.cmdindeterminatecheckbox",
    value: "unchecked",
    indeterminate: false,
    indeterminateCls: Ext.baseCSSPrefix + "form-cb-indeterminate",
    onBoxClick: function (e) {
        var me = this;
        if (!me.disabled && !me.readOnly) {
            if (this.indeterminate) {
                this.indeterminate = false;
                this.setValue(false);
            } else {
                this.setValue(!this.checked);
            }
        }
    },
    getRawValue: function () {
        return this.value;
    },
    getValue: function () {
        return this.value;
    },
    setRawValue: function (value) {
        var me = this,
        inputEl = me.inputEl,
        inputValue = me.inputValue,
        checked = (value === true || value === "true" || value === "1" || value === 1 || (((Ext.isString(value) || Ext.isNumber(value)) && inputValue) ? value == inputValue : me.onRe.test(value))),
        indeterminate = (value === "indeterminate");
        if (inputEl) {
            inputEl.dom.setAttribute("aria-checked", checked);
            inputEl.dom.setAttribute("aria-indeterminate", indeterminate);
            me[indeterminate ? "addCls" : "removeCls"](me.indeterminateCls);
            me[checked ? "addCls" : "removeCls"](me.checkedCls);
        }
        me.checked = me.rawValue = checked;
        me.indeterminate = indeterminate;
        me.value = indeterminate ? "indeterminate" : (checked ? "checked" : "unchecked");
        return checked;
    },
    setValue: function (checked) {
        var me = this;
        var setFn = function (value, suspendEvent) {
            if (Ext.isArray(value)) {
                me.getManager().getByName(me.name).each(function (cb) {
                    cb.setValue(Ext.Array.contains(value, cb.inputValue));
                });
            } else {
                me.setRawValue(value);
                if (! (Ext.isDefined(suspendEvent) && suspendEvent)) {
                    me.checkChange();
                }
            }
            return me;
        };
        if (this.rendered) {
            setFn.call(this, checked);
        } else {
            this.on("afterrender", Ext.bind(setFn, this, [checked, true]), {
                single: true
            });
        }
    }
});