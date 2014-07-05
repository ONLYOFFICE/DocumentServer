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
 Ext.define("SSE.controller.Print", {
    extend: "Ext.app.Controller",
    uses: ["SSE.view.DocumentStatusInfo", "SSE.view.PrintSettings"],
    views: ["MainSettingsPrint"],
    refs: [{
        ref: "toolbar",
        selector: "ssetoolbar"
    },
    {
        ref: "printAdvanced",
        selector: "ssemainsettingsprint"
    }],
    init: function () {
        this.adjPrintParams = new Asc.asc_CAdjustPrint();
        this.adjPrintParams.asc_setPrintType(c_oAscPrintType.ActiveSheets);
        this.adjPrintParams.asc_setLayoutPageType(c_oAscLayoutPageType.FitToWidth);
        this.control({
            "documentstatusinfo": {
                "updatesheetsinfo": function () {
                    this.isFillSheets = false;
                    this.diffParams = {};
                }
            },
            "ssemainsettingsprint": {
                show: function () {
                    if (!this.isFillSheets) {
                        this.isFillSheets = true;
                        this.updateSettings();
                    }
                    if (!this.isUpdatedSettings) {
                        this.isUpdatedSettings = true;
                        this.getPrintAdvanced().cmbSheet.select(this.getPrintAdvanced().cmbSheet.getStore().findRecord("sheetindex", this.api.asc_getActiveWorksheetIndex()));
                    }
                }
            },
            "sseprintsettings": {
                onmodalresult: this.closePrintSettings
            },
            "#advsettings-print-combo-sheets": {
                change: this.comboSheetsChange
            },
            "#advsettings-print-button-save": {
                click: this.querySavePrintSettings
            },
            "#toolbar-menuitem-print-options": {
                click: this.openPrintSettings
            },
            "#dialog-print-options-ok": {
                click: this.queryClosePrintSettings
            },
            "#dialog-printoptions-grouprange": {
                change: function (obj, newvalue, oldvalue, opts) {
                    if (typeof(newvalue.printrange) == "number") {
                        var panel = obj.up("window");
                        if (newvalue.printrange == c_oAscPrintType.EntireWorkbook) {
                            this.indeterminatePageOptions(panel);
                        } else {
                            if (obj.lastCheckedRange == c_oAscPrintType.EntireWorkbook) {
                                this.fillPageOptions(panel, this.api.asc_getPageOptions());
                            }
                        }
                        obj.lastCheckedRange = newvalue.printrange;
                    }
                }
            }
        });
    },
    setApi: function (o) {
        this.api = o;
    },
    updateSettings: function () {
        var panel = this.getPrintAdvanced();
        panel.cmbSheet.getStore().removeAll();
        var wc = this.api.asc_getWorksheetsCount(),
        i = -1;
        var items = [{
            sheetname: this.strAllSheets,
            sheetindex: -255
        }];
        while (++i < wc) {
            if (!this.api.asc_isWorksheetHidden(i)) {
                items.push({
                    sheetname: this.api.asc_getWorksheetName(i).replace(/\s/g, "&nbsp;"),
                    sheetindex: i
                });
            }
        }
        panel.cmbSheet.getStore().loadData(items);
    },
    comboSheetsChange: function (combo, newvalue, oldvalue, eopts) {
        var panel = this.getPrintAdvanced();
        if (newvalue == -255) {
            this.indeterminatePageOptions(panel);
        } else {
            this.fillPageOptions(panel, this.api.asc_getPageOptions(newvalue));
        }
    },
    isDiffRefill: function () {
        for (var item in this.diffParams) {
            if (this.diffParams[item] == undefined) {
                return true;
            }
        }
        return item == undefined;
    },
    indeterminatePageOptions: function (panel) {
        if (this.isDiffRefill()) {
            var wc = this.api.asc_getWorksheetsCount();
            if (wc == 1) {
                this.diffParams.orientation = false;
                this.diffParams.size = false;
                this.diffParams.headings = false;
                this.diffParams.grid = false;
                this.diffParams.margintop = false;
                this.diffParams.marginright = false;
                this.diffParams.marginbottom = false;
                this.diffParams.marginleft = false;
            } else {
                var index = 0;
                var opts = this.api.asc_getPageOptions(index),
                opts_next;
                while (++index < wc) {
                    opts_next = this.api.asc_getPageOptions(index);
                    if (this.diffParams.orientation == undefined) {
                        this.diffParams.orientation = opts.asc_getPageSetup().asc_getOrientation() != opts_next.asc_getPageSetup().asc_getOrientation();
                    }
                    if (this.diffParams.size == undefined) {
                        this.diffParams.size = (opts.asc_getPageSetup().asc_getWidth() != opts_next.asc_getPageSetup().asc_getWidth() || opts.asc_getPageSetup().asc_getHeight() != opts_next.asc_getPageSetup().asc_getHeight());
                    }
                    if (this.diffParams.headings == undefined) {
                        this.diffParams.headings = opts.asc_getHeadings() != opts_next.asc_getHeadings();
                    }
                    if (this.diffParams.grid == undefined) {
                        this.diffParams.grid = opts.asc_getGridLines() != opts_next.asc_getGridLines();
                    }
                    if (this.diffParams.margintop == undefined) {
                        this.diffParams.margintop = opts.asc_getPageMargins().asc_getTop() != opts_next.asc_getPageMargins().asc_getTop();
                    }
                    if (this.diffParams.marginright == undefined) {
                        this.diffParams.marginright = opts.asc_getPageMargins().asc_getRight() != opts_next.asc_getPageMargins().asc_getRight();
                    }
                    if (this.diffParams.marginbottom == undefined) {
                        this.diffParams.marginbottom = opts.asc_getPageMargins().asc_getBottom() != opts_next.asc_getPageMargins().asc_getBottom();
                    }
                    if (this.diffParams.marginleft == undefined) {
                        this.diffParams.marginleft = opts.asc_getPageMargins().asc_getLeft() != opts_next.asc_getPageMargins().asc_getLeft();
                    }
                }
            }
        }
        if (this.diffParams.orientation) {
            panel.cmbPaperOrientation.setValue("-");
        }
        if (this.diffParams.size) {
            panel.cmbPaperSize.setValue("-");
        }
        if (this.diffParams.margintop) {
            panel.spnMarginTop.setRawValue("-");
        }
        if (this.diffParams.marginright) {
            panel.spnMarginRight.setRawValue("-");
        }
        if (this.diffParams.marginbottom) {
            panel.spnMarginBottom.setRawValue("-");
        }
        if (this.diffParams.marginleft) {
            panel.spnMarginLeft.setRawValue("-");
        }
        if (this.diffParams.grid) {
            panel.chPrintGrid.setValue("indeterminate");
        }
        if (this.diffParams.headings) {
            panel.chPrintRows.setValue("indeterminate");
        }
    },
    fillPageOptions: function (panel, props) {
        var opt = props.asc_getPageSetup();
        var index = panel.cmbPaperOrientation.getStore().find("orient", opt.asc_getOrientation());
        panel.cmbPaperOrientation.select(panel.cmbPaperOrientation.getStore().getAt(index));
        var w = opt.asc_getWidth();
        var h = opt.asc_getHeight();
        index = panel.cmbPaperSize.getStore().find("size", w + "|" + h);
        if (index < 0) {
            panel.cmbPaperSize.setValue("Custom (" + w + " x " + h);
        } else {
            panel.cmbPaperSize.select(panel.cmbPaperSize.getStore().getAt(index));
        }
        opt = props.asc_getPageMargins();
        panel.spnMarginLeft.setValue(Common.MetricSettings.fnRecalcFromMM(opt.asc_getLeft()));
        panel.spnMarginTop.setValue(Common.MetricSettings.fnRecalcFromMM(opt.asc_getTop()));
        panel.spnMarginRight.setValue(Common.MetricSettings.fnRecalcFromMM(opt.asc_getRight()));
        panel.spnMarginBottom.setValue(Common.MetricSettings.fnRecalcFromMM(opt.asc_getBottom()));
        panel.chPrintGrid.setValue(props.asc_getGridLines());
        panel.chPrintRows.setValue(props.asc_getHeadings());
    },
    fillPrintOptions: function (panel, props) {
        panel.groupRange.setValue({
            printrange: props.asc_getPrintType()
        });
        panel.groupLayout.setValue({
            printlayout: props.asc_getLayoutPageType()
        });
    },
    getPageOptions: function (panel) {
        var props = new Asc.asc_CPageOptions();
        props.asc_setGridLines(panel.chPrintGrid.getValue() == "indeterminate" ? undefined : panel.chPrintGrid.getValue() == "checked" ? 1 : 0);
        props.asc_setHeadings(panel.chPrintRows.getValue() == "indeterminate" ? undefined : panel.chPrintRows.getValue() == "checked" ? 1 : 0);
        var opt = new Asc.asc_CPageSetup();
        opt.asc_setOrientation(panel.cmbPaperOrientation.getValue() == "-" ? undefined : panel.cmbPaperOrientation.getValue());
        var pagew = /^\d{3}\.?\d*/.exec(panel.cmbPaperSize.getValue());
        var pageh = /\d{3}\.?\d*$/.exec(panel.cmbPaperSize.getValue());
        opt.asc_setWidth(!pagew ? undefined : parseFloat(pagew[0]));
        opt.asc_setHeight(!pageh ? undefined : parseFloat(pageh[0]));
        props.asc_setPageSetup(opt);
        opt = new Asc.asc_CPageMargins();
        opt.asc_setLeft(panel.spnMarginLeft.getRawValue() == "-" ? undefined : Common.MetricSettings.fnRecalcToMM(panel.spnMarginLeft.getNumberValue()));
        opt.asc_setTop(panel.spnMarginTop.getRawValue() == "-" ? undefined : Common.MetricSettings.fnRecalcToMM(panel.spnMarginTop.getNumberValue()));
        opt.asc_setRight(panel.spnMarginRight.getRawValue() == "-" ? undefined : Common.MetricSettings.fnRecalcToMM(panel.spnMarginRight.getNumberValue()));
        opt.asc_setBottom(panel.spnMarginBottom.getRawValue() == "-" ? undefined : Common.MetricSettings.fnRecalcToMM(panel.spnMarginBottom.getNumberValue()));
        props.asc_setPageMargins(opt);
        return props;
    },
    savePageOptions: function (panel, index) {
        var opts = this.getPageOptions(panel);
        if (index == -255) {
            var wc = this.api.asc_getWorksheetsCount();
            index = -1;
            while (++index < wc) {
                this.api.asc_setPageOptions(opts, index);
            }
            if (this.diffParams.orientation) {
                this.diffParams.orientation = opts.asc_getPageSetup().asc_getOrientation() == undefined;
            }
            if (this.diffParams.size) {
                this.diffParams.size = (opts.asc_getPageSetup().asc_getWidth() == undefined || opts.asc_getPageSetup().asc_getHeight() == undefined);
            }
            if (this.diffParams.headings) {
                this.diffParams.headings = opts.asc_getHeadings() == undefined;
            }
            if (this.diffParams.grid) {
                this.diffParams.grid = opts.asc_getGridLines() == undefined;
            }
            if (this.diffParams.margintop) {
                this.diffParams.margintop = opts.asc_getPageMargins().asc_getTop() == undefined;
            }
            if (this.diffParams.marginright) {
                this.diffParams.marginright = opts.asc_getPageMargins().asc_getRight() == undefined;
            }
            if (this.diffParams.marginbottom) {
                this.diffParams.marginbottom = opts.asc_getPageMargins().asc_getBottom() == undefined;
            }
            if (this.diffParams.marginleft) {
                this.diffParams.marginleft = opts.asc_getPageMargins().asc_getLeft() == undefined;
            }
        } else {
            this.api.asc_setPageOptions(opts, index);
            this.diffParams = {};
        }
    },
    openPrintSettings: function () {
        if (this.api) {
            var win = Ext.widget("sseprintsettings", {});
            this.fillPageOptions(win, this.api.asc_getPageOptions());
            this.fillPrintOptions(win, this.adjPrintParams);
            win.updateMetricUnit();
            win.show();
        }
    },
    closePrintSettings: function (obj, mr) {
        if (mr == 1) {
            this.savePageOptions(obj, obj.groupRange.getValue().printrange == c_oAscPrintType.EntireWorkbook ? -255 : undefined);
            this.adjPrintParams.asc_setPrintType(obj.groupRange.getValue().printrange);
            this.adjPrintParams.asc_setLayoutPageType(obj.groupLayout.getValue().printlayout);
            this.api.asc_Print(this.adjPrintParams);
            this.isUpdatedSettings = false;
        }
        this.getToolbar().fireEvent("editcomplete", this.getToolbar());
    },
    querySavePrintSettings: function () {
        var panel = this.getPrintAdvanced();
        if (this.checkMargins(panel)) {
            this.savePageOptions(panel, panel.cmbSheet.getValue());
            panel.up("ssedocumentsettings").fireEvent("savedocsettings", panel);
        }
    },
    queryClosePrintSettings: function (btn) {
        var panel = btn.up("window");
        if (this.checkMargins(panel)) {
            panel.fireEvent("onmodalresult", panel, 1);
            panel.close();
        }
    },
    checkMargins: function (panel) {
        if (panel.cmbPaperOrientation.getValue() == c_oAscPageOrientation.PagePortrait) {
            var pagewidth = /^\d{3}\.?\d*/.exec(panel.cmbPaperSize.getValue());
            var pageheight = /\d{3}\.?\d*$/.exec(panel.cmbPaperSize.getValue());
        } else {
            pageheight = /^\d{3}\.?\d*/.exec(panel.cmbPaperSize.getValue());
            pagewidth = /\d{3}\.?\d*$/.exec(panel.cmbPaperSize.getValue());
        }
        var ml = Common.MetricSettings.fnRecalcToMM(panel.spnMarginLeft.getNumberValue());
        var mr = Common.MetricSettings.fnRecalcToMM(panel.spnMarginRight.getNumberValue());
        var mt = Common.MetricSettings.fnRecalcToMM(panel.spnMarginTop.getNumberValue());
        var mb = Common.MetricSettings.fnRecalcToMM(panel.spnMarginBottom.getNumberValue());
        var result = false;
        if (ml > pagewidth) {
            result = "left";
        } else {
            if (mr > pagewidth - ml) {
                result = "right";
            } else {
                if (mt > pageheight) {
                    result = "top";
                } else {
                    if (mb > pageheight - mt) {
                        result = "bottom";
                    }
                }
            }
        }
        if (result) {
            Ext.Msg.show({
                title: this.textWarning,
                msg: this.warnCheckMargings,
                icon: Ext.Msg.WARNING,
                buttons: Ext.Msg.OK,
                fn: function (btn, text) {
                    switch (result) {
                    case "left":
                        panel.spnMarginLeft.focus();
                        return;
                    case "right":
                        panel.spnMarginRight.focus();
                        return;
                    case "top":
                        panel.spnMarginTop.focus();
                        return;
                    case "bottom":
                        panel.spnMarginBottom.focus();
                        return;
                    }
                }
            });
            return false;
        }
        return true;
    },
    warnCheckMargings: "Margins are incorrect",
    strAllSheets: "All Sheets",
    textWarning: "Warning"
});