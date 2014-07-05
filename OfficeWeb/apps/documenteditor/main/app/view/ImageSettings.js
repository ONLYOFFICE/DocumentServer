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
 Ext.define("DE.view.ImageSettings", {
    extend: "Common.view.AbstractSettingsPanel",
    alias: "widget.deimagesettings",
    height: 298,
    requires: ["Ext.ComponentQuery", "Ext.container.Container", "Ext.button.Button", "Ext.form.Checkbox", "Ext.form.Text", "Ext.form.Label", "Ext.toolbar.Spacer", "Common.view.ImageFromUrlDialog", "DE.view.ImageSettingsAdvanced", "Common.component.MenuDataViewPicker"],
    constructor: function (config) {
        this.callParent(arguments);
        this.initConfig(config);
        return this;
    },
    initComponent: function () {
        this.title = this.txtTitle;
        this._initSettings = true;
        this._state = {
            WrappingStyle: c_oAscWrapStyle2.Inline,
            CanBeFlow: true,
            Width: 0,
            Height: 0,
            FromGroup: false
        };
        this._nRatio = 1;
        this._noApply = false;
        this._originalProps = null;
        var dataTpl = Ext.create("Ext.XTemplate", '<tpl for=".">', '<div class="thumb-wrap" data-qtip="{tip}">', '<img src="data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" style="{imgstyle}" class="item-wraplist"/>', '<tpl if="title">', '<span class="title">{title}</span>', "</tpl>", "</div>", "</tpl>");
        var viewData = [{
            offsetx: 0,
            data: c_oAscWrapStyle2.Inline,
            iconcls: "wrap-subtype wrap-inline",
            tip: this.txtInline
        },
        {
            offsetx: 50,
            data: c_oAscWrapStyle2.Square,
            iconcls: "wrap-subtype wrap-square",
            tip: this.txtSquare
        },
        {
            offsetx: 100,
            data: c_oAscWrapStyle2.Tight,
            iconcls: "wrap-subtype wrap-tight",
            tip: this.txtTight
        },
        {
            offsetx: 150,
            data: c_oAscWrapStyle2.Through,
            iconcls: "wrap-subtype wrap-through",
            tip: this.txtThrough
        },
        {
            offsetx: 200,
            data: c_oAscWrapStyle2.TopAndBottom,
            iconcls: "wrap-subtype wrap-topAndBottom",
            tip: this.txtTopAndBottom
        },
        {
            offsetx: 250,
            data: c_oAscWrapStyle2.InFront,
            iconcls: "wrap-subtype wrap-inFront",
            tip: this.txtInFront
        },
        {
            offsetx: 300,
            data: c_oAscWrapStyle2.Behind,
            iconcls: "wrap-subtype wrap-behind",
            tip: this.txtBehind
        }];
        for (var i = 0; i < viewData.length; i++) {
            viewData[i].imgstyle = Ext.String.format("background-position: {0}px 0;", -viewData[i].offsetx);
        }
        this.btnWrapType = Ext.widget("button", {
            id: "image-button-wrap",
            width: 72,
            height: 58,
            cls: "btn-wrap-types",
            iconCls: "wrap-subtype wrap-inline",
            pressedCls: "disablepressed",
            menuAlign: "tl-bl?",
            menu : Ext.create("Common.component.MenuDataViewPicker", {
                width: 257,
                height: 133,
                cls: "wrap-view",
                dataTpl: dataTpl,
                viewData: viewData,
                contentWidth: 237,
                listeners: {
                    select: Ext.bind(function (picker, record) {
                        this.btnWrapType.setIconCls(record.data.iconcls);
                        if (this.api && !this._noApply) {
                            var props = new CImgProperty();
                            props.put_WrappingStyle((record.data.data));
                            if (this._state.WrappingStyle === c_oAscWrapStyle2.Inline && record.data.data !== c_oAscWrapStyle2.Inline) {
                                props.put_PositionH(new CImagePositionH());
                                props.get_PositionH().put_UseAlign(false);
                                props.get_PositionH().put_RelativeFrom(c_oAscRelativeFromH.Column);
                                var val = this._originalProps.get_Value_X(c_oAscRelativeFromH.Column);
                                props.get_PositionH().put_Value(val);
                                props.put_PositionV(new CImagePositionV());
                                props.get_PositionV().put_UseAlign(false);
                                props.get_PositionV().put_RelativeFrom(c_oAscRelativeFromV.Paragraph);
                                val = this._originalProps.get_Value_Y(c_oAscRelativeFromV.Paragraph);
                                props.get_PositionV().put_Value(val);
                            }
                            this.api.ImgApply(props);
                        }
                        this.fireEvent("editcomplete", this);
                    },
                    this),
                    hide: Ext.bind(function () {
                        this.fireEvent("editcomplete", this);
                    },
                    this)
                }
            })
        });
        this.btnWrapType.menu.picker.selectByIndex(0);
        this._btnOriginalSize = Ext.create("Ext.Button", {
            id: "image-button-original-size",
            text: this.textOriginalSize,
            width: 100,
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
                        this.api.ChangeImageFromFile();
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
            height: 61,
            width: 200,
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
                defaults: {
                    xtype: "container",
                    layout: "vbox",
                    layoutConfig: {
                        align: "stretch"
                    },
                    height: 16,
                    style: "float:left;"
                },
                items: [{
                    items: [this.labelWidth = Ext.create("Ext.form.Label", {
                        text: this.textWidth,
                        width: 85
                    })]
                },
                {
                    items: [this.labelHeight = Ext.create("Ext.form.Label", {
                        text: this.textHeight,
                        width: 85
                    })]
                }]
            },
            {
                xtype: "tbspacer",
                height: 8
            },
            this._btnOriginalSize, {
                xtype: "tbspacer",
                height: 3
            }]
        });
        this._WrapPanel = Ext.create("Ext.container.Container", {
            layout: "vbox",
            layoutConfig: {
                align: "stretch"
            },
            height: 70,
            width: 200,
            items: [{
                xtype: "tbspacer",
                height: 6
            },
            {
                xtype: "container",
                height: 63,
                width: 200,
                layout: "hbox",
                items: [this.btnWrapType]
            }]
        });
        this._UrlPanel = Ext.create("Ext.container.Container", {
            layout: "vbox",
            layoutConfig: {
                align: "stretch"
            },
            height: 36,
            width: 200,
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
            text: this.textWrap
        },
        this._WrapPanel, {
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
        this._UrlPanel, {
            xtype: "tbspacer",
            height: 8
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
                html: '<div style="width:100%;text-align:center;padding-right:15px;"><label id="image-advanced-link" class="asc-advanced-link">' + this.textAdvanced + "</label></div>",
                listeners: {
                    afterrender: function (cmp) {
                        document.getElementById("image-advanced-link").onclick = Ext.bind(this._openAdvancedSettings, this);
                    },
                    scope: this
                }
            }]
        }];
        this.addEvents("editcomplete");
        this.callParent(arguments);
    },
    setOriginalSize: function () {
        if (this.api) {
            var imgsize = this.api.get_OriginalSizeImage();
            var w = imgsize.get_ImageWidth();
            var h = imgsize.get_ImageHeight();
            this.labelWidth.setText(this.textWidth + ": " + Ext.util.Format.round(Common.MetricSettings.fnRecalcFromMM(w), 1) + " " + Common.MetricSettings.metricName[Common.MetricSettings.getCurrentMetric()]);
            this.labelHeight.setText(this.textHeight + ": " + Ext.util.Format.round(Common.MetricSettings.fnRecalcFromMM(h), 1) + " " + Common.MetricSettings.metricName[Common.MetricSettings.getCurrentMetric()]);
            var properties = new CImgProperty();
            properties.put_Width(w);
            properties.put_Height(h);
            this.api.ImgApply(properties);
            this.fireEvent("editcomplete", this);
        }
    },
    setApi: function (api) {
        if (api == undefined) {
            return;
        }
        if (this.api) {
            this.api.asc_unregisterCallback("asc_onImgWrapStyleChanged", Ext.bind(this._ImgWrapStyleChanged, this));
        }
        this.api = api;
        this.api.asc_registerCallback("asc_onImgWrapStyleChanged", Ext.bind(this._ImgWrapStyleChanged, this));
    },
    ChangeSettings: function (props) {
        if (this._initSettings) {
            this.createDelayedElements();
            this._initSettings = false;
        }
        if (props) {
            this._originalProps = new CImgProperty(props);
            var value = props.get_WrappingStyle();
            if (this._state.WrappingStyle !== value) {
                this._noApply = true;
                var idx = this.btnWrapType.menu.picker.store.find("data", value);
                this.btnWrapType.menu.picker.selectByIndex(idx, false);
                if (idx >= 0) {
                    this.btnWrapType.setIconCls(this.btnWrapType.menu.viewData[idx].iconcls);
                } else {
                    this.btnWrapType.setIconCls("");
                }
                this._noApply = false;
                this._state.WrappingStyle = value;
            }
            value = props.get_CanBeFlow();
            var fromgroup = props.get_FromGroup();
            if (this._state.CanBeFlow !== value || this._state.FromGroup !== fromgroup) {
                this.btnWrapType.setDisabled(!value || fromgroup);
                this._state.CanBeFlow = value;
                this._state.FromGroup = fromgroup;
            }
            this.SuspendEvents();
            value = props.get_Width();
            if (Math.abs(this._state.Width - value) > 0.001) {
                this.labelWidth.setText(this.textWidth + ": " + Ext.util.Format.round(Common.MetricSettings.fnRecalcFromMM(value), 1) + " " + Common.MetricSettings.metricName[Common.MetricSettings.getCurrentMetric()]);
                this._state.Width = value;
            }
            value = props.get_Height();
            if (Math.abs(this._state.Height - value) > 0.001) {
                this.labelHeight.setText(this.textHeight + ": " + Ext.util.Format.round(Common.MetricSettings.fnRecalcFromMM(value), 1) + " " + Common.MetricSettings.metricName[Common.MetricSettings.getCurrentMetric()]);
                this._state.Height = value;
            }
            this._btnOriginalSize.setDisabled(props.get_ImageUrl() === null || props.get_ImageUrl() === undefined);
            this.ResumeEvents();
        }
    },
    _ImgWrapStyleChanged: function (style) {
        if (this._state.WrappingStyle !== style) {
            this._noApply = true;
            var idx = this.btnWrapType.menu.picker.store.find("data", style);
            this.btnWrapType.menu.picker.selectByIndex(idx, false);
            if (idx >= 0) {
                this.btnWrapType.setIconCls(this.btnWrapType.menu.viewData[idx].iconcls);
            }
            this._state.WrappingStyle = style;
            this._noApply = false;
        }
    },
    _onOpenImageFromURL: function (mr) {
        var self = this[0];
        var url = this[1].txtUrl;
        if (mr == 1 && self.api) {
            var checkurl = url.value.replace(/ /g, "");
            if (checkurl != "") {
                var props = new CImgProperty();
                props.put_ImageUrl(url.value);
                self.api.ImgApply(props);
            }
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
                    if (c_oAscTypeSelectElement.Image == elType) {
                        win = Ext.create("DE.view.ImageSettingsAdvanced", {});
                        win.updateMetricUnit();
                        win.setSettings(elValue);
                        break;
                    }
                }
            }
        }
        if (win) {
            var imgsize;
            if (!this._btnOriginalSize.isDisabled()) {
                imgsize = this.api.get_OriginalSizeImage();
                if (imgsize) {
                    win.setSizeOriginal({
                        width: imgsize.get_ImageWidth(),
                        height: imgsize.get_ImageHeight()
                    });
                }
            }
            imgsize = this.api.GetSectionInfo();
            win.setSizeMax({
                width: imgsize.get_PageWidth() - (imgsize.get_MarginLeft() + imgsize.get_MarginRight()),
                height: imgsize.get_PageHeight() - (imgsize.get_MarginTop() + imgsize.get_MarginBottom())
            });
            win.addListener("onmodalresult", Ext.bind(function (o, mr, s) {
                if (mr == 1 && s) {
                    me.api.ImgApply(s);
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
    updateMetricUnit: function () {
        var value = Common.MetricSettings.fnRecalcFromMM(this._state.Width);
        this.labelWidth.setText(this.textWidth + ": " + Ext.util.Format.round(value, 1) + " " + Common.MetricSettings.metricName[Common.MetricSettings.getCurrentMetric()]);
        value = Common.MetricSettings.fnRecalcFromMM(this._state.Height);
        this.labelHeight.setText(this.textHeight + ": " + Ext.util.Format.round(value, 1) + " " + Common.MetricSettings.metricName[Common.MetricSettings.getCurrentMetric()]);
    },
    createDelayedElements: function () {
        this.updateMetricUnit();
    },
    textSize: "Size",
    textWrap: "Wraping Style",
    textKeepRatio: "Constant Proportions",
    textWidth: "Width",
    textHeight: "Height",
    textOriginalSize: "Default Size",
    textApply: "Apply",
    textUrl: "Image URL",
    textInsert: "Insert Image",
    textUndock: "Undock from panel",
    textFromUrl: "From URL",
    textFromFile: "From File",
    textAdvanced: "Show advanced settings",
    txtTitle: "Picture",
    txtInline: "Inline",
    txtSquare: "Square",
    txtTight: "Tight",
    txtThrough: "Through",
    txtTopAndBottom: "Top and bottom",
    txtBehind: "Behind",
    txtInFront: "In front"
});