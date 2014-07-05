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
 Ext.define("DE.view.ParagraphSettings", {
    extend: "Common.view.AbstractSettingsPanel",
    alias: "widget.deparagraphsettings",
    height: 261,
    requires: ["Ext.DomHelper", "Ext.button.Button", "Ext.form.field.Number", "Ext.form.Label", "Ext.container.Container", "Ext.toolbar.Spacer", "Common.component.MetricSpinner", "Common.component.IndeterminateCheckBox", "Ext.form.field.ComboBox", "DE.view.ParagraphSettingsAdvanced", "Common.component.ThemeColorPalette"],
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
            LineSpacingAfter: 0.35,
            AddInterval: false,
            BackColor: "#000000"
        };
        this.ThemeValues = [6, 15, 7, 16, 0, 1, 2, 3, 4, 5];
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
            minValue: 0.5,
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
        this.chAddInterval = Ext.create("Common.component.IndeterminateCheckBox", {
            id: "paragraph-checkbox-add-interval",
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (this.api) {
                        this.api.put_AddSpaceBetweenPrg((field.getValue() == "checked"));
                    }
                    this.fireEvent("editcomplete", this);
                },
                this)
            }
        });
        this.controls.push(this.chAddInterval);
        this._SpacingPanel = Ext.create("Ext.container.Container", {
            layout: "vbox",
            layoutConfig: {
                align: "stretch"
            },
            height: 139,
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
            },
            {
                xtype: "container",
                height: 32,
                width: "100%",
                layout: "hbox",
                items: [this.chAddInterval, {
                    xtype: "label",
                    text: this.strSomeParagraphSpace,
                    margin: "1px 0 0 4px",
                    flex: 1,
                    listeners: {
                        afterrender: Ext.bind(function (ct) {
                            ct.getEl().on("click", Ext.bind(function () {
                                this.chAddInterval.setValue((this.chAddInterval.getValue() == "indeterminate") ? false : !(this.chAddInterval.getValue() == "checked"));
                            },
                            this), this);
                            ct.getEl().on("dblclick", Ext.bind(function () {
                                this.chAddInterval.setValue((this.chAddInterval.getValue() == "indeterminate") ? false : !(this.chAddInterval.getValue() == "checked"));
                            },
                            this), this);
                        },
                        this)
                    }
                },
                {
                    xtype: "tbspacer",
                    width: 5
                }]
            }]
        });
        this._btnBackColor = Ext.create("Ext.button.Button", {
            id: "paragraph-button-back-color",
            arrowCls: "",
            width: 50,
            height: 22,
            color: "transparent",
            menu: {
                showSeparator: false,
                items: [this.colorsBack = Ext.create("Common.component.ThemeColorPalette", {
                    value: "000000",
                    width: 165,
                    height: 214,
                    dynamiccolors: true,
                    dyncolorscount: 10,
                    colors: [this.textThemeColors, "-", {
                        color: "3366FF",
                        effectId: 1
                    },
                    {
                        color: "0000FF",
                        effectId: 2
                    },
                    {
                        color: "000090",
                        effectId: 3
                    },
                    {
                        color: "660066",
                        effectId: 4
                    },
                    {
                        color: "800000",
                        effectId: 5
                    },
                    {
                        color: "FF0000",
                        effectId: 1
                    },
                    {
                        color: "FF6600",
                        effectId: 1
                    },
                    {
                        color: "FFFF00",
                        effectId: 2
                    },
                    {
                        color: "CCFFCC",
                        effectId: 3
                    },
                    {
                        color: "008000",
                        effectId: 4
                    },
                    "-", {
                        color: "000000",
                        effectId: 1
                    },
                    {
                        color: "FFFFFF",
                        effectId: 2
                    },
                    {
                        color: "000000",
                        effectId: 3
                    },
                    {
                        color: "FFFFFF",
                        effectId: 4
                    },
                    {
                        color: "000000",
                        effectId: 5
                    },
                    {
                        color: "000000",
                        effectId: 1
                    },
                    {
                        color: "FFFFFF",
                        effectId: 2
                    },
                    {
                        color: "000000",
                        effectId: 1
                    },
                    {
                        color: "FFFFFF",
                        effectId: 2
                    },
                    {
                        color: "000000",
                        effectId: 1
                    },
                    {
                        color: "000000",
                        effectId: 1
                    },
                    {
                        color: "FFFFFF",
                        effectId: 2
                    },
                    {
                        color: "000000",
                        effectId: 1
                    },
                    {
                        color: "FFFFFF",
                        effectId: 2
                    },
                    {
                        color: "000000",
                        effectId: 1
                    },
                    {
                        color: "000000",
                        effectId: 1
                    },
                    {
                        color: "FFFFFF",
                        effectId: 2
                    },
                    {
                        color: "000000",
                        effectId: 1
                    },
                    {
                        color: "FFFFFF",
                        effectId: 2
                    },
                    {
                        color: "000000",
                        effectId: 1
                    },
                    {
                        color: "000000",
                        effectId: 1
                    },
                    {
                        color: "FFFFFF",
                        effectId: 2
                    },
                    {
                        color: "000000",
                        effectId: 1
                    },
                    {
                        color: "FFFFFF",
                        effectId: 2
                    },
                    {
                        color: "000000",
                        effectId: 1
                    },
                    {
                        color: "000000",
                        effectId: 1
                    },
                    {
                        color: "FFFFFF",
                        effectId: 2
                    },
                    {
                        color: "000000",
                        effectId: 1
                    },
                    {
                        color: "FFFFFF",
                        effectId: 2
                    },
                    {
                        color: "000000",
                        effectId: 1
                    },
                    {
                        color: "000000",
                        effectId: 1
                    },
                    {
                        color: "FFFFFF",
                        effectId: 2
                    },
                    {
                        color: "000000",
                        effectId: 1
                    },
                    {
                        color: "FFFFFF",
                        effectId: 2
                    },
                    {
                        color: "000000",
                        effectId: 1
                    },
                    {
                        color: "000000",
                        effectId: 1
                    },
                    {
                        color: "FFFFFF",
                        effectId: 2
                    },
                    {
                        color: "000000",
                        effectId: 1
                    },
                    {
                        color: "FFFFFF",
                        effectId: 2
                    },
                    {
                        color: "000000",
                        effectId: 1
                    },
                    {
                        color: "000000",
                        effectId: 1
                    },
                    {
                        color: "FFFFFF",
                        effectId: 2
                    },
                    {
                        color: "000000",
                        effectId: 1
                    },
                    {
                        color: "FFFFFF",
                        effectId: 2
                    },
                    {
                        color: "000000",
                        effectId: 1
                    },
                    {
                        color: "000000",
                        effectId: 1
                    },
                    {
                        color: "FFFFFF",
                        effectId: 2
                    },
                    {
                        color: "000000",
                        effectId: 1
                    },
                    {
                        color: "FFFFFF",
                        effectId: 2
                    },
                    {
                        color: "000000",
                        effectId: 1
                    },
                    "-", "--", "-", this.textStandartColors, "-", "transparent", "5301B3", "980ABD", "B2275F", "F83D26", "F86A1D", "F7AC16", "F7CA12", "FAFF44", "D6EF39", "-", "--"],
                    listeners: {
                        select: {
                            fn: function (picker, color, eOpts, id) {
                                Ext.menu.Manager.hideAll();
                                var clr, border;
                                this._btnBackColor.color = color;
                                if (color == "transparent") {
                                    clr = "transparent";
                                    border = "1px solid #BEBEBE";
                                } else {
                                    clr = Ext.String.format("#{0}", (typeof(color) == "object") ? color.color : color);
                                    border = "none";
                                }
                                if (this._btnBackColor.btnEl) {
                                    Ext.DomHelper.applyStyles(this._btnBackColor.btnEl, {
                                        "background-color": clr,
                                        "border": border
                                    });
                                }
                                this.BackColor = this._btnBackColor.color;
                                if (this.api) {
                                    if (color == "transparent") {
                                        this.api.put_ParagraphShade(false);
                                    } else {
                                        this.api.put_ParagraphShade(true, this.getRgbColor(color));
                                    }
                                }
                                this.fireEvent("editcomplete", this);
                            },
                            scope: this
                        }
                    }
                }), {
                    cls: "menu-item-noicon menu-item-color-palette-theme",
                    text: this.textNewColor,
                    listeners: {
                        click: Ext.bind(function (item, event) {
                            this.colorsBack.addNewColor();
                        },
                        this)
                    }
                }]
            },
            listeners: {
                render: function (c) {
                    var border, clr;
                    if (c.color == "transparent") {
                        border = "1px solid #BEBEBE";
                        clr = c.color;
                    } else {
                        border = "none";
                        clr = Ext.String.format("#{0}", (typeof(c.color) == "object") ? c.color.color : c.color);
                    }
                    Ext.DomHelper.applyStyles(c.btnEl, {
                        "background-color": clr,
                        "border": border
                    });
                }
            },
            setColor: function (newcolor) {
                var border, clr;
                this.color = newcolor;
                if (newcolor == "transparent") {
                    border = "1px solid #BEBEBE";
                    clr = newcolor;
                } else {
                    border = "none";
                    clr = Ext.String.format("#{0}", (typeof(newcolor) == "object") ? newcolor.color : newcolor);
                }
                if (this.btnEl !== undefined) {
                    Ext.DomHelper.applyStyles(this.btnEl, {
                        "background-color": clr,
                        "border": border
                    });
                }
            }
        });
        this.controls.push(this.colorsBack);
        this._ColorContainer = Ext.create("Ext.container.Container", {
            height: 25,
            width: 195,
            layout: "hbox",
            items: [this._btnBackColor, {
                xtype: "tbspacer",
                width: 5
            },
            {
                xtype: "label",
                text: this.textBackColor,
                margin: "2px 0 0 0",
                flex: 1
            },
            {
                xtype: "tbspacer",
                width: 5
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
            height: 7
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
        this._ColorContainer, {
            xtype: "tbspacer",
            height: 10
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
    getHexColor: function (r, g, b) {
        r = r.toString(16);
        g = g.toString(16);
        b = b.toString(16);
        if (r.length == 1) {
            r = "0" + r;
        }
        if (g.length == 1) {
            g = "0" + g;
        }
        if (b.length == 1) {
            b = "0" + b;
        }
        return r + g + b;
    },
    getRgbColor: function (clr) {
        var color = (typeof(clr) == "object") ? clr.color : clr;
        color = color.replace(/#/, "");
        if (color.length == 3) {
            color = color.replace(/(.)/g, "$1$1");
        }
        color = parseInt(color, 16);
        var c = new CAscColor();
        c.put_type((typeof(clr) == "object") ? c_oAscColor.COLOR_TYPE_SCHEME : c_oAscColor.COLOR_TYPE_SRGB);
        c.put_r(color >> 16);
        c.put_g((color & 65280) >> 8);
        c.put_b(color & 255);
        c.put_a(255);
        if (clr.effectId !== undefined) {
            c.put_value(clr.effectId);
        }
        return c;
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
            var other = {
                ContextualSpacing: prop.get_ContextualSpacing()
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
            if (this._state.AddInterval !== other.ContextualSpacing) {
                this.chAddInterval.setValue((other.ContextualSpacing !== null && other.ContextualSpacing !== undefined) ? other.ContextualSpacing : "indeterminate");
                this._state.AddInterval = other.ContextualSpacing;
            }
            var shd = prop.get_Shade();
            if (shd !== null && shd !== undefined && shd.get_Value() === shd_Clear) {
                var color = shd.get_Color();
                if (color) {
                    if (color.get_type() == c_oAscColor.COLOR_TYPE_SCHEME) {
                        this.BackColor = {
                            color: this.getHexColor(color.get_r(), color.get_g(), color.get_b()),
                            effectValue: color.get_value()
                        };
                    } else {
                        this.BackColor = this.getHexColor(color.get_r(), color.get_g(), color.get_b());
                    }
                } else {
                    this.BackColor = "transparent";
                }
            } else {
                this.BackColor = "transparent";
            }
            var type1 = typeof(this.BackColor),
            type2 = typeof(this._state.BackColor);
            if ((type1 !== type2) || (type1 == "object" && (this.BackColor.effectValue !== this._state.BackColor.effectValue || this._state.BackColor.color.indexOf(this.BackColor.color) < 0)) || (type1 != "object" && this._state.BackColor.indexOf(this.BackColor) < 0)) {
                this._btnBackColor.setColor(this.BackColor);
                if (typeof(this.BackColor) == "object") {
                    for (var i = 0; i < 10; i++) {
                        if (this.ThemeValues[i] == this.BackColor.effectValue) {
                            this.colorsBack.select(this.BackColor, false);
                            break;
                        }
                    }
                } else {
                    this.colorsBack.select(this.BackColor, false);
                }
                this._state.BackColor = this.BackColor;
            }
            this.ResumeEvents();
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
                        var paragraph_config = {
                            tableStylerRows: 2,
                            tableStylerColumns: 1
                        };
                        win = Ext.create("DE.view.ParagraphSettingsAdvanced", paragraph_config);
                        win.updateMetricUnit();
                        win.setSettings({
                            paragraphProps: elValue,
                            borderProps: me.borderAdvancedProps,
                            api: me.api,
                            colorProps: [me.effectcolors, me.standartcolors]
                        });
                        break;
                    }
                }
            }
        }
        if (win) {
            win.addListener("onmodalresult", Ext.bind(function (o, mr, s) {
                if (mr == 1 && s) {
                    me.borderAdvancedProps = s.borderProps;
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
    SendThemeColors: function (effectcolors, standartcolors) {
        this.effectcolors = effectcolors;
        if (standartcolors && standartcolors.length > 0) {
            this.standartcolors = standartcolors;
        }
        this.colorsBack.updateColors(effectcolors, standartcolors);
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
    createDelayedElements: function () {
        this.updateMetricUnit();
    },
    strParagraphSpacing: "Spacing",
    strSomeParagraphSpace: "Don't add interval between paragraphs of the same style",
    strLineHeight: "Line Spacing",
    strSpacingBefore: "Before",
    strSpacingAfter: "After",
    textUndock: "Undock from panel",
    textAuto: "Multiple",
    textAtLeast: "At least",
    textExact: "Exactly",
    textAdvanced: "Show advanced settings",
    textAt: "At",
    txtTitle: "Paragraph",
    txtAutoText: "Auto",
    textThemeColors: "Theme Colors",
    textStandartColors: "Standart Colors",
    textBackColor: "Background color",
    textNewColor: "Add New Custom Color"
});