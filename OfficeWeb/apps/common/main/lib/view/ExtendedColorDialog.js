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
define(["text!common/main/lib/template/ExtendedColorDialog.template", "common/main/lib/component/HSBColorPicker", "common/main/lib/component/MetricSpinner", "common/main/lib/component/MaskedField", "common/main/lib/component/Window"], function (dlgTemplate) {
    Common.UI.ExtendedColorDialog = Common.UI.Window.extend(_.extend({
        tpl: _.template(dlgTemplate),
        options: {},
        rendered: false,
        initialize: function (options) {
            Common.UI.Window.prototype.initialize.call(this, {
                cls: "extended-color-dlg",
                tpl: this.tpl({
                    txtNew: this.textNew,
                    txtCurrent: this.textCurrent,
                    txtAdd: this.addButtonText,
                    txtCancel: this.cancelButtonText
                }),
                header: false,
                width: 340,
                height: 272
            });
            this.hexRe = /\s*#?([0-9a-fA-F][0-9a-fA-F]?)([0-9a-fA-F][0-9a-fA-F]?)([0-9a-fA-F][0-9a-fA-F]?)\s*/;
        },
        render: function () {
            var me = this;
            Common.UI.Window.prototype.render.call(this);
            this.colorsPicker = new Common.UI.HSBColorPicker({
                el: $("#id-hsb-colorpicker"),
                showCurrentColor: false
            });
            this.colorsPicker.on("changecolor", _.bind(this.onChangeColor, this));
            this.colorNew = $("#field-new-color");
            this.colorSaved = $("#field-start-color");
            this.spinR = new Common.UI.MetricSpinner({
                el: $("#extended-spin-r"),
                step: 1,
                width: 63,
                value: "0",
                defaultUnit: "",
                maxValue: 255,
                minValue: 0,
                tabindex: 1,
                maskExp: /[0-9]/,
                allowDecimal: false
            });
            this.spinG = new Common.UI.MetricSpinner({
                el: $("#extended-spin-g"),
                step: 1,
                width: 63,
                value: "0",
                defaultUnit: "",
                maxValue: 255,
                minValue: 0,
                tabindex: 2,
                maskExp: /[0-9]/,
                allowDecimal: false
            });
            this.spinB = new Common.UI.MetricSpinner({
                el: $("#extended-spin-b"),
                step: 1,
                width: 63,
                value: "0",
                defaultUnit: "",
                maxValue: 255,
                minValue: 0,
                tabindex: 3,
                maskExp: /[0-9]/,
                allowDecimal: false
            });
            this.textColor = new Common.UI.MaskedField({
                el: $("#extended-text-color"),
                width: 55,
                maskExp: /[a-fA-F0-9]/,
                maxLength: 6
            });
            this.spinR.on("change", _.bind(this.showColor, this, null, true)).on("changing", _.bind(this.onChangingRGB, this, 1));
            this.spinG.on("change", _.bind(this.showColor, this, null, true)).on("changing", _.bind(this.onChangingRGB, this, 2));
            this.spinB.on("change", _.bind(this.showColor, this, null, true)).on("changing", _.bind(this.onChangingRGB, this, 3));
            this.textColor.on("change", _.bind(this.onChangeMaskedField, this));
            this.textColor.on("changed", _.bind(this.onChangedMaskedField, this));
            this.textColor.$el.attr("tabindex", 4);
            this.spinR.$el.find("input").attr("maxlength", 3);
            this.spinG.$el.find("input").attr("maxlength", 3);
            this.spinB.$el.find("input").attr("maxlength", 3);
            this.on("close", function () {
                me.trigger("onmodalresult", 0);
            });
            function onBtnClick(event) {
                me.trigger("onmodalresult", parseInt(event.currentTarget.attributes["result"].value));
                me.close(true);
            }
            $(this)[0].getChild(".footer .dlg-btn").on("click", onBtnClick);
            this.rendered = true;
            if (this.color !== undefined) {
                this.setColor(this.color);
            }
            return this;
        },
        onChangeColor: function (o, color) {
            this.colorNew.css({
                "background-color": color
            });
            this.stopevents = true;
            var values = color.match(this.hexRe);
            this.spinR.setValue(parseInt(values[1], 16));
            this.spinG.setValue(parseInt(values[2], 16));
            this.spinB.setValue(parseInt(values[3], 16));
            this.textColor.setValue((values[1] + values[2] + values[3]).toUpperCase());
            this.stopevents = false;
        },
        showColor: function (exlude, validate) {
            if (!this.stopevents) {
                var val = this.spinR.getNumberValue();
                var r = (val == null || val < 0) ? 0 : (val > 255 ? 255 : val);
                if (validate) {
                    this.spinR.setValue(r, true);
                }
                r = r.toString(16);
                val = this.spinG.getNumberValue();
                var g = (val == null || val < 0) ? 0 : (val > 255 ? 255 : val);
                if (validate) {
                    this.spinG.setValue(g, true);
                }
                g = g.toString(16);
                val = this.spinB.getNumberValue();
                var b = ((val == null || val < 0) ? 0 : (val > 255 ? 255 : val));
                if (validate) {
                    this.spinB.setValue(b, true);
                }
                b = b.toString(16);
                var color = (r.length == 1 ? "0" + r : r) + (g.length == 1 ? "0" + g : g) + (b.length == 1 ? "0" + b : b);
                this.colorsPicker.setColor("#" + color);
                if (exlude != "hex") {
                    this.textColor.setValue(color.toUpperCase());
                }
                this.colorNew.css("background-color", "#" + color);
            }
        },
        onChangingRGB: function (type, cmp, newValue, e) {
            if (!this.stopevents) {
                var r, g, b, val;
                newValue = (_.isEmpty(newValue) || isNaN(parseInt(newValue))) ? parseInt(cmp.getValue()) : parseInt(newValue);
                switch (type) {
                case 1:
                    r = ((newValue == null || isNaN(newValue) || newValue < 0) ? 0 : (newValue > 255 ? 255 : newValue)).toString(16);
                    val = this.spinG.getNumberValue();
                    g = ((val == null || val < 0) ? 0 : (val > 255 ? 255 : val)).toString(16);
                    val = this.spinB.getNumberValue();
                    b = ((val == null || val < 0) ? 0 : (val > 255 ? 255 : val)).toString(16);
                    break;
                case 2:
                    val = this.spinR.getNumberValue();
                    r = ((val == null || val < 0) ? 0 : (val > 255 ? 255 : val)).toString(16);
                    g = ((newValue == null || isNaN(newValue) || newValue < 0) ? 0 : (newValue > 255 ? 255 : newValue)).toString(16);
                    val = this.spinB.getNumberValue();
                    b = ((val == null || val < 0) ? 0 : (val > 255 ? 255 : val)).toString(16);
                    break;
                case 3:
                    val = this.spinR.getNumberValue();
                    r = ((val == null || val < 0) ? 0 : (val > 255 ? 255 : val)).toString(16);
                    val = this.spinG.getNumberValue();
                    g = ((val == null || val < 0) ? 0 : (val > 255 ? 255 : val)).toString(16);
                    b = ((newValue == null || isNaN(newValue) || newValue < 0) ? 0 : (newValue > 255 ? 255 : newValue)).toString(16);
                    break;
                }
                var color = (r.length == 1 ? "0" + r : r) + (g.length == 1 ? "0" + g : g) + (b.length == 1 ? "0" + b : b);
                this.colorsPicker.setColor("#" + color);
                this.textColor.setValue(color.toUpperCase());
                this.colorNew.css("background-color", "#" + color);
            }
        },
        onChangeMaskedField: function (field, newValue) {
            newValue = ((/^[a-fA-F0-9]{0,6}$/.test(newValue))) ? newValue : "000000";
            newValue = "000000" + newValue;
            var colors = newValue.match(/([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})$/i);
            this.stopevents = true;
            this.spinR.setValue(parseInt(colors[1], 16));
            this.spinG.setValue(parseInt(colors[2], 16));
            this.spinB.setValue(parseInt(colors[3], 16));
            this.stopevents = false;
            if (this.rendered) {
                this.showColor("hex");
            }
        },
        onChangedMaskedField: function (field, newValue) {
            var me = this;
            if (!/^[a-fA-F0-9]{0,6}$/.test(newValue) || _.isEmpty(newValue)) {
                field.setValue("000000");
            }
            if (this.rendered) {
                this.showColor("", true);
            }
        },
        getColor: function () {
            var color = /#?([a-fA-F0-9]{6})/.exec(this.colorsPicker.getColor());
            return color ? color[1] : null;
        },
        setColor: function (cl) {
            var me = this;
            if (this.rendered !== true) {
                this.color = cl;
                return;
            }
            var color = /#?([a-fA-F0-9]{6})/.test(cl) ? cl : "ff0000";
            me.colorsPicker.setColor("#" + color);
            function keepcolor() {
                if (cl == "transparent") {
                    me.colorSaved.addClass("color-transparent");
                } else {
                    me.colorSaved.removeClass("color-transparent");
                    me.colorSaved.css("background-color", "#" + cl);
                }
                me.colorNew.css("background-color", "#" + color);
            }
            keepcolor();
            me.stopevents = true;
            var values = me.hexRe.exec(color);
            me.spinR.setValue(parseInt(values[1], 16));
            me.spinG.setValue(parseInt(values[2], 16));
            me.spinB.setValue(parseInt(values[3], 16));
            me.textColor.setValue((values[1] + values[2] + values[3]).toUpperCase());
            me.stopevents = false;
        },
        show: function () {
            Common.UI.Window.prototype.show.apply(this, arguments);
            var me = this;
            _.delay(function () {
                me.getChild("#extended-text-color").focus();
            },
            50);
        },
        cancelButtonText: "Cancel",
        addButtonText: "Add",
        textNew: "New",
        textCurrent: "Current",
        textRGBErr: "The entered value is incorrect.<br>Please enter a numeric value between 0 and 255.",
        textHexErr: "The entered value is incorrect.<br>Please enter a value between 000000 and FFFFFF."
    },
    Common.UI.ExtendedColorDialog || {}));
});