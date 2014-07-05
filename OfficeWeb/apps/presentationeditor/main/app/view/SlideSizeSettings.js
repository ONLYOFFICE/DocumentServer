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
 Ext.define("PE.view.SlideSizeSettings", {
    extend: "Ext.window.Window",
    alias: "widget.peslidesizesettings",
    requires: ["Ext.window.Window", "Ext.form.field.ComboBox", "Common.component.MetricSpinner", "Ext.Array", "Common.plugin.ComboBoxScrollPane"],
    cls: "asc-advanced-settings-window",
    modal: true,
    resizable: false,
    plain: true,
    constrain: true,
    height: 230,
    width: 270,
    layout: {
        type: "vbox",
        align: "stretch"
    },
    listeners: {
        show: function () {
            this._spnWidth.focus(false, 500);
        }
    },
    initComponent: function () {
        var me = this;
        this.addEvents("onmodalresult");
        this._noApply = false;
        this._sizeIdx = 0;
        this._spacer = Ext.create("Ext.toolbar.Spacer", {
            width: "100%",
            height: 10,
            html: '<div style="width: 100%; height: 40%; border-bottom: 1px solid #C7C7C7"></div>'
        });
        this.cmbSlideSize = Ext.widget("combo", {
            store: Ext.create("Ext.data.Store", {
                fields: ["description", "type", "size"],
                data: [{
                    type: 1,
                    description: me.txtStandard,
                    size: [254, 190.5]
                },
                {
                    type: 2,
                    description: me.txtWidescreen1,
                    size: [254, 143]
                },
                {
                    type: 3,
                    description: me.txtWidescreen2,
                    size: [254, 158.7]
                },
                {
                    type: 4,
                    description: me.txtLetter,
                    size: [254, 190.5]
                },
                {
                    type: 5,
                    description: me.txtLedger,
                    size: [338.3, 253.7]
                },
                {
                    type: 6,
                    description: me.txtA3,
                    size: [355.6, 266.7]
                },
                {
                    type: 7,
                    description: me.txtA4,
                    size: [275, 190.5]
                },
                {
                    type: 8,
                    description: me.txtB4,
                    size: [300.7, 225.5]
                },
                {
                    type: 9,
                    description: me.txtB5,
                    size: [199.1, 149.3]
                },
                {
                    type: 10,
                    description: me.txt35,
                    size: [285.7, 190.5]
                },
                {
                    type: 11,
                    description: me.txtOverhead,
                    size: [254, 190.5]
                },
                {
                    type: 12,
                    description: me.txtBanner,
                    size: [203.2, 25.4]
                },
                {
                    type: -1,
                    description: me.txtCustom,
                    size: []
                }]
            }),
            displayField: "description",
            valueField: "type",
            queryMode: "local",
            editable: false,
            value: me.txtStandard,
            listeners: {
                select: Ext.bind(function (combo, records, eOpts) {
                    me._sizeIdx = records[0].index;
                    combo.blur();
                    me._noApply = true;
                    if (records[0].index == 12) {} else {
                        me._spnWidth.setValue(Common.MetricSettings.fnRecalcFromMM(records[0].data.size[0]));
                        me._spnHeight.setValue(Common.MetricSettings.fnRecalcFromMM(records[0].data.size[1]));
                    }
                    me._noApply = false;
                },
                this)
            }
        });
        this.cmbSlideSize.select(this.cmbSlideSize.getStore().getAt(0));
        this._spnWidth = Ext.create("Common.component.MetricSpinner", {
            id: "slide-advanced-spin-width",
            readOnly: false,
            maxValue: 55.88,
            minValue: 0,
            step: 0.1,
            defaultUnit: "cm",
            value: "25.4 cm",
            width: 75,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (!me._noApply && me._sizeIdx != 12) {
                        me.cmbSlideSize.select(me.cmbSlideSize.getStore().getAt(12));
                        me._sizeIdx = 12;
                    }
                },
                this),
                specialkey: function (field, e) {
                    if (e.getKey() == e.ENTER) {
                        me.btnOk.fireEvent("click");
                    } else {
                        if (e.getKey() == e.ESC) {
                            me.btnCancel.fireEvent("click");
                        }
                    }
                }
            }
        });
        this._spnHeight = Ext.create("Common.component.MetricSpinner", {
            id: "slide-advanced-span-height",
            readOnly: false,
            maxValue: 55.88,
            minValue: 0,
            step: 0.1,
            defaultUnit: "cm",
            value: "19.05 cm",
            width: 75,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (!me._noApply && me._sizeIdx != 12) {
                        me.cmbSlideSize.select(me.cmbSlideSize.getStore().getAt(12));
                        me._sizeIdx = 12;
                    }
                },
                this),
                specialkey: function (field, e) {
                    if (e.getKey() == e.ENTER) {
                        me.btnOk.fireEvent("click");
                    } else {
                        if (e.getKey() == e.ESC) {
                            me.btnCancel.fireEvent("click");
                        }
                    }
                }
            }
        });
        this.label = Ext.widget("label", {
            width: "100%",
            margin: "0 0 2 0",
            style: "font-weight: bold;"
        });
        this.items = [{
            xtype: "container",
            height: 136,
            padding: "18 25",
            layout: {
                type: "vbox",
                align: "stretch"
            },
            items: [this.label.cloneConfig({
                text: me.textSlideSize
            }), this.cmbSlideSize, {
                xtype: "tbspacer",
                height: 10
            },
            {
                xtype: "container",
                height: 44,
                layout: {
                    type: "hbox",
                    align: "stretch"
                },
                items: [{
                    xtype: "container",
                    flex: 1,
                    layout: {
                        type: "vbox",
                        align: "stretch"
                    },
                    items: [this.label.cloneConfig({
                        text: me.textWidth
                    }), this._spnWidth]
                },
                {
                    xtype: "tbspacer",
                    width: 18
                },
                {
                    xtype: "container",
                    flex: 1,
                    layout: {
                        type: "vbox",
                        align: "stretch"
                    },
                    items: [this.label.cloneConfig({
                        text: me.textHeight
                    }), this._spnHeight]
                }]
            }]
        },
        this._spacer.cloneConfig(), {
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
                            this.fireEvent("onmodalresult", 1);
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
                            this.fireEvent("onmodalresult", 0);
                            this.close();
                        },
                        scope: this
                    }
                })]
            }]
        }];
        this.callParent(arguments);
        this.setTitle(this.textTitle);
    },
    afterRender: function () {
        this.callParent(arguments);
    },
    setSettings: function (type, pagewitdh, pageheight) {
        this._spnWidth.setValue(Common.MetricSettings.fnRecalcFromMM(pagewitdh));
        this._spnHeight.setValue(Common.MetricSettings.fnRecalcFromMM(pageheight));
        this.cmbSlideSize.select(this.cmbSlideSize.getStore().getAt((type < 0) ? 12 : type));
    },
    getSettings: function () {
        var props = [(this._sizeIdx < 12) ? this._sizeIdx : -1, Common.MetricSettings.fnRecalcToMM(this._spnWidth.getNumberValue()), Common.MetricSettings.fnRecalcToMM(this._spnHeight.getNumberValue())];
        return props;
    },
    updateMetricUnit: function () {
        var spinners = this.query("commonmetricspinner");
        if (spinners) {
            for (var i = 0; i < spinners.length; i++) {
                var spinner = spinners[i];
                spinner.setDefaultUnit(Common.MetricSettings.metricName[Common.MetricSettings.getCurrentMetric()]);
                spinner.setStep(Common.MetricSettings.getCurrentMetric() == Common.MetricSettings.c_MetricUnits.cm ? 0.1 : 1);
            }
        }
    },
    textTitle: "Slide Size Settings",
    textSlideSize: "Slide Size",
    textWidth: "Width",
    textHeight: "Height",
    cancelButtonText: "Cancel",
    okButtonText: "Ok",
    txtStandard: "Standard (4:3)",
    txtWidescreen1: "Widescreen (16:9)",
    txtWidescreen2: "Widescreen (16:10)",
    txtLetter: "Letter Paper (8.5x11 in)",
    txtLedger: "Ledger Paper (11x17 in)",
    txtA3: "A3 Paper (297x420 mm)",
    txtA4: "A4 Paper (210x297 mm)",
    txtB4: "B4 (ICO) Paper (250x353 mm)",
    txtB5: "B5 (ICO) Paper (176x250 mm)",
    txt35: "35 mm Slides",
    txtOverhead: "Overhead",
    txtBanner: "Banner",
    txtCustom: "Custom"
});