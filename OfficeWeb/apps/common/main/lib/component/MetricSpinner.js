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
 Ext.define("Common.component.MetricSpinner", {
    extend: "Ext.form.field.Spinner",
    alias: "widget.commonmetricspinner",
    defaultUnit: "px",
    minValue: 0,
    maxValue: 100,
    step: 1,
    textAlign: "right",
    allowAuto: false,
    autoText: "Auto",
    mouseWheelEnabled: false,
    constructor: function (config) {
        var add = function (a, b, precision) {
            var x = Math.pow(10, precision || 2);
            return (Math.round(a * x) + Math.round(b * x)) / x;
        };
        var oldValue = this.minValue;
        this.setValue = function (value, suspendchange) {
            if (!Ext.isDefined(value) || value === "") {
                this.value = "";
            } else {
                if (this.allowAuto && (Math.abs(parseFloat(value) + 1) < 0.0001 || value == this.autoText)) {
                    this.value = this.autoText;
                } else {
                    var number = add(parseFloat(value), 0, 3);
                    if (!Ext.isDefined(number) || isNaN(number)) {
                        number = oldValue;
                    }
                    var units = this.defaultUnit;
                    if (Ext.isDefined(value.match)) {
                        var searchUnits = value.match(/(px|em|%|en|ex|pt|in|cm|mm|pc|s|ms)$/i);
                        if (null !== searchUnits && Ext.isDefined(searchUnits[0])) {
                            units = searchUnits[0].toLowerCase();
                        }
                    }
                    if (this.defaultUnit !== units) {
                        number = this._recalcUnits(number, units);
                    }
                    if (number > this.maxValue) {
                        number = this.maxValue;
                    }
                    if (number < this.minValue) {
                        number = this.minValue;
                    }
                    this.value = (number + " " + this.defaultUnit).trim();
                    oldValue = number;
                }
            }
            if (suspendchange !== true) {
                this.checkChange();
            }
            var setFn = function (value) {
                this.setRawValue(value);
            };
            if (this.rendered) {
                setFn.call(this, this.value);
            } else {
                this.on("afterrender", Ext.bind(setFn, this, [this.value]), {
                    single: true
                });
            }
        };
        this.onSpinUp = function () {
            var me = this;
            if (!me.readOnly) {
                var val = me.step;
                if (me.getValue() !== "") {
                    if (me.allowAuto && me.getValue() == me.autoText) {
                        val = me.minValue - me.step;
                    } else {
                        val = parseFloat(me.getValue());
                    }
                    if (isNaN(val)) {
                        val = oldValue;
                    }
                } else {
                    val = me.minValue - me.step;
                }
                me.setValue((add(val, me.step, 3) + " " + this.defaultUnit).trim(), true);
            }
        };
        this.onSpinDown = function () {
            var me = this;
            if (!me.readOnly) {
                var val = me.step;
                if (me.getValue() !== "") {
                    if (me.allowAuto && me.getValue() == me.autoText) {
                        val = me.minValue;
                    } else {
                        val = parseFloat(me.getValue());
                    }
                    if (isNaN(val)) {
                        val = oldValue;
                    }
                    if (me.allowAuto && add(val, -me.step, 3) < me.minValue) {
                        me.setValue(me.autoText, true);
                        return;
                    }
                } else {
                    val = me.minValue;
                }
                me.setValue((add(val, -me.step, 3) + " " + this.defaultUnit).trim(), true);
            }
        };
        this.callParent(arguments);
    },
    initComponent: function () {
        if (!Ext.isDefined(this.value)) {
            this.value = (this.minValue + " " + this.defaultUnit).trim();
        }
        this.on("specialkey", function (f, e) {
            if (e.getKey() == e.ENTER) {
                this.onEnterValue();
                e.stopEvent();
            }
        },
        this);
        this.callParent(arguments);
    },
    setDefaultUnit: function (unit) {
        if (this.defaultUnit != unit) {
            var oldUnit = this.defaultUnit;
            this.defaultUnit = unit;
            this.setMinValue(this._recalcUnits(this.minValue, oldUnit));
            this.setMaxValue(this._recalcUnits(this.maxValue, oldUnit));
            this.setValue(this._recalcUnits(this.getNumberValue(), oldUnit), true);
        }
    },
    setMinValue: function (unit) {
        this.minValue = unit;
    },
    setMaxValue: function (unit) {
        this.maxValue = unit;
    },
    setStep: function (step) {
        this.step = step;
    },
    getNumberValue: function () {
        if (this.allowAuto && this.value == this.autoText) {
            return -1;
        } else {
            return parseFloat(this.value);
        }
    },
    getUnitValue: function () {
        return this.defaultUnit;
    },
    getValue: function () {
        return this.value;
    },
    onEnterValue: function () {
        if (Ext.isDefined(this.inputEl)) {
            var val = this.inputEl.getValue();
            this.setValue((val === "") ? this.value : val);
        }
    },
    afterRender: function () {
        var me = this;
        this.callParent(arguments);
        if (this.inputEl) {
            Ext.DomHelper.applyStyles(this.inputEl, Ext.String.format("text-align:{0}", this.textAlign));
        }
        if (this.triggerRepeater) {
            this.triggerRepeater.on("mouseup", function () {
                me.checkChange();
            },
            this);
        }
    },
    onBlur: function (field, eOpt) {
        if (Ext.isDefined(this.inputEl)) {
            var val = this.inputEl.getValue();
            this.setValue((val === "") ? this.value : val);
        }
    },
    _recalcUnits: function (value, fromUnit) {
        if (fromUnit.match(/(s|ms)$/i) && this.defaultUnit.match(/(s|ms)$/i)) {
            var v_out = value;
            if (fromUnit == "ms") {
                v_out = v_out / 1000;
            }
            if (this.defaultUnit == "ms") {
                v_out = v_out * 1000;
            }
            return v_out;
        }
        if (fromUnit.match(/(pt|in|cm|mm|pc)$/i) === null || this.defaultUnit.match(/(pt|in|cm|mm|pc)$/i) === null) {
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
        if (this.defaultUnit == "cm") {
            v_out = v_out / 10;
        } else {
            if (this.defaultUnit == "pt") {
                v_out = parseFloat(Ext.Number.toFixed(v_out * 72 / 25.4, 3));
            } else {
                if (this.defaultUnit == "in") {
                    v_out = v_out / 25.4;
                } else {
                    if (this.defaultUnit == "pc") {
                        v_out = v_out * 6 / 25.4;
                    }
                }
            }
        }
        return v_out;
    }
});