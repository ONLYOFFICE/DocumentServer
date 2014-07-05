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
 var CLASS_TYPE_CHART_DATA = 9999;
function CChartAsGroup(parent, document, drawingDocument, group) {
    if (parent instanceof ParaDrawing) {
        this.parent = parent;
    }
    this.document = document;
    this.drawingDocument = drawingDocument;
    this.group = isRealObject(group) ? group : null;
    if (parent instanceof WordGroupShapes) {
        this.group = parent;
    }
    this.chartTitle = null;
    this.vAxisTitle = null;
    this.hAxisTitle = null;
    this.brush = new CBlipFill();
    this.spPr = new CSpPr();
    this.x = null;
    this.y = null;
    this.absExtX = null;
    this.absExtY = null;
    this.absOffsetX = 0;
    this.absOffsetY = 0;
    this.absRot = null;
    this.absFlipH = null;
    this.absFlipV = null;
    this.spPr.geometry = CreateGeometry("rect");
    this.spPr.geometry.Init(5, 5);
    this.brush = new CUniFill();
    this.brush.fill = new CBlipFill();
    this.brush.fill.RasterImageId = "";
    this.transform = new CMatrix();
    this.invertTransform = new CMatrix();
    this.ownTransform = new CMatrix();
    this.pageIndex = -1;
    this.selectedObjects = [];
    this.selected = false;
    this.mainGroup = null;
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
    this.bFirstRecalc = true;
}
CChartAsGroup.prototype = {
    asc_getChart: function () {
        return this.chart;
    },
    setAscChart: function (chart) {
        History.Add(this, {
            Type: historyitem_AutoShapes_AddChart,
            oldPr: this.chart,
            newPr: chart
        });
        this.chart = chart;
    },
    hitToTextRect: function () {
        return false;
    },
    calculateAfterChangeTheme: function () {
        this.recalculate();
    },
    calculateAfterOpen10: function () {
        this.init();
        this.recalcAllTitles();
        this.recalculate();
        this.recalculateTransform();
    },
    getArrayWrapPolygons: function () {
        if (this.spPr.geometry) {
            return this.spPr.geometry.getArrayPolygons();
        }
        return [];
    },
    getOwnTransform: function () {
        return this.transform;
    },
    getObjectType: function () {
        return CLASS_TYPE_CHART_AS_GROUP;
    },
    setPageIndex: function (pageIndex) {
        this.pageIndex = pageIndex;
        if (isRealObject(this.chartTitle)) {
            this.chartTitle.pageIndex = pageIndex;
        }
        if (isRealObject(this.hAxisTitle)) {
            this.hAxisTitle.pageIndex = pageIndex;
        }
        if (isRealObject(this.vAxisTitle)) {
            this.vAxisTitle.pageIndex = pageIndex;
        }
    },
    Get_Id: function () {
        return this.Id;
    },
    setDiagram: function (chart) {
        History.Add(this, {
            Type: historyitem_AutoShapes_RecalculateChartUndo
        });
        this.setAscChart(chart);
        this.recalculate();
        History.Add(this, {
            Type: historyitem_AutoShapes_RecalculateChartRedo
        });
    },
    OnContentReDraw: function () {
        if (isRealObject(this.parent)) {
            this.parent.OnContentReDraw();
        }
    },
    recalcAllColors: function () {},
    recalcAll: function () {},
    documentGetAllFontNames: function (AllFonts) {
        if (isRealObject(this.chartTitle)) {
            this.chartTitle.getAllFonts(AllFonts);
        }
        if (isRealObject(this.vAxisTitle)) {
            this.vAxisTitle.getAllFonts(AllFonts);
        }
        if (isRealObject(this.hAxisTitle)) {
            this.hAxisTitle.getAllFonts(AllFonts);
        }
        this.chart.legend && this.chart.legend.font && typeof this.chart.legend.font.name === "string" && this.chart.legend.font.name !== "" && (AllFonts[this.chart.legend.font.name] = true);
    },
    documentCreateFontMap: function (AllFonts) {
        if (isRealObject(this.chartTitle)) {
            this.chartTitle.getAllFonts(AllFonts);
        }
        if (isRealObject(this.vAxisTitle)) {
            this.vAxisTitle.getAllFonts(AllFonts);
        }
        if (isRealObject(this.hAxisTitle)) {
            this.hAxisTitle.getAllFonts(AllFonts);
        }
        this.chart.legend && this.chart.legend.font && typeof this.chart.legend.font.name === "string" && this.chart.legend.font.name !== "" && (AllFonts[this.chart.legend.font.name] = true);
    },
    setSizes: function (posX, posY, w, h, flipH, flipV) {
        var data = {};
        data.Type = historyitem_SetSizes;
        data.oldW = this.absExtX;
        data.oldH = this.absExtY;
        data.newW = w;
        data.newH = h;
        data.oldFlipH = this.absFlipH;
        data.oldFlipV = this.absFlipV;
        data.newFlipH = flipH;
        data.newFlipV = flipV;
        data.oldPosX = this.absOffsetX;
        data.oldPosY = this.absOffsetY;
        data.newPosX = posX;
        data.newPosY = posY;
        History.Add(this, data);
        this.spPr.xfrm.extX = w;
        this.spPr.xfrm.extY = h;
        this.absExtX = w;
        this.absExtY = h;
        this.absOffsetX = posX;
        this.absOffsetY = posY;
        if (this.parent) {
            this.parent.absOffsetX = posX;
            this.parent.absOffsetY = posY;
            this.parent.absExtX = w;
            this.parent.absExtY = h;
        }
        this.calculateAfterResize();
    },
    calculateAfterResize: function () {
        if (isRealObject(this.parent)) {
            this.parent.bNeedUpdateWH = true;
        }
        this.recalcAllTitles();
        this.recalculate();
    },
    updateCursorTypes: function () {
        this.cursorTypes = [];
        var transform = this.transform;
        if (transform == null) {
            transform = new CMatrix();
        }
        var vc = this.spPr.xfrm.extX * 0.5;
        var hc = this.spPr.xfrm.extY * 0.5;
        var xc = transform.TransformPointX(hc, vc);
        var yc = transform.TransformPointY(hc, vc);
        var xt = transform.TransformPointX(hc, 0);
        var yt = transform.TransformPointY(hc, 0);
        var vx = xt - xc;
        var vy = yc - yt;
        var angle = Math.atan2(vy, vx) + Math.PI / 8;
        if (angle < 0) {
            angle += 2 * Math.PI;
        }
        if (angle > 2 * Math.PI) {
            angle -= 2 * Math.PI;
        }
        var xlt = transform.TransformPointX(0, 0);
        var ylt = transform.TransformPointY(0, 0);
        var vx_lt = xlt - xc;
        var vy_lt = yc - ylt;
        var curTypes = [];
        curTypes[0] = "n-resize";
        curTypes[1] = "ne-resize";
        curTypes[2] = "e-resize";
        curTypes[3] = "se-resize";
        curTypes[4] = "s-resize";
        curTypes[5] = "sw-resize";
        curTypes[6] = "w-resize";
        curTypes[7] = "nw-resize";
        var _index = Math.floor(angle / (Math.PI / 4));
        var _index2, t;
        if (vx_lt * vy - vx * vy_lt < 0) {
            for (var i = 0; i < 8; ++i) {
                t = i - _index + 17;
                _index2 = t - ((t / 8) >> 0) * 8;
                this.cursorTypes[i] = curTypes[_index2];
            }
        } else {
            for (i = 0; i < 8; ++i) {
                t = -i - _index + 19;
                _index2 = t - ((t / 8) >> 0) * 8;
                this.cursorTypes[i] = curTypes[_index2];
            }
        }
    },
    setXfrm: function (offsetX, offsetY, extX, extY, rot, flipH, flipV) {
        var data = {
            Type: historyitem_SetXfrmShape
        };
        var _xfrm = this.spPr.xfrm;
        if (offsetX !== null) {
            data.oldOffsetX = _xfrm.offX;
            data.newOffsetX = offsetX;
            _xfrm.offX = offsetX;
        }
        if (offsetY !== null) {
            data.oldOffsetY = _xfrm.offY;
            data.newOffsetY = offsetY;
            _xfrm.offY = offsetY;
        }
        if (extX !== null) {
            data.oldExtX = _xfrm.extX;
            data.newExtX = extX;
            _xfrm.extX = extX;
        }
        if (extY !== null) {
            data.oldExtY = _xfrm.extY;
            data.newExtY = extY;
            _xfrm.extY = extY;
        }
        if (rot !== null) {
            data.oldRot = _xfrm.rot == null ? 0 : _xfrm.rot;
            data.newRot = rot;
            _xfrm.rot = rot;
        }
        if (flipH !== null) {
            data.oldFlipH = _xfrm.flipH == null ? false : _xfrm.flipH;
            data.newFlipH = flipH;
            _xfrm.flipH = flipH;
        }
        if (flipV !== null) {
            data.oldFlipV = _xfrm.flipV == null ? false : _xfrm.flipV;
            data.newFlipV = flipV;
            _xfrm.flipV = flipV;
        }
        History.Add(this, data);
    },
    getBoundsInGroup: function () {
        return {
            minX: this.x,
            minY: this.y,
            maxX: this.x + this.absExtX,
            maxY: this.y + this.absExtY
        };
        var r = this.rot;
        if ((r >= 0 && r < Math.PI * 0.25) || (r > 3 * Math.PI * 0.25 && r < 5 * Math.PI * 0.25) || (r > 7 * Math.PI * 0.25 && r < 2 * Math.PI)) {} else {
            var hc = this.absExtX * 0.5;
            var vc = this.absExtY * 0.5;
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
    hit: function (x, y) {
        var invert_transform = this.getInvertTransform();
        var tx = invert_transform.TransformPointX(x, y);
        var ty = invert_transform.TransformPointY(x, y);
        return tx >= 0 && tx <= this.absExtX && ty >= 0 && ty <= this.absExtY;
    },
    hitInTextRect: function () {
        return false;
    },
    setGroup: function (group) {
        var data = {};
        data.Type = historyitem_SetGroup;
        data.oldGroup = this.group;
        data.newGroup = group;
        History.Add(this, data);
        this.group = group;
    },
    hitInInnerArea: function (x, y) {
        var invert_transform = this.getInvertTransform();
        var x_t = invert_transform.TransformPointX(x, y);
        var y_t = invert_transform.TransformPointY(x, y);
        if (isRealObject(this.spPr.geometry)) {
            return this.spPr.geometry.hitInInnerArea(editor.WordControl.m_oLogicDocument.DrawingDocument.CanvasHitContext, x_t, y_t);
        }
        return x_t > 0 && x_t < this.absExtX && y_t > 0 && y_t < this.absExtY;
    },
    hitInPath: function (x, y) {
        var invert_transform = this.getInvertTransform();
        var x_t = invert_transform.TransformPointX(x, y);
        var y_t = invert_transform.TransformPointY(x, y);
        if (isRealObject(this.spPr.geometry)) {
            return this.spPr.geometry.hitInPath(editor.WordControl.m_oLogicDocument.DrawingDocument.CanvasHitContext, x_t, y_t);
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
        Props.Width = this.absExtX;
        Props.Height = this.absExtY;
        if (!isRealObject(OtherProps)) {
            return Props;
        }
        OtherProps.Width = OtherProps.Width === Props.Width ? Props.Width : undefined;
        OtherProps.Height = OtherProps.Height === Props.Height ? Props.Height : undefined;
        return OtherProps;
    },
    getTransform: function () {
        return this.transform;
    },
    calculateContent: function () {},
    hitToPath: function () {
        return false;
    },
    recalculatePosExt: function () {
        var xfrm;
        xfrm = this.spPr.xfrm;
        if (!isRealObject(this.group)) {
            this.absExtX = xfrm.extX;
            this.absExtY = xfrm.extY;
        } else {
            this.absOffsetX = xfrm.offX;
            this.absOffsetY = xfrm.offY;
            this.absExtX = xfrm.extX;
            this.absExtY = xfrm.extY;
        }
        if (this.parent) {
            this.parent.absExtX = this.absExtX;
            this.parent.absExtY = this.absExtY;
        }
        this.spPr.geometry.Recalculate(this.absExtX, this.absExtY);
    },
    recalculateTransform: function () {
        this.recalculatePosExt();
        this.recalculateMatrix();
    },
    getTransformMatrix: function () {
        return this.transform;
    },
    recalculateMatrix: function () {
        this.transform.Reset();
        var hc, vc;
        hc = this.absExtX * 0.5;
        vc = this.absExtY * 0.5;
        this.spPr.geometry.Recalculate(this.absExtX, this.absExtY);
        global_MatrixTransformer.TranslateAppend(this.transform, -hc, -vc);
        global_MatrixTransformer.TranslateAppend(this.transform, this.absOffsetX + hc, this.absOffsetY + vc);
        if (isRealObject(this.group)) {
            global_MatrixTransformer.MultiplyAppend(this.transform, this.group.getTransform());
        }
        this.invertTransform = global_MatrixTransformer.Invert(this.transform);
        this.ownTransform = this.transform.CreateDublicate();
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
    calculateAfterOpen: function () {
        this.init();
    },
    syncAscChart: function () {
        if (this.chartTitle && this.chartTitle.txBody && this.chartTitle.txBody.content) {
            this.chart.asc_getHeader().asc_setTitle(getTextString(this.chartTitle.txBody.content));
        }
        if (this.vAxisTitle && this.vAxisTitle.txBody && this.vAxisTitle.txBody.content) {
            this.chart.asc_getYAxis().asc_setTitle(getTextString(this.vAxisTitle.txBody.content));
        }
        if (this.hAxisTitle && this.hAxisTitle.txBody && this.hAxisTitle.txBody.content) {
            this.chart.asc_getXAxis().asc_setTitle(getTextString(this.hAxisTitle.txBody.content));
        }
    },
    setChart: function (chart, bEdit) {
        if (typeof this.chart.header.title === "string") {
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
        if (typeof this.chart.xAxis.title === "string") {
            var chart_title = new CChartTitle(this, CHART_TITLE_TYPE_H_AXIS);
            var tx_body = new CTextBody(chart_title);
            var title_str = this.chart.xAxis.title;
            for (var i in title_str) {
                tx_body.content.Paragraph_Add(CreateParagraphContent(title_str[i]));
            }
            chart_title.setTextBody(tx_body);
            this.addXAxis(chart_title);
        }
        if (typeof this.chart.yAxis.title === "string") {
            var chart_title = new CChartTitle(this, CHART_TITLE_TYPE_H_AXIS);
            var tx_body = new CTextBody(chart_title);
            var title_str = this.chart.yAxis.title;
            for (var i in title_str) {
                tx_body.content.Paragraph_Add(CreateParagraphContent(title_str[i]));
            }
            chart_title.setTextBody(tx_body);
            this.addYAxis(chart_title);
        }
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
    draw: function (graphics, pageIndex) {
        graphics.SetIntegerGrid(false);
        graphics.transform3(this.transform, false);
        var shape_drawer = new CShapeDrawer();
        shape_drawer.fromShape2(this, graphics, this.spPr.geometry);
        shape_drawer.draw(this.spPr.geometry);
        graphics.reset();
        graphics.SetIntegerGrid(true);
        graphics.SaveGrState();
        graphics.SetIntegerGrid(false);
        graphics.transform3(this.transform);
        graphics.AddClipRect(-1, -1, this.absExtX + 1, this.absExtY + 1);
        graphics.RestoreGrState();
    },
    check_bounds: function (checker) {
        if (this.spPr.geometry) {
            this.spPr.geometry.check_bounds(checker);
        } else {
            checker._s();
            checker._m(0, 0);
            checker._l(this.absExtX, 0);
            checker._l(this.absExtX, this.absExtY);
            checker._l(0, this.absExtY);
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
    select: function (pageIndex) {
        this.selected = true;
        if (typeof pageIndex === "number") {
            this.selectStartPage = pageIndex;
        }
    },
    deselect: function () {
        this.selected = false;
        this.selectStartPage = -1;
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
    getPageIndex: function () {
        return this.pageIndex;
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
    applyTextPr: function (paraItem, bRecalculate) {
        if (this.chartTitle) {
            this.chartTitle.applyTextPr(paraItem, bRecalculate);
        }
        if (this.hAxisTitle) {
            this.hAxisTitle.applyTextPr(paraItem, bRecalculate);
        }
        if (this.vAxisTitle) {
            this.vAxisTitle.applyTextPr(paraItem, bRecalculate);
        }
    },
    transformPointRelativeShape: function (x, y) {
        var invert_transform = this.getInvertTransform();
        var t_x, t_y;
        t_x = invert_transform.TransformPointX(x, y);
        t_y = invert_transform.TransformPointY(x, y);
        return {
            x: t_x,
            y: t_y
        };
    },
    hitToHandles: function (x, y) {
        var invert_transform = this.getInvertTransform();
        var t_x, t_y;
        t_x = invert_transform.TransformPointX(x, y);
        t_y = invert_transform.TransformPointY(x, y);
        var radius = this.drawingObjects.convertMetric(TRACK_CIRCLE_RADIUS, 0, 3);
        var sqr_x = t_x * t_y,
        sqr_y = t_y * t_y;
        if (Math.sqrt(sqr_x + sqr_y) < radius) {
            return 0;
        }
        var hc = this.absExtX * 0.5;
        var dist_x = t_x - hc;
        sqr_x = dist_x * dist_x;
        if (Math.sqrt(sqr_x + sqr_y) < radius) {
            return 1;
        }
        dist_x = t_x - this.absExtX;
        sqr_x = dist_x * dist_x;
        if (Math.sqrt(sqr_x + sqr_y) < radius) {
            return 2;
        }
        var vc = this.absExtY * 0.5;
        var dist_y = t_y - vc;
        sqr_y = dist_y * dist_y;
        if (Math.sqrt(sqr_x + sqr_y) < radius) {
            return 3;
        }
        dist_y = t_y - this.absExtY;
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
    Refresh_RecalcData: function (Data) {
        if (this.group == null && isRealObject(this.parent)) {
            this.parent.Refresh_RecalcData();
        } else {
            if (isRealObject(this.group)) {
                var cur_group = this.group;
                while (isRealObject(cur_group.group)) {
                    cur_group = cur_group.group;
                }
                if (isRealObject(cur_group.parent)) {
                    cur_group.parent.Refresh_RecalcData();
                }
            }
        }
    },
    Refresh_RecalcData2: function () {
        if (this.group == null && isRealObject(this.parent)) {
            History.RecalcData_Add({
                Type: historyrecalctype_Flow,
                Data: this.parent
            });
        } else {
            if (isRealObject(this.group)) {
                var cur_group = this.group;
                while (isRealObject(cur_group.group)) {
                    cur_group = cur_group.group;
                }
                if (isRealObject(cur_group.parent)) {
                    History.RecalcData_Add({
                        Type: historyrecalctype_Flow,
                        Data: cur_group.parent
                    });
                }
            }
        }
    },
    recalculate: function (updateImage) {
        try {
            this.recalculatePosExt();
            this.recalculateTransform();
        } catch(e) {}
    },
    getBase64Img: function () {
        return ShapeToImageConverter(this, this.pageIndex).ImageUrl;
    },
    initFromBinary: function (binary) {
        this.setChartBinary(binary);
    },
    chartModify: function (chart) {
        this.setChartBinary(chart);
        this.calculateAfterResize();
    },
    init: function () {
        var is_on = History.Is_On();
        if (is_on) {
            History.TurnOff();
        }
        var xfrm = this.spPr.xfrm;
        if (isRealObject(this.parent) && isRealObject(this.parent.Extent) && isRealNumber(this.parent.Extent.W) && isRealNumber(this.parent.Extent.H) && (!isRealNumber(xfrm.offX) || !isRealNumber(xfrm.offY) || !isRealNumber(xfrm.extX) || !isRealNumber(xfrm.extY))) {
            if (!this.group) {
                xfrm.offX = 0;
                xfrm.offY = 0;
            }
            xfrm.extX = this.parent.Extent.W;
            xfrm.extY = this.parent.Extent.H;
        }
        if (isRealObject(this.parent) && isRealObject(this.parent.Extent)) {
            this.parent.Extent.W = xfrm.extX;
            this.parent.Extent.H = xfrm.extY;
        }
        if (is_on) {
            History.TurnOn();
        }
        this.recalculate();
    },
    init2: function () {
        var is_on = History.Is_On();
        if (is_on) {
            History.TurnOff();
        }
        var xfrm = this.spPr.xfrm;
        if (isRealObject(this.parent) && isRealObject(this.parent.Extent) && isRealNumber(this.parent.Extent.W) && isRealNumber(this.parent.Extent.H) && (!isRealNumber(xfrm.offX) || !isRealNumber(xfrm.offY) || !isRealNumber(xfrm.extX) || !isRealNumber(xfrm.extY))) {
            if (!this.group) {
                xfrm.offX = 0;
                xfrm.offY = 0;
            }
            xfrm.extX = this.parent.Extent.W;
            xfrm.extY = this.parent.Extent.H;
        }
        if (isRealObject(this.parent) && isRealObject(this.parent.Extent)) {
            this.parent.Extent.W = xfrm.extX;
            this.parent.Extent.H = xfrm.extY;
        }
        if (is_on) {
            History.TurnOn();
        }
    },
    getSelectedTitle: function () {
        if (this.chartTitle && this.chartTitle.selected) {
            return this.chartTitle;
        } else {
            if (this.hAxisTitle && this.hAxisTitle.selected) {
                return this.hAxisTitle;
            } else {
                if (this.vAxisTitle && this.vAxisTitle.selected) {
                    return this.vAxisTitle;
                }
            }
        }
        return null;
    },
    calculateSnapArrays: function (snapArrayX, snapArrayY) {
        var t = this.transform;
        var _t = t;
        if (isRealObject(this.parent)) {
            if (this.parent.Is_Inline()) {
                if (this.parent.DocumentContent instanceof CDocumentContent) {
                    var cur_doc_content = this.parent.DocumentContent;
                    while (cur_doc_content.Is_TableCellContent()) {
                        cur_doc_content = cur_doc_content.Parent.Row.Table.Parent;
                    }
                    if ((cur_doc_content instanceof CDocumentContent && cur_doc_content.Parent instanceof WordShape)) {
                        _t = t.CreateDublicate();
                        global_MatrixTransformer.MultiplyAppend(_t, cur_doc_content.Parent.transformText);
                    }
                }
            }
        }
        snapArrayX.push(_t.TransformPointX(0, 0));
        snapArrayY.push(_t.TransformPointY(0, 0));
        snapArrayX.push(_t.TransformPointX(this.absExtX, 0));
        snapArrayY.push(_t.TransformPointY(this.absExtX, 0));
        snapArrayX.push(t.TransformPointX(this.absExtX * 0.5, this.absExtY * 0.5));
        snapArrayY.push(t.TransformPointY(this.absExtX * 0.5, this.absExtY * 0.5));
        snapArrayX.push(_t.TransformPointX(this.absExtX, this.absExtY));
        snapArrayY.push(_t.TransformPointY(this.absExtX, this.absExtY));
        snapArrayX.push(_t.TransformPointX(0, this.absExtY));
        snapArrayY.push(_t.TransformPointY(0, this.absExtY));
    },
    hitToHandle: function (x, y, radius) {
        var t_x, t_y;
        if (this.group != null) {
            var inv_t = global_MatrixTransformer.Invert(this.group.transform);
            t_x = inv_t.TransformPointX(x, y);
            t_y = inv_t.TransformPointY(x, y);
        } else {
            t_x = x;
            t_y = y;
        }
        var result_x, result_y;
        result_x = t_x;
        result_y = t_y;
        if (isRealObject(this.parent)) {
            if (this.parent.Is_Inline()) {
                if (this.parent.DocumentContent instanceof CDocumentContent) {
                    var cur_doc_content = this.parent.DocumentContent;
                    while (cur_doc_content.Is_TableCellContent()) {
                        cur_doc_content = cur_doc_content.Parent.Row.Table.Parent;
                    }
                    if ((cur_doc_content instanceof CDocumentContent && cur_doc_content.Parent instanceof WordShape)) {
                        var invert_matrix = cur_doc_content.Parent.invertTextMatrix;
                        result_x = invert_matrix.TransformPointX(t_x, t_y);
                        result_y = invert_matrix.TransformPointY(t_x, t_y);
                    }
                }
            }
        }
        var _radius;
        if (! (typeof radius === "number")) {
            _radius = editor.WordControl.m_oDrawingDocument.GetMMPerDot(TRACK_CIRCLE_RADIUS);
        } else {
            _radius = radius;
        }
        if (typeof global_mouseEvent.KoefPixToMM === "number" && !isNaN(global_mouseEvent.KoefPixToMM)) {
            _radius *= global_mouseEvent.KoefPixToMM;
        }
        this.calculateLeftTopPoint();
        var _temp_x = result_x - this.absXLT;
        var _temp_y = result_y - this.absYLT;
        var _sin = Math.sin(this.absRot);
        var _cos = Math.cos(this.absRot);
        var _relative_x = _temp_x * _cos + _temp_y * _sin;
        var _relative_y = -_temp_x * _sin + _temp_y * _cos;
        if (this.absFlipH) {
            _relative_x = this.absExtX - _relative_x;
        }
        if (this.absFlipV) {
            _relative_y = this.absExtY - _relative_y;
        }
        var _dist_x, _dist_y;
        if (!this.checkLine()) {
            _dist_x = _relative_x;
            _dist_y = _relative_y;
            if (Math.sqrt(_dist_x * _dist_x + _dist_y * _dist_y) < _radius) {
                return {
                    hit: true,
                    handleRotate: false,
                    handleNum: 0
                };
            }
            _dist_x = _relative_x - this.absExtX;
            if (Math.sqrt(_dist_x * _dist_x + _dist_y * _dist_y) < _radius) {
                return {
                    hit: true,
                    handleRotate: false,
                    handleNum: 2
                };
            }
            _dist_y = _relative_y - this.absExtY;
            if (Math.sqrt(_dist_x * _dist_x + _dist_y * _dist_y) < _radius) {
                return {
                    hit: true,
                    handleRotate: false,
                    handleNum: 4
                };
            }
            _dist_x = _relative_x;
            if (Math.sqrt(_dist_x * _dist_x + _dist_y * _dist_y) < _radius) {
                return {
                    hit: true,
                    handleRotate: false,
                    handleNum: 6
                };
            }
            if (this.absExtY >= MIN_SHAPE_DIST) {
                var _vertical_center = this.absExtY * 0.5;
                _dist_x = _relative_x;
                _dist_y = _relative_y - _vertical_center;
                if (Math.sqrt(_dist_x * _dist_x + _dist_y * _dist_y) < _radius) {
                    return {
                        hit: true,
                        handleRotate: false,
                        handleNum: 7
                    };
                }
                _dist_x = _relative_x - this.absExtX;
                if (Math.sqrt(_dist_x * _dist_x + _dist_y * _dist_y) < _radius) {
                    return {
                        hit: true,
                        handleRotate: false,
                        handleNum: 3
                    };
                }
            }
            var _horizontal_center = this.absExtX * 0.5;
            if (this.absExtX >= MIN_SHAPE_DIST) {
                _dist_x = _relative_x - _horizontal_center;
                _dist_y = _relative_y;
                if (Math.sqrt(_dist_x * _dist_x + _dist_y * _dist_y) < _radius) {
                    return {
                        hit: true,
                        handleRotate: false,
                        handleNum: 1
                    };
                }
                _dist_y = _relative_y - this.absExtY;
                if (Math.sqrt(_dist_x * _dist_x + _dist_y * _dist_y) < _radius) {
                    return {
                        hit: true,
                        handleRotate: false,
                        handleNum: 5
                    };
                }
            }
            _dist_x = _relative_x - _horizontal_center;
            _dist_y = _relative_y + editor.WordControl.m_oDrawingDocument.GetMMPerDot(TRACK_DISTANCE_ROTATE);
            if (Math.sqrt(_dist_x * _dist_x + _dist_y * _dist_y) < _radius) {
                return {
                    hit: true,
                    handleRotate: true,
                    handleNum: 8
                };
            }
        } else {
            _dist_x = _relative_x;
            _dist_y = _relative_y;
            if (Math.sqrt(_dist_x * _dist_x + _dist_y * _dist_y) < _radius) {
                return {
                    hit: true,
                    handleRotate: false,
                    handleNum: 0
                };
            }
            _dist_x = _relative_x - this.absExtX;
            _dist_y = _relative_y - this.absExtY;
            if (Math.sqrt(_dist_x * _dist_x + _dist_y * _dist_y) < _radius) {
                return {
                    hit: true,
                    handleRotate: false,
                    handleNum: 4
                };
            }
        }
        return {
            hit: false,
            handleRotate: false,
            handleNum: null
        };
    },
    setAbsoluteTransform: function (offsetX, offsetY, extX, extY, rot, flipH, flipV, open) {
        if (offsetX != null) {
            this.absOffsetX = offsetX;
        }
        if (offsetY != null) {
            this.absOffsetY = offsetY;
        }
        if (extX != null) {
            this.absExtX = extX;
        }
        if (extY != null) {
            this.absExtY = extY;
        }
        if (rot != null) {
            this.absRot = rot;
        }
        if (flipH != null) {
            this.absFlipH = flipH;
        }
        if (flipV != null) {
            this.absFlipV = flipV;
        }
        if (this.parent) {
            this.parent.setAbsoluteTransform(offsetX, offsetY, extX, extY, rot, flipH, flipV, true);
        }
        if ((extY == null)) {
            this.recalculatePosExt();
            this.recalculateTransform();
        } else {
            this.recalcAllTitles();
            this.recalculate(true);
        }
    },
    getInvertTransform: function () {
        return this.invertTransform;
    },
    drawAdjustments: function () {},
    hitInWorkArea: function (x, y) {
        var tx = this.invertTransform.TransformPointX(x, y);
        var ty = this.invertTransform.TransformPointY(x, y);
        return tx > 0 && tx < this.absExtX && ty > 0 && ty < this.absExtY;
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
        return new MoveTrackChart(this, true);
    },
    createTrackObjectForResize: function (handleNum, pageIndex) {
        return new ResizeTrackShape(this, handleNum, pageIndex, true);
    },
    getPresetGeom: function () {
        return "rect";
    },
    createTrackObjectForMove: function (majorOffsetX, majorOffsetY) {
        return new MoveTrackShape(this, majorOffsetX, majorOffsetY, true);
    },
    checkLine: function () {
        return false;
    },
    calculateTransformMatrix: function () {
        this.recalculateTransform();
    },
    calculateLeftTopPoint: function () {
        var _horizontal_center = this.absExtX * 0.5;
        var _vertical_enter = this.absExtY * 0.5;
        var _sin = Math.sin(0);
        var _cos = Math.cos(0);
        this.absXLT = -_horizontal_center * _cos + _vertical_enter * _sin + this.absOffsetX + _horizontal_center;
        this.absYLT = -_horizontal_center * _sin - _vertical_enter * _cos + this.absOffsetY + _vertical_enter;
    },
    getAspect: function (num) {
        var _tmp_x = this.absExtX != 0 ? this.absExtX : 0.1;
        var _tmp_y = this.absExtY != 0 ? this.absExtY : 0.1;
        return num === 0 || num === 4 ? _tmp_x / _tmp_y : _tmp_y / _tmp_x;
    },
    getCardDirectionByNum: function (num) {
        var num_north = this.getNumByCardDirection(CARD_DIRECTION_N);
        return ((num - num_north) + CARD_DIRECTION_N + 8) % 8;
    },
    getNumByCardDirection: function (cardDirection) {
        var hc = this.absExtX * 0.5;
        var vc = this.absExtY * 0.5;
        var transform = this.getTransform();
        var y1, y3, y5, y7;
        y1 = transform.TransformPointY(hc, 0);
        y3 = transform.TransformPointY(this.absExtX, vc);
        y5 = transform.TransformPointY(hc, this.absExtY);
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
        cx = this.absExtX > 0 ? this.absExtX : 0.1;
        cy = this.absExtY > 0 ? this.absExtY : 0.1;
        var p = this.transformPointRelativeShape(x, y);
        switch (numHandle) {
        case 0:
            return {
                kd1: (cx - p.x) / cx,
                kd2: (cy - p.y) / cy
            };
        case 1:
            return {
                kd1: (cy - p.y) / cy,
                kd2: 0
            };
        case 2:
            return {
                kd1: (cy - p.y) / cy,
                kd2: p.x / cx
            };
        case 3:
            return {
                kd1: p.x / cx,
                kd2: 0
            };
        case 4:
            return {
                kd1: p.x / cx,
                kd2: p.y / cy
            };
        case 5:
            return {
                kd1: p.y / cy,
                kd2: 0
            };
        case 6:
            return {
                kd1: p.y / cy,
                kd2: (cx - p.x) / cx
            };
        case 7:
            return {
                kd1: (cx - p.x) / cx,
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
        var w = this.absExtX;
        var h = this.absExtY;
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
        this.spPr.xfrm.setPosition(x, y);
    },
    setExtents: function (extX, extY) {
        this.spPr.xfrm.setExtents(extX, extY);
    },
    calculateTransformTextMatrix: function () {},
    updateDrawingBaseCoordinates: function () {
        if (isRealObject(this.drawingBase)) {
            this.drawingBase.setGraphicObjectCoords();
        }
    },
    numberToCardDirection: function (handleNumber) {
        var y1, y3, y5, y7, hc, vc, numN, x1, x3, x5, x7;
        hc = this.absExtX * 0.5;
        vc = this.absExtY * 0.5;
        var t_m = this.transform;
        x1 = t_m.TransformPointX(hc, 0);
        x3 = t_m.TransformPointX(this.absExtX, vc);
        x5 = t_m.TransformPointX(hc, this.absExtY);
        x7 = t_m.TransformPointX(0, vc);
        y1 = t_m.TransformPointY(hc, 0);
        y3 = t_m.TransformPointY(this.absExtX, vc);
        y5 = t_m.TransformPointY(hc, this.absExtY);
        y7 = t_m.TransformPointY(0, vc);
        switch (Math.min(y1, y3, y5, y7)) {
        case y1:
            numN = 1;
            break;
        case y3:
            numN = 3;
            break;
        case y5:
            numN = 5;
            break;
        case y7:
            numN = 7;
            break;
        default:
            numN = 1;
        }
        var tmpArr = [];
        if ((x5 - x1) * (y3 - y7) - (y5 - y1) * (x3 - x7) < 0) {
            tmpArr[numN] = CARD_DIRECTION_N;
            tmpArr[(numN + 1) % 8] = CARD_DIRECTION_NE;
            tmpArr[(numN + 2) % 8] = CARD_DIRECTION_E;
            tmpArr[(numN + 3) % 8] = CARD_DIRECTION_SE;
            tmpArr[(numN + 4) % 8] = CARD_DIRECTION_S;
            tmpArr[(numN + 5) % 8] = CARD_DIRECTION_SW;
            tmpArr[(numN + 6) % 8] = CARD_DIRECTION_W;
            tmpArr[(numN + 7) % 8] = CARD_DIRECTION_NW;
            return tmpArr[handleNumber];
        } else {
            var t;
            tmpArr[numN] = CARD_DIRECTION_N;
            t = numN - 1;
            if (t < 0) {
                t += 8;
            }
            tmpArr[t] = CARD_DIRECTION_NE;
            t = numN - 2;
            if (t < 0) {
                t += 8;
            }
            tmpArr[t] = CARD_DIRECTION_E;
            t = numN - 3;
            if (t < 0) {
                t += 8;
            }
            tmpArr[t] = CARD_DIRECTION_SE;
            t = numN - 4;
            if (t < 0) {
                t += 8;
            }
            tmpArr[t] = CARD_DIRECTION_S;
            t = numN - 5;
            if (t < 0) {
                t += 8;
            }
            tmpArr[t] = CARD_DIRECTION_SW;
            t = numN - 6;
            if (t < 0) {
                t += 8;
            }
            tmpArr[t] = CARD_DIRECTION_W;
            t = numN - 7;
            if (t < 0) {
                t += 8;
            }
            tmpArr[t] = CARD_DIRECTION_NW;
            return tmpArr[handleNumber];
        }
    },
    cardDirectionToNumber: function (cardDirection) {
        var y1, y3, y5, y7, hc, vc, sin, cos, numN, x1, x3, x5, x7;
        hc = this.absExtX * 0.5;
        vc = this.absExtY * 0.5;
        sin = Math.sin(this.absRot);
        cos = Math.cos(this.absRot);
        y1 = -cos * vc;
        y3 = sin * hc;
        y5 = cos * vc;
        y7 = -sin * hc;
        var t_m = this.transform;
        x1 = t_m.TransformPointX(hc, 0);
        x3 = t_m.TransformPointX(this.absExtX, vc);
        x5 = t_m.TransformPointX(hc, this.absExtY);
        x7 = t_m.TransformPointX(0, vc);
        y1 = t_m.TransformPointY(hc, 0);
        y3 = t_m.TransformPointY(this.absExtX, vc);
        y5 = t_m.TransformPointY(hc, this.absExtY);
        y7 = t_m.TransformPointY(0, vc);
        switch (Math.min(y1, y3, y5, y7)) {
        case y1:
            numN = 1;
            break;
        case y3:
            numN = 3;
            break;
        case y5:
            numN = 5;
            break;
        case y7:
            numN = 7;
            break;
        default:
            numN = 1;
        }
        if ((x5 - x1) * (y3 - y7) - (y5 - y1) * (x3 - x7) < 0) {
            return (cardDirection + numN) % 8;
        } else {
            var t = numN - cardDirection;
            if (t < 0) {
                return t + 8;
            } else {
                return t;
            }
        }
    },
    normalizeXfrm2: function (kw, kh) {
        var xfrm = this.spPr.xfrm;
        xfrm.offX *= kw;
        xfrm.offY *= kh;
        xfrm.extX *= kw;
        xfrm.extY *= kh;
    },
    calculateAfterOpenInGroup: function () {
        var xfrm = this.spPr.xfrm;
        var rot = xfrm.rot == null ? 0 : xfrm.rot;
        var flip_h = xfrm.flipH == null ? false : xfrm.flipH;
        var flip_v = xfrm.flipV == null ? false : xfrm.flipV;
        this.parent = new ParaDrawing(null, null, this, editor.WordControl.m_oLogicDocument.DrawingDocument, null, null);
        this.parent.Set_GraphicObject(this);
        this.init2();
        this.setAbsoluteTransform(xfrm.offX, xfrm.offY, xfrm.extX, xfrm.extY, rot, flip_h, flip_v, false);
        if (this.spPr.geometry) {
            this.spPr.geometry.Init(xfrm.extX, xfrm.extY);
        }
    },
    calculateAfterOpenInGroup2: function () {
        var xfrm = this.spPr.xfrm;
        var rot = xfrm.rot == null ? 0 : xfrm.rot;
        var flip_h = xfrm.flipH == null ? false : xfrm.flipH;
        var flip_v = xfrm.flipV == null ? false : xfrm.flipV;
        this.init();
        this.setAbsoluteTransform(xfrm.offX, xfrm.offY, xfrm.extX, xfrm.extY, rot, flip_h, flip_v, false);
        if (this.spPr.geometry) {
            this.spPr.geometry.Init(xfrm.extX, xfrm.extY);
        }
    },
    setGroupAfterOpen: function (group) {
        this.group = group;
    },
    setMainGroup: function (group) {
        var data = {};
        data.Type = historyitem_SetMainGroup;
        data.oldGroup = this.mainGroup;
        data.newGroup = group;
        History.Add(this, data);
        this.mainGroup = group;
    },
    recalculateDocContent: function () {
        this.recalculate();
    },
    Undo: function (data) {
        switch (data.Type) {
        case historyitem_SetMainGroup:
            this.mainGroup = data.oldGroup;
            break;
        case historyitem_SetGroup:
            this.group = data.oldGroup;
            break;
        case historyitem_AutoShapes_RecalculateChartUndo:
            this.recalculate();
            break;
        case historyitem_SetParent:
            if (data.oldParent == null) {
                this.parent = null;
            } else {
                this.parent = g_oTableId.Get_ById(data.oldParent);
            }
            break;
        case historyitem_SetSizes:
            this.spPr.xfrm.extX = data.oldW;
            this.spPr.xfrm.extY = data.oldH;
            this.absExtX = data.oldW;
            this.absExtY = data.oldH;
            this.absOffsetX = data.oldPosX;
            this.absOffsetY = data.oldPosY;
            if (this.parent) {
                this.parent.absOffsetX = data.oldPosX;
                this.parent.absOffsetY = data.oldPosY;
                this.parent.absExtX = data.oldW;
                this.parent.absExtY = data.oldH;
            }
            this.calculateAfterResize();
            break;
        case historyitem_AutoShapes_AddXAxis:
            this.hAxisTitle = g_oTableId.Get_ById(data.oldPr);
            break;
        case historyitem_AutoShapes_AddYAxis:
            this.vAxisTitle = g_oTableId.Get_ById(data.oldPr);
            break;
        case historyitem_AutoShapes_AddTitle:
            this.chartTitle = g_oTableId.Get_ById(data.oldPr);
            break;
        case historyitem_AutoShapes_AddChart:
            this.chart = data.oldPr;
            break;
        case historyitem_SetSetSpPr:
            this.spPr = data.oldPr;
            break;
        case historyitem_SetXfrmShape:
            var xfrm = this.spPr.xfrm;
            if (typeof data.oldOffsetX === "number") {
                xfrm.offX = data.oldOffsetX;
            }
            if (typeof data.oldOffsetY === "number") {
                xfrm.offY = data.oldOffsetY;
            }
            if (typeof data.oldExtX === "number") {
                xfrm.extX = data.oldExtX;
            }
            if (typeof data.oldExtY === "number") {
                xfrm.extY = data.oldExtY;
            }
            if (typeof data.oldRot === "number") {
                xfrm.rot = data.oldRot;
            }
            if (data.oldFlipH != null) {
                xfrm.flipH = data.oldFlipH;
            }
            if (data.oldFlipV != null) {
                xfrm.flipV = data.oldFlipV;
            }
            if (typeof data.oldExtX === "number" || typeof data.oldExtY === "number") {
                if (this.spPr.geometry) {
                    this.spPr.geometry.Recalculate(xfrm.extX, xfrm.extY);
                }
            }
            var posX, posY;
            if (this.group == null) {
                posX = null;
                posY = null;
            } else {
                posX = xfrm.offX;
                posY = xfrm.offY;
            }
            this.setAbsoluteTransform(posX, posY, xfrm.extX, xfrm.extY, xfrm.rot == null ? 0 : xfrm.rot, xfrm.flipH == null ? false : xfrm.flipH, xfrm.flipV == null ? false : xfrm.flipV);
            break;
        }
    },
    Save_Changes: function (data, w) {
        var writer = w;
        w.WriteLong(historyitem_type_Chart);
        w.WriteLong(data.Type);
        switch (data.Type) {
        case historyitem_SetXfrmShape:
            bool = typeof data.newOffsetX === "number";
            writer.WriteBool(bool);
            if (bool) {
                writer.WriteDouble(data.newOffsetX);
            }
            bool = typeof data.newOffsetY === "number";
            writer.WriteBool(bool);
            if (bool) {
                writer.WriteDouble(data.newOffsetY);
            }
            bool = typeof data.newExtX === "number";
            writer.WriteBool(bool);
            if (bool) {
                writer.WriteDouble(data.newExtX);
            }
            bool = typeof data.newExtY === "number";
            writer.WriteBool(bool);
            if (bool) {
                writer.WriteDouble(data.newExtY);
            }
            bool = typeof data.newRot === "number";
            writer.WriteBool(bool);
            if (bool) {
                writer.WriteDouble(data.newRot);
            }
            bool = data.newFlipH != null;
            writer.WriteBool(bool);
            if (bool) {
                writer.WriteBool(data.newFlipH);
            }
            bool = data.newFlipV != null;
            writer.WriteBool(bool);
            if (bool) {
                writer.WriteBool(data.newFlipV);
            }
            break;
        case historyitem_SetParent:
            writer.WriteBool(data.newParent != null);
            if (data.newParent != null) {
                writer.WriteString2(data.newParent);
            }
            break;
        case historyitem_SetSizes:
            writer.WriteDouble(data.newPosX);
            writer.WriteDouble(data.newPosY);
            writer.WriteDouble(data.newW);
            writer.WriteDouble(data.newH);
            writer.WriteBool(data.newFlipH);
            writer.WriteBool(data.newFlipV);
            break;
        case historyitem_AutoShapes_AddXAxis:
            case historyitem_AutoShapes_AddYAxis:
            case historyitem_AutoShapes_AddTitle:
            w.WriteBool(typeof data.newPr === "string");
            if (typeof data.newPr === "string") {
                w.WriteString2(data.newPr);
            }
            break;
        case historyitem_SetSetSpPr:
            w.WriteBool(isRealObject(data.newPr));
            if (isRealObject(data.newPr)) {
                data.newPr.Write_ToBinary2(w);
            }
            break;
        case historyitem_AutoShapes_AddChart:
            w.WriteBool(isRealObject(data.newPr));
            if (isRealObject(data.newPr)) {
                data.newPr.Write_ToBinary2(w);
            }
            break;
        case historyitem_SetGroup:
            case historyitem_SetMainGroup:
            bool = data.newGroup != null;
            writer.WriteBool(bool);
            if (bool) {
                writer.WriteString2(data.newGroup.Get_Id());
            }
            break;
        }
    },
    Load_Changes: function (reader) {
        var ClassType = reader.GetLong();
        if (historyitem_type_Chart != ClassType) {
            return;
        }
        var r = reader;
        var type = reader.GetLong();
        switch (type) {
        case historyitem_SetMainGroup:
            if (reader.GetBool()) {
                this.mainGroup = g_oTableId.Get_ById(reader.GetString2());
            } else {
                this.mainGroup = null;
            }
            break;
        case historyitem_SetGroup:
            if (reader.GetBool()) {
                this.group = g_oTableId.Get_ById(reader.GetString2());
            } else {
                this.group = null;
            }
            break;
        case historyitem_AutoShapes_RecalculateChartRedo:
            this.recalculate();
            break;
        case historyitem_CalculateAfterCopyInGroup:
            this.recalculate();
        case historyitem_SetXfrmShape:
            var xfrm = this.spPr.xfrm;
            if (reader.GetBool()) {
                xfrm.offX = reader.GetDouble();
            }
            if (reader.GetBool()) {
                xfrm.offY = reader.GetDouble();
            }
            if (reader.GetBool()) {
                xfrm.extX = reader.GetDouble();
            }
            if (reader.GetBool()) {
                xfrm.extY = reader.GetDouble();
            }
            if (reader.GetBool()) {
                xfrm.rot = reader.GetDouble();
            }
            if (reader.GetBool()) {
                xfrm.flipH = reader.GetBool();
            }
            if (reader.GetBool()) {
                xfrm.flipV = reader.GetBool();
            }
            if (this.spPr.geometry) {
                this.spPr.geometry.Recalculate(xfrm.extX, xfrm.extY);
            }
            var posX, posY;
            if (this.group == null) {
                posX = null;
                posY = null;
            } else {
                posX = xfrm.offX;
                posY = xfrm.offY;
            }
            this.setAbsoluteTransform(posX, posY, xfrm.extX, xfrm.extY, xfrm.rot == null ? 0 : xfrm.rot, xfrm.flipH == null ? false : xfrm.flipH, xfrm.flipV == null ? false : xfrm.flipV);
            break;
        case historyitem_SetParent:
            if (reader.GetBool()) {
                this.parent = g_oTableId.Get_ById(reader.GetString2());
            } else {
                this.parent = null;
            }
            break;
        case historyitem_SetSizes:
            var posX = reader.GetDouble();
            var posY = reader.GetDouble();
            var extX = reader.GetDouble();
            var extY = reader.GetDouble();
            var flipH = reader.GetBool();
            var flipV = reader.GetBool();
            this.spPr.xfrm.extX = extX;
            this.spPr.xfrm.extY = extY;
            this.absExtX = extX;
            this.absExtY = extY;
            this.absOffsetX = posX;
            this.absOffsetY = posY;
            if (this.parent) {
                this.parent.absOffsetX = posX;
                this.parent.absOffsetY = posY;
                this.parent.absExtX = extX;
                this.parent.absExtY = extY;
            }
            this.calculateAfterResize();
            break;
        case historyitem_AutoShapes_AddXAxis:
            if (r.GetBool()) {
                this.hAxisTitle = g_oTableId.Get_ById(r.GetString2());
            } else {
                this.hAxisTitle = null;
            }
            break;
        case historyitem_AutoShapes_AddYAxis:
            if (r.GetBool()) {
                this.vAxisTitle = g_oTableId.Get_ById(r.GetString2());
            } else {
                this.vAxisTitle = null;
            }
            break;
        case historyitem_AutoShapes_AddTitle:
            if (r.GetBool()) {
                this.chartTitle = g_oTableId.Get_ById(r.GetString2());
            } else {
                this.chartTitle = null;
            }
            break;
        case historyitem_SetSetSpPr:
            this.spPr = new CSpPr();
            if (r.GetBool()) {
                this.spPr.Read_FromBinary2(r);
            }
            break;
        case historyitem_AutoShapes_AddChart:
            if (r.GetBool()) {
                g_oTableId.m_bTurnOff = true;
                this.chart = new asc_CChart();
                g_oTableId.m_bTurnOff = false;
                this.chart.Read_FromBinary2(r);
            } else {
                this.chart = null;
            }
            break;
        case historyitem_AutoShapes_RecalculateAfterResize:
            this.recalculatePosExt();
            this.recalcAllTitles();
            this.init();
            this.recalculate();
            if (this.parent) {
                this.recalcAllTitles();
                editor.WordControl.m_oLogicDocument.DrawingObjects.arrForCalculateAfterOpen.push(this.parent);
            }
            break;
        }
    },
    Redo: function (data) {
        switch (data.Type) {
        case historyitem_SetMainGroup:
            this.mainGroup = data.newGroup;
            break;
        case historyitem_SetGroup:
            this.group = data.newGroup;
            break;
        case historyitem_AutoShapes_RecalculateChartRedo:
            this.recalculate();
            break;
        case historyitem_SetSizes:
            this.spPr.xfrm.extX = data.oldW;
            this.spPr.xfrm.extY = data.oldH;
            this.absExtX = data.oldW;
            this.absExtY = data.oldH;
            this.absOffsetX = data.oldPosX;
            this.absOffsetY = data.oldPosY;
            if (this.parent) {
                this.parent.absOffsetX = data.oldPosX;
                this.parent.absOffsetY = data.oldPosY;
                this.parent.absExtX = data.oldW;
                this.parent.absExtY = data.oldH;
            }
            this.calculateAfterResize();
            break;
        case historyitem_SetXfrmShape:
            var xfrm = this.spPr.xfrm;
            if (typeof data.newOffsetX === "number") {
                xfrm.offX = data.newOffsetX;
            }
            if (typeof data.newOffsetY === "number") {
                xfrm.offY = data.newOffsetY;
            }
            if (typeof data.newExtX === "number") {
                xfrm.extX = data.newExtX;
            }
            if (typeof data.newExtY === "number") {
                xfrm.extY = data.newExtY;
            }
            if (typeof data.newRot === "number") {
                xfrm.rot = data.newRot;
            }
            if (data.newFlipH != null) {
                xfrm.flipH = data.newFlipH;
            }
            if (data.newFlipV != null) {
                xfrm.flipV = data.newFlipV;
            }
            if (typeof data.newExtX === "number" || typeof data.newExtY === "number") {
                if (this.spPr.geometry) {
                    this.spPr.geometry.Recalculate(xfrm.extX, xfrm.extY);
                }
            }
            var posX, posY;
            if (this.group == null) {
                posX = null;
                posY = null;
            } else {
                posX = xfrm.offX;
                posY = xfrm.offY;
            }
            this.setAbsoluteTransform(posX, posY, xfrm.extX, xfrm.extY, xfrm.rot == null ? 0 : xfrm.rot, xfrm.flipH == null ? false : xfrm.flipH, xfrm.flipV == null ? false : xfrm.flipV);
            break;
        case historyitem_AutoShapes_AddXAxis:
            this.hAxisTitle = g_oTableId.Get_ById(data.newPr);
            break;
        case historyitem_AutoShapes_AddYAxis:
            this.vAxisTitle = g_oTableId.Get_ById(data.newPr);
            break;
        case historyitem_AutoShapes_AddTitle:
            this.chartTitle = g_oTableId.Get_ById(data.newPr);
            break;
        case historyitem_AutoShapes_AddChart:
            this.chart = data.newPr;
            break;
        case historyitem_SetSetSpPr:
            this.spPr = data.newPr;
            break;
        case historyitem_SetParent:
            if (data.newParent == null) {
                this.parent = null;
            } else {
                this.parent = g_oTableId.Get_ById(data.newParent);
            }
            break;
        }
    },
    recalcAllTitles: function () {
        if (this.chartTitle && this.chartTitle.txBody && this.chartTitle.txBody.content) {
            var content = this.chartTitle.txBody.content.Content;
            for (var i = 0; i < content.length; ++i) {
                content[i].RecalcInfo.Recalc_0_Type = pararecalc_0_All;
            }
        }
        if (this.hAxisTitle && this.hAxisTitle.txBody && this.hAxisTitle.txBody.content) {
            var content = this.hAxisTitle.txBody.content.Content;
            for (var i = 0; i < content.length; ++i) {
                content[i].RecalcInfo.Recalc_0_Type = pararecalc_0_All;
            }
        }
        if (this.vAxisTitle && this.vAxisTitle.txBody && this.vAxisTitle.txBody.content) {
            var content = this.vAxisTitle.txBody.content.Content;
            for (var i = 0; i < content.length; ++i) {
                content[i].RecalcInfo.Recalc_0_Type = pararecalc_0_All;
            }
        }
    },
    getChartBinary: function () {
        this.syncAscChart();
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
    writeToBinaryForCopyPaste: function (w) {
        w.WriteLong(historyitem_type_ChartGroup);
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
    },
    readFromBinaryForCopyPaste: function (r) {
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
        g_oTableId.m_bTurnOff = true;
        var chart = new asc_CChart();
        g_oTableId.m_bTurnOff = false;
        chart.Read_FromBinary2(r, true);
        this.setAscChart(chart);
        this.spPr.Read_FromBinary2(r);
        if (isRealObject(this.parent)) {
            this.parent.Extent.W = this.spPr.xfrm.extX;
            this.parent.Extent.H = this.spPr.xfrm.extY;
        }
        this.init();
    },
    addXAxis: function (title) {
        var oldValue = isRealObject(this.hAxisTitle) ? this.hAxisTitle.Get_Id() : null;
        var newValue = isRealObject(title) ? title.Get_Id() : null;
        this.hAxisTitle = title;
        History.Add(this, {
            Type: historyitem_AutoShapes_AddXAxis,
            oldPr: oldValue,
            newPr: newValue
        });
    },
    addYAxis: function (title) {
        var oldValue = isRealObject(this.vAxisTitle) ? this.vAxisTitle.Get_Id() : null;
        var newValue = isRealObject(title) ? title.Get_Id() : null;
        this.vAxisTitle = title;
        History.Add(this, {
            Type: historyitem_AutoShapes_AddYAxis,
            oldPr: oldValue,
            newPr: newValue
        });
    },
    addTitle: function (title) {
        var oldValue = isRealObject(this.chartTitle) ? this.chartTitle.Get_Id() : null;
        var newValue = isRealObject(title) ? title.Get_Id() : null;
        this.chartTitle = title;
        History.Add(this, {
            Type: historyitem_AutoShapes_AddTitle,
            oldPr: oldValue,
            newPr: newValue
        });
    },
    setSpPr: function (spPr) {
        History.Add(this, {
            Type: historyitem_SetSetSpPr,
            oldPr: this.spPr,
            newPr: spPr
        });
        this.spPr = spPr;
    },
    setChartBinary: function (binary) {
        var r = CreateBinaryReader(binary, 0, binary.length);
        if (r.GetBool()) {
            this.addTitle(new CChartTitle(this, CHART_TITLE_TYPE_TITLE));
            this.chartTitle.readFromBinary(r);
        } else {
            this.addTitle(null);
        }
        if (r.GetBool()) {
            this.addYAxis(new CChartTitle(this, CHART_TITLE_TYPE_V_AXIS));
            this.vAxisTitle.readFromBinary(r);
        } else {
            this.addYAxis(null);
        }
        if (r.GetBool()) {
            this.addXAxis(new CChartTitle(this, CHART_TITLE_TYPE_H_AXIS));
            this.hAxisTitle.readFromBinary(r);
        } else {
            this.addXAxis(null);
        }
        g_oTableId.m_bTurnOff = true;
        var chart = new asc_CChart();
        g_oTableId.m_bTurnOff = false;
        chart.Read_FromBinary2(r, true);
        this.setAscChart(chart);
        var spPr = new CSpPr();
        spPr.Read_FromBinary2(r);
        this.setSpPr(spPr);
        if (isRealObject(this.parent)) {
            this.parent.setExtent(this.spPr.xfrm.extX, this.spPr.xfrm.extY);
        }
        this.init();
        this.recalculate();
        History.Add(this, {
            Type: historyitem_AutoShapes_RecalculateAfterResize
        });
    },
    copy: function (parent, group) {
        return this.copy3(parent, group);
        var _group = isRealObject(group) ? group : null;
        var c = new CChartAsGroup(parent, editor.WordControl.m_oLogicDocument, editor.WordControl.m_oLogicDocument.DrawingDocument, _group);
        c.setChartBinary(this.getChartBinary());
        return c;
    },
    copy3: function (parent, group) {
        var _group = isRealObject(group) ? group : null;
        var c = new CChartAsGroup(parent, editor.WordControl.m_oLogicDocument, editor.WordControl.m_oDrawingDocument, _group);
        if (this.chartTitle) {
            c.addTitle(this.chartTitle.copy(c, CHART_TITLE_TYPE_TITLE));
        } else {
            c.addTitle(null);
        }
        if (this.vAxisTitle) {
            c.addYAxis(this.vAxisTitle.copy(c, CHART_TITLE_TYPE_V_AXIS));
        } else {
            c.addYAxis(null);
        }
        if (this.hAxisTitle) {
            c.addXAxis(this.hAxisTitle.copy(c, CHART_TITLE_TYPE_H_AXIS));
        } else {
            c.addXAxis(null);
        }
        c.setSpPr(this.spPr.createDuplicate());
        g_oTableId.m_bTurnOff = true;
        var chart = new asc_CChart(this.chart);
        g_oTableId.m_bTurnOff = false;
        c.setAscChart(chart);
        if (isRealObject(c.parent)) {
            c.parent.setExtent(c.spPr.xfrm.extX, c.spPr.xfrm.extY);
        }
        History.Add(this, {
            Type: historyitem_AutoShapes_RecalculateAfterResize
        });
        return c;
    },
    setParent: function (paraDrawing) {
        var data = {
            Type: historyitem_SetParent
        };
        if (isRealObject(this.parent)) {
            data.oldParent = this.parent.Get_Id();
        } else {
            data.oldParent = null;
        }
        if (isRealObject(paraDrawing)) {
            data.newParent = paraDrawing.Get_Id();
        } else {
            data.newParent = null;
        }
        History.Add(this, data);
        this.parent = paraDrawing;
    },
    Write_ToBinary2: function (w) {
        w.WriteLong(historyitem_type_Chart);
        w.WriteString2(this.Id);
    },
    Read_FromBinary2: function (r) {
        this.Id = r.GetString2();
    }
};
window["Asc"].CChartAsGroup = CChartAsGroup;
window["Asc"]["CChartAsGroup"] = CChartAsGroup;
prot = CChartAsGroup.prototype;
prot["asc_getChart"] = prot.asc_getChart;
var CLASS_TYPE_TABLE_ID = 0;
var CLASS_TYPE_DOCUMENT_CONTENT = 1;
var CLASS_TYPE_SHAPE = 2;
var CLASS_TYPE_IMAGE = 3;
var CLASS_TYPE_GROUP = 4;
var CLASS_TYPE_XFRM = 5;
var CLASS_TYPE_GEOMETRY = 6;
var CLASS_TYPE_PATH = 7;
var CLASS_TYPE_PARAGRAPH = 8;
var CLASS_TYPE_TEXT_BODY = 9;
var CLASS_TYPE_TEXT_PR = 10;
var CLASS_TYPE_UNI_FILL = 11;
var CLASS_TYPE_PATTERN_FILL = 12;
var CLASS_TYPE_GRAD_FILL = 13;
var CLASS_TYPE_SOLID_FILL = 14;
var CLASS_TYPE_UNI_COLOR = 15;
var CLASS_TYPE_SCHEME_COLOR = 16;
var CLASS_TYPE_RGB_COLOR = 17;
var CLASS_TYPE_PRST_COLOR = 18;
var CLASS_TYPE_SYS_COLOR = 19;
var CLASS_TYPE_LINE = 20;
var CLASS_TYPE_CHART_AS_GROUP = 21;
var CLASS_TYPE_CHART_LEGEND = 22;
var CLASS_TYPE_CHART_TITLE = 23;
var CLASS_TYPE_COLOR_MOD = 24;
var CLASS_TYPE_LEGEND_ENTRY = 22;