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
 var bar;
var temMass = [];
var data;
function getUrlVars() {
    var vars = [],
    hash;
    var hashes = window.location.href.slice(window.location.href.indexOf("?")).split("&");
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split("=");
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}
function formatDraw(value, fTitle) {
    var name = "#" + value;
    $(name).dialog({
        title: fTitle.innerText,
        width: 550,
        height: 550,
        modal: true,
        buttons: {
            "�������": function () {
                $(this).dialog("close");
            }
        },
    });
}
function changeGraph(nameGraph) {
    var data = [280, 45, 133, 166, 84, 259, 266, 960, 219, 311, 67, 89];
    var data2 = [280, 45, 133, 166, 84, 259, 266, 960, 219, 311, 67, 89];
    if ("Line" != nameGraph) {
        nameGraph = nameGraph.value;
    }
    if ("Line" == nameGraph) {
        bar = new OfficeExcel.Line("myCanvas", data);
    } else {
        if ("Bar" == nameGraph) {
            bar = new OfficeExcel.Bar("myCanvas", data);
            bar._otherProps._variant = "bar";
        } else {
            if ("Bipolar" == nameGraph) {
                bar = new OfficeExcel.Bipolar("myCanvas", data, data2);
            } else {
                if ("HorizontalBar" == nameGraph) {
                    bar = new OfficeExcel.HBar("myCanvas", data);
                } else {
                    if ("Pie" == nameGraph) {
                        bar = new OfficeExcel.Pie("myCanvas", data);
                    } else {
                        if ("Radar" == nameGraph) {
                            bar = new OfficeExcel.Radar("myCanvas", data);
                        } else {
                            if ("Rose" == nameGraph) {
                                bar = new OfficeExcel.Rose("myCanvas", data);
                            } else {
                                if ("Scatter" == nameGraph) {
                                    bar = new OfficeExcel.Scatter("myCanvas", data);
                                } else {
                                    if ("Waterfall" == nameGraph) {
                                        bar = new OfficeExcel.Waterfall("myCanvas", data);
                                    } else {
                                        if ("Rscatter" == nameGraph) {
                                            bar = new OfficeExcel.Rscatter("myCanvas", data);
                                        } else {
                                            if ("Donut" == nameGraph) {
                                                var donut = new OfficeExcel.Pie("myCanvas", data);
                                                bar._otherProps._variant = "donut";
                                            } else {
                                                if ("Gantt" == nameGraph) {
                                                    var donut = new OfficeExcel.Gantt("myCanvas");
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    bar._chartGutter._left = 35;
    bar._chartGutter._bottom = 35;
    upOptions();
}
function insertOptions() {
    var yFirstMin = bar.min;
    var yFirstMax = bar.max;
    var yFirstDiff = bar._otherProps._numyticks;
    $("#optionsMin").val(yFirstMin);
    $("#optionsMax").val(yFirstMax);
    $("#optionsDiff").val((yFirstMax - yFirstMin) / yFirstDiff);
    if (!isNaN(bar.min)) {
        bar._otherProps._ymin = parseInt(bar.min);
    }
    bar._otherProps._labels = [1, 2, 3, 4, 5];
    bar._otherProps._key = ["���1"];
    bar._chartGutter._left = 145;
    bar._chartGutter._right = 70;
    bar._chartGutter._top = 25;
    bar._chartGutter._bottom = 25;
    upOptions();
}
function upOptions() {
    canvas = $("#myCanvas")[0];
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    bar.Draw();
}
function drawDiagram1() {
    var data = $("#drawDiagramPoint").val().split(",");
    bar = new OfficeExcel.Line("myCanvas", data);
    bar._otherProps._ylabels_count = "auto";
    bar._chartGutter._left = 35;
    bar._chartGutter._bottom = 35;
    bar._otherProps._background_grid_autofit_numvlines = data.length;
    bar._otherProps._background_grid_color = "graytext";
    bar._otherProps._background_barcolor1 = "white";
    bar._otherProps._background_barcolor2 = "white";
    bar._otherProps._colors = ["steelblue"];
    bar._otherProps._linewidth = 3;
    bar._otherProps._key = ["���1"];
    var tempMas = [];
    for (var i = 0; i <= data.length; i++) {
        tempMas[i] = i;
    }
    bar._otherProps._labels = tempMas;
    bar._chartGutter._left = 45;
    bar._chartGutter._right = 90;
    bar._chartGutter._top = 13;
    bar._chartGutter._bottom = 30;
    bar._otherProps._key_position_x = 395;
    bar._otherProps._key_position_y = 123;
    bar.Draw();
    bar._otherProps._hmargin = bar._otherProps._background_grid_vsize / 2;
    upOptions();
    insertAllGraphs();
    insertDiffOptions();
    $("#hiddenCanvas").offset({
        top: $("#myCanvas").offset().top - parseInt($("#hiddenCanvas").css("border-width")),
        left: $("#myCanvas").offset().left - parseInt($("#hiddenCanvas").css("border-width")),
        right: $("#myCanvas").offset().right,
        bottom: $("#myCanvas").offset().bottom
    });
    $("#hiddenCanvas").css("height", $("#myCanvas").css("height"));
    $("#hiddenCanvas").css("width", $("#myCanvas").css("width"));
    $("#hiddenWorkArea").css("width", parseInt($("#myCanvas").css("width")) - bar._chartGutter._left - bar._chartGutter._right);
    $("#hiddenWorkArea").css("height", parseInt($("#myCanvas").css("height")) - bar._chartGutter._top - bar._chartGutter._bottom);
    $("#hiddenWorkArea").offset({
        top: bar._chartGutter._top,
        left: bar._chartGutter._left,
        right: bar._chartGutter._right,
        bottom: bar._chartGutter._bottom
    });
    $("#hiddenAxesX").css("width", parseInt($("#hiddenWorkArea").css("width")) + 5);
    $("#hiddenAxesX").css("height", 20);
    $("#hiddenAxesX").offset({
        top: parseInt($("#hiddenWorkArea").css("top")) + parseInt($("#hiddenWorkArea").css("height")),
        left: parseInt($("#hiddenWorkArea").css("left"))
    });
    $("#hiddenAxesY").css("width", 30);
    $("#hiddenAxesY").css("height", parseInt($("#hiddenWorkArea").css("height")) + 30);
    $("#hiddenAxesY").offset({
        top: parseInt($("#hiddenWorkArea").css("top")),
        left: parseInt($("#hiddenWorkArea").css("left")) - 30
    });
    $("#hiddenDrag").css("width", parseInt($("#hiddenWorkArea").css("width")) + parseInt($("#hiddenAxesY").css("width")));
    $("#hiddenDrag").css("height", parseInt($("#hiddenWorkArea").css("height")) + parseInt($("#hiddenAxesX").css("height")));
    $("#hiddenDrag").offset({
        top: parseInt($("#hiddenAxesY").css("top")),
        left: parseInt($("#hiddenAxesY").css("left"))
    });
}
function calcWidthGraph() {
    var trueWidth = (parseInt($("#myCanvas").css("width")) - bar._chartGutter._left - bar._chartGutter._right);
    if ("bar" == bar.type) {
        var pointKoff = 1 - (1.11111) / (bar.data[0].length);
        bar._otherProps._hmargin = (trueWidth - trueWidth * pointKoff) / 2;
    } else {
        var pointKoff = 1 - 1 / (bar.data[0].length);
        bar._otherProps._hmargin = (trueWidth - trueWidth * pointKoff) / 2;
    }
}
function calcGutter(axis) {
    if (typeof(bar.data[0]) == "object") {
        var arrMin = [];
        var arrMax = [];
        for (var j = 0; j < bar.data.length; j++) {
            min = Math.min.apply(null, bar.data[j]);
            max = Math.max.apply(null, bar.data[j]);
            arrMin[j] = min;
            arrMax[j] = max;
        }
        var min = Math.min.apply(null, arrMin);
        var max = Math.max.apply(null, arrMax);
    } else {
        var min = Math.min.apply(null, bar.data);
        var max = Math.max.apply(null, bar.data);
    }
    var scale = bar.scale;
    if (undefined == scale) {
        scale = [max, min];
    }
    if ("scatter" == bar.type) {
        bar.scale = OfficeExcel.getScale(this.max, bar);
        bar.xScale = OfficeExcel.getScale(true, bar);
        if (bar._otherProps._ymax > 0 && bar._otherProps._ymin < 0) {
            bar._chartGutter._bottom = 14;
            bar._chartGutter._top = 14;
        } else {
            if (bar._otherProps._ymax <= 0 && bar._otherProps._ymin < 0) {
                bar._chartGutter._bottom = 14;
                bar._chartGutter._top = 14;
            } else {
                bar._chartGutter._bottom = 14 + 20;
                bar._chartGutter._top = 14;
            }
        }
        if (bar._otherProps._xmax > 0 && bar._otherProps._xmin < 0) {
            bar._chartGutter._left = 22;
            bar._chartGutter._right = 93;
        } else {
            if (bar._otherProps._xmax <= 0 && bar._otherProps._xmin < 0) {
                bar._chartGutter._left = 22;
                bar._chartGutter._right = 93;
            } else {
                bar._chartGutter._left = bar.context.measureText(Math.max.apply(null, bar.scale)).width + 22;
                bar._chartGutter._right = 93;
            }
        }
    } else {
        if ("hbar" == bar.type || "bar" == bar.type) {
            if ("hbar" == bar.type) {
                bar._chartGutter._left = bar.context.measureText(Math.max.apply(null, [bar.data.length])).width + 20;
            } else {
                bar._chartGutter._left = bar.context.measureText(Math.max.apply(null, scale)).width + 20;
            }
            bar._chartGutter._right = 72;
            bar._chartGutter._bottom = 35;
            bar._chartGutter._top = 14;
        } else {
            if (axis == undefined) {
                bar._chartGutter._left = bar.context.measureText(Math.max.apply(null, scale)).width + 20;
                bar._chartGutter._right = 90;
                if (min < 0 && max < 0 || min < 0 && max > 0) {
                    bar._chartGutter._bottom = 14;
                } else {
                    bar._chartGutter._bottom = 35;
                }
                bar._chartGutter._top = 14;
            } else {
                if (axis == "OX") {
                    if (min < 0 && max < 0 || min < 0 && max > 0) {
                        bar._chartGutter._bottom = 14;
                    } else {
                        bar._chartGutter._bottom = 35;
                    }
                } else {
                    if (axis == "OY") {
                        bar._chartGutter._left = bar.context.measureText(Math.max.apply(null, scale)).width + 20;
                    }
                }
            }
        }
    }
}
function calcAllMargin() {
    if (typeof(bar.data[0]) == "object") {
        var arrMin = [];
        var arrMax = [];
        for (var j = 0; j < bar.data.length; j++) {
            min = Math.min.apply(null, bar.data[j]);
            max = Math.max.apply(null, bar.data[j]);
            arrMin[j] = min;
            arrMax[j] = max;
        }
        var min = Math.min.apply(null, arrMin);
        var max = Math.max.apply(null, arrMax);
    } else {
        var min = Math.min.apply(null, bar.data);
        var max = Math.max.apply(null, bar.data);
    }
    var left = 0;
    var standartMargin = 14;
    left = 21;
    if (bar._otherProps._key_halign == "left") {
        left += 76;
    }
    if (bar._yAxisTitle._align == "rev") {
        left += 28;
    } else {
        if (bar._yAxisTitle._align == "hor") {
            left += 95;
        } else {
            if (bar._yAxisTitle._align == "ver") {
                left += 0;
            }
        }
    }
    bar._chartGutter._left = standartMargin + left;
    var right = 0;
    if (bar._otherProps._key_halign == "right") {
        right += 76;
    }
    bar._chartGutter._right = standartMargin + right;
    var top = 0;
    if (bar._otherProps._key_halign == "top") {
        top += 32;
    }
    if (bar._chartTitle._text != null && bar._chartTitle._text != "") {
        top += 42;
    }
    bar._chartGutter._top = standartMargin + top;
    var bottom = 0;
    if (min < 0 && max < 0 || min < 0 && max > 0) {
        bottom = 14;
    } else {
        bottom = 35;
    }
    if (bar._otherProps._key_halign == "bottom") {
        bottom += 32;
    }
    if (bar._xAxisTitle._text != "") {
        bottom += 29;
    }
    bar._chartGutter._bottom = bottom;
}
$(function () {
    $(".buttonColor").click(function () {
        var nameVal = "#" + this.value;
        if ("none" != $(nameVal).css("display")) {
            $(nameVal).hide();
        } else {
            $(nameVal).show();
        }
    });
    $(".lineMainSelect1").click(function () {
        var nameVal = "#" + "d" + this.id;
        var parentDiv = $(this).parent().parent().parent().parent();
        var margin = parseInt(parentDiv.css("margin-left").replace("px", "")) + parseInt(parentDiv.css("width").replace("px", ""));
        $(nameVal).css("margin-left", margin);
        if ("none" != $(nameVal).css("display")) {
            $(nameVal).hide();
        } else {
            $(nameVal).show();
        }
    });
    $(".getMainName").click(function () {
        var id = this.id;
        if ("mNNot" == id) {
            bar._chartTitle._text = null;
            calcAllMargin();
        } else {
            if ("mNCenter" == id) {
                bar._chartTitle._text = "�������� ���������";
                bar._chartTitle._vpos = 32;
                bar._chartTitle._hpos = 0.5;
                bar._chartTitle._size = 18;
            } else {
                if ("mNUnder" == id) {
                    bar._chartTitle._text = "�������� ���������";
                    bar._chartTitle._vpos = 32;
                    bar._chartTitle._hpos = 0.5;
                    bar._chartTitle._size = 18;
                    calcAllMargin();
                }
            }
        }
        upOptions();
        $(this).parent().parent().parent().parent().hide();
        $("#allMainMenu").children().hide();
    });
    $(".getNameAxes").click(function () {
        var id = this.id;
        if ("mNOXYHorNot" == id) {
            if (bar._xAxisTitle._text != "" && bar._xAxisTitle._text != null) {
                bar._xAxisTitle._text = "";
                calcAllMargin();
            }
        } else {
            if ("mNOXYHorUp" == id) {
                if (bar._xAxisTitle._text == "" || bar._xAxisTitle._text == null) {
                    bar._xAxisTitle._text = "�������� ���";
                    calcAllMargin();
                    bar._xAxisTitle._vpos = bar.canvas.height - 23;
                    bar._xAxisTitle._hpos = bar._chartGutter._left + (bar.canvas.width - bar._chartGutter._left - bar._chartGutter._right) / 2;
                    bar._xAxisTitle._size = 10;
                }
            } else {
                if ("mNOXYVerNot" == id) {
                    bar._xAxisTitle._hpos = bar._chartGutter._left + (bar.canvas.width - bar._chartGutter._left - bar._chartGutter._right) / 2;
                    bar._yAxisTitle._text = "";
                    bar._yAxisTitle._align = null;
                    calcAllMargin();
                } else {
                    if ("mNOXYVerCon" == id) {
                        bar._yAxisTitle._text = "�������� ���";
                        bar._yAxisTitle._align = "rev";
                        calcAllMargin();
                        bar._yAxisTitle._vpos = bar._chartGutter._bottom + (bar.canvas.height - bar._chartGutter._top - bar._chartGutter._bottom) / 2;
                        var keyLeft = 0;
                        if (bar._otherProps._key_halign == "left") {
                            keyLeft = 70;
                        }
                        bar._yAxisTitle._hpos = 23 + keyLeft;
                        bar._yAxisTitle._angle = "null";
                        bar._yAxisTitle._size = 10;
                        bar._xAxisTitle._hpos = bar._chartGutter._left + (bar.canvas.width - bar._chartGutter._left - bar._chartGutter._right) / 2;
                    } else {
                        if ("mNOXYVerName" == id) {} else {
                            if ("mNOXYHorName" == id) {
                                bar._yAxisTitle._text = "�������� ���";
                                bar._yAxisTitle._align = "hor";
                                calcAllMargin();
                                bar._yAxisTitle._vpos = bar._chartGutter._bottom + (bar.canvas.height - bar._chartGutter._top - bar._chartGutter._bottom) / 2;
                                var keyLeft = 0;
                                if (bar._otherProps._key_halign == "left") {
                                    keyLeft = 87;
                                }
                                bar._yAxisTitle._hpos = 48 + keyLeft;
                                bar._yAxisTitle._size = 10;
                                bar._yAxisTitle._angle = 0;
                                var keyLeft = 0;
                                if (bar._otherProps._key_halign == "left") {
                                    keyLeft = 100;
                                }
                                bar._xAxisTitle._hpos = bar._chartGutter._left + (bar.canvas.width - bar._chartGutter._left - bar._chartGutter._right) / 2 + keyLeft;
                            }
                        }
                    }
                }
            }
        }
        upOptions();
        $(this).parent().parent().parent().parent().hide();
        $("#allMainMenu").children().hide();
    });
    $(".getAddKey").click(function () {
        var id = this.id;
        var heightVerKey = 90;
        var heightHorKey = 0;
        var widthVerKey = 32;
        var widthHorKey = 0;
        if ("keyOXYnot" == id) {
            bar._otherProps._key_halign = null;
            calcAllMargin();
        } else {
            if ("keyOXYnotRight" == id) {
                bar._otherProps._key_halign = "right";
                bar._otherProps._key_position_y = bar.canvas.height / 2 - heightVerKey / 2;
                bar._otherProps._key_position_x = bar.canvas.width - widthVerKey - 28;
                calcAllMargin();
            } else {
                if ("keyOXYTop" == id) {
                    bar._otherProps._key_halign = "top";
                    bar._otherProps._key_hpos = bar._otherProps._key_vpos = calcAllMargin();
                } else {
                    if ("keyOXYLeft" == id) {
                        bar._otherProps._key_halign = "left";
                        bar._otherProps._key_position_y = bar.canvas.height / 2 - heightVerKey / 2;
                        bar._otherProps._key_position_x = 20;
                        calcAllMargin();
                    } else {
                        if ("keyOXYBottom" == id) {
                            bar._otherProps._key_halign = "bottom";
                            bar._otherProps._key_hpos = bar._otherProps._key_vpos = calcAllMargin();
                        }
                    }
                }
            }
        }
        upOptions();
        $(this).parent().parent().parent().parent().hide();
        $("#allMainMenu").children().hide();
    });
    $(".lineMainSelect").click(function () {
        var nameVal = "#" + this.id;
        var massiveClass = $(".lineMainSelect");
        var widthCanvas = $("#myCanvas").css("width").replace("px", "");
        var heightCanvas = $("#myCanvas").css("height").replace("px", "");
        var temMass1 = "[1,2,3,4,5,6,7,8,9,10,11,12]";
        var defaultMas = ["���1"];
        var massiveCommand = ["TA_text", "TA_text;_vpos", "TA_text;_vpos", "TX_text", "TX_text", "TY_text", "TY_text", "TY_text", "TY_text", "_key", "_key", "_key", "_key", "_key", "_labels_above", "_labels_above", "_labels_above", "_labels.above", "_labels.above", "_labels.above", "tableBase", "tableBase", "tableBase", "_labels", "_labels", "_labels", "_labels", "_ylabels", "_ylabels", "_ylabels", "_ylabels", "_ylabels", "_ylabels", "_background_grid", "_background_grid", "_background_grid", "_background_grid", "_background_grid", "_background_grid", "_background_grid"];
        var massiveDefault = ["null", "�������� ���������;1", "�������� ���������;null", "null", "�������� ��� X", "null", "�������� ��� Y", "�������� ��� Y", "�������� ��� Y", "null", "['���1']", "['���1']", defaultMas, defaultMas, "false", "true", "true", "true", "true", "true", "tableBase", "tableBase", "tableBase", "null", temMass, temMass, temMass, "false", "true", "true", "true", "true", "true", "null", "true", "true", "true", "null", "true", "true"];
        for (var i = 0; i < massiveClass.length; i++) {
            if (this == massiveClass[i]) {
                var tempDefault;
                var massiveDefTemp;
                var massiveComTemp = massiveCommand[i].split(";");
                if (undefined == massiveDefault[i].split) {
                    massiveDefTemp = massiveDefault[i];
                } else {
                    massiveDefTemp = massiveDefault[i].split(";");
                }
                for (var n = 0; n < massiveComTemp.length; n++) {
                    var checkDoubleName = massiveComTemp[n].substr(0, 2);
                    if ("null" == massiveDefTemp[n]) {
                        tempDefault = null;
                    } else {
                        if ("true" == massiveDefTemp[n]) {
                            tempDefault = true;
                        } else {
                            if ("false" == massiveDefTemp[n]) {
                                tempDefault = false;
                            } else {
                                tempDefault = parseInt(massiveDefTemp[n]);
                            }
                        }
                    }
                    if (isNaN(tempDefault)) {
                        tempDefault = massiveDefTemp[n];
                    }
                    if ("TA" == checkDoubleName) {
                        bar._chartTitle[massiveComTemp[n].replace("TA", "")] = tempDefault;
                    } else {
                        if ("TY" == checkDoubleName) {
                            bar._yAxisTitle[massiveComTemp[n].replace("TY", "")] = tempDefault;
                        } else {
                            if ("TX" == checkDoubleName) {
                                bar._xAxisTitle[massiveComTemp[n].replace("TX", "")] = tempDefault;
                            } else {
                                if ("undefined" != typeof bar._otherProps[massiveComTemp[n]]) {
                                    bar._otherProps[massiveComTemp[n]] = tempDefault;
                                } else {
                                    if ("undefined" != typeof bar._chartGutter[massiveComTemp[n]]) {
                                        bar._chartGutter[massiveComTemp[n]] = tempDefault;
                                    } else {
                                        if ("undefined" != typeof bar._chartTitle[massiveComTemp[n]]) {
                                            bar._chartTitle[massiveComTemp[n]] = tempDefault;
                                        } else {
                                            if ("undefined" != typeof bar._shadow[massiveComTemp[n]]) {
                                                bar._shadow[massiveComTemp[n]] = tempDefault;
                                            } else {
                                                if ("undefined" != typeof bar._tooltip[massiveComTemp[n]]) {
                                                    bar._tooltip[massiveComTemp[n]] = tempDefault;
                                                } else {
                                                    if ("undefined" != typeof bar._xAxisTitle[massiveComTemp[n]]) {
                                                        bar._xAxisTitle[massiveComTemp[n]] = tempDefault;
                                                    } else {
                                                        if ("undefined" != typeof bar._yAxisTitle[massiveComTemp[n]]) {
                                                            bar._yAxisTitle[massiveComTemp[n]] = tempDefault;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                upOptions();
                break;
            }
        }
        $(this).parent().parent().parent().parent().hide();
        $("#allMainMenu").children().hide();
    });
    $("#commandButton").click(function () {
        var value = $("#optionsMin1").val();
        var command = $("#TEST11")[0].selectedOptions[0].innerText;
        if (!isNaN(parseInt(value))) {
            value = parseInt(value);
        } else {
            if (value == "null") {
                value = null;
            } else {
                if (value == "false") {
                    value = false;
                } else {
                    if (value == "true") {
                        value = true;
                    }
                }
            }
        }
        addOptions(command, value);
    });
    $("#angleTextX").click(function () {
        var value = $("#varAngle").val();
        bar._otherProps._text_angle = parseInt(value);
        upOptions();
    });
    $(".colorWatchNamerBack").click(function () {
        var color = $(this).css("background-color");
        $("#colorNameBox").hide();
        bar._otherProps._tickmarks_linewidth = 3;
        bar._chartTitle._background = color;
        upOptions();
    });
    $(".colorWatchMarkerLine").click(function () {
        var color = $(this).css("background-color");
        $("#colorBoxMarkerLine").hide();
        bar._otherProps._tickmarks_dot_color = color;
        upOptions();
    });
    $(".colorWatchNamerXBack").click(function () {
        var color = $(this).css("background-color");
        $("#colorNameXBox").hide();
        bar._xAxisTitle._font = color;
        upOptions();
    });
    $(".colorWatchNamerYBack").click(function () {
        var color = $(this).css("background-color");
        $("#colorNameYBox").hide();
        bar._yAxisTitle._font = color;
        upOptions();
    });
    $(".colorAMBack").click(function () {
        var color = $(this).css("background-color");
        $("#colorBoxAM").hide();
        var colorNew = [color];
        bar._otherProps._colors = colorNew;
        upOptions();
    });
    $(".colorWatchArBack").click(function () {
        var color = $(this).css("background-color");
        $("#colorBox").hide();
        bar._otherProps._background_barcolor1 = color;
        bar._otherProps._background_barcolor2 = color;
        upOptions();
    });
    $(".colorWatchGrid").click(function () {
        var color = $(this).css("background-color");
        $("#colorBoxGrid").hide();
        bar._otherProps._background_grid_color = color;
        upOptions();
    });
    $(".colorWatchBackKeyColor").click(function () {
        var color = $(this).css("background-color");
        $("#keyBackColorBox").hide();
        bar._otherProps._key_background = color;
        upOptions();
    });
    $(".colorWatchKeyColor").click(function () {
        var color = $(this).css("background-color");
        $("#keyColorBox").hide();
        bar._otherProps._key_background = color;
        upOptions();
    });
    $(".colorWatchKeyColor").click(function () {
        var color = $(this).css("background-color");
        $("#keyColorBox").hide();
        bar._otherProps._key_background = color;
        upOptions();
    });
    $(".colorWatchLine").click(function () {
        var color = [$(this).css("background-color")];
        $("#colorBoxLine").hide();
        bar._otherProps._colors = color;
        upOptions();
    });
    $(".colorWatchLineBar").click(function () {
        var color = $(this).css("background-color");
        $("#colorBoxLine").hide();
        bar._otherProps._strokecolor = color;
        upOptions();
    });
    $(".colorWatchShadowLine").click(function () {
        var color = [$(this).css("background-color")];
        $("#colorBoxShadowLine").hide();
        bar._shadow._visible = true;
        bar._shadow._color = color;
        upOptions();
    });
    $(".colorWatchShadowKey").click(function () {
        var color = $(this).css("background-color");
        $("#colorBoxShadowKey").hide();
        bar._otherProps._key_shadow = true;
        bar._otherProps._key_shadow_color = color;
        upOptions();
    });
    $(".colorWatchAYBack").click(function () {
        var color = $(this).css("background-color");
        $("#colorBoxAYBack").hide();
        addOptions("chart.ylabels.inside", true);
        bar._otherProps._ylabels_inside = true;
        addOptions("chart.ylabels.inside.color", color);
        bar._otherProps._ylabels_inside_color = color;
        upOptions();
    });
    $(".colorWatchAYCol").click(function () {
        var color = $(this).css("background-color");
        $("#colorBoxAYCol").hide();
        bar._otherProps._noaxes = false;
        bar._otherProps._axis_color = color;
        upOptions();
    });
    $(".colorWatchAXCol").click(function () {
        var color = $(this).css("background-color");
        $("#colorBoxAXCol").hide();
        bar._otherProps._noaxes = false;
        bar._otherProps._axis_color = color;
        upOptions();
    });
    $(".colorWatchAXBack").click(function () {
        var color = $(this).css("background-color");
        $("#colorBoxAXBack").hide();
        bar._otherProps._xlabels_inside = true;
        bar._otherProps._xlabels_inside_color = color;
        upOptions();
    });
    $(".optionsDiffIntAY").click(function () {
        var valInt = $("#optionsDiffInt").val();
        var valIntNum = $("#optionsXVal").val();
        alert("�������� ����� ���������� �� OX ����������");
    });
    $(".lineSpacingSelect").click(function () {
        var valueSelect = this.id;
        var allChild = $(this).parent().parent().children();
        var styleMass = [];
        for (var i = 0; i < allChild.length; i++) {
            var nameFunc = allChild[i].children[0].id;
            styleMass[i] = nameFunc;
        }
        for (var i = 0; i < styleMass.length; i++) {
            var temp = "#" + styleMass[i] + "P";
            $(temp).hide();
        }
        var valueInput = "#" + valueSelect + "P";
        $(valueInput).show();
    });
    $(".buttonMaket").click(function () {
        var nameVal = "#" + this.parentNode.id + "P";
        if ("none" != $(nameVal).css("display")) {
            $(nameVal).hide();
        } else {
            $(nameVal).show();
        }
    });
    $(".varOptionsAxisY").click(function () {
        var tempMin = parseInt($("#optionsMin").val());
        var tempMax = parseInt($("#optionsMax").val());
        var tempDiff = parseInt($("#optionsDiff").val());
        bar._otherProps._numyticks = parseInt((tempMax - tempMin) / tempDiff);
        bar._otherProps._ymin = tempMin;
        bar._otherProps._ymax = tempMax;
        upOptions();
    });
    $("#myCanvas").dblclick(function (e) {
        var sd;
    });
    $("#tempBase64").click(function () {
        bar._otherProps._background_image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAAsCAMAAACkN+1nAAABqlBMVEUAAAADAwMGBgYJCQkMDAwPDw8SEhIVFRUYGBgbGxseHh4hISEkJCQnJycqKiotLS0wMDAzMzM2NjY5OTk8PDw/Pz9CQkJFRUVISEhLS0tOTk5RUVFUVFRXV1daWlpdXV1gYGBjY2NmZmZpaWlsbGxvb29ycnJ4eHh7e3t+fn6BgYGEhISHh4eKioqNjY2QkJCTk5OWlpaZmZmcnJyfn5+ioqKlpaWoqKirq6uurq6xsbG0tLS3t7e6urq9vb3AwMDDw8PGxsbJycnMzMzPz8/S0tLV1dXY2Njb29ve3t7h4eHk5OTn5+fq6urt7e3w8PDz8/P29vb5+fn8/Pz/AAD/AwP/Bgb/CQn/DAz/Dw//EhL/FRX/GBj/Gxv/Hh7/ISH/JCT/Jyf/MDD/MzP/Pz//QkL/SEj/S0v/Tk7/UVH/YGD/Zmb/aWn/bGz/cnL/dXX/eHj/e3v/fn7/hIT/jY3/k5P/lpb/mZn/nJz/n5//paX/q6v/rq7/tLT/w8P/xsb/z8//1dX/2Nj/29v/3t7/4eH/5OT/7e3/8PD/8/P/9vb/+fn//Pz////dxpC1AAADeUlEQVR42u3V6VcTZxSA8WfIrlIbFCS0TSUUKBBToCGEpYhQCSKGhIyttZVaaWv3zbrQTW3rWu7/3DvJTAayDB7PmXP84PNlkpNkfufOO/MGqfb49vXtD0ztqvhQDblz2bT7yDfke9Pqs+0tH5HbKnzyxyORW/4hDz40zWsPRXxFfjTNi/fFX2RXF/1r8Rm5qyuy4zdyU5H7fiM/KPLUb+RbReQ5kPXsWLYo7drMj03kyy7SPMkURMUqBlNSLYXdCak1GgACWbEqB2BGj5UEdIrVfAwt/NaGjfykyN/7kQkIiVUIJqRaErvjUm2IWnOibQA5PeaAvGjTBtWMgo3s2HeXN/IGROLxsIPMAcPz3RAt70GOwjHRCkFILGQPMyw28kCRrw5EEli/SDpIHFIiF0Iw7iKzwKJofXBkU6Q0VnIQ+Vyf+LvPgIy6yDKwLNX3CRfpgj7RzgKzDdvKXzrK1j8HID1wykWGISbauxDYdJAFZw0G4ZA0ILp56clv/OuJHIOsi+i7XtFOAysO0gMDYnUY+psQ+c60a490wnwdqRgwJNoqMGsjSxA8L1oRmGhG5LcrjUhg0ipQ/3oEluvIOSAj2howZSN9MCJWi8BCC6S6S366veUidg5SBtbryHvAoSPuFywkBdGS2AtFoRXypWleeiS32iIrEJE6MouTiwQgVBSrDLDWAvlTB/lFFGl3uWagx0VyQG/qeLxavoakO+BtsRppjexeM83Lj73urlEYcpFpYE6c7DXph+C6jbS6XHpy84Z4IQnIucg8kG9ECgYMOpfrdBPyRO+tj594IZUQRtFF3gfeaUSsDzvO1/ZwJpuQn3WQX8ULWYRecZFNA5JNyIoB/faukmxEHl4yzStPPZEBmK4jWheENhoReR2MVR07CKFSA/KNDnJTvJByhM7KXiQDpBoQd4STwOB+5N5F3R//80TGISs2EhdtPQj0VxoQ6QPjrMgZtLHKXuQLHeSOeCClbj28GrcKo6+sm/cUWiSZ6nkltgdZAl6zRyH2Zqormq4h1nN4ddcLWWN/aXsmu4KLyAlgSaTcjZ2SGtf1L+t3qbWjz6RokxAVqzBMtkYkHQRrLuvkpQ6YEW0pDAlRZagDzeg/V0PkwCxEnAYcRErTmczcqrSpmEuPL26IPD/yzL1gyIUAR8VpBCPvA9LcS+Ql8gIh/wO4jFzH/PtOVAAAAABJRU5ErkJggg==";
        upOptions();
    });
    $(".formatAreaBackground").click(function () {
        var dsf;
    });
    $(".buttonDifComm").click(function () {
        var id = this.id;
        var valueLeft;
        var valueRight;
        var mainValueL = id.split("command")[1];
        var mainObj;
        if (id == "commandotherProps") {
            mainObj = bar._otherProps;
        } else {
            if (id == "commandchartGutter") {
                mainObj = bar._chartGutter;
            } else {
                if (id == "commandchartTitle") {
                    mainObj = bar._chartTitle;
                } else {
                    if (id == "commandshadow") {
                        mainObj = bar._shadow;
                    } else {
                        if (id == "commandxAxisTitle") {
                            mainObj = bar._xAxisTitle;
                        } else {
                            if (id == "commandyAxisTitle") {
                                mainObj = bar._yAxisTitle;
                            } else {
                                if (id == "commandzoom") {
                                    mainObj = bar._zoom;
                                } else {
                                    if (id == "commandtooltip") {
                                        mainObj = bar._tooltip;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        valueLeft = $("#" + mainValueL).val().split(":")[0];
        valueRight = $("#" + mainValueL + "Min").val();
        if (!isNaN(valueRight)) {
            valueRight = parseInt(valueRight);
        }
        if ("null" == valueRight) {
            valueRight = null;
        } else {
            if ("true" == valueRight) {
                valueRight = true;
            } else {
                if ("false" == valueRight) {
                    valueRight = false;
                }
            }
        }
        mainObj[valueLeft] = valueRight;
        upOptions();
    });
    $("#myCanvas").click(function () {
        $("#hiddenCanvas").show();
    });
    $("#hiddenWorkArea").click(function () {
        $("#hiddenWorkArea").css("border", "2px solid grey");
    });
    $("#hiddenCanvas").draggable({
        start: function (event, ui) {
            $("#hiddenCanvas").addClass("opacitBack");
        },
        stop: function (event, ui) {
            $("#myCanvas").offset({
                top: $("#hiddenCanvas").offset().top + parseInt($("#hiddenCanvas").css("border-width")),
                left: $("#hiddenCanvas").offset().left + parseInt($("#hiddenCanvas").css("border-width")),
            });
            $("#hiddenCanvas").removeClass("opacitBack");
        }
    });
    $("#hiddenWorkArea").draggable({
        containment: "parent",
        start: function (event, ui) {},
        stop: function (event, ui) {
            $("#myCanvas").offset({
                top: $("#hiddenCanvas").offset().top + parseInt($("#hiddenCanvas").css("border-width")),
                left: $("#hiddenCanvas").offset().left + parseInt($("#hiddenCanvas").css("border-width")),
            });
            var top = parseInt($("#hiddenWorkArea").offset().top) - parseInt($("#hiddenCanvas").offset().top) - parseInt($("#hiddenCanvas").css("border-width"));
            var left = parseInt($("#hiddenWorkArea").offset().left) - parseInt($("#hiddenCanvas").offset().left) - parseInt($("#hiddenCanvas").css("border-width"));
            var right = parseInt($("#hiddenCanvas").css("width")) - left - parseInt($("#hiddenWorkArea").css("width"));
            var bottom = parseInt($("#hiddenCanvas").css("height")) - top - parseInt($("#hiddenWorkArea").css("height"));
            bar._chartGutter._top = top;
            bar._chartGutter._bottom = bottom;
            bar._chartGutter._left = left;
            bar._chartGutter._right = right;
            upOptions();
        }
    });
    $("#hiddenCanvas").resizable({
        handles: "all",
        ghost: true,
        start: function (event, ui) {
            $("#hiddenCanvas").addClass("opacitBack");
        },
        stop: function (event, ui) {
            $("#myCanvas").offset({
                top: $("#hiddenCanvas").offset().top + parseInt($("#hiddenCanvas").css("border-width")),
                left: $("#hiddenCanvas").offset().left + parseInt($("#hiddenCanvas").css("border-width")),
            });
            $("#myCanvas").css("height", $("#hiddenCanvas").css("height"));
            $("#myCanvas").css("width", $("#hiddenCanvas").css("width"));
            myCanvas.width = parseInt($("#hiddenCanvas").css("width"));
            myCanvas.height = parseInt($("#hiddenCanvas").css("height"));
            $("#hiddenCanvas").removeClass("opacitBack");
            upOptions();
        }
    });
    $("#hiddenWorkArea").resizable({
        containment: "parent",
        handles: "all",
        stop: function (event, ui) {
            $("#myCanvas").offset({
                top: $("#hiddenCanvas").offset().top + parseInt($("#hiddenCanvas").css("border-width")),
                left: $("#hiddenCanvas").offset().left + parseInt($("#hiddenCanvas").css("border-width")),
            });
            var top = parseInt($("#hiddenWorkArea").offset().top) - parseInt($("#hiddenCanvas").offset().top) - parseInt($("#hiddenCanvas").css("border-width"));
            var left = parseInt($("#hiddenWorkArea").offset().left) - parseInt($("#hiddenCanvas").offset().left) - parseInt($("#hiddenCanvas").css("border-width"));
            var right = parseInt($("#hiddenCanvas").css("width")) - left - parseInt($("#hiddenWorkArea").css("width"));
            var bottom = parseInt($("#hiddenCanvas").css("height")) - top - parseInt($("#hiddenWorkArea").css("height"));
            bar._chartGutter._top = top;
            bar._chartGutter._bottom = bottom;
            bar._chartGutter._left = left;
            bar._chartGutter._right = right;
            upOptions();
        }
    });
    document.onclick = function (e) {
        if ("myCanvas" != e.target.id && "hiddenCanvas" != e.target.id && "hiddenWorkArea" != e.target.id) {
            $("#hiddenCanvas").hide();
        } else {
            $("#hiddenCanvas").show();
        }
    };
});
function reBuild() {
    var bar1 = new OfficeExcel.Line("myCanvas", data);
    bar1._chartGutter = bar._chartGutter;
    bar1._chartTitle = bar._chartTitle;
    bar1._otherProps = bar._otherProps;
    bar1._shadow = bar._shadow;
    bar1._tooltip = bar._tooltip;
    bar1._xAxisTitle = bar._xAxisTitle;
    bar1._yAxisTitle = bar._yAxisTitle;
    bar1._zoom = bar._zoom;
    bar1.Draw();
    bar = bar1;
}
function forArBack(value) {
    var styleMass = [allBackground, gradBackground, pictireBackground, colorBackground, autoBackground];
    bar._otherProps._background_image = null;
    bar._otherProps._background_barcolor1 = "rgba(0,0,0,0)";
    bar._otherProps._background_barcolor2 = "rgba(0,0,0,0)";
    upOptions();
    for (var i = 0; i < styleMass.length; i++) {
        var temp = "#" + styleMass[i].id;
        $(temp).hide();
    }
    var valueInput = "#" + value;
    $(valueInput).show();
}
function forArBackAM(value) {
    var styleMass = [allBackgroundAM, gradBackgroundAM, pictireBackgroundAM, colorBackgroundAM, autoBackgroundAM];
    value = value.value;
    if ("notBackgroundAM" == value) {
        bar._otherProps._colors = ["rgba(0,0,0,0)"];
    }
    upOptions();
    for (var i = 0; i < styleMass.length; i++) {
        var temp = "#" + styleMass[i].id;
        $(temp).hide();
    }
    var valueInput = "#" + value;
    $(valueInput).show();
}
function forNameBack(value) {
    var styleMass = [allNBackground, gradNBackground, pictireNBackground, colorNBackground, autoNBackground];
    if ("notNBackground" == value) {
        bar._chartTitle._background = null;
        upOptions();
    }
    for (var i = 0; i < styleMass.length; i++) {
        var temp = "#" + styleMass[i].id;
        $(temp).hide();
    }
    var valueInput = "#" + value;
    $(valueInput).show();
}
function forNameXBack(value) {
    var styleMass = [allNXBackground, gradNXBackground, pictireNXBackground, colorNXBackground, autoNXBackground];
    if ("notNXBackground" == value) {
        bar._xAxisTitle.font = null;
        upOptions();
    }
    for (var i = 0; i < styleMass.length; i++) {
        var temp = "#" + styleMass[i].id;
        $(temp).hide();
    }
    var valueInput = "#" + value;
    $(valueInput).show();
}
function forNameYBack(value) {
    var styleMass = [allNYBackground, gradNYBackground, pictireNYBackground, colorNYBackground, autoNYBackground];
    if ("notNYBackground" == value) {
        bar._yAxisTitle.font = null;
        upOptions();
    }
    for (var i = 0; i < styleMass.length; i++) {
        var temp = "#" + styleMass[i].id;
        $(temp).hide();
    }
    var valueInput = "#" + value;
    $(valueInput).show();
}
function forAXOpInt(value) {
    if (value == "valIntAX") {
        $("#optionsXVal").attr("disabled", false);
    } else {
        $("#optionsXVal").attr("disabled", "disabled");
    }
}
function OYtoOX(value) {
    if (value == "valMax") {
        bar._otherProps._yaxispos = "right";
    } else {
        bar._otherProps._yaxispos = "left";
    }
    upOptions();
}
function aMForAllMarker(value) {
    var styleMass = [notMainLine, mainLine, gradMainLine, autoMainLine];
    if ("notMainLine" == value) {
        bar._otherProps._linewidth = 0.01;
    } else {
        bar._otherProps._linewidth = $("#widthLineGraph").val();
    }
    upOptions();
    for (var i = 0; i < styleMass.length; i++) {
        var temp = "#" + styleMass[i].id;
        $(temp).hide();
    }
    var valueInput = "#" + value;
    $(valueInput).show();
}
function MForAllMarker(value) {
    var styleMass = [notMainLine, mainLine, gradMainLine, autoMainLine];
    if ("notMainLine" == value) {
        bar._otherProps._linewidth = 0.01;
    } else {
        bar._otherProps._linewidth = $("#widthLineGraph").val();
    }
    upOptions();
    for (var i = 0; i < styleMass.length; i++) {
        var temp = "#" + styleMass[i].id;
        $(temp).hide();
    }
    var valueInput = "#" + value;
    $(valueInput).show();
}
function forKeyBackColor(value) {
    var styleMass = [allKeyBackColor, gradKeyBackColor, pictireKeyBackColor, colorKeyBackColor, autoKeyBackColor];
    for (var i = 0; i < styleMass.length; i++) {
        var temp = "#" + styleMass[i].id;
        $(temp).hide();
    }
    var valueInput = "#" + value;
    $(valueInput).show();
}
function forKeyColor(value) {
    var styleMass = [allKeyColor, gradKeyColor, autoKeyColor];
    for (var i = 0; i < styleMass.length; i++) {
        var temp = "#" + styleMass[i].id;
        $(temp).hide();
    }
    var valueInput = "#" + value;
    $(valueInput).show();
}
function forAYBack(value) {
    var styleMass = [allBackgroundAY, gradBackgroundAY, pictireBackgroundAY, colorBackgroundAY, autoBackgroundAY];
    if ("notBackgroundAY" == value) {
        bar._otherProps._ylabels_inside = false;
    }
    upOptions();
    for (var i = 0; i < styleMass.length; i++) {
        var temp = "#" + styleMass[i].id;
        $(temp).hide();
    }
    var valueInput = "#" + value;
    $(valueInput).show();
}
function forAYCol(value) {
    var styleMass = [allColorAY, gradColorAY, autoColorAY];
    if ("notColorAY" == value) {
        bar._otherProps._noaxes = true;
    }
    upOptions();
    for (var i = 0; i < styleMass.length; i++) {
        var temp = "#" + styleMass[i].id;
        $(temp).hide();
    }
    var valueInput = "#" + value;
    $(valueInput).show();
}
function forAXCol(value) {
    var styleMass = [allColorAX, gradColorAX, autoColorAX];
    if ("notColorAX" == value) {
        bar._otherProps._noaxes = true;
    }
    upOptions();
    for (var i = 0; i < styleMass.length; i++) {
        var temp = "#" + styleMass[i].id;
        $(temp).hide();
    }
    var valueInput = "#" + value;
    $(valueInput).show();
}
function aMForAllMarkerLine(value) {
    var styleMass = [notMarkerLine, markerLine, gradMarkerLine, autoMarkerLine];
    for (var i = 0; i < styleMass.length; i++) {
        var temp = "#" + styleMass[i].id;
        $(temp).hide();
    }
    var valueInput = "#" + value;
    $(valueInput).show();
}
function forAXBack(value) {
    var styleMass = [allBackgroundAX, gradBackgroundAX, pictireBackgroundAX, colorBackgroundAX, autoBackgroundAX];
    if ("notBackgroundAX" == value) {
        bar._otherProps.xlabels_inside = false;
    }
    upOptions();
    for (var i = 0; i < styleMass.length; i++) {
        var temp = "#" + styleMass[i].id;
        $(temp).hide();
    }
    var valueInput = "#" + value;
    $(valueInput).show();
}
function forAllMarker1(value) {
    if (value == "notOptionsMarker") {
        bar._otherProps._tickmarks = 0;
        bar._otherProps._ticksize = 0;
        upOptions();
        return;
    }
    var styleMass = [insideOptionsMarker];
    if (value == "insideOptionsMarker") {
        bar._otherProps._ticksize = 1;
        bar._otherProps._tickmarks = "circle";
    }
    upOptions();
    for (var i = 0; i < styleMass.length; i++) {
        var temp = "#" + styleMass[i].id;
        $(temp).hide();
    }
    var valueInput = "#" + value;
    $(valueInput).show();
}
function forLineGrid(value) {
    var styleMass = [allLineGrid, gradLineGrid, autoLineGrid];
    var gridDefault;
    if ("notLineGrid" == value) {
        gridDefault = false;
    } else {
        gridDefault = true;
    }
    bar._otherProps._background_grid_vlines = gridDefault;
    bar._otherProps._background_grid_hlines = gridDefault;
    upOptions();
    for (var i = 0; i < styleMass.length; i++) {
        var temp = "#" + styleMass[i].id;
        $(temp).hide();
    }
    var valueInput = "#" + value;
    $(valueInput).show();
}
function sizeChange(value) {
    var valueSize = value.value;
    bar._otherProps._background_grid_width = valueSize;
    upOptions();
}
function sizeMarkerChange(value) {
    var valueSize = value.value;
    bar._otherProps._ticksize = valueSize;
    upOptions();
}
function sizeLineChange(value) {
    var valueSize = value.value;
    bar._otherProps._linewidth = parseInt(valueSize);
    upOptions();
}
function sizeAYChange(value) {
    var valueSize = value.value;
    addOptions("chart.axis.linewidth", parseInt(valueSize));
}
function sizeAXChange(value) {
    var valueSize = value.value;
    addOptions("chart.axis.linewidth", parseInt(valueSize));
    bar._otherProps._linewidth = valueSize;
}
function sizeMarLineChange(value) {
    var valueSize = value.value;
    bar._otherProps._tickmarks_linewidth = parseInt(valueSize);
    upOptions();
}
function typeMarkerChange(value) {
    var valueType = value.value;
    bar._otherProps._tickmarks = valueType;
    upOptions();
}
function checkCurvyline(value) {
    bar._otherProps._curvy = value.checked;
    upOptions();
}
function showWorkFunction(value) {
    if (true == value.checked) {
        $(".notFunction").css("display", "none");
    } else {
        $(".notFunction").css("display", "block");
    }
}
function showAllOptions(value) {
    if (true == value.checked) {
        $("#showAllOptions").css("display", "block");
    } else {
        $("#showAllOptions").css("display", "none");
    }
}
function checkKeyOnD(value) {
    var check;
    if (false == value.checked) {
        check = "graph";
    } else {
        check = "gutter";
    }
    bar._otherProps._key_position = check;
    upOptions();
}
function invertY(value) {
    bar._otherProps._ylabels_invert = value.checked;
    upOptions();
}
function shadowLineChange(value) {
    var valueSize = value.value;
    if ("false" == valueSize) {
        valueSize = false;
    }
    bar._shadow._visible = valueSize;
    upOptions();
}
function shadowKeyChange(value) {
    var valueSize = value.value;
    if ("false" == valueSize) {
        valueSize = false;
    }
    bar._otherProps._key_shadow = valueSize;
    upOptions();
}
function forKeyOptions(value) {
    var positionKey = bar._otherProps._key_position;
    var valueSize = value;
    if ("graph" == positionKey) {
        var width = $("#myCanvas").css("width").replace("px", "");
        var height = $("#myCanvas").css("height").replace("px", "");
        var x = 0;
        var y = 0;
        if ("left" == valueSize) {
            x = 0;
            y = height / 2;
        } else {
            if ("right" == valueSize) {
                x = width;
                y = height / 2;
            } else {
                if ("bottom" == valueSize) {
                    x = width / 2;
                    y = height - 50;
                } else {
                    if ("top" == valueSize) {
                        x = width / 2;
                        y = 0;
                    }
                }
            }
        }
        bar._otherProps._key_position_x = x;
        bar._otherProps._key_position_y = y;
    } else {
        var width = $("#myCanvas").css("width").replace("px", "");
        var height = $("#myCanvas").css("height").replace("px", "");
        var x = 0;
        var y = 0;
        if ("left" == valueSize) {
            x = 0;
            y = height / 2;
        } else {
            if ("right" == valueSize) {
                x = width;
                y = height / 2;
            } else {
                if ("bottom" == valueSize) {
                    x = width / 2;
                    y = 0;
                } else {
                    if ("top" == valueSize) {
                        x = width / 2;
                        y = height;
                    }
                }
            }
        }
        bar._otherProps._key_position_x = x;
        bar._otherProps._key_position_y = y;
    }
    upOptions();
}
function sizeKeyWidthChange(value) {
    var valueSize = value.value;
    bar._otherProps._key_linewidth = parseInt(valueSize);
    upOptions();
}
function cFlatXChange(value) {
    bar._otherProps._text_angle = parseInt(value.value);
    upOptions();
}
function changeDiagram(value) {
    var valueSize = value.value;
    if (valueSize == "1") {
        addOptions("chart.title", "�������� ���������");
        addOptions("chart.title.xaxis", "�������� ��� X");
        addOptions("chart.title.yaxis", "�������� ��� Y");
    } else {
        if (valueSize == "2") {
            addOptions("chart.title", "�������� ���������");
            addOptions("chart.title.xaxis", "");
            addOptions("chart.title.yaxis", "�������� ��� Y");
        } else {
            if (valueSize == "3") {
                addOptions("chart.title", "�������� ���������");
                addOptions("chart.title.xaxis", "");
                addOptions("chart.title.yaxis", "");
            } else {
                if (valueSize == "4") {
                    addOptions("chart.title", "");
                    addOptions("chart.title.xaxis", "");
                    addOptions("chart.title.yaxis", "");
                }
            }
        }
    }
}
function insertAllOptions() {
    var allOptions = ["chart.background.barcolor1", "chart.background.barcolor2", "chart.background.grid", "chart.background.grid.color", "chart.background.hbars", "chart.background.grid.hsize", "chart.background.grid.vsize", "chart.background.grid.width", "chart.background.grid.border", "chart.background.grid.hline", "chart.background.grid.vline", "chart.background.grid.autofit", "chart.background.grid.autofit.numhlines", "chart.background.grid.autofit.numvlines", "chart.background.grid.autofit.align", "chart.background.image", "chart.background.image.stretch", "chart.background.image.x", "chart.background.image.y", "chart.background.image.w", "chart.background.image.h", "chart.background.image.align", "chart.backdrop", "chart.backdrop.size", "chart.backdrop.alpha", "chart.labels.above", "chart.labels.above.size", "chart.labels", "chart.labels.ingraph", "chart.ylabels", "chart.ylabels.invert", "chart.ylabels.count", "chart.ylabels.inside", "chart.ylabels.inside.color", "chart.ylabels.specific", "chart.xlabels.inside", "chart.xlabels.inside.color", "chart.text.size", "chart.text.angle", "chart.text.font", "chart.text.color", "chart.gutter.left", "chart.gutter.right", "chart.gutter.top", "chart.gutter.bottom", "chart.hmargin", "chart.colors", "chart.colors.alternate", "chart.fillstyle", "chart.filled", "chart.filled.accumulative", "chart.filled.range", "chart.shadow", "chart.shadow.color", "chart.shadow.offsetx", "chart.shadow.offsety", "chart.shadow.blur", "chart.tooltips", "chart.tooltips.effect", "chart.tooltips.css.class", "chart.tooltips.override", "chart.tooltips.highlight", "chart.tooltips.hotspot.xonly", "chart.tooltips.coords.page", "chart.tooltips.hotspot.size", "chart.crosshairs", "chart.crosshairs.linewidth", "chart.crosshairs.color", "chart.crosshairs.hlines", "chart.crosshairs.vlines", "chart.contextmenu", "chart.annotatable", "chart.annotate.color", "chart.resizable", "chart.resize.handle.background", "chart.adjustable", "chart.title", "chart.title.font", "chart.title.size", "chart.title.bold", "chart.title.background", "chart.title.vpos", "chart.title.color", "chart.title.xaxis", "chart.title.xaxis.size", "chart.title.xaxis.font", "chart.title.xaxis.bold", "chart.title.yaxis", "chart.title.yaxis.size", "chart.title.yaxis.font", "chart.title.yaxis.bold", "chart.title.xaxis.pos", "chart.title.yaxis.pos", "chart.title.yaxis.align", "chart.key", "chart.key.background", "chart.key.halign", "chart.key.position", "chart.key.position.x", "chart.key.position.y", "chart.key.position.gutter.boxed", "chart.key.shadow", "chart.key.shadow.color", "chart.key.shadow.blur", "chart.key.shadow.offsetx", "chart.key.shadow.offsety", "chart.key.rounded", "chart.key.color.shape", "chart.key.linewidth", "chart.key.interactive", "chart.key.colors", "chart.units.post", "chart.units.pre", "chart.scale.decimals", "chart.scale.point", "chart.scale.thousand", "chart.scale.round", "chart.ymin", "chart.ymax", "chart.outofbounds", "chart.numxticks", "chart.numyticks", "chart.ticksize", "chart.tickdirection", "chart.axis.color", "chart.xaxispos", "chart.yaxispos", "chart.noaxes", "chart.axesontop", "chart.noendxtick", "chart.noendytick", "chart.zoom.factor", "chart.zoom.fade.in", "chart.zoom.fade.out", "chart.zoom.hdir", "chart.zoom.vdir", "chart.zoom.delay", "chart.zoom.frames", "chart.zoom.shadow", "chart.zoom.background", "chart.events.click", "chart.events.mousemove", "chart.tickmarks", "chart.tickmarks.dot.color", "chart.tickmarks.linewidth", "chart.stepped", "chart.linewidth", "chart.variant", "chart.animation.unfold.x", "chart.animation.unfold.y", "chart.animation.unfold.initial", "chart.chromefix", "chart.highlight.stroke", "chart.highlight.fill", "chart.curvy", "chart.curvy.factor"];
    var allDefaultOptions = ["Default: rgba(0,0,0,0)", "Default: rgba(0,0,0,0)", "Default: true", "Default: #eee", "Default: null", "Default: 25", "Default: 25", "Default: 1", "Default: true", "Default: true", "Default: true", "Default: true", "Default: 5", "Default: 20", "Default: false", "Default: null", "Default: true", "Default: null", "Default: null", "Default: null", "Default: null", "Default: null", "Default: false", "Default: 30", "Default: 0.2", "Default: false", "Default: 8", "Default: [] (An empty array)", "Default: null", "Default: true", "Default: false", "Default: 5", "Default: false", "Default: rgba(255,255,255,0.5)", "Default:null", "Default: false", "Default: rgba(255,255,255,0.5)", "Default: 10", "Default: 0 (Horizontal)", "Default: Arial", "Default: black", "Default: 25", "Default: 25", "Default: 25", "Default: 25", "Default: 0", 'Default: ["#f00", "#0f0", "", #00f", "#f0f", "#ff0", "#0ff"]', "Default: false", "Default: null", "Default: false", "Default: true", "Default: false", "Default: false", "Default: rgba(0,0,0,0.5)", "Default: 3", "Default: 3", "Default: 3", "Default: [] (An empty array)", "Default: fade", "Default: RGraph_tooltip", "Default: null", "Default: true", "Default: false", "Default:alse", "Default: 5", "Default: false", "Default: 1", "Default: #333", "Default: true", "Default: true", "Default: [] (An empty array)", "Default: false", "Default: black", "Default: false", "Default:ull", "Default: false", "Default: none", "Default: null", "Default: null", "Default: true", "Default: null", "Default: null", "Default: black", "Default: none", "Default: null", "Default: null", "Default: true", "Default: none", "Default: null", "Default: null", "Default: true", "Default: 0.25", "Default: 0.25", "Default: left", "Default: [] (An empty array)", "Default: white", "Default: null", "Default: graph", "Default: null", "Default: null", "Default: true", "Default: false", "Default: #666", "Default: 3", "Default: 2", "Default: 2", "Default: false", "Default: square", "Default: 1", "Default: false", "Default: null", "Default: none", "Default: none", "Default: 0", "Default: .", "Default: ,", "Default: null", "Default: null", "Default: null ", "Default: false", "Default: null (linked to number of datapoints)", "Default: 10", "Default: 3", "Default: -1 (-1s below, 1 is above)", "Default: black", "Default: bottom", "Default: left", "Default: false (the axes ARE drawn)", "Default: false", "Default: false (the end tick IS drawn)", "Default: false (the end tick ISrawn)", "Default: 1.5", "Default: true", "Default: true", "Default: right", "Default: down", "Default: 50", "Default: 10", "Default: true", "Default: true", "Default: null", "Default: null", "Default: null", "Default:#fff", "Default: null", "Default: false", "Default: 1", "Default: null", "Default: false", "Default: true", "Default: 2", "Default: true", "Default: black", "Default: rgba(255,255,255,0.5)", "Default: false", "Default: 0.25"];
    for (var i = 0; i < allOptions.length; i++) {
        var option = document.createElement("option");
        option.innerText = allOptions[i];
        option.value = allDefaultOptions[i];
        $("#TEST11").append(option);
    }
}
function allFunction(value) {
    $("#defaultValue")[0].innerText = $("#TEST11").val();
}
function insertAllGraphs() {
    var allOptions = ["Bar", "Bipolar", "HorizontalBar", "Line", "Pie", "Donut", "Waterfall", "Radar ", "Rscatter", "Rose", "Scatter"];
    for (var i = 0; i < allOptions.length; i++) {
        var option = document.createElement("option");
        option.innerText = allOptions[i];
        $("#varGraph").append(option);
    }
}
function insertDiffOptions() {
    var otherProps = ["_accumulative: false", "_adjustable: false", '_align: "center"', "_animation_factor: 1", "_animation_grow_factor: 1", "_animation_unfold_initial: 2", "_animation_unfold_x: false", "_animation_unfold_y: true", "_annotatable: false", '_annotate_color: "black"', "_axesontop: false", '_axis_color: "black"', "_backdrop: false", "_backdrop_alpha: 0.2", "_backdrop_size: 30", '_background_barcolor1: "rgba(0,0,0,0)"', '_background_barcolor2: "rgba(0,0,0,0)"', "_background_circles: true", "_background_grid: true", "_background_grid_autofit: true", "_background_grid_autofit_align: false", "_background_grid_autofit_numhlines: 5", "_background_grid_autofit_numvlines: 20", "_background_grid_border: true", '_background_grid_color: "#ddd"', "_background_grid_hlines: true", "_background_grid_hsize: 30", "_background_grid_vlines: true", "_background_grid_vsize: 21.5", "_background_grid_width: 1", "_background_hbars: null", "_background_image: null", "_background_image_align: null", "_background_image_stretch: true", "_background_image_x: null", "_background_image_y: null", "_background_vbars: null", "_border: false", '_border_color: "rgba(255,255,255,0.5)"', "_borders: true", "_boxplot_capped: true", "_boxplot_width: 1", "_centerx: null", "_centery: null", "_chromefix: true", "_circle: 0", '_circle_fill: "red"', '_circle_stroke: "black"', "_colors: Array[6]", "_colors_alpha: null", "_colors_alternate: null", '_colors_default: "black"', "_colors_reverse: false", "_colors_sequential: false", "_contextmenu: null", "_contextmenu_bg: null", "_contextmenu_submenu: null", "_crosshairs: false", '_crosshairs_color: "#333"', "_crosshairs_coords: false", "_crosshairs_coords_fadeout: false", "_crosshairs_coords_fixed: true", '_crosshairs_coords_labels_x: "X"', '_crosshairs_coords_labels_y: "Y"', "_crosshairs_hline: true", "_crosshairs_linewidth: 1", "_crosshairs_vline: true", "_curvy: false", "_curvy_factor: 0.25", '_defaultcolor: "white"', "_effect_roundrobin_multiplier: 1", "_events: Array[0]", "_events_click: null", "_events_mousemove: null", "_events_mousemove_revertto: null", "_exploded: 0", "_filled: false", "_filled_accumulative: true", "_filled_range: false", "_fillstyle: null", '_grouping: "grouped"', "_gutter_center: 60", '_highlight_fill: "rgba(255,255,255,0.5)"', '_highlight_stroke: "black"', '_highlight_style: "explode"', '_highlight_style_2d_fill: "rgba(255,255,255,0.5)"', '_highlight_style_2d_stroke: "rgba(255,255,255,0)"', "_hmargin: 5", "_key: Array[1]", '_key_background: "white"', '_key_color_shape: "square"', "_key_colors: null", '_key_halign: "right"', "_key_interactive: false", "_key_linewidth: 1", '_key_position: "graph"', "_key_position_gutter_boxed: true", "_key_position_x: null", "_key_position_y: null", "_key_rounded: true", "_key_shadow: false", "_key_shadow_blur: 3", '_key_shadow_color: "#666"', "_key_shadow_offsetx: 2", "_key_shadow_offsety: 2", "_key_text_size: 10", "_labels: Array[9]", "_labels_above: false", "_labels_above_angle: null", "_labels_above_decimals: 0", "_labels_above_size: null", '_labels_align: "bottom"', '_labels_axes: ""', "_labels_ingraph: null", "_labels_offset: 0", "_labels_offsetx: 10", "_labels_offsety: 10", '_labels_position: "center"', "_labels_specific: null", '_labels_specific_align: "left"', "_labels_sticks: false", '_labels_sticks_color: "#aaa"', "_labels_sticks_length: 7", "_largexticks: 5", "_largeyticks: 5", "_line: false", "_line_colors: Array[2]", "_line_linewidth: 1", "_line_shadow_blur: 2", '_line_shadow_color: "rgba(0,0,0,0)"', "_line_shadow_offsetx: 3", "_line_shadow_offsety: 3", "_line_stepped: false", "_line_visible: true", "_linewidth: 1.01", "_margin: 2", "_multiplier_w: 1", "_multiplier_x: 1", "_noaxes: false", "_noendxtick: false", "_noendytick: true", "_noredraw: false", "_noxaxis: false", "_noyaxis: false", "_numyticks: 10", "_outofbounds: false", "_radius: null", "_resizable:false", "_resize_handle_adjust: Array[2]", "_resize_handle_background: null", "_scale_decimals: 0", "_scale_formatter: null", '_scale_point: "."', "_scale_round: false", '_scale_thousand: ","', "_segments: Array[0]", "_smallxticks: 3", "_smallyticks: 3", "_stepped: false", '_strokecolor: "#666"', "_text_angle: 0", '_text_color: "black"', '_text_font: "Arial"', "_text_size: 10", "_tickdirection: -1", "_tickmarks: null", '_tickmarks_dot_color: "white"', "_tickmarks_linewidth: null", "_ticksize: 3", '_title_left: ""', '_title_right: ""', '_title_yaxis_align: "left"', '_title_yaxis_position: "left"', "_total: true", "_units_ingraph: false", '_units_post: ""', '_units_pre: ""', "_variant: null", "_vmargin: 3", "_xaxis: true", '_xaxispos: "bottom"', "_xlabels: true", "_xlabels_inside: false", '_xlabels_inside_color: "rgba(255,255,255,0.5)"', "_xlabels_offset: 0", "_xmax: 0", "_xmin: 0", "_xscale: false", "_xscale_formatter: null", "_xscale_numlabels: 10", '_xscale_units_post: ""', '_xscale_units_pre: ""', "_xtickinterval: null", "_xticks: null", '_yaxispos: "left"', "_ylabels: true", "_ylabels_count: 5", "_ylabels_inside: false", "_ylabels_inside_color: null", "_ylabels_invert: false", "_ylabels_specific: null", "_ymax: 0", "_ymin: 0"];
    var chartGutter = ["_bottom: 50", "_left: 100", "_right: 70", "_top: 50"];
    var chartTitle = ["_background: null", "_bold: true", "_color: null", "_font: null", "_hpos: null", "_size: null", '_text: ""', "_vpos: null"];
    var shadow = ["_blur: 3", '_color: "rgba(0,0,0,0.5)"', "_offset_x: 2", "_offset_y: 2", "_visible: false"];
    var xAxisTitle = ["_background: null", "_bold: true", "_color: null", "_font: null", "_hpos: null", "_size: null", '_text: ""', "_vpos: null"];
    var yAxisTitle = ["_background: null", "_bold: true", "_color: null", "_font: null", "_hpos: null", "_size: null", '_text: ""', "_vpos: null"];
    var zoom = ['_action: "zoom"', "_background: true", "_delay: 16.666", "_factor: 1.5", "_fade_in: true", "_fade_out: true", "_frames: 25", '_hdir: "right"', '_mode: "canvas"', "_shadow: true", "_thumbnail_fixed: false", "_thumbnail_height: 75", "_thumbnail_width: 75", '_vdir: "down"'];
    var tooltip = ["_coords_adjust: null", '_css_class: "OfficeExcel_tooltip"', '_effect: "fade"', '_event: "onmousemove"', "_highlight: true", "_hotspot: 3", "_hotspot_xonly: false", "_override: null", "_tooltips: null"];
    for (var i = 0; i < otherProps.length; i++) {
        var option = document.createElement("option");
        option.innerText = otherProps[i];
        $("#otherProps").append(option);
    }
    for (var i = 0; i < chartGutter.length; i++) {
        var option = document.createElement("option");
        option.innerText = chartGutter[i];
        $("#chartGutter").append(option);
    }
    for (var i = 0; i < chartTitle.length; i++) {
        var option = document.createElement("option");
        option.innerText = chartTitle[i];
        $("#chartTitle").append(option);
    }
    for (var i = 0; i < shadow.length; i++) {
        var option = document.createElement("option");
        option.innerText = shadow[i];
        $("#shadow").append(option);
    }
    for (var i = 0; i < xAxisTitle.length; i++) {
        var option = document.createElement("option");
        option.innerText = xAxisTitle[i];
        $("#xAxisTitle").append(option);
    }
    for (var i = 0; i < yAxisTitle.length; i++) {
        var option = document.createElement("option");
        option.innerText = yAxisTitle[i];
        $("#yAxisTitle").append(option);
    }
    for (var i = 0; i < zoom.length; i++) {
        var option = document.createElement("option");
        option.innerText = zoom[i];
        $("#zoom").append(option);
    }
    for (var i = 0; i < tooltip.length; i++) {
        var option = document.createElement("option");
        option.innerText = tooltip[i];
        $("#tooltip").append(option);
    }
}