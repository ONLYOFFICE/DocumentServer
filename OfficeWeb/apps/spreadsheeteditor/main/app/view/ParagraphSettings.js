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
 var c_paragraphLinerule = {
    LINERULE_LEAST: 0,
    LINERULE_AUTO: 1,
    LINERULE_EXACT: 2
};
define(["text!spreadsheeteditor/main/app/template/ParagraphSettings.template", "jquery", "underscore", "backbone", "common/main/lib/component/ComboBox", "common/main/lib/component/MetricSpinner", "spreadsheeteditor/main/app/view/ParagraphSettingsAdvanced"], function (menuTemplate, $, _, Backbone) {
    SSE.Views.ParagraphSettings = Backbone.View.extend(_.extend({
        el: "#id-paragraph-settings",
        template: _.template(menuTemplate),
        events: {},
        options: {
            alias: "ParagraphSettings"
        },
        initialize: function () {
            var me = this;
            this._initSettings = true;
            this._state = {
                LineRuleIdx: 1,
                LineHeight: 1.5,
                LineSpacingBefore: 0,
                LineSpacingAfter: 0.35,
                DisabledControls: false
            };
            this.spinners = [];
            this.lockedControls = [];
            this._locked = false;
            this.render();
            this._arrLineRule = [{
                displayValue: this.textAtLeast,
                defaultValue: 5,
                value: c_paragraphLinerule.LINERULE_LEAST,
                minValue: 0.03,
                step: 0.01,
                defaultUnit: "cm"
            },
            {
                displayValue: this.textAuto,
                defaultValue: 1,
                value: c_paragraphLinerule.LINERULE_AUTO,
                minValue: 0.5,
                step: 0.01,
                defaultUnit: ""
            },
            {
                displayValue: this.textExact,
                defaultValue: 5,
                value: c_paragraphLinerule.LINERULE_EXACT,
                minValue: 0.03,
                step: 0.01,
                defaultUnit: "cm"
            }];
            this.cmbLineRule = new Common.UI.ComboBox({
                el: $("#paragraph-combo-line-rule"),
                cls: "input-group-nr",
                menuStyle: "min-width: 85px;",
                editable: false,
                data: this._arrLineRule
            });
            this.cmbLineRule.setValue(this._arrLineRule[this._state.LineRuleIdx].value);
            this.lockedControls.push(this.cmbLineRule);
            this.numLineHeight = new Common.UI.MetricSpinner({
                el: $("#paragraph-spin-line-height"),
                step: 0.01,
                width: 85,
                value: "1.5",
                defaultUnit: "",
                maxValue: 132,
                minValue: 0.5
            });
            this.lockedControls.push(this.numLineHeight);
            this.numSpacingBefore = new Common.UI.MetricSpinner({
                el: $("#paragraph-spin-spacing-before"),
                step: 0.1,
                width: 85,
                value: "0 cm",
                defaultUnit: "cm",
                maxValue: 55.88,
                minValue: 0,
                allowAuto: true,
                autoText: this.txtAutoText
            });
            this.spinners.push(this.numSpacingBefore);
            this.lockedControls.push(this.numSpacingBefore);
            this.numSpacingAfter = new Common.UI.MetricSpinner({
                el: $("#paragraph-spin-spacing-after"),
                step: 0.1,
                width: 85,
                value: "0.35 cm",
                defaultUnit: "cm",
                maxValue: 55.88,
                minValue: 0,
                allowAuto: true,
                autoText: this.txtAutoText
            });
            this.spinners.push(this.numSpacingAfter);
            this.lockedControls.push(this.numSpacingAfter);
            this.numLineHeight.on("change", _.bind(this.onNumLineHeightChange, this));
            this.numSpacingBefore.on("change", _.bind(this.onNumSpacingBeforeChange, this));
            this.numSpacingAfter.on("change", _.bind(this.onNumSpacingAfterChange, this));
            this.cmbLineRule.on("selected", _.bind(this.onLineRuleSelect, this));
            this.cmbLineRule.on("hide:after", _.bind(this.onHideMenus, this));
            $(this.el).on("click", "#paragraph-advanced-link", _.bind(this.openAdvancedSettings, this));
        },
        render: function () {
            var el = $(this.el);
            el.html(this.template({
                scope: this
            }));
            this.linkAdvanced = $("#paragraph-advanced-link");
        },
        setApi: function (api) {
            this.api = api;
            if (this.api) {
                this.api.asc_registerCallback("asc_onParaSpacingLine", _.bind(this._onLineSpacing, this));
            }
            return this;
        },
        onNumLineHeightChange: function (field, newValue, oldValue, eOpts) {
            if (this.cmbLineRule.getRawValue() === "") {
                return;
            }
            var type = c_paragraphLinerule.LINERULE_AUTO;
            if (this.api) {
                this.api.asc_putPrLineSpacing(this.cmbLineRule.getValue(), (this.cmbLineRule.getValue() == c_paragraphLinerule.LINERULE_AUTO) ? field.getNumberValue() : Common.Utils.Metric.fnRecalcToMM(field.getNumberValue()));
            }
            Common.NotificationCenter.trigger("edit:complete", this);
        },
        onNumSpacingBeforeChange: function (field, newValue, oldValue, eOpts) {
            if (this.api) {
                var num = field.getNumberValue();
                if (num < 0) {
                    this.api.asc_putLineSpacingBeforeAfter(0, -1);
                } else {
                    this.api.asc_putLineSpacingBeforeAfter(0, Common.Utils.Metric.fnRecalcToMM(field.getNumberValue()));
                }
            }
            Common.NotificationCenter.trigger("edit:complete", this);
        },
        onNumSpacingAfterChange: function (field, newValue, oldValue, eOpts) {
            if (this.api) {
                var num = field.getNumberValue();
                if (num < 0) {
                    this.api.asc_putLineSpacingBeforeAfter(1, -1);
                } else {
                    this.api.asc_putLineSpacingBeforeAfter(1, Common.Utils.Metric.fnRecalcToMM(field.getNumberValue()));
                }
            }
            Common.NotificationCenter.trigger("edit:complete", this);
        },
        onLineRuleSelect: function (combo, record) {
            if (this.api) {
                this.api.asc_putPrLineSpacing(record.value, record.defaultValue);
            }
            this.numLineHeight.setDefaultUnit(this._arrLineRule[record.value].defaultUnit);
            this.numLineHeight.setMinValue(this._arrLineRule[record.value].minValue);
            this.numLineHeight.setStep(this._arrLineRule[record.value].step);
            Common.NotificationCenter.trigger("edit:complete", this);
        },
        _onLineSpacing: function (value) {
            var linerule = value.asc_getLineRule();
            var line = value.asc_getLine();
            if (this._state.LineRuleIdx !== linerule) {
                this.cmbLineRule.setValue((linerule !== null) ? this._arrLineRule[linerule].value : "");
                this.numLineHeight.setMinValue(this._arrLineRule[(linerule !== null) ? linerule : 1].minValue);
                this.numLineHeight.setDefaultUnit(this._arrLineRule[(linerule !== null) ? linerule : 1].defaultUnit);
                this.numLineHeight.setStep(this._arrLineRule[(linerule !== null) ? linerule : 1].step);
                this._state.LineRuleIdx = linerule;
            }
            if (Math.abs(this._state.LineHeight - line) > 0.001 || (this._state.LineHeight === null || line === null) && (this._state.LineHeight !== line)) {
                var val = "";
                if (linerule == c_paragraphLinerule.LINERULE_AUTO) {
                    val = line;
                } else {
                    if (linerule !== null && line !== null) {
                        val = Common.Utils.Metric.fnRecalcFromMM(line);
                    }
                }
                this.numLineHeight.setValue((val !== null) ? val : "", true);
                this._state.LineHeight = line;
            }
        },
        ChangeSettings: function (prop) {
            if (this._initSettings) {
                this.createDelayedElements();
                this._initSettings = false;
            }
            this.disableControls(this._locked);
            if (prop) {
                var Spacing = {
                    Line: prop.asc_getSpacing().asc_getLine(),
                    Before: prop.asc_getSpacing().asc_getBefore(),
                    After: prop.asc_getSpacing().asc_getAfter(),
                    LineRule: prop.asc_getSpacing().asc_getLineRule()
                };
                if (this._state.LineRuleIdx !== Spacing.LineRule) {
                    this.cmbLineRule.setValue((Spacing.LineRule !== null) ? this._arrLineRule[Spacing.LineRule].value : "");
                    this.numLineHeight.setMinValue(this._arrLineRule[(Spacing.LineRule !== null) ? Spacing.LineRule : 1].minValue);
                    this.numLineHeight.setDefaultUnit(this._arrLineRule[(Spacing.LineRule !== null) ? Spacing.LineRule : 1].defaultUnit);
                    this.numLineHeight.setStep(this._arrLineRule[(Spacing.LineRule !== null) ? Spacing.LineRule : 1].step);
                    this._state.LineRuleIdx = Spacing.LineRule;
                }
                if (Math.abs(this._state.LineHeight - Spacing.Line) > 0.001 || (this._state.LineHeight === null || Spacing.Line === null) && (this._state.LineHeight !== Spacing.Line)) {
                    var val = "";
                    if (Spacing.LineRule == c_paragraphLinerule.LINERULE_AUTO) {
                        val = Spacing.Line;
                    } else {
                        if (Spacing.LineRule !== null && Spacing.Line !== null) {
                            val = Common.Utils.Metric.fnRecalcFromMM(Spacing.Line);
                        }
                    }
                    this.numLineHeight.setValue((val !== null) ? val : "", true);
                    this._state.LineHeight = Spacing.Line;
                }
                if (Math.abs(this._state.LineSpacingBefore - Spacing.Before) > 0.001 || (this._state.LineSpacingBefore === null || Spacing.Before === null) && (this._state.LineSpacingBefore !== Spacing.Before)) {
                    this.numSpacingBefore.setValue((Spacing.Before !== null) ? ((Spacing.Before < 0) ? Spacing.Before : Common.Utils.Metric.fnRecalcFromMM(Spacing.Before)) : "", true);
                    this._state.LineSpacingBefore = Spacing.Before;
                }
                if (Math.abs(this._state.LineSpacingAfter - Spacing.After) > 0.001 || (this._state.LineSpacingAfter === null || Spacing.After === null) && (this._state.LineSpacingAfter !== Spacing.After)) {
                    this.numSpacingAfter.setValue((Spacing.After !== null) ? ((Spacing.After < 0) ? Spacing.After : Common.Utils.Metric.fnRecalcFromMM(Spacing.After)) : "", true);
                    this._state.LineSpacingAfter = Spacing.After;
                }
            }
        },
        updateMetricUnit: function () {
            if (this.spinners) {
                for (var i = 0; i < this.spinners.length; i++) {
                    var spinner = this.spinners[i];
                    spinner.setDefaultUnit(Common.Utils.Metric.metricName[Common.Utils.Metric.getCurrentMetric()]);
                    spinner.setStep(Common.Utils.Metric.getCurrentMetric() == Common.Utils.Metric.c_MetricUnits.cm ? 0.01 : 1);
                }
            }
            this._arrLineRule[2].defaultUnit = this._arrLineRule[0].defaultUnit = Common.Utils.Metric.metricName[Common.Utils.Metric.getCurrentMetric()];
            this._arrLineRule[2].minValue = this._arrLineRule[0].minValue = parseFloat(Common.Utils.Metric.fnRecalcFromMM(0.3).toFixed(2));
            this._arrLineRule[2].step = this._arrLineRule[0].step = (Common.Utils.Metric.getCurrentMetric() == Common.Utils.Metric.c_MetricUnits.cm) ? 0.01 : 1;
            if (this._state.LineRuleIdx !== null) {
                this.numLineHeight.setDefaultUnit(this._arrLineRule[this._state.LineRuleIdx].defaultUnit);
                this.numLineHeight.setStep(this._arrLineRule[this._state.LineRuleIdx].step);
            }
        },
        createDelayedElements: function () {
            this.updateMetricUnit();
        },
        openAdvancedSettings: function (e) {
            if (this.linkAdvanced.hasClass("disabled")) {
                return;
            }
            var me = this;
            var win;
            if (me.api && !this._locked) {
                var selectedElements = me.api.asc_getGraphicObjectProps();
                if (selectedElements && selectedElements.length > 0) {
                    var elType, elValue;
                    for (var i = selectedElements.length - 1; i >= 0; i--) {
                        elType = selectedElements[i].asc_getObjectType();
                        elValue = selectedElements[i].asc_getObjectValue();
                        if (c_oAscTypeSelectElement.Paragraph == elType) {
                            (new SSE.Views.ParagraphSettingsAdvanced({
                                paragraphProps: elValue,
                                api: me.api,
                                handler: function (result, value) {
                                    if (result == "ok") {
                                        if (me.api) {
                                            me.borderAdvancedProps = value.borderProps;
                                            me.api.asc_setGraphicObjectProps(value.paragraphProps);
                                        }
                                    }
                                    Common.NotificationCenter.trigger("edit:complete", me);
                                }
                            })).show();
                            break;
                        }
                    }
                }
            }
        },
        onHideMenus: function (e) {
            Common.NotificationCenter.trigger("edit:complete", this);
        },
        setLocked: function (locked) {
            this._locked = locked;
        },
        disableControls: function (disable) {
            if (this._state.DisabledControls !== disable) {
                this._state.DisabledControls = disable;
                _.each(this.lockedControls, function (item) {
                    item.setDisabled(disable);
                });
                this.linkAdvanced.toggleClass("disabled", disable);
            }
        },
        strParagraphSpacing: "Spacing",
        strLineHeight: "Line Spacing",
        strSpacingBefore: "Before",
        strSpacingAfter: "After",
        textAuto: "Multiple",
        textAtLeast: "At least",
        textExact: "Exactly",
        textAdvanced: "Show advanced settings",
        textAt: "At",
        txtAutoText: "Auto"
    },
    SSE.Views.ParagraphSettings || {}));
});