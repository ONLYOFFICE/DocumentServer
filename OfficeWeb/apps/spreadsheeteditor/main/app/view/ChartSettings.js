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
 define(["text!spreadsheeteditor/main/app/template/ChartSettings.template", "jquery", "underscore", "backbone", "common/main/lib/component/Button", "common/main/lib/component/MetricSpinner", "spreadsheeteditor/main/app/view/ChartSettingsDlg"], function (menuTemplate, $, _, Backbone) {
    SSE.Views.ChartSettings = Backbone.View.extend(_.extend({
        el: "#id-chart-settings",
        template: _.template(menuTemplate),
        events: {},
        options: {
            alias: "ChartSettings"
        },
        initialize: function () {
            var me = this;
            this._initSettings = true;
            this._state = {
                Width: 0,
                Height: 0,
                ChartStyle: 1,
                ChartType: -1,
                SeveralCharts: false,
                DisabledControls: false
            };
            this._nRatio = 1;
            this.spinners = [];
            this.lockedControls = [];
            this._locked = false;
            this._noApply = false;
            this._originalProps = null;
            this.render();
            this.btnChartType = new Common.UI.Button({
                cls: "btn-large-dataview",
                iconCls: "item-chartlist bar-normal",
                menu: new Common.UI.Menu({
                    style: "width: 330px;",
                    items: [{
                        template: _.template('<div id="id-chart-menu-type" class="menu-insertchart"  style="margin: 5px 5px 5px 10px;"></div>')
                    }]
                })
            });
            this.btnChartType.on("render:after", function (btn) {
                me.mnuChartTypePicker = new Common.UI.DataView({
                    el: $("#id-chart-menu-type"),
                    parentMenu: btn.menu,
                    restoreHeight: 411,
                    groups: new Common.UI.DataViewGroupStore([{
                        id: "menu-chart-group-bar",
                        caption: me.textColumn
                    },
                    {
                        id: "menu-chart-group-line",
                        caption: me.textLine
                    },
                    {
                        id: "menu-chart-group-pie",
                        caption: me.textPie
                    },
                    {
                        id: "menu-chart-group-hbar",
                        caption: me.textBar
                    },
                    {
                        id: "menu-chart-group-area",
                        caption: me.textArea
                    },
                    {
                        id: "menu-chart-group-scatter",
                        caption: me.textPoint
                    },
                    {
                        id: "menu-chart-group-stock",
                        caption: me.textStock
                    }]),
                    store: new Common.UI.DataViewStore([{
                        group: "menu-chart-group-bar",
                        type: c_oAscChartTypeSettings.barNormal,
                        iconCls: "column-normal",
                        selected: true
                    },
                    {
                        group: "menu-chart-group-bar",
                        type: c_oAscChartTypeSettings.barStacked,
                        iconCls: "column-stack"
                    },
                    {
                        group: "menu-chart-group-bar",
                        type: c_oAscChartTypeSettings.barStackedPer,
                        iconCls: "column-pstack"
                    },
                    {
                        group: "menu-chart-group-line",
                        type: c_oAscChartTypeSettings.lineNormal,
                        iconCls: "line-normal"
                    },
                    {
                        group: "menu-chart-group-line",
                        type: c_oAscChartTypeSettings.lineStacked,
                        iconCls: "line-stack"
                    },
                    {
                        group: "menu-chart-group-line",
                        type: c_oAscChartTypeSettings.lineStackedPer,
                        iconCls: "line-pstack"
                    },
                    {
                        group: "menu-chart-group-pie",
                        type: c_oAscChartTypeSettings.pie,
                        iconCls: "pie-normal"
                    },
                    {
                        group: "menu-chart-group-pie",
                        type: c_oAscChartTypeSettings.doughnut,
                        iconCls: "pie-doughnut"
                    },
                    {
                        group: "menu-chart-group-hbar",
                        type: c_oAscChartTypeSettings.hBarNormal,
                        iconCls: "bar-normal"
                    },
                    {
                        group: "menu-chart-group-hbar",
                        type: c_oAscChartTypeSettings.hBarStacked,
                        iconCls: "bar-stack"
                    },
                    {
                        group: "menu-chart-group-hbar",
                        type: c_oAscChartTypeSettings.hBarStackedPer,
                        iconCls: "bar-pstack"
                    },
                    {
                        group: "menu-chart-group-area",
                        type: c_oAscChartTypeSettings.areaNormal,
                        iconCls: "area-normal"
                    },
                    {
                        group: "menu-chart-group-area",
                        type: c_oAscChartTypeSettings.areaStacked,
                        iconCls: "area-stack"
                    },
                    {
                        group: "menu-chart-group-area",
                        type: c_oAscChartTypeSettings.areaStackedPer,
                        iconCls: "area-pstack"
                    },
                    {
                        group: "menu-chart-group-scatter",
                        type: c_oAscChartTypeSettings.scatter,
                        iconCls: "point-normal"
                    },
                    {
                        group: "menu-chart-group-stock",
                        type: c_oAscChartTypeSettings.stock,
                        iconCls: "stock-normal"
                    }]),
                    itemTemplate: _.template('<div id="<%= id %>" class="item-chartlist <%= iconCls %>"></div>')
                });
            });
            this.btnChartType.render($("#chart-button-type"));
            this.mnuChartTypePicker.on("item:click", _.bind(this.onSelectType, this, this.btnChartType));
            this.lockedControls.push(this.btnChartType);
            this.btnChartStyle = new Common.UI.Button({
                cls: "btn-large-dataview",
                iconCls: "item-wrap",
                menu: new Common.UI.Menu({
                    menuAlign: "tr-br",
                    items: [{
                        template: _.template('<div id="id-chart-menu-style" style="width: 245px; margin: 0 5px;"></div>')
                    }]
                })
            });
            this.btnChartStyle.on("render:after", function (btn) {
                me.mnuChartStylePicker = new Common.UI.DataView({
                    el: $("#id-chart-menu-style"),
                    style: "max-height: 411px;",
                    parentMenu: btn.menu,
                    store: new Common.UI.DataViewStore(),
                    itemTemplate: _.template('<div id="<%= id %>" class="item-wrap" style="background-image: url(<%= imageUrl %>); background-position: 0 0;"></div>')
                });
                if (me.btnChartStyle.menu) {
                    me.btnChartStyle.menu.on("show:after", function () {
                        me.mnuChartStylePicker.scroller.update({
                            alwaysVisibleY: true
                        });
                    });
                }
            });
            this.btnChartStyle.render($("#chart-button-style"));
            this.mnuChartStylePicker.on("item:click", _.bind(this.onSelectStyle, this, this.btnChartStyle));
            this.lockedControls.push(this.btnChartStyle);
            this.spnWidth = new Common.UI.MetricSpinner({
                el: $("#chart-spin-width"),
                step: 0.1,
                width: 78,
                defaultUnit: "cm",
                value: "3 cm",
                maxValue: 55.88,
                minValue: 0
            });
            this.spinners.push(this.spnWidth);
            this.lockedControls.push(this.spnWidth);
            this.spnHeight = new Common.UI.MetricSpinner({
                el: $("#chart-spin-height"),
                step: 0.1,
                width: 78,
                defaultUnit: "cm",
                value: "3 cm",
                maxValue: 55.88,
                minValue: 0
            });
            this.spinners.push(this.spnHeight);
            this.lockedControls.push(this.spnHeight);
            this.spnWidth.on("change", _.bind(this.onWidthChange, this));
            this.spnHeight.on("change", _.bind(this.onHeightChange, this));
            this.btnRatio = new Common.UI.Button({
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "advanced-btn-ratio",
                style: "margin-bottom: 1px;",
                enableToggle: true,
                hint: this.textKeepRatio
            });
            this.btnRatio.render($("#chart-button-ratio"));
            this.lockedControls.push(this.btnRatio);
            var value = window.localStorage.getItem("sse-settings-chartratio");
            if (value !== null && parseInt(value) == 1) {
                this.btnRatio.toggle(true);
            }
            this.btnRatio.on("click", _.bind(function (btn, e) {
                if (btn.pressed && this.spnHeight.getNumberValue() > 0) {
                    this._nRatio = this.spnWidth.getNumberValue() / this.spnHeight.getNumberValue();
                }
                window.localStorage.setItem("sse-settings-chartratio", (btn.pressed) ? 1 : 0);
            },
            this));
            $(this.el).on("click", "#chart-advanced-link", _.bind(this.openAdvancedSettings, this));
        },
        render: function () {
            var el = $(this.el);
            el.html(this.template({
                scope: this
            }));
            this.linkAdvanced = $("#chart-advanced-link");
        },
        setApi: function (api) {
            this.api = api;
            if (this.api) {
                this.api.asc_registerCallback("asc_onUpdateChartStyles", _.bind(this._onUpdateChartStyles, this));
            }
            return this;
        },
        ChangeSettings: function (props) {
            if (this._initSettings) {
                this.createDelayedElements();
                this._initSettings = false;
            }
            this.disableControls(this._locked);
            if (this.api && props && props.asc_getChartProperties()) {
                this._originalProps = new Asc.asc_CImgProperty(props);
                this._noApply = true;
                this.chartProps = props.asc_getChartProperties();
                var value = props.asc_getSeveralCharts() || this._locked;
                if (this._state.SeveralCharts !== value) {
                    this.linkAdvanced.toggleClass("disabled", value);
                    this._state.SeveralCharts = value;
                }
                value = props.asc_getSeveralChartTypes();
                if (this._state.SeveralCharts && value) {
                    this.btnChartType.setIconCls("");
                    this._state.ChartType = null;
                } else {
                    var type = this.chartProps.getType();
                    if (this._state.ChartType !== type) {
                        var record = this.mnuChartTypePicker.store.findWhere({
                            type: type
                        });
                        this.mnuChartTypePicker.selectRecord(record, true);
                        if (record) {
                            this.btnChartType.setIconCls("item-chartlist " + record.get("iconCls"));
                        }
                        this.updateChartStyles(this.api.asc_getChartPreviews(type));
                        this._state.ChartType = type;
                    }
                }
                value = props.asc_getSeveralChartStyles();
                if (this._state.SeveralCharts && value) {
                    var btnIconEl = this.btnChartStyle.cmpEl.find("span.btn-icon");
                    btnIconEl.css("background-image", "none");
                    this.mnuChartStylePicker.selectRecord(null, true);
                    this._state.ChartStyle = null;
                } else {
                    value = this.chartProps.getStyle();
                    if (this._state.ChartStyle !== value) {
                        var record = this.mnuChartStylePicker.store.findWhere({
                            data: value
                        });
                        this.mnuChartStylePicker.selectRecord(record, true);
                        if (record) {
                            var btnIconEl = this.btnChartStyle.cmpEl.find("span.btn-icon");
                            btnIconEl.css("background-image", "url(" + record.get("imageUrl") + ")");
                        }
                        this._state.ChartStyle = value;
                    }
                }
                this._noApply = false;
                value = props.asc_getWidth();
                if (Math.abs(this._state.Width - value) > 0.001 || (this._state.Width === null || value === null) && (this._state.Width !== value)) {
                    this.spnWidth.setValue((value !== null) ? Common.Utils.Metric.fnRecalcFromMM(value) : "", true);
                    this._state.Width = value;
                }
                value = props.asc_getHeight();
                if (Math.abs(this._state.Height - value) > 0.001 || (this._state.Height === null || value === null) && (this._state.Height !== value)) {
                    this.spnHeight.setValue((value !== null) ? Common.Utils.Metric.fnRecalcFromMM(value) : "", true);
                    this._state.Height = value;
                }
                if (props.asc_getHeight() > 0) {
                    this._nRatio = props.asc_getWidth() / props.asc_getHeight();
                }
            }
        },
        updateMetricUnit: function () {
            if (this.spinners) {
                for (var i = 0; i < this.spinners.length; i++) {
                    var spinner = this.spinners[i];
                    spinner.setDefaultUnit(Common.Utils.Metric.metricName[Common.Utils.Metric.getCurrentMetric()]);
                    spinner.setStep(Common.Utils.Metric.getCurrentMetric() == Common.Utils.Metric.c_MetricUnits.cm ? 0.1 : 1);
                }
            }
        },
        createDelayedElements: function () {
            this.updateMetricUnit();
        },
        onWidthChange: function (field, newValue, oldValue, eOpts) {
            var w = field.getNumberValue();
            var h = this.spnHeight.getNumberValue();
            if (this.btnRatio.pressed) {
                h = w / this._nRatio;
                if (h > this.spnHeight.options.maxValue) {
                    h = this.spnHeight.options.maxValue;
                    w = h * this._nRatio;
                    this.spnWidth.setValue(w, true);
                }
                this.spnHeight.setValue(h, true);
            }
            if (this.api) {
                var props = new Asc.asc_CImgProperty();
                props.asc_putWidth(Common.Utils.Metric.fnRecalcToMM(w));
                props.asc_putHeight(Common.Utils.Metric.fnRecalcToMM(h));
                this.api.asc_setGraphicObjectProps(props);
            }
            Common.NotificationCenter.trigger("edit:complete", this);
        },
        onHeightChange: function (field, newValue, oldValue, eOpts) {
            var h = field.getNumberValue(),
            w = this.spnWidth.getNumberValue();
            if (this.btnRatio.pressed) {
                w = h * this._nRatio;
                if (w > this.spnWidth.options.maxValue) {
                    w = this.spnWidth.options.maxValue;
                    h = w / this._nRatio;
                    this.spnHeight.setValue(h, true);
                }
                this.spnWidth.setValue(w, true);
            }
            if (this.api) {
                var props = new Asc.asc_CImgProperty();
                props.asc_putWidth(Common.Utils.Metric.fnRecalcToMM(w));
                props.asc_putHeight(Common.Utils.Metric.fnRecalcToMM(h));
                this.api.asc_setGraphicObjectProps(props);
            }
            Common.NotificationCenter.trigger("edit:complete", this);
        },
        openAdvancedSettings: function () {
            if (this.linkAdvanced.hasClass("disabled")) {
                return;
            }
            var me = this;
            var win, props;
            if (me.api) {
                props = me.api.asc_getChartObject();
                if (props) {
                    (new SSE.Views.ChartSettingsDlg({
                        chartSettings: props,
                        api: me.api,
                        handler: function (result, value) {
                            if (result == "ok") {
                                if (me.api) {
                                    me.api.asc_editChartDrawingObject(value.chartSettings);
                                }
                            }
                            Common.NotificationCenter.trigger("edit:complete", me);
                        }
                    })).show();
                }
            }
        },
        onSelectType: function (btn, picker, itemView, record) {
            if (this._noApply) {
                return;
            }
            var rawData = {},
            isPickerSelect = _.isFunction(record.toJSON);
            if (isPickerSelect) {
                if (record.get("selected")) {
                    rawData = record.toJSON();
                } else {
                    return;
                }
            } else {
                rawData = record;
            }
            this.btnChartType.setIconCls("item-chartlist " + rawData.iconCls);
            this._state.ChartType = -1;
            if (this.api && !this._noApply && this.chartProps) {
                var props = new Asc.asc_CImgProperty();
                this.chartProps.changeType(rawData.type);
                props.asc_putChartProperties(this.chartProps);
                this.api.asc_setGraphicObjectProps(props);
            }
            Common.NotificationCenter.trigger("edit:complete", this);
        },
        onSelectStyle: function (btn, picker, itemView, record) {
            if (this._noApply) {
                return;
            }
            var rawData = {},
            isPickerSelect = _.isFunction(record.toJSON);
            if (isPickerSelect) {
                if (record.get("selected")) {
                    rawData = record.toJSON();
                } else {
                    return;
                }
            } else {
                rawData = record;
            }
            var style = "url(" + rawData.imageUrl + ")";
            var btnIconEl = this.btnChartStyle.cmpEl.find("span.btn-icon");
            btnIconEl.css("background-image", style);
            if (this.api && !this._noApply && this.chartProps) {
                var props = new Asc.asc_CImgProperty();
                this.chartProps.putStyle(rawData.data);
                props.asc_putChartProperties(this.chartProps);
                this.api.asc_setGraphicObjectProps(props);
            }
            Common.NotificationCenter.trigger("edit:complete", this);
        },
        _onUpdateChartStyles: function () {
            if (this.api && this._state.ChartType !== null && this._state.ChartType > -1) {
                this.updateChartStyles(this.api.asc_getChartPreviews(this._state.ChartType));
            }
        },
        updateChartStyles: function (styles) {
            var me = this;
            if (styles && styles.length > 0) {
                var stylesStore = this.mnuChartStylePicker.store;
                if (stylesStore) {
                    var stylearray = [],
                    selectedIdx = -1,
                    selectedUrl;
                    _.each(styles, function (item, index) {
                        stylearray.push({
                            imageUrl: item.asc_getImageUrl(),
                            data: item.asc_getStyle(),
                            tip: me.textStyle + " " + item.asc_getStyle()
                        });
                        if (me._state.ChartStyle == item.asc_getStyle()) {
                            selectedIdx = index;
                            selectedUrl = item.asc_getImageUrl();
                        }
                    });
                    stylesStore.reset(stylearray, {
                        silent: false
                    });
                }
            }
            this.mnuChartStylePicker.selectByIndex(selectedIdx, true);
            if (selectedIdx >= 0 && this.btnChartStyle.cmpEl) {
                var style = "url(" + selectedUrl + ")";
                var btnIconEl = this.btnChartStyle.cmpEl.find("span.btn-icon");
                btnIconEl.css("background-image", style);
            }
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
        textKeepRatio: "Constant Proportions",
        textSize: "Size",
        textWidth: "Width",
        textHeight: "Height",
        textEditData: "Edit Data",
        textChartType: "Change Chart Type",
        textLine: "Line Chart",
        textColumn: "Column Chart",
        textBar: "Bar Chart",
        textArea: "Area Chart",
        textPie: "Pie Chart",
        textPoint: "Point Chart",
        textStock: "Stock Chart",
        textStyle: "Style",
        textAdvanced: "Show advanced settings"
    },
    SSE.Views.ChartSettings || {}));
});