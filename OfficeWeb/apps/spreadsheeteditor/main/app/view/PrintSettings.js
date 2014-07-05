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
 Ext.define("SSE.view.PrintSettings", {
    extend: "Ext.window.Window",
    alias: "widget.sseprintsettings",
    requires: ["Ext.window.Window", "Ext.form.field.ComboBox", "Ext.form.RadioGroup", "Ext.Array", "Common.component.MetricSpinner", "Common.component.IndeterminateCheckBox"],
    cls: "asc-advanced-settings-window",
    modal: true,
    resizable: false,
    plain: true,
    constrain: true,
    height: 588,
    width: 466,
    layout: {
        type: "vbox",
        align: "stretch"
    },
    initComponent: function () {
        var me = this;
        this.addEvents("onmodalresult");
        this._spacer = Ext.create("Ext.toolbar.Spacer", {
            width: "100%",
            height: 10,
            html: '<div style="width: 100%; height: 40%; border-bottom: 1px solid #C7C7C7"></div>'
        });
        this.cmbPaperSize = Ext.widget("combo", {
            store: Ext.create("Ext.data.Store", {
                fields: ["description", "size"],
                data: [{
                    size: "215.9|279.4",
                    description: "US Letter (21,59cm x 27,94cm)"
                },
                {
                    size: "215.9|355.6",
                    description: "US Legal (21,59cm x 35,56cm)"
                },
                {
                    size: "210|297",
                    description: "A4 (21cm x 29,7cm)"
                },
                {
                    size: "148.1|209.9",
                    description: "A5 (14,81cm x 20,99cm)"
                },
                {
                    size: "176|250.1",
                    description: "B5 (17,6cm x 25,01cm)"
                },
                {
                    size: "104.8|241.3",
                    description: "Envelope #10 (10,48cm x 24,13cm)"
                },
                {
                    size: "110.1|220.1",
                    description: "Envelope DL (11,01cm x 22,01cm)"
                },
                {
                    size: "279.4|431.7",
                    description: "Tabloid (27,94cm x 43,17cm)"
                },
                {
                    size: "297|420.1",
                    description: "A3 (29,7cm x 42,01cm)"
                },
                {
                    size: "304.8|457.1",
                    description: "Tabloid Oversize (30,48cm x 45,71cm)"
                },
                {
                    size: "196.8|273",
                    description: "ROC 16K (19,68cm x 27,3cm)"
                },
                {
                    size: "119.9|234.9",
                    description: "Envelope Choukei 3 (11,99cm x 23,49cm)"
                },
                {
                    size: "330.2|482.5",
                    description: "Super B/A3 (33,02cm x 48,25cm)"
                }]
            }),
            displayField: "description",
            valueField: "size",
            queryMode: "local",
            editable: false,
            flex: 1
        });
        this.cmbPaperOrientation = Ext.widget("combo", {
            store: Ext.create("Ext.data.Store", {
                fields: ["description", "orient"],
                data: [{
                    description: me.strPortrait,
                    orient: c_oAscPageOrientation.PagePortrait
                },
                {
                    description: me.strLandscape,
                    orient: c_oAscPageOrientation.PageLandscape
                }]
            }),
            displayField: "description",
            valueField: "orient",
            queryMode: "local",
            editable: false,
            width: 115
        });
        this.chPrintGrid = Ext.widget("cmdindeterminatecheckbox", {
            boxLabel: this.textPrintGrid
        });
        this.chPrintRows = Ext.widget("cmdindeterminatecheckbox", {
            boxLabel: this.textPrintHeadings
        });
        this.spnMarginLeft = Ext.create("Common.component.MetricSpinner", {
            readOnly: false,
            maxValue: 48.25,
            minValue: 0,
            step: 0.1,
            defaultUnit: "cm",
            value: "0.19 cm",
            listeners: {
                change: Ext.bind(function (field, newValue, oldValue, eOpts) {},
                this)
            }
        });
        this.spnMarginRight = Ext.create("Common.component.MetricSpinner", {
            readOnly: false,
            maxValue: 48.25,
            minValue: 0,
            step: 0.1,
            defaultUnit: "cm",
            value: "0.19 cm",
            listeners: {
                change: function (field, newValue, oldValue, eOpts) {}
            }
        });
        this.spnMarginTop = Ext.create("Common.component.MetricSpinner", {
            readOnly: false,
            maxValue: 48.25,
            minValue: 0,
            step: 0.1,
            defaultUnit: "cm",
            value: "0 cm",
            listeners: {
                change: function (field, newValue, oldValue, eOpts) {}
            }
        });
        this.spnMarginBottom = Ext.create("Common.component.MetricSpinner", {
            readOnly: false,
            maxValue: 48.25,
            minValue: 0,
            step: 0.1,
            defaultUnit: "cm",
            value: "0 cm",
            listeners: {
                change: function (field, newValue, oldValue, eOpts) {}
            }
        });
        this.items = [this.topCnt = Ext.widget("container", {
            height: 490,
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
                    height: 80,
                    padding: "0 10px 10px 0",
                    items: [{
                        xtype: "label",
                        text: me.textPrintRange,
                        style: "font-weight: bold;"
                    }]
                },
                {
                    height: 62,
                    items: [{
                        xtype: "label",
                        text: me.textPageSize,
                        style: "font-weight: bold;"
                    }]
                },
                {
                    height: 58,
                    items: [{
                        xtype: "label",
                        text: me.textPageOrientation,
                        style: "font-weight: bold;"
                    }]
                },
                {
                    height: 124,
                    items: [{
                        xtype: "label",
                        text: this.strMargins,
                        style: "font-weight: bold;"
                    }]
                },
                {
                    height: 68,
                    items: [{
                        xtype: "label",
                        text: me.textLayout,
                        style: "font-weight: bold;"
                    }]
                },
                {
                    height: 70,
                    items: [{
                        xtype: "label",
                        text: me.strPrint,
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
                width: 280,
                layout: {
                    type: "vbox",
                    align: "stretch"
                },
                items: [{
                    xtype: "container",
                    height: 70,
                    padding: "0 10",
                    layout: {
                        type: "hbox",
                        align: "middle"
                    },
                    items: [this.groupRange = Ext.widget("radiogroup", {
                        id: "dialog-printoptions-grouprange",
                        columns: 1,
                        width: 280,
                        vertical: true,
                        items: [{
                            boxLabel: this.textCurrentSheet,
                            name: "printrange",
                            inputValue: c_oAscPrintType.ActiveSheets,
                            checked: true
                        },
                        {
                            boxLabel: this.textAllSheets,
                            name: "printrange",
                            inputValue: c_oAscPrintType.EntireWorkbook
                        },
                        {
                            boxLabel: this.textSelection,
                            name: "printrange",
                            inputValue: c_oAscPrintType.Selection
                        }]
                    })]
                },
                this._spacer.cloneConfig({
                    style: "margin: 15px 0 10px 0;",
                    height: 6
                }), {
                    xtype: "container",
                    height: 25,
                    padding: "0 10",
                    layout: {
                        type: "hbox",
                        align: "middle"
                    },
                    items: [this.cmbPaperSize]
                },
                this._spacer.cloneConfig({
                    style: "margin: 17px 0 10px 0;",
                    height: 6
                }), {
                    xtype: "container",
                    height: 25,
                    padding: "0 10",
                    layout: {
                        type: "hbox",
                        align: "middle"
                    },
                    items: [this.cmbPaperOrientation]
                },
                this._spacer.cloneConfig({
                    style: "margin: 16px 0 4px 0;",
                    height: 6
                }), this.cntMargins = Ext.widget("container", {
                    height: 100,
                    padding: "0 10",
                    layout: {
                        type: "hbox"
                    },
                    defaults: {
                        xtype: "container",
                        layout: {
                            type: "vbox",
                            align: "stretch"
                        },
                        height: 100
                    },
                    items: [{
                        flex: 1,
                        items: [{
                            xtype: "label",
                            width: "100%",
                            text: me.strTop
                        },
                        {
                            xtype: "tbspacer",
                            height: 3
                        },
                        this.spnMarginTop, {
                            xtype: "tbspacer",
                            height: 12
                        },
                        {
                            xtype: "label",
                            width: "100%",
                            text: me.strLeft
                        },
                        {
                            xtype: "tbspacer",
                            height: 3
                        },
                        this.spnMarginLeft]
                    },
                    {
                        xtype: "tbspacer",
                        width: 20
                    },
                    {
                        flex: 1,
                        items: [{
                            xtype: "label",
                            text: me.strBottom,
                            width: "100%"
                        },
                        {
                            xtype: "tbspacer",
                            height: 3
                        },
                        this.spnMarginBottom, {
                            xtype: "tbspacer",
                            height: 12
                        },
                        {
                            xtype: "label",
                            text: me.strRight,
                            width: "100%"
                        },
                        {
                            xtype: "tbspacer",
                            height: 3
                        },
                        this.spnMarginRight]
                    }]
                }), this._spacer.cloneConfig({
                    style: "margin: 14px 0 6px 0;",
                    height: 6
                }), this.cntLayout = Ext.widget("container", {
                    height: 45,
                    padding: "0 10",
                    layout: {
                        type: "vbox",
                        align: "stretch"
                    },
                    items: [this.groupLayout = Ext.widget("radiogroup", {
                        columns: 1,
                        width: 280,
                        vertical: true,
                        items: [{
                            boxLabel: this.textActualSize,
                            name: "printlayout",
                            inputValue: c_oAscLayoutPageType.ActualSize
                        },
                        {
                            boxLabel: this.textFit,
                            name: "printlayout",
                            inputValue: c_oAscLayoutPageType.FitToWidth,
                            checked: true
                        }]
                    })]
                }), this._spacer.cloneConfig({
                    style: "margin: 14px 0 8px 0;",
                    height: 6
                }), this.cntAdditional = Ext.widget("container", {
                    height: 65,
                    padding: "0 10",
                    layout: {
                        type: "vbox",
                        align: "stretch"
                    },
                    items: [this.chPrintGrid, this.chPrintRows]
                })]
            }]
        }), this._spacer.cloneConfig({
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
                width: 466,
                height: 24,
                style: "padding: 0 30px;",
                layout: {
                    type: "hbox",
                    align: "stretch"
                },
                items: [{
                    xtype: "button",
                    width: 100,
                    height: 22,
                    text: this.textHideDetails,
                    listeners: {
                        scope: this,
                        click: this.handlerShowDetails
                    }
                },
                this.btnOk = Ext.widget("button", {
                    id: "dialog-print-options-ok",
                    cls: "asc-blue-button",
                    width: 150,
                    height: 22,
                    style: "margin:0 10px 0 60px;",
                    text: this.btnPrint,
                    listeners: {}
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
        this.setTitle(this.textTitle);
    },
    afterRender: function () {
        this.callParent(arguments);
    },
    checkMargins: function () {
        if (this.cmbPaperOrientation.getValue() == c_oAscPageOrientation.PagePortrait) {
            var pagewidth = /^\d{3}\.?\d*/.exec(this.cmbPaperSize.getValue());
            var pageheight = /\d{3}\.?\d*$/.exec(this.cmbPaperSize.getValue());
        } else {
            pageheight = /^\d{3}\.?\d*/.exec(this.cmbPaperSize.getValue());
            pagewidth = /\d{3}\.?\d*$/.exec(this.cmbPaperSize.getValue());
        }
        var ml = Common.MetricSettings.fnRecalcToMM(this.spnMarginLeft.getNumberValue());
        var mr = Common.MetricSettings.fnRecalcToMM(this.spnMarginRight.getNumberValue());
        var mt = Common.MetricSettings.fnRecalcToMM(this.spnMarginTop.getNumberValue());
        var mb = Common.MetricSettings.fnRecalcToMM(this.spnMarginBottom.getNumberValue());
        if (ml > pagewidth) {
            return "left";
        }
        if (mr > pagewidth - ml) {
            return "right";
        }
        if (mt > pageheight) {
            return "top";
        }
        if (mb > pageheight - mt) {
            return "bottom";
        }
        return null;
    },
    handlerShowDetails: function (btn) {
        if (!this.extended) {
            this.extended = true;
            this.cntMargins.setDisabled(true);
            this.cntLayout.setDisabled(true);
            this.cntAdditional.setDisabled(true);
            this.topCnt.setHeight(218);
            this.setHeight(316);
            btn.setText(this.textShowDetails);
        } else {
            this.extended = false;
            this.cntMargins.setDisabled(false);
            this.cntLayout.setDisabled(false);
            this.cntAdditional.setDisabled(false);
            this.topCnt.setHeight(490);
            this.setHeight(588);
            btn.setText(this.textHideDetails);
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
    textTitle: "Print Settings",
    strLeft: "Left",
    strRight: "Right",
    strTop: "Top",
    strBottom: "Bottom",
    strPortrait: "Portrait",
    strLandscape: "Landscape",
    textPrintGrid: "Print Gridlines",
    textPrintHeadings: "Print Rows and Columns Headings",
    textPageSize: "Page Size",
    textPageOrientation: "Page Orientation",
    strMargins: "Margins",
    strPrint: "Print",
    btnPrint: "Save & Print",
    textPrintRange: "Print Range",
    textLayout: "Layout",
    textCurrentSheet: "Current Sheet",
    textAllSheets: "All Sheets",
    textSelection: "Selection",
    textActualSize: "Actual Size",
    textFit: "Fit to width",
    textShowDetails: "Show Details",
    cancelButtonText: "Cancel",
    textHideDetails: "Hide Details"
});