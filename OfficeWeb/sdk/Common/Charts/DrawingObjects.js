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
 if (!window["Asc"]) {
    window["Asc"] = {};
}
function isObject(what) {
    return ((what != null) && (typeof(what) == "object"));
}
function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
function isNullOrEmptyString(str) {
    return (str == undefined) || (str == null) || (str == "");
}
function convertFormula(formula, ws) {
    var range = null;
    if (formula && ws) {
        var ref3D = parserHelp.is3DRef(formula, 0);
        if (!ref3D[0]) {
            range = ws.model.getRange2(formula.toUpperCase());
        } else {
            var resultRef = parserHelp.parse3DRef(formula);
            if (null !== resultRef) {
                var ws = ws.model.workbook.getWorksheetByName(resultRef.sheet);
                if (ws) {
                    range = ws.getRange2(resultRef.range);
                }
            }
        }
    }
    return range;
}
function getFullImageSrc(src) {
    var start = src.substring(0, 6);
    if (0 != src.indexOf("http:") && 0 != src.indexOf("data:") && 0 != src.indexOf("https:") && 0 != src.indexOf("ftp:") && 0 != src.indexOf("file:")) {
        var api = window["Asc"]["editor"];
        if (0 == src.indexOf(g_sResourceServiceLocalUrl + api.documentId)) {
            return src;
        }
        return g_sResourceServiceLocalUrl + api.documentId + "/media/" + src;
    } else {
        return src;
    }
}
function getCurrentTime() {
    var currDate = new Date();
    return currDate.getTime();
}
function asc_CChartStyle() {
    this.style = null;
    this.imageUrl = null;
}
asc_CChartStyle.prototype = {
    asc_getStyle: function () {
        return this.style;
    },
    asc_setStyle: function (style) {
        this.style = style;
    },
    asc_getImageUrl: function () {
        return this.imageUrl;
    },
    asc_setImageUrl: function (imageUrl) {
        this.imageUrl = imageUrl;
    }
};
window["Asc"].asc_CChartStyle = asc_CChartStyle;
window["Asc"]["asc_CChartStyle"] = asc_CChartStyle;
prot = asc_CChartStyle.prototype;
prot["asc_getStyle"] = prot.asc_getStyle;
prot["asc_setStyle"] = prot.asc_setStyle;
prot["asc_getImageUrl"] = prot.asc_getImageUrl;
prot["asc_setImageUrl"] = prot.asc_setImageUrl;
function asc_CChartTranslate() {
    this.title = "Diagram Title";
    this.xAxis = "X Axis";
    this.yAxis = "Y Axis";
    this.series = "Series";
}
asc_CChartTranslate.prototype = {
    asc_getTitle: function () {
        return this.title;
    },
    asc_setTitle: function (val) {
        this.title = val;
    },
    asc_getXAxis: function () {
        return this.xAxis;
    },
    asc_setXAxis: function (val) {
        this.xAxis = val;
    },
    asc_getYAxis: function () {
        return this.yAxis;
    },
    asc_setYAxis: function (val) {
        this.yAxis = val;
    },
    asc_getSeries: function () {
        return this.series;
    },
    asc_setSeries: function (val) {
        this.series = val;
    }
};
window["Asc"].asc_CChartTranslate = asc_CChartTranslate;
window["Asc"]["asc_CChartTranslate"] = asc_CChartTranslate;
prot = asc_CChartTranslate.prototype;
prot["asc_getTitle"] = prot.asc_getTitle;
prot["asc_setTitle"] = prot.asc_setTitle;
prot["asc_getXAxis"] = prot.asc_getXAxis;
prot["asc_setXAxis"] = prot.asc_setXAxis;
prot["asc_getYAxis"] = prot.asc_getYAxis;
prot["asc_setYAxis"] = prot.asc_setYAxis;
prot["asc_getSeries"] = prot.asc_getSeries;
prot["asc_setSeries"] = prot.asc_setSeries;
function asc_CChart(object) {
    var bCopy = isObject(object);
    this.worksheet = bCopy ? object.worksheet : null;
    this.type = bCopy ? object.type : null;
    this.subType = bCopy ? object.subType : c_oAscChartSubType.normal;
    this.bChartEditor = bCopy ? object.bChartEditor : false;
    this.bShowValue = bCopy ? object.bShowValue : false;
    this.bShowCatName = bCopy ? object.bShowCatName : false;
    this.bShowBorder = bCopy ? object.bShowBorder : true;
    this.styleId = bCopy ? object.styleId : c_oAscChartStyle.Standart;
    this.header = bCopy ? new asc_CChartHeader(object.header) : new asc_CChartHeader();
    this.range = bCopy ? new asc_CChartRange(object.range) : new asc_CChartRange();
    this.xAxis = bCopy ? new asc_CChartAxisX(object.xAxis) : new asc_CChartAxisX();
    this.yAxis = bCopy ? new asc_CChartAxisY(object.yAxis) : new asc_CChartAxisY();
    this.legend = bCopy ? new asc_CChartLegend(object.legend) : new asc_CChartLegend();
    this.series = [];
    if (bCopy && object.series) {
        for (var i = 0; i < object.series.length; i++) {
            var ser = new asc_CChartSeria();
            ser.asc_setTitle(object.series[i].TxCache.Tx);
            ser.asc_setTitleFormula(object.series[i].TxCache.Formula);
            if (object.series[i].Val) {
                ser.asc_setValFormula(object.series[i].Val.Formula);
                for (var j = 0; j < object.series[i].Val.NumCache.length; j++) {
                    var item = {};
                    item.numFormatStr = object.series[i].Val.NumCache[j].numFormatStr;
                    item.isDateTimeFormat = object.series[i].Val.NumCache[j].isDateTimeFormat;
                    item.val = object.series[i].Val.NumCache[j].val;
                    item.isHidden = object.series[i].Val.NumCache[j].isHidden;
                    ser.Val.NumCache.push(item);
                }
            }
            if (object.series[i].xVal) {
                ser.asc_setxValFormula(object.series[i].xVal.Formula);
                for (var j = 0; j < object.series[i].xVal.NumCache.length; j++) {
                    var item = {};
                    item.numFormatStr = object.series[i].xVal.NumCache[j].numFormatStr;
                    item.isDateTimeFormat = object.series[i].xVal.NumCache[j].isDateTimeFormat;
                    item.val = object.series[i].xVal.NumCache[j].val;
                    item.isHidden = object.series[i].xVal.NumCache[j].isHidden;
                    ser.xVal.NumCache.push(item);
                }
            }
            if (object.series[i].Cat) {
                ser.asc_setCatFormula(object.series[i].Cat.Formula);
                for (var j = 0; j < object.series[i].Cat.NumCache.length; j++) {
                    var item = {};
                    item.numFormatStr = object.series[i].Cat.NumCache[j].numFormatStr;
                    item.isDateTimeFormat = object.series[i].Cat.NumCache[j].isDateTimeFormat;
                    item.val = object.series[i].Cat.NumCache[j].val;
                    item.isHidden = object.series[i].Cat.NumCache[j].isHidden;
                    ser.Cat.NumCache.push(item);
                }
            }
            if (object.series[i].Marker) {
                ser.asc_setMarkerSize(object.series[i].Marker.Size);
                ser.asc_setMarkerSymbol(object.series[i].Marker.Symbol);
            }
            ser.asc_setOutlineColor(object.series[i].OutlineColor);
            ser.asc_setFormatCode(object.series[i].FormatCode);
            this.series.push(ser);
        }
    }
    this.themeColors = [];
    if (bCopy && object.themeColors) {
        for (var i = 0; i < object.themeColors.length; i++) {
            this.themeColors.push(object.themeColors[i]);
        }
    }
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}
asc_CChart.prototype = {
    isEqual: function (chart) {
        return (this.type == chart.type && this.subType == chart.subType && this.styleId == chart.styleId && this.bShowValue == chart.bShowValue && this.bShowBorder == chart.bShowBorder && this.header.isEqual(chart.header) && this.range.isEqual(chart.range) && this.xAxis.isEqual(chart.xAxis) && this.yAxis.isEqual(chart.yAxis) && this.legend.isEqual(chart.legend) && this.series.length == chart.series.length);
    },
    asc_getType: function () {
        return this.type;
    },
    asc_setType: function (type) {
        this.type = type;
    },
    asc_getSubType: function () {
        return this.subType;
    },
    asc_setSubType: function (subType) {
        this.subType = subType;
    },
    asc_getStyleId: function () {
        return this.styleId;
    },
    asc_setStyleId: function (styleId) {
        this.styleId = styleId;
    },
    asc_getShowValueFlag: function () {
        return this.bShowValue;
    },
    asc_setShowValueFlag: function (show) {
        this.bShowValue = show;
    },
    asc_getShowCatNameFlag: function () {
        return this.bShowCatName;
    },
    asc_setShowCatNameFlag: function (show) {
        this.bShowCatName = show;
    },
    asc_getShowBorderFlag: function () {
        return this.bShowBorder;
    },
    asc_setShowBorderFlag: function (show) {
        this.bShowBorder = show;
    },
    asc_getHeader: function () {
        return this.header;
    },
    asc_setHeader: function (headerObj) {
        this.header = headerObj;
    },
    asc_getRange: function () {
        return this.range;
    },
    asc_setRange: function (rangeObj) {
        this.range = rangeObj;
    },
    asc_getXAxis: function () {
        return this.xAxis;
    },
    asc_setXAxis: function (axisObj) {
        this.xAxis = axisObj;
    },
    asc_getYAxis: function () {
        return this.yAxis;
    },
    asc_setYAxis: function (axisObj) {
        this.yAxis = axisObj;
    },
    asc_getLegend: function () {
        return this.legend;
    },
    asc_setLegend: function (legendObj) {
        this.legend = legendObj;
    },
    asc_getSeria: function (index) {
        return (index < this.series.length) ? this.series[index] : null;
    },
    asc_setSeria: function (seriaObj) {
        if (seriaObj) {
            this.series.push(seriaObj);
        }
    },
    asc_removeSeries: function () {
        this.series = [];
    },
    initDefault: function () {
        function createItem(value) {
            return {
                numFormatStr: "General",
                isDateTimeFormat: false,
                val: value,
                isHidden: false
            };
        }
        var api_doc = window["editor"];
        var api_sheet = window["Asc"]["editor"];
        var api = api_sheet ? api_sheet : api_doc;
        this.bChartEditor = true;
        this.header.title = "2012 Olympics Medal Standings";
        this.range.interval = "Sheet1!A1:D7";
        var Cat = {
            Formula: "Sheet1!A2:A7",
            NumCache: [createItem("USA"), createItem("CHN"), createItem("RUS"), createItem("GBR"), createItem("GER"), createItem("JPN")]
        };
        this.xAxis.title = "Countries";
        this.yAxis.title = "Medals";
        this.series = [];
        var uniColors = this.generateUniColors(3);
        var seria = new asc_CChartSeria();
        seria.Val.Formula = "Sheet1!B2:B7";
        seria.Val.NumCache = [createItem(46), createItem(38), createItem(24), createItem(29), createItem(11), createItem(7)];
        seria.OutlineColor = uniColors[0];
        seria.TxCache.Formula = "Sheet1!B1";
        seria.TxCache.Tx = "Gold";
        if (this.type != c_oAscChartType.scatter) {
            seria.Cat = Cat;
        } else {
            seria.xVal = Cat;
        }
        this.series.push(seria);
        seria = new asc_CChartSeria();
        seria.Val.Formula = "Sheet1!C2:C7";
        seria.Val.NumCache = [createItem(29), createItem(27), createItem(26), createItem(17), createItem(19), createItem(14)];
        seria.OutlineColor = uniColors[1];
        seria.TxCache.Formula = "Sheet1!C1";
        seria.TxCache.Tx = "Silver";
        if (this.type != c_oAscChartType.scatter) {
            seria.Cat = Cat;
        } else {
            seria.xVal = Cat;
        }
        this.series.push(seria);
        seria = new asc_CChartSeria();
        seria.Val.Formula = "Sheet1!D2:D7";
        seria.Val.NumCache = [createItem(29), createItem(23), createItem(32), createItem(19), createItem(14), createItem(17)];
        seria.OutlineColor = uniColors[2];
        seria.TxCache.Formula = "Sheet1!D1";
        seria.TxCache.Tx = "Bronze";
        if (this.type != c_oAscChartType.scatter) {
            seria.Cat = Cat;
        } else {
            seria.xVal = Cat;
        }
        this.series.push(seria);
    },
    parseSeriesHeaders: function () {
        var cntLeft = 0,
        cntTop = 0;
        var headers = {
            bLeft: false,
            bTop: false
        };
        var _t = this;
        var bbox = _t.range.intervalObject.getBBox0();
        if (bbox.c2 - bbox.c1 > 0) {
            for (var i = bbox.r1 + 1; i <= bbox.r2; i++) {
                var cell = _t.range.intervalObject.worksheet.getCell(new CellAddress(i, bbox.c1, 0));
                var value = cell.getValue();
                if (!isNumber(value) && (value != "")) {
                    cntLeft++;
                }
            }
            if ((cntLeft > 0) && (cntLeft >= bbox.r2 - bbox.r1)) {
                headers.bLeft = true;
            }
        }
        if (bbox.r2 - bbox.r1 > 0) {
            for (var i = bbox.c1 + 1; i <= bbox.c2; i++) {
                var cell = _t.range.intervalObject.worksheet.getCell(new CellAddress(bbox.r1, i, 0));
                var value = cell.getValue();
                if (!isNumber(value) && (value != "")) {
                    cntTop++;
                }
            }
            if ((cntTop > 0) && (cntTop >= bbox.c2 - bbox.c1)) {
                headers.bTop = true;
            }
        }
        return headers;
    },
    rebuildSeries: function (isIgnoreColors) {
        var _t = this;
        var bbox = _t.range.intervalObject.getBBox0();
        var nameIndex = 1;
        var api = window["Asc"]["editor"];
        var oldSeriaData = [];
        for (var i = 0; ! isIgnoreColors && (i < _t.series.length); i++) {
            if (_t.series[i].OutlineColor && !_t.series[i].OutlineColor.isCustom) {
                oldSeriaData[i] = _t.series[i].OutlineColor;
            }
        }
        _t.series = [];
        function getNumCache(c1, c2, r1, r2) {
            var cache = [];
            if (c1 == c2) {
                for (var row = r1; row <= r2; row++) {
                    var cell = _t.range.intervalObject.worksheet.getCell(new CellAddress(row, c1, 0));
                    var item = {};
                    item.numFormatStr = cell.getNumFormatStr();
                    item.isDateTimeFormat = cell.getNumFormat().isDateTimeFormat();
                    item.val = cell.getValue();
                    item.isHidden = (_t.range.intervalObject.worksheet._getCol(c1).hd === true) || (_t.range.intervalObject.worksheet._getRow(row).hd === true);
                    cache.push(item);
                }
            } else {
                for (var col = c1; col <= c2; col++) {
                    var cell = _t.range.intervalObject.worksheet.getCell(new CellAddress(r1, col, 0));
                    var item = {};
                    item.numFormatStr = cell.getNumFormatStr();
                    item.isDateTimeFormat = cell.getNumFormat().isDateTimeFormat();
                    item.val = cell.getValue();
                    item.isHidden = (_t.range.intervalObject.worksheet._getCol(col).hd === true) || (_t.range.intervalObject.worksheet._getRow(r1).hd === true);
                    cache.push(item);
                }
            }
            return cache;
        }
        var parsedHeaders = _t.parseSeriesHeaders();
        if (_t.range.rows) {
            for (var i = bbox.r1 + (parsedHeaders.bTop ? 1 : 0); i <= bbox.r2; i++) {
                var ser = new asc_CChartSeria();
                var startCell = new CellAddress(i, bbox.c1 + (parsedHeaders.bLeft ? 1 : 0), 0);
                var endCell = new CellAddress(i, bbox.c2, 0);
                if (_t.range.intervalObject.worksheet._getRow(i).hd === true) {
                    ser.isHidden = true;
                }
                if (startCell && endCell) {
                    if (startCell.getID() == endCell.getID()) {
                        ser.Val.Formula = startCell.getID();
                    } else {
                        ser.Val.Formula = (!rx_test_ws_name.test(_t.range.intervalObject.worksheet.sName) ? "'" + _t.range.intervalObject.worksheet.sName + "'" : _t.range.intervalObject.worksheet.sName) + "!" + startCell.getID() + ":" + endCell.getID();
                    }
                }
                ser.Val.NumCache = getNumCache(bbox.c1 + (parsedHeaders.bLeft ? 1 : 0), bbox.c2, i, i);
                if (parsedHeaders.bTop) {
                    var start = new CellAddress(bbox.r1, bbox.c1 + (parsedHeaders.bLeft ? 1 : 0), 0);
                    var end = new CellAddress(bbox.r1, bbox.c2, 0);
                    var formula = (!rx_test_ws_name.test(_t.range.intervalObject.worksheet.sName) ? "'" + _t.range.intervalObject.worksheet.sName + "'" : _t.range.intervalObject.worksheet.sName) + "!" + start.getID() + ":" + end.getID();
                    var numCache = getNumCache(bbox.c1 + (parsedHeaders.bLeft ? 1 : 0), bbox.c2, bbox.r1, bbox.r1);
                    if (_t.type == c_oAscChartType.scatter) {
                        ser.xVal.Formula = formula;
                        ser.xVal.NumCache = numCache;
                    } else {
                        ser.Cat.Formula = formula;
                        ser.Cat.NumCache = numCache;
                    }
                }
                if (parsedHeaders.bLeft) {
                    var formulaCell = new CellAddress(i, bbox.c1, 0);
                    ser.TxCache.Formula = (!rx_test_ws_name.test(_t.range.intervalObject.worksheet.sName) ? "'" + _t.range.intervalObject.worksheet.sName + "'" : _t.range.intervalObject.worksheet.sName) + "!" + formulaCell.getID();
                }
                var seriaName = parsedHeaders.bLeft ? (_t.range.intervalObject.worksheet.getCell(new CellAddress(i, bbox.c1, 0)).getValue()) : (api.chartTranslate.series + " " + nameIndex);
                ser.TxCache.Tx = seriaName;
                _t.series.push(ser);
                nameIndex++;
            }
        } else {
            for (var i = bbox.c1 + (parsedHeaders.bLeft ? 1 : 0); i <= bbox.c2; i++) {
                var ser = new asc_CChartSeria();
                var startCell = new CellAddress(bbox.r1 + (parsedHeaders.bTop ? 1 : 0), i, 0);
                var endCell = new CellAddress(bbox.r2, i, 0);
                if (_t.range.intervalObject.worksheet._getCol(i).hd === true) {
                    ser.isHidden = true;
                }
                if (startCell && endCell) {
                    if (startCell.getID() == endCell.getID()) {
                        ser.Val.Formula = startCell.getID();
                    } else {
                        ser.Val.Formula = (!rx_test_ws_name.test(_t.range.intervalObject.worksheet.sName) ? "'" + _t.range.intervalObject.worksheet.sName + "'" : _t.range.intervalObject.worksheet.sName) + "!" + startCell.getID() + ":" + endCell.getID();
                    }
                }
                ser.Val.NumCache = getNumCache(i, i, bbox.r1 + (parsedHeaders.bTop ? 1 : 0), bbox.r2);
                if (parsedHeaders.bLeft) {
                    var start = new CellAddress(bbox.r1 + (parsedHeaders.bTop ? 1 : 0), bbox.c1, 0);
                    var end = new CellAddress(bbox.r2, bbox.c1, 0);
                    var formula = (!rx_test_ws_name.test(_t.range.intervalObject.worksheet.sName) ? "'" + _t.range.intervalObject.worksheet.sName + "'" : _t.range.intervalObject.worksheet.sName) + "!" + start.getID() + ":" + end.getID();
                    var numCache = getNumCache(bbox.c1, bbox.c1, bbox.r1 + (parsedHeaders.bTop ? 1 : 0), bbox.r2);
                    if (_t.type == c_oAscChartType.scatter) {
                        ser.xVal.Formula = formula;
                        ser.xVal.NumCache = numCache;
                    } else {
                        ser.Cat.Formula = formula;
                        ser.Cat.NumCache = numCache;
                    }
                }
                if (parsedHeaders.bTop) {
                    var formulaCell = new CellAddress(bbox.r1, i, 0);
                    ser.TxCache.Formula = (!rx_test_ws_name.test(_t.range.intervalObject.worksheet.sName) ? "'" + _t.range.intervalObject.worksheet.sName + "'" : _t.range.intervalObject.worksheet.sName) + "!" + formulaCell.getID();
                }
                var seriaName = parsedHeaders.bTop ? (_t.range.intervalObject.worksheet.getCell(new CellAddress(bbox.r1, i, 0)).getValue()) : (api.chartTranslate.series + " " + nameIndex);
                ser.TxCache.Tx = seriaName;
                _t.series.push(ser);
                nameIndex++;
            }
        }
        var seriaUniColors = _t.generateUniColors(_t.series.length);
        if (_t.type == c_oAscChartType.hbar) {
            seriaUniColors = OfficeExcel.array_reverse(seriaUniColors);
        }
        for (var i = 0; i < _t.series.length; i++) {
            if (oldSeriaData[i]) {
                _t.series[i].OutlineColor = oldSeriaData[i];
            } else {
                _t.series[i].OutlineColor = seriaUniColors[i];
            }
        }
    },
    getReverseSeries: function () {
        var _t = this;
        var revSeries = [];
        var serLen = _t.series.length;
        var api_doc = window["editor"];
        var api_sheet = window["Asc"]["editor"];
        var api = api_sheet ? api_sheet : api_doc;
        var aData = [];
        for (var j = 0; j < _t.series.length; j++) {
            aData.push(_t.series[j].Val.NumCache.length);
            aData.push(_t.series[j].xVal.NumCache.length);
            aData.push(_t.series[j].Cat.NumCache.length);
        }
        maxDataLen = Math.max.apply(Math, aData);
        var emptyItem = {
            numFormatStr: "General",
            isDateTimeFormat: false,
            val: "",
            isHidden: false
        };
        for (var j = 0; j < _t.series.length; j++) {
            if (_t.series[j].Val.NumCache.length) {
                while (_t.series[j].Val.NumCache.length < maxDataLen) {
                    _t.series[j].Val.NumCache.push(emptyItem);
                }
            }
            if (_t.series[j].xVal.NumCache.length) {
                while (_t.series[j].xVal.NumCache.length < maxDataLen) {
                    _t.series[j].xVal.NumCache.push(emptyItem);
                }
            }
            if (_t.series[j].Cat.NumCache.length) {
                while (_t.series[j].Cat.NumCache.length < maxDataLen) {
                    _t.series[j].Cat.NumCache.push(emptyItem);
                }
            }
        }
        if (serLen) {
            for (var i = 0; i < _t.series[0].Val.NumCache.length; i++) {
                var seria = new asc_CChartSeria();
                for (var j = 0; j < _t.series.length; j++) {
                    seria.Val.NumCache.push(_t.series[j].Val.NumCache[i]);
                    if (_t.series[j].TxCache.Formula && _t.series[j].TxCache.Tx) {
                        seria.Cat.NumCache.push({
                            val: _t.series[j].TxCache.Tx
                        });
                    }
                    if (_t.series[j].Cat.Formula && _t.series[j].Cat.NumCache.length) {
                        seria.TxCache.Tx = _t.series[j].Cat.NumCache[i].val;
                    } else {
                        seria.TxCache.Tx = (i + 1);
                    }
                }
                revSeries.push(seria);
            }
        }
        return revSeries;
    },
    generateUniColors: function (count) {
        var uniColors = [];
        var api_doc = window["editor"];
        var api_sheet = window["Asc"]["editor"];
        var api = api_sheet ? api_sheet : api_doc;
        if (count > 0) {
            if (!api.chartStyleManager.isReady()) {
                api.chartStyleManager.init();
            }
            var baseColors = api.chartStyleManager.getBaseColors(parseInt(this.styleId));
            var colors = generateColors(count, baseColors, true);
            for (var i = 0; i < colors.length; i++) {
                var rgbColor = new RGBColor(colors[i]);
                var uniColor = CreateUniColorRGB(rgbColor.r, rgbColor.g, rgbColor.b);
                uniColor.isCustom = true;
                uniColors.push(uniColor);
            }
        }
        return uniColors;
    },
    getLegendInfo: function () {
        var aInfo = [];
        function legendInfo() {
            return {
                text: null,
                color: null,
                marker: null
            };
        }
        var aColors = generateColors(this.series.length, arrBaseColors, true);
        for (var i = 0; i < this.series.length; i++) {
            var info = new legendInfo();
            info.text = this.series[i].asc_getTitle();
            info.color = aColors[i];
            info.marker = c_oAscLegendMarkerType.Line;
            aInfo.push(info);
        }
        return aInfo;
    },
    Get_Id: function () {
        return this.Id;
    },
    getObjectType: function () {
        return CLASS_TYPE_CHART_DATA;
    },
    Write_ToBinary2: function (Writer) {
        Writer.WriteLong(CLASS_TYPE_CHART_DATA);
        Writer.WriteString2(this.Id);
        Writer.WriteString2(this.type);
        Writer.WriteString2(this.subType);
        Writer.WriteLong(this.styleId);
        Writer.WriteBool(this.bChartEditor);
        Writer.WriteBool(this.bShowValue);
        Writer.WriteBool(this.bShowCatName);
        Writer.WriteBool(this.bShowBorder);
        Writer.WriteString2(this.header.title);
        Writer.WriteString2(this.header.subTitle);
        Writer.WriteBool(this.header.bDefaultTitle);
        Writer.WriteString2(this.range.interval);
        Writer.WriteBool(this.range.rows);
        Writer.WriteBool(this.range.columns);
        Writer.WriteString2(this.xAxis.title);
        Writer.WriteBool(this.xAxis.bDefaultTitle);
        Writer.WriteBool(this.xAxis.bShow);
        Writer.WriteBool(this.xAxis.bGrid);
        Writer.WriteString2(this.yAxis.title);
        Writer.WriteBool(this.yAxis.bDefaultTitle);
        Writer.WriteBool(this.yAxis.bShow);
        Writer.WriteBool(this.yAxis.bGrid);
        Writer.WriteString2(this.legend.position);
        Writer.WriteBool(this.legend.bShow);
        Writer.WriteBool(this.legend.bOverlay);
        Writer.WriteLong(this.series.length);
        for (var i = 0; i < this.series.length; i++) {
            Writer.WriteString2(this.series[i].Val.Formula);
            Writer.WriteLong(this.series[i].Val.NumCache.length);
            for (var j = 0; j < this.series[i].Val.NumCache.length; j++) {
                Writer.WriteString2((this.series[i].Val.NumCache[j].numFormatStr != undefined) ? this.series[i].Val.NumCache[j].numFormatStr : "General");
                Writer.WriteBool((this.series[i].Val.NumCache[j].isDateTimeFormat != undefined) ? this.series[i].Val.NumCache[j].isDateTimeFormat : false);
                Writer.WriteString2(this.series[i].Val.NumCache[j].val);
                Writer.WriteBool((this.series[i].Val.NumCache[j].isHidden != undefined) ? this.series[i].Val.NumCache[j].isHidden : false);
            }
            Writer.WriteString2(this.series[i].xVal.Formula);
            Writer.WriteLong(this.series[i].xVal.NumCache.length);
            for (var j = 0; j < this.series[i].xVal.NumCache.length; j++) {
                Writer.WriteString2((this.series[i].xVal.NumCache[j].numFormatStr != undefined) ? this.series[i].xVal.NumCache[j].numFormatStr : "General");
                Writer.WriteBool((this.series[i].xVal.NumCache[j].isDateTimeFormat != undefined) ? this.series[i].xVal.NumCache[j].isDateTimeFormat : false);
                Writer.WriteString2(this.series[i].xVal.NumCache[j].val);
                Writer.WriteBool((this.series[i].xVal.NumCache[j].isHidden != undefined) ? this.series[i].xVal.NumCache[j].isHidden : false);
            }
            Writer.WriteString2(this.series[i].Cat.Formula);
            Writer.WriteLong(this.series[i].Cat.NumCache.length);
            for (var j = 0; j < this.series[i].Cat.NumCache.length; j++) {
                Writer.WriteString2((this.series[i].Cat.NumCache[j].numFormatStr != undefined) ? this.series[i].Cat.NumCache[j].numFormatStr : "General");
                Writer.WriteBool((this.series[i].Cat.NumCache[j].isDateTimeFormat != undefined) ? this.series[i].Cat.NumCache[j].isDateTimeFormat : false);
                Writer.WriteString2(this.series[i].Cat.NumCache[j].val);
                Writer.WriteBool((this.series[i].Cat.NumCache[j].isHidden != undefined) ? this.series[i].Cat.NumCache[j].isHidden : false);
            }
            Writer.WriteString2(this.series[i].TxCache.Tx);
            Writer.WriteString2(this.series[i].TxCache.Formula);
            Writer.WriteString2(this.series[i].Marker.Size);
            Writer.WriteString2(this.series[i].Marker.Symbol);
            Writer.WriteString2(this.series[i].FormatCode);
            Writer.WriteBool(this.series[i].isHidden);
            Writer.WriteBool(this.series[i].bShowValue);
        }
        Writer.WriteLong(this.themeColors.length);
        for (var i = 0; i < this.themeColors.length; i++) {
            Writer.WriteString2(this.themeColors[i]);
        }
    },
    Read_FromBinary2: function (Reader, noReadId) {
        Reader.GetLong();
        var Id = Reader.GetString2();
        if (! (noReadId === false)) {
            this.Id = Id;
        }
        this.type = Reader.GetString2();
        this.subType = Reader.GetString2();
        this.styleId = Reader.GetLong();
        this.bChartEditor = Reader.GetBool();
        this.bShowValue = Reader.GetBool();
        this.bShowCatName = Reader.GetBool();
        this.bShowBorder = Reader.GetBool();
        this.header.title = Reader.GetString2();
        this.header.subTitle = Reader.GetString2();
        this.header.bDefaultTitle = Reader.GetBool();
        this.range.interval = Reader.GetString2();
        this.range.rows = Reader.GetBool();
        this.range.columns = Reader.GetBool();
        this.xAxis.title = Reader.GetString2();
        this.xAxis.bDefaultTitle = Reader.GetBool();
        this.xAxis.bShow = Reader.GetBool();
        this.xAxis.bGrid = Reader.GetBool();
        this.yAxis.title = Reader.GetString2();
        this.yAxis.bDefaultTitle = Reader.GetBool();
        this.yAxis.bShow = Reader.GetBool();
        this.yAxis.bGrid = Reader.GetBool();
        this.legend.position = Reader.GetString2();
        this.legend.bShow = Reader.GetBool();
        this.legend.bOverlay = Reader.GetBool();
        this.series = [];
        var seriesCount = Reader.GetLong();
        for (var i = 0; i < seriesCount; i++) {
            var seria = new asc_CChartSeria();
            seria.Val.Formula = Reader.GetString2();
            var numCacheCount = Reader.GetLong();
            for (var j = 0; j < numCacheCount; j++) {
                var item = {};
                item.numFormatStr = Reader.GetString2();
                item.isDateTimeFormat = Reader.GetBool();
                item.val = Reader.GetString2();
                item.isHidden = Reader.GetBool();
                seria.Val.NumCache.push(item);
            }
            seria.xVal.Formula = Reader.GetString2();
            numCacheCount = Reader.GetLong();
            for (var j = 0; j < numCacheCount; j++) {
                var item = {};
                item.numFormatStr = Reader.GetString2();
                item.isDateTimeFormat = Reader.GetBool();
                item.val = Reader.GetString2();
                item.isHidden = Reader.GetBool();
                seria.xVal.NumCache.push(item);
            }
            seria.Cat.Formula = Reader.GetString2();
            numCacheCount = Reader.GetLong();
            for (var j = 0; j < numCacheCount; j++) {
                var item = {};
                item.numFormatStr = Reader.GetString2();
                item.isDateTimeFormat = Reader.GetBool();
                item.val = Reader.GetString2();
                item.isHidden = Reader.GetBool();
                seria.Cat.NumCache.push(item);
            }
            seria.TxCache.Tx = Reader.GetString2();
            seria.TxCache.Formula = Reader.GetString2();
            seria.Marker.Size = Reader.GetString2();
            seria.Marker.Symbol = Reader.GetString2();
            seria.FormatCode = Reader.GetString2();
            seria.isHidden = Reader.GetBool();
            seria.bShowValue = Reader.GetBool();
            this.series.push(seria);
        }
        this.themeColors = [];
        var themeColorsCount = Reader.GetLong();
        for (var i = 0; i < themeColorsCount; i++) {
            this.themeColors.push(Reader.GetString2());
        }
    },
    Save_Changes: function (data, Writer) {
        this.Write_ToBinary2(Writer);
    },
    Load_Changes: function (Reader) {
        Reader.GetLong();
        this.Read_FromBinary2(Reader);
    },
    Refresh_RecalcData: function (data) {},
    Undo: function (type, data) {
        var api = window["Asc"]["editor"];
        var ws = api.wb.getWorksheet();
        switch (type) {
        case historyitem_Chart_Type:
            this.type = data.oldValue;
            break;
        case historyitem_Chart_SubType:
            this.subType = data.oldValue;
            break;
        case historyitem_Chart_Style:
            this.styleId = data.oldValue;
            break;
        case historyitem_Chart_IsShowValue:
            this.bShowValue = data.oldValue;
            break;
        case historyitem_Chart_IsShowBorder:
            this.bShowBorder = data.oldValue;
            break;
        case historyitem_Chart_RangeInterval:
            this.range.interval = data.oldValue;
            if (ws) {
                this.range.intervalObject = convertFormula(this.range.interval, ws);
                this.rebuildSeries();
            }
            break;
        case historyitem_Chart_RangeRowColumns:
            this.range.rows = data.oldValue;
            this.range.columns = !data.oldValue;
            break;
        case historyitem_Chart_HeaderTitle:
            this.header.title = data.oldValue;
            break;
        case historyitem_Chart_HeaderSubTitle:
            this.header.subTitle = data.oldValue;
            break;
        case historyitem_Chart_IsDefaultHeaderTitle:
            this.header.bDefaultTitle = data.oldValue;
            break;
        case historyitem_Chart_xAxisTitle:
            this.xAxis.title = data.oldValue;
            break;
        case historyitem_Chart_xAxisIsDefaultTitle:
            this.xAxis.bDefaultTitle = data.oldValue;
            break;
        case historyitem_Chart_xAxisIsShow:
            this.xAxis.bShow = data.oldValue;
            break;
        case historyitem_Chart_xAxisIsGrid:
            this.xAxis.bGrid = data.oldValue;
            break;
        case historyitem_Chart_yAxisTitle:
            this.yAxis.title = data.oldValue;
            break;
        case historyitem_Chart_yAxisIsDefaultTitle:
            this.yAxis.bDefaultTitle = data.oldValue;
            break;
        case historyitem_Chart_yAxisIsShow:
            this.yAxis.bShow = data.oldValue;
            break;
        case historyitem_Chart_yAxisIsGrid:
            this.yAxis.bGrid = data.oldValue;
            break;
        case historyitem_Chart_LegendPosition:
            this.legend.position = data.oldValue;
            break;
        case historyitem_Chart_LegendIsShow:
            this.legend.bShow = data.oldValue;
            break;
        case historyitem_Chart_LegendIsOverlay:
            this.legend.bOverlay = data.oldValue;
            break;
        }
        if (ws) {
            ws.objectRender.rebuildChartGraphicObjects();
        }
    },
    Redo: function (type, data) {
        var api = window["Asc"]["editor"];
        var ws = api.wb.getWorksheet();
        switch (type) {
        case historyitem_Chart_Type:
            this.type = data.newValue;
            break;
        case historyitem_Chart_SubType:
            this.subType = data.newValue;
            break;
        case historyitem_Chart_Style:
            this.styleId = data.newValue;
            break;
        case historyitem_Chart_IsShowValue:
            this.bShowValue = data.newValue;
            break;
        case historyitem_Chart_IsShowBorder:
            this.bShowBorder = data.newValue;
            break;
        case historyitem_Chart_RangeInterval:
            this.range.interval = data.newValue;
            if (ws) {
                this.range.intervalObject = convertFormula(this.range.interval, ws);
                this.rebuildSeries();
            }
            break;
        case historyitem_Chart_RangeRowColumns:
            this.range.rows = data.newValue;
            this.range.columns = !data.newValue;
            break;
        case historyitem_Chart_HeaderTitle:
            this.header.title = data.newValue;
            break;
        case historyitem_Chart_HeaderSubTitle:
            this.header.subTitle = data.newValue;
            break;
        case historyitem_Chart_IsDefaultHeaderTitle:
            this.header.bDefaultTitle = data.newValue;
            break;
        case historyitem_Chart_xAxisTitle:
            this.xAxis.title = data.newValue;
            break;
        case historyitem_Chart_xAxisIsDefaultTitle:
            this.xAxis.bDefaultTitle = data.newValue;
            break;
        case historyitem_Chart_xAxisIsShow:
            this.xAxis.bShow = data.newValue;
            break;
        case historyitem_Chart_xAxisIsGrid:
            this.xAxis.bGrid = data.newValue;
            break;
        case historyitem_Chart_yAxisTitle:
            this.yAxis.title = data.newValue;
            break;
        case historyitem_Chart_yAxisIsDefaultTitle:
            this.yAxis.bDefaultTitle = data.newValue;
            break;
        case historyitem_Chart_yAxisIsShow:
            this.yAxis.bShow = data.newValue;
            break;
        case historyitem_Chart_yAxisIsGrid:
            this.yAxis.bGrid = data.newValue;
            break;
        case historyitem_Chart_LegendPosition:
            this.legend.position = data.newValue;
            break;
        case historyitem_Chart_LegendIsShow:
            this.legend.bShow = data.newValue;
            break;
        case historyitem_Chart_LegendIsOverlay:
            this.legend.bOverlay = data.newValue;
            break;
        }
        if (ws) {
            ws.objectRender.rebuildChartGraphicObjects();
        }
    }
};
window["Asc"].asc_CChart = asc_CChart;
window["Asc"]["asc_CChart"] = asc_CChart;
prot = asc_CChart.prototype;
prot["asc_getType"] = prot.asc_getType;
prot["asc_setType"] = prot.asc_setType;
prot["asc_getSubType"] = prot.asc_getSubType;
prot["asc_setSubType"] = prot.asc_setSubType;
prot["asc_getStyleId"] = prot.asc_getStyleId;
prot["asc_setStyleId"] = prot.asc_setStyleId;
prot["asc_getShowValueFlag"] = prot.asc_getShowValueFlag;
prot["asc_setShowValueFlag"] = prot.asc_setShowValueFlag;
prot["asc_getShowCatNameFlag"] = prot.asc_getShowCatNameFlag;
prot["asc_setShowCatNameFlag"] = prot.asc_setShowCatNameFlag;
prot["asc_getShowBorderFlag"] = prot.asc_getShowBorderFlag;
prot["asc_setShowBorderFlag"] = prot.asc_setShowBorderFlag;
prot["asc_getHeader"] = prot.asc_getHeader;
prot["asc_setHeader"] = prot.asc_setHeader;
prot["asc_getRange"] = prot.asc_getRange;
prot["asc_setRange"] = prot.asc_setRange;
prot["asc_getXAxis"] = prot.asc_getXAxis;
prot["asc_setXAxis"] = prot.asc_setXAxis;
prot["asc_getYAxis"] = prot.asc_getYAxis;
prot["asc_setYAxis"] = prot.asc_setYAxis;
prot["asc_getLegend"] = prot.asc_getLegend;
prot["asc_setLegend"] = prot.asc_setLegend;
prot["asc_getSeria"] = prot.asc_getSeria;
prot["asc_setSeria"] = prot.asc_setSeria;
prot["asc_removeSeries"] = prot.asc_removeSeries;
function asc_CChartBinary(chart) {
    this["binary"] = null;
    if (typeof CChartAsGroup != "undefined" && chart instanceof CChartAsGroup) {
        this["binary"] = chart.getChartBinary();
    }
}
asc_CChartBinary.prototype = {
    asc_getBinary: function () {
        return this["binary"];
    },
    asc_setBinary: function (val) {
        this["binary"] = val;
    }
};
window["Asc"].asc_CChartBinary = asc_CChartBinary;
window["Asc"]["asc_CChartBinary"] = asc_CChartBinary;
prot = asc_CChartBinary.prototype;
prot["asc_getBinary"] = prot.asc_getBinary;
prot["asc_setBinary"] = prot.asc_setBinary;
function asc_CChartRange(object) {
    var bCopy = isObject(object);
    this.interval = bCopy ? object.interval : "";
    this.intervalObject = bCopy ? object.intervalObject : null;
    this.rows = bCopy ? object.rows : false;
    this.columns = bCopy ? object.columns : true;
}
asc_CChartRange.prototype = {
    isEqual: function (object) {
        return ((this.interval == object.interval) && (this.rows == object.rows) && (this.columns == object.columns));
    },
    asc_getInterval: function () {
        return this.interval;
    },
    asc_setInterval: function (interval) {
        this.interval = interval;
    },
    asc_getRowsFlag: function () {
        return this.rows;
    },
    asc_setRowsFlag: function (value) {
        this.rows = value;
        this.columns = !value;
    },
    asc_getColumnsFlag: function () {
        return this.columns;
    },
    asc_setColumnsFlag: function (value) {
        this.rows = !value;
        this.columns = value;
    }
};
window["Asc"].asc_CChartRange = asc_CChartRange;
window["Asc"]["asc_CChartRange"] = asc_CChartRange;
prot = asc_CChartRange.prototype;
prot["asc_getInterval"] = prot.asc_getInterval;
prot["asc_setInterval"] = prot.asc_setInterval;
prot["asc_getRowsFlag"] = prot.asc_getRowsFlag;
prot["asc_setRowsFlag"] = prot.asc_setRowsFlag;
prot["asc_getColumnsFlag"] = prot.asc_getColumnsFlag;
prot["asc_setColumnsFlag"] = prot.asc_setColumnsFlag;
function asc_CChartHeader(object) {
    var bCopy = isObject(object);
    this.title = bCopy ? object.title : "";
    this.subTitle = bCopy ? object.subTitle : "";
    this.bDefaultTitle = bCopy ? object.bDefaultTitle : false;
}
asc_CChartHeader.prototype = {
    isEqual: function (object) {
        return ((this.title == object.title) && (this.subTitle == object.subTitle) && (this.bDefaultTitle == object.bDefaultTitle));
    },
    asc_getTitle: function () {
        return this.title;
    },
    asc_setTitle: function (title) {
        this.title = title;
    },
    asc_getSubTitle: function () {
        return this.subTitle;
    },
    asc_setSubTitle: function (subTitle) {
        this.subTitle = subTitle;
    },
    asc_getDefaultTitleFlag: function () {
        return this.bDefaultTitle;
    },
    asc_setDefaultTitleFlag: function (defaultTitleFlag) {
        this.bDefaultTitle = defaultTitleFlag;
    }
};
window["Asc"].asc_CChartHeader = asc_CChartHeader;
window["Asc"]["asc_CChartHeader"] = asc_CChartHeader;
prot = asc_CChartHeader.prototype;
prot["asc_getTitle"] = prot.asc_getTitle;
prot["asc_setTitle"] = prot.asc_setTitle;
prot["asc_getSubTitle"] = prot.asc_getSubTitle;
prot["asc_setSubTitle"] = prot.asc_setSubTitle;
prot["asc_getDefaultTitleFlag"] = prot.asc_getDefaultTitleFlag;
prot["asc_setDefaultTitleFlag"] = prot.asc_setDefaultTitleFlag;
function asc_CChartAxisX(object) {
    var bCopy = isObject(object);
    this.title = bCopy ? object.title : "";
    this.bDefaultTitle = bCopy ? object.bDefaultTitle : false;
    this.bShow = bCopy ? object.bShow : true;
    this.bGrid = bCopy ? object.bGrid : true;
}
asc_CChartAxisX.prototype = {
    isEqual: function (object) {
        return ((this.title == object.title) && (this.bDefaultTitle == object.bDefaultTitle) && (this.bShow == object.bShow) && (this.bGrid == object.bGrid));
    },
    asc_getTitle: function () {
        return this.title;
    },
    asc_setTitle: function (title) {
        this.title = title;
    },
    asc_getDefaultTitleFlag: function () {
        return this.bDefaultTitle;
    },
    asc_setDefaultTitleFlag: function (defaultTitleFlag) {
        this.bDefaultTitle = defaultTitleFlag;
    },
    asc_getShowFlag: function () {
        return this.bShow;
    },
    asc_setShowFlag: function (showFlag) {
        this.bShow = showFlag;
    },
    asc_getGridFlag: function () {
        return this.bGrid;
    },
    asc_setGridFlag: function (gridFlag) {
        this.bGrid = gridFlag;
    }
};
window["Asc"].asc_CChartAxisX = asc_CChartAxisX;
window["Asc"]["asc_CChartAxisX"] = asc_CChartAxisX;
prot = asc_CChartAxisX.prototype;
prot["asc_getTitle"] = prot.asc_getTitle;
prot["asc_setTitle"] = prot.asc_setTitle;
prot["asc_getDefaultTitleFlag"] = prot.asc_getDefaultTitleFlag;
prot["asc_setDefaultTitleFlag"] = prot.asc_setDefaultTitleFlag;
prot["asc_getShowFlag"] = prot.asc_getShowFlag;
prot["asc_setShowFlag"] = prot.asc_setShowFlag;
prot["asc_getGridFlag"] = prot.asc_getGridFlag;
prot["asc_setGridFlag"] = prot.asc_setGridFlag;
function asc_CChartAxisY(object) {
    var bCopy = isObject(object);
    this.title = bCopy ? object.title : "";
    this.bDefaultTitle = bCopy ? object.bDefaultTitle : false;
    this.bShow = bCopy ? object.bShow : true;
    this.bGrid = bCopy ? object.bGrid : true;
}
asc_CChartAxisY.prototype = {
    isEqual: function (object) {
        return ((this.title == object.title) && (this.bDefaultTitle == object.bDefaultTitle) && (this.bShow == object.bShow) && (this.bGrid == object.bGrid));
    },
    asc_getTitle: function () {
        return this.title;
    },
    asc_setTitle: function (title) {
        this.title = title;
    },
    asc_getDefaultTitleFlag: function () {
        return this.bDefaultTitle;
    },
    asc_setDefaultTitleFlag: function (defaultTitleFlag) {
        this.bDefaultTitle = defaultTitleFlag;
    },
    asc_getShowFlag: function () {
        return this.bShow;
    },
    asc_setShowFlag: function (showFlag) {
        this.bShow = showFlag;
    },
    asc_getGridFlag: function () {
        return this.bGrid;
    },
    asc_setGridFlag: function (gridFlag) {
        this.bGrid = gridFlag;
    }
};
window["Asc"].asc_CChartAxisY = asc_CChartAxisY;
window["Asc"]["asc_CChartAxisY"] = asc_CChartAxisY;
prot = asc_CChartAxisY.prototype;
prot["asc_getTitle"] = prot.asc_getTitle;
prot["asc_setTitle"] = prot.asc_setTitle;
prot["asc_getDefaultTitleFlag"] = prot.asc_getDefaultTitleFlag;
prot["asc_setDefaultTitleFlag"] = prot.asc_setDefaultTitleFlag;
prot["asc_getShowFlag"] = prot.asc_getShowFlag;
prot["asc_setShowFlag"] = prot.asc_setShowFlag;
prot["asc_getGridFlag"] = prot.asc_getGridFlag;
prot["asc_setGridFlag"] = prot.asc_setGridFlag;
function asc_CChartLegend(object) {
    var bCopy = isObject(object);
    this.position = bCopy ? object.position : c_oAscChartLegend.right;
    this.bShow = bCopy ? object.bShow : true;
    this.bOverlay = bCopy ? object.bOverlay : false;
}
asc_CChartLegend.prototype = {
    isEqual: function (object) {
        return ((this.position == object.position) && (this.bShow == object.bShow) && (this.bOverlay == object.bOverlay));
    },
    asc_getPosition: function () {
        return this.position;
    },
    asc_setPosition: function (pos) {
        this.position = pos;
    },
    asc_getShowFlag: function () {
        return this.bShow;
    },
    asc_setShowFlag: function (showFlag) {
        this.bShow = showFlag;
    },
    asc_getOverlayFlag: function () {
        return this.bOverlay;
    },
    asc_setOverlayFlag: function (overlayFlag) {
        this.bOverlay = overlayFlag;
    }
};
window["Asc"].asc_CChartLegend = asc_CChartLegend;
window["Asc"]["asc_CChartLegend"] = asc_CChartLegend;
prot = asc_CChartLegend.prototype;
prot["asc_getPosition"] = prot.asc_getPosition;
prot["asc_setPosition"] = prot.asc_setPosition;
prot["asc_getShowFlag"] = prot.asc_getShowFlag;
prot["asc_setShowFlag"] = prot.asc_setShowFlag;
prot["asc_getOverlayFlag"] = prot.asc_getOverlayFlag;
prot["asc_setOverlayFlag"] = prot.asc_setOverlayFlag;
function asc_CChartFont(object) {
    var bCopy = isObject(object);
    this.name = bCopy ? object.name : "Calibri";
    this.size = bCopy ? object.size : 10;
    this.color = bCopy ? object.color : "#000000";
    this.bold = bCopy ? object.bold : 0;
    this.italic = bCopy ? object.italic : 0;
    this.underline = bCopy ? object.underline : 0;
    this.Properties = {
        name: 0,
        size: 1,
        color: 2,
        bold: 3,
        italic: 4,
        underline: 5
    };
}
asc_CChartFont.prototype = {
    asc_getName: function () {
        return this.name;
    },
    asc_setName: function (val) {
        this.name = val;
    },
    asc_getSize: function () {
        return this.size;
    },
    asc_setSize: function (val) {
        this.size = val;
    },
    asc_getColor: function () {
        return this.color;
    },
    asc_setColor: function (val) {
        this.color = val;
    },
    asc_getBold: function () {
        return this.bold;
    },
    asc_setBold: function (val) {
        this.bold = val;
    },
    asc_getItalic: function () {
        return this.italic;
    },
    asc_setItalic: function (val) {
        this.italic = val;
    },
    asc_getUnderline: function () {
        return this.underline;
    },
    asc_setUnderline: function (val) {
        this.underline = val;
    },
    getType: function () {
        return UndoRedoDataTypes.ChartFont;
    },
    getProperties: function () {
        return this.Properties;
    },
    getProperty: function (nType) {
        switch (nType) {
        case this.Properties.name:
            return this.name;
            break;
        case this.Properties.size:
            return this.size;
            break;
        case this.Properties.color:
            return this.color;
            break;
        case this.Properties.bold:
            return this.bold;
            break;
        case this.Properties.italic:
            return this.italic;
            break;
        case this.Properties.underline:
            return this.underline;
            break;
        }
    },
    setProperty: function (nType, value) {
        switch (nType) {
        case this.Properties.name:
            this.name = value;
            break;
        case this.Properties.size:
            this.size = value;
            break;
        case this.Properties.color:
            this.color = value;
            break;
        case this.Properties.bold:
            this.bold = value;
            break;
        case this.Properties.italic:
            this.italic = value;
            break;
        case this.Properties.underline:
            this.underline = value;
            break;
        }
    }
};
window["Asc"].asc_CChartFont = asc_CChartFont;
window["Asc"]["asc_CChartFont"] = asc_CChartFont;
prot = asc_CChartFont.prototype;
prot["asc_getName"] = prot.asc_getName;
prot["asc_setName"] = prot.asc_setName;
prot["asc_getSize"] = prot.asc_getSize;
prot["asc_setSize"] = prot.asc_setSize;
prot["asc_getColor"] = prot.asc_getColor;
prot["asc_setColor"] = prot.asc_setColor;
prot["asc_getBold"] = prot.asc_getBold;
prot["asc_setBold"] = prot.asc_setBold;
prot["asc_getItalic"] = prot.asc_getItalic;
prot["asc_setItalic"] = prot.asc_setItalic;
prot["asc_getUnderline"] = prot.asc_getUnderline;
prot["asc_setUnderline"] = prot.asc_setUnderline;
function asc_CChartSeria() {
    this.Val = {
        Formula: "",
        NumCache: []
    };
    this.xVal = {
        Formula: "",
        NumCache: []
    };
    this.Cat = {
        Formula: "",
        NumCache: []
    };
    this.TxCache = {
        Formula: "",
        Tx: ""
    };
    this.Marker = {
        Size: 0,
        Symbol: ""
    };
    this.OutlineColor = null;
    this.FormatCode = "";
    this.isHidden = false;
    this.bShowValue = false;
}
asc_CChartSeria.prototype = {
    asc_getValFormula: function () {
        return this.Val.Formula;
    },
    asc_setValFormula: function (formula) {
        this.Val.Formula = formula;
    },
    asc_getxValFormula: function () {
        return this.xVal.Formula;
    },
    asc_setxValFormula: function (formula) {
        this.xVal.Formula = formula;
    },
    asc_getCatFormula: function () {
        return this.Cat.Formula;
    },
    asc_setCatFormula: function (formula) {
        this.Cat.Formula = formula;
    },
    asc_getTitle: function () {
        return this.TxCache.Tx;
    },
    asc_setTitle: function (title) {
        this.TxCache.Tx = title;
    },
    asc_getTitleFormula: function () {
        return this.TxCache.Formula;
    },
    asc_setTitleFormula: function (val) {
        this.TxCache.Formula = val;
    },
    asc_getMarkerSize: function () {
        return this.Marker.Size;
    },
    asc_setMarkerSize: function (size) {
        this.Marker.Size = size;
    },
    asc_getMarkerSymbol: function () {
        return this.Marker.Symbol;
    },
    asc_setMarkerSymbol: function (symbol) {
        this.Marker.Symbol = symbol;
    },
    asc_getOutlineColor: function () {
        return this.OutlineColor;
    },
    asc_setOutlineColor: function (color) {
        if (color instanceof CUniColor) {
            this.OutlineColor = color.createDuplicate();
            this.OutlineColor.isCustom = color.isCustom;
        }
    },
    asc_getFormatCode: function () {
        return this.FormatCode;
    },
    asc_setFormatCode: function (format) {
        this.FormatCode = format;
    }
};
window["Asc"].asc_CChartSeria = asc_CChartSeria;
window["Asc"]["asc_CChartSeria"] = asc_CChartSeria;
prot = asc_CChartSeria.prototype;
prot["asc_getValFormula"] = prot.asc_getValFormula;
prot["asc_setValFormula"] = prot.asc_setValFormula;
prot["asc_getxValFormula"] = prot.asc_getxValFormula;
prot["asc_setxValFormula"] = prot.asc_setxValFormula;
prot["asc_getCatFormula"] = prot.asc_getCatFormula;
prot["asc_setCatFormula"] = prot.asc_setCatFormula;
prot["asc_getTitle"] = prot.asc_getTitle;
prot["asc_setTitle"] = prot.asc_setTitle;
prot["asc_getTitleFormula"] = prot.asc_getTitleFormula;
prot["asc_setTitleFormula"] = prot.asc_setTitleFormula;
prot["asc_getMarkerSize"] = prot.asc_getMarkerSize;
prot["asc_setMarkerSize"] = prot.asc_setMarkerSize;
prot["asc_getMarkerSymbol"] = prot.asc_getMarkerSymbol;
prot["asc_setMarkerSymbol"] = prot.asc_setMarkerSymbol;
prot["asc_getOutlineColor"] = prot.asc_getOutlineColor;
prot["asc_setOutlineColor"] = prot.asc_setOutlineColor;
prot["asc_getFormatCode"] = prot.asc_getFormatCode;
prot["asc_setFormatCode"] = prot.asc_setFormatCode;
function asc_CSelectedObject(type, val) {
    this.Type = (undefined != type) ? type : null;
    this.Value = (undefined != val) ? val : null;
}
asc_CSelectedObject.prototype = {
    asc_getObjectType: function () {
        return this.Type;
    },
    asc_getObjectValue: function () {
        return this.Value;
    }
};
window["Asc"].asc_CSelectedObject = asc_CSelectedObject;
window["Asc"]["asc_CSelectedObject"] = asc_CSelectedObject;
prot = asc_CSelectedObject.prototype;
prot["asc_getObjectType"] = prot.asc_getObjectType;
prot["asc_getObjectValue"] = prot.asc_getObjectValue;
function asc_CImgProperty(obj) {
    if (obj) {
        this.CanBeFlow = (undefined != obj.CanBeFlow) ? obj.CanBeFlow : true;
        this.Width = (undefined != obj.Width) ? obj.Width : undefined;
        this.Height = (undefined != obj.Height) ? obj.Height : undefined;
        this.WrappingStyle = (undefined != obj.WrappingStyle) ? obj.WrappingStyle : undefined;
        this.Paddings = (undefined != obj.Paddings) ? new CPaddings(obj.Paddings) : undefined;
        this.Position = (undefined != obj.Position) ? new CPosition(obj.Position) : undefined;
        this.AllowOverlap = (undefined != obj.AllowOverlap) ? obj.AllowOverlap : undefined;
        this.PositionH = (undefined != obj.PositionH) ? new CImagePositionH(obj.PositionH) : undefined;
        this.PositionV = (undefined != obj.PositionV) ? new CImagePositionV(obj.PositionV) : undefined;
        this.Internal_Position = (undefined != obj.Internal_Position) ? obj.Internal_Position : null;
        this.ImageUrl = (undefined != obj.ImageUrl) ? obj.ImageUrl : null;
        this.Locked = (undefined != obj.Locked) ? obj.Locked : false;
        this.ChartProperties = (undefined != obj.ChartProperties) ? obj.ChartProperties : null;
        this.ShapeProperties = (undefined != obj.ShapeProperties) ? (obj.ShapeProperties) : null;
        this.ChangeLevel = (undefined != obj.ChangeLevel) ? obj.ChangeLevel : null;
        this.Group = (obj.Group != undefined) ? obj.Group : null;
        this.fromGroup = obj.fromGroup != undefined ? obj.fromGroup : null;
        this.severalCharts = obj.severalCharts != undefined ? obj.severalCharts : false;
        this.severalChartTypes = obj.severalChartTypes != undefined ? obj.severalChartTypes : undefined;
        this.severalChartStyles = obj.severalChartStyles != undefined ? obj.severalChartStyles : undefined;
        this.verticalTextAlign = obj.verticalTextAlign != undefined ? obj.verticalTextAlign : undefined;
    } else {
        this.CanBeFlow = true;
        this.Width = undefined;
        this.Height = undefined;
        this.WrappingStyle = undefined;
        this.Paddings = undefined;
        this.Position = undefined;
        this.PositionH = undefined;
        this.PositionV = undefined;
        this.Internal_Position = null;
        this.ImageUrl = null;
        this.Locked = false;
        this.ChartProperties = null;
        this.ShapeProperties = null;
        this.ImageProperties = null;
        this.ChangeLevel = null;
        this.Group = null;
        this.fromGroup = null;
        this.severalCharts = false;
        this.severalChartTypes = undefined;
        this.severalChartStyles = undefined;
        this.verticalTextAlign = undefined;
    }
}
asc_CImgProperty.prototype = {
    asc_getChangeLevel: function () {
        return this.ChangeLevel;
    },
    asc_putChangeLevel: function (v) {
        this.ChangeLevel = v;
    },
    asc_getCanBeFlow: function () {
        return this.CanBeFlow;
    },
    asc_getWidth: function () {
        return this.Width;
    },
    asc_putWidth: function (v) {
        this.Width = v;
    },
    asc_getHeight: function () {
        return this.Height;
    },
    asc_putHeight: function (v) {
        this.Height = v;
    },
    asc_getWrappingStyle: function () {
        return this.WrappingStyle;
    },
    asc_putWrappingStyle: function (v) {
        this.WrappingStyle = v;
    },
    asc_getPaddings: function () {
        return this.Paddings;
    },
    asc_putPaddings: function (v) {
        this.Paddings = v;
    },
    asc_getAllowOverlap: function () {
        return this.AllowOverlap;
    },
    asc_putAllowOverlap: function (v) {
        this.AllowOverlap = v;
    },
    asc_getPosition: function () {
        return this.Position;
    },
    asc_putPosition: function (v) {
        this.Position = v;
    },
    asc_getPositionH: function () {
        return this.PositionH;
    },
    asc_putPositionH: function (v) {
        this.PositionH = v;
    },
    asc_getPositionV: function () {
        return this.PositionV;
    },
    asc_putPositionV: function (v) {
        this.PositionV = v;
    },
    asc_getValue_X: function (RelativeFrom) {
        if (null != this.Internal_Position) {
            return this.Internal_Position.Calculate_X_Value(RelativeFrom);
        }
        return 0;
    },
    asc_getValue_Y: function (RelativeFrom) {
        if (null != this.Internal_Position) {
            return this.Internal_Position.Calculate_Y_Value(RelativeFrom);
        }
        return 0;
    },
    asc_getImageUrl: function () {
        return this.ImageUrl;
    },
    asc_putImageUrl: function (v) {
        this.ImageUrl = v;
    },
    asc_getGroup: function () {
        return this.Group;
    },
    asc_putGroup: function (v) {
        this.Group = v;
    },
    asc_getFromGroup: function () {
        return this.fromGroup;
    },
    asc_putFromGroup: function (v) {
        this.fromGroup = v;
    },
    asc_getisChartProps: function () {
        return this.isChartProps;
    },
    asc_putisChartPross: function (v) {
        this.isChartProps = v;
    },
    asc_getSeveralCharts: function () {
        return this.severalCharts;
    },
    asc_putSeveralCharts: function (v) {
        this.severalCharts = v;
    },
    asc_getSeveralChartTypes: function () {
        return this.severalChartTypes;
    },
    asc_putSeveralChartTypes: function (v) {
        this.severalChartTypes = v;
    },
    asc_getSeveralChartStyles: function () {
        return this.severalChartStyles;
    },
    asc_putSeveralChartStyles: function (v) {
        this.severalChartStyles = v;
    },
    asc_getVerticalTextAlign: function () {
        return this.verticalTextAlign;
    },
    asc_putVerticalTextAlign: function (v) {
        this.verticalTextAlign = v;
    },
    asc_getLocked: function () {
        return this.Locked;
    },
    asc_getChartProperties: function () {
        return this.ChartProperties;
    },
    asc_putChartProperties: function (v) {
        this.ChartProperties = v;
    },
    asc_getShapeProperties: function () {
        return this.ShapeProperties;
    },
    asc_putShapeProperties: function (v) {
        this.ShapeProperties = v;
    }
};
window["Asc"].asc_CImgProperty = asc_CImgProperty;
window["Asc"]["asc_CImgProperty"] = asc_CImgProperty;
prot = asc_CImgProperty.prototype;
prot["asc_getChangeLevel"] = prot.asc_getChangeLevel;
prot["asc_putChangeLevel"] = prot.asc_putChangeLevel;
prot["asc_getCanBeFlow"] = prot.asc_getCanBeFlow;
prot["asc_getWidth"] = prot.asc_getWidth;
prot["asc_putWidth"] = prot.asc_putWidth;
prot["asc_getHeight"] = prot.asc_getHeight;
prot["asc_putHeight"] = prot.asc_putHeight;
prot["asc_getWrappingStyle"] = prot.asc_getWrappingStyle;
prot["asc_putWrappingStyle"] = prot.asc_putWrappingStyle;
prot["asc_getPaddings"] = prot.asc_getPaddings;
prot["asc_putPaddings"] = prot.asc_putPaddings;
prot["asc_getAllowOverlap"] = prot.asc_getAllowOverlap;
prot["asc_putAllowOverlap"] = prot.asc_putAllowOverlap;
prot["asc_getPosition"] = prot.asc_getPosition;
prot["asc_putPosition"] = prot.asc_putPosition;
prot["asc_getPositionH"] = prot.asc_getPositionH;
prot["asc_putPositionH"] = prot.asc_putPositionH;
prot["asc_getPositionV"] = prot.asc_getPositionV;
prot["asc_putPositionV"] = prot.asc_putPositionV;
prot["asc_getValue_X"] = prot.asc_getValue_X;
prot["asc_getValue_Y"] = prot.asc_getValue_Y;
prot["asc_getImageUrl"] = prot.asc_getImageUrl;
prot["asc_putImageUrl"] = prot.asc_putImageUrl;
prot["asc_getGroup"] = prot.asc_getGroup;
prot["asc_putGroup"] = prot.asc_putGroup;
prot["asc_getFromGroup"] = prot.asc_getFromGroup;
prot["asc_putFromGroup"] = prot.asc_putFromGroup;
prot["asc_getisChartProps"] = prot.asc_getisChartProps;
prot["asc_putisChartPross"] = prot.asc_putisChartPross;
prot["asc_getSeveralCharts"] = prot.asc_getSeveralCharts;
prot["asc_putSeveralCharts"] = prot.asc_putSeveralCharts;
prot["asc_getSeveralChartTypes"] = prot.asc_getSeveralChartTypes;
prot["asc_putSeveralChartTypes"] = prot.asc_putSeveralChartTypes;
prot["asc_getSeveralChartStyles"] = prot.asc_getSeveralChartStyles;
prot["asc_putSeveralChartStyles"] = prot.asc_putSeveralChartStyles;
prot["asc_getVerticalTextAlign"] = prot.asc_getVerticalTextAlign;
prot["asc_putVerticalTextAlign"] = prot.asc_putVerticalTextAlign;
prot["asc_getLocked"] = prot.asc_getLocked;
prot["asc_getChartProperties"] = prot.asc_getChartProperties;
prot["asc_putChartProperties"] = prot.asc_putChartProperties;
prot["asc_getShapeProperties"] = prot.asc_getShapeProperties;
prot["asc_putShapeProperties"] = prot.asc_putShapeProperties;
function asc_CShapeProperty() {
    this.type = null;
    this.fill = null;
    this.stroke = null;
    this.paddings = null;
    this.canFill = true;
    this.canChangeArrows = false;
}
asc_CShapeProperty.prototype = {
    asc_getType: function () {
        return this.type;
    },
    asc_putType: function (v) {
        this.type = v;
    },
    asc_getFill: function () {
        return this.fill;
    },
    asc_putFill: function (v) {
        this.fill = v;
    },
    asc_getStroke: function () {
        return this.stroke;
    },
    asc_putStroke: function (v) {
        this.stroke = v;
    },
    asc_getPaddings: function () {
        return this.paddings;
    },
    asc_putPaddings: function (v) {
        this.paddings = v;
    },
    asc_getCanFill: function () {
        return this.canFill;
    },
    asc_putCanFill: function (v) {
        this.canFill = v;
    },
    asc_getCanChangeArrows: function () {
        return this.canChangeArrows;
    },
    asc_setCanChangeArrows: function (v) {
        this.canChangeArrows = v;
    }
};
window["Asc"].asc_CShapeProperty = asc_CShapeProperty;
window["Asc"]["asc_CShapeProperty"] = asc_CShapeProperty;
prot = asc_CShapeProperty.prototype;
prot["asc_getType"] = prot.asc_getType;
prot["asc_putType"] = prot.asc_putType;
prot["asc_getFill"] = prot.asc_getFill;
prot["asc_putFill"] = prot.asc_putFill;
prot["asc_getStroke"] = prot.asc_getStroke;
prot["asc_putStroke"] = prot.asc_putStroke;
prot["asc_getPaddings"] = prot.asc_getPaddings;
prot["asc_putPaddings"] = prot.asc_putPaddings;
prot["asc_getCanFill"] = prot.asc_getCanFill;
prot["asc_putCanFill"] = prot.asc_putCanFill;
prot["asc_getCanChangeArrows"] = prot.asc_getCanChangeArrows;
prot["asc_setCanChangeArrows"] = prot.asc_setCanChangeArrows;
function asc_CPaddings(obj) {
    if (obj) {
        this.Left = (undefined == obj.Left) ? null : obj.Left;
        this.Top = (undefined == obj.Top) ? null : obj.Top;
        this.Bottom = (undefined == obj.Bottom) ? null : obj.Bottom;
        this.Right = (undefined == obj.Right) ? null : obj.Right;
    } else {
        this.Left = null;
        this.Top = null;
        this.Bottom = null;
        this.Right = null;
    }
}
asc_CPaddings.prototype = {
    asc_getLeft: function () {
        return this.Left;
    },
    asc_putLeft: function (v) {
        this.Left = v;
    },
    asc_getTop: function () {
        return this.Top;
    },
    asc_putTop: function (v) {
        this.Top = v;
    },
    asc_getBottom: function () {
        return this.Bottom;
    },
    asc_putBottom: function (v) {
        this.Bottom = v;
    },
    asc_getRight: function () {
        return this.Right;
    },
    asc_putRight: function (v) {
        this.Right = v;
    }
};
window["Asc"].asc_CPaddings = asc_CPaddings;
window["Asc"]["asc_CPaddings"] = asc_CPaddings;
prot = asc_CPaddings.prototype;
prot["asc_getLeft"] = prot.asc_getLeft;
prot["asc_putLeft"] = prot.asc_putLeft;
prot["asc_getTop"] = prot.asc_getTop;
prot["asc_putTop"] = prot.asc_putTop;
prot["asc_getBottom"] = prot.asc_getBottom;
prot["asc_putBottom"] = prot.asc_putBottom;
prot["asc_getRight"] = prot.asc_getRight;
prot["asc_putRight"] = prot.asc_putRight;
function asc_CImageSize(width, height, isCorrect) {
    this.Width = (undefined == width) ? 0 : width;
    this.Height = (undefined == height) ? 0 : height;
    this.IsCorrect = isCorrect;
}
asc_CImageSize.prototype = {
    asc_getImageWidth: function () {
        return this.Width;
    },
    asc_getImageHeight: function () {
        return this.Height;
    },
    asc_getIsCorrect: function () {
        return this.IsCorrect;
    }
};
window["Asc"].asc_CImageSize = asc_CImageSize;
window["Asc"]["asc_CImageSize"] = asc_CImageSize;
prot = asc_CImageSize.prototype;
prot["asc_getImageWidth"] = prot.asc_getImageWidth;
prot["asc_getImageHeight"] = prot.asc_getImageHeight;
prot["asc_getIsCorrect"] = prot.asc_getIsCorrect;
function asc_CTexture() {
    this.Id = 0;
    this.Image = "";
}
asc_CTexture.prototype = {
    asc_getId: function () {
        return this.Id;
    },
    asc_getImage: function () {
        return this.Image;
    }
};
window["Asc"].asc_CTexture = asc_CTexture;
window["Asc"]["asc_CTexture"] = asc_CTexture;
prot = asc_CTexture.prototype;
prot["asc_getId"] = prot.asc_getId;
prot["asc_getImage"] = prot.asc_getImage;
function asc_CParagraphProperty(obj) {
    if (obj) {
        this.ContextualSpacing = (undefined != obj.ContextualSpacing) ? obj.ContextualSpacing : null;
        this.Ind = (undefined != obj.Ind && null != obj.Ind) ? new asc_CParagraphInd(obj.Ind) : null;
        this.KeepLines = (undefined != obj.KeepLines) ? obj.KeepLines : null;
        this.KeepNext = (undefined != obj.KeepNext) ? obj.KeepNext : undefined;
        this.WidowControl = (undefined != obj.WidowControl ? obj.WidowControl : undefined);
        this.PageBreakBefore = (undefined != obj.PageBreakBefore) ? obj.PageBreakBefore : null;
        this.Spacing = (undefined != obj.Spacing && null != obj.Spacing) ? new asc_CParagraphSpacing(obj.Spacing) : null;
        this.Brd = (undefined != obj.Brd && null != obj.Brd) ? new asc_CParagraphBorders(obj.Brd) : null;
        this.Shd = (undefined != obj.Shd && null != obj.Shd) ? new asc_CParagraphShd(obj.Shd) : null;
        this.Tabs = (undefined != obj.Tabs) ? new asc_CParagraphTabs(obj.Tabs) : undefined;
        this.DefaultTab = Default_Tab_Stop;
        this.Locked = (undefined != obj.Locked && null != obj.Locked) ? obj.Locked : false;
        this.CanAddTable = (undefined != obj.CanAddTable) ? obj.CanAddTable : true;
        this.Subscript = (undefined != obj.Subscript) ? obj.Subscript : undefined;
        this.Superscript = (undefined != obj.Superscript) ? obj.Superscript : undefined;
        this.SmallCaps = (undefined != obj.SmallCaps) ? obj.SmallCaps : undefined;
        this.AllCaps = (undefined != obj.AllCaps) ? obj.AllCaps : undefined;
        this.Strikeout = (undefined != obj.Strikeout) ? obj.Strikeout : undefined;
        this.DStrikeout = (undefined != obj.DStrikeout) ? obj.DStrikeout : undefined;
        this.TextSpacing = (undefined != obj.TextSpacing) ? obj.TextSpacing : undefined;
        this.Position = (undefined != obj.Position) ? obj.Position : undefined;
    } else {
        this.ContextualSpacing = undefined;
        this.Ind = new asc_CParagraphInd();
        this.KeepLines = undefined;
        this.KeepNext = undefined;
        this.WidowControl = undefined;
        this.PageBreakBefore = undefined;
        this.Spacing = new asc_CParagraphSpacing();
        this.Brd = undefined;
        this.Shd = undefined;
        this.Locked = false;
        this.CanAddTable = true;
        this.Tabs = undefined;
        this.Subscript = undefined;
        this.Superscript = undefined;
        this.SmallCaps = undefined;
        this.AllCaps = undefined;
        this.Strikeout = undefined;
        this.DStrikeout = undefined;
        this.TextSpacing = undefined;
        this.Position = undefined;
    }
}
asc_CParagraphProperty.prototype = {
    asc_getContextualSpacing: function () {
        return this.ContextualSpacing;
    },
    asc_putContextualSpacing: function (v) {
        this.ContextualSpacing = v;
    },
    asc_getInd: function () {
        return this.Ind;
    },
    asc_putInd: function (v) {
        this.Ind = v;
    },
    asc_getKeepLines: function () {
        return this.KeepLines;
    },
    asc_putKeepLines: function (v) {
        this.KeepLines = v;
    },
    asc_getKeepNext: function () {
        return this.KeepNext;
    },
    asc_putKeepNext: function (v) {
        this.KeepNext = v;
    },
    asc_getPageBreakBefore: function () {
        return this.PageBreakBefore;
    },
    asc_putPageBreakBefore: function (v) {
        this.PageBreakBefore = v;
    },
    asc_getWidowControl: function () {
        return this.WidowControl;
    },
    asc_putWidowControl: function (v) {
        this.WidowControl = v;
    },
    asc_getSpacing: function () {
        return this.Spacing;
    },
    asc_putSpacing: function (v) {
        this.Spacing = v;
    },
    asc_getBorders: function () {
        return this.Brd;
    },
    asc_putBorders: function (v) {
        this.Brd = v;
    },
    asc_getShade: function () {
        return this.Shd;
    },
    asc_putShade: function (v) {
        this.Shd = v;
    },
    asc_getLocked: function () {
        return this.Locked;
    },
    asc_getCanAddTable: function () {
        return this.CanAddTable;
    },
    asc_getSubscript: function () {
        return this.Subscript;
    },
    asc_putSubscript: function (v) {
        this.Subscript = v;
    },
    asc_getSuperscript: function () {
        return this.Superscript;
    },
    asc_putSuperscript: function (v) {
        this.Superscript = v;
    },
    asc_getSmallCaps: function () {
        return this.SmallCaps;
    },
    asc_putSmallCaps: function (v) {
        this.SmallCaps = v;
    },
    asc_getAllCaps: function () {
        return this.AllCaps;
    },
    asc_putAllCaps: function (v) {
        this.AllCaps = v;
    },
    asc_getStrikeout: function () {
        return this.Strikeout;
    },
    asc_putStrikeout: function (v) {
        this.Strikeout = v;
    },
    asc_getDStrikeout: function () {
        return this.DStrikeout;
    },
    asc_putDStrikeout: function (v) {
        this.DStrikeout = v;
    },
    asc_getTextSpacing: function () {
        return this.TextSpacing;
    },
    asc_putTextSpacing: function (v) {
        this.TextSpacing = v;
    },
    asc_getPosition: function () {
        return this.Position;
    },
    asc_putPosition: function (v) {
        this.Position = v;
    },
    asc_getTabs: function () {
        return this.Tabs;
    },
    asc_putTabs: function (v) {
        this.Tabs = v;
    },
    asc_getDefaultTab: function () {
        return this.DefaultTab;
    },
    asc_putDefaultTab: function (v) {
        this.DefaultTab = v;
    }
};
window["Asc"].asc_CParagraphProperty = asc_CParagraphProperty;
window["Asc"]["asc_CParagraphProperty"] = asc_CParagraphProperty;
prot = asc_CParagraphProperty.prototype;
prot["asc_getContextualSpacing"] = prot.asc_getContextualSpacing;
prot["asc_putContextualSpacing"] = prot.asc_putContextualSpacing;
prot["asc_getInd"] = prot.asc_getInd;
prot["asc_putInd"] = prot.asc_putInd;
prot["asc_getKeepLines"] = prot.asc_getKeepLines;
prot["asc_putKeepLines"] = prot.asc_putKeepLines;
prot["asc_getKeepNext"] = prot.asc_getKeepNext;
prot["asc_putKeepNext"] = prot.asc_putKeepNext;
prot["asc_getPageBreakBefore"] = prot.asc_getPageBreakBefore;
prot["asc_putPageBreakBefore"] = prot.asc_putPageBreakBefore;
prot["asc_getWidowControl"] = prot.asc_getWidowControl;
prot["asc_putWidowControl"] = prot.asc_putWidowControl;
prot["asc_getSpacing"] = prot.asc_getSpacing;
prot["asc_putSpacing"] = prot.asc_putSpacing;
prot["asc_getBorders"] = prot.asc_getBorders;
prot["asc_putBorders"] = prot.asc_putBorders;
prot["asc_getShade"] = prot.asc_getShade;
prot["asc_putShade"] = prot.asc_putShade;
prot["asc_getLocked"] = prot.asc_getLocked;
prot["asc_getCanAddTable"] = prot.asc_getCanAddTable;
prot["asc_getSubscript"] = prot.asc_getSubscript;
prot["asc_putSubscript"] = prot.asc_putSubscript;
prot["asc_getSuperscript"] = prot.asc_getSuperscript;
prot["asc_putSuperscript"] = prot.asc_putSuperscript;
prot["asc_getSmallCaps"] = prot.asc_getSmallCaps;
prot["asc_putSmallCaps"] = prot.asc_putSmallCaps;
prot["asc_getAllCaps"] = prot.asc_getAllCaps;
prot["asc_putAllCaps"] = prot.asc_putAllCaps;
prot["asc_getStrikeout"] = prot.asc_getStrikeout;
prot["asc_putStrikeout"] = prot.asc_putStrikeout;
prot["asc_getDStrikeout"] = prot.asc_getDStrikeout;
prot["asc_putDStrikeout"] = prot.asc_putDStrikeout;
prot["asc_getTextSpacing"] = prot.asc_getTextSpacing;
prot["asc_putTextSpacing"] = prot.asc_putTextSpacing;
prot["asc_getPosition"] = prot.asc_getPosition;
prot["asc_putPosition"] = prot.asc_putPosition;
prot["asc_getTabs"] = prot.asc_getTabs;
prot["asc_putTabs"] = prot.asc_putTabs;
prot["asc_getDefaultTab"] = prot.asc_getDefaultTab;
prot["asc_putDefaultTab"] = prot.asc_putDefaultTab;
function asc_CParagraphInd(obj) {
    if (obj) {
        this.Left = (undefined != obj.Left) ? obj.Left : null;
        this.Right = (undefined != obj.Right) ? obj.Right : null;
        this.FirstLine = (undefined != obj.FirstLine) ? obj.FirstLine : null;
    } else {
        this.Left = undefined;
        this.Right = undefined;
        this.FirstLine = undefined;
    }
}
asc_CParagraphInd.prototype = {
    asc_getLeft: function () {
        return this.Left;
    },
    asc_putLeft: function (v) {
        this.Left = v;
    },
    asc_getRight: function () {
        return this.Right;
    },
    asc_putRight: function (v) {
        this.Right = v;
    },
    asc_getFirstLine: function () {
        return this.FirstLine;
    },
    asc_putFirstLine: function (v) {
        this.FirstLine = v;
    }
};
window["Asc"].asc_CParagraphInd = asc_CParagraphInd;
window["Asc"]["asc_CParagraphInd"] = asc_CParagraphInd;
prot = asc_CParagraphInd.prototype;
prot["asc_getLeft"] = prot.asc_getLeft;
prot["asc_putLeft"] = prot.asc_putLeft;
prot["asc_getRight"] = prot.asc_getRight;
prot["asc_putRight"] = prot.asc_putRight;
prot["asc_getFirstLine"] = prot.asc_getFirstLine;
prot["asc_getFirstLine"] = prot.asc_getFirstLine;
function asc_CParagraphSpacing(obj) {
    if (obj) {
        this.Line = (undefined != obj.Line) ? obj.Line : null;
        this.LineRule = (undefined != obj.LineRule) ? obj.LineRule : null;
        this.Before = (undefined != obj.Before) ? obj.Before : null;
        this.After = (undefined != obj.After) ? obj.After : null;
    } else {
        this.Line = undefined;
        this.LineRule = undefined;
        this.Before = undefined;
        this.After = undefined;
    }
}
asc_CParagraphSpacing.prototype = {
    asc_getLine: function () {
        return this.Line;
    },
    asc_getLineRule: function () {
        return this.LineRule;
    },
    asc_getBefore: function () {
        return this.Before;
    },
    asc_getAfter: function () {
        return this.After;
    }
};
window["Asc"].asc_CParagraphSpacing = asc_CParagraphSpacing;
window["Asc"]["asc_CParagraphSpacing"] = asc_CParagraphSpacing;
prot = asc_CParagraphSpacing.prototype;
prot["asc_getLine"] = prot.asc_getLine;
prot["asc_getLineRule"] = prot.asc_getLineRule;
prot["asc_getBefore"] = prot.asc_getBefore;
prot["asc_getAfter"] = prot.asc_getAfter;
function asc_CParagraphShd(obj) {
    if (obj) {
        this.Value = (undefined != obj.Value) ? obj.Value : null;
        this.Color = (undefined != obj.Color && null != obj.Color) ? CreateAscColorCustom(obj.Color.r, obj.Color.g, obj.Color.b) : null;
    } else {
        this.Value = shd_Nil;
        this.Color = CreateAscColorCustom(255, 255, 255);
    }
}
asc_CParagraphShd.prototype = {
    asc_getValue: function () {
        return this.Value;
    },
    asc_putValue: function (v) {
        this.Value = v;
    },
    asc_getColor: function () {
        return this.Color;
    },
    asc_putColor: function (v) {
        this.Color = (v) ? v : null;
    }
};
window["Asc"].asc_CParagraphShd = asc_CParagraphShd;
window["Asc"]["asc_CParagraphShd"] = asc_CParagraphShd;
prot = asc_CParagraphShd.prototype;
prot["asc_getValue"] = prot.asc_getValue;
prot["asc_putValue"] = prot.asc_putValue;
prot["asc_getColor"] = prot.asc_getColor;
prot["asc_putColor"] = prot.asc_putColor;
function asc_CParagraphTab(Pos, Value) {
    this.Pos = Pos;
    this.Value = Value;
}
asc_CParagraphTab.prototype = {
    asc_getValue: function () {
        return this.Value;
    },
    asc_putValue: function (v) {
        this.Value = v;
    },
    asc_getPos: function () {
        return this.Pos;
    },
    asc_putPos: function (v) {
        this.Pos = v;
    }
};
window["Asc"].asc_CParagraphTab = asc_CParagraphTab;
window["Asc"]["asc_CParagraphTab"] = asc_CParagraphTab;
prot = asc_CParagraphTab.prototype;
prot["asc_getValue"] = prot.asc_getValue;
prot["asc_putValue"] = prot.asc_putValue;
prot["asc_getPos"] = prot.asc_getPos;
prot["asc_putPos"] = prot.asc_putPos;
function asc_CParagraphTabs(obj) {
    this.Tabs = new Array();
    if (undefined != obj) {
        var Count = obj.Tabs.length;
        for (var Index = 0; Index < Count; Index++) {
            this.Tabs.push(new asc_CParagraphTab(obj.Tabs[Index].Pos, obj.Tabs[Index].Value));
        }
    }
}
asc_CParagraphTabs.prototype = {
    asc_getCount: function () {
        return this.Tabs.length;
    },
    asc_getTab: function (Index) {
        return this.Tabs[Index];
    },
    asc_addTab: function (Tab) {
        this.Tabs.push(Tab);
    },
    asc_clear: function () {
        this.Tabs.length = 0;
    },
    add_Tab: function (Tab) {
        this.Tabs.push(Tab);
    }
};
window["Asc"].asc_CParagraphTabs = asc_CParagraphTabs;
window["Asc"]["asc_CParagraphTabs"] = asc_CParagraphTabs;
prot = asc_CParagraphTabs.prototype;
prot["asc_getCount"] = prot.asc_getCount;
prot["asc_getTab"] = prot.asc_getTab;
prot["asc_addTab"] = prot.asc_addTab;
prot["asc_clear"] = prot.asc_clear;
prot["add_Tab"] = prot.add_Tab;
function asc_CParagraphBorders(obj) {
    if (obj) {
        this.Left = (undefined != obj.Left && null != obj.Left) ? new asc_CTextBorder(obj.Left) : null;
        this.Top = (undefined != obj.Top && null != obj.Top) ? new asc_CTextBorder(obj.Top) : null;
        this.Right = (undefined != obj.Right && null != obj.Right) ? new asc_CTextBorder(obj.Right) : null;
        this.Bottom = (undefined != obj.Bottom && null != obj.Bottom) ? new asc_CTextBorder(obj.Bottom) : null;
        this.Between = (undefined != obj.Between && null != obj.Between) ? new asc_CTextBorder(obj.Between) : null;
    } else {
        this.Left = null;
        this.Top = null;
        this.Right = null;
        this.Bottom = null;
        this.Between = null;
    }
}
asc_CParagraphBorders.prototype = {
    asc_getLeft: function () {
        return this.Left;
    },
    asc_putLeft: function (v) {
        this.Left = (v) ? new asc_CTextBorder(v) : null;
    },
    asc_getTop: function () {
        return this.Top;
    },
    asc_putTop: function (v) {
        this.Top = (v) ? new asc_CTextBorder(v) : null;
    },
    asc_getRight: function () {
        return this.Right;
    },
    asc_putRight: function (v) {
        this.Right = (v) ? new asc_CTextBorder(v) : null;
    },
    asc_getBottom: function () {
        return this.Bottom;
    },
    asc_putBottom: function (v) {
        this.Bottom = (v) ? new asc_CTextBorder(v) : null;
    },
    asc_getBetween: function () {
        return this.Between;
    },
    asc_putBetween: function (v) {
        this.Between = (v) ? new asc_CTextBorder(v) : null;
    }
};
window["Asc"].asc_CParagraphBorders = asc_CParagraphBorders;
window["Asc"]["asc_CParagraphBorders"] = asc_CParagraphBorders;
prot = asc_CParagraphBorders.prototype;
prot["asc_getLeft"] = prot.asc_getLeft;
prot["asc_putLeft"] = prot.asc_putLeft;
prot["asc_getTop"] = prot.asc_getTop;
prot["asc_putTop"] = prot.asc_putTop;
prot["asc_getRight"] = prot.asc_getRight;
prot["asc_putRight"] = prot.asc_putRight;
prot["asc_getBottom"] = prot.asc_getBottom;
prot["asc_putBottom"] = prot.asc_putBottom;
prot["asc_getBetween"] = prot.asc_getBetween;
prot["asc_putBetween"] = prot.asc_putBetween;
function asc_CTextBorder(obj) {
    if (obj) {
        this.Color = (undefined != obj.Color && null != obj.Color) ? CreateAscColorCustomEx(obj.Color.r, obj.Color.g, obj.Color.b) : null;
        this.Size = (undefined != obj.Size) ? obj.Size : null;
        this.Value = (undefined != obj.Value) ? obj.Value : null;
        this.Space = (undefined != obj.Space) ? obj.Space : null;
    } else {
        this.Color = CreateAscColorCustomEx(0, 0, 0);
        this.Size = 0.5 * g_dKoef_pt_to_mm;
        this.Value = border_Single;
        this.Space = 0;
    }
}
asc_CTextBorder.prototype = {
    asc_getColor: function () {
        return this.Color;
    },
    asc_putColor: function (v) {
        this.Color = v;
    },
    asc_getSize: function () {
        return this.Size;
    },
    asc_putSize: function (v) {
        this.Size = v;
    },
    asc_getValue: function () {
        return this.Value;
    },
    asc_putValue: function (v) {
        this.Value = v;
    },
    asc_getSpace: function () {
        return this.Space;
    },
    asc_putSpace: function (v) {
        this.Space = v;
    },
    asc_getForSelectedCells: function () {
        return this.ForSelectedCells;
    },
    asc_putForSelectedCells: function (v) {
        this.ForSelectedCells = v;
    }
};
window["Asc"].asc_CTextBorder = asc_CTextBorder;
window["Asc"]["asc_CTextBorder"] = asc_CTextBorder;
prot = asc_CTextBorder.prototype;
prot["asc_getColor"] = prot.asc_getColor;
prot["asc_putColor"] = prot.asc_putColor;
prot["asc_getSize"] = prot.asc_getSize;
prot["asc_putSize"] = prot.asc_putSize;
prot["asc_getValue"] = prot.asc_getValue;
prot["asc_putValue"] = prot.asc_putValue;
prot["asc_getSpace"] = prot.asc_getSpace;
prot["asc_putSpace"] = prot.asc_putSpace;
prot["asc_getForSelectedCells"] = prot.asc_getForSelectedCells;
prot["asc_putForSelectedCells"] = prot.asc_putForSelectedCells;
function asc_CListType(obj) {
    if (obj) {
        this.Type = (undefined == obj.Type) ? null : obj.Type;
        this.SubType = (undefined == obj.Type) ? null : obj.SubType;
    } else {
        this.Type = null;
        this.SubType = null;
    }
}
asc_CListType.prototype = {
    asc_getListType: function () {
        return this.Type;
    },
    asc_getListSubType: function () {
        return this.SubType;
    }
};
window["Asc"].asc_CListType = asc_CListType;
window["Asc"]["asc_CListType"] = asc_CListType;
prot = asc_CListType.prototype;
prot["asc_getListType"] = prot.asc_getListType;
prot["asc_getListSubType"] = prot.asc_getListSubType;
function asc_CTextFontFamily(obj) {
    if (obj) {
        this.Name = (undefined != obj.Name) ? obj.Name : null;
        this.Index = (undefined != obj.Index) ? obj.Index : null;
    } else {
        this.Name = "Times New Roman";
        this.Index = -1;
    }
}
asc_CTextFontFamily.prototype = {
    asc_getName: function () {
        return this.Name;
    },
    asc_getIndex: function () {
        return this.Index;
    }
};
window["Asc"].asc_CTextFontFamily = asc_CTextFontFamily;
window["Asc"]["asc_CTextFontFamily"] = asc_CTextFontFamily;
prot = asc_CTextFontFamily.prototype;
prot["asc_getName"] = prot.asc_getName;
prot["asc_getIndex"] = prot.asc_getIndex;
function Exception(error) {
    var err = error;
}
function DrawingObjects() {
    var ScrollOffset = function () {
        this.getX = function () {
            return -ptToPx((worksheet.cols[worksheet.visibleRange.c1].left - worksheet.cellsLeft)) + worksheet.getCellLeft(0, 0);
        };
        this.getY = function () {
            return -ptToPx((worksheet.rows[worksheet.visibleRange.r1].top - worksheet.cellsTop)) + worksheet.getCellTop(0, 0);
        };
    };
    var _this = this;
    var asc = window["Asc"];
    var api = asc["editor"];
    var asc_Range = asc.Range;
    var chartRender = null;
    if (typeof ChartRender !== "undefined") {
        chartRender = new ChartRender();
    }
    var worksheet = null;
    var drawingCtx = null;
    var overlayCtx = null;
    var shapeCtx = null;
    var shapeOverlayCtx = null;
    var trackOverlay = null;
    var autoShapeTrack = null;
    var scrollOffset = new ScrollOffset();
    var aObjects = null;
    var aBoundsCheckers = [];
    var userId = null;
    var documentId = null;
    _this.zoom = {
        last: 1,
        current: 1
    };
    _this.isViewerMode = null;
    _this.objectLocker = null;
    _this.coordsManager = null;
    _this.drawingDocument = null;
    _this.asyncImageEndLoaded = null;
    _this.asyncImagesDocumentEndLoaded = null;
    var wsCellCache = {
        cols: null,
        rows: null,
        isInit: false
    };
    var aDrawTasks = [];
    var drawTaskTimerId = null;
    function drawTaskFunction() {
        var taskLen = aDrawTasks.length;
        if (taskLen) {
            _this.showDrawingObjectsEx(aDrawTasks[taskLen - 1].params[0], aDrawTasks[taskLen - 1].params[1]);
            aDrawTasks.splice(0, (taskLen - 1 > 0) ? taskLen - 1 : 1);
        }
    }
    var DrawingBase = function (ws) {
        var _t = this;
        _t.worksheet = ws;
        _t.imageUrl = "";
        _t.Type = c_oAscCellAnchorType.cellanchorTwoCell;
        _t.Pos = {
            X: 0,
            Y: 0
        };
        _t.from = {
            col: 0,
            colOff: 0,
            row: 0,
            rowOff: 0
        };
        _t.to = {
            col: 0,
            colOff: 0,
            row: 0,
            rowOff: 0
        };
        _t.ext = {
            cx: 0,
            cy: 0
        };
        _t.size = {
            width: 0,
            height: 0
        };
        _t.graphicObject = null;
        _t.flags = {
            anchorUpdated: false,
            lockState: c_oAscLockTypes.kLockTypeNone
        };
        _t.getAllFonts = function (AllFonts) {
            _t.graphicObject && _t.graphicObject.getAllFonts && _t.graphicObject.getAllFonts(AllFonts);
        };
        _t.isImage = function () {
            return _t.graphicObject ? _t.graphicObject.isImage() : false;
        };
        _t.isShape = function () {
            return _t.graphicObject ? _t.graphicObject.isShape() : false;
        };
        _t.isGroup = function () {
            return _t.graphicObject ? _t.graphicObject.isGroup() : false;
        };
        _t.isChart = function () {
            return _t.graphicObject ? _t.graphicObject.isChart() : false;
        };
        _t.isGraphicObject = function () {
            return _t.graphicObject != null;
        };
        _t.isLocked = function () {
            return ((_t.graphicObject.lockType != c_oAscLockTypes.kLockTypeNone) && (_t.graphicObject.lockType != c_oAscLockTypes.kLockTypeMine));
        };
        _t.getWorkbook = function () {
            return (_t.worksheet ? _t.worksheet.model.workbook : null);
        };
        _t.getCanvasContext = function () {
            return _this.drawingDocument.CanvasHitContext;
        };
        _t.getGraphicObjectMetrics = function () {
            var metrics = {
                x: 0,
                y: 0,
                extX: 0,
                extY: 0
            };
            var coordsFrom = _this.coordsManager.calculateCoords(_t.from);
            metrics.x = pxToMm(coordsFrom.x);
            metrics.y = pxToMm(coordsFrom.y);
            var coordsTo = _this.coordsManager.calculateCoords(_t.to);
            metrics.extX = pxToMm(coordsTo.x - coordsFrom.x);
            metrics.extY = pxToMm(coordsTo.y - coordsFrom.y);
            return metrics;
        };
        _t.setGraphicObjectCoords = function () {
            if (_t.isGraphicObject()) {
                if ((_t.graphicObject.x < 0) || (_t.graphicObject.y < 0) || (_t.graphicObject.extX <= 0) || (_t.graphicObject.extY <= 0)) {
                    return;
                }
                var fromCell = _this.coordsManager.calculateCell(mmToPx(_t.graphicObject.x), mmToPx(_t.graphicObject.y));
                var toCell = _this.coordsManager.calculateCell(mmToPx(_t.graphicObject.x + _t.graphicObject.extX), mmToPx(_t.graphicObject.y + _t.graphicObject.extY));
                _t.from.col = fromCell.col;
                _t.from.colOff = fromCell.colOff;
                _t.from.row = fromCell.row;
                _t.from.rowOff = fromCell.rowOff;
                _t.to.col = toCell.col;
                _t.to.colOff = toCell.colOff;
                _t.to.row = toCell.row;
                _t.to.rowOff = toCell.rowOff;
            }
        };
        _t.inVisibleArea = function () {
            var result = true;
            var fvc = _t.worksheet.getFirstVisibleCol();
            var fvr = _t.worksheet.getFirstVisibleRow();
            var lvc = _t.worksheet.getLastVisibleCol();
            var lvr = _t.worksheet.getLastVisibleRow();
            var checker = _this.getBoundsChecker(_t);
            var coords = _this.getBoundsCheckerCoords(checker);
            if (coords) {
                if ((fvr > coords.to.row + 1) || (lvr < coords.from.rom - 1) || (fvc > coords.to.col + 1) || (lvc < coords.from.col - 1)) {
                    result = false;
                }
            }
            return result;
        };
        _t.updateAnchorPosition = function () {
            switch (_t.Type) {
            case c_oAscCellAnchorType.cellanchorOneCell:
                var coordsFrom = _this.coordsManager.calculateCoords(_t.from);
                var cellTo = _this.coordsManager.calculateCell(coordsFrom.x + mmToPx(_t.ext.cx), coordsFrom.y + mmToPx(_t.ext.cy));
                _t.to.col = cellTo.col;
                _t.to.colOff = cellTo.colOff;
                _t.to.row = cellTo.row;
                _t.to.rowOff = cellTo.rowOff;
                break;
            case c_oAscCellAnchorType.cellanchorAbsolute:
                if (_t.Pos.X < 0) {
                    _t.Pos.X = 0;
                }
                if (_t.Pos.Y < 0) {
                    _t.Pos.Y = 0;
                }
                var cellFrom = _this.coordsManager.calculateCell(mmToPx(_t.Pos.X), mmToPx(_t.Pos.Y));
                _t.from.col = cellFrom.col;
                _t.from.colOff = cellFrom.colOff;
                _t.from.row = cellFrom.row;
                _t.from.rowOff = cellFrom.rowOff;
                var cellTo = _this.coordsManager.calculateCell(mmToPx(_t.Pos.X + _t.ext.cx), mmToPx(_t.Pos.Y + _t.ext.cy));
                _t.to.col = cellTo.col;
                _t.to.colOff = cellTo.colOff;
                _t.to.row = cellTo.row;
                _t.to.rowOff = cellTo.rowOff;
                break;
            }
            _t.flags.anchorUpdated = true;
        };
        _t.getRealTopOffset = function () {
            var val = _t.worksheet.getCellTop(_t.from.row, 0) + mmToPx(_t.from.rowOff);
            return asc.round(val);
        };
        _t.getRealLeftOffset = function () {
            var val = _t.worksheet.getCellLeft(_t.from.col, 0) + mmToPx(_t.from.colOff);
            return asc.round(val);
        };
        _t.getWidthFromTo = function () {
            var val = _t.worksheet.getCellLeft(_t.to.col, 0) + mmToPx(_t.to.colOff) - _t.worksheet.getCellLeft(_t.from.col, 0) - mmToPx(_t.from.colOff);
            return val;
        };
        _t.getHeightFromTo = function () {
            var val = _t.worksheet.getCellTop(_t.to.row, 0) + mmToPx(_t.to.rowOff) - _t.worksheet.getCellTop(_t.from.row, 0) - mmToPx(_t.from.rowOff);
            return val;
        };
        _t.getVisibleTopOffset = function (withHeader) {
            var headerRowOff = _t.worksheet.getCellTop(0, 0);
            var fvr = _t.worksheet.getCellTop(_t.worksheet.getFirstVisibleRow(), 0);
            var off = _t.getRealTopOffset() - fvr;
            var off = (off > 0) ? off : 0;
            return withHeader ? headerRowOff + off : off;
        };
        _t.getVisibleLeftOffset = function (withHeader) {
            var headerColOff = _t.worksheet.getCellLeft(0, 0);
            var fvc = _t.worksheet.getCellLeft(_t.worksheet.getFirstVisibleCol(), 0);
            var off = _t.getRealLeftOffset() - fvc;
            var off = (off > 0) ? off : 0;
            return withHeader ? headerColOff + off : off;
        };
        _t.getInnerOffsetTop = function () {
            var fvr = _t.worksheet.getCellTop(_t.worksheet.getFirstVisibleRow(), 0);
            var off = _t.getRealTopOffset() - fvr;
            return (off > 0) ? 0 : asc.round(Math.abs(off));
        };
        _t.getInnerOffsetLeft = function () {
            var fvc = _t.worksheet.getCellLeft(_t.worksheet.getFirstVisibleCol(), 0);
            var off = _t.getRealLeftOffset() - fvc;
            return (off > 0) ? 0 : asc.round(Math.abs(off));
        };
        _t.getDrawingObjects = function () {
            return _this;
        };
    };
    _this.createDrawingObject = function () {
        var drawing = new DrawingBase(worksheet);
        return drawing;
    };
    _this.cloneDrawingObject = function (obj) {
        var copyObject = _this.createDrawingObject();
        copyObject.Type = obj.Type;
        copyObject.Pos.X = obj.Pos.X;
        copyObject.Pos.Y = obj.Pos.Y;
        copyObject.ext.cx = obj.ext.cx;
        copyObject.ext.cy = obj.ext.cy;
        copyObject.from.col = obj.from.col;
        copyObject.from.colOff = obj.from.colOff;
        copyObject.from.row = obj.from.row;
        copyObject.from.rowOff = obj.from.rowOff;
        copyObject.to.col = obj.to.col;
        copyObject.to.colOff = obj.to.colOff;
        copyObject.to.row = obj.to.row;
        copyObject.to.rowOff = obj.to.rowOff;
        copyObject.graphicObject = obj.graphicObject;
        if (typeof CChartAsGroup !== "undefined" && copyObject.graphicObject instanceof CChartAsGroup) {
            var chart = copyObject.graphicObject.chart;
            var uniColors = chart.generateUniColors(chart.series.length);
            if (chart.type == c_oAscChartType.hbar) {
                uniColors = OfficeExcel.array_reverse(uniColors);
            }
            for (var i = 0; i < chart.series.length; i++) {
                if (!chart.series[i].OutlineColor) {
                    chart.series[i].OutlineColor = uniColors[i];
                }
                if (!chart.series[i].Tx) {
                    chart.series[i].Tx = api.chartTranslate.series + " " + (i + 1);
                }
            }
        }
        return copyObject;
    };
    _this.init = function (currentSheet) {
        var taskTimerId = setInterval(drawTaskFunction, 5);
        userId = api.User.asc_getId();
        documentId = api.documentId;
        worksheet = currentSheet;
        drawingCtx = currentSheet.drawingCtx;
        overlayCtx = currentSheet.overlayCtx;
        shapeCtx = currentSheet.shapeCtx;
        shapeOverlayCtx = currentSheet.shapeOverlayCtx;
        trackOverlay = new COverlay();
        trackOverlay.init(shapeOverlayCtx.m_oContext, "ws-canvas-overlay", 0, 0, shapeOverlayCtx.m_lWidthPix, shapeOverlayCtx.m_lHeightPix, shapeOverlayCtx.m_dWidthMM, shapeOverlayCtx.m_dHeightMM);
        autoShapeTrack = new CAutoshapeTrack();
        autoShapeTrack.init(trackOverlay, 0, 0, shapeOverlayCtx.m_lWidthPix, shapeOverlayCtx.m_lHeightPix, shapeOverlayCtx.m_dWidthMM, shapeOverlayCtx.m_dHeightMM);
        shapeCtx.m_oAutoShapesTrack = autoShapeTrack;
        _this.objectLocker = new ObjectLocker(worksheet);
        _this.coordsManager = new CoordsManager(worksheet, true);
        _this.drawingDocument = new CDrawingDocument(this);
        _this.drawingDocument.AutoShapesTrack = autoShapeTrack;
        _this.drawingDocument.TargetHtmlElement = document.getElementById("id_target_cursor");
        _this.drawingDocument.InitGuiCanvasShape(api.shapeElementId);
        _this.isViewerMode = function () {
            return worksheet._trigger("getViewerMode");
        };
        aObjects = [];
        aImagesSync = [];
        aObjectsSync = [];
        var theme = api.wbModel.theme;
        for (var i = 0; currentSheet.model.Drawings && (i < currentSheet.model.Drawings.length); i++) {
            var drawingObject = _this.cloneDrawingObject(currentSheet.model.Drawings[i]);
            drawingObject.updateAnchorPosition();
            if (!worksheet.cols[drawingObject.to.col]) {
                while (!worksheet.cols[drawingObject.to.col]) {
                    worksheet.expandColsOnScroll(true);
                }
                worksheet.expandColsOnScroll(true);
            }
            if (!worksheet.rows[drawingObject.to.row]) {
                while (!worksheet.rows[drawingObject.to.row]) {
                    worksheet.expandRowsOnScroll(true);
                }
                worksheet.expandRowsOnScroll(true);
            }
            if (typeof CChartAsGroup !== "undefined" && drawingObject.graphicObject instanceof CChartAsGroup) {
                _this.calcChartInterval(drawingObject.graphicObject.chart);
                drawingObject.graphicObject.drawingBase = drawingObject;
                drawingObject.graphicObject.setDrawingObjects(_this);
                if (drawingObject.graphicObject.chartTitle) {
                    drawingObject.graphicObject.chartTitle.drawingObjects = _this;
                }
                drawingObject.graphicObject.chart.worksheet = worksheet;
                drawingObject.graphicObject.chart.rebuildSeries();
                drawingObject.graphicObject.init(theme);
                History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateAfterInit2Chart, null, null, new UndoRedoDataGraphicObjects(drawingObject.graphicObject.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
                drawingObject.graphicObject.addToDrawingObjects(undefined, false);
                var boundsChecker = _this.getBoundsChecker(drawingObject);
                aBoundsCheckers.push(boundsChecker);
            }
            if (drawingObject.graphicObject instanceof CShape) {
                drawingObject.graphicObject.drawingBase = drawingObject;
                drawingObject.graphicObject.setDrawingObjects(_this);
                drawingObject.graphicObject.setDrawingDocument(_this.drawingDocument);
                var xfrm = drawingObject.graphicObject.spPr.xfrm;
                if (!xfrm) {
                    drawingObject.graphicObject.setXfrmObject(new CXfrm());
                }
                if (isRealObject(drawingObject.graphicObject.drawingBase)) {
                    var metrics = drawingObject.graphicObject.drawingBase.getGraphicObjectMetrics();
                    drawingObject.graphicObject.spPr.xfrm.setPosition(metrics.x, metrics.y);
                    drawingObject.graphicObject.spPr.xfrm.setExtents(metrics.extX, metrics.extY);
                }
                drawingObject.graphicObject.recalculate(aImagesSync);
                History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateAfterInit, null, null, new UndoRedoDataGraphicObjects(drawingObject.graphicObject.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
                drawingObject.graphicObject.addToDrawingObjects(undefined, false);
                var boundsChecker = _this.getBoundsChecker(drawingObject);
                aBoundsCheckers.push(boundsChecker);
            }
            if (drawingObject.graphicObject instanceof CImageShape) {
                aObjectsSync[aObjectsSync.length] = drawingObject;
                drawingObject.graphicObject.drawingBase = drawingObject;
                drawingObject.graphicObject.setDrawingDocument(_this.drawingDocument);
                drawingObject.graphicObject.setDrawingObjects(_this);
                var xfrm = drawingObject.graphicObject.spPr.xfrm;
                if (!xfrm) {
                    drawingObject.graphicObject.setXfrmObject(new CXfrm());
                }
                if (isRealObject(drawingObject.graphicObject.drawingBase)) {
                    var metrics = drawingObject.graphicObject.drawingBase.getGraphicObjectMetrics();
                    drawingObject.graphicObject.spPr.xfrm.setPosition(metrics.x, metrics.y);
                    drawingObject.graphicObject.spPr.xfrm.setExtents(metrics.extX, metrics.extY);
                }
                drawingObject.graphicObject.recalculate(aImagesSync);
                History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_GroupRecalculateAfterLoad, null, null, new UndoRedoDataGraphicObjects(drawingObject.graphicObject.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
                drawingObject.graphicObject.addToDrawingObjects(undefined, false);
            }
            if (drawingObject.graphicObject instanceof CGroupShape) {
                drawingObject.graphicObject.drawingBase = drawingObject;
                drawingObject.graphicObject.setDrawingObjects(_this);
                var xfrm = drawingObject.graphicObject.spPr.xfrm;
                if (!xfrm) {
                    drawingObject.graphicObject.setXfrmObject(new CXfrm());
                }
                if (isRealObject(drawingObject.graphicObject.drawingBase)) {}
                drawingObject.graphicObject.setDrawingDocument(this.drawingDocument);
                var old_len = aImagesSync.length;
                drawingObject.graphicObject.initCharts();
                drawingObject.graphicObject.recalculate(aImagesSync);
                if (aImagesSync.length > old_len) {
                    aObjectsSync[aObjectsSync.length] = drawingObject;
                }
                History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_GroupRecalculateAfterLoad, null, null, new UndoRedoDataGraphicObjects(drawingObject.graphicObject.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
                drawingObject.graphicObject.addToDrawingObjects(undefined, false);
                var boundsChecker = _this.getBoundsChecker(drawingObject);
                aBoundsCheckers.push(boundsChecker);
            }
        }
        _this.asyncImagesDocumentEndLoaded = function () {
            for (var i = 0; i < aObjectsSync.length; i++) {
                var drawingObject = aObjectsSync[i];
                var image = api.ImageLoader.LoadImage(aImagesSync[i], 1);
                if (image != null) {
                    drawingObject.graphicObject.recalculate();
                    drawingObject.setGraphicObjectCoords();
                    drawingObject.graphicObject.draw(shapeCtx);
                    var boundsChecker = _this.getBoundsChecker(drawingObject);
                    aBoundsCheckers.push(boundsChecker);
                }
            }
        };
        api.ImageLoader.LoadDocumentImages(aImagesSync);
        if (window.addEventListener) {
            window.addEventListener("message", this._uploadMessage, false);
        } else {
            if (window.attachEvent) {
                window.attachEvent("onmessage", this._uploadMessage);
            }
        }
        _this.shiftMap = {};
        worksheet.model.Drawings = aObjects;
    };
    _this.preCopy = function () {
        _this.shiftMap = {};
        var selected_objects = _this.controller.selectedObjects;
        if (selected_objects.length > 0) {
            var min_x, min_y;
            min_x = selected_objects[0].x;
            min_y = selected_objects[0].y;
            for (var i = 1; i < selected_objects.length; ++i) {
                if (selected_objects[i].x < min_x) {
                    min_x = selected_objects[i].x;
                }
                if (selected_objects[i].y < min_y) {
                    min_y = selected_objects[i].y;
                }
            }
            for (var i = 0; i < selected_objects.length; ++i) {
                _this.shiftMap[selected_objects[i].Get_Id()] = {
                    x: selected_objects[i].x - min_x,
                    y: selected_objects[i].y - min_y
                };
            }
        }
    };
    _this.getAllFonts = function (AllFonts) {};
    _this.getChartRender = function () {
        return chartRender;
    };
    _this.getOverlay = function () {
        return trackOverlay;
    };
    _this.OnUpdateOverlay = function (bFull) {
        var overlay = trackOverlay;
        var ctx = overlay.m_oContext;
        var drDoc = this.drawingDocument;
        overlay.Clear();
        this.drawingDocument.Overlay = overlay;
        var bFullClear = bFull || (_this.controller.curState.id != STATES_ID_TEXT_ADD) && (_this.controller.curState.id != STATES_ID_TEXT_ADD_IN_GROUP);
        if (bFullClear) {
            shapeOverlayCtx.m_oContext.clearRect(0, 0, shapeOverlayCtx.m_lWidthPix, shapeOverlayCtx.m_lHeightPix);
        } else {
            for (var i = 0; i < aObjects.length; i++) {
                var boundsChecker = _this.getBoundsChecker(aObjects[i]);
                var _w = boundsChecker.Bounds.max_x - boundsChecker.Bounds.min_x;
                var _h = boundsChecker.Bounds.max_y - boundsChecker.Bounds.min_y;
                shapeOverlayCtx.m_oContext.clearRect(mmToPx(boundsChecker.Bounds.min_x) + scrollOffset.getX(), mmToPx(boundsChecker.Bounds.min_y) + scrollOffset.getY(), mmToPx(_w), mmToPx(_h));
            }
        }
        _this.clipGraphicsCanvas(shapeOverlayCtx);
        worksheet._drawCollaborativeElements(false);
        if (!_this.controller.selectedObjects.length && !api.isStartAddShape) {
            worksheet._drawSelection();
        }
        var bRaise = false;
        for (var i = 0; i < _this.controller.selectedObjects.length; i++) {
            if (_this.controller.selectedObjects[i].isChart()) {
                if (_this.selectDrawingObjectRange(_this.controller.selectedObjects[i].Id)) {
                    bRaise = true;
                }
            }
        }
        if (bRaise) {
            _this.raiseLayerDrawingObjects();
        }
        if (null == drDoc.m_oDocumentRenderer) {
            if (drDoc.m_bIsSelection) {
                if (drDoc.m_bIsSelection) {
                    overlay.m_oControl.HtmlElement.style.display = "block";
                    if (null == overlay.m_oContext) {
                        overlay.m_oContext = overlay.m_oControl.HtmlElement.getContext("2d");
                    }
                }
                drDoc.private_StartDrawSelection(overlay);
                this.controller.drawTextSelection();
                drDoc.private_EndDrawSelection();
            }
            ctx.globalAlpha = 1;
            this.controller.drawSelection(drDoc);
            if (_this.controller.needUpdateOverlay()) {
                overlay.Show();
                shapeOverlayCtx.put_GlobalAlpha(true, 0.5);
                _this.controller.drawTracks(shapeOverlayCtx);
                shapeOverlayCtx.put_GlobalAlpha(true, 1);
            }
        } else {
            ctx.fillStyle = "rgba(51,102,204,255)";
            ctx.beginPath();
            for (var i = drDoc.m_lDrawingFirst; i <= drDoc.m_lDrawingEnd; i++) {
                var drawPage = drDoc.m_arrPages[i].drawingPage;
                drDoc.m_oDocumentRenderer.DrawSelection(i, overlay, drawPage.left, drawPage.top, drawPage.right - drawPage.left, drawPage.bottom - drawPage.top);
            }
            ctx.globalAlpha = 0.2;
            ctx.fill();
            ctx.beginPath();
            ctx.globalAlpha = 1;
        }
        _this.restoreGraphicsCanvas(shapeOverlayCtx);
        return true;
    };
    _this.changeZoom = function (factor) {
        _this.zoom.last = _this.zoom.current;
        _this.zoom.current = factor;
        _this.resizeCanvas();
        _this.setScrollOffset();
        _this.rebuildChartGraphicObjects();
    };
    _this.resizeCanvas = function () {
        for (var i = 0; i < drawingCtx.fmgrGraphics.length; i++) {
            drawingCtx.fmgrGraphics[i].ClearRasterMemory();
        }
        shapeCtx.init(drawingCtx.ctx, drawingCtx.getWidth(0), drawingCtx.getHeight(0), drawingCtx.getWidth(3), drawingCtx.getHeight(3));
        shapeCtx.CalculateFullTransform();
        shapeOverlayCtx.init(overlayCtx.ctx, overlayCtx.getWidth(0), overlayCtx.getHeight(0), overlayCtx.getWidth(3), overlayCtx.getHeight(3));
        shapeOverlayCtx.CalculateFullTransform();
        trackOverlay.init(shapeOverlayCtx.m_oContext, "ws-canvas-overlay", 0, 0, shapeOverlayCtx.m_lWidthPix, shapeOverlayCtx.m_lHeightPix, shapeOverlayCtx.m_dWidthMM, shapeOverlayCtx.m_dHeightMM);
        autoShapeTrack.init(trackOverlay, 0, 0, shapeOverlayCtx.m_lWidthPix, shapeOverlayCtx.m_lHeightPix, shapeOverlayCtx.m_dWidthMM, shapeOverlayCtx.m_dHeightMM);
        autoShapeTrack.Graphics.CalculateFullTransform();
    };
    _this.getWorkbook = function () {
        return (worksheet ? worksheet.model.workbook : null);
    };
    _this.getCanvasContext = function () {
        return _this.drawingDocument.CanvasHitContext;
    };
    _this.getDrawingObjects = function () {
        return aObjects;
    };
    _this.getWorksheet = function () {
        return worksheet;
    };
    _this._uploadMessage = function (event) {
        if (null != event && null != event.data) {
            try {
                var data = JSON.parse(event.data);
                if ((null != data) && (null != data["type"])) {
                    if (PostMessageType.UploadImage == data["type"]) {
                        if (c_oAscServerError.NoError == data["error"]) {
                            var sheetId = null;
                            if (null != data["input"]) {
                                sheetId = data["input"]["sheetId"];
                            }
                            var url = data["url"];
                            if (sheetId == worksheet.model.getId()) {
                                if (api.isImageChangeUrl || api.isShapeImageChangeUrl) {
                                    _this.editImageDrawingObject(url);
                                } else {
                                    _this.addImageDrawingObject(url, null);
                                }
                            } else {
                                worksheet.model.workbook.handlers.trigger("asc_onEndAction", c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadImage);
                            }
                        } else {
                            worksheet.model.workbook.handlers.trigger("asc_onError", api.asc_mapAscServerErrorToAscError(data["error"]), c_oAscError.Level.NoCritical);
                            worksheet.model.workbook.handlers.trigger("asc_onEndAction", c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadImage);
                        }
                    }
                }
            } catch(e) {
                var msg = e.message;
            }
        }
    };
    _this.callTrigger = function (triggerName, param) {
        if (triggerName) {
            worksheet.model.workbook.handlers.trigger(triggerName, param);
        }
    };
    _this.getBoundsChecker = function (drawingObject) {
        if (drawingObject && drawingObject.graphicObject) {
            var boundsChecker = new CSlideBoundsChecker();
            boundsChecker.init(1, 1, 1, 1);
            boundsChecker.transform3(drawingObject.graphicObject.transform);
            boundsChecker.rect(0, 0, drawingObject.graphicObject.extX, drawingObject.graphicObject.extY);
            drawingObject.graphicObject.draw(boundsChecker);
            boundsChecker.CorrectBounds();
            var delta = 4;
            boundsChecker.Bounds.min_x = Math.max(1, boundsChecker.Bounds.min_x - delta);
            boundsChecker.Bounds.min_y = Math.max(1, boundsChecker.Bounds.min_y - delta);
            boundsChecker.Bounds.max_x += delta;
            boundsChecker.Bounds.max_y += delta;
            return boundsChecker;
        }
        return null;
    };
    _this.getBoundsCheckerCoords = function (checker) {
        if (checker) {
            var coords = {
                from: null,
                to: null
            };
            coords.from = _this.coordsManager.calculateCell(mmToPx(checker.Bounds.min_x), mmToPx(checker.Bounds.min_y));
            coords.to = _this.coordsManager.calculateCell(mmToPx(checker.Bounds.max_x), mmToPx(checker.Bounds.max_y));
            return coords;
        }
        return null;
    };
    _this.clearDrawingObjects = function () {
        for (var i = 0; i < aBoundsCheckers.length; i++) {
            _this.restoreSheetArea(aBoundsCheckers[i]);
        }
        aBoundsCheckers = [];
        for (var i = 0; i < aObjects.length; i++) {
            if (!aObjects[i].inVisibleArea()) {
                continue;
            }
            var boundsChecker = _this.getBoundsChecker(aObjects[i]);
            aBoundsCheckers.push(boundsChecker);
        }
    };
    _this.restoreSheetArea = function (checker) {
        var coords = _this.getBoundsCheckerCoords(checker);
        if (coords) {
            var range = asc_Range(coords.from.col, coords.from.row, coords.to.col, coords.to.row);
            var r_ = range.intersection(worksheet.visibleRange);
            if (r_) {
                var offsetX = worksheet.cols[worksheet.visibleRange.c1].left - worksheet.cellsLeft;
                var offsetY = worksheet.rows[worksheet.visibleRange.r1].top - worksheet.cellsTop;
                while (!worksheet.cols[r_.c2 + 1]) {
                    worksheet.expandColsOnScroll(true);
                }
                while (!worksheet.rows[r_.r2 + 1]) {
                    worksheet.expandRowsOnScroll(true);
                }
                var x1 = worksheet.cols[r_.c1].left - offsetX;
                var y1 = worksheet.rows[r_.r1].top - offsetY;
                var x2 = worksheet.cols[r_.c2 + 1].left - offsetX;
                var y2 = worksheet.rows[r_.r2 + 1].top - offsetY;
                var w = x2 - x1;
                var h = y2 - y1;
                drawingCtx.clearRect(x1, y1, w, h);
                drawingCtx.setFillStyle(worksheet.settings.cells.defaultState.background).fillRect(x1, y1, w, h);
                worksheet._drawGrid(undefined, r_);
                worksheet._drawCells(undefined, r_);
                worksheet._drawCellsBorders(undefined, r_);
            }
        }
    };
    _this.raiseLayerDrawingObjects = function () {
        var bRedraw = false;
        var selection = worksheet.activeRange.clone(true);
        function isRangeInObject(range) {
            var result = false;
            if (range) {
                var x1 = worksheet.getCellLeft(range.c1, 3);
                var y1 = worksheet.getCellTop(range.r1, 3);
                var x2 = worksheet.getCellLeft(range.c2 + 1, 3);
                var y2 = worksheet.getCellTop(range.r1, 3);
                var x3 = worksheet.getCellLeft(range.c2 + 1, 3);
                var y3 = worksheet.getCellTop(range.r2 + 1, 3);
                var x4 = worksheet.getCellLeft(range.c1, 3);
                var y4 = worksheet.getCellTop(range.r2 + 1, 3);
                result = (_this.controller.isPointInDrawingObjects(x1, y1) != null) || (_this.controller.isPointInDrawingObjects(x2, y2) != null) || (_this.controller.isPointInDrawingObjects(x3, y3) != null) || (_this.controller.isPointInDrawingObjects(x4, y4) != null);
            }
            return result;
        }
        if (selection) {
            for (var i = 0; i < aObjects.length; i++) {
                var drawingObject = aObjects[i];
                if ((selection.c2 < drawingObject.from.col) || (selection.c1 > drawingObject.to.col) || (selection.r2 < drawingObject.from.row) || (selection.r1 > drawingObject.to.row)) {
                    for (var j = 0; j < worksheet.arrActiveChartsRanges.length; j++) {
                        var range = worksheet.arrActiveChartsRanges[j];
                        if (! ((range.c2 < drawingObject.from.col) || (range.c1 > drawingObject.to.col) || (range.r2 < drawingObject.from.row) || (range.r1 > drawingObject.to.row))) {
                            bRedraw = true;
                            break;
                        }
                    }
                    continue;
                } else {
                    bRedraw = true;
                    break;
                }
            }
            if (!bRedraw) {
                if (isRangeInObject(selection)) {
                    bRedraw = true;
                } else {
                    for (var j = 0; j < worksheet.arrActiveChartsRanges.length; j++) {
                        if (isRangeInObject(selection)) {
                            bRedraw = true;
                            break;
                        }
                    }
                }
            }
        }
        if (bRedraw) {
            shapeOverlayCtx.ClearMode = true;
            for (var i = 0; i < aObjects.length; i++) {
                aObjects[i].graphicObject.draw(shapeOverlayCtx);
            }
            shapeOverlayCtx.ClearMode = false;
        }
    };
    _this.showDrawingObjects = function (clearCanvas, printOptions) {
        var currDate = new Date();
        var currTime = currDate.getTime();
        if (aDrawTasks.length) {
            if (currTime - aDrawTasks[aDrawTasks.length - 1].time < 40) {
                return;
            }
        }
        aDrawTasks.push({
            time: currTime,
            params: [clearCanvas, printOptions]
        });
    };
    _this.showDrawingObjectsEx = function (clearCanvas, printOptions) {
        if ((worksheet.model.index != api.wb.model.getActive()) && !printOptions) {
            return;
        }
        if (drawingCtx) {
            if (clearCanvas) {
                _this.clearDrawingObjects();
            }
            if (aObjects.length) {
                worksheet._drawGraphic();
                _this.clipGraphicsCanvas(shapeCtx);
                for (var i = 0; i < aObjects.length; i++) {
                    var index = i;
                    var drawingObject = aObjects[i];
                    if (drawingObject.graphicObject.isChart()) {
                        drawingObject.graphicObject.syncAscChart();
                    }
                    if (!printOptions) {
                        if (!drawingObject.inVisibleArea()) {
                            continue;
                        }
                    }
                    if (!drawingObject.flags.anchorUpdated) {
                        drawingObject.updateAnchorPosition();
                    }
                    if (drawingObject.isGraphicObject()) {
                        if (printOptions) {
                            var range = printOptions.printPagesData.pageRange;
                            var printPagesData = printOptions.printPagesData;
                            var offsetCols = printPagesData.startOffsetPt;
                            var left = worksheet.getCellLeft(range.c1, 3) - worksheet.getCellLeft(0, 3) - ptToMm(printPagesData.leftFieldInPt);
                            var top = worksheet.getCellTop(range.r1, 3) - worksheet.getCellTop(0, 3) - ptToMm(printPagesData.topFieldInPt);
                            _this.printGraphicObject(drawingObject.graphicObject, printOptions.ctx.DocumentRenderer, top, left);
                            if (printPagesData.pageHeadings) {
                                worksheet._drawColumnHeaders(printOptions.ctx, range.c1, range.c2, undefined, worksheet.cols[range.c1].left - printPagesData.leftFieldInPt + offsetCols, printPagesData.topFieldInPt - worksheet.cellsTop);
                                worksheet._drawRowHeaders(printOptions.ctx, range.r1, range.r2, undefined, printPagesData.leftFieldInPt - worksheet.cellsLeft, worksheet.rows[range.r1].top - printPagesData.topFieldInPt);
                            }
                        } else {
                            drawingObject.graphicObject.draw(shapeCtx);
                        }
                    }
                }
                _this.restoreGraphicsCanvas(shapeCtx);
            }
            worksheet.model.Drawings = aObjects;
        }
        if (!printOptions) {
            if (aObjects.length) {
                if (_this.controller.selectedObjects.length) {
                    _this.OnUpdateOverlay();
                } else {
                    _this.raiseLayerDrawingObjects();
                }
            }
        }
    };
    _this.printGraphicObject = function (graphicObject, ctx, top, left) {
        if (graphicObject && ctx) {
            if (graphicObject instanceof CImageShape) {
                printImage(graphicObject, ctx, top, left);
            } else {
                if (graphicObject instanceof CShape) {
                    printShape(graphicObject, ctx, top, left);
                } else {
                    if (typeof CChartAsGroup != "undefined" && graphicObject instanceof CChartAsGroup) {
                        printChart(graphicObject, ctx, top, left);
                    } else {
                        if (graphicObject instanceof CGroupShape) {
                            printGroup(graphicObject, ctx, top, left);
                        }
                    }
                }
            }
        }
        function printImage(graphicObject, ctx, top, left) {
            if ((graphicObject instanceof CImageShape) && graphicObject && ctx) {
                var tx = graphicObject.transform.tx;
                var ty = graphicObject.transform.ty;
                graphicObject.transform.tx -= left;
                graphicObject.transform.ty -= top;
                graphicObject.draw(ctx);
                graphicObject.transform.tx = tx;
                graphicObject.transform.ty = ty;
            }
        }
        function printShape(graphicObject, ctx, top, left) {
            if ((graphicObject instanceof CShape) && graphicObject && ctx) {
                var tx = graphicObject.transform.tx;
                var ty = graphicObject.transform.ty;
                graphicObject.transform.tx -= left;
                graphicObject.transform.ty -= top;
                var txTxt, tyTxt;
                if (graphicObject.txBody && graphicObject.transformText) {
                    txTxt = graphicObject.transformText.tx;
                    tyTxt = graphicObject.transformText.ty;
                    graphicObject.transformText.tx -= left;
                    graphicObject.transformText.ty -= top;
                }
                graphicObject.draw(ctx);
                graphicObject.transform.tx = tx;
                graphicObject.transform.ty = ty;
                if (graphicObject.txBody && graphicObject.transformText) {
                    graphicObject.transformText.tx = txTxt;
                    graphicObject.transformText.ty = tyTxt;
                }
            }
        }
        function printChart(graphicObject, ctx, top, left) {
            if (typeof CChartAsGroup != "undefined" && (graphicObject instanceof CChartAsGroup) && graphicObject && ctx) {
                var tx = graphicObject.transform.tx;
                var ty = graphicObject.transform.ty;
                graphicObject.transform.tx -= left;
                graphicObject.transform.ty -= top;
                var chartTxtAreas = [],
                aTxtTransform = [];
                if (graphicObject.chartTitle && graphicObject.chartTitle.txBody && graphicObject.chartTitle.transformText) {
                    chartTxtAreas.push(graphicObject.chartTitle);
                }
                if (graphicObject.vAxisTitle && graphicObject.vAxisTitle.txBody && graphicObject.vAxisTitle.transformText) {
                    chartTxtAreas.push(graphicObject.vAxisTitle);
                }
                if (graphicObject.hAxisTitle && graphicObject.hAxisTitle.txBody && graphicObject.hAxisTitle.transformText) {
                    chartTxtAreas.push(graphicObject.hAxisTitle);
                }
                for (var i = 0; i < chartTxtAreas.length; i++) {
                    var item = chartTxtAreas[i];
                    aTxtTransform.push({
                        tx: item.transformText.tx,
                        ty: item.transformText.ty
                    });
                    item.transformText.tx -= left;
                    item.transformText.ty -= top;
                }
                graphicObject.draw(ctx);
                graphicObject.transform.tx = tx;
                graphicObject.transform.ty = ty;
                for (var i = 0; i < chartTxtAreas.length; i++) {
                    var item = chartTxtAreas[i];
                    item.transformText.tx = aTxtTransform[i].tx;
                    item.transformText.ty = aTxtTransform[i].ty;
                }
            }
        }
        function printGroup(graphicObject, ctx, top, left) {
            if ((graphicObject instanceof CGroupShape) && graphicObject && ctx) {
                for (var i = 0; i < graphicObject.arrGraphicObjects.length; i++) {
                    var graphicItem = graphicObject.arrGraphicObjects[i];
                    if (graphicItem instanceof CImageShape) {
                        printImage(graphicItem, ctx, top, left);
                    } else {
                        if (graphicItem instanceof CShape) {
                            printShape(graphicItem, ctx, top, left);
                        } else {
                            if (typeof CChartAsGroup != "undefined" && graphicItem instanceof CChartAsGroup) {
                                printChart(graphicItem, ctx, top, left);
                            }
                        }
                    }
                }
            }
        }
    };
    _this.getDrawingAreaMetrics = function () {
        var metrics = {
            maxCol: 0,
            maxRow: 0
        };
        for (var i = 0; i < aObjects.length; i++) {
            var drawingObject = aObjects[i];
            if (drawingObject.to.col >= metrics.maxCol) {
                metrics.maxCol = drawingObject.to.col + 1;
            }
            if (drawingObject.to.row >= metrics.maxRow) {
                metrics.maxRow = drawingObject.to.row + 1;
            }
        }
        return metrics;
    };
    _this.clipGraphicsCanvas = function (canvas) {
        if (canvas instanceof CGraphics) {
            var x = worksheet.getCellLeft(0, 0);
            var y = worksheet.getCellTop(0, 0);
            var w = shapeCtx.m_lWidthPix - x;
            var h = shapeCtx.m_lHeightPix - y;
            canvas.m_oContext.save();
            canvas.m_oContext.beginPath();
            canvas.m_oContext.rect(x, y, w, h);
            canvas.m_oContext.clip();
            canvas.m_oContext.save();
        }
    };
    _this.restoreGraphicsCanvas = function (canvas) {
        if (canvas instanceof CGraphics) {
            canvas.m_oContext.restore();
            canvas.m_oContext.restore();
        }
    };
    _this.addImageDrawingObject = function (imageUrl, options) {
        _this.controller.resetSelection();
        if (imageUrl && !_this.isViewerMode()) {
            var _image = api.ImageLoader.LoadImage(imageUrl, 1);
            var isOption = options && options.cell;
            function calculateObjectMetrics(object, width, height) {
                var metricCoeff = 1;
                var coordsFrom = _this.coordsManager.calculateCoords(object.from);
                var realTopOffset = coordsFrom.y;
                var realLeftOffset = coordsFrom.x;
                var areaWidth = worksheet.getCellLeft(worksheet.getLastVisibleCol(), 0) - worksheet.getCellLeft(worksheet.getFirstVisibleCol(), 0);
                if (areaWidth < width) {
                    metricCoeff = width / areaWidth;
                    width = areaWidth;
                    height /= metricCoeff;
                }
                var areaHeight = worksheet.getCellTop(worksheet.getLastVisibleRow(), 0) - worksheet.getCellTop(worksheet.getFirstVisibleRow(), 0);
                if (areaHeight < height) {
                    metricCoeff = height / areaHeight;
                    height = areaHeight;
                    width /= metricCoeff;
                }
                var cellTo = _this.coordsManager.calculateCell(realLeftOffset + width, realTopOffset + height);
                object.to.col = cellTo.col;
                object.to.colOff = cellTo.colOff;
                object.to.row = cellTo.row;
                object.to.rowOff = cellTo.rowOff;
                worksheet._trigger("reinitializeScroll");
            }
            function addImageObject(_image) {
                if (!_image.Image) {
                    worksheet.model.workbook.handlers.trigger("asc_onError", c_oAscError.ID.UplImageUrl, c_oAscError.Level.NoCritical);
                } else {
                    var drawingObject = _this.createDrawingObject();
                    drawingObject.worksheet = worksheet;
                    drawingObject.from.col = isOption ? options.cell.col : worksheet.getSelectedColumnIndex();
                    drawingObject.from.row = isOption ? options.cell.row : worksheet.getSelectedRowIndex();
                    while (!worksheet.cols[drawingObject.from.col]) {
                        worksheet.expandColsOnScroll(true);
                    }
                    worksheet.expandColsOnScroll(true);
                    while (!worksheet.rows[drawingObject.from.row]) {
                        worksheet.expandRowsOnScroll(true);
                    }
                    worksheet.expandRowsOnScroll(true);
                    calculateObjectMetrics(drawingObject, isOption ? options.width : _image.Image.width, isOption ? options.height : _image.Image.height);
                    var coordsFrom = _this.coordsManager.calculateCoords(drawingObject.from);
                    var coordsTo = _this.coordsManager.calculateCoords(drawingObject.to);
                    History.Create_NewPoint();
                    drawingObject.graphicObject = new CImageShape(drawingObject, _this);
                    drawingObject.graphicObject.initDefault(pxToMm(coordsFrom.x), pxToMm(coordsFrom.y), pxToMm(coordsTo.x - coordsFrom.x), pxToMm(coordsTo.y - coordsFrom.y), _image.src);
                    drawingObject.graphicObject.select(_this.controller);
                    drawingObject.graphicObject.setDrawingObjects(_this);
                    drawingObject.graphicObject.addToDrawingObjects();
                }
                worksheet.model.workbook.handlers.trigger("asc_onEndAction", c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadImage);
                worksheet.setSelectionShape(true);
            }
            if (null != _image) {
                addImageObject(_image);
            } else {
                _this.asyncImageEndLoaded = function (_image) {
                    addImageObject(_image);
                    _this.asyncImageEndLoaded = null;
                };
            }
        }
    };
    _this.editImageDrawingObject = function (imageUrl) {
        if (imageUrl) {
            var _image = api.ImageLoader.LoadImage(imageUrl, 1);
            function addImageObject(_image) {
                if (!_image.Image) {
                    worksheet.model.workbook.handlers.trigger("asc_onError", c_oAscError.ID.UplImageUrl, c_oAscError.Level.NoCritical);
                } else {
                    if (api.isImageChangeUrl) {
                        var imageProp = new asc_CImgProperty();
                        imageProp.ImageUrl = _image.src;
                        _this.setGraphicObjectProps(imageProp);
                        api.isImageChangeUrl = false;
                    } else {
                        if (api.isShapeImageChangeUrl) {
                            var imgProps = new asc_CImgProperty();
                            var shapeProp = new asc_CShapeProperty();
                            imgProps.ShapeProperties = shapeProp;
                            shapeProp.fill = new asc_CShapeFill();
                            shapeProp.fill.type = c_oAscFill.FILL_TYPE_BLIP;
                            shapeProp.fill.fill = new asc_CFillBlip();
                            shapeProp.fill.fill.asc_putUrl(_image.src);
                            _this.setGraphicObjectProps(imgProps);
                            api.isShapeImageChangeUrl = false;
                        }
                    }
                    _this.showDrawingObjects(true);
                }
                worksheet.model.workbook.handlers.trigger("asc_onEndAction", c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadImage);
            }
            if (null != _image) {
                addImageObject(_image);
            } else {
                _this.asyncImageEndLoaded = function (_image) {
                    addImageObject(_image);
                    _this.asyncImageEndLoaded = null;
                };
            }
        }
    };
    _this.addChartDrawingObject = function (chart, options) {
        if (_this.isViewerMode()) {
            return;
        }
        worksheet.setSelectionShape(true);
        if (chart instanceof asc_CChart) {
            var _range = convertFormula(chart.range.interval, worksheet);
            if (_range) {
                chart.range.intervalObject = _range;
            }
            chart.rebuildSeries();
            chart.worksheet = worksheet;
            return this.controller.addChartDrawingObject(chart, options);
        } else {
            if (isObject(chart) && chart["binary"]) {
                History.TurnOff();
                var graphicObject = new CChartAsGroup(null, _this);
                graphicObject.setChartBinary(chart["binary"]);
                var seriesCount = graphicObject.chart.series.length;
                if (seriesCount) {
                    var resultRef = parserHelp.parse3DRef(graphicObject.chart.series[0].Val.Formula);
                    worksheet.model.workbook.aWorksheets[0].sName = resultRef.sheet;
                    if (graphicObject.chart.range.interval) {
                        var _range = convertFormula(graphicObject.chart.range.interval, worksheet);
                        if (_range) {
                            graphicObject.chart.range.intervalObject = _range;
                        }
                        while (worksheet.cols.length < _range.bbox.c2) {
                            worksheet.expandColsOnScroll(true);
                        }
                        while (worksheet.rows.length < _range.bbox.r2) {
                            worksheet.expandRowsOnScroll(true);
                        }
                    }
                }
                if (graphicObject.chart.themeColors) {
                    api.GuiControlColorsMap = [];
                    for (var i = 0; i < graphicObject.chart.themeColors.length; i++) {
                        var color = new RGBColor(graphicObject.chart.themeColors[i]);
                        api.GuiControlColorsMap.push(new CColor(color.r, color.g, color.b));
                    }
                    api.chartStyleManager.init();
                    api.chartPreviewManager.init();
                }
                if (!wsCellCache.isInit) {
                    wsCellCache.cols = [];
                    wsCellCache.rows = [];
                    var colsCount = worksheet.cols.length;
                    var rowsCount = worksheet.rows.length;
                    for (var i = 0; i < colsCount; i++) {
                        wsCellCache.cols.push(worksheet.model.getColWidth(i));
                    }
                    for (var i = 0; i < rowsCount; i++) {
                        wsCellCache.rows.push(worksheet.model.getRowHeight(i));
                    }
                    wsCellCache.isInit = true;
                }
                if (graphicObject.chart.series.length) {
                    function restoreDataRange(data, bRows) {
                        if (data && data.Formula && data.NumCache.length) {
                            var range = convertFormula(data.Formula, worksheet);
                            if (range) {
                                if (bRows) {
                                    var index = 0;
                                    for (var j = range.bbox.c1; j <= range.bbox.c2; j++) {
                                        var cell = graphicObject.chart.range.intervalObject.worksheet.getCell(new CellAddress(range.bbox.r1, j, 0));
                                        cell.setNumFormat(data.NumCache[index].numFormatStr);
                                        cell.setValue(data.NumCache[index].val);
                                        index++;
                                    }
                                } else {
                                    var index = 0;
                                    for (var j = range.bbox.r1; j <= range.bbox.r2; j++) {
                                        var cell = graphicObject.chart.range.intervalObject.worksheet.getCell(new CellAddress(j, range.bbox.c1, 0));
                                        cell.setNumFormat(data.NumCache[index].numFormatStr);
                                        cell.setValue(data.NumCache[index].val);
                                        index++;
                                    }
                                }
                            }
                        }
                    }
                    for (var i = 0; i < seriesCount; i++) {
                        if (graphicObject.chart.series[i].TxCache.Formula) {
                            var range = convertFormula(graphicObject.chart.series[i].TxCache.Formula, worksheet);
                            if (range) {
                                var cell = graphicObject.chart.range.intervalObject.worksheet.getCell(new CellAddress(range.bbox.r1, range.bbox.c1, 0));
                                cell.setNumFormat("General");
                                cell.setValue(graphicObject.chart.series[i].TxCache.Tx);
                            }
                        }
                        restoreDataRange(graphicObject.chart.series[i].Val, graphicObject.chart.range.rows);
                        restoreDataRange(graphicObject.chart.series[i].xVal, graphicObject.chart.range.rows);
                        restoreDataRange(graphicObject.chart.series[i].Cat, graphicObject.chart.range.rows);
                    }
                } else {
                    var aCells = graphicObject.chart.range.intervalObject.getCells();
                    for (var i = 0; i < aCells.length; i++) {
                        aCells[i].setValue((i + 1).toString());
                    }
                }
                worksheet._updateCellsRange(graphicObject.chart.range.intervalObject.getBBox0());
                _this.showDrawingObjects(false);
                History.TurnOn();
            }
        }
    };
    _this.editChartDrawingObject = function (chart) {
        if (chart) {
            _this.controller.editChartDrawingObjects(chart);
            _this.showDrawingObjects(false);
        }
    };
    _this.rebuildChartGraphicObjects = function () {
        for (var i = 0; i < aObjects.length; i++) {
            var graphicObject = aObjects[i].graphicObject;
            if (graphicObject.isChart() && graphicObject.chart.range.intervalObject) {
                graphicObject.chart.rebuildSeries();
                graphicObject.recalculate();
            }
        }
    };
    _this.updateDrawingObject = function (bInsert, operType, updateRange) {
        var changedRange = null;
        var metrics = null;
        for (var i = 0; i < aObjects.length; i++) {
            var obj = aObjects[i];
            if (!obj.isLocked()) {
                var bbox = obj.isChart() ? obj.graphicObject.chart.range.intervalObject.getBBox0() : null;
                if (obj.isChart() || obj.isImage() || obj.isShape()) {
                    metrics = {
                        from: {},
                        to: {}
                    };
                    metrics.from.col = obj.from.col;
                    metrics.to.col = obj.to.col;
                    metrics.from.colOff = obj.from.colOff;
                    metrics.to.colOff = obj.to.colOff;
                    metrics.from.row = obj.from.row;
                    metrics.to.row = obj.to.row;
                    metrics.from.rowOff = obj.from.rowOff;
                    metrics.to.rowOff = obj.to.rowOff;
                    if (bInsert) {
                        switch (operType) {
                        case c_oAscInsertOptions.InsertColumns:
                            var count = updateRange.c2 - updateRange.c1 + 1;
                            if (updateRange.c1 <= obj.from.col) {
                                metrics.from.col += count;
                                metrics.to.col += count;
                            } else {
                                if ((updateRange.c1 > obj.from.col) && (updateRange.c1 <= obj.to.col)) {
                                    metrics.to.col += count;
                                } else {
                                    metrics = null;
                                }
                            }
                            if (obj.isChart()) {
                                if (updateRange.c1 <= bbox.c1) {
                                    changedRange = new Range(worksheet.model, bbox.r1, bbox.c1 + count, bbox.r2, bbox.c2 + count);
                                } else {
                                    if (updateRange.c1 <= bbox.c2) {
                                        changedRange = new Range(worksheet.model, bbox.r1, bbox.c1, bbox.r2, bbox.c2 + count);
                                    }
                                }
                            }
                            break;
                        case c_oAscInsertOptions.InsertCellsAndShiftRight:
                            if (obj.isChart()) {
                                if ((updateRange.r1 <= bbox.r1) && (updateRange.r2 >= bbox.r2) && (updateRange.c2 < bbox.c1)) {
                                    var count = updateRange.c2 - updateRange.c1 + 1;
                                    changedRange = new Range(worksheet.model, bbox.r1, bbox.c1 + count, bbox.r2, bbox.c2 + count);
                                }
                            }
                            break;
                        case c_oAscInsertOptions.InsertRows:
                            var count = updateRange.r2 - updateRange.r1 + 1;
                            if (updateRange.r1 <= obj.from.row) {
                                metrics.from.row += count;
                                metrics.to.row += count;
                            } else {
                                if ((updateRange.r1 > obj.from.row) && (updateRange.r1 <= obj.to.row)) {
                                    metrics.to.row += count;
                                } else {
                                    metrics = null;
                                }
                            }
                            if (obj.isChart()) {
                                if (updateRange.r1 <= bbox.r1) {
                                    changedRange = new Range(worksheet.model, bbox.r1 + count, bbox.c1, bbox.r2 + count, bbox.c2);
                                } else {
                                    if (updateRange.r1 <= bbox.r2) {
                                        changedRange = new Range(worksheet.model, bbox.r1, bbox.c1, bbox.r2 + count, bbox.c2);
                                    }
                                }
                            }
                            break;
                        case c_oAscInsertOptions.InsertCellsAndShiftDown:
                            if (obj.isChart()) {
                                if ((updateRange.c1 <= bbox.c1) && (updateRange.c2 >= bbox.c2) && (updateRange.r2 < bbox.r1)) {
                                    var count = updateRange.r2 - updateRange.r1 + 1;
                                    changedRange = new Range(worksheet.model, bbox.r1 + count, bbox.c1, bbox.r2 + count, bbox.c2);
                                }
                            }
                            break;
                        }
                    } else {
                        switch (operType) {
                        case c_oAscDeleteOptions.DeleteColumns:
                            var count = updateRange.c2 - updateRange.c1 + 1;
                            if (updateRange.c1 <= obj.from.col) {
                                if (updateRange.c2 < obj.from.col) {
                                    metrics.from.col -= count;
                                    metrics.to.col -= count;
                                } else {
                                    metrics.from.col = updateRange.c1;
                                    metrics.from.colOff = 0;
                                    var offset = 0;
                                    if (obj.to.col - updateRange.c2 - 1 > 0) {
                                        offset = obj.to.col - updateRange.c2 - 1;
                                    } else {
                                        offset = 1;
                                        metrics.to.colOff = 0;
                                    }
                                    metrics.to.col = metrics.from.col + offset;
                                }
                            } else {
                                if ((updateRange.c1 > obj.from.col) && (updateRange.c1 <= obj.to.col)) {
                                    if (updateRange.c2 >= obj.to.col) {
                                        metrics.to.col = updateRange.c1;
                                        metrics.to.colOff = 0;
                                    } else {
                                        metrics.to.col -= count;
                                    }
                                } else {
                                    metrics = null;
                                }
                            }
                            if (obj.isChart()) {
                                var count = updateRange.c2 - updateRange.c1 + 1;
                                if (updateRange.c1 < bbox.c1) {
                                    if (updateRange.c2 < bbox.c1) {
                                        changedRange = new Range(worksheet.model, bbox.r1, bbox.c1 - count, bbox.r2, bbox.c2 - count);
                                    } else {
                                        if (updateRange.c2 > bbox.c2) {
                                            changedRange = new Range(worksheet.model, bbox.r1, updateRange.c1, bbox.r2, updateRange.c1);
                                        } else {
                                            var offset = bbox.c2 - updateRange.c2;
                                            changedRange = new Range(worksheet.model, bbox.r1, updateRange.c1, bbox.r2, updateRange.c1 + offset - 1);
                                        }
                                    }
                                } else {
                                    if ((updateRange.c1 >= bbox.c1) && (updateRange.c1 <= bbox.c2)) {
                                        if (updateRange.c2 > bbox.c2) {
                                            var offset = (bbox.c1 + 1 > updateRange.c1) ? 1 : 0;
                                            changedRange = new Range(worksheet.model, bbox.r1, bbox.c1, bbox.r2, updateRange.c1 + offset - 1);
                                        } else {
                                            var offset = bbox.c2 + 1 - bbox.c1 - count;
                                            if (offset <= 0) {
                                                offset = 1;
                                            }
                                            changedRange = new Range(worksheet.model, bbox.r1, bbox.c1, bbox.r2, bbox.c1 + offset - 1);
                                        }
                                    }
                                }
                            }
                            break;
                        case c_oAscDeleteOptions.DeleteCellsAndShiftLeft:
                            if (obj.isChart()) {
                                if ((updateRange.r1 <= bbox.r1) && (updateRange.r2 >= bbox.r2) && (updateRange.c2 < bbox.c1)) {
                                    var count = updateRange.c2 - updateRange.c1 + 1;
                                    changedRange = new Range(worksheet.model, bbox.r1, bbox.c1 - count, bbox.r2, bbox.c2 - count);
                                }
                            }
                            break;
                        case c_oAscDeleteOptions.DeleteRows:
                            var count = updateRange.r2 - updateRange.r1 + 1;
                            if (updateRange.r1 <= obj.from.row) {
                                if (updateRange.r2 < obj.from.row) {
                                    metrics.from.row -= count;
                                    metrics.to.row -= count;
                                } else {
                                    metrics.from.row = updateRange.r1;
                                    metrics.from.colOff = 0;
                                    var offset = 0;
                                    if (obj.to.row - updateRange.r2 - 1 > 0) {
                                        offset = obj.to.row - updateRange.r2 - 1;
                                    } else {
                                        offset = 1;
                                        metrics.to.colOff = 0;
                                    }
                                    metrics.to.row = metrics.from.row + offset;
                                }
                            } else {
                                if ((updateRange.r1 > obj.from.row) && (updateRange.r1 <= obj.to.row)) {
                                    if (updateRange.r2 >= obj.to.row) {
                                        metrics.to.row = updateRange.r1;
                                        metrics.to.colOff = 0;
                                    } else {
                                        metrics.to.row -= count;
                                    }
                                } else {
                                    metrics = null;
                                }
                            }
                            if (obj.isChart()) {
                                var count = updateRange.r2 - updateRange.r1 + 1;
                                if (updateRange.r1 < bbox.r1) {
                                    if (updateRange.r2 < bbox.r1) {
                                        changedRange = new Range(worksheet.model, bbox.r1 - count, bbox.c1, bbox.r2 - count, bbox.c2);
                                    } else {
                                        if (updateRange.r2 >= bbox.r2) {
                                            changedRange = new Range(worksheet.model, updateRange.r1, bbox.c1, updateRange.r1, bbox.c2);
                                        } else {
                                            var offset = bbox.r1 + 1 - updateRange.r2;
                                            changedRange = new Range(worksheet.model, updateRange.r1, bbox.c1, updateRange.r1 + offset, bbox.c2);
                                        }
                                    }
                                } else {
                                    if ((updateRange.r1 >= bbox.r1) && (updateRange.r1 <= bbox.r2)) {
                                        if (updateRange.r2 > bbox.r2) {
                                            var offset = (bbox.r1 + 1 > updateRange.r1) ? 1 : 0;
                                            changedRange = new Range(worksheet.model, bbox.r1, bbox.c1, updateRange.r1 + offset - 1, bbox.c2);
                                        } else {
                                            var offset = bbox.r2 + 1 - bbox.r1 - count;
                                            if (offset <= 0) {
                                                offset = 1;
                                            }
                                            changedRange = new Range(worksheet.model, bbox.r1, bbox.c1, bbox.r1 + offset - 1, bbox.c2);
                                        }
                                    }
                                }
                            }
                            break;
                        case c_oAscDeleteOptions.DeleteCellsAndShiftTop:
                            if (obj.isChart()) {
                                if ((updateRange.c1 <= bbox.c1) && (updateRange.c2 >= bbox.c2) && (updateRange.r2 < bbox.r1)) {
                                    var count = updateRange.r2 - updateRange.r1 + 1;
                                    changedRange = new Range(worksheet.model, bbox.r1 - count, bbox.c1, bbox.r2 - count, bbox.c2);
                                }
                            }
                            break;
                        }
                    }
                    if (metrics) {
                        if (metrics.from.col < 0) {
                            metrics.from.col = 0;
                            metrics.from.colOff = 0;
                        }
                        if (metrics.to.col <= 0) {
                            metrics.to.col = 1;
                            metrics.to.colOff = 0;
                        }
                        if (metrics.from.row < 0) {
                            metrics.from.row = 0;
                            metrics.from.rowOff = 0;
                        }
                        if (metrics.to.row <= 0) {
                            metrics.to.row = 1;
                            metrics.to.rowOff = 0;
                        }
                        if (metrics.from.col == metrics.to.col) {
                            metrics.to.col++;
                            metrics.to.colOff = 0;
                        }
                        if (metrics.from.row == metrics.to.row) {
                            metrics.to.row++;
                            metrics.to.rowOff = 0;
                        }
                    }
                    if (changedRange) {
                        var bbox = changedRange.getBBox0();
                        var tmp;
                        if (bbox.c1 > bbox.c2) {
                            tmp = bbox.c1;
                            bbox.c1 = bbox.c2;
                            bbox.c2 = tmp;
                        }
                        if (bbox.r1 > bbox.r2) {
                            tmp = bbox.r1;
                            bbox.r1 = bbox.r2;
                            bbox.r2 = tmp;
                        }
                        changedRange = new Range(worksheet.model, bbox.r1, bbox.c1, bbox.r2, bbox.c2);
                    }
                    if (changedRange || metrics) {
                        if (obj.isChart() && changedRange) {
                            obj.graphicObject.chart.range.intervalObject = changedRange;
                            _this.calcChartInterval(obj.graphicObject.chart);
                            obj.graphicObject.chart.rebuildSeries();
                            obj.graphicObject.recalculate();
                        }
                        if (metrics) {
                            obj.from.col = metrics.from.col;
                            obj.from.colOff = metrics.from.colOff;
                            obj.from.row = metrics.from.row;
                            obj.from.rowOff = metrics.from.rowOff;
                            obj.to.col = metrics.to.col;
                            obj.to.colOff = metrics.to.colOff;
                            obj.to.row = metrics.to.row;
                            obj.to.rowOff = metrics.to.rowOff;
                        }
                        History.TurnOff();
                        var coords = _this.coordsManager.calculateCoords(obj.from);
                        obj.graphicObject.setPosition(pxToMm(coords.x), pxToMm(coords.y));
                        obj.graphicObject.recalculateTransform();
                        obj.graphicObject.calculateTransformTextMatrix();
                        History.TurnOn();
                        _this.showDrawingObjects(true);
                    }
                }
            }
        }
    };
    _this.moveRangeDrawingObject = function (oBBoxFrom, oBBoxTo, bResize) {
        if (oBBoxFrom && oBBoxTo) {
            function editChart(drawingObject) {
                var _interval = drawingObject.graphicObject.chart.range.interval;
                drawingObject.graphicObject.chart.range.intervalObject = worksheet._getRange(oBBoxTo.c1, oBBoxTo.r1, oBBoxTo.c2, oBBoxTo.r2);
                _this.calcChartInterval(drawingObject.graphicObject.chart);
                drawingObject.graphicObject.chart.rebuildSeries();
                drawingObject.graphicObject.recalculate();
                History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformUndo, null, null, new UndoRedoDataGraphicObjects(drawingObject.graphicObject.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
                History.Add(g_oUndoRedoGraphicObjects, historyitem_Chart_RangeInterval, null, null, new UndoRedoDataGraphicObjects(drawingObject.graphicObject.chart.Get_Id(), new UndoRedoDataGOSingleProp(_interval, drawingObject.graphicObject.chart.range.interval)));
                History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformRedo, null, null, new UndoRedoDataGraphicObjects(drawingObject.graphicObject.chart.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
            }
            var bRedraw = false;
            History.Create_NewPoint();
            History.StartTransaction();
            var chartDrawings = [];
            function callbackCheck(result) {
                for (var i = 0; result && (i < chartDrawings.length); i++) {
                    editChart(chartDrawings[i]);
                    bRedraw = true;
                }
                if (bRedraw) {
                    _this.showDrawingObjects(true);
                }
            }
            for (var i = 0; i < aObjects.length; i++) {
                var drawingObject = aObjects[i];
                if (drawingObject.isChart()) {
                    var bbox = drawingObject.graphicObject.chart.range.intervalObject.getBBox0();
                    if (oBBoxFrom.isEqual(bbox)) {
                        if (bResize) {
                            if (drawingObject.graphicObject.selected) {
                                chartDrawings.push(drawingObject);
                                break;
                            }
                        } else {
                            chartDrawings.push(drawingObject);
                        }
                    }
                }
            }
            this.objectLocker.reset();
            for (var i = 0; i < chartDrawings.length; i++) {
                this.objectLocker.addObjectId(chartDrawings[i].graphicObject.Get_Id());
            }
            this.objectLocker.checkObjects(callbackCheck);
            History.EndTransaction();
        }
    };
    _this.checkChartInterval = function (type, subtype, interval, isRows) {
        var result = false;
        if (interval && worksheet) {
            var _range = convertFormula(interval, worksheet);
            if (_range && checkDataRange(type, subtype, _range, isRows, worksheet)) {
                result = true;
            }
        }
        return result;
    };
    _this.calcChartInterval = function (chart) {
        if (chart.range.intervalObject) {
            var box = chart.range.intervalObject.getBBox0();
            var startCell = new CellAddress(box.r1, box.c1, 0);
            var endCell = new CellAddress(box.r2, box.c2, 0);
            if (startCell && endCell) {
                if (startCell.getID() == endCell.getID()) {
                    chart.range.interval = startCell.getID();
                } else {
                    var wsName = chart.range.intervalObject.worksheet.sName;
                    if (!rx_test_ws_name.test(wsName)) {
                        wsName = "'" + wsName + "'";
                    }
                    chart.range.interval = wsName + "!" + startCell.getID() + ":" + endCell.getID();
                }
            }
        }
    };
    _this.intervalToIntervalObject = function (chart) {
        if (chart.range.interval && worksheet) {
            var _range = convertFormula(chart.range.interval, worksheet);
            if (_range) {
                chart.range.intervalObject = _range;
            }
        }
    };
    _this.updateChartReferences = function (oldWorksheet, newWorksheet) {
        for (var i = 0; i < aObjects.length; i++) {
            var graphicObject = aObjects[i].graphicObject;
            if (graphicObject.isChart() && (graphicObject.chart.range.interval.indexOf(oldWorksheet) == 0)) {
                graphicObject.chart.range.interval = graphicObject.chart.range.interval.replace(oldWorksheet, newWorksheet);
                var _range = convertFormula(graphicObject.chart.range.interval, worksheet);
                if (_range) {
                    graphicObject.chart.range.intervalObject = _range;
                    graphicObject.chart.rebuildSeries();
                    graphicObject.recalculate();
                }
            }
        }
    };
    _this.addGraphicObject = function (graphic, position, lockByDefault) {
        worksheet.cleanSelection();
        var drawingObject = _this.createDrawingObject();
        drawingObject.graphicObject = graphic;
        graphic.setDrawingBase(drawingObject);
        var ret;
        if (isRealNumber(position)) {
            aObjects.splice(position, 0, drawingObject);
            ret = position;
        } else {
            ret = aObjects.length;
            aObjects.push(drawingObject);
        }
        drawingObject.setGraphicObjectCoords();
        _this.showDrawingObjects(false);
        worksheet.model.workbook.handlers.trigger("asc_onEndAddShape");
        if (lockByDefault) {
            _this.objectLocker.reset();
            _this.objectLocker.addObjectId(drawingObject.graphicObject.Id);
            _this.objectLocker.checkObjects(function (result) {});
            _this.sendGraphicObjectProps();
            worksheet.setSelectionShape(true);
        }
        var boundsChecker = _this.getBoundsChecker(drawingObject);
        aBoundsCheckers.push(boundsChecker);
        return ret;
    };
    _this.groupGraphicObjects = function () {
        if (_this.controller.canGroup()) {
            _this.controller.createGroup(null);
            worksheet.setSelectionShape(true);
        }
    };
    _this.unGroupGraphicObjects = function () {
        if (_this.controller.canUnGroup()) {
            _this.controller.unGroup();
            worksheet.setSelectionShape(true);
            api.isStartAddShape = false;
        }
    };
    _this.insertUngroupedObjects = function (idGroup, aGraphics) {
        if (idGroup && aGraphics.length) {
            var aSingleObjects = [];
            for (var i = 0; i < aGraphics.length; i++) {
                var obj = _this.createDrawingObject();
                obj.graphicObject = aGraphics[i];
                aGraphics[i].setDrawingBase(obj);
                obj.graphicObject.select(_this.controller);
                obj.setGraphicObjectCoords();
                aSingleObjects.push(obj);
            }
            for (var i = 0; i < aObjects.length; i++) {
                if (idGroup == aObjects[i].graphicObject.Id) {
                    aObjects.splice(i, 1);
                    for (var j = aSingleObjects.length - 1; j > -1; j--) {
                        aObjects.splice(i, 0, aSingleObjects[j]);
                    }
                    _this.showDrawingObjects(true);
                    break;
                }
            }
        }
    };
    _this.getDrawingBase = function (graphicId) {
        for (var i = 0; i < aObjects.length; i++) {
            if (aObjects[i].graphicObject.Id == graphicId) {
                return aObjects[i];
            }
        }
        return null;
    };
    _this.deleteDrawingBase = function (graphicId) {
        var position = null;
        var bRedraw = false;
        for (var i = 0; i < aObjects.length; i++) {
            if (aObjects[i].graphicObject.Id == graphicId) {
                aObjects[i].graphicObject.deselect(_this.controller);
                if (aObjects[i].isChart()) {
                    worksheet.arrActiveChartsRanges = [];
                }
                aObjects.splice(i, 1);
                bRedraw = true;
                position = i;
                break;
            }
        }
        if (bRedraw) {
            worksheet._checkSelectionShape();
            _this.sendGraphicObjectProps();
            _this.showDrawingObjects(true);
        }
        return position;
    };
    _this.checkGraphicObjectPosition = function (x, y, w, h) {
        var response = {
            result: true,
            x: 0,
            y: 0
        };
        var bottom = worksheet.getCellTop(worksheet.rows.length - 1, 3);
        var right = worksheet.getCellLeft(worksheet.cols.length - 1, 3);
        if (y < 0) {
            response.result = false;
            response.y = Math.abs(y);
        }
        if (x < 0) {
            response.result = false;
            response.x = Math.abs(x);
        }
        function isMaxCol() {
            var result = false;
            if (worksheet.cols.length >= gc_nMaxCol) {
                var lastCol = worksheet.cols[gc_nMaxCol - 1];
                if (mmToPt(x + w) + scrollX > lastCol.left) {
                    response.result = false;
                    response.x = ptToMm(lastCol.left - (mmToPt(x + w) + scrollX));
                    result = true;
                }
            }
            return result;
        }
        function isMaxRow() {
            var result = false;
            if (worksheet.rows.length >= gc_nMaxRow) {
                var lastRow = worksheet.rows[gc_nMaxRow - 1];
                if (mmToPt(y + h) + scrollY > lastRow.top) {
                    response.result = false;
                    response.y = ptToMm(lastCol.top - (mmToPt(y + h) + scrollY));
                    result = true;
                }
            }
            return result;
        }
        if (x + w > right) {
            var scrollX = scrollOffset.getX();
            var foundCol = worksheet._findColUnderCursor(mmToPt(x + w) + scrollX, true);
            while (foundCol == null) {
                if (isMaxCol()) {
                    break;
                }
                worksheet.expandColsOnScroll(true);
                worksheet._trigger("reinitializeScrollX");
                foundCol = worksheet._findColUnderCursor(mmToPt(x + w) + scrollX, true);
            }
        }
        if (y + h > bottom) {
            var scrollY = scrollOffset.getY();
            var foundRow = worksheet._findRowUnderCursor(mmToPt(y + h) + scrollY, true);
            while (foundRow == null) {
                if (isMaxRow()) {
                    break;
                }
                worksheet.expandRowsOnScroll(true);
                worksheet._trigger("reinitializeScrollY");
                foundRow = worksheet._findRowUnderCursor(mmToPt(y + h) + scrollY, true);
            }
        }
        return response;
    };
    _this.setGraphicObjectLockState = function (id, state) {
        for (var i = 0; i < aObjects.length; i++) {
            if (id == aObjects[i].graphicObject.Id) {
                aObjects[i].graphicObject.lockType = state;
                if (worksheet.model.index === worksheet.model.workbook.nActive) {
                    if (!shapeCtx.m_oContext.isOverlay) {
                        _this.clipGraphicsCanvas(shapeCtx);
                        shapeCtx.SetIntegerGrid(false);
                        shapeCtx.transform3(aObjects[i].graphicObject.transform, false);
                        shapeCtx.DrawLockObjectRect(aObjects[i].graphicObject.lockType, 0, 0, aObjects[i].graphicObject.extX, aObjects[i].graphicObject.extY);
                        shapeCtx.reset();
                        shapeCtx.SetIntegerGrid(true);
                        _this.restoreGraphicsCanvas(shapeCtx);
                    }
                }
                break;
            }
        }
    };
    _this.resetLockedGraphicObjects = function () {
        for (var i = 0; i < aObjects.length; i++) {
            aObjects[i].graphicObject.lockType = c_oAscLockTypes.kLockTypeNone;
        }
    };
    _this.tryResetLockedGraphicObject = function (id) {
        var bObjectFound = false;
        for (var i = 0; i < aObjects.length; i++) {
            if (aObjects[i].graphicObject.Id == id) {
                aObjects[i].graphicObject.lockType = c_oAscLockTypes.kLockTypeNone;
                bObjectFound = true;
                break;
            }
        }
        return bObjectFound;
    };
    _this.setScrollOffset = function () {
        if (shapeCtx && shapeOverlayCtx && autoShapeTrack) {
            var x = scrollOffset.getX();
            var y = scrollOffset.getY();
            shapeCtx.m_oCoordTransform.tx = x;
            shapeCtx.m_oCoordTransform.ty = y;
            shapeCtx.CalculateFullTransform();
            shapeOverlayCtx.m_oCoordTransform.tx = x;
            shapeOverlayCtx.m_oCoordTransform.ty = y;
            shapeOverlayCtx.CalculateFullTransform();
            autoShapeTrack.Graphics.m_oCoordTransform.tx = x;
            autoShapeTrack.Graphics.m_oCoordTransform.ty = y;
            autoShapeTrack.Graphics.CalculateFullTransform();
            this.controller.recalculateCurPos();
            if (_this.selectedGraphicObjectsExists()) {
                this.controller.updateSelectionState();
            }
        }
    };
    _this.convertMetric = function (val, from, to) {
        return val * ascCvtRatio(from, to);
    };
    _this.getSelectedGraphicObjects = function () {
        return _this.controller.selectedObjects;
    };
    _this.selectedGraphicObjectsExists = function () {
        return _this.controller.selectedObjects.length > 0;
    };
    _this.loadImageRedraw = function (imageUrl) {
        var _image = api.ImageLoader.LoadImage(imageUrl, 1);
        if (null != _image) {
            imageLoaded(_image);
        } else {
            _this.asyncImageEndLoaded = function (_image) {
                imageLoaded(_image);
                _this.asyncImageEndLoaded = null;
            };
        }
        function imageLoaded(_image) {
            if (!_image.Image) {
                worksheet.model.workbook.handlers.trigger("asc_onError", c_oAscError.ID.UplImageUrl, c_oAscError.Level.NoCritical);
            } else {
                _this.showDrawingObjects(true);
            }
        }
    };
    _this.getOriginalImageSize = function () {
        var selectedObjects = _this.controller.selectedObjects;
        if ((selectedObjects.length == 1) && selectedObjects[0].isImage()) {
            var imageUrl = selectedObjects[0].getImageUrl();
            var _image = api.ImageLoader.map_image_index[getFullImageSrc(imageUrl)];
            if (_image != undefined && _image.Image != null && _image.Status == ImageLoadStatus.Complete) {
                var _w = 1,
                _h = 1;
                var bIsCorrect = false;
                if (_image.Image != null) {
                    bIsCorrect = true;
                    _w = Math.max(pxToMm(_image.Image.width), 1);
                    _h = Math.max(pxToMm(_image.Image.height), 1);
                }
                return new asc_CImageSize(_w, _h, bIsCorrect);
            }
        }
        return new asc_CImageSize(50, 50, false);
    };
    _this.sendGraphicObjectProps = function () {
        if (worksheet) {
            worksheet._trigger("selectionChanged", worksheet.getSelectionInfo());
        }
    };
    _this.setGraphicObjectProps = function (props) {
        var objectProperties = props;
        if (!isNullOrEmptyString(objectProperties.ImageUrl)) {
            var _img = api.ImageLoader.LoadImage(objectProperties.ImageUrl, 1);
            if (null != _img) {
                _this.controller.setGraphicObjectProps(objectProperties);
            } else {
                _this.asyncImageEndLoaded = function (_image) {
                    _this.controller.setGraphicObjectProps(objectProperties);
                    _this.asyncImageEndLoaded = null;
                };
            }
        } else {
            if (objectProperties.ShapeProperties && objectProperties.ShapeProperties.fill && objectProperties.ShapeProperties.fill.fill && !isNullOrEmptyString(objectProperties.ShapeProperties.fill.fill.url)) {
                var _img = api.ImageLoader.LoadImage(objectProperties.ShapeProperties.fill.fill.url, 1);
                if (null != _img) {
                    _this.controller.setGraphicObjectProps(objectProperties);
                } else {
                    _this.asyncImageEndLoaded = function (_image) {
                        _this.controller.setGraphicObjectProps(objectProperties);
                        _this.asyncImageEndLoaded = null;
                    };
                }
            } else {
                objectProperties.ImageUrl = null;
                _this.controller.setGraphicObjectProps(objectProperties);
            }
        }
        _this.sendGraphicObjectProps();
    };
    _this.showChartSettings = function () {
        api.wb.handlers.trigger("asc_onShowChartDialog", true);
    };
    _this.setDrawImagePlaceParagraph = function (element_id, props) {
        _this.drawingDocument.InitGuiCanvasTextProps(element_id);
        _this.drawingDocument.DrawGuiCanvasTextProps(props);
    };
    _this.graphicObjectMouseDown = function (e, x, y) {
        _this.controller.onMouseDown(e, pxToMm(x - scrollOffset.getX()), pxToMm(y - scrollOffset.getY()));
    };
    _this.graphicObjectMouseMove = function (e, x, y) {
        _this.controller.onMouseMove(e, pxToMm(x - scrollOffset.getX()), pxToMm(y - scrollOffset.getY()));
    };
    _this.graphicObjectMouseUp = function (e, x, y) {
        _this.controller.onMouseUp(e, pxToMm(x - scrollOffset.getX()), pxToMm(y - scrollOffset.getY()));
    };
    _this.graphicObjectKeyDown = function (e) {
        return _this.controller.onKeyDown(e);
    };
    _this.graphicObjectKeyPress = function (e) {
        return _this.controller.onKeyPress(e);
    };
    _this.cleanWorksheet = function () {
        if (wsCellCache.isInit) {
            for (var i = 0; i < wsCellCache.cols.length; i++) {
                worksheet.model.setColWidth(wsCellCache.cols[i], i, i);
            }
            for (var i = 0; i < wsCellCache.rows.length; i++) {
                worksheet.model.setRowHeight(wsCellCache.rows[i], i, i);
            }
            worksheet.changeWorksheet("update");
        }
        for (var i = 0; i < aObjects.length; i++) {
            aObjects[i].graphicObject.deleteDrawingBase();
        }
        aBoundsCheckers = [];
        worksheet._clean();
        var listRange = new Range(worksheet.model, 0, 0, worksheet.nRowsCount - 1, worksheet.nColsCount - 1);
        listRange.cleanAll();
        _this.controller.resetSelection();
        shapeCtx.m_oContext.clearRect(0, 0, shapeCtx.m_lWidthPix, shapeCtx.m_lHeightPix);
        shapeOverlayCtx.m_oContext.clearRect(0, 0, shapeOverlayCtx.m_lWidthPix, shapeOverlayCtx.m_lHeightPix);
        _this.OnUpdateOverlay();
        History.Clear();
    };
    _this.getWordChartObject = function () {
        for (var i = 0; i < aObjects.length; i++) {
            var drawingObject = aObjects[i];
            if (drawingObject.isChart()) {
                var chart = new asc_CChartBinary(drawingObject.graphicObject);
                _this.cleanWorksheet();
                return chart;
            }
        }
        return null;
    };
    _this.getAscChartObject = function () {
        if (!api.chartStyleManager.isReady() || !api.chartPreviewManager.isReady()) {
            api.chartStyleManager.init();
            api.chartPreviewManager.init();
            _this.callTrigger("asc_onUpdateChartStyles");
        }
        if (api.isChartEditor) {
            if (aObjects.length && aObjects[0].isChart()) {
                aObjects[0].graphicObject.syncAscChart();
                return new asc_CChart(aObjects[0].graphicObject.chart);
            }
        }
        var chart = this.controller.getAscChartObject();
        if (!chart) {
            History.Create_NewPoint();
            chart = new asc_CChart();
            chart.header.title = api.chartTranslate.title;
            chart.xAxis.title = api.chartTranslate.xAxis;
            chart.yAxis.title = api.chartTranslate.yAxis;
            chart.range.interval = function () {
                var result = "";
                if (worksheet) {
                    var selectedRange = worksheet.getSelectedRange();
                    if (selectedRange) {
                        var box = selectedRange.getBBox0();
                        if (box.r2 - box.r1 < box.c2 - box.c1) {
                            chart.range.rows = true;
                            chart.range.columns = false;
                        } else {
                            chart.range.rows = false;
                            chart.range.columns = true;
                        }
                        var startCell = new CellAddress(box.r1, box.c1, 0);
                        var endCell = new CellAddress(box.r2, box.c2, 0);
                        if (startCell && endCell) {
                            var wsName = worksheet.model.sName;
                            if (!rx_test_ws_name.test(wsName)) {
                                wsName = "'" + wsName + "'";
                            }
                            if (startCell.getID() == endCell.getID()) {
                                result = wsName + "!" + startCell.getID();
                            } else {
                                result = wsName + "!" + startCell.getID() + ":" + endCell.getID();
                            }
                        }
                    }
                }
                return result;
            } ();
            chart.range.intervalObject = function () {
                return worksheet ? worksheet.getSelectedRange() : null;
            } ();
        }
        return chart;
    };
    _this.selectDrawingObjectRange = function (id) {
        var strokeColor = "#ff0000";
        worksheet.arrActiveChartsRanges = [];
        function getRandomColor() {
            var r = function () {
                return Math.floor(Math.random() * 256);
            };
            return "rgb(" + r() + "," + r() + "," + r() + ")";
        }
        var bRaise = false;
        for (var i = 0; i < aObjects.length; i++) {
            var drawingObject = aObjects[i].graphicObject;
            if (drawingObject.isChart() && (drawingObject.Id == id)) {
                if (!drawingObject.chart.range.intervalObject) {
                    _this.intervalToIntervalObject(drawingObject.chart);
                }
                if (drawingObject.chart.range.intervalObject.worksheet.Id != worksheet.model.Id) {
                    return bRaise;
                }
                var BB = drawingObject.chart.range.intervalObject.getBBox0();
                var range = asc.Range(BB.c1, BB.r1, BB.c2, BB.r2, true);
                var fvr = worksheet.getFirstVisibleRow();
                var fvc = worksheet.getFirstVisibleCol();
                var headers = drawingObject.chart.parseSeriesHeaders();
                var bbox = BB.clone();
                if (headers.bTop && (bbox.r1 + 1 - fvr > 0) && (bbox.c2 + 1 - fvc > 0) && (bbox.r1 != bbox.r2)) {
                    var y = worksheet.getCellTop(bbox.r1 + 1, 1) - worksheet.getCellTop(fvr, 1) + worksheet.getCellTop(0, 1);
                    var bHide = bbox.c1 - fvc < 0;
                    var x = (bHide ? 0 : worksheet.getCellLeft(bbox.c1, 1) - worksheet.getCellLeft(fvc, 1)) + worksheet.getCellLeft(0, 1);
                    var w = worksheet.getCellLeft(bbox.c2 + 1, 1) - (bHide ? worksheet.getCellLeft(fvc, 1) : worksheet.getCellLeft(bbox.c1, 1));
                    overlayCtx.setStrokeStyle(strokeColor);
                    overlayCtx.beginPath();
                    overlayCtx.lineHor(x, y - worksheet.height_1px, x + w);
                    overlayCtx.stroke();
                }
                if (headers.bLeft && (bbox.c1 + 1 - fvc > 0) && (bbox.r2 + 1 - fvr > 0) && (bbox.c1 != bbox.c2)) {
                    var x = worksheet.getCellLeft(bbox.c1 + 1, 1) - worksheet.getCellLeft(fvc, 1) + worksheet.getCellLeft(0, 1);
                    var bHide = bbox.r1 - fvr < 0;
                    var y = (bHide ? 0 : worksheet.getCellTop(bbox.r1, 1) - worksheet.getCellTop(fvr, 1)) + worksheet.getCellTop(0, 1);
                    var h = worksheet.getCellTop(bbox.r2 + 1, 1) - (bHide ? worksheet.getCellTop(fvr, 1) : worksheet.getCellTop(bbox.r1, 1));
                    overlayCtx.setStrokeStyle(strokeColor);
                    overlayCtx.beginPath();
                    overlayCtx.lineVer(x - worksheet.width_1px, y, y + h);
                    overlayCtx.stroke();
                }
                worksheet.arrActiveChartsRanges.push(range);
                worksheet.isChartAreaEditMode = true;
                worksheet._drawFormulaRange(worksheet.arrActiveChartsRanges);
                bRaise = true;
            }
        }
        return bRaise;
    };
    _this.unselectDrawingObjects = function () {
        if (worksheet.isChartAreaEditMode) {
            worksheet.isChartAreaEditMode = false;
            worksheet.arrActiveChartsRanges = [];
        }
        _this.controller.resetSelectionState();
        _this.OnUpdateOverlay();
    };
    _this.getDrawingObject = function (id) {
        for (var i = 0; i < aObjects.length; i++) {
            if (aObjects[i].graphicObject.Id == id) {
                return aObjects[i];
            }
        }
        return null;
    };
    _this.getGraphicSelectionType = function (id) {
        for (var i = 0; i < aObjects.length; i++) {
            var obj = aObjects[i];
            if (obj.graphicObject.Id == id) {
                if (obj.isChart()) {
                    if (_this.controller.curState.id == STATES_ID_CHART_TEXT_ADD) {
                        return c_oAscSelectionType.RangeChartText;
                    }
                    return c_oAscSelectionType.RangeChart;
                }
                if (obj.graphicObject.isImage()) {
                    return c_oAscSelectionType.RangeImage;
                }
                if (obj.graphicObject.isShape() || obj.graphicObject.isGroup()) {
                    if (_this.controller.curState.id == STATES_ID_TEXT_ADD) {
                        return c_oAscSelectionType.RangeShapeText;
                    }
                    return c_oAscSelectionType.RangeShape;
                }
            }
        }
        return undefined;
    };
    _this.setGraphicObjectLayer = function (layerType) {
        _this.controller.setGraphicObjectLayer(layerType);
    };
    _this.saveSizeDrawingObjects = function () {
        for (var i = 0; i < aObjects.length; i++) {
            var obj = aObjects[i];
            obj.size.width = obj.getWidthFromTo();
            obj.size.height = obj.getHeightFromTo();
        }
    };
    _this.updateSizeDrawingObjects = function () {
        for (var i = 0; i < aObjects.length; i++) {
            var drawingObject = aObjects[i];
            var coords = _this.coordsManager.calculateCoords(drawingObject.from);
            var cellTo = _this.coordsManager.calculateCell(coords.x + drawingObject.size.width, coords.y + drawingObject.size.height);
            drawingObject.to.col = cellTo.col;
            drawingObject.to.colOff = cellTo.colOff;
            drawingObject.to.row = cellTo.row;
            drawingObject.to.rowOff = cellTo.rowOff;
            drawingObject.graphicObject.setPosition(pxToMm(coords.x), pxToMm(coords.y));
            drawingObject.graphicObject.recalculateTransform();
            drawingObject.graphicObject.calculateTransformTextMatrix();
        }
        _this.showDrawingObjects(true);
    };
    _this.checkCursorDrawingObject = function (x, y) {
        var objectInfo = {
            cursor: null,
            id: null,
            object: null
        };
        var graphicObjectInfo = _this.controller.isPointInDrawingObjects(pxToMm(x - scrollOffset.getX()), pxToMm(y - scrollOffset.getY()));
        if (graphicObjectInfo && graphicObjectInfo.objectId) {
            objectInfo.id = graphicObjectInfo.objectId;
            objectInfo.object = _this.getDrawingBase(graphicObjectInfo.objectId);
            objectInfo.cursor = graphicObjectInfo.cursorType;
            objectInfo.hyperlink = graphicObjectInfo.hyperlink;
            return objectInfo;
        }
        return null;
    };
    _this.getPositionInfo = function (x, y) {
        var info = {
            col: 0,
            colOff: 0,
            row: 0,
            rowOff: 0
        };
        var tmp = worksheet._findColUnderCursor(pxToPt(x), true);
        if (tmp) {
            info.col = tmp.col;
            info.colOff = pxToMm(x - worksheet.getCellLeft(info.col, 0));
        }
        tmp = worksheet._findRowUnderCursor(pxToPt(y), true);
        if (tmp) {
            info.row = tmp.row;
            info.rowOff = pxToMm(y - worksheet.getCellTop(info.row, 0));
        }
        return info;
    };
    _this.showImageFileDialog = function (documentId, documentFormat) {
        if (_this.isViewerMode()) {
            return;
        }
        var frameWindow = GetUploadIFrame();
        var content = '<html><head></head><body><form action="' + g_sUploadServiceLocalUrl + "?sheetId=" + worksheet.model.getId() + "&key=" + documentId + '" method="POST" enctype="multipart/form-data"><input id="apiiuFile" name="apiiuFile" type="file" accept="image/*" size="1"><input id="apiiuSubmit" name="apiiuSubmit" type="submit" style="display:none;"></form></body></html>';
        frameWindow.document.open();
        frameWindow.document.write(content);
        frameWindow.document.close();
        var fileName = frameWindow.document.getElementById("apiiuFile");
        var fileSubmit = frameWindow.document.getElementById("apiiuSubmit");
        fileName.onchange = function (e) {
            var bNeedSubmit = true;
            if (e && e.target && e.target.files) {
                var nError = ValidateUploadImage(e.target.files);
                if (c_oAscServerError.NoError != nError) {
                    bNeedSubmit = false;
                    worksheet.model.workbook.handlers.trigger("asc_onError", api.asc_mapAscServerErrorToAscError(nError), c_oAscError.Level.NoCritical);
                }
            }
            if (bNeedSubmit) {
                worksheet.model.workbook.handlers.trigger("asc_onStartAction", c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadImage);
                fileSubmit.click();
            }
        };
        if (window.opera != undefined) {
            setTimeout(function () {
                fileName.click();
            },
            0);
        } else {
            fileName.click();
        }
    };
    _this.controller = new DrawingObjectsController(_this);
    function guid() {
        function S4() {
            return (((1 + Math.random()) * 65536) | 0).toString(16).substring(1);
        }
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }
    function ascCvtRatio(fromUnits, toUnits) {
        return asc.getCvtRatio(fromUnits, toUnits, drawingCtx.getPPIX());
    }
    function setCanvasZIndex(canvas, value) {
        if (canvas && (value >= 0) && (value <= 1)) {
            canvas.globalAlpha = value;
        }
    }
    function emuToPx(emu) {
        var tmp = emu * 20 * 96 / 2.54 / 72 / 100 / 1000;
        return Math.floor(tmp);
    }
    function pxToEmu(px) {
        var tmp = px * 2.54 * 72 * 100 * 1000 / 20 / 96;
        return Math.floor(tmp);
    }
    function pxToPt(val) {
        var tmp = asc.round(val) * ascCvtRatio(0, 1);
        return tmp > 0 ? tmp : 0;
    }
    function ptToPx(val) {
        var tmp = val * ascCvtRatio(1, 0);
        return tmp;
    }
    function ptToMm(val) {
        var tmp = val * ascCvtRatio(1, 3);
        return tmp;
    }
    function mmToPx(val) {
        var tmp = val * ascCvtRatio(3, 0);
        return tmp;
    }
    function mmToPt(val) {
        var tmp = val * ascCvtRatio(3, 1);
        return tmp;
    }
    function pxToMm(val) {
        var tmp = val * ascCvtRatio(0, 3);
        return tmp;
    }
}
function ObjectLocker(ws) {
    var _t = this;
    var aObjectId = [];
    var worksheet = ws;
    _t.reset = function () {
        aObjectId = [];
    };
    _t.addObjectId = function (id) {
        aObjectId.push(id);
    };
    _t.checkObjects = function (callback) {
        function callbackEx(result) {
            worksheet._drawCollaborativeElements(true);
            if (callback) {
                callback(result);
            }
        }
        if (!aObjectId.length || (false === worksheet.collaborativeEditing.isCoAuthoringExcellEnable())) {
            if ($.isFunction(callback)) {
                callbackEx(true);
            }
            return;
        }
        var sheetId = worksheet.model.getId();
        worksheet.collaborativeEditing.onStartCheckLock();
        for (var i = 0; i < aObjectId.length; i++) {
            var lockInfo = worksheet.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Object, null, sheetId, aObjectId[i]);
            if (false === worksheet.collaborativeEditing.getCollaborativeEditing()) {
                if ($.isFunction(callback)) {
                    callbackEx(true);
                }
                callback = undefined;
            }
            if (false !== worksheet.collaborativeEditing.getLockIntersection(lockInfo, c_oAscLockTypes.kLockTypeMine)) {
                continue;
            } else {
                if (false !== worksheet.collaborativeEditing.getLockIntersection(lockInfo, c_oAscLockTypes.kLockTypeOther)) {
                    if ($.isFunction(callback)) {
                        callbackEx(false);
                    }
                    return;
                }
            }
            worksheet.collaborativeEditing.addCheckLock(lockInfo);
        }
        worksheet.collaborativeEditing.onEndCheckLock(callbackEx);
    };
}
function ClickCounter() {
    var _this = this;
    _this.x = 0;
    _this.y = 0;
    _this.button = 0;
    _this.time = 0;
    _this.clickCount = 0;
    _this.log = false;
    _this.mouseDownEvent = function (x, y, button) {
        var currTime = getCurrentTime();
        if ((_this.button === button) && (_this.x === x) && (_this.y === y) && (currTime - _this.time < 500)) {
            _this.clickCount = _this.clickCount + 1;
            _this.clickCount = Math.min(_this.clickCount, 3);
        } else {
            _this.clickCount = 1;
        }
        if (_this.log) {
            console.log("-----");
            console.log("x-> " + _this.x + " : " + x);
            console.log("y-> " + _this.y + " : " + y);
            console.log("Time: " + (currTime - _this.time));
            console.log("Count: " + _this.clickCount);
            console.log("");
        }
        _this.time = currTime;
    };
    _this.mouseMoveEvent = function (x, y) {
        if ((_this.x != x) || (_this.y != y)) {
            _this.x = x;
            _this.y = y;
            _this.clickCount = 0;
            if (_this.log) {
                console.log("Reset counter");
            }
        }
    };
    _this.getClickCount = function () {
        return _this.clickCount;
    };
}
function CoordsManager(ws, bLog) {
    var _t = this;
    var log = bLog;
    var worksheet = ws;
    _t.calculateCell = function (x, y) {
        var cell = {
            col: 0,
            colOff: 0,
            colOffPx: 0,
            row: 0,
            rowOff: 0,
            rowOffPx: 0
        };
        var _x = x + worksheet.getCellLeft(0, 0);
        var _y = y + worksheet.getCellTop(0, 0);
        var xPt = worksheet.objectRender.convertMetric(_x, 0, 1);
        var yPt = worksheet.objectRender.convertMetric(_y, 0, 1);
        var offsetX = worksheet.cols[worksheet.visibleRange.c1].left - worksheet.cellsLeft;
        var offsetY = worksheet.rows[worksheet.visibleRange.r1].top - worksheet.cellsTop;
        function isMaxCol() {
            var result = false;
            if (worksheet.cols.length >= gc_nMaxCol) {
                result = true;
            }
            return result;
        }
        function isMaxRow() {
            var result = false;
            if (worksheet.rows.length >= gc_nMaxRow) {
                result = true;
            }
            return result;
        }
        var delta = 0;
        var col = worksheet._findColUnderCursor(xPt - offsetX, true);
        while (col == null) {
            if (isMaxCol()) {
                col = worksheet._findColUnderCursor(worksheet.cols[gc_nMaxCol - 1].left - 1, true);
                break;
            }
            worksheet.expandColsOnScroll(true);
            worksheet._trigger("reinitializeScrollX");
            col = worksheet._findColUnderCursor(xPt - offsetX + delta, true);
            if (xPt - offsetX < 0) {
                delta++;
            }
        }
        cell.col = col.col;
        cell.colOffPx = Math.max(0, _x - worksheet.getCellLeft(cell.col, 0));
        cell.colOff = worksheet.objectRender.convertMetric(cell.colOffPx, 0, 3);
        delta = 0;
        var row = worksheet._findRowUnderCursor(yPt - offsetY, true);
        while (row == null) {
            if (isMaxRow()) {
                row = worksheet._findRowUnderCursor(worksheet.rows[gc_nMaxRow - 1].top - 1, true);
                break;
            }
            worksheet.expandRowsOnScroll(true);
            worksheet._trigger("reinitializeScrollY");
            row = worksheet._findRowUnderCursor(yPt - offsetY + delta, true);
            if (yPt - offsetY < 0) {
                delta++;
            }
        }
        cell.row = row.row;
        cell.rowOffPx = Math.max(0, _y - worksheet.getCellTop(cell.row, 0));
        cell.rowOff = worksheet.objectRender.convertMetric(cell.rowOffPx, 0, 3);
        return cell;
    };
    _t.calculateCoords = function (cell) {
        var coords = {
            x: 0,
            y: 0
        };
        if (cell) {
            coords.y = worksheet.getCellTop(cell.row, 0) + worksheet.objectRender.convertMetric(cell.rowOff, 3, 0) - worksheet.getCellTop(0, 0);
            coords.x = worksheet.getCellLeft(cell.col, 0) + worksheet.objectRender.convertMetric(cell.colOff, 3, 0) - worksheet.getCellLeft(0, 0);
        }
        return coords;
    };
}
function writeToBinaryDocContent(docContent, w) {
    w.WriteBool(docContent.TurnOffInnerWrap);
    w.WriteBool(docContent.Split);
    var Count = docContent.Content.length;
    w.WriteLong(Count);
    for (var Index = 0; Index < Count; Index++) {
        writeToBinaryParagraph(docContent.Content[Index], w);
    }
}
function readFromBinaryDocContent(docContent, r) {
    docContent.TurnOffInnerWrap = r.GetBool();
    docContent.Split = r.GetBool();
    var Count = r.GetLong();
    docContent.Content = new Array();
    for (var Index = 0; Index < Count; Index++) {
        var p = new Paragraph(docContent.DrawingDocument, docContent, 0, 0, 0, 0, 0);
        readFromBinaryParagraph(p, r);
        docContent.Content.push(p);
    }
}
function writeToBinaryParagraph(p, w) {
    p.Pr.Write_ToBinary(w);
    var StartPos = w.GetCurPosition();
    w.Skip(4);
    var Len = p.Content.length;
    var Count = 0;
    for (var Index = 0; Index < Len; Index++) {
        var Item = p.Content[Index];
        if (true === Item.Is_RealContent()) {
            writeToBinaryParagraphContent(Item, w);
            w.WriteLong(Index);
            Count++;
        }
    }
    var EndPos = w.GetCurPosition();
    w.Seek(StartPos);
    w.WriteLong(Count);
    w.Seek(EndPos);
}
function readFromBinaryParagraph(p, r) {
    p.Pr = new CParaPr();
    p.Pr.Read_FromBinary(r);
    p.TextPr = new ParaTextPr();
    p.Content = new Array();
    var Count = r.GetLong();
    for (var Index = 0; Index < Count; Index++) {
        var Element = readFromBinaryParagraphContent(r);
        var index_test = r.GetLong();
        if (null != Element) {
            p.Content.push(Element);
        }
    }
}
function writeToBinaryParagraphContent(Element, w) {
    var ElementType = Element.Type;
    switch (ElementType) {
    case para_TextPr:
        w.WriteLong(ElementType);
        Element.Value.Write_ToBinary(w);
        break;
    case para_HyperlinkStart:
        w.WriteLong(Element.Type);
        w.WriteString2(Element.Id);
        w.WriteString2(Element.Value);
        w.WriteString2(Element.ToolTip);
        break;
    case para_Text:
        case para_Space:
        case para_End:
        case para_NewLine:
        case para_NewLineRendered:
        case para_InlineBreak:
        case para_PageBreakRendered:
        case para_Empty:
        case para_Numbering:
        case para_Tab:
        case para_PageNum:
        case para_FlowObjectAnchor:
        case para_HyperlinkEnd:
        case para_CommentStart:
        case para_CommentEnd:
        case para_PresentationNumbering:
        Element.Write_ToBinary(w);
        break;
    }
    return Element;
}
function readFromBinaryParagraphContent(r) {
    var ElementType = r.GetLong();
    var Element = null;
    switch (ElementType) {
    case para_TextPr:
        Element = new ParaTextPr();
        Element.Value = new CTextPr();
        Element.Value.Read_FromBinary(r);
        return Element;
    case para_HyperlinkStart:
        Element = new ParaHyperlinkStart();
        Element.Id = r.GetString2();
        Element.Value = r.GetString2();
        Element.ToolTip = r.GetString2();
        return Element;
    case para_Text:
        Element = new ParaText();
        break;
    case para_Space:
        Element = new ParaSpace();
        break;
    case para_End:
        Element = new ParaEnd();
        break;
    case para_NewLine:
        Element = new ParaNewLine();
        break;
    case para_NewLineRendered:
        Element = new ParaNewLineRendered();
        break;
    case para_InlineBreak:
        Element = new ParaInlineBreak();
        break;
    case para_PageBreakRendered:
        Element = new ParaPageBreakRenderer();
        break;
    case para_Empty:
        Element = new ParaEmpty();
        break;
    case para_Numbering:
        Element = new ParaNumbering();
        break;
    case para_Tab:
        Element = new ParaTab();
        break;
    case para_PageNum:
        Element = new ParaPageNum();
        break;
    case para_FlowObjectAnchor:
        Element = new ParaFlowObjectAnchor();
        break;
    case para_HyperlinkEnd:
        Element = new ParaHyperlinkEnd();
        break;
    case para_CommentStart:
        Element = new ParaCommentStart();
        break;
    case para_CommentEnd:
        Element = new ParaCommentEnd();
        break;
    case para_PresentationNumbering:
        Element = new ParaPresentationNumbering();
        break;
    }
    if (null != Element) {
        Element.Read_FromBinary(r);
    }
    return Element;
}
var CARD_DIRECTION_N = 0;
var CARD_DIRECTION_NE = 1;
var CARD_DIRECTION_E = 2;
var CARD_DIRECTION_SE = 3;
var CARD_DIRECTION_S = 4;
var CARD_DIRECTION_SW = 5;
var CARD_DIRECTION_W = 6;
var CARD_DIRECTION_NW = 7;
var CURSOR_TYPES_BY_CARD_DIRECTION = [];
CURSOR_TYPES_BY_CARD_DIRECTION[CARD_DIRECTION_N] = "n-resize";
CURSOR_TYPES_BY_CARD_DIRECTION[CARD_DIRECTION_NE] = "ne-resize";
CURSOR_TYPES_BY_CARD_DIRECTION[CARD_DIRECTION_E] = "e-resize";
CURSOR_TYPES_BY_CARD_DIRECTION[CARD_DIRECTION_SE] = "se-resize";
CURSOR_TYPES_BY_CARD_DIRECTION[CARD_DIRECTION_S] = "s-resize";
CURSOR_TYPES_BY_CARD_DIRECTION[CARD_DIRECTION_SW] = "sw-resize";
CURSOR_TYPES_BY_CARD_DIRECTION[CARD_DIRECTION_W] = "w-resize";
CURSOR_TYPES_BY_CARD_DIRECTION[CARD_DIRECTION_NW] = "nw-resize";
function CreateParagraphContent(s) {
    if (s != " ") {
        return new ParaText(s);
    }
    return new ParaSpace(1);
}
function getTextString(docContent) {
    var ret = "";
    for (var i = 0; i < docContent.Content.length; ++i) {
        for (var j = 0; j < docContent.Content[i].Content.length; ++j) {
            if (docContent.Content[i].Content[j].Type === para_Text) {
                ret += docContent.Content[i].Content[j].Value;
            }
            if (docContent.Content[i].Content[j].Type === para_Space) {
                ret += " ";
            }
        }
    }
    return ret;
}
function checkNumberInt(n) {
    if ((/[^[0-9]/.test(n + ""))) {
        return NaN;
    }
    return parseInt(n);
}