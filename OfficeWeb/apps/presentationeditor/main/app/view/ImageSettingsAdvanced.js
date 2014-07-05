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
 Ext.define("PE.view.ImageSettingsAdvanced", {
    extend: "Ext.window.Window",
    alias: "widget.peimagesettingsadvanced",
    requires: ["Common.component.MetricSpinner", "Ext.window.Window", "Ext.util.Cookies"],
    cls: "asc-advanced-settings-window",
    modal: true,
    resizable: false,
    plain: true,
    constrain: true,
    height: 253,
    width: 516,
    layout: {
        type: "vbox",
        align: "stretch"
    },
    _defaults: {
        sizeOriginal: {
            width: 0,
            height: 0
        },
        sizeMax: {
            width: 55.88,
            height: 55.88
        },
        properties: null
    },
    initComponent: function () {
        var me = this;
        this.addEvents("onmodalresult");
        this._nRatio = 1;
        this._spnWidth = Ext.create("Common.component.MetricSpinner", {
            id: "image-advanced-spin-width",
            readOnly: false,
            maxValue: 55.88,
            minValue: 0,
            step: 0.1,
            defaultUnit: "cm",
            value: "3 cm",
            width: 80,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (this._btnRatio.pressed) {
                        var w = field.getNumberValue();
                        var h = w / this._nRatio;
                        if (h > this._defaults.sizeMax.height) {
                            h = this._defaults.sizeMax.height;
                            w = h * this._nRatio;
                            this._spnWidth.suspendEvents(false);
                            this._spnWidth.setValue(w);
                            this._spnWidth.resumeEvents();
                        }
                        this._spnHeight.suspendEvents(false);
                        this._spnHeight.setValue(h);
                        this._spnHeight.resumeEvents();
                    }
                },
                this)
            }
        });
        this._spnHeight = Ext.create("Common.component.MetricSpinner", {
            id: "image-advanced-span-height",
            readOnly: false,
            maxValue: 55.88,
            minValue: 0,
            step: 0.1,
            defaultUnit: "cm",
            value: "3 cm",
            width: 80,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    var h = field.getNumberValue(),
                    w = null;
                    if (this._btnRatio.pressed) {
                        w = h * this._nRatio;
                        if (w > this._defaults.sizeMax.width) {
                            w = this._defaults.sizeMax.width;
                            h = w / this._nRatio;
                            this._spnHeight.suspendEvents(false);
                            this._spnHeight.setValue(h);
                            this._spnHeight.resumeEvents();
                        }
                        this._spnWidth.suspendEvents(false);
                        this._spnWidth.setValue(w);
                        this._spnWidth.resumeEvents();
                    }
                },
                this)
            }
        });
        this._btnOriginalSize = Ext.create("Ext.Button", {
            id: "image-advanced-button-original-size",
            text: this.textOriginalSize,
            width: 100,
            height: 22,
            style: "margin: 0 0 0 7px",
            listeners: {
                click: function (o, e) {
                    this._spnWidth.suspendEvents(false);
                    this._spnHeight.suspendEvents(false);
                    this._spnWidth.setValue(this._defaults.sizeOriginal.width);
                    this._spnHeight.setValue(this._defaults.sizeOriginal.height);
                    this._spnWidth.resumeEvents();
                    this._spnHeight.resumeEvents();
                    this._nRatio = this._defaults.sizeOriginal.width / this._defaults.sizeOriginal.height;
                },
                scope: this
            }
        });
        this._btnRatio = Ext.create("Ext.Button", {
            id: "image-advanced-button-ratio",
            iconCls: "advanced-btn-ratio",
            enableToggle: true,
            width: 22,
            height: 22,
            style: "margin: 0 0 0 6px;",
            tooltip: this.textKeepRatio,
            toggleHandler: Ext.bind(function (btn) {
                if (btn.pressed && this._spnHeight.getNumberValue() > 0) {
                    this._nRatio = this._spnWidth.getNumberValue() / this._spnHeight.getNumberValue();
                }
            },
            this)
        });
        this._spacer = Ext.create("Ext.toolbar.Spacer", {
            width: "100%",
            height: 10,
            html: '<div style="width: 100%; height: 40%; border-bottom: 1px solid #C7C7C7"></div>'
        });
        this._spnX = Ext.create("Common.component.MetricSpinner", {
            id: "image-span-x",
            readOnly: false,
            maxValue: 55.87,
            minValue: -55.87,
            step: 0.1,
            defaultUnit: "cm",
            value: "0 cm",
            width: 85
        });
        this._spnY = Ext.create("Common.component.MetricSpinner", {
            id: "image-span-y",
            readOnly: false,
            maxValue: 55.87,
            minValue: -55.87,
            step: 0.1,
            defaultUnit: "cm",
            value: "0 cm",
            width: 85
        });
        this._contPosition = Ext.create("Ext.Container", {
            cls: "image-advanced-container",
            padding: "0 10",
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
                height: 40,
                style: "float:left;"
            },
            items: [{
                width: 113,
                items: [{
                    xtype: "label",
                    text: "X",
                    width: 85
                },
                {
                    xtype: "tbspacer",
                    height: 3
                },
                this._spnX]
            },
            {
                items: [{
                    xtype: "label",
                    text: "Y",
                    width: 85
                },
                {
                    xtype: "tbspacer",
                    height: 3
                },
                this._spnY]
            }]
        });
        this.items = [{
            xtype: "container",
            height: 157,
            layout: {
                type: "hbox",
                align: "stretch"
            },
            items: [{
                xtype: "container",
                width: 160,
                padding: "18 0 0 0",
                layout: {
                    type: "vbox",
                    align: "stretch"
                },
                defaults: {
                    xtype: "container",
                    padding: "0 10 0 0",
                    layout: {
                        type: "hbox",
                        align: "middle",
                        pack: "end"
                    }
                },
                items: [{
                    height: 54,
                    items: [{
                        xtype: "label",
                        text: this.textSize,
                        style: "font-weight: bold;"
                    }]
                },
                {
                    height: 80,
                    cls: "image-advanced-container",
                    items: [{
                        xtype: "label",
                        text: this.textPosition,
                        style: "font-weight: bold;"
                    }]
                }]
            },
            {
                xtype: "box",
                cls: "advanced-settings-separator",
                height: "100%",
                width: 8
            },
            {
                xtype: "container",
                padding: "18 0 0 10",
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
                        columns: 2
                    },
                    defaults: {
                        xtype: "container",
                        layout: "vbox",
                        layoutConfig: {
                            align: "stretch"
                        },
                        height: 43,
                        style: "float:left;"
                    },
                    items: [{
                        width: 108,
                        items: [{
                            xtype: "label",
                            text: this.textWidth,
                            width: 80
                        },
                        {
                            xtype: "tbspacer",
                            height: 3
                        },
                        {
                            xtype: "container",
                            width: 108,
                            layout: {
                                type: "hbox"
                            },
                            items: [this._spnWidth, this._btnRatio]
                        }]
                    },
                    {
                        width: 195,
                        margin: "0 0 0 7",
                        items: [{
                            xtype: "label",
                            text: this.textHeight,
                            width: 80
                        },
                        {
                            xtype: "tbspacer",
                            height: 3
                        },
                        {
                            xtype: "container",
                            width: 195,
                            layout: {
                                type: "hbox"
                            },
                            items: [this._spnHeight, this._btnOriginalSize]
                        }]
                    }]
                },
                this._spacer.cloneConfig({
                    style: "margin: 16px 0 11px 0;",
                    height: 6
                }), this._contPosition]
            }]
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
        this._setDefaults(this._defaults.properties);
        this.setTitle(this.textTitle);
    },
    setSizeOriginal: function (p) {
        this._defaults.sizeOriginal.width = Common.MetricSettings.fnRecalcFromMM(p.width);
        this._defaults.sizeOriginal.height = Common.MetricSettings.fnRecalcFromMM(p.height);
    },
    setSizeMax: function (p) {
        this._defaults.sizeMax.width = Common.MetricSettings.fnRecalcFromMM(p.width);
        this._defaults.sizeMax.height = Common.MetricSettings.fnRecalcFromMM(p.height);
    },
    setSettings: function (props) {
        this._defaults.properties = props;
    },
    _setDefaults: function (props) {
        if (props) {
            this._spnWidth.suspendEvents(false);
            this._spnHeight.suspendEvents(false);
            this._spnWidth.setMaxValue(this._defaults.sizeMax.width);
            this._spnHeight.setMaxValue(this._defaults.sizeMax.height);
            this._spnWidth.setValue((props.get_Width() !== null) ? Common.MetricSettings.fnRecalcFromMM(props.get_Width()).toFixed(2) : "");
            this._spnHeight.setValue((props.get_Height() !== null) ? Common.MetricSettings.fnRecalcFromMM(props.get_Height()).toFixed(2) : "");
            this._spnWidth.resumeEvents();
            this._spnHeight.resumeEvents();
            if (props.get_Position()) {
                var Position = {
                    X: props.get_Position().get_X(),
                    Y: props.get_Position().get_Y()
                };
                if (Position.X !== null && Position.X !== undefined) {
                    this._spnX.setValue(Common.MetricSettings.fnRecalcFromMM(Position.X));
                }
                if (Position.Y !== null && Position.Y !== undefined) {
                    this._spnY.setValue(Common.MetricSettings.fnRecalcFromMM(Position.Y));
                }
            } else {
                this._spnX.setValue("");
                this._spnY.setValue("");
            }
            if (props.get_Height() > 0) {
                this._nRatio = props.get_Width() / props.get_Height();
            }
            var value = window.localStorage.getItem("pe-settings-imageratio");
            if (value === null || parseInt(value) == 1) {
                this._btnRatio.toggle(true);
            }
            this._btnOriginalSize.setDisabled(props.get_ImageUrl() === null || props.get_ImageUrl() === undefined);
        }
    },
    getSettings: function () {
        window.localStorage.setItem("pe-settings-imageratio", (this._btnRatio.pressed) ? 1 : 0);
        var properties = new CImgProperty();
        if (this._spnWidth.getValue() !== "") {
            properties.put_Width(Common.MetricSettings.fnRecalcToMM(this._spnWidth.getNumberValue()));
        }
        if (this._spnHeight.getValue() !== "") {
            properties.put_Height(Common.MetricSettings.fnRecalcToMM(this._spnHeight.getNumberValue()));
        }
        var Position = new CPosition();
        if (this._spnX.getValue() !== "") {
            Position.put_X(Common.MetricSettings.fnRecalcToMM(this._spnX.getNumberValue()));
        }
        if (this._spnY.getValue() !== "") {
            Position.put_Y(Common.MetricSettings.fnRecalcToMM(this._spnY.getNumberValue()));
        }
        properties.put_Position(Position);
        return properties;
    },
    updateMetricUnit: function () {
        var spinners = this.query("commonmetricspinner");
        if (spinners) {
            for (var i = 0; i < spinners.length; i++) {
                var spinner = spinners[i];
                spinner.setDefaultUnit(Common.MetricSettings.metricName[Common.MetricSettings.getCurrentMetric()]);
                spinner.setStep(Common.MetricSettings.getCurrentMetric() == Common.MetricSettings.c_MetricUnits.cm ? 0.01 : 1);
            }
        }
        this._defaults.sizeMax.width = Common.MetricSettings.fnRecalcFromMM(this._defaults.sizeMax.width * 10);
        this._defaults.sizeMax.height = Common.MetricSettings.fnRecalcFromMM(this._defaults.sizeMax.height * 10);
    },
    textOriginalSize: "Default Size",
    textPosition: "Position",
    textSize: "Size",
    textWidth: "Width",
    textHeight: "Height",
    textTitle: "Image - Advanced Settings",
    textKeepRatio: "Constant Proportions",
    cancelButtonText: "Cancel",
    okButtonText: "Ok"
});