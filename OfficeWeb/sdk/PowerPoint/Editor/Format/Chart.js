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
function CChartAsGroup(parent) {
    this.document = document;
    this.group = null;
    this.chartTitle = null;
    this.vAxisTitle = null;
    this.hAxisTitle = null;
    this.brush = new CBlipFill();
    this.spPr = new CSpPr();
    this.x = null;
    this.y = null;
    this.extX = null;
    this.extY = null;
    this.x = 0;
    this.y = 0;
    this.absRot = null;
    this.absFlipH = null;
    this.absFlipV = null;
    this.spPr.geometry = CreateGeometry("rect");
    this.spPr.geometry.Init(5, 5);
    this.brush = new CUniFill();
    this.brush.fill = new CBlipFill();
    this.transform = new CMatrix();
    this.invertTransform = new CMatrix();
    this.group = null;
    this.pageIndex = -1;
    this.selectedObjects = [];
    this.selected = false;
    this.mainGroup = null;
    this.recalcInfo = {};
    this.Lock = new CLock();
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
    this.bFirstRecalc = true;
    if (isRealObject(parent)) {
        this.setParent(parent);
        this.setAscChart(new asc_CChart());
    }
}
CChartAsGroup.prototype = {
    getAllFonts: function (fonts) {
        fonts["Calibri"] = true;
        if (this.chartTitle && this.chartTitle.txBody && this.chartTitle.txBody.content) {
            this.chartTitle.txBody.content.Document_Get_AllFontNames(fonts);
        }
        if (this.hAxisTitle && this.hAxisTitle.txBody && this.hAxisTitle.txBody.content) {
            this.hAxisTitle.txBody.content.Document_Get_AllFontNames(fonts);
        }
        if (this.vAxisTitle && this.vAxisTitle.txBody && this.vAxisTitle.txBody.content) {
            this.vAxisTitle.txBody.content.Document_Get_AllFontNames(fonts);
        }
    },
    getSearchResults: function () {
        return null;
    },
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
    changeSize: function (kw, kh) {
        if (this.spPr.xfrm.isNotNull()) {
            var xfrm = this.spPr.xfrm;
            xfrm.offX *= kw;
            xfrm.offY *= kh;
            xfrm.extX *= kw;
            xfrm.extY *= kh;
        }
    },
    recalcAll: function () {},
    recalcAllColors: function () {},
    calculateAfterChangeTheme: function () {
        this.recalculate();
    },
    calculateAfterOpen10: function () {
        this.init();
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
    sendMouseData: function () {
        if (true === this.Lock.Is_Locked()) {
            var MMData = new CMouseMoveData();
            var Coords = editor.WordControl.m_oLogicDocument.DrawingDocument.ConvertCoordsToCursorWR(this.x, this.y, this.parent.num, null);
            MMData.X_abs = Coords.X - 5;
            MMData.Y_abs = Coords.Y;
            MMData.Type = c_oAscMouseMoveDataTypes.LockedObject;
            MMData.UserId = this.Lock.Get_UserId();
            MMData.HaveChanges = this.Lock.Have_Changes();
            MMData.LockedObjectType = 0;
            editor.sync_MouseMoveCallback(MMData);
        }
    },
    getObjectType: function () {
        return CLASS_TYPE_CHART_AS_GROUP;
    },
    getParentObjects: function () {
        var parents = {
            slide: null,
            layout: null,
            master: null,
            theme: null
        };
        switch (this.parent.kind) {
        case SLIDE_KIND:
            parents.slide = this.parent;
            parents.layout = this.parent.Layout;
            parents.master = this.parent.Layout.Master;
            parents.theme = this.parent.Layout.Master.Theme;
            parents.presentation = this.parent.Layout.Master.presentation;
            break;
        case LAYOUT_KIND:
            parents.layout = this.parent;
            parents.master = this.parent.Master;
            parents.theme = this.parent.Master.Theme;
            parents.presentation = this.parent.Master.presentation;
            break;
        case MASTER_KIND:
            parents.master = this.parent;
            parents.theme = this.parent.Theme;
            parents.presentation = this.parent.presentation;
            break;
        }
        return parents;
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
    setDiagram: function (chartPr) {
        var chart = chartPr.ChartProperties;
        var w = new CMemory();
        this.chart.Write_ToBinary2(w);
        var bin = w.pos + ";" + w.GetBase64Memory();
        var new_chart_data = new asc_CChart(this.chart);
        if (chart.styleId != null) {
            new_chart_data.asc_setStyleId(chart.styleId);
        }
        if (chart.subType != null) {
            new_chart_data.asc_setSubType(chart.subType);
        }
        if (chart.type != null) {
            new_chart_data.asc_setType(chart.type);
        }
        if (chartPr.Width != null && chartPr.Height != null) {
            this.setXfrm(null, null, chartPr.Width, chartPr.Height, null, null, null);
        }
        if (chart.type != null) {
            new_chart_data.asc_setType(chart.type);
        }
        this.setAscChart(new_chart_data);
        this.recalcInfo.recalculateTransform = true;
        this.recalcInfo.recalculateTransformText = true;
        editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
    },
    OnContentReDraw: function () {
        if (isRealObject(this.parent)) {
            this.parent.OnContentReDraw();
        }
    },
    calculateAfterResize: function () {
        if (isRealObject(this.parent)) {
            this.parent.bNeedUpdateWH = true;
        }
        this.recalculate();
    },
    getFullFlipH: function () {
        if (!isRealObject(this.group)) {
            return this.flipH;
        }
        return this.group.getFullFlipH() ? !this.flipH : this.flipH;
    },
    getFullFlipV: function () {
        if (!isRealObject(this.group)) {
            return this.flipV;
        }
        return this.group.getFullFlipV() ? !this.flipV : this.flipV;
    },
    getFullRotate: function () {
        return !isRealObject(this.group) ? this.rot : this.rot + this.group.getFullRotate();
    },
    getBoundsInGroup: function () {
        return {
            minX: this.x,
            minY: this.y,
            maxX: this.x + this.extX,
            maxY: this.y + this.extY
        };
    },
    hit: function (x, y) {
        var invert_transform = this.getInvertTransform();
        var tx = invert_transform.TransformPointX(x, y);
        var ty = invert_transform.TransformPointY(x, y);
        return tx >= 0 && tx <= this.extX && ty >= 0 && ty <= this.extY;
    },
    hitInTextRect: function () {
        return false;
    },
    hitInInnerArea: function (x, y) {
        var invert_transform = this.getInvertTransform();
        var x_t = invert_transform.TransformPointX(x, y);
        var y_t = invert_transform.TransformPointY(x, y);
        if (isRealObject(this.spPr.geometry)) {
            return this.spPr.geometry.hitInInnerArea(editor.WordControl.m_oDrawingDocument.CanvasHitContext, x_t, y_t);
        }
        return x_t > 0 && x_t < this.extX && y_t > 0 && y_t < this.extY;
    },
    hitInPath: function (x, y) {
        var invert_transform = this.getInvertTransform();
        var x_t = invert_transform.TransformPointX(x, y);
        var y_t = invert_transform.TransformPointY(x, y);
        if (isRealObject(this.spPr.geometry)) {
            return this.spPr.geometry.hitInPath(editor.WordControl.m_oDrawingDocument.CanvasHitContext, x_t, y_t);
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
    setDrawingObjects: function (drawingObjects) {
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
    },
    getTransform: function () {
        return this.transform;
    },
    getHierarchy: function () {
        if (this.recalcInfo.recalculateShapeHierarchy) {
            this.compiledHierarchy.length = 0;
            var hierarchy = this.compiledHierarchy;
            if (this.isPlaceholder()) {
                var ph_type = this.getPlaceholderType();
                var ph_index = this.getPlaceholderIndex();
                var b_is_single_body = this.getIsSingleBody();
                switch (this.parent.kind) {
                case SLIDE_KIND:
                    hierarchy.push(this.parent.Layout.getMatchingShape(ph_type, ph_index, b_is_single_body));
                    hierarchy.push(this.parent.Layout.Master.getMatchingShape(ph_type, ph_index, b_is_single_body));
                    break;
                case LAYOUT_KIND:
                    hierarchy.push(this.parent.Master.getMatchingShape(ph_type, ph_index, b_is_single_body));
                    break;
                }
            }
            this.recalcInfo.recalculateShapeHierarchy = false;
        }
        return this.compiledHierarchy;
    },
    recalculatePosExt: function () {
        if (!isRealObject(this.group)) {
            if (this.spPr.xfrm.isNotNull()) {
                var xfrm = this.spPr.xfrm;
                this.x = xfrm.offX;
                this.y = xfrm.offY;
                this.extX = xfrm.extX;
                this.extY = xfrm.extY;
                this.rot = isRealNumber(xfrm.rot) ? xfrm.rot : 0;
                this.flipH = xfrm.flipH === true;
                this.flipV = xfrm.flipV === true;
            } else {
                if (this.isPlaceholder()) {
                    var hierarchy = this.getHierarchy();
                    for (var i = 0; i < hierarchy.length; ++i) {
                        var hierarchy_sp = hierarchy[i];
                        if (isRealObject(hierarchy_sp) && hierarchy_sp.spPr.xfrm.isNotNull()) {
                            var xfrm = hierarchy_sp.spPr.xfrm;
                            this.x = xfrm.offX;
                            this.y = xfrm.offY;
                            this.extX = xfrm.extX;
                            this.extY = xfrm.extY;
                            this.rot = isRealNumber(xfrm.rot) ? xfrm.rot : 0;
                            this.flipH = xfrm.flipH === true;
                            this.flipV = xfrm.flipV === true;
                            break;
                        }
                    }
                    if (i === hierarchy.length) {
                        this.x = 0;
                        this.y = 0;
                        this.extX = 5;
                        this.extY = 5;
                        this.rot = 0;
                        this.flipH = false;
                        this.flipV = false;
                    }
                } else {
                    this.x = 0;
                    this.y = 0;
                    this.extX = 5;
                    this.extY = 5;
                    this.rot = 0;
                    this.flipH = false;
                    this.flipV = false;
                }
            }
        } else {
            var xfrm;
            if (this.spPr.xfrm.isNotNull()) {
                xfrm = this.spPr.xfrm;
            } else {
                if (this.isPlaceholder()) {
                    var hierarchy = this.getHierarchy();
                    for (var i = 0; i < hierarchy.length; ++i) {
                        var hierarchy_sp = hierarchy[i];
                        if (isRealObject(hierarchy_sp) && hierarchy_sp.spPr.xfrm.isNotNull()) {
                            xfrm = hierarchy_sp.spPr.xfrm;
                            break;
                        }
                    }
                    if (i === hierarchy.length) {
                        xfrm = new CXfrm();
                        xfrm.offX = 0;
                        xfrm.offX = 0;
                        xfrm.extX = 5;
                        xfrm.extY = 5;
                    }
                } else {
                    xfrm = new CXfrm();
                    xfrm.offX = 0;
                    xfrm.offY = 0;
                    xfrm.extX = 5;
                    xfrm.extY = 5;
                }
            }
            var scale_scale_coefficients = this.group.getResultScaleCoefficients();
            this.x = scale_scale_coefficients.cx * (xfrm.offX - this.group.spPr.xfrm.chOffX);
            this.y = scale_scale_coefficients.cy * (xfrm.offY - this.group.spPr.xfrm.chOffY);
            this.extX = scale_scale_coefficients.cx * xfrm.extX;
            this.extY = scale_scale_coefficients.cy * xfrm.extY;
            this.rot = isRealNumber(xfrm.rot) ? xfrm.rot : 0;
            this.flipH = xfrm.flipH === true;
            this.flipV = xfrm.flipV === true;
        }
        this.transform.Reset();
        var hc = this.extX * 0.5;
        var vc = this.extY * 0.5;
        this.spPr.geometry.Recalculate(this.extX, this.extY);
    },
    recalculateTransform: function () {
        this.recalculatePosExt();
        this.recalculateMatrix();
    },
    getTransformMatrix: function () {
        return this.transform;
    },
    getSnapArrays: function (snapX, snapY) {
        var transform = this.getTransformMatrix();
        snapX.push(transform.tx);
        snapX.push(transform.tx + this.extX * 0.5);
        snapX.push(transform.tx + this.extX);
        snapY.push(transform.ty);
        snapY.push(transform.ty + this.extY * 0.5);
        snapY.push(transform.ty + this.extY);
    },
    setXfrm: function (offX, offY, extX, extY, rot, flipH, flipV) {
        if (this.spPr.xfrm.isNotNull()) {
            if (isRealNumber(offX) && isRealNumber(offY)) {
                this.setOffset(offX, offY);
            }
            if (isRealNumber(extX) && isRealNumber(extY)) {
                this.setExtents(extX, extY);
            }
            if (isRealNumber(rot)) {
                this.setRotate(rot);
            }
            if (isRealBool(flipH) && isRealBool(flipV)) {
                this.setFlips(flipH, flipV);
            }
        } else {
            var transform = this.getTransform();
            if (isRealNumber(offX) && isRealNumber(offY)) {
                this.setOffset(offX, offY);
            } else {
                this.setOffset(transform.x, transform.y);
            }
            if (isRealNumber(extX) && isRealNumber(extY)) {
                this.setExtents(extX, extY);
            } else {
                this.setExtents(transform.extX, transform.extY);
            }
            if (isRealNumber(rot)) {
                this.setRotate(rot);
            } else {
                this.setRotate(transform.rot);
            }
            if (isRealBool(flipH) && isRealBool(flipV)) {
                this.setFlips(flipH, flipV);
            } else {
                this.setFlips(transform.flipH, transform.flipV);
            }
        }
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
        this.setOffset(new_off_x, new_off_y);
        this.setExtents(new_ext_x, new_ext_y);
    },
    getIsSingleBody: function () {
        if (!this.isPlaceholder()) {
            return false;
        }
        if (this.getPlaceholderType() !== phType_body) {
            return false;
        }
        if (this.parent && this.parent.cSld && Array.isArray(this.parent.cSld.spTree)) {
            var sp_tree = this.parent.cSld.spTree;
            for (var i = 0; i < sp_tree.length; ++i) {
                if (sp_tree[i] !== this && sp_tree[i].getPlaceholderType && sp_tree[i].getPlaceholderType() === phType_body) {
                    return true;
                }
            }
        }
        return true;
    },
    checkNotNullTransform: function () {
        if (this.spPr.xfrm && this.spPr.xfrm.isNotNull()) {
            return true;
        }
        if (this.isPlaceholder()) {
            var ph_type = this.getPlaceholderType();
            var ph_index = this.getPlaceholderIndex();
            var b_single_body = this.getIsSingleBody();
            switch (this.parent.kind) {
            case SLIDE_KIND:
                var placeholder = this.parent.Layout.getMatchingShape(ph_type, ph_index, b_single_body);
                if (placeholder && placeholder.spPr && placeholder.spPr.xfrm && placeholder.spPr.xfrm.isNotNull()) {
                    return true;
                }
                placeholder = this.parent.Layout.Master.getMatchingShape(ph_type, ph_index, b_single_body);
                return placeholder && placeholder.spPr && placeholder.spPr.xfrm && placeholder.spPr.xfrm.isNotNull();
            case LAYOUT_KIND:
                var placeholder = this.parent.Master.getMatchingShape(ph_type, ph_index, b_single_body);
                return placeholder && placeholder.spPr && placeholder.spPr.xfrm && placeholder.spPr.xfrm.isNotNull();
            }
        }
        return false;
    },
    setRotate: function (rot) {
        var xfrm = this.spPr.xfrm;
        History.Add(this, {
            Type: historyitem_SetShapeRot,
            oldRot: xfrm.rot,
            newRot: rot
        });
        this.recalcInfo.recalculateTransform = true;
        this.recalcInfo.recalculateTransformText = true;
        xfrm.rot = rot;
        editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
    },
    setOffset: function (offX, offY) {
        History.Add(this, {
            Type: historyitem_SetShapeOffset,
            oldOffsetX: this.spPr.xfrm.offX,
            newOffsetX: offX,
            oldOffsetY: this.spPr.xfrm.offY,
            newOffsetY: offY
        });
        this.spPr.xfrm.offX = offX;
        this.spPr.xfrm.offY = offY;
        this.recalcInfo.recalculateTransform = true;
        this.recalcInfo.recalculateTransformText = true;
        editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
    },
    setExtents: function (extX, extY) {
        History.Add(this, {
            Type: historyitem_SetShapeExtents,
            oldExtentX: this.spPr.xfrm.extX,
            newExtentX: extX,
            oldExtentY: this.spPr.xfrm.extY,
            newExtentY: extY
        });
        this.spPr.xfrm.extX = extX;
        this.spPr.xfrm.extY = extY;
        this.recalcInfo.recalculateTransform = true;
        this.recalcInfo.recalculateTransformText = true;
        this.recalcInfo.recalculateGeometry = true;
        editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
    },
    setFlips: function (flipH, flipV) {
        History.Add(this, {
            Type: historyitem_SetShapeFlips,
            oldFlipH: this.spPr.xfrm.flipH,
            newFlipH: flipH,
            oldFlipV: this.spPr.xfrm.flipV,
            newFlipV: flipV
        });
        this.spPr.xfrm.flipH = flipH;
        this.spPr.xfrm.flipV = flipV;
        this.recalcInfo.recalculateTransform = true;
        this.recalcInfo.recalculateTransformText = true;
        editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
    },
    recalculateMatrix: function () {
        this.transform.Reset();
        var hc = this.extX * 0.5;
        var vc = this.extY * 0.5;
        global_MatrixTransformer.TranslateAppend(this.transform, -hc, -vc);
        if (this.flipH) {
            global_MatrixTransformer.ScaleAppend(this.transform, -1, 1);
        }
        if (this.flipV) {
            global_MatrixTransformer.ScaleAppend(this.transform, 1, -1);
        }
        global_MatrixTransformer.RotateRadAppend(this.transform, -this.rot);
        global_MatrixTransformer.TranslateAppend(this.transform, this.x + hc, this.y + vc);
        if (isRealObject(this.group)) {
            global_MatrixTransformer.MultiplyAppend(this.transform, this.group.getTransformMatrix());
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
    isEmptyPlaceholder: function () {
        return false;
    },
    calculateAfterOpen: function () {
        this.init();
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
    addXAxis: function (title) {
        var oldValue = isRealObject(this.hAxisTitle) ? this.hAxisTitle.Get_Id() : null;
        var newValue = isRealObject(title) ? title.Get_Id() : null;
        this.hAxisTitle = title;
        History.Add(this, {
            Type: historyitem_AutoShapes_AddXAxis,
            oldPr: oldValue,
            newPr: newValue
        });
        editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
    },
    addYAxis: function (title) {
        var oldValue = isRealObject(this.vAxisTitle) ? this.vAxisTitle.Get_Id() : null;
        var newValue = isRealObject(title) ? title.Get_Id() : null;
        this.vAxisTitle = title;
        if (this.vAxisTitle && this.vAxisTitle.txBody) {
            var body_pr = new CBodyPr();
            body_pr.merge(this.vAxisTitle.txBody.bodyPr);
            body_pr.vert = nVertTTvert270;
            this.vAxisTitle.setBodyPr(body_pr);
        }
        History.Add(this, {
            Type: historyitem_AutoShapes_AddYAxis,
            oldPr: oldValue,
            newPr: newValue
        });
        editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
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
        editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
    },
    draw: function (graphics, pageIndex) {
        graphics.SetIntegerGrid(false);
        graphics.transform3(this.transform, false);
        var shape_drawer = new CShapeDrawer();
        shape_drawer.fromShape2(this, graphics, this.spPr.geometry);
        shape_drawer.draw(this.spPr.geometry);
        if (locktype_None != this.Lock.Get_Type()) {
            if (locktype_None != this.Lock.Get_Type()) {
                graphics.DrawLockObjectRect(this.Lock.Get_Type(), 0, 0, this.extX, this.extY);
            }
        }
        graphics.reset();
        graphics.SetIntegerGrid(true);
        graphics.SaveGrState();
        graphics.SetIntegerGrid(false);
        graphics.transform3(this.transform);
        graphics.AddClipRect(-1, -1, this.extX + 1, this.extY + 1);
        if (this.chartTitle) {
            this.chartTitle.draw(graphics, pageIndex);
        }
        if (this.hAxisTitle) {
            this.hAxisTitle.draw(graphics, pageIndex);
        }
        if (this.vAxisTitle) {
            this.vAxisTitle.draw(graphics, pageIndex);
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
        if (isRealObject(this.chartTitle)) {
            this.chartTitle.deselect();
        }
        if (isRealObject(this.hAxisTitle)) {
            this.hAxisTitle.deselect();
        }
        if (isRealObject(this.vAxisTitle)) {
            this.vAxisTitle.deselect();
        }
        return this;
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
    hitToHandles: function (x, y) {
        var invert_transform = this.getInvertTransform();
        var t_x, t_y;
        t_x = invert_transform.TransformPointX(x, y);
        t_y = invert_transform.TransformPointY(x, y);
        var radius = this.getParentObjects().presentation.DrawingDocument.GetMMPerDot(TRACK_CIRCLE_RADIUS);
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
        return -1;
    },
    recalculate: function (updateImage) {
        try {
            if (!isRealObject(this.parent)) {
                return;
            }
            var parents = this.getParentObjects();
            this.recalculatePosExt();
            this.recalculateTransform();
            if (isRealObject(this.chartTitle)) {
                var max_title_width = this.extX * 0.8;
                var title_width = this.chartTitle.txBody.getRectWidth(max_title_width);
                this.chartTitle.extX = title_width;
                var body_pr = this.chartTitle.txBody.getBodyPr();
                this.chartTitle.extY = this.chartTitle.txBody.getRectHeight(this.extY, title_width - (body_pr.rIns + body_pr.lIns));
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
                    this.chartTitle.y = editor.WordControl.m_oDrawingDocument.GetMMPerDot(7);
                }
                this.chartTitle.recalculateTransform();
                this.chartTitle.calculateContent();
                this.chartTitle.calculateTransformTextMatrix();
            }
            if (isRealObject(this.hAxisTitle)) {
                var max_title_width = this.extX * 0.8;
                var body_pr = this.hAxisTitle.txBody.getBodyPr();
                var title_width = this.hAxisTitle.txBody.getRectWidth(max_title_width);
                this.hAxisTitle.extX = title_width;
                this.hAxisTitle.extY = this.hAxisTitle.txBody.getRectHeight(this.extY, title_width - (body_pr.rIns + body_pr.lIns));
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
            tInd = editor.WordControl.m_oDrawingDocument.GetMMPerDot(7) + (isRealObject(this.chartTitle) ? this.chartTitle.extY : 0);
            lInd = editor.WordControl.m_oDrawingDocument.GetMMPerDot(7) + (isRealObject(this.vAxisTitle) ? this.vAxisTitle.extX : 0);
            rInd = 0;
            bInd = editor.WordControl.m_oDrawingDocument.GetMMPerDot(7) + (isRealObject(this.hAxisTitle) ? this.hAxisTitle.extY : 0);
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
                    this.vAxisTitle.x = editor.WordControl.m_oDrawingDocument.GetMMPerDot(7);
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
                    this.hAxisTitle.x = ((this.extX - rInd) - (lInd + editor.WordControl.m_oDrawingDocument.GetMMPerDot(25)) - this.hAxisTitle.extX) * 0.5 + lInd + editor.WordControl.m_oDrawingDocument.GetMMPerDot(25);
                    if (this.hAxisTitle.x < lInd + editor.WordControl.m_oDrawingDocument.GetMMPerDot(25)) {
                        this.hAxisTitle.x = lInd + editor.WordControl.m_oDrawingDocument.GetMMPerDot(25);
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
                        w: editor.WordControl.m_oDrawingDocument.GetDotsPerMM(this.chartTitle.extX),
                        h: 7 + editor.WordControl.m_oDrawingDocument.GetDotsPerMM(this.chartTitle.extY)
                    };
                }
            }
            if (isRealObject(this.hAxisTitle)) {
                if (!this.hAxisTitle.overlay) {
                    xAxisTitle = {
                        w: editor.WordControl.m_oDrawingDocument.GetDotsPerMM(this.hAxisTitle.extX),
                        h: 7 + editor.WordControl.m_oDrawingDocument.GetDotsPerMM(this.hAxisTitle.extY)
                    };
                }
            }
            if (isRealObject(this.vAxisTitle)) {
                if (!this.vAxisTitle.overlay) {
                    yAxisTitle = {
                        w: 7 + editor.WordControl.m_oDrawingDocument.GetDotsPerMM(this.vAxisTitle.extX),
                        h: editor.WordControl.m_oDrawingDocument.GetDotsPerMM(this.vAxisTitle.extY)
                    };
                }
            }
            this.chart.margins = {
                key: key,
                xAxisTitle: xAxisTitle,
                yAxisTitle: yAxisTitle,
                title: title_margin
            };
            if (! (updateImage === false)) {
                var options = {
                    theme: parents.theme,
                    slide: parents.slide,
                    layout: parents.layout,
                    master: parents.master
                };
                this.brush.fill.canvas = (new ChartRender(options)).insertChart(this.chart, null, editor.WordControl.m_oDrawingDocument.GetDotsPerMM(this.extX), editor.WordControl.m_oDrawingDocument.GetDotsPerMM(this.extY), undefined, undefined, options);
                this.brush.fill.RasterImageId = "";
            }
        } catch(e) {}
    },
    getBase64Img: function () {
        return this.brush.fill.canvas.toDataURL();
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
        if (isRealObject(this.chartTitle)) {
            this.chartTitle.setType(CHART_TITLE_TYPE_TITLE);
            if (this.chartTitle.txBody) {
                this.chartTitle.txBody.content.Styles = this.chartTitle.getStyles();
            }
            if (this.chartTitle.isEmpty()) {
                if (this.chart.header && this.chart.header.bDefaultTitle) {
                    var title_str = "Chart Title";
                    this.chartTitle.setTextBody(new CTextBody(this.chartTitle));
                    for (var i in title_str) {
                        this.chartTitle.txBody.content.Paragraph_Add(CreateParagraphContent(title_str[i]), false);
                    }
                }
            } else {
                var content = this.chartTitle.txBody.content;
                content.Parent = this.chartTitle.txBody;
                content.DrawingDocument = editor.WordControl.m_oDrawingDocument;
                for (var i = 0; i < content.Content.length; ++i) {
                    content.Content[i].DrawingDocument = editor.WordControl.m_oDrawingDocument;
                    content.Content[i].Parent = content;
                }
            }
            var content = this.chartTitle.txBody.content;
            for (var i = 0; i < content.Content.length; ++i) {
                content.Content[i].Pr.PStyle = this.chartTitle.txBody.content.Styles.Style.length - 1;
            }
            this.chartTitle.txBody.content.Set_ApplyToAll(true);
            this.chartTitle.txBody.content.Set_ParagraphAlign(align_Center);
            this.chartTitle.txBody.content.Set_ApplyToAll(false);
        }
        if (isRealObject(this.hAxisTitle)) {
            this.hAxisTitle.setType(CHART_TITLE_TYPE_H_AXIS);
            this.hAxisTitle.txBody.content.Styles = this.hAxisTitle.getStyles();
            if (this.hAxisTitle.isEmpty()) {
                if (this.chart.xAxis && this.chart.xAxis.bDefaultTitle) {
                    var title_str = "X Axis";
                    this.hAxisTitle.setTextBody(new CTextBody(this.hAxisTitle));
                    for (var i in title_str) {
                        this.hAxisTitle.txBody.content.Paragraph_Add(CreateParagraphContent(title_str[i]), false);
                    }
                }
            } else {
                var content = this.hAxisTitle.txBody.content;
                content.Parent = this.hAxisTitle.txBody;
                content.DrawingDocument = editor.WordControl.m_oDrawingDocument;
                for (var i = 0; i < content.Content.length; ++i) {
                    content.Content[i].DrawingDocument = editor.WordControl.m_oDrawingDocument;
                    content.Content[i].Parent = content;
                }
            }
            var content = this.hAxisTitle.txBody.content;
            for (var i = 0; i < content.Content.length; ++i) {
                content.Content[i].Pr.PStyle = this.hAxisTitle.txBody.content.Styles.Style.length - 1;
            }
            this.hAxisTitle.txBody.content.Set_ApplyToAll(true);
            this.hAxisTitle.txBody.content.Set_ParagraphAlign(align_Center);
            this.hAxisTitle.txBody.content.Set_ApplyToAll(false);
        }
        if (isRealObject(this.vAxisTitle)) {
            this.vAxisTitle.setType(CHART_TITLE_TYPE_V_AXIS);
            this.vAxisTitle.txBody.content.Styles = this.vAxisTitle.getStyles();
            if (this.vAxisTitle.isEmpty()) {
                if (this.chart.yAxis && this.chart.yAxis.bDefaultTitle) {
                    var title_str = "Y Axis";
                    this.vAxisTitle.setTextBody(new CTextBody(this.vAxisTitle));
                    var body_pr = new CBodyPr();
                    body_pr.vert = nVertTTvert270;
                    this.vAxisTitle.setBodyPr(body_pr);
                    for (var i in title_str) {
                        this.vAxisTitle.txBody.content.Paragraph_Add(CreateParagraphContent(title_str[i]), false);
                    }
                }
            } else {
                var body_pr = new CBodyPr();
                body_pr.merge(this.vAxisTitle.txBody.bodyPr);
                body_pr.vert = nVertTTvert270;
                this.vAxisTitle.setBodyPr(body_pr);
                var content = this.vAxisTitle.txBody.content;
                content.Parent = this.vAxisTitle.txBody;
                content.DrawingDocument = editor.WordControl.m_oDrawingDocument;
                for (var i = 0; i < content.Content.length; ++i) {
                    content.Content[i].DrawingDocument = editor.WordControl.m_oDrawingDocument;
                    content.Content[i].Parent = content;
                }
            }
            var content = this.vAxisTitle.txBody.content;
            for (var i = 0; i < content.Content.length; ++i) {
                content.Content[i].Pr.PStyle = this.vAxisTitle.txBody.content.Styles.Style.length - 1;
            }
            this.vAxisTitle.txBody.content.Set_ApplyToAll(true);
            this.vAxisTitle.txBody.content.Set_ParagraphAlign(align_Center);
            this.vAxisTitle.txBody.content.Set_ApplyToAll(false);
        }
        if (is_on) {
            History.TurnOn();
        }
    },
    hitToHandle: function (x, y, radius) {
        var _radius;
        if (! (typeof radius === "number")) {
            _radius = editor.WordControl.m_oDrawingDocument.GetMMPerDot(TRACK_CIRCLE_RADIUS);
        } else {
            _radius = radius;
        }
        if (typeof global_mouseEvent.KoefPixToMM === "number" && !isNaN(global_mouseEvent.KoefPixToMM)) {
            _radius *= global_mouseEvent.KoefPixToMM;
        }
        var t_x, t_y;
        if (this.group != null) {
            var inv_t = global_MatrixTransformer.Invert(this.group.transform);
            t_x = inv_t.TransformPointX(x, y);
            t_y = inv_t.TransformPointY(x, y);
        } else {
            t_x = x;
            t_y = y;
        }
        this.calculateLeftTopPoint();
        var _temp_x = t_x - this.absXLT;
        var _temp_y = t_y - this.absYLT;
        var _sin = Math.sin(this.absRot);
        var _cos = Math.cos(this.absRot);
        var _relative_x = _temp_x * _cos + _temp_y * _sin;
        var _relative_y = -_temp_x * _sin + _temp_y * _cos;
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
            _dist_x = _relative_x - this.extX;
            if (Math.sqrt(_dist_x * _dist_x + _dist_y * _dist_y) < _radius) {
                return {
                    hit: true,
                    handleRotate: false,
                    handleNum: 2
                };
            }
            _dist_y = _relative_y - this.extY;
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
            if (this.extY >= MIN_SHAPE_DIST) {
                var _vertical_center = this.extY * 0.5;
                _dist_x = _relative_x;
                _dist_y = _relative_y - _vertical_center;
                if (Math.sqrt(_dist_x * _dist_x + _dist_y * _dist_y) < _radius) {
                    return {
                        hit: true,
                        handleRotate: false,
                        handleNum: 7
                    };
                }
                _dist_x = _relative_x - this.extX;
                if (Math.sqrt(_dist_x * _dist_x + _dist_y * _dist_y) < _radius) {
                    return {
                        hit: true,
                        handleRotate: false,
                        handleNum: 3
                    };
                }
            }
            var _horizontal_center = this.extX * 0.5;
            if (this.extX >= MIN_SHAPE_DIST) {
                _dist_x = _relative_x - _horizontal_center;
                _dist_y = _relative_y;
                if (Math.sqrt(_dist_x * _dist_x + _dist_y * _dist_y) < _radius) {
                    return {
                        hit: true,
                        handleRotate: false,
                        handleNum: 1
                    };
                }
                _dist_y = _relative_y - this.extY;
                if (Math.sqrt(_dist_x * _dist_x + _dist_y * _dist_y) < _radius) {
                    return {
                        hit: true,
                        handleRotate: false,
                        handleNum: 5
                    };
                }
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
            _dist_x = _relative_x - this.extX;
            _dist_y = _relative_y - this.extY;
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
            this.x = offsetX;
        }
        if (offsetY != null) {
            this.y = offsetY;
        }
        if (extX != null) {
            this.extX = extX;
        }
        if (extY != null) {
            this.extY = extY;
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
        return tx > 0 && tx < this.extX && ty > 0 && ty < this.extY;
    },
    canGroup: function () {
        return false;
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
    createRotateInGroupTrack: function () {
        return new RotateTrackShapeImageInGroup(this);
    },
    createResizeInGroupTrack: function (cardDirection) {
        return new ResizeTrackShapeImageInGroup(this, cardDirection);
    },
    createMoveInGroupTrack: function () {
        return new MoveShapeImageTrackInGroup(this);
    },
    createMoveTrack: function () {
        return new MoveTrackChart(this, true);
    },
    createResizeTrack: function (cardDirection) {
        return new ResizeTrackChart(this, cardDirection);
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
        var _horizontal_center = this.extX * 0.5;
        var _vertical_enter = this.extY * 0.5;
        var _sin = Math.sin(0);
        var _cos = Math.cos(0);
        this.absXLT = -_horizontal_center * _cos + _vertical_enter * _sin + this.x + _horizontal_center;
        this.absYLT = -_horizontal_center * _sin - _vertical_enter * _cos + this.y + _vertical_enter;
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
    calculateTransformTextMatrix: function () {},
    updateDrawingBaseCoordinates: function () {
        if (isRealObject(this.drawingBase)) {
            this.drawingBase.setGraphicObjectCoords();
        }
    },
    numberToCardDirection: function (handleNumber) {
        var y1, y3, y5, y7, hc, vc, numN, x1, x3, x5, x7;
        hc = this.extX * 0.5;
        vc = this.extY * 0.5;
        var t_m = this.transform;
        x1 = t_m.TransformPointX(hc, 0);
        x3 = t_m.TransformPointX(this.extX, vc);
        x5 = t_m.TransformPointX(hc, this.extY);
        x7 = t_m.TransformPointX(0, vc);
        y1 = t_m.TransformPointY(hc, 0);
        y3 = t_m.TransformPointY(this.extX, vc);
        y5 = t_m.TransformPointY(hc, this.extY);
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
        if ((x5 - x1) * (y3 - y7) - (y5 - y1) * (x3 - x7) >= 0) {
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
        hc = this.extX * 0.5;
        vc = this.extY * 0.5;
        sin = Math.sin(this.absRot);
        cos = Math.cos(this.absRot);
        y1 = -cos * vc;
        y3 = sin * hc;
        y5 = cos * vc;
        y7 = -sin * hc;
        var t_m = this.transform;
        x1 = t_m.TransformPointX(hc, 0);
        x3 = t_m.TransformPointX(this.extX, vc);
        x5 = t_m.TransformPointX(hc, this.extY);
        x7 = t_m.TransformPointX(0, vc);
        y1 = t_m.TransformPointY(hc, 0);
        y3 = t_m.TransformPointY(this.extX, vc);
        y5 = t_m.TransformPointY(hc, this.extY);
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
        if ((x5 - x1) * (y3 - y7) - (y5 - y1) * (x3 - x7) >= 0) {
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
    Refresh_RecalcData: function () {},
    Refresh_RecalcData2: function () {},
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
        this.chart.Read_FromBinary2(r);
        this.spPr.xfrm.Read_FromBinary2(r);
        if (isRealObject(this.parent)) {
            this.parent.Extent.W = this.spPr.xfrm.extX;
            this.parent.Extent.H = this.spPr.xfrm.extY;
        }
        this.init();
    },
    isPlaceholder: function () {
        return isRealObject(this.nvSpPr) && isRealObject(this.nvSpPr.nvPr) && isRealObject(this.nvSpPr.nvPr.ph);
    },
    getPlaceholderType: function () {
        return this.isPlaceholder() ? this.nvSpPr.nvPr.ph.type : null;
    },
    getPlaceholderIndex: function () {
        return this.isPlaceholder() ? this.nvSpPr.nvPr.ph.idx : null;
    },
    getPhType: function () {
        return this.isPlaceholder() ? this.nvSpPr.nvPr.ph.type : null;
    },
    getPhIndex: function () {
        return this.isPlaceholder() ? this.nvSpPr.nvPr.ph.idx : null;
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
    setChartBinary: function (binary) {
        var r = CreateBinaryReader(binary, 0, binary.length);
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
        var chart = new asc_CChart();
        chart.Read_FromBinary2(r, true);
        this.setAscChart(chart);
        var spPr = new CSpPr();
        spPr.Read_FromBinary2(r);
        this.setSpPr(spPr);
        this.init();
        this.recalculate();
    },
    copy: function (parent, group) {
        var _group = isRealObject(group) ? group : null;
        if (isRealObject(_group)) {
            this.setGroup(_group);
        }
        var c = new CChartAsGroup(parent, editor.WordControl.m_oLogicDocument, editor.WordControl.m_oDrawingDocument, _group);
        c.setChartBinary(this.getChartBinary());
        return c;
    },
    setParent: function (parent) {
        History.Add(this, {
            Type: historyitem_SetShapeParent,
            Old: this.parent,
            New: parent
        });
        this.parent = parent;
    },
    setGroup: function (group) {
        History.Add(this, {
            Type: historyitem_SetSpGroup,
            oldPr: this.group,
            newPr: group
        });
        this.group = group;
    },
    setSpPr: function (spPr) {
        History.Add(this, {
            Type: historyitem_SetSetSpPr,
            oldPr: this.spPr,
            newPr: spPr
        });
        this.spPr = spPr;
    },
    Undo: function (data) {
        switch (data.Type) {
        case historyitem_SetShapeRot:
            this.spPr.xfrm.rot = data.oldRot;
            this.recalcInfo.recalculateTransform = true;
            this.recalcInfo.recalculateTransformText = true;
            break;
        case historyitem_SetShapeOffset:
            this.spPr.xfrm.offX = data.oldOffsetX;
            this.spPr.xfrm.offY = data.oldOffsetY;
            this.recalcInfo.recalculateTransform = true;
            this.recalcInfo.recalculateTransformText = true;
            break;
        case historyitem_SetShapeExtents:
            this.spPr.xfrm.extX = data.oldExtentX;
            this.spPr.xfrm.extY = data.oldExtentY;
            this.recalcInfo.recalculateTransform = true;
            this.recalcInfo.recalculateTransformText = true;
            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateGeometry = true;
            break;
        case historyitem_SetShapeFlips:
            this.spPr.xfrm.flipH = data.oldFlipH;
            this.spPr.xfrm.flipV = data.oldFlipV;
            this.recalcInfo.recalculateTransform = true;
            this.recalcInfo.recalculateTransformText = true;
            this.recalcInfo.recalculateContent = true;
            break;
        case historyitem_SetShapeSetFill:
            if (isRealObject(data.oldFill)) {
                this.spPr.Fill = data.oldFill.createDuplicate();
            } else {
                this.spPr.Fill = null;
            }
            this.recalcInfo.recalculateFill = true;
            this.recalcInfo.recalculateBrush = true;
            this.recalcInfo.recalculateTransparent = true;
            break;
        case historyitem_SetShapeSetLine:
            if (isRealObject(data.oldLine)) {
                this.spPr.ln = data.oldLine.createDuplicate();
            } else {
                this.spPr.ln = null;
            }
            this.recalcInfo.recalculateLine = true;
            this.recalcInfo.recalculatePen = true;
            editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
            break;
        case historyitem_SetShapeSetGeometry:
            if (isRealObject(data.oldGeometry)) {
                this.spPr.geometry = data.oldGeometry.createDuplicate();
                this.spPr.geometry.Init(5, 5);
            } else {
                this.spPr.geometry = null;
            }
            this.recalcInfo.recalculateGeometry = true;
            break;
        case historyitem_SetShapeBodyPr:
            this.txBody.bodyPr = data.oldBodyPr.createDuplicate();
            this.txBody.recalcInfo.recalculateBodyPr = true;
            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransformText = true;
            break;
        case historyitem_SetSpGroup:
            this.group = data.oldPr;
            break;
        case historyitem_SetShapeParent:
            this.parent = data.Old;
            break;
        case historyitem_AutoShapes_AddChart:
            this.chart = data.oldPr;
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
        case historyitem_SetSetSpPr:
            this.spPr = data.oldPr;
            break;
        }
        editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
        if (!this.parent) {
            delete editor.WordControl.m_oLogicDocument.recalcMap[this.Id];
        }
    },
    Redo: function (data) {
        switch (data.Type) {
        case historyitem_SetShapeRot:
            this.spPr.xfrm.rot = data.newRot;
            this.recalcInfo.recalculateTransform = true;
            this.recalcInfo.recalculateTransformText = true;
            break;
        case historyitem_SetShapeOffset:
            this.spPr.xfrm.offX = data.newOffsetX;
            this.spPr.xfrm.offY = data.newOffsetY;
            this.recalcInfo.recalculateTransform = true;
            this.recalcInfo.recalculateTransformText = true;
            break;
        case historyitem_SetShapeExtents:
            this.spPr.xfrm.extX = data.newExtentX;
            this.spPr.xfrm.extY = data.newExtentY;
            this.recalcInfo.recalculateTransform = true;
            this.recalcInfo.recalculateTransformText = true;
            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateGeometry = true;
            break;
        case historyitem_SetShapeFlips:
            this.spPr.xfrm.flipH = data.newFlipH;
            this.spPr.xfrm.flipV = data.newFlipV;
            this.recalcInfo.recalculateTransform = true;
            this.recalcInfo.recalculateTransformText = true;
            this.recalcInfo.recalculateContent = true;
            break;
        case historyitem_SetShapeSetFill:
            if (isRealObject(data.newFill)) {
                this.spPr.Fill = data.newFill.createDuplicate();
            }
            this.recalcInfo.recalculateFill = true;
            this.recalcInfo.recalculateBrush = true;
            this.recalcInfo.recalculateTransparent = true;
            break;
        case historyitem_SetShapeSetLine:
            if (isRealObject(data.newLine)) {
                this.spPr.ln = data.newLine.createDuplicate();
            } else {
                this.spPr.ln = null;
            }
            this.recalcInfo.recalculateLine = true;
            this.recalcInfo.recalculatePen = true;
            break;
        case historyitem_SetShapeSetGeometry:
            if (isRealObject(data.newGeometry)) {
                this.spPr.geometry = data.newGeometry.createDuplicate();
                this.spPr.geometry.Init(5, 5);
            } else {
                this.spPr.geometry = null;
            }
            this.recalcInfo.recalculateGeometry = true;
            break;
        case historyitem_SetShapeBodyPr:
            this.txBody.bodyPr = data.newBodyPr.createDuplicate();
            this.txBody.recalcInfo.recalculateBodyPr = true;
            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransformText = true;
            break;
        case historyitem_SetSpGroup:
            this.group = data.newPr;
            break;
        case historyitem_SetShapeParent:
            this.parent = data.New;
            break;
        case historyitem_AutoShapes_AddChart:
            this.chart = data.newPr;
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
        case historyitem_SetSetSpPr:
            this.spPr = data.newPr;
            break;
        }
        editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
    },
    Save_Changes: function (data, w) {
        w.WriteLong(historyitem_type_Shape);
        w.WriteLong(data.Type);
        var bool;
        switch (data.Type) {
        case historyitem_SetShapeRot:
            w.WriteDouble(data.newRot);
            break;
        case historyitem_SetShapeOffset:
            w.WriteDouble(data.newOffsetX);
            w.WriteDouble(data.newOffsetY);
            w.WriteBool(isRealObject(editor) && isRealObject(editor.WordControl) && isRealObject(editor.WordControl.m_oLogicDocument));
            if (isRealObject(editor) && isRealObject(editor.WordControl) && isRealObject(editor.WordControl.m_oLogicDocument)) {
                w.WriteDouble(editor.WordControl.m_oLogicDocument.Width);
                w.WriteDouble(editor.WordControl.m_oLogicDocument.Height);
            }
            break;
        case historyitem_SetShapeExtents:
            w.WriteDouble(data.newExtentX);
            w.WriteDouble(data.newExtentY);
            w.WriteBool(isRealObject(editor) && isRealObject(editor.WordControl) && isRealObject(editor.WordControl.m_oLogicDocument));
            if (isRealObject(editor) && isRealObject(editor.WordControl) && isRealObject(editor.WordControl.m_oLogicDocument)) {
                w.WriteDouble(editor.WordControl.m_oLogicDocument.Width);
                w.WriteDouble(editor.WordControl.m_oLogicDocument.Height);
            }
            break;
        case historyitem_SetShapeFlips:
            w.WriteBool(data.newFlipH);
            w.WriteBool(data.newFlipV);
            break;
        case historyitem_SetShapeSetFill:
            w.WriteBool(isRealObject(data.newFill));
            if (isRealObject(data.newFill)) {
                data.newFill.Write_ToBinary2(w);
            }
            break;
        case historyitem_SetShapeSetLine:
            w.WriteBool(isRealObject(data.newLine));
            if (isRealObject(data.newLine)) {
                data.newLine.Write_ToBinary2(w);
            }
            break;
        case historyitem_SetShapeSetGeometry:
            w.WriteBool(isRealObject(data.newGeometry));
            if (isRealObject(data.newGeometry)) {
                data.newGeometry.Write_ToBinary2(w);
            }
            break;
        case historyitem_SetShapeBodyPr:
            data.newBodyPr.Write_ToBinary2(w);
            break;
        case historyitem_SetSpGroup:
            w.WriteBool(isRealObject(data.newPr));
            if (isRealObject(data.newPr)) {
                w.WriteString2(data.newPr.Get_Id());
            }
            break;
        case historyitem_SetShapeParent:
            w.WriteBool(isRealObject(data.New));
            if (isRealObject(data.New)) {
                w.WriteString2(data.New.Id);
            }
            break;
        case historyitem_AutoShapes_AddChart:
            w.WriteBool(isRealObject(data.newPr));
            if (isRealObject(data.newPr)) {
                data.newPr.Write_ToBinary2(w);
            }
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
        }
    },
    Load_Changes: function (r) {
        if (r.GetLong() === historyitem_type_Shape) {
            switch (r.GetLong()) {
            case historyitem_SetShapeRot:
                this.spPr.xfrm.rot = r.GetDouble();
                this.recalcInfo.recalculateTransform = true;
                this.recalcInfo.recalculateTransformText = true;
                break;
            case historyitem_SetShapeOffset:
                this.spPr.xfrm.offX = r.GetDouble();
                this.spPr.xfrm.offY = r.GetDouble();
                if (r.GetBool()) {
                    var p_width = r.GetDouble();
                    var p_height = r.GetDouble();
                    if (isRealObject(editor) && isRealObject(editor.WordControl) && isRealObject(editor.WordControl.m_oLogicDocument)) {
                        var kw = editor.WordControl.m_oLogicDocument.Width / p_width;
                        var kh = editor.WordControl.m_oLogicDocument.Height / p_height;
                        this.spPr.xfrm.offX *= kw;
                        this.spPr.xfrm.offY *= kh;
                    }
                }
                this.recalcInfo.recalculateTransform = true;
                this.recalcInfo.recalculateTransformText = true;
                break;
            case historyitem_SetShapeExtents:
                this.spPr.xfrm.extX = r.GetDouble();
                this.spPr.xfrm.extY = r.GetDouble();
                if (r.GetBool()) {
                    var p_width = r.GetDouble();
                    var p_height = r.GetDouble();
                    if (isRealObject(editor) && isRealObject(editor.WordControl) && isRealObject(editor.WordControl.m_oLogicDocument)) {
                        var kw = editor.WordControl.m_oLogicDocument.Width / p_width;
                        var kh = editor.WordControl.m_oLogicDocument.Height / p_height;
                        this.spPr.xfrm.extX *= kw;
                        this.spPr.xfrm.extY *= kh;
                    }
                }
                this.recalcInfo.recalculateTransform = true;
                this.recalcInfo.recalculateTransformText = true;
                this.recalcInfo.recalculateContent = true;
                this.recalcInfo.recalculateGeometry = true;
                break;
            case historyitem_SetShapeFlips:
                this.spPr.xfrm.flipH = r.GetBool();
                this.spPr.xfrm.flipV = r.GetBool();
                this.recalcInfo.recalculateTransform = true;
                this.recalcInfo.recalculateTransformText = true;
                this.recalcInfo.recalculateContent = true;
                break;
            case historyitem_SetShapeSetFill:
                if (r.GetBool()) {
                    this.spPr.Fill = new CUniFill();
                    this.spPr.Fill.Read_FromBinary2(r);
                }
                this.recalcInfo.recalculateFill = true;
                this.recalcInfo.recalculateBrush = true;
                this.recalcInfo.recalculateTransparent = true;
                break;
            case historyitem_SetShapeSetLine:
                if (r.GetBool()) {
                    this.spPr.ln = new CLn();
                    this.spPr.ln.Read_FromBinary2(r);
                }
                this.recalcInfo.recalculateLine = true;
                this.recalcInfo.recalculatePen = true;
                break;
            case historyitem_SetShapeSetGeometry:
                if (r.GetBool()) {
                    this.spPr.geometry = new Geometry();
                    this.spPr.geometry.Read_FromBinary2(r);
                    this.spPr.geometry.Init(5, 5);
                } else {
                    this.spPr.geometry = null;
                }
                this.recalcInfo.recalculateGeometry = true;
                break;
            case historyitem_SetShapeBodyPr:
                this.txBody.bodyPr = new CBodyPr();
                this.txBody.bodyPr.Read_FromBinary2(r);
                this.txBody.recalcInfo.recalculateBodyPr = true;
                this.recalcInfo.recalculateContent = true;
                this.recalcInfo.recalculateTransformText = true;
                break;
            case historyitem_SetSpGroup:
                if (r.GetBool()) {
                    this.group = g_oTableId.Get_ById(r.GetString2());
                } else {
                    this.group = null;
                }
                break;
            case historyitem_SetShapeParent:
                if (r.GetBool()) {
                    this.parent = g_oTableId.Get_ById(r.GetString2());
                }
                break;
            case historyitem_AutoShapes_AddChart:
                if (r.GetBool()) {
                    this.chart = new asc_CChart();
                    this.chart.Read_FromBinary2(r);
                } else {
                    this.chart = null;
                }
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
            }
            editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
        }
        if (!this.parent) {
            delete editor.WordControl.m_oLogicDocument.recalcMap[this.Id];
        }
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