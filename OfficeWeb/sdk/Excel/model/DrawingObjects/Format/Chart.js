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
 function CChartAsGroup(drawingBase, drawingObjects) {
    this.drawingBase = drawingBase && drawingBase.updateAnchorPosition ? drawingBase : null;
    this.drawingObjects = drawingObjects;
    this.chartTitle = null;
    this.vAxisTitle = null;
    this.hAxisTitle = null;
    this.brush = new CBlipFill();
    this.spPr = new CSpPr();
    this.x = null;
    this.y = null;
    this.extX = null;
    this.extY = null;
    this.lockType = c_oAscLockTypes.kLockTypeNone;
    this.spPr.geometry = CreateGeometry("rect");
    this.spPr.geometry.Init(5, 5);
    this.brush = new CUniFill();
    this.brush.fill = new CBlipFill();
    this.transform = new CMatrix();
    this.invertTransform = new CMatrix();
    this.group = null;
    this.rot = 0;
    this.recalculateInfo = {
        recalculateAll: true
    };
    this.selectedObjects = [];
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
    if (isRealObject(drawingObjects)) {
        this.setDrawingObjects(drawingObjects);
        this.setAscChart(new asc_CChart());
    }
}
CChartAsGroup.prototype = {
    calculateContent: function () {
        this.recalculate();
    },
    getObjectType: function () {
        return CLASS_TYPE_CHART_AS_GROUP;
    },
    setAscChart: function (chart) {
        var add_chart = new asc_CChart(chart);
        var old_id = isRealObject(this.chart) ? this.chart.Get_Id() : null;
        var new_id = isRealObject(add_chart) ? add_chart.Get_Id() : null;
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_Set_AscChart, null, null, new UndoRedoDataGraphicObjects(this.Id, new UndoRedoDataGOSingleProp(old_id, new_id)), null);
        this.chart = add_chart;
    },
    Get_Id: function () {
        return this.Id;
    },
    checkLine: function () {
        return false;
    },
    getTitlesArray: function () {
        var ret = [];
        if (this.chartTitle) {
            ret.push(this.chartTitle);
        }
        if (this.hAxisTitle) {
            ret.push(this.hAxisTitle);
        }
        if (this.vAxisTitle) {
            ret.push(this.vAxisTitle);
        }
        return ret;
    },
    getBoundsInGroup: function () {
        return {
            minX: this.x,
            minY: this.y,
            maxX: this.x + this.extX,
            maxY: this.y + this.extY
        };
        var r = this.rot;
        if ((r >= 0 && r < Math.PI * 0.25) || (r > 3 * Math.PI * 0.25 && r < 5 * Math.PI * 0.25) || (r > 7 * Math.PI * 0.25 && r < 2 * Math.PI)) {} else {
            var hc = this.extX * 0.5;
            var vc = this.extY * 0.5;
            var xc = this.x + hc;
            var yc = this.y + vc;
            return {
                minX: xc - vc,
                minY: yc - hc,
                maxX: xc + vc,
                maxY: yc + hc
            };
        }
    },
    hitInTextRect: function () {
        return false;
    },
    setGroup: function (group) {
        var oldId = isRealObject(this.group) ? this.group.Get_Id() : null;
        var newId = isRealObject(group) ? group.Get_Id() : null;
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_SetGroup, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(oldId, newId)));
        this.group = group;
    },
    hitInInnerArea: function (x, y) {
        var invert_transform = this.getInvertTransform();
        var x_t = invert_transform.TransformPointX(x, y);
        var y_t = invert_transform.TransformPointY(x, y);
        if (isRealObject(this.spPr.geometry)) {
            return this.spPr.geometry.hitInInnerArea(this.drawingObjects.getCanvasContext(), x_t, y_t);
        }
        return x_t > 0 && x_t < this.extX && y_t > 0 && y_t < this.extY;
    },
    hitInPath: function (x, y) {
        var invert_transform = this.getInvertTransform();
        var x_t = invert_transform.TransformPointX(x, y);
        var y_t = invert_transform.TransformPointY(x, y);
        if (isRealObject(this.spPr.geometry)) {
            return this.spPr.geometry.hitInPath(this.drawingObjects.getCanvasContext(), x_t, y_t);
        }
        return false;
    },
    recalculateColors: function () {
        this.recalculate();
    },
    isChart: function () {
        return true;
    },
    isShape: function () {
        return false;
    },
    isImage: function () {
        return false;
    },
    isGroup: function () {
        return false;
    },
    Get_Props: function (OtherProps) {
        var Props = new Object();
        Props.Width = this.extX;
        Props.Height = this.extY;
        if (!isRealObject(OtherProps)) {
            return Props;
        }
        OtherProps.Width = OtherProps.Width === Props.Width ? Props.Width : undefined;
        OtherProps.Height = OtherProps.Height === Props.Height ? Props.Height : undefined;
        return OtherProps;
    },
    syncAscChart: function () {
        if (this.chartTitle && this.chartTitle.txBody && this.chartTitle.txBody.content) {
            this.chart.asc_getHeader().asc_setTitle(this.chartTitle.txBody.content.getTextString());
        }
        if (this.vAxisTitle && this.vAxisTitle.txBody && this.vAxisTitle.txBody.content) {
            this.chart.asc_getYAxis().asc_setTitle(this.vAxisTitle.txBody.content.getTextString());
        }
        if (this.hAxisTitle && this.hAxisTitle.txBody && this.hAxisTitle.txBody.content) {
            this.chart.asc_getXAxis().asc_setTitle(this.hAxisTitle.txBody.content.getTextString());
        }
    },
    setDrawingObjects: function (drawingObjects) {
        if (isRealObject(drawingObjects) && drawingObjects.getWorksheet()) {
            var newValue = drawingObjects.getWorksheet().model.getId();
            var oldValue = isRealObject(this.drawingObjects) ? this.drawingObjects.getWorksheet().model.getId() : null;
            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_SetDrawingObjects, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(oldValue, newValue)));
            this.drawingObjects = drawingObjects;
            if (isRealObject(this.chartTitle)) {
                this.chartTitle.setDrawingObjects(drawingObjects);
            }
            if (isRealObject(this.hAxisTitle)) {
                this.hAxisTitle.setDrawingObjects(drawingObjects);
            }
            if (isRealObject(this.vAxisTitle)) {
                this.vAxisTitle.setDrawingObjects(drawingObjects);
            }
        }
    },
    getTransform: function () {
        return this.transform;
    },
    recalculatePosExt: function () {
        var xfrm;
        xfrm = this.spPr.xfrm;
        if (!isRealObject(this.group)) {
            this.x = xfrm.offX;
            this.y = xfrm.offY;
            this.extX = xfrm.extX;
            this.extY = xfrm.extY;
            this.updateDrawingBaseCoordinates();
        } else {
            var scale_scale_coefficients = this.group.getResultScaleCoefficients();
            this.x = scale_scale_coefficients.cx * (xfrm.offX - this.group.spPr.xfrm.chOffX);
            this.y = scale_scale_coefficients.cy * (xfrm.offY - this.group.spPr.xfrm.chOffY);
            this.extX = scale_scale_coefficients.cx * xfrm.extX;
            this.extY = scale_scale_coefficients.cy * xfrm.extY;
        }
        this.spPr.geometry.Recalculate(this.extX, this.extY);
    },
    recalculateTransform: function () {
        this.recalculatePosExt();
        this.recalculateMatrix();
    },
    recalculateMatrix: function () {
        this.transform.Reset();
        var hc, vc;
        hc = this.extX * 0.5;
        vc = this.extY * 0.5;
        this.spPr.geometry.Recalculate(this.extX, this.extY);
        global_MatrixTransformer.TranslateAppend(this.transform, -hc, -vc);
        global_MatrixTransformer.TranslateAppend(this.transform, this.x + hc, this.y + vc);
        if (isRealObject(this.group)) {
            global_MatrixTransformer.MultiplyAppend(this.transform, this.group.getTransform());
        }
        this.invertTransform = global_MatrixTransformer.Invert(this.transform);
        if (isRealObject(this.chartTitle)) {
            this.chartTitle.recalculateTransform();
            this.chartTitle.calculateTransformTextMatrix();
        }
        if (isRealObject(this.hAxisTitle)) {
            this.hAxisTitle.recalculateTransform();
            this.hAxisTitle.calculateTransformTextMatrix();
        }
        if (isRealObject(this.vAxisTitle)) {
            this.vAxisTitle.recalculateTransform();
            this.vAxisTitle.calculateTransformTextMatrix();
        }
    },
    recalculateTransform2: function () {
        var xfrm;
        if (isRealObject(this.drawingBase)) {
            xfrm = this.drawingBase.getGraphicObjectMetrics();
            xfrm.offX = xfrm.x;
            xfrm.offY = xfrm.y;
        } else {
            xfrm = this.spPr.xfrm;
        }
        if (!isRealObject(this.group)) {
            this.x = xfrm.offX;
            this.y = xfrm.offY;
            this.extX = xfrm.extX;
            this.extY = xfrm.extY;
            this.updateDrawingBaseCoordinates();
        } else {
            var scale_scale_coefficients = this.group.getResultScaleCoefficients();
            this.x = scale_scale_coefficients.cx * (xfrm.offX - this.group.spPr.xfrm.chOffX);
            this.y = scale_scale_coefficients.cy * (xfrm.offY - this.group.spPr.xfrm.chOffY);
            this.extX = scale_scale_coefficients.cx * xfrm.extX;
            this.extY = scale_scale_coefficients.cy * xfrm.extY;
        }
        this.transform.Reset();
        var hc, vc;
        hc = this.extX * 0.5;
        vc = this.extY * 0.5;
        this.spPr.geometry.Recalculate(this.extX, this.extY);
        global_MatrixTransformer.TranslateAppend(this.transform, -hc, -vc);
        global_MatrixTransformer.TranslateAppend(this.transform, this.x + hc, this.y + vc);
        if (isRealObject(this.group)) {
            global_MatrixTransformer.MultiplyAppend(this.transform, this.group.getTransform());
        }
        this.invertTransform = global_MatrixTransformer.Invert(this.transform);
    },
    setXfrmObject: function (xfrm) {
        var oldId = isRealObject(this.spPr.xfrm) ? this.spPr.xfrm.Get_Id() : null;
        var newId = isRealObject(xfrm) ? xfrm.Get_Id() : null;
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_SetXfrm, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(oldId, newId)));
        this.spPr.xfrm = xfrm;
    },
    init: function (theme) {
        if (isRealObject(this.drawingBase)) {
            var metrics = this.drawingBase.getGraphicObjectMetrics();
            this.setXfrmObject(new CXfrm());
            this.spPr.xfrm.setPosition(metrics.x, metrics.y);
            this.spPr.xfrm.setExtents(metrics.extX, metrics.extY);
        }
        var api = window["Asc"]["editor"];
        if (isRealObject(this.chartTitle)) {
            this.chartTitle.setType(CHART_TITLE_TYPE_TITLE);
            this.chartTitle.drawingObjects = this.drawingObjects;
            if (this.chartTitle.isEmpty()) {
                if (this.chart.header && this.chart.header.bDefaultTitle) {
                    var title_str = api.chartTranslate.title;
                    this.chartTitle.setTextBody(new CTextBody(this.chartTitle));
                    for (var i in title_str) {
                        this.chartTitle.txBody.content.Paragraph_Add(CreateParagraphContent(title_str[i]), false);
                    }
                    this.chart.header.title = this.chartTitle.txBody.content.getTextString();
                    this.chart.header.bDefaultTitle = false;
                } else {
                    this.addTitle(null);
                }
            } else {
                var content = this.chartTitle.txBody.content;
                content.setParent(this.chartTitle.txBody);
                content.setDrawingDocument(this.drawingObjects.drawingDocument);
                for (var i = 0; i < content.Content.length; ++i) {
                    content.Content[i].setDrawingDocument(this.drawingObjects.drawingDocument);
                    content.Content[i].setParent(content);
                    content.Content[i].setTextPr(new ParaTextPr());
                    content.Content[i].checkThemeFonts(theme);
                }
                this.chart.header.title = this.chartTitle.txBody.content.getTextString();
            }
        }
        if (isRealObject(this.hAxisTitle) && isRealObject(this.hAxisTitle.txBody) && isRealObject(this.hAxisTitle.txBody.content)) {
            this.hAxisTitle.setType(CHART_TITLE_TYPE_H_AXIS);
            this.hAxisTitle.drawingObjects = this.drawingObjects;
            if (this.hAxisTitle.isEmpty()) {
                if (this.chart.xAxis && this.chart.xAxis.bDefaultTitle) {
                    var title_str = api.chartTranslate.xAxis;
                    this.hAxisTitle.setTextBody(new CTextBody(this.hAxisTitle));
                    for (var i in title_str) {
                        this.hAxisTitle.txBody.content.Paragraph_Add(CreateParagraphContent(title_str[i]), false);
                    }
                    this.chart.xAxis.title = this.hAxisTitle.txBody.content.getTextString();
                    this.chart.xAxis.bDefaultTitle = false;
                } else {
                    this.addXAxis(null);
                }
            } else {
                var content = this.hAxisTitle.txBody.content;
                content.setParent(this.hAxisTitle.txBody);
                content.setDrawingDocument(this.drawingObjects.drawingDocument);
                for (var i = 0; i < content.Content.length; ++i) {
                    content.Content[i].setDrawingDocument(this.drawingObjects.drawingDocument);
                    content.Content[i].setParent(content);
                    content.Content[i].setTextPr(new ParaTextPr());
                    content.Content[i].checkThemeFonts(theme);
                }
                this.chart.xAxis.title = this.hAxisTitle.txBody.content.getTextString();
            }
        } else {
            this.addXAxis(null);
        }
        if (isRealObject(this.vAxisTitle) && isRealObject(this.vAxisTitle.txBody) && isRealObject(this.vAxisTitle.txBody.content)) {
            this.vAxisTitle.setType(CHART_TITLE_TYPE_V_AXIS);
            this.vAxisTitle.drawingObjects = this.drawingObjects;
            if (this.vAxisTitle.isEmpty()) {
                if (this.chart.yAxis && this.chart.yAxis.bDefaultTitle) {
                    var title_str = api.chartTranslate.yAxis;
                    this.vAxisTitle.setTextBody(new CTextBody(this.vAxisTitle));
                    this.vAxisTitle.txBody.setVert(90);
                    for (var i in title_str) {
                        this.vAxisTitle.txBody.content.Paragraph_Add(CreateParagraphContent(title_str[i]), false);
                    }
                    this.chart.yAxis.title = this.vAxisTitle.txBody.content.getTextString();
                    this.chart.yAxis.bDefaultTitle = false;
                } else {
                    this.addYAxis(null);
                }
            } else {
                this.vAxisTitle.txBody.setVert(90);
                var content = this.vAxisTitle.txBody.content;
                content.setParent(this.vAxisTitle.txBody);
                content.setDrawingDocument(this.drawingObjects.drawingDocument);
                for (var i = 0; i < content.Content.length; ++i) {
                    content.Content[i].setDrawingDocument(this.drawingObjects.drawingDocument);
                    content.Content[i].setParent(content);
                    content.Content[i].setTextPr(new ParaTextPr());
                    content.Content[i].checkThemeFonts(theme);
                }
                this.chart.yAxis.title = this.vAxisTitle.txBody.content.getTextString();
            }
        } else {
            this.addYAxis(null);
        }
        this.recalculate();
    },
    setChart: function (chart, isCollaborative) {
        var sheetId = this.drawingObjects.getWorksheet() ? this.drawingObjects.getWorksheet().model.Id : null;
        if (! (isCollaborative === true)) {
            History.Create_NewPoint();
            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformUndo, sheetId, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
        }
        if ((this.chart.type != chart.type) || (isCollaborative === true)) {
            History.Add(g_oUndoRedoGraphicObjects, historyitem_Chart_Type, sheetId, null, new UndoRedoDataGraphicObjects(this.chart.Get_Id(), new UndoRedoDataGOSingleProp(this.chart.type, chart.type)));
            this.chart.type = chart.type;
        }
        if ((this.chart.subType != chart.subType) || (isCollaborative === true)) {
            History.Add(g_oUndoRedoGraphicObjects, historyitem_Chart_SubType, sheetId, null, new UndoRedoDataGraphicObjects(this.chart.Get_Id(), new UndoRedoDataGOSingleProp(this.chart.subType, chart.subType)));
            this.chart.subType = chart.subType;
        }
        var bChangeColors = false;
        if ((this.chart.styleId != chart.styleId) || (isCollaborative === true)) {
            bChangeColors = true;
            History.Add(g_oUndoRedoGraphicObjects, historyitem_Chart_Style, sheetId, null, new UndoRedoDataGraphicObjects(this.chart.Get_Id(), new UndoRedoDataGOSingleProp(this.chart.styleId, chart.styleId)));
            this.chart.styleId = chart.styleId;
        }
        if ((this.chart.bShowValue != chart.bShowValue) || (isCollaborative === true)) {
            History.Add(g_oUndoRedoGraphicObjects, historyitem_Chart_IsShowValue, sheetId, null, new UndoRedoDataGraphicObjects(this.chart.Get_Id(), new UndoRedoDataGOSingleProp(this.chart.bShowValue, chart.bShowValue)));
            this.chart.bShowValue = chart.bShowValue;
        }
        if ((this.chart.bShowBorder != chart.bShowBorder) || (isCollaborative === true)) {
            History.Add(g_oUndoRedoGraphicObjects, historyitem_Chart_IsShowBorder, sheetId, null, new UndoRedoDataGraphicObjects(this.chart.Get_Id(), new UndoRedoDataGOSingleProp(this.chart.bShowBorder, chart.bShowBorder)));
            this.chart.bShowBorder = chart.bShowBorder;
        }
        if ((this.chart.range.interval != chart.range.interval) || (isCollaborative === true)) {
            History.Add(g_oUndoRedoGraphicObjects, historyitem_Chart_RangeInterval, sheetId, null, new UndoRedoDataGraphicObjects(this.chart.Get_Id(), new UndoRedoDataGOSingleProp(this.chart.range.interval, chart.range.interval)));
            this.chart.range.interval = chart.range.interval;
            this.chart.range.intervalObject = convertFormula(this.chart.range.interval, this.drawingObjects.getWorksheet());
            this.chart.rebuildSeries();
        }
        if ((this.chart.range.rows != chart.range.rows) || (isCollaborative === true)) {
            History.Add(g_oUndoRedoGraphicObjects, historyitem_Chart_RangeRowColumns, sheetId, null, new UndoRedoDataGraphicObjects(this.chart.Get_Id(), new UndoRedoDataGOSingleProp(this.chart.range.rows, chart.range.rows)));
            this.chart.range.rows = chart.range.rows;
            this.chart.range.columns = !chart.range.rows;
        }
        if ((this.chart.header.title != chart.header.title) || (isCollaborative === true)) {
            History.Add(g_oUndoRedoGraphicObjects, historyitem_Chart_HeaderTitle, sheetId, null, new UndoRedoDataGraphicObjects(this.chart.Get_Id(), new UndoRedoDataGOSingleProp(this.chart.header.title, chart.header.title)));
            this.chart.header.title = chart.header.title;
            if (! (isCollaborative === true)) {
                if (typeof this.chart.header.title === "string" && this.chart.header.title.length > 0) {
                    var chart_title = new CChartTitle(this, CHART_TITLE_TYPE_TITLE);
                    var tx_body = new CTextBody(chart_title);
                    var title_str = chart.header.title;
                    for (var i in title_str) {
                        tx_body.content.Paragraph_Add(CreateParagraphContent(title_str[i]));
                    }
                    chart_title.setTextBody(tx_body);
                    this.addTitle(chart_title);
                } else {
                    this.addTitle(null);
                }
            }
        }
        if ((this.chart.header.subTitle != chart.header.subTitle) || (isCollaborative === true)) {
            History.Add(g_oUndoRedoGraphicObjects, historyitem_Chart_HeaderSubTitle, sheetId, null, new UndoRedoDataGraphicObjects(this.chart.Get_Id(), new UndoRedoDataGOSingleProp(this.chart.header.subTitle, chart.header.subTitle)));
            this.chart.header.subTitle = chart.header.subTitle;
        }
        if ((this.chart.header.bDefaultTitle != chart.header.bDefaultTitle) || (isCollaborative === true)) {
            History.Add(g_oUndoRedoGraphicObjects, historyitem_Chart_IsDefaultHeaderTitle, sheetId, null, new UndoRedoDataGraphicObjects(this.chart.Get_Id(), new UndoRedoDataGOSingleProp(this.chart.header.bDefaultTitle, chart.header.bDefaultTitle)));
            this.chart.header.bDefaultTitle = chart.header.bDefaultTitle;
        }
        if ((this.chart.xAxis.title != chart.xAxis.title) || (isCollaborative === true)) {
            History.Add(g_oUndoRedoGraphicObjects, historyitem_Chart_xAxisTitle, sheetId, null, new UndoRedoDataGraphicObjects(this.chart.Get_Id(), new UndoRedoDataGOSingleProp(this.chart.xAxis.title, chart.xAxis.title)));
            this.chart.xAxis.title = chart.xAxis.title;
            if (! (isCollaborative === true)) {
                if (typeof this.chart.xAxis.title === "string" && this.chart.xAxis.title.length > 0) {
                    var chart_title = new CChartTitle(this, CHART_TITLE_TYPE_H_AXIS);
                    var tx_body = new CTextBody(chart_title);
                    var title_str = this.chart.xAxis.title;
                    for (var i in title_str) {
                        tx_body.content.Paragraph_Add(CreateParagraphContent(title_str[i]));
                    }
                    chart_title.setTextBody(tx_body);
                    this.addXAxis(chart_title);
                } else {
                    this.addXAxis(null);
                }
            }
        }
        if ((this.chart.xAxis.bDefaultTitle != chart.xAxis.bDefaultTitle) || (isCollaborative === true)) {
            History.Add(g_oUndoRedoGraphicObjects, historyitem_Chart_xAxisIsDefaultTitle, sheetId, null, new UndoRedoDataGraphicObjects(this.chart.Get_Id(), new UndoRedoDataGOSingleProp(this.chart.xAxis.bDefaultTitle, chart.xAxis.bDefaultTitle)));
            this.chart.xAxis.bDefaultTitle = chart.xAxis.bDefaultTitle;
        }
        if ((this.chart.xAxis.bShow != chart.xAxis.bShow) || (isCollaborative === true)) {
            History.Add(g_oUndoRedoGraphicObjects, historyitem_Chart_xAxisIsShow, sheetId, null, new UndoRedoDataGraphicObjects(this.chart.Get_Id(), new UndoRedoDataGOSingleProp(this.chart.xAxis.bShow, chart.xAxis.bShow)));
            this.chart.xAxis.bShow = chart.xAxis.bShow;
            if (!this.chart.xAxis.bShow) {
                this.addXAxis(null);
            } else {
                if (typeof this.chart.xAxis.title === "string" && this.chart.xAxis.title.length > 0) {
                    var chart_title = new CChartTitle(this, CHART_TITLE_TYPE_H_AXIS);
                    var tx_body = new CTextBody(chart_title);
                    var title_str = this.chart.xAxis.title;
                    for (var i in title_str) {
                        tx_body.content.Paragraph_Add(CreateParagraphContent(title_str[i]));
                    }
                    chart_title.setTextBody(tx_body);
                    this.addXAxis(chart_title);
                } else {
                    this.addXAxis(null);
                }
            }
        }
        if ((this.chart.xAxis.bGrid != chart.xAxis.bGrid) || (isCollaborative === true)) {
            History.Add(g_oUndoRedoGraphicObjects, historyitem_Chart_xAxisIsGrid, sheetId, null, new UndoRedoDataGraphicObjects(this.chart.Get_Id(), new UndoRedoDataGOSingleProp(this.chart.xAxis.bGrid, chart.xAxis.bGrid)));
            this.chart.xAxis.bGrid = chart.xAxis.bGrid;
        }
        if ((this.chart.yAxis.title != chart.yAxis.title) || (isCollaborative === true)) {
            History.Add(g_oUndoRedoGraphicObjects, historyitem_Chart_yAxisTitle, sheetId, null, new UndoRedoDataGraphicObjects(this.chart.Get_Id(), new UndoRedoDataGOSingleProp(this.chart.yAxis.title, chart.yAxis.title)));
            this.chart.yAxis.title = chart.yAxis.title;
            if (! (isCollaborative === true)) {
                if (typeof this.chart.yAxis.title === "string" && this.chart.yAxis.title.length > 0) {
                    var chart_title = new CChartTitle(this, CHART_TITLE_TYPE_V_AXIS);
                    var tx_body = new CTextBody(chart_title);
                    tx_body.setVert(90);
                    var title_str = this.chart.yAxis.title;
                    for (var i in title_str) {
                        tx_body.content.Paragraph_Add(CreateParagraphContent(title_str[i]));
                    }
                    chart_title.setTextBody(tx_body);
                    this.addYAxis(chart_title);
                } else {
                    this.addYAxis(null);
                }
            }
        }
        if ((this.chart.yAxis.bDefaultTitle != chart.yAxis.bDefaultTitle) || (isCollaborative === true)) {
            History.Add(g_oUndoRedoGraphicObjects, historyitem_Chart_yAxisIsDefaultTitle, sheetId, null, new UndoRedoDataGraphicObjects(this.chart.Get_Id(), new UndoRedoDataGOSingleProp(this.chart.yAxis.bDefaultTitle, chart.yAxisbDefaultTitle)));
            this.chart.yAxis.bDefaultTitle = chart.yAxis.bDefaultTitle;
        }
        if ((this.chart.yAxis.bShow != chart.yAxis.bShow) || (isCollaborative === true)) {
            History.Add(g_oUndoRedoGraphicObjects, historyitem_Chart_yAxisIsShow, sheetId, null, new UndoRedoDataGraphicObjects(this.chart.Get_Id(), new UndoRedoDataGOSingleProp(this.chart.yAxis.bShow, chart.yAxis.bShow)));
            this.chart.yAxis.bShow = chart.yAxis.bShow;
            if (!this.chart.yAxis.bShow) {
                this.addYAxis(null);
            } else {
                if (typeof this.chart.yAxis.title === "string" && this.chart.yAxis.title.length > 0) {
                    var chart_title = new CChartTitle(this, CHART_TITLE_TYPE_V_AXIS);
                    var tx_body = new CTextBody(chart_title);
                    tx_body.setVert(90);
                    var title_str = this.chart.yAxis.title;
                    for (var i in title_str) {
                        tx_body.content.Paragraph_Add(CreateParagraphContent(title_str[i]));
                    }
                    chart_title.setTextBody(tx_body);
                    this.addYAxis(chart_title);
                } else {
                    this.addYAxis(null);
                }
            }
        }
        if ((this.chart.yAxis.bGrid != chart.yAxis.bGrid) || (isCollaborative === true)) {
            History.Add(g_oUndoRedoGraphicObjects, historyitem_Chart_yAxisIsGrid, sheetId, null, new UndoRedoDataGraphicObjects(this.chart.Get_Id(), new UndoRedoDataGOSingleProp(this.chart.yAxis.bGrid, chart.yAxis.bGrid)));
            this.chart.yAxis.bGrid = chart.yAxis.bGrid;
        }
        if ((this.chart.legend.position != chart.legend.position) || (isCollaborative === true)) {
            History.Add(g_oUndoRedoGraphicObjects, historyitem_Chart_LegendPosition, sheetId, null, new UndoRedoDataGraphicObjects(this.chart.Get_Id(), new UndoRedoDataGOSingleProp(this.chart.legend.position, chart.legend.position)));
            this.chart.legend.position = chart.legend.position;
        }
        if ((this.chart.legend.bShow != chart.legend.bShow) || (isCollaborative === true)) {
            History.Add(g_oUndoRedoGraphicObjects, historyitem_Chart_LegendIsShow, sheetId, null, new UndoRedoDataGraphicObjects(this.chart.Get_Id(), new UndoRedoDataGOSingleProp(this.chart.legend.bShow, chart.legend.bShow)));
            this.chart.legend.bShow = chart.legend.bShow;
        }
        if ((this.chart.legend.bOverlay != chart.legend.bOverlay) || (isCollaborative === true)) {
            History.Add(g_oUndoRedoGraphicObjects, historyitem_Chart_LegendIsOverlay, sheetId, null, new UndoRedoDataGraphicObjects(this.chart.Get_Id(), new UndoRedoDataGOSingleProp(this.chart.legend.bOverlay, chart.legend.bOverlay)));
            this.chart.legend.bOverlay = chart.legend.bOverlay;
        }
        if (! (isCollaborative === true)) {
            this.chart.rebuildSeries(bChangeColors);
            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformRedo, sheetId, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
        }
    },
    addXAxis: function (title) {
        var oldValue = isRealObject(this.hAxisTitle) ? this.hAxisTitle.Get_Id() : null;
        var newValue = isRealObject(title) ? title.Get_Id() : null;
        this.hAxisTitle = title;
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_AddXAxis, null, null, new UndoRedoDataGraphicObjects(this.Id, new UndoRedoDataGOSingleProp(oldValue, newValue)), null);
    },
    addYAxis: function (title) {
        var oldValue = isRealObject(this.vAxisTitle) ? this.vAxisTitle.Get_Id() : null;
        var newValue = isRealObject(title) ? title.Get_Id() : null;
        this.vAxisTitle = title;
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_AddYAxis, null, null, new UndoRedoDataGraphicObjects(this.Id, new UndoRedoDataGOSingleProp(oldValue, newValue)), null);
    },
    addTitle: function (title) {
        var oldValue = isRealObject(this.chartTitle) ? this.chartTitle.Get_Id() : null;
        var newValue = isRealObject(title) ? title.Get_Id() : null;
        this.chartTitle = title;
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_AddTitle, null, null, new UndoRedoDataGraphicObjects(this.Id, new UndoRedoDataGOSingleProp(oldValue, newValue)), null);
    },
    deleteDrawingBase: function () {
        var position = this.drawingObjects.deleteDrawingBase(this.Get_Id());
        if (isRealNumber(position)) {
            var data = new UndoRedoDataGOSingleProp(position, null);
            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_DeleteDrawingBase, null, null, new UndoRedoDataGraphicObjects(this.Id, data), null);
            this.drawingObjects.controller.addContentChanges(new CContentChangesElement(contentchanges_Remove, data.oldValue, 1, data));
        }
        return position;
    },
    addToDrawingObjects: function (pos, bLock) {
        var position = this.drawingObjects.addGraphicObject(this, pos, !(bLock === false));
        var data = new UndoRedoDataGOSingleProp(position, null);
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_Add_To_Drawing_Objects, null, null, new UndoRedoDataGraphicObjects(this.Id, data), null);
        this.drawingObjects.controller.addContentChanges(new CContentChangesElement(contentchanges_Add, data.oldValue, 1, data));
    },
    initFromChartObject: function (chart, options) {
        this.setAscChart(chart);
        this.setXfrmObject(new CXfrm());
        var xfrm = this.spPr.xfrm;
        var chartLeft = this.drawingObjects.convertMetric(options && options.left ? ptToPx(options.left) : (parseInt($("#ws-canvas").css("width")) / 2) - c_oAscChartDefines.defaultChartWidth / 2, 0, 3);
        var chartTop = this.drawingObjects.convertMetric(options && options.top ? ptToPx(options.top) : (parseInt($("#ws-canvas").css("height")) / 2) - c_oAscChartDefines.defaultChartHeight / 2, 0, 3);
        xfrm.setPosition(chartLeft, chartTop);
        var w = this.drawingObjects.convertMetric(c_oAscChartDefines.defaultChartWidth, 0, 3),
        h = this.drawingObjects.convertMetric(c_oAscChartDefines.defaultChartHeight, 0, 3);
        if (isRealObject(options)) {
            if (isRealNumber(options.width) && isRealNumber(options.height)) {
                w = this.drawingObjects.convertMetric(options.width, 0, 3);
                h = this.drawingObjects.convertMetric(options.height, 0, 3);
            }
        }
        xfrm.setExtents(w, h);
        if (isRealObject(this.chart.header)) {
            var title_string;
            if (this.chart.header.bDefaultTitle || !(typeof this.chart.header.title === "string")) {
                title_string = this.chart.header.title;
            } else {
                title_string = this.chart.header.title;
            }
            this.addTitle(new CChartTitle(this, CHART_TITLE_TYPE_TITLE));
            this.chartTitle.setTextBody(new CTextBody(this.chartTitle));
            for (var i in title_string) {
                this.chartTitle.txBody.content.Paragraph_Add(CreateParagraphContent(title_string[i]), false);
            }
        }
        if (isRealObject(this.chart.xAxis) && this.chart.xAxis.bShow) {
            if (this.chart.xAxis.bDefaultTitle || !(typeof this.chart.xAxis.title === "string")) {
                title_string = this.chart.xAxis.title;
            } else {
                title_string = this.chart.xAxis.title;
            }
            this.addXAxis(new CChartTitle(this, CHART_TITLE_TYPE_H_AXIS));
            this.hAxisTitle.setTextBody(new CTextBody(this.hAxisTitle));
            for (var i in title_string) {
                this.hAxisTitle.txBody.content.Paragraph_Add(CreateParagraphContent(title_string[i]), false);
            }
        }
        if (isRealObject(this.chart.yAxis) && this.chart.yAxis.bShow) {
            if (this.chart.yAxis.bDefaultTitle || !(typeof this.chart.yAxis.title === "string")) {
                title_string = this.chart.yAxis.title;
            } else {
                title_string = this.chart.yAxis.title;
            }
            this.addYAxis(new CChartTitle(this, CHART_TITLE_TYPE_V_AXIS));
            this.vAxisTitle.setTextBody(new CTextBody(this.vAxisTitle));
            this.vAxisTitle.txBody.setVert(90);
            for (var i in title_string) {
                this.vAxisTitle.txBody.content.Paragraph_Add(CreateParagraphContent(title_string[i]), false);
            }
        }
        this.init();
        this.addToDrawingObjects();
        this.setChart(this.chart, true);
        this.recalculate();
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformRedo, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
    },
    setDrawingBase: function (drawingBase) {
        this.drawingBase = drawingBase;
    },
    createRotateInGroupTrack: function () {
        return new RotateTrackShapeImageInGroup(this);
    },
    createResizeInGroupTrack: function (cardDirection) {
        return new ResizeTrackShapeImageInGroup(this, cardDirection);
    },
    createMoveInGroupTrack: function () {
        return new MoveShapeImageTrackInGroup(this);
    },
    setChartTitle: function (chartTitle) {
        this.chartTitle = chartTitle;
    },
    setXAxisTitle: function (xAxisTitle) {
        this.hAxisTitle = xAxisTitle;
    },
    setYAxisTitle: function (yAxisTitle) {
        this.vAxisTitle = yAxisTitle;
    },
    recalculateTitleAfterMove: function () {
        if (isRealObject(this.chartTitle)) {
            var title = this.chartTitle;
            var tx_body = title.txBody;
            var body_pr = tx_body.bodyPr;
            body_pr.rIns = 0.3;
            body_pr.lIns = 0.3;
            body_pr.tIns = 0.3;
            body_pr.bIns = 0;
            var paragraphs = tx_body.content.Content;
            for (var i = 0; i < paragraphs.length; ++i) {
                paragraphs[i].Pr.Jc = align_Center;
                paragraphs[i].Pr.Spacing.After = 0;
                paragraphs[i].Pr.Spacing.Before = 0;
            }
            paragraphs[0].Pr.Spacing.Before = 0.75;
            var title_height, title_width;
            if (! (isRealObject(title.layout) && title.layout.isManual)) {
                var max_content_width = this.extX * 0.8 - (body_pr.rIns + body_pr.lIns);
                tx_body.content.Reset(0, 0, max_content_width, 20000);
                tx_body.content.Recalculate_Page(0, true);
                var result_width;
                if (! (tx_body.content.Content.length > 1 || tx_body.content.Content[0].Lines.length > 1)) {
                    if (tx_body.content.Content[0].Lines[0].Ranges[0].W < max_content_width) {
                        tx_body.content.Reset(0, 0, tx_body.content.Content[0].Lines[0].Ranges[0].W, 20000);
                        tx_body.content.Recalculate_Page(0, true);
                    }
                    result_width = tx_body.content.Content[0].Lines[0].Ranges[0].W + body_pr.rIns + body_pr.lIns;
                } else {
                    var width = 0;
                    for (var i = 0; i < tx_body.content.Content.length; ++i) {
                        var par = tx_body.content.Content[i];
                        for (var j = 0; j < par.Lines.length; ++j) {
                            if (par.Lines[j].Ranges[0].W > width) {
                                width = par.Lines[j].Ranges[0].W;
                            }
                        }
                    }
                    result_width = width + body_pr.rIns + body_pr.lIns;
                }
                this.chartTitle.extX = result_width;
                this.chartTitle.extY = tx_body.content.Get_SummaryHeight();
                this.chartTitle.x = (this.extX - this.chartTitle.extX) * 0.5;
                this.chartTitle.y = this.drawingObjects.convertMetric(7, 0, 3);
                this.chartTitle.transform.Reset();
                global_MatrixTransformer.TranslateAppend(this.chartTitle.transform, this.chartTitle.x, this.chartTitle.y);
                global_MatrixTransformer.MultiplyAppend(this.chartTitle.transform, this.transform);
                this.chartTitle.invertTransform = global_MatrixTransformer.Invert(this.chartTitle.transform);
                this.chartTitle.calculateTransformTextMatrix();
                title_width = this.chartTitle.extX;
                title_height = this.chartTitle.y + this.chartTitle.extY;
            } else {
                var max_content_width = this.extX * 0.8 - (body_pr.rIns + body_pr.lIns);
                tx_body.content.Reset(0, 0, max_content_width, 20000);
                tx_body.content.Recalculate_Page(0, true);
                var result_width;
                if (! (tx_body.content.Content.length > 1 || tx_body.content.Content[0].Lines.length > 1)) {
                    if (tx_body.content.Content[0].Lines[0].Ranges[0].W < max_content_width) {
                        tx_body.content.Reset(0, 0, tx_body.content.Content[0].Lines[0].Ranges[0].W, 20000);
                        tx_body.content.Recalculate_Page(0, true);
                    }
                    result_width = tx_body.content.Content[0].Lines[0].Ranges[0].W + body_pr.rIns + body_pr.lIns;
                } else {
                    var width = 0;
                    for (var i = 0; i < tx_body.content.Content.length; ++i) {
                        var par = tx_body.content.Content[i];
                        for (var j = 0; j < par.Lines.length; ++j) {
                            if (par.Lines[j].Ranges[0].W > width) {
                                width = par.Lines[j].Ranges[0].W;
                            }
                        }
                    }
                    result_width = width + body_pr.rIns + body_pr.lIns;
                }
                this.chartTitle.extX = result_width;
                this.chartTitle.extY = tx_body.content.Get_SummaryHeight();
                if (this.chartTitle.layout.xMode === LAYOUT_MODE_EDGE) {
                    this.chartTitle.x = this.extX * this.chartTitle.layout.x;
                } else {
                    this.chartTitle.x = (this.extX - this.chartTitle.extX) * 0.5;
                }
                if (this.chartTitle.layout.yMode === LAYOUT_MODE_EDGE) {
                    this.chartTitle.y = this.extY * this.chartTitle.layout.y;
                } else {
                    this.chartTitle.y = this.drawingObjects.convertMetric(7, 0, 3);
                }
                this.chartTitle.transform.Reset();
                global_MatrixTransformer.TranslateAppend(this.chartTitle.transform, this.chartTitle.x, this.chartTitle.y);
                global_MatrixTransformer.MultiplyAppend(this.chartTitle.transform, this.transform);
                this.chartTitle.invertTransform = global_MatrixTransformer.Invert(this.chartTitle.transform);
                this.chartTitle.calculateTransformTextMatrix();
                title_width = this.chartTitle.extX;
                title_height = this.drawingObjects.convertMetric(7, 0, 3) + this.chartTitle.extY;
            }
        }
    },
    getSelectedTitle: function () {
        if (this.chartTitle && this.chartTitle.selected) {
            return this.chartTitle;
        }
        if (this.hAxisTitle && this.hAxisTitle.selected) {
            return this.hAxisTitle;
        }
        if (this.vAxisTitle && this.vAxisTitle.selected) {
            return this.vAxisTitle;
        }
        return null;
    },
    draw: function (graphics) {
        graphics.SetIntegerGrid(false);
        graphics.transform3(this.transform, false);
        var shape_drawer = new CShapeDrawer();
        shape_drawer.fromShape2(this, graphics, this.spPr.geometry);
        shape_drawer.draw(this.spPr.geometry);
        if (graphics instanceof CGraphics) {
            var transform = this.transform;
            var extX = this.extX;
            var extY = this.extY;
            if (!isRealObject(this.group)) {
                graphics.SetIntegerGrid(false);
                graphics.transform3(transform, false);
                if (!graphics.m_oContext.isOverlay) {
                    graphics.DrawLockObjectRect(this.lockType, 0, 0, extX, extY);
                }
                graphics.reset();
                graphics.SetIntegerGrid(true);
            }
        }
        graphics.reset();
        graphics.SetIntegerGrid(true);
        graphics.SaveGrState();
        graphics.SetIntegerGrid(false);
        graphics.transform3(this.transform);
        graphics.AddClipRect(-1, -1, this.extX + 1, this.extY + 1);
        if (this.chartTitle) {
            this.chartTitle.draw(graphics);
        }
        if (this.hAxisTitle) {
            this.hAxisTitle.draw(graphics);
        }
        if (this.vAxisTitle) {
            this.vAxisTitle.draw(graphics);
        }
        graphics.RestoreGrState();
    },
    check_bounds: function (checker) {
        if (this.spPr.geometry) {
            this.spPr.geometry.check_bounds(checker);
        } else {
            checker._s();
            checker._m(0, 0);
            checker._l(this.extX, 0);
            checker._l(this.extX, this.extY);
            checker._l(0, this.extY);
            checker._z();
            checker._e();
        }
    },
    isSimpleObject: function () {
        return false;
    },
    getArrGraphicObjects: function () {
        return [];
    },
    select: function (drawingObjectsController) {
        this.selected = true;
        var selected_objects;
        if (!isRealObject(this.group)) {
            selected_objects = drawingObjectsController.selectedObjects;
        } else {
            selected_objects = this.group.getMainGroup().selectedObjects;
        }
        for (var i = 0; i < selected_objects.length; ++i) {
            if (selected_objects[i] === this) {
                break;
            }
        }
        if (i === selected_objects.length) {
            selected_objects.push(this);
        }
    },
    deselect: function (drawingObjectsController) {
        this.selected = false;
        var selected_objects;
        if (!isRealObject(this.group)) {
            selected_objects = drawingObjectsController.selectedObjects;
        } else {
            selected_objects = this.group.getMainGroup().selectedObjects;
        }
        for (var i = 0; i < selected_objects.length; ++i) {
            if (selected_objects[i] === this) {
                selected_objects.splice(i, 1);
                break;
            }
        }
        this.resetSelection();
    },
    resetSelection: function () {
        if (isRealObject(this.chartTitle)) {
            this.chartTitle.deselect();
        }
        if (isRealObject(this.hAxisTitle)) {
            this.hAxisTitle.deselect();
        }
        if (isRealObject(this.vAxisTitle)) {
            this.vAxisTitle.deselect();
        }
    },
    hitInBoundingRect: function () {
        return false;
    },
    hitToAdjustment: function (x, y) {
        return {
            hit: false,
            adjPolarFlag: null,
            adjNum: null
        };
    },
    hitToHandles: function (x, y) {
        var invert_transform = this.getInvertTransform();
        var t_x, t_y;
        t_x = invert_transform.TransformPointX(x, y);
        t_y = invert_transform.TransformPointY(x, y);
        var radius = this.drawingObjects.convertMetric(TRACK_CIRCLE_RADIUS, 0, 3);
        var sqr_x = t_x * t_x,
        sqr_y = t_y * t_y;
        if (Math.sqrt(sqr_x + sqr_y) < radius) {
            return 0;
        }
        var hc = this.extX * 0.5;
        var dist_x = t_x - hc;
        sqr_x = dist_x * dist_x;
        if (Math.sqrt(sqr_x + sqr_y) < radius) {
            return 1;
        }
        dist_x = t_x - this.extX;
        sqr_x = dist_x * dist_x;
        if (Math.sqrt(sqr_x + sqr_y) < radius) {
            return 2;
        }
        var vc = this.extY * 0.5;
        var dist_y = t_y - vc;
        sqr_y = dist_y * dist_y;
        if (Math.sqrt(sqr_x + sqr_y) < radius) {
            return 3;
        }
        dist_y = t_y - this.extY;
        sqr_y = dist_y * dist_y;
        if (Math.sqrt(sqr_x + sqr_y) < radius) {
            return 4;
        }
        dist_x = t_x - hc;
        sqr_x = dist_x * dist_x;
        if (Math.sqrt(sqr_x + sqr_y) < radius) {
            return 5;
        }
        dist_x = t_x;
        sqr_x = dist_x * dist_x;
        if (Math.sqrt(sqr_x + sqr_y) < radius) {
            return 6;
        }
        dist_y = t_y - vc;
        sqr_y = dist_y * dist_y;
        if (Math.sqrt(sqr_x + sqr_y) < radius) {
            return 7;
        }
        var rotate_distance = this.drawingObjects.convertMetric(TRACK_DISTANCE_ROTATE, 0, 3);
        dist_y = t_y + rotate_distance;
        sqr_y = dist_y * dist_y;
        dist_x = t_x - hc;
        sqr_x = dist_x * dist_x;
        if (Math.sqrt(sqr_x + sqr_y) < radius) {
            return 8;
        }
        return -1;
    },
    recalculate: function () {
        this.recalculatePosExt();
        this.recalculateTransform();
        if (isRealObject(this.chartTitle)) {
            var max_title_width = this.extX * 0.8;
            var title_width = this.chartTitle.txBody.getRectWidth(max_title_width);
            var bodyPr = this.chartTitle.txBody.getBodyPr();
            this.chartTitle.extX = title_width;
            this.chartTitle.extY = this.chartTitle.txBody.getRectHeight(this.extY, title_width - (bodyPr.rIns + bodyPr.lIns));
            this.chartTitle.spPr.geometry.Recalculate(this.chartTitle.extX, this.chartTitle.extY);
            if (isRealObject(this.chartTitle.layout) && isRealNumber(this.chartTitle.layout.x)) {
                this.chartTitle.x = this.extX * this.chartTitle.layout.x;
                if (this.chartTitle.x + this.chartTitle.extX > this.extX) {
                    this.chartTitle.x = this.extX - this.chartTitle.extX;
                }
                if (this.chartTitle.x < 0) {
                    this.chartTitle.x = 0;
                }
            } else {
                this.chartTitle.x = (this.extX - this.chartTitle.extX) * 0.5;
            }
            if (isRealObject(this.chartTitle.layout) && isRealNumber(this.chartTitle.layout.y)) {
                this.chartTitle.y = this.extY * this.chartTitle.layout.y;
                if (this.chartTitle.y + this.chartTitle.extY > this.extY) {
                    this.chartTitle.y = this.extY - this.chartTitle.extY;
                }
                if (this.chartTitle.y < 0) {
                    this.chartTitle.y = 0;
                }
            } else {
                this.chartTitle.y = this.drawingObjects.convertMetric(7, 0, 3);
            }
            this.chartTitle.recalculateTransform();
            this.chartTitle.calculateContent();
            this.chartTitle.calculateTransformTextMatrix();
        }
        if (isRealObject(this.hAxisTitle)) {
            var max_title_widh = this.extX * 0.8;
            var bodyPr = this.hAxisTitle.txBody.getBodyPr();
            var title_width = this.hAxisTitle.txBody.getRectWidth(max_title_width);
            this.hAxisTitle.extX = title_width;
            this.hAxisTitle.extY = this.hAxisTitle.txBody.getRectHeight(this.extY, title_width - (bodyPr.rIns + bodyPr.lIns));
            this.hAxisTitle.spPr.geometry.Recalculate(this.hAxisTitle.extX, this.hAxisTitle.extY);
        }
        if (isRealObject(this.vAxisTitle)) {
            var max_title_height = this.extY * 0.8;
            var body_pr = this.vAxisTitle.txBody.getBodyPr();
            this.vAxisTitle.extY = this.vAxisTitle.txBody.getRectWidth(max_title_height) - body_pr.rIns - body_pr.lIns + body_pr.tIns + body_pr.bIns;
            this.vAxisTitle.extX = this.vAxisTitle.txBody.getRectHeight(this.extX, this.vAxisTitle.extY) - (-body_pr.rIns - body_pr.lIns + body_pr.tIns + body_pr.bIns);
            this.vAxisTitle.spPr.geometry.Recalculate(this.vAxisTitle.extX, this.vAxisTitle.extY);
        }
        var lInd, tInd, rInd, bInd;
        tInd = this.drawingObjects.convertMetric(7, 0, 3) + (isRealObject(this.chartTitle) ? this.chartTitle.extY : 0);
        lInd = this.drawingObjects.convertMetric(7, 0, 3) + (isRealObject(this.vAxisTitle) ? this.vAxisTitle.extX : 0);
        rInd = 0;
        bInd = this.drawingObjects.convertMetric(7, 0, 3) + (isRealObject(this.hAxisTitle) ? this.hAxisTitle.extY : 0);
        if (isRealObject(this.vAxisTitle)) {
            if (isRealObject(this.vAxisTitle.layout) && isRealNumber(this.vAxisTitle.layout.x)) {
                this.vAxisTitle.x = this.extX * this.vAxisTitle.layout.x;
                if (this.vAxisTitle.x + this.vAxisTitle.extX > this.extX) {
                    this.vAxisTitle.x = this.extX - this.vAxisTitle.extX;
                }
                if (this.vAxisTitle.x < 0) {
                    this.vAxisTitle.x = 0;
                }
            } else {
                this.vAxisTitle.x = this.drawingObjects.convertMetric(7, 0, 3);
            }
            if (isRealObject(this.vAxisTitle.layout) && isRealNumber(this.vAxisTitle.layout.y)) {
                this.vAxisTitle.y = this.extY * this.vAxisTitle.layout.y;
                if (this.vAxisTitle.y + this.vAxisTitle.extY > this.extY) {
                    this.vAxisTitle.y = this.extY - this.vAxisTitle.extY;
                }
                if (this.vAxisTitle.y < 0) {
                    this.vAxisTitle.y = 0;
                }
            } else {
                this.vAxisTitle.y = (this.extY - this.vAxisTitle.extY) * 0.5;
                if (this.vAxisTitle.y < tInd) {
                    this.vAxisTitle.y = tInd;
                }
            }
            this.vAxisTitle.recalculateTransform();
            this.vAxisTitle.calculateContent();
            this.vAxisTitle.calculateTransformTextMatrix();
        }
        if (isRealObject(this.hAxisTitle)) {
            if (isRealObject(this.hAxisTitle.layout) && isRealNumber(this.hAxisTitle.layout.x)) {
                this.hAxisTitle.x = this.extX * this.hAxisTitle.layout.x;
                if (this.hAxisTitle.x + this.hAxisTitle.extX > this.extX) {
                    this.hAxisTitle.x = this.extX - this.hAxisTitle.extX;
                }
                if (this.hAxisTitle.x < 0) {
                    this.hAxisTitle.x = 0;
                }
            } else {
                this.hAxisTitle.x = ((this.extX - rInd) - (lInd + this.drawingObjects.convertMetric(25, 0, 3)) - this.hAxisTitle.extX) * 0.5 + lInd + this.drawingObjects.convertMetric(25, 0, 3);
                if (this.hAxisTitle.x < lInd + this.drawingObjects.convertMetric(25, 0, 3)) {
                    this.hAxisTitle.x = lInd + this.drawingObjects.convertMetric(25, 0, 3);
                }
            }
            if (isRealObject(this.hAxisTitle.layout) && isRealNumber(this.hAxisTitle.layout.y)) {
                this.hAxisTitle.y = this.extY * this.hAxisTitle.layout.y;
                if (this.hAxisTitle.y + this.hAxisTitle.extY > this.extY) {
                    this.hAxisTitle.y = this.extY - this.hAxisTitle.extY;
                }
                if (this.hAxisTitle.y < 0) {
                    this.hAxisTitle.y = 0;
                }
            } else {
                this.hAxisTitle.y = this.extY - bInd;
            }
            this.hAxisTitle.recalculateTransform();
            this.hAxisTitle.calculateContent();
            this.hAxisTitle.calculateTransformTextMatrix();
        }
        var title_margin = {
            w: 0,
            h: 0
        },
        key = {
            w: 0,
            h: 0
        },
        xAxisTitle = {
            w: 0,
            h: 0
        },
        yAxisTitle = {
            w: 0,
            h: 0
        };
        if (isRealObject(this.chartTitle)) {
            if (!this.chartTitle.overlay) {
                title_margin = {
                    w: this.drawingObjects.convertMetric(this.chartTitle.extX, 3, 0),
                    h: 7 + this.drawingObjects.convertMetric(this.chartTitle.extY, 3, 0)
                };
            }
        }
        if (isRealObject(this.hAxisTitle)) {
            if (!this.hAxisTitle.overlay) {
                xAxisTitle = {
                    w: this.drawingObjects.convertMetric(this.hAxisTitle.extX, 3, 0),
                    h: 7 + this.drawingObjects.convertMetric(this.hAxisTitle.extY, 3, 0)
                };
            }
        }
        if (isRealObject(this.vAxisTitle)) {
            if (!this.vAxisTitle.overlay) {
                yAxisTitle = {
                    w: 7 + this.drawingObjects.convertMetric(this.vAxisTitle.extX, 3, 0),
                    h: this.drawingObjects.convertMetric(this.vAxisTitle.extY, 3, 0)
                };
            }
        }
        this.chart.margins = {
            key: key,
            xAxisTitle: xAxisTitle,
            yAxisTitle: yAxisTitle,
            title: title_margin
        };
        if (!this.chart.range.intervalObject) {
            this.drawingObjects.intervalToIntervalObject(this.chart);
        }
        this.brush.fill.canvas = this.drawingObjects.getChartRender().insertChart(this.chart, null, this.drawingObjects.convertMetric(this.extX, 3, 0), this.drawingObjects.convertMetric(this.extY, 3, 0));
        this.brush.fill.RasterImageId = "";
        this.updateDrawingBaseCoordinates();
    },
    getInvertTransform: function () {
        return this.invertTransform;
    },
    drawAdjustments: function () {},
    hitInWorkArea: function (x, y) {
        var tx = this.invertTransform.TransformPointX(x, y);
        var ty = this.invertTransform.TransformPointY(x, y);
        return tx > 0 && tx < this.extX && ty > 0 && ty < this.extY;
    },
    canGroup: function () {
        return true;
    },
    canRotate: function () {
        return false;
    },
    canResize: function () {
        return true;
    },
    canMove: function () {
        return true;
    },
    createMoveTrack: function () {
        return new MoveTrackChart(this);
    },
    createResizeTrack: function (cardDirection) {
        return new ResizeTrackChart(this, cardDirection);
    },
    getAspect: function (num) {
        var _tmp_x = this.extX != 0 ? this.extX : 0.1;
        var _tmp_y = this.extY != 0 ? this.extY : 0.1;
        return num === 0 || num === 4 ? _tmp_x / _tmp_y : _tmp_y / _tmp_x;
    },
    getCardDirectionByNum: function (num) {
        var num_north = this.getNumByCardDirection(CARD_DIRECTION_N);
        return ((num - num_north) + CARD_DIRECTION_N + 8) % 8;
    },
    getNumByCardDirection: function (cardDirection) {
        var hc = this.extX * 0.5;
        var vc = this.extY * 0.5;
        var transform = this.getTransform();
        var y1, y3, y5, y7;
        y1 = transform.TransformPointY(hc, 0);
        y3 = transform.TransformPointY(this.extX, vc);
        y5 = transform.TransformPointY(hc, this.extY);
        y7 = transform.TransformPointY(0, vc);
        var north_number;
        var full_flip_h = false;
        var full_flip_v = false;
        switch (Math.min(y1, y3, y5, y7)) {
        case y1:
            north_number = !full_flip_v ? 1 : 5;
            break;
        case y3:
            north_number = !full_flip_h ? 3 : 7;
            break;
        case y5:
            north_number = !full_flip_v ? 5 : 1;
            break;
        default:
            north_number = !full_flip_h ? 7 : 3;
            break;
        }
        return (north_number + cardDirection) % 8;
    },
    getResizeCoefficients: function (numHandle, x, y) {
        var cx, cy;
        cx = this.extX > 0 ? this.extX : 0.01;
        cy = this.extY > 0 ? this.extY : 0.01;
        var invert_transform = this.getInvertTransform();
        var t_x = invert_transform.TransformPointX(x, y);
        var t_y = invert_transform.TransformPointY(x, y);
        switch (numHandle) {
        case 0:
            return {
                kd1: (cx - t_x) / cx,
                kd2: (cy - t_y) / cy
            };
        case 1:
            return {
                kd1: (cy - t_y) / cy,
                kd2: 0
            };
        case 2:
            return {
                kd1: (cy - t_y) / cy,
                kd2: t_x / cx
            };
        case 3:
            return {
                kd1: t_x / cx,
                kd2: 0
            };
        case 4:
            return {
                kd1: t_x / cx,
                kd2: t_y / cy
            };
        case 5:
            return {
                kd1: t_y / cy,
                kd2: 0
            };
        case 6:
            return {
                kd1: t_y / cy,
                kd2: (cx - t_x) / cx
            };
        case 7:
            return {
                kd1: (cx - t_x) / cx,
                kd2: 0
            };
        }
        return {
            kd1: 1,
            kd2: 1
        };
    },
    getRectBounds: function () {
        var transform = this.getTransform();
        var w = this.extX;
        var h = this.extY;
        var rect_points = [{
            x: 0,
            y: 0
        },
        {
            x: w,
            y: 0
        },
        {
            x: w,
            y: h
        },
        {
            x: 0,
            y: h
        }];
        var min_x, max_x, min_y, max_y;
        min_x = transform.TransformPointX(rect_points[0].x, rect_points[0].y);
        min_y = transform.TransformPointY(rect_points[0].x, rect_points[0].y);
        max_x = min_x;
        max_y = min_y;
        var cur_x, cur_y;
        for (var i = 1; i < 4; ++i) {
            cur_x = transform.TransformPointX(rect_points[i].x, rect_points[i].y);
            cur_y = transform.TransformPointY(rect_points[i].x, rect_points[i].y);
            if (cur_x < min_x) {
                min_x = cur_x;
            }
            if (cur_x > max_x) {
                max_x = cur_x;
            }
            if (cur_y < min_y) {
                min_y = cur_y;
            }
            if (cur_y > max_y) {
                max_y = cur_y;
            }
        }
        return {
            minX: min_x,
            maxX: max_x,
            minY: min_y,
            maxY: max_y
        };
    },
    setPosition: function (x, y) {
        if (!this.spPr.xfrm) {
            this.setXfrmObject(new CXfrm());
        }
        this.spPr.xfrm.setPosition(x, y);
    },
    setExtents: function (extX, extY) {
        if (!this.spPr.xfrm) {
            this.setXfrmObject(new CXfrm());
        }
        this.spPr.xfrm.setExtents(extX, extY);
    },
    calculateTransformTextMatrix: function () {},
    updateDrawingBaseCoordinates: function () {
        if (isRealObject(this.drawingBase)) {
            this.drawingBase.setGraphicObjectCoords();
        }
    },
    recalculateAfterResize: function () {
        this.recalculateTransform2();
        if (isRealObject(this.chartTitle)) {
            var title = this.chartTitle;
            var tx_body = title.txBody;
            var body_pr = tx_body.bodyPr;
            body_pr.rIns = 0.3;
            body_pr.lIns = 0.3;
            body_pr.tIns = 0.3;
            body_pr.bIns = 0;
            var paragraphs = tx_body.content.Content;
            tx_body.content.DrawingDocument = this.drawingObjects.drawingDocument;
            for (var i = 0; i < paragraphs.length; ++i) {
                paragraphs[i].DrawingDocument = this.drawingObjects.drawingDocument;
                paragraphs[i].Pr.Jc = align_Center;
                paragraphs[i].Pr.Spacing.After = 0;
                paragraphs[i].Pr.Spacing.Before = 0;
            }
            paragraphs[0].Pr.Spacing.Before = 0.75;
            var title_height, title_width;
            if (! (isRealObject(title.layout) && title.layout.isManual)) {
                var max_content_width = this.extX * 0.8 - (body_pr.rIns + body_pr.lIns);
                tx_body.content.Reset(0, 0, max_content_width, 20000);
                tx_body.content.Recalculate_Page(0, true);
                var result_width;
                if (! (tx_body.content.Content.length > 1 || tx_body.content.Content[0].Lines.length > 1)) {
                    if (tx_body.content.Content[0].Lines[0].Ranges[0].W < max_content_width) {
                        tx_body.content.Reset(0, 0, tx_body.content.Content[0].Lines[0].Ranges[0].W, 20000);
                        tx_body.content.Recalculate_Page(0, true);
                    }
                    result_width = tx_body.content.Content[0].Lines[0].Ranges[0].W + body_pr.rIns + body_pr.lIns;
                } else {
                    var width = 0;
                    for (var i = 0; i < tx_body.content.Content.length; ++i) {
                        var par = tx_body.content.Content[i];
                        for (var j = 0; j < par.Lines.length; ++j) {
                            if (par.Lines[j].Ranges[0].W > width) {
                                width = par.Lines[j].Ranges[0].W;
                            }
                        }
                    }
                    result_width = width + body_pr.rIns + body_pr.lIns;
                }
                this.chartTitle.extX = result_width;
                this.chartTitle.extY = tx_body.content.Get_SummaryHeight();
                this.chartTitle.x = (this.extX - this.chartTitle.extX) * 0.5;
                this.chartTitle.y = this.drawingObjects.convertMetric(7, 0, 3);
                this.chartTitle.transform.Reset();
                global_MatrixTransformer.TranslateAppend(this.chartTitle.transform, this.chartTitle.x, this.chartTitle.y);
                global_MatrixTransformer.MultiplyAppend(this.chartTitle.transform, this.transform);
                this.chartTitle.invertTransform = global_MatrixTransformer.Invert(this.chartTitle.transform);
                this.chartTitle.calculateTransformTextMatrix();
                title_width = this.chartTitle.extX;
                title_height = this.chartTitle.y + this.chartTitle.extY;
            } else {
                var max_content_width = this.extX * 0.8 - (body_pr.rIns + body_pr.lIns);
                tx_body.content.Reset(0, 0, max_content_width, 20000);
                tx_body.content.Recalculate_Page(0, true);
                var result_width;
                if (! (tx_body.content.Content.length > 1 || tx_body.content.Content[0].Lines.length > 1)) {
                    if (tx_body.content.Content[0].Lines[0].Ranges[0].W < max_content_width) {
                        tx_body.content.Reset(0, 0, tx_body.content.Content[0].Lines[0].Ranges[0].W, 20000);
                        tx_body.content.Recalculate_Page(0, true);
                    }
                    result_width = tx_body.content.Content[0].Lines[0].Ranges[0].W + body_pr.rIns + body_pr.lIns;
                } else {
                    var width = 0;
                    for (var i = 0; i < tx_body.content.Content.length; ++i) {
                        var par = tx_body.content.Content[i];
                        for (var j = 0; j < par.Lines.length; ++j) {
                            if (par.Lines[j].Ranges[0].W > width) {
                                width = par.Lines[j].Ranges[0].W;
                            }
                        }
                    }
                    result_width = width + body_pr.rIns + body_pr.lIns;
                }
                this.chartTitle.extX = result_width;
                this.chartTitle.extY = tx_body.content.Get_SummaryHeight();
                if (this.chartTitle.layout.xMode === LAYOUT_MODE_EDGE) {
                    this.chartTitle.x = this.extX * this.chartTitle.layout.x;
                } else {
                    this.chartTitle.x = (this.extX - this.chartTitle.extX) * 0.5;
                }
                if (this.chartTitle.layout.yMode === LAYOUT_MODE_EDGE) {
                    this.chartTitle.y = this.extY * this.chartTitle.layout.y;
                } else {
                    this.chartTitle.y = this.drawingObjects.convertMetric(7, 0, 3);
                }
                if (this.chartTitle.x + this.chartTitle.extX > this.extX) {
                    this.chartTitle.x = this.extX - this.chartTitle.extX;
                }
                if (this.chartTitle.x < 0) {
                    this.chartTitle.x = 0;
                }
                if (this.chartTitle.y + this.chartTitle.extY > this.extY) {
                    this.chartTitle.y = this.extY - this.chartTitle.extY;
                }
                if (this.chartTitle.y < 0) {
                    this.chartTitle.y = 0;
                }
                this.chartTitle.transform.Reset();
                global_MatrixTransformer.TranslateAppend(this.chartTitle.transform, this.chartTitle.x, this.chartTitle.y);
                global_MatrixTransformer.MultiplyAppend(this.chartTitle.transform, this.transform);
                this.chartTitle.invertTransform = global_MatrixTransformer.Invert(this.chartTitle.transform);
                this.chartTitle.calculateTransformTextMatrix();
                title_width = this.chartTitle.extX;
                title_height = this.drawingObjects.convertMetric(7, 0, 3) + this.chartTitle.extY;
            }
            this.chartTitle.spPr.geometry.Recalculate(this.chartTitle.extX, this.chartTitle.extY);
            this.chartTitle.txBody.calculateContent();
        }
        var title_margin = {
            w: 0,
            h: 0
        },
        key = {
            w: 0,
            h: 0
        },
        xAxisTitle = {
            w: 0,
            h: 0
        },
        yAxisTitle = {
            w: 0,
            h: 0
        };
        if (isRealObject(this.chartTitle)) {
            if (!this.chartTitle.overlay) {
                title_margin = {
                    w: this.drawingObjects.convertMetric(title_width, 3, 0),
                    h: this.drawingObjects.convertMetric(title_height, 3, 0)
                };
            }
        }
        this.chart.margins = {
            key: key,
            xAxisTitle: xAxisTitle,
            yAxisTitle: yAxisTitle,
            title: title_margin
        };
        if (!this.chart.range.intervalObject) {
            this.drawingObjects.intervalToIntervalObject(this.chart);
        }
        this.brush.fill.canvas = this.drawingObjects.getChartRender().insertChart(this.chart, null, this.drawingObjects.convertMetric(this.extX, 3, 0), this.drawingObjects.convertMetric(this.extY, 3, 0));
        this.brush.fill.RasterImageId = "";
    },
    Undo: function (type, data) {
        switch (type) {
        case historyitem_AutoShapes_SetGroup:
            this.group = g_oTableId.Get_ById(data.oldValue);
            break;
        case historyitem_AutoShapes_SetPresetGeometry:
            this.spPr.geometry = g_oTableId.Get_ById(data.oldValue);
            break;
        case historyitem_AutoShapes_RecalculateTransformUndo:
            this.recalculate();
            break;
        case historyitem_AutoShapes_SetDrawingObjects:
            if (data.oldValue !== null) {
                var api = window["Asc"]["editor"];
                if (api.wb) {
                    var ws = api.wb.getWorksheetById(data.oldValue);
                    if (isRealObject(ws)) {
                        this.drawingObjects = ws.objectRender;
                    } else {
                        this.drawingObjects = null;
                    }
                }
            }
            break;
        case historyitem_AutoShapes_SetXfrm:
            this.spPr.xfrm = g_oTableId.Get_ById(data.oldValue);
            break;
        case historyitem_AutoShapes_Add_To_Drawing_Objects:
            this.drawingObjects.deleteDrawingBase(this.Id);
            break;
        case historyitem_AutoShapes_DeleteDrawingBase:
            this.drawingObjects.addGraphicObject(this, data.oldValue);
            break;
        case historyitem_AutoShapes_Set_AscChart:
            this.chart = g_oTableId.Get_ById(data.oldValue);
            break;
        case historyitem_AutoShapes_AddTitle:
            this.chartTitle = g_oTableId.Get_ById(data.oldValue);
            break;
        case historyitem_AutoShapes_AddXAxis:
            this.hAxisTitle = g_oTableId.Get_ById(data.oldValue);
            break;
        case historyitem_AutoShapes_AddYAxis:
            this.vAxisTitle = g_oTableId.Get_ById(data.oldValue);
            break;
        }
    },
    Redo: function (type, data) {
        switch (type) {
        case historyitem_AutoShapes_SetGroup:
            this.group = g_oTableId.Get_ById(data.newValue);
            break;
        case historyitem_AutoShapes_SetPresetGeometry:
            this.spPr.geometry = g_oTableId.Get_ById(data.newValue);
            break;
        case historyitem_AutoShapes_SetXfrm:
            this.spPr.xfrm = g_oTableId.Get_ById(data.newValue);
            break;
        case historyitem_AutoShapes_SetDrawingObjects:
            if (data.oldValue !== null) {
                var api = window["Asc"]["editor"];
                if (api.wb) {
                    var ws = api.wb.getWorksheetById(data.newValue);
                    if (isRealObject(ws)) {
                        this.drawingObjects = ws.objectRender;
                    } else {
                        this.drawingObjects = null;
                    }
                }
            }
            break;
        case historyitem_AutoShapes_RecalculateTransformRedo:
            this.recalculate();
            break;
        case historyitem_AutoShapes_Add_To_Drawing_Objects:
            var pos;
            if (data.bCollaborativeChanges) {
                pos = this.drawingObjects.controller.contentChanges.Check(contentchanges_Add, data.oldValue);
            } else {
                pos = data.oldValue;
            }
            this.drawingObjects.addGraphicObject(this, data.oldValue);
            break;
        case historyitem_AutoShapes_DeleteDrawingBase:
            var pos;
            if (data.bCollaborativeChanges) {
                pos = this.drawingObjects.controller.contentChanges.Check(contentchanges_Remove, data.oldValue);
            } else {
                pos = data.oldValue;
            }
            this.drawingObjects.deleteDrawingBase(this.Id);
            break;
        case historyitem_AutoShapes_Set_AscChart:
            this.chart = g_oTableId.Get_ById(data.newValue);
            break;
        case historyitem_AutoShapes_AddTitle:
            this.chartTitle = g_oTableId.Get_ById(data.newValue);
            break;
        case historyitem_AutoShapes_AddXAxis:
            this.hAxisTitle = g_oTableId.Get_ById(data.newValue);
            break;
        case historyitem_AutoShapes_AddYAxis:
            this.vAxisTitle = g_oTableId.Get_ById(data.newValue);
            break;
        case historyitem_AutoShapes_RecalculateAfterInit:
            this.recalculate();
            break;
        case historyitem_AutoShapes_RecalculateAfterInit2Chart:
            this.init();
            break;
        }
    },
    getAllFonts: function (AllFonts) {
        if (isRealObject(this.chartTitle)) {
            this.chartTitle.getAllFonts(AllFonts);
        }
        if (isRealObject(this.vAxisTitle)) {
            this.vAxisTitle.getAllFonts(AllFonts);
        }
        if (isRealObject(this.hAxisTitle)) {
            this.hAxisTitle.getAllFonts(AllFonts);
        }
    },
    getChartBinary: function () {
        var w = new CMemory();
        w.WriteBool(isRealObject(this.chartTitle));
        if (isRealObject(this.chartTitle)) {
            this.chartTitle.writeToBinary(w);
        }
        w.WriteBool(isRealObject(this.vAxisTitle));
        if (isRealObject(this.vAxisTitle)) {
            this.vAxisTitle.writeToBinary(w);
        }
        w.WriteBool(isRealObject(this.hAxisTitle));
        if (isRealObject(this.hAxisTitle)) {
            this.hAxisTitle.writeToBinary(w);
        }
        this.chart.Write_ToBinary2(w);
        this.spPr.Write_ToBinary2(w);
        return w.pos + ";" + w.GetBase64Memory();
    },
    setChartBinary: function (binary) {
        var r = CreateBinaryReader(binary, 0, binary.length);
        if (r.GetBool()) {
            this.chartTitle = new CChartTitle(this, CHART_TITLE_TYPE_TITLE);
            this.chartTitle.readFromBinary(r);
        }
        if (r.GetBool()) {
            this.vAxisTitle = new CChartTitle(this, CHART_TITLE_TYPE_V_AXIS);
            this.vAxisTitle.readFromBinary(r);
        }
        if (r.GetBool()) {
            this.hAxisTitle = new CChartTitle(this, CHART_TITLE_TYPE_H_AXIS);
            this.hAxisTitle.readFromBinary(r);
        }
        this.chart.Read_FromBinary2(r, false);
        this.spPr.Read_FromBinary2(r);
        var chartLeft = this.drawingObjects.convertMetric((parseInt($("#ws-canvas").css("width")) / 2) - c_oAscChartDefines.defaultChartWidth / 2, 0, 3);
        var chartTop = this.drawingObjects.convertMetric((parseInt($("#ws-canvas").css("height")) / 2) - c_oAscChartDefines.defaultChartHeight / 2, 0, 3);
        this.spPr.xfrm.setPosition(chartLeft, chartTop);
        this.init();
        this.addToDrawingObjects();
    },
    normalize: function () {
        var new_off_x, new_off_y, new_ext_x, new_ext_y;
        var xfrm = this.spPr.xfrm;
        if (!isRealObject(this.group)) {
            new_off_x = xfrm.offX;
            new_off_y = xfrm.offY;
            new_ext_x = xfrm.extX;
            new_ext_y = xfrm.extY;
        } else {
            var scale_scale_coefficients = this.group.getResultScaleCoefficients();
            new_off_x = scale_scale_coefficients.cx * (xfrm.offX - this.group.spPr.xfrm.chOffX);
            new_off_y = scale_scale_coefficients.cy * (xfrm.offY - this.group.spPr.xfrm.chOffY);
            new_ext_x = scale_scale_coefficients.cx * xfrm.extX;
            new_ext_y = scale_scale_coefficients.cy * xfrm.extY;
        }
        this.setPosition(new_off_x, new_off_y);
        this.setExtents(new_ext_x, new_ext_y);
    },
    getFullFlipH: function () {
        return false;
    },
    getFullFlipV: function () {
        return false;
    },
    getFullRotate: function () {
        return !isRealObject(this.group) ? 0 : this.group.getFullRotate();
    },
    setFlips: function () {},
    setRotate: function () {},
    copy: function (x, y) {
        var w = new CMemory();
        var bin = this.writeToBinaryForCopyPaste(w);
        bin = bin.substring("TeamLabChartSheets".length, bin.length - "TeamLabGroupSheets".length);
        var r = CreateBinaryReader(bin, 0, bin.length);
        var copy = new CChartAsGroup(null, this.drawingObjects);
        r.GetLong();
        copy.readFromBinaryForCopyPaste(r, this.group, this.drawingObjects, x, y);
        return copy;
    },
    setGeometry: function (geometry) {
        var oldId = this.spPr.geometry ? this.spPr.geometry.Get_Id() : null;
        this.spPr.geometry = geometry;
        var newId = this.spPr.geometry.Get_Id();
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_SetPresetGeometry, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(oldId, newId)));
    },
    writeToBinaryForCopyPaste: function (w) {
        w.WriteLong(CLASS_TYPE_CHART_AS_GROUP);
        w.WriteBool(isRealObject(this.chartTitle));
        if (isRealObject(this.chartTitle)) {
            this.chartTitle.writeToBinary(w);
        }
        w.WriteBool(isRealObject(this.vAxisTitle));
        if (isRealObject(this.vAxisTitle)) {
            this.vAxisTitle.writeToBinary(w);
        }
        w.WriteBool(isRealObject(this.hAxisTitle));
        if (isRealObject(this.hAxisTitle)) {
            this.hAxisTitle.writeToBinary(w);
        }
        this.chart.Write_ToBinary2(w);
        this.spPr.Write_ToBinary2(w);
        return "TeamLabChartSheets" + w.pos + ";" + w.GetBase64Memory();
    },
    readFromBinaryForCopyPaste: function (r, group, drawingObjects, x, y) {
        this.setGroup(group);
        this.setDrawingObjects(drawingObjects);
        if (r.GetBool()) {
            this.addTitle(new CChartTitle(this, CHART_TITLE_TYPE_TITLE));
            this.chartTitle.readFromBinary(r);
        }
        if (r.GetBool()) {
            this.addYAxis(new CChartTitle(this, CHART_TITLE_TYPE_V_AXIS));
            this.vAxisTitle.readFromBinary(r);
        }
        if (r.GetBool()) {
            this.addXAxis(new CChartTitle(this, CHART_TITLE_TYPE_H_AXIS));
            this.hAxisTitle.readFromBinary(r);
        }
        this.setAscChart(new asc_CChart());
        this.chart.Read_FromBinary2(r, false);
        this.setChart(this.chart, true);
        this.spPr.bwMode = r.GetBool();
        r.GetBool();
        this.setXfrmObject(new CXfrm());
        var Reader = r;
        var offX, offY, extX, extY, flipH = null,
        flipV = null,
        rot = null;
        var flag = Reader.GetBool();
        if (flag) {
            offX = Reader.GetDouble();
        }
        flag = Reader.GetBool();
        if (flag) {
            offY = Reader.GetDouble();
        }
        flag = Reader.GetBool();
        if (flag) {
            extX = Reader.GetDouble();
        }
        flag = Reader.GetBool();
        if (flag) {
            extY = Reader.GetDouble();
        }
        flag = Reader.GetBool();
        flag = Reader.GetBool();
        flag = Reader.GetBool();
        flag = Reader.GetBool();
        flag = Reader.GetBool();
        if (flag) {
            flipH = Reader.GetBool();
        }
        flag = Reader.GetBool();
        if (flag) {
            flipV = Reader.GetBool();
        }
        flag = Reader.GetBool();
        if (flag) {
            rot = Reader.GetDouble();
        }
        if (isRealNumber(offX) && isRealNumber(offY)) {
            this.setPosition(offX, offY);
        }
        if (isRealNumber(extX) && isRealNumber(extY)) {
            this.setExtents(extX, extY);
        }
        this.setFlips(flipH, flipV);
        if (isRealNumber(rot)) {
            this.setRotate(rot);
        }
        var flag = Reader.GetBool();
        if (flag) {
            var geometry = new CGeometry();
            geometry.Read_FromBinary2(Reader);
            geometry.Init(5, 5);
            this.setGeometry(geometry);
        }
        flag = Reader.GetBool();
        if (flag) {
            var Fill = new CUniFill();
            Fill.Read_FromBinary2(Reader);
        }
        flag = Reader.GetBool();
        if (flag) {
            var ln = new CLn();
            ln.Read_FromBinary2(Reader);
        }
        if (isRealNumber(x) && isRealNumber(y)) {
            this.spPr.xfrm.setPosition(x, y);
        }
        this.init();
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_InitChart, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
        if (!isRealObject(group)) {
            this.recalculate();
            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateAfterInit, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
        }
    },
    readFromBinaryForCopyPaste2: function (r, group, drawingObjects, x, y) {
        this.setGroup(group);
        this.setDrawingObjects(drawingObjects);
        this.drawingObjects = drawingObjects;
        if (isRealObject(this.chartTitle)) {
            this.chartTitle.drawingObjects = drawingObjects;
        }
        if (isRealObject(this.hAxisTitle)) {
            this.hAxisTitle.drawingObjects = drawingObjects;
        }
        if (isRealObject(this.vAxisTitle)) {
            this.vAxisTitle.drawingObjects = drawingObjects;
        }
        if (r.GetBool()) {
            this.addTitle(new CChartTitle(this, CHART_TITLE_TYPE_TITLE));
            this.chartTitle.drawingObjects = drawingObjects;
            this.chartTitle.readFromBinary(r);
        }
        if (r.GetBool()) {
            this.addYAxis(new CChartTitle(this, CHART_TITLE_TYPE_V_AXIS));
            this.vAxisTitle.drawingObjects = drawingObjects;
            this.vAxisTitle.readFromBinary(r);
        }
        if (r.GetBool()) {
            this.addXAxis(new CChartTitle(this, CHART_TITLE_TYPE_H_AXIS));
            this.hAxisTitle.drawingObjects = drawingObjects;
            this.hAxisTitle.readFromBinary(r);
        }
        this.setAscChart(new asc_CChart());
        this.chart.Read_FromBinary2(r, false);
        this.setChart(this.chart, true);
        this.spPr.bwMode = r.GetBool();
        r.GetBool();
        this.setXfrmObject(new CXfrm());
        var Reader = r;
        var offX, offY, extX, extY, flipH, flipV, rot;
        var flag = Reader.GetBool();
        if (flag) {
            offX = Reader.GetDouble();
        }
        flag = Reader.GetBool();
        if (flag) {
            offY = Reader.GetDouble();
        }
        flag = Reader.GetBool();
        if (flag) {
            extX = Reader.GetDouble();
        }
        flag = Reader.GetBool();
        if (flag) {
            extY = Reader.GetDouble();
        }
        flag = Reader.GetBool();
        flag = Reader.GetBool();
        flag = Reader.GetBool();
        flag = Reader.GetBool();
        flag = Reader.GetBool();
        if (flag) {
            flipH = Reader.GetBool();
        }
        flag = Reader.GetBool();
        if (flag) {
            flipV = Reader.GetBool();
        }
        flag = Reader.GetBool();
        if (flag) {
            rot = Reader.GetDouble();
        }
        if (isRealNumber(offX) && isRealNumber(offY)) {
            this.setPosition(offX, offY);
        }
        if (isRealNumber(extX) && isRealNumber(extY)) {
            this.setExtents(extX, extY);
        }
        this.setFlips(flipH, flipV);
        if (isRealNumber(rot)) {
            this.setRotate(rot);
        }
        var flag = Reader.GetBool();
        if (flag) {
            var geometry = new CGeometry();
            geometry.Read_FromBinary2(Reader);
            geometry.Init(5, 5);
            this.setGeometry(geometry);
        }
        flag = Reader.GetBool();
        if (flag) {
            var Fill = new CUniFill();
            Fill.Read_FromBinary2(Reader);
        }
        flag = Reader.GetBool();
        if (flag) {
            var ln = new CLn();
            ln.Read_FromBinary2(Reader);
        }
        if (isRealNumber(x) && isRealNumber(y)) {
            this.spPr.xfrm.setPosition(x, y);
        }
        this.init();
    },
    getBase64Image: function () {
        return ShapeToImageConverter(this, this.pageIndex).ImageUrl;
    }
};