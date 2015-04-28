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
var global3DPersperctive;
function CChartsDrawer() {
    this.graphics = null;
    this.calcProp = {};
    this.allAreaChart = null;
    this.gridChart = null;
    this.chart = null;
    this.cChartSpace = null;
    this.cShapeDrawer = null;
}
CChartsDrawer.prototype = {
    reCalculate: function (chartSpace) {
        this.cChartSpace = chartSpace;
        this.calcProp = {};
        if (!chartSpace.bEmptySeries) {
            this._calculateProperties(chartSpace);
        }
        if (this.calcProp.widthCanvas == undefined && this.calcProp.pxToMM == undefined) {
            this.calcProp.pathH = 1000000000;
            this.calcProp.pathW = 1000000000;
            this.calcProp.pxToMM = 1 / g_dKoef_pix_to_mm;
            this.calcProp.widthCanvas = chartSpace.extX * this.calcProp.pxToMM;
            this.calcProp.heightCanvas = chartSpace.extY * this.calcProp.pxToMM;
        }
        this.allAreaChart = new allAreaChart();
        this.areaChart = new areaChart();
        this.gridChart = new gridChart();
        this.catAxisChart = new catAxisChart();
        this.valAxisChart = new valAxisChart();
        var newChart;
        switch (this.calcProp.type) {
        case "Bar":
            newChart = new drawBarChart();
            break;
        case "Line":
            newChart = new drawLineChart();
            break;
        case "HBar":
            newChart = new drawHBarChart();
            break;
        case "Pie":
            newChart = new drawPieChart();
            break;
        case "Scatter":
            newChart = new drawScatterChart();
            break;
        case "Area":
            newChart = new drawAreaChart();
            break;
        case "Stock":
            newChart = new drawStockChart();
            break;
        case "DoughnutChart":
            newChart = new drawDoughnutChart();
            break;
        case "Radar":
            newChart = new drawRadarChart();
            break;
        case "BubbleChart":
            newChart = new drawBubbleChart();
            break;
        }
        this.chart = newChart;
        if (!chartSpace.bEmptySeries) {
            this.areaChart.reCalculate(this.calcProp, null, this);
            if (this.calcProp.type != "Pie" && this.calcProp.type != "DoughnutChart") {
                this.gridChart.reCalculate(this.calcProp, this, chartSpace);
            }
        }
        this.allAreaChart.reCalculate(this.calcProp);
        if (this.calcProp.type != "Pie" && this.calcProp.type != "DoughnutChart" && !chartSpace.bEmptySeries) {
            this.catAxisChart.reCalculate(this.calcProp, null, chartSpace);
            this.valAxisChart.reCalculate(this.calcProp, null, chartSpace);
        }
        if (!chartSpace.bEmptySeries) {
            this.chart.reCalculate(this, chartSpace);
        }
    },
    draw: function (chartSpace, graphics) {
        this.cChartSpace = chartSpace;
        var cShapeDrawer = new CShapeDrawer();
        cShapeDrawer.Graphics = graphics;
        this.calcProp.series = chartSpace.chart.plotArea.chart.series;
        this.cShapeDrawer = cShapeDrawer;
        this.allAreaChart.draw(this, cShapeDrawer, chartSpace);
        if (!chartSpace.bEmptySeries) {
            this.areaChart.draw(this, cShapeDrawer, chartSpace);
            if (this.calcProp.type != "Pie" && this.calcProp.type != "DoughnutChart") {
                this.gridChart.draw(this, cShapeDrawer, chartSpace);
                this.catAxisChart.draw(this, cShapeDrawer, chartSpace);
                this.valAxisChart.draw(this, cShapeDrawer, chartSpace);
            }
            this.chart.draw(this, cShapeDrawer, chartSpace);
        }
    },
    reCalculatePositionText: function (type, chartSpace, ser, val) {
        var pos;
        if (!chartSpace.bEmptySeries) {
            switch (type) {
            case "dlbl":
                pos = this._calculatePositionDlbl(chartSpace, ser, val);
                break;
            case "title":
                pos = this._calculatePositionTitle(chartSpace);
                break;
            case "valAx":
                pos = this._calculatePositionValAx(chartSpace);
                break;
            case "catAx":
                pos = this._calculatePositionCatAx(chartSpace);
                break;
            case "legend":
                pos = this._calculatePositionLegend(chartSpace);
                break;
            default:
                pos = {
                    x: 0,
                    y: 0
                };
                break;
            }
        }
        return {
            x: pos ? pos.x : undefined,
            y: pos ? pos.y : undefined
        };
    },
    _calculatePositionDlbl: function (chartSpace, ser, val) {
        return this.chart._calculateDLbl(chartSpace, ser, val);
    },
    _calculatePositionTitle: function (chartSpace) {
        var widthGraph = chartSpace.extX;
        var widthTitle = chartSpace.chart.title.extX;
        var standartMargin = 7;
        var y = standartMargin / this.calcProp.pxToMM;
        var x = widthGraph / 2 - widthTitle / 2;
        return {
            x: x,
            y: y
        };
    },
    _calculatePositionValAx: function (chartSpace) {
        var heightTitle = chartSpace.chart.plotArea.valAx.title.extY;
        var standartMargin = 13;
        var y = (this.calcProp.chartGutter._top + this.calcProp.trueHeight / 2) / this.calcProp.pxToMM - heightTitle / 2;
        var x = standartMargin / this.calcProp.pxToMM;
        if (chartSpace.chart.legend && !chartSpace.chart.legend.overlay && chartSpace.chart.legend.legendPos == LEGEND_POS_L) {
            x += chartSpace.chart.legend.extX;
        }
        return {
            x: x,
            y: y
        };
    },
    _calculatePositionCatAx: function (chartSpace) {
        var widthTitle = chartSpace.chart.plotArea.catAx.title.extX;
        var heightTitle = chartSpace.chart.plotArea.catAx.title.extY;
        var standartMargin = 13;
        var y = (this.calcProp.heightCanvas - standartMargin) / this.calcProp.pxToMM - heightTitle;
        var x = (this.calcProp.chartGutter._left + this.calcProp.trueWidth / 2) / this.calcProp.pxToMM - widthTitle / 2;
        if (chartSpace.chart.legend && !chartSpace.chart.legend.overlay && chartSpace.chart.legend.legendPos == LEGEND_POS_B) {
            y -= chartSpace.chart.legend.extY;
        }
        return {
            x: x,
            y: y
        };
    },
    _calculatePositionLegend: function (chartSpace) {
        var widthLegend = chartSpace.chart.legend.extX;
        var heightLegend = chartSpace.chart.legend.extY;
        var standartMargin = 13;
        var x, y;
        switch (chartSpace.chart.legend.legendPos) {
        case LEGEND_POS_L:
            x = standartMargin / 2 / this.calcProp.pxToMM;
            y = this.calcProp.heightCanvas / 2 / this.calcProp.pxToMM - heightLegend / 2;
            break;
        case LEGEND_POS_T:
            x = this.calcProp.widthCanvas / 2 / this.calcProp.pxToMM - widthLegend / 2;
            y = standartMargin / 2 / this.calcProp.pxToMM;
            if (chartSpace.chart.title !== null && !chartSpace.chart.title.overlay) {
                y += chartSpace.chart.title.extY + standartMargin / 2 / this.calcProp.pxToMM;
            }
            break;
        case LEGEND_POS_R:
            x = (this.calcProp.widthCanvas - standartMargin / 2) / this.calcProp.pxToMM - widthLegend;
            y = (this.calcProp.heightCanvas / 2) / this.calcProp.pxToMM - heightLegend / 2;
            break;
        case LEGEND_POS_B:
            x = this.calcProp.widthCanvas / 2 / this.calcProp.pxToMM - widthLegend / 2;
            y = (this.calcProp.heightCanvas - standartMargin / 2) / this.calcProp.pxToMM - heightLegend;
            break;
        case LEGEND_POS_TR:
            x = (this.calcProp.widthCanvas - standartMargin / 2) / this.calcProp.pxToMM - widthLegend;
            y = standartMargin / 2 / this.calcProp.pxToMM;
            if (chartSpace.chart.title !== null && !chartSpace.chart.title.overlay) {
                y += chartSpace.chart.title.extY + standartMargin / 2 / this.calcProp.pxToMM;
            }
            break;
        default:
            x = (this.calcProp.widthCanvas - standartMargin / 2) / this.calcProp.pxToMM - widthLegend;
            y = (this.calcProp.heightCanvas) / this.calcProp.pxToMM - heightLegend / 2;
            break;
        }
        return {
            x: x,
            y: y
        };
    },
    _calculateMarginsChart: function (chartSpace) {
        this.calcProp.chartGutter = {};
        if (!this.calcProp.pxToMM) {
            this.calcProp.pxToMM = 1 / g_dKoef_pix_to_mm;
        }
        var pxToMM = this.calcProp.pxToMM;
        var isHBar = (chartSpace.chart.plotArea.chart.getObjectType() == historyitem_type_BarChart && chartSpace.chart.plotArea.chart.barDir === BAR_DIR_BAR) ? true : false;
        var marginOnPoints = this._calculateMarginOnPoints(chartSpace, isHBar);
        var calculateLeft = marginOnPoints.calculateLeft,
        calculateRight = marginOnPoints.calculateRight,
        calculateTop = marginOnPoints.calculateTop,
        calculateBottom = marginOnPoints.calculateBottom;
        var labelsMargin = this._calculateMarginLabels(chartSpace);
        var left = labelsMargin.left,
        right = labelsMargin.right,
        top = labelsMargin.top,
        bottom = labelsMargin.bottom;
        var leftTextLabels = 0;
        var rightTextLabels = 0;
        var topTextLabels = 0;
        var bottomTextLabels = 0;
        if (chartSpace.chart.plotArea.valAx && chartSpace.chart.plotArea.valAx.title != null && !isHBar) {
            leftTextLabels += chartSpace.chart.plotArea.valAx.title.extX;
        } else {
            if (isHBar && chartSpace.chart.plotArea.catAx && chartSpace.chart.plotArea.catAx.title != null) {
                leftTextLabels += chartSpace.chart.plotArea.catAx.title.extX;
            }
        }
        if (chartSpace.chart.plotArea.catAx && chartSpace.chart.plotArea.catAx.title != null && !isHBar) {
            bottomTextLabels += chartSpace.chart.plotArea.catAx.title.extY;
        } else {
            if (isHBar && chartSpace.chart.plotArea.valAx && chartSpace.chart.plotArea.valAx.title != null) {
                bottomTextLabels += chartSpace.chart.plotArea.valAx.title.extY;
            }
        }
        var topMainTitle = 0;
        if (chartSpace.chart.title !== null && !chartSpace.chart.title.overlay) {
            topMainTitle += chartSpace.chart.title.extY;
        }
        var leftKey = 0,
        rightKey = 0,
        topKey = 0,
        bottomKey = 0;
        if (chartSpace.chart.legend && !chartSpace.chart.legend.overlay) {
            switch (chartSpace.chart.legend.legendPos) {
            case LEGEND_POS_L:
                leftKey += chartSpace.chart.legend.extX;
                break;
            case LEGEND_POS_T:
                topKey += chartSpace.chart.legend.extY;
                break;
            case LEGEND_POS_R:
                rightKey += chartSpace.chart.legend.extX;
                break;
            case LEGEND_POS_B:
                bottomKey += chartSpace.chart.legend.extY;
                break;
            case LEGEND_POS_TR:
                rightKey += chartSpace.chart.legend.extX;
                break;
            }
        }
        left += this._getStandartMargin(left, leftKey, leftTextLabels, 0) + leftKey + leftTextLabels;
        bottom += this._getStandartMargin(bottom, bottomKey, bottomTextLabels, 0) + bottomKey + bottomTextLabels;
        top += this._getStandartMargin(top, topKey, topTextLabels, topMainTitle) + topKey + topTextLabels + topMainTitle;
        right += this._getStandartMargin(right, rightKey, rightTextLabels, 0) + rightKey + rightTextLabels;
        this.calcProp.chartGutter._left = calculateLeft ? calculateLeft * pxToMM : left * pxToMM;
        this.calcProp.chartGutter._right = calculateRight ? calculateRight * pxToMM : right * pxToMM;
        this.calcProp.chartGutter._top = calculateTop ? calculateTop * pxToMM : top * pxToMM;
        this.calcProp.chartGutter._bottom = calculateBottom ? calculateBottom * pxToMM : bottom * pxToMM;
        this._checkMargins();
    },
    _checkMargins: function () {
        var standartMargin = 13;
        if (this.calcProp.chartGutter._left < 0) {
            this.calcProp.chartGutter._left = standartMargin;
        }
        if (this.calcProp.chartGutter._right < 0) {
            this.calcProp.chartGutter._right = standartMargin;
        }
        if (this.calcProp.chartGutter._top < 0) {
            this.calcProp.chartGutter._top = standartMargin;
        }
        if (this.calcProp.chartGutter._bottom < 0) {
            this.calcProp.chartGutter._bottom = standartMargin;
        }
        if ((this.calcProp.chartGutter._left + this.calcProp.chartGutter._right) > this.calcProp.widthCanvas) {
            this.calcProp.chartGutter._left = standartMargin;
        }
        if (this.calcProp.chartGutter._right > this.calcProp.widthCanvas) {
            this.calcProp.chartGutter._right = standartMargin;
        }
        if ((this.calcProp.chartGutter._top + this.calcProp.chartGutter._bottom) > this.calcProp.heightCanvas) {
            this.calcProp.chartGutter._top = 0;
        }
        if (this.calcProp.chartGutter._bottom > this.calcProp.heightCanvas) {
            this.calcProp.chartGutter._bottom = 0;
        }
    },
    _calculateMarginOnPoints: function (chartSpace, isHBar) {
        var calculateLeft = 0,
        calculateRight = 0,
        calculateTop = 0,
        calculateBottom = 0;
        var pxToMM = this.calcProp.pxToMM;
        var valAx = chartSpace.chart.plotArea.valAx;
        if (chartSpace.chart.plotArea.valAx && chartSpace.chart.plotArea.valAx.labels && this.calcProp.widthCanvas != undefined) {
            if (isHBar) {
                if (valAx.scaling.orientation == ORIENTATION_MIN_MAX) {
                    calculateLeft = valAx.xPoints[0].pos;
                    calculateRight = this.calcProp.widthCanvas / pxToMM - valAx.xPoints[valAx.xPoints.length - 1].pos;
                } else {
                    calculateLeft = valAx.xPoints[valAx.xPoints.length - 1].pos;
                    calculateRight = this.calcProp.widthCanvas / pxToMM - valAx.xPoints[0].pos;
                }
            } else {
                if (this.calcProp.heightCanvas != undefined) {
                    if (valAx.scaling.orientation == ORIENTATION_MIN_MAX) {
                        calculateTop = valAx.yPoints[valAx.yPoints.length - 1].pos;
                        calculateBottom = this.calcProp.heightCanvas / pxToMM - valAx.yPoints[0].pos;
                    } else {
                        calculateTop = valAx.yPoints[0].pos;
                        calculateBottom = this.calcProp.heightCanvas / pxToMM - valAx.yPoints[valAx.yPoints.length - 1].pos;
                    }
                }
            }
        }
        if (chartSpace.chart.plotArea.catAx && chartSpace.chart.plotArea.catAx.labels) {
            var catAx = chartSpace.chart.plotArea.catAx;
            var curBetween = 0,
            diffPoints = 0;
            if (this.calcProp.type == "Scatter" && this.calcProp.widthCanvas != undefined) {
                if (catAx.scaling.orientation == ORIENTATION_MIN_MAX) {
                    calculateLeft = catAx.xPoints[0].pos;
                    calculateRight = this.calcProp.widthCanvas / pxToMM - catAx.xPoints[catAx.xPoints.length - 1].pos;
                } else {
                    calculateLeft = catAx.xPoints[catAx.xPoints.length - 1].pos;
                    calculateRight = this.calcProp.widthCanvas / pxToMM - catAx.xPoints[0].pos;
                }
            } else {
                if (isHBar && valAx && !isNaN(valAx.posY) && this.calcProp.heightCanvas != undefined) {
                    diffPoints = catAx.yPoints[1] ? Math.abs(catAx.yPoints[1].pos - catAx.yPoints[0].pos) : Math.abs(catAx.yPoints[0].pos - valAx.posY) * 2;
                    if (catAx.scaling.orientation == ORIENTATION_MIN_MAX) {
                        if (valAx.crossBetween == CROSS_BETWEEN_BETWEEN) {
                            curBetween = diffPoints / 2;
                        }
                        calculateTop = catAx.yPoints[catAx.yPoints.length - 1].pos - curBetween;
                        calculateBottom = this.calcProp.heightCanvas / pxToMM - (catAx.yPoints[0].pos + curBetween);
                    } else {
                        if (valAx.crossBetween == CROSS_BETWEEN_BETWEEN) {
                            curBetween = diffPoints / 2;
                        }
                        calculateTop = catAx.yPoints[0].pos - curBetween;
                        calculateBottom = this.calcProp.heightCanvas / pxToMM - (catAx.yPoints[catAx.yPoints.length - 1].pos + curBetween);
                    }
                } else {
                    if (valAx && !isNaN(valAx.posX) && this.calcProp.widthCanvas != undefined) {
                        diffPoints = catAx.xPoints[1] ? Math.abs(catAx.xPoints[1].pos - catAx.xPoints[0].pos) : Math.abs(catAx.xPoints[0].pos - valAx.posX) * 2;
                        if (catAx.scaling.orientation == ORIENTATION_MIN_MAX) {
                            if (valAx.crossBetween == CROSS_BETWEEN_BETWEEN) {
                                curBetween = diffPoints / 2;
                            }
                            calculateLeft = catAx.xPoints[0].pos - curBetween;
                            calculateRight = this.calcProp.widthCanvas / pxToMM - (catAx.xPoints[catAx.xPoints.length - 1].pos + curBetween);
                        } else {
                            if (valAx.crossBetween == CROSS_BETWEEN_BETWEEN) {
                                curBetween = diffPoints / 2;
                            }
                            calculateLeft = catAx.xPoints[catAx.xPoints.length - 1].pos - curBetween;
                            calculateRight = this.calcProp.widthCanvas / pxToMM - (catAx.xPoints[0].pos + curBetween);
                        }
                    }
                }
            }
        }
        return {
            calculateLeft: calculateLeft,
            calculateRight: calculateRight,
            calculateTop: calculateTop,
            calculateBottom: calculateBottom
        };
    },
    _getStandartMargin: function (labelsMargin, keyMargin, textMargin, topMainTitleMargin) {
        var standartMargin = 13 / this.calcProp.pxToMM;
        var result;
        if (labelsMargin == 0 && keyMargin == 0 && textMargin == 0 && topMainTitleMargin == 0) {
            result = standartMargin;
        } else {
            if (labelsMargin != 0 && keyMargin == 0 && textMargin == 0 && topMainTitleMargin == 0) {
                result = standartMargin / 2;
            } else {
                if (labelsMargin != 0 && keyMargin == 0 && textMargin != 0 && topMainTitleMargin == 0) {
                    result = standartMargin;
                } else {
                    if (labelsMargin != 0 && keyMargin != 0 && textMargin != 0 && topMainTitleMargin == 0) {
                        result = standartMargin + standartMargin / 2;
                    } else {
                        if (labelsMargin == 0 && keyMargin != 0 && textMargin == 0 && topMainTitleMargin == 0) {
                            result = standartMargin;
                        } else {
                            if (labelsMargin == 0 && keyMargin == 0 && textMargin != 0 && topMainTitleMargin == 0) {
                                result = standartMargin;
                            } else {
                                if (labelsMargin == 0 && keyMargin != 0 && textMargin != 0 && topMainTitleMargin == 0) {
                                    result = standartMargin + standartMargin / 2;
                                } else {
                                    if (labelsMargin != 0 && keyMargin != 0 && textMargin == 0 && topMainTitleMargin == 0) {
                                        result = standartMargin;
                                    } else {
                                        if (labelsMargin == 0 && keyMargin != 0 && textMargin != 0 && topMainTitleMargin == 0) {
                                            result = standartMargin + standartMargin / 2;
                                        } else {
                                            if (labelsMargin == 0 && keyMargin == 0 && topMainTitleMargin != 0) {
                                                result = standartMargin + standartMargin / 2;
                                            } else {
                                                if (labelsMargin == 0 && keyMargin != 0 && topMainTitleMargin != 0) {
                                                    result = 2 * standartMargin;
                                                } else {
                                                    if (labelsMargin != 0 && keyMargin == 0 && topMainTitleMargin != 0) {
                                                        result = standartMargin;
                                                    } else {
                                                        if (labelsMargin != 0 && keyMargin != 0 && topMainTitleMargin != 0) {
                                                            result = 2 * standartMargin;
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
        }
        return result;
    },
    _calculateMarginLabels: function (chartSpace) {
        var isHBar = this.calcProp.type;
        var left = 0,
        right = 0,
        bottom = 0,
        top = 0;
        var leftDownPointX, leftDownPointY, rightUpPointX, rightUpPointY;
        var valAx = chartSpace.chart.plotArea.valAx;
        var catAx = chartSpace.chart.plotArea.catAx;
        if (isHBar === "HBar" && catAx && valAx && catAx.yPoints && valAx.xPoints) {
            if (catAx.scaling.orientation == ORIENTATION_MIN_MAX) {
                if (valAx.crossBetween == CROSS_BETWEEN_BETWEEN) {
                    leftDownPointY = catAx.yPoints[0].pos + Math.abs((catAx.interval) / 2);
                } else {
                    leftDownPointY = catAx.yPoints[0].pos;
                }
            } else {
                if (valAx.crossBetween == CROSS_BETWEEN_BETWEEN) {
                    leftDownPointY = catAx.yPoints[catAx.yPoints.length - 1].pos + Math.abs((catAx.interval) / 2);
                } else {
                    leftDownPointY = catAx.yPoints[catAx.yPoints.length - 1].pos;
                }
            }
            if (valAx.scaling.orientation == ORIENTATION_MIN_MAX) {
                leftDownPointX = valAx.xPoints[0].pos;
            } else {
                leftDownPointX = valAx.xPoints[valAx.xPoints.length - 1].pos;
            }
            if (catAx.scaling.orientation == ORIENTATION_MIN_MAX) {
                if (valAx.crossBetween == CROSS_BETWEEN_BETWEEN) {
                    rightUpPointY = catAx.yPoints[catAx.yPoints.length - 1].pos - Math.abs((catAx.interval) / 2);
                } else {
                    rightUpPointY = catAx.yPoints[catAx.yPoints.length - 1].pos;
                }
            } else {
                if (valAx.crossBetween == CROSS_BETWEEN_BETWEEN) {
                    rightUpPointY = catAx.yPoints[0].pos - Math.abs((catAx.interval) / 2);
                } else {
                    rightUpPointY = catAx.yPoints[0].pos;
                }
            }
            if (valAx.scaling.orientation == ORIENTATION_MIN_MAX) {
                rightUpPointX = valAx.xPoints[valAx.xPoints.length - 1].pos;
            } else {
                rightUpPointX = valAx.xPoints[0].pos;
            }
            if (catAx.labels && !catAx.bDelete) {
                if (leftDownPointX >= catAx.labels.x) {
                    left = leftDownPointX - catAx.labels.x;
                } else {
                    if ((catAx.labels.x + catAx.labels.extX) >= rightUpPointX) {
                        right = catAx.labels.x + catAx.labels.extX - rightUpPointX;
                    }
                }
            }
            if (valAx.labels && !valAx.bDelete) {
                if ((valAx.labels.y + valAx.labels.extY) >= leftDownPointY) {
                    bottom = (valAx.labels.y + valAx.labels.extY) - leftDownPointY;
                } else {
                    if (valAx.labels.y <= rightUpPointY) {
                        top = rightUpPointY - valAx.labels.y;
                    }
                }
            }
        } else {
            if (isHBar === "Scatter" && catAx && valAx && catAx.xPoints && valAx.yPoints) {
                leftDownPointX = catAx.xPoints[0].pos;
                leftDownPointY = valAx.scaling.orientation == ORIENTATION_MIN_MAX ? valAx.yPoints[0].pos : valAx.yPoints[valAx.yPoints.length - 1].pos;
                rightUpPointX = catAx.xPoints[catAx.xPoints.length - 1].pos;
                rightUpPointY = valAx.scaling.orientation == ORIENTATION_MIN_MAX ? valAx.yPoints[valAx.yPoints.length - 1].pos : valAx.yPoints[0].pos;
                if (valAx.labels && !valAx.bDelete) {
                    if (leftDownPointX >= valAx.labels.x) {
                        left = leftDownPointX - valAx.labels.x;
                    } else {
                        if ((valAx.labels.x + valAx.labels.extX) >= rightUpPointX) {
                            right = valAx.labels.x + valAx.labels.extX - rightUpPointX;
                        }
                    }
                }
                if (catAx.labels && !catAx.bDelete) {
                    if ((catAx.labels.y + catAx.labels.extY) >= leftDownPointY) {
                        bottom = (catAx.labels.y + catAx.labels.extY) - leftDownPointY;
                    } else {
                        if (catAx.labels.y <= rightUpPointY) {
                            top = rightUpPointY - catAx.labels.y;
                        }
                    }
                }
            } else {
                if (isHBar !== undefined && valAx && catAx && catAx.xPoints && valAx.yPoints) {
                    if (catAx.scaling.orientation != ORIENTATION_MIN_MAX) {
                        leftDownPointX = catAx.xPoints[catAx.xPoints.length - 1].pos - Math.abs((catAx.interval) / 2);
                    } else {
                        if (valAx.crossBetween == CROSS_BETWEEN_BETWEEN) {
                            leftDownPointX = catAx.xPoints[0].pos - (catAx.interval) / 2;
                        } else {
                            leftDownPointX = catAx.xPoints[0].pos;
                        }
                    }
                    if (valAx.scaling.orientation == ORIENTATION_MIN_MAX) {
                        leftDownPointY = valAx.yPoints[0].pos;
                    } else {
                        leftDownPointY = valAx.yPoints[valAx.yPoints.length - 1].pos;
                    }
                    if (catAx.scaling.orientation != ORIENTATION_MIN_MAX) {
                        rightUpPointX = catAx.xPoints[0].pos;
                    } else {
                        if (valAx.crossBetween == CROSS_BETWEEN_BETWEEN) {
                            rightUpPointX = catAx.xPoints[catAx.xPoints.length - 1].pos + (catAx.interval) / 2;
                        } else {
                            rightUpPointX = catAx.xPoints[catAx.xPoints.length - 1].pos;
                        }
                    }
                    if (valAx.scaling.orientation == ORIENTATION_MIN_MAX) {
                        rightUpPointY = valAx.yPoints[valAx.yPoints.length - 1].pos;
                    } else {
                        rightUpPointY = valAx.yPoints[0].pos;
                    }
                    if (valAx.labels && !valAx.bDelete) {
                        if (leftDownPointX >= valAx.labels.x) {
                            left = leftDownPointX - valAx.labels.x;
                        } else {
                            if ((valAx.labels.x + valAx.labels.extX) >= rightUpPointY) {
                                right = valAx.labels.extX;
                            }
                        }
                    }
                    if (catAx.labels && !catAx.bDelete) {
                        if ((catAx.labels.y + catAx.labels.extY) >= leftDownPointY) {
                            bottom = (catAx.labels.y + catAx.labels.extY) - leftDownPointY;
                        } else {
                            if (catAx.labels.y <= rightUpPointY) {
                                top = rightUpPointY - catAx.labels.y;
                            }
                        }
                    }
                }
            }
        }
        return {
            left: left,
            right: right,
            top: top,
            bottom: bottom
        };
    },
    _calculateProperties: function (chartProp) {
        if (!this.calcProp.scale) {
            this.preCalculateData(chartProp);
        }
        this._calculateMarginsChart(chartProp);
        this.calcProp.trueWidth = this.calcProp.widthCanvas - this.calcProp.chartGutter._left - this.calcProp.chartGutter._right;
        this.calcProp.trueHeight = this.calcProp.heightCanvas - this.calcProp.chartGutter._top - this.calcProp.chartGutter._bottom;
        if ((chartProp.chart.plotArea.valAx && chartProp.chart.plotArea.catAx && chartProp.chart.plotArea.valAx.yPoints && chartProp.chart.plotArea.catAx.xPoints) || (chartProp.chart.plotArea.catAx && chartProp.chart.plotArea.valAx && chartProp.chart.plotArea.catAx.yPoints && chartProp.chart.plotArea.valAx.xPoints)) {
            if (chartProp.chart.plotArea.valAx.yPoints) {
                this.calcProp.numhlines = chartProp.chart.plotArea.valAx.yPoints.length - 1;
            }
            if (this.calcProp.type == "Bar") {
                this.calcProp.numvlines = chartProp.chart.plotArea.catAx.xPoints.length;
                this.calcProp.numvMinorlines = 2;
                this.calcProp.numhMinorlines = 5;
            } else {
                if (this.calcProp.type == "HBar") {
                    this.calcProp.numhlines = chartProp.chart.plotArea.catAx.yPoints.length;
                    this.calcProp.numvlines = chartProp.chart.plotArea.valAx.xPoints.length - 1;
                    this.calcProp.numhMinorlines = 2;
                    this.calcProp.numvMinorlines = 5;
                } else {
                    if (this.calcProp.type == "Line" || this.calcProp.type == "Stock") {
                        this.calcProp.numvlines = chartProp.chart.plotArea.catAx.xPoints.length;
                        this.calcProp.numvMinorlines = 2;
                        this.calcProp.numhMinorlines = 5;
                    } else {
                        if (this.calcProp.type == "Scatter" || this.calcProp.type == "BubbleChart") {
                            this.calcProp.numvlines = chartProp.chart.plotArea.catAx.xPoints.length;
                            this.calcProp.numvMinorlines = 5;
                            this.calcProp.numhMinorlines = 5;
                        } else {
                            if (this.calcProp.type == "Area") {
                                this.calcProp.numvlines = chartProp.chart.plotArea.catAx.xPoints.length;
                                this.calcProp.numvMinorlines = 2;
                                this.calcProp.numhMinorlines = 5;
                            }
                        }
                    }
                }
            }
        }
        if (this.calcProp.type != "Scatter") {
            this.calcProp.nullPositionOX = this._getNullPosition();
            this.calcProp.nullPositionOXLog = this._getNullPositionLog();
        } else {
            var scatterNullPos = this._getScatterNullPosition();
            this.calcProp.nullPositionOX = scatterNullPos.x;
            this.calcProp.nullPositionOY = scatterNullPos.y;
        }
        if (this.calcProp.type == "Bar") {
            this.calcProp.max = this.calcProp.scale[this.calcProp.scale.length - 1];
            this.calcProp.min = this.calcProp.scale[0];
        }
    },
    _calculateStackedData2: function () {
        var maxMinObj;
        if (this.calcProp.type == "Bar" || this.calcProp.type == "HBar") {
            if (this.calcProp.subType == "stacked") {
                var originalData = $.extend(true, [], this.calcProp.data);
                for (var j = 0; j < this.calcProp.data.length; j++) {
                    for (var i = 0; i < this.calcProp.data[j].length; i++) {
                        this.calcProp.data[j][i] = this._findPrevValue(originalData, j, i);
                    }
                }
                maxMinObj = this._getMaxMinValueArray(this.calcProp.data);
                this.calcProp.max = maxMinObj.max;
                this.calcProp.min = maxMinObj.min;
            } else {
                if (this.calcProp.subType == "stackedPer") {
                    var summ;
                    var originalData = $.extend(true, [], this.calcProp.data);
                    for (var j = 0; j < (this.calcProp.data.length); j++) {
                        summ = 0;
                        for (var i = 0; i < this.calcProp.data[j].length; i++) {
                            summ += Math.abs(this.calcProp.data[j][i]);
                        }
                        for (var i = 0; i < this.calcProp.data[j].length; i++) {
                            this.calcProp.data[j][i] = (this._findPrevValue(originalData, j, i) * 100) / summ;
                        }
                    }
                    maxMinObj = this._getMaxMinValueArray(this.calcProp.data);
                    this.calcProp.max = maxMinObj.max;
                    this.calcProp.min = maxMinObj.min;
                }
            }
        }
        if (this.calcProp.type == "Line" || this.calcProp.type == "Area") {
            if (this.calcProp.subType == "stacked") {
                for (var j = 0; j < (this.calcProp.data.length - 1); j++) {
                    for (var i = 0; i < this.calcProp.data[j].length; i++) {
                        if (!this.calcProp.data[j + 1]) {
                            this.calcProp.data[j + 1] = [];
                        }
                        this.calcProp.data[j + 1][i] = this.calcProp.data[j + 1][i] + this.calcProp.data[j][i];
                    }
                }
                maxMinObj = this._getMaxMinValueArray(this.calcProp.data);
                this.calcProp.max = maxMinObj.max;
                this.calcProp.min = maxMinObj.min;
            } else {
                if (this.calcProp.subType == "stackedPer") {
                    var firstData = this.calcProp.data;
                    var summValue = [];
                    for (var j = 0; j < (firstData[0].length); j++) {
                        summValue[j] = 0;
                        for (var i = 0; i < firstData.length; i++) {
                            summValue[j] += Math.abs(firstData[i][j]);
                        }
                    }
                    for (var j = 0; j < (this.calcProp.data.length - 1); j++) {
                        for (var i = 0; i < this.calcProp.data[j].length; i++) {
                            this.calcProp.data[j + 1][i] = this.calcProp.data[j + 1][i] + this.calcProp.data[j][i];
                        }
                    }
                    var tempData = this.calcProp.data;
                    for (var j = 0; j < (tempData[0].length); j++) {
                        for (var i = 0; i < tempData.length; i++) {
                            if (summValue[j] == 0) {
                                tempData[i][j] = 0;
                            } else {
                                tempData[i][j] = (100 * tempData[i][j]) / (summValue[j]);
                            }
                        }
                    }
                    maxMinObj = this._getMaxMinValueArray(tempData);
                    this.calcProp.max = maxMinObj.max;
                    this.calcProp.min = maxMinObj.min;
                    this.calcProp.data = tempData;
                }
            }
        }
    },
    _calculateData2: function (chart) {
        var max = 0;
        var min = 0;
        var minY = 0;
        var maxY = 0;
        var xNumCache, yNumCache, newArr;
        var series = chart.chart.plotArea.chart.series;
        if (this.calcProp.type != "Scatter") {
            var arrValues = [];
            var isSkip = [];
            var skipSeries = [];
            var isEn = false;
            var isEnY = false;
            var numSeries = 0;
            var curSeria;
            var isNumberVal = true;
            for (var l = 0; l < series.length; ++l) {
                var firstCol = 0;
                var firstRow = 0;
                curSeria = series[l].val.numRef && series[l].val.numRef.numCache ? series[l].val.numRef.numCache.pts : series[l].val.numLit ? series[l].val.numLit.pts : null;
                skipSeries[l] = true;
                if (series[l].isHidden == true) {
                    continue;
                }
                if (!curSeria || !curSeria.length) {
                    continue;
                }
                skipSeries[l] = false;
                arrValues[numSeries] = [];
                isSkip[numSeries] = true;
                var row = firstRow;
                var n = 0;
                for (var col = firstCol; col < curSeria.length; ++col) {
                    if (!curSeria[col]) {
                        curSeria[col] = {
                            val: 0
                        };
                    } else {
                        if (curSeria[col].isHidden == true) {
                            continue;
                        }
                    }
                    var cell = curSeria[col];
                    var orValue = cell.val;
                    if ("" != orValue) {
                        isSkip[numSeries] = false;
                    }
                    var value = parseFloat(orValue);
                    if (!isEn && !isNaN(value)) {
                        min = value;
                        max = value;
                        isEn = true;
                    }
                    if (!isNaN(value) && value > max) {
                        max = value;
                    }
                    if (!isNaN(value) && value < min) {
                        min = value;
                    }
                    if (isNaN(value) && orValue == "" && (((this.calcProp.type == "Line") && this.calcProp.type == "normal"))) {
                        value = "";
                    } else {
                        if (isNaN(value)) {
                            value = 0;
                        }
                    }
                    if (this.calcProp.type == "Pie" || this.calcProp.type == "DoughnutChart") {
                        arrValues[numSeries][n] = Math.abs(value);
                    } else {
                        arrValues[numSeries][n] = value;
                    }
                    n++;
                }
                numSeries++;
            }
        } else {
            var yVal;
            var xVal;
            newArr = [];
            for (var l = 0; l < series.length; ++l) {
                newArr[l] = [];
                yNumCache = series[l].yVal.numRef && series[l].yVal.numRef.numCache ? series[l].yVal.numRef.numCache : series[l].yVal && series[l].yVal.numLit ? series[l].yVal.numLit : null;
                if (!yNumCache) {
                    continue;
                }
                for (var j = 0; j < yNumCache.pts.length; ++j) {
                    yVal = parseFloat(yNumCache.pts[j].val);
                    xNumCache = series[l].xVal && series[l].xVal.numRef ? series[l].xVal.numRef.numCache : series[l].xVal && series[l].xVal.numLit ? series[l].xVal.numLit : null;
                    if (xNumCache && xNumCache.pts[j] && xNumCache.pts[j].val) {
                        if (!isNaN(parseFloat(xNumCache.pts[j].val))) {
                            xVal = parseFloat(xNumCache.pts[j].val);
                        } else {
                            xVal = j + 1;
                        }
                    } else {
                        xVal = j + 1;
                    }
                    newArr[l][j] = [xVal, yVal];
                    if (l == 0 && j == 0) {
                        min = xVal;
                        max = xVal;
                        minY = yVal;
                        maxY = yVal;
                    }
                    if (xVal < min) {
                        min = xVal;
                    }
                    if (xVal > max) {
                        max = xVal;
                    }
                    if (yVal < minY) {
                        minY = yVal;
                    }
                    if (yVal > maxY) {
                        maxY = yVal;
                    }
                }
            }
            this.calcProp.ymin = minY;
            this.calcProp.ymax = maxY;
        }
        this.calcProp.min = min;
        this.calcProp.max = max;
        if (newArr) {
            arrValues = newArr;
        }
        if (this.calcProp.type == "Bar" || this.calcProp.type == "HBar") {
            this.calcProp.data = arrReverse(arrValues);
        } else {
            this.calcProp.data = arrValues;
        }
    },
    _getAxisData2: function (isOx, minVal, maxVal, chartProp) {
        return this._getAxisValues(isOx, minVal, maxVal, chartProp);
    },
    _getAxisValues: function (isOx, yMin, yMax, chartProp) {
        var axisMin, axisMax, firstDegree, step, arrayValues;
        if (chartProp.chart.plotArea.valAx && chartProp.chart.plotArea.valAx.scaling.logBase) {
            arrayValues = this._getLogArray(yMin, yMax, chartProp.chart.plotArea.valAx.scaling.logBase);
            return arrayValues;
        }
        chartProp.chart.plotArea.valAx && chartProp.chart.plotArea.valAx.scaling ? chartProp.chart.plotArea.valAx.scaling.max : null;
        var trueMinMax = this._getTrueMinMax(isOx, yMin, yMax);
        var manualMin;
        var manualMax;
        if ("Scatter" == this.calcProp.type && isOx) {
            manualMin = chartProp.chart.plotArea.catAx && chartProp.chart.plotArea.catAx.scaling && chartProp.chart.plotArea.catAx.scaling.min !== null ? chartProp.chart.plotArea.catAx.scaling.min : null;
            manualMax = chartProp.chart.plotArea.catAx && chartProp.chart.plotArea.catAx.scaling && chartProp.chart.plotArea.catAx.scaling.max !== null ? chartProp.chart.plotArea.catAx.scaling.max : null;
        } else {
            manualMin = chartProp.chart.plotArea.valAx && chartProp.chart.plotArea.valAx.scaling && chartProp.chart.plotArea.valAx.scaling.min !== null ? chartProp.chart.plotArea.valAx.scaling.min : null;
            manualMax = chartProp.chart.plotArea.valAx && chartProp.chart.plotArea.valAx.scaling && chartProp.chart.plotArea.valAx.scaling.max !== null ? chartProp.chart.plotArea.valAx.scaling.max : null;
        }
        if (this.calcProp.subType == "stackedPer" && manualMin != null) {
            manualMin = manualMin * 100;
        }
        if (this.calcProp.subType == "stackedPer" && manualMax != null) {
            manualMax = manualMax * 100;
        }
        if (manualMax && manualMin && manualMax < manualMin) {
            if (manualMax < 0) {
                manualMax = 0;
            } else {
                manualMin = 0;
            }
        }
        axisMin = manualMin !== null && manualMin !== undefined ? manualMin : trueMinMax.min;
        axisMax = manualMax !== null && manualMax !== undefined ? manualMax : trueMinMax.max;
        var percentChartMax = 100;
        if (this.calcProp.subType == "stackedPer" && axisMax > percentChartMax) {
            axisMax = percentChartMax;
        }
        if (this.calcProp.subType == "stackedPer" && axisMin < -percentChartMax) {
            axisMin = -percentChartMax;
        }
        if (axisMax < axisMin) {
            manualMax = 2 * axisMin;
            axisMax = manualMax;
        }
        firstDegree = this._getFirstDegree((Math.abs(axisMax - axisMin)) / 10);
        if (chartProp.chart.plotArea.valAx && chartProp.chart.plotArea.valAx.majorUnit !== null) {
            step = chartProp.chart.plotArea.valAx.majorUnit;
        } else {
            var firstStep;
            if (isOx || "HBar" == this.calcProp.type) {
                step = this._getStep(firstDegree.val + (firstDegree.val / 10) * 3);
            } else {
                step = this._getStep(firstDegree.val);
            }
            firstStep = step;
            step = step * firstDegree.numPow;
        }
        if (isNaN(step) || step === 0) {
            if ("HBar" == this.calcProp.type && this.calcProp.subType == "stackedPer") {
                arrayValues = [0, 0.2, 0.4, 0.6, 0.8, 1];
            } else {
                if (this.calcProp.subType == "stackedPer") {
                    arrayValues = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];
                } else {
                    arrayValues = [0, 0.2, 0.4, 0.6, 0.8, 1, 1.2];
                }
            }
        } else {
            arrayValues = this._getArrayDataValues(step, axisMin, axisMax, manualMin, manualMax);
        }
        return arrayValues;
    },
    _getArrayDataValues: function (step, axisMin, axisMax, manualMin, manualMax) {
        var arrayValues;
        var minUnit = 0;
        if (manualMin != null) {
            minUnit = manualMin;
        } else {
            if (manualMin == null && axisMin != null && axisMin != 0 && axisMin > 0 && axisMax > 0) {
                minUnit = parseInt(axisMin / step) * step;
            } else {
                if (axisMin < 0) {
                    while (minUnit > axisMin) {
                        minUnit -= step;
                    }
                } else {
                    if (axisMin > 0) {
                        while (minUnit < axisMin && minUnit > (axisMin - step)) {
                            minUnit += step;
                        }
                    }
                }
            }
        }
        arrayValues = this._getArrayAxisValues(minUnit, axisMin, axisMax, step, manualMin, manualMax);
        return arrayValues;
    },
    _getLogArray: function (yMin, yMax, logBase) {
        var result = [];
        var temp;
        var pow = 0;
        var tempPow = yMin;
        if (yMin < 1 && yMin > 0) {
            temp = this._getFirstDegree(yMin).numPow;
            tempPow = temp;
            while (tempPow < 1) {
                pow--;
                tempPow = tempPow * 10;
            }
        } else {
            temp = Math.pow(logBase, 0);
        }
        if (logBase < 1) {
            logBase = 2;
        }
        var step = 0;
        var lMax = 1;
        if (yMin < 1 && yMin > 0) {
            if (lMax < yMax) {
                lMax = yMax;
            }
            while (temp < lMax) {
                temp = Math.pow(logBase, pow);
                result[step] = temp;
                pow++;
                step++;
            }
        } else {
            while (temp <= yMax) {
                temp = Math.pow(logBase, pow);
                result[step] = temp;
                pow++;
                step++;
            }
        }
        return result;
    },
    _getArrayAxisValues: function (minUnit, axisMin, axisMax, step, manualMin, manualMax) {
        var arrayValues = [];
        for (var i = 0; i < 20; i++) {
            if (this.calcProp.subType == "stackedPer" && (minUnit + step * i) > 100) {
                break;
            }
            arrayValues[i] = minUnit + step * i;
            if (axisMax == 0 && axisMin < 0 && arrayValues[i] == axisMax) {
                break;
            } else {
                if ((manualMax != null && arrayValues[i] >= axisMax) || (manualMax == null && arrayValues[i] > axisMax)) {
                    if (this.calcProp.subType == "stackedPer") {
                        arrayValues[i] = arrayValues[i] / 100;
                    }
                    break;
                } else {
                    if (this.calcProp.subType == "stackedPer") {
                        arrayValues[i] = arrayValues[i] / 100;
                    }
                }
            }
        }
        if (!arrayValues.length) {
            arrayValues = [0.2, 0.4, 0.6, 0.8, 1, 1.2];
        }
        return arrayValues;
    },
    _getStep: function (step) {
        if (step > 1 && step <= 2) {
            step = 2;
        } else {
            if (step > 2 && step <= 5) {
                step = 5;
            } else {
                if (step > 5 && step <= 10) {
                    step = 10;
                } else {
                    if (step > 10 && step <= 20) {
                        step = 20;
                    }
                }
            }
        }
        return step;
    },
    _getTrueMinMax: function (isOx, yMin, yMax) {
        var axisMax, axisMin, diffPerMaxMin;
        if (yMin >= 0 && yMax >= 0) {
            axisMax = yMax + 0.05 * (yMax - yMin);
            diffPerMaxMin = ((yMax - yMin) / yMax) * 100;
            if (16.667 > diffPerMaxMin) {
                axisMin = yMin - ((yMax - yMin) / 2);
            } else {
                axisMin = 0;
            }
        } else {
            if (yMin <= 0 && yMax <= 0) {
                diffPerMaxMin = ((yMin - yMax) / yMin) * 100;
                axisMin = yMin + 0.05 * (yMin - yMax);
                if (16.667 < diffPerMaxMin) {
                    axisMax = 0;
                } else {
                    axisMax = yMax - ((yMin - yMax) / 2);
                }
            } else {
                if (yMax > 0 && yMin < 0) {
                    axisMax = yMax + 0.05 * (yMax - yMin);
                    axisMin = yMin + 0.05 * (yMin - yMax);
                }
            }
        }
        if (axisMin == axisMax) {
            if (axisMin < 0) {
                axisMax = 0;
            } else {
                axisMin = 0;
            }
        }
        return {
            min: axisMin,
            max: axisMax
        };
    },
    _getNullPosition: function () {
        var numNull = this.calcProp.numhlines;
        var min = this.calcProp.min;
        var max = this.calcProp.max;
        if (this.cChartSpace.chart.plotArea.valAx && this.cChartSpace.chart.plotArea.valAx.scaling.logBase) {
            if (min < 0) {
                min = 0;
            }
            if (max < 0) {
                max = 0;
            }
        }
        var orientation = this.cChartSpace && this.cChartSpace.chart.plotArea.valAx ? this.cChartSpace.chart.plotArea.valAx.scaling.orientation : ORIENTATION_MIN_MAX;
        if (min >= 0 && max >= 0) {
            if (orientation == ORIENTATION_MIN_MAX) {
                numNull = 0;
            } else {
                numNull = this.calcProp.numhlines;
                if (this.calcProp.type == "HBar") {
                    numNull = this.calcProp.numvlines;
                }
            }
        } else {
            if (min <= 0 && max <= 0) {
                if (orientation == ORIENTATION_MIN_MAX) {
                    numNull = this.calcProp.numhlines;
                    if (this.calcProp.type == "HBar") {
                        numNull = this.calcProp.numvlines;
                    }
                } else {
                    numNull = 0;
                }
            } else {
                var valPoints;
                if (this.cChartSpace.chart.plotArea.valAx) {
                    if (this.calcProp.type == "HBar") {
                        valPoints = this.cChartSpace.chart.plotArea.valAx.xPoints;
                    } else {
                        valPoints = this.cChartSpace.chart.plotArea.valAx.yPoints;
                    }
                    for (var i = 0; i < valPoints.length; i++) {
                        if (valPoints[i].val == 0) {
                            result = valPoints[i].pos * this.calcProp.pxToMM;
                            break;
                        }
                    }
                }
                return result;
            }
        }
        var nullPosition;
        if (0 == numNull) {
            nullPosition = 0;
        } else {
            if (this.calcProp.type == "HBar") {
                nullPosition = (this.calcProp.widthCanvas - this.calcProp.chartGutter._left - this.calcProp.chartGutter._right) / (this.calcProp.numvlines) * numNull;
            } else {
                nullPosition = (this.calcProp.heightCanvas - this.calcProp.chartGutter._bottom - this.calcProp.chartGutter._top) / (this.calcProp.numhlines) * numNull;
            }
        }
        var result;
        if (this.calcProp.type == "HBar") {
            result = nullPosition + this.calcProp.chartGutter._left;
        } else {
            result = this.calcProp.heightCanvas - this.calcProp.chartGutter._bottom - nullPosition;
        }
        return result;
    },
    _getNullPositionLog: function () {
        var valPoints, result;
        if (this.cChartSpace.chart.plotArea.valAx) {
            if (this.calcProp.type == "HBar") {
                valPoints = this.cChartSpace.chart.plotArea.valAx.xPoints;
            } else {
                valPoints = this.cChartSpace.chart.plotArea.valAx.yPoints;
            }
            for (var i = 0; i < valPoints.length; i++) {
                if (valPoints[i].val == 1) {
                    result = valPoints[i].pos * this.calcProp.pxToMM;
                    break;
                }
            }
        }
        return result;
    },
    _getScatterNullPosition: function () {
        var x, y;
        for (var i = 0; i < this.calcProp.xScale.length; i++) {
            if (this.calcProp.xScale[i] == 0) {
                y = this.calcProp.chartGutter._left + i * (this.calcProp.trueWidth / (this.calcProp.xScale.length - 1));
                break;
            }
        }
        for (var i = 0; i < this.calcProp.scale.length; i++) {
            if (this.calcProp.scale[i] == 0) {
                x = this.calcProp.heightCanvas - (this.calcProp.chartGutter._bottom + i * (this.calcProp.trueHeight / (this.calcProp.scale.length - 1)));
                break;
            }
        }
        return {
            x: x,
            y: y
        };
    },
    preCalculateData: function (chartProp) {
        this.calcProp.pxToMM = 1 / g_dKoef_pix_to_mm;
        this.calcProp.pathH = 1000000000;
        this.calcProp.pathW = 1000000000;
        var typeChart = chartProp.chart.plotArea.chart.getObjectType();
        switch (typeChart) {
        case historyitem_type_LineChart:
            this.calcProp.type = "Line";
            break;
        case historyitem_type_BarChart:
            if (chartProp.chart.plotArea.chart.barDir !== BAR_DIR_BAR) {
                this.calcProp.type = "Bar";
            } else {
                this.calcProp.type = "HBar";
            }
            break;
        case historyitem_type_PieChart:
            this.calcProp.type = "Pie";
            break;
        case historyitem_type_AreaChart:
            this.calcProp.type = "Area";
            break;
        case historyitem_type_ScatterChart:
            this.calcProp.type = "Scatter";
            break;
        case historyitem_type_StockChart:
            this.calcProp.type = "Stock";
            break;
        case historyitem_type_DoughnutChart:
            this.calcProp.type = "DoughnutChart";
            break;
        case historyitem_type_RadarChart:
            this.calcProp.type = "Radar";
            break;
        case historyitem_type_BubbleChart:
            this.calcProp.type = "Scatter";
            break;
        }
        var grouping = chartProp.chart.plotArea.chart.grouping;
        if (this.calcProp.type == "Line" || this.calcProp.type == "Area") {
            this.calcProp.subType = (grouping === GROUPING_PERCENT_STACKED) ? "stackedPer" : (grouping === GROUPING_STACKED) ? "stacked" : "normal";
        } else {
            this.calcProp.subType = (grouping === BAR_GROUPING_PERCENT_STACKED) ? "stackedPer" : (grouping === BAR_GROUPING_STACKED) ? "stacked" : "normal";
        }
        this.calcProp.xaxispos = null;
        this.calcProp.yaxispos = null;
        this._calculateData2(chartProp);
        if (this.calcProp.subType == "stackedPer" || this.calcProp.subType == "stacked") {
            this._calculateStackedData2();
        }
        this.calcProp.series = chartProp.chart.plotArea.chart.series;
        this.calcProp.seriesCount = this._calculateCountSeries(chartProp);
        if (this.calcProp.type == "Scatter") {
            this.calcProp.scale = this._roundValues(this._getAxisData2(false, this.calcProp.ymin, this.calcProp.ymax, chartProp));
            this.calcProp.xScale = this._roundValues(this._getAxisData2(true, this.calcProp.min, this.calcProp.max, chartProp));
        } else {
            this.calcProp.scale = this._roundValues(this._getAxisData2(false, this.calcProp.min, this.calcProp.max, chartProp));
        }
        this.calcProp.widthCanvas = chartProp.extX * this.calcProp.pxToMM;
        this.calcProp.heightCanvas = chartProp.extY * this.calcProp.pxToMM;
    },
    calculateSizePlotArea: function (chartSpace) {
        this._calculateMarginsChart(chartSpace);
        var widthCanvas = chartSpace.extX;
        var heightCanvas = chartSpace.extY;
        var w = widthCanvas - (this.calcProp.chartGutter._left + this.calcProp.chartGutter._right) / this.calcProp.pxToMM;
        var h = heightCanvas - (this.calcProp.chartGutter._top + this.calcProp.chartGutter._bottom) / this.calcProp.pxToMM;
        return {
            w: w,
            h: h,
            startX: this.calcProp.chartGutter._left / this.calcProp.pxToMM,
            startY: this.calcProp.chartGutter._top / this.calcProp.pxToMM
        };
    },
    drawPath: function (path, pen, brush) {
        if (!path) {
            return;
        }
        if (pen) {
            path.stroke = true;
        }
        var cGeometry = new CGeometry2();
        this.cShapeDrawer.Clear();
        cGeometry.AddPath(path);
        this.cShapeDrawer.fromShape2(new CColorObj(pen, brush, cGeometry), this.cShapeDrawer.Graphics, cGeometry);
        this.cShapeDrawer.draw(cGeometry);
    },
    calculatePoint: function (x, y, size, symbol) {
        size = size / 2.69;
        var halfSize = size / 2;
        var path = new Path();
        var pathH = this.calcProp.pathH;
        var pathW = this.calcProp.pathW;
        var gdLst = [];
        path.pathH = pathH;
        path.pathW = pathW;
        gdLst["w"] = 1;
        gdLst["h"] = 1;
        var framePaths = null;
        var result;
        path.moveTo(x * pathW, y * pathW);
        switch (symbol) {
        case SYMBOL_DASH:
            path.moveTo((x - halfSize) * pathW, y * pathW);
            path.lnTo((x + halfSize) * pathW, y * pathW);
            break;
        case SYMBOL_DOT:
            path.moveTo((x - halfSize / 2) * pathW, y * pathW);
            path.lnTo((x + halfSize / 2) * pathW, y * pathW);
            break;
        case SYMBOL_PLUS:
            path.moveTo(x * pathW, (y + halfSize) * pathW);
            path.lnTo(x * pathW, (y - halfSize) * pathW);
            path.moveTo((x - halfSize) * pathW, y * pathW);
            path.lnTo((x + halfSize) * pathW, y * pathW);
            break;
        case SYMBOL_CIRCLE:
            path.moveTo((x + halfSize) * pathW, y * pathW);
            path.arcTo(halfSize * pathW, halfSize * pathW, 0, Math.PI * 2 * cToDeg);
            break;
        case SYMBOL_STAR:
            path.moveTo((x - halfSize) * pathW, (y + halfSize) * pathW);
            path.lnTo((x + halfSize) * pathW, (y - halfSize) * pathW);
            path.moveTo((x + halfSize) * pathW, (y + halfSize) * pathW);
            path.lnTo((x - halfSize) * pathW, (y - halfSize) * pathW);
            path.moveTo(x * pathW, (y + halfSize) * pathW);
            path.lnTo(x * pathW, (y - halfSize) * pathW);
            break;
        case SYMBOL_X:
            path.moveTo((x - halfSize) * pathW, (y + halfSize) * pathW);
            path.lnTo((x + halfSize) * pathW, (y - halfSize) * pathW);
            path.moveTo((x + halfSize) * pathW, (y + halfSize) * pathW);
            path.lnTo((x - halfSize) * pathW, (y - halfSize) * pathW);
            break;
        case SYMBOL_TRIANGLE:
            path.moveTo((x - size / Math.sqrt(3)) * pathW, (y + size / 3) * pathW);
            path.lnTo(x * pathW, (y - (2 / 3) * size) * pathW);
            path.lnTo((x + size / Math.sqrt(3)) * pathW, (y + size / 3) * pathW);
            path.lnTo((x - size / Math.sqrt(3)) * pathW, (y + size / 3) * pathW);
            break;
        case SYMBOL_SQUARE:
            path.moveTo((x - halfSize) * pathW, (y + halfSize) * pathW);
            path.lnTo((x - halfSize) * pathW, (y - halfSize) * pathW);
            path.lnTo((x + halfSize) * pathW, (y - halfSize) * pathW);
            path.lnTo((x + halfSize) * pathW, (y + halfSize) * pathW);
            path.lnTo((x - halfSize) * pathW, (y + halfSize) * pathW);
            break;
        case SYMBOL_DIAMOND:
            path.moveTo((x - halfSize) * pathW, y * pathW);
            path.lnTo(x * pathW, (y - halfSize) * pathW);
            path.lnTo((x + halfSize) * pathW, y * pathW);
            path.lnTo(x * pathW, (y + halfSize) * pathW);
            path.lnTo((x - halfSize) * pathW, y * pathW);
            break;
        }
        if (symbol == "Plus" || symbol == "Star" || symbol == "X") {
            framePaths = new Path();
            framePaths.moveTo((x - halfSize) * pathW, (y + halfSize) * pathW);
            framePaths.lnTo((x - halfSize) * pathW, (y - halfSize) * pathW);
            framePaths.lnTo((x + halfSize) * pathW, (y - halfSize) * pathW);
            framePaths.lnTo((x + halfSize) * pathW, (y + halfSize) * pathW);
            framePaths.lnTo((x - halfSize) * pathW, (y + halfSize) * pathW);
        }
        path.recalculate(gdLst);
        if (framePaths) {
            framePaths.recalculate(gdLst);
        }
        result = {
            framePaths: framePaths,
            path: path
        };
        return result;
    },
    getYPosition: function (val, yPoints, isOx, logBase) {
        if (logBase) {
            return this._getYPositionLogBase(val, yPoints, isOx, logBase);
        }
        var result;
        var resPos;
        var resVal;
        var diffVal;
        var plotArea = this.cChartSpace.chart.plotArea;
        if (val < yPoints[0].val) {
            resPos = Math.abs(yPoints[1].pos - yPoints[0].pos);
            resVal = yPoints[1].val - yPoints[0].val;
            diffVal = Math.abs(yPoints[0].val) - Math.abs(val);
            if (isOx) {
                result = yPoints[0].pos - Math.abs((diffVal / resVal) * resPos);
            } else {
                result = yPoints[0].pos + Math.abs((diffVal / resVal) * resPos);
            }
        } else {
            if (val > yPoints[yPoints.length - 1].val) {
                resPos = Math.abs(yPoints[1].pos - yPoints[0].pos);
                resVal = yPoints[1].val - yPoints[0].val;
                diffVal = Math.abs(yPoints[yPoints.length - 1].val - val);
                if (plotArea.valAx.scaling.orientation == ORIENTATION_MIN_MAX) {
                    if (isOx) {
                        result = yPoints[yPoints.length - 1].pos + (diffVal / resVal) * resPos;
                    } else {
                        result = yPoints[yPoints.length - 1].pos - (diffVal / resVal) * resPos;
                    }
                } else {
                    if (isOx) {
                        result = yPoints[yPoints.length - 1].pos - (diffVal / resVal) * resPos;
                    } else {
                        result = yPoints[yPoints.length - 1].pos + (diffVal / resVal) * resPos;
                    }
                }
            } else {
                for (var s = 0; s < yPoints.length; s++) {
                    if (val >= yPoints[s].val && val <= yPoints[s + 1].val) {
                        resPos = Math.abs(yPoints[s + 1].pos - yPoints[s].pos);
                        resVal = yPoints[s + 1].val - yPoints[s].val;
                        var startPos = yPoints[s].pos;
                        if (!isOx) {
                            if (plotArea.valAx.scaling.orientation == ORIENTATION_MIN_MAX) {
                                result = -(resPos / resVal) * (Math.abs(val - yPoints[s].val)) + startPos;
                            } else {
                                result = (resPos / resVal) * (Math.abs(val - yPoints[s].val)) + startPos;
                            }
                        } else {
                            if (this.calcProp.type == "Scatter" || this.calcProp.type == "Stock") {
                                if (plotArea.catAx.scaling.orientation != ORIENTATION_MIN_MAX) {
                                    result = -(resPos / resVal) * (Math.abs(val - yPoints[s].val)) + startPos;
                                } else {
                                    result = (resPos / resVal) * (Math.abs(val - yPoints[s].val)) + startPos;
                                }
                            } else {
                                if ((plotArea.valAx.scaling.orientation == ORIENTATION_MIN_MAX && this.calcProp.type != "Line") || (plotArea.catAx.scaling.orientation == ORIENTATION_MIN_MAX && this.calcProp.type == "Line")) {
                                    result = (resPos / resVal) * (Math.abs(val - yPoints[s].val)) + startPos;
                                } else {
                                    result = -(resPos / resVal) * (Math.abs(val - yPoints[s].val)) + startPos;
                                }
                            }
                        }
                        break;
                    }
                }
            }
        }
        return result;
    },
    _getYPositionLogBase: function (val, yPoints, isOx, logBase) {
        if (val < 0) {
            return 0;
        }
        var logVal = Math.log(val) / Math.log(logBase);
        var result;
        if (logVal < 0) {
            var parseVal = logVal.toString().split(".");
            var maxVal = Math.pow(logBase, parseVal[0]);
            var minVal = Math.pow(logBase, parseFloat(parseVal[0]) - 1);
            var startPos = 0;
            var diffPos;
            for (var i = 0; i < yPoints.length; i++) {
                if (yPoints[i].val < maxVal && yPoints[i].val > minVal) {
                    startPos = yPoints[i + 1].pos;
                    diffPos = yPoints[i].pos - yPoints[i + 1].pos;
                    break;
                }
            }
            result = startPos + parseFloat("0." + parseVal[1]) * diffPos;
        } else {
            var parseVal = logVal.toString().split(".");
            var minVal = Math.pow(logBase, parseVal[0]);
            var maxVal = Math.pow(logBase, parseFloat(parseVal[0]) + 1);
            var startPos = 0;
            var diffPos;
            for (var i = 0; i < yPoints.length; i++) {
                if (yPoints[i].val < maxVal && yPoints[i].val >= minVal) {
                    startPos = yPoints[i].pos;
                    diffPos = yPoints[i].pos - yPoints[i + 1].pos;
                    break;
                }
            }
            result = startPos - parseFloat("0." + parseVal[1]) * diffPos;
        }
        return result;
    },
    getLogarithmicValue: function (val, logBase, yPoints) {
        if (val < 0) {
            return 0;
        }
        var logVal = Math.log(val) / Math.log(logBase);
        var temp = 0;
        if (logVal > 0) {
            for (var l = 0; l < logVal; l++) {
                if (l != 0) {
                    temp += Math.pow(logBase, l);
                }
                if (l + 1 > logVal) {
                    temp += (logVal - l) * Math.pow(logBase, l + 1);
                    break;
                }
            }
        } else {
            var parseTemp = logVal.toString().split(".");
            var nextTemp = Math.pow(logBase, parseFloat(parseTemp[0]) - 1);
            temp = Math.pow(logBase, parseFloat(parseTemp[0]));
            temp = temp - temp * parseFloat("0." + parseTemp[1]);
        }
        return temp;
    },
    _convert3DTo2D: function (x, y, z, p, q, r) {
        var convertMatrix = [[1, 0, 0, p], [0, 1, 0, q], [0, 0, 0, r], [0, 0, 0, 1]];
        var qC = x * convertMatrix[0][3] + y * convertMatrix[1][3] + z * convertMatrix[2][3] + 1;
        var newX = (x * convertMatrix[0][0] + y * convertMatrix[1][0] + z * convertMatrix[2][0] - 0) / (qC);
        var newY = (x * convertMatrix[0][1] + y * convertMatrix[1][1] + z * convertMatrix[2][1] - 0) / (qC);
        return {
            x: newX,
            y: newY
        };
    },
    _turnCoords: function (x, y, z, angleOX, angleOY, angleOZ) {
        var newX, newY, newZ;
        newX = x * Math.cos(angleOY) - z * Math.sin(angleOY);
        newY = y;
        newZ = x * Math.sin(angleOY) + z * Math.cos(angleOY);
        newX = newX;
        newY = newY * Math.cos(angleOX) + newZ * Math.sin(angleOX);
        newZ = newZ * Math.cos(angleOX) - newY * Math.sin(angleOX);
        newX = newX * Math.cos(angleOZ) + newY * Math.sin(angleOZ);
        newY = newY * Math.cos(angleOZ) - newX * Math.sin(angleOZ);
        newZ = newZ;
        return {
            x: newX,
            y: newY,
            z: newZ
        };
    },
    _getSumArray: function (arr, isAbs) {
        if (typeof(arr) == "number") {
            return arr;
        } else {
            if (typeof(arr) == "string") {
                return parseFloat(arr);
            }
        }
        var i, sum;
        for (i = 0, sum = 0; i < arr.length; i++) {
            if (typeof(arr[i]) == "object" && arr[i].val != null && arr[i].val != undefined) {
                sum += parseFloat(isAbs ? Math.abs(arr[i].val) : arr[i].val);
            } else {
                if (arr[i]) {
                    sum += isAbs ? Math.abs(arr[i]) : arr[i];
                }
            }
        }
        return sum;
    },
    _getMaxMinValueArray: function (array) {
        var max = 0,
        min = 0;
        for (var i = 0; i < array.length; i++) {
            for (var j = 0; j < array[i].length; j++) {
                if (i == 0 && j == 0) {
                    min = array[i][j];
                    max = array[i][j];
                }
                if (array[i][j] > max) {
                    max = array[i][j];
                }
                if (array[i][j] < min) {
                    min = array[i][j];
                }
            }
        }
        return {
            max: max,
            min: min
        };
    },
    _findPrevValue: function (originalData, num, max) {
        var summ = 0;
        for (var i = 0; i <= max; i++) {
            if (originalData[num][max] >= 0) {
                if (originalData[num][i] >= 0) {
                    summ += originalData[num][i];
                }
            } else {
                if (originalData[num][i] < 0) {
                    summ += originalData[num][i];
                }
            }
        }
        return summ;
    },
    _getFirstDegree: function (val) {
        var secPart = val.toString().split(".");
        var numPow = 1,
        tempMax;
        if (secPart[1] && secPart[1].toString().indexOf("e+") != -1 && secPart[0] && secPart[0].toString().length == 1) {
            var expNum = secPart[1].toString().split("e+");
            numPow = Math.pow(10, expNum[1]);
        } else {
            if (secPart[1] && secPart[1].toString().indexOf("e-") != -1 && secPart[0] && secPart[0].toString().length == 1) {
                var expNum = secPart[1].toString().split("e");
                numPow = Math.pow(10, expNum[1]);
            } else {
                if (0 != secPart[0]) {
                    numPow = Math.pow(10, secPart[0].toString().length - 1);
                } else {
                    if (0 == secPart[0] && secPart[1] != undefined) {
                        var tempMax = val;
                        var num = 0;
                        while (1 > tempMax) {
                            tempMax = tempMax * 10;
                            num--;
                        }
                        numPow = Math.pow(10, num);
                        val = tempMax;
                    }
                }
            }
        }
        if (tempMax == undefined) {
            val = val / numPow;
        }
        return {
            val: val,
            numPow: numPow
        };
    },
    getIdxPoint: function (seria, val) {
        var seriaVal = seria.val ? seria.val : seria.yVal;
        if (!seriaVal) {
            return null;
        }
        var pts = seriaVal.numRef && seriaVal.numRef.numCache ? seriaVal.numRef.numCache.pts : seriaVal.numLit ? seriaVal.numLit.pts : null;
        if (pts == null) {
            return null;
        }
        for (var p = 0; p < pts.length; p++) {
            if (pts[p].idx == val) {
                return pts[p];
            }
        }
    },
    getPtCount: function (series) {
        var numCache;
        for (var i = 0; i < series.length; i++) {
            numCache = series[i].val.numRef ? series[i].val.numRef.numCache : series[i].val.numLit;
            if (numCache && numCache.ptCount) {
                return numCache.ptCount;
            }
        }
        return 0;
    },
    _roundValues: function (values) {
        var kF = 1000000000;
        if (values.length) {
            for (var i = 0; i < values.length; i++) {
                values[i] = parseInt(values[i] * kF) / kF;
            }
        }
        return values;
    },
    calculate_Bezier: function (x, y, x1, y1, x2, y2, x3, y3) {
        var pts = [],
        bz = [];
        pts[0] = {
            x: x,
            y: y
        };
        pts[1] = {
            x: x1,
            y: y1
        };
        pts[2] = {
            x: x2,
            y: y2
        };
        pts[3] = {
            x: x3,
            y: y3
        };
        var d01 = this.XYZDist(pts[0], pts[1]);
        var d12 = this.XYZDist(pts[1], pts[2]);
        var d23 = this.XYZDist(pts[2], pts[3]);
        var d02 = this.XYZDist(pts[0], pts[2]);
        var d13 = this.XYZDist(pts[1], pts[3]);
        bz[0] = pts[1];
        if ((d02 / 6 < d12 / 2) && (d13 / 6 < d12 / 2)) {
            var f;
            if (x != x1) {
                f = 1 / 6;
            } else {
                f = 1 / 3;
            }
            bz[1] = this.XYZAdd(pts[1], this.XYZMult(this.XYZSub(pts[2], pts[0]), f));
            if (x2 != x3) {
                f = 1 / 6;
            } else {
                f = 1 / 3;
            }
            bz[2] = this.XYZAdd(pts[2], this.XYZMult(this.XYZSub(pts[1], pts[3]), f));
        } else {
            if ((d02 / 6 >= d12 / 2) && (d13 / 6 >= d12 / 2)) {
                bz[1] = this.XYZAdd(pts[1], this.XYZMult(this.XYZSub(pts[2], pts[0]), d12 / 2 / d02));
                bz[2] = this.XYZAdd(pts[2], this.XYZMult(this.XYZSub(pts[1], pts[3]), d12 / 2 / d13));
            } else {
                if ((d02 / 6 >= d12 / 2)) {
                    bz[1] = this.XYZAdd(pts[1], this.XYZMult(this.XYZSub(pts[2], pts[0]), d12 / 2 / d02));
                    bz[2] = this.XYZAdd(pts[2], this.XYZMult(this.XYZSub(pts[1], pts[3]), d12 / 2 / d13 * (d13 / d02)));
                } else {
                    bz[1] = this.XYZAdd(pts[1], this.XYZMult(this.XYZSub(pts[2], pts[0]), d12 / 2 / d02 * (d02 / d13)));
                    bz[2] = this.XYZAdd(pts[2], this.XYZMult(this.XYZSub(pts[1], pts[3]), d12 / 2 / d13));
                }
            }
        }
        bz[3] = pts[2];
        return bz;
    },
    XYZAdd: function (a, b) {
        return {
            x: a.x + b.x,
            y: a.y + b.y
        };
    },
    XYZSub: function (a, b) {
        return {
            x: a.x - b.x,
            y: a.y - b.y
        };
    },
    XYZMult: function (a, b) {
        return {
            x: a.x * b,
            y: a.y * b
        };
    },
    XYZDist: function (a, b) {
        return Math.pow((Math.pow((a.x - b.x), 2) + Math.pow((a.y - b.y), 2)), 0.5);
    },
    _calculateCountSeries: function (chartSpace) {
        var series = chartSpace.chart.plotArea.chart.series;
        var counter = 0,
        numCache, seriaVal;
        for (var i = 0; i < series.length; i++) {
            seriaVal = series[i].val ? series[i].val : series[i].yVal;
            numCache = seriaVal && seriaVal.numRef ? seriaVal.numRef.numCache : seriaVal.numLit;
            if (numCache != null && numCache.pts && numCache.pts.length) {
                if (!this.calcProp.ptCount) {
                    this.calcProp.ptCount = numCache.ptCount;
                }
                counter++;
            }
        }
        return counter;
    }
};
function drawBarChart() {
    this.chartProp = null;
    this.cChartDrawer = null;
    this.cShapeDrawer = null;
    this.paths = {};
    this.summBarVal = [];
}
drawBarChart.prototype = {
    reCalculate: function (chartProp, cShapeDrawer) {
        this.chartProp = chartProp.calcProp;
        this.cChartDrawer = chartProp;
        this.cShapeDrawer = cShapeDrawer;
        this.paths = {};
        this.summBarVal = [];
        this._reCalculateBars();
    },
    draw: function (chartProp, cShapeDrawer) {
        this.chartProp = chartProp.calcProp;
        this.cChartDrawer = chartProp;
        this.cShapeDrawer = cShapeDrawer;
        this._DrawBars();
    },
    _DrawBars: function () {
        this.cShapeDrawer.Graphics.SaveGrState();
        this.cShapeDrawer.Graphics.AddClipRect(this.chartProp.chartGutter._left / this.chartProp.pxToMM, (this.chartProp.chartGutter._top - 1) / this.chartProp.pxToMM, this.chartProp.trueWidth / this.chartProp.pxToMM, this.chartProp.trueHeight / this.chartProp.pxToMM);
        var brush, pen, seria, numCache;
        for (var i = 0; i < this.paths.series.length; i++) {
            if (!this.paths.series[i]) {
                continue;
            }
            seria = this.chartProp.series[i];
            brush = seria.brush;
            pen = seria.pen;
            for (var j = 0; j < this.paths.series[i].length; j++) {
                numCache = seria.val.numRef ? seria.val.numRef.numCache : seria.val.numLit;
                if (numCache.pts[j] && numCache.pts[j].pen) {
                    pen = numCache.pts[j].pen;
                }
                if (numCache.pts[j] && numCache.pts[j].brush) {
                    brush = numCache.pts[j].brush;
                }
                if (this.paths.series[i][j]) {
                    this.cChartDrawer.drawPath(this.paths.series[i][j], pen, brush);
                }
            }
        }
        this.cShapeDrawer.Graphics.RestoreGrState();
    },
    _reCalculateBars: function () {
        var xPoints = this.cShapeDrawer.chart.plotArea.catAx.xPoints;
        var yPoints = this.cShapeDrawer.chart.plotArea.valAx.yPoints;
        var widthGraph = this.chartProp.widthCanvas - this.chartProp.chartGutter._left - this.chartProp.chartGutter._right;
        var defaultOverlap = (this.chartProp.subType == "stacked" || this.chartProp.subType == "stackedPer") ? 100 : 0;
        var overlap = this.cShapeDrawer.chart.plotArea.chart.overlap ? this.cShapeDrawer.chart.plotArea.chart.overlap : defaultOverlap;
        var numCache = this.chartProp.series[0].val.numRef ? this.chartProp.series[0].val.numRef.numCache : this.chartProp.series[0].val.numLit;
        var width = widthGraph / this.chartProp.ptCount;
        if (this.cShapeDrawer.chart.plotArea.catAx.crossAx.crossBetween) {
            width = widthGraph / (numCache.ptCount - 1);
        }
        var gapWidth = this.cShapeDrawer.chart.plotArea.chart.gapWidth ? this.cShapeDrawer.chart.plotArea.chart.gapWidth : 150;
        var individualBarWidth = width / (this.chartProp.seriesCount - (this.chartProp.seriesCount - 1) * (overlap / 100) + gapWidth / 100);
        var widthOverLap = individualBarWidth * (overlap / 100);
        var hmargin = (gapWidth / 100 * individualBarWidth) / 2;
        var height, startX, startY, diffYVal, val, paths, seriesHeight = [],
        tempValues = [],
        seria,
        startYColumnPosition,
        startXPosition,
        newStartX,
        newStartY,
        prevVal,
        idx,
        seriesCounter = 0;
        for (var i = 0; i < this.chartProp.series.length; i++) {
            numCache = this.chartProp.series[i].val.numRef ? this.chartProp.series[i].val.numRef.numCache : this.chartProp.series[i].val.numLit;
            seria = numCache ? numCache.pts : [];
            seriesHeight[i] = [];
            tempValues[i] = [];
            if (numCache == null || this.chartProp.series[i].isHidden) {
                continue;
            }
            for (var j = 0; j < seria.length; j++) {
                val = parseFloat(seria[j].val);
                idx = seria[j].idx != null ? seria[j].idx : j;
                prevVal = 0;
                if (this.chartProp.subType == "stacked" || this.chartProp.subType == "stackedPer") {
                    for (var k = 0; k < tempValues.length; k++) {
                        if (tempValues[k][idx] && tempValues[k][idx] > 0) {
                            prevVal += tempValues[k][idx];
                        }
                    }
                }
                tempValues[i][idx] = val;
                startYColumnPosition = this._getStartYColumnPosition(seriesHeight, i, idx, val, yPoints, prevVal);
                startY = startYColumnPosition.startY;
                height = startYColumnPosition.height;
                seriesHeight[i][idx] = height;
                if (this.cShapeDrawer.chart.plotArea.catAx.scaling.orientation == ORIENTATION_MIN_MAX) {
                    if (xPoints[1] && xPoints[1].pos) {
                        startXPosition = xPoints[idx].pos - Math.abs((xPoints[1].pos - xPoints[0].pos) / 2);
                    } else {
                        startXPosition = xPoints[idx].pos - Math.abs(xPoints[0].pos - this.cShapeDrawer.chart.plotArea.valAx.posX);
                    }
                } else {
                    if (xPoints[1] && xPoints[1].pos) {
                        startXPosition = xPoints[idx].pos + Math.abs((xPoints[1].pos - xPoints[0].pos) / 2);
                    } else {
                        startXPosition = xPoints[idx].pos + Math.abs(xPoints[0].pos - this.cShapeDrawer.chart.plotArea.valAx.posX);
                    }
                }
                if (this.cShapeDrawer.chart.plotArea.catAx.scaling.orientation == ORIENTATION_MIN_MAX) {
                    if (seriesCounter == 0) {
                        startX = startXPosition * this.chartProp.pxToMM + hmargin + seriesCounter * (individualBarWidth);
                    } else {
                        startX = startXPosition * this.chartProp.pxToMM + hmargin + (seriesCounter * individualBarWidth - seriesCounter * widthOverLap);
                    }
                } else {
                    if (i == 0) {
                        startX = startXPosition * this.chartProp.pxToMM - hmargin - seriesCounter * (individualBarWidth);
                    } else {
                        startX = startXPosition * this.chartProp.pxToMM - hmargin - (seriesCounter * individualBarWidth - seriesCounter * widthOverLap);
                    }
                }
                newStartX = startX;
                if (this.cShapeDrawer.chart.plotArea.catAx.scaling.orientation != ORIENTATION_MIN_MAX) {
                    newStartX = startX - individualBarWidth;
                }
                newStartY = startY;
                if (this.cShapeDrawer.chart.plotArea.valAx.scaling.orientation != ORIENTATION_MIN_MAX && (this.chartProp.subType == "stackedPer" || this.chartProp.subType == "stacked")) {
                    newStartY = startY + height;
                }
                paths = this._calculateRect(newStartX, newStartY, individualBarWidth, height);
                if (!this.paths.series) {
                    this.paths.series = [];
                }
                if (!this.paths.series[i]) {
                    this.paths.series[i] = [];
                }
                this.paths.series[i][idx] = paths;
            }
            if (seria.length) {
                seriesCounter++;
            }
        }
    },
    _getStartYColumnPosition: function (seriesHeight, i, j, val, yPoints, prevVal) {
        var startY, diffYVal, height, numCache, tempLogVal, tempPrevLogVal, curVal, prevVal, endBlockPosition, startBlockPosition;
        var nullPositionOX = this.cShapeDrawer.chart.plotArea.valAx && this.cShapeDrawer.chart.plotArea.valAx.scaling.logBase ? this.chartProp.nullPositionOXLog : this.cShapeDrawer.chart.plotArea.catAx.posY * this.chartProp.pxToMM;
        if (this.chartProp.subType == "stacked") {
            curVal = this._getStackedValue(this.chartProp.series, i, j, val);
            prevVal = this._getStackedValue(this.chartProp.series, i - 1, j, val);
            endBlockPosition = this.cChartDrawer.getYPosition((curVal), yPoints) * this.chartProp.pxToMM;
            startBlockPosition = prevVal ? this.cChartDrawer.getYPosition((prevVal), yPoints) * this.chartProp.pxToMM : nullPositionOX;
            startY = startBlockPosition;
            height = startBlockPosition - endBlockPosition;
            if (this.cShapeDrawer.chart.plotArea.valAx.scaling.orientation != ORIENTATION_MIN_MAX) {
                height = -height;
            }
        } else {
            if (this.chartProp.subType == "stackedPer") {
                this._calculateSummStacked(j);
                curVal = this._getStackedValue(this.chartProp.series, i, j, val);
                prevVal = this._getStackedValue(this.chartProp.series, i - 1, j, val);
                endBlockPosition = this.cChartDrawer.getYPosition((curVal / this.summBarVal[j]), yPoints) * this.chartProp.pxToMM;
                startBlockPosition = this.summBarVal[j] ? this.cChartDrawer.getYPosition((prevVal / this.summBarVal[j]), yPoints) * this.chartProp.pxToMM : nullPositionOX;
                startY = startBlockPosition;
                height = startBlockPosition - endBlockPosition;
                if (this.cShapeDrawer.chart.plotArea.valAx.scaling.orientation != ORIENTATION_MIN_MAX) {
                    height = -height;
                }
            } else {
                startY = nullPositionOX;
                if (this.cShapeDrawer.chart.plotArea.valAx && this.cShapeDrawer.chart.plotArea.valAx.scaling.logBase) {
                    height = nullPositionOX - this.cChartDrawer.getYPosition(val, yPoints, null, this.cShapeDrawer.chart.plotArea.valAx.scaling.logBase) * this.chartProp.pxToMM;
                } else {
                    height = nullPositionOX - this.cChartDrawer.getYPosition(val, yPoints) * this.chartProp.pxToMM;
                }
            }
        }
        return {
            startY: startY,
            height: height
        };
    },
    _calculateSummStacked: function (j) {
        if (!this.summBarVal[j]) {
            var curVal;
            var temp = 0;
            var idxPoint;
            for (var k = 0; k < this.chartProp.series.length; k++) {
                idxPoint = this.cChartDrawer.getIdxPoint(this.chartProp.series[k], j);
                curVal = idxPoint ? parseFloat(idxPoint.val) : 0;
                if (curVal) {
                    temp += Math.abs(curVal);
                }
            }
            this.summBarVal[j] = temp;
        }
    },
    _getStackedValue: function (series, i, j, val) {
        var result = 0,
        curVal, idxPoint;
        for (var k = 0; k <= i; k++) {
            idxPoint = this.cChartDrawer.getIdxPoint(this.chartProp.series[k], j);
            curVal = idxPoint ? idxPoint.val : 0;
            if (idxPoint && val > 0 && curVal > 0) {
                result += parseFloat(curVal);
            } else {
                if (idxPoint && val < 0 && curVal < 0) {
                    result += parseFloat(curVal);
                }
            }
        }
        return result;
    },
    _getYPosition: function (val, yPoints) {
        var result;
        var resPos;
        var resVal;
        var diffVal;
        if (val < yPoints[0].val) {
            resPos = Math.abs(yPoints[1].pos - yPoints[0].pos);
            resVal = yPoints[1].val - yPoints[0].val;
            diffVal = Math.abs(yPoints[0].val) - Math.abs(val);
            result = yPoints[0].pos + Math.abs((diffVal / resVal) * resPos);
        } else {
            if (val > yPoints[yPoints.length - 1].val) {
                resPos = Math.abs(yPoints[1].pos - yPoints[0].pos);
                resVal = yPoints[1].val - yPoints[0].val;
                diffVal = Math.abs(yPoints[0].val - val);
                result = yPoints[0].pos - (diffVal / resVal) * resPos;
            } else {
                for (var s = 0; s < yPoints.length; s++) {
                    if (val >= yPoints[s].val && val <= yPoints[s + 1].val) {
                        resPos = Math.abs(yPoints[s + 1].pos - yPoints[s].pos);
                        resVal = yPoints[s + 1].val - yPoints[s].val;
                        result = -(resPos / resVal) * (Math.abs(val - yPoints[s].val)) + yPoints[s].pos;
                        break;
                    }
                }
            }
        }
        return result;
    },
    _calculateDLbl: function (chartSpace, ser, val) {
        var point = this.cChartDrawer.getIdxPoint(this.chartProp.series[ser], val);
        if (!this.paths.series[ser][val]) {
            return;
        }
        var path = this.paths.series[ser][val].ArrPathCommand;
        var x = path[0].X;
        var y = path[0].Y;
        var h = path[0].Y - path[1].Y;
        var w = path[2].X - path[1].X;
        var pxToMm = this.chartProp.pxToMM;
        var width = point.compiledDlb.extX;
        var height = point.compiledDlb.extY;
        var centerX, centerY;
        switch (point.compiledDlb.dLblPos) {
        case DLBL_POS_BEST_FIT:
            break;
        case DLBL_POS_CTR:
            centerX = x + w / 2 - width / 2;
            centerY = y - h / 2 - height / 2;
            break;
        case DLBL_POS_IN_BASE:
            centerX = x + w / 2 - width / 2;
            centerY = y;
            if (point.val > 0) {
                centerY = y - height;
            }
            break;
        case DLBL_POS_IN_END:
            centerX = x + w / 2 - width / 2;
            centerY = y - h;
            if (point.val < 0) {
                centerY = centerY - height;
            }
            break;
        case DLBL_POS_OUT_END:
            centerX = x + w / 2 - width / 2;
            centerY = y - h - height;
            if (point.val < 0) {
                centerY = centerY + height;
            }
            break;
        }
        if (centerX < 0) {
            centerX = 0;
        }
        if (centerX + width > this.chartProp.widthCanvas / pxToMm) {
            centerX = this.chartProp.widthCanvas / pxToMm - width;
        }
        if (centerY < 0) {
            centerY = 0;
        }
        if (centerY + height > this.chartProp.heightCanvas / pxToMm) {
            centerY = this.chartProp.heightCanvas / pxToMm - height;
        }
        return {
            x: centerX,
            y: centerY
        };
    },
    _calculateRect: function (x, y, w, h) {
        var path = new Path();
        var pathH = this.chartProp.pathH;
        var pathW = this.chartProp.pathW;
        var gdLst = [];
        path.pathH = pathH;
        path.pathW = pathW;
        gdLst["w"] = 1;
        gdLst["h"] = 1;
        var pxToMm = this.chartProp.pxToMM;
        path.moveTo(x / pxToMm * pathW, y / pxToMm * pathH);
        path.lnTo(x / pxToMm * pathW, (y - h) / pxToMm * pathH);
        path.lnTo((x + w) / pxToMm * pathW, (y - h) / pxToMm * pathH);
        path.lnTo((x + w) / pxToMm * pathW, y / pxToMm * pathH);
        path.lnTo(x / pxToMm * pathW, y / pxToMm * pathH);
        path.recalculate(gdLst);
        return path;
    }
};
function drawLineChart() {
    this.chartProp = null;
    this.cChartDrawer = null;
    this.cShapeDrawer = null;
    this.cChartSpace = null;
    this.paths = {};
}
drawLineChart.prototype = {
    draw: function (chartProp, cShapeDrawer) {
        this.chartProp = chartProp.calcProp;
        this.cChartDrawer = chartProp;
        this.cShapeDrawer = cShapeDrawer;
        this._drawLines();
    },
    reCalculate: function (chartProp, cChartSpace) {
        this.paths = {};
        this.chartProp = chartProp.calcProp;
        this.cChartDrawer = chartProp;
        this.cChartSpace = cChartSpace;
        this._calculateLines();
    },
    _calculateLines: function () {
        var xPoints = this.cChartSpace.chart.plotArea.catAx.xPoints;
        var yPoints = this.cChartSpace.chart.plotArea.valAx.yPoints;
        var points;
        var y, y1, y2, y3, x, x1, x2, x3, val, nextVal, tempVal, seria, dataSeries, compiledMarkerSize, compiledMarkerSymbol, idx, numCache, idxPoint;
        for (var i = 0; i < this.chartProp.series.length; i++) {
            seria = this.chartProp.series[i];
            numCache = seria.val.numRef ? seria.val.numRef.numCache : seria.val.numLit;
            if (!numCache) {
                continue;
            }
            dataSeries = numCache.pts;
            for (var n = 0; n < numCache.ptCount; n++) {
                idx = dataSeries[n] && dataSeries[n].idx != null ? dataSeries[n].idx : n;
                val = this._getYVal(n, i);
                x = xPoints[n].pos;
                y = this.cChartDrawer.getYPosition(val, yPoints);
                if (!this.paths.points) {
                    this.paths.points = [];
                }
                if (!this.paths.points[i]) {
                    this.paths.points[i] = [];
                }
                if (!points) {
                    points = [];
                }
                if (!points[i]) {
                    points[i] = [];
                }
                idxPoint = this.cChartDrawer.getIdxPoint(seria, n);
                compiledMarkerSize = idxPoint && idxPoint.compiledMarker && idxPoint.compiledMarker.size ? idxPoint.compiledMarker.size : null;
                compiledMarkerSymbol = idxPoint && idxPoint.compiledMarker && isRealNumber(idxPoint.compiledMarker.symbol) ? idxPoint.compiledMarker.symbol : null;
                if (val != null) {
                    this.paths.points[i][n] = this.cChartDrawer.calculatePoint(x, y, compiledMarkerSize, compiledMarkerSymbol);
                    points[i][n] = {
                        x: x,
                        y: y
                    };
                } else {
                    this.paths.points[i][n] = null;
                    points[i][n] = null;
                }
            }
        }
        this._calculateAllLines(points);
    },
    _calculateAllLines: function (points) {
        var startPoint, endPoint;
        var xPoints = this.cChartSpace.chart.plotArea.catAx.xPoints;
        var yPoints = this.cChartSpace.chart.plotArea.valAx.yPoints;
        var x, y, x1, y1, x2, y2, x3, y3, isSplineLine;
        for (var i = 0; i < points.length; i++) {
            isSplineLine = this.chartProp.series[i].smooth;
            if (!points[i]) {
                continue;
            }
            for (var n = 0; n < points[i].length; n++) {
                if (!this.paths.series) {
                    this.paths.series = [];
                }
                if (!this.paths.series[i]) {
                    this.paths.series[i] = [];
                }
                if (points[i][n] != null && points[i][n + 1] != null) {
                    if (isSplineLine) {
                        x = points[i][n - 1] ? n - 1 : 0;
                        y = this._getYVal(x, i);
                        x1 = n;
                        y1 = this._getYVal(x1, i);
                        x2 = points[i][n + 1] ? n + 1 : n;
                        y2 = this._getYVal(x2, i);
                        x3 = points[i][n + 2] ? n + 2 : points[i][n + 1] ? n + 1 : n;
                        y3 = this._getYVal(x3, i);
                        this.paths.series[i][n] = this._calculateSplineLine(x, y, x1, y1, x2, y2, x3, y3, xPoints, yPoints);
                    } else {
                        this.paths.series[i][n] = this._calculateLine(points[i][n].x, points[i][n].y, points[i][n + 1].x, points[i][n + 1].y);
                    }
                }
            }
        }
    },
    _getYPosition: function (val, yPoints) {
        var result;
        var resPos;
        var resVal;
        var diffVal;
        if (val < yPoints[0].val) {
            resPos = Math.abs(yPoints[1].pos - yPoints[0].pos);
            resVal = yPoints[1].val - yPoints[0].val;
            diffVal = Math.abs(yPoints[0].val) - Math.abs(val);
            result = yPoints[0].pos + Math.abs((diffVal / resVal) * resPos);
        } else {
            if (val > yPoints[yPoints.length - 1].val) {
                resPos = Math.abs(yPoints[1].pos - yPoints[0].pos);
                resVal = yPoints[1].val - yPoints[0].val;
                diffVal = Math.abs(yPoints[0].val) - Math.abs(val);
                result = yPoints[0].pos + (diffVal / resVal) * resPos;
            } else {
                for (var s = 0; s < yPoints.length; s++) {
                    if (val >= yPoints[s].val && val <= yPoints[s + 1].val) {
                        resPos = Math.abs(yPoints[s + 1].pos - yPoints[s].pos);
                        resVal = yPoints[s + 1].val - yPoints[s].val;
                        result = -(resPos / resVal) * (Math.abs(val - yPoints[s].val)) + yPoints[s].pos;
                        break;
                    }
                }
            }
        }
        return result;
    },
    _calculateDLbl: function (chartSpace, ser, val) {
        var numCache = this.chartProp.series[ser].val.numRef ? this.chartProp.series[ser].val.numRef.numCache : this.chartProp.series[ser].val.numLit;
        var point = this.cChartDrawer.getIdxPoint(this.chartProp.series[ser], val);
        var path;
        path = this.paths.points[ser][val].path.ArrPathCommand[0];
        if (!path) {
            return;
        }
        var x = path.X;
        var y = path.Y;
        var pxToMm = this.chartProp.pxToMM;
        var constMargin = 5 / pxToMm;
        var width = point.compiledDlb.extX;
        var height = point.compiledDlb.extY;
        var centerX = x - width / 2;
        var centerY = y - height / 2;
        switch (point.compiledDlb.dLblPos) {
        case DLBL_POS_B:
            centerY = centerY + height / 2 + constMargin;
            break;
        case DLBL_POS_BEST_FIT:
            break;
        case DLBL_POS_CTR:
            break;
        case DLBL_POS_L:
            centerX = centerX - width / 2 - constMargin;
            break;
        case DLBL_POS_R:
            centerX = centerX + width / 2 + constMargin;
            break;
        case DLBL_POS_T:
            centerY = centerY - height / 2 - constMargin;
            break;
        }
        if (centerX < 0) {
            centerX = 0;
        }
        if (centerX + width > this.chartProp.widthCanvas / pxToMm) {
            centerX = this.chartProp.widthCanvas / pxToMm - width;
        }
        if (centerY < 0) {
            centerY = 0;
        }
        if (centerY + height > this.chartProp.heightCanvas / pxToMm) {
            centerY = this.chartProp.heightCanvas / pxToMm - height;
        }
        return {
            x: centerX,
            y: centerY
        };
    },
    _drawLines: function (isRedraw) {
        var brush, pen, dataSeries, seria, markerBrush, markerPen, numCache;
        this.cShapeDrawer.Graphics.SaveGrState();
        this.cShapeDrawer.Graphics.AddClipRect(this.chartProp.chartGutter._left / this.chartProp.pxToMM, (this.chartProp.chartGutter._top - 2) / this.chartProp.pxToMM, this.chartProp.trueWidth / this.chartProp.pxToMM, this.chartProp.trueHeight / this.chartProp.pxToMM);
        for (var i = 0; i < this.paths.series.length; i++) {
            seria = this.chartProp.series[i];
            brush = seria.brush;
            pen = seria.pen;
            numCache = seria.val.numRef ? seria.val.numRef.numCache : seria.val.numLit;
            dataSeries = this.paths.series[i];
            if (!dataSeries) {
                continue;
            }
            for (var n = 0; n < dataSeries.length; n++) {
                if (numCache.pts[n + 1] && numCache.pts[n + 1].pen) {
                    pen = numCache.pts[n + 1].pen;
                }
                if (numCache.pts[n + 1] && numCache.pts[n + 1].brush) {
                    brush = numCache.pts[n + 1].brush;
                }
                this.cChartDrawer.drawPath(this.paths.series[i][n], pen, brush);
            }
            for (var k = 0; k < this.paths.points[i].length; k++) {
                if (numCache.pts[k]) {
                    markerBrush = numCache.pts[k].compiledMarker ? numCache.pts[k].compiledMarker.brush : null;
                    markerPen = numCache.pts[k].compiledMarker ? numCache.pts[k].compiledMarker.pen : null;
                }
                if (this.paths.points[i][0] && this.paths.points[i][0].framePaths) {
                    this.cChartDrawer.drawPath(this.paths.points[i][k].framePaths, markerPen, markerBrush, false);
                }
                if (this.paths.points[i][k]) {
                    this.cChartDrawer.drawPath(this.paths.points[i][k].path, markerPen, markerBrush, true);
                }
            }
        }
        this.cShapeDrawer.Graphics.RestoreGrState();
    },
    _getYVal: function (n, i) {
        var tempVal;
        var val = 0;
        var numCache;
        var idxPoint;
        if (this.chartProp.subType == "stacked") {
            for (var k = 0; k <= i; k++) {
                numCache = this.chartProp.series[k].val.numRef ? this.chartProp.series[k].val.numRef.numCache : this.chartProp.series[k].val.numLit;
                idxPoint = this.cChartDrawer.getIdxPoint(this.chartProp.series[k], n);
                tempVal = idxPoint ? parseFloat(idxPoint.val) : 0;
                if (tempVal) {
                    val += tempVal;
                }
            }
        } else {
            if (this.chartProp.subType == "stackedPer") {
                var summVal = 0;
                for (var k = 0; k < this.chartProp.series.length; k++) {
                    numCache = this.chartProp.series[k].val.numRef ? this.chartProp.series[k].val.numRef.numCache : this.chartProp.series[k].val.numLit;
                    idxPoint = this.cChartDrawer.getIdxPoint(this.chartProp.series[k], n);
                    tempVal = idxPoint ? parseFloat(idxPoint.val) : 0;
                    if (tempVal) {
                        if (k <= i) {
                            val += tempVal;
                        }
                        summVal += Math.abs(tempVal);
                    }
                }
                val = val / summVal;
            } else {
                numCache = this.chartProp.series[i].val.numRef ? this.chartProp.series[i].val.numRef.numCache : this.chartProp.series[i].val.numLit;
                idxPoint = this.cChartDrawer.getIdxPoint(this.chartProp.series[i], n);
                val = idxPoint ? parseFloat(idxPoint.val) : null;
            }
        }
        return val;
    },
    _calculateLine: function (x, y, x1, y1) {
        var path = new Path();
        var pathH = this.chartProp.pathH;
        var pathW = this.chartProp.pathW;
        var gdLst = [];
        path.pathH = pathH;
        path.pathW = pathW;
        gdLst["w"] = 1;
        gdLst["h"] = 1;
        path.moveTo(x * pathW, y * pathH);
        path.lnTo(x1 * pathW, y1 * pathH);
        path.recalculate(gdLst);
        return path;
    },
    _calculateSplineLine: function (x, y, x1, y1, x2, y2, x3, y3, xPoints, yPoints) {
        var path = new Path();
        var pathH = this.chartProp.pathH;
        var pathW = this.chartProp.pathW;
        var gdLst = [];
        path.pathH = pathH;
        path.pathW = pathW;
        gdLst["w"] = 1;
        gdLst["h"] = 1;
        var splineCoords = this.cChartDrawer.calculate_Bezier(x, y, x1, y1, x2, y2, x3, y3, i);
        var x = this.cChartDrawer.getYPosition(splineCoords[0].x, xPoints, true);
        var y = this.cChartDrawer.getYPosition(splineCoords[0].y, yPoints);
        var x1 = this.cChartDrawer.getYPosition(splineCoords[1].x, xPoints, true);
        var y1 = this.cChartDrawer.getYPosition(splineCoords[1].y, yPoints);
        var x2 = this.cChartDrawer.getYPosition(splineCoords[2].x, xPoints, true);
        var y2 = this.cChartDrawer.getYPosition(splineCoords[2].y, yPoints);
        var x3 = this.cChartDrawer.getYPosition(splineCoords[3].x, xPoints, true);
        var y3 = this.cChartDrawer.getYPosition(splineCoords[3].y, yPoints);
        path.moveTo(x * pathW, y * pathH);
        path.cubicBezTo(x1 * pathW, y1 * pathH, x2 * pathW, y2 * pathH, x3 * pathW, y3 * pathH);
        path.recalculate(gdLst);
        return path;
    }
};
function drawAreaChart() {
    this.chartProp = null;
    this.cChartDrawer = null;
    this.cShapeDrawer = null;
    this.points = null;
    this.paths = {};
}
drawAreaChart.prototype = {
    draw: function (chartProp, cShapeDrawer) {
        this.chartProp = chartProp.calcProp;
        this.cChartDrawer = chartProp;
        this.cShapeDrawer = cShapeDrawer;
        this._drawLines();
    },
    reCalculate: function (chartProp, cChartSpace) {
        this.paths = {};
        this.points = null;
        this.chartProp = chartProp.calcProp;
        this.cChartDrawer = chartProp;
        this.cChartSpace = cChartSpace;
        this._calculateLines();
    },
    _calculateLines: function () {
        var xPoints = this.cChartSpace.chart.plotArea.catAx.xPoints;
        var yPoints = this.cChartSpace.chart.plotArea.valAx.yPoints;
        var y, x, val, seria, dataSeries, numCache;
        var pxToMm = this.chartProp.pxToMM;
        var nullPositionOX = this.chartProp.nullPositionOX / pxToMm;
        for (var i = 0; i < this.chartProp.series.length; i++) {
            seria = this.chartProp.series[i];
            numCache = seria.val.numRef ? seria.val.numRef.numCache : seria.val.numLit;
            if (!numCache) {
                continue;
            }
            dataSeries = numCache.pts;
            for (var n = 0; n < numCache.ptCount; n++) {
                val = this._getYVal(n, i);
                x = xPoints[n].pos;
                y = this.cChartDrawer.getYPosition(val, yPoints);
                if (!this.points) {
                    this.points = [];
                }
                if (!this.points[i]) {
                    this.points[i] = [];
                }
                if (val != null) {
                    this.points[i][n] = {
                        x: x,
                        y: y
                    };
                } else {
                    this.points[i][n] = {
                        x: x,
                        y: nullPositionOX
                    };
                }
            }
        }
        this._calculateAllLines();
    },
    _calculateAllLines: function () {
        var startPoint, endPoint;
        var xPoints = this.cChartSpace.chart.plotArea.catAx.xPoints;
        var yPoints = this.cChartSpace.chart.plotArea.valAx.yPoints;
        var points = this.points;
        var prevPoints;
        for (var i = 0; i < points.length; i++) {
            if (!this.paths.series) {
                this.paths.series = [];
            }
            prevPoints = null;
            if (this.chartProp.subType == "stackedPer" || this.chartProp.subType == "stacked") {
                prevPoints = this._getPrevSeriesPoints(points, i);
            }
            if (points[i]) {
                this.paths.series[i] = this._calculateLine(points[i], prevPoints);
            }
        }
    },
    _getPrevSeriesPoints: function (points, i) {
        var prevPoints = null;
        for (var p = i - 1; p >= 0; p--) {
            if (points[p]) {
                prevPoints = points[p];
                break;
            }
        }
        return prevPoints;
    },
    _calculateLine: function (points, prevPoints) {
        var path = new Path();
        var pathH = this.chartProp.pathH;
        var pathW = this.chartProp.pathW;
        var gdLst = [];
        path.pathH = pathH;
        path.pathW = pathW;
        gdLst["w"] = 1;
        gdLst["h"] = 1;
        var point;
        var pxToMm = this.chartProp.pxToMM;
        for (var i = 0; i < points.length; i++) {
            point = points[i];
            if (i == 0) {
                path.moveTo(point.x * pathW, point.y * pathH);
            } else {
                path.lnTo(point.x * pathW, point.y * pathH);
            }
        }
        var nullPositionOX = this.chartProp.nullPositionOX;
        if (prevPoints != null) {
            for (var i = prevPoints.length - 1; i >= 0; i--) {
                point = prevPoints[i];
                path.lnTo(point.x * pathW, point.y * pathH);
                if (i == 0) {
                    path.lnTo(points[0].x * pathW, points[0].y * pathH);
                }
            }
        } else {
            path.lnTo(points[points.length - 1].x * pathW, nullPositionOX / pxToMm * pathH);
            path.lnTo(points[0].x * pathW, nullPositionOX / pxToMm * pathH);
            path.lnTo(points[0].x * pathW, points[0].y * pathH);
        }
        path.recalculate(gdLst);
        return path;
    },
    _getYPosition: function (val, yPoints) {
        var result;
        var resPos;
        var resVal;
        var diffVal;
        if (val < yPoints[0].val) {
            resPos = Math.abs(yPoints[1].pos - yPoints[0].pos);
            resVal = yPoints[1].val - yPoints[0].val;
            diffVal = Math.abs(yPoints[0].val) - Math.abs(val);
            result = yPoints[0].pos - Math.abs((diffVal / resVal) * resPos);
        } else {
            if (val > yPoints[yPoints.length - 1].val) {
                resPos = Math.abs(yPoints[1].pos - yPoints[0].pos);
                resVal = yPoints[1].val - yPoints[0].val;
                diffVal = Math.abs(yPoints[0].val - val);
                result = yPoints[0].pos - (diffVal / resVal) * resPos;
            } else {
                for (var s = 0; s < yPoints.length; s++) {
                    if (val >= yPoints[s].val && val <= yPoints[s + 1].val) {
                        resPos = Math.abs(yPoints[s + 1].pos - yPoints[s].pos);
                        resVal = yPoints[s + 1].val - yPoints[s].val;
                        result = -(resPos / resVal) * (Math.abs(val - yPoints[s].val)) + yPoints[s].pos;
                        break;
                    }
                }
            }
        }
        return result;
    },
    _calculateDLbl: function (chartSpace, ser, val) {
        var numCache = this.chartProp.series[ser].val.numRef ? this.chartProp.series[ser].val.numRef.numCache : this.chartProp.series[ser].val.numLit;
        var point = this.cChartDrawer.getIdxPoint(this.chartProp.series[ser], val);
        var path;
        path = this.points[ser][val];
        if (!path) {
            return;
        }
        var x = path.x;
        var y = path.y;
        var pxToMm = this.chartProp.pxToMM;
        var constMargin = 5 / pxToMm;
        var width = point.compiledDlb.extX;
        var height = point.compiledDlb.extY;
        var centerX = x - width / 2;
        var centerY = y - height / 2;
        switch (point.compiledDlb.dLblPos) {
        case DLBL_POS_B:
            centerY = centerY + height / 2 + constMargin;
            break;
        case DLBL_POS_BEST_FIT:
            break;
        case DLBL_POS_CTR:
            break;
        case DLBL_POS_L:
            centerX = centerX - width / 2 - constMargin;
            break;
        case DLBL_POS_R:
            centerX = centerX + width / 2 + constMargin;
            break;
        case DLBL_POS_T:
            centerY = centerY - height / 2 - constMargin;
            break;
        }
        if (centerX < 0) {
            centerX = 0;
        }
        if (centerX + width > this.chartProp.widthCanvas / pxToMm) {
            centerX = this.chartProp.widthCanvas / pxToMm - width;
        }
        if (centerY < 0) {
            centerY = 0;
        }
        if (centerY + height > this.chartProp.heightCanvas / pxToMm) {
            centerY = this.chartProp.heightCanvas / pxToMm - height;
        }
        return {
            x: centerX,
            y: centerY
        };
    },
    _drawLines: function () {
        var brush;
        var FillUniColor;
        var pen;
        var seria, dataSeries;
        this.cShapeDrawer.Graphics.SaveGrState();
        this.cShapeDrawer.Graphics.AddClipRect(this.chartProp.chartGutter._left / this.chartProp.pxToMM, (this.chartProp.chartGutter._top - 1) / this.chartProp.pxToMM, this.chartProp.trueWidth / this.chartProp.pxToMM, this.chartProp.trueHeight / this.chartProp.pxToMM);
        for (var i = 0; i < this.chartProp.series.length; i++) {
            seria = this.chartProp.series[i];
            dataSeries = seria.val.numRef && seria.val.numRef.numCache ? seria.val.numRef.numCache.pts : seria.val.numLit ? seria.val.numLit.pts : null;
            if (!dataSeries) {
                continue;
            }
            if (dataSeries[0] && dataSeries[0].pen) {
                pen = dataSeries[0].pen;
            }
            if (dataSeries[0] && dataSeries[0].brush) {
                brush = dataSeries[0].brush;
            }
            this.cChartDrawer.drawPath(this.paths.series[i], pen, brush);
        }
        this.cShapeDrawer.Graphics.RestoreGrState();
    },
    _getYVal: function (n, i) {
        var tempVal;
        var val = 0;
        var numCache;
        var idxPoint;
        if (this.chartProp.subType == "stacked") {
            for (var k = 0; k <= i; k++) {
                numCache = this.chartProp.series[k].val.numRef ? this.chartProp.series[k].val.numRef.numCache : this.chartProp.series[k].val.numLit;
                idxPoint = this.cChartDrawer.getIdxPoint(this.chartProp.series[k], n);
                tempVal = idxPoint ? parseFloat(idxPoint.val) : 0;
                if (tempVal) {
                    val += tempVal;
                }
            }
        } else {
            if (this.chartProp.subType == "stackedPer") {
                var summVal = 0;
                for (var k = 0; k < this.chartProp.series.length; k++) {
                    numCache = this.chartProp.series[k].val.numRef ? this.chartProp.series[k].val.numRef.numCache : this.chartProp.series[k].val.numLit;
                    idxPoint = this.cChartDrawer.getIdxPoint(this.chartProp.series[k], n);
                    tempVal = idxPoint ? parseFloat(idxPoint.val) : 0;
                    if (tempVal) {
                        if (k <= i) {
                            val += tempVal;
                        }
                        summVal += Math.abs(tempVal);
                    }
                }
                val = val / summVal;
            } else {
                numCache = this.chartProp.series[i].val.numRef ? this.chartProp.series[i].val.numRef.numCache : this.chartProp.series[i].val.numLit;
                idxPoint = this.cChartDrawer.getIdxPoint(this.chartProp.series[i], n);
                val = idxPoint ? parseFloat(idxPoint.val) : null;
            }
        }
        return val;
    }
};
function drawHBarChart() {
    this.chartProp = null;
    this.cChartDrawer = null;
    this.cShapeDrawer = null;
    this.paths = {};
    this.summBarVal = [];
}
drawHBarChart.prototype = {
    reCalculate: function (chartProp, cShapeDrawer) {
        this.paths = {};
        this.chartProp = chartProp.calcProp;
        this.cChartDrawer = chartProp;
        this.cShapeDrawer = cShapeDrawer;
        this.summBarVal = [];
        this._recalculateBars();
    },
    draw: function (chartProp, cShapeDrawer) {
        this.chartProp = chartProp.calcProp;
        this.cChartDrawer = chartProp;
        this.cShapeDrawer = cShapeDrawer;
        this._drawBars();
    },
    _recalculateBars: function () {
        var xPoints = this.cShapeDrawer.chart.plotArea.valAx.xPoints;
        var yPoints = this.cShapeDrawer.chart.plotArea.catAx.yPoints;
        var xaxispos = this.chartProp.xaxispos;
        var heightGraph = this.chartProp.heightCanvas - this.chartProp.chartGutter._top - this.chartProp.chartGutter._bottom;
        var defaultOverlap = (this.chartProp.subType == "stacked" || this.chartProp.subType == "stackedPer") ? 100 : 0;
        var overlap = this.cShapeDrawer.chart.plotArea.chart.overlap ? this.cShapeDrawer.chart.plotArea.chart.overlap : defaultOverlap;
        var ptCount = this.cChartDrawer.getPtCount(this.chartProp.series);
        var height = heightGraph / ptCount;
        var gapWidth = this.cShapeDrawer.chart.plotArea.chart.gapWidth ? this.cShapeDrawer.chart.plotArea.chart.gapWidth : 150;
        var individualBarHeight = height / (this.chartProp.seriesCount - (this.chartProp.seriesCount - 1) * (overlap / 100) + gapWidth / 100);
        var widthOverLap = individualBarHeight * (overlap / 100);
        var hmargin = (gapWidth / 100 * individualBarHeight) / 2;
        var width, startX, startY, diffYVal, val, paths, seriesHeight = [],
        seria,
        startXColumnPosition,
        startYPosition,
        newStartX,
        newStartY,
        idx,
        seriesCounter = 0,
        numCache;
        for (var i = 0; i < this.chartProp.series.length; i++) {
            numCache = this.chartProp.series[i].val.numRef ? this.chartProp.series[i].val.numRef.numCache : this.chartProp.series[i].val.numLit;
            if (!numCache || this.chartProp.series[i].isHidden) {
                continue;
            }
            seria = this.chartProp.series[i].val.numRef.numCache.pts;
            seriesHeight[i] = [];
            for (var j = 0; j < seria.length; j++) {
                val = parseFloat(seria[j].val);
                if (this.cShapeDrawer.chart.plotArea.valAx && this.cShapeDrawer.chart.plotArea.valAx.scaling.logBase) {
                    val = this.cChartDrawer.getLogarithmicValue(val, this.cShapeDrawer.chart.plotArea.valAx.scaling.logBase, xPoints);
                }
                idx = seria[j].idx != null ? seria[j].idx : j;
                startXColumnPosition = this._getStartYColumnPosition(seriesHeight, idx, i, val, xPoints);
                startX = startXColumnPosition.startY / this.chartProp.pxToMM;
                width = startXColumnPosition.width / this.chartProp.pxToMM;
                seriesHeight[i][idx] = startXColumnPosition.width;
                if (this.cShapeDrawer.chart.plotArea.catAx.scaling.orientation == ORIENTATION_MIN_MAX) {
                    if (yPoints[1] && yPoints[1].pos) {
                        startYPosition = yPoints[idx].pos + Math.abs((yPoints[1].pos - yPoints[0].pos) / 2);
                    } else {
                        startYPosition = yPoints[idx].pos + Math.abs(yPoints[0].pos - this.cShapeDrawer.chart.plotArea.valAx.posY);
                    }
                } else {
                    if (yPoints[1] && yPoints[1].pos) {
                        startYPosition = yPoints[idx].pos - Math.abs((yPoints[1].pos - yPoints[0].pos) / 2);
                    } else {
                        startYPosition = yPoints[idx].pos - Math.abs(yPoints[0].pos - this.cShapeDrawer.chart.plotArea.valAx.posY);
                    }
                }
                if (this.cShapeDrawer.chart.plotArea.catAx.scaling.orientation == ORIENTATION_MIN_MAX) {
                    if (seriesCounter == 0) {
                        startY = startYPosition * this.chartProp.pxToMM - hmargin - seriesCounter * (individualBarHeight);
                    } else {
                        startY = startYPosition * this.chartProp.pxToMM - hmargin - (seriesCounter * individualBarHeight - seriesCounter * widthOverLap);
                    }
                } else {
                    if (i == 0) {
                        startY = startYPosition * this.chartProp.pxToMM + hmargin + seriesCounter * (individualBarHeight);
                    } else {
                        startY = startYPosition * this.chartProp.pxToMM + hmargin + (seriesCounter * individualBarHeight - seriesCounter * widthOverLap);
                    }
                }
                newStartY = startY;
                if (this.cShapeDrawer.chart.plotArea.catAx.scaling.orientation != ORIENTATION_MIN_MAX) {
                    newStartY = startY + individualBarHeight;
                }
                newStartX = startX;
                if (this.cShapeDrawer.chart.plotArea.valAx.scaling.orientation != ORIENTATION_MIN_MAX && (this.chartProp.subType == "stackedPer" || this.chartProp.subType == "stacked")) {
                    newStartX = startX - width;
                }
                paths = this._calculateRect(newStartX, newStartY / this.chartProp.pxToMM, width, individualBarHeight / this.chartProp.pxToMM);
                if (!this.paths.series) {
                    this.paths.series = [];
                }
                if (!this.paths.series[i]) {
                    this.paths.series[i] = [];
                }
                if (height != 0) {
                    this.paths.series[i][idx] = paths;
                }
            }
            if (seria.length) {
                seriesCounter++;
            }
        }
    },
    _getStartYColumnPosition: function (seriesHeight, j, i, val, xPoints, summBarVal) {
        var startY, diffYVal, width, numCache, dVal, curVal, prevVal, endBlockPosition, startBlockPosition;
        var nullPositionOX = this.cShapeDrawer.chart.plotArea.catAx.posX ? this.cShapeDrawer.chart.plotArea.catAx.posX * this.chartProp.pxToMM : this.cShapeDrawer.chart.plotArea.catAx.xPos * this.chartProp.pxToMM;
        if (this.chartProp.subType == "stacked") {
            curVal = this._getStackedValue(this.chartProp.series, i, j, val);
            prevVal = this._getStackedValue(this.chartProp.series, i - 1, j, val);
            endBlockPosition = this.cChartDrawer.getYPosition((curVal), xPoints, true) * this.chartProp.pxToMM;
            startBlockPosition = prevVal ? this.cChartDrawer.getYPosition((prevVal), xPoints, true) * this.chartProp.pxToMM : nullPositionOX;
            startY = startBlockPosition;
            width = endBlockPosition - startBlockPosition;
            if (this.cShapeDrawer.chart.plotArea.valAx.scaling.orientation != ORIENTATION_MIN_MAX) {
                width = -width;
            }
        } else {
            if (this.chartProp.subType == "stackedPer") {
                this._calculateSummStacked(j);
                curVal = this._getStackedValue(this.chartProp.series, i, j, val);
                prevVal = this._getStackedValue(this.chartProp.series, i - 1, j, val);
                endBlockPosition = this.cChartDrawer.getYPosition((curVal / this.summBarVal[j]), xPoints, true) * this.chartProp.pxToMM;
                startBlockPosition = this.summBarVal[j] ? this.cChartDrawer.getYPosition((prevVal / this.summBarVal[j]), xPoints, true) * this.chartProp.pxToMM : nullPositionOX;
                startY = startBlockPosition;
                width = endBlockPosition - startBlockPosition;
                if (this.cShapeDrawer.chart.plotArea.valAx.scaling.orientation != ORIENTATION_MIN_MAX) {
                    width = -width;
                }
            } else {
                width = this.cChartDrawer.getYPosition(val, xPoints, true) * this.chartProp.pxToMM - nullPositionOX;
                startY = nullPositionOX;
            }
        }
        return {
            startY: startY,
            width: width
        };
    },
    _calculateSummStacked: function (j) {
        if (!this.summBarVal[j]) {
            var curVal;
            var temp = 0,
            idxPoint;
            for (var k = 0; k < this.chartProp.series.length; k++) {
                idxPoint = this.cChartDrawer.getIdxPoint(this.chartProp.series[k], j);
                curVal = idxPoint ? parseFloat(idxPoint.val) : 0;
                if (curVal) {
                    temp += Math.abs(curVal);
                }
            }
            this.summBarVal[j] = temp;
        }
    },
    _getStackedValue: function (series, i, j, val) {
        var result = 0,
        curVal, idxPoint;
        for (var k = 0; k <= i; k++) {
            idxPoint = this.cChartDrawer.getIdxPoint(series[k], j);
            curVal = idxPoint ? idxPoint.val : 0;
            if (idxPoint && val > 0 && curVal > 0) {
                result += parseFloat(curVal);
            } else {
                if (idxPoint && val < 0 && curVal < 0) {
                    result += parseFloat(curVal);
                }
            }
        }
        return result;
    },
    _getYPosition: function (val, yPoints, isOx) {
        var result;
        var resPos;
        var resVal;
        var diffVal;
        if (val < yPoints[0].val) {
            resPos = Math.abs(yPoints[1].pos - yPoints[0].pos);
            resVal = yPoints[1].val - yPoints[0].val;
            diffVal = Math.abs(yPoints[0].val) - Math.abs(val);
            result = yPoints[0].pos - Math.abs((diffVal / resVal) * resPos);
        } else {
            if (val > yPoints[yPoints.length - 1].val) {
                resPos = Math.abs(yPoints[1].pos - yPoints[0].pos);
                resVal = yPoints[1].val - yPoints[0].val;
                diffVal = Math.abs(yPoints[0].val - val);
                result = yPoints[0].pos + (diffVal / resVal) * resPos;
            } else {
                for (var s = 0; s < yPoints.length; s++) {
                    if (val >= yPoints[s].val && val <= yPoints[s + 1].val) {
                        resPos = Math.abs(yPoints[s + 1].pos - yPoints[s].pos);
                        resVal = yPoints[s + 1].val - yPoints[s].val;
                        if (!isOx) {
                            result = -(resPos / resVal) * (Math.abs(val - yPoints[s].val)) + yPoints[s].pos;
                        } else {
                            result = (resPos / resVal) * (Math.abs(val - yPoints[s].val)) + yPoints[s].pos;
                        }
                        break;
                    }
                }
            }
        }
        return result;
    },
    _drawBars: function () {
        var brush;
        var pen;
        var numCache;
        var seria;
        this.cShapeDrawer.Graphics.SaveGrState();
        this.cShapeDrawer.Graphics.AddClipRect(this.chartProp.chartGutter._left / this.chartProp.pxToMM, (this.chartProp.chartGutter._top - 1) / this.chartProp.pxToMM, this.chartProp.trueWidth / this.chartProp.pxToMM, this.chartProp.trueHeight / this.chartProp.pxToMM);
        for (var i = 0; i < this.paths.series.length; i++) {
            if (!this.paths.series[i]) {
                continue;
            }
            seria = this.chartProp.series[i];
            brush = seria.brush;
            pen = seria.pen;
            for (var j = 0; j < this.paths.series[i].length; j++) {
                numCache = seria.val.numRef ? seria.val.numRef.numCache : seria.val.numLit;
                if (numCache.pts[j] && numCache.pts[j].pen) {
                    pen = numCache.pts[j].pen;
                }
                if (numCache.pts[j] && numCache.pts[j].brush) {
                    brush = numCache.pts[j].brush;
                }
                if (this.paths.series[i][j]) {
                    this.cChartDrawer.drawPath(this.paths.series[i][j], pen, brush);
                }
            }
        }
        this.cShapeDrawer.Graphics.RestoreGrState();
    },
    _calculateDLbl: function (chartSpace, ser, val) {
        var point = this.cChartDrawer.getIdxPoint(this.chartProp.series[ser], val);
        var path = this.paths.series[ser][val].ArrPathCommand;
        var x = path[0].X;
        var y = path[0].Y;
        var h = path[0].Y - path[1].Y;
        var w = path[2].X - path[1].X;
        var pxToMm = this.chartProp.pxToMM;
        var width = point.compiledDlb.extX;
        var height = point.compiledDlb.extY;
        var centerX, centerY;
        switch (point.compiledDlb.dLblPos) {
        case DLBL_POS_BEST_FIT:
            break;
        case DLBL_POS_CTR:
            centerX = x + w / 2 - width / 2;
            centerY = y - h / 2 - height / 2;
            break;
        case DLBL_POS_IN_BASE:
            centerX = x;
            centerY = y - h / 2 - height / 2;
            if (point.val < 0) {
                centerX = x - width;
            }
            break;
        case DLBL_POS_IN_END:
            centerX = x + w - width;
            centerY = y - h / 2 - height / 2;
            if (point.val < 0) {
                centerX = x + w;
            }
            break;
        case DLBL_POS_OUT_END:
            centerX = x + w;
            centerY = y - h / 2 - height / 2;
            if (point.val < 0) {
                centerX = x + w - width;
            }
            break;
        }
        if (centerX < 0) {
            centerX = 0;
        }
        if (centerX + width > this.chartProp.widthCanvas / pxToMm) {
            centerX = this.chartProp.widthCanvas / pxToMm - width;
        }
        if (centerY < 0) {
            centerY = 0;
        }
        if (centerY + height > this.chartProp.heightCanvas / pxToMm) {
            centerY = this.chartProp.heightCanvas / pxToMm - height;
        }
        return {
            x: centerX,
            y: centerY
        };
    },
    _calculateRect: function (x, y, w, h) {
        var path = new Path();
        var pathH = this.chartProp.pathH;
        var pathW = this.chartProp.pathW;
        var gdLst = [];
        path.pathH = pathH;
        path.pathW = pathW;
        gdLst["w"] = 1;
        gdLst["h"] = 1;
        var pxToMm = this.chartProp.pxToMM;
        path.moveTo(x * pathW, y * pathH);
        path.lnTo(x * pathW, (y - h) * pathH);
        path.lnTo((x + w) * pathW, (y - h) * pathH);
        path.lnTo((x + w) * pathW, y * pathH);
        path.lnTo(x * pathW, y * pathH);
        path.recalculate(gdLst);
        return path;
    }
};
function drawPieChart() {
    this.tempAngle = null;
    this.paths = {};
}
drawPieChart.prototype = {
    draw: function (chartProp, cShapeDrawer) {
        this.chartProp = chartProp.calcProp;
        this.cChartDrawer = chartProp;
        this.cShapeDrawer = cShapeDrawer;
        this._drawPie();
    },
    reCalculate: function (chartProp, cShapeDrawer) {
        this.chartProp = chartProp.calcProp;
        this.cChartDrawer = chartProp;
        this.cShapeDrawer = cShapeDrawer;
        this.tempAngle = null;
        this.paths = {};
        this._reCalculatePie();
    },
    _drawPie: function () {
        var numCache = this._getFirstRealNumCache();
        var brush, pen, val;
        var path;
        for (var i = 0, len = numCache.length; i < len; i++) {
            val = numCache[i];
            brush = val.brush;
            pen = val.pen;
            path = this.paths.series[i];
            this.cChartDrawer.drawPath(path, pen, brush);
        }
    },
    _reCalculatePie: function () {
        var trueWidth = this.chartProp.trueWidth;
        var trueHeight = this.chartProp.trueHeight;
        var numCache = this._getFirstRealNumCache();
        var sumData = this.cChartDrawer._getSumArray(numCache, true);
        var radius = Math.min(trueHeight, trueWidth) / 2;
        var xCenter = this.chartProp.chartGutter._left + trueWidth / 2;
        var yCenter = this.chartProp.chartGutter._top + trueHeight / 2;
        this.tempAngle = Math.PI / 2;
        var angle;
        for (var i = numCache.length - 1; i >= 0; i--) {
            angle = Math.abs((parseFloat(numCache[i].val / sumData)) * (Math.PI * 2));
            if (!this.paths.series) {
                this.paths.series = [];
            }
            if (sumData === 0) {
                this.paths.series[i] = this._calculateEmptySegment(radius, xCenter, yCenter);
            } else {
                this.paths.series[i] = this._calculateSegment(angle, radius, xCenter, yCenter);
            }
        }
    },
    _getFirstRealNumCache: function () {
        var series = this.chartProp.series;
        var numCache;
        for (var i = 0; i < series.length; i++) {
            numCache = this.chartProp.series[i].val.numRef ? this.chartProp.series[i].val.numRef.numCache.pts : this.chartProp.series[i].val.numLit.pts;
            if (numCache && numCache.length) {
                return numCache;
            }
        }
        return series[0].val.numRef ? series[0].val.numRef.numCache.pts : series[0].val.numLit.pts;
    },
    _calculateSegment: function (angle, radius, xCenter, yCenter) {
        if (isNaN(angle)) {
            return null;
        }
        var startAngle = (this.tempAngle);
        var endAngle = angle;
        if (radius < 0) {
            radius = 0;
        }
        var path = this._calculateArc(radius, startAngle, endAngle, xCenter, yCenter);
        this.tempAngle += angle;
        return path;
    },
    _calculateEmptySegment: function (radius, xCenter, yCenter) {
        var path = new Path();
        var pathH = this.chartProp.pathH;
        var pathW = this.chartProp.pathW;
        var gdLst = [];
        path.pathH = pathH;
        path.pathW = pathW;
        gdLst["w"] = 1;
        gdLst["h"] = 1;
        var pxToMm = this.chartProp.pxToMM;
        var x0 = xCenter + radius * Math.cos(this.tempAngle);
        var y0 = yCenter - radius * Math.sin(this.tempAngle);
        path.moveTo(xCenter / pxToMm * pathW, yCenter / pxToMm * pathH);
        path.lnTo(x0 / pxToMm * pathW, y0 / pxToMm * pathH);
        path.arcTo(radius / pxToMm * pathW, radius / pxToMm * pathH, this.tempAngle, this.tempAngle);
        path.lnTo(xCenter / pxToMm * pathW, yCenter / pxToMm * pathH);
        path.recalculate(gdLst);
        return path;
    },
    _calculateArc: function (radius, stAng, swAng, xCenter, yCenter) {
        var path = new Path();
        var pathH = this.chartProp.pathH;
        var pathW = this.chartProp.pathW;
        var gdLst = [];
        path.pathH = pathH;
        path.pathW = pathW;
        gdLst["w"] = 1;
        gdLst["h"] = 1;
        var pxToMm = this.chartProp.pxToMM;
        var x0 = xCenter + radius * Math.cos(stAng);
        var y0 = yCenter - radius * Math.sin(stAng);
        path.moveTo(xCenter / pxToMm * pathW, yCenter / pxToMm * pathH);
        path.lnTo(x0 / pxToMm * pathW, y0 / pxToMm * pathH);
        path.arcTo(radius / pxToMm * pathW, radius / pxToMm * pathH, -1 * stAng * cToDeg, -1 * swAng * cToDeg);
        path.lnTo(xCenter / pxToMm * pathW, yCenter / pxToMm * pathH);
        path.recalculate(gdLst);
        return path;
    },
    _calculateDLbl: function (chartSpace, ser, val) {
        var pxToMm = this.chartProp.pxToMM;
        if (!this.paths.series[val]) {
            return;
        }
        var path = this.paths.series[val].ArrPathCommand;
        var centerX = path[0].X;
        var centerY = path[0].Y;
        var radius = path[2].hR;
        var stAng = path[2].stAng;
        var swAng = path[2].swAng;
        var point = this.chartProp.series[0].val.numRef ? this.chartProp.series[0].val.numRef.numCache.pts[val] : this.chartProp.series[0].val.numLit.pts[val];
        if (!point) {
            return;
        }
        var constMargin = 5 / pxToMm;
        var width = point.compiledDlb.extX;
        var height = point.compiledDlb.extY;
        var tempCenterX, tempCenterY;
        switch (point.compiledDlb.dLblPos) {
        case DLBL_POS_BEST_FIT:
            centerX = centerX + (radius / 2) * Math.cos(-1 * stAng - swAng / 2) - width / 2;
            centerY = centerY - (radius / 2) * Math.sin(-1 * stAng - swAng / 2) - height / 2;
            break;
        case DLBL_POS_CTR:
            centerX = centerX + (radius / 2) * Math.cos(-1 * stAng - swAng / 2) - width / 2;
            centerY = centerY - (radius / 2) * Math.sin(-1 * stAng - swAng / 2) - height / 2;
            break;
        case DLBL_POS_IN_BASE:
            centerX = centerX + (radius / 2) * Math.cos(-1 * stAng - swAng / 2) - width / 2;
            centerY = centerY - (radius / 2) * Math.sin(-1 * stAng - swAng / 2) - height / 2;
            break;
        case DLBL_POS_IN_END:
            tempCenterX = centerX + (radius) * Math.cos(-1 * stAng - swAng / 2);
            tempCenterY = centerY - (radius) * Math.sin(-1 * stAng - swAng / 2);
            if (tempCenterX < centerX && tempCenterY < centerY) {
                centerX = tempCenterX;
                centerY = tempCenterY;
            } else {
                if (tempCenterX > centerX && tempCenterY < centerY) {
                    centerX = tempCenterX - width;
                    centerY = tempCenterY;
                } else {
                    if (tempCenterX < centerX && tempCenterY > centerY) {
                        centerX = tempCenterX;
                        centerY = tempCenterY - height;
                    } else {
                        centerX = tempCenterX - width;
                        centerY = tempCenterY - height;
                    }
                }
            }
            break;
        case DLBL_POS_OUT_END:
            tempCenterX = centerX + (radius) * Math.cos(-1 * stAng - swAng / 2);
            tempCenterY = centerY - (radius) * Math.sin(-1 * stAng - swAng / 2);
            if (tempCenterX < centerX && tempCenterY < centerY) {
                centerX = tempCenterX - width;
                centerY = tempCenterY - height;
            } else {
                if (tempCenterX > centerX && tempCenterY < centerY) {
                    centerX = tempCenterX;
                    centerY = tempCenterY - height;
                } else {
                    if (tempCenterX < centerX && tempCenterY > centerY) {
                        centerX = tempCenterX - width;
                        centerY = tempCenterY;
                    } else {
                        centerX = tempCenterX;
                        centerY = tempCenterY;
                    }
                }
            }
            break;
        }
        if (centerX < 0) {
            centerX = 0;
        }
        if (centerX + width > this.chartProp.widthCanvas / pxToMm) {
            centerX = this.chartProp.widthCanvas / pxToMm - width;
        }
        if (centerY < 0) {
            centerY = 0;
        }
        if (centerY + height > this.chartProp.heightCanvas / pxToMm) {
            centerY = this.chartProp.heightCanvas / pxToMm - height;
        }
        return {
            x: centerX,
            y: centerY
        };
    }
};
function drawDoughnutChart() {
    this.tempAngle = null;
    this.paths = {};
}
drawDoughnutChart.prototype = {
    draw: function (chartProp, cShapeDrawer) {
        this.chartProp = chartProp.calcProp;
        this.cChartDrawer = chartProp;
        this.cShapeDrawer = cShapeDrawer;
        this._drawPie();
    },
    reCalculate: function (chartProp, cShapeDrawer) {
        this.chartProp = chartProp.calcProp;
        this.cChartDrawer = chartProp;
        this.cShapeDrawer = cShapeDrawer;
        this.tempAngle = null;
        this.paths = {};
        this._reCalculatePie();
    },
    _drawPie: function () {
        var brush, pen, val;
        var path;
        var idxPoint, numCache;
        for (var n = 0; n < this.chartProp.series.length; n++) {
            numCache = this.chartProp.series[n].val.numRef ? this.chartProp.series[n].val.numRef.numCache : this.chartProp.series[n].val.numLit;
            if (!numCache) {
                continue;
            }
            for (var k = 0; k < numCache.ptCount; k++) {
                idxPoint = this.cChartDrawer.getIdxPoint(this.chartProp.series[n], k);
                brush = idxPoint ? idxPoint.brush : null;
                pen = idxPoint ? idxPoint.pen : null;
                path = this.paths.series[n][k];
                this.cChartDrawer.drawPath(path, pen, brush);
            }
        }
    },
    _reCalculatePie: function () {
        var trueWidth = this.chartProp.trueWidth;
        var trueHeight = this.chartProp.trueHeight;
        var sumData;
        var outRadius = Math.min(trueHeight, trueWidth) / 2;
        var defaultSize = 50;
        var holeSize = this.cShapeDrawer.chart.plotArea.chart.holeSize ? this.cShapeDrawer.chart.plotArea.chart.holeSize : defaultSize;
        var firstSliceAng = this.cShapeDrawer.chart.plotArea.chart.firstSliceAng ? this.cShapeDrawer.chart.plotArea.chart.firstSliceAng : 0;
        firstSliceAng = (firstSliceAng / 360) * (Math.PI * 2);
        var radius = outRadius * (holeSize / 100);
        var step = (outRadius - radius) / this.chartProp.seriesCount;
        var xCenter = this.chartProp.chartGutter._left + trueWidth / 2;
        var yCenter = this.chartProp.chartGutter._top + trueHeight / 2;
        var numCache, idxPoint, angle, curVal, seriesCounter = 0;
        for (var n = 0; n < this.chartProp.series.length; n++) {
            this.tempAngle = Math.PI / 2;
            numCache = this.chartProp.series[n].val.numRef ? this.chartProp.series[n].val.numRef.numCache : this.chartProp.series[n].val.numLit;
            if (!numCache || this.chartProp.series[n].isHidden) {
                continue;
            }
            sumData = this.cChartDrawer._getSumArray(numCache.pts, true);
            for (var k = numCache.ptCount - 1; k >= 0; k--) {
                idxPoint = this.cChartDrawer.getIdxPoint(this.chartProp.series[n], k);
                curVal = idxPoint ? idxPoint.val : 0;
                angle = Math.abs((parseFloat(curVal / sumData)) * (Math.PI * 2));
                if (!this.paths.series) {
                    this.paths.series = [];
                }
                if (!this.paths.series[n]) {
                    this.paths.series[n] = [];
                }
                if (angle) {
                    this.paths.series[n][k] = this._calculateSegment(angle, radius, xCenter, yCenter, radius + step * (seriesCounter + 1), radius + step * seriesCounter, firstSliceAng);
                } else {
                    this.paths.series[n][k] = null;
                }
            }
            if (numCache.pts.length) {
                seriesCounter++;
            }
        }
    },
    _calculateSegment: function (angle, radius, xCenter, yCenter, radius1, radius2, firstSliceAng) {
        var startAngle = this.tempAngle - firstSliceAng;
        var endAngle = angle;
        if (radius < 0) {
            radius = 0;
        }
        var path = this._calculateArc(radius, startAngle, endAngle, xCenter, yCenter, radius1, radius2);
        this.tempAngle += angle;
        return path;
    },
    _calculateArc: function (radius, stAng, swAng, xCenter, yCenter, radius1, radius2) {
        var path = new Path();
        var pathH = this.chartProp.pathH;
        var pathW = this.chartProp.pathW;
        var gdLst = [];
        path.pathH = pathH;
        path.pathW = pathW;
        gdLst["w"] = 1;
        gdLst["h"] = 1;
        var pxToMm = this.chartProp.pxToMM;
        var x2 = xCenter + radius1 * Math.cos(stAng);
        var y2 = yCenter - radius1 * Math.sin(stAng);
        var x1 = xCenter + radius2 * Math.cos(stAng);
        var y1 = yCenter - radius2 * Math.sin(stAng);
        var x3 = xCenter + radius1 * Math.cos(stAng + swAng);
        var y3 = yCenter - radius1 * Math.sin(stAng + swAng);
        var x4 = xCenter + radius2 * Math.cos(stAng + swAng);
        var y4 = yCenter - radius2 * Math.sin(stAng + swAng);
        path.moveTo(x1 / pxToMm * pathW, y1 / pxToMm * pathH);
        path.lnTo(x2 / pxToMm * pathW, y2 / pxToMm * pathH);
        path.arcTo(radius1 / pxToMm * pathW, radius1 / pxToMm * pathH, -1 * stAng * cToDeg, -1 * swAng * cToDeg);
        path.lnTo(x4 / pxToMm * pathW, y4 / pxToMm * pathH);
        path.arcTo(radius2 / pxToMm * pathW, radius2 / pxToMm * pathH, -1 * stAng * cToDeg - swAng * cToDeg, swAng * cToDeg);
        path.moveTo(xCenter / pxToMm * pathW, yCenter / pxToMm * pathH);
        path.recalculate(gdLst);
        return path;
    },
    _calculateDLbl: function (chartSpace, ser, val) {
        var pxToMm = this.chartProp.pxToMM;
        if (!this.paths.series[ser][val]) {
            return;
        }
        var path = this.paths.series[ser][val].ArrPathCommand;
        var x1 = path[0].X;
        var y1 = path[0].Y;
        var x2 = path[1].X;
        var y2 = path[1].Y;
        var radius1 = path[2].hR;
        var stAng = path[2].stAng;
        var swAng = path[2].swAng;
        var radius2 = path[4].hR;
        var xCenter = path[5].X;
        var yCenter = path[5].Y;
        var newRadius = radius2 + (radius1 - radius2) / 2;
        var centerX = xCenter + newRadius * Math.cos(-1 * stAng - swAng / 2);
        var centerY = yCenter - newRadius * Math.sin(-1 * stAng - swAng / 2);
        var point = this.chartProp.series[ser].val.numRef ? this.chartProp.series[ser].val.numRef.numCache.pts[val] : this.chartProp.series[ser].val.numLit.pts[val];
        if (!point) {
            return;
        }
        var width = point.compiledDlb.extX;
        var height = point.compiledDlb.extY;
        switch (point.compiledDlb.dLblPos) {
        case DLBL_POS_CTR:
            centerX = centerX - width / 2;
            centerY = centerY - height / 2;
            break;
        case DLBL_POS_IN_BASE:
            centerX = centerX - width / 2;
            centerY = centerY - height / 2;
            break;
        }
        if (centerX < 0) {
            centerX = 0;
        }
        if (centerY < 0) {
            centerY = 0;
        }
        return {
            x: centerX,
            y: centerY
        };
    }
};
function drawRadarChart() {
    this.chartProp = null;
    this.cChartDrawer = null;
    this.cShapeDrawer = null;
    this.cChartSpace = null;
    this.paths = {};
}
drawRadarChart.prototype = {
    draw: function (chartProp, cShapeDrawer) {
        this.chartProp = chartProp.calcProp;
        this.cChartDrawer = chartProp;
        this.cShapeDrawer = cShapeDrawer;
        this._drawLines();
    },
    reCalculate: function (chartProp, cChartSpace) {
        this.paths = {};
        this.chartProp = chartProp.calcProp;
        this.cChartDrawer = chartProp;
        this.cChartSpace = cChartSpace;
        this._calculateLines();
    },
    _calculateLines: function () {
        var xPoints = this.cChartSpace.chart.plotArea.catAx.xPoints;
        var yPoints = this.cChartSpace.chart.plotArea.valAx.yPoints;
        var trueWidth = this.chartProp.trueWidth;
        var trueHeight = this.chartProp.trueHeight;
        var xCenter = (this.chartProp.chartGutter._left + trueWidth / 2) / this.chartProp.pxToMM;
        var yCenter = (this.chartProp.chartGutter._top + trueHeight / 2) / this.chartProp.pxToMM;
        var y, y1, x, x1, val, nextVal, tempVal, seria, dataSeries;
        var numCache = this.chartProp.series[0].val.numRef ? this.chartProp.series[0].val.numRef.numCache.pts : this.chartProp.series[0].val.numLit.pts;
        var tempAngle = 2 * Math.PI / numCache.length;
        var xDiff = ((trueHeight / 2) / yPoints.length) / this.chartProp.pxToMM;
        var radius, radius1, xFirst, yFirst;
        for (var i = 0; i < this.chartProp.series.length; i++) {
            seria = this.chartProp.series[i];
            dataSeries = seria.val.numRef ? seria.val.numRef.numCache.pts : seria.val.numLit.pts;
            if (dataSeries.length == 1) {
                n = 0;
                val = this._getYVal(n, i);
                y = val * xDiff;
                x = xCenter;
                radius = y;
                y = yCenter - radius * Math.cos(n * tempAngle);
                x = x + radius * Math.sin(n * tempAngle);
                if (!this.paths.points) {
                    this.paths.points = [];
                }
                if (!this.paths.points[i]) {
                    this.paths.points[i] = [];
                }
                this.paths.points[i][n] = this.cChartDrawer.calculatePoint(x, y, dataSeries[n].compiledMarker.size, dataSeries[n].compiledMarker.symbol);
            } else {
                for (var n = 0; n < dataSeries.length - 1; n++) {
                    val = this._getYVal(n, i);
                    nextVal = this._getYVal(n + 1, i);
                    y = val * xDiff;
                    y1 = nextVal * xDiff;
                    x = xCenter;
                    x1 = xCenter;
                    radius = y;
                    radius1 = y1;
                    y = yCenter - radius * Math.cos(n * tempAngle);
                    y1 = yCenter - radius1 * Math.cos((n + 1) * tempAngle);
                    x = x + radius * Math.sin(n * tempAngle);
                    x1 = x1 + radius1 * Math.sin((n + 1) * tempAngle);
                    if (!this.paths.series) {
                        this.paths.series = [];
                    }
                    if (!this.paths.series[i]) {
                        this.paths.series[i] = [];
                    }
                    this.paths.series[i][n] = this._calculateLine(x, y, x1, y1);
                    if (n == 0) {
                        xFirst = x;
                        yFirst = y;
                    }
                    if (n == dataSeries.length - 2) {
                        this.paths.series[i][n + 1] = this._calculateLine(x1, y1, xFirst, yFirst);
                    }
                    if (!this.paths.points) {
                        this.paths.points = [];
                    }
                    if (!this.paths.points[i]) {
                        this.paths.points[i] = [];
                    }
                    if (dataSeries[n].compiledMarker) {
                        if (n == 0) {
                            this.paths.points[i][n] = this.cChartDrawer.calculatePoint(x, y, dataSeries[n].compiledMarker.size, dataSeries[n].compiledMarker.symbol);
                            this.paths.points[i][n + 1] = this.cChartDrawer.calculatePoint(x1, y1, dataSeries[n + 1].compiledMarker.size, dataSeries[n + 1].compiledMarker.symbol);
                        } else {
                            this.paths.points[i][n + 1] = this.cChartDrawer.calculatePoint(x1, y1, dataSeries[n + 1].compiledMarker.size, dataSeries[n + 1].compiledMarker.symbol);
                        }
                    }
                }
            }
        }
    },
    _getYPosition: function (val, yPoints) {
        var result;
        var resPos;
        var resVal;
        var diffVal;
        if (val < yPoints[0].val) {
            resPos = Math.abs(yPoints[1].pos - yPoints[0].pos);
            resVal = yPoints[1].val - yPoints[0].val;
            diffVal = Math.abs(yPoints[0].val) - Math.abs(val);
            result = yPoints[0].pos - Math.abs((diffVal / resVal) * resPos);
        } else {
            if (val > yPoints[yPoints.length - 1].val) {
                resPos = Math.abs(yPoints[1].pos - yPoints[0].pos);
                resVal = yPoints[1].val - yPoints[0].val;
                diffVal = Math.abs(yPoints[0].val) - Math.abs(val);
                result = yPoints[0].pos + (diffVal / resVal) * resPos;
            } else {
                for (var s = 0; s < yPoints.length; s++) {
                    if (val >= yPoints[s].val && val <= yPoints[s + 1].val) {
                        resPos = Math.abs(yPoints[s + 1].pos - yPoints[s].pos);
                        resVal = yPoints[s + 1].val - yPoints[s].val;
                        result = -(resPos / resVal) * (Math.abs(val - yPoints[s].val)) + yPoints[s].pos;
                        break;
                    }
                }
            }
        }
        return result;
    },
    _calculateDLbl: function (chartSpace, ser, val) {
        var numCache = this.chartProp.series[ser].val.numRef ? this.chartProp.series[ser].val.numRef.numCache : this.chartProp.series[ser].val.numLit;
        var point = numCache.pts[val];
        var path;
        if (this.paths.series) {
            if (val == numCache.pts.length - 1) {
                path = this.paths.series[ser][val - 1].ArrPathCommand[1];
            } else {
                path = this.paths.series[ser][val].ArrPathCommand[0];
            }
        } else {
            if (this.paths.points) {
                path = this.paths.points[ser][val].path.ArrPathCommand[0];
            }
        }
        if (!path) {
            return;
        }
        var x = path.X;
        var y = path.Y;
        var pxToMm = this.chartProp.pxToMM;
        var constMargin = 5 / pxToMm;
        var width = point.compiledDlb.extX;
        var height = point.compiledDlb.extY;
        var centerX = x - width / 2;
        var centerY = y - height / 2;
        switch (point.compiledDlb.dLblPos) {
        case DLBL_POS_B:
            centerY = centerY + height / 2 + constMargin;
            break;
        case DLBL_POS_BEST_FIT:
            break;
        case DLBL_POS_CTR:
            break;
        case DLBL_POS_L:
            centerX = centerX - width / 2 - constMargin;
            break;
        case DLBL_POS_R:
            centerX = centerX + width / 2 + constMargin;
            break;
        case DLBL_POS_T:
            centerY = centerY - height / 2 - constMargin;
            break;
        }
        if (centerX < 0) {
            centerX = 0;
        }
        if (centerX + width > this.chartProp.widthCanvas / pxToMm) {
            centerX = this.chartProp.widthCanvas / pxToMm - width;
        }
        if (centerY < 0) {
            centerY = 0;
        }
        if (centerY + height > this.chartProp.heightCanvas / pxToMm) {
            centerY = this.chartProp.heightCanvas / pxToMm - height;
        }
        return {
            x: centerX,
            y: centerY
        };
    },
    _drawLines: function (isRedraw) {
        var brush, pen, dataSeries, seria, markerBrush, markerPen, numCache;
        for (var i = 0; i < this.chartProp.series.length; i++) {
            seria = this.chartProp.series[i];
            brush = seria.brush;
            pen = seria.pen;
            numCache = seria.val.numRef ? seria.val.numRef.numCache : seria.val.numLit;
            dataSeries = numCache.pts;
            for (var n = 0; n < dataSeries.length - 1; n++) {
                if (numCache.pts[n].pen) {
                    pen = numCache.pts[n].pen;
                }
                if (numCache.pts[n].brush) {
                    brush = numCache.pts[n].brush;
                }
                this.cChartDrawer.drawPath(this.paths.series[i][n], pen, brush);
                if (n == dataSeries.length - 2 && this.paths.series[i][n + 1]) {
                    this.cChartDrawer.drawPath(this.paths.series[i][n + 1], pen, brush);
                }
            }
            for (var k = 0; k < this.paths.points[i].length; k++) {
                markerBrush = numCache.pts[k].compiledMarker.brush;
                markerPen = numCache.pts[k].compiledMarker.pen;
                if (this.paths.points[i][0].framePaths) {
                    this.cChartDrawer.drawPath(this.paths.points[i][k].framePaths, markerPen, markerBrush, false);
                }
                this.cChartDrawer.drawPath(this.paths.points[i][k].path, markerPen, markerBrush, true);
            }
        }
    },
    _getYVal: function (n, i) {
        var tempVal;
        var val = 0;
        var numCache;
        if (this.chartProp.subType == "stacked") {
            for (var k = 0; k <= i; k++) {
                numCache = this.chartProp.series[k].val.numRef ? this.chartProp.series[k].val.numRef.numCache : this.chartProp.series[k].val.numLit;
                tempVal = parseFloat(numCache.pts[n].val);
                if (tempVal) {
                    val += tempVal;
                }
            }
        } else {
            if (this.chartProp.subType == "stackedPer") {
                var summVal = 0;
                for (var k = 0; k < this.chartProp.series.length; k++) {
                    numCache = this.chartProp.series[k].val.numRef ? this.chartProp.series[k].val.numRef.numCache : this.chartProp.series[k].val.numLit;
                    tempVal = parseFloat(numCache.pts[n].val);
                    if (tempVal) {
                        if (k <= i) {
                            val += tempVal;
                        }
                        summVal += Math.abs(tempVal);
                    }
                }
                val = val / summVal;
            } else {
                numCache = this.chartProp.series[i].val.numRef ? this.chartProp.series[i].val.numRef.numCache : this.chartProp.series[i].val.numLit;
                val = parseFloat(numCache.pts[n].val);
            }
        }
        return val;
    },
    _calculateLine: function (x, y, x1, y1) {
        var path = new Path();
        var pathH = this.chartProp.pathH;
        var pathW = this.chartProp.pathW;
        var gdLst = [];
        path.pathH = pathH;
        path.pathW = pathW;
        gdLst["w"] = 1;
        gdLst["h"] = 1;
        path.moveTo(x * pathW, y * pathH);
        path.lnTo(x1 * pathW, y1 * pathH);
        path.recalculate(gdLst);
        return path;
    }
};
function drawScatterChart() {
    this.chartProp = null;
    this.cChartDrawer = null;
    this.cShapeDrawer = null;
    this.paths = {};
}
drawScatterChart.prototype = {
    reCalculate: function (chartProp, cShapeDrawer) {
        this.chartProp = chartProp.calcProp;
        this.cChartDrawer = chartProp;
        this.cShapeDrawer = cShapeDrawer;
        this.cChartSpace = cShapeDrawer;
        this.paths = {};
        this._recalculateScatter();
    },
    draw: function (chartProp, cShapeDrawer) {
        this.chartProp = chartProp.calcProp;
        this.cChartDrawer = chartProp;
        this.cShapeDrawer = cShapeDrawer;
        this.cChartSpace = cShapeDrawer;
        this._drawScatter();
    },
    _calculateLines: function () {
        var xPoints = this.cChartSpace.chart.plotArea.catAx.xPoints;
        var yPoints = this.cChartSpace.chart.plotArea.valAx.yPoints;
        var points;
        var y, y1, y2, y3, x, x1, x2, x3, val, nextVal, tempVal, seria, dataSeries, compiledMarkerSize, compiledMarkerSymbol, idx, numCache;
        for (var i = 0; i < this.chartProp.series.length; i++) {
            seria = this.chartProp.series[i];
            numCache = seria.val.numRef ? seria.val.numRef.numCache : seria.val.numLit;
            dataSeries = numCache.pts;
            for (var n = 0; n < numCache.ptCount; n++) {
                idx = dataSeries[n] && dataSeries[n].idx != null ? dataSeries[n].idx : n;
                val = this._getYVal(n, i);
                x = xPoints[n].pos;
                y = this.cChartDrawer.getYPosition(val, yPoints);
                if (!this.paths.points) {
                    this.paths.points = [];
                }
                if (!this.paths.points[i]) {
                    this.paths.points[i] = [];
                }
                if (!points) {
                    points = [];
                }
                if (!points[i]) {
                    points[i] = [];
                }
                compiledMarkerSize = dataSeries[n] && dataSeries[n].compiledMarker && dataSeries[n].compiledMarker.size ? dataSeries[n].compiledMarker.size : null;
                compiledMarkerSymbol = dataSeries[n] && dataSeries[n].compiledMarker && dataSeries[n].compiledMarker.symbol ? dataSeries[n].compiledMarker.symbol : null;
                if (val != null) {
                    this.paths.points[i][n] = this.cChartDrawer.calculatePoint(x, y, compiledMarkerSize, compiledMarkerSymbol);
                    points[i][n] = {
                        x: x,
                        y: y
                    };
                } else {
                    this.paths.points[i][n] = null;
                    points[i][n] = null;
                }
            }
        }
        this._calculateAllLines(points);
    },
    _recalculateScatter: function () {
        var xPoints = this.cShapeDrawer.chart.plotArea.catAx.xPoints;
        var yPoints = this.cShapeDrawer.chart.plotArea.valAx.yPoints;
        var trueHeight = this.chartProp.trueHeight;
        var trueWidth = this.chartProp.trueWidth;
        var minOy = this.chartProp.ymin;
        var maxOy = this.chartProp.ymax;
        var maxOx = this.chartProp.xScale[this.chartProp.xScale.length - 1];
        var minOx = this.chartProp.xScale[0];
        var digHeightOy = Math.abs(maxOy - minOy);
        var digHeightOx = Math.abs(maxOx - minOx);
        var koffX = trueWidth / digHeightOx;
        var koffY = trueHeight / digHeightOy;
        var nullPositionOX = this.chartProp.nullPositionOX / this.chartProp.pxToMM;
        var seria, yVal, xVal, points, x, x1, y, y1, yNumCache, xNumCache, compiledMarkerSize, compiledMarkerSymbol, idxPoint;
        for (var i = 0; i < this.chartProp.series.length; i++) {
            seria = this.chartProp.series[i];
            yNumCache = seria.yVal.numRef && seria.yVal.numRef.numCache ? seria.yVal.numRef.numCache : seria.yVal && seria.yVal.numLit ? seria.yVal.numLit : null;
            if (!yNumCache) {
                continue;
            }
            for (var n = 0; n < yNumCache.ptCount; n++) {
                yVal = this._getYVal(n, i);
                xNumCache = seria.xVal && seria.xVal.numRef ? seria.xVal.numRef.numCache : seria.xVal && seria.xVal.numLit ? seria.xVal.numLit : null;
                if (xNumCache && xNumCache.pts[n] && xNumCache.pts[n].val) {
                    if (!isNaN(parseFloat(xNumCache.pts[n].val))) {
                        xVal = parseFloat(xNumCache.pts[n].val);
                    } else {
                        xVal = n + 1;
                    }
                } else {
                    xVal = n + 1;
                }
                idxPoint = this.cChartDrawer.getIdxPoint(seria, n);
                compiledMarkerSize = idxPoint && idxPoint.compiledMarker ? idxPoint.compiledMarker.size : null;
                compiledMarkerSymbol = idxPoint && idxPoint.compiledMarker ? idxPoint.compiledMarker.symbol : null;
                if (!this.paths.points) {
                    this.paths.points = [];
                }
                if (!this.paths.points[i]) {
                    this.paths.points[i] = [];
                }
                if (!points) {
                    points = [];
                }
                if (!points[i]) {
                    points[i] = [];
                }
                if (yVal != null) {
                    this.paths.points[i][n] = this.cChartDrawer.calculatePoint(this.cChartDrawer.getYPosition(xVal, xPoints, true), this.cChartDrawer.getYPosition(yVal, yPoints), compiledMarkerSize, compiledMarkerSymbol);
                    points[i][n] = {
                        x: xVal,
                        y: yVal
                    };
                } else {
                    this.paths.points[i][n] = null;
                    points[i][n] = null;
                }
            }
        }
        this._calculateAllLines(points);
    },
    _calculateAllLines: function (points) {
        var startPoint, endPoint;
        var xPoints = this.cChartSpace.chart.plotArea.catAx.xPoints;
        var yPoints = this.cChartSpace.chart.plotArea.valAx.yPoints;
        var x, y, x1, y1, isSplineLine;
        for (var i = 0; i < points.length; i++) {
            isSplineLine = this.chartProp.series[i].smooth;
            if (!points[i]) {
                continue;
            }
            for (var n = 0; n < points[i].length; n++) {
                if (!this.paths.series) {
                    this.paths.series = [];
                }
                if (!this.paths.series[i]) {
                    this.paths.series[i] = [];
                }
                if (points[i][n] != null && points[i][n + 1] != null) {
                    if (isSplineLine) {
                        this.paths.series[i][n] = this._calculateSplineLine(points[i], n, xPoints, yPoints);
                    } else {
                        x = this.cChartDrawer.getYPosition(points[i][n].x, xPoints, true);
                        y = this.cChartDrawer.getYPosition(points[i][n].y, yPoints);
                        x1 = this.cChartDrawer.getYPosition(points[i][n + 1].x, xPoints, true);
                        y1 = this.cChartDrawer.getYPosition(points[i][n + 1].y, yPoints);
                        this.paths.series[i][n] = this._calculateLine(x, y, x1, y1);
                    }
                }
            }
        }
    },
    _getYVal: function (n, i) {
        var val = 0;
        var numCache;
        var idxPoint;
        numCache = this.chartProp.series[i].yVal.numRef ? this.chartProp.series[i].yVal.numRef.numCache : this.chartProp.series[i].yVal.numLit;
        idxPoint = this.cChartDrawer.getIdxPoint(this.chartProp.series[i], n);
        val = idxPoint ? parseFloat(idxPoint.val) : null;
        return val;
    },
    _drawScatter: function (isRedraw) {
        var brush, pen, dataSeries, seria, markerBrush, markerPen, numCache;
        this.cShapeDrawer.Graphics.SaveGrState();
        this.cShapeDrawer.Graphics.AddClipRect(this.chartProp.chartGutter._left / this.chartProp.pxToMM, (this.chartProp.chartGutter._top - 2) / this.chartProp.pxToMM, this.chartProp.trueWidth / this.chartProp.pxToMM, this.chartProp.trueHeight / this.chartProp.pxToMM);
        for (var i = 0; i < this.paths.series.length; i++) {
            seria = this.chartProp.series[i];
            brush = seria.brush;
            pen = seria.pen;
            numCache = seria.yVal.numRef ? seria.yVal.numRef.numCache : seria.yVal.numLit;
            dataSeries = this.paths.series[i];
            if (!dataSeries) {
                continue;
            }
            for (var n = 0; n < dataSeries.length; n++) {
                if (numCache.pts[n + 1] && numCache.pts[n + 1].pen) {
                    pen = numCache.pts[n + 1].pen;
                }
                if (numCache.pts[n + 1] && numCache.pts[n + 1].brush) {
                    brush = numCache.pts[n + 1].brush;
                }
                this.cChartDrawer.drawPath(this.paths.series[i][n], pen, brush);
            }
            for (var k = 0; k < this.paths.points[i].length; k++) {
                if (numCache.pts[k]) {
                    markerBrush = numCache.pts[k].compiledMarker ? numCache.pts[k].compiledMarker.brush : null;
                    markerPen = numCache.pts[k].compiledMarker ? numCache.pts[k].compiledMarker.pen : null;
                }
                if (this.paths.points[i][0] && this.paths.points[i][0].framePaths) {
                    this.cChartDrawer.drawPath(this.paths.points[i][k].framePaths, markerPen, markerBrush, false);
                }
                if (this.paths.points[i][k]) {
                    this.cChartDrawer.drawPath(this.paths.points[i][k].path, markerPen, markerBrush, true);
                }
            }
        }
        this.cShapeDrawer.Graphics.RestoreGrState();
    },
    _getYPosition: function (val, yPoints, isOx) {
        var result;
        var resPos;
        var resVal;
        var diffVal;
        if (val < yPoints[0].val) {
            resPos = Math.abs(yPoints[1].pos - yPoints[0].pos);
            resVal = yPoints[1].val - yPoints[0].val;
            diffVal = Math.abs(yPoints[0].val) - Math.abs(val);
            result = yPoints[0].pos - Math.abs((diffVal / resVal) * resPos);
        } else {
            if (val > yPoints[yPoints.length - 1].val) {
                resPos = Math.abs(yPoints[1].pos - yPoints[0].pos);
                resVal = yPoints[1].val - yPoints[0].val;
                diffVal = Math.abs(yPoints[0].val) - Math.abs(val);
                result = yPoints[0].pos + (diffVal / resVal) * resPos;
            } else {
                for (var s = 0; s < yPoints.length; s++) {
                    if (val >= yPoints[s].val && val <= yPoints[s + 1].val) {
                        resPos = Math.abs(yPoints[s + 1].pos - yPoints[s].pos);
                        resVal = yPoints[s + 1].val - yPoints[s].val;
                        if (!isOx) {
                            result = -(resPos / resVal) * (Math.abs(val - yPoints[s].val)) + yPoints[s].pos;
                        } else {
                            result = (resPos / resVal) * (Math.abs(val - yPoints[s].val)) + yPoints[s].pos;
                        }
                        break;
                    }
                }
            }
        }
        return result;
    },
    _calculateLine: function (x, y, x1, y1) {
        var path = new Path();
        var pathH = this.chartProp.pathH;
        var pathW = this.chartProp.pathW;
        var gdLst = [];
        path.pathH = pathH;
        path.pathW = pathW;
        gdLst["w"] = 1;
        gdLst["h"] = 1;
        path.moveTo(x * pathH, y * pathW);
        path.lnTo(x1 * pathH, y1 * pathW);
        path.recalculate(gdLst);
        return path;
    },
    _calculateDLbl: function (chartSpace, ser, val) {
        var point = this.cChartDrawer.getIdxPoint(this.chartProp.series[ser], val);
        var path;
        if (this.paths.points) {
            if (this.paths.points[ser] && this.paths.points[ser][val]) {
                path = this.paths.points[ser][val].path.ArrPathCommand[0];
            }
        }
        if (!path) {
            return;
        }
        var x = path.X;
        var y = path.Y;
        var pxToMm = this.chartProp.pxToMM;
        var constMargin = 5 / pxToMm;
        var width = point.compiledDlb.extX;
        var height = point.compiledDlb.extY;
        var centerX = x - width / 2;
        var centerY = y - height / 2;
        switch (point.compiledDlb.dLblPos) {
        case DLBL_POS_B:
            centerY = centerY + height / 2 + constMargin;
            break;
        case DLBL_POS_BEST_FIT:
            break;
        case DLBL_POS_CTR:
            break;
        case DLBL_POS_L:
            centerX = centerX - width / 2 - constMargin;
            break;
        case DLBL_POS_R:
            centerX = centerX + width / 2 + constMargin;
            break;
        case DLBL_POS_T:
            centerY = centerY - height / 2 - constMargin;
            break;
        }
        if (centerX < 0) {
            centerX = 0;
        }
        if (centerX + width > this.chartProp.widthCanvas / pxToMm) {
            centerX = this.chartProp.widthCanvas / pxToMm - width;
        }
        if (centerY < 0) {
            centerY = 0;
        }
        if (centerY + height > this.chartProp.heightCanvas / pxToMm) {
            centerY = this.chartProp.heightCanvas / pxToMm - height;
        }
        return {
            x: centerX,
            y: centerY
        };
    },
    _calculateSplineLine: function (points, k, xPoints, yPoints) {
        var path = new Path();
        var splineCoords;
        var pathH = this.chartProp.pathH;
        var pathW = this.chartProp.pathW;
        var gdLst = [];
        path.pathH = pathH;
        path.pathW = pathW;
        gdLst["w"] = 1;
        gdLst["h"] = 1;
        var x = points[k - 1] ? points[k - 1].x : points[k].x;
        var y = points[k - 1] ? points[k - 1].y : points[k].y;
        var x1 = points[k].x;
        var y1 = points[k].y;
        var x2 = points[k + 1] ? points[k + 1].x : points[k].x;
        var y2 = points[k + 1] ? points[k + 1].y : points[k].y;
        var x3 = points[k + 2] ? points[k + 2].x : points[k + 1] ? points[k + 1].x : points[k].x;
        var y3 = points[k + 2] ? points[k + 2].y : points[k + 1] ? points[k + 1].y : points[k].y;
        var splineCoords = this.cChartDrawer.calculate_Bezier(x, y, x1, y1, x2, y2, x3, y3, i);
        x = this.cChartDrawer.getYPosition(splineCoords[0].x, xPoints, true);
        y = this.cChartDrawer.getYPosition(splineCoords[0].y, yPoints);
        x1 = this.cChartDrawer.getYPosition(splineCoords[1].x, xPoints, true);
        y1 = this.cChartDrawer.getYPosition(splineCoords[1].y, yPoints);
        x2 = this.cChartDrawer.getYPosition(splineCoords[2].x, xPoints, true);
        y2 = this.cChartDrawer.getYPosition(splineCoords[2].y, yPoints);
        x3 = this.cChartDrawer.getYPosition(splineCoords[3].x, xPoints, true);
        y3 = this.cChartDrawer.getYPosition(splineCoords[3].y, yPoints);
        path.moveTo(x * pathW, y * pathH);
        path.cubicBezTo(x1 * pathW, y1 * pathH, x2 * pathW, y2 * pathH, x3 * pathW, y3 * pathH);
        path.recalculate(gdLst);
        return path;
    }
};
function drawStockChart() {
    this.chartProp = null;
    this.cChartDrawer = null;
    this.cShapeDrawer = null;
    this.cChartSpace = null;
    this.paths = {};
}
drawStockChart.prototype = {
    draw: function (chartProp, cShapeDrawer, chartSpace) {
        this.chartProp = chartProp.calcProp;
        this.cChartDrawer = chartProp;
        this.cShapeDrawer = cShapeDrawer;
        this.cChartSpace = chartSpace;
        this._drawLines();
    },
    reCalculate: function (chartProp, cChartSpace) {
        this.paths = {};
        this.chartProp = chartProp.calcProp;
        this.cChartDrawer = chartProp;
        this.cChartSpace = cChartSpace;
        this._calculateLines();
    },
    _calculateLines: function () {
        var xPoints = this.cChartSpace.chart.plotArea.catAx.xPoints;
        var yPoints = this.cChartSpace.chart.plotArea.valAx.yPoints;
        var trueWidth = this.chartProp.trueWidth;
        var numCache = this.chartProp.series[0].val.numRef ? this.chartProp.series[0].val.numRef.numCache : this.chartProp.series[0].val.numLit;
        var koffX = trueWidth / numCache.pts.length;
        var gapWidth = this.cChartSpace.chart.plotArea.chart.upDownBars && this.cChartSpace.chart.plotArea.chart.upDownBars.gapWidth ? this.cChartSpace.chart.plotArea.chart.upDownBars.gapWidth : 150;
        var widthBar = koffX / (1 + gapWidth / 100);
        var val1, val2, val3, val4, xVal, yVal1, yVal2, yVal3, yVal4, curNumCache, lastNamCache;
        for (var i = 0; i < numCache.pts.length; i++) {
            val1 = null,
            val2 = null,
            val3 = null,
            val4 = null;
            val1 = numCache.pts[i].val;
            lastNamCache = this.chartProp.series[this.chartProp.series.length - 1].val.numRef ? this.chartProp.series[this.chartProp.series.length - 1].val.numRef.numCache.pts : this.chartProp.series[this.chartProp.series.length - 1].val.pts;
            val4 = lastNamCache[i] ? lastNamCache[i].val : null;
            for (var k = 1; k < this.chartProp.series.length - 1; k++) {
                curNumCache = this.chartProp.series[k].val.numRef ? this.chartProp.series[k].val.numRef.numCache : this.chartProp.series[k].val.numLit;
                if (curNumCache.pts[i]) {
                    if (k == 1) {
                        val2 = curNumCache.pts[i].val;
                        val3 = curNumCache.pts[i].val;
                    } else {
                        if (parseFloat(val2) > parseFloat(curNumCache.pts[i].val)) {
                            val2 = curNumCache.pts[i].val;
                        }
                        if (parseFloat(val3) < parseFloat(curNumCache.pts[i].val)) {
                            val3 = curNumCache.pts[i].val;
                        }
                    }
                }
            }
            if (!this.paths.values) {
                this.paths.values = [];
            }
            if (!this.paths.values[i]) {
                this.paths.values[i] = {};
            }
            xVal = this.cChartDrawer.getYPosition(i, xPoints, true);
            yVal1 = this.cChartDrawer.getYPosition(val1, yPoints);
            yVal2 = this.cChartDrawer.getYPosition(val2, yPoints);
            yVal3 = this.cChartDrawer.getYPosition(val3, yPoints);
            yVal4 = this.cChartDrawer.getYPosition(val4, yPoints);
            if (val2 !== null && val1 !== null) {
                this.paths.values[i].lowLines = this._calculateLine(xVal, yVal2, xVal, yVal1);
            }
            if (val3 && val4) {
                this.paths.values[i].highLines = this._calculateLine(xVal, yVal4, xVal, yVal3);
            }
            if (val1 !== null && val4 !== null) {
                if (parseFloat(val1) > parseFloat(val4)) {
                    this.paths.values[i].downBars = this._calculateUpDownBars(xVal, yVal1, xVal, yVal4, widthBar / this.chartProp.pxToMM);
                } else {
                    if (val1 && val4) {
                        this.paths.values[i].upBars = this._calculateUpDownBars(xVal, yVal1, xVal, yVal4, widthBar / this.chartProp.pxToMM);
                    }
                }
            }
        }
    },
    _getYPosition: function (val, yPoints, isOx) {
        var result;
        var resPos;
        var resVal;
        var diffVal;
        if (val < yPoints[0].val) {
            resPos = Math.abs(yPoints[1].pos - yPoints[0].pos);
            resVal = yPoints[1].val - yPoints[0].val;
            diffVal = Math.abs(yPoints[0].val) - Math.abs(val);
            result = yPoints[0].pos - Math.abs((diffVal / resVal) * resPos);
        } else {
            if (val > yPoints[yPoints.length - 1].val) {
                resPos = Math.abs(yPoints[1].pos - yPoints[0].pos);
                resVal = yPoints[1].val - yPoints[0].val;
                diffVal = Math.abs(yPoints[0].val) - Math.abs(val);
                result = yPoints[0].pos + (diffVal / resVal) * resPos;
            } else {
                for (var s = 0; s < yPoints.length; s++) {
                    if (val >= yPoints[s].val && val <= yPoints[s + 1].val) {
                        resPos = Math.abs(yPoints[s + 1].pos - yPoints[s].pos);
                        resVal = yPoints[s + 1].val - yPoints[s].val;
                        if (!isOx) {
                            result = -(resPos / resVal) * (Math.abs(val - yPoints[s].val)) + yPoints[s].pos;
                        } else {
                            result = (resPos / resVal) * (Math.abs(val - yPoints[s].val)) + yPoints[s].pos;
                        }
                        break;
                    }
                }
            }
        }
        return result;
    },
    _drawLines: function (isRedraw) {
        var brush;
        var pen;
        var dataSeries;
        var seria;
        var numCache = this.chartProp.series[0].val.numRef ? this.chartProp.series[0].val.numRef.numCache : this.chartProp.series[0].val.numLit;
        for (var i = 0; i < numCache.pts.length; i++) {
            pen = this.cChartSpace.chart.plotArea.chart.calculatedHiLowLines;
            this.cChartDrawer.drawPath(this.paths.values[i].lowLines, pen, brush);
            this.cChartDrawer.drawPath(this.paths.values[i].highLines, pen, brush);
            if (this.paths.values[i].downBars) {
                brush = this.cChartSpace.chart.plotArea.chart.upDownBars ? this.cChartSpace.chart.plotArea.chart.upDownBars.downBarsBrush : null;
                pen = this.cChartSpace.chart.plotArea.chart.upDownBars ? this.cChartSpace.chart.plotArea.chart.upDownBars.downBarsPen : null;
                this.cChartDrawer.drawPath(this.paths.values[i].downBars, pen, brush);
            } else {
                brush = this.cChartSpace.chart.plotArea.chart.upDownBars ? this.cChartSpace.chart.plotArea.chart.upDownBars.upBarsBrush : null;
                pen = this.cChartSpace.chart.plotArea.chart.upDownBars ? this.cChartSpace.chart.plotArea.chart.upDownBars.upBarsPen : null;
                this.cChartDrawer.drawPath(this.paths.values[i].upBars, pen, brush);
            }
        }
    },
    _calculateLine: function (x, y, x1, y1) {
        var path = new Path();
        var pathH = this.chartProp.pathH;
        var pathW = this.chartProp.pathW;
        var gdLst = [];
        path.pathH = pathH;
        path.pathW = pathW;
        gdLst["w"] = 1;
        gdLst["h"] = 1;
        path.moveTo(x * pathW, y * pathH);
        path.lnTo(x1 * pathW, y1 * pathH);
        path.recalculate(gdLst);
        return path;
    },
    _calculateDLbl: function (chartSpace, ser, val) {
        var pxToMm = this.chartProp.pxToMM;
        var min = this.chartProp.scale[0];
        var max = this.chartProp.scale[this.chartProp.scale.length - 1];
        var digHeight = Math.abs(max - min);
        if (this.chartProp.min < 0 && this.chartProp.max <= 0) {
            min = -1 * max;
        }
        var numCache = this.chartProp.series[0].val.numRef ? this.chartProp.series[0].val.numRef.numCache : this.chartProp.series[0].val.numLit;
        var koffX = this.chartProp.trueWidth / numCache.pts.length;
        var koffY = this.chartProp.trueHeight / digHeight;
        var point = this.chartProp.series[ser].val.numRef ? this.chartProp.series[ser].val.numRef.numCache.pts[val] : this.chartProp.series[ser].val.numLit.pts[val];
        var x = this.chartProp.chartGutter._left + (val) * koffX + koffX / 2;
        var y = this.chartProp.trueHeight - (point.val - min) * koffY + this.chartProp.chartGutter._top;
        var width = point.compiledDlb.extX;
        var height = point.compiledDlb.extY;
        var centerX = x / pxToMm - width / 2;
        var centerY = y / pxToMm - height / 2;
        var constMargin = 5 / pxToMm;
        switch (point.compiledDlb.dLblPos) {
        case DLBL_POS_B:
            centerY = centerY + height / 2 + constMargin;
            break;
        case DLBL_POS_BEST_FIT:
            break;
        case DLBL_POS_CTR:
            break;
        case DLBL_POS_L:
            centerX = centerX - width / 2 - constMargin;
            break;
        case DLBL_POS_R:
            centerX = centerX + width / 2 + constMargin;
            break;
        case DLBL_POS_T:
            centerY = centerY - height / 2 - constMargin;
            break;
        }
        if (centerX < 0) {
            centerX = 0;
        }
        if (centerX + width > this.chartProp.widthCanvas / pxToMm) {
            centerX = this.chartProp.widthCanvas / pxToMm - width;
        }
        if (centerY < 0) {
            centerY = 0;
        }
        if (centerY + height > this.chartProp.heightCanvas / pxToMm) {
            centerY = this.chartProp.heightCanvas / pxToMm - height;
        }
        return {
            x: centerX,
            y: centerY
        };
    },
    _calculateUpDownBars: function (x, y, x1, y1, width) {
        var path = new Path();
        var pathH = this.chartProp.pathH;
        var pathW = this.chartProp.pathW;
        var gdLst = [];
        path.pathH = pathH;
        path.pathW = pathW;
        gdLst["w"] = 1;
        gdLst["h"] = 1;
        var pxToMm = this.chartProp.pxToMM;
        path.moveTo((x - width / 2) * pathW, y * pathH);
        path.lnTo((x - width / 2) * pathW, y1 * pathH);
        path.lnTo((x + width / 2) * pathW, y1 * pathH);
        path.lnTo((x + width / 2) * pathW, y * pathH);
        path.lnTo((x - width / 2) * pathW, y * pathH);
        path.recalculate(gdLst);
        return path;
    }
};
function drawBubbleChart() {
    this.chartProp = null;
    this.cChartDrawer = null;
    this.cShapeDrawer = null;
    this.paths = {};
}
drawBubbleChart.prototype = {
    reCalculate: function (chartProp, cShapeDrawer) {
        this.chartProp = chartProp.calcProp;
        this.cChartDrawer = chartProp;
        this.cShapeDrawer = cShapeDrawer;
        this.paths = {};
        this._recalculateScatter();
    },
    draw: function (chartProp, cShapeDrawer) {
        this.chartProp = chartProp.calcProp;
        this.cChartDrawer = chartProp;
        this.cShapeDrawer = cShapeDrawer;
        this._drawScatter();
    },
    _recalculateScatter: function () {
        var xPoints = this.cShapeDrawer.chart.plotArea.catAx.xPoints;
        var yPoints = this.cShapeDrawer.chart.plotArea.valAx.yPoints;
        var trueHeight = this.chartProp.trueHeight;
        var trueWidth = this.chartProp.trueWidth;
        var minOy = this.chartProp.ymin;
        var maxOy = this.chartProp.ymax;
        var maxOx = this.chartProp.xScale[this.chartProp.xScale.length - 1];
        var minOx = this.chartProp.xScale[0];
        var digHeightOy = Math.abs(maxOy - minOy);
        var digHeightOx = Math.abs(maxOx - minOx);
        var koffX = trueWidth / digHeightOx;
        var koffY = trueHeight / digHeightOy;
        var seria, yVal, xVal, points, x, x1, y, y1, yNumCache, xNumCache;
        for (var i = 0; i < this.chartProp.series.length; i++) {
            seria = this.chartProp.series[i];
            points = [];
            yNumCache = seria.yVal.numRef.numCache ? seria.yVal.numRef.numCache : seria.yVal.numRef.numLit;
            for (var n = 0; n < yNumCache.pts.length; n++) {
                yVal = parseFloat(yNumCache.pts[n].val);
                xNumCache = seria.xVal && seria.xVal.numRef ? seria.xVal.numRef.numCache : seria.xVal && seria.xVal.numLit ? seria.xVal.numLit : null;
                if (xNumCache && xNumCache.pts[n] && xNumCache.pts[n].val) {
                    if (!isNaN(parseFloat(xNumCache.pts[n].val))) {
                        xVal = parseFloat(xNumCache.pts[n].val);
                    } else {
                        xVal = n + 1;
                    }
                } else {
                    xVal = n + 1;
                }
                points[n] = {
                    x: xVal,
                    y: yVal
                };
            }
            for (var k = 0; k < points.length; k++) {
                y = this.cChartDrawer.getYPosition(points[k].y, yPoints);
                x = this.cChartDrawer.getYPosition(points[k].x, xPoints, true);
                if (!this.paths.points) {
                    this.paths.points = [];
                }
                if (!this.paths.points[i]) {
                    this.paths.points[i] = [];
                }
                this.paths.points[i][k] = this._calculateBubble(x, y, seria.bubbleSize, k);
            }
        }
    },
    _drawScatter: function () {
        var seria, brush, pen, markerBrush, markerPen, yNumCache;
        for (var i = 0; i < this.chartProp.series.length; i++) {
            seria = this.chartProp.series[i];
            brush = seria.brush;
            pen = seria.pen;
            if (this.paths.points && this.paths.points[i]) {
                for (var k = 0; k < this.paths.points[i].length; k++) {
                    yNumCache = this.chartProp.series[i].yVal.numRef ? this.chartProp.series[i].yVal.numRef.numCache : this.chartProp.series[i].yVal.numLit;
                    markerBrush = yNumCache.pts[k].compiledMarker.brush;
                    markerPen = yNumCache.pts[k].compiledMarker.pen;
                    this.cChartDrawer.drawPath(this.paths.points[i][k], markerPen, markerBrush, true);
                }
            }
        }
    },
    _getYPosition: function (val, yPoints, isOx) {
        var result;
        var resPos;
        var resVal;
        var diffVal;
        if (val < yPoints[0].val) {
            resPos = Math.abs(yPoints[1].pos - yPoints[0].pos);
            resVal = yPoints[1].val - yPoints[0].val;
            diffVal = Math.abs(yPoints[0].val) - Math.abs(val);
            result = yPoints[0].pos - Math.abs((diffVal / resVal) * resPos);
        } else {
            if (val > yPoints[yPoints.length - 1].val) {
                resPos = Math.abs(yPoints[1].pos - yPoints[0].pos);
                resVal = yPoints[1].val - yPoints[0].val;
                diffVal = Math.abs(yPoints[0].val) - Math.abs(val);
                result = yPoints[0].pos + (diffVal / resVal) * resPos;
            } else {
                for (var s = 0; s < yPoints.length; s++) {
                    if (val >= yPoints[s].val && val <= yPoints[s + 1].val) {
                        resPos = Math.abs(yPoints[s + 1].pos - yPoints[s].pos);
                        resVal = yPoints[s + 1].val - yPoints[s].val;
                        if (!isOx) {
                            result = -(resPos / resVal) * (Math.abs(val - yPoints[s].val)) + yPoints[s].pos;
                        } else {
                            result = (resPos / resVal) * (Math.abs(val - yPoints[s].val)) + yPoints[s].pos;
                        }
                        break;
                    }
                }
            }
        }
        return result;
    },
    _calculateDLbl: function (chartSpace, ser, val) {
        var point;
        if (this.chartProp.series[ser - 1]) {
            point = this.chartProp.series[ser - 1].yVal.numRef ? this.chartProp.series[ser - 1].yVal.numRef.numCache.pts[val] : this.chartProp.series[ser - 1].yVal.numLit.pts[val];
        } else {
            point = this.chartProp.series[ser].yVal.numRef ? this.chartProp.series[ser].yVal.numRef.numCache.pts[val] : this.chartProp.series[ser].yVal.numLit.pts[val];
        }
        var path;
        if (this.paths.points) {
            if (this.paths.points[ser] && this.paths.points[ser][val]) {
                path = this.paths.points[ser][val].path.ArrPathCommand[0];
            }
        }
        if (!path) {
            return;
        }
        var x = path.X;
        var y = path.Y;
        var pxToMm = this.chartProp.pxToMM;
        var constMargin = 5 / pxToMm;
        var width = point.compiledDlb.extX;
        var height = point.compiledDlb.extY;
        var centerX = x - width / 2;
        var centerY = y - height / 2;
        switch (point.compiledDlb.dLblPos) {
        case DLBL_POS_B:
            centerY = centerY + height / 2 + constMargin;
            break;
        case DLBL_POS_BEST_FIT:
            break;
        case DLBL_POS_CTR:
            break;
        case DLBL_POS_L:
            centerX = centerX - width / 2 - constMargin;
            break;
        case DLBL_POS_R:
            centerX = centerX + width / 2 + constMargin;
            break;
        case DLBL_POS_T:
            centerY = centerY - height / 2 - constMargin;
            break;
        }
        if (centerX < 0) {
            centerX = 0;
        }
        if (centerX + width > this.chartProp.widthCanvas / pxToMm) {
            centerX = this.chartProp.widthCanvas / pxToMm - width;
        }
        if (centerY < 0) {
            centerY = 0;
        }
        if (centerY + height > this.chartProp.heightCanvas / pxToMm) {
            centerY = this.chartProp.heightCanvas / pxToMm - height;
        }
        return {
            x: centerX,
            y: centerY
        };
    },
    _calculateBubble: function (x, y, bubbleSize, k) {
        var defaultSize = 4;
        if (bubbleSize) {
            var maxSize, curSize, yPoints, maxDiamBubble, diffSize, maxArea;
            maxSize = this.cChartDrawer._getMaxMinValueArray(bubbleSize).max;
            curSize = bubbleSize[k].val;
            yPoints = this.chartSpace.chart.plotArea.valAx.yPoints ? this.chartSpace.chart.plotArea.valAx.yPoints : this.chartSpace.chart.plotArea.catAx.yPoints;
            maxDiamBubble = Math.abs(yPoints[1].pos - yPoints[0].pos) * 2;
            diffSize = maxSize / curSize;
            var isDiam = false;
            if (isDiam) {
                defaultSize = (maxDiamBubble / diffSize) / 2;
            } else {
                maxArea = 1 / 4 * (Math.PI * (maxDiamBubble * maxDiamBubble));
                defaultSize = Math.sqrt((maxArea / diffSize) / Math.PI);
            }
        }
        var path = new Path();
        var pathH = this.chartProp.pathH;
        var pathW = this.chartProp.pathW;
        var gdLst = [];
        path.pathH = pathH;
        path.pathW = pathW;
        gdLst["w"] = 1;
        gdLst["h"] = 1;
        path.moveTo((x + defaultSize) * pathW, y * pathH);
        path.arcTo(defaultSize * pathW, defaultSize * pathW, 0, Math.PI * 2 * cToDeg);
        path.recalculate(gdLst);
        return path;
    }
};
function gridChart() {
    this.chartProp = null;
    this.cShapeDrawer = null;
    this.chartSpace = null;
    this.cChartDrawer = null;
    this.paths = {};
}
gridChart.prototype = {
    draw: function (chartProp, cShapeDrawer, chartSpace) {
        this.chartProp = chartProp.calcProp;
        this.cShapeDrawer = cShapeDrawer;
        this.chartSpace = chartSpace;
        this.cChartDrawer = chartProp;
        this._drawHorisontalLines();
        this._drawVerticalLines();
    },
    reCalculate: function (chartProp, cShapeDrawer, chartSpace) {
        this.chartProp = chartProp;
        this.cShapeDrawer = cShapeDrawer;
        this.chartSpace = chartSpace;
        this.cChartDrawer = chartProp;
        this.paths = {};
        this._calculateHorisontalLines();
        this._calculateVerticalLines();
    },
    _calculateHorisontalLines: function () {
        var stepY = (this.chartProp.heightCanvas - this.chartProp.chartGutter._bottom - this.chartProp.chartGutter._top) / (this.chartProp.numhlines);
        var minorStep = stepY / this.chartProp.numhMinorlines;
        var widthLine = this.chartProp.widthCanvas - (this.chartProp.chartGutter._left + this.chartProp.chartGutter._right);
        var bottomMargin = this.chartProp.heightCanvas - this.chartProp.chartGutter._bottom;
        var posX = this.chartProp.chartGutter._left;
        var posY;
        var posMinorY;
        var trueWidth = this.chartProp.trueWidth;
        var trueHeight = this.chartProp.trueHeight;
        var xCenter = (this.chartProp.chartGutter._left + trueWidth / 2) / this.chartProp.pxToMM;
        var yCenter = (this.chartProp.chartGutter._top + trueHeight / 2) / this.chartProp.pxToMM;
        var yPoints = this.chartSpace.chart.plotArea.valAx.yPoints ? this.chartSpace.chart.plotArea.valAx.yPoints : this.chartSpace.chart.plotArea.catAx.yPoints;
        var crossBetween = this.chartSpace.chart.plotArea.valAx.crossBetween;
        var crossDiff;
        if (crossBetween == CROSS_BETWEEN_BETWEEN && this.chartSpace.chart.plotArea.valAx.posY) {
            crossDiff = yPoints[1] ? Math.abs((yPoints[1].pos - yPoints[0].pos) / 2) : Math.abs(yPoints[0].pos - this.chartSpace.chart.plotArea.valAx.posY);
        }
        if (this.chartProp.type == "Radar") {
            var y, x, path;
            if (this.chartSpace.chart.plotArea.valAx) {
                var yPoints = this.chartSpace.chart.plotArea.valAx.yPoints;
            }
            var numCache = this.chartProp.series[0].val.numRef ? this.chartProp.series[0].val.numRef.numCache.pts : this.chartProp.series[0].val.numLit.pts;
            var tempAngle = 2 * Math.PI / numCache.length;
            var xDiff = ((trueHeight / 2) / yPoints.length) / this.chartProp.pxToMM;
            var radius, xFirst, yFirst;
        }
        for (var i = 0; i < yPoints.length; i++) {
            if (this.chartProp.type == "Radar") {
                path = new Path();
                for (var k = 0; k < numCache.length; k++) {
                    y = i * xDiff;
                    x = xCenter;
                    radius = y;
                    y = yCenter - radius * Math.cos(k * tempAngle);
                    x = x + radius * Math.sin(k * tempAngle);
                    var pathH = this.chartProp.pathH;
                    var pathW = this.chartProp.pathW;
                    var gdLst = [];
                    path.pathH = pathH;
                    path.pathW = pathW;
                    gdLst["w"] = 1;
                    gdLst["h"] = 1;
                    path.stroke = true;
                    var pxToMm = this.chartProp.pxToMM;
                    if (k == 0) {
                        xFirst = x;
                        yFirst = y;
                        path.moveTo(x * pathW, y * pathH);
                    } else {
                        if (k == numCache.length - 1) {
                            path.lnTo(x * pathW, y * pathH);
                            path.lnTo(xFirst * pathW, yFirst * pathH);
                        } else {
                            path.lnTo(x * pathW, y * pathH);
                        }
                    }
                }
                path.recalculate(gdLst);
                if (!this.paths.horisontalLines) {
                    this.paths.horisontalLines = [];
                }
                this.paths.horisontalLines[i] = path;
            } else {
                if (crossDiff) {
                    posY = (yPoints[i].pos - crossDiff) * this.chartProp.pxToMM;
                } else {
                    posY = yPoints[i].pos * this.chartProp.pxToMM;
                }
                if (!this.paths.horisontalLines) {
                    this.paths.horisontalLines = [];
                }
                this.paths.horisontalLines[i] = this._calculateLine(posX, posY, posX + widthLine, posY);
                for (var n = 0; n < this.chartProp.numhMinorlines; n++) {
                    posMinorY = posY + n * minorStep;
                    if (posMinorY < this.chartProp.chartGutter._top || posMinorY > bottomMargin) {
                        break;
                    }
                    if (!this.paths.horisontalMinorLines) {
                        this.paths.horisontalMinorLines = [];
                    }
                    if (!this.paths.horisontalMinorLines[i]) {
                        this.paths.horisontalMinorLines[i] = [];
                    }
                    this.paths.horisontalMinorLines[i][n] = this._calculateLine(posX, posMinorY, posX + widthLine, posMinorY);
                }
                if (crossDiff && i == yPoints.length - 1) {
                    if (crossDiff) {
                        posY = (yPoints[i].pos + crossDiff) * this.chartProp.pxToMM;
                    }
                    i++;
                    if (!this.paths.horisontalLines) {
                        this.paths.horisontalLines = [];
                    }
                    this.paths.horisontalLines[i] = this._calculateLine(posX, posY, posX + widthLine, posY);
                }
            }
        }
    },
    _calculateVerticalLines: function () {
        var heightLine = this.chartProp.heightCanvas - (this.chartProp.chartGutter._bottom + this.chartProp.chartGutter._top);
        var rightMargin = this.chartProp.widthCanvas - this.chartProp.chartGutter._right;
        var posY = this.chartProp.chartGutter._top;
        var posX;
        var posMinorX;
        var xPoints = this.chartSpace.chart.plotArea.valAx.xPoints ? this.chartSpace.chart.plotArea.valAx.xPoints : this.chartSpace.chart.plotArea.catAx.xPoints;
        var stepX = xPoints[1] ? Math.abs((xPoints[1].pos - xPoints[0].pos)) : (Math.abs(xPoints[0].pos - this.chartSpace.chart.plotArea.valAx.posX) * 2);
        var minorStep = (stepX * this.chartProp.pxToMM) / this.chartProp.numvMinorlines;
        if (!xPoints) {
            return;
        }
        var crossBetween = this.chartSpace.chart.plotArea.valAx.crossBetween;
        var crossDiff;
        if (crossBetween == CROSS_BETWEEN_BETWEEN && this.chartSpace.chart.plotArea.valAx.posX && this.chartProp.type != "HBar") {
            crossDiff = xPoints[1] ? Math.abs((xPoints[1].pos - xPoints[0].pos) / 2) : Math.abs(xPoints[0].pos - this.chartSpace.chart.plotArea.valAx.posX);
        }
        for (var i = 0; i < xPoints.length; i++) {
            if (crossDiff) {
                posX = (xPoints[i].pos - crossDiff) * this.chartProp.pxToMM;
            } else {
                posX = xPoints[i].pos * this.chartProp.pxToMM;
            }
            if (!this.paths.verticalLines) {
                this.paths.verticalLines = [];
            }
            this.paths.verticalLines[i] = this._calculateLine(posX, posY, posX, posY + heightLine);
            for (var n = 1; n <= this.chartProp.numvMinorlines; n++) {
                posMinorX = posX + n * minorStep;
                if (posMinorX < this.chartProp.chartGutter._left || posMinorX > rightMargin) {
                    break;
                }
                if (!this.paths.verticalMinorLines) {
                    this.paths.verticalMinorLines = [];
                }
                if (!this.paths.verticalMinorLines[i]) {
                    this.paths.verticalMinorLines[i] = [];
                }
                this.paths.verticalMinorLines[i][n] = this._calculateLine(posMinorX, posY, posMinorX, posY + heightLine);
            }
            if (crossDiff && i == xPoints.length - 1) {
                if (crossDiff) {
                    posX = (xPoints[i].pos + crossDiff) * this.chartProp.pxToMM;
                }
                i++;
                if (!this.paths.verticalLines) {
                    this.paths.verticalLines = [];
                }
                this.paths.verticalLines[i] = this._calculateLine(posX, posY, posX, posY + heightLine);
            }
        }
    },
    _calculateLine: function (x, y, x1, y1) {
        var path = new Path();
        var pathH = this.chartProp.pathH;
        var pathW = this.chartProp.pathW;
        var gdLst = [];
        path.pathH = pathH;
        path.pathW = pathW;
        gdLst["w"] = 1;
        gdLst["h"] = 1;
        path.stroke = true;
        var pxToMm = this.chartProp.pxToMM;
        path.moveTo(x / pxToMm * pathW, y / pxToMm * pathH);
        path.lnTo(x1 / pxToMm * pathW, y1 / pxToMm * pathH);
        path.recalculate(gdLst);
        return path;
    },
    _drawHorisontalLines: function () {
        var pen;
        var path;
        var yPoints = this.chartSpace.chart.plotArea.valAx.yPoints ? this.chartSpace.chart.plotArea.valAx.yPoints : this.chartSpace.chart.plotArea.catAx.yPoints;
        for (var i = 0; i < this.paths.horisontalLines.length; i++) {
            if (this.chartProp.type == "HBar") {
                pen = this.chartSpace.chart.plotArea.catAx.compiledMajorGridLines;
            } else {
                pen = this.chartSpace.chart.plotArea.valAx.compiledMajorGridLines;
            }
            path = this.paths.horisontalLines[i];
            this.cChartDrawer.drawPath(path, pen);
            if (this.paths.horisontalMinorLines && this.paths.horisontalMinorLines[i]) {
                for (var n = 0; n < this.paths.horisontalMinorLines[i].length; n++) {
                    path = this.paths.horisontalMinorLines[i][n];
                    if (this.chartProp.type == "HBar") {
                        pen = this.chartSpace.chart.plotArea.catAx.compiledMinorGridLines;
                    } else {
                        pen = this.chartSpace.chart.plotArea.valAx.compiledMinorGridLines;
                    }
                    this.cChartDrawer.drawPath(path, pen);
                }
            }
        }
    },
    _drawVerticalLines: function () {
        var pen, path;
        var xPoints = this.chartSpace.chart.plotArea.valAx.xPoints ? this.chartSpace.chart.plotArea.valAx.xPoints : this.chartSpace.chart.plotArea.catAx.xPoints;
        for (var i = 0; i < this.paths.verticalLines.length; i++) {
            if (this.chartProp.type == "HBar") {
                pen = this.chartSpace.chart.plotArea.valAx.compiledMajorGridLines;
            } else {
                pen = this.chartSpace.chart.plotArea.catAx.compiledMajorGridLines;
            }
            path = this.paths.verticalLines[i];
            this.cChartDrawer.drawPath(path, pen);
            if (this.paths.verticalMinorLines && this.paths.verticalMinorLines[i]) {
                for (var n = 0; n < this.paths.verticalMinorLines[i].length; n++) {
                    path = this.paths.verticalMinorLines[i][n];
                    if (this.chartProp.type == "HBar") {
                        pen = this.chartSpace.chart.plotArea.valAx.compiledMinorGridLines;
                    } else {
                        pen = this.chartSpace.chart.plotArea.catAx.compiledMinorGridLines;
                    }
                    this.cChartDrawer.drawPath(path, pen);
                }
            }
        }
    }
};
function catAxisChart() {
    this.chartProp = null;
    this.cShapeDrawer = null;
    this.chartSpace = null;
    this.cChartDrawer = null;
    this.paths = {};
}
catAxisChart.prototype = {
    draw: function (chartProp, cShapeDrawer, chartSpace) {
        this.chartProp = chartProp.calcProp;
        this.cShapeDrawer = cShapeDrawer;
        this.chartSpace = chartSpace;
        this.cChartDrawer = chartProp;
        this._drawAxis();
        this._drawTickMark();
    },
    reCalculate: function (chartProp, cShapeDrawer, chartSpace) {
        this.chartProp = chartProp;
        this.cShapeDrawer = cShapeDrawer;
        this.chartSpace = chartSpace;
        this.cChartDrawer = chartProp;
        this.paths = {};
        if (this.chartSpace.chart.plotArea.catAx.bDelete != true) {
            this._calculateAxis();
            this._calculateTickMark();
        }
    },
    _calculateAxis: function () {
        var nullPoisition = this.chartProp.nullPositionOX;
        var axisPos;
        if (this.chartProp.type == "HBar") {
            axisPos = this.chartSpace.chart.plotArea.catAx.posX;
            this.paths.axisLine = this._calculateLine(axisPos, this.chartProp.chartGutter._top / this.chartProp.pxToMM, axisPos, (this.chartProp.heightCanvas - this.chartProp.chartGutter._bottom) / this.chartProp.pxToMM);
        } else {
            axisPos = this.chartSpace.chart.plotArea.catAx.posY ? this.chartSpace.chart.plotArea.catAx.posY : this.chartSpace.chart.plotArea.catAx.yPos;
            this.paths.axisLine = this._calculateLine(this.chartProp.chartGutter._left / this.chartProp.pxToMM, axisPos, (this.chartProp.widthCanvas - this.chartProp.chartGutter._right) / this.chartProp.pxToMM, axisPos);
        }
    },
    _calculateTickMark: function () {
        var widthLine = 0,
        widthMinorLine = 0;
        var crossMajorStep = 0,
        crossMinorStep = 0;
        switch (this.chartSpace.chart.plotArea.catAx.majorTickMark) {
        case TICK_MARK_CROSS:
            widthLine = 5;
            crossMajorStep = 5;
            break;
        case TICK_MARK_IN:
            widthLine = -5;
            break;
        case TICK_MARK_NONE:
            widthLine = 0;
            break;
        case TICK_MARK_OUT:
            widthLine = 5;
            break;
        }
        switch (this.chartSpace.chart.plotArea.catAx.minorTickMark) {
        case TICK_MARK_CROSS:
            widthMinorLine = 3;
            crossMinorStep = 3;
            break;
        case TICK_MARK_IN:
            widthMinorLine = -3;
            break;
        case TICK_MARK_NONE:
            widthMinorLine = 0;
            break;
        case TICK_MARK_OUT:
            widthMinorLine = 3;
            break;
        }
        if (this.chartProp.type == "HBar") {
            widthMinorLine = -widthMinorLine;
            widthLine = -widthLine;
            crossMajorStep = -crossMajorStep;
            crossMinorStep = -crossMinorStep;
        }
        var orientation = this.chartSpace && this.chartSpace.chart.plotArea.valAx ? this.chartSpace.chart.plotArea.valAx.scaling.orientation : ORIENTATION_MIN_MAX;
        if (orientation !== ORIENTATION_MIN_MAX) {
            widthMinorLine = -widthMinorLine;
            widthLine = -widthLine;
            crossMajorStep = -crossMajorStep;
            crossMinorStep = -crossMinorStep;
        }
        if (! (widthLine === 0 && widthMinorLine === 0)) {
            if (this.chartProp.type == "HBar") {
                this._calculateVerticalTickMarks(widthLine, widthMinorLine, crossMajorStep, crossMinorStep);
            } else {
                this._calculateHorisontalTickMarks(widthLine, widthMinorLine, crossMajorStep, crossMinorStep);
            }
        }
    },
    _calculateVerticalTickMarks: function (widthLine, widthMinorLine, crossMajorStep, crossMinorStep) {
        var orientation = this.chartSpace && this.chartSpace.chart.plotArea.catAx ? this.chartSpace.chart.plotArea.catAx.scaling.orientation : ORIENTATION_MIN_MAX;
        var yPoints = this.chartSpace.chart.plotArea.catAx.yPoints;
        var stepY = yPoints[1] ? Math.abs(yPoints[1].pos - yPoints[0].pos) : Math.abs(yPoints[0].pos - this.chartProp.chartGutter._bottom / this.chartProp.pxToMM);
        var minorStep = stepY / this.chartProp.numhMinorlines;
        var posX = this.chartSpace.chart.plotArea.catAx.posX ? this.chartSpace.chart.plotArea.catAx.posX : this.chartSpace.chart.plotArea.catAx.xPos;
        var posY, posMinorY, k;
        var firstDiff = 0,
        posYtemp;
        if (this.chartSpace.chart.plotArea.valAx.crossBetween == CROSS_BETWEEN_BETWEEN) {
            firstDiff = yPoints[1] ? Math.abs(yPoints[1].pos - yPoints[0].pos) : Math.abs(yPoints[0].pos - this.chartSpace.chart.plotArea.valAx.posY) * 2;
        }
        var tickMarkSkip = this.chartSpace.chart.plotArea.catAx.tickMarkSkip ? this.chartSpace.chart.plotArea.catAx.tickMarkSkip : 1;
        if (orientation !== ORIENTATION_MIN_MAX) {
            minorStep = -minorStep;
            firstDiff = -firstDiff;
        }
        for (var i = 0; i < yPoints.length; i++) {
            k = i * tickMarkSkip;
            if (k >= yPoints.length) {
                break;
            }
            posY = yPoints[k].pos + firstDiff / 2;
            if (!this.paths.tickMarks) {
                this.paths.tickMarks = [];
            }
            this.paths.tickMarks[i] = this._calculateLine(posX, posY, posX + widthLine / this.chartProp.pxToMM, posY);
            if (((i + 1) * tickMarkSkip) === yPoints.length) {
                posYtemp = yPoints[yPoints.length - 1].pos - firstDiff / 2;
                this.paths.tickMarks[i + 1] = this._calculateLine(posX - crossMajorStep / this.chartProp.pxToMM, posYtemp, posX + widthLine / this.chartProp.pxToMM, posYtemp);
            }
            if (widthMinorLine !== 0) {
                for (var n = 1; n < this.chartProp.numhMinorlines; n++) {
                    posMinorY = posY - n * minorStep * tickMarkSkip;
                    if (((posMinorY < yPoints[yPoints.length - 1].pos - firstDiff / 2) && orientation == ORIENTATION_MIN_MAX) || ((posMinorY > yPoints[yPoints.length - 1].pos - firstDiff / 2) && orientation !== ORIENTATION_MIN_MAX)) {
                        break;
                    }
                    if (!this.paths.minorTickMarks) {
                        this.paths.minorTickMarks = [];
                    }
                    if (!this.paths.minorTickMarks[i]) {
                        this.paths.minorTickMarks[i] = [];
                    }
                    this.paths.minorTickMarks[i][n] = this._calculateLine(posX - crossMinorStep / this.chartProp.pxToMM, posMinorY, posX + widthMinorLine / this.chartProp.pxToMM, posMinorY);
                }
            }
        }
    },
    _calculateHorisontalTickMarks: function (widthLine, widthMinorLine, crossMajorStep, crossMinorStep) {
        var orientation = this.chartSpace && this.chartSpace.chart.plotArea.catAx ? this.chartSpace.chart.plotArea.catAx.scaling.orientation : ORIENTATION_MIN_MAX;
        var xPoints = this.chartSpace.chart.plotArea.catAx.xPoints;
        var stepX = xPoints[1] ? Math.abs(xPoints[1].pos - xPoints[0].pos) : Math.abs(xPoints[0].pos - this.chartSpace.chart.plotArea.catAx.posX) * 2;
        var minorStep = stepX / this.chartProp.numvMinorlines;
        var posY = this.chartSpace.chart.plotArea.catAx.posY ? this.chartSpace.chart.plotArea.catAx.posY : this.chartSpace.chart.plotArea.catAx.yPos;
        var posX, posMinorX, k;
        var firstDiff = 0,
        posXtemp;
        if (this.chartSpace.chart.plotArea.valAx.crossBetween == CROSS_BETWEEN_BETWEEN && this.chartProp.type != "Scatter") {
            if (xPoints[1]) {
                firstDiff = Math.abs(xPoints[1].pos - xPoints[0].pos);
            } else {
                if (this.chartSpace.chart.plotArea.valAx.posX) {
                    firstDiff = Math.abs(this.chartSpace.chart.plotArea.valAx.posX - xPoints[0].pos) * 2;
                }
            }
        }
        var tickMarkSkip = this.chartSpace.chart.plotArea.catAx.tickMarkSkip ? this.chartSpace.chart.plotArea.catAx.tickMarkSkip : 1;
        if (orientation !== ORIENTATION_MIN_MAX) {
            minorStep = -minorStep;
            firstDiff = -firstDiff;
        }
        for (var i = 0; i < xPoints.length; i++) {
            k = i * tickMarkSkip;
            if (k >= xPoints.length) {
                break;
            }
            posX = xPoints[k].pos - firstDiff / 2;
            if (!this.paths.tickMarks) {
                this.paths.tickMarks = [];
            }
            this.paths.tickMarks[i] = this._calculateLine(posX, posY - crossMajorStep / this.chartProp.pxToMM, posX, posY + widthLine / this.chartProp.pxToMM);
            if (((i + 1) * tickMarkSkip) === xPoints.length) {
                posXtemp = xPoints[xPoints.length - 1].pos + firstDiff / 2;
                this.paths.tickMarks[i + 1] = this._calculateLine(posXtemp, posY - crossMajorStep / this.chartProp.pxToMM, posXtemp, posY + widthLine / this.chartProp.pxToMM);
            }
            if (widthMinorLine !== 0) {
                for (var n = 1; n < this.chartProp.numvMinorlines; n++) {
                    posMinorX = posX + n * minorStep * tickMarkSkip;
                    if (((posMinorX > xPoints[xPoints.length - 1].pos + firstDiff / 2) && orientation == ORIENTATION_MIN_MAX) || ((posMinorX < xPoints[xPoints.length - 1].pos + firstDiff / 2) && orientation !== ORIENTATION_MIN_MAX)) {
                        break;
                    }
                    if (!this.paths.minorTickMarks) {
                        this.paths.minorTickMarks = [];
                    }
                    if (!this.paths.minorTickMarks[i]) {
                        this.paths.minorTickMarks[i] = [];
                    }
                    this.paths.minorTickMarks[i][n] = this._calculateLine(posMinorX, posY - crossMinorStep / this.chartProp.pxToMM, posMinorX, posY + widthMinorLine / this.chartProp.pxToMM);
                }
            }
        }
    },
    _calculateLine: function (x, y, x1, y1) {
        var path = new Path();
        var pathH = this.chartProp.pathH;
        var pathW = this.chartProp.pathW;
        var gdLst = [];
        path.pathH = pathH;
        path.pathW = pathW;
        gdLst["w"] = 1;
        gdLst["h"] = 1;
        var pxToMm = this.chartProp.pxToMM;
        path.moveTo(x * pathW, y * pathH);
        path.lnTo(x1 * pathW, y1 * pathH);
        path.recalculate(gdLst);
        return path;
    },
    _drawAxis: function () {
        var pen;
        var path;
        pen = this.chartSpace.chart.plotArea.catAx.compiledLn;
        path = this.paths.axisLine;
        this.cChartDrawer.drawPath(path, pen);
    },
    _drawTickMark: function () {
        var pen, path;
        if (this.paths.tickMarks) {
            for (var i = 0; i < this.paths.tickMarks.length; i++) {
                pen = this.chartSpace.chart.plotArea.catAx.compiledTickMarkLn;
                path = this.paths.tickMarks[i];
                this.cChartDrawer.drawPath(path, pen);
                if (this.paths.minorTickMarks && this.paths.minorTickMarks[i]) {
                    for (var n = 0; n < this.paths.minorTickMarks[i].length; n++) {
                        path = this.paths.minorTickMarks[i][n];
                        this.cChartDrawer.drawPath(path, pen);
                    }
                }
            }
        }
    }
};
function valAxisChart() {
    this.chartProp = null;
    this.cShapeDrawer = null;
    this.chartSpace = null;
    this.cChartDrawer = null;
    this.paths = {};
}
valAxisChart.prototype = {
    draw: function (chartProp, cShapeDrawer, chartSpace) {
        this.chartProp = chartProp.calcProp;
        this.cShapeDrawer = cShapeDrawer;
        this.chartSpace = chartSpace;
        this.cChartDrawer = chartProp;
        this._drawAxis();
        this._drawTickMark();
    },
    reCalculate: function (chartProp, cShapeDrawer, chartSpace) {
        this.chartProp = chartProp;
        this.cShapeDrawer = cShapeDrawer;
        this.chartSpace = chartSpace;
        this.cChartDrawer = chartProp;
        this.paths = {};
        if (this.chartSpace.chart.plotArea.valAx.bDelete != true) {
            this._calculateAxis();
            this._calculateTickMark();
        }
    },
    _calculateAxis: function () {
        var nullPoisition = this.chartSpace.chart.plotArea.valAx.posX != undefined ? this.chartSpace.chart.plotArea.valAx.posX : this.chartSpace.chart.plotArea.valAx.xPos;
        if (this.chartProp.type == "HBar") {
            nullPoisition = this.chartSpace.chart.plotArea.valAx.posY;
            this.paths.axisLine = this._calculateLine(this.chartProp.chartGutter._left / this.chartProp.pxToMM, nullPoisition, (this.chartProp.widthCanvas - this.chartProp.chartGutter._right) / this.chartProp.pxToMM, nullPoisition);
        } else {
            this.paths.axisLine = this._calculateLine(nullPoisition, this.chartProp.chartGutter._top / this.chartProp.pxToMM, nullPoisition, (this.chartProp.heightCanvas - this.chartProp.chartGutter._bottom) / this.chartProp.pxToMM);
        }
    },
    _calculateTickMark: function () {
        var widthLine = 0,
        widthMinorLine = 0;
        var crossMajorStep = 0;
        var crossMinorStep = 0;
        switch (this.chartSpace.chart.plotArea.valAx.majorTickMark) {
        case TICK_MARK_CROSS:
            widthLine = 5;
            crossMajorStep = 5;
            break;
        case TICK_MARK_IN:
            widthLine = 5;
            break;
        case TICK_MARK_NONE:
            widthLine = 0;
            break;
        case TICK_MARK_OUT:
            widthLine = -5;
            break;
        }
        switch (this.chartSpace.chart.plotArea.valAx.minorTickMark) {
        case TICK_MARK_CROSS:
            widthMinorLine = 3;
            crossMinorStep = 3;
            break;
        case TICK_MARK_IN:
            widthMinorLine = 3;
            break;
        case TICK_MARK_NONE:
            widthMinorLine = 0;
            break;
        case TICK_MARK_OUT:
            widthMinorLine = -3;
            break;
        }
        if (this.chartProp.type == "HBar") {
            widthMinorLine = -widthMinorLine;
            widthLine = -widthLine;
            crossMajorStep = -crossMajorStep;
            crossMinorStep = -crossMinorStep;
        }
        var orientation = this.chartSpace && this.chartSpace.chart.plotArea.catAx ? this.chartSpace.chart.plotArea.catAx.scaling.orientation : ORIENTATION_MIN_MAX;
        if (orientation !== ORIENTATION_MIN_MAX) {
            widthMinorLine = -widthMinorLine;
            widthLine = -widthLine;
            crossMajorStep = -crossMajorStep;
            crossMinorStep = -crossMinorStep;
        }
        if (! (widthLine === 0 && widthMinorLine === 0)) {
            if (this.chartProp.type == "HBar") {
                var yPoints = this.chartSpace.chart.plotArea.valAx.xPoints;
                var stepX = yPoints[1] ? Math.abs(yPoints[1].pos - yPoints[0].pos) : Math.abs(yPoints[1].pos - this.chartProp.chartGutter._bottom / this.chartProp.pxToMM);
                var minorStep = stepX / this.chartProp.numvMinorlines;
                var posY = this.chartSpace.chart.plotArea.valAx.posY;
                var posX;
                var posMinorX;
                for (var i = 0; i < yPoints.length; i++) {
                    posX = yPoints[i].pos;
                    if (!this.paths.tickMarks) {
                        this.paths.tickMarks = [];
                    }
                    this.paths.tickMarks[i] = this._calculateLine(posX, posY - crossMajorStep / this.chartProp.pxToMM, posX, posY + widthLine / this.chartProp.pxToMM);
                    if (widthMinorLine !== 0) {
                        for (var n = 0; n < this.chartProp.numvMinorlines; n++) {
                            posMinorX = posX + n * minorStep;
                            if (!this.paths.minorTickMarks) {
                                this.paths.minorTickMarks = [];
                            }
                            if (!this.paths.minorTickMarks[i]) {
                                this.paths.minorTickMarks[i] = [];
                            }
                            this.paths.minorTickMarks[i][n] = this._calculateLine(posMinorX, posY - crossMinorStep / this.chartProp.pxToMM, posMinorX, posY + widthMinorLine / this.chartProp.pxToMM);
                        }
                    }
                }
            } else {
                var yPoints = this.chartSpace.chart.plotArea.valAx.yPoints;
                var stepY = yPoints[1] ? Math.abs(yPoints[1].pos - yPoints[0].pos) : Math.abs(yPoints[0].pos - this.chartProp.chartGutter._bottom / this.chartProp.pxToMM);
                var minorStep = stepY / this.chartProp.numhMinorlines;
                var posX = this.chartSpace.chart.plotArea.valAx.posX ? this.chartSpace.chart.plotArea.valAx.posX : this.chartSpace.chart.plotArea.valAx.xPos;
                var posY;
                var posMinorY;
                for (var i = 0; i < yPoints.length; i++) {
                    posY = yPoints[i].pos;
                    if (!this.paths.tickMarks) {
                        this.paths.tickMarks = [];
                    }
                    this.paths.tickMarks[i] = this._calculateLine(posX - crossMajorStep / this.chartProp.pxToMM, posY, posX + widthLine / this.chartProp.pxToMM, posY);
                    if (widthMinorLine !== 0) {
                        for (var n = 0; n < this.chartProp.numhMinorlines; n++) {
                            posMinorY = posY - n * minorStep;
                            if (!this.paths.minorTickMarks) {
                                this.paths.minorTickMarks = [];
                            }
                            if (!this.paths.minorTickMarks[i]) {
                                this.paths.minorTickMarks[i] = [];
                            }
                            this.paths.minorTickMarks[i][n] = this._calculateLine(posX - crossMinorStep / this.chartProp.pxToMM, posMinorY, posX + widthMinorLine / this.chartProp.pxToMM, posMinorY);
                        }
                    }
                }
            }
        }
    },
    _calculateLine: function (x, y, x1, y1) {
        var path = new Path();
        var pathH = this.chartProp.pathH;
        var pathW = this.chartProp.pathW;
        var gdLst = [];
        path.pathH = pathH;
        path.pathW = pathW;
        gdLst["w"] = 1;
        gdLst["h"] = 1;
        path.moveTo(x * pathW, y * pathH);
        path.lnTo(x1 * pathW, y1 * pathH);
        path.recalculate(gdLst);
        return path;
    },
    _drawAxis: function () {
        var pen;
        var path;
        pen = this.chartSpace.chart.plotArea.catAx.compiledLn;
        path = this.paths.axisLine;
        this.cChartDrawer.drawPath(path, pen);
    },
    _drawTickMark: function () {
        var pen, path;
        if (!this.paths.tickMarks) {
            return;
        }
        for (var i = 0; i < this.paths.tickMarks.length; i++) {
            pen = this.chartSpace.chart.plotArea.valAx.compiledTickMarkLn;
            path = this.paths.tickMarks[i];
            this.cChartDrawer.drawPath(path, pen);
            if (i != (this.paths.tickMarks.length - 1) && this.paths.minorTickMarks) {
                for (var n = 0; n < this.paths.minorTickMarks[i].length; n++) {
                    path = this.paths.minorTickMarks[i][n];
                    this.cChartDrawer.drawPath(path, pen);
                }
            }
        }
    }
};
function allAreaChart() {
    this.chartProp = null;
    this.cShapeDrawer = null;
    this.chartSpace = null;
    this.cChartDrawer = null;
    this.paths = null;
}
allAreaChart.prototype = {
    draw: function (chartProp, cShapeDrawer, chartSpace) {
        this.chartProp = chartProp.calcProp;
        this.cShapeDrawer = cShapeDrawer;
        this.chartSpace = chartSpace;
        this.cChartDrawer = chartProp;
        this._drawArea();
    },
    reCalculate: function (chartProp, cShapeDrawer) {
        this.chartProp = chartProp;
        this.cShapeDrawer = cShapeDrawer;
        this.cChartDrawer = chartProp;
        this.paths = null;
        this._calculateArea();
    },
    _calculateArea: function () {
        var path = new Path();
        var pathH = this.chartProp.pathH;
        var pathW = this.chartProp.pathW;
        var gdLst = [];
        path.pathH = pathH;
        path.pathW = pathW;
        gdLst["w"] = 1;
        gdLst["h"] = 1;
        var pxToMm = this.chartProp.pxToMM;
        path.moveTo(0, 0);
        path.lnTo(0 / pxToMm * pathW, this.chartProp.heightCanvas / pxToMm * pathH);
        path.lnTo(this.chartProp.widthCanvas / pxToMm * pathW, this.chartProp.heightCanvas / pxToMm * pathH);
        path.lnTo(this.chartProp.widthCanvas / pxToMm * pathW, 0 / pxToMm * pathH);
        path.lnTo(0, 0);
        path.recalculate(gdLst);
        this.paths = path;
    },
    _drawArea: function () {
        var pen = this.chartSpace.pen;
        var brush = this.chartSpace.brush;
        this.cChartDrawer.drawPath(this.paths, pen, brush);
    }
};
function areaChart() {
    this.chartProp = null;
    this.cShapeDrawer = null;
    this.chartSpace = null;
    this.cChartDrawer = null;
    this.paths = null;
}
areaChart.prototype = {
    draw: function (chartProp, cShapeDrawer, chartSpace) {
        this.chartProp = chartProp.calcProp;
        this.cShapeDrawer = cShapeDrawer;
        this.chartSpace = chartSpace;
        this.cChartDrawer = chartProp;
        this._drawArea();
    },
    reCalculate: function (chartProp, cShapeDrawer) {
        this.chartProp = chartProp;
        this.cShapeDrawer = cShapeDrawer;
        this.cChartDrawer = chartProp;
        this.paths = null;
        this._calculateArea();
    },
    _calculateArea: function () {
        var path = new Path();
        var pathH = this.chartProp.pathH;
        var pathW = this.chartProp.pathW;
        var gdLst = [];
        path.pathH = pathH;
        path.pathW = pathW;
        gdLst["w"] = 1;
        gdLst["h"] = 1;
        var pxToMm = this.chartProp.pxToMM;
        var widthGraph = this.chartProp.widthCanvas;
        var heightGraph = this.chartProp.heightCanvas;
        var leftMargin = this.chartProp.chartGutter._left;
        var rightMargin = this.chartProp.chartGutter._right;
        var topMargin = this.chartProp.chartGutter._top;
        var bottomMargin = this.chartProp.chartGutter._bottom;
        path.moveTo(leftMargin / pxToMm * pathW, (heightGraph - bottomMargin) / pxToMm * pathH);
        path.lnTo((widthGraph - rightMargin) / pxToMm * pathW, (heightGraph - bottomMargin) / pxToMm * pathH);
        path.lnTo((widthGraph - rightMargin) / pxToMm * pathW, topMargin / pxToMm * pathH);
        path.lnTo(leftMargin / pxToMm * pathW, topMargin / pxToMm * pathH);
        path.moveTo(leftMargin / pxToMm * pathW, (heightGraph - bottomMargin) / pxToMm * pathH);
        path.recalculate(gdLst);
        this.paths = path;
    },
    _drawArea: function () {
        var pen = this.chartSpace.chart.plotArea.pen;
        var brush = this.chartSpace.chart.plotArea.brush;
        this.cChartDrawer.drawPath(this.paths, pen, brush);
    }
};
var angleOx = 0;
var angleOy = 0;
var angleOz = 0;
function drawLine3DChart() {
    this.chartProp = null;
    this.cChartDrawer = null;
    this.cShapeDrawer = null;
    this.paths = {};
}
drawLine3DChart.prototype = {
    draw: function (chartProp, cShapeDrawer) {
        this.chartProp = chartProp.calcProp;
        this.cChartDrawer = chartProp;
        this.cShapeDrawer = cShapeDrawer;
        this._drawLines();
    },
    reCalculate: function (chartProp, cShapeDrawer) {
        this.paths = {};
        this.chartProp = chartProp.calcProp;
        this.cChartDrawer = chartProp;
        this.cShapeDrawer = cShapeDrawer;
        this._calculateLines();
    },
    _calculateLines: function () {
        var trueWidth = this.chartProp.trueWidth;
        var trueHeight = this.chartProp.trueHeight;
        var min = this.chartProp.scale[0];
        var max = this.chartProp.scale[this.chartProp.scale.length - 1];
        var widthLine = this.chartProp.widthCanvas - (this.chartProp.chartGutter._left + this.chartProp.chartGutter._right);
        var heightLine = this.chartProp.heightCanvas - (this.chartProp.chartGutter._top + this.chartProp.chartGutter._bottom);
        var digHeight = Math.abs(max - min);
        if (this.chartProp.min < 0 && this.chartProp.max <= 0 && this.chartProp.subType != "stackedPer") {
            min = -1 * max;
        }
        var koffX = trueWidth / this.chartProp.numvlines;
        var koffY = trueHeight / digHeight;
        var cX1, cY1, cZ1, cX2, cY2, cZ2, cX3, cY3, cZ3, cX4, cY4, cZ4, convertObj, z, turnResult;
        for (var i = 0; i < this.chartProp.series.length; i++) {
            var seria = this.chartProp.series[i];
            var dataSeries = seria.val.numRef.numCache ? seria.val.numRef.numCache.pts : seria.val.numLit.pts;
            var y, y1, x, x1, val, prevVal, tempVal;
            for (var n = 1; n < dataSeries.length; n++) {
                prevVal = this._getYVal(n - 1, i) - min;
                val = this._getYVal(n, i) - min;
                y = trueHeight - (prevVal) * koffY + this.chartProp.chartGutter._top - heightLine / 2;
                y1 = trueHeight - (val) * koffY + this.chartProp.chartGutter._top - heightLine / 2;
                x = this.chartProp.chartGutter._left + (n - 1) * koffX - widthLine / 2;
                x1 = this.chartProp.chartGutter._left + n * koffX - widthLine / 2;
                if (!this.paths.series) {
                    this.paths.series = [];
                }
                if (!this.paths.series[i]) {
                    this.paths.series[i] = [];
                }
                z = 50;
                turnResult = this.cChartDrawer._turnCoords(x, y, z, angleOx, angleOy, angleOz);
                cX1 = turnResult.x;
                cY1 = turnResult.y;
                cZ1 = turnResult.z;
                convertObj = this.cChartDrawer._convert3DTo2D(cX1, cY1, cZ1, 0, 0, 0.002);
                cX1 = convertObj.x + widthLine / 2;
                cY1 = convertObj.y + heightLine / 2;
                z = 50 + 20;
                turnResult = this.cChartDrawer._turnCoords(x, y, z, angleOx, angleOy, angleOz);
                cX2 = turnResult.x;
                cY2 = turnResult.y;
                cZ2 = turnResult.z;
                convertObj = this.cChartDrawer._convert3DTo2D(cX2, cY2, cZ2, 0, 0, 0.002);
                cX2 = convertObj.x + widthLine / 2;
                cY2 = convertObj.y + heightLine / 2;
                z = 50 + 20;
                turnResult = this.cChartDrawer._turnCoords(x1, y1, z, angleOx, angleOy, angleOz);
                cX3 = turnResult.x;
                cY3 = turnResult.y;
                cZ3 = turnResult.z;
                convertObj = this.cChartDrawer._convert3DTo2D(cX3, cY3, cZ3, 0, 0, 0.002);
                cX3 = convertObj.x + widthLine / 2;
                cY3 = convertObj.y + heightLine / 2;
                z = 50;
                turnResult = this.cChartDrawer._turnCoords(x1, y1, z, angleOx, angleOy, angleOz);
                cX4 = turnResult.x;
                cY4 = turnResult.y;
                cZ4 = turnResult.z;
                convertObj = this.cChartDrawer._convert3DTo2D(cX4, cY4, cZ4, 0, 0, 0.002);
                cX4 = convertObj.x + widthLine / 2;
                cY4 = convertObj.y + heightLine / 2;
                this.paths.series[i][n] = this._calculateLine(cX1, cY1, cX2, cY2, cX3, cY3, cX4, cY4);
            }
        }
    },
    _drawLines: function (isRedraw) {
        var brush;
        var pen;
        var dataSeries;
        var seria;
        for (var i = 0; i < this.chartProp.series.length; i++) {
            seria = this.chartProp.series[i];
            brush = seria.brush;
            pen = seria.pen;
            dataSeries = seria.val.numRef.numCache ? seria.val.numRef.numCache.pts : seria.val.numLit.pts;
            for (var n = 1; n < dataSeries.length; n++) {
                if (dataSeries[n].pen) {
                    pen = dataSeries[n].pen;
                }
                if (dataSeries[n].brush) {
                    brush = dataSeries[n].brush;
                }
                this.cChartDrawer.drawPath(this.paths.series[i][n], pen, brush);
            }
        }
    },
    _getYVal: function (n, i) {
        var tempVal;
        var val = 0;
        var numCache;
        if (this.chartProp.subType == "stacked") {
            for (var k = 0; k <= i; k++) {
                numCache = this.chartProp.series[k].val.numRef ? this.chartProp.series[k].val.numRef.numCache : this.chartProp.series[k].val.numLit;
                tempVal = parseFloat(numCache.pts[n].val);
                if (tempVal) {
                    val += tempVal;
                }
            }
        } else {
            if (this.chartProp.subType == "stackedPer") {
                var summVal = 0;
                for (var k = 0; k < this.chartProp.series.length; k++) {
                    numCache = this.chartProp.series[k].val.numRef ? this.chartProp.series[k].val.numRef.numCache : this.chartProp.series[k].val.numLit;
                    tempVal = parseFloat(numCache.pts[n].val);
                    if (tempVal) {
                        if (k <= i) {
                            val += tempVal;
                        }
                        summVal += Math.abs(tempVal);
                    }
                }
                val = val * 100 / summVal;
            } else {
                numCache = this.chartProp.series[i].val.numRef ? this.chartProp.series[i].val.numRef.numCache : this.chartProp.series[i].val.numLit;
                val = parseFloat(numCache.pts[n].val);
            }
        }
        return val;
    },
    _calculateLine: function (x, y, x1, y1, x2, y2, x3, y3) {
        var path = new Path();
        var pathH = this.chartProp.pathH;
        var pathW = this.chartProp.pathW;
        var gdLst = [];
        path.pathH = pathH;
        path.pathW = pathW;
        gdLst["w"] = 1;
        gdLst["h"] = 1;
        var pxToMm = this.chartProp.pxToMM;
        path.moveTo(x / pxToMm * pathW, y / pxToMm * pathH);
        path.lnTo(x1 / pxToMm * pathW, y1 / pxToMm * pathH);
        path.lnTo(x2 / pxToMm * pathW, y2 / pxToMm * pathH);
        path.lnTo(x3 / pxToMm * pathW, y3 / pxToMm * pathH);
        path.lnTo(x / pxToMm * pathW, y / pxToMm * pathH);
        path.recalculate(gdLst);
        return path;
    },
    _calculateDLbl: function () {
        return {
            x: 0,
            y: 0
        };
    }
};
function drawBar3DChart() {
    this.chartProp = null;
    this.cChartDrawer = null;
    this.cShapeDrawer = null;
    this.chartSpace = null;
    this.summBarVal = [];
    this.paths = {};
}
drawBar3DChart.prototype = {
    reCalculate: function (chartProp, cShapeDrawer) {
        this.chartProp = chartProp.calcProp;
        this.cChartDrawer = chartProp;
        this.cShapeDrawer = cShapeDrawer;
        this.paths = {};
        this.summBarVal = [];
        this._reCalculateBars();
    },
    draw: function (chartProp, cShapeDrawer, chartSpace) {
        this.chartProp = chartProp.calcProp;
        this.cChartDrawer = chartProp;
        this.cShapeDrawer = cShapeDrawer;
        this.chartSpace = chartSpace;
        this.summBarVal = [];
        this._DrawBars();
    },
    _DrawBars: function () {
        var brush, pen, seria;
        for (var i = 0; i < this.paths.series.length; i++) {
            seria = this.chartProp.series[i];
            brush = seria.brush;
            pen = seria.pen;
            for (var j = 0; j < this.paths.series[i].length / 2; ++j) {
                if (seria.val.numRef.numCache.pts[j].pen) {
                    pen = seria.val.numRef.numCache.pts[j].pen;
                }
                if (seria.val.numRef.numCache.pts[j].brush) {
                    brush = seria.val.numRef.numCache.pts[j].brush;
                }
                for (var k = 0; k < this.paths.series[i][j].length; k++) {
                    if (k != 5) {
                        var props = this.chartSpace.getParentObjects();
                        var duplicateBrush = brush.createDuplicate();
                        var cColorMod = new CColorMod;
                        cColorMod.val = 80000;
                        cColorMod.name = "shade";
                        duplicateBrush.fill.color.Mods.addMod(cColorMod);
                        duplicateBrush.calculate(props.theme, props.slide, props.layout, props.master, new CUniColor().RGBA);
                        this.cChartDrawer.drawPath(this.paths.series[i][j][k], pen, duplicateBrush);
                    } else {
                        this.cChartDrawer.drawPath(this.paths.series[i][j][k], pen, brush);
                    }
                }
            }
        }
        var brush, pen, seria;
        for (var i = this.paths.series.length - 1; i >= 0; i--) {
            seria = this.chartProp.series[i];
            brush = seria.brush;
            pen = seria.pen;
            for (var j = this.paths.series[i].length - 1; j >= this.paths.series[i].length / 2; j--) {
                if (seria.val.numRef.numCache.pts[j].pen) {
                    pen = seria.val.numRef.numCache.pts[j].pen;
                }
                if (seria.val.numRef.numCache.pts[j].brush) {
                    brush = seria.val.numRef.numCache.pts[j].brush;
                }
                for (var k = 0; k < this.paths.series[i][j].length; k++) {
                    if (k != 5) {
                        var props = this.chartSpace.getParentObjects();
                        var duplicateBrush = brush.createDuplicate();
                        var cColorMod = new CColorMod;
                        cColorMod.val = 80000;
                        cColorMod.name = "shade";
                        duplicateBrush.fill.color.Mods.addMod(cColorMod);
                        duplicateBrush.calculate(props.theme, props.slide, props.layout, props.master, new CUniColor().RGBA);
                        this.cChartDrawer.drawPath(this.paths.series[i][j][k], pen, duplicateBrush);
                    } else {
                        this.cChartDrawer.drawPath(this.paths.series[i][j][k], pen, brush);
                    }
                }
            }
        }
    },
    _reCalculateBars: function () {
        var xPoints = this.cShapeDrawer.chart.plotArea.catAx.xPoints;
        var yPoints = this.cShapeDrawer.chart.plotArea.valAx.yPoints;
        var widthGraph = this.chartProp.widthCanvas - this.chartProp.chartGutter._left - this.chartProp.chartGutter._right;
        var defaultOverlap = (this.chartProp.subType == "stacked" || this.chartProp.subType == "stackedPer") ? 100 : 0;
        var overlap = this.cShapeDrawer.chart.plotArea.chart.overlap ? this.cShapeDrawer.chart.plotArea.chart.overlap : defaultOverlap;
        var width = widthGraph / this.chartProp.series[0].val.numRef.numCache.pts.length;
        var gapWidth = this.cShapeDrawer.chart.plotArea.chart.gapWidth ? this.cShapeDrawer.chart.plotArea.chart.gapWidth : 150;
        var individualBarWidth = width / (this.chartProp.seriesCount - (this.chartProp.seriesCount - 1) * (overlap / 100) + gapWidth / 100);
        var widthOverLap = individualBarWidth * (overlap / 100);
        var hmargin = (gapWidth / 100 * individualBarWidth) / 2;
        var val;
        var paths;
        var individualBarWidth;
        var height;
        var startX;
        var startY;
        var seriesHeight = [];
        var diffYVal;
        var summBarVal = [];
        var x1, y1, z1, x1, y2, z2, x2, y3, z3, x3, x4, y4, z4, x5, y5, z5, x6, y6, z6, x7, y7, z7, x8, y8, z8;
        var point1, point2, point3, point4, point5, point6, point7, point8;
        var perspectiveVal = 20;
        var startXPosition, startYColumnPosition;
        for (var i = 0; i < this.chartProp.series.length; i++) {
            var seria = this.chartProp.series[i].val.numRef.numCache.pts;
            seriesHeight[i] = [];
            for (var j = 0; j < seria.length; ++j) {
                val = parseFloat(seria[j].val);
                startYColumnPosition = this._getStartYColumnPosition(seriesHeight, j, val, yPoints);
                startY = startYColumnPosition.startY;
                height = startYColumnPosition.height;
                seriesHeight[i][j] = height;
                if (j != 0) {
                    startXPosition = xPoints[j].pos - (xPoints[j].pos - xPoints[j - 1].pos) / 2;
                } else {
                    startXPosition = this.cShapeDrawer.chart.plotArea.valAx.posX;
                }
                if (i == 0) {
                    startX = startXPosition * this.chartProp.pxToMM + hmargin + i * (individualBarWidth);
                } else {
                    startX = startXPosition * this.chartProp.pxToMM + hmargin + (i * individualBarWidth - i * widthOverLap);
                }
                if (height != 0) {
                    x1 = startX,
                    y1 = startY,
                    z1 = 0;
                    x2 = startX,
                    y2 = startY,
                    z2 = perspectiveVal;
                    x3 = startX + individualBarWidth,
                    y3 = startY,
                    z3 = perspectiveVal;
                    x4 = startX + individualBarWidth,
                    y4 = startY,
                    z4 = 0;
                    x5 = startX,
                    y5 = startY - height,
                    z5 = 0;
                    x6 = startX,
                    y6 = startY - height,
                    z6 = perspectiveVal;
                    x7 = startX + individualBarWidth,
                    y7 = startY - height,
                    z7 = perspectiveVal;
                    x8 = startX + individualBarWidth,
                    y8 = startY - height,
                    z8 = 0;
                    var p = 0,
                    q = 0,
                    r = global3DPersperctive ? global3DPersperctive / 10000 : 0.002;
                    point1 = this._convertAndTurnPoint(x1, y1, z1, angleOx, angleOy, angleOz, p, q, r);
                    point2 = this._convertAndTurnPoint(x2, y2, z2, angleOx, angleOy, angleOz, p, q, r);
                    point3 = this._convertAndTurnPoint(x3, y3, z3, angleOx, angleOy, angleOz, p, q, r);
                    point4 = this._convertAndTurnPoint(x4, y4, z4, angleOx, angleOy, angleOz, p, q, r);
                    point5 = this._convertAndTurnPoint(x5, y5, z5, angleOx, angleOy, angleOz, p, q, r);
                    point6 = this._convertAndTurnPoint(x6, y6, z6, angleOx, angleOy, angleOz, p, q, r);
                    point7 = this._convertAndTurnPoint(x7, y7, z7, angleOx, angleOy, angleOz, p, q, r);
                    point8 = this._convertAndTurnPoint(x8, y8, z8, angleOx, angleOy, angleOz, p, q, r);
                    paths = this._calculateRect(point1, point2, point3, point4, point5, point6, point7, point8);
                    if (!this.paths.series) {
                        this.paths.series = [];
                    }
                    if (!this.paths.series[i]) {
                        this.paths.series[i] = [];
                    }
                    this.paths.series[i][j] = paths;
                }
            }
        }
    },
    _convertAndTurnPoint: function (x1, y1, z1, angleOx, angleOy, angleOz, p, q, r) {
        var widthLine = this.chartProp.widthCanvas - (this.chartProp.chartGutter._left + this.chartProp.chartGutter._right);
        var heightLine = this.chartProp.heightCanvas - (this.chartProp.chartGutter._top + this.chartProp.chartGutter._bottom);
        x1 = x1 - widthLine / 2;
        y1 = y1 - heightLine / 2;
        var turnResult = this.cChartDrawer._turnCoords(x1, y1, z1, angleOx, angleOy, angleOz);
        x1 = turnResult.x;
        y1 = turnResult.y;
        z1 = turnResult.z;
        var convertObj = this.cChartDrawer._convert3DTo2D(x1, y1, z1, p, q, r);
        x1 = convertObj.x + widthLine / 2;
        y1 = convertObj.y + heightLine / 2;
        return {
            x: x1,
            y: y1
        };
    },
    _calculateRect: function (point1, point2, point3, point4, point5, point6, point7, point8) {
        var path = new Path();
        var pathH = this.chartProp.pathH;
        var pathW = this.chartProp.pathW;
        var gdLst = [];
        path.pathH = pathH;
        path.pathW = pathW;
        gdLst["w"] = 1;
        gdLst["h"] = 1;
        var pxToMm = this.chartProp.pxToMM;
        var paths = [];
        path = new Path();
        path.pathH = pathH;
        path.pathW = pathW;
        path.moveTo(point2.x / pxToMm * pathW, point2.y / pxToMm * pathH);
        path.lnTo(point6.x / pxToMm * pathW, point6.y / pxToMm * pathH);
        path.lnTo(point7.x / pxToMm * pathW, point7.y / pxToMm * pathH);
        path.lnTo(point3.x / pxToMm * pathW, point3.y / pxToMm * pathH);
        path.lnTo(point2.x / pxToMm * pathW, point2.y / pxToMm * pathH);
        path.recalculate(gdLst);
        paths[0] = path;
        path.moveTo(point1.x / pxToMm * pathW, point1.y / pxToMm * pathH);
        path.lnTo(point2.x / pxToMm * pathW, point2.y / pxToMm * pathH);
        path.lnTo(point3.x / pxToMm * pathW, point3.y / pxToMm * pathH);
        path.lnTo(point4.x / pxToMm * pathW, point4.y / pxToMm * pathH);
        path.lnTo(point1.x / pxToMm * pathW, point1.y / pxToMm * pathH);
        path.recalculate(gdLst);
        paths[1] = path;
        path = new Path();
        path.pathH = pathH;
        path.pathW = pathW;
        path.moveTo(point1.x / pxToMm * pathW, point1.y / pxToMm * pathH);
        path.lnTo(point5.x / pxToMm * pathW, point5.y / pxToMm * pathH);
        path.lnTo(point6.x / pxToMm * pathW, point6.y / pxToMm * pathH);
        path.lnTo(point2.x / pxToMm * pathW, point2.y / pxToMm * pathH);
        path.lnTo(point1.x / pxToMm * pathW, point1.y / pxToMm * pathH);
        path.recalculate(gdLst);
        paths[2] = path;
        path = new Path();
        path.pathH = pathH;
        path.pathW = pathW;
        path.moveTo(point4.x / pxToMm * pathW, point4.y / pxToMm * pathH);
        path.lnTo(point8.x / pxToMm * pathW, point8.y / pxToMm * pathH);
        path.lnTo(point7.x / pxToMm * pathW, point7.y / pxToMm * pathH);
        path.lnTo(point3.x / pxToMm * pathW, point3.y / pxToMm * pathH);
        path.lnTo(point4.x / pxToMm * pathW, point4.y / pxToMm * pathH);
        path.recalculate(gdLst);
        paths[3] = path;
        path = new Path();
        path.pathH = pathH;
        path.pathW = pathW;
        path.moveTo(point5.x / pxToMm * pathW, point5.y / pxToMm * pathH);
        path.lnTo(point6.x / pxToMm * pathW, point6.y / pxToMm * pathH);
        path.lnTo(point7.x / pxToMm * pathW, point7.y / pxToMm * pathH);
        path.lnTo(point8.x / pxToMm * pathW, point8.y / pxToMm * pathH);
        path.lnTo(point5.x / pxToMm * pathW, point5.y / pxToMm * pathH);
        path.recalculate(gdLst);
        paths[4] = path;
        path = new Path();
        path.pathH = pathH;
        path.pathW = pathW;
        path.moveTo(point1.x / pxToMm * pathW, point1.y / pxToMm * pathH);
        path.lnTo(point5.x / pxToMm * pathW, point5.y / pxToMm * pathH);
        path.lnTo(point8.x / pxToMm * pathW, point8.y / pxToMm * pathH);
        path.lnTo(point4.x / pxToMm * pathW, point4.y / pxToMm * pathH);
        path.lnTo(point1.x / pxToMm * pathW, point1.y / pxToMm * pathH);
        path.recalculate(gdLst);
        paths[5] = path;
        return paths;
    },
    _getYPosition: function (val, yPoints) {
        var result;
        var resPos;
        var resVal;
        var diffVal;
        if (val < yPoints[0].val) {
            resPos = Math.abs(yPoints[1].pos - yPoints[0].pos);
            resVal = yPoints[1].val - yPoints[0].val;
            diffVal = Math.abs(yPoints[0].val) - Math.abs(val);
            result = yPoints[0].pos - Math.abs((diffVal / resVal) * resPos);
        } else {
            if (val > yPoints[yPoints.length - 1].val) {
                resPos = Math.abs(yPoints[1].pos - yPoints[0].pos);
                resVal = yPoints[1].val - yPoints[0].val;
                diffVal = Math.abs(yPoints[0].val) - Math.abs(val);
                result = yPoints[0].pos + (diffVal / resVal) * resPos;
            } else {
                for (var s = 0; s < yPoints.length; s++) {
                    if (val >= yPoints[s].val && val <= yPoints[s + 1].val) {
                        resPos = Math.abs(yPoints[s + 1].pos - yPoints[s].pos);
                        resVal = yPoints[s + 1].val - yPoints[s].val;
                        result = -(resPos / resVal) * (Math.abs(val - yPoints[s].val)) + yPoints[s].pos;
                        break;
                    }
                }
            }
        }
        return result;
    },
    _getStartYColumnPosition: function (seriesHeight, j, val, yPoints, summBarVal) {
        var startY, diffYVal, height;
        var nullPositionOX = this.chartProp.nullPositionOX;
        if (this.chartProp.subType == "stacked") {
            diffYVal = 0;
            for (var k = 0; k < seriesHeight.length; k++) {
                if (seriesHeight[k][j] && ((val > 0 && seriesHeight[k][j] > 0) || (val < 0 && seriesHeight[k][j] < 0))) {
                    diffYVal += seriesHeight[k][j];
                }
            }
            startY = nullPositionOX - diffYVal;
            height = nullPositionOX - this._getYPosition(val, yPoints) * this.chartProp.pxToMM;
        } else {
            if (this.chartProp.subType == "stackedPer") {
                diffYVal = 0;
                for (var k = 0; k < seriesHeight.length; k++) {
                    if (seriesHeight[k][j] && ((val > 0 && seriesHeight[k][j] > 0) || (val < 0 && seriesHeight[k][j] < 0))) {
                        diffYVal += seriesHeight[k][j];
                    }
                }
                var tempVal;
                var temp = 0;
                if (!this.summBarVal[j]) {
                    for (var k = 0; k < this.chartProp.series.length; k++) {
                        tempVal = parseFloat(this.chartProp.series[k].val.numRef.numCache.pts[j].val);
                        if (tempVal) {
                            temp += Math.abs(tempVal);
                        }
                    }
                    this.summBarVal[j] = temp;
                }
                height = nullPositionOX - this._getYPosition((val / this.summBarVal[j]), yPoints) * this.chartProp.pxToMM;
                startY = nullPositionOX - diffYVal;
            } else {
                height = nullPositionOX - this._getYPosition(val, yPoints) * this.chartProp.pxToMM;
                startY = nullPositionOX;
            }
        }
        return {
            startY: startY,
            height: height
        };
    },
    _calculateDLbl: function () {
        return {
            x: 0,
            y: 0
        };
    }
};
function grid3DChart() {
    this.chartProp = null;
    this.cShapeDrawer = null;
    this.chartSpace = null;
    this.paths = {};
}
grid3DChart.prototype = {
    draw: function (chartProp, cShapeDrawer, chartSpace) {
        this.chartProp = chartProp;
        this.cShapeDrawer = cShapeDrawer;
        this.chartSpace = chartSpace;
        this._drawHorisontalLines();
        this._drawVerticalLines();
    },
    reCalculate: function (chartProp, cShapeDrawer, chartSpace) {
        this.chartProp = chartProp;
        this.cShapeDrawer = cShapeDrawer;
        this.chartSpace = chartSpace;
        this.paths = {};
        this._calculateHorisontalLines();
        this._calculateVerticalLines();
    },
    _calculateHorisontalLines: function () {
        var stepY = (this.chartProp.heightCanvas - this.chartProp.chartGutter._bottom - this.chartProp.chartGutter._top) / (this.chartProp.numhlines);
        var widthLine = this.chartProp.widthCanvas - (this.chartProp.chartGutter._left + this.chartProp.chartGutter._right);
        var heightLine = this.chartProp.heightCanvas - (this.chartProp.chartGutter._top + this.chartProp.chartGutter._bottom);
        var perspectiveValue = 50;
        var firstX = this.chartProp.chartGutter._left - widthLine / 2;
        var firstY;
        var diff = widthLine / 2;
        var p, q, r, convertResult, turnResult;
        var x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4, x1n, y1n, x2n, y2n, x3n, y3n, x4n, y4n;
        for (var i = 0; i <= this.chartProp.numhlines; i++) {
            firstY = this.chartProp.heightCanvas - this.chartProp.chartGutter._bottom - i * stepY - heightLine / 2;
            turnResult = this.cShapeDrawer._turnCoords(firstX, firstY, 0, angleOx, angleOy, angleOz);
            x1 = turnResult.x;
            y1 = turnResult.y;
            z1 = turnResult.z;
            turnResult = this.cShapeDrawer._turnCoords(firstX, firstY, perspectiveValue, angleOx, angleOy, angleOz);
            x2 = turnResult.x;
            y2 = turnResult.y;
            z2 = turnResult.z;
            turnResult = this.cShapeDrawer._turnCoords(firstX + widthLine, firstY, perspectiveValue, angleOx, angleOy, angleOz);
            x3 = turnResult.x;
            y3 = turnResult.y;
            z3 = turnResult.z;
            turnResult = this.cShapeDrawer._turnCoords(firstX + widthLine, firstY, 0, angleOx, angleOy, angleOz);
            x4 = turnResult.x;
            y4 = turnResult.y;
            z4 = turnResult.z;
            p = 0;
            q = 0;
            r = global3DPersperctive ? global3DPersperctive / 10000 : 0.002;
            convertResult = this.cShapeDrawer._convert3DTo2D(x1, y1, z1, p, q, r);
            x1n = convertResult.x + diff;
            y1n = convertResult.y + heightLine / 2;
            convertResult = this.cShapeDrawer._convert3DTo2D(x2, y2, z2, p, q, r);
            x2n = convertResult.x + diff;
            y2n = convertResult.y + heightLine / 2;
            convertResult = this.cShapeDrawer._convert3DTo2D(x3, y3, z3, p, q, r);
            x3n = convertResult.x + diff;
            y3n = convertResult.y + heightLine / 2;
            convertResult = this.cShapeDrawer._convert3DTo2D(x4, y4, z4, p, q, r);
            x4n = convertResult.x + diff;
            y4n = convertResult.y + heightLine / 2;
            if (!this.paths.horisontalLines) {
                this.paths.horisontalLines = [];
            }
            if (i == 0) {
                this.paths.horisontalLines[i] = this._calculateLine(x1n, y1n, x2n, y2n, x3n, y3n, x4n, y4n);
            } else {
                this.paths.horisontalLines[i] = this._calculateLine(x1n, y1n, x2n, y2n, x3n, y3n);
            }
        }
    },
    _calculateVerticalLines: function () {
        var stepY = (this.chartProp.widthCanvas - this.chartProp.chartGutter._left - this.chartProp.chartGutter._right) / (this.chartProp.numvlines);
        var heightLine = this.chartProp.heightCanvas - (this.chartProp.chartGutter._top + this.chartProp.chartGutter._bottom);
        var widthLine = this.chartProp.widthCanvas - (this.chartProp.chartGutter._left + this.chartProp.chartGutter._right);
        var perspectiveValue = 50;
        var firstY = this.chartProp.heightCanvas - this.chartProp.chartGutter._bottom - heightLine / 2;
        var firstX;
        var diff = widthLine / 2;
        var p, q, r, convertResult, turnResult;
        var x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4, x1n, y1n, x2n, y2n, x3n, y3n, x4n, y4n;
        for (var i = 0; i <= this.chartProp.numvlines; i++) {
            firstX = this.chartProp.chartGutter._left + i * stepY - widthLine / 2;
            turnResult = this.cShapeDrawer._turnCoords(firstX, firstY, 0, angleOx, angleOy, angleOz);
            x1 = turnResult.x;
            y1 = turnResult.y;
            z1 = turnResult.z;
            turnResult = this.cShapeDrawer._turnCoords(firstX, firstY, perspectiveValue, angleOx, angleOy, angleOz);
            x2 = turnResult.x;
            y2 = turnResult.y;
            z2 = turnResult.z;
            turnResult = this.cShapeDrawer._turnCoords(firstX, firstY - heightLine, perspectiveValue, angleOx, angleOy, angleOz);
            x3 = turnResult.x;
            y3 = turnResult.y;
            z3 = turnResult.z;
            turnResult = this.cShapeDrawer._turnCoords(firstX, firstY - heightLine, 0, angleOx, angleOy, angleOz);
            x4 = turnResult.x;
            y4 = turnResult.y;
            z4 = turnResult.z;
            p = 0;
            q = 0;
            r = global3DPersperctive ? global3DPersperctive / 10000 : 0.002;
            convertResult = this.cShapeDrawer._convert3DTo2D(x1, y1, z1, p, q, r);
            x1n = convertResult.x + diff;
            y1n = convertResult.y + heightLine / 2;
            convertResult = this.cShapeDrawer._convert3DTo2D(x2, y2, z2, p, q, r);
            x2n = convertResult.x + diff;
            y2n = convertResult.y + heightLine / 2;
            convertResult = this.cShapeDrawer._convert3DTo2D(x3, y3, z3, p, q, r);
            x3n = convertResult.x + diff;
            y3n = convertResult.y + heightLine / 2;
            convertResult = this.cShapeDrawer._convert3DTo2D(x4, y4, z4, p, q, r);
            x4n = convertResult.x + diff;
            y4n = convertResult.y + heightLine / 2;
            if (!this.paths.verticalLines) {
                this.paths.verticalLines = [];
            }
            if (i == 0) {
                this.paths.verticalLines[i] = this._calculateLine(x1n, y1n, x2n, y2n, x3n, y3n, x4n, y4n);
            } else {
                this.paths.verticalLines[i] = this._calculateLine(x1n, y1n, x2n, y2n, x3n, y3n);
            }
        }
    },
    _calculateLine: function (x, y, x1, y1, x2, y2, x3, y3) {
        var path = new Path();
        var pathH = this.chartProp.pathH;
        var pathW = this.chartProp.pathW;
        var gdLst = [];
        path.pathH = pathH;
        path.pathW = pathW;
        gdLst["w"] = 1;
        gdLst["h"] = 1;
        path.stroke = true;
        var pxToMm = this.chartProp.pxToMM;
        path.moveTo(x / pxToMm * pathW, y / pxToMm * pathH);
        path.lnTo(x1 / pxToMm * pathW, y1 / pxToMm * pathH);
        path.lnTo(x2 / pxToMm * pathW, y2 / pxToMm * pathH);
        if (x3 !== undefined && y3 !== undefined) {
            path.lnTo(x3 / pxToMm * pathW, y3 / pxToMm * pathH);
            path.lnTo(x / pxToMm * pathW, y / pxToMm * pathH);
        }
        path.recalculate(gdLst);
        return path;
    },
    _drawHorisontalLines: function () {
        if (!this.paths.horisontalLines) {
            return;
        }
        var pen;
        var path;
        for (var i = 0; i < this.paths.horisontalLines.length; i++) {
            if (this.chartProp.type == "HBar") {
                pen = this.chartSpace.chart.plotArea.catAx.compiledMajorGridLines;
            } else {
                pen = this.chartSpace.chart.plotArea.valAx.compiledMajorGridLines;
            }
            path = this.paths.horisontalLines[i];
            this.cChartDrawer.drawPath(path, pen);
        }
    },
    _drawVerticalLines: function () {
        if (!this.paths.verticalLines) {
            return;
        }
        var pen;
        var path;
        for (var i = 0; i < this.paths.verticalLines.length; i++) {
            if (this.chartProp.type == "HBar") {
                pen = this.chartSpace.chart.plotArea.valAx.compiledMajorGridLines;
            } else {
                pen = this.chartSpace.chart.plotArea.catAx.compiledMajorGridLines;
            }
            path = this.paths.verticalLines[i];
            this.cChartDrawer.drawPath(path, pen);
        }
    }
};
function CGeometry2() {
    this.pathLst = [];
    this.isLine = false;
    this.gdLst = [];
}
CGeometry2.prototype = {
    canFill: function () {
        if (this.preset === "line") {
            return false;
        }
        for (var i = 0; i < this.pathLst.length; ++i) {
            if (this.pathLst[i].fill !== "none") {
                return true;
            }
        }
        return false;
    },
    getObjectType: function () {
        return CLASS_TYPE_GEOMETRY;
    },
    AddPath: function (path) {
        this.pathLst.push(path);
    },
    AddRect: function (l, t, r, b) {
        this.rectS = {};
        this.rectS.l = l;
        this.rectS.t = t;
        this.rectS.r = r;
        this.rectS.b = b;
    },
    draw: function (shape_drawer) {
        for (var i = 0, n = this.pathLst.length; i < n; ++i) {
            this.pathLst[i].drawSmart(shape_drawer);
        }
    },
    check_bounds: function (checker) {
        for (var i = 0, n = this.pathLst.length; i < n; ++i) {
            this.pathLst[i].check_bounds(checker);
        }
    }
};
function CColorObj(pen, brush, geometry) {
    this.pen = pen;
    this.brush = brush;
    this.geometry = geometry;
}
CColorObj.prototype = {
    check_bounds: function (checker) {
        if (this.geometry) {
            this.geometry.check_bounds(checker);
        }
    }
};