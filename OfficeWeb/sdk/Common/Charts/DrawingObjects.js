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
function DrawingBounds(minX, maxX, minY, maxY) {
    this.minX = minX;
    this.maxX = maxX;
    this.minY = minY;
    this.maxY = maxY;
}
function getFullImageSrc(src) {
    if (0 != src.indexOf("http:") && 0 != src.indexOf("data:") && 0 != src.indexOf("https:") && 0 != src.indexOf("ftp:") && 0 != src.indexOf("file:")) {
        var api = window["Asc"]["editor"];
        if (api) {
            if (0 == src.indexOf(g_sResourceServiceLocalUrl + api.documentId)) {
                return src;
            }
            return g_sResourceServiceLocalUrl + api.documentId + "/media/" + src;
        } else {
            if (editor) {
                if (0 == src.indexOf(editor.DocumentUrl)) {
                    return src;
                }
                return editor.DocumentUrl + "media/" + src;
            } else {
                return src;
            }
        }
    } else {
        return src;
    }
}
function getCurrentTime() {
    var currDate = new Date();
    return currDate.getTime();
}
function roundPlus(x, n) {
    if (isNaN(x) || isNaN(n)) {
        return false;
    }
    var m = Math.pow(10, n);
    return Math.round(x * m) / m;
}
function CCellObjectInfo() {
    this.col = 0;
    this.row = 0;
    this.colOff = 0;
    this.rowOff = 0;
    this.colOffPx = 0;
    this.rowOffPx = 0;
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
var prot = asc_CChartStyle.prototype;
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
function asc_CChartBinary(chart) {
    this["binary"] = null;
    if (chart && chart.getObjectType() === historyitem_type_ChartSpace) {
        var writer = new BinaryChartWriter(new CMemory(false)),
        pptx_writer;
        writer.WriteCT_ChartSpace(chart);
        this["binary"] = writer.memory.pos + ";" + writer.memory.GetBase64Memory();
        if (chart.theme) {
            pptx_writer = new CBinaryFileWriter();
            pptx_writer.WriteTheme(chart.theme);
            this["themeBinary"] = pptx_writer.pos + ";" + pptx_writer.GetBase64Memory();
        }
        if (chart.colorMapOverride) {
            pptx_writer = new CBinaryFileWriter();
            pptx_writer.WriteRecord1(1, chart.colorMapOverride, pptx_writer.WriteClrMap);
            this["colorMapBinary"] = pptx_writer.pos + ";" + pptx_writer.GetBase64Memory();
        }
        if (typeof chart.DocumentUrl === "string" && chart.DocumentUrl.length > 0) {
            this["DocumentUrl"] = chart.DocumentUrl;
        }
    }
}
asc_CChartBinary.prototype = {
    asc_getBinary: function () {
        return this["binary"];
    },
    asc_setBinary: function (val) {
        this["binary"] = val;
    },
    asc_getThemeBinary: function () {
        return this["themeBinary"];
    },
    asc_setThemeBinary: function (val) {
        this["themeBinary"] = val;
    },
    asc_setColorMapBinary: function (val) {
        this["colorMapBinary"] = val;
    },
    asc_getColorMapBinary: function () {
        return this["colorMapBinary"];
    },
    getChartSpace: function (workSheet) {
        var binary = this["binary"];
        var stream = CreateBinaryReader(this["binary"], 0, this["binary"].length);
        window.global_pptx_content_loader.Clear();
        var oNewChartSpace = new CChartSpace();
        var oBinaryChartReader = new BinaryChartReader(stream);
        oBinaryChartReader.ExternalReadCT_ChartSpace(stream.size, oNewChartSpace, workSheet);
        return oNewChartSpace;
    },
    getTheme: function () {
        var binary = this["themeBinary"];
        if (binary) {
            var stream = CreateBinaryReader(binary, 0, binary.length);
            var oBinaryReader = new BinaryPPTYLoader();
            oBinaryReader.stream = new FileStream();
            oBinaryReader.stream.obj = stream.obj;
            oBinaryReader.stream.data = stream.data;
            oBinaryReader.stream.size = stream.size;
            oBinaryReader.stream.pos = stream.pos;
            oBinaryReader.stream.cur = stream.cur;
            return oBinaryReader.ReadTheme();
        }
        return null;
    },
    getColorMap: function () {
        var binary = this["colorMapBinary"];
        if (binary) {
            var stream = CreateBinaryReader(binary, 0, binary.length);
            var oBinaryReader = new BinaryPPTYLoader();
            oBinaryReader.stream = new FileStream();
            oBinaryReader.stream.obj = stream.obj;
            oBinaryReader.stream.data = stream.data;
            oBinaryReader.stream.size = stream.size;
            oBinaryReader.stream.pos = stream.pos;
            oBinaryReader.stream.cur = stream.cur;
            var _rec = oBinaryReader.stream.GetUChar();
            var ret = new ClrMap();
            oBinaryReader.ReadClrMap(ret);
            return ret;
        }
        return null;
    }
};
window["Asc"].asc_CChartBinary = asc_CChartBinary;
window["Asc"]["asc_CChartBinary"] = asc_CChartBinary;
prot = asc_CChartBinary.prototype;
prot["asc_getBinary"] = prot.asc_getBinary;
prot["asc_setBinary"] = prot.asc_setBinary;
prot["asc_getThemeBinary"] = prot.asc_getThemeBinary;
prot["asc_setThemeBinary"] = prot.asc_setThemeBinary;
prot["asc_setColorMapBinary"] = prot.asc_setColorMapBinary;
prot["asc_getColorMapBinary"] = prot.asc_getColorMapBinary;
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
    this.FormatCode = "";
    this.isHidden = false;
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
    this.bFromChart = false;
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
    },
    asc_getFromChart: function () {
        return this.bFromChart;
    },
    asc_setFromChart: function (v) {
        this.bFromChart = v;
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
prot["asc_getFromChart"] = prot.asc_getFromChart;
prot["asc_setFromChart"] = prot.asc_setFromChart;
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
prot["asc_putFirstLine"] = prot.asc_putFirstLine;
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
        if (obj.Unifill && obj.Unifill.fill && obj.Unifill.fill.type === FILL_TYPE_SOLID && obj.Unifill.fill.color) {
            this.Color = CreateAscColor(obj.Unifill.fill.color);
        } else {
            this.Color = (undefined != obj.Color && null != obj.Color) ? CreateAscColorCustom(obj.Color.r, obj.Color.g, obj.Color.b) : null;
        }
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
    this.Tabs = [];
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
function CChangeTableData(changedRange, added, hided, removed, arrChanged) {
    this.changedRange = changedRange;
    this.added = added;
    this.hided = hided;
    this.removed = removed;
    this.arrChanged = arrChanged;
}
function GraphicOption(ws, type, range, offset) {
    this.ws = ws;
    this.type = type;
    this.range = range;
    this.offset = offset;
}
GraphicOption.prototype.isScrollType = function () {
    return ((this.type === c_oAscGraphicOption.ScrollVertical) || (this.type === c_oAscGraphicOption.ScrollHorizontal));
};
GraphicOption.prototype.getUpdatedRange = function () {
    return this.range;
};
GraphicOption.prototype.getOffset = function () {
    return this.offset;
};
function DrawingObjects() {
    var ScrollOffset = function () {
        this.getX = function () {
            return -ptToPx((worksheet.cols[worksheet.getFirstVisibleCol(true)].left - worksheet.cellsLeft)) + worksheet.getCellLeft(0, 0);
        };
        this.getY = function () {
            return -ptToPx((worksheet.rows[worksheet.getFirstVisibleRow(true)].top - worksheet.cellsTop)) + worksheet.getCellTop(0, 0);
        };
    };
    var _this = this;
    var asc = window["Asc"];
    var api = asc["editor"];
    var worksheet = null;
    var asc_Range = asc.Range;
    var drawingCtx = null;
    var overlayCtx = null;
    var shapeCtx = null;
    var shapeOverlayCtx = null;
    var trackOverlay = null;
    var autoShapeTrack = null;
    var scrollOffset = new ScrollOffset();
    var aObjects = [];
    var aImagesSync = [];
    _this.zoom = {
        last: 1,
        current: 1
    };
    _this.isViewerMode = null;
    _this.objectLocker = null;
    _this.drawingArea = null;
    _this.coordsManager = null;
    _this.drawingDocument = null;
    _this.asyncImageEndLoaded = null;
    _this.asyncImagesDocumentEndLoaded = null;
    var aDrawTasks = [];
    function drawTaskFunction() {
        var taskLen = aDrawTasks.length;
        if (taskLen) {
            var lastTask = aDrawTasks[taskLen - 1];
            _this.showDrawingObjectsEx(lastTask.params.clearCanvas, lastTask.params.graphicOption, lastTask.params.printOptions);
            aDrawTasks.splice(0, (taskLen - 1 > 0) ? taskLen - 1 : 1);
        }
        api._autoSave();
    }
    function DrawingBase(ws) {
        this.worksheet = ws;
        this.imageUrl = "";
        this.Type = c_oAscCellAnchorType.cellanchorTwoCell;
        this.Pos = {
            X: 0,
            Y: 0
        };
        this.from = new CCellObjectInfo();
        this.to = new CCellObjectInfo();
        this.ext = {
            cx: 0,
            cy: 0
        };
        this.size = {
            width: 0,
            height: 0
        };
        this.graphicObject = null;
        this.boundsFromTo = {
            from: new CCellObjectInfo(),
            to: new CCellObjectInfo()
        };
        this.flags = {
            anchorUpdated: false,
            lockState: c_oAscLockTypes.kLockTypeNone
        };
    }
    DrawingBase.prototype.getAllFonts = function (AllFonts) {
        var _t = this;
        _t.graphicObject && _t.graphicObject.documentGetAllFontNames && _t.graphicObject.documentGetAllFontNames(AllFonts);
    };
    DrawingBase.prototype.isImage = function () {
        var _t = this;
        return _t.graphicObject ? _t.graphicObject.isImage() : false;
    };
    DrawingBase.prototype.isShape = function () {
        var _t = this;
        return _t.graphicObject ? _t.graphicObject.isShape() : false;
    };
    DrawingBase.prototype.isGroup = function () {
        var _t = this;
        return _t.graphicObject ? _t.graphicObject.isGroup() : false;
    };
    DrawingBase.prototype.isChart = function () {
        var _t = this;
        return _t.graphicObject ? _t.graphicObject.isChart() : false;
    };
    DrawingBase.prototype.isGraphicObject = function () {
        var _t = this;
        return _t.graphicObject != null;
    };
    DrawingBase.prototype.isLocked = function () {
        var _t = this;
        return ((_t.graphicObject.lockType != c_oAscLockTypes.kLockTypeNone) && (_t.graphicObject.lockType != c_oAscLockTypes.kLockTypeMine));
    };
    DrawingBase.prototype.getCanvasContext = function () {
        return _this.drawingDocument.CanvasHitContext;
    };
    DrawingBase.prototype.getGraphicObjectMetrics = function () {
        var _t = this;
        var metrics = {
            x: 0,
            y: 0,
            extX: 0,
            extY: 0
        };
        var coordsFrom, coordsTo;
        switch (_t.Type) {
        case c_oAscCellAnchorType.cellanchorAbsolute:
            metrics.x = this.Pos.X;
            metrics.y = this.Pos.Y;
            metrics.extX = this.ext.cx;
            metrics.extY = this.ext.cy;
            break;
        case c_oAscCellAnchorType.cellanchorOneCell:
            coordsFrom = _this.coordsManager.calculateCoords(_t.from);
            metrics.x = pxToMm(coordsFrom.x);
            metrics.y = pxToMm(coordsFrom.y);
            metrics.extX = this.ext.cx;
            metrics.extY = this.ext.cy;
            break;
        case c_oAscCellAnchorType.cellanchorTwoCell:
            coordsFrom = _this.coordsManager.calculateCoords(_t.from);
            metrics.x = pxToMm(coordsFrom.x);
            metrics.y = pxToMm(coordsFrom.y);
            coordsTo = _this.coordsManager.calculateCoords(_t.to);
            metrics.extX = pxToMm(coordsTo.x - coordsFrom.x);
            metrics.extY = pxToMm(coordsTo.y - coordsFrom.y);
            break;
        }
        return metrics;
    };
    DrawingBase.prototype.setGraphicObjectCoords = function () {
        var _t = this;
        if (_t.isGraphicObject()) {
            if ((_t.graphicObject.x < 0) || (_t.graphicObject.y < 0) || (_t.graphicObject.extX < 0) || (_t.graphicObject.extY < 0)) {
                return;
            }
            var rot = isRealNumber(_t.graphicObject.rot) ? _t.graphicObject.rot : 0;
            rot = normalizeRotate(rot);
            var fromX, fromY, toX, toY;
            if (checkNormalRotate(rot)) {
                fromX = mmToPt(_t.graphicObject.x);
                fromY = mmToPt(_t.graphicObject.y);
                toX = mmToPt(_t.graphicObject.x + _t.graphicObject.extX);
                toY = mmToPt(_t.graphicObject.y + _t.graphicObject.extY);
                this.Pos.X = _t.graphicObject.x;
                this.Pos.Y = _t.graphicObject.y;
                this.ext.cx = _t.graphicObject.extX;
                this.ext.cy = _t.graphicObject.extY;
            } else {
                var _xc, _yc;
                _xc = _t.graphicObject.x + _t.graphicObject.extX / 2;
                _yc = _t.graphicObject.y + _t.graphicObject.extY / 2;
                fromX = mmToPt(_xc - _t.graphicObject.extY / 2);
                fromY = mmToPt(_yc - _t.graphicObject.extX / 2);
                toX = mmToPt(_xc + _t.graphicObject.extY / 2);
                toY = mmToPt(_yc + _t.graphicObject.extX / 2);
                this.Pos.X = _xc - _t.graphicObject.extY / 2;
                this.Pos.Y = _yc - _t.graphicObject.extX / 2;
                this.ext.cx = _t.graphicObject.extY;
                this.ext.cy = _t.graphicObject.extX;
            }
            var bReinitHorScroll = false,
            bReinitVertScroll = false;
            var fromColCell = worksheet.findCellByXY(fromX, fromY, true, false, true);
            while (fromColCell.col === null && worksheet.cols.length < gc_nMaxCol) {
                worksheet.expandColsOnScroll(true);
                fromColCell = worksheet.findCellByXY(fromX, fromY, true, false, true);
                bReinitHorScroll = true;
            }
            if (fromColCell.col === null) {
                fromColCell.col = gc_nMaxCol;
            }
            var fromRowCell = worksheet.findCellByXY(fromX, fromY, true, true, false);
            while (fromRowCell.row === null && worksheet.rows.length < gc_nMaxRow) {
                worksheet.expandRowsOnScroll(true);
                fromRowCell = worksheet.findCellByXY(fromX, fromY, true, true, false);
                bReinitVertScroll = true;
            }
            if (fromRowCell.row === null) {
                fromRowCell.row = gc_nMaxRow;
            }
            var toColCell = worksheet.findCellByXY(toX, toY, true, false, true);
            while (toColCell.col === null && worksheet.cols.length < gc_nMaxCol) {
                worksheet.expandColsOnScroll(true);
                toColCell = worksheet.findCellByXY(toX, toY, true, false, true);
                bReinitHorScroll = true;
            }
            if (toColCell.col === null) {
                toColCell.col = gc_nMaxCol;
            }
            var toRowCell = worksheet.findCellByXY(toX, toY, true, true, false);
            while (toRowCell.row === null && worksheet.rows.length < gc_nMaxRow) {
                worksheet.expandRowsOnScroll(true);
                toRowCell = worksheet.findCellByXY(toX, toY, true, true, false);
                bReinitVertScroll = true;
            }
            if (toRowCell.row === null) {
                toRowCell.row = gc_nMaxRow;
            }
            _t.from.col = fromColCell.col;
            _t.from.colOff = ptToMm(fromColCell.colOff);
            _t.from.row = fromRowCell.row;
            _t.from.rowOff = ptToMm(fromRowCell.rowOff);
            _t.to.col = toColCell.col;
            _t.to.colOff = ptToMm(toColCell.colOff);
            _t.to.row = toRowCell.row;
            _t.to.rowOff = ptToMm(toRowCell.rowOff);
            if (bReinitHorScroll) {
                worksheet.handlers.trigger("reinitializeScrollX");
            }
            if (bReinitVertScroll) {
                worksheet.handlers.trigger("reinitializeScrollY");
            }
        }
    };
    DrawingBase.prototype.checkBoundsFromTo = function () {
        var _t = this;
        if (_t.isGraphicObject() && _t.graphicObject.bounds) {
            var bounds = _t.graphicObject.bounds;
            var fromX = mmToPt(bounds.x > 0 ? bounds.x : 0),
            fromY = mmToPt(bounds.y > 0 ? bounds.y : 0),
            toX = mmToPt(bounds.x + bounds.w),
            toY = mmToPt(bounds.y + bounds.h);
            if (toX < 0) {
                toX = 0;
            }
            if (toY < 0) {
                toY = 0;
            }
            var bReinitHorScroll = false,
            bReinitVertScroll = false;
            var fromColCell = worksheet.findCellByXY(fromX, fromY, true, false, true);
            while (fromColCell.col === null && worksheet.cols.length < gc_nMaxCol) {
                worksheet.expandColsOnScroll(true);
                fromColCell = worksheet.findCellByXY(fromX, fromY, true, false, true);
                bReinitHorScroll = true;
            }
            if (fromColCell.col === null) {
                fromColCell.col = gc_nMaxCol;
            }
            var fromRowCell = worksheet.findCellByXY(fromX, fromY, true, true, false);
            while (fromRowCell.row === null && worksheet.rows.length < gc_nMaxRow) {
                worksheet.expandRowsOnScroll(true);
                fromRowCell = worksheet.findCellByXY(fromX, fromY, true, true, false);
                bReinitVertScroll = true;
            }
            if (fromRowCell.row === null) {
                fromRowCell.row = gc_nMaxRow;
            }
            var toColCell = worksheet.findCellByXY(toX, toY, true, false, true);
            while (toColCell.col === null && worksheet.cols.length < gc_nMaxCol) {
                worksheet.expandColsOnScroll(true);
                toColCell = worksheet.findCellByXY(toX, toY, true, false, true);
                bReinitHorScroll = true;
            }
            if (toColCell.col === null) {
                toColCell.col = gc_nMaxCol;
            }
            var toRowCell = worksheet.findCellByXY(toX, toY, true, true, false);
            while (toRowCell.row === null && worksheet.rows.length < gc_nMaxRow) {
                worksheet.expandRowsOnScroll(true);
                toRowCell = worksheet.findCellByXY(toX, toY, true, true, false);
                bReinitVertScroll = true;
            }
            if (toRowCell.row === null) {
                toRowCell.row = gc_nMaxRow;
            }
            _t.boundsFromTo.from.col = fromColCell.col;
            _t.boundsFromTo.from.colOff = ptToMm(fromColCell.colOff);
            _t.boundsFromTo.from.row = fromRowCell.row;
            _t.boundsFromTo.from.rowOff = ptToMm(fromRowCell.rowOff);
            _t.boundsFromTo.to.col = toColCell.col;
            _t.boundsFromTo.to.colOff = ptToMm(toColCell.colOff);
            _t.boundsFromTo.to.row = toRowCell.row;
            _t.boundsFromTo.to.rowOff = ptToMm(toRowCell.rowOff);
            if (bReinitHorScroll) {
                worksheet.handlers.trigger("reinitializeScrollX");
            }
            if (bReinitVertScroll) {
                worksheet.handlers.trigger("reinitializeScrollY");
            }
        }
    };
    DrawingBase.prototype.getRealTopOffset = function () {
        var _t = this;
        var val = _t.worksheet.getCellTop(_t.from.row, 0) + mmToPx(_t.from.rowOff);
        return asc.round(val);
    };
    DrawingBase.prototype.getRealLeftOffset = function () {
        var _t = this;
        var val = _t.worksheet.getCellLeft(_t.from.col, 0) + mmToPx(_t.from.colOff);
        return asc.round(val);
    };
    DrawingBase.prototype.getWidthFromTo = function () {
        return (this.worksheet.getCellLeft(this.to.col, 0) + mmToPx(this.to.colOff) - this.worksheet.getCellLeft(this.from.col, 0) - mmToPx(this.from.colOff));
    };
    DrawingBase.prototype.getHeightFromTo = function () {
        return this.worksheet.getCellTop(this.to.row, 0) + mmToPx(this.to.rowOff) - this.worksheet.getCellTop(this.from.row, 0) - mmToPx(this.from.rowOff);
    };
    DrawingBase.prototype.getVisibleTopOffset = function (withHeader) {
        var _t = this;
        var headerRowOff = _t.worksheet.getCellTop(0, 0);
        var fvr = _t.worksheet.getCellTop(_t.worksheet.getFirstVisibleRow(true), 0);
        var off = _t.getRealTopOffset() - fvr;
        off = (off > 0) ? off : 0;
        return withHeader ? headerRowOff + off : off;
    };
    DrawingBase.prototype.getVisibleLeftOffset = function (withHeader) {
        var _t = this;
        var headerColOff = _t.worksheet.getCellLeft(0, 0);
        var fvc = _t.worksheet.getCellLeft(_t.worksheet.getFirstVisibleCol(true), 0);
        var off = _t.getRealLeftOffset() - fvc;
        off = (off > 0) ? off : 0;
        return withHeader ? headerColOff + off : off;
    };
    DrawingBase.prototype.getDrawingObjects = function () {
        return _this;
    };
    _this.createDrawingObject = function (type) {
        var drawingBase = new DrawingBase(worksheet);
        if (isRealNumber(type)) {
            drawingBase.Type = type;
        }
        return drawingBase;
    };
    _this.cloneDrawingObject = function (object) {
        var copyObject = _this.createDrawingObject();
        copyObject.Type = object.Type;
        copyObject.Pos.X = object.Pos.X;
        copyObject.Pos.Y = object.Pos.Y;
        copyObject.ext.cx = object.ext.cx;
        copyObject.ext.cy = object.ext.cy;
        copyObject.from.col = object.from.col;
        copyObject.from.colOff = object.from.colOff;
        copyObject.from.row = object.from.row;
        copyObject.from.rowOff = object.from.rowOff;
        copyObject.to.col = object.to.col;
        copyObject.to.colOff = object.to.colOff;
        copyObject.to.row = object.to.row;
        copyObject.to.rowOff = object.to.rowOff;
        copyObject.graphicObject = object.graphicObject;
        return copyObject;
    };
    _this.init = function (currentSheet) {
        setInterval(drawTaskFunction, 5);
        var api = window["Asc"]["editor"];
        worksheet = currentSheet;
        drawingCtx = currentSheet.drawingGraphicCtx;
        overlayCtx = currentSheet.overlayGraphicCtx;
        shapeCtx = currentSheet.shapeCtx;
        shapeOverlayCtx = currentSheet.shapeOverlayCtx;
        trackOverlay = new COverlay();
        trackOverlay.init(shapeOverlayCtx.m_oContext, "ws-canvas-graphic-overlay", 0, 0, shapeOverlayCtx.m_lWidthPix, shapeOverlayCtx.m_lHeightPix, shapeOverlayCtx.m_dWidthMM, shapeOverlayCtx.m_dHeightMM);
        autoShapeTrack = new CAutoshapeTrack();
        autoShapeTrack.init(trackOverlay, 0, 0, shapeOverlayCtx.m_lWidthPix, shapeOverlayCtx.m_lHeightPix, shapeOverlayCtx.m_dWidthMM, shapeOverlayCtx.m_dHeightMM);
        shapeCtx.m_oAutoShapesTrack = autoShapeTrack;
        _this.objectLocker = new ObjectLocker(worksheet);
        _this.drawingArea = currentSheet.drawingArea;
        _this.drawingArea.init();
        _this.coordsManager = new CoordsManager(worksheet, true);
        _this.drawingDocument = currentSheet.model.DrawingDocument ? currentSheet.model.DrawingDocument : new CDrawingDocument(this);
        _this.drawingDocument.drawingObjects = this;
        _this.drawingDocument.AutoShapesTrack = autoShapeTrack;
        _this.drawingDocument.TargetHtmlElement = document.getElementById("id_target_cursor");
        _this.drawingDocument.InitGuiCanvasShape(api.shapeElementId);
        _this.controller = new DrawingObjectsController(_this);
        _this.isViewerMode = function () {
            return worksheet.handlers.trigger("getViewerMode");
        };
        aImagesSync = [];
        var i;
        aObjects = currentSheet.model.Drawings;
        for (i = 0; currentSheet.model.Drawings && (i < currentSheet.model.Drawings.length); i++) {
            aObjects[i] = _this.cloneDrawingObject(aObjects[i]);
            var drawingObject = aObjects[i];
            drawingObject.drawingArea = _this.drawingArea;
            drawingObject.worksheet = currentSheet;
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
            var metrics = drawingObject.getGraphicObjectMetrics();
            CheckSpPrXfrm(drawingObject.graphicObject);
            var isSerialize = drawingObject.graphicObject.fromSerialize;
            if (!api.wbModel.bCollaborativeChanges && isSerialize) {
                var rot = isRealNumber(drawingObject.graphicObject.spPr.xfrm.rot) ? drawingObject.graphicObject.spPr.xfrm.rot : 0;
                rot = normalizeRotate(rot);
                var metricExtX, metricExtY;
                if (drawingObject.graphicObject.getObjectType() !== historyitem_type_GroupShape) {
                    metricExtX = metrics.extX;
                    metricExtY = metrics.extY;
                    if (checkNormalRotate(rot)) {
                        drawingObject.graphicObject.spPr.xfrm.setExtX(metrics.extX);
                        drawingObject.graphicObject.spPr.xfrm.setExtY(metrics.extY);
                    } else {
                        drawingObject.graphicObject.spPr.xfrm.setExtX(metrics.extY);
                        drawingObject.graphicObject.spPr.xfrm.setExtY(metrics.extX);
                    }
                } else {
                    if (isRealNumber(drawingObject.graphicObject.spPr.xfrm.extX) && isRealNumber(drawingObject.graphicObject.spPr.xfrm.extY)) {
                        metricExtX = drawingObject.graphicObject.spPr.xfrm.extX;
                        metricExtY = drawingObject.graphicObject.spPr.xfrm.extY;
                    } else {
                        metricExtX = metrics.extX;
                        metricExtY = metrics.extY;
                    }
                }
                if (checkNormalRotate(rot)) {
                    drawingObject.graphicObject.spPr.xfrm.setOffX(metrics.x);
                    drawingObject.graphicObject.spPr.xfrm.setOffY(metrics.y);
                } else {
                    drawingObject.graphicObject.spPr.xfrm.setOffX(metrics.x + metricExtX / 2 - metricExtY / 2);
                    drawingObject.graphicObject.spPr.xfrm.setOffY(metrics.y + metricExtY / 2 - metricExtX / 2);
                }
            }
            delete drawingObject.graphicObject.fromSerialize;
            drawingObject.graphicObject.drawingBase = aObjects[i];
            drawingObject.graphicObject.drawingObjects = _this;
            drawingObject.graphicObject.getAllRasterImages(aImagesSync);
        }
        for (i = 0; i < aImagesSync.length; ++i) {
            aImagesSync[i] = getFullImageSrc(aImagesSync[i]);
        }
        _this.asyncImagesDocumentEndLoaded = function () {
            _this.showDrawingObjects(true);
        };
        if (aImagesSync.length > 0) {
            var old_val = api.ImageLoader.bIsAsyncLoadDocumentImages;
            api.ImageLoader.bIsAsyncLoadDocumentImages = true;
            api.ImageLoader.LoadDocumentImages(aImagesSync, null);
            api.ImageLoader.bIsAsyncLoadDocumentImages = old_val;
        }
        _this.recalculate(true);
        if (window.addEventListener) {
            window.addEventListener("message", _this._uploadMessage, false);
        }
        _this.shiftMap = {};
        worksheet.model.Drawings = aObjects;
    };
    _this.getSelectedDrawingsRange = function () {
        var i, rmin = gc_nMaxRow,
        rmax = 0,
        cmin = gc_nMaxCol,
        cmax = 0,
        selectedObjects = this.controller.selectedObjects,
        drawingBase;
        for (i = 0; i < selectedObjects.length; ++i) {
            drawingBase = selectedObjects[i].drawingBase;
            if (drawingBase) {
                if (drawingBase.from.col < cmin) {
                    cmin = drawingBase.from.col;
                }
                if (drawingBase.from.row < rmin) {
                    rmin = drawingBase.from.row;
                }
                if (drawingBase.to.col > cmax) {
                    cmax = drawingBase.to.col;
                }
                if (drawingBase.to.row > rmax) {
                    rmax = drawingBase.to.row;
                }
            }
        }
        return new asc.ActiveRange(cmin, rmin, cmax, rmax, true);
    };
    _this.recalculate = function (all) {
        _this.controller.recalculate2(all);
    };
    _this.preCopy = function () {
        _this.shiftMap = {};
        var selected_objects = _this.controller.selectedObjects;
        if (selected_objects.length > 0) {
            var min_x, min_y, i;
            min_x = selected_objects[0].x;
            min_y = selected_objects[0].y;
            for (i = 1; i < selected_objects.length; ++i) {
                if (selected_objects[i].x < min_x) {
                    min_x = selected_objects[i].x;
                }
                if (selected_objects[i].y < min_y) {
                    min_y = selected_objects[i].y;
                }
            }
            for (i = 0; i < selected_objects.length; ++i) {
                _this.shiftMap[selected_objects[i].Get_Id()] = {
                    x: selected_objects[i].x - min_x,
                    y: selected_objects[i].y - min_y
                };
            }
        }
    };
    _this.getAllFonts = function (AllFonts) {};
    _this.getOverlay = function () {
        return trackOverlay;
    };
    _this.OnUpdateOverlay = function () {
        _this.drawingArea.drawSelection(_this.drawingDocument);
    };
    _this.changeZoom = function (factor) {
        _this.zoom.last = _this.zoom.current;
        _this.zoom.current = factor;
        _this.resizeCanvas();
    };
    _this.resizeCanvas = function () {
        _this.drawingArea.init();
        shapeCtx.init(drawingCtx.ctx, drawingCtx.getWidth(0), drawingCtx.getHeight(0), drawingCtx.getWidth(3), drawingCtx.getHeight(3));
        shapeCtx.CalculateFullTransform();
        shapeOverlayCtx.init(overlayCtx.ctx, overlayCtx.getWidth(0), overlayCtx.getHeight(0), overlayCtx.getWidth(3), overlayCtx.getHeight(3));
        shapeOverlayCtx.CalculateFullTransform();
        trackOverlay.init(shapeOverlayCtx.m_oContext, "ws-canvas-graphic-overlay", 0, 0, shapeOverlayCtx.m_lWidthPix, shapeOverlayCtx.m_lHeightPix, shapeOverlayCtx.m_dWidthMM, shapeOverlayCtx.m_dHeightMM);
        autoShapeTrack.init(trackOverlay, 0, 0, shapeOverlayCtx.m_lWidthPix, shapeOverlayCtx.m_lHeightPix, shapeOverlayCtx.m_dWidthMM, shapeOverlayCtx.m_dHeightMM);
        autoShapeTrack.Graphics.CalculateFullTransform();
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
    _this.getContextWidth = function () {
        return drawingCtx.getWidth();
    };
    _this.getContextHeight = function () {
        return drawingCtx.getHeight();
    };
    _this.getWorksheetModel = function () {
        return worksheet.model;
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
                            var urls = data["urls"];
                            if (urls && urls.length > 0 && sheetId == worksheet.model.getId()) {
                                var url = urls[0];
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
            } catch(e) {}
        }
    };
    _this.callTrigger = function (triggerName, param) {
        if (triggerName) {
            worksheet.model.workbook.handlers.trigger(triggerName, param);
        }
    };
    _this.getDrawingObjectsBounds = function () {
        var arr_x = [],
        arr_y = [],
        bounds;
        for (var i = 0; i < aObjects.length; ++i) {
            bounds = aObjects[i].graphicObject.bounds;
            arr_x.push(bounds.l);
            arr_x.push(bounds.r);
            arr_y.push(bounds.t);
            arr_y.push(bounds.b);
        }
        return new DrawingBounds(Math.min.apply(Math, arr_x), Math.max.apply(Math, arr_x), Math.min.apply(Math, arr_y), Math.max.apply(Math, arr_y));
    };
    _this.showDrawingObjects = function (clearCanvas, graphicOption, printOptions) {
        var currTime = getCurrentTime();
        if (aDrawTasks.length) {
            var lastTask = aDrawTasks[aDrawTasks.length - 1];
            if (lastTask.params.graphicOption && lastTask.params.graphicOption.isScrollType() && graphicOption && (lastTask.params.graphicOption.type === graphicOption.type)) {
                lastTask.params.graphicOption.range.c1 = Math.min(lastTask.params.graphicOption.range.c1, graphicOption.range.c1);
                lastTask.params.graphicOption.range.r1 = Math.min(lastTask.params.graphicOption.range.r1, graphicOption.range.r1);
                lastTask.params.graphicOption.range.c2 = Math.max(lastTask.params.graphicOption.range.c2, graphicOption.range.c2);
                lastTask.params.graphicOption.range.r2 = Math.max(lastTask.params.graphicOption.range.r2, graphicOption.range.r2);
                return;
            }
            if ((currTime - lastTask.time < 40)) {
                return;
            }
        }
        aDrawTasks.push({
            time: currTime,
            params: {
                clearCanvas: clearCanvas,
                graphicOption: graphicOption,
                printOptions: printOptions
            }
        });
    };
    _this.showDrawingObjectsEx = function (clearCanvas, graphicOption, printOptions) {
        if ((worksheet.model.index != api.wb.model.getActive()) && !printOptions) {
            return;
        }
        if (drawingCtx) {
            if (clearCanvas) {
                _this.drawingArea.clear();
            }
            if (aObjects.length) {
                if (graphicOption) {
                    var updatedRect = {
                        x: 0,
                        y: 0,
                        w: 0,
                        h: 0
                    };
                    var updatedRange = graphicOption.getUpdatedRange();
                    var x1 = worksheet.getCellLeft(updatedRange.c1, 1);
                    var y1 = worksheet.getCellTop(updatedRange.r1, 1);
                    var x2 = worksheet.getCellLeft(updatedRange.c2, 1) + worksheet.getColumnWidth(updatedRange.c2, 1);
                    var y2 = worksheet.getCellTop(updatedRange.r2, 1) + worksheet.getRowHeight(updatedRange.r2, 1);
                    var w = x2 - x1;
                    var h = y2 - y1;
                    var offset = worksheet.getCellsOffset(1);
                    updatedRect.x = ptToMm(x1 - offset.left);
                    updatedRect.y = ptToMm(y1 - offset.top);
                    updatedRect.w = ptToMm(w);
                    updatedRect.h = ptToMm(h);
                    var offsetScroll = graphicOption.getOffset();
                    shapeCtx.m_oContext.save();
                    shapeCtx.m_oContext.beginPath();
                    shapeCtx.m_oContext.rect(ptToPx(x1 - offsetScroll.offsetX), ptToPx(y1 - offsetScroll.offsetY), ptToPx(w), ptToPx(h));
                    shapeCtx.m_oContext.clip();
                    shapeCtx.updatedRect = updatedRect;
                } else {
                    shapeCtx.updatedRect = null;
                }
                for (var i = 0; i < aObjects.length; i++) {
                    var drawingObject = aObjects[i];
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
                            _this.drawingArea.drawObject(drawingObject);
                        }
                    }
                }
                if (graphicOption) {
                    shapeCtx.m_oContext.restore();
                }
            }
            worksheet.model.Drawings = aObjects;
        }
        if (!printOptions) {
            if (aObjects.length) {
                if (_this.controller.selectedObjects.length) {
                    _this.OnUpdateOverlay();
                    _this.drawingDocument.CheckTargetShow();
                    _this.controller.updateSelectionState(true);
                }
            }
        }
    };
    _this.getDrawingDocument = function () {
        return _this.drawingDocument;
    };
    _this.printGraphicObject = function (graphicObject, ctx, top, left) {
        if (graphicObject && ctx) {
            if (graphicObject instanceof CImageShape) {
                printImage(graphicObject, ctx, top, left);
            } else {
                if (graphicObject instanceof CShape) {
                    printShape(graphicObject, ctx, top, left);
                } else {
                    if (graphicObject instanceof CChartSpace) {
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
            if ((graphicObject instanceof CChartSpace) && graphicObject && ctx) {
                var tx = graphicObject.transform.tx;
                var ty = graphicObject.transform.ty;
                graphicObject.transform.tx -= left;
                graphicObject.transform.ty -= top;
                graphicObject.updateChildLabelsTransform(graphicObject.transform.tx, graphicObject.transform.ty);
                graphicObject.draw(ctx);
                graphicObject.transform.tx = tx;
                graphicObject.transform.ty = ty;
                graphicObject.updateChildLabelsTransform(graphicObject.transform.tx, graphicObject.transform.ty);
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
                            if (graphicItem instanceof CChartSpace) {
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
        for (var i = 0; aObjects && (i < aObjects.length); i++) {
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
    _this.clipGraphicsCanvas = function (canvas, graphicOption) {
        if (canvas instanceof CGraphics) {
            var x, y, w, h;
            if (graphicOption) {
                var updatedRange = graphicOption.getUpdatedRange();
                var offsetX = worksheet.cols[worksheet.getFirstVisibleCol(true)].left - worksheet.cellsLeft;
                var offsetY = worksheet.rows[worksheet.getFirstVisibleRow(true)].top - worksheet.cellsTop;
                var vr = worksheet.visibleRange;
                var borderOffsetX = (updatedRange.c1 <= vr.c1) ? 0 : 3;
                var borderOffsetY = (updatedRange.r1 <= vr.r1) ? 0 : 3;
                x = ptToPx(worksheet.getCellLeft(updatedRange.c1, 1) - offsetX) - borderOffsetX;
                y = ptToPx(worksheet.getCellTop(updatedRange.r1, 1) - offsetY) - borderOffsetY;
                w = worksheet.getCellLeft(updatedRange.c2, 0) - worksheet.getCellLeft(updatedRange.c1, 0) + 3;
                h = worksheet.getCellTop(updatedRange.r2, 0) - worksheet.getCellTop(updatedRange.r1, 0) + 3;
            } else {
                x = worksheet.getCellLeft(0, 0);
                y = worksheet.getCellTop(0, 0);
                w = shapeCtx.m_lWidthPix - x;
                h = shapeCtx.m_lHeightPix - y;
            }
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
        if (imageUrl && !_this.isViewerMode()) {
            var _image = api.ImageLoader.LoadImage(imageUrl, 1);
            var isOption = options && options.cell;
            var calculateObjectMetrics = function (object, width, height) {
                var metricCoeff = 1;
                var coordsFrom = _this.coordsManager.calculateCoords(object.from);
                var realTopOffset = coordsFrom.y;
                var realLeftOffset = coordsFrom.x;
                var areaWidth = worksheet.getCellLeft(worksheet.getLastVisibleCol(), 0) - worksheet.getCellLeft(worksheet.getFirstVisibleCol(true), 0);
                if (areaWidth < width) {
                    metricCoeff = width / areaWidth;
                    width = areaWidth;
                    height /= metricCoeff;
                }
                var areaHeight = worksheet.getCellTop(worksheet.getLastVisibleRow(), 0) - worksheet.getCellTop(worksheet.getFirstVisibleRow(true), 0);
                if (areaHeight < height) {
                    metricCoeff = height / areaHeight;
                    height = areaHeight;
                    width /= metricCoeff;
                }
                var findVal = pxToPt(realLeftOffset + width);
                var toCell = worksheet.findCellByXY(findVal, 0, true, false, true);
                while (toCell.col === null && worksheet.cols.length < gc_nMaxCol) {
                    worksheet.expandColsOnScroll(true);
                    toCell = worksheet.findCellByXY(findVal, 0, true, false, true);
                }
                object.to.col = toCell.col;
                object.to.colOff = ptToMm(toCell.colOff);
                findVal = pxToPt(realTopOffset + height);
                toCell = worksheet.findCellByXY(0, findVal, true, true, false);
                while (toCell.row === null && worksheet.rows.length < gc_nMaxRow) {
                    worksheet.expandRowsOnScroll(true);
                    toCell = worksheet.findCellByXY(0, findVal, true, true, false);
                }
                object.to.row = toCell.row;
                object.to.rowOff = ptToMm(toCell.rowOff);
                worksheet.handlers.trigger("reinitializeScroll");
            };
            var addImageObject = function (_image) {
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
                    _this.objectLocker.reset();
                    _this.objectLocker.addObjectId(g_oIdCounter.Get_NewId());
                    _this.objectLocker.checkObjects(function (bLock) {
                        if (bLock !== true) {
                            return;
                        }
                        _this.controller.resetSelection();
                        _this.controller.addImageFromParams(_image.src, pxToMm(coordsFrom.x), pxToMm(coordsFrom.y), pxToMm(coordsTo.x - coordsFrom.x), pxToMm(coordsTo.y - coordsFrom.y));
                    });
                }
                worksheet.model.workbook.handlers.trigger("asc_onEndAction", c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadImage);
                worksheet.setSelectionShape(true);
            };
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
            var addImageObject = function (_image) {
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
            };
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
    _this.addChartDrawingObject = function (chart) {
        if (_this.isViewerMode()) {
            return;
        }
        worksheet.setSelectionShape(true);
        if (chart instanceof asc_ChartSettings) {
            if (api.isChartEditor) {
                _this.controller.selectObject(aObjects[0].graphicObject, 0);
                _this.controller.editChartDrawingObjects(chart);
                return;
            }
            _this.objectLocker.reset();
            _this.objectLocker.addObjectId(g_oIdCounter.Get_NewId());
            _this.objectLocker.checkObjects(function (bLock) {
                if (bLock) {
                    _this.controller.addChartDrawingObject(chart);
                }
            });
        } else {
            if (isObject(chart) && chart["binary"]) {
                History.TurnOff();
                aObjects.length = 0;
                var listRange = new Range(worksheet.model, 0, 0, worksheet.nRowsCount - 1, worksheet.nColsCount - 1);
                listRange.cleanAll();
                if (worksheet.isChartAreaEditMode) {
                    worksheet.isChartAreaEditMode = false;
                    worksheet.arrActiveChartsRanges = [];
                }
                var asc_chart_binary = new Asc.asc_CChartBinary();
                asc_chart_binary.asc_setBinary(chart["binary"]);
                asc_chart_binary.asc_setThemeBinary(chart["themeBinary"]);
                asc_chart_binary.asc_setColorMapBinary(chart["colorMapBinary"]);
                var oNewChartSpace = asc_chart_binary.getChartSpace(worksheet.model);
                var theme = asc_chart_binary.getTheme();
                if (theme) {
                    worksheet.model.workbook.theme = theme;
                }
                var colorMapOverride = asc_chart_binary.getColorMap();
                if (colorMapOverride) {
                    DEFAULT_COLOR_MAP = colorMapOverride;
                }
                if (typeof chart["DocumentUrl"] === "string") {
                    var DocumentUrl = chart["DocumentUrl"];
                    if (DocumentUrl.indexOf(g_sResourceServiceLocalUrl) === 0) {
                        window["Asc"]["editor"].documentId = DocumentUrl.slice(g_sResourceServiceLocalUrl.length, DocumentUrl.length);
                    }
                }
                var font_map = {};
                oNewChartSpace.documentGetAllFontNames(font_map);
                checkThemeFonts(font_map, worksheet.model.workbook.theme.themeElements.fontScheme);
                window["Asc"]["editor"]._loadFonts(font_map, function () {
                    var min_r = 0,
                    max_r = 0,
                    min_c = 0,
                    max_c = 0;
                    var series = oNewChartSpace.chart.plotArea.charts[0].series,
                    ser;
                    function fillTableFromRef(ref) {
                        var cache = ref.numCache ? ref.numCache : (ref.strCache ? ref.strCache : null);
                        var lit_format_code;
                        if (cache) {
                            if (typeof cache.formatCode === "string" && cache.formatCode.length > 0) {
                                lit_format_code = cache.formatCode;
                            } else {
                                lit_format_code = "General";
                            }
                            var sFormula = ref.f + "";
                            if (sFormula[0] === "(") {
                                sFormula = sFormula.slice(1);
                            }
                            if (sFormula[sFormula.length - 1] === ")") {
                                sFormula = sFormula.slice(0, -1);
                            }
                            var f1 = sFormula;
                            var arr_f = f1.split(",");
                            var pt_index = 0,
                            i, j, cell, pt;
                            for (i = 0; i < arr_f.length; ++i) {
                                var parsed_ref = parserHelp.parse3DRef(arr_f[i]);
                                if (parsed_ref) {
                                    var source_worksheet = worksheet.model.workbook.getWorksheetByName(parsed_ref.sheet);
                                    if (source_worksheet === worksheet.model) {
                                        var range1 = source_worksheet.getRange2(parsed_ref.range);
                                        if (range1) {
                                            var range = range1.bbox;
                                            while (worksheet.cols.length < range.c2) {
                                                worksheet.expandColsOnScroll(true);
                                            }
                                            while (worksheet.rows.length < range.r2) {
                                                worksheet.expandRowsOnScroll(true);
                                            }
                                            if (range.r1 > max_r) {
                                                max_r = range.r1;
                                            }
                                            if (range.r2 > max_r) {
                                                max_r = range.r2;
                                            }
                                            if (range.r1 < min_r) {
                                                min_r = range.r1;
                                            }
                                            if (range.r2 < min_r) {
                                                min_r = range.r2;
                                            }
                                            if (range.c1 > max_c) {
                                                max_c = range.c1;
                                            }
                                            if (range.c2 > max_c) {
                                                max_c = range.c2;
                                            }
                                            if (range.c1 < min_c) {
                                                min_c = range.c1;
                                            }
                                            if (range.c2 < min_c) {
                                                min_c = range.c2;
                                            }
                                            if (range.r1 === range.r2) {
                                                for (j = range.c1; j <= range.c2; ++j) {
                                                    cell = source_worksheet.getCell3(range.r1, j);
                                                    pt = cache.getPtByIndex(pt_index);
                                                    if (pt) {
                                                        cell.setNumFormat(typeof pt.formatCode === "string" && pt.formatCode.length > 0 ? pt.formatCode : lit_format_code);
                                                        cell.setValue(pt.val + "");
                                                    }++pt_index;
                                                }
                                            } else {
                                                for (j = range.r1; j <= range.r2; ++j) {
                                                    cell = source_worksheet.getCell3(j, range.c1);
                                                    pt = cache.getPtByIndex(pt_index);
                                                    if (pt) {
                                                        cell.setNumFormat(typeof pt.formatCode === "string" && pt.formatCode.length > 0 ? pt.formatCode : lit_format_code);
                                                        cell.setValue(pt.val + "");
                                                    }++pt_index;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    var first_num_ref;
                    if (series[0]) {
                        if (series[0].val) {
                            first_num_ref = series[0].val.numRef;
                        } else {
                            if (series[0].yVal) {
                                first_num_ref = series[0].yVal.numRef;
                            }
                        }
                    }
                    if (first_num_ref) {
                        var resultRef = parserHelp.parse3DRef(first_num_ref.f);
                        if (resultRef) {
                            worksheet.model.workbook.aWorksheets[0].sName = resultRef.sheet;
                            if (series[0] && series[0].xVal && series[0].xVal.numRef) {
                                fillTableFromRef(series[0].xVal.numRef);
                            }
                            if (series[0].cat && series[0].cat.strRef) {
                                fillTableFromRef(series[0].cat.strRef);
                            }
                            for (var i = 0; i < series.length; ++i) {
                                ser = series[i];
                                if (ser.val && ser.val.numRef) {
                                    fillTableFromRef(ser.val.numRef);
                                }
                                if (ser.yVal && ser.yVal.numRef) {
                                    fillTableFromRef(ser.yVal.numRef);
                                }
                                if (ser.cat && ser.cat.numRef) {
                                    fillTableFromRef(ser.cat.numRef);
                                }
                                if (ser.cat && ser.cat.strRef) {
                                    fillTableFromRef(ser.cat.strRef);
                                }
                                if (ser.tx && ser.tx.strRef) {
                                    fillTableFromRef(ser.tx.strRef);
                                }
                            }
                        }
                    }
                    worksheet._updateCellsRange(new asc_Range(0, 0, Math.max(worksheet.nColsCount - 1, max_c), Math.max(worksheet.nRowsCount - 1, max_r)));
                    aImagesSync.length = 0;
                    oNewChartSpace.getAllRasterImages(aImagesSync);
                    oNewChartSpace.setBDeleted(false);
                    oNewChartSpace.setWorksheet(worksheet.model);
                    oNewChartSpace.addToDrawingObjects();
                    oNewChartSpace.recalculate();
                    CheckSpPrXfrm(oNewChartSpace);
                    var canvas_height = worksheet.drawingCtx.getHeight(3);
                    var pos_y = (canvas_height - oNewChartSpace.spPr.xfrm.extY) / 2;
                    if (pos_y < 0) {
                        pos_y = 0;
                    }
                    var canvas_width = worksheet.drawingCtx.getWidth(3);
                    var pos_x = (canvas_width - oNewChartSpace.spPr.xfrm.extX) / 2;
                    if (pos_x < 0) {
                        pos_x = 0;
                    }
                    oNewChartSpace.spPr.xfrm.setOffX(pos_x);
                    oNewChartSpace.spPr.xfrm.setOffY(pos_y);
                    oNewChartSpace.checkDrawingBaseCoords();
                    oNewChartSpace.recalculate();
                    var d = worksheet._calcActiveCellOffset(_this.getSelectedDrawingsRange());
                    window["Asc"]["editor"].wb.controller.scroll(d);
                    _this.showDrawingObjects(false);
                    _this.controller.resetSelection();
                    _this.controller.selectObject(oNewChartSpace, 0);
                    _this.controller.updateSelectionState();
                    _this.sendGraphicObjectProps();
                    History.TurnOn();
                    if (aImagesSync.length > 0) {
                        window["Asc"]["editor"].ImageLoader.LoadDocumentImages(aImagesSync, null, function () {
                            _this.showDrawingObjects(true);
                        });
                    }
                });
            }
        }
    };
    _this.editChartDrawingObject = function (chart) {
        if (chart) {
            if (api.isChartEditor) {
                _this.controller.selectObject(aObjects[0].graphicObject, 0);
            }
            _this.controller.editChartDrawingObjects(chart);
            _this.showDrawingObjects(false);
        }
    };
    _this.rebuildChartGraphicObjects = function (data) {
        if (!worksheet) {
            return;
        }
        ExecuteNoHistory(function () {
            var i;
            var wsViews = Asc["editor"].wb.wsViews;
            var changedArr = [];
            if (data.changedRange) {
                changedArr.push(new BBoxInfo(worksheet.model, asc_Range(data.changedRange.c1, data.changedRange.r1, data.changedRange.c2, data.changedRange.r2)));
            }
            if (data.added) {
                changedArr.push(new BBoxInfo(worksheet.model, asc_Range(data.added.c1, data.added.r1, gc_nMaxCol, gc_nMaxRow)));
            }
            if (data.hided) {
                changedArr.push(new BBoxInfo(worksheet.model, asc_Range(data.hided.c1, data.hided.r1, data.hided.c2, data.hided.r2)));
            }
            if (data.removed) {
                changedArr.push(new BBoxInfo(worksheet.model, asc_Range(data.removed.c1, data.removed.r1, gc_nMaxCol, gc_nMaxRow)));
            }
            if (Array.isArray(data.arrChanged)) {
                for (i = 0; i < data.arrChanged.length; ++i) {
                    changedArr.push(new BBoxInfo(worksheet.model, asc_Range(data.arrChanged[i].c1, data.arrChanged[i].r1, data.arrChanged[i].c2, data.arrChanged[i].r2)));
                }
            }
            for (i = 0; i < wsViews.length; ++i) {
                if (wsViews[i] && wsViews[i].objectRender) {
                    wsViews[i].objectRender.rebuildCharts(changedArr);
                    wsViews[i].objectRender.recalculate(true);
                }
            }
        },
        _this, []);
    };
    _this.pushToAObjects = function (aDrawing) {
        aObjects = [];
        for (var i = 0; i < aDrawing.length; ++i) {
            aObjects.push(aDrawing[i]);
        }
    };
    _this.rebuildCharts = function (data) {
        for (var i = 0; i < aObjects.length; ++i) {
            if (aObjects[i].graphicObject.rebuildSeries) {
                aObjects[i].graphicObject.rebuildSeries(data);
            }
        }
    };
    _this.updateDrawingObject = function (bInsert, operType, updateRange) {
        if (History.TurnOffHistory > 0) {
            return;
        }
        var metrics = null;
        var count, bNeedRedraw = false,
        offset;
        for (var i = 0; i < aObjects.length; i++) {
            var obj = aObjects[i];
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
                    count = updateRange.c2 - updateRange.c1 + 1;
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
                    break;
                case c_oAscInsertOptions.InsertCellsAndShiftRight:
                    break;
                case c_oAscInsertOptions.InsertRows:
                    count = updateRange.r2 - updateRange.r1 + 1;
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
                    break;
                case c_oAscInsertOptions.InsertCellsAndShiftDown:
                    break;
                }
            } else {
                switch (operType) {
                case c_oAscDeleteOptions.DeleteColumns:
                    count = updateRange.c2 - updateRange.c1 + 1;
                    if (updateRange.c1 <= obj.from.col) {
                        if (updateRange.c2 < obj.from.col) {
                            metrics.from.col -= count;
                            metrics.to.col -= count;
                        } else {
                            metrics.from.col = updateRange.c1;
                            metrics.from.colOff = 0;
                            offset = 0;
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
                    break;
                case c_oAscDeleteOptions.DeleteCellsAndShiftLeft:
                    break;
                case c_oAscDeleteOptions.DeleteRows:
                    count = updateRange.r2 - updateRange.r1 + 1;
                    if (updateRange.r1 <= obj.from.row) {
                        if (updateRange.r2 < obj.from.row) {
                            metrics.from.row -= count;
                            metrics.to.row -= count;
                        } else {
                            metrics.from.row = updateRange.r1;
                            metrics.from.colOff = 0;
                            offset = 0;
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
                    break;
                case c_oAscDeleteOptions.DeleteCellsAndShiftTop:
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
                obj.from.col = metrics.from.col;
                obj.from.colOff = metrics.from.colOff;
                obj.from.row = metrics.from.row;
                obj.from.rowOff = metrics.from.rowOff;
                obj.to.col = metrics.to.col;
                obj.to.colOff = metrics.to.colOff;
                obj.to.row = metrics.to.row;
                obj.to.rowOff = metrics.to.rowOff;
                var coords = _this.coordsManager.calculateCoords(obj.from);
                var rot = isRealNumber(obj.graphicObject.spPr.xfrm.rot) ? obj.graphicObject.spPr.xfrm.rot : 0;
                rot = normalizeRotate(rot);
                if (checkNormalRotate(rot)) {
                    obj.graphicObject.spPr.xfrm.setOffX(pxToMm(coords.x));
                    obj.graphicObject.spPr.xfrm.setOffY(pxToMm(coords.y));
                } else {
                    obj.graphicObject.spPr.xfrm.setOffX(pxToMm(coords.x) - obj.graphicObject.spPr.xfrm.extX / 2 + obj.graphicObject.spPr.xfrm.extY / 2);
                    obj.graphicObject.spPr.xfrm.setOffY(pxToMm(coords.y) - obj.graphicObject.spPr.xfrm.extY / 2 + obj.graphicObject.spPr.xfrm.extX / 2);
                }
                obj.graphicObject.checkDrawingBaseCoords();
                obj.graphicObject.recalculate();
                bNeedRedraw = true;
            }
        }
        bNeedRedraw && _this.showDrawingObjects(true);
    };
    _this.moveRangeDrawingObject = function (oBBoxFrom, oBBoxTo) {
        if (oBBoxFrom && oBBoxTo) {
            var selected_objects = _this.controller.selection.groupSelection ? _this.controller.selection.groupSelection.selectedObjects : _this.controller.selectedObjects;
            var chart;
            if (selected_objects.length === 1 && selected_objects[0].getObjectType() === historyitem_type_ChartSpace) {
                chart = selected_objects[0];
            }
            var object_to_check = _this.controller.selection.groupSelection ? _this.controller.selection.groupSelection : chart;
            if (chart && !(!chart.bbox || !chart.bbox.seriesBBox || oBBoxTo.isEqual(chart.bbox.seriesBBox))) {
                var editChart = function (drawingObject) {
                    var options = new asc_ChartSettings();
                    var catHeadersBBox, serHeadersBBox;
                    var final_bbox = oBBoxTo.clone();
                    if (chart.bbox.seriesBBox.bVert) {
                        options.putInColumns(false);
                        if (chart.bbox.catBBox && chart.bbox.catBBox.r1 === chart.bbox.catBBox.r2 && oBBoxTo.r1 > chart.bbox.catBBox.r1) {
                            catHeadersBBox = {
                                r1: chart.bbox.catBBox.r1,
                                r2: chart.bbox.catBBox.r1,
                                c1: oBBoxTo.c1,
                                c2: oBBoxTo.c2
                            };
                        }
                        if (chart.bbox.serBBox && chart.bbox.serBBox && chart.bbox.serBBox.c1 === chart.bbox.serBBox.c2 && chart.bbox.serBBox.c1 < oBBoxTo.c1) {
                            serHeadersBBox = {
                                r1: oBBoxTo.r1,
                                r2: oBBoxTo.r2,
                                c1: chart.bbox.serBBox.c1,
                                c2: chart.bbox.serBBox.c2
                            };
                        }
                    } else {
                        options.putInColumns(true);
                        if (chart.bbox.catBBox && chart.bbox.catBBox.c1 === chart.bbox.catBBox.c2 && oBBoxTo.c1 > chart.bbox.catBBox.c1) {
                            catHeadersBBox = {
                                r1: oBBoxTo.r1,
                                r2: oBBoxTo.r2,
                                c1: chart.bbox.catBBox.c1,
                                c2: chart.bbox.catBBox.c2
                            };
                        }
                        if (chart.bbox.serBBox && chart.bbox.serBBox && chart.bbox.serBBox.r1 === chart.bbox.serBBox.r2 && chart.bbox.serBBox.r1 < oBBoxTo.r1) {
                            serHeadersBBox = {
                                r1: chart.bbox.serBBox.r1,
                                r2: chart.bbox.serBBox.r2,
                                c1: oBBoxTo.c1,
                                c2: oBBoxTo.c2
                            };
                        }
                    }
                    var startCell = new CellAddress(final_bbox.r1, final_bbox.c1, 0);
                    var endCell = new CellAddress(final_bbox.r2, final_bbox.c2, 0);
                    if (startCell && endCell) {
                        options.range = parserHelp.get3DRef(worksheet.model.sName, startCell.getID() === endCell.getID() ? startCell.getID() : startCell.getID() + ":" + endCell.getID());
                    }
                    var chartSeries = getChartSeries(worksheet.model, options, catHeadersBBox, serHeadersBBox);
                    drawingObject.rebuildSeriesFromAsc(chartSeries);
                    _this.controller.startRecalculate();
                    _this.sendGraphicObjectProps();
                };
                var callbackCheck = function (result) {
                    if (result) {
                        History.Create_NewPoint(historydescription_ChartDrawingObjects);
                        editChart(chart);
                        _this.showDrawingObjects(true);
                    } else {
                        _this.selectDrawingObjectRange(chart);
                    }
                };
                _this.objectLocker.reset();
                _this.objectLocker.addObjectId(object_to_check.Get_Id());
                _this.objectLocker.checkObjects(callbackCheck);
            }
        }
    };
    _this.calcChartInterval = function (chart) {
        if (chart.range.intervalObject) {
            chart.range.interval = _this.bboxToInterval(chart.range.intervalObject.getBBox0(), chart.range.intervalObject.worksheet.sName);
        }
    };
    _this.bboxToInterval = function (box, wsName) {
        var startCell = new CellAddress(box.r1, box.c1, 0);
        var endCell = new CellAddress(box.r2, box.c2, 0);
        if (startCell && endCell) {
            return startCell.getID() === endCell.getID() ? startCell.getID() : parserHelp.get3DRef(wsName, startCell.getID() + ":" + endCell.getID());
        }
        return "";
    };
    _this.updateChartReferences = function (oldWorksheet, newWorksheet, bNoRedraw) {
        ExecuteNoHistory(function () {
            for (var i = 0; i < aObjects.length; i++) {
                var graphicObject = aObjects[i].graphicObject;
                if (graphicObject.updateChartReferences) {
                    graphicObject.updateChartReferences(oldWorksheet, newWorksheet);
                }
            }
        },
        this, []);
    };
    _this.updateChartReferences2 = function (oldWorksheet, newWorksheet) {
        for (var i = 0; i < aObjects.length; i++) {
            var graphicObject = aObjects[i].graphicObject;
            if (graphicObject.updateChartReferences2) {
                graphicObject.updateChartReferences2(oldWorksheet, newWorksheet);
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
        if (lockByDefault) {
            _this.objectLocker.reset();
            _this.objectLocker.addObjectId(drawingObject.graphicObject.Id);
            _this.objectLocker.checkObjects(function (result) {});
        }
        worksheet.setSelectionShape(true);
        return ret;
    };
    _this.groupGraphicObjects = function () {
        if (_this.controller.canGroup()) {
            _this.controller.checkSelectedObjectsAndCallback(_this.controller.createGroup, [], false, historydescription_Spreadsheet_CreateGroup);
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
            var i, aSingleObjects = [];
            for (i = 0; i < aGraphics.length; i++) {
                var obj = _this.createDrawingObject();
                obj.graphicObject = aGraphics[i];
                aGraphics[i].setDrawingBase(obj);
                obj.graphicObject.select(_this.controller);
                obj.setGraphicObjectCoords();
                aSingleObjects.push(obj);
            }
            for (i = 0; i < aObjects.length; i++) {
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
        return position;
    };
    _this.checkGraphicObjectPosition = function (x, y, w, h) {
        var response = {
            result: true,
            x: 0,
            y: 0
        };
        var bottom = worksheet.getCellTop(worksheet.rows.length - 1, 3) + worksheet.getRowHeight(worksheet.rows.length - 1, 3) - worksheet.getCellTop(0, 3);
        var right = worksheet.getCellLeft(worksheet.cols.length - 1, 3) + worksheet.getColumnWidth(worksheet.cols.length - 1, 3) - worksheet.getCellLeft(0, 3);
        if (y < 0) {
            response.result = false;
            response.y = Math.abs(y);
        }
        if (x < 0) {
            response.result = false;
            response.x = Math.abs(x);
        }
        if (x + w > right) {
            var scrollX = scrollOffset.getX();
            var foundCol = worksheet._findColUnderCursor(mmToPt(x + w) + scrollX, true);
            while (foundCol == null) {
                if (worksheet.isMaxCol()) {
                    var lastCol = worksheet.cols[worksheet.nColsCount - 1];
                    if (mmToPt(x + w) + scrollX > lastCol.left) {
                        response.result = false;
                        response.x = ptToMm(lastCol.left - (mmToPt(x + w) + scrollX));
                    }
                    break;
                }
                worksheet.expandColsOnScroll(true);
                worksheet.handlers.trigger("reinitializeScrollX");
                foundCol = worksheet._findColUnderCursor(mmToPt(x + w) + scrollX, true);
            }
        }
        if (y + h > bottom) {
            var scrollY = scrollOffset.getY();
            var foundRow = worksheet._findRowUnderCursor(mmToPt(y + h) + scrollY, true);
            while (foundRow == null) {
                if (worksheet.isMaxRow()) {
                    var lastRow = worksheet.rows[worksheet.nRowsCount - 1];
                    if (mmToPt(y + h) + scrollY > lastRow.top) {
                        response.result = false;
                        response.y = ptToMm(lastRow.top - (mmToPt(y + h) + scrollY));
                    }
                    break;
                }
                worksheet.expandRowsOnScroll(true);
                worksheet.handlers.trigger("reinitializeScrollY");
                foundRow = worksheet._findRowUnderCursor(mmToPt(y + h) + scrollY, true);
            }
        }
        return response;
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
    _this.getDrawingCanvas = function () {
        return {
            shapeCtx: shapeCtx,
            shapeOverlayCtx: shapeOverlayCtx,
            autoShapeTrack: autoShapeTrack,
            trackOverlay: trackOverlay
        };
    };
    _this.convertMetric = function (val, from, to) {
        return val * ascCvtRatio(from, to);
    };
    _this.convertPixToMM = function (pix) {
        return _this.convertMetric(pix, 0, 3);
    };
    _this.getSelectedGraphicObjects = function () {
        return _this.controller.selectedObjects;
    };
    _this.selectedGraphicObjectsExists = function () {
        return _this.controller && _this.controller.selectedObjects.length > 0;
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
            worksheet.handlers.trigger("selectionChanged", worksheet.getSelectionInfo());
        }
    };
    _this.setGraphicObjectProps = function (props) {
        var objectProperties = props;
        var _img;
        if (!isNullOrEmptyString(objectProperties.ImageUrl)) {
            _img = api.ImageLoader.LoadImage(objectProperties.ImageUrl, 1);
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
                _img = api.ImageLoader.LoadImage(objectProperties.ShapeProperties.fill.fill.url, 1);
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
        var offsets = _this.drawingArea.getOffsets(x, y, true);
        if (offsets) {
            _this.controller.onMouseDown(e, pxToMm(x - offsets.x), pxToMm(y - offsets.y));
        }
    };
    _this.graphicObjectMouseMove = function (e, x, y) {
        e.IsLocked = e.isLocked;
        var offsets = _this.drawingArea.getOffsets(x, y, true);
        if (offsets) {
            _this.controller.onMouseMove(e, pxToMm(x - offsets.x), pxToMm(y - offsets.y));
        }
    };
    _this.graphicObjectMouseUp = function (e, x, y) {
        var offsets = _this.drawingArea.getOffsets(x, y, true);
        if (offsets) {
            _this.controller.onMouseUp(e, pxToMm(x - offsets.x), pxToMm(y - offsets.y));
        }
    };
    _this.graphicObjectKeyDown = function (e) {
        return _this.controller.onKeyDown(e);
    };
    _this.graphicObjectKeyPress = function (e) {
        e.KeyCode = e.keyCode;
        e.CtrlKey = e.metaKey || e.ctrlKey;
        e.AltKey = e.altKey;
        e.ShiftKey = e.shiftKey;
        e.Which = e.which;
        return _this.controller.onKeyPress(e);
    };
    _this.cleanWorksheet = function () {
        for (var i = 0; i < aObjects.length; i++) {
            aObjects[i].graphicObject.deleteDrawingBase();
        }
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
        var settings;
        if (api.isChartEditor) {
            return _this.controller.getPropsFromChart(aObjects[0].graphicObject);
        }
        settings = _this.controller.getChartProps();
        if (!settings) {
            settings = new asc_ChartSettings();
            var selectedRange = worksheet.getSelectedRange();
            if (selectedRange) {
                var box = selectedRange.getBBox0();
                settings.putInColumns(!(box.r2 - box.r1 < box.c2 - box.c1));
            }
            settings.putRange(worksheet.getSelectionRangeValue());
            settings.putStyle(2);
            settings.putType(c_oAscChartTypeSettings.lineNormal);
            settings.putTitle(c_oAscChartTitleShowSettings.noOverlay);
            settings.putLegendPos(c_oAscChartLegendShowSettings.right);
            settings.putHorAxisLabel(c_oAscChartHorAxisLabelShowSettings.none);
            settings.putVertAxisLabel(c_oAscChartVertAxisLabelShowSettings.none);
            settings.putDataLabelsPos(c_oAscChartDataLabelsPos.none);
            settings.putHorGridLines(c_oAscGridLinesSettings.major);
            settings.putVertGridLines(c_oAscGridLinesSettings.none);
            settings.putInColumns(false);
            settings.putSeparator(",");
            settings.putLine(true);
            settings.putShowMarker(false);
            var vert_axis_settings = new asc_ValAxisSettings();
            settings.putVertAxisProps(vert_axis_settings);
            vert_axis_settings.setDefault();
            var hor_axis_settings = new asc_CatAxisSettings();
            settings.putHorAxisProps(hor_axis_settings);
            hor_axis_settings.setDefault();
        }
        return settings;
    };
    _this.selectDrawingObjectRange = function (drawing) {
        worksheet.cleanSelection();
        worksheet.arrActiveChartsRanges = [];
        if (!drawing.bbox || drawing.bbox.worksheet !== worksheet.model) {
            return;
        }
        var stroke_color, fill_color;
        if (drawing.bbox.serBBox) {
            stroke_color = fill_color = new CColor(0, 128, 0);
            worksheet._drawElements(worksheet, worksheet._drawSelectionElement, asc.Range(drawing.bbox.serBBox.c1, drawing.bbox.serBBox.r1, drawing.bbox.serBBox.c2, drawing.bbox.serBBox.r2, true), false, 1, stroke_color, fill_color);
        }
        if (drawing.bbox.catBBox) {
            stroke_color = fill_color = new CColor(153, 0, 204);
            worksheet._drawElements(worksheet, worksheet._drawSelectionElement, asc.Range(drawing.bbox.catBBox.c1, drawing.bbox.catBBox.r1, drawing.bbox.catBBox.c2, drawing.bbox.catBBox.r2, true), false, 1, stroke_color, fill_color);
        }
        var BB = drawing.bbox.seriesBBox;
        var range = asc.Range(BB.c1, BB.r1, BB.c2, BB.r2, true);
        worksheet.arrActiveChartsRanges.push(range);
        worksheet.isChartAreaEditMode = true;
        worksheet._drawSelection();
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
        var selected_objects, selection, controller = _this.controller;
        if (controller.selection.groupSelection) {
            selected_objects = controller.selection.groupSelection.selectedObjects;
            selection = controller.selection.groupSelection.selection;
        } else {
            selected_objects = controller.selectedObjects;
            selection = controller.selection;
        }
        if (selection.chartSelection && selection.chartSelection.selection.textSelection) {
            return c_oAscSelectionType.RangeChartText;
        }
        if (selection.textSelection) {
            return c_oAscSelectionType.RangeShapeText;
        }
        if (selected_objects[0]) {
            if (selected_objects[0].getObjectType() === historyitem_type_ChartSpace && selected_objects.length === 1) {
                return c_oAscSelectionType.RangeChart;
            }
            if (selected_objects[0].getObjectType() === historyitem_type_ImageShape) {
                return c_oAscSelectionType.RangeImage;
            }
            return c_oAscSelectionType.RangeShape;
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
    _this.updateSizeDrawingObjects = function (target) {
        if (History.TurnOffHistory > 0) {
            return;
        }
        var i, bNeedRecalc = false,
        drawingObject, coords;
        if (target.target === c_oTargetType.RowResize) {
            for (i = 0; i < aObjects.length; i++) {
                drawingObject = aObjects[i];
                if (drawingObject.from.row >= target.row) {
                    coords = _this.coordsManager.calculateCoords(drawingObject.from);
                    CheckSpPrXfrm(drawingObject.graphicObject);
                    var rot = isRealNumber(drawingObject.graphicObject.spPr.xfrm.rot) ? drawingObject.graphicObject.spPr.xfrm.rot : 0;
                    rot = normalizeRotate(rot);
                    if (checkNormalRotate(rot)) {
                        drawingObject.graphicObject.spPr.xfrm.setOffX(pxToMm(coords.x));
                        drawingObject.graphicObject.spPr.xfrm.setOffY(pxToMm(coords.y));
                    } else {
                        drawingObject.graphicObject.spPr.xfrm.setOffX(pxToMm(coords.x) - drawingObject.graphicObject.spPr.xfrm.extX / 2 + drawingObject.graphicObject.spPr.xfrm.extY / 2);
                        drawingObject.graphicObject.spPr.xfrm.setOffY(pxToMm(coords.y) - drawingObject.graphicObject.spPr.xfrm.extY / 2 + drawingObject.graphicObject.spPr.xfrm.extX / 2);
                    }
                    drawingObject.graphicObject.checkDrawingBaseCoords();
                    bNeedRecalc = true;
                }
            }
        } else {
            for (i = 0; i < aObjects.length; i++) {
                drawingObject = aObjects[i];
                if (drawingObject.from.col >= target.col) {
                    coords = _this.coordsManager.calculateCoords(drawingObject.from);
                    CheckSpPrXfrm(drawingObject.graphicObject);
                    var rot = isRealNumber(drawingObject.graphicObject.spPr.xfrm.rot) ? drawingObject.graphicObject.spPr.xfrm.rot : 0;
                    rot = normalizeRotate(rot);
                    if (checkNormalRotate(rot)) {
                        drawingObject.graphicObject.spPr.xfrm.setOffX(pxToMm(coords.x));
                        drawingObject.graphicObject.spPr.xfrm.setOffY(pxToMm(coords.y));
                    } else {
                        drawingObject.graphicObject.spPr.xfrm.setOffX(pxToMm(coords.x) - drawingObject.graphicObject.spPr.xfrm.extX / 2 + drawingObject.graphicObject.spPr.xfrm.extY / 2);
                        drawingObject.graphicObject.spPr.xfrm.setOffY(pxToMm(coords.y) - drawingObject.graphicObject.spPr.xfrm.extY / 2 + drawingObject.graphicObject.spPr.xfrm.extX / 2);
                    }
                    drawingObject.graphicObject.checkDrawingBaseCoords();
                    bNeedRecalc = true;
                }
            }
        }
        if (bNeedRecalc) {
            _this.controller.recalculate2();
            _this.showDrawingObjects(true);
        }
    };
    _this.checkCursorDrawingObject = function (x, y) {
        var offsets = _this.drawingArea.getOffsets(x, y);
        if (offsets) {
            var objectInfo = {
                cursor: null,
                id: null,
                object: null
            };
            var graphicObjectInfo = _this.controller.isPointInDrawingObjects(pxToMm(x - offsets.x), pxToMm(y - offsets.y));
            if (graphicObjectInfo && graphicObjectInfo.objectId) {
                objectInfo.id = graphicObjectInfo.objectId;
                objectInfo.object = _this.getDrawingBase(graphicObjectInfo.objectId);
                objectInfo.cursor = graphicObjectInfo.cursorType;
                objectInfo.hyperlink = graphicObjectInfo.hyperlink;
                return objectInfo;
            }
        }
        return null;
    };
    _this.getPositionInfo = function (x, y) {
        var info = new CCellObjectInfo();
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
        if (AscBrowser.isOpera) {
            setTimeout(function () {
                fileName.click();
            },
            0);
        } else {
            fileName.click();
        }
    };
    function ascCvtRatio(fromUnits, toUnits) {
        return asc.getCvtRatio(fromUnits, toUnits, drawingCtx.getPPIX());
    }
    function setCanvasZIndex(canvas, value) {
        if (canvas && (value >= 0) && (value <= 1)) {
            canvas.globalAlpha = value;
        }
    }
    function emuToPx(emu) {
        return emu * 20 * 96 / 2.54 / 72 / 100 / 1000;
    }
    function pxToEmu(px) {
        return px * 2.54 * 72 * 100 * 1000 / 20 / 96;
    }
    function pxToPt(val) {
        return val * ascCvtRatio(0, 1);
    }
    function ptToPx(val) {
        return val * ascCvtRatio(1, 0);
    }
    function ptToMm(val) {
        return val * ascCvtRatio(1, 3);
    }
    function mmToPx(val) {
        return val * ascCvtRatio(3, 0);
    }
    function mmToPt(val) {
        return val * ascCvtRatio(3, 1);
    }
    function pxToMm(val) {
        return val * ascCvtRatio(0, 3);
    }
}
function ObjectLocker(ws) {
    var asc = window["Asc"];
    var asc_applyFunction = asc.applyFunction;
    var _t = this;
    _t.bLock = true;
    var aObjectId = [];
    var worksheet = ws;
    _t.reset = function () {
        _t.bLock = true;
        aObjectId = [];
    };
    _t.addObjectId = function (id) {
        aObjectId.push(id);
    };
    _t.checkObjects = function (callback) {
        function callbackEx(result, sync) {
            if (callback) {
                callback(result, sync);
            }
        }
        if (!aObjectId.length || (false === worksheet.collaborativeEditing.isCoAuthoringExcellEnable())) {
            asc_applyFunction(callbackEx, true, true);
            return;
        }
        var sheetId = worksheet.model.getId();
        worksheet.collaborativeEditing.onStartCheckLock();
        for (var i = 0; i < aObjectId.length; i++) {
            var lockInfo = worksheet.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Object, null, sheetId, aObjectId[i]);
            if (false === worksheet.collaborativeEditing.getCollaborativeEditing()) {
                asc_applyFunction(callbackEx, true, true);
                callback = undefined;
            }
            if (false !== worksheet.collaborativeEditing.getLockIntersection(lockInfo, c_oAscLockTypes.kLockTypeMine)) {
                continue;
            } else {
                if (false !== worksheet.collaborativeEditing.getLockIntersection(lockInfo, c_oAscLockTypes.kLockTypeOther)) {
                    asc_applyFunction(callbackEx, false);
                    return;
                }
            }
            if (_t.bLock) {
                worksheet.collaborativeEditing.addCheckLock(lockInfo);
            }
        }
        if (_t.bLock) {
            worksheet.collaborativeEditing.onEndCheckLock(callbackEx);
        } else {
            asc_applyFunction(callbackEx, true, true);
        }
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
function CoordsManager(ws) {
    var _t = this;
    var worksheet = ws;
    _t.calculateCell = function (x, y) {
        var cell = new CCellObjectInfo();
        var _x = x + worksheet.getCellLeft(0, 0);
        var _y = y + worksheet.getCellTop(0, 0);
        var xPt = worksheet.objectRender.convertMetric(_x, 0, 1);
        var yPt = worksheet.objectRender.convertMetric(_y, 0, 1);
        var offsetX = worksheet.cols[worksheet.getFirstVisibleCol(true)].left - worksheet.cellsLeft;
        var offsetY = worksheet.rows[worksheet.getFirstVisibleRow(true)].top - worksheet.cellsTop;
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
        var what = roundPlus(xPt - offsetX, 3);
        var col = worksheet._findColUnderCursor(what, true);
        while (col == null) {
            if (isMaxCol()) {
                col = worksheet._findColUnderCursor(worksheet.cols[gc_nMaxCol - 1].left - 1, true);
                break;
            }
            worksheet.expandColsOnScroll(true);
            worksheet.handlers.trigger("reinitializeScrollX");
            col = worksheet._findColUnderCursor(what + delta, true);
            if (what < 0) {
                delta++;
            }
        }
        cell.col = col.col;
        cell.colOffPx = Math.max(0, _x - worksheet.getCellLeft(cell.col, 0));
        cell.colOff = worksheet.objectRender.convertMetric(cell.colOffPx, 0, 3);
        delta = 0;
        what = roundPlus(yPt - offsetY, 3);
        var row = worksheet._findRowUnderCursor(what, true);
        while (row == null) {
            if (isMaxRow()) {
                row = worksheet._findRowUnderCursor(worksheet.rows[gc_nMaxRow - 1].top - 1, true);
                break;
            }
            worksheet.expandRowsOnScroll(true);
            worksheet.handlers.trigger("reinitializeScrollY");
            row = worksheet._findRowUnderCursor(what + delta, true);
            if (what < 0) {
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
            var rowHeight = worksheet.getRowHeight(cell.row, 3);
            var colWidth = worksheet.getColumnWidth(cell.col, 3);
            var resultRowOff = cell.rowOff > rowHeight ? rowHeight : cell.rowOff;
            var resultColOff = cell.colOff > colWidth ? colWidth : cell.colOff;
            coords.y = worksheet.getCellTop(cell.row, 0) + worksheet.objectRender.convertMetric(resultRowOff, 3, 0) - worksheet.getCellTop(0, 0);
            coords.x = worksheet.getCellLeft(cell.col, 0) + worksheet.objectRender.convertMetric(resultColOff, 3, 0) - worksheet.getCellLeft(0, 0);
        }
        return coords;
    };
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