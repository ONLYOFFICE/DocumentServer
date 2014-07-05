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
 Ext.define("SSE.view.ImageSettings", {
    extend: "Common.view.AbstractSettingsPanel",
    alias: "widget.sseimagesettings",
    height: 192,
    requires: ["Ext.ComponentQuery", "Ext.container.Container", "Ext.button.Button", "Ext.form.Label", "Ext.toolbar.Spacer", "Common.view.ImageFromUrlDialog", "Ext.util.Cookies"],
    constructor: function (config) {
        this.callParent(arguments);
        this.initConfig(config);
        return this;
    },
    initComponent: function () {
        this.title = this.txtTitle;
        this._initSettings = true;
        this._nRatio = 1;
        this._state = {
            Width: 0,
            Height: 0
        };
        this._spnWidth = Ext.create("Common.component.MetricSpinner", {
            id: "image-spin-width",
            readOnly: false,
            maxValue: 55.88,
            minValue: 0,
            step: 0.1,
            defaultUnit: "cm",
            value: "3 cm",
            width: 78,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    var w = field.getNumberValue();
                    var h = this._spnHeight.getNumberValue();
                    if (this._btnRatio.pressed) {
                        h = w / this._nRatio;
                        if (h > this._spnHeight.maxValue) {
                            h = this._spnHeight.maxValue;
                            w = h * this._nRatio;
                            this._spnWidth.suspendEvents(false);
                            this._spnWidth.setValue(w);
                            this._spnWidth.resumeEvents();
                        }
                        this._spnHeight.suspendEvents(false);
                        this._spnHeight.setValue(h);
                        this._spnHeight.resumeEvents();
                    }
                    if (this.api) {
                        var props = new Asc.asc_CImgProperty();
                        props.asc_putWidth(Common.MetricSettings.fnRecalcToMM(w));
                        props.asc_putHeight(Common.MetricSettings.fnRecalcToMM(h));
                        this.api.asc_setGraphicObjectProps(props);
                    }
                    this.fireEvent("editcomplete", this);
                },
                this)
            }
        });
        this.controls.push(this._spnWidth);
        this._spnHeight = Ext.create("Common.component.MetricSpinner", {
            id: "image-span-height",
            readOnly: false,
            maxValue: 55.88,
            minValue: 0,
            step: 0.1,
            defaultUnit: "cm",
            value: "3 cm",
            width: 78,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    var h = field.getNumberValue(),
                    w = this._spnWidth.getNumberValue();
                    if (this._btnRatio.pressed) {
                        w = h * this._nRatio;
                        if (w > this._spnWidth.maxValue) {
                            w = this._spnWidth.maxValue;
                            h = w / this._nRatio;
                            this._spnHeight.suspendEvents(false);
                            this._spnHeight.setValue(h);
                            this._spnHeight.resumeEvents();
                        }
                        this._spnWidth.suspendEvents(false);
                        this._spnWidth.setValue(w);
                        this._spnWidth.resumeEvents();
                    }
                    if (this.api) {
                        var props = new Asc.asc_CImgProperty();
                        props.asc_putWidth(Common.MetricSettings.fnRecalcToMM(w));
                        props.asc_putHeight(Common.MetricSettings.fnRecalcToMM(h));
                        this.api.asc_setGraphicObjectProps(props);
                    }
                    this.fireEvent("editcomplete", this);
                },
                this)
            }
        });
        this.controls.push(this._spnHeight);
        var value = window.localStorage.getItem("sse-settings-imageratio");
        this._btnRatio = Ext.create("Ext.Button", {
            id: "image-button-ratio",
            iconCls: "advanced-btn-ratio",
            enableToggle: true,
            width: 22,
            height: 22,
            pressed: (value === null || parseInt(value) == 1),
            style: "margin: 0 0 0 4px;",
            tooltip: this.textKeepRatio,
            toggleHandler: Ext.bind(function (btn) {
                if (btn.pressed && this._spnHeight.getNumberValue() > 0) {
                    this._nRatio = this._spnWidth.getNumberValue() / this._spnHeight.getNumberValue();
                }
                window.localStorage.setItem("sse-settings-imageratio", (btn.pressed) ? 1 : 0);
            },
            this)
        });
        this._btnOriginalSize = Ext.create("Ext.Button", {
            id: "image-button-original-size",
            text: this.textOriginalSize,
            width: 106,
            listeners: {
                click: this.setOriginalSize,
                scope: this
            }
        });
        this._btnInsertFromFile = Ext.create("Ext.Button", {
            id: "image-button-from-file",
            text: this.textFromFile,
            width: 85,
            listeners: {
                click: function (btn) {
                    if (this.api) {
                        this.api.asc_changeImageFromFile();
                    }
                    this.fireEvent("editcomplete", this);
                },
                scope: this
            }
        });
        this._btnInsertFromUrl = Ext.create("Ext.Button", {
            id: "image-button-from-url",
            text: this.textFromUrl,
            width: 85,
            listeners: {
                click: function (btn) {
                    var w = Ext.create("Common.view.ImageFromUrlDialog");
                    w.addListener("onmodalresult", Ext.bind(this._onOpenImageFromURL, [this, w]), false);
                    w.addListener("close", Ext.bind(function (cnt, eOpts) {
                        this.fireEvent("editcomplete", this);
                    },
                    this));
                    w.show();
                },
                scope: this
            }
        });
        this._SizePanel = Ext.create("Ext.container.Container", {
            layout: "vbox",
            layoutConfig: {
                align: "stretch"
            },
            height: 88,
            width: 195,
            items: [{
                xtype: "tbspacer",
                height: 8
            },
            {
                xtype: "container",
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
                    items: [{
                        xtype: "label",
                        text: this.textWidth,
                        width: 78
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
                        items: [this._spnWidth, this._btnRatio, {
                            xtype: "tbspacer",
                            width: 4
                        }]
                    }]
                },
                {
                    items: [{
                        xtype: "label",
                        text: this.textHeight,
                        width: 78
                    },
                    {
                        xtype: "tbspacer",
                        height: 3
                    },
                    this._spnHeight]
                }]
            },
            {
                xtype: "tbspacer",
                height: 7
            },
            this._btnOriginalSize, {
                xtype: "tbspacer",
                height: 3
            }]
        });
        this._UrlPanel = Ext.create("Ext.container.Container", {
            layout: "vbox",
            layoutConfig: {
                align: "stretch"
            },
            height: 36,
            width: 195,
            items: [{
                xtype: "tbspacer",
                height: 8
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
                items: [this._btnInsertFromFile, this._btnInsertFromUrl]
            },
            {
                xtype: "tbspacer",
                height: 2
            }]
        });
        this.items = [{
            xtype: "tbspacer",
            height: 9
        },
        {
            xtype: "label",
            style: "font-weight: bold;margin-top: 1px;",
            text: this.textSize
        },
        this._SizePanel, {
            xtype: "tbspacer",
            height: 5
        },
        {
            xtype: "tbspacer",
            width: "100%",
            height: 10,
            style: "padding-right: 10px;",
            html: '<div style="width: 100%; height: 40%; border-bottom: 1px solid #C7C7C7"></div>'
        },
        {
            xtype: "label",
            style: "font-weight: bold;margin-top: 1px;",
            text: this.textInsert
        },
        this._UrlPanel];
        this.addEvents("editcomplete");
        this.callParent(arguments);
    },
    setOriginalSize: function () {
        if (this.api) {
            var imgsize = this.api.asc_getOriginalImageSize();
            if (imgsize) {
                var w = imgsize.asc_getImageWidth();
                var h = imgsize.asc_getImageHeight();
                var properties = new Asc.asc_CImgProperty();
                properties.asc_putWidth(w);
                properties.asc_putHeight(h);
                this.api.asc_setGraphicObjectProps(properties);
            }
            this.fireEvent("editcomplete", this);
        }
    },
    setApi: function (api) {
        if (api == undefined) {
            return;
        }
        this.api = api;
    },
    ChangeSettings: function (props) {
        if (this._initSettings) {
            this.createDelayedElements();
            this._initSettings = false;
        }
        if (props) {
            this.SuspendEvents();
            var value = props.asc_getWidth();
            if (Math.abs(this._state.Width - value) > 0.001 || (this._state.Width === null || value === null) && (this._state.Width !== value)) {
                this._spnWidth.setValue((value !== null) ? Common.MetricSettings.fnRecalcFromMM(value) : "");
                this._state.Width = value;
            }
            value = props.asc_getHeight();
            if (Math.abs(this._state.Height - value) > 0.001 || (this._state.Height === null || value === null) && (this._state.Height !== value)) {
                this._spnHeight.setValue((value !== null) ? Common.MetricSettings.fnRecalcFromMM(value) : "");
                this._state.Height = value;
            }
            this.ResumeEvents();
            if (props.asc_getHeight() > 0) {
                this._nRatio = props.asc_getWidth() / props.asc_getHeight();
            }
            this._btnOriginalSize.setDisabled(props.asc_getImageUrl() === null || props.asc_getImageUrl() === undefined);
        }
    },
    _onOpenImageFromURL: function (mr) {
        var self = this[0];
        var url = this[1].txtUrl;
        if (mr == 1 && self.api) {
            var checkurl = url.value.replace(/ /g, "");
            if (checkurl != "") {
                var props = new Asc.asc_CImgProperty();
                props.asc_putImageUrl(url.value);
                self.api.asc_setGraphicObjectProps(props);
            }
        }
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
    createDelayedElements: function () {
        this.updateMetricUnit();
    },
    textKeepRatio: "Constant Proportions",
    textSize: "Size",
    textWidth: "Width",
    textHeight: "Height",
    textOriginalSize: "Default Size",
    textUrl: "Image URL",
    textInsert: "Change Image",
    textFromUrl: "From URL",
    textFromFile: "From File",
    txtTitle: "Picture"
});