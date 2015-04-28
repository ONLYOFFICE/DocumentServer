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
function ChartPreviewManager() {
    this.previewGroups = [];
    this.chartsByTypes = [];
    this.CHART_PREVIEW_WIDTH_PIX = 50;
    this.CHART_PREVIEW_HEIGHT_PIX = 50;
    this._canvas_charts = null;
}
ChartPreviewManager.prototype.getAscChartSeriesDefault = function (type) {
    function createItem(value) {
        return {
            numFormatStr: "General",
            isDateTimeFormat: false,
            val: value,
            isHidden: false
        };
    }
    var series = [],
    ser;
    switch (type) {
    case c_oAscChartTypeSettings.lineNormal:
        ser = new asc_CChartSeria();
        ser.Val.NumCache = [createItem(2), createItem(3), createItem(2), createItem(3)];
        series.push(ser);
        ser = new asc_CChartSeria();
        ser.Val.NumCache = [createItem(1), createItem(2), createItem(3), createItem(2)];
        series.push(ser);
        break;
    case c_oAscChartTypeSettings.lineStacked:
        ser = new asc_CChartSeria();
        ser.Val.NumCache = [createItem(1), createItem(6), createItem(2), createItem(8)];
        series.push(ser);
        ser = new asc_CChartSeria();
        ser.Val.NumCache = [createItem(4), createItem(4), createItem(4), createItem(5)];
        series.push(ser);
        break;
    case c_oAscChartTypeSettings.lineStackedPer:
        ser = new asc_CChartSeria();
        ser.Val.NumCache = [createItem(2), createItem(4), createItem(2), createItem(4)];
        series.push(ser);
        ser = new asc_CChartSeria();
        ser.Val.NumCache = [createItem(2), createItem(2), createItem(2), createItem(2)];
        series.push(ser);
        break;
    case c_oAscChartTypeSettings.hBarNormal:
        ser = new asc_CChartSeria();
        ser.Val.NumCache = [createItem(4)];
        series.push(ser);
        ser = new asc_CChartSeria();
        ser.Val.NumCache = [createItem(3)];
        series.push(ser);
        ser = new asc_CChartSeria();
        ser.Val.NumCache = [createItem(2)];
        series.push(ser);
        ser = new asc_CChartSeria();
        ser.Val.NumCache = [createItem(1)];
        series.push(ser);
        break;
    case c_oAscChartTypeSettings.hBarStacked:
        ser = new asc_CChartSeria();
        ser.Val.NumCache = [createItem(4), createItem(3), createItem(2), createItem(1)];
        series.push(ser);
        ser = new asc_CChartSeria();
        ser.Val.NumCache = [createItem(5), createItem(4), createItem(3), createItem(2)];
        series.push(ser);
        break;
    case c_oAscChartTypeSettings.hBarStackedPer:
        ser = new asc_CChartSeria();
        ser.Val.NumCache = [createItem(7), createItem(5), createItem(3), createItem(1)];
        series.push(ser);
        ser = new asc_CChartSeria();
        ser.Val.NumCache = [createItem(7), createItem(6), createItem(5), createItem(4)];
        series.push(ser);
        break;
    case c_oAscChartTypeSettings.barNormal:
        ser = new asc_CChartSeria();
        ser.Val.NumCache = [createItem(1)];
        series.push(ser);
        ser = new asc_CChartSeria();
        ser.Val.NumCache = [createItem(2)];
        series.push(ser);
        ser = new asc_CChartSeria();
        ser.Val.NumCache = [createItem(3)];
        series.push(ser);
        ser = new asc_CChartSeria();
        ser.Val.NumCache = [createItem(4)];
        series.push(ser);
        break;
    case c_oAscChartTypeSettings.barStacked:
        ser = new asc_CChartSeria();
        ser.Val.NumCache = [createItem(1), createItem(2), createItem(3), createItem(4)];
        series.push(ser);
        ser = new asc_CChartSeria();
        ser.Val.NumCache = [createItem(2), createItem(3), createItem(4), createItem(5)];
        series.push(ser);
        break;
    case c_oAscChartTypeSettings.barStackedPer:
        ser = new asc_CChartSeria();
        ser.Val.NumCache = [createItem(1), createItem(3), createItem(5), createItem(7)];
        series.push(ser);
        ser = new asc_CChartSeria();
        ser.Val.NumCache = [createItem(4), createItem(5), createItem(6), createItem(7)];
        series.push(ser);
        break;
    case c_oAscChartTypeSettings.pie:
        case c_oAscChartTypeSettings.doughnut:
        ser = new asc_CChartSeria();
        ser.Val.NumCache = [createItem(3), createItem(1)];
        series.push(ser);
        break;
    case c_oAscChartTypeSettings.areaNormal:
        ser = new asc_CChartSeria();
        ser.Val.NumCache = [createItem(0), createItem(8), createItem(5), createItem(6)];
        series.push(ser);
        ser = new asc_CChartSeria();
        ser.Val.NumCache = [createItem(0), createItem(4), createItem(2), createItem(9)];
        series.push(ser);
        break;
    case c_oAscChartTypeSettings.areaStacked:
        ser = new asc_CChartSeria();
        ser.Val.NumCache = [createItem(0), createItem(8), createItem(5), createItem(11)];
        series.push(ser);
        ser = new asc_CChartSeria();
        ser.Val.NumCache = [createItem(4), createItem(4), createItem(4), createItem(4)];
        series.push(ser);
        break;
    case c_oAscChartTypeSettings.areaStackedPer:
        ser = new asc_CChartSeria();
        ser.Val.NumCache = [createItem(0), createItem(4), createItem(1), createItem(16)];
        series.push(ser);
        ser = new asc_CChartSeria();
        ser.Val.NumCache = [createItem(4), createItem(4), createItem(4), createItem(4)];
        series.push(ser);
        break;
    case c_oAscChartTypeSettings.scatter:
        ser = new asc_CChartSeria();
        ser.Val.NumCache = [createItem(1), createItem(5)];
        series.push(ser);
        ser = new asc_CChartSeria();
        ser.Val.NumCache = [createItem(2), createItem(6)];
        series.push(ser);
        break;
    default:
        ser = new asc_CChartSeria();
        ser.Val.NumCache = [createItem(3), createItem(5), createItem(7)];
        series.push(ser);
        ser = new asc_CChartSeria();
        ser.Val.NumCache = [createItem(10), createItem(12), createItem(14)];
        series.push(ser);
        ser = new asc_CChartSeria();
        ser.Val.NumCache = [createItem(1), createItem(3), createItem(5)];
        series.push(ser);
        ser = new asc_CChartSeria();
        ser.Val.NumCache = [createItem(8), createItem(10), createItem(12)];
        series.push(ser);
        break;
    }
    return series;
};
ChartPreviewManager.prototype.getChartByType = function (type) {
    return ExecuteNoHistory(function () {
        var settings = new asc_ChartSettings();
        settings.type = type;
        var chartSeries = {
            series: this.getAscChartSeriesDefault(type),
            parsedHeaders: {
                bLeft: true,
                bTop: true
            }
        };
        var chart_space = DrawingObjectsController.prototype._getChartSpace(chartSeries, settings, true);
        chart_space.bPreview = true;
        if (window["Asc"]["editor"]) {
            var api_sheet = window["Asc"]["editor"];
            chart_space.setWorksheet(api_sheet.wb.getWorksheet().model);
        } else {
            if (editor && editor.WordControl && editor.WordControl.m_oLogicDocument.Slides && editor.WordControl.m_oLogicDocument.Slides[editor.WordControl.m_oLogicDocument.CurPage]) {
                chart_space.setParent(editor.WordControl.m_oLogicDocument.Slides[editor.WordControl.m_oLogicDocument.CurPage]);
            }
        }
        CheckSpPrXfrm(chart_space);
        chart_space.spPr.xfrm.setOffX(0);
        chart_space.spPr.xfrm.setOffY(0);
        chart_space.spPr.xfrm.setExtX(50);
        chart_space.spPr.xfrm.setExtY(50);
        settings.putTitle(c_oAscChartTitleShowSettings.none);
        settings.putHorAxisLabel(c_oAscChartTitleShowSettings.none);
        settings.putVertAxisLabel(c_oAscChartTitleShowSettings.none);
        settings.putLegendPos(c_oAscChartLegendShowSettings.none);
        settings.putHorGridLines(c_oAscGridLinesSettings.none);
        settings.putVertGridLines(c_oAscGridLinesSettings.none);
        var val_ax_props = new asc_ValAxisSettings();
        val_ax_props.putMinValRule(c_oAscValAxisRule.auto);
        val_ax_props.putMaxValRule(c_oAscValAxisRule.auto);
        val_ax_props.putTickLabelsPos(c_oAscTickLabelsPos.TICK_LABEL_POSITION_NONE);
        val_ax_props.putInvertValOrder(false);
        val_ax_props.putDispUnitsRule(c_oAscValAxUnits.none);
        val_ax_props.putMajorTickMark(c_oAscTickMark.TICK_MARK_NONE);
        val_ax_props.putMinorTickMark(c_oAscTickMark.TICK_MARK_NONE);
        val_ax_props.putCrossesRule(c_oAscCrossesRule.auto);
        var cat_ax_props = new asc_CatAxisSettings();
        cat_ax_props.putIntervalBetweenLabelsRule(c_oAscBetweenLabelsRule.auto);
        cat_ax_props.putLabelsPosition(c_oAscLabelsPosition.betweenDivisions);
        cat_ax_props.putTickLabelsPos(c_oAscTickLabelsPos.TICK_LABEL_POSITION_NONE);
        cat_ax_props.putLabelsAxisDistance(100);
        cat_ax_props.putMajorTickMark(c_oAscTickMark.TICK_MARK_NONE);
        cat_ax_props.putMinorTickMark(c_oAscTickMark.TICK_MARK_NONE);
        cat_ax_props.putIntervalBetweenTick(1);
        cat_ax_props.putCrossesRule(c_oAscCrossesRule.auto);
        var vert_axis_settings, hor_axis_settings, isScatter;
        switch (type) {
        case c_oAscChartTypeSettings.hBarNormal:
            case c_oAscChartTypeSettings.hBarStacked:
            case c_oAscChartTypeSettings.hBarStackedPer:
            vert_axis_settings = cat_ax_props;
            hor_axis_settings = val_ax_props;
            break;
        case c_oAscChartTypeSettings.scatter:
            case c_oAscChartTypeSettings.scatterLine:
            case c_oAscChartTypeSettings.scatterLineMarker:
            case c_oAscChartTypeSettings.scatterMarker:
            case c_oAscChartTypeSettings.scatterNone:
            case c_oAscChartTypeSettings.scatterSmooth:
            case c_oAscChartTypeSettings.scatterSmoothMarker:
            vert_axis_settings = val_ax_props;
            hor_axis_settings = val_ax_props;
            isScatter = true;
            settings.showMarker = true;
            settings.smooth = false;
            settings.bLine = false;
            break;
        case c_oAscChartTypeSettings.areaNormal:
            case c_oAscChartTypeSettings.areaStacked:
            case c_oAscChartTypeSettings.areaStackedPer:
            cat_ax_props.putLabelsPosition(CROSS_BETWEEN_BETWEEN);
            vert_axis_settings = val_ax_props;
            hor_axis_settings = cat_ax_props;
            break;
        default:
            vert_axis_settings = val_ax_props;
            hor_axis_settings = cat_ax_props;
            break;
        }
        settings.putVertAxisProps(vert_axis_settings);
        settings.putHorAxisProps(hor_axis_settings);
        DrawingObjectsController.prototype.applyPropsToChartSpace(settings, chart_space);
        chart_space.setBDeleted(false);
        chart_space.updateLinks();
        if (! (isScatter || type === c_oAscChartTypeSettings.stock)) {
            if (chart_space.chart.plotArea.valAx) {
                chart_space.chart.plotArea.valAx.setDelete(true);
            }
            if (chart_space.chart.plotArea.catAx) {
                chart_space.chart.plotArea.catAx.setDelete(true);
            }
        } else {
            if (chart_space.chart.plotArea.valAx) {
                chart_space.chart.plotArea.valAx.setTickLblPos(TICK_LABEL_POSITION_NONE);
                chart_space.chart.plotArea.valAx.setMajorTickMark(TICK_MARK_NONE);
                chart_space.chart.plotArea.valAx.setMinorTickMark(TICK_MARK_NONE);
            }
            if (chart_space.chart.plotArea.catAx) {
                chart_space.chart.plotArea.catAx.setTickLblPos(TICK_LABEL_POSITION_NONE);
                chart_space.chart.plotArea.catAx.setMajorTickMark(TICK_MARK_NONE);
                chart_space.chart.plotArea.catAx.setMinorTickMark(TICK_MARK_NONE);
            }
        }
        if (!chart_space.spPr) {
            chart_space.setSpPr(new CSpPr());
        }
        var new_line = new CLn();
        new_line.setFill(new CUniFill());
        new_line.Fill.setFill(new CNoFill());
        chart_space.spPr.setLn(new_line);
        chart_space.recalcInfo.recalculateReferences = false;
        chart_space.recalculate();
        return chart_space;
    },
    this, []);
};
ChartPreviewManager.prototype.clearPreviews = function () {
    this.previewGroups.length = 0;
};
ChartPreviewManager.prototype.createChartPreview = function (type, styleIndex) {
    return ExecuteNoHistory(function () {
        if (!this.chartsByTypes[type]) {
            this.chartsByTypes[type] = this.getChartByType(type);
        }
        var chart_space = this.chartsByTypes[type];
        if (chart_space.style !== styleIndex) {
            chart_space.style = styleIndex;
            chart_space.recalculateMarkers();
            chart_space.recalculateSeriesColors();
            chart_space.recalculatePlotAreaChartBrush();
            chart_space.recalculatePlotAreaChartPen();
            chart_space.recalculateChartBrush();
            chart_space.recalculateChartPen();
            chart_space.recalculateUpDownBars();
        }
        chart_space.recalculatePenBrush();
        if (null === this._canvas_charts) {
            this._canvas_charts = document.createElement("canvas");
            this._canvas_charts.width = this.CHART_PREVIEW_WIDTH_PIX;
            this._canvas_charts.height = this.CHART_PREVIEW_HEIGHT_PIX;
            if (AscBrowser.isRetina) {
                this._canvas_charts.width <<= 1;
                this._canvas_charts.height <<= 1;
            }
        }
        var _canvas = this._canvas_charts;
        var ctx = _canvas.getContext("2d");
        var graphics = new CGraphics();
        graphics.init(ctx, _canvas.width, _canvas.height, 50, 50);
        graphics.m_oFontManager = g_fontManager;
        graphics.transform(1, 0, 0, 1, 0, 0);
        chart_space.draw(graphics);
        return _canvas.toDataURL("image/png");
    },
    this, []);
};
ChartPreviewManager.prototype.getChartPreviews = function (chartType) {
    if (isRealNumber(chartType)) {
        if (!this.previewGroups.hasOwnProperty(chartType)) {
            this.previewGroups[chartType] = [];
            var arr = this.previewGroups[chartType];
            for (var i = 1; i < 49; ++i) {
                arr.push(this.createChartPreview(chartType, i));
            }
        }
        var group = this.previewGroups[chartType];
        var objectGroup = [];
        for (var style = 0; style < group.length; ++style) {
            var chartStyle = new asc_CChartStyle();
            chartStyle.asc_setStyle(style + 1);
            chartStyle.asc_setImageUrl(group[style]);
            objectGroup.push(chartStyle);
        }
        return objectGroup;
    } else {
        return null;
    }
};
function arrReverse(arr) {
    if (!arr || !arr.length) {
        return;
    }
    var newarr = [];
    for (var i = 0; i < arr[0].length; ++i) {
        newarr[i] = [];
        for (var j = 0; j < arr.length; ++j) {
            newarr[i][j] = arr[j][i];
        }
    }
    return newarr;
}