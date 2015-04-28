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
 "use strict";
(function (window, undefined) {
    var asc = window["Asc"] ? window["Asc"] : (window["Asc"] = {});
    var prot;
    function asc_CAscEditorPermissions(settings) {
        if (! (this instanceof asc_CAscEditorPermissions)) {
            return new asc_CAscEditorPermissions();
        }
        if (settings) {
            this.canEdit = settings["canEdit"];
            this.canDownload = settings["canDownload"];
            this.canCoAuthoring = settings["canCoAuthoring"];
            this.canReaderMode = settings["canReaderMode"];
            this.canBranding = settings["canBranding"];
            this.isAutosaveEnable = settings["isAutosaveEnable"];
            this.AutosaveMinInterval = settings["AutosaveMinInterval"];
            this.isAnalyticsEnable = settings["isAnalyticsEnable"];
        } else {
            this.canEdit = true;
            this.canDownload = true;
            this.canCoAuthoring = true;
            this.canReaderMode = true;
            this.canBranding = true;
            this.isAutosaveEnable = true;
            this.AutosaveMinInterval = 300;
            this.isAnalyticsEnable = false;
        }
        return this;
    }
    asc_CAscEditorPermissions.prototype = {
        constructor: asc_CAscEditorPermissions,
        asc_getCanEdit: function () {
            return this.canEdit;
        },
        asc_getCanDownload: function () {
            return this.canDownload;
        },
        asc_getCanCoAuthoring: function () {
            return this.canCoAuthoring;
        },
        asc_getCanReaderMode: function () {
            return this.canReaderMode;
        },
        asc_getCanBranding: function (v) {
            return this.canBranding;
        },
        asc_getIsAutosaveEnable: function () {
            return this.isAutosaveEnable;
        },
        asc_getAutosaveMinInterval: function () {
            return this.AutosaveMinInterval;
        },
        asc_getIsAnalyticsEnable: function () {
            return this.isAnalyticsEnable;
        },
        asc_setCanEdit: function (v) {
            this.canEdit = v;
        },
        asc_setCanDownload: function (v) {
            this.canDownload = v;
        },
        asc_setCanCoAuthoring: function (v) {
            this.canCoAuthoring = v;
        },
        asc_setCanReaderMode: function (v) {
            this.canReaderMode = v;
        },
        asc_setCanBranding: function (v) {
            this.canBranding = v;
        },
        asc_setIsAutosaveEnable: function (v) {
            this.isAutosaveEnable = v;
        },
        asc_setAutosaveMinInterval: function (v) {
            this.AutosaveMinInterval = v;
        },
        asc_setIsAnalyticsEnable: function (v) {
            this.isAnalyticsEnable = v;
        }
    };
    window["Asc"]["asc_CAscEditorPermissions"] = window["Asc"].asc_CAscEditorPermissions = asc_CAscEditorPermissions;
    prot = asc_CAscEditorPermissions.prototype;
    prot["asc_getCanEdit"] = prot.asc_getCanEdit;
    prot["asc_getCanDownload"] = prot.asc_getCanDownload;
    prot["asc_getCanCoAuthoring"] = prot.asc_getCanCoAuthoring;
    prot["asc_getCanReaderMode"] = prot.asc_getCanReaderMode;
    prot["asc_getCanBranding"] = prot.asc_getCanBranding;
    prot["asc_getIsAutosaveEnable"] = prot.asc_getIsAutosaveEnable;
    prot["asc_getAutosaveMinInterval"] = prot.asc_getAutosaveMinInterval;
    prot["asc_getIsAnalyticsEnable"] = prot.asc_getIsAnalyticsEnable;
    function asc_CAscLicense(settings) {
        if (! (this instanceof asc_CAscLicense)) {
            return new asc_CAscLicense();
        }
        if (settings) {
            this.customer = settings["customer"];
            this.customerAddr = settings["customer_addr"];
            this.customerWww = settings["customer_www"];
            this.customerMail = settings["customer_mail"];
            this.customerInfo = settings["customer_info"];
            this.customerLogo = settings["customer_logo"];
        } else {
            this.customer = null;
            this.customerAddr = null;
            this.customerWww = null;
            this.customerMail = null;
            this.customerInfo = null;
            this.customerLogo = null;
        }
        return this;
    }
    asc_CAscLicense.prototype.asc_getCustomer = function () {
        return this.customer;
    };
    asc_CAscLicense.prototype.asc_getCustomerAddr = function () {
        return this.customerAddr;
    };
    asc_CAscLicense.prototype.asc_getCustomerWww = function () {
        return this.customerWww;
    };
    asc_CAscLicense.prototype.asc_getCustomerMail = function () {
        return this.customerMail;
    };
    asc_CAscLicense.prototype.asc_getCustomerInfo = function () {
        return this.customerInfo;
    };
    asc_CAscLicense.prototype.asc_getCustomerLogo = function () {
        return this.customerLogo;
    };
    window["Asc"]["asc_CAscLicense"] = window["Asc"].asc_CAscLicense = asc_CAscLicense;
    prot = asc_CAscLicense.prototype;
    prot["asc_getCustomer"] = prot.asc_getCustomer;
    prot["asc_getCustomerAddr"] = prot.asc_getCustomerAddr;
    prot["asc_getCustomerWww"] = prot.asc_getCustomerWww;
    prot["asc_getCustomerMail"] = prot.asc_getCustomerMail;
    prot["asc_getCustomerInfo"] = prot.asc_getCustomerInfo;
    prot["asc_getCustomerLogo"] = prot.asc_getCustomerLogo;
    function CColor(r, g, b, a) {
        this.r = (undefined == r) ? 0 : r;
        this.g = (undefined == g) ? 0 : g;
        this.b = (undefined == b) ? 0 : b;
        this.a = (undefined == a) ? 1 : a;
    }
    CColor.prototype = {
        constructor: CColor,
        getR: function () {
            return this.r;
        },
        get_r: function () {
            return this.r;
        },
        put_r: function (v) {
            this.r = v;
            this.hex = undefined;
        },
        getG: function () {
            return this.g;
        },
        get_g: function () {
            return this.g;
        },
        put_g: function (v) {
            this.g = v;
            this.hex = undefined;
        },
        getB: function () {
            return this.b;
        },
        get_b: function () {
            return this.b;
        },
        put_b: function (v) {
            this.b = v;
            this.hex = undefined;
        },
        getA: function () {
            return this.a;
        },
        get_hex: function () {
            if (!this.hex) {
                var r = this.r.toString(16);
                var g = this.g.toString(16);
                var b = this.b.toString(16);
                this.hex = (r.length == 1 ? "0" + r : r) + (g.length == 1 ? "0" + g : g) + (b.length == 1 ? "0" + b : b);
            }
            return this.hex;
        }
    };
    window["CColor"] = window.CColor = CColor;
    prot = CColor.prototype;
    prot["getR"] = prot.getR;
    prot["get_r"] = prot.get_r;
    prot["put_r"] = prot.put_r;
    prot["getG"] = prot.getG;
    prot["get_g"] = prot.get_g;
    prot["put_g"] = prot.put_g;
    prot["getB"] = prot.getB;
    prot["get_b"] = prot.get_b;
    prot["put_b"] = prot.put_b;
    prot["getA"] = prot.getA;
    prot["get_hex"] = prot.get_hex;
    function asc_ChartSettings() {
        this.style = null;
        this.title = null;
        this.rowCols = null;
        this.horAxisLabel = null;
        this.vertAxisLabel = null;
        this.legendPos = null;
        this.dataLabelsPos = null;
        this.vertAx = null;
        this.horAx = null;
        this.horGridLines = null;
        this.vertGridLines = null;
        this.type = null;
        this.showSerName = null;
        this.showCatName = null;
        this.showVal = null;
        this.separator = null;
        this.horAxisProps = null;
        this.vertAxisProps = null;
        this.range = null;
        this.inColumns = null;
        this.showMarker = null;
        this.bLine = null;
        this.smooth = null;
    }
    asc_ChartSettings.prototype = {
        putShowMarker: function (v) {
            this.showMarker = v;
        },
        getShowMarker: function () {
            return this.showMarker;
        },
        putLine: function (v) {
            this.bLine = v;
        },
        getLine: function () {
            return this.bLine;
        },
        putSmooth: function (v) {
            this.smooth = v;
        },
        getSmooth: function () {
            return this.smooth;
        },
        putStyle: function (index) {
            this.style = parseInt(index, 10);
        },
        getStyle: function () {
            return this.style;
        },
        putRange: function (range) {
            this.range = range;
        },
        getRange: function () {
            return this.range;
        },
        putInColumns: function (inColumns) {
            this.inColumns = inColumns;
        },
        getInColumns: function () {
            return this.inColumns;
        },
        putTitle: function (v) {
            this.title = v;
        },
        getTitle: function () {
            return this.title;
        },
        putRowCols: function (v) {
            this.rowCols = v;
        },
        getRowCols: function () {
            return this.rowCols;
        },
        putHorAxisLabel: function (v) {
            this.horAxisLabel = v;
        },
        putVertAxisLabel: function (v) {
            this.vertAxisLabel = v;
        },
        putLegendPos: function (v) {
            this.legendPos = v;
        },
        putDataLabelsPos: function (v) {
            this.dataLabelsPos = v;
        },
        putCatAx: function (v) {
            this.vertAx = v;
        },
        putValAx: function (v) {
            this.horAx = v;
        },
        getHorAxisLabel: function (v) {
            return this.horAxisLabel;
        },
        getVertAxisLabel: function (v) {
            return this.vertAxisLabel;
        },
        getLegendPos: function (v) {
            return this.legendPos;
        },
        getDataLabelsPos: function (v) {
            return this.dataLabelsPos;
        },
        getVertAx: function (v) {
            return this.vertAx;
        },
        getHorAx: function (v) {
            return this.horAx;
        },
        putHorGridLines: function (v) {
            this.horGridLines = v;
        },
        getHorGridLines: function (v) {
            return this.horGridLines;
        },
        putVertGridLines: function (v) {
            this.vertGridLines = v;
        },
        getVertGridLines: function () {
            return this.vertGridLines;
        },
        getType: function () {
            return this.type;
        },
        putType: function (v) {
            return this.type = v;
        },
        putShowSerName: function (v) {
            return this.showSerName = v;
        },
        putShowCatName: function (v) {
            return this.showCatName = v;
        },
        putShowVal: function (v) {
            return this.showVal = v;
        },
        getShowSerName: function () {
            return this.showSerName;
        },
        getShowCatName: function () {
            return this.showCatName;
        },
        getShowVal: function () {
            return this.showVal;
        },
        putSeparator: function (v) {
            this.separator = v;
        },
        getSeparator: function () {
            return this.separator;
        },
        putHorAxisProps: function (v) {
            this.horAxisProps = v;
        },
        getHorAxisProps: function () {
            return this.horAxisProps;
        },
        putVertAxisProps: function (v) {
            this.vertAxisProps = v;
        },
        getVertAxisProps: function () {
            return this.vertAxisProps;
        },
        changeType: function (type) {
            if (this.type === type) {
                return;
            }
            this.putType(type);
            var hor_axis_settings = this.getHorAxisProps();
            var vert_axis_settings = this.getVertAxisProps();
            var new_hor_axis_settings, new_vert_axis_settings;
            switch (type) {
            case c_oAscChartTypeSettings.pie:
                case c_oAscChartTypeSettings.doughnut:
                this.putHorAxisProps(null);
                this.putVertAxisProps(null);
                this.putHorAxisLabel(null);
                this.putVertAxisLabel(null);
                break;
            case c_oAscChartTypeSettings.barNormal:
                case c_oAscChartTypeSettings.barStacked:
                case c_oAscChartTypeSettings.barStackedPer:
                case c_oAscChartTypeSettings.lineNormal:
                case c_oAscChartTypeSettings.lineStacked:
                case c_oAscChartTypeSettings.lineStackedPer:
                case c_oAscChartTypeSettings.lineNormalMarker:
                case c_oAscChartTypeSettings.lineStackedMarker:
                case c_oAscChartTypeSettings.lineStackedPerMarker:
                case c_oAscChartTypeSettings.areaNormal:
                case c_oAscChartTypeSettings.areaStacked:
                case c_oAscChartTypeSettings.areaStackedPer:
                case c_oAscChartTypeSettings.stock:
                if (!hor_axis_settings || hor_axis_settings.getAxisType() !== c_oAscAxisType.cat) {
                    new_hor_axis_settings = new asc_CatAxisSettings();
                    new_hor_axis_settings.setDefault();
                    this.putHorAxisProps(new_hor_axis_settings);
                }
                if (!vert_axis_settings || vert_axis_settings.getAxisType() !== c_oAscAxisType.val) {
                    new_vert_axis_settings = new asc_ValAxisSettings();
                    new_vert_axis_settings.setDefault();
                    this.putVertAxisProps(new_vert_axis_settings);
                }
                this.putHorGridLines(c_oAscGridLinesSettings.major);
                this.putVertGridLines(c_oAscGridLinesSettings.none);
                if (type === c_oAscChartTypeSettings.lineNormal || type === c_oAscChartTypeSettings.lineStacked || type === c_oAscChartTypeSettings.lineStackedPer || type === c_oAscChartTypeSettings.lineNormalMarker || type === c_oAscChartTypeSettings.lineStackedMarker || type === c_oAscChartTypeSettings.lineStackedPerMarker) {
                    this.putShowMarker(false);
                    this.putSmooth(null);
                    this.putLine(true);
                }
                break;
            case c_oAscChartTypeSettings.hBarNormal:
                case c_oAscChartTypeSettings.hBarStacked:
                case c_oAscChartTypeSettings.hBarStackedPer:
                if (!hor_axis_settings || hor_axis_settings.getAxisType() !== c_oAscAxisType.val) {
                    new_hor_axis_settings = new asc_ValAxisSettings();
                    new_hor_axis_settings.setDefault();
                    this.putHorAxisProps(new_hor_axis_settings);
                }
                if (!vert_axis_settings || vert_axis_settings.getAxisType() !== c_oAscAxisType.cat) {
                    new_vert_axis_settings = new asc_CatAxisSettings();
                    new_vert_axis_settings.setDefault();
                    this.putVertAxisProps(new_vert_axis_settings);
                }
                this.putHorGridLines(c_oAscGridLinesSettings.none);
                this.putVertGridLines(c_oAscGridLinesSettings.major);
                break;
            case c_oAscChartTypeSettings.scatter:
                case c_oAscChartTypeSettings.scatterLine:
                case c_oAscChartTypeSettings.scatterLineMarker:
                case c_oAscChartTypeSettings.scatterMarker:
                case c_oAscChartTypeSettings.scatterNone:
                case c_oAscChartTypeSettings.scatterSmooth:
                case c_oAscChartTypeSettings.scatterSmoothMarker:
                if (!hor_axis_settings || hor_axis_settings.getAxisType() !== c_oAscAxisType.val) {
                    new_hor_axis_settings = new asc_ValAxisSettings();
                    new_hor_axis_settings.setDefault();
                    this.putHorAxisProps(new_hor_axis_settings);
                }
                if (!vert_axis_settings || vert_axis_settings.getAxisType() !== c_oAscAxisType.val) {
                    new_vert_axis_settings = new asc_ValAxisSettings();
                    new_vert_axis_settings.setDefault();
                    this.putVertAxisProps(new_vert_axis_settings);
                }
                this.putHorGridLines(c_oAscGridLinesSettings.major);
                this.putVertGridLines(c_oAscGridLinesSettings.major);
                this.putShowMarker(true);
                this.putSmooth(null);
                this.putLine(false);
                break;
            }
        }
    };
    prot = asc_ChartSettings.prototype;
    prot["putStyle"] = prot.putStyle;
    prot["putTitle"] = prot.putTitle;
    prot["putRowCols"] = prot.putRowCols;
    prot["putHorAxisLabel"] = prot.putHorAxisLabel;
    prot["putVertAxisLabel"] = prot.putVertAxisLabel;
    prot["putLegendPos"] = prot.putLegendPos;
    prot["putDataLabelsPos"] = prot.putDataLabelsPos;
    prot["putCatAx"] = prot.putCatAx;
    prot["putValAx"] = prot.putValAx;
    prot["getStyle"] = prot.getStyle;
    prot["getTitle"] = prot.getTitle;
    prot["getRowCols"] = prot.getRowCols;
    prot["getHorAxisLabel"] = prot.getHorAxisLabel;
    prot["getVertAxisLabel"] = prot.getVertAxisLabel;
    prot["getLegendPos"] = prot.getLegendPos;
    prot["getDataLabelsPos"] = prot.getDataLabelsPos;
    prot["getHorAx"] = prot.getHorAx;
    prot["getVertAx"] = prot.getVertAx;
    prot["getHorGridLines"] = prot.getHorGridLines;
    prot["putHorGridLines"] = prot.putHorGridLines;
    prot["getVertGridLines"] = prot.getVertGridLines;
    prot["putVertGridLines"] = prot.putVertGridLines;
    prot["getType"] = prot.getType;
    prot["putType"] = prot.putType;
    prot["putShowSerName"] = prot.putShowSerName;
    prot["getShowSerName"] = prot.getShowSerName;
    prot["putShowCatName"] = prot.putShowCatName;
    prot["getShowCatName"] = prot.getShowCatName;
    prot["putShowVal"] = prot.putShowVal;
    prot["getShowVal"] = prot.getShowVal;
    prot["putSeparator"] = prot.putSeparator;
    prot["getSeparator"] = prot.getSeparator;
    prot["putHorAxisProps"] = prot.putHorAxisProps;
    prot["getHorAxisProps"] = prot.getHorAxisProps;
    prot["putVertAxisProps"] = prot.putVertAxisProps;
    prot["getVertAxisProps"] = prot.getVertAxisProps;
    prot["putRange"] = prot.putRange;
    prot["getRange"] = prot.getRange;
    prot["putInColumns"] = prot.putInColumns;
    prot["getInColumns"] = prot.getInColumns;
    prot["putShowMarker"] = prot.putShowMarker;
    prot["getShowMarker"] = prot.getShowMarker;
    prot["putLine"] = prot.putLine;
    prot["getLine"] = prot.getLine;
    prot["putSmooth"] = prot.putSmooth;
    prot["getSmooth"] = prot.getSmooth;
    prot["changeType"] = prot.changeType;
    window["asc_ChartSettings"] = asc_ChartSettings;
    function asc_ValAxisSettings() {
        this.minValRule = null;
        this.minVal = null;
        this.maxValRule = null;
        this.maxVal = null;
        this.invertValOrder = null;
        this.logScale = null;
        this.logBase = null;
        this.dispUnitsRule = null;
        this.units = null;
        this.showUnitsOnChart = null;
        this.majorTickMark = null;
        this.minorTickMark = null;
        this.tickLabelsPos = null;
        this.crossesRule = null;
        this.crosses = null;
        this.axisType = c_oAscAxisType.val;
    }
    asc_ValAxisSettings.prototype = {
        putAxisType: function (v) {
            this.axisType = v;
        },
        putMinValRule: function (v) {
            this.minValRule = v;
        },
        putMinVal: function (v) {
            this.minVal = v;
        },
        putMaxValRule: function (v) {
            this.maxValRule = v;
        },
        putMaxVal: function (v) {
            this.maxVal = v;
        },
        putInvertValOrder: function (v) {
            this.invertValOrder = v;
        },
        putLogScale: function (v) {
            this.logScale = v;
        },
        putLogBase: function (v) {
            this.logBase = v;
        },
        putUnits: function (v) {
            this.units = v;
        },
        putShowUnitsOnChart: function (v) {
            this.showUnitsOnChart = v;
        },
        putMajorTickMark: function (v) {
            this.majorTickMark = v;
        },
        putMinorTickMark: function (v) {
            this.minorTickMark = v;
        },
        putTickLabelsPos: function (v) {
            this.tickLabelsPos = v;
        },
        putCrossesRule: function (v) {
            this.crossesRule = v;
        },
        putCrosses: function (v) {
            this.crosses = v;
        },
        putDispUnitsRule: function (v) {
            this.dispUnitsRule = v;
        },
        getAxisType: function () {
            return this.axisType;
        },
        getDispUnitsRule: function () {
            return this.dispUnitsRule;
        },
        getMinValRule: function () {
            return this.minValRule;
        },
        getMinVal: function () {
            return this.minVal;
        },
        getMaxValRule: function () {
            return this.maxValRule;
        },
        getMaxVal: function () {
            return this.maxVal;
        },
        getInvertValOrder: function () {
            return this.invertValOrder;
        },
        getLogScale: function () {
            return this.logScale;
        },
        getLogBase: function () {
            return this.logBase;
        },
        getUnits: function () {
            return this.units;
        },
        getShowUnitsOnChart: function () {
            return this.showUnitsOnChart;
        },
        getMajorTickMark: function () {
            return this.majorTickMark;
        },
        getMinorTickMark: function () {
            return this.minorTickMark;
        },
        getTickLabelsPos: function () {
            return this.tickLabelsPos;
        },
        getCrossesRule: function () {
            return this.crossesRule;
        },
        getCrosses: function () {
            return this.crosses;
        },
        setDefault: function () {
            this.putMinValRule(c_oAscValAxisRule.auto);
            this.putMaxValRule(c_oAscValAxisRule.auto);
            this.putTickLabelsPos(c_oAscTickLabelsPos.TICK_LABEL_POSITION_NEXT_TO);
            this.putInvertValOrder(false);
            this.putDispUnitsRule(c_oAscValAxUnits.none);
            this.putMajorTickMark(c_oAscTickMark.TICK_MARK_OUT);
            this.putMinorTickMark(c_oAscTickMark.TICK_MARK_NONE);
            this.putCrossesRule(c_oAscCrossesRule.auto);
        }
    };
    prot = asc_ValAxisSettings.prototype;
    prot["putMinValRule"] = prot.putMinValRule;
    prot["putMinVal"] = prot.putMinVal;
    prot["putMaxValRule"] = prot.putMaxValRule;
    prot["putMaxVal"] = prot.putMaxVal;
    prot["putInvertValOrder"] = prot.putInvertValOrder;
    prot["putLogScale"] = prot.putLogScale;
    prot["putLogBase"] = prot.putLogBase;
    prot["putUnits"] = prot.putUnits;
    prot["putShowUnitsOnChart"] = prot.putShowUnitsOnChart;
    prot["putMajorTickMark"] = prot.putMajorTickMark;
    prot["putMinorTickMark"] = prot.putMinorTickMark;
    prot["putTickLabelsPos"] = prot.putTickLabelsPos;
    prot["putCrossesRule"] = prot.putCrossesRule;
    prot["putCrosses"] = prot.putCrosses;
    prot["putDispUnitsRule"] = prot.putDispUnitsRule;
    prot["getDispUnitsRule"] = prot.getDispUnitsRule;
    prot["putAxisType"] = prot.putAxisType;
    prot["getAxisType"] = prot.getAxisType;
    prot["getMinValRule"] = prot.getMinValRule;
    prot["getMinVal"] = prot.getMinVal;
    prot["getMaxValRule"] = prot.getMaxValRule;
    prot["getMaxVal"] = prot.getMaxVal;
    prot["getInvertValOrder"] = prot.getInvertValOrder;
    prot["getLogScale"] = prot.getLogScale;
    prot["getLogBase"] = prot.getLogBase;
    prot["getUnits"] = prot.getUnits;
    prot["getShowUnitsOnChart"] = prot.getShowUnitsOnChart;
    prot["getMajorTickMark"] = prot.getMajorTickMark;
    prot["getMinorTickMark"] = prot.getMinorTickMark;
    prot["getTickLabelsPos"] = prot.getTickLabelsPos;
    prot["getCrossesRule"] = prot.getCrossesRule;
    prot["getCrosses"] = prot.getCrosses;
    prot["setDefault"] = prot.setDefault;
    window["asc_ValAxisSettings"] = asc_ValAxisSettings;
    function asc_CatAxisSettings() {
        this.intervalBetweenTick = null;
        this.intervalBetweenLabelsRule = null;
        this.intervalBetweenLabels = null;
        this.invertCatOrder = null;
        this.labelsAxisDistance = null;
        this.majorTickMark = null;
        this.minorTickMark = null;
        this.tickLabelsPos = null;
        this.crossesRule = null;
        this.crosses = null;
        this.labelsPosition = null;
        this.axisType = c_oAscAxisType.cat;
    }
    asc_CatAxisSettings.prototype = {
        putIntervalBetweenTick: function (v) {
            this.intervalBetweenTick = v;
        },
        putIntervalBetweenLabelsRule: function (v) {
            this.intervalBetweenLabelsRule = v;
        },
        putIntervalBetweenLabels: function (v) {
            this.intervalBetweenLabels = v;
        },
        putInvertCatOrder: function (v) {
            this.invertCatOrder = v;
        },
        putLabelsAxisDistance: function (v) {
            this.labelsAxisDistance = v;
        },
        putMajorTickMark: function (v) {
            this.majorTickMark = v;
        },
        putMinorTickMark: function (v) {
            this.minorTickMark = v;
        },
        putTickLabelsPos: function (v) {
            this.tickLabelsPos = v;
        },
        putCrossesRule: function (v) {
            this.crossesRule = v;
        },
        putCrosses: function (v) {
            this.crosses = v;
        },
        putAxisType: function (v) {
            this.axisType = v;
        },
        putLabelsPosition: function (v) {
            this.labelsPosition = v;
        },
        getIntervalBetweenTick: function (v) {
            return this.intervalBetweenTick;
        },
        getIntervalBetweenLabelsRule: function () {
            return this.intervalBetweenLabelsRule;
        },
        getIntervalBetweenLabels: function () {
            return this.intervalBetweenLabels;
        },
        getInvertCatOrder: function () {
            return this.invertCatOrder;
        },
        getLabelsAxisDistance: function () {
            return this.labelsAxisDistance;
        },
        getMajorTickMark: function () {
            return this.majorTickMark;
        },
        getMinorTickMark: function () {
            return this.minorTickMark;
        },
        getTickLabelsPos: function () {
            return this.tickLabelsPos;
        },
        getCrossesRule: function () {
            return this.crossesRule;
        },
        getCrosses: function () {
            return this.crosses;
        },
        getAxisType: function () {
            return this.axisType;
        },
        getLabelsPosition: function () {
            return this.labelsPosition;
        },
        setDefault: function () {
            this.putIntervalBetweenLabelsRule(c_oAscBetweenLabelsRule.auto);
            this.putLabelsPosition(c_oAscLabelsPosition.betweenDivisions);
            this.putTickLabelsPos(c_oAscTickLabelsPos.TICK_LABEL_POSITION_NEXT_TO);
            this.putLabelsAxisDistance(100);
            this.putMajorTickMark(c_oAscTickMark.TICK_MARK_OUT);
            this.putMinorTickMark(c_oAscTickMark.TICK_MARK_NONE);
            this.putIntervalBetweenTick(1);
            this.putCrossesRule(c_oAscCrossesRule.auto);
        }
    };
    prot = asc_CatAxisSettings.prototype;
    prot["putIntervalBetweenTick"] = prot.putIntervalBetweenTick;
    prot["putIntervalBetweenLabelsRule"] = prot.putIntervalBetweenLabelsRule;
    prot["putIntervalBetweenLabels"] = prot.putIntervalBetweenLabels;
    prot["putInvertCatOrder"] = prot.putInvertCatOrder;
    prot["putLabelsAxisDistance"] = prot.putLabelsAxisDistance;
    prot["putMajorTickMark"] = prot.putMajorTickMark;
    prot["putMinorTickMark"] = prot.putMinorTickMark;
    prot["putTickLabelsPos"] = prot.putTickLabelsPos;
    prot["putCrossesRule"] = prot.putCrossesRule;
    prot["putCrosses"] = prot.putCrosses;
    prot["putAxisType"] = prot.putAxisType;
    prot["putLabelsPosition"] = prot.putLabelsPosition;
    prot["getIntervalBetweenTick"] = prot.getIntervalBetweenTick;
    prot["getIntervalBetweenLabelsRule"] = prot.getIntervalBetweenLabelsRule;
    prot["getIntervalBetweenLabels"] = prot.getIntervalBetweenLabels;
    prot["getInvertCatOrder"] = prot.getInvertCatOrder;
    prot["getLabelsAxisDistance"] = prot.getLabelsAxisDistance;
    prot["getMajorTickMark"] = prot.getMajorTickMark;
    prot["getMinorTickMark"] = prot.getMinorTickMark;
    prot["getTickLabelsPos"] = prot.getTickLabelsPos;
    prot["getCrossesRule"] = prot.getCrossesRule;
    prot["getCrosses"] = prot.getCrosses;
    prot["getAxisType"] = prot.getAxisType;
    prot["getLabelsPosition"] = prot.getLabelsPosition;
    prot["setDefault"] = prot.setDefault;
    window["asc_CatAxisSettings"] = asc_CatAxisSettings;
    function asc_CRect(x, y, width, height) {
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
    }
    asc_CRect.prototype = {
        asc_getX: function () {
            return this._x;
        },
        asc_getY: function () {
            return this._y;
        },
        asc_getWidth: function () {
            return this._width;
        },
        asc_getHeight: function () {
            return this._height;
        }
    };
    window["asc_CRect"] = asc_CRect;
    prot = asc_CRect.prototype;
    prot["asc_getX"] = prot.asc_getX;
    prot["asc_getY"] = prot.asc_getY;
    prot["asc_getWidth"] = prot.asc_getWidth;
    prot["asc_getHeight"] = prot.asc_getHeight;
    function generateColor() {
        var h = (Math.random() * 361) >> 0;
        var s = 25 + ((Math.random() * 26) >> 0);
        return asc.hsvToRgb(h, s, 100);
    }
    function hsvToRgb(h, s, v) {
        var r, g, b;
        var i;
        var f, p, q, t;
        s /= 100;
        v /= 100;
        if (0 === s) {
            r = g = b = ((v * 255) >> 0) & 255;
            return (r << 16) + (g << 8) + b;
        }
        h /= 60;
        i = h >> 0;
        f = h - i;
        p = v * (1 - s);
        q = v * (1 - s * f);
        t = v * (1 - s * (1 - f));
        switch (i) {
        case 0:
            r = v;
            g = t;
            b = p;
            break;
        case 1:
            r = q;
            g = v;
            b = p;
            break;
        case 2:
            r = p;
            g = v;
            b = t;
            break;
        case 3:
            r = p;
            g = q;
            b = v;
            break;
        case 4:
            r = t;
            g = p;
            b = v;
            break;
        default:
            r = v;
            g = p;
            b = q;
            break;
        }
        r = ((r * 255) >> 0) & 255;
        g = ((g * 255) >> 0) & 255;
        b = ((b * 255) >> 0) & 255;
        return (r << 16) + (g << 8) + b;
    }
    window["Asc"].generateColor = generateColor;
    window["Asc"].hsvToRgb = hsvToRgb;
})(window);
var CColor = window["CColor"];
var asc_ChartSettings = window["asc_ChartSettings"];
var asc_ValAxisSettings = window["asc_ValAxisSettings"];
var asc_CatAxisSettings = window["asc_CatAxisSettings"];
var g_oArrUserColors = [15064320, 58807, 16724950, 1759488, 9981439, 56805, 15050496, 15224319, 10154496, 16731553, 62146, 47077, 1828096, 15859712, 15427327, 15919360, 15905024, 59890, 12733951, 13496832, 62072, 49906, 16734720, 10682112, 7890687, 16731610, 65406, 38655, 16747008, 14221056, 16737966, 1896960, 65484, 10970879, 16759296, 16711680, 63231, 16774656, 2031360, 52479, 13330175, 16743219, 3386367, 11927347, 16752947, 9404671, 4980531, 16744678, 3407830, 11960575, 16724787, 10878873, 14745395, 16762931, 15696127, 3397375, 16744636, 3407768, 3406079, 13926655, 15269734, 16751083, 6742271, 16766566, 13107046, 16775219, 16751718, 10852863, 6750176, 16737894, 14457343, 16759142, 6750130, 6865407, 15650047, 16769945, 7929702, 16751049, 6748927, 16751001, 12884479, 16775782, 16765081, 10087423, 10878873, 16757744, 10081791, 14352281, 15053823, 10092523, 16760217, 15728537, 13815039, 16776652, 16757719, 13432319, 16773580, 13828044, 15650047, 15893248, 16724883, 58737, 15007744, 36594, 12772608, 12137471, 6442495, 9561344, 15021055, 34789, 15039488, 44761, 16718470, 14274816, 11606783, 9099520, 53721, 16718545, 1625088, 15881472, 13419776, 50636, 14752511, 55659, 14261760, 32985, 11389952, 16711800, 8571904, 1490688, 16711884, 8991743, 13407488, 41932, 11010303, 7978752, 15028480, 52387, 15007927, 52325, 47295, 14549247, 12552960, 12564480, 39359, 15007852, 12114176, 1421824, 55726, 13041893, 10665728, 30924, 49049, 14251264, 48990, 14241024, 36530, 11709440, 13369507, 44210, 11698688, 7451136, 13397504, 45710, 34214];
function CAscMathType() {
    this.Id = 0;
    this.X = 0;
    this.Y = 0;
}
CAscMathType.prototype["get_Id"] = function () {
    return this.Id;
};
CAscMathType.prototype["get_X"] = function () {
    return this.X;
};
CAscMathType.prototype["get_Y"] = function () {
    return this.Y;
};
function CAscMathCategory() {
    this.Id = 0;
    this.Data = [];
    this.W = 0;
    this.H = 0;
}
CAscMathCategory.prototype["get_Id"] = function () {
    return this.Id;
};
CAscMathCategory.prototype["get_Data"] = function () {
    return this.Data;
};
CAscMathCategory.prototype["get_W"] = function () {
    return this.W;
};
CAscMathCategory.prototype["get_H"] = function () {
    return this.H;
};
CAscMathCategory.prototype.private_Sort = function () {
    this.Data.sort(function (a, b) {
        return a.Id - b.Id;
    });
};