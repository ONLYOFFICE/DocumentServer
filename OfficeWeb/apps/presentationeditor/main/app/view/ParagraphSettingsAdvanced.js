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
 Ext.define("PE.view.ParagraphSettingsAdvanced", {
    extend: "Ext.window.Window",
    alias: "widget.peparagraphsettingsadvanced",
    requires: ["Ext.Array", "Ext.form.field.ComboBox", "Ext.window.Window", "Common.component.ThemeColorPalette", "Common.component.MetricSpinner", "Common.component.IndeterminateCheckBox", "Common.plugin.GridScrollPane", "Ext.grid.Panel"],
    cls: "asc-advanced-settings-window",
    modal: true,
    resizable: false,
    plain: true,
    constrain: true,
    height: 390,
    width: 516,
    layout: {
        type: "vbox",
        align: "stretch"
    },
    initComponent: function () {
        var me = this;
        this.addEvents("onmodalresult");
        this._changedProps = null;
        this.checkGroup = 0;
        this._noApply = true;
        this._tabListChanged = false;
        this.numFirstLine = Ext.create("Common.component.MetricSpinner", {
            id: "paragraphadv-spin-first-line",
            readOnly: false,
            step: 0.1,
            width: 85,
            defaultUnit: "cm",
            value: "0 cm",
            maxValue: 55.87,
            minValue: -55.87,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (this._changedProps) {
                        if (this._changedProps.get_Ind() === null || this._changedProps.get_Ind() === undefined) {
                            this._changedProps.put_Ind(new CParagraphInd());
                        }
                        this._changedProps.get_Ind().put_FirstLine(Common.MetricSettings.fnRecalcToMM(field.getNumberValue()));
                    }
                },
                this)
            }
        });
        this.numIndentsLeft = Ext.widget("commonmetricspinner", {
            id: "paragraphadv-spin-indent-left",
            readOnly: false,
            step: 0.1,
            width: 85,
            defaultUnit: "cm",
            value: "0 cm",
            maxValue: 55.87,
            minValue: -55.87,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (this._changedProps) {
                        if (this._changedProps.get_Ind() === null || this._changedProps.get_Ind() === undefined) {
                            this._changedProps.put_Ind(new CParagraphInd());
                        }
                        this._changedProps.get_Ind().put_Left(Common.MetricSettings.fnRecalcToMM(field.getNumberValue()));
                    }
                },
                this)
            }
        });
        this.numIndentsRight = Ext.widget("commonmetricspinner", {
            id: "paragraphadv-spin-indent-right",
            readOnly: false,
            step: 0.1,
            width: 85,
            defaultUnit: "cm",
            value: "0 cm",
            maxValue: 55.87,
            minValue: -55.87,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (this._changedProps) {
                        if (this._changedProps.get_Ind() === null || this._changedProps.get_Ind() === undefined) {
                            this._changedProps.put_Ind(new CParagraphInd());
                        }
                        this._changedProps.get_Ind().put_Right(Common.MetricSettings.fnRecalcToMM(field.getNumberValue()));
                    }
                },
                this)
            }
        });
        this._spacer = Ext.create("Ext.toolbar.Spacer", {
            width: "100%",
            height: 10,
            html: '<div style="width: 100%; height: 40%; border-bottom: 1px solid #C7C7C7"></div>'
        });
        this.chStrike = Ext.create("Common.component.IndeterminateCheckBox", {
            id: "paragraphadv-checkbox-strike",
            width: 140,
            boxLabel: this.strStrike,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (this._changedProps && this.checkGroup != 1) {
                        this._changedProps.put_Strikeout(field.getValue() == "checked");
                    }
                    this.checkGroup = 0;
                    if (field.getValue() == "checked") {
                        this.checkGroup = 1;
                        this.chDoubleStrike.setValue(0);
                        if (this._changedProps) {
                            this._changedProps.put_DStrikeout(false);
                        }
                        this.checkGroup = 0;
                    }
                    if (this.api && !this._noApply) {
                        var properties = (this._originalProps) ? this._originalProps : new CParagraphProp();
                        properties.put_Strikeout(field.getValue() == "checked");
                        properties.put_DStrikeout(this.chDoubleStrike.getValue() == "checked");
                        this.api.SetDrawImagePlaceParagraph("paragraphadv-font-img", properties);
                    }
                },
                this)
            }
        });
        this.chDoubleStrike = Ext.create("Common.component.IndeterminateCheckBox", {
            id: "paragraphadv-checkbox-double-strike",
            width: 140,
            boxLabel: this.strDoubleStrike,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (this._changedProps && this.checkGroup != 1) {
                        this._changedProps.put_DStrikeout(field.getValue() == "checked");
                    }
                    this.checkGroup = 0;
                    if (field.getValue() == "checked") {
                        this.checkGroup = 1;
                        this.chStrike.setValue(0);
                        if (this._changedProps) {
                            this._changedProps.put_Strikeout(false);
                        }
                        this.checkGroup = 0;
                    }
                    if (this.api && !this._noApply) {
                        var properties = (this._originalProps) ? this._originalProps : new CParagraphProp();
                        properties.put_DStrikeout(field.getValue() == "checked");
                        properties.put_Strikeout(this.chStrike.getValue() == "checked");
                        this.api.SetDrawImagePlaceParagraph("paragraphadv-font-img", properties);
                    }
                },
                this)
            }
        });
        this.chSuperscript = Ext.create("Common.component.IndeterminateCheckBox", {
            id: "paragraphadv-checkbox-superscript",
            width: 140,
            boxLabel: this.strSuperscript,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (this._changedProps && this.checkGroup != 2) {
                        this._changedProps.put_Superscript(field.getValue() == "checked");
                    }
                    this.checkGroup = 0;
                    if (field.getValue() == "checked") {
                        this.checkGroup = 2;
                        this.chSubscript.setValue(0);
                        if (this._changedProps) {
                            this._changedProps.put_Subscript(false);
                        }
                        this.checkGroup = 0;
                    }
                    if (this.api && !this._noApply) {
                        var properties = (this._originalProps) ? this._originalProps : new CParagraphProp();
                        properties.put_Superscript(field.getValue() == "checked");
                        properties.put_Subscript(this.chSubscript.getValue() == "checked");
                        this.api.SetDrawImagePlaceParagraph("paragraphadv-font-img", properties);
                    }
                },
                this)
            }
        });
        this.chSubscript = Ext.create("Common.component.IndeterminateCheckBox", {
            id: "paragraphadv-checkbox-subscript",
            width: 140,
            boxLabel: this.strSubscript,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (this._changedProps && this.checkGroup != 2) {
                        this._changedProps.put_Subscript(field.getValue() == "checked");
                    }
                    this.checkGroup = 0;
                    if (field.getValue() == "checked") {
                        this.checkGroup = 2;
                        this.chSuperscript.setValue(0);
                        if (this._changedProps) {
                            this._changedProps.put_Superscript(false);
                        }
                        this.checkGroup = 0;
                    }
                    if (this.api && !this._noApply) {
                        var properties = (this._originalProps) ? this._originalProps : new CParagraphProp();
                        properties.put_Subscript(field.getValue() == "checked");
                        properties.put_Superscript(this.chSuperscript.getValue() == "checked");
                        this.api.SetDrawImagePlaceParagraph("paragraphadv-font-img", properties);
                    }
                },
                this)
            }
        });
        this.chSmallCaps = Ext.create("Common.component.IndeterminateCheckBox", {
            id: "paragraphadv-checkbox-small-caps",
            width: 140,
            boxLabel: this.strSmallCaps,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (this._changedProps && this.checkGroup != 3) {
                        this._changedProps.put_SmallCaps(field.getValue() == "checked");
                    }
                    this.checkGroup = 0;
                    if (field.getValue() == "checked") {
                        this.checkGroup = 3;
                        this.chAllCaps.setValue(0);
                        if (this._changedProps) {
                            this._changedProps.put_AllCaps(false);
                        }
                        this.checkGroup = 0;
                    }
                    if (this.api && !this._noApply) {
                        var properties = (this._originalProps) ? this._originalProps : new CParagraphProp();
                        properties.put_SmallCaps(field.getValue() == "checked");
                        properties.put_AllCaps(this.chAllCaps.getValue() == "checked");
                        this.api.SetDrawImagePlaceParagraph("paragraphadv-font-img", properties);
                    }
                },
                this)
            }
        });
        this.chAllCaps = Ext.create("Common.component.IndeterminateCheckBox", {
            id: "paragraphadv-checkbox-all-caps",
            width: 140,
            boxLabel: this.strAllCaps,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (this._changedProps && this.checkGroup != 3) {
                        this._changedProps.put_AllCaps(field.getValue() == "checked");
                    }
                    this.checkGroup = 0;
                    if (field.getValue() == "checked") {
                        this.checkGroup = 3;
                        this.chSmallCaps.setValue(0);
                        if (this._changedProps) {
                            this._changedProps.put_SmallCaps(false);
                        }
                        this.checkGroup = 0;
                    }
                    if (this.api && !this._noApply) {
                        var properties = (this._originalProps) ? this._originalProps : new CParagraphProp();
                        properties.put_AllCaps(field.getValue() == "checked");
                        properties.put_SmallCaps(this.chSmallCaps.getValue() == "checked");
                        this.api.SetDrawImagePlaceParagraph("paragraphadv-font-img", properties);
                    }
                },
                this)
            }
        });
        this.numSpacing = Ext.create("Common.component.MetricSpinner", {
            id: "paragraphadv-spin-spacing",
            readOnly: false,
            step: 0.01,
            width: 100,
            defaultUnit: "cm",
            value: "0 cm",
            maxValue: 55.87,
            minValue: -55.87,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (this._changedProps) {
                        this._changedProps.put_TextSpacing(Common.MetricSettings.fnRecalcToMM(field.getNumberValue()));
                    }
                    if (this.api && !this._noApply) {
                        var properties = (this._originalProps) ? this._originalProps : new CParagraphProp();
                        properties.put_TextSpacing(Common.MetricSettings.fnRecalcToMM(field.getNumberValue()));
                        this.api.SetDrawImagePlaceParagraph("paragraphadv-font-img", properties);
                    }
                },
                this)
            }
        });
        this.fontImage = Ext.create("Ext.container.Container", {
            id: "paragraphadv-font-img",
            width: "100%",
            height: 80,
            style: "background-color:#ffffff; border:1px solid #CDCDCD;"
        });
        this.numTab = Ext.widget("commonmetricspinner", {
            id: "paragraphadv-spin-tab",
            readOnly: false,
            step: 0.1,
            width: 180,
            defaultUnit: "cm",
            value: "1.25 cm",
            maxValue: 55.87,
            minValue: 0
        });
        this.numDefaultTab = Ext.widget("commonmetricspinner", {
            id: "paragraphadv-spin-default-tab",
            readOnly: false,
            step: 0.1,
            width: 107,
            defaultUnit: "cm",
            value: "1.25 cm",
            maxValue: 55.87,
            minValue: 0,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (this._changedProps) {
                        this._changedProps.put_DefaultTab(parseFloat(Common.MetricSettings.fnRecalcToMM(field.getNumberValue()).toFixed(1)));
                    }
                },
                this)
            }
        });
        this.btnAddTab = Ext.create("Ext.Button", {
            width: 90,
            text: this.textSet,
            enableToggle: false,
            listeners: {
                click: Ext.bind(function (btn, eOpts) {
                    var val = this.numTab.getNumberValue();
                    var align = this.radioLeft.getValue() ? 1 : (this.radioCenter.getValue() ? 3 : 2);
                    var idx = fieldStore.findBy(function (record, id) {
                        return (Math.abs(record.data.tabPos - val) < 0.001);
                    },
                    this);
                    if (idx < 0) {
                        var rec = fieldStore.add({
                            tabPos: val,
                            tabStr: val + " " + Common.MetricSettings.metricName[Common.MetricSettings.getCurrentMetric()],
                            tabAlign: align
                        });
                        fieldStore.sort();
                        this.tabList.getSelectionModel().select(rec);
                    } else {
                        var rec = fieldStore.getAt(idx);
                        rec.set("tabAlign", align);
                    }
                },
                this)
            }
        });
        this.btnRemoveTab = Ext.create("Ext.Button", {
            width: 90,
            text: this.textRemove,
            enableToggle: false,
            listeners: {
                click: Ext.bind(function (btn, eOpts) {
                    var rec = this.tabList.getSelectionModel().getSelection();
                    if (rec.length > 0) {
                        var idx = rec[0].index;
                        fieldStore.remove(rec);
                        if (idx > fieldStore.count() - 1) {
                            idx = fieldStore.count() - 1;
                        }
                        if (idx > -1) {
                            this.tabList.getSelectionModel().select(idx);
                        }
                    }
                },
                this)
            }
        });
        this.btnRemoveAll = Ext.create("Ext.Button", {
            width: 90,
            text: this.textRemoveAll,
            enableToggle: false,
            listeners: {
                click: Ext.bind(function (btn, eOpts) {
                    fieldStore.removeAll();
                },
                this)
            }
        });
        this.radioLeft = Ext.create("Ext.form.field.Radio", {
            boxLabel: this.textTabLeft,
            name: "asc-radio-tab",
            checked: true
        });
        this.radioCenter = Ext.create("Ext.form.field.Radio", {
            boxLabel: this.textTabCenter,
            name: "asc-radio-tab",
            checked: false
        });
        this.radioRight = Ext.create("Ext.form.field.Radio", {
            boxLabel: this.textTabRight,
            name: "asc-radio-tab",
            checked: false
        });
        Ext.define("PE.model.TabDataModel", {
            extend: "Ext.data.Model",
            fields: [{
                name: "tabPos",
                name: "tabStr",
                name: "tabAlign"
            }]
        });
        var fieldStore = Ext.create("Ext.data.Store", {
            model: "PE.model.TabDataModel",
            data: [],
            sorters: ["tabPos"],
            listeners: {
                datachanged: Ext.bind(function (btn, eOpts) {
                    if (!this._noApply) {
                        this._tabListChanged = true;
                    }
                },
                this),
                update: Ext.bind(function (btn, eOpts) {
                    if (!this._noApply) {
                        this._tabListChanged = true;
                    }
                },
                this),
                clear: Ext.bind(function (btn, eOpts) {
                    if (!this._noApply) {
                        this._tabListChanged = true;
                    }
                },
                this)
            }
        });
        this.tabList = Ext.create("Ext.grid.Panel", {
            activeItem: 0,
            id: "paragraphadv-tab-list",
            store: fieldStore,
            mode: "local",
            scroll: false,
            columns: [{
                flex: 1,
                dataIndex: "tabStr"
            }],
            height: 80,
            width: 180,
            hideHeaders: true,
            viewConfig: {
                stripeRows: false
            },
            plugins: [{
                pluginId: "scrollpane",
                ptype: "gridscrollpane"
            }],
            listeners: {
                select: function (o, record, index, eOpts) {
                    this.numTab.setValue(record.data.tabPos);
                    (record.data.tabAlign == 1) ? this.radioLeft.setValue(true) : ((record.data.tabAlign == 3) ? this.radioCenter.setValue(true) : this.radioRight.setValue(true));
                },
                scope: this
            }
        });
        this.btnIndents = Ext.widget("button", {
            width: 160,
            height: 27,
            cls: "asc-dialogmenu-btn",
            text: this.strParagraphIndents,
            textAlign: "right",
            enableToggle: true,
            allowDepress: false,
            toggleGroup: "advtablecardGroup",
            pressed: true,
            listeners: {
                click: function (btn) {
                    if (btn.pressed) {
                        this.mainCard.getLayout().setActiveItem("card-indents");
                    }
                },
                scope: this
            }
        });
        this.btnFont = Ext.widget("button", {
            width: 160,
            height: 27,
            cls: "asc-dialogmenu-btn",
            text: this.strParagraphFont,
            textAlign: "right",
            enableToggle: true,
            allowDepress: false,
            toggleGroup: "advtablecardGroup",
            listeners: {
                click: function (btn) {
                    if (btn.pressed) {
                        this.mainCard.getLayout().setActiveItem("card-font");
                    }
                },
                scope: this
            }
        });
        this.btnTabs = Ext.widget("button", {
            width: 160,
            height: 27,
            cls: "asc-dialogmenu-btn",
            textAlign: "right",
            text: this.strTabs,
            enableToggle: true,
            allowDepress: false,
            toggleGroup: "advtablecardGroup",
            listeners: {
                click: function (btn) {
                    if (btn.pressed) {
                        this.mainCard.getLayout().setActiveItem("card-tabs");
                        this.tabList.getPlugin("scrollpane").updateScrollPane();
                    }
                },
                scope: this
            }
        });
        this._IndentsContainer = {
            xtype: "container",
            itemId: "card-indents",
            width: 330,
            layout: {
                type: "vbox",
                align: "stretch"
            },
            items: [{
                xtype: "container",
                padding: "0 10",
                layout: {
                    type: "table",
                    columns: 5
                },
                defaults: {
                    xtype: "container",
                    layout: "vbox",
                    layoutConfig: {
                        align: "stretch"
                    },
                    height: 40,
                    style: "float:left;"
                },
                items: [{
                    items: [{
                        xtype: "label",
                        text: this.strIndentsFirstLine,
                        width: 85
                    },
                    {
                        xtype: "tbspacer",
                        height: 3
                    },
                    this.numFirstLine]
                },
                {
                    xtype: "tbspacer",
                    width: 23,
                    height: 3
                },
                {
                    items: [{
                        xtype: "label",
                        text: this.strIndentsLeftText,
                        width: 85
                    },
                    {
                        xtype: "tbspacer",
                        height: 3
                    },
                    this.numIndentsLeft]
                },
                {
                    xtype: "tbspacer",
                    width: 23,
                    height: 3
                },
                {
                    items: [{
                        xtype: "label",
                        text: this.strIndentsRightText,
                        width: 85
                    },
                    {
                        xtype: "tbspacer",
                        height: 3
                    },
                    this.numIndentsRight]
                }]
            }]
        };
        this._FontContainer = {
            xtype: "container",
            itemId: "card-font",
            width: 330,
            layout: {
                type: "vbox",
                align: "stretch"
            },
            items: [{
                xtype: "label",
                style: "font-weight: bold;margin-top: 1px; padding-left:10px;height:13px;",
                text: this.textEffects
            },
            {
                xtype: "tbspacer",
                height: 8
            },
            {
                xtype: "container",
                height: 85,
                width: "100%",
                padding: "0 10",
                layout: {
                    type: "table",
                    columns: 3,
                    tdAttrs: {
                        style: "vertical-align: middle;"
                    }
                },
                items: [this.chStrike, {
                    xtype: "tbspacer",
                    width: 20,
                    height: 2
                },
                this.chSubscript, this.chDoubleStrike, {
                    xtype: "tbspacer",
                    width: 20,
                    height: 2
                },
                this.chSmallCaps, this.chSuperscript, {
                    xtype: "tbspacer",
                    width: 20,
                    height: 2
                },
                this.chAllCaps]
            },
            {
                xtype: "label",
                style: "font-weight: bold;margin-top: 1px; padding-left:10px;height:13px;",
                text: this.textCharacterSpacing
            },
            {
                xtype: "tbspacer",
                height: 8
            },
            {
                xtype: "container",
                height: 26,
                padding: "0 10",
                layout: {
                    type: "vbox",
                    align: "left"
                },
                items: [this.numSpacing]
            },
            {
                xtype: "tbspacer",
                height: 10
            },
            {
                xtype: "container",
                height: 85,
                padding: "0 10",
                items: [this.fontImage]
            }]
        };
        this._TabsContainer = {
            xtype: "container",
            itemId: "card-tabs",
            width: 330,
            layout: {
                type: "vbox",
                align: "stretch"
            },
            items: [{
                xtype: "container",
                padding: "0 0 0 10",
                layout: {
                    type: "table",
                    columns: 3,
                    tdAttrs: {
                        style: "padding-right: 7px;"
                    }
                },
                defaults: {
                    xtype: "container",
                    layout: "vbox",
                    layoutConfig: {
                        align: "stretch"
                    },
                    style: "float:left;"
                },
                items: [{
                    height: 50,
                    colspan: 2,
                    items: [{
                        xtype: "label",
                        text: this.textTabPosition,
                        width: 85
                    },
                    {
                        xtype: "tbspacer",
                        height: 3
                    },
                    this.numTab]
                },
                {
                    height: 50,
                    items: [{
                        xtype: "label",
                        text: this.textDefault,
                        width: 107
                    },
                    {
                        xtype: "tbspacer",
                        height: 3
                    },
                    this.numDefaultTab]
                },
                {
                    height: 95,
                    colspan: 3,
                    items: [this.tabList]
                },
                {
                    height: 100,
                    colspan: 3,
                    items: [{
                        xtype: "label",
                        text: this.textAlign,
                        width: 85
                    },
                    {
                        xtype: "tbspacer",
                        height: 3
                    },
                    this.radioLeft, this.radioCenter, this.radioRight]
                },
                this.btnAddTab, this.btnRemoveTab, this.btnRemoveAll]
            }]
        };
        this.items = [{
            xtype: "container",
            height: 300,
            layout: {
                type: "hbox",
                align: "stretch"
            },
            items: [{
                xtype: "container",
                width: 160,
                padding: "5px 0 0 0",
                layout: {
                    type: "vbox",
                    align: "stretch"
                },
                defaults: {
                    xtype: "container",
                    layout: {
                        type: "hbox",
                        align: "middle",
                        pack: "end"
                    }
                },
                items: [{
                    height: 30,
                    items: [this.btnIndents]
                },
                {
                    height: 30,
                    items: [this.btnFont]
                },
                {
                    height: 30,
                    items: [this.btnTabs]
                }]
            },
            {
                xtype: "box",
                cls: "advanced-settings-separator",
                height: "100%",
                width: 8
            },
            this.mainCard = Ext.create("Ext.container.Container", {
                height: 300,
                flex: 1,
                padding: "12px 18px 0 10px",
                layout: "card",
                items: [this._IndentsContainer, this._FontContainer, this._TabsContainer]
            })]
        },
        this._spacer.cloneConfig({
            style: "margin: 0 18px"
        }), {
            xtype: "container",
            height: 40,
            layout: {
                type: "vbox",
                align: "center",
                pack: "center"
            },
            items: [{
                xtype: "container",
                width: 182,
                height: 24,
                layout: {
                    type: "hbox",
                    align: "middle"
                },
                items: [this.btnOk = Ext.widget("button", {
                    cls: "asc-blue-button",
                    width: 86,
                    height: 22,
                    margin: "0 5px 0 0",
                    text: this.okButtonText,
                    listeners: {
                        click: function (btn) {
                            this.fireEvent("onmodalresult", this, 1, this.getSettings());
                            this.close();
                        },
                        scope: this
                    }
                }), this.btnCancel = Ext.widget("button", {
                    cls: "asc-darkgray-button",
                    width: 86,
                    height: 22,
                    text: this.cancelButtonText,
                    listeners: {
                        click: function (btn) {
                            this.fireEvent("onmodalresult", this, 0);
                            this.close();
                        },
                        scope: this
                    }
                })]
            }]
        }];
        this.callParent(arguments);
    },
    afterRender: function () {
        this.callParent(arguments);
        this._setDefaults(this._originalProps);
        this.setTitle(this.textTitle);
    },
    setSettings: function (props) {
        this._originalProps = new CParagraphProp(props.paragraphProps);
        this._changedProps = null;
        this.api = props.api;
    },
    _setDefaults: function (props) {
        if (props) {
            this._originalProps = new CParagraphProp(props);
            this.numFirstLine.setValue((props.get_Ind() !== null && props.get_Ind().get_FirstLine() !== null) ? Common.MetricSettings.fnRecalcFromMM(props.get_Ind().get_FirstLine()) : "");
            this.numIndentsLeft.setValue((props.get_Ind() !== null && props.get_Ind().get_Left() !== null) ? Common.MetricSettings.fnRecalcFromMM(props.get_Ind().get_Left()) : "");
            this.numIndentsRight.setValue((props.get_Ind() !== null && props.get_Ind().get_Right() !== null) ? Common.MetricSettings.fnRecalcFromMM(props.get_Ind().get_Right()) : "");
            this._noApply = true;
            this.chStrike.setValue((props.get_Strikeout() !== null && props.get_Strikeout() !== undefined) ? props.get_Strikeout() : "indeterminate");
            this.chDoubleStrike.setValue((props.get_DStrikeout() !== null && props.get_DStrikeout() !== undefined) ? props.get_DStrikeout() : "indeterminate");
            this.chSubscript.setValue((props.get_Subscript() !== null && props.get_Subscript() !== undefined) ? props.get_Subscript() : "indeterminate");
            this.chSuperscript.setValue((props.get_Superscript() !== null && props.get_Superscript() !== undefined) ? props.get_Superscript() : "indeterminate");
            this.chSmallCaps.setValue((props.get_SmallCaps() !== null && props.get_SmallCaps() !== undefined) ? props.get_SmallCaps() : "indeterminate");
            this.chAllCaps.setValue((props.get_AllCaps() !== null && props.get_AllCaps() !== undefined) ? props.get_AllCaps() : "indeterminate");
            this.numSpacing.setValue((props.get_TextSpacing() !== null && props.get_TextSpacing() !== undefined) ? Common.MetricSettings.fnRecalcFromMM(props.get_TextSpacing()) : "");
            this.api.SetDrawImagePlaceParagraph("paragraphadv-font-img", this._originalProps);
            this.numDefaultTab.setValue((props.get_DefaultTab() !== null && props.get_DefaultTab() !== undefined) ? Common.MetricSettings.fnRecalcFromMM(parseFloat(props.get_DefaultTab().toFixed(1))) : "");
            var tabs = props.get_Tabs();
            if (tabs) {
                var arr = [];
                var count = tabs.get_Count();
                for (var i = 0; i < count; i++) {
                    var tab = tabs.get_Tab(i);
                    var rec = {
                        tabPos: Common.MetricSettings.fnRecalcFromMM(parseFloat(tab.get_Pos().toFixed(1))),
                        tabAlign: tab.get_Value()
                    };
                    rec.tabStr = parseFloat(Ext.Number.toFixed(rec.tabPos, 3)) + " " + Common.MetricSettings.metricName[Common.MetricSettings.getCurrentMetric()];
                    arr.push(rec);
                }
                this.tabList.getStore().loadData(arr);
                this.tabList.getStore().sort();
                if (this.tabList.getStore().count() > 0) {
                    this.tabList.getSelectionModel().select(0);
                }
            }
            this._noApply = false;
            this._changedProps = new CParagraphProp();
        }
    },
    getSettings: function () {
        if (this._tabListChanged) {
            if (this._changedProps.get_Tabs() === null || this._changedProps.get_Tabs() === undefined) {
                this._changedProps.put_Tabs(new CParagraphTabs());
            }
            this.tabList.getStore().each(function (item, index) {
                var tab = new CParagraphTab(Common.MetricSettings.fnRecalcToMM(item.data.tabPos), item.data.tabAlign);
                this._changedProps.get_Tabs().add_Tab(tab);
            },
            this);
        }
        return {
            paragraphProps: this._changedProps
        };
    },
    updateMetricUnit: function () {
        var spinners = this.query("commonmetricspinner");
        if (spinners) {
            for (var i = 0; i < spinners.length; i++) {
                var spinner = spinners[i];
                spinner.setDefaultUnit(Common.MetricSettings.metricName[Common.MetricSettings.getCurrentMetric()]);
                if (spinner.id == "paragraphadv-spin-spacing") {
                    spinner.setStep(Common.MetricSettings.getCurrentMetric() == Common.MetricSettings.c_MetricUnits.cm ? 0.01 : 1);
                } else {
                    spinner.setStep(Common.MetricSettings.getCurrentMetric() == Common.MetricSettings.c_MetricUnits.cm ? 0.1 : 1);
                }
            }
        }
    },
    textTitle: "Paragraph - Advanced Settings",
    strIndentsFirstLine: "First line",
    strIndentsLeftText: "Left",
    strIndentsRightText: "Right",
    strParagraphIndents: "Indents & Placement",
    strParagraphFont: "Font",
    cancelButtonText: "Cancel",
    okButtonText: "Ok",
    textEffects: "Effects",
    textCharacterSpacing: "Character Spacing",
    strDoubleStrike: "Double strikethrough",
    strStrike: "Strikethrough",
    strSuperscript: "Superscript",
    strSubscript: "Subscript",
    strSmallCaps: "Small caps",
    strAllCaps: "All caps",
    strTabs: "Tab",
    textSet: "Specify",
    textRemove: "Remove",
    textRemoveAll: "Remove All",
    textTabLeft: "Left",
    textTabRight: "Right",
    textTabCenter: "Center",
    textAlign: "Alignment",
    textTabPosition: "Tab Position",
    textDefault: "Default Tab"
});