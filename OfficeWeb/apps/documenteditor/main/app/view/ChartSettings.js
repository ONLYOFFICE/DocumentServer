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
 define(["text!documenteditor/main/app/template/ChartSettings.template", "jquery", "underscore", "backbone", "common/main/lib/component/Button", "documenteditor/main/app/view/ImageSettingsAdvanced"], function (menuTemplate, $, _, Backbone) {
    DE.Views.ChartSettings = Backbone.View.extend(_.extend({
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
                WrappingStyle: c_oAscWrapStyle2.Inline,
                CanBeFlow: true,
                Width: 0,
                Height: 0,
                FromGroup: false,
                ChartStyle: 1,
                ChartType: -1,
                SeveralCharts: false,
                DisabledControls: false
            };
            this.lockedControls = [];
            this._locked = false;
            this._noApply = false;
            this._originalProps = null;
            this.render();
            var viewData = [{
                offsetx: 0,
                data: c_oAscWrapStyle2.Inline,
                iconCls: "wrap-inline",
                tip: this.txtInline,
                selected: true
            },
            {
                offsetx: 50,
                data: c_oAscWrapStyle2.Square,
                iconCls: "wrap-square",
                tip: this.txtSquare
            },
            {
                offsetx: 100,
                data: c_oAscWrapStyle2.Tight,
                iconCls: "wrap-tight",
                tip: this.txtTight
            },
            {
                offsetx: 150,
                data: c_oAscWrapStyle2.Through,
                iconCls: "wrap-through",
                tip: this.txtThrough
            },
            {
                offsetx: 200,
                data: c_oAscWrapStyle2.TopAndBottom,
                iconCls: "wrap-topAndBottom",
                tip: this.txtTopAndBottom
            },
            {
                offsetx: 250,
                data: c_oAscWrapStyle2.InFront,
                iconCls: "wrap-inFront",
                tip: this.txtInFront
            },
            {
                offsetx: 300,
                data: c_oAscWrapStyle2.Behind,
                iconCls: "wrap-behind",
                tip: this.txtBehind
            }];
            this.btnWrapType = new Common.UI.Button({
                cls: "btn-large-dataview",
                iconCls: "item-wrap wrap-inline",
                menu: new Common.UI.Menu({
                    items: [{
                        template: _.template('<div id="id-chart-menu-wrap" style="width: 235px; margin: 0 5px;"></div>')
                    }]
                })
            });
            this.btnWrapType.on("render:after", function (btn) {
                me.mnuWrapPicker = new Common.UI.DataView({
                    el: $("#id-chart-menu-wrap"),
                    parentMenu: btn.menu,
                    store: new Common.UI.DataViewStore(viewData),
                    itemTemplate: _.template('<div id="<%= id %>" class="item-wrap" style="background-position: -<%= offsetx %>px 0;"></div>')
                });
            });
            this.btnWrapType.render($("#chart-button-wrap"));
            this.mnuWrapPicker.on("item:click", _.bind(this.onSelectWrap, this, this.btnWrapType));
            this.lockedControls.push(this.btnWrapType);
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
            this.labelWidth = $(this.el).find("#chart-label-width");
            this.labelHeight = $(this.el).find("#chart-label-height");
            this.btnEditData = new Common.UI.Button({
                el: $("#chart-button-edit-data")
            });
            this.lockedControls.push(this.btnEditData);
            this.btnEditData.on("click", _.bind(this.setEditData, this));
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
                this.api.asc_registerCallback("asc_onImgWrapStyleChanged", _.bind(this._ChartWrapStyleChanged, this));
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
            if (props && props.get_ChartProperties()) {
                this._originalProps = new CImgProperty(props);
                this._noApply = true;
                var value = props.get_WrappingStyle();
                if (this._state.WrappingStyle !== value) {
                    var record = this.mnuWrapPicker.store.findWhere({
                        data: value
                    });
                    this.mnuWrapPicker.selectRecord(record, true);
                    if (record) {
                        this.btnWrapType.setIconCls("item-wrap " + record.get("iconCls"));
                    } else {
                        this.btnWrapType.setIconCls("");
                    }
                    this._state.WrappingStyle = value;
                }
                this.chartProps = props.get_ChartProperties();
                value = props.get_SeveralCharts() || this._locked;
                if (this._state.SeveralCharts !== value) {
                    this.btnEditData.setDisabled(value);
                    this._state.SeveralCharts = value;
                }
                value = props.get_SeveralChartTypes();
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
                value = props.get_SeveralChartStyles();
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
                value = props.get_CanBeFlow() && !this._locked;
                var fromgroup = props.get_FromGroup() || this._locked;
                if (this._state.CanBeFlow !== value || this._state.FromGroup !== fromgroup) {
                    this.btnWrapType.setDisabled(!value || fromgroup);
                    this._state.CanBeFlow = value;
                    this._state.FromGroup = fromgroup;
                }
                value = props.get_Width();
                if (Math.abs(this._state.Width - value) > 0.001) {
                    this.labelWidth[0].innerHTML = this.textWidth + ": " + Common.Utils.Metric.fnRecalcFromMM(value).toFixed(1) + " " + Common.Utils.Metric.metricName[Common.Utils.Metric.getCurrentMetric()];
                    this._state.Width = value;
                }
                value = props.get_Height();
                if (Math.abs(this._state.Height - value) > 0.001) {
                    this.labelHeight[0].innerHTML = this.textHeight + ": " + Common.Utils.Metric.fnRecalcFromMM(value).toFixed(1) + " " + Common.Utils.Metric.metricName[Common.Utils.Metric.getCurrentMetric()];
                    this._state.Height = value;
                }
            }
        },
        updateMetricUnit: function () {
            var value = Common.Utils.Metric.fnRecalcFromMM(this._state.Width);
            this.labelWidth[0].innerHTML = this.textWidth + ": " + value.toFixed(1) + " " + Common.Utils.Metric.metricName[Common.Utils.Metric.getCurrentMetric()];
            value = Common.Utils.Metric.fnRecalcFromMM(this._state.Height);
            this.labelHeight[0].innerHTML = this.textHeight + ": " + value.toFixed(1) + " " + Common.Utils.Metric.metricName[Common.Utils.Metric.getCurrentMetric()];
        },
        createDelayedElements: function () {
            this.updateMetricUnit();
        },
        _ChartWrapStyleChanged: function (style) {
            if (this._state.WrappingStyle !== style) {
                this._noApply = true;
                var record = this.mnuWrapPicker.store.findWhere({
                    data: style
                });
                this.mnuWrapPicker.selectRecord(record, true);
                if (record) {
                    this.btnWrapType.setIconCls("item-wrap " + record.get("iconCls"));
                }
                this._state.WrappingStyle = style;
                this._noApply = false;
            }
        },
        onSelectWrap: function (btn, picker, itemView, record) {
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
            this.btnWrapType.setIconCls("item-wrap " + rawData.iconCls);
            if (this.api) {
                var props = new CImgProperty();
                props.put_WrappingStyle((rawData.data));
                if (this._state.WrappingStyle === c_oAscWrapStyle2.Inline && rawData.data !== c_oAscWrapStyle2.Inline) {
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
        setEditData: function () {
            var diagramEditor = DE.getController("Common.Controllers.ExternalDiagramEditor").getView("Common.Views.ExternalDiagramEditor");
            if (diagramEditor) {
                diagramEditor.setEditMode(true);
                diagramEditor.show();
                var chart = this.api.asc_getChartObject();
                if (chart) {
                    diagramEditor.setChartData(new Asc.asc_CChartBinary(chart));
                }
            }
        },
        openAdvancedSettings: function (e) {
            if (this.linkAdvanced.hasClass("disabled")) {
                return;
            }
            var me = this;
            var win;
            if (me.api && !this._locked) {
                var selectedElements = me.api.getSelectedElements();
                if (selectedElements && selectedElements.length > 0) {
                    var elType, elValue;
                    for (var i = selectedElements.length - 1; i >= 0; i--) {
                        elType = selectedElements[i].get_ObjectType();
                        elValue = selectedElements[i].get_ObjectValue();
                        if (c_oAscTypeSelectElement.Image == elType) {
                            var imgsizeMax = this.api.GetSectionInfo();
                            imgsizeMax = {
                                width: imgsizeMax.get_PageWidth() - (imgsizeMax.get_MarginLeft() + imgsizeMax.get_MarginRight()),
                                height: imgsizeMax.get_PageHeight() - (imgsizeMax.get_MarginTop() + imgsizeMax.get_MarginBottom())
                            };
                            (new DE.Views.ImageSettingsAdvanced({
                                imageProps: elValue,
                                sizeMax: imgsizeMax,
                                handler: function (result, value) {
                                    if (result == "ok") {
                                        if (me.api) {
                                            me.api.ImgApply(value.imageProps);
                                        }
                                    }
                                    me.fireEvent("editcomplete", me);
                                }
                            })).show();
                            break;
                        }
                    }
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
                var props = new CImgProperty();
                this.chartProps.changeType(rawData.type);
                props.put_ChartProperties(this.chartProps);
                this.api.ImgApply(props);
            }
            this.fireEvent("editcomplete", this);
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
                var props = new CImgProperty();
                this.chartProps.putStyle(rawData.data);
                props.put_ChartProperties(this.chartProps);
                this.api.ImgApply(props);
            }
            this.fireEvent("editcomplete", this);
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
        textSize: "Size",
        textWrap: "Wrapping Style",
        textWidth: "Width",
        textHeight: "Height",
        textAdvanced: "Show advanced settings",
        txtInline: "Inline",
        txtSquare: "Square",
        txtTight: "Tight",
        txtThrough: "Through",
        txtTopAndBottom: "Top and bottom",
        txtBehind: "Behind",
        txtInFront: "In front",
        textEditData: "Edit Data",
        textChartType: "Change Chart Type",
        textLine: "Line Chart",
        textColumn: "Column Chart",
        textBar: "Bar Chart",
        textArea: "Area Chart",
        textPie: "Pie Chart",
        textPoint: "Point Chart",
        textStock: "Stock Chart",
        textStyle: "Style"
    },
    DE.Views.ChartSettings || {}));
});