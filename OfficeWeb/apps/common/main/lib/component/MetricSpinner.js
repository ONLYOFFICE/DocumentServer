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
    Common.UI.MetricSpinner = Common.UI.BaseView.extend({
        options: {
            minValue: 0,
            maxValue: 100,
            step: 1,
            defaultUnit: "px",
            allowAuto: false,
            autoText: "Auto",
            hold: true,
            speed: "medium",
            width: 90,
            allowDecimal: true
        },
        disabled: false,
        value: "0 px",
        rendered: false,
        template: '<input type="text" class="form-control">' + '<div class="spinner-buttons">' + '<button type="button" class="spinner-up"><i></i></button>' + '<button type="button" class="spinner-down"><i></i></button>' + "</div>",
        initialize: function (options) {
            Common.UI.BaseView.prototype.initialize.call(this, options);
            var me = this,
            el = $(this.el);
            el.addClass("spinner");
            el.on("mousedown", ".spinner-up", _.bind(this.onMouseDown, this, true));
            el.on("mousedown", ".spinner-down", _.bind(this.onMouseDown, this, false));
            el.on("mouseup", ".spinner-up", _.bind(this.onMouseUp, this, true));
            el.on("mouseup", ".spinner-down", _.bind(this.onMouseUp, this, false));
            el.on("mouseover", ".spinner-up, .spinner-down", _.bind(this.onMouseOver, this));
            el.on("mouseout", ".spinner-up, .spinner-down", _.bind(this.onMouseOut, this));
            el.on("keydown", ".form-control", _.bind(this.onKeyDown, this));
            el.on("keyup", ".form-control", _.bind(this.onKeyUp, this));
            el.on("blur", ".form-control", _.bind(this.onBlur, this));
            el.on("input", ".form-control", _.bind(this.onInput, this));
            if (!this.options.allowDecimal) {
                el.on("keypress", ".form-control", _.bind(this.onKeyPress, this));
            }
            this.switches = {
                count: 1,
                enabled: true,
                fromKeyDown: false
            };
            if (this.options.speed === "medium") {
                this.switches.speed = 300;
            } else {
                if (this.options.speed === "fast") {
                    this.switches.speed = 100;
                } else {
                    this.switches.speed = 500;
                }
            }
            this.render();
            if (this.options.disabled) {
                this.setDisabled(this.options.disabled);
            }
            if (this.options.value !== undefined) {
                this.value = this.options.value;
            }
            this.setRawValue(this.value);
            if (this.options.width) {
                $(this.el).width(this.options.width);
            }
            if (this.options.defaultValue === undefined) {
                this.options.defaultValue = this.options.minValue;
            }
            this.oldValue = this.options.minValue;
            this.lastValue = null;
        },
        render: function () {
            var el = $(this.el);
            el.html(this.template);
            this.$input = el.find(".form-control");
            this.rendered = true;
            if (this.options.tabindex != undefined) {
                this.$input.attr("tabindex", this.options.tabindex);
            }
            return this;
        },
        setDisabled: function (disabled) {
            var el = $(this.el);
            if (disabled !== this.disabled) {
                el.find("button").toggleClass("disabled", disabled);
                el.toggleClass("disabled", disabled);
                (disabled) ? this.$input.attr({
                    disabled: disabled
                }) : this.$input.removeAttr("disabled");
            }
            this.disabled = disabled;
        },
        isDisabled: function () {
            return this.disabled;
        },
        setDefaultUnit: function (unit) {
            if (this.options.defaultUnit != unit) {
                var oldUnit = this.options.defaultUnit;
                this.options.defaultUnit = unit;
                this.setMinValue(this._recalcUnits(this.options.minValue, oldUnit));
                this.setMaxValue(this._recalcUnits(this.options.maxValue, oldUnit));
                this.setValue(this._recalcUnits(this.getNumberValue(), oldUnit), true);
            }
        },
        setMinValue: function (unit) {
            this.options.minValue = unit;
        },
        setMaxValue: function (unit) {
            this.options.maxValue = unit;
        },
        setStep: function (step) {
            this.options.step = step;
        },
        getNumberValue: function () {
            if (this.options.allowAuto && this.value == this.options.autoText) {
                return -1;
            } else {
                return parseFloat(this.value);
            }
        },
        getUnitValue: function () {
            return this.options.defaultUnit;
        },
        getValue: function () {
            return this.value;
        },
        setRawValue: function (value) {
            if (this.$input) {
                this.$input.val(value);
            }
        },
        setValue: function (value, suspendchange) {
            var showError = false;
            this._fromKeyDown = false;
            this.lastValue = this.value;
            if (typeof value === "undefined" || value === "") {
                this.value = "";
            } else {
                if (this.options.allowAuto && (Math.abs(parseFloat(value) + 1) < 0.0001 || value == this.options.autoText)) {
                    this.value = this.options.autoText;
                } else {
                    var number = this._add(parseFloat(value), 0, (this.options.allowDecimal) ? 3 : 0);
                    if (typeof value === "undefined" || isNaN(number)) {
                        number = this.oldValue;
                        showError = true;
                    }
                    var units = this.options.defaultUnit;
                    if (typeof value.match !== "undefined") {
                        var searchUnits = value.match(/(px|em|%|en|ex|pt|in|cm|mm|pc|s|ms)$/i);
                        if (null !== searchUnits && searchUnits[0] !== "undefined") {
                            units = searchUnits[0].toLowerCase();
                        }
                    }
                    if (this.options.defaultUnit !== units) {
                        number = this._recalcUnits(number, units);
                    }
                    if (number > this.options.maxValue) {
                        number = this.options.maxValue;
                        showError = true;
                    }
                    if (number < this.options.minValue) {
                        number = this.options.minValue;
                        showError = true;
                    }
                    this.value = (number + " " + this.options.defaultUnit).trim();
                    this.oldValue = number;
                }
            }
            if (suspendchange !== true && this.lastValue !== this.value) {
                this.trigger("change", this, this.value, this.lastValue);
            }
            if (suspendchange !== true && showError) {
                this.trigger("inputerror", this, this.value);
            }
            if (this.rendered) {
                this.setRawValue(this.value);
            } else {
                this.options.value = this.value;
            }
        },
        onMouseDown: function (type, e) {
            if (this.disabled) {
                return;
            }
            if (e) {
                $(e.currentTarget).addClass("active");
            }
            if (this.options.hold) {
                this.switches.fromKeyDown = false;
                this._startSpin(type, e);
            }
        },
        onMouseUp: function (type, e) {
            if (this.disabled) {
                return;
            }
            $(e.currentTarget).removeClass("active");
            if (this.options.hold) {
                this._stopSpin();
            } else {
                this._step(type);
            }
        },
        onMouseOver: function (e) {
            if (this.disabled) {
                return;
            }
            $(e.currentTarget).addClass("over");
        },
        onMouseOut: function (e) {
            if (this.disabled) {
                return;
            }
            $(e.currentTarget).removeClass("active over");
            if (this.options.hold) {
                this._stopSpin();
            }
        },
        onKeyDown: function (e) {
            if (this.disabled) {
                return;
            }
            if (this.options.hold && (e.keyCode == Common.UI.Keys.UP || e.keyCode == Common.UI.Keys.DOWN)) {
                e.preventDefault();
                e.stopPropagation();
                if (this.switches.timeout === undefined) {
                    this.switches.fromKeyDown = true;
                    this._startSpin(e.keyCode == Common.UI.Keys.UP, e);
                }
            } else {
                if (e.keyCode == Common.UI.Keys.RETURN) {
                    if (this.options.defaultUnit && this.options.defaultUnit.length) {
                        var value = this.$input.val();
                        if (this.value != value) {
                            this.onEnterValue();
                            return false;
                        }
                    } else {
                        this.onEnterValue();
                    }
                } else {
                    this._fromKeyDown = true;
                }
            }
        },
        onKeyUp: function (e) {
            if (this.disabled) {
                return;
            }
            if (e.keyCode == Common.UI.Keys.UP || e.keyCode == Common.UI.Keys.DOWN) {
                e.stopPropagation();
                e.preventDefault();
                (this.options.hold) ? this._stopSpin() : this._step(e.keyCode == Common.UI.Keys.UP);
            }
        },
        onKeyPress: function (e) {
            if (this.disabled) {
                return;
            }
            var charCode = String.fromCharCode(e.charCode);
            if (charCode == "." || charCode == ",") {
                e.preventDefault();
                e.stopPropagation();
            } else {
                if (this.options.maskExp && !this.options.maskExp.test(charCode) && !e.ctrlKey && e.keyCode !== Common.UI.Keys.DELETE && e.keyCode !== Common.UI.Keys.BACKSPACE && e.keyCode !== Common.UI.Keys.LEFT && e.keyCode !== Common.UI.Keys.RIGHT && e.keyCode !== Common.UI.Keys.HOME && e.keyCode !== Common.UI.Keys.END && e.keyCode !== Common.UI.Keys.ESC && e.keyCode !== Common.UI.Keys.RETURN && e.keyCode !== Common.UI.Keys.INSERT && e.keyCode !== Common.UI.Keys.TAB) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            }
        },
        onInput: function (e, extra) {
            if (this.disabled || e.isDefaultPrevented()) {
                return;
            }
            this.trigger("changing", this, $(e.target).val(), e);
        },
        onEnterValue: function () {
            if (this.$input) {
                var val = this.$input.val();
                this.setValue((val === "") ? this.value : val);
                this.trigger("entervalue", this);
            }
        },
        onBlur: function (e) {
            if (this.$input) {
                var val = this.$input.val();
                this.setValue((val === "") ? this.value : val);
                if (this.options.hold && this.switches.fromKeyDown) {
                    this._stopSpin();
                }
            }
        },
        _startSpin: function (type, e) {
            if (!this.disabled) {
                var divisor = this.switches.count;
                if (divisor === 1) {
                    this._step(type, true);
                    divisor = 1;
                } else {
                    if (divisor < 3) {
                        divisor = 1.5;
                    } else {
                        if (divisor < 8) {
                            divisor = 2.5;
                        } else {
                            divisor = 6;
                        }
                    }
                }
                this.switches.timeout = setTimeout($.proxy(function () {
                    this._step(type, true);
                    this._startSpin(type);
                },
                this), this.switches.speed / divisor);
                this.switches.count++;
            }
        },
        _stopSpin: function (e) {
            if (this.switches.timeout !== undefined) {
                clearTimeout(this.switches.timeout);
                this.switches.timeout = undefined;
                this.switches.count = 1;
                this.trigger("change", this, this.value, this.lastValue);
            }
        },
        _increase: function (suspend) {
            var me = this;
            if (!me.readOnly) {
                var val = me.options.step;
                if (me._fromKeyDown) {
                    val = this.$input.val();
                    val = _.isEmpty(val) ? me.oldValue : parseFloat(val);
                } else {
                    if (me.getValue() !== "") {
                        if (me.options.allowAuto && me.getValue() == me.options.autoText) {
                            val = me.options.minValue - me.options.step;
                        } else {
                            val = parseFloat(me.getValue());
                        }
                        if (isNaN(val)) {
                            val = this.oldValue;
                        }
                    } else {
                        val = me.options.defaultValue;
                    }
                }
                me.setValue((this._add(val, me.options.step, (me.options.allowDecimal) ? 3 : 0) + " " + this.options.defaultUnit).trim(), suspend);
            }
        },
        _decrease: function (suspend) {
            var me = this;
            if (!me.readOnly) {
                var val = me.options.step;
                if (me._fromKeyDown) {
                    val = this.$input.val();
                    val = _.isEmpty(val) ? me.oldValue : parseFloat(val);
                } else {
                    if (me.getValue() !== "") {
                        if (me.options.allowAuto && me.getValue() == me.options.autoText) {
                            val = me.options.minValue;
                        } else {
                            val = parseFloat(me.getValue());
                        }
                        if (isNaN(val)) {
                            val = this.oldValue;
                        }
                        if (me.options.allowAuto && this._add(val, -me.options.step, (me.options.allowDecimal) ? 3 : 0) < me.options.minValue) {
                            me.setValue(me.options.autoText, true);
                            return;
                        }
                    } else {
                        val = me.options.defaultValue;
                    }
                }
                me.setValue((this._add(val, -me.options.step, (me.options.allowDecimal) ? 3 : 0) + " " + this.options.defaultUnit).trim(), suspend);
            }
        },
        _step: function (type, suspend) {
            (type) ? this._increase(suspend) : this._decrease(suspend);
        },
        _add: function (a, b, precision) {
            var x = Math.pow(10, precision || (this.options.allowDecimal) ? 2 : 0);
            return (Math.round(a * x) + Math.round(b * x)) / x;
        },
        _recalcUnits: function (value, fromUnit) {
            if (fromUnit.match(/(s|ms)$/i) && this.options.defaultUnit.match(/(s|ms)$/i)) {
                var v_out = value;
                if (fromUnit == "ms") {
                    v_out = v_out / 1000;
                }
                if (this.options.defaultUnit == "ms") {
                    v_out = v_out * 1000;
                }
                return v_out;
            }
            if (fromUnit.match(/(pt|in|cm|mm|pc)$/i) === null || this.options.defaultUnit.match(/(pt|in|cm|mm|pc)$/i) === null) {
                return value;
            }
            var v_out = value;
            if (fromUnit == "cm") {
                v_out = v_out * 10;
            } else {
                if (fromUnit == "pt") {
                    v_out = v_out * 25.4 / 72;
                } else {
                    if (fromUnit == "in") {
                        v_out = v_out * 25.4;
                    } else {
                        if (fromUnit == "pc") {
                            v_out = v_out * 25.4 / 6;
                        }
                    }
                }
            }
            if (this.options.defaultUnit == "cm") {
                v_out = v_out / 10;
            } else {
                if (this.options.defaultUnit == "pt") {
                    v_out = parseFloat((v_out * 72 / 25.4).toFixed(3));
                } else {
                    if (this.options.defaultUnit == "in") {
                        v_out = v_out / 25.4;
                    } else {
                        if (this.options.defaultUnit == "pc") {
                            v_out = v_out * 6 / 25.4;
                        }
                    }
                }
            }
            return v_out;
        }
    });
});