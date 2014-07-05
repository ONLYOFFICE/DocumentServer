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
 Ext.define("SSE.view.MainSettingsPrint", {
    extend: "Ext.container.Container",
    alias: "widget.ssemainsettingsprint",
    cls: "sse-documentsettings-body",
    requires: ["Ext.button.Button", "Ext.container.Container", "Ext.form.Label", "Common.component.IndeterminateCheckBox"],
    listeners: {
        show: function (cmp, eOpts) {}
    },
    height: "100%",
    initComponent: function () {
        var me = this;
        this.cmbSheet = Ext.create("Ext.form.field.ComboBox", {
            id: "advsettings-print-combo-sheets",
            width: 260,
            editable: false,
            store: Ext.create("Ext.data.Store", {
                fields: ["sheetname", {
                    type: "int",
                    name: "sheetindex"
                }],
                data: [{
                    sheetname: me.strAllSheets,
                    sheetindex: -255
                }]
            }),
            queryMode: "local",
            displayField: "sheetname",
            valueField: "sheetindex",
            triggerAction: "all"
        });
        this.cmbPaperSize = Ext.widget("combo", {
            width: 260,
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
            editable: false
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
            width: 200
        });
        this.chPrintGrid = Ext.widget("cmdindeterminatecheckbox", {
            boxLabel: this.textPrintGrid,
            width: 500
        });
        this.chPrintRows = Ext.widget("cmdindeterminatecheckbox", {
            boxLabel: this.textPrintHeadings,
            width: 500
        });
        this.spnMarginLeft = Ext.create("Common.component.MetricSpinner", {
            readOnly: false,
            maxValue: 48.25,
            minValue: 0,
            step: 0.1,
            defaultUnit: "cm",
            value: "0.19 cm",
            listeners: {}
        });
        this.spnMarginRight = Ext.create("Common.component.MetricSpinner", {
            readOnly: false,
            maxValue: 48.25,
            minValue: 0,
            step: 0.1,
            defaultUnit: "cm",
            value: "0.19 cm",
            listeners: {}
        });
        this.spnMarginTop = Ext.create("Common.component.MetricSpinner", {
            readOnly: false,
            maxValue: 48.25,
            minValue: 0,
            step: 0.1,
            defaultUnit: "cm",
            value: "0 cm",
            listeners: {}
        });
        this.spnMarginBottom = Ext.create("Common.component.MetricSpinner", {
            readOnly: false,
            maxValue: 48.25,
            minValue: 0,
            step: 0.1,
            defaultUnit: "cm",
            value: "0 cm",
            listeners: {}
        });
        this.btnOk = Ext.widget("button", {
            id: "advsettings-print-button-save",
            cls: "asc-blue-button",
            width: 90,
            height: 22,
            text: this.okButtonText
        });
        this.items = [{
            xtype: "container",
            layout: {
                type: "table",
                columns: 2,
                tableAttrs: {
                    style: "width: 100%;"
                },
                tdAttrs: {
                    style: "padding: 10px 10px;"
                }
            },
            items: [{
                xtype: "label",
                cellCls: "doc-info-label-cell",
                text: me.textSettings,
                style: "display: block;text-align: right; margin-bottom: 5px;",
                width: "100%"
            },
            this.cmbSheet, {
                xtype: "tbspacer",
                height: 5
            },
            {
                xtype: "tbspacer",
                height: 5
            },
            {
                xtype: "label",
                cellCls: "doc-info-label-cell",
                text: me.textPageSize,
                style: "display: block;text-align: right; margin-bottom: 5px;",
                width: "100%"
            },
            this.cmbPaperSize, {
                xtype: "label",
                cellCls: "doc-info-label-cell",
                text: me.textPageOrientation,
                style: "display: block;text-align: right; margin-bottom: 5px;",
                width: "100%"
            },
            this.cmbPaperOrientation, {
                xtype: "label",
                cellCls: "doc-info-label-cell label-align-top",
                text: me.strMargins,
                style: "display: block;text-align: right;",
                width: "100%"
            },
            this.cntMargins = Ext.widget("container", {
                height: 100,
                width: 200,
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
            }), {
                xtype: "label",
                cellCls: "doc-info-label-cell label-align-top",
                text: me.strPrint,
                style: "display: block;text-align: right; margin-top: 4px;",
                width: "100%"
            },
            this.cntAdditional = Ext.widget("container", {
                height: 45,
                width: 500,
                layout: {
                    type: "vbox",
                    align: "stretch"
                },
                items: [this.chPrintGrid, this.chPrintRows]
            }), {
                xtype: "tbspacer"
            },
            {
                xtype: "tbspacer"
            },
            {
                xtype: "tbspacer"
            },
            this.btnOk]
        }];
        this.addEvents("savedocsettings");
        this.callParent(arguments);
    },
    applySettings: function () {},
    setMode: function (mode) {},
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
    okButtonText: "Save",
    strPortrait: "Portrait",
    strLandscape: "Landscape",
    textPrintGrid: "Print Gridlines",
    textPrintHeadings: "Print Rows and Columns Headings",
    strLeft: "Left",
    strRight: "Right",
    strTop: "Top",
    strBottom: "Bottom",
    strMargins: "Margins",
    textPageSize: "Page Size",
    textPageOrientation: "Page Orientation",
    strPrint: "Print",
    textSettings: "Settings for"
});