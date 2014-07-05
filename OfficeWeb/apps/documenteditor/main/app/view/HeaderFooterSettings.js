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
 Ext.define("DE.view.HeaderFooterSettings", {
    extend: "Common.view.AbstractSettingsPanel",
    alias: "widget.deheaderfootersettings",
    height: 298,
    requires: ["Ext.button.Button", "Ext.form.Label", "Ext.form.field.Checkbox", "Ext.container.Container", "Ext.toolbar.Spacer", "Common.component.MetricSpinner"],
    constructor: function (config) {
        this.callParent(arguments);
        this.initConfig(config);
        return this;
    },
    initComponent: function () {
        this.title = this.txtTitle;
        this._initSettings = true;
        this._state = {
            PositionType: c_pageNumPosition.PAGE_NUM_POSITION_TOP,
            Position: 12.5,
            DiffFirst: false,
            DiffOdd: false
        };
        var _arrPosition = [[c_pageNumPosition.PAGE_NUM_POSITION_TOP, c_pageNumPosition.PAGE_NUM_POSITION_LEFT, "asc-right-panel-btn btn-colontitul-tl", "headerfooter-button-top-left", this.textTopLeft], [c_pageNumPosition.PAGE_NUM_POSITION_TOP, c_pageNumPosition.PAGE_NUM_POSITION_CENTER, "asc-right-panel-btn btn-colontitul-tc", "headerfooter-button-top-center", this.textTopCenter], [c_pageNumPosition.PAGE_NUM_POSITION_TOP, c_pageNumPosition.PAGE_NUM_POSITION_RIGHT, "asc-right-panel-btn btn-colontitul-tr", "headerfooter-button-top-right", this.textTopRight], [c_pageNumPosition.PAGE_NUM_POSITION_BOTTOM, c_pageNumPosition.PAGE_NUM_POSITION_LEFT, "asc-right-panel-btn btn-colontitul-bl", "headerfooter-button-bottom-left", this.textBottomLeft], [c_pageNumPosition.PAGE_NUM_POSITION_BOTTOM, c_pageNumPosition.PAGE_NUM_POSITION_CENTER, "asc-right-panel-btn btn-colontitul-bc", "headerfooter-button-bottom-center", this.textBottomCenter], [c_pageNumPosition.PAGE_NUM_POSITION_BOTTOM, c_pageNumPosition.PAGE_NUM_POSITION_RIGHT, "asc-right-panel-btn btn-colontitul-br", "headerfooter-button-bottom-right", this.textBottomRight]];
        this._btnsPosition = [];
        Ext.Array.forEach(_arrPosition, function (item) {
            var _btn = Ext.create("Ext.Button", {
                id: item[3],
                cls: item[2],
                posWhere: item[0],
                posAlign: item[1],
                margin: "2px 12px 2px 0",
                text: "",
                tooltip: item[4],
                listeners: {
                    click: Ext.bind(function (btn) {
                        if (this.api) {
                            this.api.put_PageNum(btn.posWhere, btn.posAlign);
                        }
                        this.fireEvent("editcomplete", this);
                    },
                    this)
                }
            });
            this._btnsPosition.push(_btn);
        },
        this);
        this._numPosition = Ext.create("Common.component.MetricSpinner", {
            id: "headerfooter-spin-position",
            readOnly: false,
            step: 0.1,
            width: 85,
            defaultUnit: "cm",
            value: "1.25 cm",
            maxValue: 55.88,
            minValue: 0,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (this.api) {
                        this.api.put_HeadersAndFootersDistance(Common.MetricSettings.fnRecalcToMM(field.getNumberValue()));
                    }
                    this.fireEvent("editcomplete", this);
                },
                this)
            }
        });
        this.controls.push(this._numPosition);
        this._lblPosition = Ext.create("Ext.form.Label", {
            text: this.textHeaderFromTop,
            width: 150,
            height: 14,
            style: "text-align:left"
        });
        this._chDiffFirst = Ext.create("Ext.form.field.Checkbox", {
            id: "headerfooter-check-diff-first",
            boxLabel: this.textDiffFirst,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (this.api) {
                        this.api.HeadersAndFooters_DifferentFirstPage(field.getValue());
                    }
                    this.fireEvent("editcomplete", this);
                },
                this)
            }
        });
        this.controls.push(this._chDiffFirst);
        this._chDiffOdd = Ext.create("Ext.form.field.Checkbox", {
            id: "headerfooter-check-diff-odd",
            boxLabel: this.textDiffOdd,
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {
                    if (this.api) {
                        this.api.HeadersAndFooters_DifferentOddandEvenPage(field.getValue());
                    }
                    this.fireEvent("editcomplete", this);
                },
                this)
            }
        });
        this.controls.push(this._chDiffOdd);
        this._PageNumPanel = Ext.create("Ext.container.Container", {
            layout: "vbox",
            layoutConfig: {
                align: "stretch"
            },
            height: 103,
            width: "100%",
            items: [{
                xtype: "tbspacer",
                height: 9
            },
            {
                xtype: "container",
                layout: {
                    type: "table",
                    columns: 3
                },
                items: [this._btnsPosition[0], this._btnsPosition[1], this._btnsPosition[2], {
                    xtype: "tbspacer",
                    height: 11
                },
                {
                    xtype: "tbspacer",
                    height: 11
                },
                {
                    xtype: "tbspacer",
                    height: 11
                },
                this._btnsPosition[3], this._btnsPosition[4], this._btnsPosition[5]]
            }]
        });
        this._PositionPanel = Ext.create("Ext.container.Container", {
            layout: "vbox",
            layoutConfig: {
                align: "stretch"
            },
            height: 50,
            width: 195,
            items: [{
                xtype: "tbspacer",
                height: 8
            },
            {
                xtype: "container",
                height: 40,
                layout: "vbox",
                layoutConfig: {
                    align: "stretch"
                },
                style: "float:left;",
                items: [this._lblPosition, {
                    xtype: "tbspacer",
                    height: 3
                },
                this._numPosition]
            }]
        });
        this._OptionsPanel = Ext.create("Ext.container.Container", {
            layout: "vbox",
            layoutConfig: {
                align: "stretch"
            },
            height: 53,
            width: "100%",
            items: [{
                xtype: "tbspacer",
                height: 6
            },
            this._chDiffFirst, this._chDiffOdd]
        });
        this.items = [{
            xtype: "tbspacer",
            height: 9
        },
        {
            xtype: "label",
            style: "font-weight: bold;margin-top: 1px;",
            text: this.textPageNum
        },
        this._PageNumPanel, {
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
            text: this.textPosition
        },
        this._PositionPanel, {
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
            text: this.textOptions
        },
        this._OptionsPanel, {
            xtype: "tbspacer",
            height: 7
        }];
        this.callParent(arguments);
    },
    setApi: function (api) {
        this.api = api;
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
    },
    ChangeSettings: function (prop) {
        if (this._initSettings) {
            this.createDelayedElements();
            this._initSettings = false;
        }
        if (prop) {
            this.SuspendEvents();
            var value = prop.get_Type();
            if (this._state.PositionType !== value) {
                if (value == c_pageNumPosition.PAGE_NUM_POSITION_BOTTOM) {
                    this._lblPosition.setText(this.textHeaderFromBottom);
                } else {
                    this._lblPosition.setText(this.textHeaderFromTop);
                }
                this._state.PositionType = value;
            }
            value = prop.get_Position();
            if (Math.abs(this._state.Position - value) > 0.001) {
                this._numPosition.setValue(Common.MetricSettings.fnRecalcFromMM(value));
                this._state.Position = value;
            }
            value = prop.get_DifferentFirst();
            if (this._state.DiffFirst !== value) {
                this._chDiffFirst.setValue(value);
                this._state.DiffFirst = value;
            }
            value = prop.get_DifferentEvenOdd();
            if (this._state.DiffOdd !== value) {
                this._chDiffOdd.setValue(value);
                this._state.DiffOdd = value;
            }
            this.ResumeEvents();
        }
    },
    createDelayedElements: function () {
        this.updateMetricUnit();
    },
    textHeaderFromTop: "Header from Top",
    textHeaderFromBottom: "Header from Bottom",
    textPosition: "Position",
    textOptions: "Options",
    textDiffFirst: "Different First Page",
    textDiffOdd: "Different Odd and even Pages",
    textPageNum: "Insert Page Number",
    textTopLeft: "Top Left",
    textTopRight: "Top Right",
    textTopCenter: "Top Center",
    textBottomLeft: "Bottom Left",
    textBottomRight: "Bottom Right",
    textBottomCenter: "Bottom Center",
    textUndock: "Undock from panel",
    txtTitle: "Header and Footer"
});