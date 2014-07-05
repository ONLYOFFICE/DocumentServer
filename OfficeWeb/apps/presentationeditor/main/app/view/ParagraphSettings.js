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
 Ext.define("PE.view.ParagraphSettings", {
    extend: "Common.view.AbstractSettingsPanel",
    alias: "widget.peparagraphsettings",
    height: 176,
    requires: ["Ext.DomHelper", "Ext.button.Button", "Ext.form.Label", "Ext.container.Container", "Ext.toolbar.Spacer", "Common.component.MetricSpinner", "Ext.form.field.ComboBox", "PE.view.ParagraphSettingsAdvanced"],
    constructor: function (config) {
        this.callParent(arguments);
        this.initConfig(config);
        return this;
    },
    setApi: function (o) {
        this.api = o;
        if (o) {
            this.api.asc_registerCallback("asc_onParaSpacingLine", Ext.bind(this._onLineSpacing, this));
        }
    },
    initComponent: function () {
        this.title = this.txtTitle;
        this._initSettings = true;
        this._state = {
            LineRuleIdx: 1,
            LineHeight: 1.5,
            LineSpacingBefore: 0,
            LineSpacingAfter: 0.35
        };
        this._arrLineRule = [this.textAtLeast, this.textAuto, this.textExact];
        this._arrLineDefaults = [[5, "cm", 0.03, 0.01], [1, "", 0.5, 0.01], [5, "cm", 0.03, 0.01]];
        this.cmbLineRule = Ext.create("Ext.form.field.ComboBox", {
            id: "table-combo-line-rule",
            width: 85,
            editable: false,
            store: this._arrLineRule,
            mode: "local",
            triggerAction: "all",
            listeners: {
                select: Ext.bind(function (combo, records, eOpts) {
                    if (this.api) {
                        this.api.put_PrLineSpacing(records[0].index, this._arrLineDefaults[records[0].index][0]);
                    }
                    this.numLineHeight.setDefaultUnit(this._arrLineDefaults[records[0].index][1]);
                    this.numLineHeight.setMinValue(this._arrLineDefaults[records[0].index][2]);
                    this.numLineHeight.setStep(this._arrLineDefaults[records[0].index][3]);
                    this.fireEvent("editcomplete", this);
                },
                this)
            }
        });
        this.cmbLineRule.setValue(this._arrLineRule[1]);
        this.controls.push(this.cmbLineRule);
        this.numLineHeight = Ext.widget("commonmetricspinner", {
            id: "paragraph-spin-line-height",
            readOnly: false,
            step: 0.01,
            width: 85,
            value: "1.5",
            defaultUnit: "",
            maxValue: 132,
            minValue: 0,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (this.cmbLineRule.getValue() == "") {
                        return;
                    }
                    var type = c_paragraphLinerule.LINERULE_AUTO;
                    for (var i = 0; i < this._arrLineRule.length; i++) {
                        if (this.cmbLineRule.getValue() == this._arrLineRule[i]) {
                            type = i;
                            break;
                        }
                    }
                    if (this.api) {
                        this.api.put_PrLineSpacing(type, (type == c_paragraphLinerule.LINERULE_AUTO) ? field.getNumberValue() : Common.MetricSettings.fnRecalcToMM(field.getNumberValue()));
                    }
                    this.fireEvent("editcomplete", this);
                },
                this)
            }
        });
        this.controls.push(this.numLineHeight);
        this.numSpacingBefore = Ext.create("Common.component.MetricSpinner", {
            id: "paragraph-spin-spacing-before",
            readOnly: false,
            step: 0.1,
            width: 85,
            defaultUnit: "cm",
            value: "0 cm",
            maxValue: 55.88,
            minValue: 0,
            allowAuto: true,
            autoText: this.txtAutoText,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (this.api) {
                        var num = field.getNumberValue();
                        if (num < 0) {
                            this.api.put_LineSpacingBeforeAfter(0, -1);
                        } else {
                            this.api.put_LineSpacingBeforeAfter(0, Common.MetricSettings.fnRecalcToMM(field.getNumberValue()));
                        }
                    }
                    this.fireEvent("editcomplete", this);
                },
                this)
            }
        });
        this.controls.push(this.numSpacingBefore);
        this.numSpacingAfter = Ext.create("Common.component.MetricSpinner", {
            id: "paragraph-spin-spacing-after",
            readOnly: false,
            step: 0.1,
            width: 85,
            defaultUnit: "cm",
            value: "0.35 cm",
            maxValue: 55.88,
            minValue: 0,
            allowAuto: true,
            autoText: this.txtAutoText,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (this.api) {
                        var num = field.getNumberValue();
                        if (num < 0) {
                            this.api.put_LineSpacingBeforeAfter(1, -1);
                        } else {
                            this.api.put_LineSpacingBeforeAfter(1, Common.MetricSettings.fnRecalcToMM(field.getNumberValue()));
                        }
                    }
                    this.fireEvent("editcomplete", this);
                },
                this)
            }
        });
        this.controls.push(this.numSpacingAfter);
        this._SpacingPanel = Ext.create("Ext.container.Container", {
            layout: "vbox",
            layoutConfig: {
                align: "stretch"
            },
            height: 107,
            width: 190,
            items: [{
                xtype: "tbspacer",
                height: 8
            },
            {
                xtype: "container",
                height: 41,
                layout: {
                    type: "table",
                    columns: 2,
                    tdAttrs: {
                        style: "padding-right: 8px;vertical-align: middle;"
                    }
                },
                items: [{
                    xtype: "label",
                    text: this.strLineHeight,
                    style: "display: block;",
                    width: 85
                },
                {
                    xtype: "label",
                    text: this.textAt,
                    style: "display: block;",
                    width: 85
                },
                {
                    xtype: "tbspacer",
                    height: 2
                },
                {
                    xtype: "tbspacer",
                    height: 2
                },
                this.cmbLineRule, this.numLineHeight]
            },
            {
                xtype: "tbspacer",
                height: 10
            },
            {
                xtype: "container",
                layout: {
                    type: "table",
                    columns: 2,
                    tdAttrs: {
                        style: "padding-right: 8px;"
                    }
                },
                defaults: {
                    xtype: "container",
                    layout: "vbox",
                    layoutConfig: {
                        align: "stretch"
                    },
                    height: 48,
                    style: "float:left;"
                },
                items: [{
                    items: [{
                        xtype: "label",
                        text: this.strSpacingBefore,
                        width: 85
                    },
                    {
                        xtype: "tbspacer",
                        height: 3
                    },
                    this.numSpacingBefore]
                },
                {
                    items: [{
                        xtype: "label",
                        text: this.strSpacingAfter,
                        width: 85
                    },
                    {
                        xtype: "tbspacer",
                        height: 3
                    },
                    this.numSpacingAfter]
                }]
            }]
        });
        this.items = [{
            xtype: "tbspacer",
            height: 9
        },
        {
            xtype: "label",
            style: "font-weight: bold;margin-top: 1px;",
            text: this.strParagraphSpacing
        },
        this._SpacingPanel, {
            xtype: "tbspacer",
            height: 3
        },
        {
            xtype: "tbspacer",
            width: "100%",
            height: 10,
            style: "padding-right: 10px;",
            html: '<div style="width: 100%; height: 40%; border-bottom: 1px solid #C7C7C7"></div>'
        },
        {
            xtype: "tbspacer",
            height: 3
        },
        {
            xtype: "container",
            height: 20,
            width: "100%",
            items: [{
                xtype: "box",
                html: '<div style="width:100%;text-align:center;padding-right:15px;"><label id="paragraph-advanced-link" class="asc-advanced-link">' + this.textAdvanced + "</label></div>",
                listeners: {
                    afterrender: function (cmp) {
                        document.getElementById("paragraph-advanced-link").onclick = Ext.bind(this._openAdvancedSettings, this);
                    },
                    scope: this
                }
            }]
        }];
        this.addEvents("editcomplete");
        this.callParent(arguments);
    },
    _onLineSpacing: function (value) {
        var linerule = value.get_LineRule();
        var line = value.get_Line();
        this.numLineHeight.suspendEvents(false);
        this.cmbLineRule.suspendEvents(false);
        if (this._state.LineRuleIdx !== linerule) {
            this.cmbLineRule.setValue((linerule !== null) ? this._arrLineRule[linerule] : "");
            this.numLineHeight.setMinValue(this._arrLineDefaults[(linerule !== null) ? linerule : 1][2]);
            this.numLineHeight.setDefaultUnit(this._arrLineDefaults[(linerule !== null) ? linerule : 1][1]);
            this.numLineHeight.setStep(this._arrLineDefaults[(linerule !== null) ? linerule : 1][3]);
            this._state.LineRuleIdx = linerule;
        }
        if (Math.abs(this._state.LineHeight - line) > 0.001 || (this._state.LineHeight === null || line === null) && (this._state.LineHeight !== line)) {
            var val = "";
            if (linerule == c_paragraphLinerule.LINERULE_AUTO) {
                val = line;
            } else {
                if (linerule !== null && line !== null) {
                    val = Common.MetricSettings.fnRecalcFromMM(line);
                }
            }
            this.numLineHeight.setValue((val !== null) ? val : "");
            this._state.LineHeight = line;
        }
        this.numLineHeight.resumeEvents();
        this.cmbLineRule.resumeEvents();
    },
    ChangeSettings: function (prop) {
        if (this._initSettings) {
            this.createDelayedElements();
            this._initSettings = false;
        }
        if (prop) {
            this.SuspendEvents();
            var Spacing = {
                Line: prop.get_Spacing().get_Line(),
                Before: prop.get_Spacing().get_Before(),
                After: prop.get_Spacing().get_After(),
                LineRule: prop.get_Spacing().get_LineRule()
            };
            if (this._state.LineRuleIdx !== Spacing.LineRule) {
                this.cmbLineRule.setValue((Spacing.LineRule !== null) ? this._arrLineRule[Spacing.LineRule] : "");
                this.numLineHeight.setMinValue(this._arrLineDefaults[(Spacing.LineRule !== null) ? Spacing.LineRule : 1][2]);
                this.numLineHeight.setDefaultUnit(this._arrLineDefaults[(Spacing.LineRule !== null) ? Spacing.LineRule : 1][1]);
                this.numLineHeight.setStep(this._arrLineDefaults[(Spacing.LineRule !== null) ? Spacing.LineRule : 1][3]);
                this._state.LineRuleIdx = Spacing.LineRule;
            }
            if (Math.abs(this._state.LineHeight - Spacing.Line) > 0.001 || (this._state.LineHeight === null || Spacing.Line === null) && (this._state.LineHeight !== Spacing.Line)) {
                var val = "";
                if (Spacing.LineRule == c_paragraphLinerule.LINERULE_AUTO) {
                    val = Spacing.Line;
                } else {
                    if (Spacing.LineRule !== null && Spacing.Line !== null) {
                        val = Common.MetricSettings.fnRecalcFromMM(Spacing.Line);
                    }
                }
                this.numLineHeight.setValue((val !== null) ? val : "");
                this._state.LineHeight = Spacing.Line;
            }
            if (Math.abs(this._state.LineSpacingBefore - Spacing.Before) > 0.001 || (this._state.LineSpacingBefore === null || Spacing.Before === null) && (this._state.LineSpacingBefore !== Spacing.Before)) {
                this.numSpacingBefore.setValue((Spacing.Before !== null) ? ((Spacing.Before < 0) ? Spacing.Before : Common.MetricSettings.fnRecalcFromMM(Spacing.Before)) : "");
                this._state.LineSpacingBefore = Spacing.Before;
            }
            if (Math.abs(this._state.LineSpacingAfter - Spacing.After) > 0.001 || (this._state.LineSpacingAfter === null || Spacing.After === null) && (this._state.LineSpacingAfter !== Spacing.After)) {
                this.numSpacingAfter.setValue((Spacing.After !== null) ? ((Spacing.After < 0) ? Spacing.After : Common.MetricSettings.fnRecalcFromMM(Spacing.After)) : "");
                this._state.LineSpacingAfter = Spacing.After;
            }
            this.ResumeEvents();
        }
    },
    updateMetricUnit: function () {
        var spinners = this.query("commonmetricspinner");
        if (spinners) {
            for (var i = 0; i < spinners.length; i++) {
                var spinner = spinners[i];
                if (spinner.id == "paragraph-spin-line-height") {
                    continue;
                }
                spinner.setDefaultUnit(Common.MetricSettings.metricName[Common.MetricSettings.getCurrentMetric()]);
                spinner.setStep(Common.MetricSettings.getCurrentMetric() == Common.MetricSettings.c_MetricUnits.cm ? 0.01 : 1);
            }
        }
        this._arrLineDefaults[2][1] = this._arrLineDefaults[0][1] = Common.MetricSettings.metricName[Common.MetricSettings.getCurrentMetric()];
        this._arrLineDefaults[2][2] = this._arrLineDefaults[0][2] = parseFloat(Common.MetricSettings.fnRecalcFromMM(0.3).toFixed(2));
        this._arrLineDefaults[2][3] = this._arrLineDefaults[0][3] = (Common.MetricSettings.getCurrentMetric() == Common.MetricSettings.c_MetricUnits.cm) ? 0.01 : 1;
        if (this._state.LineRuleIdx !== null) {
            this.numLineHeight.setDefaultUnit(this._arrLineDefaults[this._state.LineRuleIdx][1]);
            this.numLineHeight.setStep(this._arrLineDefaults[this._state.LineRuleIdx][3]);
        }
    },
    _openAdvancedSettings: function (e) {
        var me = this;
        var win;
        if (me.api) {
            var selectedElements = me.api.getSelectedElements();
            if (selectedElements && Ext.isArray(selectedElements)) {
                var elType, elValue;
                for (var i = selectedElements.length - 1; i >= 0; i--) {
                    elType = selectedElements[i].get_ObjectType();
                    elValue = selectedElements[i].get_ObjectValue();
                    if (c_oAscTypeSelectElement.Paragraph == elType) {
                        win = Ext.create("PE.view.ParagraphSettingsAdvanced");
                        win.updateMetricUnit();
                        win.setSettings({
                            paragraphProps: elValue,
                            api: me.api
                        });
                        break;
                    }
                }
            }
        }
        if (win) {
            win.addListener("onmodalresult", Ext.bind(function (o, mr, s) {
                if (mr == 1 && s) {
                    me.api.paraApply(s.paragraphProps);
                }
            },
            this), false);
            win.addListener("close", function () {
                me.fireEvent("editcomplete", me);
            },
            false);
            win.show();
        }
    },
    createDelayedElements: function () {
        this.updateMetricUnit();
    },
    strParagraphSpacing: "Spacing",
    strLineHeight: "Line Spacing",
    strSpacingBefore: "Before",
    strSpacingAfter: "After",
    textAuto: "Multiple",
    textAtLeast: "At least",
    textExact: "Exactly",
    textAt: "At",
    txtTitle: "Paragraph",
    txtAutoText: "Auto",
    textAdvanced: "Show advanced settings"
});